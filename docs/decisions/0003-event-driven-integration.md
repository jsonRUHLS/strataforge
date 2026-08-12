# ADR-0003: Use Kafka and a Transactional Outbox for Event-Driven Integration

> Status: Accepted  
> Date: 2026-08-12

## Context

StrataForge will use PostgreSQL as the authoritative owner of structured transactional state, while MongoDB, ClickHouse, Grafana, and a graph store serve specialized or derived responsibilities.

Several StrataForge workflows require downstream processing after a canonical business change:

- A catalog technology or compatibility relationship is updated.
- A user saves a comparison.
- A curated Atlas blueprint is created.
- A user modifies a Composer stack.
- An AI Studio generation begins, progresses, completes, or fails.
- A blueprint document must be created or revised.
- A graph relationship projection must be updated.
- Product analytics and operational metrics must be recorded.
- A browser must receive a real-time completion or progress update.

Direct synchronous integration from the Next.js application to every downstream system would tightly couple independent workloads. It would also make retries, observability, replay, and partial-failure recovery difficult.

A direct dual-write approach is unreliable:

```text
Application writes PostgreSQL state
→ Application publishes Kafka event

Possible failure:
PostgreSQL write succeeds
Kafka publish fails

Result:
Canonical state changed, but downstream systems never receive the event.
```

StrataForge needs reliable publication of meaningful domain events after canonical data changes.

## Decision

StrataForge will use:

- PostgreSQL as the canonical transactional source of business state.
- A PostgreSQL transactional outbox for canonical writes that publish events.
- Kafka as the durable event transport and replay mechanism.
- Versioned, schema-validated domain-event contracts.
- Idempotent consumers for all asynchronous processing.
- Bounded retries and a dead-letter path for consumer failures.
- Correlation IDs for tracing workflows across services and projections.

The Next.js web application will issue commands and queries. It will not directly operate Kafka consumers, projection workers, or long-running event-processing workflows.

A future `apps/event-worker` application will publish outbox records and run asynchronous consumers.

## Decision summary

```text
Canonical command
→ PostgreSQL transaction
  ├── Write business state
  └── Write outbox event
→ Commit
→ Outbox publisher
→ Kafka
→ Independent idempotent consumers
```

## Event responsibilities

### PostgreSQL

PostgreSQL owns:

```text
Canonical transactional state
Transactional outbox records
Aggregate versions where needed
User and organization ownership
Authorization-scoped project state
```

### Transactional outbox

The outbox owns:

```text
Pending event records
Event publication status
Publishing attempts
Failure metadata
Event payload snapshots
```

### Kafka

Kafka owns:

```text
Durable event transport
Consumer-group coordination
Replayable event history
Topic-level retention
Asynchronous integration boundaries
```

Kafka does not own canonical product state.

### Event workers

Event workers own:

```text
Outbox publishing
Kafka consuming
Idempotency checks
Retries
Dead-letter processing
Projection updates
Asynchronous workflow orchestration
```

### Derived consumers

Consumers may create:

```text
MongoDB document projections
Graph relationship projections
ClickHouse analytical records
Grafana-visible health metrics
Server-Sent Event progress notifications
```

Derived consumers must not become authoritative owners of canonical domain state.

## Event contract

All domain events must use the shared event envelope defined in `packages/schemas`.

```ts
export type DomainEvent<TPayload> = {
  id: string;
  type: string;
  version: number;

  occurredAt: string;
  producer: string;

  aggregate: {
    type: string;
    id: string;
    version?: number;
  };

  correlationId: string;
  causationId?: string;

  actor?: {
    type: "user" | "system" | "ai";
    id?: string;
  };

  payload: TPayload;
};
```

Every event must include:

| Field | Requirement |
|---|---|
| Event ID | Globally unique and stable |
| Event type | Domain-oriented, past-tense, versioned contract |
| Event version | Integer schema version |
| Occurrence timestamp | Time the business fact occurred |
| Producer | Service or worker that emitted the event |
| Aggregate identity | Aggregate type and UUID |
| Correlation ID | Present for all user and workflow actions |
| Payload | Validated against a shared schema |

## Event naming

Events use domain-oriented names:

```text
catalog.technology.updated.v1
catalog.scenario.published.v1
compatibility.relationship.updated.v1

compare.saved.v1
compare.recommendation.accepted.v1

atlas.blueprint.created.v1
atlas.blueprint.updated.v1
atlas.blueprint.validated.v1

composer.stack.updated.v1
composer.compatibility.failed.v1
composer.override.recorded.v1

ai.generation.started.v1
ai.generation.progressed.v1
ai.generation.completed.v1
ai.generation.failed.v1

projection.graph.completed.v1
projection.document.failed.v1
```

Events must communicate meaningful product facts.

Avoid generic implementation events:

```text
row.updated.v1
record.changed.v1
database.write.completed.v1
```

## Topic design

Kafka topics will be domain-oriented and versioned.

```text
strataforge.catalog-events.v1
strataforge.compatibility-events.v1
strataforge.compare-events.v1
strataforge.blueprint-events.v1
strataforge.composer-events.v1
strataforge.ai-events.v1
strataforge.user-events.v1
strataforge.projection-events.v1
strataforge.dead-letter-events.v1
```

Topic names support routing and operational ownership. The event envelope remains the authoritative source for the individual event type and schema version.

## Canonical command flow

A command that changes canonical state follows this pattern:

```text
User action
  ↓
Next.js route handler or server action
  ↓
Application command handler
  ↓
Authorization and domain validation
  ↓
PostgreSQL transaction
  ├── Write aggregate state
  └── Insert outbox event
          ↓
Transaction commits
          ↓
Return confirmed canonical result to user
          ↓
Outbox publisher reads pending event
          ↓
Kafka publication
          ↓
Consumers update derived systems
```

### Example: save a blueprint

```text
User saves a Composer blueprint
  ↓
Blueprint command handler validates selections
  ↓
PostgreSQL stores Blueprint and BlueprintLayer records
  ↓
PostgreSQL stores atlas.blueprint.created outbox event
  ↓
Transaction commits
  ↓
User receives saved blueprint response
  ↓
Outbox publisher sends event to Kafka
  ↓
MongoDB stores rich blueprint document
Graph worker updates selected-technology relationships
ClickHouse stores analytical event
Notification service sends ready/progress update if required
```

## Idempotency

Kafka delivery should be treated as at-least-once.

A consumer may receive the same event multiple times because of retries, worker restarts, partition reassignment, timeouts, or acknowledgement failure.

Every consumer must be idempotent.

```text
Consumer receives event
  ↓
Check whether event ID has already been processed
  ├── Already processed → acknowledge without repeating work
  └── Not processed
        ↓
     Apply side effect or projection
        ↓
     Record event as processed
        ↓
     Acknowledge
```

### Idempotency examples

| Consumer | Idempotency approach |
|---|---|
| ClickHouse ingestor | Preserve unique `event_id` and deduplicate analytically where needed |
| MongoDB projection | Store source event ID or aggregate version with projected document |
| Graph projection | Store projection event ID or aggregate version |
| Notification worker | Deduplicate by event ID and authorized recipient |
| External integration worker | Store idempotency key before sending side effect |

## Ordering

Kafka ordering is guaranteed only within a partition.

Events that require ordering for a single aggregate must use the aggregate UUID as the Kafka message key.

```text
Message key:
Blueprint UUID

Result:
All events for that Blueprint remain ordered in one partition.
```

StrataForge must not assume global ordering across:

```text
Different topics
Different partitions
Different aggregates
Different consumer groups
```

Consumers should use aggregate version checks where stale updates would create an invalid projection.

## Retry strategy

Consumers must use bounded retries for transient failures.

```text
Initial processing attempt
  ↓ failure
Retry with bounded delay
  ↓ failure
Retry with bounded backoff
  ↓ failure
Publish failure record to dead-letter topic
  ↓
Alert and investigate
```

### Retryable failures

```text
Network timeout
Temporary database outage
Temporary AI-provider failure
Rate limit
Managed-service maintenance window
```

### Non-retryable failures

```text
Unsupported event version
Invalid payload schema
Required data permanently unavailable
Unauthorized operation
Invalid projection configuration
Serialization failure
```

## Dead-letter handling

StrataForge will maintain a dead-letter topic:

```text
strataforge.dead-letter-events.v1
```

A dead-letter record must include:

```text
Original event ID
Original event type and version
Original topic and partition
Consumer name
Failure category
Redacted failure message
Retry count
Failure timestamp
Correlation ID
```

Dead-letter records must not contain secrets, credentials, tokens, or unredacted private payload content.

Dead-letter handling is required before critical asynchronous workflows are considered production-ready.

## Projection rules

Projections consume events independently.

### MongoDB document projection

```text
Blueprint event
→ Create or update rich blueprint document
→ Preserve source event ID and aggregate version
→ Emit projection result event if needed
```

### Graph projection

```text
Catalog or compatibility event
→ Upsert nodes and relationships
→ Preserve projection metadata
→ Support relationship traversal and recommendation explanations
```

### ClickHouse analytics projection

```text
Domain or user event
→ Sanitize event payload
→ Append analytical event record
→ Aggregate into materialized views
→ Feed Grafana dashboards
```

### Real-time notification projection

```text
Workflow lifecycle event
→ Resolve authorized recipient
→ Deliver Server-Sent Event update
→ Browser updates progress state
```

A projection failure must not roll back a completed PostgreSQL transaction. It must be retried, observed, and recoverable through replay or reconciliation.

## MongoDB change-stream events

MongoDB may publish document lifecycle events to Kafka through change streams.

These events are distinct from canonical business events.

```text
Canonical event:
atlas.blueprint.created.v1

Document projection event:
atlas.document.projected.v1
```

MongoDB must not republish the canonical business event merely because a derived document changed.

## Real-time updates

Initial real-time events include:

```text
ai.generation.started.v1
ai.generation.progressed.v1
ai.generation.completed.v1
ai.generation.failed.v1

atlas.blueprint.validation.started.v1
atlas.blueprint.validation.completed.v1

composer.compatibility.checked.v1
composer.compatibility.failed.v1
```

Initial transport:

```text
Kafka
→ notification consumer
→ authorization check
→ Server-Sent Event gateway
→ browser client
```

Server-Sent Events are preferred initially because progress delivery is primarily one-way.

WebSockets are deferred until bidirectional live collaboration is required.

## Schema evolution

Event payload schemas are shared contracts.

They will be defined in:

```text
packages/schemas
```

### Compatible changes

A new optional field may be added without changing the event version when existing consumers can safely ignore it.

```ts
payload: {
  blueprintId: string;
  scenarioId?: string;
}
```

### Breaking changes

A new event version is required when changing:

```text
Required fields
Field names
Field types
Field meaning
Payload structure
Authorization semantics
```

Example:

```text
atlas.blueprint.created.v1
atlas.blueprint.created.v2
```

Consumers must explicitly support the versions they process.

## Observability

The eventing system must expose enough information to answer:

```text
Was the event written to the outbox?
Was it published to Kafka?
Which consumers received it?
How long did processing take?
Did processing fail or retry?
Was it sent to dead-letter handling?
Can the affected projection be rebuilt?
Which user action caused the event?
```

Initial operational metrics:

```text
Pending outbox count
Outbox publish latency
Kafka producer failures
Consumer lag by consumer group
Consumer processing duration
Consumer retry count
Dead-letter event count
Projection success and failure rates
Real-time notification delivery failures
```

Correlation IDs must be visible in logs, event metadata, and analytical records where appropriate.

## Consequences

### Positive

- Canonical writes and downstream event publication become reliable.
- The web application is decoupled from projections and analytics.
- MongoDB, ClickHouse, graph, and notification consumers can evolve independently.
- Event replay can rebuild derived projections.
- AI-generation and blueprint workflows can report progress asynchronously.
- Consumer failures are isolated from successful canonical writes.
- Event flow becomes measurable through Kafka, ClickHouse, and Grafana.

### Tradeoffs

- The system must handle eventual consistency in projections.
- Event schema versioning requires governance.
- Consumers require idempotency and retry logic.
- Kafka introduces operational complexity.
- Debugging requires correlation IDs and distributed tracing discipline.
- Dead-letter records and replay workflows require operational procedures.

## Alternatives considered

### Direct synchronous calls to every downstream system

**Not selected.**

This would tightly couple the web application to MongoDB, graph, analytics, notifications, and external providers. Failures in a non-critical projection could prevent a successful user write.

### Direct PostgreSQL and Kafka dual writes

**Not selected.**

This creates an unavoidable partial-failure window between the database write and event publication.

### PostgreSQL polling without Kafka

**Not selected as the target architecture.**

Polling can support simple background work, but it does not provide durable domain-event transport, consumer groups, replay, topic retention, or clear integration boundaries for the planned platform.

### Database triggers as the event source

**Not selected.**

Database triggers can hide business behavior and make event payload ownership, testing, and application-level versioning more difficult. The transactional outbox keeps event creation explicit in the command flow.

### Use MongoDB change streams for all events

**Not selected.**

MongoDB change streams are appropriate for MongoDB document lifecycle events. PostgreSQL remains the canonical owner for transactional state, so canonical domain events must originate from the PostgreSQL outbox.

## Implementation sequence

### Phase 1: Event contracts

```text
- Add shared event envelope.
- Define initial Zod event payload schemas.
- Define topic names and message-key rules.
- Add event contract tests.
```

### Phase 2: Transactional outbox

```text
- Add PostgreSQL outbox table.
- Add outbox repository functions.
- Add event publisher worker.
- Publish initial catalog and blueprint events.
```

### Phase 3: Consumer foundation

```text
- Add event-worker application.
- Add idempotency storage or aggregate-version controls.
- Add bounded retry behavior.
- Add dead-letter topic and failure records.
```

### Phase 4: First projections

```text
- Add ClickHouse event ingestion.
- Add Grafana event-pipeline dashboard.
- Add one MongoDB or graph projection.
- Validate replay and reconciliation procedures.
```

### Phase 5: Real-time workflows

```text
- Add Server-Sent Event notification gateway.
- Publish AI Studio and Composer progress events.
- Add user-visible failure and recovery states.
```

## Related documents

- [Architecture overview](../architecture/overview.md)
- [System context](../architecture/system-context.md)
- [Application architecture](../architecture/application-architecture.md)
- [Domain model](../architecture/domain-model.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [ADR index](README.md)
- [ADR-0001: Monorepo and package boundaries](0001-monorepo-and-package-boundaries.md)
- [ADR-0002: Polyglot data architecture](0002-polyglot-data-architecture.md)
# Eventing Model

> Status: Proposed  
> Last updated: 2026-08-12

This document defines the target event-driven integration model for StrataForge.

Kafka will be the durable event backbone for publishing domain events, updating projections, recording analytics, and delivering real-time progress to users. The eventing model is designed to keep PostgreSQL transactional writes reliable while allowing MongoDB documents, graph relationships, ClickHouse analytics, and user-facing notifications to evolve independently.

This is a target architecture. Kafka, the transactional outbox, event workers, and projections are not yet implemented.

For data ownership, see [Data platform](data-platform.md). For core business concepts, see [Domain model](domain-model.md).

## Goals

The eventing model should:

- Publish business events reliably after canonical state changes.
- Decouple the web application from analytics, graph, document, and notification processing.
- Allow derived projections to be rebuilt through event replay.
- Support asynchronous workflows such as AI generation and blueprint validation.
- Provide traceability across one user request and its downstream processing.
- Preserve event compatibility through versioned contracts.
- Make failures, retries, consumer lag, and dead-letter activity observable.
- Support idempotent processing when events are delivered more than once.

## Non-goals

The eventing system should not:

- Replace synchronous request/response queries for ordinary user interactions.
- Become a generic logging sink for arbitrary application logs.
- Publish database-row changes as the public domain contract.
- Expose credentials, private source code, raw secrets, or unnecessary user content.
- Allow consumers to become authoritative owners of canonical transactional state.
- Require every feature to be asynchronous.

## Core concepts

### Domain event

A domain event is a record that a meaningful business fact occurred.

Examples:

```text
atlas.blueprint.created.v1
compatibility.relationship.updated.v1
ai.generation.completed.v1
```

A domain event is not:

```text
blueprints-table-row-updated
technology-record-modified
database-write-completed
```

### Aggregate

An aggregate is a business entity with meaningful lifecycle events.

Initial StrataForge aggregates include:

```text
Technology
Scenario
CompatibilityRelationship
SavedComparison
Blueprint
GenerationRequest
```

### Producer

A producer creates and publishes events.

Initial producers:

```text
PostgreSQL outbox publisher
MongoDB change-stream connector
AI-generation worker
Graph projection worker
Real-time notification service
```

### Consumer

A consumer receives events and performs an independent responsibility.

Initial consumers:

```text
MongoDB document projection worker
Graph projection worker
ClickHouse analytics ingestor
Real-time notification gateway
Observability and failure-monitoring worker
```

### Projection

A projection is a derived representation of canonical state or event history.

Examples:

```text
MongoDB blueprint document
Graph technology relationship
ClickHouse event-log row
Grafana dashboard metric
Search-index document
```

Projections must be rebuildable and must not become authoritative owners of business state.

## Event contract

Every event must use a shared, versioned envelope.

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

### Required fields

| Field | Purpose |
|---|---|
| `id` | Unique event ID used for idempotency and tracing |
| `type` | Stable event name, such as `atlas.blueprint.created` |
| `version` | Contract version for safe event evolution |
| `occurredAt` | Timestamp when the business fact occurred |
| `producer` | Service or worker that emitted the event |
| `aggregate.type` | Aggregate category, such as `Blueprint` |
| `aggregate.id` | Stable UUID for the aggregate |
| `correlationId` | Identifier shared by one user action or workflow |
| `causationId` | Upstream event that caused this event, when applicable |
| `actor` | User, AI, or system responsible for initiating the action |
| `payload` | Schema-validated event-specific data |

### Example event

```ts
export const AtlasBlueprintCreatedEvent = {
  id: "a8a0b5d4-6055-49eb-a62d-72316f4f1b47",
  type: "atlas.blueprint.created",
  version: 1,

  occurredAt: "2026-08-12T23:00:00.000Z",
  producer: "strataforge-api",

  aggregate: {
    type: "Blueprint",
    id: "64df806b-59c7-4025-896f-4e48190df871",
    version: 1,
  },

  correlationId: "9e6a4f94-d1da-4e32-a64f-fae9ef5c7051",

  actor: {
    type: "user",
    id: "7b13cb61-ff19-401e-a97f-cd6e7083da60",
  },

  payload: {
    blueprintId: "64df806b-59c7-4025-896f-4e48190df871",
    scenarioId: "1c4e46f1-0bb4-4e98-b27f-e7c010db5f29",
    mode: "curated",
    sourceClassification: "curated",
  },
};
```

## Event naming

Event names use this format:

```text
<domain>.<aggregate-or-action>.<past-tense-event>
```

The version is stored as a separate integer field.

Examples:

```text
catalog.technology.updated
catalog.scenario.published
compatibility.relationship.updated

compare.saved
compare.recommendation.accepted

atlas.blueprint.created
atlas.blueprint.updated
atlas.blueprint.validated

composer.stack.updated
composer.compatibility.failed
composer.override.recorded

ai.generation.started
ai.generation.progressed
ai.generation.completed
ai.generation.failed

projection.graph.completed
projection.document.failed
```

Topics may include a version in their names:

```text
strataforge.catalog-events.v1
strataforge.blueprint-events.v1
```

The event type and event version remain the authoritative contract identifiers.

## Topic design

Initial Kafka topics should be domain-oriented.

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

### Topic responsibilities

| Topic | Events |
|---|---|
| `catalog-events` | Patterns, scenarios, technologies, platforms, code-example metadata |
| `compatibility-events` | Compatibility relationships, caveats, required adapters |
| `compare-events` | Saved comparisons and recommendation outcomes |
| `blueprint-events` | Curated Atlas and saved blueprint lifecycle |
| `composer-events` | Layer selections, validation, override decisions |
| `ai-events` | Generation lifecycle and validation results |
| `user-events` | User interactions with analytical value |
| `projection-events` | Projection status, retries, completion, and failure |
| `dead-letter-events` | Events that cannot be processed after bounded retries |

## Canonical write path

Canonical business writes use the PostgreSQL transactional outbox pattern.

```text
User command
  ↓
Application command handler
  ↓
PostgreSQL transaction
  ├── Write canonical business state
  └── Insert outbox event
          ↓
Transaction commits
          ↓
Outbox publisher claims pending event
          ↓
Kafka topic receives event
          ↓
Independent consumers process it
```

### Why the outbox is required

Without an outbox, a service may write to PostgreSQL successfully but fail to publish the related Kafka event.

```text
Failure case:
PostgreSQL update succeeds
Kafka publish fails
Derived systems never learn about the change
```

The transactional outbox makes the business write and pending-event record atomic.

```text
Correct case:
PostgreSQL update succeeds
Outbox record succeeds in same transaction
Publisher retries Kafka delivery safely
```

## MongoDB event path

MongoDB document collections may use change streams to publish document lifecycle events.

```text
MongoDB document write
  ↓
MongoDB change stream
  ↓
Kafka connector
  ↓
Kafka event
  ↓
Analytics, monitoring, or downstream consumers
```

MongoDB should publish only document-specific or projection-specific events.

```text
Correct:
atlas.document.projected
ai.generation.artifact.created

Avoid duplicate business events:
atlas.blueprint.created
```

The canonical `atlas.blueprint.created` event should originate from PostgreSQL when the canonical blueprint record is created.

## Consumer rules

Every consumer must be idempotent.

An event may be delivered more than once because of retries, consumer restarts, partition reassignment, or network failures.

### Idempotency strategy

Consumers should store or otherwise recognize processed event IDs.

```text
Receive event
  ↓
Check event ID against processed-event record
  ↓
Already processed?
  ├── Yes → acknowledge safely
  └── No  → apply projection or side effect
             record event ID as processed
             acknowledge
```

Examples of idempotency keys:

```text
ClickHouse:
event_id

Graph projection:
event_id + projection name

MongoDB document projection:
event_id or aggregate ID + aggregate version

Notification delivery:
event_id + recipient ID
```

### Ordering rules

Kafka ordering is guaranteed only within a partition.

Events that require aggregate-level ordering should use the aggregate ID as the Kafka message key.

```text
Message key:
Blueprint UUID

Result:
All events for one Blueprint are ordered within its partition.
```

Do not assume global ordering across topics, partitions, or independent aggregates.

## Retry and dead-letter handling

Consumers should use bounded retries for transient failures.

```text
Attempt 1
  ↓ failure
Retry after short delay
  ↓ failure
Retry with bounded backoff
  ↓ failure
Publish failure context to dead-letter topic
  ↓
Alert and investigate
```

### Retryable failures

```text
Temporary provider outage
Database connection interruption
Network timeout
Rate limit
Short-lived dependency failure
```

### Non-retryable failures

```text
Invalid payload schema
Unsupported event version
Required aggregate missing after reconciliation
Unauthorized consumer action
Permanent serialization failure
```

### Dead-letter event requirements

A dead-letter record should include:

```text
Original event ID
Original event type and version
Original topic and partition metadata
Consumer name
Failure category
Failure message
Retry count
Failure timestamp
Correlation ID
```

Do not store secrets, tokens, or unredacted private content in dead-letter payloads.

## Projection model

Consumers build projections independently.

### MongoDB document projection

```text
Blueprint event
→ generate or update rich blueprint document
→ persist versioned MongoDB artifact
→ emit projection outcome event
```

### Graph projection

```text
Catalog or compatibility event
→ upsert graph nodes and relationships
→ support traversal and explanation queries
→ emit projection outcome event
```

### ClickHouse analytics projection

```text
Domain or user event
→ sanitize payload
→ append event-log record
→ aggregate into materialized views
→ power Grafana dashboards
```

### Real-time notification projection

```text
Long-running workflow event
→ identify authorized interested user
→ emit Server-Sent Event update
→ browser updates visible progress
```

## Real-time events

Initial user-visible real-time events include:

```text
ai.generation.started
ai.generation.progressed
ai.generation.completed
ai.generation.failed

atlas.blueprint.validation.started
atlas.blueprint.validation.completed

composer.compatibility.checked
composer.compatibility.failed

compare.analysis.completed
```

### Delivery path

```text
Kafka event
  ↓
Notification consumer
  ↓
Authorization and recipient resolution
  ↓
Server-Sent Event gateway
  ↓
Browser client
```

The initial design uses Server-Sent Events because the first requirements are one-way progress updates.

WebSockets should be introduced only for bidirectional workflows, such as collaborative editing.

## Event schema governance

All event payloads must be defined in shared schemas.

```text
packages/schemas
  ↓
Event envelope
Event payload schemas
Validation functions
TypeScript inferred types
```

Each event change must follow one of these strategies:

| Change type | Strategy |
|---|---|
| Add optional payload field | Keep event version when backward compatible |
| Add required payload field | Create a new event version |
| Rename or remove field | Create a new event version |
| Change field meaning | Create a new event version |
| Change topic routing | Introduce a migration plan and dual-consume period |

Consumers should reject unsupported event versions explicitly and send them to controlled failure handling.

## Observability

Every event-processing component should expose enough information to answer:

```text
What happened?
When did it happen?
Which aggregate was affected?
Which user action caused it?
Which consumer processed it?
How long did processing take?
Did it fail or retry?
Can it be replayed?
```

### Initial operational metrics

```text
Outbox pending-event count
Outbox publish latency
Kafka producer failures
Consumer lag by consumer group
Consumer processing duration
Retry count
Dead-letter event count
Projection success and failure rate
Real-time notification delivery failures
```

### Correlation tracing

A single user request should be traceable across the system.

```text
User starts AI generation
  ↓ correlation ID
API request
  ↓ same correlation ID
Generation request saved
  ↓ same correlation ID
Kafka ai.generation.started
  ↓ same correlation ID
MongoDB artifact created
  ↓ same correlation ID
ClickHouse analytical event
  ↓ same correlation ID
SSE completion notification
```

## Event retention and replay

Retention requirements should vary by topic.

| Event category | Retention direction |
|---|---|
| Canonical domain events | Long enough to rebuild projections and investigate failures |
| User analytics events | Based on product analytics and privacy requirements |
| Projection status events | Long enough for operational diagnosis |
| Dead-letter events | Long enough for investigation and controlled replay |
| Ephemeral progress events | Shorter retention when no replay value exists |

Retention values must be decided before production data collection begins.

Replay must be controlled carefully:

- Confirm the target consumer is idempotent.
- Use a separate consumer group for rebuilds when appropriate.
- Avoid replaying events that would resend external notifications.
- Verify authorization and data-retention requirements.
- Record projection rebuild operations.

## Initial implementation sequence

### Phase 1: Contracts

```text
- Create shared event envelope.
- Define Zod schemas and TypeScript types.
- Define topic names.
- Define event naming conventions.
- Add contract tests.
```

### Phase 2: Outbox and publishing

```text
- Add PostgreSQL outbox table.
- Add outbox repository and publisher worker.
- Configure Kafka producer.
- Publish initial catalog and blueprint events.
```

### Phase 3: First consumer

```text
- Add one idempotent consumer.
- Store processed event IDs.
- Add retry and failure recording.
- Validate replay behavior.
```

### Phase 4: Analytics and monitoring

```text
- Ingest events into ClickHouse.
- Add Grafana dashboard for outbox and consumer health.
- Add dead-letter topic and alerting.
```

### Phase 5: Projections and real-time updates

```text
- Add MongoDB document projection.
- Add graph projection.
- Add Server-Sent Event notification gateway.
- Add AI Studio and Composer progress events.
```

## Non-negotiable rules

- Events must represent business facts.
- Canonical writes use the PostgreSQL transactional outbox.
- Events must have IDs, versions, aggregate identities, and correlation IDs.
- Consumers must be idempotent.
- Aggregate-level ordering uses the aggregate ID as the message key.
- Failed processing requires bounded retries and a dead-letter path.
- Projections must be rebuildable.
- Events and analytics must not contain secrets or unnecessary private content.
- AI-generated events and recommendations must preserve source classification.
- Event schemas are shared contracts, not informal JSON conventions.

## Related documents

- [Architecture overview](overview.md)
- [System context](system-context.md)
- [Application architecture](application-architecture.md)
- [Domain model](domain-model.md)
- [Data platform](data-platform.md)
- [Observability](../operations/observability.md)
- [Security and data handling](../operations/security-and-data-handling.md)
- [Architecture Decision Records](../decisions/README.md)
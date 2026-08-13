# ADR-0002: Use a Polyglot Data Architecture with Clear Ownership Boundaries

> Status: Accepted  
> Date: 2026-08-12

## Context

StrataForge is evolving into an architecture intelligence and full-stack blueprint platform.

The product will need to support several distinct workload types:

- Structured catalog records for patterns, scenarios, technologies, platforms, examples, and compatibility relationships.
- Transactional user-owned records such as projects, saved comparisons, blueprints, Composer selections, and permissions.
- Flexible and versioned documents, including AI generation artifacts, blueprint documents, generated implementation bundles, and imported research snapshots.
- Durable domain-event transport for asynchronous processing and projection updates.
- High-volume product analytics, operational event analysis, and event-pipeline diagnostics.
- Relationship traversal for technology compatibility, required adapters, alternatives, related content, and recommendation explanations.
- Dashboarding and alerting for application and event-processing health.

No single datastore is an optimal owner for all of these workloads.

Using one relational database for everything would make flexible document artifacts, analytical queries, and relationship traversal less effective. Using a document store as the primary system of record would weaken transactional constraints and structured relationships. Using an analytical database for operational writes would mix incompatible workloads. Treating a graph projection as canonical would complicate transactional ownership and recovery.

StrataForge requires a deliberate polyglot data architecture with one authoritative owner for each category of information.

## Decision

StrataForge will use a polyglot data architecture with the following target responsibilities:

| System | Primary responsibility |
|---|---|
| PostgreSQL | Canonical transactional domain state and transactional outbox |
| MongoDB | Flexible, versioned documents and AI-generation artifacts |
| Kafka | Durable domain-event transport, replay, and asynchronous integration |
| ClickHouse | Product analytics, operational analytics, and event history |
| Grafana | Dashboards, alerts, and operational visibility |
| Graph store | Derived relationship traversal and recommendation explanation |

The architecture will be introduced incrementally.

The current application remains a content-driven Next.js workspace until each proposed component is implemented, tested, and deployed.

## Data ownership model

### PostgreSQL is canonical

PostgreSQL will be the authoritative system of record for structured and transactional business state.

It will own records such as:

```text
Patterns
Pattern variants
Scenarios
Core languages
Technologies
Platforms
Code-example metadata
Compatibility relationships
Compatibility caveats
Required adapters

Users
Organizations
Projects
Saved comparisons

Blueprints
Blueprint layers
Technology selections
Recommendations
Assumptions
Open questions

Transactional outbox events
```

PostgreSQL is responsible for transactional consistency, relational constraints, authorization-scoped records, and durable business lifecycles.

### MongoDB stores rich documents

MongoDB will store flexible, evolving, versioned, or large document artifacts.

It will own document data such as:

```text
AI generation requests
AI generation artifacts
Versioned blueprint documents
Generated code bundles
Imported research snapshots
Integration payload snapshots
Provider-specific generation metadata
```

MongoDB is not the authoritative owner of core catalog entities, user ownership relationships, compatibility rules, or canonical blueprint state.

Where a MongoDB document represents a blueprint, it is a rich document projection or artifact associated with a canonical PostgreSQL blueprint record.

### Kafka transports events

Kafka will carry versioned domain events between systems.

Kafka is not the canonical owner of business state. It is the durable transport, replay, and integration mechanism for events such as:

```text
catalog.technology.updated.v1
compatibility.relationship.updated.v1
atlas.blueprint.created.v1
composer.stack.updated.v1
ai.generation.completed.v1
```

Kafka enables independent consumers to update MongoDB documents, graph relationships, ClickHouse analytics, and real-time user notifications.

### ClickHouse stores analytical data

ClickHouse will store high-volume, append-oriented analytical records.

It will support:

```text
Product usage analytics
Explore and Compare funnels
Atlas and AI Studio generation metrics
Technology-selection trends
Event throughput
Consumer lag and processing health
Projection failures
Dead-letter analysis
```

ClickHouse must not become the source of truth for product writes, permissions, compatibility rules, user projects, or canonical blueprint state.

### Grafana provides visibility

Grafana will query ClickHouse and future infrastructure sources to provide:

```text
Product usage dashboards
Kafka event throughput
Consumer lag
Outbox publishing health
AI-generation duration and failures
Projection success and failure rates
Dead-letter volume
Operational alerts
```

Grafana is a visualization and alerting layer. It is not a data owner.

### Graph store provides derived relationships

A graph store will hold derived relationship projections.

It will support queries such as:

```text
Which technologies are compatible with a selected stack?

Which adapters are required for this integration path?

Which patterns apply to this scenario?

Why was a technology recommended?

What alternatives satisfy the same architecture layer?

Which technologies commonly appear together in curated blueprints?
```

The graph store is derived from canonical PostgreSQL records and domain events. It must be rebuildable and must not become the authoritative owner of catalog state or compatibility records.

## Target architecture

```text
                          StrataForge web application
                                      │
                                      ▼
                         Application command/query layer
                                      │
                  ┌───────────────────┴───────────────────┐
                  │                                       │
                  ▼                                       ▼
     ┌──────────────────────────┐            ┌──────────────────────────┐
     │ PostgreSQL               │            │ MongoDB                  │
     │ Canonical transactional  │            │ Documents and            │
     │ data + transactional     │            │ AI-generation artifacts  │
     │ outbox                   │            └─────────────┬────────────┘
     └─────────────┬────────────┘                          │
                   │                                       │
                   │ outbox publisher                      │ change streams
                   ▼                                       ▼
              ┌──────────────────────────────────────────────┐
              │ Kafka                                        │
              │ Durable versioned event backbone              │
              └─────────────┬─────────────┬──────────────────┘
                            │             │
                            ▼             ▼
                ┌────────────────┐  ┌────────────────┐
                │ Graph store    │  │ ClickHouse     │
                │ Relationship   │  │ Analytics and  │
                │ projections    │  │ event history  │
                └────────────────┘  └────────┬───────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ Grafana     │
                                       │ Dashboards  │
                                       │ and alerts  │
                                       └─────────────┘
```

## Canonical write rules

Business writes that change canonical state must follow this sequence:

```text
1. Validate request and authorization.
2. Start a PostgreSQL transaction.
3. Write canonical domain state.
4. Write a transactional outbox event in the same transaction.
5. Commit.
6. Publish the outbox event to Kafka asynchronously.
7. Allow derived consumers to process the event independently.
```

This prevents unreliable dual writes.

```text
Incorrect:
PostgreSQL write succeeds
→ Kafka publish fails
→ projections and analytics never receive the event

Correct:
PostgreSQL write and outbox event succeed atomically
→ publisher retries Kafka delivery
→ consumers process independently and idempotently
```

## Projection rules

All non-canonical projections must be rebuildable.

| Projection | Input | Purpose |
|---|---|---|
| MongoDB blueprint document | Blueprint and generation events | Rich documents, revisions, generated artifacts |
| Graph relationships | Catalog and compatibility events | Traversal, alternatives, rationale |
| ClickHouse event log | Domain and telemetry events | Analytics, reporting, observability |
| Grafana dashboard data | ClickHouse and infrastructure sources | Visibility and alerting |
| Real-time user notifications | Workflow lifecycle events | Progress and completion updates |

A projection failure must not invalidate a successfully committed canonical write. Instead, the failure should be retried, observed, and sent to dead-letter handling when unrecoverable.

## Data consistency model

StrataForge will use different consistency models based on workload.

| Workload | Consistency expectation |
|---|---|
| User-owned transactional writes | Strong consistency within PostgreSQL transaction |
| Authorization and project ownership | Strong consistency from canonical relational state |
| Outbox record creation | Atomic with canonical state change |
| Kafka publication | At-least-once delivery with retry |
| MongoDB, graph, and ClickHouse projections | Eventual consistency |
| Analytics dashboards | Eventual consistency |
| Real-time progress updates | Eventual consistency, best-effort user experience |

The user interface must distinguish between:

```text
Saved
  Canonical PostgreSQL state is committed.

Processing
  Asynchronous projections or generation work continues.

Ready
  Required processing and validation steps have completed.

Failed
  A required asynchronous workflow failed and needs user-visible recovery.
```

## Benefits

### Appropriate tools for each workload

Each system is selected for its strongest workload:

```text
PostgreSQL
  Transactions, constraints, ownership, relational records.

MongoDB
  Flexible documents, evolving artifacts, revisions.

Kafka
  Durable event transport, replay, asynchronous processing.

ClickHouse
  High-volume analytical queries and event analysis.

Grafana
  Dashboards, visibility, alerts.

Graph store
  Relationship traversal and recommendation explanation.
```

### Incremental growth path

The architecture allows StrataForge to begin with PostgreSQL and add specialized systems only when a real workload requires them.

### Explainable recommendations

Graph relationships, compatibility records, curated knowledge, and structured recommendations support explanations instead of opaque rankings.

### Operational visibility

Kafka, ClickHouse, and Grafana provide a path to observe event flow, consumer health, product adoption, and AI-generation performance.

### Rebuildable derived systems

Event replay and canonical ownership make it possible to rebuild analytical, document, and graph projections after schema changes or processing failures.

## Tradeoffs

### Operational complexity

Operating multiple systems introduces infrastructure, monitoring, backup, security, access-control, and deployment complexity.

### Eventual consistency

Derived projections may temporarily lag behind PostgreSQL canonical state.

### Schema governance

Kafka event contracts, database schemas, document shapes, and graph projections require disciplined versioning.

### Multiple failure modes

A successful PostgreSQL write can still be followed by delayed or failed Kafka publication, consumer processing, or projection updates.

### Cost

Managed Kafka, ClickHouse, MongoDB, Grafana, and graph services may introduce cost before all workloads justify their use.

## Alternatives considered

### PostgreSQL only

**Not selected as the complete target architecture.**

PostgreSQL remains the canonical transactional store and can support an early product phase. However, using it alone for flexible AI artifacts, high-volume analytics, replayable event streams, and graph traversal would create unnecessary compromises.

### MongoDB as the primary system of record

**Not selected.**

MongoDB is well-suited for flexible documents, but PostgreSQL provides stronger relational constraints, transactional ownership, and query clarity for catalog, compatibility, organization, project, and blueprint lifecycle records.

### ClickHouse as an operational application database

**Not selected.**

ClickHouse is optimized for analytical and append-heavy workloads, not canonical transactional writes, authorization-scoped product state, or relational integrity.

### Graph database as the canonical catalog store

**Not selected.**

A graph store is valuable for traversal and explanation, but canonical catalog and compatibility updates require a clearer transactional ownership model. Graph data will be a derived projection.

### Synchronous point-to-point integration without Kafka

**Not selected.**

Direct synchronous calls from the web application to analytics, document, graph, and notification systems would tightly couple independent workloads and make reliable retries, replay, and operational recovery difficult.

### Introduce every data platform component immediately

**Not selected.**

The architecture is accepted as a target, but implementation will be phased. PostgreSQL and shared schemas come first; Kafka, ClickHouse, MongoDB, Grafana, and graph projections follow as the required product workflows are introduced.

## Implementation sequence

### Phase 1: Relational foundation

```text
- Add packages/database.
- Configure PostgreSQL.
- Create migrations.
- Define catalog and compatibility records.
- Add seed/import path for curated content.
- Introduce repository and query layers.
```

### Phase 2: Event foundation

```text
- Add packages/events.
- Define shared event contracts.
- Add PostgreSQL outbox table and publisher.
- Configure Kafka producer.
- Add initial idempotent consumer.
```

### Phase 3: Analytics and observability

```text
- Add ClickHouse event ingestion.
- Create raw event-log table.
- Add Grafana dashboards for outbox and consumer health.
- Define initial product-event taxonomy.
```

### Phase 4: Documents and graph

```text
- Add packages/documents for MongoDB.
- Add versioned blueprint and AI-generation collections.
- Publish MongoDB document lifecycle events.
- Add packages/graph and projection workers.
```

### Phase 5: Real-time workflow updates

```text
- Add notification consumer.
- Add Server-Sent Event gateway.
- Deliver Atlas, Composer, and AI Studio progress events.
```

## Consequences

The current codebase must preserve clear boundaries:

- The Next.js application does not directly operate Kafka consumers or projections.
- PostgreSQL remains authoritative for transactional state.
- MongoDB documents remain specialized artifacts or projections.
- ClickHouse receives analytical and operational event data only.
- Graph data remains derived and rebuildable.
- Grafana remains a visualization and alerting tool.
- Event consumers must be idempotent and observable.
- Sensitive content must be excluded from analytics and event payloads.
- New systems are introduced through focused pull requests and supporting ADRs.

## Related documents

- [Architecture overview](../architecture/overview.md)
- [System context](../architecture/system-context.md)
- [Application architecture](../architecture/application-architecture.md)
- [Domain model](../architecture/domain-model.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [ADR index](README.md)
- [ADR-0001: Monorepo and package boundaries](0001-monorepo-and-package-boundaries.md)
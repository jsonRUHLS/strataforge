# Data Platform

> Status: In progress  
> Last updated: 2026-08-14

This document defines the target data platform for StrataForge and records its current implementation status.

StrataForge will use a polyglot data architecture: different systems are selected for the workloads they are best suited to handle. PostgreSQL holds canonical transactional state; MongoDB will store flexible document artifacts; Kafka will transport durable domain events; ClickHouse will support analytics; Grafana will provide visibility; and a graph store will support derived relationship traversal and recommendation explanations.

PostgreSQL catalog infrastructure is now implemented locally as the first delivery phase. MongoDB, Kafka, ClickHouse, Grafana, graph projections, transactional outbox processing, and real-time event delivery remain proposed.

For domain concepts, see [Domain model](domain-model.md). For event contracts and delivery rules, see [Eventing model](eventing.md).

## Goals

The data platform should enable StrataForge to:

- Maintain a reliable canonical catalog of patterns, scenarios, technologies, and compatibility relationships.
- Persist user-owned projects, saved comparisons, and solution blueprints safely.
- Store flexible, versioned AI generation artifacts without forcing every field into relational tables.
- Publish meaningful domain events reliably after business state changes.
- Build derived read models for analytics, graph traversal, search, and real-time notifications.
- Measure product usage, recommendation outcomes, generation performance, and pipeline health.
- Support replayable, idempotent projection processing.
- Keep sensitive content, secrets, and credentials out of analytics and event payloads.
- Introduce infrastructure incrementally without blocking current product development.

## Design principles

### One authoritative owner

Every important domain entity has one authoritative system of record.

Derived systems may store copies, projections, or analytical representations, but they must not become the authoritative owner of business state.

### Transactional writes first

Business writes must complete reliably in the canonical transactional store before downstream projections react.

```text
Canonical write
→ transactional outbox record
→ Kafka event
→ derived consumers
```

### Events describe business facts

Events should communicate facts that matter to the product domain:

```text
atlas.blueprint.created.v1
catalog.technology.updated.v1
compatibility.relationship.updated.v1
```

They should not expose generic database implementation details such as:

```text
technologies-row-updated
blueprints-table-record-changed
```

### Derived stores are rebuildable

MongoDB document projections, graph relationships, ClickHouse analytical tables, and search indexes must be rebuildable from authoritative data and event streams.

### Privacy by design

Events and analytical records must contain only the minimum information necessary for processing, correlation, monitoring, and aggregate analysis.

Do not emit:

- Credentials, tokens, passwords, or connection strings.
- Raw user secrets.
- Unnecessary raw prompt text.
- Private source code or imported artifacts without authorization.
- Personally identifying data unless there is a documented, necessary, and authorized use.

## Target architecture

```text
                                  User action
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ StrataForge web/API    │
                         │ command or query layer │
                         └───────────┬────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
       ┌────────────────────────┐        ┌────────────────────────┐
       │ PostgreSQL             │        │ MongoDB                │
       │ Canonical transactional│        │ Flexible documents and │
       │ state + outbox         │        │ AI-generation artifacts│
       └───────────┬────────────┘        └───────────┬────────────┘
                   │                                 │
                   │ transactional outbox            │ change streams
                   ▼                                 ▼
              ┌──────────────────────────────────────────┐
              │ Kafka                                    │
              │ Versioned event backbone                  │
              └───────┬────────────┬────────────┬────────┘
                      │            │            │
                      ▼            ▼            ▼
           ┌───────────────┐ ┌────────────┐ ┌───────────────┐
           │ Graph store   │ │ ClickHouse │ │ Real-time     │
           │ Relationship  │ │ Analytics  │ │ gateway       │
           │ projections   │ │ and events │ │ SSE/WebSocket │
           └───────────────┘ └──────┬─────┘ └───────────────┘
                                    │
                                    ▼
                             ┌───────────────┐
                             │ Grafana       │
                             │ Dashboards    │
                             │ and alerts    │
                             └───────────────┘
```

## Current implementation

### PostgreSQL catalog foundation

> Status: Implemented locally

The first StrataForge PostgreSQL catalog foundation is implemented in:

```text
packages/database
```

Local PostgreSQL development infrastructure is available through:

```text
infra/compose/docker-compose.postgres.yml
```

The database package owns:

- Prisma schema definitions.
- Prisma migrations.
- Prisma Client construction.
- Catalog repository queries.
- Idempotent seed data.
- PostgreSQL catalog build output and type declarations.

The initial implemented catalog schema includes:

```text
CoreLanguage
Technology
Pattern
PatternVariant
Scenario
ScenarioPattern
ScenarioTechnology
TechnologyCompatibility
```

The initial seed contains:

```text
TypeScript
Adapter
Adapter in TypeScript
Third-party task API integration
Apollo Client
TypeORM
PostgreSQL
Apache Kafka
ClickHouse
Grafana
```

The first application integration is:

```text
/patterns/adapter
```

When PostgreSQL is configured, reachable, migrated, and seeded, the Adapter pattern page includes a database-backed catalog record and the linked `third-party-task-api` scenario. The scenario is marked with the `Catalog DB` provenance tag.

The existing `@atlas-patterns/content` package remains the primary source for the current pattern-detail experience. Catalog data is additive while broader pattern metadata, examples, and variants are migrated incrementally.

### Catalog availability behavior

The initial catalog integration fails open.

```text
DATABASE_URL absent
→ render authored content only

PostgreSQL unavailable or unable to initialize
→ render authored content only
→ write a server-side warning

PostgreSQL available and catalog data present
→ render authored content plus catalog enrichment
```

This prevents the optional catalog infrastructure from making existing content pages unavailable during local development, CI, preview deployment, or early deployment environments.

### Not yet implemented

The following remain proposed:

```text
Transactional outbox records and publisher
Kafka topics, producers, consumers, and dead-letter handling
MongoDB document storage and change-stream integration
ClickHouse ingestion and analytics tables
Grafana dashboards and alerts
Graph projections and traversal queries
Server-Sent Event or WebSocket delivery
Users, organizations, projects, saved comparisons, and blueprints
```

## Data ownership

| Data category | Authoritative owner | Implementation status | Derived consumers |
|---|---|---|---|
| Patterns, scenarios, technologies, platforms | PostgreSQL | Initial catalog implemented locally | Kafka, ClickHouse, graph store |
| Compatibility relationships and caveats | PostgreSQL | Technology compatibility schema implemented; no current seeded compatibility records | Kafka, ClickHouse, graph store |
| Users, organizations, projects | PostgreSQL | Proposed | Kafka, ClickHouse |
| Saved comparisons | PostgreSQL | Proposed | Kafka, ClickHouse |
| Blueprint state and Composer selections | PostgreSQL | Proposed | MongoDB, Kafka, graph store, ClickHouse |
| Transactional outbox records | PostgreSQL | Proposed | Kafka publisher |
| AI generation documents and artifacts | MongoDB | Proposed | Kafka, ClickHouse |
| Event transport and replay | Kafka | Proposed | Workers and projections |
| Product and operational analytics | ClickHouse | Proposed | Grafana |
| Relationship traversal | Graph store | Proposed | Application query layer |

## PostgreSQL

> Status: Initial catalog foundation implemented locally

PostgreSQL is the canonical transactional database.

It owns structured domain records that require transactions, constraints, foreign-key relationships, user ownership, authorization checks, and durable lifecycle management.

### Implemented PostgreSQL domains

```text
Core language
Technology
Pattern
Pattern variant
Scenario
Pattern/scenario relationships
Scenario/technology relationships
Technology compatibility relationships
```

### Implemented tables

```text
core_languages
technologies
patterns
pattern_variants
scenarios
scenario_patterns
scenario_technologies
technology_compatibilities
```

The schema is managed through Prisma migrations in:

```text
packages/database/prisma/migrations
```

The current migration is an initial catalog baseline. Future schema changes must use new migrations rather than editing an applied migration.

### Initial PostgreSQL domains

The following PostgreSQL domains remain planned:

```text
Platform
Code example metadata
Compatibility caveats
Users
Organizations
Organization memberships
Projects
Saved comparisons
Blueprints
Blueprint layers
Technology selections
Recommendations
Transactional outbox events
```

### Initial table direction

```text
platforms
code_examples
compatibility_caveats

users
organizations
organization_memberships
projects
saved_comparisons

blueprints
blueprint_layers
blueprint_technology_selections
recommendations
assumptions
open_questions

outbox_events
```

The table list is directional. It should evolve through migrations and ADRs rather than being treated as a final schema.

### Transactional outbox

> Status: Proposed

The transactional outbox is required for business state that produces events.

A write must save both the domain state and an outbox event within one PostgreSQL transaction.

```text
1. Validate command and authorization.
2. Write canonical domain state.
3. Write an outbox event in the same transaction.
4. Commit the transaction.
5. Publisher claims pending outbox event.
6. Publisher sends event to Kafka.
7. Publisher records delivery status.
```

This prevents unreliable dual writes:

```text
Incorrect:
Write PostgreSQL state
→ independently publish Kafka event
→ one operation succeeds while the other fails

Correct:
Write PostgreSQL state and outbox record atomically
→ publish asynchronously and retry safely
```

## MongoDB

> Status: Proposed

MongoDB is the document store for flexible, evolving, versioned, or large artifacts.

MongoDB is not the canonical store for core catalog records, user ownership relationships, compatibility rules, or transactional business state.

### Initial MongoDB collections

```text
atlas_blueprint_documents
ai_generation_requests
ai_generation_artifacts
generated_code_bundles
integration_snapshots
imported_research_artifacts
```

### Suitable MongoDB data

MongoDB should store data such as:

- A complete versioned blueprint document.
- AI-generated plan drafts and structured output.
- Provider-specific generation metadata.
- Generated multi-file implementation bundles.
- Imported documentation snapshots.
- Flexible integration payloads.
- Rich rationale documents with evolving fields.

### MongoDB change streams

MongoDB change streams may publish document lifecycle events through a Kafka connector.

Examples:

```text
atlas.document.created.v1
atlas.document.revised.v1
ai.generation.completed.v1
ai.generation.failed.v1
integration.snapshot.updated.v1
```

MongoDB change-stream events describe document lifecycle or projection activity. They must not duplicate the canonical business event already emitted from PostgreSQL.

For example:

```text
Canonical business event:
atlas.blueprint.created.v1

Derived document event:
atlas.document.projected.v1
```

## Kafka

> Status: Proposed

Kafka is the durable event backbone for StrataForge.

It enables asynchronous processing, durable integration, replayable streams, event-driven projections, operational monitoring, and user-facing real-time progress.

### Initial topic design

Topics should be domain-oriented and versioned.

```text
strataforge.catalog-events.v1
strataforge.compatibility-events.v1
strataforge.blueprint-events.v1
strataforge.composer-events.v1
strataforge.ai-events.v1
strataforge.user-events.v1
strataforge.projection-events.v1
strataforge.dead-letter-events.v1
```

### Event categories

| Category | Examples |
|---|---|
| Catalog events | Technology updated, scenario published, pattern variant added |
| Compatibility events | Relationship updated, caveat added, adapter requirement changed |
| Blueprint events | Blueprint created, layer updated, blueprint validated |
| Composer events | Technology selected, compatibility failed, override recorded |
| AI events | Generation started, progress updated, generation completed |
| User events | Comparison saved, blueprint exported, code example copied |
| Projection events | Graph projection completed, document projection failed |
| Dead-letter events | Consumer processing failed after retries |

### Event envelope

All domain events should use a shared envelope.

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

### Event requirements

Every event must include:

```text
Event ID
Event type
Event version
Occurrence timestamp
Producer identifier
Aggregate type and ID
Correlation ID
Payload validated by a shared schema
```

Event consumers must:

```text
Be idempotent
Handle duplicate delivery
Record failures
Use bounded retries
Send unrecoverable failures to a dead-letter topic
Support replay where safe
```

## ClickHouse

> Status: Proposed

ClickHouse is the analytical and event-query store.

It should receive sanitized events from Kafka and support high-volume analytical queries without affecting PostgreSQL transaction workloads.

### Initial analytical tables

```text
event_log
atlas_generation_metrics
comparison_events
technology_selection_events
recommendation_events
page_view_events
search_events
projection_failures
consumer_health
```

### Event log direction

```sql
CREATE TABLE event_log (
  occurred_at DateTime64(3),
  event_id UUID,
  event_type LowCardinality(String),
  event_version UInt16,

  aggregate_type LowCardinality(String),
  aggregate_id String,

  actor_type LowCardinality(String),
  actor_id Nullable(String),

  correlation_id UUID,
  producer LowCardinality(String),

  payload String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(occurred_at)
ORDER BY (
  event_type,
  occurred_at,
  aggregate_type,
  aggregate_id
);
```

The final table design should be optimized using actual query patterns and retention requirements.

### Materialized analytical views

Raw event data should be transformed into focused analytical tables.

```text
atlas_generation_daily
comparison_outcome_daily
technology_recommendation_daily
scenario_popularity_daily
feature_funnel_daily
consumer_health_hourly
```

Example product funnel:

```text
Atlas session started
→ Blueprint generated
→ User changed recommendation
→ Blueprint saved
→ Code copied or implementation exported
```

## Grafana

> Status: Proposed

Grafana is the dashboarding and alerting layer.

Grafana should query ClickHouse for product and event-pipeline analytics and may also query infrastructure metrics from future operational sources.

### Product dashboards

```text
Explore usage
- Pattern and scenario views
- Search activity
- Code-copy events
- Most-viewed technologies

Compare usage
- Comparison starts
- Most-compared technologies
- Saved comparison rate
- Recommendation acceptance rate

Atlas usage
- Blueprint starts
- Blueprint completion rate
- Curated versus Composer versus AI Studio usage
- Technology-selection changes
```

### Reliability dashboards

```text
Kafka
- Event throughput
- Consumer lag
- Failed consumer processing
- Dead-letter volume

Outbox
- Pending outbox count
- Publishing latency
- Failed publication attempts

AI Studio
- Generation duration
- Provider latency
- Validation failure rate
- Retry rate

Projections
- MongoDB projection lag
- Graph projection failures
- ClickHouse ingestion lag
```

### Alert candidates

```text
High consumer lag
Sustained outbox publishing failures
Dead-letter event volume above threshold
AI-generation failure-rate spike
Graph projection backlog
ClickHouse ingestion interruption
```

Alert thresholds should be introduced only after baseline operating behavior is measured.

## Graph projection

> Status: Proposed

The graph store is a derived relationship projection, not a canonical transactional store.

It supports relationship traversal and explanation.

### Initial graph relationships

```text
Scenario → uses → Pattern
Scenario → uses → Technology
Pattern → has variant → PatternVariant
Technology → uses language → CoreLanguage
Technology → compatible with → Technology
Technology → requires adapter → Technology
Technology → has caveat → Caveat
Blueprint → contains → BlueprintLayer
BlueprintLayer → recommends → Technology
Recommendation → has alternative → Technology
```

### Primary graph use cases

```text
Find related patterns for a scenario.
Explain why one technology was recommended.
Find compatible alternatives for a selected technology.
Identify required adapters and integration boundaries.
Traverse a complete blueprint and its dependencies.
Discover technologies commonly used together in curated solutions.
```

## Real-time delivery

> Status: Proposed

Kafka events can drive visible progress updates for long-running workflows.

### Initial events

```text
ai.generation.started.v1
ai.generation.progressed.v1
ai.generation.completed.v1
ai.generation.failed.v1

atlas.blueprint.validation.started.v1
atlas.blueprint.validation.completed.v1

comparison.analysis.completed.v1
graph.projection.completed.v1
```

### Initial delivery path

```text
Kafka event
→ real-time notification consumer
→ Server-Sent Event gateway
→ browser client
```

Server-Sent Events are the preferred initial approach because the first real-time use cases are one-way status updates.

WebSockets should be introduced later only for bidirectional workflows such as collaborative blueprint editing.

## Data lifecycle

### Catalog lifecycle

```text
Curated source content
→ validation and import process
→ PostgreSQL catalog records
→ catalog domain event
→ ClickHouse analytics record
→ graph relationship projection
→ refreshed application queries
```

Current implementation:

```text
Curated source-controlled seed data
→ PostgreSQL catalog records
→ server-side repository query
→ optional pattern-detail enrichment
```

Kafka publication, ClickHouse ingestion, graph projection, and automated import workflows remain proposed.

### Blueprint lifecycle

```text
User starts Atlas or Composer
→ PostgreSQL blueprint record
→ outbox event
→ Kafka
→ MongoDB blueprint document projection
→ graph relationship projection
→ ClickHouse product event
→ real-time completion notification
```

### AI generation lifecycle

```text
User submits requirement
→ PostgreSQL generation request metadata
→ Kafka generation-started event
→ AI-provider adapter
→ schema validation and compatibility checks
→ MongoDB generation artifact
→ PostgreSQL blueprint update when accepted
→ Kafka generation-completed event
→ ClickHouse metrics and real-time update
```

## Security and access rules

The data platform must support future authorization and privacy requirements.

### Access control

- User-owned projects and blueprints must be authorization-scoped.
- Organization resources must be isolated by organization membership.
- Event consumers must not bypass authorization when creating user-visible projections.
- Analytics queries should use aggregate or pseudonymous identifiers where possible.
- Administrative operational access must be separate from ordinary product access.

### Secrets

Secrets must be injected through secure environment configuration or a managed secrets system.

Never store in:

```text
Source control
Kafka event payloads
ClickHouse event records
MongoDB generated artifacts
Client-side environment variables
Frontend telemetry
```

The local PostgreSQL Compose password and `.env.example` connection string are development-only placeholders. Production, preview, and shared environments must inject a distinct `DATABASE_URL` through their environment or secrets-management configuration.

### Retention

Retention rules should differ by workload:

| Data type | Retention direction |
|---|---|
| Canonical product records | Retain according to product and legal requirements |
| Event topics | Retain according to replay and operational needs |
| Raw analytics events | Retain according to analytical value and privacy policy |
| AI raw prompts and artifacts | Retain only when necessary and authorized |
| Dead-letter records | Retain long enough for diagnosis and replay |

Formal retention values should be defined before production data collection begins.

## Implementation sequence

The target platform should be delivered incrementally.

### Phase 1: PostgreSQL catalog foundation

> Status: Initial vertical slice complete

```text
- [x] Database package and migrations.
- [x] Core catalog tables.
- [x] Idempotent seed process for an initial curated catalog slice.
- [x] Repository and query layer.
- [x] Database enrichment for /patterns/adapter.
- [x] Authored-content fallback when the optional catalog is unavailable.
- [ ] Automated catalog import pipeline.
- [ ] Broader database-backed Explore and scenario experiences.
- [ ] CI PostgreSQL migration, seed, and repository-query smoke test.
```

### Phase 2: Event foundation

```text
- [ ] Shared event schemas.
- [ ] Transactional outbox.
- [ ] Kafka producer.
- [ ] Initial consumer.
- [ ] Dead-letter handling.
```

### Phase 3: ClickHouse and Grafana

```text
- [ ] Raw event ingestion.
- [ ] Event-log table.
- [ ] Initial product and pipeline dashboards.
- [ ] Consumer-lag and outbox-health visibility.
```

### Phase 4: MongoDB documents

```text
- [ ] Blueprint and AI artifact collections.
- [ ] MongoDB change-stream lifecycle events.
- [ ] Document projection and revision support.
```

### Phase 5: Graph projection

```text
- [ ] Graph projection worker.
- [ ] Initial scenario, pattern, technology, and compatibility relationships.
- [ ] Related-content and recommendation-explanation queries.
```

### Phase 6: Real-time workflows

```text
- [ ] Kafka-backed notification consumer.
- [ ] Server-Sent Event gateway.
- [ ] AI Studio and Composer progress updates.
```

## Non-negotiable rules

- PostgreSQL is the initial canonical owner for transactional domain state.
- MongoDB is a specialized document store, not a replacement for PostgreSQL ownership.
- ClickHouse is analytical and must not receive canonical application writes.
- Graph relationships are derived and rebuildable.
- Kafka events are versioned and schema-validated.
- Consumers are idempotent and observable.
- The transactional outbox is required for canonical writes that publish events.
- Dead-letter events are required before critical asynchronous workflows are considered production-ready.
- Analytics events must not contain secrets or unnecessary private content.
- AI-generated recommendations must be labeled and validated.
- Proposed architecture must not be represented as deployed capability until implemented and verified.

## Related documents

- [Architecture overview](overview.md)
- [System context](system-context.md)
- [Application architecture](application-architecture.md)
- [Domain model](domain-model.md)
- [Eventing model](eventing.md)
- [Getting started](../development/getting-started.md)
- [Workspace guide](../development/workspace.md)
- [Observability](../operations/observability.md)
- [Security and data handling](../operations/security-and-data-handling.md)
- [Architecture Decision Records](../decisions/README.md)
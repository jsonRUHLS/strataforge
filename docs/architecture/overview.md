# Architecture Overview

> Status: In progress  
> Last updated: 2026-08-12

StrataForge is an architecture intelligence and full-stack blueprint platform. It helps users explore software patterns, compare technology choices in context, and design explainable, implementation-ready solution blueprints.

This document provides the high-level architectural view of the project. It distinguishes the current application structure from the target platform architecture.

For detailed decisions and subsystem designs, see:

- [System context](system-context.md)
- [Application architecture](application-architecture.md)
- [Domain model](domain-model.md)
- [Data platform](data-platform.md)
- [Eventing model](eventing.md)
- [Architecture Decision Records](../decisions/README.md)

## Architecture goals

StrataForge is designed to:

- Present curated software-pattern knowledge and implementation examples.
- Connect patterns, scenarios, languages, frameworks, platforms, and technologies.
- Explain compatibility, alternatives, required adapters, and tradeoffs.
- Support curated and user-composed architecture blueprints.
- Support AI-assisted solution planning without treating AI output as unverified truth.
- Capture product and operational events for analysis and observability.
- Keep authoritative transactional data separate from analytical, document, and graph-oriented workloads.

## Current implementation

The current codebase is a pnpm workspace centered on a Next.js web application.

```text
StrataForge repository
│
├── apps/
│   └── pattern-atlas-web/
│       └── Next.js application
│
├── packages/
│   ├── content/
│   │   └── Curated pattern content and implementation examples
│   │
│   ├── schemas/
│   │   └── Shared TypeScript and validation contracts
│   │
│   ├── ui/
│   │   └── Shared UI components
│   │
│   └── integrations/
│       └── Integration helpers and external-service adapters
│
├── docs/
│   └── Product, architecture, decision, development,
│       operations, and planning documentation
│
└── .github/
    └── GitHub Actions continuous-integration workflows
```

### Current runtime flow

```text
Browser
  ↓
Next.js web application
  ↓
Curated content and shared workspace packages
  ↓
Rendered pattern, comparison, and example experiences
```

The current application is primarily content-driven. It provides the foundation for curated pattern exploration and implementation variants.

## Target platform architecture

The target architecture evolves StrataForge from a content-focused application into a multi-model architecture intelligence platform.

```text
                                Users
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ StrataForge Web App     │
                    │ Next.js                 │
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │ Application API Layer   │
                    │ Queries, commands,      │
                    │ validation, auth        │
                    └───────┬─────────┬───────┘
                            │         │
              Read models   │         │ Commands
                            │         │
                            ▼         ▼
                ┌───────────────┐  ┌────────────────┐
                │ PostgreSQL    │  │ MongoDB        │
                │ Canonical     │  │ Documents and  │
                │ transaction   │  │ AI artifacts   │
                │ state         │  └───────┬────────┘
                └───────┬───────┘          │
                        │                  │
                        │ Transactional    │ Change streams
                        │ outbox           │
                        ▼                  ▼
                    ┌─────────────────────────┐
                    │ Kafka                   │
                    │ Durable event backbone  │
                    └───────┬─────────┬───────┘
                            │         │
                            │         │
                            ▼         ▼
                ┌───────────────┐  ┌────────────────┐
                │ ClickHouse    │  │ Graph store    │
                │ Analytics and │  │ Derived        │
                │ event history │  │ relationships  │
                └───────┬───────┘  └────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │ Grafana       │
                │ Dashboards    │
                │ and alerts    │
                └───────────────┘
```

## System responsibilities

### Next.js application

The web application provides the user experience for:

- Explore.
- Compare.
- Atlas.
- Composer.
- AI Studio.
- Authentication and user-facing project workflows.
- Real-time progress and completion updates.

The web application should not own direct Kafka, ClickHouse, MongoDB change-stream, or graph-projection logic.

### PostgreSQL

PostgreSQL is the target canonical transactional store.

It will own structured records such as:

- Users and organizations.
- Technologies and platforms.
- Patterns and scenarios.
- Compatibility relationships.
- Saved comparisons.
- Atlas blueprints.
- Composer selections.
- Projects and user preferences.
- Transactional outbox events.

PostgreSQL is the source of truth for business entities that require reliable transactions and explicit relational constraints.

### MongoDB

MongoDB is the target document store for flexible, evolving, or large artifacts.

It will store:

- AI Studio requests and generation history.
- Versioned blueprint documents.
- Generated implementation bundles.
- Imported research snapshots.
- Rich integration payloads.
- Prompt context and structured AI output, subject to data-handling rules.

MongoDB is not the canonical source for core catalog entities or transactional relationships.

### Kafka

Kafka is the target durable event backbone.

It will carry versioned domain events between systems, including:

```text
catalog.technology.updated.v1
catalog.scenario.updated.v1
atlas.blueprint.created.v1
atlas.composer.stack.updated.v1
ai.generation.completed.v1
```

Kafka enables:

- Reliable asynchronous integration.
- Replayable event streams.
- Decoupled consumers.
- Projection updates.
- Product telemetry capture.
- Real-time application notifications.

### ClickHouse

ClickHouse is the target analytical data store.

It will receive event data from Kafka and support:

- Product analytics.
- Usage funnels.
- Technology-selection trends.
- Atlas generation performance.
- Comparison outcomes.
- Event-processing diagnostics.
- Consumer and projection failure analysis.

ClickHouse is an analytical read store. It must not become the authoritative database for product writes.

### Grafana

Grafana is the target dashboarding and alerting layer.

It will visualize:

- Kafka event throughput and consumer lag.
- Outbox publishing health.
- Atlas generation latency and failure rates.
- ClickHouse ingestion health.
- Product adoption and conversion funnels.
- Projection failures and dead-letter activity.

### Graph store

A graph store is the target derived relationship layer.

It will model and query connections such as:

```text
Scenario → uses → Pattern
Scenario → uses → Technology
Technology → uses language → Core language
Technology → compatible with → Technology
Technology → requires adapter → Technology
Blueprint → contains → Architecture layer
Architecture layer → recommends → Technology
```

The graph is a projection built from canonical records and domain events. It is used for relationship traversal, related-content discovery, compatibility explanations, and recommendation rationale.

## Data ownership

Each domain should have one clear authoritative owner.

| Data category | Authoritative system | Derived consumers |
|---|---|---|
| Core catalog and compatibility records | PostgreSQL | Kafka, graph store, ClickHouse |
| Users, projects, saved blueprints | PostgreSQL | Kafka, MongoDB, graph store, ClickHouse |
| AI generation documents and artifacts | MongoDB | Kafka, ClickHouse |
| Domain-event transport | Kafka | MongoDB, graph store, ClickHouse, real-time gateway |
| Analytics and telemetry | ClickHouse | Grafana |
| Relationship traversal | Graph store | Application query services |

## Event-driven integration

The target write path uses the transactional outbox pattern.

```text
Application command
  ↓
PostgreSQL transaction
  ├── Update canonical business data
  └── Insert outbox event
          ↓
     Outbox publisher
          ↓
        Kafka event
          ↓
MongoDB, graph, ClickHouse, and real-time consumers
```

This design avoids unreliable dual writes, such as independently writing business data to PostgreSQL and publishing an event to Kafka without transactional coordination.

All consumers must be idempotent because an event may be delivered more than once.

## Recommendation model

StrataForge recommendations should be explainable and have a clear source classification.

```text
Curated
  Maintained knowledge and explicit compatibility rules.

Deterministically inferred
  Results derived from structured relationships and compatibility logic.

AI-generated
  Structured proposals generated by an AI model and validated against
  curated knowledge, schema rules, and compatibility constraints.
```

The application should never present an AI-generated technology recommendation as curated fact without identifying its source and confidence.

## Delivery phases

### Phase 1: Stable product foundation

- Public StrataForge identity.
- Documentation system.
- Continuous integration.
- Shared schemas and content-model stabilization.

### Phase 2: Relational catalog foundation

- PostgreSQL.
- Schema migrations.
- Catalog import and seed process.
- Repository/query layer.
- Database-backed Explore experience.

### Phase 3: Event foundation

- Shared event contracts.
- PostgreSQL transactional outbox.
- Kafka topics and producer.
- Initial consumer and dead-letter strategy.

### Phase 4: Analytics and observability

- ClickHouse event ingestion.
- Grafana dashboards.
- Product-event taxonomy.
- Pipeline health monitoring.

### Phase 5: Documents and graph projections

- MongoDB document collections.
- MongoDB change-stream integration.
- Graph projection worker.
- Relationship and compatibility traversal.

### Phase 6: Product expansion

- Contextual Compare.
- Curated Atlas blueprints.
- Composer compatibility validation.
- AI Studio with structured and validated output.

## Non-negotiable constraints

- PostgreSQL remains the initial canonical source for transactional domain state.
- MongoDB, ClickHouse, and graph data are specialized or derived stores.
- Kafka events are versioned and include event IDs and correlation IDs.
- Consumers are idempotent and failures are observable.
- Sensitive values, credentials, and unnecessary raw user content do not enter analytics events.
- AI output is validated, traceable, and clearly labeled by source.
- Proposed architecture must not be described as current implementation until it is deployed and verified.

## Related documents

- [System context](system-context.md)
- [Application architecture](application-architecture.md)
- [Domain model](domain-model.md)
- [Data platform](data-platform.md)
- [Eventing model](eventing.md)
- [Product vision](../product/vision.md)
- [Capabilities](../product/capabilities.md)
- [Delivery roadmap](../planning/roadmap.md)
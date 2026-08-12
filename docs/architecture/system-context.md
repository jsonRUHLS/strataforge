# System Context

> Status: Proposed  
> Last updated: 2026-08-12

This document describes the boundary of the StrataForge system: its users, external services, target data platforms, and major integrations. It is a high-level context document, not an implementation guide.

For the internal application and package structure, see [Application architecture](application-architecture.md). For ownership and flow among the proposed data systems, see [Data platform](data-platform.md) and [Eventing model](eventing.md).

## System purpose

StrataForge is an architecture intelligence and full-stack blueprint platform. It helps users explore patterns and technologies, compare two options in context, compose compatible stacks, and generate explainable implementation plans.

## Users and actors

### Developer

Explores patterns and implementation variants, compares technologies, and uses blueprints to guide feature development.

### Technical lead

Evaluates alternatives, records architecture tradeoffs, and shares a selected blueprint with a team.

### Solution architect

Builds end-to-end solutions across presentation, application, domain, data, integration, and infrastructure layers.

### Learner

Uses curated examples to understand how patterns change across languages, frameworks, and platforms.

### StrataForge operator

Maintains curated content, compatibility relationships, platform health, observability, and release operations.

## Context diagram

```text
                           ┌───────────────────────────┐
                           │ Developers, technical     │
                           │ leads, architects, and    │
                           │ learners                  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                      ┌─────────────────────────────────┐
                      │ StrataForge                     │
                      │ Web application and APIs        │
                      │                                 │
                      │ Explore · Compare · Atlas       │
                      │ Composer · AI Studio            │
                      └───────┬──────────┬──────────────┘
                              │          │
                Queries and   │          │ AI-assisted planning
                commands      │          │
                              ▼          ▼
             ┌───────────────────┐  ┌───────────────────┐
             │ Catalog and       │  │ AI provider        │
             │ project data      │  │ Structured output  │
             │ PostgreSQL        │  │ and generation     │
             └─────────┬─────────┘  └─────────┬─────────┘
                       │                      │
                       │ Domain events        │ Validated artifacts
                       ▼                      ▼
             ┌────────────────────────────────────────┐
             │ Kafka                                  │
             │ Durable event backbone                  │
             └───────┬───────────┬───────────┬────────┘
                     │           │           │
                     ▼           ▼           ▼
          ┌───────────────┐ ┌───────────┐ ┌─────────────┐
          │ MongoDB       │ │ Graph     │ │ ClickHouse  │
          │ Documents and │ │ derived   │ │ analytics   │
          │ AI artifacts  │ │ relations │ │ and events  │
          └───────────────┘ └───────────┘ └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │ Grafana     │
                                           │ Dashboards  │
                                           │ and alerts  │
                                           └─────────────┘
```

## External systems

### AI provider

> Status: Proposed

An AI provider will support requirement extraction, plan generation, and structured draft content for AI Studio.

StrataForge remains responsible for:

- Validating AI output against application schemas.
- Applying curated knowledge and compatibility constraints.
- Identifying AI-generated recommendations as AI-generated.
- Storing only approved and appropriately handled generation artifacts.
- Preserving assumptions, open questions, and source classification.

The AI provider is not the authoritative source of architecture facts, compatibility relationships, or product state.

### PostgreSQL

> Status: Proposed

PostgreSQL will be the authoritative transactional system for structured catalog data, users, projects, saved blueprints, and compatibility relationships.

It will also own the transactional outbox used to publish reliable domain events.

### MongoDB

> Status: Proposed

MongoDB will store flexible and versioned documents, including AI generation records, structured blueprint documents, generated implementation bundles, and selected imported artifacts.

MongoDB change streams may publish document lifecycle events into Kafka. MongoDB is not the authoritative store for core transactional catalog entities.

### Kafka

> Status: Proposed

Kafka will be the durable event backbone for versioned domain events, projection updates, replayable streams, and real-time processing.

Kafka consumers will include document projections, graph projections, analytical ingestion, and a real-time notification gateway.

### ClickHouse

> Status: Proposed

ClickHouse will store product and operational events for analytical queries. It will support usage analytics, funnels, generation performance, event-pipeline diagnostics, and consumer health analysis.

ClickHouse is not an operational system of record.

### Grafana

> Status: Proposed

Grafana will visualize ClickHouse queries and infrastructure signals for product analytics, event processing health, consumer lag, generation latency, and failure alerts.

### Graph store

> Status: Proposed

A graph store will hold a derived relationship projection for traversal and explanation. It will support related-content discovery, technology compatibility paths, required adapter discovery, and recommendation rationale.

The graph projection is derived from canonical records and events; it is not the authoritative owner of catalog state.

## Boundary rules

### StrataForge owns

- Curated catalog content and compatibility knowledge.
- Product and user-facing domain records.
- Blueprint schemas and validation rules.
- Recommendation source classification and rationale.
- Event contracts and event-governance rules.
- Privacy, authorization, and data-handling decisions.

### External providers own

- AI model execution and provider-specific inference infrastructure.
- Hosting/runtime behavior for managed data or event services.
- Third-party APIs used by an implementation scenario.

### StrataForge does not delegate

StrataForge does not delegate its canonical data ownership, compatibility claims, access-control decisions, or validation responsibility to an AI provider or external technology provider.

## Key integration flows

### Explore and Compare

```text
User request
→ StrataForge web application
→ application query layer
→ curated catalog and compatibility data
→ rendered explanation, examples, and alternatives
```

### Blueprint creation

```text
User selects a scenario or starts a composition
→ application command
→ canonical blueprint state is saved
→ transactional outbox event is written
→ Kafka event is published
→ document, graph, analytics, and notification consumers react
```

### AI Studio

```text
User requirement
→ requirement extraction and retrieval of curated context
→ deterministic compatibility filtering
→ AI provider request
→ schema validation and source classification
→ persisted blueprint or generation artifact
→ lifecycle event and progress notification
```

### Observability

```text
Application and event-processing activity
→ sanitized operational and product events
→ Kafka
→ ClickHouse
→ Grafana dashboards and alerts
```

## Trust and data handling

The following data must not be emitted in analytical events or exposed to unauthorized consumers:

- Credentials, access tokens, API keys, and connection strings.
- Unnecessary raw prompt content.
- Sensitive user data.
- Private source code or imported artifacts without explicit authorization.

Events should carry only the identifiers and metadata needed for processing, correlation, observability, and aggregate analysis.

## Current versus target context

| Area | Current | Target direction |
|---|---|---|
| User experience | Next.js pattern exploration application | Explore, Compare, Atlas, Composer, and AI Studio |
| Primary data source | Curated workspace content | PostgreSQL-backed catalog and project state |
| Document artifacts | Not yet established | MongoDB versioned blueprint and AI artifacts |
| Events | Not yet established | Kafka domain-event backbone and transactional outbox |
| Analytics | Not yet established | ClickHouse analytics and Grafana dashboards |
| Relationship queries | Curated code/content relationships | Derived graph projection and traversal |

## Related documents

- [Architecture overview](overview.md)
- [Application architecture](application-architecture.md)
- [Domain model](domain-model.md)
- [Data platform](data-platform.md)
- [Eventing model](eventing.md)
- [Product vision](../product/vision.md)
- [Security and data handling](../operations/security-and-data-handling.md)
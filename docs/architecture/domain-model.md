# Domain Model

> Status: Proposed  
> Last updated: 2026-08-12

This document defines the core business concepts and relationships used throughout StrataForge.

The domain model is independent of any individual storage technology. PostgreSQL, MongoDB, Kafka, ClickHouse, and the graph projection may represent these concepts differently, but they must share the same business meaning and stable identifiers.

For system ownership and integration boundaries, see [System context](system-context.md). For application code boundaries, see [Application architecture](application-architecture.md).

## Modeling principles

StrataForge uses the following domain-modeling rules:

- Every meaningful business concept has a stable identifier.
- Human-readable slugs are used for URLs, authoring references, and discoverability.
- UUIDs are used for durable database relationships and event aggregate identifiers.
- One system owns the authoritative state for each domain concept.
- Derived systems may store projections, but do not become the source of truth.
- Domain events describe meaningful business facts, not arbitrary database-row changes.
- AI-generated output is stored separately from curated knowledge and clearly labeled.
- Recommendations must preserve rationale, alternatives, source classification, and confidence.

## Core concepts

```text
Catalog
  Pattern
  Pattern variant
  Scenario
  Core language
  Technology
  Platform
  Code example

Compatibility
  Architecture layer
  Compatibility relationship
  Required adapter
  Caveat
  Alternative

User workspace
  User
  Organization
  Project
  Saved comparison

Solution planning
  Blueprint
  Blueprint layer
  Technology selection
  Recommendation
  Recommendation rationale
  Assumption
  Open question

AI Studio
  Generation request
  Generation artifact
  Validation result

Eventing
  Aggregate
  Domain event
  Projection
  Correlation ID
```

## Identity model

Every durable entity should use both an ID and a slug when appropriate.

```ts
type EntityIdentity = {
  id: string; // UUID
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Example:

```text
Technology ID:
0b038bd6-7e5c-4c75-9632-0d437394af73

Technology slug:
apache-kafka

Technology name:
Apache Kafka
```

### Identifier rules

| Identifier | Purpose |
|---|---|
| UUID | Database keys, foreign keys, event aggregate IDs, user-owned records |
| Slug | URLs, curated content references, readable internal references |
| Event ID | Unique event-processing and idempotency key |
| Correlation ID | Connects work caused by one user action or workflow |
| Causation ID | Identifies the event or command that caused another event |

## Catalog domain

The catalog is StrataForge’s curated knowledge base.

### Pattern

A reusable solution structure for a recurring software design problem.

```ts
type Pattern = EntityIdentity & {
  name: string;
  summary: string;
  category: PatternCategory;
  layer?: PatternLayer;
  status: "active" | "legacy" | "emerging";
};
```

Examples:

```text
Adapter
Facade
Abstract Factory
Repository
Saga
Circuit Breaker
```

### Pattern variant

A concrete implementation or adaptation of a pattern for a language, framework, platform, or scenario.

```ts
type PatternVariant = EntityIdentity & {
  patternId: string;
  title: string;
  coreLanguageSlug?: string;
  technologySlug?: string;
  layer?: PatternLayer;
  summary?: string;
};
```

Examples:

```text
Adapter using TypeScript and Apollo Client
Adapter using Java and Apache Kafka
Repository using TypeORM
```

### Scenario

A concrete implementation context used to connect patterns and technologies.

```ts
type Scenario = EntityIdentity & {
  name: string;
  summary: string;
  problemStatement: string;
  status: "active" | "draft" | "archived";
};
```

Examples:

```text
Third-party task API integration
Event-driven order processing
Real-time analytics pipeline
Multi-tenant SaaS application
```

A scenario may reference many patterns, technologies, examples, and curated blueprints.

### Core language

A programming language used as the primary implementation language for examples or technology decisions.

```ts
type CoreLanguage = EntityIdentity & {
  name: string;
  ecosystem?: string;
  status: "active" | "legacy" | "emerging";
};
```

Examples:

```text
TypeScript
Java
Python
GraphQL
R
Apex
ColdFusion
COBOL
VBScript
ActionScript
```

### Technology

A software implementation choice that may represent a framework, library, database, message broker, cloud service, runtime, or observability tool.

```ts
type Technology = EntityIdentity & {
  name: string;
  kind: TechnologyKind;
  summary: string;
  coreLanguageSlug?: string;
  status: "active" | "legacy" | "emerging";
};
```

```ts
type TechnologyKind =
  | "language"
  | "framework"
  | "library"
  | "database"
  | "message-broker"
  | "stream-processor"
  | "cloud-service"
  | "observability-tool"
  | "runtime"
  | "tool";
```

Examples:

```text
Apollo Client
TypeORM
Apache Kafka
Redpanda
Apache Flink
MongoDB
PostgreSQL
ClickHouse
Grafana
TensorFlow
Salesforce Apex
Railo
```

### Platform

A platform represents an execution, deployment, or ecosystem context that may contain multiple technologies.

```ts
type Platform = EntityIdentity & {
  name: string;
  kind: "cloud" | "runtime" | "ecosystem" | "deployment-platform";
  summary: string;
};
```

Examples:

```text
Node.js
Salesforce Platform
AWS
Google Cloud
Azure
Kubernetes
```

### Code example

A code example is a curated implementation artifact associated with a pattern, variant, scenario, language, or technology.

```ts
type CodeExample = EntityIdentity & {
  title: string;
  language: string;
  code: string;
  patternId?: string;
  patternVariantId?: string;
  scenarioId?: string;
  technologyId?: string;
  sourceType: "curated" | "generated" | "imported";
};
```

Curated code remains source-controlled initially. Database records can store metadata, rendered code, checksums, and source references without replacing authored source files as the immediate authoring workflow.

## Architecture-layer domain

Architecture layers describe where a pattern or technology primarily contributes to a solution.

```ts
type PatternLayer =
  | "presentation"
  | "application"
  | "domain"
  | "data"
  | "integration"
  | "infrastructure";
```

| Layer | Responsibility | Examples |
|---|---|---|
| Presentation | User interaction, rendering, client behavior | React, Next.js, D3.js |
| Application | Use cases, workflow orchestration, commands | Services, handlers, orchestrators |
| Domain | Business rules and core models | Domain Model, Value Object, Specification |
| Data | Persistence, querying, storage | PostgreSQL, MongoDB, TypeORM |
| Integration | External systems, APIs, events, adapters | Adapter, Kafka, REST, GraphQL |
| Infrastructure | Runtime, deployment, observability, resilience | Kubernetes, Grafana, Circuit Breaker |

A technology or pattern may contribute to more than one layer. The primary layer supports browsing and filtering; relationship metadata can capture cross-layer responsibilities.

## Compatibility domain

Compatibility describes whether two technologies or architecture choices work together in a particular context.

### Compatibility relationship

```ts
type CompatibilityRelationship = EntityIdentity & {
  sourceTechnologyId: string;
  targetTechnologyId: string;
  contextType?: "scenario" | "pattern" | "layer" | "general";
  contextId?: string;

  status: CompatibilityStatus;
  rationale: string;

  requiredAdapterId?: string;
  caveatIds?: string[];
  alternativeTechnologyIds?: string[];

  sourceClassification: SourceClassification;
  confidence: CompatibilityConfidence;
};
```

```ts
type CompatibilityStatus =
  | "recommended"
  | "supported"
  | "supported-with-adapter"
  | "caveat"
  | "not-recommended"
  | "incompatible";
```

```ts
type SourceClassification =
  | "curated"
  | "deterministically-inferred"
  | "ai-generated";
```

```ts
type CompatibilityConfidence =
  | "high"
  | "medium"
  | "low";
```

### Required adapter

A required adapter is an explicit integration component, protocol, library, or boundary needed to make two otherwise separate systems work together.

Examples:

```text
REST client between application service and third-party API
Kafka Connect connector between MongoDB and Kafka
Database driver between an ORM and PostgreSQL
GraphQL client between browser application and GraphQL API
```

### Caveat

A caveat records a meaningful tradeoff, operational requirement, limitation, licensing concern, migration cost, or support boundary.

Examples:

```text
Requires schema-registry governance.
Requires a replica set for MongoDB change streams.
May add operational complexity for a small single-service product.
Requires an adapter for framework compatibility.
```

## User workspace domain

The user workspace domain represents user-owned work and access boundaries.

### User

```ts
type User = EntityIdentity & {
  email: string;
  displayName?: string;
  status: "active" | "invited" | "disabled";
};
```

### Organization

```ts
type Organization = EntityIdentity & {
  name: string;
  plan?: "free" | "team" | "enterprise";
};
```

### Project

A project groups saved comparisons, blueprints, requirements, and user-selected decisions.

```ts
type Project = EntityIdentity & {
  organizationId?: string;
  ownerUserId: string;
  name: string;
  summary?: string;
  status: "active" | "archived";
};
```

### Saved comparison

A saved comparison records a contextual decision between exactly two options.

```ts
type SavedComparison = EntityIdentity & {
  projectId?: string;
  contextType: "scenario" | "pattern" | "feature" | "layer";
  contextId: string;

  leftTechnologyId: string;
  rightTechnologyId: string;

  selectedTechnologyId?: string;
  rationale?: string;
};
```

A comparison is always contextual. StrataForge should not present a universal winner without identifying the scenario, feature, pattern, or architecture layer being evaluated.

## Blueprint domain

A blueprint is the central solution-planning aggregate.

```ts
type Blueprint = EntityIdentity & {
  projectId?: string;
  scenarioId?: string;
  title: string;
  summary?: string;

  mode: BlueprintMode;
  status: BlueprintStatus;

  sourceClassification: SourceClassification;
  createdByType: "user" | "system" | "ai";
  createdById?: string;
};
```

```ts
type BlueprintMode =
  | "curated"
  | "composer"
  | "ai-studio";
```

```ts
type BlueprintStatus =
  | "draft"
  | "validating"
  | "ready"
  | "archived"
  | "failed";
```

### Blueprint layer

A blueprint contains one or more layers.

```ts
type BlueprintLayer = EntityIdentity & {
  blueprintId: string;
  layer: PatternLayer;
  position: number;

  summary?: string;
  selectedTechnologyIds: string[];

  rationale: string;
  alternativeTechnologyIds?: string[];
  compatibilityStatus: CompatibilityStatus;
};
```

Example:

```text
Blueprint:
Third-party task API integration

Layers:
Presentation     → Next.js
Application      → TypeScript service layer
Integration      → Adapter + REST client
Data             → PostgreSQL + TypeORM
Eventing         → Kafka or Redpanda
Observability    → ClickHouse + Grafana
```

### Recommendation

A recommendation is an explainable suggestion, not simply a selected technology.

```ts
type Recommendation = EntityIdentity & {
  blueprintId?: string;
  scenarioId?: string;
  layer?: PatternLayer;

  recommendedTechnologyId?: string;
  recommendedPatternId?: string;

  sourceClassification: SourceClassification;
  confidence: CompatibilityConfidence;

  rationale: string;
  alternativeIds?: string[];
  caveatIds?: string[];
};
```

### Assumption and open question

AI Studio and early blueprint creation should preserve uncertainty explicitly.

```ts
type Assumption = EntityIdentity & {
  blueprintId: string;
  statement: string;
  validatedAt?: Date;
};
```

```ts
type OpenQuestion = EntityIdentity & {
  blueprintId: string;
  question: string;
  impact: "low" | "medium" | "high";
  status: "open" | "resolved" | "deferred";
};
```

## AI Studio domain

AI Studio generates structured drafts, not unverified product truth.

### Generation request

```ts
type GenerationRequest = EntityIdentity & {
  projectId?: string;
  requestedByUserId?: string;

  prompt: string;
  scenarioId?: string;

  status: "queued" | "processing" | "completed" | "failed";
  correlationId: string;
};
```

### Generation artifact

A generation artifact preserves the validated output from an AI-assisted workflow.

```ts
type GenerationArtifact = EntityIdentity & {
  generationRequestId: string;
  blueprintId?: string;

  provider: string;
  model?: string;

  outputSchemaVersion: number;
  validationStatus: "valid" | "invalid" | "partially-valid";

  sourceClassification: "ai-generated";
  createdAt: Date;
};
```

The artifact may contain a structured blueprint draft, implementation guidance, code suggestions, assumptions, and open questions.

Raw provider output should not be treated as validated until it passes shared schema validation and compatibility checks.

## Eventing domain

### Aggregate

An aggregate is a business entity whose lifecycle produces meaningful domain events.

Initial event-producing aggregates include:

```text
Technology
Scenario
CompatibilityRelationship
Blueprint
SavedComparison
GenerationRequest
```

### Domain event

```ts
type DomainEvent<TPayload> = {
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

Examples:

```text
catalog.technology.updated.v1
catalog.scenario.updated.v1
compatibility.relationship.updated.v1
atlas.blueprint.created.v1
atlas.composer.stack.updated.v1
ai.generation.completed.v1
```

### Projection

A projection is a derived representation built from canonical records or domain events.

Examples:

```text
MongoDB blueprint document
Graph technology relationship
ClickHouse event-log row
Grafana dashboard metric
Search index document
```

A projection must be rebuildable. It does not own canonical state.

## Relationship model

```text
CoreLanguage
  └── supports → Technology

Pattern
  └── has many → PatternVariant
  └── applies to many → Scenario
  └── has many → CodeExample

Scenario
  └── uses many → Pattern
  └── uses many → Technology
  └── has many → CodeExample
  └── has many → Blueprint

Technology
  └── compatible with → Technology
  └── requires → Adapter
  └── has many → Caveat
  └── belongs to many → ArchitectureLayer

Project
  └── owns many → SavedComparison
  └── owns many → Blueprint
  └── owns many → GenerationRequest

Blueprint
  └── has many → BlueprintLayer
  └── has many → Recommendation
  └── has many → Assumption
  └── has many → OpenQuestion
  └── may have one or more → GenerationArtifact
```

## Data ownership

| Domain area | Authoritative owner | Derived consumers |
|---|---|---|
| Curated catalog records | PostgreSQL target database | Kafka, ClickHouse, graph projection |
| User, organization, and project state | PostgreSQL target database | Kafka, MongoDB, ClickHouse |
| Blueprint state | PostgreSQL target database | MongoDB, graph projection, ClickHouse |
| AI generation artifacts | MongoDB target document store | Kafka, ClickHouse |
| Event transport | Kafka target event backbone | Workers, projections, real-time gateway |
| Analytics | ClickHouse target analytical store | Grafana |
| Relationship traversal | Graph projection | Application query services |

## Domain invariants

The following rules should be enforced through schemas, domain services, database constraints, or compatibility validation.

- A `SavedComparison` contains exactly two compared options.
- A comparison requires a context.
- A `BlueprintLayer` belongs to exactly one `Blueprint`.
- A blueprint may contain multiple architecture layers, but no duplicate primary layer positions.
- A recommendation must contain a rationale.
- An AI-generated recommendation must be identified as `ai-generated`.
- An incompatible technology pair cannot be marked as selected without an explicit override and recorded rationale.
- A projection cannot become the authoritative source of a catalog or project record.
- Domain events require a unique ID, type, version, aggregate identity, and correlation ID.
- Event consumers must tolerate duplicate delivery.

## Current and proposed status

| Area | Current state | Target direction |
|---|---|---|
| Patterns and variants | Curated workspace content and shared schemas | PostgreSQL-backed catalog with source-controlled authored content |
| Scenarios and technologies | Early curated content model | Structured catalog and compatibility graph |
| User projects and saved decisions | Not yet established | PostgreSQL transactional state |
| Blueprints | Not yet established | Curated, composed, and AI-assisted blueprint aggregates |
| AI artifacts | Not yet established | MongoDB versioned document artifacts |
| Domain events | Not yet established | Transactional outbox and Kafka event contracts |
| Analytics and graph relationships | Not yet established | ClickHouse/Grafana and derived graph projections |

## Related documents

- [Architecture overview](overview.md)
- [System context](system-context.md)
- [Application architecture](application-architecture.md)
- [Data platform](data-platform.md)
- [Eventing model](eventing.md)
- [Product vision](../product/vision.md)
- [Domain glossary](../product/glossary.md)
- [Architecture Decision Records](../decisions/README.md)
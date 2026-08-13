# StrataForge Roadmap

> Status: In progress  
> Last updated: 2026-08-13

This roadmap describes the planned evolution of StrataForge from a curated pattern-exploration application into an architecture intelligence and full-stack blueprint platform.

The roadmap is outcome-oriented, not date-based. Priorities may change as implementation findings, user feedback, operational constraints, and product opportunities emerge.

For product intent, see [Product vision](../product/vision.md). For the target technical architecture, see [Architecture overview](../architecture/overview.md).

## Product direction

StrataForge will help users:

```text
Explore
  Browse patterns, scenarios, languages, technologies, platforms,
  and implementation examples.

Compare
  Compare exactly two technologies or approaches within a meaningful context.

Atlas
  Start from curated, explainable end-to-end architecture blueprints.

Composer
  Assemble a compatible stack layer by layer.

AI Studio
  Generate validated architecture and implementation plans from
  freeform requirements.
```

## Delivery principles

Roadmap work should follow these principles:

- Keep `main` buildable and CI-validated.
- Deliver working vertical slices instead of creating all infrastructure in advance.
- Use PostgreSQL as the first canonical data foundation.
- Introduce specialized data systems only when their workload is real.
- Keep user-facing product work connected to measurable outcomes.
- Make recommendations explainable and source-classified.
- Treat AI output as untrusted until validated.
- Preserve clear ownership boundaries between canonical records and derived projections.
- Document major architecture choices through ADRs.
- Avoid treating proposed architecture as already deployed capability.

## Current baseline

### Completed

```text
- Public product rebrand from Pattern Atlas to StrataForge.
- Public GitHub repository under jsonRUHLS/strataforge.
- GitHub Actions CI workflow.
- pnpm installation, lint, and production-build validation.
- Initial build-stability repair.
- Documentation-system foundation.
- Product vision, glossary, capability model, and roadmap direction.
- Architecture overview, system context, application architecture,
  domain model, data platform, and eventing documentation.
- Initial architecture decision records.
```

### Current state

```text
- Next.js web application.
- pnpm monorepo.
- Curated pattern and implementation-example content.
- Shared schemas, UI, content, and integration packages.
- GitHub Actions quality checks.
- No PostgreSQL, MongoDB, Kafka, ClickHouse, Grafana,
  graph store, or event worker implementation yet.
```

## Phase 0: Documentation and product foundation

> Status: In progress

### Goal

Establish a shared product story, documentation system, architecture boundaries, contribution workflow, and decision record process before introducing the data platform.

### Outcomes

```text
- Complete repository README and documentation index.
- Complete product, architecture, development, operations,
  planning, and ADR documentation foundations.
- Establish current-versus-proposed status labels.
- Establish branch, commit, pull-request, and CI expectations.
- Establish shared vocabulary for patterns, scenarios, technologies,
  compatibility, blueprints, and events.
```

### Exit criteria

```text
- Documentation links are valid.
- README explains current capabilities and future direction.
- ADR-0001 through ADR-0003 are accepted.
- Development and contribution workflows are documented.
- Documentation pull request passes CI and is merged.
```

## Phase 1: Relational catalog foundation

> Status: Planned

### Goal

Introduce PostgreSQL as the canonical transactional store for the StrataForge catalog and begin migrating curated metadata from source-only content into structured records.

### Scope

```text
- Create packages/database.
- Select and configure migration tooling.
- Add PostgreSQL local-development configuration.
- Define initial relational schema.
- Add database migrations.
- Add seed/import process for curated content.
- Add repository and query interfaces.
- Add database-backed catalog read paths.
- Preserve source-controlled content as the authored source.
```

### Initial catalog entities

```text
CoreLanguage
Technology
Platform
Pattern
PatternVariant
Scenario
CodeExample metadata
TechnologyCompatibility
CompatibilityCaveat
RequiredAdapter
```

### First vertical slice

```text
Adapter pattern
→ Third-party task API scenario
→ TypeScript
→ Apollo Client and TypeORM examples
→ PostgreSQL-backed catalog query
→ Existing Browse experience
```

### Exit criteria

```text
- PostgreSQL migrations run locally.
- Curated catalog metadata is seeded or imported.
- The Adapter scenario is rendered from a database-backed query.
- Existing Browse behavior remains functional.
- Database code is isolated from route and UI components.
- CI validates the new package and build.
```

## Phase 2: Contextual Compare foundation

> Status: Planned

### Goal

Evolve Compare from pattern-oriented viewing into a contextual two-option technology decision workflow.

### Scope

```text
- Define comparison contexts:
  scenario, pattern, feature, or architecture layer.

- Define comparison targets:
  framework, language, database, broker, cloud service,
  library, runtime, or platform.

- Support exactly two compared options.

- Add compatibility, caveat, alternative, and adapter relationships.

- Add explainable recommendation output.

- Allow authenticated users to save comparisons when identity
  and project support are introduced.
```

### Example workflow

```text
Context:
Third-party task API integration

Comparison:
Apollo Client versus REST client

Output:
- Scenario fit
- Required integration boundary
- Code examples
- Tradeoffs
- Compatibility notes
- Recommendation with rationale
```

### Exit criteria

```text
- Every comparison includes a context.
- Every comparison evaluates exactly two options.
- Comparison results include rationale and tradeoffs.
- Recommendations identify their source classification.
- Compatibility rules are represented as shared domain data.
```

## Phase 3: Blueprint and recommendation foundation

> Status: Planned

### Goal

Introduce curated solution blueprints and deterministic compatibility guidance.

### Scope

```text
- Define Blueprint and BlueprintLayer schemas.
- Add curated Atlas blueprint records.
- Add recommendation and alternative relationships.
- Add architecture-layer selection model.
- Add deterministic compatibility validation.
- Add rationale, caveat, and required-adapter display.
- Add initial project and saved-blueprint model.
```

### Initial architecture layers

```text
Presentation
Application
Domain
Data
Integration
Infrastructure
```

### First blueprint

```text
Third-party task API integration

Presentation:
Next.js

Application:
TypeScript service layer

Integration:
Adapter and API client

Data:
PostgreSQL and TypeORM

Eventing:
Kafka-compatible broker

Observability:
ClickHouse and Grafana
```

### Exit criteria

```text
- At least one curated Atlas blueprint is available.
- Each selected technology has rationale.
- Alternatives and caveats are visible.
- Blueprint data has a canonical owner.
- Compatibility checks are deterministic and testable.
```

## Phase 4: PostgreSQL outbox and Kafka foundation

> Status: Planned

### Goal

Introduce reliable domain-event publication for canonical state changes.

### Scope

```text
- Create packages/events.
- Define shared event envelope and payload schemas.
- Add PostgreSQL outbox table.
- Add outbox publisher worker.
- Configure Kafka-compatible local development.
- Add initial Kafka topics.
- Add initial idempotent consumer.
- Add retry and dead-letter strategy.
- Add correlation and causation identifiers.
```

### Initial events

```text
catalog.technology.updated.v1
catalog.scenario.updated.v1
compatibility.relationship.updated.v1
atlas.blueprint.created.v1
atlas.blueprint.updated.v1
composer.stack.updated.v1
```

### Exit criteria

```text
- Canonical write and outbox record are atomic.
- Outbox publisher sends events to Kafka.
- At least one consumer processes events idempotently.
- Failed events have bounded retries and dead-letter handling.
- Event contracts are versioned and schema-validated.
- Event flow is documented and testable.
```

## Phase 5: ClickHouse and Grafana observability

> Status: Planned

### Goal

Capture product and operational events in ClickHouse and visualize platform health with Grafana.

### Scope

```text
- Add ClickHouse local-development configuration.
- Ingest sanitized Kafka events.
- Create raw event-log table.
- Add initial materialized views.
- Add product-event taxonomy.
- Add Grafana data source and initial dashboards.
- Add outbox, consumer lag, and failure dashboards.
- Define alert candidates after baseline behavior is measured.
```

### Initial dashboards

```text
Product:
- Explore usage
- Compare usage
- Atlas starts and completion rate
- Recommendation acceptance rate

Reliability:
- Outbox backlog
- Kafka throughput
- Consumer lag
- Retry count
- Dead-letter volume
- ClickHouse ingestion health
```

### Exit criteria

```text
- Sanitized events are queryable in ClickHouse.
- Grafana shows product and event-pipeline dashboards.
- Sensitive values are excluded from analytical payloads.
- Consumer lag and outbox health are visible.
- At least one actionable alert path is documented.
```

## Phase 6: MongoDB document artifacts

> Status: Planned

### Goal

Add MongoDB for flexible, versioned blueprint documents and AI-generation artifacts.

### Scope

```text
- Create packages/documents.
- Configure MongoDB local development.
- Define AI generation request and artifact collections.
- Define versioned blueprint document collection.
- Add document repository interfaces.
- Add MongoDB change-stream event integration where needed.
- Add document-projection lifecycle events.
```

### Initial collections

```text
atlas_blueprint_documents
ai_generation_requests
ai_generation_artifacts
generated_code_bundles
integration_snapshots
```

### Exit criteria

```text
- Blueprint documents can be versioned safely.
- AI artifacts are stored separately from canonical blueprint state.
- Document lifecycle events do not duplicate canonical business events.
- Document projections preserve event and aggregate metadata.
- Authorization boundaries apply to user-owned artifacts.
```

## Phase 7: Graph projection and explanation

> Status: Planned

### Goal

Introduce a derived graph projection for relationship traversal and recommendation explanation.

### Scope

```text
- Select graph-store technology.
- Create packages/graph.
- Add graph projection worker.
- Project scenarios, patterns, technologies, compatibility,
  adapters, blueprints, and recommendations.
- Add related-content queries.
- Add recommendation-explanation queries.
```

### Initial relationships

```text
Scenario → uses → Pattern
Scenario → uses → Technology
Pattern → has variant → PatternVariant
Technology → uses language → CoreLanguage
Technology → compatible with → Technology
Technology → requires adapter → Technology
Blueprint → contains → BlueprintLayer
BlueprintLayer → recommends → Technology
```

### Exit criteria

```text
- Graph projection is rebuildable from canonical data and events.
- Technology alternatives can be traversed.
- Required adapters can be explained.
- Recommendation rationale can include relationship paths.
- Graph data is not treated as the canonical source of truth.
```

## Phase 8: Composer

> Status: Planned

### Goal

Allow users to compose a custom technology stack layer by layer and receive real-time compatibility guidance.

### Scope

```text
- Add Composer user experience.
- Add architecture-layer technology selection.
- Validate compatibility relationships.
- Display recommended, supported, caveat, and incompatible states.
- Support required-adapter recommendations.
- Support rationale for overrides.
- Persist user-owned custom blueprints.
```

### Compatibility statuses

```text
Recommended
Supported
Supported with adapter
Caveat
Not recommended
Incompatible
```

### Exit criteria

```text
- Users can select technologies by architecture layer.
- Compatibility checks are deterministic and explainable.
- Incompatible selections require an explicit override path.
- Overrides record user rationale when relevant.
- Composer blueprints can be saved and revisited.
```

## Phase 9: AI Studio

> Status: Planned

### Goal

Provide AI-assisted architecture and implementation planning while preserving validation, explainability, source classification, and user control.

### Scope

```text
- Add provider-neutral AI integration interface.
- Add requirement intake.
- Retrieve relevant curated context.
- Apply deterministic compatibility filtering.
- Generate structured blueprint drafts.
- Validate output with shared schemas.
- Extract assumptions and open questions.
- Persist AI artifacts.
- Stream generation progress with Server-Sent Events.
- Clearly identify AI-generated recommendations.
```

### Target workflow

```text
User requirement
→ structured requirement extraction
→ curated context retrieval
→ compatibility filtering
→ AI provider request
→ schema validation
→ recommendation classification
→ blueprint artifact
→ user review, editing, and saving
```

### Exit criteria

```text
- AI output is schema-validated.
- Recommendations identify their source classification.
- Assumptions and open questions are visible.
- Private data handling is documented and enforced.
- AI workflow does not require live-provider calls in normal CI.
- Users can save, revise, and distinguish AI-generated artifacts.
```

## Phase 10: Operational maturity

> Status: Planned

### Goal

Prepare the platform for reliable multi-user, organization-aware, and commercially operated use.

### Scope

```text
- Authentication and authorization.
- Organization and membership model.
- Environment separation.
- Secret management.
- Data retention and deletion workflows.
- Dependency and security scanning.
- Migration verification.
- Performance and load testing.
- Incident-response runbooks.
- Deployment and release workflow.
- Future transfer of repository ownership to RuhlinIT.
```

### Exit criteria

```text
- User and organization access boundaries are enforced.
- Production secrets are managed outside source control.
- Database and event migrations have documented procedures.
- Observability supports actionable operational response.
- Data retention and deletion behavior is documented.
- Deployment and rollback processes are documented and tested.
```

## Backlog candidates

The following are valuable but should not block the core platform phases:

```text
Public API
SDKs
IDE integrations
GitHub App
Collaborative blueprint editing
Blueprint export formats
Template marketplace
Technology change notifications
Import from existing architecture documentation
Organization knowledge bases
Custom compatibility rules
Custom AI-provider support
Billing and commercial plan management
```

## Roadmap maintenance

Update this roadmap when:

```text
A phase is started, completed, deferred, split, or reprioritized.

A major architecture decision changes delivery order.

A proposed feature becomes current implementation.

A new dependency or operational constraint changes the plan.

User feedback changes the product priority.
```

Do not update the roadmap merely to reflect optimistic estimates. Keep it accurate, outcome-oriented, and clear about what is current, in progress, planned, or deferred.

## Related documents

- [Product vision](../product/vision.md)
- [Capabilities](../product/capabilities.md)
- [Architecture overview](../architecture/overview.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Architecture Decision Records](../decisions/README.md)
- [Delivery phases](delivery-phases.md)
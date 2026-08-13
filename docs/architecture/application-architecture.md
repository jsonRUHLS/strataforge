# Application Architecture

> Status: In progress  
> Last updated: 2026-08-12

This document describes the internal application structure of StrataForge: the current pnpm workspace, the responsibilities of each package, and the target application boundaries for the next development phases.

For the external system boundary, see [System context](system-context.md). For target data ownership and event flows, see [Data platform](data-platform.md) and [Eventing model](eventing.md).

## Architecture goals

The StrataForge application architecture should:

- Keep product UI, domain contracts, curated content, data access, and external integrations separate.
- Allow the current content-driven application to evolve into a database-backed platform incrementally.
- Keep business rules independent of Next.js route and component code.
- Prevent direct data-store, Kafka, or AI-provider calls from leaking into UI components.
- Support explainable recommendations, compatibility validation, and future real-time updates.
- Make shared package contracts explicit and type-safe.

## Current workspace

StrataForge is a pnpm workspace with one primary Next.js application and shared packages.

```text
StrataForge
│
├── apps/
│   └── pattern-atlas-web/
│       ├── app/
│       │   ├── browse and pattern routes
│       │   ├── compare routes
│       │   ├── layouts and metadata
│       │   └── route-specific UI
│       │
│       ├── components/
│       │   └── application-specific components
│       │
│       └── public/
│           └── static application assets
│
├── packages/
│   ├── content/
│   │   └── curated patterns, scenarios, and implementation examples
│   │
│   ├── schemas/
│   │   └── shared TypeScript domain contracts and validation schemas
│   │
│   ├── ui/
│   │   └── reusable UI components and styles
│   │
│   └── integrations/
│       └── integration helpers and external-service adapters
│
├── docs/
│   └── product, architecture, decisions, development,
│       operations, and planning documentation
│
└── .github/
    └── GitHub Actions workflows
```

The `apps/pattern-atlas-web` and `@atlas-patterns/*` names are current internal technical identifiers. The public product name is StrataForge. Internal namespace migration, if pursued, should be a separate controlled change.

## Current application flow

The current application is primarily content-driven.

```text
Browser request
  ↓
Next.js route
  ↓
Route component and application-specific UI
  ↓
Shared schemas, curated content, and UI packages
  ↓
Rendered pattern, comparison, and implementation-example experience
```

The application currently provides a foundation for:

- Pattern discovery.
- Pattern and variant exploration.
- Cross-language implementation examples.
- Pattern-oriented comparison experiences.
- Shared UI and schema reuse through workspace packages.

## Package responsibilities

### `apps/pattern-atlas-web`

The Next.js application owns:

- Routes, layouts, metadata, and page composition.
- Application-specific UI behavior.
- User-facing navigation and product experiences.
- Server-side route handlers and future API boundaries.
- Authentication and authorization integration when introduced.
- Presentation of recommendation rationale, compatibility results, and AI output.
- Future Server-Sent Event or WebSocket client integration.

The web application should not directly own:

- Kafka producer or consumer processes.
- MongoDB change-stream processors.
- ClickHouse analytical ingestion.
- Graph projections.
- Cross-domain compatibility rules.
- Unvalidated AI provider responses.

### `packages/content`

The content package owns curated, authored knowledge that is safe to version with source code.

Examples include:

- Pattern descriptions.
- Scenario descriptions.
- Curated implementation examples.
- Language- and framework-specific variants.
- Authored documentation content.
- Initial seed data before catalog migration.

During the data-platform transition, this package remains the authored source for curated example content. Structured metadata may be imported or synchronized into PostgreSQL without making the database the authoring interface immediately.

### `packages/schemas`

The schemas package owns shared domain contracts.

Examples include:

- `Pattern`.
- `PatternVariant`.
- `PatternLayer`.
- `Scenario`.
- `Technology`.
- `Compatibility`.
- `AtlasBlueprint`.
- Event envelopes and event payload schemas.
- API request and response contracts.
- Validation schemas for AI-generated structured output.

This package should not contain:

- Database queries.
- Next.js components.
- Kafka clients.
- Environment-specific configuration.
- Provider-specific AI SDK calls.

A schema is the shared language between the web application, database layer, event workers, integrations, and future external APIs.

### `packages/ui`

The UI package owns reusable presentational components and shared styling.

Examples include:

- Buttons.
- Cards.
- Badges.
- Form controls.
- Layout primitives.
- Shared visual states.
- Accessibility-oriented interaction components.

The package may currently include some Next.js-aware components, such as link components. Over time, framework-neutral primitives and Next.js-specific components should be separated if reuse outside the Next.js application becomes necessary.

The UI package should not contain:

- Product-specific routes.
- Business decisions.
- Data access.
- Event publication.
- Technology compatibility logic.

### `packages/integrations`

The integrations package owns provider and external-system boundaries.

Examples include:

- AI provider adapters.
- Third-party API clients.
- Documentation retrieval adapters.
- External technology metadata adapters.
- Future identity-provider adapters.
- Future managed-service client configuration.

All integrations should expose provider-neutral interfaces where practical.

For example:

```ts
export interface ArchitectureGenerationProvider {
  generateBlueprint(input: BlueprintGenerationInput): Promise<BlueprintDraft>;
}
```

The web application and domain services should depend on the interface, not directly on a vendor-specific SDK.

## Target package architecture

The target architecture adds explicit domain, persistence, event, document, graph, and recommendation boundaries.

```text
apps/
  pattern-atlas-web/
    Presentation and route layer

  event-worker/
    Outbox publisher, Kafka consumers, projections,
    asynchronous processing, retries, dead-letter handling

packages/
  content/
    Curated authored source content

  schemas/
    Domain contracts, Zod schemas, event contracts,
    API contracts, validation rules

  ui/
    Reusable presentation components

  database/
    PostgreSQL client, migrations, repositories,
    transactional outbox support

  events/
    Kafka configuration, topic definitions,
    event producers, consumer interfaces

  documents/
    MongoDB client and document repositories

  graph/
    Graph client, projection handlers, traversal queries

  recommendations/
    Compatibility rules, deterministic scoring,
    rationale construction, alternatives

  integrations/
    AI and external-provider adapters
```

The exact package names may evolve, but the responsibility boundaries should remain stable.

## Target request flow

The primary application request path should use clear separation between presentation, domain logic, and infrastructure.

```text
Browser
  ↓
Next.js route or route handler
  ↓
Application service or command/query handler
  ↓
Domain validation and recommendation logic
  ↓
Repository or integration interface
  ↓
PostgreSQL, MongoDB, graph store, or external provider
  ↓
Validated response model
  ↓
Rendered UI response
```

### Query flow

Queries retrieve information without changing business state.

```text
User opens a scenario
  ↓
Scenario query handler
  ↓
Catalog repository
  ↓
PostgreSQL-backed catalog record
  ↓
Compatibility and related-content queries
  ↓
Validated view model
  ↓
Explore or Compare UI
```

### Command flow

Commands create or update business state.

```text
User saves an Atlas blueprint
  ↓
Blueprint command handler
  ↓
Validation and authorization
  ↓
PostgreSQL transaction
  ├── Save blueprint state
  └── Save transactional outbox event
          ↓
     Return confirmed blueprint to user
          ↓
     Background publisher sends event to Kafka
```

### AI Studio flow

AI Studio must not send a raw provider response directly to the user as product truth.

```text
User requirement
  ↓
Requirement validation
  ↓
Retrieve curated scenarios, technologies, and compatibility context
  ↓
Apply deterministic compatibility filtering
  ↓
Call AI-provider adapter
  ↓
Validate structured response against shared schemas
  ↓
Classify recommendations by source and confidence
  ↓
Persist approved generation artifact
  ↓
Return blueprint, assumptions, alternatives, and open questions
```

## Domain boundaries

The application should use these domain areas as it evolves:

| Domain | Responsibility |
|---|---|
| Catalog | Patterns, scenarios, languages, technologies, platforms, examples |
| Compatibility | Technology relationships, adapters, caveats, alternatives, rules |
| Compare | Contextual two-option comparison and recommendation explanation |
| Blueprint | Atlas templates, Composer selections, saved architecture plans |
| AI Studio | Requirement interpretation, generation orchestration, validation |
| Identity | Users, organizations, permissions, ownership |
| Events | Domain-event contracts, publication, processing, observability |
| Analytics | Product telemetry, performance, operational event analysis |

A domain should communicate through explicit contracts and events rather than importing implementation details from another domain.

## API boundaries

The initial application can use Next.js server components and route handlers. As application complexity grows, define API boundaries by user-facing capability rather than by database table.

Examples:

```text
GET  /api/scenarios/:slug
GET  /api/compare
POST /api/blueprints
GET  /api/blueprints/:id
POST /api/blueprints/:id/compose
POST /api/ai/generations
GET  /api/ai/generations/:id
GET  /api/events/stream
```

These routes are examples of future boundaries, not a committed public API contract.

Public APIs should use versioning and explicit schemas once third-party integrations or external clients are supported.

## Real-time updates

StrataForge will use real-time updates for long-running, asynchronous user workflows.

Initial use cases include:

- AI generation progress.
- Blueprint generation completion.
- Stack compatibility validation completion.
- Import or synchronization status.
- Comparison analysis completion.

The initial delivery approach should use Server-Sent Events for one-way progress updates.

```text
Kafka event
  ↓
Real-time notification consumer
  ↓
Server-Sent Event gateway
  ↓
Browser client
```

WebSockets should be introduced only when StrataForge requires bidirectional real-time interaction, such as collaborative blueprint editing.

## Dependency rules

The following dependency direction should be preserved:

```text
apps
  → packages/ui
  → packages/schemas
  → packages/recommendations
  → packages/database, packages/documents, packages/graph
  → packages/events
  → packages/integrations
```

In practice:

- UI components may depend on schemas for view contracts.
- Application routes may depend on domain services and repository interfaces.
- Domain logic may depend on schemas and abstractions.
- Infrastructure packages may depend on schemas.
- Schemas must not depend on application routes, UI packages, or infrastructure clients.
- Event consumers must not import Next.js route or component code.
- Database repositories must not render UI or call AI providers.

## Error handling

Errors should be explicit, categorized, and safe for users.

```text
Validation error
  Invalid request or schema mismatch.

Authorization error
  User lacks access to the requested resource.

Not found error
  Requested entity does not exist or is unavailable.

Compatibility error
  Selected technologies violate a compatibility rule.

Integration error
  External provider or dependency is unavailable.

Processing error
  An asynchronous job or event consumer failed.
```

User-facing responses should provide actionable messages without exposing credentials, internal connection details, raw provider errors, or private event payloads.

## Testing strategy

The target application testing strategy should include:

| Test type | Primary focus |
|---|---|
| Unit tests | Domain rules, compatibility logic, schema validation |
| Component tests | Shared UI behavior and accessibility |
| Integration tests | Repositories, event publishing, provider adapters |
| Route tests | API and server-side request behavior |
| End-to-end tests | Explore, Compare, Atlas, Composer, and AI Studio journeys |
| Contract tests | Event payloads, API schemas, provider adapters |

The current CI baseline runs linting and production builds. Test suites should be added incrementally with the domains they validate.

## Related documents

- [Architecture overview](overview.md)
- [System context](system-context.md)
- [Domain model](domain-model.md)
- [Data platform](data-platform.md)
- [Eventing model](eventing.md)
- [Product vision](../product/vision.md)
- [Testing and CI](../development/testing-and-ci.md)
- [Architecture Decision Records](../decisions/README.md)
# ADR-0001: Use a pnpm Monorepo with Explicit Package Boundaries

> Status: Accepted  
> Date: 2026-08-12

## Context

StrataForge is evolving from a content-driven Next.js application into an architecture intelligence platform with multiple product modes and specialized technical concerns.

The target product includes:

- Curated pattern, scenario, technology, and compatibility knowledge.
- Contextual technology comparison.
- Curated architecture blueprints through Atlas.
- User-composed stack blueprints through Composer.
- AI-assisted planning through AI Studio.
- A relational, document, event, analytical, and graph-oriented data platform.
- Shared schemas, event contracts, recommendation logic, and external integrations.

Without explicit boundaries, application routes, UI components, content models, database access, Kafka event logic, AI-provider calls, and graph traversal could become tightly coupled inside one Next.js application.

The repository already uses a pnpm workspace with one Next.js application and shared packages. This ADR formalizes that structure as the preferred architecture for StrataForge.

## Decision

StrataForge will use a pnpm monorepo with explicit application and package responsibilities.

The monorepo will contain:

```text
apps/
  pattern-atlas-web/
    Primary Next.js product application

  event-worker/
    Future asynchronous worker for outbox publishing,
    Kafka consumers, projections, retries, and event processing

packages/
  content/
    Curated authored content and implementation examples

  schemas/
    Shared domain contracts, Zod validation schemas,
    API contracts, and event schemas

  ui/
    Reusable user-interface components and styling

  integrations/
    AI-provider adapters, external API clients,
    and provider-neutral integration interfaces

  database/
    Future PostgreSQL client, migrations, repositories,
    and transactional-outbox support

  events/
    Future Kafka configuration, topic definitions,
    producers, consumer interfaces, and event utilities

  documents/
    Future MongoDB client and document repositories

  graph/
    Future graph client, projection handlers,
    and traversal query services

  recommendations/
    Future deterministic compatibility rules,
    scoring, alternatives, and rationale generation
```

The current repository directory names and package namespaces may retain legacy internal identifiers during the public StrataForge rebrand.

For example:

```text
apps/pattern-atlas-web
@atlas-patterns/schemas
@atlas-patterns/ui
```

These identifiers are technical implementation details. Renaming them is a separate migration decision and must not be mixed with product branding, data-platform development, or feature work.

## Package responsibilities

| Area | Responsibility | Must not own |
|---|---|---|
| `apps/pattern-atlas-web` | Routes, layouts, user-facing workflows, API boundaries, presentation composition | Kafka consumers, direct projection processing, shared domain ownership |
| `apps/event-worker` | Outbox publishing, Kafka consumption, retries, projections, dead-letter handling | Next.js routes, UI rendering |
| `packages/content` | Curated source-controlled knowledge and examples | Runtime database access, Kafka clients, user-specific state |
| `packages/schemas` | Shared types, Zod schemas, event/API contracts, validation definitions | UI, database queries, framework routes, provider SDK calls |
| `packages/ui` | Reusable components, styles, accessibility primitives | Domain decisions, data access, event publication |
| `packages/integrations` | External-provider adapters and interfaces | Product route composition, canonical business state |
| `packages/database` | PostgreSQL access, migrations, repositories, outbox persistence | UI, Kafka consumer workflows, AI-provider logic |
| `packages/events` | Event contracts, Kafka configuration, producer/consumer helpers | Canonical database ownership, UI behavior |
| `packages/documents` | MongoDB documents and repositories | Canonical relational ownership, UI rendering |
| `packages/graph` | Graph projections and traversal queries | Canonical catalog ownership |
| `packages/recommendations` | Compatibility logic, deterministic scoring, rationale construction | Direct UI rendering, provider-specific AI calls |

## Dependency direction

Dependencies should flow toward shared abstractions and infrastructure boundaries, never from foundational packages into applications.

```text
apps
  ↓
domain services and application handlers
  ↓
schemas, content, recommendations
  ↓
database, events, documents, graph, integrations
  ↓
external systems
```

The dependency rules are:

- Applications may depend on shared packages.
- Worker applications may depend on schemas, repositories, event utilities, and integrations.
- Shared schemas must not depend on applications, UI packages, database clients, or provider SDKs.
- UI packages must not depend on application routes, database clients, or Kafka clients.
- Content packages may depend on schemas but must not depend on runtime infrastructure.
- Recommendation logic may depend on schemas and curated domain data, but not directly on UI components.
- Infrastructure packages may depend on schemas, but must not depend on Next.js route code.
- Event consumers must not import browser, component, layout, or route implementation code.
- Provider-specific integration code must remain behind package interfaces where practical.

## Public product versus internal identity

The public product is:

```text
StrataForge
```

The primary future feature suite is:

```text
StrataForge Explore
StrataForge Compare
StrataForge Atlas
StrataForge Composer
StrataForge AI Studio
```

The current internal package namespace does not need to match the public product name immediately.

This separation avoids unnecessary migration risk during early architecture work:

```text
Public product identity:
StrataForge

Current internal namespace:
@atlas-patterns/*
```

A future namespace migration may move internal identifiers toward:

```text
@strataforge/*
apps/strataforge-web
```

That migration requires a dedicated ADR and implementation plan because it affects workspace package names, imports, lockfiles, CI configuration, build tooling, deployment references, and external package consumers.

## Consequences

### Positive

- Shared contracts can be reused across the web application, event workers, data repositories, and integrations.
- The existing Next.js application can evolve incrementally without a disruptive rewrite.
- Database, Kafka, MongoDB, graph, and analytical code can be added without placing infrastructure concerns in UI routes.
- Event contracts can become stable shared dependencies rather than informal JSON payloads.
- The monorepo supports coordinated pull requests for a domain change spanning UI, schema, worker, and documentation updates.
- Curated content can remain version-controlled while structured metadata is later imported into PostgreSQL.
- CI can validate the entire workspace with one dependency lockfile and one coordinated build process.
- Future worker applications can reuse the same domain contracts as the web application.

### Tradeoffs

- Package boundaries require discipline and code-review attention.
- Workspace dependency declarations must be explicit, especially under pnpm.
- A change spanning several packages may require coordinated versioning and validation.
- The repository may feel more complex than a single application during early development.
- Some package names will temporarily retain the legacy `atlas-patterns` internal namespace.
- Shared abstractions can become over-engineered if created before a real use case exists.

## Alternatives considered

### Keep all code inside the Next.js application

**Not selected.**

This would be simpler initially but would tightly couple application routes, UI components, event processing, data access, AI providers, and recommendation rules.

It would make the planned event worker, Kafka consumers, database repositories, and graph projections harder to introduce cleanly.

### Split immediately into multiple repositories

**Not selected.**

Separate repositories would create independent release, dependency, versioning, and coordination overhead before StrataForge has stable domain boundaries or independently deployable services.

The current platform is best served by coordinated change across shared contracts, the web application, documentation, and future workers.

### Use a single shared `lib` directory instead of packages

**Not selected.**

A generic `lib` directory does not provide clear ownership boundaries, independent package metadata, explicit dependency declarations, or an obvious path for future worker applications and infrastructure packages.

### Rename all internal identifiers to StrataForge immediately

**Not selected.**

The public rebrand is complete, but a full technical namespace migration introduces unrelated risk. It should occur only through a separate approved decision and migration plan.

## Implementation notes

The current implementation should continue using the existing workspace structure:

```text
apps/pattern-atlas-web
packages/content
packages/schemas
packages/ui
packages/integrations
```

New packages should be introduced only when a real implementation need exists.

Recommended introduction order:

```text
1. packages/database
2. packages/events
3. apps/event-worker
4. packages/recommendations
5. packages/documents
6. packages/graph
```

Each new package must include:

- A clear responsibility statement.
- Explicit dependencies in `package.json`.
- Shared schemas rather than duplicated local contracts.
- A minimal test or validation approach appropriate to its responsibility.
- Documentation updates when it changes an architectural boundary.

## Related documents

- [Architecture overview](../architecture/overview.md)
- [Application architecture](../architecture/application-architecture.md)
- [Domain model](../architecture/domain-model.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Product vision](../product/vision.md)
- [ADR index](README.md)
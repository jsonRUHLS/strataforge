# Product Capabilities

> Status: In progress

## Current capabilities

### Pattern exploration

Users can browse curated software design patterns and examine implementation variants across languages, frameworks, and platforms.

### Pattern comparison

Users can compare pattern-related approaches and implementation variants using the existing web application.

### Catalog-backed pattern enrichment

The Adapter pattern is connected to a PostgreSQL catalog record.

When the catalog database is available, the Adapter pattern page includes catalog-derived metadata, implementation variants, and linked catalog scenarios. The authored content model remains the primary page experience, while the catalog adds relational data and explicit `Catalog DB` provenance.

### Scenario browsing

StrataForge supports database-backed browsing of catalog scenarios.

The scenario index is available at:

```text
/scenarios
```

It loads scenario cards from PostgreSQL catalog data. Each card displays the scenario name, summary, number of related patterns, number of associated technologies, and a `Catalog DB` provenance tag.

Scenario coverage is being migrated incrementally from authored pattern content into the PostgreSQL catalog. The current catalog includes all authored scenarios for the Adapter and Abstract Factory patterns. Migration provenance and coverage are documented in `docs/migrations/scenario-migration.md`.

The scenario index distinguishes between these catalog states:

- Catalog available with scenarios: displays scenario cards.
- Catalog available with no scenarios: displays an empty-catalog message.
- Catalog unavailable or `DATABASE_URL` not configured: displays a catalog-unavailable message without exposing a database initialization error.

### Scenario discovery

The Scenarios catalog is scenario-first: each result presents a real-world architecture or integration problem, with related design patterns shown as supporting metadata.

Users can:

- Search scenario titles, summaries, problem statements, and related pattern names.
- Filter scenarios by Pattern, pattern category, and architecture layer.
- Sort results by title, most recently added, or most recently updated.
- Use shareable URL query parameters to preserve searches, filters, and sorting.
- Open a scenario to explore its problem statement, associated patterns, implementations, and technologies.

### Scenario detail pages

Each scenario card links to a database-backed detail route:

```text
/scenarios/[slug]
```

The first seeded scenario is available at:

```text
/scenarios/third-party-task-api
```

A scenario detail page displays:

- Scenario name, summary, and problem statement.
- Related catalog patterns.
- Available pattern implementation variants and core languages.
- Associated technologies.
- A `Catalog DB` provenance badge.
- A **Back to scenarios** link that returns to `/scenarios`.

Unknown scenario slugs return an intentional scenario-specific 404 page. If `DATABASE_URL` is missing or PostgreSQL is unavailable, the detail route follows the same not-found path rather than surfacing a database initialization error.

### Scenario navigation

Scenarios are available through the global application navigation:

```text
Global navigation
→ Scenarios
→ /scenarios
→ /scenarios/[slug]
```

Scenario details link back to the scenario index:

```text
/scenarios/[slug]
→ Back to scenarios
→ /scenarios
```

Catalog scenarios also remain discoverable in context from their related pattern pages:

```text
/patterns/adapter
→ Catalog scenarios
→ /scenarios/third-party-task-api
```

The Adapter pattern page renders linked catalog scenarios only when the database relationship exists.

### Monorepo development workflow

The repository uses a pnpm workspace with a Next.js application and shared packages. GitHub Actions validates linting and production builds for pull requests and supported branches.

## Planned capabilities

### Explore

A freeform discovery experience for patterns, languages, frameworks, libraries, platforms, data stores, messaging technologies, implementation examples, and catalog scenarios.

### Compare

A contextual comparison workflow for exactly two options, such as two frameworks, two databases, or two message brokers, evaluated within a scenario, feature, pattern, or architecture layer.

### Atlas

Curated architecture blueprints that recommend an end-to-end stack for a scenario and explain each decision.

### Composer

A layer-by-layer stack composition workflow that lets users select technologies and receive compatibility feedback, alternatives, required adapters, and caveats.

### AI Studio

An AI-assisted workflow that converts a freeform requirement into a validated architecture proposal, implementation plan, code guidance, assumptions, and unresolved questions.

## Capability states

| State | Meaning |
|---|---|
| Current | Available in the repository or running product today |
| In progress | Actively being designed or implemented |
| Proposed | Planned but not yet implemented |
| Deferred | Intentionally postponed until prerequisite work is complete |
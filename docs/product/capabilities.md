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

### Scenario detail pages

StrataForge supports database-backed detail pages for catalog scenarios.

The first seeded scenario is available at:

```text
/scenarios/third-party-task-api
```

The scenario detail page displays:

- Scenario name, summary, and problem statement
- Related catalog patterns
- Available pattern implementation variants and core languages
- Associated technologies
- A `Catalog DB` provenance badge

The route is server-rendered from PostgreSQL catalog data. Unknown scenario slugs return an intentional 404 page. If `DATABASE_URL` is missing or PostgreSQL is unavailable, the route follows the same not-found path rather than surfacing a database initialization error.

### Scenario discovery from patterns

Catalog scenarios are discoverable from the catalog-enriched Adapter pattern page.

The current navigation path is:

```text
/patterns/adapter
→ Catalog scenarios
→ /scenarios/third-party-task-api
```

Scenario links are rendered only when a catalog pattern has linked scenarios. The application does not yet provide a global `/scenarios` index or a top-level Scenarios navigation item.

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
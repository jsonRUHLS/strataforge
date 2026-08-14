# StrataForge

StrataForge is an architecture intelligence and full-stack blueprint platform.  It helps developers explore software patterns, compare technologies in implementation context, and design compatible, implementation-ready solution blueprints.

## What it is

StrataForge turns fragmented architecture research into a structured decision-making workspace. It connects patterns, languages, frameworks, data stores, integration approaches, and observability choices to explain not only what to use, but why a particular combination fits a specific scenario.

## Project status

StrataForge is under active development.

### Available today

- Browse curated software design patterns and implementation variants.
- Compare patterns and approaches across languages, frameworks, and platforms.
- Run the Next.js workspace locally with pnpm.
- Validate changes through GitHub Actions lint and production-build checks.
- Database-backed scenario detail pages, starting with `/scenarios/third-party-task-api`, linked from the Adapter catalog record.

### Planned

- Contextual technology comparisons.
- Curated full-stack architecture blueprints.
- Stack composition with compatibility validation.
- AI-assisted architecture and implementation planning.
- PostgreSQL, MongoDB, Kafka, ClickHouse, Grafana, and graph-based projections.

## Development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm build
```
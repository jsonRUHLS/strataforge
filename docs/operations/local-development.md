# Local Development Operations

> Status: In progress  
> Last updated: 2026-08-12

This document explains how StrataForge runs locally today and how local operational dependencies will be introduced as the data platform evolves.

The current StrataForge workspace is a Next.js application with shared pnpm packages. PostgreSQL, MongoDB, Kafka, ClickHouse, Grafana, and graph infrastructure are planned target-platform components and are not required for current local development.

For initial repository setup, see [Getting started](../development/getting-started.md). For the target data architecture, see [Data platform](../architecture/data-platform.md).

## Current local runtime

The current local development runtime is:

```text
Developer machine
  ↓
Node.js version from .nvmrc
  ↓
pnpm workspace
  ↓
Next.js development server
  ↓
Browser
```

Start the current application from the repository root:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL shown by Next.js, commonly:

```text
http://localhost:3000
```

The current primary application is:

```text
apps/pattern-atlas-web
```

The directory name is a legacy internal technical identifier. The public product name is StrataForge.

## Current local checks

Before pushing changes, run:

```bash
pnpm lint
pnpm build
```

The production build is the most important local verification step because it performs Next.js compilation and TypeScript validation.

```text
pnpm dev succeeds
≠
pnpm build succeeds
```

## Current local prerequisites

| Requirement | Purpose |
|---|---|
| Git | Repository cloning, branching, commits, and pull requests |
| Node.js version from `.nvmrc` | Runtime and build tooling |
| Corepack | pnpm management |
| pnpm | Workspace installation and scripts |

Verify local tooling:

```bash
git --version
node --version
corepack --version
pnpm --version
```

If you use `nvm`, load the expected Node.js version:

```bash
nvm install
nvm use
```

## Current environment configuration

The current content-driven application should run without requiring PostgreSQL, MongoDB, Kafka, ClickHouse, Grafana, or graph-store connection configuration.

As local environment variables are introduced:

- Store developer-specific values in local `.env` files.
- Keep local `.env` files excluded from Git.
- Provide committed `.env.example` files containing variable names and safe placeholders only.
- Document every required variable in this file or the feature-specific operational document.
- Never commit credentials, tokens, private URLs, or production connection strings.

Example future structure:

```text
.env.example
.env.local
apps/pattern-atlas-web/.env.local
apps/event-worker/.env.local
```

Example safe placeholder format:

```dotenv
DATABASE_URL=postgresql://strataforge:local-password@localhost:5432/strataforge
KAFKA_BROKERS=localhost:9092
MONGODB_URI=mongodb://localhost:27017/strataforge
CLICKHOUSE_URL=http://localhost:8123
```

These example values are directional only. They do not represent active application configuration.

## Local development workflow

Use this workflow for ordinary product or documentation work:

```bash
git switch main
git pull origin main

git switch -c feat/short-description

pnpm install --frozen-lockfile
pnpm dev

# Make focused changes.

pnpm lint
pnpm build

git diff --check
git status
git diff

git add path/to/files
git commit -m "feat: short description"
git push -u origin feat/short-description
```

## Planned local infrastructure

> Status: Proposed

The target data platform will eventually require local infrastructure for integration development.

```text
PostgreSQL
MongoDB
Kafka-compatible broker
ClickHouse
Grafana
Graph store
```

These services should not be required for all contributors immediately.

Local infrastructure should be introduced gradually, with profiles or service groups that match the work being performed.

```text
Content and UI work
  → Node.js and pnpm only

PostgreSQL catalog work
  → Node.js, pnpm, PostgreSQL

Eventing work
  → Node.js, pnpm, PostgreSQL, Kafka

Analytics work
  → Node.js, pnpm, PostgreSQL, Kafka, ClickHouse, Grafana

Document work
  → Node.js, pnpm, PostgreSQL, Kafka, MongoDB

Graph work
  → Node.js, pnpm, PostgreSQL, Kafka, graph store
```

## Proposed container strategy

> Status: Proposed

When StrataForge adds local data services, use Docker Compose or an equivalent local-container workflow.

Suggested future structure:

```text
infra/
  compose/
    docker-compose.yml
    docker-compose.postgres.yml
    docker-compose.events.yml
    docker-compose.analytics.yml
    docker-compose.graph.yml

  postgres/
    initialization scripts

  kafka/
    local topic configuration

  clickhouse/
    initialization scripts

  grafana/
    provisioning and dashboards
```

Suggested service profiles:

```text
core
  PostgreSQL

events
  PostgreSQL + Kafka-compatible broker

analytics
  PostgreSQL + Kafka-compatible broker + ClickHouse + Grafana

documents
  PostgreSQL + Kafka-compatible broker + MongoDB

full
  PostgreSQL + Kafka-compatible broker + MongoDB +
  ClickHouse + Grafana + graph store
```

Do not add this infrastructure until a feature branch requires it and accompanying documentation, health checks, environment configuration, and CI strategy are ready.

## Proposed local service ports

> Status: Proposed

Avoid assuming these ports are permanently reserved. Document them in the future Compose configuration and `.env.example` files.

| Service | Typical local port | Notes |
|---|---:|---|
| Next.js web application | 3000 | Development server |
| PostgreSQL | 5432 | Canonical transactional database |
| MongoDB | 27017 | Document artifact store |
| Kafka-compatible broker | 9092 | Event broker client port |
| ClickHouse HTTP | 8123 | Analytical query endpoint |
| ClickHouse native | 9000 | Native client protocol |
| Grafana | 3001 | Dashboard UI, avoiding app port conflict |
| Graph store | Provider-specific | Define only when selected |

## Health checks

> Status: Proposed

Every local infrastructure service must expose a simple health check before application services depend on it.

Suggested future checks:

```bash
# PostgreSQL
pg_isready -h localhost -p 5432

# MongoDB
mongosh --eval 'db.runCommand({ ping: 1 })'

# ClickHouse
curl http://localhost:8123/ping

# Grafana
curl http://localhost:3001/api/health
```

Kafka and graph-store health checks should be selected with the final local runtime and provider configuration.

The application should fail clearly when a required dependency is unavailable.

Avoid ambiguous startup failures such as:

```text
Connection refused
Unknown database error
Unhandled promise rejection
```

Prefer actionable diagnostics:

```text
PostgreSQL is unavailable at configured DATABASE_URL.

Kafka broker is unavailable. Start the events profile or set
EVENTING_ENABLED=false for local UI-only work.

ClickHouse analytics ingestion is disabled because CLICKHOUSE_URL
is not configured.
```

## Feature flags and local modes

> Status: Proposed

Local development should support a safe progressive rollout of new infrastructure.

Suggested future modes:

```text
CONTENT_SOURCE=workspace
CONTENT_SOURCE=postgres

EVENTING_ENABLED=false
EVENTING_ENABLED=true

ANALYTICS_ENABLED=false
ANALYTICS_ENABLED=true

AI_STUDIO_ENABLED=false
AI_STUDIO_ENABLED=true
```

Feature flags must:

- Have documented defaults.
- Be safe when omitted.
- Avoid exposing sensitive configuration to browsers.
- Be removed when a feature becomes permanently enabled.
- Not become a permanent substitute for proper environment separation.

## Database migration workflow

> Status: Proposed

When PostgreSQL is introduced, database changes must use versioned migrations.

Expected workflow:

```text
1. Update shared schema contracts if needed.
2. Add a database migration.
3. Apply migration locally.
4. Seed or import required development data.
5. Update repository and query layers.
6. Add or update tests.
7. Document any operational migration impact.
```

Never modify a previously applied production migration in place.

Future migration commands will be documented once the database package and migration tool are selected.

## Eventing workflow

> Status: Proposed

When Kafka is introduced, local eventing development should include:

```text
1. Start PostgreSQL and Kafka-compatible broker.
2. Apply database migrations.
3. Start the web application.
4. Start the event-worker application.
5. Trigger a canonical command.
6. Inspect outbox state.
7. Verify Kafka publication.
8. Verify consumer projection or analytical record.
9. Confirm retry and failure behavior where relevant.
```

A feature is not complete merely because the web application writes canonical state. It must also verify the intended event publication and consumer behavior.

## Local observability

> Status: Proposed

When ClickHouse and Grafana are introduced, local observability should make it possible to inspect:

```text
Outbox backlog
Kafka consumer lag
Event throughput
Projection failures
Dead-letter events
AI-generation duration
Blueprint validation duration
```

Local dashboards should use safe synthetic or local development data only.

Do not connect local Grafana dashboards to production data sources.

## Operational troubleshooting

### `pnpm` is unavailable

Enable Corepack:

```bash
corepack enable
```

Then verify:

```bash
pnpm --version
```

### Dependencies fail to install

Confirm Node.js matches `.nvmrc`:

```bash
node --version
cat .nvmrc
```

Then reinstall from the lockfile:

```bash
pnpm install --frozen-lockfile
```

Do not delete `pnpm-lock.yaml` as a first response to installation problems.

### Development server starts but production build fails

Run:

```bash
pnpm build
```

Read the first meaningful TypeScript or build error. Resolve the type, schema, import, or dependency boundary issue rather than disabling validation.

### Stale remote branches appear locally

Prune remote-tracking references:

```bash
git fetch origin --prune
```

To prune automatically:

```bash
git config --global fetch.prune true
```

### Future local service fails to start

When infrastructure is added, collect:

```text
Service name
Container status
Health-check output
Relevant sanitized logs
Environment-variable names only, never secret values
```

Do not paste connection strings, API keys, tokens, or private local data into public issues or pull requests.

## Related documents

- [Getting started](../development/getting-started.md)
- [Workspace guide](../development/workspace.md)
- [Testing and CI](../development/testing-and-ci.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Observability](observability.md)
- [Security and data handling](security-and-data-handling.md)
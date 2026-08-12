# Workspace Guide

> Status: Current  
> Last updated: 2026-08-12

StrataForge is managed as a pnpm workspace. The workspace contains a primary Next.js application, shared packages, documentation, scripts, and GitHub Actions workflows.

This guide explains the current repository structure, workspace commands, dependency rules, and the planned package evolution.

For local setup, see [Getting started](getting-started.md). For architectural package boundaries, see [ADR-0001: Monorepo and package boundaries](../decisions/0001-monorepo-and-package-boundaries.md).

## Repository structure

```text
strataforge/
│
├── apps/
│   └── pattern-atlas-web/
│       ├── app/
│       ├── components/
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── content/
│   ├── integrations/
│   ├── schemas/
│   └── ui/
│
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── development/
│   ├── operations/
│   ├── planning/
│   └── product/
│
├── scripts/
│
├── .github/
│   └── workflows/
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
└── .nvmrc
```

The public product is **StrataForge**.

Some internal directory and package names still use the prior Pattern Atlas namespace:

```text
apps/pattern-atlas-web
@atlas-patterns/*
```

These are intentional technical identifiers for now. Do not rename them casually during feature work.

## Workspace configuration

The root workspace configuration is defined in:

```text
pnpm-workspace.yaml
```

The root `package.json` contains workspace-wide scripts, dependency metadata, and package-manager configuration.

Use pnpm commands from the repository root unless a document or package-specific script explicitly says otherwise.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm dev
```

## Current applications

### `apps/pattern-atlas-web`

This is the primary Next.js application.

It owns:

- Next.js routes and layouts.
- Application metadata and product presentation.
- Pattern exploration and comparison experiences.
- Application-specific components.
- Page-level data composition.
- Future route handlers and API boundaries.
- Future authenticated user experiences.
- Future Server-Sent Event client integration.

It should not own:

- Canonical database schema definitions.
- Kafka consumer processing.
- MongoDB change-stream processing.
- Graph projections.
- ClickHouse ingestion.
- Shared domain contracts.
- Provider-specific AI SDK logic.

The directory name is currently:

```text
apps/pattern-atlas-web
```

The public product name remains:

```text
StrataForge
```

## Current shared packages

### `packages/content`

The content package contains curated, source-controlled knowledge.

It is the current home for:

- Pattern descriptions.
- Pattern variants.
- Scenario-specific examples.
- Cross-language implementations.
- Curated technology references.
- Authored content metadata.

The package should remain the authored source for curated examples during the early database transition.

Later, structured metadata may be imported into PostgreSQL while source files remain the initial authoring workflow.

### `packages/schemas`

The schemas package contains shared contracts and validation definitions.

It should contain:

- Shared TypeScript types.
- Zod schemas.
- Pattern and variant contracts.
- Architecture-layer types.
- API request and response schemas.
- Future event envelopes and payload schemas.
- Future blueprint and compatibility contracts.

It must not contain:

- Database connections.
- Repository queries.
- Next.js route code.
- React components.
- Kafka clients.
- AI-provider SDK calls.
- Environment-specific configuration.

The schemas package is the shared language of the system.

### `packages/ui`

The UI package contains reusable presentation components and styles.

It may contain:

- Buttons.
- Links.
- Cards.
- Form controls.
- Shared layouts.
- Visual states.
- Accessibility-focused UI behavior.
- Shared component CSS.

It must not contain:

- Product-specific route behavior.
- Data access.
- Compatibility decisions.
- Event publication.
- Authorization logic.
- AI-generation orchestration.

Some components may currently be Next.js-aware. If StrataForge later requires framework-neutral UI reuse, generic primitives and Next.js-specific components should be split through a dedicated decision and migration.

### `packages/integrations`

The integrations package contains external integration boundaries.

It may contain:

- External API clients.
- Provider-neutral interfaces.
- Future AI-provider adapters.
- Future authentication-provider adapters.
- Future documentation or technology-metadata adapters.
- Shared transport and error-normalization helpers.

It must not contain:

- Page composition.
- Route-level UI behavior.
- Canonical data ownership.
- Direct feature-specific rendering.

## Package dependency rules

Dependencies must flow from applications toward shared contracts and infrastructure boundaries.

```text
apps
  ↓
shared UI, content, domain services
  ↓
schemas and recommendation logic
  ↓
database, event, document, graph, and integration packages
  ↓
external systems
```

### Allowed direction

```text
apps/pattern-atlas-web
  → packages/ui
  → packages/content
  → packages/schemas
  → packages/integrations

Future:
apps/event-worker
  → packages/schemas
  → packages/database
  → packages/events
  → packages/documents
  → packages/graph
  → packages/integrations
```

### Disallowed direction

```text
packages/schemas
  → apps/pattern-atlas-web

packages/ui
  → database client

packages/content
  → Kafka producer

packages/database
  → React component

packages/events
  → Next.js route

packages/graph
  → browser-only API
```

If a dependency direction feels unclear, stop and document the intended boundary before adding the import.

## Workspace commands

### Install all dependencies

```bash
pnpm install --frozen-lockfile
```

Use this for reproducible local development and CI validation.

### Run the development server

```bash
pnpm dev
```

This runs the applicable workspace development scripts.

### Lint the workspace

```bash
pnpm lint
```

The root lint command runs lint scripts across relevant workspace packages.

### Build the workspace

```bash
pnpm build
```

The root build command runs package build scripts. The Next.js production build performs compilation and TypeScript validation for the web application.

### Run a package-specific command

Use pnpm filtering when working on one package.

```bash
pnpm --filter ./apps/pattern-atlas-web dev
```

```bash
pnpm --filter ./packages/schemas build
```

```bash
pnpm --filter ./packages/ui lint
```

Use the package path when the workspace package name is uncertain.

## Dependency management

### Add a dependency to one package

Dependencies must be declared by the package that imports them.

For example, if a component in `packages/ui` imports a package, add the dependency to `packages/ui`, not only to the root application.

```bash
pnpm --filter ./packages/ui add package-name
```

For a development-only dependency:

```bash
pnpm --filter ./packages/schemas add -D package-name
```

For a peer dependency:

```bash
pnpm --filter ./packages/ui add package-name --save-peer
```

### Add a root development dependency

Use the workspace root only for tools shared across the repository:

```bash
pnpm add -Dw package-name
```

Examples of root-level tooling may include:

```text
TypeScript
ESLint
Formatting tools
Test runners
Workspace scripts
Build tooling
```

Do not add feature-specific runtime packages to the root when only one application or package needs them.

### Lockfile rules

Always commit changes to:

```text
package.json
pnpm-lock.yaml
```

when adding, removing, or updating dependencies.

Do not manually edit `pnpm-lock.yaml`.

Do not delete it to solve installation issues.

## Planned workspace evolution

The following packages and application will be introduced only when their corresponding implementation work begins.

```text
packages/database
  PostgreSQL client, migrations, repositories, outbox support

packages/events
  Event contracts, Kafka configuration, producers, consumer helpers

apps/event-worker
  Outbox publisher, consumers, retries, projections, dead-letter handling

packages/recommendations
  Compatibility logic, scoring, rationale, alternatives

packages/documents
  MongoDB client and document repositories

packages/graph
  Graph projections and traversal queries
```

Recommended introduction order:

```text
1. packages/database
2. packages/events
3. apps/event-worker
4. packages/recommendations
5. packages/documents
6. packages/graph
```

Do not create empty placeholder packages solely because they appear in the target architecture. Introduce each package with a real responsibility, minimal implementation, validation approach, and documentation update.

## Workspace validation checklist

Before opening a pull request that changes workspace structure or dependencies:

```text
- Package ownership is clear.
- Dependency direction follows this guide.
- Imported dependencies are declared in the importing package.
- package.json and pnpm-lock.yaml are both updated when needed.
- pnpm install --frozen-lockfile succeeds.
- pnpm lint succeeds without new errors.
- pnpm build succeeds.
- Shared contracts are placed in packages/schemas.
- Public product text uses StrataForge.
- Internal namespace changes are isolated to a dedicated migration.
```

## Common workspace problems

### Dependency exists in another package but cannot be imported

pnpm uses explicit package boundaries.

Add the dependency to the package that imports it:

```bash
pnpm --filter ./path/to/package add dependency-name
```

Do not rely on a dependency being present in a sibling package or root application.

### Root command does not find a package script

Inspect the package script definition:

```bash
cat packages/package-name/package.json
```

Then run the supported root command or use `pnpm --filter`.

Do not add a no-op script just to make a command appear successful.

### A shared type is missing from an import

Check that the type is:

1. Defined in `packages/schemas`.
2. Exported from the schemas package entrypoint.
3. Imported from the correct workspace package.
4. Included in the relevant package build or TypeScript configuration.

### A UI package cannot resolve a framework import

If a reusable UI package imports a framework-specific module, it must explicitly declare the necessary dependency or peer dependency.

For example:

```text
packages/ui imports next/link
→ packages/ui declares Next.js appropriately
```

Do not assume the consuming application’s dependencies are automatically visible to every workspace package.

## Related documents

- [Getting started](getting-started.md)
- [Testing and CI](testing-and-ci.md)
- [Contribution guide](contribution-guide.md)
- [Application architecture](../architecture/application-architecture.md)
- [ADR-0001: Monorepo and package boundaries](../decisions/0001-monorepo-and-package-boundaries.md)
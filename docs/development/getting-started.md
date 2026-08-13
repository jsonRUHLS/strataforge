# Getting Started

> Status: Current  
> Last updated: 2026-08-12

This guide explains how to clone, install, run, validate, and contribute to the current StrataForge workspace.

StrataForge is a pnpm monorepo with a primary Next.js application and shared packages.

For workspace structure and package responsibilities, see [Workspace guide](workspace.md). For CI behavior, see [Testing and CI](testing-and-ci.md).

## Prerequisites

Install the following before working on StrataForge:

| Tool | Required version | Purpose |
|---|---:|---|
| Git | Current stable version | Source control |
| Node.js | Version defined in `.nvmrc` | Application runtime and tooling |
| Corepack | Included with supported Node.js releases | pnpm version management |
| pnpm | Version managed through Corepack/project configuration | Workspace package management |

Verify your local tools:

```bash
git --version
node --version
corepack --version
pnpm --version
```

## Clone the repository

Clone the public StrataForge repository:

```bash
git clone git@github.com:jsonRUHLS/strataforge.git
cd strataforge
```

If you do not use SSH authentication with GitHub:

```bash
git clone https://github.com/jsonRUHLS/strataforge.git
cd strataforge
```

Confirm the remote:

```bash
git remote -v
```

Expected result:

```text
origin  git@github.com:jsonRUHLS/strataforge.git (fetch)
origin  git@github.com:jsonRUHLS/strataforge.git (push)
```

## Configure Node.js and pnpm

Use the Node.js version defined by the repository:

```bash
cat .nvmrc
```

If you use `nvm`:

```bash
nvm install
nvm use
```

Enable Corepack:

```bash
corepack enable
```

Confirm pnpm is available:

```bash
pnpm --version
```

Do not install a random global pnpm version unless you have a specific reason. The repository lockfile and project configuration should determine the expected package-manager behavior.

## Install dependencies

Install all workspace dependencies from the lockfile:

```bash
pnpm install --frozen-lockfile
```

This command installs dependencies exactly as recorded in `pnpm-lock.yaml`.

Do not use:

```bash
npm install
yarn install
pnpm install --no-frozen-lockfile
```

unless you are intentionally changing dependencies or regenerating the lockfile.

## Run the application

Start the development server:

```bash
pnpm dev
```

Open the local URL printed by Next.js, commonly:

```text
http://localhost:3000
```

The current primary application is located at:

```text
apps/pattern-atlas-web
```

The directory name is an existing internal technical identifier. The public product name is StrataForge.

## Validate your changes

Run the same baseline checks used by GitHub Actions:

```bash
pnpm lint
pnpm build
```

### Lint

```bash
pnpm lint
```

Lint may report existing warnings. Do not suppress a warning or weaken lint rules merely to make a change appear clean. Fix warnings that are introduced by your work.

### Production build

```bash
pnpm build
```

The production build performs compilation and Next.js TypeScript validation.

A feature branch should not be considered ready for review until `pnpm build` succeeds.

## Suggested daily workflow

```bash
git switch main
git pull origin main

git switch -c feat/short-description

pnpm install --frozen-lockfile
pnpm dev

# Make focused changes.

pnpm lint
pnpm build

git status
git diff --check
git add path/to/changed/files
git commit -m "feat: short description"
git push -u origin feat/short-description
```

Create a pull request after pushing the branch.

## Branch conventions

Use branch names that communicate intent.

| Prefix | Use |
|---|---|
| `feat/` | New product capability |
| `fix/` | Defect or build repair |
| `docs/` | Documentation-only work |
| `chore/` | Maintenance, tooling, or non-product cleanup |
| `refactor/` | Internal restructuring without intended behavior changes |

Examples:

```text
feat/data-platform-foundation
feat/catalog-postgres-foundation
feat/kafka-outbox

fix/compare-filter-types
fix/schema-pattern-layer-export

docs/project-foundation
docs/data-platform-architecture

chore/strataforge-rebrand
chore/update-ci-runtime
```

## Commit conventions

Use concise, imperative commit messages.

```text
feat: add catalog technology schema
fix: restore baseline production build
docs: define StrataForge data platform
ci: install pnpm before restoring cache
chore: rebrand public product as StrataForge
refactor: extract compatibility query service
```

Keep unrelated changes in separate commits.

Avoid combining these in one commit:

```text
Feature work
Dependency upgrades
Formatting changes
Unrelated warning cleanup
Large generated-file updates
Product copy changes
```

## Pull-request checklist

Before opening a pull request:

```text
- The branch is based on current main.
- The change has a focused purpose.
- pnpm lint has been run.
- pnpm build has been run successfully.
- git diff --check produces no output.
- No .env files, credentials, tokens, or generated secrets are staged.
- Documentation is updated when architecture, behavior, setup, or contracts change.
- The pull request distinguishes current implementation from proposed work.
```

## Current environment requirements

The current StrataForge workspace does not require PostgreSQL, MongoDB, Kafka, ClickHouse, Grafana, or a graph store for normal local development.

Those systems are part of the proposed target platform and will be introduced through later implementation phases.

Do not add local infrastructure dependencies until the corresponding feature branch, package, configuration, documentation, and development workflow are ready.

## Troubleshooting

### `pnpm` is not found

Enable Corepack:

```bash
corepack enable
```

Then verify:

```bash
pnpm --version
```

If needed, restart the terminal after enabling Corepack.

### Dependency installation fails

First confirm your Node.js version matches `.nvmrc`:

```bash
node --version
cat .nvmrc
```

Then retry with the locked dependency graph:

```bash
pnpm install --frozen-lockfile
```

Do not delete `pnpm-lock.yaml` to solve a local installation issue.

### Build fails after pulling changes

Start with a clean dependency install:

```bash
pnpm install --frozen-lockfile
pnpm build
```

If the failure references a shared package, inspect the package contract and any related imports before changing compiler settings or disabling type checks.

### Git shows deleted remote branches

Prune stale remote-tracking references:

```bash
git fetch origin --prune
```

To make this automatic:

```bash
git config --global fetch.prune true
```

### GitHub Actions fails but local checks pass

Confirm that the workflow uses the Node.js version from `.nvmrc` and installs dependencies with:

```bash
pnpm install --frozen-lockfile
```

Then inspect the first meaningful GitHub Actions error. The last generic process-exit message is usually not the root cause.

## Related documents

- [Workspace guide](workspace.md)
- [Testing and CI](testing-and-ci.md)
- [Contribution guide](contribution-guide.md)
- [Local development](../operations/local-development.md)
- [Application architecture](../architecture/application-architecture.md)
- [Architecture Decision Records](../decisions/README.md)
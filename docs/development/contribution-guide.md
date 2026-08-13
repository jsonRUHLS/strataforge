# Contribution Guide

> Status: Current  
> Last updated: 2026-08-12

Thank you for contributing to StrataForge.

StrataForge is an architecture intelligence and full-stack blueprint platform. Contributions should improve the clarity, correctness, accessibility, reliability, and explainability of the product.

This guide applies to product features, bug fixes, documentation, shared schemas, curated content, infrastructure, and future data-platform work.

For local setup, see [Getting started](getting-started.md). For validation requirements, see [Testing and CI](testing-and-ci.md).

## Contribution principles

Contributions should follow these principles:

- Keep changes focused and reviewable.
- Preserve a buildable `main` branch.
- Prefer explicit contracts over implicit assumptions.
- Keep product behavior, architecture, and documentation aligned.
- Explain technology recommendations and compatibility decisions.
- Distinguish curated knowledge from deterministic inference and AI-generated output.
- Avoid introducing infrastructure before a real product need exists.
- Do not weaken validation, linting, type checking, or security controls to bypass failures.
- Treat shared schemas, event contracts, and data ownership as high-impact changes.

## Before you begin

Before starting work:

1. Review the relevant product and architecture documentation.
2. Search existing issues and pull requests for related work.
3. Confirm whether the work is a feature, bug fix, documentation update, refactor, or maintenance task.
4. Keep unrelated cleanup out of the same branch.
5. Create a branch from the current `main`.

```bash
git switch main
git pull origin main
git switch -c feat/short-description
```

## Branch naming

Use a branch name that clearly communicates the work.

| Prefix | Use |
|---|---|
| `feat/` | New user-facing capability |
| `fix/` | Defect, regression, build repair, or validation fix |
| `docs/` | Documentation-only change |
| `chore/` | Tooling, dependency, CI, or maintenance work |
| `refactor/` | Internal restructuring without intended behavior change |

Examples:

```text
feat/catalog-postgres-foundation
feat/kafka-transactional-outbox
feat/atlas-blueprint-model

fix/compare-filter-types
fix/technology-compatibility-validation

docs/project-foundation
docs/eventing-model

chore/update-ci-runtime
chore/refresh-development-dependencies

refactor/extract-compatibility-service
refactor/split-next-ui-components
```

## Development workflow

Use this standard workflow:

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

git add path/to/changed/files
git commit -m "feat: short description"
git push -u origin feat/short-description
```

Then open a pull request into `main`.

## Commit messages

Use concise, imperative commit messages.

```text
feat: add compatibility relationship schema
fix: validate pattern variant layer
docs: define StrataForge eventing model
ci: add pnpm setup before cache restoration
chore: update Node runtime configuration
refactor: extract blueprint recommendation service
```

A good commit message describes what changed, not what you personally did.

Prefer:

```text
feat: add blueprint-layer selection model
```

Avoid:

```text
added some blueprint things
updates
fixes
WIP
```

## Pull-request expectations

Each pull request should have one clear purpose.

A good pull request includes:

```text
- A clear title.
- A concise description of the problem and solution.
- Relevant documentation updates.
- Validation commands that were run.
- Notes about known limitations or follow-up work.
- Screenshots for meaningful visual UI changes.
- Migration notes for schema, database, event, or contract changes.
```

### Suggested pull-request template

```md
## Summary

- What problem does this change solve?
- What changed?

## Validation

- [ ] pnpm install --frozen-lockfile
- [ ] pnpm lint
- [ ] pnpm build
- [ ] Relevant tests, if available

## Documentation

- [ ] Documentation updated
- [ ] No documentation update required

## Risk and follow-up

- Risks, limitations, migration notes, or follow-up work.
```

## Required validation

Before requesting review, run:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
git diff --check
```

A pull request should not be merged when:

```text
- GitHub Actions is failing.
- The production build fails.
- It introduces new lint errors.
- It contains unresolved merge conflicts.
- It includes credentials, tokens, .env files, or private data.
- It changes contracts without documenting compatibility impact.
- It mixes unrelated feature, refactor, formatting, and dependency changes.
```

## Code-quality expectations

### Shared schemas

Place reusable contracts in:

```text
packages/schemas
```

Shared schemas should define:

```text
Domain entities
Validation rules
API request and response contracts
Event envelopes
Event payloads
Blueprint structures
Compatibility relationships
AI-generated structured output
```

Do not duplicate domain types across routes, UI components, workers, and integrations.

### UI components

Place reusable presentation components in:

```text
packages/ui
```

Place product-specific route or page behavior in:

```text
apps/pattern-atlas-web
```

UI components should not directly own:

```text
Database queries
Kafka publishing
Graph projection
Provider-specific AI calls
Authorization rules
Compatibility decisions
```

### External integrations

Place provider-specific boundaries in:

```text
packages/integrations
```

Where practical, expose a provider-neutral interface.

```ts
export interface ArchitectureGenerationProvider {
  generateBlueprint(
    input: BlueprintGenerationInput,
  ): Promise<BlueprintDraft>;
}
```

Application code should depend on the interface rather than a specific provider SDK.

### Database and event work

Future data-platform code must follow the ownership rules documented in:

```text
docs/architecture/data-platform.md
docs/architecture/eventing.md
```

Key rules include:

```text
PostgreSQL owns canonical transactional state.

MongoDB stores specialized documents and artifacts.

Kafka transports durable domain events.

ClickHouse stores analytics and event history.

Graph data is derived and rebuildable.

Canonical writes use a transactional outbox.

Consumers are idempotent.

Events are versioned and schema-validated.
```

## Documentation expectations

Documentation changes are required when a contribution changes:

```text
Public product behavior
Local setup steps
Workspace structure
Package ownership
Architecture boundaries
Data ownership
Event contracts
Database schema direction
Security or privacy posture
Operational behavior
Deployment process
```

Use document status labels accurately:

```text
Status: Current
Status: In progress
Status: Proposed
Status: Superseded
```

Do not describe a future service as a deployed capability until it is implemented and verified.

## Architecture Decision Records

Create or update an ADR when a change makes a long-term architectural decision.

Common ADR triggers:

```text
Adding a new package boundary
Selecting a database or event technology
Changing canonical data ownership
Defining a new event contract strategy
Introducing a new AI provider
Changing authorization strategy
Choosing a deployment platform
Changing retention or privacy policy
```

See:

```text
docs/decisions/README.md
```

Do not modify an accepted ADR to erase a historical decision. Create a new ADR that supersedes the earlier one.

## Content contributions

Curated content should be accurate, clear, and context-specific.

When adding or updating a pattern, scenario, technology, or code example:

```text
- Use stable slugs.
- Identify the relevant architecture layer.
- Include the implementation context.
- State technology assumptions.
- Identify required adapters or caveats.
- Avoid presenting one technology as universally superior.
- Link alternatives where useful.
- Keep examples focused and runnable where practical.
```

Technology recommendations should be classified as:

```text
Curated
Deterministically inferred
AI-generated
```

AI-generated content must not be presented as curated fact without clear labeling and validation.

## Security and sensitive data

Never commit:

```text
API keys
Access tokens
Passwords
Private connection strings
Production credentials
Personal data exports
Private customer prompts
Unredacted sensitive logs
```

Use local environment files that are excluded by `.gitignore`.

Before committing, inspect staged changes:

```bash
git diff --staged
```

If you identify a security issue, do not open a public issue containing exploit details, credentials, or sensitive information. Use a private communication channel with the repository maintainers or GitHub’s private security-reporting mechanism if it is enabled for the repository.

## Review guidance

Reviewers should evaluate:

```text
Correctness
Readability
Scope
Test coverage
Documentation impact
Accessibility
Security and privacy
Architecture boundaries
Contract compatibility
Operational consequences
```

For data-platform and event changes, reviewers should also confirm:

```text
Canonical data ownership is clear.

PostgreSQL writes and outbox records are transactional.

Events are versioned and schema-validated.

Consumers are idempotent.

Failure and retry behavior is documented.

Analytics events do not contain sensitive content.

Projections remain rebuildable.
```

## Related documents

- [Getting started](getting-started.md)
- [Workspace guide](workspace.md)
- [Testing and CI](testing-and-ci.md)
- [Application architecture](../architecture/application-architecture.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Architecture Decision Records](../decisions/README.md)
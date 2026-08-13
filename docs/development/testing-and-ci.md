# Testing and Continuous Integration

> Status: In progress  
> Last updated: 2026-08-12

This document defines the current validation baseline for StrataForge and the target testing strategy as the platform expands.

StrataForge currently uses GitHub Actions to validate linting and production builds. Automated unit, integration, contract, and end-to-end test suites will be introduced incrementally with the domains they protect.

For local setup, see [Getting started](getting-started.md). For workspace commands and package boundaries, see [Workspace guide](workspace.md).

## Quality principles

StrataForge quality practices should:

- Keep `main` in a buildable state.
- Validate production builds before merging.
- Treat shared schemas and event contracts as high-value test targets.
- Test business rules independently from UI rendering.
- Add tests with new domain behavior rather than creating a large untested backlog.
- Keep CI reproducible through the committed pnpm lockfile.
- Avoid weakening lint, build, or type checks to bypass known defects.
- Distinguish current checks from planned test coverage.

## Current validation baseline

The current GitHub Actions workflow runs the following checks:

```text
1. Check out the repository.
2. Install pnpm.
3. Set up Node.js from .nvmrc.
4. Restore the pnpm dependency cache.
5. Install dependencies from pnpm-lock.yaml.
6. Run pnpm lint.
7. Run pnpm build.
```

The current CI workflow is located at:

```text
.github/workflows/ci.yml
```

The workflow job is named:

```text
Quality checks
```

## Current required commands

Run these before opening a pull request:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

### Dependency installation

```bash
pnpm install --frozen-lockfile
```

This installs the dependency graph recorded in `pnpm-lock.yaml`.

Use `--frozen-lockfile` in CI and standard validation workflows so an unexpected lockfile change fails clearly instead of silently modifying dependencies.

### Linting

```bash
pnpm lint
```

Lint validates configured source-quality rules across relevant workspace packages.

Existing warnings may remain temporarily, but new work should not introduce additional lint warnings or errors.

Do not disable lint rules, add blanket ignore comments, or weaken lint configuration merely to make a pull request pass.

### Production build

```bash
pnpm build
```

The production build validates the Next.js application and catches compilation and TypeScript errors.

A successful local development server does not replace a successful production build.

```text
pnpm dev succeeds
≠
pnpm build succeeds
```

Always run the production build before requesting review.

## GitHub Actions triggers

The current CI workflow runs for:

```text
Pushes to:
- main
- fix/**
- feat/**
- chore/**

Pull requests targeting:
- main
```

The exact trigger configuration is defined in:

```text
.github/workflows/ci.yml
```

If branch conventions change, update both the workflow and [Getting started](getting-started.md).

## Pull-request quality gate

Before merging a pull request into `main`, verify:

```text
- CI Quality checks pass.
- The pull request has a focused purpose.
- The production build succeeds.
- No unrelated generated files are included.
- No credentials, tokens, .env files, or secrets are included.
- Documentation is updated when public behavior or architecture changes.
- Shared schema changes are reviewed for downstream impact.
- Event contract changes are reviewed for backward compatibility.
```

## Local validation workflow

Use this sequence before pushing a branch:

```bash
git status

pnpm install --frozen-lockfile
pnpm lint
pnpm build

git diff --check
git diff
git status
```

### `git diff --check`

Run:

```bash
git diff --check
```

This should produce no output.

It detects common whitespace problems, including trailing whitespace and malformed conflict markers.

## Test strategy

The current CI baseline is intentionally small:

```text
Lint
Production build
```

As StrataForge adds domain logic, persistent data, events, and AI workflows, testing must expand in layers.

| Test layer | Purpose | Target introduction point |
|---|---|---|
| Unit tests | Validate pure domain rules and utility logic | Shared schemas and recommendation logic |
| Component tests | Validate reusable UI behavior and accessibility | Shared UI component changes |
| Integration tests | Validate repository, database, Kafka, and provider boundaries | Data-platform packages |
| Contract tests | Validate API and event schemas | API and Kafka event introduction |
| Route tests | Validate request handling and authorization behavior | API route introduction |
| End-to-end tests | Validate user journeys in a browser | Explore, Compare, Atlas, Composer, AI Studio workflows |
| Performance tests | Validate high-volume queries and event processing | ClickHouse, Kafka, and production-readiness work |

## Unit tests

Unit tests should cover deterministic, side-effect-free logic.

High-priority unit-test targets include:

```text
Schema validation
Compatibility rules
Recommendation scoring
Architecture-layer classification
Comparison result construction
Slug and identifier utilities
Event envelope validation
Event-version compatibility logic
AI output validation and normalization
```

Example unit-test expectations:

```text
A comparison requires exactly two options.

A recommendation must include rationale.

An incompatible technology pair cannot be selected without an override.

A BlueprintLayer belongs to exactly one Blueprint.

An AI-generated recommendation must identify its source classification.

An event requires ID, type, version, aggregate identity,
occurred-at timestamp, and correlation ID.
```

Unit tests should not require:

```text
Network access
Database containers
Kafka brokers
External AI providers
Browser automation
```

## Component tests

Component tests should validate reusable UI behavior and accessibility.

Examples:

```text
A ButtonLink renders an accessible link.

A comparison option remains keyboard accessible.

A selected technology choice has an understandable visual state.

An error message is connected to the affected form field.

A progress indicator announces status changes appropriately.
```

Component tests should focus on behavior and accessibility rather than implementation details such as internal CSS class names.

## Integration tests

Integration tests validate boundaries between StrataForge code and infrastructure.

Future integration-test targets include:

```text
PostgreSQL repositories and migrations
Transactional outbox persistence
Kafka publishing and consumption
Idempotent consumer processing
MongoDB document projections
Graph projection updates
ClickHouse event ingestion
AI-provider adapter response normalization
Authorization-scoped project queries
```

Infrastructure-dependent tests should use controlled local or ephemeral test environments.

Do not point automated tests at shared personal, staging, or production infrastructure.

## Contract tests

Contract tests protect shared boundaries.

They are especially important for:

```text
Zod schemas
API request and response models
Domain-event payloads
Kafka topic message contracts
AI-generated structured output
External provider adapter interfaces
```

### Event contract example

A contract test for `atlas.blueprint.created.v1` should verify:

```text
- Valid payloads parse successfully.
- Missing required fields fail validation.
- Event version is present.
- Aggregate identity is present.
- Correlation ID is present.
- Unsupported payload shapes are rejected.
```

### API contract example

A contract test for creating a blueprint should verify:

```text
- A valid request produces a valid response shape.
- Invalid layer selections are rejected.
- Unauthorized requests are rejected.
- Compatibility failures return a documented error type.
```

## End-to-end tests

End-to-end tests validate user-facing journeys.

They should be introduced after core workflows are stable enough to justify browser automation.

Priority future journeys:

```text
Explore:
Browse a pattern, select a language, open an implementation variant.

Compare:
Select a context, choose two technologies, review tradeoffs,
and save a comparison.

Atlas:
Start from a scenario and receive a curated blueprint.

Composer:
Select technologies by layer and receive compatibility feedback.

AI Studio:
Submit a requirement, receive progress updates, review a validated
blueprint, and inspect assumptions and open questions.
```

End-to-end tests should use deterministic fixture data and controlled provider responses.

Do not make CI depend on live external AI calls.

## Event-processing tests

The event platform requires dedicated validation.

### Outbox tests

```text
- Canonical database write and outbox insert occur in one transaction.
- A failed database transaction does not leave a published event.
- Pending outbox events are claimed safely.
- Published events are not repeatedly published.
- Failed publication attempts are recorded and retried.
```

### Consumer tests

```text
- The same event can be processed twice without duplicate side effects.
- A retryable failure is retried with bounded attempts.
- A non-retryable failure reaches dead-letter handling.
- Aggregate ordering is preserved when using aggregate ID as message key.
- Projection state can be rebuilt from event history.
```

### Projection tests

```text
- A blueprint event creates the expected MongoDB document projection.
- A compatibility event updates expected graph relationships.
- A sanitized event is written to ClickHouse analytics tables.
- Sensitive fields are excluded from analytical payloads.
```

## AI workflow tests

AI Studio requires layered validation.

```text
Requirement input
→ retrieval of curated context
→ deterministic compatibility filtering
→ provider adapter
→ structured output validation
→ recommendation classification
→ persisted generation artifact
```

Test the deterministic parts directly:

```text
Requirement validation
Compatibility filtering
Output-schema validation
Source classification
Assumption extraction
Open-question extraction
Authorization checks
```

Test provider adapters using recorded fixtures or controlled mocks.

Do not rely on a live AI provider for normal CI validation.

## Test data rules

Test data must be:

```text
Synthetic
Minimal
Deterministic
Safe to commit
Free of credentials and private user information
```

Avoid:

```text
Production database exports
Real API tokens
Private customer prompts
Unredacted code artifacts
Personally identifying user records
```

## CI evolution

The CI workflow should grow in stages.

### Current

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

### Next

```text
Unit tests
Schema and event contract tests
Coverage reporting where useful
```

### Data-platform phase

```text
PostgreSQL integration tests
Outbox tests
Kafka consumer tests
MongoDB projection tests
ClickHouse ingestion tests
Graph projection tests
```

### Product-workflow phase

```text
Browser end-to-end tests
Accessibility checks
API route tests
AI Studio fixture-based workflow tests
```

### Production-readiness phase

```text
Dependency security checks
Secret scanning
Performance tests
Load tests
Migration verification
Release checks
```

## Failure response

When CI fails:

1. Find the first meaningful error in the failed job.
2. Reproduce it locally using the same command when possible.
3. Fix the underlying issue rather than suppressing the check.
4. Push the focused correction.
5. Confirm the next CI run passes.
6. Document a new architectural rule when the failure exposes a recurring boundary problem.

Do not treat the final generic process-exit message as the root cause.

## Related documents

- [Getting started](getting-started.md)
- [Workspace guide](workspace.md)
- [Contribution guide](contribution-guide.md)
- [Application architecture](../architecture/application-architecture.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Security and data handling](../operations/security-and-data-handling.md)
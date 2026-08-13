# StrataForge Documentation

StrataForge is an architecture intelligence and full-stack blueprint platform.

It helps developers, technical leads, architects, and learners explore software patterns, compare technology choices in context, assemble compatible stacks, and design explainable implementation-ready solutions.

## Documentation status

StrataForge is under active development.

Documentation uses the following status labels:

| Status | Meaning |
|---|---|
| Current | Implemented and available in the repository or active application |
| In progress | Actively being designed, documented, or implemented |
| Proposed | Planned architecture or capability not yet implemented |
| Accepted | Approved architecture decision documented in an ADR |
| Superseded | Replaced by a later decision or document |
| Deferred | Intentionally postponed |

## Product

The product documentation explains what StrataForge is, who it serves, and how its capabilities evolve.

- [Product vision](product/vision.md)
- [Capabilities](product/capabilities.md)
- [Domain glossary](product/glossary.md)

### Product modes

```text
Explore
  Browse patterns, scenarios, languages, technologies, platforms,
  and implementation examples.

Compare
  Compare exactly two options within a meaningful architecture context.

Atlas
  Start with curated, explainable end-to-end architecture blueprints.

Composer
  Assemble a custom stack layer by layer with compatibility guidance.

AI Studio
  Generate validated, AI-assisted architecture and implementation plans.
```

## Architecture

The architecture documentation describes the current workspace and the proposed target platform.

- [Architecture overview](architecture/overview.md)
- [System context](architecture/system-context.md)
- [Application architecture](architecture/application-architecture.md)
- [Domain model](architecture/domain-model.md)
- [Data platform](architecture/data-platform.md)
- [Eventing model](architecture/eventing.md)

### Current architecture

```text
pnpm workspace
→ Next.js web application
→ shared content, schemas, UI, and integrations packages
→ GitHub Actions lint and production-build validation
```

### Target architecture

```text
PostgreSQL
  Canonical transactional state and transactional outbox.

MongoDB
  Flexible documents, versioned blueprints, and AI-generation artifacts.

Kafka
  Durable domain-event transport, replay, and asynchronous processing.

ClickHouse
  Product analytics, event analysis, and operational insights.

Grafana
  Dashboards, alerts, and event-pipeline visibility.

Graph projection
  Derived relationship traversal and recommendation explanations.
```

## Architecture decisions

Architecture Decision Records preserve significant long-term technical decisions and tradeoffs.

- [ADR index](decisions/README.md)
- [ADR-0001: Monorepo and package boundaries](decisions/0001-monorepo-and-package-boundaries.md)
- [ADR-0002: Polyglot data architecture](decisions/0002-polyglot-data-architecture.md)
- [ADR-0003: Event-driven integration](decisions/0003-event-driven-integration.md)

## Development

Development documentation explains how to set up, run, validate, and contribute to StrataForge.

- [Getting started](development/getting-started.md)
- [Workspace guide](development/workspace.md)
- [Testing and CI](development/testing-and-ci.md)
- [Contribution guide](development/contribution-guide.md)

### Essential commands

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm build
```

## Operations

Operations documentation defines local-runtime practices and proposed production concerns.

- [Local development operations](operations/local-development.md)
- [Observability](operations/observability.md)
- [Security and data handling](operations/security-and-data-handling.md)

## Planning

Planning documentation tracks delivery direction, implementation sequencing, and future work.

- [StrataForge roadmap](planning/roadmap.md)

## Public writing

The `medium/` directory contains long-form articles prepared for Medium and other public channels.

- [Medium publishing guide](medium/README.md)
- [MD-0001: Introducing StrataForge](medium/md-0001-introducing-strataforge.md)

## Engineering journal

The engineering journal captures implementation history, milestones, discoveries, decisions, debugging lessons, and follow-up work.

- [Journal guide](journal/README.md)
- [Journal: Establishing the StrataForge foundation](journal/journal-2026-08-13-establishing-strataforge-foundation.md)

## Documentation map

```text
docs/
│
├── README.md
│
├── product/
│   ├── vision.md
│   ├── capabilities.md
│   └── glossary.md
│
├── architecture/
│   ├── overview.md
│   ├── system-context.md
│   ├── application-architecture.md
│   ├── domain-model.md
│   ├── data-platform.md
│   └── eventing.md
│
├── decisions/
│   ├── README.md
│   ├── 0001-monorepo-and-package-boundaries.md
│   ├── 0002-polyglot-data-architecture.md
│   └── 0003-event-driven-integration.md
│
├── development/
│   ├── getting-started.md
│   ├── workspace.md
│   ├── testing-and-ci.md
│   └── contribution-guide.md
│
├── operations/
│   ├── local-development.md
│   ├── observability.md
│   └── security-and-data-handling.md
│
├── planning/
│   └── roadmap.md
│
├── medium/
│   ├── README.md
│   └── md-0001-introducing-strataforge.md
│
└── journal/
    ├── README.md
    └── journal-2026-08-13-establishing-strataforge-foundation.md
```

## Documentation rules

When updating documentation:

```text
- Use relative Markdown links.
- Update docs/README.md when adding a major document.
- Include a status label in architecture, operations, planning,
  and decision documents.
- Distinguish current implementation from planned architecture.
- Create an ADR for meaningful long-term architecture decisions.
- Update the roadmap when implementation order changes.
- Add a journal entry for meaningful milestones, discoveries,
  or implementation lessons.
- Use docs/medium for public article drafts.
- Never include credentials, tokens, private prompts, or sensitive
  production information.
```

## Related repository files

- [Repository README](../README.md)
- [GitHub Actions CI workflow](../.github/workflows/ci.yml)
- [pnpm workspace configuration](../pnpm-workspace.yaml)
- [Contribution guide](development/contribution-guide.md)
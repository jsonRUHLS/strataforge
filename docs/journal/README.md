# StrataForge Engineering Journal

This directory contains chronological engineering-journal entries for StrataForge.

Journal entries capture the reasoning, decisions, experiments, discoveries, implementation progress, setbacks, and lessons that occur while building the product.

The journal is different from formal architecture documentation.

```text
Architecture documentation
  Describes the intended system, current boundaries, and accepted decisions.

Architecture Decision Records
  Record significant decisions, alternatives, and long-term consequences.

Development documentation
  Explains how to run, test, contribute to, and operate the project.

Engineering journal
  Records what happened while building the project and why it mattered.
```

## Purpose

The StrataForge engineering journal exists to preserve context that may not belong in source code, pull requests, roadmap documents, or ADRs.

Journal entries may document:

- Product and architecture discoveries.
- Implementation milestones.
- Build, dependency, CI, and tooling issues.
- Design tradeoffs considered during feature work.
- Changes in project direction.
- Experiments and prototypes.
- Lessons from debugging.
- Documentation progress.
- Repository, CI, and workflow setup.
- Questions that need future decisions.
- Links to related commits, pull requests, ADRs, and Medium articles.

The journal is a working record. It should be honest, specific, and useful to the future version of the team.

## Journal-entry principles

Entries should:

- Be dated.
- Describe what actually happened.
- Separate facts from opinions or future ideas.
- Identify whether work is complete, in progress, blocked, or deferred.
- Link to relevant documentation and pull requests when available.
- Record tradeoffs and lessons, not only successful outcomes.
- Avoid secrets, private credentials, private user data, and unredacted production information.
- Clearly distinguish current implementation from proposed architecture.

Entries should not:

- Replace ADRs for long-term architectural decisions.
- Replace issue tracking for actionable work.
- Claim planned systems are already implemented.
- Include API keys, tokens, passwords, connection strings, or private prompts.
- Become a copy of commit messages without useful context.

## File naming

Journal entries use this convention:

```text
journal-YYYY-MM-DD-short-descriptive-title.md
```

Examples:

```text
journal-2026-08-11-establishing-strataforge-repository-and-ci.md
journal-2026-08-12-documenting-the-target-data-platform.md
journal-2026-08-13-defining-publication-and-journal-workflows.md
```

Use:

```text
YYYY-MM-DD
  The date the entry was written or the work occurred.

short-descriptive-title
  A lowercase kebab-case summary of the entry.
```

If multiple entries are created on the same day, add a meaningful suffix:

```text
journal-2026-08-13-ci-build-repair.md
journal-2026-08-13-strataforge-rebrand.md
```

Do not use generic names such as:

```text
journal-update.md
notes.md
thoughts.md
progress.md
```

## Entry template

Use this template for new entries:

```md
# Journal: Short descriptive title

> Date: YYYY-MM-DD  
> Status: Complete | In progress | Blocked | Deferred  
> Area: Product | Architecture | Development | CI | Data Platform | Documentation | Operations

## Context

What prompted this work, investigation, or decision?

## What happened

What work was completed, changed, tested, investigated, or discovered?

## Decisions and rationale

What decisions were made? Why were they made?

If a decision is long-term and architectural, link to or create an ADR.

## Validation

What commands, tests, CI checks, review steps, or observations confirmed the result?

```text
pnpm lint
pnpm build
GitHub Actions CI
Manual browser verification
Schema validation
```

## Lessons

What should future contributors remember?

## Follow-up

What remains incomplete, blocked, deferred, or ready for the next phase?

## Related work

- Pull request:
- Commit:
- ADR:
- Documentation:
- Medium article:
```

## Status values

Use one primary status per entry.

| Status | Meaning |
|---|---|
| Complete | The documented work is finished and validated |
| In progress | Work has begun but remains active |
| Blocked | Progress depends on an unresolved issue or external dependency |
| Deferred | Work is intentionally postponed |
| Superseded | A later entry, ADR, or implementation replaced the recorded direction |

## Area values

Use one or more applicable areas:

```text
Product
Architecture
Development
Documentation
CI
Data Platform
Eventing
Observability
Security
Operations
AI Studio
Explore
Compare
Atlas
Composer
```

## When to write an entry

Create a journal entry when:

```text
A significant implementation milestone is completed.

A build, CI, dependency, or workspace problem requires meaningful investigation.

A product or architecture direction becomes clearer.

A feature reveals a gap in the domain model or documentation.

A meaningful experiment succeeds or fails.

A future implementation phase is prepared through documentation or planning.

A decision needs context before it becomes a formal ADR.

A public rebrand, repository transfer, or CI foundation is completed.
```

Do not require a journal entry for every small commit, typo correction, or routine dependency update.

## Relationship to ADRs

Use a journal entry to describe the journey.

Use an ADR to preserve the accepted decision.

Example:

```text
Journal entry:
Why the team explored multiple data-platform options and what was learned.

ADR:
The accepted decision to use PostgreSQL, MongoDB, Kafka,
ClickHouse, Grafana, and a derived graph projection.
```

A journal entry may link to an ADR:

```md
## Related work

- ADR: [ADR-0002: Polyglot data architecture](../decisions/0002-polyglot-data-architecture.md)
```

## Relationship to Medium articles

Journal entries are internal project records.

Medium articles are public narratives written for an external audience.

A journal entry may become source material for a Medium article.

```text
Journal:
Detailed timeline, implementation issues, lessons, and links.

Medium:
Clear public story, practical explanation, and reader-focused takeaway.
```

Example:

```text
Journal entry:
How the StrataForge CI workflow was established and repaired.

Medium article:
Why reproducible builds and explicit workspace dependencies matter
in a modern TypeScript monorepo.
```

## Suggested first entries

```text
[Journal: Establishing the StrataForge foundation](journal-2026-08-13-establishing-strataforge-foundation.md)
journal-2026-08-11-establishing-strataforge-repository-and-ci.md
journal-2026-08-12-rebranding-pattern-atlas-as-strataforge.md
journal-2026-08-12-documenting-the-strataforge-architecture.md
journal-2026-08-13-establishing-publication-and-journal-workflows.md
```

## Live Journal Entries

```
[Journal: Establishing the StrataForge foundation](journal-2026-08-13-establishing-strataforge-foundation.md)
```

## Related documents

- [Project roadmap](../planning/roadmap.md)
- [Architecture overview](../architecture/overview.md)
- [Architecture Decision Records](../decisions/README.md)
- [Medium publishing](../medium/README.md)
- [Contribution guide](../development/contribution-guide.md)
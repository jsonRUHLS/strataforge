# Architecture Decision Records

Architecture Decision Records, or ADRs, preserve significant technical and product-architecture decisions made for StrataForge.

An ADR records the context of a decision, the decision itself, its consequences, and the alternatives considered. ADRs help future contributors understand why the system works the way it does without relying on memory, commit history, or informal conversation.

## When to create an ADR

Create an ADR when a decision has a meaningful long-term impact on:

- Application architecture.
- Package or workspace boundaries.
- Data ownership.
- Database selection.
- Eventing and integration strategy.
- API design.
- Authentication and authorization.
- Deployment and infrastructure.
- Observability and data retention.
- AI-provider integration.
- Security or privacy posture.
- External vendor dependencies.
- Public compatibility commitments.

Do not create an ADR for routine implementation details, temporary refactors, minor library updates, formatting choices, or decisions that are easy to reverse without architectural impact.

## ADR status

Each ADR must declare one of these statuses:

| Status | Meaning |
|---|---|
| Proposed | Under discussion and not yet accepted |
| Accepted | Approved and active |
| Rejected | Considered and explicitly not chosen |
| Superseded | Replaced by a newer ADR |
| Deprecated | Still historically relevant but no longer recommended |

An accepted ADR should not be rewritten to erase a decision that changed later. Create a new ADR and mark the older ADR as superseded.

Example:

```md
> Status: Superseded by [ADR-0012](0012-new-decision.md)
```

## Naming convention

Use a four-digit sequence number and a short lowercase kebab-case title:

```text
0001-monorepo-and-package-boundaries.md
0002-polyglot-data-architecture.md
0003-event-driven-integration.md
```

Use sequential numbers. Do not reuse a number, even if an ADR is rejected or superseded.

## Required structure

Every ADR should use this format:

```md
# ADR-0001: Decision title

> Status: Proposed  
> Date: YYYY-MM-DD

## Context

What problem, constraint, or opportunity requires a decision?

## Decision

What has been decided?

## Consequences

### Positive

What benefits does this decision provide?

### Tradeoffs

What complexity, cost, risk, or limitation does it introduce?

## Alternatives considered

What reasonable alternatives were considered, and why were they not selected?

## Implementation notes

Optional. What is the expected migration or rollout approach?

## Related documents

Links to relevant architecture, product, or other ADR documents.
```

## Decision rules

ADRs should:

- State facts, assumptions, and tradeoffs plainly.
- Distinguish current implementation from future target architecture.
- Identify when a decision is tentative or proposed.
- Link to related domain, data, eventing, security, or operational documents.
- Name concrete alternatives.
- Explain why alternatives were not selected.
- Avoid vendor marketing language.
- Remain concise enough to be read during implementation and review.

ADRs should not:

- Include credentials, secrets, connection strings, or private production details.
- Claim infrastructure is deployed when it is only proposed.
- Replace implementation documentation.
- Become generic product requirements documents.
- Be silently edited to change an already accepted decision.

## Initial ADR roadmap

The following ADRs should be created before or alongside the data-platform implementation work.

| ADR | Decision |
|---|---|
| [ADR-0001](0001-monorepo-and-package-boundaries.md) | Use a pnpm monorepo with explicit package responsibilities |
| [ADR-0002](0002-polyglot-data-architecture.md) | Use PostgreSQL, MongoDB, Kafka, ClickHouse, Grafana, and a derived graph projection for distinct workloads |
| [ADR-0003](0003-event-driven-integration.md) | Use Kafka and the PostgreSQL transactional outbox for reliable domain-event publication |
| ADR-0004 | Define catalog data ownership and source-controlled content import strategy |
| ADR-0005 | Define recommendation source classification and AI-output validation requirements |
| ADR-0006 | Define observability, event retention, and privacy boundaries |
| ADR-0007 | Define authentication, organization, and authorization model |
| ADR-0008 | Define deployment and environment strategy |

The roadmap is directional. Add ADRs when a decision is actually needed; do not create speculative ADRs merely to fill sequence numbers.

## Review process

Before accepting an ADR:

1. Verify that the context identifies a real decision.
2. Confirm that the decision is consistent with the product vision.
3. Confirm the document distinguishes current behavior from target architecture.
4. Review tradeoffs and operational consequences.
5. Confirm affected architecture documents are updated.
6. Open a pull request with the ADR and any required supporting documentation.
7. Mark the ADR as `Accepted` only after agreement and merge.

## Current decisions

| ADR | Status | Summary |
|---|---|---|
| [ADR-0001](0001-monorepo-and-package-boundaries.md) | Proposed | Define the pnpm workspace and package ownership model |
| [ADR-0002](0002-polyglot-data-architecture.md) | Proposed | Define the target multi-model data platform |
| [ADR-0003](0003-event-driven-integration.md) | Proposed | Define durable event publication and projection processing |

## Related documents

- [Architecture overview](../architecture/overview.md)
- [System context](../architecture/system-context.md)
- [Application architecture](../architecture/application-architecture.md)
- [Domain model](../architecture/domain-model.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Product vision](../product/vision.md)
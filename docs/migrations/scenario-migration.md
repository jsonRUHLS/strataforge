# Scenario Migration

> Status: In progress

## Purpose

StrataForge is migrating authored scenarios from the pattern-content package into the PostgreSQL catalog.

The catalog is becoming the source of data for:

```text
/scenarios
/scenarios/[slug]
```

Authored pattern content remains in place during the transition. It continues to power the richer pattern pages while the database catalog gains complete scenario coverage.

The governing migration decision is recorded in
[`ADR-004: Migrate authored scenarios into the catalog`](../decisions/adr-004-authored-scenario-catalog-migration.md).

## Migration approach

Scenario discovery is generated from the content package:

```text
packages/content
→ scripts/inventory-scenarios.ts
→ docs/migrations/scenario-inventory.json
```

Reviewed catalog records are maintained in a migration manifest:

```text
packages/database/src/migrations/authored-scenarios.ts
```

The database seed reads the manifest and upserts:

```text
Scenario
→ ScenarioPattern
→ ScenarioTechnology
```

## Identity and relationship rules

- Every catalog scenario has a stable, reviewed kebab-case `slug`.
- A catalog scenario may relate to one or more patterns.
- Similar wording does not automatically mean two authored entries are the same scenario.
- Shared scenarios use one catalog record with multiple source references and pattern links.
- Technology links are added only when the technology exists in the catalog and the relationship is explicit.
- Missing referenced patterns or technologies cause the seed to fail.
- Authored scenario text is retained until the migration is complete and the database model can represent all necessary content.

## Seed behavior

The scenario seed uses `upsert` operations keyed by stable slugs and compound relationship keys.

It is required to be idempotent:

```text
Run seed once
→ creates or updates catalog records

Run seed again
→ does not create duplicate scenarios or relationships
```

## Current coverage

| Pattern | Authored scenarios | Catalog scenarios | Status |
|---|---:|---:|---|
| Abstract Factory | 6 | 6 | Complete |
| Adapter | 3 | 3 | Complete |
| Bridge | 6 | 6 | Complete |
| Builder | 7 | 7 | Complete |
| Chain of Responsibility | 6 | 6 | Complete |
| Command | 6 | 6 | Complete |
| Composite | 6 | 6 | Complete |
| Decorator | 8 | 8 | Complete |
| Facade | 6 | 6 | Complete |
| Factory Method | 3 | 3 | Complete |
| Flyweight | 3 | 3 | Complete |
| Interpreter | 3 | 3 | Complete |
| Iterator | 3 | 3 | Complete |
| Mediator | 3 | 3 | Complete |
| Memento | 3 | 3 | Complete |
| Observer | 3 | 3 | Complete |
| Prototype | 3 | 3 | Complete |
| Proxy | 3 | 3 | Complete |
| Singleton | 3 | 3 | Complete |
| State | 3 | 3 | Complete |
| Remaining patterns | See inventory | 0 | Not started |

## Migrated scenarios

### Abstract Factory

- `abstract-factory-ui-theme-kit`
- `abstract-factory-cloud-provider-kit`
- `abstract-factory-game-environment-kit`
- `abstract-factory-document-suite`
- `abstract-factory-device-os-kit`
- `abstract-factory-analytics-stack-kit`

### Adapter

- `adapter-legacy-payment-gateway`
- `third-party-task-api`
- `adapter-event-payload-mapper`
  
### Bridge

- `bridge-data-source-abstraction`
- `bridge-notification-delivery`
- `bridge-payment-routing`
- `bridge-printer-driver-layer`
- `bridge-remote-control-bridge`
- `bridge-shape-renderer-bridge`

### Builder

- `builder-api-request-construction`
- `builder-report-generation`
- `builder-ui-form-assembly`
- `builder-configuration-assembly`
- `builder-document-composition`
- `builder-character-creation`
- `builder-pizza-order-construction`

### Chain of Responsibility

- `chain-of-responsibility-password-validation-chain`
- `chain-of-responsibility-support-ticket-chain`
- `chain-of-responsibility-approval-workflow-chain`
- `chain-of-responsibility-request-middleware-chain`
- `chain-of-responsibility-notification-routing-chain`
- `chain-of-responsibility-form-command-chain`

### Command

- `command-text-editor-undo`
- `command-job-queue-processing`
- `command-remote-control-actions`
- `command-admin-action-queue`
- `command-workflow-step-command`
- `command-macro-command-sequence`

### Composite

- `composite-file-system-composite`
- `composite-menu-composite`
- `composite-organization-chart-composite`
- `composite-dashboard-widget-tree`
- `composite-permission-group-hierarchy`
- `composite-scene-graph-composite`

### Decorator

- `decorator-notification-delivery`
- `decorator-http-client`
- `decorator-file-storage`
- `decorator-text-formatting`
- `decorator-coffee-customization`
- `decorator-notification-channels`
- `decorator-logging-metrics-and-tracing`
- `decorator-ui-accessibility-enhancement`

### Facade

- `facade-checkout-workflow`
- `facade-video-conversion-pipeline`
- `facade-home-theater-startup`
- `facade-account-onboarding`
- `facade-report-generation`
- `facade-device-setup`

### Factory Method

- `factory-method-document-export`
- `factory-method-notification-channel`
- `factory-method-logger-transport`

### Flyweight

- `flyweight-tree-rendering-flyweight`
- `flyweight-text-formatting-flyweight`
- `flyweight-game-tile-flyweight`

### Interpreter

- `interpreter-expression-interpreter`
- `interpreter-boolean-rule-interpreter`
- `interpreter-command-interpreter`

### Iterator

- `iterator-playlist-iterator`
- `iterator-pagination-iterator`
- `iterator-tree-traversal-iterator`

### Mediator

- `mediator-chat-room-mediator`
- `mediator-air-traffic-mediator`
- `mediator-ui-mediator`

### Memento

- `memento-text-editor-memento`
- `memento-game-save-memento`
- `memento-form-state-memento`

### Observer

- `observer-stock-price-alerts`
- `observer-order-status-notifications`
- `observer-news-publisher`

### Prototype

- `prototype-document-template-clone`
- `prototype-game-character-clone`
- `prototype-product-config-clone`

### Proxy

- `proxy-virtual-image-proxy`
- `proxy-access-control-proxy`
- `proxy-remote-service-proxy`

### Singleton

- `singleton-application-config-singleton`
- `singleton-logger-singleton`
- `singleton-cache-manager-singleton`

### State

- `state-order-state`
- `state-traffic-light-state`
- `state-media-player-state`

## Validation

Run:

```bash
pnpm inventory:scenarios
pnpm --filter @atlas-patterns/database build
pnpm --filter @atlas-patterns/database seed
pnpm --filter @atlas-patterns/database seed
pnpm lint
pnpm build
```

Verify in the application:

```text
/scenarios
/scenarios/third-party-task-api
/scenarios/adapter-legacy-payment-gateway
/scenarios/adapter-event-payload-mapper
/scenarios/abstract-factory-ui-theme-kit
/scenarios/not-a-real-scenario
```

## Next batch

Select the next pattern from `docs/migrations/scenario-inventory.json`, seed its catalog Pattern record, and migrate only the authored scenarios associated with that pattern.

Completed pattern batches:

```text
Abstract Factory
Adapter
Bridge
Builder
Chain of Responsibility
Command
Composite
Decorator
Facade
Factory Method
Flyweight
Interpreter
Iterator
Mediator
Memento
Observer
Prototype
Proxy
Singleton
State
```

Keep each pattern or small pattern-family batch in a separate pull request.
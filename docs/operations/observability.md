# Observability

> Status: Proposed  
> Last updated: 2026-08-12

This document defines the target observability model for StrataForge.

StrataForge will use observability to understand product usage, application reliability, asynchronous workflow health, data-projection status, and event-processing failures. The target platform uses ClickHouse for analytical event storage and Grafana for dashboards and alerts.

This is a proposed architecture. ClickHouse, Grafana, Kafka event monitoring, and production alerting are not yet implemented.

For data ownership, see [Data platform](../architecture/data-platform.md). For event-processing rules, see [Eventing model](../architecture/eventing.md).

## Goals

StrataForge observability should make it possible to answer:

```text
Is the application available and building correctly?

Are users successfully completing important workflows?

Are catalog, compatibility, blueprint, and AI workflows functioning?

Are events being written, published, consumed, and projected?

Are event consumers behind, retrying, or failing?

Are AI-generated results being validated successfully?

Are MongoDB, graph, and ClickHouse projections current?

Can one user action be traced across application, event, and projection work?

Are alerts actionable, timely, and safe?
```

## Principles

### Observe user outcomes

Metrics should measure meaningful outcomes, not only infrastructure activity.

Useful:

```text
Blueprint creation completion rate
Comparison save rate
AI-generation validation success rate
Recommendation acceptance rate
Time from generation start to completed blueprint
```

Less useful without context:

```text
Total HTTP requests
Total Kafka messages
Total database queries
```

Infrastructure metrics remain important, but they should support product outcomes and reliability diagnosis.

### Preserve correlation

Every meaningful user workflow should carry a correlation ID.

```text
User starts AI generation
→ API request
→ generation request record
→ Kafka event
→ MongoDB artifact
→ ClickHouse event
→ real-time completion notification
```

The same correlation ID should make that workflow traceable across logs, events, and operational records.

### Minimize sensitive data

Observability data must not contain:

```text
Passwords
API keys
Access tokens
Database connection strings
Raw secrets
Private source code
Unnecessary raw prompt content
Unredacted private user data
```

Use stable IDs, aggregate metadata, redacted error summaries, and approved diagnostic fields instead.

### Prefer structured telemetry

Logs, events, and error records should use structured fields rather than unstructured prose whenever practical.

```json
{
  "level": "error",
  "eventType": "ai.generation.failed",
  "correlationId": "9e6a4f94-d1da-4e32-a64f-fae9ef5c7051",
  "generationRequestId": "5b119816-6e22-4c03-bf4b-cc647fbc13a7",
  "failureCategory": "provider_timeout",
  "retryCount": 2
}
```

## Observability signals

StrataForge will use four complementary signal types.

| Signal | Purpose | Target system |
|---|---|---|
| Product events | User actions and feature outcomes | Kafka → ClickHouse |
| Operational events | Background processing, retries, failures | Kafka → ClickHouse |
| Logs | Detailed diagnostic context | Application and worker log destination |
| Metrics | Aggregated health, latency, throughput, and error rates | Grafana-compatible metrics source |
| Traces | Cross-service request and workflow visibility | Future tracing integration |

## Product events

Product events describe meaningful user interactions and outcomes.

Examples:

```text
explore.pattern.viewed
explore.scenario.viewed
explore.code_example.copied
explore.search.performed

compare.started
compare.completed
compare.saved
compare.recommendation.accepted

atlas.started
atlas.blueprint.created
atlas.blueprint.saved
atlas.blueprint.exported

composer.layer.selected
composer.compatibility.checked
composer.override.recorded

ai.generation.started
ai.generation.completed
ai.generation.failed
ai.blueprint.accepted
```

Product events should answer questions such as:

```text
Which scenarios are most explored?

Which technology pairs are compared most often?

Which recommendations are accepted or overridden?

Where do users abandon Atlas or Composer workflows?

How long do AI-assisted workflows take?

Which code examples are most useful?
```

## Operational events

Operational events describe application and pipeline behavior.

Examples:

```text
outbox.event.created
outbox.event.published
outbox.event.publish_failed

consumer.processing.started
consumer.processing.completed
consumer.processing.retrying
consumer.processing.failed

projection.document.completed
projection.document.failed
projection.graph.completed
projection.graph.failed

analytics.ingestion.completed
analytics.ingestion.failed

notification.delivery.completed
notification.delivery.failed
```

Operational events should contain enough context to diagnose failures without exposing unnecessary private payload data.

## Logging

### Log levels

Use consistent log levels.

| Level | Use |
|---|---|
| `debug` | Local or temporary diagnostic detail |
| `info` | Expected lifecycle milestones |
| `warn` | Unexpected condition that did not stop the operation |
| `error` | Operation failed and needs investigation |
| `fatal` | Process cannot continue safely |

### Required structured log fields

Application and worker logs should include applicable fields:

```text
timestamp
level
service
environment
message
correlationId
causationId
eventId
eventType
aggregateType
aggregateId
userId or organizationId only when authorized and necessary
durationMs
retryCount
failureCategory
```

### Logging rules

- Log events at lifecycle boundaries, not every internal function call.
- Do not log full request bodies by default.
- Do not log full AI prompts or generated artifacts by default.
- Redact secrets before logs leave the process.
- Avoid logging duplicate errors at every layer of the same failure.
- Include stack traces for unexpected server-side failures in protected logs.
- Return safe, user-facing error messages to the browser.

## Metrics

Metrics should be aggregated and low-cardinality.

Avoid using unbounded values such as user IDs, project IDs, prompt text, or blueprint IDs as metric labels.

### Application metrics

```text
HTTP request count
HTTP error count
Request duration
Route-handler duration
Database query duration
Authentication failure count
Rate-limit count
```

### Blueprint metrics

```text
Blueprint creation count
Blueprint validation duration
Blueprint validation failure count
Blueprint save rate
Blueprint export count
Composer override count
```

### AI Studio metrics

```text
Generation request count
Generation duration
Provider request duration
Generation validation success rate
Generation failure count
Retry count
Artifact persistence duration
```

### Outbox and Kafka metrics

```text
Pending outbox event count
Outbox publish latency
Outbox publish failure count
Kafka producer error count
Kafka consumer lag
Consumer processing duration
Consumer retry count
Dead-letter event count
```

### Projection metrics

```text
MongoDB document projection duration
MongoDB document projection failure count
Graph projection duration
Graph projection failure count
ClickHouse ingestion duration
ClickHouse ingestion failure count
Real-time notification delivery duration
Real-time notification failure count
```

## ClickHouse event analytics

> Status: Proposed

ClickHouse will store sanitized product and operational event records.

The initial event log should support fields such as:

```text
occurred_at
event_id
event_type
event_version
producer
aggregate_type
aggregate_id
correlation_id
actor_type
sanitized payload
```

ClickHouse should support:

```text
Product funnel analysis
Feature adoption analysis
Technology-selection trends
Recommendation outcome analysis
AI-generation performance analysis
Consumer and projection health analysis
Failure and retry analysis
```

ClickHouse is an analytical store. It must not be used as the authoritative source for product state, user permissions, or transactional writes.

## Grafana dashboards

> Status: Proposed

Grafana will provide product and operational dashboards.

### Product dashboard

```text
Explore
- Pattern views
- Scenario views
- Search activity
- Code-example copy activity

Compare
- Comparison starts
- Most compared technologies
- Saved comparison rate
- Recommendation acceptance rate

Atlas
- Blueprint starts
- Blueprint completion rate
- Blueprint save rate
- Export rate

Composer
- Layer selection frequency
- Compatibility failure rate
- Override frequency
- Most selected technologies by layer

AI Studio
- Generation starts
- Completion rate
- Validation success rate
- Duration percentiles
- Most common open-question categories
```

### Event pipeline dashboard

```text
Outbox
- Pending events
- Publish latency
- Publish failures

Kafka
- Throughput by topic
- Consumer lag by consumer group
- Consumer processing failures
- Retry volume
- Dead-letter volume

Projections
- MongoDB projection success/failure
- Graph projection success/failure
- ClickHouse ingestion success/failure
- Projection processing duration
```

### Reliability dashboard

```text
Application
- Request error rate
- Request duration
- Build or deployment status
- API route failures

AI Studio
- Provider latency
- Provider failure rate
- Validation failures
- Retry rate

Notifications
- SSE connection count
- Delivery failures
- Connection duration
```

## Alerting

Alerts should be actionable.

Every alert should identify:

```text
What failed?
Where did it fail?
When did it begin?
What is the impact?
What immediate action should an operator take?
Where can the operator investigate further?
```

### Initial alert candidates

```text
Outbox events remain unpublished beyond threshold.

Kafka consumer lag exceeds threshold for a sustained period.

Dead-letter event volume exceeds threshold.

AI-generation failure rate exceeds normal baseline.

Graph projection failures occur repeatedly.

ClickHouse ingestion stops or falls behind.

Application error rate exceeds threshold.

Real-time notification delivery failures exceed threshold.
```

### Alert anti-patterns

Avoid alerts for:

```text
Every individual warning
Short-lived transient retries
Expected development-environment failures
Metrics without a user or operational impact
Conditions without a documented owner or response action
```

Alert thresholds should be set after measuring normal behavior. Avoid treating arbitrary initial values as production service-level objectives.

## Service-level indicators

> Status: Proposed

StrataForge should eventually define service-level indicators before committing to service-level objectives.

Initial indicators may include:

| Workflow | Indicator |
|---|---|
| Explore | Successful page or query response rate |
| Compare | Comparison completion rate |
| Blueprint save | Successful canonical save rate |
| AI Studio | Validated generation completion rate |
| Event publication | Outbox-to-Kafka publish success rate |
| Projection | Consumer success rate and projection lag |
| Notification | Successful authorized progress-delivery rate |

Service-level objectives should be introduced only after sufficient operating data exists.

## Correlation and tracing

### Correlation IDs

A correlation ID begins at the user action or scheduled workflow boundary.

```text
Browser request
→ API request
→ command handler
→ database transaction
→ outbox event
→ Kafka event
→ projection worker
→ analytical event
→ SSE notification
```

The correlation ID should persist through each stage.

### Causation IDs

A causation ID identifies the event or command that directly caused another event.

```text
atlas.blueprint.created
  ↓
atlas.document.projected

The projection event has:
causationId = original blueprint-created event ID
```

### Trace IDs

Distributed tracing may be introduced later for cross-service request timing.

Trace identifiers should complement, not replace, domain-level correlation IDs.

## Error classification

Use consistent failure categories where possible.

```text
validation_error
authorization_error
not_found
conflict
database_unavailable
outbox_publish_failed
kafka_unavailable
consumer_processing_failed
projection_failed
provider_timeout
provider_rate_limited
provider_invalid_response
ai_output_invalid
notification_delivery_failed
unknown_error
```

Failure categories should be stable enough for aggregation and dashboards.

Avoid using raw error strings as primary analytical dimensions.

## Incident response direction

> Status: Proposed

When production infrastructure exists, operational incidents should follow a basic response sequence:

```text
1. Identify the affected workflow or service.
2. Assess user impact.
3. Check dashboards, logs, and correlation IDs.
4. Stabilize the immediate failure.
5. Retry or replay safely when appropriate.
6. Verify recovery.
7. Document root cause and follow-up work.
```

Events should be replayed only when:

```text
The target consumer is idempotent.
The replay scope is understood.
External side effects are protected from duplicate delivery.
Authorization and retention requirements are met.
The operation is recorded.
```

## Implementation sequence

### Phase 1: Structured application logs

```text
- Add consistent structured logging.
- Add correlation IDs for user requests.
- Define error categories.
- Redact sensitive values.
```

### Phase 2: Event pipeline telemetry

```text
- Record outbox metrics.
- Record Kafka producer and consumer metrics.
- Add consumer lag visibility.
- Add dead-letter monitoring.
```

### Phase 3: ClickHouse analytics

```text
- Ingest sanitized product and operational events.
- Create event-log table.
- Create initial materialized analytical views.
```

### Phase 4: Grafana dashboards

```text
- Add product dashboard.
- Add event-pipeline dashboard.
- Add reliability dashboard.
- Configure initial alerts after baseline measurement.
```

### Phase 5: Tracing and operational maturity

```text
- Add distributed traces where needed.
- Define service-level indicators.
- Introduce service-level objectives after measuring normal behavior.
- Add incident-response runbooks.
```

## Non-negotiable rules

- Do not log or emit secrets.
- Do not use user IDs, prompt text, or unbounded identifiers as metric labels.
- Use correlation IDs for meaningful user and asynchronous workflows.
- Keep product events separate from operational events.
- Keep analytics data separate from canonical transactional state.
- Ensure alerting produces actionable signals.
- Treat dead-letter volume and sustained consumer lag as operational health concerns.
- Clearly label proposed observability capabilities until deployed and verified.
- Preserve enough metadata to diagnose failures without exposing private payloads.

## Related documents

- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [System context](../architecture/system-context.md)
- [Local development](local-development.md)
- [Security and data handling](security-and-data-handling.md)
- [Testing and CI](../development/testing-and-ci.md)
# Security and Data Handling

> Status: In progress  
> Last updated: 2026-08-13

This document defines the security and data-handling principles for StrataForge.

StrataForge is an architecture intelligence and full-stack blueprint platform. As the product evolves from curated content into user projects, saved blueprints, AI-assisted planning, event processing, and analytics, it must protect user data, credentials, generated artifacts, and operational systems by design.

This document defines target direction and engineering expectations. It does not replace legal review, privacy policy, incident-response procedures, vendor security review, or formal compliance requirements.

For event-payload handling, see [Eventing model](../architecture/eventing.md). For metrics and operational telemetry, see [Observability](observability.md).

## Security goals

StrataForge should:

- Protect user accounts, projects, blueprints, and organization data.
- Prevent credentials and secrets from entering source control, logs, analytics, events, or browser bundles.
- Keep canonical transactional state separate from derived projections and analytics.
- Enforce authorization at every user-owned resource boundary.
- Validate all untrusted input, including AI-provider output.
- Limit data collection to information needed for product functionality and operations.
- Maintain traceability for sensitive actions without exposing sensitive content.
- Support safe local, staging, and production environment separation.
- Make security-relevant failures visible and actionable.

## Security principles

### Least privilege

Every user, service, worker, database connection, and external integration should receive only the permissions required for its responsibility.

Examples:

```text
Web application
  May query and update only authorized application data.

Outbox publisher
  May claim and publish pending outbox events.

Kafka consumer
  May read assigned topics and write only its intended projection.

ClickHouse analytics writer
  May append approved analytical events.

Grafana user
  May view approved dashboards but not modify canonical data.

AI provider
  Receives only the approved context required for generation.
```

### Defense in depth

Security should not depend on one control.

```text
Authentication
+ authorization
+ input validation
+ database constraints
+ secret management
+ audit logging
+ environment separation
+ dependency review
+ least-privilege service accounts
```

### Secure defaults

If required configuration is absent, the application should fail clearly or disable the optional capability safely.

Examples:

```text
Missing DATABASE_URL
→ database-backed feature does not start.

Missing AI provider credential
→ AI Studio is unavailable; core product remains usable.

Missing Kafka configuration
→ eventing worker does not start.

Missing authorization context
→ user-owned resource access is denied.
```

Do not silently fall back to insecure defaults.

### Minimize sensitive data

Collect, retain, emit, and expose only the data needed for a documented product or operational purpose.

Avoid treating all inputs, prompts, logs, or generated artifacts as automatically safe for analytics or long-term retention.

## Data classification

StrataForge data should be classified before introducing persistence, analytics, eventing, or external-provider use.

| Classification | Examples | Handling direction |
|---|---|---|
| Public | Published pattern descriptions, public documentation, public technology metadata | May be stored and displayed publicly when licensed and accurate |
| Internal | Architecture notes, operational configuration names, non-public roadmap details | Restrict to authorized contributors and systems |
| User-private | Saved projects, custom blueprints, private comparisons, private imported content | Restrict to authorized owner and organization members |
| Sensitive | Email addresses, account identifiers, access-control records, provider metadata | Limit access, avoid unnecessary analytics use |
| Secret | API keys, tokens, passwords, database credentials, signing keys | Never commit, log, emit, or expose to clients |

## Secrets management

Secrets include:

```text
API keys
Access tokens
Passwords
OAuth client secrets
Database connection strings
Kafka credentials
MongoDB credentials
ClickHouse credentials
Grafana service-account tokens
Signing keys
Webhook secrets
Private deployment credentials
```

### Never commit secrets

Do not commit:

```text
.env
.env.local
.env.production
*.pem
*.key
credentials.json
service-account.json
private configuration exports
```

Use `.gitignore` and inspect staged files before every commit:

```bash
git status
git diff --staged
```

### Environment files

Use committed example files only:

```text
.env.example
apps/pattern-atlas-web/.env.example
apps/event-worker/.env.example
```

Example files may include variable names and safe placeholders:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
KAFKA_BROKERS=HOST:PORT
MONGODB_URI=mongodb://USER:PASSWORD@HOST:PORT/DATABASE
AI_PROVIDER_API_KEY=replace-with-local-secret
```

Example files must never contain working credentials.

### Runtime secret injection

Production and staging secrets should be injected through approved environment configuration or a managed secret system.

Secrets must not be stored in:

```text
Source control
Client-side environment variables
Kafka event payloads
ClickHouse analytical events
Grafana dashboards
Browser logs
Error messages
AI prompts unless strictly necessary and approved
```

## Authentication

> Status: Proposed

StrataForge will require authentication when it introduces user-owned projects, saved comparisons, blueprints, organization membership, or AI-generation history.

Authentication should:

- Use a vetted identity provider or well-maintained authentication solution.
- Store only necessary identity information.
- Validate session integrity on server-side boundaries.
- Protect against session fixation, replay, and unauthorized token use.
- Expire and revoke sessions according to product requirements.
- Avoid exposing session tokens to application logs or analytics.

Authentication is distinct from authorization.

```text
Authentication:
Who is the user?

Authorization:
May this user perform this action on this resource?
```

## Authorization

> Status: Proposed

Authorization must be enforced server-side for every user-owned or organization-owned resource.

Initial protected resources may include:

```text
Projects
Saved comparisons
Blueprints
Composer selections
AI generation requests
AI generation artifacts
Imported research artifacts
Organization settings
Member records
```

### Authorization rules

- A user may access only resources they own or are authorized to access through organization membership.
- Organization membership must be checked before organization-scoped reads and writes.
- Ownership checks must occur in server-side command and query handlers.
- A client-provided user ID, organization ID, project ID, or blueprint ID is not proof of authorization.
- Event consumers must preserve authorization boundaries when creating user-visible data.
- Derived projections must not broaden access beyond the canonical authorization model.

### Example authorization flow

```text
User requests Blueprint ID
  ↓
Server validates session
  ↓
Server loads canonical blueprint ownership
  ↓
Server confirms user or organization membership
  ↓
Authorized response or safe not-found/forbidden response
```

Avoid returning detailed existence information for unauthorized resources.

## Input validation

All external input is untrusted.

Validate:

```text
Browser form input
Route parameters
Query parameters
API request bodies
Webhook payloads
Imported data
External API responses
Kafka event payloads
MongoDB change-stream payloads
AI-provider output
Environment configuration
```

Use shared schemas whenever possible.

```text
packages/schemas
  ↓
Zod validation schemas
  ↓
Application routes, workers, repositories, events, and integrations
```

### Validation rules

- Validate at system boundaries.
- Reject malformed or unsupported payloads explicitly.
- Normalize data only after validation.
- Do not trust client-side validation as an authorization or security control.
- Do not use `any` to bypass schema or type failures.
- Version event and API contracts deliberately.
- Record safe diagnostic information for validation failures.

## AI data handling

> Status: Proposed

AI Studio introduces additional data-handling responsibilities.

### AI input rules

Before sending data to an AI provider:

- Retrieve only relevant curated context.
- Avoid sending user secrets, credentials, private source code, or unnecessary personal data.
- Avoid sending full project histories when a focused summary is sufficient.
- Clearly identify whether the user has requested AI processing of private content.
- Apply organization and project authorization before retrieval.
- Use provider configuration appropriate for the desired data-retention and privacy posture.
- Record provider, model, schema version, and validation outcome where needed.

### AI output rules

AI output is untrusted until validated.

```text
AI response
→ parse structured output
→ validate against shared schema
→ apply compatibility rules
→ classify source and confidence
→ persist approved artifact
→ present result with assumptions and open questions
```

AI-generated recommendations must be labeled:

```text
Source: AI-generated
```

Curated and deterministic recommendations must not be represented as AI-generated, and AI-generated output must not be represented as curated fact.

### Prompt and artifact retention

Raw prompts and generated artifacts should be retained only when necessary for a documented product purpose.

Before retaining AI-related data, define:

```text
Why it is retained
Who can access it
How long it is retained
Whether it is included in analytics
How it can be deleted
Whether it is sent to external providers
```

## Event and telemetry data

> Status: Proposed

Kafka, ClickHouse, and Grafana require careful event-payload design.

### Event payload rules

Events should contain only what consumers need.

Good event payload:

```json
{
  "blueprintId": "64df806b-59c7-4025-896f-4e48190df871",
  "scenarioId": "1c4e46f1-0bb4-4e98-b27f-e7c010db5f29",
  "mode": "composer",
  "sourceClassification": "curated"
}
```

Unsafe event payload:

```json
{
  "userEmail": "person@example.com",
  "databaseUrl": "postgresql://username:password@host/database",
  "rawPrompt": "Here is our private production architecture...",
  "apiKey": "secret-value"
}
```

### Analytics rules

ClickHouse should receive sanitized product and operational events.

Analytics may include:

```text
Event type
Timestamp
Duration
Feature mode
Aggregate type
Anonymous or pseudonymous actor identifier where justified
Error category
Retry count
Source classification
Compatibility status
```

Analytics should not include:

```text
Passwords
Tokens
Connection strings
Raw prompts by default
Private code by default
Private document content by default
Unnecessary email addresses
Unbounded user-generated text as a metric label
```

## Logging and error handling

### Safe logging

Logs should provide useful diagnostics without exposing sensitive content.

Allowed examples:

```text
correlationId
eventId
eventType
aggregateType
aggregateId
error category
retry count
duration
sanitized provider status
```

Avoid logging:

```text
Authorization headers
Cookies
Session tokens
Full request body
Full response body
Raw database error details to clients
Private prompts
Generated private code
Credentials
```

### User-facing errors

User-facing errors should be actionable but safe.

Prefer:

```text
We could not complete the blueprint generation. Please try again.

You do not have access to this project.

The selected technologies have an incompatible integration path.
```

Avoid:

```text
PostgreSQL password authentication failed for user production_admin.

Kafka SASL authentication token expired: secret-token-value.

Provider response included unexpected private payload: ...
```

### Error categories

Use stable categories where possible:

```text
validation_error
authorization_error
not_found
conflict
rate_limited
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

## Dependency and supply-chain security

Dependencies are part of the application attack surface.

Before adding a dependency:

- Confirm the package solves a real need.
- Prefer maintained packages with clear ownership and documentation.
- Review direct and transitive dependency impact.
- Avoid adding packages for trivial utilities that can be implemented safely in a few lines.
- Keep dependencies scoped to the package that imports them.
- Commit `pnpm-lock.yaml` changes with dependency changes.
- Avoid unreviewed major-version upgrades during unrelated feature work.

Future CI and release work should include:

```text
Dependency vulnerability scanning
License review where appropriate
Secret scanning
Lockfile integrity checks
Automated dependency-update review
```

## Local, staging, and production separation

> Status: Proposed

Do not reuse production infrastructure or credentials for local development.

| Environment | Purpose | Data handling |
|---|---|---|
| Local | Developer iteration | Synthetic or local-only data |
| CI | Reproducible validation | Ephemeral synthetic test data |
| Staging | Pre-production validation | Sanitized or controlled non-production data |
| Production | User-facing service | Authorized production data only |

Environment boundaries should include separate:

```text
Credentials
Databases
Kafka topics or clusters
MongoDB databases
ClickHouse databases
Grafana instances or organizations
AI-provider credentials where practical
Encryption and signing keys
```

## Data retention and deletion

> Status: Proposed

Retention must be defined by data type and product purpose.

| Data type | Retention direction |
|---|---|
| Canonical user and project records | Retain according to product, contractual, and legal requirements |
| Curated public catalog content | Retain while active or historically useful |
| Kafka event history | Retain according to replay and operational needs |
| ClickHouse analytics events | Retain according to analytical value and privacy policy |
| AI prompts and artifacts | Retain only when necessary and authorized |
| Dead-letter records | Retain long enough for diagnosis and controlled replay |
| Logs | Retain according to operational and privacy requirements |

When user-owned data deletion is introduced, deletion workflows must account for:

```text
Canonical PostgreSQL records
MongoDB document artifacts
Graph projections
Search indexes
ClickHouse analytics policy
Kafka event-retention limitations
Backups and recovery policies
```

Deletion semantics must be documented before presenting a user-facing deletion promise.

## Security incident direction

> Status: Proposed

If a credential is exposed or a security vulnerability is discovered:

```text
1. Do not post secrets or exploit details publicly.
2. Revoke or rotate affected credentials immediately.
3. Restrict access or disable the affected integration if necessary.
4. Assess repository, logs, events, analytics, and deployment exposure.
5. Remove exposed material from active configuration.
6. Review history-remediation needs carefully.
7. Document the incident and remediation privately.
8. Create follow-up work for root-cause prevention.
```

A public Git commit does not become safe merely because a secret is removed in a later commit. Treat exposed credentials as compromised and rotate them.

## Security review checklist

Before merging work that affects data, auth, events, integrations, or infrastructure:

```text
- Input is validated at the boundary.
- Authorization is enforced server-side.
- New secrets are not committed.
- Sensitive values are not logged.
- Analytics events are sanitized.
- Event payloads contain only required data.
- AI-provider input is minimized and authorized.
- AI output is validated and classified.
- New dependencies are justified and scoped.
- Environment configuration is documented safely.
- Retention and deletion effects are considered.
- Documentation distinguishes current implementation from proposed controls.
```

## Related documents

- [System context](../architecture/system-context.md)
- [Application architecture](../architecture/application-architecture.md)
- [Data platform](../architecture/data-platform.md)
- [Eventing model](../architecture/eventing.md)
- [Observability](observability.md)
- [Local development](local-development.md)
- [Testing and CI](../development/testing-and-ci.md)
- [Contribution guide](../development/contribution-guide.md)
# Core Event Flow

PostgreSQL write
→ transactional outbox
→ Kafka domain event
→ MongoDB document projection
→ graph projection
→ ClickHouse analytical record
→ Grafana dashboard/query

# Non-negotiable rules
- Use versioned event contracts.
- Use idempotent consumers.
- Include event ID and correlation ID.
- Separate business events from projection events.
- Store failed messages in a dead-letter topic.
- Do not place credentials or sensitive user content in telemetry events.
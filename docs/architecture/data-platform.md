# Data Platform

> Status: Proposed

This document describes the target data architecture for StrataForge.
It does not represent the current production implementation.

| System      | Target responsibility                                              |
| ----------- | ------------------------------------------------------------------ |
| PostgreSQL  | Canonical transactional state, relationships, transactional outbox |
| MongoDB     | Flexible/versioned documents, AI artifacts, generated blueprints   |
| Kafka       | Durable domain-event transport, consumer integration, replay       |
| ClickHouse  | High-volume product and operational analytics                      |
| Grafana     | Dashboards, alerts, and operational visibility                     |
| Graph store | Derived relationship traversal and recommendation explanation      |
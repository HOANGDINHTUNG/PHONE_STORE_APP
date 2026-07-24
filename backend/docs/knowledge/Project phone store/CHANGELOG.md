---
title: Changelog
tags: [changelog]
---

# Changelog

## 2026-07-23 — v5.0.0

- Thêm CQRS và Event Sourcing: phân biệt CRUD/CQRS/projection/event store, optimistic stream, snapshot, read-your-writes, evolution, privacy và rebuild tests.
- Thêm Saga/workflow: choreography/orchestration, compensable/pivot/retryable steps, durable timers, UNKNOWN outcome, compensation và versioning.
- Thêm framework chọn NoSQL/data store theo access pattern, partition, consistency, lifecycle, restore, cost và team ownership.
- Thêm so sánh Kafka-style log, RabbitMQ-style queue và managed queues theo replay, ordering, routing, backlog và failure semantics.
- Thêm multi-region/DR: RTO/RPO theo capability, authority/fencing, failover/failback, backup/restore, reconciliation và residency.
- Thêm zero-downtime schema/data migration: expand–migrate–contract, backfill có checkpoint, mixed-version, DDL preflight và rollback.
- Thêm privacy engineering: inventory/lineage, minimization, retention-as-code, erasure graph/workflow, pseudonymization và backup semantics.
- Thêm platform engineering: platform-as-product, golden paths, self-service contracts, catalog, guardrails, upgrades và Agent integration.
- Thêm FinOps/cost engineering: unit economics, allocation, capacity, compute/DB/storage/network/telemetry cost và anomaly response.
- Thêm incident/on-call/chaos: command roles, mitigation, communication, postmortem, readiness, controlled experiments và safety.
- Viết lại mục 90 thành template đầy đủ 100 điểm với claim inventory, invariant, decision, code/SQL, failure, security, performance, rollout, evidence, AI protocol và ví dụ Cache-aside đã điền kín.
- Mở rộng MOC, AI Agent routing/rules, Definition of Done, case study Phone Store và danh mục nguồn cho toàn bộ v5.

## 2026-07-23 — v4.0.0

- Chuyển vault từ collection tuyến tính sang knowledge graph có MOC, task router, symptom router, evidence matrix và context packs cho AI Agent.
- Thêm nền tảng hệ phân tán: CAP đúng nghĩa, consistency models, logical clocks, quorum, consensus, split brain và fencing.
- Thêm so sánh REST, gRPC, GraphQL, webhooks và AsyncAPI với ví dụ contract, security, failure và compatibility.
- Thêm data modeling nâng cao: normalization, denormalization, multi-tenancy, temporal data, audit, soft delete và JSON.
- Thêm search architecture: Elasticsearch mapping/analyzer/relevance/pagination/projection/rebuild/tenant isolation.
- Thêm Kafka deep dive: partition key, idempotent producer, consumer groups, offsets, rebalance, EOS scope và poison-message recovery.
- Thêm performance/capacity engineering: Little's Law, open load model, coordinated omission, workload model, overload và N−1 testing.
- Thêm networking: DNS, TCP pool, TLS/mTLS, HTTP/2, load balancing, proxy timeout, Kubernetes Service và service mesh.
- Thêm threat modeling và software supply-chain security: secrets, dependency governance, SBOM, VEX, provenance, signing và CI identity.
- Thêm release engineering: immutable promotion, GitOps, feature flags, canary, expand-contract, automated analysis và rollback compatibility.
- Thêm case study Phone Store at Scale nối domain, SQL, API, idempotency, payment, Kafka, search, Redis, object storage, Kubernetes, telemetry và release.
- Mở rộng AI Constitution, Definition of Done và template ghi chú theo quan hệ knowledge graph.

## 2026-07-21 — v3.0.0

- Thêm Java Memory Model, concurrent collections, executor ownership, virtual threads và concurrency testing.
- Thêm design patterns/anti-patterns theo boundary, invariant và failure model.
- Thêm Redis cache design, eviction, persistence, replication, rate limiting và distributed lock/fencing.
- Thêm MySQL replica consistency, failover, backup/restore, PITR, partition, archive và sharding.
- Thêm microservices, API Gateway, contract governance, service communication và migration từ modular monolith.
- Thêm decision framework cho Spring MVC, WebFlux và virtual threads.
- Thêm durable background jobs, scheduling, Spring Batch, restartability và backfill.
- Thêm object storage, presigned upload, multipart, scan, reconciliation và retention.
- Thêm Kubernetes production: probes, resources, rollout, Secret, autoscaling và migration.
- Thêm OpenTelemetry/Micrometer implementation, telemetry pipeline, sampling, cardinality và SLO.
- Mở rộng Phone Store blueprint, AI Agent routing/constitution và Definition of Done.

## 2026-07-21 — v2.0.0

- Thêm DDD, aggregate, bounded context và Spring Modulith.
- Thêm Spring bean lifecycle, proxy/AOP, MVC request lifecycle và thread-context pitfalls.
- Thêm MySQL optimizer/index nâng cao với InnoDB physical model và query lab.
- Thêm concurrency anomalies, isolation, deadlock, idempotency và exactly-once business effect.
- Thêm event-driven architecture, transactional outbox, CDC/Debezium, Kafka và consumer inbox.
- Thêm OAuth2/OIDC, Authorization Code + PKCE, token rotation, key rotation và browser architecture.
- Thêm JVM memory, GC, JFR, JMH và OOM playbook.
- Thêm distributed reliability, timeout budget, retry, circuit breaker, bulkhead và load shedding.
- Thêm test engineering nâng cao: migration, contract, concurrency, mutation, PBT, fuzz và performance.
- Thêm blueprint áp dụng trực tiếp cho Phone Store Backend.
- Thêm production troubleshooting playbook.
- Mở rộng AI Agent routing rules và Definition of Done.

## 2026-07-21 — v1.0.0

- Khởi tạo knowledge base Backend + Java 21 + Spring Boot.
- Thiết lập baseline Spring Boot 4.1.x và compatibility track 3.5.x.
- Thêm kiến trúc modular monolith/package-by-feature.
- Thêm REST/RFC 9457, MySQL 8.4 query tuning, JPA/transaction/locking.
- Thêm Spring Security/JWT/OWASP.
- Thêm testing portfolio: JUnit, Mockito, Testcontainers, PIT, jqwik, Jazzer.
- Thêm observability, reliability, Docker/CI/CD.
- Thêm AI Agent constitution, Definition of Done và template kiểm chứng.

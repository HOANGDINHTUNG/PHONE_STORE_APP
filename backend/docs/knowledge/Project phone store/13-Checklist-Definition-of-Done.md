---
title: Checklist và Definition of Done
tags: [checklist, definition-of-done, review]
status: maintained
verified_on: 2026-07-21
---

# Checklist và Definition of Done

## 1. Requirement readiness

- [ ] Actor, goal, precondition và success outcome rõ.
- [ ] Happy path, alternative path, error path rõ.
- [ ] Invariant và state transition có bảng/diagram khi cần.
- [ ] Phạm vi in/out rõ; không có thuật ngữ mơ hồ.
- [ ] Data ownership, privacy và retention rõ.
- [ ] Non-functional requirement: latency, throughput, availability, audit.
- [ ] Acceptance criteria có thể test.

## 2. API review

- [ ] URI/method/status đúng semantics.
- [ ] Request/response DTO không dùng entity trực tiếp.
- [ ] Validation hình thức và nghiệp vụ tách đúng.
- [ ] Error contract nhất quán, không lộ nội bộ.
- [ ] Authentication, role, ownership/tenant được kiểm tra.
- [ ] Pagination max/deterministic; filter/sort allowlist.
- [ ] Idempotency/concurrency được xử lý.
- [ ] OpenAPI, examples và compatibility được cập nhật.
- [ ] Rate limit/audit/metrics cho endpoint nhạy cảm.

## 3. Database review

- [ ] Primary key, NOT NULL, UNIQUE, FK, CHECK đúng invariant.
- [ ] Kiểu tiền/time/string đúng domain.
- [ ] Index xuất phát từ query/workload.
- [ ] Composite index order và write cost được đánh giá.
- [ ] Query không N+1/`SELECT *`/offset vô hạn.
- [ ] `EXPLAIN ANALYZE` cho query critical/changed.
- [ ] Transaction ngắn; concurrency/lock/deadlock strategy rõ.
- [ ] Migration versioned, backward-compatible, test và rollback/forward-fix plan.
- [ ] Backfill có batch/resume/monitor.

## 4. Security review

- [ ] Threat model và trust boundary.
- [ ] Deny by default; object/property authorization.
- [ ] Token/password/secret theo chuẩn, không log.
- [ ] CSRF/CORS đúng credential model.
- [ ] Injection/mass assignment/path traversal bị chặn.
- [ ] File/body/page/rate limit.
- [ ] Sensitive output và audit log được review.
- [ ] Dependency/container/CVE scan.
- [ ] Negative security tests.

## 5. Testing review

- [ ] Unit test invariant/domain.
- [ ] Controller validation/error/security test.
- [ ] Integration DB bằng Testcontainers.
- [ ] Constraint/query/migration test.
- [ ] Success, boundary, failure, rollback.
- [ ] Unauthorized/forbidden/ownership.
- [ ] Concurrent/idempotent behavior nếu cần.
- [ ] PIT/jqwik/Jazzer cho critical risk phù hợp.
- [ ] Test deterministic, không phụ thuộc order/time/network thật.

## 6. Observability review

- [ ] Structured log có traceId và không lộ secret/PII.
- [ ] RED metrics và business metric.
- [ ] Trace downstream/DB hot path.
- [ ] Liveness/readiness đúng semantics.
- [ ] Alert actionable + dashboard + runbook.
- [ ] SLO và rollback signal cho release quan trọng.

## 6A. Event và distributed workflow review

- [ ] Command/event/message được phân biệt và có owner.
- [ ] DB state + event atomic bằng outbox hoặc cơ chế tương đương.
- [ ] Consumer idempotent bằng durable event/operation ID.
- [ ] Ordering/partition key/duplicate/out-of-order behavior rõ.
- [ ] Schema compatibility và replay policy.
- [ ] Retry/DLQ/redrive/reconciliation có owner và telemetry.
- [ ] Uncertain external outcome có state machine, không suy ra “timeout = thất bại”.

## 6B. JVM và capacity review

- [ ] Container memory có headroom ngoài heap.
- [ ] Pool/queue/concurrency bounded theo downstream capacity.
- [ ] JFR/GC/log/metric đủ chẩn đoán CPU, memory và lock.
- [ ] Load/soak/spike test đúng SLO và dataset.
- [ ] OOM/overload/graceful shutdown runbook.

## 7. Deployment review

- [ ] Reproducible immutable artifact.
- [ ] Non-root/minimal image, SBOM và scan.
- [ ] Config/secret inject đúng.
- [ ] Migration tương thích rolling deployment.
- [ ] Resource limit, timeout, graceful shutdown.
- [ ] Staging smoke/load/security checks.
- [ ] Canary/rolling/blue-green plan rõ.
- [ ] Rollback và owner/on-call.

## 7A. Cache, job và file review

- [ ] Cache có source of truth, freshness, key/TTL/version và invalidation sau commit.
- [ ] Cold cache/Redis outage/stampede không vượt DB/downstream capacity.
- [ ] Distributed lock có token/TTL và invariant hoặc fencing phù hợp.
- [ ] Job có stable operation ID, overlap, idempotency, restart/checkpoint và reconciliation.
- [ ] Backfill bounded, resumable, observable và có stop condition.
- [ ] Upload được authorize, giới hạn size/type/signature, scan/quarantine trước khi public.
- [ ] Presigned URL quyền tối thiểu, TTL ngắn; multipart/orphan/delete có lifecycle.

## 7B. Kubernetes và telemetry review

- [ ] Startup/readiness/liveness đúng semantics và đã failure-test.
- [ ] JVM/container requests/limits có headroom và dựa trên profiling.
- [ ] Graceful drain nằm trong termination grace period.
- [ ] Rollout, topology, disruption budget và rollback signal rõ.
- [ ] Config/Secret có validation, encryption, least privilege và rotation.
- [ ] Autoscaling không tạo connection/downstream storm.
- [ ] Trace context xuyên HTTP/async/message; resource version nhận diện được.
- [ ] Metric label/span name bounded, không lộ PII/secret.
- [ ] Alert gắn SLO, owner, dashboard và runbook.

## 7C. Distributed, API và projection review

- [ ] Operation nêu consistency model và behavior khi timeout/partition.
- [ ] Unknown outcome, duplicate, ordering và reconciliation đã thiết kế.
- [ ] Protocol REST/gRPC/GraphQL/webhook/event được chọn theo consumer/interaction.
- [ ] Schema/API/event compatibility được test qua mixed versions.
- [ ] Kafka key/partition/offset/rebalance/retry/DLQ semantics rõ.
- [ ] Search projection có source of truth, aggregate version, freshness và full rebuild/alias rollback.
- [ ] Replica/cache/search stale không tham gia quyết định correctness ngoài policy.
- [ ] Multi-tenant key/FK/repository/authorization chặn cross-tenant.

## 7D. Supply chain và release review

- [ ] Threat model xác định asset, trust boundary, abuse case và residual risk.
- [ ] Dependency khóa/checksum/owner; CVE exception có evidence và expiry.
- [ ] Artifact immutable theo digest, có SBOM/provenance/signature theo policy.
- [ ] CI dùng least-privilege short-lived identity; untrusted PR không có production secret.
- [ ] GitOps desired state, drift và emergency reconciliation rõ.
- [ ] Flag có owner/default/failure mode/expiry/removal issue.
- [ ] Canary so business + technical metrics và đủ sample.
- [ ] Rollback đã kiểm tra schema/event/state compatibility.
- [ ] Capacity test gồm steady/spike/soak/N−1/cold dependency.

## 8. Definition of Done cho một feature

Feature chỉ Done khi:

1. Acceptance criteria được đáp ứng và demo/test được.
2. Code tuân thủ module boundary và project rules.
3. API/schema/event contract cập nhật.
4. Security, transaction và concurrency đã review theo risk.
5. Automated tests phù hợp pass.
6. Migration/deployment backward-compatible hoặc có kế hoạch đã duyệt.
7. Telemetry/runbook đủ vận hành.
8. Không còn secret, debug code, TODO bắt buộc hay thay đổi ngoài phạm vi.
9. Diff được review; tài liệu/ADR được cập nhật.
10. Rủi ro còn lại được ghi rõ và có owner.

## 9. Stop-the-line conditions

Không merge/release nếu:

- mất dữ liệu hoặc destructive migration chưa có approval/backup;
- authorization/object ownership chưa test;
- secret xuất hiện trong repo/log/artifact;
- test critical fail/flaky không được xử lý;
- query critical tạo N+1/scan lớn ngoài SLO;
- breaking API/schema không có migration/consumer plan;
- không có rollback cho thay đổi có blast radius lớn;
- Agent không xác định được version/requirement nhưng vẫn dùng API suy đoán.
- backup/PITR chưa từng restore-test nhưng thay đổi có nguy cơ mất dữ liệu;
- cache/replica stale được dùng cho quyết định correctness/security mà không có consistency policy;
- liveness/probe/autoscaling có thể tạo restart hoặc connection storm chưa được kiểm thử;
- upload chưa scan nhưng có thể được tải/xử lý như nội dung tin cậy.
- distributed command báo thất bại khi outcome còn UNKNOWN nhưng không có reconciliation;
- event/search projection không có version/rebuild nên replay có thể làm state lùi;
- artifact mutable/không truy được source hoặc bypass verification không có approval/audit;
- release breaking schema/event mà old và new version phải chạy đồng thời;
- claim capacity/HA/rollback nhưng chưa có workload/failure drill tương ứng.

## 7E. CQRS, saga và messaging review

- [ ] CQRS được phân biệt với Event Sourcing và integration events.
- [ ] Event store/source of truth, stream version, snapshot và projection ownership rõ.
- [ ] Projection duplicate/out-of-order/rebuild/schema evolution được test.
- [ ] Saga chỉ dùng khi local transaction không hợp lý; state/pivot/compensation/deadline rõ.
- [ ] Timeout external side effect có UNKNOWN/reconcile, không blind retry.
- [ ] Broker được chọn theo work queue/pub-sub/stream, replay, ordering và routing.
- [ ] Oldest message age, retry/DLQ và poison recovery có owner.

## 7F. Migration, DR và privacy review

- [ ] Migration dùng expand–migrate–contract; old/new app compatibility được test.
- [ ] Backfill bounded, resumable, conditional và có reconciliation.
- [ ] DDL lock/disk/replica/abort behavior được preflight đúng engine/version.
- [ ] RTO/RPO theo capability được business duyệt và restore/failover đã drill.
- [ ] Failover có fencing/authority; failback và reconciliation rõ.
- [ ] Data inventory/lineage/classification/retention có owner.
- [ ] Erasure phủ DB/cache/search/object/log/event/processor/backup semantics.
- [ ] Privacy unknown chọn minimization/safe default, không suy đoán luật.

## 7G. Platform, cost và incident review

- [ ] Golden path là self-service contract có version/update/escape hatch.
- [ ] Service catalog có owner, tier, dependency, SLO, runbook và data class.
- [ ] Cost được normalize theo business unit; trước/sau giữ SLO/security/DR.
- [ ] Compute/DB/storage/network/telemetry/retry cost đều được xét.
- [ ] On-call role, severity, escalation, dashboard và mitigation runbook rõ.
- [ ] Postmortem action có owner/date và system control.
- [ ] Chaos experiment có hypothesis, steady-state SLI, blast radius, abort và rollback.
- [ ] Mọi note/ADR mới đạt gate của [[90-Template-Ghi-chu-Ky-thuat]].

---
title: Background Jobs, Scheduling và Spring Batch
tags: [background-jobs, scheduling, spring-batch, idempotency]
status: verified
verified_on: 2026-07-21
sources:
  - https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html
  - https://docs.spring.io/spring-batch/reference/domain.html
  - https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/restart.html
  - https://docs.spring.io/spring-batch/reference/scalability.html
---

# Background Jobs, Scheduling và Spring Batch

## 1. Chọn cơ chế theo semantics

| Nhu cầu | Công cụ |
|---|---|
| Task nhỏ, best-effort trong process | `@Async` với executor quản lý |
| Chạy định kỳ đơn giản | `@Scheduled` |
| Lịch bền vững/cluster/calendar | Quartz hoặc scheduler platform |
| Xử lý dataset lớn, restart/metadata | Spring Batch |
| Event-driven work | Broker consumer |
| Một lần trên Kubernetes | Job/CronJob |

Không dùng `@Async` cho việc bắt buộc không được mất: process crash sau HTTP response có thể làm task biến mất.

## 2. Job contract

Mỗi job phải có:

- stable job type và version;
- unique execution/operation ID;
- parameters và identifying parameters;
- trigger/source;
- concurrency policy;
- idempotency/restart semantics;
- deadline/timeout;
- retry/skip/fail policy;
- owner, alert, runbook;
- input/output/reconciliation.

## 3. Idempotency

At-least-once execution là giả định an toàn. Job phải chống duplicate bằng:

- unique operation/business key;
- compare-and-set state transition;
- processed marker/checkpoint durable;
- outbox/inbox;
- provider idempotency key;
- output upsert có điều kiện.

Không dùng “scheduler chỉ chạy một lần” thay cho invariant.

## 4. Scheduling trong nhiều instance

Mỗi instance có thể kích hoạt cùng `@Scheduled`. Lựa chọn:

- mọi instance chạy partition riêng;
- distributed lease/leader election;
- scheduler bên ngoài tạo một Job;
- DB row claim bằng atomic update/locking;
- Quartz clustered đúng cấu hình.

Lock scheduler cần TTL, owner token và recovery. Critical effect vẫn cần idempotency.

## 5. Fixed rate và fixed delay

- Fixed rate bám cadence; task dài có thể overlap/queue tùy scheduler.
- Fixed delay tính sau khi lần trước hoàn tất.
- Cron cần timezone/DST policy.

Luôn nêu behavior khi lần chạy trước chưa xong: skip, queue, overlap, cancel hay coalesce.

## 6. Queue/claim pattern bằng database

Worker claim batch nhỏ bằng trạng thái và lock/atomic update:

```text
READY -> CLAIMED(owner, lease_until) -> SUCCEEDED
                                \-> RETRY_WAIT / FAILED
```

Lease hết hạn cho phép recovery; completion phải kiểm tra owner/version để stale worker không ghi đè. Index theo `(status, available_at, id)` chỉ là candidate cần EXPLAIN.

## 7. Spring Batch domain

- `Job`: cấu hình logical batch job.
- `JobInstance`: logical run theo identifying parameters.
- `JobExecution`: một attempt chạy instance.
- `Step`: phase độc lập, tuần tự trong job flow.
- `StepExecution`: attempt của step.
- `ExecutionContext`: state restart/checkpoint.
- `JobRepository`: metadata điều phối/restart.

Không xóa metadata tùy tiện khi còn nhu cầu restart/audit.

## 8. Chunk processing

Reader → Processor → Writer theo chunk. Commit interval cân bằng:

- transaction/log/lock duration;
- memory;
- retry/rollback cost;
- throughput;
- remote side effect.

Writer phải hiểu rollback/retry. Gửi network side effect trong chunk transaction có thể lặp nếu DB rollback; dùng outbox hoặc idempotent provider.

## 9. Restartability

Spring Batch có metadata hỗ trợ restart; step đã `COMPLETED` thường được skip khi restart trừ cấu hình khác. Để restart đúng:

- input ổn định/versioned;
- reader lưu checkpoint;
- writer idempotent hoặc transactionally aligned;
- parameter nhận diện rõ;
- execution context nhỏ và serializable tương thích;
- code deployment giữa hai lần restart có compatibility plan.

## 10. Retry, skip và rollback

- Retry cho transient failure allowlist.
- Skip cho record xấu mà business chấp nhận tiếp tục.
- Fail-fast cho systemic/config/schema error.
- Dead-letter/quarantine lưu record, error, job version và replay status.

Đặt skip limit không đủ; cần reconciliation và owner xử lý dữ liệu bị skip.

## 11. Parallelism và partitioning

Spring Batch hỗ trợ nhiều cách scale như multi-threaded step, parallel steps, partitioning và remote patterns. Trước khi bật:

- reader/writer/thread safety;
- deterministic partition key;
- no overlap/no missing;
- DB/downstream capacity;
- ordering;
- restart per partition;
- skew/hot partition;
- aggregate result.

Tăng worker không tạo thêm DB capacity.

## 12. Large backfill

- keyset cursor, không offset lớn;
- batch nhỏ, commit ngắn;
- resume token durable;
- rate limit theo production load;
- start/stop/pause;
- progress/ETA và error sample;
- verify count/sum/checksum/invariant;
- dual-version compatibility;
- cleanup sau retention.

Không update cả bảng một transaction.

## 13. Time và clock

Inject `Clock` cho logic cutoff/expiry. Lưu timestamp UTC, nhưng lịch business dùng timezone explicit. Test DST overlap/gap, leap-day, month-end và clock skew nếu có nhiều node.

## 14. Shutdown

Khi deploy/terminate:

- ngừng nhận work mới;
- hoàn tất hoặc checkpoint work hiện tại trong grace period;
- release/expire lease;
- không ack message trước durable effect;
- expose active/oldest job metrics;
- kill sau deadline có restart semantics.

## 15. Observability

Metric:

- execution count/duration/status;
- records read/processed/written/skipped/retried;
- lag/queue age;
- active workers/lease expiry;
- throughput và ETA;
- error class;
- reconciliation mismatch.

Không gắn jobExecutionId/customerId làm metric label cardinality cao; để trong log/trace.

## 16. Tests

- step riêng với input nhỏ;
- end-to-end JobRepository thật;
- crash giữa chunk và restart;
- duplicate trigger;
- bad record retry/skip/quarantine;
- parallel partition no missing/duplicate;
- shutdown/lease expiry;
- migration/schema compatibility;
- load/soak với production-size shape.

## 17. Checklist production

- Trigger và overlap policy rõ.
- Job durable/idempotent/restartable theo requirement.
- Metadata/checkpoint/lease có retention và recovery.
- Retry/skip không che systemic error.
- Concurrency bounded theo downstream.
- Backfill pause/resume/verify được.
- Metrics, alert, runbook, manual replay có authorization/audit.


---
title: Observability Performance và Reliability
tags: [observability, performance, reliability, actuator, micrometer]
status: verified
verified_on: 2026-07-21
---

# Observability, Performance và Reliability

## 1. Observability khác monitoring

Monitoring theo dõi câu hỏi đã biết; observability giúp điều tra trạng thái nội bộ từ output khi gặp câu hỏi chưa dự đoán. Ba tín hiệu chính là logs, metrics và traces; chúng phải liên kết bằng trace/request/correlation ID và metadata nhất quán.

## 2. Structured logging

Log production nên có cấu trúc, tối thiểu:

- timestamp UTC, level, service, environment, version;
- traceId/spanId, requestId;
- route template, method, status, duration;
- actor/tenant identifier đã cân nhắc privacy;
- event/error code, dependency;
- message ngắn, field có thể query.

Không log:

- password, JWT, cookie, API key, refresh/reset token;
- full request/response mặc định;
- PII/payment/eKYC không mask;
- stack trace cho mọi lỗi validation;
- cùng exception ở nhiều layer tạo log storm.

Log tại nơi có đủ context và ownership xử lý. Dùng error code ổn định; message có thể thay đổi.

## 3. Metrics

**RED cho request/service:** Rate, Errors, Duration.

**USE cho resource:** Utilization, Saturation, Errors.

Metrics quan trọng:

- request latency p50/p95/p99 theo route template, không theo raw URL/id;
- throughput và error rate theo class lỗi;
- JVM heap, GC pause, threads;
- connection pool active/pending/timeout;
- DB query/lock/deadlock/slow query;
- queue lag/depth/retry/DLQ;
- downstream latency/error/timeout;
- business metrics: orders placed, payment success, KYC approval latency.

Tránh high-cardinality label như userId, orderId, traceId trong metrics; chúng làm hệ metrics tốn kém/không ổn định.

## 4. Distributed tracing

Trace cho thấy critical path qua service/dependency. Span name theo operation ổn định, attribute không chứa secret và không cardinality vô hạn. Sampling phải giữ đủ error/slow traces; log và trace correlation cho phép đi từ alert → trace → log.

Spring Boot Actuator và Micrometer cung cấp nền tảng production-ready/observability; OpenTelemetry là lựa chọn chuẩn hóa telemetry/export. Nguồn: [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/), [OpenTelemetry Java](https://opentelemetry.io/docs/languages/java/).

## 5. Health, readiness và liveness

- Liveness trả lời process có bị kẹt cần restart không; không phụ thuộc mọi downstream, tránh restart storm.
- Readiness trả lời instance có thể nhận traffic không; có thể phản ánh dependency thiết yếu/startup state.
- Startup probe cho ứng dụng khởi động lâu.
- Health endpoint chi tiết phải được bảo vệ; không lộ topology/credential.

Không dùng một endpoint `/health` duy nhất để thay mọi semantics.

## 6. SLO và alert

Alert theo triệu chứng ảnh hưởng người dùng và error-budget burn, không chỉ CPU tăng nhẹ. Mỗi alert phải actionable, có owner, severity, dashboard và runbook. Alert không có hành động thường tạo fatigue.

Ví dụ SLI:

```text
good = checkout requests trả 2xx trong <= 800 ms
valid = mọi checkout request không bị loại do client validation
availability = good / valid
```

## 7. Performance investigation loop

1. Đặt SLO và tái hiện workload.
2. Đo profile end-to-end.
3. Xác định bottleneck lớn nhất: CPU, allocation/GC, lock, DB, I/O, pool, network.
4. Hình thành một hypothesis.
5. Thay đổi một yếu tố.
6. Đo lại cả latency, throughput, errors và resource cost.
7. Lưu result/rollback.

Không tối ưu theo “best practice” nếu chưa biết bottleneck.

## 8. Connection pool

Pool lớn không tự tăng throughput; DB có giới hạn CPU/I/O/lock. Pool quá lớn làm contention và tail latency xấu. Dùng Little’s Law như công cụ ước lượng (`concurrency ≈ throughput × latency`), sau đó load test. Theo dõi active, idle, pending, acquisition timeout, DB max connections và headroom cho migration/admin.

Virtual threads không loại bỏ giới hạn connection pool.

## 9. Cache

Chỉ cache khi:

- read lặp lại đủ nhiều;
- dữ liệu có tolerance stale rõ;
- key/cardinality/TTL/size được quản lý;
- invalidation/failure behavior được định nghĩa;
- cache hit/miss/eviction/load latency được đo.

Các rủi ro: cache stampede, penetration, hot key, stale authorization, thundering herd và outage cache kéo sập DB. Có thể dùng request coalescing/single-flight, jitter TTL, negative cache cẩn thận và rate limit.

Không cache lỗi authorization nhầm scope; key phải bao gồm tenant/caller dimension khi response phụ thuộc quyền.

## 10. Resilience patterns

| Pattern | Dùng khi | Nguy cơ |
|---|---|---|
| Timeout | Mọi remote call | Quá dài giữ tài nguyên; quá ngắn false failure |
| Retry | Lỗi tạm thời + idempotent | Retry storm, duplicate side effect |
| Circuit breaker | Dependency fail kéo dài | Configuration sai che recovery |
| Bulkhead | Cô lập pool/concurrency | Limit thấp gây reject sớm |
| Rate limit | Bảo vệ capacity/abuse | Key sai gây unfairness/bypass |
| Fallback | Có output giảm cấp hợp lệ | Trả dữ liệu nguy hiểm/sai nghiệp vụ |

Retry đặt ở một layer sở hữu; nhiều layer cùng retry làm số call nhân lên. Backoff + jitter và deadline chung.

## 11. Graceful shutdown

Khi deploy/terminate:

- ngừng nhận traffic mới;
- hoàn tất request/job trong grace period;
- ngừng consumer có kiểm soát;
- flush telemetry nếu cần;
- đóng pool/client;
- bảo đảm message đang xử lý có ack semantics đúng.

## 12. Incident learning

Postmortem không đổ lỗi, gồm timeline, impact, detection, contributing factors, remediation owner/deadline và bài học. Sửa cả prevention, detection và mitigation; cập nhật runbook/test/vault sau incident.


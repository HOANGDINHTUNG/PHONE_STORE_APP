---
title: Distributed Reliability và Resilience4j
tags: [reliability, resilience4j, timeout, retry, circuit-breaker, bulkhead]
status: verified
verified_on: 2026-07-21
sources:
  - https://resilience4j.readme.io/
---

# Distributed Reliability và Resilience4j

## 1. Failure taxonomy

Trước khi retry/fallback, phân loại:

- validation/business rejection;
- unauthenticated/unauthorized;
- not found/conflict;
- rate limited/overloaded;
- connect timeout/refused/DNS;
- response timeout;
- partial/uncertain outcome;
- dependency 5xx;
- malformed/incompatible response;
- local resource saturation;
- bug/data corruption.

Không retry business error, auth error hoặc malformed contract như transient failure.

## 2. Deadline và timeout budget

Nếu endpoint SLO/deadline là 1.000 ms, downstream timeout không thể mỗi service 2.000 ms. Budget gồm queue, app, DB, network, retry và serialization.

```text
Client deadline 1000 ms
- gateway/network 100 ms
- local processing/DB 250 ms
- safety/response 150 ms
= downstream budget tối đa khoảng 500 ms
```

Con số phải đo theo hệ thống thật. Truyền deadline/cancellation khi stack hỗ trợ.

## 3. Timeout đầy đủ

- connection timeout;
- TLS handshake nếu client tách được;
- response/read timeout;
- connection-pool acquisition timeout;
- overall call deadline;
- query/lock timeout;
- async task timeout.

Chỉ đặt read timeout mà pool wait vô hạn vẫn treo. Timeout phải tạo metric/error classification rõ.

## 4. Retry amplification

Ba tầng, mỗi tầng retry 3 lần có thể tạo tới 27 downstream attempts cho một request. Chọn một layer sở hữu retry gần boundary và có visibility.

Retry policy:

- lỗi allowlist;
- max attempts nhỏ;
- exponential backoff + jitter;
- tổng deadline;
- idempotency;
- metric attempts/exhausted;
- respect `Retry-After` khi phù hợp;
- retry budget để tránh storm.

## 5. Circuit Breaker

State khái quát: CLOSED ghi nhận call, OPEN fail-fast, HALF_OPEN thử có giới hạn. Circuit breaker không chữa dependency; nó giảm waiting/load khi failure đã đủ cao.

Thiết kế threshold cần:

- minimum calls để tránh mở do mẫu quá nhỏ;
- sliding window count/time;
- failure rate và slow-call threshold;
- open duration;
- permitted half-open calls;
- exception classification.

Resilience4j hỗ trợ count-based/time-based sliding window. Nguồn: [Resilience4j CircuitBreaker](https://resilience4j.readme.io/docs/circuitbreaker).

## 6. Bulkhead

Bulkhead cô lập concurrency để một dependency chậm không chiếm hết thread/task/connection. Resilience4j có semaphore bulkhead và fixed-thread-pool bulkhead. Nguồn: [Resilience4j Bulkhead](https://resilience4j.readme.io/docs/bulkhead).

Limit dựa trên capacity/latency/SLO. Queue nhỏ/bounded tạo backpressure sớm; queue lớn che overload và tăng tail latency.

## 7. Rate limiter

Phân biệt:

- inbound protection: bảo vệ API/tenant/account;
- outbound rate shaping: không vượt quota provider;
- concurrency limit: số request đồng thời;
- throughput limit: request/time;
- cost-based quota: operation nặng tính nhiều unit.

Distributed limiter cần consistency/failure mode. Khi store limiter hỏng, endpoint nào fail-open hoặc fail-closed là security/business decision.

## 8. Fallback

Fallback chỉ hợp lệ khi có degraded answer đúng semantics:

- catalog recommendation thiếu personalization;
- stale public product detail trong freshness window;
- queue command và trả 202 khi contract async.

Không fallback:

- balance/payment/authorization bằng dữ liệu cũ;
- trả empty list để che DB outage;
- báo success khi chưa biết side effect;
- catch-all rồi trả default.

## 9. Cache như resilience

Cache có thể giảm load nhưng cũng tạo stale data/stampede. Khi dependency down:

- xác định max-stale per data class;
- cache key bao gồm tenant/permission;
- stale-while-revalidate chỉ cho read an toàn;
- negative cache TTL ngắn;
- jitter TTL và single-flight;
- protect DB khi cache cold/recovery.

## 10. Load shedding và backpressure

Khi quá capacity, reject sớm có kiểm soát tốt hơn nhận tất cả rồi timeout. Signal:

- queue depth/age;
- pool saturation;
- CPU/memory pressure;
- latency/error budget burn;
- downstream breaker.

Chính sách ưu tiên có thể giữ traffic critical và shed report/export/batch.

## 11. Resilience pattern ordering

Thứ tự decorator ảnh hưởng behavior. Ví dụ rate limiter/bulkhead ngoài retry tránh mỗi retry lách quota hoặc chiếm concurrency khác nhau; circuit breaker ghi nhận attempt hay logical call cũng làm metric khác. Không copy thứ tự annotation; vẽ call semantics và test.

```text
logical request
  deadline
    rate/concurrency admission
      circuit observation
        retry attempts
          timeout per attempt
            remote call
```

Đây là mô hình gợi ý, không phải thứ tự duy nhất.

## 12. Recovery storm

Khi dependency phục hồi, backlog + retry đồng loạt có thể làm nó sập lại. Biện pháp:

- jitter;
- gradual half-open/concurrency ramp;
- retry budget;
- backlog rate limit;
- priority;
- cache warm-up có kiểm soát;
- provider quota awareness.

## 13. Configuration as code

Mỗi dependency có profile riêng:

```markdown
Dependency: payment-provider
Owner:
Call type: non-idempotent create with provider idempotency key
SLO/deadline:
Connect/read/pool timeout:
Retryable outcomes:
Max attempts/backoff:
Circuit thresholds:
Bulkhead/concurrency:
Rate quota:
Fallback: none; state UNKNOWN + reconcile
Metrics/alerts/runbook:
```

Property name cụ thể của Resilience4j/Spring Boot phải kiểm tra đúng version trước khi đưa vào YAML.

## 14. Chaos/failure testing

- connection refused/DNS failure;
- slow response vượt timeout;
- intermittent 5xx;
- 429 + Retry-After;
- partial response/malformed payload;
- provider xử lý nhưng response mất;
- connection pool saturation;
- breaker open/half-open/recovery;
- application shutdown khi request/message đang chạy;
- cache down và cold-start DB load.

Assert business outcome, attempt count, latency bound, metrics và không duplicate side effect.

## 15. Production checklist

- Mọi remote call có timeout và owner.
- Retry chỉ cho allowlisted transient + idempotent.
- Tổng attempts/deadline không khuếch đại vô hạn.
- Bulkhead/queue bounded.
- Circuit breaker có minimum sample/metrics.
- Fallback đúng nghiệp vụ.
- Uncertain outcome có state/reconciliation.
- Overload reject sớm và response contract rõ.
- Dashboard cho saturation/retry/breaker/latency.
- Recovery/backlog strategy và runbook.


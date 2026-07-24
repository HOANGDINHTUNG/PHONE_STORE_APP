---
title: Spring MVC, WebFlux và Virtual Threads
tags: [spring-mvc, webflux, reactive, virtual-threads, performance]
status: verified
verified_on: 2026-07-21
applies_to: [Java 21, Spring Framework 7, Spring Boot 4.1]
sources:
  - https://docs.spring.io/spring-framework/reference/web/webflux.html
  - https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html
  - https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html
---

# Spring MVC, WebFlux và Virtual Threads

## 1. Ba lựa chọn không phải ba mức “hiện đại”

- MVC + platform threads: imperative, blocking, hệ sinh thái JDBC/JPA tự nhiên.
- MVC + virtual threads: imperative, scale nhiều blocking I/O hơn nhưng dependency vẫn bounded.
- WebFlux: non-blocking/reactive end-to-end, backpressure và event-loop model.

Chọn theo dependency stack, workload, năng lực đội ngũ và benchmark; không chọn theo xu hướng.

## 2. Decision matrix

| Điều kiện | Ưu tiên xem xét |
|---|---|
| JPA/JDBC, business transaction, CRUD | MVC |
| Nhiều blocking I/O độc lập, Java 21 | MVC + virtual threads |
| Streaming/SSE, rất nhiều connection chờ | WebFlux |
| Downstream client reactive, pipeline end-to-end | WebFlux |
| CPU-bound | Cả ba vẫn cần bounded CPU parallelism |
| Đội ngũ chưa hiểu reactive debugging | MVC trước |

Spring Framework cho phép MVC và WebFlux coexist ở mức hệ sinh thái, ví dụ MVC dùng `WebClient`; không đồng nghĩa nên trộn hai runtime model tùy ý trong cùng request.

## 3. MVC execution model

Thông thường một request được một servlet thread xử lý, blocking khi gọi JDBC/HTTP. Capacity bị ràng buộc bởi server threads, connection pools, downstream và CPU.

Ưu điểm:

- call stack trực quan;
- transaction/thread-local tương thích;
- thư viện blocking phong phú;
- dễ profile/debug hơn cho đa số team.

Rủi ro: thread/queue lớn che downstream chậm và làm tail latency tăng.

## 4. Virtual threads trong MVC

Virtual thread suspend khi blocking I/O phù hợp, giải phóng carrier OS thread. Nhưng:

- connection pool vẫn chỉ có N connection;
- provider vẫn chỉ chịu QPS/concurrency nhất định;
- memory/CPU/queue vẫn hữu hạn;
- virtual thread không làm query/network nhanh hơn;
- cần xem pinning và ThreadLocal footprint.

Spring Boot trên Java 21+ có thể bật virtual threads bằng property được tài liệu đúng version hỗ trợ. Trước khi bật production, kiểm tra release notes và load test.

## 5. WebFlux execution model

WebFlux non-blocking và hỗ trợ Reactive Streams backpressure. Một số event-loop threads phục vụ nhiều connection; handler không được block.

Nếu gọi JDBC/JPA/blocking SDK trên event loop, throughput/latency có thể sụp. Offload sang bounded scheduler chỉ là cầu nối, không biến stack thành end-to-end non-blocking.

## 6. Backpressure không phải capacity tự động

Reactive Streams cho subscriber điều khiển demand, nhưng external API, database hoặc queue vẫn có giới hạn riêng. Operators như `flatMap` cần concurrency/prefetch bounded. Buffer không giới hạn là queue không giới hạn dưới tên khác.

## 7. R2DBC và transaction

R2DBC là reactive relational access, không phải JPA async. Không có cùng persistence context/lazy loading/dirty checking assumptions. Transaction context đi qua reactive context, không dựa trên thread-local như imperative transaction.

Không copy repository/entity design JPA sang R2DBC mà giả định semantics giống nhau.

## 8. Blocking bridge

Khi bắt buộc gọi SDK blocking trong WebFlux:

```java
Mono.fromCallable(() -> blockingClient.fetch(id))
    .subscribeOn(boundedElasticScheduler)
    .timeout(Duration.ofMillis(500));
```

Vẫn cần:

- bounded concurrency;
- timeout của client thật;
- cancellation semantics;
- context propagation;
- metric queue/saturation;
- plan thay adapter non-blocking nếu hot path.

Không dùng `.block()` trong reactive request path.

## 9. Error handling

Reactive error là signal, không phải exception throw theo call stack bình thường. Operator placement thay semantics:

- `onErrorResume` chỉ cho fallback hợp lệ;
- `retryWhen` cần filter/idempotency/deadline;
- `doOnError` là side effect, không xử lý lỗi;
- error sau response commit không thể đổi status dễ dàng;
- cancellation phải được quan sát riêng với failure.

## 10. Context propagation

MDC/ThreadLocal không tự ổn định qua reactive hops. Dùng Reactor Context/Micrometer context propagation theo framework/version. Test trace/security/tenant khi có scheduler switch.

Virtual thread vẫn có ThreadLocal, nhưng hàng triệu thread + object nặng làm memory lớn; không dùng ThreadLocal như cache vô hạn.

## 11. Transaction và remote calls

Ở cả MVC/WebFlux, không giữ DB transaction qua remote call dài nếu có workflow an toàn hơn. Reactive composition không loại bỏ lock duration hay dual-write risk.

## 12. Streaming

SSE/chunked streaming cần:

- heartbeat/idle timeout;
- proxy/load balancer buffering/timeout;
- disconnect/cancellation;
- bounded per-client buffer;
- slow consumer policy;
- auth expiry/revocation;
- max connection/capacity;
- resumability/event ID nếu cần.

Không giữ JPA entity/lazy session suốt stream.

## 13. Performance test đúng cách

So sánh cùng:

- business behavior và payload;
- connection pool/downstream limits;
- warm-up/JIT;
- concurrency ramp;
- p50/p95/p99, throughput, errors;
- CPU, heap, native memory, threads, event-loop delay;
- timeout/cold dependency scenario.

Không kết luận từ hello-world benchmark.

## 14. Migration strategy

- Nếu MVC bottleneck do query chậm, sửa query trước.
- Nếu thread saturation do blocking I/O và Java 21, thử virtual thread với load test.
- Nếu use case streaming/non-blocking rõ, tách vertical slice WebFlux.
- Không rewrite toàn hệ thống trước khi chứng minh lợi ích.
- Giữ contract và observability để A/B/canary.

## 15. Checklist

- Execution model được ghi trong ADR.
- Không block event loop.
- Pool/concurrency/buffer/queue bounded.
- Context/transaction/cancellation semantics được test.
- Dependency/client đúng blocking hoặc non-blocking model.
- Benchmark production-like chứng minh lựa chọn.


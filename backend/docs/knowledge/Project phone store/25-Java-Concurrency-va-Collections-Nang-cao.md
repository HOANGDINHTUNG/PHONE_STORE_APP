---
title: Java Concurrency và Collections nâng cao
tags: [java, concurrency, collections, jmm, virtual-threads]
status: verified
verified_on: 2026-07-21
applies_to: [Java 21]
sources:
  - https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html
  - https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html
---

# Java Concurrency và Collections nâng cao

## 1. Ba vấn đề phải tách riêng

- **Atomicity**: thao tác có bị xen giữa hay không.
- **Visibility**: thread khác có nhìn thấy write hay không.
- **Ordering**: compiler/CPU/JVM được phép sắp xếp lại đến đâu.

`count++` không atomic vì gồm read, add và write. `volatile` giải quyết visibility/order cho chính biến đó, không biến chuỗi read-modify-write thành atomic.

## 2. Happens-before là tiêu chuẩn suy luận

Write chỉ được đảm bảo visible cho read ở thread khác khi có quan hệ happens-before. Các cạnh quan trọng:

- program order trong cùng thread;
- unlock monitor happens-before lock kế tiếp của monitor đó;
- write `volatile` happens-before read kế tiếp của field đó;
- `Thread.start()` happens-before hành động trong thread được start;
- hành động trong thread happens-before thread khác return từ `join()`;
- submit task vào executor happens-before task bắt đầu;
- computation happens-before lấy kết quả thành công qua `Future.get()`.

Không có cạnh happens-before thì việc “test nhiều lần vẫn đúng” không chứng minh chương trình đúng.

## 3. Immutability và safe publication

Mặc định tốt nhất cho dữ liệu chia sẻ:

1. object immutable;
2. constructor hoàn tất invariant;
3. không để `this` escape trong constructor;
4. publish qua final field, synchronized boundary, volatile reference hoặc concurrent collection;
5. không trả mutable collection nội bộ.

```java
public record PriceSnapshot(long productId, BigDecimal amount, Instant capturedAt) {}
```

`final` không làm object sâu bên trong immutable; `final List<T>` vẫn có thể bị sửa nếu list mutable.

## 4. Chọn công cụ đồng bộ

| Nhu cầu | Công cụ ưu tiên | Cảnh báo |
|---|---|---|
| Counter độc lập | `AtomicLong`, `LongAdder` | `LongAdder.sum()` không phải transactional snapshot |
| Bảo vệ invariant nhiều field | `synchronized` hoặc `Lock` | Lock toàn bộ invariant, không khóa từng field rời |
| Map truy cập đồng thời | `ConcurrentHashMap` | Compound action vẫn cần API atomic như `compute` |
| Read rất nhiều, write rất ít | `CopyOnWriteArrayList` | Mỗi write copy array; không dùng cho write-heavy |
| Producer–consumer bounded | `ArrayBlockingQueue` | Capacity là backpressure decision |
| Giới hạn concurrency | `Semaphore` | Release trong `finally`; fairness có throughput cost |
| Chờ N tác vụ hoàn tất một lần | `CountDownLatch` | Không reset được |
| Phối hợp nhiều phase | `Phaser` | Phải quản lý deregistration |

## 5. Compound action trên ConcurrentHashMap

Sai vì check và put không atomic:

```java
if (!map.containsKey(key)) {
    map.put(key, load(key));
}
```

Ưu tiên `computeIfAbsent`, nhưng mapping function phải ngắn, không recursive update cùng map và không chứa network call chậm. Với load từ xa cần single-flight/future riêng, timeout và failure removal; không giữ internal map lock trên I/O dài.

## 6. Iterator concurrent

Iterator của phần lớn concurrent collection là weakly consistent: có thể chạy đồng thời với update, không ném `ConcurrentModificationException`, và có thể thấy một phần update. Nó không cung cấp point-in-time snapshot.

Nếu business logic cần snapshot nhất quán:

- copy dưới lock;
- query một version/snapshot từ DB;
- hoặc dùng immutable versioned state.

## 7. Executor phải có ownership

Mỗi executor cần khai báo:

- loại workload: CPU, blocking I/O, scheduled, message consumer;
- concurrency/capacity;
- queue policy;
- rejection policy;
- shutdown/await termination;
- metrics: active, queued, completed, rejected, latency;
- context propagation.

Không dùng `CompletableFuture.*Async` mặc định nếu không chủ đích dùng common pool. Không tạo executor mỗi request. Executor do application sở hữu phải được shutdown có kiểm soát.

## 8. Pool sizing

CPU-bound: khởi điểm gần số core rồi benchmark. I/O-bound: concurrency phụ thuộc wait/service time nhưng vẫn bị giới hạn bởi DB connections, downstream quota, memory và SLO.

Little's Law hỗ trợ ước lượng ổn định:

$$L = \lambda W$$

Nếu 200 request/s và trung bình mỗi request giữ resource 0,1 s, concurrency trung bình xấp xỉ 20. Tail latency và burst cần headroom, nhưng queue vô hạn không tạo capacity.

## 9. Rejection là một phần contract

- `AbortPolicy`: fail rõ, caller phải map thành overload response.
- `CallerRunsPolicy`: tạo backpressure nhưng có thể kéo latency caller và chạy code trong thread không mong đợi.
- discard policy: dễ mất việc im lặng, chỉ hợp lệ với workload có semantics rõ và telemetry.

Queue bounded + reject sớm thường dễ vận hành hơn queue vô hạn + timeout muộn.

## 10. CompletableFuture

Quy tắc:

- truyền executor rõ cho workload production quan trọng;
- đặt deadline/timeout ở logical operation;
- phân biệt exception gốc và `CompletionException`;
- cancellation không đảm bảo remote side effect bị hủy;
- `allOf` không tự trả danh sách kết quả;
- không gọi `join()` trên event-loop/reactive pipeline;
- không dùng async chỉ để che một blocking call không bounded.

```java
CompletableFuture<Result> future = CompletableFuture
    .supplyAsync(() -> client.fetch(id), ioExecutor)
    .orTimeout(500, TimeUnit.MILLISECONDS);
```

Timeout future không đồng nghĩa provider chưa xử lý; command có side effect cần idempotency/reconciliation.

## 11. Virtual threads

Virtual thread phù hợp cho số lượng lớn task chủ yếu chờ blocking I/O. Nó tăng khả năng scale concurrency, không làm CPU chạy nhanh hơn và không tự giảm latency.

Checklist áp dụng:

- Java 21+;
- blocking stack tương thích;
- DB connection pool/downstream vẫn bounded;
- không pool virtual threads như resource khan hiếm; giới hạn chính resource bằng semaphore/pool;
- rà soát pinning và synchronized/native section dài;
- đo thread dump/JFR/load test;
- không lưu object nặng trong `ThreadLocal` trên số lượng virtual thread rất lớn.

## 12. ThreadLocal và context

Security context, MDC, locale, tenant và transaction context thường thread-bound. Khi nhảy executor hoặc tạo thread mới, context có thể mất hoặc leak.

- ưu tiên framework-supported context propagation;
- clear MDC trong `finally` nếu tự quản;
- không truyền JPA entity/persistence context qua thread;
- transaction không tự lan sang `@Async`;
- test tenant/security context dưới async boundary.

## 13. Deadlock và livelock

Giảm deadlock bằng:

- global lock ordering;
- lock scope ngắn;
- không gọi network/callback tùy ý khi giữ lock;
- `tryLock` + timeout khi cần recovery;
- quan sát thread dump/JFR;
- không retry vô hạn.

Livelock xảy ra khi thread vẫn hoạt động nhưng liên tục nhường/retry không tiến triển. Backoff + jitter + progress bound là cần thiết.

## 14. Parallel Stream

Không mặc định dùng `parallelStream()` trong request path vì nó dùng common pool, khó kiểm soát contention và không phù hợp blocking I/O. Chỉ dùng khi:

- operation stateless/associative;
- dataset đủ lớn;
- CPU-bound;
- benchmark chứng minh lợi ích;
- không ảnh hưởng workload khác trong common pool.

## 15. Test concurrency

Test phải kiểm chứng invariant, không chỉ “không exception”:

- dùng latch/barrier để tạo interleaving;
- chạy nhiều vòng với seed/log tái hiện;
- assert tổng tiền/stock/version/uniqueness;
- timeout test để phát hiện deadlock;
- integration test với DB thật cho transaction race;
- JFR/thread dump khi có hang;
- không dùng `Thread.sleep` làm cơ chế đồng bộ chính.

## 16. Checklist review

- Shared mutable state đã được liệt kê.
- Mỗi state có owner và synchronization strategy.
- Compound actions dùng primitive atomic phù hợp.
- Executor/queue/concurrency bounded và có metrics.
- Async boundary xử lý context, transaction, timeout, cancellation.
- Virtual thread không che downstream bottleneck.
- Test tái hiện race và assert business invariant.


---
title: JVM Memory GC và Profiling cho Spring Boot
tags: [jvm, memory, gc, jfr, performance, java-21]
status: verified
verified_on: 2026-07-21
applies_to: [Java 21]
sources:
  - https://docs.oracle.com/en/java/javase/21/
  - https://dev.java/learn/jvm/jfr/
---

# JVM Memory, GC và Profiling cho Spring Boot

## 1. Không tối ưu JVM từ danh sách flags trên mạng

Đầu tiên xác định triệu chứng:

- throughput thấp;
- p99 latency cao;
- CPU cao;
- heap tăng không hồi;
- frequent/full GC;
- native memory/OOM;
- thread/connection saturation;
- startup/RSS quá lớn.

Sau đó thu thập JFR, GC log, heap/thread/native-memory evidence. Flag chỉ được đổi khi có hypothesis và before/after measurement.

## 2. Các vùng memory cần phân biệt

| Vùng | Chứa | Lỗi thường gặp |
|---|---|---|
| Java heap | Object/array | Leak, allocation rate cao, GC pause |
| Metaspace | Class metadata | Classloader leak, dynamic generation |
| Code cache | JIT compiled code | Code cache pressure |
| Thread stack | Stack mỗi thread | Quá nhiều platform thread, recursion |
| Direct/native buffer | NIO/netty/compression | Native OOM dù heap còn |
| JNI/native libraries | Native allocation | Không thấy đầy đủ trong heap dump |
| Mapped files/page cache | OS-managed | RSS/container pressure |

Container OOMKilled có thể do tổng RSS vượt limit dù `-Xmx` chưa chạm. Giữ headroom ngoài heap.

## 3. Allocation và garbage collection

GC không chỉ là “dọn rác”; allocation rate và object lifetime quyết định work. Tạo nhiều object ngắn hạn có thể rẻ nếu collector xử lý tốt, trong khi giữ graph lớn lâu dài làm old generation/marking tốn.

Đo:

- allocation rate;
- live set sau GC;
- pause duration/frequency;
- concurrent-cycle CPU;
- promotion/old occupancy;
- humongous/large allocation;
- GC cause.

Không giảm object allocation bằng mutable object pooling tùy tiện; có thể tăng complexity, retention và thread-safety risk.

## 4. Chọn collector

Collector là trade-off throughput, pause, footprint và CPU. Java 21 có nhiều collector; lựa chọn phải dựa trên workload/heap/SLO và support của distribution.

- G1: lựa chọn tổng quát phổ biến cho server workload.
- ZGC: ưu tiên very-low pause/large heap, đổi lấy resource/trade-off cần benchmark.
- Parallel GC: throughput-oriented, pause có thể lớn hơn.
- Serial GC: footprint đơn giản cho workload/heap nhỏ đặc thù.

Không đổi collector chỉ vì một benchmark khác môi trường. Ghi collector, heap size, CPU quota và traffic khi so sánh.

## 5. Heap sizing trong container

Ngân sách memory khái quát:

```text
container limit
= Java heap
+ metaspace/code cache
+ thread stacks
+ direct buffers/native libs
+ JVM overhead
+ safety margin
```

Nếu set Xmx gần 100% limit, process có thể bị OOMKilled do native memory. Dùng percentage/explicit sizing theo deployment, load test và theo dõi RSS. CPU throttling cũng làm GC/latency xấu; không nhìn memory riêng lẻ.

## 6. Java Flight Recorder

JFR thu thập event JVM/application với overhead thấp và được tích hợp trong HotSpot. Dùng để xem CPU samples, allocation, GC, locks, thread, socket/file I/O và nhiều event khác. Nguồn: [JDK Flight Recorder](https://dev.java/learn/jvm/jfr/), [`jfr` command](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jfr.html).

Workflow:

1. Ghi thời gian incident/traffic/deploy.
2. Capture recording đủ dài cho triệu chứng.
3. Xem top CPU stacks và allocation sites.
4. Correlate GC pause, lock contention, I/O và request traces.
5. Tạo hypothesis ở code/query/pool.
6. Sửa một yếu tố và load test lại.

JFR là diagnostic evidence, không phải metric storage thay Prometheus/APM.

## 7. Thread dump

Thread dump hữu ích cho:

- deadlock Java monitor;
- thread pool exhausted;
- nhiều thread BLOCKED/WAITING;
- request treo ở cùng downstream/lock;
- runaway CPU thread khi lấy nhiều dump cách nhau.

Một dump đơn lẻ là snapshot; lấy chuỗi dump theo khoảng ngắn để thấy stack nào không tiến triển. Không đăng dump có token/PII lên nơi công khai.

## 8. Heap dump và memory leak

Leak nghĩa object còn reachable ngoài ý muốn. Quy trình:

- xác nhận heap/live set tăng qua nhiều GC;
- capture heap dump ở môi trường an toàn;
- xem dominator tree/retained size, GC roots;
- tìm cache unbounded, static collection, listener, ThreadLocal, classloader, queued task;
- sửa ownership/lifecycle/bound;
- test dài và so live set.

Heap dump có thể chứa credential/PII, phải bảo vệ như dữ liệu nhạy cảm.

## 9. Native Memory Tracking

Nếu RSS tăng nhưng heap bình thường, xem direct buffer, thread stacks, metaspace, code cache, JNI và allocator. Native Memory Tracking có overhead và cần bật từ startup tùy chế độ; dùng đúng tài liệu JDK/distribution.

## 10. CPU profiling

Phân biệt:

- on-CPU: serialization, regex, crypto, mapping, loop;
- off-CPU/wait: DB, network, lock, pool;
- CPU throttled: container quota;
- GC CPU: allocation/live set;
- kernel/native work.

Tối ưu method CPU khi request thực tế chủ yếu đợi DB sẽ không giải quyết p99.

## 11. Virtual threads

Virtual threads tăng khả năng biểu diễn nhiều blocking tasks, không tăng DB connections/CPU/downstream capacity. Theo dõi:

- concurrency và downstream limit;
- pinning/blocking trong synchronized/native sections;
- ThreadLocal footprint/context propagation;
- queue bị thay bằng hàng triệu task không bounded;
- latency/error khi overload.

Nguồn: [Oracle Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html).

## 12. JIT và warm-up

JVM tối ưu code khi chạy; benchmark cold start và steady state là hai câu hỏi khác nhau. Load test phải có warm-up hoặc báo riêng startup performance. Không dùng `System.nanoTime` trong loop tự chế để so micro-operation vì dead-code elimination, constant folding, tiered compilation và GC gây sai.

## 13. Microbenchmark với JMH

JMH do OpenJDK phát triển để xây/chạy/phân tích benchmark JVM. Dùng fork, warmup, measurement, state và Blackhole đúng. Nguồn: [OpenJDK JMH](https://openjdk.org/projects/code-tools/jmh/).

Microbenchmark chỉ trả lời cost hẹp; endpoint performance còn DB/network/pool/serialization/concurrency.

## 14. Spring Boot performance hotspots

- N+1/over-fetching;
- JSON graph lớn;
- validation/regex nguy hiểm;
- unbounded cache/list/queue;
- logging sync/full payload;
- connection pool wait;
- excessive Spring context/test startup;
- reflection/dynamic proxy không phải mặc định là bottleneck—đo trước;
- huge classpath/bean graph ảnh hưởng startup;
- blocking remote call không timeout.

## 15. OOM runbook tối thiểu

1. Phân loại OOM/OOMKilled và thời điểm.
2. Giữ GC log/JFR/metrics/deploy diff.
3. Xem heap vs RSS/native/thread count.
4. Giảm tải/restart/rollback theo severity.
5. Capture dump an toàn nếu không làm outage nặng hơn.
6. Xác định dominator/allocation/retention.
7. Sửa bound/lifecycle/root cause.
8. Load/soak test và đặt alert sớm.

## 16. Performance report template

```markdown
Symptom/SLO violated:
Build/commit/JDK/collector:
Container CPU/memory:
Traffic and dataset:
p50/p95/p99/throughput/errors:
Heap/RSS/GC/allocation:
Threads/pools/DB/downstream:
JFR evidence:
Hypothesis:
Change:
Before/after:
Regression risk and rollback:
```


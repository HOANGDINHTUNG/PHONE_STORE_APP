---
title: Performance, Capacity Engineering và Load Testing
tags: [performance, capacity, load-testing, queuing, scalability]
status: verified
verified_on: 2026-07-23
sources:
  - https://sre.google/sre-book/handling-overload/
  - https://sre.google/sre-book/addressing-cascading-failures/
  - https://grafana.com/docs/k6/latest/testing-guides/test-types/
  - https://jmeter.apache.org/usermanual/best-practices.html
  - https://openjdk.org/projects/code-tools/jmh/
---

# Performance, Capacity Engineering và Load Testing

## 1. Performance là requirement có phân phối

Không viết “API phải nhanh”. Viết:

```text
Operation: search products
Load: 300 RPS steady, burst 600 RPS/30s
Dataset: 5M products, production-like distribution
SLO: p95 <= 250 ms, p99 <= 600 ms
Error: <= 0.1%
Freshness: <= 5 s
Environment: 6 pods, 2 vCPU/2 GiB
```

Average che tail latency. Throughput không có latency/error/resource là vô nghĩa.

## 2. Latency decomposition

```text
Total
= gateway queue
 + app queue
 + application CPU
 + DB pool wait
 + DB query/lock
 + downstream pool/network/service
 + serialization
 + response network
```

Instrument queue wait và pool acquisition; chỉ đo controller timer không cho biết bottleneck.

## 3. Little's Law

Trong hệ ổn định:

$$L = \lambda W$$

- `L`: số work trung bình trong system;
- `λ`: arrival/throughput;
- `W`: thời gian trung bình.

Ví dụ 500 request/s × 0,2 s = 100 concurrent requests trung bình.

Nếu pool 30 nhưng workload cần 100 concurrent DB calls, phần còn lại queue/timeout. Công thức là ước lượng, không thay load test/tail distribution.

## 4. Utilization knee

Khi utilization gần 100%, queueing delay tăng phi tuyến. Mục tiêu không phải “dùng hết CPU/connection mọi lúc” mà giữ headroom cho:

- burst;
- GC;
- failover mất instance;
- slow dependency;
- deployment;
- recovery/retry.

Capacity plan phải test N−1 instance và downstream degradation.

## 5. Throughput vs concurrency

- Arrival rate: request đến mỗi giây.
- Concurrency: request đang in-flight.
- Service time: thời gian resource thực xử lý.
- Response time: queue + service.

Tăng concurrency có thể tăng throughput đến saturation; sau đó chỉ tăng queue/latency/error.

## 6. Open model và closed model

| Model | Hành vi |
|---|---|
| Closed | user đợi response rồi gửi tiếp; system chậm → arrival tự giảm |
| Open | request đến theo rate độc lập; system chậm → backlog tăng |

Closed test có thể che overload vì throughput giảm khi response chậm. Production traffic API thường cần arrival-rate/open-model scenario.

## 7. Coordinated omission

Nếu load generator chờ request chậm rồi mới gửi request kế, nó bỏ qua khoảng thời gian lẽ ra nhiều request khác đến và queue. Kết quả percentile đẹp giả.

Test tool/scenario phải duy trì lịch phát độc lập hoặc ghi nhận expected schedule.

## 8. Các loại test

| Test | Mục tiêu |
|---|---|
| Smoke | script/env hoạt động |
| Average/steady load | SLO ở tải thường |
| Stress | tìm saturation/breakpoint |
| Spike | phản ứng burst |
| Soak/endurance | leak, degradation dài |
| Capacity | max safe load + headroom |
| Scalability | thêm resource tăng capacity thế nào |
| Failover | SLO khi mất node/dependency |

Benchmark micro bằng JMH không thay end-to-end load test.

## 9. Workload model

Phải phản ánh:

- operation mix;
- read/write ratio;
- hot/cold keys;
- tenant skew;
- payload size;
- authentication;
- cache hit/miss/cold;
- think time/arrival;
- downstream behavior;
- data growth;
- time-of-day/burst.

Test toàn request “GET product by random ID” sẽ bỏ qua hot key, search, checkout và write contention.

## 10. Ví dụ k6 tối giản

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    browse: {
      executor: 'constant-arrival-rate',
      rate: 300,
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 100,
      maxVUs: 500,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.001'],
    http_req_duration: ['p(95)<250', 'p(99)<600'],
  },
};

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/v1/products?size=20`);
  check(res, {'status 200': r => r.status === 200});
}
```

Script thực phải lấy token/test data an toàn, kiểm tra business response và không dùng production nếu chưa được phép.

## 11. Generator cũng có bottleneck

Theo dõi load generator:

- CPU/network/file descriptors;
- connection reuse;
- DNS/TLS;
- metric cardinality/output overhead;
- distributed clock;
- data feeder contention.

Chạy GUI JMeter cho load lớn là anti-pattern; tài liệu JMeter khuyến nghị non-GUI cho load test.

## 12. Baseline trước tối ưu

```markdown
Hypothesis:
Scenario:
Commit/config:
Dataset:
Environment:
Warm-up:
Result p50/p95/p99/RPS/error:
CPU/memory/GC/pools/DB:
Profile/trace/plan:
Change:
After:
Trade-off/regression:
```

Không so benchmark khác máy/dataset/config mà kết luận.

## 13. Bottleneck method

1. xác nhận SLO regression;
2. tìm saturated resource/queue;
3. trace latency decomposition;
4. profile/EXPLAIN;
5. tạo hypothesis;
6. thay một biến;
7. rerun cùng scenario;
8. kiểm tra bottleneck chuyển đi đâu.

Tối ưu code nhỏ khi DB pool wait 80% thời gian không có giá trị.

## 14. CPU profiling

Phân biệt:

- on-CPU hot method;
- lock contention;
- allocation/GC;
- I/O wait;
- thread parking;
- event-loop blocked.

JFR/async profiler phù hợp production-like; không suy ra từ thread dump một thời điểm duy nhất.

Liên quan [[20-JVM-Memory-GC-va-Profiling]], [[25-Java-Concurrency-va-Collections-Nang-cao]].

## 15. Database capacity

Theo dõi:

- query latency/rows examined/result rows;
- buffer pool hit/I/O;
- lock wait/deadlock;
- connection active/pending;
- temp/sort;
- replication lag;
- redo/binlog;
- query plan theo parameter/data skew.

Connection pool lớn hơn có thể làm DB contention nặng hơn.

## 16. Cache performance

Đo:

- hit rate theo cache/use case;
- miss cost;
- load amplification;
- eviction;
- value size/network;
- stampede;
- cold-start recovery;
- stale/correctness.

Hit rate 99% vẫn nguy hiểm nếu 1% miss đồng loạt đánh sập DB.

Liên quan [[27-Redis-Cache-Data-Structures-va-Distributed-Lock]].

## 17. Fan-out tail latency

Một request gọi 20 dependency song song có xác suất gặp ít nhất một tail cao hơn. Phải có:

- dependency budget;
- optional vs required;
- concurrency cap;
- cancellation;
- hedging chỉ khi idempotent và có budget;
- partial/degraded result;
- trace child spans.

## 18. Retry amplification

```text
gateway 3 attempts × service 3 × SDK 3 = tối đa 27 attempts
```

Load test dependency failure để thấy amplification. Retry budget, one owning layer, backoff+jitter và load shedding quan trọng hơn tăng timeout.

## 19. Overload protection

Google SRE nhấn mạnh backend nên tiếp tục nhận phần tải nó xử lý được và reject phần dư có kiểm soát.

Patterns:

- bounded queue;
- concurrency limiter;
- rate/quota per tenant;
- priority/criticality;
- early reject;
- degraded response;
- retry budget;
- load shedding;
- admission control theo cost.

QPS là proxy kém nếu request có cost rất khác nhau.

## 20. Capacity math

Ví dụ:

```text
Peak forecast: 1200 RPS
Measured safe capacity/pod: 180 RPS at SLO
N+1 headroom target: 70% utilization
pods = ceil(1200 / (180 × 0.70)) = 10
```

Sau đó test:

- 10 pods steady;
- 9 pods failure;
- cold cache;
- DB failover;
- deploy surge;
- burst.

## 21. Autoscaling

HPA không phản ứng tức thời; scale-up cần startup/readiness/cache/JIT/connection. Metric:

- CPU cho CPU-bound;
- queue age/lag cho workers;
- concurrency/admission;
- custom work units.

Scale app không thể vượt DB/provider capacity. Xem [[33-Kubernetes-Production-cho-Spring-Boot]].

## 22. Performance test data

- representative cardinality/skew;
- không dùng PII production thô;
- deterministic seed;
- cleanup/idempotency;
- enough rows để optimizer chọn plan thật;
- price/stock/orders distribution;
- history/soft-deleted rows;
- indexes/statistics như production.

## 23. Result interpretation

Luôn báo:

- achieved throughput;
- latency distribution;
- errors/timeouts/rejections;
- resource saturation;
- queue/pool;
- test duration;
- environment;
- confidence/repeat variance;
- first bottleneck;
- safe operating point, không chỉ max.

## 24. Regression gate

Không fail pipeline vì một run noisy tuyệt đối. Có thể:

- benchmark dedicated env;
- multiple repetitions;
- compare confidence/range;
- threshold theo SLO;
- trend;
- targeted microbenchmark cho critical algorithm;
- investigate meaningful delta.

## 25. Liên kết tư duy

| Quan hệ | Ghi chú |
|---|---|
| Runtime | [[20-JVM-Memory-GC-va-Profiling]], [[25-Java-Concurrency-va-Collections-Nang-cao]], [[30-Spring-MVC-WebFlux-va-Virtual-Threads]] |
| Data | [[16-MySQL-Optimizer-va-Index-Nang-cao]], [[27-Redis-Cache-Data-Structures-va-Distributed-Lock]], [[38-Search-Architecture-Elasticsearch-va-Projection]] |
| Reliability | [[21-Distributed-Reliability-va-Resilience4j]], [[35-Nen-tang-He-phan-tan-CAP-Clock-Consensus]] |
| Platform | [[33-Kubernetes-Production-cho-Spring-Boot]], [[41-Networking-DNS-TLS-HTTP2-va-Load-Balancing]] |
| Evidence | [[22-Test-Engineering-Nang-cao]], [[34-OpenTelemetry-Micrometer-va-Observability-Implementation]] |
| Case study | [[45-Case-Study-Phone-Store-at-Scale]] |


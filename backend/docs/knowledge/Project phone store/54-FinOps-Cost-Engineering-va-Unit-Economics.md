---
title: FinOps, Cost Engineering và Unit Economics
tags: [finops, cost, capacity, optimization, unit-economics]
status: verified
verified_on: 2026-07-23
requires: [40-Performance-Capacity-va-Load-Testing, 33-Kubernetes-Production-cho-Spring-Boot]
constrains: [50-Multi-Region-Architecture-DR-va-Data-Residency, 53-Platform-Engineering-IDP-va-Golden-Paths]
verified_by: [34-OpenTelemetry-Micrometer-va-Observability-Implementation]
---

# FinOps, Cost Engineering và Unit Economics

> [!summary]
> Cost là một non-functional requirement có telemetry và owner. Tối ưu đúng là giảm cost cho mỗi business outcome trong khi giữ SLO, security và resilience—not chỉ giảm hóa đơn tháng này.

## 1. Ba lớp cost

| Lớp | Ví dụ |
|---|---|
| Direct cloud | compute, DB, storage, network, API |
| Operational | on-call, upgrade, incident, licenses |
| Opportunity/risk | delivery delay, lock-in, downtime |

Một database rẻ hơn 20% nhưng cần thêm hai chuyên gia/on-call có thể đắt hơn tổng thể.

## 2. Unit economics

Chọn denominator có nghĩa:

```text
cost / successful checkout
cost / 1,000 product searches
cost / active tenant
cost / GB ingested and retained
cost / order fulfilled
```

Tách successful/failed/retry để thấy waste.

## 3. Cost allocation

Tag/label tối thiểu:

- owner/team;
- service/product;
- environment;
- cost center;
- data tier;
- workload/tenant khi hợp lý.

Shared cost có policy phân bổ rõ: usage, headcount, revenue hoặc fixed share. Không giả vờ chính xác tuyệt đối.

## 4. Cost model request

```text
request
→ gateway/load balancer
→ app CPU/memory
→ DB reads/writes/storage/backup
→ cache
→ broker/events
→ logs/metrics/traces
→ network egress
```

Một feature thêm 10 metric labels hoặc log body lớn có thể tăng telemetry cost mạnh hơn compute.

## 5. Capacity và cost

Little’s Law:

$$L = \lambda W$$

Nhưng rightsizing không chỉ average utilization. Cần:

- peak/seasonality;
- p95/p99;
- queue/pool saturation;
- headroom;
- N−1/failover;
- autoscaling lag;
- JVM heap/native;
- startup/warm-up.

## 6. Kubernetes

Requests quá cao → waste/scheduling khó. Quá thấp → throttling/OOM/noisy neighbor.

Đo:

- CPU usage + throttling;
- working set/RSS + OOM;
- request/limit ratio;
- pending pods;
- node bin packing;
- HPA desired/current;
- per-pod throughput/latency.

JVM container memory gồm heap, metaspace, code cache, direct buffer và thread stack.

## 7. Database cost levers

| Lever | Benefit | Risk |
|---|---|---|
| index đúng | giảm CPU/IO | write/storage amplification |
| archive/retention | giảm hot data | query/compliance |
| connection pool bound | tránh overload | queue latency |
| cache | giảm reads | staleness/invalidation |
| replica | read scale/HA | lag/cost |
| compression | storage/network | CPU |
| partition/shard | scale | operations/complexity |

Tối ưu SQL thường rẻ và an toàn hơn thêm node.

## 8. Storage lifecycle

Tính:

```text
daily ingress × retention × replication
+ index amplification
+ backup/versioning
+ rebuild headroom
```

Lifecycle object/log/event:

- hot → warm/cold;
- aggregate/downsample;
- delete theo policy;
- legal hold exception;
- restore time/cost.

## 9. Network egress

Ẩn trong:

- cross-zone/region calls;
- chatty microservices;
- large API payload;
- CDN miss;
- DB replication;
- telemetry export;
- backup copy.

Theo dõi bytes theo route/service/region, nhưng tránh high-cardinality labels.

## 10. Messaging cost

Retry storm tạo:

```text
original traffic
× attempts
× fan-out consumers
× retained bytes
× replication
```

Cost control cũng là reliability control: bounded retry, compression có benchmark, batch, payload minimization, retention và DLQ cleanup.

## 11. Observability budget

| Signal | Cost control |
|---|---|
| Logs | levels, structured minimal fields, retention |
| Metrics | cardinality allowlist, recording rules |
| Traces | head/tail sampling, error/slow bias |
| Profiles | scheduled/on-demand |

Không cắt telemetry mù trong incident-prone service. Đánh giá signal usefulness và SLO.

## 12. Commitment/discount

Reserved/committed capacity phù hợp phần baseline dự đoán được, không toàn peak. Điều kiện:

- utilization history;
- growth/architecture roadmap;
- failover capacity;
- term/lock-in;
- owner theo dõi coverage/waste.

## 13. Cost anomaly response

Runbook:

1. xác nhận billing delay/scope;
2. group theo service/resource/region/usage type;
3. correlate deploy/traffic/config;
4. check retry/log/cardinality/egress;
5. stop leak an toàn;
6. giữ evidence;
7. fix guardrail/budget.

Budget alert không được tự tắt production resource.

## 14. Decision matrix

| Proposal | Cost | SLO | Risk | Quyết định |
|---|---:|---|---|---|
| cache product 5m | -DB reads | freshness +5m | invalidation | thử/canary |
| sample traces 10% | -telemetry | debug giảm | miss rare error | tail/error policy |
| active-active | +++ | potential RTO↓ | conflict/ops | chỉ Tier 0 |
| new NoSQL | unknown | workload-specific | skills/DR | benchmark TCO |

## 15. Verification

- cost baseline trước/sau;
- normalize theo business volume;
- canary không regression SLO;
- peak/N−1 load;
- monthly forecast error;
- idle/orphan scan;
- restore/failover cost;
- cost allocation coverage;
- cost anomaly game day.

## 16. Anti-patterns

- tối ưu theo CPU average;
- giảm replica làm hỏng failover;
- tắt backup/log/security scan để tiết kiệm;
- chỉ nhìn monthly total, không unit;
- autoscale không max/budget;
- tags không owner;
- mua commitment theo peak;
- thêm cache/store không tính operational cost.

## 17. Kết nối graph

- Capacity: [[40-Performance-Capacity-va-Load-Testing]]
- SQL/JVM/cache: [[16-MySQL-Optimizer-va-Index-Nang-cao]], [[20-JVM-Memory-GC-va-Profiling]], [[27-Redis-Cache-Data-Structures-va-Distributed-Lock]]
- Kubernetes/telemetry: [[33-Kubernetes-Production-cho-Spring-Boot]], [[34-OpenTelemetry-Micrometer-va-Observability-Implementation]]
- DR trade-off: [[50-Multi-Region-Architecture-DR-va-Data-Residency]]
- Platform chargeback/showback: [[53-Platform-Engineering-IDP-va-Golden-Paths]]

## Nguồn chính thức

1. [FinOps Foundation — FinOps Framework](https://www.finops.org/framework/) — truy cập 2026-07-23.
2. [Kubernetes — Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) — truy cập 2026-07-23.
3. [OpenTelemetry — Sampling](https://opentelemetry.io/docs/concepts/sampling/) — truy cập 2026-07-23.
4. [AWS Well-Architected — Cost Optimization Pillar](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html) — truy cập 2026-07-23.


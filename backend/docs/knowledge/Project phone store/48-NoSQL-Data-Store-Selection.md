---
title: NoSQL và lựa chọn Data Store theo Access Pattern
tags: [nosql, data-modeling, mongodb, cassandra, graph, time-series]
status: verified
verified_on: 2026-07-23
requires: [06-Database-va-toi-uu-SQL-MySQL, 35-Nen-tang-He-phan-tan-CAP-Clock-Consensus]
constrains: [28-MySQL-Replication-Backup-va-Scaling, 52-Privacy-Data-Governance-Retention-va-Erasure]
verified_by: [22-Test-Engineering-Nang-cao, 40-Performance-Capacity-va-Load-Testing]
---

# NoSQL và lựa chọn Data Store theo Access Pattern

> [!summary]
> “NoSQL scale tốt” không phải decision. Chọn store từ access pattern, consistency, partition key, growth, retention, query evolution và khả năng vận hành. MySQL thường vẫn là lựa chọn an toàn nhất cho transactional source of truth.

## 1. Decision sequence

1. Invariant nào cần atomic?
2. Query top-N theo tần suất và SLO là gì?
3. Entity/aggregate boundary nào được đọc/ghi cùng nhau?
4. Partition key có cardinality và distribution ra sao?
5. Có range/relationship/full-text/time-window query?
6. Dữ liệu tăng bao nhiêu/ngày, giữ bao lâu?
7. Consistency/failure/backup/restore yêu cầu gì?
8. Team có vận hành store đó không?

## 2. So sánh family

| Store family | Điểm mạnh | Đổi lại | Phone Store |
|---|---|---|---|
| Relational | constraint, join, transaction | scale write/shard phức tạp | orders, payments |
| Key-value | lookup cực đơn giản | query nghèo | cache/session/idempotency |
| Document | aggregate JSON linh hoạt | cross-document invariant/index cost | product content |
| Wide-column | write scale, partition/range | query-first modeling, denormalization | click/event feed |
| Graph | multi-hop relationship | vận hành/model riêng | recommendation/fraud relation |
| Time series | time-window, retention/downsample | không phải OLTP chung | metrics/telemetry |
| Search engine | text/relevance/aggregation | eventual projection | catalog search |

Một hệ thống có thể polyglot, nhưng mỗi store mới thêm backup, security, upgrade, observability, capacity và on-call surface.

## 3. Document modeling

Embed khi dữ liệu:

- có cùng lifecycle;
- được đọc cùng nhau;
- bounded size;
- update contention chấp nhận được.

Reference khi:

- child unbounded;
- many-to-many;
- lifecycle/authorization khác;
- update độc lập tần suất cao.

Ví dụ product:

```json
{
  "_id": "prd_1",
  "name": "Phone X",
  "brandId": "brand_7",
  "variants": [
    {"id":"v1","color":"black","storageGb":256}
  ],
  "specification": {"screen":"6.7","weightGrams":190},
  "schemaVersion": 3
}
```

Không embed hàng triệu reviews vào product. Product content có thể document; stock/payment vẫn transactional source riêng.

## 4. Wide-column: query-first

Thiết kế từ query:

```text
Query: latest events for customer within month
Partition key: (customer_id, yyyy_mm)
Clustering: occurred_at DESC, event_id
```

Sai lầm:

- partition theo `country=VN` → hot;
- một customer lifetime → partition unbounded;
- query tùy ý rồi mong secondary index cứu;
- batch xuyên partition như transaction.

Bucket size phải dựa trên bytes/rows và traffic thực tế.

## 5. Key-value

```text
key: idem:{tenant}:{operation}:{key}
value: request_hash, state, response, expires_at
```

Key design phải tránh:

- chứa PII raw;
- không namespace tenant/environment;
- TTL ngẫu nhiên không theo business;
- key quá dài/cardinality không đo;
- cache làm sole source of truth không persistence plan.

Liên quan [[27-Redis-Cache-Data-Structures-va-Distributed-Lock]].

## 6. Graph

Phù hợp khi câu hỏi là traversal nhiều hop:

```text
customer -> device -> payment_method -> other_customers -> suspicious_orders
```

Nếu chỉ `order.customer_id = ?`, relational index đủ. Graph không tự tạo recommendation tốt; vẫn cần edge semantics, freshness, scoring và privacy.

## 7. Time-series

Đặc tính:

- append theo time;
- query window/aggregation;
- retention/downsampling;
- high-cardinality risk;
- late/out-of-order samples.

Prometheus local TSDB không phải kho long-term mặc định cho business events; dùng đúng phạm vi metrics. Không lưu email/orderId làm labels.

## 8. Search là projection

Elasticsearch/OpenSearch không mặc định là authoritative order database:

- refresh/replication tạo lag;
- mapping/index evolution;
- rebuild cần source;
- relevance khác exact transactional query.

Xem [[38-Search-Architecture-Elasticsearch-va-Projection]].

## 9. Consistency theo operation

| Operation | Mức cần | Lựa chọn |
|---|---|---|
| decrement stock | strong/conditional atomic | relational/LWT có đo |
| browse product | stale vài giây | cache/document/search |
| audit payment | durable/ordered per entity | relational/event store |
| recommendation | eventual | graph/feature store |
| telemetry | eventual/window | time series |

Đừng gán “AP database” cho toàn bộ sản phẩm; phân tích từng operation khi partition.

## 10. Secondary index và materialized view

Mỗi index/view là write amplification:

```text
logical write
→ commit log/WAL
→ primary data
→ N indexes
→ replication
→ backups/CDC
```

Đo:

- write latency/throughput;
- storage amplification;
- compaction/GC;
- replica lag;
- rebuild duration;
- query p95/p99.

## 11. Migration/dual-write

Không dual-write app tới hai stores mà thiếu reconciliation.

An toàn hơn:

1. source store giữ authoritative;
2. outbox/CDC phát change;
3. backfill có checkpoint;
4. catch up delta;
5. shadow compare;
6. canary read;
7. switch;
8. giữ rollback window;
9. decommission theo retention.

## 12. Failure matrix

| Failure | Câu hỏi |
|---|---|
| node/zone loss | consistency/availability thay đổi thế nào? |
| network partition | coordinator/quorum trả gì? |
| hot partition | split/bucket/rekey thế nào? |
| compaction storm | latency và disk headroom? |
| schema/index build | online hay blocking? |
| backup restore | PITR và restore time đã drill? |
| duplicate/late write | idempotency/version? |
| regional outage | data locality/failover? |

## 13. Evaluation spike

Dataset và workload representative:

```text
70% product by id
20% filter category/brand
8% keyword search
2% admin updates
peak 2,000 read RPS
catalog 2M products, 20M variants
```

Chứng minh:

- data model/index;
- consistency under failure;
- load curve đến saturation;
- hot-key test;
- backup + full restore;
- rolling upgrade;
- deletion/retention;
- cost per million operations;
- skill/runbook ownership.

## 14. Anti-patterns

- database-per-feature không tính operational tax;
- chọn từ benchmark vendor;
- schema-less nghĩa là không schema;
- UUID/time partition key không kiểm tra distribution;
- query scan toàn cluster;
- multi-store dual-write không outbox;
- dùng cache/search làm nguồn sự thật;
- không test restore vì “managed service”.

## 15. Kết nối graph

- SQL baseline: [[06-Database-va-toi-uu-SQL-MySQL]]
- CAP/consistency: [[35-Nen-tang-He-phan-tan-CAP-Clock-Consensus]]
- Temporal/audit/tenant: [[37-Data-Modeling-Multi-Tenancy-Temporal-va-Audit]]
- Migration: [[51-Zero-Downtime-Schema-va-Data-Migration]]
- DR: [[50-Multi-Region-Architecture-DR-va-Data-Residency]]
- Cost: [[54-FinOps-Cost-Engineering-va-Unit-Economics]]

## Nguồn chính thức

1. [MongoDB Manual — Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) — truy cập 2026-07-23.
2. [Apache Cassandra Documentation — Architecture Overview](https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html) — truy cập 2026-07-23.
3. [Neo4j Documentation — Graph database concepts](https://neo4j.com/docs/getting-started/graph-database/) — truy cập 2026-07-23.
4. [Prometheus — Storage](https://prometheus.io/docs/prometheus/latest/storage/) — truy cập 2026-07-23.


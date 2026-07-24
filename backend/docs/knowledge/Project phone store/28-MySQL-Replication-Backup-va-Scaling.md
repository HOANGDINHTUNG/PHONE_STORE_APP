---
title: MySQL Replication, Backup và Scaling
tags: [mysql, replication, backup, pitr, scaling, sharding]
status: verified
verified_on: 2026-07-21
applies_to: [MySQL 8.4]
sources:
  - https://dev.mysql.com/doc/refman/8.4/en/replication.html
  - https://dev.mysql.com/doc/refman/8.4/en/backup-and-recovery.html
  - https://dev.mysql.com/doc/refman/8.4/en/point-in-time-recovery.html
---

# MySQL Replication, Backup và Scaling

## 1. Scale theo bottleneck, không theo cảm giác

Thứ tự thường nên kiểm chứng:

1. query/schema/index;
2. N+1/chattiness/connection usage;
3. cache/read model;
4. vertical capacity;
5. read replicas;
6. partition/archive;
7. sharding.

Mỗi bước cần baseline QPS, p95/p99, CPU, I/O, buffer pool, lock waits, connection saturation và growth forecast.

## 2. Replication không phải backup

Replication phục vụ availability/read scaling/topology. `DROP`, bad update hoặc corruption logic có thể lan sang replica. Backup là bản phục hồi độc lập có retention và restore test.

## 3. Binary log và replication

MySQL replication truyền thay đổi qua binary log. Cần hiểu:

- source/replica identifiers;
- GTID nếu dùng;
- binary log format/config;
- relay log/apply threads;
- replication filters;
- TLS/auth;
- lag và error state;
- failover orchestration.

Không bật filter sản xuất mà không test DDL/cross-schema/restore vì có thể tạo dataset không nhất quán.

## 4. Read replica semantics

Replica thường có lag. Vì vậy:

- create rồi đọc ngay từ replica có thể `not found`;
- update rồi đọc replica có thể thấy version cũ;
- authorization/revocation/balance/stock không nên đọc stale tùy tiện;
- pagination qua replica thay đổi có thể thiếu/lặp.

Chiến lược:

- read-your-writes từ primary trong session/window;
- consistency token/GTID wait khi thật sự cần;
- route strong reads về primary;
- cho stale read với freshness SLO rõ;
- circuit/fallback khi lag vượt ngưỡng.

## 5. Routing read/write

Không phân loại chỉ theo tên method. Query `SELECT ... FOR UPDATE`, transaction read-modify-write và read bảo vệ decision phải ở primary. Transaction phải gắn một connection/role nhất quán.

Theo dõi traffic chuyển về primary khi replica lỗi; failover routing có thể làm primary quá tải.

## 6. Failover

Failover plan phải trả lời:

- ai phát hiện và quyết định;
- replica nào đủ mới để promote;
- split-brain/fencing source cũ;
- DNS/proxy/client reconnect;
- in-flight transaction outcome;
- write loss/RPO;
- rejoin old primary;
- application behavior trong transition.

Không coi failover thành công chỉ vì DB mới nhận connection; phải kiểm tra data, write, replication topology và application SLO.

## 7. Backup types

- Logical: dump SQL/logical records, portable nhưng restore lớn có thể chậm.
- Physical: copy page/file qua công cụ phù hợp, nhanh hơn cho dataset lớn nhưng phụ thuộc engine/version/tool.
- Full + incremental/differential tùy tool.
- Snapshot storage cần database-consistent procedure; snapshot volume đơn thuần không tự đảm bảo consistency.

Chọn theo dataset, RPO/RTO, encryption, bandwidth và restore environment.

## 8. Point-in-time recovery

PITR thường gồm:

1. restore full backup hợp lệ;
2. apply binary logs từ thời điểm backup đến trước/sau mốc mục tiêu chính xác;
3. xác minh dữ liệu;
4. cutover có kiểm soát.

Phải giữ binlog liên tục đủ retention, timestamp/timezone rõ và catalog vị trí backup/log. Không đợi incident mới thử câu lệnh recovery.

## 9. Backup policy

Mỗi database có:

```text
Owner:
Data classification:
RPO / RTO:
Full/incremental schedule:
Binlog retention:
Encryption/key ownership:
Offsite/cross-account copy:
Retention/legal hold:
Restore test frequency:
Last verified restore:
```

Backup “job xanh” không chứng minh restore được. Restore drill phải đo thời gian và validate application-level invariants.

## 10. Online schema change và replica lag

DDL/backfill có thể tạo lock, redo/binlog lớn và lag. Expand-contract:

1. add schema backward-compatible;
2. deploy code đọc/ghi tương thích;
3. backfill bounded/resumable;
4. switch reads;
5. ngừng write cũ;
6. contract sau retention/approval.

Theo dõi primary latency, replica lag, disk, log growth và rollback/stop condition.

## 11. Partitioning

Partitioning không thay index tốt. Dùng khi partition pruning, retention/drop partition, operational manageability có ích. Unique key và query phải phù hợp partitioning rules của đúng MySQL version.

Không partition theo date nếu query chủ yếu theo customer ID và luôn quét nhiều partition mà không đo.

## 12. Archival và data lifecycle

Data nóng/lạnh cần retention:

- business/audit/legal requirements;
- anonymization/delete workflow;
- archive format/query access;
- referential integrity;
- restore/replay;
- batch size/rate limit;
- metrics và reconciliation.

Delete hàng triệu row một transaction gây lock/log/replication pressure; dùng batch có deterministic cursor và pause/resume.

## 13. Sharding

Chỉ sharding khi một primary đã được tối ưu nhưng không đáp ứng capacity/ownership. Cần quyết định:

- shard key và cardinality/skew;
- routing authority;
- resharding;
- cross-shard query/transaction;
- global uniqueness;
- secondary indexes/search;
- backup/restore từng shard;
- hotspot tenant;
- operational tooling.

Shard key phải xuất hiện trong access pattern quan trọng. Hash phân bố tốt nhưng range query khó; range dễ hotspot và rebalance.

## 14. Global ID

Phương án: UUID/ULID-like, allocated ranges, service-generated ID. Đánh giá uniqueness, sort/locality, index size, information leakage và clock dependency. Không đổi primary key format toàn hệ thống chỉ vì xu hướng.

## 15. Cross-shard workflow

Không giả định ACID xuyên shard. Dùng:

- ownership tránh cross-shard write;
- saga/process manager;
- idempotency;
- outbox/inbox;
- reconciliation;
- read model/reporting pipeline.

Business invariant toàn cục có thể cần authority riêng thay vì query tất cả shard mỗi command.

## 16. Connection capacity

Tổng pool mọi instance không được vượt DB capacity:

```text
max possible connections = replicas_app × pool_per_instance + jobs + admin + headroom
```

Autoscaling application có thể tạo connection storm. Pool acquisition timeout, min/max, lifetime và proxy phải được load test với failover.

## 17. DR drill

Kịch bản tối thiểu:

- mất primary;
- xóa nhầm dữ liệu và PITR;
- backup gần nhất hỏng;
- region/storage/account unavailable;
- credential/key rotation;
- replica lag dài;
- application rollback sau schema expand.

Ghi timeline, quyết định, actual RPO/RTO, data validation và action item.

## 18. Checklist production

- Replica reads có consistency class và lag threshold.
- Failover có fencing, promotion và application test.
- Backup encrypted, độc lập và có restore drill.
- PITR binlog retention đáp ứng RPO.
- Migration/backfill kiểm soát lag/lock/log.
- Partition/archive/shard dựa trên workload đo được.
- Connection budget tính cả autoscaling và job.
- Dashboard/runbook/owner cho topology, backup và DR.


---
title: Zero-Downtime Schema và Data Migration
tags: [database-migration, expand-contract, backfill, mysql, deployment]
status: verified
verified_on: 2026-07-23
applies_to: [MySQL 8.4, Flyway, Liquibase]
requires: [06-Database-va-toi-uu-SQL-MySQL, 43-Release-Engineering-GitOps-Feature-Flags-va-Canary]
constrains: [07-JPA-Hibernate-va-Transaction, 50-Multi-Region-Architecture-DR-va-Data-Residency]
verified_by: [22-Test-Engineering-Nang-cao, 40-Performance-Capacity-va-Load-Testing]
---

# Zero-Downtime Schema và Data Migration

> [!summary]
> Zero downtime là thuộc tính của cả chuỗi schema → code compatibility → backfill → validation → cutover → cleanup. Một DDL “online” không đủ; nó vẫn có metadata lock, resource cost, replica lag và failure/recovery behavior.

## 1. Invariant triển khai

Trong rolling deployment, ít nhất hai app versions cùng chạy:

```text
old code ↔ transition schema ↔ new code
```

Mỗi bước phải tương thích với version trước/sau. Rollback code không được gặp schema đã contract quá sớm.

## 2. Expand–migrate–contract

1. **Expand:** thêm cấu trúc mới theo cách backward compatible.
2. **Dual compatibility:** code đọc/ghi an toàn với old/new.
3. **Backfill:** chuyển dữ liệu lịch sử theo chunk.
4. **Verify:** completeness/correctness/performance.
5. **Cutover:** đổi read authority bằng flag/config.
6. **Observe:** giữ rollback window.
7. **Contract:** xóa old field/index/code sau khi không còn reader/writer.

## 3. Ví dụ đổi `full_name` thành hai cột

### Release A — expand

```sql
ALTER TABLE customers
  ADD COLUMN given_name VARCHAR(100) NULL,
  ADD COLUMN family_name VARCHAR(100) NULL;
```

Không đặt `NOT NULL` ngay khi historical rows chưa có giá trị.

### Release B — compatible writes

```java
customer.writeLegacyFullName(nameFormatter.combine(given, family));
customer.writeStructuredName(given, family);
```

Dual-write cần một code path/transaction, không hai service độc lập.

### Backfill

```sql
UPDATE customers
SET given_name = :given,
    family_name = :family
WHERE id = :id
  AND given_name IS NULL
  AND family_name IS NULL;
```

Parse tên là business ambiguity; phải có policy/manual path, không tự `split(" ")` rồi tuyên bố đúng.

### Release C — read new with monitored fallback

```java
Name read(CustomerRow row) {
    if (row.givenName() != null || row.familyName() != null) {
        return new Name(row.givenName(), row.familyName());
    }
    metrics.increment("customer.name.legacy_fallback");
    return legacyParser.parse(row.fullName());
}
```

### Release D — contract

Chỉ drop `full_name` khi:

- fallback metric bằng 0 đủ window;
- mọi app/job/export/report đã migrate;
- rollback version không cần cột;
- backup/restore/replay path đã cập nhật.

## 4. Backfill worker

```sql
SELECT id
FROM customers
WHERE given_name IS NULL
  AND id > :lastId
ORDER BY id
LIMIT 500;
```

Checkpoint theo stable key, không OFFSET lớn. Mỗi chunk:

- transaction ngắn;
- idempotent predicate;
- bounded rate;
- đo lock/CPU/IO/replica lag;
- pause/resume;
- record failures riêng;
- không overwrite concurrent new writes.

## 5. Thêm NOT NULL an toàn

1. add nullable;
2. app writes value;
3. backfill;
4. query kiểm tra null;
5. enforce constraint bằng mechanism phù hợp engine/version;
6. update ORM validation;
7. test rollback.

DB constraint là protection cuối; application validation không thay nó.

## 6. Đổi kiểu dữ liệu

Ví dụ `INT` → `BIGINT` có thể rebuild/copy tùy engine/operation. Lựa chọn:

- in-place DDL sau capacity test;
- shadow column + dual-write + backfill;
- online schema change tool có trigger/copy/swap;
- shadow table + CDC/cutover.

Mỗi lựa chọn phải test write amplification, lock, disk headroom và crash recovery.

## 7. Index migration

Trước add:

- query shape/column order;
- selectivity/distribution;
- index tương tự/dư thừa;
- write/storage cost.

Sau add:

- `EXPLAIN ANALYZE` representative;
- p95/p99;
- buffer/cache effect;
- replication lag;
- write throughput.

Drop index qua hai bước: stop dependence/observe rồi mới drop.

## 8. Rename không phải atomic ở cấp hệ thống

Đổi `status` → `order_status` trực tiếp làm old code hỏng. Dùng add/copy/compatibility; hoặc view/alias nếu engine/ORM semantics được kiểm chứng.

## 9. Migration ownership

| Phase | Owner | Gate |
|---|---|---|
| DDL design | service + DBA/platform | lock/algorithm evidence |
| deploy expand | release owner | old app compatible |
| backfill | data/service | lag/load budget |
| cutover | feature owner | reconciliation pass |
| contract | service owner | no old consumers |
| recovery | incident owner | rollback/runbook tested |

Migration không được tự chạy đồng thời từ mọi pod nếu tool lock/permissions chưa rõ.

## 10. DDL preflight

```text
exact engine/version
table rows/bytes/growth
current long transactions
metadata lock risk
DDL algorithm/lock mode
temporary/double disk need
replica behavior
backup/PITR state
abort/rollback behavior
maintenance/traffic window
```

## 11. API/event compatibility

Data migration thường kéo theo contract:

- JSON field cũ/new;
- event schema version;
- search projection;
- cache key/value;
- analytics pipeline;
- CSV/export/import;
- mobile client lâu nâng cấp.

Map đầy đủ lineage trước contract.

## 12. Failure matrix

| Failure | Control |
|---|---|
| DDL chờ metadata lock | timeout/preflight/kill policy |
| table copy đầy disk | capacity headroom/abort |
| replica lag | throttle/pause |
| backfill overwrite new write | conditional update/version |
| dual-write divergence | transaction/reconcile |
| deploy rollback | transition schema compatible |
| partial backfill | checkpoint/idempotency |
| cutover lỗi | feature flag/fallback |
| contract quá sớm | dependency inventory + metrics |

## 13. Verification queries

```sql
SELECT COUNT(*) AS missing
FROM customers
WHERE given_name IS NULL AND family_name IS NULL;

SELECT id, full_name, given_name, family_name
FROM customers
WHERE normalize(full_name) <> normalize(CONCAT_WS(' ', given_name, family_name))
LIMIT 100;
```

Hàm `normalize` chỉ minh họa; MySQL thật cần logic deterministic phù hợp. Ngoài count, dùng checksum/sample/business invariants.

## 14. Anti-patterns

- `ddl-auto=update` production;
- DDL lớn trong request;
- migration irreversible + deploy code cùng một bước;
- backfill một transaction;
- OFFSET pagination cho hàng trăm triệu rows;
- dual-write không reconciliation;
- drop cột ngay sau deploy;
- coi staging nhỏ là bằng chứng production;
- rollback chỉ nghĩ code, không nghĩ data.

## 15. Kết nối graph

- MySQL/index: [[06-Database-va-toi-uu-SQL-MySQL]], [[16-MySQL-Optimizer-va-Index-Nang-cao]]
- Transaction/ORM: [[07-JPA-Hibernate-va-Transaction]]
- Batch/backfill: [[31-Background-Jobs-Scheduling-va-Spring-Batch]]
- Release/canary: [[43-Release-Engineering-GitOps-Feature-Flags-va-Canary]]
- DR/restore: [[50-Multi-Region-Architecture-DR-va-Data-Residency]]

## Nguồn chính thức

1. [MySQL 8.4 Reference Manual — InnoDB and Online DDL](https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl.html) — truy cập 2026-07-23.
2. [Flyway Documentation — Migrations](https://documentation.red-gate.com/flyway/flyway-concepts/migrations) — truy cập 2026-07-23.
3. [Liquibase Documentation — Changesets](https://docs.liquibase.com/concepts/changelogs/changeset.html) — truy cập 2026-07-23.
4. [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) — rolling update compatibility, truy cập 2026-07-23.


---
title: Database và tối ưu SQL với MySQL
tags: [mysql, sql, indexing, performance]
status: verified
verified_on: 2026-07-21
applies_to: [MySQL 8.4, InnoDB]
sources:
  - https://dev.mysql.com/doc/refman/8.4/en/optimization.html
  - https://dev.mysql.com/doc/refman/8.4/en/explain.html
---

# Database và tối ưu SQL với MySQL

## 1. Tối ưu bắt đầu từ mô hình đúng

Thứ tự ưu tiên:

1. đúng nghiệp vụ và constraint;
2. kiểu dữ liệu và cardinality hợp lý;
3. query trả đúng số row/column cần thiết;
4. index dựa trên workload;
5. đo execution plan và runtime;
6. chỉ sau đó mới cache, partition hoặc denormalize.

## 2. Schema và constraint

- Mọi bảng InnoDB nên có primary key ngắn, ổn định. Secondary index chứa primary-key value nên PK quá lớn làm mọi index lớn hơn.
- Dùng `NOT NULL` khi thiếu giá trị không hợp lệ.
- `UNIQUE` bảo vệ uniqueness ở DB; check-then-insert trong app vẫn race.
- Foreign key bảo vệ referential integrity khi kiến trúc cho phép.
- `CHECK` cho invariant cục bộ đơn giản; business transition phức tạp vẫn nằm ở domain/use case.
- Tiền dùng `DECIMAL(precision, scale)`; timestamp/timezone có quy ước rõ.
- Không dùng `VARCHAR(255)` vô thức cho mọi field; độ dài là contract và ảnh hưởng index.
- Enum DB tiện nhưng migration giá trị có trade-off; lookup table phù hợp khi role/status mở rộng có metadata.

## 3. Normalization và denormalization

Chuẩn hóa giảm duplication và anomaly. Denormalize chỉ khi:

- read path quan trọng đã đo là bottleneck;
- consistency model được định nghĩa;
- có cơ chế cập nhật/rebuild/reconcile;
- owner và runbook rõ.

Lưu snapshot như `order_item.unit_price` là quyết định nghiệp vụ đúng vì giá tại thời điểm mua phải bất biến, không phải “vi phạm chuẩn hóa” tùy tiện.

## 4. B-tree index và thứ tự cột

Composite index tuân theo leftmost-prefix. Với query:

```sql
SELECT id, created_at, total_amount
FROM orders
WHERE customer_id = ?
  AND status = ?
  AND created_at < ?
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

Index ứng viên:

```sql
CREATE INDEX idx_orders_customer_status_created_id
ON orders (customer_id, status, created_at DESC, id DESC);
```

Quy tắc heuristic, không phải định luật tuyệt đối:

- equality predicates trước;
- sau đó range/order phù hợp;
- xem selectivity và distribution thật;
- một composite index đúng thường tốt hơn nhiều single-column index mà mong optimizer tự ghép;
- index thêm làm write chậm và tốn buffer/storage.

Nguồn: [MySQL Column Indexes](https://dev.mysql.com/doc/refman/8.4/en/column-indexes.html), [Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html).

## 5. Sargability

Viết predicate để optimizer có thể dùng index range.

Không tốt:

```sql
WHERE DATE(created_at) = '2026-07-21'
WHERE LOWER(email) = LOWER(?)
WHERE price * 1.1 > 1000
WHERE name LIKE '%phone%'
```

Tốt hơn khi semantics cho phép:

```sql
WHERE created_at >= '2026-07-21 00:00:00'
  AND created_at <  '2026-07-22 00:00:00'
```

Với case-insensitive search, chọn collation/normalized column/function index có chủ đích. Leading wildcard thường không dùng B-tree hiệu quả; cân nhắc full-text/search engine theo nhu cầu.

## 6. `EXPLAIN` và `EXPLAIN ANALYZE`

Không phán đoán index bằng mắt. Quy trình:

1. lấy query thật và parameter representative;
2. chạy `EXPLAIN`, sau đó `EXPLAIN ANALYZE` ở môi trường an toàn;
3. kiểm tra access type, chosen key, estimated rows, actual rows/loops/time;
4. tìm estimate lệch lớn, scan nhiều, temp/filesort, nested loop bùng nổ;
5. thay đổi một yếu tố;
6. đo lại latency, rows examined, CPU/I/O và write cost.

Full table scan không luôn xấu: bảng nhỏ hoặc query trả phần lớn bảng có thể scan nhanh hơn index. Nguồn: [EXPLAIN Statement](https://dev.mysql.com/doc/refman/8.4/en/explain.html), [Avoiding Full Table Scans](https://dev.mysql.com/doc/refman/8.4/en/table-scan-avoidance.html).

## 7. Covering index và `SELECT *`

Nếu index chứa đủ cột cần trả, engine có thể tránh đọc row base. Tuy nhiên index quá rộng tăng storage/write amplification. Chỉ select cột cần thiết, đặc biệt với text/blob và join lớn.

## 8. Pagination

Offset lớn phải scan/bỏ nhiều row:

```sql
SELECT ... ORDER BY created_at DESC, id DESC LIMIT 50 OFFSET 500000;
```

Keyset:

```sql
SELECT ...
FROM orders
WHERE (created_at, id) < (?, ?)
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

Keyset nhanh và ổn định hơn cho traversal tuần tự, nhưng không nhảy trang tùy ý dễ dàng.

## 9. Join và N+1

- Index foreign key/join columns phù hợp.
- Filter sớm nhưng để optimizer quyết định join order trừ khi có bằng chứng buộc hint.
- Không dùng application loop phát một query cho mỗi row.
- Kiểm tra cardinality: join nhiều quan hệ to-many có thể tạo Cartesian explosion.
- Projection, batch fetch hoặc nhiều query có kiểm soát đôi khi tốt hơn một join khổng lồ.

## 10. Write path và batch

- Batch insert/update để giảm round-trip, nhưng giới hạn batch size.
- Transaction quá lớn giữ lock/undo lâu và làm replication lag.
- Update chỉ cột cần thiết khi hợp lý.
- Index không dùng vẫn làm DML tốn phí; theo dõi trước khi xóa.
- Dùng bulk SQL cẩn thận vì bypass persistence context/entity callback.

## 11. Lock, isolation và deadlock

- Giữ transaction ngắn; không chờ network/user trong transaction.
- Truy cập resource theo thứ tự nhất quán để giảm deadlock.
- Deadlock vẫn có thể xảy ra; transaction idempotent có thể retry có giới hạn.
- Hiểu MVCC và isolation của MySQL/InnoDB; không đổi isolation chỉ để chữa triệu chứng.
- Dùng optimistic locking khi xung đột hiếm; pessimistic/atomic SQL khi cạnh tranh cao và cần serialize.

## 12. Statistics và hints

Optimizer chọn plan dựa trên statistics/cardinality estimate. Nếu estimate sai, xem `ANALYZE TABLE`, histogram/statistics và data skew. Index/optimizer hint là biện pháp cuối vì có thể đóng băng quyết định sai khi dữ liệu thay đổi. Nguồn: [Persistent Optimizer Statistics](https://dev.mysql.com/doc/refman/8.4/en/innodb-persistent-stats.html), [ANALYZE TABLE](https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html).

## 13. Migration an toàn

- Schema là code: version, review, test và backup/restore plan.
- Migration forward-only, deterministic; không sửa file đã chạy ở môi trường chia sẻ.
- Tách expand → migrate/backfill → switch → contract cho breaking change.
- Backfill theo batch, rate limit và có resume checkpoint.
- DDL trên bảng lớn cần đánh giá lock/online behavior cụ thể phiên bản.
- Production dùng Flyway/Liquibase; `ddl-auto=validate` hoặc `none`, không `update`.

## 14. Anti-pattern cần chặn

- index mọi cột;
- thêm cache trước khi xem execution plan;
- `SELECT *` cho list endpoint;
- offset pagination vô hạn;
- query theo từng item trong loop;
- thiếu unique constraint nhưng app “đã check”;
- dùng `LIKE '%...%'` trên hàng triệu row rồi mong B-tree cứu;
- ép index/hint mà không benchmark;
- test H2 rồi giả định giống MySQL;
- xóa index chỉ vì “không thấy query hiện tại dùng”.

## 15. Phiếu điều tra slow query

```markdown
Query/use case:
SLO latency/throughput:
DB/schema/version:
Dataset/cardinality/skew:
Parameters representative:
Current indexes:
EXPLAIN ANALYZE:
Rows examined/returned:
Lock waits/CPU/I/O:
Hypothesis:
One change:
Before vs after p50/p95/p99:
Write/storage impact:
Rollback plan:
```


---
title: MySQL Optimizer và Index nâng cao
tags: [mysql, optimizer, indexing, explain-analyze]
status: verified
verified_on: 2026-07-21
applies_to: [MySQL 8.4, InnoDB]
sources:
  - https://dev.mysql.com/doc/refman/8.4/en/optimization.html
---

# MySQL Optimizer và Index nâng cao

## 1. Mental model vật lý

InnoDB primary key là clustered index: leaf page chứa row data. Secondary-index leaf chứa secondary key và primary-key value; tìm row đầy đủ qua secondary index thường cần thêm lookup về clustered index. Vì vậy:

- PK lớn làm mọi secondary index lớn;
- random wide key có thể tăng page split/locality cost;
- covering index có thể tránh secondary-to-clustered lookup;
- query trả quá nhiều row có thể scan nhanh hơn hàng loạt random lookup.

Nguồn: [Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html).

## 2. Optimizer làm gì?

Optimizer ước lượng cost cho access path, join order, index, scan, sort và temporary work dựa trên statistics. Plan “sai” thường vì:

- statistics/cardinality estimate lệch;
- parameter/data skew;
- predicate không sargable;
- index không khớp tổ hợp filter/order;
- query yêu cầu quá nhiều row/column;
- join tạo intermediate result lớn.

Không kết luận engine “ngu” trước khi xem actual rows và data distribution.

## 3. Composite index: equality–range–order

Heuristic:

1. cột equality có selectivity/hỗ trợ prefix;
2. cột range;
3. cột phục vụ order/group hoặc covering.

Nhưng thứ tự equality fields vẫn phụ thuộc selectivity, reuse và query family. Sau range trên một key part, khả năng dùng các phần sau để giới hạn range thường bị hạn chế, dù Index Condition Pushdown có thể lọc tại storage engine.

Ví dụ hot query:

```sql
SELECT id, sku, name, price
FROM products
WHERE category_id = :category
  AND status = 'AVAILABLE'
  AND price BETWEEN :min AND :max
ORDER BY price ASC, id ASC
LIMIT 30;
```

Ứng viên:

```sql
CREATE INDEX idx_products_category_status_price_id
    ON products(category_id, status, price, id);
```

Phải benchmark với tỷ lệ `AVAILABLE`, số product/category và khoảng giá thật. Nếu `status` gần như luôn AVAILABLE, giá trị phân biệt thấp nhưng vẫn có thể hữu ích trong composite prefix; không áp dụng câu “low-cardinality column không bao giờ index”.

Nguồn: [Column and Multiple-Column Indexes](https://dev.mysql.com/doc/refman/8.4/en/column-indexes.html), [Index Condition Pushdown](https://dev.mysql.com/doc/refman/8.4/en/index-condition-pushdown-optimization.html).

## 4. Leftmost prefix qua ví dụ

Index `(tenant_id, status, created_at, id)` có thể hỗ trợ tốt:

- `tenant_id = ?`;
- `tenant_id = ? AND status = ?`;
- `tenant_id = ? AND status = ? AND created_at < ?`.

Không trực tiếp tối ưu tốt chỉ `status = ?` hoặc chỉ `created_at < ?` vì bỏ prefix `tenant_id`. Một index không phục vụ mọi query; thiết kế theo query portfolio và tenant isolation.

## 5. Selectivity, cardinality và skew

Average distribution có thể lừa optimizer. Ví dụ 99% order `COMPLETED`, 1% `FAILED`: index theo status có thể rất tốt cho FAILED nhưng tệ cho COMPLETED. Dùng actual parameter, histogram/statistics khi phù hợp và đo nhiều phân khúc.

`ANALYZE TABLE` cập nhật statistics; không chạy vô thức ở thời điểm nhạy cảm mà không hiểu impact. Nguồn: [Optimizer Statistics](https://dev.mysql.com/doc/refman/8.4/en/optimizer-statistics.html).

## 6. Đọc `EXPLAIN ANALYZE`

Tập trung:

- plan tree và access method;
- estimated rows so với actual rows;
- actual time first row/last row;
- loops;
- rows filtered;
- index condition vs attached condition;
- sort/temp/materialization;
- nested loop nào khuếch đại work.

Nếu node ước lượng 10 row nhưng actual 1.000.000, xem statistics/skew/predicate. Nếu ước lượng đúng nhưng vẫn chậm, xem I/O, row width, sorting, lock wait, buffer pool và query volume.

Nguồn: [MySQL EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/explain.html).

## 7. Covering index có điều kiện

Index `(customer_id, created_at, id, total_amount, status)` có thể cover lịch sử order nhưng:

- index rộng hơn;
- update `status`/`total_amount` tốn hơn;
- buffer pool chứa ít entries/page;
- nhiều query khác không hưởng lợi.

Chỉ cover hot read với benefit đo được. Không thêm text/blob lớn vào index chỉ để tránh table lookup.

## 8. Sort và filesort

`Using filesort` không nhất thiết ghi ra disk; nó nghĩa MySQL cần bước sort ngoài index order. Index có thể phục vụ ORDER BY khi filter/order/direction phù hợp. Tuy nhiên một query trả ít row có thể filter rồi sort rẻ hơn duy trì index mới.

Luôn thêm unique tie-breaker để pagination deterministic:

```sql
ORDER BY created_at DESC, id DESC
```

## 9. Join explosion

Join `orders → items → product_images → reviews` có thể nhân row theo tích các collection. Dấu hiệu:

- `DISTINCT` để chữa duplicate;
- pagination sai;
- network/heap tăng;
- Hibernate materialize graph lớn.

Tách query:

1. page IDs/summary;
2. batch load collection cần thiết theo IDs;
3. assemble DTO;

hoặc projection chuyên dụng. Đo tổng round-trip và rows, không mặc định “một query luôn nhanh hơn”.

## 10. OR, IN và UNION

- `IN` hợp lý cho danh sách có giới hạn; danh sách cực lớn có parse/plan/network cost.
- `OR` trên nhiều cột có thể khó dùng một composite index; optimizer có thể index merge nhưng không luôn tối ưu.
- `UNION ALL` các branch sargable đôi khi tốt hơn OR, nhưng phải giữ semantics duplicate.
- Temporary table/batch table phù hợp cho tập ID lớn.

Mọi rewrite phải so plan và result equivalence.

## 11. Functional/generated-column index

Khi query thường dùng một biểu thức ổn định như normalized email hoặc JSON path, generated column/index có thể biến predicate thành indexable. Nhưng phải xác định:

- deterministic expression;
- collation/normalization semantics;
- write/storage cost;
- migration/backfill;
- application dùng đúng expression.

Không chữa mọi `LOWER(column)` bằng duplicate field thiếu consistency.

## 12. Full-text và search engine

B-tree không phù hợp contains search `%term%`, relevance, typo/fuzzy, stemming hay faceting phức tạp. MySQL FULLTEXT có thể đủ cho use case nhỏ; search engine riêng thêm indexing pipeline, eventual consistency và vận hành. Chọn từ search requirements, language và scale, không theo xu hướng.

## 13. Partitioning

Partitioning không thay index. Nó hữu ích khi pruning, lifecycle/drop partition hoặc operation trên dataset rất lớn phù hợp partition key. Rủi ro:

- query không có partition key quét nhiều partition;
- unique/index constraint bị ràng buộc;
- quá nhiều partition tăng overhead;
- migration/maintenance phức tạp.

Chỉ partition sau khi single-table/index/schema đã được đo và có data lifecycle rõ.

## 14. Invisible index và xóa index

Invisible index cho phép kiểm tra optimizer behavior khi “ẩn” index mà chưa drop ngay. Trước khi xóa:

- quan sát workload đủ chu kỳ;
- xem index là prefix của index khác không;
- kiểm tra constraint/FK/rare job/report;
- thử invisible ở staging/canary;
- theo dõi latency/rows examined/CPU;
- có rollback nhanh.

## 15. Index budget

Mỗi index phải có “owner query”:

```markdown
Index: idx_orders_customer_created_id
Supports: customer order history cursor pagination
Query fingerprint:
Read benefit:
Write/storage cost:
Created:
Last verified:
Removal criteria:
```

Duplicate/overlapping index cần so prefix và covering fields; không xóa chỉ bằng tên.

## 16. Lab bắt buộc cho một query chậm

1. Snapshot schema/index/statistics.
2. Dataset có size và skew đại diện.
3. Capture query + bind values.
4. Baseline p50/p95/p99 và throughput.
5. `EXPLAIN ANALYZE` + rows examined/returned.
6. Một hypothesis, một change.
7. Đo read improvement và write/storage regression.
8. Load test concurrency/lock behavior.
9. Deploy canary và theo dõi.
10. Ghi kết quả vào vault/ADR.

## 17. Kết nối mở rộng

- Capacity/load curve thay vì đo query đơn lẻ: [[40-Performance-Capacity-va-Load-Testing]].
- Tenant, temporal và audit index shapes: [[37-Data-Modeling-Multi-Tenancy-Temporal-va-Audit]].
- Khi relational query không còn đáp ứng search semantics: [[38-Search-Architecture-Elasticsearch-va-Projection]].
- Replica/failover/PITR: [[28-MySQL-Replication-Backup-va-Scaling]].
- Case có stock/order/search: [[45-Case-Study-Phone-Store-at-Scale]].

# Index strategy

## Tạo index dựa trên query

- Bắt đầu từ `WHERE` equality, tiếp đến range, rồi `ORDER BY` khi phù hợp.
- Index cho foreign key được join thường xuyên.
- Unique index bảo vệ business invariant thay vì chỉ kiểm tra ở code.
- Dùng composite index theo thứ tự truy vấn thật; tránh nhiều index prefix trùng.
- Kiểm tra selectivity, kích thước, write amplification và kế hoạch thực thi.

## Query trọng yếu

- Variant theo SKU và product.
- Catalog theo trạng thái/category/brand/price cùng sort được hỗ trợ.
- Stock item theo warehouse + variant.
- Reservation theo trạng thái + expires_at.
- Cart theo owner/session + status.
- Order theo customer + created_at và order number.
- Payment theo provider + provider transaction ID/idempotency key.
- Outbox theo status + next_attempt_at.

Không thêm index “phòng xa”; ghi query/metric chứng minh.


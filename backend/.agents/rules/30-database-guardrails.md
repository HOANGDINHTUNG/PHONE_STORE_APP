# Phone Store Backend — Database Guardrails

## 1. Phạm vi áp dụng

Áp dụng tài liệu này cho toàn bộ thành phần liên quan đến dữ liệu, bao gồm:

- MySQL.
- Spring Data JPA.
- Hibernate.
- Flyway Migration.
- Entity mapping.
- Repository query.
- Transaction.
- Locking.
- Index.
- Constraint.
- Audit.
- Backup.
- Data retention.
- Database monitoring.
- Database testing.
- Production database operation.

Tài liệu này mở rộng:

- `00-project-constitution.md`.
- `10-java-spring-standards.md`.
- `20-security-guardrails.md`.

Nếu có xung đột:

1. Bảo vệ tính toàn vẹn dữ liệu trước.
2. Tuân thủ `00-project-constitution.md`.
3. Không thực hiện thay đổi phá hủy khi chưa đánh giá ảnh hưởng.
4. Không tự ý bỏ constraint để làm code chạy.
5. Báo cáo rõ vấn đề và đề xuất migration an toàn.

---

## 2. Nguyên tắc nền tảng

Database phải tuân thủ:

- Schema as Code.
- Migration First.
- Data Integrity at Database Level.
- Least Privilege.
- Explicit Constraints.
- Explicit Transactions.
- Backward-Compatible Changes.
- Measured Indexing.
- Safe Concurrency.
- Auditable Changes.
- Recoverable Operations.
- No Manual Production Drift.

Database không chỉ là nơi lưu Entity.

Database phải chủ động bảo vệ:

- Unique value.
- Foreign key.
- Giá trị bắt buộc.
- Giá trị hợp lệ.
- Quan hệ dữ liệu.
- Dữ liệu lịch sử.
- Tồn kho.
- Giao dịch thanh toán.
- Trạng thái quan trọng.

Không chỉ dựa vào Java validation để bảo vệ dữ liệu.

---

## 3. Công nghệ và nguồn sự thật

Database chính của dự án là MySQL với storage engine InnoDB.

Phiên bản MySQL phải:

- Được khóa trong Docker Compose hoặc hạ tầng.
- Giống nhau giữa các thành viên.
- Được ghi trong tài liệu môi trường.
- Được kiểm tra tương thích với Spring Boot và Hibernate.
- Không sử dụng tag Docker không cố định như `latest`.

Flyway migration là nguồn sự thật của database schema.

Thứ tự nguồn sự thật:

```text
Flyway migrations
→ Schema thực tế
→ Entity mapping
→ Repository query
→ Database documentation
```

Entity không được tự ý làm thay đổi database schema trong production.

Không xem output do Hibernate tự sinh là migration production đã được kiểm tra.

---

## 4. Storage engine

Mọi bảng nghiệp vụ phải sử dụng InnoDB.

InnoDB được sử dụng để hỗ trợ:

- Transaction.
- Row-level locking.
- Foreign key.
- Crash recovery.
- Multi-Version Concurrency Control.
- ACID.

Không sử dụng MyISAM cho bảng nghiệp vụ.

Migration tạo bảng nên khai báo rõ storage engine khi cần đảm bảo tính nhất quán:

```sql
ENGINE = InnoDB
```

Không trộn nhiều storage engine trong cùng một luồng transaction.

---

## 5. Character set và collation

Sử dụng:

```text
utf8mb4
```

cho database, table và column văn bản, trừ trường hợp có yêu cầu đặc biệt.

Không sử dụng:

```text
utf8
utf8mb3
latin1
```

cho schema mới.

Collation phải được lựa chọn có chủ đích.

Phải hiểu collation ảnh hưởng đến:

- So sánh chữ hoa và chữ thường.
- So sánh dấu tiếng Việt.
- Sắp xếp.
- Unique constraint.
- Tìm kiếm.
- Email.
- Username.
- Slug.
- Coupon code.

Không thay collation tùy ý giữa các bảng hoặc cột liên quan.

Các giá trị cần so sánh byte chính xác như:

- Token hash.
- Secret fingerprint.
- External transaction identifier nhạy cảm.
- Idempotency key.
- Checksum.

nên sử dụng:

- Kiểu binary phù hợp.
- Hoặc binary collation có chủ đích.

Email phải có chiến lược chuẩn hóa trước khi lưu và tạo unique constraint.

Không dựa vào collation không rõ ràng để quyết định hai email có giống nhau hay không.

---

## 6. Quy tắc đặt tên

Sử dụng `snake_case`.

### Table

Tên table sử dụng danh từ số nhiều:

```text
users
roles
permissions
products
product_variants
inventories
orders
order_items
payments
shipments
reviews
```

Không sử dụng từ khóa SQL dễ gây xung đột như:

```text
user
order
group
rank
key
condition
```

### Column

Tên column phải rõ nghĩa:

```text
customer_id
product_id
variant_id
created_at
updated_at
deleted_at
unit_price
total_amount
reserved_quantity
```

Không sử dụng:

```text
id_user
id_product
data
value
type1
status2
```

### Constraint và index

Sử dụng quy ước:

```text
pk_<table>
fk_<child>__<parent>
uk_<table>__<columns>
idx_<table>__<columns>
chk_<table>__<rule>
```

Ví dụ:

```text
pk_orders
fk_order_items__orders
fk_order_items__product_variants
uk_product_variants__sku
idx_orders__customer_created
chk_order_items__quantity_positive
```

Tên phải đủ ngắn để không vượt giới hạn identifier của MySQL.

Không để MySQL tự sinh tên constraint khó hiểu nếu có thể đặt tên rõ ràng.

---

## 7. Primary key

Bảng nghiệp vụ chính nên sử dụng:

```sql
id BIGINT NOT NULL AUTO_INCREMENT
```

và:

```sql
PRIMARY KEY (id)
```

Java mapping tương ứng:

```text
Long
```

Không sử dụng `BIGINT UNSIGNED` nếu giá trị tối đa có thể vượt phạm vi `Long`
của Java.

Không sử dụng natural key có khả năng thay đổi làm primary key.

Ví dụ không nên dùng làm primary key:

- Email.
- Phone.
- SKU.
- Slug.
- Coupon code.
- External transaction ID.

Các giá trị này nên có unique constraint riêng.

Composite primary key chỉ nên dùng cho:

- Junction table.
- Bảng liên kết nhiều-nhiều.
- Trường hợp định danh thật sự phụ thuộc nhiều cột.

Không dùng composite primary key cho Entity chính nếu surrogate key làm mapping
và tham chiếu rõ ràng hơn.

Nếu cần public identifier khó đoán, có thể thêm:

```text
public_id
```

dạng UUID hoặc định danh ngẫu nhiên khác.

Không xem public UUID là cơ chế authorization.

---

## 8. Column bắt buộc

Mặc định sử dụng `NOT NULL` cho dữ liệu bắt buộc.

Chỉ cho phép `NULL` khi:

- Giá trị thật sự chưa biết.
- Dữ liệu chưa áp dụng.
- Quan hệ là tùy chọn.
- Quy trình nghiệp vụ cho phép chưa có giá trị.

Không dùng `NULL` và chuỗi rỗng cùng thể hiện một ý nghĩa.

Phải xác định rõ:

```text
NULL
```

khác gì:

```text
''
```

Không thêm default value chỉ để migration chạy nếu giá trị mặc định không có
ý nghĩa nghiệp vụ.

Ví dụ không nên:

```sql
status VARCHAR(30) NOT NULL DEFAULT ''
```

Ưu tiên:

```sql
status VARCHAR(30) NOT NULL
```

hoặc một default có ý nghĩa nghiệp vụ rõ ràng.

---

## 9. Kiểu dữ liệu số

Sử dụng kiểu nhỏ nhất nhưng đủ phạm vi thực tế.

Gợi ý:

```text
BIGINT      → ID, số lượng rất lớn
INT         → quantity, count thông thường
SMALLINT    → giá trị phạm vi nhỏ
BOOLEAN     → true/false
DECIMAL     → tiền, phần trăm, dữ liệu thập phân chính xác
```

Không sử dụng `FLOAT` hoặc `DOUBLE` cho:

- Giá sản phẩm.
- Tổng đơn hàng.
- Giảm giá.
- Thanh toán.
- Phí vận chuyển.
- Thuế.
- Hoàn tiền.

Tiền tệ nên sử dụng:

```sql
DECIMAL(19, 2)
```

trừ khi nghiệp vụ yêu cầu precision hoặc scale khác.

Java phải sử dụng `BigDecimal` tương ứng.

Phần trăm có thể sử dụng:

```sql
DECIMAL(5, 2)
```

và constraint phù hợp:

```sql
CHECK (discount_percent >= 0 AND discount_percent <= 100)
```

Số lượng phải có constraint:

```sql
CHECK (quantity > 0)
```

Tồn kho phải có constraint:

```sql
CHECK (on_hand_quantity >= 0)
CHECK (reserved_quantity >= 0)
CHECK (reserved_quantity <= on_hand_quantity)
```

Không dùng kiểu số để lưu dữ liệu chỉ có hình thức là số, ví dụ:

- Phone number.
- Postal code.
- Tracking code.
- Coupon code.

---

## 10. Tiền tệ

Mỗi giá trị tiền quan trọng phải xác định:

- Amount.
- Currency.
- Precision.
- Scale.
- Rounding rule.
- Nguồn tính toán.
- Thời điểm chụp giá trị.

Nếu hệ thống có thể hỗ trợ nhiều loại tiền, sử dụng:

```text
currency CHAR(3)
```

theo mã tiền tệ được dự án hỗ trợ.

Không giả định mọi giá trị mãi mãi là VND nếu thiết kế cần mở rộng quốc tế.

Các bảng giao dịch phải lưu tiền tệ cùng amount khi cần bảo toàn lịch sử.

Ví dụ:

```text
orders.total_amount
orders.currency
payments.amount
payments.currency
refunds.amount
refunds.currency
```

Không tính lại tổng đơn hàng cũ từ giá sản phẩm hiện tại.

Không để client gửi `total_amount` và lưu trực tiếp.

Backend phải tính, xác minh và lưu số tiền.

---

## 11. Kiểu dữ liệu thời gian

Sử dụng thời gian theo UTC.

Đối với thời điểm hệ thống, ưu tiên:

```sql
DATETIME(6)
```

và ánh xạ Java phù hợp như:

```text
Instant
```

hoặc kiểu đã được dự án thống nhất.

Sử dụng:

```text
DATE
```

cho dữ liệu chỉ có ngày, ví dụ ngày sinh.

Không sử dụng chuỗi để lưu ngày giờ.

Không lưu timestamp theo nhiều múi giờ khác nhau trong database.

Không sử dụng `LocalDateTime` một cách mơ hồ cho thời điểm tuyệt đối.

Các column thường dùng:

```text
created_at
updated_at
deleted_at
expires_at
revoked_at
paid_at
cancelled_at
shipped_at
delivered_at
```

Phải xác định timezone của database connection và application.

Không phụ thuộc vào timezone mặc định của máy chạy ứng dụng.

---

## 12. String và text

Sử dụng `VARCHAR` khi có giới hạn hợp lý.

Ví dụ:

```text
email           VARCHAR(254)
phone           VARCHAR(20)
sku             VARCHAR(100)
slug            VARCHAR(200)
status          VARCHAR(50)
currency        CHAR(3)
tracking_code   VARCHAR(100)
```

Giới hạn database phải đồng nhất với Bean Validation.

Không khai báo tất cả text field là `VARCHAR(255)` theo thói quen.

Không sử dụng `TEXT` nếu:

- Cần unique constraint.
- Cần index toàn bộ.
- Có giới hạn nghiệp vụ rõ ràng.
- Dữ liệu thực tế ngắn.

Sử dụng `TEXT` hoặc kiểu lớn hơn cho:

- Mô tả sản phẩm.
- Nội dung review dài.
- Nội dung ghi chú.
- Payload bên ngoài có kiểm soát.

Không lưu HTML không được sanitize.

---

## 13. Status và ENUM

Không mặc định sử dụng MySQL `ENUM` cho status có khả năng mở rộng.

Ưu tiên:

```sql
status VARCHAR(30) NOT NULL
```

và:

- Java enum.
- `@Enumerated(EnumType.STRING)`.
- CHECK constraint khi phiên bản MySQL và quy trình migration hỗ trợ.
- State transition validation trong Service.

Ví dụ:

```sql
CONSTRAINT chk_orders__status
CHECK (status IN (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPING',
    'DELIVERED',
    'CANCELLED'
))
```

Nếu thêm trạng thái mới:

1. Cập nhật migration.
2. Cập nhật Java enum.
3. Cập nhật state machine.
4. Cập nhật API.
5. Cập nhật test.
6. Cập nhật tài liệu.

Không thay đổi status bằng SQL thủ công mà bỏ qua business transition.

Dùng bảng tham chiếu thay vì enum khi giá trị:

- Được quản trị động.
- Có metadata.
- Có mô tả.
- Có thứ tự.
- Có quyền liên quan.
- Có thể được thêm bởi Admin.

Ví dụ:

- Roles.
- Permissions.
- Shipping carriers.
- Product specification definitions.

---

## 14. JSON column

Chỉ sử dụng JSON cho dữ liệu:

- Có cấu trúc linh hoạt.
- Không phải quan hệ cốt lõi.
- Không cần join thường xuyên.
- Không cần constraint phức tạp.
- Có schema hoặc version rõ ràng.

Có thể dùng cho:

- External gateway payload đã sanitize.
- Snapshot bổ sung.
- Metadata không cố định.
- Audit context.
- Provider-specific response.

Không dùng JSON để thay thế các bảng cốt lõi như:

- Product variants.
- Order items.
- Roles.
- Permissions.
- Inventory.
- Payments.
- Addresses.
- Reviews.

Nếu JSON field được tìm kiếm thường xuyên:

- Xem xét generated column.
- Tạo index phù hợp.
- Hoặc chuẩn hóa thành column/table riêng.

Không lưu secret, raw card data hoặc raw authentication token trong JSON.

---

## 15. Binary, image và file

Không lưu toàn bộ ảnh sản phẩm trong database nếu object storage hoặc file
storage phù hợp hơn.

Database chỉ nên lưu metadata:

- Storage key.
- URL công khai nếu phù hợp.
- MIME type.
- File size.
- Width.
- Height.
- Checksum.
- Owner.
- Created time.
- Status.

Không lưu raw image Base64 trong `TEXT`.

Không lưu local filesystem path tuyệt đối có thể thay đổi theo môi trường.

Ưu tiên lưu storage key độc lập với provider URL.

---

## 16. Normalization

Mặc định thiết kế theo chuẩn hóa dữ liệu đến mức hợp lý, thường là 3NF.

Tách riêng:

- Users và roles.
- Roles và permissions.
- Products và variants.
- Products và images.
- Products và specifications.
- Orders và order items.
- Orders và payments.
- Orders và shipments.
- Inventory và stock movements.
- Coupons và coupon usages.

Không lặp dữ liệu chỉ để tránh join nếu chưa đo lường.

Denormalization chỉ được thực hiện khi:

1. Có truy vấn cụ thể.
2. Có bằng chứng hiệu năng.
3. Có cơ chế đồng bộ.
4. Có test.
5. Có tài liệu giải thích.

Một số snapshot là denormalization có chủ đích và cần thiết, ví dụ:

- Order item product name.
- Order item SKU.
- Order item variant attributes.
- Order shipping address.
- Unit price tại thời điểm mua.
- Discount tại thời điểm mua.

Snapshot lịch sử không được tự động đồng bộ với dữ liệu hiện tại.

---

## 17. Foreign key

Mọi quan hệ quan trọng phải có foreign key nếu không có lý do kiến trúc đặc biệt.

Foreign key phải:

- Có kiểu dữ liệu giống column được tham chiếu.
- Có index phù hợp.
- Có tên rõ ràng.
- Có delete behavior được xác định.

Mặc định ưu tiên:

```text
ON DELETE RESTRICT
```

hoặc:

```text
ON DELETE NO ACTION
```

cho dữ liệu nghiệp vụ quan trọng.

Chỉ sử dụng:

```text
ON DELETE CASCADE
```

khi child hoàn toàn thuộc lifecycle của parent và xóa parent phải xóa child.

Có thể phù hợp với:

- Temporary verification token.
- Một số junction table.
- Một số dữ liệu con không có giá trị độc lập.

Không dùng cascade delete cho:

- Orders.
- Order items.
- Payments.
- Refunds.
- Audit logs.
- Stock movements.
- Shipment history.
- Role change history.

Sử dụng:

```text
ON DELETE SET NULL
```

chỉ khi quan hệ có thể mất nhưng dữ liệu lịch sử vẫn có ý nghĩa.

Không bỏ foreign key chỉ để insert dữ liệu sai dễ hơn.

---

## 18. Unique constraint

Mọi uniqueness mang tính nghiệp vụ phải được bảo vệ ở database.

Ví dụ:

- User email đã normalize.
- User phone đã normalize.
- Role name.
- Permission code.
- Category slug.
- Brand slug.
- Product slug.
- Product variant SKU.
- Order number.
- Gateway transaction ID.
- Webhook event ID.
- Refresh token hash.
- Coupon code.
- Tracking code theo carrier nếu nghiệp vụ yêu cầu.

Application check:

```text
existsBy...
```

không thay thế unique constraint.

Phải xử lý race condition khi hai request cùng kiểm tra và insert.

Service phải bắt lỗi unique constraint và chuyển thành business conflict phù hợp.

Không phụ thuộc vào message lỗi database cụ thể để xây response cho client nếu
có thể ánh xạ bằng constraint name.

---

## 19. Soft delete

Không áp dụng soft delete cho mọi table theo thói quen.

Soft delete phù hợp khi:

- Dữ liệu cần khôi phục.
- Dữ liệu có lịch sử giao dịch.
- Dữ liệu cần audit.
- Dữ liệu không được phép biến mất vật lý ngay.

Có thể dùng:

```text
deleted_at
deleted_by
```

hoặc status phù hợp.

Không chỉ thêm `is_deleted` mà bỏ qua:

- Query filter.
- Unique constraint.
- Foreign key.
- Audit.
- Restore behavior.
- Data retention.

Phải xác định:

- Bản ghi đã xóa có xuất hiện trong admin không.
- Có được restore không.
- Có được tái sử dụng email, slug hoặc SKU không.
- Quan hệ con được xử lý thế nào.
- Khi nào được hard delete.

Không soft delete:

- Stock movement.
- Payment transaction.
- Audit event.

nếu việc xóa làm mất lịch sử quan trọng.

---

## 20. Audit column

Các Entity cần audit có thể sử dụng:

```text
created_at
created_by
updated_at
updated_by
```

Dữ liệu cần soft delete có thể thêm:

```text
deleted_at
deleted_by
```

Không bắt buộc mọi table đều có tất cả audit column.

Junction table đơn giản có thể chỉ cần khóa và timestamp nếu nghiệp vụ yêu cầu.

Audit time phải được quản lý nhất quán.

Có thể sử dụng Spring Data JPA Auditing cho application-level audit.

Không để client tự gửi:

- `created_at`.
- `updated_at`.
- `created_by`.
- `updated_by`.

Database audit log quan trọng phải ghi actor và context phù hợp.

---

## 21. Database trigger

Không sử dụng trigger làm lựa chọn mặc định.

Trigger chỉ được dùng khi:

- Có yêu cầu database-level không thể đảm bảo rõ ràng ở application.
- Nhiều ứng dụng cùng ghi database và cần invariant chung.
- Đã có tài liệu.
- Có test.
- Có monitoring.
- Có migration rõ ràng.

Không đặt business workflow phức tạp trong trigger.

Không để trigger âm thầm:

- Thay đổi status.
- Trừ tồn kho.
- Tạo payment.
- Gửi notification.
- Tạo order.

mà application không biết.

Ưu tiên application service và transaction rõ ràng.

---

## 22. Index nền tảng

Index phải được thiết kế dựa trên query thực tế.

Phải cân nhắc index cho:

- Foreign key.
- Unique field.
- Filter thường xuyên.
- Join column.
- Sort column.
- Search chính xác.
- Truy vấn trạng thái theo thời gian.

Không tạo index cho mọi column.

Mỗi index làm tăng:

- Dung lượng.
- Chi phí INSERT.
- Chi phí UPDATE.
- Chi phí DELETE.
- Thời gian migration.
- Chi phí bảo trì.

Không tạo index trùng lặp với:

- Primary key.
- Unique index.
- Composite index có leftmost prefix tương đương.

Tên index phải mô tả column:

```text
idx_orders__customer_created
idx_orders__status_created
idx_stock_movements__variant_created
```

---

## 23. Composite index

Thứ tự column trong composite index phải dựa trên:

- Equality condition.
- Range condition.
- Sort.
- Selectivity.
- Query pattern.

Ví dụ query:

```sql
WHERE customer_id = ?
ORDER BY created_at DESC, id DESC
```

có thể cần index:

```text
(customer_id, created_at, id)
```

Query:

```sql
WHERE status = ?
ORDER BY created_at DESC, id DESC
```

có thể cần:

```text
(status, created_at, id)
```

Không giả định index:

```text
(a, b, c)
```

tối ưu mọi query có `b` hoặc `c`.

Phải hiểu leftmost-prefix behavior.

Không tạo nhiều composite index gần giống nhau khi một index hợp lý có thể
phục vụ các query quan trọng.

---

## 24. Index cho Phone Store

Phải đánh giá index cho các query quan trọng.

Ví dụ có thể cần:

```text
users(normalized_email)
users(normalized_phone)
product_variants(sku)
product_variants(product_id, status)
products(category_id, status, created_at, id)
products(brand_id, status, created_at, id)
orders(customer_id, created_at, id)
orders(status, created_at, id)
order_items(order_id)
payments(order_id)
payments(gateway_transaction_id)
shipments(order_id)
stock_movements(variant_id, created_at, id)
reviews(product_id, status, created_at, id)
cart_items(cart_id, variant_id)
```

Đây chỉ là điểm bắt đầu.

Trước khi thêm index phải kiểm tra:

- Query thực tế.
- Cardinality.
- Execution plan.
- Dung lượng bảng.
- Tần suất đọc.
- Tần suất ghi.

Không copy index từ dự án khác mà không đánh giá.

---

## 25. Search

Tìm kiếm chính xác có thể sử dụng B-tree index.

Tìm kiếm dạng:

```text
LIKE 'iphone%'
```

có thể tận dụng index trong điều kiện phù hợp.

Tìm kiếm dạng:

```text
LIKE '%iphone%'
```

thường không tận dụng B-tree index hiệu quả.

Không thực hiện search toàn bộ bảng lớn bằng nhiều điều kiện `%keyword%`
mà không đánh giá.

Khi dữ liệu và yêu cầu tìm kiếm tăng, cân nhắc:

- MySQL FULLTEXT.
- Search service chuyên dụng.
- Search index riêng.
- Cơ chế normalize search text.

Không thêm Elasticsearch hoặc search engine chỉ vì dự đoán tương lai.

Phải có dữ liệu và yêu cầu chứng minh nhu cầu.

---

## 26. Query standards

Query phải:

- Sử dụng parameter binding.
- Có giới hạn kết quả.
- Chỉ lấy field cần thiết.
- Có thứ tự xác định khi phân trang.
- Có test nếu phức tạp.
- Có index phù hợp.
- Có timeout khi cần.

Không sử dụng:

```sql
SELECT *
```

trong query production quan trọng nếu chỉ cần một số column.

Không nối input người dùng vào:

- JPQL.
- Native SQL.
- ORDER BY.
- Column name.
- Function.
- Table name.

Sort field và filter field phải dùng allowlist.

Không tạo derived query method dài đến mức khó hiểu.

Khi derived query không còn rõ ràng, sử dụng:

- `@Query`.
- Projection.
- Specification.
- Custom repository.

Không sử dụng native query nếu giải pháp an toàn và dễ bảo trì hơn đáp ứng được.

Native query phải:

- Có lý do.
- Có parameter binding.
- Có test với MySQL thật.
- Có execution plan nếu query quan trọng.
- Có mapping rõ ràng.

---

## 27. Pagination

Mọi danh sách có thể tăng lớn phải có pagination.

Offset pagination phù hợp với:

- Admin table nhỏ hoặc trung bình.
- Trang cần nhảy trực tiếp.
- Query đã có index phù hợp.

Không cho client yêu cầu page size không giới hạn.

Phải có:

- Default page size.
- Maximum page size.
- Sort allowlist.
- Stable tie-breaker.

Ví dụ sort ổn định:

```text
created_at DESC, id DESC
```

Không chỉ sort bằng field có thể trùng như:

```text
created_at DESC
```

vì có thể tạo kết quả không ổn định.

Với dữ liệu lớn hoặc infinite scroll, cân nhắc keyset/cursor pagination.

Không sử dụng offset rất sâu nếu gây scan lớn mà không đánh giá.

---

## 28. N+1 query

Không giải quyết N+1 bằng cách chuyển toàn bộ relationship thành EAGER.

Phải xác định query cần dữ liệu nào và sử dụng:

- Projection.
- Fetch join.
- EntityGraph.
- Batch fetching.
- Query riêng theo use case.

Không truy cập lazy relationship trong Controller hoặc sau khi transaction đã đóng.

Nên tắt Open Session in View:

```text
spring.jpa.open-in-view=false
```

Service hoặc query layer phải lấy đủ dữ liệu trước khi trả DTO.

Query quan trọng phải được kiểm tra số lượng SQL khi cần.

Không serialize Entity graph trực tiếp.

---

## 29. Transaction boundary

Transaction nghiệp vụ được đặt tại Service use case.

Transaction phải bao phủ đầy đủ các bước cần atomicity.

Ví dụ checkout:

```text
Đọc giỏ hàng
→ Kiểm tra sản phẩm
→ Kiểm tra giá
→ Giữ tồn kho
→ Tạo order
→ Tạo order items
→ Ghi lịch sử
→ Commit
```

Nếu một bước thất bại, dữ liệu liên quan phải rollback phù hợp.

Không:

- Đặt transaction ở Controller.
- Mở transaction quá lâu.
- Thực hiện network call dài trong transaction.
- Chờ người dùng trong transaction.
- Gửi email đồng bộ trước commit.
- Gọi payment gateway chậm trong transaction database nếu có thể tách.

Không thay đổi isolation level nếu chưa hiểu ảnh hưởng.

Mặc định sử dụng isolation level đã được dự án kiểm chứng.

Mọi thay đổi isolation phải:

- Có use case.
- Có test concurrent.
- Có benchmark nếu cần.
- Có tài liệu.

---

## 30. Locking

Chọn locking dựa trên mức độ tranh chấp.

### Optimistic locking

Phù hợp khi:

- Xung đột hiếm.
- Muốn phát hiện concurrent update.
- Có thể retry hoặc báo conflict.

Sử dụng:

```text
@Version
```

và column:

```text
version
```

Phải xử lý optimistic lock exception.

Không tự động ghi đè thay đổi của transaction khác.

### Pessimistic locking

Phù hợp khi:

- Xung đột cao.
- Cần khóa row trước khi cập nhật.
- Nghiệp vụ không chấp nhận overselling.
- Transaction ngắn.

Có thể sử dụng:

```text
PESSIMISTIC_WRITE
SELECT ... FOR UPDATE
```

Không dùng pessimistic lock cho mọi query.

Phải:

- Khóa theo thứ tự nhất quán.
- Giữ transaction ngắn.
- Có index cho điều kiện khóa.
- Theo dõi lock wait.
- Xử lý timeout.
- Kiểm tra deadlock.

---

## 31. Quy tắc tồn kho

Tồn kho phải được quản lý theo ProductVariant hoặc SKU.

Không quản lý tồn kho chung ở Product nếu Product có nhiều biến thể.

Mô hình có thể bao gồm:

```text
on_hand_quantity
reserved_quantity
version
```

Tồn kho khả dụng:

```text
available_quantity = on_hand_quantity - reserved_quantity
```

Không lưu `available_quantity` riêng nếu không có cơ chế đảm bảo đồng bộ.

Phải đảm bảo:

```text
on_hand_quantity >= 0
reserved_quantity >= 0
reserved_quantity <= on_hand_quantity
```

Không thực hiện:

```text
Đọc stock
→ Kiểm tra trong Java
→ Update sau
```

mà không có locking hoặc atomic condition vì có thể oversell.

Có thể sử dụng atomic update:

```sql
UPDATE inventories
SET reserved_quantity = reserved_quantity + :quantity,
    version = version + 1
WHERE variant_id = :variantId
  AND on_hand_quantity - reserved_quantity >= :quantity;
```

Sau đó kiểm tra affected rows:

```text
1 row → Thành công
0 row → Không đủ tồn kho hoặc dữ liệu không tồn tại
```

Mọi thay đổi tồn kho phải tạo StockMovement hoặc audit record trong cùng
transaction phù hợp.

Stock movement phải lưu:

- Variant.
- Movement type.
- Quantity.
- Quantity before nếu cần.
- Quantity after nếu cần.
- Reference type.
- Reference ID.
- Actor.
- Reason.
- Idempotency key nếu cần.
- Timestamp.

Không cập nhật tồn kho bằng SQL thủ công mà không có lịch sử.

---

## 32. Stock reservation

Reservation phải có:

- Variant.
- Quantity.
- Order hoặc checkout reference.
- Status.
- Reserved time.
- Expiry time.
- Released time.
- Consumed time.

Reservation phải có trạng thái rõ ràng:

```text
ACTIVE
CONSUMED
RELEASED
EXPIRED
```

Không để reservation tồn tại vô thời hạn.

Scheduled job giải phóng reservation phải:

- Có idempotency.
- Có transaction.
- Không giải phóng reservation đã consumed.
- Không chạy trùng ngoài ý muốn.
- Ghi stock movement hoặc audit phù hợp.

Hủy order phải giải phóng reservation hoặc hoàn tồn kho đúng một lần.

---

## 33. Deadlock

Deadlock có thể xảy ra trong hệ thống transaction đồng thời và phải được xử lý.

Giảm deadlock bằng cách:

- Giữ transaction ngắn.
- Có index đúng.
- Khóa row theo cùng thứ tự.
- Không khóa nhiều row không cần thiết.
- Không chờ network call trong transaction.
- Chia batch quá lớn.
- Tránh update table theo thứ tự khác nhau giữa các use case.

Ví dụ khi khóa nhiều variant:

- Sắp xếp `variantId`.
- Khóa theo thứ tự tăng dần.
- Mọi use case dùng cùng thứ tự.

Khi xảy ra deadlock:

- Một transaction phải rollback.
- Có thể retry giới hạn.
- Retry chỉ áp dụng cho operation an toàn hoặc idempotent.
- Có backoff.
- Có log và metric.
- Không retry vô hạn.

Không che giấu deadlock bằng cách tăng timeout quá lớn.

---

## 34. Idempotency ở database

Các thao tác quan trọng phải có database-level protection chống xử lý lặp.

Ví dụ:

- Checkout.
- Tạo order.
- Payment callback.
- Refund.
- Stock reservation.
- Coupon usage.
- Webhook.
- Email job quan trọng.

Có thể sử dụng:

- Unique idempotency key.
- Unique gateway event ID.
- Unique transaction ID.
- Unique business reference.
- Processed events table.

Không chỉ kiểm tra tồn tại bằng Java rồi insert vì có race condition.

Phải dựa thêm vào unique constraint và transaction.

Khi request lặp lại:

- Trả lại kết quả cũ nếu phù hợp.
- Không tạo giao dịch mới.
- Không trừ tồn kho lần hai.
- Không áp dụng coupon lần hai.
- Không refund lần hai.

---

## 35. Product và ProductVariant

`products` đại diện cho mẫu sản phẩm.

Ví dụ:

```text
iPhone 16 Pro
Samsung Galaxy S25
```

`product_variants` đại diện cho SKU bán cụ thể.

Ví dụ:

```text
iPhone 16 Pro / Black / 256GB
iPhone 16 Pro / White / 512GB
```

ProductVariant phải sở hữu:

- SKU.
- Color.
- Storage.
- RAM nếu nghiệp vụ cần.
- Base price hoặc selling price.
- Status.
- Barcode nếu có.
- Inventory reference.

SKU phải unique.

Không đặt SKU và stock duy nhất ở Product nếu có nhiều biến thể.

Variant combination cần unique constraint phù hợp nếu nghiệp vụ không cho phép
trùng tổ hợp.

Không lưu mọi specification dưới dạng column trong `products` nếu specification
thay đổi theo loại sản phẩm.

Phải phân biệt:

- Product specification.
- Variant attribute.
- Inventory value.

---

## 36. Cart

Mỗi CartItem phải tham chiếu ProductVariant, không chỉ Product.

Phải có unique constraint:

```text
(cart_id, variant_id)
```

để một variant không xuất hiện nhiều dòng trong cùng cart.

Quantity phải:

```text
quantity > 0
```

Cart của Customer phải có owner rõ ràng.

Guest cart phải có identifier an toàn và không lưu raw credential nếu credential
có thể được hash.

Phải xác định:

- Một customer có bao nhiêu active cart.
- Cart cũ được xử lý thế nào.
- Guest cart hết hạn khi nào.
- Merge cart xử lý variant trùng thế nào.

Không xem giá lưu trong cart là nguồn sự thật cuối cùng.

Checkout phải đọc lại giá hiện tại từ backend và lưu snapshot vào OrderItem.

---

## 37. Order và OrderItem

Order phải có business identifier riêng:

```text
order_number
```

và unique constraint.

Order phải lưu snapshot cần thiết:

- Customer information cần thiết.
- Shipping address.
- Billing address nếu có.
- Currency.
- Subtotal.
- Discount amount.
- Shipping fee.
- Tax nếu có.
- Grand total.
- Payment method.
- Order status.

OrderItem phải lưu:

- Product ID hoặc Variant ID tham chiếu khi phù hợp.
- Product name snapshot.
- SKU snapshot.
- Variant attribute snapshot.
- Unit price.
- Quantity.
- Discount.
- Line total.

Không tính lại OrderItem cũ từ Product hiện tại.

Phải có constraint:

```text
quantity > 0
unit_price >= 0
line_total >= 0
total_amount >= 0
```

Order total phải được kiểm tra nhất quán với các thành phần.

Không xóa cứng Order hoặc OrderItem đã phát sinh giao dịch.

---

## 38. Order status history

Mỗi chuyển trạng thái quan trọng phải có lịch sử.

Order status history nên lưu:

- Order ID.
- Previous status.
- New status.
- Actor type.
- Actor ID.
- Reason.
- Timestamp.
- Request ID.
- Metadata cần thiết.

Không chỉ ghi status cuối cùng trong `orders` nếu nghiệp vụ cần truy vết.

History record phải append-only.

Không update history cũ để che giấu quá trình.

---

## 39. Payment

Payment phải tách khỏi Order.

Một Order có thể có:

- Một hoặc nhiều payment attempt.
- Payment thất bại.
- Payment thành công.
- Refund.
- Partial refund nếu nghiệp vụ hỗ trợ.

Payment phải lưu:

- Order ID.
- Payment reference.
- Provider.
- Method.
- Amount.
- Currency.
- Status.
- Gateway transaction ID.
- Created time.
- Paid time.
- Failed time.
- Idempotency key.
- Failure code an toàn nếu có.

Gateway transaction ID phải có unique constraint khi provider đảm bảo unique.

Nếu nhiều provider có thể dùng cùng ID, unique constraint có thể là:

```text
(provider, gateway_transaction_id)
```

Không lưu:

- Card number.
- CVV.
- Raw payment secret.
- Authentication credential.

Payment callback event phải có bảng hoặc cơ chế chống xử lý lặp.

---

## 40. Refund

Refund phải là thực thể hoặc transaction riêng nếu hệ thống hỗ trợ hoàn tiền.

Refund nên lưu:

- Payment ID.
- Refund reference.
- Provider refund ID.
- Amount.
- Currency.
- Status.
- Reason.
- Requested by.
- Approved by nếu cần.
- Created time.
- Completed time.
- Idempotency key.

Không chỉ đổi Payment status thành REFUNDED mà mất lịch sử từng lần refund.

Không cho tổng refund vượt tổng payment đã thành công.

Constraint database và transaction phải hỗ trợ bảo vệ invariant này khi có thể.

---

## 41. Shipment

Shipment phải tách khỏi Order nếu một Order có thể:

- Có nhiều lần giao.
- Giao từng phần.
- Đổi đơn vị vận chuyển.
- Giao lại.

Shipment nên lưu:

- Order ID.
- Carrier.
- Tracking code.
- Status.
- Shipped time.
- Delivered time.
- Failure reason.
- Shipping metadata cần thiết.

Tracking code uniqueness phải xét theo carrier nếu mã chỉ unique trong
phạm vi carrier.

Shipment status history nên append-only khi cần audit.

Không ghi đè tracking history quan trọng.

---

## 42. Review

Review phải tham chiếu:

- Customer.
- Product hoặc ProductVariant theo nghiệp vụ.
- OrderItem hoặc purchase reference nếu cần xác minh đã mua.

Nếu chỉ cho một review trên mỗi lần mua, unique constraint phải phản ánh đúng
nghiệp vụ.

Ví dụ:

```text
(customer_id, order_item_id)
```

Không áp dụng unique constraint `customer_id, product_id` nếu nghiệp vụ cho phép
đánh giá lại sau lần mua khác.

Rating phải có constraint:

```sql
CHECK (rating >= 1 AND rating <= 5)
```

Moderation status phải có lịch sử nếu việc duyệt/xóa review cần audit.

---

## 43. User, Role và Permission

Thông tin chung của tài khoản nằm trong `users`.

Thông tin riêng của nhân viên nằm trong bảng profile riêng nếu nghiệp vụ cần:

```text
staff_profiles
```

Không tạo bảng customer lặp toàn bộ email, phone và tên nếu `users` đã sở hữu
những dữ liệu đó.

Role phải có thể mở rộng.

Với hệ thống lớn, ưu tiên quan hệ nhiều-nhiều:

```text
users
roles
permissions
user_roles
role_permissions
```

Không chỉ lưu một `role_id` trong `users` nếu một người có thể có nhiều role.

Phải có unique constraint:

```text
user_roles(user_id, role_id)
role_permissions(role_id, permission_id)
roles(name)
permissions(code)
```

Không hard delete role đang được sử dụng mà không có migration nghiệp vụ.

Role và permission change phải có audit.

---

## 44. Refresh token và device session

Không lưu raw refresh token.

Lưu:

- Token hash.
- User ID.
- Token family ID.
- Device session ID.
- Issued time.
- Expiry time.
- Revoked time.
- Replaced by token ID.
- Last used time.
- Reuse detected time nếu cần.
- Metadata an toàn.

Token hash phải có unique constraint.

Phải có index phục vụ:

- Tìm token hash.
- Revoke theo user.
- Revoke theo device.
- Revoke theo token family.
- Xóa token hết hạn.

Không lưu access token đầy đủ trong database nếu không có nhu cầu đặc biệt.

Nếu cần denylist, lưu:

- JTI hash hoặc identifier.
- Expiry time.
- Reason.

Denylist record không cần tồn tại sau khi access token hết hạn.

---

## 45. Coupon và promotion

Coupon code phải được normalize theo quy tắc thống nhất.

Coupon code phải có unique constraint phù hợp.

Coupon phải lưu:

- Code.
- Discount type.
- Discount value.
- Minimum order amount.
- Maximum discount.
- Start time.
- End time.
- Usage limit.
- Usage limit per user.
- Status.

Phải có constraint cho giá trị:

```text
discount_value > 0
usage_limit >= 0
start_at < end_at
```

Coupon usage phải có lịch sử riêng.

Không chỉ tăng một counter mà không lưu usage nếu cần audit.

Áp dụng coupon phải transaction-safe.

Không cho concurrent checkout vượt usage limit.

Có thể cần locking, atomic update hoặc unique constraint theo nghiệp vụ.

---

## 46. Flyway migration

Migration được đặt tại:

```text
src/main/resources/db/migration/
```

Sử dụng tên:

```text
V001__create_identity_tables.sql
V002__create_catalog_tables.sql
V003__create_inventory_tables.sql
V004__create_cart_tables.sql
V005__create_order_tables.sql
```

Quy tắc:

- Prefix `V`.
- Version duy nhất.
- Hai dấu gạch dưới giữa version và description.
- Description dùng snake_case.
- Mỗi migration tập trung vào một thay đổi logic.
- Migration được lưu trong version control.
- Migration phải chạy được trên database sạch.
- Migration phải chạy được từ phiên bản trước.

Không dùng tên chung chung:

```text
V5__update.sql
V6__fix.sql
V7__change_table.sql
```

Ưu tiên tên thể hiện rõ:

```text
V006__add_order_status_history.sql
V007__add_unique_gateway_transaction.sql
```

---

## 47. Migration immutability

Không sửa migration đã được áp dụng ở:

- Shared development database.
- Test environment dùng chung.
- Staging.
- Production.

Nếu migration cũ sai:

1. Không sửa âm thầm.
2. Tạo migration mới để sửa.
3. Giữ lịch sử thay đổi.
4. Kiểm tra Flyway validate.
5. Cập nhật tài liệu nếu cần.

Không chạy `flyway repair` chỉ để che checksum mismatch.

Chỉ chạy repair khi:

- Đã hiểu nguyên nhân.
- Có backup.
- Có người phê duyệt.
- Có kế hoạch xác minh.
- Schema thực tế phù hợp với lịch sử mong muốn.

Không xóa record trong `flyway_schema_history` bằng tay.

---

## 48. Repeatable migration

Repeatable migration sử dụng prefix:

```text
R__
```

Ví dụ:

```text
R__product_search_view.sql
```

Chỉ sử dụng repeatable migration cho thành phần phù hợp như:

- View.
- Stored procedure.
- Function.
- Một số reference data có chiến lược rõ ràng.

Không dùng repeatable migration cho table schema cốt lõi nếu việc chạy lại có
thể phá dữ liệu.

Repeatable migration sẽ chạy lại khi checksum thay đổi, vì vậy phải:

- Có tính lặp lại an toàn.
- Không tạo dữ liệu trùng.
- Không phá dữ liệu hiện có.
- Có test.

---

## 49. Schema migration an toàn

Thay đổi schema production phải ưu tiên backward compatibility.

Sử dụng Expand and Contract Pattern:

```text
1. Thêm cấu trúc mới theo cách tương thích.
2. Deploy code có thể đọc/ghi cấu trúc mới.
3. Backfill dữ liệu.
4. Chuyển hoàn toàn sang cấu trúc mới.
5. Xác minh.
6. Xóa cấu trúc cũ trong release sau.
```

Ví dụ đổi tên column:

Không nên thực hiện ngay:

```sql
ALTER TABLE users RENAME COLUMN name TO full_name;
```

nếu phiên bản ứng dụng cũ vẫn đang đọc `name`.

Thay vào đó có thể:

1. Thêm `full_name`.
2. Dual-write nếu cần.
3. Backfill.
4. Chuyển read.
5. Ngừng dùng `name`.
6. Xóa `name` sau.

Không thêm `NOT NULL` vào bảng lớn có dữ liệu cũ nếu chưa:

- Backfill.
- Xác minh không còn NULL.
- Kiểm tra thời gian lock.
- Kiểm tra ảnh hưởng deployment.

---

## 50. Migration phá hủy

Các thao tác nguy hiểm:

- DROP TABLE.
- DROP COLUMN.
- TRUNCATE.
- DELETE diện rộng.
- Đổi kiểu dữ liệu có thể mất dữ liệu.
- Giảm độ dài VARCHAR.
- Giảm precision hoặc scale DECIMAL.
- Thêm NOT NULL không có backfill.
- Đổi collation.
- Đổi primary key.
- Xóa foreign key.
- Xóa unique constraint.

Trước khi thực hiện phải có:

1. Phân tích dữ liệu hiện tại.
2. Phân tích code sử dụng.
3. Backup.
4. Restore plan.
5. Rollback hoặc forward-fix plan.
6. Test trên dữ liệu gần thực tế.
7. Maintenance strategy nếu cần.
8. Phê duyệt.

Không thực hiện migration phá hủy trong cùng release đầu tiên thay đổi code nếu
có thể dùng expand-contract.

---

## 51. MySQL DDL và transaction

Không giả định mọi DDL của MySQL có thể rollback giống DML.

Migration phải được kiểm tra riêng trên MySQL thật.

Không dựa vào transaction annotation của application để rollback:

- ALTER TABLE.
- DROP TABLE.
- RENAME TABLE.
- Một số DDL khác.

Trước DDL lớn phải đánh giá:

- Metadata lock.
- Table rebuild.
- Thời gian thực thi.
- Disk usage.
- Replication lag.
- Ảnh hưởng query đang chạy.
- Khả năng rollback.

Không chạy ALTER TABLE lớn tại giờ cao điểm nếu chưa có chiến lược.

---

## 52. Data migration và backfill

Schema migration và data backfill lớn nên được tách khi phù hợp.

Backfill phải:

- Có thể resume.
- Có batch size.
- Có progress.
- Có log.
- Có giới hạn tải.
- Có idempotency.
- Không giữ transaction quá lớn.
- Không khóa toàn bộ bảng lâu.
- Có xác minh kết quả.

Không update hàng triệu row trong một transaction nếu có thể chia batch.

Sau backfill phải kiểm tra:

- Số row.
- Số NULL còn lại.
- Giá trị không hợp lệ.
- Tổng tiền hoặc quantity nếu liên quan.
- Constraint mới có thể áp dụng.

---

## 53. Seed data

Phân biệt:

- Reference data production.
- Development sample data.
- Test fixture.

Reference data có thể gồm:

- Role mặc định.
- Permission mặc định.
- Một số trạng thái hoặc cấu hình nền tảng.

Reference data migration phải:

- Xác định rõ ID hoặc natural key.
- Có unique constraint.
- Không tạo trùng.
- Có thể chạy nhất quán.
- Không chứa secret.

Development seed không được chạy trong production.

Không đưa:

- Password production.
- Access token.
- API key.
- Dữ liệu cá nhân thật.

vào seed file.

Tài khoản development phải được tạo bằng cách an toàn và không tồn tại trong
production migration.

---

## 54. JPA schema management

Khi Flyway quản lý database, cấu hình JPA nên dùng:

```text
spring.jpa.hibernate.ddl-auto=validate
```

cho môi trường cần đảm bảo schema khớp Entity.

Không sử dụng trong production:

```text
create
create-drop
update
```

`ddl-auto=update` không thay thế migration.

Entity mapping phải khớp migration về:

- Table name.
- Column name.
- Type.
- Length.
- Precision.
- Scale.
- Nullability.
- Unique constraint.
- Relationship.

Không dựa hoàn toàn vào annotation để mô tả database nếu migration không đồng bộ.

---

## 55. JPA mapping

Phải khai báo rõ mapping quan trọng:

```text
@Table
@Column
@JoinColumn
@Enumerated(EnumType.STRING)
@Version
```

Không sử dụng:

```text
EnumType.ORDINAL
```

cho business status vì thay đổi thứ tự enum có thể làm sai dữ liệu.

Không sử dụng `columnDefinition` tùy tiện để ép schema nếu migration đã quản lý DDL.

Relationship mặc định ưu tiên LAZY.

Không dùng EAGER để che N+1.

Không dùng `CascadeType.ALL` theo thói quen.

Không trả Entity ra ngoài transaction rồi truy cập lazy relationship.

Không lưu Entity từ module khác chỉ để tránh gọi service contract.

Không dùng `@ElementCollection` cho collection lớn hoặc dữ liệu có lifecycle
phức tạp.

---

## 56. Connection pool

Sử dụng connection pool được Spring Boot hỗ trợ, thông thường là HikariCP.

Pool size không được đặt quá lớn theo cảm tính.

Phải dựa trên:

- Database max connections.
- Số application instance.
- Query duration.
- Request concurrency.
- Background job.
- Reporting workload.

Tổng connection tiềm năng:

```text
pool_size_per_instance × number_of_instances
```

không được vượt khả năng database.

Phải cấu hình và theo dõi:

- Maximum pool size.
- Minimum idle nếu cần.
- Connection timeout.
- Idle timeout.
- Max lifetime.
- Leak detection trong môi trường phù hợp.
- Pool utilization.

Không giữ connection khi thực hiện network call dài.

---

## 57. Query timeout

Query có nguy cơ chạy lâu phải có timeout phù hợp.

Không để request giữ connection vô thời hạn.

Phải xem xét timeout cho:

- Search phức tạp.
- Admin report.
- Export.
- Bulk operation.
- External reconciliation job.

Timeout phải:

- Đủ cho query hợp lệ.
- Không quá lớn để che query chậm.
- Có logging.
- Có metric.
- Có error handling.

Không tự động retry mọi query timeout.

Trước tiên phải xác định:

- Query plan.
- Index.
- Lock wait.
- Database load.
- Data volume.

---

## 58. EXPLAIN và query plan

Query quan trọng phải được kiểm tra bằng:

```text
EXPLAIN
```

hoặc:

```text
EXPLAIN ANALYZE
```

khi phù hợp và an toàn.

Phải kiểm tra:

- Index được chọn.
- Rows examined.
- Join order.
- Full table scan.
- Sort.
- Temporary table.
- Range scan.
- Actual execution time.
- Cardinality estimate.

Không dùng `FORCE INDEX` làm giải pháp đầu tiên.

Trước tiên phải:

1. Kiểm tra query.
2. Kiểm tra statistics.
3. Kiểm tra index.
4. Kiểm tra dữ liệu.
5. Kiểm tra collation và type.
6. Kiểm tra function trên indexed column.

Execution plan phải được kiểm tra lại khi dữ liệu tăng đáng kể.

---

## 59. Database account và permission

Tách database credential theo trách nhiệm.

### Application account

Chỉ nên có quyền cần thiết:

- SELECT.
- INSERT.
- UPDATE.
- DELETE khi nghiệp vụ cần.

Không cấp mặc định:

- CREATE USER.
- GRANT.
- DROP DATABASE.
- SUPER.
- FILE.
- PROCESS.
- Toàn quyền quản trị.

### Migration account

Có thể có quyền DDL cần thiết:

- CREATE.
- ALTER.
- INDEX.
- DROP khi migration được phê duyệt.
- REFERENCES.

Migration credential không được sử dụng làm runtime application credential.

### Read-only account

Dùng cho:

- Reporting.
- Monitoring.
- Một số tác vụ phân tích.

Không sử dụng root account cho ứng dụng.

---

## 60. Production database operation

Không chỉnh sửa production database thủ công nếu không có quy trình.

Nếu buộc phải thực hiện emergency change:

1. Ghi rõ lý do.
2. Xác định câu lệnh.
3. Review.
4. Backup.
5. Giới hạn phạm vi.
6. Ghi audit.
7. Xác minh.
8. Tạo migration tương ứng để loại bỏ schema drift.
9. Cập nhật incident record.

Không chạy trực tiếp:

- DELETE không có WHERE.
- UPDATE không có WHERE.
- TRUNCATE.
- DROP.
- ALTER lớn.

mà chưa kiểm tra.

Nên chạy SELECT tương ứng trước UPDATE hoặc DELETE để xác định row bị ảnh hưởng.

---

## 61. Backup và restore

Production database phải có backup phù hợp.

Phải xác định:

- RPO.
- RTO.
- Full backup.
- Incremental hoặc binary log strategy nếu cần.
- Backup retention.
- Backup encryption.
- Backup access control.
- Backup location.
- Restore procedure.

Backup không được xem là hợp lệ nếu chưa từng thử restore.

Phải thực hiện restore test định kỳ.

Trước migration rủi ro cao:

- Xác minh backup gần nhất.
- Xác minh khả năng restore.
- Xác định thời gian restore.
- Xác định dữ liệu có thể mất theo RPO.

Không lưu backup production ở vị trí public.

---

## 62. Data retention và xóa dữ liệu

Mỗi nhóm dữ liệu phải có retention policy.

Phải phân biệt:

- Dữ liệu tài khoản.
- Dữ liệu giao dịch.
- Audit log.
- Authentication token.
- Reset token.
- Verification token.
- Cart hết hạn.
- Guest session.
- Payment callback.
- File upload.
- Notification.

Dữ liệu token hết hạn phải có cleanup job.

Không giữ refresh token, reset token hoặc verification token vô thời hạn.

Xóa tài khoản phải xem xét:

- Nghĩa vụ giữ lịch sử Order.
- Payment.
- Refund.
- Audit.
- Hỗ trợ khách hàng.
- Yêu cầu pháp lý.
- Anonymization.

Không cascade delete toàn bộ Order khi người dùng xóa tài khoản.

Có thể anonymize dữ liệu cá nhân nhưng giữ dữ liệu giao dịch cần thiết.

---

## 63. Database monitoring

Phải theo dõi:

- Connection pool usage.
- Active connections.
- Slow query.
- Query latency.
- Lock wait.
- Deadlock.
- Transaction duration.
- Disk usage.
- Buffer pool.
- Replication lag nếu có replica.
- Failed migration.
- Database error rate.
- Rows examined.
- Backup status.
- Restore test status.

Alert nên có cho:

- Connection gần cạn.
- Disk gần đầy.
- Deadlock tăng bất thường.
- Slow query tăng.
- Replication lag cao.
- Backup thất bại.
- Migration thất bại.

Không chỉ theo dõi application response time mà bỏ qua database.

---

## 64. Database testing

Phải kiểm thử migration trên MySQL tương thích với production.

Ưu tiên Testcontainers MySQL cho integration test.

Không chỉ dùng H2 để xác minh:

- MySQL syntax.
- Collation.
- JSON.
- Locking.
- Index.
- Constraint.
- Transaction isolation.
- Flyway migration.

Database test phải bao gồm:

- Tạo schema từ database sạch.
- Chạy toàn bộ migration.
- Upgrade từ phiên bản trước.
- Flyway validate.
- Constraint.
- Foreign key.
- Unique constraint.
- Repository query.
- Pagination.
- Locking.
- Concurrent stock update.
- Deadlock retry nếu có.
- Payment idempotency.
- Refresh token uniqueness.
- Soft delete behavior.
- Data backfill.

Migration test phải thất bại nếu schema và Entity không đồng nhất.

---

## 65. Schema review checklist

### Table

- [ ] Tên table đúng quy ước.
- [ ] Sử dụng InnoDB.
- [ ] Sử dụng utf8mb4.
- [ ] Có primary key.
- [ ] Không dùng tên SQL reserved.
- [ ] Có audit column phù hợp.

### Column

- [ ] Kiểu dữ liệu phù hợp.
- [ ] Length phù hợp.
- [ ] Precision và scale phù hợp.
- [ ] Nullability rõ ràng.
- [ ] Default có ý nghĩa.
- [ ] Timezone được xác định.
- [ ] Không dùng FLOAT/DOUBLE cho tiền.

### Constraint

- [ ] Có foreign key.
- [ ] Có unique constraint.
- [ ] Có check constraint phù hợp.
- [ ] Delete behavior được xác định.
- [ ] Constraint có tên rõ ràng.
- [ ] Không chỉ dựa vào Java validation.

### Index

- [ ] Foreign key có index phù hợp.
- [ ] Query chính có index.
- [ ] Composite index đúng thứ tự.
- [ ] Không có index trùng.
- [ ] Không index field không cần thiết.
- [ ] Execution plan đã được kiểm tra khi cần.

### Migration

- [ ] Tên file Flyway hợp lệ.
- [ ] Version duy nhất.
- [ ] Không sửa migration đã chạy.
- [ ] Có backward compatibility.
- [ ] Có backfill plan.
- [ ] Có rollback hoặc forward-fix plan.
- [ ] Đã test trên MySQL.
- [ ] Flyway validate thành công.

### Transaction

- [ ] Transaction boundary đúng.
- [ ] Không network call dài trong transaction.
- [ ] Locking strategy rõ.
- [ ] Có idempotency.
- [ ] Có deadlock handling nếu cần.
- [ ] Tồn kho không thể âm.
- [ ] Payment không thể xử lý lặp.

### JPA

- [ ] `ddl-auto` không dùng update ở production.
- [ ] Entity mapping khớp migration.
- [ ] Enum dùng STRING.
- [ ] Relationship không EAGER tùy tiện.
- [ ] Không Cascade ALL tùy tiện.
- [ ] Open Session in View được kiểm soát.
- [ ] Query không gây N+1 ngoài ý muốn.

### Vận hành

- [ ] Database account đúng quyền.
- [ ] Secret không commit.
- [ ] Backup hoạt động.
- [ ] Restore đã được kiểm tra.
- [ ] Monitoring được cấu hình.
- [ ] Retention policy đã xác định.

---

## 66. Hành vi bị cấm

KHÔNG ĐƯỢC:

- Dùng `ddl-auto=update` trong production.
- Sửa migration đã áp dụng.
- Xóa Flyway history bằng tay.
- Dùng `flyway repair` để che lỗi.
- Chạy SQL production không qua quy trình.
- Dùng root account cho application.
- Lưu password hoặc token thô.
- Lưu ảnh Base64 trong TEXT.
- Dùng FLOAT hoặc DOUBLE cho tiền.
- Quản lý stock ở Product khi có ProductVariant.
- Cho tồn kho âm.
- Trừ tồn kho không có transaction.
- Trừ tồn kho không có lịch sử.
- Xử lý payment callback không có unique event ID.
- Chỉ kiểm tra uniqueness ở Java.
- Dùng EAGER để sửa N+1.
- Dùng CascadeType.ALL theo thói quen.
- Trả Entity trực tiếp.
- Dùng `SELECT *` không cần thiết.
- Dùng query không giới hạn trên bảng lớn.
- Nối input vào SQL.
- Tạo index không dựa trên query.
- DROP dữ liệu không có backup.
- Chạy backfill lớn trong một transaction.
- Dùng production data thật tùy tiện trong test.
- Tuyên bố migration an toàn khi chưa test trên MySQL.

---

## 67. Báo cáo thay đổi database

Mọi thay đổi database phải báo cáo:

```text
Mục tiêu:
Migration file:
Table bị ảnh hưởng:
Column bị ảnh hưởng:
Constraint bị ảnh hưởng:
Index bị ảnh hưởng:
Dữ liệu hiện tại:
Backward compatibility:
Backfill:
Locking risk:
Data-loss risk:
Rollback hoặc forward-fix:
Test đã chạy:
Kết quả Flyway validate:
Kết quả integration test:
Vấn đề còn lại:
```

Không báo cáo migration hoàn thành nếu chưa chạy kiểm tra phù hợp.

---

## 68. Cách báo cáo ngoại lệ

Nếu cần vi phạm Database Rule, phải ghi:

```text
Database Rule:
Lý do nghiệp vụ:
Lý do kỹ thuật:
Table và column bị ảnh hưởng:
Số lượng dữ liệu ước tính:
Rủi ro mất dữ liệu:
Rủi ro lock:
Rủi ro hiệu năng:
Biện pháp bù:
Backup:
Rollback hoặc forward-fix:
Test bảo vệ:
Người phê duyệt:
Thời hạn ngoại lệ:
```

Không được âm thầm bỏ constraint, index hoặc foreign key để vượt qua lỗi.

Ngoại lệ phải được loại bỏ khi nguyên nhân không còn tồn tại.
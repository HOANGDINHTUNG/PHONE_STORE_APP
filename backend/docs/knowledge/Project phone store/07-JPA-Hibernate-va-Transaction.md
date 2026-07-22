---
title: JPA Hibernate và Transaction
tags: [jpa, hibernate, transaction, locking]
status: verified
verified_on: 2026-07-21
sources:
  - https://docs.spring.io/spring-data/jpa/reference/index.html
---

# JPA, Hibernate và Transaction

## 1. Mental model

- JPA là specification; Hibernate là một implementation phổ biến.
- Entity đang managed nằm trong persistence context; thay đổi có thể được dirty checking và flush thành SQL.
- `save()` không đồng nghĩa SQL lập tức; flush và commit là thời điểm khác nhau.
- Persistence context là identity map, không phải cache ứng dụng phân tán.
- Mapping object không làm mất nhu cầu hiểu SQL, index và transaction.

## 2. Entity design

- Entity cần identity và lifecycle rõ.
- Quan hệ mặc định nên LAZY theo use case; đừng EAGER để “hết LazyInitializationException”.
- Không serialize entity trực tiếp ra JSON.
- Không đưa lazy collection vào `toString`.
- `equals/hashCode` không dựa vào mutable field/collection; chiến lược với generated ID phải được thiết kế và test.
- Bidirectional association chỉ dùng khi cả hai hướng thực sự cần; helper method giữ hai phía đồng bộ.
- Cascade và `orphanRemoval` là lifecycle semantics, không phải cách “tiện tay lưu hết”.

## 3. Transaction boundary

Đặt `@Transactional` ở application/service method đại diện use case. Controller không nên sở hữu transaction; repository method riêng lẻ không đủ để bảo đảm atomicity của nhiều bước.

```java
@Transactional
public OrderId placeOrder(PlaceOrderCommand command) {
    Inventory inventory = inventoryRepository.lockBySku(command.sku());
    inventory.reserve(command.quantity());
    Order order = Order.place(command, inventory.currentPrice());
    orderRepository.save(order);
    return order.id();
}
```

Không gọi HTTP/payment/file storage chậm bên trong DB transaction nếu có thể thiết kế lại; lock sẽ bị giữ trong thời gian chờ.

## 4. Những điều `@Transactional` dễ bị hiểu sai

- Spring thường áp dụng qua proxy; self-invocation trong cùng bean có thể bỏ qua interceptor.
- Private method không phải transaction boundary qua proxy thông thường.
- Mặc định rollback thường cho unchecked exception; checked exception cần policy rõ.
- `readOnly=true` là hint/optimization và semantic intent, không phải hàng rào bảo mật cấm mọi write ở mọi DB/provider.
- Bắt exception rồi không rethrow có thể làm transaction commit ngoài ý muốn.
- Async/new thread không tự mang transaction context cũ.

Nguồn: [Spring Data JPA Transactionality](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html).

## 5. Propagation

| Propagation | Ý nghĩa ngắn | Cảnh báo |
|---|---|---|
| REQUIRED | Tham gia transaction có sẵn, không có thì tạo | Mặc định tốt cho use case |
| REQUIRES_NEW | Suspend transaction ngoài, mở transaction mới | Tốn connection; “audit luôn commit” có thể tạo state khó hiểu |
| MANDATORY | Bắt buộc caller đã có transaction | Dùng để enforce boundary nội bộ |
| NOT_SUPPORTED | Chạy không transaction | Cẩn thận consistency |

Chỉ đổi propagation khi hiểu outcome nếu transaction trong/ngoài fail độc lập.

## 6. Isolation và anomaly

Isolation phải chọn theo invariant và database behavior, không theo bảng “càng cao càng tốt”. Cần hiểu dirty read, non-repeatable read, phantom, lost update/write skew và MVCC. Isolation cao hơn có thể giảm concurrency hoặc tăng abort/deadlock.

Ngay cả isolation mạnh cũng không thay thế unique/check constraint hoặc explicit locking cho invariant cụ thể.

## 7. Optimistic locking

```java
@Version
private long version;
```

Khi update cùng version, một transaction thành công và transaction còn lại nhận conflict. Map conflict sang `409` hoặc `412` tùy contract. Chỉ retry tự động khi command idempotent và business semantics cho phép; nếu người dùng đang sửa form, thường nên báo conflict.

## 8. Pessimistic locking và atomic update

Pessimistic lock phù hợp khi phải serialize resource ngắn hạn. Cần:

- index để lock đúng ít row;
- transaction ngắn;
- lock order nhất quán;
- timeout;
- deadlock retry có giới hạn.

Với counter/stock đơn giản, atomic conditional update thường hiệu quả hơn load + lock:

```sql
UPDATE products
SET stock = stock - :qty
WHERE id = :id AND stock >= :qty;
```

Affected rows bằng 0 nghĩa là không tồn tại hoặc không đủ stock; phân biệt nếu contract cần.

## 9. N+1 và fetching

N+1: một query lấy N parent rồi N query lấy child. Phát hiện bằng SQL log trong dev, Hibernate statistics, datasource proxy/APM và integration performance test.

Giải pháp theo use case:

- projection DTO;
- fetch join cho một số quan hệ;
- `@EntityGraph`;
- batch fetching;
- query riêng theo IDs;
- thiết kế response nhỏ hơn.

Không fetch join nhiều bag/to-many rồi paginate một cách mù quáng; có thể nhân row, duplicate object và pagination in-memory/sai.

Nguồn: [Spring Data JPA Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html).

## 10. Pagination và count query

`Page<T>` thường chạy query data + count; count trên join phức tạp có thể đắt. Dùng `Slice<T>` nếu chỉ cần biết còn trang sau, hoặc keyset/cursor cho bảng lớn. Tạo count query riêng khi cần.

## 11. Bulk update/delete

JPQL/SQL bulk bypass dirty checking và entity lifecycle; persistence context có thể giữ state cũ. Sau bulk operation, clear/refresh theo thiết kế. Audit/version/callback có thể không chạy như entity update thường.

## 12. OSIV

Open Session in View cho phép lazy load trong web rendering nhưng dễ che N+1 và kéo persistence context qua boundary. Với REST API, mặc định nên cân nhắc tắt OSIV và fetch/map DTO trong transaction rõ ràng; xác minh query bằng test.

```properties
spring.jpa.open-in-view=false
```

## 13. Repository design

- Repository method theo ngôn ngữ use case, không tạo hàng trăm derived method khó đọc.
- Projection cho list/read model.
- `exists`/count không thay constraint.
- Query phức tạp dùng explicit JPQL/native/custom repository và test trên MySQL thật.
- Không trả `Stream`/lazy result ra ngoài transaction mà không quản lý lifecycle.

## 14. Audit

Spring Data JPA hỗ trợ created/modified time và actor, nhưng business audit quan trọng cần event/audit record bất biến hơn. Không cho client gửi `createdBy`, `approvedBy` làm nguồn sự thật. Nguồn: [Spring Data Auditing](https://docs.spring.io/spring-data/jpa/reference/auditing.html).

## 15. Test bắt buộc

- mapping + constraint trên MySQL Testcontainers;
- unique race/concurrent update;
- optimistic lock conflict;
- rollback khi giữa use case lỗi;
- N+1/query count cho endpoint quan trọng;
- timezone/decimal;
- migration từ version gần production.


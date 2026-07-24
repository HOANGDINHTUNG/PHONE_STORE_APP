---
title: Design Patterns và Anti-Patterns trong Spring Boot
tags: [design-patterns, anti-patterns, spring-boot, architecture]
status: verified
verified_on: 2026-07-21
sources:
  - https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
  - https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html
  - https://docs.spring.io/spring-modulith/reference/
---

# Design Patterns và Anti-Patterns trong Spring Boot

## 1. Pattern là công cụ theo lực thiết kế

Không thêm pattern để “trông enterprise”. Trước khi áp dụng phải chỉ ra:

- phần nào thay đổi thường xuyên;
- dependency nào cần đảo chiều;
- invariant/transaction nào cần bảo vệ;
- failure mode nào cần cô lập;
- chi phí abstraction, debug và onboarding.

## 2. Constructor injection

Constructor injection làm dependency bắt buộc rõ, hỗ trợ immutable field và test không cần container.

```java
@Service
final class PlaceOrderHandler {
    private final OrderRepository orders;
    private final InventoryPort inventory;

    PlaceOrderHandler(OrderRepository orders, InventoryPort inventory) {
        this.orders = orders;
        this.inventory = inventory;
    }
}
```

Nếu constructor có quá nhiều dependency, coi đó là tín hiệu class có quá nhiều trách nhiệm; không che bằng field injection.

## 3. Strategy thay cho switch phân tán

Dùng khi có nhiều thuật toán cùng contract và cần chọn theo loại:

```java
interface PaymentStrategy {
    PaymentMethod supports();
    PaymentResult execute(PaymentCommand command);
}
```

Registry phải fail startup khi duplicate/missing key quan trọng. Không biến mọi `if` nhỏ thành hierarchy.

## 4. Factory cho construction có invariant

Factory phù hợp khi tạo aggregate cần validation, generated ID, state ban đầu và domain event. Đừng để controller tự lắp entity rồi gọi setter.

```java
Order order = Order.place(customerId, pricedItems, reservationId, now);
```

Repository hydrate object từ persistence không nhất thiết đi qua cùng public factory; tách reconstitution nếu cần.

## 5. Adapter/Port ở external boundary

Đặt interface tại phía use case cần capability, implementation ở infrastructure:

```text
application.PaymentGateway (port)
infrastructure.payment.AcmePaymentClient (adapter)
```

Không tạo interface cho mọi class chỉ để “loose coupling”. Interface có giá trị khi có boundary, nhiều implementation thực hoặc test seam quan trọng.

## 6. Decorator cho cross-cutting có semantics rõ

Metrics, retry, cache, audit có thể bọc port bằng decorator. Ưu điểm: thứ tự explicit và test được. Nhưng transaction/security thường nên dùng framework interception đúng chuẩn; không tự tạo proxy framework thứ hai.

## 7. Specification cho rule kết hợp

Specification hữu ích khi business predicate cần compose và đặt tên. Không trộn domain specification với JPA criteria nếu làm domain phụ thuộc persistence.

```java
Specification<Order> cancellable = unpaid.or(paidWithinGracePeriod);
```

Với query filter động, dùng query object/criteria riêng. Domain rule và database predicate có thể cùng tên nhưng cần test equivalence nếu implement hai lần.

## 8. Command/Query separation

- Command thay đổi state, có authorization/invariant/idempotency.
- Query đọc projection, có pagination/filter/consistency requirement.

Không bắt buộc CQRS hai database. Tách model vật lý chỉ khi read/write workload và consistency trade-off chứng minh cần.

## 9. Domain event và integration event

Domain event diễn đạt điều đã xảy ra trong boundary. Integration event là contract công khai, ổn định, có schema/version và delivery semantics. Không publish JPA entity làm event.

Publish sau commit hoặc qua outbox; event phát trong transaction nhưng gửi broker trực tiếp có dual-write risk.

## 10. State machine

Phù hợp cho order/payment/shipment có transition nghiêm ngặt. Mỗi transition chứa:

- source/target state;
- actor/permission;
- guard;
- side effect;
- idempotency;
- audit;
- behavior khi duplicate/out-of-order.

Không cho `setStatus(request.status())` vượt qua transition method.

## 11. Saga/process manager

Dùng cho workflow qua nhiều transaction/service. Process manager lưu state, correlation ID, command đã gửi, timeout và compensation/reconciliation. Compensation không phải database rollback; nó là business action riêng và cũng có thể thất bại.

Không dùng distributed transaction như phản xạ mặc định để che service boundary không tốt.

## 12. Repository pattern đúng mức

Repository theo aggregate/capability, không phải wrapper một-một cho mọi DAO method. Tránh generic repository toàn hệ thống vì:

- làm mất query intent;
- cho phép operation không hợp lệ;
- che fetch/lock semantics;
- kéo persistence concern vào domain.

Tên như `findPendingForReconciliation(limit, lockMode)` truyền ý định tốt hơn `findByStatus` dùng khắp nơi.

## 13. Anti-pattern: God Service

Dấu hiệu:

- hàng chục dependency;
- vừa validate, map, query, call remote, gửi mail;
- transaction phủ network call;
- nhiều boolean điều khiển flow;
- test chỉ làm được bằng mock graph lớn.

Tách theo use case và boundary, không tách thành helper vô nghĩa.

## 14. Anti-pattern: Anemic domain tuyệt đối

CRUD đơn giản có thể dùng transaction script. Nhưng invariant quan trọng không nên nằm rải ở controller/service/job/consumer. Đưa state transition và validation cốt lõi gần state sở hữu nó.

Ngược lại, không nhét repository, HTTP client hay Spring annotation vào entity để đạt “rich domain”.

## 15. Anti-pattern: Common/Utils dumping ground

Chỉ share primitive thật sự ổn định và không thuộc domain nào. Nếu `common` chứa `OrderUtils`, `ProductServiceHelper`, entity base phức tạp hoặc DTO dùng chung, boundary đã bị xóa.

Ưu tiên duplicate nhỏ có chủ đích hơn coupling sai; hợp nhất khi đã hiểu abstraction chung.

## 16. Anti-pattern: self-invocation qua proxy

Gọi method `@Transactional`, `@Async`, `@Cacheable` từ method khác trong cùng instance thường bypass proxy interception. Giải pháp:

- đặt boundary ở bean khác có trách nhiệm thật;
- hoặc dùng programmatic API phù hợp;
- không tự inject `self` như mặc định.

Xem thêm [[15-Spring-Internals-AOP-va-Request-Lifecycle]].

## 17. Anti-pattern: exception catch-all

`catch (Exception) { return default; }` làm mất transaction rollback/error taxonomy và che data corruption. Chỉ bắt lỗi khi có policy cụ thể: translate, compensate, retry hoặc enrich rồi rethrow.

Không biến mọi exception thành HTTP 500 chung mà mất conflict/validation/auth semantics.

## 18. Anti-pattern: DTO/entity mapping máy móc

Mapping tool không hiểu invariant, lazy loading, authorization hoặc field allowlist. Dùng generated mapper cho mapping cấu trúc ổn định, nhưng business construction phải đi qua factory/method bảo vệ invariant.

Không có request generic cập nhật tùy field cho entity nhạy cảm.

## 19. Anti-pattern: premature microservice/CQRS/event sourcing

Mỗi lựa chọn thêm network, deployment, versioning, observability và consistency cost. Chỉ áp dụng khi có driver như ownership độc lập, scale profile, isolation, audit/history/rebuild requirement rõ và đội ngũ vận hành được.

## 20. Pattern decision record

```markdown
Context/lực thiết kế:
Các lựa chọn:
Pattern chọn:
Invariant/failure model:
Chi phí mới:
Cách test:
Metric xác nhận:
Điều kiện bỏ/thay pattern:
```

## 21. Review checklist

- Pattern giải quyết vấn đề đã nêu, không chỉ thêm lớp.
- Dependency direction và ownership rõ.
- Transaction/async/proxy boundary hoạt động như mong đợi.
- External contract không lộ entity/vendor type.
- Failure, duplicate, timeout và compensation có semantics.
- Có test ở abstraction quan trọng, không mock toàn bộ nội bộ.


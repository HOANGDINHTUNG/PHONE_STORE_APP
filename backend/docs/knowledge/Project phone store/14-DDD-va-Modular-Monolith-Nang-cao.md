---
title: Domain-Driven Design và Modular Monolith nâng cao
tags: [ddd, modular-monolith, spring-modulith, architecture]
status: verified
verified_on: 2026-07-21
applies_to: [Spring Boot 3.5.x, Spring Boot 4.1.x]
sources:
  - https://docs.spring.io/spring-modulith/reference/
---

# Domain-Driven Design và Modular Monolith nâng cao

## 1. DDD giải quyết vấn đề gì?

DDD hữu ích khi độ phức tạp chính nằm ở business rule, state transition và ngôn ngữ giữa chuyên gia nghiệp vụ với developer. DDD không phải một bộ folder và không đồng nghĩa phải có microservices.

Ba câu hỏi cốt lõi:

1. Mô hình nào phản ánh đúng nghiệp vụ hiện tại?
2. Invariant nào phải được bảo vệ trong một consistency boundary?
3. Ranh giới nào cho phép các phần hệ thống thay đổi tương đối độc lập?

Nếu hệ thống chỉ CRUD đơn giản, dùng toàn bộ tactical patterns có thể tạo ceremony lớn hơn giá trị.

## 2. Problem space và solution space

- **Domain:** lĩnh vực hoạt động, ví dụ bán lẻ điện thoại.
- **Subdomain:** phần bài toán như Catalog, Ordering, Payment, Fulfillment, Identity.
- **Core domain:** phần tạo lợi thế/giá trị riêng, cần đầu tư mô hình tốt nhất.
- **Supporting subdomain:** cần cho hoạt động nhưng không phải lợi thế chính.
- **Generic subdomain:** bài toán phổ biến có thể mua/tái sử dụng như email, authentication provider.
- **Bounded context:** ranh giới nơi một model và ubiquitous language có nghĩa nhất quán.

Không ép một `Product` duy nhất dùng cho mọi context. Catalog nhìn Product như nội dung bán hàng; Inventory nhìn SKU và số lượng; Ordering cần snapshot tên/giá; Shipment cần kích thước/khối lượng.

## 3. Ubiquitous Language

Ngôn ngữ phải xuất hiện nhất quán trong yêu cầu, code, test và API nội bộ.

Không tốt:

```text
processData(), handleItem(), status=1, managerService.doAction()
```

Tốt hơn:

```text
reserveStock(), placeOrder(), approveKyc(), capturePayment()
OrderStatus.AWAITING_PAYMENT
```

Nếu business và developer dùng cùng một từ nhưng khác nghĩa, tách context hoặc định nghĩa glossary; đừng giải quyết bằng comment rải rác.

## 4. Entity, Value Object và Aggregate

### Entity

Có identity xuyên suốt lifecycle. Hai entity không giống nhau chỉ vì mọi field bằng nhau.

### Value Object

Được nhận diện bởi giá trị, thường immutable và tự validate:

```java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currency);
        if (amount.scale() > currency.getDefaultFractionDigits()) {
            throw new IllegalArgumentException("Invalid monetary scale");
        }
    }
}
```

### Aggregate

Nhóm entity/value object được thay đổi qua một aggregate root, là consistency boundary. Aggregate không phải “mọi bảng có foreign key nối với nhau”.

Quy tắc thiết kế:

- aggregate nhỏ, tải và khóa vừa đủ;
- bảo vệ invariant cần atomic consistency;
- tham chiếu aggregate khác bằng ID, không nhất thiết object graph lớn;
- một transaction thường thay đổi một aggregate; nếu nhiều aggregate, phải nêu lý do hoặc dùng event/process;
- repository theo aggregate root, không repository cho từng child entity nếu child không có lifecycle độc lập.

## 5. Ví dụ aggregate Order

Invariant:

- đơn phải có ít nhất một dòng hàng;
- quantity dương;
- total bằng tổng snapshot line;
- chỉ `PENDING_PAYMENT` mới được thanh toán;
- chỉ đơn chưa giao mới được hủy theo policy;
- state transition không được nhảy tùy ý.

```java
public final class Order {
    public void markPaid(PaymentReference reference, Instant paidAt) {
        if (status != OrderStatus.PENDING_PAYMENT) {
            throw new InvalidOrderTransition(status, OrderStatus.PAID);
        }
        this.paymentReference = Objects.requireNonNull(reference);
        this.paidAt = Objects.requireNonNull(paidAt);
        this.status = OrderStatus.PAID;
        domainEvents.add(new OrderPaid(id, reference, paidAt));
    }
}
```

Không cho setter công khai `setStatus(PAID)` vì nó bỏ qua precondition và audit data.

## 6. Domain Service và Application Service

**Domain service** chứa rule không thuộc tự nhiên về một entity/value object, vẫn dùng ngôn ngữ domain và không điều phối HTTP/DB/vendor.

**Application service**:

- xác thực use-case input/permission theo resource;
- tải aggregate;
- gọi domain behavior;
- quản lý transaction;
- persist và publish outcome qua port.

Application service không nên chứa hàng trăm `if` mô phỏng domain model thiếu hành vi.

## 7. Domain Event

Domain event là sự kiện quá khứ có ý nghĩa: `OrderPlaced`, `PaymentCaptured`, không phải command `CapturePayment`.

Một event tốt có:

- event ID;
- aggregate ID/type/version;
- occurred-at UTC;
- schema version;
- payload tối thiểu đủ cho consumer;
- correlation/causation ID khi đi qua process.

Event nội bộ cùng process và integration event ra bên ngoài là hai contract khác nhau. Không phát JPA entity làm event.

## 8. Context mapping

| Quan hệ | Dùng khi | Rủi ro |
|---|---|---|
| Shared Kernel | Hai context cùng một phần model nhỏ | Coupling cao, đổi phải phối hợp |
| Customer/Supplier | Upstream phục vụ nhu cầu downstream | Cần contract và ưu tiên rõ |
| Conformist | Downstream chấp nhận model upstream | Model ngoại lai tràn vào domain |
| Anti-Corruption Layer | Chuyển model bên ngoài sang model nội bộ | Thêm mapping nhưng bảo vệ ngôn ngữ |
| Published Language | Contract chung như event/OpenAPI schema | Cần versioning/governance |

Payment provider DTO không nên lan vào Order domain. Dùng adapter/ACL chuyển `VendorPaymentStatus` thành outcome nội bộ.

## 9. Module contract trong modular monolith

Mỗi module có:

- public API: command/query/service interface và event công khai;
- internals: entity, repository, implementation;
- required interfaces: module/dependency được phép gọi;
- data ownership: bảng nào thuộc module;
- test contract và module integration test.

Spring Modulith mô hình hóa module chức năng, kiểm tra cycle, truy cập internal package và allowed dependencies; nó cũng hỗ trợ test từng module. Nguồn: [Spring Modulith Fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html), [Module Verification](https://docs.spring.io/spring-modulith/reference/verification.html), [Module Testing](https://docs.spring.io/spring-modulith/reference/testing.html).

```java
class ModularityTest {
    @Test
    void verifiesModuleBoundaries() {
        ApplicationModules.of(PhoneStoreApplication.class).verify();
    }
}
```

Chỉ thêm Spring Modulith khi version tương thích với Spring Boot đã được kiểm tra từ compatibility matrix; ArchUnit vẫn là lựa chọn độc lập tốt.

## 10. Giao tiếp module

Ưu tiên theo độ đơn giản:

1. gọi public application API đồng bộ khi caller cần kết quả ngay;
2. application event nội bộ khi side effect không phải kết quả trực tiếp;
3. persistent event publication/outbox khi không được mất event;
4. broker/integration event khi vượt process/deploy boundary.

Không dùng event cho mọi thứ. Event làm control flow khó thấy và eventual consistency tăng; synchronous call trong một process thường rõ hơn nếu coupling hợp lệ.

## 11. Quy trình modeling từ requirement

1. Ghi actor, goal và business outcome.
2. Liệt kê command, event, policy và external system.
3. Xác định invariant cần atomicity.
4. Nhóm behavior thành aggregate/context giả thuyết.
5. Walk-through happy path và failure/concurrency path.
6. Viết test theo ngôn ngữ domain trước mapping JPA.
7. Xác định module API và data ownership.
8. Kiểm tra dependency cycle.
9. Tạo ADR cho ranh giới còn tranh luận.
10. Refine sau khi học thêm domain; model không bất biến vĩnh viễn.

## 12. Anti-pattern

- Anemic domain: entity chỉ getter/setter, mọi rule trong `ServiceImpl`.
- God aggregate: `User` chứa cart, order, review, payment và mọi collection.
- One model for all: entity JPA dùng trực tiếp làm request, response, event.
- Repository per table thay vì per aggregate/lifecycle.
- Event-driven để né dependency cycle nhưng không sửa boundary.
- DDD folder cosplay: có `domain/` nhưng chứa Spring controller/JPA query.
- Ép mọi CRUD thành factory/specification/domain event phức tạp.

## 13. Definition of Done cho một module

- ubiquitous language/glossary rõ;
- public API nhỏ và có version policy;
- internals không bị module khác truy cập;
- aggregate/invariant/concurrency strategy rõ;
- bảng thuộc owner duy nhất;
- module verification và application-module tests pass;
- event delivery/retry/idempotency rõ nếu có;
- telemetry và runbook theo use case critical.


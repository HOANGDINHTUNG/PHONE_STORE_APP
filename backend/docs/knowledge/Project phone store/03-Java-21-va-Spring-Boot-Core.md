---
title: Java 21 và Spring Boot Core
tags: [java-21, spring-boot, core]
status: verified
verified_on: 2026-07-21
applies_to: [Java 21, Spring Boot 3.5.x, Spring Boot 4.1.x]
---

# Java 21 và Spring Boot Core

## 1. Baseline phiên bản

- Java 21 là LTS và cung cấp virtual threads chính thức.
- Spring Boot 4.1.0 yêu cầu tối thiểu Java 17, tương thích đến Java 26 và dùng Spring Framework 7.0.8+ theo System Requirements tại ngày kiểm chứng.
- Với dự án 3.5.x, chỉ dùng reference/BOM của nhánh 3.5.x. Migration sang 4.x là một công việc riêng có test regression.
- Luôn dùng Gradle Wrapper; không dựa vào Gradle cài toàn máy.

Nguồn: [Spring Boot System Requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Java 21 docs](https://docs.oracle.com/en/java/javase/21/).

## 2. IoC, DI và bean lifecycle

Spring container tạo, cấu hình và nối các bean. Constructor injection là mặc định tốt vì dependency bắt buộc được biểu diễn rõ, object dễ test và field có thể `final`.

```java
@Service
public class CheckoutService {
    private final OrderRepository orders;
    private final PaymentPort payments;

    public CheckoutService(OrderRepository orders, PaymentPort payments) {
        this.orders = orders;
        this.payments = payments;
    }
}
```

Tránh:

- field injection;
- lấy bean trực tiếp từ `ApplicationContext` trong business code;
- circular dependency;
- constructor chạy I/O nặng;
- mutable singleton chứa state theo request.

Scope mặc định là singleton: thread-safe phụ thuộc vào code của bạn, không phải vì Spring tự khóa.

## 3. `@SpringBootApplication` và auto-configuration

`@SpringBootApplication` kết hợp configuration, component scanning và auto-configuration. Auto-configuration được kích hoạt có điều kiện theo classpath, bean và properties; nó “back off” khi ứng dụng định nghĩa bean tương ứng.

Khi ứng dụng khởi động sai:

1. đọc failure analysis;
2. bật condition evaluation report khi cần;
3. kiểm tra dependency graph/BOM;
4. kiểm tra package root của application class;
5. kiểm tra bean ambiguity, profile và property binding;
6. không thêm annotation ngẫu nhiên để “hết đỏ”.

## 4. Configuration an toàn

- Dùng `@ConfigurationProperties` cho nhóm cấu hình có type và validation.
- Dùng profile cho khác biệt môi trường, không dùng để nhúng secret.
- Secret đến từ secret manager/environment injection; không commit `.env`, key hoặc production credential.
- Tách default không nhạy cảm và override theo môi trường.
- Fail fast khi property bắt buộc thiếu.
- Không log toàn bộ Environment vì có thể lộ secret.

```java
@ConfigurationProperties("app.payment")
@Validated
public record PaymentProperties(
        @NotNull Duration timeout,
        @Min(0) int maxRetries) {}
```

## 5. Dependency management

- Dùng Spring Boot dependency management/BOM; bỏ version ở dependency đã được quản lý.
- Chỉ override version khi có lý do như CVE/fix và đã chạy compatibility tests.
- Không dùng dynamic version (`1.+`, `latest.release`).
- Commit lockfile nếu chiến lược build yêu cầu reproducibility.
- Theo dõi dependency tree để phát hiện version conflict.

## 6. Virtual threads

Virtual threads phù hợp cho lượng lớn tác vụ chủ yếu chờ blocking I/O; chúng không làm CPU-intensive work nhanh hơn. Không xem đây là lý do bỏ connection-pool limit, rate limit hoặc backpressure: database vẫn chỉ chịu được số connection hữu hạn.

Trước khi bật trong production:

- load test workload thật;
- kiểm tra thư viện có pinning/blocking behavior bất lợi;
- giới hạn concurrency tại downstream;
- theo dõi thread, DB pool, latency và memory;
- so sánh với platform-thread baseline.

Nguồn: [Oracle Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html).

## 7. Exception và null

- Exception nghiệp vụ có tên rõ; map tại boundary bằng `@RestControllerAdvice`.
- Không catch `Exception` rồi trả 200 hoặc nuốt lỗi.
- Không dùng exception để điều khiển flow bình thường.
- `Optional` phù hợp chủ yếu cho return type có thể thiếu; tránh dùng cho entity field/DTO mọi nơi.
- `"CONST".equals(value)` null-safe; với enum dùng `value == Enum.CONSTANT` khi `value` có thể null.

## 8. Time, money và identifier

- Dùng `Instant` cho timestamp tuyệt đối; dùng `LocalDate` cho ngày không có timezone.
- Chuyển timezone ở boundary; lưu UTC cho event timestamp.
- Dùng `BigDecimal` cho tiền với scale/rounding được quy định; không dùng `double`.
- ID là opaque với client; không nhúng business meaning nếu không thật cần.
- UUID/ULID/snowflake/auto-increment có trade-off về kích thước index, locality, phân tán và khả năng đoán; chọn bằng ADR.

## 9. Quy tắc nâng cấp Spring Boot

1. Đọc release notes và migration guide của từng major/minor.
2. Nâng Java/build tool trước nếu được yêu cầu.
3. Chạy test hiện tại và ghi baseline.
4. Nâng BOM, không nâng ngẫu nhiên từng Spring module.
5. Sửa deprecated API trước khi nhảy major.
6. Kiểm tra configuration property đã rename/remove.
7. Chạy integration test với DB thật, security test, serialization contract test.
8. So sánh startup, memory, latency và error rate.
9. Có rollback plan.


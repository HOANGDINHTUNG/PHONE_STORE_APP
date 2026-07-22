---
title: Chiến lược Testing cho Spring Boot
tags: [testing, junit, mockito, testcontainers, pitest, jqwik, jazzer]
status: verified
verified_on: 2026-07-21
---

# Chiến lược Testing cho Spring Boot

## 1. Mục tiêu

Test tạo bằng chứng rằng behavior và invariant đúng, phát hiện regression nhanh và hỗ trợ refactor. Coverage là tín hiệu phần code đã chạy, không chứng minh assertion tốt.

## 2. Test portfolio

| Loại | Mục tiêu | Dùng thật |
|---|---|---|
| Unit | Domain rule/algorithm cô lập | JUnit 5, AssertJ; ít/no mock |
| Component/application | Một use case + boundary giả/real chọn lọc | Spring context hẹp hoặc plain Java |
| Slice | MVC/JPA/JSON/security slice | `@WebMvcTest`, `@DataJpaTest` theo phiên bản |
| Integration | DB/broker/external adapter thật | Testcontainers, WireMock/mock server |
| Contract | Compatibility provider-consumer/OpenAPI | Schema/contract tooling |
| E2E | Luồng critical qua deployable system | Ít nhưng quan trọng |
| Mutation | Chất lượng assertion | PIT |
| Property-based | Invariant trên nhiều input | jqwik |
| Fuzz | Crash/security parser/input | Jazzer |
| Performance | SLO/capacity/regression | Workload representative |

## 3. Unit test tốt

Theo Arrange–Act–Assert, một behavior rõ. Tên test thể hiện điều kiện và outcome.

```java
@Test
void reserve_rejectsQuantityGreaterThanAvailableStock() {
    var inventory = new Inventory("SKU-1", 2);

    var error = assertThrows(
            InsufficientStockException.class,
            () -> inventory.reserve(3));

    assertEquals(2, inventory.available());
    assertEquals("SKU-1", error.sku());
}
```

Test cả outcome và state không bị thay đổi khi fail. Tránh assert implementation detail khiến refactor vô hại cũng vỡ test.

## 4. Mockito

Mock boundary chậm/không quyết định như payment port, clock, email; không mock value object/entity đơn giản. Verify interaction khi chính interaction là contract (gửi đúng event một lần), không verify mọi getter/call nội bộ.

Các lỗi phổ biến:

- over-mocking nên test chỉ xác nhận chính setup của mình;
- `any()` quá rộng che sai dữ liệu;
- mock JPA behavior khác database thật;
- lenient stubbing che test thừa;
- test service implementation mà không assert business outcome.

## 5. Spring test scope

- Plain unit test cho domain và mapper.
- MVC slice kiểm tra route, validation, serialization, error và security boundary.
- JPA slice/integration kiểm tra mapping/query/constraint.
- `@SpringBootTest` cho wiring/use case tích hợp quan trọng, không dùng cho mọi method.
- Context cache giúp nhanh khi configuration ổn định; tránh mỗi test tạo property/profile khác không cần thiết.

## 6. Testcontainers

H2 không phải MySQL: dialect, collation, transaction, JSON, constraint và optimizer khác. Testcontainers cung cấp database/container dùng một lần cho integration test, phù hợp kiểm tra compatibility thực. Nguồn: [Testcontainers for Java](https://java.testcontainers.org/).

Nguyên tắc:

- pin image version gần production;
- chạy migration thật;
- seed nhỏ nhưng đại diện, test isolation;
- tái sử dụng container giữa class nếu an toàn, reset data có kiểm soát;
- không hardcode host/port; dùng mapped port;
- CI có container runtime tương thích.

## 7. Database tests phải bao phủ

- unique/FK/check/not-null;
- custom JPQL/native query;
- case sensitivity/collation;
- decimal/timezone;
- pagination ordering;
- concurrent update/lock/deadlock handling;
- migration từ schema cũ;
- query count/N+1 ở critical path.

## 8. Mutation testing với PIT

Mutation tool thay toán tử/condition/return để xem test có “giết” mutant không. Survived mutant thường chỉ ra assertion thiếu hoặc code tương đương/không test được.

Quy trình:

1. chạy trên domain/service critical trước;
2. xem survived mutants, không chạy theo tỷ lệ mù quáng;
3. thêm test behavior có giá trị;
4. exclude generated/configuration code có lý do;
5. đặt threshold tăng dần trong CI.

Line coverage cao nhưng mutation score thấp là cảnh báo test chạy qua code mà không kiểm tra đúng.

Nguồn: [PIT Mutation Testing](https://pitest.org/).

## 9. Property-based testing với jqwik

Thay vì vài example, sinh nhiều input và kiểm invariant:

- reserve hợp lệ không làm stock âm;
- encode/decode round-trip;
- sort result luôn ordered và bảo toàn phần tử;
- transfer giữ tổng balance nếu không phí;
- normalization idempotent.

Property phải có domain meaning; generator cần bao phủ boundary, unicode, empty, max, invalid distribution. jqwik shrink input để tìm phản ví dụ nhỏ. Nguồn: [jqwik User Guide](https://jqwik.net/docs/current/user-guide.html).

## 10. Fuzzing với Jazzer

Fuzz parser, file upload, decoder, complex validation và endpoint input có nguy cơ crash/hang. Define finding: uncaught exception không mong đợi, OOM, timeout, invariant violation hoặc security signal. Giữ corpus và regression test cho crash đã sửa.

Fuzzing không thay test nghiệp vụ. Chạy budget nhỏ trong PR cho target quan trọng, budget dài định kỳ. Nguồn: [Jazzer](https://github.com/CodeIntelligenceTesting/jazzer).

## 11. Security tests

Test ma trận actor × action × resource ownership. Đừng chỉ test ADMIN thành công. Bao phủ token invalid/expired, horizontal privilege escalation, property authorization, CSRF/CORS, injection, rate-limit, file upload và redaction.

## 12. Performance tests

- Có SLO và workload model trước.
- Warm-up JVM/connection pool/cache.
- Dùng dataset có size/skew thật.
- Đo p50/p95/p99, throughput, error, CPU, heap/GC, DB pool/locks/queries.
- So sánh baseline và confidence range.
- Không chạy benchmark có process khác gây nhiễu rồi kết luận kiến trúc.

## 13. Test data và determinism

- Inject `Clock`, ID generator và random seed khi cần.
- Không phụ thuộc timezone/máy chạy/test order.
- Mỗi test sở hữu data hoặc cleanup rõ.
- Không gọi public internet trong automated test.
- Await async bằng condition/time budget, không `sleep` tùy tiện.

## 14. Quality gate đề xuất

- compile + static analysis;
- unit/slice test;
- integration + migration với Testcontainers;
- coverage cho vùng thay đổi và critical package;
- PIT theo lịch/critical module;
- jqwik/Jazzer target quan trọng;
- dependency/secret/container scan;
- contract compatibility;
- performance smoke cho hot path.

Không đặt một con số coverage duy nhất rồi coi là “bao phủ hết”. Definition of Done phải dựa trên risk và behavior.


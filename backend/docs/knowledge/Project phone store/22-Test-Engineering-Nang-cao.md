---
title: Test Engineering nâng cao cho Spring Boot
tags: [testing, testcontainers, contract-testing, mutation, property-based, fuzzing]
status: verified
verified_on: 2026-07-21
sources:
  - https://docs.junit.org/current/user-guide/
  - https://java.testcontainers.org/
---

# Test Engineering nâng cao cho Spring Boot

## 1. Thiết kế test từ risk

Không chia đều effort theo số class. Lập ma trận:

| Risk | Impact | Probability | Detectability | Test ưu tiên |
|---|---:|---:|---:|---|
| Double payment | Rất cao | Trung bình | Thấp sau sự cố | Idempotency + concurrency + integration |
| Wrong product sort | Thấp | Trung bình | Cao | Controller/query tests |
| Cross-tenant data leak | Rất cao | Trung bình | Thấp | Security matrix + DB predicate integration |
| Migration mất dữ liệu | Rất cao | Thấp | Thấp | Migration rehearsal + backup restore |

Feature critical cần nhiều loại bằng chứng hơn CRUD phụ.

## 2. Test dimensions

Với mỗi use case, xem các chiều:

- actor/role/ownership/tenant;
- state hiện tại;
- input boundary;
- time/timezone/expiry;
- concurrency/order/retry;
- dependency outcome;
- transaction/rollback;
- data volume/skew;
- version compatibility;
- observability/audit.

Pairwise/risk-based selection tránh Cartesian product khổng lồ nhưng vẫn bao phủ tương tác quan trọng.

## 3. Behavior specification

Test name như specification:

```text
placeOrder_whenStockIsAvailable_reservesStockAndCreatesPendingPaymentOrder
placeOrder_whenIdempotencyKeyIsReusedWithDifferentPayload_returnsConflict
approveKyc_whenReviewerOwnsSubmission_isForbidden
```

Arrange dùng domain language. Assert outcome/public contract, state và side effect cần thiết; tránh assert mọi call nội bộ.

## 4. Test doubles

| Double | Ý nghĩa | Khi dùng |
|---|---|---|
| Dummy | Chỉ lấp parameter | Dependency không dùng trong scenario |
| Stub | Trả dữ liệu định trước | Kiểm branch từ dependency result |
| Spy | Ghi nhận call trên object thật/partial | Hiếm, dễ coupling implementation |
| Mock | Kỳ vọng interaction | Interaction là contract |
| Fake | Implementation đơn giản có behavior | In-memory port nhưng phải biết khác production |

Fake repository thường không mô phỏng unique constraint, transaction, locking, collation và query semantics. Không dùng fake để chứng minh persistence correctness.

## 5. Test slice có mục tiêu

### MVC slice

Kiểm:

- route/method/content type;
- DTO binding/validation;
- authentication/authorization boundary;
- serialization;
- error RFC 9457/project format;
- pagination parameter limits.

Mock application port/use case, không mock Jackson/Spring MVC internals.

### JPA integration

Kiểm:

- mapping/cascade/orphan/version;
- query/projection/pagination;
- constraint và collation;
- lock/concurrency;
- migration compatibility.

Chạy MySQL Testcontainers thay H2 cho behavior production.

## 6. Transactional test trap

Test được bọc transaction và rollback có thể che lỗi production:

- lazy load vẫn hoạt động vì session mở;
- code quên transaction ngoài test;
- constraint chỉ phát hiện lúc flush/commit nhưng test không flush;
- data cleanup vô tình dựa rollback.

Chủ động `flush()`/clear persistence context khi cần, và có integration test gọi qua production boundary không phụ thuộc test-managed transaction. Spring docs cũng cảnh báo transaction test gắn thread; preemptive timeout chạy thread khác có thể commit ngoài transaction test. Nguồn: [Spring Test Transaction Management](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/tx.html).

## 7. Migration testing

Pipeline:

1. Start DB ở schema/version gần production.
2. Seed representative old data, gồm null/edge/large value.
3. Chạy migration mới.
4. Validate schema/constraint/index.
5. Start application version mới.
6. Test read/write compatibility.
7. Nếu rolling deploy, test old+new app compatibility trong expand phase.
8. Đo duration/lock/backfill trên scale gần thật.

Không chỉ test migration trên empty database.

## 8. Contract testing

### HTTP/OpenAPI

- lint schema;
- detect breaking changes;
- provider tests status/header/body/error;
- consumer expectations cho integration critical;
- examples phải validate theo schema.

### Event

- event type/version/envelope;
- backward/forward compatibility theo policy;
- old event replay vào consumer mới;
- unknown optional field;
- missing field theo version;
- duplicate/out-of-order.

Contract test không thay end-to-end business test; nó giảm integration surprise.

## 9. Concurrency harness

Pseudo flow:

```text
prepare shared state
create N workers
barrier.await() để cùng bắt đầu
execute command với independent transaction/connection
collect outcomes
assert invariant từ database cuối
assert số success/conflict
```

Chạy nhiều vòng với seed/log để tái hiện. Timeout tránh test treo. Không `Thread.sleep()` để “mong race xảy ra”.

## 10. Mutation strategy

PIT target trước:

- money/discount/tax;
- state transition;
- authorization policy;
- validation boundary;
- retry/idempotency decision;
- ranking/algorithm.

Review survived mutant:

1. Equivalent mutant thật?
2. Code unreachable/dead?
3. Assertion thiếu?
4. Test chỉ verify call?
5. Boundary chưa test?

Không viết test vô nghĩa chỉ để giết mutant; có thể refactor code làm intent rõ.

## 11. Property-based test

Ví dụ property:

```text
for any valid cart:
  total >= 0
  total == sum(line.subtotal) - validDiscount + tax
  applying percentage discount never increases total
  serialize(deserialize(x)) preserves semantic value
```

Generator gồm valid/invalid domain distributions, boundary, Unicode, large values và shrink. Property không được chỉ lặp implementation.

## 12. Fuzz target design

Target tốt:

- CSV/JSON/import parser;
- file metadata/archive/image processing;
- search/filter DSL;
- token/header parser custom;
- template/markdown sanitizer;
- complex validator.

Finding:

- unexpected exception;
- timeout/hang/regex DoS;
- excessive memory;
- path traversal;
- invariant/security bypass;
- differential mismatch.

Mỗi finding trở thành regression test/corpus seed. Jazzer target phải isolate side effect và có resource budget.

## 13. Performance test layers

- Microbenchmark: JMH cho function/library nhỏ.
- Query benchmark: DB plan/dataset/skew.
- Component load: một service + real dependencies.
- End-to-end load: user journey/SLO.
- Soak: leak/connection/cache/lag qua thời gian.
- Spike: admission/backpressure/recovery.
- Stress: tìm capacity cliff và degradation behavior.

Performance test pass không chỉ là throughput; error correctness, duplicate/lost effects và recovery cũng phải assert.

## 14. Flaky test taxonomy

- shared mutable data;
- time/timezone;
- random không seed;
- port/resource collision;
- async race;
- external network;
- test order;
- slow environment/timeout quá chặt;
- container readiness sai;
- leaked thread/connection.

Không giải quyết bằng retry CI vô hạn. Quarantine phải có owner/expiry và không che suite critical.

## 15. Test data builders

Builder tạo valid default và cho override field liên quan:

```java
var order = anOrder()
        .withStatus(PENDING_PAYMENT)
        .withCustomer(customerId)
        .build();
```

Không dùng một fixture khổng lồ chia sẻ khiến thay một field làm vỡ hàng trăm test. Invalid object tạo qua boundary phù hợp, không buộc domain builder phá invariant trừ khi test legacy/corrupt data.

## 16. CI suite partition

| Gate | Nội dung | Mục tiêu |
|---|---|---|
| Pre-commit/PR fast | format, static, unit, slice | Feedback nhanh |
| PR integration | Testcontainers, migration, contract, security | Merge confidence |
| Scheduled | PIT, fuzz dài, soak, dependency scan sâu | Tìm lỗi hiếm |
| Pre-release | E2E, load, restore, deployment rehearsal | Production readiness |
| Post-deploy | smoke, synthetic, canary analysis | Release safety |

Parallelize nhưng không làm test dùng chung DB/state gây nondeterminism.

## 17. Test evidence bàn giao

```markdown
Feature/risk:
Behavior covered:
Suites/commands:
Environment/image versions:
Results:
Coverage/mutation deltas:
Performance baseline:
Known gaps and reason:
Owner/follow-up:
```


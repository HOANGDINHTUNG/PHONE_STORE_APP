# Phone Store Backend — Testing Requirements

## 1. Mục đích

Rule này bảo đảm hệ thống:

- đúng nghiệp vụ trước khi phát hành;
- không bán vượt tồn kho;
- không tạo trùng đơn hàng, thanh toán hoặc hoàn tiền;
- bảo vệ đúng tài khoản, dữ liệu và quyền truy cập;
- giữ hợp đồng API ổn định cho ReactJS và React Native;
- phát hiện lỗi migration trước production;
- có test nhanh, ổn định và đủ tin cậy để làm release gate;
- không dùng coverage cao để che test kém chất lượng;
- có bằng chứng rõ ràng cho mọi tuyên bố “đã kiểm thử”.

Testing là một phần của thiết kế và triển khai, không phải bước bổ sung sau khi code xong.

---

## 2. Thứ tự ưu tiên và quan hệ với rule khác

Rule này phải được đọc cùng:

1. `00-project-constitution.md`;
2. `10-java-spring-standards.md`;
3. `20-security-guardrails.md`;
4. `30-database-guardrails.md`;
5. `40-api-standards.md`;
6. `60-safe-change-policy.md` nếu đã có.

Khi có xung đột:

- invariant nghiệp vụ, bảo mật và tính toàn vẹn dữ liệu có ưu tiên cao nhất;
- test phải chứng minh các rule khác đang được thực thi;
- không được sửa production behavior chỉ để test dễ viết;
- không được làm test yếu đi để CI xanh.

---

## 3. Từ khóa quy phạm

- **MUST / PHẢI**: yêu cầu bắt buộc.
- **MUST NOT / KHÔNG ĐƯỢC**: hành vi bị cấm.
- **SHOULD / NÊN**: mặc định phải thực hiện; ngoại lệ cần lý do.
- **MAY / CÓ THỂ**: tùy chọn có kiểm soát.

AI agent không được tự hạ yêu cầu **MUST** xuống mức khuyến nghị.

---

## 4. Phạm vi

Rule áp dụng cho:

- unit test;
- domain test;
- architecture test;
- Spring test slice;
- repository/database integration test;
- Flyway migration test;
- controller/API test;
- security test;
- contract test;
- module/component test;
- external integration test;
- async/event test;
- concurrency/transaction test;
- end-to-end test;
- performance/load/resilience test;
- smoke test;
- test report, coverage và CI quality gate.

Rule áp dụng cho cả:

- feature mới;
- bug fix;
- refactor;
- migration database;
- thay đổi dependency;
- thay đổi cấu hình;
- thay đổi API;
- thay đổi quyền;
- thay đổi tích hợp bên thứ ba.

---

## 5. Nguyên tắc kiểm thử cốt lõi

### 5.1. Test hành vi quan sát được

Test phải ưu tiên:

- input;
- output;
- state transition;
- side effect;
- interaction với boundary;
- invariant;
- lỗi và mã lỗi;
- transaction outcome.

Không test implementation detail không cần thiết như:

- private method;
- thứ tự gọi nội bộ không thuộc contract;
- tên biến;
- cách chia nhỏ thuật toán;
- số lần gọi getter;
- cấu trúc object không công khai.

### 5.2. Test nhỏ nhất có khả năng chứng minh

Chọn cấp test thấp nhất vẫn chứng minh đúng rủi ro:

- công thức giá: unit test;
- mapping JPA và unique constraint: database integration test;
- validation/status/error JSON: MVC/API test;
- security filter chain: Spring Security + MockMvc/full HTTP test;
- checkout xuyên module: component/integration test;
- proxy/TLS/CORS thật: end-to-end hoặc deployed environment test.

Không dùng `@SpringBootTest` cho mọi test.

### 5.3. Test độc lập và lặp lại được

Mỗi test phải:

- chạy độc lập;
- không phụ thuộc thứ tự;
- không phụ thuộc dữ liệu của test khác;
- không phụ thuộc internet;
- không phụ thuộc giờ hệ thống không kiểm soát;
- không phụ thuộc timezone/locale máy chạy;
- có kết quả giống nhau trên local và CI;
- dọn hoặc cô lập state do test tạo.

### 5.4. Test phải thất bại đúng lý do

- Assertion phải mô tả hành vi đang kiểm tra.
- Không catch exception rồi làm test pass.
- Không dùng assertion quá rộng.
- Không chỉ kiểm tra “không throw”.
- Không chỉ kiểm tra HTTP status nếu body/header/state cũng thuộc contract.
- Test phải phân biệt lỗi nghiệp vụ với lỗi hạ tầng.

### 5.5. Chất lượng hơn số lượng

Một test tốt phải:

- có mục đích rõ;
- dữ liệu tối thiểu;
- failure message dễ hiểu;
- không mock quá mức;
- không lặp setup vô nghĩa;
- không khóa cứng implementation;
- bắt được regression thực.

---

## 6. Chiến lược test nhiều tầng

### 6.1. Ma trận bắt buộc

| Tầng | Mục đích | Dependency thật | Tần suất |
| --- | --- | --- | --- |
| Static/architecture | Quy tắc code và module | Bytecode/source | Mọi PR |
| Unit/domain | Logic thuần, invariant | Không Spring/DB | Mọi commit |
| Slice | MVC, JSON, repository focus | Một phần Spring | Mọi PR |
| DB integration | JPA, SQL, constraint, locking | MySQL container | Mọi PR |
| Module/component | Nhiều bean/module phối hợp | Spring + MySQL + stub | Mọi PR |
| Contract | OpenAPI/provider/consumer | Contract thật | Mọi PR |
| Security | AuthN/AuthZ/ownership/input | Security chain thật | Mọi PR |
| E2E critical | Luồng nghiệp vụ chính | App chạy thật | Main/release |
| Migration | Empty DB và upgrade path | MySQL container | Mọi thay đổi DB |
| Performance/resilience | SLO, tải, timeout, retry | Môi trường chuẩn | Nightly/release |
| DAST/security scan | Kiểm tra runtime | App deploy cô lập | Scheduled/release |

### 6.2. Test pyramid

Dự án phải có:

- nhiều unit/domain test nhanh;
- số lượng vừa phải slice và integration test;
- ít E2E test nhưng bao phủ các luồng critical;
- test chuyên sâu cho concurrency, security và migration.

Không biến toàn bộ test suite thành E2E chậm và dễ lỗi.

Không thay integration test cần thiết bằng mock.

---

## 7. Toolchain kiểm thử

### 7.1. Baseline

Mặc định sử dụng:

- JUnit Jupiter/JUnit Platform;
- Spring Boot Test;
- Spring Test;
- AssertJ;
- Mockito;
- Spring Security Test;
- Testcontainers;
- MySQL Testcontainer;
- Flyway;
- MockMvc hoặc client HTTP phù hợp;
- Awaitility cho xử lý bất đồng bộ;
- JaCoCo cho coverage;
- ArchUnit hoặc Spring Modulith verification cho kiến trúc.

### 7.2. Quản lý phiên bản

- Phiên bản test library phải theo dependency management/BOM của Spring Boot khi phù hợp.
- Không tự nâng JUnit, Mockito, AssertJ, Spring Test hoặc Testcontainers vượt compatibility matrix mà chưa xác minh.
- Không pin nhiều phiên bản xung đột của JUnit Platform.
- Không kéo JUnit Vintage nếu dự án không còn JUnit 4.
- Dependency test chỉ được nằm trong test configuration.
- Dependency mới phải có lý do, owner và kiểm tra license/security.

### 7.3. Starter test

`spring-boot-starter-test` là baseline hợp lý cho các thư viện test phổ biến. Nếu phiên bản Spring Boot tách test module chi tiết hơn, build phải dùng module đúng với version hiện tại.

Không copy cấu hình từ một phiên bản Spring khác mà chưa đọc tài liệu của stack đang dùng.

---

## 8. Gradle test suites và task

### 8.1. Các suite chuẩn

Dự án nên tách tối thiểu:

~~~text
test
integrationTest
contractTest
e2eTest
~~~

Có thể bổ sung:

~~~text
securityTest
performanceTest
migrationTest
~~~

Quy ước:

| Task | Nội dung |
| --- | --- |
| `test` | Unit, domain, architecture, test rất nhanh |
| `integrationTest` | Spring slice, DB, component, API integration |
| `contractTest` | OpenAPI, provider/consumer contract |
| `migrationTest` | Flyway empty DB, upgrade và compatibility |
| `e2eTest` | Luồng qua application đang chạy |
| `securityTest` | Test chuyên sâu/DAST nếu tách riêng |
| `performanceTest` | Load, stress, soak, benchmark có kiểm soát |

### 8.2. Source set

Nếu dùng Gradle JVM Test Suite:

~~~text
src/test/java
src/test/resources
src/integrationTest/java
src/integrationTest/resources
src/contractTest/java
src/contractTest/resources
src/e2eTest/java
src/e2eTest/resources
~~~

Không trộn test rất chậm vào `test` làm feedback local mất kiểm soát.

### 8.3. Quan hệ task

- `check` phải phụ thuộc các gate cần chạy trên PR.
- Unit test chạy trước integration test.
- Test report phải được tạo kể cả khi có failure nếu CI hỗ trợ.
- Không cấu hình `check` bỏ qua integration/contract test mà không ghi rõ.
- Release pipeline không được dùng `-x test`.
- Task phải chạy được từ clean checkout.

### 8.4. Java toolchain

- Test phải chạy bằng Java toolchain đã khóa của dự án, mặc định Java 21.
- Local và CI phải dùng cùng major JDK.
- Nếu hỗ trợ nhiều JDK/runtime, compatibility matrix phải chạy riêng.

---

## 9. Cấu trúc và đặt tên test

### 9.1. Package

Test package phải mirror production package:

~~~text
src/main/java/com/example/store/order/...
src/test/java/com/example/store/order/...
~~~

Không gom toàn bộ test vào package `tests` chung.

### 9.2. Tên class

| Loại | Hậu tố |
| --- | --- |
| Unit/domain | `*Test` |
| Integration | `*IntegrationTest` hoặc `*IT` |
| Contract | `*ContractTest` |
| E2E | `*E2ETest` |
| Architecture | `*ArchitectureTest` |
| Migration | `*MigrationTest` |

Build phải discover tên class nhất quán; không dựa vào tên ngẫu nhiên.

### 9.3. Tên method

Tên test phải diễn đạt:

- điều kiện;
- hành vi;
- kết quả mong đợi.

Ví dụ:

~~~java
@Test
void shouldRejectCheckoutWhenAvailableStockIsInsufficient() {
    // ...
}
~~~

Hoặc:

~~~java
@Test
void checkout_withExpiredCoupon_returnsCouponExpiredProblem() {
    // ...
}
~~~

Không dùng:

~~~text
test1
testHappy
methodTest
works
~~~

### 9.4. Nested test

`@Nested` có thể dùng để nhóm theo operation hoặc context:

~~~text
Checkout
  ValidRequest
  InsufficientStock
  ExpiredCoupon
  DuplicateRequest
~~~

Không lồng quá sâu làm setup khó hiểu.

---

## 10. Cấu trúc một test

### 10.1. Arrange–Act–Assert

Test nên có ba phần rõ:

1. Arrange/Given;
2. Act/When;
3. Assert/Then.

Không cần comment máy móc nếu code đã rõ, nhưng phải giữ separation.

### 10.2. Một hành vi chính

Một test nên có một lý do nghiệp vụ chính để thất bại.

Có thể có nhiều assertion khi chúng cùng chứng minh một outcome:

- status;
- body;
- database state;
- event được phát;
- không có side effect trùng.

Không tách một outcome thành nhiều test làm lặp setup đắt đỏ nếu assertion cần được đọc cùng nhau.

### 10.3. Assertion

Ưu tiên AssertJ cho assertion Java:

- assertion cụ thể;
- message có ngữ cảnh;
- recursive comparison chỉ khi field được kiểm soát;
- so sánh `BigDecimal` theo giá trị số khi scale không thuộc contract;
- so sánh exact scale khi scale là invariant.

Không dùng:

- `assertTrue(complexExpression)` không có message;
- `assertNotNull` rồi không kiểm tra nội dung;
- assertion snapshot toàn body dễ vỡ cho mọi API;
- assertion phụ thuộc thứ tự JSON field.

### 10.4. Exception

Dùng assertion chuyên biệt:

~~~java
assertThatThrownBy(() -> service.checkout(command))
        .isInstanceOf(InsufficientStockException.class)
        .hasMessageContaining("stock");
~~~

Nếu domain exception có code/metadata, phải assert code/metadata thay vì chỉ message.

---

## 11. Tính xác định và cô lập

### 11.1. Thời gian

- Production code phụ thuộc thời gian phải inject `Clock` hoặc abstraction tương đương.
- Test phải cố định instant/timezone.
- Không phụ thuộc `LocalDateTime.now()` trực tiếp trong logic critical.
- Test thời hạn coupon, token, reservation và reset password phải kiểm tra boundary trước/đúng/sau thời điểm hết hạn.
- Default timezone của test suite nên được khóa UTC.

### 11.2. Random

- Random test data phải có seed.
- Seed phải được in trong failure report.
- ID ngẫu nhiên chỉ dùng khi không ảnh hưởng assertion.
- Không dùng random để che thiếu test case cụ thể.
- Property-based test phải có reproducible seed và shrinking.

### 11.3. Thread và async

- Không dùng `Thread.sleep` để chờ kết quả.
- Dùng Awaitility, latch, barrier hoặc synchronization primitive có timeout.
- Mọi wait phải có deadline.
- Test timeout phải đủ để phát hiện deadlock nhưng không quá ngắn gây flaky.

### 11.4. File và network

- Dùng `@TempDir` hoặc thư mục tạm riêng.
- Không ghi vào path cố định của máy developer.
- Không gọi internet trong test PR.
- Không dùng service thật của payment, email, SMS, storage hoặc shipping trong test tự động thông thường.

### 11.5. Thứ tự chạy

- Không dùng `@Order` để sửa test phụ thuộc nhau.
- Không dựa vào class/method chạy trước.
- Mỗi test phải tự tạo precondition.
- Parallel execution chỉ bật sau khi chứng minh resource isolation.

---

## 12. Test data và fixture

### 12.1. Test Data Builder

Nên dùng builder/factory có giá trị mặc định hợp lệ:

~~~java
var product = ProductTestData.aProduct()
        .withStatus(ACTIVE)
        .build();
~~~

Quy tắc:

- default phải hợp lệ;
- field liên quan test phải override rõ;
- builder không được gọi service production hoặc network;
- builder không được che invariant;
- thay đổi production field bắt buộc phải khiến fixture cần được xem xét.

### 12.2. Không dùng fixture khổng lồ

Không dùng một file SQL/JSON khổng lồ cho mọi test vì:

- khó biết dữ liệu nào quan trọng;
- test phụ thuộc ngầm;
- thay đổi nhỏ làm nhiều test vỡ;
- cleanup khó.

Fixture lớn chỉ phù hợp cho:

- migration;
- import;
- performance dataset;
- contract fixture có nguồn rõ.

### 12.3. Dữ liệu nhạy cảm

- Không dùng dữ liệu production thật.
- Không commit token, key, password hoặc PII thật.
- Snapshot production dùng cho migration/performance phải được mask và phê duyệt.
- Test log không được in secret giả theo format có thể bị scanner hoặc người đọc hiểu nhầm là thật nếu không cần.

### 12.4. Factory và production path

Test factory có thể bypass UI/API nhưng không được bypass invariant đang cần test.

Nếu test cần chứng minh create API, phải tạo resource qua API cho bước đó thay vì insert thẳng.

Nếu setup không liên quan hành vi đang test, có thể dùng repository/factory để giảm thời gian.

---

## 13. Unit và domain tests

### 13.1. Phạm vi

Unit/domain test phải bao phủ:

- value object;
- aggregate invariant;
- calculator;
- policy;
- validator nghiệp vụ;
- state machine;
- mapper có logic;
- application service với boundary mock;
- error mapping thuần.

### 13.2. Không khởi động Spring

Unit test không được dùng:

- `@SpringBootTest`;
- ApplicationContext;
- database;
- network;
- container;

trừ khi bản thân subject là Spring infrastructure.

### 13.3. Mockito

Mockito chỉ dùng cho boundary/collaborator:

- repository port;
- payment gateway;
- mail sender;
- clock nếu không dùng fixed Clock;
- event publisher;
- storage port.

Không mock:

- value object;
- entity/aggregate đang test;
- collection;
- DTO đơn giản;
- mọi class chỉ để đạt isolation tuyệt đối.

Quy tắc:

- dùng strict stubbing;
- không dùng deep stubs;
- không stub method không dùng;
- verify side effect quan trọng;
- không verify mọi lời gọi nội bộ;
- dùng ArgumentCaptor khi nội dung command/event là contract cần kiểm tra.

### 13.4. Boundary và bảng quyết định

Logic có nhiều điều kiện phải test bằng bảng quyết định/parameterized test:

- min/max quantity;
- mức giảm giá;
- ngày bắt đầu/kết thúc coupon;
- order transition;
- role/permission;
- stock threshold;
- partial/full refund;
- token expiry.

Phải test:

- giá trị dưới boundary;
- đúng boundary;
- trên boundary;
- null/empty nếu contract cho phép hoặc từ chối;
- combination quan trọng.

---

## 14. Architecture và module tests

### 14.1. Mục tiêu

Architecture test phải ngăn:

- cycle giữa module;
- module truy cập package internal của module khác;
- controller truy cập repository trực tiếp;
- domain phụ thuộc web/infrastructure;
- entity JPA bị trả từ controller;
- service phụ thuộc controller;
- security rule bị đặt sai layer;
- module payment/order/inventory kết dính ngoài thiết kế.

### 14.2. Công cụ

Có thể dùng:

- ArchUnit;
- Spring Modulith `ApplicationModules.verify()`;
- test riêng cho package/module convention.

Nếu dự án dùng Spring Modulith, phải kiểm tra:

- không có module cycle;
- chỉ truy cập API package được công bố;
- allowed dependencies đúng khai báo.

### 14.3. Quy tắc ví dụ

Architecture tests nên chứng minh:

- class trong `..domain..` không phụ thuộc `..web..`;
- class `@RestController` chỉ nằm trong package API/web;
- repository chỉ được gọi từ application/service hoặc domain adapter được phép;
- module khác không truy cập `..internal..`;
- exception nội bộ không bị dùng làm API contract;
- DTO API không nằm trong entity package.

Architecture test phải chạy trong task nhanh trên mọi PR.

---

## 15. Spring test slices

### 15.1. Nguyên tắc

Test slice chỉ load phần framework cần thiết.

Ưu tiên:

- `@WebMvcTest` cho MVC/controller;
- `@JsonTest` cho serialization;
- `@DataJpaTest` cho JPA/repository;
- `@RestClientTest` cho REST client nếu phù hợp.

Không thêm hàng loạt `@Import` cho tới khi slice biến thành full context khó hiểu.

### 15.2. Web MVC slice

`@WebMvcTest` phải kiểm tra:

- route;
- method;
- path/query/header binding;
- request deserialization;
- Bean Validation;
- controller advice;
- ProblemDetail;
- response serialization;
- content type;
- security behavior trong phạm vi slice.

Mock service/use case ở boundary bằng cơ chế mock bean phù hợp phiên bản Spring.

Không mock chính controller, validator hoặc exception handler đang kiểm tra.

### 15.3. JSON slice

`@JsonTest` nên dùng cho schema nhạy cảm:

- ID phải serialize string;
- Money;
- UTC instant;
- enum;
- nullable/required behavior;
- unknown request field;
- ProblemDetail extension;
- custom Jackson module.

### 15.4. JPA slice

`@DataJpaTest` phải kết nối MySQL Testcontainer khi test phụ thuộc database behavior.

Không để slice tự thay bằng embedded database ngoài ý muốn.

---

## 16. Database integration tests

### 16.1. MySQL thật

Database integration test phải chạy trên MySQL container có major version khớp production.

H2/embedded database không được dùng để chứng minh:

- MySQL SQL syntax;
- collation/case sensitivity;
- index behavior;
- locking/isolation;
- JSON type;
- timestamp behavior;
- generated column;
- native query;
- unique constraint;
- deadlock;
- migration.

H2 chỉ có thể dùng cho test hoàn toàn không phụ thuộc khác biệt dialect và phải có lý do rõ.

### 16.2. Testcontainers

- Dùng Testcontainers để tạo dependency cô lập.
- Dùng `@ServiceConnection` nếu Spring Boot version hỗ trợ; nếu không, dùng `@DynamicPropertySource` có kiểm soát.
- Container image phải pin version, không dùng `latest`.
- Chờ health/readiness đúng cách.
- Không dùng test container chung với môi trường development thật.
- Không bật container reuse trong CI nếu làm mất isolation.
- Nếu dùng singleton container trong một test process, lifecycle phải được quản lý thống nhất.

### 16.3. Schema

- Flyway phải tạo schema test.
- Hibernate `ddl-auto=create` hoặc `create-drop` không được là nguồn schema cho integration test.
- Hibernate nên validate mapping với schema đã migrate.
- Test phải fail khi migration hoặc mapping không khớp.

### 16.4. Repository behavior

Mỗi custom query phải test:

- kết quả đúng;
- empty result;
- pagination;
- stable sort;
- filter combination;
- tenant/ownership scope nếu có;
- deleted/inactive state;
- enum/time/money mapping;
- query count khi có nguy cơ N+1.

### 16.5. Constraint

Phải test constraint quan trọng:

- unique email/phone/SKU/order code/provider event ID;
- foreign key;
- non-null;
- check constraint nếu có;
- version/optimistic locking;
- money precision/scale;
- non-negative stock invariant tại lớp phù hợp.

Phải `flush` khi cần để database phát lỗi trong test, và clear persistence context khi cần chứng minh dữ liệu đọc lại từ DB.

### 16.6. Transaction rollback

Rollback tự động hữu ích nhưng có thể che:

- commit event;
- after-commit listener;
- transaction synchronization;
- constraint chỉ xuất hiện khi flush/commit;
- async consumer;
- nhiều transaction cạnh tranh.

Luồng critical phải có test sử dụng transaction thật và đọc lại state sau commit.

### 16.7. Cleanup

Chọn một chiến lược rõ:

- transaction rollback;
- truncate theo dependency order;
- schema/database riêng mỗi suite;
- container/database riêng cho nhóm test.

Không gọi Flyway clean vào database không được xác minh là test.

Cleanup phải fail-safe và không dựa vào tên environment mơ hồ.

---

## 17. Flyway migration tests

### 17.1. Validation bắt buộc

CI phải chạy:

- Flyway validate;
- migrate từ empty database tới latest;
- application startup với schema latest;
- Hibernate/schema validation nếu dùng.

Validate phải phát hiện:

- migration checksum thay đổi;
- migration đã áp dụng nhưng bị xóa;
- version conflict;
- naming không hợp lệ;
- pending migration không mong đợi.

### 17.2. Upgrade path

Với thay đổi có rủi ro, phải test:

1. tạo schema ở version production/support trước;
2. chèn dữ liệu đại diện;
3. chạy migration mới;
4. kiểm tra dữ liệu;
5. khởi động application version mới;
6. chạy smoke query/use case;
7. xác nhận constraint/index mới.

### 17.3. Expand–contract

Migration zero/low-downtime phải test compatibility:

- app cũ với schema expand nếu có giai đoạn coexist;
- app mới với schema expand;
- backfill;
- chuyển traffic;
- contract cleanup sau khi không còn app cũ.

Không drop/rename column trong cùng deployment nếu app cũ còn có thể truy cập.

### 17.4. Data migration

Backfill phải test:

- dữ liệu null/legacy;
- duplicate;
- batch boundary;
- restart/resume;
- idempotency;
- thời gian chạy trên dataset đại diện;
- không lock bảng quá mức;
- kết quả count/checksum.

### 17.5. Không sửa migration đã phát hành

Test không được “sửa checksum” bằng cách repair tùy tiện.

Nếu migration đã được áp dụng ở môi trường chia sẻ:

- tạo migration mới để sửa;
- test forward fix;
- ghi rõ recovery plan.

---

## 18. API và controller tests

### 18.1. Mọi operation

Mỗi API operation phải test tối thiểu:

- happy path;
- malformed JSON;
- unknown field;
- validation failure;
- boundary input;
- unsupported content type;
- authentication;
- authorization;
- ownership;
- not found;
- conflict;
- response status;
- response content type;
- response schema;
- error ProblemDetail;
- header bắt buộc;
- không rò rỉ field nội bộ.

### 18.2. Contract JSON

Phải assert:

- ID là string;
- Money đúng amount/currency;
- instant UTC;
- enum đúng contract;
- collection rỗng là `[]`;
- null/absent đúng schema;
- pagination metadata;
- stable error code;
- `application/problem+json` cho lỗi;
- `Location` cho `201`;
- không body cho `204`;
- ETag/If-Match nếu áp dụng;
- Idempotency-Key behavior nếu áp dụng.

### 18.3. Không chỉ dùng MockMvc

MockMvc kiểm tra đầy đủ Spring MVC request handling nhưng không mở server thật.

Phải có một số full HTTP tests dùng application chạy ở random port cho:

- serialization qua server thật;
- filter chain;
- content length/upload;
- timeout;
- network/client configuration;
- CORS và header khi cần;
- behavior phụ thuộc servlet container;
- health/startup.

Gateway/CDN/TLS behavior phải test trong môi trường deploy phù hợp, không thể chỉ dựa MockMvc.

### 18.4. Snapshot

Snapshot/golden file có thể dùng cho contract ổn định nhưng:

- không được thay toàn bộ assertion có nghĩa;
- phải review diff;
- không auto-update snapshot để CI xanh;
- phải loại dữ liệu động;
- không chứa secret/PII.

---

## 19. Security tests

### 19.1. Ma trận actor × operation

Mỗi endpoint protected phải có test theo actor:

- anonymous;
- customer hợp lệ;
- customer khác owner;
- staff;
- admin;
- account disabled/locked;
- token hết hạn/invalid khi liên quan.

Không chỉ test role đúng; phải test role sai.

### 19.2. Authentication

Phải test:

- đăng ký hợp lệ;
- email/phone trùng;
- password policy;
- login đúng/sai;
- generic authentication error khi cần chống enumeration;
- access token hợp lệ;
- token hết hạn;
- token sai signature;
- token sai issuer/audience;
- token dùng thuật toán không cho phép;
- account disabled sau khi token đã phát;
- logout/revocation theo contract.

### 19.3. Refresh token

Phải test:

- refresh hợp lệ;
- rotation;
- token cũ không dùng lại;
- reuse detection;
- revoke token family nếu chính sách yêu cầu;
- logout một thiết bị/tất cả thiết bị;
- expiry;
- token hash/storage;
- concurrent refresh;
- cleanup không xóa token còn hợp lệ ngoài ý muốn.

### 19.4. Authorization và ownership

Phải test BOLA/IDOR:

- customer A không đọc order của customer B;
- customer A không sửa address/cart/review của B;
- staff chỉ làm operation được cấp;
- admin endpoint không mở cho customer;
- đổi path ID không vượt quyền;
- filter/query không làm lộ object ngoài scope;
- batch endpoint kiểm tra quyền từng object.

### 19.5. Method security

Nếu dùng `@PreAuthorize` hoặc method security:

- test trực tiếp method security;
- test qua HTTP;
- không chỉ mock service khiến annotation không chạy;
- kiểm tra self-invocation/routing không bypass security.

### 19.6. CSRF và CORS

- Nếu dùng cookie credential và CSRF protection, test valid/missing/invalid CSRF token.
- Nếu API bearer-token stateless không dùng CSRF, test cấu hình đó đúng phạm vi.
- Test origin allowlist.
- Test origin bị từ chối.
- Không chấp nhận wildcard origin với credential.
- Test preflight cho method/header thực tế.

### 19.7. Input và output security

Phải test:

- mass assignment;
- SQL/JPQL injection payload;
- path traversal;
- oversized body;
- invalid content type;
- duplicate/unknown field nếu parser hỗ trợ;
- log injection;
- error không lộ stack trace/SQL/secret;
- security header theo môi trường;
- rate limit cho auth và operation critical.

### 19.8. Security scan

CI/scheduled pipeline phải có chiến lược:

- dependency vulnerability scan;
- secret scan;
- SAST;
- container/image scan nếu đóng gói container;
- DAST trên môi trường cô lập;
- API authorization test theo OWASP.

Tool scan không thay thế test nghiệp vụ và review thủ công.

---

## 20. Ma trận test nghiệp vụ cửa hàng điện thoại

### 20.1. Catalog và variant

Phải test:

- product active/inactive;
- variant đúng product;
- SKU unique;
- màu/dung lượng;
- giá hiệu lực;
- product list không lộ cost/margin/internal stock;
- filter brand/category/price;
- stable sort/pagination;
- search Unicode/tiếng Việt;
- product bị ẩn không xuất hiện public;
- ảnh và media mapping;
- N+1 trên list/detail.

### 20.2. Cart

Phải test:

- tạo cart customer/guest;
- ownership của cart;
- thêm variant;
- thêm cùng variant theo contract;
- quantity min/max;
- variant inactive;
- stock không đủ;
- price thay đổi sau khi thêm cart;
- coupon áp/gỡ;
- coupon hết hạn;
- subtotal/discount/shipping/total;
- merge guest cart sau login;
- concurrent cart update;
- cart expiry/cleanup.

### 20.3. Checkout

Checkout là luồng critical và phải test:

- request hợp lệ tạo đúng một order;
- Idempotency-Key bắt buộc;
- replay cùng key/cùng payload;
- cùng key/khác payload;
- concurrent request cùng key;
- giá thay đổi trước checkout;
- coupon hết hạn/quota hết;
- address không hợp lệ;
- variant ngừng bán;
- stock thiếu;
- nhiều item và một item lỗi;
- rollback đúng khi reservation/order creation lỗi;
- order snapshot đúng;
- total do server tính;
- không tin total từ client;
- event/outbox tạo đúng một lần.

### 20.4. Inventory

Phải test:

- on-hand/reserved/available invariant;
- reserve hợp lệ;
- reserve vượt tồn;
- release;
- confirm/deduct;
- reservation expiry;
- duplicate release/confirm;
- concurrent checkout cùng SKU;
- concurrent checkout nhiều SKU;
- deadlock/retry policy;
- stock không âm;
- adjustment có reason/reference;
- optimistic/pessimistic lock behavior;
- rollback trả state đúng.

### 20.5. Order

Phải test mọi state transition được phép và bị cấm:

~~~text
PENDING_PAYMENT
PAID
PROCESSING
SHIPPED
COMPLETED
CANCELLED
REFUND_PENDING
REFUNDED
~~~

Tên state thực tế theo domain, nhưng test phải chứng minh:

- không bỏ bước trái phép;
- không lùi state bởi event cũ;
- cancel đúng điều kiện;
- customer/staff/admin có quyền khác nhau;
- address/price snapshot không bị thay đổi theo profile/product sau này;
- audit event được ghi;
- duplicate command không tạo side effect.

### 20.6. Payment

Phải test:

- amount/currency khớp order;
- internal payment ID khác provider ID;
- create payment idempotent;
- provider success/failure/pending;
- timeout;
- malformed provider response;
- redirect/callback không tự đánh dấu paid;
- webhook signature;
- duplicate webhook;
- out-of-order webhook;
- amount mismatch;
- event ID unique;
- reconciliation;
- payment thành công chỉ cập nhật order một lần;
- log không chứa secret/raw credential.

### 20.7. Refund

Phải test:

- full refund;
- partial refund;
- nhiều partial refund;
- tổng refund không vượt amount;
- refund khi payment chưa thành công;
- duplicate Idempotency-Key;
- concurrent refund;
- provider pending/failure/success;
- duplicate/out-of-order webhook;
- order/payment state sau refund;
- audit và authorization.

### 20.8. Promotion/coupon

Phải test:

- start/end instant;
- timezone boundary;
- min order;
- max discount;
- applicable product/category/brand;
- user quota;
- global quota;
- usage đồng thời;
- disabled/deleted coupon;
- stacking rule;
- rounding;
- coupon thay đổi giữa cart và checkout;
- rollback không tiêu quota sai.

### 20.9. Shipment

Phải test:

- quote shipping;
- address/service area;
- provider timeout;
- create shipment idempotent;
- tracking code;
- invalid state transition;
- duplicate callback/webhook;
- event cũ không lùi trạng thái;
- customer không sửa internal shipment state.

### 20.10. Review

Phải test:

- chỉ người đủ điều kiện được review;
- ownership/order item;
- một review theo rule;
- rating boundary;
- moderation;
- hidden/rejected content không public;
- admin note không lộ;
- pagination/rate limit;
- update/delete authorization.

---

## 21. Transaction và concurrency tests

### 21.1. Không mô phỏng concurrency bằng gọi tuần tự

Concurrency test phải dùng:

- nhiều thread;
- transaction độc lập;
- connection/EntityManager độc lập;
- barrier/latch để tạo race;
- timeout để phát hiện deadlock;
- assertion state cuối.

### 21.2. Invariant cần chứng minh

Tối thiểu:

- không oversell;
- stock không âm;
- một idempotency key không tạo hai order;
- provider event ID chỉ xử lý một lần;
- refresh token rotation không phát hai family hợp lệ ngoài chính sách;
- coupon quota không âm/vượt;
- refund total không vượt payment;
- optimistic lock từ chối lost update;
- deadlock retry không lặp side effect.

### 21.3. Thiết kế test

Một concurrency test tốt phải:

1. tạo precondition;
2. sẵn sàng nhiều worker;
3. release cùng lúc;
4. chờ có timeout;
5. thu success/failure;
6. đọc state bằng transaction mới;
7. assert invariant tổng;
8. kiểm tra không có side effect trùng.

Không chỉ assert “có exception”.

### 21.4. Lặp có kiểm soát

Race test có thể lặp nhiều vòng để tăng khả năng bắt lỗi, nhưng:

- số vòng phải hữu hạn;
- timeout rõ;
- failure phải ghi iteration/seed;
- không dùng lặp để thay deterministic synchronization.

### 21.5. Parallel JUnit

- Unit test thuần có thể chạy parallel.
- Integration test mặc định không parallel cho tới khi DB, port, file và mock server được cô lập.
- Không bật global parallel rồi đánh dấu lock rải rác để chữa cháy.

---

## 22. Idempotency tests

Mọi operation dùng `Idempotency-Key` phải có reusable conformance test kiểm tra:

| Kịch bản | Kết quả |
| --- | --- |
| Key mới | Operation chạy một lần |
| Replay sau hoàn tất | Cùng status/body/header contract |
| Cùng key khác payload | `422` |
| Cùng key đang xử lý | `409` |
| Thiếu key bắt buộc | `400` |
| Retry sau timeout | Không duplicate side effect |
| Key hết retention | Theo contract đã công bố |

Phải test:

- scope theo principal/path/method;
- payload fingerprint;
- transaction rollback;
- crash window mô phỏng khi khả thi;
- provider idempotency propagation;
- response replay không chứa dữ liệu của principal khác;
- cleanup record.

Không mock repository idempotency trong test duy nhất của luồng critical.

---

## 23. External integration tests

### 23.1. Các tầng

Mỗi integration payment/shipping/email/SMS/storage phải có:

1. unit test adapter với mock HTTP/client boundary;
2. stub-server integration test với HTTP thật;
3. contract/fixture test;
4. sandbox smoke test theo lịch nếu provider cung cấp.

### 23.2. Stub server

Stub phải kiểm tra:

- method/path/query;
- required header;
- authentication;
- idempotency key;
- request JSON;
- signature;
- timeout;
- response parsing.

Phải mô phỏng:

- 2xx;
- 4xx;
- 5xx;
- timeout;
- connection reset khi phù hợp;
- malformed JSON;
- missing field;
- duplicate response/event;
- slow response;
- rate limit.

### 23.3. Sandbox

- Không phụ thuộc sandbox provider trong PR gate thông thường.
- Sandbox test chạy scheduled/manual do độ ổn định bên ngoài.
- Credential phải từ secret manager.
- Không commit credential.
- Sandbox failure phải phân loại provider outage hay regression.

### 23.4. Contract drift

- Fixture phải có nguồn/version/ngày cập nhật.
- Thay đổi provider SDK/API phải chạy contract suite.
- Không chỉ mock interface tự định nghĩa rồi cho rằng integration hoạt động.
- Phải test serialization thực của provider client hoặc HTTP adapter.

---

## 24. Async, event, outbox và scheduler tests

### 24.1. Async

- Không dùng sleep.
- Dùng Awaitility với timeout/poll interval hợp lý.
- Assert eventual state và side effect count.
- Test duplicate/retry.
- Test failure không làm mất message.

### 24.2. Outbox

Phải test:

- business state và outbox record commit cùng transaction;
- rollback không để outbox orphan;
- publisher retry;
- duplicate publish;
- mark published;
- poison event;
- cleanup/retention;
- ordering theo aggregate nếu contract yêu cầu.

### 24.3. Inbox/webhook

Phải test:

- unique event ID;
- verify trước persist/process theo contract;
- duplicate ack an toàn;
- processing retry;
- failed state;
- manual replay/reconciliation;
- không xử lý event của provider sai.

### 24.4. Scheduler

- Inject Clock.
- Không chờ clock thật.
- Test lock nếu nhiều instance chạy.
- Test job restart/idempotency.
- Test batch boundary.
- Test partial failure.
- Cleanup job không xóa record còn hiệu lực.

---

## 25. File upload và media tests

Phải test:

- file hợp lệ;
- empty file;
- quá kích thước;
- extension giả;
- MIME sai;
- magic bytes sai;
- filename path traversal;
- filename Unicode;
- duplicate;
- content scan/quarantine nếu có;
- storage timeout/failure;
- cleanup khi DB transaction lỗi;
- authorization upload/delete/download;
- signed URL expiry;
- response không lộ local path;
- image metadata/processing nếu có.

Không dùng một file “ảnh” text đơn giản làm bằng chứng duy nhất cho validation nội dung.

Test fixture binary phải nhỏ, có license/nguồn rõ và không chứa dữ liệu nhạy cảm.

---

## 26. Cache tests

Nếu có cache, phải test:

- cache hit;
- cache miss;
- key đúng scope;
- user A không nhận dữ liệu user B;
- invalidation khi update/delete;
- TTL;
- stale data policy;
- serialization;
- cache unavailable;
- cache stampede mitigation nếu có;
- public/private/no-store header;
- ETag/304.

Cache test không được chỉ verify method gọi cache API; phải chứng minh behavior quan sát được.

Giá và availability cache không thay thế checkout revalidation; phải có test riêng.

---

## 27. Contract và backward compatibility tests

### 27.1. OpenAPI

Contract suite phải:

- parse/validate `openapi.yaml`;
- resolve all `$ref`;
- kiểm tra example;
- kiểm tra duplicate operationId;
- validate request/response schema;
- kiểm tra security declaration;
- kiểm tra ProblemDetail;
- chạy breaking-change diff.
- xác nhận một source of truth duy nhất; không validate YAML và runtime annotation như hai contract độc lập chưa có ADR.
- kiểm tra Swagger UI trỏ đúng contract source hoặc runtime spec đã được phê duyệt.
- kiểm tra local/demo expose đúng docs và production tắt/bảo vệ `/swagger-ui/**`, `/v3/api-docs/**`, `/openapi/**` theo policy.

### 27.2. Implementation conformance

Phải có test chứng minh:

- path/method/status thực khớp OpenAPI;
- request validation khớp schema;
- response body/header khớp schema;
- error code/type đã công bố;
- enum và nullable đúng;
- ID/money/time đúng.
- public/protected operation trong OpenAPI khớp SecurityFilterChain và method/service authorization.
- Try it out demo không trỏ production database/provider; integration test không dựa vào shared environment.

### 27.3. Mobile compatibility

Do mobile client có thể không nâng cấp ngay:

- lưu contract baseline của phiên bản đang support;
- test response field mới không phá client tolerant;
- xem enum mới như rủi ro breaking;
- test deprecation headers;
- không xóa endpoint trước thời hạn support;
- critical API nên có smoke test bằng generated/representative client cũ.

### 27.4. Internal event contract

Event giữa module phải test:

- event type/version;
- required field;
- serialization;
- backward-compatible addition;
- consumer unknown field;
- duplicate;
- schema migration nếu lưu event.

---

## 28. End-to-end tests

### 28.1. Phạm vi tối thiểu

E2E critical phải bao phủ:

1. đăng ký/xác thực;
2. duyệt catalog;
3. tạo cart;
4. áp coupon nếu có;
5. checkout;
6. payment success/failure mô phỏng;
7. order state;
8. cancel/refund;
9. admin cập nhật catalog/inventory;
10. ownership giữa hai customer.

### 28.2. Nguyên tắc

- Chạy qua HTTP public contract.
- Không gọi repository để thực hiện bước hành vi đang kiểm tra.
- Có thể dùng setup API/admin fixture riêng được bảo vệ.
- Mỗi test có data namespace riêng.
- Không phụ thuộc thứ tự.
- Cleanup an toàn.
- Không dùng provider production.

### 28.3. Số lượng

E2E chỉ tập trung luồng có giá trị/rủi ro cao.

Không dùng E2E để test mọi validation field đã có ở tầng thấp hơn.

---

## 29. Performance, load và resilience tests

### 29.1. Không đặt SLO mơ hồ

Mỗi performance scenario phải ghi:

- môi trường/hardware;
- application version;
- database version;
- dataset size;
- concurrency;
- request mix;
- warm-up;
- duration;
- p50/p95/p99;
- throughput;
- error rate;
- CPU/memory;
- DB connections/query latency;
- pass/fail threshold.

Không so kết quả từ hai môi trường khác nhau như cùng baseline.

### 29.2. Scenario quan trọng

Tối thiểu:

- product list/filter/search;
- product detail;
- cart mutation;
- checkout;
- concurrent checkout cùng SKU;
- order history;
- admin order list;
- webhook ingestion;
- payment/refund adapter;
- migration/backfill lớn.

### 29.3. Query budget

Endpoint quan trọng phải có query-count regression test hoặc metric:

- không N+1;
- page size tăng không làm query count tăng tuyến tính ngoài dự kiến;
- query dùng index phù hợp;
- không load graph thừa;
- không count đắt ngoài contract.

Query budget cụ thể phải được ghi theo endpoint sau khi đo, không đoán.

### 29.4. Resilience

Phải test:

- timeout;
- retry có backoff/jitter;
- circuit breaker nếu dùng;
- rate limit;
- connection pool saturation;
- DB/provider unavailable;
- partial failure;
- graceful degradation;
- recovery;
- không lặp side effect khi retry.

### 29.5. Loại test

- Load: tải dự kiến.
- Stress: vượt tải để tìm giới hạn.
- Spike: tăng tải đột ngột.
- Soak: chạy dài để tìm leak.
- Capacity: xác định ngưỡng scale.

Performance test không chạy ngẫu nhiên trên laptop rồi dùng làm release evidence.

---

## 30. Coverage và mutation testing

### 30.1. Coverage baseline

Với dự án mới, baseline mặc định:

| Phạm vi | Line coverage | Branch coverage |
| --- | ---: | ---: |
| Toàn application code | ≥ 80% | ≥ 70% |
| Auth/order/payment/inventory/pricing | ≥ 90% | ≥ 80% |
| Code mới/thay đổi critical | ≥ 90% | ≥ 85% |

Ngưỡng có thể được điều chỉnh bằng quyết định kiến trúc/kỹ thuật có lý do, nhưng không được giảm chỉ để merge.

### 30.2. Coverage không phải bằng chứng đủ

Coverage không chứng minh:

- assertion đúng;
- concurrency an toàn;
- security đúng;
- migration chạy được;
- integration thật hoạt động;
- edge case đã test.

Không viết test chỉ gọi code mà không kiểm tra outcome để tăng coverage.

### 30.3. Exclusion

Chỉ exclude:

- generated code;
- framework bootstrap rất mỏng;
- DTO thuần không logic nếu được thống nhất;
- code không thể kiểm tra hợp lý và có lý do.

Không exclude package vì coverage thấp.

Danh sách exclusion phải được review và version control.

### 30.4. Mutation testing

Mutation testing nên chạy scheduled hoặc trên module critical:

- pricing;
- discount;
- inventory;
- order state machine;
- idempotency;
- token policy;
- refund calculation.

Mutation score thấp phải dẫn tới bổ sung assertion/case, không chỉ thêm coverage.

Không bắt mutation test trên generated/configuration code không có logic.

---

## 31. Flaky test policy

### 31.1. Zero tolerance

Flaky test là defect của test suite.

Không được:

- rerun vô hạn tới khi xanh;
- bỏ qua failure ngẫu nhiên;
- tăng sleep;
- tắt test không ghi nhận;
- nói “CI đôi lúc vậy”.

### 31.2. Quarantine

Chỉ quarantine khi:

- có issue;
- có owner;
- có nguyên nhân sơ bộ;
- có expiry, mặc định không quá 3 ngày làm việc;
- vẫn chạy ở job riêng;
- không che gate critical nếu test bảo vệ tiền, tồn kho hoặc security.

### 31.3. Retry

CI có thể retry một lần để thu thập chẩn đoán, nhưng:

- failure đầu phải được lưu;
- test phải bị đánh dấu flaky;
- retry pass không tự động chứng minh build ổn;
- không dùng retry cho test deterministic đáng lẽ phải đúng.

### 31.4. Chẩn đoán

Failure report nên có:

- seed;
- timestamp/Clock;
- container image;
- database version;
- request ID;
- thread dump khi timeout/deadlock;
- application log đã redact;
- mock server request journal;
- SQL state/error code;
- screenshot/log E2E khi phù hợp.

---

## 32. Spring context và tốc độ test

### 32.1. Context cache

Spring TestContext cache ApplicationContext theo configuration key.

Để tận dụng:

- dùng cấu hình test thống nhất;
- hạn chế profile/property tùy biến cho từng class;
- không tạo mock bean khác nhau vô tội vạ;
- không fork process cho từng test class;
- tránh `@DirtiesContext` nếu không thật sự cần.

### 32.2. Không tối ưu sai

Không làm test nhanh bằng cách:

- bỏ MySQL integration tests;
- mock SecurityFilterChain;
- bỏ Flyway;
- dùng schema create-drop;
- tắt authorization;
- bỏ full HTTP test;
- chạy tất cả trong một transaction che commit behavior.

### 32.3. Phân bổ thời gian

Mục tiêu:

- unit/architecture feedback trong vài phút;
- PR suite đủ nhanh để developer sử dụng thường xuyên;
- test dài chuyển sang suite riêng nhưng vẫn là release gate phù hợp;
- đo thời gian từng test class và xử lý outlier.

Không đặt con số thời gian cứng nếu CI chưa có baseline; sau khi đo phải đặt budget và theo dõi regression.

---

## 33. CI quality gates

### 33.1. Pull request

Mọi PR phải chạy tối thiểu:

1. compile;
2. static analysis/format nếu có;
3. unit/domain tests;
4. architecture/module tests;
5. OpenAPI lint/breaking diff;
6. integration tests với MySQL container;
7. Flyway validate + empty migrate;
8. API/security tests;
9. contract tests;
10. JaCoCo verification;
11. dependency/secret scan theo pipeline.

### 33.2. Main branch

Main phải bổ sung:

- full component suite;
- package/container startup;
- critical E2E;
- migration upgrade scenario;
- smoke test;
- report aggregation.

### 33.3. Nightly/scheduled

Nên chạy:

- performance/load;
- soak;
- DAST;
- mutation test;
- provider sandbox;
- backup/restore verification;
- large migration dataset;
- dependency deep scan.

### 33.4. Release gate

Release bị chặn nếu:

- test bắt buộc fail;
- test critical bị disabled/quarantine;
- OpenAPI breaking change chưa được duyệt;
- migration chưa test;
- coverage dưới gate;
- vulnerability nghiêm trọng chưa xử lý/accept;
- flaky critical chưa giải quyết;
- không có report cho checkout/payment/inventory/security.

### 33.5. Báo cáo

CI phải lưu:

- JUnit XML;
- HTML test report;
- JaCoCo report;
- contract diff;
- migration log đã redact;
- security scan report;
- performance summary nếu chạy;
- artifact/log chẩn đoán failure.

Không lưu secret trong artifact.

---

## 34. Workflow local cho developer và AI agent

### 34.1. Thứ tự chạy

Sau khi thay đổi code:

1. chạy test gần nhất của class/module;
2. chạy toàn unit suite;
3. chạy integration test liên quan;
4. chạy contract/security test liên quan;
5. chạy `check` trước khi bàn giao;
6. chạy full suite nếu thay đổi cross-cutting/critical.

### 34.2. Chọn test theo thay đổi

| Thay đổi | Test tối thiểu |
| --- | --- |
| Domain logic | Unit + parameterized + affected integration |
| Controller/DTO | WebMvc + JSON + OpenAPI contract |
| Repository/query | MySQL integration + pagination/query count |
| Migration | Validate + empty migrate + upgrade |
| Security config | Security matrix + full filter chain |
| Payment/shipping adapter | Unit + stub HTTP + contract |
| Checkout/inventory | Unit + DB + concurrency + E2E critical |
| Dependency/framework | Full context + integration + regression suite |

### 34.3. Báo cáo trung thực

AI agent phải báo chính xác:

- command đã chạy;
- suite đã chạy;
- số test pass/fail/skipped nếu có;
- test chưa chạy;
- lý do chưa chạy;
- rủi ro còn lại.

Không được nói “all tests pass” nếu chỉ chạy một test class.

Không được nói “đã verify” khi chỉ đọc code.

---

## 35. Bug fix và regression test

Mọi bug fix phải có regression test:

1. tái hiện lỗi;
2. test phải fail trên behavior cũ;
3. sửa code;
4. test phải pass;
5. chạy suite liên quan.

Regression test nên ở tầng thấp nhất bắt đúng lỗi, nhưng phải thêm integration test nếu lỗi nằm ở:

- transaction;
- mapping;
- database;
- serialization;
- security;
- framework configuration;
- provider contract.

Không viết test khớp chính implementation fix mà không tái hiện behavior lỗi.

Nếu không thể tạo automated regression test, phải báo lý do và có biện pháp thay thế được phê duyệt.

---

## 36. Review checklist cho test code

Reviewer phải kiểm tra:

- [ ] test name mô tả behavior;
- [ ] cấp test phù hợp;
- [ ] không load Spring vô ích;
- [ ] fixture tối thiểu;
- [ ] assertion đủ mạnh;
- [ ] negative/boundary case;
- [ ] time/random deterministic;
- [ ] không sleep;
- [ ] không phụ thuộc thứ tự;
- [ ] không dùng production data/secret;
- [ ] mock đúng boundary;
- [ ] không deep stub;
- [ ] database test dùng MySQL;
- [ ] migration chạy Flyway;
- [ ] security test có actor sai/owner sai;
- [ ] concurrency test dùng transaction độc lập;
- [ ] error/status/header contract đúng;
- [ ] cleanup an toàn;
- [ ] test không flaky;
- [ ] coverage tăng có ý nghĩa;
- [ ] CI task chứa test mới.

---

## 37. Definition of Done

Một thay đổi chỉ hoàn tất khi:

- [ ] acceptance criteria được chuyển thành test;
- [ ] unit/domain test đủ;
- [ ] integration test đúng boundary;
- [ ] security/ownership test đầy đủ;
- [ ] API contract test cập nhật;
- [ ] migration test nếu có DB change;
- [ ] concurrency/idempotency test nếu có shared state;
- [ ] external integration stub/contract test nếu có;
- [ ] bug có regression test;
- [ ] coverage gate đạt;
- [ ] không có flaky/disabled test không quản lý;
- [ ] local/CI task phù hợp pass;
- [ ] report không chứa secret;
- [ ] test chưa chạy và rủi ro được báo rõ.

Đối với checkout, inventory, payment, refund và authentication, “happy path pass” không đủ để đạt Definition of Done.

---

## 38. Hành vi bị cấm

Developer và AI agent không được:

- xóa test vì test phát hiện bug thật;
- giảm assertion để test pass;
- dùng `@Disabled` không issue/owner/expiry;
- dùng `Thread.sleep` để chữa race;
- phụ thuộc test order;
- gọi internet trong PR test;
- gọi payment/email/SMS production;
- dùng credential thật;
- dùng H2 để chứng minh MySQL behavior;
- dùng Hibernate create-drop thay Flyway integration;
- mock repository trong test duy nhất của transaction critical;
- mock SecurityFilterChain rồi tuyên bố authorization đã test;
- chỉ test role đúng mà không test role sai/owner sai;
- chỉ assert HTTP 200;
- catch exception rồi bỏ qua;
- auto-update snapshot;
- dùng random không seed;
- bật parallel integration test khi chưa isolation;
- gọi Flyway clean trên DB không xác minh;
- dùng dữ liệu production chưa mask;
- exclude code khỏi coverage chỉ để tăng số;
- rerun flaky vô hạn;
- bỏ test trong release bằng `-x test`;
- tuyên bố pass khi chưa chạy;
- đổi production code thành kém an toàn chỉ để dễ test.

---

## 39. Test exception report

Nếu không thể đáp ứng một yêu cầu test bắt buộc, phải báo:

~~~text
TEST REQUIREMENT EXCEPTION

- Rule/mục bị ảnh hưởng:
- Feature/module:
- Test bị thiếu:
- Lý do kỹ thuật:
- Rủi ro:
- Phạm vi ảnh hưởng:
- Biện pháp tạm thời:
- Bằng chứng thay thế:
- Owner:
- Deadline:
- Kế hoạch bổ sung test:
- Người phê duyệt:
~~~

Không được tự coi deadline gấp là phê duyệt bỏ test.

---

## 40. Test execution report

Khi hoàn tất task, AI agent phải dùng mẫu:

~~~text
TEST EXECUTION REPORT

- Thay đổi được kiểm tra:
- Test mới/thay đổi:
- Commands đã chạy:
- Unit tests:
- Integration tests:
- Contract tests:
- Security tests:
- Migration tests:
- E2E/performance tests:
- Pass/fail/skipped:
- Coverage:
- Test chưa chạy:
- Lý do:
- Rủi ro còn lại:
~~~

Nếu một suite không tồn tại hoặc môi trường không hỗ trợ Docker/network, phải ghi rõ thay vì bỏ qua im lặng.

---

## 41. Tài liệu tham chiếu chính thức

- Spring Boot Testing: https://docs.spring.io/spring-boot/reference/testing/
- Spring Boot Testcontainers: https://docs.spring.io/spring-boot/reference/testing/testcontainers.html
- Spring Framework Testing: https://docs.spring.io/spring-framework/reference/testing.html
- Spring MockMvc: https://docs.spring.io/spring-framework/reference/testing/mockmvc.html
- Spring Security Testing: https://docs.spring.io/spring-security/reference/servlet/test/
- Spring Modulith Testing: https://docs.spring.io/spring-modulith/reference/testing.html
- JUnit User Guide: https://docs.junit.org/current/user-guide/
- Gradle Java Testing: https://docs.gradle.org/current/userguide/java_testing.html
- Gradle JVM Test Suite: https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html
- Gradle JaCoCo Plugin: https://docs.gradle.org/current/userguide/jacoco_plugin.html
- Testcontainers for Java: https://java.testcontainers.org/
- ArchUnit User Guide: https://www.archunit.org/userguide/html/000_Index.html
- Flyway Validate: https://documentation.red-gate.com/fd/validate-277578898.html
- OWASP Web Security Testing Guide: https://owasp.org/www-project-web-security-testing-guide/
- OWASP API Testing: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/12-API_Testing/00-API_Testing_Overview

---

## 42. Nguyên tắc cuối cùng

Test suite là hệ thống cảnh báo và bằng chứng kỹ thuật của dự án.

Một test suite tốt phải trả lời được:

1. nghiệp vụ có đúng không;
2. dữ liệu có toàn vẹn không;
3. người dùng có đúng quyền không;
4. retry/concurrency có tạo side effect trùng không;
5. API có còn tương thích không;
6. migration có chạy được không;
7. failure có quan sát và chẩn đoán được không;
8. release có đủ an toàn không.

Nếu test không thể chứng minh các rủi ro quan trọng của thay đổi, thay đổi đó chưa sẵn sàng để phát hành.

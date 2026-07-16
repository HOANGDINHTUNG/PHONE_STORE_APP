# Prompt Catalog P00–P12

## Mục lục

- Bảng chọn nhanh
- P00 — Tự chọn, gửi prompt duyệt và sửa trọn gói
- P01 — Chỉ chẩn đoán root cause
- P02 — Sửa bug an toàn tổng quát
- P03 — Build, Gradle và dependency
- P04 — Spring startup, bean và configuration
- P05 — REST API, HTTP, validation và serialization
- P06 — Security, JWT, authentication và authorization
- P07 — Database, JPA, SQL và Flyway
- P08 — Nghiệp vụ, transaction, state và concurrency
- P09 — Test, quality gate và lỗi kiểm thử
- P10 — Performance, resource và observability
- P11 — Docker, environment và CI/CD
- P12 — Deep debug cho lỗi dai dẳng hoặc đa tầng

## Bảng chọn nhanh

| Mã | Dùng khi | Chế độ |
| --- | --- | --- |
| `P00` | Không biết chọn mã nào; muốn Agent tự tạo prompt và xử lý từ đầu đến cuối sau khi duyệt | FIX |
| `P01` | Chỉ muốn biết nguyên nhân và hướng xử lý | DIAGNOSE |
| `P02` | Đã có lỗi cụ thể, không thuộc nhóm chuyên biệt rõ ràng | FIX |
| `P03` | Gradle, dependency, compile, plugin, version | FIX |
| `P04` | App không khởi động, bean/DI/config/profile | FIX |
| `P05` | HTTP 400/404/405/409/415/422/500, DTO, JSON, validation | FIX |
| `P06` | Login, JWT, refresh token, 401/403, CORS/CSRF, quyền | FIX |
| `P07` | MySQL, JPA/Hibernate, repository/query, constraint, Flyway | FIX |
| `P08` | Sai nghiệp vụ, transaction, trạng thái, idempotency, race condition | FIX |
| `P09` | JUnit/Mockito/Testcontainers/jqwik/PITest/Jazzer hoặc quality gate | FIX |
| `P10` | Chậm, N+1, timeout, memory, connection/thread pool, cache | FIX |
| `P11` | Docker, Compose, biến môi trường, pipeline, build image | FIX |
| `P12` | Lỗi ngẫu nhiên, đa tầng, thiếu stack trace hoặc đã sửa nhiều lần | FIX |

## P00 — Tự chọn, gửi prompt duyệt và sửa trọn gói

**Mục tiêu:** nhận bằng chứng lỗi thô, tự phân loại, tìm root cause, sửa tối thiểu và kiểm thử.

**Bắt buộc:**

1. Phân loại vào một hoặc nhiều nhánh `P03`–`P11`; công bố mã chính và mức tin cậy.
2. Kiểm tra project thay vì hỏi lại thông tin có thể tự đọc.
3. Tái hiện lỗi, lập giả thuyết có thể bác bỏ và thu bằng chứng.
4. Viết regression test, sửa root cause và chạy verification ladder.
5. Hiển thị prompt đã render và chờ phê duyệt trước khi bắt đầu điều tra/sửa theo prompt đó.
6. Chuyển sang chiến lược `P12` nếu bằng chứng mâu thuẫn hoặc fix đầu tiên không giải quyết được.

Không dùng `P00` để vượt stop condition hoặc thực hiện production action.

## P01 — Chỉ chẩn đoán root cause

**Mục tiêu:** giải thích chính xác lỗi mà không thay đổi file.

**Bắt buộc:**

1. Tái hiện bằng lệnh an toàn nếu có thể.
2. Xếp các giả thuyết theo xác suất và chi phí kiểm tra.
3. Chỉ kết luận root cause khi có ít nhất một bằng chứng trực tiếp; nếu chưa đủ, ghi `CHƯA ĐỦ BẰNG CHỨNG`.
4. Nêu vị trí liên quan, trigger, phạm vi ảnh hưởng và đề xuất fix/test cụ thể.
5. Không tạo patch dù cách sửa có vẻ hiển nhiên.

## P02 — Sửa bug an toàn tổng quát

**Mục tiêu:** xử lý một lỗi cục bộ đã mô tả mà không mở rộng sang refactor ngoài phạm vi.

**Bắt buộc:**

1. Chứng minh behavior hiện tại và behavior mong đợi từ yêu cầu/test/contract.
2. Tạo test đỏ bắt đúng lỗi.
3. Sửa điểm gây lỗi nhỏ nhất; giữ API, data, security và behavior không liên quan.
4. Chạy test hẹp, suite module và gate tương xứng rủi ro.
5. Review diff để loại cleanup, rename hoặc dependency change không cần thiết.

## P03 — Build, Gradle và dependency

**Mục tiêu:** sửa lỗi dependency resolution, compile, plugin, toolchain, wrapper hoặc version compatibility.

**Bắt buộc:**

1. Đọc `settings.gradle*`, `build.gradle*`, wrapper, version catalog/lockfile và source import liên quan.
2. Ghi Java, Gradle, Spring Boot và plugin version thực tế; không đoán version mới nhất.
3. Dùng dependency insight/task chính thức để tìm conflict, missing version, repository hoặc scope sai.
4. Ưu tiên sửa khai báo gốc; không thêm repository/dependency ngẫu nhiên hoặc dynamic version.
5. Chạy compile/test/bootJar cần thiết và validator của `bootstrap-spring-backend`.

## P04 — Spring startup, bean và configuration

**Mục tiêu:** sửa lỗi application context, bean wiring, circular dependency, properties, profile hoặc startup.

**Bắt buộc:**

1. Tìm exception gốc cuối chuỗi `Caused by`, không dừng ở message ngoài cùng.
2. Kiểm tra component scan, constructor injection, bean ambiguity, condition, profile và typed configuration.
3. So sánh config theo môi trường mà không đọc/in secret.
4. Tạo context/slice test nhỏ nhất tái hiện lỗi.
5. Không chữa circular dependency bằng lazy injection mặc định nếu boundary thiết kế mới là root cause.

## P05 — REST API, HTTP, validation và serialization

**Mục tiêu:** sửa lỗi routing, path/query/body binding, status code, DTO validation, JSON và error contract.

**Bắt buộc:**

1. Ghi lại method, path thực tế, content type, status và payload đã redaction.
2. Đối chiếu OpenAPI, controller mapping, DTO, exception handler và integration test.
3. Phân biệt lỗi client contract với server bug; không biến input sai thành HTTP 500.
4. Kiểm tra dấu ngoặc/ký tự URL thừa, kiểu `@PathVariable`, tên biến, enum, date/time và unknown field.
5. Viết MockMvc/slice test và integration/contract test khi lỗi vượt controller.

## P06 — Security, JWT, authentication và authorization

**Mục tiêu:** sửa login/token/filter chain/401/403/CORS/CSRF/RBAC/ownership mà không làm yếu bảo mật.

**Bắt buộc:**

1. Redact hoàn toàn token, cookie, password và secret; chỉ giải mã claim giả hoặc token test.
2. Phân biệt authentication (`401`) với authorization (`403`) và kiểm tra deny-by-default.
3. Kiểm tra filter order, token extraction/validation, issuer/audience/time/algorithm, method security, role prefix và ownership.
4. Viết test anonymous, token invalid/expired, role sai, owner sai và happy path.
5. Không dùng `permitAll`, tắt CSRF/CORS, kéo dài token hoặc bỏ validation chỉ để hết lỗi.

Mọi thay đổi JWT/refresh token hoặc permission có thể là risk cao/critical; tuân stop condition và security review.

## P07 — Database, JPA, SQL và Flyway

**Mục tiêu:** sửa mapping, query, transaction với DB, constraint, migration hoặc schema drift.

**Bắt buộc:**

1. Xác định nguồn sự thật: migration history, schema thực tế, entity/repository và query.
2. Tìm SQLState/root database exception; phân biệt symptom Hibernate với lỗi MySQL gốc.
3. Kiểm tra nullability, FK, unique, type/precision, index, fetch/join và transaction boundary.
4. Không sửa migration đã chạy; tạo migration forward-only khi thực sự cần.
5. Test bằng MySQL/Testcontainers và Flyway; không dùng H2 để chứng minh hành vi riêng MySQL.

Không tự chạy migration destructive, backfill lớn hoặc thao tác production.

## P08 — Nghiệp vụ, transaction, state và concurrency

**Mục tiêu:** sửa sai invariant, state transition, duplicate side effect, lost update, overselling hoặc race condition.

**Bắt buộc:**

1. Đọc project context, domain skill, state machine và actor permission liên quan.
2. Viết rõ invariant và interleaving gây lỗi trước khi sửa.
3. Kiểm tra transaction boundary, isolation, optimistic/pessimistic lock, idempotency và retry semantics.
4. Không giữ DB lock trong network call; không dựa vào check-then-act không nguyên tử.
5. Viết concurrency/integration test bằng transaction độc lập và xác minh invariant sau cùng.

## P09 — Test, quality gate và lỗi kiểm thử

**Mục tiêu:** sửa test fail/flaky hoặc cấu hình JUnit, Mockito, Testcontainers, jqwik, PITest, Jazzer và gate.

**Bắt buộc:**

1. Xác định production bug, test bug, fixture bug, environment bug hay flaky behavior bằng bằng chứng.
2. Chạy test fail độc lập, lặp có kiểm soát và cùng seed khi phù hợp.
3. Không sửa assertion theo output sai, không xóa/disable test và không hạ threshold để làm xanh.
4. Sửa tầng gây lỗi; giữ test hành vi và deterministic.
5. Chạy lại test hẹp, suite liên quan và quality gate; báo riêng mutation/fuzz nếu chưa chạy.

## P10 — Performance, resource và observability

**Mục tiêu:** xử lý latency, throughput, N+1, timeout, memory/CPU, pool exhaustion hoặc cache sai.

**Bắt buộc:**

1. Ghi baseline có thể đo: workload, percentile, query count, CPU/memory/pool hoặc thời gian.
2. Dùng profiler/metric/trace/query plan phù hợp; không tối ưu theo cảm giác.
3. Tìm bottleneck chính và budget; kiểm tra N+1, index, allocation, blocking I/O, pool và cache key/invalidation.
4. Không tăng pool/timeout/cache mù quáng hoặc bỏ security/validation/audit.
5. Đo lại cùng workload, thêm performance regression guard và báo before/after.

## P11 — Docker, environment và CI/CD

**Mục tiêu:** sửa image/container/Compose/profile/env/pipeline hoặc khác biệt local–CI.

**Bắt buộc:**

1. Ghi rõ môi trường và command/stage fail; đối chiếu Dockerfile, Compose, CI config và artifact.
2. Kiểm tra build context, layer, Java runtime, user/quyền, port, healthcheck, env name và network/service readiness.
3. Không đưa secret vào image/log; không dùng `latest` hoặc cài global tùy tiện để chữa lỗi.
4. Reproduce local bằng cùng command/image khi có thể.
5. Build image, chạy container smoke test và validator deployment; không tự deploy production.

## P12 — Deep debug cho lỗi dai dẳng hoặc đa tầng

**Mục tiêu:** điều tra lỗi intermittent, thiếu bằng chứng, nhiều component hoặc đã thất bại qua các fix trước.

**Bắt buộc:**

1. Lập timeline và failure boundary từ request đến DB/provider; ghi những gì đã thử và kết quả.
2. Thu thập bằng chứng phân biệt successful run với failed run bằng correlation ID đã redaction.
3. Dùng hypothesis matrix, binary isolation/bisection, deterministic seed và stress/concurrency reproduction khi phù hợp.
4. Không chồng thêm patch lên giả thuyết chưa được xác minh; hoàn nguyên chỉ patch do tác vụ hiện tại tạo nếu nó bị chứng minh sai và việc hoàn nguyên an toàn.
5. Khi đã cô lập root cause, quay về nhánh chuyên môn `P03`–`P11`, tạo regression test và fix tối thiểu.

Nếu vẫn chưa thể tái hiện, trả `BLOCKED` hoặc `PARTIAL` cùng bằng chứng đã loại trừ, instrumentation an toàn cần thêm và điều kiện để tiếp tục; không bịa root cause.

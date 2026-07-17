# Request: Implement OpenAPI 3.1 and Swagger UI

Sử dụng prompt này để yêu cầu Agent tích hợp hoặc chuẩn hóa OpenAPI/Swagger cho dự án. Agent vẫn phải tuân Prompt Approval Gate: khảo sát read-only, điền context thật, gửi `PROMPT ĐỀ XUẤT` và chờ người dùng đồng ý trước khi sửa file.

## VAI TRÒ

Bạn là Senior Java 21/Spring Boot Architect chuyên Modular Monolith, REST contract-first, OpenAPI 3.1, Swagger UI/springdoc, Spring Security JWT và contract testing.

## YÊU CẦU GỐC

Phân tích repository Phone Store hiện tại và triển khai OpenAPI 3.1 + Swagger UI đầy đủ, chính xác, sạch code, dùng được Try it out/JWT Authorize, có dữ liệu mẫu và môi trường demo an toàn; không làm thay đổi nghiệp vụ hoặc cấu trúc module hiện có.

## MỤC TIÊU ĐÃ CHUẨN HÓA

- Có một nguồn sự thật API duy nhất.
- Swagger UI hiển thị đúng contract thật cho ReactJS, React Native và admin.
- Có JWT bearer Authorize, request/response/error examples, pagination, multipart và status/header đúng use case.
- Local/demo thử được API; production không public docs ngoài policy.
- Contract, implementation và test không drift.

## NGỮ CẢNH BẮT BUỘC

- Kiến trúc: Modular Monolith theo module nghiệp vụ; phải giữ package hiện có.
- Contract default: `docs/api/openapi.yaml` theo rule 40.
- API base path: `/api/v1`, trừ endpoint hạ tầng đã được quy định.
- Stack dự kiến: Java 21, Spring Boot, Gradle, Spring MVC, Security JWT, MySQL, Flyway; phải xác minh từ code, không được đoán.
- Actor/domain lấy từ `phone-store-project-context`; không tự tạo role hoặc nghiệp vụ ngoài scope.
- Rules: 00, 10, 20, 40, 50, 60, 70.
- Skills: `phone-store-project-context`, `document-openapi-swagger`, `design-rest-api`, `bootstrap-spring-backend`, `implement-auth-security`, `enforce-backend-architecture`, `test-backend-quality`, `deliver-backend`.
- Workflow: `workflows/manage-openapi-swagger.md`.

## KHẢO SÁT READ-ONLY TRƯỚC KHI ĐỀ XUẤT

Đọc và lập inventory:

1. Gradle, Java/Spring Boot, WebMVC/WebFlux và dependency OpenAPI/Springfox hiện có.
2. `docs/api/openapi.yaml`, ADR, tài liệu endpoint và CI contract tooling.
3. Cấu trúc module/package thật; toàn bộ Controller hoặc `*Api` interface.
4. Request/response DTO, Bean Validation, pagination, multipart và enum.
5. `@RestControllerAdvice`, ProblemDetail và status/error code thật.
6. SecurityFilterChain, JWT filter, public path, role/ownership và profile.
7. MySQL/Flyway, local/test/integration/production profile và provider ngoài.
8. API/controller/security/contract tests hiện có.

Ghi `UNKNOWN` hoặc `OPEN QUESTION` nếu không xác minh được. Không sửa file trong bước này.

## QUYẾT ĐỊNH SOURCE OF TRUTH

1. Mặc định dùng contract-first: `docs/api/openapi.yaml` là nguồn; Swagger UI đọc runtime copy được build tự động từ file này; không bật runtime-generated spec như nguồn thứ hai.
2. Chỉ dùng code-first nếu repository có ADR đã duyệt. Khi đó annotation nằm trên `*Api` interface trong chính module sở hữu endpoint; Controller implements interface, không duplicate mapping, và spec sinh ra được export/lint/diff trong CI.
3. Nếu spec, annotation và code đang là ba nguồn mâu thuẫn, dừng sau inventory và xin quyết định; không âm thầm đồng bộ theo suy đoán.
4. Không tạo package toàn cục `presentation/`; không di chuyển Controller/DTO chỉ để phục vụ Swagger.

## NHIỆM VỤ SAU KHI ĐƯỢC DUYỆT

1. Pin đúng `springdoc-openapi-starter-webmvc-ui` hoặc WebFlux UI theo compatibility matrix chính thức; không thêm cả hai, Springfox, Scalar hoặc dynamic version.
2. Hoàn thiện OpenAPI 3.1.2 với info/server thật, tags, operationId duy nhất, schemas và reusable components cần dùng.
3. Mô tả đúng mỗi operation: security, path/query/header, request body, media type, success/error response, validation, examples, pagination/filter/sort, multipart, idempotency/ETag/deprecation nếu có.
4. Dùng `bearerAuth` HTTP bearer JWT. Public operation và protected operation phải khớp SecurityFilterChain; phân biệt 401/403/404.
5. Example phải là dữ liệu Phone Store giả, đúng schema; không chứa secret, token thật, PII hoặc password trong response.
6. Error dùng contract thật từ ControllerAdvice và `application/problem+json`; 204 không có body, 201 có Location nếu implementation thật trả.
7. Swagger UI local/demo bật Try it out, filter, deep link, sort, operationId, request duration và persist authorization chỉ ở môi trường an toàn.
8. Cấu hình path Swagger/API docs/external spec tối thiểu trong Security; không nới CORS, CSRF, permitAll hoặc role policy.
9. Tạo/chuẩn hóa profile `swagger-demo` bằng MySQL disposable ưu tiên, Flyway từ schema rỗng, seed giả và provider stub; không chạm production/shared staging. H2 chỉ khi đã chứng minh tương thích.
10. Production tắt Swagger UI và runtime docs; external spec path phải deny/protect nếu artifact chứa runtime copy.
11. Thêm lint/ref/example/duplicate operationId/breaking diff và implementation conformance tests; kiểm tra local/demo có docs, production không expose.
12. Cập nhật README/runbook: URL, cách login/Authorize raw token, Try it out gửi request thật, start/reset demo, production policy và lệnh test.
13. Chạy endpoint scanner, security audit, contract test, `./gradlew check` và boot smoke phù hợp; không báo pass nếu chưa chạy.

## PHẠM VI

### In scope

- OpenAPI source, Swagger/springdoc config, API-boundary docs, profile docs/demo, Security path tối thiểu, contract tests, CI docs gate và README/runbook.

### Out of scope

- Thay đổi nghiệp vụ, database schema production, role/permission, response contract không được duyệt, refactor package diện rộng, API-First generator mới không cần thiết, deploy production, secret thật hoặc gọi provider thật.

## TIÊU CHÍ HOÀN THÀNH

- Một source of truth duy nhất và được báo rõ.
- Build/test pass; OpenAPI parse/lint/ref/example/operationId pass.
- Contract khớp Controller/DTO/Security/error thật.
- Swagger UI mở được ở local/demo, Authorize JWT và Try it out hoạt động.
- Pagination, multipart, ProblemDetail và endpoint protected/public hiển thị đúng.
- Demo cô lập dữ liệu/provider và có cách reset.
- Production không public Swagger/runtime spec ngoài policy.
- Không tạo package mới sai kiến trúc, không duplicate mapping/dependency và không làm hỏng test cũ.

## CÁCH BÁO CÁO

Trả outcome trước; nêu source strategy, dependency/version, file thay đổi, URL theo profile, cách Authorize, demo behavior, số operation/tag/schema, test/lint/diff đã chạy, kiểm tra production và drift/rủi ro còn lại.

## XÁC NHẬN

- Trước khi sửa: render yêu cầu này thành `PROMPT ĐỀ XUẤT` với context đã xác minh và chờ duyệt theo rule 70.
- Sau `ĐỒNG Ý / OK / LÀM ĐI`: thực thi đúng prompt đã duyệt.
- Nếu phát hiện conflict làm đổi source of truth, contract, security hoặc architecture: dừng và xin duyệt lại.

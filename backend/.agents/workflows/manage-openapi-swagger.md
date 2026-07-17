# Manage OpenAPI Swagger

Tích hợp hoặc đồng bộ OpenAPI 3.1 và Swagger UI mà không tạo nguồn contract thứ hai hoặc thay đổi kiến trúc module.

## Đầu vào

Mục tiêu docs/Swagger, phạm vi endpoint, môi trường được bật, database demo, auth scheme và yêu cầu CI/contract test.

## Bắt buộc đọc

Rules 00/10/20/40/50/60/70; `phone-store-project-context`, `document-openapi-swagger`, `design-rest-api`, `bootstrap-spring-backend`, `implement-auth-security`, `enforce-backend-architecture`, `test-backend-quality` và `deliver-backend` khi chạm release/profile production.

## Trước phê duyệt

1. Chỉ khảo sát read-only build, package/module, OpenAPI/ADR, Controller/DTO, SecurityFilterChain, exception handler, profile, Flyway và test.
2. Xác định contract-first hay code-first theo rule 40; ghi rõ mọi conflict/UNKNOWN.
3. Render `prompts/REQUEST-OPENAPI-SWAGGER.md` bằng context thật thành `PROMPT ĐỀ XUẤT`, rồi dừng chờ phê duyệt.

## Sau phê duyệt

1. Chốt một source of truth; mặc định `docs/api/openapi.yaml`.
2. Pin đúng springdoc starter theo Spring Boot và WebMVC/WebFlux thực tế.
3. Hoàn thiện contract: tags, operationId, JWT, schema, examples, errors, pagination, multipart, idempotency và deprecation đã xác minh.
4. Cấu hình Swagger UI local/demo; không refactor package hoặc duplicate mapping.
5. Cấu hình `swagger-demo` với database/provider cô lập; cảnh báo Try it out có side effect.
6. Tắt/bảo vệ UI, runtime docs và external spec path trong production.
7. Thêm lint, duplicate operationId, breaking diff, implementation conformance và profile exposure tests.
8. Chạy endpoint scanner, security audit, contract tests, Gradle check và boot smoke phù hợp.
9. Cập nhật README/runbook/CI và review diff ngoài phạm vi.

## Dừng an toàn

Dừng nếu source of truth mâu thuẫn, cần breaking contract chưa có plan, package phải di chuyển rộng, production credential/database bị tham chiếu, demo còn side effect ra provider thật hoặc dependency/version chưa xác minh.

## Báo cáo

Nêu strategy/source, file thay đổi, dependency/version, URL docs theo profile, cách JWT Authorize, demo/reset behavior, contract/lint/diff/test evidence, production exposure và drift/rủi ro còn lại.

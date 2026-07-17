---
name: document-openapi-swagger
description: Thiết kế, tích hợp, đồng bộ và kiểm tra OpenAPI 3.1 cùng Swagger UI/springdoc cho backend Phone Store. Dùng khi tạo hoặc sửa docs API, cấu hình Swagger Try it out, JWT Authorize, request/response example, multipart, pagination, profile local/demo/production, contract test, OpenAPI diff hoặc xử lý drift giữa spec và Spring Controller.
---

# Document OpenAPI Swagger

Đọc rules 00, 20, 40, 50, 60, project context, `design-rest-api`, `implement-auth-security`, `bootstrap-spring-backend` và `test-backend-quality` trước khi thay đổi contract hoặc Swagger.

## Quy trình

1. Xác định nguồn sự thật theo [source-of-truth.md](references/source-of-truth.md). Mặc định dự án là contract-first tại `docs/api/openapi.yaml`.
2. Khảo sát Spring Boot, Spring MVC/WebFlux, Gradle, SecurityFilterChain, profile, Controller/DTO/error contract và tooling OpenAPI hiện có.
3. Tác giả hoặc đồng bộ contract theo [openapi-authoring.md](references/openapi-authoring.md); không bịa endpoint, field, role, status hoặc example.
4. Tích hợp Swagger UI/springdoc theo [springdoc-swagger-ui.md](references/springdoc-swagger-ui.md), pin version tương thích và giữ nguyên cấu trúc module hiện hữu.
5. Áp dụng JWT, profile và môi trường thử an toàn theo [swagger-security-demo.md](references/swagger-security-demo.md).
6. Kiểm tra lint, example, operationId, security, implementation conformance và production exposure theo [contract-verification.md](references/contract-verification.md).
7. Cập nhật CI, README/runbook và báo rõ source of truth, URL docs, cách Authorize, side effect của Try it out và rủi ro còn lại.

## Hai chiến lược được phép

- **Contract-first — mặc định:** sửa `docs/api/openapi.yaml`; Swagger UI đọc bản spec được build/copy từ file này. Runtime-generated `/v3/api-docs` không được trở thành nguồn sự thật thứ hai.
- **Code-first — ngoại lệ có ADR:** annotation đặt trên `*Api` interface trong chính module sở hữu endpoint; Controller implements interface và không khai báo mapping trùng. Spec sinh ra phải được export, lint, diff và kiểm tra trong CI; không sửa tay `docs/api/openapi.yaml` như một contract độc lập.

Nếu codebase, ADR và rule 40 không thống nhất về chiến lược, dừng ở read-only, nêu mâu thuẫn và xin quyết định; không tự tạo nguồn sự thật thứ hai.

## Ràng buộc kiến trúc

- Giữ Modular Monolith và package hiện có, ví dụ `modules/<module>/controller|dto|service...` hoặc `<module>/api|application|domain|infrastructure` nếu codebase đã dùng cấu trúc đó.
- Không tạo package toàn cục `presentation/` chỉ để chứa Swagger.
- Không đưa annotation tài liệu vào entity, domain, service hoặc repository.
- Không đổi business logic, path, status, validation hay authorization chỉ để docs đẹp.
- Không thêm Springfox, WebMVC + WebFlux đồng thời, UI thứ hai hoặc dependency động.
- Không dùng token, secret, PII hay URL production giả trong spec/example.
- Try it out gửi request thật; endpoint ghi chỉ thử trên môi trường cô lập.

## Hoàn tất khi

Contract hợp lệ và duy nhất, Swagger UI dùng đúng spec, JWT Authorize hoạt động, example khớp schema, API protected/public được mô tả đúng, demo không chạm production, production tắt hoặc bảo vệ docs, contract/conformance tests pass và không có package/mapping trùng phát sinh.

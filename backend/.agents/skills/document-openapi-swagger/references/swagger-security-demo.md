# Swagger security và demo environment

## JWT Authorize

Định nghĩa HTTP bearer scheme tên ổn định `bearerAuth`. Người dùng nhập raw access token; Swagger UI tự thêm `Authorization: Bearer <token>`.

- Login/register/refresh/public catalog chỉ public khi SecurityFilterChain thật cho phép.
- Endpoint protected phải mô tả security requirement tương ứng.
- Swagger không bypass role, ownership hoặc state guard; backend vẫn quyết định 401/403/404.
- Không log token và không đặt example token thật trong OpenAPI.

## Path tài liệu

Local/demo có thể permit đúng các path cần thiết:

- `/swagger-ui.html`;
- `/swagger-ui/**`;
- `/v3/api-docs/**` khi code-first;
- `/openapi/**` khi contract-first dùng runtime copy.

Không dùng wildcard rộng hơn, không public API nghiệp vụ và không nới CORS/CSRF chỉ vì Swagger.

Production phải tắt Swagger UI và runtime API docs. Nếu contract-first artifact vẫn chứa `/openapi/openapi.yaml`, Security phải deny/protect path này theo policy production.

## Try it out

Try it out gửi HTTP request thật:

- GET phải side-effect free theo contract.
- POST/PUT/PATCH/DELETE có thể ghi/xóa dữ liệu thật.
- Không thử endpoint ghi trên production hoặc shared staging.
- Không giả định rollback database sẽ hoàn tác email, Cloudinary, payment, Redis, message hoặc webhook.

## Môi trường `swagger-demo`

Ưu tiên MySQL disposable để khớp Flyway, enum, index, lock và native query:

- container/database riêng;
- không dùng production credential/endpoint;
- không dùng persistent volume hoặc có lệnh reset rõ;
- chạy Flyway từ schema rỗng;
- seed dữ liệu giả idempotent chỉ trong demo;
- stub/fake provider ngoài tại adapter bằng profile/config, không sửa business service.

H2 in-memory chỉ dùng khi project đã xác nhận tương thích và test không phụ thuộc MySQL semantics. Không bật H2 Console và không dùng `ddl-auto=update` để né Flyway.

README/runbook phải cảnh báo Try it out có side effect, nêu cách start/reset demo và cách lấy JWT test an toàn.

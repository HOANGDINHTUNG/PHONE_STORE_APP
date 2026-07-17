# API

Lưu OpenAPI contract, endpoint notes, compatibility/deprecation và example đã redaction.

## Quy tắc

- OpenAPI phải khớp controller/DTO/error thực tế.
- Ghi authentication, authorization, ownership và idempotency.
- Không dùng example chứa token, secret hoặc PII thật.
- Mọi breaking change có version/deprecation/migration guide.
- Diff OpenAPI là một phần review.

Bắt đầu từ [openapi.template.yaml](openapi.template.yaml).

## Hướng dẫn sử dụng Local Swagger UI

### 1. Đường dẫn truy cập (Local Environment)

- **Swagger UI URL:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI Schema static url:** [http://localhost:8080/openapi.yaml](http://localhost:8080/openapi.yaml)

### 2. Nguyên tắc đồng bộ Contract (Single Source of Truth)

- Toàn bộ thay đổi đối với API endpoints phải được cập nhật duy nhất tại file: `docs/api/openapi.yaml`.
- Hệ thống tự động đồng bộ file này sang thư mục resources tĩnh thông qua task Gradle `copyOpenApiSpec` mỗi khi Build hoặc Chạy ứng dụng.
- Không chỉnh sửa file `openapi.yaml` bên trong thư mục static resources hoặc build output một cách thủ công.

### 3. Hướng dẫn thử nghiệm API (Try it out)

1. Thực hiện lệnh gọi POST tới `/api/v1/auth/login` (hoặc `/api/v1/auth/register`) thông qua Swagger UI.
2. Sao chép nội dung trường `accessToken` trong kết quả trả về.
3. Bấm vào nút **Authorize** ở góc trên cùng của Swagger UI.
4. Dán token đã copy vào và chọn Authorize.
5. Kể từ thời điểm này, mọi request gửi qua nút "Try it out" sẽ tự động đính kèm Header `Authorization: Bearer <token>`.

### 4. Kiểm tra tính toàn vẹn (Contract Compliance Testing)

- Chạy toàn bộ integration tests, đặc biệt là `OpenApiConformanceTest`:
  ```powershell
  .\gradlew test
  ```
- File test `OpenApiConformanceTest.java` sẽ xác thực các kịch bản lỗi nghiệp vụ (`BAD_REQUEST`, `VALIDATION_FAILED`) của module Auth tương thích hoàn toàn so với mô tả trong `openapi.yaml`.

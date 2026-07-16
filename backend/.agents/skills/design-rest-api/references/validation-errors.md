# Validation và error contract

Error cần có:

- `code` ổn định cho máy.
- `message` an toàn cho người dùng.
- `status` HTTP.
- `path` và `requestId/correlationId`.
- `fieldErrors[]` với field, code, message khi validation.

## Mapping

- 400: JSON/parameter/validation sai.
- 401: chưa xác thực/token không hợp lệ.
- 403: đã xác thực nhưng thiếu quyền.
- 404: resource không tồn tại hoặc được che giấu.
- 409: conflict state, duplicate, idempotency mismatch.
- 412: precondition/ETag sai.
- 422: nghiệp vụ không thể xử lý nếu project chọn.
- 429: rate limit.
- 500/503: lỗi nội bộ/phụ thuộc tạm thời, không lộ chi tiết.

Không dùng exception class name làm code công khai.


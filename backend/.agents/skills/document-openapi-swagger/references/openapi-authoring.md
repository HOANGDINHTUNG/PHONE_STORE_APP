# OpenAPI authoring

## Mỗi operation

Phải mô tả path, method, tag, summary, `operationId` ổn định, security, parameter, content type, request schema, success/error response, header và example thực tế.

Chỉ thêm description dài khi behavior không hiển nhiên. Không liệt kê mọi status code cho mọi operation; lấy từ controller advice, security và use case thật.

## Component tái sử dụng

Ưu tiên component cho:

- `bearerAuth`;
- `Money`;
- RFC 9457 `ProblemDetail` và validation problem;
- page metadata;
- `Idempotency-Key`, `If-Match`, `ETag`, `Location`, `Retry-After` khi use case có dùng;
- ID, instant UTC và common error response.

Dùng [openapi-phone-store.template.yaml](../assets/openapi-phone-store.template.yaml) làm điểm khởi đầu, rồi xóa component không dùng và thêm path đã xác minh.

## Kiểu dữ liệu của dự án

- ID serialize nhất quán theo rule 40.
- Money dùng decimal chính xác và currency; không dùng binary floating point.
- Timestamp là ISO-8601 UTC, ví dụ `2026-07-15T08:30:00Z`.
- Enum public là contract; thêm giá trị phải đánh giá mobile compatibility.
- Collection rỗng là `[]`, required/nullable phải đúng OAS 3.1/JSON Schema.
- Request DTO có allowlist; không nhận field server-owned như role, owner, paid, total hoặc status nội bộ.

## Example

- Dùng dữ liệu giả đúng schema và nghiệp vụ Phone Store.
- Có example happy path và error quan trọng; không nhân bản hàng loạt example vô nghĩa.
- Password chỉ xuất hiện trong request example giả; không xuất hiện trong response.
- Không dùng token, email thật, phone thật, secret, provider payload hay PII production.
- Example hợp lệ phải được test hoặc validator chấp nhận.

## Pagination/filter/sort

- Mô tả `page`, `size`, `sort` và allowlist filter thật.
- Ghi page bắt đầu từ 0 nếu implementation dùng zero-based.
- Nêu max size từ validation thực, không tự đặt khác code.
- Response page mô tả content, number, size, totalElements, totalPages, first và last theo wrapper thật.

## Multipart

- Dùng `multipart/form-data` và schema `type: string`, `format: binary` cho file.
- Mô tả từng `@RequestPart`, loại file, kích thước và số lượng theo config/validator thật.
- Nếu request gồm JSON + file, mô tả encoding/content type của từng part.

## Security và lỗi

- Public operation dùng `security: []` khi cần override global policy.
- Protected operation dùng `bearerAuth` và mô tả 401/403 đúng nghĩa.
- Error dùng `application/problem+json` và schema thật từ `@RestControllerAdvice`.
- Response 204 không có content; 201 mô tả `Location` nếu implementation trả header này.

---
title: Chuẩn REST API
tags: [rest, http, api-design, rfc-9457]
status: verified
verified_on: 2026-07-21
sources:
  - https://www.rfc-editor.org/rfc/rfc9110.html
  - https://www.rfc-editor.org/rfc/rfc9457.html
---

# Chuẩn REST API

## 1. API là contract

API phải ổn định về semantics, schema, error và compatibility. Thiết kế từ use case và resource, không biến tên method Java thành URL.

```text
GET    /api/v1/products/{productId}
POST   /api/v1/orders
PATCH  /api/v1/orders/{orderId}
POST   /api/v1/orders/{orderId}/cancel
```

Action endpoint được chấp nhận khi đó là domain command/state transition rõ (`cancel`, `approve`) thay vì CRUD giả tạo.

## 2. HTTP method

| Method | Ý nghĩa | Safe | Idempotent mặc định |
|---|---|---:|---:|
| GET | Lấy representation | Có | Có |
| HEAD | Header như GET, không body | Có | Có |
| POST | Tạo/xử lý command | Không | Không |
| PUT | Thay thế representation tại URI | Không | Có |
| PATCH | Cập nhật một phần | Không | Phụ thuộc semantics |
| DELETE | Xóa resource | Không | Có về intended effect |

Theo RFC 9110, safe/idempotent là semantics của request, không phải cam kết response byte giống nhau. Không dùng GET để đổi state và không dựa vào request body của GET.

## 3. Status code thường dùng

| Code | Khi dùng |
|---:|---|
| 200 | Thành công có body |
| 201 | Tạo resource; trả `Location` khi phù hợp |
| 202 | Đã nhận để xử lý bất đồng bộ, chưa hoàn thành |
| 204 | Thành công không body |
| 400 | Request syntax/shape không hợp lệ |
| 401 | Chưa xác thực/credential không hợp lệ; có thể cần `WWW-Authenticate` |
| 403 | Đã xác định caller nhưng không được phép |
| 404 | Resource không tồn tại hoặc cố ý che giấu sự tồn tại |
| 409 | Xung đột state/unique/idempotency |
| 412 | Precondition như `If-Match` thất bại |
| 415 | Content-Type không hỗ trợ |
| 422 | Nội dung hiểu được nhưng vi phạm validation semantics |
| 429 | Quá giới hạn; cân nhắc `Retry-After` |
| 500 | Lỗi không dự kiến phía server; không lộ stack trace |
| 503 | Tạm không phục vụ/dependency quá tải |

Không trả `200 OK` với `{success:false}` cho lỗi HTTP thực.

## 4. Error format theo RFC 9457

Content-Type: `application/problem+json`.

```json
{
  "type": "https://api.example.com/problems/insufficient-stock",
  "title": "Insufficient stock",
  "status": 409,
  "detail": "Only 2 units remain for SKU IP15-128-BLK.",
  "instance": "/api/v1/orders/01J...",
  "code": "ORDER_STOCK_INSUFFICIENT",
  "traceId": "4f8d...",
  "errors": [
    {"field": "items[0].quantity", "code": "max_available", "message": "must be at most 2"}
  ]
}
```

`type` là định danh loại vấn đề; `title` ổn định; `detail` cụ thể cho lần xảy ra. Extension fields phải có contract. Không đưa SQL, stack trace, secret hoặc nội dung token vào lỗi.

Nguồn: [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).

## 5. Validation

- Validate shape/type/required/range tại DTO boundary.
- Validate business rule trong use case cùng dữ liệu hiện tại.
- Normalize có chủ đích; không âm thầm sửa input quan trọng.
- Giới hạn kích thước body, string, collection, file và pagination.
- Error field phải dùng path ổn định cho frontend.

## 6. Pagination, filter và sort

Offset pagination đơn giản nhưng chậm/lệch khi dataset lớn và thay đổi liên tục. Keyset/cursor pagination tốt cho feed/lịch sử lớn.

```http
GET /api/v1/products?brand=apple&status=AVAILABLE&sort=createdAt,desc&page=0&size=20
GET /api/v1/transactions?after=eyJjcmVhdGVkQXQi...&limit=50
```

- whitelist field sort/filter;
- giới hạn `size` tối đa;
- order phải deterministic, thêm unique tie-breaker như `id`;
- cursor là opaque và có thể ký để chống sửa;
- không cho client truyền tên cột SQL trực tiếp.

## 7. Idempotency

Cho create/payment command có thể bị retry:

1. Client gửi `Idempotency-Key` duy nhất.
2. Server lưu key + caller + request fingerprint + outcome.
3. Cùng key/cùng payload trả lại outcome cũ.
4. Cùng key/khác payload trả conflict.
5. Xử lý atomically bằng unique constraint/transaction.

Không chỉ cache in-memory vì nhiều instance/restart.

## 8. Optimistic concurrency ở HTTP

Server trả `ETag`; client update với `If-Match`. Nếu resource đã đổi, trả `412 Precondition Failed`. Cách này ngăn lost update và có thể map tới version field của entity.

## 9. Versioning và compatibility

- Ưu tiên additive change: thêm optional field, endpoint mới.
- Không đổi meaning/type/xóa field trong cùng version.
- Consumer phải bỏ qua response field chưa biết nếu contract cho phép.
- Version URI/header/media type là quyết định nhất quán toàn hệ thống.
- Có deprecation policy, telemetry consumer và sunset plan.

## 10. OpenAPI và contract test

OpenAPI mô tả request, response, error, auth, pagination, example và constraint. CI phải phát hiện breaking change; consumer/provider contract test cho integration quan trọng. Swagger UI không thay thế thiết kế contract.

## 11. Checklist endpoint

- Caller là ai và quyền trên resource nào?
- Command có idempotent/retry được không?
- Invariant và transaction boundary ở đâu?
- Status/error có đúng semantics không?
- Pagination có giới hạn và deterministic không?
- Có data nhạy cảm trong response/log không?
- Timeout, rate limit, audit và metric là gì?
- OpenAPI/test có bao phủ success + boundary + unauthorized + conflict không?


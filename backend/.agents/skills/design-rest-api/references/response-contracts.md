# Response contracts

## Resource

Trả resource DTO trực tiếp hoặc envelope thống nhất nếu rule 40 đã chọn; không trộn hai kiểu tùy endpoint.

## Money

```json
{ "amount": "19990000.00", "currency": "VND" }
```

Dùng chuỗi decimal nếu cần tránh mất chính xác trên client.

## Timestamp và ID

- Timestamp ISO-8601 UTC, ví dụ `2026-07-15T08:30:00Z`.
- ID serialize nhất quán; không đổi number/string giữa endpoint.
- Enum là contract; thêm giá trị có thể ảnh hưởng client và cần compatibility review.

## Header

- `Location` khi tạo resource.
- `ETag`/`If-Match` khi dùng optimistic concurrency HTTP.
- `Idempotency-Key` cho operation được yêu cầu.
- Không trả secret, internal token, password hash hoặc field chưa được allowlist.


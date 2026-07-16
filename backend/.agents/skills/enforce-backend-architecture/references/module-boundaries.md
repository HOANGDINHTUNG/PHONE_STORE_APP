# Module boundaries

## Chọn module sở hữu

1. Module nào bảo vệ invariant?
2. Module nào chịu trách nhiệm vòng đời dữ liệu?
3. Module nào được phép chuyển trạng thái?
4. Dữ liệu có cần nhất quán tức thời hay có thể nhất quán cuối cùng?

## Contract giữa module

- Dùng ID/value object thay cho entity reference.
- API nội bộ phải nhỏ, có tên theo use case và không lộ persistence.
- Event phải có tên quá khứ, schema version, event ID, occurredAt và correlation ID.
- Consumer phải idempotent; không dựa vào thứ tự toàn cục.
- Thay đổi contract phải tương thích ngược hoặc có kế hoạch chuyển đổi.

## Boundary cần ADR

- Tách/ghép module.
- Chọn synchronous hay event-driven cho luồng quan trọng.
- Thêm shared database ownership.
- Đưa framework hoặc SDK vào domain.


# Implement endpoint

Tạo hoặc sửa REST endpoint với contract, authorization và kiểm thử đầy đủ.

## Đầu vào

Method/path dự kiến, actor, use case, request/response, error và side effect.

## Bắt buộc đọc

Rules 20/40/50/60; `phone-store-project-context`, `design-rest-api`, `implement-auth-security`, `enforce-backend-architecture` và domain skill.

## Thực hiện

1. Tìm endpoint/DTO/error pattern tương tự trong codebase.
2. Xác định resource, HTTP method/status, version và compatibility.
3. Viết endpoint documentation/OpenAPI trước hoặc cùng code.
4. Thiết kế request allowlist, Bean Validation và server-owned field.
5. Xác định authentication, role/scope, ownership và state guard.
6. Triển khai controller mỏng gọi application use case.
7. Bảo vệ idempotency/ETag nếu có side effect cạnh tranh.
8. Viết web slice cho JSON/validation/security và integration test cho invariant/DB.
9. Chạy endpoint scanner, security audit và test liên quan.
10. Diff OpenAPI và cập nhật client migration note nếu cần.

## Dừng an toàn

Dừng nếu cần breaking change chưa có version plan, quyền không rõ, endpoint lộ entity/secret hoặc client đang quyết định giá/quyền/trạng thái.

## Báo cáo

Contract cuối, authorization, side effect, error codes, tests và compatibility.


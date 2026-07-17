---
name: implement-auth-security
description: Thiết kế, triển khai và audit xác thực/phân quyền Spring Security cho JWT access token, refresh token rotation, ownership, CORS, secret và endpoint nhạy cảm. Dùng khi làm login, logout, token, RBAC, method security, quản lý session, callback bảo mật hoặc review lỗ hổng backend.
---

# Implement Auth Security

Đọc rules 20, 40, 50, 60 và project actor/permission trước khi viết code. Khi tài liệu hóa hoặc mở Swagger, đọc thêm `document-openapi-swagger`.

## Quy trình

1. Mô hình hóa access token theo [jwt-flow.md](references/jwt-flow.md).
2. Mô hình hóa refresh session theo [refresh-token-flow.md](references/refresh-token-flow.md).
3. Áp dụng [authorization-matrix.md](references/authorization-matrix.md) và [ownership-rules.md](references/ownership-rules.md).
4. Triển khai deny-by-default, validation chặt, audit và error không lộ thông tin.
5. Chạy checklist [security-checklist.md](references/security-checklist.md).
6. Chạy `python3 scripts/audit_security.py <project-root>`.
7. Đồng bộ OpenAPI `bearerAuth`, public/protected operation, 401/403 và docs path với SecurityFilterChain; Swagger không được bypass quyền.
8. Viết test anonymous/authenticated/role/ownership/state, token hết hạn, replay refresh token và profile docs exposure.

## Ràng buộc

- Không tự triển khai thuật toán mật mã.
- Không log token, cookie, password, secret hoặc dữ liệu thanh toán nhạy cảm.
- Không đặt access/refresh token trong query string.
- Refresh token phải xoay vòng, lưu dạng hash khi phù hợp và phát hiện reuse.
- Chỉ tin claim sau khi xác minh chữ ký, issuer, audience, thời gian và thuật toán allowlist.
- Endpoint public phải được liệt kê rõ; mọi endpoint mới mặc định cần xác thực.
- Chỉ permit đúng `/swagger-ui/**`, `/v3/api-docs/**` hoặc `/openapi/**` theo strategy/profile; production phải tắt hoặc bảo vệ và không lưu token mẫu.

Nếu cần tham khảo, chỉ dùng tài liệu chính thức Spring Security, tiêu chuẩn JOSE/JWT và OWASP; ghi lại giả định.

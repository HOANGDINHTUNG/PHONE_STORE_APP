# Security checklist

## Authentication

- [ ] Password encoder adaptive và tham số được quản lý.
- [ ] Enumeration-safe error cho login/reset.
- [ ] Access token ngắn hạn; refresh rotation/reuse detection.
- [ ] Clock skew, issuer, audience và algorithm allowlist được kiểm thử.

## Authorization

- [ ] Deny-by-default.
- [ ] Endpoint public được liệt kê.
- [ ] Service kiểm tra role/scope/ownership/state.
- [ ] Admin, refund, stock adjustment và role change có audit.

## HTTP và dữ liệu

- [ ] HTTPS ở biên; secure headers phù hợp.
- [ ] CORS allowlist, không wildcard với credential.
- [ ] CSRF strategy rõ nếu dùng cookie.
- [ ] Validation kích thước/định dạng; upload kiểm tra loại và giới hạn.
- [ ] Error không lộ stack trace, secret hoặc sự tồn tại không cần thiết.

## Vận hành

- [ ] Secret lấy từ secret manager/môi trường.
- [ ] Dependency/image scan không có lỗ hổng vượt ngưỡng.
- [ ] Rate limit cho login, refresh, reset và callback.
- [ ] Test negative path và audit log không chứa token.

## OpenAPI và Swagger

- [ ] `bearerAuth` dùng HTTP bearer JWT; public/protected operation khớp SecurityFilterChain.
- [ ] Chỉ permit docs path tối thiểu theo contract-first/code-first và profile.
- [ ] Try it out không bypass role, ownership hoặc state guard.
- [ ] Example/config không chứa token, secret, PII hoặc production URL nội bộ.
- [ ] Production tắt/bảo vệ Swagger UI, `/v3/api-docs/**` và `/openapi/**`.
- [ ] `persist-authorization` chỉ bật local/demo.

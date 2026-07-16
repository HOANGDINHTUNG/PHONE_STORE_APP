---
code: P06
name: Security JWT Authorization
mode: FIX
triggers: HTTP 401, HTTP 403, JWT, Bearer, refresh token, authentication, authorization, CORS, CSRF, role, ownership
skills: implement-auth-security, review-security
---

Redact token, cookie, password và secret. Phân biệt authentication `401` với authorization `403`; kiểm tra deny-by-default, filter order, token extraction/validation, issuer/audience/time/algorithm, role prefix, method security và ownership/IDOR. Viết test anonymous, invalid/expired token, role sai, owner sai và happy path. Không mở `permitAll`, tắt CSRF/CORS, kéo dài token hoặc bỏ validation để làm hết lỗi. Đánh dấu risk cao/critical nếu thay JWT, refresh semantics hoặc permission.

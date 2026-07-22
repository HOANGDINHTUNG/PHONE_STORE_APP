---
title: Spring Security và API Security
tags: [spring-security, jwt, owasp, api-security]
status: verified
verified_on: 2026-07-21
sources:
  - https://docs.spring.io/spring-security/reference/index.html
  - https://owasp.org/API-Security/editions/2023/en/0x11-t10/
---

# Spring Security và API Security

## 1. Threat model trước configuration

Xác định asset, actor, trust boundary, entry point, attacker capability và impact. Security không hoàn thành chỉ vì có JWT filter.

Các câu hỏi tối thiểu:

- Ai có thể gọi endpoint?
- Caller có quyền trên **đúng object** này không?
- Field nào được phép đọc/sửa theo role/ownership?
- Credential/token bị đánh cắp thì blast radius và revocation ra sao?
- Có abuse bằng volume, file, search, export hoặc workflow không?
- Log/audit có đủ điều tra nhưng không lộ secret không?

OWASP API Security Top 10 2023 đặt Broken Object Level Authorization, Broken Authentication và Broken Object Property Level Authorization ở nhóm đầu. Nguồn: [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/).

## 2. Authentication và authorization

- Authentication: caller là ai.
- Authorization: caller được làm gì với resource cụ thể.
- Role check ở route là chưa đủ; cần ownership/tenant/resource policy.
- Deny by default; allowlist endpoint public.
- Method security là defense-in-depth, không thay resource-level policy.

## 3. Spring Security flow

Request đi qua `SecurityFilterChain`; authentication filter tạo `Authentication`, `AuthenticationManager`/`ProviderManager` giao cho `AuthenticationProvider`, thành công lưu vào `SecurityContext`; authorization filter kiểm tra quyền. `AuthenticationEntryPoint` xử lý chưa xác thực, `AccessDeniedHandler` xử lý bị từ chối.

Nguồn: [Servlet Authentication Architecture](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html), [Spring Security Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html).

## 4. Password

- Hash bằng adaptive one-way function được Spring Security hỗ trợ như Argon2/bcrypt/PBKDF2/scrypt; không mã hóa reversible và không SHA-256 thuần.
- Cost được benchmark để login chịu được nhưng brute-force đắt; có kế hoạch rehash khi cost/algorithm đổi.
- Không log password, hash, reset token.
- Forgot-password token: random đủ mạnh, single-use, expiry ngắn, lưu hash, revoke sau dùng.
- Response login/reset tránh user enumeration khi threat model yêu cầu.

## 5. JWT đúng bản chất

JWT là format token có claims, không tự tạo security. Phải kiểm tra:

- thuật toán được allowlist;
- chữ ký và key đúng;
- `iss`, `aud`, `exp`, `nbf` và clock skew;
- token type/use (`access` không dùng như `refresh`);
- authority mapping;
- key rotation và `kid` an toàn;
- token không chứa secret/PII không cần thiết vì payload thường chỉ encoded.

Ưu tiên Spring Security OAuth2 Resource Server/JWT decoder thay vì tự viết toàn bộ validation filter nếu use case phù hợp. Nguồn: [OAuth2 Resource Server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html), [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html).

## 6. Access token, refresh token và logout

- Access token ngắn hạn giảm cửa sổ rủi ro.
- Refresh token dài hơn, lưu/transport bảo vệ chặt; rotation mỗi lần refresh.
- Lưu hash/token family/status; phát hiện reuse thì revoke cả family và cảnh báo.
- Logout phải định nghĩa: xóa client token, revoke refresh token/session; access JWT đã phát có thể còn hiệu lực đến expiry nếu không có denylist/introspection.
- Nếu revocation tức thời là yêu cầu mạnh, opaque token + introspection hoặc server session có thể phù hợp hơn self-contained JWT. Spring Security hỗ trợ opaque token introspection. Nguồn: [Opaque Token](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/opaque-token.html).

## 7. CSRF và CORS

- CORS là chính sách browser về cross-origin, không phải authentication.
- Allowlist origin/method/header cụ thể; không phản chiếu origin tùy tiện, đặc biệt khi `allowCredentials=true`.
- CSRF quan trọng khi browser tự động gửi credential như cookie. Stateless không tự động nghĩa là miễn CSRF nếu credential nằm trong cookie.
- Bearer token do JavaScript gắn trong `Authorization` giảm một lớp CSRF nhưng tăng cân nhắc XSS/token storage.
- Chọn mô hình client và threat model rồi cấu hình, không copy `csrf.disable()` máy móc.

## 8. Input và output security

- Bean Validation không thay parameterized query/ORM binding.
- Whitelist sort/filter field; không nối column/direction từ client vào SQL.
- Encode theo output context nếu render HTML.
- Giới hạn body, collection, depth JSON, upload size và decompression ratio.
- Không mass-assign entity từ request; DTO chỉ chứa field caller được phép gửi.
- Trả tối thiểu dữ liệu cần thiết; tránh over-fetching/excessive data exposure.

## 9. File upload

- Kiểm tra kích thước, extension và MIME/signature; filename do client cung cấp không phải path tin cậy.
- Sinh storage key phía server; chống path traversal/overwrite.
- Lưu ngoài web root; private-by-default; signed URL ngắn hạn nếu cần.
- Scan malware theo risk; xử lý archive bomb.
- Tách upload pending và available sau validation/scan.
- Log actor, checksum, size và kết quả scan.

## 10. Rate limiting và abuse

Giới hạn theo nhiều dimension: IP, account, API key, tenant, endpoint và operation cost. Login/reset/search/export/payment cần policy khác nhau. Thiết kế response `429`, `Retry-After`, metric và chống bypass distributed. Rate limit không thay authorization/idempotency.

## 11. Secret và key

- Không commit secret, kể cả “demo” nếu có khả năng dùng lại.
- Tách secret theo môi trường/service, least privilege, rotation, audit access.
- JWT signing key bất đối xứng giúp resource server chỉ giữ public key.
- Không log header `Authorization`, cookie, API key, reset token, full payment/identity data.

## 12. Security headers và transport

- HTTPS end-to-end phù hợp trust boundary.
- HSTS khi deployment đã sẵn sàng.
- Secure/HttpOnly/SameSite cho cookie theo use case.
- CSP, frame-ancestors/X-Frame-Options, nosniff cho web response phù hợp.
- Proxy/gateway header chỉ tin từ trusted proxy; cấu hình forwarded headers tránh spoof.

## 13. Dependency và supply chain

- Dùng BOM/lock, dependency scanning, SBOM và signed/provenance artifact khi có.
- Theo dõi Spring security advisories và CVE; patch theo risk/SLA.
- Không tin package chỉ vì tên giống chính thức.
- Container base image được pin và quét; rebuild định kỳ.

## 14. Security test bắt buộc

- unauthenticated → 401;
- authenticated sai quyền → 403;
- đổi object ID không truy cập được dữ liệu người khác;
- mass assignment bị chặn;
- token hết hạn/sai issuer/audience/signature/type;
- refresh reuse/revocation/logout;
- CORS/CSRF đúng client model;
- SQL injection/sort injection;
- upload traversal/oversize/wrong type;
- rate-limit và audit event.

## 15. Không làm

- hardcode JWT secret;
- tự parse JWT rồi tin claim mà không verify;
- dùng role ADMIN như giải pháp cho mọi authorization;
- permitAll pattern quá rộng;
- trả stack trace/internal exception;
- log token/password/PII;
- dựa vào frontend để ẩn chức năng;
- tắt CSRF/CORS mà không ghi threat model;
- lưu refresh token plaintext không có kiểm soát.


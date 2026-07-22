---
title: OAuth2 OIDC và Token Security nâng cao
tags: [oauth2, oidc, spring-security, jwt, token-security]
status: verified
verified_on: 2026-07-21
sources:
  - https://www.rfc-editor.org/rfc/rfc9700.html
  - https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html
---

# OAuth 2.0, OIDC và Token Security nâng cao

## 1. Phân biệt khái niệm

- OAuth 2.0: authorization framework để client lấy quyền truy cập resource.
- OpenID Connect: identity layer trên OAuth 2.0 cho login/federation.
- Authorization Server/IdP: xác thực user/client và phát token.
- Resource Server: API kiểm access token.
- Client: ứng dụng yêu cầu quyền, không đồng nghĩa end user.
- Resource Owner: chủ thể cấp quyền.

OAuth không tự định nghĩa “đăng nhập” nếu không có OIDC/identity semantics.

## 2. Phân biệt token

| Token | Audience chính | Mục đích | Không dùng để |
|---|---|---|---|
| Authorization code | Token endpoint | Đổi token một lần | Gọi API |
| Access token | Resource server | Truy cập API | Là session lâu dài |
| ID token | OIDC client | Thông tin authentication event/user | Gọi API như access token |
| Refresh token | Authorization server | Xin access token mới | Gửi cho resource server |

Resource server không nhận ID token để authorize API. Client không đọc access-token claim rồi coi đó là login contract nếu provider không cam kết.

## 3. Flow hiện đại

### Authorization Code + PKCE

Phù hợp browser/mobile/web client. PKCE dùng verifier/challenge theo transaction, `S256`. Redirect URI exact matching, `state`/OIDC `nonce`, issuer validation và chống mix-up.

### Client Credentials

Machine-to-machine khi client hành động cho chính nó, không đại diện user. Scope/audience và client authentication least privilege.

Không dùng Resource Owner Password Credentials. RFC 9700 quy định grant này không được dùng và khuyến nghị Authorization Code + PKCE; implicit grant cũng không nên dùng do token leakage/replay. Nguồn: [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html).

## 4. Resource Server validation

Tối thiểu:

- signature và allowlisted algorithm;
- trusted issuer `iss`;
- intended audience `aud`;
- `exp`, `nbf`, clock skew có giới hạn;
- token type/use;
- required scope/authority;
- tenant/resource policy;
- key selection từ trusted JWKS.

Không lấy `jku`/key URL tùy ý từ token rồi fetch. Issuer/JWKS endpoint phải cấu hình hoặc discovery từ trusted issuer.

Spring Security Resource Server dùng `JwtDecoder`/provider chain cho bearer token. Nguồn: [Spring Security JWT Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html).

## 5. JWT hay opaque token

| Yếu tố | JWT self-contained | Opaque + introspection |
|---|---|---|
| Validate | Local, latency thấp | Call/cache introspection |
| Revocation tức thời | Khó hơn | Tự nhiên hơn |
| Claim exposure | Payload readable | Client không biết nội dung |
| Key rotation | JWKS/signature | Server-side credential |
| Coupling auth server | Lúc discovery/key refresh | Runtime introspection |

Chọn theo revocation, latency, privacy, outage behavior và trust boundary. Không chọn JWT chỉ vì “stateless”.

## 6. Access token privilege restriction

- Scope nhỏ nhất cần thiết.
- Audience đúng resource server.
- Tenant/resource/action check tại API.
- Token lifetime theo risk.
- Không encode mọi role nội bộ dài hạn vào token nếu quyền thay đổi cần hiệu lực ngay.

RFC 9700 khuyến nghị audience restriction và quyền tối thiểu; resource server phải từ chối token không dành cho nó.

## 7. Refresh token rotation

Mô hình token family:

```text
family_id
token_hash
parent_token_id
status: ACTIVE | USED | REVOKED | COMPROMISED
issued_at / expires_at / used_at
client_id / subject / device metadata
```

Flow:

1. Client gửi refresh token R1.
2. Server atomically đánh R1 USED và phát R2.
3. R1 được dùng lại → nghi token bị copy; revoke family/session và alert.
4. Race hợp lệ do network retry cần grace/idempotency policy rõ, không phát nhiều nhánh không kiểm soát.

RFC 9700 yêu cầu refresh token của public client phải sender-constrained hoặc rotation. Không lưu refresh token plaintext nếu DB compromise là threat; lưu hash tương tự secret lookup khi thiết kế cho phép.

## 8. Sender-constrained token

mTLS hoặc DPoP ràng buộc token với proof của client, giảm reuse khi token bị đánh cắp. Đổi lại tăng key lifecycle, proxy/gateway và client complexity. Dùng cho risk cao, không áp dụng nửa vời.

## 9. Browser architecture

### SPA giữ bearer token

Rủi ro chính là XSS/token theft. In-memory giảm persistence nhưng reload UX; localStorage dễ bị script truy cập.

### BFF + secure cookie

Backend-for-Frontend giữ token phía server, browser dùng Secure + HttpOnly + SameSite cookie. Giảm token exposure cho JS nhưng CSRF/session protection trở nên trọng yếu.

Không có phương án tuyệt đối; chọn theo threat model, frontend architecture và operational ability.

## 10. CORS và CSRF theo credential model

- Bearer header do JS tự gắn: CSRF risk khác cookie, nhưng XSS rất quan trọng.
- Cookie tự động gửi: cần CSRF token/origin controls/SameSite phù hợp.
- CORS chỉ quyết định browser cho frontend đọc/gửi cross-origin thế nào; attacker server-to-server không bị CORS chặn.
- Preflight cần đi qua chain đúng và không mở wildcard+credentials.

Spring Security bật CSRF protection mặc định cho unsafe methods trong browser login contexts; disable phải có lý do kiến trúc. Nguồn: [Spring Security CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html).

## 11. Authorization model

Tầng kiểm tra:

1. Request route: có authenticated/scope/role sơ bộ.
2. Method/use case: permission business.
3. Resource: ownership/tenant/relationship/state.
4. Property: field nào được đọc/sửa.
5. Database query: tenant/resource predicate để tránh fetch quá quyền.

Method security hỗ trợ annotation/authorization manager nhưng expression không nên chứa business query phức tạp khó test. Nguồn: [Spring Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html).

## 12. Multi-tenancy

- Resolve tenant từ trusted token claim/host mapping, không từ body tùy ý.
- Validate issuer/keys theo allowlist tenant.
- Mọi query/cache/key/event/metric phải cân nhắc tenant dimension.
- Không để admin tenant A đọc tenant B bằng đổi ID.
- Tenant onboarding/key rotation/offboarding có workflow audit.

## 13. Key rotation

- Asymmetric signing key có `kid` duy nhất.
- Publish current + previous public keys đủ thời gian token cũ hết hạn.
- Resource server cache JWKS nhưng refresh khi unknown `kid` theo rate limit.
- Không reuse `kid` cho key khác.
- Rotate, revoke và emergency compromise runbook.
- Private key ở KMS/HSM/secret manager phù hợp; least privilege và audit.

## 14. Logout và revocation semantics

Phải viết rõ:

- logout device hiện tại hay mọi device;
- revoke refresh family/session;
- access token còn hiệu lực đến bao lâu;
- denylist/introspection cần không;
- OIDC RP-initiated/front/back-channel logout nếu federation;
- session cookie xóa/invalidated;
- audit actor/time/reason.

UI “đã logout” nhưng access token đánh cắp vẫn dùng được 1 giờ là một security decision, không phải chi tiết nhỏ.

## 15. Security test matrix

- wrong/unknown issuer;
- wrong audience;
- expired/not-before/clock edge;
- altered signature/algorithm confusion;
- access token dùng làm refresh và ngược lại;
- missing/excess scope;
- cross-tenant/object/property authorization;
- refresh rotation/reuse/race;
- key rotation unknown `kid`/old key expiry;
- CORS preflight và CSRF theo client model;
- logout/revocation behavior;
- auth endpoint rate limit/user enumeration/audit.


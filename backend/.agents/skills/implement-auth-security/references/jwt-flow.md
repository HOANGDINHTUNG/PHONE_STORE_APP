# JWT access-token flow

1. Client gửi credential qua HTTPS.
2. Server rate-limit, kiểm tra credential và trạng thái tài khoản.
3. Server phát access token sống ngắn và refresh token/session riêng.
4. Resource server xác minh chữ ký, thuật toán allowlist, `iss`, `aud`, `exp`, `nbf` và subject.
5. Server ánh xạ quyền từ nguồn đã tin cậy; không dùng claim client tự tạo.
6. Logout/thu hồi kết thúc refresh session; access token ngắn hạn hết hiệu lực tự nhiên hoặc dùng cơ chế revoke có chủ đích.

## Claim tối thiểu

- `sub`: user ID ổn định.
- `iss`, `aud`.
- `iat`, `exp`, có thể `nbf`.
- `jti` khi cần trace/revocation.
- Role/scope chỉ khi chiến lược stale permission được chấp nhận.

Không chứa password, PII không cần thiết hoặc secret trong JWT.


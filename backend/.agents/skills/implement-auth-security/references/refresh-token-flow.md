# Refresh-token flow

- Tạo token ngẫu nhiên đủ entropy hoặc token ký theo thiết kế đã review.
- Lưu hash/fingerprint, user, family/session ID, issuedAt, expiresAt, revokedAt và metadata cần thiết.
- Mỗi lần refresh hợp lệ phải rotate token trong transaction.
- Token cũ được đánh dấu consumed; tái sử dụng token cũ kích hoạt revoke toàn family và audit.
- Giới hạn số session/user nếu nghiệp vụ yêu cầu.
- Logout một thiết bị thu hồi session tương ứng; “logout all” thu hồi toàn bộ session.
- Không kéo dài vô hạn; có absolute lifetime và idle lifetime.
- Web ưu tiên secure, HttpOnly, SameSite cookie theo kiến trúc; mobile dùng secure storage của nền tảng.
- Refresh endpoint có rate limit, CSRF strategy nếu dùng cookie, và response không cache.


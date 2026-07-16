# Security testing

Với mỗi endpoint nhạy cảm, kiểm tra:

- Không token, token sai chữ ký, hết hạn, issuer/audience sai.
- User hợp lệ nhưng thiếu role/scope.
- Role đúng nhưng tài nguyên thuộc user khác.
- Owner đúng nhưng state không cho phép.
- Mass assignment của owner/status/price/role.
- IDOR qua path, nested resource và list filter.
- CORS/CSRF theo cách lưu credential.
- Rate-limit cho login/refresh/callback.
- Error không lộ stack trace, secret, user enumeration.
- Log/audit không chứa Authorization, cookie hoặc token.
- Duplicate/replay refresh token và signed callback.


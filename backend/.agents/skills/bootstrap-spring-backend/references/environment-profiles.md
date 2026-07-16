# Profile môi trường

| Profile | Mục đích | Database | Secret |
| --- | --- | --- | --- |
| local | Phát triển cá nhân | Docker/local MySQL | Biến môi trường hoặc file ngoài Git |
| test | Unit/slice test | Mock/in-memory khi phù hợp | Giá trị giả không nhạy cảm |
| integration | Testcontainers MySQL | Container tạm | Sinh trong test |
| staging | Kiểm thử gần production | Managed riêng | Secret manager |
| production | Phục vụ thật | Managed HA | Secret manager |

## Quy tắc

- `application.yml` chỉ chứa mặc định an toàn và placeholder.
- Không tự kích hoạt production.
- Fail-fast nếu thiếu database URL, JWT key hoặc credential bắt buộc.
- CORS, logging, actuator exposure và rate limit cấu hình theo môi trường.
- Không để test profile dùng production endpoint.
- Production bật `ddl-auto=validate` hoặc `none`; Flyway chịu trách nhiệm migration.
- Tất cả timezone lưu UTC; format hiển thị do client xử lý.


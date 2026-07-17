# Profile môi trường

| Profile | Mục đích | Database | Secret | Swagger/OpenAPI |
| --- | --- | --- | --- | --- |
| local | Phát triển cá nhân | Docker/local MySQL | Biến môi trường hoặc file ngoài Git | Bật có kiểm soát |
| swagger-demo | Thử Try it out | MySQL disposable ưu tiên | Giá trị giả | Bật, provider ngoài được stub |
| test | Unit/slice test | Mock/in-memory khi phù hợp | Giá trị giả không nhạy cảm | Chỉ bật khi test docs cần |
| integration | Testcontainers MySQL | Container tạm | Sinh trong test | Contract/conformance test |
| staging | Kiểm thử gần production | Managed riêng | Secret manager | Tắt hoặc bảo vệ theo policy |
| production | Phục vụ thật | Managed HA | Secret manager | Tắt UI/runtime docs và deny/protect spec path |

## Quy tắc

- `application.yml` chỉ chứa mặc định an toàn và placeholder.
- Không tự kích hoạt production.
- Fail-fast nếu thiếu database URL, JWT key hoặc credential bắt buộc.
- CORS, logging, actuator exposure và rate limit cấu hình theo môi trường.
- Không để test profile dùng production endpoint.
- Production bật `ddl-auto=validate` hoặc `none`; Flyway chịu trách nhiệm migration.
- Tất cả timezone lưu UTC; format hiển thị do client xử lý.
- `persist-authorization` chỉ bật local/swagger-demo; không đặt JWT hoặc OAuth client secret trong config.
- Swagger demo không được gọi provider production; database rollback không hoàn tác email/file/message bên ngoài.

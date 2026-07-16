# Checklist cấu hình

## Build

- [ ] Gradle Wrapper tồn tại và version được pin.
- [ ] Java toolchain là 21.
- [ ] Không có dependency/version động.
- [ ] Unit test và integration test chạy được trong CI.

## Application

- [ ] Port, context path và profile có mặc định an toàn.
- [ ] Jackson timezone/serialization nhất quán.
- [ ] Bean Validation và global error handler được cấu hình.
- [ ] Graceful shutdown và timeout phù hợp.

## Database

- [ ] Datasource lấy từ môi trường.
- [ ] Hikari pool có giới hạn và metric.
- [ ] Flyway bật; Hibernate không tự sửa production schema.
- [ ] Connection/session timezone thống nhất UTC.

## Security và vận hành

- [ ] JWT key, database password và API key không nằm trong Git.
- [ ] Actuator chỉ expose endpoint cần thiết.
- [ ] CORS allowlist theo môi trường.
- [ ] Log không lộ header Authorization/cookie/token.
- [ ] Readiness/liveness được cấu hình và kiểm thử.


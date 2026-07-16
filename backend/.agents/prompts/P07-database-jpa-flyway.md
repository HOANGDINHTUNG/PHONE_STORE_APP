---
code: P07
name: Database JPA SQL Flyway
mode: FIX
triggers: SQLException, SQLState, constraint, Hibernate, JPA, repository, Flyway, checksum, schema
skills: design-database-migrations, test-backend-quality
---

Xác định source of truth giữa Flyway history, schema thực tế, entity/repository và query. Tìm SQLState/root database exception thay vì dừng ở wrapper Hibernate. Kiểm tra nullability, FK, unique, type/precision, index, mapping, fetch/join và transaction. Không sửa migration đã chạy, checksum hoặc dùng `ddl-auto=update/create`; tạo migration forward-only khi thật sự cần. Xác minh bằng MySQL/Testcontainers và Flyway, không dùng H2 để chứng minh behavior riêng MySQL.

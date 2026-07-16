---
name: bootstrap-spring-backend
description: Khởi tạo hoặc rà soát backend Java 21 Spring Boot dùng Gradle, MySQL, Flyway, JWT, profile môi trường và cấu hình production-ready. Dùng khi tạo dự án mới, nâng cấp nền tảng, sửa build, thêm dependency, chuẩn hóa cấu hình hoặc kiểm tra khả năng chạy từ local đến CI.
---

# Bootstrap Spring Backend

Đọc rules 00, 10, 20, 30, 50 và 60 trước khi thay đổi nền tảng.

## Quy trình

1. Xác nhận version đã được dự án pin; không tự chọn bản mới nhất nếu chưa kiểm chứng.
2. Đọc [technology-stack.md](references/technology-stack.md) và [gradle-dependencies.md](references/gradle-dependencies.md).
3. Thiết kế profile theo [environment-profiles.md](references/environment-profiles.md).
4. Áp dụng [configuration-checklist.md](references/configuration-checklist.md).
5. Dùng template trong [assets/backend-template](assets/backend-template/) khi khởi tạo mới; điều chỉnh package và version theo dự án.
6. Chạy `python3 scripts/validate_gradle.py <project-root>`.
7. Chạy `python3 scripts/validate_configuration.py <project-root>`.
8. Chạy Gradle Wrapper: `./gradlew test` và `./gradlew bootJar`.

## Ràng buộc

- Dùng Gradle Wrapper, Java toolchain 21 và dependency locking/version catalog nếu dự án chọn.
- Không ghi secret thật vào repository.
- Flyway quản lý schema; Hibernate không tự cập nhật schema ngoài test cô lập.
- Chỉ thêm dependency có mục đích rõ, nguồn chính thức và version tương thích.
- Không thay đổi đồng thời framework major version và nghiệp vụ nếu có thể tách.
- Nếu cần tham khảo, ưu tiên tài liệu chính thức Spring, Gradle, Flyway, MySQL và Testcontainers; ghi lại URL/phiên bản đã dùng.

## Hoàn tất khi

Build tái lập, profile rõ, cấu hình fail-fast, migration chạy trên database sạch, test pass và README/runbook có lệnh chạy thực tế.


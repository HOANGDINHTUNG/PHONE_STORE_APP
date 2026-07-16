# Bootstrap backend

Khởi tạo hoặc chuẩn hóa backend Java 21 + Spring Boot từ thư mục gốc dự án.

## Đầu vào cần xác nhận

- Tên project, base package và module ban đầu.
- Version Spring Boot/Gradle/MySQL đã được pin.
- Môi trường local/test/staging/production.
- Có tạo mới hay sửa dự án hiện hữu.

Nếu thiếu version, tra tài liệu chính thức và compatibility matrix; không đoán bản mới nhất.

## Bắt buộc đọc

- Rules: 00, 10, 20, 30, 50, 60.
- Skills: `phone-store-project-context`, `bootstrap-spring-backend`, `enforce-backend-architecture`, `test-backend-quality`.

## Thực hiện

1. Kiểm tra worktree và inventory file hiện có; không ghi đè thay đổi người dùng.
2. Chốt baseline và ghi giả định/câu hỏi mở.
3. Tạo Gradle Wrapper, Java toolchain 21 và dependency tối thiểu.
4. Tạo package theo module/feature, profile môi trường và config placeholder.
5. Cấu hình MySQL, Flyway, Security deny-by-default, Actuator và error baseline.
6. Tạo test smoke/context và migration baseline nhỏ nhất.
7. Chạy validator Gradle/config/architecture/security.
8. Chạy `./gradlew test bootJar`.
9. Cập nhật docs architecture, database, testing và runbook local.

## Dừng an toàn

Dừng trước khi ghi đè dự án, chọn version chưa xác minh, thêm secret thật, kết nối production hoặc tạo migration phá hủy.

## Báo cáo

Liệt kê file thay đổi, version, lệnh đã chạy, kết quả test, cảnh báo còn lại và bước tiếp theo.


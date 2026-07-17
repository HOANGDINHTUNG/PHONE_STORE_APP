# Bootstrap backend

Khởi tạo hoặc chuẩn hóa backend Java 21 + Spring Boot từ thư mục gốc dự án.

## Đầu vào cần xác nhận

- Tên project, base package và module ban đầu.
- Version Spring Boot/Gradle/MySQL đã được pin.
- Môi trường local/test/staging/production.
- Có tạo mới hay sửa dự án hiện hữu.

Nếu thiếu version, tra tài liệu chính thức và compatibility matrix; không đoán bản mới nhất.

## Bắt buộc đọc

- Rules: 00, 10, 20, 30, 40, 50, 60.
- Skills: `phone-store-project-context`, `bootstrap-spring-backend`, `document-openapi-swagger`, `enforce-backend-architecture`, `test-backend-quality`.

## Thực hiện

1. Kiểm tra worktree và inventory file hiện có; không ghi đè thay đổi người dùng.
2. Chốt baseline và ghi giả định/câu hỏi mở.
3. Tạo Gradle Wrapper, Java toolchain 21 và dependency tối thiểu.
4. Tạo package theo module/feature, profile môi trường và config placeholder.
5. Cấu hình MySQL, Flyway, Security deny-by-default, Actuator và error baseline.
6. Tạo OpenAPI contract-first baseline và Swagger UI local/demo theo source/profile policy; không public production docs.
7. Tạo test smoke/context, contract và migration baseline nhỏ nhất.
8. Chạy validator Gradle/config/architecture/security/OpenAPI.
9. Chạy `./gradlew test bootJar`.
10. Cập nhật docs architecture, API, database, testing và runbook local.

## Dừng an toàn

Dừng trước khi ghi đè dự án, chọn version chưa xác minh, thêm secret thật, kết nối production hoặc tạo migration phá hủy.

## Báo cáo

Liệt kê file thay đổi, version, lệnh đã chạy, kết quả test, cảnh báo còn lại và bước tiếp theo.

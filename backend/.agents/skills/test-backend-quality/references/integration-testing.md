# Integration testing

- Dùng Testcontainers MySQL version pin gần production.
- Chạy Flyway từ schema rỗng; không dùng `ddl-auto=create`.
- Chia sẻ container hợp lý nhưng cô lập dữ liệu từng test.
- Test transaction boundary, unique/FK/check, timezone và decimal.
- Test concurrent reservation bằng latch/barrier, không dựa sleep.
- Fake/stub provider ở biên HTTP với response, timeout và retry có kiểm soát.
- Không gọi internet hoặc shared staging service.
- Ghi log/container output đủ chẩn đoán nhưng không lộ secret.
- Có test migration từ baseline hỗ trợ nếu upgrade path quan trọng.


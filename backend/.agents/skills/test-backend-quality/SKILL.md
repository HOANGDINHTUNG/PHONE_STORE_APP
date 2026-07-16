---
name: test-backend-quality
description: Lập chiến lược, viết và chạy kiểm thử backend Spring bằng JUnit 5, Mockito, jqwik Property-Based Testing, PITest Mutation Testing, Jazzer Fuzzing, slice test, integration MySQL/Testcontainers, security test, contract test và quality gate. Dùng khi triển khai feature, sửa bug, kiểm tra độ mạnh của test, tìm lỗi vùng biên, fuzz input không tin cậy hoặc quyết định release có đủ chất lượng.
---

# Test Backend Quality

Đọc rule 50 và các rule/domain skill liên quan trước khi chọn test.

## Quy trình

1. Chọn test level theo [testing-strategy.md](references/testing-strategy.md).
2. Viết unit test bằng JUnit 5 và Mockito theo [unit-testing.md](references/unit-testing.md).
3. Dùng jqwik cho invariant và dữ liệu vùng biên theo [property-based-testing.md](references/property-based-testing.md).
4. Dùng PITest để kiểm tra độ mạnh của unit test theo [mutation-testing.md](references/mutation-testing.md).
5. Dùng Jazzer cho parser, validation và input không tin cậy theo [fuzz-testing.md](references/fuzz-testing.md).
6. Viết web/data slice theo [slice-testing.md](references/slice-testing.md).
7. Dùng MySQL thật qua Testcontainers theo [integration-testing.md](references/integration-testing.md).
8. Bao phủ quyền và negative path theo [security-testing.md](references/security-testing.md).
9. Áp dụng gate trong [quality-gates.md](references/quality-gates.md).
10. Dùng [test-case-template.md](assets/test-case-template.md) cho case phức tạp.
11. Chạy quality gate chuẩn:

    ```bash
    python3 scripts/run_quality_gate.py <project-root> --execute
    ```

12. Khi cần mutation testing:

    ```bash
    python3 scripts/run_quality_gate.py <project-root> \
      --execute \
      --task check \
      --task pitest
    ```

## Ràng buộc

- Test hành vi/invariant, không test chi tiết implementation vô nghĩa.
- Bug fix phải có test đỏ trước hoặc regression test chứng minh lỗi.
- Không mock database cho tính đúng đắn của SQL/lock/migration.
- Test độc lập, deterministic, không phụ thuộc thứ tự hoặc internet.
- Không bỏ qua test/quality gate chỉ để pipeline xanh.
- Coverage là tín hiệu; luồng tiền, quyền, tồn kho và trạng thái phải được test theo rủi ro.
- JUnit 5 và Mockito là tầng kiểm thử nền tảng cho domain/application logic.
- Chỉ mock dependency bên ngoài hoặc port; không mock chính đối tượng đang kiểm thử.
- jqwik dùng cho invariant, tổ hợp dữ liệu lớn và lỗi vùng biên; không thay thế example-based test.
- PITest dùng để đánh giá test có thực sự phát hiện lỗi; coverage cao nhưng mutation score thấp vẫn chưa đạt.
- Jazzer chỉ fuzz code có input không tin cậy như JSON, token, callback, parser, validator và mapper.
- Fuzz test không được gọi internet, shared database hoặc production service.
- Mọi crash input tìm được phải được chuyển thành regression test có thể tái hiện.
- Pin version PITest, jqwik và Jazzer; không dùng `latest` hoặc version động.

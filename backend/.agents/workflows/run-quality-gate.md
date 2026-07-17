# Run quality gate

Chạy và tổng hợp đầy đủ quality gate backend trước merge/release.

## Bắt buộc đọc

Rule 50; `test-backend-quality` và các rule/skill bị tác động.

## Thực hiện

1. Kiểm tra worktree và xác định scope thay đổi; không sửa file người dùng.
2. Kiểm tra Java/Gradle/config baseline.
3. Chạy architecture, migration, security và endpoint validator.
4. Chạy formatting/static analysis đã cấu hình.
5. Chạy `./gradlew --no-daemon check`.
6. Chạy integration/contract task riêng nếu không nằm trong `check`.
7. Kiểm tra coverage report, test disabled và flaky retry.
8. Kiểm tra OpenAPI lint/ref/example/security, duplicate operationId, breaking diff, conformance, Swagger production exposure và docs/ADR/runbook cập nhật.
9. Tổng hợp lỗi gốc; không che lỗi bằng skip/exclude.
10. Chỉ sửa khi người dùng yêu cầu; nếu chỉ kiểm tra, báo cáo.

## Quy tắc kết luận

- PASS: mọi gate bắt buộc pass.
- PASS WITH WARNINGS: chỉ cảnh báo không chặn theo policy, có owner.
- FAIL: bất kỳ test/validator/security/migration/compatibility gate bắt buộc thất bại.
- BLOCKED: thiếu tool/environment/authority; nêu lệnh và điều kiện cần.

## Báo cáo

Bảng gate, lệnh, duration/kết quả, log lỗi cô đọng, file report và hành động tiếp theo.

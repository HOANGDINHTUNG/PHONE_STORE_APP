# Generate documentation

Tạo hoặc đồng bộ tài liệu backend từ code, contract và quyết định đã xác nhận.

## Đầu vào

Scope tài liệu: requirements, architecture, database, API, ADR, testing hoặc runbook.

## Bắt buộc đọc

Rules 00/40/60, `phone-store-project-context`, `document-openapi-swagger` khi có API và skill chuyên môn tương ứng.

## Thực hiện

1. Xác định source of truth hiện có; không thay thế sự thật bằng suy đoán.
2. Đọc code/config/migration/OpenAPI/test liên quan.
3. Đánh dấu confirmed, inferred và open question.
4. Dùng template trong `docs/`; giữ link và thuật ngữ nhất quán.
5. Với API, xác định source of truth rồi mô tả auth, request, response, error, idempotency và example đã redaction; Swagger UI chỉ là renderer, không phải contract thứ hai.
6. Với DB, mô tả ownership, constraint, index và migration.
7. Với ADR, ghi context, options, decision, consequences và status.
8. Với runbook, ghi trigger, diagnosis, safe action, verification, rollback và escalation.
9. Kiểm tra Markdown/link/diagram; không chứa secret/PII.
10. So sánh lại tài liệu với code/test; với OpenAPI chạy lint/ref/example/operationId/security và conformance.

## Nguồn tham khảo

Khi thông tin framework/tiêu chuẩn có thể thay đổi, dùng tài liệu chính thức, ghi URL và version/date; không sao chép dài hoặc lấy blog làm nguồn chính.

## Báo cáo

Tài liệu tạo/sửa, nguồn sự thật, giả định/câu hỏi mở và phần cần owner xác nhận.

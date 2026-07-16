# Debug backend

Chẩn đoán lỗi backend bằng bằng chứng, không sửa mò hoặc che triệu chứng. Khi người dùng chọn mã `P00`–`P12` hoặc nói “prompt số ...”, chuyển sang workflow `debug-by-prompt.md` và skill `debug-prompt-library`.

## Đầu vào

Triệu chứng, môi trường, thời điểm, request/correlation ID, bước tái hiện và thay đổi gần nhất.

## Bắt buộc đọc

Rules liên quan, `phone-store-project-context`, `optimize-observability`, `test-backend-quality` và domain skill.

## Thực hiện

1. Xác nhận phạm vi và ảnh hưởng; nếu là sự cố production, tuân runbook/authority hiện có.
2. Thu thập log đã redaction, metric, trace, error contract và state liên quan.
3. Tái hiện trong môi trường cô lập bằng dữ liệu giả.
4. Lập giả thuyết có thể bác bỏ và kiểm tra từ rẻ/an toàn đến sâu.
5. Phân biệt root cause, trigger và symptom.
6. Viết regression test tái hiện lỗi.
7. Nếu được yêu cầu sửa, áp dụng thay đổi nhỏ nhất và giữ invariant.
8. Chạy test hẹp, full gate và kiểm tra observability.
9. Cập nhật runbook/post-incident nếu lỗi có giá trị vận hành.

## Không làm

Không log thêm secret/PII, không sửa production data, không tắt security/validation, không nuốt exception và không tăng timeout/retry vô hạn.

## Báo cáo

Root cause kèm bằng chứng, mức tin cậy, cách tái hiện, phạm vi ảnh hưởng, fix/test hoặc bước điều tra còn lại.

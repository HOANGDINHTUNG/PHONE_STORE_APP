# Cancellation và refund

## Cancellation

- Kiểm tra actor, ownership/quyền và order state.
- Xác định shipment đã bàn giao hay chưa.
- Release reservation hoặc tạo stock compensation đúng một lần.
- Hủy payment intent nếu provider hỗ trợ; nếu đã capture, chuyển sang refund.
- Lưu reason code và ghi audit/outbox.

## Refund

- Refund là aggregate/record riêng với amount, currency, reason, status và provider reference.
- Tổng refund thành công không vượt captured amount.
- Hỗ trợ partial refund chỉ khi nghiệp vụ và phân bổ line/tax rõ.
- Request và callback refund đều idempotent.
- Timeout cần reconciliation; không retry mù tạo refund trùng.
- Failure không làm sửa ngược lịch sử payment; tạo transition/attempt mới.


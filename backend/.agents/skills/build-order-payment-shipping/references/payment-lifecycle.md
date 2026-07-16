# Payment lifecycle

- Một order có thể có nhiều payment attempt, nhưng settlement thành công phải tuân invariant tổng tiền.
- Mỗi attempt có idempotency key, provider, amount, currency, status và provider reference.
- Tạo provider request ngoài DB transaction; lưu intent trước và kết quả sau.
- Không đánh dấu success chỉ từ redirect phía client.
- Callback hoặc server-side verify là nguồn xác nhận theo contract provider.
- Timeout là trạng thái chưa biết, không tự xem là failed; reconciliation phải kiểm tra.
- Không lưu PAN/CVV hoặc dữ liệu thẻ nhạy cảm.
- Reconciliation so sánh provider với ledger nội bộ và phát cảnh báo lệch.


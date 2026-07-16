# Idempotency

- Yêu cầu client cung cấp `Idempotency-Key` cho checkout/payment/refund quan trọng.
- Scope key theo principal + operation + endpoint; giới hạn độ dài và format.
- Lưu request fingerprint, trạng thái, response code/body cần thiết và expiry.
- Cùng key + cùng fingerprint trả kết quả đã lưu.
- Cùng key + khác fingerprint trả conflict.
- Concurrent request dùng unique constraint/lock để chỉ một executor.
- Trạng thái `IN_PROGRESS` có timeout và recovery strategy.
- Provider key được dẫn xuất ổn định nhưng không lộ PII.
- Consumer event dùng event ID/inbox record để loại duplicate.
- Idempotency không thay thế transaction hoặc invariant.


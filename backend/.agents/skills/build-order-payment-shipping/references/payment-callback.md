# Payment callback

1. Đọc raw body theo yêu cầu chữ ký provider.
2. Xác minh signature/HMAC/certificate, timestamp và replay window.
3. Parse schema sau khi xác minh; giới hạn kích thước payload.
4. Tìm event/provider transaction bằng unique key.
5. Ghi receipt hoặc trạng thái processing idempotently.
6. Kiểm tra amount, currency, merchant/order reference.
7. Chuyển payment state hợp lệ trong transaction và ghi outbox.
8. Trả status theo contract provider; không lộ lỗi nội bộ.
9. Retry lỗi tạm thời; dead-letter/alert lỗi vĩnh viễn.
10. Giữ payload đã redaction/hash theo retention để audit.

Không allowlist IP thay cho signature; có thể dùng như lớp bổ sung.


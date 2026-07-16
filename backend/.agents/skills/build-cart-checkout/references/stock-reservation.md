# Stock reservation

- Mỗi checkout tạo reservation theo order/checkout attempt và idempotency key.
- Reservation nhiều SKU khóa theo thứ tự ổn định.
- Chỉ `ACTIVE` giữ lượng reserved.
- Có `expires_at`; TTL đủ cho payment flow nhưng không giữ kho vô hạn.
- Payment success/confirm order chuyển `ACTIVE -> CONSUMED`.
- Payment fail, cancel hoặc timeout chuyển `ACTIVE -> RELEASED/EXPIRED`.
- Consumer/job phải chịu duplicate và xử lý state hiện tại.
- Không tăng/giảm balance hai lần khi callback lặp.
- Metric: active quantity, expired count, release lag, conflict và insufficient stock.


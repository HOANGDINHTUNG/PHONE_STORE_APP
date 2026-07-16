# Stock concurrency

## Lựa chọn

- **Atomic conditional update**: cập nhật khi available đủ; phù hợp đường nóng đơn giản.
- **Pessimistic lock**: khóa row trong transaction ngắn; dễ hiểu nhưng cần theo dõi contention/deadlock.
- **Optimistic lock**: version + retry giới hạn; phù hợp xung đột thấp.
- **Serialized queue**: chỉ dùng khi kiến trúc event/throughput chứng minh cần.

## Quy tắc

- Khóa theo thứ tự SKU ổn định khi reservation nhiều dòng để giảm deadlock.
- Transaction không gọi payment/network trong lúc giữ lock.
- Retry chỉ với lỗi tạm thời, có jitter/giới hạn và idempotency.
- Unique key bảo vệ reservation/operation không bị tạo trùng.
- Test song song phải chứng minh tổng reserved không vượt available.
- Ghi metric conflict, retry, deadlock, reservation timeout và oversell prevention.


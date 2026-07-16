# Shipping lifecycle

- Shipment có thể chứa toàn bộ hoặc một phần order; mapping quantity phải rõ.
- Chỉ tạo fulfillment khi order đủ điều kiện.
- Tracking number unique theo carrier khi có thể.
- Adapter carrier có timeout, retry giới hạn, circuit breaker theo nhu cầu và idempotency.
- Webhook carrier xác minh chữ ký và xử lý duplicate/out-of-order.
- Không đánh dấu order delivered nếu tổng quantity chưa hoàn thành theo policy.
- Failed delivery/return là state riêng, không “quay lùi” không lịch sử.
- Địa chỉ shipment dùng snapshot; thay đổi địa chỉ sau cutoff cần command/audit riêng.
- Metric: fulfillment lag, delivery time, webhook error, stuck shipment và return rate.


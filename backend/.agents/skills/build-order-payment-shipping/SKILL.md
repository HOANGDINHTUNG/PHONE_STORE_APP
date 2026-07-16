---
name: build-order-payment-shipping
description: Thiết kế và triển khai vòng đời order, payment callback, idempotency, cancellation, refund, shipment và compensation. Dùng khi làm tạo/xác nhận/hủy đơn, tích hợp cổng thanh toán, webhook, COD, hoàn tiền, đóng gói, giao hàng, tracking hoặc xử lý retry và callback trùng.
---

# Build Order Payment Shipping

Đọc project state machines, security, database, API và testing rules trước khi triển khai.

## Quy trình

1. Mô hình hóa order theo [order-lifecycle.md](references/order-lifecycle.md).
2. Mô hình hóa attempt/payment theo [payment-lifecycle.md](references/payment-lifecycle.md).
3. Bảo vệ webhook theo [payment-callback.md](references/payment-callback.md).
4. Áp dụng [idempotency.md](references/idempotency.md) cho mọi lệnh có side effect.
5. Xử lý hủy/hoàn theo [cancellation-refund.md](references/cancellation-refund.md).
6. Điều phối fulfillment bằng [shipping-lifecycle.md](references/shipping-lifecycle.md).
7. Viết test duplicate, out-of-order, timeout, partial failure, refund trùng và shipment transition sai.
8. Thêm metric, audit, reconciliation job và runbook lỗi provider.

## Ràng buộc

- Payment provider callback không tự động được tin cậy chỉ vì trả HTTP 200.
- Order, payment và shipment là state machine độc lập có liên kết rõ.
- Không giữ database transaction trong network call.
- Snapshot order là bất biến; thay đổi hậu mãi dùng record/transition mới.
- Mọi compensation và callback phải idempotent.


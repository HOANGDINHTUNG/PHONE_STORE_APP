# Database model

## Aggregate chính

- Identity: `users`, `roles`, `user_roles`, `refresh_sessions`.
- Catalog: `brands`, `categories`, `products`, `product_variants`, `product_media`, `product_attributes`.
- Pricing: `prices` hoặc lịch sử giá có hiệu lực.
- Inventory: `stock_items`, `stock_reservations`, `stock_movements`.
- Cart: `carts`, `cart_items`.
- Order: `orders`, `order_items`, `order_status_history`.
- Payment: `payment_attempts`, `payment_callbacks`, `refunds`.
- Shipping: `shipments`, `shipment_status_history`.
- Reliability: `outbox_events`, `idempotency_records`, `audit_events`.

## Quy tắc mô hình

- Variant/SKU là đơn vị bán và giữ kho.
- Order item lưu snapshot SKU, tên, thuộc tính, đơn giá, số lượng, thuế/giảm giá.
- Tiền dùng `DECIMAL` với precision/scale được quyết định tập trung; không dùng floating point.
- Mọi timestamp nghiệp vụ dùng UTC và độ chính xác nhất quán.
- Bảng trạng thái quan trọng có optimistic version hoặc cơ chế concurrency tương đương.


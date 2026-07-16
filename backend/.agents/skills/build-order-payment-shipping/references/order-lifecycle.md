# Order lifecycle

- Tạo order từ quote/checkout đã xác thực với order number unique.
- Order item, địa chỉ, giá và currency là snapshot.
- Chỉ order application service chuyển trạng thái.
- `PENDING_PAYMENT -> CONFIRMED` khi payment success/COD policy hợp lệ.
- `CONFIRMED -> PROCESSING` khi fulfillment nhận xử lý.
- `PROCESSING -> SHIPPED -> DELIVERED` theo shipment evidence.
- Hủy chỉ từ state cho phép; lưu actor, reason, timestamp.
- Mỗi transition dùng optimistic version và history record.
- Event order chứa ID/snapshot tối thiểu, version và correlation; consumer idempotent.


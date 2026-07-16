# REST conventions

- Dùng danh từ số nhiều: `/api/v1/products`, `/api/v1/orders/{orderId}`.
- Dùng subresource khi quan hệ/vòng đời rõ: `/orders/{id}/items`.
- Command không tự nhiên thành CRUD có thể dùng action rõ: `POST /orders/{id}/cancellations`, không dùng verb mơ hồ trong URL.
- `GET` an toàn, `PUT` idempotent thay thế đầy đủ, `PATCH` cập nhật phần, `DELETE` theo semantics đã định.
- `POST` tạo trả `201` + `Location`; async trả `202` và trạng thái theo dõi.
- `204` không có body.
- Header correlation/request ID được truyền/khởi tạo.
- Không dùng status 200 cho mọi lỗi.
- Content type JSON UTF-8; upload/download có giới hạn và media type rõ.


# Bản đồ domain

| Module | Sở hữu | Không sở hữu |
| --- | --- | --- |
| identity-access | User, credential, role, refresh session | Đơn hàng, thanh toán |
| catalog | Brand, category, product, variant, media, attributes | Tồn kho khả dụng |
| pricing | Price, price rule đã duyệt | Tổng đơn đã snapshot |
| inventory | Stock item, reservation, stock movement | Nội dung catalog |
| cart | Cart, cart item, cart lifecycle | Giá chuẩn và stock ledger |
| checkout | Điều phối báo giá, địa chỉ, giữ kho, tạo đơn | Credential, payment settlement |
| order | Order, order item snapshot, state transition | Token thanh toán |
| payment | Payment attempt, callback, refund | Trạng thái giao hàng |
| shipping | Shipment, tracking, fulfillment state | Tổng tiền đơn |
| observability | Audit event, metric conventions | Nghiệp vụ cốt lõi |

## Quy tắc tương tác

- Module chỉ ghi vào dữ liệu do mình sở hữu.
- Giao tiếp đồng bộ qua application service/interface; bất đồng bộ qua event có version.
- Không dùng entity JPA xuyên module làm hợp đồng.
- Truy vấn báo cáo có thể dùng read model riêng, không làm sai ownership.
- Transaction chỉ bao trùm một consistency boundary; dùng outbox/saga khi vượt ranh giới.


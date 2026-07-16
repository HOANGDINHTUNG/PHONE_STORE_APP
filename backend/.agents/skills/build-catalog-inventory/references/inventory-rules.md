# Inventory rules

## Công thức

`available = on_hand - reserved - safety_stock`

Mọi thành phần và đơn vị kho phải được định nghĩa rõ.

## Ledger

- Mỗi nhập, xuất, reserve, release, consume, return và adjustment tạo movement bất biến.
- Adjustment yêu cầu reason và actor.
- Không “sửa số” bằng update im lặng; ghi movement bù.
- Reservation có owner/reference, quantity, expiry và trạng thái.
- Job hết hạn phải idempotent và xử lý theo batch.
- Fulfillment consume reservation; cancel/reject release reservation.
- Đối soát định kỳ so sánh balance với movement ledger.
- Backorder chỉ bật khi có chính sách riêng; mặc định không cho oversell.


# State machine chuẩn

## Order

`DRAFT -> PENDING_PAYMENT -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED`

Nhánh kết thúc: `CANCELLED`. Chỉ cho phép hủy từ trạng thái được chính sách xác nhận; không chuyển ngược từ `SHIPPED` về `PROCESSING`.

## Payment

`CREATED -> PENDING -> SUCCEEDED`

Nhánh lỗi/kết thúc: `FAILED`, `EXPIRED`; sau thành công có thể `PARTIALLY_REFUNDED -> REFUNDED`.

## Shipment

`PENDING -> READY_TO_SHIP -> IN_TRANSIT -> DELIVERED`

Nhánh ngoại lệ: `FAILED_DELIVERY`, `RETURNED`, `CANCELLED` trước khi bàn giao hãng vận chuyển.

## Reservation

`ACTIVE -> CONSUMED` hoặc `ACTIVE -> RELEASED/EXPIRED`.

## Quy tắc chung

- Chỉ application service sở hữu aggregate được chuyển trạng thái.
- Mỗi transition phải có guard, actor, timestamp và lý do khi cần.
- Callback/event trùng không được tạo transition trùng.
- Lưu lịch sử cho order, payment, shipment và stock movement.
- Transition không hợp lệ trả lỗi nghiệp vụ ổn định, không âm thầm bỏ qua.
- Thêm trạng thái mới phải cập nhật database, API, event, test, tài liệu và runbook.


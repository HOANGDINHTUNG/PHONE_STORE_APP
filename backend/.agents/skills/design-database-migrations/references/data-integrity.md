# Data integrity

- Dùng `NOT NULL` cho dữ liệu bắt buộc sau khi backfill hoàn tất.
- Dùng unique/foreign key/check constraint cho invariant có thể bảo vệ ở DB.
- Quantity không âm; giá và tổng tiền tuân quy tắc dấu đã định.
- Reservation có quantity dương, thời điểm hết hạn và liên kết idempotent.
- Mỗi provider transaction/callback identifier phải unique khi provider đảm bảo.
- Stock movement là ledger append-only; không sửa lịch sử để “chữa số”.
- Order snapshot không tham chiếu động để suy ra giá/tên lịch sử.
- Xóa user phải theo retention/anonymization; không phá order/audit bắt buộc.
- Transaction isolation và lock phải được chọn cho use case, không dựa vào mặc định vô thức.


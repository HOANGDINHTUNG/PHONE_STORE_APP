# Pricing rules

- Tiền dùng decimal và mã tiền tệ ISO; không dùng `double`/`float`.
- Pricing service là nguồn sự thật; client chỉ gửi SKU/quantity/coupon input hợp lệ.
- Giá có `valid_from`, `valid_to`, trạng thái và timezone UTC.
- Nếu nhiều rule cùng áp dụng, thứ tự/ưu tiên phải deterministic.
- Không cho tổng dòng âm; quy tắc làm tròn được định nghĩa một nơi.
- Cart price là ước tính; checkout phải tính lại.
- Order lưu list price, sale price, discount, tax, currency và total snapshot.
- Thay đổi giá phải audit; giá quá khứ không bị sửa ngược.
- Cache giá phải có TTL/invalidation và không dùng dữ liệu stale cho bước cam kết nếu policy không cho phép.


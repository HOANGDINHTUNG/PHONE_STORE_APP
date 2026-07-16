# Price calculation

Thứ tự baseline cần được xác nhận và cố định:

1. Unit list price.
2. Unit sale price/rule ưu tiên.
3. Line subtotal = unit price × quantity.
4. Line/order discount hợp lệ.
5. Tax nếu áp dụng.
6. Shipping fee.
7. Grand total.

## Quy tắc

- Làm tròn ở điểm được định nghĩa, không làm tròn ngẫu nhiên từng tầng.
- Kết quả gồm breakdown và rule identifiers để audit.
- Coupon validate owner, thời gian, quota, min order và stacking.
- Tất cả quantity/price lấy lại tại checkout.
- Bất đồng giá so với cart phải trả quote mới hoặc yêu cầu xác nhận theo policy.
- Lưu snapshot đủ để đối soát nhưng không lưu secret của provider.


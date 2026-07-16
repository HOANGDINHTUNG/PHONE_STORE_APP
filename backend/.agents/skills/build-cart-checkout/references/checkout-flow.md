# Checkout flow

1. Xác thực principal/cart ownership và idempotency key.
2. Nạp cart phiên bản mong đợi; từ chối cart rỗng/hết hạn.
3. Kiểm tra variant active và giới hạn quantity.
4. Tính lại giá/khuyến mãi/phí bằng dữ liệu server.
5. Validate và snapshot địa chỉ nhận hàng.
6. Tạo reservation tồn kho trong transaction ngắn.
7. Tạo order `PENDING_PAYMENT` với item/price/address snapshot.
8. Tạo payment attempt hoặc COD instruction ngoài lock tồn kho.
9. Trả response ổn định; retry cùng key trả kết quả cũ.
10. Khi thất bại, giải phóng reservation theo compensation idempotent.

Nếu có outbox, ghi event cùng transaction sở hữu; publisher xử lý sau commit.


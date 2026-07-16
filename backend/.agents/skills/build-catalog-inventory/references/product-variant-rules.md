# Product variant rules

- Variant là đơn vị bán; mỗi variant có SKU bất biến sau khi phát sinh giao dịch.
- Tổ hợp option trong một product phải unique, ví dụ `color=black|storage=256gb`.
- Chuẩn hóa option key/value trước kiểm tra trùng.
- Không tạo cột riêng cho từng thuộc tính biến đổi liên tục; dùng mô hình attribute có kiểm soát.
- Thuộc tính dùng lọc cần kiểu dữ liệu chuẩn và index/search mapping phù hợp.
- Variant inactive không được thêm mới vào cart/checkout.
- Đổi tên hiển thị không làm thay đổi SKU hoặc order snapshot.
- Bulk import phải validate toàn bộ, báo lỗi theo dòng và có idempotency.


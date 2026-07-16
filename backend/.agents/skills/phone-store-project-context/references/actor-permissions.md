# Actor và quyền

| Actor | Quyền chính | Hạn chế bắt buộc |
| --- | --- | --- |
| Guest | Xem catalog, tìm kiếm, tạo giỏ tạm | Không checkout nếu chính sách yêu cầu tài khoản; không đọc dữ liệu người khác |
| Customer | Quản lý hồ sơ/địa chỉ của mình, giỏ, checkout, xem/hủy đơn hợp lệ | Chỉ thao tác tài nguyên thuộc sở hữu; không đổi giá/trạng thái tùy ý |
| Support | Tra cứu đơn phục vụ hỗ trợ, ghi chú theo quyền | Không sửa giá, tồn kho hoặc hoàn tiền nếu chưa được cấp quyền riêng |
| Warehouse | Xử lý đóng gói, giao kho, điều chỉnh kho có lý do | Không quản lý user/quyền hoặc xác nhận thanh toán |
| Admin | Quản trị catalog, giá, tài khoản vận hành và báo cáo | Hành động nhạy cảm phải audit; không được bỏ qua invariant |
| System | Chạy job, xử lý callback và event | Dùng service identity tối thiểu quyền; mọi tác vụ phải idempotent |

## Quy tắc kiểm tra quyền

- Xác thực danh tính trước, kiểm tra role/scope sau, rồi kiểm tra ownership.
- Kiểm tra quyền tại service boundary; annotation controller chỉ là lớp bảo vệ bổ sung.
- Từ chối mặc định khi role, ownership hoặc trạng thái không rõ.
- Không nhận `userId` từ request để quyết định chủ sở hữu nếu có thể lấy từ principal.
- Endpoint quản trị phải tách rõ namespace hoặc policy và có audit log.
- Không trả về sự tồn tại của tài nguyên người khác nếu điều đó làm lộ dữ liệu.


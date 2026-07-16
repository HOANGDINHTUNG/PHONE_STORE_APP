# Thuật ngữ nghiệp vụ

- **Product**: mẫu điện thoại/phụ kiện ở mức nội dung chung.
- **Variant**: phiên bản bán được, xác định bởi tổ hợp như màu, RAM, dung lượng; có SKU riêng.
- **SKU**: mã duy nhất của biến thể dùng trong bán hàng và kho.
- **List price**: giá niêm yết trước ưu đãi.
- **Sale price**: giá bán hợp lệ tại thời điểm định giá.
- **Price snapshot**: giá và thành phần tính tiền được đóng băng trong order item.
- **On-hand**: số lượng vật lý ghi nhận trong kho.
- **Reserved**: số lượng đang giữ cho checkout/đơn.
- **Available**: lượng có thể bán, thường bằng on-hand trừ reserved và safety stock.
- **Reservation**: quyền giữ một lượng SKU đến thời điểm hết hạn hoặc tiêu thụ.
- **Cart**: ý định mua có thể thay đổi, chưa phải cam kết giá/tồn.
- **Checkout**: quy trình xác thực giá, địa chỉ, tồn kho và tạo đơn.
- **Order**: cam kết thương mại có snapshot dữ liệu.
- **Payment attempt**: một lần thử thanh toán với idempotency key riêng.
- **Shipment**: một lần thực hiện giao một phần hoặc toàn bộ order.
- **Refund**: nghiệp vụ hoàn tiền, không đồng nghĩa tự động với hủy đơn.
- **Idempotency key**: khóa giúp lặp lại cùng yêu cầu mà không tạo hiệu ứng trùng.


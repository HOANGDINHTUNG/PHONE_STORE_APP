# Phạm vi dự án

## Mục tiêu

Xây dựng backend thương mại điện tử bán điện thoại và phụ kiện cho web ReactJS, ứng dụng React Native và trang quản trị. Backend phải an toàn, dễ mở rộng, có tài liệu và kiểm thử tự động.

## Trong phạm vi

- Đăng ký, đăng nhập, refresh token, đăng xuất và quản lý hồ sơ.
- Phân quyền khách hàng, nhân viên vận hành và quản trị viên.
- Thương hiệu, danh mục, sản phẩm, biến thể, ảnh và thuộc tính.
- Giá bán, tồn kho khả dụng, giữ hàng và lịch sử điều chỉnh kho.
- Giỏ hàng khách/đã đăng nhập, hợp nhất giỏ và checkout.
- Địa chỉ nhận hàng, đơn hàng, thanh toán, hoàn tiền và vận chuyển.
- Tìm kiếm, lọc, sắp xếp và phân trang danh mục.
- Audit log, health check, metric, logging và quy trình release/rollback.

## Ngoài phạm vi mặc định

- Marketplace nhiều người bán.
- Đấu giá, subscription, BNPL nội bộ hoặc ví điện tử riêng.
- Hệ thống kế toán/ERP hoàn chỉnh.
- Tự xây cổng thanh toán hoặc hệ thống hãng vận chuyển.
- Recommendation dùng machine learning.
- Multi-region active-active.

Chỉ đưa mục ngoài phạm vi vào khi có ADR và yêu cầu được phê duyệt.

## Ranh giới backend

- Backend là nguồn sự thật cho quyền, giá cuối cùng, tồn kho và trạng thái đơn.
- Client không được quyết định tổng tiền, giảm giá, quyền hoặc state transition.
- Tích hợp ngoài phải qua adapter và có timeout, retry có giới hạn, idempotency và quan sát được.


# Ownership rules

- Lấy current user từ security context, không tin `userId` client gửi.
- Repository query nên gắn owner khi phù hợp: tìm theo `resourceId + ownerId`.
- Admin bypass phải thể hiện bằng policy riêng và audit, không dùng điều kiện ngầm.
- Child resource thừa hưởng ownership từ aggregate root; kiểm tra chuỗi liên kết ở server.
- Order chỉ được customer xem khi `order.customer_id == principal.id`.
- Cart guest dùng opaque session identifier được bảo vệ; không dùng ID tuần tự có thể đoán.
- URL ID không phải bằng chứng quyền.
- Trả 404 thay vì 403 khi cần tránh lộ sự tồn tại, nhưng giữ audit nội bộ chính xác.
- Kiểm tra trạng thái cùng ownership; owner không có nghĩa được phép mọi transition.


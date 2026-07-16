---
name: phone-store-project-context
description: Cung cấp nguồn ngữ cảnh chuẩn cho toàn bộ backend cửa hàng điện thoại, gồm phạm vi, actor, quyền, domain, thuật ngữ, state machine và yêu cầu phi chức năng. Dùng trước khi phân tích yêu cầu, thiết kế, triển khai, kiểm thử hoặc review bất kỳ tính năng nghiệp vụ nào của dự án.
---

# Phone Store Project Context

Luôn đọc skill này trước các skill nghiệp vụ khác khi tác vụ có thể ảnh hưởng hành vi hệ thống.

## Trình tự bắt buộc

1. Đọc [project-scope.md](references/project-scope.md) để xác nhận phạm vi.
2. Đọc [business-glossary.md](references/business-glossary.md) và dùng đúng thuật ngữ.
3. Đọc [actor-permissions.md](references/actor-permissions.md) trước khi thiết kế quyền.
4. Đọc [domain-map.md](references/domain-map.md) để xác định module sở hữu dữ liệu.
5. Đọc [status-machines.md](references/status-machines.md) nếu có thay đổi trạng thái.
6. Đọc [non-functional-requirements.md](references/non-functional-requirements.md) trước khi chốt thiết kế.

## Cách làm việc

- Xác định actor, use case, dữ liệu đầu vào, kết quả và failure mode.
- Phân biệt yêu cầu đã xác nhận, giả định và câu hỏi còn mở.
- Không tự thêm nghiệp vụ thanh toán, khuyến mãi, vận chuyển hoặc đổi trả chưa được xác nhận.
- Không tạo quan hệ xuyên module chỉ để thuận tiện truy vấn.
- Giữ snapshot giá và thông tin hàng hóa tại thời điểm đặt hàng.
- Với thông tin chưa đủ, ghi `OPEN QUESTION` và đề xuất tối đa ba lựa chọn kèm hệ quả.
- Nếu tài liệu dự án mâu thuẫn, ưu tiên rule 00–60; sau đó báo rõ mâu thuẫn thay vì tự chọn im lặng.

## Kết quả phải trả

- Phạm vi chịu ảnh hưởng.
- Actor và quyền liên quan.
- Module sở hữu thay đổi.
- Invariant và state transition bị tác động.
- Rủi ro, giả định, câu hỏi còn mở.
- Tài liệu và kiểm thử cần cập nhật.


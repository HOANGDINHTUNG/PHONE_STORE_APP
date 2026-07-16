# Implement feature

Triển khai một feature backend theo lát dọc, giữ đúng domain boundary và safe-change policy.

## Đầu vào

Feature/use case, actor, acceptance criteria, dữ liệu/API bị tác động và phạm vi được phép sửa.

## Bắt buộc đọc

- Rules 00–60.
- `phone-store-project-context` và skill domain tương ứng.
- `enforce-backend-architecture`, `design-rest-api`, `test-backend-quality`.
- Thêm security/database skill nếu có quyền hoặc schema.

## Thực hiện

1. Khảo sát code/test/docs hiện tại bằng tìm kiếm read-only.
2. Tóm tắt hành vi hiện tại, invariant, boundary, dependency và rủi ro.
3. Tách acceptance criteria thành success/validation/auth/conflict/failure.
4. Thiết kế thay đổi nhỏ nhất; đánh dấu API/schema/event breaking change.
5. Viết hoặc cập nhật test thể hiện hành vi.
6. Triển khai domain/application trước, adapter/API sau.
7. Thêm migration tương thích nếu bắt buộc.
8. Chạy test hẹp, validator liên quan, rồi full quality gate.
9. Cập nhật OpenAPI/docs/ADR/runbook phù hợp.
10. Review diff để loại thay đổi ngoài phạm vi, secret, log nhạy cảm và TODO nguy hiểm.

## Dừng an toàn

Dừng nếu yêu cầu mâu thuẫn, ownership không rõ, cần phá compatibility, thay đổi production hoặc test hiện tại chứng minh giả định sai.

## Báo cáo

Kết quả, file thay đổi, quyết định thiết kế, test/validator đã chạy, compatibility và rủi ro còn lại.


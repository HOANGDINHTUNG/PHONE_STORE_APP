# Implement feature

Triển khai một feature backend theo lát dọc, giữ đúng domain boundary và safe-change policy.

## Đầu vào

Feature/use case, actor, acceptance criteria, dữ liệu/API bị tác động và phạm vi được phép sửa.

## Bắt buộc đọc

- Rules 00–60.
- `phone-store-project-context` và skill domain tương ứng.
- `enforce-backend-architecture`, `design-rest-api`, `document-openapi-swagger`, `test-backend-quality` khi feature có HTTP contract.
- Thêm security/database skill nếu có quyền hoặc schema.

## Thực hiện

1. Khảo sát code/test/docs hiện tại bằng tìm kiếm read-only.
2. Tóm tắt hành vi hiện tại, invariant, boundary, dependency và rủi ro.
3. Tách acceptance criteria thành success/validation/auth/conflict/failure.
4. Thiết kế thay đổi nhỏ nhất; đánh dấu API/schema/event breaking change.
5. Viết hoặc cập nhật test thể hiện hành vi. Bắt buộc test toàn bộ các HTTP API Controllers.
6. Triển khai domain/application trước, adapter/API sau.
7. Triển khai Logging (SLF4J): Bắt buộc log.info/log.debug khi bắt đầu (entry), log.error/warn khi thất bại, không log data nhạy cảm.
8. Thêm migration tương thích nếu bắt buộc.
9. Dữ liệu tĩnh Swagger (OpenAPI): Bắt buộc đồng bộ code thay đổi với `docs/api/openapi.yaml`. File YAML phải đủ Schema, Properties type, Validation constraints và cực kỳ chú trọng **Dữ liệu mẫu (`example`) đầy đủ và thực tế** cho từng field.
10. Đồng bộ static resources: OpenAPI YAML phải được tự động copy sang `src/main/resources/static/openapi.yaml` để UI nhận thay đổi ngay lập tức.
11. Chạy test hẹp, validator liên quan, rồi full quality gate (`gradlew classes test`).
12. Review diff để loại thay đổi ngoài phạm vi, secret, log nhạy cảm và TODO nguy hiểm.

## Dừng an toàn

Dừng nếu yêu cầu mâu thuẫn, ownership không rõ, cần phá compatibility, thay đổi production hoặc test hiện tại chứng minh giả định sai.

## Báo cáo

Kết quả, file thay đổi, quyết định thiết kế, test/validator đã chạy, compatibility và rủi ro còn lại.

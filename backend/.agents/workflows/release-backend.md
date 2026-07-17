# Release backend

Chuẩn bị, xác minh và bàn giao một backend release có thể rollback.

## Đầu vào

Version/revision, scope, target environment, release window, owner và change approval.

## Bắt buộc đọc

Rules 20/30/40/50/60; `deliver-backend`, `document-openapi-swagger`, `test-backend-quality`, `design-database-migrations`, `optimize-observability` và domain skill bị tác động.

## Thực hiện

1. Xác nhận scope/release notes và worktree/revision sạch theo quy trình.
2. Chạy full quality gate và security/dependency/image scan.
3. Build artifact/image một lần; gắn tag immutable, checksum/SBOM.
4. Review config/secret/permission và production profile; xác minh Swagger UI, runtime docs và external spec path đã tắt/bảo vệ đúng policy.
5. Rehearse migration/upgrade, ước lượng lock và xác nhận compatibility app cũ/mới.
6. Deploy staging bằng cùng artifact; chạy smoke/integration nghiệp vụ.
7. Xác nhận dashboard, alert, runbook, rollback trigger và decision owner.
8. Production deployment chỉ khi có authority/quy trình rõ; không tự thực hiện ngoài phạm vi.
9. Theo dõi health, error, latency, payment, order và inventory metric.
10. Xác minh dữ liệu/flow; ghi evidence và kết thúc window hoặc rollback theo trigger.

## Dừng an toàn

Dừng nếu gate fail, artifact khác staging, migration không tương thích, secret thiếu, observability/rollback chưa sẵn sàng hoặc không có thẩm quyền production.

## Báo cáo

Version/artifact, gate evidence, migration, config, smoke result, metric theo dõi, quyết định release/rollback và issue còn lại.

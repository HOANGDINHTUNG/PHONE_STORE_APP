# Change database

Thiết kế và kiểm chứng thay đổi MySQL/Flyway theo expand–migrate–contract.

## Đầu vào

Mục tiêu dữ liệu, bảng/module sở hữu, volume ước tính, query chịu ảnh hưởng và yêu cầu downtime.

## Bắt buộc đọc

Rules 30/50/60; `phone-store-project-context`, `design-database-migrations`, `enforce-backend-architecture` và domain skill liên quan.

## Thực hiện

1. Kiểm tra toàn bộ migration history, entity/repository/query và docs schema.
2. Xác nhận ownership, invariant, retention và compatibility app cũ/mới.
3. Thiết kế schema/constraint/index từ query thật.
4. Chọn expand, backfill batch/checkpoint, dual read/write nếu cần, rồi contract ở release sau.
5. Tạo migration version mới; không sửa file đã áp dụng.
6. Chạy migration validator và schema inspector.
7. Test Flyway trên MySQL container sạch.
8. Test upgrade từ baseline hỗ trợ và query/constraint/concurrency liên quan.
9. Ghi lock/time estimate, verification query, backup, rollback/forward-fix và metric.
10. Cập nhật data dictionary/ERD/ADR/runbook.

## Dừng an toàn

Dừng với DROP/TRUNCATE/type-loss, backfill lớn, lock dài, checksum drift hoặc schema production không rõ; yêu cầu review/phê duyệt.

## Báo cáo

Migration, compatibility matrix, test evidence, query/index plan, rollout và rollback.


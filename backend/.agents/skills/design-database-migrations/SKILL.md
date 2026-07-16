---
name: design-database-migrations
description: Thiết kế, review và kiểm tra schema MySQL cùng Flyway migration an toàn cho backend cửa hàng điện thoại. Dùng khi tạo/sửa bảng, cột, constraint, index, seed data, data migration, phân tích schema hoặc lập kế hoạch rollout và rollback database.
---

# Design Database Migrations

Đọc rules 30 và 60, project context và architecture skill trước mọi thay đổi database.

## Quy trình

1. Xác định aggregate/module sở hữu dữ liệu theo [database-model.md](references/database-model.md).
2. Áp dụng [table-conventions.md](references/table-conventions.md), [data-integrity.md](references/data-integrity.md) và [index-strategy.md](references/index-strategy.md).
3. Chọn chiến lược expand–migrate–contract theo [flyway-rules.md](references/flyway-rules.md).
4. Tạo migration từ [migration-template.sql](assets/migration-template.sql).
5. Chạy `python3 scripts/validate_migration.py <project-root>`.
6. Chạy `python3 scripts/inspect_schema.py <project-root>` để xem bảng/index/foreign key suy ra.
7. Kiểm thử trên MySQL container sạch và trên bản sao schema gần production.
8. Ghi kế hoạch deploy, metric theo dõi và rollback/forward-fix.

## Dừng và xin xác nhận khi

- Có `DROP`, đổi kiểu làm mất dữ liệu, xóa constraint/index đang dùng hoặc migration data lớn.
- Cần khóa bảng lâu, yêu cầu downtime hoặc không có cách tương thích ngược.
- Ownership dữ liệu không rõ hoặc schema thực tế lệch lịch sử Flyway.

Không sửa migration đã chạy ở môi trường dùng chung; tạo migration mới.


# Table conventions

- Tên bảng/cột dùng `snake_case`, số nhiều nhất quán.
- Primary key chọn một chiến lược nhất quán; không đổi kiểu tùy module.
- Foreign key có tên: `fk_<child>__<parent>`.
- Unique constraint: `uk_<table>__<columns>`.
- Index: `idx_<table>__<columns>`.
- Check constraint: `ck_<table>__<rule>`.
- Dùng `created_at`, `updated_at`; thêm `created_by`/`updated_by` khi nghiệp vụ cần.
- Không dùng từ khóa SQL, tên mơ hồ như `data`, `value`, `type` nếu thiếu ngữ cảnh.
- Chuỗi business key có collation/case-sensitivity được xác định rõ.
- Không lạm dụng soft delete; nếu dùng, xác định unique/index và chính sách purge.
- Không cascade delete dữ liệu lịch sử order/payment/audit.


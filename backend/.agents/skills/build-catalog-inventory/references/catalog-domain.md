# Catalog domain

## Aggregate

- Brand: tên, slug, trạng thái.
- Category: cây phân loại có quy tắc chống cycle.
- Product: nội dung chung, brand, categories, mô tả, trạng thái.
- Variant: SKU, tổ hợp thuộc tính bán được, barcode tùy chọn, trạng thái.
- Media: URL/object key, loại, thứ tự, alt text.
- Attribute definition/value: kiểu dữ liệu, đơn vị và khả năng lọc.

## Quy tắc

- Product chỉ `ACTIVE` khi có ít nhất một variant hợp lệ theo nghiệp vụ.
- Slug và SKU có uniqueness/case rule rõ.
- Xóa mềm catalog không xóa order history.
- Ảnh lưu metadata; object storage/CDN chịu trách nhiệm binary.
- Search/filter dùng field allowlist; không cho client truyền tên cột tùy ý.
- Cây category ngăn self-parent và cycle.


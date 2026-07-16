---
name: build-catalog-inventory
description: Thiết kế và triển khai catalog điện thoại, product variant/SKU, thuộc tính, giá, tồn kho, reservation và concurrency. Dùng khi làm sản phẩm, danh mục, thương hiệu, biến thể, tìm kiếm catalog, giá bán, nhập/xuất/điều chỉnh kho hoặc chống overselling.
---

# Build Catalog Inventory

Đọc project context, rules 10/30/40/50/60 và database skill trước khi triển khai.

## Quy trình

1. Xác định aggregate theo [catalog-domain.md](references/catalog-domain.md).
2. Chuẩn hóa SKU/variant bằng [product-variant-rules.md](references/product-variant-rules.md).
3. Thiết kế giá theo [pricing-rules.md](references/pricing-rules.md).
4. Bảo vệ ledger và available stock theo [inventory-rules.md](references/inventory-rules.md).
5. Chọn concurrency strategy trong [stock-concurrency.md](references/stock-concurrency.md).
6. Viết migration, API, application service, audit và test cạnh tranh.
7. Kiểm thử ít nhất: SKU trùng, giá hết hiệu lực, stock bằng 0, hai checkout đồng thời, reservation hết hạn.

## Invariant bắt buộc

- SKU duy nhất; variant thuộc đúng product.
- Client không quyết định giá cuối cùng hoặc available stock.
- Stock không âm theo chính sách đã chọn.
- Mọi điều chỉnh kho có reason, actor/idempotency và movement record.
- Catalog inactive không bán mới nhưng dữ liệu order cũ vẫn đọc được từ snapshot.


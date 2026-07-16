---
name: build-cart-checkout
description: Thiết kế và triển khai giỏ hàng guest/customer, hợp nhất giỏ, tính giá, checkout và giữ tồn kho an toàn. Dùng khi làm cart item, guest session, đăng nhập merge cart, báo giá checkout, địa chỉ, coupon, reservation, tạo đơn hoặc xử lý checkout đồng thời.
---

# Build Cart Checkout

Đọc project context, catalog/inventory skill, security và API rules trước khi làm.

## Quy trình

1. Thiết kế guest identity theo [guest-cart.md](references/guest-cart.md).
2. Chọn merge policy theo [cart-merge.md](references/cart-merge.md).
3. Thực hiện checkout orchestration theo [checkout-flow.md](references/checkout-flow.md).
4. Tính lại toàn bộ server-side theo [price-calculation.md](references/price-calculation.md).
5. Giữ và giải phóng kho theo [stock-reservation.md](references/stock-reservation.md).
6. Bảo vệ endpoint ghi bằng idempotency key và optimistic concurrency/cart version.
7. Test duplicate request, price change, stock shortage, expired cart/reservation và retry sau timeout.

## Ràng buộc

- Cart không cam kết giá hoặc tồn kho.
- Cart item tham chiếu variant/SKU, không product chung.
- Checkout không tin total, discount, shipping fee hoặc owner từ client.
- Tạo order và reservation phải có boundary/compensation rõ.
- Không giữ database lock trong lúc gọi cổng thanh toán.


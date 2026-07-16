# Cart merge

## Chính sách baseline

- Nếu cùng SKU, cộng quantity nhưng cap theo giới hạn mua và available policy.
- Nếu SKU chỉ có ở một giỏ, giữ item nếu còn active.
- Không giữ giá cũ; đánh dấu cần reprice.
- Coupon/promotion phải tính lại; không cộng discount snapshot.
- Item không còn bán hoặc vượt tồn được giữ với trạng thái cảnh báo hoặc loại theo policy đã xác nhận.
- Chọn một active cart đích; cart nguồn chuyển `MERGED` và không dùng lại.
- Operation có idempotency key để login retry không nhân đôi quantity.

Trả merge summary cho client: item giữ, thay đổi quantity, loại bỏ, giá thay đổi và cảnh báo.


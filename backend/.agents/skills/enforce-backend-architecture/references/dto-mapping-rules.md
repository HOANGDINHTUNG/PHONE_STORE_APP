# DTO mapping rules

- Tách request DTO, response DTO, command/query và persistence entity.
- Request chỉ chứa dữ liệu client được phép điều khiển.
- Không bind `id`, `ownerId`, `role`, `status` hoặc giá cuối cùng nếu server sở hữu.
- Validate cú pháp ở API; validate invariant tại domain/application.
- Mapper không truy cập database và không có side effect.
- Response dùng kiểu ổn định: ID, ISO-8601 UTC, tiền theo decimal + currency.
- Order item response lấy snapshot, không join ngược catalog để làm thay đổi lịch sử.
- Mapping thủ công ưu tiên khi logic nhỏ; MapStruct chỉ dùng nếu giảm lỗi và được kiểm thử.
- Không trả lazy proxy, bidirectional graph hoặc exception nội bộ.


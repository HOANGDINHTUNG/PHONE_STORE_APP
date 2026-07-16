# Slice testing

## Web slice

- Kiểm tra mapping, JSON, validation, error contract và security filter.
- Mock application port/service, không mock controller internals.
- Bao phủ anonymous, role thiếu, owner sai và success.
- Kiểm tra field nhạy cảm không xuất hiện.

## Data slice

- Ưu tiên MySQL Testcontainers nếu query phụ thuộc dialect/lock/index.
- Kiểm tra mapping, constraint, unique, pagination và custom query.
- Không dùng H2 để xác nhận behavior chỉ có ở MySQL.
- Reset dữ liệu bằng transaction/fixture có kiểm soát.


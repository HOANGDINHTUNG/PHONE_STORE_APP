# Authorization matrix

| Năng lực | Guest | Customer | Support | Warehouse | Admin |
| --- | --- | --- | --- | --- | --- |
| Đọc catalog public | Có | Có | Có | Có | Có |
| Quản lý hồ sơ/địa chỉ bản thân | Không | Có | Theo policy | Không | Theo policy |
| Quản lý catalog/giá | Không | Không | Không | Không | Có |
| Điều chỉnh tồn kho | Không | Không | Không | Có, có lý do | Có |
| Xem đơn bản thân | Không | Có | Có theo phạm vi | Theo fulfillment | Có |
| Hủy đơn | Không | Có nếu owner + state | Theo quyền | Không | Theo quyền |
| Hoàn tiền | Không | Không | Chỉ nếu được cấp riêng | Không | Theo quyền riêng |
| Quản lý role | Không | Không | Không | Không | Có, audit |

Ma trận là baseline; quyền chi tiết phải dùng authority rõ, không suy từ tên endpoint.


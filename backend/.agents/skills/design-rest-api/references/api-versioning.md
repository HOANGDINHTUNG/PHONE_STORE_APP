# API versioning

- Baseline dùng URI major version: `/api/v1`.
- Thay đổi additive thường không tăng major: endpoint mới, optional request field, optional response field nếu client chịu được.
- Breaking: xóa/đổi tên field, đổi type/nullability/semantics/status code, siết validation không tương thích, thay enum mà client không chịu giá trị mới.
- Deprecation phải có thông báo, thời hạn, metric usage và migration guide.
- Duy trì contract test cho version còn hỗ trợ.
- Không fork logic lâu dài nếu có thể dùng adapter/version mapper.
- OpenAPI là artifact được review và diff trong CI.
- Version event/schema tích hợp độc lập với REST version.


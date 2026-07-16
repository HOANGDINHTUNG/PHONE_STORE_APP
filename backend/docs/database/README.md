# Database

Lưu schema overview, ERD, data dictionary, ownership, query/index và migration notes.

## Quy tắc

- Flyway SQL là nguồn sự thật triển khai schema.
- Docs giải thích ý nghĩa nghiệp vụ và ownership, không thay migration.
- Mỗi thay đổi bảng/constraint/index cập nhật data dictionary.
- Ghi retention, PII classification và backup/restore với dữ liệu quan trọng.
- Không lưu credential hoặc production sample có PII.

Dùng [DATA-DICTIONARY-TEMPLATE.md](DATA-DICTIONARY-TEMPLATE.md).


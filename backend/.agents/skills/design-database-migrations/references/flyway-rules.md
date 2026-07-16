# Flyway rules

- Dùng tên `V<version>__<description>.sql`; version duy nhất và tăng dần.
- Không sửa/xóa migration đã áp dụng ở môi trường dùng chung.
- Migration phải deterministic, không phụ thuộc timezone hoặc dữ liệu ngoài không pin.
- Tách schema change và backfill lớn nếu cần quan sát/khôi phục riêng.
- Ưu tiên expand–migrate–contract:
  1. Thêm cấu trúc tương thích.
  2. Deploy code đọc/ghi tương thích.
  3. Backfill theo batch có checkpoint.
  4. Chuyển traffic/đọc.
  5. Xóa cấu trúc cũ ở release sau.
- Không trộn DDL nguy hiểm với nhiều thay đổi không liên quan.
- Seed chỉ cho dữ liệu tham chiếu bắt buộc; dữ liệu demo thuộc profile/dev fixture.
- Ghi chú lock, thời lượng dự kiến, điều kiện rollback và verification query.


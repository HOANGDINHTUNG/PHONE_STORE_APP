# Pagination, filtering và sorting

- Chọn page/size hoặc cursor theo dữ liệu; dùng nhất quán trong cùng nhóm API.
- `size` có mặc định và maximum.
- Cursor opaque, được ký/mã hóa nếu chứa dữ liệu nhạy cảm.
- Sort chỉ nhận field trong allowlist và hướng `asc|desc`.
- Filter typed rõ: exact, range, multi-value, search; không ghép SQL từ input.
- Luôn có tie-breaker ổn định như ID khi sort.
- Metadata tối thiểu: items, page/cursor tiếp theo, size; total chỉ trả khi chi phí chấp nhận.
- Truy vấn phải có index/plan tương ứng.
- Không dùng offset sâu cho tập dữ liệu lớn nếu latency không đạt.


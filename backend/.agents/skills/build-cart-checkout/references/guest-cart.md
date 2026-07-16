# Guest cart

- Dùng opaque cart token đủ entropy, không dùng ID tuần tự lộ ra ngoài.
- Lưu token hash/fingerprint khi thiết kế yêu cầu; đặt expiry và rotation policy.
- Cookie web dùng Secure, HttpOnly, SameSite phù hợp; mobile lưu local identifier an toàn.
- Không gắn guest cart với PII nếu chưa cần.
- Mỗi request phải validate cart status/expiry.
- Rate-limit tạo cart và thêm item để tránh abuse.
- Khi đăng nhập, merge trong transaction/idempotent operation rồi vô hiệu hóa guest token cũ.
- Không cho token guest truy cập order hoặc dữ liệu user.


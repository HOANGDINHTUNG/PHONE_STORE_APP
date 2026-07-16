# Logging rules

- Log có cấu trúc: timestamp UTC, level, service, environment, correlation ID, event name.
- Truyền correlation ID qua HTTP/event; tạo mới nếu thiếu và validate độ dài.
- Dùng event/action ổn định thay vì câu tự do khó truy vấn.
- INFO cho lifecycle đáng chú ý, WARN cho bất thường phục hồi được, ERROR cho lỗi cần hành động.
- Không log cùng exception ở nhiều tầng.
- Không log body mặc định; redact password, token, cookie, authorization, PII và payment data.
- Không dùng order ID/user ID làm metric label, nhưng có thể log theo retention/access policy.
- Sampling chỉ áp dụng log tần suất cao, không làm mất audit bắt buộc.


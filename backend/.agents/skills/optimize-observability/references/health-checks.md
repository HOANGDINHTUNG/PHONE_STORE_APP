# Health checks

- **Liveness**: tiến trình/JVM hoạt động; không phụ thuộc DB, cache hoặc provider.
- **Readiness**: khả năng nhận traffic; có thể kiểm tra dependency thiết yếu với timeout ngắn.
- **Startup**: cho phép ứng dụng warm-up/migration trước khi liveness bắt đầu.
- Không expose detail nhạy cảm ra public.
- Health endpoint cần authentication/network policy theo môi trường.
- Dependency tùy chọn không nhất thiết làm toàn service unready; định nghĩa degradation.
- Probe timeout/failureThreshold phải phù hợp startup và tránh restart storm.
- Test ứng dụng khi DB down, provider down và pool exhausted.


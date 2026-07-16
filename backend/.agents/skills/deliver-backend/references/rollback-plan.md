# Rollback plan

## Phải ghi

- Trigger: error rate, latency, payment mismatch, oversell, health hoặc business KPI.
- Người quyết định và người thực hiện.
- Artifact/image version trước.
- Lệnh/quy trình rollback ứng dụng.
- Tác động database và khả năng app cũ đọc schema mới.
- Cách tắt feature bằng flag nếu có.
- Verification query/smoke test.
- Kế hoạch truyền thông và post-incident.

## Database

Ưu tiên forward-fix và expand–contract. Không rollback schema phá hủy nếu có thể mất dữ liệu mới. Nếu migration không tương thích ngược, release phải có maintenance/downtime plan được phê duyệt trước.

Rollback không hoàn tất cho đến khi metric ổn định và dữ liệu được đối soát.


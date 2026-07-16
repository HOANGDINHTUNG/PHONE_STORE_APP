---
name: optimize-observability
description: Thiết kế và tối ưu logging, audit logging, metrics, health checks, caching và performance cho backend Spring. Dùng khi thêm quan sát vận hành, điều tra latency/error, thiết kế dashboard/alert, tối ưu query/cache, cấu hình Actuator/Micrometer hoặc chuẩn bị production readiness.
---

# Optimize Observability

Đọc rules 20/30/50/60 và NFR trước khi tối ưu.

## Quy trình

1. Chuẩn hóa log theo [logging-rules.md](references/logging-rules.md).
2. Tách audit nghiệp vụ bằng [audit-logging.md](references/audit-logging.md).
3. Thiết kế RED/USE và domain metric theo [monitoring-metrics.md](references/monitoring-metrics.md).
4. Cấu hình probe theo [health-checks.md](references/health-checks.md).
5. Chỉ thêm cache theo [caching.md](references/caching.md).
6. Đo baseline và tối ưu theo [performance.md](references/performance.md).
7. Thêm test, dashboard, alert, runbook và kiểm tra không lộ dữ liệu.

## Ràng buộc

- Đo trước và sau; không tuyên bố tối ưu nếu không có số liệu.
- Không ghi PII, credential, token hoặc payment payload nhạy cảm.
- Metric label phải bounded, không dùng user/order/request ID làm label.
- Liveness không gọi database/provider.
- Cache không trở thành nguồn sự thật cho giá/tồn/order.
- Không tối ưu bằng cách bỏ authorization, validation, audit hoặc transaction safety.


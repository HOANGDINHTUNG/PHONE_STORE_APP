# Caching

## Ứng viên

Catalog public, brand/category tree, reference data và query tốn chi phí nhưng chấp nhận stale ngắn.

## Không mặc định cache

Credential/permission, available stock cam kết, payment state, idempotency result chưa ổn định và dữ liệu PII nhạy cảm.

## Quy tắc

- Xác định key namespace/version, TTL, max size và eviction.
- Tránh cache stampede bằng request coalescing/jitter nếu cần.
- Invalidate sau commit; event invalidation phải idempotent.
- Negative cache TTL ngắn và có chủ đích.
- Đo hit/miss/eviction/load latency, không label theo key.
- Có fallback khi cache down; không làm sai nguồn sự thật.
- Cache serialization có compatibility plan.


---
code: P10
name: Performance Resource Observability
mode: FIX
triggers: slow, latency, N+1, timeout, OutOfMemoryError, CPU, memory, pool exhausted, cache, performance
skills: optimize-observability, test-backend-quality
---

Ghi baseline đo được gồm workload, percentile, query count, CPU/memory/pool hoặc duration. Dùng metric, trace, profiler hay query plan phù hợp để tìm bottleneck chính. Kiểm tra N+1, index, allocation, blocking I/O, pool và cache key/invalidation. Không tăng timeout, heap, pool, retry hoặc TTL mù quáng và không bỏ security/validation/audit. Đo lại cùng workload, thêm regression guard và báo before/after.

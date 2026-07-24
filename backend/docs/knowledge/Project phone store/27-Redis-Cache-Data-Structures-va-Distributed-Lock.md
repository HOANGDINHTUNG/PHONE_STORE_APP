---
title: Redis — Cache, Data Structures và Distributed Lock
tags: [redis, cache, distributed-lock, performance]
status: verified
verified_on: 2026-07-21
sources:
  - https://redis.io/docs/latest/develop/data-types/
  - https://redis.io/docs/latest/develop/reference/eviction/
  - https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
  - https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
  - https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html
---

# Redis — Cache, Data Structures và Distributed Lock

## 1. Redis không chỉ là “database nhanh”

Xác định vai trò trước khi dùng:

- disposable cache;
- session/token metadata;
- rate limiter/counter;
- ephemeral coordination;
- stream/queue-like data;
- primary durable state.

Mỗi vai trò có persistence, consistency, eviction và recovery khác nhau. Không dùng cùng instance/policy cho cache có thể mất và lock/session quan trọng mà không phân tích.

## 2. Data structure theo access pattern

| Kiểu | Use case | Lưu ý |
|---|---|---|
| String | value, counter, token metadata | atomic `INCR`; giới hạn kích thước value |
| Hash | object fields nhỏ | field-level update; TTL thường ở key |
| Set | membership, unique IDs | operation giao/hiệu có thể tốn CPU |
| Sorted Set | leaderboard, time/score index | score là double; pagination rank khác cursor |
| List | deque đơn giản | không thay durable broker chỉ vì có push/pop |
| Stream | append log, consumer group | cần trim, pending/claim/recovery policy |
| Bitmap/HyperLogLog | compact flags/cardinality | approximate semantics phải được chấp nhận |

Key design cần namespace, tenant, entity ID và version schema rõ; không cho user input tùy ý tạo key không bounded.

## 3. Cache-aside

```text
read cache
  hit  -> return
  miss -> read source of truth -> populate TTL -> return
write DB -> invalidate/update cache after commit
```

Window stale vẫn tồn tại giữa DB commit và invalidate. Nếu invariant cần strong consistency, cache không được làm authority.

## 4. TTL là business decision

TTL dựa trên:

- freshness tối đa chấp nhận;
- write frequency;
- miss cost;
- data sensitivity/revocation;
- load khi đồng loạt expire;
- khả năng invalidation.

Thêm jitter để tránh nhiều key hết hạn cùng lúc. Negative cache chỉ dùng cho absence an toàn, TTL ngắn và phải xử lý lúc object vừa được tạo.

## 5. Cache stampede

Biện pháp:

- TTL jitter;
- single-flight/request coalescing;
- soft TTL + refresh async;
- stale-while-revalidate trong freshness budget;
- admission/concurrency limit cho rebuild;
- warm-up có kiểm soát.

Lock rebuild phải có timeout/fencing/failure policy; không để mọi request spin-wait vô hạn.

## 6. Invalidation

- invalidate sau transaction commit;
- cache key versioning khi shape thay đổi;
- event-driven invalidation cần duplicate/out-of-order handling;
- bulk update/backfill phải có kế hoạch purge;
- local L1 + Redis L2 làm invalidation khó hơn;
- cache key phải chứa tenant/authorization dimension khi response phụ thuộc chúng.

Không cache kết quả authorization theo key thiếu subject/resource/policy version.

## 7. Serialization

Không mặc định dùng Java native serialization. Dùng format explicit, versioned và allowlisted. Cache payload cần:

- schema/version;
- backward compatibility trong rolling deploy;
- max size;
- không chứa secret không cần thiết;
- compression chỉ khi benchmark chứng minh lợi ích;
- tránh deserialize polymorphic type từ dữ liệu không tin cậy.

## 8. Memory và eviction

Đặt `maxmemory` và policy theo vai trò. Nhóm policy gồm no-eviction, allkeys và volatile; thuật toán có LRU/LFU/random/TTL-oriented tùy policy cụ thể.

Không trộn key không có TTL với cache rồi chọn `volatile-*` mà giả định mọi cache key sẽ bị evict. Theo dõi:

- used/max memory;
- eviction count/rate;
- hit/miss;
- keyspace/TTL distribution;
- fragmentation;
- command latency;
- hot/big keys.

Eviction tăng đột biến thường là capacity hoặc key/TTL design problem, không chỉ “tăng RAM”.

## 9. Persistence và durability

Redis hỗ trợ RDB snapshot, AOF và kết hợp. Trade-off gồm recovery point, restart time, I/O và operational complexity. Replication không thay backup; lỗi/xóa dữ liệu có thể replicate.

Nếu Redis là source of truth:

- định nghĩa RPO/RTO;
- bật persistence phù hợp;
- test restore;
- backup ngoài failure domain;
- phân tích acknowledgement/failover mất write;
- không dùng eviction cho state bắt buộc giữ.

## 10. Replication và failover

Replication Redis thông thường là asynchronous. Replica có thể lag, nên read-after-write từ replica không mặc định strong. Failover có thể làm mất write chưa replicate tùy topology/timing.

Client cần:

- topology-aware reconnect;
- timeout bounded;
- không retry command non-idempotent mù quáng khi outcome bất định;
- metric replication lag/failover/reconnect;
- circuit/load protection khi Redis down.

## 11. Atomicity

Một command Redis chạy atomic đối với command khác; chuỗi nhiều command không tự atomic. Dùng:

- command atomic có sẵn (`SET` option, `INCR`, `HINCRBY`...);
- transaction `MULTI/EXEC` khi semantics phù hợp;
- optimistic `WATCH`;
- Lua/function cho logic server-side nhỏ, bounded.

Script dài chặn server event loop. Không chạy scan/loop không bounded trong Lua.

## 12. Distributed lock tối thiểu

Acquire một instance thường dùng token ngẫu nhiên + TTL + set-if-absent. Release phải so token rồi delete atomically; không `DEL` trực tiếp vì có thể xóa lock mới của client khác sau khi lock cũ hết TTL.

Lock không bảo đảm side effect hoàn tất trước TTL. Network pause/GC pause có thể khiến client tiếp tục làm việc sau khi lease hết hạn.

## 13. Fencing token

Với resource quan trọng, lock service cấp sequence tăng dần; downstream chỉ chấp nhận token lớn hơn token đã thấy. Fencing bảo vệ khỏi stale holder tốt hơn chỉ sở hữu token lock.

Nếu downstream không kiểm tra fencing, distributed lock không tự tạo exactly-once.

## 14. Có nên dùng Redlock?

Redis mô tả thuật toán đa-node với safety/liveness assumptions. Việc phù hợp phụ thuộc mức correctness, clock/timing, failure domain và khả năng fencing. Với stock/payment, ưu tiên invariant tại database/authority bằng constraint, atomic update, version hoặc durable workflow; lock Redis chỉ là tối ưu/cô lập bổ sung nếu failure model được chấp nhận.

## 15. Rate limiting

Thiết kế phải định nghĩa:

- key: IP/user/tenant/API key/resource;
- algorithm: fixed/sliding window, token/leaky bucket;
- limit/burst;
- atomic update + TTL;
- response headers/status;
- fail-open hay fail-closed khi Redis lỗi;
- memory cardinality và abuse.

Security endpoint thường cần policy khác public read endpoint.

## 16. Spring Cache với Redis

Spring Cache là abstraction, không thay cache design. Trước `@Cacheable`/`@CacheEvict`:

- kiểm tra proxy/self-invocation;
- key expression và tenant scope;
- transaction timing;
- null/exception caching;
- serializer;
- TTL per cache;
- stampede;
- metrics;
- behavior khi Redis down.

Không cache method trả entity lazy/proxy.

## 17. Test và failure injection

- hit/miss/invalidate;
- concurrent miss/stampede;
- TTL boundary bằng controllable clock khi logic local;
- serialization compatibility qua hai version;
- Redis restart/failover/timeout;
- eviction/cold cache load lên DB;
- lock expiry, stale owner và token-safe release;
- rate limit atomicity dưới concurrency;
- tenant/security key isolation.

## 18. Checklist production

- Vai trò cache/state/coordination được ghi rõ.
- Source of truth và freshness budget rõ.
- Key/TTL/schema/version/size bounded.
- Eviction/persistence/backup phù hợp vai trò.
- Invalidation sau commit và rolling deploy tương thích.
- Lock có token, TTL, fencing hoặc invariant authority.
- Redis outage/cold-start không đánh sập database.
- Dashboard/alert/runbook và restore/failover test.


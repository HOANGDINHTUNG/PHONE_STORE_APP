---
title: Production Troubleshooting Playbook
tags: [production, troubleshooting, incident-response, runbook]
status: maintained
verified_on: 2026-07-21
---

# Production Troubleshooting Playbook

## 1. Nguyên tắc đầu tiên

Ưu tiên giảm impact và bảo toàn bằng chứng. Không restart/xóa cache/tăng pool/kill query hàng loạt trước khi biết blast radius, trừ khi runbook khẩn cấp đã phê duyệt.

```text
Detect → Triage → Mitigate → Diagnose → Recover → Verify → Learn
```

## 2. Incident command tối thiểu

- Incident commander: quyết định và giữ bức tranh chung.
- Operations lead: thao tác kỹ thuật.
- Communications: cập nhật stakeholder/status.
- Scribe: timeline, metric, command, decision.

Với đội nhỏ một người có thể kiêm vai, nhưng vẫn tách tư duy để tránh mọi người cùng sửa không phối hợp.

## 3. Triage 5 phút đầu

- Impact: actor/feature/region/tenant nào?
- Start time và deploy/config/data event gần đó?
- Error rate, p95/p99, throughput, saturation?
- Một instance hay toàn fleet?
- Dependency/DB/broker/cache có signal gì?
- Data integrity/security risk không?
- Có rollback/feature flag/load shedding an toàn?

Ghi timestamp UTC và dashboard snapshot/query link.

## 4. Evidence trước thay đổi

- application version/commit/config version;
- request/error code/trace IDs representative;
- logs có redaction;
- metrics window trước–trong incident;
- traces critical path;
- DB process/lock/deadlock/slow query plan;
- thread dump/JFR/GC log khi JVM issue;
- broker lag/DLQ;
- recent deploy/migration/feature flag.

Không xuất credential/PII vào ticket/chat.

## 5. 5xx tăng đột ngột

1. Group theo route, exception/error code, version, instance.
2. Xác định application bug hay downstream/DB timeout.
3. So deploy/config/migration gần nhất.
4. Kiểm pool saturation, breaker, rate limit.
5. Mitigate bằng rollback/flag/canary removal nếu correlation mạnh.
6. Kiểm data side effect trước retry/replay.

Không catch rồi đổi 500 thành 200 để “hết alert”.

## 6. Latency p99 tăng

Phân rã:

- queue/admission;
- servlet/executor threads;
- connection-pool wait;
- DB query/lock;
- remote call;
- serialization/payload;
- CPU/GC/throttling;
- cache miss/stampede.

Average bình thường không bác bỏ p99 incident. Trace slow samples và so fast samples.

## 7. Database CPU/slow query

- top query fingerprint theo total time, không chỉ single slowest;
- rows examined vs returned;
- `EXPLAIN ANALYZE` ở môi trường an toàn/representative;
- plan/index/statistics/data skew;
- lock wait/long transaction;
- traffic/query volume thay đổi;
- recent schema/index migration.

Mitigation có thể rate-limit endpoint, disable expensive feature/report, kill đúng runaway query theo runbook hoặc scale read path; thêm index trực tiếp production vẫn cần DDL impact plan.

## 8. Deadlock/lock wait

- capture deadlock graph và statements;
- xác định resource/lock order;
- kiểm missing index làm scan/lock rộng;
- transaction duration/network call;
- retry count/amplification;
- hot key/batch size.

Deadlock lẻ có thể bình thường nếu retry đúng; tăng đột biến là symptom cần root cause.

## 9. Connection pool exhausted

Không tăng pool ngay. Kiểm:

- slow query/lock;
- transaction không close/connection leak;
- downstream calls trong transaction;
- pool acquisition timeout;
- traffic spike/retry storm;
- DB max connections và nhiều app instance;
- query duration distribution.

Pool lớn hơn có thể đẩy DB sập và làm p99 tệ hơn.

## 10. Memory/OOM

- heap hay container RSS/native?
- allocation/live-set/GC trend?
- cache/queue/thread count tăng?
- deploy mới?
- heap dump/JFR có an toàn không?
- instance có thể drain/restart/rollback?

Sau restart phải tiếp tục điều tra; restart chỉ reset symptom.

## 11. CPU cao

- traffic hợp lệ hay abuse/retry?
- GC CPU hay application CPU?
- JFR/profile top stack;
- crypto/compression/serialization/regex;
- loop bug;
- container throttling;
- logging volume;
- busy polling.

Scale out có thể mitigate nhưng không sửa algorithm/retry storm.

## 12. Authentication/authorization incident

- issuer/JWKS/key rotation/clock;
- wrong audience/scope mapping;
- session/cache outage;
- security config deploy;
- CORS/CSRF chỉ ảnh hưởng browser hay API toàn bộ;
- cross-tenant/data exposure?

Nếu nghi key/token compromise: kích hoạt security incident plan, rotate/revoke có kiểm soát, bảo toàn audit, đánh giá disclosure. Không dán token thật vào log/ticket.

## 13. Broker lag/DLQ

- producer rate vs consumer throughput;
- hot partition/key skew;
- poison message/retry loop;
- consumer rebalance/crash;
- downstream DB/API slow;
- outbox relay lag;
- schema incompatibility;
- retention window risk.

Redrive chỉ sau khi fix cause và bảo đảm consumer idempotent.

## 14. Cache outage/stampede

- cache dependency fail-open/closed behavior;
- DB load sau miss;
- hot keys/TTL đồng loạt;
- connection pool/retry storm;
- stale-data safety.

Mitigate bằng rate limit, load shedding, TTL jitter/single-flight, gradual warm-up. Không flush toàn bộ cache khi chưa đánh giá DB capacity.

## 15. Bad deployment

Rollback khi:

- metrics regression có correlation mạnh;
- data migration vẫn backward-compatible;
- rollback không làm consumer/schema incompatibility.

Nếu DB change không rollback được, dùng feature flag/forward fix. Ghi exact artifact/config; không “rebuild lại bản cũ” từ source khác.

## 16. Data inconsistency

1. Dừng/giới hạn writer gây lỗi.
2. Xác định invariant và affected population bằng read-only query.
3. Snapshot/backup evidence.
4. Viết reconciliation report trước repair.
5. Repair idempotent, batch, dry-run, audit và rollback/compensation.
6. Verify invariant và downstream projections.
7. Thêm constraint/test/monitor ngăn tái diễn.

Không chạy update toàn bảng trực tiếp từ phỏng đoán.

## 17. Communication cadence

Update nên có:

```text
Time UTC:
Impact:
Current hypothesis (not fact):
Mitigation/actions completed:
Current metrics:
Next action/owner:
Next update time:
```

Phân biệt fact, hypothesis và decision.

## 18. Recovery verification

- SLI/SLO trở lại trong window đủ dài;
- traffic và error không chỉ bị che bởi load giảm;
- queue/backlog được drain có kiểm soát;
- data invariant/reconciliation pass;
- no duplicate/lost side effects;
- security/audit intact;
- temporary changes có owner/expiry.

## 19. Postmortem

- summary/impact;
- timeline;
- detection và response;
- root/contributing factors;
- điều gì hoạt động/không;
- prevention, detection, mitigation actions;
- owner/deadline/priority;
- cập nhật test, dashboard, alert, runbook và vault.

Không dừng ở “human error”; hỏi vì sao system/process cho phép lỗi trở thành incident.


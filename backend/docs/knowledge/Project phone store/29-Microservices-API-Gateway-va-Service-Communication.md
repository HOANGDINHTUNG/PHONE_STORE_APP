---
title: Microservices, API Gateway và Service Communication
tags: [microservices, api-gateway, distributed-systems, service-communication]
status: verified
verified_on: 2026-07-21
sources:
  - https://docs.spring.io/spring-cloud-gateway/reference/
  - https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webflux/gatewayfilter-factories/requestratelimiter-factory.html
  - https://opentelemetry.io/docs/
---

# Microservices, API Gateway và Service Communication

## 1. Microservice là ranh giới vận hành

Một service không chỉ là package chạy riêng. Nó cần:

- ownership team;
- data ownership;
- API/event contract;
- deploy/rollback độc lập;
- SLO/on-call/runbook;
- security identity;
- capacity/failure isolation;
- compatibility policy.

Nếu luôn phải deploy nhiều service cùng lúc và join DB của nhau, hệ thống là distributed monolith.

## 2. Khi nào nên tách

Driver hợp lệ:

- domain/team ownership đủ rõ;
- scale/resource profile khác biệt lớn;
- isolation/compliance/blast radius;
- release cadence độc lập tạo giá trị;
- boundary đã ổn định trong modular monolith;
- đội ngũ có platform/observability/operations.

Không tách chỉ vì codebase lớn hoặc muốn dùng Kubernetes/Kafka.

## 3. Service boundary

Mỗi service sở hữu write model và schema. Service khác không update bảng trực tiếp. Chia sẻ read qua:

- synchronous API;
- event-derived local projection;
- analytics pipeline;
- query composition có timeout/partial semantics.

Không dùng shared entity library làm contract vì khóa release và lộ persistence model.

## 4. Sync hay async

| Tiêu chí | Synchronous | Asynchronous |
|---|---|---|
| Caller cần kết quả ngay | phù hợp | cần workflow/callback/poll |
| Coupling thời gian | cao | thấp hơn |
| Failure hiển thị | trực tiếp | delayed/duplicate/out-of-order |
| Trace/debug | dễ tuyến tính hơn | cần correlation/replay tooling |
| Backpressure | timeout/concurrency | broker lag/queue quota |

Async không xóa coupling; nó chuyển sang schema, ordering, delivery và recovery coupling.

## 5. API Gateway responsibilities

Phù hợp:

- TLS termination/routing;
- authentication/token validation ở edge và truyền identity có bảo vệ;
- coarse authorization;
- rate limiting/quota;
- request size/header policy;
- observability/correlation;
- canary/routing policy.

Không phù hợp:

- business orchestration phức tạp;
- sở hữu domain state;
- join nhiều database;
- sửa contract tùy tiện;
- trở thành single giant controller.

Spring Cloud Gateway RequestRateLimiter mặc định có thể trả 429 khi request không được phép; thuật toán/store/fail mode vẫn phải thiết kế theo hệ thống thật.

## 6. Gateway security

- Không tin identity header từ public client; gateway xóa/ghi lại header.
- Backend vẫn kiểm tra authorization theo resource/tenant.
- mTLS/workload identity hoặc signed internal token tùy threat model.
- CORS không phải service-to-service security.
- Giới hạn body/header/path và normalize URL.
- Admin/internal route không chỉ ẩn bằng tên path.

## 7. Service discovery và load balancing

Kubernetes Service/DNS, registry hoặc cloud load balancer đều có cache/TTL/readiness/failover behavior. Client phải có:

- connect/read/pool timeout;
- bounded retries;
- DNS refresh behavior đã test;
- connection draining;
- locality/cross-zone trade-off;
- per-instance health/readiness;
- metrics theo target logical và peer.

## 8. Contract governance

HTTP/gRPC/event contract cần:

- owner và consumers;
- schema machine-readable;
- additive-first evolution;
- deprecation window;
- consumer-driven/integration compatibility test;
- version negotiation khi thật sự cần;
- error/status semantics;
- size/latency limits.

Không tái sử dụng database enum nội bộ làm public enum nếu nó cần thay đổi độc lập.

## 9. Timeout, retry và deadline

Caller deadline phải bao trùm gateway + service hops. Mỗi hop không được tự đặt timeout lớn hơn deadline còn lại. Retry chỉ ở một layer có context và chỉ cho operation idempotent/transient.

Không retry đồng loạt ở gateway, SDK và service. Xem [[21-Distributed-Reliability-va-Resilience4j]].

## 10. Partial failure

Endpoint aggregate 5 service phải định nghĩa:

- thành phần bắt buộc/tùy chọn;
- max latency từng dependency;
- partial response contract;
- stale/fallback budget;
- cancellation;
- error mapping;
- cache;
- blast radius khi một dependency chậm.

Không trả list rỗng để giả vờ dependency thành công.

## 11. Data consistency

Tránh distributed transaction mặc định. Workflow dùng:

- local transaction;
- outbox;
- idempotent consumer;
- saga/process manager;
- explicit state như PENDING/UNKNOWN/COMPENSATING;
- reconciliation.

Business phải chấp nhận visibility delay và compensation semantics trước khi chuyển async.

## 12. Idempotency xuyên service

Operation ID phải đi xuyên gateway/service/message/provider. Mỗi boundary lưu outcome hoặc dedupe theo scope. Không tạo key mới ở mỗi retry nếu muốn cùng logical operation.

TTL dedupe phải dài hơn retry/replay window; critical business effect có thể cần record durable không tự hết hạn sớm.

## 13. Observability

Tối thiểu:

- trace context chuẩn qua HTTP/message;
- service, route, peer, result/error attributes;
- RED metrics per service/dependency;
- structured log với trace/correlation/operation ID;
- deployment/version metadata;
- consumer lag/retry/DLQ;
- service map chỉ là hỗ trợ, không thay SLO.

Không đưa user ID/order ID có cardinality cao vào metric label.

## 14. Deployment compatibility

Rolling deployment luôn có thời gian hai version cùng chạy. Vì vậy:

- API/event/schema backward-compatible;
- producer không gửi field mới bắt buộc trước khi consumer sẵn sàng;
- DB expand-contract;
- feature flag có owner/expiry;
- gateway route canary có rollback signal;
- không dùng in-memory session/state bắt buộc nếu instance bị thay.

## 15. Testing portfolio

- provider/consumer contract;
- gateway route/auth/header/rate limit;
- timeout/retry amplification;
- dependency slow/down/malformed;
- duplicate/out-of-order message;
- mixed-version rolling deploy;
- DNS/connection drain/failover;
- trace propagation;
- load test gateway và downstream saturation;
- chaos test có hypothesis, guardrail và rollback.

## 16. Migration từ modular monolith

1. xác nhận module boundary bằng dependency test;
2. tạo internal API và dừng cross-module table write;
3. tách data ownership/migration;
4. thêm outbox/contract/observability;
5. chạy shadow/dual-read nếu cần, không dual-write thiếu reconciliation;
6. cutover có metrics/rollback;
7. xóa đường cũ sau verification.

Strangler phải giảm coupling qua từng bước, không để hai đường tồn tại vô hạn.

## 17. Checklist trước khi tách service

- Driver và expected benefit đo được.
- Boundary/data owner/consumer rõ.
- Sync/async consistency và failure semantics rõ.
- Platform hỗ trợ deploy, secret, telemetry, on-call.
- Contract/versioning/idempotency/reconciliation có thiết kế.
- Capacity/dependency budget và cost được tính.
- Migration/rollback không làm mất dữ liệu.

## 18. Kết nối mở rộng

- CAP/consistency/consensus: [[35-Nen-tang-He-phan-tan-CAP-Clock-Consensus]].
- REST/gRPC/GraphQL/webhook/event choice: [[36-So-sanh-REST-gRPC-GraphQL-Webhooks-va-AsyncAPI]].
- Network/LB/mesh: [[41-Networking-DNS-TLS-HTTP2-va-Load-Balancing]].
- Capacity/fan-out/overload: [[40-Performance-Capacity-va-Load-Testing]].
- Progressive migration/release: [[43-Release-Engineering-GitOps-Feature-Flags-va-Canary]].

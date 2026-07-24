---
title: Kafka Deep Dive — Partition, Rebalance và Exactly-Once Scope
tags: [kafka, partitions, consumer-groups, rebalance, exactly-once]
status: verified
verified_on: 2026-07-23
sources:
  - https://kafka.apache.org/documentation/
  - https://kafka.apache.org/documentation/streams/
  - https://debezium.io/documentation/reference/stable/
---

# Kafka Deep Dive — Partition, Rebalance và Exactly-Once Scope

## 1. Kafka là replicated partitioned log

Topic chia partition; mỗi partition là ordered append-only log với offsets.

```text
topic orders
  partition 0: [0][1][2][3]...
  partition 1: [0][1][2]...
  partition 2: [0][1][2][3][4]...
```

Guarantee ordering nằm trong một partition, không phải toàn topic.

## 2. Key là quyết định correctness và scale

Chọn key theo ordering boundary:

| Event | Key gợi ý | Lý do |
|---|---|---|
| Order lifecycle | `orderId` | transition cùng order có thứ tự |
| Customer ledger | `accountId` | serialize effect theo account |
| Product projection | `productId` | version/update cùng product |
| Notification | tùy channel/user | ordering requirement khác |

Một hot key chỉ đi một partition, giới hạn parallelism. Random key scale tốt nhưng mất per-aggregate order.

## 3. Partition count

Ảnh hưởng:

- max consumer parallelism trong group;
- broker metadata/file/network;
- rebalance/recovery;
- ordering;
- future throughput.

Tăng partition có thể thay key→partition mapping nếu partitioner/modulo phụ thuộc count, làm order theo key qua thời điểm thay đổi cần được hiểu. Không giảm/đổi tùy tiện.

## 4. Replication

Mỗi partition có leader và replicas. Durability phụ thuộc:

- replication factor;
- in-sync replicas;
- producer `acks`;
- minimum in-sync replicas;
- unclean leader election policy;
- disk/broker/rack failure;
- acknowledgment timing.

Không tuyên bố “Kafka không mất message” nếu chưa nêu cấu hình và failure assumptions.

## 5. Producer idempotence

Idempotent producer giúp broker dedupe retry trong session/partition theo producer identity/sequence, giảm duplicate do retry. Nó không:

- dedupe business operation gửi lại sau app restart bằng ID mới;
- ngăn hai service phát cùng event;
- dedupe side effect consumer;
- giải quyết DB + Kafka dual-write.

Business event vẫn cần stable `eventId`/`operationId`.

## 6. Producer ordering

Retry và multiple in-flight requests có thể ảnh hưởng order tùy configuration/version. Dùng client defaults/BOM đúng version và test. Nếu strict aggregate order quan trọng:

- cùng key;
- một producer path có kiểm soát;
- idempotence;
- version trong payload;
- consumer phát hiện gap/out-of-order.

## 7. Transactional producer

Kafka transaction có thể atomically publish nhiều records/partitions và commit consumed offsets trong consume-transform-produce flow, khi dùng đúng transaction APIs/isolation.

Không bao phủ:

- MySQL update ngoài transaction Kafka;
- payment provider;
- email;
- object storage.

Đó là lý do vẫn cần outbox/inbox cho DB boundary.

## 8. Consumer group

Trong một group, mỗi partition được gán tối đa một consumer active tại một thời điểm. Nhiều group độc lập đọc cùng topic.

```text
orders topic: P0 P1 P2 P3
group inventory:
  C1 -> P0,P1
  C2 -> P2,P3
group analytics:
  A1 -> P0,P1,P2,P3
```

Scale consumer vượt partition count không tăng active parallelism.

## 9. Poll loop và processing

Consumer cần poll đủ thường xuyên; processing dài có thể làm group coi consumer không responsive/rebalance tùy config.

Phương án:

- batch nhỏ;
- pause/resume partitions;
- handoff sang bounded worker với offset/order management cẩn thận;
- tăng processing interval có căn cứ;
- tách long task thành durable job;
- không block poll thread bằng network vô hạn.

## 10. Rebalance

Rebalance xảy ra khi membership/partition/topic thay đổi. Rủi ro:

- pause;
- duplicate work;
- state/cache warm-up;
- in-flight processing;
- offset commit race.

Cooperative/incremental protocols có thể giảm disruption theo client/broker version, nhưng không loại bỏ nhu cầu idempotency.

Lifecycle cần:

- stop intake;
- finish/checkpoint/abort bounded;
- revoke handler;
- commit đúng offset;
- release resources;
- assignment handler warm state.

## 11. Offset meaning

Committed offset thường là **next record to read**, không phải record vừa đọc. Commit trước business effect có thể mất effect; commit sau effect có thể duplicate khi crash.

```text
read offset 100
apply DB
commit offset 101
```

Crash sau DB trước commit → đọc lại 100. Inbox unique event ID làm lần hai no-op.

## 12. Auto commit nguy hiểm khi hiểu sai

Auto commit không biết asynchronous worker đã hoàn tất business effect hay chưa. Chỉ dùng khi processing model bảo đảm semantics. Critical consumer nên quản offset explicit/framework container semantics đúng version và có integration crash tests.

## 13. At-most / at-least / exactly-once

| Semantics | Có thể mất | Có thể duplicate | Phù hợp |
|---|---:|---:|---|
| At-most-once | có | không/ít | telemetry có thể bỏ |
| At-least-once | ưu tiên không | có | business với idempotent consumer |
| Kafka EOS | trong scope Kafka hỗ trợ | giảm trong consume-process-produce | stream topology đúng điều kiện |
| Exactly-once business effect | phải thiết kế boundary | phải dedupe/reconcile | payment/order/inventory |

Marketing term không thay failure analysis.

## 14. Inbox pattern

```sql
CREATE TABLE consumed_events (
    consumer_name VARCHAR(100) NOT NULL,
    event_id BINARY(16) NOT NULL,
    processed_at DATETIME(6) NOT NULL,
    PRIMARY KEY (consumer_name, event_id)
);
```

Cùng transaction:

1. insert inbox;
2. apply domain update;
3. commit.

Duplicate → unique violation → verify previous outcome rồi acknowledge.

## 15. Poison message

Phân loại:

- schema/deserialization;
- invariant/business rejection;
- transient DB/network;
- code bug;
- oversized payload;
- missing reference/gap.

Không retry poison message vô hạn chặn partition. Dùng retry topic/DLQ/quarantine với:

- original topic/partition/offset/key;
- event ID/schema/version;
- error class;
- attempt/first-last failure;
- trace;
- owner/redrive audit.

## 16. Retry và ordering

Đưa record lỗi sang retry topic có thể cho record sau vượt trước. Nếu order quan trọng:

- block partition có giới hạn;
- retry inline với bounded attempts;
- state machine/version reject future;
- parking lot cả key/partition;
- compensate/reconcile.

Không có retry strategy vừa giữ strict order, không block và unlimited availability miễn phí.

## 17. Retention và compaction

- Time/size retention giữ log trong window.
- Log compaction giữ latest value theo key theo semantics riêng và tombstone/delete retention.

Compacted topic phù hợp changelog/state bootstrap, không phải backup vĩnh viễn tự động. Key stability, tombstone và consumer offline duration phải được thiết kế.

## 18. Schema registry/evolution

Contract:

- subject/naming;
- compatibility mode;
- default/optional;
- enum evolution;
- unknown field;
- consumer upgrade order;
- PII classification;
- retention/replay.

Không đổi meaning trong cùng field chỉ vì wire type vẫn compatible.

## 19. Large message

Large payload làm tăng network, memory, replication, consumer pause và blast radius. Pattern:

- event chứa metadata + object reference;
- object immutable/checksum/TTL đủ dài;
- consumer authorization/access;
- lifecycle/replay;
- không để URL bearer lâu trong event.

## 20. Consumer lag

Lag = latest offset − consumed/committed offset, nhưng phải xem:

- message rate/bytes/cost;
- oldest event age;
- processing time;
- partition skew;
- rebalance;
- retry/DLQ;
- downstream saturation.

Lag 10.000 event có thể 1 giây hoặc 10 giờ.

## 21. Capacity model

```text
required consumers ≈ arrival_rate × avg_processing_time / target_utilization
```

Ví dụ 1.000 event/s, 20 ms/event:

```text
concurrency trung bình = 1000 × 0.020 = 20
at 70% target => khoảng 29 worker slots
```

Partition count, DB pool và downstream quota vẫn giới hạn.

## 22. Spring consumer skeleton

Pseudo-code; annotation/API/property phải kiểm tra Spring Kafka version:

```java
@Transactional
public void handle(OrderPlaced event) {
    if (!inbox.tryStart("inventory", event.eventId())) {
        return;
    }
    inventory.reserve(event.orderId(), event.items());
    outbox.append(StockReserved.from(event));
}
```

DB transaction bảo vệ inbox + inventory + outbox. Kafka offset commit/ack do container quản theo configured transaction/ack mode đã integration-test.

## 23. Deployment

- consumer graceful shutdown;
- static/cooperative membership nếu phù hợp;
- max unavailable thấp cho group nhỏ;
- readiness phản ánh khả năng poll/process;
- scale theo lag/age với stabilization;
- deployment mới xử lý schema cũ;
- canary consumer không cạnh tranh/duplicate sai group.

## 24. Observability

- produce latency/error/retry;
- broker/partition ISR health;
- consumer lag + oldest age;
- poll/process duration;
- rebalance count/duration;
- duplicate/inbox hit;
- retry/DLQ depth;
- throughput bytes/messages;
- partition skew;
- transaction abort;
- outbox→published end-to-end delay.

## 25. Failure tests

- broker unavailable;
- ack/response loss;
- consumer crash trước/sau DB commit;
- rebalance giữa processing;
- schema incompatible;
- poison record;
- hot partition;
- lag catch-up;
- out-of-order retry;
- replay từ đầu;
- DLQ redrive duplicate;
- deploy mixed versions.

## 26. Liên kết tư duy

| Quan hệ | Ghi chú |
|---|---|
| Nhập môn | [[18-Event-Driven-Outbox-va-Kafka]] |
| Lý thuyết | [[35-Nen-tang-He-phan-tan-CAP-Clock-Consensus]] |
| DB atomicity | [[07-JPA-Hibernate-va-Transaction]], [[17-Concurrency-Isolation-va-Idempotency-Nang-cao]] |
| Schema/API | [[36-So-sanh-REST-gRPC-GraphQL-Webhooks-va-AsyncAPI]] |
| Projection | [[38-Search-Architecture-Elasticsearch-va-Projection]] |
| Capacity/ops | [[40-Performance-Capacity-va-Load-Testing]], [[34-OpenTelemetry-Micrometer-va-Observability-Implementation]] |
| Case study | [[45-Case-Study-Phone-Store-at-Scale]] |


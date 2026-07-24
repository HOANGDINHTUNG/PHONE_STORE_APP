---
title: Lựa chọn Message Broker và Queue — Kafka, RabbitMQ, SQS
tags: [messaging, kafka, rabbitmq, queue, event-streaming]
status: verified
verified_on: 2026-07-23
requires: [18-Event-Driven-Outbox-va-Kafka, 39-Kafka-Deep-Dive-Partition-Rebalance-EOS]
constrains: [47-Saga-Workflow-Orchestration-va-Choreography]
verified_by: [22-Test-Engineering-Nang-cao, 40-Performance-Capacity-va-Load-Testing]
---

# Lựa chọn Message Broker và Queue — Kafka, RabbitMQ, SQS

> [!summary]
> Chọn broker theo delivery topology, replay, ordering scope, routing, retention, throughput và ownership. Kafka log, RabbitMQ brokered queue và managed queue giải các lực khác nhau; không có “broker tốt nhất”.

## 1. Trước khi chọn sản phẩm

Viết contract:

```text
interaction: command | event | work item
delivery: at-most-once | at-least-once
ordering scope: none | per aggregate | global
retention/replay: 0 | 7 days | years
fan-out: one worker | N independent consumers
routing: key | topic | header/pattern
latency/throughput/message size
backpressure/DLQ/retry
RPO/RTO/security/data residency
```

## 2. So sánh

| Lực | Kafka-style log | RabbitMQ-style queue | Managed queue (SQS-like) |
|---|---|---|---|
| Replay/retention | lõi | không phải lõi queue | hạn chế theo retention |
| Consumer groups | mạnh | competing consumers | mạnh |
| Routing linh hoạt | topic/key | exchange/binding mạnh | queue/topic service |
| Per-key ordering | partition | queue/single-active tùy cấu hình | FIFO option riêng |
| Ops | cluster/storage tuning | broker/queue topology | ít ops, cloud coupling |
| Long backlog | thiết kế cho log | phải capacity cẩn thận | service quota/cost |
| Request task queue | dùng được nhưng có tax | phù hợp | phù hợp |
| Event history/rebuild | phù hợp | yếu hơn | thường không |

## 3. Queue, stream, pub/sub

- **Work queue:** một work item do một worker logic xử lý.
- **Pub/sub:** mỗi subscription nhận bản riêng.
- **Stream log:** record giữ theo retention; consumer giữ vị trí đọc.

Một `OrderPlaced` có search, analytics, email độc lập → pub/sub/stream. Một `GenerateInvoicePdf` cần một worker pool → work queue.

## 4. Ordering

Global ordering làm mất parallelism và khó scale. Thường chỉ cần per aggregate:

```text
key=orderId
order.placed v1
payment.authorized v2
order.confirmed v3
```

Vẫn cần sequence/version vì retry, merge topics hoặc producer khác có thể gây stale event.

## 5. Delivery semantics

At-least-once:

```text
receive → business commit → crash → ack/offset chưa commit → redelivery
```

Consumer phải idempotent. Broker “exactly once” không tự làm email/payment/database external side effect exactly once. Xem [[39-Kafka-Deep-Dive-Partition-Rebalance-EOS]].

## 6. Retry topology

| Error | Cách xử lý |
|---|---|
| validation/permanent | quarantine/DLQ ngay |
| transient dependency | delayed bounded retry |
| overload | backpressure/rate control |
| unknown provider outcome | reconcile, không blind retry |
| code bug | stop/quarantine + deploy fix/replay |

Không immediate retry 10.000 message vào dependency đang chết.

Envelope:

```json
{
  "messageId": "msg_01K...",
  "type": "invoice.generate",
  "schemaVersion": 2,
  "correlationId": "ord_9",
  "causationId": "evt_7",
  "occurredAt": "2026-07-23T10:00:00Z",
  "attempt": 1,
  "payload": {"orderId":"ord_9"}
}
```

Attempt/deadline do retry system kiểm soát; không tin client.

## 7. RabbitMQ-specific questions

- durable/quorum queue hay transient?
- queue có bounded length/TTL?
- publisher confirms?
- manual acknowledgement ở đâu?
- prefetch phù hợp processing time/memory?
- exchange/binding ownership?
- poison message/DLX cycle?
- queue declaration compatibility khi deploy?

Exclusive/auto-delete queue phù hợp connection-scoped state; tránh static name gây race recovery.

## 8. Kafka-specific questions

- partition key/skew;
- partition count và ordering;
- replication/min ISR/acks;
- idempotent/transactional producer scope;
- consumer group/rebalance;
- offset commit gắn business transaction;
- retention/compaction;
- schema compatibility;
- lag theo time, không chỉ offset count.

## 9. Managed queue questions

- visibility timeout lớn hơn processing p99 chưa?
- message có thể xuất hiện lại sau visibility?
- FIFO throughput/dedup window có phù hợp?
- max retention/size/batch/quota?
- DLQ redrive policy?
- KMS/tenant/residency/cross-account auth?
- cost theo request/bytes/retry?

## 10. Spring abstraction

Không tạo “universal messaging interface” xóa mất semantics. Có thể chuẩn hóa:

- envelope/correlation;
- serializer/schema registry;
- tracing;
- retry classification;
- inbox/outbox;
- metrics.

Nhưng partition, acknowledgement, transaction và topology phải lộ rõ ở adapter/config.

## 11. Capacity

```text
arrival rate λ
processing rate per worker μ
workers c
utilization ρ = λ / (c × μ)
```

Chạy sát 100% thì backlog không hồi phục sau spike. Tính thêm:

- average/max message bytes;
- retention × ingress × replication;
- retry amplification;
- N−1 broker/consumer capacity;
- recovery drain time.

## 12. Failure drills

- broker unavailable khi producer commit DB;
- ack/offset lost sau business commit;
- consumer crash giữa batch;
- poison message chặn partition/queue;
- hot key;
- disk full/retention pressure;
- network partition;
- credential/certificate rotation;
- schema incompatibility;
- restore/rebuild consumer từ earliest.

## 13. Observability

| Signal | Ý nghĩa |
|---|---|
| publish failure/confirm latency | producer/broker health |
| oldest message age | user impact tốt hơn count |
| consumer processing p95/p99 | capacity/dependency |
| redelivery/retry rate | unstable processing |
| DLQ ingress/age | unresolved poison |
| partition skew | bad key |
| rebalance/consumer churn | group instability |

## 14. Anti-patterns

- dùng broker thay database transaction;
- publish sau commit không outbox;
- deserialize rồi ack trước business commit;
- DLQ không owner/runbook;
- retry vô hạn;
- message chứa secret/full PII;
- một mega-topic cho mọi event;
- request-response đồng bộ giả dạng async nhưng không deadline/correlation.

## 15. Kết nối graph

- Outbox/inbox: [[18-Event-Driven-Outbox-va-Kafka]]
- Kafka internals: [[39-Kafka-Deep-Dive-Partition-Rebalance-EOS]]
- Workflow: [[47-Saga-Workflow-Orchestration-va-Choreography]]
- Capacity: [[40-Performance-Capacity-va-Load-Testing]]
- Incident: [[55-Incident-Management-OnCall-va-Chaos-Engineering]]

## Nguồn chính thức

1. [RabbitMQ Documentation — Queues](https://www.rabbitmq.com/docs/queues) — truy cập 2026-07-23.
2. [Apache Kafka Documentation](https://kafka.apache.org/documentation/) — truy cập 2026-07-23.
3. [Amazon SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html) — truy cập 2026-07-23.
4. [Spring for Apache Kafka Reference](https://docs.spring.io/spring-kafka/reference/) — truy cập 2026-07-23.


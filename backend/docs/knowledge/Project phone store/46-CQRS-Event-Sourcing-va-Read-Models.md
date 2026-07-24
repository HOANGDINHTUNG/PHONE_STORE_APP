---
title: CQRS, Event Sourcing và Read Models
tags: [cqrs, event-sourcing, projection, architecture, spring-boot]
status: verified
verified_on: 2026-07-23
applies_to: [Java 21, Spring Boot 4.1, Spring Boot 3.5]
requires: [14-DDD-va-Modular-Monolith-Nang-cao, 18-Event-Driven-Outbox-va-Kafka]
constrains: [37-Data-Modeling-Multi-Tenancy-Temporal-va-Audit, 52-Privacy-Data-Governance-Retention-va-Erasure]
verified_by: [22-Test-Engineering-Nang-cao, 40-Performance-Capacity-va-Load-Testing]
---

# CQRS, Event Sourcing và Read Models

> [!summary]
> CQRS chỉ tách mô hình/đường đi của command và query; nó **không bắt buộc** hai database và không đồng nghĩa Event Sourcing. Event Sourcing chọn chuỗi event bất biến làm nguồn sự thật. Đây là hai quyết định độc lập, có thể kết hợp nhưng chi phí tăng mạnh.

## 1. Tách bốn khái niệm thường bị nhập nhằng

| Khái niệm | Nguồn sự thật | Mục tiêu | Có eventual consistency? |
|---|---|---|---|
| CRUD | row/document hiện tại | đơn giản | không bắt buộc |
| CQRS logic | state hiện tại | tách command/query code model | không bắt buộc |
| CQRS physical | write store + read store | tối ưu/scaling độc lập | thường có |
| Event Sourcing | ordered event stream | lịch sử, replay, temporal intent | projection thường có |

`OrderPlaced` trong outbox không làm hệ thống thành Event Sourcing. Nếu bảng `orders` vẫn là nguồn sự thật và event chỉ để tích hợp, đó là **state storage + integration events**.

## 2. Decision ladder

1. CRUD + query service riêng nếu domain/query đơn giản.
2. CQRS logic trong cùng process/database khi command model và query model khác nhau.
3. Materialized read model nếu joins/query cost hoặc ownership làm read path khó.
4. Event Sourcing chỉ cho aggregate có lợi ích lịch sử/replay/audit vượt chi phí.

| Tín hiệu | CRUD/CQRS nhẹ | CQRS + projection | Event Sourcing |
|---|---|---|---|
| Admin CRUD | ưu tiên | hiếm | tránh |
| Product search | source CRUD | rất phù hợp | thường không |
| Payment ledger | có thể | phù hợp | cân nhắc mạnh |
| Order state/history | phù hợp | phù hợp | chỉ khi lịch sử là lõi |
| Cần “time travel” chính xác | audit table | có giới hạn | phù hợp |
| Team chưa vận hành event | ưu tiên | học dần | tránh |

## 3. Command model

Command diễn đạt ý định: `ReserveStock`, không phải `SetAvailable(7)`.

```java
public record ReserveStock(
        UUID inventoryId,
        UUID orderId,
        int quantity,
        long expectedVersion) {}

@Transactional
public ReservationId handle(ReserveStock cmd) {
    Inventory inventory = repository.load(cmd.inventoryId());
    inventory.reserve(cmd.orderId(), cmd.quantity());
    repository.save(inventory, cmd.expectedVersion());
    return inventory.lastReservationId();
}
```

Command handler phải:

- authenticate/authorize trước mutation;
- validate syntax rồi invariant trong aggregate;
- có idempotency boundary;
- dùng optimistic concurrency;
- chỉ commit local state và durable publication cùng atomic boundary.

## 4. Event stream schema tối thiểu

```sql
CREATE TABLE event_stream (
    stream_id BINARY(16) NOT NULL,
    stream_version BIGINT NOT NULL,
    event_id BINARY(16) NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    event_schema_version INT NOT NULL,
    occurred_at DATETIME(6) NOT NULL,
    actor_id BINARY(16) NULL,
    correlation_id VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    metadata JSON NOT NULL,
    PRIMARY KEY (stream_id, stream_version),
    UNIQUE KEY uk_event_id (event_id)
);
```

Append với `expectedVersion`; duplicate `(stream_id, stream_version)` nghĩa là conflict, phải reload và đánh giá lại command. Không “retry blind” event đã tính trên state cũ.

## 5. Aggregate rehydration

```java
public final class Inventory {
    private int available;
    private long version;
    private final List<DomainEvent> pending = new ArrayList<>();

    static Inventory rehydrate(List<DomainEvent> history) {
        Inventory inventory = new Inventory();
        history.forEach(inventory::apply);
        inventory.pending.clear();
        return inventory;
    }

    void reserve(UUID orderId, int qty) {
        if (qty <= 0 || available < qty) throw new OutOfStock();
        raise(new StockReserved(orderId, qty));
    }

    private void raise(DomainEvent event) {
        apply(event);
        pending.add(event);
    }

    private void apply(DomainEvent event) {
        switch (event) {
            case StockReceived e -> available += e.quantity();
            case StockReserved e -> available -= e.quantity();
            case StockReleased e -> available += e.quantity();
            default -> throw new UnsupportedEvent(event.getClass());
        }
        version++;
    }
}
```

`apply` không gọi network, clock ngẫu nhiên hay repository; replay phải deterministic.

## 6. Snapshot

Snapshot là cache của stream, không phải nguồn sự thật:

```text
load snapshot(version=900)
load events 901..latest
apply
```

Tạo khi measured replay cost vượt budget, không theo “cứ 100 events” một cách mê tín. Snapshot phải có schema version và kiểm thử rebuild không cần snapshot.

## 7. Read model

```sql
CREATE TABLE order_summary_projection (
    order_id BINARY(16) PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,
    status VARCHAR(32) NOT NULL,
    total DECIMAL(19,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    aggregate_version BIGINT NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    INDEX idx_customer_orders (customer_id, updated_at DESC, order_id)
);
```

Consumer idempotent và chống event lùi:

```sql
UPDATE order_summary_projection
SET status = :status,
    total = :total,
    aggregate_version = :version,
    updated_at = :occurredAt
WHERE order_id = :orderId
  AND aggregate_version < :version;
```

Event thiếu row cần `INSERT ... ON DUPLICATE KEY UPDATE` với điều kiện version tương đương trong code/SQL được test trên MySQL thật.

## 8. Read-your-writes

Sau command thành công, projection có thể chưa kịp:

- trả representation tối thiểu từ command result;
- trả `aggregateVersion` và client poll đến `projectionVersion >= version`;
- route tạm thời tới authoritative model;
- UI hiển thị trạng thái “đang cập nhật”.

Không che lag bằng sleep cố định.

## 9. Event evolution

| Thay đổi | Cách ưu tiên |
|---|---|
| thêm optional field | tolerant reader + default |
| đổi nghĩa field | event version mới |
| format cũ còn tồn tại | upcaster khi đọc |
| bug tạo historical event sai | compensating event/correction policy |
| rebuild projection | version projection + shadow build + switch |

Persisted event là hợp đồng lâu dài. Integration event nên tách khỏi domain event nội bộ để không xuất toàn bộ model/PII.

## 10. Privacy tension

Event bất biến xung đột với yêu cầu xóa dữ liệu:

- không đặt PII không cần thiết vào event;
- tham chiếu `subjectId`, lưu PII ở store có lifecycle riêng;
- cân nhắc per-subject encryption/crypto-shredding;
- ghi rõ backup, replica, search, analytics cũng phải erasure;
- có legal/privacy review, không tự tuyên bố “crypto-shredding luôn đủ luật”.

Liên quan [[52-Privacy-Data-Governance-Retention-va-Erasure]].

## 11. Failure matrix

| Failure | Hậu quả | Control |
|---|---|---|
| concurrent append | hai command trên state cũ | expected version |
| duplicate delivery | projection/side effect lặp | inbox/event ID |
| out-of-order | read model lùi | aggregate sequence |
| poison event | projection dừng | quarantine + alert + repair |
| projection bug | state đọc sai | rebuild từ checkpoint |
| event schema cũ | deserialization fail | version/upcaster |
| long stream | latency command tăng | measured snapshot |
| replay gọi external API | side effect lặp | pure apply |

## 12. Verification portfolio

```text
Given: StockReceived(10), StockReserved(3)
When:  ReserveStock(8)
Then:  OutOfStock; no new event
```

Phải thêm:

- two writers cùng expected version → đúng một append;
- duplicate event → projection không đổi lần hai;
- random prefix replay → invariant giữ;
- rebuild read model từ stream đầu đến cuối;
- upcast mọi fixture event version cũ;
- crash giữa checkpoint/update;
- compare rebuilt projection với production shadow;
- benchmark p95 rehydrate theo stream length.

## 13. Anti-patterns

- dùng Kafka topic làm event store mặc định;
- event là “row changed” không chứa business intent;
- sửa/xóa event lịch sử âm thầm;
- shared DTO giữa command/event/read model;
- projection consumer vừa update read model vừa charge tiền không idempotent;
- áp dụng Event Sourcing cho toàn hệ thống vì một aggregate cần audit;
- gọi CQRS khi chỉ đổi tên `Service` thành `CommandHandler`.

## 14. Kết nối graph

- Aggregate boundary: [[14-DDD-va-Modular-Monolith-Nang-cao]]
- Durable publication: [[18-Event-Driven-Outbox-va-Kafka]]
- Kafka distribution, không mặc định là event store: [[39-Kafka-Deep-Dive-Partition-Rebalance-EOS]]
- Projection/search: [[38-Search-Architecture-Elasticsearch-va-Projection]]
- Concurrency/idempotency: [[17-Concurrency-Isolation-va-Idempotency-Nang-cao]]
- Testing: [[22-Test-Engineering-Nang-cao]]

## Nguồn chính thức

1. [Microsoft Azure Architecture Center — CQRS pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs) — truy cập 2026-07-23.
2. [Microsoft Azure Architecture Center — Event Sourcing pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) — truy cập 2026-07-23.
3. [Spring Data — Domain Events](https://docs.spring.io/spring-data/commons/reference/repositories/core-domain-events.html) — truy cập 2026-07-23.


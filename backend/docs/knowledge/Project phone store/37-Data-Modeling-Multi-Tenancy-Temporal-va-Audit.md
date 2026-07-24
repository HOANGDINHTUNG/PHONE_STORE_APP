---
title: Data Modeling, Multi-Tenancy, Temporal Data và Audit
tags: [data-modeling, multi-tenancy, temporal, audit, mysql]
status: verified
verified_on: 2026-07-23
applies_to: [MySQL 8.4]
sources:
  - https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html
  - https://dev.mysql.com/doc/refman/8.4/en/create-table-check-constraints.html
  - https://dev.mysql.com/doc/refman/8.4/en/json.html
  - https://dev.mysql.com/doc/refman/8.4/en/create-table-secondary-indexes.html
---

# Data Modeling, Multi-Tenancy, Temporal Data và Audit

## 1. Model dữ liệu bắt đầu từ invariant và query

Trước schema:

```markdown
Entity/aggregate:
Identity:
Lifecycle/state:
Invariant trong một row:
Invariant qua nhiều row:
Ownership/tenant:
Retention/privacy:
Write patterns:
Read patterns:
Concurrency:
History/audit:
```

Không bắt đầu từ “mỗi class là một table”.

## 2. Normalization bằng ví dụ

Sai:

```text
orders(
  order_id,
  customer_name,
  customer_phone,
  product1_name, product1_qty,
  product2_name, product2_qty,
  total
)
```

Vấn đề:

- số item bị giới hạn;
- update anomaly;
- khó constraint/index;
- lặp dữ liệu;
- không biểu diễn line identity.

Tách:

```sql
CREATE TABLE orders (
    id BINARY(16) PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,
    status VARCHAR(32) NOT NULL,
    total_amount DECIMAL(19,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    created_at DATETIME(6) NOT NULL
);

CREATE TABLE order_items (
    id BINARY(16) PRIMARY KEY,
    order_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    sku_snapshot VARCHAR(64) NOT NULL,
    name_snapshot VARCHAR(255) NOT NULL,
    unit_price DECIMAL(19,2) NOT NULL,
    quantity INT NOT NULL,
    line_total DECIMAL(19,2) NOT NULL,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT chk_item_qty CHECK (quantity > 0)
);
```

## 3. Denormalization có chủ đích

`name_snapshot` và `unit_price` lặp product hiện tại nhưng đúng vì order cần lịch sử tại thời điểm mua.

| Denormalization | Hợp lệ khi | Cơ chế giữ đúng |
|---|---|---|
| Order line snapshot | history immutable | ghi một lần trong transaction |
| Product search document | query/search riêng | CDC/outbox + rebuild |
| Aggregate counter | read cực nóng | atomic update + reconcile |
| Cached view | stale được phép | TTL/invalidation/version |

Không denormalize nếu không nêu:

- source of truth;
- freshness;
- update/rebuild;
- mismatch detection;
- storage/retention.

## 4. Database constraint là hàng rào cuối

Đặt DB constraint cho invariant biểu diễn được:

- `NOT NULL`;
- `UNIQUE`;
- `FOREIGN KEY`;
- `CHECK`;
- precision/type;
- atomic conditional update.

Service validation cho error đẹp; constraint bảo vệ mọi code path/job/script.

Ví dụ tenant-safe uniqueness:

```sql
UNIQUE KEY uk_tenant_sku (tenant_id, sku)
```

Không dùng `UNIQUE(sku)` nếu SKU chỉ unique trong tenant.

## 5. ID strategy

| ID | Ưu | Nhược |
|---|---|---|
| Auto increment | nhỏ, locality tốt | coordination/export/shard, lộ volume |
| Random UUID | tạo phân tán | index locality/size |
| Time-ordered UUID/ULID-like | phân tán + locality tương đối | clock/standard/implementation |
| Business key | có meaning | thay đổi, PII, dài |

Business key thường nên có unique constraint riêng; primary key kỹ thuật giữ ổn định.

## 6. Multi-tenancy models

| Model | Isolation | Cost vận hành | Scale/customization |
|---|---|---|---|
| Shared tables + `tenant_id` | thấp hơn, cần guard mọi query | thấp | tốt cho nhiều tenant nhỏ |
| Schema per tenant | trung bình | migration/connection phức tạp | tùy DB/tool |
| Database per tenant | cao | backup/migration/fleet cost cao | tốt cho tenant lớn/regulatory |
| Hybrid | theo tier | routing/control plane phức tạp | linh hoạt |

Chọn theo:

- regulatory/isolation;
- tenant count/size skew;
- noisy neighbor;
- restore một tenant;
- customization;
- cost;
- migration;
- analytics.

## 7. Shared-table tenant invariant

Mỗi owned row có `tenant_id NOT NULL`. Foreign key nên ngăn cross-tenant reference:

```sql
CREATE TABLE projects (
    tenant_id BINARY(16) NOT NULL,
    id BINARY(16) NOT NULL,
    name VARCHAR(200) NOT NULL,
    PRIMARY KEY (tenant_id, id)
);

CREATE TABLE tasks (
    tenant_id BINARY(16) NOT NULL,
    id BINARY(16) NOT NULL,
    project_id BINARY(16) NOT NULL,
    PRIMARY KEY (tenant_id, id),
    CONSTRAINT fk_task_project
      FOREIGN KEY (tenant_id, project_id)
      REFERENCES projects(tenant_id, id)
);
```

Chỉ filter ở controller là không đủ.

## 8. Tenant context

Tenant được resolve từ trusted identity/domain mapping, không lấy tùy ý từ header client rồi tin.

Flow:

```text
authenticate -> resolve memberships -> select tenant
-> authorize capability/resource -> set scoped context
-> repository requires tenant key -> audit
```

Async/event/job phải mang tenant context explicit; ThreadLocal có thể mất/leak. Liên quan [[25-Java-Concurrency-va-Collections-Nang-cao]].

## 9. Tenant-safe repository

Không có:

```java
Optional<Order> findById(UUID id);
```

Ưu tiên:

```java
Optional<Order> findByTenantIdAndId(UUID tenantId, UUID id);
```

Hoặc repository được bind vào `TenantScope` đã xác minh. Test bắt buộc cross-tenant ID enumeration.

## 10. Index trong shared tenancy

Candidate thường bắt đầu bằng tenant:

```sql
(tenant_id, status, created_at, id)
```

Nhưng tenant có cardinality/skew khác nhau; phải EXPLAIN bằng tenant lớn và nhỏ. Index bắt đầu `tenant_id` không tự tối ưu mọi query global admin/reporting.

## 11. Noisy neighbor

Guardrail:

- per-tenant quota/rate/concurrency;
- query/page/export limit;
- fair scheduling;
- storage quota;
- heavy tenant isolation;
- metric/log theo tenant nhưng tránh label cardinality lớn;
- billing/usage ledger;
- support override có audit.

## 12. Temporal concepts

Phân biệt:

- **Event time:** lúc business event xảy ra.
- **Processing time:** lúc hệ thống xử lý.
- **Valid time:** dữ liệu đúng trong thế giới nghiệp vụ từ–đến.
- **Transaction/system time:** database biết version từ–đến.

Hai chiều valid/system time tạo bitemporal model, hữu ích khi cần hỏi “chúng ta đã tin điều gì vào ngày X về hiệu lực ngày Y”.

## 13. Effective-dated table

Ví dụ giá:

```sql
CREATE TABLE product_prices (
    product_variant_id BINARY(16) NOT NULL,
    valid_from DATETIME(6) NOT NULL,
    valid_to DATETIME(6) NULL,
    amount DECIMAL(19,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    PRIMARY KEY (product_variant_id, valid_from)
);
```

Invariant không overlap interval khó bảo đảm chỉ bằng constraint MySQL thông thường; cần transaction lock/authority và concurrency test.

Query:

```sql
SELECT amount, currency
FROM product_prices
WHERE product_variant_id = :id
  AND valid_from <= :at
  AND (valid_to IS NULL OR valid_to > :at)
ORDER BY valid_from DESC
LIMIT 1;
```

## 14. State history

Current row + append-only history:

```sql
UPDATE orders
SET status = :next, version = version + 1
WHERE id = :id AND status = :expected;

INSERT INTO order_status_history
    (order_id, from_status, to_status, actor_id, reason, occurred_at, operation_id)
VALUES (...);
```

Hai statement phải cùng transaction. Unique operation ID chống duplicate transition.

## 15. Audit log khác domain history

| Loại | Mục tiêu |
|---|---|
| Domain history | tái hiện lifecycle/nghiệp vụ |
| Security audit | ai truy cập/thay đổi gì |
| Application log | chẩn đoán runtime |
| CDC log | truyền change kỹ thuật |
| Event store | source of truth theo event sourcing |

Không dùng application log thay audit: retention, integrity, access và schema khác.

## 16. Audit record

```json
{
  "event": "inventory.adjusted",
  "actor": {"type":"staff","id":"u_42"},
  "tenantId": "t_9",
  "resource": {"type":"sku","id":"sku_1"},
  "operationId": "op_...",
  "reason": "cycle-count",
  "before": {"available": 20},
  "after": {"available": 18},
  "occurredAt": "2026-07-23T10:00:00Z"
}
```

Redact secret/PII; audit access cũng phải audit. Với integrity cao, dùng append-only control, restricted writer, hash/sign/immutable storage theo threat model.

## 17. Soft delete

| Phương án | Ưu | Nhược |
|---|---|---|
| Hard delete | đơn giản, privacy/storage | mất restore/history |
| `deleted_at` | restore/query | mọi unique/query phải hiểu deleted |
| Move archive | hot table gọn | dual storage/migration |
| Tombstone event | projection sync | cần source state/retention |

Soft delete không thực hiện quyền xóa dữ liệu nếu bytes vẫn ở backup/search/cache/object storage.

Unique với soft delete cần thiết kế cẩn thận; đừng giả định partial unique index tồn tại như DB khác.

## 18. JSON column

Phù hợp:

- optional sparse attributes;
- provider payload lưu nguyên để audit;
- schema mở nhưng được validate ở app;
- field không tham gia nhiều invariant/join.

Không phù hợp:

- mọi domain field;
- foreign key trong JSON;
- query/filter nóng không có index strategy;
- payload không version/size limit.

MySQL hỗ trợ JSON và có thể index expression/generated column theo đúng khả năng/version; vẫn cần EXPLAIN.

## 19. Money và measurement

- `DECIMAL`, không `double`;
- amount + ISO currency;
- rounding policy explicit;
- lưu unit;
- snapshot exchange rate/source/time;
- không cộng tiền khác currency;
- reconcile với provider/ledger.

```java
record Money(BigDecimal amount, Currency currency) {
    Money add(Money other) {
        if (!currency.equals(other.currency())) throw new CurrencyMismatch();
        return new Money(amount.add(other.amount), currency);
    }
}
```

## 20. Encryption và searchable data

- encryption at rest không thay authorization;
- field-level encryption ảnh hưởng index/search/rotation;
- deterministic encryption rò equality pattern;
- key ID/version đi cùng ciphertext;
- key material ngoài database;
- backup/restore phải còn key;
- tokenization khi cần giảm data exposure.

Không tự thiết kế crypto.

## 21. Migration và compatibility

Schema/model mới phải đi qua:

1. expand;
2. code dual-compatible;
3. backfill bounded;
4. verify;
5. switch;
6. stop old writes;
7. contract.

Temporal/audit/tenant backfill cần operation ID, progress, retry và reconciliation. Xem [[31-Background-Jobs-Scheduling-va-Spring-Batch]].

## 22. Tests

- DB constraints bằng MySQL thật;
- cross-tenant read/write/reference;
- concurrent effective-date insert;
- state transition + history atomicity;
- soft-delete uniqueness;
- JSON schema/version;
- restore/delete propagation;
- large tenant query plans;
- audit redaction/integrity/access;
- migration from previous version.

## 23. Liên kết tư duy

| Quan hệ | Ghi chú |
|---|---|
| Nền tảng SQL | [[06-Database-va-toi-uu-SQL-MySQL]], [[16-MySQL-Optimizer-va-Index-Nang-cao]] |
| Transaction/race | [[07-JPA-Hibernate-va-Transaction]], [[17-Concurrency-Isolation-va-Idempotency-Nang-cao]] |
| Domain ownership | [[14-DDD-va-Modular-Monolith-Nang-cao]], [[29-Microservices-API-Gateway-va-Service-Communication]] |
| Projection/search | [[18-Event-Driven-Outbox-va-Kafka]], [[38-Search-Architecture-Elasticsearch-va-Projection]] |
| Security/privacy | [[08-Spring-Security-va-API-Security]], [[42-Threat-Modeling-va-Software-Supply-Chain-Security]] |
| Case study | [[45-Case-Study-Phone-Store-at-Scale]] |


# Audit logging

Audit event tối thiểu:

- Event ID, event type và schema version.
- Actor type/ID hoặc service identity.
- Action, target type/ID.
- Result: success/denied/failed.
- Timestamp UTC, correlation ID, source an toàn.
- Reason cho stock adjustment, cancellation, refund, role change.
- Before/after chỉ với field allowlist và redaction.

Audit cần append-only, retention, access control và chống sửa phù hợp. Không dùng application log thay audit. Hành động phải audit: login security event, role/permission, catalog/price publish, stock adjustment, order transition quản trị, refund và secret/config nhạy cảm.


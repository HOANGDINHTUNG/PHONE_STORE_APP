# Runbooks

Runbook hướng dẫn xử lý tác vụ vận hành/sự cố lặp lại an toàn.

## Runbook cần có

- Deploy/rollback.
- Migration failure.
- Database connectivity/pool exhaustion.
- Payment callback/reconciliation.
- Stuck order/reservation.
- Provider outage.
- Secret rotation.
- Security incident escalation.

Mỗi runbook ghi trigger, precondition/authority, diagnosis read-only, action có blast radius, verification, rollback và escalation. Dùng [DEPLOYMENT-ROLLBACK-TEMPLATE.md](DEPLOYMENT-ROLLBACK-TEMPLATE.md).


# Runbook: Deployment and rollback

## Metadata

- Service/environment:
- Owner/on-call:
- Last verified:
- Required authority:
- Related dashboards/alerts:

## Preconditions

- Approved version:
- Quality gate evidence:
- Backup/migration status:
- Previous stable version:

## Deployment

1. <Safe step>
2. <Verification>
3. <Progressive rollout/observation>

## Smoke test

- Health/readiness:
- Authentication:
- Catalog:
- Checkout/order:
- Payment/shipping where safe:
- Metrics/logs:

## Rollback triggers

| Signal | Threshold/window | Decision owner |
| --- | --- | --- |
|  |  |  |

## Rollback

1. Stop/limit rollout.
2. Restore previous immutable artifact/config.
3. Handle database by documented compatible/forward-fix path.
4. Verify health, business flow and data.
5. Communicate and preserve evidence.

## Escalation và post-action

- Escalate when:
- Data reconciliation:
- Incident/ADR follow-up:


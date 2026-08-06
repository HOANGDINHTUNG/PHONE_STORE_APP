# RBAC permission catalog

Permissions grant one business capability. Roles are reusable bundles of those permissions; a position is only an HR attribute and never grants access.

| Module | View | Manage / write operations |
| --- | --- | --- |
| Catalog | `PRODUCT_VIEW` | `PRODUCT_CREATE`, `PRODUCT_UPDATE`, `PRODUCT_ARCHIVE` |
| Content | `CONTENT_VIEW` | `CONTENT_MANAGE` |
| Promotions | `PROMOTION_VIEW` | `PROMOTION_MANAGE` |
| Orders | `ORDER_VIEW` | `ORDER_MANAGE` |
| Payments | `PAYMENT_VIEW` | `PAYMENT_MANAGE`, `REFUND_MANAGE` |
| Shipping | `SHIPMENT_VIEW` | `SHIPMENT_MANAGE` |
| Warehouse | `SCOPE_WAREHOUSE_VIEW`, `SCOPE_INVENTORY_VIEW` | `SCOPE_WAREHOUSE_MANAGE`, `SCOPE_INVENTORY_MANAGE`, `SCOPE_INVENTORY_ADJUST` |
| Procurement | `SCOPE_PO_VIEW`, `SCOPE_SUPPLIER_VIEW` | `SCOPE_PO_MANAGE`, `SCOPE_PO_APPROVE`, `SCOPE_SUPPLIER_MANAGE` |
| After-sales | `AFTER_SALES_VIEW` | `AFTER_SALES_MANAGE`, `REVIEW_MODERATE` |
| Identity | `USER_VIEW` | `STAFF_CREATE`, `STAFF_UPDATE`, `ROLE_MANAGE`, `ASSIGN_MANAGE` |
| Governance | `AUDIT_VIEW`, `NOTIFICATION_VIEW` | `NOTIFICATION_RETRY`, `SETTINGS_MANAGE`, `SUPPORT_MANAGE` |

An assignment is effective only while `user_roles.status = ACTIVE`, its role and permission are `ACTIVE`, and `expires_at` is empty or in the future. The next sign-in or refresh token obtains the current effective permissions.

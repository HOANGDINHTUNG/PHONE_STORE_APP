-- Align the operational inventory endpoints with the RBAC permission vocabulary.
-- A role assignment now has an enforceable effect after the assignee signs in again.
INSERT INTO permissions (id, code, module, description, status) VALUES
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_WAREHOUSE_VIEW', 'INVENTORY', 'View warehouses', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_WAREHOUSE_MANAGE', 'INVENTORY', 'Create and maintain warehouses', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_INVENTORY_VIEW', 'INVENTORY', 'View inventory balances, units and ledger', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_INVENTORY_MANAGE', 'INVENTORY', 'Receive inventory and manage stock operations', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_INVENTORY_ADJUST', 'INVENTORY', 'Perform manual stock adjustments', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_PO_VIEW', 'PROCUREMENT', 'View purchase orders', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_PO_MANAGE', 'PROCUREMENT', 'Create and update purchase orders', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_PO_APPROVE', 'PROCUREMENT', 'Approve purchase orders', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_SUPPLIER_VIEW', 'PROCUREMENT', 'View suppliers', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SCOPE_SUPPLIER_MANAGE', 'PROCUREMENT', 'Maintain suppliers', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r CROSS JOIN permissions p
WHERE r.code = 'ROLE-003'
  AND p.code IN ('SCOPE_WAREHOUSE_VIEW', 'SCOPE_WAREHOUSE_MANAGE', 'SCOPE_INVENTORY_VIEW', 'SCOPE_INVENTORY_MANAGE',
                 'SCOPE_INVENTORY_ADJUST', 'SCOPE_PO_VIEW', 'SCOPE_PO_MANAGE', 'SCOPE_PO_APPROVE',
                 'SCOPE_SUPPLIER_VIEW', 'SCOPE_SUPPLIER_MANAGE')
ON DUPLICATE KEY UPDATE role_id = role_id;

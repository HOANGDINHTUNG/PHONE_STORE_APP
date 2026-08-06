-- All operational staff may read guides and open a support ticket; only authorised users can manage settings.
INSERT INTO permissions (id, code, module, description, status)
VALUES (UNHEX(REPLACE(UUID(), '-', '')), 'SUPPORT_VIEW', 'SYSTEM', 'Read support articles and create support tickets', 'ACTIVE')
ON DUPLICATE KEY UPDATE description = VALUES(description), status = 'ACTIVE';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
WHERE r.code IN ('ROLE-002', 'ROLE-003', 'CUST-089') AND p.code = 'SUPPORT_VIEW'
ON DUPLICATE KEY UPDATE role_id = role_id;

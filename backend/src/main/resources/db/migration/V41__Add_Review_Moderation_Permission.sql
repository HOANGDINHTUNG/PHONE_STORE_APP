-- Review moderation is an after-sales responsibility for store managers.
INSERT INTO permissions (id, code, module, description, status)
VALUES (UNHEX(REPLACE(UUID(), '-', '')), 'REVIEW_MODERATE', 'AFTER_SALES', 'View, approve and reject customer product reviews', 'ACTIVE')
ON DUPLICATE KEY UPDATE module = VALUES(module), description = VALUES(description), status = 'ACTIVE';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p
WHERE r.code = 'ROLE-002' AND p.code = 'REVIEW_MODERATE'
ON DUPLICATE KEY UPDATE role_id = role_id;

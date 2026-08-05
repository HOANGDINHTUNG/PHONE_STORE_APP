-- Local/demo administrator account. Password: 123456
-- The insert is idempotent so it never overwrites an administrator that already exists.
INSERT INTO users (id, username, email, phone, password_hash, role, active, account_status)
SELECT
    UNHEX(REPLACE('00000000-0000-0000-0000-000000000099', '-', '')),
    'admin',
    'admin@pinkphone.local',
    '0900000099',
    '$2a$10$1NOAnWWfXs12Tn7IQdEQwuHU1Iw/8jysW8p.OjDFvOPK2/z3EqlZq',
    'ADMIN',
    TRUE,
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE username = 'admin' OR email = 'admin@pinkphone.local'
);

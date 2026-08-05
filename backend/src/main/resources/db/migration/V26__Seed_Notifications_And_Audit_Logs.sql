-- V26__Seed_Notifications_And_Audit_Logs.sql
-- Seed Notifications and Audit Logs with JSON Diff data for Admin Console

-- 1. Seed Notifications
INSERT INTO notifications (id, user_id, title, content, notification_type, entity_type, entity_id, read_at, created_at)
VALUES
(
    UNHEX(REPLACE('44444444-4444-4444-4444-000000000001', '-', '')),
    UNHEX(REPLACE('00000000-0000-0000-0000-000000000124', '-', '')),
    'Xác nhận thanh toán thành công',
    'Đơn hàng #88912 của bạn đã được thanh toán thành công qua VNPAY.',
    'Transactional',
    'ORDER',
    'ORD-88912',
    '2023-10-24 14:35:00',
    '2023-10-24 14:32:01'
),
(
    UNHEX(REPLACE('44444444-4444-4444-4444-000000000002', '-', '')),
    UNHEX(REPLACE('00000000-0000-0000-0000-000000000892', '-', '')),
    'Ưu đãi ngày thứ 6',
    'Giảm 50% cho tất cả các cuộc gọi nội mạng và phụ kiện chính hãng.',
    'Marketing',
    'CAMPAIGN',
    'CPN-BLACKFRIDAY',
    NULL,
    '2023-10-24 14:30:00'
),
(
    UNHEX(REPLACE('44444444-4444-4444-4444-000000000003', '-', '')),
    UNHEX(REPLACE('00000000-0000-0000-0000-000000001005', '-', '')),
    'Bảo trì hệ thống định kỳ',
    'Hệ thống sẽ tạm dừng hoạt động từ 00:00 - 02:00 ngày 28/10/2023.',
    'System',
    'SYSTEM',
    'SYS-MAINT',
    '2023-10-24 16:00:00',
    '2023-10-24 10:15:00'
)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 2. Seed Audit Logs
INSERT INTO audit_logs (id, actor_username, actor_id, actor_type, action_code, entity_type, entity_class, entity_id, old_data, new_data, result, correlation_id, ip_address, user_agent, created_at)
VALUES
(
    UNHEX(REPLACE('55555555-5555-5555-5555-000000000001', '-', '')),
    'admin@pinkphone.vn',
    UNHEX(REPLACE('00000000-0000-0000-0000-0000000000A1', '-', '')),
    'ADMIN',
    'UPDATE_CONFIG',
    'SYSTEM_SETTINGS',
    'com.re.ecommerce.config.SystemSettings',
    'SETTING-101',
    '{\n  "setting_name": "API_RATE_LIMIT",\n  "value": 100,\n  "status": "active",\n  "api_key": "********" // masked\n}',
    '{\n  "setting_name": "API_RATE_LIMIT",\n  "value": 500,\n  "status": "active",\n  "api_key": "********" // masked\n}',
    'SUCCESS',
    'req_8f9a2b1c',
    '192.168.1.42',
    'Macintosh; Intel Mac OS X 10_15_7; Chrome 118.0.0.0',
    '2023-10-27 14:32:01'
),
(
    UNHEX(REPLACE('55555555-5555-5555-5555-000000000002', '-', '')),
    'system_cron',
    NULL,
    'SYSTEM',
    'DATA_SYNC',
    'EXTERNAL_API',
    'com.re.ecommerce.sync.ExternalApiSyncJob',
    'JOB-SYNC-99',
    '{\n  "last_sync": "2023-10-26 12:00:00",\n  "records": 120\n}',
    '{\n  "last_sync": "2023-10-27 14:28:45",\n  "records": 0,\n  "error": "Connection timeout to ERP API"\n}',
    'FAILURE',
    'req_3a2d1f9b',
    '127.0.0.1',
    'Spring-Cloud-Task/3.0.0',
    '2023-10-27 14:28:45'
),
(
    UNHEX(REPLACE('55555555-5555-5555-5555-000000000003', '-', '')),
    'admin@pinkphone.vn',
    UNHEX(REPLACE('00000000-0000-0000-0000-0000000000A1', '-', '')),
    'ADMIN',
    'ASSIGN_ROLE',
    'USER_ROLE',
    'com.re.ecommerce.modules.staff.entity.UserRole',
    'UR-8812',
    '{\n  "user_email": "a.nguyen@pinkphone.vn",\n  "role": "STAFF"\n}',
    '{\n  "user_email": "a.nguyen@pinkphone.vn",\n  "role": "STORE_MANAGER"\n}',
    'SUCCESS',
    'req_7c8d9e0f',
    '192.168.1.42',
    'Macintosh; Intel Mac OS X 10_15_7; Chrome 118.0.0.0',
    '2023-10-26 09:15:20'
)
ON DUPLICATE KEY UPDATE action_code = VALUES(action_code);

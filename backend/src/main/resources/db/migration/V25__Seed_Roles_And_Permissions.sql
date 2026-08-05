-- V25__Seed_Roles_And_Permissions.sql
-- Seed Permissions, Roles, Role Permissions Mapping, and User Roles Assignments

-- 1. Seed Permissions
INSERT INTO permissions (id, code, module, description, status)
VALUES
(UNHEX(REPLACE('11111111-1111-1111-1111-000000000001', '-', '')), 'WH_VIEW_LIST', 'Kho hàng', 'Cho phép xem danh sách tất cả các kho hàng và số lượng tồn kho tổng quan.', 'ACTIVE'),
(UNHEX(REPLACE('11111111-1111-1111-1111-000000000002', '-', '')), 'WH_ADJUST_STOCK', 'Kho hàng', 'Thay đổi số lượng tồn kho trực tiếp mà không qua đơn hàng hoặc phiếu nhập.', 'ACTIVE'),
(UNHEX(REPLACE('11111111-1111-1111-1111-000000000003', '-', '')), 'WH_APPROVE_OUTBOUND', 'Kho hàng', 'Phê duyệt các yêu cầu xuất kho vật tư, hàng hóa.', 'ACTIVE'),
(UNHEX(REPLACE('11111111-1111-1111-1111-000000000004', '-', '')), 'ORD_DELETE', 'Đơn hàng', 'Xóa vĩnh viễn đơn hàng khỏi hệ thống (Không khuyến nghị).', 'ACTIVE'),
(UNHEX(REPLACE('11111111-1111-1111-1111-000000000005', '-', '')), 'PROD_UPDATE_PRICE', 'Sản phẩm', 'Cập nhật giá bán lẻ và giá khuyến mãi của sản phẩm.', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- 2. Seed Roles
INSERT INTO roles (id, code, name, description, role_type, status)
VALUES
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000001', '-', '')), 'ROLE-001', 'Quản trị viên (Admin)', 'Toàn quyền truy cập tất cả các module và tính năng hệ thống.', 'SYSTEM', 'ACTIVE'),
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000002', '-', '')), 'ROLE-002', 'Quản lý Cửa hàng', 'Quản lý hoạt động bán lẻ, đơn hàng, khách hàng và nhân viên cửa hàng.', 'SYSTEM', 'ACTIVE'),
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000003', '-', '')), 'ROLE-003', 'Quản lý Kho', 'Giám sát nhập xuất, tồn kho và điều chuyển linh kiện vật tư.', 'SYSTEM', 'ACTIVE'),
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000004', '-', '')), 'CUST-089', 'Chuyên viên Marketing', 'Quản lý chiến dịch khuyến mại, voucher và gửi tin nhắn truyền thông.', 'CUSTOM', 'ACTIVE'),
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000005', '-', '')), 'CUST-092', 'Thực tập sinh (View Only)', 'Chỉ xem dữ liệu tổng quan, không có quyền chỉnh sửa dữ liệu.', 'CUSTOM', 'INACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Map Role Permissions
INSERT INTO role_permissions (role_id, permission_id)
VALUES
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000003', '-', '')), UNHEX(REPLACE('11111111-1111-1111-1111-000000000001', '-', ''))),
(UNHEX(REPLACE('22222222-2222-2222-2222-000000000003', '-', '')), UNHEX(REPLACE('11111111-1111-1111-1111-000000000002', '-', '')))
ON DUPLICATE KEY UPDATE role_id = role_id;

-- 4. User Role Assignments History
INSERT INTO user_roles (id, user_id, role_id, status, assigned_by, assigned_at, revoked_at, revoked_by, revoked_reason)
VALUES
(
    UNHEX(REPLACE('33333333-3333-3333-3333-000000000001', '-', '')),
    UNHEX(REPLACE('00000000-0000-0000-0000-000000000124', '-', '')),
    UNHEX(REPLACE('22222222-2222-2222-2222-000000000004', '-', '')),
    'ACTIVE',
    'admin.sys',
    '2023-10-12 14:30:00',
    NULL,
    NULL,
    'Ticket: REQ-8992 - Onboarding nhân viên mới'
),
(
    UNHEX(REPLACE('33333333-3333-3333-3333-000000000002', '-', '')),
    UNHEX(REPLACE('00000000-0000-0000-0000-000000000892', '-', '')),
    UNHEX(REPLACE('22222222-2222-2222-2222-000000000002', '-', '')),
    'REVOKED',
    'admin.sys',
    '2023-05-01 09:00:00',
    '2023-10-10 00:00:00',
    'admin.sys',
    'Chuyển công tác sang bộ phận khác'
),
(
    UNHEX(REPLACE('33333333-3333-3333-3333-000000000003', '-', '')),
    UNHEX(REPLACE('00000000-0000-0000-0000-000000001005', '-', '')),
    UNHEX(REPLACE('22222222-2222-2222-2222-000000000005', '-', '')),
    'ACTIVE',
    'sec.lead',
    '2023-09-15 10:15:00',
    NULL,
    NULL,
    'Kiểm toán nội bộ Q4'
)
ON DUPLICATE KEY UPDATE status = VALUES(status);

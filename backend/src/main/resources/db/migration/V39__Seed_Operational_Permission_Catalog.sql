-- Canonical RBAC catalog. Permission codes are stable API contracts, not UI labels.
INSERT INTO permissions (id, code, module, description, status) VALUES
(UNHEX(REPLACE(UUID(), '-', '')), 'DASHBOARD_VIEW', 'DASHBOARD', 'Xem tổng quan vận hành', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PRODUCT_VIEW', 'CATALOG', 'Xem sản phẩm, biến thể, thương hiệu và danh mục', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PRODUCT_CREATE', 'CATALOG', 'Tạo sản phẩm và biến thể', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PRODUCT_UPDATE', 'CATALOG', 'Cập nhật sản phẩm, biến thể và giá', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PRODUCT_ARCHIVE', 'CATALOG', 'Ngừng kinh doanh sản phẩm hoặc biến thể', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'CONTENT_VIEW', 'CONTENT', 'Xem banner và bài viết quản trị', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'CONTENT_MANAGE', 'CONTENT', 'Tạo, sửa và bật/tắt banner, bài viết', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PROMOTION_VIEW', 'PROMOTION', 'Xem mã giảm giá và phân tích sử dụng', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PROMOTION_MANAGE', 'PROMOTION', 'Tạo, sửa, phân phối và vô hiệu hóa mã giảm giá', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'ORDER_VIEW', 'ORDER', 'Xem danh sách và chi tiết đơn hàng', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'ORDER_MANAGE', 'ORDER', 'Xác nhận, xử lý và hủy đơn hàng', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PAYMENT_VIEW', 'PAYMENT', 'Xem giao dịch và lịch sử thanh toán', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'PAYMENT_MANAGE', 'PAYMENT', 'Đối soát và cập nhật thanh toán', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'REFUND_MANAGE', 'PAYMENT', 'Duyệt và xử lý hoàn tiền', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SHIPMENT_VIEW', 'SHIPMENT', 'Xem vận đơn và trạng thái giao hàng', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SHIPMENT_MANAGE', 'SHIPMENT', 'Tạo vận đơn và cập nhật giao hàng', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'AFTER_SALES_VIEW', 'AFTER_SALES', 'Xem bảo hành và yêu cầu đổi trả', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'AFTER_SALES_MANAGE', 'AFTER_SALES', 'Xử lý bảo hành và yêu cầu đổi trả', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'USER_VIEW', 'IDENTITY', 'Xem người dùng và nhân sự', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'STAFF_CREATE', 'IDENTITY', 'Tạo hồ sơ nhân viên', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'STAFF_UPDATE', 'IDENTITY', 'Cập nhật hồ sơ nhân viên', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'ROLE_MANAGE', 'IDENTITY', 'Quản lý vai trò và bộ quyền', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'ASSIGN_MANAGE', 'IDENTITY', 'Gán và thu hồi vai trò người dùng', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'AUDIT_VIEW', 'GOVERNANCE', 'Xem nhật ký kiểm toán', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SETTINGS_MANAGE', 'SYSTEM', 'Cập nhật cấu hình hệ thống', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'SUPPORT_MANAGE', 'SYSTEM', 'Quản lý ticket hỗ trợ', 'ACTIVE')
ON DUPLICATE KEY UPDATE module = VALUES(module), description = VALUES(description), status = 'ACTIVE';

-- Default operational roles. System admin is intentionally not mapped: ROLE_ADMIN is the emergency full-access bypass.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
WHERE r.code = 'ROLE-002' AND p.code IN (
  'DASHBOARD_VIEW','ORDER_VIEW','ORDER_MANAGE','PAYMENT_VIEW','REFUND_MANAGE',
  'SHIPMENT_VIEW','SHIPMENT_MANAGE','AFTER_SALES_VIEW','AFTER_SALES_MANAGE','USER_VIEW'
)
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
WHERE r.code = 'ROLE-003' AND p.code IN ('DASHBOARD_VIEW','SHIPMENT_VIEW','SHIPMENT_MANAGE')
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
WHERE r.code = 'CUST-089' AND p.code IN ('DASHBOARD_VIEW','PRODUCT_VIEW','CONTENT_VIEW','CONTENT_MANAGE','PROMOTION_VIEW','PROMOTION_MANAGE','NOTIFICATION_VIEW')
ON DUPLICATE KEY UPDATE role_id = role_id;

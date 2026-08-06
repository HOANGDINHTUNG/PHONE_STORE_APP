-- ============================================================================
-- V29: ENHANCE VOUCHERS AND USER WALLET SCHEMA
-- ============================================================================

-- 1. Add extra metadata columns to coupons table
ALTER TABLE coupons ADD COLUMN badge_text VARCHAR(50) NULL AFTER name;
ALTER TABLE coupons ADD COLUMN min_membership_tier VARCHAR(30) NOT NULL DEFAULT 'ALL' AFTER per_customer_limit;
ALTER TABLE coupons ADD COLUMN is_stackable BOOLEAN NOT NULL DEFAULT FALSE AFTER min_membership_tier;
ALTER TABLE coupons ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE AFTER is_stackable;

-- 2. Add applied_coupon_id to carts table
ALTER TABLE carts ADD COLUMN applied_coupon_id BINARY(16) NULL AFTER guest_token_hash;
ALTER TABLE carts ADD CONSTRAINT fk_carts_applied_coupon FOREIGN KEY (applied_coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- 3. Create user_vouchers table for customer wallet claiming
CREATE TABLE user_vouchers (
    id BINARY(16) NOT NULL PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    coupon_id BINARY(16) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    CONSTRAINT uq_user_vouchers_user_coupon UNIQUE (user_id, coupon_id),
    CONSTRAINT chk_user_vouchers_status CHECK (status IN ('AVAILABLE', 'USED', 'EXPIRED')),
    CONSTRAINT fk_user_vouchers_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_user_vouchers_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_user_vouchers_user_status ON user_vouchers(user_id, status);

-- 4. Seed rich sample vouchers for testing & production demonstration
INSERT INTO coupons (
    id, code, name, badge_text, description, type, discount_value, applies_to_all,
    minimum_order_value, maximum_discount_amount, start_time, end_time,
    per_customer_limit, total_usage_limit, min_membership_tier, is_stackable, is_featured,
    status, used_count
) VALUES 
(
    UUID_TO_BIN('a1111111-1111-1111-1111-111111111111'),
    'WELCOME50', 'Voucher Chào Mới', 'Giảm 50.000đ',
    'Giảm 50.000đ cho đơn hàng đầu tiên từ 200.000đ.',
    'AMOUNT', 50000.0000, TRUE, 200000.0000, 50000.0000,
    NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 1000, 'ALL', FALSE, TRUE, 'ACTIVE', 12
),
(
    UUID_TO_BIN('a2222222-2222-2222-2222-222222222222'),
    'TECH10', 'Giảm 10% Siêu Cấp', 'Giảm 10%',
    'Giảm 10% tối đa 500.000đ cho đơn hàng từ 5.000.000đ.',
    'PERCENT', 10.0000, TRUE, 5000000.0000, 500000.0000,
    NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 2, 500, 'ALL', FALSE, TRUE, 'ACTIVE', 84
),
(
    UUID_TO_BIN('a3333333-3333-3333-3333-333333333333'),
    'SAMSUNG300', 'Ưu Đãi Samsung Galaxy', 'Voucher 300.000đ',
    'Giảm 300.000đ áp dụng cho dòng sản phẩm Samsung Galaxy.',
    'AMOUNT', 300000.0000, FALSE, 8000000.0000, 300000.0000,
    NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1, 200, 'ALL', FALSE, TRUE, 'ACTIVE', 45
),
(
    UUID_TO_BIN('a4444444-4444-4444-4444-444444444444'),
    'FLASHSALE20', 'Flash Sale Cuối Tuần', 'Flash Sale 20%',
    'Giảm 20% tối đa 1.000.000đ cho tất cả điện thoại flagship.',
    'PERCENT', 20.0000, TRUE, 10000000.0000, 1000000.0000,
    NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 1, 100, 'ALL', FALSE, TRUE, 'ACTIVE', 92
),
(
    UUID_TO_BIN('a5555555-5555-5555-5555-555555555555'),
    'VIPGOLD', 'Đặc Quyền Thành Viên VIP', 'Voucher 1 Triệu',
    'Đặc quyền riêng cho tài khoản hạng Gold/Diamond giảm 1.000.000đ.',
    'AMOUNT', 1000000.0000, TRUE, 15000000.0000, 1000000.0000,
    NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1, 50, 'GOLD', FALSE, FALSE, 'ACTIVE', 5
);

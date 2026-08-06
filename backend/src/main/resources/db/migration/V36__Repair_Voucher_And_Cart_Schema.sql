-- The voucher feature was introduced after some development databases had
-- already recorded an earlier migration version.  Keep this repair additive
-- so both existing and newly-created development databases are supported.

ALTER TABLE coupons ADD COLUMN badge_text VARCHAR(50) NULL;
ALTER TABLE coupons ADD COLUMN min_membership_tier VARCHAR(30) NOT NULL DEFAULT 'ALL';
ALTER TABLE coupons ADD COLUMN is_stackable BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE coupons ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE carts ADD COLUMN applied_coupon_id BINARY(16) NULL;

ALTER TABLE carts
    ADD CONSTRAINT fk_carts_applied_coupon
    FOREIGN KEY (applied_coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS user_vouchers (
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
    CONSTRAINT fk_user_vouchers_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_user_vouchers_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

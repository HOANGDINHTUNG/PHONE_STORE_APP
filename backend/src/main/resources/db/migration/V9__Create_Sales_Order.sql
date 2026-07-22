-- V9__Create_Sales_Order.sql

-- ============================================================================
-- REGION 07 - SALES ORDERS AND IMMUTABLE ORDER SNAPSHOTS
-- ============================================================================

CREATE TABLE orders (
    id BINARY(16) PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL,
    idempotency_key_hash BINARY(32) NOT NULL,
    customer_id BINARY(16) NULL,
    source_channel ENUM('WEB', 'MOBILE', 'ADMIN') NOT NULL DEFAULT 'WEB',
    coupon_id BINARY(16) NULL,
    shipping_address_id BINARY(16) NULL,
    contact_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(254) NULL,
    contact_phone VARCHAR(20) NOT NULL,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    shipping_country_code CHAR(2) NOT NULL DEFAULT 'VN',
    shipping_province_code VARCHAR(20) NULL,
    shipping_province_name VARCHAR(100) NOT NULL,
    shipping_district_code VARCHAR(20) NULL,
    shipping_district_name VARCHAR(100) NOT NULL,
    shipping_ward_code VARCHAR(20) NULL,
    shipping_ward_name VARCHAR(100) NOT NULL,
    shipping_detail_address VARCHAR(255) NOT NULL,
    shipping_postal_code VARCHAR(20) NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    subtotal_amount DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    grand_total_amount DECIMAL(15,2) NOT NULL,
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPING',
        'COMPLETED',
        'CANCELLED',
        'PARTIALLY_RETURNED',
        'RETURNED'
    ) NOT NULL DEFAULT 'PENDING',
    note TEXT NULL,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    cancelled_by BINARY(16) NULL,
    cancel_reason VARCHAR(500) NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_orders_code UNIQUE (order_code),
    CONSTRAINT uq_orders_idempotency UNIQUE (idempotency_key_hash),
    CONSTRAINT chk_orders_amounts CHECK (
        subtotal_amount >= 0
        AND discount_amount >= 0
        AND discount_amount <= subtotal_amount
        AND shipping_fee >= 0
        AND grand_total_amount = subtotal_amount - discount_amount + shipping_fee
    ),
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_orders_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_orders_shipping_address
        FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_orders_cancelled_by
        FOREIGN KEY (cancelled_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id BINARY(16) PRIMARY KEY,
    order_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    color VARCHAR(80) NULL,
    ram VARCHAR(50) NULL,
    storage VARCHAR(50) NULL,
    image_url VARCHAR(500) NULL,
    warranty_months INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(15,2) NOT NULL,
    quantity INT NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(15,2)
        GENERATED ALWAYS AS (unit_price * quantity - discount_amount) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_order_items_variant UNIQUE (order_id, product_variant_id),
    CONSTRAINT chk_order_items_price CHECK (unit_price >= 0),
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_discount CHECK (
        discount_amount >= 0 AND discount_amount <= unit_price * quantity
    ),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_order_items_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE order_status_histories (
    id BINARY(16) PRIMARY KEY,
    order_id BINARY(16) NOT NULL,
    old_status ENUM(
        'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED',
        'CANCELLED', 'PARTIALLY_RETURNED', 'RETURNED'
    ) NULL,
    new_status ENUM(
        'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED',
        'CANCELLED', 'PARTIALLY_RETURNED', 'RETURNED'
    ) NOT NULL,
    actor_type ENUM('CUSTOMER', 'STAFF', 'SYSTEM') NOT NULL,
    changed_by BINARY(16) NULL,
    reason_code VARCHAR(100) NULL,
    note VARCHAR(1000) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_order_status_histories_change CHECK (
        old_status IS NULL OR old_status <> new_status
    ),
    CONSTRAINT fk_order_status_histories_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_order_status_histories_changed_by
        FOREIGN KEY (changed_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupon_usages (
    id BINARY(16) PRIMARY KEY,
    coupon_id BINARY(16) NOT NULL,
    order_id BINARY(16) NOT NULL,
    customer_id BINARY(16) NULL,
    guest_identity_hash BINARY(32) NULL,
    discount_amount DECIMAL(15,2) NOT NULL,
    usage_status ENUM('RESERVED', 'CONSUMED', 'RELEASED')
        NOT NULL DEFAULT 'RESERVED',
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consumed_at TIMESTAMP NULL,
    released_at TIMESTAMP NULL,

    CONSTRAINT uq_coupon_usages_order UNIQUE (order_id),
    CONSTRAINT chk_coupon_usages_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_coupon_usages_owner CHECK (
        (customer_id IS NOT NULL AND guest_identity_hash IS NULL)
        OR (customer_id IS NULL AND guest_identity_hash IS NOT NULL)
    ),
    CONSTRAINT chk_coupon_usages_lifecycle CHECK (
        (usage_status = 'RESERVED' AND consumed_at IS NULL AND released_at IS NULL)
        OR (usage_status = 'CONSUMED' AND consumed_at IS NOT NULL AND released_at IS NULL)
        OR (usage_status = 'RELEASED' AND released_at IS NOT NULL)
    ),
    CONSTRAINT fk_coupon_usages_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_usages_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_usages_customer
        FOREIGN KEY (customer_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

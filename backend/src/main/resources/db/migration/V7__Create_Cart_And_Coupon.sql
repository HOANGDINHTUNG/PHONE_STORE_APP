-- ============================================================================
-- V7: CART AND COUPON SCHEMA
-- ============================================================================

CREATE TABLE carts (
    id BINARY(16) NOT NULL PRIMARY KEY,
    customer_id BINARY(16) NULL,
    guest_token_hash BINARY(32) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),

    CONSTRAINT uq_carts_customer_id UNIQUE (customer_id),
    CONSTRAINT uq_carts_guest_token UNIQUE (guest_token_hash),
    CONSTRAINT chk_carts_owner CHECK (
        (customer_id IS NOT NULL AND guest_token_hash IS NULL) OR 
        (customer_id IS NULL AND guest_token_hash IS NOT NULL)
    ),
    CONSTRAINT fk_carts_customer
        FOREIGN KEY (customer_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE cart_items (
    id BINARY(16) NOT NULL PRIMARY KEY,
    cart_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),

    CONSTRAINT uq_cart_items_cart_variant UNIQUE (cart_id, product_variant_id),
    CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_cart_items_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupons (
    id BINARY(16) NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(19, 4) NOT NULL,
    applies_to_all BOOLEAN NOT NULL DEFAULT FALSE,
    minimum_order_value DECIMAL(19, 4) NULL,
    maximum_discount_amount DECIMAL(19, 4) NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    per_customer_limit INT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE',
    used_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),

    CONSTRAINT uq_coupons_code UNIQUE (code),
    CONSTRAINT chk_coupons_value CHECK (
        (type = 'PERCENT' AND discount_value > 0 AND discount_value <= 100) OR
        (type = 'AMOUNT' AND discount_value > 0)
    ),
    CONSTRAINT chk_coupons_time CHECK (end_time > start_time),
    CONSTRAINT chk_coupons_used_count CHECK (used_count >= 0)
) ENGINE=InnoDB;

CREATE TABLE coupon_brand_targets (
    coupon_id BINARY(16) NOT NULL,
    brand_id BINARY(16) NOT NULL,
    
    PRIMARY KEY (coupon_id, brand_id),
    CONSTRAINT fk_coupon_brand_targets_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_brand_targets_brand
        FOREIGN KEY (brand_id) REFERENCES brands(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupon_category_targets (
    coupon_id BINARY(16) NOT NULL,
    category_id BINARY(16) NOT NULL,
    
    PRIMARY KEY (coupon_id, category_id),
    CONSTRAINT fk_coupon_category_targets_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_category_targets_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupon_product_targets (
    coupon_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    
    PRIMARY KEY (coupon_id, product_id),
    CONSTRAINT fk_coupon_product_targets_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_product_targets_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

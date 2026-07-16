-- ============================================================================
-- PHONE STORE ENTERPRISE DATABASE SCHEMA
-- Target      : MySQL 8.0.16+
-- Character   : utf8mb4
-- Storage     : InnoDB
-- Time policy : Application writes all DATETIME values in UTC
-- Purpose     : Production-oriented logical schema. Use Flyway/Liquibase to
--               split this file into versioned migrations before deployment.
-- Important   : This script never drops the database.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS phone_store
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE phone_store;

-- ============================================================================
-- REGION 01 - IDENTITY, AUTHENTICATION AND ACCOUNT PROFILES
-- ============================================================================

CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    normalized_email VARCHAR(254) NOT NULL,
    phone VARCHAR(20) NULL,
    normalized_phone VARCHAR(20) NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    account_status ENUM(
        'PENDING_VERIFICATION',
        'ACTIVE',
        'LOCKED',
        'DISABLED'
    ) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    email_verified_at DATETIME NULL,
    phone_verified_at DATETIME NULL,
    last_login_at DATETIME NULL,
    failed_login_count INT UNSIGNED NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT uq_users_normalized_email UNIQUE (normalized_email),
    CONSTRAINT uq_users_normalized_phone UNIQUE (normalized_phone),
    CONSTRAINT chk_users_failed_login_count CHECK (failed_login_count >= 0)
) ENGINE=InnoDB;

CREATE TABLE customer_profiles (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    customer_code VARCHAR(30) NOT NULL,
    date_of_birth DATE NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED') NULL,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    customer_status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_customer_profiles_code UNIQUE (customer_code),
    CONSTRAINT fk_customer_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE departments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_departments_code UNIQUE (code),
    CONSTRAINT uq_departments_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE positions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    department_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_positions_department_code UNIQUE (department_id, code),
    CONSTRAINT fk_positions_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE staff_profiles (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    employee_code VARCHAR(30) NOT NULL,
    position_id BIGINT UNSIGNED NOT NULL,
    manager_user_id BIGINT UNSIGNED NULL,
    hire_date DATE NOT NULL,
    employment_status ENUM(
        'ACTIVE',
        'ON_LEAVE',
        'SUSPENDED',
        'TERMINATED'
    ) NOT NULL DEFAULT 'ACTIVE',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_staff_profiles_employee_code UNIQUE (employee_code),
    CONSTRAINT chk_staff_profiles_manager CHECK (
        manager_user_id IS NULL OR manager_user_id <> user_id
    ),
    CONSTRAINT fk_staff_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_staff_profiles_position
        FOREIGN KEY (position_id) REFERENCES positions(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_staff_profiles_manager
        FOREIGN KEY (manager_user_id) REFERENCES staff_profiles(user_id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_staff_profiles_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE refresh_tokens (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash BINARY(32) NOT NULL,
    token_family_id BINARY(16) NOT NULL,
    expires_at DATETIME NOT NULL,
    last_used_at DATETIME NULL,
    revoked_at DATETIME NULL,
    revoked_reason VARCHAR(255) NULL,
    replaced_by_token_id BIGINT UNSIGNED NULL,
    device_name VARCHAR(150) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_refresh_tokens_hash UNIQUE (token_hash),
    CONSTRAINT chk_refresh_tokens_expiry CHECK (expires_at > created_at),
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_refresh_tokens_replacement
        FOREIGN KEY (replaced_by_token_id) REFERENCES refresh_tokens(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash BINARY(32) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    requested_ip VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_password_reset_tokens_hash UNIQUE (token_hash),
    CONSTRAINT chk_password_reset_tokens_expiry CHECK (expires_at > created_at),
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE email_verification_tokens (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash BINARY(32) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_email_verification_tokens_hash UNIQUE (token_hash),
    CONSTRAINT chk_email_verification_tokens_expiry CHECK (expires_at > created_at),
    CONSTRAINT fk_email_verification_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 02 - DYNAMIC RBAC: ROLES, PERMISSIONS AND ASSIGNMENTS
-- ============================================================================

CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500) NULL,
    is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_permissions_code UNIQUE (code)
) ENGINE=InnoDB;

CREATE TABLE roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500) NULL,
    role_type ENUM('SYSTEM', 'CUSTOM') NOT NULL DEFAULT 'CUSTOM',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_roles_code UNIQUE (code),
    CONSTRAINT fk_roles_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    granted_by BIGINT UNSIGNED NULL,
    granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_role_permissions_granted_by
        FOREIGN KEY (granted_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE user_roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assignment_status ENUM('ACTIVE', 'REVOKED') NOT NULL DEFAULT 'ACTIVE',
    assigned_by BIGINT UNSIGNED NULL,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    revoked_by BIGINT UNSIGNED NULL,
    revoked_at DATETIME NULL,
    reason VARCHAR(500) NULL,
    active_assignment_key VARCHAR(100)
        GENERATED ALWAYS AS (
            CASE
                WHEN assignment_status = 'ACTIVE'
                THEN CONCAT(user_id, ':', role_id)
                ELSE NULL
            END
        ) STORED,

    CONSTRAINT uq_user_roles_active UNIQUE (active_assignment_key),
    CONSTRAINT chk_user_roles_expiry CHECK (
        expires_at IS NULL OR expires_at > assigned_at
    ),
    CONSTRAINT chk_user_roles_revocation CHECK (
        (assignment_status = 'ACTIVE' AND revoked_at IS NULL)
        OR assignment_status = 'REVOKED'
    ),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_user_roles_assigned_by
        FOREIGN KEY (assigned_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_user_roles_revoked_by
        FOREIGN KEY (revoked_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 03 - PRODUCT CATALOG, VARIANTS, MEDIA AND PRICING
-- ============================================================================

CREATE TABLE categories (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_categories_slug UNIQUE (slug),
    CONSTRAINT chk_categories_sort_order CHECK (sort_order >= 0),
    CONSTRAINT chk_categories_not_self CHECK (parent_id IS NULL OR parent_id <> id),
    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE brands (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    logo_url VARCHAR(500) NULL,
    description TEXT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_brands_name UNIQUE (name),
    CONSTRAINT uq_brands_slug UNIQUE (slug)
) ENGINE=InnoDB;

CREATE TABLE products (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    brand_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description VARCHAR(1000) NULL,
    description TEXT NULL,
    view_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
    sold_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
    publication_status ENUM('DRAFT', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'DRAFT',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT uq_products_slug UNIQUE (slug),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_products_brand
        FOREIGN KEY (brand_id) REFERENCES brands(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_products_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE product_variants (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(100) NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    color VARCHAR(80) NULL,
    ram VARCHAR(50) NULL,
    storage VARCHAR(50) NULL,
    tracking_type ENUM('QUANTITY', 'SERIALIZED') NOT NULL DEFAULT 'QUANTITY',
    list_price DECIMAL(15,2) NOT NULL,
    sale_price DECIMAL(15,2) NULL,
    warranty_months INT UNSIGNED NOT NULL DEFAULT 12,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    version BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT uq_product_variants_sku UNIQUE (sku),
    CONSTRAINT chk_product_variants_list_price CHECK (list_price >= 0),
    CONSTRAINT chk_product_variants_sale_price CHECK (
        sale_price IS NULL OR (sale_price >= 0 AND sale_price <= list_price)
    ),
    CONSTRAINT fk_product_variants_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE product_images (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    primary_variant_id BIGINT UNSIGNED
        GENERATED ALWAYS AS (
            CASE WHEN is_primary = TRUE THEN product_variant_id ELSE NULL END
        ) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_product_images_primary UNIQUE (primary_variant_id),
    CONSTRAINT chk_product_images_sort_order CHECK (sort_order >= 0),
    CONSTRAINT fk_product_images_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE product_specifications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    group_name VARCHAR(150) NOT NULL,
    spec_name VARCHAR(150) NOT NULL,
    spec_value TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT uq_product_specifications_name
        UNIQUE (product_id, group_name, spec_name),
    CONSTRAINT chk_product_specifications_sort_order CHECK (sort_order >= 0),
    CONSTRAINT fk_product_specifications_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE product_attributes (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,

    CONSTRAINT uq_product_attributes_value
        UNIQUE (product_id, attribute_name, attribute_value),
    CONSTRAINT fk_product_attributes_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE related_products (
    product_id BIGINT UNSIGNED NOT NULL,
    related_product_id BIGINT UNSIGNED NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (product_id, related_product_id),
    CONSTRAINT chk_related_products_not_self CHECK (product_id <> related_product_id),
    CONSTRAINT chk_related_products_sort_order CHECK (sort_order >= 0),
    CONSTRAINT fk_related_products_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_related_products_related
        FOREIGN KEY (related_product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE product_price_histories (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    old_list_price DECIMAL(15,2) NULL,
    new_list_price DECIMAL(15,2) NOT NULL,
    old_sale_price DECIMAL(15,2) NULL,
    new_sale_price DECIMAL(15,2) NULL,
    changed_by BIGINT UNSIGNED NULL,
    reason VARCHAR(500) NULL,
    effective_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_product_price_histories_new_list CHECK (new_list_price >= 0),
    CONSTRAINT chk_product_price_histories_new_sale CHECK (
        new_sale_price IS NULL OR (
            new_sale_price >= 0 AND new_sale_price <= new_list_price
        )
    ),
    CONSTRAINT fk_product_price_histories_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_product_price_histories_changed_by
        FOREIGN KEY (changed_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 04 - CUSTOMER SHOPPING: CARTS, WISHLISTS AND ADDRESSES
-- ============================================================================

CREATE TABLE carts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT UNSIGNED NULL,
    guest_token_hash BINARY(32) NULL,
    status ENUM('ACTIVE', 'ABANDONED') NOT NULL DEFAULT 'ACTIVE',
    last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_carts_customer UNIQUE (customer_id),
    CONSTRAINT uq_carts_guest_token UNIQUE (guest_token_hash),
    CONSTRAINT chk_carts_exactly_one_owner CHECK (
        (customer_id IS NOT NULL AND guest_token_hash IS NULL)
        OR (customer_id IS NULL AND guest_token_hash IS NOT NULL)
    ),
    CONSTRAINT fk_carts_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE cart_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_cart_items_variant UNIQUE (cart_id, product_variant_id),
    CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_cart_items_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE wishlists (
    customer_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (customer_id, product_id),
    CONSTRAINT fk_wishlists_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_wishlists_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE compare_items (
    customer_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (customer_id, product_id),
    CONSTRAINT fk_compare_items_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_compare_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE shipping_addresses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT UNSIGNED NOT NULL,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'VN',
    province_code VARCHAR(20) NULL,
    province_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(20) NULL,
    district_name VARCHAR(100) NOT NULL,
    ward_code VARCHAR(20) NULL,
    ward_name VARCHAR(100) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    default_customer_id BIGINT UNSIGNED
        GENERATED ALWAYS AS (
            CASE WHEN is_default = TRUE THEN customer_id ELSE NULL END
        ) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT uq_shipping_addresses_default UNIQUE (default_customer_id),
    CONSTRAINT fk_shipping_addresses_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 05 - COUPONS AND PROMOTION TARGETING
-- ============================================================================

CREATE TABLE coupons (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500) NULL,
    discount_type ENUM('PERCENT', 'AMOUNT') NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL,
    minimum_order_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    maximum_discount DECIMAL(15,2) NULL,
    usage_limit INT UNSIGNED NULL,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    per_customer_limit INT UNSIGNED NULL,
    applies_to_all BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_coupons_code UNIQUE (code),
    CONSTRAINT chk_coupons_discount CHECK (
        (discount_type = 'PERCENT' AND discount_value > 0 AND discount_value <= 100)
        OR (discount_type = 'AMOUNT' AND discount_value > 0)
    ),
    CONSTRAINT chk_coupons_minimum_order CHECK (minimum_order_value >= 0),
    CONSTRAINT chk_coupons_maximum_discount CHECK (
        maximum_discount IS NULL OR maximum_discount >= 0
    ),
    CONSTRAINT chk_coupons_schedule CHECK (ends_at > starts_at),
    CONSTRAINT chk_coupons_usage CHECK (
        usage_limit IS NULL OR used_count <= usage_limit
    ),
    CONSTRAINT chk_coupons_customer_limit CHECK (
        per_customer_limit IS NULL OR per_customer_limit > 0
    ),
    CONSTRAINT fk_coupons_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupon_products (
    coupon_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (coupon_id, product_id),
    CONSTRAINT fk_coupon_products_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_products_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupon_categories (
    coupon_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (coupon_id, category_id),
    CONSTRAINT fk_coupon_categories_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_categories_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE coupon_brands (
    coupon_id BIGINT UNSIGNED NOT NULL,
    brand_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (coupon_id, brand_id),
    CONSTRAINT fk_coupon_brands_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_coupon_brands_brand
        FOREIGN KEY (brand_id) REFERENCES brands(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 06 - SUPPLIERS, WAREHOUSES AND PROCUREMENT
-- ============================================================================

CREATE TABLE warehouses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_warehouses_code UNIQUE (code),
    CONSTRAINT uq_warehouses_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE suppliers (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    supplier_code VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(50) NULL,
    contact_name VARCHAR(150) NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(254) NULL,
    address VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_suppliers_code UNIQUE (supplier_code),
    CONSTRAINT uq_suppliers_tax_code UNIQUE (tax_code)
) ENGINE=InnoDB;

CREATE TABLE purchase_orders (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    purchase_order_code VARCHAR(50) NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    status ENUM(
        'DRAFT',
        'PENDING_APPROVAL',
        'APPROVED',
        'PARTIALLY_RECEIVED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'DRAFT',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    expected_at DATETIME NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at DATETIME NULL,
    received_by BIGINT UNSIGNED NULL,
    received_at DATETIME NULL,
    cancelled_by BIGINT UNSIGNED NULL,
    cancelled_at DATETIME NULL,
    cancel_reason VARCHAR(500) NULL,
    note TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_purchase_orders_code UNIQUE (purchase_order_code),
    CONSTRAINT chk_purchase_orders_total CHECK (total_amount >= 0),
    CONSTRAINT fk_purchase_orders_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_orders_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_orders_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_orders_approved_by
        FOREIGN KEY (approved_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_orders_received_by
        FOREIGN KEY (received_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_orders_cancelled_by
        FOREIGN KEY (cancelled_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE purchase_order_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    purchase_order_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    ordered_quantity INT UNSIGNED NOT NULL,
    received_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    unit_cost DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2)
        GENERATED ALWAYS AS (ordered_quantity * unit_cost) STORED,

    CONSTRAINT uq_purchase_order_items_variant
        UNIQUE (purchase_order_id, product_variant_id),
    CONSTRAINT chk_purchase_order_items_ordered CHECK (ordered_quantity > 0),
    CONSTRAINT chk_purchase_order_items_received CHECK (
        received_quantity <= ordered_quantity
    ),
    CONSTRAINT chk_purchase_order_items_cost CHECK (unit_cost >= 0),
    CONSTRAINT fk_purchase_order_items_order
        FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_order_items_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE warehouse_inventories (
    warehouse_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    on_hand_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    available_quantity INT
        GENERATED ALWAYS AS (on_hand_quantity - reserved_quantity) STORED,
    reorder_level INT UNSIGNED NOT NULL DEFAULT 0,
    version BIGINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (warehouse_id, product_variant_id),
    CONSTRAINT chk_warehouse_inventories_reserved CHECK (
        reserved_quantity <= on_hand_quantity
    ),
    CONSTRAINT fk_warehouse_inventories_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_warehouse_inventories_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 07 - SALES ORDERS AND IMMUTABLE ORDER SNAPSHOTS
-- ============================================================================

CREATE TABLE orders (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_code VARCHAR(50) NOT NULL,
    idempotency_key_hash BINARY(32) NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    source_channel ENUM('WEB', 'MOBILE', 'ADMIN') NOT NULL DEFAULT 'WEB',
    coupon_id BIGINT UNSIGNED NULL,
    shipping_address_id BIGINT UNSIGNED NULL,
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
    confirmed_at DATETIME NULL,
    completed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    cancelled_by BIGINT UNSIGNED NULL,
    cancel_reason VARCHAR(500) NULL,
    version BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
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
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    color VARCHAR(80) NULL,
    ram VARCHAR(50) NULL,
    storage VARCHAR(50) NULL,
    image_url VARCHAR(500) NULL,
    warranty_months INT UNSIGNED NOT NULL DEFAULT 0,
    unit_price DECIMAL(15,2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(15,2)
        GENERATED ALWAYS AS (unit_price * quantity - discount_amount) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    old_status ENUM(
        'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED',
        'CANCELLED', 'PARTIALLY_RETURNED', 'RETURNED'
    ) NULL,
    new_status ENUM(
        'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED',
        'CANCELLED', 'PARTIALLY_RETURNED', 'RETURNED'
    ) NOT NULL,
    actor_type ENUM('CUSTOMER', 'STAFF', 'SYSTEM') NOT NULL,
    changed_by BIGINT UNSIGNED NULL,
    reason_code VARCHAR(100) NULL,
    note VARCHAR(1000) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    coupon_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    guest_identity_hash BINARY(32) NULL,
    discount_amount DECIMAL(15,2) NOT NULL,
    usage_status ENUM('RESERVED', 'CONSUMED', 'RELEASED')
        NOT NULL DEFAULT 'RESERVED',
    reserved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    consumed_at DATETIME NULL,
    released_at DATETIME NULL,

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
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 08 - STOCK RESERVATION, SERIALIZED UNITS AND INVENTORY LEDGER
-- ============================================================================

CREATE TABLE stock_reservations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    status ENUM('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    expires_at DATETIME NOT NULL,
    consumed_at DATETIME NULL,
    released_at DATETIME NULL,
    release_reason VARCHAR(500) NULL,
    active_reservation_key VARCHAR(100)
        GENERATED ALWAYS AS (
            CASE
                WHEN status = 'ACTIVE'
                THEN CONCAT(order_item_id, ':', warehouse_id)
                ELSE NULL
            END
        ) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_stock_reservations_active UNIQUE (active_reservation_key),
    CONSTRAINT chk_stock_reservations_quantity CHECK (quantity > 0),
    CONSTRAINT chk_stock_reservations_expiry CHECK (expires_at > created_at),
    CONSTRAINT fk_stock_reservations_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_reservations_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_reservations_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_reservations_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE inventory_units (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    purchase_order_item_id BIGINT UNSIGNED NULL,
    current_reservation_id BIGINT UNSIGNED NULL,
    sold_order_item_id BIGINT UNSIGNED NULL,
    unit_status ENUM(
        'AVAILABLE',
        'RESERVED',
        'SOLD',
        'RETURNED',
        'DEFECTIVE',
        'IN_WARRANTY',
        'VOID'
    ) NOT NULL DEFAULT 'AVAILABLE',
    received_at DATETIME NULL,
    sold_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_units_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_inventory_units_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_inventory_units_purchase_item
        FOREIGN KEY (purchase_order_item_id) REFERENCES purchase_order_items(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_inventory_units_reservation
        FOREIGN KEY (current_reservation_id) REFERENCES stock_reservations(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_inventory_units_sold_order_item
        FOREIGN KEY (sold_order_item_id) REFERENCES order_items(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE inventory_unit_identifiers (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    identifier_type ENUM('SERIAL', 'IMEI_1', 'IMEI_2', 'OTHER') NOT NULL,
    identifier_value VARCHAR(100) NOT NULL,
    normalized_identifier VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_inventory_unit_identifiers_value
        UNIQUE (normalized_identifier),
    CONSTRAINT uq_inventory_unit_identifiers_type
        UNIQUE (inventory_unit_id, identifier_type),
    CONSTRAINT chk_inventory_unit_identifiers_not_blank CHECK (
        CHAR_LENGTH(TRIM(normalized_identifier)) > 0
    ),
    CONSTRAINT fk_inventory_unit_identifiers_unit
        FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE stock_transactions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NULL,
    transaction_type ENUM(
        'IMPORT',
        'SALE',
        'RESERVE',
        'RELEASE',
        'CANCEL_ORDER',
        'RETURN_IN',
        'RETURN_OUT',
        'ADJUST_IN',
        'ADJUST_OUT',
        'TRANSFER_IN',
        'TRANSFER_OUT',
        'WARRANTY_OUT',
        'WARRANTY_IN'
    ) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    on_hand_before INT UNSIGNED NOT NULL,
    on_hand_after INT UNSIGNED NOT NULL,
    reserved_before INT UNSIGNED NOT NULL,
    reserved_after INT UNSIGNED NOT NULL,
    reference_type ENUM(
        'PURCHASE_ORDER',
        'SALES_ORDER',
        'STOCK_RESERVATION',
        'RETURN_REQUEST',
        'WARRANTY_CLAIM',
        'STOCK_TRANSFER',
        'MANUAL_ADJUSTMENT'
    ) NOT NULL,
    reference_id BIGINT UNSIGNED NOT NULL,
    reason VARCHAR(500) NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_stock_transactions_quantity CHECK (quantity > 0),
    CONSTRAINT chk_stock_transactions_reserved_before CHECK (
        reserved_before <= on_hand_before
    ),
    CONSTRAINT chk_stock_transactions_reserved_after CHECK (
        reserved_after <= on_hand_after
    ),
    CONSTRAINT fk_stock_transactions_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_transactions_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_transactions_unit
        FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_transactions_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 09 - PAYMENT AGGREGATES, ATTEMPTS AND WEBHOOK IDEMPOTENCY
-- ============================================================================

CREATE TABLE payments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    expected_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    refunded_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM(
        'UNPAID',
        'PARTIALLY_PAID',
        'PAID',
        'PARTIALLY_REFUNDED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'UNPAID',
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_payments_order UNIQUE (order_id),
    CONSTRAINT chk_payments_amounts CHECK (
        expected_amount >= 0
        AND paid_amount >= 0
        AND refunded_amount >= 0
        AND paid_amount <= expected_amount
        AND refunded_amount <= paid_amount
    ),
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payment_attempts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT UNSIGNED NOT NULL,
    attempt_number INT UNSIGNED NOT NULL,
    payment_method ENUM('COD', 'BANK_TRANSFER', 'MOMO', 'VNPAY') NOT NULL,
    provider_code VARCHAR(50) NOT NULL,
    merchant_request_id VARCHAR(100) NOT NULL,
    transaction_code VARCHAR(100) NULL,
    amount DECIMAL(15,2) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED')
        NOT NULL DEFAULT 'PENDING',
    provider_response_code VARCHAR(100) NULL,
    provider_response_message VARCHAR(500) NULL,
    initiated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_payment_attempts_number UNIQUE (payment_id, attempt_number),
    CONSTRAINT uq_payment_attempts_request UNIQUE (merchant_request_id),
    CONSTRAINT uq_payment_attempts_provider_txn
        UNIQUE (provider_code, transaction_code),
    CONSTRAINT chk_payment_attempts_number CHECK (attempt_number > 0),
    CONSTRAINT chk_payment_attempts_amount CHECK (amount > 0),
    CONSTRAINT fk_payment_attempts_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payment_webhook_events (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payment_attempt_id BIGINT UNSIGNED NULL,
    provider_code VARCHAR(50) NOT NULL,
    provider_event_id VARCHAR(150) NOT NULL,
    payload_hash BINARY(32) NOT NULL,
    signature_valid BOOLEAN NOT NULL DEFAULT FALSE,
    processing_status ENUM('RECEIVED', 'PROCESSED', 'REJECTED', 'DUPLICATE')
        NOT NULL DEFAULT 'RECEIVED',
    received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME NULL,
    error_message VARCHAR(1000) NULL,

    CONSTRAINT uq_payment_webhooks_provider_event
        UNIQUE (provider_code, provider_event_id),
    CONSTRAINT fk_payment_webhooks_attempt
        FOREIGN KEY (payment_attempt_id) REFERENCES payment_attempts(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 10 - SHIPMENT AND SPLIT-FULFILLMENT SUPPORT
-- ============================================================================

CREATE TABLE shipments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_code VARCHAR(50) NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    warehouse_id BIGINT UNSIGNED NOT NULL,
    shipping_provider VARCHAR(100) NULL,
    tracking_code VARCHAR(100) NULL,
    shipping_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM(
        'PENDING',
        'PACKING',
        'SHIPPED',
        'IN_TRANSIT',
        'DELIVERED',
        'FAILED',
        'RETURNED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    failure_reason VARCHAR(500) NULL,
    estimated_delivery_at DATETIME NULL,
    shipped_at DATETIME NULL,
    delivered_at DATETIME NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_shipments_code UNIQUE (shipment_code),
    CONSTRAINT uq_shipments_provider_tracking
        UNIQUE (shipping_provider, tracking_code),
    CONSTRAINT chk_shipments_fee CHECK (shipping_fee >= 0),
    CONSTRAINT fk_shipments_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_shipments_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_shipments_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE shipment_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,

    CONSTRAINT uq_shipment_items_order_item UNIQUE (shipment_id, order_item_id),
    CONSTRAINT chk_shipment_items_quantity CHECK (quantity > 0),
    CONSTRAINT fk_shipment_items_shipment
        FOREIGN KEY (shipment_id) REFERENCES shipments(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_shipment_items_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE shipment_item_units (
    shipment_item_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (shipment_item_id, inventory_unit_id),
    CONSTRAINT uq_shipment_item_units_unit UNIQUE (inventory_unit_id),
    CONSTRAINT fk_shipment_item_units_shipment_item
        FOREIGN KEY (shipment_item_id) REFERENCES shipment_items(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_shipment_item_units_inventory_unit
        FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 11 - VERIFIED REVIEWS AND MODERATION
-- ============================================================================

CREATE TABLE reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    title VARCHAR(255) NULL,
    comment TEXT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    moderated_by BIGINT UNSIGNED NULL,
    moderated_at DATETIME NULL,
    rejection_reason VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_reviews_customer_order_item UNIQUE (customer_id, order_item_id),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_reviews_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_reviews_moderated_by
        FOREIGN KEY (moderated_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 12 - WARRANTY CERTIFICATES AND WARRANTY CLAIMS
-- ============================================================================

CREATE TABLE warranties (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    warranty_code VARCHAR(100) NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    owner_name VARCHAR(150) NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    owner_email VARCHAR(254) NULL,
    covered_quantity INT UNSIGNED NOT NULL DEFAULT 1,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'VOID') NOT NULL DEFAULT 'ACTIVE',
    void_reason VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_warranties_code UNIQUE (warranty_code),
    CONSTRAINT uq_warranties_inventory_unit UNIQUE (inventory_unit_id),
    CONSTRAINT chk_warranties_quantity CHECK (covered_quantity > 0),
    CONSTRAINT chk_warranties_period CHECK (ends_at >= starts_at),
    CONSTRAINT chk_warranties_serialized_quantity CHECK (
        inventory_unit_id IS NULL OR covered_quantity = 1
    ),
    CONSTRAINT fk_warranties_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_inventory_unit
        FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE warranty_claims (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    claim_code VARCHAR(100) NOT NULL,
    warranty_id BIGINT UNSIGNED NOT NULL,
    issue_description TEXT NOT NULL,
    status ENUM(
        'SUBMITTED',
        'RECEIVED',
        'INSPECTING',
        'REPAIRING',
        'WAITING_PARTS',
        'COMPLETED',
        'REJECTED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'SUBMITTED',
    resolution TEXT NULL,
    rejection_reason VARCHAR(500) NULL,
    received_by BIGINT UNSIGNED NULL,
    received_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_warranty_claims_code UNIQUE (claim_code),
    CONSTRAINT fk_warranty_claims_warranty
        FOREIGN KEY (warranty_id) REFERENCES warranties(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_warranty_claims_received_by
        FOREIGN KEY (received_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 13 - RETURNS, EXCHANGES AND REFUNDS
-- ============================================================================

CREATE TABLE return_requests (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    return_code VARCHAR(100) NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    requester_name VARCHAR(150) NOT NULL,
    requester_phone VARCHAR(20) NOT NULL,
    requester_email VARCHAR(254) NULL,
    return_type ENUM('REFUND', 'EXCHANGE') NOT NULL DEFAULT 'REFUND',
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'IN_TRANSIT',
        'RECEIVED',
        'INSPECTING',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    reason TEXT NOT NULL,
    total_refund_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    replacement_order_id BIGINT UNSIGNED NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    rejection_reason VARCHAR(500) NULL,
    received_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_return_requests_code UNIQUE (return_code),
    CONSTRAINT chk_return_requests_refund CHECK (total_refund_amount >= 0),
    CONSTRAINT chk_return_requests_replacement CHECK (
        return_type = 'EXCHANGE' OR replacement_order_id IS NULL
    ),
    CONSTRAINT fk_return_requests_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_return_requests_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_return_requests_replacement_order
        FOREIGN KEY (replacement_order_id) REFERENCES orders(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_return_requests_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE return_request_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    return_request_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    reason VARCHAR(1000) NULL,
    condition_status ENUM(
        'UNOPENED',
        'OPENED',
        'DAMAGED',
        'DEFECTIVE',
        'WRONG_ITEM',
        'OTHER'
    ) NULL,
    resolution ENUM('RESTOCK', 'DEFECTIVE', 'REPAIR', 'SCRAP', 'EXCHANGE') NULL,
    refund_amount DECIMAL(15,2) NOT NULL DEFAULT 0,

    CONSTRAINT uq_return_request_items_order_item
        UNIQUE (return_request_id, order_item_id),
    CONSTRAINT chk_return_request_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_return_request_items_refund CHECK (refund_amount >= 0),
    CONSTRAINT fk_return_request_items_request
        FOREIGN KEY (return_request_id) REFERENCES return_requests(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_return_request_items_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE return_item_units (
    return_request_item_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    condition_status ENUM(
        'UNOPENED',
        'OPENED',
        'DAMAGED',
        'DEFECTIVE',
        'WRONG_ITEM',
        'OTHER'
    ) NULL,
    resolution ENUM('RESTOCK', 'DEFECTIVE', 'REPAIR', 'SCRAP', 'EXCHANGE') NULL,
    inspection_note VARCHAR(1000) NULL,
    PRIMARY KEY (return_request_item_id, inventory_unit_id),
    CONSTRAINT uq_return_item_units_inventory_unit UNIQUE (inventory_unit_id),
    CONSTRAINT fk_return_item_units_return_item
        FOREIGN KEY (return_request_item_id) REFERENCES return_request_items(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_return_item_units_inventory_unit
        FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE refunds (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    refund_code VARCHAR(100) NOT NULL,
    payment_id BIGINT UNSIGNED NOT NULL,
    payment_attempt_id BIGINT UNSIGNED NULL,
    return_request_id BIGINT UNSIGNED NULL,
    idempotency_key_hash BINARY(32) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    refund_method ENUM('ORIGINAL_PAYMENT', 'BANK_TRANSFER', 'CASH') NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED')
        NOT NULL DEFAULT 'PENDING',
    provider_refund_code VARCHAR(150) NULL,
    reason VARCHAR(500) NOT NULL,
    requested_by BIGINT UNSIGNED NULL,
    approved_by BIGINT UNSIGNED NULL,
    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME NULL,
    completed_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_refunds_code UNIQUE (refund_code),
    CONSTRAINT uq_refunds_idempotency UNIQUE (idempotency_key_hash),
    CONSTRAINT uq_refunds_provider_code UNIQUE (provider_refund_code),
    CONSTRAINT chk_refunds_amount CHECK (amount > 0),
    CONSTRAINT chk_refunds_original_attempt CHECK (
        refund_method <> 'ORIGINAL_PAYMENT' OR payment_attempt_id IS NOT NULL
    ),
    CONSTRAINT fk_refunds_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_payment_attempt
        FOREIGN KEY (payment_attempt_id) REFERENCES payment_attempts(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_return_request
        FOREIGN KEY (return_request_id) REFERENCES return_requests(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_requested_by
        FOREIGN KEY (requested_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_approved_by
        FOREIGN KEY (approved_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 14 - NOTIFICATIONS, CONTENT AND AUDIT TRAIL
-- ============================================================================

CREATE TABLE notifications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    entity_type VARCHAR(50) NULL,
    entity_id BIGINT UNSIGNED NULL,
    action_url VARCHAR(500) NULL,
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE notification_deliveries (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    notification_id BIGINT UNSIGNED NOT NULL,
    channel ENUM('IN_APP', 'EMAIL', 'SMS', 'PUSH') NOT NULL,
    destination VARCHAR(254) NULL,
    status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    attempt_count INT UNSIGNED NOT NULL DEFAULT 0,
    last_error VARCHAR(1000) NULL,
    last_attempt_at DATETIME NULL,
    sent_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_notification_deliveries_channel
        UNIQUE (notification_id, channel),
    CONSTRAINT fk_notification_deliveries_notification
        FOREIGN KEY (notification_id) REFERENCES notifications(id)
        ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE banners (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500) NULL,
    position VARCHAR(50) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    starts_at DATETIME NULL,
    ends_at DATETIME NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_banners_sort_order CHECK (sort_order >= 0),
    CONSTRAINT chk_banners_schedule CHECK (
        starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at
    ),
    CONSTRAINT fk_banners_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    actor_user_id BIGINT UNSIGNED NULL,
    action_code VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    old_data JSON NULL,
    new_data JSON NULL,
    result ENUM('SUCCESS', 'FAILURE') NOT NULL DEFAULT 'SUCCESS',
    correlation_id VARCHAR(100) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_actor
        FOREIGN KEY (actor_user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 15 - QUERY-DRIVEN INDEXES
-- Unique constraints and foreign-key indexes are not duplicated here.
-- Verify these indexes with EXPLAIN ANALYZE using production-like data.
-- ============================================================================

CREATE INDEX idx_users_status_created
    ON users(account_status, created_at);
CREATE INDEX idx_users_deleted_at
    ON users(deleted_at);
CREATE INDEX idx_staff_profiles_position_status
    ON staff_profiles(position_id, employment_status);
CREATE INDEX idx_refresh_tokens_user_expiry
    ON refresh_tokens(user_id, expires_at, revoked_at);
CREATE INDEX idx_user_roles_user_status
    ON user_roles(user_id, assignment_status, expires_at);

CREATE INDEX idx_categories_parent_status_sort
    ON categories(parent_id, status, sort_order);
CREATE INDEX idx_products_catalog_newest
    ON products(category_id, publication_status, created_at);
CREATE INDEX idx_products_brand_newest
    ON products(brand_id, publication_status, created_at);
CREATE INDEX idx_products_popular
    ON products(publication_status, sold_count, view_count);
CREATE INDEX idx_product_variants_product_status_price
    ON product_variants(product_id, status, sale_price, list_price);
CREATE INDEX idx_product_attributes_filter
    ON product_attributes(attribute_name, attribute_value, product_id);
CREATE INDEX idx_product_price_history_variant_time
    ON product_price_histories(product_variant_id, effective_at);

CREATE INDEX idx_carts_guest_activity
    ON carts(guest_token_hash, last_activity_at);
CREATE INDEX idx_cart_items_cart
    ON cart_items(cart_id, updated_at);
CREATE INDEX idx_shipping_addresses_customer_active
    ON shipping_addresses(customer_id, deleted_at, is_default);
CREATE INDEX idx_coupons_active_period
    ON coupons(status, starts_at, ends_at);
CREATE INDEX idx_coupon_usages_customer_coupon
    ON coupon_usages(customer_id, coupon_id, usage_status, reserved_at);
CREATE INDEX idx_coupon_usages_guest_coupon
    ON coupon_usages(guest_identity_hash, coupon_id, usage_status, reserved_at);

CREATE INDEX idx_purchase_orders_supplier_status
    ON purchase_orders(supplier_id, status, created_at);
CREATE INDEX idx_purchase_orders_warehouse_status
    ON purchase_orders(warehouse_id, status, created_at);
CREATE INDEX idx_warehouse_inventory_reorder
    ON warehouse_inventories(warehouse_id, available_quantity, reorder_level);
CREATE INDEX idx_inventory_units_variant_status
    ON inventory_units(product_variant_id, warehouse_id, unit_status);
-- The unique normalized_identifier index also serves serial/IMEI lookup.
CREATE INDEX idx_stock_transactions_variant_time
    ON stock_transactions(product_variant_id, warehouse_id, created_at);
CREATE INDEX idx_stock_transactions_reference
    ON stock_transactions(reference_type, reference_id);

CREATE INDEX idx_orders_customer_history
    ON orders(customer_id, created_at, status);
CREATE INDEX idx_orders_operational_queue
    ON orders(status, created_at);
CREATE INDEX idx_orders_contact_phone
    ON orders(contact_phone, created_at);
CREATE INDEX idx_order_status_history_order_time
    ON order_status_histories(order_id, created_at);
CREATE INDEX idx_stock_reservations_expiry
    ON stock_reservations(status, expires_at);

CREATE INDEX idx_payment_attempts_payment_status
    ON payment_attempts(payment_id, status, initiated_at);
CREATE INDEX idx_payment_webhooks_status_time
    ON payment_webhook_events(processing_status, received_at);
CREATE INDEX idx_shipments_order_status
    ON shipments(order_id, status, created_at);
CREATE INDEX idx_shipments_tracking
    ON shipments(tracking_code);

CREATE INDEX idx_reviews_product_status_time
    ON reviews(product_id, status, created_at);
CREATE INDEX idx_warranties_customer_status
    ON warranties(customer_id, status, ends_at);
CREATE INDEX idx_warranty_claims_status_time
    ON warranty_claims(status, created_at);
CREATE INDEX idx_return_requests_order_status
    ON return_requests(order_id, status, created_at);
CREATE INDEX idx_return_requests_customer_time
    ON return_requests(customer_id, created_at);
CREATE INDEX idx_refunds_payment_status
    ON refunds(payment_id, status, requested_at);

CREATE INDEX idx_notifications_user_unread
    ON notifications(user_id, read_at, created_at);
CREATE INDEX idx_notification_deliveries_retry
    ON notification_deliveries(status, last_attempt_at, attempt_count);
CREATE INDEX idx_banners_position_active
    ON banners(position, status, starts_at, ends_at, sort_order);
CREATE INDEX idx_audit_logs_actor_time
    ON audit_logs(actor_user_id, created_at);
CREATE INDEX idx_audit_logs_entity_time
    ON audit_logs(entity_type, entity_id, created_at);
CREATE INDEX idx_audit_logs_action_time
    ON audit_logs(action_code, created_at);

-- Optional full-text search for product name and descriptions.
CREATE FULLTEXT INDEX ftx_products_search
    ON products(name, short_description, description);

-- ============================================================================
-- REGION 16 - SAFE SYSTEM SEED DATA
-- No default user/password is inserted. Bootstrap SUPER_ADMIN in application.
-- ============================================================================

INSERT INTO departments (code, name, description) VALUES
('OPERATIONS', 'Operations', 'Order and fulfillment operations'),
('WAREHOUSE', 'Warehouse', 'Inventory and warehouse operations'),
('CUSTOMER_SERVICE', 'Customer Service', 'Customer support and after-sales'),
('IT', 'Information Technology', 'System administration and technology');

INSERT INTO positions (department_id, code, name, description)
SELECT id, 'ORDER_OPERATOR', 'Order Operator', 'Processes customer orders'
FROM departments WHERE code = 'OPERATIONS';

INSERT INTO positions (department_id, code, name, description)
SELECT id, 'WAREHOUSE_OFFICER', 'Warehouse Officer', 'Handles stock operations'
FROM departments WHERE code = 'WAREHOUSE';

INSERT INTO positions (department_id, code, name, description)
SELECT id, 'CUSTOMER_SUPPORT', 'Customer Support Officer', 'Handles customer requests'
FROM departments WHERE code = 'CUSTOMER_SERVICE';

INSERT INTO positions (department_id, code, name, description)
SELECT id, 'SYSTEM_ADMINISTRATOR', 'System Administrator', 'Administers the platform'
FROM departments WHERE code = 'IT';

INSERT INTO roles (code, name, description, role_type) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Protected root administrator role', 'SYSTEM'),
('ADMIN', 'Administrator', 'Business administrator role', 'SYSTEM'),
('STAFF', 'Staff', 'Base employee role', 'SYSTEM'),
('CUSTOMER', 'Customer', 'Registered customer role', 'SYSTEM');

INSERT INTO permissions (code, module, name, description, is_sensitive) VALUES
('USER_VIEW', 'IDENTITY', 'View users', 'View user accounts and profiles', FALSE),
('USER_UPDATE', 'IDENTITY', 'Update users', 'Update user account information', TRUE),
('USER_DISABLE', 'IDENTITY', 'Disable users', 'Disable or lock user accounts', TRUE),
('STAFF_CREATE', 'IDENTITY', 'Create staff', 'Create staff accounts and profiles', TRUE),
('STAFF_UPDATE', 'IDENTITY', 'Update staff', 'Update staff employment profiles', TRUE),
('DEPARTMENT_MANAGE', 'ORGANIZATION', 'Manage departments', 'Create and update departments', TRUE),
('POSITION_MANAGE', 'ORGANIZATION', 'Manage positions', 'Create and update staff positions', TRUE),
('ROLE_VIEW', 'RBAC', 'View roles', 'View roles and assignments', FALSE),
('ROLE_CREATE', 'RBAC', 'Create roles', 'Create custom roles', TRUE),
('ROLE_UPDATE', 'RBAC', 'Update roles', 'Update custom role permissions', TRUE),
('ROLE_DISABLE', 'RBAC', 'Disable roles', 'Disable custom roles', TRUE),
('ROLE_ASSIGN', 'RBAC', 'Assign roles', 'Assign or revoke user roles', TRUE),
('PRODUCT_VIEW', 'CATALOG', 'View products', 'View catalog administration data', FALSE),
('PRODUCT_CREATE', 'CATALOG', 'Create products', 'Create products and variants', FALSE),
('PRODUCT_UPDATE', 'CATALOG', 'Update products', 'Update products, variants and prices', FALSE),
('PRODUCT_ARCHIVE', 'CATALOG', 'Archive products', 'Archive products and variants', TRUE),
('ORDER_VIEW', 'ORDER', 'View orders', 'View customer orders', FALSE),
('ORDER_CONFIRM', 'ORDER', 'Confirm orders', 'Confirm pending orders', FALSE),
('ORDER_CANCEL', 'ORDER', 'Cancel orders', 'Cancel eligible orders', TRUE),
('ORDER_STATUS_UPDATE', 'ORDER', 'Update order status', 'Move orders through fulfillment', FALSE),
('STOCK_VIEW', 'INVENTORY', 'View stock', 'View inventory balances and history', FALSE),
('STOCK_IMPORT', 'INVENTORY', 'Import stock', 'Receive approved purchase orders', FALSE),
('STOCK_EXPORT', 'INVENTORY', 'Export stock', 'Export stock for valid operations', TRUE),
('STOCK_ADJUST', 'INVENTORY', 'Adjust stock', 'Perform audited stock adjustments', TRUE),
('PURCHASE_ORDER_CREATE', 'PROCUREMENT', 'Create purchase orders', 'Create purchase orders', FALSE),
('PURCHASE_ORDER_APPROVE', 'PROCUREMENT', 'Approve purchase orders', 'Approve purchase orders', TRUE),
('PAYMENT_VIEW', 'PAYMENT', 'View payments', 'View payment attempts and statuses', TRUE),
('REFUND_CREATE', 'PAYMENT', 'Create refunds', 'Request a customer refund', TRUE),
('REFUND_APPROVE', 'PAYMENT', 'Approve refunds', 'Approve and execute refunds', TRUE),
('SHIPMENT_MANAGE', 'SHIPMENT', 'Manage shipments', 'Create and update shipments', FALSE),
('REVIEW_MODERATE', 'REVIEW', 'Moderate reviews', 'Approve or reject reviews', FALSE),
('RETURN_VIEW', 'RETURN', 'View returns', 'View return requests', FALSE),
('RETURN_APPROVE', 'RETURN', 'Approve returns', 'Approve or reject returns', TRUE),
('WARRANTY_MANAGE', 'WARRANTY', 'Manage warranties', 'Manage warranty claims', FALSE),
('COUPON_MANAGE', 'PROMOTION', 'Manage coupons', 'Create and update coupons', FALSE),
('BANNER_MANAGE', 'CONTENT', 'Manage banners', 'Create and schedule banners', FALSE),
('REPORT_VIEW_SALES', 'REPORT', 'View sales reports', 'View sales reports', TRUE),
('REPORT_VIEW_INVENTORY', 'REPORT', 'View inventory reports', 'View stock reports', TRUE),
('AUDIT_LOG_VIEW', 'AUDIT', 'View audit logs', 'View administrative audit logs', TRUE);

-- SUPER_ADMIN receives every active permission.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN' AND p.status = 'ACTIVE';

-- ADMIN receives all current business permissions. Application rules must still
-- prevent ADMIN from changing SYSTEM roles or granting SUPER_ADMIN.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'ADMIN' AND p.status = 'ACTIVE';

-- CUSTOMER is intentionally not granted administrative permissions here.
-- Customer access is enforced by authenticated endpoints plus record ownership.

INSERT INTO categories (name, slug, description, sort_order) VALUES
('Điện thoại', 'dien-thoai', 'Các dòng điện thoại thông minh', 1),
('Máy tính bảng', 'may-tinh-bang', 'Các dòng máy tính bảng', 2),
('Phụ kiện', 'phu-kien', 'Phụ kiện điện thoại và thiết bị di động', 3);

INSERT INTO brands (name, slug, description) VALUES
('Apple', 'apple', 'Thương hiệu Apple'),
('Samsung', 'samsung', 'Thương hiệu Samsung'),
('Xiaomi', 'xiaomi', 'Thương hiệu Xiaomi'),
('OPPO', 'oppo', 'Thương hiệu OPPO');

INSERT INTO warehouses (code, name, address) VALUES
('CENTRAL', 'Central Warehouse', 'Default central warehouse');

-- ============================================================================
-- END OF SCHEMA
-- Application-level invariants that span multiple tables must be executed in
-- one transaction and are documented in the accompanying architecture guide.
-- ============================================================================

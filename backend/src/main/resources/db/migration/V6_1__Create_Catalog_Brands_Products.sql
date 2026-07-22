-- ============================================================================
-- V6.1: CATALOG SCHEMA (BRANDS, PRODUCTS, VARIANTS, etc.)
-- ============================================================================

-- 1. BRANDS
CREATE TABLE brands (
    id BINARY(16) NOT NULL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(180) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    INDEX idx_brand_slug (slug),
    INDEX idx_brand_status (status)
) ENGINE=InnoDB;

-- 2. PRODUCTS
CREATE TABLE products (
    id BINARY(16) NOT NULL PRIMARY KEY,
    category_id BINARY(16) NOT NULL,
    brand_id BINARY(16) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    description TEXT,
    publication_status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    sold_count BIGINT NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    INDEX idx_product_slug (slug),
    INDEX idx_product_status (publication_status),
    INDEX idx_product_category (category_id),
    INDEX idx_product_brand (brand_id)
) ENGINE=InnoDB;

-- 3. PRODUCT SPECIFICATIONS
CREATE TABLE product_specifications (
    id BINARY(16) NOT NULL PRIMARY KEY,
    product_id BINARY(16) NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    spec_name VARCHAR(150) NOT NULL,
    spec_value VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_specs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT uq_spec_product_group_name UNIQUE (product_id, group_name, spec_name),
    INDEX idx_spec_product (product_id)
) ENGINE=InnoDB;

-- 4. PRODUCT ATTRIBUTES
CREATE TABLE product_attributes (
    id BINARY(16) NOT NULL PRIMARY KEY,
    product_id BINARY(16) NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    CONSTRAINT fk_attrs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT uq_attr_product_name_value UNIQUE (product_id, attribute_name, attribute_value),
    INDEX idx_attr_product (product_id),
    INDEX idx_attr_name_value (attribute_name, attribute_value)
) ENGINE=InnoDB;

-- 5. PRODUCT VARIANTS
CREATE TABLE product_variants (
    id BINARY(16) NOT NULL PRIMARY KEY,
    product_id BINARY(16) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(100),
    ram_gb INT,
    storage_gb INT,
    tracking_type VARCHAR(50) NOT NULL DEFAULT 'NONE',
    warranty_months INT,
    list_price DECIMAL(18,2) NOT NULL,
    sale_price DECIMAL(18,2),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    INDEX idx_variant_sku (sku),
    INDEX idx_variant_product (product_id),
    INDEX idx_variant_status (status)
) ENGINE=InnoDB;

-- 6. PRODUCT IMAGES
CREATE TABLE product_images (
    id BINARY(16) NOT NULL PRIMARY KEY,
    variant_id BINARY(16) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_images_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    INDEX idx_image_variant (variant_id),
    INDEX idx_image_primary (variant_id, is_primary)
) ENGINE=InnoDB;

-- 7. PRODUCT PRICE HISTORIES
CREATE TABLE product_price_histories (
    id BINARY(16) NOT NULL PRIMARY KEY,
    variant_id BINARY(16) NOT NULL,
    old_list_price DECIMAL(18,2),
    new_list_price DECIMAL(18,2) NOT NULL,
    old_sale_price DECIMAL(18,2),
    new_sale_price DECIMAL(18,2),
    reason VARCHAR(500),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prices_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    INDEX idx_price_history_variant (variant_id)
) ENGINE=InnoDB;

-- V2__Create_Catalog_Category.sql
-- Khởi tạo bảng danh mục sản phẩm (categories) sử dụng UUID binary(16) thống nhất với BaseEntity của hệ thống.

CREATE TABLE categories (
    id BINARY(16) NOT NULL PRIMARY KEY,
    parent_id BINARY(16) NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent_status_sort (parent_id, status, sort_order)
) ENGINE=InnoDB;

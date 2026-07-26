-- Phase 4: Customer Customization Schema

CREATE TABLE wishlist_items (
    id BINARY(16) PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    created_by VARCHAR(50) NULL,
    updated_by VARCHAR(50) NULL,
    
    CONSTRAINT uk_wishlist_customer_product UNIQUE (customer_id, product_id),
    CONSTRAINT fk_wishlist_items_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_wishlist_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

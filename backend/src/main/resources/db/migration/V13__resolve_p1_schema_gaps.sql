-- Phase 5: P1 Module Schema Extensions (Reviews, Banners, Notifications, Compare, Sessions, Audit Enhancements)

-- 1. Compare Items
CREATE TABLE compare_items (
    id BINARY(16) PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_compare_customer_product UNIQUE (customer_id, product_id),
    CONSTRAINT fk_compare_items_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_compare_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- 2. Token Families (Session Metadata)
CREATE TABLE token_families (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    device_name VARCHAR(150),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_families_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Password Histories
CREATE TABLE user_password_histories (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_pw_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE users ADD COLUMN password_changed_at DATETIME NULL AFTER password_hash;

-- 4. Banners
CREATE TABLE banners (
    id BINARY(16) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    position VARCHAR(50) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'INACTIVE',
    starts_at DATETIME NULL,
    ends_at DATETIME NULL,
    version INT NOT NULL DEFAULT 1,
    created_by BINARY(16) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_banners_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Reviews and Summaries
CREATE TABLE reviews (
    id BINARY(16) PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,
    order_item_id BINARY(16) NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    moderated_by BINARY(16) NULL,
    moderated_at DATETIME NULL,
    rejection_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT uk_reviews_customer_order_item UNIQUE (customer_id, order_item_id),
    CONSTRAINT fk_reviews_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_moderator FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE review_status_histories (
    id BINARY(16) PRIMARY KEY,
    review_id BINARY(16) NOT NULL,
    old_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NOT NULL,
    actor_id BINARY(16) NULL,
    reason VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rsh_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_rating_summaries (
    product_id BINARY(16) PRIMARY KEY,
    approved_review_count INT NOT NULL DEFAULT 0,
    average_rating DECIMAL(3,2) NULL,
    rating_1_count INT NOT NULL DEFAULT 0,
    rating_2_count INT NOT NULL DEFAULT 0,
    rating_3_count INT NOT NULL DEFAULT 0,
    rating_4_count INT NOT NULL DEFAULT 0,
    rating_5_count INT NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Notifications
CREATE TABLE notifications (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    notification_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(50),
    action_url VARCHAR(500),
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notification_deliveries (
    id BINARY(16) PRIMARY KEY,
    notification_id BINARY(16) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    destination VARCHAR(255) NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    last_attempt_at DATETIME NULL,
    next_attempt_at DATETIME NULL,
    last_error TEXT NULL,
    provider_message_id VARCHAR(100) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nd_notification FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Audit Enhancements
ALTER TABLE audit_logs 
    ADD COLUMN actor_id BINARY(16) NULL AFTER actor_username,
    ADD COLUMN actor_type VARCHAR(50) NULL AFTER actor_id;

-- 8. Related Products
CREATE TABLE related_products (
    source_product_id BINARY(16) NOT NULL,
    target_product_id BINARY(16) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(source_product_id, target_product_id),
    CONSTRAINT fk_related_source FOREIGN KEY (source_product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_related_target FOREIGN KEY (target_product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Add Permissions for Notifications
INSERT INTO permissions (id, code, module, description, status) VALUES 
(UNHEX(REPLACE(UUID(), '-', '')), 'NOTIFICATION_VIEW', 'NOTIFICATION', 'Read delivery queues', 'ACTIVE'),
(UNHEX(REPLACE(UUID(), '-', '')), 'NOTIFICATION_RETRY', 'NOTIFICATION', 'Retry failed deliveries', 'ACTIVE');

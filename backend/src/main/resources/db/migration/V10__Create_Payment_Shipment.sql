-- Phase 2: Payment, Webhook, and Shipment Fulfillment Schema

-- ============================================================================
-- REGION 1: PAYMENT
-- ============================================================================

CREATE TABLE payments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BINARY(16) NOT NULL UNIQUE,
    expected_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    refunded_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'UNPAID',
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payment_attempts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT UNSIGNED NOT NULL,
    merchant_request_id VARCHAR(100) NOT NULL UNIQUE, -- Idempotency Key
    attempt_number INT UNSIGNED NOT NULL,
    method ENUM('COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER', 'MANUAL') NOT NULL,
    provider_code VARCHAR(50) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(15,2) NOT NULL,
    provider_transaction_id VARCHAR(100) NULL,
    provider_response_code VARCHAR(50) NULL,
    provider_message VARCHAR(255) NULL,
    created_by BINARY(16) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_payment_attempts_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_payment_attempts_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payment_webhook_events (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    provider_code VARCHAR(50) NOT NULL,
    provider_event_id VARCHAR(100) NOT NULL,
    payload_hash BINARY(32) NOT NULL,
    status ENUM('RECEIVED', 'PROCESSED', 'REJECTED', 'ERROR') NOT NULL DEFAULT 'RECEIVED',
    payment_attempt_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_payment_webhook_events UNIQUE (provider_code, provider_event_id),
    CONSTRAINT fk_payment_webhook_events_attempt FOREIGN KEY (payment_attempt_id) REFERENCES payment_attempts(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 2: SHIPMENT AND FULFILLMENT
-- ============================================================================

CREATE TABLE shipments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_code VARCHAR(100) NOT NULL UNIQUE,
    order_id BINARY(16) NOT NULL,
    warehouse_id BINARY(16) NOT NULL,
    shipping_provider VARCHAR(100) NULL,
    tracking_code VARCHAR(100) NULL,
    status ENUM('PENDING', 'PACKING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    shipping_fee DECIMAL(15,2) NULL,
    estimated_delivery_at DATETIME NULL,
    shipped_at DATETIME NULL,
    delivered_at DATETIME NULL,
    created_by BINARY(16) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_shipments_provider_tracking UNIQUE (shipping_provider, tracking_code),
    CONSTRAINT fk_shipments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_shipments_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_shipments_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE shipment_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_id BIGINT UNSIGNED NOT NULL,
    order_item_id BINARY(16) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    
    CONSTRAINT uq_shipment_items_order_item UNIQUE (shipment_id, order_item_id),
    CONSTRAINT chk_shipment_items_quantity CHECK (quantity > 0),
    CONSTRAINT fk_shipment_items_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_shipment_items_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE shipment_item_units (
    shipment_item_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (shipment_item_id, inventory_unit_id),
    CONSTRAINT uq_shipment_item_units_unit UNIQUE (inventory_unit_id),
    CONSTRAINT fk_shipment_item_units_shipment_item FOREIGN KEY (shipment_item_id) REFERENCES shipment_items(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_shipment_item_units_inventory_unit FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

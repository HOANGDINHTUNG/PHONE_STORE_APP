-- Phase 3: Warranty, Return, and Refund Schema

-- ============================================================================
-- REGION 1: WARRANTIES AND CLAIMS
-- ============================================================================

CREATE TABLE warranties (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    warranty_code VARCHAR(100) NOT NULL UNIQUE,
    order_id BINARY(16) NOT NULL,
    order_item_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NULL, -- Null if QUANTITY SKU
    customer_id BINARY(16) NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    customer_email VARCHAR(150) NULL,
    covered_quantity INT UNSIGNED NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'VOID') NOT NULL DEFAULT 'ACTIVE',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_warranties_unit UNIQUE (inventory_unit_id),
    CONSTRAINT fk_warranties_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_unit FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_warranties_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE warranty_claims (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    warranty_id BIGINT UNSIGNED NOT NULL,
    claim_code VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('SUBMITTED', 'RECEIVED', 'INSPECTING', 'REPAIRING', 'WAITING_PARTS', 'COMPLETED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
    issue_description TEXT NOT NULL,
    resolution VARCHAR(255) NULL,
    rejection_reason VARCHAR(255) NULL,
    received_by BINARY(16) NULL,
    received_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_warranty_claims_warranty FOREIGN KEY (warranty_id) REFERENCES warranties(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_warranty_claims_received_by FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- ============================================================================
-- REGION 2: RETURNS AND REFUNDS
-- ============================================================================

CREATE TABLE return_requests (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    return_code VARCHAR(100) NOT NULL UNIQUE,
    order_id BINARY(16) NOT NULL,
    customer_id BINARY(16) NULL,
    type ENUM('REFUND', 'EXCHANGE') NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'INSPECTING', 'COMPLETED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    total_refund_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    replacement_order_id BINARY(16) NULL,
    reviewer_id BINARY(16) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_return_requests_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_return_requests_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_return_requests_replacement FOREIGN KEY (replacement_order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_return_requests_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE return_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    return_request_id BIGINT UNSIGNED NOT NULL,
    order_item_id BINARY(16) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    reason VARCHAR(255) NOT NULL,
    refund_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    condition_note VARCHAR(255) NULL,
    resolution ENUM('RESTOCK', 'DEFECTIVE', 'REPAIR', 'SCRAP', 'EXCHANGE', 'PENDING') NOT NULL DEFAULT 'PENDING',
    
    CONSTRAINT chk_return_items_quantity CHECK (quantity > 0),
    CONSTRAINT fk_return_items_request FOREIGN KEY (return_request_id) REFERENCES return_requests(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_return_items_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE return_item_units (
    return_item_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (return_item_id, inventory_unit_id),
    CONSTRAINT uq_return_item_units_unit UNIQUE (inventory_unit_id),
    CONSTRAINT fk_return_item_units_return_item FOREIGN KEY (return_item_id) REFERENCES return_items(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_return_item_units_inventory_unit FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE refunds (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    refund_code VARCHAR(100) NOT NULL UNIQUE,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    payment_id BIGINT UNSIGNED NOT NULL,
    payment_attempt_id BIGINT UNSIGNED NULL,
    return_request_id BIGINT UNSIGNED NULL,
    amount DECIMAL(15,2) NOT NULL,
    method ENUM('ORIGINAL_PAYMENT', 'BANK_TRANSFER', 'CASH', 'WALLET') NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    reason VARCHAR(255) NOT NULL,
    provider_refund_code VARCHAR(100) NULL,
    requester_id BINARY(16) NOT NULL,
    approver_id BINARY(16) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_refunds_amount CHECK (amount > 0),
    CONSTRAINT uq_refunds_provider_code UNIQUE (provider_refund_code),
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_attempt FOREIGN KEY (payment_attempt_id) REFERENCES payment_attempts(id) ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_return FOREIGN KEY (return_request_id) REFERENCES return_requests(id) ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_refunds_approver FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

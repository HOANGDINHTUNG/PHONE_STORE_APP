CREATE TABLE warehouses (
    id BINARY(16) NOT NULL PRIMARY KEY,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    CONSTRAINT uq_warehouses_code UNIQUE (code),
    CONSTRAINT uq_warehouses_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE suppliers (
    id BINARY(16) NOT NULL PRIMARY KEY,
    supplier_code VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(50) NULL,
    contact_name VARCHAR(150) NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(254) NULL,
    address VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,

    CONSTRAINT uq_suppliers_code UNIQUE (supplier_code),
    CONSTRAINT uq_suppliers_tax_code UNIQUE (tax_code)
) ENGINE=InnoDB;

CREATE TABLE purchase_orders (
    id BINARY(16) NOT NULL PRIMARY KEY,
    purchase_order_code VARCHAR(50) NOT NULL,
    supplier_id BINARY(16) NOT NULL,
    warehouse_id BINARY(16) NOT NULL,
    status ENUM(
        'DRAFT',
        'PENDING_APPROVAL',
        'APPROVED',
        'PARTIALLY_RECEIVED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'DRAFT',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    expected_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    approved_by BINARY(16) NULL,
    approved_at TIMESTAMP NULL,
    received_by BINARY(16) NULL,
    received_at TIMESTAMP NULL,
    cancelled_by BINARY(16) NULL,
    cancelled_at TIMESTAMP NULL,
    cancel_reason VARCHAR(500) NULL,
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NULL,

    CONSTRAINT uq_purchase_orders_code UNIQUE (purchase_order_code),
    CONSTRAINT chk_purchase_orders_total CHECK (total_amount >= 0),
    CONSTRAINT fk_purchase_orders_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_purchase_orders_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
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
    purchase_order_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
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
    warehouse_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    on_hand_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    available_quantity INT
        GENERATED ALWAYS AS (on_hand_quantity - reserved_quantity) STORED,
    reorder_level INT UNSIGNED NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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

CREATE TABLE stock_reservations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BINARY(16) NOT NULL,
    order_item_id BINARY(16) NOT NULL,
    warehouse_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    status ENUM('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    expires_at DATETIME NOT NULL,
    consumed_at TIMESTAMP NULL,
    released_at TIMESTAMP NULL,
    release_reason VARCHAR(500) NULL,
    active_reservation_key VARCHAR(100)
        GENERATED ALWAYS AS (
            CASE
                WHEN status = 'ACTIVE'
                THEN CONCAT(order_item_id, ':', warehouse_id)
                ELSE NULL
            END
        ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_stock_reservations_active UNIQUE (active_reservation_key),
    CONSTRAINT chk_stock_reservations_quantity CHECK (quantity > 0),
    CONSTRAINT chk_stock_reservations_expiry CHECK (expires_at > created_at),
    CONSTRAINT fk_stock_reservations_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_stock_reservations_variant
        FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE inventory_units (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_variant_id BINARY(16) NOT NULL,
    warehouse_id BINARY(16) NOT NULL,
    purchase_order_item_id BIGINT UNSIGNED NULL,
    current_reservation_id BIGINT UNSIGNED NULL,
    sold_order_item_id BINARY(16) NULL,
    unit_status ENUM(
        'AVAILABLE',
        'RESERVED',
        'SOLD',
        'RETURNED',
        'DEFECTIVE',
        'IN_WARRANTY',
        'VOID'
    ) NOT NULL DEFAULT 'AVAILABLE',
    received_at TIMESTAMP NULL,
    sold_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE inventory_unit_identifiers (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    identifier_type ENUM('SERIAL', 'IMEI_1', 'IMEI_2', 'OTHER') NOT NULL,
    identifier_value VARCHAR(100) NOT NULL,
    normalized_identifier VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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
    warehouse_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
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
    reference_id BINARY(16) NOT NULL,
    reason VARCHAR(500) NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;


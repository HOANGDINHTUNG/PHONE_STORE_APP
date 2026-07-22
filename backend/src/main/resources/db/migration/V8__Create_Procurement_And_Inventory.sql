CREATE TABLE warehouses (
    id BINARY(16) NOT NULL PRIMARY KEY,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(500) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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
    id BINARY(16) NOT NULL PRIMARY KEY,
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
    version BINARY(16) NOT NULL DEFAULT 0,
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
    id BINARY(16) NOT NULL PRIMARY KEY,
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
    id BINARY(16) NOT NULL PRIMARY KEY,
    product_variant_id BINARY(16) NOT NULL,
    warehouse_id BINARY(16) NOT NULL,
    purchase_order_item_id BINARY(16) NULL,
    current_reservation_id BINARY(16) NULL,
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
        ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT fk_inventory_units_sold_order_item
        FOREIGN KEY (sold_order_item_id) REFERENCES order_items(id)
        ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE inventory_unit_identifiers (
    id BINARY(16) NOT NULL PRIMARY KEY,
    inventory_unit_id BINARY(16) NOT NULL,
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
    id BINARY(16) NOT NULL PRIMARY KEY,
    warehouse_id BINARY(16) NOT NULL,
    product_variant_id BINARY(16) NOT NULL,
    inventory_unit_id BINARY(16) NULL,
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

CREATE TABLE shipments (
    id BINARY(16) NOT NULL PRIMARY KEY,
    shipment_code VARCHAR(50) NOT NULL,
    order_id BINARY(16) NOT NULL,
    warehouse_id BINARY(16) NOT NULL,
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
    estimated_delivery_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_shipments_code UNIQUE (shipment_code),
    CONSTRAINT uq_shipments_provider_tracking
        UNIQUE (shipping_provider, tracking_code),
    CONSTRAINT chk_shipments_fee CHECK (shipping_fee >= 0),
    CONSTRAINT fk_shipments_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_shipments_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE shipment_item_units (
    shipment_item_id BINARY(16) NOT NULL,
    inventory_unit_id BINARY(16) NOT NULL,
    PRIMARY KEY (shipment_item_id, inventory_unit_id),
    CONSTRAINT uq_shipment_item_units_unit UNIQUE (inventory_unit_id),
    CONSTRAINT fk_shipment_item_units_shipment_item
        FOREIGN KEY (shipment_item_id) REFERENCES shipment_items(id)
        ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_shipment_item_units_inventory_unit
        FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE warranties (
    id BINARY(16) NOT NULL PRIMARY KEY,
    warranty_code VARCHAR(100) NOT NULL,
    order_item_id BINARY(16) NOT NULL,
    inventory_unit_id BINARY(16) NULL,
    product_variant_id BINARY(16) NOT NULL,
    customer_id BINARY(16) NULL,
    owner_name VARCHAR(150) NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    owner_email VARCHAR(254) NULL,
    covered_quantity INT UNSIGNED NOT NULL DEFAULT 1,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'VOID') NOT NULL DEFAULT 'ACTIVE',
    void_reason VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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

CREATE TABLE return_request_items (
    id BINARY(16) NOT NULL PRIMARY KEY,
    return_request_id BINARY(16) NOT NULL,
    order_item_id BINARY(16) NOT NULL,
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
    return_request_item_id BINARY(16) NOT NULL,
    inventory_unit_id BINARY(16) NOT NULL,
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


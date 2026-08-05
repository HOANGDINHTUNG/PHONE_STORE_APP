-- V22__Seed_Procurement_Data.sql
-- Seed Suppliers, Warehouses, and Purchase Orders

-- 1. Suppliers
INSERT INTO suppliers (id, supplier_code, name, tax_code, contact_name, phone, email, status)
VALUES
(UNHEX(REPLACE('66666666-6666-6666-6666-666666666661', '-', '')), 'SUP-APPLE', 'Apple Distributor Asia Pacific', '0100123456', 'John Apple', '0901111111', 'supply@apple-ap.local', 'ACTIVE'),
(UNHEX(REPLACE('66666666-6666-6666-6666-666666666662', '-', '')), 'SUP-TECHVISION', 'TechVision Electronics', '0100123457', 'Mr. Tech', '0902222222', 'contact@techvision.local', 'ACTIVE'),
(UNHEX(REPLACE('66666666-6666-6666-6666-666666666663', '-', '')), 'SUP-GLOBAL', 'Global Acc. Ltd', '0100123458', 'Ms. Global', '0903333333', 'sales@globalacc.local', 'ACTIVE'),
(UNHEX(REPLACE('66666666-6666-6666-6666-666666666664', '-', '')), 'SUP-SMARTDISP', 'SmartDisplays Inc', '0100123459', 'Alex Smart', '0904444444', 'info@smartdisplays.local', 'ACTIVE'),
(UNHEX(REPLACE('66666666-6666-6666-6666-666666666665', '-', '')), 'SUP-BATTERY', 'BatteryWorld Corp', '0100123460', 'Dave Battery', '0905555555', 'orders@batteryworld.local', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- 2. Warehouses
INSERT INTO warehouses (id, code, name, phone, address, status)
VALUES
(UNHEX(REPLACE('77777777-7777-7777-7777-777777777771', '-', '')), 'WH-Q7', 'Kho Tổng - Quận 7', '0287777111', '123 Nguyen Van Linh, Q7, TP.HCM', 'ACTIVE'),
(UNHEX(REPLACE('77777777-7777-7777-7777-777777777772', '-', '')), 'WH-MAIN', 'Trung tâm Phân phối Chính', '0287777222', '456 Le Van Viet, Q9, TP.HCM', 'ACTIVE'),
(UNHEX(REPLACE('77777777-7777-7777-7777-777777777773', '-', '')), 'WH-NORTH', 'Kho Miền Bắc (North Hub)', '0247777333', '789 Gia Lam, Ha Noi', 'ACTIVE'),
(UNHEX(REPLACE('77777777-7777-7777-7777-777777777774', '-', '')), 'WH-SOUTH', 'Kho Miền Nam (South Hub)', '0274777444', '321 Binh Duong Blvd, Binh Duong', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- 3. Purchase Orders
INSERT INTO purchase_orders (id, purchase_order_code, supplier_id, warehouse_id, status, total_amount, expected_at, created_by, note)
VALUES
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888801', '-', '')),
    'PO-2023-1045',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666661', '-', '')),
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777771', '-', '')),
    'APPROVED',
    2139500000.00,
    '2023-10-28 00:00:00',
    'Admin User',
    'Priority shipment for Q4 holiday season. Ensure all devices have VN/A part numbers.'
),
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888802', '-', '')),
    'PO-2023-0891',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666662', '-', '')),
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777772', '-', '')),
    'COMPLETED',
    1084800000.00,
    '2023-10-24 00:00:00',
    'J. Doe',
    'High priority restocking for main warehouse.'
),
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888803', '-', '')),
    'PO-2023-0892',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666663', '-', '')),
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777773', '-', '')),
    'APPROVED',
    308412000.00,
    '2023-10-26 00:00:00',
    'M. Lee',
    'Accessories order for North Hub.'
),
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888804', '-', '')),
    'PO-2023-0893',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666664', '-', '')),
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777774', '-', '')),
    'DRAFT',
    2136000000.00,
    '2023-11-02 00:00:00',
    'A. Wong',
    'Draft order awaiting final budget confirmation.'
),
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888805', '-', '')),
    'PO-2023-0894',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666665', '-', '')),
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777771', '-', '')),
    'PENDING_APPROVAL',
    828000000.00,
    '2023-10-28 00:00:00',
    'J. Doe',
    'Battery parts order.'
)
ON DUPLICATE KEY UPDATE note = VALUES(note);

-- 4. Purchase Order Items for PO-2023-1045
INSERT INTO purchase_order_items (purchase_order_id, product_variant_id, ordered_quantity, received_quantity, unit_cost)
VALUES
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888801', '-', '')),
    UNHEX(REPLACE('66666666-6666-4666-8666-000000000001', '-', '')),
    50,
    0,
    28500000.00
),
(
    UNHEX(REPLACE('88888888-8888-8888-8888-888888888801', '-', '')),
    UNHEX(REPLACE('66666666-6666-4666-8666-000000000004', '-', '')),
    100,
    0,
    5200000.00
)
ON DUPLICATE KEY UPDATE ordered_quantity = VALUES(ordered_quantity);

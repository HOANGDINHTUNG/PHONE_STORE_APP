-- Binary UUID values must be converted to printable hexadecimal before they
-- are stored in the generated unique key.
ALTER TABLE stock_reservations
    DROP INDEX uq_stock_reservations_active,
    DROP COLUMN active_reservation_key,
    ADD COLUMN active_reservation_key VARCHAR(100)
        GENERATED ALWAYS AS (
            CASE
                WHEN status = 'ACTIVE'
                THEN CONCAT(HEX(order_item_id), ':', HEX(warehouse_id))
                ELSE NULL
            END
        ) STORED,
    ADD CONSTRAINT uq_stock_reservations_active UNIQUE (active_reservation_key);

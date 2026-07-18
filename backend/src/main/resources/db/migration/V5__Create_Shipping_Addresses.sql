-- V5__Create_Shipping_Addresses.sql

CREATE TABLE shipping_addresses (
    id BINARY(16) NOT NULL PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'VN',
    province_code VARCHAR(20) NULL,
    province_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(20) NULL,
    district_name VARCHAR(100) NOT NULL,
    ward_code VARCHAR(20) NULL,
    ward_name VARCHAR(100) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    default_customer_id BINARY(16)
        GENERATED ALWAYS AS (
            CASE WHEN is_default = TRUE THEN customer_id ELSE NULL END
        ) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,
    deleted_at TIMESTAMP NULL,

    CONSTRAINT uq_shipping_addresses_default UNIQUE (default_customer_id),
    CONSTRAINT fk_shipping_addresses_customer
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(user_id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

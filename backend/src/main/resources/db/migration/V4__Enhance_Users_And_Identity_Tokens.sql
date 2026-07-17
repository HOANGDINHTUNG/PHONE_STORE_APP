-- V4__Enhance_Users_And_Identity_Tokens.sql

-- 1. Alter Users table to support Advanced Auth Fields
ALTER TABLE users
    ADD COLUMN phone VARCHAR(20) NULL AFTER email,
    ADD COLUMN avatar_url VARCHAR(500) NULL AFTER password_hash,
    ADD COLUMN account_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' AFTER avatar_url,
    ADD COLUMN email_verified_at TIMESTAMP NULL AFTER account_status,
    ADD COLUMN phone_verified_at TIMESTAMP NULL AFTER email_verified_at,
    ADD COLUMN last_login_at TIMESTAMP NULL AFTER phone_verified_at,
    ADD COLUMN failed_login_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER last_login_at,
    ADD COLUMN locked_until TIMESTAMP NULL AFTER failed_login_count;

-- 2. Customer Profiles
CREATE TABLE customer_profiles (
    user_id BINARY(16) NOT NULL PRIMARY KEY,
    customer_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NULL,
    date_of_birth DATE NULL,
    gender VARCHAR(20) NULL,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    customer_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 3. Refresh Tokens
CREATE TABLE refresh_tokens (
    id BINARY(16) NOT NULL PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    token_family_id BINARY(16) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP NULL,
    revoked_at TIMESTAMP NULL,
    revoked_reason VARCHAR(255) NULL,
    replaced_by_token_id BINARY(16) NULL,
    device_name VARCHAR(150) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_refresh_tokens_replacement FOREIGN KEY (replaced_by_token_id) REFERENCES refresh_tokens(id) ON DELETE SET NULL
);

-- 4. Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id BINARY(16) NOT NULL PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    requested_ip VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Email Verification Tokens
CREATE TABLE email_verification_tokens (
    id BINARY(16) NOT NULL PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_verification_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

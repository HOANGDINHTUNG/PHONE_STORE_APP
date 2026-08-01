-- V14: Fix missing auditing columns in reviews table

ALTER TABLE reviews
    ADD COLUMN created_by VARCHAR(255) NULL AFTER rejection_reason,
    ADD COLUMN updated_by VARCHAR(255) NULL AFTER created_by;

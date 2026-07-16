-- V2__Add_Auditing_Fields_To_Users.sql
-- Thêm các trường tracking JPA Auditing (created_by, updated_by) cho bảng users

ALTER TABLE users 
ADD COLUMN created_by VARCHAR(255) NULL,
ADD COLUMN updated_by VARCHAR(255) NULL;

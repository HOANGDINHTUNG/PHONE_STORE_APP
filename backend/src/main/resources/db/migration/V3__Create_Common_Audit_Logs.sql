-- V3__Create_Common_Audit_Logs.sql
-- Khởi tạo bảng lưu nhật ký hoạt động (audit_logs) hỗ trợ ghi vết các thao tác nghiệp vụ quan trọng.

CREATE TABLE audit_logs (
    id BINARY(16) NOT NULL PRIMARY KEY,
    actor_username VARCHAR(100) NULL,
    action_code VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_class VARCHAR(255) NULL,
    entity_id VARCHAR(50) NULL,
    old_data TEXT NULL,
    new_data TEXT NULL,
    result VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    correlation_id VARCHAR(100) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_logs_actor_time (actor_username, created_at),
    INDEX idx_audit_logs_entity_time (entity_type, entity_id, created_at),
    INDEX idx_audit_logs_action_time (action_code, created_at)
) ENGINE=InnoDB;

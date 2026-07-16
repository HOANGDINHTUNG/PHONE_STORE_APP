-- V<version>__<short_description>.sql
-- Owner module:
-- Purpose:
-- Compatibility: backward-compatible / breaking
-- Expected lock and duration:
-- Verification query:
-- Rollback or forward-fix:

-- Expand first. Avoid destructive statements in the same release.
CREATE TABLE example_entities (
    id BIGINT NOT NULL,
    business_key VARCHAR(100) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT pk_example_entities PRIMARY KEY (id),
    CONSTRAINT uk_example_entities__business_key UNIQUE (business_key)
) ENGINE=InnoDB;

-- Add indexes only for documented query patterns.
-- CREATE INDEX idx_example_entities__created_at ON example_entities (created_at);


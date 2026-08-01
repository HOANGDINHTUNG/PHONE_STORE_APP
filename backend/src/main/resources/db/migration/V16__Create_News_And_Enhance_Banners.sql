-- ============================================================================
-- V16: CREATE NEWS TABLE AND ENHANCE BANNERS TABLE
-- ============================================================================

-- 1. ENHANCE BANNERS
ALTER TABLE banners MODIFY COLUMN created_by VARCHAR(255) NULL;

ALTER TABLE banners 
    ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS label VARCHAR(100) NULL AFTER position,
    ADD COLUMN IF NOT EXISTS subtitle VARCHAR(500) NULL AFTER title,
    ADD COLUMN IF NOT EXISTS bg_color VARCHAR(100) NULL AFTER image_url,
    ADD COLUMN IF NOT EXISTS text_color VARCHAR(50) NULL AFTER bg_color;

-- 2. CREATE NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
    id BINARY(16) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    views_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,
    INDEX idx_news_status (status),
    INDEX idx_news_published_at (published_at)
) ENGINE=InnoDB;

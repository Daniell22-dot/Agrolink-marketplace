-- ================================================
-- USER INTERACTIONS TABLE (ML Recommendations)
-- ================================================
-- Tracks user behavior for the ML recommendation engine:
-- views, purchases, cart additions, searches
-- ================================================
CREATE TABLE IF NOT EXISTS user_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    interaction_type ENUM(
        'view',
        'purchase',
        'cart_add',
        'search',
        'wishlist'
    ) NOT NULL,
    metadata JSON COMMENT 'Additional context: search query, referrer, etc.',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_ui_user_type (user_id, interaction_type),
    INDEX idx_ui_product_type (product_id, interaction_type),
    INDEX idx_ui_created (created_at),
    INDEX idx_ui_user_product (user_id, product_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
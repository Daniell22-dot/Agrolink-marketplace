-- ================================================
-- SECURITY ROLES & SECURITY AUDITOR INVITES
-- ================================================
-- 1. Extend the users.role ENUM with the restricted
--    security dashboard roles.
-- 2. Create the security_invites table used by the
--    Super Admin to grant single-use, time-bound
--    SECURITY_AUDITOR access to trusted team members.
-- ================================================

ALTER TABLE users
    MODIFY COLUMN role ENUM(
        'farmer',
        'buyer',
        'admin',
        'super_admin',
        'security_auditor'
    ) NOT NULL;

CREATE TABLE IF NOT EXISTS security_invites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) COMMENT 'Optional: restrict invite to a specific email',
    role ENUM('security_auditor') NOT NULL DEFAULT 'security_auditor',
    status ENUM('pending', 'accepted', 'revoked', 'expired') NOT NULL DEFAULT 'pending',
    created_by INT NOT NULL,
    accepted_by INT,
    expires_at DATETIME NOT NULL,
    accepted_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accepted_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_security_invites_token (token),
    INDEX idx_security_invites_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

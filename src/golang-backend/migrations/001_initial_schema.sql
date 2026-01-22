-- ============================================
-- VHV Platform - Database Schema
-- ============================================
-- Convention: All tables MUST follow NAMING_CONVENTIONS.md
-- Primary Key: _id (UUID CHAR(36))
-- Standard Fields: tenant_id, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, version
-- Created: 2026-01-09
-- ============================================

-- Enable UUID functions (MySQL 8.0+)
-- For PostgreSQL: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE: TENANTS (Multi-tenancy)
-- ============================================

CREATE TABLE IF NOT EXISTS tenants (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    
    -- Business fields
    code        VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique tenant code (company-slug)',
    name        VARCHAR(255) NOT NULL COMMENT 'Company/Organization name',
    domain      VARCHAR(255) UNIQUE COMMENT 'Custom domain (e.g., acme.vhvplatform.com)',
    logo_url    TEXT COMMENT 'Company logo URL',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Tenant active status',
    plan        ENUM('free', 'starter', 'business', 'enterprise') NOT NULL DEFAULT 'free',
    
    -- Settings
    settings    JSON COMMENT 'Tenant-specific settings',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL COMMENT 'User ID of creator',
    updated_by  CHAR(36) NULL COMMENT 'User ID of last updater',
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Multi-tenancy: Companies/Organizations';

-- ============================================
-- AUTHENTICATION & USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    tenant_id   CHAR(36) NOT NULL COMMENT 'Multi-tenancy identifier',
    
    -- Authentication
    email       VARCHAR(255) NOT NULL COMMENT 'User email (unique within tenant)',
    username    VARCHAR(100) NOT NULL COMMENT 'Username (unique within tenant)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
    
    -- Profile
    full_name   VARCHAR(255) COMMENT 'Full name',
    avatar_url  TEXT COMMENT 'Avatar image URL',
    phone       VARCHAR(20) COMMENT 'Phone number',
    
    -- Authorization
    role        ENUM('admin', 'developer', 'user') NOT NULL DEFAULT 'user',
    
    -- Status
    is_active   BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Account active status',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Email verification status',
    is_locked   BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Account locked status',
    
    -- Timestamps
    email_verified_at TIMESTAMP NULL COMMENT 'Email verification timestamp',
    last_login_at     TIMESTAMP NULL COMMENT 'Last login timestamp',
    locked_at         TIMESTAMP NULL COMMENT 'Account locked timestamp',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    UNIQUE KEY unique_tenant_email (tenant_id, email),
    UNIQUE KEY unique_tenant_username (tenant_id, username),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts';

-- ============================================
-- SESSIONS & TOKENS
-- ============================================

CREATE TABLE IF NOT EXISTS sessions (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    tenant_id   CHAR(36) NOT NULL,
    
    -- Session data
    user_id     CHAR(36) NOT NULL COMMENT 'FK to users._id',
    token_hash  VARCHAR(255) NOT NULL UNIQUE COMMENT 'Hashed JWT token',
    refresh_token_hash VARCHAR(255) COMMENT 'Hashed refresh token',
    
    -- Client info
    user_agent  TEXT COMMENT 'Browser user agent',
    ip_address  VARCHAR(45) COMMENT 'Client IP address (IPv4/IPv6)',
    
    -- Expiry
    expires_at  TIMESTAMP NOT NULL COMMENT 'Token expiration time',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete (logout)
    deleted_at  TIMESTAMP NULL COMMENT 'Logout/Revoke timestamp',
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at),
    INDEX idx_deleted_at (deleted_at),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User sessions and JWT tokens';

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Token data
    user_id     CHAR(36) NOT NULL,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    
    -- Expiry & usage
    expires_at  TIMESTAMP NOT NULL,
    used_at     TIMESTAMP NULL COMMENT 'Timestamp when token was used',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Password reset tokens';

CREATE TABLE IF NOT EXISTS email_verification_tokens (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Token data
    user_id     CHAR(36) NOT NULL,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    
    -- Expiry & verification
    expires_at  TIMESTAMP NOT NULL,
    verified_at TIMESTAMP NULL,
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Email verification tokens';

-- ============================================
-- USECASES & TESTCASES
-- ============================================

CREATE TABLE IF NOT EXISTS usecases (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Identification
    code        VARCHAR(50) NOT NULL COMMENT 'Human-readable code (UC001, UC002)',
    
    -- Basic info
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    category    VARCHAR(100) NOT NULL,
    actor       VARCHAR(100) NOT NULL COMMENT 'Primary actor (User, Admin, System)',
    
    -- Related
    related_route VARCHAR(255) COMMENT 'Frontend route path (/login, /dashboard)',
    
    -- Priority & Status
    priority    ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    status      ENUM('completed', 'in-progress', 'planned') NOT NULL DEFAULT 'planned',
    
    -- Details (JSON arrays)
    preconditions    JSON COMMENT 'Array of precondition strings',
    steps            JSON COMMENT 'Array of step strings',
    postconditions   JSON COMMENT 'Array of postcondition strings',
    alternative_flows JSON COMMENT 'Array of alternative flow strings',
    exception_flows   JSON COMMENT 'Array of exception flow strings',
    related_apis     JSON COMMENT 'Array of API endpoint strings',
    requirements     JSON COMMENT 'Array of requirement strings',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    UNIQUE KEY unique_tenant_code (tenant_id, code),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Use case specifications';

CREATE TABLE IF NOT EXISTS testcases (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Identification
    code        VARCHAR(50) NOT NULL COMMENT 'Human-readable code (TC-AUTH-001)',
    
    -- Basic info
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    category    VARCHAR(100) NOT NULL,
    
    -- Priority & Status
    priority    ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    status      ENUM('passed', 'failed', 'pending', 'skipped') NOT NULL DEFAULT 'pending',
    
    -- Test details
    preconditions   JSON COMMENT 'Array of precondition strings',
    steps           JSON COMMENT 'Array of test step strings',
    expected_result TEXT NOT NULL,
    actual_result   TEXT,
    
    -- Relations
    related_usecase_id CHAR(36) COMMENT 'FK to usecases._id',
    related_apis    JSON COMMENT 'Array of API endpoint strings',
    
    -- Metadata
    tags        JSON COMMENT 'Array of tag strings',
    author      VARCHAR(100),
    last_tested_at TIMESTAMP NULL,
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_related_usecase_id (related_usecase_id),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    UNIQUE KEY unique_tenant_code (tenant_id, code),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (related_usecase_id) REFERENCES usecases(_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Test case specifications';

-- ============================================
-- MEDIA & ASSETS
-- ============================================

CREATE TABLE IF NOT EXISTS screenshots (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Entity relation
    entity_type ENUM('usecase', 'testcase', 'feature', 'bug') NOT NULL,
    entity_id   CHAR(36) NOT NULL COMMENT 'UUID of related entity',
    
    -- File info
    file_path   TEXT NOT NULL COMMENT 'S3/local path to file',
    file_size   INT UNSIGNED COMMENT 'File size in bytes',
    mime_type   VARCHAR(100) COMMENT 'MIME type (image/png, image/jpeg)',
    width       INT UNSIGNED COMMENT 'Image width in pixels',
    height      INT UNSIGNED COMMENT 'Image height in pixels',
    
    -- Metadata
    title       VARCHAR(255),
    description TEXT,
    sort_order  INT NOT NULL DEFAULT 0 COMMENT 'Display order',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_by (created_by),
    INDEX idx_deleted_at (deleted_at),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Screenshots and images';

-- ============================================
-- AUDIT & LOGGING
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Actor
    user_id     CHAR(36) COMMENT 'User who performed the action',
    
    -- Action
    action      VARCHAR(100) NOT NULL COMMENT 'Action type (create, update, delete, login)',
    entity_type VARCHAR(100) COMMENT 'Entity type (user, testcase, usecase)',
    entity_id   CHAR(36) COMMENT 'Entity UUID',
    
    -- Changes
    old_values  JSON COMMENT 'JSON snapshot before change',
    new_values  JSON COMMENT 'JSON snapshot after change',
    
    -- Client info
    ip_address  VARCHAR(45) COMMENT 'Client IP',
    user_agent  TEXT COMMENT 'Browser user agent',
    
    -- Audit fields (no updated_at for audit logs - immutable)
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    
    -- No soft delete for audit logs
    -- No versioning for audit logs
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit trail logs (immutable)';

-- ============================================
-- CONFIGURATION
-- ============================================

CREATE TABLE IF NOT EXISTS system_settings (
    -- Identity (No tenant_id - global settings)
    _id         CHAR(36) PRIMARY KEY,
    
    -- Setting
    setting_key VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique setting identifier',
    setting_value TEXT COMMENT 'Setting value',
    setting_type ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
    
    -- Metadata
    category    VARCHAR(100) COMMENT 'Setting category',
    description TEXT COMMENT 'Setting description',
    is_public   BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Public visibility',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_deleted_at (deleted_at),
    
    -- Foreign keys
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Global system settings';

CREATE TABLE IF NOT EXISTS user_preferences (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Preference
    user_id     CHAR(36) NOT NULL,
    preference_key   VARCHAR(255) NOT NULL,
    preference_value TEXT,
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_deleted_at (deleted_at),
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-specific preferences';

-- ============================================
-- API DOCUMENTATION
-- ============================================

CREATE TABLE IF NOT EXISTS api_endpoints (
    -- Identity (No tenant_id - global API docs)
    _id         CHAR(36) PRIMARY KEY,
    
    -- Endpoint
    method      ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE') NOT NULL,
    path        VARCHAR(255) NOT NULL,
    version     VARCHAR(20) NOT NULL DEFAULT 'v1',
    
    -- Documentation
    summary     VARCHAR(255),
    description TEXT,
    category    VARCHAR(100),
    
    -- Schemas
    request_schema  JSON COMMENT 'JSON schema for request validation',
    response_schema JSON COMMENT 'JSON schema for response',
    
    -- Configuration
    auth_required BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit    INT COMMENT 'Requests per minute',
    is_deprecated BOOLEAN NOT NULL DEFAULT FALSE,
    is_public     BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version_number INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_method (method),
    INDEX idx_category (category),
    INDEX idx_version (version),
    INDEX idx_deleted_at (deleted_at),
    UNIQUE KEY unique_endpoint (method, path, version),
    
    -- Foreign keys
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='API endpoint documentation';

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Recipient
    user_id     CHAR(36) NOT NULL,
    
    -- Notification
    type        VARCHAR(100) NOT NULL COMMENT 'Notification type (info, warning, success, error)',
    title       VARCHAR(255) NOT NULL,
    message     TEXT,
    data        JSON COMMENT 'Additional notification data',
    
    -- Status
    read_at     TIMESTAMP NULL COMMENT 'Read timestamp',
    
    -- Audit fields
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMP NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_read_at (read_at),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notifications';

-- ============================================
-- TRIGGERS - Auto-update updated_at
-- ============================================

DELIMITER //

-- Tenants
CREATE TRIGGER tenants_set_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- Users
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- Sessions
CREATE TRIGGER sessions_set_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- Usecases
CREATE TRIGGER usecases_set_updated_at
BEFORE UPDATE ON usecases
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- Testcases
CREATE TRIGGER testcases_set_updated_at
BEFORE UPDATE ON testcases
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- Screenshots
CREATE TRIGGER screenshots_set_updated_at
BEFORE UPDATE ON screenshots
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- System Settings
CREATE TRIGGER system_settings_set_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- User Preferences
CREATE TRIGGER user_preferences_set_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- API Endpoints
CREATE TRIGGER api_endpoints_set_updated_at
BEFORE UPDATE ON api_endpoints
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

-- Notifications
CREATE TRIGGER notifications_set_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//

DELIMITER ;

-- ============================================
-- END OF SCHEMA
-- ============================================

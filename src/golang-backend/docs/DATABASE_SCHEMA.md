# Database Schema Documentation

## Overview

VHV Platform sử dụng MySQL/MariaDB với các convention sau:

### 🔑 **Primary Key Convention**
- **Tất cả các bảng PHẢI có khóa chính tên là `_id`**
- **Kiểu dữ liệu: `CHAR(36)` hoặc `UUID`** (tùy database engine)
- **Ví dụ:**
  ```sql
  CREATE TABLE users (
      _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
      ...
  );
  ```

### 📋 **Naming Conventions**
- **Tables:** Lowercase, số nhiều (users, testcases, sessions)
- **Primary Key:** Luôn là `_id` (UUID)
- **Foreign Keys:** `{table_singular}_id` (user_id, testcase_id)
- **Timestamps:** created_at, updated_at, deleted_at
- **Indexes:** idx_{column_name} (idx_email, idx_category)

### 🗂️ **Standard Fields**
Mọi bảng nên có:
```sql
_id CHAR(36) PRIMARY KEY,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL -- For soft delete
```

---

## Database Tables

### 1. Authentication & Users

#### **users**
User accounts and authentication information.

```sql
CREATE TABLE users (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    role ENUM('admin', 'developer', 'user') NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);
```

**Fields:**
- `_id`: UUID primary key
- `email`: Unique email address
- `username`: Unique username
- `password_hash`: Bcrypt hashed password
- `role`: User role (admin, developer, user)
- `is_active`: Account active status
- `is_verified`: Email verification status

---

#### **sessions**
User sessions and JWT tokens.

```sql
CREATE TABLE sessions (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
);
```

**Foreign Keys:**
- `user_id` → users._id (CASCADE)

---

#### **password_reset_tokens**
Password reset request tokens.

```sql
CREATE TABLE password_reset_tokens (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
);
```

**Foreign Keys:**
- `user_id` → users._id (CASCADE)

---

#### **email_verification_tokens**
Email verification tokens.

```sql
CREATE TABLE email_verification_tokens (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token_hash)
);
```

**Foreign Keys:**
- `user_id` → users._id (CASCADE)

---

### 2. Usecases & Testing

#### **usecases**
Use case specifications.

```sql
CREATE TABLE usecases (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Human-readable code (UC001)',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    related_route VARCHAR(255),
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    status ENUM('completed', 'in-progress', 'planned') NOT NULL DEFAULT 'planned',
    preconditions JSON,
    steps JSON,
    postconditions JSON,
    alternative_flows JSON,
    exception_flows JSON,
    related_apis JSON,
    requirements JSON,
    created_by CHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);
```

**Fields:**
- `_id`: UUID primary key
- `code`: Human-readable unique code (UC001, UC002)
- `related_route`: Frontend route path (/login, /dashboard)
- JSON arrays: preconditions, steps, postconditions, etc.

**Foreign Keys:**
- `created_by` → users._id (SET NULL)

---

#### **testcases**
Test case specifications.

```sql
CREATE TABLE testcases (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Human-readable code (TC-AUTH-001)',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    status ENUM('passed', 'failed', 'pending', 'skipped') NOT NULL DEFAULT 'pending',
    preconditions JSON,
    steps JSON,
    expected_result TEXT NOT NULL,
    actual_result TEXT,
    related_usecase_id CHAR(36),
    related_apis JSON,
    tags JSON,
    author VARCHAR(100),
    last_tested_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (related_usecase_id) REFERENCES usecases(_id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_related_usecase (related_usecase_id)
);
```

**Fields:**
- `_id`: UUID primary key
- `code`: Human-readable unique code (TC-AUTH-001)
- `last_tested_at`: Last test execution timestamp

**Foreign Keys:**
- `related_usecase_id` → usecases._id (SET NULL)

---

### 3. Media & Assets

#### **screenshots**
Screenshot files linked to entities.

```sql
CREATE TABLE screenshots (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    entity_type ENUM('usecase', 'testcase', 'feature') NOT NULL,
    entity_id CHAR(36) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT UNSIGNED,
    mime_type VARCHAR(100),
    width INT UNSIGNED,
    height INT UNSIGNED,
    title VARCHAR(255),
    description TEXT,
    sort_order INT DEFAULT 0,
    created_by CHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_by (created_by)
);
```

**Fields:**
- `entity_type`: Type of entity (usecase, testcase, feature)
- `entity_id`: UUID of the related entity
- `file_path`: S3/local path to screenshot file

**Foreign Keys:**
- `created_by` → users._id (SET NULL)

---

### 4. Audit & Logging

#### **audit_logs**
Audit trail for all system actions.

```sql
CREATE TABLE audit_logs (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id CHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);
```

**Fields:**
- `action`: Action performed (create, update, delete)
- `old_values`: JSON snapshot before change
- `new_values`: JSON snapshot after change

**Foreign Keys:**
- `user_id` → users._id (SET NULL)

---

### 5. Configuration

#### **system_settings**
Global system settings.

```sql
CREATE TABLE system_settings (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
    category VARCHAR(100),
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
);
```

**Fields:**
- `setting_key`: Unique setting identifier
- `setting_type`: Value type for proper parsing
- `is_public`: Whether setting is publicly accessible

---

#### **user_preferences**
User-specific preferences.

```sql
CREATE TABLE user_preferences (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL,
    preference_key VARCHAR(255) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    INDEX idx_user_id (user_id)
);
```

**Foreign Keys:**
- `user_id` → users._id (CASCADE)

---

### 6. API Documentation

#### **api_endpoints**
API endpoint documentation.

```sql
CREATE TABLE api_endpoints (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    method ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE') NOT NULL,
    path VARCHAR(255) NOT NULL,
    summary VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    request_schema JSON,
    response_schema JSON,
    auth_required BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit INT,
    deprecated BOOLEAN NOT NULL DEFAULT FALSE,
    version VARCHAR(20) DEFAULT 'v1',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_endpoint (method, path, version),
    INDEX idx_method (method),
    INDEX idx_category (category),
    INDEX idx_version (version)
);
```

**Fields:**
- `method`: HTTP method
- `path`: API endpoint path
- `request_schema`: JSON schema for request validation
- `response_schema`: JSON schema for response structure

---

### 7. Notifications

#### **notifications**
User notifications.

```sql
CREATE TABLE notifications (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSON,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_read (read_at),
    INDEX idx_created_at (created_at)
);
```

**Foreign Keys:**
- `user_id` → users._id (CASCADE)

---

## Entity Relationship Diagram

```
┌─────────────┐
│    users    │
│   (_id PK)  │
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌─────────────┐                  ┌──────────────┐
│  sessions   │                  │  usecases    │
│  (_id PK)   │                  │  (_id PK)    │
│  user_id FK │                  │  code UNIQUE │
└─────────────┘                  │  created_by FK│
                                 └───────┬──────┘
                                         │
                                         ▼
                                 ┌──────────────┐
                                 │  testcases   │
                                 │  (_id PK)    │
                                 │  code UNIQUE │
                                 │  related_usecase_id FK │
                                 └──────────────┘
```

---

## Migration Strategy

### Running Migrations

```bash
# Apply all migrations
./scripts/migrate.sh up

# Rollback last migration
./scripts/migrate.sh down

# Check migration status
./scripts/migrate.sh status
```

### Creating New Migration

```bash
# Create new migration file
./scripts/create-migration.sh "create_new_table"
```

**Template:**
```sql
-- Migration: Description
-- Version: XXX
-- Date: YYYY-MM-DD

-- Up migration
CREATE TABLE new_table (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Down migration (rollback)
-- DROP TABLE IF EXISTS new_table;
```

---

## Best Practices

### ✅ DO

1. **Always use `_id` as primary key with UUID type**
2. **Create indexes on foreign keys**
3. **Use JSON for array/object fields**
4. **Implement soft delete with `deleted_at`**
5. **Add comments to complex fields**
6. **Use ENUM for fixed value sets**
7. **Set appropriate ON DELETE actions**

### ❌ DON'T

1. **Never use auto-increment IDs**
2. **Don't expose internal IDs to frontend**
3. **Don't store large files in database (use S3)**
4. **Don't use VARCHAR for UUIDs (use CHAR(36))**
5. **Don't forget to add indexes**

---

## Performance Optimization

### Indexing Strategy

```sql
-- Primary key (automatic)
PRIMARY KEY (_id)

-- Foreign keys (always index)
INDEX idx_user_id (user_id)

-- Frequently filtered columns
INDEX idx_status (status)
INDEX idx_category (category)

-- Composite indexes for common queries
INDEX idx_user_status (user_id, status)
INDEX idx_entity (entity_type, entity_id)

-- Fulltext search
FULLTEXT INDEX ft_search (title, description)
```

### Query Optimization

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM testcases WHERE category = 'Authentication';

-- Add covering indexes for common queries
CREATE INDEX idx_testcase_list ON testcases(category, status, priority);
```

---

## Backup & Restore

### Backup

```bash
# Full database backup
mysqldump -u root -p vhv_platform > backup_$(date +%Y%m%d).sql

# Backup specific tables
mysqldump -u root -p vhv_platform users sessions > auth_backup.sql
```

### Restore

```bash
# Restore from backup
mysql -u root -p vhv_platform < backup_20240109.sql
```

---

## Security Considerations

1. **Password Hashing:** Use bcrypt with cost factor 12+
2. **Token Security:** Hash tokens before storing
3. **SQL Injection:** Always use parameterized queries
4. **Access Control:** Implement row-level security
5. **Audit Trail:** Log all sensitive operations
6. **Encryption:** Encrypt sensitive fields at rest

---

## Monitoring & Maintenance

### Regular Tasks

- **Daily:** Check slow query log
- **Weekly:** Optimize tables
- **Monthly:** Review index usage
- **Quarterly:** Archive old audit logs

### Health Checks

```sql
-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'vhv_platform'
ORDER BY (data_length + index_length) DESC;

-- Check index usage
SHOW INDEX FROM testcases;
```

---

**Last Updated:** 2026-01-09  
**Version:** 1.0.0  
**Maintained By:** VHV Platform Team

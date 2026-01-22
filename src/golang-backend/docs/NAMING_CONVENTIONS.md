# Naming Conventions & Standard Fields

## 📋 Tổng quan

Document này định nghĩa **QUY TẮC ĐẶT TÊN** và **CÁC TRƯỜNG TIÊU CHUẨN** áp dụng cho toàn bộ hệ thống VHV Platform.

> **⚠️ BẮT BUỘC:** Tất cả tables/collections phải tuân thủ 100% quy tắc này.

---

## A. QUY TẮC ĐẶT TÊN (NAMING CONVENTIONS)

### 1. Tên Bảng / Collection

**Quy tắc:** Danh từ **SỐ NHIỀU** (Plural), `snake_case`

✅ **ĐÚNG:**
```
users
testcases
api_endpoints
user_preferences
password_reset_tokens
```

❌ **SAI:**
```
user           // Thiếu số nhiều
testCase       // Sai case
API_Endpoints  // Sai case
userPreference // Thiếu số nhiều và sai case
```

---

### 2. Khóa chính (Primary Key)

**Quy tắc:** Thống nhất tên là `_id` trên toàn bộ hệ thống

**Kiểu:** Chuỗi UUID (String) - `CHAR(36)` hoặc `UUID`

✅ **ĐÚNG:**
```sql
CREATE TABLE users (
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    ...
);
```

❌ **SAI:**
```sql
-- ❌ Không dùng id, user_id, hoặc auto-increment
id INT AUTO_INCREMENT PRIMARY KEY
user_id VARCHAR(50) PRIMARY KEY
userId UUID PRIMARY KEY
```

---

### 3. Khóa ngoại (Foreign Key)

**Quy tắc:** `tên_thực_thể_số_ít` + `_id`

✅ **ĐÚNG:**
```sql
user_id CHAR(36)              -- FK to users._id
testcase_id CHAR(36)          -- FK to testcases._id
related_usecase_id CHAR(36)   -- FK to usecases._id
created_by CHAR(36)           -- FK to users._id (người tạo)
tenant_id CHAR(36)            -- FK to tenants._id
```

❌ **SAI:**
```sql
userId           // Sai case
user             // Thiếu _id
users_id         // Số nhiều
relatedUsecase   // Sai case và thiếu _id
```

---

### 4. Trường Thời gian (Date/Time)

Phân biệt rõ hậu tố (Suffix) để biết độ chính xác:

#### `_at`: Thời điểm chính xác (Timestamp UTC)

**Kiểu:** `TIMESTAMP` hoặc `TIMESTAMPTZ`

✅ **ĐÚNG:**
```sql
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
deleted_at TIMESTAMPTZ NULL
expires_at TIMESTAMPTZ NOT NULL
verified_at TIMESTAMPTZ NULL
email_verified_at TIMESTAMPTZ NULL
last_login_at TIMESTAMPTZ NULL
last_tested_at TIMESTAMPTZ NULL
read_at TIMESTAMPTZ NULL
logged_in_at TIMESTAMPTZ
```

#### `_date`: Ngày tháng theo lịch (Date only)

**Kiểu:** `DATE`

✅ **ĐÚNG:**
```sql
birth_date DATE
billing_start_date DATE
contract_end_date DATE
hired_date DATE
```

#### `_duration`: Khoảng thời gian (giây/ms)

**Kiểu:** `INT` hoặc `BIGINT`

✅ **ĐÚNG:**
```sql
processing_duration_ms INT       -- Milliseconds
session_duration_seconds INT     -- Seconds
video_duration_ms BIGINT
```

❌ **SAI:**
```sql
createdDate     // Sai: phải là created_at (timestamp) hoặc created_date (date only)
lastUpdate      // Sai: phải là last_updated_at hoặc updated_at
expiry          // Sai: phải là expires_at
duration        // Sai: thiếu unit suffix (duration_ms hoặc duration_seconds)
```

---

### 5. Trường Boolean (Bật/Tắt)

**Quy tắc:** Phải bắt đầu bằng động từ nghi vấn để code đọc lên như một câu văn

#### Prefix: `is_` + tính từ

✅ **ĐÚNG:**
```sql
is_active BOOLEAN NOT NULL DEFAULT TRUE
is_verified BOOLEAN NOT NULL DEFAULT FALSE
is_public BOOLEAN NOT NULL DEFAULT FALSE
is_deleted BOOLEAN NOT NULL DEFAULT FALSE
is_enabled BOOLEAN NOT NULL DEFAULT TRUE
is_locked BOOLEAN NOT NULL DEFAULT FALSE
is_deprecated BOOLEAN NOT NULL DEFAULT FALSE
is_draft BOOLEAN NOT NULL DEFAULT TRUE
```

**Đọc như câu văn:**
```typescript
if (user.is_active) { ... }          // "Nếu user IS ACTIVE"
if (setting.is_public) { ... }       // "Nếu setting IS PUBLIC"
if (!endpoint.is_deprecated) { ... } // "Nếu endpoint KHÔNG IS DEPRECATED"
```

#### Prefix: `has_` + danh từ

✅ **ĐÚNG:**
```sql
has_password BOOLEAN NOT NULL DEFAULT TRUE
has_avatar BOOLEAN NOT NULL DEFAULT FALSE
has_access BOOLEAN NOT NULL DEFAULT FALSE
has_permission BOOLEAN NOT NULL DEFAULT FALSE
```

**Đọc như câu văn:**
```typescript
if (user.has_password) { ... }     // "Nếu user HAS PASSWORD"
if (role.has_permission) { ... }   // "Nếu role HAS PERMISSION"
```

#### Prefix: `can_` + động từ

✅ **ĐÚNG:**
```sql
can_edit BOOLEAN NOT NULL DEFAULT FALSE
can_delete BOOLEAN NOT NULL DEFAULT FALSE
can_publish BOOLEAN NOT NULL DEFAULT FALSE
can_approve BOOLEAN NOT NULL DEFAULT FALSE
```

**Đọc như câu văn:**
```typescript
if (user.can_edit) { ... }       // "Nếu user CAN EDIT"
if (role.can_publish) { ... }    // "Nếu role CAN PUBLISH"
```

❌ **SAI:**
```sql
active           // Sai: phải là is_active
verified         // Sai: phải là is_verified
hasPassword      // Sai case: phải là has_password
canEdit          // Sai case: phải là can_edit
enabled          // Sai: phải là is_enabled
deleted          // Sai: phải là is_deleted (hoặc dùng deleted_at cho soft delete)
```

---

### 6. Bảng trung gian (Junction Table - Many-to-Many)

**Quy tắc:** `bảng_a` + `_` + `bảng_b` (Sắp xếp theo thứ tự alphabet hoặc chiều quan trọng)

✅ **ĐÚNG:**
```sql
-- Many-to-many: Users ↔ Roles
CREATE TABLE user_roles (
    _id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    ...
    FOREIGN KEY (user_id) REFERENCES users(_id),
    FOREIGN KEY (role_id) REFERENCES roles(_id),
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Many-to-many: Projects ↔ Tags
CREATE TABLE project_tags (
    _id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    tag_id CHAR(36) NOT NULL,
    ...
);

-- Many-to-many: Testcases ↔ Usecases
CREATE TABLE testcase_usecases (
    _id CHAR(36) PRIMARY KEY,
    testcase_id CHAR(36) NOT NULL,
    usecase_id CHAR(36) NOT NULL,
    ...
);
```

❌ **SAI:**
```sql
users_and_roles      // Không dùng "and"
UserRole             // Sai case
roles_users          // Sai thứ tự (nên là user_roles)
user_role            // Thiếu số nhiều ở cả 2 bảng
```

---

## B. CÁC TRƯỜNG TIÊU CHUẨN (STANDARD MIXINS)

> **⚠️ BẮT BUỘC:** Mọi bảng (Table/Collection) trong hệ thống đều **BẮT BUỘC** phải có nhóm các trường sau đây để phục vụ quản trị và truy vết.

---

### 1. Nhóm Định danh & Tenancy (Identity)

```sql
_id         CHAR(36) PRIMARY KEY COMMENT 'UUID - Định danh bản ghi',
tenant_id   CHAR(36) NOT NULL COMMENT 'UUID - Định danh khách hàng (Multi-tenancy)',
```

**Mục đích:**
- `_id`: Định danh duy nhất của bản ghi
- `tenant_id`: Phân vùng dữ liệu theo khách hàng (Multi-tenant SaaS)

**Index bắt buộc:**
```sql
INDEX idx_tenant_id (tenant_id)
```

> **Lưu ý:** `tenant_id` phải được index ở hầu hết các bảng để đảm bảo performance khi query "Dữ liệu của công ty A".

**Query pattern:**
```sql
-- Luôn filter theo tenant_id
SELECT * FROM users 
WHERE tenant_id = '123e4567-...' 
  AND deleted_at IS NULL;
```

---

### 2. Nhóm Audit (Truy vết)

```sql
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() COMMENT 'Thời điểm tạo',
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() COMMENT 'Thời điểm cập nhật cuối',
created_by  CHAR(36) NULL COMMENT 'User ID người tạo',
updated_by  CHAR(36) NULL COMMENT 'User ID người sửa cuối cùng',
```

**Foreign Keys:**
```sql
FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
```

**Indexes:**
```sql
INDEX idx_created_at (created_at),
INDEX idx_created_by (created_by),
INDEX idx_updated_by (updated_by),
```

**Trigger tự động cập nhật `updated_at`:**
```sql
-- PostgreSQL
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

-- MySQL
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
SET NEW.updated_at = NOW();
```

---

### 3. Nhóm Soft Delete (Xóa mềm)

> **Quy tắc:** Chúng ta **KHÔNG** dùng `DELETE FROM table`. Chúng ta dùng "Xóa mềm" để có thể khôi phục khi User lỡ tay.

```sql
deleted_at  TIMESTAMPTZ NULL COMMENT 'Thời điểm xóa (NULL = chưa xóa)',
deleted_by  CHAR(36) NULL COMMENT 'User ID người xóa',
```

**Foreign Key:**
```sql
FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL,
```

**Index:**
```sql
INDEX idx_deleted_at (deleted_at),
```

**Logic Query:**

✅ **ĐÚNG - Luôn filter deleted_at:**
```sql
-- Lấy bản ghi chưa xóa
SELECT * FROM users 
WHERE deleted_at IS NULL;

-- Lấy bản ghi đã xóa
SELECT * FROM users 
WHERE deleted_at IS NOT NULL;
```

**Logic Delete (Soft Delete):**
```sql
-- Xóa mềm
UPDATE users 
SET deleted_at = NOW(),
    deleted_by = '456e7890-...'  -- Current user ID
WHERE _id = '123e4567-...';
```

**Logic Restore (Khôi phục):**
```sql
-- Khôi phục bản ghi đã xóa
UPDATE users 
SET deleted_at = NULL,
    deleted_by = NULL
WHERE _id = '123e4567-...';
```

❌ **SAI - KHÔNG dùng DELETE:**
```sql
-- ❌ KHÔNG bao giờ dùng DELETE trực tiếp
DELETE FROM users WHERE _id = '123e4567-...';
```

---

### 4. Nhóm Versioning (Cho Optimistic Locking)

> **Mục đích:** Tránh việc 2 người cùng sửa 1 dòng dữ liệu và ghi đè nhau.

```sql
version     INT NOT NULL DEFAULT 1 COMMENT 'Version cho Optimistic Locking',
```

**Logic Update:**

```sql
-- Frontend gửi version hiện tại (ví dụ: version = 5)
UPDATE users 
SET 
    full_name = 'New Name',
    updated_at = NOW(),
    updated_by = '456e7890-...',
    version = version + 1        -- Tăng version lên 6
WHERE _id = '123e4567-...' 
  AND version = 5;               -- Chỉ update nếu version = 5

-- Kiểm tra rows affected
-- Nếu rows affected = 0: Có người khác đã sửa trước
-- Nếu rows affected = 1: Update thành công
```

**Backend Logic (Golang example):**
```go
type UpdateRequest struct {
    ID      string `json:"_id"`
    Version int    `json:"version"`
    Data    map[string]interface{} `json:"data"`
}

func UpdateUser(req UpdateRequest) error {
    result := db.Exec(`
        UPDATE users 
        SET full_name = ?, version = version + 1
        WHERE _id = ? AND version = ?
    `, req.Data["full_name"], req.ID, req.Version)
    
    if result.RowsAffected == 0 {
        return errors.New("CONFLICT: Data has been modified by another user. Please reload and try again.")
    }
    
    return nil
}
```

**Frontend Logic (TypeScript example):**
```typescript
async function updateUser(userId: string, data: any, currentVersion: number) {
  try {
    await api.put(`/users/${userId}`, {
      ...data,
      version: currentVersion  // Gửi version hiện tại
    });
    
    // Success
    toast.success('Updated successfully');
    
  } catch (error) {
    if (error.code === 'CONFLICT') {
      // Conflict: Reload data
      toast.error('Data has been modified by another user. Reloading...');
      await reloadUserData(userId);
    }
  }
}
```

---

## C. TEMPLATE CHUẨN CHO TABLE MỚI

Khi tạo table mới, **PHẢI** copy template này:

```sql
-- ============================================
-- Table: {table_name}
-- Description: {Mô tả bảng}
-- ============================================

CREATE TABLE {table_name} (
    -- ==========================================
    -- 1. IDENTITY & TENANCY (BẮT BUỘC)
    -- ==========================================
    _id         CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    tenant_id   CHAR(36) NOT NULL COMMENT 'Multi-tenancy identifier',
    
    -- ==========================================
    -- 2. BUSINESS FIELDS (Tùy nghiệp vụ)
    -- ==========================================
    -- TODO: Thêm các trường nghiệp vụ ở đây
    -- Ví dụ:
    -- email VARCHAR(255) NOT NULL UNIQUE,
    -- full_name VARCHAR(255),
    -- is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- ==========================================
    -- 3. AUDIT FIELDS (BẮT BUỘC)
    -- ==========================================
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- ==========================================
    -- 4. SOFT DELETE (BẮT BUỘC)
    -- ==========================================
    deleted_at  TIMESTAMPTZ NULL,
    deleted_by  CHAR(36) NULL,
    
    -- ==========================================
    -- 5. VERSIONING (BẮT BUỘC)
    -- ==========================================
    version     INT NOT NULL DEFAULT 1,
    
    -- ==========================================
    -- 6. INDEXES
    -- ==========================================
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    
    -- ==========================================
    -- 7. FOREIGN KEYS
    -- ==========================================
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='{Mô tả table}';

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-update updated_at
CREATE TRIGGER {table_name}_set_updated_at
BEFORE UPDATE ON {table_name}
FOR EACH ROW
SET NEW.updated_at = NOW();
```

---

## D. VALIDATION CHECKLIST

Trước khi commit migration, kiểm tra:

### ✅ Table Name
- [ ] Số nhiều (users, testcases, không phải user, testcase)
- [ ] snake_case (user_preferences, không phải UserPreferences)

### ✅ Primary Key
- [ ] Tên là `_id`
- [ ] Kiểu CHAR(36) hoặc UUID

### ✅ Foreign Keys
- [ ] Format: `{entity}_id` (user_id, testcase_id)
- [ ] snake_case
- [ ] Có index
- [ ] Có FOREIGN KEY constraint

### ✅ Timestamp Fields
- [ ] `_at` cho timestamp (created_at, expires_at)
- [ ] `_date` cho date only (birth_date)
- [ ] `_duration` cho duration (processing_duration_ms)

### ✅ Boolean Fields
- [ ] Prefix: is_, has_, can_
- [ ] NOT NULL với DEFAULT value

### ✅ Standard Fields
- [ ] `_id` (UUID PK)
- [ ] `tenant_id` (UUID NOT NULL)
- [ ] `created_at`, `updated_at` (TIMESTAMPTZ)
- [ ] `created_by`, `updated_by` (UUID NULL)
- [ ] `deleted_at`, `deleted_by` (TIMESTAMPTZ NULL, UUID NULL)
- [ ] `version` (INT DEFAULT 1)

### ✅ Indexes
- [ ] Index on `tenant_id`
- [ ] Index on all foreign keys
- [ ] Index on `created_at`
- [ ] Index on `deleted_at`
- [ ] Index on frequently filtered columns

### ✅ Triggers
- [ ] Trigger auto-update `updated_at`

---

## E. MIGRATION SCRIPT MẪU

### Tạo table mới (tuân thủ 100% convention):

```sql
-- File: /migrations/007_create_projects_table.sql

-- ============================================
-- Table: projects
-- Description: Project management
-- ============================================

CREATE TABLE projects (
    -- Identity & Tenancy
    _id         CHAR(36) PRIMARY KEY,
    tenant_id   CHAR(36) NOT NULL,
    
    -- Business fields
    code        VARCHAR(50) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    CHAR(36) NOT NULL,
    status      ENUM('active', 'archived', 'deleted') NOT NULL DEFAULT 'active',
    is_public   BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Audit fields
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  CHAR(36) NULL,
    updated_by  CHAR(36) NULL,
    
    -- Soft delete
    deleted_at  TIMESTAMPTZ NULL,
    deleted_by  CHAR(36) NULL,
    
    -- Versioning
    version     INT NOT NULL DEFAULT 1,
    
    -- Indexes
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_code (code),
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    UNIQUE KEY unique_tenant_code (tenant_id, code),
    
    -- Foreign keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(_id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(_id) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger
DELIMITER //
CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END//
DELIMITER ;

-- Rollback
-- DROP TRIGGER IF EXISTS projects_set_updated_at;
-- DROP TABLE IF EXISTS projects;
```

---

## F. QUY TẮC BỔ SUNG

### 1. Comment trong SQL

```sql
-- ✅ ĐÚNG: Comment rõ ràng
_id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
tenant_id CHAR(36) NOT NULL COMMENT 'Multi-tenancy: Company/Organization ID',
email VARCHAR(255) NOT NULL UNIQUE COMMENT 'User email address (unique across system)',
```

### 2. Enum Values

```sql
-- ✅ ĐÚNG: Lowercase, snake_case
status ENUM('active', 'inactive', 'pending', 'archived') NOT NULL,
priority ENUM('high', 'medium', 'low') NOT NULL,
```

❌ **SAI:**
```sql
status ENUM('Active', 'InActive', 'PENDING')  // Sai case
```

### 3. Default Values

```sql
-- ✅ ĐÚNG: Luôn set DEFAULT cho NOT NULL fields
is_active BOOLEAN NOT NULL DEFAULT TRUE,
status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
version INT NOT NULL DEFAULT 1,
```

---

## G. ANTI-PATTERNS (TRÁNH)

### ❌ Không dùng auto-increment cho PK

```sql
-- ❌ SAI
id INT AUTO_INCREMENT PRIMARY KEY

-- ✅ ĐÚNG
_id CHAR(36) PRIMARY KEY
```

### ❌ Không hard delete

```sql
-- ❌ SAI
DELETE FROM users WHERE _id = '...';

-- ✅ ĐÚNG
UPDATE users 
SET deleted_at = NOW(), deleted_by = '...' 
WHERE _id = '...';
```

### ❌ Không skip tenant_id

```sql
-- ❌ SAI
SELECT * FROM users WHERE _id = '...';

-- ✅ ĐÚNG
SELECT * FROM users 
WHERE tenant_id = '...' AND _id = '...' AND deleted_at IS NULL;
```

### ❌ Không update without version check

```sql
-- ❌ SAI
UPDATE users SET name = '...' WHERE _id = '...';

-- ✅ ĐÚNG
UPDATE users 
SET name = '...', version = version + 1 
WHERE _id = '...' AND version = 5;
```

---

**Last Updated:** 2026-01-09  
**Version:** 1.0.0  
**Maintained By:** VHV Platform Team

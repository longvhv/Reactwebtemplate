-- Migration: Create testcases table
-- Version: 006
-- Date: 2024-01-09
-- Description: Table for storing test cases with comprehensive testing information
-- Convention: Primary key MUST be "_id" with UUID type

-- Create testcases table
CREATE TABLE IF NOT EXISTS testcases (
    -- Primary identification (UUID)
    _id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    
    -- Human-readable code
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Human-readable code (e.g., TC-AUTH-001)',
    
    -- Basic information
    title VARCHAR(255) NOT NULL COMMENT 'Testcase title/name',
    description TEXT COMMENT 'Detailed description of what is being tested',
    category VARCHAR(100) NOT NULL COMMENT 'Category: Authentication, Users, Activities, etc.',
    
    -- Priority and status
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium' COMMENT 'Test priority level',
    status ENUM('passed', 'failed', 'pending', 'skipped') NOT NULL DEFAULT 'pending' COMMENT 'Current test status',
    
    -- Test details (stored as JSON arrays)
    preconditions JSON COMMENT 'Array of precondition strings',
    steps JSON COMMENT 'Array of test step strings',
    
    -- Results
    expected_result TEXT NOT NULL COMMENT 'Expected outcome of the test',
    actual_result TEXT COMMENT 'Actual outcome after test execution',
    
    -- Relations
    related_usecase_id CHAR(36) COMMENT 'Related usecase UUID',
    related_apis JSON COMMENT 'Array of related API endpoint strings',
    
    -- Metadata
    tags JSON COMMENT 'Array of tag strings for categorization',
    author VARCHAR(100) COMMENT 'Author/Creator of the testcase',
    last_tested_at TIMESTAMP NULL COMMENT 'Last test execution timestamp',
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp',
    
    -- Indexes for performance
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_created_at (created_at),
    INDEX idx_related_usecase (related_usecase_id),
    
    -- Foreign key constraint (if usecases table exists)
    CONSTRAINT fk_testcase_usecase 
        FOREIGN KEY (related_usecase_id) 
        REFERENCES usecases(_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Test cases for quality assurance';

-- Create fulltext index for search
ALTER TABLE testcases ADD FULLTEXT INDEX ft_search (title, description);

-- Insert sample data with UUIDs
INSERT INTO testcases (_id, code, title, description, category, priority, status, preconditions, steps, expected_result, actual_result, related_usecase_id, related_apis, tags, author, last_tested_at) VALUES
(UUID(), 'TC-AUTH-001', 'Đăng nhập thành công với email và mật khẩu hợp lệ', 'Kiểm tra chức năng đăng nhập khi người dùng nhập đúng thông tin', 'Authentication', 'high', 'passed', 
    '[\"Hệ thống đang chạy và database có sẵn\", \"Tài khoản test đã được tạo: test@example.com / Password123!\", \"Người dùng chưa đăng nhập\"]',
    '[\"Truy cập trang đăng nhập /login\", \"Nhập email: test@example.com\", \"Nhập password: Password123!\", \"Click nút Đăng nhập\"]',
    'Hệ thống chuyển hướng về trang Dashboard, hiển thị thông tin người dùng, lưu session token',
    'Pass - Đăng nhập thành công, redirect về /dashboard',
    NULL,
    '[\"POST /api/auth/login\"]',
    '[\"login\", \"authentication\", \"critical\"]',
    'QA Team',
    '2024-01-09 10:30:00'
),

(UUID(), 'TC-AUTH-002', 'Đăng nhập thất bại với email không tồn tại', 'Kiểm tra hệ thống xử lý đúng khi email không tồn tại trong database', 'Authentication', 'high', 'passed',
    '[\"Hệ thống đang chạy\", \"Email nonexist@example.com chưa được đăng ký\"]',
    '[\"Truy cập trang đăng nhập /login\", \"Nhập email: nonexist@example.com\", \"Nhập password: AnyPassword123\", \"Click nút Đăng nhập\"]',
    'Hiển thị thông báo lỗi \"Email hoặc mật khẩu không đúng\", không cho phép đăng nhập',
    'Pass - Hiển thị error message đúng',
    NULL,
    '[\"POST /api/auth/login\"]',
    '[\"login\", \"validation\", \"security\"]',
    'QA Team',
    '2024-01-09 11:00:00'
),

(UUID(), 'TC-USER-001', 'Xem danh sách người dùng', 'Kiểm tra chức năng hiển thị danh sách users với pagination', 'Users', 'high', 'passed',
    '[\"User đã đăng nhập với role Admin\", \"Database có ít nhất 10 users\"]',
    '[\"Truy cập trang /users\", \"Quan sát danh sách users\", \"Click nút Next page\", \"Click nút Previous page\"]',
    'Hiển thị danh sách users với avatar, name, email, role, status. Pagination hoạt động đúng',
    'Pass - UI hiển thị đầy đủ, pagination smooth',
    NULL,
    '[\"GET /api/users\"]',
    '[\"users\", \"list\", \"pagination\"]',
    'QA Team',
    '2024-01-09 14:20:00'
);

-- Create trigger to auto-update testcase statistics
DELIMITER //

CREATE TRIGGER update_testcase_stats_after_insert
AFTER INSERT ON testcases
FOR EACH ROW
BEGIN
    -- Log activity (if activities table exists)
    INSERT INTO activities (_id, user_id, action, entity_type, entity_id, description, created_at)
    VALUES (
        UUID(),
        @current_user_id,
        'create',
        'testcase',
        NEW._id,
        CONCAT('Created testcase: ', NEW.title),
        NOW()
    );
END//

CREATE TRIGGER update_testcase_stats_after_update
AFTER UPDATE ON testcases
FOR EACH ROW
BEGIN
    -- Log status change if status was updated
    IF OLD.status != NEW.status THEN
        INSERT INTO activities (_id, user_id, action, entity_type, entity_id, description, created_at)
        VALUES (
            UUID(),
            @current_user_id,
            'update',
            'testcase',
            NEW._id,
            CONCAT('Changed testcase status from ', OLD.status, ' to ', NEW.status),
            NOW()
        );
    END IF;
END//

DELIMITER ;

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON testcases TO 'app_user'@'localhost';

-- Rollback script (if needed)
-- DROP TRIGGER IF EXISTS update_testcase_stats_after_insert;
-- DROP TRIGGER IF EXISTS update_testcase_stats_after_update;
-- DROP TABLE IF EXISTS testcases;

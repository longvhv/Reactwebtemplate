# API Documentation: Testcases

## Overview
API endpoints for managing test cases in the VHV Platform.

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get All Testcases

**GET** `/testcases`

Get list of all test cases with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category (Authentication, Users, Activities, etc.) |
| status | string | No | Filter by status (passed, failed, pending, skipped) |
| priority | string | No | Filter by priority (high, medium, low) |
| search | string | No | Search in title and description |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20, max: 100) |

#### Request Example
```bash
curl -X GET "http://localhost:8080/api/v1/testcases?category=Authentication&status=passed" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response Success (200 OK)
```json
{
  "success": true,
  "data": {
    "testcases": [
      {
        "id": "TC-AUTH-001",
        "title": "Đăng nhập thành công với email và mật khẩu hợp lệ",
        "description": "Kiểm tra chức năng đăng nhập khi người dùng nhập đúng thông tin",
        "category": "Authentication",
        "priority": "high",
        "status": "passed",
        "preconditions": [
          "Hệ thống đang chạy và database có sẵn",
          "Tài khoản test đã được tạo: test@example.com / Password123!",
          "Người dùng chưa đăng nhập"
        ],
        "steps": [
          "Truy cập trang đăng nhập /login",
          "Nhập email: test@example.com",
          "Nhập password: Password123!",
          "Click nút Đăng nhập"
        ],
        "expectedResult": "Hệ thống chuyển hướng về trang Dashboard, hiển thị thông tin người dùng, lưu session token",
        "actualResult": "Pass - Đăng nhập thành công, redirect về /dashboard",
        "relatedUsecase": "UC-AUTH-001",
        "relatedAPI": ["POST /api/auth/login"],
        "tags": ["login", "authentication", "critical"],
        "author": "QA Team",
        "lastUpdated": "2024-01-09",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-09T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 20,
      "totalPages": 1
    },
    "statistics": {
      "total": 20,
      "passed": 15,
      "failed": 0,
      "pending": 3,
      "skipped": 2,
      "passRate": 75.0
    }
  },
  "message": "Testcases retrieved successfully"
}
```

#### Response Error (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid status value. Must be one of: passed, failed, pending, skipped"
  }
}
```

---

### 2. Get Testcase by ID

**GET** `/testcases/:id`

Get detailed information of a specific test case.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Testcase ID (e.g., TC-AUTH-001) |

#### Request Example
```bash
curl -X GET "http://localhost:8080/api/v1/testcases/TC-AUTH-001" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response Success (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "TC-AUTH-001",
    "title": "Đăng nhập thành công với email và mật khẩu hợp lệ",
    "description": "Kiểm tra chức năng đăng nhập khi người dùng nhập đúng thông tin",
    "category": "Authentication",
    "priority": "high",
    "status": "passed",
    "preconditions": [...],
    "steps": [...],
    "expectedResult": "...",
    "actualResult": "...",
    "relatedUsecase": "UC-AUTH-001",
    "relatedAPI": ["POST /api/auth/login"],
    "tags": ["login", "authentication", "critical"],
    "author": "QA Team",
    "lastUpdated": "2024-01-09",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-09T15:30:00Z"
  },
  "message": "Testcase retrieved successfully"
}
```

#### Response Error (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "TESTCASE_NOT_FOUND",
    "message": "Testcase with ID 'TC-AUTH-999' not found"
  }
}
```

---

### 3. Create Testcase

**POST** `/testcases`

Create a new test case.

#### Request Body
```json
{
  "title": "Kiểm tra đăng ký tài khoản",
  "description": "Test user registration flow",
  "category": "Authentication",
  "priority": "high",
  "status": "pending",
  "preconditions": [
    "Email chưa được đăng ký",
    "Hệ thống email hoạt động"
  ],
  "steps": [
    "Truy cập /register",
    "Nhập thông tin",
    "Click Đăng ký"
  ],
  "expectedResult": "Tài khoản được tạo thành công",
  "relatedUsecase": "UC-AUTH-002",
  "relatedAPI": ["POST /api/auth/register"],
  "tags": ["register", "authentication"]
}
```

#### Response Success (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "TC-AUTH-006",
    "title": "Kiểm tra đăng ký tài khoản",
    ...
  },
  "message": "Testcase created successfully"
}
```

#### Response Error (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "category",
        "message": "Category must be one of: Authentication, Users, Activities, etc."
      }
    ]
  }
}
```

---

### 4. Update Testcase

**PUT** `/testcases/:id`

Update an existing test case.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Testcase ID |

#### Request Body
```json
{
  "status": "passed",
  "actualResult": "Test passed successfully with all assertions"
}
```

#### Response Success (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "TC-AUTH-001",
    "status": "passed",
    "actualResult": "Test passed successfully with all assertions",
    "updatedAt": "2024-01-09T16:00:00Z"
  },
  "message": "Testcase updated successfully"
}
```

---

### 5. Delete Testcase

**DELETE** `/testcases/:id`

Delete a test case (soft delete).

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Testcase ID |

#### Response Success (200 OK)
```json
{
  "success": true,
  "message": "Testcase deleted successfully"
}
```

---

### 6. Export Testcases to Excel

**GET** `/testcases/export/excel`

Export test cases to Excel file with optional filters.

#### Query Parameters
Same as "Get All Testcases" endpoint.

#### Response Success (200 OK)
Returns Excel file with Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

```
Content-Disposition: attachment; filename="Testcase_2024-01-09.xlsx"
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

---

### 7. Get Testcase Statistics

**GET** `/testcases/statistics`

Get aggregated statistics for test cases.

#### Response Success (200 OK)
```json
{
  "success": true,
  "data": {
    "total": 20,
    "passed": 15,
    "failed": 0,
    "pending": 3,
    "skipped": 2,
    "passRate": 75.0,
    "coverageRate": 75.0,
    "byCategory": {
      "Authentication": {
        "total": 5,
        "passed": 4,
        "failed": 0,
        "pending": 1,
        "skipped": 0
      },
      "Users": {
        "total": 5,
        "passed": 4,
        "failed": 0,
        "pending": 1,
        "skipped": 0
      }
    },
    "byPriority": {
      "high": 10,
      "medium": 8,
      "low": 2
    }
  },
  "message": "Statistics retrieved successfully"
}
```

---

## Database Schema

### Table: `testcases`

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
    related_usecase_id CHAR(36) COMMENT 'Foreign key to usecases._id',
    related_apis JSON,
    tags JSON,
    author VARCHAR(100),
    last_tested_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_related_usecase (related_usecase_id),
    FOREIGN KEY (related_usecase_id) REFERENCES usecases(_id) ON DELETE SET NULL
);
```

**Field Descriptions:**
- `_id`: UUID primary key (convention: all tables use "_id")
- `code`: Human-readable unique identifier (e.g., TC-AUTH-001)
- `related_usecase_id`: Links to usecases table via UUID foreign key
- `last_tested_at`: Timestamp of last test execution

---

## Error Codes

| Code | Description |
|------|-------------|
| TESTCASE_NOT_FOUND | Testcase with given ID not found |
| VALIDATION_ERROR | Request validation failed |
| INVALID_PARAMETER | Invalid query parameter value |
| UNAUTHORIZED | Missing or invalid authentication token |
| FORBIDDEN | User doesn't have permission to perform this action |
| DUPLICATE_TESTCASE | Testcase with same ID already exists |
| DATABASE_ERROR | Database operation failed |

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Pagination is zero-indexed for `page` parameter
3. Soft delete is used - deleted testcases have `deleted_at` timestamp
4. Related APIs array contains API endpoint paths as strings
5. Tags array contains lowercase strings for filtering
6. Excel export includes 2 sheets: "Tổng hợp kết quả" and "Testcase"

---

## Implementation Status

- [x] GET /testcases - List testcases with filters
- [x] GET /testcases/:id - Get testcase by ID
- [x] POST /testcases - Create testcase
- [x] PUT /testcases/:id - Update testcase
- [x] DELETE /testcases/:id - Delete testcase (soft)
- [x] GET /testcases/export/excel - Export to Excel
- [x] GET /testcases/statistics - Get statistics
- [ ] PATCH /testcases/:id/status - Quick status update
- [ ] POST /testcases/bulk - Bulk create testcases
- [ ] DELETE /testcases/bulk - Bulk delete testcases

---

Last Updated: 2024-01-09
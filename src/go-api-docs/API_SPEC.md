# API Specification

## Base Information

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2026-01-03T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2026-01-03T10:30:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 100,
    "totalPages": 5
  },
  "timestamp": "2026-01-03T10:30:00Z"
}
```

## Authentication Module

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "emailAddress": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "acceptTerms": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "userId": "usr_1234567890",
    "emailAddress": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-01-03T10:30:00Z"
  },
  "message": "Registration successful"
}
```

**Error Codes:**
- `EMAIL_ALREADY_EXISTS` (409)
- `INVALID_EMAIL_FORMAT` (400)
- `WEAK_PASSWORD` (400)
- `VALIDATION_ERROR` (400)

---

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "emailAddress": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer",
    "user": {
      "userId": "usr_1234567890",
      "emailAddress": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    }
  }
}
```

**Error Codes:**
- `INVALID_CREDENTIALS` (401)
- `ACCOUNT_LOCKED` (403)
- `ACCOUNT_NOT_VERIFIED` (403)

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer"
  }
}
```

**Error Codes:**
- `INVALID_REFRESH_TOKEN` (401)
- `REFRESH_TOKEN_EXPIRED` (401)

---

### POST /auth/logout
Logout and invalidate tokens.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "emailAddress": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### POST /auth/reset-password
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## User Module

### GET /users/me
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "usr_1234567890",
    "emailAddress": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    "role": "user",
    "preferences": {
      "language": "en",
      "theme": "light",
      "notifications": true
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-03T10:30:00Z"
  }
}
```

---

### PUT /users/me
Update current user profile.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "language": "vi",
    "theme": "dark",
    "notifications": false
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "usr_1234567890",
    "emailAddress": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "preferences": {
      "language": "vi",
      "theme": "dark",
      "notifications": false
    },
    "updatedAt": "2026-01-03T10:35:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

### PUT /users/me/password
Change user password.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Codes:**
- `INVALID_CURRENT_PASSWORD` (401)
- `WEAK_PASSWORD` (400)

---

### GET /users
Get list of users (Admin only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20, max: 100)
- `search` (search by name or email)
- `role` (filter by role: user, admin)
- `sortBy` (createdAt, firstName, lastName)
- `sortOrder` (asc, desc)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "userId": "usr_1234567890",
      "emailAddress": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      "role": "user",
      "status": "active",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

## Platform Module

### GET /platform/settings
Get platform settings and configuration.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "settingsId": "settings_global",
    "platformName": "VHV Platform",
    "platformLogo": "https://example.com/logo.png",
    "supportedLanguages": ["en", "vi", "es", "fr", "zh", "ja", "ko"],
    "defaultLanguage": "en",
    "theme": {
      "primaryColor": "#6366f1",
      "backgroundColor": "#fafafa",
      "fontFamily": "Inter"
    },
    "features": {
      "authentication": true,
      "userManagement": true,
      "i18n": true,
      "darkMode": true
    },
    "updatedAt": "2026-01-03T10:30:00Z"
  }
}
```

---

### PUT /platform/settings
Update platform settings (Admin only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "platformName": "VHV Platform",
  "theme": {
    "primaryColor": "#6366f1",
    "backgroundColor": "#fafafa"
  },
  "features": {
    "darkMode": true
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "settingsId": "settings_global",
    "platformName": "VHV Platform",
    "theme": {
      "primaryColor": "#6366f1",
      "backgroundColor": "#fafafa"
    },
    "updatedAt": "2026-01-03T10:40:00Z"
  },
  "message": "Settings updated successfully"
}
```

---

### GET /platform/navigation
Get navigation menu items.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "navigationId": "nav_dashboard",
      "title": "Dashboard",
      "path": "/dashboard",
      "icon": "LayoutDashboard",
      "order": 1,
      "isActive": true,
      "permission": "view_dashboard",
      "children": []
    },
    {
      "navigationId": "nav_users",
      "title": "Users",
      "path": "/users",
      "icon": "Users",
      "order": 2,
      "isActive": true,
      "permission": "view_users",
      "children": [
        {
          "navigationId": "nav_users_list",
          "title": "User List",
          "path": "/users/list",
          "order": 1
        },
        {
          "navigationId": "nav_users_roles",
          "title": "Roles & Permissions",
          "path": "/users/roles",
          "order": 2
        }
      ]
    }
  ]
}
```

---

### POST /platform/navigation
Create new navigation item (Admin only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "title": "Analytics",
  "path": "/analytics",
  "icon": "BarChart",
  "order": 5,
  "isActive": true,
  "permission": "view_analytics",
  "parentId": null
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "navigationId": "nav_analytics",
    "title": "Analytics",
    "path": "/analytics",
    "icon": "BarChart",
    "order": 5,
    "isActive": true,
    "permission": "view_analytics",
    "createdAt": "2026-01-03T10:45:00Z"
  },
  "message": "Navigation item created"
}
```

---

### PUT /platform/navigation/:id
Update navigation item (Admin only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "title": "Analytics Dashboard",
  "order": 3,
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "navigationId": "nav_analytics",
    "title": "Analytics Dashboard",
    "order": 3,
    "isActive": false,
    "updatedAt": "2026-01-03T10:50:00Z"
  },
  "message": "Navigation item updated"
}
```

---

### DELETE /platform/navigation/:id
Delete navigation item (Admin only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Navigation item deleted"
}
```

## System Module

### GET /system/health
Health check endpoint (Public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-03T10:30:00Z",
    "version": "1.0.0",
    "services": {
      "database": "healthy",
      "cache": "healthy"
    }
  }
}
```

---

### GET /system/version
Get API version info (Public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "buildDate": "2026-01-03",
    "environment": "production",
    "goVersion": "go1.21.5"
  }
}
```

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `SUCCESS` | 200 | Operation successful |
| `CREATED` | 201 | Resource created |
| `BAD_REQUEST` | 400 | Invalid request |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already registered |
| `WEAK_PASSWORD` | 400 | Password doesn't meet requirements |
| `INVALID_TOKEN` | 401 | Invalid or expired token |

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Headers**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1704276000
  ```
- **Response when exceeded**: `429 Too Many Requests`

## CORS Configuration

**Allowed Origins:**
- `http://localhost:3000`
- `http://localhost:5173`
- `https://vhvplatform.com`

**Allowed Methods:**
- `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

**Allowed Headers:**
- `Content-Type`, `Authorization`, `X-Requested-With`

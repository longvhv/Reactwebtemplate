# API Testing with cURL

## Health Check

```bash
curl http://localhost:8080/health
```

## Authentication

### Register User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "acceptTerms": true
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Save the accessToken from the response.

### Get Current User (Protected)
```bash
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John Updated",
    "preferences": {
      "language": "vi",
      "theme": "dark",
      "notifications": false
    }
  }'
```

### Change Password
```bash
curl -X PUT http://localhost:8080/api/v1/users/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

### Logout
```bash
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## User Management (Admin Only)

### List Users
```bash
curl "http://localhost:8080/api/v1/users?page=1&pageSize=20&search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get User by ID
```bash
curl http://localhost:8080/api/v1/users/usr_1234567890 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update User
```bash
curl -X PUT http://localhost:8080/api/v1/users/usr_1234567890 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:8080/api/v1/users/usr_1234567890 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Platform Settings

### Get Settings
```bash
curl http://localhost:8080/api/v1/platform/settings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Settings (Admin Only)
```bash
curl -X PUT http://localhost:8080/api/v1/platform/settings \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platformName": "My Platform",
    "theme": {
      "primaryColor": "#6366f1",
      "backgroundColor": "#fafafa"
    }
  }'
```

## Navigation Management

### Get Navigation
```bash
curl http://localhost:8080/api/v1/platform/navigation \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Navigation Item (Admin Only)
```bash
curl -X POST http://localhost:8080/api/v1/platform/navigation \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Analytics",
    "path": "/analytics",
    "icon": "BarChart",
    "order": 5,
    "isActive": true,
    "permission": "view_analytics"
  }'
```

### Update Navigation Item (Admin Only)
```bash
curl -X PUT http://localhost:8080/api/v1/platform/navigation/nav_analytics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Analytics Dashboard",
    "order": 3
  }'
```

### Delete Navigation Item (Admin Only)
```bash
curl -X DELETE http://localhost:8080/api/v1/platform/navigation/nav_analytics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Testing Error Responses

### Unauthorized (No Token)
```bash
curl http://localhost:8080/api/v1/users/me
```

### Invalid Token
```bash
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer invalid_token"
```

### Forbidden (User trying to access admin endpoint)
```bash
curl http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer USER_TOKEN_NOT_ADMIN"
```

### Not Found
```bash
curl http://localhost:8080/api/v1/users/nonexistent_id \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Validation Error
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "invalid-email",
    "password": "weak"
  }'
```

## Batch Testing Script

Create a file `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"
TOKEN=""

# 1. Health Check
echo "1. Testing health check..."
curl -s $BASE_URL/health | jq

# 2. Register
echo -e "\n2. Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "acceptTerms": true
  }')
echo $REGISTER_RESPONSE | jq

# 3. Login
echo -e "\n3. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "test@example.com",
    "password": "Test123!@#"
  }')
echo $LOGIN_RESPONSE | jq

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
echo "Token: $TOKEN"

# 4. Get Current User
echo -e "\n4. Getting current user..."
curl -s $BASE_URL/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Get Platform Settings
echo -e "\n5. Getting platform settings..."
curl -s $BASE_URL/api/v1/platform/settings \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. Get Navigation
echo -e "\n6. Getting navigation..."
curl -s $BASE_URL/api/v1/platform/navigation \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\nAll tests completed!"
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

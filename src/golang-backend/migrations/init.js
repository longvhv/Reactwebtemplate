// Database initialization script for MongoDB
// Run this script to create initial collections and indexes

db = db.getSiblingDB('vhv_platform');

// Create user_accounts collection with indexes
db.createCollection('user_accounts');
db.user_accounts.createIndex({ "userId": 1 }, { unique: true });
db.user_accounts.createIndex({ "emailAddress": 1 }, { unique: true });
db.user_accounts.createIndex({ "role": 1 });
db.user_accounts.createIndex({ "status": 1 });
db.user_accounts.createIndex({ "createdAt": -1 });

// Create auth_sessions collection with indexes
db.createCollection('auth_sessions');
db.auth_sessions.createIndex({ "sessionId": 1 }, { unique: true });
db.auth_sessions.createIndex({ "userId": 1 });
db.auth_sessions.createIndex({ "refreshToken": 1 });
db.auth_sessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

// Create platform_settings collection
db.createCollection('platform_settings');
db.platform_settings.createIndex({ "settingsId": 1 }, { unique: true });

// Create navigation_items collection with indexes
db.createCollection('navigation_items');
db.navigation_items.createIndex({ "navigationId": 1 }, { unique: true });
db.navigation_items.createIndex({ "parentId": 1 });
db.navigation_items.createIndex({ "order": 1 });
db.navigation_items.createIndex({ "isActive": 1 });

// Insert default admin user (password: Admin123!)
db.user_accounts.insertOne({
    "userId": "usr_admin_001",
    "emailAddress": "admin@vhvplatform.com",
    "password": "$2a$10$YourHashedPasswordHere", // Hash this in production
    "firstName": "Admin",
    "lastName": "User",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    "role": "admin",
    "status": "active",
    "preferences": {
        "language": "en",
        "theme": "light",
        "notifications": true
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
});

// Insert default platform settings
db.platform_settings.insertOne({
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
    "updatedAt": new Date()
});

// Insert default navigation items
db.navigation_items.insertMany([
    {
        "navigationId": "nav_dashboard",
        "title": "Dashboard",
        "path": "/dashboard",
        "icon": "LayoutDashboard",
        "order": 1,
        "isActive": true,
        "permission": "view_dashboard",
        "parentId": "",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "navigationId": "nav_users",
        "title": "Users",
        "path": "/users",
        "icon": "Users",
        "order": 2,
        "isActive": true,
        "permission": "view_users",
        "parentId": "",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "navigationId": "nav_users_list",
        "title": "User List",
        "path": "/users/list",
        "icon": "List",
        "order": 1,
        "isActive": true,
        "permission": "view_users",
        "parentId": "nav_users",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "navigationId": "nav_users_roles",
        "title": "Roles & Permissions",
        "path": "/users/roles",
        "icon": "Shield",
        "order": 2,
        "isActive": true,
        "permission": "manage_roles",
        "parentId": "nav_users",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "navigationId": "nav_settings",
        "title": "Settings",
        "path": "/settings",
        "icon": "Settings",
        "order": 3,
        "isActive": true,
        "permission": "view_settings",
        "parentId": "",
        "createdAt": new Date(),
        "updatedAt": new Date()
    }
]);

print("Database initialization completed!");
print("Collections created: user_accounts, auth_sessions, platform_settings, navigation_items");
print("Default admin user created: admin@vhvplatform.com");
print("IMPORTANT: Change the admin password in production!");

/**
 * Database Schema Documentation
 * VHV Platform Database Structure
 */

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
  unique?: boolean;
  default?: string;
  description: string;
}

export interface TableSchema {
  name: string;
  description: string;
  featureGroup: string; // Nhóm tính năng: Authentication, Users, Activities, Notifications, Settings, etc.
  columns: TableColumn[];
}

export const databaseSchema: TableSchema[] = [
  {
    name: "users",
    description: "Bảng quản lý thông tin người dùng trong hệ thống",
    featureGroup: "Users",
    columns: [
      {
        name: "_id",
        type: "UUID",
        nullable: false,
        primaryKey: true,
        default: "gen_random_uuid()",
        description: "Mã định danh duy nhất của người dùng"
      },
      {
        name: "email",
        type: "VARCHAR(255)",
        nullable: false,
        unique: true,
        description: "Địa chỉ email của người dùng (dùng để đăng nhập)"
      },
      {
        name: "passwordHash",
        type: "VARCHAR(255)",
        nullable: false,
        description: "Mật khẩu đã được mã hóa (bcrypt)"
      },
      {
        name: "name",
        type: "VARCHAR(255)",
        nullable: false,
        description: "Họ và tên của người dùng"
      },
      {
        name: "avatar",
        type: "TEXT",
        nullable: true,
        description: "URL ảnh đại diện"
      },
      {
        name: "role",
        type: "VARCHAR(50)",
        nullable: false,
        default: "'user'",
        description: "Vai trò người dùng: admin, user, moderator"
      },
      {
        name: "status",
        type: "VARCHAR(20)",
        nullable: false,
        default: "'active'",
        description: "Trạng thái tài khoản: active, inactive, suspended"
      },
      {
        name: "phone",
        type: "VARCHAR(20)",
        nullable: true,
        description: "Số điện thoại"
      },
      {
        name: "location",
        type: "VARCHAR(255)",
        nullable: true,
        description: "Địa chỉ"
      },
      {
        name: "department",
        type: "VARCHAR(100)",
        nullable: true,
        description: "Phòng ban"
      },
      {
        name: "position",
        type: "VARCHAR(100)",
        nullable: true,
        description: "Chức vụ"
      },
      {
        name: "bio",
        type: "TEXT",
        nullable: true,
        description: "Giới thiệu bản thân"
      },
      {
        name: "emailVerified",
        type: "BOOLEAN",
        nullable: false,
        default: "false",
        description: "Trạng thái xác thực email"
      },
      {
        name: "lastLoginAt",
        type: "TIMESTAMP",
        nullable: true,
        description: "Thời điểm đăng nhập gần nhất"
      },
      {
        name: "createdAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm tạo tài khoản"
      },
      {
        name: "updatedAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm cập nhật cuối cùng"
      }
    ]
  },
  {
    name: "user_sessions",
    description: "Bảng quản lý phiên đăng nhập của người dùng",
    featureGroup: "Authentication",
    columns: [
      {
        name: "_id",
        type: "UUID",
        nullable: false,
        primaryKey: true,
        default: "gen_random_uuid()",
        description: "Mã định danh phiên đăng nhập"
      },
      {
        name: "userId",
        type: "UUID",
        nullable: false,
        foreignKey: {
          table: "users",
          column: "_id"
        },
        description: "Mã người dùng"
      },
      {
        name: "token",
        type: "VARCHAR(500)",
        nullable: false,
        unique: true,
        description: "JWT token"
      },
      {
        name: "ipAddress",
        type: "VARCHAR(45)",
        nullable: true,
        description: "Địa chỉ IP đăng nhập"
      },
      {
        name: "userAgent",
        type: "TEXT",
        nullable: true,
        description: "Thông tin trình duyệt/thiết bị"
      },
      {
        name: "deviceType",
        type: "VARCHAR(50)",
        nullable: true,
        description: "Loại thiết bị: desktop, mobile, tablet"
      },
      {
        name: "expiresAt",
        type: "TIMESTAMP",
        nullable: false,
        description: "Thời điểm hết hạn"
      },
      {
        name: "createdAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm tạo phiên"
      }
    ]
  },
  {
    name: "user_activities",
    description: "Bảng ghi lại các hoạt động của người dùng trong hệ thống",
    featureGroup: "Activities",
    columns: [
      {
        name: "_id",
        type: "BIGSERIAL",
        nullable: false,
        primaryKey: true,
        description: "Mã định danh hoạt động"
      },
      {
        name: "userId",
        type: "UUID",
        nullable: false,
        foreignKey: {
          table: "users",
          column: "_id"
        },
        description: "Mã người dùng thực hiện hoạt động"
      },
      {
        name: "action",
        type: "VARCHAR(100)",
        nullable: false,
        description: "Loại hành động: login, logout, create, update, delete"
      },
      {
        name: "resourceType",
        type: "VARCHAR(100)",
        nullable: true,
        description: "Loại tài nguyên bị tác động: user, post, comment"
      },
      {
        name: "resourceId",
        type: "VARCHAR(255)",
        nullable: true,
        description: "ID của tài nguyên bị tác động"
      },
      {
        name: "metadata",
        type: "JSONB",
        nullable: true,
        description: "Thông tin bổ sung dưới dạng JSON"
      },
      {
        name: "ipAddress",
        type: "VARCHAR(45)",
        nullable: true,
        description: "Địa chỉ IP thực hiện hành động"
      },
      {
        name: "createdAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm thực hiện hành động"
      }
    ]
  },
  {
    name: "notifications",
    description: "Bảng quản lý thông báo gửi tới người dùng",
    featureGroup: "Notifications",
    columns: [
      {
        name: "_id",
        type: "UUID",
        nullable: false,
        primaryKey: true,
        default: "gen_random_uuid()",
        description: "Mã định danh thông báo"
      },
      {
        name: "userId",
        type: "UUID",
        nullable: false,
        foreignKey: {
          table: "users",
          column: "_id"
        },
        description: "Mã người dùng nhận thông báo"
      },
      {
        name: "type",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Loại thông báo: info, warning, success, error"
      },
      {
        name: "title",
        type: "VARCHAR(255)",
        nullable: false,
        description: "Tiêu đề thông báo"
      },
      {
        name: "message",
        type: "TEXT",
        nullable: false,
        description: "Nội dung thông báo"
      },
      {
        name: "read",
        type: "BOOLEAN",
        nullable: false,
        default: "false",
        description: "Trạng thái đã đọc"
      },
      {
        name: "link",
        type: "VARCHAR(500)",
        nullable: true,
        description: "Đường dẫn liên quan đến thông báo"
      },
      {
        name: "createdAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm tạo thông báo"
      },
      {
        name: "readAt",
        type: "TIMESTAMP",
        nullable: true,
        description: "Thời điểm đọc thông báo"
      }
    ]
  },
  {
    name: "settings",
    description: "Bảng lưu trữ cài đặt cá nhân của người dùng",
    featureGroup: "Settings",
    columns: [
      {
        name: "_id",
        type: "UUID",
        nullable: false,
        primaryKey: true,
        default: "gen_random_uuid()",
        description: "Mã định danh cài đặt"
      },
      {
        name: "userId",
        type: "UUID",
        nullable: false,
        unique: true,
        foreignKey: {
          table: "users",
          column: "_id"
        },
        description: "Mã người dùng"
      },
      {
        name: "theme",
        type: "VARCHAR(20)",
        nullable: false,
        default: "'system'",
        description: "Chủ đề giao diện: light, dark, system"
      },
      {
        name: "language",
        type: "VARCHAR(10)",
        nullable: false,
        default: "'vi'",
        description: "Ngôn ngữ: vi, en, zh, ja, ko, es"
      },
      {
        name: "emailNotifications",
        type: "BOOLEAN",
        nullable: false,
        default: "true",
        description: "Bật/tắt thông báo qua email"
      },
      {
        name: "pushNotifications",
        type: "BOOLEAN",
        nullable: false,
        default: "true",
        description: "Bật/tắt thông báo đẩy"
      },
      {
        name: "twoFactorEnabled",
        type: "BOOLEAN",
        nullable: false,
        default: "false",
        description: "Trạng thái xác thực hai yếu tố"
      },
      {
        name: "preferences",
        type: "JSONB",
        nullable: true,
        description: "Các tùy chỉnh khác dưới dạng JSON"
      },
      {
        name: "createdAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm tạo"
      },
      {
        name: "updatedAt",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        description: "Thời điểm cập nhật"
      }
    ]
  }
];

/**
 * ERD Mermaid Diagram Definition
 */
export const erdDiagram = `graph TB
    users[users]
    user_sessions[user_sessions]
    user_activities[user_activities]
    notifications[notifications]
    settings[settings]
    
    users -->|userId| user_sessions
    users -->|userId| user_activities
    users -->|userId| notifications
    users -->|userId| settings
    
    classDef tableStyle fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff,rx:8px
    class users,user_sessions,user_activities,notifications,settings tableStyle
`;

/**
 * Get all unique feature groups
 */
export function getFeatureGroups(): string[] {
  return Array.from(new Set(databaseSchema.map(table => table.featureGroup))).sort();
}

/**
 * Generate ERD diagram for specific feature groups
 */
export function generateERDForGroups(groups: string[]): string {
  if (groups.length === 0) {
    return erdDiagram; // Return full diagram if no groups selected
  }

  // Filter tables by feature groups
  const filteredTables = databaseSchema.filter(table => groups.includes(table.featureGroup));
  
  if (filteredTables.length === 0) {
    return 'graph TB\n  empty[No tables in selected groups]';
  }

  // Build graph with filtered tables
  let diagram = 'graph TB\n';
  
  // Add nodes
  filteredTables.forEach(table => {
    diagram += `    ${table.name}[${table.name}]\n`;
  });
  
  diagram += '\n';
  
  // Add relationships (only between filtered tables)
  const tableNames = new Set(filteredTables.map(t => t.name));
  filteredTables.forEach(table => {
    table.columns
      .filter(col => col.foreignKey && tableNames.has(col.foreignKey.table))
      .forEach(col => {
        diagram += `    ${col.foreignKey!.table} -->|${col.name}| ${table.name}\n`;
      });
  });
  
  diagram += '\n';
  
  // Add styling
  diagram += '    classDef tableStyle fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff,rx:8px\n';
  diagram += `    class ${filteredTables.map(t => t.name).join(',')} tableStyle\n`;
  
  return diagram;
}
/**
 * System Modules Data
 * Defines modules and their business flows/features
 */

export interface BusinessFlow {
  _id: string;
  code: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  priority: 'high' | 'medium' | 'low';
  usecases: string[]; // Array of usecase IDs
  testcases: string[]; // Array of testcase IDs
  api_endpoints: string[]; // Array of API paths
  database_tables: string[]; // Array of table names
  screen_routes: string[]; // Frontend routes
  estimated_hours?: number;
  completion_percentage?: number;
}

export interface SystemModule {
  _id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'deprecated';
  flows: BusinessFlow[];
  created_at: string;
  updated_at: string;
}

// System Modules Data
export const systemModules: SystemModule[] = [
  {
    _id: '1',
    code: 'AUTH',
    name: 'Authentication & Authorization',
    description: 'Quản lý xác thực, phân quyền người dùng, sessions và tokens',
    icon: 'Shield',
    color: '#6366f1', // Indigo
    status: 'active',
    flows: [
      {
        _id: 'auth-flow-001',
        code: 'AUTH-LOGIN',
        name: 'Đăng nhập hệ thống',
        description: 'Luồng đăng nhập với email/password, social login, 2FA',
        status: 'completed',
        priority: 'high',
        usecases: ['UC001'],
        testcases: ['TC-AUTH-001', 'TC-AUTH-002'],
        api_endpoints: ['/api/auth/login', '/api/auth/verify-2fa'],
        database_tables: ['users', 'sessions', 'audit_logs'],
        screen_routes: ['/login', '/verify-2fa'],
        estimated_hours: 16,
        completion_percentage: 100,
      },
      {
        _id: 'auth-flow-002',
        code: 'AUTH-REGISTER',
        name: 'Đăng ký tài khoản',
        description: 'Luồng đăng ký user mới, email verification',
        status: 'completed',
        priority: 'high',
        usecases: ['UC002'],
        testcases: ['TC-AUTH-003', 'TC-AUTH-004'],
        api_endpoints: ['/api/auth/register', '/api/auth/verify-email'],
        database_tables: ['users', 'email_verification_tokens'],
        screen_routes: ['/register', '/verify-email'],
        estimated_hours: 12,
        completion_percentage: 100,
      },
      {
        _id: 'auth-flow-003',
        code: 'AUTH-RESET-PWD',
        name: 'Quên mật khẩu',
        description: 'Luồng reset password qua email',
        status: 'completed',
        priority: 'medium',
        usecases: ['UC003'],
        testcases: ['TC-AUTH-005'],
        api_endpoints: ['/api/auth/forgot-password', '/api/auth/reset-password'],
        database_tables: ['users', 'password_reset_tokens'],
        screen_routes: ['/forgot-password', '/reset-password'],
        estimated_hours: 8,
        completion_percentage: 100,
      },
      {
        _id: 'auth-flow-004',
        code: 'AUTH-LOGOUT',
        name: 'Đăng xuất',
        description: 'Luồng logout và invalidate session',
        status: 'completed',
        priority: 'medium',
        usecases: [],
        testcases: ['TC-AUTH-006'],
        api_endpoints: ['/api/auth/logout'],
        database_tables: ['sessions'],
        screen_routes: ['/login'],
        estimated_hours: 4,
        completion_percentage: 100,
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-09T00:00:00Z',
  },
  {
    _id: '2',
    code: 'USER',
    name: 'User Management',
    description: 'Quản lý người dùng, profile, roles, permissions',
    icon: 'Users',
    color: '#10b981', // Emerald
    status: 'active',
    flows: [
      {
        _id: 'user-flow-001',
        code: 'USER-LIST',
        name: 'Danh sách người dùng',
        description: 'Hiển thị danh sách users với filter, search, pagination',
        status: 'completed',
        priority: 'high',
        usecases: ['UC004'],
        testcases: ['TC-USER-001'],
        api_endpoints: ['/api/users'],
        database_tables: ['users'],
        screen_routes: ['/users'],
        estimated_hours: 12,
        completion_percentage: 100,
      },
      {
        _id: 'user-flow-002',
        code: 'USER-CREATE',
        name: 'Tạo người dùng mới',
        description: 'Admin tạo user mới với thông tin cơ bản',
        status: 'completed',
        priority: 'high',
        usecases: ['UC005'],
        testcases: ['TC-USER-002'],
        api_endpoints: ['/api/users'],
        database_tables: ['users', 'audit_logs'],
        screen_routes: ['/users/create'],
        estimated_hours: 8,
        completion_percentage: 100,
      },
      {
        _id: 'user-flow-003',
        code: 'USER-PROFILE',
        name: 'Xem & cập nhật profile',
        description: 'User xem và chỉnh sửa thông tin cá nhân',
        status: 'completed',
        priority: 'medium',
        usecases: [],
        testcases: ['TC-USER-003'],
        api_endpoints: ['/api/users/:id', '/api/users/:id/avatar'],
        database_tables: ['users', 'user_preferences'],
        screen_routes: ['/profile'],
        estimated_hours: 10,
        completion_percentage: 100,
      },
      {
        _id: 'user-flow-004',
        code: 'USER-ROLES',
        name: 'Quản lý roles & permissions',
        description: 'Gán roles, set permissions cho users',
        status: 'in-progress',
        priority: 'high',
        usecases: [],
        testcases: [],
        api_endpoints: ['/api/roles', '/api/permissions'],
        database_tables: ['users', 'roles', 'permissions', 'user_roles'],
        screen_routes: ['/users/:id/roles'],
        estimated_hours: 20,
        completion_percentage: 60,
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-09T00:00:00Z',
  },
  {
    _id: '3',
    code: 'DOCS',
    name: 'Documentation',
    description: 'Tài liệu kỹ thuật: API, Database, Usecases, Testcases',
    icon: 'BookOpen',
    color: '#f59e0b', // Amber
    status: 'active',
    flows: [
      {
        _id: 'docs-flow-001',
        code: 'DOCS-API',
        name: 'API Documentation',
        description: 'Tài liệu các API endpoints theo OpenAPI 3.0',
        status: 'completed',
        priority: 'high',
        usecases: ['UC006'],
        testcases: [],
        api_endpoints: ['/api/docs', '/api/openapi.json'],
        database_tables: ['api_endpoints'],
        screen_routes: ['/dev-docs?tab=api'],
        estimated_hours: 16,
        completion_percentage: 100,
      },
      {
        _id: 'docs-flow-002',
        code: 'DOCS-DATABASE',
        name: 'Database Schema',
        description: 'Tài liệu cấu trúc database với ERD diagram',
        status: 'completed',
        priority: 'high',
        usecases: [],
        testcases: [],
        api_endpoints: [],
        database_tables: ['ALL'],
        screen_routes: ['/dev-docs?tab=database', '/dev-docs?tab=erd'],
        estimated_hours: 12,
        completion_percentage: 100,
      },
      {
        _id: 'docs-flow-003',
        code: 'DOCS-USECASES',
        name: 'Usecases Documentation',
        description: 'Tài liệu các usecase nghiệp vụ với screenshot',
        status: 'in-progress',
        priority: 'medium',
        usecases: ['ALL'],
        testcases: [],
        api_endpoints: [],
        database_tables: ['usecases', 'screenshots'],
        screen_routes: ['/dev-docs?tab=usecases'],
        estimated_hours: 40,
        completion_percentage: 75,
      },
      {
        _id: 'docs-flow-004',
        code: 'DOCS-TESTCASES',
        name: 'Testcases Management',
        description: 'Quản lý và thực thi test cases',
        status: 'in-progress',
        priority: 'high',
        usecases: [],
        testcases: ['ALL'],
        api_endpoints: ['/api/testcases'],
        database_tables: ['testcases'],
        screen_routes: ['/dev-docs?tab=testcases'],
        estimated_hours: 24,
        completion_percentage: 80,
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-09T00:00:00Z',
  },
  {
    _id: '4',
    code: 'SETTINGS',
    name: 'System Settings',
    description: 'Cấu hình hệ thống, tenant settings, preferences',
    icon: 'Settings',
    color: '#8b5cf6', // Violet
    status: 'active',
    flows: [
      {
        _id: 'settings-flow-001',
        code: 'SETTINGS-SYSTEM',
        name: 'System Configuration',
        description: 'Cấu hình global system settings',
        status: 'planned',
        priority: 'medium',
        usecases: [],
        testcases: [],
        api_endpoints: ['/api/system-settings'],
        database_tables: ['system_settings'],
        screen_routes: ['/settings/system'],
        estimated_hours: 16,
        completion_percentage: 0,
      },
      {
        _id: 'settings-flow-002',
        code: 'SETTINGS-USER',
        name: 'User Preferences',
        description: 'User cá nhân tùy chỉnh preferences',
        status: 'completed',
        priority: 'low',
        usecases: [],
        testcases: [],
        api_endpoints: ['/api/user-preferences'],
        database_tables: ['user_preferences'],
        screen_routes: ['/settings/preferences'],
        estimated_hours: 8,
        completion_percentage: 100,
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-09T00:00:00Z',
  },
  {
    _id: '5',
    code: 'NOTIFY',
    name: 'Notifications',
    description: 'Hệ thống thông báo real-time cho users',
    icon: 'Bell',
    color: '#ef4444', // Red
    status: 'active',
    flows: [
      {
        _id: 'notify-flow-001',
        code: 'NOTIFY-INBOX',
        name: 'Notification Inbox',
        description: 'Hiển thị danh sách notifications của user',
        status: 'planned',
        priority: 'medium',
        usecases: [],
        testcases: [],
        api_endpoints: ['/api/notifications'],
        database_tables: ['notifications'],
        screen_routes: ['/notifications'],
        estimated_hours: 12,
        completion_percentage: 0,
      },
      {
        _id: 'notify-flow-002',
        code: 'NOTIFY-REALTIME',
        name: 'Real-time Notifications',
        description: 'Push notifications real-time qua WebSocket',
        status: 'planned',
        priority: 'low',
        usecases: [],
        testcases: [],
        api_endpoints: ['/ws/notifications'],
        database_tables: ['notifications'],
        screen_routes: [],
        estimated_hours: 20,
        completion_percentage: 0,
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-09T00:00:00Z',
  },
];

// Helper functions
export const getModuleById = (id: string): SystemModule | undefined => {
  return systemModules.find(m => m._id === id);
};

export const getModuleByCode = (code: string): SystemModule | undefined => {
  return systemModules.find(m => m.code === code);
};

export const getFlowById = (flowId: string): { module: SystemModule; flow: BusinessFlow } | undefined => {
  for (const module of systemModules) {
    const flow = module.flows.find(f => f._id === flowId);
    if (flow) {
      return { module, flow };
    }
  }
  return undefined;
};

export const getModuleStats = (module: SystemModule) => {
  const totalFlows = module.flows.length;
  const completedFlows = module.flows.filter(f => f.status === 'completed').length;
  const inProgressFlows = module.flows.filter(f => f.status === 'in-progress').length;
  const plannedFlows = module.flows.filter(f => f.status === 'planned').length;
  
  const totalUsecases = module.flows.reduce((sum, f) => sum + f.usecases.length, 0);
  const totalTestcases = module.flows.reduce((sum, f) => sum + f.testcases.length, 0);
  const totalAPIs = new Set(module.flows.flatMap(f => f.api_endpoints)).size;
  const totalTables = new Set(module.flows.flatMap(f => f.database_tables)).size;
  
  const avgCompletion = module.flows.reduce((sum, f) => sum + (f.completion_percentage || 0), 0) / totalFlows;
  
  return {
    totalFlows,
    completedFlows,
    inProgressFlows,
    plannedFlows,
    totalUsecases,
    totalTestcases,
    totalAPIs,
    totalTables,
    completionRate: Math.round(avgCompletion),
  };
};

export const getAllFlows = (): BusinessFlow[] => {
  return systemModules.flatMap(m => m.flows);
};

export const getFlowsByStatus = (status: BusinessFlow['status']): BusinessFlow[] => {
  return getAllFlows().filter(f => f.status === status);
};

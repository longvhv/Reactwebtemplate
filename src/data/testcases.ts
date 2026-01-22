/**
 * Testcases Data
 * 
 * Comprehensive test cases for VHV Platform
 * Categories: Authentication, Users, Activities, Notifications, Settings
 */

export interface Testcase {
  id: string;
  title: string;
  description: string;
  category: string;
  level1Group?: string; // Giao diện / Chức năng / An toàn thông tin
  level2Group?: string; // Nhóm chức năng cụ thể
  priority: 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  relatedUsecase?: string;
  relatedAPI?: string[];
  tags?: string[];
  author?: string;
  lastUpdated?: string;
}

export const testcaseCategories = [
  'Authentication',
  'Users',
  'Activities',
  'Notifications',
  'Settings',
  'API',
  'UI',
  'Integration'
];

export const testcases: Testcase[] = [
  // Authentication Test Cases
  {
    id: 'TC-AUTH-001',
    title: 'Đăng nhập thành công với email và mật khẩu hợp lệ',
    description: 'Kiểm tra chức năng đăng nhập khi người dùng nhập đúng thông tin',
    category: 'Authentication',
    level1Group: 'Chức năng',
    level2Group: 'Đăng nhập',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'Hệ thống đang chạy và database có sẵn',
      'Tài khoản test đã được tạo: test@example.com / Password123!',
      'Người dùng chưa đăng nhập'
    ],
    steps: [
      'Truy cập trang đăng nhập /login',
      'Nhập email: test@example.com',
      'Nhập password: Password123!',
      'Click nút "Đăng nhập"'
    ],
    expectedResult: 'Hệ thống chuyển hướng về trang Dashboard, hiển thị thông tin người dùng, lưu session token',
    actualResult: 'Pass - Đăng nhập thành công, redirect về /dashboard',
    relatedUsecase: 'UC-AUTH-001',
    relatedAPI: ['POST /api/auth/login'],
    tags: ['login', 'authentication', 'critical'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-AUTH-002',
    title: 'Đăng nhập thất bại với email không tồn tại',
    description: 'Kiểm tra hệ thống xử lý đúng khi email không tồn tại trong database',
    category: 'Authentication',
    level1Group: 'Chức năng',
    level2Group: 'Đăng nhập',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'Hệ thống đang chạy',
      'Email nonexist@example.com chưa được đăng ký'
    ],
    steps: [
      'Truy cập trang đăng nhập /login',
      'Nhập email: nonexist@example.com',
      'Nhập password: AnyPassword123',
      'Click nút "Đăng nhập"'
    ],
    expectedResult: 'Hiển thị thông báo lỗi "Email hoặc mật khẩu không đúng", không cho phép đăng nhập',
    actualResult: 'Pass - Hiển thị error message đúng',
    relatedUsecase: 'UC-AUTH-001',
    relatedAPI: ['POST /api/auth/login'],
    tags: ['login', 'validation', 'security'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-AUTH-003',
    title: 'Đăng nhập thất bại với mật khẩu sai',
    description: 'Kiểm tra bảo mật khi người dùng nhập sai mật khẩu',
    category: 'Authentication',
    level1Group: 'Chức năng',
    level2Group: 'Đăng nhập',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'Tài khoản test@example.com đã tồn tại với password chính xác',
      'Người dùng chưa đăng nhập'
    ],
    steps: [
      'Truy cập trang đăng nhập',
      'Nhập email: test@example.com',
      'Nhập password sai: WrongPassword123',
      'Click nút "Đăng nhập"'
    ],
    expectedResult: 'Hiển thị thông báo lỗi, không cho phép đăng nhập, tăng counter failed attempts',
    actualResult: 'Pass - Security validation hoạt động đúng',
    relatedUsecase: 'UC-AUTH-001',
    relatedAPI: ['POST /api/auth/login'],
    tags: ['login', 'security', 'validation'],
    author: 'Security Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-AUTH-004',
    title: 'Đăng ký tài khoản mới thành công',
    description: 'Kiểm tra flow đăng ký tài khoản người dùng mới',
    category: 'Authentication',
    level1Group: 'Chức năng',
    level2Group: 'Đăng ký',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'Email newuser@example.com chưa được sử dụng',
      'Hệ thống email đang hoạt động'
    ],
    steps: [
      'Truy cập trang đăng ký /register',
      'Nhập name: Test User',
      'Nhập email: newuser@example.com',
      'Nhập password: SecurePass123!',
      'Nhập confirm password: SecurePass123!',
      'Click nút "Đăng ký"'
    ],
    expectedResult: 'Tài khoản được tạo, gửi email xác thực, chuyển về trang login với thông báo success',
    actualResult: 'Pass - Registration flow hoạt động hoàn hảo',
    relatedUsecase: 'UC-AUTH-002',
    relatedAPI: ['POST /api/auth/register'],
    tags: ['register', 'authentication'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-AUTH-005',
    title: 'Đăng xuất thành công',
    description: 'Kiểm tra chức năng đăng xuất và xóa session',
    category: 'Authentication',
    level1Group: 'Chức năng',
    level2Group: 'Đăng xuất',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'Người dùng đã đăng nhập thành công'
    ],
    steps: [
      'Click menu user ở góc phải màn hình',
      'Click "Đăng xuất"',
      'Xác nhận đăng xuất nếu có popup'
    ],
    expectedResult: 'Session bị xóa, redirect về trang login, không thể access protected routes',
    actualResult: 'Pass - Logout và clear session thành công',
    relatedUsecase: 'UC-AUTH-003',
    relatedAPI: ['POST /api/auth/logout'],
    tags: ['logout', 'session'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },

  // Users Test Cases
  {
    id: 'TC-USER-001',
    title: 'Xem danh sách người dùng',
    description: 'Kiểm tra chức năng hiển thị danh sách users với pagination',
    category: 'Users',
    level1Group: 'Chức năng',
    level2Group: 'Quản lý người dùng',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập với role Admin',
      'Database có ít nhất 10 users'
    ],
    steps: [
      'Truy cập trang /users',
      'Quan sát danh sách users',
      'Click nút "Next page"',
      'Click nút "Previous page"'
    ],
    expectedResult: 'Hiển thị danh sách users với avatar, name, email, role, status. Pagination hoạt động đúng',
    actualResult: 'Pass - UI hiển thị đầy đủ, pagination smooth',
    relatedUsecase: 'UC-USER-001',
    relatedAPI: ['GET /api/users'],
    tags: ['users', 'list', 'pagination'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-USER-002',
    title: 'Tìm kiếm người dùng theo email',
    description: 'Kiểm tra chức năng search users',
    category: 'Users',
    level1Group: 'Chức năng',
    level2Group: 'Quản lý người dùng',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập',
      'Database có user test@example.com'
    ],
    steps: [
      'Truy cập /users',
      'Nhập "test@example.com" vào ô search',
      'Đợi debounce (300ms)'
    ],
    expectedResult: 'Danh sách lọc chỉ hiển thị user có email khớp với query',
    actualResult: 'Pass - Search hoạt động real-time',
    relatedUsecase: 'UC-USER-001',
    relatedAPI: ['GET /api/users?search=test'],
    tags: ['users', 'search'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-USER-003',
    title: 'Cập nhật thông tin profile',
    description: 'Kiểm tra chức năng edit user profile',
    category: 'Users',
    level1Group: 'Chức năng',
    level2Group: 'Quản lý người dùng',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập'
    ],
    steps: [
      'Truy cập /profile',
      'Click nút "Edit Profile"',
      'Thay đổi name: "Updated Name"',
      'Thay đổi phone: "0901234567"',
      'Click "Save Changes"'
    ],
    expectedResult: 'Thông tin được cập nhật trong database, hiển thị toast success, UI update ngay lập tức',
    actualResult: 'Pass - Update thành công với optimistic UI',
    relatedUsecase: 'UC-USER-002',
    relatedAPI: ['PATCH /api/users/:id'],
    tags: ['users', 'profile', 'update'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-USER-004',
    title: 'Upload avatar mới',
    description: 'Kiểm tra chức năng upload và crop avatar',
    category: 'Users',
    level1Group: 'Chức năng',
    level2Group: 'Quản lý người dùng',
    priority: 'medium',
    status: 'pending',
    preconditions: [
      'User đã đăng nhập',
      'Có file ảnh test (PNG/JPG < 5MB)'
    ],
    steps: [
      'Truy cập /profile',
      'Click vào avatar hiện tại',
      'Chọn file ảnh từ máy',
      'Crop ảnh trong modal',
      'Click "Upload"'
    ],
    expectedResult: 'Ảnh được upload lên server, URL cập nhật vào database, avatar mới hiển thị ngay',
    relatedUsecase: 'UC-USER-002',
    relatedAPI: ['POST /api/upload', 'PATCH /api/users/:id'],
    tags: ['users', 'avatar', 'upload'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-USER-005',
    title: 'Xóa người dùng (Admin)',
    description: 'Kiểm tra chức năng xóa user của Admin',
    category: 'Users',
    level1Group: 'Chức năng',
    level2Group: 'Quản lý người dùng',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập với role Admin',
      'Có user test để xóa (không phải admin)'
    ],
    steps: [
      'Truy cập /users',
      'Tìm user cần xóa',
      'Click icon "Delete"',
      'Confirm trong dialog "Are you sure?"',
      'Click "Delete" trong dialog'
    ],
    expectedResult: 'User bị xóa khỏi database, UI update real-time, hiển thị toast success',
    actualResult: 'Pass - Soft delete hoạt động đúng',
    relatedUsecase: 'UC-USER-003',
    relatedAPI: ['DELETE /api/users/:id'],
    tags: ['users', 'delete', 'admin'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },

  // Activities Test Cases
  {
    id: 'TC-ACT-001',
    title: 'Ghi nhận hoạt động đăng nhập',
    description: 'Kiểm tra hệ thống tự động log activity khi user login',
    category: 'Activities',
    level1Group: 'Chức năng',
    level2Group: 'Hoạt động',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'Database activities đang hoạt động'
    ],
    steps: [
      'Đăng nhập với user test@example.com',
      'Truy cập /activities',
      'Kiểm tra log mới nhất'
    ],
    expectedResult: 'Activity log "User logged in" được tạo với timestamp, IP, user agent đúng',
    actualResult: 'Pass - Activity tracking hoạt động tốt',
    relatedUsecase: 'UC-ACTIVITY-001',
    relatedAPI: ['POST /api/activities', 'GET /api/activities'],
    tags: ['activities', 'logging', 'audit'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-ACT-002',
    title: 'Xem lịch sử hoạt động của user',
    description: 'Kiểm tra trang activity logs',
    category: 'Activities',
    level1Group: 'Chức năng',
    level2Group: 'Hoạt động',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'User đã có ít nhất 5 activities'
    ],
    steps: [
      'Đăng nhập',
      'Truy cập /activities',
      'Scroll để xem danh sách'
    ],
    expectedResult: 'Hiển thị timeline activities với icon, timestamp, description đầy đủ',
    actualResult: 'Pass - Timeline UI đẹp và rõ ràng',
    relatedUsecase: 'UC-ACTIVITY-001',
    relatedAPI: ['GET /api/activities'],
    tags: ['activities', 'history'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },

  // Notifications Test Cases
  {
    id: 'TC-NOTIF-001',
    title: 'Tạo thông báo mới',
    description: 'Kiểm tra hệ thống gửi notification khi có event',
    category: 'Notifications',
    level1Group: 'Chức năng',
    level2Group: 'Thông báo',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập',
      'Notification service đang chạy'
    ],
    steps: [
      'Trigger một event (ví dụ: user mới đăng ký)',
      'Kiểm tra notification bell icon',
      'Click vào bell icon'
    ],
    expectedResult: 'Badge counter tăng, notification mới xuất hiện trong dropdown với title, message, timestamp',
    actualResult: 'Pass - Real-time notification hoạt động',
    relatedUsecase: 'UC-NOTIF-001',
    relatedAPI: ['POST /api/notifications', 'GET /api/notifications'],
    tags: ['notifications', 'real-time'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-NOTIF-002',
    title: 'Đánh dấu đã đọc notification',
    description: 'Kiểm tra chức năng mark as read',
    category: 'Notifications',
    level1Group: 'Chức năng',
    level2Group: 'Thông báo',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'User có ít nhất 1 notification chưa đọc'
    ],
    steps: [
      'Click notification bell',
      'Click vào notification chưa đọc',
      'Kiểm tra UI và database'
    ],
    expectedResult: 'Notification đổi trạng thái read=true, badge counter giảm, UI update',
    actualResult: 'Pass - Mark as read smooth',
    relatedUsecase: 'UC-NOTIF-001',
    relatedAPI: ['PATCH /api/notifications/:id'],
    tags: ['notifications', 'read'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },

  // Settings Test Cases
  {
    id: 'TC-SET-001',
    title: 'Thay đổi ngôn ngữ giao diện',
    description: 'Kiểm tra chức năng đa ngôn ngữ (i18n)',
    category: 'Settings',
    level1Group: 'Chức năng',
    level2Group: 'Cài đặt',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập'
    ],
    steps: [
      'Truy cập /settings',
      'Tìm mục "Language"',
      'Chọn "English" từ dropdown',
      'Click "Save"'
    ],
    expectedResult: 'UI chuyển sang tiếng Anh, setting lưu vào database, persist sau khi reload',
    actualResult: 'Pass - i18n hoạt động với 6 ngôn ngữ',
    relatedUsecase: 'UC-SET-001',
    relatedAPI: ['PATCH /api/settings/:userId'],
    tags: ['settings', 'i18n', 'language'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-SET-002',
    title: 'Bật/tắt email notifications',
    description: 'Kiểm tra toggle notification preferences',
    category: 'Settings',
    level1Group: 'Chức năng',
    level2Group: 'Cài đặt',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập'
    ],
    steps: [
      'Truy cập /settings',
      'Toggle switch "Email Notifications" thành OFF',
      'Click "Save Changes"',
      'Reload trang để verify'
    ],
    expectedResult: 'Setting emailNotifications=false lưu vào database, persist sau reload',
    actualResult: 'Pass - Toggle preferences hoạt động',
    relatedUsecase: 'UC-SET-001',
    relatedAPI: ['PATCH /api/settings/:userId'],
    tags: ['settings', 'notifications', 'preferences'],
    author: 'QA Team',
    lastUpdated: '2024-01-09'
  },

  // API Test Cases
  {
    id: 'TC-API-001',
    title: 'API Authentication với JWT Token',
    description: 'Kiểm tra protected API endpoints yêu cầu token',
    category: 'API',
    level1Group: 'An toàn thông tin',
    level2Group: 'API Authentication',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'Có valid JWT token từ login'
    ],
    steps: [
      'Gọi GET /api/users với header Authorization: Bearer {token}',
      'Verify response status 200',
      'Gọi lại không có token',
      'Verify response status 401'
    ],
    expectedResult: 'API trả về 200 khi có token hợp lệ, 401 khi không có token',
    actualResult: 'Pass - JWT middleware hoạt động đúng',
    relatedAPI: ['GET /api/users'],
    tags: ['api', 'authentication', 'security'],
    author: 'Backend Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-API-002',
    title: 'API Rate Limiting',
    description: 'Kiểm tra giới hạn số request từ một IP',
    category: 'API',
    level1Group: 'An toàn thông tin',
    level2Group: 'API Rate Limiting',
    priority: 'medium',
    status: 'pending',
    preconditions: [
      'Rate limit config: 100 requests/minute'
    ],
    steps: [
      'Gọi API endpoint 101 lần trong 1 phút',
      'Kiểm tra response của request thứ 101'
    ],
    expectedResult: 'Request thứ 101 trả về status 429 Too Many Requests',
    relatedAPI: ['GET /api/*'],
    tags: ['api', 'rate-limit', 'security'],
    author: 'Backend Team',
    lastUpdated: '2024-01-09'
  },

  // UI Test Cases - Giao diện
  {
    id: 'TC-UI-001',
    title: 'Hiển thị header và navigation',
    description: 'Kiểm tra giao diện header với logo, menu, user profile',
    category: 'UI',
    level1Group: 'Giao diện',
    level2Group: 'Layout',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập'
    ],
    steps: [
      'Truy cập trang Dashboard',
      'Quan sát header bar',
      'Kiểm tra logo, menu items, user avatar'
    ],
    expectedResult: 'Header hiển thị đầy đủ logo, navigation menu, user profile với avatar',
    actualResult: 'Pass - Header responsive và đẹp',
    tags: ['ui', 'layout', 'header'],
    author: 'UI Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-UI-002',
    title: 'Responsive mobile view',
    description: 'Kiểm tra giao diện responsive trên mobile',
    category: 'UI',
    level1Group: 'Giao diện',
    level2Group: 'Responsive',
    priority: 'high',
    status: 'passed',
    preconditions: [
      'Browser có DevTools'
    ],
    steps: [
      'Mở DevTools',
      'Chọn mobile device (iPhone 12)',
      'Kiểm tra các trang chính'
    ],
    expectedResult: 'UI adapt theo mobile viewport, hamburger menu hiển thị, touch-friendly',
    actualResult: 'Pass - Mobile UI hoàn hảo',
    tags: ['ui', 'responsive', 'mobile'],
    author: 'UI Team',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'TC-UI-003',
    title: 'Theme dark/light mode',
    description: 'Kiểm tra chức năng chuyển theme',
    category: 'UI',
    level1Group: 'Giao diện',
    level2Group: 'Theme',
    priority: 'medium',
    status: 'passed',
    preconditions: [
      'User đã đăng nhập'
    ],
    steps: [
      'Click theme toggle button',
      'Chuyển sang dark mode',
      'Quan sát UI',
      'Chuyển lại light mode'
    ],
    expectedResult: 'Theme chuyển đổi smooth, colors apply đúng, persist setting',
    actualResult: 'Pass - Theme system hoạt động tốt',
    tags: ['ui', 'theme', 'dark-mode'],
    author: 'UI Team',
    lastUpdated: '2024-01-09'
  }
];

/**
 * Get unique tags from all testcases
 */
export function getTestcaseTags(): string[] {
  const tagsSet = new Set<string>();
  testcases.forEach(tc => {
    tc.tags?.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}

/**
 * Get testcase statistics
 */
export function getTestcaseStats() {
  const total = testcases.length;
  const passed = testcases.filter(tc => tc.status === 'passed').length;
  const failed = testcases.filter(tc => tc.status === 'failed').length;
  const pending = testcases.filter(tc => tc.status === 'pending').length;
  const skipped = testcases.filter(tc => tc.status === 'skipped').length;

  return {
    total,
    passed,
    failed,
    pending,
    skipped,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0
  };
}
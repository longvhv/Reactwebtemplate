/**
 * User Stories Part 2 - Continuing from user-stories.ts
 * Contains remaining user stories for all modules
 */

import type {
  UserStory,
  AcceptanceCriterion,
  AcceptanceCriterionItem,
  DescriptionStep,
} from './user-stories';

// ============================================================================
// MODULE 2: USER MANAGEMENT (continued)
// ============================================================================

// USER-CREATE: Tạo người dùng mới
export const userCreateStories: UserStory[] = [
  {
    id: 'US-USER-002',
    flowId: 'user-flow-002',
    title: 'Tạo người dùng mới bởi Admin',
    
    asA: 'Quản trị viên hệ thống',
    iWant: 'Tạo tài khoản người dùng mới với thông tin cơ bản và phân quyền',
    soThat: 'Tôi có thể thêm nhân viên mới vào hệ thống và cấp quyền truy cập phù hợp',
    
    notes: 'Admin tạo user mà không cần email verification. Gửi welcome email với temporary password.',
    businessValue: 'Streamline onboarding process, admin có quyền kiểm soát user creation',
    technicalNotes: 'Generate random secure password, force change password on first login',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Form tạo người dùng',
        description: 'Admin điền thông tin để tạo user mới trong hệ thống',
        descriptionSteps: [
          { step: 'B1', content: 'Admin click button "Thêm người dùng mới" trên trang /users' },
          { step: 'B2', content: 'Hệ thống hiển thị modal/page /users/create với form' },
          { step: 'B3', content: 'Admin điền thông tin: Họ tên, Email, Số điện thoại, Chức vụ, Role' },
          { step: 'B4', content: 'Admin click "Tạo tài khoản" và hệ thống tạo user + gửi email' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form fields required:',
            details: [
              { content: 'Họ và tên: Enable. Minlength: 3, maxlength: 100 ký tự, required.' },
              { content: 'Email: Enable. Format email, maxlength: 100, unique trong database, required.' },
              { content: 'Số điện thoại: Optional. Format phone number (VN: 10-11 digits), maxlength: 15.' },
              { content: 'Chức vụ: Enable. Dropdown select từ danh sách positions có sẵn, required.' },
              { content: 'Phòng ban: Enable. Dropdown select từ danh sách departments, required.' },
              { content: 'Role: Enable. Multi-select checkboxes [Admin, Manager, User], default: User.' },
              { content: 'Avatar: Optional. Upload image (jpg, png), max 2MB, preview thumbnail.' },
            ],
          },
          {
            number: 2,
            description: 'Password handling:',
            details: [
              { content: 'Option 1: Tự động generate random password (12 ký tự: chữ hoa, thường, số, ký tự đặc biệt).' },
              { content: 'Option 2: Admin tự nhập password (validation rules apply).' },
              { content: 'Checkbox "Gửi email chứa temporary password": Checked by default.' },
              { content: 'Checkbox "Yêu cầu đổi password lần đầu đăng nhập": Checked by default.' },
              { content: 'Display generated password trong modal với button "Copy".' },
            ],
          },
          {
            number: 3,
            description: 'Validation rules:',
            details: [
              { content: 'Email chưa được sử dụng (realtime check khi blur field).' },
              { content: 'Số điện thoại phải đúng format (regex: /^[0-9]{10,11}$/).' },
              { content: 'Avatar image: Validate size (<2MB), format (jpg, png), dimensions (recommended: 400x400px).' },
              { content: 'Hiển thị error message màu đỏ ngay dưới field nếu validation fail.' },
            ],
          },
          {
            number: 4,
            description: 'Sau khi submit thành công:',
            details: [
              { content: 'Call API POST /api/users với body: {name, email, phone, position, department, role, avatar}.' },
              { content: 'Backend tạo user với status: "active", emailVerified: true (admin-created không cần verify).' },
              { content: 'Gửi welcome email chứa: Username, Temporary password, Link login, Instructions.' },
              { content: 'Ghi audit log: "Admin [admin_email] created user [user_email] at [timestamp]".' },
              { content: 'Redirect về /users với toast success: "Tạo người dùng thành công!"' },
              { content: 'Highlight row user mới tạo trong table.' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Upload và crop avatar',
        description: 'Admin upload và chỉnh sửa ảnh đại diện cho user',
        criteria: [
          {
            number: 1,
            description: 'Upload avatar flow:',
            details: [
              { content: 'Click vào placeholder avatar để mở file picker.' },
              { content: 'Accept: image/jpeg, image/png, max size: 2MB.' },
              { content: 'Sau khi select file, hiển thị crop modal với preview.' },
              { content: 'Crop tool: Zoom in/out, rotate, drag to adjust.' },
              { content: 'Aspect ratio: 1:1 (square), output: 400x400px.' },
              { content: 'Buttons: [Cancel] [Crop & Upload].' },
            ],
          },
          {
            number: 2,
            description: 'Validation và error handling:',
            details: [
              { content: 'File size >2MB: "Kích thước file quá lớn. Tối đa 2MB."' },
              { content: 'Invalid format: "Định dạng không hỗ trợ. Vui lòng chọn JPG hoặc PNG."' },
              { content: 'Upload failed: "Lỗi upload ảnh. Vui lòng thử lại."' },
              { content: 'Show upload progress bar: "Đang upload... 75%".' },
            ],
          },
        ],
        status: 'passed',
      },
    ],
    
    priority: 'high',
    status: 'completed',
    storyPoints: 5,
    estimatedHours: 8,
    tags: ['user-management', 'admin', 'create-user', 'onboarding', 'avatar-upload'],
    createdAt: '2024-01-16',
    updatedAt: '2024-01-21',
  },
];

// USER-PROFILE: Xem & cập nhật profile
export const userProfileStories: UserStory[] = [
  {
    id: 'US-USER-003',
    flowId: 'user-flow-003',
    title: 'Xem và cập nhật thông tin profile cá nhân',
    
    asA: 'Người dùng đã đăng nhập',
    iWant: 'Xem và chỉnh sửa thông tin cá nhân của tôi',
    soThat: 'Tôi có thể cập nhật thông tin liên hệ và preferences của mình',
    
    notes: 'User chỉ edit được một số field. Email change cần verify. Password change riêng section.',
    businessValue: 'User autonomy, reduce support tickets, improve data accuracy',
    technicalNotes: 'Optimistic UI update, rollback on error, debounce auto-save',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Xem thông tin profile',
        description: 'User xem đầy đủ thông tin profile của mình',
        descriptionSteps: [
          { step: 'B1', content: 'User click vào avatar/username ở header dropdown' },
          { step: 'B2', content: 'Chọn "Profile" hoặc "Tài khoản của tôi"' },
          { step: 'B3', content: 'Redirect đến /profile' },
          { step: 'B4', content: 'Hiển thị profile với tabs: Info, Security, Preferences' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Profile layout:',
            details: [
              { content: 'Header section: Avatar (clickable to change), Name, Email, Role badge, Member since date.' },
              { content: 'Tabs navigation: [Thông tin] [Bảo mật] [Tùy chỉnh].' },
              { content: 'Tab "Thông tin": Họ tên, Email, SĐT, Chức vụ, Phòng ban, Địa chỉ, Bio.' },
              { content: 'Tab "Bảo mật": Change password, Enable 2FA, Active sessions, Login history.' },
              { content: 'Tab "Tùy chỉnh": Language, Timezone, Theme, Notification preferences.' },
            ],
          },
          {
            number: 2,
            description: 'Editable fields (Tab Thông tin):',
            details: [
              { content: 'Họ và tên: Editable. Minlength: 3, maxlength: 100.' },
              { content: 'Email: Editable nhưng require verify. Hiển thị badge "Verified" nếu đã verify.' },
              { content: 'Số điện thoại: Editable. Format validation.' },
              { content: 'Địa chỉ: Editable. Maxlength: 255.' },
              { content: 'Bio: Editable. Textarea, maxlength: 500.' },
              { content: 'Chức vụ, Phòng ban: Read-only (chỉ admin mới edit được).' },
            ],
          },
          {
            number: 3,
            description: 'Edit mode:',
            details: [
              { content: 'Button "Chỉnh sửa": Click để enable edit mode, fields trở thành editable.' },
              { content: 'Edit mode: Hiển thị buttons [Hủy] [Lưu thay đổi].' },
              { content: 'Auto-save: Optional debounce 2s sau khi ngưng typing.' },
              { content: 'Unsaved changes warning: Nếu navigate away, confirm "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?"' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Cập nhật avatar',
        description: 'User upload và thay đổi ảnh đại diện',
        criteria: [
          {
            number: 1,
            description: 'Avatar upload:',
            details: [
              { content: 'Hover avatar: Hiển thị overlay "Thay đổi ảnh" với camera icon.' },
              { content: 'Click avatar: Mở file picker hoặc show options [Upload từ máy] [Chọn từ library] [Remove].' },
              { content: 'Crop modal: Sau khi select, hiển thị crop tool với zoom, rotate.' },
              { content: 'Upload progress: Show progress bar "Đang upload... 60%".' },
              { content: 'Success: Update avatar realtime trong UI, show toast "Avatar đã được cập nhật".' },
            ],
          },
          {
            number: 2,
            description: 'API call:',
            details: [
              { content: 'PUT /api/users/:id/avatar với FormData containing image file.' },
              { content: 'Response: {url: "https://cdn.app.com/avatars/user123.jpg"}.' },
              { content: 'Update user object trong Zustand store.' },
              { content: 'Update avatar trong header navbar realtime.' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 3,
        feature: 'Thay đổi mật khẩu',
        description: 'User thay đổi password hiện tại sang password mới',
        descriptionSteps: [
          { step: 'B1', content: 'User vào tab "Bảo mật" trong profile' },
          { step: 'B2', content: 'Click section "Thay đổi mật khẩu"' },
          { step: 'B3', content: 'Nhập: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận mật khẩu mới' },
          { step: 'B4', content: 'Click "Cập nhật mật khẩu", hệ thống verify và update' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form đổi mật khẩu:',
            details: [
              { content: 'Mật khẩu hiện tại: Input type password, required.' },
              { content: 'Mật khẩu mới: Input type password, minlength: 8, strength indicator, required.' },
              { content: 'Xác nhận mật khẩu mới: Phải match với mật khẩu mới.' },
              { content: 'Show/Hide password toggle icons cho mỗi field.' },
              { content: 'Password requirements checklist bên cạnh.' },
            ],
          },
          {
            number: 2,
            description: 'Validation và xử lý:',
            details: [
              { content: 'Verify mật khẩu hiện tại đúng trước khi allow change.' },
              { content: 'Nếu sai mật khẩu hiện tại: "Mật khẩu hiện tại không chính xác".' },
              { content: 'Mật khẩu mới không được trùng với mật khẩu cũ.' },
              { content: 'Sau update thành công: Logout tất cả sessions khác, chỉ giữ session hiện tại.' },
              { content: 'Gửi email notification: "Mật khẩu của bạn đã được thay đổi".' },
              { content: 'Toast success: "Mật khẩu đã được cập nhật thành công".' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 4,
        feature: 'Enable/Disable 2FA',
        description: 'User bật hoặc tắt xác thực 2 yếu tố',
        criteria: [
          {
            number: 1,
            description: 'Enable 2FA flow:',
            details: [
              { content: 'Tab Bảo mật: Section "Xác thực 2 yếu tố" với toggle switch.' },
              { content: 'Click "Bật 2FA": Hiển thị QR code để scan với Google Authenticator app.' },
              { content: 'Instructions: "1. Tải app Google Authenticator, 2. Scan QR code, 3. Nhập mã 6 số".' },
              { content: 'Input verify OTP: 6 ô số, auto-focus, auto-submit khi đủ 6 số.' },
              { content: 'Sau verify thành công: Hiển thị backup codes (10 codes), bắt buộc user save/download.' },
              { content: 'Confirmation: Checkbox "Tôi đã lưu backup codes" → Enable button "Hoàn tất".' },
            ],
          },
          {
            number: 2,
            description: 'Disable 2FA flow:',
            details: [
              { content: 'Click toggle "Tắt 2FA": Require nhập mật khẩu để confirm.' },
              { content: 'Modal confirm: "Bạn có chắc muốn tắt 2FA? Điều này làm giảm bảo mật tài khoản."' },
              { content: 'Sau disable: Gửi email notification, ghi audit log.' },
            ],
          },
        ],
        status: 'in-progress',
      },
    ],
    
    priority: 'medium',
    status: 'completed',
    storyPoints: 8,
    estimatedHours: 10,
    tags: ['user-management', 'profile', 'settings', '2fa', 'security', 'avatar'],
    createdAt: '2024-01-17',
    updatedAt: '2024-01-22',
  },
];

// USER-ROLES: Quản lý roles & permissions
export const userRolesStories: UserStory[] = [
  {
    id: 'US-USER-004',
    flowId: 'user-flow-004',
    title: 'Quản lý roles và permissions cho users',
    
    asA: 'Super Admin',
    iWant: 'Gán roles và set permissions chi tiết cho từng user',
    soThat: 'Tôi có thể kiểm soát quyền truy cập và thao tác của users trong hệ thống',
    
    notes: 'RBAC (Role-Based Access Control). Permissions granular level. Audit trail cho mọi thay đổi.',
    businessValue: 'Security, compliance, least privilege principle',
    technicalNotes: 'Permission check middleware, cache permissions in Redis, invalidate on change',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Gán roles cho user',
        description: 'Admin gán một hoặc nhiều roles cho user',
        descriptionSteps: [
          { step: 'B1', content: 'Admin vào chi tiết user tại /users/:id' },
          { step: 'B2', content: 'Navigate đến tab "Roles & Permissions"' },
          { step: 'B3', content: 'Click "Edit Roles", chọn roles từ dropdown multi-select' },
          { step: 'B4', content: 'Click "Save", hệ thống update và apply permissions ngay lập tức' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Role management UI:',
            details: [
              { content: 'Hiển thị danh sách current roles của user dưới dạng badges có thể remove (X).' },
              { content: 'Button "Add Role": Mở dropdown multi-select với danh sách available roles.' },
              { content: 'Roles list: Admin, Manager, Editor, Viewer, Guest (mỗi role có description tooltip).' },
              { content: 'Checkbox cho phép select multiple roles cùng lúc.' },
              { content: 'Role priority: Hiển thị số priority (1 = highest), có thể drag-drop để reorder.' },
            ],
          },
          {
            number: 2,
            description: 'Permissions preview:',
            details: [
              { content: 'Khi select role, hiển thị preview permissions sẽ được grant.' },
              { content: 'Permission categories: Users, Roles, Settings, Documents, Reports, Audit Logs.' },
              { content: 'Permission actions: Create, Read, Update, Delete, Export, Approve.' },
              { content: 'Table format: [Category] [Actions] - VD: Users: ✓Create ✓Read ✓Update ✗Delete.' },
              { content: 'Highlight conflicting permissions nếu có (warning icon).' },
            ],
          },
          {
            number: 3,
            description: 'Save và apply changes:',
            details: [
              { content: 'API: PUT /api/users/:id/roles với body: {roleIds: [1, 2, 3]}.' },
              { content: 'Backend: Update user_roles table, recalculate effective permissions.' },
              { content: 'Cache invalidation: Clear user permissions cache trong Redis.' },
              { content: 'Realtime update: Nếu user đang online, push notification để reload permissions.' },
              { content: 'Audit log: "Admin [admin_email] assigned roles [Admin, Manager] to user [user_email]".' },
              { content: 'Toast success: "Roles đã được cập nhật. User sẽ thấy thay đổi sau khi reload."' },
            ],
          },
        ],
        status: 'in-progress',
      },
      {
        id: 2,
        feature: 'Custom permissions override',
        description: 'Admin có thể override permissions specific cho user (không theo role)',
        criteria: [
          {
            number: 1,
            description: 'Permission override UI:',
            details: [
              { content: 'Section "Custom Permissions": Toggle switch "Enable custom permissions".' },
              { content: 'Khi enable: Hiển thị grid permissions với checkboxes cho từng action.' },
              { content: 'Inherited permissions (từ roles): Hiển thị với color muted, có badge "From Role".' },
              { content: 'Custom permissions: User có thể grant/revoke explicitly, highlight màu primary.' },
              { content: 'Conflict indicator: Nếu custom permission conflict với role permission, show warning.' },
            ],
          },
          {
            number: 2,
            description: 'Save custom permissions:',
            details: [
              { content: 'API: PUT /api/users/:id/permissions với body: {permissions: [{resource, action, granted}]}.' },
              { content: 'Backend: Store trong user_permissions table với priority cao hơn role permissions.' },
              { content: 'Permission resolution: Custom > Role > Default (deny).' },
              { content: 'Audit log: Track mọi thay đổi permissions với before/after state.' },
            ],
          },
        ],
        status: 'in-progress',
      },
    ],
    
    priority: 'high',
    status: 'in-progress',
    storyPoints: 13,
    estimatedHours: 20,
    tags: ['user-management', 'rbac', 'permissions', 'security', 'admin'],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-23',
  },
];

// ============================================================================
// MODULE 3: DOCUMENTATION
// ============================================================================

// DOCS-API: API Documentation
export const docsApiStories: UserStory[] = [
  {
    id: 'US-DOCS-001',
    flowId: 'docs-flow-001',
    title: 'Xem API Documentation theo chuẩn OpenAPI 3.0',
    
    asA: 'Developer/QA Engineer',
    iWant: 'Xem tài liệu chi tiết của tất cả API endpoints',
    soThat: 'Tôi có thể hiểu cách sử dụng API, request/response schema, và test API',
    
    notes: 'Tích hợp Swagger UI. Hỗ trợ try-it-out với authentication. Export OpenAPI JSON/YAML.',
    businessValue: 'Improve developer experience, reduce onboarding time, self-service documentation',
    technicalNotes: 'OpenAPI 3.0 spec, auto-generate từ code annotations, versioning support',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Hiển thị danh sách API endpoints',
        description: 'Developer xem tất cả endpoints được nhóm theo modules/tags',
        descriptionSteps: [
          { step: 'B1', content: 'Developer truy cập /dev-docs?tab=api' },
          { step: 'B2', content: 'Hệ thống load OpenAPI spec và render Swagger UI' },
          { step: 'B3', content: 'Endpoints được group theo tags: Auth, Users, Docs, Settings...' },
          { step: 'B4', content: 'Developer có thể expand/collapse từng endpoint để xem chi tiết' },
        ],
        criteria: [
          {
            number: 1,
            description: 'API documentation layout:',
            details: [
              { content: 'Sidebar navigation: List tất cả tags với số lượng endpoints (VD: Auth (4), Users (8)).' },
              { content: 'Main content: Hiển thị endpoints dưới dạng cards, mỗi card có: HTTP method, path, summary.' },
              { content: 'HTTP method colors: GET (blue), POST (green), PUT (orange), DELETE (red), PATCH (purple).' },
              { content: 'Endpoint card collapsible: Click để expand và xem chi tiết request/response.' },
              { content: 'Search box: Tìm kiếm endpoint theo path, method, tag, description.' },
            ],
          },
          {
            number: 2,
            description: 'Endpoint detail view:',
            details: [
              { content: 'Description: Mô tả chi tiết chức năng của endpoint.' },
              { content: 'Request: Headers, Path params, Query params, Request body (với JSON schema).' },
              { content: 'Response: Status codes (200, 400, 401, 500...) với example response JSON.' },
              { content: 'Authentication: Badge hiển thị "🔒 Requires Authentication" nếu cần auth.' },
              { content: 'Code examples: Tabs cho các ngôn ngữ [cURL] [JavaScript] [Python] [Go].' },
            ],
          },
          {
            number: 3,
            description: 'Try-it-out feature:',
            details: [
              { content: 'Button "Try it out": Cho phép test API trực tiếp từ documentation.' },
              { content: 'Input forms: Auto-generate từ schema cho params và request body.' },
              { content: 'Authentication: Input field để nhập Bearer token hoặc API key.' },
              { content: 'Execute button: Gửi request thực tế đến server.' },
              { content: 'Response viewer: Hiển thị status code, headers, body (formatted JSON).' },
              { content: 'Copy button: Copy request as cURL command.' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Export và versioning',
        description: 'Developer export OpenAPI spec và xem các phiên bản API',
        criteria: [
          {
            number: 1,
            description: 'Export functionality:',
            details: [
              { content: 'Button "Export": Dropdown [Download JSON] [Download YAML] [Copy to Clipboard].' },
              { content: 'Filename: openapi-spec-v1.0.0.json (với version number).' },
              { content: 'Validate spec trước khi export (OpenAPI 3.0 compliant).' },
            ],
          },
          {
            number: 2,
            description: 'API versioning:',
            details: [
              { content: 'Dropdown version selector: [v1.0.0 (Latest)] [v0.9.0] [v0.8.0].' },
              { content: 'Mỗi version có changelog: "Added X endpoints, Deprecated Y, Breaking changes..."' },
              { content: 'Deprecated endpoints: Hiển thị warning badge và migration guide.' },
            ],
          },
        ],
        status: 'passed',
      },
    ],
    
    priority: 'high',
    status: 'completed',
    storyPoints: 8,
    estimatedHours: 16,
    tags: ['documentation', 'api', 'openapi', 'swagger', 'developer-tools'],
    createdAt: '2024-01-19',
    updatedAt: '2024-01-24',
  },
];

// Export all story arrays
export const allUserStoriesPart2 = [
  ...userCreateStories,
  ...userProfileStories,
  ...userRolesStories,
  ...docsApiStories,
];

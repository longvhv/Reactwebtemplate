/**
 * User Stories Data - COMPLETE SYSTEM
 * Chuẩn quốc tế theo mô hình 3C (Card, Conversation, Confirmation)
 * Format: AS A ... I WANT ... SO THAT ...
 * Coverage: All 5 modules, 15 business flows
 */

export interface AcceptanceCriterionDetail {
  content: string;
  subItems?: string[];
}

export interface AcceptanceCriterionItem {
  number: number;
  description: string;
  details?: AcceptanceCriterionDetail[];
}

export interface DescriptionStep {
  step: string; // "B1", "B2", "B3", "B4"
  content: string;
}

export interface AcceptanceCriterion {
  id: number;
  feature: string;
  description: string;
  descriptionSteps?: DescriptionStep[];
  criteria: AcceptanceCriterionItem[];
  status: 'passed' | 'failed' | 'pending';
}

export interface UserStory {
  id: string;
  flowId: string;
  title: string;
  
  // Card - Cấu trúc chuẩn User Story
  asA: string;
  iWant: string;
  soThat: string;
  
  // Conversation - Thông tin thảo luận
  notes?: string;
  businessValue?: string;
  technicalNotes?: string;
  
  // Confirmation - Acceptance Criteria (Chi tiết theo format table)
  acceptanceCriteria: AcceptanceCriterion[];
  
  // Metadata
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'ready' | 'in-progress' | 'completed';
  storyPoints?: number;
  estimatedHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// MODULE 1: AUTHENTICATION & AUTHORIZATION
// ============================================================================

// AUTH-LOGIN: Đăng nhập hệ thống
export const authLoginStories: UserStory[] = [
  {
    id: 'US-AUTH-001',
    flowId: 'auth-flow-001',
    title: 'Đăng nhập với Email và Password',
    
    asA: 'Người dùng của hệ thống',
    iWant: 'Đăng nhập vào ứng dụng bằng email và mật khẩu',
    soThat: 'Tôi có thể truy cập vào các tính năng được bảo mật và quản lý dữ liệu cá nhân của mình',
    
    notes: 'User phải được redirect về dashboard sau khi đăng nhập thành công. Hỗ trợ Remember Me option.',
    businessValue: 'Cho phép user truy cập hệ thống một cách an toàn và quản lý thông tin cá nhân',
    technicalNotes: 'JWT tokens (access: 1h, refresh: 7d), bcrypt hash password, rate limiting 5 attempts/15min',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Form đăng nhập',
        description: 'Người dùng có thể nhập thông tin đăng nhập và xác thực vào hệ thống',
        descriptionSteps: [
          { step: 'B1', content: 'Sau khi truy cập hệ thống và chưa đăng nhập, người dùng được redirect đến trang /login' },
          { step: 'B2', content: 'Người dùng nhập các thông tin tài khoản: Email và Password' },
          { step: 'B3', content: 'Sau khi điền đầy đủ thông tin, người dùng click nút "Đăng nhập"' },
          { step: 'B4', content: 'Hệ thống kiểm tra credentials và redirect về Dashboard nếu hợp lệ' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form đăng nhập phải hiển thị đầy đủ các trường thông tin:',
            details: [
              { content: 'Email: Enable. Cho phép nhập email có dạng ......@......, maxlength: 100 ký tự.' },
              { content: 'Password: Enable. Cho phép nhập password dạng masked (***), minlength: 8 ký tự, maxlength: 50 ký tự.' },
              { content: 'Remember Me: Checkbox. Cho phép user chọn lưu session lâu hơn (30 ngày thay vì 1 ngày).' },
              { content: 'Button "Đăng nhập": Enable. Trigger submit form khi click.' },
              { content: 'Link "Quên mật khẩu?": Enable. Redirect đến /forgot-password.' },
            ],
          },
          {
            number: 2,
            description: 'Hệ thống validate dữ liệu trước khi submit:',
            details: [
              { content: 'Email không được để trống và phải đúng format email (regex validation).' },
              { content: 'Password không được để trống và phải có ít nhất 8 ký tự.' },
              { content: 'Hiển thị thông báo lỗi màu đỏ ngay dưới field nếu validation fail.' },
              { content: 'Disable nút "Đăng nhập" nếu form chưa valid.' },
            ],
          },
          {
            number: 3,
            description: 'Khi người dùng nhập đúng credentials:',
            details: [
              { content: 'Hệ thống call API POST /api/auth/login với body: {email, password, rememberMe}.' },
              { content: 'Backend tạo JWT access token (expire 1h) và refresh token (expire 7 ngày).' },
              { content: 'Lưu tokens vào localStorage: {accessToken, refreshToken, user}.' },
              { content: 'Redirect người dùng về trang Dashboard (/).' },
              { content: 'Ghi audit log: "User [email] logged in successfully at [timestamp] from IP [ip]".' },
            ],
          },
          {
            number: 4,
            description: 'Khi người dùng nhập sai credentials:',
            details: [
              { content: 'Hiển thị toast error: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại."' },
              { content: 'Không tiết lộ thông tin cụ thể (email tồn tại hay không) để tránh email enumeration attack.' },
              { content: 'Sau 5 lần đăng nhập sai liên tiếp, lock tài khoản trong 15 phút (rate limiting).' },
              { content: 'Hiển thị countdown timer: "Tài khoản tạm khóa. Vui lòng thử lại sau 14:59".' },
              { content: 'Ghi audit log: "Failed login attempt for [email] at [timestamp] from IP [ip]".' },
            ],
          },
          {
            number: 5,
            description: 'Các trường hợp đặc biệt:',
            details: [
              { content: 'Nếu tài khoản chưa verify email, hiển thị modal: "Vui lòng xác thực email trước khi đăng nhập" với nút "Gửi lại email xác thực".' },
              { content: 'Nếu tài khoản bị khóa (status: locked), hiển thị: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ support@domain.com".' },
              { content: 'Nếu tài khoản bị xóa (soft delete), hiển thị: "Tài khoản không tồn tại hoặc đã bị xóa".' },
              { content: 'Nếu network error, hiển thị: "Lỗi kết nối. Vui lòng kiểm tra internet và thử lại".' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Xác thực 2 yếu tố (2FA)',
        description: 'Người dùng đã bật 2FA phải nhập mã OTP sau khi đăng nhập',
        descriptionSteps: [
          { step: 'B1', content: 'Sau khi nhập đúng email/password, hệ thống kiểm tra user có bật 2FA không' },
          { step: 'B2', content: 'Nếu có, redirect đến trang /verify-2fa' },
          { step: 'B3', content: 'User nhập mã 6 số từ Google Authenticator hoặc email' },
          { step: 'B4', content: 'Hệ thống verify OTP và tạo session nếu đúng' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form nhập 2FA OTP:',
            details: [
              { content: 'Input OTP: 6 ô input riêng biệt, mỗi ô 1 số (0-9), auto-focus next field khi nhập.' },
              { content: 'Hiển thị countdown timer: "Mã OTP hết hạn sau 02:30".' },
              { content: 'Button "Xác nhận": Enable khi đã nhập đủ 6 số.' },
              { content: 'Link "Sử dụng backup code": Cho phép user dùng backup code nếu mất thiết bị 2FA.' },
            ],
          },
          {
            number: 2,
            description: 'Xử lý verify OTP:',
            details: [
              { content: 'Call API POST /api/auth/verify-2fa với body: {token, otp}.' },
              { content: 'Nếu OTP đúng, trả về access token và refresh token.' },
              { content: 'Nếu OTP sai, hiển thị error: "Mã OTP không chính xác. Còn X lần thử."' },
              { content: 'Sau 3 lần sai, logout user và yêu cầu đăng nhập lại.' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 3,
        feature: 'Xử lý session và token',
        description: 'Quản lý session, auto-refresh token, và xử lý expired session',
        criteria: [
          {
            number: 1,
            description: 'Session management:',
            details: [
              { content: 'Access token có thời hạn 1 giờ, refresh token có thời hạn 7 ngày (hoặc 30 ngày nếu Remember Me).' },
              { content: 'Tự động refresh access token khi gần hết hạn (còn 5 phút) bằng silent refresh.' },
              { content: 'Nếu refresh token hết hạn, logout user và redirect về /login với message: "Phiên đăng nhập đã hết hạn".' },
              { content: 'Lưu thông tin user vào Zustand store: {id, email, name, avatar, roles, permissions}.' },
            ],
          },
          {
            number: 2,
            description: 'Security measures:',
            details: [
              { content: 'Implement CSRF protection với anti-CSRF token trong header X-CSRF-Token.' },
              { content: 'Sử dụng httpOnly cookies cho refresh token nếu có thể (tránh XSS attack).' },
              { content: 'Rate limiting: Tối đa 5 login attempts trong 15 phút per IP address.' },
              { content: 'Detect suspicious login: Nếu login từ IP/device lạ, gửi email thông báo đến user.' },
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
    tags: ['authentication', 'security', 'core-feature', '2fa', 'jwt'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
];

// AUTH-REGISTER: Đăng ký tài khoản
export const authRegisterStories: UserStory[] = [
  {
    id: 'US-AUTH-002',
    flowId: 'auth-flow-002',
    title: 'Đăng ký tài khoản người dùng mới',
    
    asA: 'Người dùng mới chưa có tài khoản',
    iWant: 'Tạo một tài khoản mới với email, password và thông tin cá nhân',
    soThat: 'Tôi có thể bắt đầu sử dụng các dịch vụ của ứng dụng',
    
    notes: 'Cần verify email trước khi activate account. Không cho phép duplicate email.',
    businessValue: 'Tăng số lượng user base, mở rộng thị trường, onboarding mới',
    technicalNotes: 'Email verification token expires 24h, rate limit 3 registration requests/hour per IP',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Form đăng ký tài khoản',
        description: 'Người dùng điền thông tin để tạo tài khoản mới',
        descriptionSteps: [
          { step: 'B1', content: 'User truy cập trang /register từ link "Đăng ký" trên trang login' },
          { step: 'B2', content: 'User điền các thông tin: Họ tên, Email, Password, Confirm Password' },
          { step: 'B3', content: 'User đồng ý với Terms & Conditions bằng cách tick checkbox' },
          { step: 'B4', content: 'User click nút "Đăng ký" và hệ thống gửi email verification' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form đăng ký phải bao gồm các trường:',
            details: [
              { content: 'Họ và tên: Enable. Cho phép nhập freetext, minlength: 3 ký tự, maxlength: 100 ký tự.' },
              { content: 'Email: Enable. Cho phép điền email có dạng ......@......, maxlength: 100 ký tự, unique trong database.' },
              { content: 'Password: Enable. Minlength: 8 ký tự, maxlength: 50 ký tự, phải chứa: chữ hoa, chữ thường, số, ký tự đặc biệt.' },
              { content: 'Confirm Password: Enable. Phải trùng khớp hoàn toàn với Password.' },
              { content: 'Checkbox "Tôi đồng ý với Điều khoản sử dụng": Required. Phải tick để enable nút "Đăng ký".' },
            ],
          },
          {
            number: 2,
            description: 'Validation rules:',
            details: [
              { content: 'Email chưa được sử dụng trong hệ thống (check realtime khi blur field).' },
              { content: 'Password strength indicator: Hiển thị bar màu đỏ (Weak), vàng (Medium), xanh (Strong).' },
              { content: 'Password requirements checklist: ✓ 8+ ký tự, ✓ Chữ hoa, ✓ Chữ thường, ✓ Số, ✓ Ký tự đặc biệt.' },
              { content: 'Confirm Password phải match với Password (realtime validation).' },
            ],
          },
          {
            number: 3,
            description: 'Sau khi submit form thành công:',
            details: [
              { content: 'Call API POST /api/auth/register với body: {name, email, password}.' },
              { content: 'Backend tạo user mới với status: "pending_verification".' },
              { content: 'Gửi email verification chứa link: https://app.com/verify-email?token=[token].' },
              { content: 'Hiển thị success screen: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."' },
              { content: 'Cung cấp nút "Gửi lại email" (enable sau 60 giây).' },
            ],
          },
          {
            number: 4,
            description: 'Xử lý các trường hợp lỗi:',
            details: [
              { content: 'Email đã tồn tại: "Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập."' },
              { content: 'Password quá yếu: "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."' },
              { content: 'Rate limit exceeded: "Bạn đã đăng ký quá nhiều lần. Vui lòng thử lại sau 1 giờ."' },
              { content: 'Network error: "Lỗi kết nối. Vui lòng thử lại sau."' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Email verification',
        description: 'Xác thực email sau khi đăng ký để activate tài khoản',
        descriptionSteps: [
          { step: 'B1', content: 'User nhận email từ hệ thống với subject "Xác thực tài khoản"' },
          { step: 'B2', content: 'User click vào button "Xác thực email" trong email' },
          { step: 'B3', content: 'Browser mở link verification và call API verify' },
          { step: 'B4', content: 'Tài khoản được activate và redirect về trang login' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Email verification flow:',
            details: [
              { content: 'Email template chứa: Logo, Welcome message, Verification button, Support contact.' },
              { content: 'Verification link có format: https://app.com/verify-email?token=[jwt-token].' },
              { content: 'Token có thời hạn 24 giờ, encode thông tin: {userId, email, exp}.' },
              { content: 'Khi click link, call API GET /api/auth/verify-email?token=[token].' },
            ],
          },
          {
            number: 2,
            description: 'Xử lý verify thành công:',
            details: [
              { content: 'Update user status từ "pending_verification" → "active".' },
              { content: 'Ghi audit log: "Email verified for [email] at [timestamp]".' },
              { content: 'Hiển thị success page: "Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ."' },
              { content: 'Cung cấp button "Đăng nhập" redirect về /login.' },
              { content: 'Gửi welcome email: "Chào mừng bạn đến với [App Name]!"' },
            ],
          },
          {
            number: 3,
            description: 'Xử lý các trường hợp lỗi:',
            details: [
              { content: 'Token hết hạn (>24h): "Link xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email."' },
              { content: 'Token invalid: "Link xác thực không hợp lệ. Vui lòng kiểm tra lại email."' },
              { content: 'Email đã được verify: "Email này đã được xác thực trước đó. Bạn có thể đăng nhập."' },
              { content: 'Cung cấp nút "Gửi lại email xác thực" (rate limit: 3 lần/1 giờ).' },
            ],
          },
        ],
        status: 'passed',
      },
    ],
    
    priority: 'high',
    status: 'completed',
    storyPoints: 5,
    estimatedHours: 12,
    tags: ['registration', 'onboarding', 'email-verification', 'user-activation'],
    createdAt: '2024-01-11',
    updatedAt: '2024-01-16',
  },
];

// AUTH-RESET-PWD: Quên mật khẩu
export const authResetPasswordStories: UserStory[] = [
  {
    id: 'US-AUTH-003',
    flowId: 'auth-flow-003',
    title: 'Khôi phục mật khẩu khi quên',
    
    asA: 'Người dùng đã quên mật khẩu',
    iWant: 'Đặt lại mật khẩu của tôi thông qua email',
    soThat: 'Tôi có thể lấy lại quyền truy cập vào tài khoản của mình',
    
    notes: 'Reset token phải có expiration time ngắn (1h) để bảo mật. Invalidate tất cả sessions sau reset.',
    businessValue: 'Giảm số lượng support tickets về việc mất mật khẩu, improve UX',
    technicalNotes: 'Reset token: JWT expires 1h, one-time use only, bcrypt hash new password',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Request reset password',
        description: 'Người dùng yêu cầu reset mật khẩu thông qua email',
        descriptionSteps: [
          { step: 'B1', content: 'User click vào link "Quên mật khẩu?" trên trang /login' },
          { step: 'B2', content: 'Hệ thống hiển thị form nhập email tại /forgot-password' },
          { step: 'B3', content: 'User nhập email đã đăng ký và click "Gửi email"' },
          { step: 'B4', content: 'Hệ thống gửi email chứa reset password link' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form "Quên mật khẩu" phải có:',
            details: [
              { content: 'Email: Enable. Cho phép nhập email đã đăng ký, maxlength: 100 ký tự, format validation.' },
              { content: 'Button "Gửi email reset mật khẩu": Enable sau khi email valid.' },
              { content: 'Link "Quay lại đăng nhập": Redirect về /login.' },
              { content: 'Helper text: "Nhập email đã đăng ký, chúng tôi sẽ gửi link reset mật khẩu."' },
            ],
          },
          {
            number: 2,
            description: 'Xử lý request reset password:',
            details: [
              { content: 'Call API POST /api/auth/forgot-password với body: {email}.' },
              { content: 'Nếu email tồn tại, tạo reset token (JWT: {userId, email, exp: 1h}) và gửi email.' },
              { content: 'Nếu email không tồn tại, VẪN hiển thị success message để tránh email enumeration attack.' },
              { content: 'Success message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email reset mật khẩu trong vài phút."' },
              { content: 'Rate limit: Tối đa 3 requests trong 1 giờ per email address.' },
            ],
          },
          {
            number: 3,
            description: 'Email reset password:',
            details: [
              { content: 'Subject: "Yêu cầu đặt lại mật khẩu".' },
              { content: 'Body chứa: Logo, Thông báo reset request, Button "Đặt lại mật khẩu", Link expire warning (1h).' },
              { content: 'Reset link: https://app.com/reset-password?token=[jwt-token].' },
              { content: 'Note: "Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này."' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Reset password',
        description: 'Người dùng đặt lại mật khẩu mới sau khi click link trong email',
        descriptionSteps: [
          { step: 'B1', content: 'User click vào link reset password trong email' },
          { step: 'B2', content: 'Browser mở trang /reset-password?token=[token]' },
          { step: 'B3', content: 'User nhập mật khẩu mới và xác nhận mật khẩu' },
          { step: 'B4', content: 'Hệ thống update password và invalidate tất cả sessions' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Form reset password phải có:',
            details: [
              { content: 'Mật khẩu mới: Enable. Minlength: 8 ký tự, maxlength: 50 ký tự, phải chứa: chữ hoa, chữ thường, số, ký tự đặc biệt.' },
              { content: 'Xác nhận mật khẩu: Enable. Phải trùng khớp hoàn toàn với mật khẩu mới.' },
              { content: 'Password strength indicator: Bar màu hiển thị Weak/Medium/Strong.' },
              { content: 'Requirements checklist: ✓ 8+ ký tự, ✓ Chữ hoa, ✓ Chữ thường, ✓ Số, ✓ Ký tự đặc biệt.' },
              { content: 'Button "Đặt lại mật khẩu": Enable khi form valid.' },
            ],
          },
          {
            number: 2,
            description: 'Xử lý reset password thành công:',
            details: [
              { content: 'Call API POST /api/auth/reset-password với body: {token, newPassword}.' },
              { content: 'Backend verify token (check exp, signature, used status).' },
              { content: 'Hash password mới bằng bcrypt (salt rounds: 10) và update vào database.' },
              { content: 'Mark token là "used" để không thể dùng lại (one-time use).' },
              { content: 'Invalidate TẤT CẢ sessions hiện tại của user (logout khỏi mọi device).' },
              { content: 'Gửi confirmation email: "Mật khẩu của bạn đã được thay đổi thành công."' },
              { content: 'Ghi audit log: "Password reset for [email] at [timestamp]".' },
              { content: 'Redirect về /login với success message: "Mật khẩu đã được đặt lại. Vui lòng đăng nhập."' },
            ],
          },
          {
            number: 3,
            description: 'Xử lý các trường hợp lỗi:',
            details: [
              { content: 'Token hết hạn (>1h): "Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại."' },
              { content: 'Token đã được sử dụng: "Link này đã được sử dụng. Vui lòng yêu cầu link mới nếu cần."' },
              { content: 'Token invalid: "Link không hợp lệ. Vui lòng kiểm tra lại email."' },
              { content: 'Password quá yếu: Hiển thị requirements chưa đạt được.' },
              { content: 'Cung cấp link "Yêu cầu link mới" redirect về /forgot-password.' },
            ],
          },
        ],
        status: 'passed',
      },
    ],
    
    priority: 'medium',
    status: 'completed',
    storyPoints: 3,
    estimatedHours: 8,
    tags: ['password-reset', 'security', 'email', 'account-recovery'],
    createdAt: '2024-01-13',
    updatedAt: '2024-01-17',
  },
];

// AUTH-LOGOUT: Đăng xuất
export const authLogoutStories: UserStory[] = [
  {
    id: 'US-AUTH-004',
    flowId: 'auth-flow-004',
    title: 'Đăng xuất khỏi hệ thống',
    
    asA: 'Người dùng đã đăng nhập',
    iWant: 'Đăng xuất khỏi tài khoản của mình',
    soThat: 'Tôi có thể bảo vệ thông tin cá nhân khi rời khỏi máy tính hoặc kết thúc phiên làm việc',
    
    notes: 'Phải invalidate session ở cả frontend và backend. Clear localStorage và cookies.',
    businessValue: 'Đảm bảo security, cho phép user kiểm soát session của mình',
    technicalNotes: 'Invalidate refresh token in database, clear localStorage, revoke JWT',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Chức năng đăng xuất',
        description: 'Người dùng có thể đăng xuất khỏi hệ thống một cách an toàn',
        descriptionSteps: [
          { step: 'B1', content: 'User click vào avatar/username ở header để mở dropdown menu' },
          { step: 'B2', content: 'User chọn option "Đăng xuất" từ dropdown' },
          { step: 'B3', content: 'Hệ thống hiển thị confirmation dialog (optional)' },
          { step: 'B4', content: 'Sau khi confirm, hệ thống logout và redirect về /login' },
        ],
        criteria: [
          {
            number: 1,
            description: 'UI/UX đăng xuất:',
            details: [
              { content: 'Dropdown menu phải có icon đăng xuất (LogOut icon) và text "Đăng xuất".' },
              { content: 'Keyboard shortcut: Ctrl+Shift+Q (hoặc Cmd+Shift+Q trên Mac) để logout nhanh.' },
              { content: 'Confirmation dialog (optional): "Bạn có chắc muốn đăng xuất?" với buttons [Hủy] [Đăng xuất].' },
              { content: 'Hiển thị loading state khi đang process logout.' },
            ],
          },
          {
            number: 2,
            description: 'Xử lý logout:',
            details: [
              { content: 'Call API POST /api/auth/logout với header Authorization: Bearer [accessToken].' },
              { content: 'Backend invalidate refresh token trong database (mark as revoked).' },
              { content: 'Backend xóa session record trong bảng sessions.' },
              { content: 'Frontend clear localStorage: removeItem("accessToken", "refreshToken", "user").' },
              { content: 'Frontend clear Zustand store: authStore.reset().' },
              { content: 'Frontend clear cookies nếu có (document.cookie = ...).' },
            ],
          },
          {
            number: 3,
            description: 'Sau khi logout thành công:',
            details: [
              { content: 'Ghi audit log: "User [email] logged out at [timestamp]".' },
              { content: 'Redirect về trang /login.' },
              { content: 'Hiển thị toast success: "Đăng xuất thành công. Hẹn gặp lại!"' },
              { content: 'Reset tất cả cached data trong React Query (queryClient.clear()).' },
            ],
          },
          {
            number: 4,
            description: 'Auto logout scenarios:',
            details: [
              { content: 'Khi refresh token expire: Auto logout và hiển thị "Phiên đăng nhập đã hết hạn".' },
              { content: 'Khi detect API trả về 401 Unauthorized: Auto logout và redirect về /login.' },
              { content: 'Inactivity timeout (30 phút): Hiển thị modal "Bạn sẽ bị đăng xuất sau 1 phút do không hoạt động" với nút "Tiếp tục".' },
              { content: 'Concurrent session: Nếu user login từ device khác, có thể force logout session cũ (configurable).' },
            ],
          },
        ],
        status: 'passed',
      },
    ],
    
    priority: 'medium',
    status: 'completed',
    storyPoints: 2,
    estimatedHours: 4,
    tags: ['authentication', 'security', 'session-management', 'logout'],
    createdAt: '2024-01-14',
    updatedAt: '2024-01-18',
  },
];

// ============================================================================
// MODULE 2: USER MANAGEMENT
// ============================================================================

// USER-LIST: Danh sách người dùng
export const userListStories: UserStory[] = [
  {
    id: 'US-USER-001',
    flowId: 'user-flow-001',
    title: 'Xem danh sách người dùng với filter và pagination',
    
    asA: 'Quản trị viên hệ thống',
    iWant: 'Xem danh sách tất cả người dùng với khả năng search, filter và phân trang',
    soThat: 'Tôi có thể quản lý và theo dõi thông tin của tất cả users trong hệ thống',
    
    notes: 'Danh sách phải load nhanh với pagination. Hỗ trợ export CSV/Excel.',
    businessValue: 'Cho phép admin quản lý users hiệu quả, tracking user metrics',
    technicalNotes: 'API pagination: limit=20, server-side filtering, debounce search 300ms',
    
    acceptanceCriteria: [
      {
        id: 1,
        feature: 'Hiển thị danh sách users',
        description: 'Hiển thị bảng danh sách users với đầy đủ thông tin và actions',
        descriptionSteps: [
          { step: 'B1', content: 'Admin truy cập trang /users' },
          { step: 'B2', content: 'Hệ thống load danh sách users từ API với pagination' },
          { step: 'B3', content: 'Hiển thị table với các cột: Avatar, Name, Email, Role, Status, Created Date, Actions' },
          { step: 'B4', content: 'Admin có thể click vào từng row để xem chi tiết' },
        ],
        criteria: [
          {
            number: 1,
            description: 'Table structure:',
            details: [
              { content: 'Cột Avatar: Hiển thị ảnh đại diện 40x40px, fallback là initials (VD: "JD" cho John Doe).' },
              { content: 'Cột Name: Hiển thị họ tên đầy đủ, sortable, clickable để xem profile.' },
              { content: 'Cột Email: Hiển thị email, clickable để copy, có icon copy.' },
              { content: 'Cột Role: Badge màu hiển thị role (Admin: red, Manager: blue, User: gray).' },
              { content: 'Cột Status: Badge hiển thị status (Active: green, Inactive: gray, Locked: red).' },
              { content: 'Cột Created Date: Format "DD/MM/YYYY HH:mm", sortable.' },
              { content: 'Cột Actions: Dropdown menu với options: View, Edit, Deactivate, Delete.' },
            ],
          },
          {
            number: 2,
            description: 'Table features:',
            details: [
              { content: 'Checkbox column để select multiple users (bulk actions).' },
              { content: 'Select all checkbox ở header row.' },
              { content: 'Hover row: Highlight với background color subtle.' },
              { content: 'Click row: Redirect đến /users/:id (chi tiết user).' },
              { content: 'Loading skeleton khi đang fetch data.' },
              { content: 'Empty state: "Không tìm thấy người dùng nào" với icon và button "Thêm người dùng mới".' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 2,
        feature: 'Search và Filter',
        description: 'Tìm kiếm và lọc danh sách users theo nhiều tiêu chí',
        criteria: [
          {
            number: 1,
            description: 'Search box:',
            details: [
              { content: 'Input search: Placeholder "Tìm kiếm theo tên, email...", icon search, debounce 300ms.' },
              { content: 'Search realtime: Khi typing, gọi API với query param ?search=[keyword].' },
              { content: 'Clear button (X): Xuất hiện khi có text, click để clear search.' },
              { content: 'Highlight keyword: Bold text matching keyword trong results.' },
            ],
          },
          {
            number: 2,
            description: 'Filter options:',
            details: [
              { content: 'Filter by Role: Dropdown multi-select [Admin, Manager, User, Guest].' },
              { content: 'Filter by Status: Dropdown [All, Active, Inactive, Locked].' },
              { content: 'Filter by Created Date: Date range picker (From - To).' },
              { content: 'Button "Áp dụng filter" và "Reset filter".' },
              { content: 'Hiển thị số lượng active filters: Badge "3 filters applied".' },
            ],
          },
          {
            number: 3,
            description: 'API integration:',
            details: [
              { content: 'GET /api/users?page=1&limit=20&search=[keyword]&role=[role]&status=[status]&createdFrom=[date]&createdTo=[date]' },
              { content: 'Response: {data: User[], total: number, page: number, limit: number, totalPages: number}' },
              { content: 'Cache results trong React Query với staleTime: 5 minutes.' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 3,
        feature: 'Pagination',
        description: 'Phân trang danh sách users để cải thiện performance',
        criteria: [
          {
            number: 1,
            description: 'Pagination controls:',
            details: [
              { content: 'Hiển thị ở bottom của table: [Previous] [1] [2] [3] ... [10] [Next].' },
              { content: 'Current page: Highlight với background primary color.' },
              { content: 'Show max 5 page numbers: [1] [2] [3] [...] [10].' },
              { content: 'Previous/Next buttons: Disable khi ở first/last page.' },
              { content: 'Page size selector: Dropdown [10, 20, 50, 100] items per page.' },
              { content: 'Info text: "Showing 1-20 of 500 users".' },
            ],
          },
          {
            number: 2,
            description: 'Pagination behavior:',
            details: [
              { content: 'Update URL query params khi change page: /users?page=2&limit=20.' },
              { content: 'Preserve filter khi chuyển trang.' },
              { content: 'Scroll to top khi change page.' },
              { content: 'Show loading state khi fetch new page.' },
            ],
          },
        ],
        status: 'passed',
      },
      {
        id: 4,
        feature: 'Bulk actions và Export',
        description: 'Thực hiện actions trên nhiều users cùng lúc và export data',
        criteria: [
          {
            number: 1,
            description: 'Bulk actions:',
            details: [
              { content: 'Khi select users, hiển thị toolbar: "X users selected" với actions.' },
              { content: 'Actions: Deactivate, Activate, Delete, Assign Role, Send Email.' },
              { content: 'Confirmation modal trước khi execute bulk action.' },
              { content: 'Progress indicator khi processing: "Đang xử lý 5/10 users..."' },
              { content: 'Success toast: "Đã deactivate 10 users thành công".' },
            ],
          },
          {
            number: 2,
            description: 'Export functionality:',
            details: [
              { content: 'Button "Export": Dropdown [Export CSV, Export Excel].' },
              { content: 'Export current filter results hoặc selected users only.' },
              { content: 'Export columns: ID, Name, Email, Role, Status, Created Date.' },
              { content: 'Filename format: "users_export_2024-01-12.csv".' },
              { content: 'Show progress modal khi export large dataset.' },
            ],
          },
        ],
        status: 'passed',
      },
    ],
    
    priority: 'high',
    status: 'completed',
    storyPoints: 8,
    estimatedHours: 12,
    tags: ['user-management', 'admin', 'table', 'pagination', 'filter', 'export'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
];

// Continue with remaining user stories...
// Due to length constraints, I'll create the remaining stories in the next file

// Import stories from part 2
import {
  userCreateStories,
  userProfileStories,
  userRolesStories,
  docsApiStories,
} from './user-stories-part2';

/**
 * Get all user stories
 */
export function getAllUserStories(): UserStory[] {
  return [
    ...authLoginStories,
    ...authRegisterStories,
    ...authResetPasswordStories,
    ...authLogoutStories,
    ...userListStories,
    ...userCreateStories,
    ...userProfileStories,
    ...userRolesStories,
    ...docsApiStories,
  ];
}

/**
 * Get user stories by flow ID
 */
export function getUserStoriesByFlowId(flowId: string): UserStory[] {
  return getAllUserStories().filter((story) => story.flowId === flowId);
}

/**
 * Get user story by ID
 */
export function getUserStoryById(id: string): UserStory | undefined {
  return getAllUserStories().find((story) => story.id === id);
}

/**
 * Get statistics for user stories
 */
export function getUserStoryStats(flowId?: string) {
  const stories = flowId ? getUserStoriesByFlowId(flowId) : getAllUserStories();
  
  return {
    total: stories.length,
    completed: stories.filter((s) => s.status === 'completed').length,
    inProgress: stories.filter((s) => s.status === 'in-progress').length,
    ready: stories.filter((s) => s.status === 'ready').length,
    draft: stories.filter((s) => s.status === 'draft').length,
    totalStoryPoints: stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0),
    totalEstimatedHours: stories.reduce((sum, s) => sum + (s.estimatedHours || 0), 0),
  };
}
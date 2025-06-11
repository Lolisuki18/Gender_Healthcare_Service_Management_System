/\*\*

- CUSTOMER PROFILE SYSTEM - README
- =====================================
-
- Hệ thống quản lý hồ sơ khách hàng với kiến trúc component-based và tab navigation.
-
- ## KIẾN TRÚC TỔNG QUAN
-
- ```

  ```

- CustomerProfile (Container)
- ├── CustomerSideBar (Navigation)
- └── Content Components (Dynamic)
-     ├── DashboardContent
-     ├── ProfileContent
-     ├── AppointmentsContent
-     ├── PaymentHistoryContent
-     ├── MedicalHistoryContent
-     ├── InvoicesContent
-     ├── NotificationsContent
-     ├── SettingsContent
-     └── HelpContent
- ```

  ```

-
- ## CÁC COMPONENT CHÍNH
-
- ### 1. CustomerProfile.js (Root Component)
- - **Vai trò**: Container chính quản lý toàn bộ hệ thống
- - **State**: sidebarOpen, selectedMenuItem
- - **Chức năng**: Tab navigation, responsive sidebar, content rendering
- - **Design**: Glass morphism với gradient background
-
- ### 2. CustomerSideBar.js (Navigation)
- - **Vai trò**: Menu điều hướng với user profile display
- - **Features**: Expandable sub-menus, responsive drawer, hover effects
- - **State**: expandedItems cho sub-menu management
- - **UI**: Modern sidebar với avatar, status indicators
-
- ### 3. DashboardContent.js (Overview)
- - **Vai trò**: Trang tổng quan với statistics và activity feed
- - **Features**: Statistical cards, progress bars, recent activities
- - **Design**: Card-based layout với color-coded metrics
-
- ### 4. ProfileContent.js (Profile Management)
- - **Vai trò**: Quản lý thông tin cá nhân
- - **Features**: Edit mode, form validation, API integration
- - **State**: isEditing, formData, loading states
- - **Functions**: Profile update, avatar change, validation
-
- ### 5. AppointmentsContent.js (Appointment Management)
- - **Vai trò**: Quản lý lịch hẹn khám bệnh
- - **Features**: Appointment listing, status tracking, doctor info
- - **Design**: Card layout với status chips
-
- ### 6. PaymentHistoryContent.js (Payment Tracking)
- - **Vai trò**: Lịch sử giao dịch thanh toán
- - **Features**: Transaction timeline, payment methods, receipts
- - **Actions**: View details, download receipts
-
- ### 7. MedicalHistoryContent.js (Medical Records)
- - **Vai trò**: Lịch sử khám bệnh và hồ sơ y tế
- - **Features**: Medical timeline, doctor reports, prescriptions
- - **Actions**: Download medical documents
-
- ### 8. InvoicesContent.js (Invoice Management)
- - **Vai trò**: Quản lý hóa đơn và billing
- - **Features**: Invoice listing, payment status, PDF download
-
- ### 9. NotificationsContent.js (Notifications)
- - **Vai trò**: Quản lý thông báo hệ thống
- - **Features**: Read/unread status, categories, real-time updates
-
- ### 10. SettingsContent.js (Account Settings)
- - **Vai trò**: Cài đặt tài khoản và preferences
- - **Features**: Privacy settings, notifications, password change
- - ### 11. HelpContent.js (Support & FAQ)
- - **Vai trò**: Hỗ trợ khách hàng và FAQ
- - **Features**: Searchable FAQ, contact support, tutorials
-
- ### 12. QuestionsContent.js (Questions Management)
- - **Vai trò**: Quản lý danh sách câu hỏi đã đặt
- - **Features**: Hiển thị câu hỏi đã trả lời/chưa trả lời, form đặt câu hỏi mới
- - **State**: tabValue, searchTerm, categoryFilter, expandedQuestions
- - **Actions**: Tìm kiếm, lọc theo danh mục, xem câu trả lời chi tiết
-
- ## NAVIGATION SYSTEM
-
- ### Tab-Based Navigation (Không dùng React Router)
- - **State Management**: selectedMenuItem trong CustomerProfile
- - **Rendering**: renderContent() function với switch statement
- - **Benefits**: Giữ sidebar state, faster navigation, better UX
-
- ### Menu Structure:
- ```

  ```

- ├── Dashboard (Tổng quan)
- ├── Profile (Hồ sơ cá nhân)
- ├── Appointments (Lịch hẹn)
- ├── Medical History (Lịch sử khám)
- ├── Payments (Thanh toán)
- │ ├── Payment History \* │ └── Invoices
- ├── Notifications (Thông báo)
- ├── Settings (Cài đặt)
- ├── Help (Trợ giúp)
- └── Questions (Câu hỏi đã đặt)
- ```

  ```

-
- ## DESIGN SYSTEM
-
- ### Color Scheme:
- - **Primary**: Blue gradients (#3b82f6, #8b5cf6)
- - **Background**: Dark gradients (#0f172a, #1e293b)
- - **Accent**: Success green (#10b981, #059669)
- - **Text**: White với opacity variations
-
- ### UI Patterns:
- - **Glass Morphism**: backdrop-filter blur effects
- - **Card Layout**: Rounded corners, subtle shadows
- - **Gradients**: Linear gradients cho backgrounds
- - **Hover Effects**: Transform và color transitions
-
- ### Responsive Design:
- - **Desktop**: Persistent sidebar (280px width)
- - **Mobile**: Overlay drawer với toggle button
- - **Breakpoint**: Material-UI md breakpoint (900px)
-
- ## STATE MANAGEMENT
-
- ### Local State (React useState):
- - **CustomerProfile**: sidebarOpen, selectedMenuItem
- - **CustomerSideBar**: expandedItems
- - **ProfileContent**: isEditing, formData, isLoading, errors
-
- ### External Data:
- - **localStorage**: User data persistence
- - **API Services**: userService cho profile updates
- - **Context**: Có thể integrate với React Context cho global state
-
- ## STYLING APPROACH
-
- ### Material-UI Styling:
- - **styled() function**: Custom component styling
- - **sx prop**: Inline styling với theme integration
- - **Theme**: Material-UI theme với custom colors
-
- ### CSS Architecture:
- - **Component-scoped**: Styled components cho isolation
- - **Responsive**: useMediaQuery hooks
- - **Consistent**: Shared styled components (StyledPaper, etc.)
-
- ## BEST PRACTICES ĐƯỢC ÁP DỤNG
-
- 1.  **Component Separation**: Mỗi tab là một component riêng biệt
- 2.  **Reusable Styling**: Shared styled components
- 3.  **Responsive Design**: Mobile-first approach
- 4.  **Error Handling**: Form validation và error states
- 5.  **Loading States**: User feedback during async operations
- 6.  **Accessibility**: Proper ARIA labels và keyboard navigation
- 7.  **Performance**: Lazy loading và optimized renders
-
- ## FUTURE ENHANCEMENTS
-
- 1.  **Real-time Updates**: WebSocket integration
- 2.  **Advanced Filtering**: Search và filter capabilities
- 3.  **Export Features**: PDF/CSV export functionality
- 4.  **Offline Support**: Service worker integration
- 5.  **Analytics**: User behavior tracking
- 6.  **Internationalization**: Multi-language support
-
- ## DEVELOPMENT NOTES
-
- - **File Structure**: Organized theo feature-based approach
- - **Code Comments**: Chi tiết cho maintenance
- - **Error Handling**: Comprehensive error boundaries
- - **Testing**: Unit tests cho critical functions
- - **Performance**: Optimized re-renders và memory usage
-
- ## BẢNG MÀU Y TẾ MEDICAL GRADIENT
-
- Hệ thống sử dụng bảng màu y tế chuyên nghiệp với medical gradient để tạo cảm giác tin cậy và an tâm cho người dùng.
-
- ### Màu chính (Primary Medical Colors)
- - **Medical Blue** (#4A90E2) - Primary color cho buttons, headers, icons
- - **Medical Teal** (#1ABC9C) - Secondary color cho accent, success states
- - **Medical Green** (#4CAF50) - Success, health, positive status
- - **Medical Orange** (#F39C12) - Warning, pending, attention
-
- ### Gradients Y Tế
- - **Primary Gradient**: linear-gradient(45deg, #4A90E2, #1ABC9C)
- - **Success Gradient**: linear-gradient(45deg, #4CAF50, #2ECC71)
- - **Warning Gradient**: linear-gradient(45deg, #F39C12, #E67E22)
- - **Background Gradient**: linear-gradient(135deg, #F5F7FA 0%, #E3F2FD 50%, #F5F7FA 100%)
-
- ### Text Colors (Medical Theme)
- - **Primary Text**: #2D3748 (Dark blue-gray for maximum readability)
- - **Secondary Text**: #4A5568 (Medium blue-gray for descriptions)
- - **Muted Text**: #718096 (Light blue-gray for disabled states)
-
- ### Medical Component Styling
- - **Glass Morphism**: rgba(255, 255, 255, 0.95) background with blur(20px)
- - **Borders**: 1px solid rgba(74, 144, 226, 0.15)
- - **Shadows**: 0 8px 32px rgba(74, 144, 226, 0.1)
- - **Hover Effects**: Medical blue shadow with transform
-
- ### Quy tắc sử dụng Medical Theme
- - Medical Blue (#4A90E2) cho primary actions, selected states, icons chính
- - Medical Teal (#1ABC9C) cho secondary actions, refresh buttons, online status
- - Medical Green (#4CAF50) cho success states, completed status, verified badges
- - Medical Orange (#F39C12) cho warning states, pending status, attention
- - Gradient backgrounds cho buttons, avatars, status indicators
- - Light medical backgrounds cho cards và containers
- - Dark text (#2D3748) cho maximum readability trên nền sáng
- ***

> Medical theme này đảm bảo tính nhất quán, chuyên nghiệp và dễ đọc trong toàn bộ hệ thống CustomerProfile.

## TỔNG QUAN CHỨC NĂNG & CÔNG NGHỆ - CUSTOMER PROFILE

### 1. Chức năng chính

- Quản lý hồ sơ cá nhân khách hàng: xem, chỉnh sửa, cập nhật thông tin, đổi avatar.
- Quản lý lịch hẹn: xem danh sách, trạng thái, chi tiết từng cuộc hẹn, nhắc nhở tự động.
- Lịch sử khám bệnh: xem chi tiết từng lần khám, bác sĩ, chẩn đoán, ghi chú, tải báo cáo.
- Lịch sử thanh toán: xem các giao dịch, tổng tiền, phương thức, tải hóa đơn.
- Quản lý hóa đơn: xem, tải, kiểm tra trạng thái thanh toán.
- Quản lý thông báo: nhận, đọc, phân loại thông báo hệ thống.
- Cài đặt tài khoản: đổi mật khẩu, cài đặt quyền riêng tư, tùy chọn giao diện, thông báo.
- Hỗ trợ & FAQ: tra cứu câu hỏi thường gặp, liên hệ hỗ trợ, gửi phản hồi.
- Quản lý câu hỏi đã đặt: xem, tìm kiếm, lọc, đặt câu hỏi mới cho hệ thống.

### 2. Luồng thực hiện (User Flow)

1. Đăng nhập vào hệ thống, CustomerProfile được render làm container chính.
2. Sidebar hiển thị avatar, trạng thái, menu điều hướng các tab chức năng.
3. Người dùng chọn tab (ví dụ: Lịch sử khám), nội dung động được render ở vùng chính.
4. Các thao tác như chỉnh sửa hồ sơ, đặt câu hỏi, tải hóa đơn... đều thực hiện trực tiếp trên từng tab, không cần reload trang.
5. Tất cả trạng thái (tab đang chọn, sidebar mở/đóng, expanded menu...) được quản lý bằng React useState tại CustomerProfile và các component con.

### 3. Công nghệ sử dụng

- **ReactJS**: Xây dựng UI component-based, quản lý state cục bộ.
- **Material-UI (MUI)**: Thư viện UI chính, dùng styled() và sx prop để custom giao diện, responsive, glass morphism.
- **LocalStorage**: Lưu thông tin user, trạng thái đăng nhập.
- **API Service**: Giao tiếp backend để lấy/cập nhật thông tin hồ sơ, lịch hẹn, thanh toán...
- **Custom Hooks**: useLocalStorage, useAuthCheck hỗ trợ logic tái sử dụng.
- **Context API**: (Có thể mở rộng) cho global state như theme, user.

### 4. Kiến trúc tổng quan

- CustomerProfile.js: Container chính, quản lý state sidebar, tab, render nội dung động.
- CustomerSideBar.js: Sidebar điều hướng, avatar, trạng thái, menu động, sub-menu.
- Các content component: DashboardContent, ProfileContent, AppointmentsContent, MedicalHistoryContent, PaymentHistoryContent, InvoicesContent, NotificationsContent, SettingsContent, HelpContent, QuestionsContent.
- Mỗi content là một file riêng, chỉ render khi tab tương ứng được chọn.

### 5. Điểm nổi bật

- Giao diện hiện đại, chuẩn y tế, màu sắc hài hòa, dễ đọc.
- Tối ưu trải nghiệm: chuyển tab nhanh, không reload, sidebar responsive.
- Tách biệt rõ ràng logic từng chức năng, dễ bảo trì, mở rộng.
- Đầy đủ các tính năng quản lý thông tin, lịch sử, bảo mật, hỗ trợ khách hàng.

---

> Hệ thống CustomerProfile giúp khách hàng chủ động quản lý toàn bộ thông tin, lịch sử, giao dịch và hỗ trợ trong một giao diện hiện đại, trực quan, bảo mật cao.

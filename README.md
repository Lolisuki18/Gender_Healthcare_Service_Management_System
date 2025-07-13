# Hệ Thống Quản Lý Dịch Vụ Chăm Sóc Sức Khỏe Giới Tính

## 🏥 Giới thiệu dự án

**Hệ Thống Quản Lý Dịch Vụ Chăm Sóc Sức Khỏe Giới Tính** là nền tảng quản lý dịch vụ chăm sóc sức khỏe chuyên biệt, hỗ trợ đa dạng nghiệp vụ như tư vấn, xét nghiệm, quản lý chu kỳ, blog sức khỏe, đánh giá, nhắc uống thuốc, v.v. Dự án hướng tới việc cung cấp giải pháp toàn diện cho khách hàng, bác sĩ, nhân viên và quản trị viên.

---

## 🛠️ Công nghệ sử dụng

### Backend (Java Spring Boot)

- **Spring Boot 3.4.5**: Framework chính xây dựng RESTful API
- **Java 24**: Ngôn ngữ lập trình
- **Spring Data JPA**: ORM truy xuất dữ liệu
- **Spring Security + JWT**: Xác thực, phân quyền, bảo mật API
- **MSSQL**: Cơ sở dữ liệu chính
- **Lombok**: Giảm boilerplate code
- **Stripe Java SDK (v22.0.0)**: Thanh toán trực tuyến
- **Spring Mail**: Gửi email tự động
- **Log4j2**: Ghi log
- **OpenAPI/Swagger (v2.8.5)**: Tài liệu hóa API
- **WebFlux**: Hỗ trợ reactive API
- **Google Cloud Storage**: Lưu trữ file đám mây
- **Twilio SDK (v10.6.1)**: Gửi SMS
- **Google OAuth2**: Đăng nhập bằng Google
- **JJWT (v0.12.3)**: Xử lý JWT tokens

### Frontend (ReactJS)

- **React 19.1.0**: Xây dựng giao diện người dùng
- **Redux Toolkit (v2.8.2)**: Quản lý state phức tạp
- **Redux Thunk (v3.1.0)**: Xử lý bất đồng bộ
- **Redux Persist (v6.0.0)**: Lưu state vào localStorage
- **Material UI (MUI v7.1.0)**: Thư viện UI hiện đại
- **React Router v7.6.1**: Điều hướng SPA
- **Axios (v1.9.0)**: Giao tiếp API
- **Styled-components (v6.1.18)**: CSS-in-JS
- **Chart.js (v4.5.0) & Recharts (v2.15.4)**: Biểu đồ thống kê
- **jsPDF (v3.0.1) & html2canvas (v1.4.1)**: Xuất PDF
- **Dayjs (v1.11.13) & date-fns (v4.1.0)**: Xử lý ngày tháng
- **React Toastify (v11.0.5)**: Thông báo
- **CRACO (v7.1.0)**: Cấu hình build tùy chỉnh

---

## 🏗️ Kiến trúc tổng quan

### Kiến trúc Backend

- **RESTful API**: Kiến trúc REST chuẩn với JSON response
- **Layered Architecture**: Controller → Service → Repository → Model
- **Security Layer**: Spring Security với JWT authentication
- **Database Layer**: JPA/Hibernate với MSSQL
- **File Storage**: Hỗ trợ local storage và Google Cloud Storage
- **Payment Integration**: Stripe và MB Bank API
- **Email/SMS**: SendGrid và Twilio integration
- **AI Integration**: Google Gemini AI cho content moderation

### Kiến trúc Frontend

- **Component-Based**: Chia nhỏ UI thành các component tái sử dụng
- **State Management**: Redux Toolkit cho global state, Context API cho local state
- **Routing**: React Router với nested routes
- **UI Framework**: Material-UI với custom theme
- **API Integration**: Axios với interceptors và error handling
- **Responsive Design**: Mobile-first approach

---

## 🌟 Các tính năng chính

### Tính năng Backend

#### 🔐 Xác thực & Phân quyền

- **JWT Authentication**: Access token (4h) và refresh token (7 ngày)
- **Role-based Access Control**: ADMIN, STAFF, CONSULTANT, CUSTOMER
- **OAuth2 Integration**: Đăng nhập bằng Google
- **Password Reset**: Email và SMS OTP
- **Email Verification**: Xác thực tài khoản qua email

#### 👥 Quản lý người dùng

- **User Registration**: Đăng ký với validation
- **Profile Management**: Cập nhật thông tin cá nhân
- **Avatar Upload**: Hỗ trợ local và cloud storage
- **Account Status**: Quản lý trạng thái tài khoản

#### 🏥 Dịch vụ chăm sóc sức khỏe

- **STI Testing**: Quản lý xét nghiệm STI
- **Service Packages**: Gói xét nghiệm tổng hợp
- **Test Results**: Kết quả xét nghiệm với PDF export
- **Appointment Booking**: Đặt lịch xét nghiệm
- **Payment Processing**: Stripe và QR payment

#### 💬 Hệ thống tư vấn

- **Consultant Profiles**: Hồ sơ chuyên gia tư vấn
- **Booking Management**: Đặt lịch tư vấn
- **Video Meeting**: Tích hợp meet URL
- **Status Tracking**: PENDING, CONFIRMED, COMPLETED, CANCELED

#### 📝 Quản lý blog

- **Content Creation**: Tạo bài viết với rich text
- **Image Upload**: Hỗ trợ multiple images
- **Moderation System**: Duyệt bài trước khi publish
- **Category Management**: Phân loại bài viết

#### 📊 Hệ thống đánh giá & phản hồi

- **Multi-target Rating**: Đánh giá consultant, service, package
- **Rating Summary**: Thống kê đánh giá
- **Staff Response**: Phản hồi từ nhân viên
- **Star Distribution**: Phân bố sao đánh giá

#### 🔄 Hệ thống chu kỳ & nhắc nhở

- **Menstrual Cycle Tracking**: Theo dõi chu kỳ kinh nguyệt
- **Ovulation Prediction**: Dự đoán ngày rụng trứng
- **Pill Reminder**: Nhắc nhở uống thuốc
- **Notification System**: Email và SMS notifications

#### 💳 Hệ thống thanh toán

- **Stripe Integration**: Thanh toán thẻ quốc tế
- **MB Bank API**: QR payment
- **Payment History**: Lịch sử giao dịch
- **Refund Processing**: Xử lý hoàn tiền

#### 📧 Hệ thống liên lạc

- **Email Service**: SendGrid integration
- **SMS Service**: Twilio integration
- **Automated Notifications**: Thông báo tự động
- **Template System**: Email templates

### Tính năng Frontend

#### 🎨 Giao diện người dùng

- **Responsive Design**: Tương thích mobile/desktop
- **Material Design**: UI/UX hiện đại
- **Dark/Light Theme**: Tùy chọn giao diện
- **Loading States**: Skeleton loading
- **Error Handling**: User-friendly error messages

#### 🔐 Giao diện xác thực

- **Login/Register**: Form validation
- **OAuth Buttons**: Đăng nhập Google
- **Password Reset**: Step-by-step flow
- **Profile Management**: Upload avatar

#### 📱 Dashboard theo vai trò

- **Admin Dashboard**: Quản lý toàn hệ thống
- **Staff Dashboard**: Xử lý xét nghiệm và phản hồi
- **Consultant Dashboard**: Quản lý lịch tư vấn
- **Customer Dashboard**: Theo dõi dịch vụ cá nhân

#### 📊 Hiển thị dữ liệu

- **Charts & Graphs**: Biểu đồ thống kê
- **Progress Tracking**: Theo dõi tiến độ
- **Analytics**: Báo cáo chi tiết
- **Export Features**: PDF, Excel export

#### 🔔 Tính năng thời gian thực

- **Notifications**: Toast notifications
- **Status Updates**: Real-time status changes
- **Connection Monitoring**: Network status
- **Auto-refresh**: Tự động cập nhật dữ liệu

---

## 🔒 Bảo mật & xác thực

### Tính năng bảo mật

- **JWT Token Management**: Quản lý token an toàn
- **Role-based Authorization**: Phân quyền chi tiết
- **Input Validation**: Validation phía server
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CORS Configuration**: Cross-origin resource sharing
- **Rate Limiting**: Giới hạn tốc độ API
- **Audit Logging**: Ghi log sự kiện bảo mật

### Quy trình xác thực

1. **Login**: Username/email + password
2. **JWT Generation**: Access + refresh tokens
3. **Token Storage**: Quản lý localStorage an toàn
4. **Auto-refresh**: Tự động làm mới token
5. **Logout**: Vô hiệu hóa token

---

## 💳 Thanh toán & upload

### Phương thức thanh toán

- **Stripe**: Thẻ tín dụng/ghi nợ
- **MB Bank QR**: Thanh toán QR Việt Nam
- **Payment Status**: PENDING, PAID, FAILED, REFUNDED
- **Transaction History**: Lịch sử giao dịch đầy đủ

### Hệ thống upload file

- **Local Storage**: Lưu trữ file hệ thống
- **Cloud Storage**: Google Cloud Storage
- **Image Processing**: Tạo thumbnail
- **File Validation**: Kiểm tra loại và kích thước file
- **CDN Integration**: Content delivery network

---

## 🌐 API & Service

### Thiết kế RESTful API

- **Standard HTTP Methods**: GET, POST, PUT, DELETE
- **Consistent Response Format**: JSON responses chuẩn
- **Error Handling**: HTTP status codes phù hợp
- **API Documentation**: Swagger/OpenAPI

### Kiến trúc Service Layer

- **Business Logic Separation**: Service layer pattern
- **Transaction Management**: ACID compliance
- **Exception Handling**: Global exception handler
- **Caching Strategy**: Redis caching (planned)

---

## 🗄️ Quản lý state (Frontend)

### Quản lý state Redux

- **Auth State**: Dữ liệu xác thực người dùng
- **STI Tests State**: Dữ liệu đăng ký xét nghiệm
- **UI State**: Loading, error states
- **Persistent Storage**: Redux Persist integration

### Context API

- **Theme Context**: Dark/light mode
- **User Context**: Dữ liệu người dùng hiện tại
- **Notification Context**: Toast notifications

---

## 📦 Cấu trúc thư mục

### Cấu trúc Backend

```
backend/
├── src/main/java/com/healapp/
│   ├── config/           # Các lớp cấu hình
│   ├── controller/       # REST API endpoints
│   ├── service/          # Logic nghiệp vụ
│   ├── repository/       # Tầng truy cập dữ liệu
│   ├── model/           # Các lớp entity
│   ├── dto/             # Data transfer objects
│   ├── exception/       # Custom exceptions
│   └── scheduler/       # Các tác vụ định lịch
├── src/main/resources/
│   ├── application.properties
│   └── application-cloud.properties
└── uploads/             # Lưu trữ file
```

### Cấu trúc Frontend

```
frontend/src/
├── components/          # Các component UI tái sử dụng
│   ├── AdminProfile/   # Component dashboard admin
│   ├── CustomerProfile/ # Component dashboard khách hàng
│   ├── common/         # Component dùng chung
│   └── layouts/        # Component layout
├── pages/              # Component trang
├── redux/              # Quản lý state
│   ├── slices/         # Redux slices
│   ├── thunks/         # Async actions
│   └── middleware/     # Custom middleware
├── services/           # API services
├── context/            # React Context
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── assets/             # Static assets
```

---

## 🧑‍💻 Hướng dẫn sử dụng nhanh

### Đối với người dùng (Customer)

#### Đăng ký & Đăng nhập

1. **Đăng ký**: Truy cập `/register`, nhập thông tin cá nhân
2. **Email Verification**: Xác thực email qua link
3. **Đăng nhập**: Sử dụng email/username + password
4. **OAuth Login**: Đăng nhập bằng Google

#### Sử dụng dịch vụ

1. **Đặt lịch tư vấn**: Chọn consultant → chọn thời gian → xác nhận
2. **Đăng ký xét nghiệm**: Chọn service/package → thanh toán → theo dõi kết quả
3. **Quản lý chu kỳ**: Nhập thông tin → nhận nhắc nhở
4. **Đọc blog**: Xem bài viết sức khỏe
5. **Gửi câu hỏi**: Hỏi đáp với chuyên gia

### Đối với quản trị viên (Admin)

#### Quản lý hệ thống

1. **User Management**: Thêm/sửa/xóa người dùng
2. **Service Management**: Quản lý dịch vụ và gói xét nghiệm
3. **Blog Management**: Duyệt và quản lý bài viết
4. **Reports**: Xem báo cáo thống kê
5. **System Settings**: Cấu hình hệ thống

### Đối với nhân viên (Staff)

#### Xử lý xét nghiệm

1. **Test Confirmation**: Xác nhận đăng ký xét nghiệm
2. **Result Input**: Nhập kết quả xét nghiệm
3. **Review Management**: Phản hồi đánh giá
4. **Question Response**: Trả lời câu hỏi khách hàng

### Đối với tư vấn viên (Consultant)

#### Quản lý tư vấn

1. **Schedule Management**: Xem và quản lý lịch hẹn
2. **Consultation**: Thực hiện tư vấn
3. **Question Response**: Trả lời câu hỏi
4. **Profile Management**: Cập nhật hồ sơ chuyên môn

---

## ⚙️ Cài đặt & chạy thử

### Yêu cầu hệ thống

- **Java 24+**
- **Node.js 18+**
- **MSSQL Server**
- **Maven 3.6+**
- **Git**

### Cài đặt Backend

```bash
# Clone repository
git clone <repository-url>
cd Gender_Healthcare_Service_Management_System/backend

# Cấu hình database
# Tạo database "HealApp" trong MSSQL
# Cập nhật connection string trong application.properties

# Build và chạy
mvn clean install
mvn spring-boot:run

# Hoặc sử dụng Docker
docker build -t healapp-backend .
docker run -p 8080:8080 healapp-backend
```

### Cài đặt Frontend

```bash
# Chuyển đến thư mục frontend
cd ../frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build production
npm run build
```

### Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Admin Account**: admin123 / Admin123@

---

## 🔧 Cấu hình môi trường

### Cấu hình Backend

```properties
# Database
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=HealApp
spring.datasource.username=sa
spring.datasource.password=12345

# JWT
jwt.secret=your-secret-key
jwt.access-token-expiration=3600000
jwt.refresh-token-expiration=86400000

# Email (SendGrid)
spring.mail.host=smtp.sendgrid.net
spring.mail.username=apikey
spring.mail.password=your-sendgrid-api-key

# Stripe
stripe.api.key=your-stripe-secret-key
stripe.publishable.key=your-stripe-publishable-key

# Google OAuth
google.oauth.client-id=your-google-client-id
google.oauth.client-secret=your-google-client-secret
```

### Cấu hình Frontend

```javascript
// API Base URL
REACT_APP_API_BASE_URL=http://localhost:8080

// Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

// Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

---

## 🚀 Triển khai

### Triển khai Backend

```bash
# Build JAR file
mvn clean package

# Run with profile
java -jar -Dspring.profiles.active=cloud target/HealApp-0.0.1-SNAPSHOT.jar

# Docker deployment
docker-compose up -d
```

### Triển khai Frontend

```bash
# Build production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Or deploy to other platforms
# - Vercel
# - Netlify
# - AWS S3
```

---

## 📊 Cấu trúc cơ sở dữ liệu

### Các bảng chính

- **users**: Thông tin người dùng
- **roles**: Phân quyền hệ thống
- **consultant_profiles**: Hồ sơ tư vấn viên
- **consultations**: Lịch tư vấn
- **sti_services**: Dịch vụ xét nghiệm
- **sti_packages**: Gói xét nghiệm
- **sti_tests**: Đăng ký xét nghiệm
- **test_results**: Kết quả xét nghiệm
- **blog_posts**: Bài viết blog
- **ratings**: Đánh giá dịch vụ
- **questions**: Câu hỏi khách hàng
- **payments**: Giao dịch thanh toán
- **menstrual_cycle**: Chu kỳ kinh nguyệt
- **control_pills**: Nhắc uống thuốc

---

## 🔄 API Endpoints

### Xác thực

- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh-token` - Làm mới token
- `POST /users/register` - Đăng ký
- `POST /users/forgot-password` - Quên mật khẩu

### Quản lý người dùng

- `GET /users/profile` - Lấy thông tin profile
- `PUT /users/profile` - Cập nhật profile
- `POST /users/avatar` - Upload avatar

### Dịch vụ chăm sóc sức khỏe

- `GET /sti-services` - Danh sách dịch vụ
- `GET /sti-packages` - Danh sách gói
- `POST /sti-tests` - Đăng ký xét nghiệm
- `GET /sti-tests/{id}/results` - Kết quả xét nghiệm

### Tư vấn

- `GET /consultants` - Danh sách consultant
- `POST /consultations` - Đặt lịch tư vấn
- `PUT /consultations/{id}/status` - Cập nhật trạng thái

### Blog

- `GET /blog` - Danh sách bài viết
- `POST /blog` - Tạo bài viết (Staff/Admin)
- `PUT /blog/{id}/status` - Duyệt bài viết

---

## 🧪 Kiểm thử

### Kiểm thử Backend

```bash
# Chạy tất cả test
mvn test

# Chạy test cụ thể
mvn test -Dtest=UserServiceTest

# Integration tests
mvn test -Dtest=*IntegrationTest
```

### Kiểm thử Frontend

```bash
# Chạy test
npm test

# Chạy test với coverage
npm test -- --coverage

# Chạy test cụ thể
npm test -- --testNamePattern="LoginPage"
```

---

## 📈 Giám sát & Ghi log

### Giám sát Backend

- **Log4j2**: Ghi log có cấu trúc
- **Health Checks**: Health endpoints
- **Metrics**: Metrics ứng dụng
- **Error Tracking**: Global exception handler

### Giám sát Frontend

- **Error Boundaries**: React error boundaries
- **Performance Monitoring**: Web vitals
- **User Analytics**: Theo dõi hành vi người dùng
- **Console Logging**: Debug development

---

## 🔧 Công cụ phát triển

### Công cụ Backend

- **Spring Boot DevTools**: Hot reload
- **Swagger UI**: Tài liệu API
- **H2 Console**: Database console (dev)
- **Maven**: Build tool

### Công cụ Frontend

- **React Developer Tools**: Kiểm tra component
- **Redux DevTools**: Debug state
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## 🤝 Đóng góp

### Quy trình đóng góp

1. **Fork repository**
2. **Tạo feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Tạo Pull Request**

### Tiêu chuẩn code

- **Backend**: Java coding conventions
- **Frontend**: ESLint + Prettier
- **Git**: Conventional commits
- **Documentation**: JSDoc comments

---

## 📄 Bản quyền

Dự án này thuộc sở hữu của nhóm SWP391 - GROUP 5, thực hiện cho môn học SWP391 tại Trường Đại học FPT Hồ Chí Minh.

Mọi quyền sử dụng chỉ dành cho mục đích học tập, nghiên cứu và phi thương mại.

Copyright (c) 2025 - Nhóm SWP391 - GROUP 5, Đại học FPT Hồ Chí Minh.

---

## 👥 Thông tin nhóm SWP391 - GROUP 5

| STT | Họ và tên             | MSSV     | Email                      | Vai trò                         |
| --- | --------------------- | -------- | -------------------------- | ------------------------------- |
| 1   | Nguyễn Thị Tường Vy   | SE181801 | vynttse181801@fpt.edu.vn   | Backend (BE)                    |
| 2   | Nguyễn Lý Vi          | SE181814 | vinlse181814@fpt.edu.vn    | Backend (BE)                    |
| 3   | Nguyễn Đình Duy       | SE181803 | duyndse181803@fpt.edu.vn   | Frontend (FE)                   |
| 4   | **Lê Nguyễn An Ninh** | SE181799 | ninhlnase181799@fpt.edu.vn | Frontend (FE) (**Nhóm trưởng**) |
| 5   | Nguyễn Văn Cường      | SE183645 | cuongnvse183645@fpt.edu.vn | Backend (BE)                    |

---

## 📞 Liên hệ

- **Email**: [contact@healapp.com]
- **GitHub**: [repository-url]
- **Documentation**: [docs-url]

---

## 🙏 Lời cảm ơn

- **Spring Boot Team**: Backend framework
- **Material-UI Team**: Frontend UI library
- **Stripe**: Payment processing
- **Google Cloud**: Cloud services
- **SendGrid**: Email service
- **Twilio**: SMS service

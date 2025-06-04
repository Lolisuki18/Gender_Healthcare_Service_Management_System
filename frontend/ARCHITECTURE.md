# Hướng dẫn Cấu trúc và Công dụng Dự án Gender Health Care Frontend

## Tổng quan

Dự án Gender Health Care Frontend là một ứng dụng ReactJS hiện đại được xây dựng để cung cấp giao diện cho nền tảng chăm sóc sức khỏe chuyên biệt. Dự án này được tổ chức theo cấu trúc thư mục và file rõ ràng, giúp dễ dàng quản lý, mở rộng và bảo trì.

## Cấu trúc thư mục và công dụng

### 1. Thư mục gốc (src)

- **App.js**: Component gốc của ứng dụng, tích hợp các công nghệ cốt lõi như Redux, Context API và React Router. File này thiết lập cấu trúc cơ bản và các provider cần thiết cho toàn bộ ứng dụng.

- **routes.js**: Quản lý hệ thống định tuyến (routing) của ứng dụng, giúp điều hướng người dùng giữa các trang khác nhau mà không cần tải lại trang. File này tách biệt logic điều hướng khỏi các component khác và áp dụng mô hình layout lồng nhau.

### 2. Components

#### common

Chứa các component được sử dụng lặp lại trong nhiều trang:

- **Header.js**: Thanh điều hướng phía trên cùng, cung cấp điểm truy cập nhất quán đến các phần chính của ứng dụng.

- **Footer.js**: Phần chân trang, hiển thị thông tin bản quyền và các liên kết pháp lý cần thiết.

#### layouts

Xác định cấu trúc trang:

- **MainLayout.js**: Layout chính áp dụng cho mọi trang, bao gồm Header, Footer và một vùng nội dung chính ở giữa. Sử dụng Outlet từ React Router để hiển thị nội dung động.

#### pages

Các trang tương ứng với các route:

- **HomePage.js**: Trang chủ, điểm nhập chính của ứng dụng. Hiển thị tổng quan về các dịch vụ và call-to-action.

- **NotFoundPage.js**: Trang 404, hiển thị khi người dùng truy cập URL không tồn tại.

### 3. State Management

#### context

Quản lý state với Context API:

- **ThemeContext.js**: Quản lý theme của ứng dụng (sáng/tối), lưu trữ tùy chọn người dùng và cung cấp hook useTheme.

- **UserContext.js**: Quản lý thông tin người dùng đăng nhập, cung cấp các phương thức xác thực và hook useUser.

#### redux

Quản lý state phức tạp với Redux:

- **store.js**: Cấu hình Redux store và Redux Persist để lưu trữ state qua các phiên làm việc.

- **slices/authSlice.js**: Quản lý trạng thái xác thực với Redux Toolkit, xử lý các action đăng nhập/đăng xuất.

### 4. Services & Utilities

#### services

Tương tác với API:

- **api.js**: Cấu hình axios client với các thiết lập mặc định và interceptor để xử lý token xác thực.

- **userService.js**: Các hàm tương tác với API liên quan đến người dùng như đăng nhập, đăng ký, lấy thông tin profile.

#### hooks

Custom React hooks:

- **useLocalStorage.js**: Hook để tương tác với localStorage, tự động xử lý JSON và đồng bộ với React state.

#### utils

Các hàm tiện ích:

- **helpers.js**: Tập hợp các hàm tiện ích như format date, format currency, kiểm tra email...

### 5. Assets

#### styles

CSS và file định kiểu:

- **variables.css**: Định nghĩa các biến CSS được sử dụng xuyên suốt ứng dụng để đảm bảo giao diện nhất quán.

## Lợi ích của cấu trúc này

1. **Separation of Concerns**: Mỗi file có một nhiệm vụ rõ ràng, giúp code dễ đọc và bảo trì.

2. **Scalability**: Dễ dàng thêm tính năng mới mà không ảnh hưởng đến code hiện có.

3. **Reusability**: Các component, hooks, và utils có thể tái sử dụng ở nhiều nơi.

4. **Maintainability**: Dễ dàng tìm và sửa lỗi, cập nhật tính năng.

5. **Team Collaboration**: Nhiều developer có thể làm việc song song trên các phần khác nhau mà không tạo xung đột.

## Công nghệ được sử dụng

- **React & React Router**: Xây dựng UI và quản lý navigation
- **Redux & Redux Toolkit**: Quản lý state phức tạp
- **Material UI**: Thư viện component UI
- **Axios**: Gọi API
- **Context API**: Quản lý state đơn giản
- **Redux Persist**: Lưu trữ state qua localStorage

## Kết luận

Cấu trúc dự án Gender Health Care Frontend được thiết kế dựa trên các best practice trong phát triển ReactJS hiện đại, giúp tạo ra một ứng dụng dễ mở rộng, bảo trì và phát triển. Mỗi thư mục và file đều có mục đích cụ thể, đóng góp vào một hệ thống đồng bộ và linh hoạt.

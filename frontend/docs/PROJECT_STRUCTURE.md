/\*\*

- README.md - Giải thích cấu trúc dự án ReactJS
-
- Tóm tắt cấu trúc dự án và giải thích công dụng của các thư mục/file chính
  \*/

# Cấu Trúc Dự Án Gender Health Care Frontend

## Giới thiệu

Đây là một ứng dụng ReactJS hiện đại với đầy đủ các công cụ và thư viện phát triển frontend. Dưới đây là giải thích về cấu trúc thư mục và công dụng của từng phần trong dự án.

## Cấu trúc thư mục

### 1. `src/components`

Chứa các component React được phân chia thành 3 nhóm:

- **common**: Các component dùng chung được sử dụng ở nhiều nơi trong ứng dụng

  - `Header.js`: Thanh điều hướng phía trên
  - `Footer.js`: Phần chân trang
  - _Các component khác_: Button, Modal, Card...

- **layouts**: Bố cục trang web

  - `MainLayout.js`: Layout chính định nghĩa cấu trúc trang (Header, content, Footer)

- **pages**: Các component trang đại diện cho từng route
  - `HomePage.js`: Trang chủ
  - `NotFoundPage.js`: Trang 404
  - _Các trang khác_: AboutPage, ContactPage, ServicePage...

### 2. `src/context`

Các Context API để quản lý state ứng dụng:

- `ThemeContext.js`: Quản lý theme sáng/tối
- `UserContext.js`: Quản lý thông tin đăng nhập/đăng xuất của người dùng

### 3. `src/redux`

Cấu hình Redux để quản lý state toàn cục:

- `store.js`: Cấu hình Redux store và Redux Persist
- `slices/`: Chứa các slice của Redux Toolkit
  - `authSlice.js`: Quản lý trạng thái xác thực người dùng

### 4. `src/services`

Chứa các service gọi API:

- `api.js`: Cấu hình axios instance chung
- `userService.js`: Các API về user (đăng nhập, đăng ký...)

### 5. `src/hooks`

Custom hooks:

- `useLocalStorage.js`: Hook để tương tác với localStorage

### 6. `src/utils`

Các hàm tiện ích:

- `helpers.js`: Các hàm helper như format date, format currency, etc.

### 7. `src/assets`

Tài nguyên tĩnh:

- `images/`: Chứa hình ảnh
- `styles/`: CSS và các file style
  - `variables.css`: Biến CSS toàn cục

### 8. File gốc

- `App.js`: Component gốc của ứng dụng
- `index.js`: Điểm khởi tạo ứng dụng
- `routes.js`: Cấu hình điều hướng

## Công nghệ sử dụng

- **React**: Thư viện UI
- **Redux Toolkit**: Quản lý state
- **React Router**: Điều hướng
- **Material UI**: Component library
- **Axios**: Gọi API
- **Redux Persist**: Lưu trữ state

## Lợi ích của cấu trúc này

- **Tách biệt mối quan tâm**: Mỗi thư mục/file có một nhiệm vụ cụ thể
- **Dễ mở rộng**: Thêm tính năng mới không ảnh hưởng đến code hiện có
- **Tái sử dụng cao**: Các component, hooks, utils có thể tái sử dụng
- **Dễ bảo trì**: Dễ dàng tìm và sửa lỗi

Cấu trúc này áp dụng những best practice trong phát triển ReactJS, giúp ứng dụng dễ phát triển và mở rộng.

# Tính Năng Quản Lý Hồ Sơ Cá Nhân cho Nhân Viên

## Tổng quan

Tính năng này cho phép các nhân viên y tế có thể xem và cập nhật thông tin cá nhân của họ ngay trong giao diện quản lý. Đây là một phần quan trọng của hệ thống, giúp nhân viên luôn cập nhật và quản lý thông tin cá nhân một cách hiệu quả. Hồ sơ cá nhân được hiển thị mặc định khi nhân viên đăng nhập vào hệ thống.

## Các thành phần chính

1. **Menu "Hồ sơ cá nhân" trong StaffSideBar**: Menu được đặt ở vị trí đầu tiên trong sidebar cho phép nhân viên dễ dàng truy cập vào màn hình quản lý thông tin cá nhân. Menu này được chọn mặc định khi đăng nhập.

2. **Profile Content Component**: Hiển thị và cho phép chỉnh sửa các thông tin cá nhân như:
   - Họ và tên
   - Email
   - Số điện thoại
   - Chức vụ
   - Địa chỉ
   - Ảnh đại diện

## Cách sử dụng

1. Đăng nhập vào hệ thống với tư cách nhân viên
2. Chọn mục "Hồ sơ cá nhân" trong sidebar
3. Xem thông tin cá nhân hiện tại
4. Nhấn nút "Chỉnh sửa thông tin" để cập nhật thông tin
5. Nhập các thông tin mới và nhấn "Lưu thay đổi"

## Tính năng UI/UX

- **Giao diện hiện đại**: Sử dụng Material UI với thiết kế card
- **Visual feedback**: Hiển thị thông báo khi lưu thành công
- **Responsive**: Hoạt động tốt trên cả desktop và mobile
- **Chế độ xem/chỉnh sửa**: Chuyển đổi giữa mode xem và chỉnh sửa

## Thay đổi kỹ thuật

1. Cập nhật `StaffSideBar.js`:

   - Thêm mục menu "Hồ sơ cá nhân"
   - Sử dụng PersonIcon từ MUI

2. Cập nhật `StaffProfile.js`:

   - Import ProfileContent component
   - Thiết lập "profile" làm tab mặc định khi khởi tạo (useState)
   - Thêm case trong renderContent để hiển thị ProfileContent
   - Cập nhật getPageTitle để hiển thị tiêu đề đúng
   - Cập nhật case mặc định để trả về ProfileContent

3. Cấu trúc dữ liệu:
   - Lấy dữ liệu người dùng từ localStorage
   - Sử dụng userService để cập nhật thông tin
   - Cập nhật localStorage sau khi lưu thành công

## Hướng phát triển tiếp theo

- Cập nhật ảnh đại diện bằng cách tải lên file
- Thêm phần đổi mật khẩu
- Thêm các trường thông tin mở rộng (ngày sinh, giới tính...)
- Tích hợp xác thực email khi thay đổi email

## Lưu ý

- Đảm bảo các thay đổi được kiểm tra và xác thực trước khi lưu
- Bảo vệ thông tin nhạy cảm của nhân viên
- Luôn hiển thị thông báo phản hồi rõ ràng

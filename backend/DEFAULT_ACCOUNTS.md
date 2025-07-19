# Tài Khoản Mặc Định - HealApp System

## Tổng Quan

Hệ thống HealApp được thiết lập với **5 tài khoản mặc định** để hỗ trợ việc phát triển và test. Các tài khoản này đại diện cho **4 roles chính** trong hệ thống.

## Roles Trong Hệ Thống

Hệ thống có 4 roles chính:

1. **CUSTOMER** - Khách hàng sử dụng dịch vụ
2. **STAFF** - Nhân viên hỗ trợ
3. **CONSULTANT** - Bác sĩ/Chuyên gia tư vấn
4. **ADMIN** - Quản trị viên hệ thống

## Tài Khoản Mặc Định

### 🔵 CUSTOMER (2 tài khoản)

#### Tài khoản 1:

- **Username:** `customer1`
- **Password:** `Aa12345@`
- **Email:** `customer1@healapp.com`
- **Họ tên:** Nguyễn Văn A
- **Giới tính:** Nam
- **Số điện thoại:** 0900000001
- **Địa chỉ:** 123 Đường ABC, Quận 1, TP.HCM

#### Tài khoản 2:

- **Username:** `customer2`
- **Password:** `Aa12345@`
- **Email:** `customer2@healapp.com`
- **Họ tên:** Trần Thị B
- **Giới tính:** Nữ
- **Số điện thoại:** 0900000002
- **Địa chỉ:** 456 Đường DEF, Quận 2, TP.HCM

---

### 🟡 STAFF (1 tài khoản)

- **Username:** `staff1`
- **Password:** `Aa12345@`
- **Email:** `staff1@healapp.com`
- **Họ tên:** Lê Văn C
- **Giới tính:** Nam
- **Số điện thoại:** 0900000003
- **Địa chỉ:** 789 Đường GHI, Quận 3, TP.HCM

---

### 🟢 CONSULTANT (1 tài khoản)

- **Username:** `consultant1`
- **Password:** `Aa12345@`
- **Email:** `consultant1@healapp.com`
- **Họ tên:** Dr. Phạm Thị D
- **Giới tính:** Nữ
- **Số điện thoại:** 0900000004
- **Địa chỉ:** 321 Đường JKL, Quận 4, TP.HCM

---

### 🔴 ADMIN (1 tài khoản)

- **Username:** `admin1`
- **Password:** `Aa12345@`
- **Email:** `admin1@healapp.com`
- **Họ tên:** Hoàng Văn E
- **Giới tính:** Nam
- **Số điện thoại:** 0900000005
- **Địa chỉ:** 654 Đường MNO, Quận 5, TP.HCM

## Cách Sử Dụng

### 1. Khởi động ứng dụng

```bash
cd backend
mvn spring-boot:run
```

### 2. Truy cập hệ thống

- **URL:** `http://localhost:8080`
- **API Base URL:** `http://localhost:8080/api`

### 3. Đăng nhập

Sử dụng một trong các tài khoản trên với:

- **Username:** Như trong bảng trên
- **Password:** `Aa12345@` (tất cả tài khoản)

### 4. Test theo Role

#### 👤 Test với CUSTOMER:

- Đăng ký/Đăng nhập
- Đặt lịch tư vấn
- Xem thông tin cá nhân
- Thanh toán dịch vụ

#### 👨‍💼 Test với STAFF:

- Quản lý lịch hẹn
- Hỗ trợ khách hàng
- Xem báo cáo

#### 👩‍⚕️ Test với CONSULTANT:

- Tư vấn cho khách hàng
- Quản lý lịch làm việc
- Tạo báo cáo y tế

#### 👨‍💻 Test với ADMIN:

- Quản lý toàn bộ hệ thống
- Quản lý người dùng
- Xem tất cả báo cáo
- Cấu hình hệ thống

## Lưu Ý Quan Trọng

### ⚠️ Bảo Mật

- Các tài khoản này chỉ dành cho môi trường **development** và **testing**
- **KHÔNG** sử dụng trong môi trường production
- Thay đổi mật khẩu trước khi deploy lên production

### 🔄 Tự Động Tạo

- Các tài khoản được tạo tự động khi khởi động ứng dụng
- Chỉ tạo nếu chưa tồn tại trong database
- Được quản lý bởi `DataInitializerConfig.java`

### 🗃️ Database

- Roles được tạo trước khi tạo users
- Tất cả thông tin được lưu trong SQL Server
- Mật khẩu được mã hóa bằng BCrypt

## Liên Hệ

Nếu có vấn đề với các tài khoản mặc định:

1. Kiểm tra database có chứa dữ liệu chưa
2. Xem log khi khởi động ứng dụng
3. Liên hệ team leader để được hỗ trợ

---

**Cập nhật lần cuối:** 15/07/2025  
**Phiên bản:** 1.0  
**Môi trường:** Development & Testing

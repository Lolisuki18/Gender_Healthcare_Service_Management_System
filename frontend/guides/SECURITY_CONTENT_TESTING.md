# HƯỚNG DẪN TEST SECURITY CONTENT

## Mục đích

Hướng dẫn test tính năng xóa tài khoản vĩnh viễn trong SecurityContent.js, cập nhật theo logic và UI/UX mới nhất (2024).

---

## 1. Tổng quan logic mới

- **Chỉ user có vai trò "Customer" mới được phép xóa tài khoản.**
- Các vai trò "Staff" và "Consultant" không hiển thị hoặc không thể thao tác xóa tài khoản (ẩn UI và trả về lỗi backend nếu cố gọi API).
- Quy trình xóa tài khoản gồm 2 bước: nhập mật khẩu → nhận và nhập mã xác thực email → xác nhận xóa.
- Dialog xác nhận xóa tài khoản sử dụng cảnh báo mạnh mẽ, icon y tế, màu sắc và ngôn từ phù hợp lĩnh vực healthcare.
- Không còn bước hiển thị success message riêng, modal đóng ngay khi xóa thành công.

---

## 2. Test Cases cho Xóa Tài Khoản

### 2.1. Gửi mã xác thực

- **Bước 1:** Đăng nhập với vai trò Customer
- **Bước 2:** Vào Profile > Security
- **Bước 3:** Card "Xóa tài khoản" chỉ hiển thị với Customer
- **Bước 4:** Nhập mật khẩu, click "Gửi mã xác thực"
- **Kết quả:**
  - Toast: "Mã xác thực đã được gửi đến email của bạn"
  - Nhận email mã xác thực 6 số
  - Nếu nhập sai mật khẩu: Hiển thị lỗi "Mật khẩu không đúng"

### 2.2. Xác nhận xóa tài khoản

- **Bước 1:** Nhập mã xác thực vừa nhận
- **Bước 2:** Click "Xóa tài khoản"
- **Kết quả:**
  - Hiển thị dialog xác nhận với cảnh báo rõ ràng, icon y tế, màu sắc nổi bật
  - Có 2 lựa chọn: "Xóa tài khoản" (nút đỏ) và "Hủy"
  - Nếu xác nhận: Toast "Tài khoản đã được xóa thành công", tự động chuyển về login, không thể đăng nhập lại
  - Nếu mã xác thực sai/hết hạn: Hiển thị lỗi "Mã xác thực không đúng hoặc đã hết hạn"

### 2.3. Gửi lại mã xác thực

- **Bước 1:** Ở bước nhập mã xác thực, click "Gửi lại mã"
- **Kết quả:**
  - Loading state khi gửi lại
  - Toast thành công hoặc lỗi tương ứng

---

## 3. Test Cases UI/UX

- Loading spinner hiển thị đúng khi gửi mã/xóa tài khoản
- Không thể click lại khi đang loading
- Dialog xác nhận có icon, màu sắc, typography cảnh báo rõ ràng, ngôn ngữ hỗ trợ người dùng
- Responsive tốt trên mobile, modal không overflow

---

## 4. Test Cases Bảo Mật & Edge Cases

- Đăng xuất rồi truy cập Security page: chuyển về login
- Gọi API không token: trả về lỗi authentication
- Không thể xóa tài khoản khác
- Token validation hoạt động
- Xóa user mới đăng ký (không dữ liệu): thành công
- Xóa user có nhiều dữ liệu: thành công, không sót dữ liệu

---

## 5. Checklist Test (Cập nhật)

### 5.1. Functional Testing

- [ ] Chỉ Customer mới thấy/xóa tài khoản
- [ ] Gửi mã xác thực thành công
- [ ] Xóa tài khoản thành công
- [ ] Hiển thị lỗi khi sai mật khẩu
- [ ] Hiển thị lỗi khi sai/hết hạn mã xác thực
- [ ] Gửi lại mã xác thực hoạt động
- [ ] Chuyển về login sau khi xóa thành công

### 5.2. UI/UX Testing

- [ ] Loading states hoạt động đúng
- [ ] Toast notifications hiển thị đúng
- [ ] Confirmation dialog hiển thị đúng, cảnh báo rõ ràng, icon y tế
- [ ] Responsive design trên mobile
- [ ] Modal không bị overflow

### 5.3. Security Testing

- [ ] Authentication check hoạt động
- [ ] CSRF protection hoạt động
- [ ] Không thể xóa tài khoản khác
- [ ] Token validation hoạt động

### 5.4. Performance Testing

- [ ] API response time < 3s
- [ ] UI không bị lag khi loading
- [ ] Memory usage ổn định

---

## 6. Tools Test

- Manual: Browser DevTools, Console, Mobile simulator
- Automated: Jest + React Testing Library (unit), Cypress (E2E), Postman (API)

---

## 7. Bug Report Template (không đổi)

**Title:** [BUG] Tính năng xóa tài khoản không hoạt động

**Steps to reproduce:**

1. Đăng nhập vào hệ thống
2. Vào Security page
3. Click "Xóa tài khoản"
4. Nhập mật khẩu
5. Click "Gửi mã xác thực"

**Expected behavior:**

- Hiển thị toast thành công
- Nhận được email mã xác thực

**Actual behavior:**

- Hiển thị lỗi
- Không nhận được email

**Environment:**

- Browser: Chrome 120.0
- OS: Windows 11
- User Role: Customer

**Screenshots:**
[Attach screenshots if applicable]

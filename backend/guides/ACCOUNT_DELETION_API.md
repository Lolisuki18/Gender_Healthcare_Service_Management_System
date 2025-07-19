# API XÓA TÀI KHOẢN VĨNH VIỄN

## Mục đích

Cho phép người dùng tự xóa tài khoản và toàn bộ dữ liệu liên quan khỏi hệ thống một cách an toàn, bảo mật, không để sót dữ liệu.

---

## 1. Gửi mã xác thực xóa tài khoản

**Endpoint:**

```
POST /users/profile/delete-account/send-verification
```

**Mục đích:**

- Gửi mã xác thực về email của user để xác nhận xóa tài khoản.

**Request body:**

```json
{
  "password": "mật khẩu hiện tại"
}
```

**Response:**

- Thành công:
  ```json
  {
    "success": true,
    "message": "Mã xác thực đã được gửi đến email của bạn",
    "data": "email@user.com"
  }
  ```
- Thất bại:
  ```json
  {
    "success": false,
    "message": "Mật khẩu không đúng"
  }
  ```

---

## 2. Xác nhận xóa tài khoản vĩnh viễn

**Endpoint:**

```
DELETE /users/profile/delete-account
```

**Mục đích:**

- Xác nhận xóa tài khoản và toàn bộ dữ liệu liên quan userId.

**Request body:**

```json
{
  "password": "mật khẩu hiện tại",
  "verificationCode": "mã xác thực vừa nhận qua email"
}
```

**Response:**

- Thành công:
  ```json
  {
    "success": true,
    "message": "Tài khoản đã được xóa thành công"
  }
  ```
- Thất bại:
  ```json
  {
    "success": false,
    "message": "Mã xác thực không đúng hoặc đã hết hạn"
  }
  ```

---

## 3. Quy trình sử dụng

1. FE gọi `POST /users/profile/delete-account/send-verification` với mật khẩu hiện tại.
2. User nhận mã xác thực qua email.
3. FE gọi `DELETE /users/profile/delete-account` với mật khẩu và mã xác thực.
4. Nếu thành công, toàn bộ dữ liệu liên quan userId sẽ bị xóa vĩnh viễn.

---

## 4. Lưu ý bảo mật

- UserId được lấy từ token đăng nhập, không nhận từ FE.
- Chỉ user đang đăng nhập mới xóa được tài khoản của mình.
- Toàn bộ quá trình xóa nằm trong 1 transaction, rollback nếu có lỗi.
- Sau khi xóa thành công, user sẽ bị đăng xuất khỏi hệ thống.

---

## 5. Test case gợi ý

- Đúng mật khẩu, đúng mã xác thực → Xóa thành công.
- Sai mật khẩu → Báo lỗi.
- Đúng mật khẩu, sai mã xác thực → Báo lỗi.
- User không có dữ liệu liên quan → Xóa thành công.
- User có nhiều dữ liệu liên quan → Xóa thành công, không còn dữ liệu nào sót lại.

---

## 6. Ví dụ curl

### Gửi mã xác thực

```bash
curl -X POST http://localhost:8080/users/profile/delete-account/send-verification \
  -H "Content-Type: application/json" \
  -d '{"password": "your_password"}'
```

### Xác nhận xóa tài khoản

```bash
curl -X DELETE http://localhost:8080/users/profile/delete-account \
  -H "Content-Type: application/json" \
  -d '{"password": "your_password", "verificationCode": "123456"}'
```

---

## 7. Ghi chú mở rộng

- Nếu user đăng nhập bằng Google OAuth, API sẽ trả về lỗi không hỗ trợ xóa qua API này.
- Nếu có lỗi trong quá trình xóa (DB, file, ...), toàn bộ transaction sẽ rollback, không có dữ liệu nào bị xóa dở dang.
- Có thể mở rộng gửi email xác nhận đã xóa tài khoản cho user.

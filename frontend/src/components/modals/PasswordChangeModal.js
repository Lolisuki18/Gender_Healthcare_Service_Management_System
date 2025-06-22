/**
 * PasswordChangeModal.js - Thành phần phương thức để thay đổi mật khẩu
 *
 * Đặc trưng:
 * - Xác thực biểu mẫu cho mật khẩu hiện tại và mật khẩu mới
 * - Xác nhận khớp mật khẩu
 * - Chức năng hiển thị/ẩn mật khẩu
 * - Lời khuyên bảo mật cho người dùng
 * - Xử lý lỗi và phản hồi của người dùng
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
} from "@mui/icons-material";

//Password Change Dialog Component
export const PasswordChangeDialog = ({
  open, //dùng để mở dialog
  onClose, //dùng để đóng dialog
  onChangePassword, //dùng để gọi hàm khi người dùng muốn thay đổi mật khẩu
  isChanging, //dùng để xác định trạng thái đang thay đổi mật khẩu hay không
}) => {
  //State quản lý mật khẩu
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  //State quản lý hiển thị mật khẩu
  //Mặc định là ẩn mật khẩu
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  //State quản lý lỗi
  const [errors, setErrors] = useState({});

  // Hàm xử lý thay đổi giá trị mật khẩu
  const handleChange = (field) => (e) => {
    setPasswords({
      ...passwords,
      [field]: e.target.value,
    });
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  // Hàm để hiển thị/ẩn mật khẩu
  // Nhận vào tên trường (current, new, confirm) để xác định trường nào
  const toggleShowPassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  // Hàm xác thực biểu mẫu
  // Kiểm tra các trường mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu
  // Trả về true nếu tất cả các trường hợp lệ, false nếu có lỗi
  const validateForm = () => {
    const newErrors = {};
    //Kiểm tra xem password hiện tại có được nhập hay không ?
    if (!passwords.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    //Kiểm tra xem mật khẩu mới có được nhập hay không ?
    //Nếu có thì kiểm tra độ dài của mật khẩu mới
    if (!passwords.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    // Kiểm tra xem mật khẩu mới có khác mật khẩu hiện tại không
    // Nếu giống nhau thì báo lỗi
    if (passwords.currentPassword === passwords.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }
    // Cập nhật state lỗi với các lỗi mới
    // Nếu không có lỗi thì trả về true
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý gửi biểu mẫu
  // Gọi validateForm để kiểm tra tính hợp lệ của biểu mẫu
  const handleSubmit = () => {
    if (validateForm()) {
      // Nếu biểu mẫu hợp lệ, gọi hàm onChangePassword với các giá trị mật khẩu
      // Truyền vào mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu
      onChangePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
    }
  };

  // Hàm xử lý đóng dialog
  // Reset lại các giá trị mật khẩu, hiển thị mật khẩu và lỗi
  const handleClose = () => {
    // Reset lại các giá trị mật khẩu
    // Đặt lại mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu về
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    // Đặt lại hiển thị mật khẩu về false
    // Đặt lại hiển thị mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu về false
    // Điều này sẽ ẩn các trường mật khẩu khi đóng dialog
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    // Đặt lại lỗi về một đối tượng rỗng
    // Điều này sẽ xóa tất cả các thông báo lỗi hiển thị trong dialog
    setErrors({});
    // Gọi hàm onClose để đóng dialog
    // Hàm này sẽ được truyền vào từ component cha để xử lý việc đóng dialog
    onClose();
  };

  // Trả về giao diện của dialog

  return (
    // title của dialog
    // Dialog component từ Material UI
    // Mở dialog khi prop open là true
    // onClose sẽ gọi hàm handleClose khi người dùng đóng dialog
    // maxWidth là kích thước tối đa của dialog
    // fullWidth sẽ làm cho dialog chiếm toàn bộ chiều rộng
    // Sử dụng Stack để căn chỉnh các thành phần bên trong dialog
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <LockIcon sx={{ color: "#4A90E2" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Đổi mật khẩu
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Current Password */}
          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            type={showPasswords.current ? "text" : "password"}
            value={passwords.currentPassword}
            onChange={handleChange("currentPassword")}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => toggleShowPassword("current")}
                    edge="end"
                    sx={{ minWidth: "auto", p: 1, color: "#4A90E2" }}
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          {/* New Password */}
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type={showPasswords.new ? "text" : "password"}
            value={passwords.newPassword}
            onChange={handleChange("newPassword")}
            error={!!errors.newPassword}
            helperText={
              errors.newPassword || "Mật khẩu phải có ít nhất 6 ký tự"
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => toggleShowPassword("new")}
                    edge="end"
                    sx={{ minWidth: "auto", p: 1, color: "#4A90E2" }}
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Xác nhận mật khẩu mới"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwords.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => toggleShowPassword("confirm")}
                    edge="end"
                    sx={{ minWidth: "auto", p: 1, color: "#4A90E2" }}
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          {/* Security Tips */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "12px",
              background: "rgba(74, 144, 226, 0.05)",
              border: "1px solid rgba(74, 144, 226, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 1, color: "#4A90E2" }}
            >
              <ShieldIcon
                sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }}
              />
              Lời khuyên bảo mật:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.9rem" }}
            >
              • Sử dụng ít nhất 8 ký tự
              <br />
              • Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
              <br />• Không sử dụng thông tin cá nhân dễ đoán
            </Typography>
          </Paper>
        </Stack>
      </DialogContent>
      {/* Nút huỷ */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={isChanging}
          sx={{ color: "#6b7280" }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isChanging}
          startIcon={
            isChanging ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <LockIcon />
            )
          }
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
            "&:disabled": { background: "#ccc" },
          }}
        >
          {isChanging ? "Đang đổi..." : "Đổi mật khẩu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

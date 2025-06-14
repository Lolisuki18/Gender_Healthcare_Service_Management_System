/**
 * PasswordChangeModal.js - Modal component cho việc thay đổi mật khẩu
 *
 * Features:
 * - Form validation cho mật khẩu hiện tại và mật khẩu mới
 * - Confirm password matching
 * - Show/hide password functionality
 * - Security tips cho user
 * - Error handling và user feedback
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
} from "@mui/icons-material";

// ✅ Password Change Dialog Component
export const PasswordChangeDialog = ({
  open,
  onClose,
  onChangePassword,
  isChanging,
}) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setPasswords({
      ...passwords,
      [field]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

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

    if (passwords.currentPassword === passwords.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onChangePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
    }
  };

  const handleClose = () => {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <LockIcon sx={{ color: "#ef4444" }} />
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
                    sx={{ minWidth: "auto", p: 1 }}
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
                    sx={{ minWidth: "auto", p: 1 }}
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
                    sx={{ minWidth: "auto", p: 1 }}
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
              p: 2,
              borderRadius: "12px",
              background: "rgba(59, 130, 246, 0.05)",
              border: "1px solid rgba(59, 130, 246, 0.1)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Lời khuyên bảo mật:
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
            background: "linear-gradient(45deg, #ef4444, #dc2626)",
            "&:disabled": { background: "#ccc" },
          }}
        >
          {isChanging ? "Đang đổi..." : "Đổi mật khẩu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

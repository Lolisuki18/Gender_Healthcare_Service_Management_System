/**
 * EmailChangeModal.js - Modal components cho việc thay đổi email
 *
 * Bao gồm:
 * - EmailChangeDialog: Form nhập email mới với step-by-step workflow
 * - Step 1: Nhập email mới
 * - Step 2: Xác nhận mã OTP
 * - Step 3: Lưu thay đổi
 *
 * Features:
 * - Validation email format
 * - OTP verification với countdown
 * - Resend OTP functionality
 * - Error handling và user feedback
 * - Step-by-step workflow
 */

import React, { useState, useEffect } from "react";
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
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Email as EmailIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { notify } from "@/utils/notification";

// ✅ Email Change Dialog Component with Steps
export const EmailChangeDialog = ({
  open,
  onClose,
  onSendCode,
  onVerifyAndSave,
  isSubmitting,
  isSendingCode,
  isVerifying,
  currentEmail,
}) => {
  //Quản lý state cho các bước, email mới
  const [activeStep, setActiveStep] = useState(0);
  // State quản lý email mới, mã xác nhận
  const [newEmail, setNewEmail] = useState("");
  // State quản lý mã xác nhận
  const [verificationCode, setVerificationCode] = useState("");
  // State quản lý lỗi cho các trường
  const [errors, setErrors] = useState({});
  // State quản lý countdown timer cho việc gửi lại mã
  const [countdown, setCountdown] = useState(0);
  // Các bước trong quá trình thay đổi email
  const steps = ["Nhập email mới", "Xác nhận mã", "Hoàn tất"];

  // Bộ đếm ngược để gửi lại mã
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  //xử lý khi thay đổi email nhập liệu
  const handleEmailChange = (e) => {
    // Lấy giá trị từ input email
    const value = e.target.value;
    // Cập nhật state email mới
    setNewEmail(value);

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors.newEmail) {
      setErrors({
        ...errors,
        newEmail: "",
      });
    }
  };
  // Validate email form
  // Kiểm tra tính hợp lệ của email mới nhập vào
  const validateEmailForm = () => {
    const newErrors = {};

    // kiêm tra nếu email mới
    if (!newEmail.trim()) {
      // có rỗng không ?
      newErrors.newEmail = "Vui lòng nhập email mới";
    } else {
      // nếu không rỗng thì kiểm tra định dạng email
      // Regex kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail.trim())) {
        // nếu không đúng định dạng thì báo lỗi
        newErrors.newEmail = "Email không đúng định dạng";
      } else if (newEmail.trim() === currentEmail) {
        // nếu email mới trùng với email hiện tại
        // Thông báo lỗi nếu email mới trùng với email hiện tại
        newErrors.newEmail = "Email mới phải khác email hiện tại";
      }
    }
    // Cập nhật state errors với các lỗi mới
    // Nếu không có lỗi thì trả về true, ngược lại trả về false
    setErrors(newErrors);
    // Trả về true nếu không có lỗi, false nếu có lỗi
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý gửi mã xác nhận
  // Kiểm tra tính hợp lệ của email mới và gửi mã xác nhận
  const handleSendCode = async () => {
    if (validateEmailForm()) {
      // nếu email hợp lệ

      try {
        await onSendCode(newEmail.trim()); // Gọi hàm gửi mã xác nhận với email mới
        // Cập nhật bước hiện tại và bắt đầu countdown
        setActiveStep(1);
        setCountdown(60);
        // Thông báo thành công
        notify.success("Thành công", "Mã xác nhận đã được gửi đến email mới!");
      } catch (error) {
        // Nếu có lỗi trong quá trình gửi mã, hiển thị thông báo lỗi
        notify.error("Lỗi", "Không thể gửi mã xác nhận. Vui lòng thử lại!");
      }
    }
  };

  // Xử lý gửi lại mã xác nhận
  // Gửi lại mã xác nhận nếu countdown đã hết hoặc người dùng yêu cầu
  const handleResendCode = async () => {
    try {
      // Nếu đang gửi mã thì không làm gì
      await onSendCode(newEmail.trim()); // Gọi hàm gửi mã xác nhận với email mới
      // Reset countdown về 60 giây
      setCountdown(60);
      // Thông báo thành công
      notify.success("Thành công", "Mã xác nhận mới đã được gửi!");
    } catch (error) {
      // Nếu có lỗi trong quá trình gửi lại mã, hiển thị thông báo lỗi
      notify.error("Lỗi", "Không thể gửi lại mã. Vui lòng thử lại!");
    }
  };

  // Xử lý xác nhận mã và lưu email mới
  // Kiểm tra mã xác nhận và lưu email mới nếu hợp lệ
  // Nếu mã xác nhận hợp lệ thì lưu email mới
  const handleVerifyAndSave = async () => {
    // Kiểm tra mã xác nhận có đúng định dạng 6 chữ số không
    if (verificationCode.trim().length === 6) {
      try {
        // Gọi hàm xác nhận mã và lưu email mới
        await onVerifyAndSave(newEmail.trim(), verificationCode.trim());
        // Nếu xác nhận thành công thì chuyển sang bước 2
        setActiveStep(2);
        // Thông báo thành công
        notify.success("Thành công", "Email đã được thay đổi thành công!");
      } catch (error) {
        // Nếu có lỗi trong quá trình xác nhận mã, hiển thị thông báo lỗi
        notify.error("Lỗi", "Mã xác nhận không đúng. Vui lòng thử lại!");
      }
    } else {
      //
      notify.warning("Mã không hợp lệ", "Vui lòng nhập mã xác nhận 6 chữ số!");
    }
  };

  //  Tạo hàm đóng modal riêng cho step thành công
  const handleSuccessClose = () => {
    // Reset form và đóng modal
    setActiveStep(0);
    setNewEmail("");
    setVerificationCode("");
    setErrors({});
    setCountdown(0);

    // Gọi callback để parent component biết việc cập nhật đã hoàn tất
    onClose(true); // Pass true để báo hiệu cập nhật thành công
  };

  // Hàm đóng modal chung
  // Reset form và đóng modal mà không báo hiệu cập nhật thành công
  const handleClose = () => {
    setActiveStep(0);
    setNewEmail("");
    setVerificationCode("");
    setErrors({});
    setCountdown(0);
    onClose(false); // Pass false cho việc đóng thông thường
  };

  // Render nội dung của từng bước
  // Dựa trên activeStep để hiển thị nội dung tương ứng
  const renderStepContent = () => {
    switch (activeStep) {
      // Bước 0: Nhập email mới
      // Hiển thị form nhập email mới và nút gửi mã xác nhận
      case 0:
        return (
          <Stack spacing={3}>
            {/* Current Email Display */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "rgba(74, 144, 226, 0.05)",
                border: "1px solid rgba(74, 144, 226, 0.1)",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1, color: "#6b7280" }}>
                Email hiện tại:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#4A90E2", fontWeight: 600 }}
              >
                {currentEmail}
              </Typography>
            </Paper>

            {/* New Email Input */}
            <TextField
              fullWidth
              label="Email mới"
              type="email"
              value={newEmail}
              onChange={handleEmailChange}
              error={!!errors.newEmail}
              helperText={errors.newEmail || "Nhập địa chỉ email mới của bạn"}
              placeholder="user@example.com"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#4A90E2" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );
      // Bước 1: Xác nhận mã
      // Hiển thị mã xác nhận đã gửi đến email mới và form nhập mã xác nhận
      // Cung cấp nút gửi lại mã nếu cần
      case 1:
        return (
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "rgba(74, 144, 226, 0.05)",
                border: "1px solid rgba(74, 144, 226, 0.1)",
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                Chúng tôi đã gửi mã xác nhận đến:
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#4A90E2", fontWeight: 600 }}
              >
                {newEmail}
              </Typography>
            </Paper>

            <TextField
              fullWidth
              label="Mã xác nhận (6 chữ số)"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                setVerificationCode(value);
              }}
              placeholder="Nhập mã xác nhận"
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: "center",
                  fontSize: "1.2rem",
                  letterSpacing: "0.5em",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VerifiedIcon
                      sx={{
                        color:
                          verificationCode.length === 6 ? "#1ABC9C" : "#ccc",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                variant="text"
                onClick={handleResendCode}
                disabled={isSendingCode || countdown > 0}
                startIcon={
                  isSendingCode ? <CircularProgress size={16} /> : <SendIcon />
                }
                sx={{ color: "#4A90E2" }}
              >
                {countdown > 0 ? (
                  <>
                    <TimerIcon sx={{ mr: 1, fontSize: 16 }} />
                    Gửi lại sau {countdown}s
                  </>
                ) : (
                  "Gửi lại mã"
                )}
              </Button>

              <Chip
                label={`${verificationCode.length}/6`}
                size="small"
                color={verificationCode.length === 6 ? "success" : "default"}
                sx={{
                  bgcolor:
                    verificationCode.length === 6 ? "#1ABC9C" : "default",
                }}
              />
            </Stack>
          </Stack>
        );
      // Bước 2: Hoàn tất
      // Hiển thị thông báo thành công khi email đã được thay đổi
      case 2:
        return (
          <Stack spacing={3} alignItems="center">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                background: "rgba(26, 188, 156, 0.05)",
                border: "1px solid rgba(26, 188, 156, 0.1)",
                textAlign: "center",
              }}
            >
              <VerifiedIcon sx={{ fontSize: 48, color: "#1ABC9C", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#1ABC9C", fontWeight: 600, mb: 1 }}
              >
                Thay đổi email thành công!
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Email của bạn đã được cập nhật thành:{" "}
                <strong>{newEmail}</strong>
              </Typography>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  // Render các hành động của dialog dựa trên bước hiện tại
  // Hiển thị các nút hành động khác nhau tùy theo bước hiện tại
  const renderDialogActions = () => {
    switch (activeStep) {
      // Bước 0: Nhập email mới
      // Hiển thị nút hủy và gửi mã xác nhận

      case 0:
        return (
          <>
            <Button
              onClick={handleClose}
              disabled={isSendingCode}
              sx={{ color: "#6b7280" }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSendCode}
              disabled={isSendingCode || !newEmail}
              startIcon={
                isSendingCode ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon />
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
              {isSendingCode ? "Đang gửi..." : "Gửi mã xác nhận"}
            </Button>
          </>
        );
      // Bước 1: Xác nhận mã
      // Hiển thị nút quay lại và lưu thay đổi
      // Nếu đang xác nhận thì hiển thị nút lưu với biểu tượng lưu
      // Nếu không thì hiển thị nút lưu với biểu tượng lưu
      // Nếu đang xác nhận thì hiển thị nút lưu với biểu tượng lưu
      case 1:
        return (
          <>
            <Button
              onClick={() => setActiveStep(0)}
              disabled={isVerifying}
              sx={{ color: "#6b7280" }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={handleVerifyAndSave}
              disabled={verificationCode.length !== 6 || isVerifying}
              startIcon={
                isVerifying ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveIcon />
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
              {isVerifying ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </>
        );
      // Bước 2: Hoàn tất
      // Hiển thị nút hoàn tất để đóng modal
      // Khi người dùng nhấn nút này, sẽ gọi hàm handleSuccessClose để reset form và đóng modal
      case 2:
        return (
          <Button
            variant="contained"
            onClick={handleSuccessClose}
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              color: "#fff",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
            }}
          >
            Hoàn tất
          </Button>
        );

      default:
        return null;
    }
  };
  // Render toàn bộ dialog
  // Bao gồm tiêu đề, nội dung và các hành động
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <EmailIcon sx={{ color: "#4A90E2" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Thay đổi Email
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          {renderStepContent()}

          {/* Lưu ý cảnh báo - Chỉ hiển thị ở bước 0 */}
          {activeStep === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.05)",
                border: "1px solid rgba(245, 158, 11, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, color: "#d97706" }}
              >
                ⚠️ Lưu ý quan trọng:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#92400e", fontSize: "0.9rem" }}
              >
                • Chúng tôi sẽ gửi mã xác nhận đến email mới
                <br />
                • Bạn cần xác nhận mã để hoàn tất thay đổi
                <br />• Email hiện tại vẫn hoạt động cho đến khi xác nhận thành
                công
              </Typography>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {renderDialogActions()}
      </DialogActions>
    </Dialog>
  );
};

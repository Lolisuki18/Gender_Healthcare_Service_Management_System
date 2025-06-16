/**
 * PhoneChangeModal.js - Modal component cho việc thay đổi số điện thoại
 *
 * Features:
 * - Form validation cho số điện thoại mới
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
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { notify } from "@/utils/notification";

// ✅ Phone Change Dialog Component with Steps
export const PhoneChangeDialog = ({
  open,
  onClose,
  onSendCode,
  onVerifyAndSave,
  isSubmitting,
  isSendingCode,
  isVerifying,
  currentPhone,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [newPhone, setNewPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  const steps = ["Nhập số điện thoại mới", "Xác nhận mã", "Hoàn tất"];

  // Countdown timer for resend code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setNewPhone(value);

    // Clear error when user starts typing
    if (errors.newPhone) {
      setErrors({
        ...errors,
        newPhone: "",
      });
    }
  };

  const validatePhoneForm = () => {
    const newErrors = {};

    // Validate new phone number
    if (!newPhone.trim()) {
      newErrors.newPhone = "Vui lòng nhập số điện thoại mới";
    } else if (!/^\d{9,11}$/.test(newPhone.trim())) {
      newErrors.newPhone = "Số điện thoại không hợp lệ (9-11 chữ số)";
    } else if (newPhone.trim() === currentPhone) {
      newErrors.newPhone = "Số điện thoại mới phải khác số hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (validatePhoneForm()) {
      try {
        await onSendCode(newPhone.trim());
        setActiveStep(1);
        setCountdown(60);
        notify.success(
          "Thành công",
          "Mã xác nhận đã được gửi đến số điện thoại mới!"
        );
      } catch (error) {
        notify.error("Lỗi", "Không thể gửi mã xác nhận. Vui lòng thử lại!");
      }
    }
  };

  const handleResendCode = async () => {
    try {
      await onSendCode(newPhone.trim());
      setCountdown(60);
      notify.success("Thành công", "Mã xác nhận mới đã được gửi!");
    } catch (error) {
      notify.error("Lỗi", "Không thể gửi lại mã. Vui lòng thử lại!");
    }
  };

  const handleVerifyAndSave = async () => {
    if (verificationCode.trim().length === 6) {
      try {
        await onVerifyAndSave(newPhone.trim(), verificationCode.trim());
        setActiveStep(2);
        notify.success(
          "Thành công",
          "Số điện thoại đã được thay đổi thành công!"
        );
      } catch (error) {
        notify.error("Lỗi", "Mã xác nhận không đúng. Vui lòng thử lại!");
      }
    } else {
      notify.warning("Mã không hợp lệ", "Vui lòng nhập mã xác nhận 6 chữ số!");
    }
  };

  // ✅ Tạo hàm đóng modal riêng cho step thành công
  const handleSuccessClose = () => {
    // Reset form và đóng modal
    setActiveStep(0);
    setNewPhone("");
    setVerificationCode("");
    setErrors({});
    setCountdown(0);

    // ✅ Gọi callback để parent component biết việc cập nhật đã hoàn tất
    onClose(true); // Pass true để báo hiệu cập nhật thành công
  };

  const handleClose = () => {
    setActiveStep(0);
    setNewPhone("");
    setVerificationCode("");
    setErrors({});
    setCountdown(0);
    onClose(false); // Pass false cho việc đóng thông thường
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Current Phone Display */}
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
                Số điện thoại hiện tại:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#4A90E2", fontWeight: 600 }}
              >
                {currentPhone}
              </Typography>
            </Paper>

            {/* New Phone Input */}
            <TextField
              fullWidth
              label="Số điện thoại mới"
              type="tel"
              value={newPhone}
              onChange={handlePhoneChange}
              error={!!errors.newPhone}
              helperText={errors.newPhone || "Nhập số điện thoại mới của bạn"}
              placeholder="0912345678"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "#4A90E2" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );

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
                Chúng tôi đã gửi mã xác nhận đến số:
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#4A90E2", fontWeight: 600 }}
              >
                {newPhone}
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
                Thay đổi số điện thoại thành công!
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Số điện thoại của bạn đã được cập nhật thành:{" "}
                <strong>{newPhone}</strong>
              </Typography>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  const renderDialogActions = () => {
    switch (activeStep) {
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
              disabled={isSendingCode || !newPhone}
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <PhoneIcon sx={{ color: "#4A90E2" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Thay đổi Số điện thoại
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

          {/* Warning Notice - Only show in step 0 */}
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
                • Chúng tôi sẽ gửi mã xác nhận đến số điện thoại mới
                <br />
                • Bạn cần xác nhận mã để hoàn tất thay đổi
                <br />• Số điện thoại hiện tại vẫn hoạt động cho đến khi xác
                nhận thành công
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

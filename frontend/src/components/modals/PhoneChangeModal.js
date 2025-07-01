/**
 * PhoneChangeModal.js- Thành phần phương thức để thay đổi số điện thoại
 *
 * Đặc trưng:
 * - Xác thực biểu mẫu cho số điện thoại mới
 * - Xác minh OTP và đếm ngược
 * - Chức năng gửi lại OTP
 * - Xử lý lỗi và phản hồi của người dùng
 * - Quy trình làm việc từng bước
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
import { notify } from "@/utils/notify";

// Thành phần hộp thoại thay đổi điện thoại với các bước
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
  // State quản lý các bước, số điện thoại mới, mã xác minh và lỗi
  const [activeStep, setActiveStep] = useState(0);
  // Số điện thoại mới
  const [newPhone, setNewPhone] = useState("");
  // Mã xác minh
  const [verificationCode, setVerificationCode] = useState("");
  // Lỗi biểu mẫu
  const [errors, setErrors] = useState({});
  // Đếm ngược cho gửi lại mã
  // Sử dụng useState để quản lý thời gian đếm ngược
  const [countdown, setCountdown] = useState(0);

  // Các bước trong quy trình thay đổi số điện thoại
  // Mảng chứa các bước của quy trình thay đổi số điện thoại
  const steps = ["Nhập số điện thoại mới", "Xác nhận mã", "Hoàn tất"];

  // Bộ đếm ngược để gửi lại mã
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Hàm xử lý thay đổi số điện thoại mới
  // Hàm này sẽ được gọi khi người dùng nhập số điện thoại mới
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setNewPhone(value);
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors.newPhone) {
      setErrors({
        ...errors,
        newPhone: "",
      });
    }
  };

  // Hàm xác thực biểu mẫu số điện thoại mới
  // Hàm này sẽ kiểm tra tính hợp lệ của số điện thoại mới nhập vào
  const validatePhoneForm = () => {
    const newErrors = {};
    // Xác thực số điện thoại mới
    if (!newPhone.trim()) {
      // Nếu không có số điện thoại mới
      // Thêm lỗi vào đối tượng newErrors
      newErrors.newPhone = "Vui lòng nhập số điện thoại mới";
    } else if (!/^\d{9,11}$/.test(newPhone.trim())) {
      //
      // Nếu số điện thoại mới không hợp lệ (không phải 9-11 chữ số)
      // Thêm lỗi vào đối tượng newErrors
      newErrors.newPhone = "Số điện thoại không hợp lệ (9-11 chữ số)";
    } else if (newPhone.trim() === currentPhone) {
      // Nếu số điện thoại mới trùng với số hiện tại
      // Thêm lỗi vào đối tượng newErrors
      newErrors.newPhone = "Số điện thoại mới phải khác số hiện tại";
    }
    // Cập nhật trạng thái lỗi
    // Cập nhật trạng thái lỗi bằng cách gọi setErrors với đối tượng newErrors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm gửi mã xác nhận
  // Hàm này sẽ được gọi khi người dùng nhấn nút gửi mã xác nhận
  const handleSendCode = async () => {
    // Kiểm tra tính hợp lệ của biểu mẫu số điện thoại mới
    if (validatePhoneForm()) {
      try {
        // Nếu biểu mẫu hợp lệ, gọi hàm onSendCode để gửi mã xác nhận
        await onSendCode(newPhone.trim());
        // Đặt bước hiện tại là 1 (bước xác nhận mã)
        setActiveStep(1);
        // Đặt đếm ngược là 60 giây
        setCountdown(60);
        // Hiển thị thông báo thành công
        notify.success(
          "Thành công",
          "Mã xác nhận đã được gửi đến số điện thoại mới!"
        );
      } catch (error) {
        // Nếu có lỗi khi gửi mã xác nhận, hiển thị thông báo lỗi
        notify.error("Lỗi", "Không thể gửi mã xác nhận. Vui lòng thử lại!");
      }
    }
  };

  // Hàm gửi lại mã xác nhận
  // Hàm này sẽ được gọi khi người dùng nhấn nút gửi lại mã xác nhận
  const handleResendCode = async () => {
    try {
      // Gọi hàm onSendCode để gửi lại mã xác nhận
      await onSendCode(newPhone.trim());
      // Đặt lại đếm ngược về 60 giây
      setCountdown(60);
      notify.success("Thành công", "Mã xác nhận mới đã được gửi!");
    } catch (error) {
      notify.error("Lỗi", "Không thể gửi lại mã. Vui lòng thử lại!");
    }
  };

  // Hàm xác minh mã và lưu số điện thoại mới
  // Hàm này sẽ được gọi khi người dùng nhấn nút xác minh và lưu
  const handleVerifyAndSave = async () => {
    // Kiểm tra xem mã xác nhận có hợp lệ không
    if (verificationCode.trim().length === 6) {
      // Nếu mã xác nhận có đúng 6 chữ số
      try {
        // Gọi hàm onVerifyAndSave để xác minh mã và lưu số điện thoại mới
        await onVerifyAndSave(newPhone.trim(), verificationCode.trim());
        // Đặt bước hiện tại là 2 (bước thành công)
        setActiveStep(2);
        // Hiển thị thông báo thành công
        notify.success(
          "Thành công",
          "Số điện thoại đã được thay đổi thành công!"
        );
      } catch (error) {
        // Nếu có lỗi khi xác minh mã, hiển thị thông báo lỗi
        notify.error("Lỗi", "Mã xác nhận không đúng. Vui lòng thử lại!");
      }
    } else {
      // Nếu mã xác nhận không hợp lệ (không đúng 6 chữ số)
      // Hiển thị thông báo cảnh báo
      notify.warning("Mã không hợp lệ", "Vui lòng nhập mã xác nhận 6 chữ số!");
    }
  };

  //  Tạo hàm đóng modal riêng cho step thành công
  const handleSuccessClose = () => {
    // Reset form và đóng modal
    setActiveStep(0);
    setNewPhone("");
    setVerificationCode("");
    setErrors({});
    setCountdown(0);

    // Gọi callback để parent component biết việc cập nhật đã hoàn tất
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

  // Hàm hiển thị nội dung của từng bước
  // Hàm này sẽ trả về nội dung tương ứng với từng bước trong quy trình thay đổi số điện thoại
  // Dựa trên giá trị của activeStep, hàm này sẽ trả về nội dung khác nhau cho từng bước
  const renderStepContent = () => {
    switch (activeStep) {
      // Trường hợp activeStep là 0 (bước nhập số điện thoại mới)
      // Hiển thị ô nhập số điện thoại mới và thông tin hiện tại
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
      // Trường hợp activeStep là 1 (bước xác nhận mã)
      // Hiển thị ô nhập mã xác nhận và nút gửi lại mã
      // Cung cấp thông tin về số điện thoại mới
      // Cung cấp nút gửi lại mã nếu cần
      // Trả về nội dung xác nhận mã
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
      // Trường hợp activeStep là 2 (bước thành công)
      // Hiển thị thông báo thành công và số điện thoại mới
      // Cung cấp nút hoàn tất để đóng modal
      // Trả về nội dung thành công
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

      // Trả về null nếu không có bước nào khớp
      // Trả về null nếu không có bước nào khớp với activeStep
      default:
        return null;
    }
  };

  // Hàm hiển thị các hành động của hộp thoại
  // Hàm này sẽ trả về các nút hành động tương ứng với từng bước trong quy trình thay đổi số điện thoại
  // Dựa trên giá trị của activeStep, hàm này sẽ trả về các nút khác nhau cho từng bước
  const renderDialogActions = () => {
    switch (activeStep) {
      // Trường hợp activeStep là 0 (bước nhập số điện thoại mới)
      // Hiển thị nút hủy và nút gửi mã xác nhận
      // Trả về các nút hành động cho bước nhập số điện thoại mới
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

      // Trường hợp activeStep là 1 (bước xác nhận mã)
      // Hiển thị nút quay lại và nút lưu thay đổi
      // Trả về các nút hành động cho bước xác nhận mã
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
      // Trường hợp activeStep là 2 (bước thành công)
      // Hiển thị nút hoàn tất để đóng modal
      // Trả về các nút hành động cho bước thành công
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

  // Trả về thành phần Dialog với các tiêu đề, nội dung và hành động
  // Thành phần này sẽ hiển thị hộp thoại thay đổi số điện thoại với các
  // bước tương ứng, bao gồm nhập số điện thoại mới, xác nhận mã và thông báo thành công

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
          {/* Các bước */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Nội dung các bước*/}
          {renderStepContent()}

          {/*Lưu ý cảnh báo - Chỉ hiển thị ở bước 0*/}
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

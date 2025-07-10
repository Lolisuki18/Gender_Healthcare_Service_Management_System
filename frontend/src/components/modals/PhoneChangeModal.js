/**
 * PhoneChangeModal.js- Thành phần modal để thay đổi và xác thực số điện thoại
 *
 * Đặc trưng:
 * - Xác thực biểu mẫu cho số điện thoại mới
 * - Gửi và xác minh OTP qua SMS
 * - Chức năng gửi lại OTP với countdown
 * - Xử lý lỗi và phản hồi của người dùng
 * - Quy trình làm việc từng bước (2 steps: Enter Phone -> Verify OTP)
 */

import React, { useState, useEffect } from 'react';
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
  Alert,
  Box,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const STEPS = ['Nhập số điện thoại', 'Xác thực OTP'];
const COUNTDOWN_TIME = 60; // 60 seconds

// Thành phần hộp thoại thay đổi điện thoại với xác thực OTP
export const PhoneChangeDialog = ({
  open,
  onClose,
  onSendCode,
  onVerifyAndSave,
  isSendingCode,
  isVerifying,
  currentPhone,
  isPhoneVerified = false,
  mode = 'change', // 'verify' hoặc 'change'
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setNewPhone('');
      setOtp('');
      setErrors({});
      setCountdown(0);
      setCanResend(true);
    } else {
      // Nếu mode là 'verify' (xác thực phone hiện tại), skip bước 1
      if (mode === 'verify' && currentPhone && !isPhoneVerified) {
        setNewPhone(currentPhone);
        setActiveStep(1);
        // Tự động gửi OTP khi mở modal verify
        setTimeout(() => {
          handleSendCode(currentPhone);
        }, 100);
      } else if (mode === 'change') {
        // Mode 'change' - bắt đầu từ step 0 để nhập số mới
        setActiveStep(0);
        setNewPhone('');
      }
    }
  }, [open, currentPhone, isPhoneVerified, mode]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setNewPhone(value);
    if (errors.newPhone) {
      setErrors({ ...errors, newPhone: '' });
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
    if (errors.otp) {
      setErrors({ ...errors, otp: '' });
    }
  };

  const validatePhoneForm = () => {
    const newErrors = {};
    if (!newPhone.trim()) {
      newErrors.newPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9,10}$/.test(newPhone.trim())) {
      newErrors.newPhone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 chữ số)';
    } else if (mode === 'change' && newPhone.trim() === currentPhone && isPhoneVerified) {
      newErrors.newPhone = 'Số điện thoại mới phải khác số hiện tại';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpForm = () => {
    const newErrors = {};
    if (!otp.trim()) {
      newErrors.otp = 'Vui lòng nhập mã OTP';
    } else if (!/^\d{6}$/.test(otp.trim())) {
      newErrors.otp = 'Mã OTP phải có 6 chữ số';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (phone = newPhone) => {
    if (!phone && !validatePhoneForm()) return;
    
    try {
      const result = await onSendCode(phone || newPhone.trim());
      if (result && result.success) {
        setActiveStep(1);
        setCountdown(COUNTDOWN_TIME);
        setCanResend(false);
        setOtp('');
        setErrors({});
      } else {
        setErrors({ newPhone: result?.message || 'Không thể gửi mã OTP' });
      }
    } catch (error) {
      setErrors({ newPhone: 'Có lỗi xảy ra khi gửi mã OTP' });
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtpForm()) return;

    try {
      const result = await onVerifyAndSave(newPhone.trim(), otp.trim());
      if (result && result.success) {
        if (typeof onClose === 'function') onClose(true);
      } else {
        setErrors({ otp: result?.message || 'Mã OTP không đúng' });
      }
    } catch (error) {
      setErrors({ otp: 'Có lỗi xảy ra khi xác thực' });
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      handleSendCode(newPhone);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setOtp('');
    setErrors({});
  };

  const handleClose = (success) => {
    setActiveStep(0);
    setNewPhone('');
    setOtp('');
    setErrors({});
    setCountdown(0);
    setCanResend(true);
    if (typeof onClose === 'function') onClose(success === true);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <PhoneIcon sx={{ color: '#4A90E2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {mode === 'verify' ? 'Xác thực Số điện thoại' : 'Thay đổi Số điện thoại'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Phone Input */}
          {activeStep === 0 && (
            <>
              {currentPhone && (mode === 'change' || isPhoneVerified) && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    background: 'rgba(74, 144, 226, 0.05)',
                    border: '1px solid rgba(74, 144, 226, 0.1)',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1, color: '#6b7280' }}>
                    Số điện thoại hiện tại:
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body1"
                      sx={{ color: '#4A90E2', fontWeight: 600 }}
                    >
                      {currentPhone}
                    </Typography>
                    {isPhoneVerified && (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Đã xác thực"
                        size="small"
                        sx={{
                          background: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '11px',
                        }}
                      />
                    )}
                  </Stack>
                </Paper>
              )}

              <TextField
                fullWidth
                label={mode === 'change' ? "Số điện thoại mới" : "Số điện thoại"}
                type="tel"
                value={newPhone}
                onChange={handlePhoneChange}
                error={!!errors.newPhone}
                helperText={errors.newPhone || 'Nhập số điện thoại (VD: 0912345678)'}
                placeholder="0912345678"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#4A90E2' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {mode === 'verify' && currentPhone && (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  Để đảm bảo bảo mật, chúng tôi sẽ gửi mã xác thực SMS đến số điện thoại này.
                </Alert>
              )}
            </>
          )}

          {/* Step 2: OTP Verification */}
          {activeStep === 1 && (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.05)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <Typography variant="body2" sx={{ mb: 1, color: '#6b7280' }}>
                  Mã xác thực đã được gửi đến:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#22C55E', fontWeight: 600 }}
                >
                  {newPhone}
                </Typography>
              </Paper>

              <TextField
                fullWidth
                label="Mã OTP"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                error={!!errors.otp}
                helperText={errors.otp || 'Nhập mã 6 chữ số từ SMS'}
                placeholder="123456"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedIcon sx={{ color: '#22C55E' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  onClick={handleResendCode}
                  disabled={!canResend || isSendingCode}
                  startIcon={
                    !canResend ? (
                      <TimerIcon />
                    ) : isSendingCode ? (
                      <CircularProgress size={16} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  sx={{ textTransform: 'none' }}
                >
                  {!canResend
                    ? `Gửi lại sau ${countdown}s`
                    : isSendingCode
                    ? 'Đang gửi...'
                    : 'Gửi lại mã OTP'}
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={() => handleClose(false)}
          disabled={isSendingCode || isVerifying}
          sx={{ color: '#6b7280' }}
        >
          Hủy
        </Button>

        {activeStep === 1 && (
          <Button
            onClick={handleBack}
            disabled={isSendingCode || isVerifying}
            startIcon={<ArrowBackIcon />}
            sx={{ color: '#6b7280' }}
          >
            Quay lại
          </Button>
        )}

        {activeStep === 0 ? (
          <Button
            variant="contained"
            onClick={() => handleSendCode()}
            disabled={isSendingCode || !newPhone}
            startIcon={
              isSendingCode ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              '&:disabled': { background: '#ccc' },
            }}
          >
            {isSendingCode ? 'Đang gửi...' : 'Gửi mã OTP'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={isVerifying || !otp || otp.length !== 6}
            startIcon={
              isVerifying ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <VerifiedIcon />
              )
            }
            sx={{
              background: 'linear-gradient(45deg, #22C55E, #10B981)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
              '&:disabled': { background: '#ccc' },
            }}
          >
            {isVerifying ? 'Đang xác thực...' : 'Xác thực & Lưu'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

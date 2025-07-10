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
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { notify } from '@/utils/notify';

// Thành phần hộp thoại thay đổi điện thoại đơn giản chỉ nhập số mới và lưu
export const PhoneChangeDialog = ({
  open,
  onClose,
  onSave,
  isSubmitting,
  currentPhone,
}) => {
  const [newPhone, setNewPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setNewPhone('');
      setErrors({});
    }
  }, [open]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setNewPhone(value);
    if (errors.newPhone) {
      setErrors({ ...errors, newPhone: '' });
    }
  };

  const validatePhoneForm = () => {
    const newErrors = {};
    if (!newPhone.trim()) {
      newErrors.newPhone = 'Vui lòng nhập số điện thoại mới';
    } else if (!/^\d{9,11}$/.test(newPhone.trim())) {
      newErrors.newPhone = 'Số điện thoại không hợp lệ (9-11 chữ số)';
    } else if (newPhone.trim() === currentPhone) {
      newErrors.newPhone = 'Số điện thoại mới phải khác số hiện tại';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validatePhoneForm()) {
      try {
        const result = await onSave(newPhone.trim());
        if (result && result.success) {
          if (typeof onClose === 'function') onClose(true);
        }
      } catch (error) {
        // Xử lý lỗi nếu cần
      }
    }
  };

  const handleClose = (success) => {
    setNewPhone('');
    setErrors({});
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
            Thay đổi Số điện thoại
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
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
            <Typography
              variant="body1"
              sx={{ color: '#4A90E2', fontWeight: 600 }}
            >
              {currentPhone}
            </Typography>
          </Paper>
          <TextField
            fullWidth
            label="Số điện thoại mới"
            type="tel"
            value={newPhone}
            onChange={handlePhoneChange}
            error={!!errors.newPhone}
            helperText={errors.newPhone || 'Nhập số điện thoại mới của bạn'}
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
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={() => handleClose(false)}
          disabled={isSubmitting}
          sx={{ color: '#6b7280' }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting || !newPhone}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveIcon />
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
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

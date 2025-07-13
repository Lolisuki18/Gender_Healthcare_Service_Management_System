import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from '@mui/material';
import {
  MedicalServices as MedicalServicesIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const BlueButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
  color: 'white',
  boxShadow: '0 2px 8px #4A90E222',
  '&:hover': {
    background: 'linear-gradient(90deg, #357ABD 0%, #16A085 100%)',
    color: 'white',
  },
}));

const DangerButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #e53935 60%, #b71c1c 100%)',
  color: 'white',
  boxShadow: '0 2px 8px #e5737322',
  '&:hover': {
    background: 'linear-gradient(90deg, #b71c1c 0%, #e57373 100%)',
    color: 'white',
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  background: '#f5f5f5',
  color: '#616161',
  border: '1px solid #e0e0e0',
  '&:hover': {
    background: '#eeeeee',
    color: '#4A90E2',
    border: '1px solid #b3e5fc',
  },
}));

const DeleteAccountModal = ({
  open,
  onClose,
  onSendVerificationCode,
  onDeleteAccount,
  isSendingCode,
  isDeleting,
}) => {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const steps = ['Nhập mật khẩu', 'Xác thực email', 'Xác nhận cuối cùng'];

  const handleSendCode = async () => {
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    setError('');
    const result = await onSendVerificationCode(password);
    if (result.success) {
      setStep(1);
    } else {
      setError(result.message || 'Có lỗi xảy ra khi gửi mã xác thực');
    }
  };

  const handleDeleteAccount = async () => {
    if (!verificationCode.trim()) {
      setError('Vui lòng nhập mã xác thực');
      return;
    }
    setError('');
    const result = await onDeleteAccount(password, verificationCode);
    if (result.success) {
      setStep(2);
    } else {
      setError(result.message || 'Có lỗi xảy ra khi xóa tài khoản');
    }
  };

  const handleClose = () => {
    setStep(0);
    setPassword('');
    setVerificationCode('');
    setError('');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Alert
              severity="warning"
              icon={
                <WarningIcon fontSize="inherit" sx={{ color: '#FFA726' }} />
              }
              sx={{
                mb: 2,
                background: '#fffde7',
                border: '1px solid #ffe082',
                color: '#795548',
                borderRadius: 2,
                fontSize: 15,
              }}
            >
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Việc xóa tài khoản sẽ xóa vĩnh viễn tất
                cả dữ liệu của bạn và không thể khôi phục lại. Hãy chắc chắn
                rằng bạn đã sao lưu các thông tin cần thiết.
              </Typography>
            </Alert>
            <Typography
              variant="body1"
              sx={{ mb: 2, color: '#357ABD', fontWeight: 500 }}
            >
              Để tiếp tục, vui lòng nhập mật khẩu hiện tại của bạn:
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Mật khẩu hiện tại"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
              autoFocus
              sx={{ background: '#f8fafc', borderRadius: 2 }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Alert
              severity="info"
              icon={<EmailIcon fontSize="inherit" sx={{ color: '#4A90E2' }} />}
              sx={{
                mb: 2,
                background: '#e3f2fd',
                border: '1px solid #90caf9',
                color: '#1976d2',
                borderRadius: 2,
                fontSize: 15,
              }}
            >
              <Typography variant="body2">
                Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp
                thư và nhập mã xác thực:
              </Typography>
            </Alert>
            <TextField
              fullWidth
              label="Mã xác thực"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              error={!!error}
              helperText={error}
              autoFocus
              inputProps={{ maxLength: 6 }}
              sx={{ background: '#f8fafc', borderRadius: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                background: '#e8f5e9',
                border: '1px solid #a5d6a7',
                color: '#388e3c',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">
                Tài khoản đã được xóa thành công!
              </Typography>
            </Alert>
            <Typography
              variant="body1"
              sx={{ mb: 2, color: '#388e3c', fontWeight: 500 }}
            >
              Tất cả dữ liệu của bạn đã được xóa vĩnh viễn. Bạn sẽ được chuyển
              về trang đăng nhập.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (step === 2) {
      return (
        <BlueButton onClick={handleClose} fullWidth sx={{ mt: 2 }}>
          Đóng
        </BlueButton>
      );
    }
    return (
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <CancelButton onClick={handleClose} variant="outlined">
          Hủy
        </CancelButton>
        {step === 0 && (
          <BlueButton
            onClick={handleSendCode}
            disabled={isSendingCode}
            startIcon={<EmailIcon />}
          >
            {isSendingCode ? 'Đang gửi...' : 'Gửi mã xác thực'}
          </BlueButton>
        )}
        {step === 1 && (
          <DangerButton
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            startIcon={<DeleteIcon />}
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa tài khoản'}
          </DangerButton>
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: '#fff',
          boxShadow: '0 8px 32px #4A90E233',
          border: '2px solid #e3f2fd',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: '#fff',
          color: '#e53935',
          textAlign: 'center',
          position: 'relative',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          pb: 2,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#bdbdbd',
            '&:hover': {
              backgroundColor: 'rgba(76, 144, 226, 0.08)',
              color: '#e53935',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <MedicalServicesIcon sx={{ fontSize: 36, mr: 1, color: '#4A90E2' }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#e53935' }}>
            Xóa tài khoản
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ opacity: 0.85, color: '#757575', fontWeight: 400 }}
        >
          Hành động này không thể hoàn tác
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stepper
          activeStep={step}
          sx={{
            mb: 3,
            background: 'transparent',
            '.MuiStepIcon-root': {
              color: '#e0e0e0',
              '&.Mui-active': { color: '#4A90E2' },
              '&.Mui-completed': { color: '#43a047' },
            },
            '.MuiStepLabel-label': {
              color: '#616161',
              fontWeight: 600,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>{renderActions()}</DialogActions>
    </Dialog>
  );
};

export default DeleteAccountModal;

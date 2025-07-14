import React, { useState, useRef } from 'react';
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
import { confirmDialog } from '@/utils/confirmDialog';

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
  const passwordRef = useRef('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const theme = useTheme();

  const steps = ['Nhập mật khẩu', 'Xác thực email'];

  const handleSendCode = async () => {
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    setError('');
    const result = await onSendVerificationCode(password);
    if (result.success) {
      passwordRef.current = password; // Lưu lại password khi thành công
      setStep(1);
    } else {
      setError(result.message || 'Có lỗi xảy ra khi gửi mã xác thực');
    }
  };

  const handleResendCode = async () => {
    setResendMessage('');
    setResendLoading(true);
    const result = await onSendVerificationCode(passwordRef.current);
    setResendLoading(false);
    if (result.success) {
      setResendMessage('Mã xác thực mới đã được gửi đến email của bạn.');
    } else {
      setResendMessage(result.message || 'Không thể gửi lại mã xác thực.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!verificationCode.trim()) {
      setError('Vui lòng nhập mã xác thực');
      return;
    }
    setError('');
    // Hiện dialog xác nhận mạnh mẽ trước khi xóa
    const confirmed = await confirmDialog.danger(
      <div
        style={{
          textAlign: 'center',
          fontWeight: 500,
          fontSize: 17,
          padding: '8px 0',
          color: '#b71c1c',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            fontSize: 54,
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            role="img"
            aria-label="danger"
            style={{
              background: 'linear-gradient(135deg, #e3f2fd 60%, #ffcdd2 100%)',
              borderRadius: '50%',
              padding: 14,
              boxShadow: '0 2px 8px #90caf940',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e53935',
              border: '2px solid #b3e5fc',
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#e3f2fd" />
              <path
                d="M12 7v5"
                stroke="#e53935"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1.2" fill="#e53935" />
            </svg>
          </span>
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 20,
            color: '#e53935',
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          CẢNH BÁO QUAN TRỌNG
        </div>
        <div
          style={{
            margin: '10px 0 8px 0',
            color: '#b71c1c',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Hành động này sẽ{' '}
          <span
            style={{
              color: '#e53935',
              fontWeight: 900,
              textDecoration: 'underline',
            }}
          >
            xóa vĩnh viễn
          </span>{' '}
          toàn bộ tài khoản và{' '}
          <span
            style={{
              color: '#1976d2',
              fontWeight: 700,
            }}
          >
            dữ liệu sức khỏe
          </span>{' '}
          của bạn khỏi hệ thống.
        </div>
        <div
          style={{
            color: '#fff',
            background: 'linear-gradient(90deg, #b71c1c 60%, #e57373 100%)',
            fontWeight: 700,
            fontSize: 15,
            display: 'inline-block',
            padding: '3px 16px',
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 6,
            letterSpacing: 0.5,
            boxShadow: '0 1px 4px #e5737322',
          }}
        >
          KHÔNG THỂ KHÔI PHỤC sau khi thực hiện!
        </div>
        <div
          style={{
            color: '#333',
            fontWeight: 500,
            fontSize: 15,
            marginTop: 16,
          }}
        >
          Nếu bạn cần hỗ trợ, hãy liên hệ với đội ngũ CSKH của chúng tôi.
          <br />
          Bạn có chắc chắn muốn tiếp tục không?
        </div>
      </div>,
      {
        confirmText: 'XÓA VĨNH VIỄN',
        cancelText: 'Hủy',
        title: 'Cảnh báo',
        showCloseButton: true,
      }
    );
    if (!confirmed) return;
    const realPassword = passwordRef.current;
    const result = await onDeleteAccount(realPassword, verificationCode);
    if (result.success) {
      handleClose(); // Đóng modal ngay khi xóa thành công
    } else {
      setError(result.message || 'Có lỗi xảy ra khi xóa tài khoản');
    }
  };

  const handleClose = () => {
    setStep(0);
    setPassword('');
    setVerificationCode('');
    setError('');
    passwordRef.current = '';
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
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
              <Button
                size="small"
                variant="text"
                onClick={handleResendCode}
                disabled={resendLoading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#1976d2',
                  '&:hover': { color: '#1565c0', background: '#e3f2fd' },
                  ml: '-8px',
                }}
              >
                {resendLoading ? 'Đang gửi lại...' : 'Gửi lại mã'}
              </Button>
              {resendMessage && (
                <Typography
                  variant="body2"
                  sx={{ color: '#388e3c', fontWeight: 500 }}
                >
                  {resendMessage}
                </Typography>
              )}
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
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

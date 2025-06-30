import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  Card,
  Grid,
  Alert,
  Tooltip,
  Container,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import {
  EmailChangeDialog,
  PasswordChangeDialog,
  PhoneChangeDialog,
} from '../modals';
import localStorageUtil from '@/utils/localStorage';
import { toast } from 'react-toastify';
import { userService } from '@/services/userService';

// Component quản lý bảo mật: email, sđt, mật khẩu
const SecurityContent = () => {
  // Đảm bảo lấy thông tin người dùng với cấu trúc chuẩn {success, message, data}
  const userProfileRaw = localStorageUtil.get('userProfile');
  // Chuẩn hóa dữ liệu người dùng - đảm bảo đang làm việc với cấu trúc data
  const user = userProfileRaw?.data || userProfileRaw || {};

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Log để debug cấu trúc dữ liệu
  console.log('UserProfile structure:', userProfileRaw);
  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: '',
    phone: '',
    birthDay: '',
    email: '',
    gender: '',
    address: '',
  });

  /**
   * Handle send verification code
   */
  const handleSendCode = async (email) => {
    try {
      setIsSendingCode(true);

      toast.info('Đang xử lý', 'Đang gửi mã xác nhận đến email mới...', {
        duration: 2000,
      });

      // Call API to send verification code
      const response = await userService.sendEmailVerificationCode(email);

      if (response.success) {
        return Promise.resolve();
      } else {
        throw new Error(response.message || 'Không thể gửi mã xác nhận');
      }
    } catch (error) {
      console.error('❌ Error sending verification code:', error);
      throw error;
    } finally {
      setIsSendingCode(false);
    }
  };
  /**
   * Handle verify and save email
   */
  const handleVerifyAndSave = async (email, verificationCode) => {
    try {
      setIsVerifying(true);

      toast.info('Đang xác nhận', 'Đang xác nhận mã và cập nhật email...', {
        duration: 2000,
      });

      // Call API to verify code and update email
      const response = await userService.verifyEmailChange({
        newEmail: email,
        verificationCode: verificationCode,
      });

      if (response.success) {
        // Update email in form data
        const updatedFormData = {
          ...formDataUpdate,
          email: email,
        };

        setFormDataUpdate(updatedFormData); // Đảm bảo dữ liệu userProfile giữ đúng cấu trúc {success, message, data}
        const currentProfile = localStorageUtil.get('userProfile') || {};

        // Nếu userProfile đã có cấu trúc data, cập nhật trong data
        if (currentProfile.data) {
          const updatedProfile = {
            ...currentProfile,
            data: {
              ...currentProfile.data,
              email: email,
            },
          };
          localStorageUtil.set('userProfile', updatedProfile);
          console.log(
            '✅ Email updated successfully in data structure:',
            updatedProfile
          );
        } else {
          // Nếu userProfile là object trực tiếp, chuyển đổi sang cấu trúc chuẩn
          const updatedProfile = {
            success: true,
            message: 'User data updated',
            data: {
              ...currentProfile,
              email: email,
            },
          };
          localStorageUtil.set('userProfile', updatedProfile);
          console.log(
            '✅ Email updated and structure normalized:',
            updatedProfile
          );
        }

        toast.success('Thành công!', 'Email đã được cập nhật thành công!', {
          duration: 4000,
        });

        return Promise.resolve();
      } else {
        throw new Error(response.message || 'Mã xác nhận không đúng');
      }
    } catch (error) {
      console.error('❌ Error verifying email:', error);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle send verification code for phone
   */
  const handleSendPhoneCode = async (phone) => {
    try {
      setIsSendingCode(true);

      toast.info(
        'Đang xử lý',
        'Đang gửi mã xác nhận đến số điện thoại mới...',
        {
          duration: 2000,
        }
      );

      // Call API to send verification code to phone
      const response = await userService.sendPhoneVerificationCode(phone);

      if (response.success) {
        return Promise.resolve();
      } else {
        throw new Error(response.message || 'Không thể gửi mã xác nhận');
      }
    } catch (error) {
      console.error('❌ Error sending phone verification code:', error);
      throw error;
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * Handle verify and save phone
   */
  const handleVerifyAndSavePhone = async (phone, verificationCode) => {
    try {
      setIsVerifying(true);

      toast.info(
        'Đang xác nhận',
        'Đang xác nhận mã và cập nhật số điện thoại...',
        {
          duration: 2000,
        }
      );

      // Call API to verify code and update phone
      const response = await userService.verifyPhoneChange({
        newPhone: phone,
        verificationCode: verificationCode,
      });

      if (response.success) {
        // Đảm bảo dữ liệu userProfile giữ đúng cấu trúc {success, message, data}
        const currentProfile = localStorageUtil.get('userProfile') || {};

        // Nếu userProfile đã có cấu trúc data, cập nhật trong data
        if (currentProfile.data) {
          const updatedProfile = {
            ...currentProfile,
            data: {
              ...currentProfile.data,
              phone: phone,
            },
          };
          localStorageUtil.set('userProfile', updatedProfile);
          console.log(
            '✅ Phone updated successfully in data structure:',
            updatedProfile
          );
        } else {
          // Nếu userProfile là object trực tiếp, chuyển đổi sang cấu trúc chuẩn
          const updatedProfile = {
            success: true,
            message: 'User data updated',
            data: {
              ...currentProfile,
              phone: phone,
            },
          };
          localStorageUtil.set('userProfile', updatedProfile);
          console.log(
            '✅ Phone updated and structure normalized:',
            updatedProfile
          );
        }

        toast.success(
          'Thành công!',
          'Số điện thoại đã được cập nhật thành công!',
          {
            duration: 4000,
          }
        );

        return Promise.resolve();
      } else {
        throw new Error(response.message || 'Mã xác nhận không đúng');
      }
    } catch (error) {
      console.error('❌ Error verifying phone:', error);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };
  const handlePasswordChange = async (passwordData) => {
    try {
      setIsChangingPassword(true);

      toast.info('Đang xử lý', 'Đang đổi mật khẩu...', { duration: 2000 });

      const response = await userService.changePassword(passwordData);

      if (response.success) {
        setIsPasswordDialogOpen(false);

        // Cập nhật token nếu API trả về
        if (response.data?.token) {
          // Lưu token mới vào localStorage
          localStorageUtil.set('token', response.data.token);

          // Đảm bảo dữ liệu userProfile giữ đúng cấu trúc {success, message, data}
          const currentProfile = localStorageUtil.get('userProfile') || {};

          // Nếu userProfile đã có cấu trúc data, cập nhật token nếu cần
          if (currentProfile.data) {
            // Chỉ cập nhật token nếu token được lưu trong userProfile
            if (currentProfile.token) {
              const updatedProfile = {
                ...currentProfile,
                token: response.data.token,
              };
              localStorageUtil.set('userProfile', updatedProfile);
            }
          } else if (currentProfile.token) {
            // Nếu là object trực tiếp và có token, chuyển đổi sang cấu trúc chuẩn
            const updatedProfile = {
              success: true,
              message: 'User data updated',
              data: {
                ...currentProfile,
              },
              token: response.data.token,
            };
            localStorageUtil.set('userProfile', updatedProfile);
          }
        }

        toast.success(
          'Đổi mật khẩu thành công!',
          'Mật khẩu của bạn đã được thay đổi thành công.',
          { duration: 4000 }
        );
      } else {
        throw new Error(response.message || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      console.error('❌ Error changing password:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi đổi mật khẩu!';

      toast.error('Lỗi đổi mật khẩu', errorMessage, { duration: 5000 });
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * Handle email modal close
   */
  const handleEmailModalClose = (isSuccess = false) => {
    setIsEmailModalOpen(false);

    if (isSuccess) {
      console.log('✅ Email updated successfully, modal closed');
      toast.success('Hoàn tất', 'Thông tin email đã được cập nhật!', {
        duration: 3000,
      });
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%)',
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SecurityIcon fontSize="large" sx={{ color: '#4A90E2' }} />
            Bảo mật tài khoản
          </Typography>

          <Alert
            severity="info"
            sx={{
              mt: 2,
              backgroundColor: 'rgba(74, 144, 226, 0.08)',
              border: '1px solid rgba(74, 144, 226, 0.2)',
              borderRadius: 2,
            }}
          >
            Cập nhật thông tin bảo mật để đảm bảo an toàn cho tài khoản của bạn
          </Alert>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                p: { xs: 2, md: 4 },
                background: 'rgba(255,255,255,0.98)',
                boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.13)',
                height: '100%',
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#2D3748',
                }}
              >
                <ShieldIcon sx={{ color: '#4A90E2' }} />
                Thông tin bảo mật
              </Typography>

              <Stack
                spacing={0}
                divider={
                  <Divider
                    flexItem
                    sx={{ borderColor: 'rgba(74,144,226,0.10)' }}
                  />
                }
              >
                {/* Email */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ py: 2 }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #4A90E2 60%, #1ABC9C 100%)',
                      borderRadius: 2,
                      p: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                      minWidth: 48,
                      minHeight: 48,
                      justifyContent: 'center',
                    }}
                  >
                    <EmailIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize={16} color="#2D3748">
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontSize: 15 }}
                    >
                      {user.email || 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEmailModalOpen(true)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      color: '#4A90E2',
                      borderColor: '#4A90E2',
                      px: 2.5,
                      textTransform: 'none',
                      fontSize: 15,
                      '&:hover': {
                        background: 'rgba(74,144,226,0.08)',
                        borderColor: '#1ABC9C',
                        color: '#1ABC9C',
                      },
                    }}
                  >
                    Đổi email
                  </Button>
                </Stack>

                {/* Phone */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ py: 2 }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #1ABC9C 60%, #4A90E2 100%)',
                      borderRadius: 2,
                      p: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(26,188,156,0.10)',
                      minWidth: 48,
                      minHeight: 48,
                      justifyContent: 'center',
                    }}
                  >
                    <PhoneIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize={16} color="#2D3748">
                      Số điện thoại
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontSize: 15 }}
                    >
                      {user.phone || 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setIsPhoneDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      color: '#1ABC9C',
                      borderColor: '#1ABC9C',
                      px: 2.5,
                      textTransform: 'none',
                      fontSize: 15,
                      '&:hover': {
                        background: 'rgba(26,188,156,0.08)',
                        borderColor: '#4A90E2',
                        color: '#4A90E2',
                      },
                    }}
                  >
                    Đổi số điện thoại
                  </Button>
                </Stack>

                {/* Password */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ py: 2 }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #8E44AD 60%, #3498DB 100%)',
                      borderRadius: 2,
                      p: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(142,68,173,0.10)',
                      minWidth: 48,
                      minHeight: 48,
                      justifyContent: 'center',
                    }}
                  >
                    <LockIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize={16} color="#2D3748">
                      Mật khẩu
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontSize: 15 }}
                    >
                      ********
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setIsPasswordDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      color: '#8E44AD',
                      borderColor: '#8E44AD',
                      px: 2.5,
                      textTransform: 'none',
                      fontSize: 15,
                      '&:hover': {
                        background: 'rgba(142,68,173,0.08)',
                        borderColor: '#3498DB',
                        color: '#3498DB',
                      },
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* Security Tips */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                p: { xs: 2, md: 4 },
                background: 'rgba(255,255,255,0.98)',
                boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.13)',
                height: '100%',
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#2D3748',
                }}
              >
                <VerifiedUserIcon sx={{ color: '#1ABC9C' }} />
                Bảo mật tài khoản
              </Typography>

              <Stack spacing={2}>
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'rgba(26,188,156,0.08)',
                    borderColor: 'rgba(26,188,156,0.2)',
                  }}
                >
                  <Typography fontWeight={600}>Tình trạng xác thực</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <VerifiedUserIcon color="success" />
                    <Typography variant="body2">
                      Tài khoản đã xác thực
                    </Typography>
                  </Box>
                </Alert>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(74,144,226,0.05)',
                    borderRadius: 2,
                    border: '1px dashed rgba(74,144,226,0.3)',
                  }}
                >
                  <Typography
                    fontWeight={600}
                    color="#4A90E2"
                    sx={{
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <InfoIcon fontSize="small" />
                    Lưu ý bảo mật quan trọng
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Không chia sẻ mã xác thực với người khác
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Đặt mật khẩu mạnh với ít nhất 8 ký tự
                  </Typography>
                  <Typography variant="body2">
                    • Cập nhật thông tin liên hệ thường xuyên
                  </Typography>
                </Paper>

                <Tooltip title="Liên hệ hỗ trợ nếu quên mật khẩu" arrow>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                      boxShadow: '0 4px 10px rgba(74,144,226,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(74,144,226,0.35)',
                      },
                    }}
                  >
                    Liên hệ hỗ trợ
                  </Button>
                </Tooltip>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Modal đổi email */}
      <EmailChangeDialog
        open={isEmailModalOpen}
        onClose={handleEmailModalClose}
        onSendCode={handleSendCode}
        onVerifyAndSave={handleVerifyAndSave}
        isSubmitting={isSubmitting}
        isSendingCode={isSendingCode}
        isVerifying={isVerifying}
        currentEmail={user?.email || ''}
      />
      {/* Modal đổi số điện thoại */}{' '}
      <PhoneChangeDialog
        open={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        onSendCode={handleSendPhoneCode}
        onVerifyAndSave={handleVerifyAndSavePhone}
        isSubmitting={isSubmitting}
        isSendingCode={isSendingCode}
        isVerifying={isVerifying}
        currentPhone={user.phone}
      />
      {/* Modal đổi mật khẩu */}
      <PasswordChangeDialog
        open={isPasswordDialogOpen}
        onClose={handleClosePasswordDialog}
        onChangePassword={handlePasswordChange}
        isChanging={isChangingPassword}
      />
    </Box>
  );
};

export default SecurityContent;

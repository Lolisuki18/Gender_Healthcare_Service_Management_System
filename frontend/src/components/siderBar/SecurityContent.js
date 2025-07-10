/**
 * ConsultantSecurityContent.js - Tab bảo mật cho chuyên gia
 *
 * Chức năng:
 * - Quản lý thay đổi mật khẩu
 * - Quản lý thay đổi email
 * - Quản lý thay đổi số điện thoại
 * - UI hiện đại với medical theme
 * - Tích hợp các modal từ ConsultantProfileContent
 *
 * Design:
 * - Card-based layout với gradient backgrounds
 * - Material-UI components với custom styling
 * - Responsive design
 * - Medical healthcare theme colors
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

// Import modals từ thư mục chung
import { PasswordChangeDialog } from '../modals/PasswordChangeModal';
import { EmailChangeDialog } from '../modals/EmailChangeModal';
import { PhoneChangeDialog } from '../modals/PhoneChangeModal';

import localStorageUtil from '@/utils/localStorage';
import apiClient from '../../services/api';
import { userService } from '../../services/userService';

// Styled components
const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background:
      'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translate(-20px, -20px) rotate(0deg)' },
    '50%': { transform: 'translate(-10px, -10px) rotate(180deg)' },
  },
}));

const SecurityCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(74, 144, 226, 0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(74, 144, 226, 0.15)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #357ABD, #16A085)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
  },
}));

const ConsultantSecurityContent = () => {
  const [modalStates, setModalStates] = useState({
    password: false,
    email: false,
    phone: false,
  });

  const [phoneModalMode, setPhoneModalMode] = useState('change'); // 'verify' or 'change'

  const [isLoading, setIsLoading] = useState({
    password: false,
    email: false,
    phone: false,
  });

  const [userData, setUserData] = useState({});

  // Fetch user data from API on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        if (response.data.success) {
          const user = response.data.data;
          console.log('Security - User data from API:', user); // Debug log
          setUserData({
            ...user,
            phoneNumber: user.phoneNumber || user.phone, // Ensure phoneNumber is available
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage if API fails
        const fallbackData = localStorageUtil.get('user') || {};
        setUserData(fallbackData);
      }
    };

    loadUserData();
  }, []);

  const handleOpenModal = (type) => {
    setModalStates((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handleCloseModal = (type, success) => {
    setModalStates((prev) => ({
      ...prev,
      [type]: false,
    }));
    // Hiển thị toast thành công nếu đóng do cập nhật thành công
    if (success) {
      if (type === 'password') {
        // toast.success('Đổi mật khẩu thành công!', { duration: 4000 });
      } else if (type === 'email') {
        // Đã có toast ở handleVerifyAndSaveEmail, không cần lặp lại ở đây
      } else if (type === 'phone') {
        // toast.success('Số điện thoại đã được cập nhật thành công!', {
        //   duration: 4000,
        // });
      }
    }
  };

  // Handler cho đổi mật khẩu
  const handlePasswordChange = async (passwordData) => {
    setIsLoading((prev) => ({ ...prev, password: true }));
    try {
      const response = await apiClient.put(
        '/users/profile/password',
        passwordData
      );

      if (response.data.success) {
        toast.success('Đổi mật khẩu thành công!', {
          duration: 4000,
        });
        handleCloseModal('password', true);
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Có lỗi xảy ra khi đổi mật khẩu',
        };
      }
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu',
      };
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  // Handler cho gửi mã xác thực email
  const handleSendEmailCode = async (email) => {
    setIsLoading((prev) => ({ ...prev, email: true }));
    try {
      const response = await userService.sendEmailVerificationCode(email);
      if (response.success) {
        toast.success(
          'Đã gửi mã xác nhận đến email mới. Vui lòng kiểm tra hộp thư.',
          { duration: 4000 }
        );
      } else {
        toast.error(
          response.message || 'Không thể gửi mã xác nhận. Vui lòng thử lại.',
          { duration: 4000 }
        );
      }
      return response;
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }));
    }
  };

  // Handler cho xác thực và lưu email mới
  const handleVerifyAndSaveEmail = async (email, verificationCode) => {
    setIsLoading((prev) => ({ ...prev, email: true }));
    try {
      const response = await apiClient.put('/users/profile/email', {
        newEmail: email, // Đúng tên trường backend yêu cầu
        verificationCode,
      });

      if (response.data.success) {
        toast.success('Email đã được cập nhật thành công!', {
          duration: 4000,
        });
        handleCloseModal('email', true);

        // Cập nhật userData trong localStorage
        const updatedUser = { ...userData, email };
        localStorageUtil.set('user', updatedUser);
        setUserData(updatedUser); // cập nhật ngay UI

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Mã xác thực không đúng',
        };
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Có lỗi xảy ra khi xác thực email',
      };
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }));
    }
  };

  // Handler cho gửi mã xác thực số điện thoại
  const handleSendPhoneCode = async (phone) => {
    setIsLoading((prev) => ({ ...prev, phone: true }));
    try {
      const response = await apiClient.post('/users/send-phone-verification-code', {
        phone: phone
      });

      if (response.data.success) {
        toast.success('Mã xác thực đã được gửi đến số điện thoại của bạn!', {
          duration: 4000,
        });
        return { success: true };
      } else {
        toast.error(
          response.data.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.',
          { duration: 4000 }
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error sending phone verification code:', error);
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi gửi mã xác thực.',
        { duration: 4000 }
      );
      return { success: false, message: error.response?.data?.message };
    } finally {
      setIsLoading((prev) => ({ ...prev, phone: false }));
    }
  };

  // Handler cho xác thực và lưu số điện thoại mới
  const handleVerifyAndSavePhone = async (phone, verificationCode) => {
    setIsLoading((prev) => ({ ...prev, phone: true }));
    try {
      const response = await apiClient.put('/users/profile/phone', {
        phone: phone,
        verificationCode: verificationCode,
      });

      if (response.data.success) {
        toast.success('Số điện thoại đã được cập nhật thành công!', {
          duration: 4000,
        });
        handleCloseModal('phone', true);

        // Refresh user data từ API để cập nhật trạng thái verified
        try {
          const userResponse = await apiClient.get('/users/profile');
          if (userResponse.data.success) {
            const updatedUser = userResponse.data.data;
            setUserData({
              ...updatedUser,
              phoneNumber: updatedUser.phoneNumber || updatedUser.phone,
            });
            // Cập nhật localStorage
            localStorageUtil.set('user', updatedUser);
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
          // Fallback update nếu API call fails
          const updatedUser = { ...userData, phone: phone + '_V', phoneNumber: phone + '_V' };
          localStorageUtil.set('user', updatedUser);
          setUserData(updatedUser);
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Mã xác thực không đúng',
        };
      }
    } catch (error) {
      console.error('Error verifying phone:', error);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Có lỗi xảy ra khi xác thực số điện thoại',
      };
    } finally {
      setIsLoading((prev) => ({ ...prev, phone: false }));
    }
  };

  // Helper function để kiểm tra phone đã được verified chưa (từ backend)
  const isPhoneVerified = (phone) => {
    // Kiểm tra nếu phone kết thúc bằng _V (verified từ backend)
    return phone && phone.toString().endsWith('_V');
  };

  // Helper function để lấy phone number clean (bỏ suffix _V)
  const getCleanPhoneNumber = (phone) => {
    if (!phone) return '';
    const phoneStr = phone.toString();
    return phoneStr.endsWith('_V') ? phoneStr.substring(0, phoneStr.length - 2) : phoneStr;
  };

  // Handler cho xác thực phone number hiện tại
  const handleVerifyExistingPhone = async () => {
    const currentPhone = userData.phoneNumber || userData.phone;
    if (!currentPhone) {
      toast.error('Không có số điện thoại để xác thực');
      return;
    }

    setPhoneModalMode('verify');
    handleOpenModal('phone');
  };

  const securityItems = [
    {
      id: 'password',
      title: 'Mật khẩu',
      description: 'Thay đổi mật khẩu đăng nhập của bạn',
      icon: <LockIcon />,
      currentValue: '••••••••',
      status: 'Đã bảo mật',
      lastUpdate: 'Cập nhật 30 ngày trước',
      actionText: 'Đổi mật khẩu',
      color: '#4A90E2',
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Thay đổi địa chỉ email của tài khoản',
      icon: <EmailIcon />,
      currentValue: userData.email || 'chưa có email',
      status: userData.email ? 'Đã xác thực' : 'Chưa xác thực',
      lastUpdate: 'Cập nhật 15 ngày trước',
      actionText: 'Đổi email',
      color: '#1ABC9C',
    },
    {
      id: 'phone',
      title: 'Số điện thoại',
      description: 'Cập nhật số điện thoại liên hệ',
      icon: <PhoneIcon />,
      currentValue: (() => {
        const currentPhone = userData.phoneNumber || userData.phone;
        if (!currentPhone) return 'chưa có số điện thoại';
        return getCleanPhoneNumber(currentPhone);
      })(),
      status: (() => {
        const currentPhone = userData.phoneNumber || userData.phone;
        if (!currentPhone) return 'Chưa có';
        return isPhoneVerified(currentPhone) ? 'Đã xác thực' : 'Chưa xác thực';
      })(),
      lastUpdate: 'Cập nhật 7 ngày trước',
      actionText: (() => {
        const currentPhone = userData.phoneNumber || userData.phone;
        if (!currentPhone) return 'Thêm số điện thoại';
        return isPhoneVerified(currentPhone) ? 'Đổi số điện thoại' : 'Xác thực';
      })(),
      color: '#9B59B6',
      showVerifyButton: (() => {
        const currentPhone = userData.phoneNumber || userData.phone;
        return currentPhone && !isPhoneVerified(currentPhone);
      })(),
    },
  ];

  return (
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <HeaderSection>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <ShieldIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Cài đặt bảo mật
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Quản lý thông tin bảo mật tài khoản chuyên gia của bạn
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Chip
            icon={<VerifiedIcon />}
            label="Tài khoản đã xác thực"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 600,
              '&:hover': { background: 'rgba(255, 255, 255, 0.3)' },
            }}
          />
          <Chip
            icon={<SecurityIcon />}
            label="Bảo mật cao"
            sx={{
              background: 'rgba(76, 175, 80, 0.8)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
      </HeaderSection>
      {/* Security Alert */}
      <Alert
        severity="info"
        sx={{
          mb: 3,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #E3F2FD 0%, #F5F7FA 100%)',
          border: '1px solid rgba(74, 144, 226, 0.2)',
        }}
      >
        <Typography variant="body2">
          <strong>Lưu ý bảo mật:</strong> Để đảm bảo an toàn tài khoản, hãy thay
          đổi mật khẩu định kỳ và không chia sẻ thông tin đăng nhập với ai.
        </Typography>
      </Alert>
      {/* Security Settings Cards */}
      <Grid container spacing={3}>
        {securityItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <SecurityCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: `linear-gradient(45deg, ${item.color}, ${item.color}33)`,
                      color: item.color,
                      mr: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" color="#2D3748">
                      {item.title}
                    </Typography>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        background: item.status.includes('Đã')
                          ? 'linear-gradient(45deg, #4CAF50, #2ECC71)'
                          : 'linear-gradient(45deg, #FFA726, #FF7043)',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '11px',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="#718096" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="#4A5568" fontWeight="600">
                    Giá trị hiện tại:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#2D3748"
                    sx={{
                      wordBreak: 'break-all',
                      fontFamily:
                        item.id === 'password' ? 'monospace' : 'inherit',
                    }}
                  >
                    {item.currentValue}
                  </Typography>
                  <Typography variant="caption" color="#718096">
                    {item.lastUpdate}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action buttons - special handling for phone verification */}
                {item.id === 'phone' && item.showVerifyButton ? (
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <ActionButton
                      fullWidth
                      onClick={handleVerifyExistingPhone}
                      startIcon={<VerifiedIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #FF9800, #FF5722)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #F57C00, #D84315)',
                        },
                      }}
                    >
                      Xác thực số điện thoại
                    </ActionButton>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        setPhoneModalMode('change');
                        handleOpenModal(item.id);
                      }}
                      startIcon={<EditIcon />}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: item.color,
                        color: item.color,
                        '&:hover': {
                          borderColor: item.color,
                          backgroundColor: `${item.color}15`,
                        },
                      }}
                    >
                      Đổi số điện thoại
                    </Button>
                  </Box>
                ) : (
                  <ActionButton
                    fullWidth
                    onClick={() => {
                      if (item.id === 'phone') {
                        setPhoneModalMode('change');
                      }
                      handleOpenModal(item.id);
                    }}
                    startIcon={<EditIcon />}
                  >
                    {item.actionText}
                  </ActionButton>
                )}
              </CardContent>
            </SecurityCard>
          </Grid>
        ))}
      </Grid>
      {/* Additional Security Info */}
      <Card
        sx={{
          mt: 4,
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #F8F9FA 0%, #E9ECEF 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#2D3748"
            gutterBottom
          >
            Thông tin bảo mật bổ sung
          </Typography>
          <Typography variant="body2" color="#718096" paragraph>
            • Mật khẩu nên có ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và
            ký tự đặc biệt.
          </Typography>
          <Typography variant="body2" color="#718096" paragraph>
            • Email được sử dụng để nhận thông báo quan trọng và khôi phục mật
            khẩu.
          </Typography>
          <Typography variant="body2" color="#718096">
            • Số điện thoại giúp bệnh nhân liên hệ trực tiếp khi cần tư vấn khẩn
            cấp.
          </Typography>
        </CardContent>
      </Card>{' '}
      {/* Modals */}
      <PasswordChangeDialog
        open={modalStates.password}
        onClose={(success) => handleCloseModal('password', success)}
        onChangePassword={handlePasswordChange}
        isChanging={isLoading.password}
      />
      <EmailChangeDialog
        open={modalStates.email}
        onClose={(success) => handleCloseModal('email', success)}
        onSendCode={handleSendEmailCode}
        onVerifyAndSave={handleVerifyAndSaveEmail}
        isSendingCode={isLoading.email}
        isVerifying={isLoading.email}
        currentEmail={userData.email || ''}
      />
      <PhoneChangeDialog
        open={modalStates.phone}
        onClose={(success) => handleCloseModal('phone', success)}
        onSendCode={handleSendPhoneCode}
        onVerifyAndSave={handleVerifyAndSavePhone}
        isSendingCode={isLoading.phone}
        isVerifying={isLoading.phone}
        currentPhone={getCleanPhoneNumber(userData.phoneNumber || userData.phone || '')}
        isPhoneVerified={isPhoneVerified(userData.phoneNumber || userData.phone)}
        mode={phoneModalMode}
      />
    </Box>
  );
};

export default ConsultantSecurityContent;

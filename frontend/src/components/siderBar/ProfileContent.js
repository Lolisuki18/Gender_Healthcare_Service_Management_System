/**
 * ProfileContent.js - Component quản lý thông tin hồ sơ cá nhân khách hàng
 *
 * Chức năng chính:
 * - Call API để lấy thông tin cá nhân hiển thị
 * - Inline editing mode với disabled fields cho readonly data
 * - Form validation và error handling
 * - API integration cho việc lưu thông tin
 *
 * Features:
 * - Inline editing mode (không tách form riêng)
 * - Disabled fields cho dữ liệu readonly (email, ID)
 * - Real-time form validation
 * - Loading states khi fetch và submit
 * - Error handling với user feedback
 * - Responsive design với grid system
 *
 * State Management:
 * - isEditing: boolean - Chế độ chỉnh sửa inline
 * - userData: object - Dữ liệu user từ API
 * - formData: object - Dữ liệu form
 * - isLoading: boolean - Trạng thái loading khi fetch
 * - isSaving: boolean - Trạng thái loading khi save
 * - errors: object - Validation errors
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Stack,
  Container,
  Divider,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AvatarUpload from '../common/AvatarUpload';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';
import { userService } from '@/services/userService';
import { toast } from 'react-toastify';
import { formatDateForInput, formatDateDisplay } from '@/utils/dateUtils';
import { EmailChangeDialog, PasswordChangeDialog } from '../modals';
import imageUrl from '../../utils/imageUrl';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '@/redux/slices/authSlice';

const TOAST_ID_USER_INFO = 'user-info-loaded';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.1)',
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #FFFFFF, #F5F7FA)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(74, 144, 226, 0.12)',
  color: '#2D3748',
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.05)',
  overflow: 'visible',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background:
    'linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))',
  marginRight: '16px',
  flexShrink: 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: '#4A5568',
    fontSize: '14px',
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-root': {
    color: '#2D3748',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '& fieldset': {
      borderColor: 'rgba(74, 144, 226, 0.2)',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(26, 188, 156, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1ABC9C',
      borderWidth: 2,
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(240, 240, 240, 0.6)',
      color: '#718096',
      '& fieldset': {
        borderColor: 'rgba(200, 200, 200, 0.3)',
      },
    },
  },
  '& .MuiInputBase-input': {
    color: '#2D3748',
    fontWeight: 600,
    '&.Mui-disabled': {
      color: '#718096',
      WebkitTextFillColor: '#718096',
    },
  },
}));

// ✅ Updated Field Info Component - Support action button for special fields
const FieldInfoBox = ({
  icon,
  label,
  name,
  value,
  onChange,
  isEditing,
  disabled = false,
  type = 'text',
  multiline = false,
  rows = 1,
  options = null,
  backgroundColor,
  iconColor,
  actionButton = null,
}) => {
  const isEmailField = type === 'email';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        background:
          backgroundColor ||
          'linear-gradient(45deg, rgba(74, 144, 226, 0.05), rgba(26, 188, 156, 0.05))',
        border: `1px solid rgba(74, 144, 226, 0.1)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          background:
            'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.08))',
          transform: !isEditing ? 'translateY(-2px)' : 'none',
          boxShadow: '0 8px 24px rgba(74, 144, 226, 0.08)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconWrapper
          sx={{
            background:
              'linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))',
          }}
        >
          {React.cloneElement(icon, {
            sx: { color: iconColor || '#4A90E2', fontSize: 20 },
          })}
        </IconWrapper>
        <Typography
          variant="body2"
          sx={{
            color: '#4A5568',
            fontWeight: 600,
            flex: 1,
          }}
        >
          {label}
          {/* ✅ Show disabled note for email */}
          {isEmailField && ' (Sử dụng nút riêng để thay đổi)'}
        </Typography>
      </Stack>

      {isEditing && !isEmailField ? (
        // ✅ Edit Mode - Show TextField (exclude email)
        options ? (
          // Select Field
          <FormControl fullWidth disabled={disabled}>
            <StyledTextField
              select
              name={name}
              value={value || ''}
              onChange={onChange}
              disabled={disabled}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: disabled
                    ? 'rgba(240, 240, 240, 0.6)'
                    : 'transparent',
                  '& fieldset': { border: 'none' },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 16px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: disabled ? '#718096' : '#2D3748',
                },
              }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Chọn {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StyledTextField>
          </FormControl>
        ) : (
          // Regular TextField (excluding email)
          <StyledTextField
            fullWidth
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            variant="outlined"
            placeholder={`Nhập ${label.toLowerCase()}`}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                '& fieldset': { border: 'none' },
              },
              '& .MuiInputBase-input': {
                padding: multiline ? '12px 16px' : '12px 16px',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#2D3748',
              },
            }}
          />
        )
      ) : (
        // ✅ View Mode - Show Value with optional action button
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography
            variant="h6"
            sx={{
              color: '#2D3748',
              fontWeight: 700,
              wordBreak: type === 'email' ? 'break-all' : 'break-word',
              minHeight: '1.5rem',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              flex: 1,
            }}
          >
            {value || 'Chưa cập nhật'}
          </Typography>

          {/* ✅ Show verified icon for email */}
          {isEmailField && value && (
            <Chip
              icon={<VerifiedIcon />}
              label="Đã xác thực"
              size="small"
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                '& .MuiChip-icon': {
                  color: '#059669',
                },
              }}
            />
          )}

          {/* ✅ Action button for special fields */}
          {actionButton}
        </Stack>
      )}
    </Paper>
  );
};

const ProfileContent = () => {
  // ✅ Sử dụng Redux store thay vì local state phức tạp
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const avatarUrl = useSelector((state) => state.auth.avatarUrl);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Avatar change states
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // ✅ Form data để edit - sử dụng từ Redux store (bỏ phone)
  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: '',
    birthDay: '',
    email: '',
    gender: '',
    address: '',
  });

  // ✅ Original data để reset khi cancel
  const [originalData, setOriginalData] = useState({});

  // ✅ Email verification states
  const [emailVerificationDialog, setEmailVerificationDialog] = useState({
    open: false,
    email: '',
    tempEmail: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // ✅ Password change states
  const [passwordChangeDialog, setPasswordChangeDialog] = useState({
    open: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ✅ Email change states
  const [emailChangeDialog, setEmailChangeDialog] = useState({
    open: false,
  });

  // ====================================================================
  // EFFECTS
  // ====================================================================

  /**
   * ✅ Sync form data với Redux store khi user thay đổi
   */
  useEffect(() => {
    if (user) {
      const formData = {
        fullName: user.fullName || '',
        birthDay: user.birthDay || '',
        email: user.email || '',
        gender: user.gender || '',
        address: user.address || '',
      };
      setFormDataUpdate(formData);
      setOriginalData(formData);
    }
  }, [user]);

  // ✅ Countdown timer for resend code
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================
  /**
   * ✅ Format gender display
   */
  const formatGenderDisplay = (gender) => {
    const genderMap = {
      Nam: 'Nam',
      Nữ: 'Nữ',
      Khác: 'Khác',
    };
    return genderMap[gender] || gender || 'Chưa cập nhật';
  };

  /**
   * ✅ Handle form input change
   */
  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    setFormDataUpdate({
      ...formDataUpdate,
      [name]: value,
    });
  };

  /**
   * ✅ Handle save - Simplified
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // ✅ Validate required fields
      if (!formDataUpdate.fullName.trim()) {
        toast.warning('Thiếu thông tin', 'Vui lòng nhập họ tên!', {
          duration: 4000,
        });
        return;
      }

      // ====== VALIDATE NGÀY SINH ======
      if (formDataUpdate.birthDay) {
        const today = new Date();
        const birthDate = new Date(formDataUpdate.birthDay);
        if (birthDate > today) {
          toast.warning('Ngày sinh của bạn vượt qua thời gian thực', '', {
            duration: 4000,
          });
          return;
        }
        const minBirthDate = new Date(
          today.getFullYear() - 2,
          today.getMonth(),
          today.getDate()
        );
        if (birthDate > minBirthDate) {
          toast.warning('Tuổi tối thiểu cần đạt là 2 tuổi', '', {
            duration: 4000,
          });
          return;
        }
      }

      // ====== VALIDATE GIỚI TÍNH ======
      if (
        !formDataUpdate.gender ||
        formDataUpdate.gender === '' ||
        formDataUpdate.gender === 'Chọn giới tính'
      ) {
        toast.warning('Vui lòng chọn giới tính của bạn', '', {
          duration: 4000,
        });
        return;
      }

      console.log('Đang lưu thông tin cá nhân:', formDataUpdate);

      toast.info('Đang xử lý', 'Đang lưu thông tin cá nhân...', {
        duration: 2000,
      });

      const updateData = {
        fullName: formDataUpdate.fullName.trim(),
        birthDay: formDataUpdate.birthDay || '',
        address: formDataUpdate.address?.trim() || '',
        gender: formDataUpdate.gender || '',
      };

      const response = await userService.updateProfile(updateData, user);

      if (response && response.success) {
        // ✅ Update Redux store
        const updatedUser = response.data || { ...user, ...updateData };
        dispatch(updateUserProfile(updatedUser));

        // ✅ Update form data
        const newFormData = {
          ...formDataUpdate,
          ...updateData,
        };
        setFormDataUpdate(newFormData);
        setOriginalData(newFormData);

        // ✅ Exit edit mode
        setIsEditing(false);

        toast.success(
          'Cập nhật thành công!',
          'Thông tin cá nhân đã được lưu thành công.',
          { duration: 4000 }
        );

        console.log('✅ Đã lưu thông tin thành công:', updatedUser);
      } else {
        throw new Error(response?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật thông tin:', error);

      if (error.response?.status === 401) {
        toast.error(
          'Lỗi xác thực',
          'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
          { duration: 6000 }
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi cập nhật thông tin!';

        toast.error('Lỗi cập nhật', errorMessage, { duration: 5000 });
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * ✅ Handle toggle edit mode
   */
  const handleToggleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  /**
   * ✅ Handle cancel
   */
  const handleCancel = () => {
    setFormDataUpdate({ ...originalData });
    setIsEditing(false);
    toast.info('Đã hủy', 'Các thay đổi đã được hủy bỏ.', { duration: 2000 });
  };

  // ====================================================================
  // AVATAR CHANGE FUNCTIONS
  // ====================================================================

  /**
   * Mở modal thay đổi avatar
   */
  const handleAvatarChangeClick = () => {
    setIsAvatarModalOpen(true);
  };

  /**
   * Đóng modal thay đổi avatar
   */
  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setAvatarError('');
  };

  /**
   * Xử lý khi upload avatar thành công
   */
  const handleAvatarUploadSuccess = (avatarPath) => {
    // Đã upload thành công, cập nhật Redux
    dispatch(updateUserProfile({ avatar: avatarPath }));
    handleCloseAvatarModal();
  };

  /**
   * Xử lý khi có lỗi upload avatar
   */
  const handleAvatarUploadError = (errorMessage) => {
    setAvatarError(errorMessage);
  };

  // ✅ Lấy avatar URL từ Redux store
  const getAvatarUrl = () => {
    if (avatarUrl) {
      return imageUrl.getFullImageUrl(avatarUrl);
    }

    if (user?.avatar) {
      return imageUrl.getFullImageUrl(user.avatar);
    }

    return undefined;
  };

  // Render component
  return (
    <>
      {/* Dialog thay đổi avatar */}
      <Dialog
        open={isAvatarModalOpen}
        onClose={handleCloseAvatarModal}
        aria-labelledby="avatar-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle
          id="avatar-dialog-title"
          sx={{ fontWeight: 700, textAlign: 'center' }}
        >
          Cập nhật ảnh đại diện
        </DialogTitle>

        <DialogContent>
          {avatarError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {avatarError}
            </Alert>
          )}

          <AvatarUpload
            currentImage={user?.avatar}
            onUploadSuccess={handleAvatarUploadSuccess}
            onUploadError={handleAvatarUploadError}
            onClose={handleCloseAvatarModal}
          />
        </DialogContent>
      </Dialog>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* ============================================================== */}
          {/* PROFILE CARD */}
          {/* ============================================================== */}
          <ProfileCard>
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                alignItems="center"
              >
                {/* Avatar Section */}
                <Stack alignItems="center" spacing={2}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={getAvatarUrl()}
                      alt={formDataUpdate.fullName || 'User'}
                      sx={{
                        width: { xs: 120, md: 140 },
                        height: { xs: 120, md: 140 },
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        fontSize: { xs: '48px', md: '56px' },
                        fontWeight: 700,
                        boxShadow: '0 12px 40px rgba(74, 144, 226, 0.4)',
                        border: '4px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {formDataUpdate.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>

                    {/* Edit Avatar Button */}
                    <Box
                      onClick={handleAvatarChangeClick}
                      sx={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4A90E2, #3498db)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 6px 16px rgba(74, 144, 226, 0.6)',
                        },
                      }}
                    >
                      <EditIcon sx={{ width: 16, height: 16, color: '#fff' }} />
                    </Box>
                  </Box>

                  {/* Avatar Change Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAvatarChangeClick}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      borderColor: 'rgba(74, 144, 226, 0.5)',
                      color: '#4A90E2',
                      '&:hover': {
                        borderColor: '#4A90E2',
                        backgroundColor: 'rgba(74, 144, 226, 0.08)',
                      },
                    }}
                  >
                    Đổi ảnh đại diện
                  </Button>
                </Stack>

                {/* User Info */}
                <Stack
                  spacing={2}
                  sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}
                >
                  <Stack spacing={1}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#2D3748',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      {formDataUpdate.fullName || 'Chưa có tên'}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#4A5568',
                        fontSize: '18px',
                        fontWeight: 500,
                      }}
                    >
                      {user?.role === 'STAFF' ? 'Nhân viên' : 'Khách hàng'}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#718096',
                        fontSize: '14px',
                      }}
                    >
                      {user?.role === 'STAFF'
                        ? `Mã nhân viên: ${user?.id || 'N/A'}`
                        : `Mã khách hàng: ${user?.id || 'GUEST'}`}
                    </Typography>
                  </Stack>

                  {/* Quick Info */}
                  <Stack direction="row" spacing={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: '12px',
                        background:
                          'linear-gradient(45deg, rgba(26, 188, 156, 0.1), rgba(22, 160, 133, 0.1))',
                        border: '1px solid rgba(26, 188, 156, 0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#4A5568', mb: 0.5 }}
                      >
                        Ngày sinh
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: '#2D3748', fontWeight: 600 }}
                      >
                        {formatDateDisplay(formDataUpdate.birthDay)}
                      </Typography>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: '12px',
                        background:
                          'linear-gradient(45deg, rgba(155, 89, 182, 0.1), rgba(142, 68, 173, 0.1))',
                        border: '1px solid rgba(155, 89, 182, 0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#4A5568', mb: 0.5 }}
                      >
                        Giới tính
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: '#2D3748', fontWeight: 600 }}
                      >
                        {formatGenderDisplay(formDataUpdate.gender)}
                      </Typography>
                    </Paper>
                  </Stack>
                </Stack>

                {/* Action Buttons */}
                <Stack spacing={2} sx={{ minWidth: { md: 200 } }}>
                  <Button
                    variant={isEditing ? 'outlined' : 'contained'}
                    startIcon={
                      isSaving ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : isEditing ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    onClick={handleToggleEdit}
                    disabled={isSaving}
                    fullWidth
                    sx={{
                      py: 2,
                      borderRadius: '16px',
                      fontWeight: 600,
                      fontSize: '16px',
                      textTransform: 'none',
                      ...(isEditing
                        ? {
                            color: '#e74c3c',
                            borderColor: '#e74c3c',
                            borderWidth: '2px',
                            '&:hover': {
                              backgroundColor: 'rgba(231, 76, 60, 0.1)',
                              borderColor: '#e74c3c',
                              transform: 'translateY(-2px)',
                            },
                          }
                        : {
                            background:
                              'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                            color: '#fff',
                            fontWeight: 600,
                            boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
                            '&:hover': {
                              background:
                                'linear-gradient(45deg, #357ABD, #16A085)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(74, 144, 226, 0.5)',
                            },
                          }),
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isSaving
                      ? 'Đang lưu...'
                      : isEditing
                        ? 'Hủy chỉnh sửa'
                        : 'Chỉnh sửa hồ sơ'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </ProfileCard>

          {/* ============================================================== */}
          {/* DETAILS SECTION - INLINE EDITING */}
          {/* ============================================================== */}
          <StyledPaper
            sx={{
              p: { xs: 3, md: 4 },
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Background Decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background:
                  'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.04))',
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background:
                  'linear-gradient(45deg, rgba(26, 188, 156, 0.06), rgba(74, 144, 226, 0.03))',
                zIndex: 0,
              }}
            />

            <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
              {/* Enhanced Header */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  pb: 3,
                  borderBottom: '2px solid rgba(74, 144, 226, 0.1)',
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      background:
                        'linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))',
                      border: '1px solid rgba(74, 144, 226, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonIcon sx={{ color: '#4A90E2', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#2D3748',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      Thông tin chi tiết
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#4A5568',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Quản lý và cập nhật thông tin cá nhân của bạn
                    </Typography>
                  </Box>
                </Box>

                {isEditing && (
                  <Chip
                    icon={<EditIcon />}
                    label="Đang chỉnh sửa"
                    sx={{
                      background: 'linear-gradient(45deg, #1ABC9C, #16A085)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      padding: '8px 16px',
                      height: '40px',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(26, 188, 156, 0.3)',
                      '& .MuiChip-icon': {
                        color: '#fff',
                      },
                    }}
                  />
                )}
              </Box>

              {/* Form Fields with Enhanced Layout */}
              <Stack spacing={4}>
                {/* Personal Information Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2D3748',
                      fontWeight: 600,
                      fontSize: '18px',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        borderRadius: 2,
                      }}
                    />
                    Thông tin cá nhân
                  </Typography>

                  <Stack spacing={3}>
                    {/* Họ và tên */}
                    <FieldInfoBox
                      icon={<PersonIcon />}
                      label="Họ và tên"
                      name="fullName"
                      value={formDataUpdate.fullName}
                      onChange={handleChangeUpdate}
                      isEditing={isEditing}
                      disabled={false}
                      backgroundColor="linear-gradient(45deg, rgba(74, 144, 226, 0.06), rgba(26, 188, 156, 0.04))"
                      iconColor="#4A90E2"
                    />

                    {/* Personal Info Stack */}
                    <Grid container spacing={3}>
                      <Grid item size={12} xs={12} md={6}>
                        <FieldInfoBox
                          icon={<CakeIcon />}
                          label="Ngày sinh"
                          name="birthDay"
                          value={
                            isEditing
                              ? formatDateForInput(formDataUpdate.birthDay)
                              : formatDateDisplay(formDataUpdate.birthDay)
                          }
                          onChange={handleChangeUpdate}
                          isEditing={isEditing}
                          disabled={false}
                          type="date"
                          backgroundColor="linear-gradient(45deg, rgba(241, 196, 15, 0.08), rgba(230, 126, 34, 0.04))"
                          iconColor="#F1C40F"
                        />
                      </Grid>

                      <Grid item size={12} xs={12} md={6}>
                        <FieldInfoBox
                          icon={<WcIcon />}
                          label="Giới tính"
                          name="gender"
                          value={
                            isEditing
                              ? formDataUpdate.gender
                              : formatGenderDisplay(formDataUpdate.gender)
                          }
                          onChange={handleChangeUpdate}
                          isEditing={isEditing}
                          disabled={false}
                          options={[
                            { value: 'Nam', label: 'Nam' },
                            { value: 'Nữ', label: 'Nữ' },
                            { value: 'Khác', label: 'Khác' },
                          ]}
                          backgroundColor="linear-gradient(45deg, rgba(155, 89, 182, 0.08), rgba(142, 68, 173, 0.04))"
                          iconColor="#9B59B6"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>

                {/* Address Information Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2D3748',
                      fontWeight: 600,
                      fontSize: '18px',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        background: 'linear-gradient(45deg, #E74C3C, #C0392B)',
                        borderRadius: 2,
                      }}
                    />
                    Địa chỉ
                  </Typography>

                  <FieldInfoBox
                    icon={<LocationOnIcon />}
                    label="Địa chỉ hiện tại"
                    name="address"
                    value={formDataUpdate.address}
                    onChange={handleChangeUpdate}
                    isEditing={isEditing}
                    disabled={false}
                    multiline={true}
                    rows={3}
                    backgroundColor="linear-gradient(45deg, rgba(231, 76, 60, 0.08), rgba(192, 57, 43, 0.04))"
                    iconColor="#E74C3C"
                  />
                </Box>

                {/* Action Buttons - Enhanced Design */}
                {isEditing && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: '20px',
                      background:
                        'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.04))',
                      border: '2px solid rgba(74, 144, 226, 0.15)',
                      mt: 4,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        color: '#2D3748',
                        fontWeight: 600,
                        mb: 3,
                        textAlign: 'center',
                      }}
                    >
                      Xác nhận thay đổi thông tin
                    </Typography>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={3}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isSaving}
                        startIcon={<CancelIcon />}
                        sx={{
                          px: 5,
                          py: 2.5,
                          borderRadius: '15px',
                          fontWeight: 600,
                          fontSize: '16px',
                          color: '#e74c3c',
                          borderColor: '#e74c3c',
                          borderWidth: '2px',
                          minWidth: '160px',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            borderColor: '#e74c3c',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(231, 76, 60, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Hủy bỏ
                      </Button>

                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving}
                        startIcon={
                          isSaving ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <SaveIcon />
                          )
                        }
                        sx={{
                          px: 5,
                          py: 2.5,
                          borderRadius: '15px',
                          fontWeight: 600,
                          fontSize: '16px',
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          color: '#fff',
                          minWidth: '160px',
                          textTransform: 'none',
                          boxShadow: '0 8px 25px rgba(74, 144, 226, 0.4)',
                          '&:hover': {
                            background:
                              'linear-gradient(45deg, #357ABD, #16A085)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 30px rgba(74, 144, 226, 0.5)',
                          },
                          '&:disabled': {
                            background: '#ccc',
                            transform: 'none',
                            boxShadow: 'none',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Stack>
          </StyledPaper>
        </Stack>
      </Container>
    </>
  );
};

export default ProfileContent;

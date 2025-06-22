/**
 * ProfileContent.js - Component quản lý thông tin hồ sơ cá nhân nhân viên
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
  Paper,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  FormControl,
  Stack,
  Chip,
  Grid,
  Dialog, // Using Dialog instead of Modal
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AvatarUpload from '../common/AvatarUpload'; // Import AvatarUpload component
import EditIcon from '@mui/icons-material/Edit'; // For edit button
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { selectAvatar, selectUser } from '@/redux/slices/authSlice'; // Import selectors
import { fetchCurrentUser } from '@/redux/thunks/userThunks'; // Import user thunk

import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc'; // Gender icon
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Location icon
import LockIcon from '@mui/icons-material/Lock'; // Lock icon
import PermIdentityIcon from '@mui/icons-material/PermIdentity'; // ID icon
import CancelIcon from '@mui/icons-material/Cancel'; // Cancel icon
import RefreshIcon from '@mui/icons-material/Refresh'; // Refresh icon
import SaveIcon from '@mui/icons-material/Save'; // Save icon
import { styled } from '@mui/material/styles';
import { userService } from '@/services/userService';
import localStorageUtil from '@/utils/localStorage';
import { notify } from '@/utils/notification';
import { formatDateForInput, formatDateDisplay } from '@/utils/dateUtils'; // Import date formatting utils

import { PasswordChangeDialog, EmailChangeDialog } from '../modals'; // Reuse modals from CustomerProfile
import imageUrl from '../../utils/imageUrl'; // Import với đường dẫn tương đối

// Styled components
const ProfileContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #f0f7ff, #f7faff)',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.02) 70%, transparent 100%)',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(26, 188, 156, 0.05) 0%, rgba(74, 144, 226, 0.02) 70%, transparent 100%)',
    zIndex: 0,
  },
}));

// Additional styled components needed for the component to work
const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'visible',
  backgroundColor: '#ffffff',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-4px)',
  },
  position: 'relative',
  border: '1px solid rgba(226, 232, 240, 0.9)',
  zIndex: 1,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))',
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  boxShadow: '0 2px 6px rgba(74, 144, 226, 0.08)',
  border: '1px solid rgba(74, 144, 226, 0.05)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
    },
    '& fieldset': {
      borderColor: 'rgba(203, 213, 225, 0.8)',
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(74, 144, 226, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4A90E2',
    },
  },
}));

// ✅ Field Info Component - Support action button for special fields
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
        backdropFilter: 'blur(10px)',
        '&:hover': {
          background:
            'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.08))',
          transform: !isEditing ? 'translateY(-2px)' : 'none',
          boxShadow: '0 8px 24px rgba(74, 144, 226, 0.08)',
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          background:
            'linear-gradient(to bottom, rgba(74, 144, 226, 0.5), rgba(26, 188, 156, 0.5))',
          opacity: 0.7,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconWrapper
          sx={{
            background:
              'linear-gradient(45deg, rgba(74, 144, 226, 0.2), rgba(26, 188, 156, 0.2))',
            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)',
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
            position: 'relative',
            '&::after':
              label === 'Họ và tên' ||
              label === 'Email' ||
              label === 'Mã nhân viên'
                ? {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '40px',
                    height: '2px',
                    background:
                      'linear-gradient(to right, rgba(74, 144, 226, 0.7), transparent)',
                    borderRadius: '2px',
                  }
                : {},
          }}
        >
          {label}
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
                    : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  '&:hover': {
                    boxShadow: '0 3px 12px rgba(74, 144, 226, 0.1)',
                  },
                  '& fieldset': { border: 'none' },
                },
                '& .MuiInputBase-input': {
                  padding: '14px 16px',
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
            value={type === 'date' ? formatDateForInput(value) : value || ''}
            onChange={onChange}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            variant="outlined"
            placeholder={`Nhập ${label.toLowerCase()}`}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(203, 213, 225, 0.5)',
                '&:hover': {
                  boxShadow: '0 3px 12px rgba(74, 144, 226, 0.1)',
                },
                '& fieldset': { border: 'none' },
              },
              '& .MuiInputBase-input': {
                padding: multiline ? '14px 16px' : '14px 16px',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#2D3748',
              },
            }}
          />
        )
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ width: '100%' }}
        >
          <Box
            sx={{
              color: '#2D3748',
              fontWeight: 700,
              wordBreak: type === 'email' ? 'break-all' : 'break-word',
              minHeight: '1.5rem',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              flex: 1,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: iconColor
                  ? `linear-gradient(to bottom, ${iconColor}80, ${iconColor}40)`
                  : 'linear-gradient(to bottom, rgba(74, 144, 226, 0.5), rgba(26, 188, 156, 0.5))',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(to right, rgba(255,255,255,0.1), transparent)',
                opacity: 0.4,
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 15px rgba(74, 144, 226, 0.08)',
              },
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: '1.1rem' }}
            >
              {type === 'date' && value
                ? formatDateDisplay(value)
                : value || 'Chưa cập nhật'}
            </Typography>
          </Box>

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

          {/* ✅ Action button (e.g for email change, password change) */}
          {actionButton}
        </Stack>
      )}
    </Paper>
  );
};

const ProfileContent = (props) => {
  const { onUploadComplete } = props;
  const dispatch = useDispatch();
  const reduxAvatar = useSelector(selectAvatar);
  const reduxUser = useSelector(selectUser);

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordChangeDialog, setPasswordChangeDialog] = useState({
    open: false,
  });

  // Email change states
  const [emailChangeDialog, setEmailChangeDialog] = useState({
    open: false,
  });
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  // Đã loại bỏ state alert và chuyển sang sử dụng notify
  // Form data state
  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDay: '',
    gender: '',
    address: '',
    employeeId: '', // Sử dụng userId làm mã nhân viên
  });

  // Original data for reset
  const [originalData, setOriginalData] = useState({});

  // ====================================================================
  // EFFECTS
  // ====================================================================

  /**
   * ✅ Fetch user data từ API khi component mount
   */
  useEffect(() => {
    fetchUserData();
  }, [dispatch]);

  /**
   * ✅ Theo dõi thay đổi từ Redux state và cập nhật userData nếu cần
   */
  useEffect(() => {
    if (reduxUser) {
      console.log('✅ Redux user data cập nhật:', reduxUser);
      console.log('✅ Redux avatar cập nhật:', reduxAvatar);

      // Cập nhật userData từ reduxUser khi có thay đổi
      setUserData((prevData) => ({
        ...prevData,
        ...reduxUser,
        avatar: reduxAvatar || reduxUser?.avatar || prevData?.avatar,
      }));

      // Cập nhật form data từ reduxUser
      const formData = {
        fullName: reduxUser.fullName || '',
        email: reduxUser.email || '',
        phone: reduxUser.phone || '',
        birthDay: reduxUser.birthDay || '',
        gender: reduxUser.gender || '',
        address: reduxUser.address || '',
        employeeId: reduxUser.id || reduxUser.userId || '',
      };

      setFormDataUpdate(formData);
    }
  }, [reduxUser, reduxAvatar]);

  /**
   * ✅ Theo dõi avatar từ Redux và cập nhật ngay khi có thay đổi
   */
  useEffect(() => {
    if (reduxAvatar) {
      console.log('📊 Debug avatar - Redux:', reduxAvatar);
      console.log('📊 Debug avatar - local userData:', userData?.avatar);

      // Luôn ưu tiên dùng avatar từ Redux nếu có sự khác biệt
      if (userData?.avatar !== reduxAvatar) {
        console.log('🔄 Cập nhật userData với reduxAvatar:', reduxAvatar);
        setUserData((prev) => ({
          ...prev,
          avatar: reduxAvatar,
        }));
      }
    }
  }, [reduxAvatar, userData?.avatar]);
  // ====================================================================
  // API FUNCTIONS
  // ====================================================================
  /**
   * Fetch user data từ Redux hoặc API
   */
  const fetchUserData = async () => {
    try {
      console.log('🔄 Đang tải thông tin nhân viên...');
      setIsRefreshing(true);

      // Kiểm tra xem đã có dữ liệu từ Redux chưa
      const currentReduxUser = reduxUser;

      if (currentReduxUser && Object.keys(currentReduxUser).length > 0) {
        // Nếu đã có dữ liệu từ Redux, ưu tiên sử dụng
        console.log(
          '✅ Sử dụng dữ liệu người dùng từ Redux state:',
          currentReduxUser
        );
        console.log('✅ Avatar từ Redux state:', reduxAvatar);

        // Merge với userData hiện tại để đảm bảo không mất dữ liệu
        setUserData((prevUserData) => ({
          ...prevUserData,
          ...currentReduxUser,
          avatar:
            reduxAvatar || currentReduxUser?.avatar || prevUserData?.avatar,
        }));

        // Cập nhật form data
        const formData = {
          fullName: currentReduxUser.fullName || '',
          email: currentReduxUser.email || '',
          phone: currentReduxUser.phone || '',
          birthDay: currentReduxUser.birthDay || '',
          gender: currentReduxUser.gender || '',
          address: currentReduxUser.address || '',
          employeeId: currentReduxUser.id || currentReduxUser.userId || '',
        };

        setFormDataUpdate(formData);
        setOriginalData(formData);
        notify.success('Thành công', 'Đã tải thông tin nhân viên từ Redux!');

        // Vẫn gọi API để đồng bộ dữ liệu mới nhất
        dispatch(fetchCurrentUser());
        return;
      }

      // Nếu chưa có dữ liệu từ Redux, gọi API thông qua Redux thunk
      console.log(
        '🔄 Chưa có dữ liệu Redux, đang gọi API thông qua Redux thunk...'
      );
      const resultAction = await dispatch(fetchCurrentUser());

      // Kiểm tra kết quả từ thunk action
      if (fetchCurrentUser.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        console.log(
          '✅ Đã tải thông tin nhân viên từ API thông qua Redux:',
          user
        );

        setUserData(user);
        const formData = {
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          birthDay: user.birthDay || '',
          gender: user.gender || '',
          address: user.address || '',
          employeeId: user.id || user.userId || '',
        };

        setFormDataUpdate(formData);
        setOriginalData(formData);
        notify.success('Thành công', 'Đã tải thông tin nhân viên thành công!');
        return;
      }

      // Nếu Redux thunk thất bại, thử API trực tiếp
      console.log('⚠️ Redux thunk thất bại, đang gọi API trực tiếp...');
      const response = await userService.getCurrentUser();

      if (response && response.success && response.data) {
        const user = response.data;
        console.log('✅ Đã tải thông tin nhân viên từ API trực tiếp:', user);

        setUserData(user);
        const formData = {
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          birthDay: user.birthDay || '',
          gender: user.gender || '',
          address: user.address || '',
          employeeId: user.id || user.userId || '',
        };

        setFormDataUpdate(formData);
        setOriginalData(formData);

        // Lưu vào localStorage để backup
        const userProfileData = {
          success: true,
          message: 'Get user information successfully',
          data: user.data || user,
        };
        localStorageUtil.set('userProfile', userProfileData);
        notify.success('Thành công', 'Đã tải thông tin nhân viên thành công!');
      } else {
        throw new Error(
          response?.message || 'Không thể tải thông tin nhân viên'
        );
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải thông tin nhân viên:', error);

      if (error.response?.status === 401) {
        notify.error('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại!');
      } else {
        // Fallback to localStorage nếu API fail
        const localUser =
          localStorageUtil.get('userProfile') || localStorageUtil.get('user');
        if (localUser) {
          console.log('📦 Sử dụng dữ liệu từ localStorage làm fallback');
          setUserData(localUser);
          const formData = {
            fullName: localUser.fullName || '',
            email: localUser.email || '',
            phone: localUser.phone || '',
            birthDay: localUser.birthDay || '',
            gender: localUser.gender || '',
            address: localUser.address || '',
            employeeId: localUser.id || localUser.userId || '',
          };
          setFormDataUpdate(formData);
          setOriginalData(formData);
          notify.warning(
            'Dữ liệu offline',
            'Sử dụng dữ liệu đã lưu. Vui lòng kiểm tra kết nối mạng.'
          );
        } else {
          notify.error('Lỗi', 'Không thể tải thông tin nhân viên!');
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  /**
   * Refresh data - reload từ API
   */
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    notify.info('Đang làm mới', 'Đang tải thông tin từ máy chủ...', {
      duration: 2000,
    });
    await dispatch(fetchCurrentUser());
    await fetchUserData();
    setIsRefreshing(false);

    console.log('Debug after refresh - Redux Avatar:', reduxAvatar);
    console.log('Debug after refresh - User Data Avatar:', userData?.avatar);
  };

  // ====================================================================
  // EVENT HANDLERS
  // ====================================================================

  /**
   * ✅ Handle form input change
   */ const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    setFormDataUpdate({
      ...formDataUpdate,
      [name]: value,
    });
  };

  /**
   * ✅ Handle save
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // ✅ Validate required fields
      if (!formDataUpdate.fullName.trim()) {
        notify.warning('Thiếu thông tin', 'Vui lòng nhập họ tên!', {
          duration: 3000,
        });
        return;
      }

      console.log('🔄 Đang lưu thông tin nhân viên:', formDataUpdate);
      notify.info('Đang xử lý', 'Đang lưu thông tin nhân viên...', {
        duration: 2000,
      });
      const updateData = {
        fullName: formDataUpdate.fullName.trim(),
        phone: formDataUpdate.phone?.trim() || '',
        birthDay: formDataUpdate.birthDay || '',
        gender: formDataUpdate.gender || '',
        address: formDataUpdate.address?.trim() || '',
      }; // Gọi API thực để cập nhật thông tin
      // Đảm bảo token hợp lệ trước khi gọi API
      await userService.ensureValidToken();

      const response = await userService.updateProfile(updateData);

      if (response && response.success) {
        const updatedUser = response.data || { ...userData, ...updateData };
        setUserData(updatedUser);

        const newFormData = {
          ...formDataUpdate,
          ...updateData,
        };
        setFormDataUpdate(newFormData);
        setOriginalData(newFormData);

        const userProfileData = {
          success: true,
          message: 'Update user information successfully',
          data: updatedUser.data || updatedUser,
        };
        localStorageUtil.set('userProfile', userProfileData);
        localStorageUtil.set('user', updatedUser); // Cập nhật cả user chính

        setIsEditing(false);
        notify.success(
          'Thành công',
          'Thông tin nhân viên đã được lưu thành công.',
          { duration: 4000 }
        );

        console.log('✅ Đã lưu thông tin thành công:', updatedUser);
      } else {
        throw new Error(response?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật thông tin:', error);
      notify.error(
        'Lỗi cập nhật',
        error.message || 'Có lỗi xảy ra khi cập nhật thông tin',
        { duration: 5000 }
      );
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * ✅ Handle cancel editing
   */
  const handleCancel = () => {
    setFormDataUpdate({ ...originalData });
    setIsEditing(false);
    notify.info('Đã hủy', 'Các thay đổi đã được hủy bỏ.', { duration: 2000 });
  };

  /**
   * ✅ Open password change dialog
   */
  const handleOpenPasswordDialog = () => {
    setPasswordChangeDialog({ open: true });
  };

  /**
   * ✅ Close password change dialog
   */
  const handleClosePasswordDialog = () => {
    setPasswordChangeDialog({ open: false });
  };
  // Không cần hàm handleCloseAlert vì đã chuyển sang sử dụng notify
  /**
   * ✅ Open email change dialog
   */
  const handleOpenEmailDialog = () => {
    setEmailChangeDialog({ open: true });
  };

  /**
   * ✅ Close email change dialog
   */
  const handleCloseEmailDialog = () => {
    setEmailChangeDialog({ open: false });
  };

  /**
   * ✅ Handle send verification code
   */
  const handleSendCode = async (email) => {
    try {
      setIsSendingCode(true);

      notify.info('Đang xử lý', 'Đang gửi mã xác nhận đến email mới...', {
        duration: 2000,
      });

      // Call API to send verification code
      const response = await userService.sendEmailVerificationCode(email);

      if (response.success) {
        return Promise.resolve(); // Success for modal to handle
      } else {
        throw new Error(response.message || 'Không thể gửi mã xác nhận');
      }
    } catch (error) {
      console.error('❌ Error sending verification code:', error);
      throw error; // Let modal handle the error
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * ✅ Handle verify and save email
   */
  const handleVerifyAndSave = async (email, verificationCode) => {
    try {
      setIsVerifying(true);

      notify.info('Đang xác nhận', 'Đang xác nhận mã và cập nhật email...', {
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

        setFormDataUpdate(updatedFormData);
        setOriginalData(updatedFormData);

        // Update user data
        const updatedUser = {
          ...userData,
          email: email,
        };
        setUserData(updatedUser);

        // Update localStorage
        localStorageUtil.set('user', updatedUser);

        // Maintain consistent structure {success, message, data} in localStorage
        const userProfileData = {
          success: true,
          message: 'Email updated successfully',
          data: updatedUser.data || updatedUser,
        };
        localStorageUtil.set('userProfile', userProfileData);

        console.log('✅ Email updated successfully:', updatedUser);

        notify.success('Thành công!', 'Email đã được cập nhật thành công!', {
          duration: 4000,
        });

        return Promise.resolve(); // Success for modal to handle
      } else {
        throw new Error(response.message || 'Mã xác nhận không đúng');
      }
    } catch (error) {
      console.error('❌ Error verifying email:', error);
      throw error; // Let modal handle the error
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * ✅ Handle password change
   */ const handleChangePassword = async (passwordData) => {
    try {
      setIsSubmitting(true);
      // Đảm bảo token hợp lệ trước khi gọi API
      await userService.ensureValidToken();

      const response = await userService.changePassword(passwordData);

      if (response && response.success) {
        notify.success('Thành công', 'Mật khẩu đã được thay đổi thành công.', {
          duration: 3000,
        });
        handleClosePasswordDialog();
      } else {
        notify.error(
          'Lỗi',
          response?.message || 'Không thể thay đổi mật khẩu. Vui lòng thử lại.'
        );
      }
    } catch (error) {
      console.error('❌ Error changing password:', error);
      let errorMessage = 'Đã xảy ra lỗi khi thay đổi mật khẩu';

      if (error.response?.status === 401) {
        errorMessage = 'Mật khẩu hiện tại không chính xác';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      notify.error('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <ProfileContainer>
      {' '}
      {/* Password Change Dialog */}
      {passwordChangeDialog.open && (
        <PasswordChangeDialog
          open={passwordChangeDialog.open}
          onClose={handleClosePasswordDialog}
          onChangePassword={handleChangePassword}
          isChanging={isSubmitting}
        />
      )}
      {/* Email Change Dialog */}
      {emailChangeDialog.open && (
        <EmailChangeDialog
          open={emailChangeDialog.open}
          onClose={handleCloseEmailDialog}
          currentEmail={userData?.email || ''}
          onSendCode={handleSendCode}
          onVerifyAndSave={handleVerifyAndSave}
          isSendingCode={isSendingCode}
          isVerifying={isVerifying}
        />
      )}
      {/* Avatar Upload Dialog */}
      <Dialog
        open={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        aria-labelledby="avatar-upload-dialog"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
        <DialogContent>
          {' '}
          <AvatarUpload
            currentImage={
              reduxAvatar
                ? imageUrl.getFullImageUrl(reduxAvatar)
                : userData?.avatar
                  ? imageUrl.getFullImageUrl(userData.avatar)
                  : null
            }
            onSuccess={(avatarPath) => {
              console.log('✅ Avatar uploaded successfully:', avatarPath);
              setIsAvatarModalOpen(false);

              // Cập nhật userData local ngay lập tức
              console.log('🔄 Cập nhật userData với avatar mới:', avatarPath);
              setUserData((prev) => ({
                ...prev,
                avatar: avatarPath,
              }));

              // Cập nhật Redux state thông qua fetchCurrentUser
              dispatch(fetchCurrentUser())
                .then(() => {
                  console.log(
                    '✅ Redux state đã cập nhật sau khi thay đổi avatar'
                  );
                  console.log('✅ Avatar mới từ Redux:', reduxAvatar);

                  // Force re-render để đảm bảo hiển thị avatar mới
                  setUserData((prev) => ({ ...prev }));
                })
                .catch((err) => {
                  console.error('❌ Không thể cập nhật Redux state:', err);
                });

              notify.success(
                'Thành công',
                'Avatar đã được cập nhật thành công'
              );
            }}
            onError={(error) => {
              setAvatarError(error);
              notify.error('Lỗi', error || 'Không thể cập nhật avatar');
            }}
            onClose={() => setIsAvatarModalOpen(false)}
          />
          {avatarError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {avatarError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAvatarModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      {/* Main Content */}
      {/* Horizontal Profile Card */}
      <ProfileCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {' '}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              transition: 'all 0.3s ease',
            }}
          >
            {/* Avatar Section */}
            <Box
              sx={{
                position: 'relative',
                mr: { xs: 0, sm: 4 },
                mb: { xs: 3, sm: 0 },
                textAlign: { xs: 'center', sm: 'left' },
                transition: 'all 0.3s ease',
              }}
            >
              {' '}
              <Avatar
                src={
                  // Ưu tiên sử dụng avatar từ Redux state nếu có
                  reduxAvatar
                    ? imageUrl.getFullImageUrl(reduxAvatar)
                    : userData?.avatar
                      ? imageUrl.getFullImageUrl(userData.avatar)
                      : undefined
                }
                key={`avatar-${reduxAvatar || userData?.avatar || 'default'}`} // Thêm key để đảm bảo re-render khi avatar thay đổi
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '2.8rem',
                  background:
                    'linear-gradient(135deg, rgba(74, 144, 226, 0.8), rgba(26, 188, 156, 0.8))',
                  boxShadow: '0 8px 16px rgba(74, 144, 226, 0.2)',
                  transition: 'transform 0.3s ease',
                  border: '4px solid white',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {formDataUpdate?.fullName?.[0] || 'S'}
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: { xs: '50%', sm: -5 },
                  transform: { xs: 'translateX(50%)', sm: 'none' },
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    padding: 0,
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    boxShadow: '0 4px 8px rgba(74, 144, 226, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5A9AE8, #25C7A7)',
                      boxShadow: '0 6px 12px rgba(74, 144, 226, 0.4)',
                    },
                  }}
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <EditIcon fontSize="small" />
                </Button>
              </Box>
            </Box>

            {/* User Info Section */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  justifyContent: { xs: 'center', sm: 'space-between' },
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    textAlign: { xs: 'center', sm: 'left' },
                    mb: { xs: 2, sm: 0 },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#2D3748', mb: 1 }}
                  >
                    {formDataUpdate.fullName || 'Nhân viên'}
                  </Typography>
                  <Chip
                    label="Nhân viên y tế"
                    sx={{
                      backgroundColor: 'rgba(26, 188, 156, 0.1)',
                      color: '#1ABC9C',
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={handleOpenPasswordDialog}
                    sx={{
                      borderRadius: '12px',
                      color: '#4A90E2',
                      borderColor: 'rgba(74, 144, 226, 0.3)',
                      mr: 2,
                      '&:hover': {
                        borderColor: '#4A90E2',
                        backgroundColor: 'rgba(74, 144, 226, 0.04)',
                      },
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      sx={{
                        borderRadius: '12px',
                        borderColor: 'rgba(74, 144, 226, 0.6)',
                        color: '#4A90E2',
                        '&:hover': {
                          backgroundColor: 'rgba(74, 144, 226, 0.08)',
                          borderColor: '#4A90E2',
                        },
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{
                        borderRadius: '12px',
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.25)',
                        '&:hover': {
                          boxShadow: '0 6px 15px rgba(74, 144, 226, 0.35)',
                        },
                      }}
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  )}{' '}
                </Box>
              </Box>

              {/* Contact Info Grid */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <IconWrapper>
                      <EmailIcon fontSize="small" sx={{ color: '#4A90E2' }} />
                    </IconWrapper>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: '#718096', mb: 0.5 }}
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#2D3748',
                          wordBreak: 'break-all',
                        }}
                      >
                        {formDataUpdate.email || 'chưa cập nhật'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <IconWrapper>
                      <PhoneIcon fontSize="small" sx={{ color: '#4A90E2' }} />
                    </IconWrapper>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: '#718096', mb: 0.5 }}
                      >
                        Điện thoại
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: '#2D3748' }}
                      >
                        {formDataUpdate.phone || 'chưa cập nhật'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconWrapper>
                      <PermIdentityIcon
                        fontSize="small"
                        sx={{ color: '#4A90E2' }}
                      />
                    </IconWrapper>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: '#718096', mb: 0.5 }}
                      >
                        Mã nhân viên
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: '#2D3748' }}
                      >
                        {formDataUpdate.employeeId || 'chưa cập nhật'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </ProfileCard>{' '}
      {/* Detailed Information Card */}
      <ProfileCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: 0,
                width: 120,
                height: 3,
                background:
                  'linear-gradient(90deg, #4A90E2, #1ABC9C, transparent)',
                borderRadius: 8,
              },
            }}
          >
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                p: 1,
                mr: 2,
                width: 48,
                height: 48,
                boxShadow: '0 4px 10px rgba(74, 144, 226, 0.2)',
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: 'white' }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#2D3748',
                fontSize: '1.25rem',
              }}
            >
              Thông tin chi tiết
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 3,
              p: { xs: 2, sm: 3 },
              borderRadius: '16px',
              background:
                'linear-gradient(145deg, rgba(240, 247, 255, 0.6), rgba(255, 255, 255, 0.9))',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            <Grid container spacing={3}>
              {/* Họ và tên full name */}
              <Grid item size={8} md={6}>
                <FieldInfoBox
                  icon={<PersonIcon />}
                  label="Họ và tên"
                  name="fullName"
                  value={formDataUpdate.fullName}
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  iconColor="#4A90E2"
                  backgroundColor="linear-gradient(45deg, rgba(74, 144, 226, 0.07), rgba(26, 188, 156, 0.03))"
                />
              </Grid>
              {/* Mã nhân viên */}
              <Grid item size={4} md={6}>
                <FieldInfoBox
                  icon={<PermIdentityIcon />}
                  label="Mã nhân viên"
                  name="employeeId"
                  value={formDataUpdate.employeeId}
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  disabled={true}
                  iconColor="#2B6CB0"
                  backgroundColor="linear-gradient(45deg, rgba(43, 108, 176, 0.07), rgba(99, 179, 237, 0.03))"
                />
              </Grid>
              {/* Email */}
              <Grid item size={8} md={6}>
                {' '}
                <FieldInfoBox
                  icon={<EmailIcon />}
                  label="Email"
                  name="email"
                  value={formDataUpdate.email}
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  disabled={true}
                  type="email"
                  iconColor="#3182CE"
                  backgroundColor="linear-gradient(45deg, rgba(49, 130, 206, 0.07), rgba(144, 205, 244, 0.03))"
                  actionButton={
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleOpenEmailDialog}
                      sx={{
                        ml: 1,
                        borderRadius: '8px',
                        color: '#3182CE',
                        borderColor: 'rgba(49, 130, 206, 0.3)',
                        '&:hover': {
                          borderColor: '#3182CE',
                          backgroundColor: 'rgba(49, 130, 206, 0.04)',
                        },
                      }}
                    >
                      Đổi email
                    </Button>
                  }
                />
              </Grid>
              {/* số điện thoại */}
              <Grid item size={4} md={6}>
                <FieldInfoBox
                  icon={<PhoneIcon />}
                  label="Số điện thoại"
                  name="phone"
                  value={formDataUpdate.phone}
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  iconColor="#DD6B20"
                  backgroundColor="linear-gradient(45deg, rgba(221, 107, 32, 0.07), rgba(246, 173, 85, 0.03))"
                />
              </Grid>
              {/* Ngày sinh , sinh nhật */}
              <Grid item size={4} md={6}>
                <FieldInfoBox
                  icon={<CakeIcon />}
                  label="Ngày sinh"
                  name="birthDay"
                  value={
                    isEditing
                      ? formatDateForInput(formDataUpdate.birthDay)
                      : formDataUpdate.birthDay
                  }
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  type="date"
                  iconColor="#D53F8C"
                  backgroundColor="linear-gradient(45deg, rgba(213, 63, 140, 0.07), rgba(237, 100, 166, 0.03))"
                />
              </Grid>
              {/* Giới tính */}
              <Grid item size={4} md={6}>
                <FieldInfoBox
                  icon={<WcIcon />}
                  label="Giới tính"
                  name="gender"
                  value={formDataUpdate.gender}
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  iconColor="#805AD5"
                  backgroundColor="linear-gradient(45deg, rgba(128, 90, 213, 0.07), rgba(183, 148, 244, 0.03))"
                  options={[
                    { value: 'Nam', label: 'Nam' },
                    { value: 'Nữ', label: 'Nữ' },
                    { value: 'Khác', label: 'Khác' },
                  ]}
                />
              </Grid>
              {/* Địa chỉ */}
              <Grid item size={4} md={6}>
                <FieldInfoBox
                  icon={<LocationOnIcon />}
                  label="Địa chỉ"
                  name="address"
                  value={formDataUpdate.address}
                  onChange={handleChangeUpdate}
                  isEditing={isEditing}
                  multiline={true}
                  rows={3}
                  iconColor="#DD6B20"
                  backgroundColor="linear-gradient(45deg, rgba(221, 107, 32, 0.05), rgba(246, 173, 85, 0.02))"
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfileContent;

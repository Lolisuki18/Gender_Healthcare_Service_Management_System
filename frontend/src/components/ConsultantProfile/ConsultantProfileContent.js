/**
 * ConsultantProfileContent.js - Component để hiển thị và quản lý hồ sơ chuyên gia
 *
 * Features:
 * - Hiển thị thông tin hồ sơ chuyên gia với format đẹp giống CustomerProfile
 * - Inline editing mode với disabled fields cho readonly data
 * - Tích hợp thông tin cá nhân và chuyên môn trong một trang duy nhất
 * - Modal riêng cho thay đổi email, password, avatar
 * - Form validation và error handling
 * - Responsive design với modern UI
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  FormControl,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Save as SaveIcon,

  Cake as CakeIcon,
  Wc as GenderIcon,
  Home as AddressIcon,
  School as QualificationsIcon,
  BusinessCenter as ExperienceIcon,
  Info as BioIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,

} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AvatarUpload from '../common/AvatarUpload';
import apiClient from '../../services/api';
import {

  formatDateDisplay,
  formatDateForInput,
} from '../../utils/dateUtils';
import imageUrl from '../../utils/imageUrl';
import { notify } from '../../utils/notify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';

// Styled components - giống ProfileContent
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(24px)',
  borderRadius: 24,
  border: '1.5px solid rgba(74, 144, 226, 0.18)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.13)',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(120deg, #e3f0fa 60%, #f8feff 100%)',
  backdropFilter: 'blur(30px)',
  borderRadius: 32,
  border: '2px solid #b3e0fc',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.18)',
  overflow: 'visible',
  marginBottom: theme.spacing(4),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #e3f0fa 60%, #b3e0fc 100%)',
  marginRight: 20,
  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
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

// FieldInfoBox component - Support action button for special fields
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
          {isEmailField && ' (Sử dụng nút riêng để thay đổi)'}
        </Typography>
      </Stack>

      {isEditing && !isEmailField ? (
        options ? (
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
              whiteSpace: 'pre-line',
            }}
          >
            {value || 'Chưa cập nhật'}
          </Typography>

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

          {actionButton}
        </Stack>
      )}
    </Paper>
  );
};

// TabPanel component for tab content - Không cần thiết nữa
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`profile-tabpanel-${index}`}
//       aria-labelledby={`profile-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// Styled FieldInfoBox cho DatePicker đồng bộ với các ô khác
const DatePickerFieldBox = ({ icon, label, value, onChange, error }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '16px',
      background:
        'linear-gradient(45deg, rgba(74, 144, 226, 0.05), rgba(26, 188, 156, 0.05))',
      border: error ? '1px solid #E53E3E' : '1px solid rgba(74, 144, 226, 0.1)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mb: 0,
      boxShadow: error
        ? '0 4px 16px rgba(229, 62, 62, 0.1)'
        : '0 4px 16px rgba(74, 144, 226, 0.06)',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: error
          ? 'linear-gradient(135deg, #FED7D7 60%, #FC8181 100%)'
          : 'linear-gradient(135deg, #e3f0fa 60%, #b3e0fc 100%)',
        mr: 2,
        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="body2"
        sx={{ color: '#4A5568', fontWeight: 600, mb: 1 }}
      >
        {label}
      </Typography>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={viLocale}
      >
        <DatePicker
          value={value}
          onChange={onChange}
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '& fieldset': {
                    borderColor: error ? '#E53E3E' : 'rgba(74, 144, 226, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: error ? '#E53E3E' : 'rgba(26, 188, 156, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: error ? '#E53E3E' : '#1ABC9C',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#E53E3E',
                  fontSize: '0.75rem',
                  marginTop: '4px',
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  </Paper>
);

const ConsultantProfileContent = () => {
  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Messages
  // Modal states
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // Data from API
  const [userProfile, setUserProfile] = useState(null);

  // Form data để edit - merged từ personal và professional info (bỏ phone)
  const [formData, setFormData] = useState({
    // Personal info
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    avatar: '',
    // Professional info
    qualifications: '',
    experience: '',
    bio: '',
  });
  // Validation state
  const [dobError, setDobError] = useState('');
  // Original data để reset khi cancel
  const [originalData, setOriginalData] = useState({});
  // ====================================================================
  // EFFECTS
  // ====================================================================

  /**
   * Fetch user data từ API khi component mount
   */
  useEffect(() => {
    loadProfileData();
  }, []);

  // ====================================================================
  // API FUNCTIONS
  // ====================================================================

  /**
   * Function to load user profile and consultant profile
   */
  const loadProfileData = async () => {
    setIsProfileLoading(true);

    try {
      // Load user profile (personal info)
      const userResponse = await apiClient.get('/users/profile');
      if (userResponse.data.success) {
        const userData = userResponse.data.data;
        console.log('User data from API:', userData); // Debug log
        setUserProfile(userData);

        // Prepare form data with personal info
        let dobValue = '';
        if (Array.isArray(userData.birthDay)) {
          dobValue = userData.birthDay;
        } else if (
          typeof userData.birthDay === 'string' &&
          userData.birthDay.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
          dobValue = userData.birthDay;
        } else if (
          typeof userData.birthDay === 'number' ||
          (typeof userData.birthDay === 'string' &&
            userData.birthDay.match(/^\d{7,8}$/))
        ) {
          // Trường hợp nhận được 2025724 hoặc 20250724
          const str = userData.birthDay.toString();
          if (str.length === 7) {
            // 2025724 -> 2025,7,24
            dobValue = [
              parseInt(str.slice(0, 4)),
              parseInt(str.slice(4, 5)),
              parseInt(str.slice(5, 7)),
            ];
          } else if (str.length === 8) {
            // 20250724 -> 2025,07,24
            dobValue = [
              parseInt(str.slice(0, 4)),
              parseInt(str.slice(4, 6)),
              parseInt(str.slice(6, 8)),
            ];
          }
        }
        const personalInfo = {
          fullName: userData.fullName || '',
          email: userData.email || '',
          dob: dobValue,
          gender: userData.gender || '',
          address: userData.address || '',
          avatar: userData.avatar || '',
        };

        console.log('Personal info prepared:', personalInfo); // Debug log

        // Load consultant profile (professional info) if user is consultant
        let professionalInfo = {
          qualifications: '',
          experience: '',
          bio: '',
        };

        if (userData.role === 'CONSULTANT') {
          try {
            const consultantResponse = await apiClient.get(
              `/consultants/${userData.id}`
            );
            if (consultantResponse.data.success) {
              professionalInfo = {
                qualifications:
                  consultantResponse.data.data.qualifications || '',
                experience: consultantResponse.data.data.experience || '',
                bio: consultantResponse.data.data.bio || '',
              };
            }
          } catch (consultantError) {
            console.warn('No consultant profile found, using default values');
          }
        } // Merge all data into formData
        const mergedData = {
          ...personalInfo,
          ...professionalInfo,
        };

        console.log('Final merged data:', mergedData); // Debug log
        setFormData(mergedData);
        setOriginalData(mergedData);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      notify.error(
        'Lỗi',
        'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.'
      );
    } finally {
      setIsProfileLoading(false);
    }
  };

  /**
   * Refresh data - reload từ API
   */
   // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================

  /**
   * Handle form input change
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle toggle edit mode
   */
  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel edit - reset to original data
      setFormData(originalData);
      setDobError(''); // Reset error when cancel
    } else {
      // Khi chuyển sang edit mode, set lại formData từ originalData (và format ngày sinh, giới tính nếu cần)
      let newFormData = { ...originalData };
      // Format ngày sinh về yyyy-MM-dd nếu có dữ liệu
      if (newFormData.dob) {
        if (Array.isArray(newFormData.dob)) {
          // [2025, 7, 24] => '2025-07-24'
          const [y, m, d] = newFormData.dob;
          newFormData.dob = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        } else if (
          typeof newFormData.dob === 'string' &&
          newFormData.dob.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
          // đã đúng định dạng
        } else if (
          typeof newFormData.dob === 'number' ||
          (typeof newFormData.dob === 'string' &&
            newFormData.dob.match(/^\d{7,8}$/))
        ) {
          // 20250724 hoặc 2025724
          const str = newFormData.dob.toString();
          if (str.length === 7) {
            newFormData.dob = `${str.slice(0, 4)}-0${str.slice(4, 5)}-${str.slice(5, 7)}`;
          } else if (str.length === 8) {
            newFormData.dob = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
          }
        } else {
          newFormData.dob = '';
        }
      }
      // Chuẩn hóa giới tính về 'Nam', 'Nữ', 'Khác'
      if (newFormData.gender) {
        if (!['Nam', 'Nữ', 'Khác'].includes(newFormData.gender))
          newFormData.gender = '';
      }
      setFormData(newFormData);
      setDobError(''); // Reset error when entering edit mode
    }
    setIsEditing(!isEditing);
  };

  /**
   * Validate date of birth
   */
  const validateDateOfBirth = (dob) => {
    if (!dob) return { isValid: true, message: '' };

    let birthDate;

    // Parse date from different formats
    if (Array.isArray(dob)) {
      // [2025, 7, 24] format
      const [year, month, day] = dob;
      birthDate = new Date(year, month - 1, day); // month is 0-indexed
    } else if (typeof dob === 'string' && dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // '2025-07-24' format
      birthDate = new Date(dob);
    } else {
      return { isValid: false, message: 'Định dạng ngày sinh không hợp lệ' };
    }

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Check if birthday has occurred this year
    const hasHadBirthday =
      monthDiff > 0 ||
      (monthDiff === 0 && today.getDate() >= birthDate.getDate());
    const actualAge = hasHadBirthday ? age : age - 1;

    // Check if date is in the future
    if (birthDate > today) {
      return {
        isValid: false,
        message: 'Ngày sinh không thể lớn hơn ngày hiện tại',
      };
    }

    // Check if age is less than 18
    if (actualAge < 18) {
      return {
        isValid: false,
        message: 'Bạn phải đủ 18 tuổi để sử dụng dịch vụ này',
      };
    }

    return { isValid: true, message: '' };
  };

  /**
   * Handle save profile changes
   */
  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      // Validate date of birth first
      const dobValidation = validateDateOfBirth(formData.dob);
      if (!dobValidation.isValid) {
        notify.warning('Cảnh báo', dobValidation.message);
        setIsLoading(false);
        return;
      }

      // Update personal info using UserController APIs (bỏ phone)
      const personalInfoPayload = {
        fullName: formData.fullName,
        birthDay: formData.dob,
        gender: formData.gender,
        address: formData.address,
      };

      const personalResponse = await apiClient.put(
        '/users/profile/basic',
        personalInfoPayload
      );

      if (personalResponse.data.success) {
        // Update professional info using ConsultantController APIs
        if (userProfile && userProfile.role === 'CONSULTANT') {
          const professionalInfoPayload = {
            qualifications: formData.qualifications,
            experience: formData.experience,
            bio: formData.bio,
          };

          await apiClient.put(
            `/consultants/profile/${userProfile.id}`,
            professionalInfoPayload
          );
        }

        // Reload data to get updated info
        await loadProfileData();

        setIsEditing(false);
        notify.success('Thành công', 'Cập nhật hồ sơ thành công!');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      notify.error(
        'Lỗi',
        err.message || 'Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  }; // ====================================================================
  // AVATAR HANDLER FUNCTIONS
  // ====================================================================

  /**
   * Handle avatar change click
   */
  const handleAvatarChangeClick = () => {
    setIsAvatarModalOpen(true);
  };

  /**
   * Handle close avatar modal
   */
  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setAvatarError('');
  };

  /**
   * Handle avatar upload error
   */
  const handleAvatarUploadError = (errorMessage) => {
    setAvatarError(errorMessage);
  };

  // ====================================================================
  // RENDER FUNCTIONS
  // ====================================================================
  // Show loading screen while fetching profile data
  if (isProfileLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải thông tin hồ sơ...
        </Typography>
      </Box>
    );
  }

  // Gender options for select
  const genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Khác', label: 'Khác' },
  ];
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      {/* Profile Header Card - Cải thiện layout */}
      <ProfileCard sx={{ mb: 4, overflow: 'visible' }}>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Avatar Section */}
            <Grid item xs={12} md={4} lg={3}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    mb: 3,
                  }}
                >
                  <Avatar
                    src={
                      formData.avatar
                        ? imageUrl.getFullImageUrl(formData.avatar)
                        : undefined
                    }
                    sx={{
                      width: { xs: 100, md: 140 },
                      height: { xs: 100, md: 140 },
                      border: '4px solid rgba(74, 144, 226, 0.15)',
                      boxShadow: '0 8px 24px rgba(74, 144, 226, 0.15)',
                    }}
                  />
                  {/* Status indicator */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAvatarChangeClick}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(74, 144, 226, 0.3)',
                    color: '#4A90E2',
                    px: 3,
                    '&:hover': {
                      borderColor: '#1ABC9C',
                      color: '#1ABC9C',
                      backgroundColor: 'rgba(26, 188, 156, 0.05)',
                    },
                  }}
                >
                  Đổi ảnh đại diện
                </Button>
              </Box>
            </Grid>

            {/* Basic Info Display - Expanded */}
            <Grid item xs={12} md={8} lg={6}>
              <Box sx={{ pl: { md: 2 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#2D3748',
                    mb: 1,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {formData.fullName || 'Chưa cập nhật'}
                </Typography>
                {userProfile && userProfile.id && (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#4A90E2',
                      fontWeight: 600,
                      fontSize: '1rem',
                      mb: 1,
                      letterSpacing: 1,
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    Mã chuyên viên: #{userProfile.id}
                  </Typography>
                )}

                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: '#4A5568',
                      fontWeight: 500,
                      fontSize: '1.1rem',
                    }}
                  >
                    Chuyên gia tư vấn
                  </Typography>
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Đã xác thực"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: '#059669',
                      },
                    }}
                  />
                </Box>

                {/* Info Cards - Better layout */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(74, 144, 226, 0.08)',
                        border: '1px solid rgba(74, 144, 226, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(74, 144, 226, 0.12)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <CakeIcon sx={{ fontSize: 16, color: '#4A90E2' }} />
                        <Typography
                          variant="body2"
                          sx={{ color: '#4A5568', fontWeight: 600 }}
                        >
                          Ngày sinh
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: '#2D3748' }}
                      >
                        {formatDateDisplay(formData.dob)}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(56, 161, 105, 0.08)',
                        border: '1px solid rgba(56, 161, 105, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(56, 161, 105, 0.12)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <AddressIcon sx={{ fontSize: 16, color: '#38A169' }} />
                        <Typography
                          variant="body2"
                          sx={{ color: '#4A5568', fontWeight: 600 }}
                        >
                          Địa chỉ hiện tại
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#2D3748',
                          wordBreak: 'break-word',
                        }}
                      >
                        {formData.address || 'Chưa cập nhật'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Action Buttons - Better positioned */}
            <Grid item xs={12} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', lg: 'column' },
                  gap: 2,
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  alignItems: { xs: 'center', lg: 'stretch' },
                }}
              >
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleToggleEdit}
                    fullWidth
                    sx={{
                      background:
                        'linear-gradient(45deg, #4A90E2 30%, #1ABC9C 90%)',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: '600',
                      px: 3,
                      py: 1.5,
                      boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
                      '&:hover': {
                        background:
                          'linear-gradient(45deg, #357ABD 30%, #16A085 90%)',
                        boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      fullWidth
                      sx={{
                        background:
                          'linear-gradient(45deg, #48BB78 30%, #38A169 90%)',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: '600',
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)',
                        '&:hover': {
                          background:
                            'linear-gradient(45deg, #38A169 30%, #2F855A 90%)',
                          boxShadow: '0 6px 20px rgba(72, 187, 120, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: 'rgba(160, 174, 192, 0.6)',
                          boxShadow: 'none',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleToggleEdit}
                      disabled={isLoading}
                      fullWidth
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: '600',
                        px: 3,
                        py: 1.5,
                        borderColor: 'rgba(160, 174, 192, 0.5)',
                        color: '#4A5568',
                        '&:hover': {
                          borderColor: '#A0AEC0',
                          backgroundColor: 'rgba(160, 174, 192, 0.05)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ProfileCard>
      {/* Main Content - Thông tin chi tiết */}
      <StyledPaper sx={{ p: 4 }}>
        {/* Thông tin cá nhân Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: '#2D3748',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconWrapper sx={{ mr: 2 }}>
              <PersonIcon sx={{ color: '#4A90E2', fontSize: 24 }} />
            </IconWrapper>
            Thông tin cá nhân
          </Typography>

          <Grid container spacing={3}>
            <Grid item size={12} xs={12}>
              <FieldInfoBox
                icon={<PersonIcon />}
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                isEditing={isEditing}
                iconColor="#4A90E2"
              />
            </Grid>{' '}
            <Grid item size={6} xs={12} sm={6}>
              {isEditing ? (
                <DatePickerFieldBox
                  icon={<CakeIcon sx={{ color: '#F1C40F', fontSize: 28 }} />}
                  label="Ngày sinh"
                  value={
                    formData.dob
                      ? new Date(formatDateForInput(formData.dob))
                      : null
                  }
                  onChange={(date) => {
                    const newDob = date ? formatDateForInput(date) : '';
                    setFormData((prev) => ({
                      ...prev,
                      dob: newDob,
                    }));

                    // Validate date of birth
                    const validation = validateDateOfBirth(newDob);
                    setDobError(validation.message);
                  }}
                  error={dobError}
                />
              ) : (
                <FieldInfoBox
                  icon={<CakeIcon />}
                  label="Ngày sinh"
                  name="dob"
                  value={formatDateDisplay(formData.dob)}
                  onChange={handleFormChange}
                  isEditing={false}
                  type="date"
                  iconColor="#D69E2E"
                />
              )}
            </Grid>
            <Grid item size={6} xs={12} sm={6}>
              <FieldInfoBox
                icon={<GenderIcon />}
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                isEditing={isEditing}
                options={genderOptions}
                iconColor="#9F7AEA"
              />
            </Grid>
            <Grid item size={12} xs={12}>
              <FieldInfoBox
                icon={<AddressIcon />}
                label="Địa chỉ hiện tại"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                isEditing={isEditing}
                multiline={true}
                rows={2}
                iconColor="#F56565"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Thông tin chuyên môn Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: '#2D3748',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconWrapper sx={{ mr: 2 }}>
              <WorkIcon sx={{ color: '#1ABC9C', fontSize: 24 }} />
            </IconWrapper>
            Thông tin chuyên môn
          </Typography>
          <Grid container spacing={3}>
            <Grid item size={12} xs={12}>
              <FieldInfoBox
                icon={<BioIcon />}
                label="Giới thiệu bản thân"
                name="bio"
                value={formData.bio}
                onChange={handleFormChange}
                isEditing={isEditing}
                multiline={true}
                rows={4}
                iconColor="#38A169"
                backgroundColor="linear-gradient(45deg, rgba(56, 161, 105, 0.05), rgba(72, 187, 120, 0.05))"
              />
            </Grid>
            <Grid item size={12} xs={12}>
              <FieldInfoBox
                icon={<QualificationsIcon />}
                label="Trình độ chuyên môn"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleFormChange}
                isEditing={isEditing}
                multiline={true}
                rows={3}
                iconColor="#805AD5"
                backgroundColor="linear-gradient(45deg, rgba(128, 90, 213, 0.05), rgba(159, 122, 234, 0.05))"
              />
            </Grid>
            <Grid item size={12} xs={12}>
              <FieldInfoBox
                icon={<ExperienceIcon />}
                label="Kinh nghiệm làm việc"
                name="experience"
                value={formData.experience}
                onChange={handleFormChange}
                isEditing={isEditing}
                multiline={true}
                rows={3}
                iconColor="#3182CE"
                backgroundColor="linear-gradient(45deg, rgba(49, 130, 206, 0.05), rgba(66, 153, 225, 0.05))"
              />
            </Grid>
          </Grid>{' '}
        </Box>
      </StyledPaper>
      {/* Avatar Upload Modal (Dialog style giống ProfileContent.js) */}
      {isAvatarModalOpen && (
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
              currentImage={formData.avatar}
              onUploadSuccess={(avatarPath) => {
                setFormData((prev) => ({ ...prev, avatar: avatarPath }));
                setUserProfile((prev) =>
                  prev ? { ...prev, avatar: avatarPath } : prev
                );
                // Cập nhật localStorage giống ProfileContent.js
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                  user.avatar = avatarPath;
                  localStorage.setItem('user', JSON.stringify(user));
                }
                const userProfile = JSON.parse(
                  localStorage.getItem('userProfile')
                );
                if (userProfile && userProfile.data) {
                  userProfile.data.avatar = avatarPath;
                  localStorage.setItem(
                    'userProfile',
                    JSON.stringify(userProfile)
                  );
                }
                setIsAvatarModalOpen(false);
                setAvatarError('');
                notify.success(
                  'Thành công',
                  'Cập nhật ảnh đại diện thành công!'
                );
                setTimeout(() => notify.success(false), 2000);
              }}
              onUploadError={handleAvatarUploadError}
              onClose={handleCloseAvatarModal}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ConsultantProfileContent;

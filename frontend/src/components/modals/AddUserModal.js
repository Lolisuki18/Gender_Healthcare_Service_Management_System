/**
 * AddUserModal.js - Modal thêm mới người dùng
 *
 * Modal component để thêm mới các loại người dùng trong hệ thống
 */
import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Grid,
  Button,
  IconButton,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Box,
  InputAdornment,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  AccountCircle as AccountIcon,
  Badge as BadgeIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const AddUserModal = ({
  open,
  onClose,
  userType = 'all',
  onSubmit,
  fieldErrors = {},
}) => {
  // Initial form state - Updated theo backend requirements
  const initialFormData = {
    role: userType !== 'all' ? userType : '',
    fullName: '', // Required
    email: '', // Required
    gender: '', // Required
    username: '', // Required (4-50 chars)
    password: '', // Required (6-100 chars + pattern)
    birthDay: '', // Optional (LocalDate)
    phone: '', // Required - Updated from Optional to Required
    address: '', // Optional
  };

  // State cho form data
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localFieldErrors, setLocalFieldErrors] = useState({});

  // Reset form khi modal mở
  useEffect(() => {
    if (open) {
      setFormData({
        ...initialFormData,
        role: userType !== 'all' ? userType : '',
      });
      setLocalFieldErrors({});
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalFieldErrors((prev) => ({ ...prev, [name]: undefined })); // clear lỗi khi nhập lại
  };

  // Password visibility toggle
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Validate password
  const validatePassword = (password) => {
    // Validation based on backend requirements:
    // @Size(min = 6, max = 100)
    // @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$")
    // @Size(min = 6, max = 100)
    // @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$")
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@#$%^&+=]/.test(password);
    const isValidLength = password.length >= 6 && password.length <= 100;

    return {
      isValid:
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar &&
        isValidLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValidLength,
    };
  };

  // Calculate password strength score
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    const validation = validatePassword(password);
    let score = 0;

    if (validation.isValidLength) score += 1;
    if (validation.hasUpperCase) score += 1;
    if (validation.hasLowerCase) score += 1;
    if (validation.hasNumbers) score += 1;
    if (validation.hasSpecialChar) score += 1;

    // Convert to percentage
    return (score / 5) * 100;
  };

  // Get password strength label and color
  const getPasswordStrengthInfo = (password) => {
    const strength = calculatePasswordStrength(password);

    if (strength === 0) return { label: 'Chưa nhập', color: '#e0e0e0' };
    if (strength <= 20) return { label: 'Rất yếu', color: '#f44336' };
    if (strength <= 40) return { label: 'Yếu', color: '#ff9800' };
    if (strength <= 60) return { label: 'Trung bình', color: '#ffeb3b' };
    if (strength <= 80) return { label: 'Khá mạnh', color: '#2196f3' };
    return { label: 'Mạnh', color: '#4caf50' };
  };
  // Handle form submit
  const handleSubmit = async () => {
    // ✅ Cập nhật required fields validation
    const requiredFields = [
      'role',
      'fullName',
      'email',
      'gender',
      'username',
      'password',
      'phone', // Thêm phone là bắt buộc
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ''
    );

    if (missingFields.length > 0) {
      const newFieldErrors = {};
      missingFields.forEach((field) => {
        switch (field) {
          case 'role':
            newFieldErrors.role = 'Vui lòng chọn vai trò';
            break;
          case 'fullName':
            newFieldErrors.fullName = 'Vui lòng nhập họ và tên';
            break;
          case 'email':
            newFieldErrors.email = 'Vui lòng nhập email';
            break;
          case 'gender':
            newFieldErrors.gender = 'Vui lòng chọn giới tính';
            break;
          case 'username':
            newFieldErrors.username = 'Vui lòng nhập tên đăng nhập';
            break;
          case 'password':
            newFieldErrors.password = 'Vui lòng nhập mật khẩu';
            break;
          case 'phone':
            newFieldErrors.phone = 'Vui lòng nhập số điện thoại';
            break;
          default:
            newFieldErrors[field] = 'Vui lòng nhập thông tin';
        }
      });
      setLocalFieldErrors(newFieldErrors);
      toast.warning(
        'Thông tin thiếu',
        'Vui lòng điền đầy đủ các trường bắt buộc'
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(
        'Email không hợp lệ',
        'Vui lòng nhập địa chỉ email đúng định dạng!'
      );
      return;
    }

    // Gender validation
    const genderRegex = /^(Nam|Nữ|Khác|MALE|FEMALE|OTHER)$/;
    if (!genderRegex.test(formData.gender)) {
      toast.error(
        'Giới tính không hợp lệ',
        'Giới tính phải là: Nam, Nữ, Khác, MALE, FEMALE, hoặc OTHER'
      );
      return;
    } // Username validation (optional but must be 4-50 characters if provided)
    if (
      formData.username &&
      formData.username.trim() !== '' &&
      (formData.username.length < 4 || formData.username.length > 50)
    ) {
      toast.error('Username không hợp lệ', 'Username phải có từ 4-50 ký tự!');
      return;
    } // Password validation (optional but must meet requirements if provided)
    if (formData.password && formData.password.trim() !== '') {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        let errorMessage = 'Mật khẩu phải có:\n';
        if (!passwordValidation.isValidLength)
          errorMessage += '- 6-100 ký tự\n';
        if (!passwordValidation.hasUpperCase)
          errorMessage += '- Ít nhất 1 chữ hoa\n';
        if (!passwordValidation.hasLowerCase)
          errorMessage += '- Ít nhất 1 chữ thường\n';
        if (!passwordValidation.hasNumbers) errorMessage += '- Ít nhất 1 số\n';
        if (!passwordValidation.hasSpecialChar)
          errorMessage += '- Ít nhất 1 ký tự đặc biệt (@#$%^&+=)';

        toast.error('Mật khẩu không hợp lệ', errorMessage);
        return;
      }
    } // Phone validation (optional but must be valid if provided)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (
      formData.phone &&
      formData.phone.trim() !== '' &&
      !phoneRegex.test(formData.phone)
    ) {
      toast.error(
        'Số điện thoại không hợp lệ',
        'Số điện thoại phải có 10-11 chữ số!'
      );
      return;
    }

    // ✅ Tất cả validation pass - trả data về parent component
    console.log('Form validation passed, sending data to parent:', formData);

    // Prepare data for API
    const apiData = {
      ...formData,
      birthDay: formData.birthDay || null, // Send null if empty
    };

    // ✅ Gọi callback function với data đã validate
    if (onSubmit) {
      onSubmit(apiData, formData.role);
    }

    // KHÔNG đóng modal ở đây, chỉ đóng khi thành công (cha tự đóng)
  };
  // Role options with color & icon mapping - đã loại bỏ ADMIN
  const roleOptions = [
    {
      value: 'STAFF',
      label: 'Nhân viên',
      color: '#1976D2',
      bgColor: '#E3F2FD',
    },
    {
      value: 'CUSTOMER',
      label: 'Khách hàng',
      color: '#388E3C',
      bgColor: '#E8F5E9',
    },
    {
      value: 'CONSULTANT',
      label: 'Tư vấn viên',
      color: '#F57C00',
      bgColor: '#FFF3E0',
    },
  ];

  // Find selected role details
  const selectedRole =
    roleOptions.find((role) => role.value === formData.role) || {};

  // Password strength info
  const passwordStrength = getPasswordStrengthInfo(formData.password);
  const passwordValidation = validatePassword(formData.password);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Updated to medical gradient
          color: 'white',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonIcon fontSize="large" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Thêm người dùng mới
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: 'white' }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: '#4A90E2', // Updated to match gradient theme
              }}
            >
              <BadgeIcon sx={{ mr: 1 }} />
              Thông tin cơ bản
            </Typography>

            {/* Role Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel required id="role-label">
                Vai trò
              </InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Vai trò *"
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: role.color,
                        }}
                      />
                      {role.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Full Name */}
            <TextField
              required
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              error={!!localFieldErrors.fullName || !!fieldErrors.fullName}
              helperText={localFieldErrors.fullName || fieldErrors.fullName}
            />

            {/* Email */}
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              error={!!localFieldErrors.email || !!fieldErrors.email}
              helperText={localFieldErrors.email || fieldErrors.email}
            />

            {/* Gender */}
            <FormControl required fullWidth sx={{ mb: 2 }}>
              <InputLabel id="gender-label">Giới tính</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                label="Giới tính *"
              >
                <MenuItem value="MALE">👨 Nam</MenuItem>
                <MenuItem value="FEMALE">👩 Nữ</MenuItem>
                <MenuItem value="Khác">🏳️‍⚧️ Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: '#4A90E2', // Updated to match gradient theme
              }}
            >
              <LockIcon sx={{ mr: 1 }} />
              Thông tin đăng nhập
            </Typography>{' '}
            {/* Username */}
            <TextField
              fullWidth
              label="Tên đăng nhập *"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText={`${formData.username.length}/50 ký tự (4-50 ký tự)`}
              sx={{ mb: 2 }}
            />{' '}
            {/* Password */}
            <TextField
              fullWidth
              label="Mật khẩu *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={`${formData.password.length}/100 ký tự (6-100 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)`}
              sx={{ mb: 1 }}
            />
            {/* Password Strength Meter */}
            {formData.password && (
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption">Độ mạnh mật khẩu</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: passwordStrength.color,
                      fontWeight: 600,
                    }}
                  >
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={calculatePasswordStrength(formData.password)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: passwordStrength.color,
                    },
                  }}
                />

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Chip
                      label="6-100 ký tự"
                      size="small"
                      color={
                        passwordValidation.isValidLength ? 'success' : 'default'
                      }
                      variant={
                        passwordValidation.isValidLength ? 'filled' : 'outlined'
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label="Chữ hoa"
                      size="small"
                      color={
                        passwordValidation.hasUpperCase ? 'success' : 'default'
                      }
                      variant={
                        passwordValidation.hasUpperCase ? 'filled' : 'outlined'
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label="Chữ thường"
                      size="small"
                      color={
                        passwordValidation.hasLowerCase ? 'success' : 'default'
                      }
                      variant={
                        passwordValidation.hasLowerCase ? 'filled' : 'outlined'
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label="Số"
                      size="small"
                      color={
                        passwordValidation.hasNumbers ? 'success' : 'default'
                      }
                      variant={
                        passwordValidation.hasNumbers ? 'filled' : 'outlined'
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Chip
                      label="Ký tự đặc biệt (@#$%^&+=)"
                      size="small"
                      color={
                        passwordValidation.hasSpecialChar
                          ? 'success'
                          : 'default'
                      }
                      variant={
                        passwordValidation.hasSpecialChar
                          ? 'filled'
                          : 'outlined'
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Bottom Section - Additional Info */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: '#4A90E2', // Updated to match gradient theme
              }}
            >
              <HomeIcon sx={{ mr: 1 }} />
              Thông tin bổ sung
            </Typography>

            <Grid container spacing={2}>
              <Grid item size={6} md={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="birthDay"
                  type="date"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item size={6} md={6}>
                {' '}
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  error={!!localFieldErrors.phone || !!fieldErrors.phone}
                  helperText={
                    localFieldErrors.phone ||
                    fieldErrors.phone ||
                    'Bắt buộc, 10-11 chữ số'
                  }
                />
              </Grid>
              <Grid item size={12} md={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        {' '}
        {/* Slightly updated background */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box>
            {formData.role && (
              <Chip
                label={selectedRole.label}
                sx={{
                  bgcolor: selectedRole.bgColor,
                  color: selectedRole.color,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                borderColor: '#4A90E2', // Updated to match gradient theme
                color: '#4A90E2', // Updated to match gradient theme
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<AddIcon />}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Updated to medical gradient
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #357ABD, #159B7F)', // Slightly darker gradient for hover
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.35)',
                },
              }}
            >
              Thêm người dùng
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;

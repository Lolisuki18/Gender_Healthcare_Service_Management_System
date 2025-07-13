/**
 * ==================================================================
 * EDIT USER MODAL COMPONENT - VERSION 4.0 (BACKEND COMPLIANT)
 * ==================================================================
 */

import React, { useState, useEffect } from 'react';
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
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CompareArrows as CompareIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
// Import dateUtils for consistent date formatting
import { formatDateDisplay } from '../../utils/dateUtils.js';
import { confirmDialog } from '../../utils/confirmDialog.js';
import { toast } from 'react-toastify';

const EditUserModal = ({ open, onClose, user, onSubmit }) => {
  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================

  /**
   * ✅ Updated form data với TẤT CẢ fields theo backend requirements
   */
  const [formData, setFormData] = useState({
    fullName: '',
    birthDay: '',
    phone: '',
    email: '',
    password: '', // Để trống nếu không muốn đổi
    address: '',
    gender: '',
    isActive: true,
    role: '',
  });

  /**
   * Original data để so sánh thay đổi
   */
  const [originalData, setOriginalData] = useState({});

  /**
   * Validation errors
   */
  const [errors, setErrors] = useState({});

  /**
   * ✅ Unified confirmation dialog state
   */
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ====================================================================
  // EFFECTS & DATA INITIALIZATION
  // ====================================================================

  /**
   * Effect: Khởi tạo dữ liệu khi user hoặc modal thay đổi
   */
  useEffect(() => {
    if (user && open) {
      // ✅ Xử lý role đặc biệt - đảm bảo lấy đúng giá trị role
      const userRole = user.role || user.Role || '';

      console.log('🔍 User object received:', user);
      console.log('🔍 Original role from user:', user.role);
      console.log('🔍 Processed role:', userRole);

      const userData = {
        fullName: user.fullName || user.full_name || '',
        birthDay: user.birthDay || user.birth_day || '',
        phone: user.phone || '',
        email: user.email || '',
        password: '', // Luôn để trống để giữ password cũ
        address: user.address || '',
        gender: user.gender || '',
        isActive:
          user.isActive !== undefined
            ? user.isActive
            : user.is_active !== undefined
              ? user.is_active
              : true,
        role: userRole, // ✅ Sử dụng role đã được xử lý
      };

      console.log('🔍 Form data initialized:', userData);

      setFormData(userData);
      setOriginalData(userData);
      setErrors({});
    }
  }, [user, open]);

  // ====================================================================
  // VALIDATION FUNCTIONS
  // ====================================================================

  /**
   * ✅ Validate individual fields theo backend requirements - FIX TRIM ERROR
   */
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    // ✅ Convert value to string trước khi validate để tránh lỗi trim
    const stringValue =
      value !== null && value !== undefined ? String(value) : '';

    switch (name) {
      case 'fullName':
        if (!stringValue || stringValue.trim() === '') {
          newErrors.fullName = 'Full name is required';
        } else if (stringValue.length > 100) {
          newErrors.fullName = 'Full name must not exceed 100 characters';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        if (!stringValue || stringValue.trim() === '') {
          newErrors.email = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(stringValue)) {
            newErrors.email = 'Invalid email format';
          } else {
            delete newErrors.email;
          }
        }
        break;

      case 'phone':
        if (stringValue && stringValue.trim() !== '') {
          const phoneRegex = /^[0-9]{10,11}$/;
          if (!phoneRegex.test(stringValue)) {
            newErrors.phone = 'Phone number must be between 10 and 11 digits';
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone;
        }
        break;

      case 'password':
        if (stringValue && stringValue.trim() !== '') {
          const passwordRegex =
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,100}$/;
          if (!passwordRegex.test(stringValue)) {
            newErrors.password =
              'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and be 6-100 characters long';
          } else {
            delete newErrors.password;
          }
        } else {
          delete newErrors.password;
        }
        break;

      case 'address':
        if (stringValue && stringValue.length > 255) {
          newErrors.address = 'Address must not exceed 255 characters';
        } else {
          delete newErrors.address;
        }
        break;

      case 'gender':
        if (!stringValue || stringValue.trim() === '') {
          newErrors.gender = 'Gender is required';
        } else {
          delete newErrors.gender;
        }
        break;

      case 'birthDay':
        if (stringValue && stringValue.trim() !== '') {
          const birthDate = new Date(stringValue);
          const today = new Date();
          if (birthDate >= today) {
            newErrors.birthDay = 'Birth day must be in the past';
          } else {
            delete newErrors.birthDay;
          }
        } else {
          delete newErrors.birthDay;
        }
        break;

      case 'role':
        if (!stringValue || stringValue.trim() === '') {
          newErrors.role = 'Role is required';
        } else {
          delete newErrors.role;
        }
        break;

      case 'isActive':
        // ✅ Boolean field - không cần validate trim, chỉ validate type
        if (value !== true && value !== false) {
          newErrors.isActive = 'Active status is required';
        } else {
          delete newErrors.isActive;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * ✅ Validate toàn bộ form - FIX VALIDATE ALL FIELDS
   */
  const validateForm = () => {
    let isValid = true;

    // ✅ Validate từng field một cách an toàn
    const fieldsToValidate = [
      'fullName',
      'email',
      'phone',
      'password',
      'address',
      'gender',
      'birthDay',
      'role',
      'isActive',
    ];

    fieldsToValidate.forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      if (!validateField(fieldName, fieldValue)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================

  /**
   * ✅ Chỉ lấy những field đã thay đổi
   */
  const getChangedFields = () => {
    const changedFields = {};
    const changes = [];

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        // Đặc biệt xử lý password - chỉ gửi khi có giá trị mới
        if (key === 'password') {
          if (formData[key] && formData[key].trim() !== '') {
            changedFields[key] = formData[key];
            changes.push({
              field: key,
              label: 'Mật khẩu',
              oldValue: '********',
              newValue: '******** (mới)',
              category: 'security',
            });
          }
        } else {
          changedFields[key] = formData[key];
          changes.push({
            field: key,
            label: getFieldLabel(key),
            oldValue: formatDisplayValue(key, originalData[key]),
            newValue: formatDisplayValue(key, formData[key]),
            category: getFieldCategory(key),
          });
        }
      }
    });

    return { changedFields, changes };
  };

  /**
   * Get field label for display
   */
  const getFieldLabel = (field) => {
    const labels = {
      fullName: 'Họ và tên',
      birthDay: 'Ngày sinh',
      phone: 'Số điện thoại',
      email: 'Email',
      password: 'Mật khẩu',
      address: 'Địa chỉ',
      gender: 'Giới tính',
      isActive: 'Trạng thái',
      role: 'Vai trò',
    };
    return labels[field] || field;
  };

  /**
   * Format value for display
   */
  const formatDisplayValue = (field, value) => {
    if (field === 'isActive') {
      return value ? 'Hoạt động' : 'Tạm khóa';
    }
    if (field === 'role') {
      return getRoleDisplayName(value);
    }
    if (field === 'gender') {
      const genderLabels = {
        MALE: 'Nam',
        FEMALE: 'Nữ',
        OTHER: 'Khác',
      };
      return genderLabels[value] || value;
    }
    if (field === 'birthDay' && value) {
      return formatDateDisplay(value);
    }
    return value || '(Trống)';
  };

  /**
   * Get field category
   */
  const getFieldCategory = (field) => {
    if (
      ['fullName', 'birthDay', 'phone', 'email', 'address', 'gender'].includes(
        field
      )
    ) {
      return 'basic';
    }
    if (['role', 'isActive'].includes(field)) {
      return 'role';
    }
    if (field === 'password') {
      return 'security';
    }
    return 'other';
  };

  /**
   * Get role display name
   */
  const getRoleDisplayName = (role) => {
    const roleNames = {
      STAFF: 'Nhân viên',
      CUSTOMER: 'Khách hàng',
      CONSULTANT: 'Tư vấn viên',
    };
    return roleNames[role] || role;
  };

  // ====================================================================
  // EVENT HANDLERS
  // ====================================================================

  /**
   * ✅ Unified input change handler với validation
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'isActive') {
      processedValue = value === 'true';
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Validate field on change
    validateField(name, processedValue);
  };

  /**
   * ✅ Unified submit handler - BỎ LUÔN THÔNG BÁO KHI KHÔNG CÓ THAY ĐỔI
   */
  const handleSubmit = async () => {
    // ✅ Kiểm tra role required trước khi validate
    if (!formData.role || formData.role.trim() === '') {
      toast.warning(
        'Thiếu thông tin bắt buộc',
        'Vui lòng chọn vai trò cho người dùng!'
      );
      return;
    }

    if (!validateForm()) {
      toast.error('Lỗi validation', 'Vui lòng kiểm tra lại các trường bị lỗi!');
      return;
    }

    const { changedFields, changes } = getChangedFields();

    // ✅ Debug log để kiểm tra
    console.log('🔍 Submit check:', {
      formData,
      originalData,
      changedFields,
      changes,
    });

    // ✅ Submit luôn không cần thông báo gì cả
    setShowConfirmation(true);
  };

  /**
   * ✅ Confirm changes - GỬI TOÀN BỘ DỮ LIỆU VỚI DEBUG NETWORK REQUEST
   */
  const handleConfirmChanges = () => {
    const { changedFields, changes } = getChangedFields();

    if (onSubmit) {
      // ✅ Luôn gửi toàn bộ dữ liệu form, không chỉ những field thay đổi
      const requestData = {
        id: user.id,
        fullName: formData.fullName.trim(),
        birthDay: formData.birthDay,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        gender: formData.gender,
        isActive: formData.isActive,
        role: formData.role,
      };

      // ✅ XỬ LÝ PASSWORD CẨN THẬN VỚI TRIM VÀ LOG CHI TIẾT
      const passwordValue = formData.password || '';
      const trimmedPassword = passwordValue.trim();

      console.log('🔍 PASSWORD DEBUG:');
      console.log('  - Original password:', JSON.stringify(passwordValue));
      console.log('  - Trimmed password:', JSON.stringify(trimmedPassword));
      console.log('  - Password length:', trimmedPassword.length);
      console.log('  - Has password:', trimmedPassword.length > 0);

      if (trimmedPassword.length > 0) {
        requestData.password = trimmedPassword;
        console.log('✅ Password INCLUDED in request');
      } else {
        console.log('❌ Password EXCLUDED from request');
      }

      // ✅ THÊM DEBUG CHO BACKEND API FORMAT
      console.log('🔍 BACKEND REQUEST FORMAT CHECK:');
      console.log('  - Request data keys:', Object.keys(requestData));
      console.log('  - Password field exists:', 'password' in requestData);
      console.log('  - Password value type:', typeof requestData.password);

      // ✅ KIỂM TRA FIELD MAPPING BACKEND
      console.log('🔍 FIELD MAPPING CHECK:');
      console.log('  - fullName:', requestData.fullName);
      console.log('  - email:', requestData.email);
      console.log(
        '  - isActive:',
        requestData.isActive,
        typeof requestData.isActive
      );
      if (requestData.password) {
        console.log(
          '  - password:',
          '[HIDDEN]',
          'length:',
          requestData.password.length
        );
      }

      console.log('🚀 FINAL REQUEST DATA:');
      console.log(JSON.stringify(requestData, null, 2));
      console.log('🚀 Changed fields (for reference):', changedFields);

      // ✅ INTERCEPT VÀ LOG API CALL
      console.log('🌐 CALLING onSubmit with data...');

      onSubmit(requestData);
    }
    setShowConfirmation(false);
    onClose();
  };

  /**
   * ✅ Handle close - THAY THẾ WINDOW.CONFIRM
   */
  const handleClose = async () => {
    const { changes } = getChangedFields();

    if (changes.length > 0) {
      const confirmLeave = await confirmDialog.warning(
        'Bạn có thay đổi chưa lưu. Nếu thoát bây giờ, tất cả thay đổi sẽ bị mất.',
        {
          title: '⚠️ Thay đổi chưa lưu',
          confirmText: 'Thoát không lưu',
          cancelText: 'Tiếp tục chỉnh sửa',
        }
      );
      if (!confirmLeave) return;
    }

    setShowConfirmation(false);
    onClose();
  };

  // ====================================================================
  // RENDER GUARDS
  // ====================================================================

  if (!user) return null;

  const { changes } = getChangedFields();

  // ====================================================================
  // RENDER MAIN COMPONENT
  // ====================================================================

  return (
    <>
      {/* ============================================================== */}
      {/* MAIN EDIT DIALOG */}
      {/* ============================================================== */}
      <Dialog
        open={open && !showConfirmation}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background:
              'linear-gradient(180deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)',
            minHeight: '70vh',
            maxHeight: '90vh',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2.5,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Chỉnh sửa thông tin người dùng
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </DialogTitle>

        {/* User Info Banner */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background:
              'linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))',
            borderBottom: '1px solid rgba(74, 144, 226, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
            Đang chỉnh sửa: <strong>{user?.fullName || user?.username}</strong>
            <Chip
              label={getRoleDisplayName(user?.role)}
              size="small"
              sx={{
                ml: 2,
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                color: '#4A90E2',
                fontWeight: 600,
              }}
            />
          </Typography>
        </Box>

        {/* Dialog Content */}
        <DialogContent sx={{ p: 0, backgroundColor: 'transparent' }}>
          <Box sx={{ p: 3 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(74, 144, 226, 0.08)',
                border: '1px solid rgba(255,255,255,0.5)',
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,252,255,0.9))',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* ====================================================== */}
                {/* THÔNG TIN CƠ BẢN */}
                {/* ====================================================== */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#2D3748',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  👤 Thông tin cơ bản
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* ✅ Full Name - REQUIRED */}
                  <Grid item size={12} xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        },
                      }}
                    />
                  </Grid>

                  {/* ✅ Email - REQUIRED */}
                  <Grid item size={6} xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        },
                      }}
                    />
                  </Grid>

                  {/* ✅ Phone - Optional */}
                  <Grid item size={6} xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={!!errors.phone}
                      helperText={errors.phone || '10-11 chữ số'}
                      variant="outlined"
                      placeholder="VD: 0901234567"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        },
                      }}
                    />
                  </Grid>

                  {/* ✅ Birth Day - Optional */}
                  <Grid item size={6} xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      name="birthDay"
                      type="date"
                      value={formData.birthDay}
                      onChange={handleInputChange}
                      error={!!errors.birthDay}
                      helperText={errors.birthDay}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        },
                      }}
                    />
                  </Grid>

                  {/* ✅ Gender - REQUIRED */}
                  <Grid size={6} item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!errors.gender}
                    >
                      <InputLabel>Giới tính *</InputLabel>
                      <Select
                        value={formData.gender}
                        label="Giới tính *"
                        name="gender"
                        onChange={handleInputChange}
                        sx={{
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        }}
                      >
                        <MenuItem value="Nam">👨 Nam</MenuItem>
                        <MenuItem value="Nữ">👩 Nữ</MenuItem>
                        <MenuItem value="Khac">🏳️‍⚧️ Khác</MenuItem>
                      </Select>
                      {errors.gender && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'error.main', mt: 0.5, ml: 2 }}
                        >
                          {errors.gender}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  {/* ✅ Address - Optional */}
                  <Grid size={12} item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={!!errors.address}
                      helperText={errors.address}
                      variant="outlined"
                      multiline
                      rows={2}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider
                  sx={{ my: 4, borderColor: 'rgba(74, 144, 226, 0.2)' }}
                />

                {/* ====================================================== */}
                {/* BẢO MẬT */}
                {/* ====================================================== */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#2D3748',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  🔒 Bảo mật
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* ✅ Password - Optional */}
                  <Grid size={12} item xs={12}>
                    <TextField
                      fullWidth
                      label="Mật khẩu mới (để trống nếu không đổi)"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={!!errors.password}
                      helperText={
                        errors.password ||
                        'Ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,252,255,0.8)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider
                  sx={{ my: 4, borderColor: 'rgba(74, 144, 226, 0.2)' }}
                />

                {/* ====================================================== */}
                {/* VAI TRÒ & TRẠNG THÁI */}
                {/* ====================================================== */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#2D3748',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  🔐 Vai trò & Trạng thái
                </Typography>

                {/* Warning Notice */}
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FFF3CD, #FCF4A3)',
                    border: '1px solid #F59E0B',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#92400E',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 18 }} />
                    <strong>Cảnh báo:</strong> Thay đổi vai trò hoặc trạng thái
                    sẽ ảnh hưởng đến quyền truy cập của tài khoản này
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* ✅ Role - REQUIRED */}
                  <Grid size={6} item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!errors.role}
                    >
                      <InputLabel>Vai trò *</InputLabel>
                      <Select
                        value={formData.role}
                        label="Vai trò *"
                        name="role"
                        onChange={handleInputChange}
                        sx={{
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,255,248,0.8)',
                        }}
                      >
                        <MenuItem value="STAFF">👔 Nhân viên</MenuItem>
                        <MenuItem value="CONSULTANT">🩺 Tư vấn viên</MenuItem>
                        <MenuItem value="CUSTOMER">👤 Khách hàng</MenuItem>
                      </Select>
                      {errors.role && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'error.main', mt: 0.5, ml: 2 }}
                        >
                          {errors.role}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* ✅ Status - REQUIRED */}
                  <Grid size={6} item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Trạng thái *</InputLabel>
                      <Select
                        value={formData.isActive.toString()}
                        label="Trạng thái *"
                        name="isActive"
                        onChange={handleInputChange}
                        sx={{
                          borderRadius: 3,
                          backgroundColor: 'rgba(248,255,248,0.8)',
                        }}
                      >
                        <MenuItem value="true">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                boxShadow: '0 0 12px rgba(76, 175, 80, 0.5)',
                              }}
                            />
                            <Typography
                              sx={{ color: '#2e7d32', fontWeight: 600 }}
                            >
                              Hoạt động
                            </Typography>
                          </Box>
                        </MenuItem>

                        <MenuItem value="false">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: '#f44336',
                                boxShadow: '0 0 12px rgba(244, 67, 54, 0.5)',
                              }}
                            />
                            <Typography
                              sx={{ color: '#d32f2f', fontWeight: 600 }}
                            >
                              Tạm khóa
                            </Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions
          sx={{
            p: 4,
            background:
              'linear-gradient(180deg, rgba(248,252,255,0.95), rgba(240,248,255,0.9))',
            borderTop: '1px solid rgba(74, 144, 226, 0.1)',
            boxShadow: '0 -4px 20px rgba(74, 144, 226, 0.05)',
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#90a4ae',
              color: '#546e7a',
              minWidth: 140,
              height: 52,
              borderRadius: 3,
              px: 4,
              fontSize: 16,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.05)',
                color: '#4A90E2',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Hủy bỏ
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disabled={Object.keys(errors).length > 0}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              minWidth: 220,
              height: 52,
              borderRadius: 3,
              px: 4,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              '&:hover': {
                background: 'linear-gradient(45deg, #357ABD, #17A2B8)',
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 40px rgba(74, 144, 226, 0.4)',
              },
              '&:disabled': {
                background: '#ccc',
                transform: 'none',
                boxShadow: 'none',
              },
              transition: 'all 0.3s ease',
            }}
          >
            💾 Cập nhật thông tin
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* UNIFIED CONFIRMATION DIALOG */}
      {/* ============================================================== */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3,
            fontWeight: 700,
          }}
        >
          <PersonIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Xác nhận cập nhật thông tin
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: '#2D3748', fontWeight: 600 }}
          >
            Thông tin của: <strong>{user?.fullName || user?.username}</strong>
          </Typography>

          {/* ✅ Hiển thị thông báo khác nhau tùy theo có thay đổi hay không */}
          {changes.length > 0 ? (
            <>
              <Typography variant="body1" sx={{ mb: 3, color: '#4A5568' }}>
                Những thay đổi sau sẽ được cập nhật:
              </Typography>

              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(74, 144, 226, 0.15)',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <List>
                    {changes.map((change, index) => (
                      <ListItem
                        key={change.field}
                        sx={{
                          borderBottom:
                            index < changes.length - 1
                              ? '1px solid rgba(74, 144, 226, 0.1)'
                              : 'none',
                          py: 2,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, color: '#2D3748', mb: 1 }}
                            >
                              {change.category === 'basic'
                                ? '📝'
                                : change.category === 'security'
                                  ? '🔒'
                                  : '🔐'}{' '}
                              {change.label}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Chip
                                label={change.oldValue}
                                size="small"
                                sx={{
                                  backgroundColor: '#FEF2F2',
                                  color: '#DC2626',
                                  fontWeight: 500,
                                }}
                              />
                              <CompareIcon
                                sx={{ color: '#4A90E2', fontSize: 20 }}
                              />
                              <Chip
                                label={change.newValue}
                                size="small"
                                sx={{
                                  backgroundColor: '#ECFDF5',
                                  color: '#059669',
                                  fontWeight: 500,
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 3,
                px: 2,
                borderRadius: 3,
                background: 'rgba(74, 144, 226, 0.05)',
                border: '1px solid rgba(74, 144, 226, 0.15)',
              }}
            >
              <Typography variant="body1" sx={{ color: '#4A5568', mb: 1 }}>
                📋 Không có thay đổi nào được phát hiện
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096' }}>
                Toàn bộ thông tin hiện tại sẽ được gửi lại để đồng bộ dữ liệu
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            size="large"
            sx={{ minWidth: 140, height: 52, borderRadius: 3 }}
          >
            ❌ Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmChanges}
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #45A049)',
              minWidth: 200,
              height: 52,
              borderRadius: 3,
            }}
          >
            <CheckIcon sx={{ mr: 1 }} />
            {changes.length > 0 ? 'Xác nhận cập nhật' : 'Gửi lại thông tin'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditUserModal;

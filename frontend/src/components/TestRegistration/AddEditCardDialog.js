import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const AddEditCardDialog = ({ 
  open, 
  onClose, 
  onSave, 
  cardData = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardHolderName: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [showCvc, setShowCvc] = useState(false);

  // Reset form khi dialog đóng/mở hoặc cardData thay đổi
  useEffect(() => {
    if (open) {
      if (cardData) {
        // Edit mode - điền thông tin có sẵn
        setFormData({
          cardNumber: cardData.cardNumber || '',
          expiryMonth: cardData.expiryMonth || '',
          expiryYear: cardData.expiryYear || '',
          cvc: '', // Không hiển thị CVC cũ vì lý do bảo mật
          cardHolderName: cardData.cardHolderName || '',
          isDefault: cardData.isDefault || false
        });
      } else {
        // Add mode - reset form
        setFormData({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvc: '',
          cardHolderName: '',
          isDefault: false
        });
      }
      setErrors({});
      setShowCvc(false);
    }
  }, [open, cardData]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Xử lý formatting cho từng field
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      // Chỉ cho phép số và giới hạn 16 ký tự
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (field === 'expiryMonth') {
      // Chỉ cho phép số, giới hạn 2 ký tự, từ 01-12
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
      if (formattedValue && (parseInt(formattedValue) < 1 || parseInt(formattedValue) > 12)) {
        return; // Không cập nhật nếu không hợp lệ
      }
    } else if (field === 'expiryYear') {
      // Chỉ cho phép số, giới hạn 4 ký tự, từ năm hiện tại
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      const currentYear = new Date().getFullYear();
      if (formattedValue.length === 4 && parseInt(formattedValue) < currentYear) {
        return; // Không cập nhật nếu năm nhỏ hơn năm hiện tại
      }
    } else if (field === 'cvc') {
      // Chỉ cho phép số, giới hạn 3-4 ký tự
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'cardHolderName') {
      // Chỉ cho phép chữ cái và khoảng trắng, viết hoa
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Xóa lỗi khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate card number (16 digits)
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Vui lòng nhập số thẻ';
    } else if (formData.cardNumber.length !== 16) {
      newErrors.cardNumber = 'Số thẻ phải có 16 chữ số';
    } else if (!isValidCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Số thẻ không hợp lệ';
    }

    // Validate expiry month
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Vui lòng nhập tháng hết hạn';
    } else if (formData.expiryMonth.length !== 2) {
      newErrors.expiryMonth = 'Tháng phải có 2 chữ số';
    }

    // Validate expiry year
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Vui lòng nhập năm hết hạn';
    } else if (formData.expiryYear.length !== 4) {
      newErrors.expiryYear = 'Năm phải có 4 chữ số';
    } else {
      // Kiểm tra thẻ có hết hạn không
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() trả về 0-11
      const expiryYear = parseInt(formData.expiryYear);
      const expiryMonth = parseInt(formData.expiryMonth);

      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        newErrors.expiryYear = 'Thẻ đã hết hạn';
      }
    }

    // Validate CVC
    if (!formData.cvc) {
      newErrors.cvc = 'Vui lòng nhập mã CVC';
    } else if (formData.cvc.length < 3 || formData.cvc.length > 4) {
      newErrors.cvc = 'Mã CVC phải có 3-4 chữ số';
    }

    // Validate cardholder name
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Vui lòng nhập tên chủ thẻ';
    } else if (formData.cardHolderName.trim().length < 2) {
      newErrors.cardHolderName = 'Tên chủ thẻ quá ngắn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Thuật toán Luhn để validate số thẻ
  const isValidCardNumber = (cardNumber) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const handleSave = () => {
    console.log('handleSave được gọi');
    console.log('formData:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed');
      toast.error('Vui lòng kiểm tra lại thông tin thẻ');
      return;
    }

    console.log('Validation passed, calling onSave');
    console.log('onSave function:', onSave);
    onSave(formData);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const formatCardNumber = (value) => {
    // Format hiển thị: 1234 5678 9012 3456
    return value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const getCardType = (cardNumber) => {
    if (!cardNumber) return '';
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'MasterCard';
    return 'Unknown';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {cardData ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {cardData && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Vì lý do bảo mật, bạn cần nhập lại mã CVC ngay cả khi chỉnh sửa thông tin thẻ.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Card Number */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số thẻ"
              value={formatCardNumber(formData.cardNumber)}
              onChange={handleInputChange('cardNumber')}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber || `${formData.cardNumber.length}/16 chữ số`}
              placeholder="1234 5678 9012 3456"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon />
                  </InputAdornment>
                ),
                endAdornment: formData.cardNumber && (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="primary">
                      {getCardType(formData.cardNumber)}
                    </Typography>
                  </InputAdornment>
                )
              }}
              inputProps={{ maxLength: 19 }} // 16 digits + 3 spaces
            />
          </Grid>

          {/* Expiry Date */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tháng hết hạn"
              value={formData.expiryMonth}
              onChange={handleInputChange('expiryMonth')}
              error={!!errors.expiryMonth}
              helperText={errors.expiryMonth}
              placeholder="MM"
              inputProps={{ maxLength: 2 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Năm hết hạn"
              value={formData.expiryYear}
              onChange={handleInputChange('expiryYear')}
              error={!!errors.expiryYear}
              helperText={errors.expiryYear}
              placeholder="YYYY"
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          {/* CVC */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mã CVC"
              type={showCvc ? 'text' : 'password'}
              value={formData.cvc}
              onChange={handleInputChange('cvc')}
              error={!!errors.cvc}
              helperText={errors.cvc || 'Mã 3-4 chữ số ở mặt sau thẻ'}
              placeholder="123"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCvc(!showCvc)}
                      edge="end"
                    >
                      {showCvc ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          {/* Cardholder Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên chủ thẻ"
              value={formData.cardHolderName}
              onChange={handleInputChange('cardHolderName')}
              error={!!errors.cardHolderName}
              helperText={errors.cardHolderName || 'Tên như trên thẻ (chỉ chữ cái)'}
              placeholder="NGUYEN VAN A"
              inputProps={{ maxLength: 50 }}
            />
          </Grid>

          {/* Set as Default */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isDefault: e.target.checked
                  }))}
                />
              }
              label="Đặt làm thẻ mặc định"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? 'Đang lưu...' : (cardData ? 'Cập nhật' : 'Thêm thẻ')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditCardDialog;
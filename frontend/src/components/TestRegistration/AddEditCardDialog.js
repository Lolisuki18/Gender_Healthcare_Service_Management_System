import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  createPaymentInfo,
  updatePaymentInfo,
  validateCardInfo,
} from '@/services/paymentInfoService';

const AddEditCardDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  cardToEdit = null, // null nếu thêm mới, object nếu sửa
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'VISA',
    nickname: '',
    isDefault: false,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form khi dialog mở/đóng hoặc khi cardToEdit thay đổi
  useEffect(() => {
    if (open) {
      if (cardToEdit) {
        // Sửa thẻ
        setFormData({
          cardNumber: cardToEdit.cardNumber || '',
          cardHolderName: cardToEdit.cardHolderName || '',
          expiryMonth: cardToEdit.expiryMonth || '',
          expiryYear: cardToEdit.expiryYear || '',
          cvv: cardToEdit.cvv || '',
          cardType: cardToEdit.cardType || 'VISA',
          nickname: cardToEdit.nickname || '',
          isDefault: cardToEdit.isDefault || false,
        });
      } else {
        // Thêm thẻ mới
        setFormData({
          cardNumber: '',
          cardHolderName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardType: 'VISA',
          nickname: '',
          isDefault: false,
        });
      }
      setErrors({});
      setError('');
    }
  }, [open, cardToEdit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCardNumberChange = (value) => {
    // Chỉ cho phép số và giới hạn 16 ký tự
    const numericValue = value.replace(/\D/g, '').slice(0, 16);
    handleInputChange('cardNumber', numericValue);
  };

  const handleExpiryMonthChange = (value) => {
    // Chỉ cho phép số và giới hạn 2 ký tự
    const numericValue = value.replace(/\D/g, '').slice(0, 2);
    handleInputChange('expiryMonth', numericValue);
  };

  const handleExpiryYearChange = (value) => {
    // Chỉ cho phép số và giới hạn 4 ký tự
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    handleInputChange('expiryYear', numericValue);
  };

  const handleCvvChange = (value) => {
    // Chỉ cho phép số và giới hạn 4 ký tự
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    handleInputChange('cvv', numericValue);
  };

  const validateForm = () => {
    const validation = validateCardInfo(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      let response;
      if (cardToEdit) {
        // Cập nhật thẻ
        response = await updatePaymentInfo(cardToEdit.paymentInfoId, formData);
      } else {
        // Tạo thẻ mới
        response = await createPaymentInfo(formData);
      }

      if (response.success) {
        onSuccess(response.data);
        onClose();
      } else {
        setError(response.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Error saving card:', err);
      setError('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getCardTypeIcon = (cardType) => {
    switch (cardType?.toUpperCase()) {
      case 'VISA':
        return '💳';
      case 'MASTERCARD':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
        {cardToEdit ? '✏️ Sửa thẻ thanh toán' : '💳 Thêm thẻ thanh toán mới'}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Loại thẻ */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ mr: 1 }}>
                {getCardTypeIcon(formData.cardType)}
              </Typography>
              <Chip 
                label={formData.cardType} 
                color="primary" 
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Số thẻ */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số thẻ *"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              inputProps={{ maxLength: 16 }}
            />
          </Grid>

          {/* Tên chủ thẻ */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên chủ thẻ *"
              placeholder="NGUYEN VAN A"
              value={formData.cardHolderName}
              onChange={(e) => handleInputChange('cardHolderName', e.target.value.toUpperCase())}
              error={!!errors.cardHolderName}
              helperText={errors.cardHolderName}
            />
          </Grid>

          {/* Tháng hết hạn */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tháng hết hạn *"
              placeholder="12"
              value={formData.expiryMonth}
              onChange={(e) => handleExpiryMonthChange(e.target.value)}
              error={!!errors.expiryMonth}
              helperText={errors.expiryMonth}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>

          {/* Năm hết hạn */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Năm hết hạn *"
              placeholder="2025"
              value={formData.expiryYear}
              onChange={(e) => handleExpiryYearChange(e.target.value)}
              error={!!errors.expiryYear}
              helperText={errors.expiryYear}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          {/* CVV */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVV *"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              error={!!errors.cvv}
              helperText={errors.cvv}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          {/* Tên gợi nhớ */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tên gợi nhớ"
              placeholder="Thẻ chính"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              helperText="Tên để dễ nhớ (tùy chọn)"
            />
          </Grid>

          {/* Đặt làm mặc định */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  color="primary"
                />
              }
              label="Đặt làm thẻ mặc định"
            />
          </Grid>
        </Grid>

        {/* Thông tin bảo mật */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            🔒 Thông tin thẻ của bạn được mã hóa và lưu trữ an toàn. 
            Chúng tôi không lưu trữ thông tin CVV đầy đủ.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : (cardToEdit ? 'Cập nhật' : 'Thêm thẻ')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddEditCardDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  cardToEdit: PropTypes.object, // null nếu thêm mới
};

export default AddEditCardDialog; 
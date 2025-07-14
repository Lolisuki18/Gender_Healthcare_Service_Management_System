/**
 * PaymentInfoContent.js - Component quản lý thông tin thanh toán
 *
 * Chức năng:
 * - Hiển thị danh sách thẻ thanh toán
 * - Thêm thẻ mới
 * - Chỉnh sửa thẻ hiện có
 * - Xóa thẻ
 * - Đặt thẻ làm mặc định
 * - Validate thông tin thẻ
 *
 * Features:
 * - Card management với CRUD operations
 * - Default card setting
 * - Card validation
 * - Secure card display (masked numbers)
 * - Expiry date validation
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  FormHelperText,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  getUserPaymentInfos,
  createPaymentInfo,
  updatePaymentInfo,
  deletePaymentInfo,
  setDefaultPaymentInfo,
  validateCardInfo,
  maskCardNumber,
  formatCardNumber,
} from '../../services/paymentInfoService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
}));

const CARD_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const CARD_GRADIENT_DEFAULT =
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)';

const StyledCard = styled(Card)(({ theme, isDefault }) => ({
  background: isDefault ? CARD_GRADIENT_DEFAULT : CARD_GRADIENT,
  borderRadius: '28px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  color: 'white',
  minHeight: 240,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'visible',
  padding: '0',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.25)',
    transform: 'translateY(-4px) scale(1.02)',
  },
}));

const PaymentInfoContent = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    nickname: '',
    isDefault: false,
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserPaymentInfos();
      
      // Handle response structure properly
      if (response.data && response.data.success) {
        const paymentData = response.data.data || [];
        // Debug: Check isDefault values
        console.log('Payment methods with isDefault status:', paymentData.map(card => ({
          id: card.paymentInfoId,
          cardNumber: card.cardNumber.slice(-4),
          isDefault: card.isDefault
        })));
        setPaymentMethods(paymentData);
      } else {
        setPaymentMethods([]);
        console.warn('Invalid response structure:', response);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Không thể tải danh sách thẻ thanh toán.');
      setPaymentMethods([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    // Format CVC to only allow numbers
    if (field === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle card number formatting
  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value.replace(/\s/g, ''));
    handleInputChange('cardNumber', formatted);
  };

  // Validate form
  const validateForm = () => {
    const validation = validateCardInfo(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const cardData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''), // Remove spaces for API
        cardHolderName: formData.cardHolderName,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvc, // Backend expects 'cvv', frontend uses 'cvc'
        cardType: getCardType(formData.cardNumber), // Auto-detect card type
        nickname: formData.nickname,
        isDefault: formData.isDefault || false,
      };

      if (editingCard) {
        const cardId = editingCard.paymentInfoId; // Backend uses paymentInfoId
        
        if (!cardId) {
          throw new Error('Card ID not found for update');
        }

        await updatePaymentInfo(cardId, cardData);
        showSnackbar('Cập nhật thẻ thành công!', 'success');
      } else {
        await createPaymentInfo(cardData);
        showSnackbar('Thêm thẻ thành công!', 'success');
      }

      setOpenDialog(false);
      resetForm();
      fetchPaymentMethods();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      showSnackbar(err.message || 'Có lỗi xảy ra!', 'error');
    }
  };

  // Handle edit card
  const handleEditCard = (card) => {
    setEditingCard(card);
    setFormData({
      cardNumber: formatCardNumber(card.cardNumber),
      cardHolderName: card.cardHolderName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvc: '', // Don't populate CVV for security
      nickname: card.nickname || '',
      isDefault: card.isDefault || false,
    });
    setOpenDialog(true);
  };

  // Handle delete card
  const handleDeleteCard = async (card) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      return;
    }

    try {
      const cardId = card.paymentInfoId; // Backend uses paymentInfoId
      
      if (!cardId) {
        throw new Error('Card ID not found');
      }

      await deletePaymentInfo(cardId);
      showSnackbar('Xóa thẻ thành công!', 'success');
      fetchPaymentMethods();
    } catch (err) {
      console.error('Error deleting card:', err);
      showSnackbar(err.message || 'Có lỗi xảy ra!', 'error');
    }
  };

  // Handle set default card
  const handleSetDefault = async (card) => {
    try {
      const cardId = card.paymentInfoId; // Backend uses paymentInfoId
      
      if (!cardId) {
        throw new Error('Card ID not found');
      }

      await setDefaultPaymentInfo(cardId);
      showSnackbar('Đặt thẻ mặc định thành công!', 'success');
      fetchPaymentMethods();
    } catch (err) {
      console.error('Error setting default card:', err);
      showSnackbar(err.message || 'Có lỗi xảy ra!', 'error');
    }
  };

  // Handle add new card
  const handleAddCard = () => {
    setEditingCard(null);
    resetForm();
    setOpenDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardHolderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      nickname: '',
      isDefault: false,
    });
    setFormErrors({});
  };

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCard(null);
    resetForm();
  };

  // Get card type from number
  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'VISA';
    if (number.startsWith('5')) return 'MASTERCARD';
    if (number.startsWith('3')) return 'AMEX';
    return 'UNKNOWN';
  };

  // Thêm hàm render icon loại thẻ
  const getCardTypeIcon = (type) => {
    switch (type) {
      case 'VISA':
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
            alt="VISA"
            style={{ height: 28, marginLeft: 8 }}
          />
        );
      case 'MASTERCARD':
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
            alt="MASTERCARD"
            style={{ height: 28, marginLeft: 8 }}
          />
        );
      case 'AMEX':
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg"
            alt="AMEX"
            style={{ height: 28, marginLeft: 8 }}
          />
        );
      default:
        return <CreditCardIcon sx={{ fontSize: 28, opacity: 0.7, ml: 1 }} />;
    }
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    return { value: month, label: month };
  });

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: String(year), label: String(year) };
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <StyledPaper sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            fontWeight="bold"
          >
            Thông tin thanh toán
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCard}
            sx={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              px: 3,
              py: 1,
            }}
          >
            Thêm thẻ mới
          </Button>
        </Box>

        <Grid container spacing={3}>
          {paymentMethods.map((card) => {
            const cardType = getCardType(card.cardNumber);
            const isCardDefault = Boolean(card.isDefault); // Ensure boolean value
            
            return (
              <Grid item xs={12} sm={6} md={4} key={card.paymentInfoId}>
                <StyledCard isDefault={isCardDefault}>
                  <CardContent sx={{ p: 3, pb: 2 }}>
                    {/* Top row: Nickname + Default chip + Card type icon */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ color: 'white', letterSpacing: 1 }}
                        >
                          {card.nickname || card.cardHolderName}
                        </Typography>
                        {isCardDefault && (
                          <Chip
                            icon={<StarIcon sx={{ color: '#FFD700' }} />}
                            label="Mặc định"
                            size="small"
                            sx={{
                              background: 'rgba(255,255,255,0.18)',
                              color: '#FFD700',
                              fontWeight: 700,
                              ml: 1,
                              px: 1.5,
                              fontSize: 13,
                              boxShadow: '0 2px 8px rgba(255,255,255,0.12)',
                            }}
                          />
                        )}
                      </Box>
                      {/* Card type icon */}
                      {getCardTypeIcon(cardType)}
                    </Box>
                    {/* Card number */}
                    <Typography
                      variant="h5"
                      fontFamily="monospace"
                      fontWeight={600}
                      letterSpacing={2}
                      sx={{ color: 'white', mb: 1, mt: 2 }}
                    >
                      {maskCardNumber(card.cardNumber)}
                    </Typography>
                    {/* Cardholder name & expiry */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mt={2}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ color: 'white', opacity: 0.92 }}
                        >
                          {card.cardHolderName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'white', opacity: 0.7 }}
                        >
                          Hết hạn: {card.expiryMonth}/{card.expiryYear}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  {/* Action buttons bottom right */}
                  <CardActions
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 16,
                      gap: 1,
                      p: 0,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEditCard(card)}
                      sx={{
                        color: 'white',
                        background: 'rgba(0,0,0,0.12)',
                        '&:hover': { background: 'rgba(0,0,0,0.22)' },
                        mr: 0.5,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCard(card)}
                      sx={{
                        color: 'white',
                        background: 'rgba(255,0,0,0.18)',
                        '&:hover': { background: 'rgba(255,0,0,0.28)' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                  {/* Set default button bottom left */}
                  {!isCardDefault && (
                    <Button
                      size="small"
                      startIcon={<StarBorderIcon />}
                      onClick={() => handleSetDefault(card)}
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 16,
                        color: 'white',
                        background: 'rgba(255,255,255,0.10)',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        fontSize: 13,
                        '&:hover': {
                          background: 'rgba(255,255,255,0.18)',
                        },
                      }}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  
                  {/* Default indicator when card is default */}
                  {isCardDefault && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 16,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#FFD700',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Mặc định
                    </Box>
                  )}
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>

        {paymentMethods.length === 0 && (
          <Box textAlign="center" py={4}>
            <CreditCardIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" mb={1}>
              Chưa có thẻ thanh toán
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Thêm thẻ thanh toán để thanh toán nhanh chóng và thuận tiện
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCard}
              sx={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                px: 3,
                py: 1,
              }}
            >
              Thêm thẻ đầu tiên
            </Button>
          </Box>
        )}
      </StyledPaper>

      {/* Add/Edit Card Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 8px 40px 0 rgba(102,126,234,0.18)',
            p: 0,
            minWidth: { xs: '90vw', sm: 480 },
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 24,
            color: '#4A90E2',
            letterSpacing: 1,
            pb: 1,
          }}
        >
          {editingCard ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 2 }}>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {/* Row 1: Nickname & Card Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên gợi nhớ (tùy chọn)"
                  value={formData.nickname}
                  onChange={(e) =>
                    handleInputChange('nickname', e.target.value)
                  }
                  placeholder="Ví dụ: Thẻ chính, Thẻ phụ"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      background: '#f7fafd',
                      fontWeight: 500,
                    },
                  }}
                  InputLabelProps={{ sx: { fontWeight: 500 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số thẻ"
                  value={formData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  error={!!formErrors.cardNumber}
                  helperText={formErrors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      background: '#f7fafd',
                      fontWeight: 600,
                      letterSpacing: 2,
                    },
                  }}
                  InputLabelProps={{ sx: { fontWeight: 500 } }}
                />
              </Grid>
              {/* Row 2: Cardholder & Expiry */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên chủ thẻ"
                  value={formData.cardHolderName}
                  onChange={(e) =>
                    handleInputChange('cardHolderName', e.target.value)
                  }
                  error={!!formErrors.cardHolderName}
                  helperText={formErrors.cardHolderName}
                  placeholder="NGUYEN VAN A"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      background: '#f7fafd',
                      fontWeight: 500,
                    },
                  }}
                  InputLabelProps={{ sx: { fontWeight: 500 } }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl
                  fullWidth
                  error={!!formErrors.expiryMonth}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 3,
                      background: '#f7fafd',
                      fontWeight: 500,
                    },
                  }}
                >
                  <InputLabel sx={{ fontWeight: 500 }}>Tháng</InputLabel>
                  <Select
                    value={formData.expiryMonth}
                    onChange={(e) =>
                      handleInputChange('expiryMonth', e.target.value)
                    }
                    label="Tháng"
                  >
                    {monthOptions.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.expiryMonth && (
                    <FormHelperText>{formErrors.expiryMonth}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl
                  fullWidth
                  error={!!formErrors.expiryYear}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 3,
                      background: '#f7fafd',
                      fontWeight: 500,
                    },
                  }}
                >
                  <InputLabel sx={{ fontWeight: 500 }}>Năm</InputLabel>
                  <Select
                    value={formData.expiryYear}
                    onChange={(e) =>
                      handleInputChange('expiryYear', e.target.value)
                    }
                    label="Năm"
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year.value} value={year.value}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.expiryYear && (
                    <FormHelperText>{formErrors.expiryYear}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* Row 3: CVV full width */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  error={!!formErrors.cvc}
                  helperText={formErrors.cvc}
                  placeholder="123"
                  type="password"
                  inputProps={{ maxLength: 4 }}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      background: '#f7fafd',
                      fontWeight: 600,
                      letterSpacing: 2,
                    },
                  }}
                  InputLabelProps={{ sx: { fontWeight: 500 } }}
                />
              </Grid>
              
              {/* Row 4: Set as Default */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isDefault}
                      onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Đặt làm thẻ mặc định"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontWeight: 500,
                      color: '#4A90E2'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'center', px: 4, pb: 2, pt: 0, gap: 2 }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{ color: '#4A90E2', fontWeight: 600, borderRadius: 2, px: 2 }}
          >
            HỦY
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              borderRadius: 3,
              px: 4,
              py: 1.2,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(102,126,234,0.12)',
              '&:hover': {
                background: 'linear-gradient(90deg, #5a67d8 0%, #6b47dc 100%)',
              },
            }}
          >
            {editingCard ? 'CẬP NHẬT' : 'THÊM THẺ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentInfoContent;

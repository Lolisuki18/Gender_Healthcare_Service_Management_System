import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import paymentInfoService from '@/services/paymentInfoService';
import AddEditCardDialog from './AddEditCardDialog';

const PaymentSection = ({ 
  selectedPaymentMethod, 
  onPaymentMethodChange, 
  selectedCard,
  onCardChange,
  disabled = false 
}) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [cvcDialogOpen, setCvcDialogOpen] = useState(false);
  const [cvcInput, setCvcInput] = useState('');
  const [cvcError, setCvcError] = useState('');

  // Tải danh sách thẻ khi component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  // Auto-select thẻ mặc định khi có
  useEffect(() => {
    if (paymentMethods.length > 0 && selectedPaymentMethod === 'card' && !selectedCard) {
      const defaultCard = paymentMethods.find(card => card.isDefault);
      if (defaultCard) {
        onCardChange(defaultCard.paymentInfoId);
      } else {
        // Nếu không có thẻ mặc định, chọn thẻ đầu tiên
        onCardChange(paymentMethods[0].paymentInfoId);
      }
    }
  }, [paymentMethods, selectedPaymentMethod, selectedCard, onCardChange]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentInfoService.getAll();
      if (response.data.success) {
        setPaymentMethods(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Không thể tải danh sách thẻ');
      }
    } catch (err) {
      console.error('Error loading payment methods:', err);
      setError('Không thể tải danh sách thẻ');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    onPaymentMethodChange(method);
    
    // Reset selected card khi đổi sang cash
    if (method === 'cash') {
      onCardChange(null);
    } else if (method === 'card' && paymentMethods.length > 0) {
      // Auto-select thẻ mặc định hoặc thẻ đầu tiên
      const defaultCard = paymentMethods.find(card => card.isDefault);
      const cardToSelect = defaultCard || paymentMethods[0];
      onCardChange(cardToSelect.paymentInfoId); // Sử dụng paymentInfoId
    }
  };

  const handleCardSelect = (cardId) => {
    onCardChange(cardId);
  };

  const handleAddCard = () => {
    setEditingCard(null);
    setCardDialogOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardDialogOpen(true);
  };

  const handleSaveCard = async (cardData) => {
    try {
      setActionLoading(true);
      let response;
      
      if (editingCard) {
        response = await paymentInfoService.update(editingCard.paymentInfoId, cardData);
      } else {
        response = await paymentInfoService.create(cardData);
      }

      if (response.data.success) {
        toast.success(editingCard ? 'Cập nhật thẻ thành công!' : 'Thêm thẻ thành công!');
        setCardDialogOpen(false);
        setEditingCard(null);
        await loadPaymentMethods(); // Reload danh sách
        
        // Auto-select thẻ mới thêm nếu đang ở mode card
        if (!editingCard && selectedPaymentMethod === 'card') {
          const newCard = response.data.data;
          onCardChange(newCard.paymentInfoId); // Sử dụng paymentInfoId
        }
      } else {
        throw new Error(response.data.message || 'Không thể lưu thông tin thẻ');
      }
    } catch (err) {
      console.error('Error saving card:', err);
      toast.error(err.message || 'Không thể lưu thông tin thẻ');
    } finally {
      setActionLoading(false);
    }
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
  };

  const getCardTypeIcon = (cardNumber) => {
    if (!cardNumber) return '💳';
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return '💳'; // Visa
    if (firstDigit === '5') return '💳'; // MasterCard
    return '💳';
  };

  const getSelectedCardInfo = () => {
    if (!selectedCard) return null;
    return paymentMethods.find(card => card.paymentInfoId === selectedCard); // So sánh với paymentInfoId
  };

  const handleCvcConfirm = () => {
    if (!cvcInput || cvcInput.length < 3 || cvcInput.length > 4) {
      setCvcError('Mã CVC phải có 3-4 chữ số');
      return;
    }
    
    setCvcDialogOpen(false);
    setCvcInput('');
    setCvcError('');
    toast.success('Xác thực thành công!');
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Phương thức thanh toán
        </Typography>

        <FormControl component="fieldset" fullWidth disabled={disabled}>
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
          >
            {/* Thanh toán tiền mặt */}
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center">
                  <BankIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Thanh toán tiền mặt (COD)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thanh toán khi nhận dịch vụ
                    </Typography>
                  </Box>
                </Box>
              }
            />

            {/* Thanh toán thẻ */}
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center">
                    <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Thanh toán bằng thẻ
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thẻ tín dụng/ghi nợ đã lưu
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Tooltip title="Làm mới danh sách">
                      <IconButton size="small" onClick={loadPaymentMethods}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddCard}
                      disabled={disabled}
                    >
                      Thêm thẻ
                    </Button>
                  </Box>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          </RadioGroup>
        </FormControl>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} action={
            <Button color="inherit" size="small" onClick={loadPaymentMethods}>
              Thử lại
            </Button>
          }>
            {error}
          </Alert>
        )}

        {/* Danh sách thẻ khi chọn thanh toán bằng thẻ */}
        {selectedPaymentMethod === 'card' && (
          <Box mt={2} ml={4}>
            {paymentMethods.length === 0 ? (
              <Alert severity="info">
                Bạn chưa có thẻ nào. Hãy thêm thẻ mới để sử dụng.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {paymentMethods.map((card) => (
                  <Grid item xs={12} md={6} key={card.paymentInfoId}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        cursor: disabled ? 'default' : 'pointer',
                        border: selectedCard === card.paymentInfoId ? 2 : 1, // So sánh với paymentInfoId
                        borderColor: selectedCard === card.paymentInfoId ? 'primary.main' : 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': disabled ? {} : {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => !disabled && handleCardSelect(card.paymentInfoId)} // Truyền paymentInfoId
                    >
                      <CardContent sx={{ position: 'relative', pb: '16px !important' }}>
                        {card.isDefault && (
                          <Chip
                            icon={<StarIcon />}
                            label="Mặc định"
                            color="primary"
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8
                            }}
                          />
                        )}

                        <Box display="flex" alignItems="center" mb={1}>
                          <Box sx={{ fontSize: 20, mr: 1 }}>
                            {getCardTypeIcon(card.cardNumber)}
                          </Box>
                          <Typography variant="body1" fontWeight={500}>
                            {maskCardNumber(card.cardNumber)}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {card.cardHolderName}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Hết hạn: {card.expiryMonth}/{card.expiryYear}
                        </Typography>

                        <Box display="flex" justifyContent="between" alignItems="center" mt={1}>
                          <Radio
                            checked={selectedCard === card.paymentInfoId} // So sánh với paymentInfoId
                            disabled={disabled}
                            size="small"
                          />
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCard(card);
                              }}
                              disabled={disabled}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Thông tin tóm tắt thanh toán */}
        {selectedPaymentMethod && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Phương thức thanh toán đã chọn:
              </Typography>
              {selectedPaymentMethod === 'cash' ? (
                <Box display="flex" alignItems="center">
                  <BankIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body2">
                    Thanh toán tiền mặt khi nhận dịch vụ
                  </Typography>
                </Box>
              ) : (
                (() => {
                  const cardInfo = getSelectedCardInfo();
                  return cardInfo ? (
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Box sx={{ fontSize: 20, mr: 1 }}>
                          {getCardTypeIcon(cardInfo.cardNumber)}
                        </Box>
                        <Box>
                          <Typography variant="body2">
                            {maskCardNumber(cardInfo.cardNumber)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cardInfo.cardHolderName}
                          </Typography>
                        </Box>
                      </Box>
                      {cardInfo.isDefault && (
                        <Chip icon={<StarIcon />} label="Mặc định" color="primary" size="small" />
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      Vui lòng chọn thẻ thanh toán
                    </Typography>
                  );
                })()
              )}
            </Box>
          </>
        )}

        {/* Dialog CVC confirmation */}
        <Dialog open={cvcDialogOpen} onClose={() => setCvcDialogOpen(false)}>
          <DialogTitle>Xác thực thanh toán</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Vui lòng nhập mã CVC để xác thực thanh toán:
            </Typography>
            <TextField
              autoFocus
              fullWidth
              type="password"
              label="Mã CVC"
              value={cvcInput}
              onChange={(e) => {
                setCvcInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                setCvcError('');
              }}
              error={!!cvcError}
              helperText={cvcError}
              placeholder="123"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCvcDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleCvcConfirm} variant="contained">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog thêm/sửa thẻ */}
        <AddEditCardDialog
          open={cardDialogOpen}
          onClose={() => {
            setCardDialogOpen(false);
            setEditingCard(null);
          }}
          onSave={handleSaveCard}
          cardData={editingCard}
          loading={actionLoading}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
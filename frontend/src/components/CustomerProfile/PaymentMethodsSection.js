import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CreditCard as CreditCardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import paymentInfoService from '@/services/paymentInfoService';
import AddEditCardDialog from '@/components/TestRegistration/AddEditCardDialog';

const PaymentMethodsSection = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Tải danh sách thẻ khi component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

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
      setError('Không thể tải danh sách thẻ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    setEditingCard(null);
    setCardDialogOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardDialogOpen(true);
  };

  const handleDeleteCard = (card) => {
    setDeletingCard(card);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCard = async () => {
    if (!deletingCard) return;

    try {
      setActionLoading(true);
      const response = await paymentInfoService.remove(deletingCard.id);
      if (response.data.success) {
        toast.success('Xóa thẻ thành công!');
        loadPaymentMethods(); // Reload danh sách
      } else {
        throw new Error(response.data.message || 'Không thể xóa thẻ');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
      toast.error(err.message || 'Không thể xóa thẻ. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setDeletingCard(null);
    }
  };

  const handleSetDefault = async (card) => {
    try {
      setActionLoading(true);
      const response = await paymentInfoService.setDefault(card.id);
      if (response.data.success) {
        toast.success('Đã đặt làm thẻ mặc định!');
        loadPaymentMethods(); // Reload danh sách
      } else {
        throw new Error(response.data.message || 'Không thể đặt thẻ mặc định');
      }
    } catch (err) {
      console.error('Error setting default card:', err);
      toast.error(err.message || 'Không thể đặt thẻ mặc định. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveCard = async (cardData) => {
    try {
      setActionLoading(true);
      let response;

      if (editingCard) {
        // Cập nhật thẻ
        response = await paymentInfoService.update(editingCard.id, cardData);
      } else {
        // Tạo thẻ mới
        response = await paymentInfoService.create(cardData);
      }

      if (response.data.success) {
        toast.success(editingCard ? 'Cập nhật thẻ thành công!' : 'Thêm thẻ thành công!');
        setCardDialogOpen(false);
        setEditingCard(null);
        loadPaymentMethods(); // Reload danh sách
      } else {
        throw new Error(response.data.message || 'Không thể lưu thông tin thẻ');
      }
    } catch (err) {
      console.error('Error saving card:', err);
      toast.error(err.message || 'Không thể lưu thông tin thẻ. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
  };

  const getCardTypeIcon = (cardNumber) => {
    if (!cardNumber) return <CreditCardIcon />;
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return '💳'; // Visa
    if (firstDigit === '5') return '💳'; // MasterCard
    return <CreditCardIcon />;
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

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={loadPaymentMethods}>
              Thử lại
            </Button>
          }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            Phương thức thanh toán
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCard}
            disabled={actionLoading}
          >
            Thêm thẻ mới
          </Button>
        </Box>

        {paymentMethods.length === 0 ? (
          <Box textAlign="center" py={4}>
            <CreditCardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có thẻ nào
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Thêm thẻ để thanh toán nhanh chóng và tiện lợi
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddCard}
            >
              Thêm thẻ đầu tiên
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {paymentMethods.map((card) => (
              <Grid item xs={12} md={6} key={card.id}>
                <Card
                  variant="outlined"
                  sx={{
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {card.isDefault && (
                    <Chip
                      icon={<StarIcon />}
                      label="Mặc định"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1
                      }}
                    />
                  )}

                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box sx={{ fontSize: 24, mr: 1 }}>
                        {getCardTypeIcon(card.cardNumber)}
                      </Box>
                      <Typography variant="h6" component="div">
                        {maskCardNumber(card.cardNumber)}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tên chủ thẻ: {card.cardHolderName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Hết hạn: {card.expiryMonth}/{card.expiryYear}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        {!card.isDefault && (
                          <Tooltip title="Đặt làm mặc định">
                            <IconButton
                              size="small"
                              onClick={() => handleSetDefault(card)}
                              disabled={actionLoading}
                            >
                              <StarBorderIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCard(card)}
                            disabled={actionLoading}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>


                      <Tooltip title="Xóa thẻ">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCard(card)}
                          disabled={actionLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog xác nhận xóa */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Xác nhận xóa thẻ</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa thẻ{' '}
              <strong>{deletingCard && maskCardNumber(deletingCard.cardNumber)}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
              Hủy
            </Button>
            <Button
              onClick={confirmDeleteCard}
              color="error"
              variant="contained"
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Xóa'}
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

export default PaymentMethodsSection;

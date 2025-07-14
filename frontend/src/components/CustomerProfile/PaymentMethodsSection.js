import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import {
  getUserPaymentInfos,
  deletePaymentInfo,
  setDefaultPaymentInfo,
} from '@/services/paymentInfoService';
import AddEditCardDialog from '../TestRegistration/AddEditCardDialog';

const PaymentMethodsSection = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);

  // Load danh sách thẻ khi component mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getUserPaymentInfos();
      if (response.success) {
        setCards(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách thẻ');
      }
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Không thể tải danh sách thẻ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      return;
    }

    try {
      const response = await deletePaymentInfo(cardId);
      if (response.success) {
        await loadCards();
      } else {
        setError(response.message || 'Không thể xóa thẻ');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Không thể xóa thẻ: ' + err.message);
    }
  };

  const handleSetDefault = async (cardId) => {
    try {
      const response = await setDefaultPaymentInfo(cardId);
      if (response.success) {
        await loadCards();
      } else {
        setError(response.message || 'Không thể đặt thẻ mặc định');
      }
    } catch (err) {
      console.error('Error setting default card:', err);
      setError('Không thể đặt thẻ mặc định: ' + err.message);
    }
  };

  const handleEditCard = (card) => {
    setCardToEdit(card);
    setOpenAddDialog(true);
  };

  const handleAddNewCard = () => {
    setCardToEdit(null);
    setOpenAddDialog(true);
  };

  const handleCardSaved = (savedCard) => {
    setOpenAddDialog(false);
    setCardToEdit(null);
    loadCards(); // Reload danh sách
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

  const getCardTypeColor = (cardType) => {
    switch (cardType?.toUpperCase()) {
      case 'VISA':
        return '#1a1f71';
      case 'MASTERCARD':
        return '#eb001b';
      default:
        return '#666';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Thẻ thanh toán
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewCard}
        >
          Thêm thẻ mới
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : cards.length === 0 ? (
        /* Empty State */
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CreditCardIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có thẻ nào được lưu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Thêm thẻ để thanh toán nhanh hơn khi đặt lịch khám
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNewCard}
          >
            Thêm thẻ đầu tiên
          </Button>
        </Paper>
      ) : (
        /* Cards List */
        <Paper>
          <List>
            {cards.map((card, index) => (
              <React.Fragment key={card.paymentInfoId}>
                <ListItem
                  sx={{
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{ color: getCardTypeColor(card.cardType) }}
                      >
                        {getCardTypeIcon(card.cardType)}
                      </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {card.nickname || card.cardHolderName}
                        </Typography>
                        {card.isDefault && (
                          <Chip
                            label="Mặc định"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                        {card.isExpired && (
                          <Chip
                            label="Hết hạn"
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {card.maskedCardNumber}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Hết hạn: {card.expiryDisplay} • {card.cardType}
                      </Typography>
                    </Box>
                  </Box>

                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!card.isDefault && (
                        <Tooltip title="Đặt làm mặc định">
                          <IconButton
                            size="small"
                            onClick={() => handleSetDefault(card.paymentInfoId)}
                          >
                            <StarBorderIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {card.isDefault && (
                        <Tooltip title="Thẻ mặc định">
                          <IconButton size="small" disabled>
                            <StarIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Sửa thẻ">
                        <IconButton
                          size="small"
                          onClick={() => handleEditCard(card)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xóa thẻ">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCard(card.paymentInfoId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>

                {index < cards.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Add/Edit Card Dialog */}
      <AddEditCardDialog
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false);
          setCardToEdit(null);
        }}
        onSuccess={handleCardSaved}
        cardToEdit={cardToEdit}
      />

      {/* Floating Action Button */}
      {cards.length > 0 && (
        <Fab
          color="primary"
          aria-label="add card"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={handleAddNewCard}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default PaymentMethodsSection;

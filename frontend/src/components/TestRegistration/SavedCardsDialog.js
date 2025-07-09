import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import {
  getUserPaymentInfos,
  deletePaymentInfo,
  setDefaultPaymentInfo,
} from '@/services/paymentInfoService';

const SavedCardsDialog = ({ open, onClose, onCardSelect, onAddNewCard }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load danh sách thẻ khi dialog mở
  useEffect(() => {
    if (open) {
      loadCards();
    }
  }, [open]);

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
        // Reload danh sách thẻ
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
        // Reload danh sách thẻ
        await loadCards();
      } else {
        setError(response.message || 'Không thể đặt thẻ mặc định');
      }
    } catch (err) {
      console.error('Error setting default card:', err);
      setError('Không thể đặt thẻ mặc định: ' + err.message);
    }
  };

  const handleCardSelect = (card) => {
    onCardSelect(card);
    onClose();
  };

  const handleAddNewCard = () => {
    onAddNewCard();
    onClose();
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
        💳 Thẻ thanh toán đã lưu
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : cards.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CreditCardIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có thẻ nào được lưu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thêm thẻ để thanh toán nhanh hơn
            </Typography>
          </Box>
        ) : (
          <List>
            {cards.map((card, index) => (
              <React.Fragment key={card.paymentInfoId}>
                <ListItem
                  sx={{
                    border: '1px solid',
                    borderColor: card.isDefault ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => handleCardSelect(card)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ mr: 2 }}>
                      <Typography variant="h4" sx={{ color: getCardTypeColor(card.cardType) }}>
                        {getCardTypeIcon(card.cardType)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                        Hết hạn: {card.expiryDisplay}
                      </Typography>
                    </Box>
                  </Box>

                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!card.isDefault && (
                        <Tooltip title="Đặt làm mặc định">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(card.paymentInfoId);
                            }}
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
                      
                      <Tooltip title="Xóa thẻ">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(card.paymentInfoId);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < cards.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose}>
          Đóng
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewCard}
        >
          Thêm thẻ mới
        </Button>
      </DialogActions>

      {/* Floating Action Button để thêm thẻ mới */}
      <Fab
        color="primary"
        aria-label="add card"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: cards.length === 0 ? 'none' : 'flex',
        }}
        onClick={handleAddNewCard}
      >
        <AddIcon />
      </Fab>
    </Dialog>
  );
};

SavedCardsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardSelect: PropTypes.func.isRequired,
  onAddNewCard: PropTypes.func.isRequired,
};

export default SavedCardsDialog; 
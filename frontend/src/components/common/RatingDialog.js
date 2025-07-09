/**
 * RatingDialog.js
 * Component dialog để khách hàng đánh giá dịch vụ sau khi hoàn thành
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Rating,
  TextField,
  Chip,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  Feedback as FeedbackIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// ===== STYLED COMPONENTS =====
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    maxWidth: 600,
    width: '90%',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 20px 60px rgba(33, 150, 243, 0.15)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  padding: '12px 24px',
  background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #00BFA5, #2196F3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
  },
  '&:disabled': {
    background: 'rgba(33, 150, 243, 0.3)',
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#FFD700',
    fontSize: '2.5rem',
  },
  '& .MuiRating-iconHover': {
    color: '#FFD700',
    fontSize: '2.5rem',
  },
  '& .MuiRating-iconEmpty': {
    color: '#E0E0E0',
    fontSize: '2.5rem',
  },
}));

// ===== QUICK FEEDBACK OPTIONS =====
const QUICK_FEEDBACK_OPTIONS = [
  { label: '👨‍⚕️ Nhân viên chuyên nghiệp', value: 'professional_staff' },
  { label: '⏰ Đúng giờ hẹn', value: 'on_time' },
  { label: '🏥 Cơ sở vật chất tốt', value: 'good_facilities' },
  { label: '💰 Giá cả hợp lý', value: 'reasonable_price' },
  { label: '🔬 Kết quả chính xác', value: 'accurate_results' },
  { label: '🤝 Tư vấn tận tình', value: 'helpful_consultation' },
  { label: '🔒 Bảo mật thông tin', value: 'privacy_protection' },
  { label: '📞 Dễ liên hệ', value: 'easy_contact' },
];

// ===== RATING LABELS =====
const RATING_LABELS = {
  1: 'Rất không hài lòng 😞',
  2: 'Không hài lòng 😐',
  3: 'Bình thường 🙂',
  4: 'Hài lòng 😊',
  5: 'Rất hài lòng 🤩',
};

/**
 * Component RatingDialog
 * @param {Object} props - Props của component
 * @param {boolean} props.open - Trạng thái mở/đóng dialog
 * @param {Function} props.onClose - Hàm xử lý đóng dialog
 * @param {Function} props.onSubmit - Hàm xử lý khi submit đánh giá
 * @param {Object} props.serviceInfo - Thông tin dịch vụ đã sử dụng
 * @param {string} props.serviceType - Loại dịch vụ ('test' hoặc 'consultation')
 * @param {boolean} props.loading - Trạng thái loading khi submit
 */
const RatingDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  serviceInfo, 
  serviceType = 'test',
  loading = false 
}) => {
  // ===== STATE MANAGEMENT =====
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(-1);
  const [comment, setComment] = useState('');
  const [selectedQuickFeedback, setSelectedQuickFeedback] = useState([]);
  const [errors, setErrors] = useState({});

  // ===== HANDLERS =====
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    setErrors(prev => ({ ...prev, rating: null }));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    setErrors(prev => ({ ...prev, comment: null }));
  };

  const handleQuickFeedbackToggle = (value) => {
    setSelectedQuickFeedback(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Vui lòng nhập nhận xét về dịch vụ';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Nhận xét phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const reviewData = {
      rating,
      comment: comment.trim(),
      quickFeedback: selectedQuickFeedback,
      serviceId: serviceInfo?.id,
      serviceType,
      appointmentId: serviceInfo?.appointmentId,
    };

    onSubmit(reviewData);
  };

  const handleClose = () => {
    if (!loading) {
      setRating(0);
      setHoverRating(-1);
      setComment('');
      setSelectedQuickFeedback([]);
      setErrors({});
      onClose();
    }
  };

  const getRatingLabel = (value) => {
    return RATING_LABELS[value] || '';
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 2,
        background: 'linear-gradient(135deg, #f8faff 0%, #e6f3ff 100%)',
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
      }}>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#666',
            '&:hover': {
              background: 'rgba(33, 150, 243, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(45deg, #2196F3, #00BFA5)', 
            width: 48, 
            height: 48 
          }}>
            <FeedbackIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Đánh giá dịch vụ
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 4 }}>
        {/* Service Info */}
        {serviceInfo && (
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 3, 
            background: 'rgba(33, 150, 243, 0.05)',
            border: '1px solid rgba(33, 150, 243, 0.1)',
          }}>
            <Typography variant="h6" fontWeight={600} mb={1} color="#1976d2">
              📋 {serviceType === 'test' ? 'Dịch vụ xét nghiệm' : 'Dịch vụ tư vấn'}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {serviceInfo.name}
            </Typography>
            {serviceInfo.date && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Ngày thực hiện: {serviceInfo.date}
              </Typography>
            )}
          </Box>
        )}

        {/* Rating Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            ⭐ Bạn đánh giá dịch vụ này như thế nào?
          </Typography>
          
          <StyledRating
            value={rating}
            onChange={handleRatingChange}
            onChangeActive={(event, newHover) => setHoverRating(newHover)}
            size="large"
            precision={1}
          />
          
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 2, 
              fontWeight: 600,
              color: rating > 0 ? '#2196F3' : '#999',
              minHeight: 24,
            }}
          >
            {getRatingLabel(hoverRating !== -1 ? hoverRating : rating)}
          </Typography>
          
          {errors.rating && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {errors.rating}
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Quick Feedback Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            💡 Điểm nổi bật của dịch vụ (tùy chọn)
          </Typography>
          <Grid container spacing={1}>
            {QUICK_FEEDBACK_OPTIONS.map((option) => (
              <Grid item xs={12} sm={6} key={option.value}>
                <Chip
                  label={option.label}
                  onClick={() => handleQuickFeedbackToggle(option.value)}
                  variant={selectedQuickFeedback.includes(option.value) ? "filled" : "outlined"}
                  color={selectedQuickFeedback.includes(option.value) ? "primary" : "default"}
                  sx={{
                    width: '100%',
                    height: 40,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Comment Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            💬 Nhận xét chi tiết
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
            error={!!errors.comment}
            helperText={errors.comment || `${comment.length}/500 ký tự`}
            inputProps={{ maxLength: 500 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2196F3',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2196F3',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            minWidth: 120,
            borderColor: '#E0E0E0',
            color: '#666',
            '&:hover': {
              borderColor: '#BDBDBD',
              background: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Hủy bỏ
        </Button>
        
        <GradientButton
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ minWidth: 180 }}
        >
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default RatingDialog;

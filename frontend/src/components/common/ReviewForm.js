/**
 * ReviewForm.js - Component hiển thị form đánh giá dịch vụ
 *
 * Chức năng:
 * - Hiển thị form để tạo mới hoặc chỉnh sửa đánh giá
 * - Quản lý trạng thái của form (rating, feedback)
 * - Hiển thị gợi ý nội dung đánh giá
 * - Hỗ trợ cả tạo mới và chỉnh sửa đánh giá
 * - Xử lý đánh giá cho cả dịch vụ STI và dịch vụ tư vấn
 *
 * Props:
 * - open: Trạng thái mở/đóng của dialog
 * - onClose: Hàm đóng dialog
 * - review: Thông tin về dịch vụ cần đánh giá
 * - rating: Số sao đánh giá
 * - setRating: Hàm set số sao đánh giá
 * - feedback: Nội dung đánh giá
 * - setFeedback: Hàm set nội dung đánh giá
 * - onSubmit: Hàm xử lý khi submit form
 * - isEditMode: Mode chỉnh sửa đánh giá
 * - loading: Trạng thái loading
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Rating,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  RateReview as RateReviewIcon,
  Star as StarIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Hàm xử lý các định dạng ngày từ API
const convertApiDateToDate = (apiDate) => {
  if (!apiDate) return new Date();
  
  // If it's already a string or Date object, use it directly
  if (typeof apiDate === 'string' || apiDate instanceof Date) {
    return new Date(apiDate);
  }
  
  // If it's an array format like [2025, 7, 10, 23, 3, 5, 586396200]
  if (Array.isArray(apiDate)) {
    if (apiDate.length >= 6) {
      const [year, month, day, hour, minute, second, nanosecond] = apiDate;
      // Note: JavaScript months are 0-indexed, so subtract 1 from month
      const millisecond = nanosecond ? Math.floor(nanosecond / 1000000) : 0;
      return new Date(year, month - 1, day, hour, minute, second, millisecond);
    } 
    // Format [year, month, day, hour, minute]
    else if (apiDate.length >= 5) {
      const [year, month, day, hour, minute] = apiDate;
      return new Date(year, month - 1, day, hour, minute, 0, 0);
    }
    // Format [year, month, day]
    else if (apiDate.length >= 3) {
      const [year, month, day] = apiDate;
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
  }
  
  // Fallback to current date
  return new Date();
};

/**
 * Component form đánh giá dịch vụ
 * Được tách từ ReviewsContent để dễ quản lý và tái sử dụng
 */
const ReviewForm = ({
  open,
  onClose,
  review,
  rating,
  setRating,
  feedback,
  setFeedback,
  onSubmit,
  isEditMode,
  loading
}) => {
  // Gom logic hiển thị thông tin đầu form vào 1 biến duy nhất
  const displayInfo = React.useMemo(() => {
    // Dòng 1: tên dịch vụ hoặc tên tư vấn viên (ưu tiên targetName nếu có)
    let mainName =
      review?.serviceName ||
      review?.consultantName ||
      review?.targetName ||
      '';
    // Dòng 2: tên khách hàng (ưu tiên customerName)
    let customerName = review?.customerName || review?.userFullName || review?.maskedUserName || '';
    // Dòng 3: ngày đánh giá
    let reviewedDateRaw = review?.reviewedDate || review?.createdAt || review?.date;
    let reviewedDate = reviewedDateRaw ? convertApiDateToDate(reviewedDateRaw).toLocaleDateString('vi-VN') : '';
    let avatarChar = (mainName || customerName || 'N')[0];
    let isConsultant = review?.type === 'CONSULTANT' && !!review?.consultantName;
    return { mainName, customerName, reviewedDate, avatarChar, isConsultant };
  }, [review]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #F5F7FA 0%, #E3F2FD 50%, #F5F7FA 100%)',
          boxShadow: '0 20px 60px rgba(74, 144, 226, 0.2)',
          maxHeight: '90vh',
          overflow: 'hidden',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(45, 55, 72, 0.4)',
          backdropFilter: 'blur(5px)',
        }
      }}
      TransitionProps={{
        timeout: 500,
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px 20px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RateReviewIcon sx={{ fontSize: '28px' }} />
          {isEditMode 
            ? 'Chỉnh sửa đánh giá' 
            : review?.type === 'CONSULTANT' 
              ? 'Đánh giá dịch vụ tư vấn' 
              : 'Đánh giá dịch vụ xét nghiệm'
          }
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ 
            color: '#fff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: { xs: 2, md: 4 }, overflow: 'auto' }}>
        {review && (
          <Box>
            {/* Service Info */}
            <Box 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                p: 3,
                mb: 4,
                border: '1px solid rgba(74, 144, 226, 0.1)',
                boxShadow: '0 4px 20px rgba(74, 144, 226, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    mr: 3,
                    background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                    fontSize: '24px',
                    fontWeight: 600,
                  }}
                >
                  {displayInfo.avatarChar}
                </Avatar>
                <Box>
                  {/* Dòng 1: Tên dịch vụ hoặc tư vấn viên */}
                  {displayInfo.mainName && (
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748', mb: 0.5 }}>
                      {displayInfo.isConsultant ? (
                        <>
                          <b>Tư vấn viên</b> {displayInfo.mainName}
                        </>
                      ) : (
                        displayInfo.mainName
                      )}
                    </Typography>
                  )}
                  {/* Dòng 2: Tên khách hàng */}
                  {displayInfo.customerName && (
                    <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 500 }}>
                      {displayInfo.customerName}
                    </Typography>
                  )}
                  {/* Dòng 3: Ngày đánh giá nếu có */}
                  {isEditMode && displayInfo.reviewedDate && (
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Ngày đánh giá: {displayInfo.reviewedDate}
                    </Typography>
                  )}
                  {/* Thời gian và lý do tư vấn giữ nguyên nếu có */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                    {review.startTime && review.endTime && (
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Thời gian: {convertApiDateToDate(review.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {convertApiDateToDate(review.endTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                      </Typography>
                    )}
                    {review.reason && (
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Lý do tư vấn: {review.reason}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Rating Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2D3748', 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <StarIcon sx={{ color: '#FFB400' }} />
                Đánh giá của bạn
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  p: 3,
                  border: '1px solid rgba(74, 144, 226, 0.1)',
                }}
              >
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#FFB400',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#E0E7FF',
                    },
                    '& .MuiRating-iconHover': {
                      color: '#FFCA28',
                    }
                  }}
                />
                <Typography variant="body1" sx={{ color: '#4A5568', fontWeight: 500 }}>
                  {rating === 0 && 'Chọn số sao'}
                  {rating === 1 && 'Rất không hài lòng'}
                  {rating === 2 && 'Không hài lòng'}
                  {rating === 3 && 'Bình thường'}
                  {rating === 4 && 'Hài lòng'}
                  {rating === 5 && 'Rất hài lòng'}
                </Typography>
              </Box>
            </Box>

            {/* Feedback Section */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2D3748', 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <RateReviewIcon sx={{ color: '#4A90E2' }} />
                Chia sẻ chi tiết
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Hãy chia sẻ trải nghiệm chi tiết về dịch vụ này... (ít nhất 10 ký tự)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                helperText={`${feedback.length}/500 ký tự`}
                inputProps={{ maxLength: 500 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: '#4A90E2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4A90E2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    textAlign: 'right',
                    color: feedback.length > 450 ? '#FF5722' : '#6B7280',
                    fontWeight: 500,
                  }
                }}
              />
              
              {/* Quick feedback suggestions */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#6B7280', mb: 1, display: 'block' }}>
                  Gợi ý nội dung đánh giá:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    'Dịch vụ chuyên nghiệp',
                    'Tư vấn viên tận tâm',
                    'Bác sĩ chuyên môn cao',
                    'Giải đáp rõ ràng',
                    'Quy trình nhanh chóng',
                    'Thái độ thân thiện',
                    'Môi trường riêng tư',
                    'Kết quả chính xác',
                    'Lắng nghe nhu cầu'
                  ].map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => {
                        if (feedback.length + suggestion.length + 2 <= 500) {
                          setFeedback(prev => 
                            prev ? `${prev}, ${suggestion}` : suggestion
                          );
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        height: '24px',
                        '&:hover': {
                          backgroundColor: '#E3F2FD',
                        },
                        border: '1px solid #E0E7FF',
                        color: '#4A90E2',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '0 0 20px 20px',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderColor: '#4A90E2',
            color: '#4A90E2',
            '&:hover': {
              borderColor: '#357ABD',
              background: 'rgba(74, 144, 226, 0.05)',
            }
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={rating === 0 || feedback.trim().length < 10 || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: rating > 0 && feedback.trim().length >= 10 && !loading
              ? 'linear-gradient(45deg, #4A90E2, #1ABC9C)'
              : '#E0E7FF',
            '&:hover': {
              background: rating > 0 && feedback.trim().length >= 10 && !loading
                ? 'linear-gradient(45deg, #357ABD, #16A085)'
                : '#E0E7FF',
            },
            '&:disabled': {
              color: '#9CA3AF'
            }
          }}
        >
          {loading ? (isEditMode ? 'Đang cập nhật...' : 'Đang gửi...') : (isEditMode ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;

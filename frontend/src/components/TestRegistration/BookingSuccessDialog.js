import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Zoom,
  Chip
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';

// ===== ĐỊNH NGHĨA CÁC HIỆU ỨNG ĐỘNG =====
// Các keyframes này tạo ra các animation đẹp mắt cho dialog

// Hiệu ứng nhấp nháy và phình to cho icon thành công - tạo sự chú ý vào thông báo thành công
const successPulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(74, 144, 226, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);
  }
`;

// Hiệu ứng lơ lửng lên xuống - tạo cảm giác nhẹ nhàng, không gian cho dialog
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Hiệu ứng rơi và xoay của các chấm tròn trang trí (confetti) - tạo không khí vui tươi, ăn mừng
const confettiFloat = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
`;

// Hiệu ứng nhấp nháy của các ngôi sao - tạo điểm nhấn lấp lánh cho dialog
const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

// ===== ĐỊNH NGHĨA CÁC STYLED COMPONENTS =====
// Những component được custom hóa để có giao diện đẹp và hiệu ứng động

// Dialog với thiết kế đẹp mắt, bo góc và hiệu ứng gradient
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24, // Bo góc 24px để tạo cảm giác mềm mại, hiện đại
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', // Gradient nền trắng nhẹ - tạo độ sâu
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)', // Đổ bóng mạnh để dialog nổi bật
    overflow: 'visible', // Cho phép các element trang trí tràn ra ngoài
    position: 'relative',
    // Tạo viền gradient xanh lá mờ ở ngoài - tạo hiệu ứng viền phát sáng nhẹ
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      borderRadius: 26,
      zIndex: -1,
      opacity: 0.1,
    }
  }
}));

// Icon check thành công với hiệu ứng nhấp nháy và đổ bóng - biểu tượng chính của thành công
const SuccessIcon = styled(CheckCircleRoundedIcon)(({ theme }) => ({
  fontSize: 120, // Kích thước icon lớn để thu hút sự chú ý
  color: '#4A90E2', // Màu xanh dương đẹp mắt
  animation: `${successPulse} 2s infinite`, // Áp dụng hiệu ứng nhấp nháy liên tục
  filter: 'drop-shadow(0 8px 16px rgba(74, 144, 226, 0.3))', // Đổ bóng màu xanh để tạo độ sâu
}));

// Element có hiệu ứng lơ lửng - tạo cảm giác nhẹ nhàng cho toàn bộ dialog
const FloatingElement = styled(Box)(({ theme }) => ({
  animation: `${floatAnimation} 3s ease-in-out infinite`, // Hiệu ứng lơ lửng mềm mại 3 giây
}));

// Button với hiệu ứng gradient và hover đẹp mắt - nút chính của dialog
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4A90E2 0%, #1ABC9C 100%)', // Gradient xanh dương sang xanh ngọc
  borderRadius: 16, // Bo góc 16px để hài hòa với dialog
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none', // Không viết hoa để tự nhiên hơn
  color: '#ffffff',
  boxShadow: '0 8px 24px rgba(74, 144, 226, 0.25)', // Đổ bóng nhẹ để nút nổi bật
  transition: 'all 0.3s ease', // Hiệu ứng chuyển đổi mượt mà
  '&:hover': { // Khi hover chuột
    background: 'linear-gradient(45deg, #1ABC9C 0%, #4A90E2 100%)', // Đảo ngược gradient
    transform: 'translateY(-2px)', // Nâng lên 2px tạo hiệu ứng 3D
    boxShadow: '0 12px 32px rgba(74, 144, 226, 0.35)', // Tăng đổ bóng khi hover
  },
  '&:active': { // Khi nhấn
    transform: 'translateY(0px)', // Trở về vị trí ban đầu
  }
}));

// ===== COMPONENT CHÍNH =====
// Component dialog thông báo đặt lịch thành công với giao diện đẹp mắt và nhiều hiệu ứng
const BookingSuccessDialog = ({ open, message, onClose, paymentFailed, paymentFailedMessage, onViewBookings, paymentIntentId, receiptUrl }) => {
  return (
    <StyledDialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Zoom} // Hiệu ứng zoom khi mở/đóng dialog
      transitionDuration={{
        enter: 600, // 600ms để mở dialog một cách mượt mà
        exit: 400,  // 400ms để đóng dialog nhanh hơn
      }}
    >
      {/* ===== CÁC ELEMENT TRANG TRÍ NỀN ===== */}
      {/* Tạo không gian thị giác đẹp mắt cho dialog */}
      
      {/* Hình tròn lớn ở góc trên phải - tạo điểm nhấn màu sắc */}
      <Box
        sx={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
          top: -50,
          right: -50,
          zIndex: 0,
          pointerEvents: 'none', // Không thể click để không cản trở tương tác
        }}
      />
      
      {/* Hình tròn nhỏ ở góc dưới trái - cân bằng bố cục */}
      <Box
        sx={{
          position: 'absolute',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,188,156,0.06) 0%, rgba(255,255,255,0) 70%)',
          bottom: -30,
          left: -30,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ===== HIỆU ỨNG CONFETTI ===== */}
      {/* Các chấm tròn rơi trang trí tạo không khí ăn mừng */}
      {[...Array(8)].map((_, i) => ( // Tạo 8 chấm tròn với vị trí và màu sắc khác nhau
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 8,
            height: 8,
            background: i % 2 === 0 ? '#4A90E2' : '#1ABC9C', // Xen kẽ màu xanh dương và xanh ngọc
            borderRadius: '50%',
            top: `${20 + i * 8}%`, // Vị trí theo chiều dọc - phân bố đều
            left: `${10 + i * 10}%`, // Vị trí theo chiều ngang - tạo đường chéo
            animation: `${confettiFloat} ${2 + i * 0.3}s ease-in-out infinite`, // Hiệu ứng rơi với thời gian khác nhau
            animationDelay: `${i * 0.2}s`, // Delay khác nhau cho từng chấm để tạo hiệu ứng lệch thời gian
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ===== HIỆU ỨNG NGÔI SAO NHẤP NHÁY ===== */}
      {/* Tạo điểm nhấn lấp lánh cho dialog */}
      {[...Array(6)].map((_, i) => ( // Tạo 6 ngôi sao với hiệu ứng nhấp nháy
        <Box
          key={`sparkle-${i}`}
          sx={{
            position: 'absolute',
            width: 4,
            height: 4,
            background: '#ffd700', // Màu vàng đẹp mắt
            borderRadius: '50%',
            top: `${30 + i * 12}%`,
            right: `${15 + i * 8}%`,
            animation: `${sparkle} ${1.5 + i * 0.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`, // Delay khác nhau để tạo hiệu ứng lấp lánh ngẫu nhiên
            zIndex: 0,
            pointerEvents: 'none',
            // Tạo hình dấu + cho ngôi sao - làm cho giống ngôi sao thật hơn
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '200%',
              height: '2px',
              background: '#ffd700',
              top: '50%',
              left: '-50%',
              transform: 'translateY(-50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '2px',
              height: '200%',
              background: '#ffd700',
              left: '50%',
              top: '-50%',
              transform: 'translateX(-50%)',
            }
          }}
        />
      ))}

      {/* ===== PHẦN HEADER DIALOG ===== */}
      <DialogTitle sx={{ pb: 2, pt: 4, position: 'relative', zIndex: 1 }}>
        <FloatingElement>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            flexDirection="column"
          >
            {/* Icon thành công chính */}
            <SuccessIcon />
            
            {/* Tiêu đề chính với gradient text */}
            <Typography 
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #4A90E2 0%, #1ABC9C 100%)', // Gradient text đẹp mắt
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent', // Làm cho text hiển thị gradient
                textAlign: 'center',
                mt: 2,
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.2rem' }, // Responsive font size
                letterSpacing: '-0.5px' // Điều chỉnh spacing giữa các chữ
              }}
            >
              🎉 Đặt lịch thành công!
            </Typography>
            
            {/* Subtitle mô tả */}
            <Typography 
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                fontWeight: 500,
                opacity: 0.8 // Làm mờ nhẹ để tạo hierarchy
              }}
            >
              Cảm ơn bạn đã tin tưởng chúng tôi
            </Typography>
          </Box>
        </FloatingElement>
      </DialogTitle>

      {/* ===== PHẦN NỘI DUNG DIALOG ===== */}
      <DialogContent sx={{ pt: 1, pb: 2, position: 'relative', zIndex: 1 }}>
        {/* Box chứa thông điệp chính với background gradient đẹp mắt */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(74,144,226,0.05) 0%, rgba(26,188,156,0.05) 100%)', // Gradient nhẹ
            borderRadius: 4, // Bo góc mềm mại
            p: 3,
            mb: 3,
            border: '1px solid rgba(74,144,226,0.1)', // Viền mỏng đẹp mắt
            backdropFilter: 'blur(10px)', // Hiệu ứng blur cho background
          }}
        >
          {/* Thông điệp chính */}
          <Typography 
            variant="body1" 
            align="center"
            sx={{
              fontSize: '1.1rem',
              color: 'text.primary',
              lineHeight: 1.7, // Line height thoải mái để đọc
              fontWeight: 500,
              mb: 2
            }}
          >
            {message || 'Lịch hẹn của bạn đã được ghi nhận thành công!'}
          </Typography>
          
          {/* Các thông tin bổ sung dưới dạng chips */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              {/* Chip thông báo xác nhận */}
              <Chip
                icon={<CalendarTodayIcon />}
                label="Chúng tôi sẽ liên hệ xác nhận"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(74,144,226,0.3)',
                  color: '#4A90E2',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: '#4A90E2'
                  }
                }}
              />
            </Box>
            
            {/* Chip thông tin liên hệ */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Chip
                icon={<PhoneIcon />}
                label="Qua điện thoại hoặc email"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(74,144,226,0.3)',
                  color: '#4A90E2',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: '#4A90E2'
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Thông báo thanh toán thất bại */}
        {paymentFailed && (
          <Box sx={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #ffc107',
            borderRadius: 3,
            p: 3,
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#ffc107',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>
                ⚠️
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ 
                fontWeight: 600, 
                color: '#d68910', 
                mb: 0.5,
                fontSize: '1rem'
              }}>
                Thanh toán không thành công
              </Typography>
              <Typography sx={{ 
                color: '#8d6e63', 
                fontSize: '0.9rem',
                lineHeight: 1.4
              }}>
                {paymentFailedMessage}
              </Typography>
              <Typography sx={{ 
                color: '#4A90E2', 
                fontSize: '0.85rem',
                fontWeight: 500,
                mt: 1,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}>
                💡 Bạn có thể thử lại với phương thức thanh toán khác hoặc liên hệ hỗ trợ
              </Typography>
            </Box>
          </Box>
        )}

        {/* Thông tin Stripe nếu có */}
        {(paymentIntentId || receiptUrl) && (
          <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <img src="https://stripe.com/img/v3/home/twitter.png" alt="Stripe Logo" style={{ height: 28, marginRight: 8 }} />
              <Typography variant="subtitle2" sx={{ color: '#635bff', fontWeight: 700 }}>
                Thanh toán an toàn qua Stripe
              </Typography>
            </Box>
            {paymentIntentId && (
              <Typography variant="body2" sx={{ color: '#333', fontSize: '0.98rem' }}>
                Mã giao dịch: <b>{paymentIntentId}</b>
              </Typography>
            )}
            {receiptUrl && (
              <Typography variant="body2" sx={{ color: '#1976d2', fontSize: '0.98rem', mt: 0.5 }}>
                <a href={receiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>
                  Xem biên lai từ Gender Health
                </a>
              </Typography>
            )}
          </Box>
        )}

        {/* Lời cảm ơn cuối */}
        <Typography 
          variant="body2" 
          align="center"
          sx={{
            fontSize: '0.95rem',
            color: 'text.secondary',
            fontStyle: 'italic',
            opacity: 0.7 // Làm mờ nhẹ để tạo điểm nhấn khác biệt
          }}
        >
          💚 Cảm ơn bạn đã chọn dịch vụ của chúng tôi!
        </Typography>
      </DialogContent>

      {/* ===== PHẦN FOOTER VỚI CÁC NÚT HÀNH ĐỘNG ===== */}
      <DialogActions sx={{ px: 4, pb: 4, position: 'relative', zIndex: 1, gap: 2 }}>
        {/* Nút xem lịch đã đặt - chỉ hiển thị khi có callback function */}
        {onViewBookings && (
          <Button
            onClick={onViewBookings}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 3,
              borderColor: '#4A90E2',
              color: '#4A90E2',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#1976D2',
                backgroundColor: 'rgba(74,144,226,0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(74,144,226,0.2)',
              },
            }}
          >
            📅 Xem lịch đã đặt
          </Button>
        )}
        
        {/* Nút đóng dialog với hiệu ứng gradient đẹp mắt */}
        <GradientButton 
          onClick={onClose} 
          sx={{ flex: onViewBookings ? 1 : 'unset', width: onViewBookings ? 'auto' : '100%' }}
        >
          ✨ Hoàn tất
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};

// ===== ĐỊNH NGHĨA PROP TYPES ===== 
// Xác định kiểu dữ liệu cho các props của component để đảm bảo tính chính xác
BookingSuccessDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Bắt buộc: trạng thái mở/đóng dialog
  message: PropTypes.string, // Tùy chọn: thông điệp tùy chỉnh để hiển thị
  onClose: PropTypes.func.isRequired, // Bắt buộc: hàm callback khi đóng dialog
  paymentFailed: PropTypes.bool, // Tùy chọn: trạng thái thanh toán thất bại
  paymentFailedMessage: PropTypes.string, // Tùy chọn: thông báo lỗi thanh toán
  onViewBookings: PropTypes.func, // Tùy chọn: hàm callback khi xem lịch đã đặt
  paymentIntentId: PropTypes.string,
  receiptUrl: PropTypes.string,
};

// Export component để sử dụng ở nơi khác
export default BookingSuccessDialog;

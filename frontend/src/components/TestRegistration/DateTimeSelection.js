import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import vi from 'date-fns/locale/vi';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// ===== COMPONENT CHỌN NGÀY GIỜ KHÁM =====
// Component này cho phép người dùng chọn ngày, giờ và ghi chú cho cuộc hẹn khám
const DateTimeSelection = ({
  selectedDate,    // Ngày được chọn
  selectedTime,    // Giờ được chọn  
  onDateChange,    // Hàm xử lý khi thay đổi ngày
  onTimeChange,    // Hàm xử lý khi thay đổi giờ
  timeSlots,       // Danh sách các khung giờ có sẵn
  note,           // Ghi chú của người dùng
  onNoteChange    // Hàm xử lý khi thay đổi ghi chú
}) => {
  
  // ===== HÀM KIỂM TRA TÍNH HỢP LỆ CỦA KHUNG GIỜ =====
  // Hàm này kiểm tra xem một khung giờ có thể đặt được hay không
  // Nguyên tắc: Nếu chọn ngày hôm nay, phải cách thời điểm hiện tại ít nhất 2 tiếng
  const isTimeSlotValid = (timeSlot) => {
    // Nếu chưa chọn ngày thì tất cả khung giờ đều hợp lệ
    if (!selectedDate) return true;
    
    // Lấy thời gian hiện tại và chuyển về ngày (bỏ giờ phút)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    // Nếu ngày được chọn không phải hôm nay, tất cả khung giờ đều hợp lệ
    if (selectedDateOnly.getTime() !== today.getTime()) {
      return true;
    }
    
    // Nếu là ngày hôm nay, kiểm tra xem khung giờ có trong tương lai không
    const [hours, minutes] = timeSlot.split(':').map(Number); // Tách giờ và phút từ string "HH:MM"
    const timeSlotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    // Thêm buffer 2 tiếng từ thời điểm hiện tại để chuẩn bị đặt lịch
    const currentTimeWithBuffer = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 tiếng = 2 * 60 * 60 * 1000ms
    
    const isValid = timeSlotTime > currentTimeWithBuffer;
    
    // Debug log để kiểm tra logic - chỉ log một số khung giờ cụ thể để tránh spam console
    if (timeSlot === '17:00' || timeSlot === '16:00') {
      console.log(`Debug ${timeSlot} slot:`, {
        timeSlot,
        currentTime: now.toLocaleString('vi-VN'),
        timeSlotTime: timeSlotTime.toLocaleString('vi-VN'), 
        currentTimeWithBuffer: currentTimeWithBuffer.toLocaleString('vi-VN'),
        isValid,
        comparison: `${timeSlotTime.getTime()} > ${currentTimeWithBuffer.getTime()} = ${isValid}`
      });
    }
    
    return isValid;
  };
  
  // ===== GIAO DIỆN COMPONENT =====
  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, // Padding responsive: nhỏ 16px, lớn 24px
    }}>
      {/* ===== LAYOUT CHÍNH - CHIA 2 CỘT ===== */}
      {/* Bố cục chính: desktop 2 cột ngang, mobile 1 cột dọc */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 3, md: 4 }, // Khoảng cách giữa các cột
        flexDirection: { xs: 'column', md: 'row' }, // Mobile: dọc, Desktop: ngang
        alignItems: 'stretch' // Các cột có chiều cao bằng nhau
      }}>
        
        {/* ===== PHẦN CHỌN NGÀY ===== */}
        <Box sx={{ 
          flex: { md: 1 }, // Chiếm 1 phần trong desktop
          minWidth: { xs: '100%', md: '350px' }, // Chiều rộng tối thiểu
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' // Căn giữa nội dung
        }}>
          
          {/* Header phần chọn ngày với nền sáng */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            width: '100%',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 255, 0.9))', // Nền trắng nhẹ
            borderRadius: '12px',
            p: 1.5,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
          }}>
            <CalendarTodayIcon sx={{ 
              mr: 1, 
              fontSize: '1.3rem', 
              color: '#2196F3',
              filter: 'drop-shadow(0 2px 4px rgba(33, 150, 243, 0.3))' // Đổ bóng xanh cho icon
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              fontSize: '1.15rem', 
              color: '#000',
              letterSpacing: '0.5px' // Giãn chữ nhẹ
            }}>
              Chọn ngày
            </Typography>
          </Box>
          
          {/* ===== CALENDAR PICKER ===== */}
          {/* Component chọn ngày với giao diện tiếng Việt và style custom */}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
            <StaticDatePicker
              value={selectedDate}
              onChange={onDateChange}
              minDate={new Date()} // Không cho phép chọn ngày trong quá khứ
              displayStaticWrapperAs="desktop" // Hiển thị dạng desktop
              slotProps={{
                actionBar: {
                  actions: []  // Ẩn các nút Cancel và OK không cần thiết
                }
              }}
              sx={{ 
                // ===== STYLE CHO HEADER CALENDAR =====
                '& .MuiPickersCalendarHeader-root': {
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 255, 0.9))', // Nền trắng nhẹ
                  borderRadius: '12px 12px 0 0', // Bo góc trên
                  paddingTop: 1.5,
                  paddingBottom: 1.5,
                  border: '1px solid rgba(33, 150, 243, 0.2)', // Viền xanh nhẹ
                },
                
                // ===== STYLE CHO TEXT THÁNG/NĂM =====
                '& .MuiPickersCalendarHeader-label': {
                  color: '#000', // Màu đen
                  fontWeight: 600,
                },
                
                // ===== STYLE CHO CÁC NÚT ĐIỀU HƯỚNG =====
                '& .MuiIconButton-root': {
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)', // Hover nhẹ
                  },
                },
                
                // ===== STYLE CHO CÁC NGÀY TRONG THÁNG =====
                '& .MuiPickersDay-root': {
                  borderRadius: '50%', // Hình tròn
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  color: '#000', // Màu đen cho ngày thường
                  border: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)', // Hover nhẹ
                  },
                  
                  // ===== STYLE CHO NGÀY ĐƯỢC CHỌN =====
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #2196F3, #00BFA5)', // Gradient xanh
                    color: 'white', // Text trắng cho ngày được chọn để dễ đọc
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)', // Đổ bóng
                    transform: 'scale(1.1)', // Phóng to nhẹ
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976d2, #00ACC1)', // Gradient đậm hơn khi hover
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                    },
                  },
                  
                  // ===== STYLE CHO NGÀY HÔM NAY =====
                  '&.MuiPickersDay-today': {
                    color: '#2196F3', // Text xanh cho ngày hôm nay
                    fontWeight: 600,
                    border: '2px solid #2196F3', // Viền xanh
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #2196F3, #00BFA5)',
                      color: 'white',
                      border: '2px solid #1976d2',
                    },
                  },
                },
                
                // ===== STYLE CHO NỀN CALENDAR =====
                '& .MuiDayCalendar-root': {
                  background: 'white', // Nền trắng sạch
                  borderRadius: '0 0 12px 12px', // Bo góc dưới
                  padding: 2.5,
                },
                
                // ===== STYLE CHO KHUNG TỔNG THỂ =====
                '& .MuiPickersLayout-root': {
                  border: '2px solid rgba(33, 150, 243, 0.3)', // Viền xanh
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
                  backgroundColor: 'white',
                },
                
                // ===== STYLE CHO LABEL CÁC THỨ TRONG TUẦN =====
                '& .MuiDayCalendar-weekDayLabel': {
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                },
                
                // ===== ẨN ACTION BAR =====
                '& .MuiPickersLayout-actionBar': {
                  display: 'none', // Ẩn hoàn toàn thanh nút phía dưới
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* ===== PHẦN CHỌN GIỜ KHÁM ===== */}
        <Box sx={{ 
          flex: { md: 1 }, // Chiếm 1 phần trong desktop
          minWidth: { xs: '100%', md: '300px' } // Chiều rộng tối thiểu
        }}>
          
          {/* Header phần chọn giờ với nền sáng */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 255, 0.9))', // Nền trắng nhẹ
            borderRadius: '12px',
            p: 1.5,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
          }}>
            <AccessTimeIcon sx={{ 
              mr: 1, 
              fontSize: '1.3rem', 
              color: '#00BFA5',
              filter: 'drop-shadow(0 2px 4px rgba(0, 191, 165, 0.3))'
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              fontSize: '1.15rem', 
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              Chọn giờ khám
            </Typography>
          </Box>
            
          {/* ===== GRID CÁC KHUNG GIỜ ===== */}
          {/* Lưới các nút chọn giờ với layout responsive */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)',   // Mobile: 2 cột
              sm: 'repeat(3, 1fr)',   // Small: 3 cột  
              md: 'repeat(2, 1fr)',   // Medium: 2 cột
              lg: 'repeat(3, 1fr)'    // Large: 3 cột
            },
            gap: 1.5, // Khoảng cách giữa các nút
            mb: 2
          }}>
            {/* Duyệt qua tất cả khung giờ để tạo các nút */}
            {/* Kiểm tra an toàn trước khi map để tránh lỗi runtime */}
            {Array.isArray(timeSlots) && timeSlots.map((time) => {
              const isValid = isTimeSlotValid(time); // Kiểm tra khung giờ có hợp lệ không
              const isSelected = selectedTime === time; // Kiểm tra khung giờ có được chọn không
              
              return (
                <Button
                  key={time}
                  variant={isSelected ? 'contained' : 'outlined'} // Nút được chọn dạng contained, còn lại outlined
                  onClick={() => isValid && onTimeChange(time)} // Chỉ cho phép click nếu valid
                  disabled={!isValid} // Disable nút nếu không hợp lệ
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: '8px', // Bo góc đồng bộ với style chung
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textTransform: 'none', // Không viết hoa
                    minHeight: '40px',
                    
                    // ===== LOGIC MÀU SẮC PHỨC TẠP =====
                    // Background: Xám nhạt cho disabled, gradient xanh ngọc cho selected, trắng cho normal
                    background: !isValid 
                      ? 'linear-gradient(135deg, rgba(158, 158, 158, 0.12), rgba(158, 158, 158, 0.08))' 
                      : isSelected 
                        ? 'linear-gradient(135deg, #00BFA5, #00ACC1)' 
                        : 'white',
                    
                    // Border color tương ứng với background
                    borderColor: !isValid 
                      ? 'rgba(158, 158, 158, 0.23)'
                      : isSelected 
                        ? 'transparent' 
                        : 'rgba(0, 191, 165, 0.4)',
                    
                    // Text color
                    color: !isValid 
                      ? 'rgba(0, 0, 0, 0.26)' // Xám nhạt cho disabled
                      : isSelected 
                        ? 'white'  // Trắng cho selected
                        : '#000', // Đen cho normal
                    
                    // Box shadow
                    boxShadow: isSelected && isValid 
                      ? '0 6px 20px rgba(0, 191, 165, 0.4), 0 2px 8px rgba(0, 191, 165, 0.2)' 
                      : !isValid 
                        ? 'none'
                        : '0 2px 8px rgba(0, 191, 165, 0.1)',
                    
                    cursor: !isValid ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    
                    // ===== HIỆU ỨNG HOVER =====
                    '&:hover': !isValid ? {} : {
                      background: isSelected 
                        ? 'linear-gradient(135deg, #00ACC1, #0097A7)' // Gradient đậm hơn cho selected
                        : 'rgba(0, 191, 165, 0.1)', // Xanh nhạt cho normal
                      borderColor: isSelected ? 'rgba(0, 191, 165, 0.8)' : '#00BFA5',
                      transform: 'translateY(-2px) scale(1.02)', // Nâng lên và phóng to nhẹ
                      boxShadow: isSelected 
                        ? '0 8px 25px rgba(0, 191, 165, 0.5), 0 4px 12px rgba(0, 191, 165, 0.3)'
                        : '0 6px 20px rgba(0, 191, 165, 0.25), 0 2px 8px rgba(0, 191, 165, 0.15)'
                    },
                    
                    // ===== STYLE KHI DISABLED =====
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(158, 158, 158, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                      borderColor: 'rgba(158, 158, 158, 0.23)',
                      cursor: 'not-allowed'
                    },
                    
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Animation mượt mà
                  }}
                >
                  {time}
                </Button>
              );
            })}
          </Box>
          
          {/* ===== THÔNG BÁO TRẠNG THÁI KHUNG GIỜ ===== */}
          {/* Hiển thị thông báo tùy theo tình trạng các khung giờ trong ngày được chọn */}
          {selectedDate && (() => {
            // Tính toán các giá trị cần thiết
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const isToday = selectedDateOnly.getTime() === today.getTime(); // Kiểm tra có phải ngày hôm nay
            
            if (isToday) {
              // Phân loại các khung giờ
              const disabledSlots = timeSlots.filter(time => !isTimeSlotValid(time)); // Khung giờ không hợp lệ
              const availableSlots = timeSlots.filter(time => isTimeSlotValid(time)); // Khung giờ có thể đặt
              
              // ===== TRƯỜNG HỢP: MỘT SỐ KHUNG GIỜ BỊ VÔ HIỆU HÓA =====
              if (disabledSlots.length > 0 && availableSlots.length > 0) {
                // Hiển thị thông báo khi còn khung giờ khả dụng nhưng một số đã bị vô hiệu hóa
                return (
                  <Box sx={{ 
                    mt: 2,
                    p: 2,
                    backgroundColor: 'rgba(0, 191, 165, 0.05)', // Nền xanh ngọc rất nhẹ
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 191, 165, 0.2)' // Viền xanh ngọc
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#000',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}
                    >
                      📅 Đặt lịch ngày hôm nay
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#000',
                        fontSize: '0.85rem',
                        lineHeight: 1.5
                      }}
                    >
                      Thời gian đặt phải cách 2 tiếng tính từ lúc đặt.
                    </Typography>
                  </Box>
                );
              
              // ===== TRƯỜNG HỢP: TẤT CẢ KHUNG GIỜ ĐỀU BỊ VÔ HIỆU HÓA =====  
              } else if (availableSlots.length === 0 && timeSlots.length > 0) {
                // Hiển thị cảnh báo khi tất cả khung giờ hôm nay đều không thể đặt
                return (
                  <Box sx={{ 
                    mt: 2,
                    p: 2,
                    backgroundColor: 'rgba(255, 193, 7, 0.05)', // Nền vàng rất nhẹ cho cảnh báo
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 193, 7, 0.3)' // Viền vàng
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#000', // Màu đen cho cảnh báo
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}
                    >
                      ⚠️ Hết khung giờ khả dụng hôm nay
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#000',
                        fontSize: '0.85rem',
                        lineHeight: 1.5
                      }}
                    >
                      Tất cả khung giờ hôm nay đã qua hoặc không đủ thời gian chuẩn bị (cần cách ít nhất 2 tiếng). Vui lòng chọn ngày khác.
                    </Typography>
                  </Box>
                );
              
              // ===== TRƯỜNG HỢP: TẤT CẢ KHUNG GIỜ ĐỀU KHẢ DỤNG =====
              } else if (availableSlots.length === timeSlots.length) {
                // Hiển thị thông báo tích cực khi tất cả khung giờ đều có thể đặt
                return (
                  <Box sx={{ 
                    mt: 2,
                    p: 2,
                    backgroundColor: 'rgba(0, 191, 165, 0.05)', // Nền xanh ngọc rất nhẹ
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 191, 165, 0.2)'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#000',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      ✅ Tất cả khung giờ đều có sẵn cho ngày hôm nay!
                    </Typography>
                  </Box>
                );
              }
            }
            // Trả về null nếu không có điều kiện nào thỏa mãn
            return null;
          })()}
          
          {/* ===== TRẠNG THÁI EMPTY - CHƯA CÓ KHUNG GIỜ NÀO ===== */}
          {/* Hiển thị khi chưa chọn ngày hoặc ngày được chọn không có khung giờ nào */}
          {timeSlots.length === 0 && (
            <Box sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              backgroundColor: 'rgba(0, 191, 165, 0.05)', // Nền xanh ngọc rất nhẹ
              borderRadius: '8px',
              border: '1px dashed rgba(0, 191, 165, 0.2)' // Viền đứt nét
            }}>
              <AccessTimeIcon sx={{ 
                fontSize: '2rem', 
                color: 'rgba(0, 191, 165, 0.4)', // Icon mờ
                mb: 1
              }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#000',
                  fontStyle: 'italic',
                  fontWeight: 500
                }}
              >
                Vui lòng chọn ngày để xem các khung giờ có sẵn
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* ===== PHẦN GHI CHÚ ===== */}
      {/* Cho phép người dùng nhập ghi chú bổ sung cho cuộc hẹn */}
      <Box sx={{ mt: 3 }}>
        
        {/* Tiêu đề phần ghi chú với gradient text */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '1.15rem',
            color: '#000', // Màu đen thay vì gradient
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          📝 Ghi chú (tùy chọn)
        </Typography>
        
        {/* TextField cho ghi chú với style custom */}
        <TextField
          fullWidth
          multiline // Cho phép nhập nhiều dòng
          rows={3} // Chiều cao mặc định 3 dòng
          value={note || ''} // Giá trị ghi chú, mặc định chuỗi rỗng
          onChange={(e) => onNoteChange(e.target.value)} // Callback khi thay đổi
          placeholder="Nhập ghi chú cho cuộc hẹn của bạn (triệu chứng, yêu cầu đặc biệt...)"
          sx={{              
            // ===== STYLE CHO CONTAINER INPUT =====
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', // Bo góc
              background: 'white', // Nền trắng sạch
              
              // ===== STYLE CHO VIỀN =====
              '& fieldset': {
                borderColor: 'rgba(33, 150, 243, 0.3)', // Viền xanh nhạt
                borderWidth: '2px',
              },
              
              // ===== STYLE KHI HOVER =====
              '&:hover fieldset': {
                borderColor: 'rgba(33, 150, 243, 0.6)', // Viền xanh đậm hơn
                boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)', // Đổ bóng nhẹ
              },
              
              // ===== STYLE KHI FOCUS =====
              '&.Mui-focused fieldset': {
                borderColor: '#2196F3', // Viền xanh đậm
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.15), 0 4px 12px rgba(33, 150, 243, 0.2)', // Đổ bóng focus
              },
              
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Animation mượt mà
            },
            
            // ===== STYLE CHO TEXT TRONG INPUT =====
            '& .MuiInputBase-input': {
              fontSize: '0.95rem',
              color: '#000', // Màu text đen
              fontWeight: 500,
              
              // ===== STYLE CHO PLACEHOLDER =====
              '&::placeholder': {
                color: '#666', // Màu xám cho placeholder
                opacity: 0.8,
              },
            },
          }}
        />
        
        {/* Text hướng dẫn cho người dùng */}
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1,
            display: 'block',
            color: '#666', // Màu xám đen
            fontSize: '0.75rem',
            fontStyle: 'italic'
          }}
        >
          Thông tin này sẽ giúp bác sĩ chuẩn bị tốt hơn cho cuộc khám của bạn
        </Typography>
      </Box>
    </Box>
  );
};

// ===== ĐỊNH NGHĨA PROP TYPES =====
// Xác định kiểu dữ liệu cho các props để đảm bảo tính chính xác
DateTimeSelection.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Ngày được chọn (Date object hoặc null)
  selectedTime: PropTypes.string.isRequired, // Giờ được chọn (bắt buộc, string)
  onDateChange: PropTypes.func.isRequired, // Hàm callback khi thay đổi ngày (bắt buộc)
  onTimeChange: PropTypes.func.isRequired, // Hàm callback khi thay đổi giờ (bắt buộc)
  timeSlots: PropTypes.arrayOf(PropTypes.string).isRequired, // Mảng các khung giờ (bắt buộc)
  note: PropTypes.string, // Ghi chú (tùy chọn, string)
  onNoteChange: PropTypes.func.isRequired, // Hàm callback khi thay đổi ghi chú (bắt buộc)
};

// Export component để sử dụng ở nơi khác
export default DateTimeSelection;

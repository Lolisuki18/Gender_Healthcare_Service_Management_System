import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Tooltip, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Droplets, Heart, X } from 'lucide-react';
import ovulationService from '../../services/ovulationService';
import styles from './MenstrualCycleCalendar.module.css';
import { Calendar } from 'lucide-react';

const MenstrualCycleCalendar = ({ cycle, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date(cycle.startDate));
  const [pregnancyData, setPregnancyData] = useState(null);
  const [isLoadingPregnancy, setIsLoadingPregnancy] = useState(true);

  // Lấy dữ liệu tỉ lệ mang thai từ API
  useEffect(() => {
    const fetchPregnancyData = async () => {
      try {
        setIsLoadingPregnancy(true);
        console.log('🔍 [Calendar] Fetching pregnancy data for cycle:', cycle.id);
        
        const response = await ovulationService.getPregnancyProbabilityByCycle(cycle.id);
        console.log('🔍 [Calendar] API Response:', response);
        
        if (response.success && response.data) {
          setPregnancyData(response.data);
          console.log('✅ [Calendar] Pregnancy data loaded successfully:', response.data);
        } else {
          console.log('⚠ [Calendar] API returned no data or failed');
          setPregnancyData(null);
        }
      } catch (error) {
        console.error('❌ [Calendar] Error fetching pregnancy data:', error);
        // Fallback to default calculation if API fails
        setPregnancyData(null);
      } finally {
        setIsLoadingPregnancy(false);
      }
    };

    if (cycle.id) {
      fetchPregnancyData();
    } else {
      setIsLoadingPregnancy(false);
    }
  }, [cycle.id]);

  // Tính toán các ngày quan trọng trong chu kỳ
  const cycleInfo = useMemo(() => {
    const startDate = new Date(cycle.startDate);
    const ovulationDate = new Date(cycle.ovulationDate);
    const periodEnd = new Date(startDate);
    periodEnd.setDate(startDate.getDate() + cycle.numberOfDays - 1);
    
    // Thời kỳ thụ thai (5 ngày trước đến 1 ngày sau rụng trứng)
    const fertilityStart = new Date(ovulationDate);
    fertilityStart.setDate(ovulationDate.getDate() - 5);
    const fertilityEnd = new Date(ovulationDate);
    fertilityEnd.setDate(ovulationDate.getDate() + 1);
    
    // Chu kỳ tiếp theo dự kiến
    const nextCycleStart = new Date(startDate);
    nextCycleStart.setDate(startDate.getDate() + cycle.cycleLength);
    
    return {
      startDate,
      periodEnd,
      ovulationDate,
      fertilityStart,
      fertilityEnd,
      nextCycleStart
    };
  }, [cycle]);

  // Tính tỉ lệ mang thai theo ngày
  const getPregnancyChance = (date, dayType) => {
    // Chỉ sử dụng dữ liệu từ API
    if (pregnancyData && Array.isArray(pregnancyData)) {
      const dateString = date.toISOString().split('T')[0];
      const dayData = pregnancyData.find(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate === dateString;
      });
      
      if (dayData && dayData.pregnancyProbability !== undefined) {
        // API trả về số thập phân, giữ nguyên độ chính xác
        const percentage = dayData.pregnancyProbability;
        console.log(`📊 [Calendar] Pregnancy chance for ${dateString}: ${percentage}% (from API)`);
        return percentage;
      }
    }
    
    // Nếu không có dữ liệu từ API, hiển thị tỉ lệ mặc định theo loại ngày
    if (dayType === 'period') {
      console.log(`📊 [Calendar] Default pregnancy chance for period day: 1%`);
      return 1.0;
    } else if (dayType === 'normal') {
      console.log(`📊 [Calendar] Default pregnancy chance for normal day: 2.1%`);
      return 2.1;
    }
    
    // Các loại ngày khác (ovulation, fertility) trả về 0 để hiển thị "Không có dữ liệu"
    console.log(`📊 [Calendar] No data available for ${date.toISOString().split('T')[0]}`);
    return 0;
  };

  // Xác định loại ngày
  const getDayType = (date) => {
    const dateTime = date.getTime();
    const startTime = cycleInfo.startDate.getTime();
    const periodEndTime = cycleInfo.periodEnd.getTime();
    const ovulationTime = cycleInfo.ovulationDate.getTime();
    const fertilityStartTime = cycleInfo.fertilityStart.getTime();
    const fertilityEndTime = cycleInfo.fertilityEnd.getTime();
    
    if (dateTime >= startTime && dateTime <= periodEndTime) {
      return 'period';
    }
    if (dateTime === ovulationTime) {
      return 'ovulation';
    }
    if (dateTime >= fertilityStartTime && dateTime <= fertilityEndTime) {
      return 'fertility';
    }
    return 'normal';
  };

  // Lấy thông tin tooltip cho ngày
  const getDayTooltip = (date, dayType) => {
    const pregnancyChance = getPregnancyChance(date, dayType);
    const formatDate = (d) => d.toLocaleDateString('vi-VN');
    
    // Format tỉ lệ mang thai với 1 chữ số thập phân
    const formatPercentage = (value) => {
      if (value === 0) return 'Không có dữ liệu';
      return `${value.toFixed(1)}%`;
    };
    
    switch (dayType) {
      case 'period':
        return {
          title: '🩸 Ngày hành kinh',
          content: `Ngày ${formatDate(date)}\n• Thời kỳ hành kinh\n• Tỉ lệ mang thai: ${formatPercentage(pregnancyChance)}\n• Lưu ý: Cần vệ sinh cá nhân tốt`,
          color: '#ef4444'
        };
      case 'ovulation':
        return {
          title: '🥚 Ngày rụng trứng',
          content: `Ngày ${formatDate(date)}\n• Ngày rụng trứng\n• Tỉ lệ mang thai: ${formatPercentage(pregnancyChance)}\n• Đây là ngày có khả năng thụ thai cao nhất`,
          color: '#f59e0b'
        };
      case 'fertility':
        return {
          title: '💕 Thời kỳ thụ thai',
          content: `Ngày ${formatDate(date)}\n• Thời kỳ thụ thai\n• Tỉ lệ mang thai: ${formatPercentage(pregnancyChance)}\n• Khả năng thụ thai cao`,
          color: '#ec4899'
        };
      default:
        return {
          title: '📅 Ngày bình thường',
          content: `Ngày ${formatDate(date)}\n• Ngày bình thường trong chu kỳ\n• Tỉ lệ mang thai: ${formatPercentage(pregnancyChance)}\n• An toàn tương đối`,
          color: '#6b7280'
        };
    }
  };

  // Tạo lịch cho tháng hiện tại
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay()); // Bắt đầu từ Chủ nhật

    const calendar = [];
    const current = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(current);
        const isCurrentMonth = date.getMonth() === month;
        const dayType = isCurrentMonth ? getDayType(date) : 'normal';
        const tooltip = isCurrentMonth ? getDayTooltip(date, dayType) : null;
        
        weekDays.push({
          date,
          isCurrentMonth,
          dayType,
          tooltip
        });
        
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          maxHeight: '90vh',
          margin: '20px',
          background: '#fff',
          boxShadow: '0 4px 24px rgba(162,89,230,0.08)',
          border: '1px solid #f3f4f6'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(162, 89, 230, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        pt: 3,
        px: 4,
        borderBottom: '1px solid #f3f4f6',
        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
        fontWeight: '600',
        height: '100px',
      }}>
        <Box className={styles.cycleListIconWrapper}>
            <Calendar className={styles.cycleListIcon} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: '700 !important',
          fontSize: '1.4rem !important',
          margin: '0 !important',
          color: '#fff !important',
          letterSpacing: '0.5px !important',
        }}>
          Lịch chu kỳ kinh nguyệt
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: '#6b7280',
            '&:hover': {
              backgroundColor: '#f3f4f6',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <X size={24} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, pt: 3 }}>

        {/* Thông tin chu kỳ */}
        <Box sx={{ 
          mb: 3, 
          p: 3, 
          backgroundColor: '#fff', 
          borderRadius: '20px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 24px rgba(162,89,230,0.08)'
        }}>
          <Typography variant="h6" sx={{ 
            color: '#1f2937', 
            mb: 2,
            fontWeight: '600',
            fontSize: '1.25rem'
          }}>
            Chu kỳ hiện tại
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
            <Box>
              <Typography sx={{ 
                fontSize: '14px', 
                color: '#6b7280',
                fontWeight: '500',
                mb: 0.5
              }}>
                Bắt đầu
              </Typography>
              <Typography sx={{ 
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '1.1rem'
              }}>
                {cycleInfo.startDate.toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ 
                fontSize: '14px', 
                color: '#6b7280',
                fontWeight: '500',
                mb: 0.5
              }}>
                Độ dài chu kỳ
              </Typography>
              <Typography sx={{ 
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '1.1rem'
              }}>
                {cycle.cycleLength} ngày
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ 
                fontSize: '14px', 
                color: '#6b7280',
                fontWeight: '500',
                mb: 0.5
              }}>
                Rụng trứng
              </Typography>
              <Typography sx={{ 
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '1.1rem'
              }}>
                {cycleInfo.ovulationDate.toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Điều hướng tháng */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: '20px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 24px rgba(162,89,230,0.08)'
        }}>
          <IconButton 
            onClick={goToPreviousMonth}
            sx={{
              color: '#e57399',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              padding: '8px',
              '&:hover': {
                backgroundColor: '#fce4ec',
                transform: 'scale(1.1)',
                borderColor: '#e57399'
              },
              transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Typography variant="h6" sx={{ 
            fontWeight: '600', 
            color: '#1f2937',
            fontSize: '1.25rem'
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <IconButton 
            onClick={goToNextMonth}
            sx={{
              color: '#e57399',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              padding: '8px',
              '&:hover': {
                backgroundColor: '#fce4ec',
                transform: 'scale(1.1)',
                borderColor: '#e57399'
              },
              transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Box>

        {/* Lịch */}
        <div className={styles.calendar}>
          {/* Header ngày trong tuần */}
          <div className={styles.weekHeader}>
            {dayNames.map(day => (
              <div key={day} className={styles.dayHeader}>
                {day}
              </div>
            ))}
          </div>

          {/* Các tuần */}
          {calendar.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week}>
              {week.map((dayData, dayIndex) => {
                const { date, isCurrentMonth, dayType, tooltip } = dayData;
                return (
                  <Tooltip
                    key={dayIndex}
                    title={
                      tooltip ? (
                        <Box sx={{ 
                          p: 1.5,
                          backgroundColor: tooltip.color,
                          borderRadius: '8px',
                          color: 'white',
                          minWidth: '200px'
                        }}>
                          <Typography sx={{ 
                            fontWeight: '600', 
                            mb: 1, 
                            fontSize: '14px',
                            color: 'white'
                          }}>
                            {tooltip.title}
                          </Typography>
                          <Typography sx={{ 
                            fontSize: '12px', 
                            whiteSpace: 'pre-line',
                            color: 'white',
                            lineHeight: 1.4
                          }}>
                            {tooltip.content}
                          </Typography>
                        </Box>
                      ) : ''
                    }
                    arrow
                    placement="top"
                    PopperProps={{
                      sx: {
                        zIndex: 10000, // Cao hơn z-index của modal (9999)
                        '& .MuiTooltip-tooltip': {
                          backgroundColor: 'transparent',
                          padding: 0,
                          maxWidth: 'none'
                        },
                        '& .MuiTooltip-arrow': {
                          color: tooltip?.color || '#6b7280',
                        }
                      }
                    }}
                  >
                    <div
                      className={`${styles.day} ${
                        isCurrentMonth ? styles.currentMonth : styles.otherMonth
                      } ${styles[dayType]} ${isLoadingPregnancy ? styles.loadingDay : ''}`}
                    >
                      <span className={styles.dayNumber}>
                        {date.getDate()}
                      </span>
                      {isCurrentMonth && dayType !== 'normal' && (
                        <div className={styles.dayIndicator}>
                          {dayType === 'period' && <Droplets size={12} />}
                          {dayType === 'ovulation' && <span className={styles.ovulationDot} />}
                          {dayType === 'fertility' && <Heart size={12} />}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Chú thích */}
        <Box sx={{ 
          mt: 3, 
          p: 3, 
          backgroundColor: '#fff', 
          borderRadius: '20px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 24px rgba(162,89,230,0.08)'
        }}>
          <Typography sx={{ 
            fontWeight: '600', 
            mb: 3, 
            color: '#1f2937',
            fontSize: '1.25rem'
          }}>
            Chú thích:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <div className={`${styles.legendItem} ${styles.period}`} />
              <Typography sx={{ 
                fontSize: '15px',
                color: '#1f2937',
                fontWeight: '500'
              }}>
                Ngày hành kinh
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <div className={`${styles.legendItem} ${styles.fertility}`} />
              <Typography sx={{ 
                fontSize: '15px',
                color: '#1f2937',
                fontWeight: '500'
              }}>
                Thời kỳ thụ thai
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <div className={`${styles.legendItem} ${styles.ovulation}`} />
              <Typography sx={{ 
                fontSize: '15px',
                color: '#1f2937',
                fontWeight: '500'
              }}>
                Ngày rụng trứng
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <div className={`${styles.legendItem} ${styles.normal}`} />
              <Typography sx={{ 
                fontSize: '15px',
                color: '#1f2937',
                fontWeight: '500'
              }}>
                Ngày bình thường
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Ghi chú */}
        <Box sx={{ 
          mt: 3, 
          p: 3, 
          backgroundColor: '#ede9fe', 
          borderRadius: '20px', 
          border: '1px solid #a259e6',
          boxShadow: '0 4px 24px rgba(162,89,230,0.08)'
        }}>
          <Typography sx={{ 
            fontWeight: '600', 
            mb: 2, 
            color: '#6b21a8', 
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            💡 Lưu ý
          </Typography>
          <Typography sx={{ 
            fontSize: '14px', 
            color: '#6b21a8', 
            lineHeight: 1.6,
            fontWeight: '500'
          }}>
            • Di chuyển chuột lên các ngày để xem thông tin chi tiết<br/>
            • Tỉ lệ mang thai được tính toán dựa trên dữ liệu cá nhân và thuật toán khoa học<br/>
            • Mỗi người có chu kỳ khác nhau, hãy theo dõi cơ thể của bạn<br/>
            • Kết quả chỉ mang tính chất tham khảo, không thay thế lời khuyên y tế
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MenstrualCycleCalendar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes để validate props
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  Grid,
  Chip,
} from '@mui/material';

// ===== HÀM HELPER TRÍCH XUẤT THÔNG TIN XÉT NGHIỆM =====
// Hàm này xử lý và chuẩn hóa dữ liệu từ service để hiển thị
const extractTestMetrics = (service) => {
  if (!service) return null; // Trả về null nếu không có dữ liệu service
  
  const metrics = {};

  // Thêm thời gian có kết quả ước tính (mặc định 2-3 ngày)
  metrics.resultTime = '2-3 ngày có kết quả';

  return metrics;
};

// ===== COMPONENT DIALOG CHI TIẾT DỊCH VỤ =====
// Component này hiển thị thông tin chi tiết của dịch vụ xét nghiệm đơn lẻ hoặc gói xét nghiệm
const ServiceDetailDialog = ({
  open,           // Trạng thái mở/đóng dialog
  onClose,        // Hàm đóng dialog
  detailData,     // Dữ liệu chi tiết dịch vụ/gói
  detailType,     // Loại dịch vụ: 'single' (đơn lẻ) hoặc 'package' (gói)
  loadingDetail,  // Trạng thái loading khi tải dữ liệu chi tiết
  onOpenDetail,   // Hàm mở chi tiết dịch vụ con trong gói
  onSelectService // Hàm chọn dịch vụ để đăng ký
}) => {
  const navigate = useNavigate(); // Hook điều hướng trang
  
  // ===== STATES QUẢN LÝ VIỆC XEM CHI TIẾT DỊCH VỤ TRONG GÓI =====
  const [viewingServiceInPackage, setViewingServiceInPackage] = useState(null); // Dịch vụ đang xem chi tiết trong gói
  const [originalPackageData, setOriginalPackageData] = useState(null); // Dữ liệu gói gốc khi đang xem chi tiết dịch vụ con

  // ===== HÀM XỬ LÝ ĐĂNG KÝ DỊCH VỤ =====
  const handleRegisterService = () => {
    if (detailType === 'single') {
      // Với dịch vụ đơn lẻ: set dịch vụ được chọn
      if (onSelectService) {
        onSelectService('single', 0);
      }
    } else {
      // Với gói dịch vụ: điều hướng đến trang đăng ký với dữ liệu gói
      navigate('/test-registration', { state: { selectedPackage: detailData } });
    }
    onClose();
  };

  // ===== HÀM XỬ LÝ ĐÓNG DIALOG NÂNG CAO =====
  // Hàm này xử lý việc đóng dialog với logic phức tạp cho việc quay lại từ chi tiết dịch vụ
  const handleDialogClose = (event, reason) => {
    // Nếu đang xem chi tiết dịch vụ trong gói, quay lại view gói thay vì đóng dialog
    if (viewingServiceInPackage && originalPackageData) {
      setViewingServiceInPackage(null); // Reset về null để hiển thị gói
      // Không đóng dialog, chỉ reset về view gói
      return;
    }
    
    // Ngăn không cho đóng dialog khi click backdrop trong lúc đang loading
    if (reason === 'backdropClick' && loadingDetail) {
      return;
    }
    
    // Reset tất cả states khi đóng dialog hoàn toàn
    setViewingServiceInPackage(null);
    setOriginalPackageData(null);
    
    // Luôn gọi onClose để cleanup state ở component cha
    if (onClose) {
      onClose();
    }
  };

  // ===== XÁC ĐỊNH DỮ LIỆU HIỂN THỊ =====
  // Logic phức tạp để quyết định hiển thị dữ liệu nào:
  // - Nếu đang xem chi tiết dịch vụ trong gói: hiển thị dữ liệu dịch vụ đó
  // - Nếu đã lưu dữ liệu gói gốc: hiển thị dữ liệu gói đó  
  // - Ngược lại: hiển thị dữ liệu được truyền vào từ props
  const displayData = viewingServiceInPackage || (originalPackageData || detailData);
  const displayType = viewingServiceInPackage ? 'single' : (originalPackageData ? 'package' : detailType);

  // ===== GIAO DIỆN DIALOG =====
  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 24, // Bo góc dialog
          overflow: 'hidden', // Ẩn nội dung tràn
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.20)" // Đổ bóng đậm
        }
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        p: 0, 
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)', // Nền gradient xanh nhạt
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        maxHeight: '90vh' // Giới hạn chiều cao dialog
      }}>
        
        {/* ===== CÁC HÌNH TRANG TRÍ NỀN ===== */}
        {/* Hình tròn trang trí phía trên bên phải */}
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 200, md: 300 }, // Responsive: mobile 200px, desktop 300px
            height: { xs: 200, md: 300 },
            borderRadius: '50%', // Hình tròn
            background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)', // Gradient xanh dương mờ
            top: -100, // Đẩy ra ngoài phía trên
            right: -100, // Đẩy ra ngoài phía phải
            zIndex: 0, // Nằm dưới nội dung
            pointerEvents: 'none', // Không can thiệp vào tương tác
          }}
        />
        
        {/* Hình tròn trang trí phía dưới bên trái */}
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 200, md: 300 },
            height: { xs: 200, md: 300 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)', // Gradient xanh ngọc mờ
            bottom: -100, // Đẩy ra ngoài phía dưới
            left: -100, // Đẩy ra ngoài phía trái
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        
        {/* ===== HEADER DIALOG VỚI GRADIENT ===== */}
        {/* Header cố định với gradient đẹp */}
        <Box sx={{ 
          py: 4, // Padding vertical 32px
          px: 4, // Padding horizontal 32px
          background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)', // Gradient xanh dương sang xanh ngọc
          color: 'white', // Text màu trắng
          position: 'relative',
          zIndex: 1, // Nằm trên các element trang trí
          textAlign: 'center', // Căn giữa text
          flexShrink: 0
        }}>
          <Typography 
            sx={{ 
              fontWeight: 800, 
              fontSize: 28, 
              textAlign: 'center', 
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              mb: 1.5,
              letterSpacing: '-0.5px'
            }}
          >
            {displayType === 'single' ? '🔬 Chi tiết xét nghiệm' : '📦 Chi tiết gói xét nghiệm'}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center', 
              opacity: 0.95, 
              maxWidth: '85%', 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: '1.1rem'
            }}
          >
            {displayData?.name || 'Chi tiết dịch vụ'}
          </Typography>
        </Box>
        
        {/* Price badge */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            position: 'relative',
            zIndex: 5,
            mt: 3,
            mb: 3
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'white', 
              py: 2, 
              px: 5, 
              borderRadius: 50,
              boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
              border: '1px solid rgba(74,144,226,0.15)'
            }}
          >
            <Typography 
              fontWeight={800} 
              fontSize={28} 
              sx={{ 
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {displayData?.price?.toLocaleString('vi-VN')} đ
            </Typography>
          </Box>
        </Box>
        
        {/* Scrollable content area */}
        <Box 
          sx={{ 
            p: 0, 
            position: 'relative', 
            zIndex: 1,
            overflowY: 'auto',
            flexGrow: 1,
            px: 4,
            pb: 4
          }}
        >
          {loadingDetail ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : displayData ? (
            <Box>
              {/* For single service details */}
              {displayType === 'single' && (
                <>
                  {/* Description section */}
                  <Box 
                    sx={{ 
                      p: 4, 
                      bgcolor: 'rgba(255,255,255,0.8)', 
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      backdropFilter: 'blur(10px)',
                      mb: 4
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      sx={{ 
                        mb: 3, 
                        color: '#2d3748',
                        display: 'inline-block',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '40%',
                          height: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(90deg, #4A90E2, rgba(74,144,226,0))',
                          bottom: -8,
                          left: 0
                        }
                      }}
                    >
                      Mô tả dịch vụ
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.05rem' }}>
                      {displayData.description || 'Xét nghiệm giúp phát hiện sớm các bệnh lây truyền qua đường tình dục.'}
                    </Typography>
                    
                    {displayData.components && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                        <Chip 
                          label={`${displayData.components.length} chỉ số xét nghiệm`}
                          color="primary"
                          size="medium"
                          sx={{ 
                            borderRadius: 6,
                            bgcolor: 'rgba(74, 144, 226, 0.1)', 
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            height: 32,
                            px: 1
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2, fontWeight: 500 }}>
                          • {extractTestMetrics(displayData)?.resultTime || '2-3 ngày có kết quả'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Test components section */}
                  {displayData && displayData.components && displayData.components.length > 0 ? (
                    <>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          px: 0, 
                          mb: 3,
                          fontWeight: 800, 
                          color: '#2d3748',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box 
                          component="span" 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                            color: 'white', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            mr: 1.5,
                            boxShadow: '0 3px 10px rgba(74,144,226,0.25)'
                          }}
                        >
                          {displayData.components?.length || 0}
                        </Box>
                        Chỉ số xét nghiệm chi tiết
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          p: 4,
                          borderRadius: 4,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(247,250,252,0.95) 100%)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                        }}
                      >
                        {(displayData.components || []).map((component, idx) => (
                          <Box
                            key={component.id || idx}
                            sx={{
                              p: 3,
                              mb: idx === (displayData.components || []).length - 1 ? 0 : 3,
                              borderRadius: 3,
                              bgcolor: 'white',
                              boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                              border: '1px solid rgba(0,0,0,0.02)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 8px 25px rgba(74,144,226,0.1)',
                                transform: 'translateY(-3px)',
                                borderColor: 'rgba(74,144,226,0.08)'
                              }
                            }}
                          >
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={4}>
                                <Typography 
                                  fontWeight={700} 
                                  color="primary.dark"
                                  fontSize="1.1rem"
                                  sx={{ 
                                    pb: 1,
                                    borderBottom: '2px solid',
                                    borderColor: 'rgba(74,144,226,0.2)',
                                    display: 'inline-block'
                                  }}
                                >
                                  {component.componentName || component.testName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Đơn vị:
                                  </Typography>
                                  <Chip 
                                    size="small" 
                                    label={component.unit} 
                                    sx={{ 
                                      ml: 1,
                                      height: 22, 
                                      fontSize: '0.75rem', 
                                      bgcolor: 'rgba(0,0,0,0.04)', 
                                      fontWeight: 600 
                                    }} 
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Chỉ số bình thường:
                                  </Typography>
                                  <Chip 
                                    size="small" 
                                    label={component.normalRange || component.referenceRange} 
                                    color="success"
                                    sx={{ 
                                      ml: 1.5,
                                      fontSize: '0.75rem', 
                                      height: 24,
                                      bgcolor: 'rgba(56, 161, 105, 0.1)',
                                      color: 'success.dark',
                                      fontWeight: 600
                                    }} 
                                  />
                                </Box>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: '0.95rem',
                                    fontStyle: 'italic',
                                    px: 2,
                                    py: 1.5,
                                    borderLeft: '3px solid',
                                    borderColor: 'rgba(74,144,226,0.2)',
                                    bgcolor: 'rgba(74,144,226,0.03)',
                                    borderRadius: '0 6px 6px 0',
                                    lineHeight: 1.6
                                  }}
                                >
                                  {component.interpretation || component.description || 'Chỉ số quan trọng trong xét nghiệm'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ 
                      p: 4,
                      textAlign: 'center',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        Thông tin chi tiết chỉ số xét nghiệm sẽ được cập nhật sau.
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              
              {/* For package details */}
              {displayType === 'package' && (
                <>
                  {/* Package overview */}
                  <Box 
                    sx={{ 
                      p: 4, 
                      bgcolor: 'rgba(255,255,255,0.8)', 
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      backdropFilter: 'blur(10px)',
                      mb: 4
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      sx={{ 
                        mb: 3, 
                        color: '#2d3748',
                        display: 'inline-block',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '40%',
                          height: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(90deg, #4A90E2, rgba(74,144,226,0))',
                          bottom: -8,
                          left: 0
                        }
                      }}
                    >
                      📋 Mô tả gói xét nghiệm
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.05rem', mb: 3 }}>
                      {displayData.description || 'Gói xét nghiệm toàn diện giúp phát hiện sớm các bệnh lây truyền qua đường tình dục.'}
                    </Typography>
                    
                    {/* Package stats */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${displayData.services?.length || 0} xét nghiệm`}
                        color="primary"
                        size="medium"
                        sx={{ 
                          borderRadius: 6,
                          bgcolor: 'rgba(74, 144, 226, 0.1)', 
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          height: 32,
                          px: 1
                        }}
                      />
                      <Chip 
                        label={`${displayData.services?.reduce((total, service) => total + (service.components?.length || 0), 0) || 0} chỉ số`}
                        color="success"
                        size="medium"
                        sx={{ 
                          borderRadius: 6,
                          bgcolor: 'rgba(56, 161, 105, 0.1)', 
                          color: 'success.main',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          height: 32,
                          px: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        • Kết quả trong 2-3 ngày làm việc
                      </Typography>
                    </Box>
                  </Box>

                  {/* Services in package */}
                  {displayData.services && displayData.services.length > 0 && (
                    <>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          px: 0, 
                          mb: 3,
                          fontWeight: 800, 
                          color: '#2d3748',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box 
                          component="span" 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                            color: 'white', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            mr: 1.5,
                            boxShadow: '0 3px 10px rgba(74,144,226,0.25)'
                          }}
                        >
                          {displayData.services?.length || 0}
                        </Box>
                        Các xét nghiệm trong gói
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2.5
                        }}
                      >
                        {(displayData.services || []).map((service, idx) => (
                          <Box
                            key={service.id || idx}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: 'white',
                              boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                              border: '1px solid rgba(0,0,0,0.02)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              '&:hover': {
                                boxShadow: '0 8px 25px rgba(74,144,226,0.1)',
                                transform: 'translateY(-2px)',
                                borderColor: 'rgba(74,144,226,0.08)'
                              }
                            }}
                            onClick={() => {
                              // Set state to view this service detail using available data
                              setOriginalPackageData(displayData);
                              setViewingServiceInPackage(service);
                              // Don't call onOpenDetail - use service data already available
                              // This ensures fast loading and no API calls
                            }}
                          >
                            {/* Service info */}
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                              {/* Index number circle */}
                              <Box 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  borderRadius: '50%', 
                                  background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                                  color: 'white', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontSize: '0.9rem',
                                  fontWeight: 700,
                                  mr: 3,
                                  flexShrink: 0,
                                  boxShadow: '0 3px 10px rgba(74,144,226,0.25)'
                                }}
                              >
                                {idx + 1}
                              </Box>
                              
                              {/* Service details */}
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  fontWeight={700} 
                                  color="primary.dark"
                                  fontSize="1.1rem"
                                  sx={{ mb: 0.5 }}
                                >
                                  {service.name}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5,
                                    mb: 1
                                  }}
                                >
                                  {service.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Chip 
                                    size="small" 
                                    label={`${service.components?.length || 0} chỉ số`}
                                    color="success"
                                    sx={{ 
                                      fontSize: '0.75rem', 
                                      height: 22,
                                      bgcolor: 'rgba(56, 161, 105, 0.1)',
                                      color: 'success.dark',
                                      fontWeight: 600
                                    }} 
                                  />
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    • Nhấp để xem chi tiết
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            {/* Price and arrow */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                              <Chip 
                                size="medium" 
                                label={`${service.price?.toLocaleString('vi-VN')} đ`}
                                sx={{ 
                                  height: 32, 
                                  fontSize: '0.85rem', 
                                  bgcolor: 'rgba(74,144,226,0.1)', 
                                  color: 'primary.main',
                                  fontWeight: 700,
                                  px: 1.5
                                }} 
                              />
                              <Button 
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  color: 'primary.main', 
                                  borderColor: 'primary.main',
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                  height: 32,
                                  minWidth: 'auto',
                                  px: 2,
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  '&:hover': {
                                    bgcolor: 'rgba(74,144,226,0.08)',
                                    borderColor: 'primary.main',
                                  }
                                }}
                              >
                                Chi tiết
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </>
              )}
            </Box>
          ) : !loadingDetail ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                ⚠️ Không thể tải chi tiết dịch vụ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Đã xảy ra lỗi khi tải thông tin chi tiết. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  // Try to reload detail data with proper error handling
                  const serviceId = detailData?.id;
                  if (serviceId && onOpenDetail) {
                    onOpenDetail(serviceId, detailType);
                  } else {
                    // If no serviceId available, just close the dialog
                    handleDialogClose(null, 'retryFailed');
                  }
                }}
                sx={{
                  borderRadius: 6,
                  borderColor: '#4A90E2',
                  color: '#4A90E2',
                  '&:hover': {
                    bgcolor: 'rgba(74,144,226,0.08)',
                  }
                }}
              >
                Thử lại
              </Button>
            </Box>
          ) : null}
        </Box>
        
        {/* Footer - remains fixed */}
        <DialogActions 
          sx={{ 
            justifyContent: 'space-between', 
            p: 3, 
            bgcolor: 'rgba(255,255,255,0.8)',
            flexShrink: 0,
            borderTop: '1px solid rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {viewingServiceInPackage ? (
            // When viewing service in package, show back button
            <>
              <Button 
                onClick={() => {
                  setViewingServiceInPackage(null);
                  // Don't close dialog, just go back to package view
                }} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  minWidth: 120,
                  py: 1.2,
                  borderColor: 'rgba(74,144,226,0.3)',
                  color: '#4A90E2',
                  '&:hover': {
                    borderColor: '#4A90E2',
                    bgcolor: 'rgba(74,144,226,0.08)'
                  }
                }}
              >
                ← Quay lại gói
              </Button>
              <Button 
                onClick={() => handleDialogClose(null, 'closeClick')} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  minWidth: 120,
                  py: 1.2,
                  borderColor: 'rgba(0,0,0,0.2)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(74,144,226,0.08)'
                  }
                }}
              >
                Đóng
              </Button>
            </>
          ) : (
            // Normal view (single service or package)
            <>
              <Button 
                onClick={() => handleDialogClose(null, 'closeClick')} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  minWidth: 120,
                  py: 1.2,
                  borderColor: 'rgba(0,0,0,0.2)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(74,144,226,0.08)'
                  }
                }}
              >
                Đóng
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 8,
                  fontWeight: 600,
                  minWidth: 150,
                  py: 1.2,
                  background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 20px rgba(74, 144, 226, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={handleRegisterService}
              >
                Đăng ký ngay
              </Button>
            </>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// ===== ĐỊNH NGHĨA PROP TYPES =====
// Xác định kiểu dữ liệu cho các props để đảm bảo tính chính xác
ServiceDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,           // Trạng thái mở/đóng dialog (bắt buộc, boolean)
  onClose: PropTypes.func.isRequired,        // Hàm đóng dialog (bắt buộc, function)
  detailData: PropTypes.object,              // Dữ liệu chi tiết dịch vụ/gói (tùy chọn, object)
  detailType: PropTypes.oneOf(['single', 'package']), // Loại dịch vụ (tùy chọn, chỉ nhận 'single' hoặc 'package')
  loadingDetail: PropTypes.bool,             // Trạng thái loading (tùy chọn, boolean)
  onOpenDetail: PropTypes.func,              // Hàm mở chi tiết dịch vụ con (tùy chọn, function)
  onSelectService: PropTypes.func            // Hàm chọn dịch vụ để đăng ký (tùy chọn, function)
};

// Export component để sử dụng ở các file khác
export default ServiceDetailDialog;

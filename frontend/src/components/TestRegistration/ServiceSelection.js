import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Chip,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

// ===== COMPONENT CHỌN DỊCH VỤ XÉT NGHIỆM =====
// Component này hiển thị danh sách các dịch vụ xét nghiệm (lẻ và gói) để người dùng chọn
const ServiceSelection = ({
  activeTab,              // Tab đang active: 'single' (xét nghiệm lẻ) hoặc 'package' (gói xét nghiệm)
  setActiveTab,           // Hàm thay đổi tab active
  searchQuery,            // Từ khóa tìm kiếm
  setSearchQuery,         // Hàm cập nhật từ khóa tìm kiếm
  paginatedSingleTests,   // Danh sách xét nghiệm lẻ đã phân trang
  paginatedPackages,      // Danh sách gói xét nghiệm đã phân trang
  selectedService,        // Dịch vụ đang được chọn {type: 'single'|'package', idx: number}
  onSelectService,        // Hàm xử lý khi chọn dịch vụ
  onOpenDetail           // Hàm mở chi tiết dịch vụ
}) => {

  // ===== GIAO DIỆN COMPONENT =====
  return (
    <Box sx={{ 
      background: '#fff',                                      // Nền trắng
      borderRadius: 5,                                         // Bo góc 40px
      p: { xs: 3, md: 5 },                                    // Padding responsive: mobile 24px, desktop 40px
      boxShadow: '0 8px 32px rgba(74,144,226,0.10)',          // Đổ bóng xanh nhẹ
      my: 2,                                                   // Margin vertical 16px
      fontFamily: 'inherit'                                    // Kế thừa font từ parent
    }}>
      
      {/* ===== PHẦN HEADER - TIÊU ĐỀ VÀ MÔ TẢ ===== */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {/* Tiêu đề chính với gradient text */}
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)', // Gradient xanh dương sang xanh ngọc
            backgroundClip: 'text',                            // Cắt background theo text
            WebkitBackgroundClip: 'text',                      // Webkit prefix cho Safari
            WebkitTextFillColor: 'transparent',                // Làm text trong suốt để hiện gradient
            mb: 2,                                             // Margin bottom 16px
            fontSize: { xs: '1.8rem', md: '2.2rem' }          // Font size responsive
          }}
        >
          Chọn loại dịch vụ
        </Typography>
        
        {/* Mô tả ngắn gọn */}
        <Typography
          sx={{ 
            color: '#757575',                                  // Màu xám
            fontWeight: 400,                                   // Font weight normal
            fontSize: { xs: 16, md: 18 },                     // Font size responsive
            fontFamily: 'inherit',
            maxWidth: 600,                                     // Giới hạn chiều rộng
            mx: 'auto',                                        // Căn giữa
            lineHeight: 1.6                                    // Khoảng cách dòng
          }}
        >
          Chọn loại xét nghiệm phù hợp với nhu cầu của bạn. Chúng tôi cung cấp cả xét nghiệm lẻ và gói xét nghiệm tổng hợp.
        </Typography>
      </Box>

      {/* ===== PHẦN TAB NAVIGATION - CHUYỂN ĐỔI GIỮA XÉT NGHIỆM LẺ VÀ GÓI ===== */}
      <Box sx={{ 
        display: 'flex',                                       // Layout flexbox
        gap: 1,                                                // Khoảng cách giữa các tab
        mb: 4,                                                 // Margin bottom 32px
        justifyContent: 'center',                              // Căn giữa
        bgcolor: '#f8faff',                                    // Nền xanh rất nhạt
        borderRadius: 3,                                       // Bo góc 24px
        p: 1,                                                  // Padding 8px
        maxWidth: 400,                                         // Chiều rộng tối đa
        mx: 'auto'                                             // Căn giữa
      }}>
        
        {/* ===== TAB XÉT NGHIỆM LẺ ===== */}
        <Box
          sx={{
            flex: 1,                                           // Chiếm 1 phần trong flex container
            py: 2,                                             // Padding vertical 16px
            px: 3,                                             // Padding horizontal 24px
            borderRadius: 2,                                   // Bo góc 16px
            fontWeight: 700,                                   // Font weight bold
            fontSize: { xs: 14, md: 16 },                     // Font size responsive
            textAlign: 'center',                               // Căn giữa text
            cursor: 'pointer',                                 // Con trở thành pointer khi hover
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Animation mượt
            
            // ===== STYLE THEO TRẠNG THÁI ACTIVE =====
            background: activeTab === 'single' 
              ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)'  // Gradient khi active
              : 'transparent',                                        // Trong suốt khi không active
            color: activeTab === 'single' ? '#fff' : '#666',          // Màu text: trắng khi active, xám khi không
            boxShadow: activeTab === 'single' ? '0 8px 25px rgba(74,144,226,0.25)' : 'none', // Đổ bóng khi active
            transform: activeTab === 'single' ? 'translateY(-2px)' : 'none', // Nâng lên khi active
            
            // ===== HIỆU ỨNG HOVER =====
            '&:hover': {
              background: activeTab === 'single' 
                ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' // Giữ nguyên gradient khi active
                : 'rgba(74,144,226,0.1)',                             // Nền xanh nhẹ khi không active
              transform: 'translateY(-2px)',                          // Luôn nâng lên khi hover
            }
          }}
          onClick={() => setActiveTab('single')} // Chuyển sang tab xét nghiệm lẻ
        >
          🔬 Xét nghiệm lẻ
        </Box>
        
        {/* ===== TAB GÓI XÉT NGHIỆM ===== */}
        <Box
          sx={{
            flex: 1,
            py: 2,
            px: 3,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: { xs: 14, md: 16 },
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            
            // Style tương tự như tab xét nghiệm lẻ nhưng check activeTab === 'package'
            background: activeTab === 'package' 
              ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' 
              : 'transparent',
            color: activeTab === 'package' ? '#fff' : '#666',
            boxShadow: activeTab === 'package' ? '0 8px 25px rgba(74,144,226,0.25)' : 'none',
            transform: activeTab === 'package' ? 'translateY(-2px)' : 'none',
            '&:hover': {
              background: activeTab === 'package' 
                ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' 
                : 'rgba(74,144,226,0.1)',
              transform: 'translateY(-2px)',
            }
          }}
          onClick={() => setActiveTab('package')} // Chuyển sang tab gói xét nghiệm
        >
          📦 Gói xét nghiệm
        </Box>
      </Box>

      {/* ===== THANH TÌM KIẾM ===== */}
      <Box sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
        <TextField
          fullWidth
          placeholder={`Tìm kiếm ${activeTab === 'single' ? 'xét nghiệm' : 'gói xét nghiệm'}...`} // Placeholder động theo tab
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật từ khóa tìm kiếm
          sx={{
            // ===== STYLE CHO INPUT =====
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,                                 // Bo góc 24px
              bgcolor: '#f8faff',                             // Nền xanh nhạt
              fontSize: 16,                                    // Font size 16px
              
              // ===== STYLE CHO VIỀN =====
              '& fieldset': {
                borderColor: 'rgba(74,144,226,0.2)',          // Viền xanh nhạt
                borderWidth: 2                                 // Độ dày viền 2px
              },
              
              // ===== STYLE KHI HOVER =====
              '&:hover fieldset': {
                borderColor: 'rgba(74,144,226,0.4)',          // Viền xanh đậm hơn khi hover
              },
              
              // ===== STYLE KHI FOCUS =====
              '&.Mui-focused fieldset': {
                borderColor: '#4A90E2',                        // Viền xanh đậm khi focus
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#4A90E2', mr: 1 }} /> {/* Icon tìm kiếm màu xanh */}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* ===== DANH SÁCH DỊCH VỤ - HIỂN THỊ THEO TAB ===== */}
      {activeTab === 'single' ? (
        <>
          {/* ===== TRƯỜNG HỢP KHÔNG TÌM THẤY XÉT NGHIỆM LẺ ===== */}
          {paginatedSingleTests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                🔍 Không tìm thấy xét nghiệm nào
              </Typography>
              <Typography color="text.secondary">
                Hãy thử tìm kiếm với từ khóa khác
              </Typography>
            </Box>
          ) : (
            /* ===== DANH SÁCH XÉT NGHIỆM LẺ ===== */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Kiểm tra an toàn trước khi map để tránh lỗi runtime */}
              {Array.isArray(paginatedSingleTests) && paginatedSingleTests.map((service, idx) => (
                <Card
                  key={service.id}
                  sx={{
                    borderRadius: 4,                           // Bo góc 32px
                    
                    // ===== LOGIC STYLE THEO TRẠNG THÁI CHỌN =====
                    boxShadow: selectedService?.type === 'single' && selectedService?.idx === idx
                      ? '0 8px 32px rgba(74,144,226,0.25)'     // Đổ bóng đậm khi được chọn
                      : '0 4px 20px rgba(0,0,0,0.08)',        // Đổ bóng nhẹ khi không được chọn
                    border: selectedService?.type === 'single' && selectedService?.idx === idx
                      ? '2px solid #4A90E2'                    // Viền xanh khi được chọn
                      : '1px solid rgba(0,0,0,0.08)',          // Viền mỏng khi không được chọn
                    background: selectedService?.type === 'single' && selectedService?.idx === idx
                      ? 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)' // Nền gradient xanh khi được chọn
                      : 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)', // Nền trắng khi không được chọn
                    
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Animation mượt
                    cursor: 'pointer',                         // Con trỏ pointer
                    position: 'relative',                      // Để định vị các element con absolute
                    overflow: 'hidden',                        // Ẩn nội dung tràn
                    
                    // ===== HIỆU ỨNG HOVER =====
                    '&:hover': {
                      transform: 'translateY(-4px)',            // Nâng lên 4px
                      boxShadow: '0 12px 40px rgba(74,144,226,0.2)', // Đổ bóng đậm hơn
                      border: '1px solid #4A90E2',             // Viền xanh
                    },
                    
                    // ===== THANH TRANG TRÍ PHÍA TRÊN =====
                    '&::before': {
                      content: '""',                           // Tạo pseudo element
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,                               // Chiều cao 4px
                      background: selectedService?.type === 'single' && selectedService?.idx === idx
                        ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' // Gradient xanh khi được chọn
                        : 'linear-gradient(90deg, #e0e7ff 0%, #f0f7ff 100%)', // Gradient nhạt khi không được chọn
                    }
                  }}
                  onClick={() => onSelectService('single', idx)} // Xử lý khi click chọn dịch vụ
                >
                  
                  {/* ===== ICON CHỈ THỊ ĐƯỢC CHỌN ===== */}
                  {/* Chỉ hiển thị khi dịch vụ này được chọn */}
                  {selectedService?.type === 'single' && selectedService?.idx === idx && (
                    <Box
                      sx={{
                        position: 'absolute',                  // Định vị tuyệt đối
                        bottom: 20,                            // Cách bottom 20px
                        right: 20,                             // Cách right 20px
                        width: 32,                             // Kích thước 32x32px
                        height: 32,
                        borderRadius: '50%',                   // Hình tròn
                        background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)', // Nền gradient
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(74,144,226,0.3)', // Đổ bóng
                        zIndex: 2,                             // Nằm trên các element khác
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  )}

                  {/* ===== NỘI DUNG CARD XÉT NGHIỆM LẺ ===== */}
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Layout chính: nội dung bên trái, giá và nút bên phải */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      
                      {/* ===== PHẦN NỘI DUNG CHÍNH BÊN TRÁI ===== */}
                      <Box sx={{ flex: 1, pr: 2 }}>
                        
                        {/* ===== HEADER: ICON + TÊN DỊCH VỤ ===== */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          {/* Icon container với gradient background */}
                          <Box
                            sx={{
                              width: 40,                         // Kích thước 40x40px
                              height: 40,
                              borderRadius: 2,                   // Bo góc 16px
                              background: 'linear-gradient(135deg, rgba(74,144,226,0.1), rgba(26,188,156,0.1))', // Nền gradient xanh nhẹ
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,                           // Margin right 12px
                              border: '1px solid rgba(74,144,226,0.2)' // Viền xanh nhẹ
                            }}
                          >
                            <Typography sx={{ fontSize: 18 }}>🔬</Typography> {/* Icon xét nghiệm */}
                          </Box>
                          
                          {/* Thông tin tên và loại dịch vụ */}
                          <Box>
                            {/* Tên dịch vụ */}
                            <Typography 
                              variant="h6"
                              fontWeight={700} 
                              sx={{ 
                                fontSize: { xs: 16, md: 18 },    // Font size responsive
                                color: '#2d3748',                // Màu xám đậm
                                lineHeight: 1.2                  // Khoảng cách dòng
                              }}
                            >
                              {service.name}
                            </Typography>
                            
                            {/* Label loại dịch vụ */}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#4A90E2',                // Màu xanh
                                fontWeight: 600,
                                fontSize: 12
                              }}
                            >
                              Xét nghiệm lẻ
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* ===== MÔ TẢ DỊCH VỤ ===== */}
                        <Typography 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: 14,
                            lineHeight: 1.5,
                            mb: 2,                               // Margin bottom 16px
                            display: '-webkit-box',             // Hiển thị dạng box
                            WebkitLineClamp: 2,                  // Giới hạn 2 dòng
                            WebkitBoxOrient: 'vertical',         // Hướng dọc
                            overflow: 'hidden'                   // Ẩn phần tràn
                          }}
                        >
                          {/* Hiển thị mô tả hoặc text mặc định */}
                          {service.description || 'Xét nghiệm chuyên sâu với kết quả chính xác và nhanh chóng'}
                        </Typography>

                        {/* ===== DANH SÁCH CHIP THÔNG TIN ===== */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
                          
                          {/* Chip thời gian thực hiện */}
                          <Chip
                            icon={<AccessTimeIcon />}           // Icon đồng hồ
                            label={service.duration}            // Thời gian (VD: "30 phút")
                            size="small"
                            sx={{
                              bgcolor: 'rgba(74,144,226,0.1)',  // Nền xanh nhẹ
                              color: '#4A90E2',                 // Text xanh
                              fontWeight: 600,
                              '& .MuiChip-icon': { color: '#4A90E2' } // Icon màu xanh
                            }}
                          />
                          
                          {/* Chip phương pháp xét nghiệm */}
                          <Chip
                            label={service.method}              // Phương pháp (VD: "PCR", "ELISA")
                            size="small"
                            sx={{
                              bgcolor: 'rgba(26,188,156,0.1)',  // Nền xanh ngọc nhẹ
                              color: '#1ABC9C',                 // Text xanh ngọc
                              fontWeight: 600
                            }}
                          />
                          
                          {/* Chip độ chính xác */}
                          <Chip
                            label={`${service.accuracy} chính xác`} // Độ chính xác (VD: "99% chính xác")
                            size="small"
                            sx={{
                              bgcolor: 'rgba(34,197,94,0.1)',   // Nền xanh lá nhẹ
                              color: '#22c55e',                 // Text xanh lá
                              fontWeight: 600
                            }}
                          />
                          
                          {/* Chip loại mẫu (chỉ hiển thị nếu có) */}
                          {service.sampleType && (
                            <Chip
                              label={service.sampleType}        // Loại mẫu (VD: "Máu", "Nước tiểu")
                              size="small"
                              sx={{
                                bgcolor: 'rgba(245,158,11,0.1)', // Nền cam nhẹ
                                color: '#f59e0b',               // Text cam
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box
                            sx={{
                              bgcolor: 'rgba(74,144,226,0.1)',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              border: '1px solid rgba(74,144,226,0.2)',
                              minWidth: 90
                            }}
                          >
                            <Typography 
                              fontWeight={800} 
                              sx={{ 
                                fontSize: { xs: 14, md: 16 },
                                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center'
                              }}
                            >
                              {service.price ? service.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
                            </Typography>
                          </Box>

                          {onOpenDetail && (
                            <Button
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenDetail(service.id, 'single');
                              }}
                              sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                fontWeight: 600,
                                fontSize: 12,
                                borderWidth: 1.5,
                                borderColor: '#4A90E2',
                                color: '#4A90E2',
                                minWidth: 80,
                                height: 'auto',
                                '&:hover': {
                                  borderWidth: 1.5,
                                  bgcolor: 'rgba(74,144,226,0.1)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              Chi tiết
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      ) : (
        <>
          {paginatedPackages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                📦 Không tìm thấy gói xét nghiệm nào
              </Typography>
              <Typography color="text.secondary">
                Hãy thử tìm kiếm với từ khóa khác
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Kiểm tra an toàn trước khi map để tránh lỗi runtime */}
              {Array.isArray(paginatedPackages) && paginatedPackages.map((service, idx) => (
                <Card
                  key={service.id}
                  sx={{
                    borderRadius: 4,
                    boxShadow: selectedService?.type === 'package' && selectedService?.idx === idx
                      ? '0 8px 32px rgba(74,144,226,0.25)'
                      : '0 4px 20px rgba(0,0,0,0.08)',
                    border: selectedService?.type === 'package' && selectedService?.idx === idx
                      ? '2px solid #4A90E2'
                      : '1px solid rgba(0,0,0,0.08)',
                    background: selectedService?.type === 'package' && selectedService?.idx === idx
                      ? 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(74,144,226,0.2)',
                      border: '1px solid #4A90E2',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: selectedService?.type === 'package' && selectedService?.idx === idx
                        ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)'
                        : 'linear-gradient(90deg, #e0e7ff 0%, #f0f7ff 100%)',
                    }
                  }}
                  onClick={() => onSelectService('package', idx)}
                >
                  {/* Selection Indicator */}
                  {selectedService?.type === 'package' && selectedService?.idx === idx && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(74,144,226,0.3)',
                        zIndex: 2,
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  )}

                  {/* Popular Badge */}
                  {/* <Box
                    sx={{
                      position: 'absolute',
                      bottom: 15,
                      left: 15,
                      bgcolor: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                      background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: 12,
                      fontWeight: 700,
                      zIndex: 3,
                      boxShadow: '0 2px 8px rgba(74,144,226,0.3)',
                    }}
                  >
                    🔥 PHỔ BIẾN
                  </Box> */}

                  <CardContent sx={{ p: 2.5, pt: 3.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ flex: 1, pr: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(249,115,22,0.1))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              border: '1px solid rgba(245,158,11,0.2)'
                            }}
                          >
                            <Typography sx={{ fontSize: 18 }}>📦</Typography>
                          </Box>
                          <Box>
                            <Typography 
                              variant="h6" 
                              fontWeight={700} 
                              sx={{ 
                                fontSize: { xs: 16, md: 18 },
                                color: '#2d3748',
                                lineHeight: 1.2
                              }}
                            >
                              {service.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#4A90E2',
                                fontWeight: 600,
                                fontSize: 12
                              }}
                            >
                              Gói xét nghiệm tổng hợp
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: 14,
                            lineHeight: 1.5,
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {service.description || 'Gói xét nghiệm tổng hợp với nhiều dịch vụ và giá ưu đãi'}
                        </Typography>

                        {/* Services count indicator */}
                        {service.services && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Chip
                              label={`${service.totalServices || service.services.length} dịch vụ`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(74,144,226,0.1)',
                                color: '#4A90E2',
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              icon={<AccessTimeIcon />}
                              label={service.duration}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(74,144,226,0.1)',
                                color: '#4A90E2',
                                fontWeight: 600,
                                '& .MuiChip-icon': { color: '#4A90E2' }
                              }}
                            />
                            <Chip
                              label={`${service.accuracy} chính xác`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(34,197,94,0.1)',
                                color: '#22c55e',
                                fontWeight: 600
                              }}
                            />
                            <Chip
                              label={service.savings}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(245,158,11,0.1)',
                                color: '#f59e0b',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box
                            sx={{
                              bgcolor: 'rgba(74,144,226,0.1)',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              border: '1px solid rgba(74,144,226,0.2)',
                              minWidth: 90
                            }}
                          >
                            <Typography 
                              fontWeight={800} 
                              sx={{ 
                                fontSize: { xs: 14, md: 16 },
                                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center'
                              }}
                            >
                              {service.price ? service.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
                            </Typography>
                          </Box>

                          {onOpenDetail && (
                            <Button
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenDetail(service.id, 'package');
                              }}
                              sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                fontWeight: 600,
                                fontSize: 12,
                                borderWidth: 1.5,
                                borderColor: '#4A90E2',
                                color: '#4A90E2',
                                minWidth: 80,
                                height: 'auto',
                                '&:hover': {
                                  borderWidth: 1.5,
                                  bgcolor: 'rgba(74,144,226,0.1)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              Chi tiết
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

// ===== ĐỊNH NGHĨA PROP TYPES =====
// Xác định kiểu dữ liệu cho các props để đảm bảo tính chính xác và dễ debug
ServiceSelection.propTypes = {
  activeTab: PropTypes.string.isRequired,               // Tab đang active (bắt buộc, string: 'single' hoặc 'package')
  setActiveTab: PropTypes.func.isRequired,              // Hàm thay đổi tab (bắt buộc, function)
  searchQuery: PropTypes.string.isRequired,             // Từ khóa tìm kiếm (bắt buộc, string)
  setSearchQuery: PropTypes.func.isRequired,            // Hàm cập nhật từ khóa tìm kiếm (bắt buộc, function)
  paginatedSingleTests: PropTypes.array.isRequired,     // Danh sách xét nghiệm lẻ (bắt buộc, array)
  paginatedPackages: PropTypes.array.isRequired,        // Danh sách gói xét nghiệm (bắt buộc, array)
  selectedService: PropTypes.object,                    // Dịch vụ đang được chọn (tùy chọn, object: {type, idx})
  onSelectService: PropTypes.func.isRequired,           // Hàm xử lý khi chọn dịch vụ (bắt buộc, function)
  onOpenDetail: PropTypes.func                          // Hàm mở chi tiết dịch vụ (tùy chọn, function)
};

// Export component để sử dụng ở các file khác
export default ServiceSelection;

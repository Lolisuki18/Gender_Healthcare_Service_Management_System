import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, List, ListItem, ListItemText, Chip,
  IconButton, CircularProgress, Collapse, Paper, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

/**
 * Component hiển thị chi tiết gói xét nghiệm hoặc xét nghiệm đơn lẻ
 * 
 * @param {boolean} open - Trạng thái hiển thị/ẩn dialog
 * @param {function} onClose - Hàm xử lý khi đóng dialog
 * @param {object} detailData - Dữ liệu chi tiết gói xét nghiệm/xét nghiệm
 * @param {string} detailType - Loại chi tiết ('package' hoặc 'single')
 * @param {boolean} loadingDetail - Trạng thái đang tải dữ liệu
 * @param {function} onOpenDetail - Hàm xử lý khi mở chi tiết một xét nghiệm
 * @param {function} onSelectService - Hàm xử lý khi chọn một dịch vụ
 */
const ServiceDetailDialog = ({
  open,
  onClose,
  detailData,
  detailType,
  loadingDetail,
  onOpenDetail,
  onSelectService
}) => {
  const navigate = useNavigate();
  
  // State quản lý các mục xét nghiệm đã mở chi tiết trong gói
  const [expandedItems, setExpandedItems] = useState({});

  /**
   * Xử lý việc mở/đóng chi tiết từng mục xét nghiệm trong gói
   * @param {number} itemId - ID của mục cần mở/đóng
   */
  const handleToggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  /**
   * Xử lý khi người dùng chọn đăng ký gói dịch vụ hoặc xét nghiệm đơn lẻ
   * Đóng dialog và chuyển đến trang đăng ký với dữ liệu đã chọn
   */
  const handleRegisterService = () => {
    onClose();
    // Gửi dữ liệu khác nhau tùy thuộc vào loại (gói hoặc xét nghiệm đơn lẻ)
    if (detailType === 'package') {
      navigate('/test-registration', { 
        state: { 
          selectedPackage: detailData,
          activeStep: 1, // Sử dụng activeStep thay vì startStep
          initialStep: 1, // Thêm initialStep để đảm bảo tương thích
          skipServiceSelection: true // Thêm flag để bỏ qua bước chọn dịch vụ
        } 
      });
    } else {
      navigate('/test-registration', { 
        state: { 
          selectedTest: detailData, // Gửi xét nghiệm đơn lẻ
          activeStep: 1, // Sử dụng activeStep thay vì startStep
          initialStep: 1, // Thêm initialStep để đảm bảo tương thích
          skipServiceSelection: true // Thêm flag để bỏ qua bước chọn dịch vụ
        } 
      });
    }
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loadingDetail) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress sx={{ color: '#2196F3' }} />
        </DialogContent>
      </Dialog>
    );
  }

  // Không hiển thị gì nếu không có dữ liệu
  if (!detailData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Tiêu đề dialog - Hiển thị khác nhau tùy loại gói/xét nghiệm đơn lẻ */}
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        py: 2.5,
        px: 3,
        background: 'linear-gradient(135deg, #2196F3, #00BFA5)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <Typography variant="h6" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {detailType === 'package' ? 'Chi tiết gói xét nghiệm' : 'Chi tiết xét nghiệm'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Phần 1: Thông tin chung về gói/xét nghiệm - tên, mô tả, giá */}
        <Box sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(0,191,165,0.05))',
          borderBottom: '1px solid rgba(33,150,243,0.2)',
          borderRadius: '0 0 12px 12px',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #2196F3, #00BFA5, #2196F3)',
          }
        }}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: '#2d3748' }}>
            {detailData.name}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: '#4a5568', mb: 3, lineHeight: 1.6 }}>
            {detailData.description}
          </Typography>
          
          {/* Hiển thị giá tiền */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.6))',
            border: '1px solid rgba(74,174,181,0.2)',
            boxShadow: '0 2px 8px rgba(74,174,181,0.1)'
          }}>
            <MonetizationOnOutlinedIcon sx={{ color: '#4aaeb5', fontSize: '1.5rem' }} />
            <Typography variant="h6" fontWeight={700} color="#4aaeb5">
              {detailData.price?.toLocaleString('vi-VN')} đ
              <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 500, color: '#6b7280' }}>
                (Đã bao gồm tư vấn miễn phí)
              </Typography>
            </Typography>
          </Box>
        </Box>
        
        {/* Phần 2: Chi tiết xét nghiệm đơn lẻ - chỉ hiển thị nếu là xét nghiệm lẻ */}
        {detailType !== 'package' && detailData.components && detailData.components.length > 0 && (
          <Box sx={{ px: 3, pb: 3 }}>
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(248,250,252,0.9) 0%, rgba(235,245,246,0.8) 50%, rgba(255,255,255,0.95) 100%)',
              borderRadius: 2, 
              border: '1px solid rgba(74,174,181,0.25)',
              boxShadow: '0 4px 16px rgba(74,174,181,0.08)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #2196F3, #00BFA5)',
                borderRadius: '2px 2px 0 0'
              }
            }}>
              <Grid container spacing={2}>
                {/* Cột bên trái - Thông tin chi tiết về xét nghiệm */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#2d3748' }}>
                      Thông tin chi tiết
                    </Typography>
                    <Box sx={{ pl: 2, borderLeft: '3px solid #4aaeb5' }}>
                      {/* Hiển thị loại mẫu xét nghiệm từ API nếu có */}
                      {detailData.components && detailData.components.length > 0 && detailData.components[0].sampleType && (
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Typography variant="body2" sx={{ width: '140px', color: '#6b7280' }}>
                            Loại mẫu xét nghiệm:
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: '#374151' }}>
                            {detailData.components[0].sampleType}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="body2" sx={{ width: '140px', color: '#6b7280' }}>
                          Thời gian có kết quả:
                        </Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#374151' }}>
                          {detailData.time || '2-3 ngày'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Typography variant="body2" sx={{ width: '140px', color: '#6b7280' }}>
                          Độ chính xác:
                        </Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#374151' }}>
                          {detailData.accuracy || '> 99%'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Cột bên phải - Chỉ định xét nghiệm */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#2d3748' }}>
                    Chỉ định xét nghiệm
                  </Typography>
                  <Box sx={{ pl: 2, borderLeft: '3px solid #FF6B6B' }}>
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                      {detailData.indication || 'Người có nguy cơ cao tiếp xúc với các bệnh lây truyền qua đường tình dục.'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Bảng hiển thị các chỉ số xét nghiệm - lấy từ API */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2, color: '#4aaeb5', display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Các chỉ số xét nghiệm ({detailData.components.length})
                </Typography>
                
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.95)', 
                  borderRadius: 2, 
                  border: '1px solid rgba(74,174,181,0.15)', 
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(74,174,181,0.05)'
                }}>
                  {/* Tiêu đề các cột trong bảng */}
                  <Box sx={{ 
                    display: 'flex', 
                    background: 'linear-gradient(135deg, rgba(33,150,243,0.12), rgba(0,191,165,0.08))',
                    p: 1.5,
                    borderBottom: '1px solid rgba(33,150,243,0.2)'
                  }}>
                    <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: '#2d3748' }}>Tên chỉ số</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ width: '20%', color: '#2d3748' }}>Đơn vị</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: '#2d3748' }}>Giá trị tham chiếu</Typography>
                  </Box>
                  
                  {/* Danh sách các chỉ số xét nghiệm từ API */}
                  {detailData.components.map((component, idx) => (
                    <Box 
                      key={component.componentId || component.id || idx}
                      sx={{ 
                        display: 'flex', 
                        p: 1.5,
                        borderBottom: idx === detailData.components.length - 1 ? 'none' : '1px solid rgba(33,150,243,0.1)',
                        '&:nth-of-type(odd)': {
                          background: 'linear-gradient(135deg, rgba(248,250,252,0.6), rgba(235,245,246,0.4))'
                        },
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(0,191,165,0.05))',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      {/* Tên chỉ số - hỗ trợ cả hai cấu trúc API */}
                      <Typography variant="body2" sx={{ width: '40%', color: '#374151', fontWeight: 500 }}>
                        {component.componentName || component.testName}
                      </Typography>
                      {/* Đơn vị đo */}
                      <Typography variant="body2" sx={{ width: '20%', color: '#6b7280' }}>
                        {component.unit || '-'}
                      </Typography>
                      {/* Giá trị tham chiếu/bình thường */}
                      <Typography variant="body2" sx={{ width: '40%' }}>
                        <Box component="span" sx={{ 
                          py: 0.3, 
                          px: 1, 
                          borderRadius: 1,
                          bgcolor: 'rgba(56,161,105,0.1)',
                          color: '#059669',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {component.normalRange || component.referenceRange || 'Xem kết quả'}
                        </Box>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {/* Phần giải thích ý nghĩa kết quả xét nghiệm - chỉ hiển thị nếu có dữ liệu */}
              {detailData.components.some(comp => comp.description || comp.interpretation) && (
                <Box sx={{ 
                  mt: 3, 
                  p: 2.5, 
                  background: 'linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(235,245,246,0.12) 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(33,150,243,0.15)',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.05)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(180deg, #2196F3, #00BFA5)',
                    borderRadius: '0 2px 2px 0'
                  }
                }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#2196F3' }}>
                    Ý nghĩa kết quả xét nghiệm
                  </Typography>
                  <List disablePadding>
                    {/* Danh sách giải thích từng chỉ số */}
                    {detailData.components.map((component, idx) => (
                      component.description || component.interpretation ? (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                {component.componentName || component.testName}:
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: '#4a5568', mt: 0.5, lineHeight: 1.5 }}>
                                {component.description || component.interpretation}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ) : null
                    ))}
                  </List>
                </Box>
              )}
              
              {/* Lưu ý quan trọng về xét nghiệm - nếu có */}
              {detailData.note && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2.5, 
                  background: 'linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(0,191,165,0.12) 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(33,150,243,0.2)',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(180deg, #2196F3, #00BFA5)',
                    borderRadius: '0 2px 2px 0'
                  }
                }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#2196F3', display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    Lưu ý quan trọng
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>{detailData.note}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        
        {/* Phần 3: Chi tiết gói xét nghiệm - chỉ hiển thị nếu là gói */}
        {detailType === 'package' && detailData.services && detailData.services.length > 0 && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: '#2d3748',
              mb: 3,
              py: 1
            }}>
              <CheckCircleOutlineIcon sx={{ 
                mr: 1.5, 
                color: '#2196F3',
                fontSize: '2rem'
              }} />
              Danh sách xét nghiệm trong gói ({detailData.services.length} xét nghiệm)
            </Typography>
            
            {/* Danh sách các xét nghiệm có trong gói */}
            <List sx={{ width: '100%', pt: 0 }}>
              {detailData.services.map((service, index) => (
                <Paper
                  key={service.id}
                  elevation={0}
                  sx={{ 
                    mb: 3,
                    border: '2px solid transparent',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #ebf5f6 70%, #ffffff 100%)',
                    boxShadow: '0 6px 20px rgba(74,174,181,0.12)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, 
                        ${index % 4 === 0 ? '#4aaeb5' : 
                          index % 4 === 1 ? '#69d4db' : 
                          index % 4 === 2 ? '#5cbcc3' : '#7dd3db'}, 
                        ${index % 4 === 0 ? '#69d4db' : 
                          index % 4 === 1 ? '#4aaeb5' : 
                          index % 4 === 2 ? '#69d4db' : '#4aaeb5'})`,
                    },
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(74,174,181,0.25)',
                      transform: 'translateY(-4px) scale(1.02)',
                      borderColor: 'rgba(74,174,181,0.3)',
                      '&::before': {
                        height: '6px',
                      }
                    }
                  }}
                >
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      flexDirection: 'column',
                      p: 0,
                    }}
                  >
                    {/* Phần hiển thị rút gọn (luôn hiển thị) - tên và giá */}
                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 3,
                        cursor: 'pointer',
                        background: expandedItems[service.id] 
                          ? 'linear-gradient(135deg, rgba(33,150,243,0.15), rgba(0,191,165,0.12))' 
                          : 'transparent',
                        transition: 'all 0.3s ease',
                        borderRadius: expandedItems[service.id] ? '16px 16px 0 0' : '16px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(33,150,243,0.1), rgba(0,191,165,0.08))',
                        },
                        borderBottom: expandedItems[service.id] ? '2px solid rgba(33,150,243,0.2)' : 'none'
                      }}
                      onClick={() => handleToggleExpand(service.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Số thứ tự */}
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, 
                              ${index % 4 === 0 ? '#2196F3' : 
                                index % 4 === 1 ? '#00BFA5' : 
                                index % 4 === 2 ? '#2196F3' : '#00BFA5'}, 
                              ${index % 4 === 0 ? '#00BFA5' : 
                                index % 4 === 1 ? '#2196F3' : 
                                index % 4 === 2 ? '#00BFA5' : '#2196F3'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            mr: 3,
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 12px rgba(74,174,181,0.3)',
                            border: '3px solid rgba(255,255,255,0.9)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: '0 6px 16px rgba(74,174,181,0.4)',
                            }
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box>
                          {/* Tên xét nghiệm */}
                          <Typography fontWeight={700} sx={{ 
                            color: '#2d3748', 
                            fontSize: '1.1rem',
                            mb: 0.5,
                            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>
                            {service.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            {/* Giá xét nghiệm */}
                            <Chip 
                              label={`${service.price?.toLocaleString('vi-VN')} đ`}
                              size="small"
                              sx={{ 
                                fontSize: '0.8rem',
                                background: `linear-gradient(135deg, 
                                  ${index % 4 === 0 ? 'rgba(33,150,243,0.15)' : 
                                    index % 4 === 1 ? 'rgba(0,191,165,0.15)' : 
                                    index % 4 === 2 ? 'rgba(33,150,243,0.15)' : 'rgba(0,191,165,0.15)'}, 
                                  rgba(255,255,255,0.8))`,
                                color: '#2196F3',
                                fontWeight: 700,
                                mr: 1.5,
                                border: '1px solid rgba(33,150,243,0.2)',
                                boxShadow: '0 2px 4px rgba(33,150,243,0.1)'
                              }}
                            />
                            {/* Thời gian có kết quả */}
                            <Typography variant="body2" sx={{ 
                              color: '#6b7280',
                              backgroundColor: 'rgba(248,250,252,0.8)',
                              padding: '2px 8px',
                              borderRadius: 1,
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}>
                              {service.time || '2-3 ngày có kết quả'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Nút mở rộng/thu gọn chi tiết */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand(service.id);
                        }}
                        size="small"
                      >
                        {expandedItems[service.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    {/* Phần chi tiết xét nghiệm - chỉ hiển thị khi mở rộng */}
                    <Collapse in={expandedItems[service.id]} sx={{ width: '100%' }}>
                      <Box sx={{ 
                        p: 4, 
                        pt: 2, 
                        background: 'linear-gradient(135deg, rgba(248,250,252,0.8) 0%, rgba(235,245,246,0.6) 50%, rgba(255,255,255,0.9) 100%)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: `linear-gradient(90deg, 
                            ${index % 4 === 0 ? '#4aaeb5' : 
                              index % 4 === 1 ? '#69d4db' : 
                              index % 4 === 2 ? '#5cbcc3' : '#7dd3db'}, 
                            ${index % 4 === 0 ? '#69d4db' : 
                              index % 4 === 1 ? '#4aaeb5' : 
                              index % 4 === 2 ? '#69d4db' : '#4aaeb5'})`
                        }
                      }}>
                        {/* Mô tả xét nghiệm */}
                        <Typography variant="body2" paragraph sx={{ 
                          color: '#4a5568', 
                          mb: 3, 
                          lineHeight: 1.7,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          padding: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(74,174,181,0.15)',
                          boxShadow: '0 2px 8px rgba(74,174,181,0.05)'
                        }}>
                          {service.description || 'Xét nghiệm này giúp phát hiện kịp thời các bệnh lây truyền qua đường tình dục, đảm bảo sức khỏe sinh sản tối ưu.'}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {/* Cột thông tin chi tiết xét nghiệm */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ 
                              mb: 2,
                              p: 2,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              borderRadius: 2,
                              border: '1px solid rgba(74,174,181,0.1)'
                            }}>
                              <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ 
                                color: '#2d3748',
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5
                              }}>
                                <Box sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: '#4aaeb5',
                                  mr: 1
                                }} />
                                Thông tin chi tiết
                              </Typography>
                              <Box sx={{ 
                                pl: 2, 
                                borderLeft: `3px solid ${index % 4 === 0 ? '#4aaeb5' : 
                                  index % 4 === 1 ? '#69d4db' : 
                                  index % 4 === 2 ? '#5cbcc3' : '#7dd3db'}`,
                                backgroundColor: 'rgba(248,250,252,0.5)',
                                borderRadius: 1,
                                p: 1.5
                              }}>
                                {/* Hiển thị loại mẫu xét nghiệm - cần sửa đổi để hiển thị đúng */}
                                {service.components && service.components.length > 0 && (
                                  <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="body2" sx={{ width: '140px', color: '#6b7280' }}>
                                      Loại mẫu xét nghiệm:
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500} sx={{ color: '#374151' }}>
                                      {service.components[0].sampleType || 
                                       (service.components[0].componentId ? 'Máu' : 'Huyết thanh/Huyết tương')}
                                    </Typography>
                                  </Box>
                                )}
                                {/* Thời gian có kết quả */}
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                  <Typography variant="body2" sx={{ width: '140px', color: '#6b7280' }}>
                                    Thời gian có kết quả:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: '#374151' }}>
                                    {service.time || '2-3 ngày'}
                                  </Typography>
                                </Box>
                                {/* Độ chính xác */}
                                <Box sx={{ display: 'flex' }}>
                                  <Typography variant="body2" sx={{ width: '140px', color: '#6b7280' }}>
                                    Độ chính xác:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500} sx={{ color: '#374151' }}>
                                    {service.accuracy || '> 99%'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                          
                          {/* Cột chỉ định xét nghiệm */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ 
                              p: 2,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              borderRadius: 2,
                              border: '1px solid rgba(255,107,107,0.2)'
                            }}>
                              <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ 
                                color: '#2d3748',
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5
                              }}>
                                <Box sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: '#FF6B6B',
                                  mr: 1
                                }} />
                                Chỉ định xét nghiệm
                              </Typography>
                              <Box sx={{ 
                                pl: 2, 
                                borderLeft: '3px solid #FF6B6B',
                                backgroundColor: 'rgba(254,202,202,0.1)',
                                borderRadius: 1,
                                p: 1.5
                              }}>
                                <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.7 }}>
                                  {service.indication || 'Người có nguy cơ cao tiếp xúc với các bệnh lây truyền qua đường tình dục.'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        {/* Bảng các chỉ số xét nghiệm */}
                        {service.components && service.components.length > 0 && (
                          <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ 
                              mb: 3, 
                              color: 'white', 
                              display: 'flex', 
                              alignItems: 'center',
                              p: 2.5,
                              background: `linear-gradient(135deg, 
                                ${index % 4 === 0 ? '#4aaeb5' : 
                                  index % 4 === 1 ? '#69d4db' : 
                                  index % 4 === 2 ? '#5cbcc3' : '#7dd3db'}, 
                                ${index % 4 === 0 ? '#69d4db' : 
                                  index % 4 === 1 ? '#4aaeb5' : 
                                  index % 4 === 2 ? '#69d4db' : '#4aaeb5'})`,
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(74,174,181,0.2)'
                            }}>
                              <CheckCircleOutlineIcon sx={{ 
                                mr: 1, 
                                fontSize: '1.3rem',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                p: 0.5
                              }} />
                              Các chỉ số xét nghiệm ({service.components.length})
                            </Typography>
                            
                            <Box sx={{ 
                              bgcolor: 'rgba(255,255,255,0.95)', 
                              borderRadius: 3, 
                              border: '2px solid rgba(74,174,181,0.15)', 
                              overflow: 'hidden',
                              boxShadow: '0 4px 16px rgba(74,174,181,0.1)'
                            }}>
                              {/* Tiêu đề các cột */}
                              <Box sx={{ 
                                display: 'flex', 
                                background: `linear-gradient(135deg, 
                                  ${index % 4 === 0 ? 'rgba(74,174,181,0.15)' : 
                                    index % 4 === 1 ? 'rgba(105,212,219,0.15)' : 
                                    index % 4 === 2 ? 'rgba(92,188,195,0.15)' : 'rgba(125,211,219,0.15)'}, 
                                  rgba(248,250,252,0.8))`,
                                p: 2,
                                borderBottom: '2px solid rgba(74,174,181,0.2)'
                              }}>
                                <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: '#2d3748' }}>Tên chỉ số</Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ width: '20%', color: '#2d3748' }}>Đơn vị</Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: '#2d3748' }}>Giá trị tham chiếu</Typography>
                              </Box>
                              
                              {/* Danh sách chi tiết các chỉ số */}
                              {service.components.map((component, idx) => (
                                <Box 
                                  key={component.componentId || component.id || idx}
                                  sx={{ 
                                    display: 'flex', 
                                    p: 1.5,
                                    borderBottom: idx === service.components.length - 1 ? 'none' : '1px solid rgba(74,174,181,0.1)',
                                    '&:nth-of-type(odd)': {
                                      bgcolor: 'rgba(248,250,252,0.5)'
                                    },
                                    '&:hover': {
                                      bgcolor: 'rgba(74,174,181,0.05)'
                                    }
                                  }}
                                >
                                  {/* Tên chỉ số */}
                                  <Typography variant="body2" sx={{ width: '40%', color: '#374151', fontWeight: 500 }}>
                                    {component.componentName || component.testName}
                                  </Typography>
                                  {/* Đơn vị */}
                                  <Typography variant="body2" sx={{ width: '20%', color: '#6b7280' }}>
                                    {component.unit || '-'}
                                  </Typography>
                                  {/* Giá trị tham chiếu */}
                                  <Typography variant="body2" sx={{ width: '40%' }}>
                                    <Box component="span" sx={{ 
                                      py: 0.3, 
                                      px: 1, 
                                      borderRadius: 1,
                                      bgcolor: 'rgba(56,161,105,0.1)',
                                      color: '#059669',
                                      fontSize: '0.85rem',
                                      fontWeight: 600
                                    }}>
                                      {component.normalRange || component.referenceRange || 'Xem kết quả'}
                                    </Box>
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                        
                        {/* Ý nghĩa kết quả xét nghiệm - chỉ hiển thị khi có dữ liệu */}
                        {service.components && service.components.some(comp => comp.description || comp.interpretation) && (
                          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(74,174,181,0.05)', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#4aaeb5' }}>
                              Ý nghĩa kết quả xét nghiệm
                            </Typography>
                            <List disablePadding>
                              {/* Liệt kê ý nghĩa của từng chỉ số */}
                              {service.components.map((component, idx) => (
                                component.description || component.interpretation ? (
                                  <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemText
                                      primary={
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                          {component.componentName || component.testName}:
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="body2" sx={{ color: '#4a5568', mt: 0.5, lineHeight: 1.5 }}>
                                          {component.description || component.interpretation}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ) : null
                              ))}
                            </List>
                          </Box>
                        )}
                        
                        {/* Lưu ý quan trọng về xét nghiệm này */}
                        {service.note && (
                          <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,107,107,0.08)', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#FF6B6B', display: 'flex', alignItems: 'center' }}>
                              <InfoOutlinedIcon sx={{ mr: 1, fontSize: '1rem' }} />
                              Lưu ý quan trọng
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>{service.note}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      
      {/* Phần chân dialog - chứa các nút thao tác */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        {/* Nút đăng ký gói - chỉ hiển thị khi xem chi tiết gói */}
        {detailType === 'package' && (
          <Button
            variant="contained"
            onClick={handleRegisterService}
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 50,
              px: 4,
              py: 1,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(33,150,243,0.25)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00BFA5, #2196F3)',
                boxShadow: '0 8px 24px rgba(33,150,243,0.35)',
              },
            }}
          >
            Đăng ký gói này
          </Button>
        )}
        
        {/* Nút đăng ký xét nghiệm - chỉ hiển thị khi xem chi tiết xét nghiệm đơn lẻ */}
        {detailType !== 'package' && detailData.components && detailData.components.length > 0 && (
          <Button
            variant="contained"
            onClick={handleRegisterService}
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 50,
              px: 4,
              py: 1,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(33,150,243,0.25)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00BFA5, #2196F3)',
                boxShadow: '0 8px 24px rgba(33,150,243,0.35)',
              },
            }}
          >
            Đăng ký xét nghiệm này
          </Button>
        )}
        
        {/* Nút đóng dialog */}
        <Button
          onClick={onClose}
          sx={{
            color: '#2196F3',
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ServiceDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detailData: PropTypes.object,
  detailType: PropTypes.oneOf(['single', 'package']),
  loadingDetail: PropTypes.bool,
  onOpenDetail: PropTypes.func,
  onSelectService: PropTypes.func
};

export default ServiceDetailDialog;

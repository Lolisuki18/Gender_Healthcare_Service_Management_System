// Thư viện React và các hook cơ bản
import React, { useEffect, useState } from 'react';
// Import các component UI từ Material-UI (MUI)
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  useTheme,
  Container,
  Zoom,
  Dialog,
  DialogActions,
} from '@mui/material';
// Icon từ MUI
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// React Router
import { useNavigate } from 'react-router-dom';
// Hàm gọi API lấy danh sách gói xét nghiệm
import { getAllSTIPackages } from '@/services/stiService';

export default function StiDetailPage() {
  const navigate = useNavigate(); // Hook điều hướng
  const [packages, setPackages] = useState([]); // Danh sách gói xét nghiệm
  const theme = useTheme(); // Hook lấy theme MUI
  const [loaded, setLoaded] = React.useState(false); // State hiệu ứng xuất hiện
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // Dialog chi tiết gói
  const [detailData, setDetailData] = useState(null); // Dữ liệu chi tiết gói
  // Thêm state mới cho dialog chi tiết xét nghiệm
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [currentServiceDetail, setCurrentServiceDetail] = useState(null);

  useEffect(() => {
    // Lấy danh sách gói xét nghiệm khi load trang
    const fetchPackages = async () => {
      try {
        const res = await getAllSTIPackages();
        if (res.success) setPackages(res.data);
      } catch {
        setPackages([]);
      }
    };
    fetchPackages();
    // Hiệu ứng xuất hiện mượt mà
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Hàm mở dialog chi tiết gói
  const handleOpenDetail = (pkg) => {
    setDetailData(pkg);
    setDetailDialogOpen(true);
  };

  // Hàm mở dialog chi tiết xét nghiệm
  const handleOpenServiceDetail = (service) => {
    setCurrentServiceDetail(service);
    setServiceDetailOpen(true);
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
      {/* --- Nền trang với các hình tròn trang trí --- */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
          top: { xs: -50, md: -100 },
          left: { xs: -50, md: -100 },
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 200, md: 400 },
          height: { xs: 200, md: 400 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        {/* --- Nút quay lại --- */}
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, fontWeight: 600, color: theme => theme.palette.primary.main, background: 'rgba(74,144,226,0.07)', borderRadius: 50, px: 3, py: 1, textTransform: 'none', '&:hover': { background: 'rgba(74,144,226,0.15)' } }}
          onClick={() => navigate(-1)}
        >
          Quay lại Dịch vụ
        </Button>
        {/* --- Header: Tiêu đề, mô tả, underline --- */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 2,
              gap: 2,
            }}
          >
            {/* <Chip
              label="DỊCH VỤ SỨC KHỎE GIỚI TÍNH"
              sx={{
                bgcolor: theme => theme.palette.primary.light + '30',
                color: theme => theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '24px',
                px: 2.5,
                py: 1.2,
                height: 'auto',
                letterSpacing: 0.5,
                mr: { xs: 0, sm: 2 },
              }}
            /> */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                color: 'transparent',
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-1px',
                mb: 2,
              }}
            >
              Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STI)
            </Typography>
          </Box>
           {/* Gạch chân gradient dưới tiêu đề */}
          <Box
            sx={{
              width: 120,
              height: 6,
              mx: 'auto',
              mt: 2,
              mb: 2,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
            }}
          />
          <Typography
            sx={{
              color: theme => theme.palette.text.secondary,
              maxWidth: '700px',
              mx: 'auto',
              mt: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.7,
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            Dịch vụ xét nghiệm toàn diện và bảo mật các bệnh lây truyền qua đường tình dục với kết quả nhanh chóng và hỗ trợ chuyên nghiệp.
          </Typography>
        </Box>
                <Box sx={{ 
  bgcolor: '#fff', 
  borderRadius: 4, 
  boxShadow: '0 10px 40px rgba(74,144,226,0.08)', 
  p: { xs: 3, md: 5 }, 
  mb: 6,
  border: '1px solid rgba(74,144,226,0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(74,144,226,0.03) 0%, rgba(255,255,255,0) 70%)',
    top: -150,
    right: -150,
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26,188,156,0.03) 0%, rgba(255,255,255,0) 70%)',
    bottom: -150,
    left: -150,
    zIndex: 0,
  }
}}>
  <Box sx={{ position: 'relative', zIndex: 1 }}>
    <Typography 
      variant="h6" 
      fontWeight={800} 
      mt={2} 
      mb={2} 
      color={theme => theme.palette.primary.main}
      sx={{
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
    <Typography mb={3} color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
      Dịch vụ xét nghiệm STI cung cấp các gói xét nghiệm tổng quát và xét nghiệm lẻ cho các bệnh như HIV, chlamydia, lậu, giang mai, herpes, viêm gan B, viêm gan C... Kết quả bảo mật, tư vấn chuyên sâu và hỗ trợ điều trị nếu cần thiết.
    </Typography>
    
    <Typography 
      variant="h6" 
      fontWeight={800} 
      mt={4} 
      mb={2} 
      color={theme => theme.palette.primary.main}
      sx={{
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
      Quy trình xét nghiệm
    </Typography>
    <List sx={{
      '& .MuiListItem-root': { py: 1 },
      '& .MuiListItemText-primary': { lineHeight: 1.6, fontSize: '1.05rem' },
      pl: 1,
      mb: 2
    }}>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
        </ListItemIcon>
        <ListItemText primary="Tư vấn ban đầu với chuyên gia y tế về lịch sử sức khỏe và triệu chứng." />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
        </ListItemIcon>
        <ListItemText primary="Lấy mẫu: tuỳ loại xét nghiệm có thể lấy máu, nước tiểu hoặc dịch." />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
        </ListItemIcon>
        <ListItemText primary="Mẫu được gửi đến phòng xét nghiệm đạt chuẩn để phân tích." />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
        </ListItemIcon>
        <ListItemText primary="Trả kết quả nhanh chóng (2-5 ngày làm việc)." />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
        </ListItemIcon>
        <ListItemText primary="Tư vấn kết quả và hỗ trợ điều trị nếu cần thiết." />
      </ListItem>
    </List>
    
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, mt: 5 }}>
      <Box sx={{ flex: '1 1 300px' }}>
        <Typography 
          variant="h6" 
          fontWeight={800} 
          mb={2} 
          color={theme => theme.palette.primary.main}
          sx={{
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
          Lý do chọn dịch vụ của chúng tôi
        </Typography>
        <List sx={{
          '& .MuiListItem-root': { py: 0.75 },
          '& .MuiListItemText-primary': { lineHeight: 1.6, fontSize: '1.05rem' },
          pl: 1
        }}>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Bảo mật tuyệt đối thông tin khách hàng." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Trang thiết bị hiện đại, kết quả chính xác." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Đội ngũ chuyên gia tận tâm, tư vấn chuyên sâu." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Đặt lịch linh hoạt, dễ dàng." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Hỗ trợ điều trị và kê đơn nếu cần thiết." />
          </ListItem>
        </List>
      </Box>
      
      <Box sx={{ flex: '1 1 300px' }}>
        <Typography 
          variant="h6" 
          fontWeight={800} 
          mb={2} 
          color={theme => theme.palette.primary.main}
          sx={{
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
          Khi nào nên xét nghiệm?
        </Typography>
        <List sx={{
          '& .MuiListItem-root': { py: 0.75 },
          '& .MuiListItemText-primary': { lineHeight: 1.6, fontSize: '1.05rem' },
          pl: 1
        }}>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Khi có bạn tình mới hoặc nhiều bạn tình." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Khi có triệu chứng nghi ngờ mắc bệnh lây truyền qua đường tình dục." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Sau khi quan hệ không an toàn." />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckIcon sx={{ color: '#43a047', fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText primary="Định kỳ kiểm tra sức khỏe tình dục." />
          </ListItem>
        </List>
      </Box>
    </Box>
  </Box>
</Box>

{/* Bảng giá dịch vụ */}
<Box sx={{ mb: 6, textAlign: 'center', position: 'relative' }}>
  <Typography 
    variant="h4" 
    fontWeight={800} 
    mb={5} 
    sx={{
      color: theme => theme.palette.text.primary,
      display: 'inline-block',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '60px',
        height: '5px',
        borderRadius: 3,
        background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
        bottom: '-15px',
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }}
  >
    Bảng giá dịch vụ
  </Typography>
</Box>
        {/* --- Grid danh sách gói xét nghiệm --- */}
        <Grid container spacing={5} sx={{ width: '100%', mb: 8 }} justifyContent="center">
          {packages.map((pkg, idx) => (
            <Grid item xs={12} sm={6} md={6} key={pkg.id} display="flex" justifyContent="center">
              <Zoom in={loaded} style={{ transitionDelay: `${idx * 100 + 200}ms` }}>
                {/* --- Card gói xét nghiệm --- */}
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(74,144,226,0.1)',
                  width: '100%',
                  maxWidth: 380,
                  minWidth: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(180deg, #f8faff 0%, #f4f9ff 100%)',
                  border: '1px solid rgba(74,144,226,0.05)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(74,144,226,0.15)',
                  }
                }}>
                  {/* Title bar with gradient */}
                  <Box sx={{
                    background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                    color: 'white',
                    py: 2,
                    px: 3,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}>
                    <Typography
                      fontWeight={800}
                      fontSize={20}
                      sx={{
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                      }}
                    >
                      {pkg.name}
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    p: 3 
                  }}>
                    <Typography 
                      color="text.secondary" 
                      mb={3} 
                      fontSize={15} 
                      sx={{ 
                        fontWeight: 400, 
                        lineHeight: 1.6,
                        textAlign: 'center',
                        minHeight: 48 
                      }}
                    >
                      {pkg.description}
                    </Typography>
                    
                    <Typography 
                      fontWeight={800} 
                      color="primary" 
                      mb={3}
                      fontSize={24}
                      sx={{
                        textAlign: 'center',
                        display: 'block',
                        p: 1.5,
                        borderTop: '1px dashed rgba(74,144,226,0.15)',
                        borderBottom: '1px dashed rgba(74,144,226,0.15)',
                      }}
                    >
                      {pkg.price?.toLocaleString('vi-VN')} đ
                    </Typography>
                    
                    {/* --- Nút đăng ký và xem chi tiết --- */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                          color: '#fff',
                          fontWeight: 700,
                          borderRadius: 50,
                          px: 3,
                          py: 1.2,
                          minWidth: 110,
                          fontSize: '1rem',
                          boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)',
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 18px rgba(74, 144, 226, 0.18)',
                          },
                        }}
                        onClick={() => navigate('/test-registration', { state: { selectedPackage: pkg } })}
                      >
                        Đăng ký
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: 50,
                          fontWeight: 700,
                          px: 3,
                          py: 1.2,
                          minWidth: 100,
                          fontSize: '1rem',
                          borderColor: theme => theme.palette.primary.main,
                          borderWidth: 2,
                          color: theme => theme.palette.primary.main,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: theme => theme.palette.primary.dark,
                            background: 'rgba(74,144,226,0.07)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => handleOpenDetail(pkg)}
                      >
                        Chi tiết
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Dialog chi tiết gói */}
        <Dialog 
          open={detailDialogOpen} 
          onClose={() => setDetailDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            style: {
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.20)"
            }
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            p: 0, 
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            height: 'auto', // Changed from maxHeight to fixed height
            maxHeight: '90vh' // Keep this to ensure it doesn't exceed screen height
          }}>
            {/* Background decoration */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 200, md: 300 },
                height: { xs: 200, md: 300 },
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
                top: -100,
                right: -100,
                zIndex: 0,
                pointerEvents: 'none', // Ensure decorations don't interfere with content
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 200, md: 300 },
                height: { xs: 200, md: 300 },
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)',
                bottom: -100,
                left: -100,
                zIndex: 0,
                pointerEvents: 'none', // Ensure decorations don't interfere with content
              }}
            />
            
            {/* Header with gradient - remains fixed */}
            <Box sx={{ 
              py: 4, 
              px: 4,
              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
              color: 'white',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              flexShrink: 0 // Prevent header from shrinking
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
                {detailData?.name || 'Chi tiết gói xét nghiệm'}
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
                {detailData?.description}
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
                  {detailData?.price?.toLocaleString('vi-VN')} đ
                </Typography>
              </Box>
            </Box>
            
            {/* Scrollable content area */}
            <Box 
              sx={{ 
                p: 0, 
                position: 'relative', 
                zIndex: 1,
                overflowY: 'auto', // Enable vertical scrolling
                flexGrow: 1, // Allow content to grow and take available space
                px: 4,
                pb: 4
              }}
            >
              {detailData ? (
                <Box>
                  {/* Services list */}
                  <Box sx={{ mb: 3 }}>
                    {detailData.services && Array.isArray(detailData.services) && detailData.services.length > 0 && (
                      <>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{
                            color: '#2d3748',
                            mb: 3,
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
                            {detailData.services.length}
                          </Box>
                          Dịch vụ trong gói xét nghiệm
                        </Typography>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2.5,
                            p: 3,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(247,250,252,0.95) 100%)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                          }}
                        >
                          {detailData.services.map((svc, i) => (
                            <Box
                              key={svc.id || i}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                bgcolor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 5px 15px rgba(74,144,226,0.08)',
                                overflow: 'hidden',
                                p: 2,
                                transition: 'all 0.3s',
                                border: '1px solid rgba(0,0,0,0.02)',
                                '&:hover': {
                                  boxShadow: '0 10px 25px rgba(74,144,226,0.12)',
                                  transform: 'translateY(-3px)',
                                  borderColor: 'rgba(74,144,226,0.08)'
                                }
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: 50,
                                  height: 50,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.08) 0%, rgba(74, 144, 226, 0.15) 100%)',
                                  color: '#4A90E2',
                                  flexShrink: 0,
                                  border: '1px solid rgba(74,144,226,0.1)'
                                }}
                              >
                                <CheckIcon sx={{ color: '#43a047', fontSize: 28 }} />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography fontSize={16} color="text.primary" fontWeight={700}>
                                  {svc.name}
                                </Typography>
                                {svc.components && (
                                  <Typography variant="body2" color="text.secondary">
                                    {svc.components.length} chỉ số xét nghiệm • {svc.resultTime || "2-3 ngày có kết quả"}
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                                {svc.price && (
                                  <Typography fontSize={16} color="primary" fontWeight={700} sx={{ minWidth: 100, textAlign: 'right' }}>
                                    {svc.price.toLocaleString('vi-VN')} đ
                                  </Typography>
                                )}
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenServiceDetail(svc);
                                  }}
                                  sx={{
                                    borderRadius: 6,
                                    minWidth: 'auto',
                                    fontSize: '0.85rem',
                                    py: 0.6,
                                    px: 1.5,
                                    borderWidth: 2,
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                      bgcolor: 'rgba(74,144,226,0.08)',
                                      borderWidth: 2,
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
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="error">Không thể tải chi tiết gói.</Typography>
                </Box>
              )}
            </Box>
            
            {/* Footer - remains fixed */}
            <DialogActions 
              sx={{ 
                justifyContent: 'space-between', 
                p: 3, 
                bgcolor: 'rgba(255,255,255,0.8)',
                flexShrink: 0, // Prevent footer from shrinking
                borderTop: '1px solid rgba(0,0,0,0.05)', // Add border for visual separation
                backdropFilter: 'blur(10px)'
              }}
            >
              <Button 
                onClick={() => setDetailDialogOpen(false)} 
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
                onClick={() => navigate('/test-registration', { state: { selectedPackage: detailData } })}
              >
                Đăng ký ngay
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Dialog chi tiết xét nghiệm */}
        <Dialog 
          open={serviceDetailOpen} 
          onClose={() => setServiceDetailOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            style: {
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.20)"
            }
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            p: 0, 
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            maxHeight: '90vh',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)'
          }}>
            {/* Header with gradient */}
            <Box sx={{ 
              position: 'relative',
              py: 3, 
              px: 4,
              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
              color: 'white',
              zIndex: 1,
              textAlign: 'center',
              flexShrink: 0
            }}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, bgcolor: 'rgba(0,0,0,0.1)' }} />
              <Typography 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: 26, 
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1,
                  letterSpacing: '-0.5px'
                }}
              >
                {currentServiceDetail?.name || 'Chi tiết xét nghiệm'}
              </Typography>
              {currentServiceDetail?.price && (
                <Typography 
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {currentServiceDetail.price.toLocaleString('vi-VN')} đ
                </Typography>
              )}
            </Box>
            
            {/* Scrollable content area */}  
            <Box 
              sx={{ 
                position: 'relative',
                overflowY: 'auto',
                flexGrow: 1,
                zIndex: 1,
                px: 4,
                py: 4
              }}
            >
              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: 200, md: 350 },
                  height: { xs: 200, md: 350 },
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(74,144,226,0.05) 0%, rgba(255,255,255,0) 70%)',
                  top: '50%',
                  right: -100,
                  transform: 'translateY(-50%)',
                  zIndex: 0,
                  pointerEvents: 'none', // Ensure decorations don't interfere with scrolling
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: { xs: 200, md: 350 },
                  height: { xs: 200, md: 350 },
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(26,188,156,0.05) 0%, rgba(255,255,255,0) 70%)',
                  bottom: -150,
                  left: -100,
                  zIndex: 0,
                  pointerEvents: 'none', // Ensure decorations don't interfere with scrolling
                }}
              />
              
              {currentServiceDetail ? (
                <Box sx={{ position: 'relative', zIndex: 1 }}>
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
                      {currentServiceDetail.description || 'Xét nghiệm giúp phát hiện sớm các bệnh lây truyền qua đường tình dục.'}
                    </Typography>
                    
                    {currentServiceDetail.components && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                        <Chip 
                          label={`${currentServiceDetail.components.length} chỉ số xét nghiệm`}
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
                          • {currentServiceDetail.resultTime || '2-3 ngày có kết quả'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                        
                  {/* Test components section */}
                  {currentServiceDetail.components && currentServiceDetail.components.length > 0 && (
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
                          {currentServiceDetail.components?.length || 0}
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
                        {currentServiceDetail.components.map((component, idx) => (
                          <Box
                            key={component.id || idx}
                            sx={{
                              p: 3,
                              mb: idx === currentServiceDetail.components.length - 1 ? 0 : 3,
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
                                  {component.testName}
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
                                    label={component.referenceRange} 
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
                                  {component.interpretation}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="error">Không thể tải thông tin chi tiết.</Typography>
                </Box>
              )}
            </Box>
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
              <Button 
                onClick={() => setServiceDetailOpen(false)} 
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
                onClick={() => navigate('/test-registration', { 
                  state: { 
                    selectedService: currentServiceDetail,
                    fromPackage: detailData?.name 
                  } 
                })}
              >
                Đăng ký xét nghiệm
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}
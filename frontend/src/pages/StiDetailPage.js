// ===== IMPORT CÁC THỨ VIỆN VÀ COMPONENT CẦN THIẾT =====
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
  Container,
  Zoom,
  Fade,
  Paper,
  Avatar,
  Stack,
  Breadcrumbs,
  Link,
} from '@mui/material';
// Icon từ MUI
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
// React Router
import { useNavigate } from 'react-router-dom';
// API và utilities
import apiClient from '@/services/api';
import localStorageUtil from '@/utils/localStorage';
// Hàm gọi API lấy danh sách gói xét nghiệm
import { getAllSTIPackages } from '@/services/stiService';
// Import component dialog chi tiết dịch vụ
import ServiceDetailDialog from '@/components/TestRegistration/ServiceDetailDialog';

// ===== COMPONENT TRANG CHI TIẾT XÉT NGHIỆM STI =====
// Trang này hiển thị thông tin chi tiết về dịch vụ xét nghiệm STI và danh sách các gói xét nghiệm
export default function StiDetailPage() {
  const navigate = useNavigate(); // Hook điều hướng để chuyển trang
  
  // ===== CÁC STATE QUẢN LÝ DỮ LIỆU VÀ TRẠNG THÁI =====
  const [packages, setPackages] = useState([]); // Danh sách gói xét nghiệm STI
  const [loaded, setLoaded] = React.useState(false); // State hiệu ứng xuất hiện mượt mà
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // Điều khiển dialog chi tiết gói
  const [detailData, setDetailData] = useState(null); // Dữ liệu chi tiết gói đang xem
  const [loadingDetail, setLoadingDetail] = useState(false); // Trạng thái loading khi tải chi tiết
  
  // State cho dialog chi tiết xét nghiệm đơn lẻ
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false); // Điều khiển dialog chi tiết xét nghiệm
  const [currentServiceDetail, setCurrentServiceDetail] = useState(null); // Dữ liệu xét nghiệm đang xem chi tiết

  // ===== EFFECT CHẠY KHI COMPONENT ĐƯỢC MOUNT =====
  useEffect(() => {
    // ===== HÀM LẤY DANH SÁCH GÓI XÉT NGHIỆM TỪ API =====
    const fetchPackages = async () => {
      try {
        // Gọi API lấy tất cả gói xét nghiệm STI
        const res = await getAllSTIPackages();
        // Nếu API trả về thành công, cập nhật state packages
        if (res.success) setPackages(res.data);
      } catch {
        // Nếu có lỗi, đặt packages thành mảng rỗng để tránh crash
        setPackages([]);
      }
    };
    
    // Gọi hàm fetch data
    fetchPackages();
    
    // ===== THIẾT LẬP HIỆU ỨNG XUẤT HIỆN MƯỢT MÀ =====
    // Sau 100ms mới cho phép các animation fade/zoom chạy
    const timer = setTimeout(() => setLoaded(true), 100);
    
    // Cleanup function: xóa timer khi component unmount để tránh memory leak
    return () => clearTimeout(timer);
  }, []); // Dependencies rỗng => chỉ chạy 1 lần khi mount

  // ===== HÀM MỞ DIALOG CHI TIẾT GÓI XÉT NGHIỆM =====
  // Hàm này được gọi khi người dùng click nút "Chi tiết" trên card gói xét nghiệm
  const handleOpenDetail = (pkg) => {
    // Đặt dữ liệu gói đã chọn vào state để hiển thị trong dialog
    setDetailData(pkg);
    // Mở dialog chi tiết gói
    setDetailDialogOpen(true);
    // Không cần loading vì dữ liệu đã có sẵn từ API call ban đầu
    setLoadingDetail(false);
  };

  // ===== HÀM MỞ DIALOG CHI TIẾT XÉT NGHIỆM ĐƠN LẺ =====
  // Hàm này có thể được gọi theo 2 cách:
  // 1. Từ ServiceDetailDialog với serviceId (string/number) và type
  // 2. Trực tiếp với service object từ component khác
  const handleOpenServiceDetail = (serviceOrId, type = 'single') => {
    // ===== TRƯỜNG HỢP 1: ĐƯỢC GỌI VỚI SERVICE ID =====
    if (typeof serviceOrId === 'string' || typeof serviceOrId === 'number') {
      // Tìm kiếm service trong danh sách packages đã load
      let foundService = null;
      
      // Duyệt qua tất cả packages để tìm service có ID khớp
      for (const pkg of packages) {
        // Kiểm tra nếu package có danh sách services
        if (pkg.services && Array.isArray(pkg.services)) {
          // Tìm service có ID khớp trong package này
          foundService = pkg.services.find(service => service.id === serviceOrId);
          if (foundService) break; // Thoát loop khi tìm thấy
        }
      }
      
      // Nếu tìm thấy service, hiển thị dialog
      if (foundService) {
        setCurrentServiceDetail(foundService);
        setServiceDetailOpen(true);
        setLoadingDetail(false); // Không cần loading vì data đã có
      } else {
        // Log lỗi nếu không tìm thấy service
        console.error('Service not found with ID:', serviceOrId);
      }
    } else {
      // ===== TRƯỜNG HỢP 2: ĐƯỢC GỌI VỚI SERVICE OBJECT =====
      // Đặt trực tiếp service object vào state
      setCurrentServiceDetail(serviceOrId);
      setServiceDetailOpen(true);
      setLoadingDetail(false);
    }
  };

  // ===== HÀM XỬ LÝ ĐĂNG KÝ XÉT NGHIỆM VỚI KIỂM TRA ĐĂNG NHẬP =====
  // Hàm này kiểm tra trạng thái đăng nhập trước khi chuyển đến trang đăng ký
  const handleTestRegistration = async (selectedPackage = null) => {
    try {
      // ===== KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP =====
      // Gọi API để check authentication status - sử dụng endpoint có sẵn
      const response = await apiClient.get('/users/profile', { 
        skipAutoRedirect: true // Không tự động redirect khi lỗi
      });
      
      // ===== NẾU ĐÃ ĐĂNG NHẬP - CHUYỂN ĐẾN TRANG ĐĂNG KÝ =====
      if (response.status === 200) {
        if (selectedPackage) {
          // Chuyển với dữ liệu gói đã chọn và bỏ qua bước chọn dịch vụ
          navigate('/test-registration', { 
            state: { 
              selectedPackage,
              activeStep: 1, // Chuyển thẳng đến bước chọn ngày giờ
              initialStep: 1,
              skipServiceSelection: true
            } 
          });
        } else {
          // Chuyển không có gói nào được chọn trước
          navigate('/test-registration');
        }
      }
    } catch (error) {
      // Nếu lỗi 401/403 => chưa đăng nhập
      if (error.response?.status === 401 || error.response?.status === 403) {
        const redirectData = { path: "/test-registration" };
        if (selectedPackage) {
          redirectData.state = { selectedPackage };
        }
        localStorageUtil.set("redirectAfterLogin", redirectData);
        navigate("/login");
      } else {
        // Lỗi khác => vẫn cho phép truy cập
        if (selectedPackage) {
          navigate('/test-registration', { state: { selectedPackage } });
        } else {
          navigate('/test-registration');
        }
      }
    }
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
          background: 'radial-gradient(circle, rgba(33,150,243,0.08) 0%, rgba(255,255,255,0) 70%)',
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
          background: 'radial-gradient(circle, rgba(0,191,165,0.08) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 6,
            '& .MuiBreadcrumbs-separator': {
              color: '#90a4ae',
              mx: 1
            },
            '& .MuiBreadcrumbs-li': {
              fontSize: '1rem'
            }
          }}
        >
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, mb: '-2px' }} /> Trang chủ
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/sti-services')}
            sx={{
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            Dịch vụ STI
          </Link>
          <Typography color="#26c6da" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Chi tiết
          </Typography>
        </Breadcrumbs>

        {/* --- Nút quay lại --- */}
        <Fade in={loaded} timeout={600}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ 
              mb: 4, 
              fontWeight: 700, 
              color: '#fff',
              background: 'linear-gradient(45deg, #2196F3, #00BFA5)', 
              borderRadius: 50, 
              px: 4, 
              py: 1.5, 
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                background: 'linear-gradient(45deg, #00BFA5, #2196F3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)'
              } 
            }}
            onClick={() => navigate(-1)}
          >
            Quay lại Dịch vụ
          </Button>
        </Fade>

        {/* --- Header: Tiêu đề, mô tả, underline --- */}
        <Fade in={loaded} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="✨ Xét nghiệm STI chuyên nghiệp"
              sx={{
                mb: 3,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, rgba(33,150,243,0.1), rgba(0,191,165,0.1))',
                color: '#2196F3',
                border: '1px solid rgba(33,150,243,0.2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, rgba(33,150,243,0.15), rgba(0,191,165,0.15))',
                },
              }}
            />
            
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
                color: 'transparent',
                background: 'linear-gradient(135deg, #2196F3 0%, #00BFA5 50%, #2196F3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                mb: 3,
                textShadow: '0 4px 8px rgba(33, 150, 243, 0.1)',
              }}
            >
              Xét nghiệm STI
            </Typography>

            {/* Gạch chân gradient dưới tiêu đề */}
            <Box
              sx={{
                width: 180,
                height: 8,
                mx: 'auto',
                mb: 4,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #2196F3 0%, #00BFA5 50%, #2196F3 100%)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              }}
            />
            
            <Typography
              sx={{
                color: (theme) => theme.palette.text.secondary,
                maxWidth: '900px',
                mx: 'auto',
                fontSize: { xs: '1.15rem', md: '1.3rem' },
                lineHeight: 1.8,
                fontWeight: 400,
                textAlign: 'center',
                mb: 4,
              }}
            >
              Dịch vụ xét nghiệm toàn diện và bảo mật các bệnh lây truyền qua đường tình dục 
              với kết quả nhanh chóng, chính xác và hỗ trợ chuyên nghiệp từ đội ngũ y bác sĩ giàu kinh nghiệm.
            </Typography>

            {/* Statistics Cards */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              {[
                { number: '15+', label: 'Loại xét nghiệm', color: '#2196F3' },
                { number: '98%', label: 'Độ chính xác', color: '#00BFA5' },
                { number: '2-5 ngày', label: 'Có kết quả', color: '#2196F3' },
              ].map((stat, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,255,0.9))',
                    border: `1px solid ${stat.color}20`,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    minWidth: 160,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 30px ${stat.color}25`,
                      border: `1px solid ${stat.color}40`,
                    }
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 900, 
                      color: stat.color,
                      mb: 1,
                      fontSize: '2rem'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Fade>
        {/* --- Phần mô tả dịch vụ --- */}
        <Fade in={loaded} timeout={1000}>
          <Paper 
            elevation={0}
            sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
              borderRadius: 5, 
              boxShadow: '0 20px 60px rgba(33,150,243,0.08)', 
              p: { xs: 4, md: 6 }, 
              mb: 8,
              border: '1px solid rgba(33,150,243,0.1)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(33,150,243,0.05) 0%, rgba(255,255,255,0) 70%)',
                top: -200,
                right: -200,
                zIndex: 0,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,191,165,0.05) 0%, rgba(255,255,255,0) 70%)',
                bottom: -150,
                left: -150,
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Icon và tiêu đề chính */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                    mr: 3,
                    boxShadow: '0 8px 24px rgba(33,150,243,0.3)',
                  }}
                >
                  <CheckIcon sx={{ fontSize: '2rem', color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={900} 
                    sx={{
                      color: 'transparent',
                      background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    Về dịch vụ của chúng tôi
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Chuyên nghiệp • Bảo mật • Chính xác
                  </Typography>
                </Box>
              </Box>

              <Typography mb={4} color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                Dịch vụ xét nghiệm STI cung cấp các gói xét nghiệm tổng quát và xét nghiệm lẻ cho các bệnh như 
                <strong> HIV, chlamydia, lậu, giang mai, herpes, viêm gan B, viêm gan C</strong>... 
                Kết quả hoàn toàn bảo mật, tư vấn chuyên sâu và hỗ trợ điều trị nếu cần thiết.
              </Typography>
              
              <Grid container spacing={4}>
                {/* Quy trình xét nghiệm */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(33,150,243,0.05) 100%)',
                    borderRadius: 4,
                    border: '1px solid rgba(33,150,243,0.15)',
                    height: '100%'
                  }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      mb={3} 
                      sx={{
                        color: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.3rem'
                      }}
                    >
                      🔬 Quy trình xét nghiệm
                    </Typography>
                    <List sx={{
                      '& .MuiListItem-root': { py: 1, px: 0 },
                      '& .MuiListItemText-primary': { lineHeight: 1.6, fontSize: '1rem' },
                    }}>
                      {[
                        'Tư vấn ban đầu với chuyên gia y tế',
                        'Lấy mẫu: máu, nước tiểu hoặc dịch',
                        'Phân tích tại phòng lab đạt chuẩn',
                        'Trả kết quả nhanh (2-5 ngày)',
                        'Tư vấn kết quả và hỗ trợ điều trị'
                      ].map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}>
                              {index + 1}
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>

                {/* Lý do chọn chúng tôi */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(0,191,165,0.05) 100%)',
                    borderRadius: 4,
                    border: '1px solid rgba(0,191,165,0.15)',
                    height: '100%'
                  }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      mb={3} 
                      sx={{
                        color: '#00BFA5',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.3rem'
                      }}
                    >
                      ⭐ Tại sao chọn chúng tôi?
                    </Typography>
                    <List sx={{
                      '& .MuiListItem-root': { py: 1, px: 0 },
                      '& .MuiListItemText-primary': { lineHeight: 1.6, fontSize: '1rem' },
                    }}>
                      {[
                        'Bảo mật tuyệt đối thông tin khách hàng',
                        'Trang thiết bị hiện đại, kết quả chính xác',
                        'Đội ngũ chuyên gia tận tâm, giàu kinh nghiệm',
                        'Đặt lịch linh hoạt, hỗ trợ 24/7',
                        'Hỗ trợ điều trị và kê đơn nếu cần'
                      ].map((reason, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon sx={{ color: '#00BFA5', fontSize: 24, fontWeight: 'bold' }} />
                          </ListItemIcon>
                          <ListItemText primary={reason} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>

                {/* Khi nào nên xét nghiệm */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(33,150,243,0.05) 100%)',
                    borderRadius: 4,
                    border: '1px solid rgba(33,150,243,0.15)',
                    mt: 2
                  }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      mb={3} 
                      sx={{
                        color: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.3rem'
                      }}
                    >
                      🩺 Khi nào nên xét nghiệm STI?
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { icon: '👥', text: 'Khi có bạn tình mới hoặc nhiều bạn tình' },
                        { icon: '⚠️', text: 'Khi có triệu chứng nghi ngờ mắc bệnh STI' },
                        { icon: '🔒', text: 'Sau khi quan hệ không an toàn' },
                        { icon: '📅', text: 'Định kỳ kiểm tra sức khỏe tình dục' }
                      ].map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 3,
                            background: 'rgba(255,255,255,0.7)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateX(10px)',
                              boxShadow: '0 4px 16px rgba(33,150,243,0.15)'
                            }
                          }}>
                            <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>{item.icon}</Typography>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>{item.text}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>

        {/* --- Bảng giá dịch vụ --- */}
        <Fade in={loaded} timeout={1200}>
          <Box sx={{ mb: 8, textAlign: 'center', position: 'relative' }}>
            <Chip
              label="💰 Bảng giá"
              sx={{
                mb: 3,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, rgba(33,150,243,0.1), rgba(0,191,165,0.1))',
                color: '#2196F3',
                border: '1px solid rgba(33,150,243,0.2)',
              }}
            />
            
            <Typography 
              variant="h4" 
              fontWeight={900} 
              mb={2}
              sx={{
                color: 'transparent',
                background: 'linear-gradient(135deg, #2196F3 0%, #00BFA5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.2rem', md: '2.8rem' }
              }}
            >
              Gói xét nghiệm STI
            </Typography>
            
            <Box
              sx={{
                width: 120,
                height: 6,
                mx: 'auto',
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(90deg, #2196F3 0%, #00BFA5 100%)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              }}
            />
            
            <Typography 
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 6
              }}
            >
              Chọn gói xét nghiệm phù hợp với nhu cầu của bạn. Tất cả các gói đều bao gồm tư vấn miễn phí.
            </Typography>
          </Box>
        </Fade>

        {/* --- Grid danh sách gói xét nghiệm --- */}
        <Grid container spacing={4} sx={{ width: '100%', mb: 8 }} justifyContent="center">
          {packages.map((pkg, idx) => (
            <Grid item xs={12} sm={6} lg={4} key={pkg.id} display="flex" justifyContent="center">
              <Zoom in={loaded} style={{ transitionDelay: `${idx * 150 + 600}ms` }}>
                {/* --- Card gói xét nghiệm --- */}
                <Card sx={{
                  borderRadius: 5,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  width: '100%',
                  maxWidth: 360,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
                  border: '1px solid rgba(33,150,243,0.2)',
                  backdropFilter: 'blur(20px)',
                  '&:hover': {
                    transform: 'translateY(-15px) scale(1.02)',
                    boxShadow: '0 25px 60px rgba(33,150,243,0.2)',
                    '& .package-header': {
                      background: 'linear-gradient(135deg, #2196F3, #00BFA5)',
                    },
                    '& .package-button': {
                      background: 'linear-gradient(45deg, #00BFA5, #2196F3)',
                      transform: 'translateY(-2px)',
                    }
                  }
                }}>
                  {/* Header với gradient */}
                  <Box 
                    className="package-header"
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3, #00BFA5)',
                      color: 'white',
                      py: 3,
                      px: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 100,
                        height: 100,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(30px, -30px)',
                      }
                    }}
                  >
                    <Typography
                      fontWeight={800}
                      fontSize={22}
                      sx={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1
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
                    p: 4 
                  }}>
                    <Typography 
                      color="text.secondary" 
                      mb={3} 
                      fontSize={16} 
                      sx={{ 
                        fontWeight: 400, 
                        lineHeight: 1.6,
                        textAlign: 'center',
                        minHeight: 48 
                      }}
                    >
                      {pkg.description}
                    </Typography>
                    
                    {/* Price Display - Thay đổi gradient màu giá */}
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 2,
                      mb: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(0,191,165,0.08))',
                      border: '1px solid rgba(33,150,243,0.15)'
                    }}>
                      <Typography 
                        variant="h4"
                        fontWeight={900} 
                        sx={{
                          color: 'transparent',
                          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {pkg.price?.toLocaleString('vi-VN')} đ
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Bao gồm tư vấn miễn phí
                      </Typography>
                    </Box>
                    
                    {/* --- Nút đăng ký và xem chi tiết --- */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Button
                        className="package-button"
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3, #00BFA5)',
                          color: '#fff',
                          fontWeight: 700,
                          borderRadius: 50,
                          px: 4,
                          py: 1.5,
                          minWidth: 120,
                          fontSize: '1rem',
                          boxShadow: '0 4px 16px rgba(33, 150, 243, 0.25)',
                          textTransform: 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #00BFA5, #2196F3)',
                            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.35)',
                          },
                        }}
                        onClick={() => handleTestRegistration(pkg)}
                      >
                        Đăng ký ngay
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: 50,
                          fontWeight: 700,
                          px: 3,
                          py: 1.5,
                          minWidth: 100,
                          fontSize: '1rem',
                          borderColor: '#2196F3',
                          borderWidth: 2,
                          color: '#2196F3',
                          textTransform: 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#00BFA5',
                            color: '#00BFA5',
                            background: 'rgba(33, 150, 243, 0.08)',
                            borderWidth: 2,
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
        {/* Dialog chi tiết gói - sử dụng ServiceDetailDialog component */}
        <ServiceDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setDetailData(null);
            setLoadingDetail(false);
          }}
          detailData={detailData}
          detailType="package"
          loadingDetail={loadingDetail}
          onOpenDetail={handleOpenServiceDetail}
          onSelectService={null}
        />

        {/* Dialog chi tiết xét nghiệm - sử dụng ServiceDetailDialog component */}
        <ServiceDetailDialog
          open={serviceDetailOpen}
          onClose={() => {
            setServiceDetailOpen(false);
            setCurrentServiceDetail(null);
            setLoadingDetail(false);
          }}
          detailData={currentServiceDetail}
          detailType="single"
          loadingDetail={loadingDetail}
          onOpenDetail={handleOpenServiceDetail}
          onSelectService={null}
        />
      </Container>
    </Box>
  );
}
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
  TextField,
  InputAdornment,
} from '@mui/material';
// Icon từ MUI
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
// React Router
import { useNavigate } from 'react-router-dom';
// API và utilities
import localStorageUtil from '@/utils/localStorage';
import confirmDialog from '@/utils/confirmDialog';
import { userService } from '@/services/userService';
// Hàm gọi API lấy danh sách gói xét nghiệm
import { getAllSTIPackages, getActiveSTIServices } from '@/services/stiService';
// Import component dialog chi tiết dịch vụ
import ServiceDetailDialog from '@/components/TestRegistration/ServiceDetailDialog';

// ===== COMPONENT TRANG CHI TIẾT XÉT NGHIỆM STI =====
// Trang này hiển thị thông tin chi tiết về dịch vụ xét nghiệm STI và danh sách các gói xét nghiệm
export default function StiDetailPage() {
  const navigate = useNavigate(); // Hook điều hướng để chuyển trang

  // ===== CÁC STATE QUẢN LÝ DỮ LIỆU VÀ TRẠNG THÁI =====
  const [packages, setPackages] = useState([]); // Danh sách gói xét nghiệm STI
  const [singleTests, setSingleTests] = useState([]); // Danh sách xét nghiệm lẻ STI
  const [loaded, setLoaded] = React.useState(false); // State hiệu ứng xuất hiện mượt mà
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // Điều khiển dialog chi tiết gói
  const [detailData, setDetailData] = useState(null); // Dữ liệu chi tiết gói đang xem
  const [loadingDetail, setLoadingDetail] = useState(false); // Trạng thái loading khi tải chi tiết

  // State cho dialog chi tiết xét nghiệm đơn lẻ
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false); // Điều khiển dialog chi tiết xét nghiệm
  const [currentServiceDetail, setCurrentServiceDetail] = useState(null); // Dữ liệu xét nghiệm đang xem chi tiết

  // State cho tab navigation
  const [activeTab, setActiveTab] = useState('package'); // 'single' hoặc 'package'

  // State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState(''); 

  // ===== EFFECT CHẠY KHI COMPONENT ĐƯỢC MOUNT =====
  useEffect(() => {
    // ===== HÀM LẤY DANH SÁCH GÓI XÉT NGHIỆM VÀ XÉT NGHIỆM LẺ TỪ API =====
    const fetchData = async () => {
      try {
        const [packagesRes, servicesRes] = await Promise.all([
          getAllSTIPackages(),
          getActiveSTIServices(),
        ]);

        // Nếu API gói xét nghiệm trả về thành công, cập nhật state packages
        if (packagesRes.success) setPackages(packagesRes.data);

        // Nếu API xét nghiệm lẻ trả về thành công, cập nhật state singleTests
        if (servicesRes.success) setSingleTests(servicesRes.data);
      } catch {
        // Nếu có lỗi, đặt về mảng rỗng để tránh crash
        setPackages([]);
        setSingleTests([]);
      }
    };

    // Gọi hàm fetch data
    fetchData();

    // ===== THIẾT LẬP HIỆU ỨNG XUẤT HIỆN MƯỢT MÀ =====
    // Sau 100ms mới cho phép các animation fade/zoom chạy
    const timer = setTimeout(() => setLoaded(true), 100);

    // Cleanup function: xóa timer khi component unmount để tránh memory leak
    return () => clearTimeout(timer);
  }, []); // Dependencies rỗng => chỉ chạy 1 lần khi mount

  // ===== PHÂN TRANG XÉT NGHIỆM LẺ =====
  // Lọc xét nghiệm lẻ theo từ khóa tìm kiếm
  const filteredSingleTests = singleTests.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Phân trang cho xét nghiệm lẻ
  const [singlePage, setSinglePage] = useState(1);
  const singlePerPage = 6;
  const singleTotalPages = Math.ceil(
    filteredSingleTests.length / singlePerPage
  );
  const paginatedSingleTests = filteredSingleTests.slice(
    (singlePage - 1) * singlePerPage,
    singlePage * singlePerPage
  );

  // ===== PHÂN TRANG GÓI XÉT NGHIỆM =====
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [packagePage, setPackagePage] = useState(1);
  const packagePerPage = 6;
  const packageTotalPages = Math.ceil(filteredPackages.length / packagePerPage);
  const paginatedPackages = filteredPackages.slice(
    (packagePage - 1) * packagePerPage,
    packagePage * packagePerPage
  );

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
          foundService = pkg.services.find(
            (service) => service.id === serviceOrId
          );
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
  const handleTestRegistration = async (selectedItem = null) => {
    // Kiểm tra đăng nhập trước
    const userProfile = localStorageUtil.get('userProfile');
    if (!userProfile) {
      const result = await confirmDialog.info(
        'Bạn cần đăng nhập để đăng ký xét nghiệm. Bạn có muốn chuyển đến trang đăng nhập không?',
        {
          confirmText: 'Đăng nhập',
          cancelText: 'Hủy',
          title: 'Yêu cầu đăng nhập',
        }
      );
      if (result) {
        navigate('/login');
      }
      return;
    }
    try {
      // ===== KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP =====
      // Gọi API để check authentication status thông qua userService
      const userData = await userService.getCurrentUser(true); // true = skipAutoRedirect
      
      // ===== NẾU ĐÃ ĐĂNG NHẬP - CHUYỂN ĐẾN TRANG ĐĂNG KÝ =====
      if (userData) {
        if (selectedItem) {
          // Kiểm tra xem selectedItem là gói hay xét nghiệm lẻ
          // Gói xét nghiệm có thuộc tính 'services', xét nghiệm lẻ có 'components'
          const isPackage =
            selectedItem.services && Array.isArray(selectedItem.services);
          const isTest =
            selectedItem.components && Array.isArray(selectedItem.components);

          if (isPackage) {
            // Chuyển với dữ liệu gói đã chọn và bỏ qua bước chọn dịch vụ
            navigate('/test-registration', {
              state: {
                selectedPackage: selectedItem,
                activeStep: 1, // Chuyển thẳng đến bước chọn ngày giờ
                initialStep: 1,
                skipServiceSelection: true,
              },
            });
          } else if (isTest) {
            // Chuyển với dữ liệu xét nghiệm lẻ đã chọn
            navigate('/test-registration', {
              state: {
                selectedTest: selectedItem,
                activeStep: 1, // Chuyển thẳng đến bước chọn ngày giờ
                initialStep: 1,
                skipServiceSelection: true,
              },
            });
          } else {
            // Fallback: chuyển đến trang đăng ký bình thường
            navigate('/test-registration');
          }
        } else {
          // Chuyển không có dịch vụ nào được chọn trước
          navigate('/test-registration');
        }
      }
    } catch (error) {
      // Nếu lỗi 401/403 => chưa đăng nhập
      if (error.response?.status === 401 || error.response?.status === 403) {
        const redirectData = { path: '/test-registration' };
        if (selectedItem) {
          // Kiểm tra loại item để lưu đúng state
          const isPackage =
            selectedItem.services && Array.isArray(selectedItem.services);
          if (isPackage) {
            redirectData.state = { selectedPackage: selectedItem };
          } else {
            redirectData.state = { selectedTest: selectedItem };
          }
        }
        localStorageUtil.set('redirectAfterLogin', redirectData);
        navigate('/login');
      } else {
        // Lỗi khác => vẫn cho phép truy cập
        if (selectedItem) {
          const isPackage =
            selectedItem.services && Array.isArray(selectedItem.services);
          if (isPackage) {
            navigate('/test-registration', {
              state: { selectedPackage: selectedItem },
            });
          } else {
            navigate('/test-registration', {
              state: { selectedTest: selectedItem },
            });
          }
        } else {
          navigate('/test-registration');
        }
      }
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* --- Nền trang với các hình tròn trang trí --- */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(33,150,243,0.08) 0%, rgba(255,255,255,0) 70%)',
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
          background:
            'radial-gradient(circle, rgba(0,191,165,0.08) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}
      >
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
                boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
              },
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
                background:
                  'linear-gradient(45deg, rgba(33,150,243,0.1), rgba(0,191,165,0.1))',
                color: '#2196F3',
                border: '1px solid rgba(33,150,243,0.2)',
                '&:hover': {
                  background:
                    'linear-gradient(45deg, rgba(33,150,243,0.15), rgba(0,191,165,0.15))',
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
                background:
                  'linear-gradient(135deg, #2196F3 0%, #00BFA5 50%, #2196F3 100%)',
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
                background:
                  'linear-gradient(90deg, #2196F3 0%, #00BFA5 50%, #2196F3 100%)',
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
              Dịch vụ xét nghiệm toàn diện và bảo mật các bệnh lây truyền qua
              đường tình dục với kết quả nhanh chóng, chính xác và hỗ trợ chuyên
              nghiệp từ đội ngũ y bác sĩ giàu kinh nghiệm.
            </Typography>
          </Box>
        </Fade>
        {/* --- Phần mô tả dịch vụ --- */}
        <Fade in={loaded} timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
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
                background:
                  'radial-gradient(circle, rgba(33,150,243,0.05) 0%, rgba(255,255,255,0) 70%)',
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
                background:
                  'radial-gradient(circle, rgba(0,191,165,0.05) 0%, rgba(255,255,255,0) 70%)',
                bottom: -150,
                left: -150,
                zIndex: 0,
              },
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
                      mb: 1,
                    }}
                  >
                    Về dịch vụ của chúng tôi
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Chuyên nghiệp • Bảo mật • Chính xác
                  </Typography>
                </Box>
              </Box>

              <Typography
                mb={4}
                color="text.secondary"
                sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}
              >
                Dịch vụ xét nghiệm STI cung cấp các gói xét nghiệm tổng quát và
                xét nghiệm lẻ cho các bệnh như
                <strong>
                  {' '}
                  HIV, chlamydia, lậu, giang mai, herpes, viêm gan B, viêm gan C
                </strong>
                ... Kết quả hoàn toàn bảo mật, tư vấn chuyên sâu và hỗ trợ điều
                trị nếu cần thiết.
              </Typography>

              <Grid container spacing={4}>
                {/* Quy trình xét nghiệm */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 4,
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(33,150,243,0.05) 100%)',
                      borderRadius: 4,
                      border: '1px solid rgba(33,150,243,0.15)',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      mb={3}
                      sx={{
                        color: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.3rem',
                      }}
                    >
                      🔬 Quy trình xét nghiệm
                    </Typography>
                    <List
                      sx={{
                        '& .MuiListItem-root': { py: 1, px: 0 },
                        '& .MuiListItemText-primary': {
                          lineHeight: 1.6,
                          fontSize: '1rem',
                        },
                      }}
                    >
                      {[
                        'Tư vấn ban đầu với chuyên gia y tế',
                        'Lấy mẫu: máu, nước tiểu hoặc dịch',
                        'Phân tích tại phòng lab đạt chuẩn',
                        'Trả kết quả nhanh (2-5 ngày)',
                        'Tư vấn kết quả và hỗ trợ điều trị',
                      ].map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background:
                                  'linear-gradient(45deg, #2196F3, #00BFA5)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                              }}
                            >
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
                  <Box
                    sx={{
                      p: 4,
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(0,191,165,0.05) 100%)',
                      borderRadius: 4,
                      border: '1px solid rgba(0,191,165,0.15)',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      mb={3}
                      sx={{
                        color: '#00BFA5',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.3rem',
                      }}
                    >
                      ⭐ Tại sao chọn chúng tôi?
                    </Typography>
                    <List
                      sx={{
                        '& .MuiListItem-root': { py: 1, px: 0 },
                        '& .MuiListItemText-primary': {
                          lineHeight: 1.6,
                          fontSize: '1rem',
                        },
                      }}
                    >
                      {[
                        'Bảo mật tuyệt đối thông tin khách hàng',
                        'Trang thiết bị hiện đại, kết quả chính xác',
                        'Đội ngũ chuyên gia tận tâm, giàu kinh nghiệm',
                        'Đặt lịch linh hoạt, hỗ trợ 24/7',
                        'Hỗ trợ điều trị và kê đơn nếu cần',
                      ].map((reason, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon
                              sx={{
                                color: '#00BFA5',
                                fontSize: 24,
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={reason} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>

                {/* Khi nào nên xét nghiệm */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 4,
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(33,150,243,0.05) 100%)',
                      borderRadius: 4,
                      border: '1px solid rgba(33,150,243,0.15)',
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      mb={3}
                      sx={{
                        color: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.3rem',
                      }}
                    >
                      🩺 Khi nào nên xét nghiệm STI?
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        {
                          icon: '👥',
                          text: 'Khi có bạn tình mới hoặc nhiều bạn tình',
                        },
                        {
                          icon: '⚠️',
                          text: 'Khi có triệu chứng nghi ngờ mắc bệnh STI',
                        },
                        { icon: '🔒', text: 'Sau khi quan hệ không an toàn' },
                        {
                          icon: '📅',
                          text: 'Định kỳ kiểm tra sức khỏe tình dục',
                        },
                      ].map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 3,
                              background: 'rgba(255,255,255,0.7)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateX(10px)',
                                boxShadow: '0 4px 16px rgba(33,150,243,0.15)',
                              },
                            }}
                          >
                            <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>
                              {item.icon}
                            </Typography>
                            <Typography
                              sx={{ fontSize: '1rem', fontWeight: 500 }}
                            >
                              {item.text}
                            </Typography>
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
                background:
                  'linear-gradient(45deg, rgba(33,150,243,0.1), rgba(0,191,165,0.1))',
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
                fontSize: { xs: '2.2rem', md: '2.8rem' },
              }}
            >
              Dịch vụ xét nghiệm STI
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
                mb: 6,
              }}
            >
              Chọn dịch vụ xét nghiệm phù hợp với nhu cầu của bạn. Tất cả đều
              bao gồm tư vấn miễn phí.
            </Typography>

            {/* Thanh tìm kiếm */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              <TextField
                fullWidth
                placeholder="Tìm kiếm xét nghiệm hoặc gói..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(33,150,243,0.2)',
                      borderWidth: 1.5,
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(33,150,243,0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: 1.5,
                    fontSize: '1rem',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Tab Navigation - Thiết kế theo screenshot */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 12,
                  p: 0.3,
                  border: '1px solid rgba(224,224,224,0.5)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <Button
                  onClick={() => setActiveTab('single')}
                  sx={{
                    borderRadius: 10,
                    px: 3,
                    py: 1.2,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    background:
                      activeTab === 'single'
                        ? 'rgba(224,224,224,0.3)'
                        : 'transparent',
                    color: activeTab === 'single' ? '#333' : '#666',
                    minWidth: 140,
                    '&:hover': {
                      background:
                        activeTab === 'single'
                          ? 'rgba(224,224,224,0.4)'
                          : 'rgba(224,224,224,0.15)',
                    },
                  }}
                >
                  🔬 Xét nghiệm lẻ
                </Button>
                <Button
                  onClick={() => setActiveTab('package')}
                  sx={{
                    borderRadius: 10,
                    px: 3,
                    py: 1.2,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    background:
                      activeTab === 'package'
                        ? 'linear-gradient(135deg, #4FC3F7, #29B6F6)'
                        : 'transparent',
                    color: activeTab === 'package' ? '#fff' : '#666',
                    minWidth: 140,
                    boxShadow:
                      activeTab === 'package'
                        ? '0 2px 8px rgba(79,195,247,0.3)'
                        : 'none',
                    '&:hover': {
                      background:
                        activeTab === 'package'
                          ? 'linear-gradient(135deg, #29B6F6, #4FC3F7)'
                          : 'rgba(79,195,247,0.08)',
                    },
                  }}
                >
                  📦 Gói xét nghiệm
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* --- Conditional rendering based on active tab --- */}
        {activeTab === 'single' && (
          /* --- Grid danh sách xét nghiệm lẻ --- */
          <>
            <Grid
              container
              spacing={4}
              sx={{ width: '100%', mb: 4 }}
              justifyContent="center"
            >
              {paginatedSingleTests.length > 0 ? (
                paginatedSingleTests.map((service, idx) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={service.id}
                    display="flex"
                    justifyContent="center"
                  >
                    <Zoom
                      in={loaded}
                      style={{ transitionDelay: `${idx * 150 + 600}ms` }}
                    >
                      {/* --- Card xét nghiệm lẻ  --- */}
                      <Card
                        sx={{
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
                          background:
                            'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
                          border: '1px solid rgba(33,150,243,0.2)',
                          backdropFilter: 'blur(20px)',
                          '&:hover': {
                            transform: 'translateY(-15px) scale(1.02)',
                            boxShadow: '0 25px 60px rgba(33,150,243,0.2)',
                            '& .service-header': {
                              background:
                                'linear-gradient(135deg, #2196F3, #00BFA5)',
                            },
                            '& .service-button': {
                              background:
                                'linear-gradient(45deg, #00BFA5, #2196F3)',
                              transform: 'translateY(-2px)',
                            },
                          },
                        }}
                      >
                        {/* Header với gradient xanh dương */}
                        <Box
                          className="service-header"
                          sx={{
                            background:
                              'linear-gradient(135deg, #2196F3, #00BFA5)',
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
                              background:
                                'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)',
                              borderRadius: '50%',
                              transform: 'translate(30px, -30px)',
                            },
                          }}
                        >
                          <Typography
                            fontWeight={800}
                            fontSize={22}
                            sx={{
                              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              textAlign: 'center',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          >
                            {service.name}
                          </Typography>
                        </Box>

                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            p: 4,
                          }}
                        >
                          <Typography
                            color="text.secondary"
                            mb={3}
                            fontSize={16}
                            sx={{
                              fontWeight: 400,
                              lineHeight: 1.6,
                              textAlign: 'center',
                              minHeight: 72, 
                              display: '-webkit-box',
                              WebkitLineClamp: 3, 
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {service.description}
                          </Typography>

                          {/* Price Display */}
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              mb: 3,
                              borderRadius: 3,
                              background:
                                'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(0,191,165,0.08))',
                              border: '1px solid rgba(33,150,243,0.15)',
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={900}
                              sx={{
                                color: 'transparent',
                                background:
                                  'linear-gradient(45deg, #2196F3, #00BFA5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {service.price?.toLocaleString('vi-VN')} đ
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                            >
                              Bao gồm tư vấn miễn phí
                            </Typography>
                          </Box>

                          {/* --- Nút đăng ký và xem chi tiết - Giống hệt gói xét nghiệm --- */}
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              justifyContent: 'center',
                              alignItems: 'center',
                              mt: 2,
                            }}
                          >
                            <Button
                              className="service-button"
                              variant="contained"
                              sx={{
                                background:
                                  'linear-gradient(45deg, #2196F3, #00BFA5)',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 50,
                                px: 4,
                                py: 1.5,
                                minWidth: 120,
                                fontSize: '1rem',
                                boxShadow:
                                  '0 4px 16px rgba(33, 150, 243, 0.25)',
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background:
                                    'linear-gradient(45deg, #00BFA5, #2196F3)',
                                  boxShadow:
                                    '0 8px 24px rgba(33, 150, 243, 0.35)',
                                },
                              }}
                              onClick={() => handleTestRegistration(service)}
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
                              onClick={() => handleOpenServiceDetail(service)}
                            >
                              Chi tiết
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))
              ) : (
                // Hiển thị khi không có kết quả tìm kiếm
                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      background: 'rgba(255,255,255,0.7)',
                      borderRadius: 3,
                      border: '1px solid rgba(224,224,224,0.3)',
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      Không tìm thấy xét nghiệm nào
                    </Typography>
                    <Typography color="text.secondary">
                      Thử tìm kiếm với từ khóa khác
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            {/* Pagination for single tests */}
            {singleTotalPages > 1 && (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 6 }}
              >
                {Array.from({ length: singleTotalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={singlePage === i + 1 ? 'contained' : 'outlined'}
                    color="primary"
                    sx={{
                      minWidth: 40,
                      mx: 0.5,
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: singlePage === i + 1 ? 2 : 0,
                    }}
                    onClick={() => setSinglePage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
            )}
          </>
        )}

        {activeTab === 'package' && (
          /* --- Grid danh sách gói xét nghiệm --- */
          <>
            <Grid
              container
              spacing={4}
              sx={{ width: '100%', mb: 4 }}
              justifyContent="center"
            >
              {paginatedPackages.length > 0 ? (
                paginatedPackages.map((pkg, idx) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={pkg.id}
                    display="flex"
                    justifyContent="center"
                  >
                    <Zoom
                      in={loaded}
                      style={{ transitionDelay: `${idx * 150 + 600}ms` }}
                    >
                      {/* --- Card gói xét nghiệm --- */}
                      <Card
                        sx={{
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
                          background:
                            'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
                          border: '1px solid rgba(33,150,243,0.2)',
                          backdropFilter: 'blur(20px)',
                          '&:hover': {
                            transform: 'translateY(-15px) scale(1.02)',
                            boxShadow: '0 25px 60px rgba(33,150,243,0.2)',
                            '& .package-header': {
                              background:
                                'linear-gradient(135deg, #2196F3, #00BFA5)',
                            },
                            '& .package-button': {
                              background:
                                'linear-gradient(45deg, #00BFA5, #2196F3)',
                              transform: 'translateY(-2px)',
                            },
                          },
                        }}
                      >
                        {/* Header với gradient */}
                        <Box
                          className="package-header"
                          sx={{
                            background:
                              'linear-gradient(135deg, #2196F3, #00BFA5)',
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
                              background:
                                'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)',
                              borderRadius: '50%',
                              transform: 'translate(30px, -30px)',
                            },
                          }}
                        >
                          <Typography
                            fontWeight={800}
                            fontSize={22}
                            sx={{
                              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              textAlign: 'center',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          >
                            {pkg.name}
                          </Typography>
                        </Box>

                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            p: 4,
                          }}
                        >
                          {' '}
                          <Typography
                            color="text.secondary"
                            mb={3}
                            fontSize={16}
                            sx={{
                              fontWeight: 400,
                              lineHeight: 1.6,
                              textAlign: 'center',
                              minHeight: 72, // Đồng đều với xét nghiệm lẻ
                              display: '-webkit-box',
                              WebkitLineClamp: 3, // Giới hạn 3 dòng
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {pkg.description}
                          </Typography>
                          {/* Price Display - Thay đổi gradient màu giá */}
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              mb: 3,
                              borderRadius: 3,
                              background:
                                'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(0,191,165,0.08))',
                              border: '1px solid rgba(33,150,243,0.15)',
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={900}
                              sx={{
                                color: 'transparent',
                                background:
                                  'linear-gradient(45deg, #2196F3, #00BFA5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {pkg.price?.toLocaleString('vi-VN')} đ
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                            >
                              Bao gồm tư vấn miễn phí
                            </Typography>
                          </Box>
                          {/* --- Nút đăng ký và xem chi tiết --- */}
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              justifyContent: 'center',
                              alignItems: 'center',
                              mt: 2,
                            }}
                          >
                            <Button
                              className="package-button"
                              variant="contained"
                              sx={{
                                background:
                                  'linear-gradient(45deg, #2196F3, #00BFA5)',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 50,
                                px: 4,
                                py: 1.5,
                                minWidth: 120,
                                fontSize: '1rem',
                                boxShadow:
                                  '0 4px 16px rgba(33, 150, 243, 0.25)',
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background:
                                    'linear-gradient(45deg, #00BFA5, #2196F3)',
                                  boxShadow:
                                    '0 8px 24px rgba(33, 150, 243, 0.35)',
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
                ))
              ) : (
                // Hiển thị khi không có kết quả tìm kiếm
                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      background: 'rgba(255,255,255,0.7)',
                      borderRadius: 3,
                      border: '1px solid rgba(224,224,224,0.3)',
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      Không tìm thấy gói xét nghiệm nào
                    </Typography>
                    <Typography color="text.secondary">
                      Thử tìm kiếm với từ khóa khác
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            {/* Pagination for packages */}
            {packageTotalPages > 1 && (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 6 }}
              >
                {Array.from({ length: packageTotalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={packagePage === i + 1 ? 'contained' : 'outlined'}
                    color="primary"
                    sx={{
                      minWidth: 40,
                      mx: 0.5,
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: packagePage === i + 1 ? 2 : 0,
                    }}
                    onClick={() => setPackagePage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
            )}
          </>
        )}

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

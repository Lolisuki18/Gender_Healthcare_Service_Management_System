// Thư viện React và các hook cơ bản
import React, { useState, useEffect } from 'react';
// Import các component UI từ Material-UI (MUI)
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Container
} from '@mui/material';
// Icon từ MUI
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
// Import các hàm gọi API liên quan đến xét nghiệm từ service
import { getAllSTIPackages, getSTIPackageById, getSTIServiceById, bookSTITest, getActiveSTIServices } from '@/services/stiService';
// Import các component hỗ trợ chọn ngày giờ
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
// React Router
import { useLocation, useNavigate } from 'react-router-dom';
// Styled-components của MUI
import { styled } from '@mui/material/styles';
// Các bước của quy trình đặt lịch
const steps = [
  'Chọn loại dịch vụ',
  'Chọn ngày & giờ',
  'Ghi chú',
  'Thanh toán',
];

// Tạo Button hiện đại
const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  padding: '10px 24px',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
  boxShadow: '0 2px 8px rgba(74,144,226,0.08)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(74,144,226,0.15)',
  },
}));

export default function TestRegistrationPage() {
  // --- State quản lý các bước, dữ liệu chọn dịch vụ, ngày giờ, ...
  const [activeStep, setActiveStep] = useState(0);// Bước hiện tại
  const [selectedService, setSelectedService] = useState(null);// Dịch vụ/gói được chọn
  const [selectedDate, setSelectedDate] = useState(null); // Ngày chọn
  const [selectedTime, setSelectedTime] = useState('');// Giờ chọn
  const [singleTests, setSingleTests] = useState([]);// Danh sách xét nghiệm lẻ
  const [packages, setPackages] = useState([]);// Danh sách gói xét nghiệm
  const [loading, setLoading] = useState(true);// Trạng thái loading dữ liệu
  const [error, setError] = useState(null); // Lỗi khi load dữ liệu
  const [activeTab, setActiveTab] = useState('single'); // Tab hiện tại: lẻ/gói
  const [pageSingle, setPageSingle] = useState(1); // Trang phân trang xét nghiệm lẻ
  const [pagePackage, setPagePackage] = useState(1); // Trang phân trang gói
  const ITEMS_PER_PAGE = 5; // Số item mỗi trang
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // Dialog chi tiết dịch vụ/gói
  const [detailData, setDetailData] = useState(null); // Dữ liệu chi tiết dịch vụ/gói
  const [note, setNote] = useState(''); // Ghi chú của khách
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Phương thức thanh toán
  const [visaInfo, setVisaInfo] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' }); // Thông tin thẻ visa
  const [visaErrors, setVisaErrors] = useState({}); // Lỗi nhập thẻ visa
  const [bookingSuccess, setBookingSuccess] = useState(false); // Đặt lịch thành công
  const [bookingMessage, setBookingMessage] = useState(''); // Message trả về từ backend khi đặt lịch thành công
  const location = useLocation(); // Lấy state truyền qua router
  const navigate = useNavigate(); // Điều hướng
  const [subDetailOpen, setSubDetailOpen] = useState(false);
  const [subDetailData, setSubDetailData] = useState(null);
  const [subDetailLoading, setSubDetailLoading] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState(false); // Popup xác nhận chuyển khoản
  const [pendingBankBooking, setPendingBankBooking] = useState(false); // Đang xử lý đặt lịch bank
  const [openVisaDialog, setOpenVisaDialog] = useState(false); // Popup nhập thông tin Visa
  const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm
  const [filteredSingleTests, setFilteredSingleTests] = useState([]); // Danh sách xét nghiệm lẻ đã lọc
  const [filteredPackages, setFilteredPackages] = useState([]); // Danh sách gói đã lọc
  // Các khung giờ có sẵn
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00'
  ];

  // --- useEffect lấy dữ liệu xét nghiệm lẻ và gói khi load trang ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesResponse, packagesResponse] = await Promise.all([
          getActiveSTIServices(),
          getAllSTIPackages()
        ]);
        if (servicesResponse.success) {
          setSingleTests(servicesResponse.data);
          setFilteredSingleTests(servicesResponse.data);
        }
        if (packagesResponse.success) {
          setPackages(packagesResponse.data);
          setFilteredPackages(packagesResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- useEffect xử lý tìm kiếm ---
  useEffect(() => {
    const filterData = () => {
      if (!searchQuery.trim()) {
        setFilteredSingleTests(singleTests);
        setFilteredPackages(packages);
        return;
      }

      const query = searchQuery.toLowerCase().trim();
      
      // Lọc xét nghiệm lẻ
      const filteredSingle = singleTests.filter(test => 
        test.name?.toLowerCase().includes(query) ||
        test.description?.toLowerCase().includes(query) ||
        test.label?.toLowerCase().includes(query)
      );
      setFilteredSingleTests(filteredSingle);

      // Lọc gói xét nghiệm
      const filteredPackage = packages.filter(pkg => 
        pkg.name?.toLowerCase().includes(query) ||
        pkg.description?.toLowerCase().includes(query) ||
        pkg.label?.toLowerCase().includes(query)
      );
      setFilteredPackages(filteredPackage);
    };

    filterData();
  }, [searchQuery, singleTests, packages]);

  // --- useEffect tự động chọn gói nếu được truyền từ state (khi chuyển từ trang khác sang) ---
  useEffect(() => {
    if (location.state && location.state.selectedPackage && packages.length > 0) {
      const idx = packages.findIndex(pkg => pkg.id === location.state.selectedPackage.id);
      if (idx !== -1) {
        setActiveTab('package');
        setSelectedService({ type: 'package', idx });
        // Nếu gói nằm ở trang khác, chuyển trang cho đúng
        const page = Math.floor(idx / ITEMS_PER_PAGE) + 1;
        setPagePackage(page);
      }
    }
  }, [location.state, packages]);

  // --- Hàm chọn dịch vụ/gói ---
  const handleSelectService = (type, idx) => {
    setSelectedService({ type, idx });
  };

  // --- Phân trang ---
  const paginatedSingleTests = filteredSingleTests.slice((pageSingle - 1) * ITEMS_PER_PAGE, pageSingle * ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice((pagePackage - 1) * ITEMS_PER_PAGE, pagePackage * ITEMS_PER_PAGE);
  const totalSinglePages = Math.ceil(filteredSingleTests.length / ITEMS_PER_PAGE);
  const totalPackagePages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);

  // --- Hàm đóng tất cả dialog ---
  const closeAllDialogs = () => {
    setDetailDialogOpen(false);
    setSubDetailOpen(false);
    setDetailData(null);
    setSubDetailData(null);
  };

  // --- Hàm mở dialog chi tiết dịch vụ từ trong gói ---
  const handleOpenServiceDetailFromPackage = async (serviceId) => {
    setSubDetailLoading(true);
    setSubDetailOpen(true);
    try {
      const res = await getSTIServiceById(serviceId);
      if (res.success) {
        setSubDetailData(res.data);
      } else {
        setSubDetailData({ error: res.message || 'Không thể tải chi tiết xét nghiệm' });
      }
    } catch (err) {
      setSubDetailData({ error: 'Có lỗi xảy ra khi tải chi tiết xét nghiệm' });
    } finally {
      setSubDetailLoading(false);
    }
  };

  // --- Hàm mở dialog chi tiết dịch vụ đơn lẻ ---
  const handleOpenDetail = async (id, type = 'single') => {
    if (type === 'single') {
      // Đóng tất cả dialog trước khi mở dialog mới
      closeAllDialogs();
      const data = singleTests.find(item => item.id === id);
      setDetailData(data);
      setDetailDialogOpen(true);
    } else if (type === 'package') {
      // Đóng tất cả dialog trước khi mở dialog mới
      closeAllDialogs();
      const data = packages.find(item => item.id === id);
      setDetailData(data);
      setDetailDialogOpen(true);
    }
  };

  // --- Hàm mở dialog chi tiết gói (gọi API lấy chi tiết gói) ---
  const handleOpenPackageDetail = async (packageId) => {
    // Đóng tất cả dialog trước khi mở dialog mới
    closeAllDialogs();
    try {
      const res = await getSTIPackageById(packageId);
      setDetailData(res.data);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết gói:', error);
    }
  };

  // --- Hàm đặt lịch xét nghiệm (gọi API bookSTITest) ---
  const handleBookTest = async () => {
    let serviceId = null, packageId = null;
    if (!selectedService || selectedService.idx == null) {
      alert('Vui lòng chọn dịch vụ hoặc gói xét nghiệm!');
      return;
    }
    if (selectedService.type === 'single') {
      serviceId = singleTests[selectedService.idx]?.id;
      if (!serviceId) {
        alert('Không tìm thấy dịch vụ xét nghiệm đã chọn!');
        return;
      }
    } else if (selectedService.type === 'package') {
      packageId = packages[selectedService.idx]?.id;
      if (!packageId) {
        alert('Không tìm thấy gói xét nghiệm đã chọn!');
        return;
      }
    }
    const appointmentDate = selectedDate
      ? `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`
      : null;
    let paymentMethodApi = 'COD';
    if (paymentMethod === 'bank') paymentMethodApi = 'BANK_TRANSFER';
    if (paymentMethod === 'visa') paymentMethodApi = 'VISA';
    ///truyền về 
    const payload = {
      appointmentDate,
      paymentMethod: paymentMethodApi,
      customerNotes: note,
    };
    if (serviceId) payload.serviceId = serviceId;
    if (packageId) payload.packageId = packageId;
    console.log('Payload gửi đăng ký:', payload);
    try {
      const res = await bookSTITest(payload);
      // Kiểm tra thành công nếu có success true hoặc có testId (hoặc data.testId)
      if (res.data.success === true || res.data.testId || (res.data.data && res.data.data.testId)) {
        setBookingSuccess(true);
        setBookingMessage(res.data.message || 'Đặt lịch thành công!');
      } else {
        alert((res.data.message || 'Đăng ký thất bại') + '\n' + JSON.stringify(res.data));
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi đăng ký: ' + (err?.response?.data?.message || err.message));
    }
  };

  // Lấy giá dịch vụ/gói đã chọn (an toàn)
  const selectedPrice = (selectedService && selectedService.idx != null)
    ? (selectedService.type === 'single'
        ? singleTests[selectedService.idx]?.price
        : packages[selectedService.idx]?.price)
    : 0;

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
      {/* --- Nền trang với các hình tròn trang trí --- */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,144,226,0.10) 0%, rgba(255,255,255,0) 70%)',
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
          background: 'radial-gradient(circle, rgba(26,188,156,0.10) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        {/* --- Tiêu đề trang và mô tả --- */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
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
            Đặt lịch xét nghiệm
          </Typography>
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
            Lên lịch tư vấn với các chuyên gia chăm sóc sức khỏe của chúng tôi
          </Typography>
        </Box>
        <Box sx={{ background: '#fff', borderRadius: 5, p: { xs: 2, md: 4 }, boxShadow: '0 8px 32px rgba(74,144,226,0.10)', mb: 4, fontFamily: 'inherit' }}>
           {/* --- Thanh stepper các bước --- */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              mb: 6,
              mt: 2,
              p: 4,
              background: 'linear-gradient(135deg, rgba(74,144,226,0.05) 0%, rgba(26,188,156,0.05) 100%)',
              borderRadius: 24,
              border: '1px solid rgba(74,144,226,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(74,144,226,0.08)',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {steps.map((label, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: 'center',
                  position: 'relative',
                  minWidth: { xs: '100%', md: 160 },
                  mb: { xs: idx < steps.length - 1 ? 3 : 0, md: 0 },
                  gap: { xs: 3, md: 0 },
                  justifyContent: { xs: 'flex-start', md: 'center' },
                }}
              >
                {/* Step Circle */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: idx < activeStep
                      ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)'
                      : idx === activeStep
                      ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)'
                      : 'rgba(255,255,255,0.9)',
                    border: idx <= activeStep 
                      ? '3px solid transparent'
                      : '3px solid rgba(74,144,226,0.2)',
                    boxShadow: idx <= activeStep
                      ? '0 8px 25px rgba(74,144,226,0.25)'
                      : '0 4px 15px rgba(0,0,0,0.1)',
                    color: idx <= activeStep ? '#fff' : '#74758b',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 2,
                    flexShrink: 0,
                    mb: { xs: 0, md: 2 },
                    '&:hover': {
                      transform: 'scale(1.1) translateY(-2px)',
                      boxShadow: idx <= activeStep
                        ? '0 12px 35px rgba(74,144,226,0.35)'
                        : '0 8px 25px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {idx < activeStep ? (
                    <CheckIcon sx={{ fontSize: 18 }} />
                  ) : (
                    idx + 1
                  )}
                </Box>
                
                {/* Step Label */}
                <Typography
                  sx={{
                    fontWeight: idx <= activeStep ? 700 : 600,
                    fontSize: { xs: '1rem', md: '0.95rem' },
                    color: idx <= activeStep ? '#2d3748' : '#74758b',
                    textAlign: { xs: 'left', md: 'center' },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    lineHeight: 1.3,
                    maxWidth: { xs: 'none', md: 140 },
                    flex: { xs: 1, md: 'none' },
                  }}
                >
                  {label}
                </Typography>
                
                {/* Desktop Connector Line */}
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      top: 28,
                      right: -80,
                      width: 120,
                      height: 4,
                      borderRadius: 2,
                      background: idx < activeStep 
                        ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)'
                        : 'rgba(74,144,226,0.15)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 1,
                    }}
                  />
                )}
                
                {/* Mobile Connector Line */}
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'block', md: 'none' },
                      position: 'absolute',
                      left: 28,
                      bottom: -24,
                      width: 4,
                      height: 24,
                      borderRadius: 2,
                      background: idx < activeStep 
                        ? 'linear-gradient(180deg, #4A90E2 0%, #1ABC9C 100%)'
                        : 'rgba(74,144,226,0.15)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
           {/* --- Loading hoặc lỗi --- */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : activeStep === 0 && (
            <Box sx={{ background: '#fff', borderRadius: 5, p: { xs: 3, md: 5 }, boxShadow: '0 8px 32px rgba(74,144,226,0.10)', mb: 4, fontFamily: 'inherit' }}>
              {/* Header Section */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                  }}
                >
                  Chọn loại dịch vụ
                </Typography>
                <Typography
                  sx={{ 
                    color: '#757575', 
                    fontWeight: 400, 
                    fontSize: { xs: 16, md: 18 }, 
                    fontFamily: 'inherit',
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Chọn loại xét nghiệm phù hợp với nhu cầu của bạn. Chúng tôi cung cấp cả xét nghiệm lẻ và gói xét nghiệm tổng hợp.
                </Typography>
              </Box>

              {/* Tab Navigation */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 4, 
                justifyContent: 'center',
                bgcolor: '#f8faff',
                borderRadius: 3,
                p: 1,
                maxWidth: 400,
                mx: 'auto'
              }}>
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
                    background: activeTab === 'single' 
                      ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' 
                      : 'transparent',
                    color: activeTab === 'single' ? '#fff' : '#666',
                    boxShadow: activeTab === 'single' ? '0 8px 25px rgba(74,144,226,0.25)' : 'none',
                    transform: activeTab === 'single' ? 'translateY(-2px)' : 'none',
                    '&:hover': {
                      background: activeTab === 'single' 
                        ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' 
                        : 'rgba(74,144,226,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={() => setActiveTab('single')}
                >
                  🔬 Xét nghiệm lẻ
                </Box>
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
                  onClick={() => setActiveTab('package')}
                >
                  📦 Gói xét nghiệm
                </Box>
              </Box>

              {/* Search Bar */}
              <Box sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                <TextField
                  fullWidth
                  placeholder={`Tìm kiếm ${activeTab === 'single' ? 'xét nghiệm' : 'gói xét nghiệm'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: '#f8faff',
                      fontSize: 16,
                      '& fieldset': {
                        borderColor: 'rgba(74,144,226,0.2)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(74,144,226,0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4A90E2',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: '#4A90E2', mr: 1 }} />
                    ),
                  }}
                />
              </Box>

              {/* Danh sách dịch vụ theo tab */}
              {activeTab === 'single' && (
                <>
                  {filteredSingleTests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        🔍 Không tìm thấy xét nghiệm nào
                      </Typography>
                      <Typography color="text.secondary">
                        Hãy thử tìm kiếm với từ khóa khác
                      </Typography>
                    </Box>
                  ) : (
                    <Box mb={3} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {paginatedSingleTests.map((service, idx) => (
                        <Card
                          key={service.id}
                          sx={{
                            borderRadius: 4,
                            boxShadow: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx)
                              ? '0 8px 32px rgba(74,144,226,0.25)'
                              : '0 4px 20px rgba(0,0,0,0.08)',
                            border: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx)
                              ? '2px solid #4A90E2'
                              : '1px solid rgba(0,0,0,0.08)',
                            background: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx)
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
                              background: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx)
                                ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)'
                                : 'linear-gradient(90deg, #e0e7ff 0%, #f0f7ff 100%)',
                          }}} onClick={() => handleSelectService('single', (pageSingle - 1) * ITEMS_PER_PAGE + idx)}
                        >
                          {/* Selection Indicator */}
                          {selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx) && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 20,
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

                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ flex: 1, pr: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 3,
                                      background: 'linear-gradient(135deg, rgba(74,144,226,0.1), rgba(26,188,156,0.1))',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      mr: 2,
                                      border: '1px solid rgba(74,144,226,0.2)'
                                    }}
                                  >
                                    <Typography sx={{ fontSize: 20 }}>🔬</Typography>
                                  </Box>
                                  <Box>
                                    <Typography 
                                      variant="h6" 
                                      fontWeight={700} 
                                      sx={{ 
                                        fontSize: { xs: 18, md: 20 },
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
                                        fontSize: 13
                                      }}
                                    >
                                      Xét nghiệm lẻ
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Typography 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                    mb: 3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {service.description || 'Xét nghiệm chuyên sâu với kết quả chính xác và nhanh chóng'}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                  <Chip
                                    icon={<AccessTimeIcon />}
                                    label={service.duration || '30 phút'}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(74,144,226,0.1)',
                                      color: '#4A90E2',
                                      fontWeight: 600,
                                      '& .MuiChip-icon': { color: '#4A90E2' }
                                    }}
                                  />
                                  {service.label && (
                                    <Chip
                                      label={service.label}
                                      size="small"
                                      sx={{
                                        bgcolor: 'rgba(26,188,156,0.1)',
                                        color: '#1ABC9C',
                                        fontWeight: 600
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                                <Box
                                  sx={{
                                    bgcolor: 'rgba(74,144,226,0.1)',
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5,
                                    border: '1px solid rgba(74,144,226,0.2)'
                                  }}
                                >
                                  <Typography 
                                    fontWeight={800} 
                                    sx={{ 
                                      fontSize: { xs: 16, md: 18 },
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

                                <Button
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDetail(service.id, 'single');
                                  }}
                                  sx={{
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    fontSize: 14,
                                    borderWidth: 2,
                                    borderColor: '#4A90E2',
                                    color: '#4A90E2',
                                    minWidth: 100,
                                    '&:hover': {
                                      borderWidth: 2,
                                      bgcolor: 'rgba(74,144,226,0.1)',
                                      transform: 'translateY(-2px)',
                                    },
                                  }}
                                >
                                  Xem chi tiết
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                  
                  {/* Pagination for single tests */}
                  {totalSinglePages > 1 && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 1,
                      mt: 4,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(74,144,226,0.05)'
                    }}>
                      <Button 
                        onClick={() => setPageSingle(page => Math.max(1, page - 1))} 
                        disabled={pageSingle === 1}
                        sx={{ 
                          minWidth: 44,
                          height: 44,
                          borderRadius: 2,
                          color: '#4A90E2',
                          '&:disabled': { color: '#ccc' }
                        }}
                      >
                        <NavigateBeforeIcon />
                      </Button>
                      
                      {[...Array(totalSinglePages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={pageSingle === i + 1 ? 'contained' : 'outlined'}
                          sx={{ 
                            minWidth: 44, 
                            height: 44,
                            borderRadius: 2,
                            fontWeight: 700, 
                            fontSize: 16,
                            border: pageSingle === i + 1 ? 'none' : '2px solid rgba(74,144,226,0.2)',
                            background: pageSingle === i + 1 
                              ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' 
                              : 'transparent',
                            color: pageSingle === i + 1 ? '#fff' : '#4A90E2',
                            '&:hover': {
                              background: pageSingle === i + 1 
                                ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' 
                                : 'rgba(74,144,226,0.1)',
                              transform: 'translateY(-2px)',
                            }
                          }}
                          onClick={() => setPageSingle(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button 
                        onClick={() => setPageSingle(page => Math.min(totalSinglePages, page + 1))} 
                        disabled={pageSingle === totalSinglePages}
                        sx={{ 
                          minWidth: 44,
                          height: 44,
                          borderRadius: 2,
                          color: '#4A90E2',
                          '&:disabled': { color: '#ccc' }
                        }}
                      >
                        <NavigateNextIcon />
                      </Button>
                    </Box>
                  )}
                </>
              )}
              {activeTab === 'package' && (
                <>
                  {filteredPackages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        📦 Không tìm thấy gói xét nghiệm nào
                      </Typography>
                      <Typography color="text.secondary">
                        Hãy thử tìm kiếm với từ khóa khác
                      </Typography>
                    </Box>
                  ) : (
                    <Box mb={3} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {paginatedPackages.map((service, idx) => (
                        <Card
                          key={service.id}
                          sx={{
                            borderRadius: 4,
                            boxShadow: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx)
                              ? '0 8px 32px rgba(74,144,226,0.25)'
                              : '0 4px 20px rgba(0,0,0,0.08)',
                            border: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx)
                              ? '2px solid #4A90E2'
                              : '1px solid rgba(0,0,0,0.08)',
                            background: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx)
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
                              background: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx)
                                ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)'
                                : 'linear-gradient(90deg, #e0e7ff 0%, #f0f7ff 100%)',
                            }
                          }}
                          onClick={() => handleSelectService('package', (pagePackage - 1) * ITEMS_PER_PAGE + idx)}
                        >
                          {/* Selection Indicator */}
                          {selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx) && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 20,
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
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 15,
                              left: 15,
                              bgcolor: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                              color: 'white',
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: 12,
                              fontWeight: 700,
                              zIndex: 1,
                            }}
                          >
                            🔥 PHỔ BIẾN
                          </Box>

                          <CardContent sx={{ p: 4, pt: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ flex: 1, pr: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 3,
                                      background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(249,115,22,0.1))',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      mr: 2,
                                      border: '1px solid rgba(245,158,11,0.2)'
                                    }}
                                  >
                                    <Typography sx={{ fontSize: 20 }}>📦</Typography>
                                  </Box>
                                  <Box>
                                    <Typography 
                                      variant="h6" 
                                      fontWeight={700} 
                                      sx={{ 
                                        fontSize: { xs: 18, md: 20 },
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
                                        fontSize: 13
                                      }}
                                    >
                                      Gói xét nghiệm tổng hợp
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Typography 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                    mb: 3,
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
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Chip
                                      label={`${service.services.length} dịch vụ`}
                                      size="small"
                                      sx={{
                                        bgcolor: 'rgba(74,144,226,0.1)',
                                        color: '#4A90E2',
                                        fontWeight: 600,
                                      }}
                                    />
                                    <Chip
                                      icon={<AccessTimeIcon />}
                                      label={service.duration || '2-3 giờ'}
                                      size="small"
                                      sx={{
                                        bgcolor: 'rgba(74,144,226,0.1)',
                                        color: '#4A90E2',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': { color: '#4A90E2' }
                                      }}
                                    />
                                  </Box>
                                )}
                              </Box>

                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                                <Box
                                  sx={{
                                    bgcolor: 'rgba(74,144,226,0.1)',
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5,
                                    border: '1px solid rgba(74,144,226,0.2)'
                                  }}
                                >
                                  <Typography 
                                    fontWeight={800} 
                                    sx={{ 
                                      fontSize: { xs: 16, md: 18 },
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

                                <Button
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenPackageDetail(service.id);
                                  }}
                                  sx={{
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    fontSize: 14,
                                    borderWidth: 2,
                                    borderColor: '#4A90E2',
                                    color: '#4A90E2',
                                    minWidth: 100,
                                    '&:hover': {
                                      borderWidth: 2,
                                      bgcolor: 'rgba(74,144,226,0.1)',
                                      transform: 'translateY(-2px)',
                                    },
                                  }}
                                >
                                  Xem chi tiết
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                  
                  {/* Pagination for packages */}
                  {totalPackagePages > 1 && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 1,
                      mt: 4,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(245,158,11,0.05)'
                    }}>
                      <Button 
                        onClick={() => setPagePackage(page => Math.max(1, page - 1))} 
                        disabled={pagePackage === 1}
                        sx={{ 
                          minWidth: 44,
                          height: 44,
                          borderRadius: 2,
                          color: '#4A90E2',
                          '&:disabled': { color: '#ccc' }
                        }}
                      >
                        <NavigateBeforeIcon />
                      </Button>
                      
                      {[...Array(totalPackagePages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={pagePackage === i + 1 ? 'contained' : 'outlined'}
                          sx={{ 
                            minWidth: 44, 
                            height: 44,
                            borderRadius: 2,
                            fontWeight: 700, 
                            fontSize: 16,
                            border: pagePackage === i + 1 ? 'none' : '2px solid rgba(74,144,226,0.2)',
                            background: pagePackage === i + 1 
                              ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' 
                              : 'transparent',
                            color: pagePackage === i + 1 ? '#fff' : '#4A90E2',
                            '&:hover': {
                              background: pagePackage === i + 1 
                                ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' 
                                : 'rgba(74,144,226,0.1)',
                              transform: 'translateY(-2px)',
                            }
                          }}
                          onClick={() => setPagePackage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button 
                        onClick={() => setPagePackage(page => Math.min(totalPackagePages, page + 1))} 
                        disabled={pagePackage === totalPackagePages}
                        sx={{ 
                          minWidth: 44,
                          height: 44,
                          borderRadius: 2,
                          color: '#4A90E2',
                          '&:disabled': { color: '#ccc' }
                        }}
                      >
                        <NavigateNextIcon />
                      </Button>
                    </Box>
                  )}
                </>
              )}
              
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
                <ModernButton
                  variant="contained"
                  color="primary"
                  disabled={!selectedService || selectedService.idx == null}
                  onClick={() => setActiveStep(1)}
                  sx={{
                    minWidth: 200,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                    },
                  }}
                >
                  ✨ TIẾP TỤC →
                </ModernButton>
              </Box>
            </Box>
          )}
          {/* Bước 2: Chọn ngày giờ */}
          {activeStep === 1 && (
            <Box sx={{ background: '#fff', borderRadius: 5, p: { xs: 3, md: 5 }, boxShadow: '0 8px 32px rgba(74,144,226,0.10)', mb: 4, fontFamily: 'inherit' }}>
              <Typography variant="h4" fontWeight={800} mb={1} textAlign="center" sx={{ color: 'transparent', background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Chọn Ngày & Giờ
              </Typography>
              <Typography color="text.secondary" mb={3} textAlign="center" fontWeight={500}>
                Chọn ngày và giờ hẹn bạn muốn
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: { xs: 'stretch', md: 'flex-start' }, gap: { xs: 2, md: 2.5 }, mt: 4, mb: 2 }}>
                {/* Chọn ngày */}
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.9) 100%)',
                  borderRadius: 5,
                  p: 4,
                  boxShadow: '0 12px 40px rgba(74,144,226,0.12)',
                  border: '1px solid rgba(74,144,226,0.08)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  minWidth: { xs: '100%', md: 380 }
                }}>
                  <Typography
                    fontWeight={800}
                    mb={3}
                    fontSize={24}
                    textAlign="center"
                    sx={{
                      background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 60,
                        height: 3,
                        background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                        borderRadius: 2,
                      }
                    }}
                  >
                    📅 Chọn ngày khám
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      disablePast
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 8px 25px rgba(74,144,226,0.08)',
                        background: '#fff',
                        border: '1px solid rgba(74,144,226,0.1)',
                        p: 2,
                        minWidth: 320,
                        '& .MuiPickersDay-root': {
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': {
                            background: 'rgba(74,144,226,0.1)',
                          },
                          '&.Mui-selected': {
                            background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                            color: '#fff',
                            fontWeight: 800,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1ABC9C 0%, #4A90E2 100%)',
                            }
                          }
                        },
                        '& .MuiPickersCalendarHeader-root': {
                          paddingLeft: 2,
                          paddingRight: 2,
                        },
                        '& .MuiPickersCalendarHeader-labelContainer': {
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#2d3748',
                        }
                      }}
                      slotProps={{
                        actionBar: { sx: { display: 'none' } },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Chọn giờ */}
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.9) 100%)',
                  borderRadius: 5,
                  p: 4,
                  boxShadow: '0 12px 40px rgba(74,144,226,0.12)',
                  border: '1px solid rgba(74,144,226,0.08)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  minWidth: { xs: '100%', md: 380 }
                }}>
                  <Typography
                    fontWeight={800}
                    mb={3}
                    fontSize={24}
                    textAlign="center"
                    sx={{
                      background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 60,
                        height: 3,
                        background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                        borderRadius: 2,
                      }
                    }}
                  >
                    🕐 Chọn khung giờ
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: 2.5, 
                    minWidth: 280, 
                    justifyContent: 'center',
                    mt: 3
                  }}>
                    {timeSlots.map(slot => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? 'contained' : 'outlined'}
                        onClick={() => setSelectedTime(slot)}
                        sx={{
                          minWidth: 130,
                          height: 56,
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          px: 3,
                          py: 1.5,
                          borderWidth: 2,
                          borderColor: selectedTime === slot ? 'transparent' : 'rgba(74,144,226,0.3)',
                          background: selectedTime === slot 
                            ? 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' 
                            : 'rgba(255,255,255,0.9)',
                          color: selectedTime === slot ? '#fff' : '#4A90E2',
                          boxShadow: selectedTime === slot 
                            ? '0 8px 25px rgba(74,144,226,0.25)' 
                            : '0 4px 15px rgba(74,144,226,0.08)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s',
                          },
                          '&:hover': {
                            background: selectedTime === slot 
                              ? 'linear-gradient(135deg, #1ABC9C 0%, #4A90E2 100%)' 
                              : 'rgba(74,144,226,0.1)',
                            borderColor: '#4A90E2',
                            color: selectedTime === slot ? '#fff' : '#4A90E2',
                            transform: 'translateY(-2px) scale(1.02)',
                            boxShadow: selectedTime === slot 
                              ? '0 12px 35px rgba(74,144,226,0.35)' 
                              : '0 8px 25px rgba(74,144,226,0.15)',
                            '&::before': {
                              left: '100%',
                            }
                          },
                        }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                <ModernButton
                  variant="outlined"
                  color="primary"
                  onClick={() => setActiveStep(0)}
                  sx={{
                    minWidth: 200,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderColor: '#4A90E2',
                    color: '#4A90E2',
                    background: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      borderWidth: 2,
                      background: 'rgba(74,144,226,0.1)',
                      borderColor: '#4A90E2',
                    },
                  }}
                >
                  ← QUAY LẠI DỊCH VỤ
                </ModernButton>
                <ModernButton
                  variant="contained"
                  color="primary"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setActiveStep(2)}
                  sx={{
                    minWidth: 200,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                    },
                    '&:disabled': {
                      background: '#e0e7ff',
                      color: '#9ca3af',
                    },
                  }}
                >
                  ✨ TIẾP TỤC →
                </ModernButton>
              </Box>
            </Box>
          )}
          {/* Bước 3: Ghi chú */}
          {activeStep === 2 && (
            <Box sx={{ background: '#fff', borderRadius: 5, p: { xs: 3, md: 5 }, boxShadow: '0 8px 32px rgba(74,144,226,0.10)', mb: 4, fontFamily: 'inherit' }}>
              <Typography variant="h4" fontWeight={800} mb={2} textAlign="center" sx={{ color: 'transparent', background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Ghi chú cho lịch hẹn
              </Typography>
              <TextField
                label="Ghi chú (tuỳ chọn)"
                multiline
                minRows={4}
                fullWidth
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Nhập ghi chú cho lịch hẹn nếu có..."
                sx={{ mb: 4 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                <ModernButton
                  variant="outlined"
                  color="primary"
                  onClick={() => setActiveStep(1)}
                  sx={{
                    minWidth: 200,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderColor: '#4A90E2',
                    color: '#4A90E2',
                    background: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      borderWidth: 2,
                      background: 'rgba(74,144,226,0.1)',
                      borderColor: '#4A90E2',
                    },
                  }}
                >
                  ← QUAY LẠI NGÀY & GIỜ
                </ModernButton>
                <ModernButton
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep(3)}
                  sx={{
                    minWidth: 200,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                    },
                  }}
                >
                  ✨ TIẾP TỤC →
                </ModernButton>
              </Box>
            </Box>
          )}
          {/* Bước 4: Thanh toán */}
          {activeStep === 3 && !bookingSuccess && (
            <Box sx={{ background: '#fff', borderRadius: 5, p: { xs: 3, md: 5 }, boxShadow: '0 8px 32px rgba(74,144,226,0.10)', mb: 4, fontFamily: 'inherit' }}>
              <Typography variant="h4" fontWeight={800} mb={2} textAlign="center" sx={{ color: 'transparent', background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Chọn phương thức thanh toán
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                sx={{ mb: 4 }}
              >
                <FormControlLabel value="cash" control={<Radio />} label="Thanh toán tiền mặt" />
                <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
                <FormControlLabel value="visa" control={<Radio />} label="Thanh toán bằng thẻ Visa" />
              </RadioGroup>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, gap: 2 }}>
                <ModernButton
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setActiveStep(0);
                    setSelectedService(null);
                    setSelectedDate(null);
                    setSelectedTime('');
                    setNote('');
                    setPaymentMethod('cash');
                    setVisaInfo({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
                  }}
                  sx={{ 
                    minWidth: 150,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    background: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      borderWidth: 2,
                      background: 'rgba(239,68,68,0.1)',
                      borderColor: '#ef4444',
                    },
                  }}
                >
                  ❌ Hủy
                </ModernButton>
                <ModernButton
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: 280,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1ABC9C, #4A90E2)',
                    },
                  }}
                  onClick={() => {
                    if (paymentMethod === 'bank') setOpenBankDialog(true);
                    else if (paymentMethod === 'visa') setOpenVisaDialog(true);
                    else handleBookTest();
                  }}
                >
                  💳 THANH TOÁN & HOÀN THÀNH ĐẶT LỊCH
                </ModernButton>
              </Box>
            </Box>
          )}
          {/* Thông báo thành công */}
          {activeStep === 3 && bookingSuccess && (
            <Box
              sx={{
                background: '#fff',
                borderRadius: 5,
                p: { xs: 4, md: 6 },
                boxShadow: '0 8px 32px rgba(74,144,226,0.10)',
                maxWidth: 700,
                mx: 'auto',
                textAlign: 'center',
                mt: 6,
              }}
            >
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                  background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  fontSize: { xs: '2.2rem', md: '2.8rem' },
                  letterSpacing: '-1px',
                }}
              >
                Đặt lịch thành công!
              </Typography>
              <Typography
                sx={{
                  color: '#222',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  mb: 4,
                  fontWeight: 500,
                }}
              >
                {bookingMessage}
              </Typography>
              <ModernButton
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  minWidth: 200,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                  },
                }}
              >
                🏠 Về trang chủ
              </ModernButton>
            </Box>
          )}
        </Box>
      </Container>
      {/* Dialog chi tiết xét nghiệm */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => closeAllDialogs()} 
        maxWidth="lg" 
        fullWidth
        sx={{ zIndex: 1300 }}
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
          minHeight: 500,
          maxHeight: '90vh'
        }}>
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 250, md: 400 },
              height: { xs: 250, md: 400 },
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
              top: -150,
              right: -150,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 200, md: 350 },
              height: { xs: 200, md: 350 },
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)',
              bottom: -100,
              left: -100,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          
          {/* Header with gradient */}
          <Box sx={{ 
            py: 4, 
            px: 5,
            background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
            color: 'white',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            flexShrink: 0
          }}>
            <Typography 
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: 24, md: 28 }, 
                textAlign: 'center', 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                mb: 1,
                letterSpacing: '-0.5px'
              }}
            >
              {detailData?.services ? '📦 ' : '🔬 '}{detailData?.name || 'Chi tiết xét nghiệm'}
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
              {detailData?.description || (detailData?.services ? 'Gói xét nghiệm tổng hợp' : 'Thông tin chi tiết và giá trị tham chiếu')}
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
                boxShadow: '0 8px 25px rgba(74,144,226,0.15)',
                border: '1px solid rgba(74,144,226,0.15)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(74,144,226,0.03) 0%, rgba(26,188,156,0.03) 100%)',
                  zIndex: 0
                }
              }}
            >
              <Typography 
                fontWeight={800} 
                fontSize={26} 
                sx={{ 
                  background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  zIndex: 1,
                  mr: 1
                }}
              >
                💰 {detailData?.price?.toLocaleString('vi-VN')} đ
              </Typography>
            </Box>
          </Box>
          
          {/* Scrollable content area */}
          <Box 
            sx={{ 
              position: 'relative', 
              zIndex: 1,
              overflowY: 'auto',
              flexGrow: 1,
              px: { xs: 3, md: 5 },
              pb: 4
            }}
          >
            {detailData === null ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress sx={{ color: '#4A90E2' }} />
              </Box>
            ) : detailData?.error ? (
              <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>{detailData.error}</Typography>
            ) : (
              <Box>
                {/* Thông tin tổng quan cho xét nghiệm lẻ */}
                {detailData && !detailData.services && (
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
                    borderRadius: 4,
                    p: 4,
                    mb: 4,
                    boxShadow: '0 10px 30px rgba(74,144,226,0.08)',
                    border: '1px solid rgba(74,144,226,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      sx={{ 
                        mb: 2,
                        color: '#2d3748',
                        fontSize: '1.3rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      📋 Mô tả dịch vụ
                    </Typography>
                    <Typography 
                      color="text.secondary" 
                      fontSize="1.05rem" 
                      lineHeight={1.7}
                      sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                      {detailData.description || 'Xét nghiệm giúp phát hiện sớm các bệnh lây truyền qua đường tình dục, đảm bảo sức khỏe của bạn.'}
                    </Typography>
                  </Box>
                )}

                {/* Services list cho gói xét nghiệm */}
                {detailData?.services && Array.isArray(detailData.services) && detailData.services.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        color: '#2d3748',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        fontSize: '1.4rem'
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                          color: 'white', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(74,144,226,0.25)'
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
                        p: 4,
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
                            transition: 'all 0.3s ease',
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
                                handleOpenServiceDetailFromPackage(svc.id);
                              }}
                              sx={{
                                borderRadius: 6,
                                minWidth: 'auto',
                                fontSize: '0.85rem',
                                py: 0.6,
                                px: 1.5,
                                borderWidth: 2,
                                borderColor: '#4A90E2',
                                color: '#4A90E2',
                                fontWeight: 600,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  bgcolor: 'rgba(74,144,226,0.08)',
                                  borderWidth: 2,
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(74,144,226,0.2)',
                                }
                              }}
                            >
                              👁️ Chi tiết
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Hiển thị components cho xét nghiệm lẻ */}
                {detailData && Array.isArray(detailData.components) && detailData.components.length > 0 && !detailData.services && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        color: '#2d3748',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        fontSize: '1.4rem'
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                          color: 'white', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(74,144,226,0.25)'
                        }}
                      >
                        {detailData.components.length}
                      </Box>
                      Chỉ số xét nghiệm chi tiết
                    </Typography>
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(74,144,226,0.12)',
                        border: '1px solid rgba(74,144,226,0.08)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ 
                            background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                            '& .MuiTableCell-head': {
                              borderBottom: 'none'
                            }
                          }}>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              py: 2.5,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              🧪 Thành phần
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              ✅ Giá trị bình thường
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              📏 Đơn vị
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              📝 Mô tả
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detailData.components.map((row, idx) => (
                            <TableRow 
                              key={idx} 
                              sx={{ 
                                background: idx % 2 === 0 
                                  ? 'rgba(255,255,255,0.8)' 
                                  : 'rgba(248,250,255,0.8)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  background: 'rgba(74,144,226,0.08)',
                                  transform: 'scale(1.002)'
                                },
                                '& .MuiTableCell-body': {
                                  borderBottom: '1px solid rgba(74,144,226,0.1)'
                                }
                              }}
                            >
                              <TableCell sx={{ 
                                fontWeight: 700, 
                                color: '#2d3748',
                                fontSize: '1rem',
                                py: 2
                              }}>
                                {row.componentName}
                              </TableCell>
                              <TableCell sx={{ 
                                fontWeight: 600,
                                color: '#16a085',
                                fontSize: '0.95rem'
                              }}>
                                {row.normalRange}
                              </TableCell>
                              <TableCell sx={{ 
                                fontWeight: 500,
                                color: '#4a5568',
                                fontSize: '0.95rem'
                              }}>
                                <Chip 
                                  label={row.unit} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(74,144,226,0.1)', 
                                    color: '#4A90E2',
                                    fontWeight: 600,
                                    fontSize: '0.8rem'
                                  }} 
                                />
                              </TableCell>
                              <TableCell sx={{ 
                                color: '#64748b',
                                lineHeight: 1.5,
                                fontSize: '0.95rem'
                              }}>
                                {row.description}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Hiển thị reference range cho xét nghiệm lẻ */}
                {detailData && Array.isArray(detailData.referenceRange) && detailData.referenceRange.length > 0 && !detailData.services && (
                  <Box sx={{ mb: 3 }}>
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
                        📊
                      </Box>
                      Giá trị tham chiếu ({detailData.referenceRange.length} chỉ số)
                    </Typography>
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 5px 15px rgba(74,144,226,0.08)',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' }}>
                            <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Thành phần</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Giá trị bình thường</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Đơn vị</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Mô tả</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detailData.referenceRange.map((row, idx) => (
                            <TableRow 
                              key={idx} 
                              sx={{ 
                                background: idx % 2 === 0 ? '#f8fafc' : '#fff',
                                '&:hover': { background: '#edf2f7' }
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                              <TableCell>{row.normalRange}</TableCell>
                              <TableCell>{row.unit}</TableCell>
                              <TableCell sx={{ color: '#64748b' }}>{row.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Hiển thị reference range dạng string */}
                {detailData?.referenceRange && !Array.isArray(detailData.referenceRange) && !detailData.services && (
                  <Box sx={{ mb: 3 }}>
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
                        📊
                      </Box>
                      Giá trị tham chiếu
                    </Typography>
                    <Box 
                      sx={{ 
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(247,250,252,0.95) 100%)',
                        p: 3,
                        borderRadius: 4,
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 5px 15px rgba(74,144,226,0.08)'
                      }}
                    >
                      <Typography sx={{ color: '#4a5568', lineHeight: 1.7, fontSize: '1rem' }}>
                        {detailData.referenceRange}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          
          {/* Footer */}
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
              onClick={() => closeAllDialogs()} 
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
            {detailData && (
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
                onClick={() => {
                  closeAllDialogs();
                  if (detailData.services) {
                    // Nếu là gói, tự động chọn gói và chuyển sang bước tiếp theo
                    const idx = packages.findIndex(pkg => pkg.id === detailData.id);
                    if (idx !== -1) {
                      setSelectedService({ type: 'package', idx });
                      setActiveStep(1);
                    }
                  } else {
                    // Nếu là xét nghiệm lẻ, tự động chọn và chuyển sang bước tiếp theo
                    const idx = singleTests.findIndex(test => test.id === detailData.id);
                    if (idx !== -1) {
                      setSelectedService({ type: 'single', idx });
                      setActiveStep(1);
                    }
                  }
                }}
              >
                Chọn dịch vụ này
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>

      {/* Dialog phụ xem chi tiết xét nghiệm lẻ - Style hiện đại */}
      <Dialog 
        open={subDetailOpen} 
        onClose={() => setSubDetailOpen(false)} 
        maxWidth="lg" 
        fullWidth
        sx={{ zIndex: 1400 }}
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
          minHeight: 500,
          maxHeight: '90vh'
        }}>
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 250, md: 400 },
              height: { xs: 250, md: 400 },
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
              top: -150,
              right: -150,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 200, md: 350 },
              height: { xs: 200, md: 350 },
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)',
              bottom: -100,
              left: -100,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Header với gradient */}
          <Box sx={{ 
            py: 4, 
            px: 5,
            background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            flexShrink: 0
          }}>
            <Typography 
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: 24, md: 28 }, 
                textAlign: 'center', 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.5px',
                mb: 1
              }}
            >
              🔬 {subDetailData?.name || 'Chi tiết xét nghiệm'}
            </Typography>
            <Typography 
              sx={{ 
                opacity: 0.95,
                fontSize: '1.1rem',
                fontWeight: 400
              }}
            >
              Thông tin chi tiết và giá trị tham chiếu
            </Typography>
          </Box>
          
          {/* Nội dung scrollable */}
          <Box sx={{ 
            p: { xs: 3, md: 5 }, 
            flexGrow: 1,
            overflowY: 'auto',
            position: 'relative',
            zIndex: 1
          }}>
            {subDetailLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress size={48} sx={{ color: '#4A90E2' }} />
              </Box>
            ) : subDetailData?.error ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="error" fontSize={18}>{subDetailData.error}</Typography>
              </Box>
            ) : subDetailData ? (
              <>
                {/* Thông tin tổng quan */}
                <Box sx={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
                  borderRadius: 4,
                  p: 4,
                  mb: 4,
                  boxShadow: '0 10px 30px rgba(74,144,226,0.08)',
                  border: '1px solid rgba(74,144,226,0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      sx={{ 
                        mb: 2,
                        color: '#2d3748',
                        fontSize: '1.3rem'
                      }}
                    >
                      📋 Mô tả dịch vụ
                    </Typography>
                    <Typography 
                      mb={3} 
                      color="text.secondary" 
                      fontSize="1.05rem" 
                      lineHeight={1.7}
                      sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                      {subDetailData.description || 'Xét nghiệm giúp phát hiện sớm các bệnh lây truyền qua đường tình dục, đảm bảo sức khỏe của bạn.'}
                    </Typography>
                  </Box>

                  {/* Price badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box 
                      sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        bgcolor: 'white', 
                        py: 2, 
                        px: 5, 
                        borderRadius: 50,
                        boxShadow: '0 8px 25px rgba(74,144,226,0.15)',
                        border: '1px solid rgba(74,144,226,0.15)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(74,144,226,0.03) 0%, rgba(26,188,156,0.03) 100%)',
                          zIndex: 0
                        }
                      }}
                    >
                      <Typography 
                        fontWeight={800} 
                        fontSize={26} 
                        sx={{ 
                          background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          position: 'relative',
                          zIndex: 1,
                          mr: 1
                        }}
                      >
                        💰 {subDetailData.price?.toLocaleString('vi-VN')} đ
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Bảng giá trị tham chiếu - components */}
                {Array.isArray(subDetailData.components) && subDetailData.components.length > 0 && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      sx={{ 
                        mb: 3,
                        color: '#2d3748',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        fontSize: '1.4rem'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(74,144,226,0.25)'
                        }}
                      >
                        {subDetailData.components.length}
                      </Box>
                      Chỉ số xét nghiệm chi tiết
                    </Typography>
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(74,144,226,0.12)',
                        border: '1px solid rgba(74,144,226,0.08)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ 
                            background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                            '& .MuiTableCell-head': {
                              borderBottom: 'none'
                            }
                          }}>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              py: 2.5,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              🧪 Thành phần
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              ✅ Giá trị bình thường
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              📏 Đơn vị
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 800, 
                              color: '#fff', 
                              fontSize: 16,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              📝 Mô tả
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subDetailData.components.map((row, idx) => (
                            <TableRow 
                              key={idx} 
                              sx={{ 
                                background: idx % 2 === 0 
                                  ? 'rgba(255,255,255,0.8)' 
                                  : 'rgba(248,250,255,0.8)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  background: 'rgba(74,144,226,0.08)',
                                  transform: 'scale(1.002)'
                                },
                                '& .MuiTableCell-body': {
                                  borderBottom: '1px solid rgba(74,144,226,0.1)'
                                }
                              }}
                            >
                              <TableCell sx={{ 
                                fontWeight: 700, 
                                color: '#2d3748',
                                fontSize: '1rem',
                                py: 2
                              }}>
                                {row.componentName}
                              </TableCell>
                              <TableCell sx={{ 
                                fontWeight: 600,
                                color: '#16a085',
                                fontSize: '0.95rem'
                              }}>
                                {row.normalRange}
                              </TableCell>
                              <TableCell sx={{ 
                                fontWeight: 500,
                                color: '#4a5568',
                                fontSize: '0.95rem'
                              }}>
                                <Chip 
                                  label={row.unit} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(74,144,226,0.1)', 
                                    color: '#4A90E2',
                                    fontWeight: 600,
                                    fontSize: '0.8rem'
                                  }} 
                                />
                              </TableCell>
                              <TableCell sx={{ 
                                color: '#64748b',
                                lineHeight: 1.5,
                                fontSize: '0.95rem'
                              }}>
                                {row.description}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Bảng giá trị tham chiếu - referenceRange array */}
                {Array.isArray(subDetailData.referenceRange) && subDetailData.referenceRange.length > 0 && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      sx={{ 
                        mb: 3,
                        color: '#2d3748',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        fontSize: '1.4rem'
                      }}
                    >
                      📊 Giá trị tham chiếu
                    </Typography>
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(74,144,226,0.12)',
                        border: '1px solid rgba(74,144,226,0.08)'
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)' }}>
                            <TableCell sx={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>🧪 Thành phần</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>✅ Giá trị bình thường</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>📏 Đơn vị</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>📝 Mô tả</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subDetailData.referenceRange.map((row, idx) => (
                            <TableRow 
                              key={idx} 
                              sx={{ 
                                background: idx % 2 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(248,250,255,0.8)',
                                '&:hover': { background: 'rgba(74,144,226,0.08)' }
                              }}
                            >
                              <TableCell sx={{ fontWeight: 700, color: '#2d3748' }}>{row.name}</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#16a085' }}>{row.normalRange}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={row.unit} 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(74,144,226,0.1)', color: '#4A90E2', fontWeight: 600 }} 
                                />
                              </TableCell>
                              <TableCell sx={{ color: '#64748b' }}>{row.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Fallback cho referenceRange string */}
                {subDetailData?.referenceRange && !Array.isArray(subDetailData.referenceRange) && (
                  <Box sx={{ mt: 3 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={800} 
                      sx={{ 
                        mb: 3, 
                        color: '#2d3748',
                        fontSize: '1.3rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      📊 Giá trị tham chiếu
                    </Typography>
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%)',
                      p: 4,
                      borderRadius: 4,
                      border: '1px solid rgba(74,144,226,0.1)',
                      boxShadow: '0 8px 25px rgba(74,144,226,0.08)'
                    }}>
                      <Typography sx={{ 
                        color: '#4a5568', 
                        lineHeight: 1.7,
                        fontSize: '1.05rem',
                        fontWeight: 500
                      }}>
                        {subDetailData.referenceRange}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="error" fontSize={18}>Không thể tải chi tiết xét nghiệm.</Typography>
              </Box>
            )}
          </Box>
          
          {/* Action buttons */}
          <Box sx={{ 
            p: 4, 
            borderTop: '1px solid rgba(74,144,226,0.1)',
            background: 'rgba(255,255,255,0.9)',
            display: 'flex',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            flexShrink: 0
          }}>
            <Button 
              onClick={() => setSubDetailOpen(false)} 
              variant="outlined" 
              sx={{ 
                borderRadius: 12, 
                fontWeight: 700,
                minWidth: 150,
                py: 1.5,
                px: 4,
                borderWidth: 2,
                borderColor: '#4A90E2',
                color: '#4A90E2',
                fontSize: '1rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: '#357ae8',
                  bgcolor: 'rgba(74,144,226,0.08)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(74,144,226,0.2)'
                }
              }}
            >
              ✨ Đóng
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Dialog xác nhận chuyển khoản ngân hàng */}
      <Dialog
        open={openBankDialog}
        onClose={() => setOpenBankDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 6,
            p: 0,
            boxShadow: '0 8px 32px rgba(74,144,226,0.18)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 24, color: '#1976D2', textAlign: 'center', pt: 4, pb: 2, letterSpacing: '-1px' }}>
          Thông tin chuyển khoản
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2, pt: 0, textAlign: 'center' }}>
          <Typography fontWeight={900} color="#E67E22" mb={2} fontSize={22}>
            Số tiền cần chuyển: {selectedPrice?.toLocaleString()} VNĐ
          </Typography>
          <Typography fontSize={17} mb={1}>
            Số tài khoản: <b style={{ color: '#1976D2' }}>123456789</b>
          </Typography>
          <Typography fontSize={17} mb={1}>
            Ngân hàng: <b style={{ color: '#1976D2' }}>Vietcombank - CN Hà Nội</b>
          </Typography>
          <Typography fontSize={17} mb={2}>
            Chủ tài khoản: <b style={{ color: '#1976D2' }}>Nguyễn Văn A</b>
          </Typography>
          <Typography fontSize={14} color="text.secondary" mb={2}>
            Vui lòng ghi rõ họ tên và số điện thoại khi chuyển khoản.<br/>
            Sau khi chuyển khoản, nhấn "Tôi đã thanh toán" để hoàn tất đặt lịch.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setOpenBankDialog(false);
              setBookingSuccess(false);
              setBookingMessage('Đặt lịch thất bại hoặc bạn đã hủy thanh toán.');
            }}
            sx={{ minWidth: 120, fontWeight: 700, borderRadius: 50, height: 48, fontSize: 17 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={pendingBankBooking}
            onClick={async () => {
              setPendingBankBooking(true);
              try {
                await handleBookTest();
                setOpenBankDialog(false);
              } catch {
                setBookingSuccess(false);
                setBookingMessage('Đặt lịch thất bại. Vui lòng thử lại!');
              } finally {
                setPendingBankBooking(false);
              }
            }}
            sx={{ minWidth: 180, fontWeight: 700, borderRadius: 50, height: 48, fontSize: 17 }}
          >
            Tôi đã thanh toán
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog nhập thông tin thẻ Visa */}
      <Dialog
        open={openVisaDialog}
        onClose={() => setOpenVisaDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 6,
            p: 0,
            boxShadow: '0 8px 32px rgba(74,144,226,0.18)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 24, color: '#1976D2', textAlign: 'center', pt: 4, pb: 2, letterSpacing: '-1px' }}>
          Nhập thông tin thẻ Visa
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2, pt: 0, textAlign: 'center' }}>
          <Typography fontWeight={900} color="#E67E22" mb={2} fontSize={22}>
            Số tiền cần thanh toán: {selectedPrice?.toLocaleString()} VNĐ
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Số thẻ"
                fullWidth
                value={visaInfo.cardNumber}
                onChange={e => setVisaInfo({ ...visaInfo, cardNumber: e.target.value })}
                error={!!visaErrors.cardNumber}
                helperText={visaErrors.cardNumber}
                inputProps={{ maxLength: 19, inputMode: 'numeric', pattern: '[0-9 ]*' }}
                sx={{ background: '#fff', borderRadius: 3, fontSize: 18 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tên chủ thẻ"
                fullWidth
                value={visaInfo.cardName}
                onChange={e => setVisaInfo({ ...visaInfo, cardName: e.target.value })}
                error={!!visaErrors.cardName}
                helperText={visaErrors.cardName}
                sx={{ background: '#fff', borderRadius: 3, fontSize: 18 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ngày hết hạn (MM/YY)"
                fullWidth
                value={visaInfo.expiry}
                onChange={e => setVisaInfo({ ...visaInfo, expiry: e.target.value })}
                error={!!visaErrors.expiry}
                helperText={visaErrors.expiry}
                placeholder="MM/YY"
                sx={{ background: '#fff', borderRadius: 3, fontSize: 18 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="CVV"
                fullWidth
                value={visaInfo.cvv}
                onChange={e => setVisaInfo({ ...visaInfo, cvv: e.target.value })}
                error={!!visaErrors.cvv}
                helperText={visaErrors.cvv}
                inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
                sx={{ background: '#fff', borderRadius: 3, fontSize: 18 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenVisaDialog(false)}
            sx={{ minWidth: 120, fontWeight: 700, borderRadius: 50, height: 48, fontSize: 17 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              // Validate form
              let errors = {};
              if (!visaInfo.cardNumber || visaInfo.cardNumber.length < 12) errors.cardNumber = 'Số thẻ không hợp lệ';
              if (!visaInfo.cardName) errors.cardName = 'Vui lòng nhập tên chủ thẻ';
              if (!visaInfo.expiry || !/^\d{2}\/\d{2}$/.test(visaInfo.expiry)) errors.expiry = 'Định dạng MM/YY';
              if (!visaInfo.cvv || visaInfo.cvv.length < 3) errors.cvv = 'CVV không hợp lệ';
              setVisaErrors(errors);
              if (Object.keys(errors).length > 0) return;
              await handleBookTest();
              setOpenVisaDialog(false);
            }}
            sx={{ minWidth: 180, fontWeight: 700, borderRadius: 50, height: 48, fontSize: 17 }}
          >
            Thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
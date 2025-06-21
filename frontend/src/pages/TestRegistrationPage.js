// Thư viện React và các hook cơ bản
import React, { useState, useEffect } from 'react';
// Import các component UI từ Material-UI (MUI)
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
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
  useTheme,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
// Icon từ MUI
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// Import các hàm gọi API liên quan đến xét nghiệm từ service
import { getAllSTIServices, getAllSTIPackages, getSTITestDetails, getSTIPackageById, getSTIServiceById, bookSTITest, getActiveSTIServices } from '@/services/stiService';
// Import các component hỗ trợ chọn ngày giờ
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

// Tạo Dialog với hiệu ứng glassmorphism
const GlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(16px)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(74,144,226,0.12)',
    border: '1px solid rgba(74,144,226,0.08)',
  },
}));

// Tạo TextField hiện đại
const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: '#f7fafc',
    fontFamily: 'inherit',
    fontWeight: 500,
    fontSize: 16,
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(74,144,226,0.04)',
    '& fieldset': {
      borderColor: 'rgba(74,144,226,0.15)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 0 2px #4A90E233',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'inherit',
    fontWeight: 500,
    color: theme.palette.text.primary,
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
  const [error, setError] = useState(null);// Lỗi khi load dữ liệu
  const [activeTab, setActiveTab] = useState('single');// Tab hiện tại: lẻ/gói
  const [pageSingle, setPageSingle] = useState(1);// Trang phân trang xét nghiệm lẻ
  const [pagePackage, setPagePackage] = useState(1);// Trang phân trang gói
  const ITEMS_PER_PAGE = 5;// Số item mỗi trang
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);// Dialog chi tiết dịch vụ/gói
  const [detailData, setDetailData] = useState(null);// Dữ liệu chi tiết dịch vụ/gói
  const [loadingDetail, setLoadingDetail] = useState(false);// Loading chi tiết
  const [note, setNote] = useState('');// Ghi chú của khách
  const [paymentMethod, setPaymentMethod] = useState('cash');// Phương thức thanh toán
  const [visaInfo, setVisaInfo] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' }); // Thông tin thẻ visa
  const [visaErrors, setVisaErrors] = useState({});// Lỗi nhập thẻ visa
  const [bookingSuccess, setBookingSuccess] = useState(false);// Đặt lịch thành công
  const [bookingMessage, setBookingMessage] = useState(''); // Message trả về từ backend khi đặt lịch thành công
  const location = useLocation(); // Lấy state truyền qua router
  const theme = useTheme();// Chủ đề MUI
  const navigate = useNavigate(); // Điều hướng
  const [packageDetailLoading, setPackageDetailLoading] = useState(false);// Loading chi tiết gói
  const [subDetailOpen, setSubDetailOpen] = useState(false);
  const [subDetailData, setSubDetailData] = useState(null);
  const [subDetailLoading, setSubDetailLoading] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState(false); // Popup xác nhận chuyển khoản
  const [pendingBankBooking, setPendingBankBooking] = useState(false); // Đang xử lý đặt lịch bank
  const [openVisaDialog, setOpenVisaDialog] = useState(false); // Popup nhập thông tin Visa
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
        }
        if (packagesResponse.success) {
          setPackages(packagesResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
  const paginatedSingleTests = singleTests.slice((pageSingle - 1) * ITEMS_PER_PAGE, pageSingle * ITEMS_PER_PAGE);
  const paginatedPackages = packages.slice((pagePackage - 1) * ITEMS_PER_PAGE, pagePackage * ITEMS_PER_PAGE);
  const totalSinglePages = Math.ceil(singleTests.length / ITEMS_PER_PAGE);
  const totalPackagePages = Math.ceil(packages.length / ITEMS_PER_PAGE);

  // --- Hàm mở dialog chi tiết dịch vụ/gói ---
  const handleOpenDetail = (id, type = 'single') => {
    if (type === 'single') {
      const data = singleTests.find(item => item.id === id);
      setDetailData(data);
      setDetailDialogOpen(true);
    } else if (type === 'package') {
      const data = packages.find(item => item.id === id);
      setDetailData(data);
      setDetailDialogOpen(true);
    }
  };

  // --- Hàm mở dialog chi tiết gói (gọi API lấy chi tiết gói) ---
  const handleOpenPackageDetail = async (packageId) => {
    setPackageDetailLoading(true);
    try {
      const res = await getSTIPackageById(packageId);
      setDetailData(res.data);
      setDetailDialogOpen(true);
    } finally {
      setPackageDetailLoading(false);
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
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, idx) => (
              <Step key={label}>
                <StepLabel sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 700,
                    fontSize: 18,
                    color: theme => theme.palette.text.primary,
                    fontFamily: 'inherit',
                  }
                }}>{idx === 0 ? <b>{idx + 1}</b> : idx + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>
           {/* --- Loading hoặc lỗi --- */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : activeStep === 0 && (
            <Box sx={{ background: '#fff', borderRadius: 5, p: { xs: 3, md: 5 }, boxShadow: '0 8px 32px rgba(74,144,226,0.10)', mb: 4, fontFamily: 'inherit' }}>
              <Typography
                variant="h6"
                fontWeight={800}
                fontSize={32}
                mb={2}
                sx={{ color: '#222', fontFamily: 'inherit' }}
              >
                Chọn loại dịch vụ
              </Typography>
              <Typography
                sx={{ color: '#757575', fontWeight: 400, fontSize: 18, fontFamily: 'inherit', mb: 2 }}
              >
                Chọn loại tư vấn bạn cần
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, mb: 3, alignItems: 'flex-end', p: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    fontWeight: 700,
                    fontSize: 28,
                    color: activeTab === 'single' ? '#357ae8' : '#757575',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s',
                  }}
                  onClick={() => setActiveTab('single')}
                >
                  Xét nghiệm lẻ
                  {activeTab === 'single' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: -6,
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    fontWeight: 700,
                    fontSize: 28,
                    color: activeTab === 'package' ? '#357ae8' : '#757575',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s',
                  }}
                  onClick={() => setActiveTab('package')}
                >
                  Gói xét nghiệm
                  {activeTab === 'package' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: -6,
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                      }}
                    />
                  )}
                </Box>
              </Box>
              {/* Danh sách dịch vụ theo tab */}
              {activeTab === 'single' && (
                <>
                  <Box mb={2}>
                    {paginatedSingleTests.map((service, idx) => (
                      <Card
                        key={service.id}
                        variant={selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx) ? 'outlined' : 'elevation'}
                        sx={{
                          borderRadius: 6,
                          boxShadow: '0 2px 8px rgba(74,144,226,0.07)',
                          border: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx)
                            ? '2px solid #4A90E2'
                            : '1.5px solid #e0e7ef',
                          background: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx)
                            ? 'linear-gradient(90deg, #e3f2fd 0%, #f7fafc 100%)'
                            : '#fff',
                          transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                          cursor: 'pointer',
                          p: 1.5,
                          '&:hover': {
                            boxShadow: '0 12px 32px rgba(74,144,226,0.18)',
                            border: '2px solid #1ABC9C',
                            background: 'linear-gradient(90deg, #f0f7ff 0%, #e8f4ff 100%)',
                            transform: 'translateY(-4px) scale(1.01)',
                          },
                          position: 'relative',
                        }}
                        onClick={() => handleSelectService('single', (pageSingle - 1) * ITEMS_PER_PAGE + idx)}
                      >
                        {/* Dấu tick khi được chọn */}
                        {selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              bgcolor: 'transparent',
                              border: '2px solid #43a047',
                              borderRadius: '50%',
                              width: 22,
                              height: 22,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                            }}
                          >
                            <CheckIcon sx={{ color: '#43a047', fontSize: 16 }} />
                          </Box>
                        )}
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', p: 2 }}>
                          <Box>
                            <Typography fontWeight={700} fontSize={18}>{service.name}</Typography>
                            <Typography color="text.secondary" fontSize={14} mb={1}>
                              {service.description && service.description.length > 55
                                ? service.description.slice(0, 55) + '...'
                                : service.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <AccessTimeIcon sx={{ fontSize: 18, color: '#4A90E2', mr: 0.5 }} />
                              <Typography fontSize={15} color="text.secondary">{service.duration || '30 phút'}</Typography>
                              {service.label && <Chip label={service.label} size="small" sx={{ ml: 1 }} />}
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography fontWeight={700} fontSize={18} color="primary.main">{service.price ? service.price.toLocaleString('vi-VN') + ' đ' : ''}</Typography>
                            <Button
                              variant="contained"
                              sx={{
                                borderRadius: 50,
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                minWidth: 120,
                                height: 48,
                                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                                color: '#fff',
                                textTransform: 'none',
                                boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                                },
                              }}
                              onClick={() => handleOpenDetail(service.id, 'single')}
                            >
                              Chi tiết
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                  {/* Pagination for single tests */}
                  {totalSinglePages > 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Button onClick={() => setPageSingle(page => Math.max(1, page - 1))} disabled={pageSingle === 1} sx={{ minWidth: 32 }}><NavigateBeforeIcon /></Button>
                      {[...Array(totalSinglePages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={pageSingle === i + 1 ? 'contained' : 'outlined'}
                          sx={{ minWidth: 40, mx: 0.5, fontWeight: 700, fontSize: 20, borderRadius: 2, background: pageSingle === i + 1 ? '#357ae8' : undefined, color: pageSingle === i + 1 ? '#fff' : '#222' }}
                          onClick={() => setPageSingle(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button onClick={() => setPageSingle(page => Math.min(totalSinglePages, page + 1))} disabled={pageSingle === totalSinglePages} sx={{ minWidth: 32 }}><NavigateNextIcon /></Button>
                    </Box>
                  )}
                </>
              )}
              {activeTab === 'package' && (
                <>
                  <Box mb={2}>
                    {paginatedPackages.map((service, idx) => (
                      <Card
                        key={service.id}
                        variant={selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx) ? 'outlined' : 'elevation'}
                        sx={{
                          borderRadius: 6,
                          boxShadow: '0 2px 8px rgba(74,144,226,0.07)',
                          border: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx)
                            ? '2px solid #4A90E2'
                            : '1.5px solid #e0e7ef',
                          background: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx)
                            ? 'linear-gradient(90deg, #e3f2fd 0%, #f7fafc 100%)'
                            : '#fff',
                          transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                          cursor: 'pointer',
                          p: 1.5,
                          '&:hover': {
                            boxShadow: '0 12px 32px rgba(74,144,226,0.18)',
                            border: '2px solid #1ABC9C',
                            background: 'linear-gradient(90deg, #f0f7ff 0%, #e8f4ff 100%)',
                            transform: 'translateY(-4px) scale(1.01)',
                          },
                          position: 'relative',
                        }}
                        onClick={() => handleSelectService('package', (pagePackage - 1) * ITEMS_PER_PAGE + idx)}
                      >
                        {/* Dấu tick khi được chọn */}
                        {selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              bgcolor: 'transparent',
                              border: '2px solid #43a047',
                              borderRadius: '50%',
                              width: 22,
                              height: 22,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                            }}
                          >
                            <CheckIcon sx={{ color: '#43a047', fontSize: 16 }} />
                          </Box>
                        )}
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', p: 2 }}>
                          <Box>
                            <Typography fontWeight={700} fontSize={18}>{service.name}</Typography>
                            <Typography color="text.secondary" fontSize={14} mb={1}>
                              {service.description && service.description.length > 55
                                ? service.description.slice(0, 55) + '...'
                                : service.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <AccessTimeIcon sx={{ fontSize: 18, color: '#4A90E2', mr: 0.5 }} />
                              <Typography fontSize={15} color="text.secondary">{service.duration || '60 phút'}</Typography>
                              {service.label && <Chip label={service.label} size="small" sx={{ ml: 1 }} />}
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography fontWeight={700} fontSize={18} color="primary.main">{service.price ? service.price.toLocaleString('vi-VN') + ' đ' : ''}</Typography>
                            <Button
                              variant="contained"
                              sx={{
                                borderRadius: 50,
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                minWidth: 120,
                                height: 48,
                                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                                color: '#fff',
                                textTransform: 'none',
                                boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                                },
                              }}
                              onClick={() => handleOpenPackageDetail(service.id)}
                            >
                              Chi tiết
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                  {/* Pagination for packages */}
                  {totalPackagePages > 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Button onClick={() => setPagePackage(page => Math.max(1, page - 1))} disabled={pagePackage === 1} sx={{ minWidth: 32 }}><NavigateBeforeIcon /></Button>
                      {[...Array(totalPackagePages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={pagePackage === i + 1 ? 'contained' : 'outlined'}
                          sx={{ minWidth: 40, mx: 0.5, fontWeight: 700, fontSize: 20, borderRadius: 2, background: pagePackage === i + 1 ? '#357ae8' : undefined, color: pagePackage === i + 1 ? '#fff' : '#222' }}
                          onClick={() => setPagePackage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button onClick={() => setPagePackage(page => Math.min(totalPackagePages, page + 1))} disabled={pagePackage === totalPackagePages} sx={{ minWidth: 32 }}><NavigateNextIcon /></Button>
                    </Box>
                  )}
                </>
              )}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedService || selectedService.idx == null}
                  onClick={() => setActiveStep(1)}
                  sx={{
                    minWidth: 180,
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 3,
                    py: 1.2,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(74, 144, 226, 0.25)',
                    },
                  }}
                >
                  TIẾP TỤC →
                </Button>
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: { xs: 'stretch', md: 'flex-start' }, gap: 8, mt: 4, mb: 2 }}>
                {/* Chọn ngày */}
                <Box>
                  <Typography
                    fontWeight={900}
                    mb={1}
                    fontSize={22}
                    textAlign="center"
                    sx={{
                      background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Chọn ngày
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      disablePast
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 2px 8px rgba(74,144,226,0.07)',
                        background: '#fff',
                        p: 1,
                        minWidth: 320,
                      }}
                      slotProps={{
                        actionBar: { sx: { display: 'none' } },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                {/* Chọn giờ */}
                <Box>
                  <Typography
                    fontWeight={900}
                    mb={1}
                    fontSize={22}
                    textAlign="center"
                    sx={{
                      background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Chọn khung giờ
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5, minWidth: 240, justifyContent: 'center' }}>
                    {timeSlots.map(slot => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? 'contained' : 'outlined'}
                        onClick={() => setSelectedTime(slot)}
                        sx={{
                          minWidth: 120,
                          height: 54,
                          borderRadius: 50,
                          fontWeight: 800,
                          fontSize: '1.18rem',
                          px: 3,
                          py: 1.5,
                          borderWidth: 2.5,
                          borderColor: selectedTime === slot ? 'transparent' : '#e3eafc',
                          bgcolor: selectedTime === slot ? 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)' : '#fff',
                          color: selectedTime === slot ? '#fff' : '#357ae8',
                          boxShadow: selectedTime === slot ? '0 4px 16px rgba(74,144,226,0.13)' : 'none',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: selectedTime === slot ? 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)' : '#e3f0ff',
                            borderColor: '#357ae8',
                            color: '#357ae8',
                            transform: 'scale(1.05)',
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setActiveStep(0)}
                  sx={{
                    minWidth: 160,
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 3,
                    py: 1.2,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(74,144,226,0.07)',
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  ← QUAY LẠI DỊCH VỤ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setActiveStep(2)}
                  sx={{
                    minWidth: 160,
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 3,
                    py: 1.2,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(74, 144, 226, 0.25)',
                    },
                  }}
                >
                  TIẾP TỤC →
                </Button>
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setActiveStep(1)}
                  sx={{
                    minWidth: 160,
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 3,
                    py: 1.2,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(74,144,226,0.07)',
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  ← QUAY LẠI NGÀY & GIỜ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep(3)}
                  sx={{
                    minWidth: 160,
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 3,
                    py: 1.2,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(74, 144, 226, 0.25)',
                    },
                  }}
                >
                  TIẾP TỤC →
                </Button>
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
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(2)}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    minWidth: 120,
                    height: 48,
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(74,144,226,0.07)',
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  ← QUAY LẠI GHI CHÚ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 50,
                    px: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    minWidth: 160,
                    height: 48,
                    background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                    },
                  }}
                  onClick={() => {
                    if (paymentMethod === 'bank') setOpenBankDialog(true);
                    else if (paymentMethod === 'visa') setOpenVisaDialog(true);
                    else handleBookTest();
                  }}
                >
                  THANH TOÁN & HOÀN THÀNH ĐẶT LỊCH
                </Button>
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
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 50,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                  textTransform: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                  },
                }}
              >
                Về trang chủ
              </Button>
            </Box>
          )}
        </Box>
      </Container>
      {/* Dialog chi tiết xét nghiệm */}
      <GlassDialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 26, color: theme => theme.palette.primary.main, fontFamily: 'inherit' }}>
          {detailData?.name || 'Chi tiết xét nghiệm'}
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f7fafc', borderRadius: 3, p: 3 }}>
          {detailData === null ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <CircularProgress />
            </Box>
          ) : detailData.error ? (
            <Typography color="error">{detailData.error}</Typography>
          ) : (
            <>
              <Typography mb={2} color="text.secondary">{detailData.description}</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography fontWeight={700} color="primary" fontSize={18} mr={1}>{detailData.price?.toLocaleString('vi-VN')} đ</Typography>
              </Box>
              {/* Hiển thị bảng chỉ số nếu có */}
              {detailData && Array.isArray(detailData.components) && detailData.components.length > 0 && (
                <>
                  <Typography variant="h5" fontWeight={700} color="#357ae8" mb={2} mt={3}>Giá trị tham chiếu</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: '#f4f8fc' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Thành phần</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Giá trị bình thường</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Đơn vị</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailData.components.map((row, idx) => (
                          <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                            <TableCell>{row.componentName}</TableCell>
                            <TableCell>{row.normalRange}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              {detailData && Array.isArray(detailData.referenceRange) && detailData.referenceRange.length > 0 && (
                <>
                  <Typography variant="h5" fontWeight={700} color="#357ae8" mb={2} mt={3}>Giá trị tham chiếu</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: '#f4f8fc' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Thành phần</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Giá trị bình thường</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Đơn vị</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailData.referenceRange.map((row, idx) => (
                          <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.normalRange}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              {detailData?.referenceRange && !Array.isArray(detailData.referenceRange) && (
                <>
                  <Typography fontWeight={600} mb={1}>Giá trị tham chiếu:</Typography>
                  <Typography mb={2}>{detailData.referenceRange}</Typography>
                </>
              )}
              {/* Hiển thị danh sách dịch vụ nếu là gói */}
              {detailData.services && Array.isArray(detailData.services) && detailData.services.length > 0 && (
                <>
                  <Typography fontWeight={700} mt={2} mb={1} color={theme => theme.palette.primary.main}>Các dịch vụ trong gói</Typography>
                  <List dense sx={{ pl: 1 }}>
                    {detailData.services.map((svc, i) => (
                      <ListItem key={svc.id || i} sx={{ py: 0.3 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary={<Typography fontSize={15} color="text.secondary">{svc.name}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} variant="outlined" sx={{ borderRadius: 8, fontWeight: 600 }}>Đóng</Button>
        </DialogActions>
      </GlassDialog>
      {/* Dialog phụ xem chi tiết xét nghiệm lẻ: luôn hiển thị bảng chỉ số nếu có */}
      <Dialog open={subDetailOpen} onClose={() => setSubDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 22, color: theme => theme.palette.primary.main, textAlign: 'center', letterSpacing: '-1px' }}>{subDetailData?.name || 'Chi tiết xét nghiệm'}</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f7fafc', borderRadius: 3, p: 4 }}>
          {subDetailLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}><CircularProgress /></Box>
          ) : subDetailData?.error ? (
            <Typography color="error">{subDetailData.error}</Typography>
          ) : subDetailData ? (
            <>
              <Typography mb={2} color="text.secondary" textAlign="center">{subDetailData.description}</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Typography fontWeight={700} color="primary" fontSize={20} mr={1}>{subDetailData.price?.toLocaleString('vi-VN')} đ</Typography>
              </Box>
              {/* Hiển thị bảng chỉ số nếu có */}
              {Array.isArray(subDetailData.components) && subDetailData.components.length > 0 && (
                <>
                  <Typography variant="h5" fontWeight={700} color="#357ae8" mb={2} mt={3} textAlign="center">Giá trị tham chiếu</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: '#f4f8fc' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Thành phần</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Giá trị bình thường</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Đơn vị</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subDetailData.components.map((row, idx) => (
                          <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                            <TableCell>{row.componentName}</TableCell>
                            <TableCell>{row.normalRange}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              {Array.isArray(subDetailData.referenceRange) && subDetailData.referenceRange.length > 0 && (
                <>
                  <Typography variant="h5" fontWeight={700} color="#357ae8" mb={2} mt={3} textAlign="center">Giá trị tham chiếu</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: '#f4f8fc' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Thành phần</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Giá trị bình thường</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Đơn vị</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subDetailData.referenceRange.map((row, idx) => (
                          <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.normalRange}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              {subDetailData?.referenceRange && !Array.isArray(subDetailData.referenceRange) && (
                <>
                  <Typography fontWeight={600} mb={1}>Giá trị tham chiếu:</Typography>
                  <Typography mb={2}>{subDetailData.referenceRange}</Typography>
                </>
              )}
            </>
          ) : (
            <Typography color="error">Không thể tải chi tiết xét nghiệm.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubDetailOpen(false)} variant="outlined" sx={{ borderRadius: 8, fontWeight: 600 }}>Đóng</Button>
        </DialogActions>
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
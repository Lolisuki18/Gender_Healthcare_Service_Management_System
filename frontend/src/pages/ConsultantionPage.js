import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Rating,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Pagination,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { toast } from 'react-toastify';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';

// Services and Utils
import consultantService from '@/services/consultantService';
import imageUrl from '@/utils/imageUrl';
import confirmDialog from '@/utils/confirmDialog';
import localStorageUtil from '@/utils/localStorage';

// Custom styled components
// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  backgroundImage: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(1),
}));

const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const CardMediaWrapper = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
}));

const ConsultantAvatar = styled(Avatar)(({ theme }) => ({
  width: 90,
  height: 90,
  border: '4px solid #fff',
  boxShadow: '0 4px 16px rgba(74,144,226,0.10)',
  marginBottom: theme.spacing(1.5),
  background: MEDICAL_GRADIENT,
  color: '#fff',
  fontWeight: 700,
  fontSize: 36,
}));

const ConsultantName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 22,
  color: '#1976d2',
  marginBottom: theme.spacing(0.5),
  textAlign: 'center',
  background: MEDICAL_GRADIENT,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const CardInfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: theme.spacing(0.5),
  color: '#1976d2',
  fontWeight: 600,
  fontSize: 16,
  width: '100%',
}));

const CardBio = styled(Typography)(({ theme }) => ({
  color: '#757575',
  fontSize: 15,
  fontWeight: 400,
  margin: theme.spacing(1, 0, 2, 0),
  textAlign: 'left',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

const CardActionsWrapper = styled(CardActions)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  marginTop: theme.spacing(1),
  padding: 0,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
}));

// Profile Detail Dialog Styles
const AvatarSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(4),
    minWidth: 200,
  },
}));

const DetailAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

// Định nghĩa lại timeSlotOptions dùng code gốc làm value
const timeSlotOptions = [
  { value: '8-10', label: '08:00-10:00 sáng' },
  { value: '10-12', label: '10:00-12:00 trưa' },
  { value: '13-15', label: '13:00-15:00 chiều' },
  { value: '15-17', label: '15:00-17:00 chiều' },
];

const ConsultantCard = styled(Card)(({ theme }) => ({
  borderRadius: 28,
  boxShadow: '0 8px 32px rgba(74, 144, 226, 0.10)',
  background: '#fff',
  padding: theme.spacing(3, 2, 2, 2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: 420,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: '0 16px 40px rgba(74, 144, 226, 0.18)',
  },
}));

// Thêm style cho label gradient
const GradientLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 17,
  background: MEDICAL_GRADIENT,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: 2,
  marginTop: 12,
}));

const MEDICAL_GRADIENT = 'linear-gradient(45deg, #4A90E2, #1ABC9C)';
const CARD_SHADOW = '0 2px 8px rgba(74, 144, 226, 0.25)';

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: MEDICAL_GRADIENT,
  color: '#fff',
  fontWeight: 700,
  fontSize: 22,
}));

const DialogSection = styled(DialogContent)(({ theme }) => ({
  background: '#f7fafc',
}));

const DialogActionBar = styled(DialogActions)(({ theme }) => ({
  background: '#f7fafc',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 24,
  boxShadow: CARD_SHADOW,
  textTransform: 'none',
  fontSize: 16,
  padding: '8px 24px',
}));

const RatingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  gap: 4,
}));

// Map từ giá trị API sang value của timeSlotOptions
const slotValueMap = {
  '8-10': '08:00-10:00 sáng',
  '10-12': '10:00-12:00 trưa',
  '13-15': '13:00-15:00 chiều',
  '15-17': '15:00-17:00 chiều',
};

const ConsultationPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [profileConsultants, setProfileConsultants] = useState([]);

  // Dialog states
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    consultant: null,
  });
  const [appointmentDialog, setAppointmentDialog] = useState({
    open: false,
    consultant: null,
  });

  // Appointment form
  const [appointmentForm, setAppointmentForm] = useState({
    date: null,
    timeSlot: '',
    consultantId: null,
    reason: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // State cho loading và error khi fetch profile chi tiết
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // State for available slots
  const [availableSlots, setAvailableSlots] = useState([]);

  // Fetch consultants on component mount
  useEffect(() => {
    fetchConsultants();
  }, []);

  // Fetch available slots khi mở dialog hoặc đổi ngày/consultant
  useEffect(() => {
    const fetchSlots = async () => {
      if (
        appointmentDialog.open &&
        appointmentForm.date &&
        appointmentForm.consultantId
      ) {
        const formattedDate = format(appointmentForm.date, 'yyyy-MM-dd');
        const res = await consultantService.getAvailableTimeSlots(
          appointmentForm.consultantId,
          formattedDate
        );
        if (res.success && Array.isArray(res.data)) {
          // Chỉ lấy slot code gốc có available: true
          setAvailableSlots(
            res.data.filter((slot) => slot.available).map((slot) => slot.slot)
          );
        } else {
          setAvailableSlots([]);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    fetchSlots();
  }, [
    appointmentDialog.open,
    appointmentForm.date,
    appointmentForm.consultantId,
  ]);

  // Reset lại timeSlot nếu không còn hợp lệ khi availableSlots thay đổi
  useEffect(() => {
    if (
      appointmentForm.timeSlot &&
      availableSlots.length > 0 &&
      !availableSlots.includes(appointmentForm.timeSlot)
    ) {
      handleFormChange('timeSlot', '');
    }
  }, [availableSlots]);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      //Get consultants
      const consultants = await consultantService.getAllConsultants();
      if (consultants.success) {
        setConsultants(consultants.data);
      } else {
        setError(consultants.message || 'Không thể tải danh sách tư vấn viên');
      }
    } catch (err) {
      setLoading(false);
      setError('Không thể tải danh sách chuyên gia. Vui lòng thử lại sau.');
      toast.error(
        'Lỗi',
        'Không thể tải danh sách chuyên gia. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (consultant) => {
    setDetailDialog({ open: true, consultant: null });
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await consultantService.getConsultantDetails(
        consultant.userId || consultant.profileId
      );
      if (res && res.success) {
        setDetailDialog({ open: true, consultant: res.data });
      } else {
        setDetailError(res?.message || 'Không thể tải thông tin chi tiết');
      }
    } catch (err) {
      setDetailError('Không thể tải thông tin chi tiết');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailDialog({ open: false, consultant: null });
    setDetailLoading(false);
    setDetailError(null);
  };

  const handleOpenAppointment = async (consultant) => {
    // Check if user is authenticated with both userProfile and token
    const userProfile = localStorageUtil.get('userProfile');
    const token = localStorageUtil.get('token');

    if (!userProfile || !token) {
      // Show confirmation dialog with more information
      const result = await confirmDialog.info(
        'Bạn cần đăng nhập để đặt lịch hẹn với tư vấn viên. Bạn có muốn đăng nhập ngay không?',
        {
          title: 'Yêu cầu đăng nhập',
          confirmText: 'Đăng nhập',
          cancelText: 'Hủy',
        }
      );

      if (result) {
        // Redirect to login page if user confirms
        navigate('/login');
      }
      return;
    } // User is properly authenticated, proceed with appointment
    setAppointmentDialog({ open: true, consultant });
    setAppointmentForm({
      date: null,
      timeSlot: '',
      consultantId: consultant.userId,
      reason: '',
    });
  };

  const handleCloseAppointment = () => {
    setAppointmentDialog({ open: false, consultant: null });
    setFormError(null);
  };

  const handleFormChange = (field, value) => {
    setAppointmentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!appointmentForm.date) {
      setFormError('Vui lòng chọn ngày hẹn');
      return;
    }
    if (!appointmentForm.timeSlot) {
      setFormError('Vui lòng chọn khung giờ');
      return;
    }
    // Không còn validate lý do tư vấn
    setSubmitting(true);
    setFormError(null);
    try {
      // Format date to yyyy-MM-dd
      const formattedDate = format(appointmentForm.date, 'yyyy-MM-dd');
      const appointmentData = {
        consultantId: appointmentForm.consultantId,
        date: formattedDate,
        timeSlot: appointmentForm.timeSlot,
        reason: appointmentForm.reason, // vẫn gửi lên nếu có
      };
      // Gửi request đặt lịch
      const response =
        await consultantService.bookConsultation(appointmentData);
      if (response.success) {
        toast.success('Đặt lịch hẹn thành công!');
        handleCloseAppointment();
      } else {
        setFormError(response.message || 'Không thể đặt lịch hẹn');
      }
    } catch (err) {
      setFormError('Có lỗi xảy ra khi kết nối đến máy chủ');
      toast.error('Có lỗi xảy ra khi kết nối đến máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  // Mock data for development (if API is not available yet)
  const mockConsultants = [
    {
      profileId: 1,
      userId: 101,
      fullName: 'Nguyễn Thị An',
      email: 'nta@example.com',
      phone: '0901234567',
      avatar: null,
      qualifications: 'Tiến sĩ Y khoa, Chuyên khoa Sức khỏe giới tính',
      experience: '10 năm kinh nghiệm tư vấn sức khỏe giới tính',
      bio: 'Chuyên gia hàng đầu về tư vấn sức khỏe giới tính với nhiều năm kinh nghiệm làm việc tại các bệnh viện lớn.',
      gender: 'FEMALE',
      isActive: true,
      rating: 4.8,
    },
    {
      profileId: 2,
      userId: 102,
      fullName: 'Trần Văn Bình',
      email: 'tvb@example.com',
      phone: '0912345678',
      avatar: null,
      qualifications: 'Thạc sĩ Tâm lý học lâm sàng',
      experience: '8 năm kinh nghiệm tư vấn tâm lý giới tính',
      bio: 'Chuyên gia tâm lý với kinh nghiệm chuyên sâu về các vấn đề tâm lý liên quan đến giới tính và xu hướng tính dục.',
      gender: 'MALE',
      isActive: true,
      rating: 4.5,
    },
    {
      profileId: 3,
      userId: 103,
      fullName: 'Lê Thị Cúc',
      email: 'ltc@example.com',
      phone: '0923456789',
      avatar: null,
      qualifications: 'Bác sĩ Chuyên khoa II Sản phụ khoa',
      experience:
        '15 năm kinh nghiệm trong lĩnh vực sản phụ khoa và sức khỏe sinh sản',
      bio: 'Bác sĩ với nhiều năm kinh nghiệm trong lĩnh vực sức khỏe sinh sản nữ giới và các vấn đề liên quan.',
      gender: 'FEMALE',
      isActive: true,
      rating: 4.9,
    },
  ];
  return (
    <StyledContainer maxWidth="lg">
      <PageHeader>
        <GradientTitle variant="h3">Đội ngũ Chuyên viên Tư vấn</GradientTitle>
        <HeaderSubtitle variant="h6">
          Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn
          với các vấn đề sức khỏe giới tính
        </HeaderSubtitle>
        <Divider sx={{ mb: 4 }} />
      </PageHeader>{' '}
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {(consultants.length > 0 ? consultants : mockConsultants).map(
            (consultant) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={consultant.profileId || consultant.userId}
              >
                <ConsultantCard>
                  <ConsultantAvatar
                    src={
                      consultant.avatar
                        ? imageUrl.getFullImageUrl(consultant.avatar)
                        : null
                    }
                    alt={consultant.fullName}
                  >
                    {consultant.fullName[0]}
                  </ConsultantAvatar>
                  <ConsultantName>{consultant.fullName}</ConsultantName>
                  <RatingWrapper>
                    <Rating
                      value={consultant.rating || 4.5}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ color: '#FFD600' }}
                    />
                    <Typography
                      variant="body2"
                      color="#4A90E2"
                      sx={{ ml: 0.5, fontWeight: 600 }}
                    >
                      ({consultant.rating || 4.5})
                    </Typography>
                  </RatingWrapper>
                  <CardInfoRow>
                    <SchoolIcon fontSize="small" />
                    <span>{consultant.qualifications}</span>
                  </CardInfoRow>
                  <CardInfoRow>
                    <WorkHistoryIcon fontSize="small" />
                    <span>
                      {consultant.experience ? consultant.experience : '—'} kinh
                      nghiệm
                    </span>
                  </CardInfoRow>
                  <CardBio>{consultant.bio}</CardBio>
                  <CardActionsWrapper>
                    <StyledButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenDetails(consultant)}
                      startIcon={<PersonIcon />}
                      sx={{ borderRadius: 99, fontWeight: 600 }}
                    >
                      XEM CHI TIẾT
                    </StyledButton>
                    <StyledButton
                      variant="contained"
                      sx={{
                        background: MEDICAL_GRADIENT,
                        color: '#fff',
                        borderRadius: 99,
                        fontWeight: 600,
                        '&:hover': {
                          background: MEDICAL_GRADIENT,
                          opacity: 0.9,
                        },
                      }}
                      onClick={() => handleOpenAppointment(consultant)}
                      startIcon={<EventAvailableIcon />}
                    >
                      ĐẶT LỊCH HẸN
                    </StyledButton>
                  </CardActionsWrapper>
                </ConsultantCard>
              </Grid>
            )
          )}
        </Grid>
      )}{' '}
      {/* Consultant Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 32,
            boxShadow: CARD_SHADOW,
            padding: 0,
            background: '#fff',
          },
        }}
      >
        {detailLoading ? (
          <DialogContent
            sx={{
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </DialogContent>
        ) : detailError ? (
          <DialogContent>
            <Alert severity="error">{detailError}</Alert>
          </DialogContent>
        ) : (
          detailDialog.consultant && (
            <>
              <DialogHeader
                sx={{
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  fontSize: 24,
                  padding: '32px 32px 16px 32px',
                }}
              >
                Thông tin chi tiết tư vấn viên
              </DialogHeader>
              <DialogSection
                sx={{ padding: { xs: 2, md: 4 }, minWidth: { md: 700 } }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                  }}
                >
                  {/* Left: Avatar, tên, rating, giới tính, nút */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 240,
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <DetailAvatar
                      src={
                        detailDialog.consultant.avatar
                          ? imageUrl.getFullImageUrl(
                              detailDialog.consultant.avatar
                            )
                          : null
                      }
                      alt={detailDialog.consultant.fullName}
                      sx={{ width: 130, height: 130, mb: 2 }}
                    >
                      {detailDialog.consultant.fullName[0]}
                    </DetailAvatar>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#4A90E2',
                        mb: 1,
                        textAlign: 'center',
                      }}
                    >
                      {detailDialog.consultant.fullName}
                    </Typography>
                    <RatingWrapper sx={{ mb: 1 }}>
                      <Rating
                        value={detailDialog.consultant.rating || 4.5}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="#4A90E2"
                        sx={{ ml: 1, fontWeight: 600 }}
                      >
                        ({detailDialog.consultant.rating || 4.5})
                      </Typography>
                    </RatingWrapper>
                    <Chip
                      label={`Giới tính: ${detailDialog.consultant.gender === 'MALE' ? 'Nam' : 'Nữ'}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2, fontWeight: 600 }}
                    />
                    <StyledButton
                      variant="contained"
                      sx={{
                        background: MEDICAL_GRADIENT,
                        color: '#fff',
                        mt: 2,
                        fontSize: 18,
                        px: 4,
                        py: 1.5,
                        borderRadius: 99,
                        boxShadow: CARD_SHADOW,
                        '&:hover': {
                          background: MEDICAL_GRADIENT,
                          opacity: 0.9,
                        },
                      }}
                      startIcon={<EventAvailableIcon />}
                      onClick={() => {
                        handleCloseDetails();
                        handleOpenAppointment(detailDialog.consultant);
                      }}
                    >
                      ĐẶT LỊCH HẸN
                    </StyledButton>
                  </Box>
                  {/* Right: Thông tin chuyên môn, kinh nghiệm, giới thiệu */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <GradientLabel>Chuyên môn</GradientLabel>
                    <Typography
                      variant="h6"
                      sx={{ color: '#222', fontWeight: 500, mb: 1 }}
                    >
                      {detailDialog.consultant.qualifications || '—'}
                    </Typography>
                    <GradientLabel>Kinh nghiệm</GradientLabel>
                    <Typography
                      variant="h6"
                      sx={{ color: '#222', fontWeight: 500, mb: 1 }}
                    >
                      {detailDialog.consultant.experience || '—'}
                    </Typography>
                    <GradientLabel>Giới thiệu</GradientLabel>
                    <Typography
                      variant="h6"
                      sx={{ color: '#222', fontWeight: 500 }}
                    >
                      {detailDialog.consultant.bio || '—'}
                    </Typography>
                  </Box>
                </Box>
              </DialogSection>
              <DialogActionBar>
                <StyledButton
                  onClick={handleCloseDetails}
                  variant="outlined"
                  color="primary"
                >
                  ĐÓNG
                </StyledButton>
              </DialogActionBar>
            </>
          )
        )}
      </Dialog>{' '}
      {/* Appointment Dialog */}
      <Dialog
        open={appointmentDialog.open}
        onClose={submitting ? undefined : handleCloseAppointment}
        maxWidth="sm"
        fullWidth
      >
        {appointmentDialog.consultant && (
          <>
            <DialogTitle>
              <Typography variant="h6">Đặt lịch hẹn với tư vấn viên</Typography>
              <Typography variant="subtitle1" color="primary">
                {appointmentDialog.consultant.fullName}
              </Typography>
            </DialogTitle>
            <DialogContent>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Vui lòng chọn ngày và khung giờ phù hợp với bạn:
                </Typography>

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={vi}
                >
                  <DatePicker
                    label="Chọn ngày hẹn"
                    value={appointmentForm.date}
                    onChange={(date) => handleFormChange('date', date)}
                    sx={{ mb: 2, width: '100%' }}
                    minDate={new Date()} // Không cho phép chọn ngày trong quá khứ
                  />
                </LocalizationProvider>

                {availableSlots.length === 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Không còn khung giờ trống cho ngày này, vui lòng chọn ngày
                    khác.
                  </Alert>
                )}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Chọn khung giờ</InputLabel>
                  <Select
                    value={appointmentForm.timeSlot}
                    onChange={(e) =>
                      handleFormChange('timeSlot', e.target.value)
                    }
                    label="Chọn khung giờ"
                    startAdornment={
                      <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    }
                    sx={{ background: '#fff', borderRadius: 2 }}
                    disabled={availableSlots.length === 0}
                  >
                    {timeSlotOptions.map((slot) => (
                      <MenuItem
                        key={slot.value}
                        value={slot.value}
                        disabled={
                          availableSlots.length === 0 ||
                          !availableSlots.includes(slot.value)
                        }
                      >
                        {slot.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Lý do tư vấn"
                  value={appointmentForm.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  sx={{ mt: 2, background: '#fff', borderRadius: 2 }}
                  placeholder="Nhập lý do bạn muốn được tư vấn... (không bắt buộc)"
                />
              </Box>
            </DialogContent>
            <DialogActions
              sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
            >
              <Button onClick={handleCloseAppointment} disabled={submitting}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={submitting}
                startIcon={
                  submitting ? <CircularProgress size={20} /> : undefined
                }
              >
                {submitting ? 'Đang xử lý...' : 'Đặt lịch'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </StyledContainer>
  );
};

export default ConsultationPage;

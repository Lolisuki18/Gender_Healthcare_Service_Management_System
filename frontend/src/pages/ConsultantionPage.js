import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
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
  TextField,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import Pagination from '@mui/material/Pagination';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PersonIcon from '@mui/icons-material/Person';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

// Services and Utils
import consultantService from '@/services/consultantService';
import imageUrl from '@/utils/imageUrl';
import confirmDialog from '@/utils/confirmDialog';
import localStorageUtil from '@/utils/localStorage';
import reviewService from '@/services/reviewService';
import { notify } from '@/utils/notify';

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
  background: '#f5fafd',
  border: '1px solid #e0f2f1',
  borderRadius: 14,
  color: '#1976d2',
  fontSize: 15,
  fontWeight: 500,
  fontStyle: 'italic',
  margin: theme.spacing(2, 0, 2, 0),
  padding: theme.spacing(1.5, 2),
  textAlign: 'left',
  width: '100%',
  minHeight: 48,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  display: '-webkit-box',
}));

const CardActionsWrapper = styled(CardActions)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  marginTop: 'auto',
  padding: 0,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
}));

const DetailAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
  width: 340,
  height: 420,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: '0 16px 40px rgba(74, 144, 226, 0.18)',
    border: '1.5px solid #1ABC9C',
  },
}));

// Thêm box cho thông tin chuyên môn/kinh nghiệm
const InfoBox = styled(Box)(({ theme }) => ({
  background: '#f5fafd',
  border: '1px solid #e0f2f1',
  borderRadius: 14,
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1.5),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
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
  fontSize: 14,
  padding: '4px 16px',
  minWidth: 120,
  transition: 'background 0.2s, box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(26,188,156,0.12)',
    opacity: 0.95,
  },
}));

const RatingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  gap: 4,
}));

const BookingDialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 22,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: '28px 28px 12px 28px',
  textAlign: 'center',
}));

const ConsultationPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Dialog states
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    consultant: null,
  });
  const [appointmentDialog, setAppointmentDialog] = useState({
    open: false,
    consultant: null,
  });
  const [openBioDialog, setOpenBioDialog] = useState(false);
  const [selectedBio, setSelectedBio] = useState('');

  // Appointment form
  const [appointmentForm, setAppointmentForm] = useState({
    date: null,
    timeSlot: '',
    consultantId: null,
    reason: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // State cho loading và error khi fetch profile chi tiết
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // State for available slots
  const [availableSlots, setAvailableSlots] = useState([]);
  const [consultantRatings, setConsultantRatings] = useState({});
  const [detailRating, setDetailRating] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const consultantsPerPage = 6;

  // Fetch consultants on component mount
  useEffect(() => {
    fetchConsultants();
  }, []);

  // Reset về trang 1 khi danh sách consultants thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [consultants]);

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

  // Hàm kiểm tra xem có khung giờ nào có thể chọn được không
  const hasAvailableTimeSlots = () => {
    if (!appointmentForm.date) return false;

    const now = new Date();
    const selectedDate = appointmentForm.date;
    const isToday =
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    return timeSlotOptions.some((slot) => {
      // Kiểm tra xem slot có trong availableSlots không
      const isAvailable = availableSlots.includes(slot.value);

      // Kiểm tra xem có phải hôm nay và đã qua giờ không
      const endHour = parseInt(slot.value.split('-')[1], 10);
      const isPast = isToday && now.getHours() >= endHour;

      return isAvailable && !isPast;
    });
  };

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      //Get consultants
      const consultants = await consultantService.getAllConsultants();
      if (consultants.success) {
        setConsultants(consultants.data);
        // Gọi API tổng hợp đánh giá cho từng tư vấn viên
        const ratings = {};
        await Promise.all(
          consultants.data.map(async (c) => {
            try {
              const summary = await reviewService.getConsultantRatingSummary(
                c.userId
              );
              ratings[c.userId] = summary;
            } catch (e) {
              ratings[c.userId] = null;
            }
          })
        );
        setConsultantRatings(ratings);
      } else {
        setError(consultants.message || 'Không thể tải danh sách tư vấn viên');
      }
    } catch (err) {
      setLoading(false);
      setError('Không thể tải danh sách chuyên gia. Vui lòng thử lại sau.');
      // Hiển thị dialog lỗi thay vì toast
      confirmDialog
        .danger('Không thể tải danh sách chuyên gia. Vui lòng thử lại sau.', {
          title: 'Lỗi tải dữ liệu',
          confirmText: 'Thử lại',
          cancelText: 'Đóng',
        })
        .then((result) => {
          if (result) {
            fetchConsultants(); // Thử lại nếu user chọn
          }
        });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (consultant) => {
    setDetailDialog({ open: true, consultant: null });
    setDetailLoading(true);
    setDetailError(null);
    setDetailRating(null); // reset rating
    try {
      const res = await consultantService.getConsultantDetails(
        consultant.userId || consultant.profileId
      );
      if (res && res.success) {
        setDetailDialog({ open: true, consultant: res.data });
        // Gọi API tổng hợp đánh giá
        try {
          const summary = await reviewService.getConsultantRatingSummary(
            consultant.userId || consultant.profileId
          );
          setDetailRating(summary?.averageRating);
        } catch {
          setDetailRating(null);
        }
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
      notify.error('Lỗi', 'Vui lòng chọn ngày hẹn');
      return;
    }
    if (!appointmentForm.timeSlot) {
      notify.error('Lỗi', 'Vui lòng chọn khung giờ');
      return;
    }
    // Không còn validate lý do tư vấn
    setSubmitting(true);

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
      // console.log(
      //   'Response của đặt lịch tư vấn là :' +
      //     response.data +
      //     ' ' +
      //     response.message +
      //     ' ' +
      //     response.success
      // );
      if (response.success === true) {
        // Đóng modal đăng ký lịch hẹn ngay lập tức
        setAppointmentDialog({ open: false, consultant: null });

        // Reset form
        setAppointmentForm({
          date: null,
          timeSlot: '',
          consultantId: null,
          reason: '',
        });

        // Set success message
        notify.success('Thành công', 'Đặt lịch tư vấn thành công!');

        // Hiển thị dialog thành công với tùy chọn chuyển hướng
        const result = await confirmDialog.success(
          'Đặt lịch tư vấn thành công! Bạn có muốn xem danh sách lịch hẹn của mình không?',
          {
            title: 'Đặt lịch thành công',
            confirmText: 'Xem lịch hẹn',
            cancelText: 'Đóng',
          }
        );

        // Nếu user chọn xem lịch hẹn, chuyển hướng đến trang profile với tab appointments
        if (result) {
          navigate('/profile?tab=consultantions');
        }
      } else {
        // Xử lý thông báo lỗi chi tiết
        let errorMessage = response.message || 'Không thể đặt lịch hẹn';

        // Kiểm tra các loại lỗi cụ thể từ backend
        if (errorMessage.includes('đã được đặt bởi khách hàng khác')) {
          // Lỗi trùng lịch - hiển thị thông báo đặc biệt
          notify.error('Lỗi', errorMessage);
        } else if (
          errorMessage.includes('Cannot schedule consultation in the past')
        ) {
          notify.error(
            'Lỗi',
            'Không thể đặt lịch hẹn trong quá khứ. Vui lòng chọn ngày khác.'
          );
        } else if (errorMessage.includes('Invalid time slot')) {
          notify.error('Lỗi', 'Khung giờ không hợp lệ. Vui lòng chọn lại.');
        } else if (
          errorMessage.includes('consultant is currently unavailable')
        ) {
          notify.error(
            'Lỗi',
            'Tư vấn viên hiện không khả dụng. Vui lòng chọn tư vấn viên khác.'
          );
        } else if (
          errorMessage.includes('You cannot select yourself as a consultant')
        ) {
          notify.error('Lỗi', 'Bạn không thể đặt lịch với chính mình.');
        } else {
          notify.error('Lỗi', errorMessage);
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      // Hiển thị dialog lỗi thay vì toast
      await confirmDialog.danger(
        'Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.',
        {
          title: 'Lỗi kết nối',
          confirmText: 'Thử lại',
          cancelText: 'Đóng',
        }
      );
      // Set error message để user biết có lỗi xảy ra
      notify.error(
        'Lỗi',
        'Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.'
      );
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

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const allConsultants = consultants.length > 0 ? consultants : mockConsultants;
  const totalConsultants = allConsultants.length;
  const totalPages = Math.ceil(totalConsultants / consultantsPerPage);
  const displayedConsultants = allConsultants.slice(
    (currentPage - 1) * consultantsPerPage,
    currentPage * consultantsPerPage
  );

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
        <>
          <Grid
            container
            spacing={4}
            alignItems="stretch"
            justifyContent="center"
            display="flex"
            flexWrap="wrap"
            sx={{ pb: 6 }}
          >
            {' '}
            {/* justifyContent và padding dưới */}
            {displayedConsultants.map((consultant) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                key={consultant.profileId || consultant.userId}
                style={{ height: '100%' }}
              >
                <ConsultantCard>
                  <ConsultantAvatar
                    src={
                      consultant.avatar
                        ? imageUrl.getFullImageUrl(consultant.avatar)
                        : null
                    }
                    alt={consultant.fullName}
                    sx={{ mb: 2 }}
                  >
                    {consultant.fullName[0]}
                  </ConsultantAvatar>
                  <ConsultantName>{consultant.fullName}</ConsultantName>
                  <RatingWrapper>
                    <Rating
                      value={
                        consultantRatings[consultant.userId]?.averageRating > 0
                          ? consultantRatings[consultant.userId].averageRating
                          : 5
                      }
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
                      (
                      {consultantRatings[consultant.userId]?.averageRating > 0
                        ? consultantRatings[
                            consultant.userId
                          ].averageRating.toFixed(1)
                        : '5.0'}
                      )
                    </Typography>
                  </RatingWrapper>

                  <CardBio>
                    <InfoOutlinedIcon
                      sx={{ fontSize: 20, color: '#1abc9c', mt: '2px' }}
                    />
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {consultant.bio}
                    </span>
                  </CardBio>
                  {consultant.bio && consultant.bio.length > 90 && (
                    <Button
                      size="small"
                      variant="text"
                      sx={{
                        color: '#1976d2',
                        fontSize: 13,
                        fontWeight: 500,
                        ml: 4,
                        mb: 1,
                        textTransform: 'none',
                      }}
                      startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                      onClick={() => {
                        setSelectedBio(consultant.bio);
                        setOpenBioDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  )}
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
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          )}
        </>
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
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={handleCloseDetails}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
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
                        value={
                          detailRating && detailRating > 0 ? detailRating : 5
                        }
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="#4A90E2"
                        sx={{ ml: 1, fontWeight: 600 }}
                      >
                        (
                        {detailRating && detailRating > 0
                          ? detailRating.toFixed(1)
                          : '5.0'}
                        )
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
        PaperProps={{
          style: {
            borderRadius: 28,
            boxShadow: '0 8px 32px rgba(74, 144, 226, 0.10)',
            padding: 0,
            background: '#f7fafc',
          },
        }}
      >
        {appointmentDialog.consultant && (
          <>
            <BookingDialogHeader sx={{ position: 'relative' }}>
              <IconButton
                onClick={handleCloseAppointment}
                disabled={submitting}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
              Đặt lịch hẹn với tư vấn viên
              <Typography
                variant="subtitle1"
                sx={{ color: '#fff', fontWeight: 400 }}
              >
                {appointmentDialog.consultant.fullName}
              </Typography>
            </BookingDialogHeader>
            <DialogContent sx={{ p: 4 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}
              >
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
                  sx={{
                    mb: 2,
                    width: '100%',
                    borderRadius: 3,
                    background: '#fff',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontWeight: 500,
                      fontSize: 16,
                      '& fieldset': { borderColor: '#B2EBF2' },
                      '&:hover fieldset': { borderColor: '#1ABC9C' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1ABC9C',
                        boxShadow: '0 0 0 2px #B2EBF2',
                      },
                    },
                  }}
                  minDate={new Date()}
                />
              </LocalizationProvider>
              {appointmentForm.date && !hasAvailableTimeSlots() && (
                <Alert
                  severity="info"
                  sx={{ mb: 2, fontSize: 14, borderRadius: 2 }}
                >
                  Không còn khung giờ phù hợp trong ngày này, vui lòng chọn ngày
                  khác.
                </Alert>
              )}
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  borderRadius: 3,
                  background: '#fff',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontWeight: 500,
                    fontSize: 16,
                    '& fieldset': { borderColor: '#B2EBF2' },
                    '&:hover fieldset': { borderColor: '#1ABC9C' },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1ABC9C',
                      boxShadow: '0 0 0 2px #B2EBF2',
                    },
                  },
                }}
              >
                <InputLabel>Chọn khung giờ</InputLabel>
                <Select
                  value={appointmentForm.timeSlot}
                  onChange={(e) => handleFormChange('timeSlot', e.target.value)}
                  label="Chọn khung giờ"
                  startAdornment={
                    <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }
                  sx={{ borderRadius: 3, background: '#fff' }}
                  disabled={availableSlots.length === 0}
                >
                  {timeSlotOptions.map((slot) => {
                    const selectedDate = appointmentForm.date;
                    const now = new Date();
                    let isToday = false;
                    let isPast = false;
                    if (selectedDate) {
                      isToday =
                        selectedDate.getDate() === now.getDate() &&
                        selectedDate.getMonth() === now.getMonth() &&
                        selectedDate.getFullYear() === now.getFullYear();
                      if (isToday) {
                        // Lấy giờ bắt đầu và phút bắt đầu (nếu có)
                        const startHour = parseInt(
                          slot.value.split('-')[0],
                          10
                        );
                        const startMinute = 0; // Nếu có phút thì parse thêm
                        // So sánh giờ hiện tại đã qua giờ bắt đầu chưa
                        if (
                          now.getHours() > startHour ||
                          (now.getHours() === startHour &&
                            now.getMinutes() >= startMinute)
                        ) {
                          isPast = true;
                        }
                      }
                    }
                    return (
                      <MenuItem
                        key={slot.value}
                        value={slot.value}
                        disabled={
                          availableSlots.length === 0 ||
                          !availableSlots.includes(slot.value) ||
                          isPast
                        }
                      >
                        {slot.label}
                      </MenuItem>
                    );
                  })}
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
                sx={{
                  mt: 2,
                  background: '#fff',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontWeight: 500,
                    fontSize: 16,
                    '& fieldset': { borderColor: '#B2EBF2' },
                    '&:hover fieldset': { borderColor: '#1ABC9C' },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1ABC9C',
                      boxShadow: '0 0 0 2px #B2EBF2',
                    },
                  },
                }}
                placeholder="Nhập lý do bạn muốn được tư vấn... (không bắt buộc)"
              />
            </DialogContent>
            <DialogActions
              sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}
            >
              <Button
                onClick={handleCloseAppointment}
                disabled={submitting}
                variant="outlined"
                color="primary"
                sx={{ borderRadius: 99, fontWeight: 600, px: 4, py: 1.5 }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={submitting}
                startIcon={
                  submitting ? <CircularProgress size={20} /> : undefined
                }
                sx={{
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  color: '#fff',
                  borderRadius: 99,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 16px rgba(74,144,226,0.10)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                    opacity: 0.92,
                  },
                }}
              >
                {submitting ? 'Đang xử lý...' : 'Đặt lịch'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog
        open={openBioDialog}
        onClose={() => setOpenBioDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(74, 144, 226, 0.18)',
            padding: 0,
            background: '#fff',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            textAlign: 'center',
            py: 2,
            letterSpacing: 0.5,
          }}
        >
          Giới thiệu chi tiết
        </DialogTitle>
        <DialogContent
          sx={{
            p: 4,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            background: '#f5fafd',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 32, color: '#1abc9c', mt: 0.5 }} />
          <Typography
            sx={{
              fontSize: 16,
              color: '#1976d2',
              fontStyle: 'italic',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              lineHeight: 1.7,
            }}
          >
            {selectedBio}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setOpenBioDialog(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              borderRadius: 99,
              fontWeight: 600,
              px: 4,
              py: 1,
              boxShadow: '0 4px 16px rgba(74,144,226,0.10)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                opacity: 0.92,
              },
            }}
          >
            ĐÓNG
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default ConsultationPage;

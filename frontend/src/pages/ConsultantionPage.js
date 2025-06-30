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
  width: 100,
  height: 100,
  position: 'absolute',
  bottom: -40,
  left: '50%',
  transform: 'translateX(-50%)',
  border: '4px solid white',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}));

const CardContentWrapper = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(2),
}));

const ConsultantName = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const RatingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const BioText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  lineClamp: 2, // For standard compatibility
  WebkitBoxOrient: 'vertical',
}));

const CardActionsWrapper = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  display: 'flex',
  justifyContent: 'space-between',
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

const timeSlots = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
];

const ConsultantCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  borderRadius: theme.spacing(2),
  overflow: 'visible',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  position: 'relative',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  },
}));

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
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch consultants on component mount
  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      //Get consultants
      const consultants = await consultantService.getAllConsultants();
      console.log('Consultants response:', consultants);
      //Get profile of consultants
      const profileConsultant = await consultantService.getProfileConsultants();
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
    }
  };
  const handleOpenDetails = (consultant) => {
    setDetailDialog({ open: true, consultant });
  };

  const handleCloseDetails = () => {
    setDetailDialog({ open: false, consultant: null });
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

    setSubmitting(true);
    setFormError(null);

    try {
      // Format date to LocalDate (yyyy-MM-dd)
      const formattedDate = format(appointmentForm.date, 'yyyy-MM-dd');

      const appointmentData = {
        consultantId: appointmentForm.consultantId,
        date: formattedDate,
        timeSlot: appointmentForm.timeSlot,
      };

      const response =
        await consultantService.scheduleAppointment(appointmentData);

      if (response.success) {
        toast.success('Đặt lịch hẹn thành công!');
        handleCloseAppointment();
      } else {
        setFormError(response.message || 'Không thể đặt lịch hẹn');
      }
    } catch (err) {
      setFormError('Có lỗi xảy ra khi kết nối đến máy chủ');
      toast.error('Có lỗi xảy ra khi kết nối đến máy chủ');
      console.error('Error scheduling appointment:', err);
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
        <Grid container spacing={3}>
          {/* Use real data when API is available, mock data for development */}
          {(consultants.length > 0 ? consultants : mockConsultants).map(
            (consultant) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={consultant.profileId || consultant.userId}
              >
                <ConsultantCard>
                  <CardMediaWrapper
                    image="https://source.unsplash.com/random/?doctor"
                    title={consultant.fullName}
                  >
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
                  </CardMediaWrapper>

                  <CardContentWrapper>
                    <ConsultantName>
                      <Typography variant="h5" fontWeight={600}>
                        {consultant.fullName}
                      </Typography>
                      {consultant.isActive && (
                        <Chip
                          icon={<VerifiedIcon fontSize="small" />}
                          label="Xác thực"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </ConsultantName>

                    <RatingWrapper>
                      <Rating
                        value={consultant.rating || 4.5}
                        precision={0.1}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        ({consultant.rating || 4.5})
                      </Typography>
                    </RatingWrapper>

                    <DetailItem>
                      <SchoolIcon fontSize="small" />
                      <Typography variant="body2" noWrap>
                        {consultant.qualifications}
                      </Typography>
                    </DetailItem>

                    <DetailItem>
                      <WorkHistoryIcon fontSize="small" />
                      <Typography variant="body2" noWrap>
                        {consultant.experience
                          ? consultant.experience.split(' ')[0]
                          : '10'}{' '}
                        năm kinh nghiệm
                      </Typography>
                    </DetailItem>

                    <BioText variant="body2">{consultant.bio}</BioText>
                  </CardContentWrapper>

                  <Box sx={{ flexGrow: 1 }} />

                  <CardActionsWrapper>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDetails(consultant)}
                      startIcon={<PersonIcon />}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleOpenAppointment(consultant)}
                      startIcon={<EventAvailableIcon />}
                    >
                      Đặt lịch hẹn
                    </Button>
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
      >
        {detailDialog.consultant && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Thông tin chi tiết tư vấn viên
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  mb: 3,
                }}
              >
                <AvatarSection>
                  <DetailAvatar
                    src={
                      detailDialog.consultant.avatar
                        ? imageUrl.getFullImageUrl(
                            detailDialog.consultant.avatar
                          )
                        : null
                    }
                  >
                    {detailDialog.consultant.fullName[0]}
                  </DetailAvatar>

                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
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
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({detailDialog.consultant.rating || 4.5})
                    </Typography>
                  </RatingWrapper>

                  <Chip
                    label={`Giới tính: ${
                      detailDialog.consultant.gender === 'MALE' ? 'Nam' : 'Nữ'
                    }`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EventAvailableIcon />}
                    onClick={() => {
                      handleCloseDetails();
                      handleOpenAppointment(detailDialog.consultant);
                    }}
                    sx={{ mt: 2 }}
                  >
                    Đặt lịch hẹn
                  </Button>
                </AvatarSection>

                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Box>
                    <SectionTitle variant="subtitle1">Chuyên môn</SectionTitle>
                    <Typography variant="body1">
                      {detailDialog.consultant.qualifications}
                    </Typography>
                  </Box>

                  <Box>
                    <SectionTitle variant="subtitle1">Kinh nghiệm</SectionTitle>
                    <Typography variant="body1">
                      {detailDialog.consultant.experience}
                    </Typography>
                  </Box>

                  <Box>
                    <SectionTitle variant="subtitle1">Giới thiệu</SectionTitle>
                    <Typography variant="body1" paragraph>
                      {detailDialog.consultant.bio}
                    </Typography>
                  </Box>

                  <DetailItem>
                    <SchoolIcon />
                    <Typography variant="body2" color="text.secondary">
                      {detailDialog.consultant.qualifications}
                    </Typography>
                  </DetailItem>

                  <DetailItem>
                    <WorkHistoryIcon />
                    <Typography variant="body2" color="text.secondary">
                      {detailDialog.consultant.experience}
                    </Typography>
                  </DetailItem>
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Đóng</Button>
            </DialogActions>
          </>
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
                  >
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

/**
 * AppointmentsContent.js - Component quản lý lịch hẹn xét nghiệm
 *
 * Chức năng chính:
 * - Hiển thị danh sách lịch hẹn xét nghiệm của người dùng
 * - Cho phép hủy lịch hẹn đang ở trạng thái chờ xác nhận
 * - Hiển thị chi tiết thông tin lịch hẹn
 * - Phân loại trạng thái lịch hẹn bằng màu sắc
 *
 * Features:
 * - Filter theo trạng thái lịch hẹn
 * - Card-based design cho easy scanning
 * - Color-coded status chips
 * - Doctor và clinic information
 * - Date/time formatting
 *
 * Design Pattern:
 * - Grid system cho responsive layout
 * - Card components với glass morphism
 * - Status chips với conditional styling
 * - Icon integration cho visual cues
 *
 * Data Structure:
 * - appointmentData: Array của appointment objects
 * - Mỗi appointment có: id, date, time, doctor, status, location
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  formatDateDisplay,
  formatDateTime,
  formatDateTimeFromArray,
} from '../../utils/dateUtils.js';
import {
  mockGetMySTITests,
  mockCancelSTITest,
} from '../../dataDemo/mockStiData.js';
import { toast } from 'react-toastify';
import consultantService from '../../services/consultantService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.1)',
}));

const AppointmentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #FFFFFF, #F5F7FA)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: '1px solid rgba(74, 144, 226, 0.12)',
  color: '#2D3748',
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px 0 rgba(74, 144, 226, 0.2)',
  },
}));

const AppointmentsContent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await consultantService.getMyConsultations();
      if (response && response.success && response.data) {
        setAppointments(response.data);
      } else {
        toast.error(response.message || 'Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      toast.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await mockCancelSTITest(selectedAppointment.testId);
      if (response && response.data) {
        toast.success('Hủy lịch hẹn thành công');
        setOpenCancelDialog(false);
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.message || 'Không thể hủy lịch hẹn');
    }
    handleMenuClose();
  };

  const handleMenuClick = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(appointment.testId);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
    handleMenuClose();
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'linear-gradient(45deg, #4CAF50, #2ECC71)';
      case 'PENDING':
        return 'linear-gradient(45deg, #F39C12, #E67E22)';
      case 'COMPLETED':
        return 'linear-gradient(45deg, #4A90E2, #1ABC9C)';
      case 'CANCELLED':
        return 'linear-gradient(45deg, #E74C3C, #C0392B)';
      default:
        return 'linear-gradient(45deg, #607D8B, #455A64)';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <StyledPaper sx={{ p: 4, mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: '#2D3748', // Dark text for readability
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          <CalendarIcon sx={{ mr: 2, color: '#4A90E2', fontSize: 32 }} />{' '}
          {/* Medical blue */}
          Lịch hẹn của tôi
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#4A5568', // Dark blue-gray for text
            fontSize: '16px',
          }}
        >
          Quản lý và theo dõi các cuộc hẹn tư vấn của bạn
        </Typography>
      </StyledPaper>

      {/* Loading indicator - Hiển thị khi đang tải dữ liệu */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Appointments List */}
      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.testId}>
            <AppointmentCard>
              <CardContent sx={{ p: 3 }}>
                {/* Tiêu đề: Lịch hẹn tư vấn với tư vấn viên ... */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#2D3748', fontSize: '18px' }}
                  >
                    Lịch hẹn tư vấn với tư vấn viên{' '}
                    {appointment.consultantName || ''}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={getStatusText(appointment.status)}
                      size="small"
                      sx={{
                        background: getStatusColor(appointment.status),
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '11px',
                        mr: 1,
                      }}
                    />
                    {appointment.meetUrl && (
                      <Button
                        href={appointment.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="outlined"
                        sx={{
                          ml: 1,
                          fontSize: 12,
                          textTransform: 'none',
                          borderRadius: 2,
                        }}
                      >
                        Vào phòng họp
                      </Button>
                    )}
                    <IconButton
                      aria-label="more"
                      aria-controls={
                        openMenuId === appointment.testId
                          ? `long-menu-${appointment.testId}`
                          : undefined
                      }
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, appointment)}
                      size="small"
                      sx={{ color: '#718096', p: 0.5 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Thời gian bắt đầu */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CalendarIcon
                    sx={{ color: '#4CAF50', fontSize: 22, mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, minWidth: 110 }}
                  >
                    Thời gian bắt đầu:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#2D3748', fontStyle: 'normal', ml: 1 }}
                  >
                    {Array.isArray(appointment.startTime)
                      ? formatDateTimeFromArray(appointment.startTime)
                      : appointment.startTime &&
                          ![
                            'Thời gian không hợp lệ',
                            'Lỗi định dạng thời gian',
                          ].includes(formatDateTime(appointment.startTime))
                        ? formatDateTime(appointment.startTime)
                        : 'Chưa cập nhật'}
                  </Typography>
                </Box>
                {/* Thời gian kết thúc */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CalendarIcon
                    sx={{ color: '#F39C12', fontSize: 22, mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, minWidth: 110 }}
                  >
                    Thời gian kết thúc:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#2D3748', fontStyle: 'normal', ml: 1 }}
                  >
                    {Array.isArray(appointment.endTime)
                      ? formatDateTimeFromArray(appointment.endTime)
                      : appointment.endTime &&
                          ![
                            'Thời gian không hợp lệ',
                            'Lỗi định dạng thời gian',
                          ].includes(formatDateTime(appointment.endTime))
                        ? formatDateTime(appointment.endTime)
                        : 'Chưa cập nhật'}
                  </Typography>
                </Box>

                {/* Bằng cấp, kinh nghiệm */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, minWidth: 110 }}
                  >
                    Bằng cấp:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: appointment.consultantQualifications
                        ? '#2D3748'
                        : '#A0AEC0',
                      fontStyle: appointment.consultantQualifications
                        ? 'normal'
                        : 'italic',
                      ml: 1,
                    }}
                  >
                    {appointment.consultantQualifications || 'Chưa cập nhật'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, minWidth: 110 }}
                  >
                    Kinh nghiệm:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: appointment.consultantExperience
                        ? '#2D3748'
                        : '#A0AEC0',
                      fontStyle: appointment.consultantExperience
                        ? 'normal'
                        : 'italic',
                      ml: 1,
                    }}
                  >
                    {appointment.consultantExperience || 'Chưa cập nhật'}
                  </Typography>
                </Box>

                {/* Lý do tư vấn */}
                {appointment.reason && (
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, minWidth: 110 }}
                    >
                      Lý do tư vấn:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#4A5568', fontStyle: 'italic', ml: 1 }}
                    >
                      {appointment.reason}
                    </Typography>
                  </Box>
                )}

                {/* Ghi chú tư vấn viên */}
                {appointment.notes && (
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, minWidth: 110 }}
                    >
                      Ghi chú tư vấn viên:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#4A5568', fontStyle: 'italic', ml: 1 }}
                    >
                      {appointment.notes}
                    </Typography>
                  </Box>
                )}

                {/* Ngày tạo lịch hẹn */}
                {appointment.createdAt && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#A0AEC0', mt: 2, display: 'block' }}
                  >
                    Ngày tạo:{' '}
                    {Array.isArray(appointment.createdAt)
                      ? formatDateTimeFromArray(appointment.createdAt)
                      : appointment.createdAt &&
                          ![
                            'Thời gian không hợp lệ',
                            'Lỗi định dạng thời gian',
                          ].includes(formatDateTime(appointment.createdAt))
                        ? formatDateTime(appointment.createdAt)
                        : 'Chưa cập nhật'}
                  </Typography>
                )}
              </CardContent>
            </AppointmentCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {!loading && appointments.length === 0 && (
        <StyledPaper sx={{ p: 6, textAlign: 'center' }}>
          <CalendarIcon
            sx={{ fontSize: 64, color: 'rgba(74, 144, 226, 0.3)', mb: 2 }} // Light medical blue
          />
          <Typography
            variant="h5"
            sx={{
              color: '#2D3748', // Dark text for readability
              fontWeight: 600,
              mb: 1,
            }}
          >
            Chưa có lịch hẹn nào
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#4A5568', // Dark blue-gray for text
            }}
          >
            Hãy đặt lịch hẹn đầu tiên của bạn
          </Typography>
        </StyledPaper>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không
            thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Hủy</Button>
          <Button
            onClick={handleCancelAppointment}
            color="error"
            variant="contained"
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
        <DialogContent dividers>
          {selectedAppointment ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={getStatusText(selectedAppointment.status)}
                  size="small"
                  sx={{
                    background: getStatusColor(selectedAppointment.status),
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '11px',
                    mr: 2,
                  }}
                />
                {selectedAppointment.meetUrl && (
                  <Button
                    href={selectedAppointment.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: 12,
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Vào phòng họp
                  </Button>
                )}
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    minWidth: 110,
                    display: 'inline-block',
                  }}
                >
                  Tư vấn viên:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ ml: 1, display: 'inline-block' }}
                >
                  {selectedAppointment.consultantName || 'Chưa cập nhật'}
                </Typography>
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    minWidth: 110,
                    display: 'inline-block',
                  }}
                >
                  Bằng cấp:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ ml: 1, display: 'inline-block' }}
                >
                  {selectedAppointment.consultantQualifications ||
                    'Chưa cập nhật'}
                </Typography>
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    minWidth: 110,
                    display: 'inline-block',
                  }}
                >
                  Kinh nghiệm:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ ml: 1, display: 'inline-block' }}
                >
                  {selectedAppointment.consultantExperience || 'Chưa cập nhật'}
                </Typography>
              </Box>
              <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ color: '#4CAF50', fontSize: 22, mr: 1 }} />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, minWidth: 110 }}
                >
                  Thời gian:
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {selectedAppointment.startTime &&
                  !isNaN(new Date(selectedAppointment.startTime).getTime())
                    ? `${new Date(selectedAppointment.startTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}`
                    : 'Chưa cập nhật'}
                  {selectedAppointment.endTime &&
                  !isNaN(new Date(selectedAppointment.endTime).getTime())
                    ? ` - ${new Date(selectedAppointment.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                    : ''}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography>Không có thông tin chi tiết để hiển thị.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsContent;

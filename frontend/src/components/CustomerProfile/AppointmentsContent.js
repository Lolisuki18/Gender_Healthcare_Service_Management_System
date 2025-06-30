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
import { formatDateDisplay } from '../../utils/dateUtils.js';
import {
  mockGetMySTITests,
  mockCancelSTITest,
} from '../../dataDemo/mockStiData.js';
import { toast } from 'react-toastify';

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
      const response = await mockGetMySTITests();
      if (response && response.data) {
        setAppointments(response.data);
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
          Quản lý và theo dõi các cuộc hẹn xét nghiệm của bạn
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
                {/* Status Badge */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2D3748',
                      fontSize: '18px',
                    }}
                  >
                    {appointment.serviceName}
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
                      sx={{
                        color: '#718096',
                        p: 0.5,
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={`long-menu-${appointment.testId}`}
                      MenuListProps={{
                        'aria-labelledby': 'long-button',
                      }}
                      anchorEl={anchorEl}
                      open={openMenuId === appointment.testId}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          maxHeight: 48 * 4.5,
                          width: '20ch',
                          borderRadius: '12px',
                          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <MenuItem onClick={handleOpenDetailDialog}>
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Xem chi tiết</ListItemText>
                      </MenuItem>

                      {appointment.status === 'PENDING' && (
                        <MenuItem
                          onClick={() => {
                            setOpenCancelDialog(true);
                          }}
                          sx={{ color: (theme) => theme.palette.error.main }}
                        >
                          <ListItemIcon
                            sx={{ color: (theme) => theme.palette.error.main }}
                          >
                            <CancelIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Hủy lịch hẹn</ListItemText>
                        </MenuItem>
                      )}
                    </Menu>
                  </Box>
                </Box>

                {/* Doctor Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DoctorIcon sx={{ color: '#4A90E2', fontSize: 18, mr: 1 }} />{' '}
                  {/* Medical green */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568', // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {appointment.doctorName}
                  </Typography>
                </Box>

                {/* Date & Time */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon
                    sx={{ color: '#4CAF50', fontSize: 18, mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568', // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {formatDateDisplay(appointment.appointmentDate)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimeIcon sx={{ color: '#F39C12', fontSize: 18, mr: 1 }} />{' '}
                  {/* Medical orange */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568', // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {appointment.appointmentTime}
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      fontWeight: 500,
                    }}
                  >
                    Giá: {(appointment.price || 0).toLocaleString('vi-VN')} đ
                  </Typography>
                </Box>

                {/* Payment Method */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      fontWeight: 500,
                    }}
                  >
                    Phương thức thanh toán: {appointment.paymentMethod}
                  </Typography>
                </Box>

                {/* Notes */}
                {appointment.notes && (
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4A5568',
                        fontStyle: 'italic',
                      }}
                    >
                      Ghi chú: {appointment.notes}
                    </Typography>
                  </Box>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedAppointment.serviceName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái: {getStatusText(selectedAppointment.status)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <CalendarIcon
                    fontSize="small"
                    sx={{ verticalAlign: 'middle', mr: 1 }}
                  />
                  Ngày: {formatDateDisplay(selectedAppointment.appointmentDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <TimeIcon
                    fontSize="small"
                    sx={{ verticalAlign: 'middle', mr: 1 }}
                  />
                  Giờ: {selectedAppointment.appointmentTime}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <DoctorIcon
                    fontSize="small"
                    sx={{ verticalAlign: 'middle', mr: 1 }}
                  />
                  Bác sĩ: {selectedAppointment.doctorName || 'Chưa chỉ định'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Giá:{' '}
                  {(selectedAppointment.price || 0).toLocaleString('vi-VN')} đ
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Phương thức thanh toán: {selectedAppointment.paymentMethod}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Ghi chú của khách hàng:{' '}
                  {selectedAppointment.notes || 'Không có'}
                </Typography>
              </Grid>
              {selectedAppointment.consultantNotes && (
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Ghi chú của tư vấn viên:{' '}
                    {selectedAppointment.consultantNotes}
                  </Typography>
                </Grid>
              )}
            </Grid>
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

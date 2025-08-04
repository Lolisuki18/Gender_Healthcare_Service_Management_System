import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Tooltip,
} from '@mui/material';
import {
  Today as TodayIcon,
  CalendarMonth as CalendarMonthIcon,
  CalendarViewWeek as CalendarViewWeekIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Videocam as VideocamIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  PendingActions as PendingActionsIcon,
  Update as UpdateIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import viLocale from 'date-fns/locale/vi';
import consultantService from '@/services/consultantService';
import {
  formatDateDisplay,
  formatDateTime,
  formatDateTimeFromArray,
} from '@/utils/dateUtils';

import { userService } from '@/services/userService';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import confirmDialog from '@/utils/confirmDialog';
import { notify } from '../../utils/notify';

// Thêm mapping ENUM -> text tiếng Việt ở đầu file (sau import)
const STATUS_TEXT = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  CANCELED: 'Đã hủy',
  COMPLETED: 'Đã hoàn thành',
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(74, 144, 226, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  },
}));

// Gradient background for the main container
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(26, 188, 156, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(74, 144, 226, 0.05) 0%, transparent 50%)
    `,
    zIndex: -1,
  },
}));

// MedicalCard styled component
const MedicalCard = styled(Card)(({ theme, status }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafb 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(74, 144, 226, 0.1)',
  boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background:
      status === 'scheduled'
        ? 'linear-gradient(180deg, #4A90E2, #1ABC9C)'
        : status === 'completed'
          ? 'linear-gradient(180deg, #1ABC9C, #16A085)'
          : status === 'canceled'
            ? 'linear-gradient(180deg, #E74C3C, #C0392B)'
            : 'linear-gradient(180deg, #F39C12, #E67E22)',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(74, 144, 226, 0.15)',
  },
}));

// StatusChip styled component
const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: '8px',
  height: '28px',
  minWidth: '100px',
  textAlign: 'center',
  ...(status === 'scheduled' && {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    border: '1px solid #BBDEFB',
  }),
  ...(status === 'completed' && {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
    border: '1px solid #C8E6C9',
  }),
  ...(status === 'canceled' && {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
    border: '1px solid #FFCDD2',
  }),
  ...(status === 'pending' && {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
    border: '1px solid #FFE0B2',
  }),
}));

// MedicalButton styled component
const MedicalButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  ...(variant === 'contained' && {
    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
      transform: 'translateY(-1px)',
    },
  }),
  ...(variant === 'outlined' && {
    border: '2px solid #4A90E2',
    color: '#4A90E2',
    '&:hover': {
      background: 'rgba(74, 144, 226, 0.1)',
      borderColor: '#1ABC9C',
    },
  }),
}));

// MedicalTabs styled component
const MedicalTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    minHeight: '64px',
    '&.Mui-selected': {
      color: '#4A90E2',
    },
  },
}));

const MyConsultationsContent = () => {
  // State for current view
  const [viewType, setViewType] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Status update states
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: '',
  });

  // Pagination states
  const [page] = useState(0);
  const [rowsPerPage] = useState(10);
  const [consultations, setConsultations] = useState([]);

  // Thông tin chi tiết customer
  const [customerDetail, setCustomerDetail] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState('');

  // New state for editing notes
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Fetch all assigned consultations on mount
  useEffect(() => {
    const fetchAssignedConsultations = async () => {
      try {
        const res = await consultantService.getAssignedConsultations();
        if (res.success) {
          setConsultations(res.data);
          console.log('Consultations from API:', res.data); // Debug
        }
      } catch (err) {
        // handle error if needed
      }
    };
    fetchAssignedConsultations();
  }, []);

  // Thêm hàm so sánh ngày
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  // Thêm hàm so sánh tuần
  function isSameWeek(date, weekDate) {
    // weekDate là ngày bất kỳ trong tuần cần so sánh
    const d = new Date(date);
    const w = new Date(weekDate);
    // Đặt về đầu tuần (Chủ nhật)
    d.setHours(0, 0, 0, 0);
    w.setHours(0, 0, 0, 0);
    const dayOfWeek = w.getDay();
    const startOfWeek = new Date(w);
    startOfWeek.setDate(w.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return d >= startOfWeek && d <= endOfWeek;
  }
  // Thêm hàm so sánh tháng
  function isSameMonth(date, monthDate) {
    return (
      date.getFullYear() === monthDate.getFullYear() &&
      date.getMonth() === monthDate.getMonth()
    );
  }

  // Filter consultations based on selected date, view type, and tab
  const getFilteredConsultations = () => {
    let filtered = consultations;
    // Nếu viewType rỗng, không lọc theo ngày/tháng/tuần
    if (viewType === 'day') {
      filtered = filtered.filter((c) => {
        let d = c.startTime;
        if (Array.isArray(d)) {
          d = new Date(d[0], (d[1] || 1) - 1, d[2] || 1);
        } else if (typeof d === 'string') {
          d = new Date(d);
        } else {
          return false;
        }
        return isSameDay(d, selectedDate);
      });
    } else if (viewType === 'week') {
      filtered = filtered.filter((c) => {
        let d = c.startTime;
        if (Array.isArray(d)) {
          d = new Date(d[0], (d[1] || 1) - 1, d[2] || 1);
        } else if (typeof d === 'string') {
          d = new Date(d);
        } else {
          return false;
        }
        return isSameWeek(d, selectedDate);
      });
    } else if (viewType === 'month') {
      filtered = filtered.filter((c) => {
        let d = c.startTime;
        if (Array.isArray(d)) {
          d = new Date(d[0], (d[1] || 1) - 1, d[2] || 1);
        } else if (typeof d === 'string') {
          d = new Date(d);
        } else {
          return false;
        }
        return isSameMonth(d, selectedDate);
      });
    }
    // Lọc theo tabValue (trạng thái)
    switch (tabValue) {
      case 1:
        return filtered.filter((c) => c.status === 'PENDING');
      case 2:
        return filtered.filter((c) => c.status === 'CONFIRMED');
      case 3:
        return filtered.filter((c) => c.status === 'COMPLETED');
      case 4:
        return filtered.filter((c) => c.status === 'CANCELED');
      default:
        return filtered;
    }
  };

  // Handle view type change
  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle open details dialog
  const handleOpenDetailsDialog = async (consultation) => {
    setSelectedConsultation(consultation);
    setDetailsDialogOpen(true);
    setCustomerDetail(null);
    setCustomerError('');
    if (consultation.customerId) {
      setCustomerLoading(true);
      try {
        const res = await userService.getUserById(consultation.customerId);
        if (res.success && res.data) {
          setCustomerDetail(res.data);
        } else {
          setCustomerError(res.message || 'Không thể lấy thông tin khách hàng');
        }
      } catch (err) {
        setCustomerError(err.message || 'Không thể lấy thông tin khách hàng');
      } finally {
        setCustomerLoading(false);
      }
    }
  };

  // Handle close details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Handle update consultation status
  const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'];
  const handleUpdateStatus = async (consultationId, newStatus, notesCheck) => {
    const statusEnum =
      typeof newStatus === 'string' ? newStatus.toUpperCase() : '';
    if (!VALID_STATUSES.includes(statusEnum)) {
      notify.error(
        'Lỗi',
        `Trạng thái gửi lên không hợp lệ! (Chỉ chấp nhận: ${VALID_STATUSES.join(', ')})`
      );
      setUpdateStatus({ loading: false, success: false, error: '' });
      return;
    }
    // Nếu là hoàn thành mà chưa có ghi chú thì không cho hoàn thành
    if (statusEnum === 'COMPLETED') {
      // notesCheck là ghi chú hiện tại (notesValue nếu đang edit, hoặc consultation.notes)
      if (!notesCheck || notesCheck.trim() === '') {
        notify.error('Lỗi', 'Vui lòng nhập ghi chú trước khi hoàn thành!');
        setUpdateStatus({ loading: false, success: false, error: '' });
        return;
      }
    }
    setUpdateStatus({ loading: true, success: false, error: '' });
    try {
      let noteReason = '';
      if (statusEnum === 'CANCELED') {
        noteReason = await confirmDialog.cancelWithReason(
          'Bạn có chắc chắn muốn huỷ lịch tư vấn này?'
        );
        if (!noteReason) {
          setUpdateStatus({ loading: false, success: false, error: '' });
          return;
        }
      }
      const res = await consultantService.updateConsultationStatus(
        consultationId,
        { status: statusEnum }
      );
      console.log('API response:', res); // Debug log
      if (res.success) {
        // Nếu huỷ và có lý do, lưu vào notes
        if (statusEnum === 'CANCELED' && noteReason) {
          await consultantService.updateConsultationNotes(
            consultationId,
            noteReason
          );
        }
        setConsultations((prev) =>
          prev.map((c) =>
            c.consultationId === consultationId || c.id === consultationId
              ? {
                  ...c,
                  status: statusEnum,
                  meetUrl: res.data?.meetUrl || c.meetUrl,
                  notes: statusEnum === 'CANCELED' ? noteReason : c.notes,
                }
              : c
          )
        );
        notify.success('Thành công', 'Cập nhật trạng thái thành công!');
        setUpdateStatus({ loading: false, success: true, error: '' });
        setTimeout(
          () => setUpdateStatus((prev) => ({ ...prev, success: false })),
          2000
        );
      } else {
        // Dịch lỗi phổ biến sang tiếng Việt
        let errorMsg = res.message || 'Có lỗi xảy ra';
        if (
          errorMsg ===
          'Consultation cannot be marked as completed before its end time'
        ) {
          errorMsg =
            'Không thể đánh dấu hoàn thành trước khi kết thúc buổi tư vấn';
        }
        notify.error('Lỗi', errorMsg);
        setUpdateStatus({ loading: false, success: false, error: '' });
      }
    } catch (err) {
      console.log('API error:', err); // Debug log
      let errorMsg = 'Có lỗi xảy ra khi cập nhật trạng thái';
      if (
        err?.response?.data?.message ===
        'Consultation cannot be marked as completed before its end time'
      ) {
        errorMsg =
          'Không thể đánh dấu hoàn thành trước khi kết thúc buổi tư vấn';
      }
      notify.error('Lỗi', errorMsg);
      setUpdateStatus({ loading: false, success: false, error: '' });
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get title for current view
  const getViewTitle = () => {
    if (viewType === 'day') {
      return `Lịch tư vấn ngày: ${formatDate(selectedDate)}`;
    } else if (viewType === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `Lịch tư vấn tuần: ${new Date(startOfWeek).toLocaleDateString(
        'vi-VN'
      )} - ${new Date(endOfWeek).toLocaleDateString('vi-VN')}`;
    } else {
      return `Lịch tư vấn tháng: ${new Date(selectedDate).toLocaleDateString(
        'vi-VN',
        { month: 'long', year: 'numeric' }
      )}`;
    }
  };

  const filteredConsultations = getFilteredConsultations();
  const paginatedConsultations = filteredConsultations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  //Redender the component
  return (
    <GradientBackground>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        {' '}
        <StyledPaper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <MedicalButton
                variant={viewType === 'day' ? 'contained' : 'outlined'}
                startIcon={<TodayIcon />}
                onClick={() => handleViewTypeChange('day')}
              >
                Ngày
              </MedicalButton>
              <MedicalButton
                variant={viewType === 'week' ? 'contained' : 'outlined'}
                startIcon={<CalendarViewWeekIcon />}
                onClick={() => handleViewTypeChange('week')}
              >
                Tuần
              </MedicalButton>
              <MedicalButton
                variant={viewType === 'month' ? 'contained' : 'outlined'}
                startIcon={<CalendarMonthIcon />}
                onClick={() => handleViewTypeChange('month')}
              >
                Tháng
              </MedicalButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={viLocale}
              >
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="Chọn ngày"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {/* Nút xoá bộ lọc */}
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAltIcon />}
                onClick={() => {
                  setViewType(''); // Không lọc theo ngày/tuần/tháng
                }}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 600,
                  height: '40px',
                  whiteSpace: 'nowrap',
                  fontSize: '1rem',
                  borderColor: '#4A90E2',
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#1976d2',
                    background: 'rgba(74, 144, 226, 0.08)',
                  },
                }}
              >
                Xoá bộ lọc
              </Button>
            </Box>
          </Box>
        </StyledPaper>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              mb: 1,
            }}
          >
            {getViewTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng quan về lịch tư vấn và trạng thái hiện tại
          </Typography>
        </Box>
        <StyledPaper elevation={0} sx={{ mb: 3 }}>
          <MedicalTabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
          >
            <Tab
              label={`Tất cả (${consultations.length})`}
              icon={<EventIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Chờ xác nhận (${
                consultations.filter((c) => c.status === 'PENDING').length
              })`}
              icon={<PendingActionsIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đã đặt lịch (${
                consultations.filter((c) => c.status === 'CONFIRMED').length
              })`}
              icon={<EventAvailableIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đã hoàn thành (${
                consultations.filter((c) => c.status === 'COMPLETED').length
              })`}
              icon={<CheckIcon />}
              iconPosition="start"
            />{' '}
            <Tab
              label={`Đã hủy (${
                consultations.filter((c) => c.status === 'CANCELED').length
              })`}
              icon={<CloseIcon />}
              iconPosition="start"
            />
          </MedicalTabs>
        </StyledPaper>{' '}
        <StyledPaper elevation={0} sx={{ p: 4, borderRadius: '20px' }}>
          {filteredConsultations.length > 0 ? (
            // Table view thay cho card view
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '16px',
                mb: 3,
                boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background:
                        'linear-gradient(90deg, #fafdff 60%, #e3f0fa 100%)',
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: '1.05rem',
                      }}
                    >
                      Khách hàng
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: '1.05rem',
                      }}
                    >
                      Thời gian
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: '1.05rem',
                      }}
                    >
                      Phương thức
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: '1.05rem',
                      }}
                    >
                      Lý do tư vấn
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: '1.05rem',
                      }}
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: '1.05rem',
                        textAlign: 'center',
                      }}
                    >
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedConsultations.map((slot) => (
                    <TableRow
                      key={slot.id}
                      hover
                      sx={{
                        background: '#fff',
                        '&:hover': { background: '#e3f0fa' },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Avatar
                            alt={slot.customerName}
                            src={slot.customerAvatar}
                            sx={{ width: 40, height: 40, mr: 1 }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {slot.customerName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {slot.customerEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {Array.isArray(slot.startTime)
                            ? formatDateTimeFromArray(slot.startTime)
                            : formatDateTime(slot.startTime)}
                          {' - '}
                          {Array.isArray(slot.endTime)
                            ? formatDateTimeFromArray(slot.endTime)
                            : formatDateTime(slot.endTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Array.isArray(slot.date)
                            ? formatDateTimeFromArray(slot.date)
                            : formatDateDisplay(slot.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            slot.type === 'video'
                              ? 'Video'
                              : slot.type === 'chat'
                                ? 'Chat'
                                : 'Trực Tuyến'
                          }
                          size="small"
                          sx={{
                            backgroundColor: '#F0F7FF',
                            color: '#1976D2',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: '28px',
                            border: '1px solid #BBDEFB',
                            borderRadius: '8px',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {slot.status === 'CANCELED'
                            ? slot.notes
                              ? slot.notes
                              : slot.reason
                                ? slot.reason
                                : 'Không có lý do huỷ'
                            : slot.reason || 'Không có lý do tư vấn'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {/* Status chip */}
                        {(() => {
                          switch (slot.status) {
                            case 'PENDING':
                              return (
                                <StatusChip
                                  label={STATUS_TEXT[slot.status]}
                                  size="small"
                                  status={slot.status}
                                  icon={<PendingActionsIcon fontSize="small" />}
                                />
                              );
                            case 'CONFIRMED':
                              return (
                                <StatusChip
                                  label={STATUS_TEXT[slot.status]}
                                  size="small"
                                  status={slot.status}
                                  icon={<EventAvailableIcon fontSize="small" />}
                                />
                              );
                            case 'CANCELED':
                              return (
                                <StatusChip
                                  label={STATUS_TEXT[slot.status]}
                                  size="small"
                                  status={slot.status}
                                  icon={<CloseIcon fontSize="small" />}
                                />
                              );
                            case 'COMPLETED':
                              return (
                                <StatusChip
                                  label={STATUS_TEXT[slot.status]}
                                  size="small"
                                  status={slot.status}
                                  icon={<CheckIcon fontSize="small" />}
                                />
                              );
                            default:
                              return (
                                <Chip
                                  label="Không xác định"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#F5F5F5',
                                    color: '#757575',
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    height: '28px',
                                    border: '1px solid #E0E0E0',
                                  }}
                                />
                              );
                          }
                        })()}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {/* Hành động */}
                        {slot.status === 'PENDING' && (
                          <>
                            <Tooltip title="Xác nhận lịch tư vấn">
                              <span>
                                <IconButton
                                  sx={{ color: '#2e7d32' }}
                                  onClick={async () => {
                                    const confirmed = await confirmDialog.show({
                                      title: 'Xác nhận lịch tư vấn',
                                      message:
                                        'Bạn có chắc chắn muốn xác nhận lịch tư vấn này?',
                                      confirmText: 'Xác nhận',
                                      cancelText: 'Hủy',
                                      type: 'info',
                                    });
                                    if (confirmed) {
                                      handleUpdateStatus(
                                        slot.consultationId || slot.id,
                                        'CONFIRMED'
                                      );
                                    }
                                  }}
                                  disabled={updateStatus.loading}
                                >
                                  <EventAvailableIcon
                                    sx={{ color: '#2e7d32' }}
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Huỷ lịch tư vấn">
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      slot.consultationId || slot.id,
                                      'CANCELED'
                                    )
                                  }
                                  disabled={updateStatus.loading}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </>
                        )}
                        {slot.status === 'CONFIRMED' && (
                          <Tooltip title="Đánh dấu hoàn thành">
                            <span>
                              <IconButton
                                color="success"
                                onClick={async () => {
                                  try {
                                    await handleUpdateStatus(
                                      slot.consultationId || slot.id,
                                      'COMPLETED',
                                      slot.notes
                                    );
                                  } catch (err) {
                                    if (
                                      err?.response?.data?.message ===
                                      'Consultation cannot be marked as completed before its end time'
                                    ) {
                                      notify.error(
                                        'Không thể hoàn thành',
                                        'Không thể đánh dấu hoàn thành trước khi kết thúc buổi tư vấn.'
                                      );
                                    } else {
                                      notify.error(
                                        'Lỗi',
                                        'Có lỗi xảy ra khi đánh dấu hoàn thành.'
                                      );
                                    }
                                  }
                                }}
                                disabled={updateStatus.loading}
                                sx={{ color: '#2e7d32' }}
                              >
                                <CheckIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        <Tooltip title="Xem chi tiết">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDetailsDialog(slot)}
                              sx={{ color: '#4A90E2' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {slot.status === 'CONFIRMED' &&
                          (Array.isArray(slot.meetUrl)
                            ? slot.meetUrl.length > 0
                            : slot.meetUrl || slot.meetLink) && (
                            <Tooltip title="Tham gia Google Meet">
                              <span>
                                <IconButton
                                  color="primary"
                                  component="a"
                                  href={slot.meetUrl || slot.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ color: '#1ABC9C', mr: 1 }}
                                >
                                  <VideocamIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                background:
                  'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)',
                borderRadius: '16px',
                border: '2px dashed rgba(74, 144, 226, 0.2)',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  mb: 3,
                  boxShadow: '0 8px 25px rgba(74, 144, 226, 0.3)',
                }}
              >
                <CalendarMonthIcon
                  sx={{
                    fontSize: 40,
                    color: '#fff',
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Không có lịch tư vấn nào
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '400px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Chưa có lịch tư vấn nào trong khoảng thời gian đã chọn. Hãy kiểm
                tra lại hoặc chọn khoảng thời gian khác.
              </Typography>
            </Box>
          )}
        </StyledPaper>{' '}
        {/* Chi tiết lịch tư vấn Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafb 100%)',
              boxShadow: '0 20px 60px rgba(74, 144, 226, 0.15)',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              py: 3,
            }}
          >
            <EventIcon />
            Chi tiết lịch tư vấn sức khỏe
          </DialogTitle>{' '}
          <DialogContent dividers sx={{ p: 4, background: '#fafbfc' }}>
            {selectedConsultation && (
              <Grid container spacing={4}>
                <Grid
                  container
                  spacing={3}
                  sx={{
                    mb: 3,
                    alignItems: 'stretch',
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <MedicalCard
                      variant="outlined"
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 2px 12px 0 rgba(32,40,45,0.07)',
                        minHeight: 220,
                        px: 4,
                        py: 3,
                        bgcolor: '#fff',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <CardContent sx={{ p: 0, width: '100%', height: '100%' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#2c3e50',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              background:
                                'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                              width: 24,
                              height: 24,
                              fontSize: '0.75rem',
                            }}
                          >
                            👤
                          </Avatar>
                          Thông tin bệnh nhân
                        </Typography>
                        {customerLoading ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: 120,
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        ) : customerError ? (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {customerError}
                          </Alert>
                        ) : customerDetail ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Avatar
                              src={
                                customerDetail.avatar ||
                                selectedConsultation.customerAvatar
                              }
                              alt={
                                customerDetail.fullName ||
                                selectedConsultation.customerName
                              }
                              sx={{
                                width: 72,
                                height: 72,
                                mr: 2,
                                border: '2px solid #4A90E2',
                              }}
                            />
                            <Box>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  color: '#1976D2',
                                  mb: 0.5,
                                }}
                              >
                                {customerDetail.fullName ||
                                  selectedConsultation.customerName}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 0.5,
                                }}
                              >
                                <EmailIcon
                                  fontSize="small"
                                  sx={{ color: '#4A90E2' }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {customerDetail.email ||
                                    selectedConsultation.customerEmail}
                                </Typography>
                              </Box>
                              {customerDetail.phone && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <PhoneIcon
                                    fontSize="small"
                                    sx={{ color: '#4A90E2' }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {customerDetail.phone}
                                  </Typography>
                                </Box>
                              )}
                              {customerDetail.gender && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <WcIcon
                                    fontSize="small"
                                    sx={{ color: '#4A90E2' }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {customerDetail.gender || 'Không xác định'}
                                  </Typography>
                                </Box>
                              )}
                              {customerDetail.dateOfBirth && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <CakeIcon
                                    fontSize="small"
                                    sx={{ color: '#4A90E2' }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {new Date(
                                      customerDetail.dateOfBirth
                                    ).toLocaleDateString('vi-VN')}
                                  </Typography>
                                </Box>
                              )}
                              {customerDetail.address && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <HomeIcon
                                    fontSize="small"
                                    sx={{ color: '#4A90E2' }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {customerDetail.address}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        ) : (
                          // Fallback nếu không có thông tin chi tiết
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Avatar
                              src={selectedConsultation.customerAvatar}
                              alt={selectedConsultation.customerName}
                              sx={{ width: 64, height: 64, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6">
                                {selectedConsultation.customerName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Email: {selectedConsultation.customerEmail}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Điện thoại: {selectedConsultation.customerPhone}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </MedicalCard>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MedicalCard
                      variant="outlined"
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 2px 12px 0 rgba(32,40,45,0.07)',
                        minHeight: 220,
                        px: 4,
                        py: 3,
                        bgcolor: '#fff',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <CardContent sx={{ p: 0, width: '100%', height: '100%' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#2c3e50',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              background:
                                'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                              width: 24,
                              height: 24,
                              fontSize: '0.75rem',
                            }}
                          >
                            📅
                          </Avatar>
                          Thông tin buổi tư vấn
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CalendarMonthIcon
                              fontSize="small"
                              color="action"
                            />
                            <Typography variant="body2">
                              <strong>Ngày khởi tạo:</strong>{' '}
                              {(() => {
                                const createdVal =
                                  selectedConsultation.createdAt;
                                if (
                                  Array.isArray(createdVal) &&
                                  createdVal.length > 0
                                ) {
                                  return formatDateTimeFromArray(createdVal);
                                } else if (createdVal) {
                                  return formatDateDisplay(createdVal);
                                }
                                // fallback cũ
                                const dateVal = selectedConsultation.date;
                                if (
                                  Array.isArray(dateVal) &&
                                  dateVal.length > 0
                                ) {
                                  return formatDateTimeFromArray(dateVal);
                                } else if (dateVal) {
                                  return formatDateDisplay(dateVal);
                                } else if (selectedConsultation.startTime) {
                                  if (
                                    Array.isArray(
                                      selectedConsultation.startTime
                                    )
                                  ) {
                                    const [y, m, d] =
                                      selectedConsultation.startTime;
                                    if (y && m && d) {
                                      return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
                                    }
                                  } else if (
                                    typeof selectedConsultation.startTime ===
                                    'string'
                                  ) {
                                    const dateObj = new Date(
                                      selectedConsultation.startTime
                                    );
                                    if (!isNaN(dateObj)) {
                                      return dateObj.toLocaleDateString(
                                        'vi-VN'
                                      );
                                    }
                                  }
                                }
                                return 'Chưa cập nhật';
                              })()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <TodayIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Thời gian:</strong>{' '}
                              {Array.isArray(selectedConsultation.startTime)
                                ? formatDateTimeFromArray(
                                    selectedConsultation.startTime
                                  )
                                : formatDateTime(
                                    selectedConsultation.startTime
                                  )}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Phương thức:</strong>{' '}
                              {selectedConsultation.type === 'video'
                                ? 'Tư vấn qua video'
                                : selectedConsultation.type === 'chat'
                                  ? 'Tư vấn qua chat'
                                  : 'Tư vấn trực tuyến'}
                            </Typography>
                          </Box>{' '}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <UpdateIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Trạng thái:</strong>{' '}
                              {selectedConsultation.status === 'CONFIRMED'
                                ? 'Đã đặt lịch'
                                : selectedConsultation.status === 'COMPLETED'
                                  ? 'Đã hoàn thành'
                                  : selectedConsultation.status === 'CANCELED'
                                    ? 'Đã hủy'
                                    : 'Đang chờ xác nhận'}
                            </Typography>
                          </Box>
                          {selectedConsultation.status === 'CANCELED' &&
                            selectedConsultation.notes && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mt: 1,
                                }}
                              >
                                <CloseIcon
                                  fontSize="small"
                                  sx={{ color: '#e53935' }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ color: '#e53935', fontWeight: 600 }}
                                >
                                  Lý do huỷ của chuyên gia:{' '}
                                  {selectedConsultation.notes}
                                </Typography>
                              </Box>
                            )}
                          {/* Hiển thị Google Meet link cho tư vấn video */}
                          {selectedConsultation.type === 'video' &&
                            (selectedConsultation.meetUrl ||
                              selectedConsultation.meetLink) && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mt: 2,
                                  p: 2,
                                  bgcolor: 'rgba(26, 188, 156, 0.1)',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(26, 188, 156, 0.2)',
                                }}
                              >
                                <VideocamIcon
                                  fontSize="small"
                                  sx={{ color: '#1ABC9C' }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1ABC9C',
                                      mb: 0.5,
                                    }}
                                  >
                                    Link tham gia video call:
                                  </Typography>
                                  <MedicalButton
                                    variant="contained"
                                    size="small"
                                    href={
                                      selectedConsultation.meetUrl ||
                                      selectedConsultation.meetLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      background:
                                        'linear-gradient(45deg, #1ABC9C, #16A085)',
                                      fontSize: '0.8rem',
                                      padding: '6px 16px',
                                      '&:hover': {
                                        background:
                                          'linear-gradient(45deg, #16A085, #148F77)',
                                      },
                                    }}
                                    startIcon={
                                      <VideocamIcon fontSize="small" />
                                    }
                                  >
                                    Tham gia Google Meet
                                  </MedicalButton>
                                </Box>
                              </Box>
                            )}
                        </Box>
                      </CardContent>
                    </MedicalCard>
                  </Grid>
                </Grid>
                <Grid item size={12} xs={12} md={12}>
                  <MedicalCard variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            background:
                              'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                            width: 24,
                            height: 24,
                            fontSize: '0.75rem',
                          }}
                        >
                          📋
                        </Avatar>
                        Nội dung buổi tư vấn
                      </Typography>
                      {/* Lý do tư vấn hoặc lý do huỷ */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          mb: 2,
                          p: 2,
                          bgcolor: '#f8fafb',
                          borderRadius: 2,
                          border: '1px solid #e3eaf5',
                        }}
                      >
                        <EventIcon sx={{ color: '#4A90E2', mt: 0.5 }} />
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ mb: 0.5 }}
                          >
                            {selectedConsultation.status === 'CANCELED'
                              ? selectedConsultation.notes
                                ? 'Lý do chuyên gia huỷ:'
                                : selectedConsultation.reason
                                  ? 'Lý do bạn huỷ:'
                                  : 'Lý do huỷ:'
                              : 'Lý do tư vấn:'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedConsultation.status === 'CANCELED'
                              ? selectedConsultation.notes
                                ? selectedConsultation.notes
                                : selectedConsultation.reason
                                  ? selectedConsultation.reason
                                  : 'Không có lý do huỷ'
                              : selectedConsultation.reason ||
                                'Không có lý do tư vấn'}
                          </Typography>
                        </Box>
                      </Box>
                      {/* Ghi chú */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 1,
                          width: '100%',
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          display="inline"
                        >
                          Ghi chú:
                        </Typography>
                        {selectedConsultation &&
                          (editingNotes ? (
                            <>
                              <TextField
                                size="small"
                                value={notesValue}
                                onChange={(e) => setNotesValue(e.target.value)}
                                sx={{
                                  minWidth: 260,
                                  borderRadius: 2,
                                  bgcolor: '#f8fafb',
                                  flex: 1,
                                }}
                                multiline
                                maxRows={4}
                                placeholder="Nhập ghi chú..."
                              />
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => setConfirmDialogOpen(true)}
                                sx={{ ml: 1, borderRadius: 2 }}
                                disabled={
                                  notesValue ===
                                  (selectedConsultation.notes || '')
                                }
                              >
                                Lưu
                              </Button>
                              <Button
                                size="small"
                                onClick={() => setEditingNotes(false)}
                                sx={{ ml: 1, borderRadius: 2 }}
                              >
                                Hủy
                              </Button>
                              {/* Dialog xác nhận lưu ghi chú */}
                              <Dialog
                                open={confirmDialogOpen}
                                onClose={() => setConfirmDialogOpen(false)}
                              >
                                <DialogTitle>
                                  Xác nhận cập nhật ghi chú
                                </DialogTitle>
                                <DialogContent>
                                  Bạn có chắc chắn muốn lưu thay đổi ghi chú cho
                                  buổi tư vấn này?
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() => setConfirmDialogOpen(false)}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    variant="contained"
                                    onClick={async () => {
                                      setConfirmDialogOpen(false);
                                      const res =
                                        await consultantService.updateConsultationNotes(
                                          selectedConsultation.id ||
                                            selectedConsultation.consultationId,
                                          notesValue
                                        );
                                      if (res.success) {
                                        notify.success(
                                          'Thành công',
                                          'Cập nhật ghi chú thành công!'
                                        );
                                        setSelectedConsultation((prev) => ({
                                          ...prev,
                                          notes: notesValue,
                                        }));
                                        setEditingNotes(false);
                                      } else {
                                        notify.error(
                                          'Lỗi',
                                          res.message ||
                                            'Cập nhật ghi chú thất bại'
                                        );
                                      }
                                    }}
                                  >
                                    Xác nhận
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </>
                          ) : (
                            <>
                              <Typography
                                variant="body2"
                                display="inline"
                                sx={{ ml: 1, flex: 1 }}
                              >
                                {selectedConsultation.notes
                                  ? selectedConsultation.notes
                                  : 'Không có ghi chú'}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setNotesValue(
                                    selectedConsultation.notes || ''
                                  );
                                  setEditingNotes(true);
                                }}
                                sx={{
                                  ml: 1,
                                  color: '#1976D2',
                                  bgcolor: '#e3f2fd',
                                  borderRadius: 2,
                                  '&:hover': { bgcolor: '#bbdefb' },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </>
                          ))}
                      </Box>
                    </CardContent>
                  </MedicalCard>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, background: '#fff', gap: 2 }}>
            <MedicalButton
              variant="outlined"
              onClick={handleCloseDetailsDialog}
            >
              Đóng
            </MedicalButton>{' '}
            {selectedConsultation &&
              selectedConsultation.status === 'PENDING' && (
                <MedicalButton
                  variant="contained"
                  onClick={async () => {
                    const confirmed = await confirmDialog.show({
                      title: 'Xác nhận lịch tư vấn',
                      message:
                        'Bạn có chắc chắn muốn xác nhận lịch tư vấn này?',
                      confirmText: 'Xác nhận',
                      cancelText: 'Hủy',
                      type: 'info',
                    });
                    if (confirmed) {
                      await handleUpdateStatus(
                        selectedConsultation.id ||
                          selectedConsultation.consultationId,
                        'CONFIRMED'
                      );
                      setDetailsDialogOpen(false);
                    }
                  }}
                  disabled={updateStatus.loading}
                  startIcon={
                    updateStatus.loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <EventAvailableIcon />
                    )
                  }
                >
                  {updateStatus.loading
                    ? 'Đang xử lý...'
                    : 'Xác nhận lịch tư vấn'}
                </MedicalButton>
              )}
            {selectedConsultation &&
              selectedConsultation.status === 'CONFIRMED' && (
                <MedicalButton
                  variant="contained"
                  onClick={async () => {
                    try {
                      await handleUpdateStatus(
                        selectedConsultation.id ||
                          selectedConsultation.consultationId,
                        'COMPLETED',
                        selectedConsultation.notes
                      );
                      setDetailsDialogOpen(false);
                    } catch (err) {
                      if (
                        err?.response?.data?.message ===
                        'Consultation cannot be marked as completed before its end time'
                      ) {
                        notify.error(
                          'Không thể hoàn thành',
                          'Không thể đánh dấu hoàn thành trước khi kết thúc buổi tư vấn.'
                        );
                      } else {
                        notify.error(
                          'Lỗi',
                          'Có lỗi xảy ra khi đánh dấu hoàn thành.'
                        );
                      }
                    }
                  }}
                  disabled={updateStatus.loading}
                  startIcon={
                    updateStatus.loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CheckIcon />
                    )
                  }
                >
                  {updateStatus.loading
                    ? 'Đang xử lý...'
                    : 'Đánh dấu hoàn thành'}
                </MedicalButton>
              )}
            {selectedConsultation &&
              (selectedConsultation.status === 'PENDING' ||
                selectedConsultation.status === 'CONFIRMED') && (
                <MedicalButton
                  variant="outlined"
                  sx={{
                    borderColor: '#E74C3C',
                    color: '#E74C3C',
                    '&:hover': {
                      background: 'rgba(231, 76, 60, 0.1)',
                      borderColor: '#C0392B',
                    },
                  }}
                  onClick={async () => {
                    await handleUpdateStatus(
                      selectedConsultation.id ||
                        selectedConsultation.consultationId,
                      'CANCELED'
                    );
                    setDetailsDialogOpen(false);
                  }}
                  disabled={updateStatus.loading}
                  startIcon={
                    updateStatus.loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloseIcon />
                    )
                  }
                >
                  {updateStatus.loading ? 'Đang xử lý...' : 'Hủy lịch tư vấn'}
                </MedicalButton>
              )}
          </DialogActions>
        </Dialog>
      </Box>
    </GradientBackground>
  );
  //end render component
};

export default MyConsultationsContent;

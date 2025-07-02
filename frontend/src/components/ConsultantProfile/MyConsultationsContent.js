/**
 * MyConsultationsContent.js - Component để hiển thị và quản lý lịch tư vấn của chuyên gia
 *
 * Features:
 * - Xem lịch tư vấn theo ngày, tuần, tháng
 * - Quản lý trạng thái lịch tư vấn
 * - Chi tiết lịch tư vấn
 * - Thay đổi trạng thái lịch tư vấn
 */

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
  Menu,
  MenuItem,
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
  Divider,
  TablePagination,
} from '@mui/material';
import {
  Today as TodayIcon,
  CalendarMonth as CalendarMonthIcon,
  CalendarViewWeek as CalendarViewWeekIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  PendingActions as PendingActionsIcon,
  Update as UpdateIcon,
  Edit as EditIcon,
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
import { toast } from 'react-toastify';
import { userService } from '@/services/userService';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';

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

// Component để hiển thị slot thời gian
const TimeSlot = ({
  slot,
  onViewDetails,
  onUpdateConsultationStatus,
  updateStatus,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    handleClose();
    onViewDetails(slot);
  };

  const consultationId = slot.consultationId || slot.id;

  const handleUpdateStatusClick = (status) => {
    handleClose();
    if (typeof onUpdateConsultationStatus !== 'function') {
      console.warn(
        'onUpdateConsultationStatus prop is not a function!',
        onUpdateConsultationStatus
      );
      return;
    }
    if (typeof consultationId !== 'number' || typeof status !== 'string') {
      console.warn(
        'handleUpdateStatusClick: consultationId or status is invalid',
        consultationId,
        status
      );
      return;
    }
    onUpdateConsultationStatus(consultationId, status);
  };

  // Hàm lấy icon theo phương thức tư vấn
  const getConsultationTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideocamIcon fontSize="small" />;
      case 'chat':
        return <ChatIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  // Hàm lấy chip status
  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <StatusChip
            label={STATUS_TEXT[status]}
            size="small"
            status={status}
            icon={<PendingActionsIcon fontSize="small" />}
          />
        );
      case 'CONFIRMED':
        return (
          <StatusChip
            label={STATUS_TEXT[status]}
            size="small"
            status={status}
            icon={<EventAvailableIcon fontSize="small" />}
          />
        );
      case 'CANCELED':
        return (
          <StatusChip
            label={STATUS_TEXT[status]}
            size="small"
            status={status}
            icon={<CloseIcon fontSize="small" />}
          />
        );
      case 'COMPLETED':
        return (
          <StatusChip
            label={STATUS_TEXT[status]}
            size="small"
            status={status}
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
  };

  return (
    <MedicalCard
      variant="outlined"
      sx={{
        mb: 3,
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
      status={slot.status}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Grid container alignItems="flex-start" spacing={3}>
          {/* Cột 1: Thông tin khách hàng */}
          <Grid item xs={12} md={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                alt={slot.customerName}
                src={slot.customerAvatar}
                sx={{
                  width: 50,
                  height: 50,
                  mr: 2,
                  border: '2px solid rgba(74, 144, 226, 0.2)',
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#2c3e50',
                    mb: 0.5,
                  }}
                >
                  {slot.customerName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  {slot.customerEmail}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Cột 2: Thời gian */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#2c3e50',
                    mb: 0.5,
                  }}
                >
                  {Array.isArray(slot.startTime)
                    ? formatDateTimeFromArray(slot.startTime)
                    : formatDateTime(slot.startTime)}{' '}
                  -{' '}
                  {Array.isArray(slot.endTime)
                    ? formatDateTimeFromArray(slot.endTime)
                    : formatDateTime(slot.endTime)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  {Array.isArray(slot.date)
                    ? formatDateTimeFromArray(slot.date)
                    : formatDateDisplay(slot.date)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Cột 3: Lý do tư vấn và phương thức */}
          <Grid item xs={12} md={3.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                flexDirection: 'column',
              }}
            >
              {/* Status và Type chips */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label={
                    slot.type === 'video'
                      ? 'Video'
                      : slot.type === 'chat'
                        ? 'Chat'
                        : 'Trực tiếp'
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
                    '& .MuiChip-icon': {
                      color: '#1976D2',
                    },
                  }}
                  icon={getConsultationTypeIcon(slot.type)}
                />
                {getStatusChip(slot.status)}
              </Box>

              {/* Lý do tư vấn */}
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Lý do tư vấn:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2c3e50',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {slot.reason}
                </Typography>
              </Box>

              {/* Thông tin bổ sung */}
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    mb: 0.5,
                  }}
                >
                  Thời gian tạo:{' '}
                  {Array.isArray(slot.createdAt)
                    ? formatDateTimeFromArray(slot.createdAt)
                    : formatDateDisplay(slot.createdAt)}
                </Typography>
                {slot.customerPhone && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    SĐT: {slot.customerPhone}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Cột 4: Actions và Meet Link */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              textAlign: { xs: 'left', md: 'right' },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Action buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                }}
              >
                {slot.status === 'PENDING' && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleUpdateStatusClick('CONFIRMED')}
                      disabled={updateStatus.loading}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      {updateStatus.loading ? 'Đang xác nhận...' : 'Xác nhận'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleUpdateStatusClick('CANCELED')}
                      disabled={updateStatus.loading}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      {updateStatus.loading ? 'Đang xử lý...' : 'Huỷ'}
                    </Button>
                  </>
                )}
                {slot.status === 'CONFIRMED' && (
                  <>
                    {(slot.meetUrl || slot.meetLink) && (
                      <Button
                        size="small"
                        variant="contained"
                        href={slot.meetUrl || slot.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          minWidth: 'auto',
                          background:
                            'linear-gradient(45deg, #1ABC9C, #16A085)',
                          color: '#fff',
                          borderRadius: '6px',
                          '&:hover': {
                            background:
                              'linear-gradient(45deg, #16A085, #148F77)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(26, 188, 156, 0.3)',
                          },
                        }}
                        startIcon={<VideocamIcon fontSize="small" />}
                      >
                        Join Meet
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleUpdateStatusClick('COMPLETED')}
                      disabled={updateStatus.loading}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      {updateStatus.loading
                        ? 'Đang hoàn thành...'
                        : 'Hoàn thành'}
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleViewDetails}
                  sx={{
                    borderColor: '#4A90E2',
                    color: '#4A90E2',
                    fontWeight: 600,
                    borderRadius: '8px',
                    padding: '8px 20px',
                    minWidth: '100px',
                    '&:hover': {
                      background: 'rgba(74, 144, 226, 0.1)',
                      borderColor: '#1ABC9C',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)',
                    },
                  }}
                >
                  Chi tiết
                </Button>
                <IconButton
                  size="medium"
                  onClick={handleClick}
                  sx={{
                    border: '1px solid rgba(74, 144, 226, 0.2)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    color: '#4A90E2',
                    '&:hover': {
                      background: 'rgba(74, 144, 226, 0.1)',
                      borderColor: '#1ABC9C',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Hiển thị feedback cho completed consultations */}
              {slot.status === 'COMPLETED' && slot.rating && (
                <Box
                  sx={{
                    textAlign: { xs: 'left', md: 'right' },
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Đánh giá:
                  </Typography>
                  <Chip
                    label={`${slot.rating}/5 ⭐`}
                    size="small"
                    sx={{
                      backgroundColor: '#FFF3E0',
                      color: '#F57C00',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: '24px',
                      border: '1px solid #FFE0B2',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(74, 144, 226, 0.15)',
            border: '1px solid rgba(74, 144, 226, 0.1)',
            minWidth: '220px',
          },
        }}
      >
        <MenuItem
          onClick={handleViewDetails}
          sx={{
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(74, 144, 226, 0.08)',
            },
          }}
        >
          <EventIcon fontSize="small" sx={{ mr: 1.5, color: '#4A90E2' }} />
          Xem chi tiết
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {slot.status === 'PENDING' && (
          <MenuItem
            onClick={() => handleUpdateStatusClick('CONFIRMED')}
            sx={{
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#1ABC9C',
              '&:hover': {
                background: 'rgba(26, 188, 156, 0.08)',
              },
            }}
          >
            <EventAvailableIcon fontSize="small" sx={{ mr: 1.5 }} />
            Xác nhận lịch tư vấn
          </MenuItem>
        )}
        {slot.status === 'CONFIRMED' && (
          <MenuItem
            onClick={() => handleUpdateStatusClick('COMPLETED')}
            sx={{
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#1ABC9C',
              '&:hover': {
                background: 'rgba(26, 188, 156, 0.08)',
              },
            }}
          >
            <CheckIcon fontSize="small" sx={{ mr: 1.5 }} />
            Đánh dấu đã hoàn thành
          </MenuItem>
        )}
        {(slot.status === 'PENDING' || slot.status === 'CONFIRMED') && (
          <MenuItem
            onClick={() => handleUpdateStatusClick('CANCELED')}
            sx={{
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#E74C3C',
              '&:hover': {
                background: 'rgba(231, 76, 60, 0.08)',
              },
            }}
          >
            <CloseIcon fontSize="small" sx={{ mr: 1.5 }} />
            Hủy lịch tư vấn
          </MenuItem>
        )}
      </Menu>
    </MedicalCard>
  );
};

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // Filter consultations based on selected date and view type
  const getFilteredConsultations = () => {
    switch (tabValue) {
      case 1:
        return consultations.filter((c) => c.status === 'PENDING');
      case 2:
        return consultations.filter((c) => c.status === 'CONFIRMED');
      case 3:
        return consultations.filter((c) => c.status === 'COMPLETED');
      case 4:
        return consultations.filter((c) => c.status === 'CANCELED');
      default:
        return consultations;
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
  const handleUpdateStatus = async (consultationId, newStatus) => {
    const statusEnum =
      typeof newStatus === 'string' ? newStatus.toUpperCase() : '';
    if (!VALID_STATUSES.includes(statusEnum)) {
      toast.error(
        `Trạng thái gửi lên không hợp lệ! (Chỉ chấp nhận: ${VALID_STATUSES.join(', ')})`
      );
      setUpdateStatus({ loading: false, success: false, error: '' });
      return;
    }
    setUpdateStatus({ loading: true, success: false, error: '' });
    try {
      const res = await consultantService.updateConsultationStatus(
        consultationId,
        { status: statusEnum }
      );
      console.log('API response:', res); // Debug log
      if (res.success) {
        setConsultations((prev) =>
          prev.map((c) =>
            c.consultationId === consultationId || c.id === consultationId
              ? {
                  ...c,
                  status: statusEnum,
                  meetUrl: res.data?.meetUrl || c.meetUrl,
                }
              : c
          )
        );
        toast.success('Cập nhật trạng thái thành công!');
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
        toast.error(errorMsg);
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
      toast.error(errorMsg);
      setUpdateStatus({ loading: false, success: false, error: '' });
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  return (
    <GradientBackground>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Lịch tư vấn của tôi
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Quản lý và theo dõi lịch tư vấn chuyên nghiệp - Chăm sóc sức khỏe
            tận tâm
          </Typography>
        </Box>{' '}
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
            <>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#2c3e50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <EventIcon color="primary" />
                  Danh sách lịch tư vấn ({filteredConsultations.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quản lý các buổi tư vấn sức khỏe của bạn
                </Typography>
              </Box>
              {paginatedConsultations.map((consultation) => (
                <TimeSlot
                  key={consultation.id}
                  slot={consultation}
                  onViewDetails={handleOpenDetailsDialog}
                  onUpdateConsultationStatus={handleUpdateStatus}
                  updateStatus={updateStatus}
                />
              ))}{' '}
              <TablePagination
                component="div"
                count={filteredConsultations.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Hiển thị:"
                sx={{
                  borderTop: '1px solid rgba(74, 144, 226, 0.1)',
                  mt: 3,
                  pt: 2,
                  '& .MuiTablePagination-toolbar': {
                    background: 'rgba(74, 144, 226, 0.02)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
                    {
                      fontWeight: 500,
                      color: '#2c3e50',
                    },
                }}
              />
            </>
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
                              <strong>Ngày:</strong>{' '}
                              {Array.isArray(selectedConsultation.date)
                                ? formatDateTimeFromArray(
                                    selectedConsultation.date
                                  )
                                : formatDateDisplay(selectedConsultation.date)}
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
                      {/* Lý do tư vấn */}
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
                            Lý do tư vấn:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedConsultation?.reason
                              ? selectedConsultation.reason
                              : 'Không có lý do tư vấn'}
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
                                        toast.success(
                                          'Cập nhật ghi chú thành công!'
                                        );
                                        setSelectedConsultation((prev) => ({
                                          ...prev,
                                          notes: notesValue,
                                        }));
                                        setEditingNotes(false);
                                      } else {
                                        toast.error(
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
                    await handleUpdateStatus(
                      selectedConsultation.id ||
                        selectedConsultation.consultationId,
                      'CONFIRMED'
                    );
                    setDetailsDialogOpen(false);
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
                    await handleUpdateStatus(
                      selectedConsultation.id ||
                        selectedConsultation.consultationId,
                      'COMPLETED'
                    );
                    setDetailsDialogOpen(false);
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
};

export default MyConsultationsContent;

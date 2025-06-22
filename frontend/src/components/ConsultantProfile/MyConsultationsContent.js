/**
 * MyConsultationsContent.js - Component để hiển thị và quản lý lịch tư vấn của chuyên gia
 *
 * Features:
 * - Xem lịch tư vấn theo ngày, tuần, tháng
 * - Quản lý trạng thái lịch tư vấn
 * - Chi tiết lịch tư vấn
 * - Thay đổi trạng thái lịch tư vấn
 */

import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import viLocale from 'date-fns/locale/vi';

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
const TimeSlot = ({ slot, onViewDetails, onUpdateStatus }) => {
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

  const handleUpdateStatus = (status) => {
    handleClose();
    onUpdateStatus(slot.id, status);
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
      case 'scheduled':
        return (
          <StatusChip
            label="Đã đặt lịch"
            size="small"
            status={status}
            icon={<EventAvailableIcon fontSize="small" />}
          />
        );
      case 'completed':
        return (
          <StatusChip
            label="Đã hoàn thành"
            size="small"
            status={status}
            icon={<CheckIcon fontSize="small" />}
          />
        );
      case 'canceled':
        return (
          <StatusChip
            label="Đã hủy"
            size="small"
            status={status}
            icon={<CloseIcon fontSize="small" />}
          />
        );
      case 'pending':
        return (
          <StatusChip
            label="Chờ xác nhận"
            size="small"
            status={status}
            icon={<PendingActionsIcon fontSize="small" />}
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
                  {new Date(slot.startTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(slot.endTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  {new Date(slot.date).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
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
                  {new Date(slot.createdAt).toLocaleDateString('vi-VN')}
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

              {/* Google Meet link cho video consultation */}
              {slot.type === 'video' && slot.meetLink && (
                <Box
                  sx={{
                    textAlign: { xs: 'left', md: 'right' },
                    width: '100%',
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
                    Link tư vấn:
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    href={slot.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      minWidth: 'auto',
                      background: 'linear-gradient(45deg, #1ABC9C, #16A085)',
                      color: '#fff',
                      borderRadius: '6px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #16A085, #148F77)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(26, 188, 156, 0.3)',
                      },
                    }}
                    startIcon={<VideocamIcon fontSize="small" />}
                  >
                    Join Meet
                  </Button>
                </Box>
              )}

              {/* Hiển thị feedback cho completed consultations */}
              {slot.status === 'completed' && slot.rating && (
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
        {slot.status === 'pending' && (
          <MenuItem
            onClick={() => handleUpdateStatus('scheduled')}
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
        {slot.status === 'scheduled' && (
          <MenuItem
            onClick={() => handleUpdateStatus('completed')}
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
        {(slot.status === 'scheduled' || slot.status === 'pending') && (
          <MenuItem
            onClick={() => handleUpdateStatus('canceled')}
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
  const [rowsPerPage, setRowsPerPage] = useState(10); // Mock data - replace with API call
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Thị Hoa',
      customerEmail: 'nguyenthihoa@example.com',
      customerPhone: '0934567890',
      customerAvatar: '/images/avatars/avatar1.jpg',
      date: '2025-06-22T00:00:00',
      startTime: '2025-06-22T09:00:00',
      endTime: '2025-06-22T10:00:00',
      type: 'video',
      status: 'scheduled',
      notes:
        'Khách hàng muốn tư vấn về cách phòng tránh STI và các biện pháp an toàn tình dục.',
      reason: 'Tư vấn phòng tránh STI',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      createdAt: '2025-06-20T14:30:00',
    },
    {
      id: 2,
      customerName: 'Trần Văn Minh',
      customerEmail: 'tranvanminh@example.com',
      customerPhone: '0912345678',
      customerAvatar: '/images/avatars/avatar2.jpg',
      date: '2025-06-22T00:00:00',
      startTime: '2025-06-22T13:30:00',
      endTime: '2025-06-22T14:30:00',
      type: 'chat',
      status: 'pending',
      notes:
        'Khách hàng cần tư vấn về các biện pháp xét nghiệm STI và kết quả xét nghiệm gần đây.',
      reason: 'Tư vấn xét nghiệm STI',
      createdAt: '2025-06-21T10:15:00',
    },
    {
      id: 3,
      customerName: 'Lê Thị Mai',
      customerEmail: 'lethimai@example.com',
      customerPhone: '0978123456',
      customerAvatar: '/images/avatars/avatar3.jpg',
      date: '2025-06-23T00:00:00',
      startTime: '2025-06-23T10:00:00',
      endTime: '2025-06-23T11:00:00',
      type: 'video',
      status: 'scheduled',
      notes:
        'Khách hàng cần tư vấn về kết quả xét nghiệm và hướng dẫn điều trị.',
      reason: 'Tư vấn kết quả xét nghiệm STI',
      meetLink: 'https://meet.google.com/xyz-mnop-qrs',
      createdAt: '2025-06-20T09:45:00',
    },
    {
      id: 4,
      customerName: 'Phạm Văn Hoàng',
      customerEmail: 'phamvanhoang@example.com',
      customerPhone: '0936789012',
      customerAvatar: '/images/avatars/avatar4.jpg',
      date: '2025-06-21T00:00:00',
      startTime: '2025-06-21T15:00:00',
      endTime: '2025-06-21T16:00:00',
      type: 'chat',
      status: 'completed',
      notes:
        'Đã tư vấn về các biện pháp phòng ngừa và điều trị STI, hướng dẫn sử dụng thuốc.',
      reason: 'Tư vấn phòng ngừa và điều trị STI',
      feedback:
        'Rất hài lòng với buổi tư vấn, chuyên gia giải thích rất rõ ràng và chi tiết. Cảm ơn bác sĩ đã tận tình tư vấn.',
      rating: 5,
      createdAt: '2025-06-19T08:30:00',
    },
    {
      id: 5,
      customerName: 'Vũ Thị Hương',
      customerEmail: 'vuthihuong@example.com',
      customerPhone: '0945678901',
      customerAvatar: '/images/avatars/avatar5.jpg',
      date: '2025-06-21T00:00:00',
      startTime: '2025-06-21T11:30:00',
      endTime: '2025-06-21T12:30:00',
      type: 'video',
      status: 'canceled',
      notes: 'Khách hàng hủy do lịch trình cá nhân thay đổi.',
      reason: 'Tư vấn về các biểu hiện của STI',
      meetLink: 'https://meet.google.com/tuv-wxyz-abc',
      cancelReason: 'Có việc đột xuất, sẽ đặt lại sau',
      createdAt: '2025-06-19T14:20:00',
    },
    {
      id: 6,
      customerName: 'Đặng Thanh Tùng',
      customerEmail: 'dangthanhtung@example.com',
      customerPhone: '0967890123',
      customerAvatar: '/images/avatars/avatar6.jpg',
      date: '2025-06-24T00:00:00',
      startTime: '2025-06-24T14:00:00',
      endTime: '2025-06-24T15:00:00',
      type: 'video',
      status: 'scheduled',
      notes: 'Tư vấn về các phương pháp kiểm tra sức khỏe sinh sản định kỳ.',
      reason: 'Tư vấn sức khỏe sinh sản',
      meetLink: 'https://meet.google.com/def-ghij-klm',
      createdAt: '2025-06-22T11:00:00',
    },
    {
      id: 7,
      customerName: 'Ngô Thị Lan',
      customerEmail: 'ngothilan@example.com',
      customerPhone: '0956781234',
      customerAvatar: '/images/avatars/avatar7.jpg',
      date: '2025-06-25T00:00:00',
      startTime: '2025-06-25T08:30:00',
      endTime: '2025-06-25T09:30:00',
      type: 'chat',
      status: 'pending',
      notes: 'Cần tư vấn về các vấn đề sức khỏe tình dục và hướng dẫn an toàn.',
      reason: 'Tư vấn sức khỏe tình dục',
      createdAt: '2025-06-22T16:45:00',
    },
    {
      id: 8,
      customerName: 'Hoàng Văn Đức',
      customerEmail: 'hoangvanduc@example.com',
      customerPhone: '0943218765',
      customerAvatar: '/images/avatars/avatar8.jpg',
      date: '2025-06-20T00:00:00',
      startTime: '2025-06-20T16:00:00',
      endTime: '2025-06-20T17:00:00',
      type: 'video',
      status: 'completed',
      notes: 'Đã tư vấn về kết quả xét nghiệm và hướng dẫn điều trị phù hợp.',
      reason: 'Tư vấn kết quả xét nghiệm HIV',
      meetLink: 'https://meet.google.com/nop-qrst-uvw',
      feedback:
        'Bác sĩ rất chuyên nghiệp và chu đáo. Tôi cảm thấy an tâm hơn sau buổi tư vấn.',
      rating: 5,
      createdAt: '2025-06-18T13:20:00',
    },
    {
      id: 9,
      customerName: 'Bùi Thị Thu',
      customerEmail: 'buithithu@example.com',
      customerPhone: '0932165487',
      customerAvatar: '/images/avatars/avatar9.jpg',
      date: '2025-06-26T00:00:00',
      startTime: '2025-06-26T15:30:00',
      endTime: '2025-06-26T16:30:00',
      type: 'chat',
      status: 'scheduled',
      notes:
        'Tư vấn về các biện pháp kiểm soát sinh sản và lựa chọn phương pháp phù hợp.',
      reason: 'Tư vấn kiểm soát sinh sản',
      createdAt: '2025-06-21T14:10:00',
    },
    {
      id: 10,
      customerName: 'Võ Minh Quân',
      customerEmail: 'vominhquan@example.com',
      customerPhone: '0918472635',
      customerAvatar: '/images/avatars/avatar10.jpg',
      date: '2025-06-19T00:00:00',
      startTime: '2025-06-19T10:30:00',
      endTime: '2025-06-19T11:30:00',
      type: 'video',
      status: 'completed',
      notes:
        'Đã tư vấn về các yếu tố nguy cơ và cách phòng tránh lây nhiễm STI.',
      reason: 'Tư vấn phòng tránh lây nhiễm STI',
      meetLink: 'https://meet.google.com/xyz-abcd-efg',
      feedback:
        'Buổi tư vấn rất bổ ích, tôi đã hiểu rõ hơn về cách bảo vệ bản thân.',
      rating: 4,
      createdAt: '2025-06-17T09:15:00',
    },
    {
      id: 11,
      customerName: 'Trương Thị Oanh',
      customerEmail: 'truongthioanh@example.com',
      customerPhone: '0912876543',
      customerAvatar: '/images/avatars/avatar11.jpg',
      date: '2025-06-27T00:00:00',
      startTime: '2025-06-27T09:30:00',
      endTime: '2025-06-27T10:30:00',
      type: 'video',
      status: 'scheduled',
      notes: 'Tư vấn về các biện pháp phòng tránh HIV và an toàn tình dục.',
      reason: 'Tư vấn phòng tránh HIV',
      meetLink: 'https://meet.google.com/hij-klmn-opq',
      createdAt: '2025-06-23T10:20:00',
    },
    {
      id: 12,
      customerName: 'Đinh Hoàng Nam',
      customerEmail: 'dinhhoangnam@example.com',
      customerPhone: '0923456789',
      customerAvatar: '/images/avatars/avatar12.jpg',
      date: '2025-06-28T00:00:00',
      startTime: '2025-06-28T14:30:00',
      endTime: '2025-06-28T15:30:00',
      type: 'chat',
      status: 'pending',
      notes:
        'Khách hàng cần tư vấn về vấn đề rối loạn hormone và ảnh hưởng đến sức khỏe sinh sản.',
      reason: 'Tư vấn rối loạn hormone',
      createdAt: '2025-06-24T08:45:00',
    },
    {
      id: 13,
      customerName: 'Phan Thị Ngọc',
      customerEmail: 'phanthingoc@example.com',
      customerPhone: '0934567890',
      customerAvatar: '/images/avatars/avatar13.jpg',
      date: '2025-06-29T00:00:00',
      startTime: '2025-06-29T11:00:00',
      endTime: '2025-06-29T12:00:00',
      type: 'video',
      status: 'scheduled',
      notes:
        'Tư vấn về vấn đề kinh nguyệt không đều và các triệu chứng liên quan.',
      reason: 'Tư vấn rối loạn kinh nguyệt',
      meetLink: 'https://meet.google.com/rst-uvwx-yzab',
      createdAt: '2025-06-24T15:30:00',
    },
    {
      id: 14,
      customerName: 'Lý Văn Thắng',
      customerEmail: 'lyvanghang@example.com',
      customerPhone: '0945678901',
      customerAvatar: '/images/avatars/avatar14.jpg',
      date: '2025-06-18T00:00:00',
      startTime: '2025-06-18T13:00:00',
      endTime: '2025-06-18T14:00:00',
      type: 'video',
      status: 'completed',
      notes:
        'Đã tư vấn về kết quả xét nghiệm và hướng dẫn điều trị bệnh lây qua đường tình dục.',
      reason: 'Tư vấn điều trị STD',
      meetLink: 'https://meet.google.com/cde-fghi-jklm',
      feedback:
        'Tôi rất hài lòng với chất lượng tư vấn. Bác sĩ giải thích rất chi tiết và dễ hiểu.',
      rating: 5,
      createdAt: '2025-06-16T11:40:00',
    },
    {
      id: 15,
      customerName: 'Nguyễn Thu Hà',
      customerEmail: 'nguyenthuha@example.com',
      customerPhone: '0956789012',
      customerAvatar: '/images/avatars/avatar15.jpg',
      date: '2025-06-30T00:00:00',
      startTime: '2025-06-30T16:00:00',
      endTime: '2025-06-30T17:00:00',
      type: 'chat',
      status: 'scheduled',
      notes: 'Tư vấn về các phương pháp tránh thai an toàn và hiệu quả.',
      reason: 'Tư vấn phương pháp tránh thai',
      createdAt: '2025-06-25T09:15:00',
    },
    {
      id: 11,
      customerName: 'Trần Thị Nga',
      customerEmail: 'tranthinga@example.com',
      customerPhone: '0925374681',
      customerAvatar: '/images/avatars/avatar11.jpg',
      date: '2025-06-27T00:00:00',
      startTime: '2025-06-27T09:15:00',
      endTime: '2025-06-27T10:15:00',
      type: 'video',
      status: 'pending',
      notes:
        'Khách hàng cần tư vấn về các triệu chứng bất thường và cần kiểm tra.',
      reason: 'Tư vấn triệu chứng sức khỏe sinh sản',
      createdAt: '2025-06-22T10:30:00',
    },
    {
      id: 12,
      customerName: 'Lý Văn Hải',
      customerEmail: 'lyvanhai@example.com',
      customerPhone: '0914736258',
      customerAvatar: '/images/avatars/avatar12.jpg',
      date: '2025-06-28T00:00:00',
      startTime: '2025-06-28T13:00:00',
      endTime: '2025-06-28T14:00:00',
      type: 'chat',
      status: 'scheduled',
      notes:
        'Tư vấn về các biện pháp điều trị và theo dõi sau khi phát hiện nhiễm STI.',
      reason: 'Tư vấn điều trị và theo dõi STI',
      createdAt: '2025-06-21T15:45:00',
    },
  ]);

  // Fetch consultations on component mount - will be replaced with API call
  // React.useEffect(() => {
  //   const fetchConsultations = async () => {
  //     try {
  //       const data = await consultantService.getConsultations();
  //       setConsultations(data);
  //     } catch (error) {
  //       console.error("Error fetching consultations:", error);
  //     }
  //   };
  //   fetchConsultations();
  // }, []);

  // Filter consultations based on selected date and view type
  const getFilteredConsultations = () => {
    // Filter by tab/status
    let statusFiltered;
    if (tabValue === 0) {
      // Tất cả
      statusFiltered = consultations;
    } else if (tabValue === 1) {
      // Chờ xác nhận
      statusFiltered = consultations.filter((c) => c.status === 'pending');
    } else if (tabValue === 2) {
      // Đã đặt lịch
      statusFiltered = consultations.filter((c) => c.status === 'scheduled');
    } else if (tabValue === 3) {
      // Đã hoàn thành
      statusFiltered = consultations.filter((c) => c.status === 'completed');
    } else {
      // Đã hủy
      statusFiltered = consultations.filter((c) => c.status === 'canceled');
    }

    // Filter by date
    const filteredByDate = statusFiltered.filter((consultation) => {
      const consultDate = new Date(consultation.date);

      if (viewType === 'day') {
        // Same day
        return (
          consultDate.getFullYear() === selectedDate.getFullYear() &&
          consultDate.getMonth() === selectedDate.getMonth() &&
          consultDate.getDate() === selectedDate.getDate()
        );
      } else if (viewType === 'week') {
        // Same week
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return consultDate >= startOfWeek && consultDate <= endOfWeek;
      } else {
        // Same month
        return (
          consultDate.getFullYear() === selectedDate.getFullYear() &&
          consultDate.getMonth() === selectedDate.getMonth()
        );
      }
    });

    return filteredByDate;
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
  const handleOpenDetailsDialog = (consultation) => {
    setSelectedConsultation(consultation);
    setDetailsDialogOpen(true);
  };

  // Handle close details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Handle update consultation status
  const handleUpdateStatus = async (consultationId, newStatus) => {
    setUpdateStatus({
      loading: true,
      success: false,
      error: '',
    });

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update status in local state
      setConsultations((prevConsultations) =>
        prevConsultations.map((c) =>
          c.id === consultationId ? { ...c, status: newStatus } : c
        )
      );

      // Update selected consultation if dialog is open
      if (selectedConsultation && selectedConsultation.id === consultationId) {
        setSelectedConsultation({
          ...selectedConsultation,
          status: newStatus,
        });
      }

      // Show success message
      setUpdateStatus({
        loading: false,
        success: true,
        error: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus((prev) => ({
          ...prev,
          success: false,
        }));
      }, 3000);

      // API call would be uncommented when back-end is ready
      /*
      await consultantService.updateConsultationStatus(consultationId, {
        status: newStatus
      });
      */
    } catch (error) {
      console.error('Error updating consultation status:', error);
      setUpdateStatus({
        loading: false,
        success: false,
        error: 'Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại sau.',
      });
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
        {updateStatus.success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(26, 188, 156, 0.15)',
            }}
          >
            Cập nhật trạng thái thành công!
          </Alert>
        )}
        {updateStatus.error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(231, 76, 60, 0.15)',
            }}
          >
            {updateStatus.error}
          </Alert>
        )}
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
                consultations.filter((c) => c.status === 'pending').length
              })`}
              icon={<PendingActionsIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đã đặt lịch (${
                consultations.filter((c) => c.status === 'scheduled').length
              })`}
              icon={<EventAvailableIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Đã hoàn thành (${
                consultations.filter((c) => c.status === 'completed').length
              })`}
              icon={<CheckIcon />}
              iconPosition="start"
            />{' '}
            <Tab
              label={`Đã hủy (${
                consultations.filter((c) => c.status === 'canceled').length
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
                  onUpdateStatus={handleUpdateStatus}
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
                <Grid item xs={12} md={6}>
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
                          👤
                        </Avatar>
                        Thông tin bệnh nhân
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
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
                          <Typography variant="body2" color="text.secondary">
                            Email: {selectedConsultation.customerEmail}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Điện thoại: {selectedConsultation.customerPhone}
                          </Typography>{' '}
                        </Box>
                      </Box>
                    </CardContent>
                  </MedicalCard>
                </Grid>

                <Grid item xs={12} md={6}>
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
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Ngày:</strong>{' '}
                            {formatDate(selectedConsultation.date)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <TodayIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Thời gian:</strong>{' '}
                            {new Date(
                              selectedConsultation.startTime
                            ).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(
                              selectedConsultation.endTime
                            ).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <EventIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Phương thức:</strong>{' '}
                            {selectedConsultation.type === 'video'
                              ? 'Tư vấn qua video'
                              : selectedConsultation.type === 'chat'
                                ? 'Tư vấn qua chat'
                                : 'Tư vấn trực tiếp'}
                          </Typography>
                        </Box>{' '}
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <UpdateIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Trạng thái:</strong>{' '}
                            {selectedConsultation.status === 'scheduled'
                              ? 'Đã đặt lịch'
                              : selectedConsultation.status === 'completed'
                                ? 'Đã hoàn thành'
                                : selectedConsultation.status === 'canceled'
                                  ? 'Đã hủy'
                                  : 'Đang chờ xác nhận'}
                          </Typography>
                        </Box>
                        {/* Hiển thị Google Meet link cho tư vấn video */}
                        {selectedConsultation.type === 'video' &&
                          selectedConsultation.meetLink && (
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
                                  href={selectedConsultation.meetLink}
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
                                  startIcon={<VideocamIcon fontSize="small" />}
                                >
                                  Tham gia Google Meet
                                </MedicalButton>
                              </Box>
                            </Box>
                          )}{' '}
                      </Box>
                    </CardContent>
                  </MedicalCard>
                </Grid>

                <Grid item xs={12}>
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
                      <Typography variant="body2" paragraph>
                        <strong>Lý do tư vấn:</strong>{' '}
                        {selectedConsultation.reason}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Ghi chú:</strong>{' '}
                        {selectedConsultation.notes || 'Không có ghi chú'}
                      </Typography>

                      {selectedConsultation.status === 'canceled' &&
                        selectedConsultation.cancelReason && (
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Lý do hủy:</strong>{' '}
                              {selectedConsultation.cancelReason}
                            </Typography>
                          </Alert>
                        )}

                      {selectedConsultation.status === 'completed' && (
                        <>
                          {selectedConsultation.feedback && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="subtitle2" gutterBottom>
                                Phản hồi từ khách hàng:
                              </Typography>
                              <Typography variant="body2">
                                {selectedConsultation.feedback}
                              </Typography>
                              {selectedConsultation.rating && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                  }}
                                >
                                  <Typography variant="body2" mr={1}>
                                    Đánh giá:
                                  </Typography>
                                  <Chip
                                    label={`${selectedConsultation.rating}/5`}
                                    color="primary"
                                    size="small"
                                  />
                                </Box>
                              )}
                            </Box>
                          )}{' '}
                        </>
                      )}
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
              selectedConsultation.status === 'pending' && (
                <MedicalButton
                  variant="contained"
                  onClick={() =>
                    handleUpdateStatus(selectedConsultation.id, 'scheduled')
                  }
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
              selectedConsultation.status === 'scheduled' && (
                <MedicalButton
                  variant="contained"
                  onClick={() =>
                    handleUpdateStatus(selectedConsultation.id, 'completed')
                  }
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
              (selectedConsultation.status === 'scheduled' ||
                selectedConsultation.status === 'pending') && (
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
                  onClick={() =>
                    handleUpdateStatus(selectedConsultation.id, 'canceled')
                  }
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

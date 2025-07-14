/**
 * AppointmentsContent.js - Component quản lý lịch hẹn phỏng vấn
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper,
  TablePagination,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Rating,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  ReportProblemRounded as WarningIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  DoneAll as DoneAllIcon,
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
import confirmDialog from '../../utils/confirmDialog';
import reviewService from '../../services/reviewService';
import ReviewForm from '../common/ReviewForm.js';
import { useNavigate } from 'react-router-dom';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [reviewedConsultationIds, setReviewedConsultationIds] = useState([]);
  const [myRatings, setMyRatings] = useState([]);

  // Cập nhật các state cho ReviewForm
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await consultantService.getMyConsultations();
      let appointmentsData = [];
      if (response && response.success && response.data) {
        appointmentsData = response.data;
      } else {
        toast.error(response.message || 'Không thể tải danh sách lịch hẹn');
      }
      // Lấy danh sách review liên quan đến consultation
      const reviewRes = await reviewService.getMyReviews(0, 100);
      const reviews = reviewRes?.content || reviewRes?.data || reviewRes || [];
      setMyRatings(reviews);
      // Mapping: gắn comment, rating vào từng appointment nếu có đánh giá tương ứng
      const mappedAppointments = appointmentsData.map((appointment) => {
        const found = reviews.find(
          (r) =>
            r.targetType === 'CONSULTANT' &&
            r.targetId === appointment.consultationId && // So sánh targetId với consultationId
            r.rating != null &&
            r.comment
        );
        if (found) {
          return {
            ...appointment,
            comment: found.comment,
            rating: found.rating,
            ratingId: found.ratingId,
          };
        }
        return appointment;
      });
      setAppointments(mappedAppointments);
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
    if (!cancelReason.trim()) {
      setCancelError('Vui lòng nhập lý do hủy lịch hẹn!');
      return;
    }
    setCancelError('');
    try {
      const response = await consultantService.updateConsultationStatus(
        selectedAppointment.consultationId,
        { status: 'CANCELED', reason: cancelReason }
      );
      if (response && response.success !== false) {
        toast.success('Hủy lịch hẹn thành công');
        setOpenCancelDialog(false);
        setCancelReason('');
        fetchAppointments();
      } else {
        toast.error(response.message || 'Không thể hủy lịch hẹn');
      }
    } catch (error) {
      toast.error(error.message || 'Không thể hủy lịch hẹn');
    }
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
        return {
          background: '#e6f9ed',
          color: '#219653',
          border: '1.5px solid #b7e4c7',
        };
      case 'PENDING':
        return {
          background: '#fff8e1',
          color: '#f57c00',
          border: '1.5px solid #ffe082',
        };
      case 'COMPLETED':
        return {
          background: '#e3f2fd',
          color: '#1976d2',
          border: '1.5px solid #90caf9',
        };
      case 'CANCELED':
        return {
          background: '#ffebee',
          color: '#d32f2f',
          border: '1.5px solid #ffcdd2',
        };
      default:
        return {
          background: '#ececec',
          color: '#455A64',
          border: '1.5px solid #b0bec5',
        };
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
      case 'CANCELED':
        return 'Đã huỷ';
      default:
        return 'Không xác định';
    }
  };

  // Helper function to convert array date to Date object
  const convertArrayToDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 5) return null;
    return new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4]
    );
  };

  // Helper function to check if date is within range
  const isDateInRange = (appointmentDate, start, end) => {
    if (!appointmentDate) return false;

    const appointmentDateObj = convertArrayToDate(appointmentDate);
    if (!appointmentDateObj) return false;

    const startDateObj = start ? new Date(start) : null;
    const endDateObj = end ? new Date(end) : null;

    if (startDateObj && endDateObj) {
      return (
        appointmentDateObj >= startDateObj && appointmentDateObj <= endDateObj
      );
    } else if (startDateObj) {
      return appointmentDateObj >= startDateObj;
    } else if (endDateObj) {
      return appointmentDateObj <= endDateObj;
    }
    return true;
  };

  // Filter appointments based on selected status and date range
  const filteredAppointments = appointments.filter((appointment) => {
    // Status filter
    const statusMatch =
      statusFilter === 'ALL' ||
      appointment.status?.toUpperCase() === statusFilter;

    // Date filter
    let dateMatch = true;
    if (dateFilter === 'CUSTOM' && (startDate || endDate)) {
      dateMatch = isDateInRange(appointment.createdAt, startDate, endDate);
    } else if (dateFilter === 'TODAY') {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );
      dateMatch = isDateInRange(
        appointment.createdAt,
        startOfDay.toISOString().split('T')[0],
        endOfDay.toISOString().split('T')[0]
      );
    } else if (dateFilter === 'THIS_WEEK') {
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 6)
      );
      dateMatch = isDateInRange(
        appointment.createdAt,
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      );
    } else if (dateFilter === 'THIS_MONTH') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      dateMatch = isDateInRange(
        appointment.createdAt,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
    }

    return statusMatch && dateMatch;
  });

  // Get unique statuses for filter options
  const getUniqueStatuses = () => {
    const statuses = appointments
      .map((app) => app.status?.toUpperCase())
      .filter(Boolean);
    return [...new Set(statuses)];
  };

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả', count: appointments.length },
    {
      value: 'PENDING',
      label: 'Chờ xác nhận',
      count: appointments.filter(
        (app) => app.status?.toUpperCase() === 'PENDING'
      ).length,
    },
    {
      value: 'CONFIRMED',
      label: 'Đã xác nhận',
      count: appointments.filter(
        (app) => app.status?.toUpperCase() === 'CONFIRMED'
      ).length,
    },
    {
      value: 'COMPLETED',
      label: 'Đã hoàn thành',
      count: appointments.filter(
        (app) => app.status?.toUpperCase() === 'COMPLETED'
      ).length,
    },
    {
      value: 'CANCELED',
      label: 'Đã huỷ',
      count: appointments.filter(
        (app) => app.status?.toUpperCase() === 'CANCELED'
      ).length,
    },
  ];

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(0); // Reset to first page when filter changes
  };

  const handleDateFilterChange = (newDateFilter) => {
    setDateFilter(newDateFilter);
    setPage(0); // Reset to first page when filter changes
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setPage(0);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatusFilter('ALL');
    setDateFilter('ALL');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng/trang (nếu muốn cho phép chọn, hiện tại chỉ để 5)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewingAppointment(null);
    setRating(0);
    setFeedback('');
    setIsEditMode(false);
    setEditingReviewId(null);
  };

  /**
   * Xử lý submit đánh giá tư vấn viên
   * Hỗ trợ cả tạo mới và cập nhật đánh giá
   */
  const handleSubmitReview = async () => {
    if (!reviewingAppointment) return;

    if (rating === 0) {
      toast.warning('Thông báo', 'Vui lòng chọn số sao đánh giá!');
      return;
    }

    if (feedback.trim().length < 10) {
      toast.warning(
        'Thông báo',
        'Vui lòng nhập ít nhất 10 ký tự cho phần đánh giá!'
      );
      return;
    }

    try {
      setReviewLoading(true);

      const reviewData = {
        rating: rating,
        comment: feedback.trim(),
        consultationId: reviewingAppointment.consultationId,
      };

      // Kiểm tra nếu là chỉnh sửa hoặc tạo mới
      if (isEditMode && editingReviewId) {
        // Gọi API cập nhật đánh giá
        await reviewService.updateReview(editingReviewId, reviewData);
        toast.success('Đánh giá đã được cập nhật thành công!');
      } else {
        // Gọi API tạo mới đánh giá
        await reviewService.createConsultantReview(
          reviewingAppointment.consultantId,
          reviewData
        );
        toast.success('Đánh giá đã được gửi thành công!');

        // Cập nhật ngay lập tức mảng reviewedConsultationIds để hiển thị đúng trạng thái
        if (
          reviewingAppointment.consultationId &&
          !reviewedConsultationIds.includes(reviewingAppointment.consultationId)
        ) {
          setReviewedConsultationIds([
            ...reviewedConsultationIds,
            reviewingAppointment.consultationId,
          ]);
        }
      }

      handleCloseReviewDialog();
      await fetchAppointments(); // reload lại danh sách để cập nhật trạng thái
    } catch (err) {
      toast.error(
        'Lỗi',
        'Lỗi khi ' +
          (isEditMode ? 'cập nhật' : 'tạo') +
          ' đánh giá: ' +
          err.message
      );
    } finally {
      setReviewLoading(false);
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

      {/* Filters */}
      {!loading && appointments.length > 0 && (
        <StyledPaper sx={{ p: 3, mb: 3 }}>
          {/* Status Filter */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: '#2D3748',
              fontSize: '1.1rem',
            }}
          >
            Lọc theo trạng thái
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ gap: 1, mb: 3 }}
          >
            {statusOptions.map((option) => (
              <Chip
                key={option.value}
                label={`${option.label} (${option.count})`}
                onClick={() => handleStatusFilterChange(option.value)}
                variant={statusFilter === option.value ? 'filled' : 'outlined'}
                sx={{
                  background:
                    statusFilter === option.value
                      ? getStatusColor(option.value).background
                      : 'transparent',
                  color: statusFilter === option.value ? '#fff' : '#4A5568',
                  border:
                    statusFilter === option.value
                      ? 'none'
                      : '1px solid rgba(74, 144, 226, 0.3)',
                  fontWeight: statusFilter === option.value ? 600 : 500,
                  fontSize: '13px',
                  height: 32,
                  '&:hover': {
                    background:
                      statusFilter === option.value
                        ? getStatusColor(option.value).background
                        : 'rgba(74, 144, 226, 0.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px 0 rgba(74, 144, 226, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Stack>

          {/* Date Filter */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: '#2D3748',
              fontSize: '1.1rem',
            }}
          >
            Lọc theo ngày đăng ký
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ gap: 2 }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select
                value={dateFilter}
                label="Khoảng thời gian"
                onChange={(e) => handleDateFilterChange(e.target.value)}
                size="small"
              >
                <SelectMenuItem value="ALL">Tất cả</SelectMenuItem>
                <SelectMenuItem value="TODAY">Hôm nay</SelectMenuItem>
                <SelectMenuItem value="THIS_WEEK">Tuần này</SelectMenuItem>
                <SelectMenuItem value="THIS_MONTH">Tháng này</SelectMenuItem>
                <SelectMenuItem value="CUSTOM">Tùy chọn</SelectMenuItem>
              </Select>
            </FormControl>

            {dateFilter === 'CUSTOM' && (
              <>
                <TextField
                  label="Từ ngày"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  label="Đến ngày"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 150 }}
                />
              </>
            )}
          </Stack>

          {/* Clear Filters Button */}
          {(statusFilter !== 'ALL' ||
            dateFilter !== 'ALL' ||
            startDate ||
            endDate) && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{
                  color: '#e53935',
                  borderColor: '#e53935',
                  '&:hover': {
                    backgroundColor: '#ffebee',
                    borderColor: '#b71c1c',
                    color: '#b71c1c',
                  },
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          )}
        </StyledPaper>
      )}

      {/* Loading indicator - Hiển thị khi đang tải dữ liệu */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Appointments Table */}
      {!loading && filteredAppointments.length > 0 && (
        <>
          <TableContainer
            component={MuiPaper}
            sx={{
              borderRadius: 4,
              mb: 0,
              boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.10)',
              background: '#fafdff',
              border: '1.5px solid #e3f0fa',
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      'linear-gradient(90deg, #fafdff 60%, #e3f0fa 100%)',
                    borderBottom: '2px solid #b3e0f7',
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                      letterSpacing: 0.2,
                    }}
                  >
                    Ngày đăng ký
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                  >
                    Thời gian bắt đầu
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                  >
                    Thời gian kết thúc
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                    align="center"
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                    align="center"
                  >
                    Đánh giá
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                      textAlign: 'center',
                    }}
                    align="center"
                  >
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow
                      key={appointment.testId}
                      hover
                      sx={{
                        background: '#fff',
                        transition: 'background 0.2s',
                        '&:hover': { background: '#e3f0fa' },
                        borderRadius: 3,
                      }}
                    >
                      <TableCell sx={{ fontSize: '1rem' }}>
                        {Array.isArray(appointment.createdAt)
                          ? formatDateTimeFromArray(appointment.createdAt)
                          : appointment.createdAt &&
                              ![
                                'Thời gian không hợp lệ',
                                'Lỗi định dạng thời gian',
                              ].includes(formatDateTime(appointment.createdAt))
                            ? formatDateTime(appointment.createdAt)
                            : 'Chưa cập nhật'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '1rem' }}>
                        {Array.isArray(appointment.startTime)
                          ? formatDateTimeFromArray(appointment.startTime)
                          : appointment.startTime &&
                              ![
                                'Thời gian không hợp lệ',
                                'Lỗi định dạng thời gian',
                              ].includes(formatDateTime(appointment.startTime))
                            ? formatDateTime(appointment.startTime)
                            : 'Chưa cập nhật'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '1rem' }}>
                        {Array.isArray(appointment.endTime)
                          ? formatDateTimeFromArray(appointment.endTime)
                          : appointment.endTime &&
                              ![
                                'Thời gian không hợp lệ',
                                'Lỗi định dạng thời gian',
                              ].includes(formatDateTime(appointment.endTime))
                            ? formatDateTime(appointment.endTime)
                            : 'Chưa cập nhật'}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusText(appointment.status)}
                          size="small"
                          icon={
                            appointment.status?.toUpperCase() ===
                            'COMPLETED' ? (
                              <DoneAllIcon
                                sx={{ color: '#1976d2', fontSize: 18 }}
                              />
                            ) : appointment.status?.toUpperCase() ===
                              'CONFIRMED' ? (
                              <CheckCircleIcon
                                sx={{ color: '#219653', fontSize: 18 }}
                              />
                            ) : appointment.status?.toUpperCase() ===
                              'PENDING' ? (
                              <HourglassIcon
                                sx={{ color: '#f57c00', fontSize: 18 }}
                              />
                            ) : appointment.status?.toUpperCase() ===
                              'CANCELED' ? (
                              <CancelIcon
                                sx={{ color: '#d32f2f', fontSize: 18 }}
                              />
                            ) : null
                          }
                          sx={{
                            background: getStatusColor(appointment.status)
                              .background,
                            color: getStatusColor(appointment.status).color,
                            border: getStatusColor(appointment.status).border,
                            fontWeight: 600,
                            fontSize: '13px',
                            borderRadius: '16px',
                            px: 2,
                            minWidth: 120,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        />
                      </TableCell>
                      {/* Cột Đánh giá */}
                      <TableCell align="center">
                        {appointment.status?.toUpperCase() === 'COMPLETED' && (() => {
                          // Tìm review tương ứng trong myRatings bằng consultationId
                          const foundReview = myRatings.find(
                            (r) =>
                              r.targetType === 'CONSULTANT' &&
                              String(r.consultationId) === String(appointment.consultationId)
                          );
                          if (foundReview) {
                            // Đã đánh giá, chỉ hiện nút Chỉnh sửa
                            return (
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                sx={{
                                  fontSize: 13,
                                  textTransform: 'none',
                                  borderRadius: 3,
                                  px: 1.5,
                                  height: 32,
                                }}
                                onClick={() => {
                                  setReviewingAppointment({
                                    ...appointment,
                                    type: 'CONSULTANT',
                                    isEligible: true,
                                  });
                                  setRating(foundReview.rating || 0);
                                  setFeedback(foundReview.comment || '');
                                  setIsEditMode(true);
                                  setEditingReviewId(foundReview.ratingId);
                                  setOpenReviewDialog(true);
                                }}
                              >
                                Chỉnh sửa
                              </Button>
                            );
                          } else {
                            // Chưa đánh giá, hiện nút Đánh giá như cũ
                            return (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                sx={{
                                  fontSize: 13,
                                  textTransform: 'none',
                                  borderRadius: 3,
                                  px: 1.5,
                                  height: 32,
                                }}
                                onClick={() => {
                                  setReviewingAppointment({
                                    ...appointment,
                                    type: 'CONSULTANT',
                                    isEligible: true,
                                  });
                                  setRating(0);
                                  setFeedback('');
                                  setIsEditMode(false);
                                  setEditingReviewId(null);
                                  setOpenReviewDialog(true);
                                }}
                              >
                                Đánh giá
                              </Button>
                            );
                          }
                        })()}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1.5,
                          }}
                        >
                          {appointment.meetUrl &&
                            appointment.status?.toUpperCase() !== 'CANCELED' &&
                            appointment.status?.toUpperCase() !==
                              'COMPLETED' && (
                              <Button
                                href={appointment.meetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: 13,
                                  textTransform: 'none',
                                  borderRadius: '20px',
                                  minWidth: 0,
                                  px: 2,
                                  height: 36,
                                  boxShadow: 'none',
                                  fontWeight: 600,
                                  color: '#1976d2',
                                  borderColor: '#1976d2',
                                  '&:hover': {
                                    background: '#e3f2fd',
                                    borderColor: '#1565c0',
                                    color: '#1565c0',
                                    boxShadow:
                                      '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                                  },
                                }}
                              >
                                Vào phòng họp
                              </Button>
                            )}
                          <IconButton
                            aria-label="Xem chi tiết"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setOpenDetailDialog(true);
                            }}
                            size="medium"
                            sx={{
                              border: '1.5px solid #1976d2',
                              color: '#1976d2',
                              background: '#fff',
                              borderRadius: '20px',
                              transition: 'all 0.2s',
                              '&:hover': {
                                background: '#e3f2fd',
                                borderColor: '#1565c0',
                                color: '#1565c0',
                                boxShadow:
                                  '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {appointment.status?.toUpperCase() === 'PENDING' && (
                            <IconButton
                              aria-label="Hủy lịch hẹn"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setOpenCancelDialog(true);
                              }}
                              size="medium"
                              sx={{
                                border: '1.5px solid #e53935',
                                color: '#e53935',
                                background: '#fff',
                                borderRadius: '20px',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  background: '#ffebee',
                                  borderColor: '#b71c1c',
                                  color: '#b71c1c',
                                  boxShadow:
                                    '0 2px 8px 0 rgba(229, 57, 53, 0.10)',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredAppointments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5]}
            labelRowsPerPage="Số dòng mỗi trang:"
            sx={{ mt: 2, mb: 2, borderRadius: 2, background: '#fff' }}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && filteredAppointments.length === 0 && (
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
            {appointments.length === 0
              ? 'Chưa có lịch hẹn nào'
              : 'Không có lịch hẹn nào phù hợp'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#4A5568', // Dark blue-gray for text
            }}
          >
            {appointments.length === 0
              ? 'Hãy đặt lịch hẹn đầu tiên của bạn'
              : `Không có lịch hẹn nào với trạng thái "${getStatusText(statusFilter)}"`}
          </Typography>
        </StyledPaper>
      )}

      {/* Cancel Confirmation Dialog (with reason) */}
      <Dialog
        open={openCancelDialog}
        onClose={() => {
          setOpenCancelDialog(false);
          setCancelReason('');
          setCancelError('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            boxShadow: '0 8px 32px 0 rgba(229, 57, 53, 0.15)',
            background: '#fff',
          },
        }}
      >
        <Box
          sx={{
            background: '#ffebee',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 0,
            position: 'relative',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenCancelDialog(false);
              setCancelReason('');
              setCancelError('');
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#e57373',
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.35rem',
              pb: 0,
              pt: 4,
              color: '#e53935',
              letterSpacing: 0.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'transparent',
            }}
          >
            <WarningIcon sx={{ color: '#e53935', fontSize: 48, mb: 1 }} />
            Xác nhận hủy lịch hẹn
          </DialogTitle>
        </Box>
        <DialogContent
          sx={{
            textAlign: 'center',
            color: '#4A5568',
            fontSize: '1.08rem',
            px: 5,
            pt: 2,
            pb: 0,
            background: '#fff',
          }}
        >
          <Typography sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy lịch hẹn này?
          </Typography>
          <TextField
            label="Lý do hủy lịch hẹn"
            value={cancelReason}
            onChange={(e) => {
              setCancelReason(e.target.value);
              setCancelError('');
            }}
            error={!!cancelError}
            helperText={cancelError}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2, mt: 1, background: '#fff', borderRadius: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            gap: 2,
            pb: 3,
            pt: 2,
            background: '#fff',
          }}
        >
          <Button
            onClick={() => {
              setOpenCancelDialog(false);
              setCancelReason('');
              setCancelError('');
            }}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              color: '#616161',
              borderColor: '#bdbdbd',
              background: '#f5f5f5',
              fontWeight: 500,
              fontSize: '1rem',
              '&:hover': {
                background: '#eeeeee',
                borderColor: '#9e9e9e',
                color: '#424242',
              },
            }}
          >
            HỦY
          </Button>
          <Button
            onClick={handleCancelAppointment}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 2px 8px 0 rgba(229, 57, 53, 0.10)',
              background: 'linear-gradient(90deg, #e53935 60%, #ff7043 100%)',
              letterSpacing: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #b71c1c 60%, #ff7043 100%)',
              },
            }}
            disabled={!cancelReason.trim()}
          >
            XÁC NHẬN HỦY
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 6,
            boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.18)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.35rem',
            color: '#1976d2',
            letterSpacing: 0.5,
            background: '#fafdff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          Chi tiết lịch hẹn
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: '#fafdff',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          {selectedAppointment ? (
            <Box>
              {/* Trạng thái & Vào phòng họp */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}
              >
                <Chip
                  label={getStatusText(selectedAppointment.status)}
                  size="small"
                  icon={
                    selectedAppointment.status?.toUpperCase() ===
                    'COMPLETED' ? (
                      <DoneAllIcon sx={{ color: '#388e3c' }} />
                    ) : selectedAppointment.status?.toUpperCase() ===
                      'CONFIRMED' ? (
                      <CheckCircleIcon sx={{ color: '#43a047' }} />
                    ) : selectedAppointment.status?.toUpperCase() ===
                      'PENDING' ? (
                      <HourglassIcon sx={{ color: '#0288d1' }} />
                    ) : selectedAppointment.status?.toUpperCase() ===
                      'CANCELED' ? (
                      <CancelIcon sx={{ color: '#e53935' }} />
                    ) : null
                  }
                  sx={{
                    background: getStatusColor(selectedAppointment.status)
                      .background,
                    color: getStatusColor(selectedAppointment.status).color,
                    border: getStatusColor(selectedAppointment.status).border,
                    fontWeight: 600,
                    fontSize: '13px',
                    height: 28,
                    borderRadius: 2,
                    px: 2,
                  }}
                />
                {selectedAppointment.status?.toUpperCase() === 'CANCELED' &&
                  (selectedAppointment.notes ? (
                    <Typography
                      variant="body2"
                      sx={{ color: '#e53935', fontWeight: 600, ml: 2 }}
                    >
                      Lý do huỷ của chuyên gia: {selectedAppointment.notes}
                    </Typography>
                  ) : selectedAppointment.reason ? (
                    <Typography
                      variant="body2"
                      sx={{ color: '#e53935', fontWeight: 600, ml: 2 }}
                    >
                      Lý do huỷ của bạn: {selectedAppointment.reason}
                    </Typography>
                  ) : null)}
                {selectedAppointment.meetUrl &&
                  selectedAppointment.status?.toUpperCase() !== 'CANCELED' &&
                  selectedAppointment.status?.toUpperCase() !== 'COMPLETED' && (
                    <Button
                      href={selectedAppointment.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: 13,
                        textTransform: 'none',
                        borderRadius: '20px',
                        minWidth: 0,
                        px: 2,
                        height: 32,
                        boxShadow: 'none',
                        fontWeight: 600,
                        color: '#1976d2',
                        borderColor: '#1976d2',
                        '&:hover': {
                          background: '#e3f2fd',
                          borderColor: '#1565c0',
                          color: '#1565c0',
                          boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                        },
                      }}
                    >
                      Vào phòng họp
                    </Button>
                  )}
              </Box>
              {/* Thông tin chi tiết */}
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 2,
                  columnGap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: '#1976d2' }}
                >
                  Tư vấn viên:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.05rem' }}>
                  {selectedAppointment.consultantName || 'Chưa cập nhật'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: '#1976d2' }}
                >
                  Bằng cấp:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.05rem' }}>
                  {selectedAppointment.consultantQualifications ||
                    'Chưa cập nhật'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: '#1976d2' }}
                >
                  Kinh nghiệm:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.05rem' }}>
                  {selectedAppointment.consultantExperience || 'Chưa cập nhật'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: '#1976d2' }}
                >
                  Ngày đăng ký:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.05rem' }}>
                  {Array.isArray(selectedAppointment.createdAt)
                    ? formatDateTimeFromArray(selectedAppointment.createdAt)
                    : selectedAppointment.createdAt &&
                        ![
                          'Thời gian không hợp lệ',
                          'Lỗi định dạng thời gian',
                        ].includes(
                          formatDateTime(selectedAppointment.createdAt)
                        )
                      ? formatDateTime(selectedAppointment.createdAt)
                      : 'Chưa cập nhật'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon
                    sx={{ color: '#4CAF50', fontSize: 22, mr: 1 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 700, color: '#1976d2' }}
                  >
                    Thời gian:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: '1.05rem' }}>
                  {Array.isArray(selectedAppointment.startTime)
                    ? formatDateTimeFromArray(selectedAppointment.startTime)
                    : selectedAppointment.startTime &&
                        ![
                          'Thời gian không hợp lệ',
                          'Lỗi định dạng thời gian',
                        ].includes(
                          formatDateTime(selectedAppointment.startTime)
                        )
                      ? formatDateTime(selectedAppointment.startTime)
                      : 'Chưa cập nhật'}
                  {Array.isArray(selectedAppointment.endTime)
                    ? ` - ${formatDateTimeFromArray(selectedAppointment.endTime)}`
                    : selectedAppointment.endTime &&
                        ![
                          'Thời gian không hợp lệ',
                          'Lỗi định dạng thời gian',
                        ].includes(formatDateTime(selectedAppointment.endTime))
                      ? ` - ${formatDateTime(selectedAppointment.endTime)}`
                      : ''}
                </Typography>
              </Box>
              {/* Hiển thị đánh giá nếu đã có */}
              {selectedAppointment.comment &&
                selectedAppointment.rating != null && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      background: '#f5fafd',
                      borderRadius: 2,
                      border: '1px solid #e3f0fa',
                      boxShadow: '0 2px 8px 0 rgba(74, 144, 226, 0.05)',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}
                    >
                      Đánh giá của bạn
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 500, mr: 1 }}>
                        Số sao:
                      </Typography>
                      <Rating
                        value={selectedAppointment.rating}
                        readOnly
                        size="small"
                      />
                    </Box>
                    <Typography sx={{ fontStyle: 'italic', color: '#333' }}>
                      {selectedAppointment.comment}
                    </Typography>
                  </Box>
                )}
            </Box>
          ) : (
            <Typography>Không có thông tin chi tiết để hiển thị.</Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            background: '#fafdff',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Button
            onClick={handleCloseDetailDialog}
            color="primary"
            variant="contained"
            sx={{
              borderRadius: '20px',
              fontWeight: 600,
              px: 4,
              boxShadow: '0 2px 8px 0 rgba(74, 144, 226, 0.10)',
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog đánh giá */}
      <ReviewForm
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        review={reviewingAppointment}
        rating={rating}
        setRating={setRating}
        feedback={feedback}
        setFeedback={setFeedback}
        onSubmit={handleSubmitReview}
        isEditMode={isEditMode}
        loading={reviewLoading}
      />
    </Box>
  );
};

export default AppointmentsContent;

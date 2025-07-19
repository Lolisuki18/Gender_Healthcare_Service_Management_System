/**
 * MedicalHistoryContent.js - Component quản lý lịch sử khám bệnh
 *
 * Chức năng:
 * - Hiển thị danh sách lịch sử khám bệnh dưới dạng table
 * - Lọc theo trạng thái, loại dịch vụ, ngày tháng
 * - Chi tiết từng lần khám (bác sĩ, ngày, chẩn đoán, đơn thuốc)
 * - Medical reports và test results
 * - Download medical documents
 * - Timeline view của medical history
 * - Hiển thị kết quả xét nghiệm STI từ API
 *
 * Features:
 * - Table-based medical records display
 * - Advanced filtering and sorting
 * - Doctor và clinic information
 * - Diagnosis và treatment details
 * - Prescription history
 * - Medical document management
 * - STI test results display
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
  IconButton,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Card as MuiCard,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  Description as ReportIcon,
  CalendarToday as CalendarIcon,
  Science as ScienceIcon,
  NoteAdd as NoteIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AttachMoney as PaymentIcon,
  OpenInNew as OpenInNewIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import TestResults from '../modals/TestResults';
import { styled } from '@mui/material/styles';
// Import dateUtils for consistent date formatting
import { formatDateDisplay } from '../../utils/dateUtils.js';
// Import stiService for API calls
import stiService, { cancelSTITest } from '../../services/stiService.js';
import confirmDialog from '../../utils/confirmDialog';
// Import notification system
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import CanceledTestDetailModal from '../StaffProfile/modals/CanceledTestDetailModal';
import ReviewForm from '../common/ReviewForm';
import { notify } from '@/utils/notify';

// Styled Paper Component với hiệu ứng glass morphism hiện đại
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.97)', // Light glass background
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(74, 144, 226, 0.15)', // Medical blue border
  color: '#2D3748', // Dark text for readability
  boxShadow: '0 10px 40px rgba(31, 38, 135, 0.1)', // Softer shadow for depth
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #4CAF50, #3498DB, #9B59B6)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
  },
}));

// Enhanced Table Component với hiệu ứng nổi và hover
const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    color: '#2D3748',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderBottom: '2px solid rgba(74, 144, 226, 0.2)',
  },
  '& .MuiTableCell-body': {
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(74, 144, 226, 0.04)',
    transition: 'background-color 0.2s ease',
  },
}));

// Thêm styled component cho nút với hiệu ứng
const ActionButton = styled(Button)(({ theme, color = 'primary' }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  padding: '10px 16px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const MedicalHistoryContent = () => {
  const [myRatings, setMyRatings] = useState([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  // Lấy danh sách đánh giá của user khi mount
  useEffect(() => {
    const fetchMyRatings = async () => {
      setIsLoadingRatings(true);
      try {
        // Lấy tối đa 1000 đánh giá, nếu nhiều hơn thì cần phân trang
        const data = await import('../../services/reviewService').then((m) =>
          m.default.getMyReviews(0, 1000)
        );
        setMyRatings(data?.content || data?.data || data || []);
      } catch (err) {
        setMyRatings([]);
      } finally {
        setIsLoadingRatings(false);
      }
    };
    fetchMyRatings();
  }, []);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [stiTests, setStiTests] = useState([]);
  // Define loading and error states for tracking API call status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancellingTestId, setCancellingTestId] = useState(null);
  // State cho modal chi tiết huỷ
  const [openCanceledDetailModal, setOpenCanceledDetailModal] = useState(false);
  const [selectedCanceledTest, setSelectedCanceledTest] = useState(null);

  // Table pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState(null);

  // State cho ReviewForm (đảm bảo khai báo đủ)
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewingRecord, setReviewingRecord] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewingRecord(null);
    setRating(0);
    setFeedback('');
    setIsEditMode(false);
    setEditingReviewId(null);
  };

  const handleSubmitReview = async () => {
    if (!reviewingRecord) return;
    if (rating === 0) {
      toast.warning('Vui lòng chọn số sao đánh giá!');
      return;
    }
    if (feedback.trim().length < 10) {
      toast.warning('Vui lòng nhập ít nhất 10 ký tự cho phần đánh giá!');
      return;
    }
    try {
      setReviewLoading(true);
      const reviewData = {
        rating: rating,
        comment: feedback.trim(),
        sti_test_id: reviewingRecord.testId, // Sử dụng snake_case đúng chuẩn backend
      };
      if (isEditMode && editingReviewId) {
        await import('../../services/reviewService').then((m) =>
          m.default.updateReview(editingReviewId, reviewData)
        );
        toast.success('Đánh giá đã được cập nhật thành công!');
      } else {
        await import('../../services/reviewService').then((m) =>
          m.default.createSTIServiceReview(reviewingRecord.testId, reviewData)
        );
        toast.success('Đánh giá đã được gửi thành công!');
      }
      handleCloseReviewDialog();
      // Reload lại đánh giá
      const data = await import('../../services/reviewService').then((m) =>
        m.default.getMyReviews(0, 1000)
      );
      setMyRatings(data?.content || data?.data || data || []);
    } catch (err) {
      toast.error('Lỗi khi gửi đánh giá: ' + (err.message || ''));
    } finally {
      setReviewLoading(false);
    }
  };

  // Define fetchSTITests as a named function to allow calling it from retry button
  const fetchSTITests = () => {
    setLoading(true);
    setError(null); // Reset error state before fetching

    stiService
      .getMySTITests()
      .then((response) => {
        if (response && response.data) {
          console.log('STI tests fetched:', response.data);
          setStiTests(response.data);
        } else {
          console.warn('No STI tests data returned from API');
          setStiTests([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching STI tests:', err);
        setError('Không thể tải dữ liệu xét nghiệm STI. Vui lòng thử lại sau.');
        toast.error('Lỗi', 'Không thể tải dữ liệu xét nghiệm STI.');
        setStiTests([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch the user's STI tests when the component mounts
  useEffect(() => {
    fetchSTITests();
  }, []); // Convert STI tests to medical record format

  const getStiTestsAsMedicalRecords = () => {
    if (!stiTests || stiTests.length === 0) {
      return [];
    }
    return stiTests.map((test) => {
      let dateToUse = test.appointmentDate || test.createdAt;
      if (Array.isArray(dateToUse) && dateToUse.length >= 3) {
        const [y, m, d, h = 0, min = 0, s = 0] = dateToUse;
        dateToUse = new Date(y, m - 1, d, h, min, s);
      }
      // Kiểm tra đã đánh giá chưa bằng myRatings
      let hasRated = false;
      if (myRatings && myRatings.length > 0) {
        hasRated = myRatings.some((rating) => {
          // So sánh theo testId hoặc serviceId
          return (
            (rating.stiTestId && rating.stiTestId === test.testId) ||
            (rating.targetId && rating.targetId === test.serviceId) ||
            (rating.serviceId && rating.serviceId === test.serviceId)
          );
        });
      }
      return {
        id: `sti-${test.testId}`,
        date: dateToUse,
        doctor: test.staffName || test.consultantName || 'Chưa xác định',
        consultantName: test.consultantName,
        diagnosis: test.serviceName || 'Xét nghiệm STI',
        serviceName: test.serviceName,
        status: test.status,
        displayStatus: test.getStatusDisplayText
          ? test.getStatusDisplayText()
          : test.status === 'RESULTED'
            ? 'Results Available'
            : test.status === 'COMPLETED'
              ? 'Completed'
              : test.status === 'CONFIRMED'
                ? 'Confirmed'
                : test.status === 'SAMPLED'
                  ? 'Sample Collected'
                  : test.status === 'CANCELED'
                    ? 'Cancelled'
                    : test.status === 'PENDING'
                      ? 'Pending'
                      : test.status,
        type: 'Xét nghiệm STI',
        notes: test.customerNotes || 'Không có ghi chú',
        consultantNotes: test.consultantNotes || 'Không có ghi chú',
        testId: test.testId,
        hasTestResults:
          test.status === 'RESULTED' || test.status === 'COMPLETED',
        payment: test.paymentStatus,
        paymentMethod: test.getPaymentDisplayText
          ? test.getPaymentDisplayText()
          : test.paymentMethod === 'COD'
            ? 'Cash on Delivery'
            : test.paymentMethod === 'VISA'
              ? 'Credit Card'
              : test.paymentMethod === 'QR_CODE'
                ? 'QR Code Transfer'
                : test.paymentMethod,
        appointmentDate: test.appointmentDate,
        isApiData: true,
        cancelReason: test.cancelReason,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        hasRated,
      };
    });
  };

  // Combine STI tests with static medical records
  const medicalRecords = [...getStiTestsAsMedicalRecords()];

  // Sort by date (newest first)
  medicalRecords.sort((a, b) => {
    // Convert to Date objects safely
    const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);

    // Compare valid dates
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateB - dateA;
    }

    // Handle invalid dates
    if (isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) return 1;
    if (!isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return -1;

    // Both dates invalid, maintain original order
    return 0;
  });

  // Filter medical records based on search and filter criteria
  const filteredRecords = medicalRecords.filter((record) => {
    // Search term filter
    const matchesSearch =
      searchTerm === '' ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      record.status === statusFilter ||
      record.displayStatus === statusFilter;

    // Date from filter
    let matchesDate = true;
    if (dateFrom) {
      const recordDate = new Date(record.date);
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      matchesDate = recordDate >= fromDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewTestResults = (testId) => {
    if (!testId) {
      console.warn('Attempted to view test results with null testId');
      toast.warning(
        'Không thể xem kết quả',
        'Không tìm thấy mã xét nghiệm hợp lệ.'
      );
      return;
    }

    console.log(`Viewing test results for testId: ${testId}`);

    setSelectedTestId(testId);
    toast.info('Đang tải kết quả', 'Đang tải dữ liệu kết quả xét nghiệm...', {
      duration: 3000,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành':
      case 'COMPLETED':
        return '#4CAF50'; // Medical green
      case 'Đang xử lý':
      case 'PENDING':
      case 'CONFIRMED':
        return '#F39C12'; // Medical orange
      case 'Hủy':
      case 'CANCELED':
        return '#E53E3E'; // Adjusted red
      case 'RESULTED':
        return '#3498DB'; // Blue for results available
      case 'SAMPLED':
        return '#9B59B6'; // Purple for sample collected
      default:
        return '#607D8B'; // Medical gray-blue
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'Khám tổng quát':
        return 'Khám tổng quát';
      case 'Chuyên khoa':
        return 'Chuyên khoa';
      case 'Tư vấn':
        return 'Tư vấn';
      case 'Xét nghiệm':
        return 'Xét nghiệm';
      case 'Xét nghiệm STI':
        return 'Xét nghiệm STI';
      default:
        return type;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFrom(null);
    setPage(0);
  };

  // Hàm huỷ xét nghiệm
  const handleCancelTest = async (testId) => {
    if (!testId) return;
    const reason = await confirmDialog.cancelWithReason(
      'Bạn có chắc chắn muốn huỷ xét nghiệm này? Vui lòng nhập lý do huỷ.'
    );
    if (!reason) return;
    setCancellingTestId(testId);
    try {
      const response = await cancelSTITest(testId, reason);
      if (response.success === true) {
        toast.success('Huỷ xét nghiệm thành công!');
        fetchSTITests();
      } else {
        if (
          response.message ==
          'Cannot cancel test within 24 hours of appointment'
        ) {
          notify.error(
            'Lỗi',
            'Không thể huỷ xét nghiệm trong vòng 24 giờ sau lịch hẹn! Vui lòng liên hệ với bác sĩ để được hỗ trợ.'
          );
        } else {
          notify.error('Lỗi', 'Huỷ xét nghiệm thất bại!');
        }
      }
    } catch (err) {
      toast.error('Huỷ xét nghiệm thất bại!');
    } finally {
      setCancellingTestId(null);
    }
  };

  // Hàm mở modal chi tiết huỷ
  const handleOpenCanceledDetailModal = (test) => {
    setSelectedCanceledTest(test);
    setOpenCanceledDetailModal(true);
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <StyledPaper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(250,252,255,0.97))',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '50%',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#2D3748',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Lịch sử khám bệnh
                </Typography>
                <Typography variant="body1" sx={{ color: '#4A5568', mt: 0.5 }}>
                  Quản lý và theo dõi các lần khám bệnh của bạn.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchSTITests}
              sx={{
                mt: { xs: 2, sm: 0 },
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cập nhật
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Statistics Cards */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {/* Tổng số lần khám */}
            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                flexBasis: '200px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                }}
              >
                <HospitalIcon sx={{ color: '#10b981', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#10b981', fontWeight: 500 }}
                >
                  Tổng số lần khám
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: '#10b981', fontWeight: 700 }}
                >
                  {medicalRecords.length}
                </Typography>
              </Box>
            </Box>

            {/* Lần khám gần nhất */}
            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                flexBasis: '200px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                }}
              >
                <TimeIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#3b82f6', fontWeight: 500 }}
                >
                  Lần khám gần nhất
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: '#3b82f6', fontWeight: 600 }}
                >
                  {medicalRecords.length > 0
                    ? formatDateDisplay(medicalRecords[0]?.date)
                    : 'Chưa có lần khám nào'}
                </Typography>
              </Box>
            </Box>

            {/* Có kết quả */}
            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                flexBasis: '200px',
                borderRadius: '12px',
                background: 'rgba(52, 152, 219, 0.05)',
                border: '1px solid rgba(52, 152, 219, 0.1)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                }}
              >
                <ScienceIcon sx={{ color: '#3498db', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#3498db', fontWeight: 500 }}
                >
                  Có kết quả
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: '#3498db', fontWeight: 700 }}
                >
                  {medicalRecords.filter((r) => r.hasTestResults).length}
                </Typography>
              </Box>
            </Box>

            {/* Hoàn thành */}
            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                flexBasis: '200px',
                borderRadius: '12px',
                background: 'rgba(76, 175, 80, 0.05)',
                border: '1px solid rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                }}
              >
                <ScienceIcon sx={{ color: '#4CAF50', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#4CAF50', fontWeight: 500 }}
                >
                  Hoàn thành
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: '#4CAF50', fontWeight: 700 }}
                >
                  {
                    medicalRecords.filter(
                      (r) =>
                        r.status === 'COMPLETED' ||
                        r.displayStatus === 'Hoàn thành'
                    ).length
                  }
                </Typography>
              </Box>
            </Box>

            {/* Bị huỷ */}
            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                flexBasis: '200px',
                borderRadius: '12px',
                background: 'rgba(239, 83, 80, 0.05)',
                border: '1px solid rgba(239, 83, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(239, 83, 80, 0.1)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                }}
              >
                <ScienceIcon sx={{ color: '#EF5350', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#EF5350', fontWeight: 500 }}
                >
                  Bị huỷ
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: '#EF5350', fontWeight: 700 }}
                >
                  {medicalRecords.filter((r) => r.status === 'CANCELED').length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Zoom>

      {/* Filters Section */}
      <StyledPaper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterIcon sx={{ mr: 1, color: '#4A90E2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748' }}>
            Bộ lọc tìm kiếm
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Tìm theo bác sĩ, dịch vụ..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="RESULTED">Đã có kết quả</MenuItem>
                <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                <MenuItem value="SAMPLED">Đã lấy mẫu</MenuItem>
                <MenuItem value="PENDING">Đang xử lý</MenuItem>
                <MenuItem value="CANCELED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Từ ngày"
                value={dateFrom}
                onChange={(newValue) => setDateFrom(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </StyledPaper>

      {/* Table Section */}
      <StyledPaper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ScienceIcon sx={{ mr: 1, color: '#4A90E2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748' }}>
            Danh sách lịch sử khám bệnh ({filteredRecords.length} kết quả)
          </Typography>
        </Box>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Bác sĩ</TableCell>
                <TableCell>Ngày khám</TableCell>
                <TableCell>Dịch vụ</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
                <TableCell>Đánh giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, idx) => (
                  <TableRow key={record.id || idx}>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      {record.consultantName || 'Chưa xác định'}
                    </TableCell>
                    <TableCell>{formatDateDisplay(record.date)}</TableCell>
                    <TableCell>
                      {record.serviceName || getTypeName(record.type)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={(() => {
                          switch ((record.status || '').toUpperCase()) {
                            case 'COMPLETED':
                              return 'Hoàn thành';
                            case 'PENDING':
                              return 'Đang xử lý';
                            case 'RESULTED':
                              return 'Đã có kết quả';
                            case 'CONFIRMED':
                              return 'Đã xác nhận';
                            case 'SAMPLED':
                              return 'Đã lấy mẫu';
                            case 'CANCELED':
                              return 'Đã hủy';
                            default:
                              if (
                                [
                                  'Hoàn thành',
                                  'Đang xử lý',
                                  'Đã có kết quả',
                                  'Đã xác nhận',
                                  'Đã lấy mẫu',
                                  'Đã hủy',
                                ].includes(record.status)
                              ) {
                                return record.status;
                              }
                              return 'Không xác định';
                          }
                        })()}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(record.status)}15`,
                          color: getStatusColor(record.status),
                          border: `1px solid ${getStatusColor(record.status)}30`,
                          fontWeight: 600,
                          borderRadius: '8px',
                          py: 0.5,
                        }}
                      />
                    </TableCell>

                    {/* Cột Hành động */}
                    <TableCell>
                      {/* Nếu đã huỷ thì chỉ hiển thị nút xem chi tiết huỷ */}
                      {record.status === 'CANCELED' ? (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleOpenCanceledDetailModal(record)}
                          sx={{ mr: 1, mb: 0.5 }}
                        >
                          Xem chi tiết huỷ
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ScienceIcon />}
                          onClick={() =>
                            (record.status === 'COMPLETED' ||
                              record.displayStatus === 'Hoàn thành') &&
                            handleViewTestResults(record.testId)
                          }
                          disabled={
                            !(
                              record.status === 'COMPLETED' ||
                              record.displayStatus === 'Hoàn thành'
                            )
                          }
                          sx={{ mr: 1, mb: 0.5 }}
                        >
                          Xem kết quả
                        </Button>
                      )}
                      {/* Nút Huỷ cho trạng thái Đang xử lý */}
                      {record.status === 'PENDING' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancelTest(record.testId)}
                          disabled={cancellingTestId === record.testId}
                          sx={{ mr: 1, mb: 0.5 }}
                        >
                          {cancellingTestId === record.testId
                            ? 'Đang huỷ...'
                            : 'Huỷ'}
                        </Button>
                      )}
                    </TableCell>
                    {/* Cột Đánh giá */}
                    <TableCell>
                      {(record.type === 'Xét nghiệm STI' ||
                        record.type === 'STI' ||
                        record.serviceType === 'STI_SERVICE') &&
                      ['COMPLETED'].includes(
                        (
                          record.status ||
                          record.displayStatus ||
                          ''
                        ).toUpperCase()
                      ) ? (
                        (() => {
                          // Kiểm tra đã đánh giá chưa bằng stiTestId
                          const foundReview = myRatings.find(
                            (r) =>
                              r.stiTestId &&
                              String(r.stiTestId) === String(record.testId)
                          );
                          if (foundReview) {
                            // Đã đánh giá, hiện nút Chỉnh sửa
                            return (
                              <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                onClick={() => {
                                  setReviewingRecord(record);
                                  setRating(foundReview.rating || 0);
                                  setFeedback(foundReview.comment || '');
                                  setIsEditMode(true);
                                  setEditingReviewId(
                                    foundReview.ratingId || foundReview.id
                                  );
                                  setOpenReviewDialog(true);
                                }}
                              >
                                Chỉnh sửa
                              </Button>
                            );
                          } else {
                            // Chưa đánh giá, hiện nút Đánh giá
                            return (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  setReviewingRecord(record);
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
                        })()
                      ) : (
                        <span style={{ color: '#BDBDBD', fontSize: 13 }}>
                          {['CANCELED', 'PENDING'].includes(
                            (record.status || '').toUpperCase()
                          )
                            ? '—'
                            : record.status === 'RESULTED' ||
                                record.displayStatus === 'Đã có kết quả'
                              ? 'Chỉ đánh giá khi hoàn thành'
                              : 'Chỉ đánh giá khi hoàn thành'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Alert severity="info" sx={{ p: 2 }}>
                      Không có dữ liệu lịch sử khám bệnh nào.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredRecords.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
      {/* Hiển thị kết quả xét nghiệm */}
      {selectedTestId && <TestResults testId={selectedTestId} />}
      {/* STI Test section with improved UI */}
      <Box sx={{ mt: 4 }}>
        <StyledPaper sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'rgba(155, 89, 182, 0.1)',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <ScienceIcon sx={{ color: '#9B59B6', fontSize: '28px' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#2D3748',
                }}
              >
                Xét nghiệm STI
              </Typography>
            </Box>

            <IconButton
              onClick={fetchSTITests}
              sx={{
                backgroundColor: 'rgba(155, 89, 182, 0.05)',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(155, 89, 182, 0.1)',
                },
              }}
            >
              <RefreshIcon sx={{ color: '#9B59B6' }} />
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
              {error}
              <Button
                size="small"
                sx={{ ml: 2 }}
                onClick={() => fetchSTITests()}
              >
                Thử lại
              </Button>
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={30} color="secondary" />
            </Box>
          )}

          {!loading && stiTests && stiTests.length > 0 ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Bạn có <strong>{stiTests.length} xét nghiệm STI</strong> trong
                hệ thống. Xét nghiệm mới nhất vào ngày{' '}
                <strong>
                  {stiTests[0]
                    ? formatDateDisplay(
                        stiTests[0].appointmentDate || stiTests[0].createdAt
                      )
                    : 'chưa xác định'}
                </strong>
                .
              </Typography>

              <Box sx={{ textAlign: 'center', py: 2 }}>
                <ActionButton
                  variant="contained"
                  color="secondary"
                  startIcon={<ScienceIcon />}
                  onClick={() => {
                    if (medicalRecords[0]?.hasTestResults) {
                      handleViewTestResults(medicalRecords[0].testId);
                    } else {
                      toast.warning(
                        'Chưa có kết quả',
                        'Xét nghiệm gần nhất chưa có kết quả'
                      );
                    }
                  }}
                  sx={{
                    backgroundColor: '#9B59B6',
                    '&:hover': {
                      backgroundColor: '#8E44AD',
                    },
                  }}
                >
                  Xem Kết Quả Xét Nghiệm Gần Nhất
                </ActionButton>
              </Box>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2, borderRadius: '10px' }}>
              Chưa có dữ liệu xét nghiệm STI nào trong hệ thống.
            </Alert>
          )}
        </StyledPaper>
      </Box>
      {/* Modal for test results */}
      {selectedTestId && (
        <TestResults
          testId={selectedTestId}
          onClose={() => setSelectedTestId(null)}
        />
      )}
      {/* Modal chi tiết huỷ */}
      <CanceledTestDetailModal
        open={openCanceledDetailModal}
        onClose={() => setOpenCanceledDetailModal(false)}
        test={selectedCanceledTest}
        formatDateDisplay={formatDateDisplay}
      />
      {/* Dialog đánh giá */}
      <ReviewForm
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        review={reviewingRecord}
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

export default MedicalHistoryContent;

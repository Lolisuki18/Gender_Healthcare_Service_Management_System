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
  Cancel as CancelIcon,
  Info as InfoIcon,
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
import MedicalHistoryDetailModal from '../modals/MedicalHistoryDetailModal';
import { notify } from '@/utils/notify';
import ServiceDetailDialog from '../TestRegistration/ServiceDetailDialog';
import reviewService from '../../services/reviewService';
import {
  getSTIServiceById,
  getSTIPackageById,
} from '../../services/stiService';

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
        const data = await reviewService.getMyReviews(0, 1000);
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

  // State cho modal chi tiết lịch khám
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  // State cho ServiceDetailDialog
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [serviceDetailData, setServiceDetailData] = useState(null);
  const [serviceDetailType, setServiceDetailType] = useState('single');
  const [loadingServiceDetail, setLoadingServiceDetail] = useState(false);

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
        sti_test_id: reviewingRecord.testId,
        stiTestId: reviewingRecord.testId,
        customerId: reviewingRecord.customerId,
        staffId: reviewingRecord.staffId,
        consultantId: reviewingRecord.consultantId,
        serviceId: reviewingRecord.serviceId,
        packageId: reviewingRecord.packageId,
      };
      if (isEditMode && editingReviewId) {
        await reviewService.updateReview(editingReviewId, reviewData, {
          suppressNotification: true,
        });
        // Chỉ hiển thị thông báo nếu không có yêu cầu suppress từ component khác
        if (!reviewData.suppressNotification) {
          toast.success('Đánh giá đã được cập nhật thành công!');
        }
      } else {
        if (reviewingRecord.packageId) {
          // Nếu có packageId thì là đánh giá gói
          await reviewService.createSTIPackageReview(
            reviewingRecord.packageId,
            reviewData
          );
        } else {
          // Nếu không có packageId thì là dịch vụ lẻ
          await reviewService.createSTIServiceReview(
            reviewingRecord.serviceId || reviewingRecord.testId,
            reviewData
          );
        }
        toast.success('Đánh giá đã được gửi thành công!');
      }
      handleCloseReviewDialog();
      // Reload lại đánh giá
      const data = await reviewService.getMyReviews(0, 1000);
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
    if (!stiTests || !Array.isArray(stiTests) || stiTests.length === 0) {
      return [];
    }
    return stiTests
      .map((test) => {
        // Safety check cho test object
        if (!test || typeof test !== 'object') {
          return null;
        }

        let dateToUse = test.appointmentDate || test.createdAt;
        if (Array.isArray(dateToUse) && dateToUse.length >= 3) {
          const [y, m, d, h = 0, min = 0, s = 0] = dateToUse;
          dateToUse = new Date(y, m - 1, d, h, min, s);
        }
        // Kiểm tra đã đánh giá chưa bằng myRatings
        let hasRated = false;
        if (myRatings && Array.isArray(myRatings) && myRatings.length > 0) {
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
          id: `sti-${test.testId || 'unknown'}`,
          date: dateToUse,
          doctor: test.staffName || test.consultantName || 'Chưa xác định',
          consultantName: test.consultantName || null,
          diagnosis: test.serviceName || 'Xét nghiệm STI',
          serviceName: test.serviceName || 'Xét nghiệm STI',
          serviceDescription: test.serviceDescription || null,
          status: test.status,
          displayStatus: (() => {
            // Ưu tiên statusDisplayText từ API
            if (test.statusDisplayText) {
              return test.statusDisplayText;
            }
            // Fallback về logic cũ nếu không có
            switch (test.status) {
              case 'RESULTED':
                return 'Results Available';
              case 'COMPLETED':
                return 'Completed';
              case 'CONFIRMED':
                return 'Confirmed';
              case 'SAMPLED':
                return 'Sample Collected';
              case 'CANCELED':
                return 'Cancelled';
              case 'PENDING':
                return 'Pending';
              default:
                return test.status || 'Unknown';
            }
          })(),
          type: 'Xét nghiệm STI',
          notes: test.customerNotes || 'Không có ghi chú',
          consultantNotes: test.consultantNotes || null,
          testId: test.testId || null,
          // testName: test.testName || null,
          hasTestResults:
            test.status === 'RESULTED' || test.status === 'COMPLETED',
          paymentStatus: test.paymentStatus || null,
          paymentMethod: test.paymentMethod || null,
          paymentDisplayText: (() => {
            // Ưu tiên paymentDisplayText từ API
            if (test.paymentDisplayText) {
              return test.paymentDisplayText;
            }
            // Fallback về logic cũ nếu không có
            switch (test.paymentMethod) {
              case 'COD':
                return 'Cash on Delivery';
              case 'VISA':
                return 'Credit Card';
              case 'QR_CODE':
                return 'QR Code Transfer';
              default:
                return test.paymentMethod || 'Unknown';
            }
          })(),
          totalPrice: test.totalPrice || null,
          paidAt: test.paidAt || null,
          paymentTransactionId: test.paymentTransactionId || null,
          stripePaymentIntentId: test.stripePaymentIntentId || null,
          qrPaymentReference: test.qrPaymentReference || null,
          qrExpiresAt: test.qrExpiresAt || null,
          qrCodeUrl: test.qrCodeUrl || null,
          paymentFailureReason: test.paymentFailureReason || null,
          canRetryPayment: test.canRetryPayment || false,
          paymentCompleted: test.paymentCompleted || false,
          codpayment: test.codpayment || false,
          stripePayment: test.stripePayment || false,
          qrpayment: test.qrpayment || false,
          qrexpired: test.qrexpired || false,
          appointmentDate: test.appointmentDate || null,
          resultDate: test.resultDate || null,
          isApiData: true,
          cancelReason: test.cancelReason || null,
          createdAt: test.createdAt || null,
          updatedAt: test.updatedAt || null,
          hasRated,
          // Thêm thông tin khách hàng
          customerId: test.customerId || null,
          customerName: test.customerName || null,
          customerEmail: test.customerEmail || null,
          customerPhone: test.customerPhone || null,
          // Thông tin staff và consultant
          staffId: test.staffId || null,
          staffName: test.staffName || null,
          consultantId: test.consultantId || null,
          // Thông tin service/package
          serviceId: test.serviceId || null,
          packageId: test.packageId || null,
        };
      })
      .filter((record) => record !== null); // Loại bỏ null records
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
    // console.warn('Selected testId:', testId);
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

  // Hàm mở modal chi tiết lịch khám
  const handleOpenDetailModal = (record) => {
    setSelectedRecord(record);
    setOpenDetailModal(true);
  };

  // Hàm xử lý click vào tên dịch vụ
  const handleServiceNameClick = async (record) => {
    if (!record) return;

    // Kiểm tra xem có packageId hay serviceId không
    if (!record.packageId && !record.serviceId) {
      toast.warning('Không có thông tin chi tiết cho dịch vụ này');
      return;
    }

    setLoadingServiceDetail(true);
    setServiceDetailOpen(true);

    try {
      let detailData = null;
      let detailType = 'single';

      // Kiểm tra xem có packageId hay serviceId
      if (record.packageId) {
        // Đây là package
        const response = await getSTIPackageById(record.packageId);
        if (response && response.success && response.data) {
          detailData = response.data;
          detailType = 'package';
        } else {
          throw new Error('Không thể tải thông tin gói dịch vụ');
        }
      } else if (record.serviceId) {
        // Đây là service
        const response = await getSTIServiceById(record.serviceId);
        if (response && response.success && response.data) {
          detailData = response.data;
          console.error('Service detail data:', detailData);
          detailType = 'single';
        } else {
          throw new Error('Không thể tải thông tin dịch vụ');
        }
      }

      setServiceDetailData(detailData);
      setServiceDetailType(detailType);
    } catch (error) {
      console.error('Error loading service detail:', error);
      toast.error(error.message || 'Lỗi khi tải thông tin chi tiết dịch vụ');
      setServiceDetailOpen(false);
    } finally {
      setLoadingServiceDetail(false);
    }
  };

  // Hàm đóng ServiceDetailDialog
  const handleCloseServiceDetail = () => {
    setServiceDetailOpen(false);
    setServiceDetailData(null);
    setServiceDetailType('single');
    setLoadingServiceDetail(false);
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
                {/* <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#2D3748',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Lịch sử khám bệnh
                </Typography> */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#2D3748',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
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
                  Lịch khám gần nhất
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
                    <TableCell>
                      <Tooltip title="Click để xem chi tiết lịch khám" arrow>
                        <Box
                          onClick={() => handleOpenDetailModal(record)}
                          sx={{
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.08)',
                              transform: 'translateX(2px)',
                            },
                            '&:active': {
                              backgroundColor: 'rgba(102, 126, 234, 0.12)',
                              transform: 'translateX(0px)',
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#1976d2',
                              fontWeight: 500,
                              textDecoration: 'underline',
                              textDecorationColor: 'transparent',
                              transition:
                                'text-decoration-color 0.2s ease-in-out',
                              wordWrap: 'break-word',
                              wordBreak: 'break-word',
                              whiteSpace: 'normal',
                              lineHeight: 1.4,
                              '&:hover': {
                                textDecorationColor: '#1976d2',
                              },
                            }}
                          >
                            {formatDateDisplay(record.date)}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {record.packageId || record.serviceId ? (
                        <Tooltip title="Click để xem chi tiết dịch vụ" arrow>
                          <Box
                            onClick={() => handleServiceNameClick(record)}
                            sx={{
                              cursor: 'pointer',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              transition: 'all 0.2s ease-in-out',
                              minHeight: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                transform: 'translateX(2px)',
                              },
                              '&:active': {
                                backgroundColor: 'rgba(102, 126, 234, 0.12)',
                                transform: 'translateX(0px)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <OpenInNewIcon
                                sx={{ fontSize: 16, color: '#1976d2' }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#1976d2',
                                  fontWeight: 500,
                                  textDecoration: 'underline',
                                  textDecorationColor: 'transparent',
                                  transition:
                                    'text-decoration-color 0.2s ease-in-out',
                                  wordWrap: 'break-word',
                                  wordBreak: 'break-word',
                                  whiteSpace: 'normal',
                                  lineHeight: 1.4,
                                  '&:hover': {
                                    textDecorationColor: '#1976d2',
                                  },
                                }}
                              >
                                {record.serviceName || getTypeName(record.type)}
                              </Typography>
                            </Box>
                          </Box>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title="Không có thông tin chi tiết cho dịch vụ này"
                          arrow
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <InfoIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#2D3748',
                                fontWeight: 500,
                                wordWrap: 'break-word',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                lineHeight: 1.4,
                              }}
                            >
                              {record.serviceName || getTypeName(record.type)}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
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
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Nếu đã huỷ thì chỉ hiển thị nút xem chi tiết huỷ */}
                        {record.status === 'CANCELED' ? (
                          <Tooltip title="Xem chi tiết huỷ" arrow>
                            <IconButton
                              color="error"
                              size="medium"
                              onClick={() =>
                                handleOpenCanceledDetailModal(record)
                              }
                              sx={{
                                width: 40,
                                height: 40,
                                background:
                                  'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                color: 'white',
                                border: '2px solid transparent',
                                boxShadow:
                                  '0 4px 15px rgba(255, 107, 107, 0.3)',
                                transition:
                                  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background:
                                    'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
                                  transform: 'translateY(-2px)',
                                  boxShadow:
                                    '0 8px 25px rgba(255, 107, 107, 0.4)',
                                  border: '2px solid rgba(255, 255, 255, 0.3)',
                                },
                                '&:active': {
                                  transform: 'translateY(0px)',
                                  boxShadow:
                                    '0 4px 15px rgba(255, 107, 107, 0.3)',
                                },
                              }}
                            >
                              <CancelIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Xem kết quả xét nghiệm" arrow>
                            <IconButton
                              color="primary"
                              size="medium"
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
                              sx={{
                                width: 40,
                                height: 40,
                                background:
                                  record.status === 'COMPLETED' ||
                                  record.displayStatus === 'Hoàn thành'
                                    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                                    : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                                color:
                                  record.status === 'COMPLETED' ||
                                  record.displayStatus === 'Hoàn thành'
                                    ? 'white'
                                    : '#757575',
                                border: '2px solid transparent',
                                boxShadow:
                                  record.status === 'COMPLETED' ||
                                  record.displayStatus === 'Hoàn thành'
                                    ? '0 4px 15px rgba(76, 175, 80, 0.3)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition:
                                  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background:
                                    record.status === 'COMPLETED' ||
                                    record.displayStatus === 'Hoàn thành'
                                      ? 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)'
                                      : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                                  transform:
                                    record.status === 'COMPLETED' ||
                                    record.displayStatus === 'Hoàn thành'
                                      ? 'translateY(-2px)'
                                      : 'none',
                                  boxShadow:
                                    record.status === 'COMPLETED' ||
                                    record.displayStatus === 'Hoàn thành'
                                      ? '0 8px 25px rgba(76, 175, 80, 0.4)'
                                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                  border:
                                    record.status === 'COMPLETED' ||
                                    record.displayStatus === 'Hoàn thành'
                                      ? '2px solid rgba(255, 255, 255, 0.3)'
                                      : '2px solid transparent',
                                },
                                '&:active': {
                                  transform:
                                    record.status === 'COMPLETED' ||
                                    record.displayStatus === 'Hoàn thành'
                                      ? 'translateY(0px)'
                                      : 'none',
                                  boxShadow:
                                    record.status === 'COMPLETED' ||
                                    record.displayStatus === 'Hoàn thành'
                                      ? '0 4px 15px rgba(76, 175, 80, 0.3)'
                                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                },
                                '&.Mui-disabled': {
                                  background:
                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: '#bdbdbd',
                                  boxShadow: 'none',
                                  transform: 'none',
                                  '&:hover': {
                                    background:
                                      'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                    transform: 'none',
                                    boxShadow: 'none',
                                  },
                                },
                              }}
                            >
                              <ScienceIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Nút Huỷ cho trạng thái Đang xử lý */}
                        {record.status === 'PENDING' && (
                          <Tooltip title="Huỷ xét nghiệm" arrow>
                            <IconButton
                              color="error"
                              size="medium"
                              onClick={() => handleCancelTest(record.testId)}
                              disabled={cancellingTestId === record.testId}
                              sx={{
                                width: 40,
                                height: 40,
                                background:
                                  'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                                color: 'white',
                                border: '2px solid transparent',
                                boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
                                transition:
                                  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background:
                                    'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                                  transform: 'translateY(-2px)',
                                  boxShadow:
                                    '0 8px 25px rgba(244, 67, 54, 0.4)',
                                  border: '2px solid rgba(255, 255, 255, 0.3)',
                                },
                                '&:active': {
                                  transform: 'translateY(0px)',
                                  boxShadow:
                                    '0 4px 15px rgba(244, 67, 54, 0.3)',
                                },
                                '&.Mui-disabled': {
                                  background:
                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: '#bdbdbd',
                                  boxShadow: 'none',
                                  transform: 'none',
                                  '&:hover': {
                                    background:
                                      'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                    transform: 'none',
                                    boxShadow: 'none',
                                  },
                                },
                              }}
                            >
                              {cancellingTestId === record.testId ? (
                                <CircularProgress
                                  size={18}
                                  sx={{ color: 'white' }}
                                />
                              ) : (
                                <CancelIcon sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
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
                              <Tooltip title="Chỉnh sửa đánh giá" arrow>
                                <IconButton
                                  color="success"
                                  size="medium"
                                  onClick={() => {
                                    setReviewingRecord({
                                      ...record,
                                      createdAt: foundReview.createdAt,
                                    });
                                    setRating(foundReview.rating || 0);
                                    setFeedback(foundReview.comment || '');
                                    setIsEditMode(true);
                                    setEditingReviewId(
                                      foundReview.ratingId || foundReview.id
                                    );
                                    setOpenReviewDialog(true);
                                  }}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    background:
                                      'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                                    color: 'white',
                                    border: '2px solid transparent',
                                    boxShadow:
                                      '0 4px 15px rgba(76, 175, 80, 0.3)',
                                    transition:
                                      'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                      background:
                                        'linear-gradient(135deg, #45a049 0%, #388e3c 100%)',
                                      transform: 'translateY(-2px)',
                                      boxShadow:
                                        '0 8px 25px rgba(76, 175, 80, 0.4)',
                                      border:
                                        '2px solid rgba(255, 255, 255, 0.3)',
                                    },
                                    '&:active': {
                                      transform: 'translateY(0px)',
                                      boxShadow:
                                        '0 4px 15px rgba(76, 175, 80, 0.3)',
                                    },
                                  }}
                                >
                                  <NoteIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                              </Tooltip>
                            );
                          } else {
                            // Chưa đánh giá, hiện nút Đánh giá
                            return (
                              <Tooltip title="Đánh giá dịch vụ" arrow>
                                <IconButton
                                  color="primary"
                                  size="medium"
                                  onClick={() => {
                                    setReviewingRecord({
                                      ...record,
                                      createdAt: new Date().toISOString(), // Đối với đánh giá mới, sử dụng ngày hiện tại
                                    });
                                    setRating(0);
                                    setFeedback('');
                                    setIsEditMode(false);
                                    setEditingReviewId(null);
                                    setOpenReviewDialog(true);
                                  }}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    background:
                                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: '2px solid transparent',
                                    boxShadow:
                                      '0 4px 15px rgba(102, 126, 234, 0.3)',
                                    transition:
                                      'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                      background:
                                        'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                      transform: 'translateY(-2px)',
                                      boxShadow:
                                        '0 8px 25px rgba(102, 126, 234, 0.4)',
                                      border:
                                        '2px solid rgba(255, 255, 255, 0.3)',
                                    },
                                    '&:active': {
                                      transform: 'translateY(0px)',
                                      boxShadow:
                                        '0 4px 15px rgba(102, 126, 234, 0.3)',
                                    },
                                  }}
                                >
                                  <NoteIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                              </Tooltip>
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
      {/* Modal chi tiết lịch khám */}
      <MedicalHistoryDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        record={selectedRecord}
        formatDateDisplay={formatDateDisplay}
      />
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
      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        open={serviceDetailOpen}
        onClose={handleCloseServiceDetail}
        detailData={serviceDetailData}
        detailType={serviceDetailType}
        loadingDetail={loadingServiceDetail}
      />
    </Box>
  );
};

export default MedicalHistoryContent;

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
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
  IconButton,
  Fade,
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
  Stack,
  Card as MuiCard,
  CardHeader,
  CardActions,
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
import stiService from '../../services/stiService.js';
// Import notification system
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [stiTests, setStiTests] = useState([]);
  // Define loading and error states for tracking API call status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Table pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState(null);

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
      // Chỉ chuyển array [YYYY, MM, DD, ...] thành Date object, còn lại để formatDateDisplay xử lý
      let dateToUse = test.appointmentDate || test.createdAt;
      if (Array.isArray(dateToUse) && dateToUse.length >= 3) {
        const [y, m, d, h = 0, min = 0, s = 0] = dateToUse;
        dateToUse = new Date(y, m - 1, d, h, min, s);
      }
      return {
        id: `sti-${test.testId}`,
        date: dateToUse,
        doctor: test.staffName || test.consultantName || 'Chưa xác định',
        diagnosis: test.serviceName || 'Xét nghiệm STI',
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'Khám tổng quát':
        return '#4A90E2'; // Medical blue
      case 'Chuyên khoa':
        return '#9B59B6'; // Medical purple
      case 'Tư vấn':
        return '#1ABC9C'; // Medical teal
      case 'Xét nghiệm':
      case 'Xét nghiệm STI':
        return '#F39C12'; // Medical orange
      default:
        return '#607D8B'; // Medical gray-blue
    }
  };

  const getPaymentMethodName = (method) => {
    if (!method) return 'Không xác định';

    switch (method) {
      case 'Cash on Delivery':
      case 'COD':
        return 'Tiền mặt';
      case 'Credit Card':
      case 'VISA':
        return 'Thẻ tín dụng';
      case 'QR Code Transfer':
      case 'QR_CODE':
        return 'Chuyển khoản QR';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản';
      default:
        return method;
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

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'Completed':
      case 'Hoàn thành':
        return 'Hoàn thành';
      case 'Results Available':
      case 'RESULTED':
        return 'Đã có kết quả';
      case 'Confirmed':
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'Sample Collected':
      case 'SAMPLED':
        return 'Đã lấy mẫu';
      case 'Cancelled':
      case 'CANCELED':
      case 'Hủy':
        return 'Đã hủy';
      case 'Pending':
      case 'PENDING':
      case 'Đang xử lý':
        return 'Đang xử lý';
      case 'UNKNOWN':
        return 'Không xác định';
      default:
        return status;
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Lịch sử khám bệnh', 14, 16);

    const tableColumn = [
      'Ngày khám',
      'Bác sĩ',
      'Dịch vụ',
      'Trạng thái',
      'Ghi chú',
    ];
    const tableRows = filteredRecords.map((record) => [
      formatDateDisplay(record.date),
      record.doctor,
      record.diagnosis,
      record.displayStatus || record.status,
      record.notes || '',
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { font: 'helvetica', fontSize: 10 },
    });

    doc.save('lich_su_kham_benh.pdf');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFrom(null);
    setPage(0);
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

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
            {error}
            <Button size="small" sx={{ ml: 2 }} onClick={() => fetchSTITests()}>
              Thử lại
            </Button>
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={40} color="primary" />
          </Box>
        )}

        {!loading && (
          <>
            <TableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày khám</TableCell>
                    <TableCell>Bác sĩ</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thanh toán</TableCell>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon
                              sx={{ mr: 1, fontSize: 16, color: '#4A90E2' }}
                            />
                            {formatDateDisplay(record.date)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DoctorIcon
                              sx={{ mr: 1, fontSize: 16, color: '#4A90E2' }}
                            />
                            {record.doctor}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.diagnosis}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTypeName(record.type)}
                            size="small"
                            sx={{
                              backgroundColor: `${getTypeColor(record.type)}15`,
                              color: getTypeColor(record.type),
                              border: `1px solid ${getTypeColor(record.type)}30`,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={(() => {
                              const status =
                                record.displayStatus || record.status;
                              switch (status) {
                                case 'RESULTED':
                                  return 'Đã có kết quả xét nghiệm, bạn có thể xem kết quả';
                                case 'COMPLETED':
                                  return 'Quá trình xét nghiệm đã hoàn tất';
                                case 'CONFIRMED':
                                  return 'Đã xác nhận thông tin, chờ lấy mẫu';
                                case 'SAMPLED':
                                  return 'Đã lấy mẫu, đang xét nghiệm';
                                case 'CANCELED':
                                  return 'Xét nghiệm đã bị hủy';
                                case 'PENDING':
                                  return 'Đang chờ xác nhận thông tin';
                                default:
                                  return status;
                              }
                            })()}
                            arrow
                            placement="top"
                          >
                            <Chip
                              label={getStatusDisplayName(
                                record.displayStatus || record.status
                              )}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(record.status)}15`,
                                color: getStatusColor(record.status),
                                border: `1px solid ${getStatusColor(record.status)}30`,
                                fontWeight: 600,
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {record.paymentMethod && (
                            <Chip
                              label={getPaymentMethodName(record.paymentMethod)}
                              size="small"
                              sx={{
                                backgroundColor: '#F3F4F630',
                                color: '#64748b',
                                border: '1px solid #e2e8f080',
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={record.notes || 'Không có ghi chú'}
                            placement="top"
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 150,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {record.notes || 'Không có ghi chú'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            {record.hasTestResults ? (
                              <Tooltip title="Xem kết quả chi tiết" arrow>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleViewTestResults(record.testId)
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                    '&:hover': {
                                      backgroundColor:
                                        'rgba(52, 152, 219, 0.2)',
                                    },
                                  }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Chưa có kết quả" arrow>
                                <IconButton
                                  disabled
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    color: 'rgba(0, 0, 0, 0.3)',
                                  }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            Không tìm thấy dữ liệu phù hợp với bộ lọc
                          </Typography>
                        </Box>
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
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          </>
        )}
      </StyledPaper>

      {/* Modal for test results */}
      {selectedTestId && (
        <TestResults
          testId={selectedTestId}
          onClose={() => setSelectedTestId(null)}
        />
      )}
    </Box>
  );
};

export default MedicalHistoryContent;

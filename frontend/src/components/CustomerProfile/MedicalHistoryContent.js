/**
 * MedicalHistoryContent.js - Component quản lý lịch sử khám bệnh
 *
 * Chức năng:
 * - Hiển thị danh sách lịch sử khám bệnh
 * - Chi tiết từng lần khám (bác sĩ, ngày, chẩn đoán, đơn thuốc)
 * - Medical reports và test results
 * - Download medical documents
 * - Timeline view của medical history
 * - Hiển thị kết quả xét nghiệm STI từ API
 *
 * Features:
 * - Chronological medical timeline
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  Description as ReportIcon,
  CalendarToday as CalendarIcon,
  Science as ScienceIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// Import dateUtils for consistent date formatting
import { formatDateDisplay } from '../../utils/dateUtils.js';
// Import stiService for API calls
import stiService from '../../services/stiService.js';
// Import notification system
import notify from '../../utils/notification.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)', // Light glass background for medical
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)', // Medical blue border
  color: '#2D3748', // Dark text for readability
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', // Lighter shadow
}));

const MedicalCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #FFFFFF, #F5F7FA)', // Light card background
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: '1px solid rgba(74, 144, 226, 0.12)', // Medical blue border
  color: '#2D3748', // Dark text for readability
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 25px 0 rgba(74, 144, 226, 0.2)', // Medical blue shadow
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: '1px solid rgba(74, 144, 226, 0.12)',
  borderRadius: '8px',
  boxShadow: 'none',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(74, 144, 226, 0.12)',
  padding: '12px 16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(74, 144, 226, 0.03)',
  },
  '&:hover': {
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
}));

// Test Results Component
const TestResults = ({ testId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching test results for test ID: ${testId}`);

        const response = await stiService.getTestResults(testId);
        console.log('Test results response:', response);

        const data = response && response.data ? response.data : response;
        console.log('Test results data:', data);

        if (
          !data ||
          (Array.isArray(data) && data.length === 0) ||
          (data.data && Array.isArray(data.data) && data.data.length === 0)
        ) {
          setError('Không có dữ liệu kết quả xét nghiệm cho lần khám này.');
          setResults([]);
        } else {
          let arr = [];
          if (data.data && Array.isArray(data.data)) {
            setResults(data.data);
            arr = data.data.map((r) => r.testName || 'default');
          } else if (Array.isArray(data)) {
            setResults(data);
            arr = data.map((r) => r.testName || 'default');
          }
          // Khi có dữ liệu, mở tất cả accordion
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError(
          `Lỗi khi tải dữ liệu từ API: ${apiError?.message || apiError?.toString() || 'Không xác định'}`
        );
        // Không set dữ liệu mẫu ở đây nữa, chỉ hiển thị lỗi thật
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestResults();
    }
  }, [testId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  if (!results || results.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Chưa có kết quả xét nghiệm cho lần khám này.
      </Alert>
    );
  }

  // Hiển thị tất cả kết quả trong một bảng duy nhất, không group theo testName
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ScienceIcon sx={{ mr: 1 }} />
        Kết quả xét nghiệm
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StyledTableContainer component={Paper}>
        <Table size="small" aria-label="test results table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Thành phần xét nghiệm</StyledTableCell>
              <StyledTableCell align="center">Kết quả</StyledTableCell>
              <StyledTableCell align="center">
                Giới hạn bình thường
              </StyledTableCell>
              <StyledTableCell align="center">Đơn vị</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => {
              // Map kết quả sang tiếng Việt
              let displayResult = result.resultValue;
              if (typeof displayResult === 'string') {
                if (displayResult.trim().toLowerCase() === 'negative')
                  displayResult = 'Âm tính';
                if (displayResult.trim().toLowerCase() === 'positive')
                  displayResult = 'Dương tính';
                if (displayResult.trim().toLowerCase() === 'not detected')
                  displayResult = 'Không phát hiện';
                if (displayResult.trim().toLowerCase() === 'detected')
                  displayResult = 'Phát hiện';
              }
              // Map giới hạn bình thường sang tiếng Việt
              let displayNormal = result.normalRange;
              if (typeof displayNormal === 'string') {
                if (displayNormal.trim().toLowerCase() === 'negative')
                  displayNormal = 'Âm tính';
                if (displayNormal.trim().toLowerCase() === 'positive')
                  displayNormal = 'Dương tính';
                if (displayNormal.trim().toLowerCase() === 'positive/negative')
                  displayNormal = 'Âm tính/Dương tính';
                if (displayNormal.trim().toLowerCase() === 'not detected')
                  displayNormal = 'Không phát hiện';
                if (displayNormal.trim().toLowerCase() === 'detected')
                  displayNormal = 'Phát hiện';
              }
              // Map đơn vị sang tiếng Việt
              let displayUnit = result.unit;
              if (typeof displayUnit === 'string') {
                if (displayUnit.trim().toLowerCase() === 'positive/negative')
                  displayUnit = 'Âm tính/Dương tính';
                if (displayUnit.trim().toLowerCase() === 'titer')
                  displayUnit = 'Hiệu giá';
                if (displayUnit.trim().toLowerCase() === 'not detected')
                  displayUnit = 'Không phát hiện';
                if (displayUnit.trim().toLowerCase() === 'detected')
                  displayUnit = 'Phát hiện';
              }
              return (
                <StyledTableRow key={result.resultId}>
                  <StyledTableCell component="th" scope="row">
                    {result.componentName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color:
                          result.resultValue === result.normalRange
                            ? '#10b981'
                            : '#e53e3e',
                      }}
                    >
                      {displayResult}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {displayNormal}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {displayUnit}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

const MedicalHistoryContent = () => {
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [stiTests, setStiTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); // Define fetchSTITests as a named function to allow calling it from retry button
  const fetchSTITests = async () => {
    try {
      setIsLoading(true);
      setFetchError(null); // Reset error state before fetching

      const response = await stiService.getMySTITests();

      if (response && response.data) {
        console.log('STI tests fetched:', response.data);
        setStiTests(response.data);
      } else {
        console.warn('No STI tests data returned from API');
        setStiTests([]);
      }
    } catch (error) {
      console.error('Error fetching STI tests:', error);
      setFetchError(
        'Không thể tải dữ liệu xét nghiệm STI. Vui lòng thử lại sau.'
      );
      notify.error('Lỗi', 'Không thể tải dữ liệu xét nghiệm STI.');
      setStiTests([]);
    } finally {
      setIsLoading(false);
    }
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

  // // Sample static medical records for demo
  // const staticMedicalRecords = [
  //   {
  //     id: 1,
  //     date: '2025-05-28',
  //     doctor: 'Bác sĩ Nguyễn Thị Mai',
  //     diagnosis: 'Khám tổng quát định kỳ',
  //     status: 'Hoàn thành',
  //     displayStatus: 'Hoàn thành',
  //     type: 'Khám tổng quát',
  //     notes: 'Sức khỏe tốt, không có vấn đề bất thường',
  //     testId: 1001,
  //     hasTestResults: true,
  //   },
  //   {
  //     id: 2,
  //     date: '2025-05-15',
  //     doctor: 'Bác sĩ Trần Văn Nam',
  //     diagnosis: 'Tư vấn dinh dưỡng',
  //     status: 'Hoàn thành',
  //     displayStatus: 'Hoàn thành',
  //     type: 'Tư vấn',
  //     notes: 'Cần điều chỉnh chế độ ăn uống',
  //     testId: null,
  //     hasTestResults: false,
  //   },
  //   {
  //     id: 3,
  //     date: '2025-04-20',
  //     doctor: 'Bác sĩ Lê Thị Hoa',
  //     diagnosis: 'Khám chuyên khoa tim mạch',
  //     status: 'Hoàn thành',
  //     displayStatus: 'Hoàn thành',
  //     type: 'Chuyên khoa',
  //     notes: 'Theo dõi huyết áp thường xuyên',
  //     testId: null,
  //     hasTestResults: false,
  //   },
  //   {
  //     id: 4,
  //     date: '2025-04-05',
  //     doctor: 'Bác sĩ Phạm Minh Tuấn',
  //     diagnosis: 'Xét nghiệm máu định kỳ',
  //     status: 'Hoàn thành',
  //     displayStatus: 'Hoàn thành',
  //     type: 'Xét nghiệm',
  //     notes: 'Các chỉ số trong giới hạn bình thường',
  //     testId: 1002,
  //     hasTestResults: true,
  //   },  // ];
  // Combine STI tests with static medical records
  const medicalRecords = [
    ...getStiTestsAsMedicalRecords(),
    // ...staticMedicalRecords,
  ];

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
  const handleViewTestResults = (testId) => {
    if (!testId) {
      console.warn('Attempted to view test results with null testId');
      notify.warning(
        'Không thể xem kết quả',
        'Không tìm thấy mã xét nghiệm hợp lệ.'
      );
      return;
    }

    console.log(`Viewing test results for testId: ${testId}`);

    setSelectedTestId(testId);
    setShowTestResults(true);
    notify.info('Đang tải kết quả', 'Đang tải dữ liệu kết quả xét nghiệm...', {
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

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: '#2D3748',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CalendarIcon sx={{ color: '#3b82f6', fontSize: 36, mr: 2 }} />
        Lịch sử khám bệnh
      </Typography>
      <Typography variant="body1" sx={{ color: '#4A5568', mb: 4, ml: 6 }}>
        Quản lý và theo dõi các lần khám bệnh của bạn.
      </Typography>
      {/* Medical Records Grid */}
      <Grid container spacing={3}>
        {medicalRecords.map((record) => (
          <Grid item xs={12} md={6} key={record.id}>
            <MedicalCard>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HospitalIcon
                      sx={{ color: '#4CAF50', mr: 1, fontSize: 24 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#2D3748',
                      }}
                    >
                      {record.diagnosis}
                    </Typography>
                  </Box>
                  <Chip
                    label={(() => {
                      // Việt hóa trạng thái
                      const status = record.displayStatus || record.status;
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
                    })()}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(record.status)}20`,
                      color: getStatusColor(record.status),
                      border: `1px solid ${getStatusColor(record.status)}40`,
                      fontWeight: 600,
                    }}
                  />
                </Box>
                {/* Doctor and Date */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <DoctorIcon
                      sx={{ color: '#4CAF50', mr: 1, fontSize: 18 }}
                    />
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      {record.doctor}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <TimeIcon sx={{ color: '#4A90E2', mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      {formatDateDisplay(record.date)}
                    </Typography>
                  </Box>
                </Box>
                {/* Type */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={(() => {
                      // Việt hóa loại khám
                      switch (record.type) {
                        case 'Khám tổng quát':
                          return 'Khám tổng quát';
                        case 'Chuyên khoa':
                          return 'Khám chuyên khoa';
                        case 'Tư vấn':
                          return 'Tư vấn';
                        case 'Xét nghiệm':
                        case 'Xét nghiệm STI':
                          return 'Xét nghiệm STI';
                        default:
                          return record.type;
                      }
                    })()}
                    size="small"
                    sx={{
                      backgroundColor: `${getTypeColor(record.type)}20`,
                      color: getTypeColor(record.type),
                      border: `1px solid ${getTypeColor(record.type)}40`,
                      fontWeight: 500,
                    }}
                  />
                  {record.paymentMethod && (
                    <Chip
                      label={(() => {
                        // Việt hóa phương thức thanh toán
                        switch (record.paymentMethod) {
                          case 'Cash on Delivery':
                            return 'Thanh toán khi nhận';
                          case 'Credit Card':
                            return 'Thẻ tín dụng';
                          case 'QR Code Transfer':
                            return 'Chuyển khoản QR';
                          default:
                            return record.paymentMethod;
                        }
                      })()}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: '#F3F4F630',
                        color: '#64748b',
                        border: '1px solid #e2e8f080',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                {/* Notes */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(74, 144, 226, 0.1)',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <ReportIcon
                      sx={{ color: '#4A90E2', mr: 1, fontSize: 16 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4A5568',
                        fontWeight: 600,
                      }}
                    >
                      Ghi chú
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      lineHeight: 1.5,
                    }}
                  >
                    {record.notes}
                  </Typography>
                </Box>
                {/* Action Buttons */}
                <Button
                  variant="contained"
                  startIcon={<ScienceIcon />}
                  fullWidth
                  onClick={() =>
                    record.hasTestResults &&
                    handleViewTestResults(record.testId)
                  }
                  disabled={!record.hasTestResults}
                  sx={{
                    backgroundColor: record.hasTestResults
                      ? '#10b981'
                      : '#cbd5e0',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '12px',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: record.hasTestResults
                        ? '#059669'
                        : '#cbd5e0',
                      transform: record.hasTestResults
                        ? 'translateY(-2px)'
                        : 'none',
                    },
                    transition: 'all 0.3s ease',
                    cursor: record.hasTestResults ? 'pointer' : 'not-allowed',
                    opacity: record.hasTestResults ? 1 : 0.7,
                  }}
                >
                  {record.hasTestResults ? 'Xem kết quả' : 'Chưa có kết quả'}
                </Button>
              </CardContent>
            </MedicalCard>
          </Grid>
        ))}
      </Grid>
      {/* Test Results Dialog */}
      <Dialog
        open={showTestResults}
        onClose={() => setShowTestResults(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(74, 144, 226, 0.1)',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScienceIcon sx={{ color: '#4A90E2', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Kết quả xét nghiệm
            </Typography>
          </Box>
          <IconButton
            onClick={() => setShowTestResults(false)}
            size="small"
            sx={{ color: '#64748b' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedTestId && <TestResults testId={selectedTestId} />}
        </DialogContent>
      </Dialog>
      {/* Summary Card */}
      <StyledPaper sx={{ p: 4, mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: '#2D3748',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HospitalIcon sx={{ mr: 2, color: '#4CAF50' }} />
          Tóm tắt sức khỏe
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#10b981', mb: 1, fontWeight: 600 }}
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#3b82f6', mb: 1, fontWeight: 600 }}
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
          </Grid>
        </Grid>
      </StyledPaper>
      {/* STI Test Results Section */}
      <Box sx={{ mt: 4 }}>
        <StyledPaper sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: '#2D3748',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ScienceIcon sx={{ mr: 2, color: '#9B59B6' }} />
            Xét nghiệm STI
          </Typography>
          {stiTests && stiTests.length > 0 ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Bạn có {stiTests.length} xét nghiệm STI trong hệ thống. Xét
                nghiệm mới nhất vào ngày{' '}
                {stiTests[0]
                  ? formatDateDisplay(
                      stiTests[0].appointmentDate || stiTests[0].createdAt
                    )
                  : 'chưa xác định'}
                .
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ScienceIcon />}
                  onClick={() => {
                    // Find the most recent test with results available
                    const testWithResults = stiTests.find(
                      (test) =>
                        test.status === 'RESULTED' ||
                        test.status === 'COMPLETED'
                    );
                    if (testWithResults) {
                      handleViewTestResults(testWithResults.testId);
                    } else if (stiTests[0]) {
                      // If no test has results, show the newest test
                      handleViewTestResults(stiTests[0].testId);
                    } else {
                      // Fallback to a demo test ID
                      handleViewTestResults(1001);
                    }
                  }}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: '#9B59B6',
                    '&:hover': {
                      backgroundColor: '#8E44AD',
                    },
                  }}
                >
                  Xem kết quả xét nghiệm STI mới nhất
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
                Chưa có dữ liệu xét nghiệm STI trong hệ thống.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
                onClick={() => {
                  // Fallback to a demo test ID for demonstration purposes
                  handleViewTestResults(1001);
                }}
              >
                Xem dữ liệu mẫu
              </Button>
            </Box>
          )}
        </StyledPaper>
      </Box>
    </Box>
  );
};

export default MedicalHistoryContent;

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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  styled,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import stiService from '../../services/stiService';

// Styled Components
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

const ResultBadge = styled(Chip)(({ theme, status }) => {
  const colors = {
    positive: {
      bgcolor: '#e53e3e15',
      color: '#e53e3e',
      borderColor: '#e53e3e',
    },
    negative: {
      bgcolor: '#10b98115',
      color: '#10b981',
      borderColor: '#10b981',
    },
  };

  return {
    fontWeight: 600,
    borderWidth: 1,
    borderStyle: 'solid',
    ...(colors[status] || {}),
  };
});

const StatusChip = styled(Chip)(({ theme, completed }) => ({
  fontWeight: 600,
  backgroundColor: completed ? '#10b98115' : '#f59e0b15',
  color: completed ? '#10b981' : '#f59e0b',
  border: `1px solid ${completed ? '#10b981' : '#f59e0b'}`,
}));

const TestInfoCard = styled(Card)(({ theme }) => ({
  marginBottom: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
}));

const TestComponentAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: '1px solid rgba(74, 144, 226, 0.12)',
  borderRadius: '8px !important',
  '&:before': {
    display: 'none',
  },
  marginBottom: '8px',
}));

const TestComponentSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: 'rgba(74, 144, 226, 0.03)',
  borderRadius: '8px',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
}));

const ProgressText = styled(Typography)(({ theme }) => ({
  marginLeft: '16px',
  fontWeight: 600,
}));

/**
 * TestResultsModalContent - Component hiển thị kết quả xét nghiệm STI trong modal
 *
 * @param {object} props - Component properties
 * @param {number|string} props.testId - ID của xét nghiệm cần hiển thị
 * @param {function} props.onClose - Hàm để đóng modal (tùy chọn)
 */
const TestResultsModalContent = ({ testId, onClose }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('package'); // 'package' or 'component'
  const [testPackageInfo, setTestPackageInfo] = useState(null);
  const [expandedAccordions, setExpandedAccordions] = useState({});

  // Handler for accordion expansion
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedAccordions({
      ...expandedAccordions,
      [panel]: isExpanded,
    });
  };

  // Function to convert API values to display labels
  const translateValue = (value, type) => {
    if (typeof value !== 'string') return value;

    const lowerValue = value.trim().toLowerCase();

    // For result values or normal ranges
    if (lowerValue === 'negative') return 'Âm tính';
    if (lowerValue === 'positive') return 'Dương tính';
    if (lowerValue === 'not detected') return 'Không phát hiện';
    if (lowerValue === 'detected') return 'Phát hiện';
    if (lowerValue === 'positive/negative' && type === 'unit')
      return 'Âm tính/Dương tính';
    if (lowerValue === 'titer' && type === 'unit') return 'Hiệu giá';

    return value;
  };

  // Function to fetch test type (package or service) information
  const fetchTestType = async (testId) => {
    try {
      const response = await stiService.getSTITestDetails(testId);
      if (response && response.data) {
        return {
          isPackage: response.data.packageId !== null,
          packageId: response.data.packageId,
          serviceId: response.data.serviceId,
          packageName: response.data.serviceName, // In the response, serviceName has package name too
          serviceName: response.data.serviceName,
        };
      }
      return { isPackage: false };
    } catch (err) {
      console.error('Error fetching test type:', err);
      return { isPackage: false };
    }
  };

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching test results for test ID: ${testId}`);

        // First get test type (package or service)
        const testTypeInfo = await fetchTestType(testId);
        console.log('Test type info:', testTypeInfo);

        const response = await stiService.getTestResults(testId);
        console.log('Test results response:', response);

        // Check for the new response format with success property
        if (
          response &&
          response.success === true &&
          Array.isArray(response.data)
        ) {
          console.log('Using new API response format');
          const data = response.data;

          // Determine view mode based on whether this is a package or service test
          setViewMode(testTypeInfo.isPackage ? 'package' : 'component');
          setResults(data);

          if (testTypeInfo.isPackage) {
            // For packages, organize results by services
            console.log('Processing package test results');
            // We'll use service IDs to group test components

            // Create package info with test metadata
            setTestPackageInfo({
              testId: testId,
              packageId: testTypeInfo.packageId,
              packageName: testTypeInfo.packageName || 'Gói xét nghiệm STI',
              customerName: data[0]?.reviewerName || 'Khách hàng',
              reviewedAt: data[0]?.reviewedAt,
              completedComponents: data.length,
              totalComponents: data.length,
              components: data.map((result) => ({
                componentName: result.componentName,
                componentId: result.componentId,
                results: [
                  {
                    componentName: result.componentName,
                    resultValue: result.resultValue,
                    normalRange: result.normalRange,
                    unit: result.unit,
                  },
                ],
                hasResults: true,
              })),
            });
          } else {
            // For single service tests, use standard component view
            if (data.length > 0) {
              setTestPackageInfo({
                testId: data[0].testId,
                packageName:
                  testTypeInfo.serviceName ||
                  data[0].testName ||
                  `Xét nghiệm ${data[0].componentName}`,
                customerName: data[0].reviewerName || 'Khách hàng',
                reviewedAt: data[0].reviewedAt,
                completedComponents: data.length,
                totalComponents: data.length,
              });
            }
          }
        } else {
          // Handle legacy/alternative format
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
            // Determine if this is package data or component data
            const isPackage =
              data.packageName ||
              (data.components && Array.isArray(data.components));
            setViewMode(isPackage ? 'package' : 'component');

            if (isPackage) {
              setTestPackageInfo(data);

              // Initialize all accordions as expanded
              if (data.components && Array.isArray(data.components)) {
                const accordionState = {};
                data.components.forEach((comp, index) => {
                  accordionState[`panel-${index}`] = true;
                });
                setExpandedAccordions(accordionState);
              }
            }

            // Set results based on data structure
            if (data.data && Array.isArray(data.data)) {
              setResults(data.data);
            } else if (Array.isArray(data)) {
              setResults(data);
            } else if (data.components && Array.isArray(data.components)) {
              setResults(data.components);
            } else {
              setResults([data]); // Single result
            }
          }
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError(
          `Lỗi khi tải dữ liệu từ API: ${apiError?.message || apiError?.toString() || 'Không xác định'}`
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestResults();
    }
  }, [testId]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Error or no results state
  if (!results || results.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Chưa có kết quả xét nghiệm cho lần khám này.
      </Alert>
    );
  }

  // Package View
  if (viewMode === 'package' && testPackageInfo) {
    const progress = testPackageInfo.completedComponents
      ? (testPackageInfo.completedComponents /
          testPackageInfo.totalComponents) *
        100
      : 100;

    return (
      <Box sx={{ mt: 3 }}>
        {/* Package Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <ScienceIcon sx={{ mr: 1 }} />
            {testPackageInfo.packageName || 'Gói xét nghiệm STI'}
          </Typography>

          {/* Status Message */}
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2 }}
          >
            {results.some(
              (result) => result.resultValue?.toLowerCase() !== 'negative'
            )
              ? 'Đã phát hiện chỉ số bất thường trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ.'
              : 'Đã cập nhật kết quả xét nghiệm thành công. Tất cả các chỉ số đều bình thường.'}
          </Alert>

          {/* Test Information */}
          <TestInfoCard>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Mã xét nghiệm:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    #{testPackageInfo.testId || testId}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Khách hàng:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {testPackageInfo.customerName || 'Khách hàng'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày xét nghiệm:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {Array.isArray(testPackageInfo.reviewedAt) &&
                    testPackageInfo.reviewedAt.length >= 3
                      ? `${testPackageInfo.reviewedAt[2]}/${testPackageInfo.reviewedAt[1]}/${testPackageInfo.reviewedAt[0]}`
                      : 'Không xác định'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Mã gói:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {testPackageInfo.packageId
                      ? `P${testPackageInfo.packageId}`
                      : 'Không xác định'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Người đánh giá:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {results[0]?.reviewerName || 'Không xác định'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </TestInfoCard>

          {/* Progress Bar */}
          <ProgressContainer>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(74, 144, 226, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: '#10b981',
                  },
                }}
              />
            </Box>
            <ProgressText color="text.secondary">
              {Math.round(progress)}% hoàn thành
            </ProgressText>
          </ProgressContainer>
        </Box>

        {/* Components List */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: '#3b82f6',
            }}
          >
            Danh sách các dịch vụ trong gói xét nghiệm:
          </Typography>

          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Accordion Test Components - Group by Component Type */}
          {testPackageInfo.components &&
            testPackageInfo.components.map((component, index) => (
              <TestComponentAccordion
                key={`panel-${index}`}
                expanded={expandedAccordions[`panel-${index}`] !== false}
                onChange={handleAccordionChange(`panel-${index}`)}
              >
                <TestComponentSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>
                      {component.componentName || `Xét nghiệm ${index + 1}`}
                    </Typography>
                    <Box>
                      {component.hasResults && (
                        <StatusChip
                          label={
                            component.results.some(
                              (r) => r.resultValue?.toLowerCase() !== 'negative'
                            )
                              ? 'Bất thường'
                              : 'Bình thường'
                          }
                          size="small"
                          completed={
                            component.results.some(
                              (r) => r.resultValue?.toLowerCase() !== 'negative'
                            )
                              ? false
                              : true
                          }
                        />
                      )}
                    </Box>
                  </Box>
                </TestComponentSummary>
                <AccordionDetails>
                  {/* Component Results Table */}
                  {component.results && component.results.length > 0 ? (
                    <StyledTableContainer component={Paper}>
                      <Table size="small" aria-label="test results table">
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>
                              Thành phần xét nghiệm
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Kết quả
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Giới hạn bình thường
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Đơn vị
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          {component.results.map((result, resultIdx) => (
                            <StyledTableRow
                              key={`result-${index}-${resultIdx}`}
                            >
                              <StyledTableCell component="th" scope="row">
                                {result.componentName}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    color:
                                      result.resultValue?.toLowerCase() ===
                                      'negative'
                                        ? '#10b981'
                                        : '#e53e3e',
                                  }}
                                >
                                  {translateValue(result.resultValue, 'result')}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {translateValue(result.normalRange, 'range')}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {translateValue(result.unit, 'unit')}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  ) : (
                    <Alert severity="info">
                      Chưa có kết quả chi tiết cho thành phần xét nghiệm này.
                    </Alert>
                  )}

                  {/* Interpretation if available */}
                  {component.results.some(
                    (r) => r.resultValue?.toLowerCase() !== 'negative'
                  ) && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: 'rgba(229, 62, 62, 0.05)',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#e53e3e', fontWeight: 500 }}
                      >
                        Lưu ý: Có kết quả bất thường cần được bác sĩ tư vấn chi
                        tiết.
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </TestComponentAccordion>
            ))}
        </Box>

        {/* Summary Box */}
        <Box
          sx={{
            mt: 4,
            mb: 3,
            p: 3,
            bgcolor: '#f0f9ff',
            borderRadius: 2,
            border: '1px solid #bae6fd',
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: '#0369a1', fontWeight: 600 }}
          >
            Kết luận xét nghiệm
          </Typography>
          <Typography variant="body1">
            {results.some(
              (result) => result.resultValue?.toLowerCase() !== 'negative'
            )
              ? 'Đã phát hiện dấu hiệu bất thường trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chi tiết.'
              : 'Tất cả các chỉ số đều trong giới hạn bình thường. Kết quả xét nghiệm âm tính.'}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            sx={{ bgcolor: '#3b82f6' }}
            disabled
          >
            Xuất file PDF (sắp ra mắt)
          </Button>
        </Box>
      </Box>
    );
  }

  // Component View - For individual tests
  return (
    <Box sx={{ mt: 3 }}>
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
          sx={{
            fontWeight: 600,
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ScienceIcon sx={{ mr: 1 }} />
          Kết quả xét nghiệm
        </Typography>
        <Chip
          label={
            results.some((r) => r.resultValue?.toLowerCase() !== 'negative')
              ? 'DƯƠNG TÍNH'
              : 'ÂM TÍNH'
          }
          color={
            results.some((r) => r.resultValue?.toLowerCase() !== 'negative')
              ? 'error'
              : 'success'
          }
          variant="filled"
        />
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Test Info Section */}
      <Card sx={{ mb: 3, borderRadius: '8px' }}>
        <CardContent>
          <Grid container>
            {/* Left column - Test icon */}
            <Grid
              item
              xs={2}
              md={1}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <ScienceIcon color="primary" sx={{ fontSize: '2.5rem' }} />
            </Grid>

            {/* Middle column - Test Info */}
            <Grid item xs={10} md={7}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {testPackageInfo?.packageName ||
                  results[0]?.testName ||
                  'Xét nghiệm phát hiện sớm virus HIV trong máu'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Mã xét nghiệm:</strong> #
                  {results[0]?.testId || testId || '3'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Khách hàng:</strong>{' '}
                  {results[0]?.reviewerName || 'Khách hàng'}
                </Typography>
                {results[0]?.reviewedAt && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Ngày làm xét nghiệm:</strong>{' '}
                    {Array.isArray(results[0]?.reviewedAt) &&
                    results[0].reviewedAt.length >= 3
                      ? `${results[0].reviewedAt[2]}/${results[0].reviewedAt[1]}/${results[0].reviewedAt[0]}`
                      : 'Không xác định'}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Right column - status info */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái:
                </Typography>
                <Chip
                  label="ĐÃ CÓ KẾT QUẢ"
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Test Components Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: '#3b82f6',
              color: 'white',
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {results.length}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Các thành phần xét nghiệm
          </Typography>
        </Box>

        {/* Component Results Table */}
        <StyledTableContainer component={Paper}>
          <Table size="small" aria-label="test results table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Thành phần</StyledTableCell>
                <StyledTableCell>Đơn vị</StyledTableCell>
                <StyledTableCell>Giới hạn bình thường</StyledTableCell>
                <StyledTableCell>Kết quả</StyledTableCell>
                <StyledTableCell>Thời gian</StyledTableCell>
                <StyledTableCell>Người đánh giá</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <StyledTableRow key={`result-${index}`}>
                  <StyledTableCell component="th" scope="row">
                    {result.componentName || 'HIV Antibody'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {translateValue(result.unit || 'Positive/Negative', 'unit')}
                  </StyledTableCell>
                  <StyledTableCell>
                    <ResultBadge
                      label={translateValue(
                        result.normalRange || 'Negative',
                        'range'
                      )}
                      size="small"
                      status="negative"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <ResultBadge
                      label={translateValue(
                        result.resultValue || 'Negative',
                        'result'
                      )}
                      size="small"
                      status={
                        result.resultValue?.toLowerCase() === 'negative'
                          ? 'negative'
                          : 'positive'
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {Array.isArray(result.reviewedAt) &&
                    result.reviewedAt.length >= 6
                      ? `${result.reviewedAt[2]}/${result.reviewedAt[1]}/${result.reviewedAt[0]} ${result.reviewedAt[3]}:${result.reviewedAt[4]}`
                      : 'Không xác định'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {result.reviewerName || 'Không xác định'}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>

      {/* Result Summary */}
      <Box
        sx={{
          mt: 4,
          mb: 3,
          p: 3,
          bgcolor: '#f0f9ff',
          borderRadius: 2,
          border: '1px solid #bae6fd',
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, color: '#0369a1', fontWeight: 600 }}
        >
          Kết luận xét nghiệm
        </Typography>
        <Typography variant="body1">
          {results.some(
            (result) => result.resultValue?.toLowerCase() !== 'negative'
          )
            ? 'Đã phát hiện dấu hiệu dương tính trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chi tiết.'
            : 'Tất cả các chỉ số đều trong giới hạn bình thường. Kết quả xét nghiệm âm tính.'}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onClose}>
          Đóng
        </Button>
        <Button
          variant="contained"
          startIcon={<PdfIcon />}
          sx={{ bgcolor: '#3b82f6' }}
          disabled
        >
          Xuất file PDF (sắp ra mắt)
        </Button>
      </Box>
    </Box>
  );
};

export default TestResultsModalContent;

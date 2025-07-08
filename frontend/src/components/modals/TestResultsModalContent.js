import React, { useState, useEffect, useRef } from 'react';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import ExportTestResultPDF from './ExportTestResultPDF';
import ConclusionDisplay from '../common/ConclusionDisplay';
import PackageTestResultView from './PackageTestResultView';
import ServiceTestResultView from './ServiceTestResultView';

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
  const printRef = useRef();
  const [showExportUI, setShowExportUI] = useState(false);
  // New state for consultantNote fetched separately if missing
  const [consultantNoteFromApi, setConsultantNoteFromApi] = useState('');

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
          customerName: response.data.customerName,
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

          // Sau khi fetch kết quả và xác định là package:
          if (testTypeInfo.isPackage) {
            // Group components by serviceId
            const grouped = {};
            data.forEach((result) => {
              const sid = result.serviceId || 'unknown';
              if (!grouped[sid]) {
                grouped[sid] = {
                  serviceId: sid,
                  serviceName: result.serviceName || `Dịch vụ ${sid}`,
                  components: [],
                };
              }
              grouped[sid].components.push(result);
            });
            const services = Object.values(grouped);
            // Gọi API lấy tên dịch vụ cho từng serviceId (nếu có)
            await Promise.all(
              services.map(async (svc) => {
                if (svc.serviceId !== 'unknown') {
                  try {
                    const res = await stiService.getSTIServiceById(
                      svc.serviceId
                    );
                    if (res && res.data && res.data.name) {
                      svc.serviceName = res.data.name;
                    }
                  } catch (e) {
                    // Bỏ qua lỗi, giữ tên cũ
                  }
                }
              })
            );
            setTestPackageInfo({
              ...testTypeInfo,
              testId: testId,
              packageId: testTypeInfo.packageId,
              packageName: testTypeInfo.packageName || 'Gói xét nghiệm STI',
              customerName:
                testTypeInfo.customerName ||
                data[0]?.customerName ||
                'Khách hàng',
              reviewedAt: data[0]?.reviewedAt,
              services,
            });
          } else {
            // For single service tests, use standard component view
            if (data.length > 0) {
              setTestPackageInfo({
                ...testTypeInfo,
                testId: data[0].testId,
                packageName:
                  testTypeInfo.serviceName ||
                  data[0].testName ||
                  `Xét nghiệm ${data[0].componentName}`,
                customerName: data[0].customerName || 'Khách hàng',
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

        // After setting results and testPackageInfo:
        // Check if consultantNotes is missing, then fetch via getSTITestDetails
        let hasConsultantNote = false;
        if (Array.isArray(results) && results.length > 0) {
          hasConsultantNote = !!results[0]?.consultantNotes;
        }
        if (!hasConsultantNote) {
          // Try to fetch consultantNotes from test details
          try {
            const detailRes = await stiService.getSTITestDetails(testId);
            if (detailRes && detailRes.data && detailRes.data.consultantNotes) {
              setConsultantNoteFromApi(detailRes.data.consultantNotes);
            }
          } catch (e) {
            // Ignore error, just fallback to default
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

  const handleExportPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ket_qua_xet_nghiem.pdf');
  };

  // Chuẩn hóa dữ liệu để truyền sang ExportTestResultPDF
  const getExportData = () => {
    let info = {};
    let rows = [];
    let conclusion = '';
    let customerName = '';
    if (viewMode === 'package' && testPackageInfo) {
      customerName = testPackageInfo.customerName || 'Khách hàng';
      info = {
        testId: testPackageInfo.testId || testId,
        customerName,
        date:
          Array.isArray(testPackageInfo.reviewedAt) &&
          testPackageInfo.reviewedAt.length >= 3
            ? `${testPackageInfo.reviewedAt[2]}/${testPackageInfo.reviewedAt[1]}/${testPackageInfo.reviewedAt[0]}`
            : 'Không xác định',
        packageName: testPackageInfo.packageName,
      };
      // Trả về mảng các service, mỗi service có serviceName và components
      rows = (testPackageInfo.services || []).map((svc) => ({
        serviceName: svc.serviceName,
        components: (svc.components || []).map((c) => ({
          ...c,
          date: info.date,
          reviewerName: customerName,
        })),
      }));
      conclusion =
        testPackageInfo?.consultantNotes ||
        (rows.some((svc) =>
          svc.components.some(
            (r) => r.resultValue?.toLowerCase() !== 'negative'
          )
        )
          ? 'Đã phát hiện dấu hiệu bất thường trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chi tiết.'
          : 'Tất cả các chỉ số đều trong giới hạn bình thường. Kết quả xét nghiệm âm tính.');
    } else if (results && results.length > 0) {
      customerName = results[0]?.customerName || 'Khách hàng';
      info = {
        testId: results[0]?.testId || testId,
        customerName,
        date:
          Array.isArray(results[0]?.reviewedAt) &&
          results[0].reviewedAt.length >= 3
            ? `${results[0].reviewedAt[2]}/${results[0].reviewedAt[1]}/${results[0].reviewedAt[0]}`
            : 'Không xác định',
        packageName: results[0]?.testName
          ? ''
          : testPackageInfo?.packageName || '',
        testName:
          results[0]?.testName ||
          testPackageInfo?.packageName ||
          results[0]?.componentName ||
          '',
      };
      rows = results.map((r) => ({
        ...r,
        date:
          Array.isArray(r.reviewedAt) && r.reviewedAt.length >= 3
            ? `${r.reviewedAt[2]}/${r.reviewedAt[1]}/${r.reviewedAt[0]}`
            : 'Không xác định',
        reviewerName: customerName,
      }));
      conclusion =
        results[0]?.consultantNotes ||
        (rows.some((r) => r.resultValue?.toLowerCase() !== 'negative')
          ? 'Đã phát hiện dấu hiệu dương tính trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chi tiết.'
          : 'Tất cả các chỉ số đều trong giới hạn bình thường. Kết quả xét nghiệm âm tính.');
    }
    return { info, rows, conclusion };
  };

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

  if (viewMode === 'package' && testPackageInfo) {
    return (
      <PackageTestResultView
        testPackageInfo={testPackageInfo}
        results={results}
        error={error}
        expandedAccordions={expandedAccordions}
        handleAccordionChange={handleAccordionChange}
        onClose={onClose}
        showExportUI={showExportUI}
        setShowExportUI={setShowExportUI}
        getExportData={getExportData}
        consultantNoteFromApi={consultantNoteFromApi}
      />
    );
  }

  return (
    <ServiceTestResultView
      results={results}
      testPackageInfo={testPackageInfo}
      error={error}
      onClose={onClose}
      showExportUI={showExportUI}
      setShowExportUI={setShowExportUI}
      getExportData={getExportData}
      consultantNoteFromApi={consultantNoteFromApi}
    />
  );
};

export default TestResultsModalContent;

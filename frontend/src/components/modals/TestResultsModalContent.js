import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

import stiService from '../../services/stiService';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

import PackageTestResultView from './PackageTestResultView';
import ServiceTestResultView from './ServiceTestResultView';

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
  const [testTypeInfo, setTestTypeInfo] = useState(null); // Thêm state cho testTypeInfo
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
        setTestTypeInfo(testTypeInfo); // Lưu vào state

        const response = await stiService.getTestResults(testId);
        console.log('Test results response:', response);

        if (
          response &&
          response.success === true &&
          response.data &&
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          // API trả về object {results, testServiceConsultantNotes}
          const data = response.data.results;
          const testServiceConsultantNotes =
            response.data.testServiceConsultantNotes || [];

          console.log(
            'Processing new API format, isPackage:',
            testTypeInfo.isPackage
          );

          setResults(data);

          if (testTypeInfo.isPackage) {
            setViewMode('package');
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
              testServiceConsultantNotes,
              serviceName: testTypeInfo.serviceName || 'Dịch vụ',
            });
          } else {
            // Single service test - use ServiceTestResultView
            setViewMode('component');
            console.log('Setting up single service test view');
          }

          // After setting results and testPackageInfo:
          // Check if consultantNotes is missing, then fetch via getSTITestDetails
          let hasConsultantNote = false;
          if (Array.isArray(data) && data.length > 0) {
            hasConsultantNote = !!data[0]?.consultantNotes;
          }
          if (!hasConsultantNote) {
            // Try to fetch consultantNotes from test details
            try {
              const detailRes = await stiService.getSTITestDetails(testId);
              if (
                detailRes &&
                detailRes.data &&
                detailRes.data.consultantNotes
              ) {
                setConsultantNoteFromApi(detailRes.data.consultantNotes);
              }
            } catch (e) {
              // Ignore error, just fallback to default
            }
          }
          return;
        }

        // Handle legacy/alternative format - di chuyển phần này xuống sau để xử lý riêng
        await handleLegacyFormat(response, testTypeInfo);
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

    // Hàm xử lý format cũ
    const handleLegacyFormat = async (response, testTypeInfo) => {
      const data = response && response.data ? response.data : response;
      console.log('Processing legacy format, data:', data);

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

      // Check if consultantNotes is missing for legacy format
      const currentResults = data.data || data.components || data;
      let hasConsultantNote = false;
      if (Array.isArray(currentResults) && currentResults.length > 0) {
        hasConsultantNote = !!currentResults[0]?.consultantNotes;
      }
      if (!hasConsultantNote) {
        try {
          const detailRes = await stiService.getSTITestDetails(testId);
          if (detailRes && detailRes.data && detailRes.data.consultantNotes) {
            setConsultantNoteFromApi(detailRes.data.consultantNotes);
          }
        } catch (e) {
          // Ignore error, just fallback to default
        }
      }
    };

    if (testId) {
      fetchTestResults();
    }
  }, [testId]);

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
      testTypeInfo={testTypeInfo}
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

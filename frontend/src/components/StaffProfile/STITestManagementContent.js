/**
 * STITestManagementContent.js
 *
 * Mục đích: Cập nhật kết quả xét nghiệm STI của người dùng
 * - Hiển thị danh sách các xét nghiệm STI mà staff phụ trách
 * - Cập nhật tiến độ và trạng thái xét nghiệm (PENDING, CONFIRMED, SAMPLED, RESULTED, COMPLETED, CANCELED)
 * - Ghi nhận và cập nhật kết quả xét nghiệm thông qua STITestResponse DTO
 * - Cập nhật kết quả cho từng xét nghiệm cụ thể, cả đơn lẻ và trong gói xét nghiệm
 * - Component này KHÔNG dùng để quản lý toàn bộ gói xét nghiệm, mà chỉ để cập nhật kết quả và hiển thị cho người dùng
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  getStaffTests,
  confirmTest,
  addTestResults,
  sampleTest,
  completeTest,
  getPendingTests,
  getConfirmedTests,
  getPackageTestDetails,
  cancelSTITest,
  getTestResultsByTestId,
} from '../../services/stiService';
import { formatDateDisplay } from '../../utils/dateUtils';

// Import icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
// PDF icon removed

// Import the modal components
import SingleTestResultModal from './modals/SingleTestResultModal';
import PackageManagementModal from './modals/PackageManagementModal';
import TestInPackageModal from './modals/TestInPackageModal';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const STITestManagementContent = () => {
  // Status constants for display
  const STATUS_COLORS = useMemo(
    () => ({
      PENDING: '#FFA726', // Orange
      CONFIRMED: '#42A5F5', // Blue
      SAMPLED: '#7E57C2', // Purple
      RESULTED: '#66BB6A', // Green
      COMPLETED: '#26A69A', // Teal
      CANCELED: '#EF5350', // Red
    }),
    []
  );

  const STATUS_LABELS = useMemo(
    () => ({
      PENDING: 'Chờ xử lý',
      CONFIRMED: 'Đã xác nhận',
      SAMPLED: 'Đã lấy mẫu',
      RESULTED: 'Có kết quả',
      COMPLETED: 'Hoàn thành',
      CANCELED: 'Đã hủy',
    }),
    []
  );

  const PAYMENT_LABELS = useMemo(
    () => ({
      COD: 'Tiền mặt',
      VISA: 'Thẻ tín dụng',
      QR_CODE: 'Chuyển khoản QR',
    }),
    []
  ); // State variables
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  // Modals state
  const [openSingleModal, setOpenSingleModal] = useState(false);
  const [openPackageModal, setOpenPackageModal] = useState(false);
  const [openTestInPackageModal, setOpenTestInPackageModal] = useState(false);
  const [selectedTestComponent, setSelectedTestComponent] = useState(null); // Fetch tests based on the active tab
  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (tabValue) {
        case 0: // All tests
          response = await getStaffTests();
          break;
        case 1: // Pending tests
          response = await getPendingTests();
          break;
        case 2: // Confirmed tests
          response = await getConfirmedTests();
          break;
        case 3: // Sampled tests
        case 4: // Resulted tests
        case 5: // Completed tests
          // Lấy tất cả các xét nghiệm của staff, sau đó lọc theo trạng thái
          response = await getStaffTests();
          console.log(
            `Lấy tất cả xét nghiệm, sau đó lọc theo trạng thái cho tab ${response}`
          );
          break;
        default:
          response = await getStaffTests();
      }

      console.log('API response:', response);
      if (response && response.status === 'SUCCESS') {
        console.log('Setting tests data:', response.data);
        const testsData = response.data || [];
        setTests(testsData);
        setFilteredTests(testsData);

        // Count pending tests
        const pendingTests = testsData.filter(
          (test) => test && test.status === 'PENDING'
        );
        setPendingCount(pendingTests.length);
      } else if (response && response.data) {
        // Trường hợp API trả về đúng định dạng nhưng không có status SUCCESS
        console.log('Đang thiết lập dữ liệu thô:', response.data);
        const testsData = response.data || [];
        setTests(testsData);
        setFilteredTests(testsData);

        // Đếm số lượng xét nghiệm đang chờ xử lý
        const pendingTests = testsData.filter(
          (test) => test && test.status === 'PENDING'
        );
        setPendingCount(pendingTests.length);
      } else {
        setError(response?.message || 'Không thể lấy danh sách xét nghiệm');
      }
    } catch (err) {
      setError(
        'Đã xảy ra lỗi khi tải dữ liệu: ' +
          (err.message || 'Lỗi không xác định')
      );
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  }, [tabValue]);

  // Initial data load
  useEffect(() => {
    fetchTests();
  }, [fetchTests]); // Filter function
  useEffect(() => {
    if (!tests || !Array.isArray(tests) || tests.length === 0) {
      console.warn('Dữ liệu xét nghiệm trống hoặc không phải mảng:', tests);
      setFilteredTests([]);
      return;
    }

    console.log('Đang lọc từ dữ liệu xét nghiệm:', tests.length, tests);
    let result = [...tests];

    // Auto-filter based on tab
    if (tabValue === 3) {
      // Filter for SAMPLED tests in tab 3
      result = result.filter((test) => test && test.status === 'SAMPLED');
    } else if (tabValue === 4) {
      // Filter for RESULTED tests in tab 4
      result = result.filter((test) => test && test.status === 'RESULTED');
    } else if (tabValue === 5) {
      // Filter for COMPLETED tests in tab 5
      result = result.filter((test) => test && test.status === 'COMPLETED');
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter((test) => test && test.status === statusFilter);
      console.log('Sau khi lọc theo trạng thái:', result.length);
    }

    // Filter by payment method
    if (paymentFilter !== 'ALL') {
      result = result.filter(
        (test) => test && test.paymentMethod === paymentFilter
      );
      console.log('Sau khi lọc theo phương thức thanh toán:', result.length);
    } // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (test) =>
          (test.customerName &&
            test.customerName.toLowerCase().includes(term)) ||
          (test.testId && test.testId.toString().includes(term)) ||
          (test.serviceName && test.serviceName.toLowerCase().includes(term))
      );
      console.log('Sau khi lọc theo từ khóa:', result.length);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0); // Đầu ngày

      result = result.filter((test) => {
        if (!test.appointmentDate) return false;

        const testDate = new Date(test.appointmentDate);
        testDate.setHours(0, 0, 0, 0); // Start of day

        return testDate.getTime() === filterDate.getTime();
      });
      console.log('Sau khi lọc theo ngày:', result.length);
    }

    console.log('Kết quả lọc cuối cùng:', result.length, result);
    setFilteredTests(result);
    setPage(0); // Reset to first page when filters change
  }, [tests, statusFilter, paymentFilter, searchTerm, dateFilter, tabValue]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Open modals
  const handleOpenTestModal = async (test) => {
    console.log('Đang mở modal kết quả xét nghiệm cho:', test);
    setSelectedTest(test);

    // Đảm bảo có các thành phần xét nghiệm để hiển thị
    if (
      !test.testComponents ||
      !Array.isArray(test.testComponents) ||
      test.testComponents.length === 0
    ) {
      // Đối với xét nghiệm đơn lẻ, tạo một thành phần mặc định nếu chưa có
      if (!test.packageId) {
        // Use proper numeric componentId value - use testId as a base for the component
        const componentId = test.testId ? parseInt(test.testId) : 1;

        test.testComponents = [
          {
            id: componentId, // Use numeric ID
            componentId: componentId, // Use numeric ID
            componentName: test.serviceName || 'Xét nghiệm',
            status: test.status,
            unit: '',
            normalRange: '',
            resultValue: '',
            // If this appears to be an HIV test, set testType accordingly
            testType:
              test.serviceName && test.serviceName.toLowerCase().includes('hiv')
                ? 'BINARY'
                : undefined,
          },
        ];
        console.log(
          'Đã tạo thành phần xét nghiệm mặc định với ID số:',
          test.testComponents[0]
        );
      }
    }

    // Tải kết quả xét nghiệm nếu đang xem một xét nghiệm đã có kết quả
    if (test.status === 'RESULTED' || test.status === 'COMPLETED') {
      try {
        setLoading(true);
        console.log('Fetching test results for test:', test.testId);
        const results = await getTestResultsByTestId(test.testId);
        console.log('Got test results:', results);
        if (results) {
          test.testResults = results.data || results;

          // Map test results to component structure if needed
          if (
            test.testResults &&
            Array.isArray(test.testResults) &&
            test.testResults.length > 0 &&
            test.testComponents
          ) {
            test.testComponents.forEach((component) => {
              const matchingResult = test.testResults.find(
                (r) =>
                  r.componentId === component.componentId ||
                  r.componentId === component.id
              );
              if (matchingResult) {
                component.resultValue = matchingResult.resultValue;
                component.unit = matchingResult.unit;
                component.normalRange = matchingResult.normalRange;
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching test results:', err);
      } finally {
        setLoading(false);
      }
    }
    if (test.packageId) {
      // If this is a package test, first try to get complete package details
      try {
        setLoading(true);
        console.log('Fetching package details for:', test.testId);
        const response = await getPackageTestDetails(test.testId);

        if (response && (response.status === 'SUCCESS' || response.data)) {
          const packageData = response.data || response;
          console.log('Got package details:', packageData);

          // If we have valid data, use that instead of the basic test data
          if (packageData) {
            // Check if we have components in the package data
            if (
              packageData.testComponents &&
              packageData.testComponents.length > 0
            ) {
              console.log(
                `Found ${packageData.testComponents.length} components in package data`
              );
            } else {
              console.warn(
                'No components found in package data, will create dummies if needed'
              );
            }
            setSelectedTest(packageData);
          }
        }
      } catch (err) {
        console.error('Error fetching package details:', err);
        // Continue with the basic test data we already have

        // If there was an error, make sure we have at least some dummy components
        if (
          !test.testComponents ||
          !Array.isArray(test.testComponents) ||
          test.testComponents.length === 0
        ) {
          test.testComponents = [
            {
              id: `component-1-${test.testId}`,
              componentId: `component-1-${test.testId}`,
              componentName: `${test.serviceName || 'Xét nghiệm'} - Thành phần 1`,
              status: test.status || 'PENDING',
            },
            {
              id: `component-2-${test.testId}`,
              componentId: `component-2-${test.testId}`,
              componentName: `${test.serviceName || 'Xét nghiệm'} - Thành phần 2`,
              status: test.status || 'PENDING',
            },
          ];
          console.log('Created dummy components:', test.testComponents);
        }
      } finally {
        setLoading(false);
      }
      setOpenPackageModal(true);
    } else {
      setOpenSingleModal(true);
    }
  };

  const handleOpenTestInPackageModal = (packageTest, testComponent) => {
    setSelectedTest(packageTest);
    setSelectedTestComponent(testComponent);
    setOpenTestInPackageModal(true);
  };

  // Test status update handlers
  const handleConfirmTestAction = async (testId) => {
    try {
      setLoading(true);
      console.log(`Đang gọi API xác nhận xét nghiệm ${testId}...`);
      const response = await confirmTest(testId);
      console.log(`Kết quả API xác nhận:`, response);

      if (response && (response.status === 'SUCCESS' || response.data)) {
        // Xác định dữ liệu hợp lệ từ response
        const updatedData = response.data || response;
        console.log(`Dữ liệu cập nhật từ API:`, updatedData);

        // Update the test in state
        updateTestInState(updatedData);

        // Hiển thị thông báo thành công
        setSuccess(`Đã xác nhận xét nghiệm #${testId} thành công`);
        setTimeout(() => setSuccess(null), 3000);

        return true;
      } else {
        setError(response?.message || 'Không thể xác nhận xét nghiệm');
        setTimeout(() => setError(null), 3000);
        return false;
      }
    } catch (err) {
      setError(
        'Lỗi khi xác nhận xét nghiệm: ' + (err.message || 'Lỗi không xác định')
      );
      console.error('Error confirming test:', err);
      setTimeout(() => setError(null), 3000);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleSampleTestAction = async (testId) => {
    try {
      setLoading(true);
      console.log(`Đang gọi API lấy mẫu xét nghiệm ${testId}...`);
      const response = await sampleTest(testId);
      console.log(`Kết quả API lấy mẫu:`, response);

      if (response && (response.status === 'SUCCESS' || response.data)) {
        // Xác định dữ liệu hợp lệ từ response
        const updatedData = response.data || response;
        console.log(`Dữ liệu cập nhật từ API:`, updatedData);

        // Update the test in state
        updateTestInState(updatedData);

        // Hiển thị thông báo thành công
        setSuccess(
          `Đã cập nhật trạng thái lấy mẫu cho xét nghiệm #${testId} thành công`
        );
        setTimeout(() => setSuccess(null), 3000);

        return true;
      } else {
        setError(response?.message || 'Không thể cập nhật trạng thái lấy mẫu');
        setTimeout(() => setError(null), 3000);
        return false;
      }
    } catch (err) {
      setError(
        'Lỗi khi cập nhật trạng thái lấy mẫu: ' +
          (err.message || 'Lỗi không xác định')
      );
      console.error('Error sampling test:', err);
      setTimeout(() => setError(null), 3000);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleAddResultsAction = async (testId, resultData) => {
    try {
      setLoading(true);
      console.log(
        'Đã nhận dữ liệu kết quả trong handleAddResultsAction:',
        resultData
      );

      // Check if resultData is already properly formatted
      let apiRequestBody;

      // If resultData already has status and results properties, use it directly
      if (resultData.status && Array.isArray(resultData.results)) {
        apiRequestBody = resultData;
      } else {
        // Otherwise, assume resultData is the results array
        // Additional validation to ensure we have valid data
        if (
          !resultData ||
          !Array.isArray(resultData) ||
          resultData.length === 0
        ) {
          setError('Không có dữ liệu kết quả để lưu');
          setTimeout(() => setError(null), 5000);
          return false;
        }

        // Check if all results have values
        const emptyResults = resultData.filter(
          (result) =>
            result.resultValue === undefined ||
            result.resultValue === null ||
            result.resultValue === ''
        );

        if (emptyResults.length > 0) {
          setError('Kết quả xét nghiệm không được để trống');
          setTimeout(() => setError(null), 5000);
          return false;
        } // Check if any results are binary (like HIV tests with positive/negative)
        // Not directly used but retained for debugging purposes
        console.log(
          'Có kết quả xét nghiệm nhị phân:',
          resultData.some(
            (result) =>
              result.resultValue === 'POSITIVE' ||
              result.resultValue === 'NEGATIVE' ||
              result.resultValue === 'INCONCLUSIVE'
          )
        );

        // Format according to TestResultRequest and ensure componentId is numeric
        const formattedResults = resultData.map((result) => {
          // Ensure componentId is a valid number for the Java backend
          let componentId;
          if (typeof result.componentId === 'number') {
            componentId = result.componentId;
          } else if (
            result.componentId &&
            !isNaN(parseInt(result.componentId))
          ) {
            // Try to parse as integer if it's a string containing a number
            componentId = parseInt(result.componentId);
          } else if (testId && !isNaN(parseInt(testId))) {
            // Fallback: use test ID as a base
            componentId = parseInt(testId);
          } else {
            // Last resort fallback
            componentId = 1;
          }

          return {
            componentId: componentId, // Use the numeric value
            resultValue: result.resultValue,
            normalRange: result.normalRange || '',
            unit: result.unit || '',
          };
        });

        // Prepare the API request body
        apiRequestBody = {
          status: 'RESULTED',
          results: formattedResults,
        };
      }
      console.log(
        'Nội dung yêu cầu API cuối cùng:',
        JSON.stringify(apiRequestBody)
      );

      // Cập nhật UI lạc quan trước khi gọi API
      // Tìm xét nghiệm trong trạng thái và cập nhật nó lạc quan
      const testToUpdate = tests.find((t) => t.testId === testId);
      if (testToUpdate) {
        console.log('Áp dụng cập nhật UI lạc quan cho xét nghiệm:', testId);

        // Make a copy of the test with updated status
        const optimisticUpdatedTest = {
          ...testToUpdate,
          status: 'RESULTED', // Change status to RESULTED
        };

        // Apply optimistic update to UI
        const optimisticUpdatedTests = tests.map((t) =>
          t.testId === testId ? optimisticUpdatedTest : t
        );
        setTests(optimisticUpdatedTests);

        // Update filtered tests based on tab
        if (tabValue === 3) {
          // If in "Đã lấy mẫu" tab
          const newFilteredTests = filteredTests.filter(
            (t) => t.testId !== testId
          );
          setFilteredTests(newFilteredTests);
        } // Hiển thị thông báo thành công trong khi xử lý
        setSuccess(`Đang cập nhật kết quả xét nghiệm #${testId}...`);
      }

      let response;
      try {
        // Lần thử đầu tiên thêm kết quả xét nghiệm
        response = await addTestResults(testId, apiRequestBody);
        console.log('Phản hồi API cho kết quả xét nghiệm:', response);
      } catch (apiError) {
        console.error('Lỗi API trong lần thử đầu tiên:', apiError);

        // Nếu nhận được lỗi 401, token có thể đã được làm mới
        if (
          apiError.status === 401 ||
          (apiError.response && apiError.response.status === 401)
        ) {
          console.log(
            'Nhận lỗi 401, đang đợi quá trình làm mới token hoàn tất'
          );
          // Đợi quá trình làm mới token hoàn tất
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Try again after token refresh
          try {
            console.log('Retrying API call after token refresh');
            response = await addTestResults(testId, apiRequestBody);
            console.log('Retry API response:', response);
          } catch (retryError) {
            console.error('Error in retry attempt:', retryError);
            throw retryError;
          }
        } else {
          throw apiError;
        }
      } // Xử lý phản hồi
      if (
        response &&
        (response.status === 'SUCCESS' || response.success === true)
      ) {
        // Cập nhật xét nghiệm trong trạng thái của chúng ta với dữ liệu phản hồi thực tế
        if (response.data) {
          updateTestInState(response.data);
        }
        setSuccess(`Cập nhật kết quả xét nghiệm #${testId} thành công`);
        setTimeout(() => setSuccess(null), 3000);
        // Làm mới dữ liệu để lấy trạng thái mới nhất từ máy chủ
        setTimeout(() => {
          fetchTests();
        }, 500);

        return response;
      } else if (response && response.data) {
        // We have data even without explicit success status
        console.log(
          'Response has data but no success status, treating as success'
        );
        if (response.data) {
          updateTestInState(response.data);
        }
        setSuccess(`Cập nhật kết quả xét nghiệm #${testId} thành công`);
        setTimeout(() => {
          fetchTests();
        }, 500);

        return response;
      } else {
        // Revert optimistic update on error
        fetchTests(); // Refresh data to revert changes

        setError(response?.message || 'Không thể cập nhật kết quả xét nghiệm');
        setTimeout(() => setError(null), 5000);
        return false;
      }
    } catch (err) {
      // Revert optimistic update on error
      fetchTests(); // Refresh data to revert changes

      setError(
        'Lỗi khi cập nhật kết quả: ' + (err.message || 'Lỗi không xác định')
      );
      setTimeout(() => setError(null), 5000);
      console.error('Error adding results:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleCompleteTestAction = async (testId) => {
    try {
      setLoading(true);
      console.log('Calling completeTest API for test ID:', testId);
      const response = await completeTest(testId);
      console.log('Complete test API response:', response);

      // Handle different response formats
      if (response) {
        if (response.status === 'SUCCESS' || response.success === true) {
          // Get the updated test data from the response
          const updatedTest = response.data || response;
          console.log('Updated test data:', updatedTest);

          // Update in state
          updateTestInState(updatedTest);

          // Show success message
          setSuccess(
            `Xét nghiệm #${testId} đã được chuyển trạng thái thành COMPLETED`
          );

          // Return true to indicate success
          return { success: true, data: updatedTest };
        } else if (
          response.data &&
          (response.data.status === 'COMPLETED' ||
            response.data.status === 'SUCCESS')
        ) {
          // Alternative success case
          updateTestInState(response.data);
          setSuccess(
            `Xét nghiệm #${testId} đã được chuyển trạng thái thành COMPLETED`
          );
          return { success: true, data: response.data };
        } else {
          // Response exists but doesn't indicate success
          const errorMessage =
            response.message || 'Không thể hoàn thành xét nghiệm';
          // setError(errorMessage);
          console.error('API returned error:', errorMessage);
          return { success: false, message: errorMessage };
        }
      } else {
        // No response
        setError('Không nhận được phản hồi từ máy chủ');
        return { success: false, message: 'No response from server' };
      }
    } catch (err) {
      const errorMessage =
        'Lỗi khi hoàn thành xét nghiệm: ' +
        (err.message || 'Lỗi không xác định');
      setError(errorMessage);
      console.error('Error completing test:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  const handleCancelTestAction = async (testId) => {
    try {
      setLoading(true);
      const response = await cancelSTITest(testId);
      if (response.status === 'SUCCESS') {
        updateTestInState(response.data);
        return true;
      } else {
        setError(response.message || 'Không thể hủy xét nghiệm');
        return false;
      }
    } catch (err) {
      setError(
        'Lỗi khi hủy xét nghiệm: ' + (err.message || 'Lỗi không xác định')
      );
      console.error('Error canceling test:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }; // Update test in state
  const updateTestInState = (updatedTest) => {
    if (!updatedTest || !updatedTest.testId) {
      console.error('Invalid updated test:', updatedTest);
      return;
    }

    console.log('Updating test in state:', updatedTest);

    // Handle if we were given an array of tests (rare case)
    if (Array.isArray(updatedTest)) {
      setTests(updatedTest);

      // Cập nhật filteredTests ngay lập tức để UI hiển thị đúng
      if (tabValue === 0) {
        // Nếu đang ở tab "Tất cả xét nghiệm", cập nhật toàn bộ
        setFilteredTests(updatedTest);
      } else {
        // Lọc lại theo tab hiện tại
        let filtered = updatedTest;
        if (tabValue === 1) {
          filtered = filtered.filter((t) => t && t.status === 'PENDING');
        } else if (tabValue === 2) {
          filtered = filtered.filter((t) => t && t.status === 'CONFIRMED');
        } else if (tabValue === 3) {
          filtered = filtered.filter((t) => t && t.status === 'SAMPLED');
        } else if (tabValue === 4) {
          filtered = filtered.filter((t) => t && t.status === 'RESULTED');
        } else if (tabValue === 5) {
          filtered = filtered.filter((t) => t && t.status === 'COMPLETED');
        }
        setFilteredTests(filtered);
      }
    } else {
      // Handle single test update
      const updatedTests = tests.map((test) =>
        test && test.testId === updatedTest.testId ? updatedTest : test
      );
      console.log('Updated tests array:', updatedTests);
      setTests(updatedTests);

      // Cập nhật filteredTests ngay lập tức để hiển thị UI đúng
      const updatedFilteredTests = filteredTests
        .map((test) => {
          if (test && test.testId === updatedTest.testId) {
            return updatedTest;
          }
          return test;
        })
        .filter((test) => {
          // Nếu trạng thái xét nghiệm thay đổi, kiểm tra xem nó có còn phù hợp với tab hiện tại không
          if (tabValue === 1 && test && test.status !== 'PENDING') {
            return false;
          } else if (tabValue === 2 && test && test.status !== 'CONFIRMED') {
            return false;
          } else if (tabValue === 3 && test && test.status !== 'SAMPLED') {
            return false;
          } else if (tabValue === 4 && test && test.status !== 'RESULTED') {
            return false;
          } else if (tabValue === 5 && test && test.status !== 'COMPLETED') {
            return false;
          }
          return true;
        });

      console.log('Updated filtered tests array:', updatedFilteredTests);
      setFilteredTests(updatedFilteredTests);
    }

    // Recalculate pending count whenever a test is updated
    const pendingTests = tests.filter(
      (test) => test && test.status === 'PENDING'
    );
    setPendingCount(pendingTests.length);

    // Show success message and auto-hide it after 3 seconds
    setSuccess(`Cập nhật xét nghiệm #${updatedTest.testId} thành công`);
    setTimeout(() => setSuccess(null), 3000);
  };
  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setPaymentFilter('ALL');
    setSearchTerm('');
    setDateFilter('');
  };

  // Render status chip
  const renderStatusChip = (status) => {
    return (
      <Chip
        label={STATUS_LABELS[status] || status}
        sx={{
          backgroundColor: STATUS_COLORS[status] || '#757575',
          color: '#fff',
          fontWeight: 500,
          minWidth: '100px',
        }}
      />
    );
  };

  // Get payment method display
  const getPaymentMethodDisplay = (test) => {
    const method = test.paymentMethod;
    const status = test.paymentStatus;

    return (
      <Chip
        icon={<PaymentIcon />}
        label={PAYMENT_LABELS[method] || method}
        size="small"
        color={status === 'COMPLETED' ? 'success' : 'default'}
        variant={status === 'COMPLETED' ? 'default' : 'outlined'}
      />
    );
  };

  // Get button based on test status
  const getActionButton = (test) => {
    switch (test.status) {
      case 'PENDING':
        return (
          <>
            {' '}
            <Tooltip title="Xác nhận">
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckCircleIcon />}
                onClick={async () => {
                  // Lưu ID để có thể cập nhật UI trước khi API hoàn tất
                  const testIdToUpdate = test.testId;

                  // Trực tiếp cập nhật UI ngay lập tức (optimistic update)
                  const optimisticUpdatedTests = tests.map((t) =>
                    t.testId === testIdToUpdate
                      ? { ...t, status: 'CONFIRMED' }
                      : t
                  );
                  setTests(optimisticUpdatedTests);

                  // Cập nhật filteredTests dựa theo tab hiện tại
                  if (tabValue === 1) {
                    // Nếu đang ở tab "Chờ xử lý"
                    // Xóa test đã được xác nhận khỏi danh sách filteredTests
                    const newFilteredTests = filteredTests.filter(
                      (t) => t.testId !== testIdToUpdate
                    );
                    setFilteredTests(newFilteredTests);
                  }

                  // Giảm số lượng pending
                  setPendingCount((prev) => Math.max(0, prev - 1));

                  // Hiển thị thông báo thành công
                  setSuccess(`Đang xác nhận xét nghiệm #${testIdToUpdate}...`);

                  // Vẫn gọi API để xác nhận trên server
                  const success = await handleConfirmTestAction(testIdToUpdate);

                  // Nếu thành công, cập nhật lại dữ liệu từ server để đồng bộ
                  if (success) {
                    setTimeout(() => fetchTests(), 500);
                  } else {
                    // Nếu thất bại, hoàn tác UI về trạng thái cũ
                    const revertedTests = tests.map((t) =>
                      t.testId === testIdToUpdate
                        ? { ...t, status: 'PENDING' }
                        : t
                    );
                    setTests(revertedTests);

                    // Cập nhật lại filteredTests
                    fetchTests();
                  }
                }}
                sx={{
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  color: '#fff',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                }}
              >
                Xác nhận
              </Button>
            </Tooltip>
            <Tooltip title="Hủy xét nghiệm">
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleCancelTestAction(test.testId)}
              >
                Hủy
              </Button>
            </Tooltip>
          </>
        );
      case 'CONFIRMED':
        return (
          <>
            <Tooltip title="Lấy mẫu">
              <Button
                variant="contained"
                size="small"
                startIcon={<BiotechIcon />}
                onClick={async () => {
                  // Lưu ID để cập nhật UI ngay lập tức
                  const testIdToUpdate = test.testId;

                  // Cập nhật UI ngay lập tức (optimistic update)
                  const optimisticUpdatedTests = tests.map((t) =>
                    t.testId === testIdToUpdate
                      ? { ...t, status: 'SAMPLED' }
                      : t
                  );
                  setTests(optimisticUpdatedTests);

                  // Cập nhật filteredTests dựa theo tab hiện tại
                  if (tabValue === 2) {
                    // Nếu đang ở tab "Đã xác nhận"
                    const newFilteredTests = filteredTests.filter(
                      (t) => t.testId !== testIdToUpdate
                    );
                    setFilteredTests(newFilteredTests);
                  }

                  // Hiển thị thông báo thành công
                  setSuccess(
                    `Đang cập nhật trạng thái lấy mẫu cho xét nghiệm #${testIdToUpdate}...`
                  );

                  // Gọi API để cập nhật trên server
                  const success = await handleSampleTestAction(testIdToUpdate);

                  // Nếu thành công, cập nhật lại dữ liệu từ server
                  if (success) {
                    setTimeout(() => fetchTests(), 500);
                  } else {
                    // Nếu thất bại, hoàn tác UI về trạng thái cũ
                    const revertedTests = tests.map((t) =>
                      t.testId === testIdToUpdate
                        ? { ...t, status: 'CONFIRMED' }
                        : t
                    );
                    setTests(revertedTests);
                    fetchTests();
                  }
                }}
                sx={{
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  color: '#fff',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                }}
              >
                Lấy mẫu
              </Button>
            </Tooltip>
            <Tooltip title="Hủy xét nghiệm">
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleCancelTestAction(test.testId)}
              >
                Hủy
              </Button>
            </Tooltip>
          </>
        );
      case 'SAMPLED':
        return (
          <Tooltip title="Nhập kết quả">
            <Button
              variant="contained"
              size="small"
              startIcon={<ScienceIcon />}
              onClick={() => {
                // Lưu ID để cập nhật UI ngay lập tức
                const testIdToUpdate = test.testId;

                // Trước khi mở modal, hiển thị thông báo đang xử lý
                setSuccess(
                  `Đang mở form nhập kết quả cho xét nghiệm #${testIdToUpdate}...`
                );

                // Mở modal nhập kết quả
                handleOpenTestModal(test);

                // Không cần optimistic update ở đây vì việc nhập kết quả
                // sẽ được xử lý trong modal, và cập nhật UI sau khi đóng modal
              }}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              }}
            >
              Nhập kết quả
            </Button>
          </Tooltip>
        );
      case 'RESULTED':
        return (
          <Tooltip title="Xem kết quả">
            <Button
              variant="contained"
              size="small"
              startIcon={<ScienceIcon />}
              onClick={() => handleOpenTestModal(test)}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              }}
            >
              Xem kết quả
            </Button>
          </Tooltip>
        );
      case 'COMPLETED':
        return (
          <Tooltip title="Xem chi tiết">
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleOpenTestModal(test)}
              sx={{
                borderColor: STATUS_COLORS[test.status] || '#26A69A',
                color: STATUS_COLORS[test.status] || '#26A69A',
              }}
            >
              Xem chi tiết
            </Button>
          </Tooltip>
        );
      default:
        return (
          <Tooltip title="Xem chi tiết">
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleOpenTestModal(test)}
              sx={{
                borderColor: STATUS_COLORS[test.status] || '#757575',
                color: STATUS_COLORS[test.status] || '#757575',
              }}
            >
              Xem chi tiết
            </Button>
          </Tooltip>
        );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: '#334155', mb: 3 }}
        >
          Quản lý xét nghiệm STI
        </Typography>{' '}
        {/* {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )} */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          {' '}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="test management tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="Tất cả xét nghiệm" />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Chờ xử lý
                  {pendingCount > 0 && (
                    <Chip
                      size="small"
                      label={pendingCount}
                      color="error"
                      sx={{ ml: 1, height: 20, minWidth: 20 }}
                    />
                  )}
                </Box>
              }
            />
            <Tab label="Đã xác nhận" />
            <Tab label="Đã lấy mẫu" />
            <Tab label="Có kết quả" />
            <Tab label="Hoàn thành" />
          </Tabs>
        </Box>
        {/* Filter Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          {' '}
          <Grid item xs={12} md={4}>
            <TextField
              label="Tìm kiếm theo tên/mã"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
            />{' '}
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Lọc theo ngày"
              variant="outlined"
              type="date"
              fullWidth
              value={dateFilter}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Lọc theo trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Lọc theo trạng thái"
                startAdornment={
                  <FilterListIcon sx={{ color: 'action.active', mr: 1 }} />
                }
              >
                <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
                <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                <MenuItem value="SAMPLED">Đã lấy mẫu</MenuItem>
                <MenuItem value="RESULTED">Có kết quả</MenuItem>
                <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                <MenuItem value="CANCELED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                label="Phương thức thanh toán"
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="COD">Tiền mặt</MenuItem>
                <MenuItem value="VISA">Thẻ tín dụng</MenuItem>
                <MenuItem value="QR_CODE">Chuyển khoản QR</MenuItem>
              </Select>{' '}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button fullWidth variant="outlined" onClick={handleResetFilters}>
              Đặt lại
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchTests}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                height: '56px',
              }}
            >
              Làm mới dữ liệu
            </Button>
          </Grid>
        </Grid>
        {/* Test Table */}
        <TabPanel value={tabValue} index={0}>
          {renderTestTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderTestTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderTestTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderTestTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          {renderTestTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          {renderTestTable()}
        </TabPanel>
        {/* Modals */}{' '}
        <SingleTestResultModal
          open={openSingleModal}
          onClose={() => setOpenSingleModal(false)}
          currentTest={selectedTest}
          handleSaveResult={handleAddResultsAction}
          handleConfirmTest={handleConfirmTestAction}
          handleSampleTest={handleSampleTestAction}
          handleCompleteTest={handleCompleteTestAction}
          handleCancelTest={handleCancelTestAction}
          onTestUpdated={(updatedTest) => {
            // Update test in state and close modal with optimistic UI update
            console.log(
              'Test updated through modal, applying to UI',
              updatedTest
            );
            updateTestInState(updatedTest);
            setOpenSingleModal(false);

            // Show success message
            setSuccess(
              `Đã cập nhật thành công xét nghiệm #${updatedTest.testId}`
            );
            setTimeout(() => setSuccess(null), 3000);

            // Refresh data after a short delay to ensure backend has processed the change
            setTimeout(() => {
              console.log('Refreshing data after single test update');
              fetchTests();
            }, 500);
          }}
        />
        <PackageManagementModal
          open={openPackageModal}
          onClose={() => setOpenPackageModal(false)}
          packageTest={selectedTest}
          onTestSelect={handleOpenTestInPackageModal}
          onTestUpdated={(updatedTest) => {
            // Update test in state and close modal
            updateTestInState(updatedTest);
            setOpenPackageModal(false);

            // Refresh data after a short delay
            setTimeout(() => {
              console.log('Refreshing data after package test update');
              fetchTests();
            }, 500);
          }}
        />
        <TestInPackageModal
          open={openTestInPackageModal}
          onClose={() => setOpenTestInPackageModal(false)}
          packageTest={selectedTest}
          testComponent={selectedTestComponent}
          onTestUpdated={(updatedTest) => {
            // Update test in state and close modal
            updateTestInState(updatedTest);
            setOpenTestInPackageModal(false);
            // Refresh data after a short delay
            setTimeout(() => {
              console.log('Refreshing data after component test update');
              fetchTests();
            }, 500);
          }}
        />
      </Paper>
    </Container>
  ); // Function to render the test table
  function renderTestTable() {
    // Ensure tests and filteredTests are accessible
    const testsData = tests || [];

    console.log(
      'renderTestTable called, loading:',
      loading,
      'tests length:',
      testsData.length
    );
    console.log('filteredTests:', filteredTests);

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (
      !filteredTests ||
      !Array.isArray(filteredTests) ||
      filteredTests.length === 0
    ) {
      return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          {' '}
          <Typography variant="h6" color="textSecondary">
            Không có dữ liệu xét nghiệm
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {testsData && testsData.length > 0
              ? `Có ${testsData.length} xét nghiệm trước khi lọc.`
              : 'Không có dữ liệu từ máy chủ.'}
          </Typography>
        </Box>
      );
    }

    // Slice data for pagination
    const currentPageTests = filteredTests.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Box>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                {' '}
                <TableCell sx={{ fontWeight: 'bold' }}>Mã xét nghiệm</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Dịch vụ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày hẹn</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {tabValue === 4 || tabValue === 5
                    ? 'Ngày có kết quả'
                    : 'Thanh toán'}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageTests.map((test) => (
                <TableRow key={test.testId} hover>
                  <TableCell>
                    <Box sx={{ fontWeight: 500 }}>#{test.testId}</Box>
                    <Typography variant="caption" color="textSecondary">
                      {test.packageId ? 'Gói xét nghiệm' : 'Xét nghiệm đơn lẻ'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {test.customerName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {test.customerPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {test.serviceName || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {test.totalPrice &&
                        `${test.totalPrice.toLocaleString('vi-VN')}đ`}
                    </Typography>
                  </TableCell>{' '}
                  <TableCell>
                    {test.appointmentDate ? (
                      formatDateDisplay(test.appointmentDate)
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Không có ngày hẹn
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {tabValue === 4 || tabValue === 5 ? (
                      test.resultDate ? (
                        formatDateDisplay(test.resultDate)
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Chưa cập nhật
                        </Typography>
                      )
                    ) : (
                      getPaymentMethodDisplay(test)
                    )}
                  </TableCell>
                  <TableCell>{renderStatusChip(test.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {getActionButton(test)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </Box>
    );
  }
};

export default STITestManagementContent;

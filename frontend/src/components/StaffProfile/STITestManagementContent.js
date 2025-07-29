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
  updateTestResults,
  sampleTest,
  completeTest,
  getPendingTests,
  getConfirmedTests,
  getPackageTestDetails,
  cancelSTITest,
  getTestResultsByTestId,
  getSTIServiceById,
  getSTIPackageById,
  savePartialTestResults,
  getCanceledTests,
} from '../../services/stiService';
import { formatDateDisplay } from '../../utils/dateUtils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

// Import Modals
import SampleCollectionModal from './modals/SampleCollectionModal';
import TestResultInputModal from './modals/TestResultInputModal';
import FinalTestResultModal from './modals/FinalTestResultModal';
import TestConfirmationModal from './modals/TestConfirmationModal';
import { confirmDialog } from '../../utils/confirmDialog';
import { notify } from '@/utils/notify';
import CanceledTestDetailModal from './modals/CanceledTestDetailModal';

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
  const [dateFilter, setDateFilter] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Modals state
  const [openSingleModal, setOpenSingleModal] = useState(false);
  const [openPackageModal, setOpenPackageModal] = useState(false);

  const [openSampleModal, setOpenSampleModal] = useState(false);
  const [openComponentModal, setOpenComponentModal] = useState(false);
  const [serviceComponents, setServiceComponents] = useState([]);
  const [serviceInfo, setServiceInfo] = useState(null);

  const [isPackageModal, setIsPackageModal] = useState(false);
  const [packageServices, setPackageServices] = useState([]); // List of services in package
  const [selectedService, setSelectedService] = useState(null);
  const [loadingService, setLoadingService] = useState(false); // Fetch tests based on the active tab
  const [allServiceComponents, setAllServiceComponents] = useState({});

  // State cho modal nhập kết quả
  const [openResultModal, setOpenResultModal] = useState(false);
  const [resultModalComponents, setResultModalComponents] = useState([]);
  const [resultModalTest, setResultModalTest] = useState(null);
  const [resultModalLoading, setResultModalLoading] = useState(false);
  const [resultModalError, setResultModalError] = useState(null);
  const [resultModalSuccess, setResultModalSuccess] = useState(null);
  const [resultModalIsPackage, setResultModalIsPackage] = useState(false);
  const [resultModalPackageServices, setResultModalPackageServices] = useState(
    []
  );
  const [resultModalSelectedService, setResultModalSelectedService] =
    useState(null);
  const [resultModalAllServiceComponents, setResultModalAllServiceComponents] =
    useState({});

  const [openFinalResultModal, setOpenFinalResultModal] = useState(false);
  const [openCanceledDetailModal, setOpenCanceledDetailModal] = useState(false);
  const [selectedCanceledTest, setSelectedCanceledTest] = useState(null);

  // State cho modal xác nhận xét nghiệm
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [testToConfirm, setTestToConfirm] = useState(null);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);

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
        case 3: // Sampled
        case 4: // Resulted
        case 5: // Completed
          response = await getStaffTests();
          break;
        case 6: // Canceled
          response = await getCanceledTests();
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
    } else if (tabValue === 6) {
      // Filter for CANCELED tests in tab 6
      result = result.filter((test) => test && test.status === 'CANCELED');
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

    // Filter by date - from selected date onwards
    if (dateFilter) {
      console.log('Đang lọc từ ngày hẹn trở đi:', dateFilter);

      // dateFilter is now a Date object from DatePicker
      const filterDate = new Date(dateFilter);
      if (isNaN(filterDate.getTime())) {
        console.log('Ngày filter không hợp lệ:', dateFilter);
        return;
      }
      filterDate.setHours(0, 0, 0, 0);

      result = result.filter((test) => {
        if (!test.appointmentDate) {
          console.log('Test không có appointmentDate:', test.testId);
          return false;
        }

        // Convert test date to Date object safely
        let testDate;

        // Xử lý các trường hợp khác nhau của appointmentDate
        if (Array.isArray(test.appointmentDate)) {
          // Nếu appointmentDate là array [year, month, day, hour, minute, second]
          const [year, month, day, hour = 0, minute = 0, second = 0] =
            test.appointmentDate;
          testDate = new Date(year, month - 1, day, hour, minute, second);
        } else if (typeof test.appointmentDate === 'string') {
          // Nếu appointmentDate là string
          testDate = new Date(test.appointmentDate);
        } else if (test.appointmentDate instanceof Date) {
          // Nếu appointmentDate đã là Date object
          testDate = new Date(test.appointmentDate);
        } else {
          console.log(
            'Format appointmentDate không xác định:',
            test.testId,
            test.appointmentDate
          );
          return false;
        }

        if (isNaN(testDate.getTime())) {
          console.log(
            'Test có appointmentDate không hợp lệ:',
            test.testId,
            test.appointmentDate
          );
          return false;
        }

        testDate.setHours(0, 0, 0, 0); // Start of day

        // Lọc từ ngày được chọn trở đi (>=)
        const isMatch = testDate.getTime() >= filterDate.getTime();
        console.log(
          `Test ${test.testId}: ${JSON.stringify(test.appointmentDate)} -> ${testDate.toISOString()} >= ${filterDate.toISOString()} = ${isMatch}`
        );

        return isMatch;
      });
      console.log('Sau khi lọc từ ngày hẹn trở đi:', result.length);
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

  // Handler mở modal lấy mẫu
  const handleOpenSampleModal = async (test) => {
    setSelectedTest(test);
    setAllServiceComponents({});
    // Nếu là package
    if (test.packageId) {
      setLoadingService(true);
      try {
        const res = await getSTIPackageById(test.packageId);
        if (res && res.data && Array.isArray(res.data.services)) {
          setIsPackageModal(true);
          setPackageServices(res.data.services);
          // Tải trước toàn bộ components cho các service trong package
          const serviceList = res.data.services;
          const promises = serviceList.map((svc) => getSTIServiceById(svc.id));
          const results = await Promise.all(promises);
          const componentsMap = {};
          results.forEach((result, idx) => {
            const svcId = serviceList[idx].id;
            if (
              result &&
              result.data &&
              Array.isArray(result.data.components)
            ) {
              componentsMap[svcId] = result.data.components;
            } else if (result && Array.isArray(result.components)) {
              componentsMap[svcId] = result.components;
            } else {
              componentsMap[svcId] = [];
            }
          });
          setAllServiceComponents(componentsMap);
          setOpenComponentModal(true);
          setSelectedService(null);
        }
      } catch (err) {
        setError(
          'Không thể lấy thông tin gói dịch vụ: ' +
            (err.message || 'Lỗi không xác định')
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoadingService(false);
      }
    } else if (!test.packageId && test.serviceId) {
      // Nếu là service đơn lẻ
      try {
        setLoadingService(true);
        const res = await getSTIServiceById(test.serviceId);
        if (res && res.data && Array.isArray(res.data.components)) {
          setServiceComponents(res.data.components);
          setServiceInfo(res.data);
          setIsPackageModal(false);
          setOpenComponentModal(true);
        }
      } catch (err) {
        setError(
          'Không thể lấy thông tin service: ' +
            (err.message || 'Lỗi không xác định')
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoadingService(false);
      }
    } else {
      setOpenSampleModal(true);
    }
  };

  // Khi chọn 1 service trong package, load component của service đó bằng API
  const handleSelectServiceInPackage = (svc) => {
    setSelectedService(svc);
    if (svc && svc.id && allServiceComponents[svc.id]) {
      setServiceComponents(allServiceComponents[svc.id]);
    } else {
      setServiceComponents([]);
    }
    // Không cần loadingService nữa khi chuyển service trong package
  };

  // Callback khi xác nhận lấy mẫu xong
  const handleSampleCollected = async (testId) => {
    // Gọi API chuyển trạng thái sang SAMPLED
    const result = await handleSampleTestAction(testId);
    if (result) {
      setOpenSampleModal(false);
      setSuccess('Đã cập nhật trạng thái lấy mẫu thành công!');
      fetchTests();
      return { success: true };
    } else {
      setError('Không thể cập nhật trạng thái lấy mẫu');
      return { success: false };
    }
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
        // Kiểm tra xem có phải lỗi thanh toán không
        if (
          response?.message &&
          response.message.includes('payment not completed')
        ) {
          const errorMessage =
            'Không thể xác nhận xét nghiệm do thanh toán thất bại hoặc chưa hoàn tất';
          setError(errorMessage);
          notify.error('Lỗi thanh toán', errorMessage);
        } else if (
          response?.message &&
          response.message.includes('Cannot confirm test')
        ) {
          const errorMessage =
            'Không thể xác nhận xét nghiệm - vui lòng kiểm tra lại thông tin thanh toán';
          setError(errorMessage);
          notify.error('Lỗi xác nhận', errorMessage);
        } else {
          setError(response?.message || 'Không thể xác nhận xét nghiệm');
        }
        setTimeout(() => setError(null), 5000);
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

  const handleCancelTestAction = async (testId, reason) => {
    try {
      setLoading(true);
      const response = await cancelSTITest(testId, reason);
      notify.success('Thành công', 'Đã hủy xét nghiệm thành công!');
      if (response.success) {
        updateTestInState(response.data);
        setSuccess('Đã hủy xét nghiệm thành công!');
        setTimeout(() => setSuccess(null), 3000);
        return true;
      } else {
        // Nếu lỗi là "Cannot cancel test within 24 hours of appointment" thì dịch sang tiếng Việt
        if (
          response.message ===
          'Cannot cancel test within 24 hours of appointment'
        ) {
          setError('Không thể hủy xét nghiệm trong vòng 24 giờ trước giờ hẹn!');
          notify.error(
            'Lỗi',
            'Không thể hủy xét nghiệm trong vòng 24 giờ trước giờ hẹn!'
          );
        } else {
          setError(response.message || 'Không thể hủy xét nghiệm');
        }
        setTimeout(() => setError(null), 3000);
        return false;
      }
    } catch (err) {
      setError(
        'Lỗi khi hủy xét nghiệm: ' + (err.message || 'Lỗi không xác định')
      );
      setTimeout(() => setError(null), 3000);
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
        } else if (tabValue === 6) {
          filtered = filtered.filter((t) => t && t.status === 'CANCELED');
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
          } else if (tabValue === 6 && test && test.status !== 'CANCELED') {
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

  // Helper function để format ngày hiển thị
  const formatAppointmentDate = (appointmentDate) => {
    if (!appointmentDate) return 'Không có ngày hẹn';

    let date;
    if (Array.isArray(appointmentDate)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] =
        appointmentDate;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else if (typeof appointmentDate === 'string') {
      date = new Date(appointmentDate);
    } else if (appointmentDate instanceof Date) {
      date = new Date(appointmentDate);
    } else {
      return 'Ngày không hợp lệ';
    }

    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ';
    }

    return formatDateDisplay(date);
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setPaymentFilter('ALL');
    setSearchTerm('');
    setDateFilter(null);
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

    // Xác định màu sắc và variant dựa trên trạng thái thanh toán
    let chipColor = 'default';
    let chipVariant = 'outlined';
    let chipLabel = PAYMENT_LABELS[method] || method;

    if (status === 'COMPLETED') {
      chipColor = 'success';
      chipVariant = 'default';
    } else if (status === 'FAILED') {
      chipColor = 'error';
      chipVariant = 'default';
      chipLabel = 'Thanh toán thất bại';
    } else if (status === 'PENDING') {
      chipColor = 'warning';
      chipVariant = 'outlined';
    }

    return (
      <Chip
        icon={<PaymentIcon />}
        label={chipLabel}
        size="small"
        color={chipColor}
        variant={chipVariant}
      />
    );
  };

  // Get button based on test status
  const getActionButton = (test) => {
    // Helper function to render cancel button
    const renderCancelButton = () => (
      <Tooltip title="Hủy xét nghiệm">
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<CancelIcon />}
          onClick={async () => {
            const reason = await confirmDialog.cancelWithReason(
              'Bạn có chắc chắn muốn hủy xét nghiệm này? Vui lòng nhập lý do hủy.'
            );
            if (reason) {
              await handleCancelTestAction(test.testId, reason);
            }
          }}
        >
          Hủy
        </Button>
      </Tooltip>
    );

    switch (test.status) {
      case 'PENDING':
        // Kiểm tra trạng thái thanh toán để quyết định có disable nút xác nhận không
        const isPaymentFailed = test.paymentStatus === 'FAILED';
        const isPaymentPending = test.paymentStatus === 'PENDING';
        const isPaymentIncomplete =
          !test.paymentStatus || test.paymentStatus === 'PENDING';

        // Disable nút xác nhận nếu thanh toán thất bại hoặc chưa hoàn tất
        const shouldDisableConfirm = isPaymentFailed || isPaymentIncomplete;

        // Xác định tooltip và text cho nút
        let confirmTooltip = 'Xác nhận';
        let confirmText = 'Xác nhận';

        if (isPaymentFailed) {
          confirmTooltip = 'Không thể xác nhận do thanh toán thất bại';
          confirmText = 'Thanh toán thất bại';
        } else if (isPaymentPending) {
          confirmTooltip = 'Không thể xác nhận do thanh toán chưa hoàn tất';
          confirmText = 'Chờ thanh toán';
        }

        return (
          <>
            <Tooltip title={confirmTooltip}>
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  disabled={shouldDisableConfirm}
                  onClick={() => handleOpenConfirmModal(test)}
                  sx={{
                    background: shouldDisableConfirm
                      ? 'linear-gradient(45deg, #ccc, #999)'
                      : 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: shouldDisableConfirm
                      ? 'none'
                      : '0 2px 8px rgba(74, 144, 226, 0.25)',
                    opacity: shouldDisableConfirm ? 0.6 : 1,
                    cursor: shouldDisableConfirm ? 'not-allowed' : 'pointer',
                  }}
                >
                  {confirmText}
                </Button>
              </span>
            </Tooltip>
            {renderCancelButton()}
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
                onClick={() => handleOpenSampleModal(test)}
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
            {renderCancelButton()}
          </>
        );
      case 'SAMPLED':
        return (
          <>
            <Tooltip title="Nhập kết quả">
              <Button
                variant="contained"
                size="small"
                startIcon={<ScienceIcon />}
                onClick={() => handleOpenResultModal(test)}
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
            {renderCancelButton()}
          </>
        );
      case 'RESULTED':
        return (
          <>
            <Tooltip title="Xem kết quả">
              <Button
                variant="contained"
                size="small"
                startIcon={<ScienceIcon />}
                onClick={() => handleOpenResultModal(test)}
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
            {renderCancelButton()}
          </>
        );
      case 'COMPLETED':
        return (
          <Tooltip title="Xem kết quả cuối cùng">
            <Button
              variant="contained"
              size="small"
              startIcon={<ScienceIcon />}
              onClick={() => handleOpenFinalResult(test)}
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
      case 'CANCELED':
        return (
          <Tooltip title="Xem chi tiết">
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleOpenCanceledDetailModal(test)}
              sx={{ borderColor: '#EF5350', color: '#EF5350', fontWeight: 600 }}
            >
              XEM CHI TIẾT
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
                borderColor: STATUS_COLORS[test.status] || '#26A69A',
                color: STATUS_COLORS[test.status] || '#26A69A',
              }}
            >
              Xem chi tiết
            </Button>
          </Tooltip>
        );
    }
  };

  // Hàm mở modal nhập kết quả
  const handleOpenResultModal = async (test) => {
    setResultModalTest(test);
    setResultModalError(null);
    setResultModalSuccess(null);
    setResultModalLoading(true);

    // Tải kết quả xét nghiệm đã có nếu trạng thái là RESULTED hoặc COMPLETED
    if (test.status === 'RESULTED' || test.status === 'COMPLETED') {
      try {
        const results = await getTestResultsByTestId(test.testId);
        setResultModalTest({
          ...test,
          testResults: results.data || results, // đảm bảo luôn có mảng
        });
      } catch (err) {
        console.error('Không thể tải kết quả xét nghiệm đã có:', err);
        // Có thể set lỗi ở đây nếu cần
      }
    }

    setResultModalIsPackage(!!test.packageId);
    if (test.packageId) {
      // Nếu là package, lấy danh sách service và components từng service
      try {
        let services = [];
        let allComponents = {};
        // Ưu tiên lấy từ allServiceComponents nếu đã có
        if (
          allServiceComponents &&
          Object.keys(allServiceComponents).length > 0 &&
          packageServices &&
          packageServices.length > 0
        ) {
          services = packageServices;
          allComponents = allServiceComponents;
        } else {
          // Lấy lại từ API
          const res = await getSTIPackageById(test.packageId);
          if (res && res.data && Array.isArray(res.data.services)) {
            services = res.data.services;
            const promises = services.map((svc) => getSTIServiceById(svc.id));
            const results = await Promise.all(promises);
            results.forEach((result, idx) => {
              const svcId = services[idx].id;
              if (
                result &&
                result.data &&
                Array.isArray(result.data.components)
              ) {
                allComponents[svcId] = result.data.components;
              } else if (result && Array.isArray(result.components)) {
                allComponents[svcId] = result.components;
              } else {
                allComponents[svcId] = [];
              }
            });
          }
        }
        setResultModalPackageServices(services);
        setResultModalAllServiceComponents(allComponents);
        // Mặc định chọn service đầu tiên
        const firstService = services[0];
        setResultModalSelectedService(firstService);
        setResultModalComponents(allComponents[firstService.id] || []);
      } catch (err) {
        setResultModalError('Không thể tải thông tin gói dịch vụ');
        setResultModalPackageServices([]);
        setResultModalAllServiceComponents({});
        setResultModalSelectedService(null);
        setResultModalComponents([]);
      } finally {
        setResultModalLoading(false);
        setOpenResultModal(true);
      }
    } else {
      // Nếu là service đơn lẻ
      try {
        if (test.testComponents) {
          setResultModalComponents(test.testComponents);
        } else if (test.serviceId) {
          const res = await getSTIServiceById(test.serviceId);
          if (res && res.data && Array.isArray(res.data.components)) {
            setResultModalComponents(res.data.components);
          } else {
            setResultModalComponents([]);
          }
        } else {
          setResultModalComponents([]);
        }
      } catch (err) {
        setResultModalError('Không thể tải thành phần xét nghiệm');
        setResultModalComponents([]);
      } finally {
        setResultModalLoading(false);
        setOpenResultModal(true);
      }
    }
  };

  // Khi chọn service trong package
  const handleSelectServiceInResultModal = (svc) => {
    setResultModalSelectedService(svc);
    if (svc && svc.id && resultModalAllServiceComponents[svc.id]) {
      setResultModalComponents(resultModalAllServiceComponents[svc.id]);
    } else {
      setResultModalComponents([]);
    }
  };

  // Hàm lưu tạm thời (cho từng service trong package hoặc service đơn)
  const handleSavePartialResult = async (data) => {
    setResultModalLoading(true);
    setResultModalError(null);
    setResultModalSuccess(null);
    try {
      await savePartialTestResults(resultModalTest.testId, data);
      setResultModalSuccess('Đã lưu tạm kết quả!');
    } catch (err) {
      setResultModalError('Lưu tạm thất bại!');
    } finally {
      setResultModalLoading(false);
    }
  };

  // Hàm lưu tất cả (cho từng service trong package hoặc service đơn)
  const handleSaveAllResult = async (data) => {
    setResultModalLoading(true);
    setResultModalError(null);
    setResultModalSuccess(null);
    try {
      // Nếu test đã có kết quả thì dùng API cập nhật, ngược lại thì dùng API thêm mới
      if (resultModalTest.status === 'RESULTED') {
        await updateTestResults(resultModalTest.testId, data);
      } else {
        await addTestResults(resultModalTest.testId, data);
      }

      setTimeout(() => {
        setOpenResultModal(false);
        fetchTests();
      }, 1000);
    } catch (err) {
      setResultModalError('Lưu kết quả thất bại!');
    } finally {
      setResultModalLoading(false);
    }
  };

  // Hàm mới để xử lý việc hoàn tất xét nghiệm
  const handleCompleteResult = async (data) => {
    setResultModalLoading(true);
    setResultModalError(null);
    setResultModalSuccess(null);

    try {
      // 1. Luôn cập nhật kết quả mới nhất trước khi hoàn tất
      // Tương tự như handleSaveAllResult, dùng API phù hợp với trạng thái
      if (resultModalTest.status === 'RESULTED') {
        await updateTestResults(resultModalTest.testId, data);
      } else {
        await addTestResults(resultModalTest.testId, data);
      }

      setResultModalSuccess('Cập nhật kết quả thành công, đang hoàn tất...');

      // 2. Chuyển trạng thái sang COMPLETED
      const completeResponse = await completeTest(resultModalTest.testId);
      if (
        !completeResponse ||
        (completeResponse.status !== 'SUCCESS' && !completeResponse.success)
      ) {
        throw new Error(
          completeResponse.message || 'Hoàn tất xét nghiệm thất bại'
        );
      }

      setResultModalSuccess('Đã hoàn tất xét nghiệm thành công!');
      setTimeout(() => {
        setOpenResultModal(false);
        fetchTests(); // Tải lại danh sách để cập nhật UI
      }, 1500);
    } catch (err) {
      setResultModalError(err.message || 'Lỗi khi hoàn tất xét nghiệm!');
    } finally {
      setResultModalLoading(false);
    }
  };

  // Hàm xử lý mở modal kết quả cuối cùng
  const handleOpenFinalResult = async (test) => {
    setSelectedTest(test);
    setOpenFinalResultModal(true);
  };

  const handleOpenCanceledDetailModal = (test) => {
    setSelectedCanceledTest(test);
    setOpenCanceledDetailModal(true);
  };

  // Hàm mở modal xác nhận xét nghiệm
  const handleOpenConfirmModal = (test) => {
    setTestToConfirm(test);
    setOpenConfirmModal(true);
  };

  // Hàm xác nhận xét nghiệm từ modal
  const handleConfirmFromModal = async () => {
    if (!testToConfirm) return;

    setConfirmModalLoading(true);
    try {
      // Lưu ID để có thể cập nhật UI trước khi API hoàn tất
      const testIdToUpdate = testToConfirm.testId;

      // Trực tiếp cập nhật UI ngay lập tức (optimistic update)
      const optimisticUpdatedTests = tests.map((t) =>
        t.testId === testIdToUpdate ? { ...t, status: 'CONFIRMED' } : t
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

      if (success) {
        // Đóng modal khi thành công
        setOpenConfirmModal(false);
        setTestToConfirm(null);
        setTimeout(() => fetchTests(), 500);
      } else {
        // Nếu thất bại, hoàn tác UI về trạng thái cũ
        const revertedTests = tests.map((t) =>
          t.testId === testIdToUpdate ? { ...t, status: 'PENDING' } : t
        );
        setTests(revertedTests);

        // Cập nhật lại filteredTests
        fetchTests();
      }
    } catch (error) {
      console.error('Error confirming test:', error);
      // Nếu có lỗi, hoàn tác UI
      fetchTests();
    } finally {
      setConfirmModalLoading(false);
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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
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
            <Tab label="Đã hủy" />
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Từ ngày hẹn"
                value={dateFilter}
                onChange={(newValue) => setDateFilter(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                    placeholder: 'Chọn ngày bắt đầu',
                  },
                }}
              />
            </LocalizationProvider>
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
        <TabPanel value={tabValue} index={6}>
          {renderTestTable()}
        </TabPanel>
        {/* Modals */} {/* Modal lấy mẫu */}
        <SampleCollectionModal
          open={openComponentModal}
          onClose={() => setOpenComponentModal(false)}
          test={selectedTest}
          isPackage={isPackageModal}
          packageServices={packageServices}
          selectedService={selectedService}
          onSelectService={handleSelectServiceInPackage}
          serviceComponents={serviceComponents}
          loadingService={loadingService && !isPackageModal}
          onConfirmSample={async () => {
            if (!selectedTest) return;
            setLoadingService(true);
            await handleSampleCollected(selectedTest.testId);
            setLoadingService(false);
            setOpenComponentModal(false);
          }}
          confirming={loadingService}
          formatDateDisplay={formatDateDisplay}
          allServiceComponents={allServiceComponents}
        />
        <TestResultInputModal
          open={openResultModal}
          onClose={() => setOpenResultModal(false)}
          test={resultModalTest}
          isPackage={resultModalIsPackage}
          packageServices={resultModalPackageServices}
          selectedService={resultModalSelectedService}
          onSelectService={handleSelectServiceInResultModal}
          components={resultModalComponents}
          onSavePartial={handleSavePartialResult}
          onSaveAll={handleSaveAllResult}
          onComplete={handleCompleteResult}
          loading={resultModalLoading}
          error={resultModalError}
          success={resultModalSuccess}
        />
        <FinalTestResultModal
          open={openFinalResultModal}
          onClose={() => setOpenFinalResultModal(false)}
          test={selectedTest}
          formatDateDisplay={formatDateDisplay}
        />
        <CanceledTestDetailModal
          open={openCanceledDetailModal}
          onClose={() => setOpenCanceledDetailModal(false)}
          test={selectedCanceledTest}
          formatDateDisplay={formatDateDisplay}
        />
        {/* Modal xác nhận xét nghiệm */}
        <TestConfirmationModal
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          test={testToConfirm}
          onConfirm={handleConfirmFromModal}
          loading={confirmModalLoading}
          formatAppointmentDate={formatAppointmentDate}
          renderStatusChip={renderStatusChip}
          PAYMENT_LABELS={PAYMENT_LABELS}
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
          {dateFilter && (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Đang lọc từ ngày hẹn {formatDateDisplay(dateFilter)} trở đi
            </Typography>
          )}
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
                    {formatAppointmentDate(test.appointmentDate)}
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

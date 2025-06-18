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
} from '@mui/material';
import {
  getStaffTests,
  confirmTest,
  addTestResults,
  sampleTest,
  completeTest,
} from '../../services/stiService';
import apiClient from '../../services/api';
import { formatDateDisplay, formatDateTime } from '../../utils/dateUtils';

// Import the modal components
import SingleTestResultModal from './modals/SingleTestResultModal';
import PackageManagementModal from './modals/PackageManagementModal';
import TestInPackageModal from './modals/TestInPackageModal';

const STITestManagementContent = () => {
  // Hằng số cho hiển thị trạng thái (sử dụng useMemo để tránh vấn đề phụ thuộc)
  const TEST_STATUSES = useMemo(
    () => ({
      PENDING: {
        value: 'PENDING',
        label: 'Chờ xác nhận',
        color: 'warning',
      },
      CONFIRMED: { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'info' },
      SAMPLED: {
        value: 'SAMPLED',
        label: 'Đã lấy mẫu',
        color: 'primary',
      },
      RESULTED: {
        value: 'RESULTED',
        label: 'Có kết quả',
        color: 'secondary',
      },
      COMPLETED: { value: 'COMPLETED', label: 'Hoàn thành', color: 'success' },
      CANCELED: { value: 'CANCELED', label: 'Đã hủy', color: 'error' },
    }),
    []
  );

  // State cho danh sách test và packages
  const [userTests, setUserTests] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // State cho quản lý giao diện
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // all, single, package
  const [statusFilter, setStatusFilter] = useState('all'); // all, PENDING, CONFIRMED, SAMPLED, RESULTED, COMPLETED, CANCELED

  // State cho dialog cập nhật kết quả
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [currentUserTest, setCurrentUserTest] = useState(null);
  const [resultUpdating, setResultUpdating] = useState(false);
  // State cho dialog cập nhật kết quả gói xét nghiệm
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [openTestInPackageDialog, setOpenTestInPackageDialog] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [currentTestInPackage, setCurrentTestInPackage] = useState(null);
  const [packageResultUpdating, setPackageResultUpdating] = useState(false); // Không sử dụng State cho file upload

  // Định nghĩa fetchStaffTests với useCallback để có thể tái sử dụng và tránh re-render
  const fetchStaffTests = useCallback(async () => {
    setLoading(true);

    // If mock data is explicitly requested, use it directly
    if (useMockData) {
      console.log('Using mock data as requested');
      // setUserTests(MOCK_SINGLE_TESTS);
      // setUserPackages(MOCK_TEST_PACKAGES);
      setLoading(false);
      return;
    }

    try {
      // /sti-services/staff/my-tests
      const response = await getStaffTests();
      console.log('API Response:', response);
      if (response && response.success) {
        const tests = response.data || [];
        console.log('Tests data:', tests);

        const processedTests = tests.map((test) => {
          // Handle date fields that might be arrays
          const processAppointmentDate = (dateVal) => {
            if (Array.isArray(dateVal) && dateVal.length >= 3) {
              const [year, month, day, hour = 0, minute = 0] = dateVal;
              return new Date(year, month - 1, day, hour, minute).toISOString();
            }
            return dateVal;
          };

          return {
            ...test,
            // Ensure these fields are always available
            paymentMethod:
              test.paymentMethod === null
                ? 'DIRECT_TRANSFER'
                : test.paymentMethod === 'UNKNOWN'
                  ? 'UNKNOWN'
                  : test.paymentMethod || 'UNKNOWN',
            isPaid: !!test.isPaid,
            customerName: test.customerName || 'Không có tên',
            serviceName:
              test.serviceName || test.packageName || 'Không xác định',
            status: test.status || 'PENDING',
            // Process date fields
            appointmentDate: processAppointmentDate(test.appointmentDate),
            requestDate: processAppointmentDate(test.requestDate),
            resultDate: processAppointmentDate(test.resultDate),
            sampleDate: processAppointmentDate(test.sampleDate),
            completionDate: processAppointmentDate(test.completionDate),
          };
        });

        // Separate single tests and test packages
        const singleTests = processedTests.filter((test) => !test.packageId);
        const packagesTests = processedTests.filter((test) => test.packageId);

        console.log('Single tests:', singleTests);
        console.log('Package tests before grouping:', packagesTests);

        // Group tests by packageId and create proper package objects
        const packagesMap = {};
        packagesTests.forEach((test) => {
          if (!packagesMap[test.packageId]) {
            // Create a new package entry if it doesn't exist
            packagesMap[test.packageId] = {
              packageId: test.packageId,
              packageName:
                test.packageName || `Gói xét nghiệm #${test.packageId}`,
              customerName: test.customerName,
              customerId: test.customerId,
              status: test.status,
              appointmentDate: test.appointmentDate,
              paymentMethod: test.paymentMethod,
              isPaid: test.isPaid,
              consultantNotes: test.consultantNotes || '',
              tests: [], // Initialize an empty array for tests
            };
          }

          // Add this test to the package's tests array
          packagesMap[test.packageId].tests.push({
            ...test,
            testItemId:
              test.id ||
              `test-${test.packageId}-${Math.floor(Math.random() * 1000)}`,
          });
        });

        // Convert the map to an array of package objects
        const packages = Object.values(packagesMap);

        console.log('Grouped packages with tests:', packages);

        setUserTests(singleTests);
        setUserPackages(packages);
      } else {
        setError((response && response.message) || 'Failed to fetch tests');
      }
    } catch (err) {
      console.error('Error fetching staff tests:', err);
      setError(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  // Gọi API lấy dữ liệu khi component mount
  useEffect(() => {
    fetchStaffTests();
  }, [fetchStaffTests]); // fetchStaffTests includes useMockData in its dependencies

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Filter các xét nghiệm theo loại hiển thị
  const handleChangeViewMode = (mode) => {
    setViewMode(mode);
    setPage(0);
  };
  // Xử lý mở dialog cập nhật kết quả xét nghiệm đơn lẻ
  const handleOpenResultDialog = (userTest) => {
    // Kiểm tra và tạo components nếu chưa có
    let testWithComponents = { ...userTest };

    // Nếu là xét nghiệm có thể đến trạng thái RESULTED, nhưng chưa có components
    if (
      (userTest.status === 'SAMPLED' || userTest.status === 'CONFIRMED') &&
      (!userTest.components || userTest.components.length === 0)
    ) {
      // Tạo mẫu components dựa trên thông tin xét nghiệm
      testWithComponents.components = [
        {
          componentId: userTest.serviceId,
          componentName: userTest.serviceName || 'Xét nghiệm STI',
          resultValue: '',
          normalRange: '',
          unit: '',
        },
      ];
    }

    // Đánh dấu nếu đã hoàn thành để modal hiển thị ở chế độ chỉ đọc
    if (userTest.status === 'COMPLETED') {
      testWithComponents.isReadOnly = true;
    } else {
      testWithComponents.isReadOnly = false;
    }

    setCurrentUserTest(testWithComponents);
    setOpenResultDialog(true);
  };

  // Đóng dialog cập nhật kết quả xét nghiệm đơn lẻ
  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
    setCurrentUserTest(null);
  };
  // Xử lý mở dialog cập nhật kết quả gói xét nghiệm
  const handleOpenPackageDialog = (packageTest) => {
    console.log('Opening package dialog with data:', packageTest);

    // Ensure the package has a tests array
    if (!packageTest.tests) {
      packageTest.tests = [];
    }

    // Đánh dấu nếu đã hoàn thành để modal hiển thị ở chế độ chỉ đọc
    const packageWithReadOnlyFlag = {
      ...packageTest,
      isReadOnly: packageTest.status === 'COMPLETED',
    };

    setCurrentPackage(packageWithReadOnlyFlag);
    setOpenPackageDialog(true);
  };

  // Đóng dialog cập nhật kết quả gói xét nghiệm
  const handleClosePackageDialog = () => {
    setOpenPackageDialog(false);
    setCurrentPackage(null);
  };

  // Đóng dialog cập nhật xét nghiệm trong gói
  const handleCloseTestInPackageDialog = () => {
    setOpenTestInPackageDialog(false);
    setCurrentTestInPackage(null);
  };
  // Xử lý mở dialog cập nhật kết quả cho một xét nghiệm cụ thể trong gói
  const handleOpenTestInPackageDialog = (packageItem, testItem) => {
    console.log(
      'Opening test-in-package dialog with data:',
      packageItem,
      testItem
    );

    // Ensure the package has a tests array
    if (!packageItem.tests) {
      packageItem.tests = [];
    }

    // Ensure the test item has required fields
    if (testItem && !testItem.testItemId) {
      testItem.testItemId = testItem.id || `test-${Date.now()}`;
    }

    // Đánh dấu nếu đã hoàn thành để modal hiển thị ở chế độ chỉ đọc
    const isCompleted =
      packageItem.status === 'COMPLETED' || testItem.status === 'COMPLETED';
    const packageWithReadOnlyFlag = {
      ...packageItem,
      isReadOnly: isCompleted,
    };

    const testWithReadOnlyFlag = {
      ...testItem,
      isReadOnly: isCompleted,
    };

    setCurrentPackage(packageWithReadOnlyFlag);
    setCurrentTestInPackage(testWithReadOnlyFlag);
    setOpenTestInPackageDialog(true); // This should open the specific test dialog instead of general package dialog
  };

  // Xử lý xác nhận xét nghiệm
  const handleConfirmTest = async (testId) => {
    if (!testId) {
      alert('Không tìm thấy ID của xét nghiệm');
      return;
    }

    try {
      // Gọi API xác nhận xét nghiệm
      const response = await confirmTest(testId);

      if (response && response.success) {
        // Cập nhật danh sách xét nghiệm
        await fetchStaffTests();

        // Thông báo thành công
        alert('Đã xác nhận xét nghiệm thành công!');
      } else {
        alert(response?.message || 'Không thể xác nhận xét nghiệm');
      }
    } catch (err) {
      console.error('Lỗi khi xác nhận xét nghiệm:', err);
      alert(err.response?.data?.message || err.message || 'Lỗi kết nối');
    }
  };

  // Xử lý lấy mẫu xét nghiệm
  const handleSampleTest = async (testId) => {
    if (!testId) {
      alert('Không tìm thấy ID của xét nghiệm');
      return;
    }

    try {
      // Gọi API lấy mẫu xét nghiệm
      const response = await sampleTest(testId);

      if (response && response.success) {
        // Cập nhật danh sách xét nghiệm
        await fetchStaffTests();

        // Thông báo thành công
        alert('Đã cập nhật trạng thái lấy mẫu thành công!');
      } else {
        alert(response?.message || 'Không thể cập nhật trạng thái lấy mẫu');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái lấy mẫu:', err);
      alert(err.response?.data?.message || err.message || 'Lỗi kết nối');
    }
  };

  // Xử lý hoàn thành xét nghiệm
  const handleCompleteTest = async (testId) => {
    if (!testId) {
      alert('Không tìm thấy ID của xét nghiệm');
      return;
    }

    try {
      // Gọi API hoàn thành xét nghiệm
      const response = await completeTest(testId);

      if (response && response.success) {
        // Cập nhật danh sách xét nghiệm
        await fetchStaffTests();

        // Thông báo thành công
        alert('Đã hoàn thành xét nghiệm thành công!');
      } else {
        alert(response?.message || 'Không thể hoàn thành xét nghiệm');
      }
    } catch (err) {
      console.error('Lỗi khi hoàn thành xét nghiệm:', err);
      alert(err.response?.data?.message || err.message || 'Lỗi kết nối');
    }
  };

  // Xử lý thay đổi giá trị kết quả xét nghiệm
  const handleResultChange = (field, value) => {
    if (currentUserTest) {
      if (field.startsWith('component_')) {
        // Handle component field updates
        const [, componentIndex, componentField] = field.split('_');
        const updatedComponents = [...currentUserTest.components];
        updatedComponents[componentIndex] = {
          ...updatedComponents[componentIndex],
          [componentField]: value,
        };

        setCurrentUserTest({
          ...currentUserTest,
          components: updatedComponents,
        });
      } else {
        // Handle direct test field updates
        setCurrentUserTest({
          ...currentUserTest,
          [field]: value,
        });
      }
    }
  };

  // Xử lý lưu kết quả xét nghiệm đơn lẻ
  const handleSaveResult = async () => {
    if (!currentUserTest) return;

    setResultUpdating(true);
    try {
      // Prepare the test results in the required format
      const testResults = currentUserTest.components
        ? currentUserTest.components.map((component) => ({
            componentId: component.componentId,
            resultValue: component.resultValue || '',
            normalRange: component.normalRange || '',
            unit: component.unit || '',
          }))
        : [
            {
              componentId: currentUserTest.serviceId,
              resultValue: currentUserTest.result || 'negative',
              normalRange: currentUserTest.normalRange || 'Negative',
              unit: currentUserTest.unit || '',
            },
          ];

      // Call the addTestResults function with the new format
      const response = await addTestResults(
        currentUserTest.testId,
        testResults
      );

      if (response && response.success) {
        // Update local state
        setUserTests((prevTests) =>
          prevTests.map((test) =>
            test.testId === currentUserTest.testId
              ? {
                  ...test,
                  status: 'RESULTED',
                  result: currentUserTest.result || 'negative',
                  resultLabel: currentUserTest.resultLabel || 'Âm tính',
                  resultDetails: currentUserTest.resultDetails || '',
                  resultDate: new Date().toISOString(),
                  components: currentUserTest.components,
                }
              : test
          )
        );

        handleCloseResultDialog();
        // Show success message
        alert('Kết quả xét nghiệm đã được lưu thành công!');
      } else {
        alert(response?.message || 'Không thể lưu kết quả xét nghiệm');
      }
    } catch (err) {
      console.error('Error saving test result:', err);
      alert(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setResultUpdating(false);
    }
  };

  // Xử lý lưu kết quả một xét nghiệm trong gói xét nghiệm
  const handleSaveTestInPackage = async () => {
    if (!currentPackage || !currentTestInPackage) return;

    setPackageResultUpdating(true);
    try {
      // Prepare the test results in the required format
      const testResults = [
        {
          componentId:
            currentTestInPackage.componentId || currentTestInPackage.serviceId,
          resultValue: currentTestInPackage.result || 'negative',
          normalRange: currentTestInPackage.normalRange || 'Negative',
          unit: currentTestInPackage.unit || '',
        },
      ];

      // Call the addTestResults function with the new format
      const response = await addTestResults(
        currentTestInPackage.testItemId,
        testResults
      );

      if (response && response.success) {
        // Update local state
        setUserPackages((prevPackages) =>
          prevPackages.map((pack) => {
            if (pack.testId === currentPackage.testId) {
              return {
                ...pack,
                tests: pack.tests.map((test) =>
                  test.testItemId === currentTestInPackage.testItemId
                    ? {
                        ...test,
                        status: 'RESULTED',
                        result: currentTestInPackage.result || 'negative',
                        resultLabel:
                          currentTestInPackage.resultLabel || 'Âm tính',
                        resultDetails: currentTestInPackage.resultDetails || '',
                        resultDate: new Date().toISOString(),
                      }
                    : test
                ),
              };
            }
            return pack;
          })
        );

        handleCloseTestInPackageDialog();
        // Show success message
        alert('Kết quả xét nghiệm đã được lưu thành công!');
      } else {
        alert(response?.message || 'Không thể lưu kết quả xét nghiệm');
      }
    } catch (err) {
      console.error('Error saving test result in package:', err);
      alert(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setPackageResultUpdating(false);
    }
  };

  // Xử lý lưu kết quả và ghi chú cho cả gói xét nghiệm
  const handleSavePackage = async () => {
    if (!currentPackage) return;

    setPackageResultUpdating(true);
    try {
      const response = await apiClient.put(
        `/sti-services/staff/packages/${currentPackage.testId}`,
        {
          consultantNotes: currentPackage.consultantNotes || '',
          status: currentPackage.status,
        }
      );

      if (response.data && response.data.success) {
        // Update local state
        setUserPackages((prevPackages) =>
          prevPackages.map((pack) =>
            pack.testId === currentPackage.testId
              ? {
                  ...pack,
                  consultantNotes: currentPackage.consultantNotes || '',
                  status: currentPackage.status,
                }
              : pack
          )
        );

        handleClosePackageDialog();
      } else {
        alert(response.data.message || 'Failed to save package information');
      }
    } catch (err) {
      console.error('Error saving package information:', err);
      alert(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setPackageResultUpdating(false);
    }
  };

  // Xử lý xác nhận tất cả xét nghiệm trong gói
  const handleConfirmPackage = async (packageData) => {
    if (!packageData || !packageData.tests || packageData.tests.length === 0) {
      alert('Không có xét nghiệm nào trong gói để xác nhận');
      return;
    }

    try {
      // Hiển thị thông báo xác nhận
      if (
        !window.confirm(
          `Bạn có chắc chắn muốn xác nhận tất cả ${packageData.tests.length} xét nghiệm trong gói này không?`
        )
      ) {
        return;
      }

      // Đếm số xét nghiệm đã xác nhận thành công
      let confirmedCount = 0;
      let failedTests = [];

      // Tạo một bản sao của danh sách tests để cập nhật
      const updatedTests = [...packageData.tests];

      // Xác nhận từng xét nghiệm trong gói
      for (let i = 0; i < packageData.tests.length; i++) {
        const test = packageData.tests[i];

        // Chỉ xác nhận các xét nghiệm có trạng thái PENDING
        if (test.status === 'PENDING' && test.id) {
          try {
            const response = await confirmTest(test.id);

            if (response && response.success) {
              confirmedCount++;
              // Cập nhật trạng thái trong danh sách
              updatedTests[i] = { ...test, status: 'CONFIRMED' };
            } else {
              failedTests.push(test.serviceName || `Xét nghiệm #${i + 1}`);
            }
          } catch (error) {
            console.error(`Lỗi khi xác nhận xét nghiệm ${test.id}:`, error);
            failedTests.push(test.serviceName || `Xét nghiệm #${i + 1}`);
          }
        }
      }

      // Cập nhật trạng thái gói trong UI
      if (packageData === currentPackage) {
        setCurrentPackage({
          ...currentPackage,
          tests: updatedTests,
        });
      }

      // Cập nhật danh sách xét nghiệm và gói
      await fetchStaffTests();

      // Hiển thị kết quả
      if (confirmedCount > 0) {
        const message =
          failedTests.length > 0
            ? `Đã xác nhận thành công ${confirmedCount} xét nghiệm. Tuy nhiên, ${failedTests.length} xét nghiệm không thể xác nhận: ${failedTests.join(', ')}`
            : `Đã xác nhận thành công ${confirmedCount} xét nghiệm!`;
        alert(message);
      } else {
        alert('Không thể xác nhận bất kỳ xét nghiệm nào trong gói');
      }
    } catch (err) {
      console.error('Lỗi khi xác nhận gói xét nghiệm:', err);
      alert(err.response?.data?.message || err.message || 'Lỗi kết nối');
    }
  };

  // Xử lý thay đổi thông tin của một xét nghiệm trong gói
  const handleTestInPackageChange = (field, value) => {
    if (currentTestInPackage) {
      setCurrentTestInPackage({
        ...currentTestInPackage,
        [field]: value,
      });
    }
  };

  // Tiện ích chuyển đổi trạng thái hiển thị từ backend DTO sang hiển thị UI
  const getStatusDisplayText = useCallback(
    (status) => {
      if (!status) return 'Unknown';

      const statusObj = TEST_STATUSES[status];
      return statusObj ? statusObj.label : status;
    },
    [TEST_STATUSES]
  );

  // Tiện ích chuyển đổi loại thanh toán từ backend DTO sang hiển thị UI
  const getPaymentDisplayText = useCallback((paymentMethod) => {
    if (paymentMethod === null || paymentMethod === 'NULL' || !paymentMethod)
      return 'Chuyển khoản trực tiếp';

    if (paymentMethod === 'UNKNOWN') return 'Chưa thanh toán';

    switch (paymentMethod) {
      case 'COD':
        return 'Thanh toán tại chỗ';
      case 'VISA':
        return 'Thẻ tín dụng';
      case 'QR_CODE':
        return 'Chuyển khoản QR';
      case 'BANKING':
        return 'Chuyển khoản';
      case 'CASH':
        return 'Tiền mặt';
      case 'DIRECT_TRANSFER':
        return 'Chuyển khoản trực tiếp';
      default:
        // If the value is something we don't recognize, return "Chưa thanh toán"
        console.log('Unknown payment method:', paymentMethod);
        return 'Chưa thanh toán';
    }
  }, []);
  // Xử lý thay đổi thông tin chung của gói xét nghiệm
  const handlePackageChange = (field, value) => {
    if (currentPackage) {
      setCurrentPackage({
        ...currentPackage,
        [field]: value,
      });
    }
  };

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      // Handle array date format from the API (e.g., [2025, 6, 19, 15, 30])
      if (Array.isArray(dateString)) {
        console.log('Handling array date format:', dateString);
        // Check if the array contains at least year, month, day
        if (dateString.length >= 3) {
          const [year, month, day, hour = 0, minute = 0] = dateString;
          const date = new Date(year, month - 1, day, hour, minute);

          if (!isNaN(date.getTime())) {
            return date.toLocaleString('vi-VN');
          }
        }
        return 'N/A';
      }

      // Check if it's SQL DateTime format with milliseconds (e.g., 2025-06-18 13:20:24.8233330)
      if (
        typeof dateString === 'string' &&
        dateString.includes(' ') &&
        dateString.includes(':')
      ) {
        return formatDateTime(dateString);
      } else {
        return formatDateDisplay(dateString);
      }
    } catch (err) {
      console.error('Error formatting date:', err, dateString);
      return 'N/A';
    }
  };

  // Lấy màu cho kết quả
  const getResultColor = (result) => {
    if (!result) return 'default';

    switch (result.toLowerCase()) {
      case 'negative':
        return 'success';
      case 'positive':
        return 'error';
      case 'indeterminate':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Filter kết quả xét nghiệm dựa trên searchTerm, viewMode và statusFilter
  const getFilteredTests = () => {
    let filteredTests = [];

    // Apply view mode filter
    if (viewMode === 'all' || viewMode === 'single') {
      filteredTests = filteredTests.concat(userTests);
    }

    if (viewMode === 'all' || viewMode === 'package') {
      filteredTests = filteredTests.concat(userPackages);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTests = filteredTests.filter(
        (test) => test.status === statusFilter
      );
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTests = filteredTests.filter(
        (test) =>
          (test.customerName &&
            test.customerName.toLowerCase().includes(term)) ||
          (test.customerEmail &&
            test.customerEmail.toLowerCase().includes(term)) ||
          (test.serviceName && test.serviceName.toLowerCase().includes(term)) ||
          (test.packageName && test.packageName.toLowerCase().includes(term))
      );
    }

    return filteredTests;
  };
  // Render table UI
  const renderTestsTable = () => {
    const filteredTests = getFilteredTests();

    return (
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              {' '}
              <TextField
                fullWidth
                label="Tìm kiếm bệnh nhân"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tên, email hoặc dịch vụ xét nghiệm..."
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                    },
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {' '}
              <FormControl fullWidth size="small">
                <InputLabel>Loại xét nghiệm</InputLabel>
                <Select
                  value={viewMode}
                  onChange={(e) => handleChangeViewMode(e.target.value)}
                  label="Loại xét nghiệm"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                    },
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <MenuItem value="all">Tất cả xét nghiệm</MenuItem>
                  <MenuItem value="single">Xét nghiệm đơn lẻ</MenuItem>
                  <MenuItem value="package">Gói xét nghiệm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              {' '}
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái xử lý</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái xử lý"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                    },
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  {Object.keys(TEST_STATUSES).map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={TEST_STATUSES[status].label}
                        color={TEST_STATUSES[status].color}
                        size="small"
                        sx={{ minWidth: '90px' }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-block',
                position: 'relative',
                width: '50px',
                height: '50px',
                animation: 'spin 1.2s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: '3px solid rgba(0,0,0,0.1)',
                  borderRadius: '50%',
                  borderTopColor: '#1976d2',
                }}
              ></Box>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Đang tải dữ liệu xét nghiệm...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                mb: 2,
              }}
            >
              <span role="img" aria-label="error" style={{ fontSize: '28px' }}>
                ⚠️
              </span>
            </Box>
            <Typography variant="h6" color="error.main" sx={{ mb: 1 }}>
              Lỗi khi tải dữ liệu
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '500px',
                mx: 'auto',
                p: 1,
                borderRadius: 1,
                backgroundColor: 'error.light',
                color: 'error.dark',
              }}
            >
              {error}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 3 }}
              onClick={fetchStaffTests}
            >
              Thử lại
            </Button>
          </Box>
        ) : filteredTests.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                mb: 2,
              }}
            >
              <span role="img" aria-label="empty" style={{ fontSize: '32px' }}>
                🔍
              </span>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Không tìm thấy kết quả phù hợp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setSearchTerm('')}
              >
                Xóa từ khóa tìm kiếm
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#e3f2fd',
                      '& .MuiTableCell-head': {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1976d2',
                        py: 2,
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Mã xét nghiệm
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Bệnh nhân</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Loại xét nghiệm
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ngày hẹn</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Thanh toán
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quản lý</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTests
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.testId}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f5f9ff',
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell>{row.testId}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.customerName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {row.packageName || row.serviceName}
                        </TableCell>
                        <TableCell>{formatDate(row.appointmentDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusDisplayText(row.status)}
                            color={
                              TEST_STATUSES[row.status]?.color || 'default'
                            }
                            size="small"
                            sx={{ fontWeight: 'medium', px: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getPaymentDisplayText(row.paymentMethod)}
                            color={row.isPaid ? 'success' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 'medium', px: 1 }}
                          />
                        </TableCell>{' '}
                        <TableCell>
                          <Box
                            sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                          >
                            {row.packageId ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="info"
                                onClick={() => handleOpenPackageDialog(row)}
                                startIcon={
                                  <span role="img" aria-label="package">
                                    📋
                                  </span>
                                }
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
                                  fontWeight: 500,
                                  px: 2,
                                  '&:hover': {
                                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
                                    backgroundColor: '#0288d1',
                                  },
                                }}
                              >
                                Chi tiết gói
                              </Button>
                            ) : (
                              <>
                                {/* Buttons based on test status */}{' '}
                                {row.status === 'PENDING' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="warning"
                                    onClick={() =>
                                      handleConfirmTest(row.testId)
                                    }
                                    startIcon={
                                      <span role="img" aria-label="confirm">
                                        ✅
                                      </span>
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 500,
                                      boxShadow:
                                        '0 2px 5px rgba(0, 0, 0, 0.08)',
                                      '&:hover': {
                                        boxShadow:
                                          '0 3px 10px rgba(0, 0, 0, 0.12)',
                                      },
                                    }}
                                  >
                                    Xác nhận yêu cầu
                                  </Button>
                                )}
                                {row.status === 'CONFIRMED' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSampleTest(row.testId)}
                                    startIcon={
                                      <span role="img" aria-label="sample">
                                        🧪
                                      </span>
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 500,
                                      boxShadow:
                                        '0 2px 5px rgba(0, 0, 0, 0.08)',
                                      '&:hover': {
                                        boxShadow:
                                          '0 3px 10px rgba(0, 0, 0, 0.12)',
                                      },
                                    }}
                                  >
                                    Tiến hành lấy mẫu
                                  </Button>
                                )}
                                {(row.status === 'SAMPLED' ||
                                  row.status === 'CONFIRMED') && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleOpenResultDialog(row)}
                                    startIcon={
                                      <span role="img" aria-label="result">
                                        📝
                                      </span>
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 500,
                                      boxShadow:
                                        '0 2px 5px rgba(0, 0, 0, 0.08)',
                                      '&:hover': {
                                        boxShadow:
                                          '0 3px 10px rgba(0, 0, 0, 0.12)',
                                      },
                                    }}
                                  >
                                    Cập nhật kết quả
                                  </Button>
                                )}
                                {row.status === 'RESULTED' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() =>
                                      handleCompleteTest(row.testId)
                                    }
                                    startIcon={
                                      <span role="img" aria-label="complete">
                                        ✓
                                      </span>
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 500,
                                      boxShadow:
                                        '0 2px 5px rgba(0, 0, 0, 0.08)',
                                      '&:hover': {
                                        boxShadow:
                                          '0 3px 10px rgba(0, 0, 0, 0.12)',
                                        backgroundColor: '#2e7d32',
                                      },
                                    }}
                                  >
                                    Hoàn tất xét nghiệm
                                  </Button>
                                )}{' '}
                                {/* Always show view button, with different wording based on status */}{' '}
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleOpenResultDialog(row)}
                                  startIcon={
                                    <span role="img" aria-label="view">
                                      {row.status === 'COMPLETED' ? '📋' : '👁️'}
                                    </span>
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    borderColor:
                                      row.status === 'COMPLETED'
                                        ? 'success.main'
                                        : 'grey.400',
                                    color:
                                      row.status === 'COMPLETED'
                                        ? 'success.dark'
                                        : 'grey.700',
                                    fontWeight: 500,
                                    '&:hover': {
                                      backgroundColor:
                                        row.status === 'COMPLETED'
                                          ? 'rgba(76, 175, 80, 0.04)'
                                          : 'rgba(0, 0, 0, 0.04)',
                                      borderColor:
                                        row.status === 'COMPLETED'
                                          ? 'success.main'
                                          : 'grey.500',
                                    },
                                  }}
                                >
                                  {row.status === 'COMPLETED'
                                    ? 'Xem kết quả'
                                    : 'Xem hồ sơ'}
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]}
              component="div"
              count={filteredTests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>
    );
  };
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box>
          {' '}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '60px',
                height: '4px',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              },
            }}
          >
            Cập nhật kết quả xét nghiệm
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Theo dõi và cập nhật kết quả xét nghiệm STI của bệnh nhân
          </Typography>
        </Box>

        {/* Toggle switch for real/mock data */}
        <Box
          sx={{
            mt: { xs: 2, md: 0 },
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {' '}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Nguồn dữ liệu:
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Button
              variant={useMockData ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setUseMockData(true)}
              sx={{
                mr: 1,
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                minWidth: '110px',
                boxShadow: useMockData ? 2 : 0,
              }}
              size="small"
            >
              <span style={{ fontWeight: useMockData ? 600 : 400 }}>
                Giả lập
              </span>
            </Button>
            <Button
              variant={!useMockData ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setUseMockData(false)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                minWidth: '110px',
                boxShadow: !useMockData ? 2 : 0,
              }}
              size="small"
            >
              <span style={{ fontWeight: !useMockData ? 600 : 400 }}>
                Dữ liệu API
              </span>
            </Button>
          </Box>
        </Box>
      </Box>
      {renderTestsTable()}
      {/* Dialog cập nhật kết quả xét nghiệm đơn lẻ */}{' '}
      <SingleTestResultModal
        open={openResultDialog}
        onClose={handleCloseResultDialog}
        currentTest={currentUserTest}
        handleResultChange={handleResultChange}
        handleSaveResult={handleSaveResult}
        handleConfirmTest={handleConfirmTest}
        handleSampleTest={handleSampleTest}
        handleCompleteTest={handleCompleteTest}
        resultUpdating={resultUpdating}
        TEST_STATUSES={TEST_STATUSES}
        readOnly={currentUserTest?.isReadOnly || false}
      />{' '}
      {/* Dialog cập nhật kết quả cho một xét nghiệm trong gói */}{' '}
      <TestInPackageModal
        open={openTestInPackageDialog}
        onClose={handleCloseTestInPackageDialog}
        currentPackage={currentPackage}
        currentTestInPackage={currentTestInPackage}
        handleTestInPackageChange={handleTestInPackageChange}
        handleSaveTestInPackage={handleSaveTestInPackage}
        packageResultUpdating={packageResultUpdating}
        TEST_STATUSES={TEST_STATUSES}
        readOnly={
          currentTestInPackage?.isReadOnly ||
          currentPackage?.isReadOnly ||
          false
        }
      />
      {/* Dialog quản lý gói xét nghiệm */}{' '}
      <PackageManagementModal
        open={openPackageDialog && currentPackage !== null}
        onClose={handleClosePackageDialog}
        currentPackage={currentPackage}
        handlePackageChange={handlePackageChange}
        handleSavePackage={handleSavePackage}
        packageResultUpdating={packageResultUpdating}
        TEST_STATUSES={TEST_STATUSES}
        getStatusDisplayText={getStatusDisplayText}
        getResultColor={getResultColor}
        formatDate={formatDate}
        handleOpenTestInPackageDialog={handleOpenTestInPackageDialog}
        handleConfirmPackage={handleConfirmPackage}
        handleConfirmTest={handleConfirmTest}
        readOnly={currentPackage?.isReadOnly || false}
      />
    </Container>
  );
};

export default STITestManagementContent;

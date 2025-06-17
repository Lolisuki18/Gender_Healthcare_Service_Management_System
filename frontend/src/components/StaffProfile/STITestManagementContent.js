/**
 * STITestManagementContent.js
 *
 * Mục đích: Quản lý kết quả xét nghiệm STI của người dùng
 * - Hiển thị danh sách các xét nghiệm STI của người dùng
 * - Cập nhật tiến độ và trạng thái xét nghiệm (PENDING, CONFIRMED, SAMPLED, RESULTED, COMPLETED, CANCELED)
 * - Ghi nhận và cập nhật kết quả xét nghiệm thông qua STITestResponse DTO
 * - Tải lên tài liệu kết quả khi cần
 * - Quản lý kết quả cho cả xét nghiệm đơn lẻ và gói xét nghiệm
 * - Hỗ trợ đặt lịch xét nghiệm mới qua STITestRequest DTO (serviceId/packageId + appointmentDate + paymentMethod)
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from "@mui/material";
import apiClient from "../../services/api";

// Mock data for when the API returns no data
const MOCK_SINGLE_TESTS = [
  {
    testId: "mock-test-1",
    userId: "user-123",
    serviceId: "service-hiv",
    serviceName: "Xét nghiệm HIV",
    status: "PENDING",
    requestDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    appointmentDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 300000,
    paymentMethod: "BANKING",
    isPaid: true,
    customerName: "Trần Thị B",
    customerEmail: "customer@example.com",
    customerPhone: "0987654321",
  },
  {
    testId: "mock-test-2",
    userId: "user-124",
    serviceId: "service-hpv",
    serviceName: "Xét nghiệm HPV",
    status: "CONFIRMED",
    requestDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    appointmentDate: new Date().toISOString(), // Today
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 450000,
    paymentMethod: "CASH",
    isPaid: true,
    customerName: "Lê Văn C",
    customerEmail: "customer2@example.com",
    customerPhone: "0987654322",
  },
  {
    testId: "mock-test-3",
    userId: "user-125",
    serviceId: "service-syphilis",
    serviceName: "Xét nghiệm Giang Mai",
    status: "SAMPLED",
    requestDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    sampleDate: new Date().toISOString(), // Today
    appointmentDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 350000,
    paymentMethod: "BANKING",
    isPaid: true,
    customerName: "Phạm Thị D",
    customerEmail: "customer3@example.com",
    customerPhone: "0987654323",
  },
  {
    testId: "mock-test-4",
    userId: "user-126",
    serviceId: "service-gonorrhea",
    serviceName: "Xét nghiệm Lậu",
    status: "RESULTED",
    requestDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    sampleDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    resultDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    appointmentDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 320000,
    paymentMethod: "CASH",
    isPaid: true,
    result: "negative",
    resultLabel: "Âm tính",
    resultDetails: "Không phát hiện dấu hiệu nhiễm bệnh",
    customerName: "Hoàng Văn E",
    customerEmail: "customer4@example.com",
    customerPhone: "0987654324",
  },
  {
    testId: "mock-test-5",
    userId: "user-127",
    serviceId: "service-chlamydia",
    serviceName: "Xét nghiệm Chlamydia",
    status: "COMPLETED",
    requestDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    sampleDate: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
    resultDate: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    completionDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    appointmentDate: new Date(Date.now() - 86400000 * 9).toISOString(), // 9 days ago
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 380000,
    paymentMethod: "BANKING",
    isPaid: true,
    result: "positive",
    resultLabel: "Dương tính",
    resultDetails: "Phát hiện dấu hiệu nhiễm Chlamydia, cần điều trị",
    customerName: "Ngô Thị F",
    customerEmail: "customer5@example.com",
    customerPhone: "0987654325",
  },
  {
    testId: "mock-test-6",
    userId: "user-128",
    serviceId: "service-herpes",
    serviceName: "Xét nghiệm Herpes",
    status: "CANCELED",
    requestDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    cancelDate: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    appointmentDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago (would have been)
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 400000,
    paymentMethod: "CASH",
    isPaid: false,
    cancelReason: "Khách hàng đổi lịch",
    customerName: "Đỗ Văn G",
    customerEmail: "customer6@example.com",
    customerPhone: "0987654326",
  },
];

// Mock data for test packages
const MOCK_TEST_PACKAGES = [
  {
    testId: "mock-package-1",
    userId: "user-123",
    packageId: "package-std-complete",
    packageName: "Gói xét nghiệm STD tổng quát",
    status: "CONFIRMED",
    requestDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    appointmentDate: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 1200000,
    paymentMethod: "BANKING",
    isPaid: true,
    customerName: "Trần Văn H",
    customerEmail: "customer7@example.com",
    customerPhone: "0987654327",
    tests: [
      {
        testItemId: "mock-package-item-1-1",
        testName: "Xét nghiệm HIV",
        status: "CONFIRMED",
      },
      {
        testItemId: "mock-package-item-1-2",
        testName: "Xét nghiệm Giang Mai",
        status: "CONFIRMED",
      },
      {
        testItemId: "mock-package-item-1-3",
        testName: "Xét nghiệm Lậu",
        status: "CONFIRMED",
      },
      {
        testItemId: "mock-package-item-1-4",
        testName: "Xét nghiệm Chlamydia",
        status: "CONFIRMED",
      },
    ],
  },
  {
    testId: "mock-package-2",
    userId: "user-124",
    packageId: "package-sti-basic",
    packageName: "Gói xét nghiệm STI cơ bản",
    status: "SAMPLED",
    requestDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    appointmentDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
    sampleDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 850000,
    paymentMethod: "CASH",
    isPaid: true,
    customerName: "Mai Thị I",
    customerEmail: "customer8@example.com",
    customerPhone: "0987654328",
    tests: [
      {
        testItemId: "mock-package-item-2-1",
        testName: "Xét nghiệm HIV",
        status: "RESULTED",
        result: "negative",
        resultLabel: "Âm tính",
        resultDetails: "Không phát hiện kháng thể HIV",
        resultDate: new Date().toISOString(), // Today
      },
      {
        testItemId: "mock-package-item-2-2",
        testName: "Xét nghiệm Giang Mai",
        status: "SAMPLED",
        sampleDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
      },
      {
        testItemId: "mock-package-item-2-3",
        testName: "Xét nghiệm HPV",
        status: "SAMPLED",
        sampleDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
      },
    ],
  },
  {
    testId: "mock-package-3",
    userId: "user-125",
    packageId: "package-complete-screening",
    packageName: "Gói sàng lọc toàn diện",
    status: "COMPLETED",
    requestDate: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    appointmentDate: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    sampleDate: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    completionDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    staffId: "staff-456",
    staffName: "Nguyễn Văn A",
    price: 1500000,
    paymentMethod: "BANKING",
    isPaid: true,
    customerName: "Vũ Thị K",
    customerEmail: "customer9@example.com",
    customerPhone: "0987654329",
    tests: [
      {
        testItemId: "mock-package-item-3-1",
        testName: "Xét nghiệm HIV",
        status: "COMPLETED",
        result: "negative",
        resultLabel: "Âm tính",
        resultDetails: "Không phát hiện kháng thể HIV",
        resultDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      },
      {
        testItemId: "mock-package-item-3-2",
        testName: "Xét nghiệm Giang Mai",
        status: "COMPLETED",
        result: "negative",
        resultLabel: "Âm tính",
        resultDetails: "Không phát hiện kháng thể Treponema pallidum",
        resultDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      },
      {
        testItemId: "mock-package-item-3-3",
        testName: "Xét nghiệm Lậu",
        status: "COMPLETED",
        result: "negative",
        resultLabel: "Âm tính",
        resultDetails: "Không phát hiện vi khuẩn Neisseria gonorrhoeae",
        resultDate: new Date(Date.now() - 86400000 * 9).toISOString(), // 9 days ago
      },
      {
        testItemId: "mock-package-item-3-4",
        testName: "Xét nghiệm Chlamydia",
        status: "COMPLETED",
        result: "negative",
        resultLabel: "Âm tính",
        resultDetails: "Không phát hiện vi khuẩn Chlamydia trachomatis",
        resultDate: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
      },
      {
        testItemId: "mock-package-item-3-5",
        testName: "Xét nghiệm HPV",
        status: "COMPLETED",
        result: "positive",
        resultLabel: "Dương tính",
        resultDetails:
          "Phát hiện virus HPV týp 16, 18. Cần theo dõi và tư vấn thêm.",
        resultDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      },
    ],
  },
];

const STITestManagementContent = () => {
  // Hằng số cho hiển thị trạng thái (sử dụng useMemo để tránh vấn đề phụ thuộc)
  const TEST_STATUSES = useMemo(
    () => ({
      PENDING: {
        value: "PENDING",
        label: "Chờ xác nhận",
        color: "warning",
      },
      CONFIRMED: { value: "CONFIRMED", label: "Đã xác nhận", color: "info" },
      SAMPLED: {
        value: "SAMPLED",
        label: "Đã lấy mẫu",
        color: "primary",
      },
      RESULTED: {
        value: "RESULTED",
        label: "Có kết quả",
        color: "secondary",
      },
      COMPLETED: { value: "COMPLETED", label: "Hoàn thành", color: "success" },
      CANCELED: { value: "CANCELED", label: "Đã hủy", color: "error" },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("all"); // all, single, package
  const [statusFilter, setStatusFilter] = useState("all"); // all, PENDING, CONFIRMED, SAMPLED, RESULTED, COMPLETED, CANCELED

  // State cho dialog cập nhật kết quả
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [currentUserTest, setCurrentUserTest] = useState(null);
  const [resultUpdating, setResultUpdating] = useState(false);

  // State cho dialog cập nhật kết quả gói xét nghiệm
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [currentTestInPackage, setCurrentTestInPackage] = useState(null);
  const [packageResultUpdating, setPackageResultUpdating] = useState(false);

  // State cho file upload
  const [selectedFiles, setSelectedFiles] = useState([]); // Fetch data from API
  useEffect(() => {
    const fetchStaffTests = async () => {
      setLoading(true);

      // If mock data is explicitly requested, use it directly
      if (useMockData) {
        console.log("Using mock data as requested");
        setUserTests(MOCK_SINGLE_TESTS);
        setUserPackages(MOCK_TEST_PACKAGES);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/sti-services/staff/my-tests");
        if (response.data && response.data.success) {
          const tests = response.data.data || [];

          // Separate single tests and test packages
          const singleTests = tests.filter((test) => !test.packageId);
          const packages = tests.filter((test) => test.packageId);

          // If no real data is returned, use mock data for development/testing
          if (singleTests.length === 0 && packages.length === 0) {
            console.log("No data from API, using mock data for development");
            setUserTests(MOCK_SINGLE_TESTS);
            setUserPackages(MOCK_TEST_PACKAGES);
          } else {
            setUserTests(singleTests);
            setUserPackages(packages);
          }
        } else {
          setError(response.data.message || "Failed to fetch tests");
          // Use mock data if API call fails
          console.log("API call failed, using mock data for development");
          setUserTests(MOCK_SINGLE_TESTS);
          setUserPackages(MOCK_TEST_PACKAGES);
        }
      } catch (err) {
        console.error("Error fetching staff tests:", err);
        setError(err.response?.data?.message || err.message || "Network error");

        // Use mock data if API call fails
        console.log("API call failed, using mock data for development");
        setUserTests(MOCK_SINGLE_TESTS);
        setUserPackages(MOCK_TEST_PACKAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffTests();
  }, [useMockData]); // Re-fetch when useMockData changes

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
    setCurrentUserTest(userTest);
    setOpenResultDialog(true);
  };

  // Đóng dialog cập nhật kết quả xét nghiệm đơn lẻ
  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
    setCurrentUserTest(null);
  };

  // Xử lý mở dialog cập nhật kết quả gói xét nghiệm
  const handleOpenPackageDialog = (packageTest) => {
    setCurrentPackage(packageTest);
    setOpenPackageDialog(true);
  };

  // Đóng dialog cập nhật kết quả gói xét nghiệm
  const handleClosePackageDialog = () => {
    setOpenPackageDialog(false);
    setCurrentPackage(null);
    setCurrentTestInPackage(null);
  };

  // Xử lý mở dialog cập nhật kết quả cho một xét nghiệm cụ thể trong gói
  const handleOpenTestInPackageDialog = (packageItem, testItem) => {
    setCurrentPackage(packageItem);
    setCurrentTestInPackage(testItem);
    setOpenPackageDialog(true);
  };
  // Status is updated via the detailed dialogs instead

  // Xử lý lưu kết quả xét nghiệm đơn lẻ
  const handleSaveResult = async () => {
    if (!currentUserTest) return;

    setResultUpdating(true);
    try {
      const response = await apiClient.put(
        `/sti-services/staff/tests/${currentUserTest.testId}/result`,
        {
          result: currentUserTest.result || "negative",
          resultLabel: currentUserTest.resultLabel || "Âm tính",
          resultDetails: currentUserTest.resultDetails || "",
          status: "RESULTED",
        }
      );

      if (response.data && response.data.success) {
        // Upload files if any
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("files", file);
          });

          await apiClient.post(
            `/sti-services/staff/tests/${currentUserTest.testId}/attachments`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        // Update local state
        setUserTests((prevTests) =>
          prevTests.map((test) =>
            test.testId === currentUserTest.testId
              ? {
                  ...test,
                  status: "RESULTED",
                  result: currentUserTest.result || "negative",
                  resultLabel: currentUserTest.resultLabel || "Âm tính",
                  resultDetails: currentUserTest.resultDetails || "",
                  resultDate: new Date().toISOString(),
                }
              : test
          )
        );

        handleCloseResultDialog();
      } else {
        alert(response.data.message || "Failed to save result");
      }
    } catch (err) {
      console.error("Error saving test result:", err);
      alert(err.response?.data?.message || err.message || "Network error");
    } finally {
      setResultUpdating(false);
      setSelectedFiles([]);
    }
  };

  // Xử lý lưu kết quả một xét nghiệm trong gói xét nghiệm
  const handleSaveTestInPackage = async () => {
    if (!currentPackage || !currentTestInPackage) return;

    setPackageResultUpdating(true);
    try {
      const response = await apiClient.put(
        `/sti-services/staff/packages/${currentPackage.testId}/tests/${currentTestInPackage.testItemId}/result`,
        {
          result: currentTestInPackage.result || "negative",
          resultLabel: currentTestInPackage.resultLabel || "Âm tính",
          resultDetails: currentTestInPackage.resultDetails || "",
          status: "COMPLETED",
        }
      );

      if (response.data && response.data.success) {
        // Upload files if any
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("files", file);
          });

          await apiClient.post(
            `/sti-services/staff/packages/${currentPackage.testId}/tests/${currentTestInPackage.testItemId}/attachments`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

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
                        status: "COMPLETED",
                        result: currentTestInPackage.result || "negative",
                        resultLabel:
                          currentTestInPackage.resultLabel || "Âm tính",
                        resultDetails: currentTestInPackage.resultDetails || "",
                        resultDate: new Date().toISOString(),
                      }
                    : test
                ),
              };
            }
            return pack;
          })
        );

        handleClosePackageDialog();
      } else {
        alert(response.data.message || "Failed to save test result");
      }
    } catch (err) {
      console.error("Error saving test result in package:", err);
      alert(err.response?.data?.message || err.message || "Network error");
    } finally {
      setPackageResultUpdating(false);
      setSelectedFiles([]);
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
          consultantNotes: currentPackage.consultantNotes || "",
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
                  consultantNotes: currentPackage.consultantNotes || "",
                  status: currentPackage.status,
                }
              : pack
          )
        );

        handleClosePackageDialog();
      } else {
        alert(response.data.message || "Failed to save package information");
      }
    } catch (err) {
      console.error("Error saving package information:", err);
      alert(err.response?.data?.message || err.message || "Network error");
    } finally {
      setPackageResultUpdating(false);
    }
  };
  // Creating new tests is handled in a separate component

  // Xử lý tải lên file kết quả
  const handleFileUpload = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  // Xử lý thay đổi thông tin kết quả xét nghiệm đơn lẻ
  const handleResultChange = (field, value) => {
    if (currentUserTest) {
      setCurrentUserTest({
        ...currentUserTest,
        [field]: value,
      });
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
      if (!status) return "Unknown";

      const statusObj = TEST_STATUSES[status];
      return statusObj ? statusObj.label : status;
    },
    [TEST_STATUSES]
  );

  // Tiện ích chuyển đổi loại thanh toán từ backend DTO sang hiển thị UI
  const getPaymentDisplayText = useCallback((paymentMethod) => {
    if (!paymentMethod) return "Unknown";

    switch (paymentMethod) {
      case "COD":
        return "Thanh toán tại chỗ";
      case "VISA":
        return "Thẻ tín dụng";
      case "QR_CODE":
        return "Chuyển khoản QR";
      default:
        return paymentMethod;
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
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lấy màu cho kết quả
  const getResultColor = (result) => {
    if (!result) return "default";

    switch (result.toLowerCase()) {
      case "negative":
        return "success";
      case "positive":
        return "error";
      case "indeterminate":
        return "warning";
      default:
        return "default";
    }
  };

  // Filter kết quả xét nghiệm dựa trên searchTerm, viewMode và statusFilter
  const getFilteredTests = () => {
    let filteredTests = [];

    // Apply view mode filter
    if (viewMode === "all" || viewMode === "single") {
      filteredTests = filteredTests.concat(userTests);
    }

    if (viewMode === "all" || viewMode === "package") {
      filteredTests = filteredTests.concat(userPackages);
    }

    // Apply status filter
    if (statusFilter !== "all") {
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
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tên khách hàng, email, dịch vụ..."
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại hiển thị</InputLabel>
                <Select
                  value={viewMode}
                  onChange={(e) => handleChangeViewMode(e.target.value)}
                  label="Loại hiển thị"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="single">Xét nghiệm đơn lẻ</MenuItem>
                  <MenuItem value="package">Gói xét nghiệm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  {Object.keys(TEST_STATUSES).map((status) => (
                    <MenuItem key={status} value={status}>
                      {TEST_STATUSES[status].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredTests.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>Không có kết quả xét nghiệm nào phù hợp</Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Ngày hẹn</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thanh toán</TableCell>
                    <TableCell>Thao tác</TableCell>
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
                      >
                        <TableCell>{row.testId}</TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell>
                          {row.packageName || row.serviceName}
                        </TableCell>
                        <TableCell>{formatDate(row.appointmentDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusDisplayText(row.status)}
                            color={
                              TEST_STATUSES[row.status]?.color || "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {getPaymentDisplayText(row.paymentMethod)}
                        </TableCell>
                        <TableCell>
                          {row.packageId ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenPackageDialog(row)}
                            >
                              Quản lý gói
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenResultDialog(row)}
                            >
                              Cập nhật kết quả
                            </Button>
                          )}
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý xét nghiệm STI
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Quản lý và cập nhật kết quả xét nghiệm STI mà bạn phụ trách
        </Typography>
      </Box>

      {/* Toggle switch for real/mock data */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant={useMockData ? "contained" : "outlined"}
          color="primary"
          onClick={() => setUseMockData(true)}
          sx={{ mr: 1 }}
        >
          Dữ liệu giả lập
        </Button>
        <Button
          variant={!useMockData ? "contained" : "outlined"}
          color="primary"
          onClick={() => setUseMockData(false)}
        >
          Dữ liệu thật
        </Button>
      </Box>

      {renderTestsTable()}

      {/* Dialog cập nhật kết quả xét nghiệm đơn lẻ */}
      {currentUserTest && (
        <Dialog
          open={openResultDialog}
          onClose={handleCloseResultDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Cập nhật kết quả: {currentUserTest.serviceName}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Khách hàng"
                  value={currentUserTest.customerName || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dịch vụ xét nghiệm"
                  value={currentUserTest.serviceName || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={currentUserTest.status || "PENDING"}
                    onChange={(e) =>
                      handleResultChange("status", e.target.value)
                    }
                    label="Trạng thái"
                  >
                    {Object.keys(TEST_STATUSES).map((status) => (
                      <MenuItem key={status} value={status}>
                        {TEST_STATUSES[status].label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Kết quả</InputLabel>
                  <Select
                    value={currentUserTest.result || "negative"}
                    onChange={(e) =>
                      handleResultChange("result", e.target.value)
                    }
                    label="Kết quả"
                  >
                    <MenuItem value="negative">Âm tính</MenuItem>
                    <MenuItem value="positive">Dương tính</MenuItem>
                    <MenuItem value="indeterminate">Không xác định</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nhãn kết quả"
                  value={currentUserTest.resultLabel || ""}
                  onChange={(e) =>
                    handleResultChange("resultLabel", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  label="Tải lên tài liệu"
                  onChange={handleFileUpload}
                  inputProps={{ multiple: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chi tiết kết quả"
                  value={currentUserTest.resultDetails || ""}
                  onChange={(e) =>
                    handleResultChange("resultDetails", e.target.value)
                  }
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú tư vấn"
                  value={currentUserTest.consultantNotes || ""}
                  onChange={(e) =>
                    handleResultChange("consultantNotes", e.target.value)
                  }
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResultDialog}>Hủy</Button>
            <Button
              onClick={handleSaveResult}
              variant="contained"
              color="primary"
              disabled={resultUpdating}
            >
              {resultUpdating ? "Đang lưu..." : "Lưu kết quả"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog cập nhật kết quả gói xét nghiệm */}
      {currentPackage && (
        <Dialog
          open={openPackageDialog}
          onClose={handleClosePackageDialog}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {currentTestInPackage
              ? `Cập nhật xét nghiệm: ${currentTestInPackage.serviceName}`
              : `Quản lý gói xét nghiệm: ${currentPackage.packageName}`}
          </DialogTitle>
          <DialogContent>
            {currentTestInPackage ? (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Khách hàng"
                    value={currentPackage.customerName || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dịch vụ xét nghiệm"
                    value={currentTestInPackage.serviceName || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={currentTestInPackage.status || "PENDING"}
                      onChange={(e) =>
                        handleTestInPackageChange("status", e.target.value)
                      }
                      label="Trạng thái"
                    >
                      {Object.keys(TEST_STATUSES).map((status) => (
                        <MenuItem key={status} value={status}>
                          {TEST_STATUSES[status].label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Kết quả</InputLabel>
                    <Select
                      value={currentTestInPackage.result || "negative"}
                      onChange={(e) =>
                        handleTestInPackageChange("result", e.target.value)
                      }
                      label="Kết quả"
                    >
                      <MenuItem value="negative">Âm tính</MenuItem>
                      <MenuItem value="positive">Dương tính</MenuItem>
                      <MenuItem value="indeterminate">Không xác định</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nhãn kết quả"
                    value={currentTestInPackage.resultLabel || ""}
                    onChange={(e) =>
                      handleTestInPackageChange("resultLabel", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="file"
                    InputLabelProps={{ shrink: true }}
                    label="Tải lên tài liệu"
                    onChange={handleFileUpload}
                    inputProps={{ multiple: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Chi tiết kết quả"
                    value={currentTestInPackage.resultDetails || ""}
                    onChange={(e) =>
                      handleTestInPackageChange("resultDetails", e.target.value)
                    }
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Khách hàng"
                      value={currentPackage.customerName || ""}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gói xét nghiệm"
                      value={currentPackage.packageName || ""}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái gói</InputLabel>
                      <Select
                        value={currentPackage.status || "PENDING"}
                        onChange={(e) =>
                          handlePackageChange("status", e.target.value)
                        }
                        label="Trạng thái gói"
                      >
                        {Object.keys(TEST_STATUSES).map((status) => (
                          <MenuItem key={status} value={status}>
                            {TEST_STATUSES[status].label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ngày hẹn"
                      value={formatDate(currentPackage.appointmentDate)}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ghi chú tư vấn"
                      value={currentPackage.consultantNotes || ""}
                      onChange={(e) =>
                        handlePackageChange("consultantNotes", e.target.value)
                      }
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6">Các xét nghiệm trong gói</Typography>

                <Box sx={{ mt: 2 }}>
                  {currentPackage.tests &&
                    currentPackage.tests.map((test) => (
                      <Card key={test.testItemId} sx={{ mb: 2 }}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="subtitle1">
                                {test.serviceName}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Chip
                                label={getStatusDisplayText(test.status)}
                                color={
                                  TEST_STATUSES[test.status]?.color || "default"
                                }
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              {test.result && (
                                <Chip
                                  label={test.resultLabel || test.result}
                                  color={getResultColor(test.result)}
                                  size="small"
                                />
                              )}
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  handleOpenTestInPackageDialog(
                                    currentPackage,
                                    test
                                  )
                                }
                              >
                                Cập nhật
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePackageDialog}>Hủy</Button>
            {currentTestInPackage ? (
              <Button
                onClick={handleSaveTestInPackage}
                variant="contained"
                color="primary"
                disabled={packageResultUpdating}
              >
                {packageResultUpdating
                  ? "Đang lưu..."
                  : "Lưu kết quả xét nghiệm"}
              </Button>
            ) : (
              <Button
                onClick={handleSavePackage}
                variant="contained"
                color="primary"
                disabled={packageResultUpdating}
              >
                {packageResultUpdating ? "Đang lưu..." : "Lưu thông tin gói"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default STITestManagementContent;

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
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  CircularProgress,
  Grid,
  Divider,
  alpha,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Update as UpdateIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";

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
  // Mock data cho danh sách kết quả xét nghiệm STI của người dùng (theo STITestResponse DTO)
  const [userTests, setUserTests] = useState([
    {
      testId: 1,
      customerId: 101,
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@example.com",
      customerPhone: "0901234567",
      serviceId: 1,
      packageId: null,
      serviceName: "Xét nghiệm HIV",
      serviceDescription: "Phát hiện kháng thể HIV trong máu",
      totalPrice: 450000,
      staffId: 201,
      staffName: "Lê Thị B",
      consultantId: 301,
      consultantName: "Phạm Thị Hồng",
      appointmentDate: "2025-06-14T09:00:00",
      status: "COMPLETED",
      paymentId: 1001,
      paymentMethod: "VISA",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-13T14:30:00",
      paymentTransactionId: "TR123456",
      stripePaymentIntentId: "pi_123456789",
      qrPaymentReference: null,
      qrExpiresAt: null,
      qrCodeUrl: null,
      customerNotes: "Tôi muốn kiểm tra sức khỏe",
      consultantNotes: "Khách hàng có yếu tố nguy cơ thấp",
      resultDate: "2025-06-15T10:15:00",
      createdAt: "2025-06-10T11:20:00",
      updatedAt: "2025-06-15T10:15:00",
    },
    {
      testId: 2,
      customerId: 102,
      customerName: "Trần Thị C",
      customerEmail: "tranthic@example.com",
      customerPhone: "0912345678",
      serviceId: 2,
      packageId: null,
      serviceName: "Xét nghiệm Giang mai",
      serviceDescription: "Kiểm tra vi khuẩn Treponema pallidum",
      totalPrice: 350000,
      staffId: 201,
      staffName: "Lê Thị B",
      consultantId: null,
      consultantName: null,
      appointmentDate: "2025-06-15T10:30:00",
      status: "SAMPLED",
      paymentId: 1002,
      paymentMethod: "COD",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-15T10:30:00",
      paymentTransactionId: null,
      stripePaymentIntentId: null,
      qrPaymentReference: null,
      qrExpiresAt: null,
      qrCodeUrl: null,
      customerNotes: "Cần kết quả sớm",
      consultantNotes: null,
      resultDate: null,
      createdAt: "2025-06-12T15:40:00",
      updatedAt: "2025-06-15T10:45:00",
    },
    {
      testId: 3,
      customerId: 103,
      customerName: "Phạm Văn D",
      customerEmail: "phamvand@example.com",
      customerPhone: "0923456789",
      serviceId: 3,
      packageId: null,
      serviceName: "Xét nghiệm Chlamydia",
      serviceDescription: "Phát hiện vi khuẩn Chlamydia trachomatis",
      totalPrice: 550000,
      staffId: null,
      staffName: null,
      consultantId: null,
      consultantName: null,
      appointmentDate: "2025-06-18T14:00:00",
      status: "PENDING",
      paymentId: 1003,
      paymentMethod: "QR_CODE",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-16T09:10:00",
      paymentTransactionId: "QR789012",
      stripePaymentIntentId: null,
      qrPaymentReference: "REF789012",
      qrExpiresAt: "2025-06-16T09:30:00",
      qrCodeUrl: "https://example.com/qr/789012",
      customerNotes: "Tôi cần đặt lịch vào buổi chiều",
      consultantNotes: null,
      resultDate: null,
      createdAt: "2025-06-16T08:20:00",
      updatedAt: "2025-06-16T09:10:00",
    },
    {
      testId: 4,
      customerId: 104,
      customerName: "Lê Thị E",
      customerEmail: "lethie@example.com",
      customerPhone: "0934567890",
      serviceId: 1,
      packageId: null,
      serviceName: "Xét nghiệm HIV",
      serviceDescription: "Phát hiện kháng thể HIV trong máu",
      totalPrice: 450000,
      staffId: 201,
      staffName: "Lê Thị B",
      consultantId: 301,
      consultantName: "Phạm Thị Hồng",
      appointmentDate: "2025-06-13T11:00:00",
      status: "RESULTED",
      paymentId: 1004,
      paymentMethod: "VISA",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-13T08:45:00",
      paymentTransactionId: "TR234567",
      stripePaymentIntentId: "pi_234567890",
      qrPaymentReference: null,
      qrExpiresAt: null,
      qrCodeUrl: null,
      customerNotes: "Tôi muốn giữ bí mật kết quả",
      consultantNotes: "Đã tư vấn và đề nghị xét nghiệm lại sau 3 tháng",
      resultDate: "2025-06-14T16:30:00",
      createdAt: "2025-06-12T10:15:00",
      updatedAt: "2025-06-14T16:30:00",
    },
    {
      testId: 5,
      customerId: 105,
      customerName: "Hoàng Văn G",
      customerEmail: "hoangvang@example.com",
      customerPhone: "0945678901",
      serviceId: 2,
      packageId: null,
      serviceName: "Xét nghiệm Giang mai",
      serviceDescription: "Kiểm tra vi khuẩn Treponema pallidum",
      totalPrice: 350000,
      staffId: 202,
      staffName: "Nguyễn Văn H",
      consultantId: 302,
      consultantName: "Trần Minh Tuấn",
      appointmentDate: "2025-06-10T09:00:00",
      status: "COMPLETED",
      paymentId: 1005,
      paymentMethod: "COD",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-10T09:00:00",
      paymentTransactionId: null,
      stripePaymentIntentId: null,
      qrPaymentReference: null,
      qrExpiresAt: null,
      qrCodeUrl: null,
      customerNotes: "Tôi có các triệu chứng từ một tuần nay",
      consultantNotes: "Kết quả không rõ ràng, cần xét nghiệm lại",
      resultDate: "2025-06-12T10:45:00",
      createdAt: "2025-06-09T14:20:00",
      updatedAt: "2025-06-12T10:45:00",
    },
  ]);
  // Mock data cho danh sách các gói xét nghiệm của người dùng - sử dụng cấu trúc tương tự STITestResponse
  const [userPackages, setUserPackages] = useState([
    {
      testId: 101,
      customerId: 106,
      customerName: "Trần Minh Quân",
      customerEmail: "tranminhquan@example.com",
      customerPhone: "0956789012",
      serviceId: null,
      packageId: 1,
      serviceName: null,
      packageName: "Gói xét nghiệm STI cơ bản",
      serviceDescription: "Bao gồm xét nghiệm HIV, Giang mai, và Chlamydia",
      totalPrice: 850000,
      staffId: 201,
      staffName: "Lê Thị B",
      consultantId: null,
      consultantName: null,
      appointmentDate: "2025-06-13T13:30:00",
      status: "SAMPLED",
      paymentId: 1006,
      paymentMethod: "VISA",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-13T10:15:00",
      paymentTransactionId: "TR345678",
      stripePaymentIntentId: "pi_345678901",
      qrPaymentReference: null,
      qrExpiresAt: null,
      qrCodeUrl: null,
      customerNotes: "Tôi cần làm nhiều xét nghiệm để kiểm tra sức khỏe",
      consultantNotes: "Đã lấy mẫu cho tất cả các xét nghiệm",
      resultDate: null,
      createdAt: "2025-06-12T08:40:00",
      updatedAt: "2025-06-13T13:45:00",
      // Thêm thông tin về các xét nghiệm con cho UI
      tests: [
        {
          testItemId: 1001,
          serviceId: 1,
          serviceName: "Xét nghiệm HIV",
          status: "COMPLETED",
          result: "negative",
          resultLabel: "Âm tính",
          resultDetails: "Không phát hiện kháng thể HIV",
          staffId: 201,
          staffName: "Lê Thị B",
          resultDate: "2025-06-14T09:30:00",
          attachmentUrls: ["package_106_hiv.pdf"],
        },
        {
          testItemId: 1002,
          serviceId: 2,
          serviceName: "Xét nghiệm Giang mai",
          status: "COMPLETED",
          result: "negative",
          resultLabel: "Âm tính",
          resultDetails: "Không phát hiện vi khuẩn giang mai",
          staffId: 201,
          staffName: "Lê Thị B",
          resultDate: "2025-06-14T10:15:00",
          attachmentUrls: ["package_106_syphilis.pdf"],
        },
        {
          testItemId: 1003,
          serviceId: 3,
          serviceName: "Xét nghiệm Chlamydia",
          status: "SAMPLED",
          result: null,
          resultLabel: null,
          resultDetails: null,
          staffId: 201,
          staffName: "Lê Thị B",
          resultDate: null,
          attachmentUrls: [],
        },
      ],
    },
    {
      testId: 102,
      customerId: 107,
      customerName: "Lê Thị Mai",
      customerEmail: "lethimai@example.com",
      customerPhone: "0967890123",
      serviceId: null,
      packageId: 2,
      serviceName: null,
      packageName: "Gói xét nghiệm STI toàn diện",
      serviceDescription:
        "Bao gồm xét nghiệm HIV, Giang mai, Chlamydia, HPV và Viêm gan B",
      totalPrice: 1500000,
      staffId: 202,
      staffName: "Nguyễn Văn H",
      consultantId: 302,
      consultantName: "Trần Minh Tuấn",
      appointmentDate: "2025-06-10T09:30:00",
      status: "COMPLETED",
      paymentId: 1007,
      paymentMethod: "COD",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-10T09:30:00",
      paymentTransactionId: null,
      stripePaymentIntentId: null,
      qrPaymentReference: null,
      qrExpiresAt: null,
      qrCodeUrl: null,
      customerNotes: "Tôi muốn kiểm tra toàn diện",
      consultantNotes:
        "Khách hàng có nhiều bạn tình, đã hoàn thành mọi xét nghiệm",
      resultDate: "2025-06-15T14:00:00",
      createdAt: "2025-06-08T16:20:00",
      updatedAt: "2025-06-15T14:00:00",
      // Thêm thông tin về các xét nghiệm con cho UI
      tests: [
        {
          testItemId: 2001,
          serviceId: 1,
          serviceName: "Xét nghiệm HIV",
          status: "COMPLETED",
          result: "negative",
          resultLabel: "Âm tính",
          resultDetails: "Không phát hiện kháng thể HIV",
          staffId: 202,
          staffName: "Nguyễn Văn H",
          resultDate: "2025-06-12T11:30:00",
          attachmentUrls: ["package_107_hiv.pdf"],
        },
        {
          testItemId: 2002,
          serviceId: 2,
          serviceName: "Xét nghiệm Giang mai",
          status: "COMPLETED",
          result: "positive",
          resultLabel: "Dương tính",
          resultDetails: "Phát hiện vi khuẩn giang mai",
          staffId: 202,
          staffName: "Nguyễn Văn H",
          resultDate: "2025-06-13T10:45:00",
          attachmentUrls: ["package_107_syphilis.pdf"],
        },
        {
          testItemId: 2003,
          serviceId: 3,
          serviceName: "Xét nghiệm Chlamydia",
          status: "COMPLETED",
          result: "negative",
          resultLabel: "Âm tính",
          resultDetails: "Không phát hiện vi khuẩn Chlamydia",
          staffId: 202,
          staffName: "Nguyễn Văn H",
          resultDate: "2025-06-13T14:20:00",
          attachmentUrls: ["package_107_chlamydia.pdf"],
        },
        {
          testItemId: 2004,
          serviceId: 4,
          serviceName: "Xét nghiệm HPV",
          status: "COMPLETED",
          result: "negative",
          resultLabel: "Âm tính",
          resultDetails: "Không phát hiện virus HPV",
          staffId: 202,
          staffName: "Nguyễn Văn H",
          resultDate: "2025-06-14T09:15:00",
          attachmentUrls: ["package_107_hpv.pdf"],
        },
        {
          testItemId: 2005,
          serviceId: 5,
          serviceName: "Xét nghiệm Viêm gan B",
          status: "COMPLETED",
          result: "negative",
          resultLabel: "Âm tính",
          resultDetails: "Không phát hiện virus viêm gan B",
          staffId: 202,
          staffName: "Nguyễn Văn H",
          resultDate: "2025-06-14T11:30:00",
          attachmentUrls: ["package_107_hbv.pdf"],
        },
      ],
    },
    {
      testId: 103,
      customerId: 108,
      customerName: "Bùi Văn Tùng",
      customerEmail: "buivantung@example.com",
      customerPhone: "0978901234",
      serviceId: null,
      packageId: 1,
      serviceName: null,
      packageName: "Gói xét nghiệm STI cơ bản",
      serviceDescription: "Bao gồm xét nghiệm HIV, Giang mai, và Chlamydia",
      totalPrice: 850000,
      staffId: null,
      staffName: null,
      consultantId: null,
      consultantName: null,
      appointmentDate: "2025-06-19T15:00:00",
      status: "PENDING",
      paymentId: 1008,
      paymentMethod: "QR_CODE",
      paymentStatus: "COMPLETED",
      paidAt: "2025-06-16T11:35:00",
      paymentTransactionId: "QR890123",
      stripePaymentIntentId: null,
      qrPaymentReference: "REF890123",
      qrExpiresAt: "2025-06-16T12:00:00",
      qrCodeUrl: "https://example.com/qr/890123",
      customerNotes: "Tôi muốn được xét nghiệm kín đáo",
      consultantNotes: null,
      resultDate: null,
      createdAt: "2025-06-16T10:30:00",
      updatedAt: "2025-06-16T11:35:00",
      // Thêm thông tin về các xét nghiệm con cho UI
      tests: [
        {
          testItemId: 3001,
          serviceId: 1,
          serviceName: "Xét nghiệm HIV",
          status: "PENDING",
          result: null,
          resultLabel: null,
          resultDetails: null,
          staffId: null,
          staffName: null,
          resultDate: null,
          attachmentUrls: [],
        },
        {
          testItemId: 3002,
          serviceId: 2,
          serviceName: "Xét nghiệm Giang mai",
          status: "PENDING",
          result: null,
          resultLabel: null,
          resultDetails: null,
          staffId: null,
          staffName: null,
          resultDate: null,
          attachmentUrls: [],
        },
        {
          testItemId: 3003,
          serviceId: 3,
          serviceName: "Xét nghiệm Chlamydia",
          status: "PENDING",
          result: null,
          resultLabel: null,
          resultDetails: null,
          staffId: null,
          staffName: null,
          resultDate: null,
          attachmentUrls: [],
        },
      ],
    },
  ]);

  // Kết hợp cả xét nghiệm đơn lẻ và gói xét nghiệm thành một danh sách  // Unified display and filtering is handled directly in getFilteredTests()

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
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    setSelectedFiles([]);
    setResultUpdating(false);
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
    setSelectedFiles([]);
    setPackageResultUpdating(false);
  };

  // Xử lý mở dialog cập nhật kết quả cho một xét nghiệm cụ thể trong gói
  const handleOpenTestInPackageDialog = (packageItem, testItem) => {
    setCurrentPackage(packageItem);
    setCurrentTestInPackage(testItem);
    setOpenPackageDialog(true);
  };
  // Xử lý cập nhật trạng thái xét nghiệm đơn lẻ
  const handleUpdateStatus = (testId, newStatus) => {
    // Chuẩn bị dữ liệu cập nhật trạng thái
    const currentStaffId = 201; // Giả định ID nhân viên hiện tại
    const currentStaffName = "Lê Thị B"; // Giả định tên nhân viên hiện tại

    // Tạo DTO cho request cập nhật trạng thái
    const statusUpdateDTO = {
      testId: testId,
      status: newStatus,
      staffId: currentStaffId,
      staffNotes: `Cập nhật trạng thái thành ${
        TEST_STATUSES[newStatus]?.label || newStatus
      }`,
    };

    // Log DTO cho việc debug
    console.log("STI Test Status Update DTO:", statusUpdateDTO);

    // Cập nhật trạng thái trong state
    const updatedTests = userTests.map((test) => {
      if (test.testId === testId) {
        const updatedTest = {
          ...test,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        // Cập nhật thông tin staffId nếu chưa có
        if (!test.staffId) {
          updatedTest.staffId = currentStaffId;
          updatedTest.staffName = currentStaffName;
        }

        return updatedTest;
      }
      return test;
    });

    setUserTests(updatedTests);

    // Trong thực tế, sẽ gọi API để cập nhật trạng thái
    console.log(
      `Đã cập nhật trạng thái xét nghiệm ${testId} thành ${newStatus}`
    );
  };

  // Xử lý cập nhật trạng thái gói xét nghiệm
  const handleUpdatePackageStatus = (testId, newStatus) => {
    // Chuẩn bị dữ liệu cập nhật trạng thái
    const currentStaffId = 201; // Giả định ID nhân viên hiện tại
    const currentStaffName = "Lê Thị B"; // Giả định tên nhân viên hiện tại

    // Tạo DTO cho request cập nhật trạng thái
    const packageStatusUpdateDTO = {
      testId: testId,
      status: newStatus,
      staffId: currentStaffId,
      staffNotes: `Cập nhật trạng thái gói thành ${
        TEST_STATUSES[newStatus]?.label || newStatus
      }`,
    };

    // Log DTO cho việc debug
    console.log("STI Package Test Status Update DTO:", packageStatusUpdateDTO);

    // Cập nhật trạng thái gói trong state
    const updatedPackages = userPackages.map((pkg) => {
      if (pkg.testId === testId) {
        // Cập nhật trạng thái của gói
        const updatedPkg = {
          ...pkg,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        // Cập nhật thông tin staffId nếu chưa có
        if (!pkg.staffId) {
          updatedPkg.staffId = currentStaffId;
          updatedPkg.staffName = currentStaffName;
        }

        // Cập nhật trạng thái các xét nghiệm trong gói theo trạng thái gói
        if (newStatus === "CONFIRMED" || newStatus === "SAMPLED") {
          updatedPkg.tests = pkg.tests.map((test) => ({
            ...test,
            status: newStatus,
            staffId: currentStaffId,
            staffName: currentStaffName,
          }));
        }

        return updatedPkg;
      }
      return pkg;
    });

    setUserPackages(updatedPackages);

    // Trong thực tế, sẽ gọi API để cập nhật trạng thái
    console.log(
      `Đã cập nhật trạng thái gói xét nghiệm ${testId} thành ${newStatus}`
    );
  };
  // Xử lý lưu kết quả xét nghiệm đơn lẻ
  const handleSaveResult = () => {
    if (!currentUserTest) return;

    setResultUpdating(true);

    // Chuẩn bị DTO cho cập nhật kết quả
    const resultUpdateDTO = {
      testId: currentUserTest.testId,
      result: currentUserTest.result,
      resultDetails: currentUserTest.resultDetails,
      consultantNotes: currentUserTest.consultantNotes,
      staffId: 201, // Giả định ID nhân viên hiện tại
      attachmentIds: selectedFiles.map((f) => f.name), // Giả định ID files đính kèm
    };

    console.log("STI Test Result Update DTO:", resultUpdateDTO);

    // Giả lập gọi API để lưu kết quả
    setTimeout(() => {
      const updatedTests = userTests.map((test) => {
        if (test.testId === currentUserTest.testId) {
          return {
            ...test,
            ...currentUserTest,
            resultDate: new Date().toISOString(),
            status: "RESULTED", // Chuyển sang trạng thái đã có kết quả
            updatedAt: new Date().toISOString(),
          };
        }
        return test;
      });

      setUserTests(updatedTests);
      setResultUpdating(false);
      handleCloseResultDialog();

      // Feedback thành công
      alert("Đã cập nhật kết quả xét nghiệm thành công!");
    }, 1000);
  };
  // Xử lý lưu kết quả một xét nghiệm trong gói xét nghiệm
  const handleSaveTestInPackage = () => {
    if (!currentPackage || !currentTestInPackage) return;

    setPackageResultUpdating(true);

    // Chuẩn bị DTO cho cập nhật kết quả xét nghiệm trong gói
    const packageTestResultDTO = {
      testId: currentPackage.testId,
      testItemId: currentTestInPackage.testItemId,
      serviceId: currentTestInPackage.serviceId,
      result: currentTestInPackage.result,
      resultDetails: currentTestInPackage.resultDetails,
      staffId: 201, // Giả định ID nhân viên hiện tại
      attachmentIds: selectedFiles.map((f) => f.name), // Giả định ID files đính kèm
    };

    console.log(
      "STI Package Test Item Result Update DTO:",
      packageTestResultDTO
    );

    // Giả lập gọi API để lưu kết quả
    setTimeout(() => {
      const updatedPackages = userPackages.map((pkg) => {
        if (pkg.testId === currentPackage.testId) {
          // Cập nhật xét nghiệm cụ thể trong gói
          const updatedTests = pkg.tests.map((test) => {
            if (test.testItemId === currentTestInPackage.testItemId) {
              return {
                ...test,
                ...currentTestInPackage,
                resultDate: new Date().toISOString(),
                status: "COMPLETED",
              };
            }
            return test;
          });

          // Kiểm tra xem tất cả các xét nghiệm trong gói đã hoàn thành chưa
          const allCompleted = updatedTests.every(
            (test) => test.status === "COMPLETED"
          );

          // Xác định trạng thái mới của gói
          let newStatus = pkg.status;
          if (allCompleted) {
            newStatus = "COMPLETED";
          } else if (updatedTests.some((test) => test.status === "COMPLETED")) {
            newStatus = "RESULTED"; // Một số xét nghiệm đã có kết quả
          }

          return {
            ...pkg,
            tests: updatedTests,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return pkg;
      });

      setUserPackages(updatedPackages);
      setPackageResultUpdating(false);
      handleClosePackageDialog();

      // Feedback thành công
      alert("Đã cập nhật kết quả xét nghiệm trong gói thành công!");
    }, 1000);
  };
  // Xử lý lưu kết quả và ghi chú cho cả gói xét nghiệm
  const handleSavePackage = () => {
    if (!currentPackage) return;

    setPackageResultUpdating(true);

    // Giả lập gọi API để lưu kết quả
    setTimeout(() => {
      const updatedPackages = userPackages.map((pkg) => {
        if (pkg.id === currentPackage.id) {
          return {
            ...pkg,
            ...currentPackage,
            // Các trường khác cần cập nhật
          };
        }
        return pkg;
      });

      setUserPackages(updatedPackages);
      setPackageResultUpdating(false);
      handleClosePackageDialog();

      // Feedback thành công
      alert("Đã cập nhật thông tin gói xét nghiệm thành công!");
    }, 1000);
  };

  // Xử lý tạo xét nghiệm STI mới theo DTO structure
  const createNewSTITest = (testData) => {
    // Validate dữ liệu theo STITestRequest
    // Chỉ được phép có serviceId HOẶC packageId, không được có cả hai hoặc không có gì
    if (
      !(
        (testData.serviceId != null && testData.packageId == null) ||
        (testData.serviceId == null && testData.packageId != null)
      )
    ) {
      console.error(
        "STI Test booking error: Must provide either serviceId OR packageId"
      );
      return false;
    }

    // Kiểm tra phương thức thanh toán hợp lệ
    if (!["COD", "VISA", "QR_CODE"].includes(testData.paymentMethod)) {
      console.error("STI Test booking error: Invalid payment method");
      return false;
    }

    // Validate các thông tin thẻ nếu thanh toán qua VISA
    if (testData.paymentMethod === "VISA") {
      if (
        !/^\d{16}$/.test(testData.cardNumber) ||
        !/^(0[1-9]|1[0-2])$/.test(testData.expiryMonth) ||
        !/^\d{4}$/.test(testData.expiryYear) ||
        !/^\d{3,4}$/.test(testData.cvc) ||
        !testData.cardHolderName
      ) {
        console.error(
          "STI Test booking error: Invalid credit card information"
        );
        return false;
      }
    }

    // Tạo đối tượng STITestRequest DTO để gửi lên server
    const stiTestRequestDTO = {
      serviceId: testData.serviceId,
      packageId: testData.packageId,
      appointmentDate: testData.appointmentDate,
      paymentMethod: testData.paymentMethod,
      customerNotes: testData.customerNotes,
    };

    // Thêm thông tin thẻ nếu thanh toán VISA
    if (testData.paymentMethod === "VISA") {
      stiTestRequestDTO.cardNumber = testData.cardNumber;
      stiTestRequestDTO.expiryMonth = testData.expiryMonth;
      stiTestRequestDTO.expiryYear = testData.expiryYear;
      stiTestRequestDTO.cvc = testData.cvc;
      stiTestRequestDTO.cardHolderName = testData.cardHolderName;
    }

    // Thêm mã tham chiếu QR nếu thanh toán QR_CODE
    if (testData.paymentMethod === "QR_CODE" && testData.qrPaymentReference) {
      stiTestRequestDTO.qrPaymentReference = testData.qrPaymentReference;
    }

    // Log đối tượng DTO - trong thực tế sẽ gửi API call
    console.log("STI Test Request DTO:", stiTestRequestDTO);

    return true;
  };
  // Xử lý tải lên file kết quả
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    // Chuẩn bị FormData để upload trong thực tế
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Thông tin server
    console.log("Files selected:", files);
    console.log("File upload will send these files to server when implemented");
  };
  // Xử lý thay đổi thông tin kết quả xét nghiệm đơn lẻ
  const handleResultChange = (field, value) => {
    if (!currentUserTest) return;

    let resultLabel = currentUserTest.resultLabel;

    // Tự động cập nhật resultLabel khi thay đổi result
    if (field === "result") {
      switch (value) {
        case "negative":
          resultLabel = "Âm tính";
          break;
        case "positive":
          resultLabel = "Dương tính";
          break;
        case "inconclusive":
          resultLabel = "Không xác định";
          break;
        default:
          resultLabel = null;
      }
    }

    setCurrentUserTest({
      ...currentUserTest,
      [field]: value,
      ...(field === "result" && { resultLabel }),
    });
  };

  // Xử lý thay đổi thông tin của một xét nghiệm trong gói
  const handleTestInPackageChange = (field, value) => {
    if (!currentTestInPackage) return;

    let resultLabel = currentTestInPackage.resultLabel;

    // Tự động cập nhật resultLabel khi thay đổi result
    if (field === "result") {
      switch (value) {
        case "negative":
          resultLabel = "Âm tính";
          break;
        case "positive":
          resultLabel = "Dương tính";
          break;
        case "inconclusive":
          resultLabel = "Không xác định";
          break;
        default:
          resultLabel = null;
      }
    }

    setCurrentTestInPackage({
      ...currentTestInPackage,
      [field]: value,
      ...(field === "result" && { resultLabel }),
    });
  }; // Tiện ích chuyển đổi trạng thái hiển thị từ backend DTO sang hiển thị UI (with useCallback)
  const getStatusDisplayText = useCallback(
    (status) => {
      if (!status) return "Không xác định";
      return TEST_STATUSES[status]?.label || status;
    },
    [TEST_STATUSES]
  );
  // Tiện ích chuyển đổi loại thanh toán từ backend DTO sang hiển thị UI (with useCallback)
  const getPaymentDisplayText = useCallback((paymentMethod) => {
    if (!paymentMethod) return "Không xác định";

    switch (paymentMethod) {
      case "COD":
        return "Thanh toán khi nhận hàng";
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
    if (!currentPackage) return;

    setCurrentPackage({
      ...currentPackage,
      [field]: value,
    });
  }; // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Lấy màu cho kết quả
  const getResultColor = (result) => {
    switch (result) {
      case "negative":
        return "success";
      case "positive":
        return "error";
      case "inconclusive":
        return "warning";
      default:
        return "default";
    }
  };
  // Filter kết quả xét nghiệm dựa trên searchTerm, viewMode và statusFilter
  const getFilteredTests = () => {
    // Lọc xét nghiệm đơn lẻ
    const filteredSingleTests = userTests.filter(
      (test) =>
        (viewMode === "all" || viewMode === "single") &&
        (statusFilter === "all" || test.status === statusFilter) &&
        (test.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (test.serviceName &&
            test.serviceName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (test.resultDetails &&
            test.resultDetails
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (test.consultantNotes &&
            test.consultantNotes
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (test.customerNotes &&
            test.customerNotes
              .toLowerCase()
              .includes(searchTerm.toLowerCase())))
    );

    // Lọc gói xét nghiệm
    const filteredPackageTests = userPackages.filter(
      (pkg) =>
        (viewMode === "all" || viewMode === "package") &&
        (statusFilter === "all" || pkg.status === statusFilter) &&
        (pkg.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.packageName &&
            pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pkg.consultantNotes &&
            pkg.consultantNotes
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (pkg.customerNotes &&
            pkg.customerNotes
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          pkg.tests.some(
            (test) =>
              (test.serviceName &&
                test.serviceName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              (test.resultDetails &&
                test.resultDetails
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          ))
    );

    // Map to unified format with isPackage flag
    const mappedSingleTests = filteredSingleTests.map((test) => ({
      ...test,
      isPackage: false,
    }));

    const mappedPackageTests = filteredPackageTests.map((pkg) => ({
      ...pkg,
      isPackage: true,
    }));

    // Kết hợp và sắp xếp theo ngày yêu cầu (mới nhất lên đầu)
    return [...mappedSingleTests, ...mappedPackageTests].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  // Export these utility functions for use in other components if needed  // Export utility functions for use in other components
  useEffect(() => {
    if (window.STI_UTILS === undefined) {
      window.STI_UTILS = {
        getStatusDisplayText,
        getPaymentDisplayText,
        TEST_STATUSES,
      };
    }
  }, [getStatusDisplayText, getPaymentDisplayText, TEST_STATUSES]);
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#f8fafc",
          borderLeft: "6px solid #1976d2",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mb: 1,
          }}
        >
          Quản lý kết quả xét nghiệm STI
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#4A5568",
            fontSize: "0.95rem",
          }}
        >
          Cập nhật tiến độ và kết quả xét nghiệm cho khách hàng
        </Typography>
      </Paper>
      {/* View mode selector */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          mb: 3,
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "#37474f",
              fontWeight: 600,
              mr: 1,
              minWidth: "110px",
            }}
          >
            Chế độ xem:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              flex: 1,
            }}
          >
            <Button
              variant={viewMode === "all" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleChangeViewMode("all")}
              sx={{
                borderRadius: 2,
                boxShadow: viewMode === "all" ? 2 : 0,
                px: 2,
                backgroundColor:
                  viewMode === "all" ? "primary.main" : "transparent",
                borderColor: viewMode === "all" ? "primary.main" : "divider",
                "&:hover": {
                  backgroundColor:
                    viewMode === "all"
                      ? "primary.dark"
                      : "rgba(25, 118, 210, 0.04)",
                },
              }}
              startIcon={<InfoIcon fontSize="small" />}
            >
              Tất cả
            </Button>
            <Button
              variant={viewMode === "single" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleChangeViewMode("single")}
              sx={{
                borderRadius: 2,
                boxShadow: viewMode === "single" ? 2 : 0,
                px: 2,
                backgroundColor:
                  viewMode === "single" ? "primary.main" : "transparent",
                borderColor: viewMode === "single" ? "primary.main" : "divider",
                "&:hover": {
                  backgroundColor:
                    viewMode === "single"
                      ? "primary.dark"
                      : "rgba(25, 118, 210, 0.04)",
                },
              }}
              startIcon={<DescriptionIcon fontSize="small" />}
            >
              Xét nghiệm đơn lẻ
            </Button>
            <Button
              variant={viewMode === "package" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleChangeViewMode("package")}
              sx={{
                borderRadius: 2,
                boxShadow: viewMode === "package" ? 2 : 0,
                px: 2,
                backgroundColor:
                  viewMode === "package" ? "primary.main" : "transparent",
                borderColor:
                  viewMode === "package" ? "primary.main" : "divider",
                "&:hover": {
                  backgroundColor:
                    viewMode === "package"
                      ? "primary.dark"
                      : "rgba(25, 118, 210, 0.04)",
                },
              }}
              startIcon={<DescriptionIcon fontSize="small" />}
            >
              Gói xét nghiệm
            </Button>
          </Box>
        </Box>
      </Paper>{" "}
      {/* Search and Filter Toolbar */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexGrow: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              placeholder="Tìm kiếm theo tên, email, SĐT người dùng..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: { xs: "100%", md: "45%", minWidth: "280px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease-in-out",
                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Status filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease-in-out",
                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
              }}
            >
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                {Object.values(TEST_STATUSES).map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        size="small"
                        label=""
                        sx={{
                          width: 12,
                          height: 12,
                          mr: 1.5,
                          bgcolor: `${status.color}.main`,
                          border: "none",
                        }}
                      />
                      {status.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              // Demo của createNewSTITest function với dữ liệu mẫu
              const testData = {
                serviceId: 1,
                packageId: null, // Không được có cả serviceId và packageId
                appointmentDate: new Date(
                  Date.now() + 86400000 * 2
                ).toISOString(), // 2 ngày nữa
                paymentMethod: "VISA",
                customerNotes: "Đặt lịch xét nghiệm qua staff portal",
                cardNumber: "1234567890123456",
                expiryMonth: "12",
                expiryYear: "2026",
                cvc: "123",
                cardHolderName: "NGUYEN VAN A",
              };
              createNewSTITest(testData);
              alert("Đã tạo lịch xét nghiệm mẫu - kiểm tra console để xem DTO");
            }}
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.25)",
              px: 3,
              py: 1,
              fontWeight: "medium",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(25, 118, 210, 0.35)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Đặt lịch xét nghiệm mới
          </Button>
        </Box>
      </Paper>{" "}
      {/* Tests Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          mb: 4,
          overflowX: "auto",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
              }}
            >
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Người dùng
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  width: "18%",
                  borderBottom: "none",
                }}
              >
                Loại xét nghiệm
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Ngày yêu cầu
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Dự kiến hoàn thành
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Kết quả
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Nhân viên xử lý
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredTests()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((test, index) => (
                <TableRow
                  key={`${test.isPackage ? "p" : "t"}-${test.testId}`}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f9ff",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(33, 150, 243, 0.08)",
                    },
                    "& td": {
                      borderColor: "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>{test.testId}</TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          mr: 1.5,
                          bgcolor: test.isPackage
                            ? "secondary.main"
                            : "primary.main",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {test.customerName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          {test.customerPhone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>{" "}
                  <TableCell sx={{ py: 1.5 }}>
                    <Box>
                      {test.isPackage ? (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              color: "primary.main",
                            }}
                          >
                            {test.packageName}
                          </Typography>
                          <Chip
                            label={`Gói xét nghiệm • ${
                              test.tests?.length || 0
                            } xét nghiệm`}
                            size="small"
                            sx={{
                              mt: 0.75,
                              backgroundColor: "rgba(33, 150, 243, 0.12)",
                              color: "primary.main",
                              fontSize: "0.7rem",
                              fontWeight: "medium",
                              height: 22,
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                            }}
                          >
                            {test.serviceName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mt: 0.5,
                            }}
                          >
                            {test.serviceDescription}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2">
                      {formatDate(test.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "medium",
                      }}
                    >
                      {formatDate(test.appointmentDate)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={TEST_STATUSES[test.status]?.label || test.status}
                      color={TEST_STATUSES[test.status]?.color || "default"}
                      size="small"
                      sx={{
                        fontWeight: "medium",
                        px: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    {test.isPackage ? (
                      test.tests?.some((t) => t.result === "positive") ? (
                        <Chip
                          label="Dương tính"
                          color="error"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: "medium",
                            border: "1px solid",
                            borderColor: "error.main",
                          }}
                        />
                      ) : test.tests?.every(
                          (t) =>
                            t.result === "negative" && t.status === "COMPLETED"
                        ) ? (
                        <Chip
                          label="Âm tính"
                          color="success"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: "medium",
                            border: "1px solid",
                            borderColor: "success.main",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            fontStyle: "italic",
                          }}
                        >
                          {test.tests?.some((t) => t.status === "COMPLETED")
                            ? "Đang xử lý"
                            : "Chưa có kết quả"}
                        </Typography>
                      )
                    ) : test.status === "RESULTED" ||
                      test.status === "COMPLETED" ? (
                      <Chip
                        label={test.resultLabel || "Chưa có kết quả"}
                        color={getResultColor(test.result)}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: "medium",
                          border: "1px solid",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          fontStyle: "italic",
                        }}
                      >
                        Chưa có kết quả
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    {test.staffName ? (
                      <Typography variant="body2">{test.staffName}</Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          fontStyle: "italic",
                        }}
                      >
                        Chưa phân công
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {/* Xét nghiệm đơn lẻ */}
                      {!test.isPackage && test.status === "PENDING" && (
                        <Tooltip title="Xác nhận xét nghiệm">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handleUpdateStatus(test.testId, "CONFIRMED")
                            }
                          >
                            <UpdateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {!test.isPackage && test.status === "CONFIRMED" && (
                        <Tooltip title="Lấy mẫu xét nghiệm">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handleUpdateStatus(test.testId, "SAMPLED")
                            }
                          >
                            <UpdateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {!test.isPackage && test.status === "SAMPLED" && (
                        <Tooltip title="Cập nhật kết quả">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenResultDialog(test)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {!test.isPackage &&
                        (test.status === "RESULTED" ||
                          test.status === "COMPLETED") && (
                          <Tooltip title="Xem chi tiết kết quả">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenResultDialog(test)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                      {/* Gói xét nghiệm */}
                      {test.isPackage && test.status === "PENDING" && (
                        <Tooltip title="Xác nhận gói xét nghiệm">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handleUpdatePackageStatus(
                                test.testId,
                                "CONFIRMED"
                              )
                            }
                          >
                            <UpdateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {test.isPackage && test.status === "CONFIRMED" && (
                        <Tooltip title="Lấy mẫu gói xét nghiệm">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handleUpdatePackageStatus(test.testId, "SAMPLED")
                            }
                          >
                            <UpdateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {test.isPackage && test.status === "SAMPLED" && (
                        <Tooltip title="Cập nhật kết quả gói">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenPackageDialog(test)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {test.isPackage &&
                        (test.status === "RESULTED" ||
                          test.status === "COMPLETED") && (
                          <Tooltip title="Xem chi tiết gói xét nghiệm">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenPackageDialog(test)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>{" "}
          {/* Empty state */}
          {getFilteredTests().length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      mb: 2,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 28, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Không tìm thấy kết quả xét nghiệm
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ maxWidth: 400 }}
                  >
                    Không tìm thấy xét nghiệm nào phù hợp với tiêu chí tìm kiếm.
                    Vui lòng thử lại với các bộ lọc khác.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={getFilteredTests().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
          sx={{
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
                color: "text.secondary",
              },
            "& .MuiTablePagination-select": {
              fontSize: "0.875rem",
            },
          }}
        />
      </TableContainer>
      {/* Dialog cập nhật kết quả xét nghiệm đơn lẻ */}{" "}
      <Dialog
        open={openResultDialog}
        onClose={handleCloseResultDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
          }}
        >
          {currentUserTest?.status === "RESULTED" ||
          currentUserTest?.status === "COMPLETED"
            ? `Chi tiết kết quả - ${currentUserTest?.serviceName}`
            : `Cập nhật kết quả - ${currentUserTest?.serviceName}`}
        </DialogTitle>{" "}
        <DialogContent sx={{ px: 3, py: 3 }}>
          {currentUserTest && (
            <Grid container spacing={3}>
              {/* Thông tin người dùng */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    backgroundColor: "#f8fafc",
                    borderRadius: 2,
                    borderLeft: "4px solid #1976d2",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight="600"
                    gutterBottom
                  >
                    Thông tin người dùng
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {currentUserTest.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {currentUserTest.userId}
                  </Typography>
                </Paper>
              </Grid>
              {/* Thông tin xét nghiệm */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Xét nghiệm
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentUserTest.testName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Phương pháp: {currentUserTest.testMethod}
                  </Typography>
                </Box>
              </Grid>{" "}
              {/* Ngày yêu cầu và dự kiến hoàn thành */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày yêu cầu
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(currentUserTest.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày hẹn xét nghiệm
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(currentUserTest.appointmentDate)}
                  </Typography>
                </Box>
              </Grid>
              {/* Thông tin thanh toán */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Phương thức thanh toán
                  </Typography>{" "}
                  <Typography variant="body1">
                    {getPaymentDisplayText(currentUserTest.paymentMethod)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {currentUserTest.paymentStatus === "COMPLETED"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                    {currentUserTest.paidAt &&
                      ` ngày ${formatDate(currentUserTest.paidAt)}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Mã giao dịch
                  </Typography>
                  <Typography variant="body1">
                    {currentUserTest.paymentTransactionId || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentUserTest.totalPrice)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              {/* Phần cập nhật kết quả */}
              {currentUserTest.status !== "completed" ? (
                <>
                  {/* Form cập nhật kết quả */}
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Kết quả</InputLabel>
                      <Select
                        value={currentUserTest.result || ""}
                        label="Kết quả"
                        onChange={(e) =>
                          handleResultChange("result", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>Chọn kết quả</em>
                        </MenuItem>
                        <MenuItem value="negative">Âm tính</MenuItem>
                        <MenuItem value="positive">Dương tính</MenuItem>
                        <MenuItem value="inconclusive">Không xác định</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Chi tiết kết quả"
                      margin="normal"
                      value={currentUserTest.resultDetails || ""}
                      onChange={(e) =>
                        handleResultChange("resultDetails", e.target.value)
                      }
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Ghi chú"
                      margin="normal"
                      value={currentUserTest.notes || ""}
                      onChange={(e) =>
                        handleResultChange("notes", e.target.value)
                      }
                    />

                    {/* Upload file kết quả */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tài liệu kết quả
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 1 }}
                      >
                        Tải lên tài liệu
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={handleFileUpload}
                        />
                      </Button>

                      {selectedFiles.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            {selectedFiles.length} file(s) đã chọn
                          </Typography>
                          {selectedFiles.map((file, index) => (
                            <Typography variant="body2" key={index}>
                              {file.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  {/* Hiển thị kết quả nếu đã hoàn thành */}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Kết quả
                      </Typography>
                      <Chip
                        label={currentUserTest.resultLabel}
                        color={getResultColor(currentUserTest.result)}
                        sx={{ fontWeight: 500, mb: 2 }}
                      />

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        Chi tiết kết quả:
                      </Typography>
                      <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{ p: 2, backgroundColor: "#F7FAFC" }}
                      >
                        <Typography variant="body2">
                          {currentUserTest.resultDetails || "Không có chi tiết"}
                        </Typography>
                      </Paper>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        Ghi chú:
                      </Typography>
                      <Typography variant="body2">
                        {currentUserTest.notes || "Không có ghi chú"}
                      </Typography>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        Nhân viên xử lý:
                      </Typography>
                      <Typography variant="body2">
                        {currentUserTest.staffName}
                      </Typography>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        Ngày có kết quả:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(currentUserTest.resultDate)}
                      </Typography>

                      {/* Hiển thị danh sách tệp đính kèm nếu có */}
                      {currentUserTest.attachmentUrls &&
                        currentUserTest.attachmentUrls.length > 0 && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Tài liệu đính kèm:
                            </Typography>
                            {currentUserTest.attachmentUrls.map(
                              (url, index) => (
                                <Button
                                  key={index}
                                  variant="text"
                                  startIcon={<DescriptionIcon />}
                                  onClick={() => window.open("#", "_blank")} // Trong thực tế sẽ là URL thật
                                  sx={{
                                    display: "block",
                                    textAlign: "left",
                                    mt: 0.5,
                                  }}
                                >
                                  {url}
                                </Button>
                              )
                            )}
                          </Box>
                        )}
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultDialog}>Đóng</Button>
          {currentUserTest && currentUserTest.status !== "completed" && (
            <Button
              variant="contained"
              onClick={handleSaveResult}
              disabled={resultUpdating}
              startIcon={resultUpdating ? <CircularProgress size={16} /> : null}
            >
              {resultUpdating ? "Đang lưu..." : "Lưu kết quả"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Dialog cập nhật kết quả gói xét nghiệm */}
      <Dialog
        open={openPackageDialog}
        onClose={handleClosePackageDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {currentPackage?.status === "completed"
            ? `Chi tiết gói xét nghiệm - ${currentPackage?.packageName}`
            : `Cập nhật gói xét nghiệm - ${currentPackage?.packageName}`}
        </DialogTitle>

        <DialogContent>
          {currentPackage && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Thông tin người dùng và gói xét nghiệm */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Thông tin người dùng
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentPackage.userName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {currentPackage.userId}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Gói xét nghiệm
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentPackage.packageName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Mã gói: {currentPackage.packageId} •{" "}
                    {currentPackage.tests.length} xét nghiệm
                  </Typography>
                </Box>
              </Grid>
              {/* Thông tin thời gian và chi phí */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày yêu cầu
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(currentPackage.dateRequested)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Dự kiến hoàn thành
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(currentPackage.expectedCompletionDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Chi phí
                  </Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentPackage.price)}
                    {currentPackage.discount > 0 && (
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "success.main", ml: 1 }}
                      >
                        (Giảm {currentPackage.discount}%)
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Grid>{" "}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Trạng thái gói
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    {" "}
                    <Chip
                      label={
                        TEST_STATUSES[currentPackage.status]?.label ||
                        currentPackage.status
                      }
                      color={
                        TEST_STATUSES[currentPackage.status]?.color || "default"
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {currentPackage.status === "completed" &&
                      currentPackage.overallResult && (
                        <Chip
                          label={
                            currentPackage.overallResult === "negative"
                              ? "Âm tính"
                              : currentPackage.overallResult === "positive"
                              ? "Dương tính"
                              : "Không xác định"
                          }
                          color={getResultColor(currentPackage.overallResult)}
                          variant="outlined"
                          size="small"
                        />
                      )}{" "}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Thanh toán
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}
                  >
                    {" "}
                    <Typography variant="body2">
                      {getPaymentDisplayText(currentPackage.paymentMethod)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {currentPackage.paymentStatus === "COMPLETED"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                      {currentPackage.paidAt &&
                        ` ngày ${formatDate(currentPackage.paidAt)}`}
                    </Typography>
                    {currentPackage.paymentTransactionId && (
                      <Typography variant="caption" color="textSecondary">
                        Mã GD: {currentPackage.paymentTransactionId}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
              {currentPackage.status !== "COMPLETED" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Ghi chú chung cho gói"
                    margin="normal"
                    value={currentPackage.notes || ""}
                    onChange={(e) =>
                      handlePackageChange("notes", e.target.value)
                    }
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Danh sách xét nghiệm trong gói
                </Typography>
              </Grid>
              {/* Danh sách các xét nghiệm trong gói */}
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#F7FAFC" }}>
                        <TableCell>Xét nghiệm</TableCell>
                        <TableCell>Phương pháp</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Kết quả</TableCell>
                        <TableCell>Ngày có kết quả</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentPackage.tests.map((test) => (
                        <TableRow key={test.testId} hover>
                          <TableCell>{test.testName}</TableCell>
                          <TableCell>{test.testMethod}</TableCell>
                          <TableCell>
                            {" "}
                            <Chip
                              label={
                                TEST_STATUSES[test.status]?.label || test.status
                              }
                              color={
                                TEST_STATUSES[test.status]?.color || "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {test.result ? (
                              <Chip
                                label={test.resultLabel}
                                color={getResultColor(test.result)}
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Chưa có kết quả
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(test.resultDate) || "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            {test.status === "in_progress" &&
                            currentPackage.status !== "completed" ? (
                              <Button
                                size="small"
                                onClick={() =>
                                  handleOpenTestInPackageDialog(
                                    currentPackage,
                                    test
                                  )
                                }
                                startIcon={<EditIcon fontSize="small" />}
                              >
                                Cập nhật
                              </Button>
                            ) : test.status === "completed" ? (
                              <Button
                                size="small"
                                onClick={() =>
                                  handleOpenTestInPackageDialog(
                                    currentPackage,
                                    test
                                  )
                                }
                                startIcon={<InfoIcon fontSize="small" />}
                              >
                                Chi tiết
                              </Button>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              {/* Hiển thị chi tiết và ghi chú nếu đã hoàn thành */}
              {currentPackage.status === "completed" && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Kết quả tổng thể
                    </Typography>
                    {currentPackage.overallResult && (
                      <Chip
                        label={
                          currentPackage.overallResult === "negative"
                            ? "Âm tính"
                            : currentPackage.overallResult === "positive"
                            ? "Dương tính"
                            : "Không xác định"
                        }
                        color={getResultColor(currentPackage.overallResult)}
                        sx={{ fontWeight: 500, mb: 2 }}
                      />
                    )}

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Ghi chú:
                    </Typography>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ p: 2, backgroundColor: "#F7FAFC" }}
                    >
                      <Typography variant="body2">
                        {currentPackage.notes || "Không có ghi chú"}
                      </Typography>
                    </Paper>

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Nhân viên xử lý:
                    </Typography>
                    <Typography variant="body2">
                      {currentPackage.staffName}
                    </Typography>
                  </Grid>
                </>
              )}
              {/* Thông tin xét nghiệm hiện tại đang được chỉnh sửa trong gói */}
              {currentTestInPackage && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {currentTestInPackage.status === "completed"
                        ? `Chi tiết kết quả - ${currentTestInPackage.testName}`
                        : `Cập nhật kết quả - ${currentTestInPackage.testName}`}
                    </Typography>
                  </Grid>

                  {currentTestInPackage.status !== "completed" ? (
                    <>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Kết quả</InputLabel>
                          <Select
                            value={currentTestInPackage.result || ""}
                            label="Kết quả"
                            onChange={(e) =>
                              handleTestInPackageChange(
                                "result",
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="">
                              <em>Chọn kết quả</em>
                            </MenuItem>
                            <MenuItem value="negative">Âm tính</MenuItem>
                            <MenuItem value="positive">Dương tính</MenuItem>
                            <MenuItem value="inconclusive">
                              Không xác định
                            </MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Chi tiết kết quả"
                          margin="normal"
                          value={currentTestInPackage.resultDetails || ""}
                          onChange={(e) =>
                            handleTestInPackageChange(
                              "resultDetails",
                              e.target.value
                            )
                          }
                        />

                        {/* Upload file kết quả */}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Tài liệu kết quả
                          </Typography>

                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            size="small"
                          >
                            Tải lên tài liệu
                            <input
                              type="file"
                              hidden
                              multiple
                              onChange={handleFileUpload}
                            />
                          </Button>

                          {selectedFiles.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                              >
                                {selectedFiles.length} file(s) đã chọn
                              </Typography>
                              {selectedFiles.map((file, index) => (
                                <Typography variant="body2" key={index}>
                                  {file.name}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </>
                  ) : (
                    <>
                      {/* Hiển thị chi tiết kết quả nếu đã hoàn thành */}
                      <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Kết quả
                          </Typography>
                          <Chip
                            label={currentTestInPackage.resultLabel}
                            color={getResultColor(currentTestInPackage.result)}
                            sx={{ mb: 1 }}
                            size="small"
                          />

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ mt: 2 }}
                          >
                            Chi tiết kết quả:
                          </Typography>
                          <Paper
                            elevation={0}
                            variant="outlined"
                            sx={{ p: 2, backgroundColor: "#F7FAFC" }}
                          >
                            <Typography variant="body2">
                              {currentTestInPackage.resultDetails ||
                                "Không có chi tiết"}
                            </Typography>
                          </Paper>

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ mt: 2 }}
                          >
                            Nhân viên xử lý:
                          </Typography>
                          <Typography variant="body2">
                            {currentTestInPackage.staffName}
                          </Typography>

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ mt: 2 }}
                          >
                            Ngày có kết quả:
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(currentTestInPackage.resultDate)}
                          </Typography>

                          {/* Hiển thị danh sách tệp đính kèm nếu có */}
                          {currentTestInPackage.attachmentUrls &&
                            currentTestInPackage.attachmentUrls.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Tài liệu đính kèm:
                                </Typography>
                                {currentTestInPackage.attachmentUrls.map(
                                  (url, index) => (
                                    <Button
                                      key={index}
                                      variant="text"
                                      size="small"
                                      startIcon={<DescriptionIcon />}
                                      onClick={() => window.open("#", "_blank")} // Trong thực tế sẽ là URL thật
                                      sx={{
                                        display: "block",
                                        textAlign: "left",
                                        mt: 0.5,
                                      }}
                                    >
                                      {url}
                                    </Button>
                                  )
                                )}
                              </Box>
                            )}
                        </Box>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClosePackageDialog}>Đóng</Button>

          {/* Nút lưu kết quả cho xét nghiệm trong gói */}
          {currentPackage &&
            currentTestInPackage &&
            currentTestInPackage.status !== "completed" && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveTestInPackage}
                disabled={packageResultUpdating}
                startIcon={
                  packageResultUpdating ? <CircularProgress size={16} /> : null
                }
              >
                {packageResultUpdating
                  ? "Đang lưu..."
                  : "Lưu kết quả xét nghiệm"}
              </Button>
            )}

          {/* Nút lưu thông tin chung của gói */}
          {currentPackage &&
            !currentTestInPackage &&
            currentPackage.status !== "completed" && (
              <Button
                variant="contained"
                onClick={handleSavePackage}
                disabled={packageResultUpdating}
              >
                Lưu thông tin gói
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STITestManagementContent;

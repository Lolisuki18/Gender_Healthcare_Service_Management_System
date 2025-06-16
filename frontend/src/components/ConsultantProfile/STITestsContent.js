/**
 * STITestsContent.js - Component để quản lý STI Tests của chuyên gia
 *
 * Features:
 * - Xem danh sách STI Tests
 * - Quản lý trạng thái STI Tests
 * - Chi tiết kết quả xét nghiệm
 * - Tạo báo cáo và đề xuất điều trị
 */

import React, { useState } from "react";
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
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Science as ScienceIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon,
  StickyNote2 as StickyNote2Icon,
  Settings as SettingsIcon,
  CalendarToday as CalendarTodayIcon,
  LocalHospital as LocalHospitalIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 500,
  ...(status === "pending" && {
    backgroundColor: "rgba(255, 193, 7, 0.12)",
    color: "#FFB300",
  }),
  ...(status === "processing" && {
    backgroundColor: "rgba(33, 150, 243, 0.12)",
    color: "#1E88E5",
  }),
  ...(status === "completed" && {
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    color: "#43A047",
  }),
  ...(status === "cancelled" && {
    backgroundColor: "rgba(244, 67, 54, 0.12)",
    color: "#E53935",
  }),
}));

// Test Type translation function
const getTestTypeTranslation = (type) => {
  switch (type) {
    case "hiv":
      return "HIV";
    case "syphilis":
      return "Giang mai";
    case "gonorrhea":
      return "Lậu";
    case "chlamydia":
      return "Chlamydia";
    case "hpv":
      return "HPV";
    case "herpes":
      return "Herpes";
    case "hepatitisB":
      return "Viêm gan B";
    case "hepatitisC":
      return "Viêm gan C";
    case "comprehensive":
      return "Xét nghiệm tổng quát";
    default:
      return type;
  }
};

const STITestsContent = () => {
  // State variables
  const [tests, setTests] = useState([
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientEmail: "nguyenvana@example.com",
      patientPhone: "0912345678",
      patientAvatar: "/images/avatars/avatar1.jpg",
      testType: "comprehensive",
      testDate: "2023-10-15T09:30:00",
      status: "completed",
      results: {
        hiv: "Âm tính",
        syphilis: "Âm tính",
        gonorrhea: "Âm tính",
        chlamydia: "Dương tính",
        hpv: "Âm tính",
        herpes: "Âm tính",
        hepatitisB: "Âm tính",
        hepatitisC: "Âm tính",
      },
      recommendations:
        "Điều trị Chlamydia bằng kháng sinh nhóm Azithromycin. Tái khám sau 2 tuần.",
      notes: "Bệnh nhân có biểu hiện đau khi đi tiểu, cần theo dõi thêm.",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      patientEmail: "tranthib@example.com",
      patientPhone: "0987654321",
      patientAvatar: "/images/avatars/avatar2.jpg",
      testType: "hiv",
      testDate: "2023-10-16T14:00:00",
      status: "completed",
      results: {
        hiv: "Âm tính",
      },
      recommendations:
        "Không cần điều trị. Tái xét nghiệm sau 3 tháng để xác nhận kết quả.",
      notes: "Bệnh nhân có hành vi nguy cơ cao, cần tư vấn về phòng ngừa.",
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      patientEmail: "levanc@example.com",
      patientPhone: "0923456789",
      patientAvatar: "/images/avatars/avatar3.jpg",
      testType: "gonorrhea",
      testDate: "2023-10-18T10:15:00",
      status: "pending",
      results: null,
      recommendations: null,
      notes: "Bệnh nhân có các triệu chứng tiết dịch, đau khi đi tiểu.",
    },
    {
      id: 4,
      patientName: "Phạm Thị D",
      patientEmail: "phamthid@example.com",
      patientPhone: "0934567890",
      patientAvatar: "/images/avatars/avatar4.jpg",
      testType: "hpv",
      testDate: "2023-10-19T11:30:00",
      status: "processing",
      results: null,
      recommendations: null,
      notes: "Bệnh nhân có tiền sử gia đình mắc ung thư cổ tử cung.",
    },
    {
      id: 5,
      patientName: "Hoàng Văn E",
      patientEmail: "hoangvane@example.com",
      patientPhone: "0945678901",
      patientAvatar: "/images/avatars/avatar5.jpg",
      testType: "comprehensive",
      testDate: "2023-10-20T13:45:00",
      status: "completed",
      results: {
        hiv: "Âm tính",
        syphilis: "Âm tính",
        gonorrhea: "Âm tính",
        chlamydia: "Âm tính",
        hpv: "Dương tính",
        herpes: "Âm tính",
        hepatitisB: "Âm tính",
        hepatitisC: "Âm tính",
      },
      recommendations:
        "Theo dõi HPV dương tính. Tái xét nghiệm sau 6 tháng. Khuyến nghị tiêm vắc-xin HPV nếu chưa tiêm.",
      notes: "Bệnh nhân không có biểu hiện bất thường.",
    },
  ]);

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // New filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [testTypeFilter, setTestTypeFilter] = useState("all");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [recommendationDialogOpen, setRecommendationDialogOpen] =
    useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch tests on component mount - will be replaced with API call
  // React.useEffect(() => {
  //   const fetchTests = async () => {
  //     try {
  //       const data = await consultantService.getSTITests();
  //       setTests(data);
  //     } catch (error) {
  //       console.error("Error fetching STI tests:", error);
  //     }
  //   };
  //   fetchTests();
  // }, []);

  // Filter tests based on all filters
  const filteredTests = tests.filter((test) => {
    // Filter by status - now using statusFilter instead of tab value
    if (statusFilter !== "all" && test.status !== statusFilter) return false;

    // Filter by test type
    if (testTypeFilter !== "all" && test.testType !== testTypeFilter)
      return false;

    // Filter by date range
    if (startDate && endDate) {
      const testDateTime = new Date(test.testDate).getTime();
      const filterStartTime = new Date(startDate).setHours(0, 0, 0, 0);
      const filterEndTime = new Date(endDate).setHours(23, 59, 59, 999);

      if (testDateTime < filterStartTime || testDateTime > filterEndTime)
        return false;
    }

    // Filter by search query
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTestTypeTranslation(test.testType)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      test.patientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Handle tab change - reset status filter when changing tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Reset status filter when changing tabs for consistency
    if (newValue === 0) {
      setStatusFilter("all");
    } else if (newValue === 1) {
      setStatusFilter("pending");
    } else if (newValue === 2) {
      setStatusFilter("processing");
    } else if (newValue === 3) {
      setStatusFilter("completed");
    }

    setPage(0);
  };

  // Handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle open details dialog
  const handleOpenDetailsDialog = (test) => {
    setSelectedTest(test);
    setDetailsDialogOpen(true);
  };

  // Handle close details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Handle open recommendation dialog
  const handleOpenRecommendationDialog = (test) => {
    setSelectedTest(test);
    setRecommendation(test.recommendations || "");
    setRecommendationDialogOpen(true);
    setSubmitSuccess(false);
    setSubmitError("");
  };

  // Handle close recommendation dialog
  const handleCloseRecommendationDialog = () => {
    setRecommendationDialogOpen(false);
  };

  // Handle submit recommendation
  const handleSubmitRecommendation = async () => {
    if (!recommendation.trim()) {
      setSubmitError("Vui lòng nhập khuyến nghị điều trị");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update recommendation in local state
      setTests((prevTests) =>
        prevTests.map((t) =>
          t.id === selectedTest.id
            ? { ...t, recommendations: recommendation }
            : t
        )
      );

      // Update selected test if details dialog is open
      if (selectedTest) {
        setSelectedTest({
          ...selectedTest,
          recommendations: recommendation,
        });
      }

      setSubmitSuccess(true);

      // Close dialog after success
      setTimeout(() => {
        setRecommendationDialogOpen(false);
        setSubmitSuccess(false);
      }, 2000);

      // API call would be uncommented when back-end is ready
      /*
      await consultantService.updateSTITestRecommendation(selectedTest.id, {
        recommendations: recommendation
      });
      */
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      setSubmitError(
        "Có lỗi xảy ra khi gửi khuyến nghị. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setTestTypeFilter("all");
    setSearchQuery("");
    setTabValue(0);
    setPage(0);
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return (
          <StatusChip label="Chờ xét nghiệm" size="small" status={status} />
        );
      case "processing":
        return <StatusChip label="Đang xử lý" size="small" status={status} />;
      case "completed":
        return (
          <StatusChip label="Đã hoàn thành" size="small" status={status} />
        );
      case "cancelled":
        return <StatusChip label="Đã hủy" size="small" status={status} />;
      default:
        return <Chip label="Không xác định" size="small" />;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Quản lý STI Tests
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Quản lý các xét nghiệm STI và kết quả xét nghiệm
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
            },
          }}
        >
          <Tab
            label={`Tất cả (${tests.length})`}
            icon={<ScienceIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Chờ xét nghiệm (${
              tests.filter((test) => test.status === "pending").length
            })`}
            icon={<CalendarTodayIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Đang xử lý (${
              tests.filter((test) => test.status === "processing").length
            })`}
            icon={<SettingsIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Hoàn thành (${
              tests.filter((test) => test.status === "completed").length
            })`}
            icon={<CheckCircleOutlineIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên bệnh nhân, loại xét nghiệm..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Filter controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Từ ngày"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Đến ngày"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Trạng thái</InputLabel>{" "}
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="pending">Chờ xét nghiệm</MenuItem>
                <MenuItem value="processing">Đang xử lý</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="test-type-filter-label">
                Loại xét nghiệm
              </InputLabel>
              <Select
                labelId="test-type-filter-label"
                value={testTypeFilter}
                label="Loại xét nghiệm"
                onChange={(e) => setTestTypeFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả loại xét nghiệm</MenuItem>
                <MenuItem value="hiv">HIV</MenuItem>
                <MenuItem value="syphilis">Giang mai</MenuItem>
                <MenuItem value="gonorrhea">Lậu</MenuItem>
                <MenuItem value="chlamydia">Chlamydia</MenuItem>
                <MenuItem value="hpv">HPV</MenuItem>
                <MenuItem value="herpes">Herpes</MenuItem>
                <MenuItem value="hepatitisB">Viêm gan B</MenuItem>
                <MenuItem value="hepatitisC">Viêm gan C</MenuItem>
                <MenuItem value="comprehensive">Xét nghiệm tổng quát</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleClearFilters}
          startIcon={<ClearIcon />}
        >
          Xóa bộ lọc
        </Button>
      </Box>

      <StyledPaper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Loại xét nghiệm</TableCell>
                <TableCell>Ngày xét nghiệm</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTests.length > 0 ? (
                filteredTests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((test) => (
                    <TableRow key={test.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={test.patientAvatar}
                            alt={test.patientName}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {test.patientName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {test.patientEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTestTypeTranslation(test.testType)}
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<LocalHospitalIcon fontSize="small" />}
                        />
                      </TableCell>
                      <TableCell>{formatDate(test.testDate)}</TableCell>
                      <TableCell>{renderStatusChip(test.status)}</TableCell>
                      <TableCell>
                        {test.status === "completed" ? (
                          test.results &&
                          Object.values(test.results).some((result) =>
                            result.includes("Dương tính")
                          ) ? (
                            <Chip
                              label="Có kết quả dương tính"
                              color="error"
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="Tất cả âm tính"
                              color="success"
                              size="small"
                            />
                          )
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Chưa có kết quả
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenDetailsDialog(test)}
                          sx={{ mr: 1 }}
                        >
                          Chi tiết
                        </Button>
                        {test.status === "completed" && (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenRecommendationDialog(test)}
                          >
                            Khuyến nghị
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Không tìm thấy xét nghiệm nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
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
            `${from}-${to} / ${count}`
          }
        />
      </StyledPaper>

      {/* Chi tiết xét nghiệm Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ScienceIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Chi tiết xét nghiệm STI</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Thông tin bệnh nhân
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={selectedTest.patientAvatar}
                        alt={selectedTest.patientName}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">
                          {selectedTest.patientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {selectedTest.patientEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Điện thoại: {selectedTest.patientPhone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Thông tin xét nghiệm
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Loại xét nghiệm:</strong>
                        </Typography>
                        <Chip
                          label={getTestTypeTranslation(selectedTest.testType)}
                          color="primary"
                          size="small"
                          icon={<LocalHospitalIcon fontSize="small" />}
                        />
                      </Box>
                      <Typography variant="body2">
                        <strong>Ngày xét nghiệm:</strong>{" "}
                        {formatDate(selectedTest.testDate)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Trạng thái:</strong>
                        </Typography>
                        {renderStatusChip(selectedTest.status)}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Kết quả xét nghiệm
                    </Typography>

                    {selectedTest.status === "completed" &&
                    selectedTest.results ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Loại xét nghiệm</TableCell>
                              <TableCell>Kết quả</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(selectedTest.results).map(
                              ([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell>
                                    {getTestTypeTranslation(key)}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={value}
                                      size="small"
                                      color={
                                        value.includes("Dương tính")
                                          ? "error"
                                          : "success"
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info">Chưa có kết quả xét nghiệm</Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Khuyến nghị điều trị
                      </Typography>
                      {selectedTest.status === "completed" && (
                        <Button
                          startIcon={<EditIcon />}
                          size="small"
                          onClick={() =>
                            handleOpenRecommendationDialog(selectedTest)
                          }
                        >
                          {selectedTest.recommendations
                            ? "Cập nhật"
                            : "Thêm khuyến nghị"}
                        </Button>
                      )}
                    </Box>

                    {selectedTest.recommendations ? (
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "background.default" }}
                      >
                        <Typography variant="body2">
                          {selectedTest.recommendations}
                        </Typography>
                      </Paper>
                    ) : (
                      <Alert severity="info">
                        {selectedTest.status === "completed"
                          ? "Chưa có khuyến nghị điều trị nào được thêm"
                          : "Khuyến nghị điều trị sẽ được thêm sau khi xét nghiệm hoàn thành"}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {selectedTest.notes && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Ghi chú
                      </Typography>
                      <Typography variant="body2">
                        {selectedTest.notes}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Đóng</Button>
          {selectedTest && selectedTest.status === "completed" && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                // Would implement download functionality here
                alert("Tính năng tải xuống báo cáo sẽ được triển khai sau");
              }}
            >
              Tải báo cáo
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog để thêm/cập nhật khuyến nghị điều trị */}
      <Dialog
        open={recommendationDialogOpen}
        onClose={handleCloseRecommendationDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {selectedTest?.recommendations
                ? "Cập nhật khuyến nghị điều trị"
                : "Thêm khuyến nghị điều trị"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Đã lưu khuyến nghị điều trị thành công!
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {selectedTest && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Bệnh nhân: <strong>{selectedTest.patientName}</strong>
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Xét nghiệm:{" "}
                  <strong>
                    {getTestTypeTranslation(selectedTest.testType)}
                  </strong>
                </Typography>

                {selectedTest.results && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Kết quả dương tính:
                    </Typography>
                    {Object.entries(selectedTest.results)
                      .filter(([_, value]) => value.includes("Dương tính"))
                      .map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${getTestTypeTranslation(key)}: ${value}`}
                          color="error"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}

                    {!Object.values(selectedTest.results).some((result) =>
                      result.includes("Dương tính")
                    ) && (
                      <Chip
                        label="Tất cả kết quả đều âm tính"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                )}
              </Box>

              <TextField
                label="Khuyến nghị điều trị"
                multiline
                rows={6}
                fullWidth
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Nhập khuyến nghị điều trị cho bệnh nhân dựa trên kết quả xét nghiệm..."
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseRecommendationDialog}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              submitting ? <CircularProgress size={20} /> : <SendIcon />
            }
            onClick={handleSubmitRecommendation}
            disabled={submitting || !recommendation.trim()}
          >
            {submitting ? "Đang lưu..." : "Lưu khuyến nghị"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STITestsContent;

/**
 * MyConsultationsContent.js - Component để hiển thị và quản lý lịch tư vấn của chuyên gia
 *
 * Features:
 * - Xem lịch tư vấn theo ngày, tuần, tháng
 * - Quản lý trạng thái lịch tư vấn
 * - Chi tiết lịch tư vấn
 * - Thay đổi trạng thái lịch tư vấn
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Badge,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Today as TodayIcon,
  CalendarMonth as CalendarMonthIcon,
  CalendarViewWeek as CalendarViewWeekIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  PendingActions as PendingActionsIcon,
  Update as UpdateIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import viLocale from "date-fns/locale/vi";

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
  ...(status === "scheduled" && {
    backgroundColor: "rgba(255, 193, 7, 0.12)",
    color: "#FFB300",
  }),
  ...(status === "completed" && {
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    color: "#43A047",
  }),
  ...(status === "canceled" && {
    backgroundColor: "rgba(244, 67, 54, 0.12)",
    color: "#E53935",
  }),
  ...(status === "pending" && {
    backgroundColor: "rgba(33, 150, 243, 0.12)",
    color: "#1E88E5",
  }),
}));

// Component để hiển thị slot thời gian
const TimeSlot = ({ slot, onViewDetails, onUpdateStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    handleClose();
    onViewDetails(slot);
  };

  const handleUpdateStatus = (status) => {
    handleClose();
    onUpdateStatus(slot.id, status);
  };

  // Hàm lấy icon theo phương thức tư vấn
  const getConsultationTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <VideocamIcon fontSize="small" />;
      case "chat":
        return <ChatIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  // Hàm lấy chip status
  const getStatusChip = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <StatusChip
            label="Đã đặt lịch"
            size="small"
            status={status}
            icon={<EventAvailableIcon fontSize="small" />}
          />
        );
      case "completed":
        return (
          <StatusChip
            label="Đã hoàn thành"
            size="small"
            status={status}
            icon={<CheckIcon fontSize="small" />}
          />
        );
      case "canceled":
        return (
          <StatusChip
            label="Đã hủy"
            size="small"
            status={status}
            icon={<CloseIcon fontSize="small" />}
          />
        );
      case "pending":
        return (
          <StatusChip
            label="Đang chờ xác nhận"
            size="small"
            status={status}
            icon={<PendingActionsIcon fontSize="small" />}
          />
        );
      default:
        return <Chip label="Không xác định" size="small" />;
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        borderLeft: `4px solid ${
          slot.status === "scheduled"
            ? "#FFB300"
            : slot.status === "completed"
            ? "#43A047"
            : slot.status === "canceled"
            ? "#E53935"
            : "#1E88E5"
        }`,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={slot.customerName}
                src={slot.customerAvatar}
                sx={{ width: 40, height: 40, mr: 1.5 }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                  {slot.customerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {slot.customerEmail}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">
                  {new Date(slot.startTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(slot.endTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(slot.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={
                  slot.type === "video"
                    ? "Video"
                    : slot.type === "chat"
                    ? "Chat"
                    : "Trực tiếp"
                }
                size="small"
                color="info"
                icon={getConsultationTypeIcon(slot.type)}
              />
              {getStatusChip(slot.status)}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ textAlign: { xs: "left", md: "right" } }}
          >
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
              onClick={handleViewDetails}
            >
              Chi tiết
            </Button>
            <IconButton size="small" onClick={handleClick}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleViewDetails}>Xem chi tiết</MenuItem>
              <Divider />
              {slot.status === "pending" && (
                <MenuItem onClick={() => handleUpdateStatus("scheduled")}>
                  <EventAvailableIcon fontSize="small" sx={{ mr: 1 }} />
                  Xác nhận lịch tư vấn
                </MenuItem>
              )}
              {slot.status === "scheduled" && (
                <MenuItem onClick={() => handleUpdateStatus("completed")}>
                  <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                  Đánh dấu đã hoàn thành
                </MenuItem>
              )}
              {(slot.status === "scheduled" || slot.status === "pending") && (
                <MenuItem onClick={() => handleUpdateStatus("canceled")}>
                  <CloseIcon fontSize="small" sx={{ mr: 1 }} />
                  Hủy lịch tư vấn
                </MenuItem>
              )}
            </Menu>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const MyConsultationsContent = () => {
  // State for current view
  const [viewType, setViewType] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Status update states
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data - replace with API call
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      customerName: "Nguyễn Thị Hoa",
      customerEmail: "nguyenthihoa@example.com",
      customerPhone: "0934567890",
      customerAvatar: "/images/avatars/avatar1.jpg",
      date: "2023-10-20T00:00:00",
      startTime: "2023-10-20T09:00:00",
      endTime: "2023-10-20T10:00:00",
      type: "video",
      status: "scheduled",
      notes: "Khách hàng muốn tư vấn về cách phòng tránh STI.",
      reason: "Tư vấn phòng tránh STI",
      createdAt: "2023-10-15T14:30:00",
    },
    {
      id: 2,
      customerName: "Trần Văn Minh",
      customerEmail: "tranvanminh@example.com",
      customerPhone: "0912345678",
      customerAvatar: "/images/avatars/avatar2.jpg",
      date: "2023-10-20T00:00:00",
      startTime: "2023-10-20T13:30:00",
      endTime: "2023-10-20T14:30:00",
      type: "chat",
      status: "pending",
      notes: "Khách hàng cần tư vấn về các biện pháp xét nghiệm STI.",
      reason: "Tư vấn xét nghiệm STI",
      createdAt: "2023-10-16T10:15:00",
    },
    {
      id: 3,
      customerName: "Lê Thị Mai",
      customerEmail: "lethimai@example.com",
      customerPhone: "0978123456",
      customerAvatar: "/images/avatars/avatar3.jpg",
      date: "2023-10-21T00:00:00",
      startTime: "2023-10-21T10:00:00",
      endTime: "2023-10-21T11:00:00",
      type: "video",
      status: "scheduled",
      notes: "Khách hàng cần tư vấn về kết quả xét nghiệm.",
      reason: "Tư vấn kết quả xét nghiệm STI",
      createdAt: "2023-10-17T09:45:00",
    },
    {
      id: 4,
      customerName: "Phạm Văn Hoàng",
      customerEmail: "phamvanhoang@example.com",
      customerPhone: "0936789012",
      customerAvatar: "/images/avatars/avatar4.jpg",
      date: "2023-10-19T00:00:00",
      startTime: "2023-10-19T15:00:00",
      endTime: "2023-10-19T16:00:00",
      type: "chat",
      status: "completed",
      notes: "Đã tư vấn về các biện pháp phòng ngừa và điều trị STI.",
      reason: "Tư vấn phòng ngừa và điều trị STI",
      feedback:
        "Rất hài lòng với buổi tư vấn, chuyên gia giải thích rất rõ ràng và chi tiết.",
      rating: 5,
      createdAt: "2023-10-15T08:30:00",
    },
    {
      id: 5,
      customerName: "Vũ Thị Hương",
      customerEmail: "vuthihuong@example.com",
      customerPhone: "0945678901",
      customerAvatar: "/images/avatars/avatar5.jpg",
      date: "2023-10-19T00:00:00",
      startTime: "2023-10-19T11:30:00",
      endTime: "2023-10-19T12:30:00",
      type: "video",
      status: "canceled",
      notes: "Khách hàng hủy do lịch trình cá nhân thay đổi.",
      reason: "Tư vấn về các biểu hiện của STI",
      cancelReason: "Có việc đột xuất, sẽ đặt lại sau",
      createdAt: "2023-10-16T14:20:00",
    },
  ]);

  // Fetch consultations on component mount - will be replaced with API call
  // React.useEffect(() => {
  //   const fetchConsultations = async () => {
  //     try {
  //       const data = await consultantService.getConsultations();
  //       setConsultations(data);
  //     } catch (error) {
  //       console.error("Error fetching consultations:", error);
  //     }
  //   };
  //   fetchConsultations();
  // }, []);

  // Filter consultations based on selected date and view type
  const getFilteredConsultations = () => {
    // Filter by tab/status
    let statusFiltered;
    if (tabValue === 0) {
      // Tất cả
      statusFiltered = consultations;
    } else if (tabValue === 1) {
      // Chờ xác nhận
      statusFiltered = consultations.filter((c) => c.status === "pending");
    } else if (tabValue === 2) {
      // Đã đặt lịch
      statusFiltered = consultations.filter((c) => c.status === "scheduled");
    } else if (tabValue === 3) {
      // Đã hoàn thành
      statusFiltered = consultations.filter((c) => c.status === "completed");
    } else {
      // Đã hủy
      statusFiltered = consultations.filter((c) => c.status === "canceled");
    }

    // Filter by date
    const filteredByDate = statusFiltered.filter((consultation) => {
      const consultDate = new Date(consultation.date);

      if (viewType === "day") {
        // Same day
        return (
          consultDate.getFullYear() === selectedDate.getFullYear() &&
          consultDate.getMonth() === selectedDate.getMonth() &&
          consultDate.getDate() === selectedDate.getDate()
        );
      } else if (viewType === "week") {
        // Same week
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return consultDate >= startOfWeek && consultDate <= endOfWeek;
      } else {
        // Same month
        return (
          consultDate.getFullYear() === selectedDate.getFullYear() &&
          consultDate.getMonth() === selectedDate.getMonth()
        );
      }
    });

    return filteredByDate;
  };

  // Handle view type change
  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle open details dialog
  const handleOpenDetailsDialog = (consultation) => {
    setSelectedConsultation(consultation);
    setDetailsDialogOpen(true);
  };

  // Handle close details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Handle update consultation status
  const handleUpdateStatus = async (consultationId, newStatus) => {
    setUpdateStatus({
      loading: true,
      success: false,
      error: "",
    });

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update status in local state
      setConsultations((prevConsultations) =>
        prevConsultations.map((c) =>
          c.id === consultationId ? { ...c, status: newStatus } : c
        )
      );

      // Update selected consultation if dialog is open
      if (selectedConsultation && selectedConsultation.id === consultationId) {
        setSelectedConsultation({
          ...selectedConsultation,
          status: newStatus,
        });
      }

      // Show success message
      setUpdateStatus({
        loading: false,
        success: true,
        error: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus((prev) => ({
          ...prev,
          success: false,
        }));
      }, 3000);

      // API call would be uncommented when back-end is ready
      /*
      await consultantService.updateConsultationStatus(consultationId, {
        status: newStatus
      });
      */
    } catch (error) {
      console.error("Error updating consultation status:", error);
      setUpdateStatus({
        loading: false,
        success: false,
        error: "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại sau.",
      });
    }
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

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get title for current view
  const getViewTitle = () => {
    if (viewType === "day") {
      return `Lịch tư vấn ngày: ${formatDate(selectedDate)}`;
    } else if (viewType === "week") {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `Lịch tư vấn tuần: ${new Date(startOfWeek).toLocaleDateString(
        "vi-VN"
      )} - ${new Date(endOfWeek).toLocaleDateString("vi-VN")}`;
    } else {
      return `Lịch tư vấn tháng: ${new Date(selectedDate).toLocaleDateString(
        "vi-VN",
        { month: "long", year: "numeric" }
      )}`;
    }
  };

  const filteredConsultations = getFilteredConsultations();
  const paginatedConsultations = filteredConsultations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Lịch tư vấn của tôi
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Quản lý và theo dõi lịch tư vấn của bạn
      </Typography>

      {updateStatus.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Cập nhật trạng thái thành công!
        </Alert>
      )}

      {updateStatus.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {updateStatus.error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={viewType === "day" ? "contained" : "outlined"}
            startIcon={<TodayIcon />}
            onClick={() => handleViewTypeChange("day")}
          >
            Ngày
          </Button>
          <Button
            variant={viewType === "week" ? "contained" : "outlined"}
            startIcon={<CalendarViewWeekIcon />}
            onClick={() => handleViewTypeChange("week")}
          >
            Tuần
          </Button>
          <Button
            variant={viewType === "month" ? "contained" : "outlined"}
            startIcon={<CalendarMonthIcon />}
            onClick={() => handleViewTypeChange("month")}
          >
            Tháng
          </Button>
        </Box>

        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={viLocale}
        >
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            label="Chọn ngày"
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {getViewTitle()}
        </Typography>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          <Tab
            label={`Tất cả (${consultations.length})`}
            icon={<EventIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Chờ xác nhận (${
              consultations.filter((c) => c.status === "pending").length
            })`}
            icon={<PendingActionsIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Đã đặt lịch (${
              consultations.filter((c) => c.status === "scheduled").length
            })`}
            icon={<EventAvailableIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Đã hoàn thành (${
              consultations.filter((c) => c.status === "completed").length
            })`}
            icon={<CheckIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Đã hủy (${
              consultations.filter((c) => c.status === "canceled").length
            })`}
            icon={<CloseIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <StyledPaper elevation={3} sx={{ p: 3 }}>
        {filteredConsultations.length > 0 ? (
          <>
            {paginatedConsultations.map((consultation) => (
              <TimeSlot
                key={consultation.id}
                slot={consultation}
                onViewDetails={handleOpenDetailsDialog}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
            <TablePagination
              component="div"
              count={filteredConsultations.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Hiển thị:"
            />
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CalendarMonthIcon
              sx={{
                fontSize: 60,
                color: "text.secondary",
                opacity: 0.3,
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              Không có lịch tư vấn nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy lịch tư vấn nào trong khoảng thời gian đã chọn
            </Typography>
          </Box>
        )}
      </StyledPaper>

      {/* Chi tiết lịch tư vấn Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon color="primary" />
          Chi tiết lịch tư vấn
        </DialogTitle>
        <DialogContent dividers>
          {selectedConsultation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Thông tin khách hàng
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={selectedConsultation.customerAvatar}
                        alt={selectedConsultation.customerName}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">
                          {selectedConsultation.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {selectedConsultation.customerEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Điện thoại: {selectedConsultation.customerPhone}
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
                      Thông tin buổi tư vấn
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Ngày:</strong>{" "}
                          {formatDate(selectedConsultation.date)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TodayIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Thời gian:</strong>{" "}
                          {new Date(
                            selectedConsultation.startTime
                          ).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(
                            selectedConsultation.endTime
                          ).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Phương thức:</strong>{" "}
                          {selectedConsultation.type === "video"
                            ? "Tư vấn qua video"
                            : selectedConsultation.type === "chat"
                            ? "Tư vấn qua chat"
                            : "Tư vấn trực tiếp"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <UpdateIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Trạng thái:</strong>{" "}
                          {selectedConsultation.status === "scheduled"
                            ? "Đã đặt lịch"
                            : selectedConsultation.status === "completed"
                            ? "Đã hoàn thành"
                            : selectedConsultation.status === "canceled"
                            ? "Đã hủy"
                            : "Đang chờ xác nhận"}
                        </Typography>
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
                      Nội dung buổi tư vấn
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Lý do tư vấn:</strong>{" "}
                      {selectedConsultation.reason}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Ghi chú:</strong>{" "}
                      {selectedConsultation.notes || "Không có ghi chú"}
                    </Typography>

                    {selectedConsultation.status === "canceled" &&
                      selectedConsultation.cancelReason && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Lý do hủy:</strong>{" "}
                            {selectedConsultation.cancelReason}
                          </Typography>
                        </Alert>
                      )}

                    {selectedConsultation.status === "completed" && (
                      <>
                        {selectedConsultation.feedback && (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              bgcolor: "background.default",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle2" gutterBottom>
                              Phản hồi từ khách hàng:
                            </Typography>
                            <Typography variant="body2">
                              {selectedConsultation.feedback}
                            </Typography>
                            {selectedConsultation.rating && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography variant="body2" mr={1}>
                                  Đánh giá:
                                </Typography>
                                <Chip
                                  label={`${selectedConsultation.rating}/5`}
                                  color="primary"
                                  size="small"
                                />
                              </Box>
                            )}
                          </Box>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Đóng</Button>
          {selectedConsultation &&
            selectedConsultation.status === "pending" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleUpdateStatus(selectedConsultation.id, "scheduled")
                }
                disabled={updateStatus.loading}
                startIcon={
                  updateStatus.loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <EventAvailableIcon />
                  )
                }
              >
                {updateStatus.loading
                  ? "Đang xử lý..."
                  : "Xác nhận lịch tư vấn"}
              </Button>
            )}
          {selectedConsultation &&
            selectedConsultation.status === "scheduled" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleUpdateStatus(selectedConsultation.id, "completed")
                }
                disabled={updateStatus.loading}
                startIcon={
                  updateStatus.loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CheckIcon />
                  )
                }
              >
                {updateStatus.loading ? "Đang xử lý..." : "Đánh dấu hoàn thành"}
              </Button>
            )}
          {selectedConsultation &&
            (selectedConsultation.status === "scheduled" ||
              selectedConsultation.status === "pending") && (
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  handleUpdateStatus(selectedConsultation.id, "canceled")
                }
                disabled={updateStatus.loading}
                startIcon={
                  updateStatus.loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloseIcon />
                  )
                }
              >
                {updateStatus.loading ? "Đang xử lý..." : "Hủy lịch tư vấn"}
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyConsultationsContent;

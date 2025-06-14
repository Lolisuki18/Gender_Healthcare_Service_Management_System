import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  VideoCall as VideoCallIcon,
  Notes as NotesIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(16, 185, 129, 0.15)",
  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(16, 185, 129, 0.15)",
  },
}));

const AppointmentCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05))",
  border: "1px solid rgba(16, 185, 129, 0.1)",
  borderRadius: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(16, 185, 129, 0.15)",
  },
}));

const ConsultantAppointmentsContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const appointments = {
    today: [
      {
        id: 1,
        time: "09:00 - 09:30",
        patient: "Nguyễn Văn A",
        age: 28,
        service: "Tư vấn chuyển đổi giới tính",
        status: "confirmed",
        type: "online",
        phone: "0901234567",
        email: "nguyenvana@gmail.com",
        notes: "Bệnh nhân cần tư vấn về hormone therapy",
        priority: "high",
      },
      {
        id: 2,
        time: "10:00 - 10:45",
        patient: "Trần Thị B",
        age: 24,
        service: "Kiểm tra sức khỏe",
        status: "in-progress",
        type: "offline",
        phone: "0907654321",
        email: "tranthib@gmail.com",
        notes: "Khám định kỳ 3 tháng",
        priority: "medium",
        location: "Phòng 101",
      },
      {
        id: 3,
        time: "14:00 - 14:30",
        patient: "Lê Văn C",
        age: 32,
        service: "Tư vấn tâm lý",
        status: "upcoming",
        type: "online",
        phone: "0909876543",
        email: "levanc@gmail.com",
        notes: "Tư vấn về áp lực xã hội",
        priority: "low",
      },
    ],
    upcoming: [
      {
        id: 4,
        time: "09:00 - 09:30",
        date: "2024-06-06",
        patient: "Phạm Thị D",
        age: 26,
        service: "Tư vấn chuyển đổi",
        status: "confirmed",
        type: "offline",
        phone: "0905432109",
        email: "phamthid@gmail.com",
        notes: "Lần đầu tư vấn",
        priority: "high",
        location: "Phòng 102",
      },
      {
        id: 5,
        time: "15:00 - 15:45",
        date: "2024-06-07",
        patient: "Hoàng Văn E",
        age: 29,
        service: "Theo dõi sau điều trị",
        status: "confirmed",
        type: "online",
        phone: "0903456789",
        email: "hoangvane@gmail.com",
        notes: "Kiểm tra tiến triển sau 1 tháng",
        priority: "medium",
      },
    ],
    history: [
      {
        id: 6,
        time: "09:00 - 09:30",
        date: "2024-06-03",
        patient: "Võ Thị F",
        age: 31,
        service: "Tư vấn chuyển đổi",
        status: "completed",
        type: "offline",
        phone: "0908765432",
        email: "vothif@gmail.com",
        notes: "Đã hoàn thành tư vấn ban đầu. Bệnh nhân sẽ tiếp tục theo dõi.",
        priority: "medium",
        location: "Phòng 103",
        rating: 5,
        feedback: "Bác sĩ rất tận tình và chuyên nghiệp.",
      },
      {
        id: 7,
        time: "14:00 - 14:30",
        date: "2024-06-02",
        patient: "Đào Văn G",
        age: 27,
        service: "Kiểm tra sức khỏe",
        status: "completed",
        type: "online",
        phone: "0902345678",
        email: "daovang@gmail.com",
        notes: "Kết quả xét nghiệm bình thường. Tái khám sau 3 tháng.",
        priority: "low",
        rating: 4,
        feedback: "Dịch vụ tốt, hài lòng.",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "primary";
      case "in-progress":
        return "success";
      case "upcoming":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "in-progress":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp tới";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setConsultationNotes(appointment.notes || "");
    setOpenDialog(true);
  };

  const handleSaveNotes = () => {
    // TODO: Save consultation notes to backend
    console.log("Saving notes for appointment:", selectedAppointment.id);
    console.log("Notes:", consultationNotes);
    setOpenDialog(false);
    alert("Đã lưu ghi chú tư vấn!");
  };

  const handleMenuClick = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAction(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAction(null);
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    // TODO: Update appointment status in backend
    console.log("Updating appointment", appointmentId, "to status", newStatus);
    handleMenuClose();
    alert(`Đã cập nhật trạng thái cuộc hẹn!`);
  };

  const renderAppointmentsList = (appointmentsList) => (
    <Grid container spacing={3}>
      {appointmentsList.map((appointment) => (
        <Grid item xs={12} lg={6} key={appointment.id}>
          <AppointmentCard>
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={appointment.priority !== "high"}
                    sx={{
                      "& .MuiBadge-dot": {
                        backgroundColor: getPriorityColor(appointment.priority),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        background: "linear-gradient(45deg, #10b981, #059669)",
                        width: 48,
                        height: 48,
                        mr: 2,
                        fontWeight: 600,
                      }}
                    >
                      {appointment.patient.charAt(0)}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#2D3748" }}
                    >
                      {appointment.patient}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#718096" }}>
                      {appointment.age} tuổi
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={getStatusText(appointment.status)}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, appointment)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Appointment Details */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#4A5568",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 16, mr: 1 }} />
                  {appointment.time}{" "}
                  {appointment.date && `- ${appointment.date}`}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#2D3748", mb: 1, fontWeight: 500 }}
                >
                  {appointment.service}
                </Typography>

                {/* Contact Info */}
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#718096",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {appointment.phone}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#718096",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {appointment.email}
                  </Typography>
                </Box>

                {/* Type and Location */}
                <Box
                  sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}
                >
                  <Chip
                    label={
                      appointment.type === "online"
                        ? "Tư vấn online"
                        : "Tại phòng khám"
                    }
                    size="small"
                    variant="outlined"
                    color={
                      appointment.type === "online" ? "primary" : "secondary"
                    }
                    icon={
                      appointment.type === "online" ? (
                        <VideoCallIcon />
                      ) : (
                        <LocationIcon />
                      )
                    }
                  />
                  {appointment.location && (
                    <Chip
                      label={appointment.location}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )}
                </Box>

                {/* Notes Preview */}
                {appointment.notes && (
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(16, 185, 129, 0.05)",
                      borderRadius: "8px",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#374151", fontStyle: "italic" }}
                    >
                      <NotesIcon
                        sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                      />
                      {appointment.notes.length > 100
                        ? `${appointment.notes.substring(0, 100)}...`
                        : appointment.notes}
                    </Typography>
                  </Box>
                )}

                {/* Rating for completed appointments */}
                {appointment.status === "completed" && appointment.rating && (
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(59, 130, 246, 0.05)",
                      borderRadius: "8px",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ mr: 1, fontWeight: 500 }}
                      >
                        Đánh giá:
                      </Typography>
                      {[...Array(5)].map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor:
                              index < appointment.rating
                                ? "#fbbf24"
                                : "#e5e7eb",
                            mr: 0.5,
                          }}
                        />
                      ))}
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#4b5563" }}
                      >
                        ({appointment.rating}/5)
                      </Typography>
                    </Box>
                    {appointment.feedback && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#6b7280", fontStyle: "italic" }}
                      >
                        "{appointment.feedback}"
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleViewDetails(appointment)}
                  sx={{ borderColor: "#10b981", color: "#10b981" }}
                >
                  Chi tiết
                </Button>
                {appointment.type === "online" &&
                  appointment.status !== "completed" && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VideoCallIcon />}
                      sx={{
                        background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1d4ed8, #1e40af)",
                        },
                      }}
                    >
                      Tham gia
                    </Button>
                  )}
                {appointment.status === "in-progress" && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={() =>
                      handleStatusUpdate(appointment.id, "completed")
                    }
                    sx={{
                      background: "linear-gradient(45deg, #10b981, #059669)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #059669, #047857)",
                      },
                    }}
                  >
                    Hoàn thành
                  </Button>
                )}
              </Box>
            </CardContent>
          </AppointmentCard>
        </Grid>
      ))}
    </Grid>
  );

  const tabLabels = ["Hôm nay", "Sắp tới", "Lịch sử"];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #2563eb, #3b82f6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Quản lý Lịch hẹn
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Quản lý và theo dõi tất cả các cuộc hẹn của bạn
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(45deg, #10b981, #059669)",
            "&:hover": {
              background: "linear-gradient(45deg, #059669, #047857)",
            },
          }}
        >
          Tạo lịch hẹn
        </Button>
      </Box>

      {/* Tabs */}
      <StyledPaper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#10b981 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#10b981",
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </StyledPaper>

      {/* Content */}
      <Box>
        {selectedTab === 0 && renderAppointmentsList(appointments.today)}
        {selectedTab === 1 && renderAppointmentsList(appointments.upcoming)}
        {selectedTab === 2 && renderAppointmentsList(appointments.history)}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(selectedAction)}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        {selectedAction?.status === "confirmed" && (
          <MenuItem
            onClick={() => handleStatusUpdate(selectedAction.id, "in-progress")}
          >
            <CheckIcon sx={{ mr: 1, fontSize: 18 }} />
            Bắt đầu tư vấn
          </MenuItem>
        )}
        {selectedAction?.status === "in-progress" && (
          <MenuItem
            onClick={() => handleStatusUpdate(selectedAction.id, "completed")}
          >
            <CheckIcon sx={{ mr: 1, fontSize: 18 }} />
            Hoàn thành
          </MenuItem>
        )}
        <MenuItem
          onClick={() => handleStatusUpdate(selectedAction?.id, "cancelled")}
        >
          <CloseIcon sx={{ mr: 1, fontSize: 18 }} />
          Hủy cuộc hẹn
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chi tiết cuộc hẹn - {selectedAppointment?.patient}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#4A5568", mb: 1 }}
                  >
                    Thông tin bệnh nhân
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Tên:</strong> {selectedAppointment.patient}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Tuổi:</strong> {selectedAppointment.age}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Điện thoại:</strong> {selectedAppointment.phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Email:</strong> {selectedAppointment.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#4A5568", mb: 1 }}
                  >
                    Thông tin cuộc hẹn
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Thời gian:</strong> {selectedAppointment.time}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Dịch vụ:</strong> {selectedAppointment.service}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Hình thức:</strong>{" "}
                    {selectedAppointment.type === "online"
                      ? "Trực tuyến"
                      : "Tại phòng khám"}
                  </Typography>
                  {selectedAppointment.location && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Địa điểm:</strong> {selectedAppointment.location}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ color: "#4A5568", mb: 2 }}>
                Ghi chú tư vấn
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Nhập ghi chú về cuộc tư vấn..."
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={handleSaveNotes}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            Lưu ghi chú
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultantAppointmentsContent;

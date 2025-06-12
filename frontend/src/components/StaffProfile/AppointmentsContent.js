/**
 * AppointmentsContent.js - Staff Appointments Management
 *
 * Mục đích:
 * - Quản lý lịch hẹn từ phía nhân viên
 * - Xem, xác nhận, và cập nhật trạng thái lịch hẹn
 * - Medical theme với glass morphism design
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
// Import dateUtils for consistent date formatting
import { formatDateDisplay } from "../../utils/dateUtils.js";

const AppointmentsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data - thay thế bằng data từ API
  const appointments = [
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientPhone: "0123456789",
      patientEmail: "a.nguyen@email.com",
      service: "Khám tổng quát",
      date: "2025-06-06",
      time: "09:00",
      status: "confirmed",
      notes: "Khám định kỳ",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      patientPhone: "0987654321",
      patientEmail: "b.tran@email.com",
      service: "Siêu âm thai",
      date: "2025-06-06",
      time: "10:30",
      status: "pending",
      notes: "Khám thai 20 tuần",
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      patientPhone: "0369852147",
      patientEmail: "c.le@email.com",
      service: "Tư vấn dinh dưỡng",
      date: "2025-06-06",
      time: "14:00",
      status: "cancelled",
      notes: "Hủy do bận việc",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      case "completed":
        return "#6366F1";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const AppointmentCard = ({ appointment }) => (
    <Card
      sx={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(74, 144, 226, 0.08)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            {appointment.patientName[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#2D3748",
                mb: 0.5,
              }}
            >
              {appointment.patientName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mb: 1,
              }}
            >
              {appointment.service}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              {" "}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  {formatDateDisplay(appointment.date)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TimeIcon sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  {appointment.time}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  {appointment.patientPhone}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={getStatusText(appointment.status)}
              size="small"
              sx={{
                background: `${getStatusColor(appointment.status)}20`,
                color: getStatusColor(appointment.status),
                fontWeight: 600,
              }}
            />
            <IconButton
              size="small"
              onClick={() => {
                setSelectedAppointment(appointment);
                setDialogOpen(true);
              }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>
        {appointment.notes && (
          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              fontStyle: "italic",
              p: 2,
              background: "rgba(74, 144, 226, 0.05)",
              borderRadius: "8px",
            }}
          >
            Ghi chú: {appointment.notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#2D3748",
            mb: 1,
          }}
        >
          Quản lý lịch hẹn
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748B",
          }}
        >
          Xem và quản lý tất cả lịch hẹn của bệnh nhân
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.08)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748B" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              sx={{
                borderRadius: "12px",
                borderColor: "rgba(74, 144, 226, 0.3)",
              }}
            >
              Lọc
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        {[
          { value: "all", label: "Tất cả" },
          { value: "pending", label: "Chờ xác nhận" },
          { value: "confirmed", label: "Đã xác nhận" },
          { value: "cancelled", label: "Đã hủy" },
          { value: "completed", label: "Hoàn thành" },
        ].map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              setSelectedFilter(option.value);
              setFilterAnchor(null);
            }}
            selected={selectedFilter === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Appointments List */}
      <Grid container spacing={2}>
        {appointments.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <AppointmentCard appointment={appointment} />
          </Grid>
        ))}
      </Grid>

      {/* Appointment Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedAppointment.patientName}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Dịch vụ:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAppointment.service}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={getStatusText(selectedAppointment.status)}
                    size="small"
                    sx={{
                      background: `${getStatusColor(
                        selectedAppointment.status
                      )}20`,
                      color: getStatusColor(selectedAppointment.status),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  {" "}
                  <Typography variant="body2" color="textSecondary">
                    Ngày:
                  </Typography>
                  <Typography variant="body1">
                    {formatDateDisplay(selectedAppointment.date)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Giờ:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAppointment.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Số điện thoại:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAppointment.patientPhone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAppointment.patientEmail}
                  </Typography>
                </Grid>
                {selectedAppointment.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Ghi chú:
                    </Typography>
                    <Typography variant="body1">
                      {selectedAppointment.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
          {selectedAppointment?.status === "pending" && (
            <>
              <Button
                startIcon={<CheckIcon />}
                variant="contained"
                sx={{
                  background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                }}
              >
                Xác nhận
              </Button>
              <Button
                startIcon={<CancelIcon />}
                color="error"
                variant="outlined"
              >
                Hủy
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsContent;

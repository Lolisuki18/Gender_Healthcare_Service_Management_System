/**
 * AppointmentsContent.js - Component quản lý lịch hẹn khám bệnh
 *
 * Chức năng:
 * - Hiển thị danh sách lịch hẹn hiện có
 * - Phân loại theo trạng thái (upcoming, completed, cancelled)
 * - Thông tin chi tiết mỗi cuộc hẹn (bác sĩ, thời gian, địa điểm)
 * - Status indicators với color coding
 * - Responsive card layout
 *
 * Features:
 * - Filter theo trạng thái lịch hẹn
 * - Card-based design cho easy scanning
 * - Color-coded status chips
 * - Doctor và clinic information
 * - Date/time formatting
 *
 * Design Pattern:
 * - Grid system cho responsive layout
 * - Card components với glass morphism
 * - Status chips với conditional styling
 * - Icon integration cho visual cues
 *
 * Data Structure:
 * - appointmentData: Array của appointment objects
 * - Mỗi appointment có: id, date, time, doctor, status, location
 */

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
// Import dateUtils for consistent date formatting
import { formatDateDisplay } from "../../utils/dateUtils.js";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)",
  color: "#2D3748",
  boxShadow: "0 8px 32px 0 rgba(74, 144, 226, 0.1)",
}));

const AppointmentCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #FFFFFF, #F5F7FA)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(74, 144, 226, 0.12)",
  color: "#2D3748",
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px 0 rgba(74, 144, 226, 0.2)",
  },
}));

const AppointmentsContent = () => {
  // Mock data - thay thế bằng API call thực tế
  const appointments = [
    {
      id: 1,
      title: "Khám tổng quát",
      doctor: "Bác sĩ Nguyễn Văn A",
      date: "2024-12-15",
      time: "09:00 AM",
      location: "Phòng khám 101",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Tư vấn dinh dưỡng",
      doctor: "Bác sĩ Trần Thị B",
      date: "2024-12-18",
      time: "02:30 PM",
      location: "Phòng khám 205",
      status: "pending",
    },
    {
      id: 3,
      title: "Khám tim mạch",
      doctor: "Bác sĩ Lê Văn C",
      date: "2024-12-20",
      time: "10:15 AM",
      location: "Phòng khám 303",
      status: "completed",
    },
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "linear-gradient(45deg, #4CAF50, #2ECC71)";
      case "pending":
        return "linear-gradient(45deg, #F39C12, #E67E22)";
      case "completed":
        return "linear-gradient(45deg, #4A90E2, #1ABC9C)";
      default:
        return "linear-gradient(45deg, #607D8B, #455A64)";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <StyledPaper sx={{ p: 4, mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#2D3748", // Dark text for readability
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          <CalendarIcon sx={{ mr: 2, color: "#4A90E2", fontSize: 32 }} />{" "}
          {/* Medical blue */}
          Lịch hẹn của tôi
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4A5568", // Dark blue-gray for text
            fontSize: "16px",
          }}
        >
          Quản lý và theo dõi các cuộc hẹn khám bệnh của bạn
        </Typography>
      </StyledPaper>

      {/* Appointments List */}
      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.id}>
            <AppointmentCard>
              <CardContent sx={{ p: 3 }}>
                {/* Status Badge */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#2D3748", // Dark text for readability
                      fontSize: "18px",
                    }}
                  >
                    {appointment.title}
                  </Typography>
                  <Chip
                    label={getStatusText(appointment.status)}
                    size="small"
                    sx={{
                      background: getStatusColor(appointment.status),
                      color: "#fff", // White text on colored background has good contrast
                      fontWeight: 500,
                      fontSize: "11px",
                    }}
                  />
                </Box>

                {/* Doctor Info */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <DoctorIcon sx={{ color: "#4A90E2", fontSize: 18, mr: 1 }} />{" "}
                  {/* Medical green */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {appointment.doctor}
                  </Typography>
                </Box>

                {/* Date & Time */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarIcon
                    sx={{ color: "#4CAF50", fontSize: 18, mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {formatDateDisplay(appointment.date)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TimeIcon sx={{ color: "#F39C12", fontSize: 18, mr: 1 }} />{" "}
                  {/* Medical orange */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {appointment.time}
                  </Typography>
                </Box>

                {/* Location */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon
                    sx={{ color: "#1ABC9C", fontSize: 18, mr: 1 }}
                  />{" "}
                  {/* Medical teal */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for text
                      fontWeight: 500,
                    }}
                  >
                    {appointment.location}
                  </Typography>
                </Box>
              </CardContent>
            </AppointmentCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {appointments.length === 0 && (
        <StyledPaper sx={{ p: 6, textAlign: "center" }}>
          <CalendarIcon
            sx={{ fontSize: 64, color: "rgba(74, 144, 226, 0.3)", mb: 2 }} // Light medical blue
          />
          <Typography
            variant="h5"
            sx={{
              color: "#2D3748", // Dark text for readability
              fontWeight: 600,
              mb: 1,
            }}
          >
            Chưa có lịch hẹn nào
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#4A5568", // Dark blue-gray for text
            }}
          >
            Hãy đặt lịch hẹn đầu tiên của bạn
          </Typography>
        </StyledPaper>
      )}
    </Box>
  );
};

export default AppointmentsContent;

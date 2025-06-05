import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  PersonAdd as PersonAddIcon,
  Psychology as PsychologyIcon,
  MedicalServices as MedicalIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
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

const StatCard = styled(Card)(({ theme }) => ({
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

const ConsultantDashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      appointments: 8,
      completedConsultations: 5,
      onlineConsultations: 3,
      newPatients: 2,
    },
    weeklyStats: {
      totalPatients: 45,
      consultationHours: 32,
      revenue: 15000000,
      avgRating: 4.8,
    },
    recentAppointments: [
      {
        id: 1,
        patient: "Nguyễn Văn A",
        time: "09:00",
        type: "Tư vấn chuyển đổi giới tính",
        status: "completed",
      },
      {
        id: 2,
        patient: "Trần Thị B",
        time: "10:30",
        type: "Kiểm tra sức khỏe",
        status: "in-progress",
      },
      {
        id: 3,
        patient: "Lê Văn C",
        time: "14:00",
        type: "Tư vấn tâm lý",
        status: "upcoming",
      },
    ],
    notifications: [
      {
        id: 1,
        message: "Bạn có 1 cuộc hẹn mới vào 15:00",
        time: "2 phút trước",
        type: "appointment",
      },
      {
        id: 2,
        message: "Nhận được đánh giá 5 sao từ bệnh nhân",
        time: "30 phút trước",
        type: "review",
      },
      {
        id: 3,
        message: "Thanh toán phí tư vấn đã được xử lý",
        time: "1 giờ trước",
        type: "payment",
      },
    ],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "upcoming":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Đã hoàn thành";
      case "in-progress":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp tới";
      default:
        return "Không xác định";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
          Tổng quan Consultant
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
        </Typography>
      </Box>

      {/* Today's Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                  width: 60,
                  height: 60,
                  margin: "0 auto 16px",
                }}
              >
                <ScheduleIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
              >
                {dashboardData.todayStats.appointments}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Lịch hẹn hôm nay
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(45deg, #10b981, #059669)",
                  width: 60,
                  height: 60,
                  margin: "0 auto 16px",
                }}
              >
                <AssignmentIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
              >
                {dashboardData.todayStats.completedConsultations}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tư vấn hoàn thành
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(45deg, #f59e0b, #d97706)",
                  width: 60,
                  height: 60,
                  margin: "0 auto 16px",
                }}
              >
                <VideoCallIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
              >
                {dashboardData.todayStats.onlineConsultations}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tư vấn online
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                  width: 60,
                  height: 60,
                  margin: "0 auto 16px",
                }}
              >
                <PersonAddIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
              >
                {dashboardData.todayStats.newPatients}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Bệnh nhân mới
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Weekly Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <StyledPaper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
            >
              Hiệu suất tuần này
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#3b82f6" }}
                  >
                    {dashboardData.weeklyStats.totalPatients}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Tổng bệnh nhân
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#10b981" }}
                  >
                    {dashboardData.weeklyStats.consultationHours}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Giờ tư vấn
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#f59e0b" }}
                  >
                    {formatCurrency(dashboardData.weeklyStats.revenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Doanh thu
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#8b5cf6", mr: 1 }}
                    >
                      {dashboardData.weeklyStats.avgRating}
                    </Typography>
                    <StarIcon sx={{ color: "#fbbf24", fontSize: 24 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Đánh giá TB
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
            >
              Thông báo mới
            </Typography>
            <List>
              {dashboardData.notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background:
                            notification.type === "appointment"
                              ? "linear-gradient(45deg, #3b82f6, #1d4ed8)"
                              : notification.type === "review"
                              ? "linear-gradient(45deg, #f59e0b, #d97706)"
                              : "linear-gradient(45deg, #10b981, #059669)",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {notification.type === "appointment" && (
                          <ScheduleIcon sx={{ fontSize: 16 }} />
                        )}
                        {notification.type === "review" && (
                          <StarIcon sx={{ fontSize: 16 }} />
                        )}
                        {notification.type === "payment" && (
                          <MoneyIcon sx={{ fontSize: 16 }} />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.time}
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#374151",
                      }}
                      secondaryTypographyProps={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    />
                  </ListItem>
                  {index < dashboardData.notifications.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <StyledPaper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Lịch hẹn gần đây
          </Typography>
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            Xem tất cả
          </Button>
        </Box>
        <List>
          {dashboardData.recentAppointments.map((appointment, index) => (
            <React.Fragment key={appointment.id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 2,
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                      fontWeight: 600,
                    }}
                  >
                    {appointment.patient.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {appointment.patient}
                      </Typography>
                      <Chip
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", mb: 0.5 }}
                      >
                        <TimeIcon
                          sx={{
                            fontSize: 14,
                            mr: 0.5,
                            verticalAlign: "middle",
                          }}
                        />
                        {appointment.time} - {appointment.type}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton
                  sx={{
                    background: "linear-gradient(45deg, #10b981, #059669)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(45deg, #059669, #047857)",
                    },
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </ListItem>
              {index < dashboardData.recentAppointments.length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </StyledPaper>
    </Box>
  );
};

export default ConsultantDashboardContent;

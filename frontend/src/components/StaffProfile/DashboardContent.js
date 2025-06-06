/**
 * DashboardContent.js - Staff Dashboard Overview
 *
 * Mục đích:
 * - Hiển thị tổng quan hoạt động của nhân viên
 * - Thống kê số liệu quan trọng
 * - Quick actions và shortcuts
 * - Medical theme với glass morphism design
 */

import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  IconButton,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

// Styled Card với medical glass effect
const StatsCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <Card
    sx={{
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(74, 144, 226, 0.08)",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            background: `linear-gradient(135deg, ${color}, ${color}aa)`,
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <Icon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2D3748",
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              mt: 0.5,
            }}
          >
            {title}
          </Typography>
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{
              background: trend.includes("+") ? "#10B981" : "#EF4444",
              color: "#fff",
              fontSize: "0.75rem",
            }}
          />
        )}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "#94A3B8",
          fontSize: "0.85rem",
        }}
      >
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

// Quick Action Button
const QuickActionButton = ({ title, icon: Icon, onClick, color }) => (
  <Button
    variant="outlined"
    onClick={onClick}
    sx={{
      border: `2px solid ${color}20`,
      borderRadius: "16px",
      p: 3,
      height: "auto",
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: `${color}10`,
        borderColor: `${color}40`,
        transform: "translateY(-2px)",
      },
    }}
  >
    <Box sx={{ textAlign: "center" }}>
      <Avatar
        sx={{
          background: `${color}15`,
          color: color,
          width: 48,
          height: 48,
          mx: "auto",
          mb: 2,
        }}
      >
        <Icon />
      </Avatar>
      <Typography
        variant="subtitle2"
        sx={{
          color: "#2D3748",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
    </Box>
  </Button>
);

const DashboardContent = () => {
  // Mock data - thay thế bằng data thật từ API
  const statsData = [
    {
      title: "Lịch hẹn hôm nay",
      value: "12",
      subtitle: "3 chờ xác nhận",
      icon: CalendarIcon,
      color: "#4A90E2",
      trend: "+5%",
    },
    {
      title: "Bệnh nhân đã phục vụ",
      value: "156",
      subtitle: "Tháng này",
      icon: PeopleIcon,
      color: "#1ABC9C",
      trend: "+12%",
    },
    {
      title: "Dịch vụ hoàn thành",
      value: "89",
      subtitle: "Tuần này",
      icon: HospitalIcon,
      color: "#E74C3C",
      trend: "+8%",
    },
    {
      title: "Thông báo mới",
      value: "5",
      subtitle: "Cần xem xét",
      icon: NotificationsIcon,
      color: "#F39C12",
      trend: "",
    },
  ];

  const recentActivities = [
    {
      time: "09:30",
      action: "Xác nhận lịch hẹn",
      patient: "Nguyễn Văn A",
      status: "completed",
    },
    {
      time: "10:15",
      action: "Cập nhật hồ sơ",
      patient: "Trần Thị B",
      status: "completed",
    },
    {
      time: "11:00",
      action: "Tư vấn trực tuyến",
      patient: "Lê Văn C",
      status: "in-progress",
    },
    {
      time: "14:30",
      action: "Đặt lịch khám",
      patient: "Phạm Thị D",
      status: "pending",
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#2D3748",
            mb: 1,
          }}
        >
          Chào mừng trở lại! 👋
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748B",
          }}
        >
          Hôm nay là một ngày tuyệt vời để chăm sóc sức khỏe bệnh nhân
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions & Recent Activities */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(74, 144, 226, 0.08)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#2D3748",
                  mb: 3,
                }}
              >
                Thao tác nhanh
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <QuickActionButton
                    title="Đặt lịch hẹn"
                    icon={CalendarIcon}
                    color="#4A90E2"
                    onClick={() => console.log("Đặt lịch hẹn")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionButton
                    title="Xem bệnh nhân"
                    icon={PeopleIcon}
                    color="#1ABC9C"
                    onClick={() => console.log("Xem bệnh nhân")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionButton
                    title="Dịch vụ"
                    icon={HospitalIcon}
                    color="#E74C3C"
                    onClick={() => console.log("Dịch vụ")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionButton
                    title="Thông báo"
                    icon={NotificationsIcon}
                    color="#F39C12"
                    onClick={() => console.log("Thông báo")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(74, 144, 226, 0.08)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#2D3748",
                  }}
                >
                  Hoạt động gần đây
                </Typography>
                <Button
                  size="small"
                  sx={{
                    color: "#4A90E2",
                    textTransform: "none",
                  }}
                >
                  Xem tất cả
                </Button>
              </Box>

              <Box>
                {recentActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 2,
                      borderBottom:
                        index < recentActivities.length - 1
                          ? "1px solid rgba(74, 144, 226, 0.08)"
                          : "none",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background:
                          activity.status === "completed"
                            ? "#10B981"
                            : activity.status === "in-progress"
                            ? "#F39C12"
                            : "#6B7280",
                        mr: 2,
                      }}
                    >
                      {activity.status === "completed" ? (
                        <CheckIcon sx={{ fontSize: 16 }} />
                      ) : activity.status === "in-progress" ? (
                        <TimeIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <WarningIcon sx={{ fontSize: 16 }} />
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#2D3748",
                          fontWeight: 600,
                        }}
                      >
                        {activity.action} - {activity.patient}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          fontSize: "0.85rem",
                        }}
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        activity.status === "completed"
                          ? "Hoàn thành"
                          : activity.status === "in-progress"
                          ? "Đang xử lý"
                          : "Chờ xử lý"
                      }
                      size="small"
                      sx={{
                        background:
                          activity.status === "completed"
                            ? "#10B98120"
                            : activity.status === "in-progress"
                            ? "#F39C1220"
                            : "#6B728020",
                        color:
                          activity.status === "completed"
                            ? "#10B981"
                            : activity.status === "in-progress"
                            ? "#F39C12"
                            : "#6B7280",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;

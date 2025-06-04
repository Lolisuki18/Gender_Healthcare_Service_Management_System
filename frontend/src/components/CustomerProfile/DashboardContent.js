/**
 * DashboardContent.js - Component hiển thị tổng quan dashboard cho khách hàng
 *
 * Chức năng:
 * - Hiển thị thống kê tổng quan (số lượng lịch hẹn, hóa đơn, etc.)
 * - Giao diện card-based với design hiện đại
 * - Progress bars và indicators trực quan
 * - Activity feed hiển thị hoạt động gần đây
 * - Glass morphism design với backdrop blur effects
 *
 * Design Pattern:
 * - Grid system responsive từ Material-UI
 * - Styled components với custom theming
 * - Card layout cho easy scanning của thông tin
 * - Color-coded statistics với gradient backgrounds
 *
 * UI Elements:
 * - Statistical cards với icons và numbers
 * - Progress indicators với percentages
 * - Activity timeline với timestamps
 * - Modern glass morphism styling
 */

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components cho glass morphism design
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)", // Light glass background for medical
  backdropFilter: "blur(20px)", // Blur effect
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)", // Lighter shadow
}));

// Statistical cards với gradient background
const StatCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #FFFFFF, #F5F7FA)", // Light card background
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(74, 144, 226, 0.12)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 25px 0 rgba(74, 144, 226, 0.2)", // Medical blue shadow
  },
}));

const DashboardContent = () => {
  const stats = [
    {
      title: "Tổng lịch hẹn",
      value: "12",
      icon: ScheduleIcon,
      color: "#4A90E2", // Medical blue
      progress: 75,
    },
    {
      title: "Lịch hẹn hoàn thành",
      value: "8",
      icon: AssignmentIcon,
      color: "#4CAF50", // Medical green
      progress: 65,
    },
    {
      title: "Lịch hẹn sắp tới",
      value: "3",
      icon: TrendingUpIcon,
      color: "#F39C12", // Medical orange
      progress: 40,
    },
    {
      title: "Tổng thanh toán",
      value: "2.5M VNĐ",
      icon: PaymentIcon,
      color: "#1ABC9C", // Medical teal
      progress: 85,
    },
  ];

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: "#2D3748", // Dark text
          background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical blue to teal
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Dashboard - Tổng quan
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        background: `${stat.color}15`, // Lighter background
                        border: `1px solid ${stat.color}30`,
                      }}
                    >
                      <IconComponent sx={{ color: stat.color, fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#2D3748", // Dark text for readability
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for text
                      mb: 2,
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "rgba(0, 0, 0, 0.05)", // Light background
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                        background: `linear-gradient(45deg, ${stat.color}, ${stat.color}cc)`,
                      },
                    }}
                  />
                </CardContent>
              </StatCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Activity */}
      <StyledPaper sx={{ p: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "#2D3748", // Dark text
            display: "flex",
            alignItems: "center",
          }}
        >
          <TrendingUpIcon sx={{ mr: 2, color: "#4A90E2" }} />{" "}
          {/* Medical blue */}
          Hoạt động gần đây
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            "Đặt lịch hẹn với Bác sĩ Nguyễn Văn A - 15/06/2025",
            "Hoàn thành thanh toán hóa đơn #001234 - 12/06/2025",
            "Cập nhật thông tin cá nhân - 10/06/2025",
            "Nhận thông báo kết quả khám từ Bác sĩ - 08/06/2025",
          ].map((activity, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(74, 144, 226, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(74, 144, 226, 0.05)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#4A5568", // Dark blue-gray for text
                  fontSize: "14px",
                }}
              >
                {activity}
              </Typography>
            </Box>
          ))}
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default DashboardContent;

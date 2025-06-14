/**
 * DashboardContent.js - Admin Dashboard Overview
 *
 * Trang tổng quan dành cho Admin với thống kê tổng thể về hệ thống
 */
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";

const StatCard = ({ title, value, icon: Icon, color, progress, subtitle }) => (
  <Card
    sx={{
      background: "rgba(255, 255, 255, 0.95)", // Medical glass effect
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(74, 144, 226, 0.15)", // Medical border
      borderRadius: 3,
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 32px rgba(74, 144, 226, 0.15)", // Medical shadow
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${color}, ${color}dd)`, // Medical gradient
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Icon sx={{ color: "#fff", fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2D3748", // Medical dark text
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#4A5568", mt: 0.5 }} // Medical muted text
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {progress && (
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(74, 144, 226, 0.1)", // Medical background
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
                borderRadius: 3,
              },
            }}
          />
        </Box>
      )}

      {subtitle && (
        <Typography
          variant="caption"
          sx={{ color: "#718096" }} // Medical muted text
        >
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const DashboardContent = () => {
  return (
    <Box>
      {/* Header với medical styling */}
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#2D3748", // Dark text for medical
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        <TrendingIcon sx={{ mr: 2, color: "#4A90E2", fontSize: 32 }} />
        Tổng quan hệ thống
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#4A5568", // Muted text for medical theme
          mb: 4,
          fontSize: "1rem",
        }}
      >
        Theo dõi và quản lý các hoạt động chính của hệ thống y tế
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Tổng người dùng"
            value="1,234"
            icon={PeopleIcon}
            color="#4A90E2" // Medical blue
            progress={75}
            subtitle="+12% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Dịch vụ đang hoạt động"
            value="56"
            icon={MedicalIcon}
            color="#4CAF50" // Medical green
            progress={85}
            subtitle="8 dịch vụ mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Lịch hẹn hôm nay"
            value="89"
            icon={AssignmentIcon}
            color="#F39C12" // Medical orange
            progress={60}
            subtitle="15 lịch hẹn mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Doanh thu tháng"
            value="2.1M"
            icon={TrendingIcon}
            color="#1ABC9C" // Medical teal
            progress={90}
            subtitle="+25% so với tháng trước"
          />
        </Grid>
      </Grid>

      {/* Activity Section */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: "#2D3748", // Dark text
            fontWeight: 600,
          }}
        >
          Hoạt động gần đây
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          <Chip
            label="Người dùng mới: +15"
            size="small"
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              color: "#fff",
            }}
          />
          <Chip
            label="Lịch hẹn hoàn thành: 234"
            size="small"
            sx={{
              background: "linear-gradient(45deg, #4CAF50, #2ECC71)",
              color: "#fff",
            }}
          />
          <Chip
            label="Phản hồi tích cực: 98%"
            size="small"
            sx={{
              background: "linear-gradient(45deg, #1ABC9C, #16A085)",
              color: "#fff",
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "#4A5568" }} // Muted text for medical theme
        >
          Hệ thống đang hoạt động ổn định. Tất cả các dịch vụ y tế đang được vận
          hành bình thường.
        </Typography>
      </Card>
    </Box>
  );
};

export default DashboardContent;

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
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(74, 144, 226, 0.15)",
      borderRadius: 3,
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 20px 40px rgba(74, 144, 226, 0.15)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            background: `linear-gradient(45deg, ${color}, ${color}95)`,
            borderRadius: 2,
            p: 1.5,
            mr: 2,
          }}
        >
          <Icon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2D3748" }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: "#718096" }}>
            {title}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "#4A5568", mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      {progress && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            background: "rgba(74, 144, 226, 0.1)",
            "& .MuiLinearProgress-bar": {
              background: `linear-gradient(90deg, ${color}, ${color}95)`,
            },
          }}
        />
      )}
    </CardContent>
  </Card>
);

const DashboardContent = () => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#2D3748",
          fontWeight: 600,
        }}
      >
        Tổng quan hệ thống
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Tổng người dùng"
            value="1,234"
            icon={PeopleIcon}
            color="#4A90E2"
            progress={75}
            subtitle="+12% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Dịch vụ đang hoạt động"
            value="56"
            icon={MedicalIcon}
            color="#1ABC9C"
            progress={85}
            subtitle="8 dịch vụ mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Lịch hẹn hôm nay"
            value="89"
            icon={AssignmentIcon}
            color="#F39C12"
            progress={60}
            subtitle="Còn 35 lịch chờ"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Doanh thu tháng"
            value="2.5M"
            icon={TrendingIcon}
            color="#E67E22"
            progress={90}
            subtitle="+23% so với tháng trước"
          />
        </Grid>
      </Grid>

      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#2D3748", fontWeight: 600 }}
          >
            Hoạt động gần đây
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            <Chip
              label="Người dùng mới: +15"
              color="primary"
              size="small"
              sx={{ background: "linear-gradient(45deg, #4A90E2, #1ABC9C)" }}
            />
            <Chip
              label="Lịch hẹn hoàn thành: 234"
              color="success"
              size="small"
            />
            <Chip label="Phản hồi tích cực: 98%" color="info" size="small" />
          </Box>

          <Typography variant="body2" sx={{ color: "#718096" }}>
            Hệ thống đang hoạt động ổn định. Tất cả các dịch vụ y tế đang được
            vận hành bình thường.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardContent;

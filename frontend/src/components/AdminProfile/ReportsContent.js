/**
 * ReportsContent.js - Admin Reports and Analytics
 *
 * Trang báo cáo và thống kê cho Admin
 */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";

const MetricCard = ({ title, value, change, icon: Icon, color }) => (
  <Card
    sx={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(74, 144, 226, 0.15)",
      borderRadius: 3,
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 32px rgba(74, 144, 226, 0.15)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${color}, ${color}dd)`,
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
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#2D3748",
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: "#4A5568", mt: 0.5 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="caption"
          sx={{
            color: change > 0 ? "#4CAF50" : "#F44336",
            fontWeight: 600,
          }}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </Typography>
        <Typography variant="caption" sx={{ color: "#718096", ml: 1 }}>
          so với tháng trước
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const ReportsContent = () => {
  const [timeRange, setTimeRange] = useState("thisMonth");

  const metrics = [
    {
      title: "Tổng người dùng",
      value: "1,234",
      change: 12.5,
      icon: PeopleIcon,
      color: "#4A90E2",
    },
    {
      title: "Lịch hẹn",
      value: "856",
      change: 8.2,
      icon: AssignmentIcon,
      color: "#4CAF50",
    },
    {
      title: "Doanh thu",
      value: "45.2M",
      change: 15.7,
      icon: MoneyIcon,
      color: "#F39C12",
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: "94.2%",
      change: 2.1,
      icon: TrendingUpIcon,
      color: "#E67E22",
    },
  ];

  const topServices = [
    { name: "Tư vấn chuyển đổi giới tính", bookings: 156, revenue: "78M" },
    { name: "Kiểm tra sức khỏe tổng quát", bookings: 134, revenue: "67M" },
    { name: "Tư vấn tâm lý", bookings: 98, revenue: "39M" },
    { name: "Điều trị hormone", bookings: 67, revenue: "33M" },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#2D3748",
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          <TrendingUpIcon sx={{ mr: 2, color: "#4A90E2", fontSize: 32 }} />
          Báo cáo & Thống kê
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4A5568",
            mb: 3,
            fontSize: "1rem",
          }}
        >
          Phân tích hiệu suất và xu hướng hoạt động của hệ thống
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Khoảng thời gian</InputLabel>
            <Select
              value={timeRange}
              label="Khoảng thời gian"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4A90E2",
                  },
                },
              }}
            >
              <MenuItem value="thisWeek">Tuần này</MenuItem>
              <MenuItem value="thisMonth">Tháng này</MenuItem>
              <MenuItem value="thisQuarter">Quý này</MenuItem>
              <MenuItem value="thisYear">Năm này</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              borderRadius: 2,
            }}
          >
            Xuất báo cáo
          </Button>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Top Services */}
        <Grid item xs={12} lg={8}>
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
                Dịch vụ phổ biến nhất
              </Typography>

              <TableContainer
                component={Paper}
                sx={{ background: "transparent" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                        Dịch vụ
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                        Lượt đặt
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                        Doanh thu
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                        Tỷ lệ
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topServices.map((service, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#2D3748" }}>
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#2D3748" }}>
                            {service.bookings}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#2D3748" }}>
                            {service.revenue}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={(service.bookings / 200) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "rgba(74, 144, 226, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#4A90E2",
                                borderRadius: 3,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(74, 144, 226, 0.15)",
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "#2D3748", fontWeight: 600 }}
              >
                Tổng quan hiệu suất
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    Người dùng hoạt động
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 600 }}
                  >
                    87.2%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={87.2}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(74, 144, 226, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #4A90E2, #1ABC9C)",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    Lịch hẹn hoàn thành
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 600 }}
                  >
                    94.2%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={94.2}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(76, 175, 80, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      background: "#4CAF50",
                    },
                  }}
                />
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    Mục tiêu doanh thu
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 600 }}
                  >
                    68%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={68}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(243, 156, 18, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      background: "#F39C12",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsContent;

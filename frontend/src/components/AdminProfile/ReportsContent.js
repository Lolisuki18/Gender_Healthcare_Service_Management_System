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
        transform: "translateY(-2px)",
        boxShadow: "0 10px 30px rgba(74, 144, 226, 0.15)",
      },
    }}
  >
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
            background: `linear-gradient(45deg, ${color}, ${color}95)`,
            borderRadius: 2,
            p: 1,
          }}
        >
          <Icon sx={{ color: "#fff", fontSize: 24 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: change >= 0 ? "#4CAF50" : "#F44336",
            fontWeight: 600,
          }}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </Typography>
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "#2D3748", mb: 1 }}
      >
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: "#718096" }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const ReportsContent = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Mock data
  const metrics = [
    {
      title: "Người dùng mới",
      value: "234",
      change: 12.5,
      icon: PeopleIcon,
      color: "#4A90E2",
    },
    {
      title: "Lịch hẹn",
      value: "1,456",
      change: 8.3,
      icon: AssignmentIcon,
      color: "#1ABC9C",
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
    { name: "Phẫu thuật thẩm mỹ", bookings: 23, revenue: "46M" },
  ];

  const handleExport = () => {
    // Implement export logic
    console.log("Exporting report...");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#2D3748",
            fontWeight: 600,
          }}
        >
          Báo cáo và thống kê
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Thời gian</InputLabel>
            <Select
              value={timeRange}
              label="Thời gian"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                // Tùy chỉnh màu nền và border
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4A90E2",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4A90E2",
                  },
                },
                // Tùy chỉnh dropdown menu
                "& .MuiSelect-select": {
                  color: "#2D3748",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(74, 144, 226, 0.2)",
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    "& .MuiMenuItem-root": {
                      color: "#2D3748",
                      "&:hover": {
                        backgroundColor: "rgba(74, 144, 226, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(74, 144, 226, 0.15)",
                        color: "#4A90E2",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "rgba(74, 144, 226, 0.2)",
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="week">Tuần này</MenuItem>
              <MenuItem value="month">Tháng này</MenuItem>
              <MenuItem value="quarter">Quý này</MenuItem>
              <MenuItem value="year">Năm này</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
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
                          <Typography
                            variant="body2"
                            sx={{ color: "#2D3748", fontWeight: 500 }}
                          >
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#718096" }}>
                            {service.bookings}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#718096" }}>
                            {service.revenue}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={(service.bookings / 156) * 100}
                              sx={{
                                width: 60,
                                height: 6,
                                borderRadius: 3,
                                background: "rgba(74, 144, 226, 0.1)",
                                "& .MuiLinearProgress-bar": {
                                  background:
                                    "linear-gradient(90deg, #4A90E2, #1ABC9C)",
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#718096" }}
                            >
                              {Math.round((service.bookings / 156) * 100)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(74, 144, 226, 0.15)",
              borderRadius: 3,
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "#2D3748", fontWeight: 600 }}
              >
                Thống kê nhanh
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
                    Khách hàng mới
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 600 }}
                  >
                    234
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
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

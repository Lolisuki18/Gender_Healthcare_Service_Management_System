/**
 * PaymentHistoryContent.js - Component quản lý lịch sử thanh toán
 *
 * Chức năng:
 * - Hiển thị danh sách giao dịch thanh toán
 * - Thông tin chi tiết từng giao dịch (số tiền, phương thức, ngày)
 * - Status tracking (pending, completed, failed)
 * - Download receipt/invoice functionality
 * - Filter và search capabilities
 *
 * Features:
 * - Transaction timeline với chronological order
 * - Payment method icons (card, bank transfer, etc.)
 * - Amount formatting với currency display
 * - Status indicators với color coding
 * - Action buttons (view details, download)
 *
 * Design:
 * - Card-based layout cho mỗi transaction
 * - Glass morphism styling
 * - Responsive grid system
 * - Interactive hover effects
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
  Button,
  Divider,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)", // Light glass background for medical
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)", // Lighter shadow
}));

const PaymentCard = styled(Card)(({ theme }) => ({
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

const PaymentHistoryContent = () => {
  const paymentHistory = [
    {
      id: "PAY001",
      date: "2025-05-28",
      amount: 500000,
      service: "Khám tổng quát định kỳ",
      method: "Thẻ tín dụng",
      status: "Hoàn thành",
      doctor: "Bác sĩ Nguyễn Thị Mai",
      invoiceId: "INV001",
    },
    {
      id: "PAY002",
      date: "2025-05-15",
      amount: 300000,
      service: "Tư vấn dinh dưỡng",
      method: "Chuyển khoản",
      status: "Hoàn thành",
      doctor: "Bác sĩ Trần Văn Nam",
      invoiceId: "INV002",
    },
    {
      id: "PAY003",
      date: "2025-04-20",
      amount: 800000,
      service: "Khám chuyên khoa tim mạch",
      method: "Tiền mặt",
      status: "Hoàn thành",
      doctor: "Bác sĩ Lê Thị Hoa",
      invoiceId: "INV003",
    },
    {
      id: "PAY004",
      date: "2025-04-05",
      amount: 200000,
      service: "Xét nghiệm máu định kỳ",
      method: "Ví điện tử",
      status: "Đang xử lý",
      doctor: "Bác sĩ Phạm Minh Tuấn",
      invoiceId: "INV004",
    },
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "#4CAF50"; // Medical green
      case "Đang xử lý":
        return "#F39C12"; // Medical orange
      case "Thất bại":
        return "#E53E3E"; // Adjusted red
      default:
        return "#607D8B"; // Medical gray-blue
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "Thẻ tín dụng":
        return <CardIcon sx={{ fontSize: 18 }} />;
      case "Chuyển khoản":
        return <BankIcon sx={{ fontSize: 18 }} />;
      case "Tiền mặt":
        return <PaymentIcon sx={{ fontSize: 18 }} />;
      case "Ví điện tử":
        return <PaymentIcon sx={{ fontSize: 18 }} />;
      default:
        return <PaymentIcon sx={{ fontSize: 18 }} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const totalPaid = paymentHistory
    .filter((payment) => payment.status === "Hoàn thành")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: "#2D3748",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PaymentIcon sx={{ color: "#3b82f6", fontSize: 36, mr: 2 }} />
        Lịch sử thanh toán
      </Typography>
      <Typography variant="body1" sx={{ color: "#4A5568", mb: 4, ml: 6 }}>
        Quản lý và theo dõi các giao dịch thanh toán của bạn.
      </Typography>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <PaymentIcon sx={{ color: "#3b82f6", fontSize: 40, mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#3b82f6", mb: 1 }}>
              Tổng thanh toán
            </Typography>
            <Typography variant="h4" sx={{ color: "#2D3748", fontWeight: 700 }}>
              {formatCurrency(totalPaid)}
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <ReceiptIcon sx={{ color: "#10b981", fontSize: 40, mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#10b981", mb: 1 }}>
              Số giao dịch
            </Typography>
            <Typography variant="h4" sx={{ color: "#2D3748", fontWeight: 700 }}>
              {paymentHistory.length}
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <CardIcon sx={{ color: "#f59e0b", fontSize: 40, mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#f59e0b", mb: 1 }}>
              Giao dịch thành công
            </Typography>
            <Typography variant="h4" sx={{ color: "#2D3748", fontWeight: 700 }}>
              {paymentHistory.filter((p) => p.status === "Hoàn thành").length}
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Payment History List */}
      <Grid container spacing={3}>
        {paymentHistory.map((payment) => (
          <Grid item xs={12} key={payment.id}>
            <PaymentCard>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  {/* Payment Info */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PaymentIcon
                        sx={{ color: "#3b82f6", mr: 2, fontSize: 24 }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ color: "#2D3748", fontWeight: 600, mb: 0.5 }}
                        >
                          {payment.service}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#4A5568" }}>
                          Mã giao dịch: {payment.id}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ color: "#3b82f6", mr: 1 }}>
                        {getMethodIcon(payment.method)}
                      </Box>
                      <Typography variant="body2" sx={{ color: "#4A5568" }}>
                        {payment.method}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: "#4A5568" }}>
                      Bác sĩ: {payment.doctor}
                    </Typography>
                  </Grid>

                  {/* Amount and Status */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: { xs: "left", md: "center" } }}>
                      <Typography
                        variant="h5"
                        sx={{ color: "#2D3748", fontWeight: 700, mb: 1 }}
                      >
                        {formatCurrency(payment.amount)}
                      </Typography>
                      <Chip
                        label={payment.status}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(
                            payment.status
                          )}20`,
                          color: getStatusColor(payment.status),
                          border: `1px solid ${getStatusColor(
                            payment.status
                          )}40`,
                          fontWeight: 600,
                          mb: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#4A5568" }}>
                        {new Date(payment.date).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        size="small"
                        sx={{
                          borderColor: "#3b82f6",
                          color: "#3b82f6",
                          "&:hover": {
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                          },
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        size="small"
                        sx={{
                          borderColor: "#10b981",
                          color: "#10b981",
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                          },
                        }}
                      >
                        Tải hóa đơn
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </PaymentCard>
          </Grid>
        ))}
      </Grid>

      {/* Payment Methods Summary */}
      <StyledPaper sx={{ p: 4, mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "#2D3748", // Changed from #fff to dark color
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardIcon sx={{ mr: 2, color: "#3b82f6" }} />
          Phương thức thanh toán đã sử dụng
        </Typography>

        <Grid container spacing={2}>
          {["Thẻ tín dụng", "Chuyển khoản", "Tiền mặt", "Ví điện tử"].map(
            (method, index) => {
              const count = paymentHistory.filter(
                (p) => p.method === method
              ).length;
              return (
                <Grid item xs={6} md={3} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(59, 130, 246, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.1)",
                      textAlign: "center",
                    }}
                  >
                    <Box sx={{ color: "#3b82f6", mb: 1 }}>
                      {getMethodIcon(method)}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#4A5568", mb: 0.5 }}
                    >
                      {method}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#2D3748", fontWeight: 600 }}
                    >
                      {count} lần
                    </Typography>
                  </Box>
                </Grid>
              );
            }
          )}
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default PaymentHistoryContent;

/**
 * MedicalHistoryContent.js - Component quản lý lịch sử khám bệnh
 *
 * Chức năng:
 * - Hiển thị danh sách lịch sử khám bệnh
 * - Chi tiết từng lần khám (bác sĩ, ngày, chẩn đoán, đơn thuốc)
 * - Medical reports và test results
 * - Download medical documents
 * - Timeline view của medical history
 *
 * Features:
 * - Chronological medical timeline
 * - Doctor và clinic information
 * - Diagnosis và treatment details
 * - Prescription history
 * - Medical document management
 *
 * Data Display:
 * - Card layout cho mỗi medical record
 * - Status indicators cho treatment progress
 * - Download buttons cho medical reports
 * - Expandable sections cho detailed information
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
} from "@mui/material";
import {
  LocalHospital as HospitalIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  Description as ReportIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
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

const MedicalCard = styled(Card)(({ theme }) => ({
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

const MedicalHistoryContent = () => {
  const medicalRecords = [
    {
      id: 1,
      date: "2025-05-28",
      doctor: "Bác sĩ Nguyễn Thị Mai",
      diagnosis: "Khám tổng quát định kỳ",
      status: "Hoàn thành",
      type: "Khám tổng quát",
      notes: "Sức khỏe tốt, không có vấn đề bất thường",
    },
    {
      id: 2,
      date: "2025-05-15",
      doctor: "Bác sĩ Trần Văn Nam",
      diagnosis: "Tư vấn dinh dưỡng",
      status: "Hoàn thành",
      type: "Tư vấn",
      notes: "Cần điều chỉnh chế độ ăn uống",
    },
    {
      id: 3,
      date: "2025-04-20",
      doctor: "Bác sĩ Lê Thị Hoa",
      diagnosis: "Khám chuyên khoa tim mạch",
      status: "Hoàn thành",
      type: "Chuyên khoa",
      notes: "Theo dõi huyết áp thường xuyên",
    },
    {
      id: 4,
      date: "2025-04-05",
      doctor: "Bác sĩ Phạm Minh Tuấn",
      diagnosis: "Xét nghiệm máu định kỳ",
      status: "Hoàn thành",
      type: "Xét nghiệm",
      notes: "Các chỉ số trong giới hạn bình thường",
    },
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "#4CAF50"; // Medical green
      case "Đang xử lý":
        return "#F39C12"; // Medical orange
      case "Hủy":
        return "#E53E3E"; // Adjusted red
      default:
        return "#607D8B"; // Medical gray-blue
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Khám tổng quát":
        return "#4A90E2"; // Medical blue
      case "Chuyên khoa":
        return "#9B59B6"; // Medical purple
      case "Tư vấn":
        return "#1ABC9C"; // Medical teal
      case "Xét nghiệm":
        return "#F39C12"; // Medical orange
      default:
        return "#607D8B"; // Medical gray-blue
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      {" "}
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
        <CalendarIcon sx={{ color: "#3b82f6", fontSize: 36, mr: 2 }} />
        Lịch sử khám bệnh
      </Typography>
      <Typography variant="body1" sx={{ color: "#4A5568", mb: 4, ml: 6 }}>
        Quản lý và theo dõi các lần khám bệnh của bạn.
      </Typography>
      <Grid container spacing={3}>
        {medicalRecords.map((record) => (
          <Grid item xs={12} md={6} key={record.id}>
            <MedicalCard>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  {" "}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HospitalIcon
                      sx={{ color: "#4CAF50", mr: 1, fontSize: 24 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#2D3748",
                      }}
                    >
                      {record.diagnosis}
                    </Typography>
                  </Box>
                  <Chip
                    label={record.status}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(record.status)}20`,
                      color: getStatusColor(record.status),
                      border: `1px solid ${getStatusColor(record.status)}40`,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Doctor and Date */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    {" "}
                    <DoctorIcon
                      sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }}
                    />{" "}
                    <Typography variant="body2" sx={{ color: "#4A5568" }}>
                      {record.doctor}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TimeIcon sx={{ color: "#4A90E2", mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: "#4A5568" }}>
                      {new Date(record.date).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                </Box>

                {/* Type */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={record.type}
                    size="small"
                    sx={{
                      backgroundColor: `${getTypeColor(record.type)}20`,
                      color: getTypeColor(record.type),
                      border: `1px solid ${getTypeColor(record.type)}40`,
                      fontWeight: 500,
                    }}
                  />
                </Box>

                {/* Notes */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.9)", // Light background for contrast
                    border: "1px solid rgba(74, 144, 226, 0.1)", // Medical blue border
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <ReportIcon
                      sx={{ color: "#4A90E2", mr: 1, fontSize: 16 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4A5568", // Dark blue-gray for text
                        fontWeight: 600,
                      }}
                    >
                      Ghi chú
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for text
                      lineHeight: 1.5,
                    }}
                  >
                    {record.notes}
                  </Typography>
                </Box>

                {/* Action Button */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  sx={{
                    borderColor: "#4A90E2", // Medical blue
                    color: "#4A90E2", // Medical blue
                    fontWeight: 600,
                    borderRadius: "12px",
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(74, 144, 226, 0.1)", // Light medical blue
                      borderColor: "#3498DB", // Darker medical blue
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Tải báo cáo
                </Button>
              </CardContent>
            </MedicalCard>
          </Grid>
        ))}
      </Grid>
      {/* Summary Card */}{" "}
      <StyledPaper sx={{ p: 4, mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "#2D3748",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HospitalIcon sx={{ mr: 2, color: "#4CAF50" }} />
          Tóm tắt sức khỏe
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#10b981", mb: 1, fontWeight: 600 }}
              >
                Tổng số lần khám
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: "#10b981", fontWeight: 700 }}
              >
                {medicalRecords.length}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "rgba(59, 130, 246, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#3b82f6", mb: 1, fontWeight: 600 }}
              >
                Lần khám gần nhất
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#3b82f6", fontWeight: 600 }}
              >
                {new Date(medicalRecords[0]?.date).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
      <Box sx={{ mt: 4 }}>
        <StyledPaper sx={{ p: 4, minHeight: 120 }}>
          {/* Nội dung tuỳ chỉnh hoặc để trống */}
        </StyledPaper>
      </Box>
    </Box>
  );
};

export default MedicalHistoryContent;

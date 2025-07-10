/**
 * MyReviewsContent.js - Component quản lý đánh giá cho Consultant
 *
 * Chức năng:
 * 1. Hiển thị danh sách đánh giá từ bệnh nhân/khách hàng
 * 2. Xem chi tiết từng đánh giá
 * 3. Phản hồi đánh giá từ bệnh nhân/khách hàng
 * 4. Xem thống kê đánh giá (rating trung bình, số lượng)
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Rating,
  Avatar,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import reviewService from '../../services/reviewService';
import localStorageUtil from '../../utils/localStorage';
import { formatDateDisplay } from '../../utils/dateUtils';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(74, 144, 226, 0.1)",
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(74, 144, 226, 0.08)",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(74, 144, 226, 0.08)",
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s, box-shadow 0.2s",
  border: "1px solid rgba(74, 144, 226, 0.08)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(74, 144, 226, 0.15)",
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "#4A90E2",
    fontWeight: 600,
    fontSize: "14px",
    "&.Mui-focused": {
      color: "#4A90E2",
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(74, 144, 226, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "rgba(74, 144, 226, 0.4)",
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: "0 4px 16px rgba(74, 144, 226, 0.1)",
      transform: "translateY(-1px)",
    },
    "&.Mui-focused": {
      borderColor: "#4A90E2",
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: "0 6px 20px rgba(74, 144, 226, 0.2)",
      transform: "translateY(-2px)",
    },
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiSelect-select": {
    fontWeight: 600,
    color: "#2D3748",
    fontSize: "14px",
  },
}));

const MyReviewsContent = () => {
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState(null);
  const [consultantId, setConsultantId] = useState(null);

  // Get consultant ID from user profile
  useEffect(() => {
    const userData = localStorageUtil.get('userProfile')?.data;
    if (userData && userData.id) {
      setConsultantId(userData.id);
    }
  }, []);

  const fetchReviewsData = useCallback(async () => {
    if (!consultantId) return;
    
    setLoading(true);
    try {
      const response = await reviewService.getConsultantReviews(
        consultantId,
        currentPage,
        pageSize,
        sortBy,
        filterRating,
        null // Remove keyword parameter
      );
      
      if (response && response.content) {
        setReviews(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi tải dữ liệu đánh giá",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [consultantId, currentPage, pageSize, sortBy, filterRating]);

  const fetchStatisticsData = useCallback(async () => {
    if (!consultantId) return;
    
    try {
      const response = await reviewService.getConsultantRatingSummary(consultantId);
      
      if (response) {
        setStatistics({
          averageRating: response.averageRating || 0,
          totalReviews: response.totalRatings || 0,
          ratingDistribution: response.starDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Don't show error for statistics as it's not critical
    }
  }, [consultantId]);

  // Fetch reviews data when consultantId is available or filters change
  useEffect(() => {
    if (consultantId) {
      fetchReviewsData();
      fetchStatisticsData();
    }
  }, [consultantId, fetchReviewsData, fetchStatisticsData]);

  // Reset page to 0 when rating filter or sort changes
  useEffect(() => {
    if (currentPage > 0) {
      setCurrentPage(0);
    }
  }, [filterRating, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate percentage for rating bars
  const calculatePercentage = (count) => {
    return statistics.totalReviews > 0
      ? (count / statistics.totalReviews) * 100
      : 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Statistics Section */}
      <StyledPaper>
        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: 600, color: "#2D3748", textAlign: "center" }}
        >
          📊 Thống kê đánh giá của bạn
        </Typography>

        <Grid container spacing={4}>
          {/* Rating Overview */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 3,
                px: 2,
                bgcolor: "linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)",
                borderRadius: "16px",
                border: "1px solid rgba(74, 144, 226, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  bgcolor: "rgba(74, 144, 226, 0.03)",
                  borderRadius: "50%",
                },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #4A90E2 0%, #667eea 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                  fontSize: { xs: "3rem", md: "4rem" },
                }}
              >
                {statistics.averageRating.toFixed(1)}
              </Typography>

              <Rating
                value={statistics.averageRating}
                precision={0.5}
                readOnly
                size="large"
                icon={<StarIcon fontSize="inherit" sx={{ color: "#FFB400", filter: "drop-shadow(0 2px 4px rgba(255, 180, 0, 0.3))" }} />}
                emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: "#E2E8F0" }} />}
                sx={{ mb: 2 }}
              />

              <Typography variant="h6" sx={{ color: "#4A90E2", fontWeight: 600, mb: 1 }}>
                Điểm trung bình
              </Typography>
              
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "rgba(74, 144, 226, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: "20px",
                }}
              >
                <Typography variant="body1" sx={{ color: "#4A90E2", fontWeight: 600 }}>
                  {statistics.totalReviews}
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  lượt đánh giá
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Rating Distribution */}
          <Grid item xs={12} md={6}>
            <Box sx={{ px: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, color: "#2D3748", fontWeight: 600, textAlign: "center" }}>
                Phân bố đánh giá
              </Typography>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Box
                  key={rating}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", minWidth: 60 }}>
                    <Typography sx={{ mr: 1, width: "15px", color: "#2D3748", fontWeight: 600 }}>
                      {rating}
                    </Typography>
                    <StarIcon
                      sx={{ color: "#FFB400", fontSize: "18px", mr: 1 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      height: "12px",
                      bgcolor: "rgba(226, 232, 240, 0.6)",
                      borderRadius: "6px",
                      mr: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${calculatePercentage(
                          statistics.ratingDistribution[rating]
                        )}%`,
                        height: "100%",
                        background:
                          rating > 3
                            ? "linear-gradient(90deg, #48bb78 0%, #38a169 100%)"
                            : rating === 3
                            ? "linear-gradient(90deg, #ed8936 0%, #dd6b20 100%)"
                            : "linear-gradient(90deg, #f56565 0%, #e53e3e 100%)",
                        borderRadius: "6px",
                        transition: "width 0.6s ease-in-out",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      minWidth: 40,
                      textAlign: "center",
                      bgcolor: "rgba(74, 144, 226, 0.1)",
                      borderRadius: "12px",
                      px: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "14px", color: "#4A90E2", fontWeight: 600 }}
                    >
                      {statistics.ratingDistribution[rating]}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Reviews List */}
      <StyledPaper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#2D3748",
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #2D3748 0%, #4A90E2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            💬 Danh sách đánh giá ({reviews.length})
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2.5,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            {/* Rating Filter */}
            <StyledFormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel shrink={true}>Lọc theo sao</InputLabel>
              <Select
                value={filterRating || ""}
                label="Lọc theo sao"
                onChange={(e) => setFilterRating(e.target.value || null)}
                displayEmpty
                notched={true}
                renderValue={(value) => {
                  if (value === "" || value === null || value === undefined) {
                    return "Tất cả";
                  }
                  return `${value} sao`;
                }}
              >
                <MenuItem value="" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Tất cả</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value={5} sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon 
                          key={index}
                          sx={{ 
                            fontSize: 16, 
                            color: "#FFD700" 
                          }} 
                        />
                      ))}
                    </Box>
                    <Typography>5 sao</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value={4} sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                      {Array.from({ length: 4 }, (_, index) => (
                        <StarIcon 
                          key={index}
                          sx={{ 
                            fontSize: 16, 
                            color: "#FFD700" 
                          }} 
                        />
                      ))}
                    </Box>
                    <Typography>4 sao</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value={3} sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                      {Array.from({ length: 3 }, (_, index) => (
                        <StarIcon 
                          key={index}
                          sx={{ 
                            fontSize: 16, 
                            color: "#FFD700" 
                          }} 
                        />
                      ))}
                    </Box>
                    <Typography>3 sao</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value={2} sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                      {Array.from({ length: 2 }, (_, index) => (
                        <StarIcon 
                          key={index}
                          sx={{ 
                            fontSize: 16, 
                            color: "#FFD700" 
                          }} 
                        />
                      ))}
                    </Box>
                    <Typography>2 sao</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value={1} sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                      <StarIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: "#FFD700" 
                        }} 
                      />
                    </Box>
                    <Typography>1 sao</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </StyledFormControl>

            {/* Sort */}
            <StyledFormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>🕒</Typography>
                    <Typography>Mới nhất</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="oldest" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>📅</Typography>
                    <Typography>Cũ nhất</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="highest" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>📈</Typography>
                    <Typography>Điểm cao nhất</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="lowest" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>📉</Typography>
                    <Typography>Điểm thấp nhất</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </StyledFormControl>
          </Box>
        </Box>

        {reviews.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: "center", 
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(74, 144, 226, 0.1)",
                color: "#4A90E2",
                width: 80,
                height: 80,
                mb: 2,
              }}
            >
              <StarIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
              Chưa có đánh giá nào
            </Typography>
            <Typography variant="body1" sx={{ color: "#718096" }}>
              Bạn chưa nhận được đánh giá nào từ khách hàng.
            </Typography>
          </Box>
        ) : (
          <Box>
            {reviews.map((review) => (
              <StyledCard key={review.id}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={review.userAvatar && review.userAvatar !== "/img/avatar/default.jpg" ? review.userAvatar : undefined}
                        sx={{
                          bgcolor: review.userAvatar && review.userAvatar !== "/img/avatar/default.jpg" 
                            ? "transparent" 
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "#fff",
                          width: 56,
                          height: 56,
                          mr: 3,
                          fontSize: "24px",
                          fontWeight: 600,
                        }}
                      >
                        {!review.userAvatar || review.userAvatar === "/img/avatar/default.jpg" 
                          ? (review.userFullName || review.maskedUserName || review.customerName || 'KH').charAt(0).toUpperCase()
                          : undefined
                        }
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#2D3748", mb: 0.5 }}
                        >
                          {review.userFullName || review.maskedUserName || review.customerName || 'Khách hàng'}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}
                        >
                          <Chip
                            icon={
                              <MedicalIcon
                                sx={{ fontSize: "16px !important" }}
                              />
                            }
                            label={review.targetType === 'CONSULTANT' ? 'Tư vấn viên' : 
                                   review.targetType === 'STI_SERVICE' ? 'Dịch vụ STI' :
                                   review.targetType === 'STI_PACKAGE' ? 'Gói STI' :
                                   review.serviceType || 'Dịch vụ'}
                            size="small"
                            sx={{
                              bgcolor: "rgba(102, 126, 234, 0.1)",
                              color: "#667eea",
                              fontWeight: 600,
                              height: "28px",
                              borderRadius: "14px",
                              "& .MuiChip-icon": {
                                color: "#667eea",
                              },
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#718096",
                              bgcolor: "rgba(113, 128, 150, 0.1)",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "12px",
                            }}
                          >
                            <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                              {review.createdAt ? formatDateDisplay(review.createdAt) : review.date}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Additional Info Row */}
                        {(review.consultationId || review.stiTestId) && (
                          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {review.consultationId && (
                              <Chip
                                label={`Tư vấn #${review.consultationId}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: "rgba(74, 144, 226, 0.3)",
                                  color: "#4A90E2",
                                  fontSize: "11px",
                                  height: "24px",
                                }}
                              />
                            )}
                            {review.stiTestId && (
                              <Chip
                                label={`Test #${review.stiTestId}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: "rgba(139, 69, 19, 0.3)",
                                  color: "#8b4513",
                                  fontSize: "11px",
                                  height: "24px",
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="medium"
                        icon={
                          <StarIcon
                            fontSize="inherit"
                            sx={{ color: "#FFB400", filter: "drop-shadow(0 1px 2px rgba(255, 180, 0, 0.3))" }}
                          />
                        }
                        emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: "#E2E8F0" }} />}
                        sx={{ mb: 1 }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: "#4A90E2", 
                          fontWeight: 700,
                          fontSize: "18px",
                        }}
                      >
                        {review.rating}.0
                      </Typography>
                    </Box>
                  </Box>

                  <Box 
                    sx={{ 
                      mt: 3,
                      p: 3,
                      bgcolor: "rgba(74, 144, 226, 0.02)",
                      borderRadius: "12px",
                      border: "1px solid rgba(74, 144, 226, 0.08)",
                      borderLeft: "4px solid #4A90E2",
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: "#2D3748",
                        lineHeight: 1.6,
                        fontSize: "16px",
                        position: "relative",
                        "&::before": {
                          content: '"💬"',
                          marginRight: "8px",
                          fontSize: "18px",
                        },
                      }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>

                  {/* Staff Reply Section */}
                  {review.staffReply && (
                    <Box 
                      sx={{ 
                        mt: 2,
                        p: 3,
                        bgcolor: "rgba(16, 185, 129, 0.02)",
                        borderRadius: "12px",
                        border: "1px solid rgba(16, 185, 129, 0.08)",
                        borderLeft: "4px solid #10b981",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            color: "#10b981",
                            fontWeight: 600,
                            "&::before": {
                              content: '"↩️"',
                              marginRight: "8px",
                              fontSize: "16px",
                            },
                          }}
                        >
                          Phản hồi từ {review.repliedByName || 'Nhân viên'}
                        </Typography>
                        {review.repliedAt && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: "#9CA3AF",
                              ml: 2,
                              fontSize: "11px",
                            }}
                          >
                            {formatDateDisplay(review.repliedAt)}
                          </Typography>
                        )}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#2D3748",
                          lineHeight: 1.5,
                          fontSize: "14px",
                        }}
                      >
                        {review.staffReply}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, py: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={(event, value) => setCurrentPage(value - 1)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPagination-ul': {
                  '& .MuiPaginationItem-root': {
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: '1px solid rgba(74, 144, 226, 0.2)',
                    '&.Mui-selected': {
                      backgroundColor: '#4A90E2',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                      '&:hover': {
                        backgroundColor: '#3a7bc8',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(74, 144, 226, 0.1)',
                      borderColor: '#4A90E2',
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </StyledPaper>
    </Box>
  );
};

export default MyReviewsContent;

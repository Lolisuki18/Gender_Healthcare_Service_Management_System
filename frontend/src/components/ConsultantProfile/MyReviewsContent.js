/**
 * MyReviewsContent.js - Component quản lý đánh giá cho Consultant
 *
 * Chức năng:
 * 1. Hiển thị danh sách đánh giá từ bệnh nhân/khách hàng
 * 2. Xem chi tiết từng đánh giá
 * 3. Phản hồi đánh giá từ bệnh nhân/khách hàng
 * 4. Xem thống kê đánh giá (rating trung bình, số lượng)
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Rating,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Check as CheckIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// For API integration in the future:
// import consultantService from '../../services/consultantService';
// import imageUrl from '../../utils/imageUrl';

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

const MyReviewsContent = () => {
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // Fetch reviews data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Uncomment when API is ready
        // const reviewsData = await consultantService.getMyReviews();
        // const statisticsData = await consultantService.getReviewsStatistics();
        // setReviews(reviewsData);
        // setStatistics(statisticsData);

        // Mock data - thay thế bằng API thực khi tích hợp
        const mockReviews = [
          {
            id: 1,
            customerName: "Nguyễn Văn A",
            customerAvatar: null,
            serviceType: "Tư vấn STI",
            rating: 5,
            comment:
              "Bác sĩ tư vấn rất nhiệt tình, giải thích chi tiết và dễ hiểu. Tôi rất hài lòng với dịch vụ.",
            date: "2025-06-01",
            status: "answered",
            response:
              "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Rất vui khi biết bạn hài lòng!",
            responseDate: "2025-06-02",
          },
          {
            id: 2,
            customerName: "Trần Thị B",
            customerAvatar: null,
            serviceType: "Xét nghiệm STI",
            rating: 4,
            comment:
              "Dịch vụ tốt, chuyên gia giải thích rõ ràng về kết quả xét nghiệm. Chỉ đánh giá 4 sao vì thời gian chờ đợi hơi lâu.",
            date: "2025-05-28",
            status: "pending",
            response: null,
            responseDate: null,
          },
          {
            id: 3,
            customerName: "Lê Văn C",
            customerAvatar: null,
            serviceType: "Tư vấn sức khỏe sinh sản",
            rating: 5,
            comment:
              "Bác sĩ rất tận tâm và chuyên môn cao. Tôi đã nhận được nhiều thông tin hữu ích về sức khỏe sinh sản.",
            date: "2025-05-25",
            status: "pending",
            response: null,
            responseDate: null,
          },
          {
            id: 4,
            customerName: "Phạm Thị D",
            customerAvatar: null,
            serviceType: "Tư vấn STI",
            rating: 3,
            comment:
              "Dịch vụ tương đối ổn, nhưng tôi mong muốn bác sĩ có thể giải thích chi tiết hơn về các phương pháp điều trị.",
            date: "2025-05-20",
            status: "pending",
            response: null,
            responseDate: null,
          },
        ];

        const mockStatistics = {
          averageRating: 4.2,
          totalReviews: 25,
          ratingDistribution: {
            5: 15,
            4: 5,
            3: 3,
            2: 1,
            1: 1,
          },
        };

        setReviews(mockReviews);
        setStatistics(mockStatistics);
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
    };

    fetchData();
  }, []);

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setResponseText(review.response || "");
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedReview(null);
    setResponseText("");
  };

  const handleResponseSubmit = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      // Uncomment when API is ready
      // await consultantService.respondToReview(selectedReview.id, { response: responseText });

      // Update local state for now
      const updatedReviews = reviews.map((review) =>
        review.id === selectedReview.id
          ? {
              ...review,
              response: responseText,
              status: "answered",
              responseDate: new Date().toISOString().split("T")[0],
            }
          : review
      );

      setReviews(updatedReviews);
      setSnackbar({
        open: true,
        message: "Phản hồi đánh giá thành công!",
        severity: "success",
      });
      handleCloseDetail();
    } catch (error) {
      console.error("Error responding to review:", error);
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi gửi phản hồi",
        severity: "error",
      });
    }
  };

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
          sx={{ mb: 3, fontWeight: 600, color: "#2D3748" }}
        >
          Thống kê đánh giá
        </Typography>

        <Grid container spacing={3}>
          {/* Rating Overview */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#4A90E2",
                  mb: 1,
                }}
              >
                {statistics.averageRating.toFixed(1)}
              </Typography>

              <Rating
                value={statistics.averageRating}
                precision={0.5}
                readOnly
                size="large"
                icon={<StarIcon fontSize="inherit" sx={{ color: "#FFB400" }} />}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                sx={{ mb: 1 }}
              />

              <Typography variant="body1" sx={{ color: "#718096", mb: 2 }}>
                {statistics.totalReviews} đánh giá
              </Typography>
            </Box>
          </Grid>

          {/* Rating Distribution */}
          <Grid item xs={12} md={6}>
            <Box sx={{ px: 2 }}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Box
                  key={rating}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Typography sx={{ mr: 1, width: "15px", color: "#718096" }}>
                    {rating}
                  </Typography>
                  <StarIcon
                    sx={{ color: "#FFB400", fontSize: "16px", mr: 1 }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      height: "8px",
                      bgcolor: "rgba(74, 144, 226, 0.1)",
                      borderRadius: "4px",
                      mr: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${calculatePercentage(
                          statistics.ratingDistribution[rating]
                        )}%`,
                        height: "100%",
                        bgcolor:
                          rating > 3
                            ? "#4CAF50"
                            : rating === 3
                            ? "#FFC107"
                            : "#F44336",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{ width: "30px", fontSize: "12px", color: "#718096" }}
                  >
                    {statistics.ratingDistribution[rating]}
                  </Typography>
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
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2D3748" }}>
            Danh sách đánh giá
          </Typography>

          {/* Filter/Search option can be added here */}
          <TextField
            placeholder="Tìm kiếm đánh giá..."
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#718096", mr: 1 }} />,
            }}
            sx={{
              width: { xs: "100%", sm: "250px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                bgcolor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />
        </Box>

        {reviews.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" sx={{ color: "#718096" }}>
              Bạn chưa có đánh giá nào.
            </Typography>
          </Box>
        ) : (
          <Box>
            {reviews.map((review) => (
              <StyledCard key={review.id}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(74, 144, 226, 0.1)",
                          color: "#4A90E2",
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#2D3748" }}
                        >
                          {review.customerName}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            icon={
                              <MedicalIcon
                                sx={{ fontSize: "16px !important" }}
                              />
                            }
                            label={review.serviceType}
                            size="small"
                            sx={{
                              bgcolor: "rgba(74, 144, 226, 0.1)",
                              color: "#4A90E2",
                              fontWeight: 500,
                              height: "24px",
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#718096",
                            }}
                          >
                            <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            <Typography variant="caption">
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        icon={
                          <StarIcon
                            fontSize="inherit"
                            sx={{ color: "#FFB400" }}
                          />
                        }
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      />
                      <Chip
                        label={
                          review.status === "answered"
                            ? "Đã phản hồi"
                            : "Chưa phản hồi"
                        }
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor:
                            review.status === "answered"
                              ? "rgba(76, 175, 80, 0.1)"
                              : "rgba(255, 152, 0, 0.1)",
                          color:
                            review.status === "answered"
                              ? "#4CAF50"
                              : "#FF9800",
                          fontWeight: 500,
                          height: "24px",
                        }}
                        icon={
                          review.status === "answered" ? (
                            <CheckIcon sx={{ fontSize: "16px !important" }} />
                          ) : (
                            <ChatIcon sx={{ fontSize: "16px !important" }} />
                          )
                        }
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ color: "#2D3748" }}>
                      {review.comment}
                    </Typography>
                  </Box>

                  {review.response && (
                    <Box
                      sx={{
                        mt: 2,
                        ml: 7,
                        p: 2,
                        bgcolor: "rgba(74, 144, 226, 0.05)",
                        borderRadius: "8px",
                        borderLeft: "3px solid #4A90E2",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#4A90E2", mb: 0.5 }}
                      >
                        Phản hồi của bạn:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#2D3748" }}>
                        {review.response}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#718096", display: "block", mt: 1 }}
                      >
                        Ngày phản hồi: {review.responseDate}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleViewDetail(review)}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        bgcolor:
                          review.status === "pending"
                            ? "#4A90E2"
                            : "rgba(74, 144, 226, 0.1)",
                        color: review.status === "pending" ? "#fff" : "#4A90E2",
                        "&:hover": {
                          bgcolor:
                            review.status === "pending"
                              ? "#3a7bc8"
                              : "rgba(74, 144, 226, 0.2)",
                        },
                      }}
                    >
                      {review.status === "pending"
                        ? "Phản hồi ngay"
                        : "Xem chi tiết"}
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            ))}
          </Box>
        )}
      </StyledPaper>

      {/* Review Detail Dialog */}
      {selectedReview && (
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDetail}
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(74, 144, 226, 0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "rgba(74, 144, 226, 0.05)",
              borderBottom: "1px solid rgba(74, 144, 226, 0.12)",
              pb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#2D3748" }}>
              Chi tiết đánh giá
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(74, 144, 226, 0.1)",
                        color: "#4A90E2",
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#2D3748" }}
                      >
                        {selectedReview.customerName}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          icon={
                            <MedicalIcon sx={{ fontSize: "16px !important" }} />
                          }
                          label={selectedReview.serviceType}
                          size="small"
                          sx={{
                            bgcolor: "rgba(74, 144, 226, 0.1)",
                            color: "#4A90E2",
                            fontWeight: 500,
                            height: "24px",
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#718096",
                          }}
                        >
                          <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption">
                            {selectedReview.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Rating
                    value={selectedReview.rating}
                    readOnly
                    size="large"
                    icon={
                      <StarIcon fontSize="inherit" sx={{ color: "#FFB400" }} />
                    }
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(74, 144, 226, 0.02)",
                    borderRadius: "12px",
                    border: "1px solid rgba(74, 144, 226, 0.08)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2D3748", mb: 1 }}
                  >
                    Nội dung đánh giá
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#2D3748" }}>
                    {selectedReview.comment}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#2D3748", mb: 2 }}
                >
                  {selectedReview.status === "answered"
                    ? "Phản hồi của bạn"
                    : "Viết phản hồi"}
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Nhập phản hồi của bạn đối với đánh giá này..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                  disabled={selectedReview.status === "answered"}
                />
                {selectedReview.status === "answered" &&
                  selectedReview.responseDate && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#718096", display: "block", mt: 1 }}
                    >
                      Đã phản hồi vào ngày: {selectedReview.responseDate}
                    </Typography>
                  )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid rgba(74, 144, 226, 0.12)",
            }}
          >
            <Button
              onClick={handleCloseDetail}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                borderColor: "rgba(74, 144, 226, 0.5)",
                color: "#4A90E2",
              }}
            >
              Đóng
            </Button>
            {selectedReview.status !== "answered" && (
              <Button
                onClick={handleResponseSubmit}
                variant="contained"
                disabled={!responseText.trim()}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  bgcolor: "#4A90E2",
                  "&:hover": {
                    bgcolor: "#3a7bc8",
                  },
                }}
              >
                Gửi phản hồi
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default MyReviewsContent;

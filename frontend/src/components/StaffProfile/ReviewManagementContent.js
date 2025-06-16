/**
 * ReviewManagementContent.js
 *
 * Mục đích: Quản lý đánh giá từ khách hàng
 * - Hiển thị danh sách đánh giá
 * - Phản hồi đánh giá
 * - Quản lý trạng thái đánh giá
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from "@mui/material";
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const ReviewManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerId: 101,
      customerName: "Nguyễn Văn A",
      serviceId: 1,
      serviceName: "Xét nghiệm STI cơ bản",
      rating: 5,
      comment: "Dịch vụ rất chuyên nghiệp, nhân viên tư vấn tận tình",
      date: "2025-05-20",
      status: "published",
    },
    {
      id: 2,
      customerId: 102,
      customerName: "Trần Thị B",
      serviceId: 2,
      serviceName: "Xét nghiệm STI toàn diện",
      rating: 4,
      comment: "Dịch vụ tốt, giá cả hợp lý",
      date: "2025-06-01",
      status: "published",
    },
    {
      id: 3,
      customerId: 103,
      customerName: "Lê Văn C",
      serviceId: 1,
      serviceName: "Xét nghiệm STI cơ bản",
      rating: 3,
      comment: "Dịch vụ ổn nhưng thời gian chờ hơi lâu",
      date: "2025-06-05",
      status: "pending",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [response, setResponse] = useState("");

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenReplyDialog = (review) => {
    setCurrentReview(review);
    setResponse("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };

  const handleSubmitResponse = () => {
    // Logic phản hồi đánh giá
    setOpenDialog(false);
  };

  const handleApproveReview = (id) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { ...review, status: "published" } : review
    );
    setReviews(updatedReviews);
  };

  const handleRejectReview = (id) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { ...review, status: "rejected" } : review
    );
    setReviews(updatedReviews);
  };

  // Filter reviews dựa trên searchTerm
  const filteredReviews = reviews.filter(
    (review) =>
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đánh giá
      </Typography>

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm đánh giá..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: "40%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Reviews Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nhận xét</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.customerName}</TableCell>
                  <TableCell>{review.serviceName}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    {review.comment.length > 50
                      ? `${review.comment.substring(0, 50)}...`
                      : review.comment}
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(review.status)}
                      color={getStatusColor(review.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="info" onClick={() => {}}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={review.status === "rejected"}
                      onClick={() => handleOpenReplyDialog(review)}
                    >
                      <ReplyIcon />
                    </IconButton>
                    {review.status === "pending" && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApproveReview(review.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRejectReview(review.id)}
                        >
                          <BlockIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Reply Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Phản hồi đánh giá</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Khách hàng:</strong> {currentReview?.customerName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Dịch vụ:</strong> {currentReview?.serviceName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Đánh giá:</strong>{" "}
              <Rating
                value={currentReview?.rating || 0}
                readOnly
                size="small"
              />
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Nhận xét:</strong> {currentReview?.comment}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Phản hồi của bạn"
              margin="normal"
              value={response}
              onChange={handleResponseChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={!response.trim()}
          >
            Gửi phản hồi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewManagementContent;

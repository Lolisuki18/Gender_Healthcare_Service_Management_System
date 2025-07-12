/**
 * ReviewManagementContent.js
 *
 * Mục đích: Quản lý đánh giá từ khách hàng
 * - Hiển thị danh sách đánh giá
 * - Phản hồi đánh giá
 * - Quản lý trạng thái đánh giá
 * - Xóa đánh giá
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
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
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  StarBorder as StarBorderIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import reviewService from '../../services/reviewService';

const ReviewManagementContent = () => {
  const theme = useTheme();
  // Custom styles
  const pageStyles = {
    gradientBackground: {
      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
      borderRadius: '10px',
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    pageTitle: {
      color: '#fff',
      fontWeight: 600,
      marginBottom: theme.spacing(1),
    },
    pageSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
    },
    card: {
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
      overflow: 'hidden',
    },
    tableHead: {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
    tableHeadCell: {
      fontWeight: 600,
      color: theme.palette.primary.dark,
    },
    buttonGradient: {
      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
      color: '#fff',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.35)',
      },
      borderRadius: '20px',
      px: 3,
    },
  };
  // State management
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all'); // all, consultation, sti-service, sti-package
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [response, setResponse] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(false);

  // Fetch reviews data
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        page,
        size: rowsPerPage,
        sort: sortBy,
        filterRating: ratingFilter === 'all' ? null : ratingFilter,
        keyword: searchTerm || null,
      };

      switch (serviceFilter) {
        case 'consultation':
          response = await reviewService.getConsultationReviews(
            params.page,
            params.size,
            params.sort,
            params.filterRating,
            params.keyword
          );
          break;
        case 'sti-service':
          response = await reviewService.getSTIServiceReviewsForStaff(
            params.page,
            params.size,
            params.sort,
            params.filterRating,
            params.keyword
          );
          break;
        case 'sti-package':
          response = await reviewService.getSTIPackageReviewsForStaff(
            params.page,
            params.size,
            params.sort,
            params.filterRating,
            params.keyword
          );
          break;
        default:
          response = await reviewService.getAllReviews(
            params.page,
            params.size,
            params.sort,
            params.filterRating,
            params.keyword
          );
      }

      if (response && response.content) {
        setReviews(response.content);
        setTotalElements(response.totalElements);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi tải danh sách đánh giá: ' + error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortBy, ratingFilter, searchTerm, serviceFilter]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
    setResponse(review.staffReply || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };
  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập nội dung phản hồi',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      let result;
      const replyData = { staffReply: response };
      
      if (currentReview.staffReply) {
        // Update existing reply - sử dụng API riêng cho cập nhật
        result = await reviewService.updateReply(currentReview.ratingId, replyData);
        setSnackbar({
          open: true,
          message: 'Cập nhật phản hồi thành công!',
          severity: 'success',
        });
      } else {
        // Create new reply - sử dụng API riêng cho tạo mới
        result = await reviewService.createReply(currentReview.ratingId, replyData);
        setSnackbar({
          open: true,
          message: 'Phản hồi đã được gửi thành công!',
          severity: 'success',
        });
      }
      
      // Update current review with new data from API response
      if (result && result.data) {
        setCurrentReview(prev => ({
          ...prev,
          staffReply: result.data.staffReply || result.data.reply, // Handle both possible field names
          repliedAt: result.data.repliedAt,
          repliedByName: result.data.repliedByName
        }));
      }
      
      setOpenDialog(false);
      fetchReviews(); // Refresh data
    } catch (error) {
      console.error('Error submitting response:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi gửi phản hồi: ' + error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenViewDialog = (review) => {
    setCurrentReview(review);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleOpenDeleteDialog = (review) => {
    setCurrentReview(review);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteReview = async () => {
    if (!currentReview?.staffReply) {
      setSnackbar({
        open: true,
        message: 'Không có phản hồi để xóa',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      await reviewService.deleteStaffReply(currentReview.ratingId);
      setSnackbar({
        open: true,
        message: 'Đã xóa phản hồi thành công!',
        severity: 'success',
      });
      setOpenDeleteDialog(false);
      fetchReviews(); // Refresh data
    } catch (error) {
      console.error('Error deleting staff reply:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi xóa phản hồi: ' + error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleServiceFilterChange = (event) => {
    setServiceFilter(event.target.value);
    setPage(0);
  };

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(0);
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with gradient */}
      <Box sx={pageStyles.gradientBackground}>
        <Typography variant="h4" sx={pageStyles.pageTitle}>
          Quản lý đánh giá
        </Typography>
        <Typography variant="body1" sx={pageStyles.pageSubtitle}>
          Xem và phản hồi đánh giá từ khách hàng
        </Typography>
      </Box>

      {/* Toolbar */}
      <Card sx={{ ...pageStyles.card, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                placeholder="Tìm kiếm đánh giá..."
                value={searchTerm}
                onChange={handleSearch}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Loại dịch vụ</InputLabel>
                <Select
                  value={serviceFilter}
                  onChange={handleServiceFilterChange}
                  label="Loại dịch vụ"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="consultation">Tư vấn</MenuItem>
                  <MenuItem value="sti-service">Dịch vụ STI</MenuItem>
                  <MenuItem value="sti-package">Gói STI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Đánh giá</InputLabel>
                <Select
                  value={ratingFilter}
                  onChange={handleRatingFilterChange}
                  label="Đánh giá"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="5">5 sao</MenuItem>
                  <MenuItem value="4">4 sao</MenuItem>
                  <MenuItem value="3">3 sao</MenuItem>
                  <MenuItem value="2">2 sao</MenuItem>
                  <MenuItem value="1">1 sao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sắp xếp"
                >
                  <MenuItem value="newest">Mới nhất</MenuItem>
                  <MenuItem value="oldest">Cũ nhất</MenuItem>
                  <MenuItem value="highest">Điểm cao nhất</MenuItem>
                  <MenuItem value="lowest">Điểm thấp nhất</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box
                display="flex"
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {totalElements} đánh giá
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card sx={pageStyles.card}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={pageStyles.tableHead}>
              <TableRow>
                <TableCell sx={pageStyles.tableHeadCell}>ID</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Khách hàng</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Dịch vụ/Tư vấn viên</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Đánh giá</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Nhận xét</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Ngày</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Phản hồi</TableCell>
                <TableCell sx={pageStyles.tableHeadCell} align="right">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Đang tải dữ liệu...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy đánh giá nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.ratingId} hover>
                    <TableCell>{review.ratingId}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={review.userAvatar}
                          alt={review.userFullName}
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 1,
                            bgcolor: `${theme.palette.primary.main}`,
                          }}
                        >
                          {review.userFullName?.[0] || 'U'}
                        </Avatar>
                        {review.userFullName || 'Khách hàng'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {review.targetName || 'Dịch vụ không xác định'}
                    </TableCell>
                    <TableCell>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        sx={{ color: theme.palette.warning.main }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          review.comment.length > 30 ? review.comment : ''
                        }
                      >
                        <Typography variant="body2">
                          {review.comment.length > 30
                            ? `${review.comment.substring(0, 30)}...`
                            : review.comment}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(review.createdAt) 
                        ? new Date(review.createdAt[0], review.createdAt[1] - 1, review.createdAt[2]).toLocaleDateString('vi-VN')
                        : new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {review.staffReply ? (
                        <Chip
                          size="small"
                          label="Đã phản hồi"
                          color="info"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="Chưa phản hồi"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenViewDialog(review)}
                          sx={{
                            color: theme.palette.info.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!review.staffReply ? (
                        <Tooltip title="Phản hồi">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReplyDialog(review)}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.1
                                ),
                              },
                            }}
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip title="Sửa phản hồi">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenReplyDialog(review)}
                              sx={{
                                color: theme.palette.warning.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa phản hồi">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteDialog(review)}
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Divider />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Hiển thị:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trên ${count}`
            }
          />
        </TableContainer>
      </Card>

      {/* Reply Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
          }}
        >
          {currentReview?.staffReply ? 'Cập nhật phản hồi' : 'Phản hồi đánh giá'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: alpha(theme.palette.primary.light, 0.1),
              borderRadius: '8px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={currentReview?.userAvatar}
                    alt={currentReview?.userFullName}
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 1,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {currentReview?.userFullName?.[0] || 'U'}
                  </Avatar>
                  <Typography variant="h6">
                    {currentReview?.userFullName || 'Khách hàng'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Dịch vụ:</strong> {currentReview?.targetName || 'Dịch vụ không xác định'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Ngày:</strong> {currentReview?.createdAt 
                    ? (Array.isArray(currentReview.createdAt) 
                        ? new Date(currentReview.createdAt[0], currentReview.createdAt[1] - 1, currentReview.createdAt[2]).toLocaleDateString('vi-VN')
                        : new Date(currentReview.createdAt).toLocaleDateString('vi-VN'))
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>Đánh giá:</strong>
                </Typography>
                <Rating
                  value={currentReview?.rating || 0}
                  readOnly
                  size="large"
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  sx={{ color: theme.palette.warning.main }}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                p: 2,
                bgcolor: '#fff',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="body1">{currentReview?.comment}</Typography>
            </Box>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Phản hồi của bạn"
            margin="normal"
            value={response}
            onChange={handleResponseChange}
            placeholder="Nhập phản hồi chuyên nghiệp và tận tình tới khách hàng..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: '20px',
              px: 3,
            }}
          >
            Hủy
          </Button>{' '}
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={!response.trim() || loading}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              borderRadius: '20px',
              px: 3,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.35)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Gửi phản hồi'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '16px 16px 0 0',
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
            py: 2,
            px: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StarBorderIcon sx={{ fontSize: 32 }} />
            <span>Chi tiết đánh giá</span>
          </Box>
          <IconButton
            size="small"
            onClick={handleCloseViewDialog}
            sx={{ color: 'white', ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, pb: 3, px: { xs: 2, md: 5 }, bgcolor: '#F7FAFC' }}>
          <Grid container spacing={4}>
            {/* Thông tin khách hàng và dịch vụ */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                background: 'white',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
                p: 3,
                mb: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={currentReview?.userAvatar}
                    alt={currentReview?.userFullName}
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 28,
                      boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)'
                    }}
                  >
                    {currentReview?.userFullName?.[0] || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#2D3748' }}>
                      {currentReview?.userFullName || 'Khách hàng'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {currentReview?.userId || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Dịch vụ
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                  {currentReview?.targetName || 'Không xác định'}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Loại dịch vụ
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentReview?.targetType === 'CONSULTANT' && 'Tư vấn'}
                  {currentReview?.targetType === 'STI_SERVICE' && 'Dịch vụ STI'}
                  {currentReview?.targetType === 'STI_PACKAGE' && 'Gói STI'}
                  {!currentReview?.targetType && 'Không xác định'}
                </Typography>
                {currentReview?.targetId && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                      ID Dịch vụ/Tư vấn viên
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {currentReview.targetId}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            {/* Đánh giá và nội dung */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                background: 'white',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
                p: 3,
                mb: 2
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày đánh giá
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentReview?.createdAt 
                    ? (Array.isArray(currentReview.createdAt) 
                        ? new Date(currentReview.createdAt[0], currentReview.createdAt[1] - 1, currentReview.createdAt[2], currentReview.createdAt[3] || 0, currentReview.createdAt[4] || 0, currentReview.createdAt[5] || 0).toLocaleString('vi-VN')
                        : new Date(currentReview.createdAt).toLocaleString('vi-VN'))
                    : 'N/A'}
                </Typography>
                {currentReview?.updatedAt && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                      Cập nhật lần cuối
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {Array.isArray(currentReview.updatedAt) 
                        ? new Date(currentReview.updatedAt[0], currentReview.updatedAt[1] - 1, currentReview.updatedAt[2], currentReview.updatedAt[3] || 0, currentReview.updatedAt[4] || 0, currentReview.updatedAt[5] || 0).toLocaleString('vi-VN')
                        : new Date(currentReview.updatedAt).toLocaleString('vi-VN')}
                    </Typography>
                  </>
                )}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Đánh giá
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating
                    value={currentReview?.rating || 0}
                    readOnly
                    size="large"
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    sx={{ color: '#FFB400', mr: 1, fontSize: 32 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({currentReview?.rating || 0}/5 sao)
                  </Typography>
                </Box>
                {/* Quyền chỉnh sửa */}
                {typeof currentReview?.canEdit !== 'undefined' && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                      Quyền chỉnh sửa
                    </Typography>
                    <Chip
                      size="small"
                      label={currentReview.canEdit ? 'Có thể chỉnh sửa' : 'Không thể chỉnh sửa'}
                      color={currentReview.canEdit ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </>
                )}
              </Box>
            </Grid>
            {/* Nội dung đánh giá */}
            <Grid item xs={12}>
              <Box sx={{
                p: 3,
                mt: 1,
                bgcolor: '#F5F7FA',
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nội dung đánh giá
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {currentReview?.comment || 'Không có nội dung đánh giá'}
                </Typography>
              </Box>
            </Grid>
            {/* Phản hồi từ nhân viên */}
            {currentReview?.staffReply && (
              <Grid item xs={12}>
                <Box sx={{
                  p: 3,
                  mt: 1,
                  bgcolor: 'rgba(26, 188, 156, 0.08)',
                  borderRadius: 4,
                  border: '1px solid #1ABC9C',
                  boxShadow: '0 1px 3px rgba(26,188,156,0.07)'
                }}>
                  <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReplyIcon sx={{ fontSize: 18 }} /> Phản hồi từ nhân viên y tế
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {currentReview.staffReply}
                  </Typography>
                  {/* Thông tin người phản hồi */}
                  <Box sx={{ mt: 2, pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    {currentReview?.repliedByName && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Người phản hồi:</strong> {currentReview.repliedByName}
                        {currentReview?.repliedById && ` (ID: ${currentReview.repliedById})`}
                      </Typography>
                    )}
                    {currentReview?.repliedAt && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Thời gian phản hồi:</strong> {
                          Array.isArray(currentReview.repliedAt) 
                            ? new Date(currentReview.repliedAt[0], currentReview.repliedAt[1] - 1, currentReview.repliedAt[2], currentReview.repliedAt[3] || 0, currentReview.repliedAt[4] || 0, currentReview.repliedAt[5] || 0).toLocaleString('vi-VN')
                            : new Date(currentReview.repliedAt).toLocaleString('vi-VN')
                        }
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
            {/* Thông tin bổ sung */}
            {currentReview?.maskedUserName && currentReview.maskedUserName !== currentReview.userFullName && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Tên hiển thị công khai:</strong> {currentReview.maskedUserName}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          {!currentReview?.staffReply ? (
            <Button
              onClick={() => {
                handleCloseViewDialog();
                handleOpenReplyDialog(currentReview);
              }}
              variant="contained"
              startIcon={<ReplyIcon />}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                borderRadius: '20px',
                px: 3,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.35)',
                },
              }}
            >
              Phản hồi
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleCloseViewDialog();
                handleOpenReplyDialog(currentReview);
              }}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                borderRadius: '20px',
                px: 3,
                boxShadow: '0 2px 8px rgba(255, 152, 0, 0.25)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(255, 152, 0, 0.35)',
                },
              }}
            >
              Sửa phản hồi
            </Button>
          )}
          <Button
            onClick={handleCloseViewDialog}
            variant="outlined"
            sx={{ borderRadius: '20px', px: 3, ml: 1 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
          }}
        >
          Xác nhận xóa phản hồi
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography>
            Bạn có chắc chắn muốn xóa phản hồi cho đánh giá từ khách hàng{' '}
            <strong>{currentReview?.userFullName || 'Khách hàng'}</strong> không?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: '20px' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteReview}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : <DeleteIcon />
            }
            sx={{ borderRadius: '20px' }}
          >
            Xóa phản hồi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar cho thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewManagementContent;

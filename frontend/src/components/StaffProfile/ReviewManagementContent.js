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
import { notify } from '../../utils/notify';
import { confirmDialog } from '../../utils/confirmDialog';

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
  const [currentReview, setCurrentReview] = useState(null);
  const [response, setResponse] = useState('');
  const [isEditingInView, setIsEditingInView] = useState(false);
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
      notify.error('Lỗi', 'Lỗi khi tải danh sách đánh giá: ' + error.message);
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
      notify.warning('Cảnh báo', 'Vui lòng nhập nội dung phản hồi');
      return;
    }

    setLoading(true);
    try {
      let result;
      const replyData = { staffReply: response };

      if (currentReview.staffReply) {
        // Update existing reply - sử dụng API riêng cho cập nhật
        result = await reviewService.updateReply(
          currentReview.ratingId,
          replyData
        );
        notify.success('Thành công', 'Cập nhật phản hồi thành công!');
      } else {
        // Create new reply - sử dụng API riêng cho tạo mới
        result = await reviewService.createReply(
          currentReview.ratingId,
          replyData
        );
        notify.success('Thành công', 'Phản hồi đã được gửi thành công!');
      }

      // Update current review with new data from API response
      if (result && result.data) {
        setCurrentReview((prev) => ({
          ...prev,
          staffReply: result.data.staffReply || result.data.reply, // Handle both possible field names
          repliedAt: result.data.repliedAt,
          repliedByName: result.data.repliedByName,
        }));
      }

      setOpenDialog(false);
      fetchReviews(); // Refresh data
    } catch (error) {
      console.error('Error submitting response:', error);
      notify.error('Lỗi', 'Lỗi khi gửi phản hồi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenViewDialog = (review) => {
    setCurrentReview(review);
    setResponse(review.staffReply || '');
    setIsEditingInView(false);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setIsEditingInView(false);
    setResponse('');
  };

  const handleDeleteReview = async (review) => {
    if (!review?.staffReply) {
      notify.warning('Cảnh báo', 'Không có phản hồi để xóa');
      return;
    }

    const confirmed = await confirmDialog.danger(
      `Bạn có chắc chắn muốn xóa phản hồi cho đánh giá từ khách hàng ${review.userFullName || 'Khách hàng'} không?`,
      {
        title: 'Xác nhận xóa phản hồi',
        confirmText: 'XÓA PHẢN HỒI',
        cancelText: 'HỦY',
      }
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await reviewService.deleteStaffReply(review.ratingId);
      notify.success('Thành công', 'Đã xóa phản hồi thành công!');
      fetchReviews(); // Refresh data
    } catch (error) {
      console.error('Error deleting staff reply:', error);
      notify.error('Lỗi', 'Lỗi khi xóa phản hồi: ' + error.message);
    } finally {
      setLoading(false);
    }
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
                <TableCell sx={pageStyles.tableHeadCell}>
                  Dịch vụ/Tư vấn viên
                </TableCell>
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
                        title={review.comment.length > 30 ? review.comment : ''}
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
                        ? new Date(
                            review.createdAt[0],
                            review.createdAt[1] - 1,
                            review.createdAt[2]
                          ).toLocaleDateString('vi-VN')
                        : new Date(review.createdAt).toLocaleDateString(
                            'vi-VN'
                          )}
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
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
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
                                  bgcolor: alpha(
                                    theme.palette.warning.main,
                                    0.1
                                  ),
                                },
                              }}
                            ></IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa phản hồi">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteReview(review)}
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
            background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '16px 16px 0 0',
            boxShadow: '0 4px 20px rgba(74, 144, 226, 0.25)',
            py: 2.5,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReplyIcon sx={{ fontSize: 32 }} />
            <span>
              {currentReview?.staffReply
                ? 'Cập nhật phản hồi'
                : 'Phản hồi đánh giá'}
            </span>
          </Box>
          <IconButton
            size="small"
            onClick={handleCloseDialog}
            sx={{ color: 'white', ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 3,
            pb: 3,
            px: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '40vh',
          }}
        >
          {/* Thông tin đánh giá */}
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(74, 144, 226, 0.15)',
              p: 3,
              mb: 3,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: '2px solid rgba(74, 144, 226, 0.1)',
              }}
            >
              <Avatar
                src={currentReview?.userAvatar}
                alt={currentReview?.userFullName}
                sx={{
                  width: 56,
                  height: 56,
                  mr: 3,
                  background:
                    'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                  fontSize: 28,
                  fontWeight: 'bold',
                  boxShadow: '0 6px 20px rgba(74, 144, 226, 0.3)',
                  border: '3px solid white',
                }}
              >
                {currentReview?.userFullName?.[0] || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: '#1a202c',
                    mb: 0.5,
                    fontSize: '1.25rem',
                  }}
                >
                  {currentReview?.userFullName || 'Khách hàng'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(74, 144, 226, 0.8)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  ID: {currentReview?.userId || 'N/A'}
                </Typography>
              </Box>

              {/* Đánh giá */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Đánh giá
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    p: 1.5,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, #fff5f5 0%, #fef5e7 100%)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                  }}
                >
                  <Rating
                    value={currentReview?.rating || 0}
                    readOnly
                    size="medium"
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    sx={{
                      color: '#FFB400',
                      mr: 1,
                      filter: 'drop-shadow(0 2px 4px rgba(255, 180, 0, 0.3))',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#d69e2e',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {currentReview?.rating || 0}/5
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Dịch vụ
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#2d3748',
                    fontSize: '1rem',
                  }}
                >
                  {currentReview?.targetName || 'Không xác định'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Ngày đánh giá
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#2d3748',
                    fontWeight: 500,
                  }}
                >
                  {currentReview?.createdAt
                    ? Array.isArray(currentReview.createdAt)
                      ? new Date(
                          currentReview.createdAt[0],
                          currentReview.createdAt[1] - 1,
                          currentReview.createdAt[2]
                        ).toLocaleDateString('vi-VN')
                      : new Date(currentReview.createdAt).toLocaleDateString(
                          'vi-VN'
                        )
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Nội dung đánh giá */}
          <Box
            sx={{
              p: 3,
              mb: 3,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
              borderRadius: 3,
              border: '2px solid rgba(74, 144, 226, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}
                >
                  💬
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#2d3748',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                Nội dung đánh giá
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: '#4a5568',
                fontSize: '1rem',
                fontStyle: currentReview?.comment ? 'normal' : 'italic',
                p: 2,
                borderRadius: 2,
                background: 'rgba(248, 250, 252, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
              }}
            >
              {currentReview?.comment || 'Không có nội dung đánh giá'}
            </Typography>
          </Box>

          {/* Form phản hồi */}
          <Box
            sx={{
              p: 3,
              background:
                'linear-gradient(135deg, rgba(26, 188, 156, 0.05) 0%, rgba(26, 188, 156, 0.1) 100%)',
              borderRadius: 3,
              border: '2px solid rgba(26, 188, 156, 0.2)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1ABC9C 0%, #16A085 100%)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 4px 12px rgba(26, 188, 156, 0.3)',
                }}
              >
                <ReplyIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#065f46',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                {currentReview?.staffReply
                  ? 'Cập nhật phản hồi của bạn'
                  : 'Viết phản hồi của bạn'}
              </Typography>
            </Box>

            {/* Template buttons */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#065f46',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'white', fontSize: '12px' }}
                  >
                    📝
                  </Typography>
                </Box>
                Mẫu phản hồi có sẵn:
              </Typography>

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() =>
                      setResponse(`Cảm ơn bạn đã dành thời gian đánh giá dịch vụ của chúng tôi! 

Chúng tôi rất vui khi biết rằng bạn hài lòng với dịch vụ. Điều này thực sự là động lực to lớn để chúng tôi tiếp tục nỗ lực cải thiện chất lượng phục vụ.

Hy vọng bạn sẽ tiếp tục tin tướng và sử dụng dịch vụ của chúng tôi trong tương lai. Chúc bạn sức khỏe!

Trân trọng,
Đội ngũ Y tế`)
                    }
                    sx={{
                      borderColor: 'rgba(26, 188, 156, 0.5)',
                      color: '#047857',
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#1ABC9C',
                        background: 'rgba(26, 188, 156, 0.05)',
                      },
                    }}
                  >
                    🌟 Phản hồi tích cực
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() =>
                      setResponse(`Cảm ơn bạn đã chia sẻ phản hồi về dịch vụ của chúng tôi.

Chúng tôi thành thật xin lỗi vì trải nghiệm chưa được như mong đợi. Chúng tôi sẽ xem xét kỹ lưỡng phản hồi của bạn để cải thiện chất lượng dịch vụ.

Nếu có bất kỳ vấn đề gì cần hỗ trợ thêm, xin đừng ngần ngại liên hệ với chúng tôi. Chúng tôi cam kết mang đến trải nghiệm tốt hơn cho bạn trong tương lai.

Trân trọng,
Đội ngũ Y tế`)
                    }
                    sx={{
                      borderColor: 'rgba(255, 152, 0, 0.5)',
                      color: '#c05621',
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#FF9800',
                        background: 'rgba(255, 152, 0, 0.05)',
                      },
                    }}
                  >
                    🔄 Cải thiện dịch vụ
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() =>
                      setResponse(`Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ tư vấn của chúng tôi.

Chúng tôi luôn nỗ lực cung cấp thông tin chính xác và hữu ích nhất cho khách hàng. Hy vọng những lời tư vấn đã giúp ích cho bạn trong việc chăm sóc sức khỏe.

Nếu bạn có thêm bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi. Chúc bạn luôn khỏe mạnh!

Trân trọng,
Chuyên viên tư vấn`)
                    }
                    sx={{
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      color: '#1e40af',
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#3B82F6',
                        background: 'rgba(59, 130, 246, 0.05)',
                      },
                    }}
                  >
                    💬 Dịch vụ tư vấn
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() =>
                      setResponse(`Cảm ơn bạn đã lựa chọn dịch vụ xét nghiệm STI của chúng tôi.

Chúng tôi hiểu rằng đây là dịch vụ nhạy cảm và bạn đã rất can đảm khi quyết định thực hiện. Chúng tôi cam kết bảo mật thông tin tuyệt đối và cung cấp kết quả chính xác nhất.

Nếu bạn có bất kỳ câu hỏi nào về kết quả xét nghiệm hoặc cần tư vấn thêm, hãy liên hệ với chúng tôi. Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.

Trân trọng,
Đội ngũ Y tế`)
                    }
                    sx={{
                      borderColor: 'rgba(139, 69, 19, 0.5)',
                      color: '#92400e',
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#A0522D',
                        background: 'rgba(139, 69, 19, 0.05)',
                      },
                    }}
                  >
                    🔬 Xét nghiệm STI
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={5}
              label="Phản hồi chuyên nghiệp"
              value={response}
              onChange={handleResponseChange}
              placeholder="Nhập phản hồi chuyên nghiệp và tận tình tới khách hàng hoặc chọn mẫu có sẵn bên trên..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 3,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1ABC9C',
                      borderWidth: '2px',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1ABC9C',
                      borderWidth: '2px',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#065f46',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1ABC9C',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#2d3748',
                },
              }}
            />

            {/* Gợi ý */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(26, 188, 156, 0.2)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#047857',
                  fontWeight: 500,
                  display: 'block',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                💡 Gợi ý phản hồi:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#065f46',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                • Cảm ơn khách hàng về đánh giá
                <br />
                • Giải thích rõ ràng về dịch vụ đã cung cấp
                <br />
                • Cam kết cải thiện chất lượng dịch vụ
                <br />• Mời khách hàng quay lại sử dụng dịch vụ
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderTop: '1px solid rgba(74, 144, 226, 0.1)',
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              border: '2px solid rgba(74, 144, 226, 0.3)',
              color: '#4A90E2',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                border: '2px solid #4A90E2',
                background: 'rgba(74, 144, 226, 0.05)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={!response.trim() || loading}
            sx={{
              background: loading
                ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                : 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)',
              ml: 2,
              '&:hover': {
                background: loading
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #0f766e 100%)',
                transform: loading ? 'none' : 'translateY(-2px)',
                boxShadow: loading
                  ? '0 4px 20px rgba(74, 144, 226, 0.3)'
                  : '0 8px 30px rgba(74, 144, 226, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                color: 'rgba(255, 255, 255, 0.7)',
              },
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <span>Đang gửi...</span>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReplyIcon sx={{ fontSize: 20 }} />
                <span>
                  {currentReview?.staffReply
                    ? 'Cập nhật phản hồi'
                    : 'Gửi phản hồi'}
                </span>
              </Box>
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
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
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
            px: 3,
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
        <DialogContent
          sx={{
            pt: 3,
            pb: 3,
            px: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '50vh',
          }}
        >
          {/* Thông tin khách hàng */}
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(74, 144, 226, 0.15)',
              p: 3,
              mb: 3,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: '2px solid rgba(74, 144, 226, 0.1)',
              }}
            >
              <Avatar
                src={currentReview?.userAvatar}
                alt={currentReview?.userFullName}
                sx={{
                  width: 64,
                  height: 64,
                  mr: 3,
                  background:
                    'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                  fontSize: 32,
                  fontWeight: 'bold',
                  boxShadow: '0 6px 20px rgba(74, 144, 226, 0.3)',
                  border: '3px solid white',
                }}
              >
                {currentReview?.userFullName?.[0] || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: '#1a202c',
                    mb: 0.5,
                    fontSize: '1.25rem',
                  }}
                >
                  {currentReview?.userFullName || 'Khách hàng'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(74, 144, 226, 0.8)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  ID: {currentReview?.userId || 'N/A'}
                </Typography>
              </Box>

              {/* Đánh giá bên phải */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Đánh giá
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    p: 1.5,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, #fff5f5 0%, #fef5e7 100%)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                  }}
                >
                  <Rating
                    value={currentReview?.rating || 0}
                    readOnly
                    size="medium"
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    sx={{
                      color: '#FFB400',
                      mr: 1,
                      filter: 'drop-shadow(0 2px 4px rgba(255, 180, 0, 0.3))',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#d69e2e',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {currentReview?.rating || 0}/5
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Dịch vụ
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#2d3748',
                    fontSize: '1rem',
                  }}
                >
                  {currentReview?.targetName || 'Không xác định'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Loại dịch vụ
                </Typography>
                <Chip
                  label={
                    currentReview?.targetType === 'CONSULTANT'
                      ? 'Tư vấn'
                      : currentReview?.targetType === 'STI_SERVICE'
                        ? 'Dịch vụ STI'
                        : currentReview?.targetType === 'STI_PACKAGE'
                          ? 'Gói STI'
                          : 'Không xác định'
                  }
                  size="small"
                  sx={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                />
              </Grid>

              {currentReview?.targetId && (
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#4a5568',
                      fontWeight: 600,
                      mb: 1,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ID Dịch vụ/Tư vấn viên
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#2d3748',
                      fontWeight: 500,
                    }}
                  >
                    {currentReview.targetId}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Thông tin thời gian */}
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(74, 144, 226, 0.15)',
              p: 3,
              mb: 3,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
              },
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#4a5568',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Ngày đánh giá
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#2d3748',
                    fontWeight: 500,
                  }}
                >
                  {currentReview?.createdAt
                    ? Array.isArray(currentReview.createdAt)
                      ? new Date(
                          currentReview.createdAt[0],
                          currentReview.createdAt[1] - 1,
                          currentReview.createdAt[2],
                          currentReview.createdAt[3] || 0,
                          currentReview.createdAt[4] || 0,
                          currentReview.createdAt[5] || 0
                        ).toLocaleString('vi-VN')
                      : new Date(currentReview.createdAt).toLocaleString(
                          'vi-VN'
                        )
                    : 'N/A'}
                </Typography>
              </Grid>

              {currentReview?.updatedAt && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#4a5568',
                      fontWeight: 600,
                      mb: 1,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Cập nhật lần cuối
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#2d3748',
                      fontWeight: 500,
                    }}
                  >
                    {Array.isArray(currentReview.updatedAt)
                      ? new Date(
                          currentReview.updatedAt[0],
                          currentReview.updatedAt[1] - 1,
                          currentReview.updatedAt[2],
                          currentReview.updatedAt[3] || 0,
                          currentReview.updatedAt[4] || 0,
                          currentReview.updatedAt[5] || 0
                        ).toLocaleString('vi-VN')
                      : new Date(currentReview.updatedAt).toLocaleString(
                          'vi-VN'
                        )}
                  </Typography>
                </Grid>
              )}

              {/* Quyền chỉnh sửa */}
            </Grid>
          </Box>

          {/* Nội dung đánh giá */}
          <Box
            sx={{
              p: 4,
              mt: 1,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
              borderRadius: 3,
              border: '2px solid rgba(74, 144, 226, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              mb: 3,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  💬
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#2d3748',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                Nội dung đánh giá
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                lineHeight: 1.8,
                color: '#4a5568',
                fontSize: '1rem',
                fontStyle: currentReview?.comment ? 'normal' : 'italic',
                p: 2,
                borderRadius: 2,
                background: 'rgba(248, 250, 252, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.5)',
              }}
            >
              {currentReview?.comment || 'Không có nội dung đánh giá'}
            </Typography>
          </Box>

          {/* Phản hồi từ nhân viên */}
          {currentReview?.staffReply && !isEditingInView && (
            <Box
              sx={{
                p: 4,
                mt: 1,
                background:
                  'linear-gradient(135deg, rgba(26, 188, 156, 0.08) 0%, rgba(26, 188, 156, 0.15) 100%)',
                borderRadius: 3,
                border: '2px solid rgba(26, 188, 156, 0.3)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                mb: 3,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(26, 188, 156, 0.2)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background:
                    'linear-gradient(90deg, #1ABC9C 0%, #16A085 100%)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(26, 188, 156, 0.3)',
                    }}
                  >
                    <ReplyIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#065f46',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    Phản hồi từ nhân viên y tế
                  </Typography>
                </Box>

                {/* Edit button */}
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingInView(true)}
                  sx={{
                    borderColor: 'rgba(26, 188, 156, 0.5)',
                    color: '#047857',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      borderColor: '#1ABC9C',
                      background: 'rgba(26, 188, 156, 0.05)',
                    },
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  lineHeight: 1.8,
                  color: '#047857',
                  fontSize: '1rem',
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(26, 188, 156, 0.2)',
                }}
              >
                {currentReview.staffReply}
              </Typography>

              {/* Thông tin người phản hồi */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid rgba(26, 188, 156, 0.2)',
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                {currentReview?.repliedByName && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#065f46',
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#1ABC9C',
                      }}
                    />
                    <strong>Người phản hồi:</strong>{' '}
                    {currentReview.repliedByName}
                    {currentReview?.repliedById &&
                      ` (ID: ${currentReview.repliedById})`}
                  </Typography>
                )}
                {currentReview?.repliedAt && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#065f46',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#1ABC9C',
                      }}
                    />
                    <strong>Thời gian phản hồi:</strong>{' '}
                    {Array.isArray(currentReview.repliedAt)
                      ? new Date(
                          currentReview.repliedAt[0],
                          currentReview.repliedAt[1] - 1,
                          currentReview.repliedAt[2],
                          currentReview.repliedAt[3] || 0,
                          currentReview.repliedAt[4] || 0,
                          currentReview.repliedAt[5] || 0
                        ).toLocaleString('vi-VN')
                      : new Date(currentReview.repliedAt).toLocaleString(
                          'vi-VN'
                        )}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Form chỉnh sửa phản hồi trong view dialog */}
          {(isEditingInView ||
            (!currentReview?.staffReply && isEditingInView)) && (
            <Box
              sx={{
                p: 3,
                background:
                  'linear-gradient(135deg, rgba(26, 188, 156, 0.05) 0%, rgba(26, 188, 156, 0.1) 100%)',
                borderRadius: 3,
                border: '2px solid rgba(26, 188, 156, 0.2)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                mb: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background:
                    'linear-gradient(90deg, #1ABC9C 0%, #16A085 100%)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(26, 188, 156, 0.3)',
                  }}
                >
                  <ReplyIcon sx={{ color: 'white', fontSize: 18 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#065f46',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {currentReview?.staffReply
                    ? 'Chỉnh sửa phản hồi'
                    : 'Viết phản hồi mới'}
                </Typography>
              </Box>

              {/* Template buttons */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#065f46',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Mẫu phản hồi có sẵn:
                </Typography>

                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() =>
                        setResponse(`Cảm ơn bạn đã dành thời gian đánh giá dịch vụ của chúng tôi! 

Chúng tôi rất vui khi biết rằng bạn hài lòng với dịch vụ. Điều này thực sự là động lực to lớn để chúng tôi tiếp tục nỗ lực cải thiện chất lượng phục vụ.

Hy vọng bạn sẽ tiếp tục tin tướng và sử dụng dịch vụ của chúng tôi trong tương lai. Chúc bạn sức khỏe!

Trân trọng,
Đội ngũ Y tế`)
                      }
                      sx={{
                        borderColor: 'rgba(26, 188, 156, 0.5)',
                        color: '#047857',
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: '#1ABC9C',
                          background: 'rgba(26, 188, 156, 0.05)',
                        },
                      }}
                    >
                      🌟 Phản hồi tích cực
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() =>
                        setResponse(`Cảm ơn bạn đã chia sẻ phản hồi về dịch vụ của chúng tôi.

Chúng tôi thành thật xin lỗi vì trải nghiệm chưa được như mong đợi. Chúng tôi sẽ xem xét kỹ lưỡng phản hồi của bạn để cải thiện chất lượng dịch vụ.

Nếu có bất kỳ vấn đề gì cần hỗ trợ thêm, xin đừng ngần ngại liên hệ với chúng tôi. Chúng tôi cam kết mang đến trải nghiệm tốt hơn cho bạn trong tương lai.

Trân trọng,
Đội ngũ Y tế`)
                      }
                      sx={{
                        borderColor: 'rgba(255, 152, 0, 0.5)',
                        color: '#c05621',
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: '#FF9800',
                          background: 'rgba(255, 152, 0, 0.05)',
                        },
                      }}
                    >
                      🔄 Cải thiện dịch vụ
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() =>
                        setResponse(`Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ tư vấn của chúng tôi.

Chúng tôi luôn nỗ lực cung cấp thông tin chính xác và hữu ích nhất cho khách hàng. Hy vọng những lời tư vấn đã giúp ích cho bạn trong việc chăm sóc sức khỏe.

Nếu bạn có thêm bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi. Chúc bạn luôn khỏe mạnh!

Trân trọng,
Chuyên viên tư vấn`)
                      }
                      sx={{
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                        color: '#1e40af',
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: '#3B82F6',
                          background: 'rgba(59, 130, 246, 0.05)',
                        },
                      }}
                    >
                      💬 Dịch vụ tư vấn
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() =>
                        setResponse(`Cảm ơn bạn đã lựa chọn dịch vụ xét nghiệm STI của chúng tôi.

Chúng tôi hiểu rằng đây là dịch vụ nhạy cảm và bạn đã rất can đảm khi quyết định thực hiện. Chúng tôi cam kết bảo mật thông tin tuyệt đối và cung cấp kết quả chính xác nhất.

Nếu bạn có bất kỳ câu hỏi nào về kết quả xét nghiệm hoặc cần tư vấn thêm, hãy liên hệ với chúng tôi. Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.

Trân trọng,
Đội ngũ Y tế`)
                      }
                      sx={{
                        borderColor: 'rgba(139, 69, 19, 0.5)',
                        color: '#92400e',
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: '#A0522D',
                          background: 'rgba(139, 69, 19, 0.05)',
                        },
                      }}
                    >
                      🔬 Xét nghiệm STI
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={5}
                label="Phản hồi chuyên nghiệp"
                value={response}
                onChange={handleResponseChange}
                placeholder="Nhập phản hồi chuyên nghiệp và tận tình tới khách hàng hoặc chọn mẫu có sẵn bên trên..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 3,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                        borderWidth: '2px',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#065f46',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#1ABC9C',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#2d3748',
                  },
                }}
              />

              {/* Action buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditingInView(false);
                    setResponse(currentReview?.staffReply || '');
                  }}
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    border: '2px solid rgba(74, 144, 226, 0.3)',
                    color: '#4A90E2',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      border: '2px solid #4A90E2',
                      background: 'rgba(74, 144, 226, 0.05)',
                    },
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await handleSubmitResponse();
                    setIsEditingInView(false);
                  }}
                  disabled={!response.trim() || loading}
                  sx={{
                    background: loading
                      ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                      : 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
                    borderRadius: '20px',
                    px: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(26, 188, 156, 0.3)',
                    '&:hover': {
                      background: loading
                        ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                        : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      transform: loading ? 'none' : 'translateY(-2px)',
                      boxShadow: loading
                        ? '0 4px 20px rgba(26, 188, 156, 0.3)'
                        : '0 8px 30px rgba(26, 188, 156, 0.4)',
                    },
                    '&:disabled': {
                      background:
                        'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      <span>Đang lưu...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReplyIcon sx={{ fontSize: 20 }} />
                      <span>
                        {currentReview?.staffReply
                          ? 'Cập nhật phản hồi'
                          : 'Gửi phản hồi'}
                      </span>
                    </Box>
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          {!currentReview?.staffReply && !isEditingInView ? (
            <Button
              onClick={() => setIsEditingInView(true)}
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
          ) : currentReview?.staffReply && !isEditingInView ? (
            <Button
              onClick={() => setIsEditingInView(true)}
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
          ) : null}
          <Button
            onClick={handleCloseViewDialog}
            variant="outlined"
            sx={{ borderRadius: '20px', px: 3, ml: 1 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewManagementContent;

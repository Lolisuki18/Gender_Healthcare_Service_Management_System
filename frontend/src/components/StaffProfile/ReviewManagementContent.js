/**
 * ReviewManagementContent.js
 *
 * Mục đích: Quản lý đánh giá từ khách hàng
 * - Hiển thị danh sách đánh giá
 * - Phản hồi đánh giá
 * - Quản lý trạng thái đánh giá
 * - Xóa đánh giá
 */

import React, { useState } from 'react';
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
  Block as BlockIcon,
  Check as CheckIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

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
  // Mock data - sẽ được thay thế bằng API calls
  const initialReviews = [
    {
      id: 1,
      customerId: 101,
      customerName: 'Nguyễn Văn A',
      serviceId: 1,
      serviceName: 'Xét nghiệm STI cơ bản',
      rating: 5,
      comment:
        'Dịch vụ rất chuyên nghiệp, nhân viên tư vấn tận tình. Tôi cảm thấy an tâm khi sử dụng dịch vụ tại đây.',
      date: '2025-05-20',
      status: 'published',
      avatarUrl: null,
      response: 'Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!',
    },
    {
      id: 2,
      customerId: 102,
      customerName: 'Trần Thị B',
      serviceId: 2,
      serviceName: 'Xét nghiệm STI toàn diện',
      rating: 4,
      comment:
        'Dịch vụ tốt, giá cả hợp lý. Tuy nhiên thời gian đợi kết quả hơi lâu so với kỳ vọng.',
      date: '2025-06-01',
      status: 'published',
      avatarUrl: null,
      response: '',
    },
    {
      id: 3,
      customerId: 103,
      customerName: 'Lê Văn C',
      serviceId: 1,
      serviceName: 'Xét nghiệm STI cơ bản',
      rating: 3,
      comment:
        'Dịch vụ ổn nhưng thời gian chờ hơi lâu. Phòng khám khá đông người.',
      date: '2025-06-05',
      status: 'pending',
      avatarUrl: null,
      response: '',
    },
    {
      id: 4,
      customerId: 104,
      customerName: 'Phạm Thị D',
      serviceId: 3,
      serviceName: 'Tư vấn sức khỏe giới tính',
      rating: 5,
      comment:
        'Bác sĩ tư vấn rất tận tình và chuyên nghiệp. Không gian tư vấn riêng tư, thoải mái.',
      date: '2025-06-10',
      status: 'published',
      avatarUrl: null,
      response:
        'Cảm ơn bạn đã đánh giá tích cực. Chúng tôi luôn đặt sự riêng tư và thoải mái của khách hàng lên hàng đầu.',
    },
    {
      id: 5,
      customerId: 105,
      customerName: 'Hoàng Văn E',
      serviceId: 4,
      serviceName: 'Theo dõi thai kỳ',
      rating: 5,
      comment:
        'Dịch vụ theo dõi thai kỳ rất tốt, bác sĩ chu đáo và nhiệt tình tư vấn. Tôi sẽ tiếp tục sử dụng dịch vụ này.',
      date: '2025-06-15',
      status: 'published',
      avatarUrl: null,
      response: 'Cảm ơn bạn đã tin tưởng. Chúc bạn có thai kỳ khỏe mạnh!',
    },
    {
      id: 6,
      customerId: 106,
      customerName: 'Ngô Thị F',
      serviceId: 5,
      serviceName: 'Khám sàng lọc ung thư cổ tử cung',
      rating: 4,
      comment:
        'Dịch vụ tốt, nhân viên y tế nhiệt tình. Tuy nhiên cơ sở vật chất có thể được cải thiện thêm.',
      date: '2025-06-18',
      status: 'pending',
      avatarUrl: null,
      response: '',
    },
    {
      id: 7,
      customerId: 107,
      customerName: 'Vũ Văn G',
      serviceId: 6,
      serviceName: 'Tư vấn kế hoạch hóa gia đình',
      rating: 2,
      comment:
        'Thời gian chờ đợi quá lâu, thông tin tư vấn chưa thật sự chi tiết như mong đợi.',
      date: '2025-06-20',
      status: 'pending',
      avatarUrl: null,
      response: '',
    },
    {
      id: 8,
      customerId: 108,
      customerName: 'Đặng Thị H',
      serviceId: 1,
      serviceName: 'Xét nghiệm STI cơ bản',
      rating: 5,
      comment:
        'Rất hài lòng với dịch vụ, nhân viên chuyên nghiệp và kết quả được trả nhanh chóng.',
      date: '2025-06-21',
      status: 'published',
      avatarUrl: null,
      response: 'Cảm ơn bạn đã đánh giá tích cực về dịch vụ của chúng tôi!',
    },
  ];
  const [reviews, setReviews] = useState(initialReviews);
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [response, setResponse] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(false);

  // Mock API delay
  const mockApiCall = (callback, delay = 800) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, delay);
  };

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
    setResponse('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };
  const handleSubmitResponse = () => {
    mockApiCall(() => {
      const updatedReviews = reviews.map((review) =>
        review.id === currentReview.id
          ? { ...review, response: response }
          : review
      );
      setReviews(updatedReviews);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Phản hồi đã được gửi thành công!',
        severity: 'success',
      });
    });
  };
  const handleApproveReview = (id) => {
    mockApiCall(() => {
      const updatedReviews = reviews.map((review) =>
        review.id === id ? { ...review, status: 'published' } : review
      );
      setReviews(updatedReviews);
      setSnackbar({
        open: true,
        message: 'Đã duyệt đánh giá thành công!',
        severity: 'success',
      });
    });
  };

  const handleRejectReview = (id) => {
    mockApiCall(() => {
      const updatedReviews = reviews.map((review) =>
        review.id === id ? { ...review, status: 'rejected' } : review
      );
      setReviews(updatedReviews);
      setSnackbar({
        open: true,
        message: 'Đã từ chối đánh giá!',
        severity: 'warning',
      });
    });
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

  const handleDeleteReview = () => {
    mockApiCall(() => {
      const updatedReviews = reviews.filter(
        (review) => review.id !== currentReview.id
      );
      setReviews(updatedReviews);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Đã xóa đánh giá thành công!',
        severity: 'success',
      });
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  // Filter reviews dựa trên searchTerm và filterStatus
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || review.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with gradient */}
      <Box sx={pageStyles.gradientBackground}>
        <Typography variant="h4" sx={pageStyles.pageTitle}>
          Quản lý đánh giá
        </Typography>
        <Typography variant="body1" sx={pageStyles.pageSubtitle}>
          Xem, duyệt và phản hồi đánh giá từ khách hàng
        </Typography>
      </Box>

      {/* Toolbar */}
      <Card sx={{ ...pageStyles.card, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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
            </Grid>{' '}
            <Grid item xs={12} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Lọc theo trạng thái</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  label="Lọc theo trạng thái"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="published">Đã xuất bản</MenuItem>
                  <MenuItem value="pending">Chờ duyệt</MenuItem>
                  <MenuItem value="rejected">Đã từ chối</MenuItem>
                </Select>
              </FormControl>
            </Grid>{' '}
            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {filteredReviews.length} đánh giá
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
              {' '}
              <TableRow>
                <TableCell sx={pageStyles.tableHeadCell}>ID</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Khách hàng</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Dịch vụ</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Đánh giá</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Nhận xét</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Ngày</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Trạng thái</TableCell>
                <TableCell sx={pageStyles.tableHeadCell}>Phản hồi</TableCell>
                <TableCell sx={pageStyles.tableHeadCell} align="right">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {' '}
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Đang tải dữ liệu...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy đánh giá nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((review) => (
                    <TableRow key={review.id} hover>
                      <TableCell>{review.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={review.avatarUrl}
                            alt={review.customerName}
                            sx={{
                              width: 32,
                              height: 32,
                              mr: 1,
                              bgcolor: `${theme.palette.primary.main}`,
                            }}
                          >
                            {review.customerName[0]}
                          </Avatar>
                          {review.customerName}
                        </Box>
                      </TableCell>
                      <TableCell>{review.serviceName}</TableCell>
                      <TableCell>
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          sx={{ color: theme.palette.warning.main }}
                        />
                      </TableCell>{' '}
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
                        {review.response ? (
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
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(review.status)}
                          color={getStatusColor(review.status)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {' '}
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
                        <Tooltip title="Xóa">
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
                        <Tooltip title="Phản hồi">
                          <span>
                            <IconButton
                              size="small"
                              disabled={review.status === 'rejected'}
                              onClick={() => handleOpenReplyDialog(review)}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                },
                                '&.Mui-disabled': {
                                  color: theme.palette.text.disabled,
                                },
                              }}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {review.status === 'pending' && (
                          <>
                            <Tooltip title="Duyệt">
                              <IconButton
                                size="small"
                                onClick={() => handleApproveReview(review.id)}
                                sx={{
                                  color: theme.palette.success.main,
                                  '&:hover': {
                                    bgcolor: alpha(
                                      theme.palette.success.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Từ chối">
                              <IconButton
                                size="small"
                                onClick={() => handleRejectReview(review.id)}
                                sx={{
                                  color: theme.palette.error.main,
                                  '&:hover': {
                                    bgcolor: alpha(
                                      theme.palette.error.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <BlockIcon fontSize="small" />
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
            count={filteredReviews.length}
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
          Phản hồi đánh giá
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
                    src={currentReview?.avatarUrl}
                    alt={currentReview?.customerName}
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 1,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {currentReview?.customerName?.[0]}
                  </Avatar>
                  <Typography variant="h6">
                    {currentReview?.customerName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Dịch vụ:</strong> {currentReview?.serviceName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Ngày:</strong> {currentReview?.date}
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
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Chi tiết đánh giá</span>
          <IconButton
            size="small"
            onClick={handleCloseViewDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>{' '}
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Mã đánh giá
              </Typography>
              <Typography variant="body1" gutterBottom>
                #{currentReview?.id}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Khách hàng
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={currentReview?.avatarUrl}
                  alt={currentReview?.customerName}
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {currentReview?.customerName?.[0]}
                </Avatar>
                <Typography variant="body1" gutterBottom>
                  {currentReview?.customerName} (ID: {currentReview?.customerId}
                  )
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Dịch vụ
              </Typography>
              <Typography variant="body1" gutterBottom>
                {currentReview?.serviceName} (ID: {currentReview?.serviceId})
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Ngày đánh giá
              </Typography>
              <Typography variant="body1" gutterBottom>
                {currentReview?.date}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Trạng thái
              </Typography>
              <Chip
                label={getStatusLabel(currentReview?.status)}
                color={getStatusColor(currentReview?.status)}
                size="small"
                sx={{ fontWeight: 500 }}
              />

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Đánh giá
              </Typography>
              <Rating
                value={currentReview?.rating || 0}
                readOnly
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                sx={{ color: theme.palette.warning.main }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Nội dung đánh giá
              </Typography>
              <Box
                sx={{
                  p: 2,
                  mt: 1,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: '4px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography variant="body1">
                  {currentReview?.comment}
                </Typography>
              </Box>
            </Grid>
            {currentReview?.response && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phản hồi từ nhân viên y tế
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    mt: 1,
                    bgcolor: alpha(theme.palette.primary.light, 0.1),
                    borderRadius: '4px',
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                  }}
                >
                  <Typography variant="body1">
                    {currentReview?.response}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {!currentReview?.response && (
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
          )}{' '}
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
          Xác nhận xóa
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography>
            Bạn có chắc chắn muốn xóa đánh giá từ khách hàng{' '}
            <strong>{currentReview?.customerName}</strong> không?
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
            Xóa
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

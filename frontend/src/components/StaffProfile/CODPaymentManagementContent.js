import React, { useState, useEffect } from 'react';
import {
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import stiService from '../../services/stiService';
import { notify } from '../../utils/notify';

const CODPaymentManagementContent = () => {
  const [codPayments, setCodPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPendingCODPayments();
  }, []);

  const fetchPendingCODPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stiService.getPendingCODPayments();

      console.log('COD payments response:', response);

      if (response && response.success) {
        setCodPayments(response.data || []);
        console.log('Set COD payments:', response.data);
      } else {
        setError(response?.message || 'Không thể tải danh sách thanh toán COD');
      }
    } catch (error) {
      console.error('Error fetching COD payments:', error);
      setError(error.message || 'Không thể tải danh sách thanh toán COD');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = (payment) => {
    setSelectedPayment(payment);
    setNotes('');
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      const response = await stiService.confirmCODPayment(
        selectedPayment.paymentId,
        notes
      );

      if (response && response.success) {
        setSuccess('Xác nhận thanh toán COD thành công');
        notify.success('Thành công', 'Xác nhận thanh toán COD thành công');
        setConfirmDialogOpen(false);
        fetchPendingCODPayments(); // Refresh the list

        // Tự động ẩn thông báo thành công sau 3 giây
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response?.message || 'Không thể xác nhận thanh toán');
        notify.error(
          'Lỗi',
          response?.message || 'Không thể xác nhận thanh toán'
        );
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError(error.message || 'Không thể xác nhận thanh toán');
      notify.error('Lỗi', error.message || 'Không thể xác nhận thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedPayment(null);
    setNotes('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';

    try {
      let date;

      // Kiểm tra nếu dateTime là array (format từ Java LocalDateTime)
      if (Array.isArray(dateTime)) {
        // Format: [year, month, day, hour, minute, second, nano]
        const [year, month, day, hour, minute, second] = dateTime;
        // Backend đã lưu thời gian theo múi giờ Việt Nam (UTC+7), không cần chuyển đổi
        date = new Date(year, month - 1, day, hour, minute, second); // month - 1 vì JS month bắt đầu từ 0
      } else if (typeof dateTime === 'string') {
        // Nếu là string ISO date
        date = new Date(dateTime);
      } else if (dateTime instanceof Date) {
        // Nếu đã là Date object
        date = dateTime;
      } else {
        return 'N/A';
      }

      // Kiểm tra nếu date hợp lệ
      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error, dateTime);
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'REFUNDED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && codPayments.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 3,
        }}
      >
        <CircularProgress sx={{ color: '#4A90E2' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Card */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: 'white',
          borderRadius: '12px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WalletIcon sx={{ fontSize: 36, mr: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Quản lý thanh toán COD
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Xác nhận các thanh toán tiền mặt khi nhận hàng
            </Typography>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {codPayments.length}
              </Typography>
              <Typography variant="body2">Tổng số</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {
                  codPayments.filter((p) => p.paymentStatus === 'PENDING')
                    .length
                }
              </Typography>
              <Typography variant="body2">Chờ xác nhận</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content Card */}
      <Paper
        sx={{
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.15)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.15)',
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)',
              }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Danh sách thanh toán COD
            </Typography>
            <Button
              variant="contained"
              onClick={fetchPendingCODPayments}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <RefreshIcon />
              }
              sx={{
                borderRadius: 3,
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Làm mới
            </Button>
          </Box>

          {codPayments.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                backgroundColor: '#f8f9fa',
                borderRadius: 3,
                border: '2px dashed #ddd',
              }}
            >
              <PaymentIcon sx={{ fontSize: 64, color: '#bbb', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Không có thanh toán COD nào cần xác nhận
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tất cả các thanh toán đã được xử lý
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={{
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Mã thanh toán
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Khách hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Dịch vụ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Số tiền
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Ngày tạo
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#2c3e50',
                        textAlign: 'center',
                      }}
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {codPayments.map((payment) => (
                    <TableRow
                      key={payment.paymentId}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': {
                          backgroundColor: '#f0f8ff',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease',
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: '#4A90E2' }}>
                        #{payment.paymentId}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              mr: 2,
                              bgcolor: '#4A90E2',
                              width: 32,
                              height: 32,
                            }}
                          >
                            {payment.user?.fullName?.charAt(0) || 'K'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {payment.user?.fullName || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {payment.user?.email || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {payment.serviceType} #{payment.serviceId}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {payment.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatCurrency(payment.amount)}
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                            bgcolor: '#e3f2fd',
                            color: '#1565c0',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            payment.paymentStatus === 'PENDING'
                              ? 'Chờ xác nhận'
                              : payment.paymentStatus
                          }
                          color={getStatusColor(payment.paymentStatus)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(payment.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="Xác nhận thanh toán">
                          <IconButton
                            onClick={() => handleConfirmPayment(payment)}
                            disabled={payment.paymentStatus !== 'PENDING'}
                            sx={{
                              bgcolor:
                                payment.paymentStatus === 'PENDING'
                                  ? '#e8f5e8'
                                  : '#f5f5f5',
                              color:
                                payment.paymentStatus === 'PENDING'
                                  ? '#4caf50'
                                  : '#bbb',
                              '&:hover':
                                payment.paymentStatus === 'PENDING'
                                  ? {
                                      bgcolor: '#4caf50',
                                      color: 'white',
                                      transform: 'scale(1.1)',
                                    }
                                  : {},
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
            fontWeight: 700,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 2 }} />
            Xác nhận thanh toán tiền mặt
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedPayment && (
            <Box
              sx={{
                mb: 2,
                p: 3,
                bgcolor: '#f8f9fa',
                borderRadius: 3,
                border: '1px solid #e9ecef',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Mã thanh toán:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    #{selectedPayment.paymentId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Số tiền:
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(selectedPayment.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Khách hàng:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedPayment.user?.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Dịch vụ:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedPayment.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          <TextField
            fullWidth
            label="Ghi chú (tùy chọn)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thêm ghi chú về việc xác nhận thanh toán này..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={loading}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              fontWeight: 600,
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CheckCircleIcon />
            }
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(45deg, #4caf50, #45a049)',
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049, #4caf50)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CODPaymentManagementContent;

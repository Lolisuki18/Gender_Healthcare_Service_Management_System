import React, { useState, useEffect } from 'react';
import {
  Card,
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
  CircularProgress
} from '@mui/material';
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
        setError(response?.message || 'Failed to fetch COD payments');
      }
    } catch (error) {
      console.error('Error fetching COD payments:', error);
      setError(error.message || 'Failed to fetch COD payments');
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
      const response = await stiService.confirmCODPayment(selectedPayment.paymentId, notes);
      
      if (response && response.success) {
        setSuccess('COD payment confirmed successfully');
        notify.success('Success', 'COD payment confirmed successfully');
        setConfirmDialogOpen(false);
        fetchPendingCODPayments(); // Refresh the list
      } else {
        setError(response?.message || 'Failed to confirm payment');
        notify.error('Error', response?.message || 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError(error.message || 'Failed to confirm payment');
      notify.error('Error', error.message || 'Failed to confirm payment');
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
      currency: 'VND'
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Quản lý thanh toán tiền mặt
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Quản lý các thanh toán tiền mặt khi nhận hàng đang chờ xác nhận
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={fetchPendingCODPayments}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Làm mới
            </Button>
          </Box>

          {codPayments.length === 0 ? (
            <Alert severity="info">
              Không có thanh toán tiền mặt nào đang chờ xác nhận
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã thanh toán</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {codPayments.map((payment) => (
                    <TableRow key={payment.paymentId}>
                      <TableCell>#{payment.paymentId}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.user?.fullName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {payment.user?.email || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.serviceType} #{payment.serviceId}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {payment.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.paymentStatus === 'PENDING' ? 'Chờ xác nhận' : payment.paymentStatus}
                          color={getStatusColor(payment.paymentStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {formatDateTime(payment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleConfirmPayment(payment)}
                          disabled={payment.paymentStatus !== 'PENDING'}
                        >
                          Xác nhận thanh toán
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận thanh toán tiền mặt</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Mã thanh toán:</strong> #{selectedPayment.paymentId}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Khách hàng:</strong> {selectedPayment.user?.fullName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Số tiền:</strong> {formatCurrency(selectedPayment.amount)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Dịch vụ:</strong> {selectedPayment.description}
              </Typography>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CODPaymentManagementContent;
/**
 * TestConfirmationModal.js
 *
 * Modal xác nhận xét nghiệm STI
 * Hiển thị thông tin chi tiết của xét nghiệm trước khi staff xác nhận
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TestConfirmationModal = ({
  open,
  onClose,
  test,
  onConfirm,
  loading = false,
  formatAppointmentDate,
  renderStatusChip,
  PAYMENT_LABELS,
}) => {
  if (!test) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pt: 4,
          pb: 2,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
            color: '#1976d2',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1F2937',
            fontSize: '1.5rem',
          }}
        >
          Xác nhận xét nghiệm STI
        </Typography>
        <Chip
          label={
            test.paymentStatus === 'COMPLETED'
              ? 'Đã thanh toán'
              : 'Chưa thanh toán'
          }
          size="small"
          color={test.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}
          sx={{ mt: 1 }}
        />
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 4 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: '#1565c0', fontWeight: 600 }}
          >
            Thông tin xét nghiệm
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} size={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Mã xét nghiệm
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  #{test.testId}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} size={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Khách hàng
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {test.customerName}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} size={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Số điện thoại
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {test.customerPhone}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} size={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Ngày hẹn
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatAppointmentDate(test.appointmentDate)}
                </Typography>
              </Paper>
            </Grid>

            <Grid item size={4} xs={12} sm={6}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Tổng chi phí
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="success.main"
                >
                  {test.totalPrice?.toLocaleString('vi-VN')}đ
                </Typography>
              </Paper>
            </Grid>

            <Grid item size={4} xs={12} sm={6}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {PAYMENT_LABELS[test.paymentMethod] || test.paymentMethod}
                </Typography>
              </Paper>
            </Grid>

            {/* Hiển thị thông tin các xét nghiệm trong gói */}
            {test.packageId && test.testServiceConsultantNotes && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Các xét nghiệm trong gói
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {test.testServiceConsultantNotes.map((service) => (
                      <Chip
                        key={service.id}
                        label={service.serviceName}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Ghi chú của khách hàng - luôn hiển thị */}
            <Grid item xs={12} size={12}>
              <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#fff7ed', borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Ghi chú của khách hàng
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle:
                      !test.customerNotes || test.customerNotes.trim() === ''
                        ? 'italic'
                        : 'normal',
                    color:
                      !test.customerNotes || test.customerNotes.trim() === ''
                        ? 'text.secondary'
                        : 'text.primary',
                  }}
                >
                  {test.customerNotes && test.customerNotes.trim() !== ''
                    ? test.customerNotes
                    : 'Khách hàng không có ghi chú'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} size={12}>
            <Paper
              elevation={1}
              sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}
            >
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Dịch vụ/Gói xét nghiệm
              </Typography>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                {test.serviceName}
              </Typography>
              {test.serviceDescription && (
                <Typography variant="body2" color="textSecondary">
                  {test.serviceDescription}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Box
            sx={{ mt: 4, p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}
          >
            <Typography variant="body1" color="success.main" fontWeight={500}>
              ✓ Xác nhận xét nghiệm này sẽ chuyển trạng thái từ "Chờ xử lý" sang
              "Đã xác nhận"
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Sau khi xác nhận, bạn có thể tiến hành lấy mẫu xét nghiệm cho
              khách hàng.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          gap: 2,
          p: 3,
          pt: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 120,
            py: 1.5,
            px: 3,
            borderRadius: '12px',
            borderColor: '#D1D5DB',
            color: '#6B7280',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Hủy bỏ
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} /> : <CheckCircleIcon />
          }
          sx={{
            minWidth: 120,
            py: 1.5,
            px: 3,
            borderRadius: '12px',
            backgroundColor: '#1976d2',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
            '&:hover': {
              backgroundColor: '#1565c0',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.5)',
            },
          }}
        >
          {loading ? 'Đang xác nhận...' : 'Xác nhận xét nghiệm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestConfirmationModal;

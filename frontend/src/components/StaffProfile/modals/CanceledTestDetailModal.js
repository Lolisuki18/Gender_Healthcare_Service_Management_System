import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const CanceledTestDetailModal = ({
  open,
  onClose,
  test,
  formatDateDisplay,
}) => {
  if (!test) return null;
  // Debug: log object test để kiểm tra cancelReason
  // console.log('CanceledTestDetailModal test:', test);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(239,83,80,0.18)',
          overflow: 'visible',
          background: 'linear-gradient(135deg, #fff 80%, #f8fafc 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#EF5350',
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 0.5,
          py: 2.5,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          background: 'linear-gradient(90deg, #fff 60%, #ffeaea 100%)',
        }}
      >
        <CancelIcon color="error" sx={{ mr: 1, fontSize: 32 }} />
        Chi tiết xét nghiệm đã hủy
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          px: 4,
          py: 3,
          background: 'linear-gradient(135deg, #fff 80%, #f8fafc 100%)',
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Mã xét nghiệm
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#EF5350' }}>
              #{test.testId}
            </Typography>
          </Box>
          <Box sx={{ flex: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Khách hàng
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {test.customerName}{' '}
              {test.customerPhone && `(${test.customerPhone})`}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Dịch vụ
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {test.serviceName || test.diagnosis || 'Không có'}
            </Typography>
            {test.totalPrice && (
              <Typography variant="caption" color="text.secondary">
                {test.totalPrice.toLocaleString('vi-VN')}đ
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày hẹn
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {test.appointmentDate
                ? formatDateDisplay(test.appointmentDate)
                : 'Không có'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Trạng thái
            </Typography>
            <Typography color="error" sx={{ fontWeight: 700 }}>
              Đã hủy
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Phương thức thanh toán
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {test.paymentMethod || 'Không có'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày tạo
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {test.createdAt ? formatDateDisplay(test.createdAt) : 'Không có'}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày cập nhật
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {test.updatedAt ? formatDateDisplay(test.updatedAt) : 'Không có'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            my: 2,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #fff 60%, #ffeaea 100%)',
            border: '1px solid #EF5350',
            boxShadow: '0 2px 8px #EF535022',
          }}
        >
          <Typography
            variant="subtitle2"
            color="error"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            Lý do hủy
          </Typography>
          <Typography color="error" sx={{ fontWeight: 700, fontSize: 18 }}>
            {test.cancelReason && String(test.cancelReason).trim()
              ? test.cancelReason
              : 'Không có'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CanceledTestDetailModal;

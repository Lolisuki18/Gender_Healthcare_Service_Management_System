import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Science as ScienceIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
  QrCode as QrCodeIcon,
  Cancel as CancelIcon,
  MedicalServices as MedicalIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { formatDateDisplay } from '../../utils/dateUtils';

const MedicalHistoryDetailModal = ({
  open,
  onClose,
  record,
  formatDateDisplay,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành':
      case 'COMPLETED':
        return '#4CAF50';
      case 'Đang xử lý':
      case 'PENDING':
      case 'CONFIRMED':
        return '#F39C12';
      case 'Hủy':
      case 'CANCELED':
        return '#E53E3E';
      case 'RESULTED':
        return '#3498DB';
      case 'SAMPLED':
        return '#9B59B6';
      default:
        return '#607D8B';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Hoàn thành':
      case 'COMPLETED':
        return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'Đang xử lý':
      case 'PENDING':
      case 'CONFIRMED':
        return <ScheduleIcon sx={{ color: '#F39C12' }} />;
      case 'Hủy':
      case 'CANCELED':
        return <ErrorIcon sx={{ color: '#E53E3E' }} />;
      case 'RESULTED':
        return <ScienceIcon sx={{ color: '#3498DB' }} />;
      case 'SAMPLED':
        return <MedicalIcon sx={{ color: '#9B59B6' }} />;
      default:
        return <InfoIcon sx={{ color: '#607D8B' }} />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'VISA':
      case 'CREDIT_CARD':
        return <CreditCardIcon />;
      case 'QR_CODE':
        return <QrCodeIcon />;
      case 'COD':
        return <MoneyIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'VISA':
        return 'Thẻ tín dụng';
      case 'QR_CODE':
        return 'QR Code';
      case 'COD':
        return 'Tiền mặt';
      default:
        return method;
    }
  };

  if (!record) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        },
      }}
    >
      {/* Header với gradient đẹp */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          px: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              mr: 2,
              width: 48,
              height: 48,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <MedicalIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Chi tiết lịch khám
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
              #{record.testId || record.id}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, background: 'transparent' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#667eea' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 3 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ p: 3 }}>
            {/* Thông tin cơ bản */}
            <Card
              sx={{
                mb: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      mr: 2,
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: '#1e293b' }}
                  >
                    Thông tin cơ bản
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Dịch vụ */}
                  <Grid item size={12} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <HospitalIcon
                          sx={{ mr: 1.5, color: '#667eea', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Dịch vụ
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#1e293b', ml: 3.5 }}
                      >
                        {record.serviceName || record.diagnosis}
                      </Typography>
                    </Box>
                  </Grid>
                  {/* Mô tả dịch vụ */}
                  {record.serviceDescription && (
                    <Grid item size={12} xs={12}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(102, 126, 234, 0.05)',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          mb: 2,
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          maxWidth: '100%',
                          textAlign: 'left',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <DescriptionIcon
                            sx={{ mr: 1.5, color: '#667eea', fontSize: 20 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: '#64748b' }}
                          >
                            Mô tả dịch vụ
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: '#1e293b',
                            ml: 3.5,
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                          }}
                        >
                          {record.serviceDescription}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {/* Tên bác sĩ */}
                  <Grid item size={12} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <PersonIcon
                          sx={{ mr: 1.5, color: '#667eea', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Bác sĩ
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#1e293b', ml: 3.5 }}
                      >
                        {record.consultantName ||
                          record.doctor ||
                          'Chưa xác định'}
                      </Typography>
                    </Box>
                  </Grid>
                  {/* Ngày khám */}
                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <CalendarIcon
                          sx={{ mr: 1.5, color: '#667eea', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Ngày khám
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#1e293b', ml: 3.5 }}
                      >
                        {formatDateDisplay(record.date)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Trạng thái */}
                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        {getStatusIcon(record.status)}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b', ml: 0.5 }}
                        >
                          Trạng thái
                        </Typography>
                      </Box>
                      <Chip
                        label={(() => {
                          switch ((record.status || '').toUpperCase()) {
                            case 'COMPLETED':
                              return 'Hoàn thành';
                            case 'PENDING':
                              return 'Đang xử lý';
                            case 'RESULTED':
                              return 'Đã có kết quả';
                            case 'CONFIRMED':
                              return 'Đã xác nhận';
                            case 'SAMPLED':
                              return 'Đã lấy mẫu';
                            case 'CANCELED':
                              return 'Đã hủy';
                            default:
                              return record.status || 'Không xác định';
                          }
                        })()}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(record.status)}15`,
                          color: getStatusColor(record.status),
                          border: `1px solid ${getStatusColor(record.status)}30`,
                          fontWeight: 600,
                          ml: 3.5,
                          borderRadius: '8px',
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Thông tin thanh toán */}
            <Card
              sx={{
                mb: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      mr: 2,
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    }}
                  >
                    <ReceiptIcon />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: '#1e293b' }}
                  >
                    Thông tin thanh toán
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <PaymentIcon
                          sx={{ mr: 1.5, color: '#4CAF50', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Phương thức thanh toán
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', ml: 3.5 }}
                      >
                        {getPaymentMethodIcon(record.paymentMethod)}
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: 500, color: '#1e293b' }}
                        >
                          {getPaymentMethodText(record.paymentMethod)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <MoneyIcon
                          sx={{ mr: 1.5, color: '#4CAF50', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Số tiền
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          ml: 3.5,
                          fontWeight: 700,
                          color: '#2E7D32',
                          fontSize: '1.1rem',
                        }}
                      >
                        {record.totalPrice
                          ? `${record.totalPrice.toLocaleString('vi-VN')} VNĐ`
                          : 'Chưa xác định'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <PaymentIcon
                          sx={{ mr: 1.5, color: '#4CAF50', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Trạng thái thanh toán
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          record.paymentStatus === 'COMPLETED'
                            ? 'Đã thanh toán'
                            : 'Chưa thanh toán'
                        }
                        size="small"
                        color={
                          record.paymentStatus === 'COMPLETED'
                            ? 'success'
                            : 'warning'
                        }
                        sx={{
                          ml: 3.5,
                          fontWeight: 600,
                          borderRadius: '8px',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <EventIcon
                          sx={{ mr: 1.5, color: '#4CAF50', fontSize: 20 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b' }}
                        >
                          Ngày thanh toán
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ ml: 3.5, fontWeight: 500, color: '#1e293b' }}
                      >
                        {record.paidAt
                          ? formatDateDisplay(record.paidAt)
                          : 'Chưa thanh toán'}
                      </Typography>
                    </Box>
                  </Grid>
                  {record.paymentTransactionId && (
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(76, 175, 80, 0.05)',
                          border: '1px solid rgba(76, 175, 80, 0.1)',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <PaymentIcon
                            sx={{ mr: 1.5, color: '#4CAF50', fontSize: 20 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: '#64748b' }}
                          >
                            Mã giao dịch
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            ml: 3.5,
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: '0.9rem',
                          }}
                        >
                          {record.paymentTransactionId}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {record.stripePaymentIntentId && (
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(76, 175, 80, 0.05)',
                          border: '1px solid rgba(76, 175, 80, 0.1)',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <PaymentIcon
                            sx={{ mr: 1.5, color: '#4CAF50', fontSize: 20 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: '#64748b' }}
                          >
                            Stripe Payment Intent
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            ml: 3.5,
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: '0.9rem',
                          }}
                        >
                          {record.stripePaymentIntentId}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Ghi chú */}
            {(record.customerNotes || record.consultantNotes) && (
              <Card
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #FF9800, #F57C00)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                      }}
                    >
                      <DescriptionIcon />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: '#1e293b' }}
                    >
                      Ghi chú
                    </Typography>
                  </Box>

                  {record.customerNotes && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}
                      >
                        Ghi chú của khách hàng:
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(255, 152, 0, 0.05)',
                          border: '1px solid rgba(255, 152, 0, 0.1)',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            color: '#1e293b',
                          }}
                        >
                          {record.customerNotes || 'Không có ghi chú'}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {record.consultantNotes && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}
                      >
                        Ghi chú của bác sĩ:
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(255, 152, 0, 0.05)',
                          border: '1px solid rgba(255, 152, 0, 0.1)',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            color: '#1e293b',
                          }}
                        >
                          {record.consultantNotes}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Thông tin hủy (nếu có) */}
            {record.cancelReason && (
              <Card
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #f44336, #d32f2f)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      }}
                    >
                      <CancelIcon />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: '#1e293b' }}
                    >
                      Lý do hủy
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(244, 67, 54, 0.05)',
                      border: '1px solid rgba(244, 67, 54, 0.1)',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        color: '#1e293b',
                        fontWeight: 500,
                      }}
                    >
                      {record.cancelReason}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Thông tin nhân viên */}
            {(record.staffName || record.staffId) && (
              <Card
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #9B59B6, #8E44AD)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: '#1e293b' }}
                    >
                      Thông tin nhân viên
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {record.staffName && (
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(155, 89, 182, 0.05)',
                            border: '1px solid rgba(155, 89, 182, 0.1)',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <PersonIcon
                              sx={{ mr: 1.5, color: '#9B59B6', fontSize: 20 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: '#64748b' }}
                            >
                              Nhân viên phụ trách
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ ml: 3.5, fontWeight: 500, color: '#1e293b' }}
                          >
                            {record.staffName}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {record.staffId && (
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(155, 89, 182, 0.05)',
                            border: '1px solid rgba(155, 89, 182, 0.1)',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <PersonIcon
                              sx={{ mr: 1.5, color: '#9B59B6', fontSize: 20 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: '#64748b' }}
                            >
                              ID Nhân viên
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ ml: 3.5, fontWeight: 500, color: '#1e293b' }}
                          >
                            #{record.staffId}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {record.consultantId && (
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(155, 89, 182, 0.05)',
                            border: '1px solid rgba(155, 89, 182, 0.1)',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <PersonIcon
                              sx={{ mr: 1.5, color: '#9B59B6', fontSize: 20 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: '#64748b' }}
                            >
                              ID Bác sĩ tư vấn
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ ml: 3.5, fontWeight: 500, color: '#1e293b' }}
                          >
                            #{record.consultantId}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Thông tin bổ sung */}
            <Card
              sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #607D8B, #455A64)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      mr: 2,
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #607D8B, #455A64)',
                    }}
                  >
                    <InfoIcon />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: '#1e293b' }}
                  >
                    Thông tin bổ sung
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(96, 125, 139, 0.05)',
                        border: '1px solid rgba(96, 125, 139, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}
                      >
                        Ngày tạo
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#1e293b' }}
                      >
                        {record.createdAt
                          ? formatDateDisplay(record.createdAt)
                          : 'Không xác định'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item size={6} xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(96, 125, 139, 0.05)',
                        border: '1px solid rgba(96, 125, 139, 0.1)',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}
                      >
                        Ngày cập nhật cuối
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#1e293b' }}
                      >
                        {record.updatedAt
                          ? formatDateDisplay(record.updatedAt)
                          : 'Không xác định'}
                      </Typography>
                    </Box>
                  </Grid>

                  {record.resultDate && (
                    <Grid item size={12} xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(96, 125, 139, 0.05)',
                          border: '1px solid rgba(96, 125, 139, 0.1)',
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}
                        >
                          Ngày có kết quả
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, color: '#1e293b' }}
                        >
                          {formatDateDisplay(record.resultDate)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {/* {record.serviceId && (
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(96, 125, 139, 0.05)',
                          border: '1px solid rgba(96, 125, 139, 0.1)',
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}
                        >
                          ID Dịch vụ
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, color: '#1e293b' }}
                        >
                          #{record.serviceId}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {record.packageId && (
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(96, 125, 139, 0.05)',
                          border: '1px solid rgba(96, 125, 139, 0.1)',
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}
                        >
                          ID Gói xét nghiệm
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, color: '#1e293b' }}
                        >
                          #{record.packageId}
                        </Typography>
                      </Box>
                    </Grid>
                  )} */}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5a6fd8',
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalHistoryDetailModal;

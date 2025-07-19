/**
 * InvoicesContent.js - Component quản lý hóa đơn
 *
 * Chức năng:
 * - Hiển thị danh sách hóa đơn
 * - Chi tiết từng hóa đơn (services, amounts, taxes)
 * - Invoice status tracking
 * - Download PDF invoices
 * - Payment status integration
 *
 * Features:
 * - Invoice listing với search/filter
 * - Detailed invoice breakdown
 * - Payment status indicators
 * - PDF generation và download
 * - Historical invoice archive
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import apiClient from '@/services/api';
import { formatDateDisplay } from '@/utils/dateUtils';
import ExportInvoicePDF from '@/components/modals/ExportInvoicePDF';
import PaymentSection from '../CustomerProfile/../TestRegistration/PaymentSection';
import stiService from '../../services/stiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)', // Light glass background for medical
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)', // Medical blue border
  color: '#2D3748', // Dark text for readability
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', // Lighter shadow
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#2D3748', // Dark text for readability
  borderBottom: '1px solid rgba(74, 144, 226, 0.15)', // Medical blue border
  fontSize: '0.875rem',
}));

const StyledTableHead = styled(TableCell)(({ theme }) => ({
  color: 'rgba(74, 144, 226, 0.9)', // Medical blue
  fontWeight: 600,
  borderBottom: '2px solid rgba(74, 144, 226, 0.2)', // Lighter medical blue
  backgroundColor: 'rgba(74, 144, 226, 0.05)', // Very light medical blue
}));

const InvoicesContent = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openExportPDF, setOpenExportPDF] = useState(false);
  const [exportInvoice, setExportInvoice] = useState(null);
  // State cho modal thanh toán lại
  const [retryModalOpen, setRetryModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('VISA');
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardList, setCardList] = useState([]); // Lưu danh sách thẻ từ PaymentSection
  const [retryLoading, setRetryLoading] = useState(false);


  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/sti-services/my-tests');
        // API trả về { data: { data: [STITestResponse, ...] } }
        setInvoices(res.data?.data || []);
      } catch (err) {
        setError('Không thể tải danh sách hóa đơn.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Map status/paymentStatus sang màu và text
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          bg: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
          text: 'Đã hoàn thành',
        };
      case 'PENDING':
        return {
          bg: 'linear-gradient(45deg, #F39C12, #E67E22)',
          text: 'Chờ xác nhận',
        };
      case 'CONFIRMED':
        return {
          bg: 'linear-gradient(45deg, #3498DB, #4A90E2)',
          text: 'Đã xác nhận',
        };
      case 'SAMPLED':
        return {
          bg: 'linear-gradient(45deg, #8e44ad, #6c3483)',
          text: 'Đã lấy mẫu',
        };
      case 'RESULTED':
        return {
          bg: 'linear-gradient(45deg, #00b894, #00cec9)',
          text: 'Có kết quả',
        };
      case 'CANCELED':
        return {
          bg: 'linear-gradient(45deg, #E74C3C, #C0392B)',
          text: 'Đã hủy',
        };
      default:
        return {
          bg: 'linear-gradient(45deg, #607D8B, #455A64)',
          text: status || 'Không xác định',
        };
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'COMPLETED':
        return {
          bg: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
          text: 'Đã thanh toán',
        };
      case 'PENDING':
        return {
          bg: 'linear-gradient(45deg, #F39C12, #E67E22)',
          text: 'Chờ thanh toán',
        };
      case 'FAILED':
        return {
          bg: 'linear-gradient(45deg, #E74C3C, #C0392B)',
          text: 'Thanh toán thất bại',
        };
      default:
        return {
          bg: 'linear-gradient(45deg, #607D8B, #455A64)',
          text: paymentStatus || 'Không xác định',
        };
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenInvoiceDialog(true);
  };

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setRetryModalOpen(true);
    setSelectedPaymentMethod('VISA');
    setSelectedCard(null);
  };

  const handleCloseRetryModal = () => {
    setRetryModalOpen(false);
    setSelectedInvoice(null);
    setSelectedPaymentMethod('VISA');
    setSelectedCard(null);
  };

  const handleRetryPayment = async () => {
    if (!selectedInvoice || !selectedPaymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }
    // Đảm bảo paymentMethod hợp lệ
    const validMethods = ['COD', 'VISA', 'QR_CODE'];
    let paymentMethod = selectedPaymentMethod;
    if (!validMethods.includes(paymentMethod)) {
      paymentMethod = 'VISA'; // fallback mặc định
    }
    let retryData = {
      paymentMethod
    };
    if (paymentMethod === 'VISA') {
      let cardObj = selectedCard;
      // ...resolve cardObj như cũ...
      if ((typeof cardObj === 'string' || typeof cardObj === 'number') && cardList.length > 0) {
        cardObj = cardList.find(card => card.paymentInfoId == cardObj);
      }
      if (!cardObj && cardList.length === 1) {
        cardObj = cardList[0];
      }
      if (!cardObj) {
        toast.error('Vui lòng chọn thẻ thanh toán');
        return;
      }
      if (typeof cardObj !== 'object' || !cardObj.cardNumber) {
        toast.error('Không lấy được thông tin thẻ. Vui lòng chọn lại hoặc thêm mới thẻ.');
        return;
      }
      let cardNumRaw = '';
      if (typeof cardObj.cardNumber === 'string') {
        cardNumRaw = cardObj.cardNumber;
      } else if (typeof cardObj.value === 'string') {
        cardNumRaw = cardObj.value;
      } else if (typeof cardObj.number === 'string') {
        cardNumRaw = cardObj.number;
      }
      const rawCardNumber = cardNumRaw.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(rawCardNumber)) {
        toast.error('Số thẻ phải gồm đúng 16 chữ số. Vui lòng kiểm tra lại.');
        return;
      }
      // Đảm bảo field gửi lên là 'cvv' (không phải 'cvc')
      let cleanCard = {
        ...cardObj,
        cardNumber: rawCardNumber
      };
      if (cleanCard.cvc && !cleanCard.cvv) {
        cleanCard.cvv = cleanCard.cvc;
        delete cleanCard.cvc;
      }
      retryData = {
        ...retryData,
        ...cleanCard
      };
    }
    if (selectedInvoice.appointmentDate) {
      retryData.appointmentDate = selectedInvoice.appointmentDate;
    }
    setRetryLoading(true);
    try {
      await stiService.retryPayment(selectedInvoice.testId || selectedInvoice.paymentId, retryData);
      toast.success('Thanh toán lại thành công!');
      handleCloseRetryModal();
      setLoading(true);
      const res = await apiClient.get('/sti-services/my-tests');
      setInvoices(res.data?.data || []);
    } catch (error) {
      toast.error(error?.message || 'Thanh toán thất bại. Vui lòng thử lại!');
    } finally {
      setRetryLoading(false);
    }
  };

  const handleOpenExportPDF = (invoice) => {
    setExportInvoice(invoice);
    setOpenExportPDF(true);
  };

  const handleCloseExportPDF = () => {
    setOpenExportPDF(false);
    setExportInvoice(null);
  };

  // Summary statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(
    (inv) => inv.paymentStatus === 'COMPLETED'
  ).length;
  const pendingAmount = invoices
    .filter((inv) => inv.paymentStatus !== 'COMPLETED')
    .reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);
  const totalAmount = invoices.reduce(
    (sum, inv) => sum + (inv.totalPrice || 0),
    0
  );

  if (loading)
    return (
      <Box p={4}>
        <Typography>Đang tải hóa đơn...</Typography>
      </Box>
    );
  if (error)
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 40, color: '#4A90E2', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              {totalInvoices}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Tổng số hóa đơn
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <PaymentIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              {paidInvoices}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Đã thanh toán
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <FileDownloadIcon sx={{ fontSize: 40, color: '#F39C12', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              {formatCurrency(pendingAmount)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Chờ thanh toán
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 40, color: '#607D8B', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              {formatCurrency(totalAmount)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Tổng giá trị
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
      {/* Invoices Table */}
      <StyledPaper>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
            Danh sách hóa đơn
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHead>Mã hóa đơn</StyledTableHead>
                <StyledTableHead>Ngày tạo</StyledTableHead>
                <StyledTableHead>Dịch vụ</StyledTableHead>
                <StyledTableHead>Nhân viên đảm nhận</StyledTableHead>
                <StyledTableHead>Số tiền</StyledTableHead>
                <StyledTableHead>Thanh toán</StyledTableHead>
                <StyledTableHead>Thao tác</StyledTableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const paymentInfo = getPaymentStatusColor(
                  invoice.paymentStatus
                );
                return (
                  <TableRow key={invoice.testId || invoice.paymentId} hover>
                    <StyledTableCell sx={{ fontWeight: 600 }}>
                      {invoice.testId || invoice.paymentId}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatDateDisplay(invoice.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell>{invoice.serviceName}</StyledTableCell>
                    <StyledTableCell>
                      {invoice.staffName || invoice.consultantName || ''}
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 600 }}>
                      {formatCurrency(invoice.totalPrice)}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={paymentInfo.text}
                        size="small"
                        sx={{
                          background: paymentInfo.bg,
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {' '}
                        <IconButton
                          size="small"
                          onClick={() => handleViewInvoice(invoice)}
                          sx={{
                            color: '#4A90E2',
                            '&:hover': {
                              backgroundColor: 'rgba(74, 144, 226, 0.1)',
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>{' '}
                        <IconButton
                          size="small"
                          onClick={() => handleOpenExportPDF(invoice)}
                          sx={{
                            color: '#4CAF50',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            },
                          }}
                          disabled={invoice.paymentStatus !== 'COMPLETED'}
                          title={
                            invoice.paymentStatus !== 'COMPLETED'
                              ? 'Chỉ xuất hóa đơn khi đã thanh toán'
                              : 'Tải hóa đơn PDF'
                          }
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        {invoice.paymentStatus !== 'COMPLETED' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handlePayInvoice(invoice)}
                            sx={{
                              background:
                                'linear-gradient(45deg, #4A90E2, #3498DB)',
                              fontSize: '0.75rem',
                              px: 1,
                              minWidth: 'auto',
                            }}
                          >
                            Thanh toán
                          </Button>
                        )}
      {/* Modal thanh toán lại */}
      <Dialog 
        open={retryModalOpen} 
        onClose={handleCloseRetryModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          fontSize: '1.5rem', 
          fontWeight: 700,
          borderBottom: '1px solid #E2E8F0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1, color: '#3b82f6' }} />
            Thanh toán lại hóa đơn
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedInvoice ? (
            <>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#F7FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#2D3748', fontWeight: 600 }}>
                  Thông tin hóa đơn
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Dịch vụ:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedInvoice.serviceName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Số tiền:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#E53E3E' }}>{formatCurrency(selectedInvoice.totalPrice)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Mã hóa đơn:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedInvoice.testId || selectedInvoice.paymentId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#E53E3E' }}>{selectedInvoice.paymentStatus}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2D3748', fontWeight: 600 }}>
                  Chọn phương thức thanh toán mới
                </Typography>
                <PaymentSection
                  selectedPaymentMethod={selectedPaymentMethod}
                  onPaymentMethodChange={setSelectedPaymentMethod}
                  selectedCard={selectedCard}
                  // Đảm bảo luôn có cardList nếu chỉ có card object
                  onCardChange={(card, cards) => {
                    setSelectedCard(card);
                    if (Array.isArray(cards)) {
                      setCardList(cards);
                    } else if (card && typeof card === 'object' && cardList.length === 0) {
                      setCardList([card]);
                    }
                  }}
                  disabled={retryLoading}
                />
              </Box>
            </>
          ) : (
            <Typography>Đang tải thông tin hóa đơn...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0', gap: 2 }}>
          <Button 
            onClick={handleCloseRetryModal}
            variant="outlined"
            sx={{
              borderColor: '#CBD5E0',
              color: '#4A5568',
              '&:hover': {
                borderColor: '#A0AEC0',
                backgroundColor: '#F7FAFC',
              },
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleRetryPayment} 
            variant="contained"
            disabled={retryLoading || !selectedPaymentMethod || (selectedPaymentMethod === 'VISA' && !selectedCard)}
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
              '&:disabled': {
                backgroundColor: '#CBD5E0',
              },
            }}
          >
            {retryLoading ? 'Đang xử lý...' : 'Thanh toán lại'}
          </Button>
        </DialogActions>
      </Dialog>
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>
      {/* Invoice Detail Dialog */}{' '}
      <Dialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(74, 144, 226, 0.15)',
            color: '#2D3748',
          },
        }}
      >
        {' '}
        <DialogTitle
          sx={{
            color: '#2D3748',
            borderBottom: '1px solid rgba(74, 144, 226, 0.15)',
          }}
        >
          Chi tiết hóa đơn
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1, md: 4 } }}>
          {selectedInvoice && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, md: 3 },
                alignItems: 'center',
                minHeight: 220,
                width: '100%',
              }}
            >
              {/* Icon hóa đơn */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  mb: { xs: 1, md: 2 },
                }}
              >
                <ReceiptIcon
                  sx={{
                    fontSize: { xs: 48, md: 72 },
                    background:
                      'linear-gradient(90deg, #4A90E2 30%, #2ECC71 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    opacity: 0.7,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 2 }}
                >
                  HÓA ĐƠN
                </Typography>
              </Box>
              {/* Thông tin hóa đơn */}
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)',
                  borderRadius: 4,
                  p: { xs: 2, md: 3 },
                  width: '100%',
                  mb: { xs: 1, md: 2 },
                  boxShadow: '0 2px 12px 0 rgba(74,144,226,0.08)',
                  border: '1px solid #e3eafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  alignItems: 'stretch',
                  textAlign: 'left',
                }}
              >
                {/* Mã hóa đơn */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#1565c0', fontWeight: 600 }}
                  >
                    Mã hóa đơn
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: '#2D3748', fontWeight: 700 }}
                  >
                    {selectedInvoice.testId || selectedInvoice.paymentId}
                  </Typography>
                </Box>
                {/* Ngày tạo */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#1565c0', fontWeight: 600 }}
                  >
                    Ngày tạo
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2D3748' }}>
                    {formatDateDisplay(selectedInvoice.createdAt)}
                  </Typography>
                </Box>
                {/* Dịch vụ */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#1565c0', fontWeight: 600 }}
                  >
                    Dịch vụ
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2D3748' }}>
                    {selectedInvoice.serviceName}
                  </Typography>
                </Box>
                {/* Nhân viên đảm nhận */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#1565c0', fontWeight: 600 }}
                  >
                    Nhân viên đảm nhận
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2D3748' }}>
                    {selectedInvoice.staffName ||
                      selectedInvoice.consultantName ||
                      ''}
                  </Typography>
                </Box>
              </Box>
              {/* Số tiền và trạng thái */}
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, #e8f5e9 60%, #f8fafc 100%)',
                  borderRadius: 4,
                  p: { xs: 2, md: 3 },
                  width: '100%',
                  mb: { xs: 1, md: 2 },
                  boxShadow: '0 2px 12px 0 rgba(76,175,80,0.08)',
                  border: '1px solid #e0f2f1',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#388e3c', fontWeight: 600 }}
                  >
                    Số tiền
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: '#27ae60', fontWeight: 700 }}
                  >
                    {formatCurrency(selectedInvoice.totalPrice)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#388e3c', fontWeight: 600, mt: 1 }}
                  >
                    Trạng thái
                  </Typography>
                  <Chip
                    label={getStatusColor(selectedInvoice.status).text}
                    sx={{
                      background: getStatusColor(selectedInvoice.status).bg,
                      color: '#fff',
                      fontWeight: 600,
                      px: 2,
                      fontSize: '1rem',
                      mb: 1,
                      boxShadow: '0 1px 4px 0 rgba(44, 62, 80, 0.08)',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#388e3c', fontWeight: 600 }}
                  >
                    Thanh toán
                  </Typography>
                  <Chip
                    label={
                      getPaymentStatusColor(selectedInvoice.paymentStatus).text
                    }
                    sx={{
                      background: getPaymentStatusColor(
                        selectedInvoice.paymentStatus
                      ).bg,
                      color: '#fff',
                      fontWeight: 600,
                      px: 2,
                      fontSize: '1rem',
                      boxShadow: '0 1px 4px 0 rgba(44, 62, 80, 0.08)',
                    }}
                  />
                </Box>
              </Box>
              {/* Ghi chú và thanh toán */}
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, #f3e5f5 60%, #f8fafc 100%)',
                  borderRadius: 4,
                  p: { xs: 2, md: 3 },
                  width: '100%',
                  boxShadow: '0 2px 12px 0 rgba(156,39,176,0.08)',
                  border: '1px solid #ede7f6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#8e24aa', fontWeight: 600 }}
                >
                  Ghi chú khách hàng
                </Typography>
                <Typography variant="body2" sx={{ color: '#2D3748' }}>
                  {selectedInvoice.customerNotes || 'Không có'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#8e24aa', fontWeight: 600 }}
                >
                  Ghi chú bác sĩ/nhân viên
                </Typography>
                <Typography variant="body2" sx={{ color: '#2D3748' }}>
                  {selectedInvoice.consultantNotes || 'Không có'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#8e24aa', fontWeight: 600 }}
                >
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body2" sx={{ color: '#2D3748' }}>
                  {selectedInvoice.paymentMethod || '---'}
                </Typography>
                {selectedInvoice.paymentStatus === 'COMPLETED' && (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#8e24aa', fontWeight: 600 }}
                    >
                      Ngày thanh toán
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2D3748' }}>
                      {formatDateDisplay(selectedInvoice.paidAt)}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>{' '}
        <DialogActions
          sx={{ p: 3, borderTop: '1px solid rgba(74, 144, 226, 0.15)' }}
        >
          <Button
            onClick={() => setOpenInvoiceDialog(false)}
            sx={{ color: '#4A5568' }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {openExportPDF && exportInvoice && (
        <ExportInvoicePDF
          invoice={exportInvoice}
          onClose={handleCloseExportPDF}
        />
      )}
    </Box>
  );
};

export default InvoicesContent;

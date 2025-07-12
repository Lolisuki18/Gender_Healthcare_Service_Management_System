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

import React, { useState, useEffect, useRef } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import apiClient from '@/services/api';
import { formatDateDisplay } from '@/utils/dateUtils';
import ExportInvoicePDF from '@/components/modals/ExportInvoicePDF';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  // Ref cho export PDF
  const pdfRef = useRef();

  // Hàm xuất PDF giống ExportInvoicePDF
  const handleExportInvoicePDF = async (invoice) => {
    // Tạo một div ẩn để render nội dung hóa đơn
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    // Render nội dung hóa đơn vào container
    const name = 'PHÒNG KHÁM ĐA KHOA ABC';
    const address = '123 Đường Sức Khỏe, Quận 1, TP.HCM';
    const phone = '0123 456 789';
    const tax = 'MST: 0123456789';
    const serviceDetails = invoice.serviceDetails || [
      {
        name: invoice.serviceName || 'Dịch vụ',
        price: invoice.totalPrice || 0,
      },
    ];
    // Tạo nội dung HTML đơn giản (có thể copy từ ExportInvoicePDF)
    container.innerHTML = `
      <div style="background:#fff;padding:32px;border-radius:12px;width:600px;font-family:sans-serif;">
        <div style="display:flex;align-items:center;margin-bottom:8px;">
          <div style="width:48px;height:48px;background:#e3f2fd;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:12px;">
            <svg width="32" height="32" fill="#4A90E2"><rect width="32" height="32" rx="6" fill="#4A90E2" opacity="0.15"/></svg>
          </div>
          <div>
            <div style="font-weight:700;color:#1976d2;font-size:20px;">${name}</div>
            <div style="color:#4A5568;font-size:14px;">${address}</div>
            <div style="color:#4A5568;font-size:14px;">SĐT: ${phone} &nbsp; ${tax}</div>
          </div>
        </div>
        <div style="border-bottom:1px solid #e3eafc;margin-bottom:16px;"></div>
        <div style="font-size:24px;font-weight:700;color:#1976d2;text-align:center;margin-bottom:8px;">HÓA ĐƠN DỊCH VỤ Y TẾ</div>
        <div style="border-bottom:1px solid #e3eafc;margin-bottom:16px;"></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <div>
            <div><b>Số HĐ:</b> HDYT-${String(invoice.testId || invoice.paymentId).padStart(4, '0')}</div>
            <div><b>Khách hàng:</b> ${invoice.customerName || ''}</div>
            <div><b>Dịch vụ:</b> ${invoice.serviceName || ''}</div>
            <div><b>Nhân viên tiếp nhận:</b> ${invoice.staffName || invoice.consultantName || ''}</div>
          </div>
          <div>
            <div><b>Ngày tạo:</b> ${formatDateDisplay(invoice.createdAt)}</div>
          </div>
        </div>
        <div style="font-weight:600;margin-bottom:8px;">CHI TIẾT DỊCH VỤ:</div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:12px;">
          <thead><tr><th style="border:1px solid #e3eafc;padding:4px;">STT</th><th style="border:1px solid #e3eafc;padding:4px;">Tên dịch vụ</th><th style="border:1px solid #e3eafc;padding:4px;text-align:right;">Thành tiền</th></tr></thead>
          <tbody>
            ${serviceDetails.map((row, idx) => `<tr><td style='border:1px solid #e3eafc;padding:4px;text-align:center;'>${idx + 1}</td><td style='border:1px solid #e3eafc;padding:4px;'>${row.name}</td><td style='border:1px solid #e3eafc;padding:4px;text-align:right;'>${row.price?.toLocaleString('vi-VN')}₫</td></tr>`).join('')}
          </tbody>
        </table>
        <div style="text-align:right;font-weight:700;color:#27ae60;font-size:18px;margin-bottom:8px;">TỔNG CỘNG: ${invoice.totalPrice?.toLocaleString('vi-VN')}₫</div>
        <div><b>Thanh toán:</b> ${invoice.paymentMethod || '---'} - ${invoice.paymentDisplayText || invoice.paymentStatus}${invoice.paymentStatus === 'COMPLETED' ? ` (${formatDateDisplay(invoice.paidAt)})` : ''}</div>
        <div style="margin-bottom:8px;"><b>Ghi chú:</b> ${invoice.customerNotes || 'Không có'}</div>
        <div style="display:flex;justify-content:space-between;margin-top:24px;">
          <div style="text-align:center;">
            <div>Người lập hóa đơn:</div>
            <div style="font-weight:700;color:#1976d2;margin-top:8px;">${invoice.staffName || invoice.consultantName || '---'}</div>
          </div>
          <div style="text-align:center;">
            <div>Khách hàng:</div>
            <div style="font-weight:700;color:#1976d2;margin-top:8px;">${invoice.customerName || '---'}</div>
          </div>
        </div>
      </div>
    `;
    await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi DOM render
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`hoa_don_${invoice.testId || invoice.paymentId}.pdf`);
    document.body.removeChild(container);
  };

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

  const handleDownloadInvoice = (invoiceId) => {
    // TODO: Gọi API tải PDF hóa đơn
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const handlePayInvoice = (invoiceId) => {
    // TODO: Gọi API thanh toán hóa đơn
    console.log(`Processing payment for invoice ${invoiceId}`);
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
                            onClick={() =>
                              handlePayInvoice(
                                invoice.testId || invoice.paymentId
                              )
                            }
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

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

import React, { useState } from 'react';
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

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      service: 'Khám sản khoa tổng quát',
      doctor: 'BS. Nguyễn Thị Hoa',
      amount: 500000,
      status: 'paid',
      paymentMethod: 'Thẻ tín dụng',
      paymentDate: '2024-01-15',
      description: 'Khám định kỳ, siêu âm thai',
    },
    {
      id: 'INV-2024-002',
      date: '2024-01-20',
      service: 'Xét nghiệm máu tổng quát',
      doctor: 'BS. Trần Văn An',
      amount: 300000,
      status: 'paid',
      paymentMethod: 'Tiền mặt',
      paymentDate: '2024-01-20',
      description: 'Xét nghiệm định kỳ',
    },
    {
      id: 'INV-2024-003',
      date: '2024-02-01',
      service: 'Khám chuyên khoa tim mạch',
      doctor: 'BS. Lê Minh Tuấn',
      amount: 800000,
      status: 'pending',
      paymentMethod: '',
      paymentDate: '',
      description: 'Khám chuyên sâu, điện tim',
    },
    {
      id: 'INV-2024-004',
      date: '2024-02-10',
      service: 'Siêu âm tổng quát',
      doctor: 'BS. Phạm Thị Mai',
      amount: 400000,
      status: 'overdue',
      paymentMethod: '',
      paymentDate: '',
      description: 'Siêu âm bụng, tuyến giáp',
    },
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
          text: 'Đã thanh toán',
        };
      case 'pending':
        return {
          bg: 'linear-gradient(45deg, #F39C12, #E67E22)',
          text: 'Chờ thanh toán',
        };
      case 'overdue':
        return {
          bg: 'linear-gradient(45deg, #E74C3C, #C0392B)',
          text: 'Quá hạn',
        };
      default:
        return {
          bg: 'linear-gradient(45deg, #607D8B, #455A64)',
          text: 'Không xác định',
        };
    }
  };

  const formatCurrency = (amount) => {
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
    // Mock download action
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const handlePayInvoice = (invoiceId) => {
    // Mock payment action
    console.log(`Processing payment for invoice ${invoiceId}`);
  };

  // Summary statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid').length;
  const pendingAmount = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

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
                <StyledTableHead>Bác sĩ</StyledTableHead>
                <StyledTableHead>Số tiền</StyledTableHead>
                <StyledTableHead>Trạng thái</StyledTableHead>
                <StyledTableHead>Thao tác</StyledTableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const statusInfo = getStatusColor(invoice.status);
                return (
                  <TableRow key={invoice.id} hover>
                    <StyledTableCell sx={{ fontWeight: 600 }}>
                      {invoice.id}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(invoice.date).toLocaleDateString('vi-VN')}
                    </StyledTableCell>
                    <StyledTableCell>{invoice.service}</StyledTableCell>
                    <StyledTableCell>{invoice.doctor}</StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 600 }}>
                      {formatCurrency(invoice.amount)}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={statusInfo.text}
                        size="small"
                        sx={{
                          background: statusInfo.bg,
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
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          sx={{
                            color: '#4CAF50',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            },
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        {invoice.status !== 'paid' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handlePayInvoice(invoice.id)}
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
        <DialogContent sx={{ p: 3 }}>
          {selectedInvoice && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {' '}
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Mã hóa đơn
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#2D3748', mb: 2, fontWeight: 600 }}
                >
                  {selectedInvoice.id}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Dịch vụ
                </Typography>
                <Typography variant="body1" sx={{ color: '#2D3748', mb: 2 }}>
                  {selectedInvoice.service}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Bác sĩ phụ trách
                </Typography>
                <Typography variant="body1" sx={{ color: '#2D3748', mb: 2 }}>
                  {selectedInvoice.doctor}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {' '}
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Ngày tạo
                </Typography>
                <Typography variant="body1" sx={{ color: '#2D3748', mb: 2 }}>
                  {new Date(selectedInvoice.date).toLocaleDateString('vi-VN')}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Số tiền
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#2D3748',
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '1.25rem',
                  }}
                >
                  {formatCurrency(selectedInvoice.amount)}
                </Typography>{' '}
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Trạng thái
                </Typography>
                <Chip
                  label={getStatusColor(selectedInvoice.status).text}
                  sx={{
                    background: getStatusColor(selectedInvoice.status).bg,
                    color: '#fff',
                    fontWeight: 600,
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {' '}
                <Divider
                  sx={{ backgroundColor: 'rgba(74, 144, 226, 0.15)', my: 2 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#4A5568', mb: 1 }}
                >
                  Mô tả
                </Typography>
                <Typography variant="body1" sx={{ color: '#2D3748', mb: 2 }}>
                  {selectedInvoice.description}
                </Typography>
                {selectedInvoice.status === 'paid' && (
                  <>
                    {' '}
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#4A5568', mb: 1 }}
                    >
                      Phương thức thanh toán
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#2D3748', mb: 1 }}
                    >
                      {selectedInvoice.paymentMethod}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#4A5568', mb: 1 }}
                    >
                      Ngày thanh toán
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2D3748' }}>
                      {new Date(selectedInvoice.paymentDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>{' '}
        <DialogActions
          sx={{ p: 3, borderTop: '1px solid rgba(74, 144, 226, 0.15)' }}
        >
          <Button
            onClick={() => handleDownloadInvoice(selectedInvoice?.id)}
            startIcon={<DownloadIcon />}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(45deg, #2ECC71, #27AE60)',
              },
            }}
          >
            Tải xuống
          </Button>
          <Button
            onClick={() => setOpenInvoiceDialog(false)}
            sx={{ color: '#4A5568' }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoicesContent;

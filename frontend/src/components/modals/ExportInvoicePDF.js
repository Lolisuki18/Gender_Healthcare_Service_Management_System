import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Button,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { formatDateDisplay } from '@/utils/dateUtils';

const ExportInvoicePDF = ({
  invoice,
  onClose,
  logo,
  orgName,
  orgAddress,
  orgPhone,
  orgTaxCode,
}) => {
  const printRef = useRef();

  // Dịch vụ chi tiết mẫu (nếu backend chưa trả về mảng dịch vụ)
  const serviceDetails = invoice.serviceDetails || [
    { name: invoice.serviceName || 'Dịch vụ', price: invoice.totalPrice || 0 },
  ];

  const handleExportPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`hoa_don_${invoice.testId || invoice.paymentId}.pdf`);
  };

  // Thông tin cơ sở y tế (placeholder nếu không truyền props)
  const name = orgName || 'Phòng khám FPT Hồ Chí Minh';
  const address = orgAddress || '123 Đường Sức Khỏe, Quận 1, TP.HCM';
  const phone = orgPhone || '0123 456 789';
  const tax = orgTaxCode || 'MST: 0123456789';

  return (
    <Box sx={{ p: 0, m: 0, background: '#f4f6fb' }}>
      <Box
        ref={printRef}
        sx={{
          background: '#fff',
          p: 4,
          borderRadius: 3,
          maxWidth: 600,
          margin: '32px auto',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          minHeight: 400,
        }}
      >
        <Grid container alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={2}>
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                style={{ width: 48, height: 48, objectFit: 'contain' }}
              />
            ) : (
              <ReceiptIcon sx={{ fontSize: 48, color: '#4A90E2' }} />
            )}
          </Grid>
          <Grid item xs={10}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 1 }}
            >
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              {address}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              SĐT: {phone} &nbsp; {tax}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2, mt: 1 }} />
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, color: '#1976d2', mb: 1, letterSpacing: 2 }}
        >
          HÓA ĐƠN DỊCH VỤ Y TẾ
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {invoice.paymentStatus === 'COMPLETED' && (
          <Typography
            align="center"
            sx={{
              color: '#27ae60',
              fontWeight: 800,
              fontSize: 22,
              mb: 2,
              letterSpacing: 2,
            }}
          >
            ĐÃ THANH TOÁN
          </Typography>
        )}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={7}>
            <Typography>
              <b>Số HĐ:</b> HDYT-
              {String(invoice.testId || invoice.paymentId).padStart(4, '0')}
            </Typography>
            <Typography>
              <b>Khách hàng:</b> {invoice.customerName}
            </Typography>
            <Typography>
              <b>Dịch vụ:</b> {invoice.serviceName}
            </Typography>
            <Typography>
              <b>Nhân viên tiếp nhận:</b>{' '}
              {invoice.staffName || invoice.consultantName || ''}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography>
              <b>Ngày tạo:</b> {formatDateDisplay(invoice.createdAt)}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          CHI TIẾT DỊCH VỤ:
        </Typography>
        <Paper variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên dịch vụ</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceDetails.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">
                    {row.price?.toLocaleString('vi-VN')}₫
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 700 }}>
            TỔNG CỘNG: {invoice.totalPrice?.toLocaleString('vi-VN')}₫
          </Typography>
        </Box>
        <Typography>
          <b>Thanh toán:</b> {invoice.paymentMethod || '---'} -{' '}
          {invoice.paymentDisplayText || invoice.paymentStatus}
          {invoice.paymentStatus === 'COMPLETED' &&
            ` (${formatDateDisplay(invoice.paidAt)})`}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <b>Ghi chú:</b> {invoice.customerNotes || 'Không có'}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography align="center" sx={{ fontWeight: 500 }}>
              Người lập hóa đơn:
            </Typography>
            <Typography
              align="center"
              sx={{ fontWeight: 700, color: '#1976d2', mt: 1 }}
            >
              {invoice.staffName || invoice.consultantName || '---'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" sx={{ fontWeight: 500 }}>
              Khách hàng:
            </Typography>
            <Typography
              align="center"
              sx={{ fontWeight: 700, color: '#1976d2', mt: 1 }}
            >
              {invoice.customerName || '---'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="contained" onClick={handleExportPDF}>
          Xuất file PDF
        </Button>
      </Box>
    </Box>
  );
};

export default ExportInvoicePDF;

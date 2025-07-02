import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';

const ExportTestResultPDF = ({
  logo,
  testInfo,
  results,
  conclusion,
  onClose,
}) => {
  const printRef = useRef();

  const handleExportPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ket_qua_xet_nghiem.pdf');
  };

  return (
    <Box sx={{ p: 0, m: 0, background: '#f4f6fb' }}>
      <Box
        ref={printRef}
        sx={{
          background: '#fff',
          p: 4,
          borderRadius: 3,
          maxWidth: 800,
          margin: '32px auto',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          minHeight: 600,
        }}
      >
        {logo && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
          </Box>
        )}
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, color: '#1976d2', mb: 1, letterSpacing: 2 }}
        >
          KẾT QUẢ XÉT NGHIỆM STI
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mb: 2 }}>
          <Typography>
            <b>Mã xét nghiệm:</b> {testInfo?.testId}
          </Typography>
          <Typography>
            <b>Khách hàng:</b> {testInfo?.customerName}
          </Typography>
          <Typography>
            <b>Ngày xét nghiệm:</b> {testInfo?.date}
          </Typography>
          {testInfo?.packageName && (
            <Typography>
              <b>Gói xét nghiệm:</b> {testInfo.packageName}
            </Typography>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="h6"
          sx={{ color: '#1976d2', mb: 1, fontWeight: 600 }}
        >
          Bảng kết quả
        </Typography>
        <Paper sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Thành phần</b>
                </TableCell>
                <TableCell>
                  <b>Đơn vị</b>
                </TableCell>
                <TableCell>
                  <b>Giới hạn bình thường</b>
                </TableCell>
                <TableCell>
                  <b>Kết quả</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results &&
                results.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.componentName}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.normalRange}</TableCell>
                    <TableCell
                      style={{
                        color:
                          row.resultValue?.toLowerCase() === 'negative'
                            ? '#10b981'
                            : '#e53e3e',
                        fontWeight: 600,
                      }}
                    >
                      {row.resultValue}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="h6"
          sx={{ color: '#1976d2', mb: 1, fontWeight: 600 }}
        >
          Kết luận
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {conclusion}
        </Typography>
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

export default ExportTestResultPDF;

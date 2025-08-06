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
  serviceName,
  logo,
  testInfo,
  results,
  conclusion,
  consultantNote, // thêm prop này
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
        {/* Tổng kết luận package (nếu là package) */}
        {testInfo?.services &&
          Array.isArray(testInfo.services) &&
          testInfo.services.length > 0 && (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}
            >
              {(() => {
                const allConclusions = testInfo.services.flatMap((svc) =>
                  svc.components.map((c) => c.conclusion)
                );
                const hasInfected = allConclusions.includes('INFECTED');
                const hasAbnormal = allConclusions.includes('ABNORMAL');
                const allNotInfected = allConclusions.every(
                  (c) => c === 'NOT_INFECTED'
                );
                const tags = [];
                if (hasInfected)
                  tags.push(
                    <span
                      key="infected"
                      style={{
                        background: '#e53e3e',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 8,
                        padding: '2px 12px',
                        marginRight: 8,
                      }}
                    >
                      Bị nhiễm
                    </span>
                  );
                if (hasAbnormal)
                  tags.push(
                    <span
                      key="abnormal"
                      style={{
                        background: '#f59e42',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 8,
                        padding: '2px 12px',
                        marginRight: 8,
                      }}
                    >
                      Bất thường
                    </span>
                  );
                if (!hasInfected && !hasAbnormal && allNotInfected)
                  tags.push(
                    <span
                      key="notinfected"
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 8,
                        padding: '2px 12px',
                        marginRight: 8,
                      }}
                    >
                      Không bị nhiễm
                    </span>
                  );
                return tags;
              })()}
            </Box>
          )}
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
          {/* Nếu là test đơn lẻ, hiển thị tên xét nghiệm */}
          {!testInfo?.packageName && testInfo?.testName && (
            <Typography>
              <b>Tên xét nghiệm:</b> {serviceName || testInfo.testName}
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
        {/* Nếu là package: render từng service với bảng riêng */}
        {Array.isArray(results) &&
        results.length > 0 &&
        results[0].components ? (
          results.map((svc, sidx) => (
            <Box key={sidx} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}
              >
                {svc.serviceName || `Dịch vụ ${sidx + 1}`}
              </Typography>
              <Table size="small" sx={{ mb: 1 }}>
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
                    <TableCell>
                      <b>Kết luận</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {svc.components.map((row, idx) => (
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
                      <TableCell
                        style={{
                          fontSize: '0.875rem',
                          color: row.conclusion ? '#374151' : '#9ca3af',
                          fontStyle: row.conclusion ? 'normal' : 'italic',
                          fontWeight: row.conclusion ? 'bold' : 'normal',
                        }}
                      >
                        {row.conclusionDisplayName ||
                          row.conclusion ||
                          'Chưa có kết luận'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))
        ) : (
          // ... bảng cũ cho test đơn lẻ ...
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
                  <TableCell>
                    <b>Kết luận</b>
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
                      <TableCell
                        style={{
                          fontSize: '0.875rem',
                          color: row.conclusion ? '#374151' : '#9ca3af',
                          fontStyle: row.conclusion ? 'normal' : 'italic',
                          fontWeight: row.conclusion ? 'bold' : 'normal',
                        }}
                      >
                        {row.conclusionDisplayName ||
                          row.conclusion ||
                          'Chưa có kết luận'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        )}
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="h6"
          sx={{ color: '#1976d2', mb: 1, fontWeight: 600 }}
        >
          Kết luận
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {consultantNote || conclusion}
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

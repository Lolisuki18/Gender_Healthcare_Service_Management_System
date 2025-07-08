import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExportTestResultPDF from './ExportTestResultPDF';

const StyledTableCell = (props) => (
  <TableCell
    sx={{
      borderBottom: '1px solid #e3eafc',
      fontWeight: props.header ? 700 : 500,
      fontSize: '1rem',
      padding: '10px 14px',
      background: props.header ? '#e3f2fd' : 'inherit',
      color: props.header ? '#1976d2' : '#222',
      ...props.sx,
    }}
    {...props}
  />
);

const StyledTableRow = (props) => (
  <TableRow
    sx={{
      '&:last-child td, &:last-child th': { borderBottom: 0 },
      ...props.sx,
    }}
    {...props}
  />
);

const ServiceTestResultView = ({
  results,
  testPackageInfo,
  error,
  onClose,
  showExportUI,
  setShowExportUI,
  getExportData,
  consultantNoteFromApi,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Box sx={{ mt: isMobile ? 1 : 3 }}>
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 2px 8px #e3f2fd',
            background: '#fff',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <img
                src="/logo192.png"
                alt="Logo"
                style={{ width: 48, height: 48, marginBottom: 8 }}
              />
              <Typography
                variant={isMobile ? 'h6' : 'h4'}
                align="center"
                sx={{
                  fontWeight: 700,
                  color: '#1976d2',
                  mb: 1,
                  letterSpacing: 1,
                }}
              >
                Kết quả xét nghiệm
              </Typography>
              <Chip
                label={
                  results.some(
                    (r) => r.resultValue?.toLowerCase() !== 'negative'
                  )
                    ? 'DƯƠNG TÍNH'
                    : 'ÂM TÍNH'
                }
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  mx: 0.5,
                  mb: 0.5,
                  color: results.some(
                    (r) => r.resultValue?.toLowerCase() !== 'negative'
                  )
                    ? '#fff'
                    : '#fff',
                  bgcolor: results.some(
                    (r) => r.resultValue?.toLowerCase() !== 'negative'
                  )
                    ? '#e53935'
                    : '#43a047',
                }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Mã xét nghiệm:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  #{results[0]?.testId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {results[0]?.reviewerName || 'Khách hàng'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Ngày làm xét nghiệm:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {Array.isArray(results[0]?.reviewedAt) &&
                  results[0].reviewedAt.length >= 3
                    ? `${results[0].reviewedAt[2]}/${results[0].reviewedAt[1]}/${results[0].reviewedAt[0]}`
                    : 'Không xác định'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* Bảng thành phần */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 2,
            p: isMobile ? 1 : 2,
            boxShadow: '0 1px 4px #e3f2fd',
            background: '#fff',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#1976d2', mb: 2, letterSpacing: 1 }}
          >
            Các thành phần xét nghiệm
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell header>Thành phần</StyledTableCell>
                  <StyledTableCell header>Đơn vị</StyledTableCell>
                  <StyledTableCell header>Giới hạn bình thường</StyledTableCell>
                  <StyledTableCell header>Kết quả</StyledTableCell>
                  <StyledTableCell header>Kết luận</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <StyledTableRow key={`result-${index}`}>
                    <StyledTableCell>
                      {result.componentName || 'HIV Antibody'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {result.unit || 'Positive/Negative'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {result.normalRange || 'Negative'}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color:
                          result.resultValue?.toLowerCase() === 'negative'
                            ? '#43a047'
                            : '#e53935',
                        fontWeight: 600,
                      }}
                    >
                      {result.resultValue}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontSize: '1rem',
                        color: result.conclusion ? '#374151' : '#9ca3af',
                        fontStyle: result.conclusion ? 'normal' : 'italic',
                        fontWeight: result.conclusion ? 'bold' : 'normal',
                      }}
                    >
                      {result.conclusionDisplayName ||
                        result.conclusion ||
                        'Chưa có kết luận'}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {/* Kết luận */}
        <Box
          sx={{
            mt: 4,
            mb: 3,
            p: isMobile ? 2 : 3,
            bgcolor: '#e3f2fd',
            borderRadius: 2,
            border: '1px solid #90caf9',
          }}
        >
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{ mb: 2, color: '#1976d2', fontWeight: 700, letterSpacing: 1 }}
          >
            Kết luận xét nghiệm
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.08rem',
              color: '#222',
            }}
          >
            {results[0]?.consultantNotes ||
              consultantNoteFromApi ||
              (results.some(
                (result) => result.resultValue?.toLowerCase() !== 'negative'
              )
                ? 'Đã phát hiện dấu hiệu dương tính trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chi tiết.'
                : 'Tất cả các chỉ số đều trong giới hạn bình thường. Kết quả xét nghiệm âm tính.')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: isMobile ? 2 : 3,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            mr: 2,
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
            py: 1,
            fontSize: isMobile ? '1rem' : '1.05rem',
            color: '#1976d2',
            borderColor: '#1976d2',
            '&:hover': { bgcolor: '#e3f2fd' },
          }}
          onClick={onClose}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#1976d2',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: isMobile ? '1rem' : '1.05rem',
            boxShadow: '0 2px 8px #e3f2fd',
            '&:hover': { bgcolor: '#1565c0' },
          }}
          onClick={() => setShowExportUI(true)}
        >
          Xuất file PDF
        </Button>
      </Box>
      {showExportUI && (
        <ExportTestResultPDF
          logo="/logo192.png"
          testInfo={getExportData().info}
          results={getExportData().rows}
          conclusion={getExportData().conclusion}
          consultantNote={
            (results && results[0]?.consultantNotes) || consultantNoteFromApi
          }
          onClose={() => setShowExportUI(false)}
        />
      )}
    </>
  );
};

export default ServiceTestResultView;

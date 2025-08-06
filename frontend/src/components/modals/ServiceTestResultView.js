import React, { use, useEffect } from 'react';
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
  testTypeInfo,
  error,
  onClose,
  showExportUI,
  setShowExportUI,
  getExportData,
  consultantNoteFromApi,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const getAutoConclusion = (service) => {
    const conclusions = service.components.map((c) => c.conclusion);
    const hasInfected = conclusions.includes('INFECTED');
    const hasAbnormal = conclusions.includes('ABNORMAL');
    const allNotInfected = conclusions.every((c) => c === 'NOT_INFECTED');
    if (hasInfected && hasAbnormal) return 'Bị nhiễm, Bất thường';
    if (hasInfected) return 'Bị nhiễm';
    if (hasAbnormal) return 'Bất thường';
    if (allNotInfected) return 'Không bị nhiễm';
    return '';
  };
  const getChipColor = (type) => {
    if (type === 'infected') return { color: '#fff', bgcolor: '#e53935' };
    if (type === 'abnormal') return { color: '#fff', bgcolor: '#fb8c00' };
    if (type === 'notinfected') return { color: '#fff', bgcolor: '#43a047' };
    return {};
  };
  useEffect(() => {
    console.warn('ServiceTestResultView mounted', results);
    // console.warn('testPackageInfo mounted', testPackageInfo);
  }, []);
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
                {results && results.length > 0
                  ? testTypeInfo.serviceName ||
                    results[0].testName ||
                    'Xét nghiệm STI'
                  : 'Xét nghiệm STI'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 1,
                  flexWrap: 'wrap',
                }}
              >
                {(() => {
                  // results là array các kết quả xét nghiệm, không có property services
                  const allConclusions = (results || [])
                    .map((result) => result.conclusion)
                    .filter(Boolean);
                  const hasInfected = allConclusions.includes('INFECTED');
                  const hasAbnormal = allConclusions.includes('ABNORMAL');
                  const allNotInfected = allConclusions.every(
                    (c) => c === 'NOT_INFECTED'
                  );
                  const tags = [];
                  if (hasInfected)
                    tags.push(
                      <Chip
                        key="infected"
                        label="Bị nhiễm"
                        sx={{
                          ...getChipColor('infected'),
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          mx: 0.5,
                          mb: 0.5,
                        }}
                      />
                    );
                  if (hasAbnormal)
                    tags.push(
                      <Chip
                        key="abnormal"
                        label="Bất thường"
                        sx={{
                          ...getChipColor('abnormal'),
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          mx: 0.5,
                          mb: 0.5,
                        }}
                      />
                    );
                  if (!hasInfected && !hasAbnormal && allNotInfected)
                    tags.push(
                      <Chip
                        key="notinfected"
                        label="Không bị nhiễm"
                        sx={{
                          ...getChipColor('notinfected'),
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          mx: 0.5,
                          mb: 0.5,
                        }}
                      />
                    );
                  return tags;
                })()}
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Mã xét nghiệm:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  #{results && results.length > 0 ? results[0].testId : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {results && results.length > 0
                    ? results[0].reviewerName || 'Khách hàng'
                    : 'Khách hàng'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Ngày làm xét nghiệm:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {results &&
                  results.length > 0 &&
                  Array.isArray(results[0].reviewedAt) &&
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
                {(results || []).map((result, index) => (
                  <StyledTableRow key={`result-${index}`}>
                    <StyledTableCell>
                      {result.componentName ||
                        result.testName ||
                        'Thành phần xét nghiệm'}
                    </StyledTableCell>
                    <StyledTableCell>{result.unit || '-'}</StyledTableCell>
                    <StyledTableCell>
                      {result.normalRange || result.referenceRange || '-'}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {result.resultValue}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontSize: '1rem',
                        color:
                          result.conclusion?.toLowerCase() === 'infected'
                            ? '#e53935'
                            : result.conclusion?.toLowerCase() === 'abnormal'
                              ? '#fb8c00'
                              : '#43a047',
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
            {results && results.length > 0
              ? results[0].consultantNotes || consultantNoteFromApi
              : consultantNoteFromApi}
            {!(
              (results && results.length > 0 && results[0].consultantNotes) ||
              consultantNoteFromApi
            ) &&
              ((results || []).some(
                (result) =>
                  result.conclusion?.toLowerCase() === 'infected' ||
                  result.conclusion?.toLowerCase() === 'abnormal'
              )
                ? 'Đã phát hiện dấu hiệu bất thường trong xét nghiệm. Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chi tiết.'
                : 'Tất cả các chỉ số đều trong giới hạn bình thường. Kết quả xét nghiệm bình thường.')}
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
          serviceName={
            testTypeInfo.serviceName || results[0]?.testName || 'Xét nghiệm STI'
          }
          testInfo={getExportData().info}
          results={getExportData().rows}
          conclusion={getExportData().conclusion}
          consultantNote={
            (results && results.length > 0 && results[0]?.consultantNotes) ||
            consultantNoteFromApi
          }
          onClose={() => setShowExportUI(false)}
        />
      )}
    </>
  );
};

export default ServiceTestResultView;

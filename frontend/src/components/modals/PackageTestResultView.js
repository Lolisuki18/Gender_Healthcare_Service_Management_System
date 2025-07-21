import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  Paper,
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

const getChipColor = (type) => {
  if (type === 'infected') return { color: '#fff', bgcolor: '#e53935' };
  if (type === 'abnormal') return { color: '#fff', bgcolor: '#fb8c00' };
  if (type === 'notinfected') return { color: '#fff', bgcolor: '#43a047' };
  return {};
};

const PackageTestResultView = ({
  testPackageInfo,
  results,
  error,
  expandedAccordions,
  handleAccordionChange,
  onClose,
  showExportUI,
  setShowExportUI,
  getExportData,
  consultantNoteFromApi,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const progress = testPackageInfo.completedComponents
    ? (testPackageInfo.completedComponents / testPackageInfo.totalComponents) *
      100
    : 100;

  const getAutoConclusion = (service) => {
    const conclusions = service.components.map(
      (c) => c.conclusion
    );
    const hasInfected = conclusions.includes('INFECTED');
    const hasAbnormal = conclusions.includes('ABNORMAL');
    const allNotInfected = conclusions.every(
      (c) => c === 'NOT_INFECTED'
    );
    if (hasInfected && hasAbnormal)
      return 'Bị nhiễm, Bất thường';
    if (hasInfected) return 'Bị nhiễm';
    if (hasAbnormal) return 'Bất thường';
    if (allNotInfected) return 'Không bị nhiễm';
    return '';
  };

  return (
    <>
      <Box sx={{ mt: isMobile ? 1 : 3 }}>
        {/* Header, thông tin gói, tiến độ, ... */}
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
                {testPackageInfo.packageName || 'Gói xét nghiệm STI'}
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
                  const allConclusions =
                    testPackageInfo.services?.flatMap((svc) =>
                      svc.components.map((c) => c.conclusion)
                    ) || [];
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
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Mã xét nghiệm:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  #{testPackageInfo.testId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {testPackageInfo.customerName || 'Khách hàng'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Ngày xét nghiệm:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {Array.isArray(testPackageInfo.reviewedAt) &&
                  testPackageInfo.reviewedAt.length >= 3
                    ? `${testPackageInfo.reviewedAt[2]}/${testPackageInfo.reviewedAt[1]}/${testPackageInfo.reviewedAt[0]}`
                    : 'Không xác định'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Mã gói:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {testPackageInfo.packageId
                    ? `P${testPackageInfo.packageId}`
                    : 'Không xác định'}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ width: '100%', mr: 1, mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e3f2fd',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: '#43a047',
                  },
                }}
              />
              <Typography
                color="text.secondary"
                sx={{ mt: 1, fontWeight: 600, textAlign: 'right' }}
              >
                {Math.round(progress)}% hoàn thành
              </Typography>
            </Box>
          </CardContent>
        </Card>
        {/* Danh sách các service, mỗi service có bảng thành phần */}
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: '#1976d2', letterSpacing: 1 }}
          >
            Danh sách các dịch vụ trong gói xét nghiệm:
          </Typography>
          {error && (
            <Box sx={{ mb: 2, color: '#e53935', fontWeight: 600 }}>{error}</Box>
          )}
          {testPackageInfo.services &&
            testPackageInfo.services.map((service, index) => {
              // Xoá log debug
              const consultantNoteObj = Array.isArray(testPackageInfo.testServiceConsultantNotes)
                ? testPackageInfo.testServiceConsultantNotes.find(n => String(n.serviceId) === String(service.serviceId))
                : null;
              const consultantNote = consultantNoteObj?.note;

              return (
                <Paper
                  key={`panel-${index}`}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    p: isMobile ? 1 : 2,
                    boxShadow: '0 1px 4px #e3f2fd',
                    background: '#fff',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: '#1976d2',
                      fontSize: isMobile ? '1.1rem' : '1.15rem',
                    }}
                  >
                    {service.serviceName || `Dịch vụ ${index + 1}`}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell header>Thành phần</StyledTableCell>
                          <StyledTableCell header>Đơn vị</StyledTableCell>
                          <StyledTableCell header>
                            Giới hạn bình thường
                          </StyledTableCell>
                          <StyledTableCell header>Kết quả</StyledTableCell>
                          <StyledTableCell header>Kết luận</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {service.components.map((row, idx) => (
                          <StyledTableRow key={idx}>
                            <StyledTableCell>{row.componentName}</StyledTableCell>
                            <StyledTableCell>{row.unit}</StyledTableCell>
                            <StyledTableCell>{row.normalRange}</StyledTableCell>
                            <StyledTableCell
                              sx={{
                                color:
                                  row.resultValue?.toLowerCase() === 'negative'
                                    ? '#43a047'
                                    : '#e53935',
                                fontWeight: 600,
                              }}
                            >
                              {row.resultValue}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                fontSize: '1rem',
                                color: row.conclusion ? '#374151' : '#9ca3af',
                                fontStyle: row.conclusion ? 'normal' : 'italic',
                                fontWeight: row.conclusion ? 'bold' : 'normal',
                              }}
                            >
                              {row.conclusionDisplayName ||
                                row.conclusion ||
                                'Chưa có kết luận'}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* Kết luận dịch vụ */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#1976d2',
                      mt: 1,
                    }}
                  >
                    Kết luận: {consultantNote && consultantNote.trim() !== '' ? consultantNote : getAutoConclusion(service)}
                  </Typography>
                </Paper>
              );
            })}
        </Box>
        {/* Tổng kết luận gói */}
        {testPackageInfo?.consultantNotes && testPackageInfo.consultantNotes.trim() !== '' && (
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
              {testPackageInfo.consultantNotes}
            </Typography>
          </Box>
        )}
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
            testPackageInfo?.consultantNotes ||
            (results && results[0]?.consultantNotes) ||
            consultantNoteFromApi
          }
          onClose={() => setShowExportUI(false)}
        />
      )}
    </>
  );
};

export default PackageTestResultView;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  ReceiptLong as ReceiptLongIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  PersonOutline as PersonOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import ConclusionDisplay from '../../common/ConclusionDisplay';
import {
  getTestResultsByTestId,
  getSTIServiceById,
} from '../../../services/stiService';

const MEDICAL_GRADIENT = 'linear-gradient(45deg, #4A90E2, #1ABC9C)';
const FONT_FAMILY = '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

// A helper function to evaluate if a result is "abnormal"
const isAbnormal = (result) => {
  if (
    typeof result.resultValue === 'string' &&
    (result.resultValue.toLowerCase().includes('dương tính') ||
      result.resultValue.toLowerCase().includes('positive'))
  ) {
    return true;
  }
  // Check for numeric values outside a normal range if applicable
  // This part is placeholder and needs specific logic if you have numeric results
  return false;
};

const FinalTestResultModal = ({ open, onClose, test, formatDateDisplay }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullTestDetails, setFullTestDetails] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const fetchFullTestDetails = useCallback(async (currentTest) => {
    if (!currentTest) return;

    setLoading(true);
    setError(null);
    setFullTestDetails(null);
    setSelectedServiceId(null);

    try {
      // Lấy đúng dữ liệu từ API (có thể nằm ở data.data hoặc data)
      const apiRes = await getTestResultsByTestId(currentTest.testId);
      const apiData = apiRes?.data?.data || apiRes?.data || apiRes || {};

      // Lấy kết quả chi tiết
      const allResults = Array.isArray(apiData.results) ? apiData.results : [];

      // Lấy note của bác sĩ
      const consultantNotesArr = Array.isArray(apiData.testServiceConsultantNotes)
        ? apiData.testServiceConsultantNotes
        : [];
      // Hiển thị nhiều dòng note
      const consultantNotesText = consultantNotesArr.length
        ? consultantNotesArr.map(note =>
            `${note.serviceName ? note.serviceName + ': ' : ''}${note.note} (${note.consultantName})`
          ).join('\n')
        : '';

      // Gom kết quả theo serviceId
      const resultsByService = allResults.reduce((acc, result) => {
        const serviceId = result.serviceId || 'unknown';
        if (!acc[serviceId]) {
          acc[serviceId] = {
            components: [],
            serviceName: result.testName || `Dịch vụ ${serviceId}`,
          };
        }
        acc[serviceId].components.push({
          id: result.componentId,
          componentId: result.componentId,
          componentName: result.componentName,
          resultValue: result.resultValue,
          unit: result.unit,
          normalRange: result.normalRange || result.referenceRange,
          conclusion: result.conclusion,
          conclusionDisplayName: result.conclusionDisplayName,
        });
        return acc;
      }, {});

      // Lấy tên dịch vụ từ API nếu có
      const serviceIds = Object.keys(resultsByService).filter(
        (id) => id !== 'unknown'
      );
      if (serviceIds.length > 0) {
        const serviceDetailsPromises = serviceIds.map((id) =>
          getSTIServiceById(id)
        );
        const serviceDetailsResults = await Promise.allSettled(
          serviceDetailsPromises
        );

        serviceDetailsResults.forEach((res, idx) => {
          if (res.status === 'fulfilled') {
            const serviceData = res.value?.data || res.value;
            if (serviceData) {
              resultsByService[serviceIds[idx]].serviceName = serviceData.name;
            }
          }
        });
      }

      const services = Object.entries(resultsByService).map(
        ([serviceId, data]) => ({
          id: serviceId,
          name: data.serviceName,
          components: data.components,
        })
      );

      // Bổ sung thông tin khách hàng, dịch vụ, ngày kết quả
      const details = {
        ...currentTest,
        services,
        consultantNotes: consultantNotesText,
        customerName: currentTest.customerName || currentTest.customer?.name || '',
        customerPhone: currentTest.customerPhone || currentTest.customer?.phone || '',
        serviceName: currentTest.serviceName || currentTest.packageName || currentTest.testName || '',
        resultDate: currentTest.resultDate || currentTest.completedAt || currentTest.resultedAt || '',
      };

      setFullTestDetails(details);
      if (services.length > 0) {
        setSelectedServiceId(services[0].id);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải chi tiết kết quả.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && test) {
      fetchFullTestDetails(test);
    }
  }, [open, test, fetchFullTestDetails]);

  const selectedService = useMemo(() => {
    if (!fullTestDetails || !selectedServiceId) return null;
    return fullTestDetails.services.find((s) => s.id === selectedServiceId);
  }, [fullTestDetails, selectedServiceId]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }
    if (!fullTestDetails || !fullTestDetails.services?.length) {
      return (
        <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          Không có dữ liệu chi tiết để hiển thị.
        </Typography>
      );
    }

    if (fullTestDetails.services.length > 1) {
      return (
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: '#1e293b', mb: 1, p: 1 }}
          >
            Các dịch vụ trong xét nghiệm
          </Typography>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, borderColor: '#e2e8f0', mb: 2 }}
          >
            <List component="nav" sx={{ p: 0 }}>
              {fullTestDetails.services.map((service, index) => (
                <React.Fragment key={service.id}>
                  <ListItemButton
                    selected={selectedServiceId === service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                  >
                    <ListItemText
                      primary={service.name}
                      primaryTypographyProps={{
                        fontWeight:
                          selectedServiceId === service.id ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                  {index < fullTestDetails.services.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          {selectedService && renderServiceDetail(selectedService)}
        </Box>
      );
    }

    // Render single service details directly
    return renderServiceDetail(fullTestDetails.services[0]);
  };

  const renderServiceDetail = (service) => {
    if (!service || !service.components || service.components.length === 0) {
      return (
        <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          Không có dữ liệu chi tiết cho dịch vụ này.
        </Typography>
      );
    }

    return (
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#1e293b',
            mb: 2,
            borderBottom: '2px solid #4A90E2',
            pb: 1,
            display: 'inline-block',
          }}
        >
          {service.name}
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  Thành phần
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  Kết quả
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  Đơn vị
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  Chỉ số bình thường
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  Kết luận
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {service.components.map((comp) => {
                const abnormal = isAbnormal(comp);
                return (
                  <TableRow
                    key={comp.id || comp.componentId}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {comp.componentName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: abnormal ? 'bold' : 'normal',
                        color: abnormal ? 'error.main' : 'text.primary',
                      }}
                    >
                      {comp.resultValue ?? 'Chưa có'}
                    </TableCell>
                    <TableCell>{comp.unit || '-'}</TableCell>
                    <TableCell>{comp.normalRange || '-'}</TableCell>
                    <TableCell>
                      <ConclusionDisplay
                        conclusion={comp.conclusion}
                        conclusionDisplayName={comp.conclusionDisplayName}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  if (!fullTestDetails) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: MEDICAL_GRADIENT,
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ReceiptLongIcon />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Kết quả xét nghiệm #{fullTestDetails.testId}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ background: '#f7f9fb', p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
          }}
        >
          <Grid
            container
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <PersonOutlineIcon color="action" />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: '#1e293b' }}
                >
                  Thông tin khách hàng
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ pl: 4 }}>
                <b>Họ và tên:</b> {fullTestDetails.customerName}
              </Typography>
              <Typography variant="body2" sx={{ pl: 4 }}>
                <b>Số điện thoại:</b> {fullTestDetails.customerPhone}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <InfoOutlinedIcon color="action" />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: '#1e293b' }}
                >
                  Thông tin xét nghiệm
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ pl: 4 }}>
                <b>Tên gói/dịch vụ:</b> {fullTestDetails.serviceName}
              </Typography>
              <Typography variant="body2" sx={{ pl: 4 }}>
                <b>Ngày có kết quả:</b>{' '}
                {fullTestDetails.resultDate
                  ? formatDateDisplay(fullTestDetails.resultDate)
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}
        >
          Chi tiết kết quả
        </Typography>
        {renderContent()}

        {/* Kết luận từ consultant */}
        {fullTestDetails.consultantNotes && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}
            >
              Kết luận
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                borderLeft: '4px solid #4A90E2',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  color: '#374151',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {fullTestDetails.consultantNotes}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#fdfdff',
        }}
      >
        <Button
          startIcon={<PrintIcon />}
          disabled
          variant="outlined"
          color="secondary"
        >
          In kết quả
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: MEDICAL_GRADIENT,
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinalTestResultModal;

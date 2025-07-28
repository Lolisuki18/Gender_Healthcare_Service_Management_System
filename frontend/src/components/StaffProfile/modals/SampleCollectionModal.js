import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from '@mui/material';

// ...imports giữ nguyên

const MEDICAL_GRADIENT = 'linear-gradient(45deg, #4A90E2, #1ABC9C)';
const PRIMARY_COLOR = '#1ABC9C';
const FONT_FAMILY = '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';

const SampleCollectionModal = ({
  open,
  onClose,
  test,
  isPackage,
  packageServices,
  selectedService,
  onSelectService,
  serviceComponents,
  loadingService,
  onConfirmSample,
  confirming,
  formatDateDisplay,
  allServiceComponents = {},
}) => {
  const renderComponentTable = (components) => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        mt: 2,
        boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ background: MEDICAL_GRADIENT }}>
            {['Tên thành phần', 'Đơn vị', 'Khoảng bình thường', 'Loại mẫu'].map(
              (title) => (
                <TableCell
                  key={title}
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: 'uppercase',
                    py: 1.5,
                  }}
                >
                  {title}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {components?.length > 0 ? (
            components.map((comp) => (
              <TableRow key={comp.componentId || comp.id}>
                <TableCell sx={{ fontWeight: 600 }}>
                  {comp.componentName || comp.testName}
                </TableCell>
                <TableCell>{comp.unit}</TableCell>
                <TableCell>{comp.normalRange || comp.referenceRange}</TableCell>
                <TableCell>{comp.sampleType || comp.sample || '---'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2 }}>
                Không có thành phần nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: MEDICAL_GRADIENT,
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          py: 2,
          px: 3,
        }}
      >
        Lấy mẫu cho gói xét nghiệm
      </DialogTitle>

      <DialogContent sx={{ background: '#f7f9fb', px: 3, py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}
          >
            Thông tin xét nghiệm
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>
                <b>Mã xét nghiệm:</b> #{test?.testId}
              </Typography>
              <Typography>
                <b>Khách hàng:</b> {test?.customerName}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <b>Dịch vụ:</b> {test?.serviceName}
              </Typography>
              <Typography>
                <b>Ngày hẹn:</b>{' '}
                {test?.appointmentDate
                  ? formatDateDisplay(test.appointmentDate)
                  : 'Chưa có thông tin'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isPackage ? (
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}
            >
              Danh sách dịch vụ trong gói
            </Typography>
            <Grid container spacing={2}>
              {packageServices?.length > 0 ? (
                packageServices.map((svc) => {
                  const isSelected = selectedService?.id === svc.id;
                  return (
                    <Grid item xs={12} key={svc.id}>
                      <Paper
                        elevation={isSelected ? 8 : 1}
                        sx={{
                          borderRadius: 3,
                          width: '100%',
                          minHeight: 56,
                          mb: 2,
                          background: isSelected ? MEDICAL_GRADIENT : '#fff',
                          border: isSelected
                            ? `2px solid ${PRIMARY_COLOR}`
                            : '1px solid #e2e8f0',
                          boxShadow: isSelected
                            ? '0 6px 24px rgba(74,144,226,0.18)'
                            : '0 1.5px 6px rgba(33,150,243,0.06)',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          p: 0,
                        }}
                        onClick={() => {
                          if (
                            selectedService?.id !== svc.id &&
                            typeof onSelectService === 'function'
                          ) {
                            onSelectService(svc);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            background: isSelected ? 'transparent' : '#f8fafc',
                            p: 2.5,
                            textAlign: 'left',
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              fontSize: 17,
                              color: isSelected ? '#fff' : '#1e293b',
                              letterSpacing: 0.5,
                            }}
                          >
                            {svc.name}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Typography>Không có dịch vụ nào trong gói.</Typography>
                </Grid>
              )}
            </Grid>
            {selectedService && allServiceComponents[selectedService.id] && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}
                >
                  Thành phần của dịch vụ: {selectedService.name}
                </Typography>
                {renderComponentTable(allServiceComponents[selectedService.id])}
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}
            >
              Thành phần của dịch vụ
            </Typography>
            {loadingService ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              renderComponentTable(serviceComponents)
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          background: '#f7f9fb',
          px: 3,
          py: 2.5,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 3,
            px: 3,
            fontSize: 15,
            height: 44,
          }}
        >
          Đóng
        </Button>
        <Button
          onClick={onConfirmSample}
          variant="contained"
          disabled={confirming}
          sx={{
            background: MEDICAL_GRADIENT,
            color: '#fff',
            fontWeight: 700,
            borderRadius: 3,
            px: 3,
            ml: 2,
            fontSize: 15,
            height: 44,
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            '&:hover': {
              background: MEDICAL_GRADIENT,
              opacity: 0.9,
            },
          }}
        >
          {confirming ? (
            <CircularProgress size={26} color="inherit" />
          ) : (
            'Xác nhận đã lấy mẫu'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SampleCollectionModal;

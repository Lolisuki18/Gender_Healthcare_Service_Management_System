import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import TestResultInput from '../components/TestResultInput';

const PackageManagementModal = ({
  open,
  onClose,
  currentPackage,
  handlePackageChange,
  handleSavePackage,
  packageResultUpdating,
  TEST_STATUSES,
  getStatusDisplayText,
  getResultColor,
  formatDate,
  handleOpenTestInPackageDialog,
  handleConfirmPackage,
  handleConfirmTest,
  readOnly = false,
}) => {
  const theme = useTheme();

  if (!currentPackage) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
          color: 'white',
          py: 2.5,
          px: 3,
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box component="span">
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            Quản lý gói xét nghiệm
          </Typography>
          <Typography variant="body2" fontWeight={400} sx={{ opacity: 0.9 }}>
            {currentPackage.packageName}
          </Typography>
        </Box>
      </DialogTitle>{' '}
      <DialogContent sx={{ py: 4, px: 3 }}>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Thông tin khách hàng và gói
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Khách hàng"
                  value={currentPackage.customerName || ''}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1.5,
                    },
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gói xét nghiệm"
                  value={currentPackage.packageName || ''}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1.5,
                    },
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Trạng thái gói</InputLabel>
                  <Select
                    value={currentPackage.status || 'PENDING'}
                    onChange={(e) =>
                      handlePackageChange('status', e.target.value)
                    }
                    label="Trạng thái gói"
                    sx={{
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.info.light,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.info.main,
                      },
                    }}
                  >
                    {Object.keys(TEST_STATUSES).map((status) => (
                      <MenuItem key={status} value={status}>
                        {TEST_STATUSES[status].label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày hẹn"
                  value={formatDate(currentPackage.appointmentDate)}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1.5,
                    },
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Thông tin tư vấn
            </Typography>{' '}
            <TextField
              fullWidth
              label="Ghi chú tư vấn"
              value={currentPackage.consultantNotes || ''}
              onChange={(e) =>
                handlePackageChange('consultantNotes', e.target.value)
              }
              multiline
              rows={3}
              variant="outlined"
              disabled={readOnly}
              placeholder="Nhập ghi chú tư vấn cho gói xét nghiệm..."
              InputProps={{
                readOnly: readOnly,
                sx: readOnly
                  ? {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      cursor: 'default',
                    }
                  : {},
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '& fieldset': {
                    borderColor: theme.palette.info.light,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.info.main,
                  },
                },
              }}
            />
          </Box>
          <Divider sx={{ my: 3 }} />{' '}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              color="info.dark"
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.1rem',
                pb: 1,
                borderBottom: '2px solid',
                borderColor: 'info.light',
              }}
            >
              Các xét nghiệm trong gói ({currentPackage.tests?.length || 0})
            </Typography>
          </Box>
          {(!currentPackage.tests || currentPackage.tests.length === 0) && (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                Không có xét nghiệm nào trong gói này
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            {currentPackage.tests &&
              currentPackage.tests.map((test, index) => (
                <Card
                  key={test.testItemId}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                      borderColor: 'info.light',
                    },
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {index + 1}. {test.serviceName}
                          </Typography>
                          {test.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {test.description}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 0.5, display: 'block' }}
                          >
                            Trạng thái:
                          </Typography>
                          <Chip
                            label={getStatusDisplayText(test.status)}
                            color={
                              TEST_STATUSES[test.status]?.color || 'default'
                            }
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 0.5, display: 'block' }}
                          >
                            Kết quả:
                          </Typography>
                          {test.result ? (
                            <Chip
                              label={test.resultLabel || test.result}
                              color={getResultColor(test.result)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              Chưa có
                            </Typography>
                          )}
                        </Box>
                      </Grid>{' '}
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        sx={{
                          textAlign: { xs: 'left', sm: 'right' },
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 1,
                          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                        }}
                      >
                        {test.status === 'PENDING' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() =>
                              handleConfirmTest && handleConfirmTest(test.id)
                            }
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 500,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              '&:hover': {
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                              },
                            }}
                          >
                            Xác nhận
                          </Button>
                        )}{' '}
                        <Button
                          size="small"
                          variant={readOnly ? 'outlined' : 'contained'}
                          color="info"
                          onClick={() =>
                            handleOpenTestInPackageDialog(currentPackage, test)
                          }
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            '&:hover': {
                              boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                            },
                          }}
                        >
                          {readOnly ? 'Xem kết quả' : 'Cập nhật kết quả'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Box>
      </DialogContent>{' '}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: 'rgba(0,0,0,0.2)',
            '&:hover': {
              borderColor: theme.palette.info.main,
              backgroundColor: 'rgba(0,0,0,0.02)',
            },
          }}
        >
          {readOnly ? 'Đóng' : 'Hủy'}
        </Button>

        <Box sx={{ flexGrow: 1 }}></Box>

        {/* Chỉ hiển thị nút xác nhận gói khi trạng thái là PENDING và không ở chế độ chỉ đọc */}
        {!readOnly &&
          currentPackage.status === 'PENDING' &&
          currentPackage.tests &&
          currentPackage.tests.length > 0 && (
            <Button
              onClick={() =>
                handleConfirmPackage && handleConfirmPackage(currentPackage)
              }
              variant="outlined"
              color="success"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              Xác nhận tất cả
            </Button>
          )}

        {!readOnly && (
          <Button
            onClick={handleSavePackage}
            variant="contained"
            color="info"
            disabled={packageResultUpdating}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            {packageResultUpdating ? 'Đang lưu...' : 'Lưu thông tin gói'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PackageManagementModal;

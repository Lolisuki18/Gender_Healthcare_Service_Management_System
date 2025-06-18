import React from 'react';
import {
  Button,
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
  Stack,
  TextField,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import TestResultInput from '../components/TestResultInput';

const TestInPackageModal = ({
  open,
  onClose,
  currentPackage,
  currentTestInPackage,
  handleTestInPackageChange,
  handleSaveTestInPackage,
  packageResultUpdating,
  TEST_STATUSES,
  readOnly = false,
}) => {
  const theme = useTheme();

  if (!currentPackage || !currentTestInPackage) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
          color: 'white',
          py: 2.5,
          px: 3,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box component="span">
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            Cập nhật xét nghiệm
          </Typography>
          <Typography variant="body2" fontWeight={400} sx={{ opacity: 0.9 }}>
            {currentTestInPackage.serviceName}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: 3 }}>
        {' '}
        <Box sx={{ pt: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Thông tin khách hàng
            </Typography>
            <Grid container spacing={3}>
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
                  label="Dịch vụ xét nghiệm"
                  value={currentTestInPackage.serviceName || ''}
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
          <Divider sx={{ my: 3 }} />{' '}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Trạng thái xét nghiệm
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={currentTestInPackage.status || 'PENDING'}
                    onChange={(e) =>
                      handleTestInPackageChange('status', e.target.value)
                    }
                    label="Trạng thái"
                    disabled={readOnly}
                    sx={{
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.secondary.light,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.secondary.main,
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
            </Grid>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Kết quả xét nghiệm
            </Typography>
            <TestResultInput
              result={{
                resultType: currentTestInPackage.result || 'negative',
                isPositive: currentTestInPackage.result === 'positive',
                measurementValue: currentTestInPackage.measurementValue || '',
                measurementUnit: currentTestInPackage.measurementUnit || '',
                referenceRange: currentTestInPackage.referenceRange || '',
                testingMethod: currentTestInPackage.testingMethod || '',
                comments: currentTestInPackage.resultDetails || '',
              }}
              readOnly={readOnly}
              onChange={(updatedResult) => {
                // Map the result from TestResultInput to the format expected by handleTestInPackageChange
                handleTestInPackageChange('result', updatedResult.resultType);
                handleTestInPackageChange(
                  'isPositive',
                  updatedResult.resultType === 'positive'
                );
                handleTestInPackageChange(
                  'measurementValue',
                  updatedResult.measurementValue
                );
                handleTestInPackageChange(
                  'measurementUnit',
                  updatedResult.measurementUnit
                );
                handleTestInPackageChange(
                  'referenceRange',
                  updatedResult.referenceRange
                );
                handleTestInPackageChange(
                  'testingMethod',
                  updatedResult.testingMethod
                );
                handleTestInPackageChange(
                  'resultDetails',
                  updatedResult.comments
                );              }}
            />
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
              borderColor: theme.palette.secondary.main,
              backgroundColor: 'rgba(0,0,0,0.02)',
            },
          }}
        >
          {readOnly ? 'Đóng' : 'Hủy'}
        </Button>
        {!readOnly && (
          <Button
            onClick={handleSaveTestInPackage}
            variant="contained"
            color="secondary"
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
            {' '}
            {packageResultUpdating ? 'Đang lưu...' : 'Lưu kết quả xét nghiệm'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TestInPackageModal;

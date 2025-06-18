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
  TextField,
  Typography,
  Box,
  useTheme,
  Paper,
} from '@mui/material';
import TestResultInput from '../components/TestResultInput';

const SingleTestResultModal = ({
  open,
  onClose,
  currentTest,
  handleResultChange,
  handleSaveResult,
  handleConfirmTest,
  handleSampleTest,
  handleCompleteTest,
  resultUpdating,
  TEST_STATUSES,
  readOnly = false,
}) => {
  const theme = useTheme();

  if (!currentTest) return null;

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
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
            Cập nhật kết quả xét nghiệm
          </Typography>
          <Typography variant="body2" fontWeight={400} sx={{ opacity: 0.9 }}>
            {currentTest.serviceName}
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
              Thông tin khách hàng
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Khách hàng"
                  value={currentTest.customerName || ''}
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
                  value={currentTest.serviceName || ''}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={currentTest.status || 'PENDING'}
                    onChange={(e) =>
                      handleResultChange('status', e.target.value)
                    }
                    label="Trạng thái"
                    sx={{
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.light,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
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

            {/* Hiển thị danh sách thành phần xét nghiệm nếu có */}
            {currentTest.components && currentTest.components.length > 0 ? (
              currentTest.components.map((component, index) => (
                <Box
                  key={component.componentId || index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {component.componentName || `Thành phần #${index + 1}`}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Giá trị kết quả"
                        value={component.resultValue || ''}
                        onChange={(e) => {
                          const updatedComponents = [...currentTest.components];
                          updatedComponents[index].resultValue = e.target.value;
                          handleResultChange('components', updatedComponents);
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Đơn vị đo"
                        value={component.unit || ''}
                        onChange={(e) => {
                          const updatedComponents = [...currentTest.components];
                          updatedComponents[index].unit = e.target.value;
                          handleResultChange('components', updatedComponents);
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phạm vi bình thường"
                        value={component.normalRange || ''}
                        onChange={(e) => {
                          const updatedComponents = [...currentTest.components];
                          updatedComponents[index].normalRange = e.target.value;
                          handleResultChange('components', updatedComponents);
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))
            ) : (
              <TestResultInput
                result={{
                  resultType: currentTest.result || 'negative',
                  isPositive: currentTest.result === 'positive',
                  measurementValue: currentTest.measurementValue || '',
                  measurementUnit: currentTest.measurementUnit || '',
                  referenceRange: currentTest.referenceRange || '',
                  testingMethod: currentTest.testingMethod || '',
                  comments: currentTest.resultDetails || '',
                }}
                readOnly={readOnly}
                onChange={(updatedResult) => {
                  // Map the result from TestResultInput to the format expected by handleResultChange
                  handleResultChange('result', updatedResult.resultType);
                  handleResultChange(
                    'isPositive',
                    updatedResult.resultType === 'positive'
                  );
                  handleResultChange(
                    'measurementValue',
                    updatedResult.measurementValue
                  );
                  handleResultChange(
                    'measurementUnit',
                    updatedResult.measurementUnit
                  );
                  handleResultChange(
                    'referenceRange',
                    updatedResult.referenceRange
                  );
                  handleResultChange(
                    'testingMethod',
                    updatedResult.testingMethod
                  );
                  handleResultChange('resultDetails', updatedResult.comments);
                }}
              />
            )}
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Thông tin tư vấn
            </Typography>
            <TextField
              fullWidth
              label="Ghi chú tư vấn"
              value={currentTest.consultantNotes || ''}
              onChange={(e) =>
                handleResultChange('consultantNotes', e.target.value)
              }
              multiline
              rows={2}
              variant="outlined"
              placeholder="Nhập ghi chú tư vấn cho khách hàng..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '& fieldset': {
                    borderColor: theme.palette.primary.light,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
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
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        {!readOnly ? (
          <>
            <Box>
              {/* Left side action buttons based on status */}
              {currentTest.status === 'PENDING' && handleConfirmTest && (
                <Button
                  onClick={() => handleConfirmTest(currentTest.testId)}
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Xác nhận xét nghiệm
                </Button>
              )}

              {currentTest.status === 'CONFIRMED' && handleSampleTest && (
                <Button
                  onClick={() => handleSampleTest(currentTest.testId)}
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Lấy mẫu xét nghiệm
                </Button>
              )}

              {currentTest.status === 'RESULTED' && handleCompleteTest && (
                <Button
                  onClick={() => handleCompleteTest(currentTest.testId)}
                  variant="outlined"
                  color="success"
                  sx={{
                    mr: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Hoàn thành xét nghiệm
                </Button>
              )}
            </Box>

            <Box>
              {/* Right side buttons */}
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  mr: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'rgba(0,0,0,0.2)',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                Hủy
              </Button>

              {(currentTest.status === 'SAMPLED' ||
                currentTest.status === 'CONFIRMED') && (
                <Button
                  onClick={handleSaveResult}
                  variant="contained"
                  color="primary"
                  disabled={resultUpdating}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  {resultUpdating ? 'Đang lưu...' : 'Lưu kết quả'}
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: 'rgba(0,0,0,0.2)',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                },
              }}
            >
              Đóng
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SingleTestResultModal;

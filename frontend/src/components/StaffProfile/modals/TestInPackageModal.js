import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  Box,
  useTheme,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
// import TestResultInput from '../components/TestResultInput';
import { formatDateDisplay } from '../../../utils/dateUtils';

// Icons
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TestResultInput from './TestResultInput';

const TestInPackageModal = ({
  open,
  onClose,
  packageTest,
  testComponent,
  onTestUpdated,
}) => {
  const theme = useTheme();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Status display mapping
  const STATUS_LABELS = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    SAMPLED: 'Đã lấy mẫu',
    RESULTED: 'Có kết quả',
    COMPLETED: 'Hoàn thành',
    CANCELED: 'Đã hủy',
  };

  const STATUS_COLORS = {
    PENDING: '#FFA726',
    CONFIRMED: '#42A5F5',
    SAMPLED: '#7E57C2',
    RESULTED: '#66BB6A',
    COMPLETED: '#26A69A',
    CANCELED: '#EF5350',
  };

  // Initialize component state when it changes
  useEffect(() => {
    if (testComponent) {
      console.log('Test component received:', testComponent);
      setComponent(testComponent);
      setError(null);
      setSuccess(null);
    }
  }, [testComponent, open]);
  // Handle result change
  const handleResultChange = (updatedData) => {
    setComponent((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };
  // Handle saving test result
  const handleSaveResult = async () => {
    if (!component || !packageTest) return;

    setLoading(true);
    setError(null);
    try {
      // First make API call to update the test result on the server
      const testIdToUpdate = component.testId || packageTest.testId;

      console.log('Saving result for test ID:', testIdToUpdate);
      console.log('Current component data:', component);

      // Check if result value exists
      if (!component.resultValue || component.resultValue.trim() === '') {
        setError('Vui lòng nhập kết quả xét nghiệm trước khi lưu');
        setTimeout(() => setError(null), 5000);
        setLoading(false);
        return;
      }

      // Check if unit and normalRange exist when required
      if (!component.unit || component.unit.trim() === '') {
        setError('Vui lòng nhập đơn vị đo cho kết quả xét nghiệm');
        setTimeout(() => setError(null), 5000);
        setLoading(false);
        return;
      } // Prepare result data - ensure we have the correct component ID
      const componentId = component.id || component.componentId;
      console.log('Component ID for result:', componentId);

      if (!componentId) {
        setError('Không thể xác định ID thành phần xét nghiệm');
        setLoading(false);
        return;
      }

      const resultData = [
        {
          componentId: componentId,
          resultValue: component.resultValue,
          normalRange: component.normalRange || '',
          unit: component.unit || '',
        },
      ];

      console.log('Result data being sent:', resultData);

      // Import addTestResults function if not already imported at the top
      const { addTestResults } = await import('../../../services/stiService');
      const apiResponse = await addTestResults(testIdToUpdate, {
        status: 'RESULTED',
        results: resultData,
      });

      console.log('API Response from adding results:', apiResponse);

      // Check response status
      if (apiResponse.status !== 'SUCCESS') {
        throw new Error(
          apiResponse.message || 'Không thể lưu kết quả xét nghiệm'
        );
      }

      // Update the component status to "RESULTED"
      const updatedComponent = {
        ...component,
        status: 'RESULTED',
      };

      // Update the package with the new component data
      if (packageTest && packageTest.testComponents) {
        const updatedTestComponents = packageTest.testComponents.map((tc) =>
          tc.id === component.id ? updatedComponent : tc
        );

        const updatedPackage = {
          ...packageTest,
          testComponents: updatedTestComponents,
        };

        // Notify parent component of the update
        if (onTestUpdated) {
          onTestUpdated(updatedPackage);
        }
        setComponent(updatedComponent);
        setSuccess('Kết quả xét nghiệm đã được cập nhật');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(
        `Lỗi khi cập nhật kết quả: ${err.message || 'Lỗi không xác định'}`
      );
      setTimeout(() => setError(null), 5000);
      console.error('Error saving test result:', err);
    } finally {
      setLoading(false);
    }
  };
  // Handle sampling a test
  const handleSampleTest = async () => {
    if (!component || !packageTest) return;

    setLoading(true);
    setError(null);

    try {
      // First make API call to update the test status on the server
      // Either use the component ID if it's a full test, or the parent test ID
      const testIdToUpdate = component.testId || packageTest.testId;

      // Import sampleTest function if not already imported at the top
      const { sampleTest } = await import('../../../services/stiService');
      const apiResponse = await sampleTest(testIdToUpdate);

      console.log('Sample API response:', apiResponse);

      // Update the component status to "SAMPLED"
      const updatedComponent = {
        ...component,
        status: 'SAMPLED',
      };

      // Update the package with the new component data
      if (packageTest && packageTest.testComponents) {
        const updatedTestComponents = packageTest.testComponents.map((tc) =>
          tc.id === component.id ? updatedComponent : tc
        );

        const updatedPackage = {
          ...packageTest,
          testComponents: updatedTestComponents,
        };

        // Notify parent component of the update
        if (onTestUpdated) {
          onTestUpdated(updatedPackage);
        }

        setComponent(updatedComponent);
        setSuccess("Trạng thái xét nghiệm đã được cập nhật thành 'Đã lấy mẫu'");
      }
    } catch (err) {
      setError(
        `Lỗi khi cập nhật trạng thái: ${err.message || 'Lỗi không xác định'}`
      );
      console.error('Error updating test to sampled:', err);
    } finally {
      setLoading(false);
    }
  };
  // Handle completing a test component
  const handleCompleteTest = async () => {
    if (!component || !packageTest) return;

    setLoading(true);
    setError(null);

    try {
      // First make API call to update the test status on the server
      // Either use the component ID if it's a full test, or the parent test ID
      const testIdToUpdate = component.testId || packageTest.testId;

      // Import completeTest function if not already imported at the top
      const { completeTest } = await import('../../../services/stiService');
      const apiResponse = await completeTest(testIdToUpdate);

      console.log('Complete test API response:', apiResponse);

      // Update the component status to "COMPLETED"
      const updatedComponent = {
        ...component,
        status: 'COMPLETED',
      };

      // Update the package with the new component data
      if (packageTest && packageTest.testComponents) {
        const updatedTestComponents = packageTest.testComponents.map((tc) =>
          tc.id === component.id ? updatedComponent : tc
        );

        const updatedPackage = {
          ...packageTest,
          testComponents: updatedTestComponents,
        };

        // Notify parent component of the update
        if (onTestUpdated) {
          onTestUpdated(updatedPackage);
        }

        setComponent(updatedComponent);
        setSuccess('Xét nghiệm đã được đánh dấu hoàn thành');
      }
    } catch (err) {
      setError(
        `Lỗi khi hoàn thành xét nghiệm: ${err.message || 'Lỗi không xác định'}`
      );
      console.error('Error completing test:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!component || !packageTest) return null;

  // Determine available actions based on component status
  const canSample = component.status === 'CONFIRMED';
  const canAddResult = component.status === 'SAMPLED';
  const canComplete = component.status === 'RESULTED';
  const isReadOnly =
    component.status === 'COMPLETED' || component.status === 'CANCELED';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          fontWeight: 600,
          py: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onClose}
          sx={{ color: '#fff', mr: 2 }}
          variant="outlined"
          size="small"
        >
          Quay lại
        </Button>
        Chi tiết xét nghiệm trong gói
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin xét nghiệm
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    Mã gói:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {packageTest.code}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    Khách hàng:
                  </Typography>
                  <Typography variant="body1">
                    {packageTest.customerName}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    Ngày đăng ký:
                  </Typography>
                  <Typography variant="body1">
                    {formatDateDisplay(packageTest.registrationDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={STATUS_LABELS[component.status] || component.status}
                    sx={{
                      bgcolor: STATUS_COLORS[component.status],
                      color: '#fff',
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {component.componentName}
              </Typography>
              {component.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {component.description}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Kết quả xét nghiệm
            </Typography>{' '}
            <TestResultInput
              resultComponent={component}
              onResultChange={handleResultChange}
              disabled={!canAddResult || loading || isReadOnly}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Button onClick={onClose} sx={{ mr: 'auto' }}>
          Đóng
        </Button>

        {canSample && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<BiotechIcon />}
            onClick={handleSampleTest}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            }}
          >
            Đánh dấu đã lấy mẫu
          </Button>
        )}

        {canAddResult && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ScienceIcon />}
            onClick={handleSaveResult}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            }}
          >
            Lưu kết quả
          </Button>
        )}

        {canComplete && (
          <Button
            variant="contained"
            onClick={handleCompleteTest}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            }}
          >
            Hoàn thành xét nghiệm
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TestInPackageModal;

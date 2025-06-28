import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Box,
  Alert,
  Chip,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { formatDateDisplay } from '../../../utils/dateUtils';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { addTestResults } from '../../../services/stiService';

/**
 * Modal for updating results for all components within a service
 */
const ServiceResultModal = ({
  open,
  onClose,
  serviceData,
  packageTest,
  onServiceUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [components, setComponents] = useState([]); // Define status styling directly in component rendering where needed
  // Initialize with service components
  useEffect(() => {
    if (serviceData && open) {
      console.log('Service data received:', serviceData);
      setLoading(true);

      // Extract components from service data
      const serviceComponents = serviceData.components || [];
      console.log('Service components:', serviceComponents);

      try {
        // Check if packageTest has test results
        const getTestResults = async () => {
          if (packageTest?.testId) {
            try {
              // Import the needed function
              const {
                getTestResultsByTestId,
              } = require('../../../services/stiService');
              const resultsResponse = await getTestResultsByTestId(
                packageTest.testId
              );

              console.log('Fetched test results:', resultsResponse);
              const testResults = resultsResponse?.data || [];

              // Map existing results to components
              const componentsWithData = serviceComponents.map((comp) => {
                // Try to find this component's results in the test results
                const matchingResult = Array.isArray(testResults)
                  ? testResults.find(
                      (r) =>
                        r.componentId === comp.id ||
                        r.componentId === comp.componentId ||
                        r.componentId === parseInt(comp.id) ||
                        r.componentId === parseInt(comp.componentId)
                    )
                  : null;

                return {
                  ...comp,
                  resultValue:
                    matchingResult?.resultValue || comp.resultValue || '',
                  unit: matchingResult?.unit || comp.unit || '',
                  normalRange:
                    matchingResult?.normalRange ||
                    comp.normalRange ||
                    comp.referenceRange ||
                    '',
                  status: matchingResult?.resultValue
                    ? 'RESULTED'
                    : comp.status || 'SAMPLED',
                  serviceId: serviceData.serviceId,
                  serviceName: serviceData.serviceName,
                  testId: packageTest?.testId,
                };
              });

              setComponents(componentsWithData);
            } catch (err) {
              console.error('Error fetching test results:', err);
              // Fall back to initializing with basic component data
              initializeBasicComponents();
            } finally {
              setLoading(false);
            }
          } else {
            // No test ID, initialize with basic component data
            initializeBasicComponents();
            setLoading(false);
          }
        };

        // Function to initialize components without fetching results
        const initializeBasicComponents = () => {
          setComponents(
            serviceComponents.map((comp) => ({
              ...comp,
              resultValue: comp.resultValue || '',
              unit: comp.unit || '',
              normalRange: comp.normalRange || comp.referenceRange || '',
              status: comp.resultValue ? 'RESULTED' : comp.status || 'SAMPLED',
              serviceId: serviceData.serviceId,
              serviceName: serviceData.serviceName,
              testId: packageTest?.testId,
            }))
          );
        };

        // Start the initialization process
        getTestResults();
      } catch (err) {
        console.error('Error initializing components:', err);
        setLoading(false);
      }

      setError(null);
      setSuccess(null);
    }
  }, [serviceData, open, packageTest]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
    }
  }, [open]); // Handle component result change
  const handleComponentChange = (index, field, value) => {
    setComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      const prevComp = newComponents[index];

      // Check if this is a meaningful change
      const isChanging = prevComp[field] !== value;

      newComponents[index] = {
        ...prevComp,
        [field]: value,
        // Clear any previous save error when editing
        saveError: false,
        // Mark as unsaved if there's a meaningful change and component already had a status
        unsaved: isChanging ? true : prevComp.unsaved,
        // Only update status display when we save
        // ...(field === 'resultValue' && value ? { status: 'RESULTED' } : {}),
      };
      return newComponents;
    });
  };
  // Handle bulk saving all component results for this service
  const handleSaveResults = async () => {
    if (!components.length || !packageTest || !packageTest.testId) {
      setError('Không đủ thông tin để lưu kết quả');
      return;
    }

    // Check if all components have both resultValue and unit - API requirement
    const incompleteComponents = components.filter(
      (comp) =>
        !comp.resultValue ||
        !comp.unit ||
        comp.resultValue.trim() === '' ||
        comp.unit.trim() === ''
    );

    if (incompleteComponents.length > 0) {
      // Highlight incomplete components in the UI
      const updatedComponents = components.map((comp) => ({
        ...comp,
        saveError:
          !comp.resultValue ||
          !comp.unit ||
          comp.resultValue.trim() === '' ||
          comp.unit.trim() === '',
      }));

      setComponents(updatedComponents);

      setError(
        `Không thể lưu: ${incompleteComponents.length} thành phần xét nghiệm chưa có đủ thông tin kết quả và đơn vị đo. API yêu cầu tất cả các thành phần phải được nhập đầy đủ.`
      );
      return;
    }

    // Check if components are marked as ready - not a blocking condition but a good practice
    const notReadyComponents = components.filter((comp) => !comp.ready);
    if (notReadyComponents.length > 0) {
      // Not a blocking error, just a warning - user can still proceed
      setError(
        `Lưu ý: ${notReadyComponents.length} thành phần chưa được đánh dấu xác nhận. Bạn vẫn có thể lưu, nhưng khuyến nghị xác nhận từng thành phần trước khi lưu tất cả.`
      );

      // Ask for confirmation before proceeding
      if (
        !window.confirm(
          'Một số thành phần chưa được đánh dấu xác nhận. Bạn vẫn muốn tiếp tục lưu?'
        )
      ) {
        return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Format data for API - only include components for current service
      const currentServiceComponents = components.filter(
        (comp) =>
          comp.serviceId === serviceData.serviceId ||
          comp.serviceId === serviceData.id
      );

      const resultData = currentServiceComponents.map((comp) => {
        // Ensure componentId is numeric if possible
        let componentId = comp.id || comp.componentId;
        if (typeof componentId !== 'number') {
          if (!isNaN(parseInt(componentId))) {
            componentId = parseInt(componentId);
          }
        }

        return {
          componentId: componentId,
          resultValue: comp.resultValue || '',
          unit: comp.unit || '',
          normalRange: comp.normalRange || comp.referenceRange || '',
        };
      });

      console.log('Saving results for test ID:', packageTest.testId);
      console.log('Service ID:', serviceData.serviceId || serviceData.id);
      console.log('Result data for this service only:', resultData);
      console.log(
        'Saving service components:',
        currentServiceComponents.length
      );

      // Call API to save results - only for this service
      const response = await addTestResults(packageTest.testId, {
        status: 'RESULTED',
        serviceId: serviceData.serviceId || serviceData.id, // Add serviceId to indicate which service is being updated
        results: resultData,
      });
      console.log('API Response:', response);

      // Check for partial success (some components saved, others failed)
      if (response && response.status === 'WARNING' && response.data) {
        // Partial success (some components saved, others failed)
        console.log('Some components failed to save:', response.data);

        // Get list of components that saved successfully
        const savedComponentIds = response.data.savedComponents || [];
        const failedComponentIds = response.data.failedComponents || [];

        // Update status of only successfully saved components
        const updatedComponents = components.map((comp) => {
          const componentId = comp.id || comp.componentId;
          const wasSuccessful =
            savedComponentIds.includes(componentId) ||
            savedComponentIds.includes(parseInt(componentId));

          return {
            ...comp,
            status: wasSuccessful ? 'RESULTED' : comp.status,
            saveError: !wasSuccessful,
          };
        });

        setComponents(updatedComponents);

        // Show partial success message
        setSuccess(
          `Đã lưu thành công ${savedComponentIds.length}/${components.length} thành phần xét nghiệm`
        );
        setError(
          `${failedComponentIds.length} thành phần không lưu được. Vui lòng kiểm tra dữ liệu và thử lại.`
        );

        // Notify parent of partial update
        if (onServiceUpdated) {
          onServiceUpdated({
            serviceId: serviceData.serviceId,
            components: updatedComponents.filter((comp) => !comp.saveError),
            testId: packageTest.testId,
          });
        }

        return;
      }

      // Handle complete failure
      if (!response || response.status === 'ERROR') {
        throw new Error(response?.message || 'Không thể lưu kết quả');
      } // Handle complete success
      const updatedComponents = components.map((comp) => ({
        ...comp,
        status: 'RESULTED',
        ready: true,
        saveError: false,
      }));

      setComponents(updatedComponents);
      setSuccess(
        `Đã lưu kết quả thành công cho dịch vụ "${serviceData.serviceName}" (${currentServiceComponents.length} thành phần)`
      );

      // Notify parent component
      if (onServiceUpdated) {
        onServiceUpdated({
          serviceId: serviceData.serviceId,
          components: updatedComponents,
          testId: packageTest.testId,
        });
      }

      // Auto close after successful save
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error saving service results:', err);

      // Extract more detailed error message if available
      let errorMsg = err.message || 'Lỗi không xác định';

      // Check for missing components error from backend
      if (
        err.message &&
        err.message.includes('Missing results for components')
      ) {
        const match = err.message.match(
          /Missing results for components: \[(.*?)\]/
        );
        if (match && match[1]) {
          const missingComponentIds = match[1];
          errorMsg = `API yêu cầu kết quả cho các thành phần còn thiếu: ${missingComponentIds}. Hệ thống đang cố gắng kết hợp kết quả sẵn có, vui lòng thử lại.`;
        }
      }

      setError(`Lỗi khi lưu kết quả: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  }; // Handle marking a component as completed in the UI (no API call)
  const handleMarkComponentComplete = (index) => {
    // API requires all components to be filled, so we just mark this as ready in the UI
    const component = components[index];

    // Validate this component's data
    if (
      !component.resultValue ||
      !component.resultValue.trim() ||
      !component.unit ||
      !component.unit.trim()
    ) {
      setError(
        'Vui lòng nhập đủ giá trị kết quả và đơn vị đo trước khi đánh dấu hoàn thành'
      );
      return;
    }

    // Update component to show it's ready to be saved
    setComponents((prev) => {
      const newComponents = [...prev];
      newComponents[index] = {
        ...newComponents[index],
        ready: true, // Mark as ready for submission
        unsaved: true, // Still needs to be saved via main Save button
        saveError: false,
      };
      return newComponents;
    });

    // Check if all components are now ready
    const allComponentsReady = components.every(
      (comp, i) => (i === index || comp.ready) && comp.resultValue && comp.unit
    );

    // Notify user about next steps
    if (allComponentsReady) {
      setSuccess(
        'Tất cả các thành phần đã sẵn sàng! Nhấn "Lưu tất cả kết quả" để cập nhật.'
      );
    } else {
      setSuccess(
        `Đã đánh dấu hoàn thành ${component.componentName || component.name || 'thành phần'}. Tiếp tục điền các thành phần khác.`
      );

      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
  };

  // Calculate completion percentage for this service
  const getCompletionPercentage = () => {
    if (!components || !components.length) return 0;

    const completedCount = components.filter(
      (comp) =>
        comp.status === 'RESULTED' ||
        comp.status === 'COMPLETED' ||
        !!comp.resultValue
    ).length;

    return (completedCount / components.length) * 100;
  };

  // If no data, don't render
  if (!serviceData) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      fullWidth
      maxWidth="md"
      aria-labelledby="service-result-dialog-title"
    >
      {' '}
      <DialogTitle id="service-result-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="h6">
              Kết quả dịch vụ: {serviceData.serviceName}
            </Typography>
            <Tooltip title="Tất cả thành phần đều phải được nhập đầy đủ kết quả và đơn vị đo trước khi có thể lưu">
              <IconButton size="small" color="primary">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              fontWeight="medium"
              color="text.secondary"
            >
              {components.filter((c) => c.resultValue && c.unit).length}/
              {components.length} thành phần đã nhập
            </Typography>
            <Chip
              label={
                loading
                  ? 'Đang tải...'
                  : `${Math.round(getCompletionPercentage())}% hoàn thành`
              }
              color={getCompletionPercentage() === 100 ? 'success' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>
        {packageTest && packageTest.testId && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.5 }}
          >
            Gói xét nghiệm #{packageTest.testId} - Chỉ lưu kết quả cho dịch vụ
            này
          </Typography>
        )}
      </DialogTitle>{' '}
      <DialogContent>
        {loading && <LinearProgress />}{' '}
        <Alert severity="info" sx={{ mb: 2 }} icon={<InfoOutlinedIcon />}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Yêu cầu quan trọng từ API
          </Typography>
          <Typography variant="body2">
            Bạn phải nhập đầy đủ kết quả và đơn vị đo cho{' '}
            <strong>tất cả</strong> thành phần trong dịch vụ này trước khi có
            thể lưu.
          </Typography>
          <Typography variant="body2">
            Hệ thống sẽ tự động kết hợp với kết quả sẵn có của các dịch vụ khác
            trong gói xét nghiệm.
          </Typography>
          <Typography variant="body2">
            Hãy kiểm tra và đánh dấu xác nhận từng thành phần khi nhập xong.
          </Typography>
        </Alert>
        {error && success && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            <Typography fontWeight="medium">{success}</Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}
        {/* {error && !success && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )} */}
        {success && !error && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Mã xét nghiệm:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                #{packageTest.testId}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Khách hàng:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {packageTest.customerName || 'Không có thông tin'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Ngày hẹn:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDateDisplay(packageTest.appointmentDate) ||
                  'Chưa xác định'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Dịch vụ:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {serviceData.serviceName} ({components.length} thành phần)
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h6" gutterBottom>
          Danh sách thành phần xét nghiệm
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thành phần</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Khoảng tham chiếu</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {' '}
              {components.map((component, index) => (
                <TableRow
                  key={component.componentId || index}
                  sx={{
                    backgroundColor: component.saveError
                      ? 'rgba(244, 67, 54, 0.08)'
                      : component.ready
                        ? 'rgba(76, 175, 80, 0.12)'
                        : component.resultValue && component.unit
                          ? 'rgba(33, 150, 243, 0.08)'
                          : 'inherit',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: component.saveError
                        ? 'rgba(244, 67, 54, 0.12)'
                        : component.ready
                          ? 'rgba(76, 175, 80, 0.18)'
                          : component.resultValue && component.unit
                            ? 'rgba(33, 150, 243, 0.12)'
                            : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {component.componentName ||
                          component.name ||
                          `Thành phần ${index + 1}`}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        {component.componentId && (
                          <Typography variant="caption" color="text.secondary">
                            ID: {component.componentId}
                          </Typography>
                        )}
                        {component.saveError && (
                          <Typography
                            variant="caption"
                            color="error.main"
                            sx={{ display: 'block', fontWeight: 'bold' }}
                          >
                            ⚠️ Chưa đủ thông tin
                          </Typography>
                        )}
                        {component.ready && (
                          <Typography
                            variant="caption"
                            color="success.main"
                            sx={{ display: 'block', fontWeight: 'bold' }}
                          >
                            ✓ Đã xác nhận
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>{' '}
                  <TableCell>
                    <TextField
                      size="small"
                      value={component.resultValue || ''}
                      onChange={(e) =>
                        handleComponentChange(
                          index,
                          'resultValue',
                          e.target.value
                        )
                      }
                      placeholder="Nhập kết quả *"
                      disabled={saving || component.saving}
                      fullWidth
                      required
                      error={!component.resultValue || component.saveError}
                      helperText={
                        !component.resultValue
                          ? 'Bắt buộc nhập'
                          : component.saveError
                            ? 'Kiểm tra giá trị'
                            : ''
                      }
                      sx={{
                        '& .MuiInputBase-root': {
                          borderWidth: !component.resultValue ? 2 : 1,
                        },
                      }}
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={component.unit || ''}
                      onChange={(e) =>
                        handleComponentChange(index, 'unit', e.target.value)
                      }
                      placeholder="Đơn vị *"
                      disabled={saving || component.saving}
                      fullWidth
                      required
                      error={!component.unit || component.saveError}
                      helperText={!component.unit ? 'Bắt buộc nhập' : ''}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderWidth: !component.unit ? 2 : 1,
                        },
                      }}
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={component.normalRange || ''}
                      onChange={(e) =>
                        handleComponentChange(
                          index,
                          'normalRange',
                          e.target.value
                        )
                      }
                      placeholder="Khoảng tham chiếu"
                      disabled={saving || component.saving}
                      fullWidth
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                      }}
                    />
                  </TableCell>{' '}
                  <TableCell align="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Tooltip
                        title={
                          component.ready
                            ? 'Đã xác nhận hoàn thành'
                            : component.saveError
                              ? 'Thiếu thông tin - cần bổ sung'
                              : component.resultValue && component.unit
                                ? 'Đã nhập đủ - cần xác nhận'
                                : 'Chưa nhập đủ thông tin'
                        }
                      >
                        <Chip
                          label={
                            component.ready
                              ? 'Đã xác nhận'
                              : component.saveError
                                ? 'Thiếu thông tin'
                                : component.resultValue && component.unit
                                  ? 'Chờ xác nhận'
                                  : 'Chưa hoàn thành'
                          }
                          size="small"
                          variant={component.ready ? 'filled' : 'outlined'}
                          sx={{
                            bgcolor: component.saveError
                              ? 'rgba(244, 67, 54, 0.9)'
                              : component.ready
                                ? 'rgba(76, 175, 80, 0.9)'
                                : component.resultValue && component.unit
                                  ? 'rgba(33, 150, 243, 0.9)'
                                  : 'rgba(153, 153, 153, 0.9)',
                            color: 'white',
                            fontWeight: 'bold',
                            mr: 1,
                            border: '2px solid',
                            borderColor: component.saveError
                              ? 'rgba(198, 40, 40, 0.9)'
                              : component.ready
                                ? 'rgba(56, 142, 60, 0.9)'
                                : component.resultValue && component.unit
                                  ? 'rgba(25, 118, 210, 0.9)'
                                  : 'rgba(117, 117, 117, 0.9)',
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        title={
                          component.ready
                            ? 'Hủy xác nhận'
                            : 'Xác nhận đã hoàn thành'
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            color={component.ready ? 'success' : 'primary'}
                            onClick={() => handleMarkComponentComplete(index)}
                            disabled={
                              saving ||
                              !component.resultValue ||
                              !component.unit ||
                              component.saving
                            }
                            sx={{
                              backgroundColor: component.ready
                                ? 'rgba(76, 175, 80, 0.1)'
                                : 'transparent',
                              border: component.ready
                                ? '1px solid rgba(76, 175, 80, 0.5)'
                                : 'none',
                            }}
                          >
                            {component.ready ? (
                              <CheckCircleOutlineIcon fontSize="small" />
                            ) : (
                              <CheckBoxOutlineBlankIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}{' '}
              {components.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      Không có thành phần xét nghiệm
                    </Typography>
                  </TableCell>
                </TableRow>
              )}{' '}
              {/* Show footer row with guidance */}
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                  }}
                >
                  <Alert
                    severity="info"
                    sx={{
                      m: 0,
                      p: 1,
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Quy trình nhập kết quả xét nghiệm:
                    </Typography>
                    <Typography variant="body2">
                      1. Nhập đầy đủ <strong>kết quả</strong> và{' '}
                      <strong>đơn vị</strong> cho <u>mỗi thành phần</u> (Bắt
                      buộc)
                    </Typography>
                    <Typography variant="body2">
                      2. Nhấn vào nút{' '}
                      <CheckBoxOutlineBlankIcon
                        fontSize="small"
                        sx={{ verticalAlign: 'middle' }}
                      />{' '}
                      để xác nhận từng thành phần đã hoàn tất
                    </Typography>{' '}
                    <Typography variant="body2">
                      3. Khi hoàn thành tất cả, nhấn{' '}
                      <strong>"Lưu tất cả kết quả"</strong> để cập nhật dịch vụ
                      hiện tại
                    </Typography>
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ mt: 1, fontWeight: 'bold' }}
                    >
                      Lưu ý: Theo yêu cầu API, tất cả các thành phần xét nghiệm
                      trong dịch vụ này PHẢI ĐƯỢC NHẬP ĐẦY ĐỦ mới lưu được kết
                      quả!
                    </Typography>
                  </Alert>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>{' '}
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Button
          onClick={onClose}
          startIcon={<ArrowBackIcon />}
          disabled={saving || components.some((comp) => comp.saving)}
          color="inherit"
          variant="outlined"
        >
          Quay lại
        </Button>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!components.every((comp) => comp.resultValue && comp.unit) ? (
            <Typography variant="caption" color="error" sx={{ mr: 2 }}>
              {`Còn ${components.filter((c) => !c.resultValue || !c.unit).length}/${components.length} thành phần chưa nhập đầy đủ`}
            </Typography>
          ) : !components.every((comp) => comp.ready) ? (
            <Typography variant="caption" color="primary" sx={{ mr: 2 }}>
              {`Còn ${components.filter((c) => !c.ready).length}/${components.length} thành phần chưa xác nhận hoàn thành`}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              color="success.main"
              sx={{ mr: 2, fontWeight: 'bold' }}
            >
              Đã sẵn sàng để lưu kết quả dịch vụ!
            </Typography>
          )}
        </Box>{' '}
        <Button
          variant="contained"
          color={components.every((comp) => comp.ready) ? 'success' : 'primary'}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSaveResults}
          disabled={
            saving ||
            !components.length ||
            !components.every((comp) => comp.resultValue && comp.unit)
          }
          sx={{
            minWidth: '180px',
            py: 1,
            fontSize: '1.05rem',
            backgroundColor: components.every((comp) => comp.ready)
              ? '#4caf50'
              : undefined,
            '&:hover': {
              backgroundColor: components.every((comp) => comp.ready)
                ? '#388e3c'
                : undefined,
            },
            border: components.every((comp) => comp.ready)
              ? '2px solid #388e3c'
              : undefined,
            boxShadow: components.every((comp) => comp.ready)
              ? '0 2px 4px rgba(0,0,0,0.2)'
              : undefined,
          }}
          title="Sẽ cập nhật kết quả cho dịch vụ này và kết hợp với kết quả sẵn có của các dịch vụ khác"
        >
          {saving ? 'Đang lưu...' : 'Lưu kết quả dịch vụ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceResultModal;

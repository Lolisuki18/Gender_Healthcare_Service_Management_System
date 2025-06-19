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
  useTheme,
  Alert,
  Chip,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { formatDateDisplay } from '../../../utils/dateUtils';

// Icons
import BiotechIcon from '@mui/icons-material/Biotech';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { getSTIServiceById } from '../../../services/stiService';

// Import additional service function
import stiService from '../../../services/stiService';

const PackageManagementModal = ({
  open,
  onClose,
  packageTest,
  onTestUpdated,
  onTestSelect,
}) => {
  const theme = useTheme();
  const [test, setTest] = useState(null);
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  // Add state for validation of all results
  const [validation, setValidation] = useState({
    valid: false,
    message: 'Cần nhập tất cả kết quả xét nghiệm',
  });

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
  // Initialize local state when the modal opens with a test package
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageTest || !open) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        console.log('Package test data:', packageTest);
        setTest(packageTest);

        // If test is completed, automatically show all results
        if (packageTest.status === 'COMPLETED') {
          // Set a timeout to allow components to be loaded first
          setTimeout(() => {
            setComponents((prevComponents) =>
              prevComponents.map((comp) => ({ ...comp, showResult: true }))
            );
          }, 500);
        }

        // Extract components and services from the package test
        if (packageTest.packageId) {
          // First try to get services using the new API function if package has an ID
          try {
            const servicesResponse = await stiService.getServicesInPackage(
              packageTest.packageId
            );
            console.log('Services response:', servicesResponse);
            const packageServices = servicesResponse?.data || [];

            if (packageServices && packageServices.length > 0) {
              // Process services from the dedicated API endpoint
              const allComponents = [];

              for (const service of packageServices) {
                try {
                  // Get service details to get its components
                  const serviceResponse = await getSTIServiceById(service.id);
                  if (
                    serviceResponse &&
                    (serviceResponse.status === 'SUCCESS' ||
                      serviceResponse.data)
                  ) {
                    const serviceData = serviceResponse.data || serviceResponse;

                    if (
                      serviceData.components &&
                      Array.isArray(serviceData.components)
                    ) {
                      // Add service info to each component
                      const serviceComponents = serviceData.components.map(
                        (component) => ({
                          ...component,
                          serviceName: serviceData.name,
                          serviceId: serviceData.id,
                          testId: packageTest.testId,
                          status: component.resultValue
                            ? 'RESULTED'
                            : packageTest.status,
                          // Ensure we have these fields for test results
                          resultValue: component.resultValue || '',
                          unit: component.unit || '',
                          normalRange:
                            component.normalRange ||
                            component.referenceRange ||
                            '',
                        })
                      );

                      allComponents.push(...serviceComponents);
                    }
                  }
                } catch (serviceError) {
                  console.error(
                    `Error fetching service ${service.id} details:`,
                    serviceError
                  );
                }
              }

              // Update components state with fetched data
              setComponents(allComponents);
            } else {
              // Fallback to the old method if no services found
              processServicesFromPackageTest();
            }
          } catch (servicesError) {
            console.error('Error fetching services:', servicesError);
            // Fallback to the old method
            processServicesFromPackageTest();
          }
        } else {
          // If no package ID, use the old method
          processServicesFromPackageTest();
        }

        // Function to process services from packageTest.services array
        async function processServicesFromPackageTest() {
          // Get all services in this package
          if (packageTest.services && Array.isArray(packageTest.services)) {
            // For each service, we need to get its components
            const allComponents = [];

            for (const service of packageTest.services) {
              try {
                // Get service details to get its components
                const serviceResponse = await getSTIServiceById(service.id);
                if (
                  serviceResponse &&
                  (serviceResponse.status === 'SUCCESS' || serviceResponse.data)
                ) {
                  const serviceData = serviceResponse.data || serviceResponse;

                  if (
                    serviceData.components &&
                    Array.isArray(serviceData.components)
                  ) {
                    // Add service info to each component
                    const serviceComponents = serviceData.components.map(
                      (component) => ({
                        ...component,
                        serviceName: serviceData.name,
                        serviceId: serviceData.id,
                        testId: packageTest.testId,
                        status: component.resultValue
                          ? 'RESULTED'
                          : packageTest.status,
                        // Ensure we have these fields for test results
                        resultValue: component.resultValue || '',
                        unit: component.unit || '',
                        normalRange:
                          component.normalRange ||
                          component.referenceRange ||
                          '',
                      })
                    );

                    allComponents.push(...serviceComponents);
                  }
                }
              } catch (serviceError) {
                console.error(
                  `Error fetching service ${service.id} details:`,
                  serviceError
                );
              }
            }

            // If test has results already, try to fetch them
            if (
              (packageTest.status === 'RESULTED' ||
                packageTest.status === 'COMPLETED') &&
              packageTest.testId
            ) {
              try {
                const testResults = await stiService.getTestResultsByTestId(
                  packageTest.testId
                );
                const resultsData = testResults?.data || [];

                if (Array.isArray(resultsData) && resultsData.length > 0) {
                  console.log('Found test results:', resultsData);

                  // Map test results to components
                  const componentsWithResults = allComponents.map((comp) => {
                    const matchingResult = resultsData.find(
                      (r) =>
                        r.componentId === comp.componentId ||
                        r.componentId === comp.id
                    );

                    if (matchingResult) {
                      return {
                        ...comp,
                        resultValue: matchingResult.resultValue || '',
                        unit: matchingResult.unit || comp.unit || '',
                        normalRange:
                          matchingResult.normalRange ||
                          comp.normalRange ||
                          comp.referenceRange ||
                          '',
                        status: 'RESULTED',
                      };
                    }

                    return comp;
                  });

                  setComponents(componentsWithResults);
                } else {
                  setComponents(allComponents);
                }
              } catch (resultError) {
                console.error('Error fetching test results:', resultError);
                setComponents(allComponents);
              }
            } else {
              setComponents(allComponents);
            }
          } else {
            console.warn('Package services array is missing or invalid');
          }
        }
      } catch (err) {
        console.error('Error loading package details:', err);
        setError(
          'Không thể tải thông tin gói xét nghiệm: ' +
            (err.message || 'Lỗi không xác định')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageTest, open]); // Instead of handleSelectTestComponent, we now use handleComponentResultChange for direct updates
  // in the UI

  // Get completion status for the package
  const getPackageStatus = () => {
    if (!components || components.length === 0)
      return test?.status || 'PENDING';

    const statuses = components.map(
      (component) => component.status || 'PENDING'
    );

    if (statuses.every((status) => status === 'COMPLETED')) return 'COMPLETED';
    if (statuses.every((status) => status === 'CANCELED')) return 'CANCELED';
    if (statuses.some((status) => status === 'RESULTED')) return 'RESULTED';
    if (statuses.some((status) => status === 'SAMPLED')) return 'SAMPLED';
    if (statuses.every((status) => status === 'CONFIRMED')) return 'CONFIRMED';

    return 'PENDING';
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!components || components.length === 0) return 0;

    const totalComponents = components.length;
    const completedComponents = components.filter(
      (component) =>
        component.status === 'RESULTED' ||
        component.status === 'COMPLETED' ||
        component.resultValue
    ).length;

    return (completedComponents / totalComponents) * 100;
  };

  // Function to manually refresh services and components
  const refreshPackageServices = async () => {
    if (!test || !test.packageId) {
      setError('Không thể làm mới: Thiếu thông tin gói xét nghiệm');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to get services directly from the package
      const servicesResponse = await stiService.getServicesInPackage(
        test.packageId
      );
      const packageServices = servicesResponse?.data || [];

      if (!packageServices || packageServices.length === 0) {
        setError('Không tìm thấy dịch vụ nào trong gói xét nghiệm');
        return;
      }

      // Process the services to get components
      const allComponents = [];

      for (const service of packageServices) {
        try {
          // Get service details to get its components
          const serviceResponse = await getSTIServiceById(service.id);
          if (
            serviceResponse &&
            (serviceResponse.status === 'SUCCESS' || serviceResponse.data)
          ) {
            const serviceData = serviceResponse.data || serviceResponse;

            if (
              serviceData.components &&
              Array.isArray(serviceData.components)
            ) {
              // Add service info to each component
              const serviceComponents = serviceData.components.map(
                (component) => ({
                  ...component,
                  serviceName: serviceData.name,
                  serviceId: serviceData.id,
                  testId: test.testId,
                  status: component.resultValue ? 'RESULTED' : test.status,
                  // Ensure we have these fields for test results
                  resultValue: component.resultValue || '',
                  unit: component.unit || '',
                  normalRange:
                    component.normalRange || component.referenceRange || '',
                })
              );

              allComponents.push(...serviceComponents);
            }
          }
        } catch (serviceError) {
          console.error(
            `Error fetching service ${service.id} details:`,
            serviceError
          );
        }
      }

      // Update our component state
      setComponents(allComponents);
      setSuccess('Danh sách dịch vụ đã được cập nhật thành công');
    } catch (error) {
      console.error('Error refreshing services:', error);
      setError(
        'Không thể tải lại dữ liệu dịch vụ: ' +
          (error.message || 'Lỗi không xác định')
      );
    } finally {
      setLoading(false);
    }
  }; // We no longer need handleSelectService since we edit components directly in the UI// We no longer need a separate function to handle service results update
  // since results are updated directly in the UI through handleComponentResultChange

  // Group components by service
  const getComponentsByService = () => {
    if (!components || components.length === 0) return {};

    const grouped = {};
    components.forEach((component) => {
      const serviceId = component.serviceId || 'unknown';
      if (!grouped[serviceId]) {
        grouped[serviceId] = {
          serviceName: component.serviceName || 'Dịch vụ xét nghiệm',
          serviceId,
          components: [],
        };
      }
      grouped[serviceId].components.push(component);
    });

    return grouped;
  };

  // Function to validate if all components have results and are ready to be saved
  const validateAllResults = () => {
    if (!components || components.length === 0) {
      return {
        valid: false,
        message: 'Không có thành phần xét nghiệm nào để lưu',
      };
    }

    const missingResults = components.filter(
      (component) => !component.resultValue || !component.unit
    );

    if (missingResults.length > 0) {
      return {
        valid: false,
        message: `Còn ${missingResults.length} thành phần xét nghiệm chưa có kết quả hoặc đơn vị đo`,
        missingComponents: missingResults,
      };
    }

    return { valid: true };
  };
  // Function to save all test results for the entire package at once
  const handleSaveAllResults = async () => {
    // First validate all results
    const validation = validateAllResults();

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null); // Helper function for handling successful results updates
    const handleSuccessfulUpdate = async (status) => {
      // Update components status
      const updatedComponents = components.map((comp) => ({
        ...comp,
        status: status,
      }));

      setComponents(updatedComponents);

      // Update test status
      setTest((prev) => ({
        ...prev,
        status: status,
      }));

      // Notify parent component of the update
      if (onTestUpdated) {
        onTestUpdated({
          ...test,
          status: status,
          testComponents: updatedComponents,
        });
      }
    };

    try {
      // Prepare results for all components in the package
      const allResults = components.map((component) => ({
        componentId: component.componentId || component.id,
        resultValue: component.resultValue,
        normalRange: component.normalRange || '',
        unit: component.unit || '',
      }));

      // Call API to save all results at once
      const response = await stiService.addTestResults(test.testId, {
        status: 'RESULTED',
        // Do not include serviceId to indicate we're updating all services
        results: allResults,
      });

      if (response.status === 'SUCCESS') {
        // After successful result saving, automatically complete the test
        try {
          // Call API to change status to COMPLETED
          const completeResponse = await stiService.completeTest(test.testId);

          if (completeResponse.status === 'SUCCESS') {
            setSuccess(
              'Tất cả kết quả xét nghiệm đã được lưu và hoàn thành thành công'
            );
            await handleSuccessfulUpdate('COMPLETED');
          } else {
            // Results saved but completion failed
            setSuccess(
              'Kết quả xét nghiệm đã được lưu, nhưng không thể cập nhật trạng thái thành hoàn thành'
            );
            await handleSuccessfulUpdate('RESULTED');
          }
        } catch (completeError) {
          console.error('Error completing test:', completeError);
          setSuccess(
            'Kết quả xét nghiệm đã được lưu, nhưng không thể cập nhật trạng thái thành hoàn thành'
          );
          await handleSuccessfulUpdate('RESULTED');
        }
      } else if (response.status === 'WARNING') {
        // Partial success
        setSuccess(
          `Đã lưu ${
            response.data.savedComponents?.length || 0
          }/${allResults.length} kết quả xét nghiệm`
        );
        setError(
          `${
            response.data.failedComponents?.length || 0
          } thành phần không lưu được. Vui lòng kiểm tra lại dữ liệu.`
        );
      } else {
        throw new Error(response.message || 'Không thể lưu kết quả xét nghiệm');
      }
    } catch (error) {
      console.error('Error saving all test results:', error);

      // Special case: Check if the error message indicates the test was actually updated to RESULTED
      // This appears to be a quirk in the backend API that returns this message as an error
      // even though the operation succeeded
      if (
        error.message &&
        (error.message.includes('STI test status updated to RESULTED') ||
          error.message.includes('updated to RESULTED'))
      ) {
        // This is actually a success case
        setSuccess('Kết quả xét nghiệm đã được lưu thành công');

        // Update the components to show RESULTED status
        await handleSuccessfulUpdate('RESULTED');

        // Try to complete the test as well
        try {
          const completeResponse = await stiService.completeTest(test.testId);
          if (completeResponse.status === 'SUCCESS') {
            setSuccess(
              'Kết quả xét nghiệm đã được lưu và hoàn thành thành công'
            );
            await handleSuccessfulUpdate('COMPLETED');
          }
        } catch (completeError) {
          console.log(
            'Could not complete test after successful result save:',
            completeError
          );
          // Already showing success message for saving results, so just leave it
        }
      }
      // Handle unique case for "UPDATED" status message which may come back as an error but is actually success
      else if (
        error.message &&
        error.message.toLowerCase().includes('updated')
      ) {
        setSuccess(
          `Kết quả xét nghiệm đã được lưu thành công: ${error.message}`
        );
        await handleSuccessfulUpdate('RESULTED');
      } else {
        setError(
          'Lỗi khi lưu kết quả xét nghiệm: ' +
            (error.message || 'Lỗi không xác định')
        );
      }
    } finally {
      setLoading(false);
    }
  };
  // Effect to validate all results whenever components change
  useEffect(() => {
    if (components.length > 0) {
      const validationResult = validateAllResults();
      setValidation(validationResult);
    }
    // validateAllResults is a function defined in this component, so it's stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components]);

  // Helper function to check if a test is an HIV test based on name
  const isHIVTest = (component) => {
    return (
      component.componentName &&
      component.componentName.toLowerCase().includes('hiv')
    );
  };

  // Kiểm tra xem xét nghiệm có cần hiển thị dạng binary không
  const shouldShowAsBinary = (component) => {
    // Nếu đã là HIV hoặc có kết quả là positive/negative thì hiển thị dạng binary
    if (isHIVTest(component)) return true;

    // Kiểm tra nếu là xét nghiệm phát hiện bệnh có kết quả dương/âm tính
    if (
      component.componentName &&
      (component.componentName.toLowerCase().includes('pcr') ||
        component.componentName.toLowerCase().includes('antibody') ||
        component.componentName.toLowerCase().includes('antigen') ||
        component.componentName.toLowerCase().includes('syphilis') ||
        component.componentName.toLowerCase().includes('herpes') ||
        component.componentName.toLowerCase().includes('gonorrhea') ||
        component.componentName.toLowerCase().includes('chlamydia') ||
        component.componentName.toLowerCase().includes('hepatitis') ||
        component.componentName.toLowerCase().includes('hpv') ||
        component.componentName.toLowerCase().includes('hcv'))
    ) {
      return true;
    }

    // Hoặc nếu kết quả đã có dạng POSITIVE/NEGATIVE
    if (
      component.resultValue &&
      typeof component.resultValue === 'string' &&
      (component.resultValue.toUpperCase() === 'POSITIVE' ||
        component.resultValue.toUpperCase() === 'NEGATIVE' ||
        component.resultValue.toUpperCase() === 'INCONCLUSIVE')
    ) {
      return true;
    }

    return false;
  };

  // Handle direct changes to component results
  const handleComponentResultChange = (
    serviceId,
    componentId,
    field,
    value
  ) => {
    // Update the component in our local state
    setComponents((prevComponents) => {
      const newComponents = [...prevComponents];

      // Find the component to update
      const index = newComponents.findIndex(
        (comp) =>
          (comp.componentId === componentId || comp.id === componentId) &&
          comp.serviceId === serviceId
      );

      if (index !== -1) {
        // Update the specific field
        newComponents[index] = {
          ...newComponents[index],
          [field]: value,
          // Update status if resultValue is being set
          ...(field === 'resultValue' && value ? { status: 'RESULTED' } : {}),
        };
      }

      return newComponents;
    });
  };

  // Kiểm tra xem kết quả có phải là dạng binary (positive/negative) không
  const isBinaryResult = (resultValue) => {
    if (!resultValue) return false;
    const value = resultValue.toString().toUpperCase();
    return ['POSITIVE', 'NEGATIVE', 'INCONCLUSIVE'].includes(value);
  };
  // Lấy icon tương ứng với kết quả
  const getResultIcon = (resultValue) => {
    if (!resultValue) return null;

    const value = resultValue.toString().toUpperCase();
    if (value === 'POSITIVE') return <CloseIcon fontSize="small" />;
    if (value === 'NEGATIVE') return <CheckIcon fontSize="small" />;
    if (value === 'INCONCLUSIVE') return <QuestionMarkIcon fontSize="small" />;

    return null;
  };

  // Lấy nhãn hiển thị tương ứng với kết quả
  const getResultLabel = (resultValue) => {
    if (!resultValue) return '';

    const value = resultValue.toString().toUpperCase();
    if (value === 'POSITIVE') return 'Dương tính';
    if (value === 'NEGATIVE') return 'Âm tính';
    if (value === 'INCONCLUSIVE') return 'Không xác định';

    return resultValue;
  };

  // Lấy màu tương ứng với kết quả
  const getResultColor = (resultValue) => {
    if (!resultValue) return 'default';

    const value = resultValue.toString().toUpperCase();
    if (value === 'POSITIVE') return 'error';
    if (value === 'NEGATIVE') return 'success';
    if (value === 'INCONCLUSIVE') return 'warning';

    return 'default';
  };
  // Xử lý hiển thị/ẩn kết quả xét nghiệm
  const handleViewTestResult = (component) => {
    // Do not allow toggling if there's no result
    if (!component.resultValue) {
      // Could show a message to the user that there's no result to view
      return;
    }

    setComponents((prevComponents) => {
      return prevComponents.map((comp) => {
        // Match component by ID to toggle its showResult state
        if (
          comp.componentId === component.componentId ||
          comp.id === component.componentId ||
          comp.id === component.id
        ) {
          return {
            ...comp,
            showResult: !comp.showResult,
          };
        }
        return comp;
      });
    });

    // If the component is hidden, scroll to it to make sure it's visible after expanding
    if (!component.showResult) {
      // Use setTimeout to ensure the DOM has updated before trying to scroll
      setTimeout(() => {
        const componentElement = document.getElementById(
          `test-component-${component.componentId || component.id}`
        );
        if (componentElement) {
          componentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  };

  if (!test) {
    return null;
  }

  // Test status color for visual indication
  const statusColor = STATUS_COLORS[test.status] || theme.palette.grey[500];
  const completionPercentage = getCompletionPercentage();
  const packageStatus = getPackageStatus();
  const componentsByService = getComponentsByService();

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="package-test-dialog-title"
      >
        {' '}
        <DialogTitle id="package-test-dialog-title">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              <BiotechIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Gói xét nghiệm: {test.serviceName || 'Gói xét nghiệm STI'}
            </Typography>
            <Box display="flex" alignItems="center">
              <Tooltip title="Làm mới danh sách dịch vụ">
                <IconButton
                  onClick={refreshPackageServices}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Chip
                label={STATUS_LABELS[test.status] || test.status}
                sx={{
                  backgroundColor: statusColor,
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading && <LinearProgress />}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
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
                  #{test.testId}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {test.customerName || 'Không có thông tin'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Ngày hẹn:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDateDisplay(test.appointmentDate) || 'Chưa xác định'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Thanh toán:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {test.paymentMethod || 'Chưa thanh toán'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Tiến độ xét nghiệm:</Typography>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 1,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    STATUS_COLORS[packageStatus] || theme.palette.primary.main,
                },
              }}
            />
            <Typography variant="body2" align="right">
              {Math.round(completionPercentage)}% hoàn thành
            </Typography>
          </Box>{' '}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Danh sách các dịch vụ trong gói xét nghiệm:
            </Typography>
            {test && test.status === 'COMPLETED' ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CheckIcon fontSize="small" />
                  <strong>Gói xét nghiệm đã hoàn thành!</strong> Thông tin xét
                  nghiệm hiện ở chế độ chỉ xem và không thể chỉnh sửa.
                </Typography>
                {components.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Tất cả {components.length} thành phần xét nghiệm đã hoàn
                      thành
                    </Typography>
                  </Box>
                )}
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Lưu ý:</strong> Bạn phải nhập đầy đủ kết quả cho tất
                  cả các thành phần xét nghiệm trong gói này trước khi có thể
                  lưu. Hệ thống sẽ gửi tất cả kết quả cùng một lúc.
                </Typography>
                {components.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Đã nhập:{' '}
                      {components.filter((c) => c.resultValue && c.unit).length}
                      /{components.length} thành phần
                    </Typography>
                  </Box>
                )}
              </Alert>
            )}
          </Box>
          {Object.values(componentsByService).map((service) => (
            <Accordion key={service.serviceId} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  pr={2}
                >
                  <Typography fontWeight="medium">
                    {service.serviceName} ({service.components.length} thành
                    phần)
                  </Typography>{' '}
                  {/* Count completed components for this service */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Nhập kết quả">
                      <EditIcon
                        fontSize="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary">
                      {
                        service.components.filter(
                          (c) => c.resultValue && c.unit
                        ).length
                      }
                      /{service.components.length}
                    </Typography>
                  </Box>
                </Box>{' '}
              </AccordionSummary>
              <AccordionDetails>
                {test && test.status === 'COMPLETED' ? (
                  // If test is completed, show table view for all components in this service
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: 'text.secondary' }}
                    >
                      Bảng kết quả xét nghiệm cho dịch vụ{' '}
                      <strong>{service.serviceName}</strong> đã hoàn thành:
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell>Component</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Normal Range</TableCell>
                            <TableCell>Result Value</TableCell>
                            <TableCell align="center">Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {service.components.map((component) => {
                            const componentId =
                              component.componentId || component.id;
                            return (
                              <TableRow
                                key={componentId}
                                id={`test-component-${componentId}`}
                              >
                                <TableCell>
                                  {component.componentName ||
                                    component.testName}
                                </TableCell>
                                <TableCell>{component.unit || '-'}</TableCell>
                                <TableCell>
                                  {component.normalRange ||
                                    component.referenceRange ||
                                    '-'}
                                </TableCell>
                                <TableCell>
                                  {shouldShowAsBinary(component) ||
                                  isBinaryResult(component.resultValue) ? (
                                    <Chip
                                      icon={getResultIcon(
                                        component.resultValue
                                      )}
                                      label={getResultLabel(
                                        component.resultValue
                                      )}
                                      color={getResultColor(
                                        component.resultValue
                                      )}
                                      size="small"
                                      sx={{ fontWeight: 'bold' }}
                                    />
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 'medium' }}
                                    >
                                      {component.resultValue || '-'}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    size="small"
                                    label="Đã hoàn thành"
                                    color="success"
                                    variant="outlined"
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>{' '}
                      </Table>{' '}
                    </TableContainer>

                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        bgcolor: 'rgba(38, 166, 154, 0.08)',
                        borderRadius: 1,
                        border: '1px dashed rgba(38, 166, 154, 0.4)',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CheckIcon fontSize="small" color="success" />
                        <span>
                          Tất cả kết quả xét nghiệm trong dịch vụ này đã được
                          hoàn thành. Bảng trên hiển thị đầy đủ các thành phần
                          và kết quả xét nghiệm.
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  // If test is not completed, use the original card-based view for input
                  <Grid container spacing={2}>
                    {service.components.map((component, index) => {
                      const hasResults = !!component.resultValue;
                      const componentId = component.componentId || component.id;
                      return (
                        <Grid item xs={12} key={componentId}>
                          {' '}
                          <Paper
                            id={`test-component-${componentId}`}
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: '#f9fafb',
                              borderRadius: 2,
                              mb: 1,
                              border: hasResults
                                ? `1px solid ${theme.palette.success.main}`
                                : '1px solid #e0e0e0',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: '#f5f5f5',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight={600}>
                                {component.componentName || component.testName}
                              </Typography>{' '}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                {' '}
                                <Button
                                  size="small"
                                  variant={
                                    (test && test.status === 'COMPLETED') ||
                                    hasResults
                                      ? 'contained'
                                      : 'outlined'
                                  }
                                  color={
                                    test && test.status === 'COMPLETED'
                                      ? 'success'
                                      : hasResults
                                        ? 'primary'
                                        : 'inherit'
                                  }
                                  disabled={!hasResults}
                                  onClick={() =>
                                    handleViewTestResult(component)
                                  }
                                  startIcon={
                                    component.showResult ? (
                                      <VisibilityOffIcon fontSize="small" />
                                    ) : (
                                      <VisibilityIcon fontSize="small" />
                                    )
                                  }
                                  sx={{
                                    borderRadius: '20px',
                                    boxShadow: hasResults ? 1 : 0,
                                    '&:hover': {
                                      boxShadow: hasResults ? 2 : 0,
                                    },
                                  }}
                                >
                                  {component.showResult
                                    ? 'Ẩn kết quả'
                                    : 'Xem kết quả'}
                                </Button>{' '}
                                <Chip
                                  size="small"
                                  label={
                                    test && test.status === 'COMPLETED'
                                      ? 'Đã hoàn thành'
                                      : hasResults
                                        ? 'Đã có kết quả'
                                        : 'Chưa có kết quả'
                                  }
                                  color={
                                    test && test.status === 'COMPLETED'
                                      ? 'success'
                                      : hasResults
                                        ? 'primary'
                                        : 'default'
                                  }
                                  variant={
                                    (test && test.status === 'COMPLETED') ||
                                    hasResults
                                      ? 'filled'
                                      : 'outlined'
                                  }
                                  sx={{ minWidth: '120px' }}
                                />
                              </Box>
                            </Box>{' '}
                            {component.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                {component.description}
                              </Typography>
                            )}{' '}
                            {/* Hiển thị kết quả nếu đã có và người dùng đã nhấp vào nút xem kết quả */}
                            {hasResults && component.showResult && (
                              <Box
                                sx={{
                                  mb: 2,
                                  p: 2,
                                  bgcolor:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(66, 165, 245, 0.1)'
                                      : '#f5f9ff',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(66, 165, 245, 0.3)'
                                      : '#e3f2fd',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '4px',
                                    backgroundColor:
                                      shouldShowAsBinary(component) ||
                                      isBinaryResult(component.resultValue)
                                        ? getResultColor(
                                            component.resultValue
                                          ) === 'error'
                                          ? theme.palette.error.main
                                          : getResultColor(
                                                component.resultValue
                                              ) === 'success'
                                            ? theme.palette.success.main
                                            : theme.palette.warning.main
                                        : theme.palette.primary.main,
                                  },
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  color="primary"
                                  gutterBottom
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontWeight: 600,
                                  }}
                                >
                                  <BiotechIcon fontSize="small" />
                                  Kết quả xét nghiệm
                                </Typography>

                                {/* Hiển thị kết quả dạng bảng */}
                                <TableContainer sx={{ mt: 1 }}>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Component</TableCell>
                                        <TableCell>Unit</TableCell>
                                        <TableCell>Normal Range</TableCell>
                                        <TableCell>Result Value</TableCell>
                                        <TableCell align="center">
                                          Status
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell>
                                          {component.componentName ||
                                            component.testName}
                                        </TableCell>
                                        <TableCell>
                                          {component.unit || '-'}
                                        </TableCell>
                                        <TableCell>
                                          {component.normalRange ||
                                            component.referenceRange ||
                                            '-'}
                                        </TableCell>
                                        <TableCell>
                                          {shouldShowAsBinary(component) ||
                                          isBinaryResult(
                                            component.resultValue
                                          ) ? (
                                            <Chip
                                              icon={getResultIcon(
                                                component.resultValue
                                              )}
                                              label={getResultLabel(
                                                component.resultValue
                                              )}
                                              color={getResultColor(
                                                component.resultValue
                                              )}
                                              size="small"
                                              sx={{ fontWeight: 'bold' }}
                                            />
                                          ) : (
                                            <Typography
                                              variant="body2"
                                              sx={{ fontWeight: 'medium' }}
                                            >
                                              {component.resultValue || '-'}
                                            </Typography>
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {shouldShowAsBinary(component) ||
                                          isBinaryResult(
                                            component.resultValue
                                          ) ? (
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              {getResultIcon(
                                                component.resultValue
                                              )}
                                            </Box>
                                          ) : (
                                            <Chip
                                              size="small"
                                              label={
                                                component.status === 'COMPLETED'
                                                  ? 'Đã hoàn thành'
                                                  : 'Đã có kết quả'
                                              }
                                              color={
                                                component.status === 'COMPLETED'
                                                  ? 'success'
                                                  : 'primary'
                                              }
                                              variant="outlined"
                                            />
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>

                                {/* Additional information section */}
                                {component.normalRange && (
                                  <Box
                                    sx={{
                                      mt: 1,
                                      p: 1,
                                      bgcolor: 'rgba(0,0,0,0.03)',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      <span style={{ fontWeight: 500 }}>
                                        {shouldShowAsBinary(component) ||
                                        isBinaryResult(component.resultValue)
                                          ? 'Kết quả bình thường: '
                                          : 'Khoảng tham chiếu: '}
                                      </span>
                                      {component.normalRange}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}{' '}
                            {/* Inline test result input - disabled if test is completed */}
                            {test &&
                            test.status !== 'COMPLETED' &&
                            shouldShowAsBinary(component) ? (
                              <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend">
                                  Kết quả
                                </FormLabel>
                                <RadioGroup
                                  row
                                  value={component.resultValue || ''}
                                  onChange={(e) =>
                                    handleComponentResultChange(
                                      service.serviceId,
                                      componentId,
                                      'resultValue',
                                      e.target.value
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value="POSITIVE"
                                    control={<Radio />}
                                    label={
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                        }}
                                      >
                                        <span>Dương tính</span>
                                        <Chip
                                          icon={<CloseIcon fontSize="small" />}
                                          label="Positive"
                                          size="small"
                                          color="error"
                                          variant="outlined"
                                        />
                                      </Box>
                                    }
                                  />
                                  <FormControlLabel
                                    value="NEGATIVE"
                                    control={<Radio />}
                                    label={
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                        }}
                                      >
                                        <span>Âm tính</span>
                                        <Chip
                                          icon={<CheckIcon fontSize="small" />}
                                          label="Negative"
                                          size="small"
                                          color="success"
                                          variant="outlined"
                                        />
                                      </Box>
                                    }
                                  />
                                  <FormControlLabel
                                    value="INCONCLUSIVE"
                                    control={<Radio />}
                                    label={
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                        }}
                                      >
                                        <span>Không xác định</span>
                                        <Chip
                                          icon={
                                            <QuestionMarkIcon fontSize="small" />
                                          }
                                          label="Inconclusive"
                                          size="small"
                                          color="warning"
                                          variant="outlined"
                                        />
                                      </Box>
                                    }
                                  />
                                </RadioGroup>
                              </FormControl>
                            ) : test && test.status === 'COMPLETED' ? (
                              <>
                                {/* Read-only view when test is completed - Table format */}
                                <Box sx={{ mt: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    sx={{ mb: 1 }}
                                  >
                                    Kết quả xét nghiệm (đã hoàn thành):
                                  </Typography>
                                  <TableContainer
                                    component={Paper}
                                    variant="outlined"
                                    sx={{ bgcolor: '#f9fafb' }}
                                  >
                                    <Table
                                      size="small"
                                      aria-label="component test result"
                                    >
                                      <TableHead>
                                        <TableRow
                                          sx={{
                                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                                          }}
                                        >
                                          <TableCell
                                            sx={{ fontWeight: 'bold' }}
                                          >
                                            Component
                                          </TableCell>
                                          <TableCell
                                            sx={{ fontWeight: 'bold' }}
                                          >
                                            Unit
                                          </TableCell>
                                          <TableCell
                                            sx={{ fontWeight: 'bold' }}
                                          >
                                            Normal Range
                                          </TableCell>
                                          <TableCell
                                            sx={{ fontWeight: 'bold' }}
                                          >
                                            Result Value
                                          </TableCell>
                                          <TableCell
                                            align="center"
                                            sx={{ fontWeight: 'bold' }}
                                          >
                                            Status
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow hover>
                                          <TableCell>
                                            {component.componentName ||
                                              component.testName}
                                          </TableCell>
                                          <TableCell>
                                            {component.unit || '-'}
                                          </TableCell>
                                          <TableCell>
                                            {component.normalRange ||
                                              component.referenceRange ||
                                              '-'}
                                          </TableCell>
                                          <TableCell>
                                            {shouldShowAsBinary(component) ||
                                            isBinaryResult(
                                              component.resultValue
                                            ) ? (
                                              <Chip
                                                icon={getResultIcon(
                                                  component.resultValue
                                                )}
                                                label={getResultLabel(
                                                  component.resultValue
                                                )}
                                                color={getResultColor(
                                                  component.resultValue
                                                )}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                              />
                                            ) : (
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontWeight: 'medium',
                                                  padding: '4px 8px',
                                                  borderRadius: '4px',
                                                  backgroundColor:
                                                    'rgba(0, 0, 0, 0.04)',
                                                }}
                                              >
                                                {component.resultValue || '-'}
                                              </Typography>
                                            )}
                                          </TableCell>
                                          <TableCell align="center">
                                            <Chip
                                              size="small"
                                              label="Đã hoàn thành"
                                              color="success"
                                              variant="outlined"
                                              icon={
                                                <CheckIcon fontSize="small" />
                                              }
                                            />
                                          </TableCell>
                                        </TableRow>{' '}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>

                                  <Box
                                    sx={{
                                      mt: 2,
                                      p: 1.5,
                                      bgcolor: 'rgba(66, 165, 245, 0.08)',
                                      borderRadius: 1,
                                      border:
                                        '1px dashed rgba(66, 165, 245, 0.4)',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                      }}
                                    >
                                      <BiotechIcon
                                        fontSize="inherit"
                                        color="primary"
                                      />
                                      <span>
                                        Kết quả đã được xác nhận và hoàn thành
                                        bởi nhân viên xét nghiệm. Nếu có thắc
                                        mắc về kết quả, vui lòng liên hệ bộ phận
                                        chăm sóc khách hàng.
                                      </span>
                                    </Typography>
                                  </Box>
                                </Box>
                              </>
                            ) : (
                              <>
                                {' '}
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={5}>
                                    <TextField
                                      label="Giá trị kết quả"
                                      value={component.resultValue || ''}
                                      onChange={(e) =>
                                        handleComponentResultChange(
                                          service.serviceId,
                                          componentId,
                                          'resultValue',
                                          e.target.value
                                        )
                                      }
                                      fullWidth
                                      margin="dense"
                                      type={
                                        component.testType === 'NUMERIC'
                                          ? 'number'
                                          : 'text'
                                      }
                                      InputProps={{
                                        endAdornment: component.unit ? (
                                          <InputAdornment position="end">
                                            {component.unit}
                                          </InputAdornment>
                                        ) : null,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      label="Khoảng bình thường"
                                      value={component.normalRange || ''}
                                      onChange={(e) =>
                                        handleComponentResultChange(
                                          service.serviceId,
                                          componentId,
                                          'normalRange',
                                          e.target.value
                                        )
                                      }
                                      fullWidth
                                      margin="dense"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <TextField
                                      label="Đơn vị"
                                      value={component.unit || ''}
                                      onChange={(e) =>
                                        handleComponentResultChange(
                                          service.serviceId,
                                          componentId,
                                          'unit',
                                          e.target.value
                                        )
                                      }
                                      fullWidth
                                      margin="dense"
                                    />
                                  </Grid>
                                </Grid>
                                {/* Thêm tùy chọn để chuyển sang nhập kiểu dương tính/âm tính */}
                                <Box
                                  sx={{
                                    mt: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Hoặc chọn kết quả dạng:
                                    </FormLabel>
                                    <RadioGroup
                                      row
                                      value=""
                                      onChange={(e) =>
                                        handleComponentResultChange(
                                          service.serviceId,
                                          componentId,
                                          'resultValue',
                                          e.target.value
                                        )
                                      }
                                    >
                                      <FormControlLabel
                                        value="POSITIVE"
                                        control={<Radio size="small" />}
                                        label="Dương tính"
                                      />
                                      <FormControlLabel
                                        value="NEGATIVE"
                                        control={<Radio size="small" />}
                                        label="Âm tính"
                                      />
                                      <FormControlLabel
                                        value="INCONCLUSIVE"
                                        control={<Radio size="small" />}
                                        label="Không xác định"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </Box>
                              </>
                            )}
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
          {components.length === 0 && !loading && (
            <Alert severity="info">
              Không tìm thấy thành phần xét nghiệm trong gói này. Vui lòng liên
              hệ quản trị viên để cập nhật.
            </Alert>
          )}
        </DialogContent>{' '}
        <DialogActions>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Button
                onClick={onClose}
                color="inherit"
                startIcon={<ArrowBackIcon />}
              >
                Quay lại
              </Button>
            </Box>{' '}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {test && test.status === 'COMPLETED' ? (
                <Chip
                  icon={<CheckIcon />}
                  label="Xét nghiệm đã hoàn thành"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 'medium' }}
                />
              ) : (
                <>
                  {validation && !validation.valid && (
                    <Typography variant="body2" color="error">
                      {validation.message}
                    </Typography>
                  )}

                  <Button
                    onClick={handleSaveAllResults}
                    color="primary"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading || !validation?.valid}
                  >
                    Lưu tất cả kết quả gói
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </DialogActions>
      </Dialog>{' '}
      {/* No longer need modals for individual component or service editing 
          since we now have inline editing in the package management modal */}
    </>
  );
};

export default PackageManagementModal;

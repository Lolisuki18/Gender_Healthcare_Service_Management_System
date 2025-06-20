import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  getSTIServiceById,
  getTestResultsByTestId,
} from '../../../services/stiService';
import PreviewIcon from '@mui/icons-material/Preview';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';

// Helper function to check if a result is outside the normal range
const isAbnormalResult = (resultValue, normalRange) => {
  // Handle different normal range formats
  if (!normalRange || !resultValue) return false;

  // Convert result to number if possible
  const numericResult = parseFloat(resultValue);
  if (isNaN(numericResult)) {
    // Handle non-numeric values like "Positive"/"Negative"
    if (normalRange === 'Negative' && resultValue === 'Positive') {
      return true;
    }
    return false;
  }

  // Handle ranges like "4.5-6.0"
  if (normalRange.includes('-')) {
    const [min, max] = normalRange.split('-').map((v) => parseFloat(v));
    return numericResult < min || numericResult > max;
  }

  // Handle comparison operators like "<1:8" or ">10"
  if (normalRange.includes('<')) {
    const threshold = parseFloat(normalRange.replace('<', ''));
    return numericResult >= threshold;
  }

  if (normalRange.includes('>')) {
    const threshold = parseFloat(normalRange.replace('>', ''));
    return numericResult <= threshold;
  }

  return false;
};

// Helper function to debug token status
const checkTokenStatus = () => {
  try {
    const tokenStr = localStorage.getItem('token');
    if (!tokenStr) {
      console.warn('No token found in localStorage');
      return false;
    }

    const token = JSON.parse(tokenStr);
    if (!token || !token.accessToken) {
      console.warn('Token found but missing accessToken');
      return false;
    }

    // Simple check if token is expired by decoding JWT
    // Not 100% accurate but helps debugging
    const base64Url = token.accessToken.split('.')[1];
    if (!base64Url) {
      console.warn('Token appears malformed, cannot check expiration');
      return false;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    if (payload && payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;

      console.log(`Token expires in: ${Math.floor(timeLeft / 1000)} seconds`);
      return timeLeft > 0;
    }

    return true; // Cannot determine expiration, assume valid
  } catch (error) {
    console.error('Error checking token status:', error);
    return false;
  }
};

const SingleTestResultModal = ({
  open,
  onClose,
  currentTest,
  handleSaveResult,
  handleConfirmTest,
  handleSampleTest,
  handleCompleteTest,
  handleCancelTest,
  onTestUpdated,
}) => {
  // Debug log when component mounts or updates with new test
  useEffect(() => {
    if (open && currentTest) {
      console.group('SingleTestResultModal Debugging');
      console.log('Current test full data:', currentTest);
      console.log('Service ID:', currentTest.serviceId);
      console.log('Components check:', {
        testComponents: currentTest.testComponents,
        components: currentTest.components,
        hasTestComponents: !!(
          currentTest.testComponents &&
          Array.isArray(currentTest.testComponents)
        ),
        hasComponents: !!(
          currentTest.components && Array.isArray(currentTest.components)
        ),
      });
      console.groupEnd();
    }
  }, [open, currentTest]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [results, setResults] = useState([]);

  // Extract testId from currentTest
  const testId = currentTest?.testId;

  // Function to fetch service data from API
  const fetchServiceData = useCallback(
    async (serviceId) => {
      try {
        console.log('Fetching service data for ID:', serviceId);

        let response;
        try {
          response = await getSTIServiceById(serviceId);
          console.log('API Response for service:', response);
        } catch (apiError) {
          console.error('API error in getSTIServiceById:', apiError);
          // If we get a 401, we might still have data after token refresh
          if (
            apiError.status === 401 ||
            (apiError.response && apiError.response.status === 401)
          ) {
            console.log(
              'Received 401 but continuing as token refresh may have succeeded'
            );
            // Try the request again after a small delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            try {
              response = await getSTIServiceById(serviceId);
              console.log(
                'Retry API Response for service after 401:',
                response
              );
            } catch (retryError) {
              throw retryError;
            }
          } else {
            throw apiError;
          }
        }

        // Handle different API response formats
        let serviceInfo = null;

        if (response && response.success && response.data) {
          // Format: { success: true, message: "...", data: {...} }
          serviceInfo = response.data;
          console.log('Found data in success/data format');
        } else if (response && response.status === 'SUCCESS' && response.data) {
          // Format: { status: "SUCCESS", data: {...} }
          serviceInfo = response.data;
          console.log('Found data in status/data format');
        } else if (response && response.id) {
          // Direct object response format
          serviceInfo = response;
          console.log('Found direct object format');
        } else if (response && typeof response === 'object') {
          // Try to use the response directly as a fallback
          serviceInfo = response;
          console.log('Using response object directly');
        }

        console.log('Service info extracted:', serviceInfo);

        if (serviceInfo) {
          console.log('Processing service info:', serviceInfo);

          // Extract components from the service data
          const components = serviceInfo.components || [];

          console.log('Found components:', components);

          setServiceData({
            id: serviceInfo.id,
            name: serviceInfo.name,
            description: serviceInfo.description,
            components: components.map((comp) => ({
              componentId: comp.componentId || comp.id,
              componentName: comp.componentName || comp.name,
              normalRange: comp.normalRange || comp.referenceRange || '',
              unit: comp.unit || '',
            })),
          });

          // Initialize results from fetched components
          if (components.length > 0) {
            const initialResults = components.map((comp) => {
              // For each component, look for existing results in currentTest
              const existingResult =
                currentTest?.testComponents?.find(
                  (tc) => tc.componentId === (comp.componentId || comp.id)
                ) || {};

              return {
                componentId: comp.componentId || comp.id,
                resultValue: existingResult.resultValue || '',
                normalRange: comp.normalRange || comp.referenceRange || '',
                unit: comp.unit || '',
              };
            });

            setResults(initialResults);
            console.log('Initialized results from API data:', initialResults);
          } else {
            console.warn('No components found in API response:', serviceInfo);
          }
        } else {
          console.error(
            'Failed to fetch service data or invalid response format:',
            response
          );
          setError('Could not load service components. Invalid data format.');
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
        setError(
          `Failed to load service data: ${err.message || 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    },
    [currentTest]
  );

  // Add function to fetch test results
  const fetchTestResults = useCallback(async (testId) => {
    try {
      console.log('Fetching test results for test ID:', testId);
      const response = await getTestResultsByTestId(testId);
      console.log('Test results response:', response);

      if (response && (response.data || Array.isArray(response))) {
        const resultsData = response.data || response;

        if (
          resultsData &&
          Array.isArray(resultsData) &&
          resultsData.length > 0
        ) {
          console.log('Updating results with fetched data:', resultsData);

          // Update results state with fetched data
          setResults(
            resultsData.map((result) => ({
              componentId: result.componentId,
              resultValue: result.resultValue || '',
              normalRange: result.normalRange || '',
              unit: result.unit || '',
            }))
          );

          return resultsData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching test results:', error);
      return null;
    }
  }, []);

  // Initialize with test data and components when currentTest changes
  useEffect(() => {
    if (currentTest) {
      setLoading(true);

      console.log('Current test data:', currentTest);

      const serviceId = currentTest.serviceId;
      const testId = currentTest.testId;

      // Check if the test already has results
      const hasResults =
        currentTest.status === 'RESULTED' || currentTest.status === 'COMPLETED';

      // If the test has results, fetch them
      if (hasResults && testId) {
        fetchTestResults(testId)
          .then((testResults) => {
            console.log('Test results fetched:', testResults);
          })
          .catch((error) => {
            console.error('Failed to fetch test results:', error);
          });
      }

      if (serviceId) {
        // Fetch service data with components from API
        fetchServiceData(serviceId);
      } else {
        // Fallback to components in the currentTest if serviceId is not available
        const components =
          currentTest.testComponents &&
          Array.isArray(currentTest.testComponents)
            ? currentTest.testComponents
            : currentTest.components && Array.isArray(currentTest.components)
              ? currentTest.components
              : [];

        console.log('Found components in currentTest:', components);

        if (components.length > 0) {
          // Set service data
          setServiceData({
            id: currentTest.serviceId,
            name: currentTest.serviceName || currentTest.name,
            description:
              currentTest.serviceDescription || currentTest.description,
            components: components.map((comp) => ({
              componentId: comp.componentId,
              componentName: comp.componentName || comp.name,
              normalRange: comp.normalRange || comp.referenceRange || '',
              unit: comp.unit || '',
            })),
          });

          // Initialize results from components
          const initialResults = components.map((comp) => ({
            componentId: comp.componentId,
            resultValue: comp.resultValue || '',
            normalRange: comp.normalRange || comp.referenceRange || '',
            unit: comp.unit || '',
          }));

          setResults(initialResults);
        } else {
          console.warn(
            'No components found in currentTest and no serviceId to fetch data:',
            currentTest
          );
        }
        setLoading(false);
      }
    }
  }, [currentTest, fetchServiceData, fetchTestResults]);
  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
    }
  }, [open]);
  // Reset when currentTest changes
  useEffect(() => {
    if (currentTest) {
      // Clear all errors when currentTest changes
      setError(null);
      setSuccess(null);

      // Don't reset results here, that's handled by the other useEffect
      // that loads data when currentTest changes
    }
  }, [currentTest]);

  const handleResultChange = (componentId, field, value) => {
    setResults((prevResults) =>
      prevResults.map((result) =>
        result.componentId === componentId
          ? { ...result, [field]: value }
          : result
      )
    );
  };
  const handleSaveResults = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validate that all results have values
    const hasEmptyValues = results.some(
      (result) => !result.resultValue || !result.resultValue.trim()
    );

    // Check if we have all required components
    if (serviceData?.components && serviceData.components.length > 0) {
      const serviceComponentIds = serviceData.components.map((comp) =>
        typeof comp.componentId === 'number'
          ? comp.componentId
          : parseInt(comp.componentId)
      );

      const resultComponentIds = results.map((res) =>
        typeof res.componentId === 'number'
          ? res.componentId
          : parseInt(res.componentId)
      );

      // Find missing components
      const missingComponentIds = serviceComponentIds.filter(
        (id) => !resultComponentIds.includes(id)
      );

      // Log missing components
      if (missingComponentIds.length > 0) {
        console.error('Missing components in results:', missingComponentIds);
        setError(
          `Missing results for components: ${missingComponentIds.join(', ')}. Please provide all required values.`
        );
        setSaving(false);
        return;
      }
    }

    // Add detailed validation logging
    console.group('Results validation');
    console.log('Current results array:', results);
    console.log('Has empty values:', hasEmptyValues);
    if (hasEmptyValues) {
      const emptyResults = results.filter(
        (r) => !r.resultValue || !r.resultValue.trim()
      );
      console.log('Empty results:', emptyResults);
    }

    // Validate all component IDs
    const invalidComponentIds = results.filter((r) => {
      const id = r.componentId;
      return (
        id === undefined ||
        id === null ||
        (typeof id === 'string' && (!id.trim() || isNaN(parseInt(id))))
      );
    });
    console.log('Invalid component IDs:', invalidComponentIds);
    console.groupEnd();

    if (hasEmptyValues) {
      setError(
        'Vui lòng cung cấp giá trị cho tất cả các thành phần xét nghiệm'
      );
      setSaving(false);
      return;
    }

    if (invalidComponentIds.length > 0) {
      setError(
        'Phát hiện ID thành phần không hợp lệ. Vui lòng thử làm mới trang.'
      );
      setSaving(false);
      return;
    }
    try {
      // Build the request data with properly formatted results
      const formattedResults = results.map((result) => ({
        componentId:
          typeof result.componentId === 'number'
            ? result.componentId
            : parseInt(result.componentId),
        resultValue: result.resultValue,
        normalRange: result.normalRange || '',
        unit: result.unit || '',
      }));

      const requestData = {
        status: 'RESULTED', // This matches the model's STITestStatus.RESULTED value
        results: formattedResults,
      };
      console.log(
        'Request data for saving results:',
        JSON.stringify(requestData, null, 2)
      );

      // Add additional error handling for network issues
      if (!navigator.onLine) {
        setError(
          'You appear to be offline. Please check your internet connection and try again.'
        );
        setSaving(false);
        return;
      }

      // Check token status before making API call
      const tokenValid = checkTokenStatus();
      console.log(
        'Token status check before API call:',
        tokenValid ? 'Valid' : 'Invalid/Expired'
      );

      if (!handleSaveResult) {
        setError('Cannot save results: No handler provided');
        setSaving(false);
        return;
      }

      // Use the parent component's handler with improved error handling
      try {
        console.log(`Saving results for test ID: ${testId}`);
        const response = await handleSaveResult(testId, requestData);
        console.log('Save result response:', response); // Successfully saved results
        if (response && (response.status === 'SUCCESS' || response.success)) {
          setSuccess('Test results saved successfully! 🎉');

          // Update test with the returned data
          if (onTestUpdated && response.data) {
            onTestUpdated(response.data);
          }

          // Note: We no longer automatically complete the test
          // Instead we'll show a "Complete" button when status is RESULTED

          // Close modal after showing success message
          setTimeout(() => onClose(), 1500);
          return;
        } // Handle case where response contains data despite error status
        else if (response && response.data) {
          console.log('Received data despite error status:', response);
          setSuccess('Test results saved successfully');

          if (onTestUpdated) {
            onTestUpdated(response.data);
          }

          // No longer automatically update to COMPLETED

          setTimeout(() => onClose(), 1500);
          return;
        }

        // Handle explicit error case
        else {
          throw new Error(response?.message || 'Failed to save test results');
        }
      } catch (apiError) {
        console.error('API error in handleSaveResult:', apiError);

        // Improved error handling for common issues
        if (apiError.message === 'Network Error' || !navigator.onLine) {
          setError(
            'Failed to save test results: Network connection issue. Please check your internet connection and try again.'
          );
          return;
        }

        // Check for 401 - token might have refreshed
        if (
          apiError.status === 401 ||
          (apiError.response && apiError.response.status === 401)
        ) {
          console.log('Received 401, waiting for token refresh');

          // Wait for token refresh and try again
          await new Promise((resolve) => setTimeout(resolve, 1000));

          try {
            // Try one more time with refreshed token
            console.log('Retrying save after token refresh');
            const retryResponse = await handleSaveResult(testId, requestData);

            if (
              retryResponse &&
              (retryResponse.status === 'SUCCESS' || retryResponse.data)
            ) {
              setSuccess('Test results saved successfully after token refresh');
              if (onTestUpdated && retryResponse.data) {
                onTestUpdated(retryResponse.data);
              }
              setTimeout(() => onClose(), 1500);
              return;
            } else {
              throw new Error(
                'Failed to save results after token refresh. Please try logging in again.'
              );
            }
          } catch (retryError) {
            console.error('Failed retry after token refresh:', retryError);
            setError(
              'Failed to save test results. Your session might have expired. Please try refreshing the page or logging in again.'
            );
            return;
          }
        } else if (apiError.response && apiError.response.status === 400) {
          // Check if this is specifically about missing components
          if (
            apiError.response.data &&
            apiError.response.data.message &&
            apiError.response.data.message.includes(
              'Missing results for components'
            )
          ) {
            const errorMsg = apiError.response.data.message;
            console.error('Backend validation error:', errorMsg);
            setError(
              `Thiếu kết quả cho một số thành phần xét nghiệm. Vui lòng kiểm tra và điền đầy đủ tất cả các giá trị.`
            );
          } else {
            setError(
              'Failed to save test results: Invalid data format. Please check your inputs and try again.'
            );
          }
          return;
        } else if (apiError.response && apiError.response.status === 403) {
          setError(
            'Failed to save test results: You do not have permission to perform this action.'
          );
          return;
        } else if (apiError.response && apiError.response.status === 500) {
          setError(
            'Failed to save test results: Server error. Please try again later.'
          );
          return;
        } else {
          setError(
            `Failed to save test results: ${apiError.message || 'Unknown error'}`
          );
          return;
        }
      }
    } catch (err) {
      console.error('Error saving test results:', err);

      // Check for specific backend error messages about missing components
      if (
        err.response &&
        err.response.data &&
        err.response.data.message &&
        typeof err.response.data.message === 'string' &&
        err.response.data.message.includes('Missing results for components')
      ) {
        const errorMessage = err.response.data.message;
        const componentsMatch = errorMessage.match(/\[(.*?)\]/);
        if (componentsMatch && componentsMatch[1]) {
          const missingComponents = componentsMatch[1];
          setError(
            `Thiếu kết quả cho các thành phần: ${missingComponents}. Vui lòng điền đầy đủ tất cả các giá trị bắt buộc.`
          );
        } else {
          setError(
            `Thiếu kết quả cho một số thành phần xét nghiệm. Vui lòng điền đầy đủ tất cả các giá trị.`
          );
        }
      }
      // More user-friendly error message for other cases
      else if (err.message?.includes('Network Error') || !navigator.onLine) {
        setError(
          'Failed to save test results: Network connection issue. Please check your internet connection and try again.'
        );
      } else if (err.message?.includes('timeout')) {
        setError(
          'Failed to save test results: Request timed out. Please try again.'
        );
      } else if (
        err.message?.includes('auth') ||
        err.message?.includes('token') ||
        err.message?.includes('login')
      ) {
        setError(
          'Failed to save test results: Authentication issue. Please try refreshing the page or logging in again.'
        );
      } else {
        setError(
          'This could be due to network issues or expired authentication. Please try again or refresh the page.'
        );
      }
    } finally {
      setSaving(false);
    }
  };
  // Function to handle viewing results(fetches both service data and test results)
  const handleViewResults = async () => {
    if (!currentTest || !currentTest.serviceId || !currentTest.testId) {
      setError('Cannot view results: Missing test or service information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch service data
      console.log(
        'Fetching service data for viewing results. Service ID:',
        currentTest.serviceId
      );
      await fetchServiceData(currentTest.serviceId);

      // Fetch test results
      console.log(
        'Fetching test results for viewing. Test ID:',
        currentTest.testId
      );
      const testResults = await fetchTestResults(currentTest.testId);

      if (testResults && testResults.length > 0) {
        console.log('Test results loaded successfully:', testResults);

        // Make sure all test components are visible in the UI
        if (serviceData && serviceData.components) {
          console.log('Checking for missing components in results display...');

          // Create a map of component IDs to results
          const resultMap = new Map();
          testResults.forEach((result) => {
            resultMap.set(
              typeof result.componentId === 'number'
                ? result.componentId
                : parseInt(result.componentId),
              result
            );
          });

          // Create complete results array with all service components
          const completeResults = serviceData.components.map((component) => {
            const componentId =
              typeof component.componentId === 'number'
                ? component.componentId
                : parseInt(component.componentId);

            const existingResult = resultMap.get(componentId);

            if (!existingResult) {
              console.warn(
                `Missing result for component ID ${componentId}, creating placeholder`
              );
            }

            return {
              componentId: componentId,
              componentName: component.componentName,
              normalRange: component.normalRange || '',
              unit: component.unit || '',
              resultValue: existingResult ? existingResult.resultValue : '---',
            };
          });

          setResults(completeResults);
          setSuccess('Kết quả xét nghiệm đã được tải thành công');
        } else {
          setResults(testResults);
          setSuccess('Kết quả xét nghiệm đã được tải thành công');
        }
      } else {
        console.warn('No test results found for test ID:', currentTest.testId);
        setError('Không tìm thấy kết quả xét nghiệm cho xét nghiệm này');
      }
    } catch (err) {
      console.error('Error viewing test results:', err);
      setError(
        `Không thể tải kết quả xét nghiệm: ${err.message || 'Lỗi không xác định'}`
      );
    } finally {
      setLoading(false);
    }
  }; // Function to complete the test
  const completeTheTest = () => {
    console.log(`Completing test with ID: ${testId}`);
    // Call the handler provided through props
    handleCompleteTest(testId)
      .then((response) => {
        console.log('Complete test response:', response);

        // Consider different response formats
        if (response) {
          // Silently handle status transition errors
          if (
            response.message &&
            (response.message.includes('Invalid status transition') ||
              response.message.includes('role'))
          ) {
            // Just log it but don't show error to the user
            console.log('Status transition info:', response.message);
            // Continue processing without setting error
          }

          // Check if the test status was updated to COMPLETED
          if (
            response.status === 'SUCCESS' ||
            response.success ||
            (response.data && response.data.status === 'COMPLETED') ||
            response.status === 'COMPLETED'
          ) {
            setSuccess('Test status updated to COMPLETED successfully! 🎉');

            // Update test with the returned data
            if (onTestUpdated) {
              const updatedData = response.data || response;
              onTestUpdated(updatedData);
            }

            // Close modal after showing success message
            setTimeout(() => onClose(), 1500);
          } else {
            // The response exists but doesn't indicate success
            const errorMessage =
              response.message ||
              (response.error ? response.error.message : null) ||
              'Unknown error completing test';
            console.error('Test completion error:', errorMessage);
            setError(`Error completing test: ${errorMessage}`);
            // Keep the error visible
          }
        } else {
          // No response received
          const noResponseError = 'Error completing test: No response received';
          console.error(noResponseError);
          setError(noResponseError);
        }
      })
      .catch((error) => {
        // Extract the error message, paying special attention to status transition errors
        let errorMsg = error.message || 'Unknown error';

        // Check if it's a response error object
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        }

        console.error('Error completing test:', error); // Format the error message but ignore status transition errors
        if (
          errorMsg.includes('Invalid status transition') ||
          errorMsg.includes('role')
        ) {
          // Don't show status transition errors
          console.log(`Ignoring status transition error: ${errorMsg}`);
        } else {
          setError(`Error completing test: ${errorMsg}`);
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCompleteCurrentTest = () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Check if handler exists
    if (!handleCompleteTest) {
      setError('Cannot complete test: No handler provided');
      setSaving(false);
      return;
    }

    // Call completeTheTest function directly
    completeTheTest();

    // First save the current results if we have any results to save
    if (
      results &&
      results.length > 0 &&
      results.some((result) => result.resultValue)
    ) {
      // Save results first
      console.log('Saving latest results before completing test');
      handleSaveResults()
        .then(() => {
          // Wait a moment before completing
          setTimeout(() => completeTheTest(), 500);
        })
        .catch((saveError) => {
          console.warn(
            'Warning: Could not save latest results before completing:',
            saveError
          );
          // Show warning but continue with completion
          setError(
            'Warning: Could not save latest results before completing test'
          );
          // Still try to complete
          completeTheTest();
        });
    } else {
      // No results to save, just complete
      completeTheTest();
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      maxWidth="md"
      fullWidth
      aria-labelledby="test-result-modal-title"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.16)',
          overflow: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }}
    >
      {' '}
      <DialogTitle
        id="test-result-modal-title"
        sx={{
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2.5,
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
        }}
      >
        <AssignmentIcon />
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 500, flexGrow: 1 }}
        >
          {currentTest &&
          (currentTest.status === 'RESULTED' ||
            currentTest.status === 'COMPLETED')
            ? 'View Test Results'
            : currentTest && currentTest.status === 'SAMPLED'
              ? 'Enter Test Results'
              : currentTest
                ? `Test Results - ${currentTest.status}`
                : 'Test Results'}
        </Typography>
        {currentTest && currentTest.status && (
          <Chip
            label={currentTest.status}
            color={
              currentTest.status === 'COMPLETED'
                ? 'success'
                : currentTest.status === 'RESULTED'
                  ? 'info'
                  : currentTest.status === 'SAMPLED'
                    ? 'warning'
                    : 'default'
            }
            size="small"
            sx={{ fontWeight: 500 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              my: 5,
              py: 3,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 60,
                height: 60,
                mb: 2,
              }}
            >
              <CircularProgress
                size={60}
                sx={{
                  color: '#4A90E2',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
              <CircularProgress
                size={45}
                sx={{
                  color: '#1ABC9C',
                  position: 'absolute',
                  top: '7.5px',
                  left: '7.5px',
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Loading test data...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we retrieve your test information
            </Typography>
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              my: 2.5,
              borderRadius: '12px',
              '& .MuiAlert-icon': {
                alignItems: 'center',
              },
              background: 'linear-gradient(45deg, #F44336, #E57373)',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.2)',
              border: 'none',
            }}
            onClose={() => {
              // Don't allow closing of status transition errors with the X button
              if (!error.includes('Invalid status transition')) {
                setError(null);
              }
            }}
            variant="filled"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="body1"
                fontWeight="600"
                sx={{ color: 'white' }}
              >
                {error}
              </Typography>

              {error.includes('Invalid status transition') && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '6px',
                    px: 1.5,
                    py: 0.75,
                    display: 'inline-block',
                    mt: 1.5,
                  }}
                >
                  Không thể hoàn thành xét nghiệm. Hãy đảm bảo xét nghiệm đã ở
                  trạng thái RESULTED trước khi hoàn thành.
                </Typography>
              )}

              {error.includes('Failed to save') && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '6px',
                    px: 1.5,
                    py: 0.75,
                    display: 'inline-block',
                    mt: 1.5,
                  }}
                >
                  This could be due to network issues or expired authentication.
                  Please try again or refresh the page.
                </Typography>
              )}
            </Box>
          </Alert>
        ) : !currentTest ? (
          <Alert severity="warning" sx={{ my: 2 }}>
            Không có dữ liệu xét nghiệm
          </Alert>
        ) : (
          <>
            {' '}
            {success && (
              <Alert
                severity="success"
                sx={{
                  my: 2.5,
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  },
                  background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)',
                  border: 'none',
                }}
                variant="filled"
                onClose={() => setSuccess(null)}
              >
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {success}
                </Typography>
              </Alert>
            )}
            {serviceData && (
              <Box sx={{ mb: 3 }}>
                {' '}
                <Card
                  elevation={2}
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #ffffff, #f5f9ff)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '6px',
                      height: '100%',
                      background:
                        'linear-gradient(to bottom, #4A90E2, #1ABC9C)',
                    },
                  }}
                >
                  {' '}
                  <CardContent sx={{ pl: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={7}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: 'rgba(74, 144, 226, 0.12)',
                              p: 1,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MedicalServicesIcon sx={{ color: '#4A90E2' }} />
                          </Box>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: 600,
                              background:
                                'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {serviceData.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                          sx={{ ml: 5.5, lineHeight: 1.6 }}
                        >
                          {serviceData.description}
                        </Typography>
                      </Grid>
                      {currentTest && (
                        <Grid item xs={12} md={5}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              p: 2.5,
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                              boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '40px',
                                height: '40px',
                                background:
                                  'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.08))',
                                borderBottomLeftRadius: '100%',
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                mb: 2,
                                color: '#4A90E2',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                letterSpacing: '1px',
                              }}
                            >
                              Test Information
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                                pb: 1.5,
                                borderBottom: '1px dashed rgba(0, 0, 0, 0.08)',
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: 'rgba(74, 144, 226, 0.1)',
                                  p: 0.8,
                                  borderRadius: 1,
                                  display: 'flex',
                                  mr: 1.5,
                                }}
                              >
                                <EventNoteIcon
                                  fontSize="small"
                                  sx={{ color: '#4A90E2' }}
                                />
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  component="div"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#555',
                                    mb: 0.2,
                                  }}
                                >
                                  Test ID
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    color: '#4A90E2',
                                  }}
                                >
                                  #{currentTest.testId}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: 'rgba(26, 188, 156, 0.1)',
                                  p: 0.8,
                                  borderRadius: 1,
                                  display: 'flex',
                                  mr: 1.5,
                                }}
                              >
                                <PersonIcon
                                  fontSize="small"
                                  sx={{ color: '#1ABC9C' }}
                                />
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  component="div"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#555',
                                    mb: 0.2,
                                  }}
                                >
                                  Customer
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                  }}
                                >
                                  {currentTest.customerName}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
                <Divider sx={{ my: 2 }} />{' '}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2.5,
                    position: 'relative',
                    pl: 4.5,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '24px',
                      width: '4px',
                      background:
                        'linear-gradient(to bottom, #4A90E2, #1ABC9C)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(74, 144, 226, 0.08)',
                      p: 1,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AssignmentIcon
                      sx={{ color: '#4A90E2' }}
                      fontSize="small"
                    />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Test Components
                  </Typography>
                  <Chip
                    label={serviceData.components?.length || 0}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                      color: 'white',
                      height: '22px',
                      minWidth: '22px',
                      ml: 1,
                    }}
                  />
                </Box>
                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 2,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  {' '}
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.08))',
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderBottom: 'none',
                            color: '#4A90E2',
                            py: 1.5,
                          }}
                        >
                          Component
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderBottom: 'none',
                            color: '#4A90E2',
                            py: 1.5,
                          }}
                        >
                          Unit
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderBottom: 'none',
                            color: '#4A90E2',
                            py: 1.5,
                          }}
                        >
                          Normal Range
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderBottom: 'none',
                            color: '#4A90E2',
                            py: 1.5,
                          }}
                        >
                          Result Value
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            borderBottom: 'none',
                            color: '#4A90E2',
                            py: 1.5,
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {' '}
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Box
                              sx={{
                                py: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <CircularProgress
                                size={40}
                                sx={{
                                  mb: 2,
                                  color: (theme) => theme.palette.primary.main,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Loading test components...
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : serviceData &&
                        serviceData.components &&
                        serviceData.components.length > 0 ? (
                        serviceData.components.map((component, index) => {
                          const result = results.find(
                            (r) => r.componentId === component.componentId
                          );

                          return (
                            <TableRow key={component.componentId}>
                              <TableCell>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {component.componentName}
                                </Typography>
                              </TableCell>{' '}
                              <TableCell>
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontFamily: "'Roboto Mono', monospace",
                                    }}
                                  >
                                    {result?.unit || '-'}
                                  </Typography>
                                ) : (
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={result?.unit || ''}
                                    onChange={(e) =>
                                      handleResultChange(
                                        component.componentId,
                                        'unit',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Unit"
                                    InputProps={{
                                      sx: { borderRadius: '8px' },
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Box
                                    sx={{
                                      px: 1.5,
                                      py: 0.5,
                                      background:
                                        'linear-gradient(to right, rgba(74, 144, 226, 0.06), rgba(26, 188, 156, 0.06))',
                                      borderRadius: '20px',
                                      display: 'inline-block',
                                      border:
                                        '1px solid rgba(74, 144, 226, 0.15)',
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontFamily: "'Roboto Mono', monospace",
                                        fontWeight: 600,
                                        color: '#4A90E2',
                                        letterSpacing: '0.3px',
                                      }}
                                    >
                                      {result?.normalRange || '-'}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <TextField
                                    size="small"
                                    fullWidth
                                    value={result?.normalRange || ''}
                                    onChange={(e) =>
                                      handleResultChange(
                                        component.componentId,
                                        'normalRange',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Normal Range"
                                    InputProps={{
                                      sx: { borderRadius: '8px' },
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                    }}
                                  >
                                    {result?.resultValue &&
                                    result?.normalRange &&
                                    isAbnormalResult(
                                      result.resultValue,
                                      result.normalRange
                                    ) ? (
                                      <Chip
                                        label={result?.resultValue || '-'}
                                        size="small"
                                        sx={{
                                          fontWeight: 600,
                                          color: 'white',
                                          background:
                                            'linear-gradient(45deg, #FF5252, #FF1744)',
                                          boxShadow:
                                            '0 2px 5px rgba(255, 23, 68, 0.3)',
                                          px: 0.5,
                                        }}
                                        icon={
                                          <WarningIcon
                                            sx={{ color: 'white!important' }}
                                          />
                                        }
                                      />
                                    ) : (
                                      <Chip
                                        label={result?.resultValue || '-'}
                                        size="small"
                                        sx={{
                                          fontWeight: 500,
                                          color: 'white',
                                          background:
                                            'linear-gradient(45deg, #4CAF50, #2E7D32)',
                                          boxShadow:
                                            '0 2px 5px rgba(46, 125, 50, 0.2)',
                                          px: 0.5,
                                        }}
                                        icon={
                                          <CheckCircleIcon
                                            sx={{ color: 'white!important' }}
                                          />
                                        }
                                      />
                                    )}
                                  </Box>
                                ) : (
                                  <TextField
                                    size="small"
                                    fullWidth
                                    required
                                    value={result?.resultValue || ''}
                                    onChange={(e) =>
                                      handleResultChange(
                                        component.componentId,
                                        'resultValue',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter result value"
                                    error={result?.resultValue === ''}
                                    helperText={
                                      result?.resultValue === ''
                                        ? 'Required'
                                        : ''
                                    }
                                    InputProps={{
                                      sx: { borderRadius: '8px' },
                                    }}
                                  />
                                )}
                              </TableCell>{' '}
                              <TableCell align="center">
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      gap: 1,
                                    }}
                                  >
                                    {' '}
                                    <Tooltip title="View Only" arrow>
                                      <PreviewIcon
                                        fontSize="small"
                                        color="disabled"
                                      />
                                    </Tooltip>
                                  </Box>
                                ) : (
                                  <Tooltip title="View Results" arrow>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={handleViewResults}
                                      sx={{
                                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                                        '&:hover': {
                                          bgcolor: 'rgba(25, 118, 210, 0.15)',
                                        },
                                      }}
                                    >
                                      <PreviewIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>
                            {' '}
                            <Box
                              sx={{
                                py: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background:
                                  'linear-gradient(135deg, rgba(74, 144, 226, 0.03), rgba(26, 188, 156, 0.03))',
                                borderRadius: '16px',
                                my: 3,
                                px: 3,
                                border: '1px dashed rgba(74, 144, 226, 0.2)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  width: '100px',
                                  height: '100px',
                                  borderRadius: '50%',
                                  background:
                                    'radial-gradient(circle, rgba(26, 188, 156, 0.05) 0%, rgba(74, 144, 226, 0.02) 70%)',
                                  bottom: '-30px',
                                  right: '-30px',
                                },
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  background:
                                    'radial-gradient(circle, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.02) 70%)',
                                  top: '-20px',
                                  left: '-20px',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  background:
                                    'linear-gradient(135deg, rgba(74, 144, 226, 0.15), rgba(26, 188, 156, 0.1))',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  mb: 2,
                                  boxShadow:
                                    '0 4px 15px rgba(74, 144, 226, 0.1)',
                                }}
                              >
                                <ErrorIcon
                                  sx={{
                                    fontSize: 30,
                                    color: '#4A90E2',
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="subtitle1"
                                align="center"
                                gutterBottom
                                sx={{
                                  fontWeight: 600,
                                  background:
                                    'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  mb: 1.5,
                                }}
                              >
                                No test components available
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                                sx={{
                                  maxWidth: '80%',
                                  padding: '10px 16px',
                                  borderRadius: '20px',
                                  background: 'rgba(255, 255, 255, 0.6)',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                  fontWeight: 500,
                                }}
                              >
                                {currentTest
                                  ? `Service ID: ${currentTest.serviceId || 'N/A'}, Test ID: ${currentTest.testId || 'N/A'}`
                                  : 'No test selected'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </DialogContent>{' '}
      <DialogActions
        sx={{
          px: 3,
          py: 3,
          background:
            'linear-gradient(to right, rgba(74, 144, 226, 0.03), rgba(26, 188, 156, 0.03))',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        {' '}
        <Button
          onClick={onClose}
          color="inherit"
          disabled={saving}
          variant="outlined"
          sx={{
            borderRadius: '50px',
            minWidth: '120px',
            textTransform: 'none',
            px: 3,
            borderColor: 'rgba(0, 0, 0, 0.15)',
            '&:hover': {
              borderColor: 'rgba(74, 144, 226, 0.5)',
              backgroundColor: 'rgba(74, 144, 226, 0.04)',
            },
          }}
        >
          Đóng
        </Button>{' '}
        {currentTest && currentTest.status === 'COMPLETED' ? (
          <>
            <Button
              onClick={handleViewResults}
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PreviewIcon />
                )
              }
              sx={{
                ml: 2,
                borderRadius: '50px',
                minWidth: '160px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                boxShadow: '0 4px 10px rgba(74, 144, 226, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                  boxShadow: '0 6px 15px rgba(74, 144, 226, 0.3)',
                },
              }}
            >
              {loading ? 'Loading...' : 'Xem Kết Quả'}
            </Button>
          </>
        ) : currentTest && currentTest.status === 'RESULTED' ? (
          <>
            {' '}
            <Button
              onClick={handleViewResults}
              variant="outlined"
              color="primary"
              disabled={loading}
              startIcon={<PreviewIcon />}
              sx={{
                ml: 2,
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Xem Kết Quả
            </Button>{' '}
            <Button
              onClick={handleCompleteCurrentTest}
              variant="contained"
              disabled={loading || saving || currentTest.status !== 'RESULTED'}
              startIcon={
                saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckIcon />
                )
              }
              color="success"
              title={
                currentTest.status !== 'RESULTED'
                  ? 'Chỉ có thể hoàn thành xét nghiệm ở trạng thái RESULTED'
                  : 'Hoàn thành xét nghiệm và đánh dấu kết quả cuối cùng'
              }
              sx={{
                ml: 2,
                borderRadius: '50px',
                minWidth: '160px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                background: 'linear-gradient(45deg, #2E7D32, #00C853)',
                boxShadow: '0 4px 10px rgba(46, 125, 50, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1B5E20, #00B84D)',
                  boxShadow: '0 6px 15px rgba(46, 125, 50, 0.3)',
                },
                '&.Mui-disabled': {
                  background: 'linear-gradient(45deg, #9E9E9E, #BDBDBD)',
                  color: 'rgba(255, 255, 255, 0.6)',
                },
              }}
            >
              {saving ? 'Đang xử lý...' : 'Hoàn Thành Xét Nghiệm'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleSaveResults}
            variant="contained"
            disabled={loading || saving || !serviceData}
            startIcon={saving && <CircularProgress size={20} color="inherit" />}
            sx={{
              ml: 2,
              borderRadius: '50px',
              minWidth: '160px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              boxShadow: '0 4px 10px rgba(74, 144, 226, 0.25)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                boxShadow: '0 6px 15px rgba(74, 144, 226, 0.3)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(45deg, #c5c5c5, #aaaaaa)',
              },
            }}
          >
            {saving ? 'Đang lưu...' : 'Lưu Kết Quả'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SingleTestResultModal;

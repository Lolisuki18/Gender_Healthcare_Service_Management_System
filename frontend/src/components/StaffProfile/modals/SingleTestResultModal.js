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
} from '@mui/material';
import {
  getSTIServiceById,
  getTestResultsByTestId,
} from '../../../services/stiService';
import PreviewIcon from '@mui/icons-material/Preview';

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
      setError(null);
      setSuccess(null);
      setResults([]);
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
    const hasEmptyValues = results.some((result) => !result.resultValue.trim());

    // Add detailed validation logging
    console.group('Results validation');
    console.log('Current results array:', results);
    console.log('Has empty values:', hasEmptyValues);
    if (hasEmptyValues) {
      const emptyResults = results.filter((r) => !r.resultValue.trim());
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
      setError('Please provide values for all test components');
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
        console.log('Save result response:', response);

        // Successfully saved results
        if (response && (response.status === 'SUCCESS' || response.success)) {
          setSuccess('Test results saved successfully');

          // Update test with the returned data
          if (onTestUpdated && response.data) {
            onTestUpdated(response.data);
          }

          // Try to update status to COMPLETED if handler exists
          if (handleCompleteTest) {
            try {
              console.log('Updating test status to COMPLETED');
              const completeResponse = await handleCompleteTest(testId);
              console.log('Complete test response:', completeResponse);

              if (completeResponse && completeResponse.status === 'SUCCESS') {
                setSuccess(
                  'Test results saved and status updated to COMPLETED'
                );
                if (onTestUpdated && completeResponse.data) {
                  onTestUpdated(completeResponse.data);
                }
              }
            } catch (completeError) {
              console.error(
                'Error updating test status to COMPLETED:',
                completeError
              );
              // Error updating status, but results were saved, so still successful
            }
          }

          // Close modal after showing success message
          setTimeout(() => onClose(), 1500);
          return;
        }

        // Handle case where response contains data despite error status
        else if (response && response.data) {
          console.log('Received data despite error status:', response);
          setSuccess('Test results saved successfully');

          if (onTestUpdated) {
            onTestUpdated(response.data);
          }

          // Try to update status to COMPLETED
          if (handleCompleteTest) {
            try {
              await handleCompleteTest(testId);
            } catch (completeError) {
              console.error('Error updating status after save:', completeError);
            }
          }

          setTimeout(() => onClose(), 1500);
          return;
        }

        // Handle explicit error case
        else {
          throw new Error(response?.message || 'Failed to save test results');
        }
      } catch (apiError) {
        console.error('API error in handleSaveResult:', apiError);

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
              throw new Error('Failed to save results after token refresh');
            }
          } catch (retryError) {
            console.error('Failed retry after token refresh:', retryError);
            throw retryError;
          }
        } else {
          throw apiError; // Re-throw for the outer catch
        }
      }
    } catch (err) {
      console.error('Error saving test results:', err);
      setError(err?.message || 'An error occurred while saving the results');
    } finally {
      setSaving(false);
    }
  }; // Function to handle viewing results (fetches both service data and test results)
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

      if (testResults) {
        setSuccess('Test results loaded successfully');
      } else {
        console.warn('No test results found for test ID:', currentTest.testId);
      }
    } catch (err) {
      console.error('Error viewing test results:', err);
      setError(
        `Failed to load test results: ${err.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
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
    >
      {' '}
      <DialogTitle id="test-result-modal-title">
        {currentTest &&
        (currentTest.status === 'RESULTED' ||
          currentTest.status === 'COMPLETED')
          ? 'View Test Results'
          : currentTest && currentTest.status === 'SAMPLED'
            ? 'Enter Test Results'
            : currentTest
              ? `Test Results - ${currentTest.status}`
              : 'Test Results'}
      </DialogTitle>{' '}
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }} onClose={() => setError(null)}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" fontWeight="medium">
                {error}
              </Typography>
              {error.includes('Failed to save') && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  This could be due to network issues or expired authentication.
                  Please try again or refresh the page.
                </Typography>
              )}
            </Box>
          </Alert>
        ) : !currentTest ? (
          <Alert severity="warning" sx={{ my: 2 }}>
            Test data not available
          </Alert>
        ) : (
          <>
            {success && (
              <Alert severity="success" sx={{ my: 2 }}>
                {success}
              </Alert>
            )}
            {serviceData && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {serviceData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {serviceData.description}
                </Typography>

                {currentTest && (
                  <Box sx={{ my: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Test ID: {currentTest.testId}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Customer: {currentTest.customerName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Status: {currentTest.status}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Test Components
                </Typography>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Normal Range</TableCell>
                        <TableCell>Result Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {' '}
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <CircularProgress size={24} sx={{ my: 2 }} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Loading components...
                            </Typography>
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
                              <TableCell>{component.componentName}</TableCell>{' '}
                              <TableCell>
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Typography variant="body2">
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
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Typography variant="body2">
                                    {result?.normalRange || '-'}
                                  </Typography>
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
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {currentTest &&
                                (currentTest.status === 'RESULTED' ||
                                  currentTest.status === 'COMPLETED') ? (
                                  <Typography variant="body2">
                                    {result?.resultValue || '-'}
                                  </Typography>
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
                            <Typography align="center">
                              No test components available
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              align="center"
                              sx={{ display: 'block', mt: 1 }}
                            >
                              {currentTest
                                ? `Service ID: ${currentTest.serviceId || 'N/A'}, Test ID: ${currentTest.testId || 'N/A'}`
                                : 'No test selected'}
                            </Typography>
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
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          Cancel
        </Button>

        {currentTest &&
        (currentTest.status === 'RESULTED' ||
          currentTest.status === 'COMPLETED') ? (
          <>
            {' '}
            <Button
              onClick={handleViewResults}
              color="info"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PreviewIcon />
                )
              }
            >
              {loading ? 'Loading...' : 'View Results'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleSaveResults}
            color="primary"
            variant="contained"
            disabled={loading || saving || !serviceData}
            startIcon={saving && <CircularProgress size={20} color="inherit" />}
          >
            {saving ? 'Saving...' : 'Save Results'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SingleTestResultModal;

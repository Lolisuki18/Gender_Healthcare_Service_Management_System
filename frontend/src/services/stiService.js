
import apiClient from '@services/api';

// Retry payment for a failed test payment
export const retryPayment = async (testId, retryData) => {
  try {
    const response = await apiClient.post(`/sti-services/tests/${testId}/retry-payment`, retryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const API_URL = '/sti-services';

// Get conclusion options for test results
export const getConclusionOptions = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/conclusion-options`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new STI service (Staff only)
export const createSTIService = async (serviceData) => {
  try {
    const response = await apiClient.post(API_URL, serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Get all active STI services (dành cho user, chỉ trả về dịch vụ còn hoạt động)
export const getActiveSTIServices = async () => {
  try {
    const response = await apiClient.get('/sti-services');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Get all STI services (dành cho staff, trả về tất cả dịch vụ)
export const getAllSTIServices = async () => {
  try {
    const response = await apiClient.get('/sti-services/staff');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get STI service by ID
export const getSTIServiceById = async (serviceId) => {
  try {
    const response = await apiClient.get(`${API_URL}/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update STI service (Staff only)
export const updateSTIService = async (serviceId, serviceData) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/${serviceId}`,
      serviceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete STI service (Staff only)
export const deleteSTIService = async (serviceId) => {
  try {
    const response = await apiClient.delete(`${API_URL}/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Book a new STI test
export const bookSTITest = async (testData) => {
  try {
    const response = await apiClient.post(`${API_URL}/book-test`, testData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all tests for current user
export const getMySTITests = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/my-tests`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get test details by ID
export const getSTITestDetails = async (testId) => {
  try {
    const response = await apiClient.get(`${API_URL}/tests/${testId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cancel a test
export const cancelSTITest = async (testId, reason) => {
  try {
    // Luôn gửi body JSON, kể cả khi reason rỗng
    const response = await apiClient.put(`${API_URL}/tests/${testId}/cancel`, {
      reason: reason ?? '',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pending tests (Staff only)
export const getPendingTests = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/staff/pending-tests`);

    // Xử lý dữ liệu từ backend tương tự getStaffTests
    let processedData = response.data;
    if (Array.isArray(response.data)) {
      processedData = {
        status: 'SUCCESS',
        data: response.data,
        message: 'Retrieved pending tests successfully',
      };
    }

    return processedData;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Confirm a test (Staff only)
export const confirmTest = async (testId) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/confirm`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get confirmed tests (Staff only)
export const getConfirmedTests = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/staff/confirmed-tests`);

    // Xử lý dữ liệu từ backend tương tự getStaffTests
    let processedData = response.data;
    if (Array.isArray(response.data)) {
      processedData = {
        status: 'SUCCESS',
        data: response.data,
        message: 'Retrieved confirmed tests successfully',
      };
    }

    return processedData;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mark test as sampled (Staff only)
export const sampleTest = async (testId) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/sample`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get tests assigned to staff member (Staff only)
export const getStaffTests = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/staff/my-tests`);
    // Xử lý dữ liệu từ backend trả về để phù hợp với frontend
    // Backend có thể trả về cấu trúc khác với cấu trúc mà UI đang sử dụng
    let processedData = response.data;

    // Nếu response.data là mảng trực tiếp (không có wrapper), bọc nó lại
    if (Array.isArray(response.data)) {
      processedData = {
        status: 'SUCCESS',
        data: response.data,
        message: 'Retrieved tests successfully',
      };
    }

    return processedData;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add test results (Staff only)
export const addTestResults = async (testId, resultsData) => {
  try {
    // // Add very detailed logging for debugging
    // console.group('Test Results API Call');
    // console.log(`Test ID: ${testId}`);
    // console.log('Raw request data:', resultsData);
    // console.log('Stringified data:', JSON.stringify(resultsData, null, 2));
    // console.log('Data structure:', {
    //   hasStatus: !!resultsData.status,
    //   statusIs: resultsData.status,
    //   hasResults: !!resultsData.results,
    //   resultsIsArray: Array.isArray(resultsData.results),
    //   resultsLength: resultsData.results ? resultsData.results.length : 0,
    //   firstResult:
    //     resultsData.results && resultsData.results.length > 0
    //       ? resultsData.results[0]
    //       : null,
    //   serviceId: resultsData.serviceId || 'Not specified',
    // });

    // Make sure resultsData has the correct format expected by the backend
    if (!resultsData.status || !Array.isArray(resultsData.results)) {
      // console.error('Invalid data structure', resultsData);
      // console.groupEnd();
      throw new Error('Invalid test result data format');
    }

    // If we have a specific serviceId, we need to get existing results and merge them
    if (resultsData.serviceId && resultsData.results.length > 0) {
      // console.log(
      //   `Processing results for specific service ID: ${resultsData.serviceId}`
      // );

      try {
        // Fetch existing results for this test
        console.log(`Fetching existing results for test ID ${testId}`);
        const existingResultsResponse = await getTestResultsByTestId(testId);
        const existingResults = existingResultsResponse?.data || [];

        if (Array.isArray(existingResults) && existingResults.length > 0) {
          console.log(
            `Found ${existingResults.length} existing results for test ID ${testId}`
          );

          // Create map of component IDs for quick lookup
          const newResultComponentIds = resultsData.results.map((r) =>
            typeof r.componentId === 'number'
              ? r.componentId
              : parseInt(r.componentId)
          );

          console.log('New result component IDs:', newResultComponentIds);

          // Add existing results for components we're not updating
          existingResults.forEach((existingResult) => {
            const existingComponentId =
              typeof existingResult.componentId === 'number'
                ? existingResult.componentId
                : parseInt(existingResult.componentId);

            // If this component is not in our new results, add it
            if (!newResultComponentIds.includes(existingComponentId)) {
              console.log(
                `Adding existing result for component ID ${existingComponentId}`
              );
              resultsData.results.push({
                componentId: existingComponentId,
                resultValue: existingResult.resultValue || '',
                unit: existingResult.unit || '',
                normalRange: existingResult.normalRange || '',
              });
            }
          });

          console.log(
            `After merging, sending ${resultsData.results.length} results`
          );
        } else {
          console.log(
            'No existing results found, proceeding with only new results'
          );
        }
      } catch (fetchError) {
        console.error('Error fetching existing results:', fetchError);
        console.log('Proceeding with only the new results');
      }
    }

    const validData = {
      status: resultsData.status, // Ensure we send exactly what the backend expects
      // Include serviceId if provided - helps backend identify which service components to update
      ...(resultsData.serviceId && { serviceId: resultsData.serviceId }),
      results: resultsData.results.map((result) => {
        // Ensure componentId is numeric
        let componentId = result.componentId;
        if (typeof componentId !== 'number') {
          if (!isNaN(parseInt(componentId))) {
            componentId = parseInt(componentId);
          } else {
            // Use testId as fallback
            componentId = parseInt(testId) || 1;
          }
        }

        // Check if values are as expected
        console.log(
          `Component ${componentId}: resultValue=${result.resultValue}, unit=${result.unit}, normalRange=${result.normalRange}, conclusion=${result.conclusion}`
        );

        // Make sure all required fields are present and properly formatted
        return {
          componentId, // Now guaranteed to be numeric
          resultValue: result.resultValue || '',
          normalRange: result.normalRange || '',
          unit: result.unit || '',
          conclusion:
            result.conclusion && result.conclusion !== ''
              ? result.conclusion
              : null,
        };
      }),
    };

    console.log(
      'Final API request payload:',
      JSON.stringify(validData, null, 2)
    );

    try {
      const response = await apiClient.put(
        `${API_URL}/staff/tests/${testId}/result`,
        validData
      );

      // console.log('API response status:', response.status);
      // console.log('API response data:', response.data);
      // console.groupEnd();
      return response.data;
    } catch (apiError) {
      console.error('API call failed:', apiError);
      if (apiError.response) {
        console.error('API error status:', apiError.response.status);
        console.error('API error data:', apiError.response.data);
      } else {
        console.error('No API response received');
      }
      console.groupEnd();
      throw apiError.response?.data || apiError;
    }
  } catch (error) {
    console.error('Error in addTestResults:', error);
    console.groupEnd();
    throw error;
  }
};

// Complete a test (Staff only)
export const completeTest = async (testId, resultsData) => {
  try {
    console.group('Complete Test Process');
    console.log(`Starting completion process for test ID: ${testId}`);

    // Step 1: If result data is provided, save it first.
    // This ensures the test status is 'RESULTED', which is required to move to 'COMPLETED'.
    if (resultsData && resultsData.results && resultsData.results.length > 0) {
      console.log('New result data found. Saving results before completing...');
      try {
        await addTestResults(testId, {
          status: 'RESULTED', // This status is for the save operation
          results: resultsData.results,
          serviceId: resultsData.serviceId, // Pass serviceId for package tests
        });
        console.log(`Results for test ID ${testId} saved successfully.`);
      } catch (saveError) {
        console.error('Failed to save results before completing:', saveError);
        console.groupEnd();
        // If saving fails, we must stop the process.
        throw saveError;
      }
    } else {
      console.log(
        'No new result data provided. Proceeding directly to completion check.'
      );
    }

    // Step 2: Call the dedicated endpoint to mark the test as 'COMPLETED'.
    // This endpoint will transition the status from 'RESULTED' to 'COMPLETED'.
    console.log(`Sending request to mark test ID ${testId} as COMPLETED.`);
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/complete`
    );

    console.log('Test completed successfully. API Response:', response.data);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error(`Error during completeTest for test ID ${testId}:`, error);
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
    }
    console.groupEnd();
    throw error.response?.data || error;
  }
};

// Get test results for a specific test
export const getTestResults = async (testId) => {
  try {
    const response = await apiClient.get(`${API_URL}/tests/${testId}/results`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Retrieve test results for a specific test ID
export const getTestResultsByTestId = async (testId) => {
  try {
    const response = await apiClient.get(`${API_URL}/tests/${testId}/results`);
    // API now returns a wrapper object, so we extract the data array
    if (response.data && response.data.success) {
      return response.data.data;
    }
    // Fallback for old format or if 'success' is not true
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all STI packages
export const getAllSTIPackages = async () => {
  try {
    const response = await apiClient.get('/sti-packages');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new STI package (Staff only)
export const createSTIPackage = async (packageData) => {
  try {
    // Đảm bảo stiService là mảng ID (number)
    const validatedData = {
      ...packageData,
      stiService: Array.isArray(packageData.stiService)
        ? packageData.stiService
            .map((item) =>
              typeof item === 'object' && item !== null ? item.id : item
            )
            .filter((id) => typeof id === 'number')
        : [],
      isActive:
        packageData.isActive !== undefined
          ? packageData.isActive
          : packageData.active !== undefined
            ? packageData.active
            : true,
    };
    const response = await apiClient.post('/sti-packages', validatedData);
    return response.data;
  } catch (error) {
    console.error('Error creating STI package:', error);
    throw error.response?.data || error.message;
  }
};

// Get STI package by ID
export const getSTIPackageById = async (packageId) => {
  try {
    const response = await apiClient.get(`/sti-packages/${packageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update an STI package (Staff only)
export const updateSTIPackage = async (packageId, packageData) => {
  try {
    // Đảm bảo stiService là mảng ID (number)
    const validatedData = {
      ...packageData,
      stiService: Array.isArray(packageData.stiService)
        ? packageData.stiService
            .map((item) =>
              typeof item === 'object' && item !== null ? item.id : item
            )
            .filter((id) => typeof id === 'number')
        : [],
      isActive:
        packageData.isActive !== undefined
          ? packageData.isActive
          : packageData.active !== undefined
            ? packageData.active
            : true,
    };
    const response = await apiClient.put(
      `/sti-packages/${packageId}`,
      validatedData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating STI package:', error);
    throw error.response?.data || error.message;
  }
};

// Delete an STI package (Staff only)
export const deleteSTIPackage = async (packageId) => {
  try {
    const response = await apiClient.delete(`/sti-packages/${packageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get package test details with components
export const getPackageTestDetails = async (packageId) => {
  try {
    // First try to get detailed test information
    const testResponse = await apiClient.get(`${API_URL}/tests/${packageId}`);

    // Then get test results which should include component information
    const resultsResponse = await apiClient.get(
      `${API_URL}/tests/${packageId}/results`
    );

    // Combine the data
    const packageData = testResponse.data?.data || testResponse.data || {};
    const resultsData =
      resultsResponse.data?.data || resultsResponse.data || [];

    // Store the original results for reference
    packageData.results = [...resultsData];

    // Check if we already have components in the package data
    let componentsData = [];

    if (
      packageData.testComponents &&
      Array.isArray(packageData.testComponents) &&
      packageData.testComponents.length > 0
    ) {
      componentsData = packageData.testComponents;
    }
    // Otherwise transform the results into components
    else if (resultsData.length > 0) {
      componentsData = resultsData.map((result, index) => ({
        id:
          result.componentId || result.testId || result.id || `result-${index}`,
        componentId:
          result.componentId || result.testId || result.id || `result-${index}`,
        componentName:
          result.componentName ||
          result.testName ||
          result.name ||
          `Result ${index + 1}`,
        status: result.status || packageData.status || 'RESULTED',
        resultValue: result.resultValue || result.value || null,
        unit: result.unit || null,
        normalRange: result.normalRange || result.referenceRange || null,
      }));
    }
    // Create dummy components if nothing was found
    else {
      // Create at least 2 mock components based on the package test
      componentsData = [
        {
          id: `component-1-${packageId}`,
          componentId: `component-1-${packageId}`,
          componentName: `${packageData.serviceName || 'Test'} Component 1`,
          status: packageData.status || 'PENDING',
          resultValue: null,
          unit: null,
          normalRange: null,
        },
        {
          id: `component-2-${packageId}`,
          componentId: `component-2-${packageId}`,
          componentName: `${packageData.serviceName || 'Test'} Component 2`,
          status: packageData.status || 'PENDING',
          resultValue: null,
          unit: null,
          normalRange: null,
        },
      ];
    }

    // Add components to the package data
    packageData.testComponents = componentsData;

    return {
      status: 'SUCCESS',
      data: packageData,
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Save partial test results (Staff only) - không đổi trạng thái test
export const savePartialTestResults = async (testId, resultData) => {
  try {
    // The endpoint should not contain the status, as we are not changing it
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/save-partial-results`,
      resultData.results // Send only the array of results
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Hàm mới để cập nhật kết quả cho một xét nghiệm đã có kết quả (RESULTED)
export const updateTestResults = async (testId, resultsData) => {
  try {
    // API này chỉ nhận một mảng các kết quả, không phải object bao ngoài
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/update-results`,
      resultsData.results // Chỉ gửi mảng results
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update consultant notes for a STI test (Consultant only)
export const updateConsultantNotes = async (testId, consultantNotes) => {
  try {
    const response = await apiClient.put(
      `/sti-services/tests/${testId}/consultant-notes`,
      { consultantNotes }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update consultant note for a specific service in a package test
export const updateConsultantNoteForService = async (testId, serviceId, consultantId, note) => {
  try {
    const response = await apiClient.put(
      `/sti-tests/${testId}/service-note`,
      { serviceId, consultantId, note }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all tests assigned to current consultant
export const getConsultantSTITests = async () => {
  try {
    const response = await apiClient.get('/sti-services/consultant/my-tests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get canceled tests (Staff only)
export const getCanceledTests = async () => {
  try {
    const response = await apiClient.get('/sti-services/staff/canceled-tests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pending COD payments for staff
const getPendingCODPayments = async () => {
  try {
    const response = await apiClient.get('/sti-services/staff/pending-cod-payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending COD payments:', error);
    throw error.response?.data || error.message;
  }
};

// Confirm COD payment by staff
const confirmCODPayment = async (paymentId, notes) => {
  try {
    const response = await apiClient.put(`/sti-services/staff/payments/${paymentId}/confirm-cod`, {
      notes: notes || ''
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming COD payment:', error);
    throw error.response?.data || error.message;
  }
};

// Export as a default object with all functions
const stiService = {
  createSTIService,
  getAllSTIServices,
  getSTIServiceById,
  updateSTIService,
  deleteSTIService,
  bookSTITest,
  getMySTITests,
  getSTITestDetails,
  cancelSTITest,
  getPendingTests,
  confirmTest,
  getConfirmedTests,
  sampleTest,
  getStaffTests,
  addTestResults,
  completeTest,
  getTestResults,
  getTestResultsByTestId,
  getAllSTIPackages,
  createSTIPackage,
  getSTIPackageById,
  updateSTIPackage,
  deleteSTIPackage,
  getPackageTestDetails,
  getActiveSTIServices,
  savePartialTestResults,
  updateTestResults,

  updateConsultantNotes,
  getConsultantSTITests,
  getCanceledTests,

  retryPayment,
  getPendingCODPayments,
  confirmCODPayment,

  // New function to get services within a package
  // getServicesInPackage: async (packageId) => {
  //   try {
  //     // First attempt to get full package details which should include services
  //     const response = await apiClient.get(`/sti-packages/${packageId}`);
  //     const packageData = response.data?.data || response.data;
  //
  //     if (!packageData) {
  //       throw new Error('Package data not found');
  //     }
  //
  //     // Extract just the services array
  //     const services = packageData.services || [];
  //
  //     return {
  //       status: 'SUCCESS',
  //       data: services,
  //       message: `Retrieved ${services.length} services for package #${packageId}`,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching package services:', error);
  //     throw error.response?.data || error.message;
  //   }
  // },
  // Add any new functions here
};

export default stiService;

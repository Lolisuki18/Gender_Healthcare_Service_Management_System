import apiClient from '@services/api';

const API_URL = '/sti-services';

// Create a new STI service (Staff only)
export const createSTIService = async (serviceData) => {
  try {
    const response = await apiClient.post(API_URL, serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all STI services
export const getAllSTIServices = async () => {
  try {
    const response = await apiClient.get('/sti-services');
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
export const cancelSTITest = async (testId) => {
  try {
    const response = await apiClient.put(`${API_URL}/tests/${testId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pending tests (Staff only)
export const getPendingTests = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/staff/pending-tests`);
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add test results (Staff only)
export const addTestResults = async (testId, resultsData) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/result`,
      resultsData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Complete a test (Staff only)
export const completeTest = async (testId) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/staff/tests/${testId}/complete`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get test results
export const getTestResults = async (testId) => {
  try {
    const response = await apiClient.get(`${API_URL}/tests/${testId}/results`);
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
    const response = await apiClient.post('/sti-packages', packageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Default export as stiService object with all functions
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
  getAllSTIPackages,
  createSTIPackage,
};

export default stiService;

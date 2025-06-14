// src/services/stiService.js
import apiClient from "./api";

export const stiService = {
  // Lấy tất cả gói đang hoạt động - Public endpoint
  getActiveSTIServices: async () => {
    try {
      const res = await apiClient.get("/sti-services?include=testComponents");
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to fetch STI services');
      }
      return res.data.data;
    } catch (error) {
      console.error('Error fetching STI services:', error);
      if (error.message === 'Authentication required') {
        return []; // Return empty array for unauthenticated users
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Get package detail - Public endpoint
  getPackageDetail: async (id) => {
    try {
      if (!id) {
        throw new Error('Service ID is required');
      }
      const response = await apiClient.get(`/sti-services/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch package details');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      if (error.message === 'Authentication required') {
        return null; // Return null for unauthenticated users
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Đặt lịch xét nghiệm STI
  bookTest: async (testData) => {
    try {
      if (!testData || !testData.serviceId) {
        throw new Error('Invalid booking data');
      }
      const response = await apiClient.post("/sti-services/book-test", testData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to book test');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error booking test:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Lấy danh sách xét nghiệm của người dùng
  getMyTests: async () => {
    try {
      const response = await apiClient.get("/sti-services/my-tests");
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tests');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching my tests:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Tạo QR thanh toán
  createQRPayment: async (testId) => {
    try {
      if (!testId) {
        throw new Error('Test ID is required');
      }
      const response = await apiClient.post('/payments/qr/create', { testId });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create QR payment');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error creating QR payment:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Kiểm tra trạng thái thanh toán QR
  checkQRPaymentStatus: async (qrReference) => {
    try {
      if (!qrReference) {
        throw new Error('QR reference is required');
      }
      const response = await apiClient.post(`/payments/qr/${qrReference}/check`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to check payment status');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error checking QR payment:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
};

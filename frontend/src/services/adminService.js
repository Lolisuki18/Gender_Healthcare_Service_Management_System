import apiClient from './api';

// Service cho các API liên quan đến người dùng
export const adminService = {
  //=================================================Thêm người dùng=================================================
  // TThêm người dùng mới
  addNewUserAccount: async (userData) => {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error adding new user account:', error);
      throw error.response?.data || error;
    }
  },

  //=================================================Lấy thông tin=================================================

  //Hàm lấy toàn bộ người dùng
  getAllUsers: async () => {
    try {
      // console.log('Making API call to: /admin/users');
      const response = await apiClient.get(`/admin/users`);

      // Log để debug structure
      // console.log('Raw API Response:', response);
      // console.log('Response data:', response.data);
      // console.log('Response structure:', {
      //   success: response.data?.success,
      //   dataType: Array.isArray(response.data?.data),
      //   dataLength: response.data?.data?.length,
      // });

      // Backend trả về ApiResponse với structure: { success, message, data }
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [], // Lấy data từ ApiResponse.data
          message: response.data.message,
        };
      } else {
        throw new Error(response.data?.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('AdminService.getAllUsers error:', error);
      // console.error('Error details:', {
      //   status: error.response?.status,
      //   statusText: error.response?.statusText,
      //   data: error.response?.data,
      // });

      // Handle different error types
      if (error.response?.status === 404) {
        throw new Error('API endpoint not found');
      }

      if (error.response?.status === 500) {
        throw new Error('Server error');
      }

      throw error;
    }
  },

  // Lấy thông tin consultant với profile (nếu có)
  getConsultantDetails: async (consultantId) => {
    try {
      const response = await apiClient.get(
        `/admin/consultants/${consultantId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy toàn bộ lịch hẹn (consultation) cho admin
  getAllConsultations: async () => {
    try {
      const response = await apiClient.get('/consultations/all');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch consultations'
        );
      }
    } catch (error) {
      console.error('AdminService.getAllConsultations error:', error);
      throw error.response?.data || error;
    }
  },

  //================================================Xoá thông tin=================================================

  // Xóa consultant (bao gồm cả profile nếu có)
  deleteConsultant: async (consultantId) => {
    try {
      const response = await apiClient.delete(
        `/admin/consultants/${consultantId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  //=================================================Cập nhật thông tin=================================================

  // Cập nhật thông tin người dùng theo role
  updateUser: async (userId, role, userData) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật trạng thái người dùng
  updateUserStatus: async (userId, roleData) => {
    try {
      //tạo request object
      const updateRoleAndStatus = {
        role: roleData.role,
        isActive: roleData.isActive,
      };
      const response = await apiClient.put(
        `/admin/users/${userId}`,
        updateRoleAndStatus
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //=================================================Utility Methods=================================================

  // Lấy tổng quan doanh thu
  getRevenueSummary: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/revenue/summary', {
        params,
      });
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch revenue summary'
        );
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách giao dịch đã thanh toán
  getRevenueTransactions: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/revenue/transactions', {
        params,
      });
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch revenue transactions'
        );
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tổng quan dashboard admin
  getDashboardOverview: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/overview');
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch dashboard overview'
        );
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách dịch vụ STI còn hoạt động
  getActiveSTIServices: async () => {
    try {
      const response = await apiClient.get('/sti-services');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch active STI services'
        );
      }
    } catch (error) {
      console.error('AdminService.getActiveSTIServices error:', error);
      throw error.response?.data || error;
    }
  },

  // Lấy tất cả dịch vụ STI (cho staff/admin)
  getAllSTIServices: async () => {
    try {
      const response = await apiClient.get('/sti-services/staff');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch all STI services'
        );
      }
    } catch (error) {
      console.error('AdminService.getAllSTIServices error:', error);
      throw error.response?.data || error;
    }
  },

  // Lấy tất cả STI tests cho admin
  getAllSTITests: async () => {
    try {
      const response = await apiClient.get('/sti-services/admin/all-tests');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data?.message || 'Failed to fetch all STI tests'
        );
      }
    } catch (error) {
      console.error('AdminService.getAllSTITests error:', error);
      throw error.response?.data || error;
    }
  },
};

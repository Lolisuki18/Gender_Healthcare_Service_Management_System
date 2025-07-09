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
      console.log('Making API call to: /admin/users');
      const response = await apiClient.get(`/admin/users`);

      // ✅ Log để debug structure
      console.log('Raw API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response structure:', {
        success: response.data?.success,
        dataType: Array.isArray(response.data?.data),
        dataLength: response.data?.data?.length,
      });

      // ✅ Backend trả về ApiResponse với structure: { success, message, data }
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
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      // ✅ Handle different error types
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

  // Xóa customer theo ID
  deleteCustomer: async (customerId) => {
    try {
      const response = await apiClient.delete(`/admin/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

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
  //xoá staff theo id
  deleteStaff: async (staffId) => {
    try {
      const response = await apiClient.delete(`/admin/consultants/${staffId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  //xoá admin theo id
  deleteAdmin: async (adminId) => {
    try {
      const response = await apiClient.delete(`/admin/admins/${adminId}`);
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

  // Kiểm tra xem consultant có profile hay không
  checkConsultantProfile: async (consultantId) => {
    try {
      const response = await apiClient.head(
        `/admin/consultants/${consultantId}/profile`
      );
      return true; // Profile exists
    } catch (error) {
      if (error.response?.status === 404) {
        return false; // Profile doesn't exist
      }
      throw error.response?.data || error;
    }
  },

  // Get statistics
  getUserStatistics: async () => {
    try {
      const response = await apiClient.get('/admin/users/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

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
};

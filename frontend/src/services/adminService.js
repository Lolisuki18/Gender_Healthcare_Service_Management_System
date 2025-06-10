import apiClient from "./api";
import axios from "axios";

// Service cho các API liên quan đến người dùng
export const adminService = {
  //=================================================Thêm người dùng=================================================
  // TThêm người dùng mới
  addNewUserAccount: async (userData) => {
    try {
      const response = await apiClient.post("/admin/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error adding new user account:", error);
      throw error.response?.data || error;
    }
  },

  //=================================================Lấy thông tin=================================================

  //Hàm lấy toàn bộ người dùng
  getAllUsers: async () => {
    try {
      console.log("Making API call to: /admin/users");
      const response = await apiClient.get(`/admin/users`);

      // ✅ Log để debug structure
      console.log("Raw API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response structure:", {
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
        throw new Error(response.data?.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("AdminService.getAllUsers error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      // ✅ Handle different error types
      if (error.response?.status === 404) {
        throw new Error("API endpoint not found");
      }

      if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID và role với profile data cho consultant
  getUserById: async (userId, userRole) => {
    try {
      let response;

      if (userRole === "Consultant") {
        // For consultant, try to get profile data as well
        try {
          const profileResponse = await apiClient.get(
            `/admin/consultants/${userId}/profile`
          );
          response = profileResponse;
        } catch (profileError) {
          // If profile doesn't exist, fallback to regular user data
          console.log("No profile found for consultant, using basic user data");
          response = await apiClient.get(`/admin/users/${userRole}/${userId}`);
        }
      } else {
        // For other roles, get regular user data
        response = await apiClient.get(`/admin/users/${userRole}/${userId}`);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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

  //lấy thông tin tất cả consultant
  getConsultant: async () => {
    try {
      const response = await apiClient.get(`/admin/consultants`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tất cả consultant với thông tin profile
  getAllConsultantsWithProfiles: async () => {
    try {
      const response = await apiClient.get("/admin/consultants/profiles");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin theo role cụ thể
  getUsersByRole: async (role) => {
    try {
      const endpoints = {
        Admin: "/admin/admins",
        Staff: "/admin/staff",
        Customer: "/admin/customers",
        Consultant: "/admin/consultants",
      };

      const endpoint = endpoints[role];
      if (!endpoint) {
        throw new Error(`Invalid role: ${role}`);
      }

      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search users with filters
  searchUsers: async (searchParams) => {
    try {
      const response = await apiClient.get("/admin/users/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
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
      const response = await apiClient.put(
        `/admin/users/${role}/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật profile consultant
  updateConsultantProfile: async (consultantId, profileData) => {
    try {
      const response = await apiClient.put(
        `/admin/consultants/${consultantId}/profile`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật trạng thái người dùng
  updateUserStatus: async (userId, role, status) => {
    try {
      const response = await apiClient.patch(
        `/admin/users/${role}/${userId}/status`,
        {
          status: status,
        }
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
      const response = await apiClient.get("/admin/users/statistics");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

import apiClient from "@services/api";
import axios from "axios";

// Service cho các API liên quan đến người dùng
export const adminService = {
  // Thêm mới consultant
  createConsultant: async (consultantData) => {
    try {
      const response = await apiClient.post(
        "/admin/consultants",
        consultantData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thêm mới admin
  createAdmin: async (adminData) => {
    try {
      const response = await apiClient.post("/admin/admins", adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thêm mới staff
  createStaff: async (staffData) => {
    try {
      const response = await apiClient.post("/admin/staff", staffData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thêm mới customer
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post("/admin/customers", customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hàm tổng quát để tạo user theo role
  createUserByRole: async (userData) => {
    const { role, ...otherData } = userData;

    switch (role) {
      case "Admin":
        return await adminService.createAdmin({
          ...otherData,
          permissions: ["FULL_ACCESS"], // Quyền đặc biệt cho Admin
        });

      case "Staff":
        return await adminService.createStaff({
          ...otherData,
          department: "CUSTOMER_SERVICE", // Bộ phận mặc định
          workShift: "DAY_SHIFT",
        });

      case "Customer":
        return await adminService.createCustomer({
          ...otherData,
          membershipLevel: "BASIC", // Level thành viên mặc định
          loyaltyPoints: 0,
        });

      case "Consultant":
        return await adminService.createConsultant({
          ...otherData,
          status: "PENDING_APPROVAL", // Chờ duyệt
        });

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  },
};

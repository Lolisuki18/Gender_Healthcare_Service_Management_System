import notify from "@/utils/notification";
import apiClient from "@services/api";
import axios from "axios";

// Service cho các API liên quan đến người dùng
export const userService = {
  //đăng xuất
  logout: async () => {
    try {
      const response = await apiClient.post("/users/logout");

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Đăng nhập

  login: async (credentials) => {
    try {
      const response = await apiClient.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await apiClient.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Cập nhật thông tin người dùng
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put("/users/profile/basic", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin người dùng không cần token (cho staff profile)
  updateProfileNoAuth: async (userData) => {
    try {
      // Tạo một instance axios riêng không có interceptor
      const noAuthClient = axios.create({
        baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await noAuthClient.put("/users/profile/basic", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  sendCode: async (email) => {
    try {
      const response = await apiClient.post("/users/send-verification", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  sendCodeForgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/users/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await apiClient.post("/users/reset-password", {
        email,
        code,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
export const consultantService = {
  // Lấy danh sách bác sĩ
  getConsultants: async () => {
    try {
      const response = await apiClient.get("/consultants");
      return response.data;
    } catch (error) {
      console.error("Error fetching consultants:", error);
      throw error.response?.data || error;
    }
  },

  updateProfile: async (consultantDate) => {
    try {
      const response = await apiClient.put(
        "/consultants/profile",
        consultantDate
      );
      return response.data;
    } catch (error) {
      console.error("Error updating consultant profile:", error);
      throw error.response?.data || error;
    }
  },

  getConsultantProfile: async (consultantId) => {
    try {
      const response = await apiClient.get(`/consultants/${consultantId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching consultant profile:", error);
      throw error.response?.data || error;
    }
  },
};

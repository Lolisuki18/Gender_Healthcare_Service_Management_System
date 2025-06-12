import apiClient from "@services/api";
import axios from "axios";
import localStorageUtil from "@utils/localStorage"; // Giả sử đường dẫn đến file util là như này

// Service cho các API liên quan đến người dùng
export const userService = {
  //đăng xuất
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");

      // Xóa token và user data khỏi localStorage
      localStorageUtil.remove("token");
      localStorageUtil.remove("user");

      return response.data;
    } catch (error) {
      // Dù có lỗi, vẫn xóa token local
      localStorageUtil.remove("token");
      localStorageUtil.remove("user");

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
      console.log("Sending registration data:", userData); // ✅ Debug log

      const response = await apiClient.post("/users/register", userData);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      console.error("Error response:", error.response?.data); // ✅ Debug log
      throw error;
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

  /**
   * ✅ Send email verification code for email change
   * @param {string} newEmail - New email address
   * @returns {Promise<Object>} API response
   */
  sendEmailVerificationCode: async (newEmail) => {
    try {
      const response = await apiClient.post(
        "/users/profile/email/send-verification",
        {
          email: newEmail,
        }
      );
      console.log("Email verification code sent:", response.data);
      // Trả về kết quả thành công
      return {
        success: true,
        data: response.data,
        message: "Đã gửi mã xác nhận thành công",
      };
    } catch (error) {
      console.error("❌ Error sending email verification code:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể gửi mã xác nhận",
        error: error,
      };
    }
  },

  /**
   * ✅ Verify email change with verification code and update email
   * @param {Object} data - Verification data
   * @param {string} data.newEmail - New email address
   * @param {string} data.verificationCode - 6-digit verification code
   * @returns {Promise<Object>} API response
   */
  verifyEmailChange: async (data) => {
    try {
      const response = await apiClient.put("/users/profile/email", {
        newEmail: data.newEmail,
        verificationCode: data.verificationCode,
      });

      return {
        success: true,
        data: response.data,
        message: "Email đã được thay đổi thành công",
      };
    } catch (error) {
      console.error("❌ Error verifying email change:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Mã xác nhận không đúng",
        error: error,
      };
    }
  },

  /**
   * ✅ Change user password
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<Object>} API response
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put("/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Đổi mật khẩu thành công",
      };
    } catch (error) {
      console.error("❌ Error changing password:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu",
      };
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

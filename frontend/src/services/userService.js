import apiClient from "@services/api";
import axios from "axios";
import localStorageUtil from "@utils/localStorage";

// Service cho các API liên quan đến người dùng
export const userService = {
  //đăng xuất
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");

      localStorageUtil.remove("user");

      return response.data;
    } catch (error) {
      localStorageUtil.remove("user");

      throw error.response?.data || error;
    }
  }, // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      console.log("Raw API response:", response); // Debug log
      console.log("Response data:", response.data); // Debug log
      return response.data; // JwtResponse từ backend
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
   */ verifyEmailChange: async (data) => {
    try {
      console.log("🔄 Verifying email change:", {
        newEmail: data.newEmail,
        hasVerificationCode: !!data.verificationCode,
        codeLength: data.verificationCode?.length,
      });

      const response = await apiClient.put("/users/profile/email", {
        newEmail: data.newEmail,
        verificationCode: data.verificationCode,
      });
      // Lưu lại token mới nếu server cung cấp
      if (response.data.token) {
        localStorageUtil.set("token", response.data.token);
      }
      console.log("✅ Email change response:", response);

      return {
        success: true,
        data: response.data,
        message: "Email đã được thay đổi thành công",
      };
    } catch (error) {
      console.error("❌ Error verifying email change:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorData: error.response?.data,
        endpoint: "/users/profile/email",
        requestData: {
          newEmail: data.newEmail,
          hasVerificationCode: !!data.verificationCode,
        },
      });

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Mã xác nhận không đúng";

      if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Dữ liệu không hợp lệ";
      } else if (error.response?.status === 404) {
        errorMessage = "Không tìm thấy người dùng";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: error,
        statusCode: error.response?.status,
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
  // Refresh token
  refreshToken: async (refreshTokenValue) => {
    try {
      console.log("Attempting to refresh token...");

      // Tạo một instance axios riêng không có interceptor để tránh vòng lặp vô hạn
      const noInterceptorClient = axios.create({
        baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await noInterceptorClient.post("/auth/refresh-token", {
        refreshToken: refreshTokenValue,
      });

      console.log("Token refresh successful:", response.data);

      // Cập nhật token vào localStorage ngay tại đây để đảm bảo token mới được lưu
      if (
        response.data &&
        (response.data.accessToken ||
          (response.data.data && response.data.data.accessToken))
      ) {
        const userData = localStorageUtil.get("user");
        if (userData) {
          const tokenData = response.data.data || response.data;
          userData.accessToken = tokenData.accessToken;

          // Chỉ cập nhật refreshToken nếu có trong response
          if (tokenData.refreshToken) {
            userData.refreshToken = tokenData.refreshToken;
          }

          localStorageUtil.set("user", userData);
          console.log("✅ User data updated with new tokens in localStorage");
        }
      }

      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * ✅ Upload avatar image
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} API response with uploaded image URL
   */
  uploadAvatar: async (file) => {
    try {
      // Đảm bảo token hợp lệ trước khi upload
      const isTokenValid = await userService.ensureValidToken();
      if (!isTokenValid) {
        return {
          success: false,
          message:
            "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }

      // Lấy token mới nhất từ localStorage
      const userData = localStorageUtil.get("user");
      if (!userData || !userData.accessToken) {
        return {
          success: false,
          message: "Không tìm thấy token xác thực. Vui lòng đăng nhập lại.",
        };
      }

      // Create form data object for file upload
      const formData = new FormData();
      formData.append("file", file); // Sử dụng key "file" theo yêu cầu của backend

      console.log("Sending avatar upload request with form data...", {
        fileSize: file.size,
        fileType: file.type,
        fileName: file.name,
        hasToken: !!userData.accessToken,
        tokenFirstChars: userData.accessToken.substring(0, 15) + "...", // Hiện token một phần để debug
      });

      const response = await apiClient.post("/users/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userData.accessToken}`, // Đảm bảo token được gửi đi
        },
      });

      console.log("Avatar upload response:", response.data);

      return {
        success: true,
        data: response.data,
        message: "Cập nhật avatar thành công",
      };
    } catch (error) {
      console.error("❌ Error uploading avatar:", error);

      // Kiểm tra lỗi token hết hạn
      if (error.response?.status === 401) {
        console.log("Token hết hạn, thử refresh token...");
        try {
          // Thử làm mới token và gửi lại yêu cầu
          const userData = localStorageUtil.get("user");
          if (userData?.refreshToken) {
            const refreshResponse = await userService.refreshToken(
              userData.refreshToken
            );
            if (refreshResponse.accessToken) {
              // Update token và thử lại
              localStorageUtil.set("user", {
                ...userData,
                accessToken: refreshResponse.accessToken,
                refreshToken:
                  refreshResponse.refreshToken || userData.refreshToken,
              });

              // Đệ quy gọi lại hàm upload sau khi refresh token
              return userService.uploadAvatar(file);
            }
          }
        } catch (refreshError) {
          console.error("Không thể làm mới token:", refreshError);
          return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            error: refreshError,
          };
        }
      }

      return {
        success: false,
        message: error.response?.data?.message || "Không thể cập nhật avatar",
        error: error,
      };
    }
  },

  /**
   * ✅ Kiểm tra và làm mới token nếu cần
   * @returns {Promise<boolean>} Trả về true nếu token hợp lệ hoặc đã được làm mới thành công
   */
  ensureValidToken: async () => {
    try {
      const userData = localStorageUtil.get("user");
      if (!userData || !userData.accessToken) {
        console.error("Không tìm thấy token xác thực");
        return false;
      }

      // Phân tích JWT token để kiểm tra hết hạn
      const tokenParts = userData.accessToken.split(".");
      if (tokenParts.length !== 3) {
        console.error("Token không hợp lệ");
        return false;
      }

      try {
        // Giải mã phần payload của token
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiryTime = payload.exp * 1000; // Chuyển sang milliseconds
        const currentTime = Date.now();

        // Kiểm tra nếu token sắp hết hạn (còn dưới 5 phút)
        if (expiryTime - currentTime < 5 * 60 * 1000) {
          console.log("Token sắp hết hạn, tiến hành làm mới...");

          // Gọi hàm refreshToken
          const refreshResult = await userService.refreshToken(
            userData.refreshToken
          );
          return (
            !!refreshResult &&
            (refreshResult.success ||
              refreshResult.accessToken ||
              (refreshResult.data &&
                (refreshResult.data.accessToken || refreshResult.data.success)))
          );
        }

        // Token vẫn còn hiệu lực
        return true;
      } catch (error) {
        console.error("Lỗi khi phân tích token:", error);
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra token:", error);
      return false;
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

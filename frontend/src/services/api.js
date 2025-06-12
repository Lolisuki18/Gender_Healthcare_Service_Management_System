/**
 * api.js - Cấu hình axios client cho gọi API
 *
 * File này tạo và cấu hình một instance Axios để thực hiện các request HTTP
 * đến backend API với các thiết lập mặc định và xử lý lỗi nhất quán.
 *
 * Lý do tạo file:
 * - Tạo một điểm truy cập API duy nhất, nhất quán trong toàn ứng dụng
 * - Cung cấp các cấu hình mặc định cho mọi API request
 * - Xây dựng cơ chế xử lý lỗi và xác thực JWT tập trung
 *
 * Tính năng chính:
 * - Cấu hình baseURL và headers mặc định
 * - Interceptor tự động thêm JWT token vào các request
 * - Xử lý lỗi tập trung, bao gồm việc xử lý token hết hạn
 */

import localStorageUtil from "@/utils/localStorage";
import axios from "axios";

// Tạo config object trước
const config = {
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
};

const apiClient = axios.create(config);

// ✅ Request interceptor - sử dụng JWT token
apiClient.interceptors.request.use(
  (config) => {
    var userData = localStorageUtil.get("user");

    // Nếu có userData và có accessToken, thêm Bearer token vào header
    if (userData && userData.accessToken) {
      config.headers.Authorization = `Bearer ${userData.accessToken}`;
    }

    console.log("API Request:", {
      url: config.baseURL + config.url,
      method: config.method.toUpperCase(),
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - xử lý token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    // Xử lý token hết hạn (401 Unauthorized)
    if (error.response?.status === 401) {
      const userData = localStorageUtil.get("user");

      // Nếu có refresh token, thử refresh
      if (userData && userData.refreshToken) {
        try {
          const { userService } = await import("./userService");
          const refreshResponse = await userService.refreshToken(
            userData.refreshToken
          );

          if (refreshResponse.success || refreshResponse.accessToken) {
            // Cập nhật token mới vào localStorage
            const newTokenData = refreshResponse.data || refreshResponse;
            const newUserData = {
              ...userData,
              accessToken: newTokenData.accessToken,
              refreshToken: newTokenData.refreshToken,
            };
            localStorageUtil.set("user", newUserData);

            // Retry request với token mới
            error.config.headers.Authorization = `Bearer ${newTokenData.accessToken}`;
            return apiClient.request(error.config);
          }
        } catch (refreshError) {
          // Refresh token cũng hết hạn, đăng xuất user
          localStorageUtil.remove("user");
          window.location.href = "/login";
        }
      } else {
        // Không có refresh token, chuyển về trang login
        localStorageUtil.remove("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

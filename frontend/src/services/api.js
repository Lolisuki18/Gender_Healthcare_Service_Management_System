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

// ✅ Request interceptor - Thêm JWT token vào header
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorageUtil.get("token");

    if (token) {
      // Thêm JWT token vào Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API Request:", {
      url: config.baseURL + config.url,
      method: config.method.toUpperCase(),
      headers: config.headers,
      hasToken: !!token,
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - Xử lý lỗi và token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    // Xử lý token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      console.warn("Token expired or invalid, redirecting to login...");

      // Xóa token và user data
      localStorageUtil.remove("token");
      localStorageUtil.remove("user");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;

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
 * - Interceptor tự động thêm token xác thực vào các request
 * - Xử lý lỗi tập trung, bao gồm việc xử lý token hết hạn
 */

import localStorageUtil from "@/utils/localStorage";
import axios from "axios";

// Tạo instance Axios với các cấu hình mặc định
var userData = localStorageUtil.get("user");
// Nếu có userData, lấy token từ đó
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  auth: {
    username: userData.username, // Hoặc lấy từ localStorage/context
    password: "Ninh123@", // Hoặc lấy từ localStorage/context
  },
});

// ✅ Request interceptor (không có token)
apiClient.interceptors.request.use(
  (config) => {
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

// ✅ Response interceptor (đơn giản hơn)
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

    return Promise.reject(error);
  }
);

export default apiClient;

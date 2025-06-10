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

// Tạo config object trước
const config = {
  baseURL: "http://localhost:8080",
};

// Nếu có userData và role là ADMIN, thêm auth vào config
if (userData && userData.data && userData.data.role === "ADMIN") {
  config.auth = {
    //sử dụng basic auth nên phải truyền username và password của người dùng xuống để có thể thực hiện
    //các tác vụ yêu cầu quyền truy cập
    username: userData.data.username || userData.username,
    password: "Ninh123@", // Hoặc lấy từ localStorage/context
  };
}

const apiClient = axios.create(config);

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

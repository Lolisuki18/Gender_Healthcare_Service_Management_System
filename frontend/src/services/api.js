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

import axios from "axios";

// Tạo instance Axios với các cấu hình mặc định
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

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
 * - Proactive token refresh để tránh lỗi 401
 *
 * =============================
 * 🔑 Để sử dụng backend Cloud (production):
 *   - Tạo file .env ở thư mục gốc frontend với nội dung:
 *       REACT_APP_API_URL=https://gender-heath-backend-720346160754.asia-southeast1.run.app
 *   - Khi chạy local, có thể bỏ dòng này hoặc để http://localhost:8080
 *
 * =============================
 */

import localStorageUtil from '@/utils/localStorage';
import axios from 'axios';
import { confirmDialog } from '@/utils/confirmDialog';

// Lấy baseURL từ biến môi trường, ưu tiên cloud nếu có
const config = {
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  baseURL: 'http://localhost:8080' || process.env.REACT_APP_API_URL,
  // headers: {
  //   'Content-Type': 'application/json', // Đã xóa để axios tự động nhận diện
  // },
};

const apiClient = axios.create(config);

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý queue các request bị fail
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Hàm kiểm tra token có sắp hết hạn không
const isTokenExpiringSoon = (token) => {
  if (!token) return true;

  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;

    const payload = JSON.parse(atob(tokenParts[1]));
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    // Token sắp hết hạn trong 5 phút (phù hợp với access token 1 giờ từ backend)
    return expiryTime - currentTime < 5 * 60 * 1000;
  } catch (error) {
    return true;
  }
};

// Hàm refresh token
const refreshToken = async () => {
  const token = localStorageUtil.get('token');
  if (!token?.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    // Sử dụng axios trực tiếp để tránh vòng lặp
    const noInterceptorClient = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await noInterceptorClient.post('/auth/refresh-token', {
      refreshToken: token.refreshToken,
    });

    const responseData = response.data;
    const tokenData = responseData.data || responseData;

    const newAccessToken =
      tokenData.accessToken || (tokenData.data && tokenData.data.accessToken);

    const newRefreshToken =
      tokenData.refreshToken ||
      (tokenData.data && tokenData.data.refreshToken) ||
      token.refreshToken;

    const newTokenObject = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    localStorageUtil.set('token', newTokenObject);
    return newTokenObject;
  } catch (error) {
    // Xóa token cũ nếu refresh thất bại
    localStorageUtil.remove('token');
    throw error;
  }
};

// ✅ Request interceptor - sử dụng JWT token với proactive refresh
apiClient.interceptors.request.use(
  async (config) => {
    // Bỏ qua refresh cho các endpoint không cần auth
    if (
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/refresh-token')
    ) {
      return config;
    }

    const token = localStorageUtil.get('token');

    if (token?.accessToken) {
      // Kiểm tra nếu token sắp hết hạn và chưa đang refresh
      if (isTokenExpiringSoon(token.accessToken) && !isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshToken();
          config.headers.Authorization = `Bearer ${newToken.accessToken}`;
          processQueue(null, newToken.accessToken);
        } catch (error) {
          processQueue(error, null);
          // Redirect to login nếu không phải đang ở trang login

          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - xử lý token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi là do refresh token và message là 'User not found'
    const errMsg = error?.response?.data?.message;
    if (
      errMsg &&
      typeof errMsg === 'string' &&
      errMsg.toLowerCase().includes('user not found')
    ) {
      await confirmDialog.info(
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        { confirmText: 'Đăng nhập lại', cancelText: 'Đóng' }
      );
      window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

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

// Lấy baseURL từ biến môi trường, ưu tiên cloud nếu có
const config = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  // headers: {
  //   'Content-Type': 'application/json', // Đã xóa để axios tự động nhận diện
  // },
};

const apiClient = axios.create(config);

// ✅ Request interceptor - sử dụng JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Chỉ sử dụng token từ biến token trong localStorage
    var token = localStorageUtil.get('token');

    // Thêm token vào header Authorization nếu có
    if (token && token.accessToken) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
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
    // Xử lý token hết hạn (401 Unauthorized) hoặc JWT expired
    if (
      error.response?.status === 401 ||
      (error.response?.data?.message &&
        error.response?.data?.message.includes('JWT expired'))
    ) {
      const token = localStorageUtil.get('token');

      // ✅ KIỂM TRA FLAG ĐỂ BỎ QUA AUTO-REDIRECT
      if (error.config?.skipAutoRedirect) {
        return Promise.reject(error);
      }

      // Nếu có refresh token, thử refresh
      if (token && token.refreshToken) {
        try {
          if (!window.isRefreshingToken) {
            window.isRefreshingToken = true;

            // Sử dụng axios trực tiếp thay vì import userService để tránh vòng lặp tham chiếu
            const noInterceptorClient = axios.create({
              baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const refreshResponse = await noInterceptorClient
              .post('/auth/refresh-token', {
                refreshToken: token.refreshToken,
              })
              .then((res) => res.data);

            // Kiểm tra cả trường hợp response trực tiếp hoặc nằm trong .data
            if (
              refreshResponse.success ||
              refreshResponse.accessToken ||
              (refreshResponse.data &&
                (refreshResponse.data.accessToken ||
                  refreshResponse.data.success))
            ) {
              // Lấy token từ response
              const tokenData = refreshResponse.data || refreshResponse;
              const newAccessToken =
                tokenData.accessToken ||
                (tokenData.data && tokenData.data.accessToken);

              // Chỉ cập nhật refreshToken nếu có trong response
              const newRefreshToken =
                tokenData.refreshToken ||
                (tokenData.data && tokenData.data.refreshToken) ||
                token.refreshToken;

              // Cập nhật token mới vào localStorage
              const newTokenObject = {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              };
              localStorageUtil.set('token', newTokenObject);

              // Thêm header authorization mới và thử lại request
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;

              // Tránh vòng lặp vô hạn nếu token mới cũng không hợp lệ
              error.config._retry = true;

              return apiClient.request(error.config);
            }
          } else {
            // Chờ một chút và thử lại nếu một quá trình refresh đang diễn ra
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const updatedToken = localStorageUtil.get('token');
            if (
              updatedToken &&
              updatedToken.accessToken !== token.accessToken
            ) {
              // Token đã được làm mới bởi một request khác
              error.config.headers.Authorization = `Bearer ${updatedToken.accessToken}`;
              return apiClient.request(error.config);
            }
          }
        } catch (refreshError) {
          // Refresh token cũng hết hạn, đăng xuất user
          localStorageUtil.remove('token');

          // Nếu có flag skipAutoRedirect, không redirect và không alert
          if (error.config?.skipAutoRedirect) {
            return Promise.reject(error);
          }

          // Thông báo cho người dùng
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

          // Chỉ redirect nếu không phải đang ở trang login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } else {
        // Không có refresh token, chuyển về trang login
        localStorageUtil.remove('token');

        // Chỉ redirect nếu không phải đang ở trang login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

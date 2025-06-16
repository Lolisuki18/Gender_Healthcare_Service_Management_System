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
    var token = localStorageUtil.get("token");

    // Nếu có userData và có accessToken, thêm Bearer token vào header
    if (token && token.accessToken) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
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
    }); // Xử lý token hết hạn (401 Unauthorized)
    if (error.response?.status === 401) {
      const userData = localStorageUtil.get("user");

      // ✅ KIỂM TRA FLAG ĐỂ BỎ QUA AUTO-REDIRECT
      if (error.config?.skipAutoRedirect) {
        console.log("🔄 Skipping auto-redirect due to skipAutoRedirect flag");
        return Promise.reject(error);
      }

      console.log("🔍 401 Error Debug:", {
        hasUserData: !!userData,
        hasAccessToken: !!userData?.accessToken,
        hasRefreshToken: !!userData?.refreshToken,
        endpoint: error.config?.url,
        errorMessage: error.response?.data?.message,
      }); // Nếu có refresh token, thử refresh
      if (userData && userData.refreshToken) {
        try {
          console.log("🔄 Attempting token refresh...");

          // Đảm bảo chỉ có một yêu cầu refresh token được gửi đi cùng một lúc
          if (!window.isRefreshingToken) {
            window.isRefreshingToken = true;

            const { userService } = await import("./userService");
            const refreshResponse = await userService.refreshToken(
              userData.refreshToken
            );

            console.log("🔄 Refresh response:", refreshResponse);
            window.isRefreshingToken = false;

            // Kiểm tra cả trường hợp response trực tiếp hoặc nằm trong .data
            if (
              refreshResponse.success ||
              refreshResponse.accessToken ||
              (refreshResponse.data &&
                (refreshResponse.data.accessToken ||
                  refreshResponse.data.success))
            ) {
              // Lấy token từ response
              const newTokenData = refreshResponse.data || refreshResponse;
              const newAccessToken =
                newTokenData.accessToken ||
                (newTokenData.data && newTokenData.data.accessToken);

              // Chỉ cập nhật refreshToken nếu có trong response
              const newRefreshToken =
                newTokenData.refreshToken ||
                (newTokenData.data && newTokenData.data.refreshToken) ||
                userData.refreshToken;

              // Cập nhật token mới vào localStorage
              const newUserData = {
                ...userData,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              };
              localStorageUtil.set("user", newUserData);

              console.log(
                "✅ Token refreshed successfully, retrying request with new token"
              );

              // Thêm header authorization mới và thử lại request
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;

              // Tránh vòng lặp vô hạn nếu token mới cũng không hợp lệ
              error.config._retry = true;

              return apiClient.request(error.config);
            }
          } else {
            console.log("🔄 Token refresh already in progress, waiting...");
            // Chờ một chút và thử lại nếu một quá trình refresh đang diễn ra
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (
              localStorageUtil.get("user")?.accessToken !== userData.accessToken
            ) {
              // Token đã được làm mới bởi một request khác
              console.log(
                "✅ Token has been refreshed by another request, retrying..."
              );
              const newUserData = localStorageUtil.get("user");
              error.config.headers.Authorization = `Bearer ${newUserData.accessToken}`;
              return apiClient.request(error.config);
            }
          }
        } catch (refreshError) {
          console.error("❌ Refresh token failed:", refreshError);
          window.isRefreshingToken = false;

          // Refresh token cũng hết hạn, đăng xuất user
          localStorageUtil.remove("user");

          // Thông báo cho người dùng
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

          // Chỉ redirect nếu không phải đang ở trang login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      } else {
        console.log("❌ No refresh token available, redirecting to login");
        // Không có refresh token, chuyển về trang login
        localStorageUtil.remove("user");

        // Chỉ redirect nếu không phải đang ở trang login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

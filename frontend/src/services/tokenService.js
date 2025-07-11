/**
 * tokenService.js - Quản lý JWT token thông minh
 *
 * Service này cung cấp các chức năng:
 * - Kiểm tra token sắp hết hạn
 * - Proactive refresh token
 * - Quản lý token lifecycle
 * - Tự động refresh trước khi hết hạn
 */

import localStorageUtil from '@/utils/localStorage';

class TokenService {
  constructor() {
    this.refreshTimeout = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Kiểm tra token có hợp lệ không
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isTokenValid(token) {
    if (!token) return false;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000; // Convert to seconds

      // Kiểm tra thời gian hết hạn
      if (payload.exp <= currentTime) return false;

      // Kiểm tra issuer (tùy chọn - backend có thể chưa có)
      if (payload.iss && payload.iss !== 'HealApp') return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Kiểm tra token có phải là access token không
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isAccessToken(token) {
    if (!token) return false;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      // Backend hiện tại chưa có type claim, nên chỉ kiểm tra cấu trúc cơ bản
      return payload.exp && payload.iat && payload.sub;
    } catch (error) {
      return false;
    }
  }

  /**
   * Kiểm tra token có phải là refresh token không
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isRefreshToken(token) {
    if (!token) return false;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      // Backend hiện tại chưa có type claim, nên chỉ kiểm tra cấu trúc cơ bản
      return payload.exp && payload.iat && payload.sub;
    } catch (error) {
      return false;
    }
  }

  /**
   * Kiểm tra token có sắp hết hạn không (trong 5 phút)
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isTokenExpiringSoon(token) {
    if (!token) return true;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return true;

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Token sắp hết hạn trong 5 phút (phù hợp với access token 1 giờ)
      return expiryTime - currentTime < 5 * 60 * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Lấy thời gian còn lại của token (tính bằng giây)
   * @param {string} token - JWT token
   * @returns {number} Thời gian còn lại tính bằng giây
   */
  getTokenTimeLeft(token) {
    if (!token) return 0;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return 0;

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000; // Convert to seconds

      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Lấy thông tin token từ localStorage
   * @returns {Object|null} Token object hoặc null
   */
  getToken() {
    return localStorageUtil.get('token');
  }

  /**
   * Lưu token vào localStorage
   * @param {Object} tokenData - Token data object
   */
  setToken(tokenData) {
    localStorageUtil.set('token', tokenData);
    this.scheduleTokenRefresh(tokenData.accessToken);
  }

  /**
   * Xóa token khỏi localStorage
   */
  clearToken() {
    localStorageUtil.remove('token');
    this.clearRefreshTimeout();
  }

  /**
   * Lên lịch refresh token trước khi hết hạn
   * @param {string} accessToken - Access token
   */
  scheduleTokenRefresh(accessToken) {
    this.clearRefreshTimeout();

    if (!accessToken) return;

    const timeLeft = this.getTokenTimeLeft(accessToken);

    // Nếu token còn ít hơn 5 phút, refresh ngay
    if (timeLeft < 5 * 60) {
      this.refreshTokenIfNeeded();
      return;
    }

    // Lên lịch refresh 5 phút trước khi hết hạn (phù hợp với access token 1 giờ)
    const refreshTime = (timeLeft - 5 * 60) * 1000; // Convert to milliseconds

    this.refreshTimeout = setTimeout(() => {
      this.refreshTokenIfNeeded();
    }, refreshTime);
  }

  /**
   * Xóa timeout refresh
   */
  clearRefreshTimeout() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  /**
   * Refresh token nếu cần thiết
   * @returns {Promise<Object>} Token mới hoặc null
   */
  async refreshTokenIfNeeded() {
    const token = this.getToken();

    if (!token?.refreshToken) {
      return null;
    }

    // Nếu đang refresh, trả về promise hiện tại
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    // Kiểm tra nếu token sắp hết hạn
    if (this.isTokenExpiringSoon(token.accessToken)) {
      this.isRefreshing = true;

      try {
        // Validate refresh token trước khi sử dụng (chỉ kiểm tra cấu trúc cơ bản)
        if (!this.isRefreshToken(token.refreshToken)) {
          throw new Error('Invalid refresh token structure');
        }

        // Sử dụng axios trực tiếp để tránh vòng lặp
        const axios = (await import('axios')).default;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/auth/refresh-token`,
          {
            refreshToken: token.refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const responseData = response.data;
        const tokenData = responseData.data || responseData;

        const newAccessToken =
          tokenData.accessToken ||
          (tokenData.data && tokenData.data.accessToken);

        const newRefreshToken =
          tokenData.refreshToken ||
          (tokenData.data && tokenData.data.refreshToken) ||
          token.refreshToken;

        // Validate token mới (chỉ kiểm tra cấu trúc cơ bản)
        if (!this.isAccessToken(newAccessToken)) {
          throw new Error('Invalid access token structure received');
        }

        const newTokenObject = {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };

        this.setToken(newTokenObject);
        return newTokenObject;
      } catch (error) {
        // Nếu refresh thất bại, xóa token
        this.clearToken();
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    }

    return token;
  }

  /**
   * Khởi tạo service và lên lịch refresh token
   */
  init() {
    const token = this.getToken();
    if (token?.accessToken) {
      this.scheduleTokenRefresh(token.accessToken);
    }
  }

  /**
   * Dọn dẹp service
   */
  cleanup() {
    this.clearRefreshTimeout();
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;

/**
 * tokenService.js - Quản lý JWT token thông minh
 *
 * Service này cung cấp các chức năng:
 * - Kiểm tra token sắp hết hạn
 * - Proactive refresh token
 * - Quản lý token lifecycle
 * - Tự động refresh trước khi hết hạn
 * - Xử lý khi window focus/visibility change (khi máy treo)
 */

import localStorageUtil from '@/utils/localStorage';
import { confirmDialog } from '@/utils/confirmDialog';

class TokenService {
  constructor() {
    this.refreshTimeout = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.lastActivityTime = Date.now();
    this.focusHandler = null;
    this.visibilityHandler = null;
    this.activityHandler = null;
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

      // // Kiểm tra issuer (tùy chọn - backend có thể chưa có)
      // if (payload.iss && payload.iss !== 'HealApp') return false;

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

      // Kiểm tra cấu trúc cơ bản và roles claim (access token thường có roles)
      return payload.exp && payload.iat && payload.sub && payload.roles;
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

      // Kiểm tra cấu trúc cơ bản và không có roles claim (refresh token không có roles)
      return payload.exp && payload.iat && payload.sub && !payload.roles;
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

      // Token sắp hết hạn trong 5 phút (phù hợp với access token 1 giờ từ backend)
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

    // Lên lịch refresh 5 phút trước khi hết hạn (phù hợp với access token 1 giờ từ backend)
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
      const startTime = Date.now();

      try {
        // Validate refresh token trước khi sử dụng
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
            timeout: 10000, // 10 second timeout
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

        // Validate token mới
        if (!this.isAccessToken(newAccessToken)) {
          throw new Error('Invalid access token structure received');
        }

        const newTokenObject = {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };

        this.setToken(newTokenObject);

        // Analytics: Track successful refresh
        const duration = Date.now() - startTime;
        console.log(`Token refresh successful in ${duration}ms`);

        return newTokenObject;
      } catch (error) {
        // Analytics: Track failed refresh
        const duration = Date.now() - startTime;
        console.error(
          `Token refresh failed after ${duration}ms:`,
          error.message
        );

        // Nếu là lỗi timeout hoặc lỗi 401 (Unauthorized)
        if (
          error.code === 'ECONNABORTED' || // timeout
          (error.response && error.response.status === 401)
        ) {
          await confirmDialog.info(
            'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'
          );
          this.clearToken();
          window.location.href = '/login';
          throw error;
        }

        // Nếu lỗi khác, vẫn clear token như cũ
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
   * Xử lý khi window focus (người dùng quay lại tab)
   */
  handleWindowFocus = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - this.lastActivityTime;

    // Nếu đã hơn 5 phút kể từ lần hoạt động cuối, kiểm tra và refresh token
    if (timeSinceLastActivity > 5 * 60 * 1000) {
      console.log('Window focused after inactivity, checking token...');
      this.refreshTokenIfNeeded().catch((error) => {
        console.error('Failed to refresh token on window focus:', error);
      });
    }

    this.lastActivityTime = currentTime;
  };

  /**
   * Xử lý khi visibility change (tab ẩn/hiện)
   */
  handleVisibilityChange = () => {
    if (!document.hidden) {
      // Tab trở nên visible
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - this.lastActivityTime;

      // Nếu đã hơn 10 phút kể từ lần hoạt động cuối, kiểm tra và refresh token
      if (timeSinceLastActivity > 10 * 60 * 1000) {
        console.log('Tab became visible after inactivity, checking token...');
        this.refreshTokenIfNeeded().catch((error) => {
          console.error('Failed to refresh token on visibility change:', error);
        });
      }

      this.lastActivityTime = currentTime;
    }
  };

  /**
   * Xử lý user activity (click, scroll, keypress)
   */
  handleUserActivity = () => {
    this.lastActivityTime = Date.now();
  };

  /**
   * Thiết lập các event listeners để theo dõi hoạt động
   */
  setupActivityListeners() {
    // Xóa listeners cũ nếu có
    this.removeActivityListeners();

    // Window focus event
    this.focusHandler = this.handleWindowFocus.bind(this);
    window.addEventListener('focus', this.focusHandler);

    // Visibility change event
    this.visibilityHandler = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.visibilityHandler);

    // User activity events
    this.activityHandler = this.handleUserActivity.bind(this);
    window.addEventListener('click', this.activityHandler);
    window.addEventListener('scroll', this.activityHandler);
    window.addEventListener('keypress', this.activityHandler);
    window.addEventListener('mousemove', this.activityHandler);
  }

  /**
   * Xóa các event listeners
   */
  removeActivityListeners() {
    if (this.focusHandler) {
      window.removeEventListener('focus', this.focusHandler);
      this.focusHandler = null;
    }

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    if (this.activityHandler) {
      window.removeEventListener('click', this.activityHandler);
      window.removeEventListener('scroll', this.activityHandler);
      window.removeEventListener('keypress', this.activityHandler);
      window.removeEventListener('mousemove', this.activityHandler);
      this.activityHandler = null;
    }
  }

  /**
   * Khởi tạo service và lên lịch refresh token
   */
  init() {
    const token = this.getToken();
    if (token?.accessToken) {
      this.scheduleTokenRefresh(token.accessToken);
    }

    // Thiết lập activity listeners
    this.setupActivityListeners();
  }

  /**
   * Dọn dẹp service
   */
  cleanup() {
    this.clearRefreshTimeout();
    this.removeActivityListeners();
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;

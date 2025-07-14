/**
 * tokenUtils.js - Utility functions cho việc xử lý token
 *
 * Cung cấp các hàm tiện ích để:
 * - Kiểm tra và xử lý token hết hạn
 * - Xử lý các trường hợp máy treo
 * - Quản lý session timeout
 * - Đồng bộ token giữa các tab
 */

import localStorageUtil from './localStorage';
import tokenService from '@/services/tokenService';
import { notify } from './notify';

/**
 * Kiểm tra xem token có bị hết hạn hoàn toàn không
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenCompletelyExpired = (token) => {
  if (!token) return true;

  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;

    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Date.now() / 1000; // Convert to seconds

    return payload.exp <= currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Kiểm tra xem refresh token có còn hợp lệ không
 * @param {string} refreshToken - Refresh token
 * @returns {boolean}
 */
export const isRefreshTokenValid = (refreshToken) => {
  if (!refreshToken) return false;

  try {
    const tokenParts = refreshToken.split('.');
    if (tokenParts.length !== 3) return false;

    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Refresh token thường có thời hạn dài hơn access token
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * Xử lý khi phát hiện máy treo hoặc không hoạt động
 * @param {number} inactiveTime - Thời gian không hoạt động (ms)
 */
export const handleInactivity = async (inactiveTime) => {
  const token = localStorageUtil.get('token');

  if (!token?.accessToken) {
    return;
  }

  // Nếu không hoạt động hơn 30 phút, thông báo cho user
  if (inactiveTime > 30 * 60 * 1000) {
    notify.warning(
      'Phiên làm việc',
      'Bạn đã không hoạt động trong một thời gian dài. Hệ thống sẽ tự động làm mới phiên đăng nhập.'
    );
  }

  // Nếu không hoạt động hơn 1 giờ, thử refresh token
  if (inactiveTime > 60 * 60 * 1000) {
    try {
      await tokenService.refreshTokenIfNeeded();
      notify.success(
        'Phiên đăng nhập đã được làm mới',
        'Hệ thống đã tự động làm mới phiên đăng nhập của bạn'
      );
    } catch (error) {
      console.error('Failed to refresh token after inactivity:', error);
      notify.error(
        'Phiên đăng nhập đã hết hạn',
        'Vui lòng đăng nhập lại để tiếp tục sử dụng'
      );
    }
  }
};

/**
 * Xử lý khi kết nối được khôi phục sau khi mất kết nối
 */
export const handleConnectionRestore = async () => {
  const token = localStorageUtil.get('token');

  if (!token?.accessToken) {
    return;
  }

  try {
    // Kiểm tra xem token có còn hợp lệ không
    if (isTokenCompletelyExpired(token.accessToken)) {
      // Token đã hết hạn hoàn toàn, thử refresh
      if (isRefreshTokenValid(token.refreshToken)) {
        await tokenService.refreshTokenIfNeeded();
        notify.success(
          'Kết nối đã được khôi phục',
          'Phiên đăng nhập đã được làm mới tự động'
        );
      } else {
        // Refresh token cũng hết hạn
        notify.error(
          'Phiên đăng nhập đã hết hạn',
          'Vui lòng đăng nhập lại để tiếp tục sử dụng'
        );
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } else {
      // Token vẫn còn hợp lệ
      notify.success(
        'Kết nối đã được khôi phục',
        'Bạn có thể tiếp tục sử dụng ứng dụng'
      );
    }
  } catch (error) {
    console.error('Failed to handle connection restore:', error);
    notify.error(
      'Lỗi khôi phục phiên đăng nhập',
      'Vui lòng đăng nhập lại để tiếp tục sử dụng'
    );
  }
};

/**
 * Kiểm tra và xử lý token khi window focus
 */
export const handleWindowFocus = async () => {
  const token = localStorageUtil.get('token');

  if (!token?.accessToken) {
    return;
  }

  // Kiểm tra xem token có sắp hết hạn không
  if (tokenService.isTokenExpiringSoon(token.accessToken)) {
    try {
      await tokenService.refreshTokenIfNeeded();
      console.log('Token refreshed on window focus');
    } catch (error) {
      console.error('Failed to refresh token on window focus:', error);
    }
  }
};

/**
 * Xử lý khi tab trở nên visible
 */
export const handleTabVisible = async () => {
  const token = localStorageUtil.get('token');

  if (!token?.accessToken) {
    return;
  }

  // Kiểm tra xem token có sắp hết hạn không
  if (tokenService.isTokenExpiringSoon(token.accessToken)) {
    try {
      await tokenService.refreshTokenIfNeeded();
      console.log('Token refreshed on tab visible');
    } catch (error) {
      console.error('Failed to refresh token on tab visible:', error);
    }
  }
};

/**
 * Lưu thời gian hoạt động cuối cùng
 */
export const updateLastActivity = () => {
  localStorage.setItem('lastActivity', Date.now().toString());
};

/**
 * Lấy thời gian hoạt động cuối cùng
 * @returns {number} Timestamp của lần hoạt động cuối
 */
export const getLastActivity = () => {
  const lastActivity = localStorage.getItem('lastActivity');
  return lastActivity ? parseInt(lastActivity) : Date.now();
};

/**
 * Kiểm tra xem có cần refresh token không dựa trên thời gian hoạt động
 * @returns {boolean}
 */
export const shouldRefreshToken = () => {
  const lastActivity = getLastActivity();
  const currentTime = Date.now();
  const timeSinceLastActivity = currentTime - lastActivity;

  // Nếu đã hơn 15 phút kể từ lần hoạt động cuối, nên refresh token
  return timeSinceLastActivity > 15 * 60 * 1000;
};

/**
 * Xử lý session timeout
 */
export const handleSessionTimeout = () => {
  const token = localStorageUtil.get('token');

  if (!token?.accessToken) {
    return;
  }

  // Kiểm tra xem có cần refresh token không
  if (shouldRefreshToken()) {
    tokenService.refreshTokenIfNeeded().catch((error) => {
      console.error('Failed to refresh token on session timeout check:', error);
    });
  }
};

/**
 * Thiết lập session timeout checker
 */
export const setupSessionTimeoutChecker = () => {
  // Kiểm tra mỗi 5 phút
  const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

  const intervalId = setInterval(() => {
    handleSessionTimeout();
  }, SESSION_CHECK_INTERVAL);

  return () => {
    clearInterval(intervalId);
  };
};

/**
 * Kiểm tra sức khỏe tổng thể của token system
 * @returns {Object} Health status object
 */
export const checkTokenHealth = () => {
  const token = localStorageUtil.get('token');

  if (!token) {
    return {
      status: 'no_token',
      message: 'Không có token nào được lưu trữ',
      isValid: false,
      timeLeft: 0,
      needsRefresh: false,
    };
  }

  const { accessToken, refreshToken } = token;

  // Kiểm tra access token
  const isAccessValid = !isTokenCompletelyExpired(accessToken);
  let accessTimeLeft = 0;
  if (isAccessValid) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      accessTimeLeft = payload.exp * 1000 - Date.now();
    } catch (error) {
      accessTimeLeft = 0;
    }
  }

  // Kiểm tra refresh token
  const isRefreshValid = isRefreshTokenValid(refreshToken);

  // Kiểm tra có cần refresh không (5 phút trước khi hết hạn)
  const needsRefresh = isAccessValid && accessTimeLeft < 5 * 60 * 1000;

  let status = 'healthy';
  let message = 'Token hoạt động bình thường';

  if (!isAccessValid) {
    status = 'access_expired';
    message = 'Access token đã hết hạn';
  } else if (!isRefreshValid) {
    status = 'refresh_expired';
    message = 'Refresh token đã hết hạn';
  } else if (needsRefresh) {
    status = 'needs_refresh';
    message = 'Token cần được refresh sớm';
  }

  return {
    status,
    message,
    isValid: isAccessValid && isRefreshValid,
    timeLeft: accessTimeLeft,
    needsRefresh,
    accessTokenValid: isAccessValid,
    refreshTokenValid: isRefreshValid,
  };
};

/**
 * Lấy thông tin chi tiết về token
 * @returns {Object} Token details
 */
export const getTokenDetails = () => {
  const token = localStorageUtil.get('token');

  if (!token?.accessToken) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.accessToken.split('.')[1]));
    const currentTime = Date.now() / 1000;

    return {
      subject: payload.sub,
      issuer: payload.iss,
      issuedAt: new Date(payload.iat * 1000),
      expiresAt: new Date(payload.exp * 1000),
      roles: payload.roles || [],
      timeLeft: Math.max(0, payload.exp - currentTime),
      isExpired: payload.exp <= currentTime,
    };
  } catch (error) {
    return null;
  }
};

/**
 * useTokenService.js - Custom hook để sử dụng token service
 *
 * Hook này cung cấp các chức năng:
 * - Kiểm tra trạng thái token
 * - Refresh token thủ công
 * - Theo dõi thời gian còn lại của token
 */

import { useState, useEffect, useCallback } from 'react';
import tokenService from '@/services/tokenService';

const useTokenService = () => {
  const [tokenInfo, setTokenInfo] = useState({
    isValid: false,
    isExpiringSoon: false,
    timeLeft: 0,
    isLoading: false,
  });

  // Cập nhật thông tin token
  const updateTokenInfo = useCallback(() => {
    const token = tokenService.getToken();
    if (!token?.accessToken) {
      setTokenInfo({
        isValid: false,
        isExpiringSoon: false,
        timeLeft: 0,
        isLoading: false,
      });
      return;
    }

    const isValid = tokenService.isTokenValid(token.accessToken);
    const isExpiringSoon = tokenService.isTokenExpiringSoon(token.accessToken);
    const timeLeft = tokenService.getTokenTimeLeft(token.accessToken);

    setTokenInfo({
      isValid,
      isExpiringSoon,
      timeLeft,
      isLoading: false,
    });
  }, []);

  // Refresh token thủ công
  const refreshToken = useCallback(async () => {
    setTokenInfo((prev) => ({ ...prev, isLoading: true }));

    try {
      const newToken = await tokenService.refreshTokenIfNeeded();
      updateTokenInfo();
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      updateTokenInfo();
      throw error;
    }
  }, [updateTokenInfo]);

  // Kiểm tra token có hợp lệ không
  const checkTokenValidity = useCallback(() => {
    updateTokenInfo();
    return tokenInfo.isValid;
  }, [updateTokenInfo, tokenInfo.isValid]);

  // Lấy thông tin token hiện tại
  const getCurrentToken = useCallback(() => {
    return tokenService.getToken();
  }, []);

  // Xóa token (logout)
  const clearToken = useCallback(() => {
    tokenService.clearToken();
    updateTokenInfo();
  }, [updateTokenInfo]);

  // Khởi tạo token service
  const initTokenService = useCallback(() => {
    tokenService.init();
    updateTokenInfo();
  }, [updateTokenInfo]);

  // Cleanup token service
  const cleanupTokenService = useCallback(() => {
    tokenService.cleanup();
  }, []);

  // Theo dõi thay đổi token
  useEffect(() => {
    updateTokenInfo();

    // Cập nhật thông tin token mỗi phút
    const interval = setInterval(updateTokenInfo, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [updateTokenInfo]);

  return {
    // State
    tokenInfo,

    // Actions
    refreshToken,
    checkTokenValidity,
    getCurrentToken,
    clearToken,
    initTokenService,
    cleanupTokenService,

    // Utilities
    isTokenValid: tokenInfo.isValid,
    isTokenExpiringSoon: tokenInfo.isExpiringSoon,
    tokenTimeLeft: tokenInfo.timeLeft,
    isLoading: tokenInfo.isLoading,

    // Token type validation
    isAccessToken: (token) => tokenService.isAccessToken(token),
    isRefreshToken: (token) => tokenService.isRefreshToken(token),
  };
};

export default useTokenService;

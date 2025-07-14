/**
 * useConnectionMonitor.js - Hook theo dõi trạng thái kết nối và xử lý khi máy treo
 *
 * Hook này cung cấp các chức năng:
 * - Theo dõi trạng thái online/offline
 * - Phát hiện khi máy treo hoặc không hoạt động
 * - Tự động refresh token khi kết nối được khôi phục
 * - Xử lý các trường hợp mất kết nối tạm thời
 */

import { useState, useEffect, useRef } from 'react';
import { notify } from '@/utils/notify';
import {
  handleConnectionRestore,
  handleWindowFocus,
  handleTabVisible,
  updateLastActivity,
  getLastActivity,
  handleInactivity,
} from '@/utils/tokenUtils';

const useConnectionMonitor = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isInactive, setIsInactive] = useState(false);
  const inactivityCheckRef = useRef(null);

  // Thời gian không hoạt động để coi là inactive (5 phút)
  const INACTIVITY_THRESHOLD = 5 * 60 * 1000;

  // Thời gian kiểm tra inactivity (1 phút)
  const INACTIVITY_CHECK_INTERVAL = 60 * 1000;

  // Cập nhật thời gian hoạt động cuối
  const updateActivity = () => {
    const now = Date.now();
    setLastActivity(now);
    updateLastActivity(); // Cập nhật vào localStorage

    if (isInactive) {
      setIsInactive(false);
      console.log('User activity detected, no longer inactive');
    }
  };

  // Kiểm tra inactivity
  const checkInactivity = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;

    if (timeSinceLastActivity > INACTIVITY_THRESHOLD && !isInactive) {
      setIsInactive(true);
      console.log('User detected as inactive');

      // Xử lý inactivity
      handleInactivity(timeSinceLastActivity);
    }
  };

  // Xử lý khi kết nối được khôi phục
  const handleOnline = async () => {
    setIsOnline(true);
    console.log('Connection restored');

    // Sử dụng utility function để xử lý connection restore
    await handleConnectionRestore();
  };

  // Xử lý khi mất kết nối
  const handleOffline = () => {
    setIsOnline(false);
    console.log('Connection lost');

    notify.warning(
      'Mất kết nối',
      'Kết nối mạng đã bị mất. Một số tính năng có thể không hoạt động.'
    );
  };

  // Xử lý window focus với utility function
  const handleWindowFocusEvent = async () => {
    await handleWindowFocus();
    updateActivity();
  };

  // Xử lý visibility change với utility function
  const handleVisibilityChangeEvent = async () => {
    if (!document.hidden) {
      await handleTabVisible();
      updateActivity();
    }
  };

  // Thiết lập các event listeners
  useEffect(() => {
    // Online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Window focus event
    window.addEventListener('focus', handleWindowFocusEvent);

    // Visibility change event
    document.addEventListener('visibilitychange', handleVisibilityChangeEvent);

    // User activity events
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Thiết lập interval để kiểm tra inactivity
    inactivityCheckRef.current = setInterval(
      checkInactivity,
      INACTIVITY_CHECK_INTERVAL
    );

    // Khởi tạo lastActivity từ localStorage
    const storedLastActivity = getLastActivity();
    if (storedLastActivity) {
      setLastActivity(storedLastActivity);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', handleWindowFocusEvent);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChangeEvent
      );

      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });

      if (inactivityCheckRef.current) {
        clearInterval(inactivityCheckRef.current);
      }
    };
  }, [lastActivity, isInactive]);

  // Theo dõi thay đổi trạng thái online
  useEffect(() => {
    if (isOnline && isInactive) {
      // Khi kết nối được khôi phục và user đã inactive, thử refresh token
      handleOnline();
    }
  }, [isOnline, isInactive]);

  return {
    // State
    isOnline,
    isInactive,
    lastActivity,

    // Actions
    updateActivity,
    checkInactivity,

    // Utilities
    timeSinceLastActivity: Date.now() - lastActivity,
    isConnectionStable: isOnline && !isInactive,
  };
};

export default useConnectionMonitor;

/**
 * Utility để xử lý các sự kiện storageEvent giúp đồng bộ dữ liệu giữa các tab/cửa sổ
 */

// Định nghĩa các key cho custom events
const EVENTS = {
  AVATAR_UPDATED: 'avatar_updated',
};

/**
 * Kích hoạt sự kiện cập nhật avatar
 * @param {string} avatarUrl - URL của avatar mới
 */
export const triggerAvatarUpdate = (avatarUrl) => {
  try {
    // Lưu URL avatar mới vào sessionStorage để đảm bảo tồn tại sau khi reload
    sessionStorage.setItem('last_updated_avatar', avatarUrl);

    // Sử dụng helper để cập nhật userProfile trong localStorage
    const localStorageUtil = require('./localStorage').default;

    // Cập nhật avatar trong userProfile, đảm bảo giữ cấu trúc chuẩn
    localStorageUtil.updateUserProfile({ avatar: avatarUrl }, true);

    // Cập nhật cả đối tượng user trong localStorage nếu có
    const user = localStorageUtil.get('user');
    if (user) {
      user.avatar = avatarUrl;
      localStorageUtil.set('user', user);
    }

    // Phát sự kiện tùy chỉnh để các component đang lắng nghe có thể cập nhật
    const event = new CustomEvent(EVENTS.AVATAR_UPDATED, {
      detail: { avatarUrl },
    });
    window.dispatchEvent(event);

    // Để đồng bộ giữa các tab, sử dụng localStorage event
    // Cập nhật một key trong localStorage với timestamp để kích hoạt storage event
    localStorage.setItem('avatar_sync_trigger', Date.now().toString());
  } catch (error) {}
};

/**
 * Hook lắng nghe sự kiện cập nhật avatar
 * @param {Function} callback - Hàm callback khi avatar được cập nhật
 */
export const listenToAvatarUpdates = (callback) => {
  // Lắng nghe sự kiện tùy chỉnh trong cùng một tab
  const handleCustomEvent = (event) => {
    const avatarUrl = event.detail?.avatarUrl;
    if (avatarUrl && typeof callback === 'function') {
      callback(avatarUrl);

      // Luôn cập nhật sessionStorage để đảm bảo đồng bộ
      sessionStorage.setItem('last_updated_avatar', avatarUrl);
    }
  };

  // Lắng nghe sự kiện localStorage từ các tab khác
  const handleStorageEvent = (event) => {
    if (
      event.key === 'avatar_sync_trigger' ||
      event.key === 'userProfile' ||
      event.key === 'user'
    ) {
      // Kiểm tra xem có avatar mới được lưu trong sessionStorage không
      const lastUpdatedAvatar = sessionStorage.getItem('last_updated_avatar');

      // Kiểm tra từ userProfile
      const userProfile = JSON.parse(
        localStorage.getItem('userProfile') || '{}'
      );
      const avatarFromUserProfile =
        userProfile?.data?.avatar || userProfile?.avatar;

      // Kiểm tra từ user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const avatarFromUser = user?.avatar;

      // Ưu tiên sử dụng avatar từ sessionStorage, sau đó là từ userProfile và cuối cùng là từ user
      const bestAvatar =
        lastUpdatedAvatar || avatarFromUserProfile || avatarFromUser;

      if (bestAvatar && typeof callback === 'function') {
        callback(bestAvatar);

        // Luôn cập nhật sessionStorage để đảm bảo đồng bộ
        sessionStorage.setItem('last_updated_avatar', bestAvatar);
      }
    }
  };

  // Đăng ký các event listeners
  window.addEventListener(EVENTS.AVATAR_UPDATED, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  // Kích hoạt kiểm tra ngay lập tức để đảm bảo có giá trị mới nhất
  setTimeout(() => {
    const lastUpdatedAvatar = sessionStorage.getItem('last_updated_avatar');
    if (lastUpdatedAvatar && typeof callback === 'function') {
      callback(lastUpdatedAvatar);
    }
  }, 0);

  // Trả về một hàm để huỷ đăng ký khi không cần thiết
  return () => {
    window.removeEventListener(EVENTS.AVATAR_UPDATED, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};

// Export các hằng số event
export const STORAGE_EVENTS = EVENTS;

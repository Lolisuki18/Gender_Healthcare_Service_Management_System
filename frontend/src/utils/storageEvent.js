/**
 * Utility để xử lý các sự kiện storageEvent giúp đồng bộ dữ liệu giữa các tab/cửa sổ
 */

// Định nghĩa các key cho custom events
const EVENTS = {
  AVATAR_UPDATED: "avatar_updated",
};

/**
 * Kích hoạt sự kiện cập nhật avatar
 * @param {string} avatarUrl - URL của avatar mới
 */
export const triggerAvatarUpdate = (avatarUrl) => {
  try {
    // Lưu URL avatar mới vào sessionStorage để đảm bảo tồn tại sau khi reload
    sessionStorage.setItem("last_updated_avatar", avatarUrl);

    // Cập nhật trực tiếp userProfile trong localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        profile.avatar = avatarUrl;
        localStorage.setItem("userProfile", JSON.stringify(profile));
        console.log(
          "Đã cập nhật trực tiếp avatar trong localStorage userProfile:",
          avatarUrl
        );
      } catch (e) {
        console.error("Lỗi khi cập nhật userProfile trong localStorage:", e);
      }
    }

    // Phát sự kiện tùy chỉnh để các component đang lắng nghe có thể cập nhật
    const event = new CustomEvent(EVENTS.AVATAR_UPDATED, {
      detail: { avatarUrl },
    });
    window.dispatchEvent(event);

    // Để đồng bộ giữa các tab, sử dụng localStorage event
    // Cập nhật một key trong localStorage với timestamp để kích hoạt storage event
    localStorage.setItem("avatar_sync_trigger", Date.now().toString());

    console.log("Đã kích hoạt sự kiện cập nhật avatar:", avatarUrl);
  } catch (error) {
    console.error("Lỗi khi kích hoạt sự kiện cập nhật avatar:", error);
  }
};

/**
 * Hook lắng nghe sự kiện cập nhật avatar
 * @param {Function} callback - Hàm callback khi avatar được cập nhật
 */
export const listenToAvatarUpdates = (callback) => {
  // Lắng nghe sự kiện tùy chỉnh trong cùng một tab
  const handleCustomEvent = (event) => {
    const avatarUrl = event.detail?.avatarUrl;
    if (avatarUrl && typeof callback === "function") {
      callback(avatarUrl);
    }
  };

  // Lắng nghe sự kiện localStorage từ các tab khác
  const handleStorageEvent = (event) => {
    if (event.key === "avatar_sync_trigger") {
      // Kiểm tra xem có avatar mới được lưu trong sessionStorage không
      const lastUpdatedAvatar = sessionStorage.getItem("last_updated_avatar");
      if (lastUpdatedAvatar && typeof callback === "function") {
        callback(lastUpdatedAvatar);
      }
    }
  };

  // Đăng ký các event listeners
  window.addEventListener(EVENTS.AVATAR_UPDATED, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  // Trả về một hàm để huỷ đăng ký khi không cần thiết
  return () => {
    window.removeEventListener(EVENTS.AVATAR_UPDATED, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
};

// Export các hằng số event
export const STORAGE_EVENTS = EVENTS;

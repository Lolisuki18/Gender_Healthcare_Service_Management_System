const localStorageUtil = {
  /**
   * Lưu giá trị vào localStorage
   * @param {string} key - Khóa để lưu trữ giá trị
   * @param {any} value - Giá trị cần lưu (sẽ được chuyển thành JSON)
   */
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      // console.error("Error setting localStorage item:", error);
    }
  },
  /**
   * Lấy giá trị từ localStorage
   * @param {string} key - Khóa để lấy giá trị
   * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy khóa
   * @returns {any} Giá trị đã lưu hoặc giá trị mặc định
   */
  get: (key, defaultValue = null) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      // console.error("Error getting from localStorage:", error);
      return defaultValue;
    }
  },
  /**
   * Xóa một mục khỏi localStorage
   * @param {string} key - Khóa cần xóa
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // console.error("Error removing from localStorage:", error);
    }
  },
  /**
   * Kiểm tra một khóa có tồn tại trong localStorage không
   * @param {string} key - Khóa cần kiểm tra
   * @returns {boolean} true nếu tồn tại, ngược lại là false
   */
  exists: (key) => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      // console.error("Error checking existence in localStorage:", error);
      return false;
    }
  },
  /**
   * Cập nhật userProfile trong localStorage
   * @param {Object} userData - Data người dùng cần cập nhật
   * @param {boolean} ensureStandardFormat - Đảm bảo dữ liệu sẽ có format chuẩn {success, message, data}
   */
  updateUserProfile: (userData, ensureStandardFormat = true) => {
    try {
      if (!userData) return;

      // Lấy userProfile hiện tại từ localStorage
      const existingProfile = localStorageUtil.get('userProfile');

      if (ensureStandardFormat) {
        // Nếu dữ liệu hiện có đã có cấu trúc chuẩn
        if (existingProfile && existingProfile.data) {
          const updatedProfile = {
            ...existingProfile,
            data: {
              ...existingProfile.data,
              ...userData,
            },
          };
          localStorageUtil.set('userProfile', updatedProfile);
        }
        // Nếu dữ liệu hiện có không có cấu trúc chuẩn hoặc không tồn tại
        else {
          // Chuyển đổi sang cấu trúc chuẩn
          const newProfile = {
            success: true,
            message: 'User profile updated',
            data: existingProfile
              ? { ...existingProfile, ...userData }
              : userData,
          };
          localStorageUtil.set('userProfile', newProfile);
        }
      } else {
        // Cập nhật trực tiếp không đảm bảo cấu trúc
        if (existingProfile) {
          localStorageUtil.set('userProfile', {
            ...existingProfile,
            ...userData,
          });
        } else {
          localStorageUtil.set('userProfile', userData);
        }
      }
    } catch (error) {
      // console.error("Error updating userProfile in localStorage:", error);
    }
  },

  /**
   * Lấy dữ liệu người dùng từ userProfile, tự động xử lý cả hai cấu trúc
   * @returns {Object|null} Dữ liệu user hoặc null nếu không tồn tại
   */
  getUserData: () => {
    try {
      const userProfile = localStorageUtil.get('userProfile');
      if (!userProfile) return null;

      // Nếu có cấu trúc chuẩn {success, message, data}
      if (userProfile.data) {
        return userProfile.data;
      }

      // Nếu là object trực tiếp
      return userProfile;
    } catch (error) {
      // console.error("Error getting user data from localStorage:", error);
      return null;
    }
  },

  /**
   * Lưu token vào localStorage
   * @param {Object} tokenData - Object chứa accessToken và refreshToken
   */
  setTokens: (tokenData) => {
    try {
      if (tokenData.accessToken) {
        localStorageUtil.set('accessToken', tokenData.accessToken);
      }
      if (tokenData.refreshToken) {
        localStorageUtil.set('refreshToken', tokenData.refreshToken);
      }
      // Lưu cả object token để dễ quản lý
      localStorageUtil.set('token', tokenData);
    } catch (error) {
      // console.error("Error setting tokens in localStorage:", error);
    }
  },

  /**
   * Lấy tokens từ localStorage
   * @returns {Object|null} Object chứa accessToken và refreshToken hoặc null
   */
  getTokens: () => {
    try {
      return localStorageUtil.get('token');
    } catch (error) {
      // console.error("Error getting tokens from localStorage:", error);
      return null;
    }
  },

  /**
   * Xóa tất cả tokens khỏi localStorage
   */
  clearTokens: () => {
    try {
      localStorageUtil.remove('accessToken');
      localStorageUtil.remove('refreshToken');
      localStorageUtil.remove('token');
    } catch (error) {
      // console.error("Error clearing tokens from localStorage:", error);
    }
  },
};

export default localStorageUtil;

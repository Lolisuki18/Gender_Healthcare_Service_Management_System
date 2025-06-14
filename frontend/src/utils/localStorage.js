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
      console.error("Error setting localStorage item:", error);
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
      console.error("Error getting from localStorage:", error);
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
      console.error("Error removing from localStorage:", error);
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
      console.error("Error checking existence in localStorage:", error);
      return false;
    }
  },
};

export default localStorageUtil;

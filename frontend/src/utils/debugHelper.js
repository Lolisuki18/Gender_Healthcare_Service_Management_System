/**
 * debugHelper.js - Utility cho việc debug ứng dụng
 *
 * File này cung cấp các hàm hỗ trợ cho việc debug ứng dụng,
 * đặc biệt là các vấn đề liên quan đến xử lý avatar và response từ API
 */

// Biến cấu hình để bật/tắt debug
const DEBUG_CONFIG = {
  API_RESPONSES: true,
  AVATAR_UPDATES: true,
  REDUX_ACTIONS: true,
  LOCAL_STORAGE: true,
};

/**
 * Log thông tin debug với định dạng dễ đọc
 * @param {string} category - Danh mục debug (API_RESPONSES, AVATAR_UPDATES, v.v.)
 * @param {string} message - Thông điệp debug
 * @param {any} data - Dữ liệu cần log
 */
export const debugLog = (category, message, data) => {
  if (process.env.NODE_ENV !== "production" && DEBUG_CONFIG[category]) {
    console.group(`🔍 DEBUG [${category}]: ${message}`);

    if (data !== undefined) {
      if (typeof data === "object") {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(data);
      }
    }

    console.groupEnd();
  }
};

/**
 * Phân tích cấu trúc object response để tìm avatar URL
 * @param {Object} response - Response từ API
 * @returns {string|null} - Đường dẫn avatar nếu tìm thấy, null nếu không
 */
export const extractAvatarFromResponse = (response) => {
  debugLog("API_RESPONSES", "Phân tích response để tìm avatar:", response);

  if (!response) {
    return null;
  }

  // Các vị trí có thể chứa avatar trong response
  const possiblePaths = [
    response.data?.data?.avatarUrl,
    response.data?.data?.avatar,
    response.data?.avatarUrl,
    response.data?.avatar,
    response.avatarUrl,
    response.avatar,
  ];

  // Kiểm tra nếu response.data là string và có thể là đường dẫn
  if (
    typeof response.data === "string" &&
    (response.data.includes("/img/") ||
      response.data.includes("/avatar/") ||
      response.data.includes("/images/"))
  ) {
    possiblePaths.push(response.data);
  }

  // Tìm giá trị đầu tiên khác null/undefined
  const avatarPath = possiblePaths.find(
    (path) => path !== undefined && path !== null
  );

  debugLog(
    "AVATAR_UPDATES",
    avatarPath
      ? "Tìm thấy đường dẫn avatar:"
      : "Không tìm thấy đường dẫn avatar",
    avatarPath
  );

  return avatarPath || null;
};

/**
 * In ra trạng thái của localStorage và sessionStorage
 */
export const logStorageState = () => {
  if (process.env.NODE_ENV !== "production" && DEBUG_CONFIG.LOCAL_STORAGE) {
    console.group("🗄️ DEBUG [LOCAL_STORAGE]: Trạng thái hiện tại");

    // LocalStorage
    console.group("localStorage:");
    try {
      const userProfile = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      );
      console.log("userProfile:", userProfile);

      const token = localStorage.getItem("token")
        ? "✓ Có token"
        : "✗ Không có token";
      console.log("token:", token);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("user:", user);
    } catch (e) {
      console.error("Lỗi khi đọc localStorage:", e);
    }
    console.groupEnd();

    // SessionStorage
    console.group("sessionStorage:");
    try {
      const lastUpdatedAvatar = sessionStorage.getItem("last_updated_avatar");
      console.log("last_updated_avatar:", lastUpdatedAvatar);
    } catch (e) {
      console.error("Lỗi khi đọc sessionStorage:", e);
    }
    console.groupEnd();

    console.groupEnd();
  }
};

export default {
  debugLog,
  extractAvatarFromResponse,
  logStorageState,
};

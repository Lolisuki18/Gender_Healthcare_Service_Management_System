/**
 * imageUrl.js - Tiện ích xử lý URL hình ảnh
 *
 * File này chứa các hàm tiện ích để xử lý và định dạng URL hình ảnh,
 * đặc biệt là việc chuyển đổi đường dẫn tương đối thành URL tuyệt đối
 * cho các hình ảnh như avatar được lưu trữ trên máy chủ.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Chuyển đổi đường dẫn tương đối thành URL đầy đủ cho hình ảnh
 * @param {string} path - Đường dẫn tương đối (ví dụ: /img/avatar/image.jpg)
 * @returns {string} URL đầy đủ cho hình ảnh
 */
export const getFullImageUrl = (path) => {
  console.log("getFullImageUrl - input path:", path);

  if (!path) {
    console.log("getFullImageUrl - path is null or undefined, returning null");
    return null;
  }

  // Nếu đường dẫn đã là URL đầy đủ, trả về nguyên gốc
  if (path.startsWith("http://") || path.startsWith("https://")) {
    console.log(
      "getFullImageUrl - path is already a full URL, returning as is"
    );
    return path;
  }

  // Đảm bảo path bắt đầu bằng dấu "/"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Kết hợp base URL với đường dẫn
  const fullUrl = `${API_BASE_URL}${normalizedPath}`;
  console.log("getFullImageUrl - constructed full URL:", fullUrl);
  return fullUrl;
};

/**
 * Kiểm tra xem một chuỗi có phải là URL hình ảnh hợp lệ không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} True nếu URL có vẻ là hình ảnh
 */
export const isImageUrl = (url) => {
  if (!url) return false;

  // Kiểm tra phần mở rộng phổ biến của hình ảnh
  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
  const lowercaseUrl = url.toLowerCase();

  return extensions.some((ext) => lowercaseUrl.endsWith(ext));
};

// Tạo đối tượng để export
const imageUrl = {
  getFullImageUrl,
  isImageUrl,
  API_BASE_URL,
};

export default imageUrl;

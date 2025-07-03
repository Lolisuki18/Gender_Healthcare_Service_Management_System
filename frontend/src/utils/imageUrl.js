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
export function getFullImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Nếu là đường dẫn tương đối /img/... thì nối domain backend
  return `http://localhost:8080${url}`;
}

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

export function getBlogImageUrl(path) {
  if (!path) return '/img/blog/default.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:8080${path}`;
}

export function getAvatarUrl(path) {
  if (!path) return '/img/avatar/default.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:8080${path}`;
}

// Tạo đối tượng để export
const imageUrl = {
  getFullImageUrl,
  isImageUrl,
  API_BASE_URL,
};

export default imageUrl;

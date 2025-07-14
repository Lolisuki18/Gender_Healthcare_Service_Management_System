/**
 * imageUrl.js - Tiện ích xử lý URL hình ảnh
 *
 * File này chứa các hàm tiện ích để xử lý và định dạng URL hình ảnh,
 * đặc biệt là việc chuyển đổi đường dẫn tương đối thành URL tuyệt đối
 * cho các hình ảnh như avatar được lưu trữ trên máy chủ.
 */

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080' || process.env.REACT_APP_API_URL;

/**
 * Chuyển đổi đường dẫn tương đối thành URL đầy đủ cho hình ảnh
 * @param {string} path - Đường dẫn tương đối (ví dụ: /img/avatar/image.jpg)
 * @returns {string} URL đầy đủ cho hình ảnh
 */
export function getFullImageUrl(url) {
  if (!url || url === 'null' || url === 'undefined')
    return '/img/avatar/default.jpg';
  if (url.startsWith('http')) return url;
  // Nếu là đường dẫn tương đối /img/... thì nối domain backend
  return `${API_BASE_URL}${url}`;
}

/**
 * Kiểm tra xem một chuỗi có phải là URL hình ảnh hợp lệ không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} True nếu URL có vẻ là hình ảnh
 */
export const isImageUrl = (url) => {
  if (!url) return false;

  // Kiểm tra phần mở rộng phổ biến của hình ảnh
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();

  return extensions.some((ext) => lowercaseUrl.endsWith(ext));
};

export function getBlogImageUrl(path) {
  if (!path) {
    return '/img/blog/default.jpg'; // Sử dụng ảnh JPG có sẵn trong public/img/blog
  }

  if (path.startsWith('http')) {
    return path;
  }

  // Chỉ sử dụng local cho file default.jpg
  if (path === '/img/blog/default.jpg') {
    return path; // React sẽ tự động tìm trong public folder
  }

  // Tất cả các đường dẫn khác từ backend API (bao gồm /img/blog/thumb_xxx.jpg)
  const fullUrl = `${API_BASE_URL}${path}`;
  return fullUrl;
}

/**
 * Lấy danh sách hình ảnh fallback cho blog
 * @returns {Array} Mảng các URL hình ảnh fallback
 */
export function getBlogFallbackImages() {
  return [
    '/img/blog/default.jpg',
    'https://via.placeholder.com/300x200/e0f7fa/546e7a?text=Hình+không+khả+dụng',
  ];
}

export function getAvatarUrl(path) {
  if (!path) {
    return `${API_BASE_URL}/img/blog/default.jpg`; // Trả về full URL từ backend
  }

  if (path.startsWith('http')) {
    return path;
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  return fullUrl;
}

/**
 * Lấy danh sách hình ảnh fallback cho avatar
 * @returns {Array} Mảng các URL hình ảnh fallback cho avatar
 */
export function getAvatarFallbackImages() {
  return [
    '/img/blog/default.jpg',
    'https://via.placeholder.com/100x100/e0f7fa/546e7a?text=User',
  ];
}

// Tạo đối tượng để export
const imageUrl = {
  getFullImageUrl,
  isImageUrl,
  getBlogImageUrl,
  getBlogFallbackImages,
  getAvatarUrl,
  getAvatarFallbackImages,
  API_BASE_URL,
};

export default imageUrl;

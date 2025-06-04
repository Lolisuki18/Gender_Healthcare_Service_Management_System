/**
 * Format một chuỗi thời gian thành định dạng ngày tháng cụ thể
 * @param {string|Date} dateString - Chuỗi thời gian hoặc đối tượng Date
 * @param {object} options - Các tùy chọn định dạng
 * @returns {string} - Chuỗi ngày đã định dạng
 */
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("vi-VN", defaultOptions).format(date);
};

/**
 * Format một số thành định dạng tiền tệ
 * @param {number} amount - Số tiền cần định dạng
 * @param {string} currency - Loại tiền tệ (mặc định: VND)
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (amount, currency = "VND") => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Rút gọn một chuỗi với độ dài xác định
 * @param {string} text - Chuỗi cần rút gọn
 * @param {number} maxLength - Chiều dài tối đa
 * @returns {string} - Chuỗi đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;

  return `${text.slice(0, maxLength)}...`;
};

/**
 * Xác thực định dạng email
 * @param {string} email - Email cần xác thực
 * @returns {boolean} - true nếu email hợp lệ, ngược lại là false
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Lưu trữ dữ liệu trong localStorage với thời gian hết hạn
 * @param {string} key - Khóa lưu trữ
 * @param {any} value - Giá trị để lưu trữ
 * @param {number} expiryInMinutes - Thời gian hết hạn tính bằng phút
 */
export const setWithExpiry = (key, value, expiryInMinutes = 60) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expiryInMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Lấy dữ liệu từ localStorage với kiểm tra hết hạn
 * @param {string} key - Khóa lưu trữ
 * @returns {any|null} - Giá trị hoặc null nếu không tìm thấy hoặc hết hạn
 */
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

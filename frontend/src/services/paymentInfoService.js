
import apiClient from './api';

const paymentInfoService = {
  // Lấy tất cả thẻ của user hiện tại
  getAll: () => apiClient.get('/payment-info'),

  // Lấy thẻ mặc định
  getDefault: () => apiClient.get('/payment-info/default'),

  // Lấy thẻ theo ID (dùng để thanh toán)
  getForPayment: (paymentInfoId) => apiClient.get(`/payment-info/${paymentInfoId}/for-payment`),

  // Tạo thẻ mới
  create: (data) => apiClient.post('/payment-info', data),

  // Cập nhật thẻ
  update: (paymentInfoId, data) => apiClient.put(`/payment-info/${paymentInfoId}`, data),

  // Xóa thẻ
  remove: (paymentInfoId) => apiClient.delete(`/payment-info/${paymentInfoId}`),

  // Đặt thẻ làm mặc định
  setDefault: (paymentInfoId) => apiClient.put(`/payment-info/${paymentInfoId}/set-default`),
};

// Utility functions for backward compatibility
export const getUserPaymentInfos = paymentInfoService.getAll;
export const createPaymentInfo = paymentInfoService.create;
export const updatePaymentInfo = paymentInfoService.update;
export const deletePaymentInfo = paymentInfoService.remove;
export const setDefaultPaymentInfo = paymentInfoService.setDefault;

// Utility functions for card formatting and validation
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  // Remove all non-digit characters and add spaces every 4 digits
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 8) return cardNumber;
  return cleaned.slice(0, 4) + ' **** **** ' + cleaned.slice(-4);
};

export const validateCardInfo = (cardInfo) => {
  const errors = {};

  // Validate card number (16 digits)
  if (!cardInfo.cardNumber) {
    errors.cardNumber = 'Vui lòng nhập số thẻ';
  } else if (cardInfo.cardNumber.replace(/\D/g, '').length !== 16) {
    errors.cardNumber = 'Số thẻ phải có 16 chữ số';
  } else if (!isValidCardNumber(cardInfo.cardNumber.replace(/\D/g, ''))) {
    errors.cardNumber = 'Số thẻ không hợp lệ';
  }

  // Validate expiry month
  if (!cardInfo.expiryMonth) {
    errors.expiryMonth = 'Vui lòng nhập tháng hết hạn';
  } else if (cardInfo.expiryMonth < 1 || cardInfo.expiryMonth > 12) {
    errors.expiryMonth = 'Tháng phải từ 01-12';
  }

  // Validate expiry year
  if (!cardInfo.expiryYear) {
    errors.expiryYear = 'Vui lòng nhập năm hết hạn';
  } else {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(cardInfo.expiryYear);
    const expiryMonth = parseInt(cardInfo.expiryMonth);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      errors.expiryYear = 'Thẻ đã hết hạn';
    }
  }

  // Validate CVC
  if (!cardInfo.cvc) {
    errors.cvc = 'Vui lòng nhập mã CVC';
  } else if (cardInfo.cvc.length < 3 || cardInfo.cvc.length > 4) {
    errors.cvc = 'Mã CVC phải có 3-4 chữ số';
  }

  // Validate cardholder name
  if (!cardInfo.cardHolderName || !cardInfo.cardHolderName.trim()) {
    errors.cardHolderName = 'Vui lòng nhập tên chủ thẻ';
  } else if (cardInfo.cardHolderName.trim().length < 2) {
    errors.cardHolderName = 'Tên chủ thẻ quá ngắn';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Luhn algorithm to validate card number
const isValidCardNumber = (cardNumber) => {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export default paymentInfoService;

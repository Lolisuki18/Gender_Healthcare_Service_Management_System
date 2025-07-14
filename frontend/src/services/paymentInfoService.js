import apiClient from '@services/api';

const API_URL = '/payment-info';

// Lấy tất cả thẻ của user hiện tại
export const getUserPaymentInfos = async () => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy thẻ mặc định của user hiện tại
export const getDefaultPaymentInfo = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/default`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy thẻ theo ID (với CVV để thanh toán)
export const getPaymentInfoForPayment = async (paymentInfoId) => {
  try {
    const response = await apiClient.get(
      `${API_URL}/${paymentInfoId}/for-payment`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tạo thẻ mới
export const createPaymentInfo = async (paymentInfoData) => {
  try {
    const response = await apiClient.post(API_URL, paymentInfoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật thẻ
export const updatePaymentInfo = async (paymentInfoId, paymentInfoData) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/${paymentInfoId}`,
      paymentInfoData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xóa thẻ
export const deletePaymentInfo = async (paymentInfoId) => {
  try {
    const response = await apiClient.delete(`${API_URL}/${paymentInfoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Đặt thẻ làm mặc định
export const setDefaultPaymentInfo = async (paymentInfoId) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/${paymentInfoId}/set-default`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Helper function để validate thông tin thẻ
export const validateCardInfo = (cardInfo) => {
  const errors = {};

  // Validate số thẻ
  if (!cardInfo.cardNumber || !/^[0-9]{16}$/.test(cardInfo.cardNumber)) {
    errors.cardNumber = 'Số thẻ phải có 16 chữ số';
  }

  // Validate tên chủ thẻ
  if (!cardInfo.cardHolderName || cardInfo.cardHolderName.trim().length === 0) {
    errors.cardHolderName = 'Tên chủ thẻ không được để trống';
  }

  // Validate tháng hết hạn
  if (
    !cardInfo.expiryMonth ||
    !/^(0[1-9]|1[0-2])$/.test(cardInfo.expiryMonth)
  ) {
    errors.expiryMonth = 'Tháng hết hạn phải từ 01-12';
  }

  // Validate năm hết hạn
  if (!cardInfo.expiryYear || !/^[0-9]{4}$/.test(cardInfo.expiryYear)) {
    errors.expiryYear = 'Năm hết hạn phải có 4 chữ số';
  }

  // Validate CVV
  if (!cardInfo.cvv || !/^[0-9]{3,4}$/.test(cardInfo.cvv)) {
    errors.cvv = 'CVV phải có 3-4 chữ số';
  }

  // Kiểm tra thẻ có hết hạn không
  if (cardInfo.expiryMonth && cardInfo.expiryYear) {
    try {
      const month = parseInt(cardInfo.expiryMonth);
      const year = parseInt(cardInfo.expiryYear);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        errors.expiryYear = 'Thẻ đã hết hạn';
      }
    } catch (e) {
      errors.expiryYear = 'Định dạng ngày hết hạn không hợp lệ';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper function để format số thẻ hiển thị
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};
// Helper function để mask số thẻ
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) return '****';
  return '**** **** **** ' + cardNumber.slice(-4);
};

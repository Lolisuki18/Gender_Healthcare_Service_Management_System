import apiClient from './api';

const consultantService = {
  //===================================== Xem thông tin =====================================
  // Lấy thông tin consultant với profile (nếu có)
  getConsultantDetails: async (consultantId) => {
    try {
      const response = await apiClient.get(`/consultants/${consultantId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  //Lấy toàn bộ consultant
  getAllConsultants: async () => {
    try {
      const response = await apiClient.get(`/consultants`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Cập nhật thông tin cá nhân =====================================

  updateProfessionalInfo: async (consultantId, data) => {
    try {
      const response = await apiClient.put(
        `/consultants/profile/${consultantId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  //===================================== Trang ConsultationPage =====================================

  // Đặt lịch hẹn với tư vấn viên (chuẩn backend mới)
  bookConsultation: async (appointmentData) => {
    try {
      const response = await apiClient.post('/consultations', appointmentData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể đặt lịch hẹn',
        error,
      };
    }
  },

  // Lấy các khung giờ có sẵn của tư vấn viên cho ngày cụ thể
  getAvailableTimeSlots: async (consultantId, date) => {
    try {
      const response = await apiClient.get(
        `/consultations/available-slots?consultantId=${consultantId}&date=${date}`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Không thể lấy thông tin khung giờ trống',
        error,
      };
    }
  },

  // Cập nhật trạng thái consultation
  updateConsultationStatus: async (consultationId, statusData) => {
    try {
      const response = await apiClient.put(
        `/consultations/${consultationId}/status`,
        statusData
      );
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Không thể cập nhật trạng thái',
        error,
      };
    }
  },

  // Lấy tất cả lịch tư vấn được giao cho chuyên viên
  getAssignedConsultations: async () => {
    try {
      const response = await apiClient.get('/consultations/assigned');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật ghi chú cho consultation
  updateConsultationNotes: async (consultationId, notes) => {
    try {
      const response = await apiClient.put(
        `/consultations/${consultationId}/notes`,
        { notes }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật ghi chú',
        error,
      };
    }
  },

  // Lấy lịch hẹn (consultations) của customer hiện tại
  getMyConsultations: async () => {
    try {
      const response = await apiClient.get('/consultations/my-consultations');
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch hẹn',
        error,
      };
    }
  },
};

export default consultantService;

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
  //Lấy profile của consultant
  getProfileConsultants: async (consultantId) => {
    try {
      const response = await apiClient.get(
        `/consultations/consultant/${consultantId}/profile`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Cập nhật thông tin cá nhân =====================================
  updatePersonalInfo: async (data) => {
    try {
      const response = await apiClient.put(`/profile/basic`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

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

  //===================================== Quản lý học vấn, kinh nghiệm, chứng chỉ =====================================
  addEducation: async (consultantId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/${consultantId}/education`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateEducation: async (consultantId, educationId, data) => {
    try {
      const response = await apiClient.put(
        `/consultants/${consultantId}/education/${educationId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteEducation: async (consultantId, educationId) => {
    try {
      const response = await apiClient.delete(
        `/consultants/${consultantId}/education/${educationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addExperience: async (consultantId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/${consultantId}/experience`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateExperience: async (consultantId, experienceId, data) => {
    try {
      const response = await apiClient.put(
        `/consultants/${consultantId}/experience/${experienceId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteExperience: async (consultantId, experienceId) => {
    try {
      const response = await apiClient.delete(
        `/consultants/${consultantId}/experience/${experienceId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addCertification: async (consultantId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/${consultantId}/certification`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCertification: async (consultantId, certificationId, data) => {
    try {
      const response = await apiClient.put(
        `/consultants/${consultantId}/certification/${certificationId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCertification: async (consultantId, certificationId) => {
    try {
      const response = await apiClient.delete(
        `/consultants/${consultantId}/certification/${certificationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Quản lý câu hỏi =====================================
  getMyQuestions: async () => {
    try {
      const response = await apiClient.get('/consultants/my-questions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuestionById: async (questionId) => {
    try {
      const response = await apiClient.get(
        `/consultants/questions/${questionId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  askQuestion: async (data) => {
    try {
      const response = await apiClient.post('/consultants/questions', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuestionsForConsultant: async (params = {}) => {
    try {
      const response = await apiClient.get('/consultants/answer-questions', {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  answerQuestion: async (questionId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/answer-questions/${questionId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Quản lý lịch tư vấn =====================================
  getConsultations: async (params = {}) => {
    try {
      const response = await apiClient.get('/consultants/consultations', {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConsultationById: async (consultationId) => {
    try {
      const response = await apiClient.get(
        `/consultants/consultations/${consultationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật trạng thái lịch tư vấn
  updateConsultationStatus: async (consultationId, data) => {
    try {
      const response = await apiClient.put(
        `/consultations/${consultationId}/status`,
        data
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Không thể cập nhật trạng thái',
        error,
      };
    }
  },

  addConsultationNotes: async (consultationId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/consultations/${consultationId}/notes`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Quản lý STI Tests =====================================
  getSTITests: async (params = {}) => {
    try {
      const response = await apiClient.get('/consultants/sti-tests', {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSTITestById: async (testId) => {
    try {
      const response = await apiClient.get(`/consultants/sti-tests/${testId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSTITestRecommendation: async (testId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/sti-tests/${testId}/recommendation`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  generateSTITestReport: async (testId) => {
    try {
      const response = await apiClient.get(
        `/consultants/sti-tests/${testId}/report`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Quản lý đánh giá =====================================
  getMyReviews: async (params = {}) => {
    try {
      const response = await apiClient.get('/consultants/reviews', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getReviewById: async (reviewId) => {
    try {
      const response = await apiClient.get(`/consultants/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  respondToReview: async (reviewId, data) => {
    try {
      const response = await apiClient.post(
        `/consultants/reviews/${reviewId}/respond`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getReviewsStatistics: async () => {
    try {
      const response = await apiClient.get('/consultants/reviews/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  //===================================== Trang ConsultationPage =====================================
  // // Lấy danh sách tư vấn viên
  // getAllConsultants: async () => {
  //   try {
  //     const response = await apiClient.get('/consultants');
  //     return {
  //       success: true,
  //       data: response.data,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching consultants:', error);
  //     return {
  //       success: false,
  //       message:
  //         error.response?.data?.message ||
  //         'Không thể lấy danh sách tư vấn viên',
  //       error,
  //     };
  //   }
  // },

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

  // Lấy các lịch hẹn đã đặt của người dùng
  getUserAppointments: async () => {
    try {
      const response = await apiClient.get('/consultations/user');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Không thể lấy thông tin lịch hẹn',
        error,
      };
    }
  },

  // Lấy danh sách lịch tư vấn của chuyên viên ở trạng thái chờ xác nhận
  getMyPendingConsultations: async () => {
    try {
      const response = await apiClient.get('/consultants/consultations', {
        params: { status: 'pending' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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

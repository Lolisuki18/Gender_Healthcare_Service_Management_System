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
      const reponse = await apiClient.get(`/consultations/consultants`);
      return reponse.data;
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

  updateConsultationStatus: async (consultationId, data) => {
    try {
      const response = await apiClient.put(
        `/consultants/consultations/${consultationId}/status`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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

  // Đặt lịch hẹn với tư vấn viên
  scheduleAppointment: async (appointmentData) => {
    try {
      const response = await apiClient.post(
        '/consultations/schedule',
        appointmentData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error scheduling appointment:', error);
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
        `/consultants/${consultantId}/availability?date=${date}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching available time slots:', error);
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
};

export default consultantService;

import apiClient from "./api";

export const consultantService = {
  //=================================================Xem thông tin=================================================
  //lấy thông tin consultant với profile (nếu có)
  getConsultantDetails: async (consultantId) => {
    try {
      const response = await apiClient.get(`/consultants/${consultantId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  //==================================================Cập nhật thông tin=================================================
  updateConsultantProfile: async (consultantId, profileData) => {
    try {
      const response = await apiClient.put(
        `/consultants/profile/${consultantId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

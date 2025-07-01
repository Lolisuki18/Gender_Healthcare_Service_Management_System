import apiClient from '@services/api';

const API_URL = '/menstrual-cycle';


const ovulationService = {
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/users/profile", { skipAutoRedirect: true });
      return response.data;
    } catch (error) {
      // Không redirect, chỉ trả về null nếu lỗi 401 hoặc không có user
      return null;
    }
  },
  isLoggedIn: async () => {
    try {
      const response = await apiClient.get("/users/profile", { skipAutoRedirect: true });
      return !!response.data;
    } catch (error) {
      return false;
    }
  },


  //===================================== Xem thông tin =====================================
  // Lấy thông tin menstrual cycle với profile (nếu có)
  getMenstrualCycle: async (cycleId) => {
    try {
      const response = await apiClient.get(`${API_URL}/${cycleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tất cả menstrual cycle
  getAllMenstrualCycles: async () => {
    try {
      const response = await apiClient.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tất cả menstrual cycle với tỉ lệ mang thai
  getAllMenstrualCyclesWithPregnancyProb: async () => {
    try {
      const response = await apiClient.get(`${API_URL}/pregnancy-prob`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },




  // ===================================== Xử lí thông tin =====================================
  // Khai báo chu kỳ kinh nguyệt
  createMenstrualCycle: async (cycleData) => {
    try {
      const response = await apiClient.post(API_URL, cycleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật chu kỳ kinh nguyệt
  updateMenstrualCycle: async (cycleId, cycleData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${cycleId}`, cycleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa chu kỳ kinh nguyệt
  deleteMenstrualCycle: async (cycleId) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${cycleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  // ===================================== Tính toán =====================================
  // Dự đoán chu kỳ kinh nguyệt tiếp theo
  predictNextCycle: async () => {
    try {
      const response = await apiClient.get(`${API_URL}/predict`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

};





export default ovulationService; 
import apiClient from "@services/api";

const ovulationAuthService = {
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
  }
};

export default ovulationAuthService; 
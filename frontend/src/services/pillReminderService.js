import apiClient from '@services./api';

const pillReminderService = {
  /**
   * Tạo một lịch uống thuốc mới.
   * @param {Object} scheduleData - Dữ liệu lịch uống thuốc (pillDays, breakDays, startDate, reminderTime)
   * @returns {Promise<Object>} Dữ liệu lịch đã tạo từ API
   */
  createPillSchedule: async (scheduleData) => {
    try {
      const response = await apiClient.post('/contraceptive', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy lịch uống thuốc hiện tại của người dùng.
   * @returns {Promise<Object>} Dữ liệu lịch uống thuốc từ API
   */
  getPillSchedule: async () => {
    // TODO: Cần có một endpoint ở backend để lấy lịch hiện tại của người dùng. 
    // Backend hiện chỉ có GET /contraceptive/{id} để lấy logs, không phải lịch tổng thể.
    // Tạm thời trả về null hoặc throw error nếu không có endpoint.
    // Nếu có endpoint, hãy cập nhật đường dẫn tại đây.
    console.warn("Endpoint for fetching current pill schedule is not defined in backend controller. Please ensure it exists or create one.");
    try {
      // Giả định có một endpoint để lấy lịch hiện tại cho người dùng đã đăng nhập.
      // Bạn cần thay đổi đường dẫn này nếu endpoint thực tế khác.
      const response = await apiClient.get('/contraceptive'); 
      return response.data;
    } catch (error) {
      // Nếu không tìm thấy lịch, có thể trả về một đối tượng rỗng hoặc null thay vì throw error nếu backend trả về 404.
      if (error.response && error.response.status === 404) {
        return { success: false, data: null, message: "Lịch uống thuốc chưa được tạo." };
      }
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cập nhật lịch uống thuốc hiện có.
   * @param {string} scheduleId - ID của lịch cần cập nhật
   * @param {Object} updatedData - Dữ liệu cập nhật (pillDays, breakDays, startDate, reminderTime)
   * @returns {Promise<Object>} Dữ liệu lịch đã cập nhật từ API
   */
  updatePillSchedule: async (scheduleId, updatedData) => {
    try {
      const response = await apiClient.put(`/contraceptive/${scheduleId}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Check-in/check-out cho một ngày cụ thể.
   * @param {string} scheduleId - ID của lịch
   * @param {string} dateString - Ngày cần check-in/check-out (YYYY-MM-DD)
   * @returns {Promise<Object>} Dữ liệu lịch đã cập nhật từ API
   */
  togglePillCheckIn: async (scheduleId, dateString) => {
    try {
      // Controller chỉ nhận ID trong path, không nhận body cho togglePillCheckIn
      const response = await apiClient.put(`/contraceptive/${scheduleId}/checkIn`, { date: dateString }); // Gửi ngày trong body dù controller không xử lý
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default pillReminderService; 
/**
 * questionService.js
 *
 * Service cho việc quản lý câu hỏi từ khách hàng
 */

import apiClient from "./api";

const questionService = {
  /**
   * Lấy danh sách tất cả câu hỏi
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllQuestions: async () => {
    try {
      const response = await apiClient.get("/admin/questions");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch questions");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy thông tin chi tiết một câu hỏi
   * @param {number} id ID của câu hỏi
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getQuestionById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/questions/${id}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch question details"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Trả lời câu hỏi
   * @param {number} id ID của câu hỏi
   * @param {Object} responseData Dữ liệu câu trả lời
   * @returns {Promise} Promise chứa kết quả từ API
   */
  answerQuestion: async (id, responseData) => {
    try {
      const response = await apiClient.post(
        `/admin/questions/${id}/answer`,
        responseData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to answer question");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error answering question ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Đánh dấu câu hỏi đã giải quyết
   * @param {number} id ID của câu hỏi
   * @returns {Promise} Promise chứa kết quả từ API
   */
  markAsResolved: async (id) => {
    try {
      const response = await apiClient.put(`/admin/questions/${id}/resolve`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to mark question as resolved"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error resolving question ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy danh sách câu hỏi theo trạng thái
   * @param {string} status Trạng thái câu hỏi (pending, answered, resolved)
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getQuestionsByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/admin/questions?status=${status}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch questions by status"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching questions with status ${status}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

export default questionService;

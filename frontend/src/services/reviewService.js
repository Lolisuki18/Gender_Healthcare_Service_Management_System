/**
 * reviewService.js
 *
 * Service cho việc quản lý đánh giá
 */

import apiClient from "./api";

const reviewService = {
  /**
   * Lấy danh sách tất cả đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllReviews: async () => {
    try {
      const response = await apiClient.get("/admin/reviews");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch reviews");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy thông tin chi tiết một đánh giá
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getReviewById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/reviews/${id}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch review details"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Phản hồi đánh giá
   * @param {number} id ID của đánh giá
   * @param {Object} responseData Dữ liệu phản hồi
   * @returns {Promise} Promise chứa kết quả từ API
   */
  respondToReview: async (id, responseData) => {
    try {
      const response = await apiClient.post(
        `/admin/reviews/${id}/respond`,
        responseData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to respond to review");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error responding to review ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Duyệt đánh giá
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  approveReview: async (id) => {
    try {
      const response = await apiClient.put(`/admin/reviews/${id}/approve`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to approve review");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error approving review ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Từ chối đánh giá
   * @param {number} id ID của đánh giá
   * @param {Object} rejectData Dữ liệu từ chối
   * @returns {Promise} Promise chứa kết quả từ API
   */
  rejectReview: async (id, rejectData) => {
    try {
      const response = await apiClient.put(
        `/admin/reviews/${id}/reject`,
        rejectData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reject review");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error rejecting review ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy đánh giá theo dịch vụ
   * @param {number} serviceId ID của dịch vụ
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getReviewsByService: async (serviceId) => {
    try {
      const response = await apiClient.get(
        `/admin/services/${serviceId}/reviews`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch service reviews"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching reviews for service ${serviceId}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

export default reviewService;

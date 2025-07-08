/**
 * reviewService.js
 *
 * Service cho việc quản lý đánh giá (Rating) - Map với backend Spring Boot
 * 
 * CẤURÚC PHÂN CHIA THEO ROLE:
 * 
 * 1. CUSTOMER APIS - Dành cho customer đã đăng nhập
 *    - Tạo đánh giá (consultant, STI service, STI package)
 *    - Xem, sửa, xóa đánh giá của mình
 *    - Kiểm tra eligibility đánh giá
 * 
 * 2. PUBLIC APIS - Không cần authentication
 *    - Xem đánh giá công khai
 *    - Xem rating summary
 *    - Lấy testimonials
 * 
 * 3. STAFF/ADMIN APIS - Dành cho Staff và Admin
 *    - Quản lý tất cả đánh giá
 *    - Reply/Update/Delete reply
 *    - Xem statistics
 * 
 * 4. LEGACY METHODS - Backward compatibility (deprecated)
 */

import apiClient from "./api";

const reviewService = {
  
  // ===================== CUSTOMER APIS =====================
  // APIs dành cho customer đã đăng nhập (role CUSTOMER)
  // Các API này yêu cầu token authentication với role customer
  // ===================== CUSTOMER APIS =====================
  // APIs dành cho customer đã đăng nhập

  /**
   * [CUSTOMER] Tạo đánh giá mới từ customer cho consultant
   * @param {number} consultantId ID của consultant
   * @param {Object} reviewData Dữ liệu đánh giá {rating, comment, consultationId}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createConsultantReview: async (consultantId, reviewData) => {
    try {
      // Validation đầu vào
      if (!consultantId || isNaN(parseInt(consultantId))) {
        throw new Error("Invalid consultantId provided");
      }
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        throw new Error("Comment is required and cannot be empty");
      }

      const requestBody = {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim()
      };
      
      // Thêm consultationId nếu có
      if (reviewData.consultationId) {
        requestBody.consultationId = parseInt(reviewData.consultationId);
      }
      
      const response = await apiClient.post(`/ratings/consultant/${consultantId}`, requestBody);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create review");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Tạo đánh giá mới cho STI Service theo format backend mới
   * @param {number} serviceId ID của STI service
   * @param {Object} reviewData Dữ liệu đánh giá {rating, comment, stiTestId}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createSTIServiceReview: async (serviceId, reviewData) => {
    try {
      // Validation đầu vào
      if (!serviceId || isNaN(parseInt(serviceId))) {
        throw new Error("Invalid serviceId provided");
      }
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        throw new Error("Comment is required and cannot be empty");
      }

      const requestBody = {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim()
      };
      
      // Thêm stiTestId nếu có
      if (reviewData.stiTestId) {
        requestBody.stiTestId = parseInt(reviewData.stiTestId);
      }
      
      const response = await apiClient.post(`/ratings/sti-service/${serviceId}`, requestBody);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create review");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Tạo đánh giá mới cho STI Package
   * @param {number} packageId ID của STI package
   * @param {Object} reviewData Dữ liệu đánh giá {rating, comment, stiTestId}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createSTIPackageReview: async (packageId, reviewData) => {
    try {
      // Validation đầu vào
      if (!packageId || isNaN(parseInt(packageId))) {
        throw new Error("Invalid packageId provided");
      }
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        throw new Error("Comment is required and cannot be empty");
      }

      const requestBody = {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim()
      };
      
      // Thêm stiTestId nếu có
      if (reviewData.stiTestId) {
        requestBody.stiTestId = parseInt(reviewData.stiTestId);
      }
      
      const response = await apiClient.post(`/ratings/sti-package/${packageId}`, requestBody);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create review");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Tạo đánh giá chung (generic method) - Auto-detect endpoint
   * @param {Object} reviewData Dữ liệu đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createReview: async (reviewData) => {
    try {
      // Determine which endpoint to use based on serviceType or fallback to serviceId
      const { serviceType, serviceId, consultantId, packageId, ...data } = reviewData;
      
      let response;
      if (consultantId) {
        response = await reviewService.createConsultantReview(consultantId, data);
      } else if (packageId) {
        response = await reviewService.createSTIPackageReview(packageId, data);
      } else if (serviceId) {
        response = await reviewService.createSTIServiceReview(serviceId, data);
      } else {
        throw new Error("Missing required ID (consultantId, serviceId, or packageId)");
      }
      
      return response;
    } catch (error) {
      console.error("Error creating review:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Lấy đánh giá của customer hiện tại
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng items per page
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getMyReviews: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`/ratings/my-ratings?page=${page}&size=${size}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch my reviews");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Cập nhật đánh giá của customer
   * @param {number} id ID của đánh giá
   * @param {Object} reviewData Dữ liệu đánh giá cập nhật {rating, comment}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateReview: async (id, reviewData) => {
    try {
      const response = await apiClient.put(`/ratings/${id}`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update review");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Xóa đánh giá của customer
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteReview: async (id) => {
    try {
      const response = await apiClient.delete(`/ratings/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete review");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Xóa đánh giá của customer
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteReview: async (id) => {
    try {
      const response = await apiClient.delete(`/ratings/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete review");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Kiểm tra có thể đánh giá không
   * @param {string} targetType - Loại target (CONSULTANT, STI_SERVICE, STI_PACKAGE)
   * @param {number} targetId - ID của target
   * @returns {Promise} Promise chứa kết quả từ API
   */
  canRate: async (targetType, targetId) => {
    try {
      const response = await apiClient.get(`/ratings/can-rate/${targetType}/${targetId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to check rating eligibility");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Kiểm tra điều kiện đánh giá cho STI Service
   * @param {number} serviceId ID của STI service
   * @returns {Promise} Promise chứa thông tin điều kiện
   */
  checkSTIServiceEligibility: async (serviceId) => {
    try {
      const response = await apiClient.get(`/ratings/can-rate/STI_SERVICE/${serviceId}`);
      return response.data;
    } catch (error) {
      // Nếu API không tồn tại, trả về thông tin mặc định
      if (error.response?.status === 404) {
        return { eligible: true, message: "Eligibility check not available" };
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CUSTOMER] Kiểm tra điều kiện đánh giá cho Consultant
   * @param {number} consultantId ID của consultant
   * @returns {Promise} Promise chứa thông tin điều kiện
   */
  checkConsultantEligibility: async (consultantId) => {
    try {
      const response = await apiClient.get(`/ratings/can-rate/CONSULTANT/${consultantId}`);
      return response.data;
    } catch (error) {
      // Nếu API không tồn tại, trả về thông tin mặc định
      if (error.response?.status === 404) {
        return { eligible: true, message: "Eligibility check not available" };
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===================== PUBLIC APIS =====================
  // APIs công khai, không cần authentication
  // Các API này có thể được gọi từ bất kỳ đâu mà không cần token

  /**
   * [PUBLIC] Lấy thông tin chi tiết một đánh giá
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getReviewById: async (id) => {
    try {
      const response = await apiClient.get(`/ratings/${id}`);
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
   * [PUBLIC] Lấy đánh giá của consultant
   * @param {number} consultantId - ID của consultant
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng items per page
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo rating
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getConsultantReviews: async (consultantId, page = 0, size = 10, sort = "newest", filterRating = null, keyword = null) => {
    try {
      let url = `/ratings/consultant/${consultantId}?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      
      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch consultant reviews");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching consultant reviews:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [PUBLIC] Lấy đánh giá của STI service
   * @param {number} serviceId - ID của STI service
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng items per page
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo rating
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIServiceReviews: async (serviceId, page = 0, size = 10, sort = "newest", filterRating = null, keyword = null) => {
    try {
      let url = `/ratings/sti-service/${serviceId}?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      
      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch STI service reviews");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching STI service reviews:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [PUBLIC] Lấy đánh giá của STI package
   * @param {number} packageId - ID của STI package
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng items per page
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo rating
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIPackageReviews: async (packageId, page = 0, size = 10, sort = "newest", filterRating = null, keyword = null) => {
    try {
      let url = `/ratings/sti-package/${packageId}?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      
      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch STI package reviews");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching STI package reviews:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [PUBLIC] Lấy tổng hợp đánh giá của consultant
   * @param {number} consultantId - ID của consultant
   * @param {boolean} includeRecentReviews - Có bao gồm reviews gần đây không
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getConsultantRatingSummary: async (consultantId, includeRecentReviews = false) => {
    try {
      const response = await apiClient.get(`/ratings/summary/consultant/${consultantId}?includeRecentReviews=${includeRecentReviews}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch consultant rating summary");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching consultant rating summary:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [PUBLIC] Lấy tổng hợp đánh giá của STI service
   * @param {number} serviceId - ID của STI service
   * @param {boolean} includeRecentReviews - Có bao gồm reviews gần đây không
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIServiceRatingSummary: async (serviceId, includeRecentReviews = false) => {
    try {
      const response = await apiClient.get(`/ratings/summary/sti-service/${serviceId}?includeRecentReviews=${includeRecentReviews}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch STI service rating summary");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching STI service rating summary:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [PUBLIC] Lấy tổng hợp đánh giá của STI package
   * @param {number} packageId - ID của STI package
   * @param {boolean} includeRecentReviews - Có bao gồm reviews gần đây không
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIPackageRatingSummary: async (packageId, includeRecentReviews = false) => {
    try {
      const response = await apiClient.get(`/ratings/summary/sti-package/${packageId}?includeRecentReviews=${includeRecentReviews}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch STI package rating summary");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching STI package rating summary:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [PUBLIC] Lấy testimonials cho homepage
   * @param {number} limit - Số lượng testimonials
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getTestimonials: async (limit = 5) => {
    try {
      const response = await apiClient.get(`/ratings/testimonials?limit=${limit}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch testimonials");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===================== STAFF/ADMIN APIS =====================
  // APIs dành cho Staff và Admin (cần role STAFF hoặc ADMIN)
  // Các API này yêu cầu token với quyền staff/admin

  /**
   * [STAFF/ADMIN] Lấy danh sách tất cả đánh giá
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng items per page
   * @param {string} sort - Sắp xếp (newest, oldest, highest, lowest)
   * @param {number} filterRating - Lọc theo rating (1-5)
   * @param {string} keyword - Tìm kiếm theo keyword
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllReviews: async (page = 0, size = 20, sort = "newest", filterRating = null, keyword = null) => {
    try {
      let url = `/ratings/staff/all?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      
      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch all reviews");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [STAFF/ADMIN] Lấy statistics tổng quan
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getRatingStatistics: async () => {
    try {
      const response = await apiClient.get(`/ratings/staff/statistics`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch rating statistics");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching rating statistics:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [STAFF] Lấy tất cả consultation ratings
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng items per page
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo rating
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getConsultationReviews: async (page = 0, size = 20, sort = "newest", filterRating = null, keyword = null) => {
    try {
      let url = `/ratings/staff/consultation?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      
      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch consultation reviews");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching consultation reviews:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [STAFF] Reply to rating
   * @param {number} ratingId - ID của rating
   * @param {Object} replyData - Dữ liệu reply {reply}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  replyToRating: async (ratingId, replyData) => {
    try {
      const response = await apiClient.post(`/ratings/staff/reply/${ratingId}`, {
        reply: replyData.reply
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reply to rating");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error replying to rating ${ratingId}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [STAFF] Update reply
   * @param {number} ratingId - ID của rating
   * @param {Object} replyData - Dữ liệu reply {reply}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateStaffReply: async (ratingId, replyData) => {
    try {
      const response = await apiClient.put(`/ratings/staff/reply/${ratingId}`, {
        reply: replyData.reply
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update staff reply");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error updating staff reply ${ratingId}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [STAFF] Delete reply
   * @param {number} ratingId - ID của rating
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteStaffReply: async (ratingId) => {
    try {
      const response = await apiClient.delete(`/ratings/staff/reply/${ratingId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete staff reply");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting staff reply ${ratingId}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===================== LEGACY METHODS (for backward compatibility) =====================

  /**
   * @deprecated Use specific methods instead
   */
  getReviewsByService: async (serviceId) => {
    return await reviewService.getSTIServiceReviews(serviceId);
  },

  /**
   * @deprecated Use replyToRating instead
   */
  respondToReview: async (id, responseData) => {
    return await reviewService.replyToRating(id, responseData);
  },

  /**
   * @deprecated Use staff methods instead
   */
  approveReview: async (id) => {
    console.warn("approveReview is deprecated - ratings are auto-approved");
    return { success: true, message: "Rating approval not needed" };
  },

  /**
   * @deprecated Use deleteReview instead
   */
  rejectReview: async (id, rejectData) => {
    return await reviewService.deleteReview(id);
  },
};

export default reviewService;

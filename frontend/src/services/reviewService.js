/**
 * reviewService.js
 *
 * Dịch vụ quản lý đánh giá (Rating) - Kết nối với backend Spring Boot
 *
 * CẤU TRÚC PHÂN CHIA THEO VAI TRÒ:
 *
 * 1. API KHÁCH HÀNG - Dành cho khách hàng đã đăng nhập
 *    - Tạo đánh giá (tư vấn viên, dịch vụ STI, gói STI)
 *    - Xem, sửa, xóa đánh giá của mình
 *    - Kiểm tra điều kiện đánh giá
 *
 * 2. API CÔNG KHAI - Không cần xác thực
 *    - Xem đánh giá công khai
 *    - Xem tổng kết đánh giá
 *    - Lấy lời chứng thực
 *
 * 3. API NHÂN VIÊN/QUẢN TRỊ - Dành cho Nhân viên và Quản trị viên
 *    - Quản lý tất cả đánh giá
 *    - Trả lời/Cập nhật/Xóa phản hồi
 *    - Xem thống kê
 *
 * 4. PHƯƠNG THỨC CŨ - Tương thích ngược (không được khuyến khích)
 */

import apiClient from './api';

const reviewService = {
  // ===================== API KHÁCH HÀNG =====================
  // API dành cho khách hàng đã đăng nhập (vai trò KHÁCH HÀNG)
  // Các API này yêu cầu xác thực token với vai trò khách hàng
  // ===================== API KHÁCH HÀNG =====================
  // API dành cho khách hàng đã đăng nhập

  /**
   * [KHÁCH HÀNG] Tạo đánh giá mới từ khách hàng cho tư vấn viên
   * @param {number} consultantId ID của tư vấn viên
   * @param {Object} reviewData Dữ liệu đánh giá {rating, comment, consultationId}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createConsultantReview: async (consultantId, reviewData) => {
    try {
      // Xác thực dữ liệu đầu vào
      if (!consultantId || isNaN(parseInt(consultantId))) {
        throw new Error('ID tư vấn viên không hợp lệ');
      }
      if (
        !reviewData.rating ||
        reviewData.rating < 1 ||
        reviewData.rating > 5
      ) {
        throw new Error('Đánh giá phải từ 1 đến 5 sao');
      }
      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        throw new Error('Bình luận là bắt buộc và không được để trống');
      }

      // Chuẩn bị dữ liệu đánh giá theo format yêu cầu (đơn giản)
      const requestBody = {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim(),
      };
      // Nếu có consultationId thì thêm vào body và log ra
      if (reviewData.consultationId) {
        requestBody.consultationId = reviewData.consultationId;
        console.log('[LOG][reviewService] consultationId gửi lên:', reviewData.consultationId);
      } else {
        console.warn('[WARN][reviewService] consultationId không tồn tại trong reviewData:', reviewData);
      }

      // Log toàn bộ requestBody trước khi gửi
      console.log('[LOG][reviewService] requestBody gửi lên backend:', requestBody);

      // URL mới theo yêu cầu: http://localhost:8080/ratings/consultant/24
      const response = await apiClient.post(
        `/ratings/consultant/${consultantId}`,
        requestBody
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể tạo đánh giá');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Tạo đánh giá mới cho Dịch vụ STI theo định dạng backend mới
   * @param {number} serviceId ID của dịch vụ STI
   * @param {Object} reviewData Dữ liệu đánh giá {rating, comment, stiTestId}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createSTIServiceReview: async (serviceId, reviewData) => {
    try {
      // Xác thực dữ liệu đầu vào
      if (!serviceId || isNaN(parseInt(serviceId))) {
        throw new Error('ID dịch vụ không hợp lệ');
      }
      if (
        !reviewData.rating ||
        reviewData.rating < 1 ||
        reviewData.rating > 5
      ) {
        throw new Error('Đánh giá phải từ 1 đến 5 sao');
      }
      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        throw new Error('Bình luận là bắt buộc và không được để trống');
      }

      const requestBody = {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim(),
      };
      // Nếu có sti_test_id thì thêm vào body và log ra
      if (reviewData.sti_test_id) {
        requestBody.sti_test_id = reviewData.sti_test_id;
        console.log('[LOG][reviewService] sti_test_id gửi lên:', reviewData.sti_test_id);
      } else {
        console.warn('[WARN][reviewService] sti_test_id không tồn tại trong reviewData:', reviewData);
      }

      // Log toàn bộ requestBody trước khi gửi
      console.log('[LOG][reviewService] requestBody gửi lên backend:', requestBody);

      const response = await apiClient.post(
        `/ratings/sti-service/${serviceId}`,
        requestBody
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể tạo đánh giá');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Tạo đánh giá mới cho Gói STI
   * @param {number} packageId ID của gói STI
   * @param {Object} reviewData Dữ liệu đánh giá {rating, comment, stiTestId}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createSTIPackageReview: async (packageId, reviewData) => {
    try {
      // Xác thực dữ liệu đầu vào
      if (!packageId || isNaN(parseInt(packageId))) {
        throw new Error('ID gói không hợp lệ');
      }
      if (
        !reviewData.rating ||
        reviewData.rating < 1 ||
        reviewData.rating > 5
      ) {
        throw new Error('Đánh giá phải từ 1 đến 5 sao');
      }
      if (!reviewData.comment || reviewData.comment.trim().length === 0) {
        throw new Error('Bình luận là bắt buộc và không được để trống');
      }

      const requestBody = {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim(),
      };

      const response = await apiClient.post(
        `/ratings/sti-package/${packageId}`,
        requestBody
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể tạo đánh giá');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Tạo đánh giá chung (phương thức tổng quát) - Tự động phát hiện endpoint
   * @param {Object} reviewData Dữ liệu đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createReview: async (reviewData) => {
    try {
      // Xác định endpoint nào sử dụng dựa trên serviceType hoặc fallback về serviceId
      const { serviceType, serviceId, consultantId, packageId, ...data } =
        reviewData;

      let response;
      if (consultantId) {
        response = await reviewService.createConsultantReview(
          consultantId,
          data
        );
      } else if (packageId) {
        response = await reviewService.createSTIPackageReview(packageId, data);
      } else if (serviceId) {
        response = await reviewService.createSTIServiceReview(serviceId, data);
      } else {
        throw new Error(
          'Thiếu ID bắt buộc (consultantId, serviceId, hoặc packageId)'
        );
      }

      return response;
    } catch (error) {
      console.error('Lỗi tạo đánh giá:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Lấy đánh giá của khách hàng hiện tại
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getMyReviews: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(
        `/ratings/my-ratings?page=${page}&size=${size}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá của tôi'
        );
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Cập nhật đánh giá của khách hàng
   * @param {number} id ID của đánh giá
   * @param {Object} reviewData Dữ liệu đánh giá cập nhật {rating, comment}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateReview: async (id, reviewData) => {
    try {
      // Kiểm tra id hợp lệ, phải là số
      if (isNaN(parseInt(id))) {
        throw new Error('ID đánh giá không hợp lệ. ID phải là một số.');
      }

      const response = await apiClient.put(`/ratings/${id}`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể cập nhật đánh giá');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Xóa đánh giá của khách hàng
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteReview: async (id) => {
    try {
      const response = await apiClient.delete(`/ratings/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể xóa đánh giá');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Kiểm tra có thể đánh giá không
   * @param {string} targetType - Loại đối tượng (CONSULTANT, STI_SERVICE, STI_PACKAGE)
   * @param {number} targetId - ID của đối tượng
   * @returns {Promise} Promise chứa kết quả từ API
   */
  canRate: async (targetType, targetId) => {
    try {
      const response = await apiClient.get(
        `/ratings/can-rate/${targetType}/${targetId}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể kiểm tra điều kiện đánh giá'
        );
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Kiểm tra điều kiện đánh giá cho Dịch vụ STI
   * @param {number} serviceId ID của dịch vụ STI
   * @returns {Promise} Promise chứa thông tin điều kiện
   */
  checkSTIServiceEligibility: async (serviceId) => {
    try {
      const response = await apiClient.get(
        `/ratings/can-rate/STI_SERVICE/${serviceId}`
      );
      return response.data;
    } catch (error) {
      // Nếu API không tồn tại, trả về thông tin mặc định
      if (error.response?.status === 404) {
        return { eligible: true, message: 'Kiểm tra điều kiện không khả dụng' };
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [KHÁCH HÀNG] Kiểm tra điều kiện đánh giá cho Tư vấn viên
   * @param {number} consultantId ID của tư vấn viên
   * @returns {Promise} Promise chứa thông tin điều kiện
   */
  checkConsultantEligibility: async (consultantId) => {
    try {
      const response = await apiClient.get(
        `/ratings/can-rate/CONSULTANT/${consultantId}`
      );
      return response.data;
    } catch (error) {
      // Nếu API không tồn tại, trả về thông tin mặc định
      if (error.response?.status === 404) {
        return { eligible: true, message: 'Kiểm tra điều kiện không khả dụng' };
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===================== API CÔNG KHAI =====================
  // API công khai, không cần xác thực
  // Các API này có thể được gọi từ bất kỳ đâu mà không cần token

  /**
   * [CÔNG KHAI] Lấy thông tin chi tiết một đánh giá
   * @param {number} id ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getReviewById: async (id) => {
    try {
      const response = await apiClient.get(`/ratings/${id}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy chi tiết đánh giá'
        );
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy đánh giá của tư vấn viên
   * @param {number} consultantId - ID của tư vấn viên
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo đánh giá
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getConsultantReviews: async (
    consultantId,
    page = 0,
    size = 10,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/consultant/${consultantId}?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá tư vấn viên'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy đánh giá tư vấn viên:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy đánh giá của dịch vụ STI
   * @param {number} serviceId - ID của dịch vụ STI
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo đánh giá
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIServiceReviews: async (
    serviceId,
    page = 0,
    size = 10,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/sti-service/${serviceId}?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá dịch vụ STI'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy đánh giá dịch vụ STI:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy đánh giá của gói STI
   * @param {number} packageId - ID của gói STI
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo đánh giá
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIPackageReviews: async (
    packageId,
    page = 0,
    size = 10,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/sti-package/${packageId}?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá gói STI'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy đánh giá gói STI:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy tổng hợp đánh giá của tư vấn viên
   * @param {number} consultantId - ID của tư vấn viên
   * @param {boolean} includeRecentReviews - Có bao gồm đánh giá gần đây không
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getConsultantRatingSummary: async (
    consultantId,
    includeRecentReviews = false
  ) => {
    try {
      const response = await apiClient.get(
        `/ratings/summary/consultant/${consultantId}?includeRecentReviews=${includeRecentReviews}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy tổng hợp đánh giá tư vấn viên'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy tổng hợp đánh giá tư vấn viên:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy tổng hợp đánh giá của dịch vụ STI
   * @param {number} serviceId - ID của dịch vụ STI
   * @param {boolean} includeRecentReviews - Có bao gồm đánh giá gần đây không
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIServiceRatingSummary: async (
    serviceId,
    includeRecentReviews = false
  ) => {
    try {
      const response = await apiClient.get(
        `/ratings/summary/sti-service/${serviceId}?includeRecentReviews=${includeRecentReviews}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy tổng hợp đánh giá dịch vụ STI'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy tổng hợp đánh giá dịch vụ STI:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy tổng hợp đánh giá của gói STI
   * @param {number} packageId - ID của gói STI
   * @param {boolean} includeRecentReviews - Có bao gồm đánh giá gần đây không
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIPackageRatingSummary: async (
    packageId,
    includeRecentReviews = false
  ) => {
    try {
      const response = await apiClient.get(
        `/ratings/summary/sti-package/${packageId}?includeRecentReviews=${includeRecentReviews}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy tổng hợp đánh giá gói STI'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy tổng hợp đánh giá gói STI:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [CÔNG KHAI] Lấy lời chứng thực cho trang chủ
   * @param {number} limit - Số lượng lời chứng thực
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getTestimonials: async (limit = 5) => {
    try {
      const response = await apiClient.get(
        `/ratings/testimonials?limit=${limit}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy lời chứng thực'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi lấy lời chứng thực:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===================== API NHÂN VIÊN/QUẢN TRỊ =====================
  // API dành cho Nhân viên và Quản trị viên (cần vai trò STAFF hoặc ADMIN)
  // Các API này yêu cầu token với quyền nhân viên/quản trị viên

  /**
   * [NHÂN VIÊN/QUẢN TRỊ] Lấy danh sách tất cả đánh giá
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp (newest, oldest, highest, lowest)
   * @param {number} filterRating - Lọc theo đánh giá (1-5)
   * @param {string} keyword - Tìm kiếm theo từ khóa
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllReviews: async (
    page = 0,
    size = 20,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/staff/all?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy tất cả đánh giá'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi lấy tất cả đánh giá:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [NHÂN VIÊN] Lấy tất cả đánh giá tư vấn
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo đánh giá
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getConsultationReviews: async (
    page = 0,
    size = 20,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/staff/consultation?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá tư vấn'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi lấy đánh giá tư vấn:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [NHÂN VIÊN] Lấy tất cả đánh giá STI Service
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo đánh giá
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIServiceReviewsForStaff: async (
    page = 0,
    size = 20,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/staff/sti-service?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá dịch vụ STI'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi lấy đánh giá dịch vụ STI:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [NHÂN VIÊN] Lấy tất cả đánh giá STI Package
   * @param {number} page - Trang hiện tại
   * @param {number} size - Số lượng mục trên mỗi trang
   * @param {string} sort - Sắp xếp
   * @param {number} filterRating - Lọc theo đánh giá
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getSTIPackageReviewsForStaff: async (
    page = 0,
    size = 20,
    sort = 'newest',
    filterRating = null,
    keyword = null
  ) => {
    try {
      let url = `/ratings/staff/sti-package?page=${page}&size=${size}&sort=${sort}`;
      if (filterRating) url += `&filterRating=${filterRating}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

      const response = await apiClient.get(url);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Không thể lấy đánh giá gói STI'
        );
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi lấy đánh giá gói STI:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [NHÂN VIÊN] Tạo phản hồi mới cho đánh giá
   * @param {number} ratingId - ID của đánh giá
   * @param {Object} replyData - Dữ liệu phản hồi {staffReply}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createReply: async (ratingId, replyData) => {
    try {
      const response = await apiClient.post(
        `/ratings/staff/reply/${ratingId}`,
        replyData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể tạo phản hồi');
      }
      return response.data;
    } catch (error) {
      console.error('Lỗi tạo phản hồi đánh giá:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [NHÂN VIÊN] Cập nhật phản hồi đánh giá hiện có
   * @param {number} ratingId - ID của đánh giá
   * @param {Object} replyData - Dữ liệu phản hồi cập nhật {staffReply}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateReply: async (ratingId, replyData) => {
    try {
      const response = await apiClient.put(
        `/ratings/staff/reply/${ratingId}`,
        replyData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể cập nhật phản hồi');
      }
      return response.data;
    } catch (error) {
      console.error('Lỗi cập nhật phản hồi đánh giá:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * [NHÂN VIÊN] Trả lời đánh giá (phương thức tổng quát - tự động phát hiện tạo mới hoặc cập nhật)
   * @param {number} ratingId - ID của đánh giá
   * @param {Object} replyData - Dữ liệu phản hồi {staffReply}
   * @param {boolean} isUpdate - True nếu là cập nhật, false nếu là tạo mới
   * @returns {Promise} Promise chứa kết quả từ API
   */
  replyToRating: async (ratingId, replyData, isUpdate = false) => {
    try {
      if (isUpdate) {
        return await reviewService.updateReply(ratingId, replyData);
      } else {
        return await reviewService.createReply(ratingId, replyData);
      }
    } catch (error) {
      console.error('Lỗi phản hồi đánh giá:', error);
      throw error;
    }
  },

  /**
   * [NHÂN VIÊN] Cập nhật phản hồi đánh giá (alias cho tương thích ngược)
   * @param {number} ratingId - ID của đánh giá
   * @param {Object} replyData - Dữ liệu phản hồi cập nhật {staffReply}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateStaffReply: async (ratingId, replyData) => {
    return await reviewService.updateReply(ratingId, replyData);
  },

  /**
   * [NHÂN VIÊN] Xóa phản hồi đánh giá
   * @param {number} ratingId - ID của đánh giá
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteStaffReply: async (ratingId) => {
    try {
      const response = await apiClient.delete(
        `/ratings/staff/reply/${ratingId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể xóa phản hồi');
      }
      return response.data;
    } catch (error) {
      console.error('Lỗi xóa phản hồi đánh giá:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===================== PHƯƠNG THỨC CŨ (để tương thích ngược) =====================

  /**
   * @deprecated Sử dụng các phương thức cụ thể thay thế
   */
  getReviewsByService: async (serviceId) => {
    return await reviewService.getSTIServiceReviews(serviceId);
  },

  /**
   * @deprecated Sử dụng replyToRating thay thế
   */
  respondToReview: async (id, responseData) => {
    return await reviewService.replyToRating(id, responseData);
  },

  /**
   * @deprecated Sử dụng các phương thức nhân viên thay thế
   */
  approveReview: async (id) => {
    console.warn('approveReview đã lỗi thời - đánh giá được tự động phê duyệt');
    return { success: true, message: 'Không cần phê duyệt đánh giá' };
  },

  /**
   * @deprecated Sử dụng deleteReview thay thế
   */
  rejectReview: async (id, rejectData) => {
    return await reviewService.deleteReview(id);
  },
};

export default reviewService;

/**
 * blogService.js
 *
 * Service cho việc quản lý blog
 */

import apiClient from './api';

const blogService = {
  /**
   * Lấy danh sách tất cả bài viết blog
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get('/blog');
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch blogs');
      }
      return response.data.data?.content || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy thông tin chi tiết một bài viết
   * @param {number} id ID của bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getBlogById: async (id) => {
    try {
      const response = await apiClient.get(`/blog/${id}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch blog details'
        );
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Tạo bài viết mới
   * @param {FormData} formData Dữ liệu bài viết với file uploads
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createBlog: async (formData) => {
    try {
      const response = await apiClient.post('/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create blog');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Cập nhật thông tin bài viết
   * @param {number} id ID của bài viết
   * @param {FormData} formData Dữ liệu cập nhật với file uploads
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateBlog: async (id, formData) => {
    try {
      const response = await apiClient.put(`/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update blog');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Xóa bài viết
   * @param {number} id ID của bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteBlog: async (id) => {
    try {
      const response = await apiClient.delete(`/blog/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete blog');
      }
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Cập nhật trạng thái bài viết
   * @param {number} id ID của bài viết
   * @param {Object} statusData Dữ liệu trạng thái {status, rejectionReason?}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateBlogStatus: async (id, statusData) => {
    try {
      const response = await apiClient.put(`/blog/${id}/status`, statusData);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to update blog status'
        );
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===== CÁC CHỨC NĂNG MỚI THÊM VÀO =====

  /**
   * Lấy tất cả bài viết với phân trang (cho public)
   * @param {Object} params - Tham số query (page, size, sortBy, sortDir)
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getPublicBlogs: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'desc',
      } = params;
      const response = await apiClient.get('/blog', {
        params: { page, size, sortBy, sortDir },
        skipAuthInterceptor: true, // Bypass authentication cho public API
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch public blogs'
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy chi tiết bài viết (cho public)
   * @param {number} id - ID của bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getPublicBlogById: async (id) => {
    try {
      const response = await apiClient.get(`/blog/${id}`, {
        skipAuthInterceptor: true, // Bypass authentication cho public API
      });
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch blog details'
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Tạo bài viết mới với file upload
   * @param {FormData} formData - Form data chứa blog data và files
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createBlogWithFiles: async (formData) => {
    try {
      const response = await apiClient.post('/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create blog');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Cập nhật bài viết với file upload
   * @param {number} id - ID của bài viết
   * @param {FormData} formData - Form data chứa blog data và files
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateBlogWithFiles: async (id, formData) => {
    try {
      const response = await apiClient.put(`/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update blog');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Xóa bài viết (user)
   * @param {number} id - ID của bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteUserBlog: async (id) => {
    try {
      const response = await apiClient.delete(`/blog/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete blog');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy bài viết theo trạng thái
   * @param {string} status - Trạng thái (DRAFT, PENDING, CONFIRMED, REJECTED)
   * @param {Object} params - Tham số query
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getBlogsByStatus: async (status, params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'desc',
      } = params;
      const response = await apiClient.get(`/blog/status/${status}`, {
        params: { page, size, sortBy, sortDir },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch blogs by status'
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy bài viết của tôi
   * @param {Object} params - Tham số query
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getMyBlogs: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'desc',
      } = params;
      const response = await apiClient.get('/blog/my-posts', {
        params: { page, size, sortBy, sortDir },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch my blogs');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy bài viết theo danh mục
   * @param {number} categoryId - ID danh mục
   * @param {Object} params - Tham số query
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getBlogsByCategory: async (categoryId, params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'desc',
      } = params;

      // Đảm bảo categoryId là số hợp lệ
      if (!categoryId || isNaN(parseInt(categoryId))) {
        throw new Error('Category ID không hợp lệ');
      }

      // Sửa URL endpoint đúng
      const response = await apiClient.get(`/blog/category/${categoryId}`, {
        params: { page, size, sortBy, sortDir },
      });

      // // Log response để debug
      // console.log(`GET /blog/category/${categoryId} response:`, response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch blogs by category'
        );
      }
      return response.data;
    } catch (error) {
      // Trả về object tương thích với code xử lý trong BlogDetailPage
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Không thể lấy danh sách bài viết theo chuyên mục',
        error,
      };
    }
  },

  /**
   * Tìm kiếm bài viết
   * @param {string} query - Từ khóa tìm kiếm
   * @param {Object} params - Tham số query
   * @returns {Promise} Promise chứa kết quả từ API
   */
  searchBlogs: async (query, params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'desc',
        categoryId,
      } = params;

      const searchParams = { query, page, size, sortBy, sortDir };
      if (categoryId) {
        searchParams.categoryId = categoryId;
      }

      const response = await apiClient.get('/blog/search', {
        params: searchParams,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search blogs');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy bài viết mới nhất
   * @param {number} limit - Số lượng bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getLatestBlogs: async (limit = 3) => {
    try {
      const response = await apiClient.get('/blog/latest', {
        params: { limit },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch latest blogs'
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy tất cả blog với phân trang (dành cho Admin/Staff)
   * @param {Object} params - Tham số query (page, size, sortBy, sortDir)
   * @returns {Promise} Promise chứa kết quả từ API (dạng Page)
   */
  getAllBlogsPaginated: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'desc',
      } = params;
      const response = await apiClient.get('/blog', {
        params: { page, size, sortBy, sortDir },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch blogs');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy tất cả bài viết có trạng thái CONFIRMED cho dashboard
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllConfirmedBlogs: async () => {
    try {
      const response = await apiClient.get('/blog/status/CONFIRMED');
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch confirmed blogs'
        );
      }
      return response.data.data?.content || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // ===== HELPER FUNCTIONS =====

  /**
   * Tạo FormData cho việc tạo/cập nhật blog post
   * @param {Object} blogData - Dữ liệu blog
   * @param {File} thumbnailFile - File thumbnail
   * @param {Array} sectionFiles - Array các file ảnh cho sections
   * @returns {FormData} FormData object để gửi lên server
   */
  createBlogFormData: (blogData, thumbnailFile, sectionFiles = []) => {
    const formData = new FormData();

    // Thêm request data (JSON)
    const requestData = {
      title: blogData.title,
      description: blogData.description,
      content: blogData.content,
      categoryId: blogData.categoryId,
      tags: blogData.tags || [],
      sections: blogData.sections || [],
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(requestData)], {
        type: 'application/json',
      })
    );

    // Thêm thumbnail
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    // Thêm section images
    if (sectionFiles && sectionFiles.length > 0) {
      const validFiles = [];
      const validIndexes = [];

      sectionFiles.forEach((fileData, index) => {
        if (fileData && fileData.file) {
          validFiles.push(fileData.file);
          validIndexes.push(fileData.sectionIndex || index);
        }
      });

      validFiles.forEach((file) => {
        formData.append('sectionImages', file);
      });

      validIndexes.forEach((index) => {
        formData.append('sectionImageIndexes', index);
      });
    }

    return formData;
  },

  /**
   * Helper function để format blog data từ API response
   * @param {Object} blogResponse - Response từ API
   * @returns {Object} Formatted blog data
   */
  formatBlogData: (blogResponse) => {
    if (!blogResponse) return null;
    let category = null;
    if (blogResponse.categoryId) {
      if (blogResponse.categoryIsActive === false) {
        category = {
          id: blogResponse.categoryId,
          name: 'Danh mục đã bị xoá',
          isActive: false,
        };
      } else {
        category = {
          id: blogResponse.categoryId,
          name: blogResponse.categoryName || 'Chưa phân loại',
          isActive: blogResponse.categoryIsActive !== false,
        };
      }
    }
    // Đảm bảo thumbnailImage luôn có giá trị
    const thumbnailImage =
      blogResponse.thumbnailImage ||
      blogResponse.displayThumbnail ||
      blogResponse.existingThumbnail ||
      '';
    // Đảm bảo section images luôn có giá trị
    const sections = (blogResponse.sections || []).map((section) => ({
      ...section,
      sectionImage: section.sectionImage || section.existingSectionImage || '',
    }));
    return {
      id: blogResponse.id,
      title: blogResponse.title,
      description: blogResponse.description,
      content: blogResponse.content,
      thumbnailImage,
      category,
      author: {
        id: blogResponse.authorId,
        fullName: blogResponse.authorName,
        avatar: blogResponse.authorAvatar,
      },
      status: blogResponse.status,
      createdAt: blogResponse.createdAt,
      updatedAt: blogResponse.updatedAt,
      sections,
      tags: blogResponse.tags || [],
      views: blogResponse.views || 0,
    };
  },
};

export default blogService;

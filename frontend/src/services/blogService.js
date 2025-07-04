/**
 * blogService.js
 *
 * Service cho việc quản lý blog
 */

import apiClient from "./api";

const blogService = {
  /**
   * Lấy danh sách tất cả bài viết blog
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get("/admin/blogs");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch blogs");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
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
      const response = await apiClient.get(`/admin/blogs/${id}`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch blog details"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Tạo bài viết mới
   * @param {Object} blogData Dữ liệu bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createBlog: async (blogData) => {
    try {
      const response = await apiClient.post("/admin/blogs", blogData);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create blog");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Cập nhật thông tin bài viết
   * @param {number} id ID của bài viết
   * @param {Object} blogData Dữ liệu cập nhật
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateBlog: async (id, blogData) => {
    try {
      const response = await apiClient.put(`/admin/blogs/${id}`, blogData);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update blog");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error updating blog ${id}:`, error);
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
      const response = await apiClient.delete(`/admin/blogs/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete blog");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting blog ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Xuất bản bài viết
   * @param {number} id ID của bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  publishBlog: async (id) => {
    try {
      const response = await apiClient.put(`/admin/blogs/${id}/publish`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to publish blog");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error publishing blog ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Gỡ xuất bản bài viết
   * @param {number} id ID của bài viết
   * @returns {Promise} Promise chứa kết quả từ API
   */
  unpublishBlog: async (id) => {
    try {
      const response = await apiClient.put(`/admin/blogs/${id}/unpublish`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to unpublish blog");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error unpublishing blog ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy danh sách các danh mục blog
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get("/admin/blog-categories");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch blog categories"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching blog categories:", error);
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
      const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = params;
      const response = await apiClient.get('/blog', {
        params: { page, size, sortBy, sortDir },
        skipAuthInterceptor: true // Bypass authentication cho public API
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch public blogs");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching public blogs:", error);
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
        skipAuthInterceptor: true // Bypass authentication cho public API
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch blog details");
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching public blog ${id}:`, error);
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
        throw new Error(response.data.message || "Failed to create blog");
      }
      return response.data;
    } catch (error) {
      console.error("Error creating blog with files:", error);
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
        throw new Error(response.data.message || "Failed to update blog");
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating blog with files ${id}:`, error);
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
        throw new Error(response.data.message || "Failed to delete blog");
      }
      return response.data;
    } catch (error) {
      console.error(`Error deleting user blog ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Cập nhật trạng thái bài viết (Staff/Admin only)
   * @param {number} id - ID của bài viết
   * @param {Object} statusData - Dữ liệu trạng thái {status, reviewNotes}
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateBlogStatus: async (id, statusData) => {
    try {
      const response = await apiClient.put(`/blog/${id}/status`, statusData);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update blog status");
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating blog status ${id}:`, error);
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
      const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = params;
      const response = await apiClient.get(`/blog/status/${status}`, {
        params: { page, size, sortBy, sortDir }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch blogs by status");
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching blogs with status ${status}:`, error);
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
      const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = params;
      const response = await apiClient.get('/blog/my-posts', {
        params: { page, size, sortBy, sortDir }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch my blogs");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching my blogs:", error);
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
      const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = params;
      
      // Đảm bảo categoryId là số hợp lệ
      if (!categoryId || isNaN(parseInt(categoryId))) {
        throw new Error('Category ID không hợp lệ');
      }
      
      // Sửa URL endpoint đúng
      const response = await apiClient.get(`/blog/category/${categoryId}`, {
        params: { page, size, sortBy, sortDir }
      });
      
      // Log response để debug
      console.log(`GET /blog/category/${categoryId} response:`, response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch blogs by category");
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching blogs for category ${categoryId}:`, error);
      // Trả về object tương thích với code xử lý trong BlogDetailPage
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách bài viết theo chuyên mục',
        error
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
        categoryId 
      } = params;
      
      const searchParams = { query, page, size, sortBy, sortDir };
      if (categoryId) {
        searchParams.categoryId = categoryId;
      }
      
      const response = await apiClient.get('/blog/search', {
        params: searchParams
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to search blogs");
      }
      return response.data;
    } catch (error) {
      console.error("Error searching blogs:", error);
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
        params: { limit }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch latest blogs");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
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
      sections: blogData.sections || []
    };

    formData.append('request', new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    }));

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

      validFiles.forEach(file => {
        formData.append('sectionImages', file);
      });

      validIndexes.forEach(index => {
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

    // Nếu category bị xoá mềm hoặc không có category, trả về label đặc biệt
    let category = null;
    if (blogResponse.categoryId) {
      if (blogResponse.categoryIsActive === false) {
        category = {
          id: blogResponse.categoryId,
          name: 'Danh mục đã bị xoá',
          isActive: false
        };
      } else {
        category = {
          id: blogResponse.categoryId,
          name: blogResponse.categoryName || 'Chưa phân loại',
          isActive: blogResponse.categoryIsActive !== false
        };
      }
    }

    return {
      id: blogResponse.id,
      title: blogResponse.title,
      description: blogResponse.description,
      content: blogResponse.content,
      thumbnailImage: blogResponse.thumbnailImage || blogResponse.displayThumbnail,
      category: category, // Sử dụng đối tượng category đã tạo
      author: {
        id: blogResponse.authorId,
        fullName: blogResponse.authorName,
        avatar: blogResponse.authorAvatar
      },
      status: blogResponse.status,
      createdAt: blogResponse.createdAt,
      updatedAt: blogResponse.updatedAt,
      sections: blogResponse.sections || [],
      tags: blogResponse.tags || [],
      views: blogResponse.views || 0
    };
  }
};

export default blogService;

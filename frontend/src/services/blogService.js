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
   * Lấy danh sách blog đã CONFIRMED (public)
   */
  getConfirmedBlogs: async (page = 0, size = 20) => {
    const response = await apiClient.get(`/blog/status/CONFIRMED?page=${page}&size=${size}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch confirmed blogs");
    }
    // Trả về mảng blog
    return response.data.data && response.data.data.content ? response.data.data.content : [];
  },

  /**
   * Lấy chi tiết blog (public)
   */
  getBlogById: async (id) => {
    const response = await apiClient.get(`/blog/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch blog details");
    }
    return response.data.data;
  },

  /**
   * Tạo bài viết mới
   * @param {Object} blogData Dữ liệu bài viết (FormData)
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createBlog: async (blogData) => {
    try {
      // Nếu blogData là FormData, không set Content-Type, để axios tự động set multipart/form-data
      const response = await apiClient.post("/blog", blogData, {
        headers: blogData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      });
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
      // Sử dụng endpoint đúng: /blog/{id}
      const response = await apiClient.put(`/blog/${id}`, blogData, {
        headers: blogData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      });
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
      // Sử dụng endpoint đúng: /blog/{id}
      const response = await apiClient.delete(`/blog/${id}`);
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
      // Sử dụng endpoint đúng: /blog/{id}/status
      const response = await apiClient.put(`/blog/${id}/status`);
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
      // Sử dụng endpoint đúng: /blog/{id}/status
      const response = await apiClient.put(`/blog/${id}/status`);
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
      const response = await apiClient.get("/categories");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch blog categories"
        );
      }
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Category management
  createCategory: async (data) => {
    try {
      const response = await apiClient.post("/categories", data);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create category");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update category");
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete category");
      }
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Tìm kiếm blog theo query (public)
   */
  searchBlogs: async (query, page = 0, size = 100) => {
    const response = await apiClient.get(`/blog/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to search blogs");
    }
    return response.data.data && response.data.data.content ? response.data.data.content : [];
  },
};

export default blogService;

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
};

export default blogService;

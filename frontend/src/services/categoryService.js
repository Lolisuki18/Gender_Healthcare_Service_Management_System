import apiClient from './api';
const categoriesService = {
  /**
   * Lấy danh sách các danh mục blog
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to fetch blog categories'
        );
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Cập nhật danh mục blog
   * @param {number} categoryId - ID của danh mục cần cập nhật
   * @param {Object} categoryData - Dữ liệu danh mục cần cập nhật
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await apiClient.put(
        `/categories/${categoryId}`,
        categoryData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update category');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Xóa danh mục blog
   * @param {number} categoryId - ID của danh mục cần xóa
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await apiClient.delete(`/categories/${categoryId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete category');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Tạo danh mục blog mới
   * @param {Object} categoryData - Dữ liệu danh mục cần tạo
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create category');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Lấy danh mục theo ID
   * @param {number} categoryId - ID của danh mục
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch category');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Category Question management
  getQuestionCategories: async () => {
    const res = await apiClient.get('/question-categories');
    // Chuẩn hóa lấy mảng từ res.data.data
    return Array.isArray(res.data.data) ? res.data.data : [];
  },
  createQuestionCategory: (data) =>
    apiClient.post('/question-categories', data),
  updateQuestionCategory: (id, data) =>
    apiClient.put(`/question-categories/${id}`, data),
  deleteQuestionCategory: (id) =>
    apiClient.delete(`/question-categories/${id}`),
};
export default categoriesService;

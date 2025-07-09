/**
 * questionService.js
 *
 * Service cho việc quản lý câu hỏi từ khách hàng
 */

import apiClient from './api';

const questionService = {
  // Lấy danh sách danh mục câu hỏi
  getCategories() {
    return apiClient.get('/question-categories');
  },

  // Gửi câu hỏi mới
  createQuestion(data) {
    return apiClient.post('/questions', data);
  },

  // Lấy danh sách câu hỏi của tôi (có phân trang)
  getMyQuestions(params = {}) {
    return apiClient.get('/questions/my-questions', { params });
  },

  // Lấy câu hỏi theo trạng thái
  getQuestionsByStatus(status, params = {}) {
    return apiClient.get(`/questions/status/${status}`, { params });
  },

  // Trả lời câu hỏi
  answerQuestion(questionId, data) {
    return apiClient.put(`/questions/${questionId}/answer`, data);
  },

  // Cập nhật trạng thái câu hỏi
  updateQuestionStatus(questionId, data) {
    return apiClient.put(`/questions/${questionId}/status`, data);
  },

  // Xóa câu hỏi
  deleteQuestion(questionId) {
    return apiClient.delete(`/questions/${questionId}`);
  },

  // Lấy câu hỏi theo category
  getQuestionsByCategory(categoryId, params = {}) {
    return apiClient.get(`/questions/category/${categoryId}`, { params });
  },

  // Lấy câu hỏi đã trả lời (public)
  getAnsweredQuestions(params = {}) {
    return apiClient.get('/questions/answered', { params });
  },

  // Lấy chi tiết câu hỏi theo id
  getQuestionById(questionId) {
    return apiClient.get(`/questions/${questionId}`);
  },

  // Tìm kiếm câu hỏi
  searchQuestions(query, params = {}) {
    return apiClient.get('/questions/search', { params: { query, ...params } });
  },

  // Lấy các câu hỏi được phân công cho user hiện tại (replier)
  getAssignedQuestionsToMe(params = {}) {
    return apiClient.get('/questions/assigned-to-me', { params });
  },
};

export default questionService;

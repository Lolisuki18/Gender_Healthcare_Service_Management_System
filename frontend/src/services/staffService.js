/**
 * staffService.js
 *
 * Service cho việc quản lý nhân viên, tương tác với API backend
 */

import api from "./api";

const staffService = {
  /**
   * Lấy danh sách tất cả nhân viên
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getAllStaff: () => {
    return api.get("/staff");
  },

  /**
   * Lấy thông tin chi tiết một nhân viên
   * @param {number} id ID của nhân viên
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getStaffById: (id) => {
    return api.get(`/staff/${id}`);
  },

  /**
   * Tạo nhân viên mới
   * @param {Object} staffData Dữ liệu nhân viên
   * @returns {Promise} Promise chứa kết quả từ API
   */
  createStaff: (staffData) => {
    return api.post("/staff", staffData);
  },

  /**
   * Cập nhật thông tin nhân viên
   * @param {number} id ID của nhân viên
   * @param {Object} staffData Dữ liệu cập nhật
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateStaff: (id, staffData) => {
    return api.put(`/staff/${id}`, staffData);
  },

  /**
   * Xóa nhân viên
   * @param {number} id ID của nhân viên
   * @returns {Promise} Promise chứa kết quả từ API
   */
  deleteStaff: (id) => {
    return api.delete(`/staff/${id}`);
  },

  /**
   * Lấy danh sách các vai trò nhân viên
   * @returns {Promise} Promise chứa kết quả từ API
   */
  getStaffRoles: () => {
    return api.get("/staff/roles");
  },

  /**
   * Cập nhật vai trò của nhân viên
   * @param {number} id ID của nhân viên
   * @param {Object} roleData Dữ liệu vai trò
   * @returns {Promise} Promise chứa kết quả từ API
   */
  updateStaffRole: (id, roleData) => {
    return api.put(`/staff/${id}/role`, roleData);
  },
};

export default staffService;

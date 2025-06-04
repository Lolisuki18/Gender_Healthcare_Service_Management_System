/**
 * authSlice.js - Quản lý state xác thực người dùng với Redux Toolkit
 *
 * File này định nghĩa một slice trong Redux store để quản lý trạng thái
 * đăng nhập, đăng xuất và các thông tin liên quan đến xác thực người dùng.
 *
 * Lý do tạo file:
 * - Tách biệt logic quản lý state xác thực khỏi các thành phần UI
 * - Áp dụng cách tiếp cận "slice" của Redux Toolkit để giảm boilerplate code
 * - Cung cấp cách tiếp cận thống nhất cho các tác vụ xác thực
 *
 * Các tính năng:
 * - Quản lý trạng thái đăng nhập/đăng xuất
 * - Xử lý các trạng thái loading và error
 * - Lưu trữ thông tin người dùng hiện tại
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout, clearError } =
  authSlice.actions;

export default authSlice.reducer;

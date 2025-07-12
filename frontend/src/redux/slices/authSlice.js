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
 * - Cập nhật avatar và thông tin user
 */

import { createSlice } from "@reduxjs/toolkit";
import localStorageUtil from "@/utils/localStorage";

// Kiểm tra và tải userProfile từ localStorage khi khởi tạo
const getUserFromStorage = () => {
  try {
    const userProfile = localStorageUtil.get("userProfile");
    if (userProfile && userProfile.data) {
      return userProfile.data;
    }
    return null;
  } catch (e) {
    console.error("Không thể đọc userProfile từ localStorage:", e);
    return null;
  }
};

// Kiểm tra trạng thái xác thực từ localStorage
const getAuthStatus = () => {
  try {
    const token = localStorageUtil.get("token");
    const userProfile = localStorageUtil.get("userProfile");
    
    // Kiểm tra cả token và userProfile
    return !!(token && token.accessToken && userProfile && userProfile.data);
  } catch (e) {
    console.error("Không thể kiểm tra auth status:", e);
    return false;
  }
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: getAuthStatus(),
  loading: false,
  error: null,
  avatarUrl: getUserFromStorage()?.avatar || null,
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
      
      // Hỗ trợ cả 2 format: direct user object (login thường) và {user, accessToken} (OAuth)
      const userData = action.payload.user || action.payload;
      state.user = userData;
      state.avatarUrl = userData?.avatar || null;
      state.error = null;

      // Lưu thông tin user vào localStorage
      localStorageUtil.set("userProfile", {
        success: true,
        message: "User profile loaded",
        data: userData,
      });
      
      // Lưu tokens nếu có bằng setTokens method
      if (action.payload.accessToken) {
        localStorageUtil.setTokens({
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken
        });
      }
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
      state.avatarUrl = null;
      state.error = null;

      // Xóa dữ liệu từ localStorage
      localStorageUtil.remove("userProfile");
      localStorageUtil.clearTokens();
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreAuthState: (state) => {
      try {
        const token = localStorageUtil.get("token");
        const userProfile = localStorageUtil.get("userProfile");
        
        if (token && token.accessToken && userProfile && userProfile.data) {
          state.isAuthenticated = true;
          state.user = userProfile.data;
          state.avatarUrl = userProfile.data.avatar || null;
          state.error = null;
        } else {
          // Nếu thiếu thông tin, logout hoàn toàn
          state.isAuthenticated = false;
          state.user = null;
          state.avatarUrl = null;
          localStorageUtil.clearTokens();
          localStorageUtil.remove("userProfile");
        }
      } catch (e) {
        console.error("Error restoring auth state:", e);
        state.isAuthenticated = false;
        state.user = null;
        state.avatarUrl = null;
      }
    },
    updateUserAvatar: (state, action) => {
      const newAvatarUrl = action.payload;

      if (state.user) {
        state.avatarUrl = newAvatarUrl;
        state.user.avatar = newAvatarUrl;

        // Cập nhật localStorage
        localStorageUtil.updateUserProfile({ avatar: newAvatarUrl }, true);

        // Lưu vào sessionStorage để hỗ trợ việc đồng bộ
        if (typeof window !== "undefined") {
          sessionStorage.setItem("last_updated_avatar", newAvatarUrl);
        }
      }
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.avatarUrl = action.payload.avatar || state.avatarUrl;

      // Cập nhật localStorage
      localStorageUtil.updateUserProfile(action.payload, true);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  clearError,
  restoreAuthState,
  updateUserAvatar,
  updateUserProfile,
} = authSlice.actions;

// Selector để dễ dàng truy cập thông tin từ store
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAvatar = (state) => state.auth.avatarUrl;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;

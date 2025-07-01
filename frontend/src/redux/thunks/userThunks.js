/**
 * userThunks.js - Redux thunks cho các tác vụ liên quan đến người dùng
 *
 * File này cung cấp các thunks để thực hiện các tác vụ bất đồng bộ
 * liên quan đến thông tin người dùng, avatar và xác thực
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";
import {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  updateUserAvatar,
  updateUserProfile,
} from "@/redux/slices/authSlice";
import localStorageUtil from "@/utils/localStorage";
import {
  extractAvatarFromResponse,
  debugLog,
  logStorageState,
} from "@/utils/debugHelper";
import { notify } from "@/utils/notify";

/**
 * Thực hiện đăng nhập
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { dispatch }) => {
    try {
      dispatch(loginStart());
      const response = await userService.login(credentials);

      if (response.success) {
        // Lưu token vào localStorage
        localStorageUtil.set("token", {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          tokenType: response.data.tokenType,
        });

        // Lấy thông tin người dùng
        const userResponse = await userService.getCurrentUser();

        if (userResponse.success) {
          dispatch(loginSuccess(userResponse.data));
          return userResponse.data;
        } else {
          throw new Error(
            userResponse.message || "Không thể lấy thông tin người dùng"
          );
        }
      } else {
        throw new Error(response.message || "Đăng nhập không thành công");
      }
    } catch (error) {
      dispatch(loginFailed(error.message));
      throw error;
    }
  }
);

/**
 * Thực hiện đăng xuất
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      // Vẫn tiếp tục đăng xuất dù có lỗi
    } finally {
      dispatch(logout());
    }
  }
);

/**
 * Upload avatar và cập nhật vào Redux store
 */
export const uploadUserAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (file, { dispatch }) => {
    try {
      debugLog("AVATAR_UPDATES", "Bắt đầu upload avatar", {
        fileName: file.name,
        fileSize: file.size,
      });

      const response = await userService.uploadAvatar(file);

      // Log thông tin response đầy đủ
      debugLog("API_RESPONSES", "Response từ API upload avatar:", response);

      // Log trạng thái lưu trữ hiện tại
      logStorageState();

      if (response.success) {
        // Sử dụng helper để trích xuất đường dẫn avatar từ response
        let avatarPath = extractAvatarFromResponse(response);

        if (avatarPath) {
          debugLog(
            "AVATAR_UPDATES",
            "Đã tìm thấy đường dẫn avatar:",
            avatarPath
          );

          // Dispatch action để cập nhật avatar trong Redux
          dispatch(updateUserAvatar(avatarPath));

          // Thông báo thành công
          notify.success(
            "Cập nhật thành công",
            "Avatar đã được cập nhật thành công"
          );

          return avatarPath;
        }

        // Trường hợp đặc biệt: response chỉ có { avatar } trong data, không phải chuẩn API
        if (
          response.data &&
          typeof response.data === "object" &&
          response.data.avatar
        ) {
          debugLog(
            "AVATAR_UPDATES",
            "Tìm thấy avatar trong response.data.avatar:",
            response.data.avatar
          );
          avatarPath = response.data.avatar;
          dispatch(updateUserAvatar(avatarPath));
          notify.success(
            "Cập nhật thành công",
            "Avatar đã được cập nhật thành công"
          );
          return avatarPath;
        }

        // Còn một trường hợp nữa - API trả về trực tiếp giá trị string là đường dẫn
        if (response.data && typeof response.data === "string") {
          debugLog(
            "AVATAR_UPDATES",
            "API trả về trực tiếp đường dẫn:",
            response.data
          );
          avatarPath = response.data;
          dispatch(updateUserAvatar(avatarPath));
          notify.success(
            "Cập nhật thành công",
            "Avatar đã được cập nhật thành công"
          );
          return avatarPath;
        }

        // Nếu không tìm thấy đường dẫn, sử dụng giá trị mặc định
        debugLog(
          "AVATAR_UPDATES",
          "Không tìm thấy đường dẫn avatar, sử dụng mặc định"
        );
        const defaultAvatarPath = "/img/avatar/default.jpg";
        dispatch(updateUserAvatar(defaultAvatarPath));

        notify.warning(
          "Thông báo",
          "Không tìm thấy avatar trong phản hồi từ server, sẽ sử dụng avatar mặc định"
        );
        return defaultAvatarPath;
      } else {
        throw new Error(response.message || "Không thể tải avatar lên");
      }
    } catch (error) {
      debugLog("API_RESPONSES", "Lỗi khi upload avatar:", error);
      notify.error("Lỗi upload", error.message || "Không thể tải avatar lên");
      throw error;
    }
  }
);

/**
 * Cập nhật thông tin hồ sơ người dùng
 */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { dispatch }) => {
    try {
      const response = await userService.updateProfile(userData);

      if (response.success) {
        dispatch(updateUserProfile(response.data));
        notify.success(
          "Cập nhật thành công",
          "Thông tin hồ sơ đã được cập nhật"
        );
        return response.data;
      } else {
        throw new Error(
          response.message || "Không thể cập nhật thông tin hồ sơ"
        );
      }
    } catch (error) {
      notify.error(
        "Lỗi cập nhật",
        error.message || "Không thể cập nhật thông tin hồ sơ"
      );
      throw error;
    }
  }
);

/**
 * Lấy thông tin người dùng hiện tại và cập nhật vào Redux store
 */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { dispatch }) => {
    try {
      const response = await userService.getCurrentUser();

      if (response.success) {
        dispatch(loginSuccess(response.data));
        return response.data;
      } else {
        throw new Error(
          response.message || "Không thể lấy thông tin người dùng"
        );
      }
    } catch (error) {
      // Nếu là lỗi 401 Unauthorized, thực hiện đăng xuất
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      throw error;
    }
  }
);

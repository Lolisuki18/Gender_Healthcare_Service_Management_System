/**
 * localStorageMiddleware.js - Middleware Redux để đồng bộ trạng thái với localStorage
 *
 * Middleware này lắng nghe các action liên quan đến người dùng và avatar,
 * đồng thời đồng bộ những thay đổi này với localStorage và tạo các sự kiện để
 * thông báo cho toàn bộ ứng dụng về việc cập nhật.
 */

import { triggerAvatarUpdate } from "@/utils/storageEvent";
import localStorageUtil from "@/utils/localStorage";

// Danh sách các action cần đồng bộ với localStorage
const USER_ACTIONS = [
  "auth/loginSuccess",
  "auth/logout",
  "auth/updateUserAvatar",
  "auth/updateUserProfile",
];

const localStorageMiddleware = (store) => (next) => (action) => {
  // Thực thi action trước
  const result = next(action);

  // Kiểm tra nếu action thuộc danh sách cần đồng bộ
  if (USER_ACTIONS.includes(action.type)) {
    const state = store.getState();
    const { auth } = state;

    switch (action.type) {
      case "auth/loginSuccess":
        // Đã được xử lý trong action loginSuccess
        break;

      case "auth/logout":
        // Đã được xử lý trong action logout
        break;

      case "auth/updateUserAvatar":
        // Kích hoạt sự kiện cập nhật avatar
        if (action.payload) {
          triggerAvatarUpdate(action.payload);
        }
        break;

      case "auth/updateUserProfile":
        // Cập nhật thông tin người dùng trong localStorage
        if (action.payload) {
          localStorageUtil.updateUserProfile(action.payload, true);
        }
        break;

      default:
        break;
    }
  }

  return result;
};

export default localStorageMiddleware;

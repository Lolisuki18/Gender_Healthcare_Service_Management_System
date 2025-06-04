/**
 * store.js - Cấu hình Redux store cho ứng dụng
 *
 * File này thiết lập Redux store với Redux Toolkit và Redux Persist, tạo
 * cơ chế quản lý state tập trung và bền vững cho ứng dụng.
 *
 * Lý do tạo file:
 * - Tạo một store tập trung để quản lý state toàn cục
 * - Tích hợp Redux Persist để lưu trữ state qua các phiên làm việc của người dùng
 * - Cấu hình middleware và devtools để hỗ trợ phát triển
 *
 * Các tính năng chính:
 * - Sử dụng Redux Toolkit để đơn giản hóa cú pháp Redux
 * - Lưu trữ state vào localStorage với redux-persist
 * - Cấu hình chỉ lưu trữ các state quan trọng (whitelist)
 */

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import các reducers
import authReducer from "./slices/authSlice";

// Cấu hình Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Chỉ lưu trữ state auth
};

// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: authReducer,
  // Thêm các reducers khác ở đây khi cần
});

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Tạo persistor
export const persistor = persistStore(store);

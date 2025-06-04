/**
 * App.js - Component gốc của ứng dụng React
 *
 * Đây là component cấp cao nhất trong ứng dụng, đặt nền móng cho toàn bộ cấu trúc ứng dụng
 * và tích hợp các công nghệ cốt lõi như Redux, Context API, và React Router.
 *
 * Lý do tạo file:
 * - Tạo điểm đầu vào cho ứng dụng React
 * - Thiết lập các provider cần thiết cho state management và routing
 * - Xác định luồng điều khiển chính của ứng dụng
 *
 * Cấu trúc:
 * - Redux Provider: Quản lý state toàn cục với redux
 * - PersistGate: Duy trì state qua các lần tải lại trang
 * - CustomThemeProvider: Quản lý theme sáng/tối
 * - UserProvider: Quản lý thông tin người dùng và xác thực
 * - BrowserRouter: Cấu hình điều hướng không cần tải lại trang
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CssBaseline } from "@mui/material";
import { store, persistor } from "@redux/store";
import AppRoutes from "@/routes";
import { CustomThemeProvider } from "@context/ThemeContext";
import { UserProvider } from "@context/UserContext";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CustomThemeProvider>
          <UserProvider>
            <CssBaseline />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UserProvider>
        </CustomThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

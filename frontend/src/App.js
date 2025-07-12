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

import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline } from '@mui/material';
import { store, persistor } from '@redux/store';
import AppRoutes from '@/routes';
import { CustomThemeProvider } from '@context/ThemeContext';
import { UserProvider } from '@context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import tokenService from '@/services/tokenService';
import ScrollToTop from './components/common/ScrollToTop';
import AuthStateRestorer from './components/common/AuthStateRestorer';

function App() {
  useEffect(() => {
    // Khởi tạo token service khi app start
    tokenService.init();

    // Cleanup khi component unmount
    return () => {
      tokenService.cleanup();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthStateRestorer>
          <CustomThemeProvider>
            <UserProvider>
              <CssBaseline />
              <ToastContainer position="top-right" autoClose={3000} />
              <HashRouter>
                <ScrollToTop />
                <AppRoutes />
              </HashRouter>
            </UserProvider>
          </CustomThemeProvider>
        </AuthStateRestorer>
      </PersistGate>
    </Provider>
  );
}

export default App;

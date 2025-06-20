/**
 * routes.js - Cấu hình định tuyến của ứng dụng
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import MainLayout from '@layouts/MainLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterForm from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ProfilePage from '@/pages/ProfilePage';
// import AdminTestPage from "@/pages/AdminTestPage";
import StiPage from '@/pages/StiPage';
import StiDetailPage from '@/pages/StiDetailPage';
// Import Profile Components
import AdminProfile from '@/components/AdminProfile/AdminProfile';

import AdminLayout from './components/layouts/AdminLayout';
import localStorageUtil from './utils/localStorage';
import ConsultationPage from './pages/ConsultantionPage';
import TestRegistrationPage from '@/pages/TestRegistrationPage';
import OvulationPage from './pages/OvulationPage';

const AppRoutes = () => {
  // Lấy thông tin user từ localStorage
  const userData = localStorageUtil.get('userProfile');
  const tokenData = localStorageUtil.get('token'); // Component để redirect đến trang phù hợp khi truy cập "/"
  const AutoRedirectToProfile = () => {
    // Kiểm tra cả token và userProfile
    if (!userData || !userData.data || !userData.data.role || !tokenData) {
      return <Navigate to="/login" replace />;
    }

    switch (userData.data.role) {
      case 'ADMIN':
        return <Navigate to="/admin/profile" replace />; // Admin vào admin profile
      case 'CUSTOMER':
      case 'CONSULTANT':
      case 'STAFF':
        return <HomePage />; // Các role khác vào homepage
      default: //nếu là role không hợp lệ thì sẽ vào trang login
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Route chính cho trang chủ */}
      <Route path="/" element={<MainLayout />}>
        {' '}
        {/* Trang chủ - Auto redirect admin, hiển thị homepage cho user thường */}
        <Route
          index
          element={
            userData && tokenData ? <AutoRedirectToProfile /> : <HomePage />
            //nếu có token và userData thì sẽ redirect đến trang phù hợp , còn hok thì sẽ
            //đến trang HomePage
          }
        />
        <Route path="/appointment" element={<ConsultationPage />}></Route>
        <Route path="/sti-services" element={<StiPage />} />
        <Route path="/ovulation" element={<OvulationPage />} />{' '}
        {/* Trang STI Test (đổi endpoint) */}
        {/* Homepage cho các role đã đăng nhập (trừ admin) */}
        <Route path="home" element={<HomePage />} />{' '}
        {/* Profile Page chung - sẽ render component phù hợp với role */}
        <Route
          path="profile"
          element={
            userData &&
            userData.data &&
            userData.data.role !== 'ADMIN' &&
            tokenData ? (
              <ProfilePage /> // Chỉ cho phép truy cập nếu có userData và token
            ) : (
              <Navigate to="/login" replace /> // còn hoặc không có thì sẽ redirect đến trang login
            )
          }
        />
        {/* Public routes */}
        {/* Trang đăng nhập */}
        <Route path="login" element={<LoginPage />} />
        {/* Các route đăng ký và quên mật khẩu */}
        <Route path="register" element={<RegisterForm />} />
        {/* Trang quên mật khẩu */}
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        {/* Trang đăng ký xét nghiệm */}
        <Route path="/test-registration" element={<TestRegistrationPage />} />
        {/* 404 Page -> sẽ được hiện ra khi truy cập những path không hợp lệ */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes riêng với AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        {' '}
        <Route
          path="profile"
          element={
            // Chỉ cho phép truy cập nếu user là admin và có token
            userData?.data?.role === 'ADMIN' && tokenData ? (
              <AdminProfile />
            ) : (
              // Nếu không phải admin hoặc không có token, redirect đến trang đăng nhập
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Auto redirect /admin to /admin/profile */}
        <Route index element={<Navigate to="/admin/profile" replace />} />
      </Route>

      <Route path="/services/sti-testing" element={<StiDetailPage />} />
    </Routes>
  );
};

export default AppRoutes;

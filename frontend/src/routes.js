/**
 * routes.js - Cấu hình định tuyến của ứng dụng
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import BlogPage from '@/pages/BlogPage';
import BlogDetailPage from '@/pages/BlogDetailPage';
import AboutPage from '@/pages/AboutPage';
import TermsPage from '@/pages/TermsPage';
// Import Profile Components
import AdminProfile from '@/components/AdminProfile/AdminProfile';

import AdminLayout from './components/layouts/AdminLayout';
import localStorageUtil from './utils/localStorage';
import ConsultationPage from './pages/ConsultantionPage';
import TestRegistrationPage from '@/pages/TestRegistrationPage';
import OvulationPage from './pages/OvulationPage';
import PrivacyPage from '@/pages/PrivacyPage';
import BlogCreatePage from './pages/BlogCreatePage';
import PillReminderPage from '@/pages/PillReminderPage';

const AppRoutes = () => {
  // Sử dụng Redux state thay vì localStorage để reactive
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const tokenData = localStorageUtil.get('token');

  // Component để redirect đến trang phù hợp khi truy cập "/"
  const AutoRedirectToProfile = () => {
    // Kiểm tra auth state từ Redux
    if (!isAuthenticated || !user || !user.role || !tokenData) {
      return <Navigate to="/login" replace />;
    }

    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin/profile" replace />;
      case 'CUSTOMER':
      case 'CONSULTANT':
      case 'STAFF':
        return <HomePage />;
      default:
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
            isAuthenticated && user ? <AutoRedirectToProfile /> : <HomePage />
          }
        />
        {/* Route cho GitHub Pages - redirect về homepage */}
        <Route
          path="/Gender_Healthcare_Service_Management_System"
          element={<Navigate to="/" replace />}
        />
        <Route path="/consultation" element={<ConsultationPage />}></Route>
        <Route path="/sti-services" element={<StiPage />} />
        <Route path="/ovulation" element={<OvulationPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/blog/create" element={<BlogCreatePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/pill-reminder" element={<PillReminderPage />} />
        {/* Trang STI Test (đổi endpoint) */}
        {/* Homepage cho các role đã đăng nhập (trừ admin) */}
        <Route path="/home" element={<HomePage />} />
        {/* Profile Page chung - sẽ render component phù hợp với role */}
        <Route
          path="profile"
          element={
            isAuthenticated && user && user.role !== 'ADMIN' && tokenData ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Public routes */}
        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        {/* Các route đăng ký và quên mật khẩu */}
        <Route path="/register" element={<RegisterForm />} />
        {/* Trang quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Trang đăng ký xét nghiệm */}
        <Route path="/test-registration" element={<TestRegistrationPage />} />
        {/* 404 Page -> sẽ được hiện ra khi truy cập những path không hợp lệ */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/services/sti-testing" element={<StiDetailPage />} />
      </Route>

      {/* Admin Routes riêng với AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        {' '}
        <Route
          path="profile"
          element={
            // Chỉ cho phép truy cập nếu user là admin và có token
            isAuthenticated && user?.role === 'ADMIN' && tokenData ? (
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
    </Routes>
  );
};

export default AppRoutes;

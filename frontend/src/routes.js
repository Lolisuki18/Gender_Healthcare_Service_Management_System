/**
 * routes.js - Cấu hình định tuyến của ứng dụng
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import MainLayout from "@layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterForm from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ProfilePage from "@/pages/ProfilePage";

// Import Profile Components
import CustomerProfile from "@/components/CustomerProfile/CustomerProfile";
import AdminProfile from "@/components/AdminProfile/AdminProfile";
import ConsultantProfile from "@/components/ConsultantProfile/ConsultantProfile";
import StaffProfile from "@/components/StaffProfile/StaffProfile";
import AdminLayout from "./components/layouts/AdminLayout";
import localStorageUtil from "./utils/localStorage";

const AppRoutes = () => {
  // Lấy thông tin user từ localStorage
  const userData = localStorageUtil.get("user");

  // Component để redirect đến trang phù hợp khi truy cập "/"
  const AutoRedirectToProfile = () => {
    if (!userData || !userData.role) {
      return <Navigate to="/login" replace />;
    }

    switch (userData.role) {
      case "ADMIN":
        return <Navigate to="/admin/profile" replace />; // Admin vào admin profile
      case "CUSTOMER":
      case "CONSULTANT":
      case "STAFF":
        return <HomePage />; // Các role khác vào homepage
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Route chính cho trang chủ */}
      <Route path="/" element={<MainLayout />}>
        {/* Trang chủ - Auto redirect admin, hiển thị homepage cho user thường */}
        <Route
          index
          element={userData ? <AutoRedirectToProfile /> : <HomePage />}
        />

        {/* Homepage cho các role đã đăng nhập (trừ admin) */}
        <Route path="home" element={<HomePage />} />

        {/* Profile Page chung - sẽ render component phù hợp với role */}
        <Route
          path="profile"
          element={
            userData && userData.role !== "ADMIN" ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes riêng với AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="profile"
          element={
            userData?.role === "ADMIN" ? (
              <AdminProfile />
            ) : (
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

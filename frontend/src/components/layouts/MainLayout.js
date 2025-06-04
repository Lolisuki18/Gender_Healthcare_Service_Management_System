/**
 * MainLayout.js - Layout chính cho ứng dụng
 *
 * Component này định nghĩa cấu trúc cơ bản của mỗi trang trong ứng dụng,
 * bao gồm Header, Footer và phần nội dung chính ở giữa.
 *
 * Lý do tạo file:
 * - Tạo cấu trúc nhất quán cho toàn bộ ứng dụng
 * - Áp dụng mẫu thiết kế "Outlet" của React Router để hiển thị nội dung động
 * - Tránh lặp lại code cho các thành phần cơ bản trên mỗi trang
 *
 * Cách hoạt động:
 * - Header luôn hiển thị ở trên cùng
 * - <Outlet /> là vị trí nơi React Router sẽ render component của route hiện tại
 * - Footer luôn hiển thị ở dưới cùng
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@common/Header";
import Footer from "@common/Footer";
import "@styles/MainLayout.css"; // Import CSS

const MainLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

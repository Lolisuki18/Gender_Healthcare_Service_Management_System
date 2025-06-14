import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@common/Header";
import Footer from "@common/Footer";
import "@styles/MainLayout.css"; // Import CSS
import AdminProfile from "../AdminProfile/AdminProfile";

const AdminLayout = () => {
  return <AdminProfile />;
};

export default AdminLayout;

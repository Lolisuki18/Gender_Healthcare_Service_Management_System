/**
 * AdminTestPage.js - Test page cho AdminProfile component
 *
 * Trang để test tích hợp AdminProfile với sidebar navigation
 */
import React from "react";
import { Box } from "@mui/material";
import AdminProfile from "../components/AdminProfile/AdminProfile";

const AdminTestPage = () => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AdminProfile />
    </Box>
  );
};

export default AdminTestPage;

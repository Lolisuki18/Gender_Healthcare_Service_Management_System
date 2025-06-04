/**
 * AdminProfile.js - Component chính quản lý toàn bộ hệ thống admin dashboard
 *
 * Mục đích:
 * - Component container chính cho tất cả các trang con của admin
 * - Quản lý state navigation giữa các tab/menu items
 * - Cung cấp layout responsive với sidebar có thể thu gọn
 * - Xử lý hiển thị nội dung động dựa trên menu được chọn
 *
 * Kiến trúc:
 * - Sử dụng React Hooks (useState) để quản lý state
 * - Responsive design với Material-UI breakpoints
 * - Tab-based navigation system (không sử dụng React Router)
 * - Glass morphism design với gradient backgrounds
 *
 * State Management:
 * - sidebarOpen: Kiểm soát việc mở/đóng sidebar (responsive)
 * - selectedMenuItem: Xác định tab nào đang được chọn
 *
 * Navigation Flow:
 * AdminProfile → AdminSidebar → Content Components
 */

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import AdminSidebar from "@/components/AdminProfile/AdminSideBar";
import DashboardContent from "@/components/AdminProfile/DashboardContent";
import UserManagementContent from "@/components/AdminProfile/UserManagementContent";
import ServiceManagementContent from "@/components/AdminProfile/ServiceManagementContent";
import AppointmentManagementContent from "@/components/AdminProfile/AppointmentManagementContent";
import ReportsContent from "@/components/AdminProfile/ReportsContent";
import SettingsContent from "@/components/AdminProfile/SettingsContent";

// Styled component cho nội dung chính
// Tự động điều chỉnh margin dựa trên trạng thái sidebar
// Responsive: trên mobile sidebar sẽ overlay thay vì push content
const MainContent = styled(Box)(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarOpen ? 0 : `-280px`, // Sidebar width: 280px
  [theme.breakpoints.down("md")]: {
    marginLeft: 0, // Mobile: không có margin
  },
}));

const AdminProfile = () => {
  // Hook để detect responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Mặc định mở trên desktop, đóng trên mobile
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard"); // Tab mặc định

  // Handler functions
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemSelect = (itemId) => {
    setSelectedMenuItem(itemId);
  };

  // Hàm render nội dung động dựa trên menu item được chọn
  // Đây là core logic của tab navigation system
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "dashboard":
        return <DashboardContent />; // Tổng quan hệ thống
      case "users":
        return <UserManagementContent />; // Quản lý người dùng
      case "services":
        return <ServiceManagementContent />; // Quản lý dịch vụ
      case "appointments":
        return <AppointmentManagementContent />; // Quản lý lịch hẹn
      case "reports":
        return <ReportsContent />; // Báo cáo và thống kê
      case "settings":
        return <SettingsContent />; // Cài đặt hệ thống
      default:
        return <DashboardContent />; // Fallback về dashboard
    }
  };

  // Hàm để lấy tiêu đề trang dựa trên menu item
  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case "dashboard":
        return "Tổng quan";
      case "users":
        return "Quản lý người dùng";
      case "services":
        return "Quản lý dịch vụ";
      case "appointments":
        return "Quản lý lịch hẹn";
      case "reports":
        return "Báo cáo & Thống kê";
      case "settings":
        return "Cài đặt hệ thống";
      default:
        return "Tổng quan";
    }
  };

  return (
    // Container chính với medical background gradient
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 30%, #f5fafe 70%, #ffffff 100%)", // Xanh y tế nhẹ
      }}
    >
      {/* Sidebar Navigation Component */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedMenuItem}
        onItemSelect={handleMenuItemSelect}
      />

      {/* Main Content Area */}
      <MainContent sidebarOpen={sidebarOpen}>
        {/* Header Section với enhanced glass effect */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            background: "rgba(255, 255, 255, 0.85)", // Medical glass effect
            backdropFilter: "blur(25px)",
            borderBottom: "1px solid rgba(74, 144, 226, 0.12)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                mr: 2,
                color: "#2D3748", // Dark text for medical
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Page title với medical styling */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#2D3748", // Dark text for medical
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {getPageTitle()}
            </Typography>
          </Box>

          <Chip
            label="Quản trị viên"
            size="small"
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
              color: "#fff",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>{renderContent()}</Box>
      </MainContent>
    </Box>
  );
};

export default AdminProfile;

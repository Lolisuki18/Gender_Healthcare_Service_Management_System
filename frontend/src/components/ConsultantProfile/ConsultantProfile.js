/**
 * ConsultantProfile.js - Medical Light Theme Consultant Dashboard
 *
 * Đã được redesign để đồng bộ với CustomerProfile và AdminProfile
 *
 * THAY ĐỔI CHÍNH:
 * 1. Medical light background gradient (#f0f8ff to #ffffff)
 * 2. Glass morphism effect với light medical styling
 * 3. Medical color palette (#4A90E2, #1ABC9C)
 * 4. Consistent styling với other profiles
 * 5. Light theme typography và borders
 * 6. Medical-grade professional appearance
 * 7. Enhanced accessibility với medical design standards
 * 8. Harmonized visual hierarchy
 *
 * Mục đích: Provide professional consultant healthcare dashboard
 * với medical light design đồng bộ với hệ thống
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
import ConsultantSidebar from "./ConsultantSideBar";

// Import content components
import DashboardContent from "./DashboardContent";
import ProfileContent from "./ProfileContent";
import AppointmentsContent from "./AppointmentsContent";
import PatientsContent from "./PatientsContent";
import ConsultationsContent from "./ConsultationsContent";
import MedicalServicesContent from "./MedicalServicesContent";
import PrescriptionsContent from "./PrescriptionsContent";
import ReportsContent from "./ReportsContent";
import SettingsContent from "./SettingsContent";

const MainContent = styled(Box)(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarOpen ? 0 : `-280px`,
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
  },
}));

const ConsultantProfile = ({ user = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleMenuItemSelect = (itemId) => {
    setSelectedMenuItem(itemId);
  };

  // Hàm để lấy tiêu đề trang dựa trên menu item
  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case "dashboard":
        return "Bảng điều khiển";
      case "profile":
        return "Hồ sơ bác sĩ";
      case "appointments":
        return "Lịch hẹn";
      case "patients":
        return "Bệnh nhân";
      case "consultations":
        return "Tư vấn";
      case "medical-services":
        return "Dịch vụ y tế";
      case "prescriptions":
        return "Đơn thuốc";
      case "reports":
        return "Báo cáo";
      case "settings":
        return "Cài đặt";
      default:
        return "Bảng điều khiển";
    }
  };

  // Navigation content rendering
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "dashboard":
        return <DashboardContent />;
      case "profile":
        return <ProfileContent />;
      case "appointments":
        return <AppointmentsContent />;
      case "patients":
        return <PatientsContent />;
      case "consultations":
        return <ConsultationsContent />;
      case "medical-services":
        return <MedicalServicesContent />;
      case "prescriptions":
        return <PrescriptionsContent />;
      case "reports":
        return <ReportsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 30%, #f5fafe 70%, #ffffff 100%)", // Medical light theme
      }}
    >
      <ConsultantSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedMenuItem}
        onItemSelect={handleMenuItemSelect}
      />

      <MainContent sidebarOpen={sidebarOpen}>
        {" "}
        {/* Enhanced Header */}
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {" "}
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                color: "#2D3748", // Dark text for medical
                mr: 2,
                display: { md: "none" },
                background: "rgba(74, 144, 226, 0.1)",
                "&:hover": {
                  background: "rgba(74, 144, 226, 0.2)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>{" "}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#2D3748", // Dark text for medical
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {getPageTitle()}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#718096" }} // Medical gray text
              >
                {selectedMenuItem === "profile"
                  ? "Quản lý thông tin cá nhân"
                  : "Tổng quan hoạt động"}
              </Typography>
            </Box>
          </Box>{" "}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="Đang hoạt động"
              size="small"
              sx={{
                background: "linear-gradient(45deg, #4CAF50, #2ECC71)", // Medical green
                color: "#fff",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.25)",
              }}
            />
          </Box>
        </Box>{" "}
        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>{renderContent()}</Box>
      </MainContent>
    </Box>
  );
};

export default ConsultantProfile;

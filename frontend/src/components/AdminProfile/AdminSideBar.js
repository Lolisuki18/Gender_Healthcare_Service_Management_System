/**
 * AdminSideBar.js - Sidebar navigation cho AdminProfile
 *
 * Mục đích:
 * - Cung cấp navigation sidebar cho admin dashboard
 * - Hỗ trợ responsive design với drawer overlay/persistent
 * - Tab-based navigation (không sử dụng React Router)
 * - Glass morphism design với admin theme
 *
 * Architecture:
 * - Tương thích với AdminProfile.js tab system
 * - Menu items mapping với renderContent() cases
 * - Responsive behavior: overlay trên mobile, persistent trên desktop
 *
 * Props:
 * - open: boolean - Trạng thái mở/đóng sidebar
 * - onClose: function - Callback để đóng sidebar (mobile)
 * - selectedItem: string - Menu item hiện tại được chọn
 * - onItemSelect: function - Callback khi chọn menu item
 */

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";

const drawerWidth = 280;

// Styled Drawer với admin theme - relative positioning cho MainLayout
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#fff",
    backdropFilter: "blur(20px)",
    position: "relative", // Thay đổi từ fixed sang relative
    height: "100%", // Full height của container
  },
}));

// Admin profile section styling
const AdminProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  position: "relative",
}));

// Menu item styling với selected state
const StyledListItem = styled(ListItemButton)(({ theme, selected }) => ({
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  minHeight: "56px",
  backgroundColor: selected ? "rgba(59, 130, 246, 0.15)" : "transparent",
  borderLeft: selected ? "3px solid #3b82f6" : "3px solid transparent",
  "&:hover": {
    backgroundColor: selected
      ? "rgba(59, 130, 246, 0.2)"
      : "rgba(255, 255, 255, 0.08)",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
  },
  "& .MuiListItemIcon-root": {
    color: selected ? "#3b82f6" : "rgba(255, 255, 255, 0.7)",
    minWidth: "40px",
  },
  "& .MuiListItemText-primary": {
    color: selected ? "#fff" : "rgba(255, 255, 255, 0.9)",
    fontWeight: selected ? 600 : 400,
    fontSize: "0.95rem",
  },
  "& .MuiListItemText-secondary": {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.8rem",
  },
}));

// Logo section styling
const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.02)",
}));

const AdminSidebar = ({ open, onClose, selectedItem, onItemSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  //lấy user ra để hiện thị
  const userData = localStorageUtil.get("user");
  // Menu items tương ứng với AdminProfile.js renderContent() cases
  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: <DashboardIcon />,
      description: "Dashboard và thống kê tổng quan hệ thống",
    },
    {
      id: "users",
      label: "Quản lý người dùng",
      icon: <ManageAccountsIcon />,
      description: "Quản lý tài khoản, phân quyền người dùng",
    },
    {
      id: "services",
      label: "Quản lý dịch vụ",
      icon: <HospitalIcon />,
      description: "Dịch vụ y tế và chăm sóc sức khỏe",
    },
    {
      id: "appointments",
      label: "Quản lý lịch hẹn",
      icon: <CalendarIcon />,
      description: "Lịch hẹn khám và đặt lịch tư vấn",
    },
    {
      id: "reports",
      label: "Báo cáo & Thống kê",
      icon: <AnalyticsIcon />,
      description: "Báo cáo doanh thu và hiệu suất hoạt động",
    },
    {
      id: "settings",
      label: "Cài đặt hệ thống",
      icon: <SettingsIcon />,
      description: "Cấu hình và thiết lập hệ thống",
    },
  ];

  // Handler cho việc chọn menu item
  const handleMenuItemClick = (itemId) => {
    onItemSelect(itemId);
    // Đóng sidebar trên mobile sau khi chọn
    if (isMobile) {
      onClose();
    }
  };

  // Nội dung sidebar
  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section */}
      <LogoSection>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <AdminIcon sx={{ fontSize: 32, color: "#3b82f6", mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Control
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          Healthcare Management System
        </Typography>
      </LogoSection>

      {/* Admin Profile Section */}
      <AdminProfileSection>
        {/* Close button for mobile */}
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": { color: "#fff" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
            fontSize: "24px",
            fontWeight: 600,
          }}
        >
          A
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {userData.fullName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
        >
          {userData.email}
        </Typography>
        <Chip
          label="Admin"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #f44336, #d32f2f)",
            color: "#fff",
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(244, 67, 54, 0.25)",
          }}
        />
      </AdminProfileSection>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: "rgba(255, 255, 255, 0.5)",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
          }}
        >
          Quản lý hệ thống
        </Typography>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.id}
              selected={selectedItem === item.id}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                secondaryTypographyProps={{
                  sx: {
                    mt: 0.5,
                    display: { xs: "none", sm: "block" }, // Ẩn description trên mobile nhỏ
                  },
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
            display: "block",
          }}
        >
          Healthcare System v2.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <StyledDrawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      {drawerContent}
    </StyledDrawer>
  );
};

export default AdminSidebar;

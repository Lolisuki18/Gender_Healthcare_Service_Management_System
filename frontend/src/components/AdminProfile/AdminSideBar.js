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
  // Chọn 1 trong những icon này:
  //Person as PersonIcon, // Icon người dùng cơ bản
  // hoặc
  // AccountCircle as PersonIcon, // Icon tài khoản tròn
  // hoặc
  SupervisorAccount as PersonIcon, // Icon tài khoản admin
  // hoặc
  // Badge as PersonIcon, // Icon huy hiệu
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";

const drawerWidth = 280;

// Styled Drawer với admin theme - relative positioning cho MainLayout
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 280,
    background:
      "linear-gradient(180deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)", // Medical gradient background
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(74, 144, 226, 0.15)", // Medical blue border
    color: "#2D3748", // Dark text
    position: "relative",
    height: "100%",
    boxShadow: "2px 0 10px rgba(74, 144, 226, 0.08)", // Subtle shadow
  },
}));

// Admin profile section styling với medical theme
const AdminProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  background: "rgba(74, 144, 226, 0.08)", // Slightly darker medical blue background
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(74, 144, 226, 0.15)",
  position: "relative",
}));

// Menu item styling với medical colors
const StyledListItem = styled(ListItemButton)(({ theme, selected }) => ({
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  background: selected
    ? "rgba(74, 144, 226, 0.12)" // Slightly darker medical blue background when selected
    : "transparent",
  color: selected ? "#2D3748" : "#4A5568", // Dark colors for medical theme
  "&:hover": {
    background: "rgba(74, 144, 226, 0.1)",
    transform: "translateX(4px)",
  },
  "& .MuiListItemIcon-root": {
    color: selected ? "#4A90E2" : "#4A5568", // Medical blue for selected icon
    minWidth: 40,
  },
  "& .MuiListItemText-primary": {
    fontWeight: selected ? 600 : 400,
    fontSize: "0.95rem",
    color: selected ? "#2D3748" : "#4A5568",
  },
  "& .MuiListItemText-secondary": {
    color: "#718096", // Muted text color
    fontSize: "0.8rem",
  },
}));

// Logo section styling với medical theme
const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderBottom: "1px solid rgba(74, 144, 226, 0.15)",
  background: "rgba(74, 144, 226, 0.05)", // Light medical blue tint
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
          <AdminIcon sx={{ fontSize: 32, color: "#4A90E2", mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
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
          sx={{ color: "#718096" }} // Medical muted text
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
              color: "#4A5568", // Medical muted text
              "&:hover": { color: "#2D3748" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
          }}
        >
          <PersonIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Avatar>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: "16px", md: "18px" },
            color: "#2D3748", // Dark text for medical theme
          }}
        >
          Quản trị viên
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#4A5568", // Muted text for medical theme
            fontSize: "13px",
            mb: 1,
            wordBreak: "break-all",
          }}
        >
          {userData?.email || "admin@healthcare.vn"}
        </Typography>

        <Chip
          label="Hoạt động"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #4CAF50, #2ECC71)", // Medical green
            color: "#fff",
            fontSize: "11px",
            height: 20,
            fontWeight: 600,
          }}
        />
      </AdminProfileSection>

      <Divider sx={{ borderColor: "rgba(74, 144, 226, 0.08)" }} />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: "#718096", // Medical muted text
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
                    display: { xs: "none", sm: "block" },
                  },
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(74, 144, 226, 0.08)" }}>
        <Typography
          variant="caption"
          sx={{
            color: "#718096", // Medical muted text
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

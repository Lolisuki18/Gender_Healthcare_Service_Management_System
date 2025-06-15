/**
 * StaffSideBar.js - Sidebar navigation cho StaffProfile
 *
 * Mục đích:
 * - Cung cấp navigation sidebar cho staff dashboard
 * - Hỗ trợ responsive design với drawer overlay/persistent
 * - Tab-based navigation (không sử dụng React Router)
 * - Medical light theme với glass morphism design
 *
 * Architecture:
 * - Tương thích với StaffProfile.js tab system
 * - Menu items mapping với renderContent() cases
 * - Responsive behavior: overlay trên mobile, persistent trên desktop
 *
 * Props:
 * - open: boolean - Trạng thái mở/đóng sidebar
 * - onClose: function - Callback để đóng sidebar (mobile)
 * - selectedItem: string - Menu item hiện tại được chọn
 * - onItemSelect: function - Callback khi chọn menu item
 * - user: object - Thông tin user hiện tại
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
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import imageUrl from "@/utils/imageUrl";

// Cấu hình menu items cho Staff
const staffMenuItems = [
  {
    id: "dashboard",
    label: "Bảng điều khiển",
    icon: DashboardIcon,
    description: "Tổng quan hoạt động",
  },
  {
    id: "appointments",
    label: "Lịch hẹn",
    icon: CalendarIcon,
    description: "Quản lý lịch hẹn",
  },
  {
    id: "patients",
    label: "Bệnh nhân",
    icon: PeopleIcon,
    description: "Danh sách bệnh nhân",
  },
  {
    id: "services",
    label: "Dịch vụ",
    icon: HospitalIcon,
    description: "Dịch vụ y tế",
  },
  {
    id: "profile",
    label: "Hồ sơ cá nhân",
    icon: PersonIcon,
    description: "Thông tin cá nhân",
  },
  {
    id: "schedule",
    label: "Lịch làm việc",
    icon: ScheduleIcon,
    description: "Lịch trình làm việc",
  },
  {
    id: "notifications",
    label: "Thông báo",
    icon: NotificationsIcon,
    description: "Thông báo hệ thống",
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: SettingsIcon,
    description: "Cài đặt tài khoản",
  },
];

const StaffSidebar = ({ open, onClose, selectedItem, onItemSelect, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Sidebar content component
  const SidebarContent = () => (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "rgba(255, 255, 255, 0.95)", // Medical glass effect
        backdropFilter: "blur(30px)",
        borderRight: "1px solid rgba(74, 144, 226, 0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header với close button cho mobile */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          borderBottom: "1px solid rgba(74, 144, 226, 0.08)",
        }}
      >
        {/* Logo/Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
            }}
          >
            <BadgeIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>{" "}
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
            Bảng Nhân Viên
          </Typography>
        </Box>

        {/* Close button cho mobile */}
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              color: "#64748B",
              "&:hover": { color: "#4A90E2" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(74, 144, 226, 0.08)",
        }}
      >
        {" "}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={
              user?.avatar ? imageUrl.getFullImageUrl(user.avatar) : undefined
            }
            sx={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
              boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
            }}
          >
            {user?.fullName?.[0] || "S"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#2D3748",
                lineHeight: 1.2,
              }}
            >
              {user?.fullName || "Nhân viên"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.85rem",
              }}
            >
              {user?.email || "staff@hospital.com"}
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Nhân viên"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.75rem",
            boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ px: 2, py: 3 }}>
          {staffMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = selectedItem === item.id;

            return (
              <ListItemButton
                key={item.id}
                onClick={() => onItemSelect(item.id)}
                sx={{
                  borderRadius: "16px",
                  mb: 1,
                  px: 2,
                  py: 1.5,
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(74, 144, 226, 0.2)"
                    : "1px solid transparent",
                  boxShadow: isSelected
                    ? "0 2px 8px rgba(74, 144, 226, 0.15)"
                    : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(74, 144, 226, 0.15), rgba(26, 188, 156, 0.15))"
                      : "rgba(74, 144, 226, 0.05)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: isSelected ? "#4A90E2" : "#64748B",
                  }}
                >
                  <IconComponent />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? "#2D3748" : "#64748B",
                    fontSize: "0.95rem",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.8rem",
                    color: "#94A3B8",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Divider sx={{ borderColor: "rgba(74, 144, 226, 0.08)" }} />
      <Box
        sx={{
          p: 3,
          textAlign: "center",
        }}
      >
        {" "}
        <Typography
          variant="caption"
          sx={{
            color: "#94A3B8",
            fontSize: "0.75rem",
          }}
        >
          Hệ Thống Y Tế v2.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              position: "relative",
              whiteSpace: "nowrap",
              width: 280,
              background: "transparent",
              border: "none",
              boxShadow: "none",
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Cải thiện hiệu suất mở trên mobile
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 280,
              background: "transparent",
              border: "none",
              boxShadow: "none",
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}
    </>
  );
};

export default StaffSidebar;

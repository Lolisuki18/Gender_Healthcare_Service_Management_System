/**
 * ConsultantSideBar Component
 *
 * Medical Light Theme Sidebar for Consultant Profile
 * Provides navigation menu with medical-themed styling and consistent color scheme
 *
 * Features:
 * - Medical light theme with professional healthcare colors
 * - Responsive design for mobile and desktop
 * - Expandable menu items with smooth animations
 * - User profile section with medical styling
 * - Consistent with CustomerProfile and AdminProfile themes
 */

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  Collapse,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  Chat as ChatIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  LocalHospital as HospitalIcon,
  Psychology as PsychologyIcon,
  Medication as MedicationIcon,
  MonitorHeart as MonitorIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import localStorageUtil from "@/utils/localStorage";
import imageUrl from "@/utils/imageUrl";

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg, #f0f8ff 0%, #e6f3ff 25%, #f5fafe 75%, #ffffff 100%)",
    borderRight: "1px solid rgba(74, 144, 226, 0.12)",
    color: "#2D3748",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 20px rgba(74, 144, 226, 0.08)",
  },
}));

const UserProfile = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  background: "rgba(74, 144, 226, 0.04)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(74, 144, 226, 0.12)",
  position: "relative",
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  minHeight: "48px",
  "&:hover": {
    backgroundColor: "rgba(74, 144, 226, 0.08)",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(74, 144, 226, 0.15)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 144, 226, 0.12)",
    borderLeft: "3px solid #4A90E2",
    "&:hover": {
      backgroundColor: "rgba(74, 144, 226, 0.16)",
    },
    "& .MuiListItemIcon-root": {
      color: "#4A90E2",
    },
    "& .MuiListItemText-primary": {
      color: "#2D3748",
      fontWeight: 600,
    },
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderBottom: "1px solid rgba(74, 144, 226, 0.12)",
  background: "rgba(74, 144, 226, 0.04)",
}));

const ConsultantSidebar = ({ open, onClose, selectedItem, onItemSelect }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const handleExpandClick = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: <DashboardIcon />,
      path: "/consultant/dashboard",
    },
    {
      id: "appointments",
      label: "Lịch khám",
      icon: <CalendarIcon />,
      subItems: [
        {
          id: "today-appointments",
          label: "Lịch hôm nay",
          path: "/consultant/appointments/today",
        },
        {
          id: "upcoming-appointments",
          label: "Lịch sắp tới",
          path: "/consultant/appointments/upcoming",
        },
        {
          id: "appointment-history",
          label: "Lịch sử khám",
          path: "/consultant/appointments/history",
        },
        {
          id: "schedule-management",
          label: "Quản lý lịch trình",
          path: "/consultant/appointments/schedule",
        },
      ],
    },
    {
      id: "patients",
      label: "Bệnh nhân",
      icon: <PeopleIcon />,
      subItems: [
        {
          id: "my-patients",
          label: "Bệnh nhân của tôi",
          path: "/consultant/patients/my-patients",
        },
        {
          id: "patient-records",
          label: "Hồ sơ bệnh án",
          path: "/consultant/patients/records",
        },
        {
          id: "patient-notes",
          label: "Ghi chú điều trị",
          path: "/consultant/patients/notes",
        },
        {
          id: "follow-up",
          label: "Theo dõi sau điều trị",
          path: "/consultant/patients/follow-up",
        },
      ],
    },
    {
      id: "consultations",
      label: "Tư vấn",
      icon: <MedicalIcon />,
      subItems: [
        {
          id: "online-consultation",
          label: "Tư vấn trực tuyến",
          path: "/consultant/consultations/online",
        },
        {
          id: "video-calls",
          label: "Video call",
          path: "/consultant/consultations/video",
        },
        {
          id: "chat-support",
          label: "Chat hỗ trợ",
          path: "/consultant/consultations/chat",
        },
        {
          id: "consultation-history",
          label: "Lịch sử tư vấn",
          path: "/consultant/consultations/history",
        },
      ],
    },
    {
      id: "medical-services",
      label: "Dịch vụ y tế",
      icon: <HospitalIcon />,
      subItems: [
        {
          id: "health-checkup",
          label: "Khám sức khỏe",
          path: "/consultant/services/checkup",
        },
        {
          id: "specialized-care",
          label: "Chuyên khoa",
          path: "/consultant/services/specialized",
        },
        {
          id: "preventive-care",
          label: "Chăm sóc dự phòng",
          path: "/consultant/services/preventive",
        },
        {
          id: "health-monitoring",
          label: "Theo dõi sức khỏe",
          path: "/consultant/services/monitoring",
        },
      ],
    },
    {
      id: "prescriptions",
      label: "Đơn thuốc",
      icon: <MedicationIcon />,
      subItems: [
        {
          id: "create-prescription",
          label: "Tạo đơn thuốc",
          path: "/consultant/prescriptions/create",
        },
        {
          id: "prescription-history",
          label: "Lịch sử đơn thuốc",
          path: "/consultant/prescriptions/history",
        },
        {
          id: "medication-interaction",
          label: "Kiểm tra tương tác thuốc",
          path: "/consultant/prescriptions/interaction",
        },
      ],
    },
    {
      id: "health-monitoring",
      label: "Giám sát sức khỏe",
      icon: <MonitorIcon />,
      subItems: [
        {
          id: "vital-signs",
          label: "Chỉ số sinh hiệu",
          path: "/consultant/monitoring/vitals",
        },
        {
          id: "health-trends",
          label: "Xu hướng sức khỏe",
          path: "/consultant/monitoring/trends",
        },
        {
          id: "alerts",
          label: "Cảnh báo y tế",
          path: "/consultant/monitoring/alerts",
        },
      ],
    },
    {
      id: "psychology",
      label: "Tâm lý học",
      icon: <PsychologyIcon />,
      subItems: [
        {
          id: "mental-health",
          label: "Sức khỏe tinh thần",
          path: "/consultant/psychology/mental-health",
        },
        {
          id: "counseling",
          label: "Tư vấn tâm lý",
          path: "/consultant/psychology/counseling",
        },
        {
          id: "therapy-sessions",
          label: "Phiên trị liệu",
          path: "/consultant/psychology/therapy",
        },
      ],
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: <ReportsIcon />,
      subItems: [
        {
          id: "patient-reports",
          label: "Báo cáo bệnh nhân",
          path: "/consultant/reports/patients",
        },
        {
          id: "consultation-reports",
          label: "Báo cáo tư vấn",
          path: "/consultant/reports/consultations",
        },
        {
          id: "performance-reports",
          label: "Báo cáo hiệu suất",
          path: "/consultant/reports/performance",
        },
      ],
    },
    {
      id: "earnings",
      label: "Thu nhập",
      icon: <PaymentIcon />,
      subItems: [
        {
          id: "consultation-fees",
          label: "Phí tư vấn",
          path: "/consultant/earnings/fees",
        },
        {
          id: "payment-history",
          label: "Lịch sử thanh toán",
          path: "/consultant/earnings/history",
        },
        {
          id: "financial-reports",
          label: "Báo cáo tài chính",
          path: "/consultant/earnings/reports",
        },
      ],
    },
    {
      id: "communications",
      label: "Liên lạc",
      icon: <ChatIcon />,
      subItems: [
        {
          id: "messages",
          label: "Tin nhắn",
          path: "/consultant/communications/messages",
        },
        {
          id: "video-calls-management",
          label: "Quản lý video call",
          path: "/consultant/communications/video",
        },
        {
          id: "notifications-management",
          label: "Quản lý thông báo",
          path: "/consultant/communications/notifications",
        },
      ],
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <SettingsIcon />,
      subItems: [
        {
          id: "availability",
          label: "Thời gian làm việc",
          path: "/consultant/settings/availability",
        },
        {
          id: "consultation-rates",
          label: "Mức phí tư vấn",
          path: "/consultant/settings/rates",
        },
        {
          id: "notification-preferences",
          label: "Tùy chọn thông báo",
          path: "/consultant/settings/notifications",
        },
      ],
    },
    {
      id: "profile",
      label: "Hồ sơ cá nhân",
      icon: <PersonIcon />,
      path: "/consultant/profile",
    },
  ];

  const userData = localStorageUtil.get("user");

  const handleItemClick = (item) => {
    if (item.subItems) {
      handleExpandClick(item.id);
    } else {
      onItemSelect(item.id);
      if (window.innerWidth < 900) {
        onClose();
      }
    }
  };

  return (
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        display: { xs: open ? "block" : "none", md: "block" },
        "& .MuiDrawer-paper": {
          position: { xs: "fixed", md: "relative" },
          zIndex: { xs: 1300, md: "auto" },
        },
      }}
    >
      {" "}
      {/* Header with close button for mobile */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid rgba(74, 144, 226, 0.12)",
          background: "rgba(74, 144, 226, 0.04)",
        }}
      >
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
          Consultant Panel
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#4A90E2" }}>
          <CloseIcon />
        </IconButton>
      </Box>{" "}
      {/* Logo Section for Desktop */}
      <LogoSection sx={{ display: { xs: "none", md: "block" } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Consultant Panel
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#718096",
            fontSize: "12px",
          }}
        >
          Healthcare Consultation System
        </Typography>
      </LogoSection>{" "}
      {/* User Profile Section */}
      <UserProfile>
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            src={
              userData?.avatar
                ? imageUrl.getFullImageUrl(userData.avatar)
                : undefined
            }
            sx={{
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              margin: "0 auto",
              background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(74, 144, 226, 0.25)",
              border: "3px solid rgba(74, 144, 226, 0.1)",
            }}
          >
            {userData?.avatar
              ? ""
              : userData?.fullName?.[0] || (
                  <MedicalIcon
                    sx={{
                      fontSize: { xs: "24px", md: "32px" },
                      color: "#ffffff",
                    }}
                  />
                )}
          </Avatar>
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              right: "50%",
              transform: "translateX(50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(74, 144, 226, 0.2)",
              boxShadow: "0 2px 8px rgba(74, 144, 226, 0.3)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: "16px", md: "18px" },
            color: "#2D3748",
          }}
        >
          Dr. {userData?.fullName || userData?.username || "Doctor"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#718096",
            fontSize: "13px",
            mb: 1,
            wordBreak: "break-all",
          }}
        >
          {userData?.email || "doctor@healthcare.com"}
        </Typography>
        <Chip
          label="Bác sĩ tư vấn"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #4CAF50, #2ECC71)",
            color: "#fff",
            fontWeight: 500,
            fontSize: "11px",
            height: "24px",
            boxShadow: "0 2px 8px rgba(76, 175, 80, 0.25)",
          }}
        />
      </UserProfile>
      {/* Navigation Menu */}
      <List
        sx={{
          px: 1,
          py: 2,
          flexGrow: 1,
          maxHeight: "calc(100vh - 280px)",
          overflowY: "auto",
        }}
      >
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <StyledListItem
                selected={selectedItem === item.id}
                onClick={() => handleItemClick(item)}
              >
                {" "}
                <ListItemIcon
                  sx={{
                    color: selectedItem === item.id ? "#4A90E2" : "#718096",
                    minWidth: 40,
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "14px",
                      fontWeight: selectedItem === item.id ? 600 : 500,
                      color: selectedItem === item.id ? "#2D3748" : "#718096",
                      transition: "all 0.3s ease",
                    },
                  }}
                />
                {item.subItems && (
                  <Box sx={{ color: "#718096" }}>
                    {expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </StyledListItem>
            </ListItem>

            {/* Sub Items */}
            {item.subItems && (
              <Collapse
                in={expandedItems[item.id]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <StyledListItem
                        selected={selectedItem === subItem.id}
                        onClick={() => onItemSelect(subItem.id)}
                        sx={{
                          pl: 6,
                          ml: 1,
                          mr: 1,
                          borderLeft:
                            selectedItem === subItem.id
                              ? "2px solid #4A90E2"
                              : "2px solid transparent",
                        }}
                      >
                        <ListItemText
                          primary={subItem.label}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: "13px",
                              fontWeight:
                                selectedItem === subItem.id ? 600 : 400,
                              color:
                                selectedItem === subItem.id
                                  ? "#2D3748"
                                  : "#718096",
                              transition: "all 0.3s ease",
                            },
                          }}
                        />
                      </StyledListItem>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(74, 144, 226, 0.12)", mx: 2 }} />
    </StyledDrawer>
  );
};

export default ConsultantSidebar;

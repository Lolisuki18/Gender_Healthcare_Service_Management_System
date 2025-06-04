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
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Support as SupportIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManageAccountsIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import localStorageUtil from "@/utils/localStorage";

const drawerWidth = 280;

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
  },
}));

const UserProfile = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  position: "relative",
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  minHeight: "48px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderLeft: "3px solid #3b82f6",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
    },
    "& .MuiListItemIcon-root": {
      color: "#3b82f6",
    },
    "& .MuiListItemText-primary": {
      color: "#fff",
      fontWeight: 600,
    },
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.02)",
}));

const AdminSidebar = ({ open, onClose, selectedItem, onItemSelect }) => {
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
      path: "/admin/dashboard",
    },
    {
      id: "user-management",
      label: "Quản lý người dùng",
      icon: <ManageAccountsIcon />,
      subItems: [
        {
          id: "all-users",
          label: "Tất cả người dùng",
          path: "/admin/users/all",
        },
        {
          id: "customers",
          label: "Khách hàng",
          path: "/admin/users/customers",
        },
        {
          id: "consultants",
          label: "Bác sĩ tư vấn",
          path: "/admin/users/consultants",
        },
        {
          id: "staff",
          label: "Nhân viên",
          path: "/admin/users/staff",
        },
        {
          id: "admins",
          label: "Quản trị viên",
          path: "/admin/users/admins",
        },
      ],
    },
    {
      id: "healthcare-services",
      label: "Dịch vụ y tế",
      icon: <HospitalIcon />,
      subItems: [
        {
          id: "services",
          label: "Quản lý dịch vụ",
          path: "/admin/services/manage",
        },
        {
          id: "service-categories",
          label: "Danh mục dịch vụ",
          path: "/admin/services/categories",
        },
        {
          id: "pricing",
          label: "Quản lý giá",
          path: "/admin/services/pricing",
        },
      ],
    },
    {
      id: "appointments",
      label: "Quản lý lịch hẹn",
      icon: <CalendarIcon />,
      subItems: [
        {
          id: "all-appointments",
          label: "Tất cả lịch hẹn",
          path: "/admin/appointments/all",
        },
        {
          id: "pending-appointments",
          label: "Lịch hẹn chờ duyệt",
          path: "/admin/appointments/pending",
        },
        {
          id: "schedule-management",
          label: "Quản lý lịch trình",
          path: "/admin/appointments/schedule",
        },
      ],
    },
    {
      id: "financial",
      label: "Quản lý tài chính",
      icon: <PaymentIcon />,
      subItems: [
        {
          id: "payments",
          label: "Thanh toán",
          path: "/admin/financial/payments",
        },
        {
          id: "invoices",
          label: "Hóa đơn",
          path: "/admin/financial/invoices",
        },
        {
          id: "revenue",
          label: "Doanh thu",
          path: "/admin/financial/revenue",
        },
        {
          id: "refunds",
          label: "Hoàn tiền",
          path: "/admin/financial/refunds",
        },
      ],
    },
    {
      id: "reports-analytics",
      label: "Báo cáo & Phân tích",
      icon: <AnalyticsIcon />,
      subItems: [
        {
          id: "user-reports",
          label: "Báo cáo người dùng",
          path: "/admin/reports/users",
        },
        {
          id: "service-reports",
          label: "Báo cáo dịch vụ",
          path: "/admin/reports/services",
        },
        {
          id: "financial-reports",
          label: "Báo cáo tài chính",
          path: "/admin/reports/financial",
        },
        {
          id: "performance",
          label: "Hiệu suất hệ thống",
          path: "/admin/reports/performance",
        },
      ],
    },
    {
      id: "business-management",
      label: "Quản lý doanh nghiệp",
      icon: <BusinessIcon />,
      subItems: [
        {
          id: "branches",
          label: "Chi nhánh",
          path: "/admin/business/branches",
        },
        {
          id: "departments",
          label: "Phòng ban",
          path: "/admin/business/departments",
        },
        {
          id: "working-hours",
          label: "Giờ làm việc",
          path: "/admin/business/hours",
        },
      ],
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <SecurityIcon />,
      subItems: [
        {
          id: "access-control",
          label: "Kiểm soát truy cập",
          path: "/admin/security/access",
        },
        {
          id: "audit-logs",
          label: "Nhật ký kiểm tra",
          path: "/admin/security/logs",
        },
        {
          id: "permissions",
          label: "Phân quyền",
          path: "/admin/security/permissions",
        },
      ],
    },
    {
      id: "notifications",
      label: "Thông báo hệ thống",
      icon: <NotificationsIcon />,
      path: "/admin/notifications",
    },
    {
      id: "support",
      label: "Hỗ trợ khách hàng",
      icon: <SupportIcon />,
      subItems: [
        {
          id: "tickets",
          label: "Ticket hỗ trợ",
          path: "/admin/support/tickets",
        },
        {
          id: "faq",
          label: "Câu hỏi thường gặp",
          path: "/admin/support/faq",
        },
        {
          id: "feedback",
          label: "Phản hồi khách hàng",
          path: "/admin/support/feedback",
        },
      ],
    },
    {
      id: "system-settings",
      label: "Cài đặt hệ thống",
      icon: <SettingsIcon />,
      subItems: [
        {
          id: "general-settings",
          label: "Cài đặt chung",
          path: "/admin/settings/general",
        },
        {
          id: "email-settings",
          label: "Cài đặt email",
          path: "/admin/settings/email",
        },
        {
          id: "backup",
          label: "Sao lưu dữ liệu",
          path: "/admin/settings/backup",
        },
        {
          id: "maintenance",
          label: "Bảo trì hệ thống",
          path: "/admin/settings/maintenance",
        },
      ],
    },
    {
      id: "profile",
      label: "Hồ sơ cá nhân",
      icon: <PersonIcon />,
      path: "/admin/profile",
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
      {/* Header with close button for mobile */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
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
          Admin Panel
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Logo Section for Desktop */}
      <LogoSection sx={{ display: { xs: "none", md: "block" } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Admin Panel
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "12px",
          }}
        >
          Healthcare Management System
        </Typography>
      </LogoSection>

      {/* User Profile Section */}
      <UserProfile>
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            sx={{
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              margin: "0 auto",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(239, 68, 68, 0.3)",
              border: "3px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <AdminIcon sx={{ fontSize: { xs: "24px", md: "32px" } }} />
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
              background: "linear-gradient(45deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
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
          }}
        >
          {userData?.fullName || userData?.username || "Administrator"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "13px",
            mb: 1,
            wordBreak: "break-all",
          }}
        >
          {userData?.email || "admin@healthcare.com"}
        </Typography>
        <Chip
          label="Quản trị viên"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #ef4444, #dc2626)",
            color: "#fff",
            fontWeight: 500,
            fontSize: "11px",
            height: "24px",
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
                <ListItemIcon
                  sx={{
                    color:
                      selectedItem === item.id
                        ? "#3b82f6"
                        : "rgba(255, 255, 255, 0.7)",
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
                      color:
                        selectedItem === item.id
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                    },
                  }}
                />
                {item.subItems && (
                  <Box sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
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
                              ? "2px solid #3b82f6"
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
                                  ? "#fff"
                                  : "rgba(255, 255, 255, 0.7)",
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

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mx: 2 }} />
    </StyledDrawer>
  );
};

export default AdminSidebar;

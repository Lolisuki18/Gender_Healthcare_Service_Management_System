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
  Assignment as TaskIcon,
  Schedule as ScheduleIcon,
  Group as TeamIcon,
  Work as WorkIcon,
  AccessTime as TimeIcon,
  AssignmentTurnedIn as CompletedIcon,
  AssignmentLate as PendingIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  LocalHospital as HospitalIcon,
  BusinessCenter as DepartmentIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  EventNote as EventIcon,
  Assessment as ReportsIcon,
  Psychology as TrainingIcon,
  HealthAndSafety as SafetyIcon,
  Inventory as InventoryIcon,
  Receipt as PayrollIcon,
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
    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(249, 115, 22, 0.15)",
    borderLeft: "3px solid #f97316",
    "&:hover": {
      backgroundColor: "rgba(249, 115, 22, 0.2)",
    },
    "& .MuiListItemIcon-root": {
      color: "#f97316",
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

const StaffSidebar = ({ open, onClose, selectedItem, onItemSelect }) => {
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
      path: "/staff/dashboard",
    },
    {
      id: "tasks",
      label: "Nhiệm vụ",
      icon: <TaskIcon />,
      subItems: [
        {
          id: "my-tasks",
          label: "Nhiệm vụ của tôi",
          path: "/staff/tasks/my-tasks",
        },
        {
          id: "completed-tasks",
          label: "Đã hoàn thành",
          path: "/staff/tasks/completed",
        },
        {
          id: "pending-tasks",
          label: "Đang chờ",
          path: "/staff/tasks/pending",
        },
        {
          id: "overdue-tasks",
          label: "Quá hạn",
          path: "/staff/tasks/overdue",
        },
      ],
    },
    {
      id: "schedule",
      label: "Lịch làm việc",
      icon: <ScheduleIcon />,
      subItems: [
        {
          id: "my-schedule",
          label: "Lịch của tôi",
          path: "/staff/schedule/my-schedule",
        },
        {
          id: "shift-management",
          label: "Quản lý ca",
          path: "/staff/schedule/shifts",
        },
        {
          id: "time-tracking",
          label: "Chấm công",
          path: "/staff/schedule/time-tracking",
        },
        {
          id: "leave-requests",
          label: "Xin nghỉ phép",
          path: "/staff/schedule/leave",
        },
      ],
    },
    {
      id: "patients",
      label: "Bệnh nhân",
      icon: <PeopleIcon />,
      subItems: [
        {
          id: "patient-registration",
          label: "Đăng ký bệnh nhân",
          path: "/staff/patients/registration",
        },
        {
          id: "patient-records",
          label: "Hồ sơ bệnh nhân",
          path: "/staff/patients/records",
        },
        {
          id: "appointments",
          label: "Lịch hẹn",
          path: "/staff/patients/appointments",
        },
        {
          id: "patient-support",
          label: "Hỗ trợ bệnh nhân",
          path: "/staff/patients/support",
        },
      ],
    },
    {
      id: "department",
      label: "Phòng ban",
      icon: <DepartmentIcon />,
      subItems: [
        {
          id: "department-info",
          label: "Thông tin phòng ban",
          path: "/staff/department/info",
        },
        {
          id: "team-members",
          label: "Thành viên",
          path: "/staff/department/team",
        },
        {
          id: "department-meetings",
          label: "Họp phòng ban",
          path: "/staff/department/meetings",
        },
        {
          id: "department-resources",
          label: "Tài nguyên",
          path: "/staff/department/resources",
        },
      ],
    },
    {
      id: "inventory",
      label: "Kho vật tư",
      icon: <InventoryIcon />,
      subItems: [
        {
          id: "stock-check",
          label: "Kiểm kho",
          path: "/staff/inventory/stock-check",
        },
        {
          id: "supply-requests",
          label: "Yêu cầu vật tư",
          path: "/staff/inventory/requests",
        },
        {
          id: "equipment-maintenance",
          label: "Bảo trì thiết bị",
          path: "/staff/inventory/maintenance",
        },
      ],
    },
    {
      id: "communications",
      label: "Liên lạc",
      icon: <ChatIcon />,
      subItems: [
        {
          id: "team-chat",
          label: "Chat nhóm",
          path: "/staff/communications/chat",
        },
        {
          id: "announcements",
          label: "Thông báo",
          path: "/staff/communications/announcements",
        },
        {
          id: "internal-messages",
          label: "Tin nhắn nội bộ",
          path: "/staff/communications/messages",
        },
      ],
    },
    {
      id: "training",
      label: "Đào tạo",
      icon: <TrainingIcon />,
      subItems: [
        {
          id: "training-courses",
          label: "Khóa đào tạo",
          path: "/staff/training/courses",
        },
        {
          id: "certifications",
          label: "Chứng chỉ",
          path: "/staff/training/certifications",
        },
        {
          id: "skill-development",
          label: "Phát triển kỹ năng",
          path: "/staff/training/skills",
        },
      ],
    },
    {
      id: "safety",
      label: "An toàn lao động",
      icon: <SafetyIcon />,
      subItems: [
        {
          id: "safety-protocols",
          label: "Quy trình an toàn",
          path: "/staff/safety/protocols",
        },
        {
          id: "incident-reporting",
          label: "Báo cáo sự cố",
          path: "/staff/safety/incidents",
        },
        {
          id: "safety-training",
          label: "Đào tạo an toàn",
          path: "/staff/safety/training",
        },
      ],
    },
    {
      id: "payroll",
      label: "Lương & Phúc lợi",
      icon: <PayrollIcon />,
      subItems: [
        {
          id: "payslips",
          label: "Phiếu lương",
          path: "/staff/payroll/payslips",
        },
        {
          id: "benefits",
          label: "Phúc lợi",
          path: "/staff/payroll/benefits",
        },
        {
          id: "overtime",
          label: "Làm thêm giờ",
          path: "/staff/payroll/overtime",
        },
      ],
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: <ReportsIcon />,
      subItems: [
        {
          id: "daily-reports",
          label: "Báo cáo hàng ngày",
          path: "/staff/reports/daily",
        },
        {
          id: "performance-reports",
          label: "Báo cáo hiệu suất",
          path: "/staff/reports/performance",
        },
        {
          id: "attendance-reports",
          label: "Báo cáo chấm công",
          path: "/staff/reports/attendance",
        },
      ],
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <SettingsIcon />,
      subItems: [
        {
          id: "personal-settings",
          label: "Cài đặt cá nhân",
          path: "/staff/settings/personal",
        },
        {
          id: "notification-settings",
          label: "Cài đặt thông báo",
          path: "/staff/settings/notifications",
        },
        {
          id: "password-change",
          label: "Đổi mật khẩu",
          path: "/staff/settings/password",
        },
      ],
    },
    {
      id: "profile",
      label: "Hồ sơ cá nhân",
      icon: <PersonIcon />,
      path: "/staff/profile",
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
            background: "linear-gradient(45deg, #f97316, #ea580c)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Staff Panel
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
            background: "linear-gradient(45deg, #f97316, #ea580c)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Staff Panel
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
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3)",
              border: "3px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <WorkIcon sx={{ fontSize: { xs: "24px", md: "32px" } }} />
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
              background: "linear-gradient(45deg, #22c55e, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
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
          {userData?.fullName || userData?.username || "Staff"}
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
          {userData?.email || "staff@healthcare.com"}
        </Typography>
        <Chip
          label="Nhân viên y tế"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #f97316, #ea580c)",
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
                        ? "#f97316"
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
                              ? "2px solid #f97316"
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

export default StaffSidebar;

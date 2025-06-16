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
 *
 * Updated to match the menu in the attachment
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
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Science as ScienceIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Star as StarIcon,
  ExpandLess,
  ExpandMore,
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
  }; // Updated menu items to match the menu in attachment
  const menuItems = [
    {
      id: "my-questions",
      label: "Câu hỏi của tôi",
      icon: <HelpIcon />,
      path: "/consultant/my-questions",
    },
    {
      id: "consultant-profile",
      label: "Hồ sơ chuyên gia",
      icon: <PersonIcon />,
      path: "/consultant/profile",
    },
    {
      id: "answer-questions",
      label: "Trả lời câu hỏi",
      icon: <QuestionAnswerIcon />,
      path: "/consultant/answer-questions",
    },
    {
      id: "my-consultations",
      label: "Lịch tư vấn của tôi",
      icon: <CalendarIcon />,
      path: "/consultant/my-consultations",
    },
    {
      id: "sti-tests",
      label: "Quản lý STI Tests",
      icon: <ScienceIcon />,
      path: "/consultant/sti-tests",
    },
    {
      id: "my-reviews",
      label: "Đánh giá của tôi",
      icon: <StarIcon />,
      path: "/consultant/my-reviews",
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

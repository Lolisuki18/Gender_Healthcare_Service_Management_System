/**
 * CustomerSideBar.js - Component điều hướng chính cho khách hàng
 *
 * Chức năng:
 * - Hiển thị menu navigation với icons và labels
 * - Quản lý trạng thái active/selected của menu items
 * - Responsive design: drawer trên mobile, persistent trên desktop
 * - Hiển thị thông tin user profile với avatar và status
 * - Hỗ trợ sub-menu expandable cho các nhóm chức năng
 *
 * Design Pattern:
 * - Material-UI Drawer component với custom styling
 * - Glass morphism effect với backdrop blur
 * - Smooth transitions và hover effects
 * - Gradient backgrounds và modern UI elements
 *
 * Props:
 * - open: boolean - Trạng thái mở/đóng sidebar
 * - onClose: function - Callback để đóng sidebar (mobile)
 * - selectedItem: string - Menu item hiện tại được chọn
 * - onItemSelect: function - Callback khi chọn menu item
 *
 * State:
 * - expandedItems: object - Trạng thái mở/đóng của sub-menus
 */

import React, { useEffect, useState } from "react";
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
  History as HistoryIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import localStorageUtil from "@/utils/localStorage";
import imageUrl from "@/utils/imageUrl";
import { listenToAvatarUpdates } from "@/utils/storageEvent";

// Constants
const drawerWidth = 280; // Chiều rộng cố định của sidebar

// Styled Components với Material-UI emotion
// Custom Drawer với medical theme và glass morphism
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background:
      "linear-gradient(165deg, #F5F7FA 0%, #E3F2FD 50%, #F5F7FA 100%)",
    borderRight: "1px solid rgba(74, 144, 226, 0.15)",
    color: "#2D3748",
    backdropFilter: "blur(20px)",
  },
}));

// User profile section styling
const UserProfile = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(74, 144, 226, 0.15)",
  position: "relative",
}));

// Custom styled list item với hover effects và transitions
const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s ease", // Smooth transitions
  minHeight: "48px",
  "&:hover": {
    backgroundColor: "rgba(74, 144, 226, 0.08)", // Light medical blue hover
    transform: "translateX(4px)", // Subtle slide effect
    boxShadow: "0 4px 12px rgba(74, 144, 226, 0.15)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 144, 226, 0.15)", // Medical blue selected    borderLeft: "3px solid #4A90E2", // Medical blue border
    "&:hover": {
      backgroundColor: "rgba(74, 144, 226, 0.2)", // Lighter medical blue hover
    },
    "& .MuiListItemIcon-root": {
      color: "#4A90E2", // Medical blue icon
    },
    "& .MuiListItemText-primary": {
      color: "#2D3748", // Dark text for medical theme
      fontWeight: 600,
    },
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderBottom: "1px solid rgba(74, 144, 226, 0.15)", // Medical blue border
  background: "rgba(255, 255, 255, 0.8)", // Light background for medical theme
}));

const CustomerSidebar = ({ open, onClose, selectedItem, onItemSelect }) => {
  // State để quản lý việc mở/đóng sub-menus
  const [expandedItems, setExpandedItems] = useState({});
  const [userData, setUserData] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Handler để toggle sub-menu expansion
  const handleExpandClick = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Cấu hình menu items với icons và paths
  // Mỗi item có thể có sub-items cho menu phân cấp
  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: <DashboardIcon />,
      path: "/customer/dashboard", // Path không được sử dụng (tab-based navigation)
    },
    {
      id: "profile",
      label: "Hồ sơ cá nhân",
      icon: <PersonIcon />,
      path: "/customer/profile",
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <LockIcon />,
      path: "/customer/security",
    },
    {
      id: "appointments",
      label: "Lịch hẹn",
      icon: <CalendarIcon />,
      path: "/customer/appointments", // Note: Hiện tại dùng tab system
    },
    {
      id: "medical-history",
      label: "Lịch sử khám",
      icon: <HistoryIcon />,
      path: "/customer/medical-history",
    },
    {
      id: "payments",
      label: "Thanh toán",
      icon: <PaymentIcon />,
      // Sub-menu cho các chức năng thanh toán
      subItems: [
        {
          id: "payment-history",
          label: "Lịch sử thanh toán",
          path: "/customer/payments/history",
        },
        {
          id: "invoices",
          label: "Hóa đơn",
          path: "/customer/payments/invoices",
        },
      ],
    },
    {
      id: "notifications",
      label: "Thông báo",
      icon: <NotificationsIcon />,
      path: "/customer/notifications",
    },
    {
      id: "help",
      label: "Trợ giúp",
      icon: <HelpIcon />,
      path: "/customer/help",
    },
    {
      id: "questions",
      label: "Câu hỏi đã đặt",
      icon: <QuestionIcon />,
      path: "/customer/questions",
    },
  ]; // Thêm useState để quản lý key để force re-render component
  const [refreshKey, setRefreshKey] = useState(0);

  // Hàm force refresh component khi cần
  const forceRefresh = () => setRefreshKey((old) => old + 1);
  useEffect(() => {
    const refreshUserData = () => {
      try {
        const userProfileFromStorage = localStorageUtil.get("userProfile");
        const userDataFromStorage = localStorageUtil.get("user");

        setUserProfile(userProfileFromStorage || {});
        setUserData(userDataFromStorage || {});

        // Ưu tiên lấy avatar từ userProfile theo thứ tự
        if (userProfileFromStorage?.data?.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(
            userProfileFromStorage.data.avatar
          );
          console.log(
            "CustomerSidebar: Setting avatar from userProfile.data:",
            fullAvatarUrl
          );
          setAvatarUrl(fullAvatarUrl);

          // Lưu vào sessionStorage để đồng bộ giữa các component
          sessionStorage.setItem(
            "last_updated_avatar",
            userProfileFromStorage.data.avatar
          );
        } else if (userProfileFromStorage?.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(
            userProfileFromStorage.avatar
          );
          console.log(
            "CustomerSidebar: Setting avatar from userProfile root:",
            fullAvatarUrl
          );
          setAvatarUrl(fullAvatarUrl);

          // Lưu vào sessionStorage để đồng bộ
          sessionStorage.setItem(
            "last_updated_avatar",
            userProfileFromStorage.avatar
          );
        } else if (userDataFromStorage?.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(
            userDataFromStorage.avatar
          );
          console.log(
            "CustomerSidebar: Setting avatar from userData:",
            fullAvatarUrl
          );
          setAvatarUrl(fullAvatarUrl);
        }

        // Force refresh để đảm bảo UI cập nhật
        forceRefresh();
      } catch (error) {
        console.error("Error refreshing user data in CustomerSidebar:", error);
      }
    };

    refreshUserData();

    // Lắng nghe sự kiện storage để cập nhật khi localStorage thay đổi
    const handleStorageChange = (e) => {
      console.log("Storage event detected in CustomerSidebar:", e.key);
      if (
        e.key === "userProfile" ||
        e.key === "avatar_sync_trigger" ||
        e.key === "last_updated_avatar" ||
        e.key === "user"
      ) {
        console.log(
          "Avatar update detected via storage event in CustomerSidebar"
        );
        refreshUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe sự kiện direct update
    const handleDirectAvatarUpdate = (event) => {
      console.log(
        "Direct avatar update event received in CustomerSidebar:",
        event.detail
      );
      if (event.detail && event.detail.avatarUrl) {
        refreshUserData();
      }
    };

    window.addEventListener("avatar_updated", handleDirectAvatarUpdate);

    // Đăng ký lắng nghe sự kiện cập nhật avatar từ hệ thống event
    const unsubscribe = listenToAvatarUpdates((newAvatarUrl) => {
      console.log(
        "Avatar update from listenToAvatarUpdates in CustomerSidebar:",
        newAvatarUrl
      );
      refreshUserData();
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up event listeners in CustomerSidebar");
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("avatar_updated", handleDirectAvatarUpdate);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Thêm dòng trống này để tách các hooks ra

  // Final check for avatar data from localStorage after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const freshUserProfile = localStorageUtil.get("userProfile");

      // Update if we have fresh data with avatar
      if (freshUserProfile?.data?.avatar || freshUserProfile?.avatar) {
        setUserProfile(freshUserProfile);

        if (freshUserProfile?.data?.avatar) {
          setAvatarUrl(imageUrl.getFullImageUrl(freshUserProfile.data.avatar));
        } else if (freshUserProfile?.avatar) {
          setAvatarUrl(imageUrl.getFullImageUrl(freshUserProfile.avatar));
        }
      }
    }, 500); // Reduced timeout for faster UI update

    return () => clearTimeout(timer);
  }, []);
  // This commented section has been removed as it's no longer needed
  // The avatar synchronization is now handled by the storageEvent.js utility

  // Handler cho việc click menu item
  // Phân biệt giữa item có sub-menu và item thường
  const handleItemClick = (item) => {
    if (item.subItems) {
      // Nếu có sub-menu, toggle expansion
      handleExpandClick(item.id);
    } else {
      // Nếu không có sub-menu, chọn item và đóng sidebar (mobile)
      onItemSelect(item.id);

      // Đóng sidebar trên mobile sau khi chọn
      if (window.innerWidth < 900) {
        onClose();
      }
      // window.location.reload(); // Tải lại trang để cập nhật avatar mới
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
          Healthcare
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Logo Section for Desktop */}
      <LogoSection sx={{ display: { xs: "none", md: "block" } }}>
        {" "}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical blue to teal
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Healthcare
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#607D8B", // Blue-gray for text
            fontSize: "12px",
          }}
        >
          Gender Healthcare Service
        </Typography>
      </LogoSection>

      {/* User Profile Section */}
      <UserProfile>
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          {" "}
          <Avatar
            src={(() => {
              // Ưu tiên lấy trực tiếp từ userProfile mới nhất trong localStorage
              const freshUserProfile = localStorageUtil.get("userProfile");
              if (freshUserProfile?.data?.avatar) {
                return imageUrl.getFullImageUrl(freshUserProfile.data.avatar);
              } else if (freshUserProfile?.avatar) {
                return imageUrl.getFullImageUrl(freshUserProfile.avatar);
              }

              // Nếu không có trong localStorage thì dùng state
              return avatarUrl;
            })()}
            alt={userProfile?.data?.fullName || userProfile?.fullName || "User"}
            imgProps={{
              loading: "eager",
              // Force refresh avatar on each render by adding timestamp
              key: `sidebar-avatar-${Date.now()}-${refreshKey}`,
              onError: () => {
                console.log("CustomerSidebar avatar failed to load");
                forceRefresh();
              },
              onLoad: () => {
                console.log("CustomerSidebar avatar loaded successfully");
              },
            }}
            sx={{
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              margin: "0 auto",
              background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(74, 144, 226, 0.3)",
              border: "3px solid rgba(255, 255, 255, 0.6)", // Light border for medical theme
            }}
          >
            {!avatarUrl && !userProfile?.avatar && !userProfile?.data?.avatar
              ? userProfile?.data?.fullName?.[0] ||
                userProfile?.fullName?.[0] ||
                userProfile?.data?.email?.[0] ||
                userProfile?.email?.[0] ||
                "U"
              : null}
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
              background: "linear-gradient(45deg, #4CAF50, #2ECC71)", // Medical green
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
        </Box>{" "}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: "16px", md: "18px" },
            color: "#2D3748", // Dark text for medical theme
          }}
        >
          {userProfile?.data?.fullName || userProfile?.fullName || "Khách hàng"}
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
          {userProfile?.data?.email ||
            userProfile?.email ||
            userData?.email ||
            "email@example.com"}
        </Typography>{" "}
        <Chip
          label="Đã xác thực"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #4CAF50, #2ECC71)", // Medical green
            color: "#fff",
            fontWeight: 500,
            fontSize: "11px",
            height: "24px",
            boxShadow: "0 2px 8px rgba(76, 175, 80, 0.25)",
          }}
        />
      </UserProfile>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
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
                    color:
                      selectedItem === item.id
                        ? "#4A90E2" // Medical blue
                        : "#4A5568", // Dark gray for unselected
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
                      color: selectedItem === item.id ? "#2D3748" : "#4A5568",
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
                      {" "}
                      <StyledListItem
                        selected={selectedItem === subItem.id}
                        onClick={() => {
                          onItemSelect(subItem.id);
                          // Không cần navigate, chỉ thay đổi selectedItem
                          if (window.innerWidth < 900) {
                            onClose();
                          }
                        }}
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
                        <ListItemIcon
                          sx={{
                            color:
                              selectedItem === subItem.id
                                ? "#4A90E2"
                                : "#4A5568",
                            minWidth: 40,
                            transition: "color 0.3s ease",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
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
                                  : "#4A5568",
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

export default CustomerSidebar;

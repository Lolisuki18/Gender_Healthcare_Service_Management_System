/**
 * Header.js - Component thanh điều hướng phía trên của ứng dụng
 *
 * Component này tạo một thanh điều hướng (navigation bar) cố định ở trên cùng của ứng dụng,
 * chứa logo và các liên kết đến các trang chính.
 *
 * Lý do tạo file:
 * - Cung cấp điểm truy cập nhất quán đến các phần chính của ứng dụng
 * - Tăng UX bằng cách hiển thị rõ vị trí hiện tại của người dùng trong ứng dụng
 * - Áp dụng thiết kế responsive với Material UI để tự động điều chỉnh trên các thiết bị
 *
 * Các tính năng chính:
 * - Logo của ứng dụng với liên kết đến trang chủ
 * - Các nút điều hướng đến các trang chính
 * - Sử dụng Material UI để tạo giao diện hiện đại và responsive
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUserContext } from "@/context/UserContext";
import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";
import { notify } from "@/utils/notification";
import imageUrl from "@/utils/imageUrl";
import { listenToAvatarUpdates } from "@/utils/storageEvent";
import "@styles/Header.css";

const Header = () => {
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(null);
  //check xem đã đăng nhập hay chưa
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state cho người dùng
  const [user, setUser] = useState(null);
  //State cho menu dropdown khi người dùng đăng nhập -> dùng khi ấn vào avt
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State để force re-render khi cần
  const [refreshKey, setRefreshKey] = useState(0);
  const open = Boolean(dropdownOpen);
  // Hàm force refresh component khi cần
  const forceRefresh = () => setRefreshKey((prevKey) => prevKey + 1);
  // Khai báo hàm checkLoginStatus trước khi sử dụng trong useEffect
  const checkLoginStatus = () => {
    try {
      console.log("Checking login status in Header component");

      // Clear any previous avatar data from sessionStorage to avoid persistence between accounts
      sessionStorage.removeItem("last_updated_avatar");

      // Đảm bảo đọc đúng khóa từ localStorage
      const userData = localStorageUtil.get("userProfile");

      if (userData) {
        console.log("User is logged in, updating user data in Header");
        setIsLoggedIn(true);
        setUser(userData);

        // Reset avatar first to clear any previous avatar
        setAvatarUrl(null);

        // Lấy avatar từ userData (userProfile)
        if (userData.data && userData.data.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(userData.data.avatar);
          console.log("Setting avatar from userProfile.data:", fullAvatarUrl);
          setAvatarUrl(fullAvatarUrl);

          // Cập nhật vào sessionStorage để đồng bộ giữa các component
          sessionStorage.setItem("last_updated_avatar", userData.data.avatar);
        } else if (userData.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(userData.avatar);
          console.log("Setting avatar from userProfile root:", fullAvatarUrl);
          setAvatarUrl(fullAvatarUrl);

          // Cập nhật vào sessionStorage để đồng bộ giữa các component
          sessionStorage.setItem("last_updated_avatar", userData.avatar);
        }

        forceRefresh();
      } else {
        console.log("User is not logged in");
        setIsLoggedIn(false);
        setUser(null);
        setAvatarUrl(null);
        sessionStorage.removeItem("last_updated_avatar");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
      setAvatarUrl(null);
      sessionStorage.removeItem("last_updated_avatar");
    }
  };

  //Hàm kiểm soát khi ấn vào avt người dùng
  const handleAvatarClick = (event) => {
    setDropdownOpen(event.currentTarget);
  };

  //hàm xử lý khi đóng menu
  const handleCloseMenu = () => {
    setDropdownOpen(null);
  };
  //xử lý khi sử dụng đăng xuất
  const handleLogout = async () => {
    // Đảm bảo xóa đúng khóa từ localStorage
    localStorageUtil.remove("userProfile");
    localStorageUtil.remove("loginSuccessMessage");
    localStorageUtil.remove("token");
    localStorageUtil.remove("user");

    // Xóa dữ liệu từ sessionStorage
    sessionStorage.removeItem("last_updated_avatar");
    sessionStorage.clear();

    // Cập nhật state
    setIsLoggedIn(false);
    setUser(null);
    setAvatarUrl(null);
    handleCloseMenu();

    try {
      await userService.logout();
      notify.success("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống");

      // Thêm small delay để đảm bảo mọi thứ được xóa hoàn toàn trước khi chuyển hướng
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
      notify.error(
        "Đăng xuất thất bại",
        "Có lỗi xảy ra trong quá trình đăng xuất"
      );
    }
  };

  const navigate = useNavigate();

  //xử lý chuyển hướng trang hồ sơ
  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };
  // Add a polling mechanism to check for avatar updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Get user data first to check if we're logged in
      const userData = localStorageUtil.get("userProfile");

      // If no user data, clear avatar
      if (!userData) {
        if (avatarUrl) {
          setAvatarUrl(null);
          forceRefresh();
        }
        return;
      }

      // Get the most up-to-date avatar
      const lastUpdatedAvatar = sessionStorage.getItem("last_updated_avatar");

      // Determine current avatar path from user data
      let currentAvatarPath = null;
      if (userData.data && userData.data.avatar) {
        currentAvatarPath = userData.data.avatar;
      } else if (userData.avatar) {
        currentAvatarPath = userData.avatar;
      }

      // Use either the session stored avatar or the one from user data
      const avatarToUse = lastUpdatedAvatar || currentAvatarPath;

      if (avatarToUse) {
        const fullUrl = imageUrl.getFullImageUrl(avatarToUse);
        // Only update if different from current avatar URL
        if (fullUrl && fullUrl !== avatarUrl) {
          console.log("Polling detected avatar update:", fullUrl);
          setAvatarUrl(fullUrl);
          forceRefresh();
        }
      } else if (avatarUrl) {
        // If no avatar in storage but we have one in state, clear it
        setAvatarUrl(null);
        forceRefresh();
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [avatarUrl]);

  useEffect(() => {
    console.log(
      "Header component mounted - kiểm tra trạng thái đăng nhập và khởi tạo listeners"
    );
    checkLoginStatus();

    // Lắng nghe sự kiện cập nhật avatar từ localStorage và sessionStorage
    const handleStorageChange = (e) => {
      console.log("Storage event detected in Header:", e.key);
      if (
        e.key === "userProfile" ||
        e.key === "avatar_sync_trigger" ||
        e.key === "last_updated_avatar" ||
        e.key === "user"
      ) {
        console.log("Avatar update detected via storage event in Header");
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe trực tiếp sự kiện avatar_updated từ cùng tab
    const handleDirectAvatarUpdate = (event) => {
      console.log(
        "Direct avatar update event received in Header:",
        event.detail
      );
      if (event.detail && event.detail.avatarUrl) {
        const newAvatarUrl = event.detail.avatarUrl;
        console.log("Setting new avatar URL:", newAvatarUrl);
        setAvatarUrl(imageUrl.getFullImageUrl(newAvatarUrl));
        forceRefresh();
        // Cập nhật lại thông tin người dùng
        checkLoginStatus();
      }
    };

    // Đăng ký lắng nghe sự kiện trực tiếp
    window.addEventListener("avatar_updated", handleDirectAvatarUpdate);

    // Đăng ký lắng nghe sự kiện cập nhật avatar từ hệ thống event tùy chỉnh
    const unsubscribe = listenToAvatarUpdates((newAvatarUrl) => {
      console.log(
        "Avatar update event received in Header from listenToAvatarUpdates:",
        newAvatarUrl
      );
      if (newAvatarUrl) {
        setAvatarUrl(imageUrl.getFullImageUrl(newAvatarUrl));
        forceRefresh();
      }
      checkLoginStatus();
    });

    // Kiểm tra và sử dụng avatar từ sessionStorage (từ các lần cập nhật trước)
    const lastUpdatedAvatar = sessionStorage.getItem("last_updated_avatar");
    if (lastUpdatedAvatar) {
      console.log("Found cached avatar in sessionStorage:", lastUpdatedAvatar);
      setAvatarUrl(imageUrl.getFullImageUrl(lastUpdatedAvatar));
    }

    // Cleanup function để hủy đăng ký listener khi component unmount
    return () => {
      console.log("Cleaning up event listeners in Header");
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("avatar_updated", handleDirectAvatarUpdate);
      if (unsubscribe) unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
        boxShadow: "0 2px 12px rgba(74, 144, 226, 0.25)",
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 4,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.4rem",
              "&:hover": {
                color: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            Gender Health Care
          </Typography>

          {/* Navigation Links */}
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}
          >
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/sti-test", label: "Xét nghiệm STIs" },
              { to: "/blog", label: "Blogs" },
              { to: "/about", label: "Giới thiệu" },
              { to: "/ovulation", label: "Chu kì rụng trứng" },
              { to: "/pill-reminder", label: "Nhắc uống thuốc" },
            ].map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                sx={{
                  color: "white",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Section */}
          {isLoggedIn ? (
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                onClick={handleAvatarClick}
                sx={{
                  p: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                {" "}
                {/* Avatar display for logged in users */}{" "}
                {user ? (
                  <Avatar
                    key={`header-avatar-${refreshKey}-${Date.now()}`}
                    src={(() => {
                      // Ưu tiên lấy trực tiếp từ userProfile
                      const userData = localStorageUtil.get("userProfile");
                      if (userData?.data?.avatar) {
                        return imageUrl.getFullImageUrl(userData.data.avatar);
                      } else if (userData?.avatar) {
                        return imageUrl.getFullImageUrl(userData.avatar);
                      }
                      // Nếu không có trong userProfile thì mới dùng state
                      return avatarUrl;
                    })()}
                    sx={{
                      width: 40,
                      height: 40,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                      border: "2px solid rgba(255, 255, 255, 0.8)",
                    }}
                    imgProps={{
                      onError: () => {
                        console.log("Header avatar image failed to load");
                        forceRefresh();
                      },
                      onLoad: () => {
                        console.log("Header avatar image loaded successfully");
                      },
                    }}
                  >
                    {!avatarUrl &&
                      (user?.fullName?.[0] || user?.email?.[0] || "U")}
                  </Avatar>
                ) : (
                  <AccountCircleIcon
                    sx={{
                      color: "white",
                      fontSize: 40,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                )}
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={dropdownOpen}
                open={open}
                onClose={handleCloseMenu}
                sx={{
                  mt: 1,
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "1px solid rgba(74, 144, 226, 0.1)",
                  },
                }}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={handleProfile}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(74, 144, 226, 0.1)",
                    },
                  }}
                >
                  Hồ sơ
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2,
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

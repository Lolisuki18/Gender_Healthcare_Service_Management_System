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
  Toolbar,
  Typography,
  Button,
  Container,
  Avatar,
  MenuItem,
  Menu,
  IconButton,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import localStorageUtil from "@utils/localStorage";
import axios from "axios";
import { userService } from "@services/userService";
import notify from "@utils/notification";
import "@styles/Header.css";

const Header = () => {
  //check xem đã đăng nhập hay chưa
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state cho người dùng
  const [user, setUser] = useState(null);
  //State cho menu dropdown khi người dùng đăng nhập -> dùng khi ấn vào avt
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const open = Boolean(dropdownOpen);

  //kiểm tra trạng thái đăng nhập khi component được mount lần đầu tiên
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    try {
      const user = localStorageUtil.get("user");
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
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
    localStorageUtil.remove("user");
    localStorageUtil.remove("loginSuccessMessage");
    setIsLoggedIn(false);
    setUser(null);
    handleCloseMenu();
    try {
      await userService.logout();
      notify.success("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống");
      navigate("/");
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
                {user && user.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name || "User"}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        border: "2px solid rgba(255, 255, 255, 0.6)",
                        transform: "scale(1.05)",
                      },
                    }}
                  />
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

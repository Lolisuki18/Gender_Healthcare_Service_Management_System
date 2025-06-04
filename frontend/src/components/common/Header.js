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
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import localStorageUtil from "@utils/localStorage";
import axios from "axios";
import { userService } from "@services/userService";
import notify from "@utils/notification";
import "@styles/Header.css";

const Header = () => {
  //làm thanh search
  //   const [searchQuery, setSearchQuery] = useState("");
  //   const handleSearchChange = (event) => {
  //     setSearchQuery(event.target.value);
  //   };
  //   const handleSearchSubmit = (event) => {
  //     if (event.key == "Enter") {
  //       console.log("Searching for :", searchQuery);
  //       //chưa làm api cho search các tác vụ mà mình có
  //     }
  //   };
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
  }, []); // [] có nghĩa là chỉ chạy 1 lần khi component được mount
  //nếu truyền vào mảng dependencies thì useEffect sẽ chạy lại khi các giá trị trong mảng thay đổi
  const checkLoginStatus = () => {
    try {
      const user = localStorageUtil.get("user");
      if (user) {
        setIsLoggedIn(true);
        //set user từ localStorage
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
      // Hiển thị thông báo đăng xuất thành công
      notify.success("Đăng xuất thành công", "Bạn đã đăng xuất khỏi hệ thống");
      // Chuyển hướng về trang chủ sau khi đăng xuất
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
    //chuyển hướng đến trang hồ sơ người dùng
    navigate("/profile");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            className="header-logo"
          >
            {" "}
            Gender Health Care Systems{" "}
          </Typography>
          <div className="header-nav-container">
            <Link to="/" className="header-nav-link">
              Trang chủ
            </Link>
            <Link to="/sti-test" className="header-nav-link">
              Xét nghiệm STIs
            </Link>
            <Link to="/blog" className="header-nav-link">
              Blogs
            </Link>
            <Link to="/about" className="header-nav-link">
              Giới thiệu
            </Link>
            <Link to="/ovulation" className="header-nav-link">
              Kiểm tra chu kì rụng trứng
            </Link>
            <Link to="/pill-reminder" className="header-nav-link">
              Nhắc nhở uống thuốc tránh thai
            </Link>
          </div>
          {isLoggedIn ? (
            <div>
              <IconButton onClick={handleAvatarClick}>
                {user && user.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name || "User"}
                    className="header-avatar"
                  />
                ) : (
                  <AccountCircleIcon className="header-avatar" />
                )}
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={dropdownOpen}
                open={open}
                onClose={handleCloseMenu}
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
                <MenuItem onClick={handleProfile}>Hồ sơ</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              variant="outlined"
              className="header-login-button"
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

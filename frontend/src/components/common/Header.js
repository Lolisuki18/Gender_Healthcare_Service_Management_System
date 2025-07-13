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

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Badge,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { userService } from '@/services/userService';
import localStorageUtil from '@/utils/localStorage';
import { toast } from 'react-toastify';
import imageUrl from '@/utils/imageUrl';
import '@styles/Header.css';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/redux/slices/authSlice';

const Header = () => {
  // ✅ Sử dụng Redux store thay vì local state phức tạp
  const user = useSelector((state) => state.auth.user);
  const avatarUrl = useSelector((state) => state.auth.avatarUrl);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // State cho menu dropdown khi người dùng đăng nhập -> dùng khi ấn vào avt
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const open = Boolean(dropdownOpen);

  // Thêm kiểm tra token và userProfile trong localStorage
  const hasToken = Boolean(localStorageUtil.get('token'));
  const hasUserProfile = Boolean(localStorageUtil.get('userProfile'));
  const canShowUser = isAuthenticated && hasToken && hasUserProfile;

  // ✅ Hàm kiểm soát khi ấn vào avt người dùng
  const handleAvatarClick = (event) => {
    setDropdownOpen(event.currentTarget);
  };

  // ✅ Hàm xử lý khi đóng menu
  const handleCloseMenu = () => {
    setDropdownOpen(null);
  };

  // ✅ Xử lý khi sử dụng đăng xuất
  const handleLogout = async () => {
    try {
      await userService.logout();
      localStorageUtil.remove('userProfile');
      localStorageUtil.remove('loginSuccessMessage');
      localStorageUtil.remove('token');
      sessionStorage.clear();
      dispatch(logoutAction());
      handleCloseMenu();
      toast.success('Bạn đã đăng xuất thành công!');
      setTimeout(() => {
        navigate('/login#/login');
      }, 100);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(
        'Đăng xuất thất bại',
        'Có lỗi xảy ra trong quá trình đăng xuất'
      );
    }
  };

  const navigate = useNavigate();

  // ✅ Xử lý chuyển hướng trang hồ sơ
  const handleProfile = () => {
    handleCloseMenu();
    navigate('/profile');
  };

  // ✅ Lấy avatar URL từ Redux store hoặc fallback
  const getAvatarUrl = () => {
    if (avatarUrl) {
      return imageUrl.getFullImageUrl(avatarUrl);
    }

    if (user?.avatar) {
      return imageUrl.getFullImageUrl(user.avatar);
    }

    return '/img/avatar/default.jpg';
  };

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)',
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical gradient
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: (theme) => theme.zIndex.appBar,
        transition: 'all 0.3s ease',
      }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 70 },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: { xs: 1, md: 4 },
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: '.05rem',
              color:
                '#FFFFFF' /* Changed from inherit to explicit white color */,
              textDecoration: 'none',
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.95)',
                '&::after': {
                  width: '100%',
                  opacity: 1,
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                opacity: 0,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
                background: 'rgba(255, 255, 255, 0.2)',
                p: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#4A90E2',
                }}
              >
                G
              </Box>
            </Box>
            Gender Healthcare Service
          </Typography>

          {/* Navigation Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {[
              { to: '/', label: 'Trang chủ' },
              { to: '/sti-services', label: 'Xét nghiệm STIs' },
              { to: '/consultation', label: 'Đặt lịch tư vấn' },
              { to: '/pill-reminder', label: 'Nhắc uống thuốc' },
              { to: '/blog', label: 'Blogs' },
              { to: '/ovulation', label: 'Chu kì rụng trứng' },
              { to: '/about', label: 'Giới thiệu' },
            ].map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0%',
                    height: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'width 0.3s ease',
                    borderRadius: '3px 3px 0 0',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                    '&::before': {
                      width: '70%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Section */}
          {canShowUser ? (
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAvatarClick}
                sx={{
                  p: 0.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                }}
              >
                {user ? (
                  <Avatar
                    src={getAvatarUrl()}
                    alt={user.fullName || 'User'}
                    sx={{
                      width: 38,
                      height: 38,
                      transition: 'all 0.3s ease',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                      backgroundColor: '#1ABC9C20',
                    }}
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                ) : (
                  <AccountCircleIcon
                    sx={{
                      color: 'white',
                      fontSize: 38,
                      transition: 'all 0.3s ease',
                      filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2))',
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
                  mt: 1.5,
                  '& .MuiPaper-root': {
                    borderRadius: 3,
                    minWidth: 200,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(8px)',
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: -6,
                      right: 14,
                      width: 12,
                      height: 12,
                      backgroundColor: 'white',
                      transform: 'rotate(45deg)',
                      boxShadow: '-3px -3px 5px rgba(0,0,0,0.04)',
                      zIndex: 0,
                    },
                  },
                }}
                MenuListProps={{
                  'aria-labelledby': 'account-button',
                  sx: { py: 1 },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                disableScrollLock={true}
              >
                {/* User info */}
                <Box
                  sx={{
                    pt: 1,
                    pb: 1.5,
                    px: 2,
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {user?.fullName || user?.email || 'Người dùng'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || ''}
                  </Typography>
                </Box>

                {/* Truy cập vào profile */}
                <MenuItem
                  onClick={handleProfile}
                  sx={{
                    py: 1.5,
                    px: 2,
                    mt: 0.5,
                    borderRadius: '8px',
                    mx: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    },
                  }}
                >
                  Hồ sơ
                </MenuItem>

                {/* Đăng xuất khỏi hệ thống */}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2,
                    color: '#d32f2f',
                    borderRadius: '8px',
                    mx: 1,
                    mb: 0.5,
                    mt: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.08)',
                    },
                  }}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            // Nếu người dùng chưa đăng nhập, hiển thị nút đăng nhập
            <Button
              color="inherit"
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.6)',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'none',
                px: { xs: 2, md: 3.5 },
                py: 1,
                borderRadius: 50,
                letterSpacing: '0.02em',
                fontSize: '0.95rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                  '&::before': {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                  },
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(74, 144, 226, 0.25)',
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

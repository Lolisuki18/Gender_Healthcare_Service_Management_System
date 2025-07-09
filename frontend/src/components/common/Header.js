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
import { listenToAvatarUpdates } from '@/utils/storageEvent';
import '@styles/Header.css';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

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
      console.log('Checking login status in Header component');

      // Clear any previous avatar data from sessionStorage to avoid persistence between accounts
      sessionStorage.removeItem('last_updated_avatar');

      // Đảm bảo đọc đúng khóa từ localStorage
      const userData = localStorageUtil.get('userProfile');

      if (userData) {
        console.log('User is logged in, updating user data in Header');
        setIsLoggedIn(true);
        setUser(userData);

        // Reset avatar first to clear any previous avatar
        setAvatarUrl(null);

        // Lấy avatar từ userData (userProfile)
        if (userData.data && userData.data.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(userData.data.avatar);
          console.log('Setting avatar from userProfile.data:', fullAvatarUrl);
          setAvatarUrl(fullAvatarUrl);

          // Cập nhật vào sessionStorage để đồng bộ giữa các component
          sessionStorage.setItem('last_updated_avatar', userData.data.avatar);
        } else if (userData.avatar) {
          const fullAvatarUrl = imageUrl.getFullImageUrl(userData.avatar);
          console.log('Setting avatar from userProfile root:', fullAvatarUrl);
          setAvatarUrl(fullAvatarUrl);

          // Cập nhật vào sessionStorage để đồng bộ giữa các component
          sessionStorage.setItem('last_updated_avatar', userData.avatar);
        }

        forceRefresh();
      } else {
        console.log('User is not logged in');
        setIsLoggedIn(false);
        setUser(null);
        setAvatarUrl(null);
        sessionStorage.removeItem('last_updated_avatar');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
      setAvatarUrl(null);
      sessionStorage.removeItem('last_updated_avatar');
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
    localStorageUtil.remove('userProfile');
    localStorageUtil.remove('loginSuccessMessage');
    localStorageUtil.remove('token');

    // Xóa dữ liệu từ sessionStorage
    sessionStorage.removeItem('last_updated_avatar');
    sessionStorage.clear();

    // Cập nhật state
    setIsLoggedIn(false);
    setUser(null);
    setAvatarUrl(null);
    handleCloseMenu();

    try {
      await userService.logout();
      toast.success('Bạn đã đăng xuất thành công!');

      // Thêm small delay để đảm bảo mọi thứ được xóa hoàn toàn trước khi chuyển hướng
      setTimeout(() => {
        navigate('/');
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

  //xử lý chuyển hướng trang hồ sơ
  const handleProfile = () => {
    handleCloseMenu();
    navigate('/profile');
  };
  // Kiểm tra trạng thái đăng nhập và cập nhật avatar mỗi giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check login status and update avatar every second
      console.log('Checking login status and updating avatar in Header');
      const userData = localStorageUtil.get('userProfile');

      //nếu không có userData thì không cần làm gì cả
      if (!userData) {
        if (avatarUrl) {
          setAvatarUrl(null);
          forceRefresh();
        }
        return;
      }

      //lấy avatar đã cập nhật từ sessionStorage
      const lastUpdatedAvatar = sessionStorage.getItem('last_updated_avatar');

      // Nếu có avatar đã cập nhật trong sessionStorage, ưu tiên sử dụng nó
      let currentAvatarPath = null;
      if (userData.data && userData.data.avatar) {
        currentAvatarPath = userData.data.avatar;
      } else if (userData.avatar) {
        currentAvatarPath = userData.avatar;
      }

      //Sử dụng ảnh đại diện được lưu trữ trong phiên hoặc ảnh đại diện từ dữ liệu người dùng
      const avatarToUse = lastUpdatedAvatar || currentAvatarPath;

      if (avatarToUse) {
        const fullUrl = imageUrl.getFullImageUrl(avatarToUse);
        // Chỉ cập nhật nếu khác với URL avatar hiện tại
        if (fullUrl && fullUrl !== avatarUrl) {
          console.log('Polling detected avatar update:', fullUrl);
          setAvatarUrl(fullUrl);
          forceRefresh();
        }
      } else if (avatarUrl) {
        //Nếu không có avatar trong kho lưu trữ nhưng chúng ta
        //có một avatar trong trạng thái, hãy xóa nó
        setAvatarUrl(null);
        forceRefresh();
      }
    }, 1000); // check mỗi giây

    return () => clearInterval(intervalId);
  }, [avatarUrl]);

  useEffect(() => {
    console.log(
      'Header component mounted - kiểm tra trạng thái đăng nhập và khởi tạo listeners'
    );
    checkLoginStatus();

    // Lắng nghe sự kiện cập nhật avatar từ localStorage và sessionStorage
    const handleStorageChange = (e) => {
      console.log('Storage event detected in Header:', e.key);
      if (
        e.key === 'userProfile' ||
        e.key === 'avatar_sync_trigger' ||
        e.key === 'last_updated_avatar' ||
        e.key === 'user'
      ) {
        console.log('Avatar update detected via storage event in Header');
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Lắng nghe trực tiếp sự kiện avatar_updated từ cùng tab
    const handleDirectAvatarUpdate = (event) => {
      console.log(
        'Direct avatar update event received in Header:',
        event.detail
      );
      if (event.detail && event.detail.avatarUrl) {
        const newAvatarUrl = event.detail.avatarUrl;
        console.log('Setting new avatar URL:', newAvatarUrl);
        setAvatarUrl(imageUrl.getFullImageUrl(newAvatarUrl));
        forceRefresh();
        // Cập nhật lại thông tin người dùng
        checkLoginStatus();
      }
    };

    // Đăng ký lắng nghe sự kiện trực tiếp
    window.addEventListener('avatar_updated', handleDirectAvatarUpdate);

    // Đăng ký lắng nghe sự kiện cập nhật avatar từ hệ thống event tùy chỉnh
    const unsubscribe = listenToAvatarUpdates((newAvatarUrl) => {
      console.log(
        'Avatar update event received in Header from listenToAvatarUpdates:',
        newAvatarUrl
      );
      if (newAvatarUrl) {
        setAvatarUrl(imageUrl.getFullImageUrl(newAvatarUrl));
        forceRefresh();
      }
      checkLoginStatus();
    });

    // Kiểm tra và sử dụng avatar từ sessionStorage (từ các lần cập nhật trước)
    const lastUpdatedAvatar = sessionStorage.getItem('last_updated_avatar');
    if (lastUpdatedAvatar) {
      console.log('Found cached avatar in sessionStorage:', lastUpdatedAvatar);
      setAvatarUrl(imageUrl.getFullImageUrl(lastUpdatedAvatar));
    }

    // Chức năng dọn dẹp để hủy đăng ký trình nghe khi ngắt kết nối thành phần
    return () => {
      console.log('Cleaning up event listeners in Header');
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatar_updated', handleDirectAvatarUpdate);
      if (unsubscribe) unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          {/* Logo */}{' '}
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
          </Typography>{' '}
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
          </Box>{' '}
          {/* User Section */}
          {isLoggedIn ? (
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
                    sx={{
                      width: 38,
                      height: 38,
                      transition: 'all 0.3s ease',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                      backgroundColor: '#1ABC9C20',
                    }}
                  >
                    <img
                      src={(() => {
                        const userData = localStorageUtil.get('userProfile');
                        if (userData?.data?.avatar) {
                          return imageUrl.getFullImageUrl(userData.data.avatar);
                        } else if (userData?.avatar) {
                          return imageUrl.getFullImageUrl(userData.avatar);
                        }
                        return avatarUrl || '/img/avatar/default.jpg';
                      })()}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => {
                        console.error('[Avatar onError] Không load được ảnh avatar:', e.target.src);
                        if (e && e.nativeEvent && e.nativeEvent.message) {
                          console.error('[Avatar onError] nativeEvent message:', e.nativeEvent.message);
                        }
                        if (!e.target.src.endsWith('/img/avatar/default.jpg')) {
                          e.target.onerror = null;
                          e.target.src = '/img/avatar/default.jpg';
                        }
                      }}
                      onLoad={() => {
                        console.log('[Avatar onLoad] Ảnh avatar đã load thành công:', document.querySelector('img[alt="avatar"]').src);
                      }}
                    />
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
              </IconButton>{' '}
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

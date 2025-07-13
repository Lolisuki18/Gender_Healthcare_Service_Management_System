// LoginPage.js
// --- IMPORTS ---
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
// Thêm các icon còn thiếu
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import { userService } from '@/services/userService';
import localStorageUtil from '@/utils/localStorage';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '@/utils/notify';

import LoggedInView from '@/components/common/LoggedInView';
import GoogleLoginButton from '@/components/common/GoogleLoginButton';
import { logout } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/authSlice';
import tokenService from '@/services/tokenService';

const LoginPage = () => {
  // --- STATE MANAGEMENT ---
  // Form data state
  //Form data state để lưu trữ thông tin đăng nhập -> sẽ gửi về Server
  const [formData, setFormData] = useState({
    usernameOrEmail: '', // Hỗ trợ cả username và email
    password: '',
  });

  // UI states
  //xem người dùng đã đăng nhập hay chưa
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //lưu trữ thông tin người dùng đã đăng nhập
  const [user, setUser] = useState(null);
  // Trạng thái hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  // Trạng thái loading khi đang gửi yêu cầu đăng nhập
  const [loading, setLoading] = useState(false);
  // Sử dụng useNavigate để chuyển hướng
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- LIFECYCLE HOOKS ---
  /**
   * Kiểm tra trạng thái đăng nhập khi component được tải
   */
  useEffect(() => {
    // Kiểm tra xem có token hợp lệ trong localStorage không
    const token = localStorageUtil.get('token');
    if (token && token.accessToken) {
      setIsLoggedIn(true);
      setUser(token);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // --- EVENT HANDLERS ---
  /**
   * Xử lý đăng nhập
   */
  const handleLogin = (e) => {
    e.preventDefault();

    // Validation
    // Kiểm tra xem người dùng đã nhập username hoặc email chưa
    if (!formData.usernameOrEmail) {
      notify.error('Lỗi đăng nhập', 'Vui lòng nhập username hoặc email');
      return;
    }
    // Kiểm tra xem người dùng đã nhập mật khẩu chưa
    if (!formData.password) {
      notify.error('Lỗi đăng nhập', 'Vui lòng nhập mật khẩu');
      return;
    }
    // Đặt trạng thái loading để hiển thị spinner hoặc disable nút
    setLoading(true);

    // Chuẩn bị dữ liệu để gửi đến server
    const loginData = {
      // Gửi username (backend sẽ tự động xử lý username hoặc email)
      username: formData.usernameOrEmail,
      password: formData.password,
    };
    //Call API để cập nhập
    userService
      .login(loginData) // nếu thành công thì sẽ trả về JwtResponse object
      .then((response) => {
        // xử lý response từ server
        //*DEBUG: log ra thử để Debug xem thử response có đúng không có gì
        console.log('Login response:', response);
        // Backend trả về JwtResponse object chứa accessToken, refreshToken và user info
        if (response && response.accessToken) {
          // response đã là JwtResponse object từ backend
          const token = {
            userId: response.userId,
            username: response.username,
            email: response.email,
            role: response.role,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType || 'Bearer',
            expiresIn: response.expiresIn,
            // avatar: response.avatar || null, // Thêm avatar nếu có
          };

          const role = token.role; // lấy role từ token để xác định chuyển hướng

          //*DEBUG: LOG CẤU TRÚC USER DATA
          console.log('User data to save:', token);
          console.log('Access token:', token.accessToken);
          console.log('Refresh token:', token.refreshToken);

          //lưu token vào localStorage
          localStorageUtil.set('token', token);

          // Khởi tạo token service để tự động quản lý refresh
          tokenService.setToken(token);

          //*DEBUG: log ra thử để Debug xem thử token đã được lưu chưa
          const savedUser = localStorageUtil.get('token');
          console.log('Saved user data:', savedUser);

          // Lấy thông tin profile đầy đủ của người dùng
          userService
            .getCurrentUser()
            .then((profileData) => {
              // nếu thành công thì xử lý profileData
              //*DEBUG: log ra thử để Debug xem thử profileData có đúng không
              console.log('User profile loaded:', profileData);

              // Lưu thông tin profile vào localStorage
              localStorageUtil.set('userProfile', profileData);

              // 🟢 Thêm dòng này để cập nhật Redux (Header, Sidebar, v.v. sẽ update ngay)
              dispatch(loginSuccess(profileData.data));

              // Kiểm tra role và chuyển hướng
              if (role === 'ADMIN') {
                // Nếu là admin, chuyển hướng đến trang quản trị
                notify.success(
                  'Đăng nhập thành công',
                  `Chào mừng Admin ${profileData.data.username}!`
                );
                // Chuyển hướng đến trang quản trị admin
                navigate('/admin/profile');
                return;
              } else {
                // Nếu không phải admin, kiểm tra redirect sau đăng nhập
                const redirectInfo = localStorageUtil.get('redirectAfterLogin');

                // Lưu thông báo đăng nhập thành công vào localStorage để hiển thị ở homepage
                localStorageUtil.set('loginSuccessMessage', {
                  title: 'Đăng nhập thành công',
                  message: `Chào mừng ${profileData.data.username} trở lại!`,
                  timestamp: Date.now(),
                });

                if (redirectInfo) {
                  // Xóa thông tin redirect sau khi sử dụng
                  localStorageUtil.remove('redirectAfterLogin');

                  // Chuyển hướng đến trang được yêu cầu trước đó
                  if (redirectInfo.state) {
                    navigate(redirectInfo.path, { state: redirectInfo.state });
                  } else {
                    navigate(redirectInfo.path);
                  }
                } else {
                  // Chuyển hướng về trang chủ
                  window.location.href = '/';
                }
              }
            })
            .catch((error) => {
              // nếu có lỗi khi lấy profile
              //*DEBUG: log ra thử để Debug xem thử lỗi có đúng không
              console.error('Error loading user profile:', error);

              // Vẫn cho phép đăng nhập thành công ngay cả khi không lấy được profile
              // Kiểm tra role và chuyển hướng
              if (role === 'ADMIN') {
                notify.success(
                  'Đăng nhập thành công',
                  `Chào mừng Admin ${token.username}!`
                );
                navigate('/admin/profile');
                return;
              } else {
                const redirectInfo = localStorageUtil.get('redirectAfterLogin');

                // localStorageUtil.set('loginSuccessMessage', {
                //   title: 'Đăng nhập thành công',
                //   message: `Chào mừng ${token.username} trở lại!`,
                //   timestamp: Date.now(),
                // });

                if (redirectInfo) {
                  // Xóa thông tin redirect sau khi sử dụng
                  localStorageUtil.remove('redirectAfterLogin');

                  // Chuyển hướng đến trang được yêu cầu trước đó
                  if (redirectInfo.state) {
                    navigate(redirectInfo.path, { state: redirectInfo.state });
                  } else {
                    navigate(redirectInfo.path);
                  }
                } else {
                  // Chuyển hướng về trang chủ
                  window.location.href = '/';
                }
              }
            });
        } else {
          // Nếu không có accessToken trong response, thông báo lỗi
          console.error('Login failed - missing accessToken:', response);
          notify.error(
            'Đăng nhập thất bại',
            response.message || 'Server không trả về token xác thực'
          );
        }
      })
      .catch((error) => {
        // nếu có lỗi khi đăng nhập
        console.error('Login error:', error);
        let errorMessage =
          error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.';
        if (errorMessage === 'Invalid username or password') {
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        }
        notify.error('Lỗi đăng nhập', errorMessage);
      })
      .finally(() => {
        // khi kết thúc quá trình đăng nhập, dù thành công hay thất bại
        setLoading(false);
      });
  };

  /**
   * Xử lý thay đổi giá trị form
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Xử lý toggle hiển thị/ẩn mật khẩu
   */
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const logout = () => {
    localStorageUtil.remove('token');
    localStorageUtil.remove('userProfile');
    setIsLoggedIn(false);
    setUser(null);
  };

  // --- RENDER METHODS ---
  /**
   * Hiển thị giao diện khi người dùng đã đăng nhập
   */
  // Nếu người dùng đã đăng nhập
  if (isLoggedIn && user) {
    //nếu người dùng đã đăng nhập và có thông tin user
    return <LoggedInView user={user} onLogout={logout} />;
  }

  /**
   * Hiển thị form đăng nhập
   */
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 50%, #E3F2FD 100%)', // Medical background
        py: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(74, 144, 226, 0.1)',
            boxShadow: '0 8px 32px rgba(74, 144, 226, 0.15)',
          }}
        >
          {/* Nội dung của Card */}
          <CardContent sx={{ p: 4 }}>
            {/* Header Section với màu y tế */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {/* Hiện thị Avatar */}
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical gradient
                  boxShadow: '0 8px 24px rgba(74, 144, 226, 0.25)',
                }}
              >
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              {/* Title */}
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Đăng nhập
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 400,
                  mx: 'auto',
                  lineHeight: 1.6,
                  color: '#546E7A', // Medical text color
                }}
              >
                Nhập thông tin của bạn để truy cập hệ thống chăm sóc sức khỏe
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, opacity: 0.3, borderColor: '#4A90E2' }} />

            {/* Form đăng nhập */}
            <Box component="form" onSubmit={handleLogin}>
              {/* Card chứa form */}
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  background:
                    'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: '#4A90E2', // Medical blue
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LoginIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Thông tin đăng nhập
                </Typography>

                {/* Username hoặc Email */}
                <TextField
                  label="Tên đăng nhập hoặc Email"
                  name="usernameOrEmail"
                  fullWidth
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  autoFocus
                  placeholder="Nhập username hoặc email của bạn"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4A90E2',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#4A90E2',
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#4A90E2' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Mật khẩu*/}
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4A90E2',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#4A90E2',
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon sx={{ color: '#4A90E2' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? (
                            <VisibilityOffIcon sx={{ color: '#4A90E2' }} />
                          ) : (
                            <VisibilityIcon sx={{ color: '#4A90E2' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Link quên mật khẩu */}
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}
                >
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: 'none',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#1ABC9C', // Medical green
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#17A085',
                        },
                      }}
                    >
                      Quên mật khẩu?
                    </Typography>
                  </Link>
                </Box>
              </Box>

              {/* Nút đăng nhập  */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical gradient
                  color: '#fff',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: loading ? 'none' : 'translateY(-2px)',
                    boxShadow: loading
                      ? '0 2px 8px rgba(74, 144, 226, 0.25)'
                      : '0 4px 12px rgba(74, 144, 226, 0.35)',
                    background: loading
                      ? 'linear-gradient(45deg, #4A90E2, #1ABC9C)'
                      : 'linear-gradient(45deg, #357ABD, #17A085)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #B0BEC5, #90A4AE)',
                    transform: 'none',
                    color: '#fff',
                  },
                }}
              >
                <LoginIcon sx={{ mr: 1 }} />
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>

              {/* Divider "hoặc" */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                <Divider
                  sx={{ flex: 1, opacity: 0.3, borderColor: '#4A90E2' }}
                />
                <Typography
                  variant="body2"
                  sx={{ mx: 2, color: 'text.secondary', fontWeight: 500 }}
                >
                  hoặc
                </Typography>
                <Divider
                  sx={{ flex: 1, opacity: 0.3, borderColor: '#4A90E2' }}
                />
              </Box>

              {/* Nút đăng nhập Google */}
              <GoogleLoginButton
                fullWidth
                variant="outlined"
                disabled={loading}
              />

              <Divider sx={{ my: 3, opacity: 0.3, borderColor: '#4A90E2' }} />

              {/* Link đăng ký */}
              <Box sx={{ textAlign: 'center' }}>
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: '#4A90E2', // Medical blue
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#357ABD',
                      },
                    }}
                  >
                    Bạn chưa có tài khoản? Đăng ký ngay
                  </Typography>
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;

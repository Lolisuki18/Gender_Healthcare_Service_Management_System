/**
 * Trang Đăng Nhập
 *
 * Component này xử lý quá trình đăng nhập người dùng, bao gồm:
 * - Đăng nhập bằng username hoặe email
 * - Xác thực thông tin người dùng
 * - Lưu trữ thông tin phiên đăng nhập
 */

// --- IMPORTS ---
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
// Thêm các icon còn thiếu
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";
import { Link, useNavigate } from "react-router-dom";
import notify from "@/utils/notification";

import LoggedInView from "@/components/common/LoggedInView";
import { logout } from "@/redux/slices/authSlice";

const LoginPage = () => {
  // --- THEME & STYLES ---
  const theme = useTheme();

  // --- STATE MANAGEMENT ---
  // Form data state
  const [formData, setFormData] = useState({
    usernameOrEmail: "", // Hỗ trợ cả username và email
    password: "",
  });

  // UI states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- LIFECYCLE HOOKS ---
  /**
   * Kiểm tra trạng thái đăng nhập khi component được tải
   */
  useEffect(() => {
    // Kiểm tra xem có dữ liệu người dùng trong localStorage không
    const userData = localStorageUtil.get("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(userData);
    }
  }, []);

  // --- EVENT HANDLERS ---
  /**
   * Xử lý đăng nhập
   */
  const handleLogin = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.usernameOrEmail) {
      notify.error("Lỗi đăng nhập", "Vui lòng nhập username hoặc email");
      return;
    }

    if (!formData.password) {
      notify.error("Lỗi đăng nhập", "Vui lòng nhập mật khẩu");
      return;
    }

    setLoading(true);

    // Chuẩn bị dữ liệu để gửi đến server
    const loginData = {
      // Gửi username (backend sẽ tự động xử lý username hoặc email)
      username: formData.usernameOrEmail,
      password: formData.password,
    };
    userService
      .login(loginData)
      .then((response) => {
        console.log("Login response:", response); // ✅ Debug log        // Backend trả về JwtResponse object chứa accessToken, refreshToken và user info
        if (response && response.accessToken) {
          // response đã là JwtResponse object từ backend
          const userData = {
            userId: response.userId,
            username: response.username,
            email: response.email,
            role: response.role,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType || "Bearer",
            expiresIn: response.expiresIn,
          };

          const role = userData.role;

          // ✅ DEBUG: LOG CẤU TRÚC USER DATA
          console.log("User data to save:", userData);
          console.log("Access token:", userData.accessToken);
          console.log("Refresh token:", userData.refreshToken);

          // ✅ LƯU TOKEN VÀ USER DATA VÀO LOCALSTORAGE
          localStorageUtil.set("user", userData);

          // ✅ XÁC NHẬN ĐÃ LƯU THÀNH CÔNG
          const savedUser = localStorageUtil.get("user");
          console.log("Saved user data:", savedUser);

          // Kiểm tra role và chuyển hướng
          if (role === "ADMIN") {
            // Nếu là admin, chuyển hướng đến trang quản trị
            notify.success(
              "Đăng nhập thành công",
              `Chào mừng Admin ${userData.username}!`
            );
            navigate("/admin/profile");
            return;
          } else {
            // Nếu không phải admin, chuyển về trang chủ
            // Lưu thông báo đăng nhập thành công vào localStorage để hiển thị ở homepage
            localStorageUtil.set("loginSuccessMessage", {
              title: "Đăng nhập thành công",
              message: `Chào mừng ${userData.username} trở lại!`,
              timestamp: Date.now(),
            });
            window.location.href = "/";
          }
        } else {
          console.error("Login failed - missing accessToken:", response);
          notify.error(
            "Đăng nhập thất bại",
            response.message || "Server không trả về token xác thực"
          );
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        notify.error(
          "Lỗi đăng nhập",
          error.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại."
        );
      })
      .finally(() => {
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

  // --- RENDER METHODS ---
  /**
   * Hiển thị giao diện khi người dùng đã đăng nhập
   */
  // Nếu người dùng đã đăng nhập
  if (isLoggedIn && user) {
    return <LoggedInView user={user} onLogout={logout} />;
  }

  /**
   * Hiển thị form đăng nhập
   */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 50%, #E3F2FD 100%)", // Medical background
        py: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(74, 144, 226, 0.1)",
            boxShadow: "0 8px 32px rgba(74, 144, 226, 0.15)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header Section với màu y tế */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
                  boxShadow: "0 8px 24px rgba(74, 144, 226, 0.25)",
                }}
              >
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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
                  mx: "auto",
                  lineHeight: 1.6,
                  color: "#546E7A", // Medical text color
                }}
              >
                Nhập thông tin của bạn để truy cập hệ thống chăm sóc sức khỏe
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, opacity: 0.3, borderColor: "#4A90E2" }} />

            {/* Form đăng nhập */}
            <Box component="form" onSubmit={handleLogin}>
              {/* Card chứa form */}
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)",
                  border: "1px solid rgba(74, 144, 226, 0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#4A90E2", // Medical blue
                    fontWeight: "bold",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LoginIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Thông tin đăng nhập
                </Typography>

                {/* Username hoặc Email với màu y tế */}
                <TextField
                  label="Username hoặc Email"
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
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(74, 144, 226, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(74, 144, 226, 0.2)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#4A90E2",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#4A90E2",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#4A90E2" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Mật khẩu với màu y tế */}
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(74, 144, 226, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(74, 144, 226, 0.2)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#4A90E2",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#4A90E2",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon sx={{ color: "#4A90E2" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? (
                            <VisibilityOffIcon sx={{ color: "#4A90E2" }} />
                          ) : (
                            <VisibilityIcon sx={{ color: "#4A90E2" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Link quên mật khẩu */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                >
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "#1ABC9C", // Medical green
                        transition: "all 0.3s ease",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#17A085",
                        },
                      }}
                    >
                      Quên mật khẩu?
                    </Typography>
                  </Link>
                </Box>
              </Box>

              {/* Nút đăng nhập với màu y tế */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
                  color: "#fff",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: loading ? "none" : "translateY(-2px)",
                    boxShadow: loading
                      ? "0 2px 8px rgba(74, 144, 226, 0.25)"
                      : "0 4px 12px rgba(74, 144, 226, 0.35)",
                    background: loading
                      ? "linear-gradient(45deg, #4A90E2, #1ABC9C)"
                      : "linear-gradient(45deg, #357ABD, #17A085)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(45deg, #B0BEC5, #90A4AE)",
                    transform: "none",
                    color: "#fff",
                  },
                }}
              >
                <LoginIcon sx={{ mr: 1 }} />
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <Divider sx={{ my: 3, opacity: 0.3, borderColor: "#4A90E2" }} />

              {/* Link đăng ký với màu y tế */}
              <Box sx={{ textAlign: "center" }}>
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: "#4A90E2", // Medical blue
                      transition: "all 0.3s ease",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#357ABD",
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

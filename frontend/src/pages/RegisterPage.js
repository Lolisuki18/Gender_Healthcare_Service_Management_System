/**
 * Form Đăng Ký Người Dùng
 *
 * Component này xử lý quá trình đăng ký người dùng mới, bao gồm:
 * - Nhập thông tin cá nhân và tài khoản
 * - Xác thực email bằng mã xác nhận
 * - Gửi dữ liệu đăng ký đến server
 */

// --- IMPORTS ---
import localStorageUtil from "@/utils/localStorage";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  useTheme,
  alpha,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import notify from "@/utils/notification";
import { Link } from "react-router-dom";

// --- ICONS ---
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// --- SERVICES & UTILS ---
import { styled } from "@mui/material/styles";
import { userService } from "@/services/userService";
import LoggedInView from "@common/LoggedInView";
import { logout } from "@/redux/slices/authSlice";

/**
 * Component chính Form Đăng Ký
 */
const RegisterPage = () => {
  // --- THEME & STYLES ---
  const theme = useTheme();

  // --- STATE MANAGEMENT ---
  // Form data state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    verificationCode: "",
  });

  // UI states
  const [isCodeButtonDisabled, setCodeButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    confirmPassword: "",
  });

  // --- LIFECYCLE HOOKS ---
  /**
   * Kiểm tra trạng thái đăng nhập khi component được render
   */
  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorageUtil.get("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(userData);
    }

    // Cleanup function khi component unmount
    return () => {
      // Xóa tất cả các interval để tránh memory leak
      const intervalId = setInterval(() => {}, 100);
      for (let i = 1; i <= intervalId; i++) {
        clearInterval(i);
      }
    };
  }, []);

  // --- EVENT HANDLERS ---
  /**
   * Xử lý thay đổi giá trị của các trường input
   */
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật formData
    setFormData({ ...formData, [name]: value });

    // Reset lỗi khi người dùng thay đổi giá trị
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  /**
   * Xử lý toggle hiển thị/ẩn mật khẩu
   */
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Xử lý toggle hiển thị/ẩn xác nhận mật khẩu
   */
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Xử lý submit form đăng ký
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tất cả các trường và hiển thị thông báo lỗi
    if (!formData.username) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!formData.password) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập mật khẩu");
      return;
    }

    if (!formData.fullName) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập họ tên đầy đủ");
      return;
    }

    if (!formData.email) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập email");
      return;
    }

    if (!formData.verificationCode) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập mã xác nhận");
      return;
    }

    // Kiểm tra confirm password có trùng khớp không
    if (confirmPassword !== formData.password) {
      notify.error("Lỗi đăng ký", "Mật khẩu xác nhận không trùng khớp");
      return;
    }

    // Gửi form đăng ký đến server
    userService
      .register(formData)
      .then((response) => {
        if (response.success) {
          notify.success(
            "Đăng ký thành công",
            "Tài khoản của bạn đã được tạo thành công, sẽ chuyển đến trang đăng nhập trong giây lát"
          );
          // Chuyển hướng về trang đăng nhập sau một khoảng thời gian ngắn
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          // Nếu có lỗi từ server (không vào catch nhưng success = false)
          const errorMessage = response.message || "Có lỗi xảy ra khi đăng ký";
          notify.error("Đăng ký thất bại", errorMessage);
        }
      })
      .catch((error) => {
        // Response từ server là một object, message là một field trong object đó
        const errorMessage = error.message || "Có lỗi xảy ra khi đăng ký";

        // Phân tích message để xác định loại lỗi và hiển thị thông báo tương ứng
        if (errorMessage.includes("Username already exists")) {
          notify.error("Đăng ký thất bại", "Username đã tồn tại");
        } else if (errorMessage.includes("Email already exists")) {
          notify.error("Đăng ký thất bại", "Email đã được sử dụng");
        } else if (errorMessage.includes("verification code")) {
          notify.error(
            "Lỗi xác thực",
            "Mã xác nhận không đúng hoặc đã hết hạn. Vui lòng yêu cầu mã mới."
          );
        } else {
          notify.error("Đăng ký thất bại", errorMessage);
        }
        console.error("Register error:", error);
      });
  };

  /**
   * Xử lý thay đổi giá trị xác nhận mật khẩu
   */
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Kiểm tra xem mật khẩu xác nhận có khớp với mật khẩu không
    if (value && value !== formData.password) {
      // Chỉ lưu lỗi trong state nhưng không hiển thị dưới text field
      setErrors({
        ...errors,
        confirmPassword: "Mật khẩu xác nhận không trùng khớp",
      });
    } else {
      setErrors({
        ...errors,
        confirmPassword: "",
      });
    }
  };

  /**
   * Xử lý gửi mã xác nhận đến email
   */
  const sendVerificationCode = (e) => {
    // Kiểm tra email đã nhập chưa
    if (formData.email === "") {
      notify.error("Lỗi", "Vui lòng nhập email để gửi mã xác nhận");
      return;
    }

    // Disable nút và bắt đầu đếm ngược
    setCodeButtonDisabled(true);
    setCountdown(60);

    // Tạo interval để đếm ngược
    const intervalId = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(intervalId);
          setCodeButtonDisabled(false);
          return 60;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Kiểm tra các trường bắt buộc
    if (
      !formData.username ||
      !formData.password ||
      !formData.fullName ||
      !formData.email
    ) {
      notify.error("Lỗi", "Vui lòng điền đầy đủ thông tin");
      clearInterval(intervalId);
      setCodeButtonDisabled(false);
      return; // Dừng việc submit form nếu có trường nào đó trống
    }

    // Gọi API gửi mã xác nhận
    userService
      .sendCode(formData.email)
      .then((response) => {
        if (response.success) {
          notify.success(
            "Gửi mã thành công",
            "Mã xác nhận đã được gửi đến email của bạn"
          );
        } else {
          notify.error("Gửi mã thất bại", response.message || "Có lỗi xảy ra");
          clearInterval(intervalId);
          setCodeButtonDisabled(false);
        }
      })
      .catch((error) => {
        console.error("Send code error:", error);
        notify.error(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
        );
        clearInterval(intervalId);
        setCodeButtonDisabled(false);
      });
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
   * Hiển thị giao diện form đăng ký
   */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        py: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 8px 24px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Đăng ký tài khoản
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 500,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Điền thông tin của bạn để trải nghiệm dịch vụ chăm sóc sức khỏe
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, opacity: 0.3 }} />

            {/* Form Section */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Thông tin tài khoản */}
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AccountCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Thông tin tài khoản
                </Typography>

                {/* Username */}
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  value={formData.username}
                  onChange={handleOnChange}
                  variant="outlined"
                  required
                  autoFocus
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 0 0 2px ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 2px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Mật khẩu */}
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={handleOnChange}
                  variant="outlined"
                  required
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Xác nhận mật khẩu */}
                <TextField
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  variant="outlined"
                  required
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Thông tin cá nhân */}
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.success.main,
                    0.05
                  )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.success.main,
                    fontWeight: "bold",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Thông tin cá nhân
                </Typography>

                {/* Họ tên */}
                <TextField
                  label="Họ và tên đầy đủ"
                  name="fullName"
                  fullWidth
                  value={formData.fullName}
                  onChange={handleOnChange}
                  variant="outlined"
                  required
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email và nút gửi mã */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item size={8}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleOnChange}
                      variant="outlined"
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="success" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item size={4}>
                    <Button
                      variant="contained"
                      onClick={sendVerificationCode}
                      disabled={isCodeButtonDisabled}
                      fullWidth
                      sx={{
                        height: 56,
                        fontWeight: "bold",
                        borderRadius: 2,
                        background: isCodeButtonDisabled
                          ? `linear-gradient(135deg, ${alpha(
                              theme.palette.grey[400],
                              0.8
                            )} 0%, ${alpha(theme.palette.grey[500], 0.8)} 100%)`
                          : `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        boxShadow: isCodeButtonDisabled
                          ? "none"
                          : `0 6px 20px ${alpha(
                              theme.palette.success.main,
                              0.4
                            )}`,
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: isCodeButtonDisabled
                            ? "none"
                            : "translateY(-2px)",
                          boxShadow: isCodeButtonDisabled
                            ? "none"
                            : `0 8px 25px ${alpha(
                                theme.palette.success.main,
                                0.5
                              )}`,
                        },
                      }}
                    >
                      {isCodeButtonDisabled ? `Đợi ${countdown}s` : "Gửi mã"}
                    </Button>
                  </Grid>
                </Grid>

                {/* Mã xác nhận */}
                <TextField
                  label="Mã xác nhận"
                  name="verificationCode"
                  fullWidth
                  value={formData.verificationCode}
                  onChange={handleOnChange}
                  variant="outlined"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedUserIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Nút đăng ký */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  fontWeight: "bold",
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${alpha(
                      theme.palette.primary.main,
                      0.5
                    )}`,
                  },
                }}
              >
                <LockOutlinedIcon sx={{ mr: 1 }} />
                Đăng Ký
              </Button>

              <Divider sx={{ my: 3, opacity: 0.3 }} />

              {/* Link đăng nhập */}
              <Box sx={{ textAlign: "center" }}>
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.primary.main,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Bạn đã có tài khoản? Đăng nhập ngay
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

export default RegisterPage;

// RegisterPage.js
// --- IMPORTS ---
import localStorageUtil from "@/utils/localStorage";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Divider,
  useTheme,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// --- ICONS ---
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WcIcon from "@mui/icons-material/Wc";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// --- SERVICES & UTILS ---

import { userService } from "@/services/userService";
import LoggedInView from "@common/LoggedInView";
import { logout } from "@/redux/slices/authSlice";

/**
 * Component chính Form Đăng Ký
 */
const RegisterPage = () => {
  // --- STATE MANAGEMENT ---
  // Form data state
  // Sử dụng useState để quản lý dữ liệu form
  // formData chứa tất cả các trường cần thiết cho đăng ký
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    verificationCode: "",
    gender: "",
    phone: "",
    birthDay: "",
    address: "",
  });

  // UI states
  // Các state để quản lý giao diện và tương tác người dùng
  // isCodeButtonDisabled để vô hiệu hóa nút gửi mã xác nhận trong 60 giây
  const [isCodeButtonDisabled, setCodeButtonDisabled] = useState(false);
  // countdown để đếm ngược thời gian gửi mã xác nhận -> 60s
  const [countdown, setCountdown] = useState(60);
  // confirmPassword để lưu giá trị xác nhận mật khẩu
  const [confirmPassword, setConfirmPassword] = useState("");
  // isLoggedIn để kiểm tra trạng thái đăng nhập của người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // user để lưu thông tin người dùng đã đăng nhập
  const [user, setUser] = useState(null);
  // showPassword và showConfirmPassword để quản lý hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  // showConfirmPassword để quản lý hiển thị/ẩn xác nhận mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  //các state để quản lý lỗi validation cho từng trường
  // errors chứa thông báo lỗi cho từng trường trong form
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    confirmPassword: "",
    password: "",
  });

  // --- LIFECYCLE HOOKS ---
  /**
   * Kiểm tra trạng thái đăng nhập khi component được render
   */
  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorageUtil.get("user");
    if (userData) {
      // Nếu có thông tin người dùng, đặt trạng thái đăng nhập
      setIsLoggedIn(true);
      setUser(userData);
    }

    return () => {
      // Xóa tất cả các interval để tránh memory leak
      // Sử dụng clearInterval để xóa tất cả các interval đã tạo
      const intervalId = setInterval(() => {}, 100);
      // clearInterval sẽ xóa tất cả các interval đã tạo
      for (let i = 1; i <= intervalId; i++) {
        clearInterval(i);
      }
    };
  }, []);

  // --- VALIDATION FUNCTIONS ---
  /**
   * Validation mật khẩu theo yêu cầu backend
   */
  const validatePassword = (password) => {
    //sử dụng Regex để kiểm tra mật khẩu
    const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;

    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (password.length > 100) {
      return "Mật khẩu không được vượt quá 100 ký tự";
    }

    if (!pattern.test(password)) {
      return "Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@#$%^&+=)";
    }
    return "";
  };

  // --- EVENT HANDLERS ---
  /**
   * Xử lý thay đổi giá trị của các trường input
   */
  const handleOnChange = (e) => {
    // Lấy tên và giá trị của trường input
    const { name, value } = e.target;

    // Cập nhật formData
    setFormData({ ...formData, [name]: value });

    // Validation đặc biệt cho password
    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors({
        ...errors,
        password: passwordError,
      });
    }

    // Validation cho username
    if (name === "username") {
      let usernameError = "";
      if (value.length > 0 && value.length < 4) {
        usernameError = "Username phải có ít nhất 4 ký tự";
      } else if (value.length > 50) {
        usernameError = "Username không được vượt quá 50 ký tự";
      }
      setErrors({
        ...errors,
        username: usernameError,
      });
    }

    // Validation cho fullName
    if (name === "fullName") {
      let fullNameError = "";
      if (value.length > 100) {
        fullNameError = "Họ tên không được vượt quá 100 ký tự";
      }
      setErrors({
        ...errors,
        fullName: fullNameError,
      });
    }

    // Reset lỗi khi người dùng thay đổi giá trị (cho các trường khác)
    if (
      errors[name] &&
      name !== "password" &&
      name !== "username" &&
      name !== "fullName"
    ) {
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

    // Kiểm tra username
    if (!formData.username) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập tên đăng nhập");
      return;
    }

    if (formData.username.length < 4 || formData.username.length > 50) {
      notify.error("Lỗi đăng ký", "Username phải có từ 4-50 ký tự");
      return;
    }

    // Kiểm tra password với validation mới
    if (!formData.password) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập mật khẩu");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      notify.error("Lỗi đăng ký", passwordError);
      return;
    }

    // Kiểm tra fullName
    if (!formData.fullName) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập họ tên đầy đủ");
      return;
    }

    if (formData.fullName.length > 100) {
      notify.error("Lỗi đăng ký", "Họ tên không được vượt quá 100 ký tự");
      return;
    }

    // Kiểm tra gender - sửa logic validation
    if (
      !formData.gender ||
      formData.gender === "" ||
      formData.gender === null ||
      formData.gender === undefined
    ) {
      notify.error("Lỗi đăng ký", "Vui lòng chọn giới tính");
      //*DEBUG : Log ra gender coi thử
      console.log("Gender value:", formData.gender);
      return;
    }

    if (!formData.email) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập email");
      return;
    }

    if (!formData.verificationCode) {
      notify.error("Lỗi đăng ký", "Vui lòng nhập mã xác nhận");
      return;
    } // Kiểm tra confirm password có trùng khớp không
    if (confirmPassword !== formData.password) {
      notify.error("Lỗi đăng ký", "Mật khẩu xác nhận không trùng khớp");
      return;
    }

    //Chuyển đổi Gender sang tiếng việt
    const convertGenderToVietnamese = (genderValue) => {
      const genderMapping = {
        MALE: "Nam",
        FEMALE: "Nữ",
        OTHER: "Khác",
      };
      return genderMapping[genderValue] || genderValue;
    };

    // Tạo object dữ liệu đầy đủ để gửi lên server
    const registrationData = {
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      email: formData.email,
      gender: convertGenderToVietnamese(formData.gender), //Chuyển đổi gender sang tiếng Việt
      phone: formData.phone || null, // Optional field
      birthDay: formData.birthDay || null, // Optional field
      address: formData.address || null, // Optional field
      verificationCode: formData.verificationCode,
    };

    // *Debug: Log dữ liệu trước khi gửi
    console.log("Registration data being sent:", registrationData);

    // Gửi form đăng ký đến server
    userService
      .register(registrationData) // Gửi registrationData thay vì formData
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
        console.error("Register error:", error);

        // Response từ server là một object, message là một field trong object đó
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi đăng ký";

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
        } else if (errorMessage.includes("gender")) {
          notify.error("Lỗi đăng ký", "Vui lòng chọn giới tính");
        } else {
          notify.error("Đăng ký thất bại", errorMessage);
        }
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
    // Đặt countdown về 60 giây
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

    // CHỈ KIỂM TRA EMAIL - không cần kiểm tra các trường khác khi gửi mã
    // Vì mã xác nhận chỉ cần email để gửi
    if (!formData.email) {
      notify.error("Lỗi", "Vui lòng nhập email để gửi mã xác nhận");
      // Dừng interval nếu không có email
      clearInterval(intervalId);
      // Bật lại nút gửi mã
      setCodeButtonDisabled(false);
      return;
    }

    // Gọi API gửi mã xác nhận
    userService
      .sendCode(formData.email)
      .then((response) => {
        // nếu thành công
        if (response.success) {
          notify.success(
            "Gửi mã thành công",
            "Mã xác nhận đã được gửi đến email của bạn"
          );
        } else {
          // nếu không thành công
          notify.error("Gửi mã thất bại", response.message || "Có lỗi xảy ra");
          clearInterval(intervalId);
          setCodeButtonDisabled(false);
        }
      })
      .catch((error) => {
        // nếu gửi thất bại
        console.error("Send code error:", error);
        notify.error(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
        );
        // Dừng interval và bật lại nút gửi mã
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
    // Hiển thị giao diện đã đăng nhập
    return <LoggedInView user={user} onLogout={logout} />;
  }
  /**
   * Hiển thị giao diện form đăng ký
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
      <Container maxWidth="md">
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
            {/* Header Section*/}
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
                Đăng ký tài khoản
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 500,
                  mx: "auto",
                  lineHeight: 1.6,
                  color: "#546E7A", // Medical gray
                }}
              >
                Điền thông tin của bạn để trải nghiệm dịch vụ chăm sóc sức khỏe
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, opacity: 0.3, borderColor: "#4A90E2" }} />

            {/* Form Section */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Thông tin tài khoản*/}
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
                  <AccountCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Thông tin tài khoản
                </Typography>

                {/* Username  */}
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  value={formData.username}
                  onChange={handleOnChange}
                  variant="outlined"
                  required
                  autoFocus
                  error={!!errors.username}
                  helperText={errors.username}
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

                {/* Mật khẩu*/}
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={handleOnChange}
                  variant="outlined"
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    // MUI styles for password field
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                    // Focus styles
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
                        <IconButton
                          onClick={handleToggleConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon sx={{ color: "#4A90E2" }} />
                          ) : (
                            <VisibilityIcon sx={{ color: "#4A90E2" }} />
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
                  background:
                    "linear-gradient(135deg, rgba(26, 188, 156, 0.05) 0%, rgba(74, 144, 226, 0.05) 100%)",
                  border: "1px solid rgba(26, 188, 156, 0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#1ABC9C", // Medical green
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
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1ABC9C",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#1ABC9C",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#1ABC9C" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Giới tính */}
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1ABC9C",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#1ABC9C",
                      },
                  }}
                >
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    label="Giới tính"
                    name="gender"
                    value={formData.gender}
                    onChange={handleOnChange}
                    displayEmpty={false}
                    renderValue={(selected) => {
                      if (!selected || selected === "") {
                        return <em>Chọn giới tính</em>;
                      }
                      switch (selected) {
                        case "MALE":
                          return "Nam";
                        case "FEMALE":
                          return "Nữ";
                        case "OTHER":
                          return "Khác";
                        default:
                          return selected;
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <WcIcon sx={{ color: "#1ABC9C" }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="MALE">Nam</MenuItem>
                    <MenuItem value="FEMALE">Nữ</MenuItem>
                    <MenuItem value="OTHER">Khác</MenuItem>
                  </Select>
                </FormControl>

                {/* Số điện thoại*/}
                <TextField
                  label="Số điện thoại"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleOnChange}
                  variant="outlined"
                  placeholder="Ví dụ: 0123456789"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1ABC9C",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#1ABC9C",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#1ABC9C" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Ngày sinh*/}
                <TextField
                  label="Ngày sinh"
                  name="birthDay"
                  type="date"
                  fullWidth
                  value={formData.birthDay}
                  onChange={handleOnChange}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1ABC9C",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#1ABC9C",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: "#1ABC9C" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                {/* Địa chỉ nhà */}
                <TextField
                  label="Địa chỉ nhà"
                  name="address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleOnChange}
                  variant="outlined"
                  placeholder="Ví dụ: 123 Đường ABC, Phường XYZ, Quận DEF, TP.HCM"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1ABC9C",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#1ABC9C",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon sx={{ color: "#1ABC9C" }} />
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
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#1ABC9C",
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "#1ABC9C",
                          },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: "#1ABC9C" }} />
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
                          ? "linear-gradient(45deg, #B0BEC5, #90A4AE)"
                          : "linear-gradient(45deg, #1ABC9C, #16A085)",
                        color: "#fff",
                        boxShadow: isCodeButtonDisabled
                          ? "none"
                          : "0 2px 8px rgba(26, 188, 156, 0.25)",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: isCodeButtonDisabled
                            ? "none"
                            : "translateY(-2px)",
                          boxShadow: isCodeButtonDisabled
                            ? "none"
                            : "0 4px 12px rgba(26, 188, 156, 0.35)",
                          background: isCodeButtonDisabled
                            ? "linear-gradient(45deg, #B0BEC5, #90A4AE)"
                            : "linear-gradient(45deg, #17A2B8, #138496)",
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
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1ABC9C",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#1ABC9C",
                      },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedUserIcon sx={{ color: "#1ABC9C" }} />
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
                  background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
                  color: "#fff",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(74, 144, 226, 0.35)",
                    background: "linear-gradient(45deg, #357ABD, #17A085)",
                  },
                }}
              >
                <LockOutlinedIcon sx={{ mr: 1 }} />
                Đăng Ký
              </Button>

              <Divider sx={{ my: 3, opacity: 0.3, borderColor: "#4A90E2" }} />

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
                      color: "#4A90E2", // Medical blue
                      transition: "all 0.3s ease",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#357ABD",
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

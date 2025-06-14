import { userService } from "@/services/userService";
import notify from "@/utils/notification";
import React, { useEffect, useState } from "react";
import useAuthCheck from "@/hooks/useAuthCheck";
import LoggedInView from "@/components/common/LoggedInView";
import NotLoggedInView from "@/components/common/NoLoggedInView";

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
import localStorageUtil from "@/utils/localStorage";
const ForgotPasswordPage = () => {
  const theme = useTheme();

  // Sử dụng custom hook để kiểm tra auth
  const { isLoggedIn, user, logout } = useAuthCheck();

  const [formDataForgotPassword, setformDataForgotPassword] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [formDataResetPassword, setformDataResetPassword] = useState({
    email: "",
    code: "",
    newPassword: "",
  });
  const [checksendCode, setCheckSendCode] = useState(false);
  const [checkResetPassword, setCheckResetPassword] = useState(false);
  const [isCodeButtonDisabled, setCodeButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Kiểm tra đăng nhập qua localStorage
  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);
  //hàm handleChange để cập nhật giá trị email trong form
  const handleChangeEmail = (e) => {
    setformDataForgotPassword({
      ...formDataForgotPassword,
      email: e.target.value,
    });
  };
  //check xem đã đăng nhập hay chưa
  // useEffect(() => {
  //   const userData = localStorageUtil.get("user");
  //   if (userData) {
  //     setIsLoggedInLocal(true);
  //   }
  // }, []);
  const handleChangeResetPassword = (e) => {
    setformDataResetPassword({
      ...formDataResetPassword,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm gửi mã xác nhận đến email
  const handleSendCode = (e) => {
    e.preventDefault();
    // Kiểm tra tính hợp lệ của email
    if (formDataForgotPassword.email === "") {
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
          return 0; // ← Sửa: trả về 0 thay vì 60
        }
        return prevCount - 1;
      });
    }, 1000);

    userService
      .sendCodeForgotPassword(formDataForgotPassword.email)
      .then((response) => {
        if (response.success) {
          notify.success(
            "Thành công",
            "Mã xác nhận đã được gửi đến email của bạn."
          );
          setCheckSendCode(true);
        } else {
          notify.error(
            "Gửi mã xác nhận thất bại",
            response.message || "Có lỗi xảy ra khi gửi mã xác nhận."
          );
          clearInterval(intervalId);
          setCodeButtonDisabled(false);
          setCountdown(0); // ← Thêm: reset countdown về 0
        }
      })
      .catch((response) => {
        console.error("Send code error:", response);
        notify.error(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
        );
        clearInterval(intervalId);
        setCodeButtonDisabled(false);
        setCountdown(0); // ← Thêm: reset countdown về 0
      });
  };

  //hàm sử lý reset mật khẩu
  const handleResetPassword = (e) => {
    e.preventDefault();
    //xử lý lỗi nếu trống
    if (formDataResetPassword.code === "") {
      notify.error("Lỗi", "Vui lòng nhập mã xác nhận.");
      return;
    }
    if (formDataResetPassword.newPassword === "") {
      notify.error("Lỗi", "Vui lòng nhập mật khẩu mới.");
      return;
    }

    //nếu các trường đã được nhập đầy đủ thông tin
    userService
      .resetPassword(
        formDataForgotPassword.email,
        formDataResetPassword.code,
        formDataResetPassword.newPassword
      )
      .then((response) => {
        if (response.success) {
          notify.success("Thành công", "Mật khẩu đã được đặt lại thành công.");
          setCheckResetPassword(true);
          // Reset form sau khi đặt lại mật khẩu thành công
          setformDataForgotPassword({ email: "" });
          setformDataResetPassword({
            email: "",
            code: "",
            newPassword: "",
          });
        } else {
          notify.error(
            "Lỗi",
            response.message || "Có lỗi xảy ra khi đặt lại mật khẩu."
          );
        }
      })
      .catch((error) => {
        const errorMessage =
          error.message || "Có lỗi xảy ra khi đặt lại mật khẩu.";
        //phân tích lỗi và hiển thị thông báo
        //lỗi format password
        if (
          errorMessage.includes("Password must be between 6 and 100 characters")
        ) {
          notify.error("Lỗi", "Mật khẩu phải từ 6 đến 100 ký tự");
        }
        //Lỗi ko điền verification code
        if (errorMessage.includes("Verification code is required")) {
          notify.error("Lỗi", "Mã xác minh là bắt buộc");
        }
        //Lỗi ko điền email
        if (errorMessage.includes("Email is required")) {
          notify.error("Lỗi", "Email là bắt buộc");
        }
        //Lỗi không tìm thấy tài khoản với email
        if (errorMessage.includes("No account found with this email")) {
          notify.error("Lỗi", "Không tìm thấy tài khoản nào có email này");
        }

        console.error("Reset password error:", error);
        notify.error("Lỗi kết nối", error.message);
      });
  };

  // Nếu người dùng đã đăng nhập
  if (isLoggedIn && user) {
    return <LoggedInView user={user} onLogout={logout} />;
  }

  // Form quên mật khẩu với màu y tế
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
                Quên mật khẩu
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
                Vui lòng nhập địa chỉ email của bạn để nhận mã xác nhận và đặt
                lại mật khẩu.
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, opacity: 0.3, borderColor: "#4A90E2" }} />

            {/* Form Section */}
            <Box component="form">
              {/* Card chứa form gửi email */}
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
                  <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Nhập email của bạn
                </Typography>

                {/* Email và nút gửi mã xác nhận */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item size={8}>
                    <TextField
                      fullWidth
                      label="Địa chỉ email"
                      variant="outlined"
                      value={formDataForgotPassword.email}
                      onChange={handleChangeEmail}
                      required
                      sx={{
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
                            <EmailIcon sx={{ color: "#4A90E2" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item size={4}>
                    <Button
                      variant="contained"
                      onClick={handleSendCode}
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
                      {isCodeButtonDisabled && countdown > 0
                        ? `Đợi ${countdown}s`
                        : checksendCode
                        ? "Gửi lại mã"
                        : "Gửi mã"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Reset Password Section */}
              {checksendCode && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(26, 188, 156, 0.05) 0%, rgba(74, 144, 226, 0.05) 100%)",
                    border: "1px solid rgba(26, 188, 156, 0.2)",
                    animation: "fadeInUp 0.5s ease-out",
                    "@keyframes fadeInUp": {
                      from: {
                        opacity: 0,
                        transform: "translateY(20px)",
                      },
                      to: {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
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
                    <VerifiedUserIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Xác nhận và đặt lại mật khẩu
                  </Typography>

                  <TextField
                    fullWidth
                    label="Mã xác nhận"
                    variant="outlined"
                    name="code"
                    value={formDataResetPassword.code}
                    onChange={handleChangeResetPassword}
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
                          <VerifiedUserIcon sx={{ color: "#1ABC9C" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    variant="outlined"
                    name="newPassword"
                    type="password"
                    value={formDataResetPassword.newPassword}
                    onChange={handleChangeResetPassword}
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
                          <VpnKeyIcon sx={{ color: "#1ABC9C" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleResetPassword}
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
                    <VpnKeyIcon sx={{ mr: 1 }} />
                    Đặt lại mật khẩu
                  </Button>
                </Box>
              )}

              {/* Success Message */}
              {checkResetPassword && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    textAlign: "center",
                    animation: "fadeInUp 0.5s ease-out",
                  }}
                >
                  <VerifiedUserIcon
                    sx={{
                      fontSize: 48,
                      color: "#4CAF50", // Success green
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    Đặt lại mật khẩu thành công!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#546E7A",
                      mb: 3,
                    }}
                  >
                    Bạn có thể đăng nhập với mật khẩu mới của mình.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical gradient
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(74, 144, 226, 0.35)",
                        background: "linear-gradient(45deg, #357ABD, #17A085)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <HomeIcon sx={{ mr: 1 }} />
                    Đăng nhập ngay
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 3, opacity: 0.3, borderColor: "#4A90E2" }} />

              {/* Link về trang đăng nhập */}
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="text"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  sx={{
                    fontWeight: 500,
                    color: "#4A90E2", // Medical blue
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#357ABD",
                      backgroundColor: "rgba(74, 144, 226, 0.05)",
                    },
                  }}
                >
                  Quay lại trang đăng nhập
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;

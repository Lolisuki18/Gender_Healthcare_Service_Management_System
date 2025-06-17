import { styled } from "@mui/material/styles";

import { Button, Stack, Zoom, Box, Container, Typography } from "@mui/material";
import {
  Login as LoginIcon,
  ArrowBack as ArrowBackIcon,
  PersonAddAlt as RegisterIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
// import "@styles/ProfilePage.css";
// Styled Components
const ProfileContainer = styled(Container)({
  minHeight: "100vh",
  width: "100vw",
  maxWidth: "100% !important",
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)", // Light medical gradient
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="b" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%234A90E2" stop-opacity="0.05"/><stop offset="100%" stop-color="%231ABC9C" stop-opacity="0.03"/></radialGradient></defs><circle cx="200" cy="200" r="150" fill="url(%23b)"/><circle cx="800" cy="800" r="200" fill="url(%23b)"/></svg>\')',
    backgroundSize: "1000px 1000px",
    backgroundPosition: "center",
    opacity: 0.6,
  },
});

const ErrorContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "50vh",
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  borderRadius: "var(--border-radius-xl)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "var(--shadow-elevation-high)",
  padding: "var(--spacing-12)",
  margin: "var(--spacing-8) auto",
  maxWidth: "600px",
});

const NoLoggedInView = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <ProfileContainer maxWidth={false} disableGutters>
      <Zoom in={true} timeout={500}>
        <ErrorContainer
          sx={{
            width: { xs: "95%", sm: "85%", md: "75%", lg: "65%" },
            maxWidth: "900px",
            borderRadius: "24px",
            padding: 0,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(74, 144, 226, 0.15)",
            boxShadow: "0 25px 50px rgba(74, 144, 226, 0.1)",
            backdropFilter: "blur(20px)",
            position: "relative",
            m: 0,
            minHeight: { xs: "auto", sm: "500px" },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              borderBottom: "none",
              padding: { xs: "50px 20px", sm: "60px 40px", md: "70px 40px" },
              width: "100%",
            }}
          >
            {/* Medical cross pattern overlay */}
            <Box
              sx={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                opacity: 0.1,
                backgroundImage:
                  'url(\'data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M25 5h10v50h-10zM5 25h50v10H5z" fill="%23FFFFFF"%3E%3C/path%3E%3C/svg%3E\')',
                backgroundSize: "60px 60px",
                zIndex: 1,
              }}
            />

            {/* Container cho nội dung chính */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Security/Access icon container */}
              <Box
                sx={{
                  width: { xs: "100px", sm: "120px" },
                  height: { xs: "100px", sm: "120px" },
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 25px",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Lock/Security icon */}
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: "50px", sm: "60px" },
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  🔐
                </Box>
              </Box>

              {/* Tiêu đề */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: "#ffffff",
                  fontWeight: "700",
                  marginBottom: "20px",
                  position: "relative",
                  zIndex: 2,
                  fontSize: { xs: "32px", sm: "40px" },
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  letterSpacing: "0.5px",
                }}
              >
                Truy cập bị hạn chế
              </Typography>

              {/* Phụ đề */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontWeight: "400",
                  position: "relative",
                  zIndex: 2,
                  fontSize: { xs: "18px", sm: "20px" },
                  maxWidth: "600px",
                  margin: "0 auto",
                  letterSpacing: "0.3px",
                  lineHeight: 1.6,
                  paddingBottom: "10px",
                }}
              >
                Bạn cần đăng nhập với quyền phù hợp để truy cập trang này
              </Typography>
            </Box>
          </Box>

          {/* Main content */}
          <Box sx={{ padding: { xs: "40px 20px", sm: "50px 40px 40px" } }}>
            <Box
              sx={{
                backgroundColor: "rgba(74, 144, 226, 0.05)",
                borderRadius: "20px",
                padding: { xs: "25px", sm: "35px" },
                marginBottom: "35px",
                border: "1px solid rgba(74, 144, 226, 0.1)",
                boxShadow: "0 10px 25px rgba(74, 144, 226, 0.05)",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#475569",
                  textAlign: "center",
                  fontSize: { xs: "16px", sm: "18px" },
                  lineHeight: 1.7,
                  marginBottom: { xs: "25px", sm: "35px" },
                  fontWeight: "400",
                }}
              >
                Trang này yêu cầu quyền truy cập đặc biệt. Vui lòng đăng nhập
                với tài khoản có đủ quyền hạn hoặc liên hệ quản trị viên để được
                hỗ trợ.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ mb: 1 }}
              >
                {/*Đi đến trang đăng nhập */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLogin}
                  fullWidth
                  startIcon={<LoginIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                    color: "#fff",
                    fontSize: { xs: "16px", sm: "17px" },
                    padding: { xs: "14px 0", sm: "16px 0" },
                    textTransform: "none",
                    borderRadius: "14px",
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(74, 144, 226, 0.3)",
                    transition: "all 0.3s ease",
                    border: "none",
                    "&:hover": {
                      background: "linear-gradient(45deg, #357ABD, #17A2B8)",
                      boxShadow: "0 6px 20px rgba(74, 144, 226, 0.4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                {/*Đi đến trang đăng ký */}
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleRegister}
                  fullWidth
                  startIcon={<RegisterIcon />}
                  sx={{
                    color: "#4A90E2",
                    borderColor: "rgba(74, 144, 226, 0.4)",
                    borderWidth: "2px",
                    fontSize: { xs: "16px", sm: "17px" },
                    padding: { xs: "14px 0", sm: "16px 0" },
                    textTransform: "none",
                    borderRadius: "14px",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#4A90E2",
                      backgroundColor: "rgba(74, 144, 226, 0.08)",
                      color: "#357ABD",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 15px rgba(74, 144, 226, 0.2)",
                    },
                  }}
                >
                  Tạo tài khoản mới
                </Button>
              </Stack>
            </Box>
            {/*Đi lại trang trước */}
            <Button
              variant="text"
              color="inherit"
              onClick={handleGoBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontSize: "15px",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "rgba(74, 144, 226, 0.08)",
                  color: "#4A90E2",
                },
                width: "fit-content",
                mx: "auto",
                display: "flex",
              }}
            >
              Quay lại trang trước
            </Button>
          </Box>

          {/* Subtle medical pattern overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              opacity: 0.03,
              background: `
                radial-gradient(circle, rgba(74,144,226,0.2) 1px, transparent 1px) 0 0 / 40px 40px,
                radial-gradient(circle, rgba(26,188,156,0.2) 1px, transparent 1px) 20px 20px / 40px 40px
              `,
              pointerEvents: "none",
            }}
          />
        </ErrorContainer>
      </Zoom>
    </ProfileContainer>
  );
};
export default NoLoggedInView;

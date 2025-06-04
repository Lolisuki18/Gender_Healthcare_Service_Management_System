import { styled } from "@mui/material/styles";
import AdminProfile from "../AdminProfile/AdminProfile";
import ConsultantProfile from "../ConsultantProfile/ConsultantProfile";
import CustomerProfile from "../CustomerProfile/CustomerProfile";
import StaffProfile from "../StaffProfile/StaffProfile";
import {
  Button,
  Stack,
  Alert,
  AlertTitle,
  Zoom,
  Divider,
  Box,
  Container,
  Typography,
} from "@mui/material";
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
  maxWidth: "100% !important", // Ghi đè thuộc tính maxWidth của MUI
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
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
      'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="b" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23fff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="150" fill="url(%23b)"/><circle cx="800" cy="800" r="200" fill="url(%23b)"/></svg>\')',
    backgroundSize: "1000px 1000px",
    backgroundPosition: "center",
    opacity: 0.3,
  },
});

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "var(--border-radius-lg)",
  padding: "var(--spacing-3) var(--spacing-6)",
  fontWeight: 600,
  boxShadow: "var(--shadow-elevation-medium)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "var(--shadow-elevation-high)",
  },
}));

const GlassPaper = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "var(--border-radius-xl)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "var(--spacing-6)",
  marginTop: "var(--spacing-6)",
  boxShadow: "var(--shadow-elevation-medium)",
}));
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
            width: { xs: "95%", sm: "85%", md: "75%", lg: "65%" }, // Responsive width
            maxWidth: "900px", // Tăng maxWidth để hiện thị rộng hơn
            borderRadius: "20px",
            padding: 0,
            overflow: "hidden",
            background: "rgba(30, 41, 59, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(20px)",
            position: "relative",
            m: 0, // Reset margin
            minHeight: { xs: "auto", sm: "500px" },
          }}
        >
          {/* Header section - Cải tiến */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              padding: { xs: "40px 20px", sm: "50px 40px", md: "60px 40px" }, // Tăng padding để có không gian nhiều hơn
              width: "100%", // Đảm bảo lấp đầy chiều rộng
            }}
          >
            {/* Hiệu ứng nền tốt hơn */}
            <Box
              sx={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                opacity: 0.2,
                backgroundImage:
                  'url(\'data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="none"%3E%3C/path%3E%3Cpath d="M10 10m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0" fill="%23FFFFFF"%3E%3C/path%3E%3C/svg%3E\')',
                backgroundSize: "20px 20px",
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
              {/* Vùng chứa biểu tượng khóa */}
              <Box
                sx={{
                  width: { xs: "86px", sm: "100px" },
                  height: { xs: "86px", sm: "100px" },
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {/* Biểu tượng */}
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: "40px", sm: "48px" },
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  🔒
                </Box>
              </Box>

              {/* Tiêu đề */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: "#ffffff",
                  fontWeight: "700",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 2,
                  fontSize: { xs: "28px", sm: "36px" },
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
                  fontSize: { xs: "16px", sm: "18px" },
                  maxWidth: "600px",
                  margin: "0 auto",
                  letterSpacing: "0.3px",
                  lineHeight: 1.6,
                  paddingBottom: "10px", // Thêm padding dưới
                }}
              >
                Vui lòng đăng nhập để truy cập chức năng này
              </Typography>
            </Box>

            {/* Hiệu ứng sóng ở dưới */}
          </Box>

          {/* Main content */}
          <Box sx={{ padding: { xs: "30px 20px", sm: "40px 30px 30px" } }}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "16px",
                padding: { xs: "20px", sm: "25px" },
                marginBottom: "30px",
                border: "1px solid rgba(255, 255, 255, 0.07)",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textAlign: "center",
                  fontSize: { xs: "16px", sm: "17px" },
                  lineHeight: 1.7,
                  marginBottom: { xs: "20px", sm: "30px" },
                }}
              >
                Chức năng nay chỉ hiển thị cho các thành viên đã đăng nhập. Đăng
                nhập ngay để trải nghiệm đầy đủ các tính năng.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ mb: 1 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLogin}
                  fullWidth
                  startIcon={<LoginIcon />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "#fff",
                    fontSize: { xs: "15px", sm: "16px" },
                    padding: { xs: "10px 0", sm: "12px 0" },
                    textTransform: "none",
                    borderRadius: "12px",
                    fontWeight: 600,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.6)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Đăng nhập
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleRegister}
                  fullWidth
                  startIcon={<RegisterIcon />}
                  sx={{
                    color: "#e2e8f0",
                    borderColor: "rgba(226, 232, 240, 0.3)",
                    borderWidth: "2px",
                    fontSize: { xs: "15px", sm: "16px" },
                    padding: { xs: "10px 0", sm: "12px 0" },
                    textTransform: "none",
                    borderRadius: "12px",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#e2e8f0",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Đăng ký tài khoản
                </Button>
              </Stack>
            </Box>

            <Button
              variant="text"
              color="inherit"
              onClick={handleGoBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                textTransform: "none",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                },
                width: "fit-content",
                mx: "auto",
                display: "flex",
              }}
            >
              Quay lại trang trước
            </Button>
          </Box>

          {/* Decorative dots pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              opacity: 0.3,
              background: `
                radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px) 0 0 / 20px 20px,
                radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px) 10px 10px / 20px 20px
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

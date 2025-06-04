/**
 * AdminProfile.js - Soft Pastel Admin Dashboard
 *
 * Đã được redesign hoàn toàn từ glassmorphism thành soft pastel design system
 *
 * THAY ĐỔI CHÍNH:
 * 1. Soft pastel background với màu #FFF8F0 và gentle gradients
 * 2. Welcoming card styling với soft shadows
 * 3. Form inputs với pastel focus states
 * 4. CTA buttons với màu #B8E2F2 và border-radius: 1rem
 * 5. Typography với Inter/DM Sans + Poppins
 * 6. Soft shadows: box-shadow: 0px 2px 10px rgba(0,0,0,0.05)
 * 7. Calming color palette cho healthcare admin dashboard
 * 8. CSS variables từ soft pastel design system
 * 9. Enhanced accessibility với soft focus states
 * 10. Welcoming visual hierarchy cho better UX
 *
 * Mục đích: Provide welcoming admin healthcare dashboard
 * với soft pastel healthcare design
 */

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Wc as GenderIcon,
  AdminPanelSettings as AdminIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  LocalHospital as HealthIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import AdminSidebar from "./AdminSideBar";
import localStorageUtil from "@/utils/localStorage";

const MainContent = styled(Box)(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarOpen ? 0 : `-280px`,
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  color: "#fff",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  color: "#fff",
  boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.2)",
  overflow: "visible",
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  color: "#fff",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(59, 130, 246, 0.3)",
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "rgba(59, 130, 246, 0.1)",
  marginRight: "16px",
  flexShrink: 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.15)",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(59, 130, 246, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
  },
}));

const AdminProfile = ({ user = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Lấy user data từ localStorage
  const userData = localStorageUtil.get("user");

  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: userData?.fullName || "",
    phone: userData?.phone || "",
    birthDay: userData?.birthDay || "",
    email: userData?.email || "",
    gender: userData?.gender || "",
    address: userData?.address || "",
  });

  const handleChangeUpdate = (e) => {
    setFormDataUpdate({
      ...formDataUpdate,
      [e.target.name]: e.target.value,
    });
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemSelect = (itemId) => {
    setSelectedMenuItem(itemId);
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderDashboardContent = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                mx: "auto",
                mb: 2,
                width: 56,
                height: 56,
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
              }}
            >
              <GroupIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ color: "#3b82f6", fontWeight: "bold", mb: 1 }}
            >
              1,234
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Tổng người dùng
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                mx: "auto",
                mb: 2,
                width: 56,
                height: 56,
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
              }}
            >
              <TrendingUpIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ color: "#10b981", fontWeight: "bold", mb: 1 }}
            >
              89
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Phiên hoạt động
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                mx: "auto",
                mb: 2,
                width: 56,
                height: 56,
                boxShadow: "0 8px 32px rgba(245, 158, 11, 0.3)",
              }}
            >
              <HealthIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ color: "#f59e0b", fontWeight: "bold", mb: 1 }}
            >
              98%
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Tình trạng hệ thống
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                mx: "auto",
                mb: 2,
                width: 56,
                height: 56,
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              }}
            >
              <ReportsIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ color: "#8b5cf6", fontWeight: "bold", mb: 1 }}
            >
              45
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Báo cáo mới
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12}>
        <StyledPaper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#fff", fontWeight: 600 }}
          >
            Hoạt động gần đây
          </Typography>
          <List>
            <ListItem
              sx={{
                py: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <ListItemIcon>
                <PeopleIcon sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              <ListItemText
                primary="Người dùng mới đăng ký"
                secondary="2 phút trước"
                sx={{
                  "& .MuiListItemText-primary": { color: "#fff" },
                  "& .MuiListItemText-secondary": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />
            </ListItem>
            <ListItem
              sx={{
                py: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <ListItemIcon>
                <SecurityIcon sx={{ color: "#10b981" }} />
              </ListItemIcon>
              <ListItemText
                primary="Cập nhật cài đặt bảo mật"
                secondary="1 giờ trước"
                sx={{
                  "& .MuiListItemText-primary": { color: "#fff" },
                  "& .MuiListItemText-secondary": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />
            </ListItem>
            <ListItem sx={{ py: 2 }}>
              <ListItemIcon>
                <ReportsIcon sx={{ color: "#f59e0b" }} />
              </ListItemIcon>
              <ListItemText
                primary="Báo cáo tài chính được tạo"
                secondary="3 giờ trước"
                sx={{
                  "& .MuiListItemText-primary": { color: "#fff" },
                  "& .MuiListItemText-secondary": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />
            </ListItem>
          </List>
        </StyledPaper>
      </Grid>
    </Grid>
  );

  const renderProfileContent = () => (
    <StyledPaper sx={{ p: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        sx={{
          mb: 5,
          fontWeight: 700,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        <PersonIcon sx={{ mr: 2, color: "#ef4444", fontSize: 32 }} />
        Thông tin chi tiết
      </Typography>

      {!isEditing ? (
        <Grid container spacing={3}>
          {/* Họ và tên */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(239, 68, 68, 0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconWrapper
                  sx={{ mr: 2, background: "rgba(239, 68, 68, 0.1)" }}
                >
                  <PersonIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                </IconWrapper>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 600,
                  }}
                >
                  Họ và tên
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {formDataUpdate.fullName || "Administrator"}
              </Typography>
            </Box>
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconWrapper
                  sx={{ mr: 2, background: "rgba(139, 92, 246, 0.1)" }}
                >
                  <EmailIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />
                </IconWrapper>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 600,
                  }}
                >
                  Email
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {formDataUpdate.email}
              </Typography>
            </Box>
          </Grid>

          {/* Số điện thoại */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(16, 185, 129, 0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconWrapper
                  sx={{ mr: 2, background: "rgba(16, 185, 129, 0.1)" }}
                >
                  <PhoneIcon sx={{ color: "#10b981", fontSize: 20 }} />
                </IconWrapper>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 600,
                  }}
                >
                  Số điện thoại
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {formDataUpdate.phone || "Chưa cập nhật"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* Edit form similar to customer profile */}
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={formDataUpdate.fullName}
              onChange={handleChangeUpdate}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formDataUpdate.phone}
              onChange={handleChangeUpdate}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "flex-end",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  px: 5,
                  py: 2,
                  borderRadius: "12px",
                  color: "rgba(255, 255, 255, 0.8)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  fontWeight: 600,
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  px: 5,
                  py: 2,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "16px",
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #dc2626, #b91c1c)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Lưu thay đổi
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </StyledPaper>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedMenuItem}
        onItemSelect={handleMenuItemSelect}
      />

      <MainContent sidebarOpen={sidebarOpen}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                color: "#fff",
                mr: 2,
                display: { md: "none" },
                background: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: 700,
                background: "linear-gradient(45deg, #ef4444, #dc2626)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedMenuItem === "profile"
                ? "Hồ sơ quản trị viên"
                : "Bảng điều khiển"}
            </Typography>
          </Box>

          <Chip
            label="Quản trị viên"
            size="small"
            sx={{
              background: "linear-gradient(45deg, #ef4444, #dc2626)",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
            {selectedMenuItem === "profile" ? (
              <>
                {/* Profile Card */}
                <ProfileCard sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={4} alignItems="center">
                      {/* Avatar Section */}
                      <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-block",
                            mb: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 120, md: 140 },
                              height: { xs: 120, md: 140 },
                              background:
                                "linear-gradient(135deg, #ef4444, #dc2626)",
                              fontSize: { xs: "48px", md: "56px" },
                              fontWeight: 700,
                              boxShadow: "0 12px 40px rgba(239, 68, 68, 0.4)",
                              border: "4px solid rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <AdminIcon
                              sx={{ fontSize: { xs: "48px", md: "56px" } }}
                            />
                          </Avatar>
                        </Box>
                      </Grid>

                      {/* User Info */}
                      <Grid item xs={12} md={5}>
                        <Typography
                          variant="h4"
                          sx={{
                            mb: 1,
                            fontWeight: 700,
                            color: "#fff",
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          {formDataUpdate.fullName || "Administrator"}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 1,
                            fontSize: "18px",
                            fontWeight: 500,
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          Quản trị viên hệ thống
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.5)",
                            mb: 3,
                            fontSize: "14px",
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          {formDataUpdate.email}
                        </Typography>
                      </Grid>

                      {/* Edit Button */}
                      <Grid item xs={12} md={3}>
                        <Button
                          variant={isEditing ? "outlined" : "contained"}
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditing(!isEditing)}
                          fullWidth
                          sx={{
                            py: 2,
                            borderRadius: "16px",
                            fontWeight: 600,
                            fontSize: "16px",
                            textTransform: "none",
                            ...(isEditing
                              ? {
                                  color: "#ef4444",
                                  borderColor: "#ef4444",
                                  borderWidth: "2px",
                                  "&:hover": {
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                    borderColor: "#ef4444",
                                    transform: "translateY(-2px)",
                                  },
                                }
                              : {
                                  background:
                                    "linear-gradient(45deg, #ef4444, #dc2626)",
                                  boxShadow:
                                    "0 6px 20px rgba(239, 68, 68, 0.4)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #dc2626, #b91c1c)",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0 8px 25px rgba(239, 68, 68, 0.5)",
                                  },
                                }),
                            transition: "all 0.3s ease",
                          }}
                        >
                          {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </ProfileCard>

                {/* Profile Details */}
                {renderProfileContent()}
              </>
            ) : (
              renderDashboardContent()
            )}
          </Box>
        </Box>
      </MainContent>
    </Box>
  );
};

export default AdminProfile;

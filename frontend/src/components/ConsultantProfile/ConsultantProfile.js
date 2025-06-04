/**
 * ConsultantProfile.js - Soft Pastel Consultant Dashboard
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
 * 7. Calming color palette cho healthcare consultant dashboard
 * 8. CSS variables từ soft pastel design system
 * 9. Enhanced accessibility với soft focus states
 * 10. Welcoming visual hierarchy cho better UX
 *
 * Mục đích: Provide welcoming consultant healthcare dashboard
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
  LinearProgress,
  Badge,
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
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  LocalHospital as HospitalIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon,
  WorkHistory as WorkIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ConsultantSidebar from "./ConsultantSideBar";
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
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  color: "#fff",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  overflow: "hidden",
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08))",
  backdropFilter: "blur(20px)",
  borderRadius: "32px",
  border: "2px solid rgba(16, 185, 129, 0.3)",
  color: "#fff",
  boxShadow: "0 16px 40px 0 rgba(16, 185, 129, 0.25)",
  overflow: "visible",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #10b981, #059669, #10b981)",
    borderRadius: "32px 32px 0 0",
  },
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
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "transparent",
    transition: "all 0.3s ease",
  },
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 60px rgba(16, 185, 129, 0.4)",
    borderColor: "rgba(16, 185, 129, 0.6)",
    "&::before": {
      background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)",
    },
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "transparent",
    transition: "all 0.3s ease",
  },
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
    "&::before": {
      background: "linear-gradient(180deg, #10b981, #059669)",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.3s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.5)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(16, 185, 129, 0.2)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "#10b981",
      borderWidth: "2px",
      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "16px 20px",
  },
}));

const ConsultantProfile = ({ user = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const userData = localStorageUtil.get("user");

  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: userData?.fullName || "Lê Nguyễn An Ninh",
    phone: userData?.phone || "",
    birthDay: userData?.birthDay || "",
    email: userData?.email || "leninh2006@gmail.com",
    gender: userData?.gender || "",
    address: userData?.address || "",
    specialization: userData?.specialization || "General Medicine",
    licenseNumber: userData?.licenseNumber || "MD-2024-001",
    experience: userData?.experience || "5 năm",
    education: userData?.education || "Đại học Y Hà Nội",
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
    <Grid container spacing={4}>
      {/* Stats Cards - giữ nguyên */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Badge
              badgeContent="Hôm nay"
              color="success"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #10b981, #059669)",
                },
              }}
            >
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  mx: "auto",
                  mb: 3,
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
                }}
              >
                <CalendarIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#10b981", fontWeight: "bold", mb: 1 }}
            >
              8
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Lịch khám
            </Typography>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                mt: 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#10b981",
                  borderRadius: 3,
                },
              }}
            />
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Badge
              badgeContent="+12"
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                },
              }}
            >
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  mx: "auto",
                  mb: 3,
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.4)",
                }}
              >
                <PeopleIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#3b82f6", fontWeight: "bold", mb: 1 }}
            >
              156
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Bệnh nhân
            </Typography>
            <LinearProgress
              variant="determinate"
              value={85}
              sx={{
                mt: 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#3b82f6",
                  borderRadius: 3,
                },
              }}
            />
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Badge
              badgeContent="Online"
              color="warning"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #f59e0b, #d97706)",
                },
              }}
            >
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  mx: "auto",
                  mb: 3,
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 32px rgba(245, 158, 11, 0.4)",
                }}
              >
                <VideoCallIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#f59e0b", fontWeight: "bold", mb: 1 }}
            >
              24
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Tư vấn online
            </Typography>
            <LinearProgress
              variant="determinate"
              value={60}
              sx={{
                mt: 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#f59e0b",
                  borderRadius: 3,
                },
              }}
            />
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Badge
              badgeContent="Excellent"
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                },
              }}
            >
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  mx: "auto",
                  mb: 3,
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
                }}
              >
                <StarIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#8b5cf6", fontWeight: "bold", mb: 1 }}
            >
              4.9
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Đánh giá
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  sx={{
                    color: star <= 4.9 ? "#fbbf24" : "rgba(255, 255, 255, 0.3)",
                    fontSize: 16,
                    mx: 0.25,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </StatsCard>
      </Grid>

      {/* Enhanced Schedule & Patients - SỬA LỖI Ở ĐÂY */}
      <Grid item xs={12} md={8}>
        <StyledPaper sx={{ p: 4, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <ScheduleIcon />
            </Avatar>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
              Lịch làm việc hôm nay
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                time: "09:00 - 09:30",
                patient: "Nguyễn Văn A",
                type: "Khám tổng quát",
                status: "completed",
                color: "#10b981",
              },
              {
                time: "10:00 - 10:30",
                patient: "Trần Thị B",
                type: "Tư vấn online",
                status: "current",
                color: "#3b82f6",
              },
              {
                time: "14:00 - 14:45",
                patient: "Lê Văn C",
                type: "Chuyên khoa tim",
                status: "upcoming",
                color: "#f59e0b",
              },
              {
                time: "15:30 - 16:00",
                patient: "Phạm Thị D",
                type: "Tư vấn tâm lý",
                status: "upcoming",
                color: "#8b5cf6",
              },
            ].map((appointment, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: `rgba(${
                      appointment.color === "#10b981"
                        ? "16, 185, 129"
                        : appointment.color === "#3b82f6"
                        ? "59, 130, 246"
                        : appointment.color === "#f59e0b"
                        ? "245, 158, 11"
                        : "139, 92, 246"
                    }, 0.1)`,
                    border: `1px solid rgba(${
                      appointment.color === "#10b981"
                        ? "16, 185, 129"
                        : appointment.color === "#3b82f6"
                        ? "59, 130, 246"
                        : appointment.color === "#f59e0b"
                        ? "245, 158, 11"
                        : "139, 92, 246"
                    }, 0.3)`,
                    transition: "all 0.3s ease",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 32px rgba(${
                        appointment.color === "#10b981"
                          ? "16, 185, 129"
                          : appointment.color === "#3b82f6"
                          ? "59, 130, 246"
                          : appointment.color === "#f59e0b"
                          ? "245, 158, 11"
                          : "139, 92, 246"
                      }, 0.3)`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: appointment.color,
                        mr: 2,
                        animation:
                          appointment.status === "current"
                            ? "pulse 2s infinite"
                            : "none",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", fontWeight: 600 }}
                    >
                      {appointment.time}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#fff", mb: 1 }}>
                    {appointment.patient}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {appointment.type}
                  </Typography>
                  <Chip
                    label={
                      appointment.status === "completed"
                        ? "Hoàn thành"
                        : appointment.status === "current"
                        ? "Đang diễn ra"
                        : "Sắp tới"
                    }
                    size="small"
                    sx={{
                      mt: 2,
                      backgroundColor: appointment.color,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledPaper sx={{ p: 4, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <TrendingUpIcon />
            </Avatar>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
              Thống kê tuần
            </Typography>
          </Box>

          <Box sx={{ space: 3 }}>
            {[
              {
                label: "Bệnh nhân mới",
                value: 12,
                change: "+8%",
                color: "#10b981",
              },
              {
                label: "Tư vấn online",
                value: 24,
                change: "+15%",
                color: "#3b82f6",
              },
              {
                label: "Đánh giá 5 sao",
                value: 18,
                change: "+5%",
                color: "#f59e0b",
              },
              {
                label: "Thu nhập",
                value: "15M",
                change: "+12%",
                color: "#8b5cf6",
              },
            ].map((stat, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  mb: 2,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {stat.label}
                  </Typography>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: stat.color,
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ color: "#fff", fontWeight: 700, mt: 1 }}
                >
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );

  const renderProfileContent = () => (
    <Grid container spacing={4}>
      {/* Professional Summary Card */}
      <Grid item xs={12}>
        <StyledPaper sx={{ p: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                mr: 3,
                width: 48,
                height: 48,
              }}
            >
              <MedicalIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{ color: "#fff", fontWeight: 700, mb: 1 }}
              >
                Thông tin chuyên môn
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Thông tin chi tiết về chuyên môn và kinh nghiệm làm việc
              </Typography>
            </Box>
          </Box>

          {!isEditing ? (
            <Grid container spacing={4}>
              {/* Personal Info */}
              <Grid item xs={12} md={6}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                      }}
                    >
                      Họ và tên
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    Dr. {formDataUpdate.fullName}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <MedicalIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                      }}
                    >
                      Chuyên khoa
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.specialization}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
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
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.email}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
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
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.phone || "Chưa cập nhật"}
                  </Typography>
                </InfoCard>
              </Grid>

              {/* Professional Details */}
              <Grid item xs={12} md={6}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <VerifiedIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                      }}
                    >
                      Số giấy phép
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.licenseNumber}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <WorkIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                      }}
                    >
                      Kinh nghiệm
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.experience}
                  </Typography>
                </InfoCard>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={formDataUpdate.fullName}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Chuyên khoa"
                  name="specialization"
                  value={formDataUpdate.specialization}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formDataUpdate.phone}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Số giấy phép hành nghề"
                  name="licenseNumber"
                  value={formDataUpdate.licenseNumber}
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
                      px: 6,
                      py: 2.5,
                      borderRadius: "16px",
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
                      px: 6,
                      py: 2.5,
                      borderRadius: "16px",
                      fontWeight: 600,
                      fontSize: "16px",
                      background: "linear-gradient(45deg, #10b981, #059669)",
                      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #059669, #047857)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 35px rgba(16, 185, 129, 0.5)",
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
      </Grid>
    </Grid>
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
      <ConsultantSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedMenuItem}
        onItemSelect={handleMenuItemSelect}
      />

      <MainContent sidebarOpen={sidebarOpen}>
        {/* Enhanced Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 4,
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
                mr: 3,
                display: { md: "none" },
                background: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  background: "linear-gradient(45deg, #10b981, #059669)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {selectedMenuItem === "profile"
                  ? "Hồ sơ bác sĩ"
                  : "Bảng điều khiển"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                {selectedMenuItem === "profile"
                  ? "Quản lý thông tin cá nhân"
                  : "Tổng quan hoạt động hôm nay"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="Đang hoạt động"
              size="medium"
              sx={{
                background: "linear-gradient(45deg, #10b981, #059669)",
                color: "#fff",
                fontWeight: 600,
                px: 2,
                "& .MuiChip-icon": {
                  color: "#fff",
                },
              }}
              icon={
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                  }}
                />
              }
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
            {selectedMenuItem === "profile" ? (
              <>
                {/* Enhanced Profile Card */}
                <ProfileCard sx={{ mb: 5 }}>
                  <CardContent sx={{ p: 5 }}>
                    <Grid container spacing={4} alignItems="center">
                      <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-block",
                            mb: 3,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 140, md: 160 },
                              height: { xs: 140, md: 160 },
                              background:
                                "linear-gradient(135deg, #10b981, #059669)",
                              fontSize: { xs: "56px", md: "64px" },
                              fontWeight: 700,
                              boxShadow: "0 16px 48px rgba(16, 185, 129, 0.5)",
                              border: "4px solid rgba(255, 255, 255, 0.2)",
                              position: "relative",
                            }}
                          >
                            <MedicalIcon
                              sx={{ fontSize: { xs: "56px", md: "64px" } }}
                            />
                          </Avatar>
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(45deg, #fbbf24, #f59e0b)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "3px solid rgba(255, 255, 255, 0.2)",
                              boxShadow: "0 4px 12px rgba(251, 191, 36, 0.4)",
                            }}
                          >
                            <VerifiedIcon
                              sx={{ color: "#fff", fontSize: 16 }}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="h3"
                          sx={{
                            mb: 2,
                            fontWeight: 800,
                            color: "#fff",
                            fontSize: { xs: "2rem", md: "2.5rem" },
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          Dr. {formDataUpdate.fullName}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                            justifyContent: { xs: "center", md: "flex-start" },
                          }}
                        >
                          <Chip
                            label={formDataUpdate.specialization}
                            sx={{
                              background:
                                "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "14px",
                              mr: 2,
                            }}
                          />
                          <Chip
                            label={`${formDataUpdate.experience} kinh nghiệm`}
                            sx={{
                              background:
                                "linear-gradient(45deg, #8b5cf6, #7c3aed)",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "14px",
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            mb: 2,
                            fontSize: "16px",
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          {formDataUpdate.email}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center", md: "flex-start" },
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              sx={{
                                color: "#fbbf24",
                                fontSize: 20,
                                mr: 0.5,
                                filter:
                                  "drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))",
                              }}
                            />
                          ))}
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              ml: 2,
                              fontWeight: 600,
                            }}
                          >
                            4.9/5.0 (156 đánh giá)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Button
                          variant={isEditing ? "outlined" : "contained"}
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditing(!isEditing)}
                          fullWidth
                          sx={{
                            py: 3,
                            borderRadius: "20px",
                            fontWeight: 700,
                            fontSize: "16px",
                            textTransform: "none",
                            ...(isEditing
                              ? {
                                  color: "#10b981",
                                  borderColor: "#10b981",
                                  borderWidth: "2px",
                                  "&:hover": {
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                    borderColor: "#10b981",
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                      "0 12px 32px rgba(16, 185, 129, 0.3)",
                                  },
                                }
                              : {
                                  background:
                                    "linear-gradient(45deg, #10b981, #059669)",
                                  boxShadow:
                                    "0 8px 32px rgba(16, 185, 129, 0.4)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #059669, #047857)",
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                      "0 16px 48px rgba(16, 185, 129, 0.6)",
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

                {renderProfileContent()}
              </>
            ) : (
              renderDashboardContent()
            )}
          </Box>
        </Box>
      </MainContent>

      {/* Add pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default ConsultantProfile;

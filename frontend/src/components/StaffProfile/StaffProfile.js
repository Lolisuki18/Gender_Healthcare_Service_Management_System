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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Assignment as TaskIcon,
  Schedule as ScheduleIcon,
  Group as TeamIcon,
  AssignmentTurnedIn as CompletedIcon,
  AssignmentLate as PendingIcon,
  BusinessCenter as DepartmentIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import StaffSidebar from "./StaffSideBar";
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
    "linear-gradient(145deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.08))",
  backdropFilter: "blur(20px)",
  borderRadius: "32px",
  border: "2px solid rgba(249, 115, 22, 0.3)",
  color: "#fff",
  boxShadow: "0 16px 40px 0 rgba(249, 115, 22, 0.25)",
  overflow: "visible",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #f97316, #ea580c, #f97316)",
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
    boxShadow: "0 20px 60px rgba(249, 115, 22, 0.4)",
    borderColor: "rgba(249, 115, 22, 0.6)",
    "&::before": {
      background: "linear-gradient(90deg, #f97316, #3b82f6, #8b5cf6)",
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
      background: "linear-gradient(180deg, #f97316, #ea580c)",
    },
  },
}));

const TaskCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
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
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    "&::before": {
      background: "linear-gradient(180deg, #f97316, #ea580c)",
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
      borderColor: "rgba(249, 115, 22, 0.5)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(249, 115, 22, 0.2)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "#f97316",
      borderWidth: "2px",
      boxShadow: "0 8px 25px rgba(249, 115, 22, 0.3)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "16px 20px",
  },
}));

const StaffProfile = ({ user = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const userData = localStorageUtil.get("user");

  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: userData?.fullName || "Nguyễn Văn A",
    phone: userData?.phone || "",
    birthDay: userData?.birthDay || "",
    email: userData?.email || "staff@healthcare.com",
    gender: userData?.gender || "",
    address: userData?.address || "",
    employeeId: userData?.employeeId || "STAFF-001",
    department: userData?.department || "Patient Services",
    position: userData?.position || "Staff",
    startDate: userData?.startDate || "2024-01-01",
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
      {/* Stats Cards */}
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
                  background: "linear-gradient(45deg, #f97316, #ea580c)",
                },
              }}
            >
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  mx: "auto",
                  mb: 3,
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 32px rgba(249, 115, 22, 0.4)",
                }}
              >
                <TaskIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#f97316", fontWeight: "bold", mb: 1 }}
            >
              12
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Nhiệm vụ
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
                  backgroundColor: "#f97316",
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
              badgeContent="✓"
              color="success"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #22c55e, #16a34a)",
                },
              }}
            >
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  mx: "auto",
                  mb: 3,
                  width: 64,
                  height: 64,
                  boxShadow: "0 8px 32px rgba(34, 197, 94, 0.4)",
                }}
              >
                <CompletedIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#22c55e", fontWeight: "bold", mb: 1 }}
            >
              8
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Hoàn thành
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
                  backgroundColor: "#22c55e",
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
              badgeContent="!"
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
                <PendingIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#f59e0b", fontWeight: "bold", mb: 1 }}
            >
              4
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Đang chờ
            </Typography>
            <LinearProgress
              variant="determinate"
              value={30}
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
              badgeContent="Week"
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
                <ScheduleIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Typography
              variant="h3"
              sx={{ color: "#3b82f6", fontWeight: "bold", mb: 1 }}
            >
              45
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
            >
              Giờ làm
            </Typography>
            <LinearProgress
              variant="determinate"
              value={90}
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

      {/* Today's Tasks - SỬA LỖI TẠI ĐÂY */}
      <Grid item xs={12} md={8}>
        <StyledPaper sx={{ p: 4, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              <TaskIcon />
            </Avatar>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
              Nhiệm vụ hôm nay
            </Typography>
            <Badge badgeContent={4} color="error" sx={{ ml: 2 }}>
              <NotificationsIcon sx={{ color: "rgba(255, 255, 255, 0.6)" }} />
            </Badge>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: "Đăng ký bệnh nhân - Phòng 102",
                desc: "Hỗ trợ quy trình tiếp nhận bệnh nhân mới",
                status: "in-progress",
                priority: "high",
                location: "Tầng 2 - Lễ tân",
                color: "#f97316",
              },
              {
                title: "Cập nhật hồ sơ y tế",
                desc: "Cập nhật thông tin bệnh nhân trong hệ thống",
                status: "pending",
                priority: "medium",
                location: "Phòng hành chính",
                color: "#f59e0b",
              },
              {
                title: "Kiểm tra kho thuốc",
                desc: "Kiểm tra tồn kho thuốc hàng tháng",
                status: "completed",
                priority: "low",
                location: "Kho vật tư",
                color: "#22c55e",
              },
              {
                title: "Sắp xếp lịch hẹn",
                desc: "Sắp xếp lịch tái khám cho bệnh nhân",
                status: "pending",
                priority: "high",
                location: "Phòng lập lịch",
                color: "#3b82f6",
              },
            ].map((task, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TaskCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: task.color,
                        mr: 2,
                        animation:
                          task.status === "in-progress"
                            ? "pulse 2s infinite"
                            : "none",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", fontWeight: 600, flex: 1 }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      label={
                        task.priority === "high"
                          ? "Cao"
                          : task.priority === "medium"
                          ? "Trung bình"
                          : "Thấp"
                      }
                      size="small"
                      sx={{
                        backgroundColor:
                          task.priority === "high"
                            ? "#ef4444"
                            : task.priority === "medium"
                            ? "#f59e0b"
                            : "#22c55e",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
                  >
                    {task.desc}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationIcon
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: 16,
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "12px",
                        }}
                      >
                        {task.location}
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        task.status === "completed"
                          ? "Hoàn thành"
                          : task.status === "in-progress"
                          ? "Đang thực hiện"
                          : "Chờ xử lý"
                      }
                      size="small"
                      sx={{
                        backgroundColor: task.color,
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: "11px",
                      }}
                    />
                  </Box>
                </TaskCard>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>

      {/* Schedule & Team */}
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
              <ScheduleIcon />
            </Avatar>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
              Lịch làm việc
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "#fff", mb: 2, fontWeight: 600 }}
            >
              Hôm nay
            </Typography>
            <List sx={{ p: 0 }}>
              <ListItem
                sx={{
                  p: 2,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  mb: 1,
                }}
              >
                <ListItemIcon>
                  <TimeIcon sx={{ color: "#22c55e" }} />
                </ListItemIcon>
                <ListItemText
                  primary="8:00 - 12:00"
                  secondary="Ca sáng - Lễ tân"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#fff",
                      fontWeight: 600,
                    },
                    "& .MuiListItemText-secondary": {
                      color: "rgba(255, 255, 255, 0.6)",
                    },
                  }}
                />
              </ListItem>
              <ListItem
                sx={{
                  p: 2,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                }}
              >
                <ListItemIcon>
                  <TimeIcon sx={{ color: "#f97316" }} />
                </ListItemIcon>
                <ListItemText
                  primary="13:00 - 17:00"
                  secondary="Ca chiều - Chăm sóc bệnh nhân"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#fff",
                      fontWeight: 600,
                    },
                    "& .MuiListItemText-secondary": {
                      color: "rgba(255, 255, 255, 0.6)",
                    },
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{ color: "#fff", mb: 2, fontWeight: 600 }}
            >
              Phòng ban
            </Typography>
            <Box
              sx={{
                p: 2,
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <DepartmentIcon sx={{ color: "#f97316", mr: 1 }} />
                <Typography
                  variant="body1"
                  sx={{ color: "#fff", fontWeight: 600 }}
                >
                  {formDataUpdate.department}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                Trưởng phòng: Dr. Johnson
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                Thành viên: 8 nhân viên
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );

  const renderProfileContent = () => (
    <Grid container spacing={4}>
      {/* Staff Info Card */}
      <Grid item xs={12}>
        <StyledPaper sx={{ p: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                mr: 3,
                width: 48,
                height: 48,
              }}
            >
              <PersonIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{ color: "#fff", fontWeight: 700, mb: 1 }}
              >
                Thông tin nhân viên
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Thông tin chi tiết về nhân viên và phòng ban
              </Typography>
            </Box>
          </Box>

          {!isEditing ? (
            <Grid container spacing={4}>
              {/* Personal Info */}
              <Grid item size={12}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #f97316, #ea580c)",
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
                    {formDataUpdate.fullName}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item size={12}>
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
                      <BadgeIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                      }}
                    >
                      Mã nhân viên
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.employeeId}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item size={12}>
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

              <Grid item size={12}>
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

              {/* Work Info */}
              <Grid item size={12}>
                <InfoCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <DepartmentIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                      }}
                    >
                      Phòng ban
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.department}
                  </Typography>
                </InfoCard>
              </Grid>

              <Grid item size={12}>
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
                      Chức vụ
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#fff", fontWeight: 600 }}
                  >
                    {formDataUpdate.position}
                  </Typography>
                </InfoCard>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Grid item size={12}>
                <StyledTextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={formDataUpdate.fullName}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item size={12}>
                <StyledTextField
                  fullWidth
                  label="Mã nhân viên"
                  name="employeeId"
                  value={formDataUpdate.employeeId}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item size={12}>
                <StyledTextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formDataUpdate.phone}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item size={12}>
                <StyledTextField
                  fullWidth
                  label="Phòng ban"
                  name="department"
                  value={formDataUpdate.department}
                  onChange={handleChangeUpdate}
                />
              </Grid>
              <Grid item size={12}>
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
                      background: "linear-gradient(45deg, #f97316, #ea580c)",
                      boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #ea580c, #c2410c)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 35px rgba(249, 115, 22, 0.5)",
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
      <StaffSidebar
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
                  background: "linear-gradient(45deg, #f97316, #ea580c)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {selectedMenuItem === "profile"
                  ? "Hồ sơ nhân viên"
                  : "Bảng điều khiển"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                {selectedMenuItem === "profile"
                  ? "Quản lý thông tin cá nhân"
                  : "Tổng quan công việc hôm nay"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="Đang làm việc"
              size="medium"
              sx={{
                background: "linear-gradient(45deg, #f97316, #ea580c)",
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
                                "linear-gradient(135deg, #f97316, #ea580c)",
                              fontSize: { xs: "56px", md: "64px" },
                              fontWeight: 700,
                              boxShadow: "0 16px 48px rgba(249, 115, 22, 0.5)",
                              border: "4px solid rgba(255, 255, 255, 0.2)",
                              position: "relative",
                            }}
                          >
                            <PersonIcon
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
                                "linear-gradient(45deg, #22c55e, #16a34a)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "3px solid rgba(255, 255, 255, 0.2)",
                              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
                            }}
                          >
                            <CheckCircleIcon
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
                          {formDataUpdate.fullName}
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
                            label={formDataUpdate.position}
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
                            label={formDataUpdate.department}
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
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              fontWeight: 600,
                            }}
                          >
                            Mã NV: {formDataUpdate.employeeId}
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
                                  color: "#f97316",
                                  borderColor: "#f97316",
                                  borderWidth: "2px",
                                  "&:hover": {
                                    backgroundColor: "rgba(249, 115, 22, 0.1)",
                                    borderColor: "#f97316",
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                      "0 12px 32px rgba(249, 115, 22, 0.3)",
                                  },
                                }
                              : {
                                  background:
                                    "linear-gradient(45deg, #f97316, #ea580c)",
                                  boxShadow:
                                    "0 8px 32px rgba(249, 115, 22, 0.4)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #ea580c, #c2410c)",
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                      "0 16px 48px rgba(249, 115, 22, 0.6)",
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

export default StaffProfile;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  LinearProgress,
  Badge,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Camera as CameraIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { consultantService } from "../../services/consultantService";
import localStorageUtil from "../../utils/localStorage";
import { userService } from "../../services/userService";
import notify from "../../utils/notification";
import { confirmDialog } from "../../utils/confirmDialog";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(16, 185, 129, 0.15)",
  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(16, 185, 129, 0.15)",
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  background: "linear-gradient(45deg, #10b981, #059669)",
  fontSize: "48px",
  fontWeight: 700,
  margin: "0 auto",
  border: "4px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
}));

const ConsultantProfileContent = ({ consultantId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tách riêng edit mode cho từng phần
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);
  const [editProfessionalInfo, setEditProfessionalInfo] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingProfessional, setSavingProfessional] = useState(false);

  // Simplified data structure based on API response
  const [profileData, setProfileData] = useState({
    profileId: null,
    userId: null,
    fullName: "",
    username: "", // chỉ hiện khi admin xem
    email: "",
    address: "",
    gender: "",
    isActive: true,
    phone: "",
    avatar: null, // URL avatar nếu có
    qualifications: "",
    experience: "",
    bio: "",
    updatedAt: "",
  });
  const [tempData, setTempData] = useState({ ...profileData });

  // Helper function để hiển thị giới tính
  const getGenderDisplay = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      case "OTHER":
        return "Khác";
      default:
        return "Chưa cập nhật";
    }
  };

  // Handle input changes - THÊM FUNCTION NÀY
  const handleInputChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch consultant profile data
  useEffect(() => {
    const fetchConsultantProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = localStorageUtil.get("user");
        const response = await consultantService.getConsultantDetails(
          userData.userId
        );
        console.log("Consultant Profile Response:", response);

        const responseData = response?.data || response;
        console.log("Response Data:", responseData);

        const mappedData = {
          profileId: responseData.profileId || null,
          userId: responseData.userId || null,
          fullName: responseData.fullName || "",
          username: responseData.username || "",
          email: responseData.email || "",
          address: responseData.address || "",
          gender: responseData.gender || "",
          isActive:
            responseData.active !== undefined ? responseData.active : true,
          phone: responseData.phone || "",
          avatar: responseData.avatar || null,
          qualifications: responseData.qualifications || "",
          experience: responseData.experience || "",
          bio: responseData.bio || "",
          updatedAt: responseData.updatedAt || new Date().toISOString(),
        };

        console.log("Mapped Data:", mappedData);
        setProfileData(mappedData);
        setTempData(mappedData);
      } catch (err) {
        console.error("Error fetching consultant profile:", err);
        setError("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultantProfile();
  }, [consultantId]);

  // Handlers for Personal Info
  const handleEditPersonal = () => {
    setEditPersonalInfo(true);
    setTempData({ ...profileData });
  };
  const handleSavePersonal = async () => {
    try {
      setSavingPersonal(true);

      const personalData = {
        fullName: tempData.fullName,
        email: tempData.email,
        phone: tempData.phone,
        address: tempData.address,
        gender: tempData.gender,
      };

      await userService.updateProfile(personalData);

      setProfileData((prev) => ({
        ...prev,
        ...personalData,
        updatedAt: new Date().toISOString(),
      }));

      setEditPersonalInfo(false);

      // Hiển thị thông báo thành công
      notify.success(
        "Cập nhật thành công!",
        "Thông tin cá nhân đã được cập nhật thành công."
      );
    } catch (err) {
      console.error("Error saving personal info:", err);

      // Hiển thị thông báo lỗi
      notify.error(
        "Cập nhật thất bại!",
        "Có lỗi xảy ra khi cập nhật thông tin cá nhân. Vui lòng thử lại."
      );
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleCancelPersonal = async () => {
    // Hiển thị dialog xác nhận nếu có thay đổi
    const hasChanges = JSON.stringify(tempData) !== JSON.stringify(profileData);

    if (hasChanges) {
      const confirmed = await confirmDialog.warning(
        "Bạn có chắc chắn muốn hủy các thay đổi chưa lưu?",
        {
          title: "Xác nhận hủy",
          confirmText: "Hủy thay đổi",
          cancelText: "Tiếp tục chỉnh sửa",
        }
      );

      if (!confirmed) return;
    }

    setTempData({ ...profileData });
    setEditPersonalInfo(false);

    // Hiển thị thông báo hủy
    notify.info("Đã hủy", "Các thay đổi đã được hủy.");
  };

  // Handlers for Professional Info
  const handleEditProfessional = () => {
    setEditProfessionalInfo(true);
    setTempData({ ...profileData });
  };
  const handleSaveProfessional = async () => {
    try {
      setSavingProfessional(true);

      const professionalData = {
        bio: tempData.bio,
        qualifications: tempData.qualifications,
        experience: tempData.experience,
      };

      const userData = localStorageUtil.get("user");
      await consultantService.updateProfessionalInfo(
        userData.userId,
        professionalData
      );

      setProfileData((prev) => ({
        ...prev,
        ...professionalData,
        updatedAt: new Date().toISOString(),
      }));

      setEditProfessionalInfo(false);

      // Hiển thị thông báo thành công
      notify.success(
        "Cập nhật thành công!",
        "Thông tin nghề nghiệp đã được cập nhật thành công."
      );
    } catch (err) {
      console.error("Error saving professional info:", err);

      // Hiển thị thông báo lỗi
      notify.error(
        "Cập nhật thất bại!",
        "Có lỗi xảy ra khi cập nhật thông tin nghề nghiệp. Vui lòng thử lại."
      );
    } finally {
      setSavingProfessional(false);
    }
  };

  const handleCancelProfessional = async () => {
    // Hiển thị dialog xác nhận nếu có thay đổi
    const hasChanges = JSON.stringify(tempData) !== JSON.stringify(profileData);

    if (hasChanges) {
      const confirmed = await confirmDialog.warning(
        "Bạn có chắc chắn muốn hủy các thay đổi chưa lưu?",
        {
          title: "Xác nhận hủy",
          confirmText: "Hủy thay đổi",
          cancelText: "Tiếp tục chỉnh sửa",
        }
      );

      if (!confirmed) return;
    }

    setTempData({ ...profileData });
    setEditProfessionalInfo(false);

    // Hiển thị thông báo hủy
    notify.info("Đã hủy", "Các thay đổi đã được hủy.");
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#10b981" }} />
        <Typography variant="h6" component="div" sx={{ color: "#64748b" }}>
          Đang tải thông tin hồ sơ...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const renderPersonalInfo = () => (
    <StyledPaper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, color: "#1e293b" }}
        >
          Thông tin cá nhân
        </Typography>
        {!editPersonalInfo ? (
          <Button
            startIcon={<EditIcon />}
            onClick={handleEditPersonal}
            sx={{ color: "#10b981" }}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSavePersonal}
              disabled={savingPersonal}
              sx={{
                background: "linear-gradient(45deg, #10b981, #059669)",
                "&:hover": {
                  background: "linear-gradient(45deg, #059669, #047857)",
                },
                "&:disabled": {
                  background: "#94a3b8",
                },
              }}
            >
              {savingPersonal ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              startIcon={<CancelIcon />}
              onClick={handleCancelPersonal}
              disabled={savingPersonal}
              sx={{ color: "#ef4444" }}
            >
              Hủy
            </Button>
          </Box>
        )}
      </Box>

      {/* Profile Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <ProfileAvatar src={tempData.avatar}>
            {!tempData.avatar &&
              tempData.fullName &&
              tempData.fullName.charAt(0)}
          </ProfileAvatar>
          {editPersonalInfo && (
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(45deg, #1d4ed8, #1e40af)",
                },
              }}
            >
              <CameraIcon />
            </IconButton>
          )}
        </Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 600, mt: 2, color: "#1e293b" }}
        >
          {tempData.fullName || "Chưa cập nhật"}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ color: "#64748b", mb: 2 }}
        >
          Bác sĩ tư vấn
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Chip
            label={tempData.isActive ? "Đang hoạt động" : "Không hoạt động"}
            color={tempData.isActive ? "success" : "error"}
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item size={12} md={6}>
          <TextField
            fullWidth
            label="Họ và tên"
            value={tempData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            disabled={!editPersonalInfo}
            margin="normal"
          />
        </Grid>
        <Grid item size={6} md={6}>
          <TextField
            fullWidth
            label="Email"
            value={tempData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!editPersonalInfo}
            margin="normal"
            InputProps={{
              endAdornment: <EmailIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>

        <Grid item size={6} md={6}>
          <TextField
            fullWidth
            label="Số điện thoại"
            value={tempData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!editPersonalInfo}
            margin="normal"
            InputProps={{
              endAdornment: <PhoneIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>

        <Grid item size={4} md={6}>
          {editPersonalInfo ? (
            <FormControl fullWidth margin="normal">
              <InputLabel>Giới tính</InputLabel>
              <Select
                value={tempData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                label="Giới tính"
              >
                <MenuItem value="MALE">Nam</MenuItem>
                <MenuItem value="FEMALE">Nữ</MenuItem>
                <MenuItem value="OTHER">Khác</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              label="Giới tính"
              value={getGenderDisplay(tempData.gender)}
              disabled={true}
              margin="normal"
            />
          )}
        </Grid>

        <Grid item size={4} md={6}>
          <TextField
            fullWidth
            label="Địa chỉ"
            value={tempData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!editPersonalInfo}
            margin="normal"
            InputProps={{
              endAdornment: <LocationIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>

        {/* Hiển thị username chỉ khi admin xem */}
        {tempData.username && (
          <Grid item size={4} md={6}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              value={tempData.username}
              disabled={true} // Admin không được sửa username
              margin="normal"
              InputProps={{
                endAdornment: <PersonIcon sx={{ color: "#64748b" }} />,
              }}
            />
          </Grid>
        )}
      </Grid>
    </StyledPaper>
  );

  const renderProfessionalInfo = () => (
    <StyledPaper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, color: "#1e293b" }}
        >
          Thông tin nghề nghiệp
        </Typography>
        {!editProfessionalInfo ? (
          <Button
            startIcon={<EditIcon />}
            onClick={handleEditProfessional}
            sx={{ color: "#10b981" }}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSaveProfessional}
              disabled={savingProfessional}
              sx={{
                background: "linear-gradient(45deg, #10b981, #059669)",
                "&:hover": {
                  background: "linear-gradient(45deg, #059669, #047857)",
                },
                "&:disabled": {
                  background: "#94a3b8",
                },
              }}
            >
              {savingProfessional ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              startIcon={<CancelIcon />}
              onClick={handleCancelProfessional}
              disabled={savingProfessional}
              sx={{ color: "#ef4444" }}
            >
              Hủy
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item size={12} md={6}>
          <TextField
            fullWidth
            label="Giới thiệu bản thân"
            multiline
            rows={4}
            value={tempData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!editProfessionalInfo}
            margin="normal"
            helperText="Giới thiệu ngắn gọn về bản thân, chuyên môn và kinh nghiệm"
          />
        </Grid>
        <Grid item size={12} md={6}>
          <TextField
            fullWidth
            label="Trình độ chuyên môn"
            multiline
            rows={3}
            value={tempData.qualifications}
            onChange={(e) =>
              handleInputChange("qualifications", e.target.value)
            }
            disabled={!editProfessionalInfo}
            margin="normal"
            InputProps={{
              endAdornment: <SchoolIcon sx={{ color: "#64748b" }} />,
            }}
            helperText="Ví dụ: Thạc sĩ Tâm lý học - Đại học Y Hà Nội (2018), Bác sĩ Đa khoa - Đại học Y Dược TP.HCM (2015)"
          />
        </Grid>
        <Grid item size={12} md={6}>
          <TextField
            fullWidth
            label="Kinh nghiệm làm việc"
            multiline
            rows={3}
            value={tempData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            disabled={!editProfessionalInfo}
            margin="normal"
            InputProps={{
              endAdornment: <WorkIcon sx={{ color: "#64748b" }} />,
            }}
            helperText="Mô tả kinh nghiệm làm việc, số năm, lĩnh vực chuyên môn"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Profile Stats */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
        >
          Thông tin hồ sơ
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={6} md={6}>
            <Card sx={{ p: 2, background: "rgba(16, 185, 129, 0.05)" }}>
              <Typography
                variant="body2"
                component="div"
                sx={{ color: "#64748b" }}
              >
                ID Hồ sơ
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                #{tempData.profileId || "N/A"}
              </Typography>
            </Card>
          </Grid>
          <Grid item size={6} md={6}>
            <Card sx={{ p: 2, background: "rgba(59, 130, 246, 0.05)" }}>
              <Typography
                variant="body2"
                component="div"
                sx={{ color: "#64748b" }}
              >
                Cập nhật lần cuối
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {tempData.updatedAt
                  ? new Date(tempData.updatedAt).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </StyledPaper>
  );

  const tabLabels = ["Thông tin cá nhân", "Thông tin nghề nghiệp"];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #2563eb, #3b82f6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body1" component="div" sx={{ color: "#64748b" }}>
          Quản lý thông tin cá nhân và nghề nghiệp
        </Typography>
      </Box>
      {/* Tabs */}
      <StyledPaper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#10b981 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#10b981",
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </StyledPaper>{" "}
      {/* Content */}
      <Box>
        {selectedTab === 0 && renderPersonalInfo()}
        {selectedTab === 1 && renderProfessionalInfo()}
      </Box>
    </Box>
  );
};

export default ConsultantProfileContent;

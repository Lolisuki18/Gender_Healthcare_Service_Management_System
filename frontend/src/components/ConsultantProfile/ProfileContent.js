import React, { useState } from "react";
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
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Camera as CameraIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

const ConsultantProfileContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openCertDialog, setOpenCertDialog] = useState(false);

  const [profileData, setProfileData] = useState({
    personalInfo: {
      fullName: "Dr. Nguyễn Văn Đức",
      email: "dr.nguyenvanduc@healthcare.com",
      phone: "+84 901234567",
      dateOfBirth: "1985-03-15",
      gender: "Nam",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      bio: "Bác sĩ chuyên khoa tâm lý và tư vấn chuyển đổi giới tính với hơn 8 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe LGBT+.",
    },
    professionalInfo: {
      specialization: "Tâm lý học & Tư vấn chuyển đổi giới tính",
      licenseNumber: "BS-12345678",
      yearsOfExperience: 8,
      workplace: "Trung tâm Y tế Gender Health",
      consultationFee: 500000,
      languages: ["Tiếng Việt", "English", "日本語"],
      rating: 4.8,
      totalReviews: 156,
      successRate: 95,
    },
    education: [
      {
        degree: "Thạc sĩ Tâm lý học",
        institution: "Đại học Y Hà Nội",
        year: "2018",
        type: "master",
      },
      {
        degree: "Bác sĩ Đa khoa",
        institution: "Đại học Y Dược TP.HCM",
        year: "2015",
        type: "bachelor",
      },
    ],
    certifications: [
      {
        name: "Chứng chỉ Tư vấn Chuyển đổi Giới tính",
        issuer: "World Professional Association for Transgender Health",
        date: "2020",
        verified: true,
      },
      {
        name: "Chứng chỉ Tâm lý trị liệu",
        issuer: "Hiệp hội Tâm lý Việt Nam",
        date: "2019",
        verified: true,
      },
    ],
    workingHours: {
      monday: { start: "08:00", end: "17:00", available: true },
      tuesday: { start: "08:00", end: "17:00", available: true },
      wednesday: { start: "08:00", end: "17:00", available: true },
      thursday: { start: "08:00", end: "17:00", available: true },
      friday: { start: "08:00", end: "17:00", available: true },
      saturday: { start: "09:00", end: "15:00", available: true },
      sunday: { start: "", end: "", available: false },
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      marketingEmails: false,
      twoFactorAuth: true,
      profileVisibility: "public",
    },
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setEditMode(true);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setEditMode(false);
    // TODO: Save to backend
    alert("Đã lưu thông tin hồ sơ!");
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setEditMode(false);
  };

  const handleInputChange = (section, field, value) => {
    setTempData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getDayName = (day) => {
    const days = {
      monday: "Thứ 2",
      tuesday: "Thứ 3",
      wednesday: "Thứ 4",
      thursday: "Thứ 5",
      friday: "Thứ 6",
      saturday: "Thứ 7",
      sunday: "Chủ nhật",
    };
    return days[day];
  };

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
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
          Thông tin cá nhân
        </Typography>
        {!editMode ? (
          <Button
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ color: "#10b981" }}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSave}
              sx={{
                background: "linear-gradient(45deg, #10b981, #059669)",
                "&:hover": {
                  background: "linear-gradient(45deg, #059669, #047857)",
                },
              }}
            >
              Lưu
            </Button>
            <Button
              startIcon={<CancelIcon />}
              onClick={handleCancel}
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
          <ProfileAvatar>
            {tempData.personalInfo.fullName.charAt(0)}
          </ProfileAvatar>
          {editMode && (
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
          sx={{ fontWeight: 600, mt: 2, color: "#1e293b" }}
        >
          {tempData.personalInfo.fullName}
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b", mb: 2 }}>
          {tempData.professionalInfo.specialization}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Badge
            badgeContent={<VerifiedIcon sx={{ fontSize: 12 }} />}
            color="primary"
          >
            <Chip label="Bác sĩ được xác minh" color="success" size="small" />
          </Badge>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Họ và tên"
            value={tempData.personalInfo.fullName}
            onChange={(e) =>
              handleInputChange("personalInfo", "fullName", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            value={tempData.personalInfo.email}
            onChange={(e) =>
              handleInputChange("personalInfo", "email", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <EmailIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Số điện thoại"
            value={tempData.personalInfo.phone}
            onChange={(e) =>
              handleInputChange("personalInfo", "phone", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <PhoneIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ngày sinh"
            type="date"
            value={tempData.personalInfo.dateOfBirth}
            onChange={(e) =>
              handleInputChange("personalInfo", "dateOfBirth", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={tempData.personalInfo.gender}
              onChange={(e) =>
                handleInputChange("personalInfo", "gender", e.target.value)
              }
              disabled={!editMode}
              label="Giới tính"
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Địa chỉ"
            value={tempData.personalInfo.address}
            onChange={(e) =>
              handleInputChange("personalInfo", "address", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <LocationIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Giới thiệu bản thân"
            multiline
            rows={4}
            value={tempData.personalInfo.bio}
            onChange={(e) =>
              handleInputChange("personalInfo", "bio", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
          />
        </Grid>
      </Grid>
    </StyledPaper>
  );

  const renderProfessionalInfo = () => (
    <StyledPaper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
      >
        Thông tin nghề nghiệp
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              p: 2,
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1))",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#3b82f6" }}>
              {tempData.professionalInfo.rating}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Đánh giá TB
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  sx={{
                    fontSize: 16,
                    color:
                      index < Math.floor(tempData.professionalInfo.rating)
                        ? "#fbbf24"
                        : "#e5e7eb",
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              p: 2,
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#10b981" }}>
              {tempData.professionalInfo.totalReviews}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Đánh giá
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              p: 2,
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#f59e0b" }}>
              {tempData.professionalInfo.yearsOfExperience}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Năm KN
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              p: 2,
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1))",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#8b5cf6" }}>
              {tempData.professionalInfo.successRate}%
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Thành công
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Chuyên khoa"
            value={tempData.professionalInfo.specialization}
            onChange={(e) =>
              handleInputChange(
                "professionalInfo",
                "specialization",
                e.target.value
              )
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <SchoolIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Số giấy phép hành nghề"
            value={tempData.professionalInfo.licenseNumber}
            onChange={(e) =>
              handleInputChange(
                "professionalInfo",
                "licenseNumber",
                e.target.value
              )
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <VerifiedIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Số năm kinh nghiệm"
            type="number"
            value={tempData.professionalInfo.yearsOfExperience}
            onChange={(e) =>
              handleInputChange(
                "professionalInfo",
                "yearsOfExperience",
                parseInt(e.target.value)
              )
            }
            disabled={!editMode}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nơi làm việc"
            value={tempData.professionalInfo.workplace}
            onChange={(e) =>
              handleInputChange("professionalInfo", "workplace", e.target.value)
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <WorkIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phí tư vấn (VNĐ)"
            type="number"
            value={tempData.professionalInfo.consultationFee}
            onChange={(e) =>
              handleInputChange(
                "professionalInfo",
                "consultationFee",
                parseInt(e.target.value)
              )
            }
            disabled={!editMode}
            margin="normal"
            InputProps={{
              endAdornment: <MoneyIcon sx={{ color: "#64748b" }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#4A5568", mb: 1 }}>
              Ngôn ngữ
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tempData.professionalInfo.languages.map((language, index) => (
                <Chip
                  key={index}
                  label={language}
                  size="small"
                  color="primary"
                  variant="outlined"
                  deleteIcon={editMode ? <DeleteIcon /> : undefined}
                  onDelete={
                    editMode
                      ? () => {
                          const newLanguages =
                            tempData.professionalInfo.languages.filter(
                              (_, i) => i !== index
                            );
                          handleInputChange(
                            "professionalInfo",
                            "languages",
                            newLanguages
                          );
                        }
                      : undefined
                  }
                />
              ))}
              {editMode && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newLanguage = prompt("Nhập ngôn ngữ mới:");
                    if (newLanguage) {
                      const newLanguages = [
                        ...tempData.professionalInfo.languages,
                        newLanguage,
                      ];
                      handleInputChange(
                        "professionalInfo",
                        "languages",
                        newLanguages
                      );
                    }
                  }}
                  sx={{ color: "#10b981" }}
                >
                  Thêm ngôn ngữ
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Education */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
        >
          Học vấn
        </Typography>
        {tempData.education.map((edu, index) => (
          <Card
            key={index}
            sx={{ mb: 2, p: 2, background: "rgba(16, 185, 129, 0.05)" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SchoolIcon sx={{ color: "#10b981", mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {edu.institution} • {edu.year}
                  </Typography>
                </Box>
              </Box>
              {editMode && (
                <IconButton size="small" sx={{ color: "#ef4444" }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Card>
        ))}
        {editMode && (
          <Button startIcon={<AddIcon />} sx={{ color: "#10b981" }}>
            Thêm học vấn
          </Button>
        )}
      </Box>

      {/* Certifications */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#1e293b" }}
          >
            Chứng chỉ
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenCertDialog(true)}
            sx={{ color: "#10b981" }}
          >
            Thêm chứng chỉ
          </Button>
        </Box>
        {tempData.certifications.map((cert, index) => (
          <Card
            key={index}
            sx={{ mb: 2, p: 2, background: "rgba(59, 130, 246, 0.05)" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 2 }}>
                  {cert.verified ? (
                    <VerifiedIcon sx={{ color: "#10b981" }} />
                  ) : (
                    <VerifiedIcon sx={{ color: "#94a3b8" }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {cert.issuer} • {cert.date}
                  </Typography>
                  {cert.verified && (
                    <Chip
                      label="Đã xác minh"
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Box>
              {editMode && (
                <IconButton size="small" sx={{ color: "#ef4444" }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Card>
        ))}
      </Box>
    </StyledPaper>
  );

  const renderWorkingHours = () => (
    <StyledPaper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
      >
        Giờ làm việc
      </Typography>

      {Object.entries(tempData.workingHours).map(([day, hours]) => (
        <Box
          key={day}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            p: 2,
            backgroundColor: "rgba(16, 185, 129, 0.05)",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, minWidth: "100px" }}
          >
            {getDayName(day)}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={hours.available}
                onChange={(e) => {
                  const newHours = {
                    ...tempData.workingHours,
                    [day]: { ...hours, available: e.target.checked },
                  };
                  setTempData((prev) => ({ ...prev, workingHours: newHours }));
                }}
                disabled={!editMode}
              />
            }
            label="Có sẵn"
          />
          {hours.available && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                type="time"
                value={hours.start}
                onChange={(e) => {
                  const newHours = {
                    ...tempData.workingHours,
                    [day]: { ...hours, start: e.target.value },
                  };
                  setTempData((prev) => ({ ...prev, workingHours: newHours }));
                }}
                disabled={!editMode}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <Typography variant="body2">đến</Typography>
              <TextField
                type="time"
                value={hours.end}
                onChange={(e) => {
                  const newHours = {
                    ...tempData.workingHours,
                    [day]: { ...hours, end: e.target.value },
                  };
                  setTempData((prev) => ({ ...prev, workingHours: newHours }));
                }}
                disabled={!editMode}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </Box>
      ))}
    </StyledPaper>
  );

  const renderSettings = () => (
    <StyledPaper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
      >
        Cài đặt tài khoản
      </Typography>

      {/* Notification Preferences */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
        >
          Tùy chọn thông báo
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              primary="Thông báo qua Email"
              secondary="Nhận thông báo về lịch hẹn và tin nhắn"
            />
            <Switch
              checked={tempData.preferences.emailNotifications}
              onChange={(e) =>
                handleInputChange(
                  "preferences",
                  "emailNotifications",
                  e.target.checked
                )
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText
              primary="Thông báo SMS"
              secondary="Nhận tin nhắn SMS về lịch hẹn khẩn cấp"
            />
            <Switch
              checked={tempData.preferences.smsNotifications}
              onChange={(e) =>
                handleInputChange(
                  "preferences",
                  "smsNotifications",
                  e.target.checked
                )
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Nhắc nhở lịch hẹn"
              secondary="Nhận thông báo trước 24h và 1h"
            />
            <Switch
              checked={tempData.preferences.appointmentReminders}
              onChange={(e) =>
                handleInputChange(
                  "preferences",
                  "appointmentReminders",
                  e.target.checked
                )
              }
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Security Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
        >
          Bảo mật
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Xác thực 2 yếu tố"
              secondary="Tăng cường bảo mật cho tài khoản"
            />
            <Switch
              checked={tempData.preferences.twoFactorAuth}
              onChange={(e) =>
                handleInputChange(
                  "preferences",
                  "twoFactorAuth",
                  e.target.checked
                )
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Hiển thị hồ sơ"
              secondary="Cho phép bệnh nhân tìm thấy hồ sơ của bạn"
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={tempData.preferences.profileVisibility}
                onChange={(e) =>
                  handleInputChange(
                    "preferences",
                    "profileVisibility",
                    e.target.value
                  )
                }
              >
                <MenuItem value="public">Công khai</MenuItem>
                <MenuItem value="limited">Hạn chế</MenuItem>
                <MenuItem value="private">Riêng tư</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Change Password */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
        >
          Đổi mật khẩu
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              type={showPassword ? "text" : "password"}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showPassword ? "text" : "password"}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type={showPassword ? "text" : "password"}
              margin="normal"
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            background: "linear-gradient(45deg, #10b981, #059669)",
            "&:hover": {
              background: "linear-gradient(45deg, #059669, #047857)",
            },
          }}
        >
          Cập nhật mật khẩu
        </Button>
      </Box>
    </StyledPaper>
  );

  const tabLabels = [
    "Thông tin cá nhân",
    "Thông tin nghề nghiệp",
    "Giờ làm việc",
    "Cài đặt",
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
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
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Quản lý thông tin cá nhân và cài đặt tài khoản
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
      </StyledPaper>

      {/* Content */}
      <Box>
        {selectedTab === 0 && renderPersonalInfo()}
        {selectedTab === 1 && renderProfessionalInfo()}
        {selectedTab === 2 && renderWorkingHours()}
        {selectedTab === 3 && renderSettings()}
      </Box>

      {/* Certification Dialog */}
      <Dialog
        open={openCertDialog}
        onClose={() => setOpenCertDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm chứng chỉ mới</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Tên chứng chỉ" margin="normal" />
          <TextField fullWidth label="Tổ chức cấp" margin="normal" />
          <TextField fullWidth label="Năm cấp" type="number" margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCertDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultantProfileContent;

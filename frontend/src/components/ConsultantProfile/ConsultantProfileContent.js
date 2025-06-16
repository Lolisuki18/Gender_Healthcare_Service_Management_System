/**
 * ConsultantProfileContent.js - Component để hiển thị và quản lý hồ sơ chuyên gia
 *
 * Features:
 * - Hiển thị thông tin hồ sơ chuyên gia
 * - Cập nhật thông tin cá nhân
 * - Cập nhật thông tin chuyên môn
 * - Quản lý chứng chỉ và bằng cấp
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import AvatarUpload from "../common/AvatarUpload";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ConsultantProfileContent = () => {
  // State for tab management
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);

  // Mock data - sẽ được thay thế bằng API calls
  const [profileData, setProfileData] = useState({
    personalInfo: {
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0987654321",
      dob: "1985-06-15",
      gender: "male",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      avatar: "/images/avatars/doctor1.jpg",
    },
    professionalInfo: {
      specialization: "Sức khỏe sinh sản",
      yearsOfExperience: 8,
      bio: "Chuyên gia trong lĩnh vực sức khỏe sinh sản với hơn 8 năm kinh nghiệm. Chuyên về tư vấn và điều trị các bệnh lây truyền qua đường tình dục (STI), sức khỏe sinh sản nam và nữ.",
      consultationFee: 500000,
      languages: ["Tiếng Việt", "Tiếng Anh"],
    },
    education: [
      {
        id: 1,
        degree: "Tiến sĩ Y học",
        institution: "Đại học Y Hà Nội",
        year: "2015",
        description: "Chuyên ngành Sức khỏe sinh sản",
      },
      {
        id: 2,
        degree: "Thạc sĩ Y học",
        institution: "Đại học Y Dược TP.HCM",
        year: "2010",
        description: "Chuyên ngành Y học cộng đồng",
      },
    ],
    experience: [
      {
        id: 1,
        title: "Bác sĩ tư vấn",
        organization: "Bệnh viện Đa khoa Quốc tế",
        from: "2018",
        to: "Hiện tại",
        description:
          "Tư vấn và điều trị các bệnh liên quan đến sức khỏe sinh sản",
      },
      {
        id: 2,
        title: "Bác sĩ chuyên khoa",
        organization: "Trung tâm Y tế Phương Đông",
        from: "2014",
        to: "2018",
        description: "Khám và điều trị các bệnh lây truyền qua đường tình dục",
      },
    ],
    certifications: [
      {
        id: 1,
        name: "Chứng chỉ Sức khỏe Sinh sản Quốc tế",
        issuedBy: "Tổ chức Y tế Thế giới (WHO)",
        year: "2016",
      },
      {
        id: 2,
        name: "Chứng nhận Tư vấn STI chuyên sâu",
        issuedBy: "Hiệp hội Sức khỏe Sinh sản Châu Á",
        year: "2017",
      },
    ],
  });

  // New education, experience, certification state
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  const [newExperience, setNewExperience] = useState({
    title: "",
    organization: "",
    from: "",
    to: "",
    description: "",
  });

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuedBy: "",
    year: "",
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle edit mode
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Mock API call - sẽ được thay thế bằng API thực
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sau khi lưu thành công
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // API call sẽ được uncomment khi backend sẵn sàng
      /*
      await consultantService.updatePersonalInfo(profileData.id, profileData.personalInfo);
      await consultantService.updateProfessionalInfo(profileData.id, profileData.professionalInfo);
      */
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update form fields
  const handlePersonalInfoChange = (field, value) => {
    setProfileData({
      ...profileData,
      personalInfo: {
        ...profileData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleProfessionalInfoChange = (field, value) => {
    setProfileData({
      ...profileData,
      professionalInfo: {
        ...profileData.professionalInfo,
        [field]: value,
      },
    });
  };

  // Education handlers
  const handleOpenEducationDialog = () => {
    setNewEducation({
      degree: "",
      institution: "",
      year: "",
      description: "",
    });
    setEducationDialogOpen(true);
  };

  const handleCloseEducationDialog = () => {
    setEducationDialogOpen(false);
  };

  const handleAddEducation = () => {
    const newId =
      Math.max(...profileData.education.map((item) => item.id), 0) + 1;
    const updatedEducation = [
      ...profileData.education,
      { id: newId, ...newEducation },
    ];

    setProfileData({
      ...profileData,
      education: updatedEducation,
    });

    // Đóng dialog
    handleCloseEducationDialog();

    // API call sẽ được uncomment khi backend sẵn sàng
    /*
    try {
      await consultantService.addEducation(profileData.id, newEducation);
    } catch (err) {
      console.error("Error adding education:", err);
    }
    */
  };

  const handleDeleteEducation = (id) => {
    const updatedEducation = profileData.education.filter(
      (item) => item.id !== id
    );

    setProfileData({
      ...profileData,
      education: updatedEducation,
    });

    // API call sẽ được uncomment khi backend sẵn sàng
    /*
    try {
      await consultantService.deleteEducation(profileData.id, id);
    } catch (err) {
      console.error("Error deleting education:", err);
    }
    */
  };

  // Experience handlers
  const handleOpenExperienceDialog = () => {
    setNewExperience({
      title: "",
      organization: "",
      from: "",
      to: "",
      description: "",
    });
    setExperienceDialogOpen(true);
  };

  const handleCloseExperienceDialog = () => {
    setExperienceDialogOpen(false);
  };

  const handleAddExperience = () => {
    const newId =
      Math.max(...profileData.experience.map((item) => item.id), 0) + 1;
    const updatedExperience = [
      ...profileData.experience,
      { id: newId, ...newExperience },
    ];

    setProfileData({
      ...profileData,
      experience: updatedExperience,
    });

    // Đóng dialog
    handleCloseExperienceDialog();

    // API call sẽ được uncomment khi backend sẵn sàng
    /*
    try {
      await consultantService.addExperience(profileData.id, newExperience);
    } catch (err) {
      console.error("Error adding experience:", err);
    }
    */
  };

  const handleDeleteExperience = (id) => {
    const updatedExperience = profileData.experience.filter(
      (item) => item.id !== id
    );

    setProfileData({
      ...profileData,
      experience: updatedExperience,
    });

    // API call sẽ được uncomment khi backend sẵn sàng
    /*
    try {
      await consultantService.deleteExperience(profileData.id, id);
    } catch (err) {
      console.error("Error deleting experience:", err);
    }
    */
  };

  // Certification handlers
  const handleOpenCertificationDialog = () => {
    setNewCertification({
      name: "",
      issuedBy: "",
      year: "",
    });
    setCertificationDialogOpen(true);
  };

  const handleCloseCertificationDialog = () => {
    setCertificationDialogOpen(false);
  };

  const handleAddCertification = () => {
    const newId =
      Math.max(...profileData.certifications.map((item) => item.id), 0) + 1;
    const updatedCertifications = [
      ...profileData.certifications,
      { id: newId, ...newCertification },
    ];

    setProfileData({
      ...profileData,
      certifications: updatedCertifications,
    });

    // Đóng dialog
    handleCloseCertificationDialog();

    // API call sẽ được uncomment khi backend sẵn sàng
    /*
    try {
      await consultantService.addCertification(profileData.id, newCertification);
    } catch (err) {
      console.error("Error adding certification:", err);
    }
    */
  };

  const handleDeleteCertification = (id) => {
    const updatedCertifications = profileData.certifications.filter(
      (item) => item.id !== id
    );

    setProfileData({
      ...profileData,
      certifications: updatedCertifications,
    });

    // API call sẽ được uncomment khi backend sẵn sàng
    /*
    try {
      await consultantService.deleteCertification(profileData.id, id);
    } catch (err) {
      console.error("Error deleting certification:", err);
    }
    */
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Hồ sơ chuyên gia
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Quản lý thông tin cá nhân và chuyên môn của bạn
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="profile tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
            },
          }}
        >
          <Tab
            label="Thông tin cá nhân"
            icon={<PersonIcon />}
            iconPosition="start"
          />
          <Tab label="Chuyên môn" icon={<WorkIcon />} iconPosition="start" />
          <Tab label="Học vấn" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Kinh nghiệm" icon={<WorkIcon />} iconPosition="start" />
          <Tab label="Chứng chỉ" icon={<SchoolIcon />} iconPosition="start" />
        </Tabs>

        {tabValue === 0 || tabValue === 1 ? (
          <Button
            variant={isEditing ? "contained" : "outlined"}
            color={isEditing ? "primary" : "secondary"}
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={isEditing ? handleSaveProfile : handleToggleEdit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Đang xử lý...
              </>
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Chỉnh sửa"
            )}
          </Button>
        ) : null}
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Cập nhật hồ sơ thành công!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tab thông tin cá nhân */}
      <TabPanel value={tabValue} index={0}>
        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <AvatarUpload
                  currentAvatar={profileData.personalInfo.avatar || ""}
                  size={180}
                  disabled={!isEditing}
                  onChange={(url) => handlePersonalInfoChange("avatar", url)}
                />
              </Box>
              <Typography variant="h6" fontWeight="medium">
                {profileData.personalInfo.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData.professionalInfo.specialization}
              </Typography>
              <Chip
                label={`${profileData.professionalInfo.yearsOfExperience} năm kinh nghiệm`}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={profileData.personalInfo.fullName}
                    onChange={(e) =>
                      handlePersonalInfoChange("fullName", e.target.value)
                    }
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.personalInfo.email}
                    onChange={(e) =>
                      handlePersonalInfoChange("email", e.target.value)
                    }
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={profileData.personalInfo.phone}
                    onChange={(e) =>
                      handlePersonalInfoChange("phone", e.target.value)
                    }
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày sinh"
                    value={profileData.personalInfo.dob}
                    onChange={(e) =>
                      handlePersonalInfoChange("dob", e.target.value)
                    }
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant={isEditing ? "outlined" : "filled"}
                    disabled={!isEditing}
                  >
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={profileData.personalInfo.gender}
                      onChange={(e) =>
                        handlePersonalInfoChange("gender", e.target.value)
                      }
                      label="Giới tính"
                    >
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={profileData.personalInfo.address}
                    onChange={(e) =>
                      handlePersonalInfoChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledPaper>
      </TabPanel>

      {/* Tab thông tin chuyên môn */}
      <TabPanel value={tabValue} index={1}>
        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chuyên môn"
                value={profileData.professionalInfo.specialization}
                onChange={(e) =>
                  handleProfessionalInfoChange("specialization", e.target.value)
                }
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kinh nghiệm (năm)"
                type="number"
                value={profileData.professionalInfo.yearsOfExperience}
                onChange={(e) =>
                  handleProfessionalInfoChange(
                    "yearsOfExperience",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phí tư vấn (VNĐ)"
                type="number"
                value={profileData.professionalInfo.consultationFee}
                onChange={(e) =>
                  handleProfessionalInfoChange(
                    "consultationFee",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant={isEditing ? "outlined" : "filled"}
                disabled={!isEditing}
                margin="normal"
              >
                <InputLabel>Ngôn ngữ</InputLabel>
                <Select
                  multiple
                  value={profileData.professionalInfo.languages}
                  onChange={(e) =>
                    handleProfessionalInfoChange("languages", e.target.value)
                  }
                  label="Ngôn ngữ"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Tiếng Việt">Tiếng Việt</MenuItem>
                  <MenuItem value="Tiếng Anh">Tiếng Anh</MenuItem>
                  <MenuItem value="Tiếng Pháp">Tiếng Pháp</MenuItem>
                  <MenuItem value="Tiếng Trung">Tiếng Trung</MenuItem>
                  <MenuItem value="Tiếng Hàn">Tiếng Hàn</MenuItem>
                  <MenuItem value="Tiếng Nhật">Tiếng Nhật</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới thiệu chuyên môn"
                value={profileData.professionalInfo.bio}
                onChange={(e) =>
                  handleProfessionalInfoChange("bio", e.target.value)
                }
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </StyledPaper>
      </TabPanel>

      {/* Tab học vấn */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenEducationDialog}
          >
            Thêm học vấn
          </Button>
        </Box>

        <Grid container spacing={3}>
          {profileData.education.map((edu) => (
            <Grid item xs={12} md={6} key={edu.id}>
              <Card variant="outlined" sx={{ position: "relative" }}>
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleDeleteEducation(edu.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{edu.degree}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Trường/Viện:</strong> {edu.institution}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Năm tốt nghiệp:</strong> {edu.year}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Mô tả:</strong> {edu.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog thêm học vấn */}
        <Dialog
          open={educationDialogOpen}
          onClose={handleCloseEducationDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Thêm học vấn mới</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Bằng cấp/Học vị"
              value={newEducation.degree}
              onChange={(e) =>
                setNewEducation({ ...newEducation, degree: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Trường/Viện"
              value={newEducation.institution}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  institution: e.target.value,
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Năm tốt nghiệp"
              value={newEducation.year}
              onChange={(e) =>
                setNewEducation({ ...newEducation, year: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mô tả"
              value={newEducation.description}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  description: e.target.value,
                })
              }
              margin="normal"
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEducationDialog}>Hủy</Button>
            <Button
              onClick={handleAddEducation}
              color="primary"
              variant="contained"
              disabled={
                !newEducation.degree ||
                !newEducation.institution ||
                !newEducation.year
              }
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Tab kinh nghiệm */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenExperienceDialog}
          >
            Thêm kinh nghiệm
          </Button>
        </Box>

        <Grid container spacing={3}>
          {profileData.experience.map((exp) => (
            <Grid item xs={12} key={exp.id}>
              <Card variant="outlined" sx={{ position: "relative" }}>
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleDeleteExperience(exp.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{exp.title}</Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>{exp.organization}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Thời gian:</strong> {exp.from} - {exp.to}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Mô tả:</strong> {exp.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog thêm kinh nghiệm */}
        <Dialog
          open={experienceDialogOpen}
          onClose={handleCloseExperienceDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Thêm kinh nghiệm mới</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Chức vụ"
              value={newExperience.title}
              onChange={(e) =>
                setNewExperience({ ...newExperience, title: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tổ chức"
              value={newExperience.organization}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  organization: e.target.value,
                })
              }
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Từ năm"
                  value={newExperience.from}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, from: e.target.value })
                  }
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Đến năm"
                  value={newExperience.to}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, to: e.target.value })
                  }
                  margin="normal"
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Mô tả công việc"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseExperienceDialog}>Hủy</Button>
            <Button
              onClick={handleAddExperience}
              color="primary"
              variant="contained"
              disabled={
                !newExperience.title ||
                !newExperience.organization ||
                !newExperience.from
              }
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Tab chứng chỉ */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCertificationDialog}
          >
            Thêm chứng chỉ
          </Button>
        </Box>

        <Grid container spacing={3}>
          {profileData.certifications.map((cert) => (
            <Grid item xs={12} md={6} key={cert.id}>
              <Card variant="outlined" sx={{ position: "relative" }}>
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleDeleteCertification(cert.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{cert.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Đơn vị cấp:</strong> {cert.issuedBy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Năm cấp:</strong> {cert.year}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog thêm chứng chỉ */}
        <Dialog
          open={certificationDialogOpen}
          onClose={handleCloseCertificationDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Thêm chứng chỉ mới</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên chứng chỉ"
              value={newCertification.name}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  name: e.target.value,
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Đơn vị cấp"
              value={newCertification.issuedBy}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  issuedBy: e.target.value,
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Năm cấp"
              value={newCertification.year}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  year: e.target.value,
                })
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCertificationDialog}>Hủy</Button>
            <Button
              onClick={handleAddCertification}
              color="primary"
              variant="contained"
              disabled={
                !newCertification.name ||
                !newCertification.issuedBy ||
                !newCertification.year
              }
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Box>
  );
};

export default ConsultantProfileContent;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  History as HistoryIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  LocalHospital as HospitalIcon,
  Psychology as PsychologyIcon,
  Medication as MedicationIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
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

const PatientCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05))",
  border: "1px solid rgba(16, 185, 129, 0.1)",
  borderRadius: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(16, 185, 129, 0.15)",
  },
}));

const ConsultantPatientsContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const patients = {
    myPatients: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        age: 28,
        gender: "Nam → Nữ",
        phone: "0901234567",
        email: "nguyenvana@gmail.com",
        firstVisit: "2024-01-15",
        lastVisit: "2024-05-28",
        totalVisits: 12,
        status: "active",
        priority: "high",
        currentTreatment: "Hormone Therapy",
        nextAppointment: "2024-06-10",
        medicalConditions: ["Gender Dysphoria", "Anxiety"],
        medications: ["Estradiol", "Spironolactone"],
        notes:
          "Tiến triển tốt, cần theo dõi thường xuyên về tác dụng phụ của hormone",
        riskLevel: "medium",
        avatar: "NA",
      },
      {
        id: 2,
        name: "Trần Thị B",
        age: 24,
        gender: "Nữ → Nam",
        phone: "0907654321",
        email: "tranthib@gmail.com",
        firstVisit: "2024-03-10",
        lastVisit: "2024-06-01",
        totalVisits: 8,
        status: "active",
        priority: "medium",
        currentTreatment: "Testosterone Therapy",
        nextAppointment: "2024-06-15",
        medicalConditions: ["Gender Dysphoria", "Depression"],
        medications: ["Testosterone", "Antidepressant"],
        notes: "Cần hỗ trợ tâm lý thêm, phản ứng tốt với điều trị hormone",
        riskLevel: "low",
        avatar: "TB",
      },
      {
        id: 3,
        name: "Lê Văn C",
        age: 32,
        gender: "Nam → Nữ",
        phone: "0909876543",
        email: "levanc@gmail.com",
        firstVisit: "2023-11-20",
        lastVisit: "2024-05-25",
        totalVisits: 15,
        status: "stable",
        priority: "low",
        currentTreatment: "Maintenance Therapy",
        nextAppointment: "2024-07-01",
        medicalConditions: ["Gender Dysphoria"],
        medications: ["Estradiol", "Progesterone"],
        notes: "Ổn định, kiểm tra định kỳ 3 tháng/lần",
        riskLevel: "low",
        avatar: "LC",
      },
    ],
    newPatients: [
      {
        id: 4,
        name: "Phạm Thị D",
        age: 26,
        gender: "Nữ → Nam",
        phone: "0905432109",
        email: "phamthid@gmail.com",
        firstVisit: "2024-06-01",
        lastVisit: "2024-06-01",
        totalVisits: 1,
        status: "new",
        priority: "high",
        currentTreatment: "Initial Assessment",
        nextAppointment: "2024-06-08",
        medicalConditions: ["Gender Dysphoria"],
        medications: [],
        notes: "Bệnh nhân mới, cần đánh giá toàn diện và lập kế hoạch điều trị",
        riskLevel: "unknown",
        avatar: "PD",
      },
    ],
    followUp: [
      {
        id: 5,
        name: "Hoàng Văn E",
        age: 29,
        gender: "Nam → Nữ",
        phone: "0903456789",
        email: "hoangvane@gmail.com",
        firstVisit: "2024-02-15",
        lastVisit: "2024-05-15",
        totalVisits: 6,
        status: "follow-up",
        priority: "medium",
        currentTreatment: "Post-Surgery Care",
        nextAppointment: "2024-06-12",
        medicalConditions: ["Gender Dysphoria", "Post-surgical care"],
        medications: ["Estradiol", "Pain medication"],
        notes: "Sau phẫu thuật 3 tháng, cần theo dõi quá trình hồi phục",
        riskLevel: "medium",
        avatar: "HE",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "stable":
        return "info";
      case "new":
        return "primary";
      case "follow-up":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang điều trị";
      case "stable":
        return "Ổn định";
      case "new":
        return "Bệnh nhân mới";
      case "follow-up":
        return "Theo dõi";
      case "inactive":
        return "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      case "unknown":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return <WarningIcon />;
      case "medium":
        return <TrendingUpIcon />;
      case "low":
        return <CheckCircleIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleMenuClick = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const filteredPatients = (patientList) => {
    if (!searchQuery) return patientList;
    return patientList.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery)
    );
  };

  const renderPatientsList = (patientsList) => (
    <Grid container spacing={3}>
      {filteredPatients(patientsList).map((patient) => (
        <Grid item xs={12} lg={6} xl={4} key={patient.id}>
          <PatientCard>
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={patient.priority !== "high"}
                    sx={{
                      "& .MuiBadge-dot": {
                        backgroundColor: getPriorityColor(patient.priority),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        background: "linear-gradient(45deg, #10b981, #059669)",
                        width: 56,
                        height: 56,
                        mr: 2,
                        fontWeight: 600,
                        fontSize: "20px",
                      }}
                    >
                      {patient.avatar}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#2D3748" }}
                    >
                      {patient.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#718096" }}>
                      {patient.age} tuổi • {patient.gender}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#718096", fontSize: "12px" }}
                    >
                      ID: #{patient.id.toString().padStart(4, "0")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={getStatusText(patient.status)}
                    color={getStatusColor(patient.status)}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, patient)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Patient Info */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#718096",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {patient.phone}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#718096",
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  {patient.email}
                </Typography>

                {/* Treatment Info */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                    borderRadius: "8px",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#374151", mb: 1 }}
                  >
                    <MedicalIcon
                      sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                    />
                    Điều trị hiện tại: {patient.currentTreatment}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    <CalendarIcon
                      sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                    />
                    Hẹn tiếp: {patient.nextAppointment}
                  </Typography>
                </Box>

                {/* Medical Conditions */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#374151", mb: 1 }}
                  >
                    Tình trạng y tế:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {patient.medicalConditions.map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "11px" }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Medications */}
                {patient.medications.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#374151", mb: 1 }}
                    >
                      Thuốc đang dùng:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {patient.medications.map((medication, index) => (
                        <Chip
                          key={index}
                          label={medication}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: "11px" }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Risk Level */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#374151", mr: 1 }}
                  >
                    Mức độ rủi ro:
                  </Typography>
                  <Chip
                    icon={getRiskLevelIcon(patient.riskLevel)}
                    label={
                      patient.riskLevel === "unknown"
                        ? "Chưa đánh giá"
                        : patient.riskLevel.toUpperCase()
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        getRiskLevelColor(patient.riskLevel) + "20",
                      color: getRiskLevelColor(patient.riskLevel),
                      fontSize: "11px",
                    }}
                  />
                </Box>

                {/* Stats */}
                <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#3b82f6" }}
                    >
                      {patient.totalVisits}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", fontSize: "11px" }}
                    >
                      Lần khám
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#10b981" }}
                    >
                      {patient.firstVisit}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", fontSize: "11px" }}
                    >
                      Lần đầu
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#f59e0b" }}
                    >
                      {patient.lastVisit}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", fontSize: "11px" }}
                    >
                      Gần nhất
                    </Typography>
                  </Box>
                </Box>

                {/* Notes Preview */}
                {patient.notes && (
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(59, 130, 246, 0.05)",
                      borderRadius: "8px",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",
                        fontStyle: "italic",
                        fontSize: "12px",
                      }}
                    >
                      {patient.notes.length > 80
                        ? `${patient.notes.substring(0, 80)}...`
                        : patient.notes}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewPatient(patient)}
                  sx={{ borderColor: "#10b981", color: "#10b981" }}
                >
                  Xem hồ sơ
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1d4ed8, #1e40af)",
                    },
                  }}
                >
                  Đặt hẹn
                </Button>
              </Box>
            </CardContent>
          </PatientCard>
        </Grid>
      ))}
    </Grid>
  );

  const tabLabels = ["Bệnh nhân của tôi", "Bệnh nhân mới", "Theo dõi đặc biệt"];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
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
            Quản lý Bệnh nhân
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Theo dõi và quản lý thông tin bệnh nhân của bạn
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(45deg, #10b981, #059669)",
            "&:hover": {
              background: "linear-gradient(45deg, #059669, #047857)",
            },
          }}
        >
          Thêm bệnh nhân
        </Button>
      </Box>

      {/* Search Bar */}
      <StyledPaper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm bệnh nhân theo tên, email hoặc số điện thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.05)",
            },
          }}
        />
      </StyledPaper>

      {/* Tabs */}
      <StyledPaper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
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
        {selectedTab === 0 && renderPatientsList(patients.myPatients)}
        {selectedTab === 1 && renderPatientsList(patients.newPatients)}
        {selectedTab === 2 && renderPatientsList(patients.followUp)}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewPatient(selectedPatient)}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem hồ sơ chi tiết
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa thông tin
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
          Đặt lịch hẹn
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AssignmentIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem lịch sử khám
        </MenuItem>
      </Menu>

      {/* Patient Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                background: "linear-gradient(45deg, #10b981, #059669)",
                width: 48,
                height: 48,
                mr: 2,
                fontWeight: 600,
              }}
            >
              {selectedPatient?.avatar}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Hồ sơ bệnh nhân - {selectedPatient?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                ID: #{selectedPatient?.id.toString().padStart(4, "0")} •{" "}
                {selectedPatient?.age} tuổi
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Thông tin cá nhân
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Họ và tên
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Tuổi
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.age}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Chuyển đổi giới tính
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.gender}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Điện thoại
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.phone}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.email}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Medical Information */}
                <Grid item xs={12} md={6}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        <MedicalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Thông tin y tế
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Trạng thái
                          </Typography>
                          <Chip
                            label={getStatusText(selectedPatient.status)}
                            color={getStatusColor(selectedPatient.status)}
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Điều trị hiện tại
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.currentTreatment}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Tình trạng y tế
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selectedPatient.medicalConditions.map(
                              (condition, index) => (
                                <Chip
                                  key={index}
                                  label={condition}
                                  size="small"
                                  variant="outlined"
                                />
                              )
                            )}
                          </Box>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Thuốc đang sử dụng
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selectedPatient.medications.length > 0 ? (
                              selectedPatient.medications.map(
                                (medication, index) => (
                                  <Chip
                                    key={index}
                                    label={medication}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                )
                              )
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: "#6b7280" }}
                              >
                                Chưa có thuốc được kê đơn
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#4A5568", mb: 0.5 }}
                          >
                            Mức độ rủi ro
                          </Typography>
                          <Chip
                            icon={getRiskLevelIcon(selectedPatient.riskLevel)}
                            label={
                              selectedPatient.riskLevel === "unknown"
                                ? "Chưa đánh giá"
                                : selectedPatient.riskLevel.toUpperCase()
                            }
                            size="small"
                            sx={{
                              backgroundColor:
                                getRiskLevelColor(selectedPatient.riskLevel) +
                                "20",
                              color: getRiskLevelColor(
                                selectedPatient.riskLevel
                              ),
                            }}
                          />
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Treatment History */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        <HistoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Lịch sử điều trị
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, color: "#3b82f6" }}
                          >
                            {selectedPatient.totalVisits}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Tổng số lần khám
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#10b981" }}
                          >
                            {selectedPatient.firstVisit}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Lần khám đầu tiên
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#f59e0b" }}
                          >
                            {selectedPatient.lastVisit}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Lần khám gần nhất
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#8b5cf6" }}
                          >
                            {selectedPatient.nextAppointment}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Hẹn tiếp theo
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        <AssignmentIcon
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        Ghi chú điều trị
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "rgba(16, 185, 129, 0.05)",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "#374151" }}>
                          {selectedPatient.notes}
                        </Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ borderColor: "#10b981", color: "#10b981" }}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            Đặt lịch hẹn
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultantPatientsContent;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Menu,
} from "@mui/material";
import {
  Medication as MedicationIcon,
  LocalPharmacy as PharmacyIcon,
  Assignment as PrescriptionIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
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

const PrescriptionCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))",
  border: "1px solid rgba(16, 185, 129, 0.1)",
  borderRadius: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(16, 185, 129, 0.15)",
  },
}));

const PrescriptionsContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: "",
    patientName: "",
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    diagnosis: "",
    notes: "",
  });

  const tabLabels = ["Đơn thuốc mới", "Đang điều trị", "Lịch sử", "Thống kê"];

  const prescriptions = {
    pending: [
      {
        id: 1,
        patientName: "Nguyễn Thị Mai",
        patientId: "BN001",
        date: "2024-12-20",
        diagnosis: "Điều trị hormone chuyển đổi giới tính",
        medications: [
          {
            name: "Estradiol",
            dosage: "2mg",
            frequency: "1 lần/ngày",
            duration: "3 tháng",
            instructions: "Uống sau bữa ăn",
          },
          {
            name: "Spironolactone",
            dosage: "100mg",
            frequency: "2 lần/ngày",
            duration: "3 tháng",
            instructions: "Uống cùng nước",
          },
        ],
        status: "pending",
        priority: "high",
      },
      {
        id: 2,
        patientName: "Trần Văn Nam",
        patientId: "BN002",
        date: "2024-12-20",
        diagnosis: "Hỗ trợ tâm lý chuyển đổi giới tính",
        medications: [
          {
            name: "Sertraline",
            dosage: "50mg",
            frequency: "1 lần/ngày",
            duration: "1 tháng",
            instructions: "Uống vào buổi sáng",
          },
        ],
        status: "pending",
        priority: "medium",
      },
    ],
    active: [
      {
        id: 3,
        patientName: "Lê Thị Hoa",
        patientId: "BN003",
        date: "2024-12-15",
        diagnosis: "Theo dõi hormone therapy",
        medications: [
          {
            name: "Testosterone",
            dosage: "50mg",
            frequency: "1 lần/tuần",
            duration: "6 tháng",
            instructions: "Tiêm bắp",
          },
        ],
        status: "active",
        priority: "high",
        nextFollowUp: "2024-12-25",
      },
      {
        id: 4,
        patientName: "Phạm Minh Tuấn",
        patientId: "BN004",
        date: "2024-12-10",
        diagnosis: "Hỗ trợ sau phẫu thuật",
        medications: [
          {
            name: "Progesterone",
            dosage: "200mg",
            frequency: "1 lần/ngày",
            duration: "2 tháng",
            instructions: "Uống trước khi ngủ",
          },
        ],
        status: "active",
        priority: "medium",
        nextFollowUp: "2024-12-22",
      },
    ],
    history: [
      {
        id: 5,
        patientName: "Hoàng Thị Lan",
        patientId: "BN005",
        date: "2024-11-20",
        diagnosis: "Điều trị hormone hoàn thành",
        medications: [
          {
            name: "Estradiol",
            dosage: "1mg",
            frequency: "1 lần/ngày",
            duration: "6 tháng",
            instructions: "Đã hoàn thành",
          },
        ],
        status: "completed",
        priority: "low",
        completedDate: "2024-12-18",
      },
    ],
  };

  const statistics = {
    totalPrescriptions: 156,
    activeTreatments: 23,
    completedTreatments: 98,
    pendingApproval: 5,
    mostPrescribed: [
      { name: "Estradiol", count: 45 },
      { name: "Testosterone", count: 32 },
      { name: "Spironolactone", count: 28 },
      { name: "Progesterone", count: 18 },
    ],
  };

  const handleMenuClick = (event, prescription) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrescription(prescription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPrescription(null);
  };

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setPrescriptionForm({
      patientId: prescription.patientId,
      patientName: prescription.patientName,
      medications: prescription.medications,
      diagnosis: prescription.diagnosis,
      notes: prescription.notes || "",
    });
    setOpenPrescriptionDialog(true);
    handleMenuClose();
  };

  const handleAddMedication = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medications: [
        ...prescriptionForm.medications,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...prescriptionForm.medications];
    updatedMedications[index][field] = value;
    setPrescriptionForm({
      ...prescriptionForm,
      medications: updatedMedications,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "active":
        return "success";
      case "completed":
        return "default";
      default:
        return "default";
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

  const renderPrescriptionsList = (prescriptionsList) => (
    <Grid container spacing={3}>
      {prescriptionsList.map((prescription) => (
        <Grid item xs={12} key={prescription.id}>
          <PrescriptionCard>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={prescription.priority !== "high"}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: `linear-gradient(45deg, ${getPriorityColor(
                          prescription.priority
                        )}, ${getPriorityColor(prescription.priority)}dd)`,
                        mr: 2,
                      }}
                    >
                      <PrescriptionIcon />
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      {prescription.patientName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      ID: {prescription.patientId} • {prescription.date}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={
                      prescription.status === "pending"
                        ? "Chờ duyệt"
                        : prescription.status === "active"
                        ? "Đang điều trị"
                        : "Hoàn thành"
                    }
                    color={getStatusColor(prescription.status)}
                    size="small"
                  />
                  <IconButton onClick={(e) => handleMenuClick(e, prescription)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#374151", mb: 2 }}
              >
                Chẩn đoán: {prescription.diagnosis}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}
                >
                  Đơn thuốc:
                </Typography>
                {prescription.medications.map((medication, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      mb: 1,
                      background: "rgba(16, 185, 129, 0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <MedicationIcon sx={{ color: "#10b981", mr: 1 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {medication.name} - {medication.dosage}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {medication.frequency} • {medication.duration} •{" "}
                        {medication.instructions}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {prescription.nextFollowUp && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <ScheduleIcon
                    sx={{ fontSize: 16, color: "#f59e0b", mr: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Tái khám: {prescription.nextFollowUp}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </PrescriptionCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderStatistics = () => (
    <Grid container spacing={3}>
      {/* Statistics Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#10b981", mb: 1 }}
          >
            {statistics.totalPrescriptions}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Tổng đơn thuốc
          </Typography>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#3b82f6", mb: 1 }}
          >
            {statistics.activeTreatments}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Đang điều trị
          </Typography>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#8b5cf6", mb: 1 }}
          >
            {statistics.completedTreatments}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Hoàn thành
          </Typography>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledPaper sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#f59e0b", mb: 1 }}
          >
            {statistics.pendingApproval}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Chờ duyệt
          </Typography>
        </StyledPaper>
      </Grid>

      {/* Most Prescribed Medications */}
      <Grid item xs={12}>
        <StyledPaper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
          >
            Thuốc được kê đơn nhiều nhất
          </Typography>
          <Grid container spacing={2}>
            {statistics.mostPrescribed.map((medication, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    borderRadius: 2,
                    background: "rgba(16, 185, 129, 0.02)",
                  }}
                >
                  <PharmacyIcon sx={{ color: "#10b981", mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {medication.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {medication.count} lần kê đơn
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );

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
            sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
          >
            Quản lý đơn thuốc
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Kê đơn thuốc và theo dõi điều trị cho bệnh nhân
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenPrescriptionDialog(true)}
          sx={{
            background: "linear-gradient(45deg, #10b981, #059669)",
            "&:hover": {
              background: "linear-gradient(45deg, #059669, #047857)",
            },
          }}
        >
          Tạo đơn thuốc mới
        </Button>
      </Box>

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
        {selectedTab === 0 && renderPrescriptionsList(prescriptions.pending)}
        {selectedTab === 1 && renderPrescriptionsList(prescriptions.active)}
        {selectedTab === 2 && renderPrescriptionsList(prescriptions.history)}
        {selectedTab === 3 && renderStatistics()}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditPrescription(selectedPrescription)}>
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PrintIcon sx={{ mr: 1 }} />
          In đơn thuốc
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SendIcon sx={{ mr: 1 }} />
          Gửi cho bệnh nhân
        </MenuItem>
      </Menu>

      {/* Prescription Dialog */}
      <Dialog
        open={openPrescriptionDialog}
        onClose={() => setOpenPrescriptionDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingPrescription ? "Chỉnh sửa đơn thuốc" : "Tạo đơn thuốc mới"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Bệnh nhân"
                value={prescriptionForm.patientId}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    patientId: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên bệnh nhân"
                value={prescriptionForm.patientName}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    patientName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chẩn đoán"
                value={prescriptionForm.diagnosis}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    diagnosis: e.target.value,
                  })
                }
              />
            </Grid>

            {/* Medications */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Đơn thuốc
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMedication}
                  sx={{ color: "#10b981" }}
                >
                  Thêm thuốc
                </Button>
              </Box>

              {prescriptionForm.medications.map((medication, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tên thuốc"
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Liều lượng"
                        value={medication.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Tần suất"
                        value={medication.frequency}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Thời gian điều trị"
                        value={medication.duration}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Hướng dẫn sử dụng"
                        value={medication.instructions}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "instructions",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú"
                value={prescriptionForm.notes}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    notes: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrescriptionDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #10b981, #059669)",
              "&:hover": {
                background: "linear-gradient(45deg, #059669, #047857)",
              },
            }}
          >
            {editingPrescription ? "Cập nhật" : "Tạo đơn thuốc"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionsContent;

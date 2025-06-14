/**
 * PatientsContent.js - Staff Patient Management
 *
 * Mục đích:
 * - Quản lý danh sách bệnh nhân
 * - Xem thông tin chi tiết bệnh nhân
 * - Medical theme với glass morphism design
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const PatientsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock data
  const patients = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      age: 35,
      gender: "Nam",
      phone: "0123456789",
      email: "a.nguyen@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      lastVisit: "2025-05-15",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      age: 28,
      gender: "Nữ",
      phone: "0987654321",
      email: "b.tran@email.com",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      lastVisit: "2025-05-20",
      status: "active",
    },
  ];

  const PatientCard = ({ patient }) => (
    <Card
      sx={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(74, 144, 226, 0.08)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            {patient.name[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#2D3748",
                mb: 0.5,
              }}
            >
              {patient.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mb: 1,
              }}
            >
              {patient.age} tuổi • {patient.gender}
            </Typography>
            <Chip
              label={patient.status === "active" ? "Đang điều trị" : "Ngừng"}
              size="small"
              sx={{
                background:
                  patient.status === "active" ? "#10B98120" : "#EF444420",
                color: patient.status === "active" ? "#10B981" : "#EF4444",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, color: "#64748B", mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {patient.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ fontSize: 16, color: "#64748B", mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {patient.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => {
              setSelectedPatient(patient);
              setDialogOpen(true);
            }}
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              color: "#fff",
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Xem chi tiết
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#2D3748",
            mb: 1,
          }}
        >
          Quản lý bệnh nhân
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748B",
          }}
        >
          Danh sách và thông tin chi tiết bệnh nhân
        </Typography>
      </Box>

      {/* Search */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.08)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <TextField
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#64748B" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} md={6} lg={4} key={patient.id}>
            <PatientCard patient={patient} />
          </Grid>
        ))}
      </Grid>

      {/* Patient Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết bệnh nhân</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
                        width: 100,
                        height: 100,
                        mx: "auto",
                        mb: 2,
                        fontSize: 40,
                      }}
                    >
                      {selectedPatient.name[0]}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {selectedPatient.name}
                    </Typography>
                    <Chip
                      label={
                        selectedPatient.status === "active"
                          ? "Đang điều trị"
                          : "Ngừng"
                      }
                      sx={{
                        background:
                          selectedPatient.status === "active"
                            ? "#10B98120"
                            : "#EF444420",
                        color:
                          selectedPatient.status === "active"
                            ? "#10B981"
                            : "#EF4444",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Tuổi:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedPatient.age} tuổi
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Giới tính:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedPatient.gender}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Số điện thoại:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedPatient.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Email:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedPatient.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Địa chỉ:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedPatient.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Lần khám gần nhất:
                      </Typography>
                      <Typography variant="body1">
                        {selectedPatient.lastVisit}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsContent;

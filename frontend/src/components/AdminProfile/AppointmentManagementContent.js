/**
 * AppointmentManagementContent.js - Admin Appointment Management
 *
 * Trang quản lý lịch hẹn cho Admin
 */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import { Search as SearchIcon, Edit as EditIcon } from "@mui/icons-material";

const AppointmentManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data
  const appointments = [
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientAvatar: null,
      service: "Tư vấn chuyển đổi giới tính",
      consultant: "Dr. Trần Thị B",
      date: "2024-06-05",
      time: "09:00",
      status: "Đã xác nhận",
      phone: "0901234567",
    },
    {
      id: 2,
      patientName: "Lê Thị C",
      patientAvatar: null,
      service: "Kiểm tra sức khỏe",
      consultant: "Dr. Phạm Văn D",
      date: "2024-06-05",
      time: "14:30",
      status: "Chờ xác nhận",
      phone: "0907654321",
    },
    {
      id: 3,
      patientName: "Hoàng Văn E",
      patientAvatar: null,
      service: "Tư vấn tâm lý",
      consultant: "Dr. Nguyễn Thị F",
      date: "2024-06-06",
      time: "10:15",
      status: "Hoàn thành",
      phone: "0909876543",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return "success";
      case "Chờ xác nhận":
        return "warning";
      case "Hoàn thành":
        return "info";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#2D3748",
          fontWeight: 600,
        }}
      >
        Quản lý lịch hẹn
      </Typography>

      {/* Search and Filter */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Tìm kiếm bệnh nhân hoặc dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: "300px" }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "#718096", mr: 1 }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                <MenuItem value="Đã hủy">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
        }}
      >
        <TableContainer component={Paper} sx={{ background: "transparent" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Bệnh nhân
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Dịch vụ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Tư vấn viên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Thời gian
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={appointment.patientAvatar}
                        sx={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                        }}
                      >
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#2D3748" }}
                        >
                          {appointment.patientName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#718096" }}>
                          {appointment.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#2D3748" }}>
                      {appointment.service}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#2D3748" }}>
                      {appointment.consultant}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#2D3748", fontWeight: 500 }}
                      >
                        {appointment.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#718096" }}>
                        {appointment.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditAppointment(appointment)}
                      sx={{
                        color: "#4A90E2",
                        "&:hover": {
                          background: "rgba(74, 144, 226, 0.1)",
                        },
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ pt: 2 }}>
              <TextField
                label="Bệnh nhân"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.patientName}
                disabled
              />
              <TextField
                label="Dịch vụ"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.service}
              />
              <TextField
                label="Tư vấn viên"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.consultant}
              />
              <TextField
                label="Ngày"
                type="date"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.date}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Giờ"
                type="time"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.time}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  defaultValue={selectedAppointment.status}
                  label="Trạng thái"
                >
                  <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                  <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                  <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            }}
            onClick={handleCloseDialog}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentManagementContent;

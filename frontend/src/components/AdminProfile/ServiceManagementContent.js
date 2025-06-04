/**
 * ServiceManagementContent.js - Admin Service Management
 *
 * Trang quản lý dịch vụ y tế cho Admin
 */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ServiceCard = ({ service, onEdit, onDelete, onToggleStatus }) => (
  <Card
    sx={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(74, 144, 226, 0.15)",
      borderRadius: 3,
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 20px 40px rgba(74, 144, 226, 0.15)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
          {service.name}
        </Typography>
        <Chip
          label={service.status}
          color={service.status === "Hoạt động" ? "success" : "default"}
          size="small"
        />
      </Box>

      <Typography variant="body2" sx={{ color: "#718096", mb: 2 }}>
        {service.description}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#2D3748", fontWeight: 500 }}>
          Giá: {service.price}
        </Typography>
        <Typography variant="body2" sx={{ color: "#718096" }}>
          Thời gian: {service.duration}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={service.status === "Hoạt động"}
              onChange={() => onToggleStatus(service.id)}
              size="small"
            />
          }
          label={service.status}
        />
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(service)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(service.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ServiceManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Mock data
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Tư vấn chuyển đổi giới tính",
      description: "Tư vấn chuyên sâu về quá trình chuyển đổi giới tính",
      price: "500,000 VNĐ",
      duration: "60 phút",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Kiểm tra sức khỏe tổng quát",
      description: "Kiểm tra sức khỏe định kỳ cho người transgender",
      price: "800,000 VNĐ",
      duration: "90 phút",
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "Tư vấn tâm lý",
      description: "Hỗ trợ tâm lý trong quá trình chuyển đổi",
      price: "400,000 VNĐ",
      duration: "45 phút",
      status: "Tạm dừng",
    },
  ]);

  const handleEdit = (service) => {
    setEditingService(service);
    setOpenDialog(true);
  };

  const handleDelete = (serviceId) => {
    setServices(services.filter((s) => s.id !== serviceId));
  };

  const handleToggleStatus = (serviceId) => {
    setServices(
      services.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              status: s.status === "Hoạt động" ? "Tạm dừng" : "Hoạt động",
            }
          : s
      )
    );
  };

  const handleAddNew = () => {
    setEditingService(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Quản lý dịch vụ
      </Typography>

      {/* Search and Add */}
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
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                borderRadius: 2,
                px: 3,
              }}
            >
              Thêm dịch vụ
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <ServiceCard
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Tên dịch vụ"
              fullWidth
              margin="normal"
              defaultValue={editingService?.name || ""}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              defaultValue={editingService?.description || ""}
            />
            <TextField
              label="Giá"
              fullWidth
              margin="normal"
              defaultValue={editingService?.price || ""}
            />
            <TextField
              label="Thời gian"
              fullWidth
              margin="normal"
              defaultValue={editingService?.duration || ""}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            }}
          >
            {editingService ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceManagementContent;

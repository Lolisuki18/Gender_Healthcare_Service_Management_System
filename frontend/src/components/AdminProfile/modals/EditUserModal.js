/**
 * EditUserModal.js - Modal chỉnh sửa thông tin người dùng
 *
 * Modal component để chỉnh sửa thông tin người dùng trong hệ thống
 */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Grid,
  Button,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const EditUserModal = ({ open, onClose, user, onSubmit }) => {
  // State cho form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    status: "",
    specialization: "", // Cho tư vấn viên
    experience: "", // Cho tư vấn viên
    certification: "", // Cho tư vấn viên
  });

  // Cập nhật form data khi user thay đổi
  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
        status: user.status || "",
        specialization: user.specialization || "",
        experience: user.experience || "",
        certification: user.certification || "",
      });
    }
  }, [user, open]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Số điện thoại phải có 10-11 chữ số!");
      return;
    }

    // Gọi callback function
    if (onSubmit) {
      onSubmit({ ...formData, id: user.id, role: user.role });
    }

    // Close modal
    onClose();
  };

  if (!user) return null;

  // Get modal title based on user type
  const getModalTitle = (userRole) => {
    switch (userRole) {
      case "Admin":
        return "Chỉnh sửa Quản trị viên";
      case "Staff":
        return "Chỉnh sửa Nhân viên";
      case "Customer":
        return "Chỉnh sửa Khách hàng";
      case "Consultant":
        return "Chỉnh sửa Tư vấn viên";
      default:
        return "Chỉnh sửa người dùng";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {getModalTitle(user.role)}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Thông tin cơ bản */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#2D3748", mb: 2 }}>
              Thông tin cơ bản
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Họ và tên"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="VD: 0901234567"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Giới tính</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Nữ"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Khác"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày sinh"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* Trạng thái */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ color: "#2D3748", mb: 2 }}>
              Trạng thái tài khoản
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                name="status"
                onChange={handleInputChange}
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Tạm khóa">Tạm khóa</MenuItem>
                <MenuItem value="Bị chặn">Bị chặn</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Thông tin chuyên môn cho Tư vấn viên */}
          {user.role === "Consultant" && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ color: "#2D3748", mb: 2 }}>
                  Thông tin chuyên môn
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chuyên khoa"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="VD: Sức khỏe sinh sản nữ"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số năm kinh nghiệm"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                  variant="outlined"
                  inputProps={{ min: 0, max: 50 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chứng chỉ / Bằng cấp"
                  name="certification"
                  value={formData.certification}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Mô tả các chứng chỉ, bằng cấp liên quan..."
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#E2E8F0",
            color: "#4A5568",
            "&:hover": {
              borderColor: "#CBD5E0",
              backgroundColor: "#F7FAFC",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            "&:hover": {
              background: "linear-gradient(45deg, #357ABD, #17A2B8)",
            },
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;

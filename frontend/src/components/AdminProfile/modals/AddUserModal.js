/**
 * AddUserModal.js - Modal thêm mới người dùng
 *
 * Modal component để thêm mới các loại người dùng trong hệ thống
 */
import React, { useState } from "react";
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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const AddUserModal = ({ open, onClose, userType = "all", onSubmit }) => {
  // State cho form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    specialization: "", // Cho tư vấn viên
    experience: "", // Cho tư vấn viên
    certification: "", // Cho tư vấn viên
  });

  // Reset form khi modal mở
  React.useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        specialization: "",
        experience: "",
        certification: "",
      });
    }
  }, [open]);

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
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
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
      onSubmit(formData, userType);
    }

    // Close modal
    onClose();
  };

  // Get modal title based on user type
  const getModalTitle = (userType) => {
    switch (userType) {
      case "Admin":
        return "Thêm Quản trị viên";
      case "Staff":
        return "Thêm Nhân viên";
      case "Customer":
        return "Thêm Khách hàng";
      case "Consultant":
        return "Thêm Tư vấn viên";
      default:
        return "Thêm người dùng mới";
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
          {getModalTitle(userType)}
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

          {/* Thông tin bảo mật */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ color: "#2D3748", mb: 2 }}>
              Thông tin bảo mật
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              helperText="Tối thiểu 6 ký tự"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* Thông tin chuyên môn cho Tư vấn viên */}
          {userType === "Consultant" && (
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
          {userType === "Consultant" ? "Thêm tư vấn viên" : "Thêm người dùng"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;

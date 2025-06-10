/**
 * AddUserModal.js - Modal thêm mới người dùng
 *
 * Modal component để thêm mới các loại người dùng trong hệ thống
 */
import React, { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";
import notify from "../../../utils/notification";
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
  MenuItem,
  Select,
  InputLabel,
  Box,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Work as WorkIcon,
  Assignment as RoleIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  AccountCircle as AccountIcon,
} from "@mui/icons-material";

const AddUserModal = ({ open, onClose, userType = "all", onSubmit }) => {
  // Initial form state - Updated theo backend requirements
  const initialFormData = {
    role: userType !== "all" ? userType : "",
    fullName: "", // Required
    email: "", // Required
    gender: "", // Required
    username: "", // Required (4-50 chars)
    password: "", // Required (6-100 chars + pattern)
    birthDay: "", // Optional (LocalDate)
    phone: "", // Optional
    address: "", // Optional
  };

  // State cho form data
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset form khi modal mở
  useEffect(() => {
    if (open) {
      setFormData({
        ...initialFormData,
        role: userType !== "all" ? userType : "",
      });
    }
  }, [open, userType]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Password visibility toggle
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate password strength
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@#$%^&+=]/.test(password);
    const isValidLength = password.length >= 6 && password.length <= 100;

    return {
      isValid:
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar &&
        isValidLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValidLength,
    };
  };

  // Handle form submit - CHỈ validate và trả data, KHÔNG gọi API
  const handleSubmit = async () => {
    // Required fields validation
    const requiredFields = [
      "role",
      "fullName",
      "email",
      "gender",
      "username",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      notify.warning(
        "Thông tin thiếu",
        `Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notify.error(
        "Email không hợp lệ",
        "Vui lòng nhập địa chỉ email đúng định dạng!"
      );
      return;
    }

    // Username validation (4-50 characters)
    if (formData.username.length < 4 || formData.username.length > 50) {
      notify.error("Username không hợp lệ", "Username phải có từ 4-50 ký tự!");
      return;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      let errorMessage = "Mật khẩu phải có:\n";
      if (!passwordValidation.isValidLength) errorMessage += "- 6-100 ký tự\n";
      if (!passwordValidation.hasUpperCase)
        errorMessage += "- Ít nhất 1 chữ hoa\n";
      if (!passwordValidation.hasLowerCase)
        errorMessage += "- Ít nhất 1 chữ thường\n";
      if (!passwordValidation.hasNumbers) errorMessage += "- Ít nhất 1 số\n";
      if (!passwordValidation.hasSpecialChar)
        errorMessage += "- Ít nhất 1 ký tự đặc biệt (@#$%^&+=)";

      notify.error("Mật khẩu không hợp lệ", errorMessage);
      return;
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.trim() !== "") {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone)) {
        notify.error(
          "Số điện thoại không hợp lệ",
          "Số điện thoại phải có 10-11 chữ số!"
        );
        return;
      }
    }

    // ✅ Tất cả validation pass - trả data về parent component
    console.log("Form validation passed, sending data to parent:", formData);

    // Prepare data for API
    const apiData = {
      ...formData,
      birthDay: formData.birthDay || null, // Send null if empty
    };

    // ✅ Gọi callback function với data đã validate
    if (onSubmit) {
      onSubmit(apiData, formData.role);
    }

    // ✅ Close modal
    onClose();
  };

  // Helper function để hiển thị tên role
  const getRoleDisplayName = (role) => {
    const roleMap = {
      Admin: "Quản trị viên",
      Staff: "Nhân viên",
      Customer: "Khách hàng",
      Consultant: "Tư vấn viên",
    };
    return roleMap[role] || "người dùng";
  };

  // Get modal title based on user type
  const getModalTitle = () => {
    if (userType !== "all") {
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
    }
    return "Thêm người dùng mới";
  };

  // Role options
  const roleOptions = [
    { value: "ADMIN", label: "Quản trị viên", color: "#E53E3E" },
    { value: "STAFF", label: "Nhân viên", color: "#3182CE" },
    { value: "CUSTOMER", label: "Khách hàng", color: "#38A169" },
    { value: "CONSULTANT", label: "Tư vấn viên", color: "#D69E2E" },
  ];

  // Password strength indicator
  const passwordValidation = validatePassword(formData.password);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background:
            "linear-gradient(180deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)",
          minHeight: "80vh",
          maxHeight: "90vh",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2.5,
          position: "sticky",
          top: 0,
          zIndex: 1,
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {getModalTitle()}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ p: 0, backgroundColor: "transparent" }}>
        <Box sx={{ p: 3 }}>
          {/* Role Selection Card */}
          {userType === "all" && (
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                border: "1px solid rgba(255,255,255,0.3)",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,255,0.9))",
                backdropFilter: "blur(20px)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
                    }}
                  >
                    <RoleIcon sx={{ color: "white", fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#1A202C",
                        fontWeight: 800,
                        fontSize: 28,
                        mb: 1,
                        background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Chọn vai trò
                    </Typography>
                    <Typography
                      sx={{
                        color: "#6B7280",
                        fontSize: 16,
                        fontWeight: 500,
                      }}
                    >
                      Lựa chọn vai trò phù hợp cho người dùng mới
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {roleOptions.map((option) => (
                    <Grid item xs={12} sm={6} md={3} key={option.value}>
                      <Box
                        onClick={() =>
                          handleInputChange({
                            target: { name: "role", value: option.value },
                          })
                        }
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          background:
                            formData.role === option.value
                              ? `linear-gradient(135deg, ${option.color}15, ${option.color}08)`
                              : "linear-gradient(135deg, rgba(248,250,255,0.8), rgba(240,247,255,0.6))",
                          border:
                            formData.role === option.value
                              ? `3px solid ${option.color}`
                              : "3px solid transparent",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.02)",
                            boxShadow: `0 20px 60px ${option.color}25`,
                            border: `3px solid ${option.color}60`,
                            background: `linear-gradient(135deg, ${option.color}20, ${option.color}10)`,
                          },
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${option.color}, ${option.color}CC)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 16px",
                              boxShadow: `0 12px 40px ${option.color}30`,
                              border: "4px solid white",
                            }}
                          >
                            <PersonIcon sx={{ color: "white", fontSize: 32 }} />
                          </Box>

                          <Typography
                            sx={{
                              fontSize: 18,
                              fontWeight: 800,
                              color:
                                formData.role === option.value
                                  ? option.color
                                  : "#2D3748",
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Basic Information Card */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(74, 144, 226, 0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,252,255,0.9))",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
                  }}
                >
                  <PersonIcon sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ color: "#4A90E2", fontWeight: 700, fontSize: 20 }}
                >
                  Thông tin cơ bản
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Full Name - Required */}
                <Grid item size={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Họ và tên "
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={!formData.fullName && formData.fullName !== ""}
                    helperText={
                      !formData.fullName && formData.fullName !== ""
                        ? "Họ và tên là bắt buộc"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Email - Required */}
                <Grid item size={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email "
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!formData.email && formData.email !== ""}
                    helperText={
                      !formData.email && formData.email !== ""
                        ? "Email là bắt buộc"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Username - Required (4-50 chars) */}
                <Grid item size={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Tên đăng nhập "
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={
                      formData.username.length > 0 &&
                      (formData.username.length < 4 ||
                        formData.username.length > 50)
                    }
                    helperText={
                      formData.username.length > 0 &&
                      (formData.username.length < 4 ||
                        formData.username.length > 50)
                        ? "Username phải có từ 4-50 ký tự"
                        : `${formData.username.length}/50 ký tự`
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountIcon sx={{ color: "#4A90E2" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Password - Required with pattern */}
                <Grid item size={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Mật khẩu "
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={
                      formData.password.length > 0 &&
                      !passwordValidation.isValid
                    }
                    helperText={
                      formData.password.length > 0 &&
                      !passwordValidation.isValid
                        ? "Mật khẩu phải có 6-100 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
                        : `${formData.password.length}/100 ký tự`
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#4A90E2" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{ color: "#4A90E2" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Gender - Required */}
                <Grid item size={12} md={6}>
                  <FormControl required fullWidth>
                    <InputLabel sx={{ fontSize: 16, fontWeight: 600 }}>
                      Giới tính
                    </InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      label="Giới tính *"
                      sx={{
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      }}
                    >
                      <MenuItem value="MALE">Nam</MenuItem>
                      <MenuItem value="FEMALE">Nữ</MenuItem>
                      <MenuItem value="OTHER">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Birth Day - Optional */}
                <Grid item size={6} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="birthDay"
                    type="date"
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Phone - Optional */}
                <Grid item size={6} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="VD: 0901234567"
                    error={
                      formData.phone.length > 0 &&
                      !/^[0-9]{10,11}$/.test(formData.phone)
                    }
                    helperText={
                      formData.phone.length > 0 &&
                      !/^[0-9]{10,11}$/.test(formData.phone)
                        ? "Số điện thoại phải có 10-11 chữ số"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Address - Optional */}
                <Grid item size={12} md={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                      color: "#374151",
                    }}
                  >
                    Độ mạnh mật khẩu:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: passwordValidation.isValidLength
                          ? "#10B981"
                          : "#EF4444",
                        color: "white",
                      }}
                    >
                      6-100 ký tự
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: passwordValidation.hasUpperCase
                          ? "#10B981"
                          : "#EF4444",
                        color: "white",
                      }}
                    >
                      Chữ hoa
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: passwordValidation.hasLowerCase
                          ? "#10B981"
                          : "#EF4444",
                        color: "white",
                      }}
                    >
                      Chữ thường
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: passwordValidation.hasNumbers
                          ? "#10B981"
                          : "#EF4444",
                        color: "white",
                      }}
                    >
                      Số
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: passwordValidation.hasSpecialChar
                          ? "#10B981"
                          : "#EF4444",
                        color: "white",
                      }}
                    >
                      Ký tự đặc biệt
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          p: 4,
          background:
            "linear-gradient(180deg, rgba(248,252,255,0.95), rgba(240,248,255,0.9))",
          borderTop: "1px solid rgba(74, 144, 226, 0.1)",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          boxShadow: "0 -4px 20px rgba(74, 144, 226, 0.05)",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#90a4ae",
            color: "#546e7a",
            minWidth: 140,
            height: 52,
            borderRadius: 3,
            px: 4,
            fontSize: 16,
            fontWeight: 600,
            "&:hover": {
              borderColor: "#4A90E2",
              backgroundColor: "rgba(74, 144, 226, 0.05)",
              transform: "translateY(-2px)",
              color: "#4A90E2",
              boxShadow: "0 8px 25px rgba(74, 144, 226, 0.15)",
            },
            transition: "all 0.3s ease",
          }}
        >
          HỦY BỎ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            color: "#fff",
            fontWeight: 600,
            minWidth: 200,
            height: 52,
            borderRadius: 3,
            px: 4,
            fontSize: 16,
            textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
            "&:hover": {
              background: "linear-gradient(45deg, #357ABD, #17A2B8)",
              transform: "translateY(-2px)",
              boxShadow: "0 15px 40px rgba(74, 144, 226, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isLoading ? "ĐANG TẠO..." : "➕ THÊM NGƯỜI DÙNG"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;

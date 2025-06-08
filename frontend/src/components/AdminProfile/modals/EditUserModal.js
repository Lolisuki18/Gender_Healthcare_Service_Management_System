/**
 * ==================================================================
 * EDIT USER MODAL COMPONENT
 * ==================================================================
 *
 * Chức năng: Modal chỉnh sửa thông tin người dùng với xác nhận thay đổi
 *
 * Tính năng chính:
 * ✅ Form chỉnh sửa thông tin cơ bản (tên, email, phone, etc.)
 * ✅ Form chỉnh sửa trạng thái tài khoản
 * ✅ Form chỉnh sửa vai trò người dùng
 * ✅ Phát hiện và hiển thị các thay đổi trước khi lưu
 * ✅ Dialog xác nhận thay đổi với giao diện đẹp
 * ✅ Validation dữ liệu đầu vào
 * ✅ Cảnh báo khi thoát với thay đổi chưa lưu
 *
 * Props:
 * - open: boolean - Trạng thái mở/đóng modal
 * - onClose: function - Callback khi đóng modal
 * - user: object - Thông tin người dùng cần chỉnh sửa
 * - onSubmit: function - Callback khi submit thành công
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
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Work as WorkIcon,
  CompareArrows as CompareIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const EditUserModal = ({ open, onClose, user, onSubmit }) => {
  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================

  /**
   * Form data state - Chứa tất cả thông tin form
   * Cập nhật theo cấu trúc API mới
   */
  const [formData, setFormData] = useState({
    // Thông tin cơ bản
    fullName: "", // Họ và tên (bắt buộc)
    username: "", // Tên đăng nhập
    email: "", // Email (bắt buộc)
    phone: "", // Số điện thoại
    role: "", // Vai trò
    isActive: true, // Trạng thái tài khoản (boolean)
  });

  /**
   * Change confirmation states
   */
  const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // ====================================================================
  // EFFECTS & DATA INITIALIZATION
  // ====================================================================

  /**
   * Effect: Khởi tạo dữ liệu form khi user hoặc modal thay đổi
   */
  useEffect(() => {
    if (user && open) {
      // Chuẩn bị dữ liệu từ user object theo API structure
      const userData = {
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
      };

      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user, open]);

  // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================

  /**
   * Phát hiện và trả về danh sách các thay đổi
   */
  const getChanges = () => {
    const changes = [];

    // Mapping field names sang labels tiếng Việt
    const fieldLabels = {
      fullName: "Họ và tên",
      username: "Tên đăng nhập",
      email: "Email",
      phone: "Số điện thoại",
      role: "Vai trò",
      isActive: "Trạng thái",
    };

    // Duyệt qua tất cả fields và tìm thay đổi
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        let oldValue = originalData[key];
        let newValue = formData[key];

        // Format display cho boolean values
        if (key === "isActive") {
          oldValue = oldValue ? "Hoạt động" : "Tạm khóa";
          newValue = newValue ? "Hoạt động" : "Tạm khóa";
        }

        // Format display cho role
        if (key === "role") {
          oldValue = getRoleDisplayName(oldValue);
          newValue = getRoleDisplayName(newValue);
        }

        changes.push({
          field: key,
          label: fieldLabels[key],
          oldValue: oldValue || "(Trống)",
          newValue: newValue || "(Trống)",
        });
      }
    });

    return changes;
  };

  /**
   * Get modal title dựa trên role của user
   */
  const getModalTitle = (userRole) => {
    const titles = {
      ADMIN: "Chỉnh sửa Quản trị viên",
      STAFF: "Chỉnh sửa Nhân viên",
      CUSTOMER: "Chỉnh sửa Khách hàng",
      CONSULTANT: "Chỉnh sửa Tư vấn viên",
    };
    return titles[userRole] || "Chỉnh sửa người dùng";
  };

  /**
   * Get role display name
   */
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "STAFF":
        return "Nhân viên";
      case "CUSTOMER":
        return "Khách hàng";
      case "CONSULTANT":
        return "Tư vấn viên";
      default:
        return role;
    }
  };

  // ====================================================================
  // EVENT HANDLERS
  // ====================================================================

  /**
   * Xử lý thay đổi input trong form
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Xử lý đặc biệt cho isActive
    if (name === "isActive") {
      processedValue = value === "true";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  /**
   * Xử lý submit form - Validation và hiển thị xác nhận
   */
  const handleSubmit = () => {
    // === VALIDATION ===

    // Kiểm tra các trường bắt buộc
    if (!formData.fullName && !formData.username) {
      alert("Vui lòng điền họ tên hoặc tên đăng nhập!");
      return;
    }

    if (!formData.email) {
      alert("Vui lòng điền email!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // Validate phone format (nếu có)
    if (formData.phone) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert("Số điện thoại phải có 10-11 chữ số!");
        return;
      }
    }

    // === KIỂM TRA THAY ĐỔI ===
    const changes = getChanges();
    if (changes.length === 0) {
      alert("Không có thay đổi nào để lưu.");
      return;
    }

    // === HIỂN THỊ XÁC NHẬN ===
    setShowChangeConfirmation(true);
  };

  /**
   * Xác nhận và thực hiện lưu thay đổi
   */
  const handleConfirmChanges = () => {
    if (onSubmit) {
      // Gửi dữ liệu kèm theo id của user
      onSubmit({
        ...formData,
        id: user.id,
      });
    }

    // Đóng tất cả modal
    setShowChangeConfirmation(false);
    onClose();
  };

  /**
   * Xử lý đóng modal với cảnh báo thay đổi chưa lưu
   */
  const handleClose = () => {
    const changes = getChanges();

    // Nếu có thay đổi chưa lưu, hiển thị cảnh báo
    if (changes.length > 0) {
      const confirmLeave = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát?"
      );
      if (!confirmLeave) return;
    }

    // Đóng tất cả modal
    setShowChangeConfirmation(false);
    onClose();
  };

  // ====================================================================
  // RENDER GUARDS
  // ====================================================================

  if (!user) return null;

  // ====================================================================
  // RENDER MAIN COMPONENT
  // ====================================================================

  return (
    <>
      {/* ============================================================== */}
      {/* MAIN EDIT DIALOG - Form chỉnh sửa chính */}
      {/* ============================================================== */}
      <Dialog
        open={open && !showChangeConfirmation}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background:
              "linear-gradient(180deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)",
            minHeight: "70vh",
            maxHeight: "90vh",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Dialog Header - Tiêu đề và nút đóng */}
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5,
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
          }}
        >
          {/* Icon và tiêu đề */}
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {getModalTitle(user.role)}
            </Typography>
          </Box>

          {/* Nút đóng */}
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </DialogTitle>

        {/* Dialog Content - Nội dung form */}
        <DialogContent sx={{ p: 0, backgroundColor: "transparent" }}>
          <Box sx={{ p: 3 }}>
            {/* ====================================================== */}
            {/* BASIC INFORMATION CARD - Thông tin cơ bản */}
            {/* ====================================================== */}
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
                {/* Card Header */}
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
                    variant="h6"
                    sx={{ color: "#4A90E2", fontWeight: 700, fontSize: 20 }}
                  >
                    Thông tin cơ bản
                  </Typography>
                </Box>

                {/* Form Fields Grid */}
                <Grid container spacing={3}>
                  {/* Họ và tên */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                          border: "2px solid transparent",
                          "&:hover": {
                            borderColor: "#4A90E2",
                            backgroundColor: "rgba(248,252,255,0.95)",
                          },
                          "&.Mui-focused": {
                            borderColor: "#4A90E2",
                            backgroundColor: "rgba(248,252,255,1)",
                            boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#546e7a",
                          "&.Mui-focused": {
                            color: "#4A90E2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Tên đăng nhập */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tên đăng nhập"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#546e7a",
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#546e7a",
                        },
                      }}
                    />
                  </Grid>

                  {/* Số điện thoại */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      variant="outlined"
                      placeholder="VD: 0901234567"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 500,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ====================================================== */}
            {/* ROLE & STATUS CARD - Vai trò & Trạng thái */}
            {/* ====================================================== */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(26, 188, 156, 0.08)",
                border: "1px solid rgba(255,255,255,0.5)",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,255,248,0.9))",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Card Header */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #1ABC9C, #16a085)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(26, 188, 156, 0.25)",
                    }}
                  >
                    <SecurityIcon sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1ABC9C", fontWeight: 700, fontSize: 20 }}
                  >
                    Vai trò & Trạng thái
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Vai trò */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ fontSize: 16, fontWeight: 500 }}>
                        Vai trò
                      </InputLabel>
                      <Select
                        value={formData.role}
                        label="Vai trò"
                        name="role"
                        onChange={handleInputChange}
                        sx={{
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,255,248,0.8)",
                        }}
                      >
                        <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                        <MenuItem value="STAFF">Nhân viên</MenuItem>
                        <MenuItem value="CONSULTANT">Tư vấn viên</MenuItem>
                        <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Trạng thái */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ fontSize: 16, fontWeight: 500 }}>
                        Trạng thái
                      </InputLabel>
                      <Select
                        value={formData.isActive.toString()}
                        label="Trạng thái"
                        name="isActive"
                        onChange={handleInputChange}
                        sx={{
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,255,248,0.8)",
                        }}
                      >
                        <MenuItem value="true">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: "#4caf50",
                                boxShadow: "0 0 12px rgba(76, 175, 80, 0.5)",
                              }}
                            />
                            <Typography
                              sx={{ color: "#2e7d32", fontWeight: 600 }}
                            >
                              Hoạt động
                            </Typography>
                          </Box>
                        </MenuItem>

                        <MenuItem value="false">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: "#f44336",
                                boxShadow: "0 0 12px rgba(244, 67, 54, 0.5)",
                              }}
                            />
                            <Typography
                              sx={{ color: "#d32f2f", fontWeight: 600 }}
                            >
                              Tạm khóa
                            </Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        {/* Dialog Actions - Nút Hủy và Lưu */}
        <DialogActions
          sx={{
            p: 4,
            background:
              "linear-gradient(180deg, rgba(248,252,255,0.95), rgba(240,248,255,0.9))",
            borderTop: "1px solid rgba(74, 144, 226, 0.1)",
            boxShadow: "0 -4px 20px rgba(74, 144, 226, 0.05)",
          }}
        >
          {/* Nút Hủy bỏ */}
          <Button
            onClick={handleClose}
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
            Hủy bỏ
          </Button>

          {/* Nút Lưu thay đổi */}
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              color: "#fff",
              fontWeight: 600,
              minWidth: 180,
              height: 52,
              borderRadius: 3,
              px: 4,
              fontSize: 16,
              boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
              "&:hover": {
                background: "linear-gradient(45deg, #357ABD, #17A2B8)",
                transform: "translateY(-2px)",
                boxShadow: "0 15px 40px rgba(74, 144, 226, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            💾 Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* CHANGE CONFIRMATION DIALOG - Dialog xác nhận thay đổi */}
      {/* ============================================================== */}
      <Dialog
        open={showChangeConfirmation}
        onClose={() => setShowChangeConfirmation(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {/* Confirmation Dialog Header */}
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 3,
            fontWeight: 700,
          }}
        >
          <CompareIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Xác nhận thay đổi
          </Typography>
        </DialogTitle>

        {/* Confirmation Dialog Content */}
        <DialogContent sx={{ p: 4 }}>
          {/* Thông tin user đang chỉnh sửa */}
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#2D3748", fontWeight: 600 }}
          >
            Bạn đang thay đổi thông tin của người dùng:{" "}
            <strong>{user?.fullName || user?.username}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "#4A5568" }}>
            Dưới đây là danh sách các thay đổi sẽ được áp dụng:
          </Typography>

          {/* Danh sách các thay đổi */}
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(74, 144, 226, 0.15)",
              background: "linear-gradient(145deg, #f8faff, #f0f7ff)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <List>
                {getChanges().map((change, index) => (
                  <ListItem
                    key={change.field}
                    sx={{
                      borderBottom:
                        index < getChanges().length - 1
                          ? "1px solid rgba(74, 144, 226, 0.1)"
                          : "none",
                      py: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: "#2D3748", mb: 1 }}
                        >
                          {change.label}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Giá trị cũ */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#718096", fontWeight: 500 }}
                            >
                              Cũ:
                            </Typography>
                            <Chip
                              label={change.oldValue}
                              size="small"
                              sx={{
                                backgroundColor: "#FEF2F2",
                                color: "#DC2626",
                                fontWeight: 500,
                                border: "1px solid #FECACA",
                              }}
                            />
                          </Box>

                          {/* Icon so sánh */}
                          <CompareIcon
                            sx={{ color: "#4A90E2", fontSize: 20 }}
                          />

                          {/* Giá trị mới */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#718096", fontWeight: 500 }}
                            >
                              Mới:
                            </Typography>
                            <Chip
                              label={change.newValue}
                              size="small"
                              sx={{
                                backgroundColor: "#ECFDF5",
                                color: "#059669",
                                fontWeight: 500,
                                border: "1px solid #BBF7D0",
                              }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Cảnh báo quan trọng */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(45deg, #FFF3CD, #FCF4A3)",
              border: "1px solid #F59E0B",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#92400E",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              ⚠️ <strong>Lưu ý:</strong> Sau khi xác nhận, các thay đổi này sẽ
              được lưu vào hệ thống và không thể hoàn tác.
            </Typography>
          </Box>
        </DialogContent>

        {/* Confirmation Dialog Actions */}
        <DialogActions sx={{ p: 4, gap: 2 }}>
          {/* Nút Hủy bỏ xác nhận */}
          <Button
            onClick={() => setShowChangeConfirmation(false)}
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
                borderColor: "#f44336",
                backgroundColor: "rgba(244, 67, 54, 0.05)",
                color: "#f44336",
              },
              transition: "all 0.3s ease",
            }}
          >
            ❌ Hủy bỏ
          </Button>

          {/* Nút Xác nhận thay đổi */}
          <Button
            onClick={handleConfirmChanges}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #4CAF50, #45A049)",
              color: "#fff",
              fontWeight: 600,
              minWidth: 180,
              height: 52,
              borderRadius: 3,
              px: 4,
              fontSize: 16,
              boxShadow: "0 2px 8px rgba(76, 175, 80, 0.25)",
              "&:hover": {
                background: "linear-gradient(45deg, #45A049, #388E3C)",
                transform: "translateY(-2px)",
                boxShadow: "0 15px 40px rgba(76, 175, 80, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CheckIcon sx={{ mr: 1 }} /> Xác nhận thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditUserModal;

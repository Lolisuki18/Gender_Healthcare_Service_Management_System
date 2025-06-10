/**
 * ==================================================================
 * EDIT USER MODAL COMPONENT - VERSION 2.0
 * ==================================================================
 *
 * Cập nhật: Tách riêng API calls cho thông tin cơ bản và vai trò/trạng thái
 *
 * Props:
 * - open: boolean - Trạng thái mở/đóng modal
 * - onClose: function - Callback khi đóng modal
 * - user: object - Thông tin người dùng cần chỉnh sửa
 * - onSubmitBasicInfo: function - Callback cho API cập nhật thông tin cơ bản
 * - onSubmitRole: function - Callback cho API cập nhật vai trò & trạng thái
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
  FormControl,
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
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  CompareArrows as CompareIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const EditUserModal = ({
  open,
  onClose,
  user,
  onSubmitBasicInfo,
  onSubmitRole,
}) => {
  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================

  /**
   * Tab management
   */
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Form data states - Tách riêng cho 2 loại thông tin
   */
  const [basicFormData, setBasicFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
  });

  const [roleFormData, setRoleFormData] = useState({
    role: "",
    isActive: true,
  });

  /**
   * Original data để so sánh thay đổi
   */
  const [originalBasicData, setOriginalBasicData] = useState({});
  const [originalRoleData, setOriginalRoleData] = useState({});

  /**
   * Confirmation dialog states
   */
  const [showBasicConfirmation, setShowBasicConfirmation] = useState(false);
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);

  // ====================================================================
  // EFFECTS & DATA INITIALIZATION
  // ====================================================================

  /**
   * Effect: Khởi tạo dữ liệu khi user hoặc modal thay đổi
   */
  useEffect(() => {
    if (user && open) {
      // Tách dữ liệu thông tin cơ bản
      const basicData = {
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      };

      // Tách dữ liệu vai trò & trạng thái
      const roleData = {
        role: user.role || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
      };

      setBasicFormData(basicData);
      setRoleFormData(roleData);
      setOriginalBasicData(basicData);
      setOriginalRoleData(roleData);
    }
  }, [user, open]);

  // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================

  /**
   * Phát hiện thay đổi thông tin cơ bản
   */
  const getBasicChanges = () => {
    const changes = [];
    const fieldLabels = {
      fullName: "Họ và tên",
      username: "Tên đăng nhập",
      email: "Email",
      phone: "Số điện thoại",
    };

    Object.keys(basicFormData).forEach((key) => {
      if (basicFormData[key] !== originalBasicData[key]) {
        changes.push({
          field: key,
          label: fieldLabels[key],
          oldValue: originalBasicData[key] || "(Trống)",
          newValue: basicFormData[key] || "(Trống)",
        });
      }
    });

    return changes;
  };

  /**
   * Phát hiện thay đổi vai trò & trạng thái
   */
  const getRoleChanges = () => {
    const changes = [];
    const fieldLabels = {
      role: "Vai trò",
      isActive: "Trạng thái",
    };

    Object.keys(roleFormData).forEach((key) => {
      if (roleFormData[key] !== originalRoleData[key]) {
        let oldValue = originalRoleData[key];
        let newValue = roleFormData[key];

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
   * Get role display name
   */
  const getRoleDisplayName = (role) => {
    const roleNames = {
      ADMIN: "Quản trị viên",
      STAFF: "Nhân viên",
      CUSTOMER: "Khách hàng",
      CONSULTANT: "Tư vấn viên",
    };
    return roleNames[role] || role;
  };

  // ====================================================================
  // EVENT HANDLERS
  // ====================================================================

  /**
   * Xử lý thay đổi tab
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Xử lý thay đổi thông tin cơ bản
   */
  const handleBasicInputChange = (e) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Xử lý thay đổi vai trò & trạng thái
   */
  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "isActive") {
      processedValue = value === "true";
    }

    setRoleFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  /**
   * Validate thông tin cơ bản
   */
  const validateBasicInfo = () => {
    if (!basicFormData.fullName && !basicFormData.username) {
      alert("Vui lòng điền họ tên hoặc tên đăng nhập!");
      return false;
    }

    if (!basicFormData.email) {
      alert("Vui lòng điền email!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(basicFormData.email)) {
      alert("Email không hợp lệ!");
      return false;
    }

    if (basicFormData.phone) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(basicFormData.phone)) {
        alert("Số điện thoại phải có 10-11 chữ số!");
        return false;
      }
    }

    return true;
  };

  /**
   * Submit thông tin cơ bản
   */
  const handleSubmitBasicInfo = () => {
    if (!validateBasicInfo()) return;

    const changes = getBasicChanges();
    if (changes.length === 0) {
      alert("Không có thay đổi nào để lưu.");
      return;
    }

    setShowBasicConfirmation(true);
  };

  /**
   * Submit vai trò & trạng thái
   */
  const handleSubmitRole = () => {
    const changes = getRoleChanges();
    if (changes.length === 0) {
      alert("Không có thay đổi nào để lưu.");
      return;
    }

    setShowRoleConfirmation(true);
  };

  /**
   * Xác nhận cập nhật thông tin cơ bản
   */
  const handleConfirmBasicChanges = () => {
    if (onSubmitBasicInfo) {
      onSubmitBasicInfo({
        ...basicFormData,
        id: user.id,
      });
    }
    setShowBasicConfirmation(false);
    onClose();
  };

  /**
   * Xác nhận cập nhật vai trò & trạng thái
   */
  const handleConfirmRoleChanges = () => {
    if (onSubmitRole) {
      onSubmitRole({
        ...roleFormData,
        id: user.id,
      });
    }
    setShowRoleConfirmation(false);
    onClose();
  };

  /**
   * Xử lý đóng modal
   */
  const handleClose = () => {
    const basicChanges = getBasicChanges();
    const roleChanges = getRoleChanges();

    if (basicChanges.length > 0 || roleChanges.length > 0) {
      const confirmLeave = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát?"
      );
      if (!confirmLeave) return;
    }

    setShowBasicConfirmation(false);
    setShowRoleConfirmation(false);
    setActiveTab(0);
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
      {/* MAIN EDIT DIALOG */}
      {/* ============================================================== */}
      <Dialog
        open={open && !showBasicConfirmation && !showRoleConfirmation}
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
        {/* Dialog Header */}
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
              Chỉnh sửa thông tin người dùng
            </Typography>
          </Box>

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

        {/* User Info Banner */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background:
              "linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))",
            borderBottom: "1px solid rgba(74, 144, 226, 0.2)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
            Đang chỉnh sửa: <strong>{user?.fullName || user?.username}</strong>
            <Chip
              label={getRoleDisplayName(user?.role)}
              size="small"
              sx={{
                ml: 2,
                backgroundColor: "rgba(74, 144, 226, 0.1)",
                color: "#4A90E2",
                fontWeight: 600,
              }}
            />
          </Typography>
        </Box>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 1 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab
              label="Thông tin cơ bản"
              icon={<PersonIcon />}
              iconPosition="start"
              sx={{
                fontWeight: 600,
                minHeight: 64,
                "&.Mui-selected": {
                  color: "#4A90E2",
                },
              }}
            />
            <Tab
              label="Vai trò & Trạng thái"
              icon={<SecurityIcon />}
              iconPosition="start"
              sx={{
                fontWeight: 600,
                minHeight: 64,
                "&.Mui-selected": {
                  color: "#1ABC9C",
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Dialog Content */}
        <DialogContent sx={{ p: 0, backgroundColor: "transparent" }}>
          <Box sx={{ p: 3 }}>
            {/* ====================================================== */}
            {/* TAB 1: BASIC INFORMATION */}
            {/* ====================================================== */}
            {activeTab === 0 && (
              <Card
                sx={{
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mb: 4,
                    }}
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
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "#4A90E2", fontWeight: 700, fontSize: 20 }}
                      >
                        Thông tin cơ bản
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#718096", mt: 0.5 }}
                      >
                        Cập nhật thông tin cá nhân của người dùng
                      </Typography>
                    </Box>
                  </Box>

                  {/* Info Notice */}
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #E3F2FD, #F0F8FF)",
                      border: "1px solid #2196F3",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1565C0",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 18 }} />
                      <strong>Thông tin:</strong> Chưa cập nhập API, nên chưa
                      test được, sẽ thêm và cập nhật sau
                    </Typography>
                  </Box>

                  {/* Form Fields */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        name="fullName"
                        value={basicFormData.fullName}
                        onChange={handleBasicInputChange}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            height: 56,
                            backgroundColor: "rgba(248,252,255,0.8)",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tên đăng nhập"
                        name="username"
                        value={basicFormData.username}
                        onChange={handleBasicInputChange}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            height: 56,
                            backgroundColor: "rgba(248,252,255,0.8)",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={basicFormData.email}
                        onChange={handleBasicInputChange}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            height: 56,
                            backgroundColor: "rgba(248,252,255,0.8)",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={basicFormData.phone}
                        onChange={handleBasicInputChange}
                        variant="outlined"
                        placeholder="VD: 0901234567"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            height: 56,
                            backgroundColor: "rgba(248,252,255,0.8)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* ====================================================== */}
            {/* TAB 2: ROLE & STATUS */}
            {/* ====================================================== */}
            {activeTab === 1 && (
              <Card
                sx={{
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mb: 4,
                    }}
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
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "#1ABC9C", fontWeight: 700, fontSize: 20 }}
                      >
                        Vai trò & Trạng thái
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#718096", mt: 0.5 }}
                      >
                        Quản lý quyền hạn và trạng thái tài khoản
                      </Typography>
                    </Box>
                  </Box>

                  {/* Warning Notice */}
                  <Box
                    sx={{
                      mb: 4,
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
                      <WarningIcon sx={{ fontSize: 18 }} />
                      <strong>Cảnh báo:</strong> Thay đổi vai trò hoặc trạng
                      thái sẽ ảnh hưởng đến quyền truy cập của tài khoản này
                    </Typography>
                  </Box>

                  {/* Form Fields */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ fontSize: 16, fontWeight: 500 }}>
                          Vai trò
                        </InputLabel>
                        <Select
                          value={roleFormData.role}
                          label="Vai trò"
                          name="role"
                          onChange={handleRoleInputChange}
                          sx={{
                            borderRadius: 3,
                            height: 56,
                            backgroundColor: "rgba(248,255,248,0.8)",
                          }}
                        >
                          <MenuItem value="ADMIN">🔐 Quản trị viên</MenuItem>
                          <MenuItem value="STAFF">👔 Nhân viên</MenuItem>
                          <MenuItem value="CONSULTANT">🩺 Tư vấn viên</MenuItem>
                          <MenuItem value="CUSTOMER">👤 Khách hàng</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ fontSize: 16, fontWeight: 500 }}>
                          Trạng thái
                        </InputLabel>
                        <Select
                          value={roleFormData.isActive.toString()}
                          label="Trạng thái"
                          name="isActive"
                          onChange={handleRoleInputChange}
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
            )}
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions
          sx={{
            p: 4,
            background:
              "linear-gradient(180deg, rgba(248,252,255,0.95), rgba(240,248,255,0.9))",
            borderTop: "1px solid rgba(74, 144, 226, 0.1)",
            boxShadow: "0 -4px 20px rgba(74, 144, 226, 0.05)",
          }}
        >
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
                color: "#4A90E2",
              },
              transition: "all 0.3s ease",
            }}
          >
            Hủy bỏ
          </Button>

          {/* Conditional Submit Button based on active tab */}
          {activeTab === 0 && (
            <Button
              onClick={handleSubmitBasicInfo}
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                color: "#fff",
                fontWeight: 600,
                minWidth: 220,
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
              💾 Cập nhật thông tin cơ bản
            </Button>
          )}

          {activeTab === 1 && (
            <Button
              onClick={handleSubmitRole}
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(45deg, #1ABC9C, #16a085)",
                color: "#fff",
                fontWeight: 600,
                minWidth: 220,
                height: 52,
                borderRadius: 3,
                px: 4,
                fontSize: 16,
                boxShadow: "0 2px 8px rgba(26, 188, 156, 0.25)",
                "&:hover": {
                  background: "linear-gradient(45deg, #16a085, #138d75)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 40px rgba(26, 188, 156, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              🔐 Cập nhật vai trò & trạng thái
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* BASIC INFO CONFIRMATION DIALOG */}
      {/* ============================================================== */}
      <Dialog
        open={showBasicConfirmation}
        onClose={() => setShowBasicConfirmation(false)}
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
          <PersonIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Xác nhận cập nhật thông tin cơ bản
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#2D3748", fontWeight: 600 }}
          >
            Thông tin cơ bản của:{" "}
            <strong>{user?.fullName || user?.username}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "#4A5568" }}>
            Những thay đổi sau sẽ được gửi đến API cập nhật thông tin cơ bản:
          </Typography>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(74, 144, 226, 0.15)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <List>
                {getBasicChanges().map((change, index) => (
                  <ListItem
                    key={change.field}
                    sx={{
                      borderBottom:
                        index < getBasicChanges().length - 1
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
                          <Chip
                            label={change.oldValue}
                            size="small"
                            sx={{
                              backgroundColor: "#FEF2F2",
                              color: "#DC2626",
                              fontWeight: 500,
                            }}
                          />
                          <CompareIcon
                            sx={{ color: "#4A90E2", fontSize: 20 }}
                          />
                          <Chip
                            label={change.newValue}
                            size="small"
                            sx={{
                              backgroundColor: "#ECFDF5",
                              color: "#059669",
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={() => setShowBasicConfirmation(false)}
            variant="outlined"
            size="large"
            sx={{ minWidth: 140, height: 52, borderRadius: 3 }}
          >
            ❌ Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmBasicChanges}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #4CAF50, #45A049)",
              minWidth: 200,
              height: 52,
              borderRadius: 3,
            }}
          >
            <CheckIcon sx={{ mr: 1 }} /> Xác nhận cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* ROLE CONFIRMATION DIALOG */}
      {/* ============================================================== */}
      <Dialog
        open={showRoleConfirmation}
        onClose={() => setShowRoleConfirmation(false)}
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
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1ABC9C, #16a085)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 3,
            fontWeight: 700,
          }}
        >
          <SecurityIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Xác nhận cập nhật vai trò & trạng thái
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#2D3748", fontWeight: 600 }}
          >
            Vai trò & trạng thái của:{" "}
            <strong>{user?.fullName || user?.username}</strong>
          </Typography>

          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(45deg, #FFE4B5, #FFF8DC)",
              border: "1px solid #F0A500",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#B8860B",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              ⚠️ <strong>Cảnh báo:</strong> Những thay đổi này sẽ được gửi đến
              API riêng và có thể ảnh hưởng đến quyền truy cập!
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: "#4A5568" }}>
            Những thay đổi sau sẽ được gửi đến API cập nhật vai trò & trạng
            thái:
          </Typography>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(26, 188, 156, 0.15)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <List>
                {getRoleChanges().map((change, index) => (
                  <ListItem
                    key={change.field}
                    sx={{
                      borderBottom:
                        index < getRoleChanges().length - 1
                          ? "1px solid rgba(26, 188, 156, 0.1)"
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
                          <Chip
                            label={change.oldValue}
                            size="small"
                            sx={{
                              backgroundColor: "#FEF2F2",
                              color: "#DC2626",
                              fontWeight: 500,
                            }}
                          />
                          <CompareIcon
                            sx={{ color: "#1ABC9C", fontSize: 20 }}
                          />
                          <Chip
                            label={change.newValue}
                            size="small"
                            sx={{
                              backgroundColor: "#ECFDF5",
                              color: "#059669",
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={() => setShowRoleConfirmation(false)}
            variant="outlined"
            size="large"
            sx={{ minWidth: 140, height: 52, borderRadius: 3 }}
          >
            ❌ Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmRoleChanges}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #1ABC9C, #16a085)",
              minWidth: 200,
              height: 52,
              borderRadius: 3,
            }}
          >
            <CheckIcon sx={{ mr: 1 }} /> Xác nhận cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditUserModal;

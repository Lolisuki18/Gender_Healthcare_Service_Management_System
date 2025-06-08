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
  Box,
  Card,
  CardContent,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

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
            {getModalTitle(user.role)}
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
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: "transparent" }}>
        <Box sx={{ p: 3 }}>
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
                  variant="h6"
                  sx={{
                    color: "#4A90E2",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  Thông tin cơ bản
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
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

                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 1 }}>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: 16,
                        mb: 2,
                        display: "block",
                      }}
                    >
                      Giới tính
                    </FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      sx={{
                        gap: 3,
                        "& .MuiFormControlLabel-label": {
                          fontSize: 16,
                          fontWeight: 500,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="male"
                        control={
                          <Radio
                            sx={{
                              color: "#4A90E2",
                              "&.Mui-checked": {
                                color: "#4A90E2",
                              },
                            }}
                          />
                        }
                        label="Nam"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio sx={{ color: "#4A90E2" }} />}
                        label="Nữ"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio sx={{ color: "#4A90E2" }} />}
                        label="Khác"
                      />
                    </RadioGroup>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
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

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
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
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Account Status Card */}
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
                  sx={{
                    color: "#1ABC9C",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  Trạng thái tài khoản
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      sx={{
                        fontSize: 16,
                        fontWeight: 500,
                      }}
                    >
                      Trạng thái
                    </InputLabel>
                    <Select
                      value={formData.status}
                      label="Trạng thái"
                      name="status"
                      onChange={handleInputChange}
                      sx={{
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,255,248,0.8)",
                        border: "2px solid transparent",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1ABC9C",
                        },
                        "&.Mui-focused": {
                          borderColor: "#1ABC9C",
                          backgroundColor: "rgba(248,255,248,1)",
                          boxShadow: "0 0 0 3px rgba(26, 188, 156, 0.1)",
                        },
                      }}
                    >
                      <MenuItem value="Hoạt động">
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
                              animation: "pulse 2s ease-in-out infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.7 },
                              },
                            }}
                          />
                          <Typography
                            sx={{ color: "#2e7d32", fontWeight: 600 }}
                          >
                            Hoạt động
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="Tạm khóa">
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
                              backgroundColor: "#ff9800",
                              boxShadow: "0 0 12px rgba(255, 152, 0, 0.5)",
                            }}
                          />
                          <Typography
                            sx={{ color: "#f57c00", fontWeight: 600 }}
                          >
                            Tạm khóa
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="Bị chặn">
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
                            Bị chặn
                          </Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Professional Information Card - Only for Consultant */}
          {user.role === "Consultant" && (
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(74, 144, 226, 0.08)",
                border: "1px solid rgba(255,255,255,0.5)",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(252,248,255,0.9))",
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
                      background: "linear-gradient(45deg, #8e44ad, #9b59b6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(142, 68, 173, 0.25)",
                    }}
                  >
                    <WorkIcon sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#8e44ad",
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    Thông tin chuyên môn
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Chuyên khoa"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      variant="outlined"
                      placeholder="VD: Sức khỏe sinh sản nữ"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                          border: "2px solid transparent",
                          "&:hover": {
                            borderColor: "#8e44ad",
                            backgroundColor: "rgba(252,248,255,0.95)",
                          },
                          "&.Mui-focused": {
                            borderColor: "#8e44ad",
                            backgroundColor: "rgba(252,248,255,1)",
                            boxShadow: "0 0 0 3px rgba(142, 68, 173, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8e44ad",
                          },
                        },
                      }}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                          border: "2px solid transparent",
                          "&:hover": {
                            borderColor: "#8e44ad",
                            backgroundColor: "rgba(252,248,255,0.95)",
                          },
                          "&.Mui-focused": {
                            borderColor: "#8e44ad",
                            backgroundColor: "rgba(252,248,255,1)",
                            boxShadow: "0 0 0 3px rgba(142, 68, 173, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#8e44ad",
                          },
                        },
                      }}
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
                      rows={4}
                      placeholder="Mô tả các chứng chỉ, bằng cấp liên quan..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
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
          )}
        </Box>
      </DialogContent>

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
          Hủy bỏ
        </Button>
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
  );
};

export default EditUserModal;

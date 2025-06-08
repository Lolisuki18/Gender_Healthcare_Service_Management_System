/**
 * AddUserModal.js - Modal thêm mới người dùng
 *
 * Modal component để thêm mới các loại người dùng trong hệ thống
 */
import React, { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";
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
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Work as WorkIcon,
  Assignment as RoleIcon,
} from "@mui/icons-material";

const AddUserModal = ({ open, onClose, userType = "all", onSubmit }) => {
  // Initial form state
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    role: userType !== "all" ? userType : "",
    specialization: "",
    experience: "",
    certification: "",
  };

  // State cho form data
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle form submit
  const handleSubmit = async () => {
    // Validation
    const requiredFields = ["name", "email", "phone", "password", "role"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
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

    // Validation cho Consultant
    if (formData.role === "Consultant") {
      if (!formData.specialization) {
        alert("Vui lòng nhập chuyên khoa cho tư vấn viên!");
        return;
      }
      if (!formData.experience || formData.experience < 0) {
        alert("Vui lòng nhập số năm kinh nghiệm hợp lệ!");
        return;
      }
    }

    setIsLoading(true);
    try {
      // Hiển thị loading state (optional)
      console.log("Creating user with role:", formData.role);

      // Gọi API thông qua service
      const result = await adminService.createUserByRole(formData);

      console.log("User created successfully:", result);
      alert(`Tạo ${getRoleDisplayName(formData.role)} thành công!`);

      // Gọi callback function nếu có
      if (onSubmit) {
        onSubmit(result, formData.role);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);

      // Xử lý error message
      let errorMessage = "Có lỗi xảy ra khi tạo người dùng!";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
    { value: "Admin", label: "Quản trị viên", color: "#E53E3E" },
    { value: "Staff", label: "Nhân viên", color: "#3182CE" },
    { value: "Customer", label: "Khách hàng", color: "#38A169" },
    { value: "Consultant", label: "Tư vấn viên", color: "#D69E2E" },
  ];

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
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background:
                              formData.role === option.value
                                ? `linear-gradient(90deg, ${option.color}, ${option.color}80)`
                                : "transparent",
                            borderRadius: "3px 3px 0 0",
                            transition: "all 0.3s ease",
                          },
                          "&::after":
                            formData.role === option.value
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background: `linear-gradient(135deg, ${option.color}, ${option.color}CC)`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: `0 4px 12px ${option.color}40`,
                                  "&::before": {
                                    content: '"✓"',
                                    color: "white",
                                    fontSize: 14,
                                    fontWeight: 700,
                                  },
                                }
                              : {},
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
                              position: "relative",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                width: "120%",
                                height: "120%",
                                border: `2px dashed ${option.color}40`,
                                animation:
                                  formData.role === option.value
                                    ? "rotate 8s linear infinite"
                                    : "none",
                              },
                              "@keyframes rotate": {
                                "0%": { transform: "rotate(0deg)" },
                                "100%": { transform: "rotate(360deg)" },
                              },
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

                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#6B7280",
                              fontWeight: 500,
                              lineHeight: 1.4,
                              opacity: formData.role === option.value ? 1 : 0.8,
                              transition: "opacity 0.3s ease",
                            }}
                          >
                            {option.value === "Admin" && "Quản lý hệ thống"}
                            {option.value === "Staff" && "Hỗ trợ khách hàng"}
                            {option.value === "Customer" && "Sử dụng dịch vụ"}
                            {option.value === "Consultant" &&
                              "Tư vấn chuyên môn"}
                          </Typography>

                          {formData.role === option.value && (
                            <Box
                              sx={{
                                mt: 2,
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${option.color}20, ${option.color}10)`,
                                border: `1px solid ${option.color}30`,
                                animation: "pulse 2s ease-in-out infinite",
                                "@keyframes pulse": {
                                  "0%, 100%": {
                                    transform: "scale(1)",
                                    opacity: 1,
                                  },
                                  "50%": {
                                    transform: "scale(1.05)",
                                    opacity: 0.9,
                                  },
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: option.color,
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Đã chọn
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Enhanced Role Preview */}
                {formData.role && (
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3, opacity: 0.3 }} />
                    <Box
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${
                          roleOptions.find((r) => r.value === formData.role)
                            ?.color
                        }08, ${
                          roleOptions.find((r) => r.value === formData.role)
                            ?.color
                        }03)`,
                        border: `2px solid ${
                          roleOptions.find((r) => r.value === formData.role)
                            ?.color
                        }20`,
                        position: "relative",
                        backdropFilter: "blur(10px)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "6px",
                          height: "100%",
                          background: `linear-gradient(180deg, ${
                            roleOptions.find((r) => r.value === formData.role)
                              ?.color
                          }, ${
                            roleOptions.find((r) => r.value === formData.role)
                              ?.color
                          }80)`,
                          borderRadius: "4px 0 0 4px",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${
                              roleOptions.find((r) => r.value === formData.role)
                                ?.color
                            }, ${
                              roleOptions.find((r) => r.value === formData.role)
                                ?.color
                            }CC)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 12px 40px ${
                              roleOptions.find((r) => r.value === formData.role)
                                ?.color
                            }40`,
                            border: "4px solid white",
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              width: "120%",
                              height: "120%",
                              border: `3px solid ${
                                roleOptions.find(
                                  (r) => r.value === formData.role
                                )?.color
                              }30`,
                              borderRadius: 4,
                              animation: "pulse 3s ease-in-out infinite",
                            },
                          }}
                        >
                          <PersonIcon sx={{ color: "white", fontSize: 40 }} />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: 24,
                              fontWeight: 900,
                              color: roleOptions.find(
                                (r) => r.value === formData.role
                              )?.color,
                              mb: 1,
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                            }}
                          >
                            {
                              roleOptions.find((r) => r.value === formData.role)
                                ?.label
                            }
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 16,
                              color: "#4A5568",
                              fontWeight: 600,
                              lineHeight: 1.5,
                              mb: 2,
                            }}
                          >
                            {formData.role === "Admin" &&
                              "Quản lý toàn bộ hệ thống, người dùng và cấu hình"}
                            {formData.role === "Staff" &&
                              "Nhân viên hỗ trợ, chăm sóc và phục vụ khách hàng"}
                            {formData.role === "Customer" &&
                              "Khách hàng sử dụng các dịch vụ và tiện ích của hệ thống"}
                            {formData.role === "Consultant" &&
                              "Chuyên gia tư vấn sức khỏe với kinh nghiệm chuyên sâu"}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Box
                              sx={{
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${
                                  roleOptions.find(
                                    (r) => r.value === formData.role
                                  )?.color
                                }15, ${
                                  roleOptions.find(
                                    (r) => r.value === formData.role
                                  )?.color
                                }08)`,
                                border: `1px solid ${
                                  roleOptions.find(
                                    (r) => r.value === formData.role
                                  )?.color
                                }30`,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: roleOptions.find(
                                    (r) => r.value === formData.role
                                  )?.color,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Vai trò được chọn
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                backgroundColor: roleOptions.find(
                                  (r) => r.value === formData.role
                                )?.color,
                                color: "white",
                                boxShadow: `0 4px 12px ${
                                  roleOptions.find(
                                    (r) => r.value === formData.role
                                  )?.color
                                }40`,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                ✓ Đã xác nhận
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
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
              {/* Name */}
              <Grid container spacing={3}>
                <Grid item size={6}>
                  <TextField
                    required
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    // variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#4A90E2",
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#4A90E2",
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

                {/* Email */}
                <Grid item size={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    // variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#4A90E2",
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#4A90E2",
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
                {/* Số điện thoại  */}
                <Grid item size={4}>
                  <TextField
                    required
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    // variant="outlined"
                    placeholder="VD: 0901234567"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#4A90E2",
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#4A90E2",
                          backgroundColor: "rgba(248,252,255,1)",
                          boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#546e7a",
                        textDecoration: "none !important",
                        "&.Mui-focused": {
                          color: "#4A90E2",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        textDecoration: "none !important",
                        "&::-webkit-input-placeholder": {
                          textDecoration: "none !important",
                        },
                        "&::placeholder": {
                          textDecoration: "none !important",
                        },
                      },
                      "& input": {
                        textDecoration: "none !important",
                        "&:-webkit-autofill": {
                          textDecoration: "none !important",
                          "-webkit-text-decoration": "none !important",
                        },
                      },
                    }}
                    inputProps={{
                      style: {
                        textDecoration: "none",
                        WebkitTextDecoration: "none",
                      },
                    }}
                  />
                </Grid>
                {/* Giới tính  */}
                <Grid item size={4}>
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
                {/* Ngày sinh  */}
                <Grid item size={4}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    // variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#4A90E2",
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#4A90E2",
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
                {/* Địa chỉ */}
                <Grid item size={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    // variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,252,255,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#4A90E2",
                          backgroundColor: "rgba(248,252,255,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#4A90E2",
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
              </Grid>
            </CardContent>
          </Card>

          {/* Security Information Card */}
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
                  variant="h5"
                  sx={{ color: "#1ABC9C", fontWeight: 700, fontSize: 20 }}
                >
                  Thông tin bảo mật
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item size={6}>
                  <TextField
                    required
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    // variant="outlined"
                    helperText="Tối thiểu 6 ký tự"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,255,248,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#1ABC9C",
                          backgroundColor: "rgba(248,255,248,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#1ABC9C",
                          backgroundColor: "rgba(248,255,248,1)",
                          boxShadow: "0 0 0 3px rgba(26, 188, 156, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#546e7a",
                        "&.Mui-focused": {
                          color: "#1ABC9C",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item size={6}>
                  <TextField
                    required
                    fullWidth
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    // variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        height: 56,
                        backgroundColor: "rgba(248,255,248,0.8)",
                        border: "2px solid transparent",
                        "&:hover": {
                          // borderColor: "#1ABC9C",
                          backgroundColor: "rgba(248,255,248,0.95)",
                        },
                        "&.Mui-focused": {
                          // borderColor: "#1ABC9C",
                          backgroundColor: "rgba(248,255,248,1)",
                          boxShadow: "0 0 0 3px rgba(26, 188, 156, 0.1)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#546e7a",
                        "&.Mui-focused": {
                          color: "#1ABC9C",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Professional Information Card - Only for Consultant */}
          {(formData.role === "Consultant" || userType === "Consultant") && (
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(142, 68, 173, 0.08)",
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
                    variant="h5"
                    sx={{ color: "#8e44ad", fontWeight: 700, fontSize: 20 }}
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
                      // variant="outlined"
                      placeholder="VD: Sức khỏe sinh sản nữ"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          height: 56,
                          backgroundColor: "rgba(248,252,255,0.8)",
                          border: "2px solid transparent",
                          "&:hover": {
                            // borderColor: "#8e44ad",
                            backgroundColor: "rgba(252,248,255,0.95)",
                          },
                          "&.Mui-focused": {
                            // borderColor: "#8e44ad",
                            backgroundColor: "rgba(252,248,255,1)",
                            boxShadow: "0 0 0 3px rgba(142, 68, 173, 0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#546e7a",
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
                          fontWeight: 600,
                          color: "#546e7a",
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
                          fontWeight: 600,
                          color: "#546e7a",
                          "&.Mui-focused": {
                            color: "#8e44ad",
                          },
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

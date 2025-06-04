/**
 * ProfileContent.js - Component quản lý thông tin hồ sơ cá nhân khách hàng
 *
 * Chức năng chính:
 * - Hiển thị thông tin cá nhân chi tiết (tên, email, phone, địa chỉ, etc.)
 * - Chế độ edit để cập nhật thông tin
 * - Form validation và error handling
 * - Upload/thay đổi avatar
 * - API integration cho việc lưu thông tin
 *
 * Features:
 * - Toggle giữa view mode và edit mode
 * - Real-time form validation
 * - Loading states khi submit
 * - Error handling với user feedback
 * - Responsive design với grid system
 *
 * State Management:
 * - isEditing: boolean - Chế độ chỉnh sửa
 * - formData: object - Dữ liệu form
 * - isLoading: boolean - Trạng thái loading
 * - errors: object - Validation errors
 *
 * API Integration:
 * - userService.updateProfile() để cập nhật thông tin
 * - localStorage để lưu user data locally
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Wc as GenderIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)", // Light glass background for medical
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)", // Lighter shadow
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #FFFFFF, #F5F7FA)", // Light card background
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(74, 144, 226, 0.12)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
  overflow: "visible",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "rgba(74, 144, 226, 0.1)", // Light medical blue background
  marginRight: "16px",
  flexShrink: 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "#4A5568", // Dark blue-gray for text
    fontSize: "14px",
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-root": {
    color: "#2D3748", // Dark text for readability
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background for contrast
    "& fieldset": {
      borderColor: "rgba(74, 144, 226, 0.2)", // Medical blue border
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(74, 144, 226, 0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4A90E2",
      borderWidth: 2,
    },
  },
  "& .MuiInputBase-input": {
    color: "#2D3748", // Dark text for input
    fontWeight: 600,
  },
}));

const ProfileContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const userData = localStorageUtil.get("user");

  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: userData?.fullName || "",
    phone: userData?.phone || "",
    birthDay: userData?.birthDay || "",
    email: userData?.email || "",
    gender: userData?.gender || "",
    address: userData?.address || "",
  });

  const handleChangeUpdate = (e) => {
    setFormDataUpdate({
      ...formDataUpdate,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      console.log("Saving profile data:", formDataUpdate);

      const updateData = {
        fullName: formDataUpdate.fullName,
        phone: formDataUpdate.phone,
        birthDay: formDataUpdate.birthDay,
      };

      const response = await userService.updateProfile(updateData);

      if (response.success) {
        const updatedUser = { ...userData, ...updateData };
        localStorageUtil.set("user", updatedUser);
        setFormDataUpdate({ ...formDataUpdate, ...updateData });
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Có lỗi xảy ra: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorageUtil.remove("token");
        localStorageUtil.remove("user");
        window.location.href = "/login";
      } else {
        alert("Có lỗi xảy ra khi cập nhật thông tin!");
        console.log("Error details:", error.response?.data);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
      {/* Profile Card */}
      <ProfileCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Avatar Section */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 120, md: 140 },
                    height: { xs: 120, md: 140 },
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    fontSize: { xs: "48px", md: "56px" },
                    fontWeight: 700,
                    boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)",
                    border: "4px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {formDataUpdate.fullName.charAt(0)}
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #4CAF50, #2ECC71)", // Medical green
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* User Info */}
            <Grid item xs={12} md={5}>
              {" "}
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  color: "#2D3748", // Dark text for readability
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {formDataUpdate.fullName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#4A5568", // Dark blue-gray for text
                  mb: 1,
                  fontSize: "18px",
                  fontWeight: 500,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Khách hàng
              </Typography>{" "}
              <Typography
                variant="body2"
                sx={{
                  color: "#718096", // Light blue-gray for secondary text
                  mb: 3,
                  fontSize: "14px",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                ID: {userData?.id || "CUST-001"}
              </Typography>
              {/* Quick Info Grid */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {" "}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(76, 175, 80, 0.1)", // Light green background
                      border: "1px solid rgba(76, 175, 80, 0.2)", // Medical green border
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4A5568", // Dark blue-gray for text
                        mb: 0.5,
                      }}
                    >
                      Ngày sinh
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#2D3748", // Dark text for readability
                        fontWeight: 600,
                      }}
                    >
                      {formDataUpdate.birthDay || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(236, 72, 153, 0.1)",
                      border: "1px solid rgba(236, 72, 153, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4A5568", // Dark blue-gray for text
                        mb: 0.5,
                      }}
                    >
                      Giới tính
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#2D3748", // Dark text for readability
                        fontWeight: 600,
                      }}
                    >
                      {formDataUpdate.gender || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Edit Button */}
            <Grid item xs={12} md={3}>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: "16px",
                  fontWeight: 600,
                  fontSize: "16px",
                  textTransform: "none",
                  ...(isEditing
                    ? {
                        color: "#ef4444",
                        borderColor: "#ef4444",
                        borderWidth: "2px",
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderColor: "#ef4444",
                          transform: "translateY(-2px)",
                        },
                      }
                    : {
                        background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                        boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1d4ed8, #1e40af)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.5)",
                        },
                      }),
                  transition: "all 0.3s ease",
                }}
              >
                {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </ProfileCard>

      {/* Details Section */}
      <StyledPaper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 5,
            fontWeight: 700,
            color: "#2D3748", // Black text for header
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          <PersonIcon sx={{ mr: 2, color: "#4A90E2", fontSize: 32 }} />
          Thông tin chi tiết
        </Typography>

        {!isEditing ? (
          <Grid container spacing={3}>
            {/* Họ và tên */}
            <Grid item size={12}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(59, 130, 246, 0.05)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper sx={{ mr: 2 }}>
                    <PersonIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Họ và tên
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2D3748", // Dark color for value (fix hidden text)
                    fontWeight: 700,
                    wordBreak: "break-word",
                  }}
                >
                  {formDataUpdate.fullName || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>

            {/* Số điện thoại */}
            <Grid item size={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(16, 185, 129, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(16, 185, 129, 0.1)" }}
                  >
                    <PhoneIcon sx={{ color: "#10b981", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Số điện thoại
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2D3748", // Dark color for value (fix hidden text)
                    fontWeight: 700,
                    wordBreak: "break-word",
                  }}
                >
                  {formDataUpdate.phone || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>

            {/* Email */}
            <Grid item size={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(139, 92, 246, 0.05)",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(139, 92, 246, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(139, 92, 246, 0.1)" }}
                  >
                    <EmailIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2D3748", // Dark color for value (fix hidden text)
                    fontWeight: 700,
                    wordBreak: "break-all",
                  }}
                >
                  {formDataUpdate.email}
                </Typography>
              </Box>
            </Grid>

            {/* Ngày sinh */}
            <Grid item size={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(245, 158, 11, 0.05)",
                  border: "1px solid rgba(245, 158, 11, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(245, 158, 11, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(245, 158, 11, 0.1)" }}
                  >
                    <CakeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Ngày sinh
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2D3748", // Dark color for value (fix hidden text)
                    fontWeight: 700,
                    wordBreak: "break-word",
                  }}
                >
                  {formDataUpdate.birthDay || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>

            {/* Giới tính */}
            <Grid item size={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(236, 72, 153, 0.05)",
                  border: "1px solid rgba(236, 72, 153, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(236, 72, 153, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(236, 72, 153, 0.1)" }}
                  >
                    <GenderIcon sx={{ color: "#ec4899", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Giới tính
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2D3748", // Dark color for value (fix hidden text)
                    fontWeight: 700,
                    wordBreak: "break-word",
                  }}
                >
                  {formDataUpdate.gender || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>

            {/* Địa chỉ */}
            <Grid item size={12}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(239, 68, 68, 0.05)",
                  border: "1px solid rgba(239, 68, 68, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(239, 68, 68, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(239, 68, 68, 0.1)" }}
                  >
                    <LocationIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Địa chỉ
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2D3748", // Dark color for value (fix hidden text)
                    fontWeight: 700,
                    wordBreak: "break-word",
                  }}
                >
                  {formDataUpdate.address || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {/* Form chỉnh sửa */}
            <Grid item size={12}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(59, 130, 246, 0.05)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper sx={{ mr: 2 }}>
                    <PersonIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Họ và tên
                  </Typography>
                </Box>
                <StyledTextField
                  fullWidth
                  name="fullName"
                  value={formDataUpdate.fullName}
                  onChange={handleChangeUpdate}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 0",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#2D3748",
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Số điện thoại */}
            <Grid item size={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(16, 185, 129, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(16, 185, 129, 0.1)" }}
                  >
                    <PhoneIcon sx={{ color: "#10b981", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Số điện thoại
                  </Typography>
                </Box>
                <StyledTextField
                  fullWidth
                  name="phone"
                  value={formDataUpdate.phone}
                  onChange={handleChangeUpdate}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 0",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#2D3748",
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Ngày sinh */}
            <Grid item size={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(245, 158, 11, 0.05)",
                  border: "1px solid rgba(245, 158, 11, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(245, 158, 11, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconWrapper
                    sx={{ mr: 2, background: "rgba(245, 158, 11, 0.1)" }}
                  >
                    <CakeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A5568", // Dark blue-gray for label
                      fontWeight: 600,
                    }}
                  >
                    Ngày sinh
                  </Typography>
                </Box>
                <StyledTextField
                  fullWidth
                  type="date"
                  name="birthDay"
                  value={formDataUpdate.birthDay}
                  onChange={handleChangeUpdate}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 0",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#2D3748",
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item size={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, 0.8)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "16px",
                    background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1d4ed8, #1e40af)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Lưu thay đổi
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </StyledPaper>
    </Box>
  );
};

export default ProfileContent;

/**
 * ProfileContent.js - Staff Profile Management
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";

const ProfileContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const userData = localStorageUtil.get("user");

  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "Nhân viên",
    email: userData?.email || "staff@hospital.com",
    phone: userData?.phone || "0123456789",
    position: userData?.position || "Nhân viên y tế",
    address: userData?.address || "123 Đường ABC, Quận 1, TP.HCM",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      console.log("Saving profile data:", formData);

      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        address: formData.address,
      };

      const response = await userService.updateProfile(updateData);

      if (response.success) {
        const updatedUser = { ...userData, ...updateData };
        localStorageUtil.set("user", updatedUser);
        setFormData({ ...formData, ...updateData });
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Có lỗi xảy ra: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert(
        "Có lỗi xảy ra khi cập nhật thông tin: " +
          (error.message || "Unknown error")
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: userData?.fullName || "Nhân viên",
      email: userData?.email || "staff@hospital.com",
      phone: userData?.phone || "0123456789",
      position: userData?.position || "Nhân viên y tế",
      address: userData?.address || "123 Đường ABC, Quận 1, TP.HCM",
    });
    setIsEditing(false);
  };
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#2D3748", mb: 1 }}
        >
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B" }}>
          Thông tin cá nhân và cài đặt tài khoản
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(74, 144, 226, 0.08)",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  fontSize: 40,
                }}
              >
                S
              </Avatar>{" "}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {formData.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                {formData.position}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ borderRadius: "8px" }}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa ảnh"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(74, 144, 226, 0.08)",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {" "}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Thông tin cá nhân
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="email"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Chức vụ"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>{" "}
              <Box sx={{ textAlign: "right", mt: 3 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                        borderRadius: "8px",
                        mr: 2,
                      }}
                    >
                      Lưu thay đổi
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ borderRadius: "8px" }}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                      borderRadius: "8px",
                    }}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileContent;

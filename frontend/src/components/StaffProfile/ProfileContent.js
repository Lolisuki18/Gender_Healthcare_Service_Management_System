/**
 * ProfileContent.js - Staff Profile Management
 */

import React from "react";
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

const ProfileContent = () => {
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
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Nhân viên
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                Nhân viên y tế
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ borderRadius: "8px" }}
              >
                Chỉnh sửa ảnh
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
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Thông tin cá nhân
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Họ và tên"
                    defaultValue="Nhân viên"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    defaultValue="staff@hospital.com"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Số điện thoại"
                    defaultValue="0123456789"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Chức vụ"
                    defaultValue="Nhân viên y tế"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Địa chỉ"
                    defaultValue="123 Đường ABC, Quận 1, TP.HCM"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ textAlign: "right", mt: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                    borderRadius: "8px",
                    mr: 2,
                  }}
                >
                  Lưu thay đổi
                </Button>
                <Button variant="outlined" sx={{ borderRadius: "8px" }}>
                  Hủy
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileContent;

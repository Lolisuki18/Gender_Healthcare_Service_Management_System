/**
 * SettingsContent.js - Staff Settings Management
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";

const SettingsContent = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      appointments: true,
      reminders: true,
    },
    preferences: {
      language: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      theme: "light",
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
  });

  const handleSwitchChange = (category, setting) => (event) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: event.target.checked,
      },
    }));
  };

  const handleSelectChange = (category, setting) => (event) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: event.target.value,
      },
    }));
  };

  const SettingsSection = ({ title, icon: Icon, children }) => (
    <Card
      sx={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(74, 144, 226, 0.08)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Icon sx={{ color: "#4A90E2", mr: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#2D3748" }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#2D3748", mb: 1 }}
        >
          Cài đặt
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B" }}>
          Quản lý tùy chọn và cài đặt tài khoản
        </Typography>
      </Box>

      {/* Notifications Settings */}
      <SettingsSection title="Thông báo" icon={NotificationsIcon}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={handleSwitchChange("notifications", "email")}
                  color="primary"
                />
              }
              label="Thông báo qua email"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.push}
                  onChange={handleSwitchChange("notifications", "push")}
                  color="primary"
                />
              }
              label="Thông báo đẩy"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.sms}
                  onChange={handleSwitchChange("notifications", "sms")}
                  color="primary"
                />
              }
              label="Thông báo SMS"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.appointments}
                  onChange={handleSwitchChange("notifications", "appointments")}
                  color="primary"
                />
              }
              label="Thông báo lịch hẹn"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.reminders}
                  onChange={handleSwitchChange("notifications", "reminders")}
                  color="primary"
                />
              }
              label="Nhắc nhở"
            />
          </Grid>
        </Grid>
      </SettingsSection>

      {/* Appearance Settings */}
      <SettingsSection title="Giao diện" icon={PaletteIcon}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Ngôn ngữ</InputLabel>
              <Select
                value={settings.preferences.language}
                onChange={handleSelectChange("preferences", "language")}
                label="Ngôn ngữ"
              >
                <MenuItem value="vi">Tiếng Việt</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Múi giờ</InputLabel>
              <Select
                value={settings.preferences.timezone}
                onChange={handleSelectChange("preferences", "timezone")}
                label="Múi giờ"
              >
                <MenuItem value="Asia/Ho_Chi_Minh">GMT+7 (Việt Nam)</MenuItem>
                <MenuItem value="Asia/Tokyo">GMT+9 (Nhật Bản)</MenuItem>
                <MenuItem value="America/New_York">GMT-5 (New York)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Chủ đề</InputLabel>
              <Select
                value={settings.preferences.theme}
                onChange={handleSelectChange("preferences", "theme")}
                label="Chủ đề"
              >
                <MenuItem value="light">Sáng</MenuItem>
                <MenuItem value="dark">Tối</MenuItem>
                <MenuItem value="auto">Tự động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection title="Bảo mật" icon={SecurityIcon}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.twoFactor}
                  onChange={handleSwitchChange("security", "twoFactor")}
                  color="primary"
                />
              }
              label="Xác thực hai yếu tố"
            />
            <Typography
              variant="body2"
              sx={{ color: "#64748B", ml: 4, mt: 0.5 }}
            >
              Tăng cường bảo mật cho tài khoản của bạn
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.loginAlerts}
                  onChange={handleSwitchChange("security", "loginAlerts")}
                  color="primary"
                />
              }
              label="Cảnh báo đăng nhập"
            />
            <Typography
              variant="body2"
              sx={{ color: "#64748B", ml: 4, mt: 0.5 }}
            >
              Nhận thông báo khi có đăng nhập từ thiết bị mới
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: "8px" }}
            >
              Đổi mật khẩu
            </Button>
          </Grid>
        </Grid>
      </SettingsSection>

      {/* Save Button */}
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            borderRadius: "8px",
            px: 4,
            py: 1.5,
          }}
        >
          Lưu cài đặt
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsContent;

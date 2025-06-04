/**
 * SettingsContent.js - Component cài đặt tài khoản
 *
 * Chức năng:
 * - Account preferences settings
 * - Privacy và security settings
 * - Notification preferences
 * - Language và timezone settings
 * - Password change functionality
 *
 * Features:
 * - Tabbed settings interface
 * - Toggle switches cho preferences
 * - Form validation
 * - Security settings management
 * - Data export/import options
 */

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
  Lock as PasswordIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)", // Light glass background for medical
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)", // Lighter shadow
}));

const SettingCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #FFFFFF, #F5F7FA)", // Light card background
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(74, 144, 226, 0.12)", // Medical blue border
  color: "#2D3748", // Dark text for readability
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px 0 rgba(74, 144, 226, 0.2)", // Medical blue shadow
  },
}));

const SettingsContent = () => {
  const [settings, setSettings] = React.useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointment: true,
      reminder: true,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      contactInfo: false,
      activityStatus: true,
    },
    preferences: {
      language: "vi",
      theme: "dark",
      autoSave: true,
    },
  });

  const handleNotificationChange = (key) => (event) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: event.target.checked,
      },
    }));
  };

  const handlePrivacyChange = (key) => (event) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: event.target.checked,
      },
    }));
  };

  const handlePreferenceChange = (key) => (event) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: event.target.checked,
      },
    }));
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      {" "}
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: "#2D3748",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SettingsIcon sx={{ color: "#8b5cf6", fontSize: 36, mr: 2 }} />
        Cài đặt tài khoản
      </Typography>
      <Typography variant="body1" sx={{ color: "#4A5568", mb: 4, ml: 6 }}>
        Quản lý các tuỳ chọn, quyền riêng tư và thông báo tài khoản của bạn.
      </Typography>
      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                {" "}
                <NotificationsIcon
                  sx={{ color: "#4A90E2", mr: 2, fontSize: 28 }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "#2D3748", fontWeight: 600 }}
                >
                  Cài đặt thông báo
                </Typography>
              </Box>

              <Box sx={{ space: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={handleNotificationChange("email")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#4A90E2",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#4A90E2",
                          },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {" "}
                      <EmailIcon
                        sx={{ color: "#4A90E2", mr: 1, fontSize: 20 }}
                      />
                      <Typography sx={{ color: "#2D3748" }}>
                        Thông báo qua Email
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, width: "100%" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={handleNotificationChange("sms")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#4A90E2",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#4A90E2",
                          },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {" "}
                      <SmsIcon sx={{ color: "#4A90E2", mr: 1, fontSize: 20 }} />
                      <Typography sx={{ color: "#2D3748" }}>
                        Thông báo qua SMS
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, width: "100%" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.appointment}
                      onChange={handleNotificationChange("appointment")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#4A90E2",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#4A90E2",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#2D3748" }}>
                      Thông báo lịch hẹn
                    </Typography>
                  }
                  sx={{ mb: 2, width: "100%" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.reminder}
                      onChange={handleNotificationChange("reminder")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#4A90E2",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#4A90E2",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#2D3748" }}>
                      Nhắc nhở tự động
                    </Typography>
                  }
                  sx={{ mb: 2, width: "100%" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.marketing}
                      onChange={handleNotificationChange("marketing")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#8b5cf6",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#8b5cf6",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#2D3748" }}>
                      Thông báo khuyến mãi
                    </Typography>
                  }
                  sx={{ width: "100%" }}
                />
              </Box>
            </CardContent>
          </SettingCard>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <SecurityIcon sx={{ color: "#8b5cf6", mr: 2, fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#2D3748", fontWeight: 600 }}
                >
                  Quyền riêng tư
                </Typography>
              </Box>

              <Box sx={{ space: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onChange={handlePrivacyChange("profileVisible")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#8b5cf6",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#8b5cf6",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#2D3748" }}>
                      Hiển thị hồ sơ công khai
                    </Typography>
                  }
                  sx={{ mb: 2, width: "100%" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.contactInfo}
                      onChange={handlePrivacyChange("contactInfo")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#8b5cf6",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#8b5cf6",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#2D3748" }}>
                      Chia sẻ thông tin liên hệ
                    </Typography>
                  }
                  sx={{ mb: 2, width: "100%" }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.activityStatus}
                      onChange={handlePrivacyChange("activityStatus")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#8b5cf6",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#8b5cf6",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#2D3748" }}>
                      Hiển thị trạng thái hoạt động
                    </Typography>
                  }
                  sx={{ width: "100%" }}
                />
              </Box>
            </CardContent>
          </SettingCard>
        </Grid>

        {/* Account Security */}
        <Grid item xs={12}>
          <SettingCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <PasswordIcon sx={{ color: "#8b5cf6", mr: 2, fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#2D3748", fontWeight: 600 }}
                >
                  Bảo mật tài khoản
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 2,
                      borderColor: "#8b5cf6",
                      color: "#8b5cf6",
                      borderRadius: "12px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        borderColor: "#7c3aed",
                      },
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 2,
                      borderColor: "#10b981",
                      color: "#10b981",
                      borderRadius: "12px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        borderColor: "#059669",
                      },
                    }}
                  >
                    Xác thực 2 bước
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 2,
                      borderColor: "#ef4444",
                      color: "#ef4444",
                      borderRadius: "12px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderColor: "#dc2626",
                      },
                    }}
                  >
                    Xóa tài khoản
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </SettingCard>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12}>
          <SettingCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <ThemeIcon sx={{ color: "#8b5cf6", mr: 2, fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#2D3748", fontWeight: 600 }}
                >
                  Tùy chọn giao diện
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textAlign: "center",
                    }}
                  >
                    <LanguageIcon
                      sx={{ color: "#8b5cf6", fontSize: 32, mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ color: "#2D3748", mb: 1 }}>
                      Ngôn ngữ
                    </Typography>
                    <Chip
                      label="Tiếng Việt"
                      sx={{
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                        color: "#8b5cf6",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textAlign: "center",
                    }}
                  >
                    <ThemeIcon sx={{ color: "#8b5cf6", fontSize: 32, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#2D3748", mb: 1 }}>
                      Chủ đề
                    </Typography>
                    <Chip
                      label="Tối"
                      sx={{
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                        color: "#8b5cf6",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textAlign: "center",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.preferences.autoSave}
                          onChange={handlePreferenceChange("autoSave")}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8b5cf6",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#8b5cf6",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: "#2D3748", fontWeight: 600 }}>
                          Tự động lưu
                        </Typography>
                      }
                      labelPlacement="top"
                      sx={{ flexDirection: "column", gap: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </SettingCard>
        </Grid>
      </Grid>
      {/* Save Button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          size="large"
          sx={{
            px: 6,
            py: 2,
            borderRadius: "16px",
            fontWeight: 600,
            fontSize: "16px",
            background: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
            boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
            "&:hover": {
              background: "linear-gradient(45deg, #7c3aed, #6d28d9)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(139, 92, 246, 0.5)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Lưu cài đặt
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsContent;

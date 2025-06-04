/**
 * SettingsContent.js - Admin System Settings
 *
 * Trang cài đặt hệ thống cho Admin
 */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    aria-labelledby={`settings-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const SettingsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Gender Healthcare Service",
    siteDescription: "Dịch vụ chăm sóc sức khỏe chuyên biệt",
    contactEmail: "support@genderhealthcare.com",
    contactPhone: "1900-123-456",

    // Security Settings
    requireEmailVerification: true,
    enableTwoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,

    // System Settings
    defaultLanguage: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    maintenanceMode: false,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving settings:", settings);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#2D3748",
          fontWeight: 600,
        }}
      >
        Cài đặt hệ thống
      </Typography>

      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
            <Tab label="Tổng quan" />
            <Tab label="Bảo mật" />
            <Tab label="Thông báo" />
            <Tab label="Hệ thống" />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tên website"
                  fullWidth
                  value={settings.siteName}
                  onChange={(e) =>
                    handleSettingChange("siteName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email liên hệ"
                  fullWidth
                  value={settings.contactEmail}
                  onChange={(e) =>
                    handleSettingChange("contactEmail", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả website"
                  fullWidth
                  multiline
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleSettingChange("siteDescription", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={settings.contactPhone}
                  onChange={(e) =>
                    handleSettingChange("contactPhone", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Security Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent sx={{ px: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#2D3748",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SecurityIcon sx={{ mr: 1 }} />
                Cài đặt bảo mật
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.requireEmailVerification}
                        onChange={(e) =>
                          handleSettingChange(
                            "requireEmailVerification",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Yêu cầu xác thực email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableTwoFactorAuth}
                        onChange={(e) =>
                          handleSettingChange(
                            "enableTwoFactorAuth",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Bật xác thực 2 yếu tố"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Thời gian hết hạn phiên (phút)"
                    type="number"
                    fullWidth
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Độ dài mật khẩu tối thiểu"
                    type="number"
                    fullWidth
                    value={settings.passwordMinLength}
                    onChange={(e) =>
                      handleSettingChange(
                        "passwordMinLength",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Notification Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <CardContent sx={{ px: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#2D3748",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <NotificationsIcon sx={{ mr: 1 }} />
                Cài đặt thông báo
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Thông báo qua email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "smsNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Thông báo qua SMS"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "pushNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Thông báo đẩy"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.marketingEmails}
                        onChange={(e) =>
                          handleSettingChange(
                            "marketingEmails",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Email marketing"
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </TabPanel>

        {/* System Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <CardContent sx={{ px: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#2D3748",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LanguageIcon sx={{ mr: 1 }} />
                Cài đặt hệ thống
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Ngôn ngữ mặc định</InputLabel>
                    <Select
                      value={settings.defaultLanguage}
                      label="Ngôn ngữ mặc định"
                      onChange={(e) =>
                        handleSettingChange("defaultLanguage", e.target.value)
                      }
                    >
                      <MenuItem value="vi">Tiếng Việt</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Múi giờ</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Múi giờ"
                      onChange={(e) =>
                        handleSettingChange("timezone", e.target.value)
                      }
                    >
                      <MenuItem value="Asia/Ho_Chi_Minh">
                        Asia/Ho_Chi_Minh
                      </MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Định dạng ngày</InputLabel>
                    <Select
                      value={settings.dateFormat}
                      label="Định dạng ngày"
                      onChange={(e) =>
                        handleSettingChange("dateFormat", e.target.value)
                      }
                    >
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          handleSettingChange(
                            "maintenanceMode",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Chế độ bảo trì"
                  />
                  {settings.maintenanceMode && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Chế độ bảo trì sẽ khiến website không thể truy cập với
                      người dùng thường.
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </TabPanel>

        <Divider />
        <CardContent sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
              borderRadius: 2,
              px: 3,
            }}
          >
            Lưu cài đặt
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsContent;

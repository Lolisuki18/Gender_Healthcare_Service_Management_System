/**
 * NotificationsContent.js - Component quản lý cài đặt thông báo
 *
 * Chức năng:
 * - Cài đặt preferences cho các loại thông báo email
 * - Bật/tắt thông báo rụng trứng, tỉ lệ mang thai, nhắc nhở uống thuốc
 * - Hiển thị thông tin về cách thức hoạt động của hệ thống thông báo
 *
 * Features:
 * - Toggle switches cho từng loại thông báo
 * - Thông tin hướng dẫn cho người dùng
 * - UI responsive và thân thiện
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import notificationService from "@/services/notificationService";
import { notify } from "../../utils/notify";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(74, 144, 226, 0.12)",
  color: "#1A202C",
  boxShadow: "0 20px 60px rgba(74, 144, 226, 0.08), 0 8px 25px rgba(0, 0, 0, 0.04)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4A90E2 0%, #1ABC9C 50%, #9B59B6 100%)",
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid rgba(74, 144, 226, 0.08)",
  background: "rgba(255, 255, 255, 0.6)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "rgba(74, 144, 226, 0.04)",
    border: "1px solid rgba(74, 144, 226, 0.15)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(74, 144, 226, 0.1)",
  },
  "& .MuiFormControlLabel-label": {
    marginTop: "0px",
    width: "100%",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
  borderRadius: "16px",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 20px rgba(74, 144, 226, 0.3)",
}));

const NotificationsContent = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    ovulationReminder: true,
    pregnancyProbability: true,
    medicationReminder: true,
  });
  
  const [loading, setLoading] = useState(true);

  // Tải cài đặt thông báo từ API khi component mount
  useEffect(() => {
    fetchNotificationPreferences();
  }, []);

  const fetchNotificationPreferences = async () => {
    try {
      setLoading(true);
      
      const response = await notificationService.getNotificationPreferences();
      
      if (response.success && response.data) {
        // Convert API data to UI state
        const preferences = {};
        response.data.forEach(pref => {
          const settingKey = notificationService.mapApiTypeToSetting(pref.type);
          if (settingKey) {
            preferences[settingKey] = pref.enabled;
          }
        });
        
        setNotificationSettings(prev => ({
          ...prev,
          ...preferences
        }));
      } else {
        notify.error("Lỗi", response.message || "Không thể tải cài đặt thông báo");
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      const errorMessage = "Không thể tải cài đặt thông báo. Vui lòng thử lại.";
      notify.error("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting) => {
    const newValue = !notificationSettings[setting];
    
    try {
      // Optimistic update - cập nhật UI trước
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: newValue
      }));

      // Gọi API để cập nhật
      const apiType = notificationService.mapSettingToApiType(setting);
      const response = await notificationService.updateNotificationPreference(apiType, newValue);
      
      if (response.success) {
        notify.success("Thành công", `Đã ${newValue ? 'bật' : 'tắt'} thông báo thành công`);
      } else {
        // Revert on error
        setNotificationSettings(prev => ({
          ...prev,
          [setting]: !newValue
        }));
        
        notify.error("Lỗi", response.message || "Có lỗi xảy ra khi cập nhật cài đặt");
      }
    } catch (error) {
      console.error("Error updating notification preference:", error);
      
      // Revert on error
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !newValue
      }));
      
      notify.error("Lỗi", "Không thể cập nhật cài đặt. Vui lòng thử lại.");
    }
  };

  return (
    <Box>
      {/* Notification Settings */}
      <Grid justifyContent="center">
        <Grid item xs={12} sm={11} md={10} lg={8} xl={7}>
          <StyledPaper sx={{ 
            p: { xs: 3, sm: 4, md: 5, lg: 6 },
          }}>
            {/* Header */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              mb: { xs: 4, sm: 5 },
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" }
            }}>
              <IconWrapper sx={{ 
                mr: { xs: 0, sm: 3 }, 
                mb: { xs: 2, sm: 0 },
              }}>
                <SettingsIcon sx={{ 
                  color: "white", 
                  fontSize: { xs: 28, sm: 32, md: 36 } 
                }} />
              </IconWrapper>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ 
                    color: "#1A202C", 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    background: "linear-gradient(135deg, #4A90E2 0%, #9B59B6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Cài đặt thông báo
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: "#4A5568",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: 400
                }}>
                  Quản lý các loại thông báo bạn muốn nhận qua email
                </Typography>
              </Box>
            </Box>

            {/* Loading State */}
            {loading ? (
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                py: 8 
              }}>
                <CircularProgress size={60} sx={{ color: "#4A90E2" }} />
                <Typography variant="h6" sx={{ ml: 2, color: "#4A5568" }}>
                  Đang tải cài đặt thông báo...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Notification Settings */}
                <Box sx={{ mb: { xs: 4, sm: 5 } }}>
                  <Typography
                    variant="h5"
                    sx={{ 
                      color: "#2D3748", 
                      mb: { xs: 3, sm: 4 }, 
                      fontWeight: 600,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        width: "4px",
                        height: "24px",
                        background: "linear-gradient(135deg, #4A90E2 0%, #1ABC9C 100%)",
                        borderRadius: "2px",
                        marginRight: "12px"
                      }
                    }}
                  >
                    Thông báo qua email
                  </Typography>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: { xs: 2, sm: 3 } 
                  }}>
                    <StyledFormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.ovulationReminder}
                          onChange={() => handleSettingChange("ovulationReminder")}
                          color="primary"
                          size="medium"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#4A90E2",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#4A90E2",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 2 }}>
                          <Typography sx={{ 
                            color: "#1A202C", 
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            mb: 0.5
                          }}>
                            🥚 Nhắc nhở ngày rụng trứng
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: "#4A5568",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            lineHeight: 1.5
                          }}>
                            Nhận thông báo 1 ngày trước ngày rụng trứng dự kiến
                          </Typography>
                        </Box>
                      }
                    />
                    <StyledFormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.pregnancyProbability}
                          onChange={() => handleSettingChange("pregnancyProbability")}
                          color="primary"
                          size="medium"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#1ABC9C",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#1ABC9C",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 2 }}>
                          <Typography sx={{ 
                            color: "#1A202C", 
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            mb: 0.5
                          }}>
                            🤱 Thông báo tỉ lệ mang thai
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: "#4A5568",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            lineHeight: 1.5
                          }}>
                            Nhận thông báo về tỉ lệ mang thai trong khoảng thời gian thụ thai
                          </Typography>
                        </Box>
                      }
                    />
                    <StyledFormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.medicationReminder}
                          onChange={() => handleSettingChange("medicationReminder")}
                          color="primary"
                          size="medium"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#9B59B6",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#9B59B6",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 2 }}>
                          <Typography sx={{ 
                            color: "#1A202C", 
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            mb: 0.5
                          }}>
                            💊 Nhắc nhở uống thuốc
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: "#4A5568",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            lineHeight: 1.5
                          }}>
                            Nhận nhắc nhở về thời gian uống thuốc theo lịch đã đặt
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Box>

                {/* Thông tin quan trọng */}
                <Box 
                  sx={{ 
                    p: { xs: 3, sm: 4 }, 
                    background: "linear-gradient(135deg, rgba(74, 144, 226, 0.06) 0%, rgba(155, 89, 182, 0.06) 100%)",
                    borderRadius: "20px",
                    border: "1px solid rgba(74, 144, 226, 0.12)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "6px",
                      height: "100%",
                      background: "linear-gradient(180deg, #4A90E2 0%, #1ABC9C 50%, #9B59B6 100%)",
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    color: "#1A202C", 
                    fontWeight: 700, 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    display: "flex",
                    alignItems: "center"
                  }}>
                    📧 Thông tin quan trọng
                  </Typography>
                  <Box sx={{ 
                    display: "grid",
                    gap: { xs: 2, sm: 2.5 },
                    "& > div": {
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2
                    }
                  }}>
                    <Box>
                      <Box sx={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, #4A90E2, #1ABC9C)",
                        mt: 0.8,
                        flexShrink: 0
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: "#2D3748", 
                        lineHeight: 1.6,
                        fontSize: { xs: "0.9rem", sm: "1rem" }
                      }}>
                        <strong>Email thông báo:</strong> Sẽ được gửi đến địa chỉ email đã đăng ký trong tài khoản
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, #1ABC9C, #9B59B6)",
                        mt: 0.8,
                        flexShrink: 0
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: "#2D3748", 
                        lineHeight: 1.6,
                        fontSize: { xs: "0.9rem", sm: "1rem" }
                      }}>
                        <strong>Tùy chỉnh:</strong> Bạn có thể bật/tắt từng loại thông báo theo nhu cầu cá nhân
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, #9B59B6, #4A90E2)",
                        mt: 0.8,
                        flexShrink: 0
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: "#2D3748", 
                        lineHeight: 1.6,
                        fontSize: { xs: "0.9rem", sm: "1rem" }
                      }}>
                        <strong>Thời gian gửi:</strong> Thông báo được gửi tự động theo lịch trình đã thiết lập
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, #E74C3C, #F39C12)",
                        mt: 0.8,
                        flexShrink: 0
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: "#2D3748", 
                        lineHeight: 1.6,
                        fontSize: { xs: "0.9rem", sm: "1rem" }
                      }}>
                        <strong>Bảo mật:</strong> Thông tin cá nhân được bảo vệ và không chia sẻ với bên thứ ba
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationsContent;

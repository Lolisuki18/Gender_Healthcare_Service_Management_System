/**
 * NotificationsContent.js - Component quản lý thông báo
 *
 * Chức năng:
 * - Hiển thị danh sách thông báo
 * - Mark as read/unread functionality
 * - Notification categories (appointments, payments, system)
 * - Real-time notification updates
 * - Notification preferences settings
 *
 * Features:
 * - Unread notification indicators
 * - Category filtering
 * - Timestamp display
 * - Interactive notification actions
 * - Notification history archive
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Event as EventIcon,
  LocalHospital as HospitalIcon,
  Payment as PaymentIcon,
  Campaign as CampaignIcon,
  Circle as CircleIcon,
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

const StyledListItem = styled(ListItem)(({ theme, unread }) => ({
  background: unread ? "rgba(74, 144, 226, 0.08)" : "rgba(255, 255, 255, 0.9)",
  borderRadius: "12px",
  marginBottom: "8px",
  border: unread
    ? "1px solid rgba(74, 144, 226, 0.2)"
    : "1px solid rgba(74, 144, 226, 0.05)",
  "&:hover": {
    background: "rgba(74, 144, 226, 0.05)",
  },
}));

const NotificationsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Lịch hẹn sắp tới",
      message:
        "Bạn có lịch hẹn khám với BS. Nguyễn Thị Hoa vào ngày 15/02/2024 lúc 09:00",
      timestamp: new Date("2024-02-14T10:30:00"),
      unread: true,
      priority: "high",
    },
    {
      id: 2,
      type: "payment",
      title: "Thanh toán thành công",
      message: "Thanh toán hóa đơn INV-2024-001 đã được xử lý thành công",
      timestamp: new Date("2024-02-13T14:15:00"),
      unread: true,
      priority: "normal",
    },
    {
      id: 3,
      type: "medical",
      title: "Kết quả xét nghiệm",
      message:
        "Kết quả xét nghiệm máu của bạn đã có. Vui lòng kiểm tra trong mục lịch sử khám",
      timestamp: new Date("2024-02-12T16:45:00"),
      unread: false,
      priority: "high",
    },
    {
      id: 4,
      type: "promotion",
      title: "Chương trình khuyến mãi",
      message: "Giảm 20% cho các dịch vụ khám sức khỏe định kỳ trong tháng 2",
      timestamp: new Date("2024-02-10T09:00:00"),
      unread: false,
      priority: "low",
    },
    {
      id: 5,
      type: "appointment",
      title: "Nhắc nhở khám định kỳ",
      message:
        "Đã đến thời gian khám sức khỏe định kỳ. Hãy đặt lịch hẹn để duy trì sức khỏe tốt",
      timestamp: new Date("2024-02-08T08:00:00"),
      unread: false,
      priority: "normal",
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true,
    payments: true,
    medicalResults: true,
    promotions: false,
    reminders: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <EventIcon sx={{ color: "#4A90E2" }} />;
      case "payment":
        return <PaymentIcon sx={{ color: "#4CAF50" }} />;
      case "medical":
        return <HospitalIcon sx={{ color: "#F39C12" }} />;
      case "promotion":
        return <CampaignIcon sx={{ color: "#1ABC9C" }} />;
      default:
        return <NotificationsIcon sx={{ color: "#607D8B" }} />;
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "normal":
        return "#4A90E2";
      case "low":
        return "#607D8B";
      default:
        return "#607D8B";
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const handleSettingChange = (setting) => (event) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: event.target.checked,
    }));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else {
      return "Vừa xong";
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredNotifications =
    tabValue === 0 ? notifications : notifications.filter((n) => n.unread);

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon
                sx={{ fontSize: 40, color: "#4A90E2", mb: 1 }}
              />
            </Badge>
            <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
              {notifications.length}
            </Typography>
            <Typography variant="body2" sx={{ color: "#4A5568" }}>
              Tổng thông báo
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <MarkEmailReadIcon sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />
            <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
              {unreadCount}
            </Typography>
            <Typography variant="body2" sx={{ color: "#4A5568" }}>
              Chưa đọc
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <EventIcon sx={{ fontSize: 40, color: "#F39C12", mb: 1 }} />
            <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
              {notifications.filter((n) => n.type === "appointment").length}
            </Typography>
            <Typography variant="body2" sx={{ color: "#4A5568" }}>
              Lịch hẹn
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <StyledPaper sx={{ p: 3, textAlign: "center" }}>
            <HospitalIcon sx={{ fontSize: 40, color: "#1ABC9C", mb: 1 }} />
            <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
              {notifications.filter((n) => n.type === "medical").length}
            </Typography>
            <Typography variant="body2" sx={{ color: "#4A5568" }}>
              Y tế
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Notifications List */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            {" "}
            <Box sx={{ borderBottom: "1px solid rgba(74, 144, 226, 0.15)" }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    color: "#4A5568",
                    "&.Mui-selected": {
                      color: "#2D3748",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4A90E2",
                  },
                }}
              >
                <Tab label="Tất cả" />
                <Tab label={`Chưa đọc (${unreadCount})`} />
              </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#2D3748", fontWeight: 600 }}
                >
                  Thông báo
                </Typography>
                {unreadCount > 0 && (
                  <Button
                    onClick={handleMarkAllAsRead}
                    size="small"
                    sx={{
                      color: "#4A90E2",
                      "&:hover": {
                        backgroundColor: "rgba(74, 144, 226, 0.1)",
                      },
                    }}
                  >
                    Đánh dấu đã đọc tất cả
                  </Button>
                )}
              </Box>
              <List sx={{ p: 0 }}>
                {filteredNotifications.map((notification) => (
                  <StyledListItem
                    key={notification.id}
                    unread={notification.unread}
                    sx={{ p: 2 }}
                  >
                    <ListItemIcon>
                      <Box sx={{ position: "relative" }}>
                        {getNotificationIcon(notification.type)}
                        {notification.unread && (
                          <CircleIcon
                            sx={{
                              position: "absolute",
                              top: -2,
                              right: -2,
                              fontSize: 12,
                              color: getPriorityColor(notification.priority),
                            }}
                          />
                        )}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#2D3748",
                            fontWeight: notification.unread ? 600 : 400,
                            mb: 0.5,
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4A5568",
                              mb: 1,
                              lineHeight: 1.4,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#607D8B",
                              fontSize: "0.75rem",
                            }}
                          >
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {" "}
                      {notification.unread && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{
                            color: "#4CAF50",
                            "&:hover": {
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                            },
                          }}
                        >
                          <MarkEmailReadIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        sx={{
                          color: "#f44336",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </StyledListItem>
                ))}
              </List>
              {filteredNotifications.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  {" "}
                  <NotificationsIcon
                    sx={{
                      fontSize: 64,
                      color: "rgba(74, 144, 226, 0.3)",
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ color: "#2D3748" }}>
                    Không có thông báo
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4A5568" }}>
                    {tabValue === 0
                      ? "Bạn chưa có thông báo nào"
                      : "Không có thông báo chưa đọc"}
                  </Typography>
                </Box>
              )}
            </Box>
          </StyledPaper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={4}>
          {" "}
          <StyledPaper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SettingsIcon sx={{ color: "#4A90E2", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{ color: "#2D3748", fontWeight: 600 }}
              >
                Cài đặt thông báo
              </Typography>
            </Box>{" "}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "#2D3748", mb: 2, fontWeight: 500 }}
              >
                Loại thông báo
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.appointments}
                      onChange={handleSettingChange("appointments")}
                      color="primary"
                    />
                  }
                  label="Lịch hẹn"
                  sx={{ color: "#2D3748" }}
                />{" "}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.payments}
                      onChange={handleSettingChange("payments")}
                      color="primary"
                    />
                  }
                  label="Thanh toán"
                  sx={{ color: "#2D3748" }}
                />{" "}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.medicalResults}
                      onChange={handleSettingChange("medicalResults")}
                      color="primary"
                    />
                  }
                  label="Kết quả y tế"
                  sx={{ color: "#2D3748" }}
                />{" "}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.promotions}
                      onChange={handleSettingChange("promotions")}
                      color="primary"
                    />
                  }
                  label="Khuyến mãi"
                  sx={{ color: "#2D3748" }}
                />{" "}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.reminders}
                      onChange={handleSettingChange("reminders")}
                      color="primary"
                    />
                  }
                  label="Nhắc nhở"
                  sx={{ color: "#2D3748" }}
                />
              </Box>
            </Box>{" "}
            <Divider
              sx={{ backgroundColor: "rgba(74, 144, 226, 0.15)", my: 3 }}
            />
            <Box>
              {" "}
              <Typography
                variant="subtitle1"
                sx={{ color: "#2D3748", mb: 2, fontWeight: 500 }}
              >
                Phương thức nhận
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {" "}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={handleSettingChange("emailNotifications")}
                      color="primary"
                    />
                  }
                  label="Email"
                  sx={{ color: "#2D3748" }}
                />{" "}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={handleSettingChange("smsNotifications")}
                      color="primary"
                    />
                  }
                  label="SMS"
                  sx={{ color: "#2D3748" }}
                />
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationsContent;

/**
 * NotificationsContent.js - Staff Notifications Management
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const NotificationsContent = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Lịch hẹn mới",
      message: "Bệnh nhân Nguyễn Văn A đã đặt lịch hẹn lúc 14:00 ngày mai",
      time: "5 phút trước",
      read: false,
      icon: ScheduleIcon,
      color: "#4A90E2",
    },
    {
      id: 2,
      type: "patient",
      title: "Cập nhật hồ sơ bệnh nhân",
      message: "Hồ sơ của bệnh nhân Trần Thị B đã được cập nhật",
      time: "1 giờ trước",
      read: false,
      icon: PersonIcon,
      color: "#1ABC9C",
    },
    {
      id: 3,
      type: "warning",
      title: "Nhắc nhở",
      message: "Có 3 lịch hẹn cần xác nhận trong ngày hôm nay",
      time: "2 giờ trước",
      read: true,
      icon: WarningIcon,
      color: "#F39C12",
    },
    {
      id: 4,
      type: "info",
      title: "Thông báo hệ thống",
      message: "Hệ thống sẽ bảo trì từ 23:00 đến 01:00 đêm nay",
      time: "1 ngày trước",
      read: true,
      icon: InfoIcon,
      color: "#6B7280",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2D3748" }}>
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              sx={{
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                color: "#fff",
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Box>
        <Typography variant="body1" sx={{ color: "#64748B" }}>
          {unreadCount > 0
            ? `Có ${unreadCount} thông báo chưa đọc`
            : "Tất cả thông báo đã được đọc"}
        </Typography>
      </Box>

      {/* Notifications List */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.08)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => {
              const IconComponent = notification.icon;
              return (
                <ListItem
                  key={notification.id}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom:
                      index < notifications.length - 1
                        ? "1px solid rgba(74, 144, 226, 0.08)"
                        : "none",
                    background: notification.read
                      ? "transparent"
                      : "rgba(74, 144, 226, 0.02)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(74, 144, 226, 0.05)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: `${notification.color}20`,
                        color: notification.color,
                      }}
                    >
                      <IconComponent />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: notification.read ? 500 : 600,
                            color: "#2D3748",
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip
                            label="Mới"
                            size="small"
                            sx={{
                              background: "#EF444420",
                              color: "#EF4444",
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#94A3B8",
                          }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        sx={{
                          color: "#4A90E2",
                          "&:hover": {
                            background: "#4A90E220",
                          },
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => deleteNotification(notification.id)}
                      sx={{
                        color: "#EF4444",
                        "&:hover": {
                          background: "#EF444420",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>

          {notifications.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Avatar
                sx={{
                  background: "rgba(74, 144, 226, 0.1)",
                  color: "#64748B",
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <NotificationsIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#64748B", mb: 1 }}>
                Không có thông báo
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                Tất cả thông báo sẽ hiển thị tại đây
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationsContent;

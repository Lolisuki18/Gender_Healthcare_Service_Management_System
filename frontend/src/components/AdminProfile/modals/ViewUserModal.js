/**
 * ViewUserModal.js - Modal xem thông tin chi tiết người dùng
 *
 * Modal component để hiển thị thông tin chi tiết của người dùng
 */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const ViewUserModal = ({ open, onClose, user }) => {
  if (!user) return null;

  // Function chuyển đổi role từ tiếng Anh sang tiếng Việt để hiển thị
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "Admin":
        return "Quản trị viên";
      case "Staff":
        return "Nhân viên";
      case "Customer":
        return "Khách hàng";
      case "Consultant":
        return "Tư vấn viên";
      default:
        return role;
    }
  };

  // Function chuyển đổi status từ tiếng Anh sang tiếng Việt
  const getStatusDisplayName = (status) => {
    switch (status) {
      case "Active":
        return "Hoạt động";
      case "Inactive":
        return "Tạm khóa";
      case "Blocked":
        return "Bị chặn";
      default:
        return status;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Consultant":
        return "warning";
      case "Staff":
        return "info";
      case "Customer":
        return "primary";
      default:
        return "default";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === "Hoạt động" || status === "Active"
      ? "success"
      : "default";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Thông tin chi tiết - {getRoleDisplayName(user.role)}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Header với avatar và thông tin cơ bản */}
        <Card
          sx={{
            mb: 3,
            background:
              "linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(26, 188, 156, 0.1))",
            border: "1px solid rgba(74, 144, 226, 0.2)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 80,
                height: 80,
                margin: "0 auto 16px",
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#2D3748", mb: 1 }}
            >
              {user.name}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}
            >
              <Chip
                label={getRoleDisplayName(user.role)}
                color={getRoleColor(user.role)}
                size="small"
                variant="outlined"
              />
              <Chip
                label={getStatusDisplayName(user.status)}
                color={getStatusColor(user.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#718096" }}>
              ID: {user.id} • Tham gia: {formatDate(user.joinDate)}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Thông tin liên hệ */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                color: "#2D3748",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <PersonIcon sx={{ mr: 1, color: "#4A90E2" }} />
              Thông tin liên hệ
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: "#718096", fontSize: 20 }} />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 500 }}
                  >
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: "#718096", fontSize: 20 }} />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 500 }}
                  >
                    Số điện thoại
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {user.phone}
                  </Typography>
                </Box>
              </Box>
              {user.address && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationIcon
                    sx={{ mr: 2, color: "#718096", fontSize: 20 }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2D3748", fontWeight: 500 }}
                    >
                      Địa chỉ
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#718096" }}>
                      {user.address}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Thông tin hệ thống */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                color: "#2D3748",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CalendarIcon sx={{ mr: 1, color: "#4A90E2" }} />
              Thông tin hệ thống
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#2D3748", fontWeight: 500 }}
                >
                  Ngày tham gia
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  {formatDate(user.joinDate)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#2D3748", fontWeight: 500 }}
                >
                  Lần đăng nhập cuối
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  {user.lastLogin || "Chưa đăng nhập"}
                </Typography>
              </Box>
              {user.gender && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 500 }}
                  >
                    Giới tính
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {user.gender === "male"
                      ? "Nam"
                      : user.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                  </Typography>
                </Box>
              )}
              {user.dateOfBirth && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 500 }}
                  >
                    Ngày sinh
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {formatDate(user.dateOfBirth)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Thông tin chuyên môn cho Tư vấn viên */}
          {user.role === "Consultant" && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "#2D3748",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WorkIcon sx={{ mr: 1, color: "#4A90E2" }} />
                Thông tin chuyên môn
              </Typography>

              <Grid container spacing={2} sx={{ pl: 2 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2D3748",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <StarIcon
                        sx={{ mr: 1, fontSize: 16, color: "#F6AD55" }}
                      />
                      Chuyên khoa
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#718096", pl: 3 }}
                    >
                      {user.specialization || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2D3748",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        sx={{ mr: 1, fontSize: 16, color: "#4A90E2" }}
                      />
                      Kinh nghiệm
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#718096", pl: 3 }}
                    >
                      {user.experience
                        ? `${user.experience} năm`
                        : "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Grid>
                {user.certification && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#2D3748",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <SchoolIcon
                          sx={{ mr: 1, fontSize: 16, color: "#48BB78" }}
                        />
                        Chứng chỉ & Bằng cấp
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#718096", pl: 3, whiteSpace: "pre-line" }}
                      >
                        {user.certification}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            "&:hover": {
              background: "linear-gradient(45deg, #357ABD, #17A2B8)",
            },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserModal;

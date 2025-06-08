/**
 * ViewUserModal.js - Modal xem thông tin chi tiết người dùng
 *
 * Modal component để hiển thị thông tin chi tiết của người dùng
 * Hỗ trợ hiển thị thông tin profile riêng cho Consultant
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

  // Check if this is a consultant with profile data
  const isConsultantWithProfile = user.role === "CONSULTANT" && user.profileId;

  // Helper function to get display data based on user type
  const getDisplayData = () => {
    if (isConsultantWithProfile) {
      // For consultant with profile, use profile data
      return {
        name: user.fullName || user.username,
        email: user.email,
        phone: user.phone || "Chưa cập nhật",
        avatar: user.avatar,
        // Professional info from profile
        qualifications: user.qualifications,
        experience: user.experience,
        bio: user.bio,
        updatedAt: user.updatedAt,
        // Keep original data for system info
        role: user.role,
        isActive: user.isActive,
        createdDate: user.createdDate,
        id: user.userId || user.id,
        profileId: user.profileId,
      };
    } else {
      // For other roles or consultant without profile, use original data
      return {
        name: user.fullName || user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        birthDay: user.birthDay,
        // System info
        role: user.role,
        isActive: user.isActive,
        createdDate: user.createdDate,
        id: user.id,
      };
    }
  };

  const displayData = getDisplayData();

  // Function chuyển đổi role từ tiếng Anh sang tiếng Việt để hiển thị
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "STAFF":
        return "Nhân viên";
      case "CUSTOMER":
        return "Khách hàng";
      case "CONSULTANT":
        return "Tư vấn viên";
      default:
        return role;
    }
  };

  // Function chuyển đổi status từ boolean sang tiếng Việt
  const getStatusDisplayName = (isActive) => {
    return isActive ? "Hoạt động" : "Tạm khóa";
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "CONSULTANT":
        return "warning";
      case "STAFF":
        return "info";
      case "CUSTOMER":
        return "primary";
      default:
        return "default";
    }
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive ? "success" : "error";
  };

  // Format date
  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return "Chưa cập nhật";

    try {
      // dateArray format: [year, month, day, hour, minute, second, nanosecond]
      const [year, month, day, hour = 0, minute = 0] = dateArray;
      const date = new Date(year, month - 1, day, hour, minute);

      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Chưa cập nhật";
    }
  };

  // Format birth date
  const formatBirthDate = (birthDay) => {
    if (!birthDay) return "Chưa cập nhật";

    if (Array.isArray(birthDay)) {
      try {
        const [year, month, day] = birthDay;
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (error) {
        return "Chưa cập nhật";
      }
    }

    // Fallback for string dates
    return new Date(birthDay).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          Thông tin chi tiết - {getRoleDisplayName(displayData.role)}
          {isConsultantWithProfile && (
            <Chip
              label="Profile"
              size="small"
              sx={{
                ml: 1,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "0.75rem",
              }}
            />
          )}
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
              src={displayData.avatar}
              sx={{
                width: 80,
                height: 80,
                margin: "0 auto 16px",
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              {displayData.name?.charAt(0) || "?"}
            </Avatar>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#2D3748", mb: 1 }}
            >
              {displayData.name || "Không có tên"}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}
            >
              <Chip
                label={getRoleDisplayName(displayData.role)}
                color={getRoleColor(displayData.role)}
                size="small"
                variant="outlined"
              />
              <Chip
                label={getStatusDisplayName(displayData.isActive)}
                color={getStatusColor(displayData.isActive)}
                size="small"
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#718096" }}>
              ID: {displayData.id}
              {isConsultantWithProfile &&
                ` • Profile ID: ${displayData.profileId}`}
              {displayData.createdDate &&
                ` • Tham gia: ${formatDate(displayData.createdDate)}`}
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
                    {displayData.email}
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
                    {displayData.phone || "Chưa cập nhật"}
                  </Typography>
                </Box>
              </Box>
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
              {displayData.createdDate && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 500 }}
                  >
                    Ngày tham gia
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {formatDate(displayData.createdDate)}
                  </Typography>
                </Box>
              )}

              {/* Show profile update time for consultant with profile */}
              {isConsultantWithProfile && displayData.updatedAt && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2D3748", fontWeight: 500 }}
                  >
                    Cập nhật profile
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {formatDate(displayData.updatedAt)}
                  </Typography>
                </Box>
              )}

              {/* Show traditional fields for non-consultant-profile users */}
              {!isConsultantWithProfile && (
                <>
                  {displayData.birthDay && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#2D3748", fontWeight: 500 }}
                      >
                        Ngày sinh
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#718096" }}>
                        {formatBirthDate(displayData.birthDay)}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Grid>

          {/* Thông tin chuyên môn cho Tư vấn viên */}
          {displayData.role === "CONSULTANT" && (
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
                {/* For consultant with profile */}
                {isConsultantWithProfile ? (
                  <>
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
                          Trình độ chuyên môn
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#718096",
                            pl: 3,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {displayData.qualifications || "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </Grid>
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
                          <CalendarIcon
                            sx={{ mr: 1, fontSize: 16, color: "#4A90E2" }}
                          />
                          Kinh nghiệm làm việc
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#718096",
                            pl: 3,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {displayData.experience || "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </Grid>
                    {displayData.bio && (
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
                            <PersonIcon
                              sx={{ mr: 1, fontSize: 16, color: "#9F7AEA" }}
                            />
                            Giới thiệu bản thân
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#718096",
                              pl: 3,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {displayData.bio}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </>
                ) : (
                  // For traditional consultant data without profile
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#718096", fontStyle: "italic" }}
                    >
                      Tư vấn viên chưa có thông tin chuyên môn chi tiết.
                    </Typography>
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

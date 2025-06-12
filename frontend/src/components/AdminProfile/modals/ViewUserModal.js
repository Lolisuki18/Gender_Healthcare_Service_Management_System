/**
 * ViewUserModal.js - Modal xem thông tin chi tiết người dùng
 */
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
  School as SchoolIcon,
  Wc as GenderIcon,
  Home as HomeIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
// Import dateUtils for consistent date formatting
import { formatDateDisplay } from "../../../utils/dateUtils.js";

const ViewUserModal = ({ open, onClose, user, loadingConsultantDetails }) => {
  const theme = useTheme();

  // Medical theme colors
  const medicalColors = {
    primary: "#4A90E2",
    secondary: "#1ABC9C",
    gradient: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
    lightGradient:
      "linear-gradient(135deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.08))",
    cardGradient:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))",
    white: "#ffffff",
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
      muted: "#718096",
    },
  };

  useEffect(() => {
    if (user) {
      console.log("📱 ViewUserModal received user:", user);
      console.log("📅 Created Date:", user.createdDate);
      console.log("📅 Updated At:", user.updatedAt);
      console.log("👤 User role:", user.role);

      // Debug đặc biệt cho CONSULTANT
      if (user.role === "CONSULTANT") {
        console.log("🔍 CONSULTANT DEBUG:");
        console.log("🔍 All keys:", Object.keys(user));
        console.log("🔍 User object:", JSON.stringify(user, null, 2));

        // Tìm tất cả field có chứa date
        const dateFields = Object.keys(user).filter(
          (key) =>
            key.toLowerCase().includes("date") ||
            key.toLowerCase().includes("created") ||
            key.toLowerCase().includes("update")
        );
        console.log("🔍 Date fields found:", dateFields);
        dateFields.forEach((field) => {
          console.log(`🔍 ${field}:`, user[field]);
        });
      }
    }
  }, [user]);

  if (!user) return null;

  // Helper functions
  const getRoleDisplayName = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      STAFF: "Nhân viên",
      CUSTOMER: "Khách hàng",
      CONSULTANT: "Tư vấn viên",
    };
    return roleMap[role] || role;
  };

  const getGenderDisplayName = (gender) => {
    const genderMap = {
      MALE: "Nam",
      FEMALE: "Nữ",
      OTHER: "Khác",
    };
    return genderMap[gender] || "Chưa cập nhật";
  };

  const getStatusDisplayName = (isActive) =>
    isActive ? "Hoạt động" : "Tạm khóa";

  const getRoleColor = (role) => {
    const colorMap = {
      ADMIN: "error",
      CONSULTANT: "warning",
      STAFF: "info",
      CUSTOMER: "primary",
    };
    return colorMap[role] || "default";
  };

  const getStatusColor = (isActive) => (isActive ? "success" : "error");
  // Helper functions for date formatting using dateUtils
  const formatDate = (dateInput) => {
    if (!dateInput) return "Chưa cập nhật";
    try {
      let date;
      if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0] = dateInput;
        date = new Date(year, month - 1, day, hour, minute);
        // For array input with time, show time as well
        return date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        // Use dateUtils for consistent formatting
        return formatDateDisplay(dateInput);
      }
    } catch (error) {
      return "Chưa cập nhật";
    }
  };

  const formatBirthDate = (birthDay) => {
    if (!birthDay) return "Chưa cập nhật";
    // Use dateUtils for consistent formatting
    return formatDateDisplay(birthDay);
  };

  // Enhanced Info Item Component
  const InfoItem = ({ icon, label, value, gradient = false }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2.5,
        p: 2.5,
        borderRadius: 2,
        background: gradient ? medicalColors.lightGradient : "transparent",
        border: gradient
          ? `1px solid ${alpha(medicalColors.primary, 0.1)}`
          : "none",
        transition: "all 0.2s ease",
        "&:hover": gradient && {
          background: `linear-gradient(135deg, ${alpha(
            medicalColors.primary,
            0.12
          )}, ${alpha(medicalColors.secondary, 0.12)})`,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          mr: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          background: medicalColors.gradient,
          borderRadius: "12px",
          color: medicalColors.white,
          boxShadow: "0 4px 12px rgba(74, 144, 226, 0.25)",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: medicalColors.text.secondary,
            fontWeight: 600,
            mb: 0.5,
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: medicalColors.text.primary,
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: 1.5,
          }}
        >
          {value || "Chưa cập nhật"}
        </Typography>
      </Box>
    </Box>
  );

  // TODO: Thay đổi function này để sử dụng created_date khi backend cung cấp
  const getJoinDate = (user) => {
    if (user.role === "CONSULTANT") {
      console.log("🔍 getJoinDate for CONSULTANT:");
      console.log("  createdDate:", user.createdDate);
      console.log("  created_date:", user.created_date);
      console.log("  updatedAt:", user.updatedAt);
      console.log("  updated_at:", user.updated_at);
    }

    // Ưu tiên createdDate, fallback về updatedAt nếu không có
    const result =
      user.createdDate ||
      user.created_date ||
      user.updatedAt ||
      user.updated_at ||
      user.createdAt ||
      user.dateCreated;

    if (user.role === "CONSULTANT") {
      console.log("🔍 getJoinDate result for CONSULTANT:", result);
    }

    return result;
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
          background: medicalColors.cardGradient,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(medicalColors.primary, 0.15)}`,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          maxHeight: "92vh",
          overflow: "hidden",
        },
      }}
    >
      {/* Modern Header */}
      <DialogTitle
        sx={{
          background: medicalColors.gradient,
          color: medicalColors.white,
          p: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 4,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Thông tin chi tiết
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {getRoleDisplayName(user.role)} • ID: {user.id}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: medicalColors.white,
                background: alpha(medicalColors.white, 0.15),
                "&:hover": {
                  background: alpha(medicalColors.white, 0.25),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Decorative overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            zIndex: 1,
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Profile Header Section */}
        <Box
          sx={{
            background: medicalColors.lightGradient,
            p: 4,
            borderBottom: `1px solid ${alpha(medicalColors.primary, 0.1)}`,
          }}
        >
          <Stack direction="row" spacing={4} alignItems="center">
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  background: medicalColors.gradient,
                  fontSize: "3rem",
                  fontWeight: 700,
                  boxShadow: "0 8px 32px rgba(74, 144, 226, 0.3)",
                  border: `4px solid ${medicalColors.white}`,
                }}
              >
                {user.full_name?.charAt(0) || user.username?.charAt(0) || "?"}
              </Avatar>
              {user.is_active && (
                <VerifiedIcon
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    color: medicalColors.secondary,
                    background: medicalColors.white,
                    borderRadius: "50%",
                    fontSize: 28,
                    p: 0.5,
                  }}
                />
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: medicalColors.text.primary,
                  mb: 2,
                  background: `linear-gradient(45deg, ${medicalColors.primary}, ${medicalColors.secondary})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {user.full_name || user.username || "Không có tên"}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip
                  label={getRoleDisplayName(user.role)}
                  color={getRoleColor(user.role)}
                  variant="filled"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                />
                <Chip
                  label={getStatusDisplayName(user.is_active)}
                  color={getStatusColor(user.is_active)}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    fontSize: "0.9rem",
                    borderWidth: 2,
                  }}
                />
              </Stack>

              {/* Sử dụng createdDate để hiển thị ngày tham gia */}
              {getJoinDate(user) && (
                <Typography
                  variant="body1"
                  sx={{
                    color: medicalColors.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  <ScheduleIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Tham gia từ: {formatDate(getJoinDate(user))}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Content Section - Stack Layout */}
        <Box sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Contact Information Card */}
            <Card
              sx={{
                background: medicalColors.cardGradient,
                borderRadius: 3,
                border: `1px solid ${alpha(medicalColors.primary, 0.15)}`,
                boxShadow: "0 8px 32px rgba(74, 144, 226, 0.12)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 48px rgba(74, 144, 226, 0.2)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: medicalColors.text.primary,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        mr: 2,
                        color: medicalColors.white,
                        background: medicalColors.gradient,
                        borderRadius: 2,
                        p: 1,
                        fontSize: 32,
                      }}
                    />
                    Thông tin liên hệ
                  </Typography>
                  <Divider
                    sx={{ background: alpha(medicalColors.primary, 0.2) }}
                  />
                </Box>

                <Stack spacing={1}>
                  <InfoItem
                    icon={<EmailIcon sx={{ fontSize: 24 }} />}
                    label="Địa chỉ Email"
                    value={user.email}
                    gradient={true}
                  />

                  <InfoItem
                    icon={<PhoneIcon sx={{ fontSize: 24 }} />}
                    label="Số điện thoại"
                    value={user.phone}
                    gradient={true}
                  />

                  <InfoItem
                    icon={<GenderIcon sx={{ fontSize: 24 }} />}
                    label="Giới tính"
                    value={getGenderDisplayName(user.gender)}
                    gradient={true}
                  />

                  {user.address && (
                    <InfoItem
                      icon={<HomeIcon sx={{ fontSize: 24 }} />}
                      label="Địa chỉ"
                      value={user.address}
                      gradient={true}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card
              sx={{
                background: medicalColors.cardGradient,
                borderRadius: 3,
                border: `1px solid ${alpha(medicalColors.primary, 0.15)}`,
                boxShadow: "0 8px 32px rgba(74, 144, 226, 0.12)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 48px rgba(74, 144, 226, 0.2)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: medicalColors.text.primary,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <CalendarIcon
                      sx={{
                        mr: 2,
                        color: medicalColors.white,
                        background: medicalColors.gradient,
                        borderRadius: 2,
                        p: 1,
                        fontSize: 32,
                      }}
                    />
                    Thông tin cá nhân
                  </Typography>
                  <Divider
                    sx={{ background: alpha(medicalColors.primary, 0.2) }}
                  />
                </Box>

                <Stack spacing={1}>
                  {user.birth_day && (
                    <InfoItem
                      icon={<CalendarIcon sx={{ fontSize: 24 }} />}
                      label="Ngày sinh"
                      value={formatBirthDate(user.birth_day)}
                      gradient={true}
                    />
                  )}

                  {/* Sử dụng createdDate cho ngày tham gia */}
                  <InfoItem
                    icon={<ScheduleIcon sx={{ fontSize: 24 }} />}
                    label="Ngày tham gia"
                    value={formatDate(getJoinDate(user))}
                    gradient={true}
                  />

                  <InfoItem
                    icon={<PersonIcon sx={{ fontSize: 24 }} />}
                    label="Tên đăng nhập"
                    value={user.username}
                    gradient={true}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Professional Information for Consultants */}
            {user.role === "CONSULTANT" && (
              <Card
                sx={{
                  background: medicalColors.cardGradient,
                  borderRadius: 3,
                  border: `1px solid ${alpha(medicalColors.primary, 0.15)}`,
                  boxShadow: "0 8px 32px rgba(74, 144, 226, 0.12)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 48px rgba(74, 144, 226, 0.2)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: medicalColors.text.primary,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <WorkIcon
                        sx={{
                          mr: 2,
                          color: medicalColors.white,
                          background: medicalColors.gradient,
                          borderRadius: 2,
                          p: 1,
                          fontSize: 32,
                        }}
                      />
                      Thông tin chuyên môn
                      {loadingConsultantDetails && (
                        <CircularProgress
                          size={28}
                          sx={{ ml: 2, color: medicalColors.primary }}
                        />
                      )}
                    </Typography>
                    <Divider
                      sx={{ background: alpha(medicalColors.primary, 0.2) }}
                    />
                  </Box>

                  {loadingConsultantDetails && !user._hasDetailedInfo ? (
                    <Box sx={{ p: 3 }}>
                      <Skeleton
                        variant="text"
                        width="70%"
                        height={40}
                        sx={{ mb: 3 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={100}
                        sx={{ mb: 3, borderRadius: 2 }}
                      />
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={40}
                        sx={{ mb: 3 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={80}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  ) : user._hasDetailedInfo ? (
                    <Stack spacing={3}>
                      {/* Qualifications */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: medicalColors.text.primary,
                            fontWeight: 700,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <SchoolIcon
                            sx={{ mr: 1.5, color: medicalColors.primary }}
                          />
                          Bằng cấp & Chứng chỉ
                        </Typography>

                        {user.qualifications ? (
                          <Card
                            sx={{
                              background: `linear-gradient(135deg, ${alpha(
                                medicalColors.primary,
                                0.08
                              )}, ${alpha(medicalColors.secondary, 0.08)})`,
                              border: `2px solid ${alpha(
                                medicalColors.primary,
                                0.2
                              )}`,
                              borderRadius: 3,
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: medicalColors.text.primary,
                                  fontWeight: 600,
                                  lineHeight: 1.8,
                                }}
                              >
                                {typeof user.qualifications === "string"
                                  ? user.qualifications
                                  : JSON.stringify(user.qualifications)}
                              </Typography>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card
                            sx={{
                              background: alpha(medicalColors.text.muted, 0.05),
                              border: `2px dashed ${alpha(
                                medicalColors.text.muted,
                                0.3
                              )}`,
                              borderRadius: 3,
                            }}
                          >
                            <CardContent sx={{ p: 3, textAlign: "center" }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: medicalColors.text.muted,
                                  fontStyle: "italic",
                                }}
                              >
                                Chưa cập nhật thông tin bằng cấp
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Box>

                      {/* Experience */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: medicalColors.text.primary,
                            fontWeight: 700,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <BusinessIcon
                            sx={{ mr: 1.5, color: medicalColors.primary }}
                          />
                          Kinh nghiệm làm việc
                        </Typography>

                        <Card
                          sx={{
                            background: `linear-gradient(135deg, ${alpha(
                              medicalColors.secondary,
                              0.08
                            )}, ${alpha(medicalColors.primary, 0.08)})`,
                            border: `2px solid ${alpha(
                              medicalColors.secondary,
                              0.2
                            )}`,
                            borderRadius: 3,
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: medicalColors.text.primary,
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <ScheduleIcon
                                sx={{ mr: 1, color: medicalColors.secondary }}
                              />
                              {user.experience
                                ? typeof user.experience === "number"
                                  ? `${user.experience} năm kinh nghiệm`
                                  : user.experience
                                : "Chưa cập nhật thông tin kinh nghiệm"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>

                      {/* Bio */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: medicalColors.text.primary,
                            fontWeight: 700,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <DescriptionIcon
                            sx={{ mr: 1.5, color: medicalColors.primary }}
                          />
                          Giới thiệu bản thân
                        </Typography>

                        <Card
                          sx={{
                            background: `linear-gradient(135deg, ${alpha(
                              medicalColors.primary,
                              0.05
                            )}, ${alpha(medicalColors.secondary, 0.05)})`,
                            border: `2px solid ${alpha(
                              medicalColors.primary,
                              0.15
                            )}`,
                            borderRadius: 3,
                          }}
                        >
                          <CardContent sx={{ p: 4 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                color: medicalColors.text.primary,
                                lineHeight: 2,
                                fontSize: "1.1rem",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {user.bio || "Chưa cập nhật thông tin giới thiệu"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    </Stack>
                  ) : user._detailsLoadFailed ? (
                    <Card
                      sx={{
                        background: alpha("#dc2626", 0.05),
                        border: `2px solid ${alpha("#dc2626", 0.2)}`,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#dc2626",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SchoolIcon sx={{ mr: 1, fontSize: 24 }} />
                          Không thể tải thông tin chuyên môn
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{
                        background: alpha(medicalColors.primary, 0.05),
                        border: `2px solid ${alpha(
                          medicalColors.primary,
                          0.2
                        )}`,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: medicalColors.primary,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress size={24} sx={{ mr: 2 }} />
                          Đang tải thông tin chuyên môn...
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
      </DialogContent>

      {/* Enhanced Footer */}
      <DialogActions
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${alpha(
            medicalColors.primary,
            0.05
          )}, ${alpha(medicalColors.secondary, 0.05)})`,
          borderTop: `1px solid ${alpha(medicalColors.primary, 0.15)}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            background: medicalColors.gradient,
            color: medicalColors.white,
            fontWeight: 700,
            borderRadius: 3,
            px: 6,
            py: 2,
            fontSize: "1.1rem",
            textTransform: "none",
            boxShadow: "0 8px 24px rgba(74, 144, 226, 0.4)",
            "&:hover": {
              background: `linear-gradient(45deg, ${alpha(
                medicalColors.primary,
                0.9
              )}, ${alpha(medicalColors.secondary, 0.9)})`,
              transform: "translateY(-2px)",
              boxShadow: "0 12px 32px rgba(74, 144, 226, 0.5)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserModal;

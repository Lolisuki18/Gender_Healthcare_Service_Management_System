/**
 * ProfileContent.js - Component quản lý thông tin hồ sơ cá nhân khách hàng
 *
 * Chức năng chính:
 * - Call API để lấy thông tin cá nhân hiển thị
 * - Inline editing mode với disabled fields cho readonly data
 * - Form validation và error handling
 * - API integration cho việc lưu thông tin
 *
 * Features:
 * - Inline editing mode (không tách form riêng)
 * - Disabled fields cho dữ liệu readonly (email, ID)
 * - Real-time form validation
 * - Loading states khi fetch và submit
 * - Error handling với user feedback
 * - Responsive design với grid system
 *
 * State Management:
 * - isEditing: boolean - Chế độ chỉnh sửa inline
 * - userData: object - Dữ liệu user từ API
 * - formData: object - Dữ liệu form
 * - isLoading: boolean - Trạng thái loading khi fetch
 * - isSaving: boolean - Trạng thái loading khi save
 * - errors: object - Validation errors
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Stack,
  Container,
  Divider,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Wc as GenderIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { userService } from "@/services/userService";
import localStorageUtil from "@/utils/localStorage";
import { notify } from "@/utils/notification";
import { formatDateForInput, formatDateDisplay } from "@/utils/dateUtils";
import { EmailChangeDialog, PasswordChangeDialog } from "./modals";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)",
  color: "#2D3748",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #FFFFFF, #F5F7FA)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(74, 144, 226, 0.12)",
  color: "#2D3748",
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
  overflow: "visible",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "rgba(74, 144, 226, 0.1)",
  marginRight: "16px",
  flexShrink: 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "#4A5568",
    fontSize: "14px",
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-root": {
    color: "#2D3748",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "& fieldset": {
      borderColor: "rgba(74, 144, 226, 0.2)",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(74, 144, 226, 0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4A90E2",
      borderWidth: 2,
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(240, 240, 240, 0.6)",
      color: "#718096",
      "& fieldset": {
        borderColor: "rgba(200, 200, 200, 0.3)",
      },
    },
  },
  "& .MuiInputBase-input": {
    color: "#2D3748",
    fontWeight: 600,
    "&.Mui-disabled": {
      color: "#718096",
      WebkitTextFillColor: "#718096",
    },
  },
}));

// ✅ Updated Field Info Component - Support action button for special fields
const FieldInfoBox = ({
  icon,
  label,
  name,
  value,
  onChange,
  isEditing,
  disabled = false,
  type = "text",
  multiline = false,
  rows = 1,
  options = null,
  backgroundColor,
  iconColor,
  actionButton = null, // ✅ New prop for action button
}) => {
  const isEmailField = type === "email";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "16px",
        background: backgroundColor || "rgba(59, 130, 246, 0.05)",
        border: `1px solid ${
          backgroundColor?.replace("0.05", "0.1") || "rgba(59, 130, 246, 0.1)"
        }`,
        transition: "all 0.3s ease",
        "&:hover": {
          background:
            backgroundColor?.replace("0.05", "0.08") ||
            "rgba(59, 130, 246, 0.08)",
          transform: !isEditing ? "translateY(-2px)" : "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconWrapper
          sx={{
            background:
              backgroundColor?.replace("0.05", "0.1") ||
              "rgba(59, 130, 246, 0.1)",
          }}
        >
          {React.cloneElement(icon, {
            sx: { color: iconColor || "#3b82f6", fontSize: 20 },
          })}
        </IconWrapper>
        <Typography
          variant="body2"
          sx={{
            color: "#4A5568",
            fontWeight: 600,
            flex: 1,
          }}
        >
          {label}
          {/* ✅ Show disabled note for email */}
          {isEmailField && " (Sử dụng nút riêng để thay đổi)"}
        </Typography>
      </Stack>

      {isEditing && !isEmailField ? (
        // ✅ Edit Mode - Show TextField (exclude email)
        options ? (
          // Select Field
          <FormControl fullWidth disabled={disabled}>
            <StyledTextField
              select
              name={name}
              value={value || ""}
              onChange={onChange}
              disabled={disabled}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: disabled
                    ? "rgba(240, 240, 240, 0.6)"
                    : "transparent",
                  "& fieldset": { border: "none" },
                },
                "& .MuiInputBase-input": {
                  padding: "12px 16px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: disabled ? "#718096" : "#2D3748",
                },
              }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Chọn {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StyledTextField>
          </FormControl>
        ) : (
          // Regular TextField (excluding email)
          <StyledTextField
            fullWidth
            name={name}
            type={type}
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            variant="outlined"
            placeholder={`Nhập ${label.toLowerCase()}`}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "transparent",
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": {
                padding: multiline ? "12px 16px" : "12px 16px",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#2D3748",
              },
            }}
          />
        )
      ) : (
        // ✅ View Mode - Show Value with optional action button
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography
            variant="h6"
            sx={{
              color: "#2D3748",
              fontWeight: 700,
              wordBreak: type === "email" ? "break-all" : "break-word",
              minHeight: "1.5rem",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              flex: 1,
            }}
          >
            {value || "Chưa cập nhật"}
          </Typography>

          {/* ✅ Show verified icon for email */}
          {isEmailField && value && (
            <Chip
              icon={<VerifiedIcon />}
              label="Đã xác thực"
              size="small"
              sx={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#059669",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                "& .MuiChip-icon": {
                  color: "#059669",
                },
              }}
            />
          )}

          {/* ✅ Action button for special fields */}
          {actionButton}
        </Stack>
      )}
    </Paper>
  );
};

const ProfileContent = () => {
  // ====================================================================
  // STATE MANAGEMENT
  // ====================================================================
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ User data từ API
  const [userData, setUserData] = useState(null);

  // ✅ Form data để edit
  const [formDataUpdate, setFormDataUpdate] = useState({
    fullName: "",
    phone: "",
    birthDay: "",
    email: "",
    gender: "",
    address: "",
  });

  // ✅ Original data để reset khi cancel
  const [originalData, setOriginalData] = useState({});

  // ✅ Email verification states
  const [emailVerificationDialog, setEmailVerificationDialog] = useState({
    open: false,
    email: "",
    tempEmail: "", // Store the email being verified
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // ✅ Password change states
  const [passwordChangeDialog, setPasswordChangeDialog] = useState({
    open: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ✅ Email change states
  const [emailChangeDialog, setEmailChangeDialog] = useState({
    open: false,
  });

  // ====================================================================
  // EFFECTS
  // ====================================================================

  /**
   * ✅ Fetch user data từ API khi component mount
   */
  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ Countdown timer for resend code
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // ====================================================================
  // API FUNCTIONS
  // ====================================================================

  /**
   * ✅ Fetch user data từ API
   */ const fetchUserData = async () => {
    try {
      console.log("🔄 Đang tải thông tin người dùng từ API...");

      const response = await userService.getCurrentUser();

      if (response.success && response.data) {
        const user = response.data;
        console.log("✅ Đã tải thông tin user:", user);

        setUserData(user);

        // ✅ Set form data từ API response
        const formData = {
          fullName: user.fullName || "",
          phone: user.phone || "",
          birthDay: user.birthDay || "",
          email: user.email || "",
          gender: user.gender || "",
          address: user.address || "",
        };

        setFormDataUpdate(formData);
        setOriginalData(formData);

        // ✅ Sync với localStorage để backup
        localStorageUtil.set("user", user);

        // ✅ Use custom notification
        notify.success("Thành công", "Đã tải thông tin người dùng!", {
          duration: 3000,
        });
      } else {
        throw new Error(
          response.message || "Không thể tải thông tin người dùng"
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải thông tin user:", error);

      if (error.response?.status === 401) {
        // ✅ Use custom notification for error
        notify.error(
          "Lỗi xác thực",
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
          { duration: 6000 }
        );
      } else {
        // ✅ Fallback to localStorage nếu API fail
        const localUser = localStorageUtil.get("user");
        if (localUser) {
          console.log("📦 Sử dụng dữ liệu từ localStorage làm fallback");
          setUserData(localUser);
          const formData = {
            fullName: localUser.fullName || "",
            phone: localUser.phone || "",
            birthDay: localUser.birthDay || "",
            email: localUser.email || "",
            gender: localUser.gender || "",
            address: localUser.address || "",
          };
          setFormDataUpdate(formData);
          setOriginalData(formData);

          // ✅ Use custom notification for warning
          notify.warning(
            "Chế độ offline",
            "Sử dụng dữ liệu đã lưu. Vui lòng kiểm tra kết nối mạng.",
            { duration: 5000 }
          );
        } else {
          // ✅ Use custom notification for error
          notify.error(
            "Lỗi tải dữ liệu",
            "Không thể tải thông tin người dùng!",
            { duration: 4000 }
          );
        }
      }
    } finally {
      // Removed setIsLoading(false) since isLoading is not used
    }
  };

  /**
   * ✅ Refresh data - reload từ API
   */
  const handleRefreshData = async () => {
    setIsRefreshing(true);

    // ✅ Show loading notification
    notify.info("Đang tải", "Đang làm mới dữ liệu...", { duration: 2000 });

    await fetchUserData();
    setIsRefreshing(false);
  };

  // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================
  /**
   * ✅ Format gender display
   */
  const formatGenderDisplay = (gender) => {
    const genderMap = {
      MALE: "Nam",
      FEMALE: "Nữ",
      OTHER: "Khác",
    };
    return genderMap[gender] || gender || "Chưa cập nhật";
  };

  /**
   * ✅ Handle form input change - Remove email change tracking
   */
  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;

    setFormDataUpdate({
      ...formDataUpdate,
      [name]: value,
    });
  };

  /**
   * ✅ Handle save - Simplified without email handling
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // ✅ Validate required fields
      if (!formDataUpdate.fullName.trim()) {
        notify.warning("Thiếu thông tin", "Vui lòng nhập họ tên!", {
          duration: 4000,
        });
        return;
      }

      console.log("🔄 Đang lưu thông tin cá nhân:", formDataUpdate);

      notify.info("Đang xử lý", "Đang lưu thông tin cá nhân...", {
        duration: 2000,
      });

      const updateData = {
        fullName: formDataUpdate.fullName.trim(),
        phone: formDataUpdate.phone?.trim() || "",
        birthDay: formDataUpdate.birthDay || "",
        address: formDataUpdate.address?.trim() || "",
        gender: formDataUpdate.gender || "",
        // ✅ Remove email from update (handled separately)
      };

      const response = await userService.updateProfile(updateData);

      if (response.success) {
        // ✅ Update userData với response từ API
        const updatedUser = response.data || { ...userData, ...updateData };
        setUserData(updatedUser);

        // ✅ Update form data
        const newFormData = {
          ...formDataUpdate,
          ...updateData,
        };
        setFormDataUpdate(newFormData);
        setOriginalData(newFormData);

        // ✅ Sync với localStorage
        localStorageUtil.set("user", updatedUser);

        // ✅ Exit edit mode
        setIsEditing(false);

        notify.success(
          "Cập nhật thành công!",
          "Thông tin cá nhân đã được lưu thành công.",
          { duration: 4000 }
        );

        console.log("✅ Đã lưu thông tin thành công:", updatedUser);
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thông tin:", error);

      if (error.response?.status === 401) {
        notify.error(
          "Lỗi xác thực",
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
          { duration: 6000 }
        );

        localStorageUtil.remove("token");
        localStorageUtil.remove("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi cập nhật thông tin!";

        notify.error("Lỗi cập nhật", errorMessage, { duration: 5000 });
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * ✅ Handle toggle edit mode - Simplified
   */
  const handleToggleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  /**
   * ✅ Handle cancel - Simplified
   */
  const handleCancel = () => {
    // Reset về dữ liệu gốc từ originalData
    setFormDataUpdate({ ...originalData });
    setIsEditing(false);

    notify.info("Đã hủy", "Các thay đổi đã được hủy bỏ.", { duration: 2000 });
  };

  // ====================================================================
  // EMAIL CHANGE FUNCTIONS
  // ====================================================================

  /**
   * ✅ Handle email change button click
   */
  const handleEmailChangeClick = () => {
    setEmailChangeDialog({ open: true });
  };

  /**
   * ✅ Handle send verification code - New function for EmailChangeDialog
   */
  const handleSendCode = async (email) => {
    try {
      notify.info("Đang xử lý", "Đang gửi mã xác nhận đến email mới...", {
        duration: 2000,
      });

      // Call API to send verification code
      const response = await userService.sendEmailVerificationCode(email);

      if (response.success) {
        return Promise.resolve(); // Success for modal to handle
      } else {
        throw new Error(response.message || "Không thể gửi mã xác nhận");
      }
    } catch (error) {
      console.error("❌ Error sending verification code:", error);
      throw error; // Let modal handle the error
    }
  };

  /**
   * ✅ Handle verify and save email - New function for EmailChangeDialog
   */
  const handleVerifyAndSave = async (email, verificationCode) => {
    try {
      notify.info("Đang xác nhận", "Đang xác nhận mã và cập nhật email...", {
        duration: 2000,
      });

      // Call API to verify code and update email
      const response = await userService.verifyEmailChange({
        newEmail: email,
        verificationCode: verificationCode,
      });

      if (response.success) {
        // Update email in form data
        const updatedFormData = {
          ...formDataUpdate,
          email: email,
        };

        setFormDataUpdate(updatedFormData);
        setOriginalData(updatedFormData);

        // Update user data
        const updatedUser = {
          ...userData,
          email: email,
        };
        setUserData(updatedUser);
        localStorageUtil.set("user", updatedUser);

        console.log("✅ Email updated successfully:", updatedUser);

        // ✅ Refresh trang sau khi thay đổi email thành công
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Delay 2s để user thấy thông báo thành công

        return Promise.resolve(); // Success for modal to handle
      } else {
        throw new Error(response.message || "Mã xác nhận không đúng");
      }
    } catch (error) {
      console.error("❌ Error verifying email:", error);
      throw error; // Let modal handle the error
    }
  };

  /**
   * ✅ Close email change dialog
   */
  const handleCloseEmailChangeDialog = () => {
    setEmailChangeDialog({ open: false });
  };

  /**
   * ✅ Remove old email change submit function - No longer needed
   */
  // const handleEmailChangeSubmit = async (email) => { ... } // REMOVED

  /**
   * ✅ Remove old email verification function - No longer needed
   */
  // const handleEmailVerification = async (verificationCode) => { ... } // REMOVED

  /**
   * ✅ Remove old resend code function - No longer needed
   */
  // const handleResendCode = async () => { ... } // REMOVED

  /**
   * ✅ Remove old close email dialog function - No longer needed
   */
  // const handleCloseEmailDialog = () => { ... } // REMOVED

  // ====================================================================
  // PASSWORD CHANGE FUNCTIONS
  // ====================================================================

  /**
   * ✅ Handle password change button click
   */
  const handlePasswordChangeClick = () => {
    setPasswordChangeDialog({ open: true });
  };

  /**
   * ✅ Handle password change
   */
  const handlePasswordChange = async (passwordData) => {
    try {
      setIsChangingPassword(true);

      notify.info("Đang xử lý", "Đang đổi mật khẩu...", { duration: 2000 });

      const response = await userService.changePassword(passwordData);

      if (response.success) {
        setPasswordChangeDialog({ open: false });

        notify.success(
          "Đổi mật khẩu thành công!",
          "Mật khẩu của bạn đã được thay đổi thành công.",
          { duration: 4000 }
        );
      } else {
        throw new Error(response.message || "Không thể đổi mật khẩu");
      }
    } catch (error) {
      console.error("❌ Error changing password:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đổi mật khẩu!";

      notify.error("Lỗi đổi mật khẩu", errorMessage, { duration: 5000 });
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * ✅ Close password change dialog
   */
  const handleClosePasswordDialog = () => {
    setPasswordChangeDialog({ open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* ============================================================== */}
        {/* PROFILE CARD */}
        {/* ============================================================== */}
        <ProfileCard>
          <CardContent sx={{ p: 4 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems="center"
            >
              {/* Avatar Section */}
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      width: { xs: 120, md: 140 },
                      height: { xs: 120, md: 140 },
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      fontSize: { xs: "48px", md: "56px" },
                      fontWeight: 700,
                      boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)",
                      border: "4px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {formDataUpdate.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>

                  {/* Online Status */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(45deg, #4CAF50, #2ECC71)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#fff",
                      }}
                    />
                  </Box>
                </Box>
              </Stack>

              {/* User Info */}
              <Stack
                spacing={2}
                sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#2D3748",
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    {formDataUpdate.fullName || "Chưa có tên"}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#4A5568",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                  >
                    Khách hàng
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#718096",
                      fontSize: "14px",
                    }}
                  >
                    ID: {userData?.id || "GUEST"}
                  </Typography>
                </Stack>

                {/* Quick Info */}
                <Stack direction="row" spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(76, 175, 80, 0.1)",
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#4A5568", mb: 0.5 }}
                    >
                      Ngày sinh
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#2D3748", fontWeight: 600 }}
                    >
                      {formatDateDisplay(formDataUpdate.birthDay)}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(236, 72, 153, 0.1)",
                      border: "1px solid rgba(236, 72, 153, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#4A5568", mb: 0.5 }}
                    >
                      Giới tính
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#2D3748", fontWeight: 600 }}
                    >
                      {formatGenderDisplay(formDataUpdate.gender)}
                    </Typography>
                  </Paper>
                </Stack>
              </Stack>

              {/* Action Buttons */}
              <Stack spacing={2} sx={{ minWidth: { md: 200 } }}>
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  startIcon={
                    isSaving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : isEditing ? (
                      <CancelIcon />
                    ) : (
                      <EditIcon />
                    )
                  }
                  onClick={handleToggleEdit}
                  disabled={isSaving}
                  fullWidth
                  sx={{
                    py: 2,
                    borderRadius: "16px",
                    fontWeight: 600,
                    fontSize: "16px",
                    textTransform: "none",
                    ...(isEditing
                      ? {
                          color: "#ef4444",
                          borderColor: "#ef4444",
                          borderWidth: "2px",
                          "&:hover": {
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            borderColor: "#ef4444",
                            transform: "translateY(-2px)",
                          },
                        }
                      : {
                          background:
                            "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                          boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #1d4ed8, #1e40af)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.5)",
                          },
                        }),
                    transition: "all 0.3s ease",
                  }}
                >
                  {isSaving
                    ? "Đang lưu..."
                    : isEditing
                    ? "Hủy chỉnh sửa"
                    : "Chỉnh sửa hồ sơ"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={
                    isRefreshing ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  onClick={handleRefreshData}
                  disabled={isRefreshing || isEditing}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "12px",
                    fontWeight: 500,
                    fontSize: "14px",
                    textTransform: "none",
                    color: "#4A90E2",
                    borderColor: "#4A90E2",
                    "&:hover": {
                      backgroundColor: "rgba(74, 144, 226, 0.1)",
                      borderColor: "#4A90E2",
                    },
                  }}
                >
                  {isRefreshing ? "Đang tải..." : "Làm mới"}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </ProfileCard>

        {/* ============================================================== */}
        {/* DETAILS SECTION - INLINE EDITING */}
        {/* ============================================================== */}
        <StyledPaper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={4}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <PersonIcon sx={{ color: "#4A90E2", fontSize: 32 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#2D3748",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Thông tin chi tiết
              </Typography>
              {isEditing && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#f59e0b",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  🖊️ Đang chỉnh sửa
                </Typography>
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Form Fields */}
            <Stack spacing={3}>
              {/* ✅ Họ và tên */}
              <FieldInfoBox
                icon={<PersonIcon />}
                label="Họ và tên"
                name="fullName"
                value={formDataUpdate.fullName}
                onChange={handleChangeUpdate}
                isEditing={isEditing}
                disabled={false}
                backgroundColor="rgba(59, 130, 246, 0.05)"
                iconColor="#3b82f6"
              />{" "}
              {/* ✅ Contact Fields Stack */}
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <FieldInfoBox
                    icon={<PhoneIcon />}
                    label="Số điện thoại"
                    name="phone"
                    value={formDataUpdate.phone}
                    onChange={handleChangeUpdate}
                    isEditing={isEditing}
                    disabled={false}
                    type="tel"
                    backgroundColor="rgba(16, 185, 129, 0.05)"
                    iconColor="#10b981"
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <FieldInfoBox
                    icon={<EmailIcon />}
                    label="Email"
                    name="email"
                    value={formDataUpdate.email}
                    onChange={handleChangeUpdate}
                    isEditing={isEditing}
                    disabled={true} // ✅ Always disabled, use separate button
                    type="email"
                    backgroundColor="rgba(139, 92, 246, 0.05)"
                    iconColor="#8b5cf6"
                    actionButton={
                      !isEditing && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleEmailChangeClick}
                          startIcon={<EditIcon />}
                          sx={{
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            py: 0.5,
                            px: 2,
                            color: "#8b5cf6",
                            borderColor: "#8b5cf6",
                            "&:hover": {
                              backgroundColor: "rgba(139, 92, 246, 0.1)",
                              borderColor: "#7c3aed",
                            },
                          }}
                        >
                          Đổi Email
                        </Button>
                      )
                    }
                  />
                </Box>
              </Stack>
              {/* ✅ Personal Info Stack */}
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <FieldInfoBox
                    icon={<CakeIcon />}
                    label="Ngày sinh"
                    name="birthDay"
                    value={
                      isEditing
                        ? formatDateForInput(formDataUpdate.birthDay)
                        : formatDateDisplay(formDataUpdate.birthDay)
                    }
                    onChange={handleChangeUpdate}
                    isEditing={isEditing}
                    disabled={false}
                    type="date"
                    backgroundColor="rgba(245, 158, 11, 0.05)"
                    iconColor="#f59e0b"
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <FieldInfoBox
                    icon={<GenderIcon />}
                    label="Giới tính"
                    name="gender"
                    value={
                      isEditing
                        ? formDataUpdate.gender
                        : formatGenderDisplay(formDataUpdate.gender)
                    }
                    onChange={handleChangeUpdate}
                    isEditing={isEditing}
                    disabled={false}
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                    backgroundColor="rgba(236, 72, 153, 0.05)"
                    iconColor="#ec4899"
                  />
                </Box>
              </Stack>{" "}
              {/* ✅ Địa chỉ */}
              <FieldInfoBox
                icon={<LocationIcon />}
                label="Địa chỉ"
                name="address"
                value={formDataUpdate.address}
                onChange={handleChangeUpdate}
                isEditing={isEditing}
                disabled={false}
                multiline={true}
                rows={3}
                backgroundColor="rgba(239, 68, 68, 0.05)"
                iconColor="#ef4444"
              />
              {/* ✅ Password Field với nút đổi mật khẩu */}
              <FieldInfoBox
                icon={<LockIcon />}
                label="Mật khẩu"
                name="password"
                value="••••••••" // Display masked password
                onChange={() => {}} // No change handler needed
                isEditing={false} // Never editable directly
                disabled={true}
                type="password"
                backgroundColor="rgba(239, 68, 68, 0.05)"
                iconColor="#ef4444"
                actionButton={
                  !isEditing && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePasswordChangeClick}
                      startIcon={<LockIcon />}
                      sx={{
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        py: 0.5,
                        px: 2,
                        color: "#ef4444",
                        borderColor: "#ef4444",
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderColor: "#dc2626",
                        },
                      }}
                    >
                      Đổi mật khẩu
                    </Button>
                  )
                }
              />
              {/* Action Buttons - CHỈ HIỂN THỊ KHI ĐANG EDIT */}
              {isEditing && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: "rgba(74, 144, 226, 0.05)",
                    border: "1px solid rgba(74, 144, 226, 0.1)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isSaving}
                      startIcon={<CancelIcon />}
                      sx={{
                        px: 4,
                        py: 2,
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#ef4444",
                        borderColor: "#ef4444",
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderColor: "#ef4444",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Hủy
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={isSaving}
                      startIcon={
                        isSaving ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      sx={{
                        px: 4,
                        py: 2,
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "16px",
                        background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1d4ed8, #1e40af)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                        },
                        "&:disabled": {
                          background: "#ccc",
                          transform: "none",
                          boxShadow: "none",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Stack>
        </StyledPaper>

        {/* ============================================================== */}
        {/* EMAIL CHANGE DIALOG - Updated to use new modal */}
        {/* ============================================================== */}
        <EmailChangeDialog
          open={emailChangeDialog.open}
          onClose={handleCloseEmailChangeDialog}
          onSendCode={handleSendCode}
          onVerifyAndSave={handleVerifyAndSave}
          isSendingCode={isSendingCode}
          isVerifying={isVerifying}
          currentEmail={formDataUpdate.email}
        />

        {/* ============================================================== */}
        {/* REMOVE OLD EMAIL VERIFICATION DIALOG - No longer needed */}
        {/* ============================================================== */}
        {/* <EmailVerificationDialog ... /> */}

        {/* ============================================================== */}
        {/* PASSWORD CHANGE DIALOG */}
        {/* ============================================================== */}
        <PasswordChangeDialog
          open={passwordChangeDialog.open}
          onClose={handleClosePasswordDialog}
          onChangePassword={handlePasswordChange}
          isChanging={isChangingPassword}
        />
      </Stack>
    </Container>
  );
};

export default ProfileContent;

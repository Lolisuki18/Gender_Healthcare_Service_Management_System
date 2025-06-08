/**
 * CONFIRMATION DIALOG SYSTEM
 * ==========================
 * Hệ thống dialog xác nhận đẹp thay thế cho window.confirm()
 *
 * CÁCH SỬ DỤNG:
 * -------------
 * Đơn giản:
 *   import { confirmDialog } from '@/utils/confirmDialog';
 *   const result = await confirmDialog('Bạn có chắc chắn muốn xóa?');
 *   if (result) { // User clicked "Có" }
 *
 * Với tuỳ chọn:
 *   const result = await confirmDialog({
 *     title: 'Xác nhận xóa',
 *     message: 'Bạn có chắc chắn muốn xóa người dùng "Nguyễn Văn A"?',
 *     confirmText: 'Xóa',
 *     cancelText: 'Hủy',
 *     type: 'danger'
 *   });
 *
 * CÁC LOẠI DIALOG:
 * ---------------
 * - danger: Màu đỏ cho hành động nguy hiểm (xóa, hủy)
 * - warning: Màu vàng cho cảnh báo
 * - info: Màu xanh cho thông tin
 * - success: Màu xanh lá cho xác nhận tích cực
 */

import React from "react";
import ReactDOM from "react-dom/client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Icons cho từng loại dialog
const DIALOG_ICONS = {
  danger: <ErrorIcon sx={{ fontSize: 48 }} />,
  warning: <WarningIcon sx={{ fontSize: 48 }} />,
  info: <InfoIcon sx={{ fontSize: 48 }} />,
  success: <SuccessIcon sx={{ fontSize: 48 }} />,
};

// Colors cho từng loại dialog
const DIALOG_COLORS = {
  danger: {
    icon: "#EF4444",
    confirm: "#EF4444",
    confirmHover: "#DC2626",
    background: "#FEF2F2",
    border: "#FECACA",
  },
  warning: {
    icon: "#F59E0B",
    confirm: "#F59E0B",
    confirmHover: "#D97706",
    background: "#FFFBEB",
    border: "#FDE68A",
  },
  info: {
    icon: "#3B82F6",
    confirm: "#3B82F6",
    confirmHover: "#2563EB",
    background: "#EFF6FF",
    border: "#BFDBFE",
  },
  success: {
    icon: "#10B981",
    confirm: "#10B981",
    confirmHover: "#059669",
    background: "#ECFDF5",
    border: "#BBF7D0",
  },
};

/**
 * Component ConfirmDialog
 */
const ConfirmDialog = ({
  open,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  type,
  onConfirm,
  showCloseButton,
}) => {
  const colors = DIALOG_COLORS[type] || DIALOG_COLORS.info;
  const icon = DIALOG_ICONS[type] || DIALOG_ICONS.info;

  const handleConfirm = () => {
    onConfirm?.(true);
    onClose();
  };

  const handleCancel = () => {
    onConfirm?.(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px !important", // ✅ Force border radius with !important
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: `2px solid ${colors.border}`,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          overflow: "visible",
          // ✅ Additional border radius fixes
          "& .MuiDialog-paper": {
            borderRadius: "16px !important",
          },
          "&.MuiPaper-root": {
            borderRadius: "16px !important",
          },
          // ✅ Ensure all child elements respect the border radius
          "& *": {
            "&:first-of-type": {
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
            "&:last-of-type": {
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            },
          },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        },
      }}
      // ✅ Add style prop as additional override
      style={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
        },
      }}
    >
      {/* Header với icon */}
      <DialogTitle
        sx={{
          textAlign: "center",
          pt: 4,
          pb: 2,
          position: "relative",
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          // ✅ Ensure header has proper border radius
          borderTopLeftRadius: "16px !important",
          borderTopRightRadius: "16px !important",
          margin: 0, // Remove any default margins
        }}
      >
        {/* Close button */}
        {showCloseButton && (
          <IconButton
            onClick={handleCancel}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "rgba(107, 114, 128, 0.1)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            color: colors.icon,
          }}
        >
          {icon}
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "1.5rem",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          textAlign: "center",
          py: 3,
          px: 4,
          margin: 0, // Remove any default margins
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#4B5563",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          p: 3,
          pt: 1,
          // ✅ Ensure footer has proper border radius
          borderBottomLeftRadius: "16px !important",
          borderBottomRightRadius: "16px !important",
          margin: 0, // Remove any default margins
        }}
      >
        {/* Cancel Button */}
        <Button
          onClick={handleCancel}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 120,
            py: 1.5,
            px: 3,
            borderRadius: "12px !important", // ✅ Force button border radius
            borderColor: "#D1D5DB",
            color: "#6B7280",
            fontSize: "1rem",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "rgba(107, 114, 128, 0.05)",
              transform: "translateY(-1px)",
              borderRadius: "12px !important", // ✅ Maintain border radius on hover
            },
            transition: "all 0.2s ease",
          }}
        >
          {cancelText}
        </Button>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          sx={{
            minWidth: 120,
            py: 1.5,
            px: 3,
            borderRadius: "12px !important", // ✅ Force button border radius
            backgroundColor: colors.confirm,
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: `0 4px 12px ${colors.confirm}40`,
            "&:hover": {
              backgroundColor: colors.confirmHover,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 25px ${colors.confirm}50`,
              borderRadius: "12px !important", // ✅ Maintain border radius on hover
            },
            transition: "all 0.3s ease",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Hàm tạo và hiển thị confirm dialog
 */
const showConfirmDialog = (options) => {
  return new Promise((resolve) => {
    // Parse options
    const config = typeof options === "string" ? { message: options } : options;

    const {
      title = "Xác nhận",
      message = "Bạn có chắc chắn muốn thực hiện hành động này?",
      confirmText = "Có",
      cancelText = "Hủy",
      type = "info",
      showCloseButton = true,
    } = config;

    // Tạo container
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    // Cleanup function
    const cleanup = () => {
      setTimeout(() => {
        root.unmount();
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 300);
    };

    // Render dialog
    const handleClose = () => {
      setOpen(false);
      cleanup();
    };

    const handleConfirm = (result) => {
      resolve(result);
    };

    let setOpen;
    const DialogWrapper = () => {
      const [open, setOpenState] = React.useState(true);
      setOpen = setOpenState;

      return (
        <ConfirmDialog
          open={open}
          onClose={handleClose}
          title={title}
          message={message}
          confirmText={confirmText}
          cancelText={cancelText}
          type={type}
          showCloseButton={showCloseButton}
          onConfirm={handleConfirm}
        />
      );
    };

    root.render(<DialogWrapper />);
  });
};

/**
 * Các hàm tiện ích cho từng loại dialog
 */
export const confirmDialog = {
  /**
   * Dialog xác nhận chung
   */
  show: showConfirmDialog,

  /**
   * Dialog xác nhận hành động nguy hiểm (màu đỏ)
   */
  danger: (message, options = {}) =>
    showConfirmDialog({
      type: "danger",
      title: "Cảnh báo",
      confirmText: "Xóa",
      message,
      ...options,
    }),

  /**
   * Dialog cảnh báo (màu vàng)
   */
  warning: (message, options = {}) =>
    showConfirmDialog({
      type: "warning",
      title: "Cảnh báo",
      confirmText: "Tiếp tục",
      message,
      ...options,
    }),

  /**
   * Dialog thông tin (màu xanh)
   */
  info: (message, options = {}) =>
    showConfirmDialog({
      type: "info",
      title: "Thông báo",
      confirmText: "Đồng ý",
      message,
      ...options,
    }),

  /**
   * Dialog xác nhận tích cực (màu xanh lá)
   */
  success: (message, options = {}) =>
    showConfirmDialog({
      type: "success",
      title: "Xác nhận",
      confirmText: "Đồng ý",
      message,
      ...options,
    }),
};

export default confirmDialog;

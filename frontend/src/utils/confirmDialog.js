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

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

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
    icon: '#EF4444',
    confirm: '#EF4444',
    confirmHover: '#DC2626',
    background: '#FEF2F2',
    border: '#FECACA',
  },
  warning: {
    icon: '#F59E0B',
    confirm: '#F59E0B',
    confirmHover: '#D97706',
    background: '#FFFBEB',
    border: '#FDE68A',
  },
  info: {
    icon: '#3B82F6',
    confirm: '#3B82F6',
    confirmHover: '#2563EB',
    background: '#EFF6FF',
    border: '#BFDBFE',
  },
  success: {
    icon: '#10B981',
    confirm: '#10B981',
    confirmHover: '#059669',
    background: '#ECFDF5',
    border: '#BBF7D0',
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
          borderRadius: '16px !important', // ✅ Force border radius with !important
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: `2px solid ${colors.border}`,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'visible',
          // ✅ Additional border radius fixes
          '& .MuiDialog-paper': {
            borderRadius: '16px !important',
          },
          '&.MuiPaper-root': {
            borderRadius: '16px !important',
          },
          // ✅ Ensure all child elements respect the border radius
          '& *': {
            '&:first-of-type': {
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            },
            '&:last-of-type': {
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
            },
          },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
        },
      }}
      // ✅ Add style prop as additional override
      style={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}
    >
      {/* Header với icon */}
      <DialogTitle
        sx={{
          textAlign: 'center',
          pt: 4,
          pb: 2,
          position: 'relative',
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          // ✅ Ensure header has proper border radius
          borderTopLeftRadius: '16px !important',
          borderTopRightRadius: '16px !important',
          margin: 0, // Remove any default margins
        }}
      >
        {/* Close button */}
        {showCloseButton && (
          <IconButton
            onClick={handleCancel}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#6B7280',
              '&:hover': {
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* Icon */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
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
            color: '#1F2937',
            fontSize: '1.5rem',
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          textAlign: 'center',
          py: 3,
          px: 4,
          margin: 0, // Remove any default margins
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#4B5563',
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          justifyContent: 'center',
          gap: 2,
          p: 3,
          pt: 1,
          // ✅ Ensure footer has proper border radius
          borderBottomLeftRadius: '16px !important',
          borderBottomRightRadius: '16px !important',
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
            borderRadius: '12px !important', // ✅ Force button border radius
            borderColor: '#D1D5DB',
            color: '#6B7280',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#9CA3AF',
              backgroundColor: 'rgba(107, 114, 128, 0.05)',
              transform: 'translateY(-1px)',
              borderRadius: '12px !important', // ✅ Maintain border radius on hover
            },
            transition: 'all 0.2s ease',
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
            borderRadius: '12px !important', // ✅ Force button border radius
            backgroundColor: colors.confirm,
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: `0 4px 12px ${colors.confirm}40`,
            '&:hover': {
              backgroundColor: colors.confirmHover,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 25px ${colors.confirm}50`,
              borderRadius: '12px !important', // ✅ Maintain border radius on hover
            },
            transition: 'all 0.3s ease',
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
    const config = typeof options === 'string' ? { message: options } : options;

    const {
      title = 'Xác nhận',
      message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
      confirmText = 'Có',
      cancelText = 'Đóng',
      type = 'info',
      showCloseButton = true,
    } = config;

    // Tạo container
    const container = document.createElement('div');
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
      type: 'danger',
      title: 'Cảnh báo',
      confirmText: 'Xóa',
      message,
      ...options,
    }),

  /**
   * Dialog cảnh báo (màu vàng)
   */
  warning: (message, options = {}) =>
    showConfirmDialog({
      type: 'warning',
      title: 'Cảnh báo',
      confirmText: 'Tiếp tục',
      message,
      ...options,
    }),

  /**
   * Dialog thông tin (màu xanh)
   */
  info: (message, options = {}) =>
    showConfirmDialog({
      type: 'info',
      title: 'Thông báo',
      confirmText: 'Đồng ý',
      message,
      ...options,
    }),

  /**
   * Dialog xác nhận tích cực (màu xanh lá)
   */
  success: (message, options = {}) =>
    showConfirmDialog({
      type: 'success',
      title: 'Xác nhận',
      confirmText: 'Đồng ý',
      message,
      ...options,
    }),

  /**
   * Dialog xác nhận từ chối/hủy (màu đỏ, nút 'Từ chối')
   */
  cancel: (message, options = {}) =>
    showConfirmDialog({
      type: 'danger',
      title: 'Xác nhận từ chối',
      confirmText: 'Từ chối',
      message,
      ...options,
    }),

  /**
   * Dialog xác nhận huỷ với ô nhập lý do (bắt buộc)
   * @param {string|object} message - Thông báo hoặc options
   * @returns {Promise<string|null>} Lý do huỷ hoặc null nếu huỷ
   */
  cancelWithReason: (message, options = {}) =>
    new Promise((resolve) => {
      const config = typeof message === 'string' ? { message } : message;
      const {
        title = 'Xác nhận huỷ lịch hẹn',
        message:
          msg = 'Bạn có chắc chắn muốn huỷ lịch hẹn này? Hành động này không thể hoàn tác.',
        confirmText = 'Xác nhận huỷ',
        cancelText = 'Đóng',
        type = 'danger',
        showCloseButton = true,
      } = { ...config, ...options };

      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = ReactDOM.createRoot(container);

      const cleanup = () => {
        setTimeout(() => {
          root.unmount();
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 300);
      };

      const DialogCancelReason = () => {
        const [open, setOpen] = React.useState(true);
        const [reason, setReason] = React.useState('');
        const [error, setError] = React.useState('');

        const handleClose = () => {
          setOpen(false);
          cleanup();
          resolve(null);
        };

        const handleConfirm = () => {
          if (!reason.trim()) {
            setError('Vui lòng nhập lý do huỷ.');
            return;
          }
          setOpen(false);
          cleanup();
          resolve(reason.trim());
        };

        const colors = DIALOG_COLORS[type] || DIALOG_COLORS.info;
        const icon = DIALOG_ICONS[type] || DIALOG_ICONS.info;

        return (
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '16px !important',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${colors.border}`,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                overflow: 'visible',
              },
            }}
            BackdropProps={{
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
              },
            }}
          >
            <DialogTitle
              sx={{
                textAlign: 'center',
                pt: 4,
                pb: 2,
                position: 'relative',
                background: colors.background,
                borderBottom: `1px solid ${colors.border}`,
                borderTopLeftRadius: '16px !important',
                borderTopRightRadius: '16px !important',
                margin: 0,
              }}
            >
              {showCloseButton && (
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: '#6B7280',
                    '&:hover': {
                      backgroundColor: 'rgba(107, 114, 128, 0.1)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  color: colors.icon,
                }}
              >
                {icon}
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1.5rem' }}
              >
                {title}
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{ textAlign: 'center', py: 3, px: 4, margin: 0 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#4B5563',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                {msg}
              </Typography>
              <TextField
                label="Lý do huỷ lịch hẹn"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                fullWidth
                multiline
                minRows={2}
                error={!!error}
                helperText={error}
                autoFocus
                sx={{ mt: 2, background: '#fff', borderRadius: 2 }}
              />
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                gap: 2,
                p: 3,
                pt: 1,
                borderBottomLeftRadius: '16px !important',
                borderBottomRightRadius: '16px !important',
                margin: 0,
              }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                size="large"
                sx={{
                  minWidth: 120,
                  py: 1.5,
                  px: 3,
                  borderRadius: '12px !important',
                  borderColor: '#D1D5DB',
                  color: '#6B7280',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: 'rgba(107, 114, 128, 0.05)',
                    transform: 'translateY(-1px)',
                    borderRadius: '12px !important',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                size="large"
                sx={{
                  minWidth: 120,
                  py: 1.5,
                  px: 3,
                  borderRadius: '12px !important',
                  backgroundColor: colors.confirm,
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${colors.confirm}40`,
                  '&:hover': {
                    backgroundColor: colors.confirmHover,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${colors.confirm}50`,
                    borderRadius: '12px !important',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {confirmText}
              </Button>
            </DialogActions>
          </Dialog>
        );
      };

      root.render(<DialogCancelReason />);
    }),

  /**
   * Dialog nhập nội dung trả lời câu hỏi
   * @param {Object} options
   *   - question: {content, customerName, createdAt}
   *   - defaultAnswer: string
   *   - title: string
   *   - confirmText: string
   *   - cancelText: string
   * @returns {Promise<string|null>} Nội dung trả lời hoặc null nếu hủy
   */
  answer: (options = {}) =>
    new Promise((resolve) => {
      const { question = {}, defaultAnswer = '' } = options;

      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = ReactDOM.createRoot(container);

      const cleanup = () => {
        setTimeout(() => {
          root.unmount();
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 300);
      };

      const DialogAnswer = () => {
        const [open, setOpen] = React.useState(true);
        const [answer, setAnswer] = React.useState(defaultAnswer);
        const [error, setError] = React.useState('');

        const handleClose = () => {
          setOpen(false);
          cleanup();
          resolve(null);
        };

        const handleSend = () => {
          if (!answer.trim()) {
            setError('Vui lòng nhập nội dung trả lời.');
            return;
          }
          setOpen(false);
          cleanup();
          resolve(answer.trim());
        };

        return (
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(74,144,226,0.18)',
                overflow: 'visible',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: 0.5,
                py: 2.5,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <svg width={28} height={28} style={{ marginRight: 8 }}>
                  <circle cx={14} cy={14} r={14} fill="#fff" />
                  <text
                    x={14}
                    y={20}
                    textAnchor="middle"
                    fontSize={18}
                    fill="#4A90E2"
                  >
                    ?
                  </text>
                </svg>
              </span>
              Trả lời câu hỏi
            </DialogTitle>
            <DialogContent
              sx={{
                pt: 3,
                px: 4,
                background: 'linear-gradient(135deg, #fff 80%, #f8fafc 100%)',
              }}
            >
              {/* PHẦN 1: Thông tin người hỏi */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: '#1976d2' }}
                >
                  {question.customerName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: 13 }}
                >
                  {question.createdAt ? `lúc ${question.createdAt}` : ''}
                </Typography>
              </Box>
              {/* PHẦN 2: Nội dung câu hỏi */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#1976d2',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  💬 Nội dung câu hỏi:
                </Typography>
              </Box>
              <Box
                sx={{
                  background: '#f4f8fb',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  boxShadow: '0 1px 4px #4A90E215',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#222',
                    fontWeight: 500,
                    wordWrap: 'break-word', // Wrap từ dài
                    wordBreak: 'break-word', // Break từ nếu cần
                    whiteSpace: 'pre-wrap', // Giữ nguyên line breaks và spaces
                    overflowWrap: 'break-word', // Wrap overflow text
                    lineHeight: 1.6, // Tăng line height cho dễ đọc
                    maxWidth: '100%',
                  }}
                >
                  {question.content}
                </Typography>
              </Box>
              {/* PHẦN 3: Ô nhập trả lời */}
              <TextField
                label="Nội dung trả lời"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError('');
                }}
                fullWidth
                multiline
                minRows={4}
                error={!!error}
                helperText={error}
                autoFocus
                sx={{
                  background: '#fff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1.08rem',
                    background: '#fff',
                    '&.Mui-focused fieldset': {
                      borderColor: '#4A90E2',
                      borderWidth: 2,
                    },
                  },
                  mb: 2,
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3, gap: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 4,
                  color: '#4A90E2',
                  borderColor: '#b2dfdb',
                  '&:hover': { background: '#e3f2fd', borderColor: '#4A90E2' },
                }}
              >
                Đóng
              </Button>
              <Button
                onClick={handleSend}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  px: 4,
                  boxShadow: '0 2px 8px #4A90E222',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                  },
                }}
              >
                GỬI TRẢ LỜI
              </Button>
            </DialogActions>
          </Dialog>
        );
      };

      root.render(<DialogAnswer />);
    }),

  /**
   * Dialog xem chi tiết câu trả lời cho câu hỏi
   * @param {Object} options
   *   - question: {title, content, customerName, createdAt, category}
   *   - answer: string
   *   - title: string
   *   - closeText: string
   * @returns {Promise<void>}
   */
  viewAnswer: (options = {}) =>
    new Promise((resolve) => {
      const {
        question = {},
        answer = '',
        title = 'Chi tiết câu hỏi',
        closeText = 'Đóng',
      } = options;

      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = ReactDOM.createRoot(container);

      const cleanup = () => {
        setTimeout(() => {
          root.unmount();
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 300);
      };

      const DialogView = () => {
        const [open, setOpen] = React.useState(true);

        const handleClose = () => {
          setOpen(false);
          cleanup();
          resolve();
        };

        return (
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(74,144,226,0.18)',
                overflow: 'visible',
              },
            }}
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: 0.5,
                py: 2.5,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <svg width={28} height={28} style={{ marginRight: 8 }}>
                  <circle cx={14} cy={14} r={14} fill="#fff" />
                  <text
                    x={14}
                    y={20}
                    textAnchor="middle"
                    fontSize={18}
                    fill="#4A90E2"
                  >
                    &#128065;
                  </text>
                </svg>
              </span>
              {title}
            </DialogTitle>
            <DialogContent
              sx={{
                pt: 3,
                px: 4,
                background: 'linear-gradient(135deg, #fff 80%, #f8fafc 100%)',
              }}
            >
              <Box sx={{ mb: 1 }}>
                {question.title && (
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#1976d2' }}
                  >
                    Tiêu đề:
                  </Typography>
                )}
                {question.title && (
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    {question.title}
                  </Typography>
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Nội dung:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  {question.content}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: 13, mb: 1 }}
                >
                  Người hỏi: {question.customerName}{' '}
                  {question.createdAt && `| Ngày tạo: ${question.createdAt}`}
                  {question.category && (
                    <span style={{ marginLeft: 8 }}>
                      <span
                        style={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          borderRadius: 8,
                          padding: '2px 8px',
                          fontSize: 12,
                          fontWeight: 500,
                          marginLeft: 4,
                        }}
                      >
                        {question.category}
                      </span>
                    </span>
                  )}
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}
              >
                Câu trả lời:
              </Typography>
              <Box
                sx={{
                  background: '#e8f5e9',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  fontWeight: 500,
                  fontSize: 16,
                  color: '#222',
                }}
              >
                {answer}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 4,
                  color: '#4A90E2',
                  borderColor: '#b2dfdb',
                  '&:hover': { background: '#e3f2fd', borderColor: '#4A90E2' },
                }}
              >
                {closeText}
              </Button>
            </DialogActions>
          </Dialog>
        );
      };

      root.render(<DialogView />);
    }),
};

export default confirmDialog;

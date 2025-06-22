import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ResultModal - Modal tái sử dụng cho mọi loại kết quả hoặc nội dung động
 * Props:
 *   open: boolean - trạng thái mở/đóng
 *   onClose: function - hàm đóng modal
 *   title: string | ReactNode - tiêu đề modal
 *   icon: ReactNode - icon hiển thị bên trái tiêu đề (tùy chọn)
 *   children: ReactNode - nội dung động bên trong modal
 */
const ResultModal = ({ open, onClose, title, icon, children }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: '8px',
        background: '#ffffff',
      },
    }}
  >
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f0f9ff',
        color: '#1e3a8a',
        fontWeight: 600,
        borderBottom: '1px solid #bfdbfe',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        pb: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ pt: 3 }}>{children}</DialogContent>
  </Dialog>
);

export default ResultModal;

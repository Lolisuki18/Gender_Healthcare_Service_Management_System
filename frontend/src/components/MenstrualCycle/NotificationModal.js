import React, { useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';

const NotificationModal = ({ 
  open, 
  onClose, 
  preferences, 
  onPreferenceChange, 
  onSave 
}) => {
  // Handle body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const notificationOptions = [
    {
      key: 'ovulationReminder',
      title: 'Nhắc nhở thời kỳ rụng trứng',
      description: 'Bạn sẽ nhận thông báo khi đến thời kỳ rụng trứng',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )
    },
    {
      key: 'pregnancyProbability',
      title: 'Thông báo tỉ lệ mang thai',
      description: 'Bạn sẽ nhận thông báo vào những ngày có tỉ lệ mang thai cao (thường sẽ trước ngày rụng trứng 5 ngày đến sau ngày rụng trứng 1 ngày)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m-4-8V7a2 2 0 0 1 2-2h2M8 7V3m8 4V3m0 8h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m4-8V7a2 2 0 0 0-2-2h-2"></path>
        </svg>
      )
    }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePreferenceToggle = (key) => {
    onPreferenceChange(key, !preferences[key]);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 1, sm: 2 },
        zIndex: 1300,
      }}
      onClick={handleBackdropClick}
    >
      <Fade in={open}>
        <Box
          sx={{
            outline: 'none',
            width: { xs: '95vw', sm: '90vw', md: '500px' },
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            padding: { xs: 2, sm: 3 },
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                marginBottom: 2,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
              Cài đặt thông báo
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Chọn các loại thông báo bạn muốn nhận về chu kỳ kinh nguyệt
            </Typography>
          </Box>

          {/* Notification Options */}
          <Box sx={{ mb: 3 }}>
            {notificationOptions.map((option) => (
              <Box
                key={option.key}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: 2,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  marginBottom: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 69, 19, 0.05)',
                    borderColor: '#8B4513',
                  },
                }}
                onClick={() => handlePreferenceToggle(option.key)}
              >
                {/* Checkbox */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: preferences[option.key] ? '#8B4513' : '#ccc',
                    backgroundColor: preferences[option.key] ? '#8B4513' : 'transparent',
                    color: preferences[option.key] ? 'white' : 'transparent',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </Box>
                
                {/* Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 69, 19, 0.1)',
                    color: '#8B4513',
                    flexShrink: 0,
                  }}
                >
                  {option.icon}
                </Box>
                
                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Hủy
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#8B4513',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Lưu chu kỳ
            </button>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default NotificationModal;

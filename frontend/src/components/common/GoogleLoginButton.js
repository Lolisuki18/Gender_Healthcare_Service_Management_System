/**
 * GoogleLoginButton.js - Component nút đăng nhập Google sử dụng Google Identity Services
 * 
 * Tính năng:
 * - Hiển thị nút đăng nhập Google với styling đẹp
 * - Xử lý Google Identity Services OAuth flow
 * - Tích hợp với Redux store để cập nhật auth state
 */

import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { googleOAuthService } from '@/services/googleOAuthService';
import { loginSuccess } from '@/redux/slices/authSlice';
import { notify } from '@/utils/notify';
import localStorageUtil from '@/utils/localStorage';

const GoogleLoginButton = ({ 
  variant = 'outlined', 
  fullWidth = true, 
  disabled = false,
  onSuccess,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Identity Services khi component mount
    const loadGoogle = async () => {
      try {
        await googleOAuthService.initializeGoogleAuth();
        setIsGoogleReady(true);
      } catch (error) {
        console.error('Failed to initialize Google Identity Services:', error);
        notify.error('Lỗi khởi tạo Google', error.message || 'Không thể khởi tạo Google Identity Services');
      }
    };

    loadGoogle();
  }, []);

  const handleGoogleLogin = async () => {
    if (!isGoogleReady) {
      notify.error('Lỗi khởi tạo', 'Google Identity Services chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    setLoading(true);

    try {
      const response = await googleOAuthService.signInWithGoogle();

      if (response.accessToken) {
        // Lưu tokens vào localStorage sử dụng method tiện ích
        localStorageUtil.setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });

        // Cập nhật Redux store
        dispatch(loginSuccess({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        }));

        // Lấy tên người dùng với fallback
        const userName = response.user?.fullName || response.user?.name || response.user?.email || 'Người dùng';
        
        // Thông báo thành công
        notify.success('Đăng nhập thành công', `Chào mừng ${userName}!`);

        // Gọi callback nếu có
        if (onSuccess) {
          onSuccess(response);
        } else {
          // Navigate về trang chủ, routes sẽ redirect tự động dựa trên Redux state
          navigate('/', { replace: true });
        }
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (error) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Đăng nhập Google thất bại. Vui lòng thử lại.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes('popup_closed_by_user')) {
        errorMessage = 'Bạn đã hủy đăng nhập Google.';
      } else if (error.message?.includes('access_denied')) {
        errorMessage = 'Bạn đã từ chối quyền truy cập Google.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      notify.error('Lỗi đăng nhập', errorMessage);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading || !isGoogleReady}
      onClick={handleGoogleLogin}
      startIcon={
        loading ? (
          <CircularProgress 
            size={20} 
            sx={{ 
              color: '#4285f4',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
        ) : (
          <GoogleIcon 
            sx={{
              fontSize: '1.4rem',
              background: 'linear-gradient(45deg, #4285f4, #34a853, #fbbc04, #ea4335)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
            }}
          />
        )
      }
      sx={{
        py: 2,
        px: 4,
        borderRadius: 3,
        textTransform: 'none',
        fontSize: '1.1rem',
        fontWeight: 600,
        border: '2px solid #e0e0e0',
        color: '#424242',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        
        // Google brand colors and styling
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #4285f4 0%, #34a853 25%, #fbbc04 50%, #ea4335 75%, #4285f4 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 0,
        },
        
        '&:hover': {
          backgroundColor: '#f8f9fa',
          borderColor: '#dadce0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
          
          '&:before': {
            opacity: 0.05,
          },
          
          '& .MuiButton-startIcon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
        },
        
        '&:active': {
          transform: 'translateY(0px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
        },
        
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          transform: 'none',
          
          '&:hover': {
            backgroundColor: '#ffffff',
            transform: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
        
        // Icon styling
        '& .MuiButton-startIcon': {
          marginRight: 2,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1,
          
          '& svg': {
            fontSize: '1.4rem',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          },
        },
        
        // Text styling
        '& .MuiButton-text': {
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(45deg, #4285f4, #34a853)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          transition: 'all 0.3s ease',
        },
        
        // Loading state
        '&.loading': {
          '& .MuiCircularProgress-root': {
            color: '#4285f4',
          },
        },
        
        // Focus state
        '&:focus-visible': {
          outline: '2px solid #4285f4',
          outlineOffset: '2px',
        },
        
        // Responsive design
        '@media (max-width: 600px)': {
          fontSize: '1rem',
          py: 1.8,
          px: 3,
        },
        
        // Dark mode support
        '@media (prefers-color-scheme: dark)': {
          backgroundColor: '#1e1e1e',
          borderColor: '#404040',
          color: '#e0e0e0',
          
          '&:hover': {
            backgroundColor: '#2a2a2a',
            borderColor: '#505050',
          },
        },
      }}
    >
      <span style={{
        background: loading ? 'inherit' : 'linear-gradient(45deg, #4285f4 0%, #34a853 40%, #fbbc04 60%, #ea4335 100%)',
        backgroundClip: loading ? 'unset' : 'text',
        WebkitBackgroundClip: loading ? 'unset' : 'text',
        color: loading ? 'inherit' : 'transparent',
        fontWeight: 600,
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease',
      }}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
      </span>
    </Button>
  );
};

export default GoogleLoginButton;

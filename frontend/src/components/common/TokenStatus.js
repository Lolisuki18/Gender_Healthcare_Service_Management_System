/**
 * TokenStatus.js - Component hiển thị trạng thái token
 *
 * Component này hiển thị thông tin về token hiện tại:
 * - Trạng thái hợp lệ
 * - Thời gian còn lại
 * - Nút refresh thủ công
 *
 * Chủ yếu dùng để debug và monitoring
 */

import React from 'react';
import { Box, Typography, Button, Chip, Alert } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import useTokenService from '@/hooks/useTokenService';
import localStorageUtil from '@/utils/localStorage';

const TokenStatus = ({ showDetails = false }) => {
  const {
    tokenInfo,
    refreshToken,
    isTokenValid,
    isTokenExpiringSoon,
    tokenTimeLeft,
    isLoading,
  } = useTokenService();

  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return 'Hết hạn';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getStatusColor = () => {
    if (!isTokenValid) return 'error';
    if (isTokenExpiringSoon) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (!isTokenValid) return 'Không hợp lệ';
    if (isTokenExpiringSoon) return 'Sắp hết hạn';
    return 'Hợp lệ';
  };

  const getTokenInfo = () => {
    const token = localStorageUtil.get('token');
    if (!token?.accessToken) return null;

    try {
      const tokenParts = token.accessToken.split('.');
      if (tokenParts.length !== 3) return null;

      const payload = JSON.parse(atob(tokenParts[1]));
      return {
        type: payload.type || 'unknown',
        issuer: payload.iss || 'unknown',
        issuedAt: new Date(payload.iat * 1000).toLocaleString(),
        expiresAt: new Date(payload.exp * 1000).toLocaleString(),
        subject: payload.sub || 'unknown',
      };
    } catch (error) {
      return null;
    }
  };

  if (!showDetails) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label={getStatusText()} color={getStatusColor()} size="small" />
        {isTokenValid && (
          <Typography variant="caption" color="text.secondary">
            {formatTimeLeft(tokenTimeLeft)}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Trạng thái Token
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Chip label={getStatusText()} color={getStatusColor()} sx={{ mr: 1 }} />
        {isTokenValid && (
          <Typography variant="body2" color="text.secondary">
            Còn lại: {formatTimeLeft(tokenTimeLeft)}
          </Typography>
        )}
      </Box>

      {isTokenExpiringSoon && isTokenValid && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Token sẽ hết hạn sớm. Hệ thống sẽ tự động refresh.
        </Alert>
      )}

      {!isTokenValid && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Token không hợp lệ. Vui lòng đăng nhập lại.
        </Alert>
      )}

      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={refreshToken}
        disabled={isLoading}
        size="small"
      >
        {isLoading ? 'Đang refresh...' : 'Refresh Token'}
      </Button>

      {showDetails && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Debug Info:</strong>
          </Typography>
          <pre style={{ fontSize: '12px', margin: '8px 0' }}>
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>

          {getTokenInfo() && (
            <>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block' }}
              >
                <strong>Token Details:</strong>
              </Typography>
              <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" display="block">
                  <strong>Type:</strong> {getTokenInfo().type}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Issuer:</strong> {getTokenInfo().issuer}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Subject:</strong> {getTokenInfo().subject}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Issued At:</strong> {getTokenInfo().issuedAt}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Expires At:</strong> {getTokenInfo().expiresAt}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TokenStatus;

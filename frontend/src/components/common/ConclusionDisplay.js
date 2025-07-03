import React from 'react';
import { Typography, Chip } from '@mui/material';

const ConclusionDisplay = ({ conclusion, conclusionDisplayName, variant = 'text' }) => {
  const getConclusionColor = (conclusion) => {
    if (!conclusion) return '#9ca3af';
    
    switch (conclusion) {
      case 'INFECTED':
        return '#e53e3e'; // Red for infected
      case 'NOT_INFECTED':
        return '#10b981'; // Green for not infected
      case 'ABNORMAL':
        return '#f59e0b'; // Orange for abnormal
      default:
        return '#374151';
    }
  };

  const getConclusionBgColor = (conclusion) => {
    if (!conclusion) return 'transparent';
    
    switch (conclusion) {
      case 'INFECTED':
        return '#e53e3e15'; // Light red background
      case 'NOT_INFECTED':
        return '#10b98115'; // Light green background
      case 'ABNORMAL':
        return '#f59e0b15'; // Light orange background
      default:
        return 'transparent';
    }
  };

  const displayText = conclusionDisplayName || conclusion || 'Chưa có kết luận';

  if (variant === 'chip') {
    return (
      <Chip
        label={displayText}
        size="small"
        sx={{
          backgroundColor: getConclusionBgColor(conclusion),
          color: getConclusionColor(conclusion),
          border: `1px solid ${getConclusionColor(conclusion)}`,
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    );
  }

  return (
    <Typography
      sx={{
        fontSize: '0.875rem',
        color: getConclusionColor(conclusion),
        fontStyle: conclusion ? 'normal' : 'italic',
        fontWeight: conclusion ? 600 : 400,
        maxWidth: '200px',
        wordWrap: 'break-word',
      }}
    >
      {displayText}
    </Typography>
  );
};

export default ConclusionDisplay; 
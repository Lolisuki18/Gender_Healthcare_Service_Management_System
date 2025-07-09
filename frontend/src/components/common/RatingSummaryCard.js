/**
 * RatingSummaryCard.js - Component hiển thị tổng hợp rating
 * Dùng để hiển thị rating summary cho consultant, service, package
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  LinearProgress,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const RatingSummaryCard = ({ 
  title, 
  averageRating = 0, 
  totalReviews = 0, 
  ratingDistribution = [], 
  recentReviews = [],
  showTrend = false,
  trend = 0 
}) => {
  
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 4.0) return '#8BC34A';
    if (rating >= 3.5) return '#FFC107';
    if (rating >= 3.0) return '#FF9800';
    return '#F44336';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return '#4CAF50';
    if (trend < 0) return '#F44336';
    return '#6B7280';
  };

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(74, 144, 226, 0.1)',
        border: '1px solid rgba(74, 144, 226, 0.1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(74, 144, 226, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748' }}>
            {title}
          </Typography>
          {showTrend && (
            <Chip
              icon={<TrendingUpIcon sx={{ fontSize: '16px !important' }} />}
              label={`${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}
              size="small"
              sx={{
                background: trend >= 0 ? '#E8F5E8' : '#FFEBEE',
                color: getTrendColor(trend),
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: getTrendColor(trend)
                }
              }}
            />
          )}
        </Box>

        {/* Main Rating Display */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getRatingColor(averageRating)}, ${getRatingColor(averageRating)}20)`,
              mr: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {averageRating.toFixed(1)}
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Rating
              value={averageRating}
              readOnly
              precision={0.1}
              sx={{
                mb: 1,
                '& .MuiRating-iconFilled': {
                  color: '#FFB400',
                },
                '& .MuiRating-iconEmpty': {
                  color: '#E0E7FF',
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ fontSize: '16px', color: '#6B7280' }} />
              <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                {totalReviews.toLocaleString()} đánh giá
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Rating Distribution */}
        {ratingDistribution.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2D3748', mb: 2 }}>
              Phân bố đánh giá
            </Typography>
            {[5, 4, 3, 2, 1].map((star) => {
              const distribution = ratingDistribution.find(d => d.rating === star) || { count: 0, percentage: 0 };
              return (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                    <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                      {star}
                    </Typography>
                    <StarIcon sx={{ fontSize: '14px', color: '#FFB400' }} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={distribution.percentage}
                    sx={{
                      flex: 1,
                      mx: 2,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#E0E7FF',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRatingColor(star),
                        borderRadius: 3,
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 35, textAlign: 'right', fontWeight: 500 }}>
                    {distribution.count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Recent Reviews */}
        {recentReviews.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2D3748', mb: 2 }}>
              Đánh giá gần đây
            </Typography>
            <Grid container spacing={2}>
              {recentReviews.slice(0, 3).map((review, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 2,
                      background: 'rgba(74, 144, 226, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(74, 144, 226, 0.1)',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {review.customerName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>
                          {review.customerName || 'Người dùng ẩn danh'}
                        </Typography>
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#FFB400',
                            },
                            '& .MuiRating-iconEmpty': {
                              color: '#E0E7FF',
                            }
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4A5568',
                          fontSize: '13px',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', mt: 0.5, display: 'block' }}>
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingSummaryCard;

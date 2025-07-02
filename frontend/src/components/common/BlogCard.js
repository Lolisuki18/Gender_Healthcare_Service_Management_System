/**
 * BlogCard.js - Component hiển thị thẻ blog
 */

import React from 'react';
import PropTypes from 'prop-types';
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Box, 
  Chip,
  Button
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BlogCard = ({ blog, onClick, showCategory = true, showAuthor = true, showViews = true }) => {
  // ===== UTILITY FUNCTIONS =====
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
  };

  return (
    <Card 
      sx={{ 
        height: 'auto',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        border: '1px solid #e3f2fd',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          borderColor: '#bbdefb'
        }
      }}
      onClick={() => onClick && onClick(blog.id)}
    >
      {/* Blog Image */}
      {blog.imageUrl && (
        <Box sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          width: { xs: '100%', sm: '300px' },
          height: { xs: '200px', sm: 'auto' },
          flexShrink: 0
        }}>
          <CardMedia
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            image={blog.imageUrl}
            alt={blog.title}
          />
        </Box>
      )}
      
      <CardContent sx={{ 
        p: 3, 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        {/* Category Chip */}
        {showCategory && blog.category && (
          <Chip
            label={blog.category}
            size="small"
            sx={{
              mb: 2,
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              border: '1px solid #bbdefb',
              height: '24px',
              alignSelf: 'flex-start'
            }}
          />
        )}

        {/* Blog Title */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            lineHeight: 1.4,
            color: '#1a237e',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {blog.title}
        </Typography>

        {/* Blog Content Preview */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#546e7a',
            lineHeight: 1.6,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: { xs: 3, sm: 4 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.95rem',
            flex: '1 1 auto'
          }}
        >
          {truncateContent(blog.content, 200)}
        </Typography>

        {/* Blog Meta Info */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 2,
          pt: 2,
          borderTop: '1px solid #e3f2fd',
          mt: 'auto',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between'
        }}>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center'
          }}>
            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ 
                fontSize: '0.9rem', 
                color: '#90a4ae'
              }} />
              <Typography variant="caption" sx={{ 
                color: '#90a4ae', 
                fontSize: '0.8rem',
                fontWeight: 500
              }}>
                {formatDate(blog.createdAt)}
              </Typography>
            </Box>

            {/* Author */}
            {showAuthor && blog.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ 
                  fontSize: '0.9rem', 
                  color: '#90a4ae'
                }} />
                <Typography variant="caption" sx={{ 
                  color: '#90a4ae', 
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}>
                  {blog.author}
                </Typography>
              </Box>
            )}

            {/* Views */}
            {showViews && blog.views && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon sx={{ 
                  fontSize: '0.9rem', 
                  color: '#90a4ae'
                }} />
                <Typography variant="caption" sx={{ 
                  color: '#90a4ae', 
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}>
                  {blog.views.toLocaleString()} lượt xem
                </Typography>
              </Box>
            )}
          </Box>

          {/* Read More Button */}
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              borderRadius: '8px',
              px: 2.5,
              py: 1,
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                backgroundColor: '#1565c0',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            Đọc thêm
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    author: PropTypes.string,
    views: PropTypes.number,
    createdAt: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func,
  showCategory: PropTypes.bool,
  showAuthor: PropTypes.bool,
  showViews: PropTypes.bool
};

export default BlogCard;

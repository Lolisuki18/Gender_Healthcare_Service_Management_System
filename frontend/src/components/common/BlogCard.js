import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getBlogImageUrl, getAvatarUrl } from '../../utils/imageUrl';

function formatDateVN(date) {
  if (!date) return '';
  let d = date;
  if (Array.isArray(d) && d.length >= 3) {
    // [YYYY, MM, DD, hh, mm, ss, ms] (tháng trong JS là 0-based)
    d = new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0, d[5] || 0, d[6] || 0);
  } else if (!(d instanceof Date)) {
    d = new Date(d);
  }
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}

const BlogCard = ({ post, truncateContent = 120 }) => {
  const navigate = useNavigate();
  if (!post) return null;

  const handleReadMore = () => navigate(`/blog/${post.id}`);

  const getCleanContentPreview = (content, maxLength) => {
    if (!content) return '';
    const cleanText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  const getBlogStatusBadge = (status) => {
    const statusMap = {
      'CONFIRMED': { text: 'Đã duyệt', color: 'success' },
      'PROCESSING': { text: 'Đang xử lý', color: 'warning' },
      'CANCELED': { text: 'Đã hủy', color: 'error' }
    };
    return statusMap[status] || { text: status, color: 'default' };
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e3f2fd',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        }
      }}
      onClick={handleReadMore}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: '300px' },
            height: { xs: '200px', sm: '180px' },
            objectFit: 'cover'
          }}
          image={getBlogImageUrl(post.thumbnailImage || post.existingThumbnail)}
          alt={post.title || 'Blog thumbnail'}
          onError={(e) => { 
            e.target.src = getBlogImageUrl('/img/blog/default.jpg'); 
          }}
        />
        
        {/* Status Badge */}
        {post.status && post.status !== 'CONFIRMED' && (
          <Chip
            label={getBlogStatusBadge(post.status).text}
            color={getBlogStatusBadge(post.status).color}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        )}
        
        {/* Overlay on hover */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
              opacity: 1
            }
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Xem chi tiết
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ 
        flex: 1, 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          {/* Meta Info */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2, 
            mb: 2,
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.8rem' }}>
                {post.categoryIsActive === false ? 'Danh mục đã bị xoá' : post.categoryName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: '0.8rem', color: '#3b82f6' }} />
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.8rem' }}>
                {formatDateVN(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#1e293b',
              mb: 1,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.title}
          </Typography>

          {/* Excerpt */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              lineHeight: 1.6,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {getCleanContentPreview(post.content, truncateContent)}
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 2,
          borderTop: '1px solid #f1f5f9'
        }}>
          {/* Author Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={getAvatarUrl(post.authorAvatar)}
              sx={{ 
                width: 32, 
                height: 32,
                border: '2px solid #f1f5f9'
              }}
            >
              <PersonIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ 
                color: '#1e293b', 
                fontWeight: 500,
                fontSize: '0.85rem'
              }}>
                {post.authorName || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ 
                display: 'block',
                color: '#64748b',
                fontSize: '0.75rem'
              }}>
                Tác giả
              </Typography>
            </Box>
          </Box>

          {/* Read More Button */}
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={(e) => { 
              e.stopPropagation(); 
              handleReadMore(); 
            }}
            sx={{
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.8rem',
              textTransform: 'none',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: '#2563eb',
                transform: 'translateX(2px)'
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

export default BlogCard;

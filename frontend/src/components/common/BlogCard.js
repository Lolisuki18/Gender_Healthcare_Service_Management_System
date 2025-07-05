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

  // Debug logging
  console.log('🃏 BlogCard rendering post:', post);
  console.log('🖼️ Post thumbnail:', post.thumbnailImage);
  console.log('🖼️ Post existingThumbnail:', post.existingThumbnail);

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
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e3f2fd',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #26c6da, #4dd0e1)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease'
        },
        '&:hover': {
          boxShadow: '0 12px 40px rgba(38, 198, 218, 0.15)',
          transform: 'translateY(-6px)',
          borderColor: '#80deea',
          '&::before': {
            transform: 'scaleX(1)'
          }
        }
      }}
      onClick={handleReadMore}
    >
      {/* Image Section */}
      <Box sx={{ 
        position: 'relative',          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(38, 198, 218, 0.1), rgba(77, 208, 225, 0.05))',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            borderRadius: { xs: '20px 20px 0 0', sm: '20px 0 0 20px' },
            pointerEvents: 'none'
          },
        '.MuiCard-root:hover &::after': {
          opacity: 1
        }
      }}>
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: '300px' },
            height: { xs: '220px', sm: '200px' },
            objectFit: 'cover',
            borderRadius: { xs: '20px 20px 0 0', sm: '20px 0 0 20px' },
            transition: 'all 0.3s ease',
            '.MuiCard-root:hover &': {
              transform: 'scale(1.02)'
            }
          }}
          image={getBlogImageUrl(post.thumbnailImage || post.existingThumbnail)}
          alt={post.title || 'Blog thumbnail'}
          onError={(e) => { 
            console.error('❌ Image failed to load:', e.target.src);
            // Thử fallback images theo thứ tự
            if (e.target.src.includes('suckhoesinhsan.png')) {
              console.log('🔄 Using final fallback...');
              e.target.src = '/img/thumbs/1.png';
            } else {
              console.log('🔄 Trying default thumbnail...');
              e.target.src = '/img/thumbs/suckhoesinhsan.png'; 
            }
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
              top: 16,
              left: 16,
              fontWeight: 600,
              fontSize: '0.75rem',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        )}
        
        {/* Category Badge */}
        <Chip
          label={post.categoryIsActive === false ? 'Danh mục đã bị xoá' : post.categoryName}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(38, 198, 218, 0.9)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent sx={{ 
        flex: 1, 
        p: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)'
      }}>
        <Box>
          {/* Meta Info */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2, 
            mb: 3,
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: '1rem', color: '#26c6da' }} />
              <Typography variant="caption" sx={{ 
                color: '#546e7a', 
                fontWeight: 500, 
                fontSize: '0.85rem',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}>
                {formatDateVN(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: '#1a237e',
              mb: 2,
              lineHeight: 1.4,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',            transition: 'color 0.3s ease',
            '.MuiCard-root:hover &': {
              color: '#26c6da'
            }
            }}
          >
            {post.title}
          </Typography>

          {/* Excerpt */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#546e7a',
              lineHeight: 1.7,
              mb: 3,
              fontSize: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
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
          pt: 3,
          borderTop: '1px solid #e3f2fd'
        }}>
          {/* Author Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar 
              src={getAvatarUrl(post.authorAvatar)}
              sx={{ 
                width: 36, 
                height: 36,
                border: '2px solid #e0f7fa',
                backgroundColor: '#26c6da'
              }}
            >
              <PersonIcon sx={{ fontSize: '1.1rem' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ 
                color: '#1a237e', 
                fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}>
                {post.authorName || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ 
                display: 'block',
                color: '#90a4ae',
                fontSize: '0.75rem',
                fontWeight: 500
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
            sx={{            backgroundColor: '#26c6da',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'none',
            borderRadius: '12px',
            px: 2.5,
            py: 1,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            boxShadow: '0 4px 15px rgba(38, 198, 218, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#00acc1',
              transform: 'translateX(4px)',
              boxShadow: '0 6px 20px rgba(38, 198, 218, 0.4)'
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

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

  // Hình ảnh mặc định
  const defaultImage = '/img/blog/default.jpg';

  // Xác định URL hình ảnh để hiển thị
  const getImageUrl = () => {
    // Kiểm tra các field có thể chứa đường dẫn ảnh
    const imagePath = post.thumbnailImage || 
                     post.existingThumbnail || 
                     post.displayThumbnail ||
                     post.imageUrl || 
                     post.thumbnail || 
                     post.image;
    
    if (imagePath) {
      const generatedUrl = getBlogImageUrl(imagePath);
      console.log('🔗 Generated image URL:', generatedUrl, 'from path:', imagePath);
      return generatedUrl;
    }
    
    console.log('📷 No thumbnail found, using default image:', defaultImage);
    return defaultImage;
  };

  // Xác định URL avatar
  const getAvatarUrlForDisplay = () => {
    const avatarUrl = getAvatarUrl(post.authorAvatar);
    console.log('👤 Generated avatar URL:', avatarUrl, 'from path:', post.authorAvatar);
    return avatarUrl;
  };

  // Xử lý lỗi load hình ảnh
  const handleImageError = (e) => {
    console.error('❌ Image failed to load:', e.target.src);
    if (!e.target.dataset.fallback) {
      e.target.dataset.fallback = 'true';
      // Sử dụng getBlogImageUrl để có URL đúng cho default.jpg
      const fallbackUrl = getBlogImageUrl('/img/blog/default.jpg');
      console.log('🔄 Using default image:', fallbackUrl);
      e.target.src = fallbackUrl;
    }
  };

  // Xử lý lỗi load avatar
  const handleAvatarError = (e) => {
    console.error('❌ Avatar failed to load:', e.target.src);
    console.log('🔄 Using default avatar icon');
    // Không thay đổi src, để MUI Avatar tự động hiển thị PersonIcon
  };

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
        position: 'relative',
        width: { xs: '100%', sm: '300px' },
        height: { xs: '220px', sm: '200px' },
        flexShrink: 0,
        '&::after': {
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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: { xs: '20px 20px 0 0', sm: '20px 0 0 20px' },
            transition: 'all 0.3s ease',
            filter: 'none',
            '.MuiCard-root:hover &': {
              transform: 'scale(1.02)'
            }
          }}
          image={getImageUrl()}
          alt={post.title || 'Blog thumbnail'}
          onError={handleImageError}
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
          label={post.categoryName || 'Chưa phân loại'}
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
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent sx={{ 
        p: 4, 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Title */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 800,
            color: '#1a237e',
            mb: 3,
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.title}
        </Typography>

        {/* Content Preview */}
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#546e7a',
            mb: 4,
            lineHeight: 1.7,
            fontSize: '1rem'
          }}
        >
          {getCleanContentPreview(post.content, truncateContent)}
        </Typography>

        {/* Author and Date Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Author Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={getAvatarUrlForDisplay()}
              alt={post.authorName}
              sx={{ 
                width: 36, 
                height: 36,
                backgroundColor: '#26c6da',
                color: '#ffffff',
                fontWeight: 600
              }}
              onError={handleAvatarError}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#37474f',
                  fontSize: '0.875rem'
                }}
              >
                {post.authorName || 'Tác giả'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: '#90a4ae' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#90a4ae',
                    fontSize: '0.75rem'
                  }}
                >
                  {formatDateVN(post.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Read More Button */}
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleReadMore}
            sx={{
              background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: 'none',
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
                boxShadow: '0 4px 15px rgba(38, 198, 218, 0.3)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
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

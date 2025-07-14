/**
 * BlogDetailPage.js - Trang chi tiết bài viết blog
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Breadcrumbs,
  Link,
  Avatar,
  Chip,
  Skeleton,
  Alert,
  Button,
  Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import blogService from '../services/blogService';
import { getBlogImageUrl, getAvatarUrl } from '../utils/imageUrl';

function formatDateVN(date) {
  if (!date) return '';
  let d = date;
  if (Array.isArray(d) && d.length >= 3) {
    d = new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0, d[5] || 0, d[6] || 0);
  } else if (!(d instanceof Date)) {
    d = new Date(d);
  }
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Fetching blog detail for ID:', id);
        
        const response = await blogService.getPublicBlogById(id);
        
        console.log('📊 Blog detail response:', response);
        
        if (response && response.success && response.data) {
          const blogData = response.data;
          console.log('📝 Blog data:', blogData);
          
          setBlog(blogData);
        } else {
          console.error('❌ Blog detail response not successful:', response);
          setError('Không thể tải chi tiết bài viết');
        }
      } catch (err) {
        console.error('💥 Error fetching blog detail:', err);
        console.error('💥 Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        setError(`Lỗi kết nối: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  // Hàm xử lý URL hình ảnh
  const getImageUrl = (imagePath) => {
    return getBlogImageUrl(imagePath);
  };

  const getAuthorAvatarUrl = (avatarPath) => {
    return getAvatarUrl(avatarPath);
  };

  const handleImageError = (e) => {
    console.error('❌ Image failed to load:', e.target.src);
    if (!e.target.dataset.fallback) {
      e.target.dataset.fallback = 'true';
      e.target.src = '/img/blog/default.jpg';
    }
  };

  const getBlogStatusBadge = (status) => {
    const statusMap = {
      'CONFIRMED': { text: 'Đã duyệt', color: 'success' },
      'PROCESSING': { text: 'Đang xử lý', color: 'warning' },
      'CANCELED': { text: 'Đã hủy', color: 'error' }
    };
    return statusMap[status] || { text: status, color: 'default' };
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #ffffff 100%)',
        py: 8
      }}>
        <Container maxWidth="md">
          {/* Breadcrumb Skeleton */}
          <Skeleton variant="text" width={300} height={32} sx={{ mb: 4 }} />
          
          {/* Image Skeleton */}
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={400} 
            sx={{ borderRadius: '20px', mb: 4 }} 
          />
          
          {/* Title Skeleton */}
          <Skeleton variant="text" width="80%" height={48} sx={{ mb: 2 }} />
          
          {/* Meta info Skeleton */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
          </Box>
          
          {/* Content Skeleton */}
          <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="95%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="85%" height={24} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #ffffff 100%)',
        py: 8
      }}>
        <Container maxWidth="md">
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '20px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(244, 67, 54, 0.2)',
              border: '2px solid rgba(244, 67, 54, 0.2)',
              mb: 4
            }}
          >
            {error}
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{
              background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
              color: '#ffffff',
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Quay lại danh sách blog
          </Button>
        </Container>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #ffffff 100%)',
        py: 8
      }}>
        <Container maxWidth="md">
          <Alert 
            severity="warning" 
            sx={{ 
              borderRadius: '20px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(255, 152, 0, 0.2)',
              border: '2px solid rgba(255, 152, 0, 0.2)',
              mb: 4
            }}
          >
            Không tìm thấy bài viết
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{
              background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
              color: '#ffffff',
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Quay lại danh sách blog
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #ffffff 100%)',
      py: 8
    }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 6,
            '& .MuiBreadcrumbs-separator': {
              color: '#90a4ae',
              mx: 1
            }
          }}
        >
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#1976d2' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Trang chủ
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/blog')}
            sx={{
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#1976d2' }
            }}
          >
            Blog
          </Link>
          <Typography color="#26c6da" sx={{ fontWeight: 600 }}>
            {blog.title}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
          sx={{
            mb: 4,
            color: '#1976d2',
            borderColor: '#1976d2',
            borderRadius: '25px',
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: '#e3f0ff',
              borderColor: '#1565c0',
            }
          }}
        >
          Quay lại danh sách
        </Button>

        {/* Main Content Card */}
        <Card sx={{ 
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e3f2fd',
          overflow: 'hidden'
        }}>
          {/* Featured Image */}
          {(blog.thumbnailImage || blog.existingThumbnail || blog.displayThumbnail) && (
            <CardMedia
              component="img"
              height="400"
              image={getImageUrl(blog.thumbnailImage || blog.existingThumbnail || blog.displayThumbnail)}
              alt={blog.title}
              onError={handleImageError}
              sx={{
                objectFit: 'cover',
                width: '100%'
              }}
            />
          )}

          <Box sx={{ p: 6 }}>
            {/* Status & Category */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              {blog.status && blog.status !== 'CONFIRMED' && (
                <Chip
                  label={getBlogStatusBadge(blog.status).text}
                  color={getBlogStatusBadge(blog.status).color}
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
              )}
              
              {blog.categoryName && (
                <Chip
                  icon={<CategoryIcon />}
                  label={blog.categoryName}
                  variant="outlined"
                  sx={{
                    borderColor: '#26c6da',
                    color: '#26c6da',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: '#26c6da'
                    }
                  }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                color: '#1a237e',
                mb: 4,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              {blog.title}
            </Typography>

            {/* Author and Date Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 6,
              p: 3,
              backgroundColor: '#f8fbff',
              borderRadius: '16px',
              border: '1px solid #e3f2fd'
            }}>
              <Avatar
                src={getAuthorAvatarUrl(blog.authorAvatar)}
                alt={blog.authorName}
                sx={{ 
                  width: 48, 
                  height: 48,
                  backgroundColor: '#26c6da',
                  color: '#ffffff',
                  fontWeight: 600
                }}
              >
                <PersonIcon />
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#37474f',
                    fontSize: '1rem',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  {blog.authorName || 'Tác giả'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, color: '#90a4ae' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#90a4ae',
                      fontSize: '0.875rem',
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                    }}
                  >
                    Xuất bản: {formatDateVN(blog.createdAt)}
                  </Typography>
                </Box>
                
                {blog.updatedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: '#90a4ae' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#90a4ae',
                        fontSize: '0.875rem',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                      }}
                    >
                      Cập nhật: {formatDateVN(blog.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 6, borderColor: '#e3f2fd' }} />

            {/* Blog Content */}
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#37474f',
                  lineHeight: 1.8,
                  fontSize: '1.125rem',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  '& p': {
                    mb: 3
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: '#1a237e',
                    fontWeight: 700,
                    mt: 4,
                    mb: 2
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 3
                  },
                  '& li': {
                    mb: 1
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    my: 3
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #26c6da',
                    pl: 3,
                    py: 2,
                    backgroundColor: '#f8fbff',
                    borderRadius: '0 12px 12px 0',
                    fontStyle: 'italic',
                    color: '#546e7a'
                  }
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </Box>

            {/* Blog Sections */}
            {blog.sections && blog.sections.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a237e',
                    mb: 4,
                    fontSize: '1.5rem',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  Nội dung chi tiết
                </Typography>
                
                {blog.sections
                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                  .map((section, index) => (
                    <Box key={section.id || index} sx={{ mb: 5 }}>
                      {section.sectionTitle && (
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#1a237e',
                            mb: 3,
                            fontSize: '1.25rem',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                          }}
                        >
                          {section.sectionTitle}
                        </Typography>
                      )}
                      
                      {(section.sectionImage || section.existingSectionImage || section.displaySectionImage) && (
                        <Box sx={{ mb: 3 }}>
                          <CardMedia
                            component="img"
                            image={getImageUrl(section.sectionImage || section.existingSectionImage || section.displaySectionImage)}
                            alt={section.sectionTitle || `Section ${index + 1}`}
                            onError={handleImageError}
                            sx={{
                              width: '100%',
                              maxHeight: '400px',
                              objectFit: 'cover',
                              borderRadius: '12px'
                            }}
                          />
                        </Box>
                      )}
                      
                      {section.sectionContent && (
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#37474f',
                            lineHeight: 1.8,
                            fontSize: '1.125rem',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                          }}
                          dangerouslySetInnerHTML={{ __html: section.sectionContent }}
                        />
                      )}
                      
                      {index < blog.sections.length - 1 && (
                        <Divider sx={{ mt: 4, borderColor: '#e3f2fd' }} />
                      )}
                    </Box>
                  ))}
              </Box>
            )}

            {/* Back to Blog List */}
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/blog')}
                sx={{
                  background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
                  color: '#ffffff',
                  borderRadius: '50px',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  boxShadow: '0 8px 25px rgba(38, 198, 218, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
                    boxShadow: '0 12px 35px rgba(38, 198, 218, 0.4)',
                    transform: 'translateY(-3px)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Quay lại danh sách blog
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default BlogDetailPage;

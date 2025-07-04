/**
 * BlogDetailPage.js - Trang hiển thị chi tiết blog
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Chip,
  Skeleton,
  Alert,
  Button,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import blogService from '@/services/blogService';

const BlogDetailPage = () => {
  // ===== STATE MANAGEMENT =====
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // ===== FETCH DATA FROM REAL API =====
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lấy chi tiết blog
        const blogResponse = await blogService.getPublicBlogById(id);
        
        if (blogResponse.success && blogResponse.data) {
          const blogData = blogService.formatBlogData(blogResponse.data);
          setBlog(blogData);
          
          // Lấy blog liên quan nếu có categoryId
          if (blogData.category && blogData.category.id) {
            try {
              console.log("Fetching related blogs for category ID:", blogData.category.id);
              
              // Gọi API lấy blog cùng chuyên mục
              const relatedResponse = await blogService.getBlogsByCategory(
                blogData.category.id, 
                { 
                  page: 0, 
                  size: 20  // Lấy nhiều hơn để đủ dữ liệu sau khi lọc
                }
              );
              
              console.log("Related blogs response:", relatedResponse);
              
              if (relatedResponse.success && relatedResponse.data && relatedResponse.data.content) {
                // Lọc bỏ blog hiện tại khỏi danh sách liên quan
                const filteredRelated = relatedResponse.data.content
                  .filter(relatedBlog => relatedBlog.id !== parseInt(id))
                  .slice(0, 6);  // Giới hạn tối đa 6 blog
                
                console.log("Filtered related blogs:", filteredRelated);
                console.log("Number of related blogs:", filteredRelated.length);
                
                // ĐÂY LÀ DÒNG CODE QUAN TRỌNG CẦN THÊM
                setRelatedBlogs(filteredRelated);
              } else {
                console.warn("No related blogs found or invalid response format");
                setRelatedBlogs([]); // Set mảng rỗng để hiển thị thông báo không có bài viết liên quan
              }
            } catch (relatedError) {
              console.error('Error fetching related blogs:', relatedError);
              setRelatedBlogs([]); // Set mảng rỗng khi gặp lỗi
            }
          } else {
            // Nếu không có category, hiển thị thông báo không có bài viết liên quan
            console.log("No category found for this blog");
            setRelatedBlogs([]);
          }
        } else {
          setError(blogResponse.message || 'Blog không tồn tại hoặc đã bị xóa');
        }
      } catch (err) {
        console.error('Error fetching blog detail:', err);
        if (err.message?.includes('404') || err.message?.includes('not found')) {
          setError('Blog không tồn tại hoặc đã bị xóa');
        } else {
          setError('Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(parseInt(id))) {
      fetchBlogDetail();
    } else {
      setError('ID bài viết không hợp lệ');
      setLoading(false);
    }
  }, [id]);

  // Thêm effect này để theo dõi khi relatedBlogs thay đổi
  useEffect(() => {
    console.log("Related blogs state updated:", relatedBlogs);
  }, [relatedBlogs]);

  // ===== UTILITY FUNCTIONS =====
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      // Xử lý định dạng ngày từ backend (có thể là array hoặc string)
      let date;
      if (Array.isArray(dateString)) {
        // Nếu là array format từ Java LocalDateTime [year, month, day, hour, minute, second]
        const [year, month, day, hour = 0, minute = 0] = dateString;
        date = new Date(year, month - 1, day, hour, minute);
      } else {
        date = new Date(dateString);
      }
      
      // Kiểm tra date hợp lệ
      if (isNaN(date.getTime())) {
        return 'Chưa cập nhật';
      }
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Chưa cập nhật';
    }
  };

  const handleBackClick = () => {
    navigate('/blog');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.description || blog.title,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link đã được sao chép vào clipboard!');
      }
    } catch (error) {
      console.warn('Error sharing:', error);
      // Fallback manual copy
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link đã được sao chép vào clipboard!');
    }
  };

  const handleRelatedBlogClick = (blogId) => {
    if (blogId && !isNaN(parseInt(blogId))) {
      navigate(`/blog/${blogId}`);
      // Scroll to top khi chuyển sang blog khác
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ===== LOADING SKELETON =====
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        position: 'relative'
      }}>
        <Container maxWidth="lg" sx={{ py: 6, position: 'relative' }}>
          {/* Back Button Skeleton */}
          <Skeleton variant="rectangular" width={150} height={40} sx={{ mb: 4, borderRadius: '8px' }} />
          
          <Box sx={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            p: 5,
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            {/* Hero Image Skeleton */}
            <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: '16px' }} />
            
            {/* Title Skeleton */}
            <Skeleton variant="text" width="80%" height={60} sx={{ mb: 3 }} />
            
            {/* Description Skeleton */}
            <Skeleton variant="text" width="100%" height={40} sx={{ mb: 4 }} />
            
            {/* Meta Info Skeleton */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              <Skeleton variant="rectangular" width={120} height={30} sx={{ borderRadius: '15px' }} />
              <Skeleton variant="rectangular" width={150} height={30} sx={{ borderRadius: '15px' }} />
              <Skeleton variant="rectangular" width={80} height={30} sx={{ borderRadius: '15px' }} />
            </Box>
            
            {/* Content Skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} variant="text" width="100%" height={24} sx={{ mb: 1 }} />
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        position: 'relative'
      }}>
        <Container maxWidth="lg" sx={{ py: 6, position: 'relative' }}>
          <Box sx={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            p: 5,
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '12px',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                mb: 4,
                '& .MuiAlert-message': {
                  fontSize: '1.1rem',
                  fontWeight: 500
                }
              }}
            >
              {error}
            </Alert>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackClick}
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                px: 4,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              Quay lại danh sách blog
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      position: 'relative'
    }}>
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative' }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ 
            mb: 4,
            backgroundColor: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.95rem',
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
            '&:hover': {
              backgroundColor: '#1565c0',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
            }
          }}
        >
          Quay lại danh sách
        </Button>

        {/* Blog Content */}
        {blog && (
          <Card sx={{ 
            borderRadius: '16px', 
            overflow: 'hidden', 
            mb: 6,
            backgroundColor: '#ffffff',
            border: '1px solid #e3f2fd',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            {/* Hero Image */}
            {blog.thumbnailImage && (
              <Box
                sx={{
                  height: { xs: '250px', md: '400px' },
                  backgroundImage: `url(${blog.thumbnailImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    p: { xs: 2, md: 4 }
                  }}
                >
                  {/* Category */}
                  {blog.category && (
                    <Chip
                      label={blog.category.isActive === false ? 'Danh mục đã bị xoá' : (blog.category.name || blog.category)}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: '#1976d2',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}

            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              {/* Blog Title */}
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800,
                  color: '#1a237e',
                  mb: 4,
                  lineHeight: 1.3,
                  fontSize: { xs: '1.6rem', md: '2.2rem' },
                  letterSpacing: '-0.01em'
                }}
              >
                {blog.title}
              </Typography>

              {/* Blog Description */}
              {blog.description && (
                <Typography
                  variant="h6"
                  sx={{
                    color: '#546e7a',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.6,
                    mb: 4,
                    fontStyle: 'italic'
                  }}
                >
                  {blog.description}
                </Typography>
              )}

              {/* Blog Meta */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: { xs: 2, md: 3 },
                mb: 4,
                pb: 3,
                borderBottom: '1px solid #e3f2fd'
              }}>
                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    backgroundColor: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    <PersonIcon sx={{ fontSize: '1rem' }} />
                  </Avatar>
                  <Typography variant="body1" sx={{ color: '#546e7a', fontWeight: 500, fontSize: '0.95rem' }}>
                    {blog.author?.fullName || blog.author?.username || 'Admin'}
                  </Typography>
                </Box>

                {/* Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarTodayIcon sx={{ 
                    fontSize: '1rem', 
                    color: '#1976d2'
                  }} />
                  <Typography variant="body1" sx={{ color: '#546e7a', fontWeight: 500, fontSize: '0.95rem' }}>
                    {formatDate(blog.createdAt)}
                  </Typography>
                </Box>

                {/* Status */}
                {blog.status && (
                  <Chip
                    label={blog.status === 'CONFIRMED' ? 'Đã duyệt' : blog.status}
                    size="small"
                    sx={{
                      backgroundColor: blog.status === 'CONFIRMED' ? '#e8f5e8' : '#fff3cd',
                      color: blog.status === 'CONFIRMED' ? '#2e7d32' : '#856404',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontWeight: 600,
                    py: 1,
                    px: 2.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                    }
                  }}
                >
                  Chia sẻ
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FavoriteIcon />}
                  sx={{
                    borderColor: '#f50057',
                    color: '#f50057',
                    fontWeight: 600,
                    py: 1,
                    px: 2.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: '#f50057',
                      color: 'white',
                      borderColor: '#f50057',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Yêu thích
                </Button>
              </Box>

              {/* Blog Content */}
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: '#37474f',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  '& p': {
                    lineHeight: 1.8,
                    marginBottom: 2.5,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    color: '#37474f',
                    fontWeight: 400
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    fontWeight: 700,
                    marginTop: 3,
                    marginBottom: 2,
                    color: '#1a237e',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  },
                  '& h3': {
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    color: '#1976d2',
                    borderLeft: '4px solid #1976d2',
                    paddingLeft: 2,
                    marginTop: 4
                  },
                  '& h4': {
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    color: '#424242'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    margin: '2rem 0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  },
                  '& ul, & ol': {
                    paddingLeft: 2.5,
                    marginBottom: 2.5
                  },
                  '& li': {
                    marginBottom: 1,
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    color: '#37474f'
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #1976d2',
                    paddingLeft: 2.5,
                    margin: '2rem 0',
                    fontStyle: 'italic',
                    backgroundColor: '#f8fbff',
                    padding: 2.5,
                    borderRadius: '8px',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 500,
                    color: '#37474f',
                    boxShadow: '0 2px 10px rgba(25, 118, 210, 0.1)'
                  },
                  '& strong': {
                    fontWeight: 600,
                    color: '#1a237e'
                  },
                  '& em': {
                    fontStyle: 'italic',
                    color: '#546e7a'
                  }
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e3f2fd' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600, fontSize: '1.1rem' }}>
                    Thẻ:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {blog.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          fontSize: '0.8rem',
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        {/* Related Blogs - Same Category */}
        {blog && (
          <Box sx={{ 
            mt: 8, 
            py: 5, 
            px: { xs: 2, md: 0 },
            backgroundColor: '#f8fbff',
            borderRadius: '16px'
          }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
              <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    color: '#1a237e',
                    mb: 2,
                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                  }}
                >
                  {relatedBlogs && relatedBlogs.length > 0 ? 'Cùng chuyên mục' : 'Bài viết khác'}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 1 
                }}>
                  <Box 
                    sx={{ 
                      width: '50px', 
                      height: '3px', 
                      backgroundColor: '#1976d2', 
                      borderRadius: '3px' 
                    }} 
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#546e7a',
                    maxWidth: '700px',
                    mx: 'auto',
                    fontSize: '1.1rem',
                    fontWeight: 400
                  }}
                >
                  {blog?.category?.name ? `Các bài viết khác về ${blog.category.name}` : 'Bài viết liên quan khác'}
                </Typography>
              </Box>
              
              {relatedBlogs && relatedBlogs.length > 0 ? (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}>
                  {relatedBlogs.map((relatedBlog) => (
                    <Card
                      key={relatedBlog.id}
                      sx={{
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' }, // Thay đổi thành row trên tablet và desktop
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                        },
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => handleRelatedBlogClick(relatedBlog.id)}
                    >
                      {/* Thumbnail Image - lớn hơn và nằm bên trái */}
                      {relatedBlog.thumbnailImage && (
                        <Box
                          sx={{
                            width: { xs: '100%', sm: '300px' },
                            height: { xs: '200px', sm: '220px' },
                            backgroundImage: `url(${relatedBlog.thumbnailImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0,
                            position: 'relative'
                          }}
                        >
                          {/* Category Badge */}
                          <Box sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: '30px',
                            py: 0.5,
                            px: 1.5
                          }}>
                            <Typography sx={{ 
                              fontSize: '0.8rem', 
                              fontWeight: 600,
                              color: '#1976d2'
                            }}>
                              {relatedBlog.category?.name || 'Y khoa'}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      
                      {/* Content - bên phải hình ảnh */}
                      <CardContent sx={{ 
                        p: 3, 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '1.2rem',
                              lineHeight: 1.4,
                              color: '#1a237e',
                              mb: 2
                            }}
                          >
                            {relatedBlog.title}
                          </Typography>
                          
                          {relatedBlog.description && (
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: '#546e7a',
                                fontSize: '0.95rem',
                                mb: 3,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.6
                              }}
                            >
                              {relatedBlog.description}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {/* Author */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ fontSize: '0.9rem', color: '#90a4ae' }} />
                              <Typography variant="caption" sx={{ color: '#90a4ae', fontSize: '0.85rem' }}>
                                {relatedBlog.author?.fullName || relatedBlog.author?.username || 'Admin'}
                              </Typography>
                            </Box>
                            
                            {/* Date */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: '#90a4ae' }} />
                              <Typography variant="caption" sx={{ color: '#90a4ae', fontSize: '0.85rem' }}>
                                {formatDate(relatedBlog.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* Read More */}
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: '#e3f2fd',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Đọc thêm
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: '#546e7a', fontSize: '1.1rem' }}>
                    Hiện chưa có bài viết liên quan. Chúng tôi sẽ cập nhật sớm.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetailPage;

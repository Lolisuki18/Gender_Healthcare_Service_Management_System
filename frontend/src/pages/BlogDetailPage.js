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
  CardContent,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import blogService from '@/services/blogService';
import { getBlogImageUrl } from '../utils/imageUrl';
import BlogCard from '@/components/common/BlogCard';
import HomeIcon from '@mui/icons-material/Home';

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
                // Lọc bỏ blog hiện tại khỏi danh sách liên quan và format dữ liệu
                const filteredRelated = relatedResponse.data.content
                  .filter(relatedBlog => relatedBlog.id !== parseInt(id))
                  .slice(0, 6)  // Giới hạn tối đa 6 blog
                  .map(blog => blogService.formatBlogData(blog)); // Format dữ liệu để đồng nhất
                
                console.log("Filtered and formatted related blogs:", filteredRelated);
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
    console.log("📊 Related blogs state updated:", relatedBlogs);
    console.log("📊 Number of related blogs:", relatedBlogs?.length || 0);
    if (relatedBlogs?.length > 0) {
      console.log("📊 Sample related blog data:", relatedBlogs[0]);
    }
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
                backgroundColor: '#26c6da',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                px: 4,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(38, 198, 218, 0.2)',
                '&:hover': {
                  backgroundColor: '#00bcd4',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(38, 198, 218, 0.3)'
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
      background: 'linear-gradient(135deg, #f8fbff 0%, #e3f2fd 30%, #ffffff 100%)',
      position: 'relative',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(66, 165, 245, 0.03) 100%)',
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 4,
            '& .MuiBreadcrumbs-separator': {
              color: '#90a4ae',
              mx: 1
            },
            '& .MuiBreadcrumbs-li': {
              fontSize: '1rem'
            }
          }}
        >
          <Link 
            underline="hover" 
            color="inherit" 
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#546e7a',
              fontWeight: 500,
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, mb: '-2px' }} /> Trang chủ
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/blog"
            sx={{
              color: '#546e7a',
              fontWeight: 500,
              '&:hover': {
                color: '#26c6da'
              }
            }}
          >
            Blog
          </Link>
          <Typography color="#26c6da" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {blog?.title || '...'}
          </Typography>
        </Breadcrumbs>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ 
            mb: 6,
            backgroundColor: '#26c6da',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '1rem',
            py: 1.5,
            px: 4,
            borderRadius: '16px',
            textTransform: 'none',
            boxShadow: '0 6px 20px rgba(38, 198, 218, 0.3)',
            border: '2px solid transparent',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#00bcd4',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 25px rgba(38, 198, 218, 0.4)',
              borderColor: '#b2ebf2'
            },
            '&:active': {
              transform: 'translateY(-1px)'
            }
          }}
        >
          Quay lại danh sách
        </Button>

        {/* Blog Content */}
        {blog && (
          <Card sx={{ 
            borderRadius: '24px', 
            overflow: 'hidden', 
            mb: 10,
            backgroundColor: '#ffffff',
            border: '2px solid #e3f2fd',
            boxShadow: '0 12px 50px rgba(25, 118, 210, 0.15)',
            transition: 'all 0.3s ease',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
              zIndex: 1
            }
          }}>
            {/* Hero Image */}
            {blog.thumbnailImage && (
              <Box
                sx={{
                  height: { xs: '280px', md: '450px' },
                  backgroundImage: `url(${getBlogImageUrl(blog.thumbnailImage)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(25,118,210,0.1), rgba(0,0,0,0.1))',
                    zIndex: 1
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    p: { xs: 3, md: 5 },
                    zIndex: 2
                  }}
                >
                  {/* Category */}
                  {blog.category && (
                    <Chip
                      label={blog.category.isActive === false ? 'Danh mục đã bị xoá' : (blog.category.name || blog.category)}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: '#1976d2',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontFamily: 'inherit',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}

            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              {/* Blog Title */}
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800,
                  color: '#1a237e',
                  mb: 3,
                  lineHeight: 1.2,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
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
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    lineHeight: 1.7,
                    mb: 5,
                    fontStyle: 'italic',
                    fontFamily: 'inherit',
                    paddingLeft: 3
                  }}
                >
                  {blog.description}
                </Typography>
              )}

              {/* Blog Meta */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: { xs: 2, md: 4 },
                mb: 5,
                pb: 4
              }}>
                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: '#26c6da',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(38, 198, 218, 0.3)'
                  }}>
                    <PersonIcon sx={{ fontSize: '1.2rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Tác giả
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1a237e', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit' }}>
                      {blog.author?.fullName || blog.author?.username || 'Admin'}
                    </Typography>
                  </Box>
                </Box>

                {/* Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#b2ebf2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CalendarTodayIcon sx={{ 
                      fontSize: '1.2rem', 
                      color: '#26c6da'
                    }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Ngày đăng
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1a237e', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit' }}>
                      {formatDate(blog.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Status */}
                {blog.status && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={blog.status === 'CONFIRMED' ? 'Đã duyệt' : blog.status}
                      sx={{
                        backgroundColor: blog.status === 'CONFIRMED' ? '#e8f5e8' : '#fff3cd',
                        color: blog.status === 'CONFIRMED' ? '#2e7d32' : '#856404',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        fontFamily: 'inherit',
                        borderRadius: '20px',
                        height: '32px'
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Blog Content */}
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: { xs: '1.1rem', md: '1.2rem' },
                  color: '#37474f',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  mb: 5,
                  '& p': {
                    lineHeight: 1.8,
                    marginBottom: 3,
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    color: '#37474f',
                    fontWeight: 400,
                    fontFamily: 'inherit'
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    fontWeight: 800,
                    marginTop: 4,
                    marginBottom: 2.5,
                    color: '#1a237e',
                    fontFamily: 'inherit'
                  },
                  '& h3': {
                    fontSize: { xs: '1.4rem', md: '1.6rem' },
                    color: '#26c6da',
                    marginTop: 5,
                    paddingLeft: 0
                  },
                  '& h4': {
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    color: '#424242'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    margin: '3rem 0',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    border: '1px solid #e3f2fd'
                  },
                  '& ul, & ol': {
                    paddingLeft: 3,
                    marginBottom: 3
                  },
                  '& li': {
                    marginBottom: 1.5,
                    lineHeight: 1.8,
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    color: '#37474f'
                  },
                  '& blockquote': {
                    paddingLeft: 3,
                    margin: '3rem 0',
                    fontStyle: 'italic',
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    fontWeight: 500,
                    color: '#37474f'
                  },
                  '& strong': {
                    fontWeight: 700,
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
                <Box sx={{ 
                  mt: 5, 
                  pt: 4
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      color: '#1a237e', 
                      fontWeight: 700, 
                      fontSize: '1.2rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    Thẻ liên quan:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {blog.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          borderRadius: '20px',
                          height: '36px',
                          backgroundColor: '#ffffff',
                          '&:hover': {
                            backgroundColor: '#e3f2fd',
                            borderColor: '#1565c0',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Sections */}
              {blog.sections && blog.sections.length > 0 && (
                <Box mt={6}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      color: '#00695c', 
                      fontWeight: 800,
                      fontSize: { xs: '1.3rem', md: '1.5rem' },
                      fontFamily: 'inherit'
                    }}
                  >
                    Nội dung chi tiết
                  </Typography>
                  {blog.sections.map((section, idx) => (
                    <Box 
                      key={section.id || idx} 
                      mb={5}
                      sx={{
                        padding: 2
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        fontWeight={800} 
                        sx={{ 
                          color: '#26c6da', 
                          mb: 3,
                          fontSize: { xs: '1.1rem', md: '1.3rem' },
                          fontFamily: 'inherit'
                        }}
                      >
                        {section.sectionTitle}
                      </Typography>
                      {section.sectionImage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                          <img
                            src={getBlogImageUrl(section.sectionImage)}
                            alt="section"
                            style={{ 
                              maxWidth: '90%', 
                              width: 'auto',
                              maxHeight: '450px',
                              borderRadius: 16,
                              objectFit: 'contain'
                            }}
                            onError={e => { 
                              console.error('❌ Section image failed to load:', e.target.src);
                              e.target.src = '/img/thumbs/suckhoesinhsan.png'; 
                            }}
                          />
                        </Box>
                      )}
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#37474f', 
                          fontSize: { xs: '1.1rem', md: '1.2rem' }, 
                          lineHeight: 1.8, 
                          mt: 2,
                          fontFamily: 'inherit',
                          fontWeight: 400
                        }}
                      >
                        {section.sectionContent}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        {/* Related Blogs - Same Category */}
        {blog && (
          <Box sx={{ 
            mt: 12, 
            py: 8, 
            px: { xs: 3, md: 0 },
            background: 'linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%)',
            borderRadius: '24px',
            border: '2px solid #b2ebf2',
            boxShadow: '0 12px 50px rgba(38, 198, 218, 0.15)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #26c6da, #4dd0e1)',
              borderRadius: '24px 24px 0 0'
            }
          }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    color: '#00695c',
                    mb: 4,
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    background: 'linear-gradient(135deg, #00695c 0%, #26c6da 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {relatedBlogs && relatedBlogs.length > 0 ? 'Cùng chuyên mục' : 'Bài viết khác'}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3,
                  gap: 2
                }}>
                  <Box 
                    sx={{ 
                      width: '60px', 
                      height: '4px', 
                      background: 'linear-gradient(90deg, #26c6da, #4dd0e1)', 
                      borderRadius: '4px' 
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: '#26c6da', 
                      borderRadius: '50%' 
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: '60px', 
                      height: '4px', 
                      background: 'linear-gradient(90deg, #4dd0e1, #26c6da)', 
                      borderRadius: '4px' 
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#546e7a',
                    maxWidth: '800px',
                    mx: 'auto',
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    lineHeight: 1.6
                  }}
                >
                  {blog?.category?.name ? `Khám phá thêm các bài viết khác về ${blog.category.name}` : 'Những bài viết liên quan khác mà bạn có thể quan tâm'}
                </Typography>
              </Box>
              
              {relatedBlogs && relatedBlogs.length > 0 ? (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  {relatedBlogs.map((relatedBlog) => {
                    console.log('🔗 Related blog data:', relatedBlog);
                    
                    // Chuyển đổi dữ liệu đã được format để phù hợp với BlogCard component
                    const blogCardData = {
                      id: relatedBlog.id,
                      title: relatedBlog.title,
                      content: relatedBlog.content,
                      thumbnailImage: relatedBlog.thumbnailImage,
                      existingThumbnail: relatedBlog.thumbnailImage, // Fallback
                      createdAt: relatedBlog.createdAt,
                      status: relatedBlog.status,
                      categoryName: relatedBlog.category?.name || 'Không có danh mục',
                      categoryIsActive: relatedBlog.category?.isActive !== false,
                      authorName: relatedBlog.author?.fullName || relatedBlog.author?.username || 'Admin',
                      authorAvatar: relatedBlog.author?.avatar
                    };

                    return (
                      <Box 
                        key={relatedBlog.id}
                        onClick={() => handleRelatedBlogClick(relatedBlog.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <BlogCard
                          post={blogCardData}
                          truncateContent={180}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '20px',
                  border: '2px dashed #b2ebf2',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#546e7a',
                      fontWeight: 600,
                      fontSize: '1.3rem',
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      mb: 2
                    }}
                  >
                    Hiện tại chưa có bài viết liên quan
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#90a4ae',
                      fontSize: '1rem',
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                    }}
                  >
                    {blog?.category?.name 
                      ? `Chưa có bài viết khác trong chuyên mục "${blog.category.name}"`
                      : 'Hãy quay lại sau để xem thêm nội dung mới'
                    }
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
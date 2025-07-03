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
  TextField
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';
import ForumIcon from '@mui/icons-material/Forum';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VerifiedIcon from '@mui/icons-material/Verified';
import blogService from '@/services/blogService'; // Sử dụng API service
import { getFullImageUrl } from '../utils/imageUrl';
// import { getBlogById, getRelatedBlogs } from '@/dataDemo/mockBlogData'; // Bỏ mock data
// import { getQuestionsByBlogId, submitQuestion } from '@/dataDemo/mockQuestionData'; // Bỏ mock question

const BlogDetailPage = () => {
  // ===== STATE MANAGEMENT =====
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogById(id);
        if (!data) {
          throw new Error('Blog không tồn tại');
        }
        setBlog(data);
        // TODO: Nếu muốn lấy related blogs, có thể gọi thêm API search hoặc latest
        setRelatedBlogs([]); // Tạm thời bỏ liên quan
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  // ===== UTILITY FUNCTIONS =====
  const formatDate = (dateInput) => {
    if (!dateInput) return 'Chưa cập nhật';
    let date = dateInput;
    if (Array.isArray(date) && date.length >= 3) {
      date = new Date(date[0], date[1] - 1, date[2], date[3] || 0, date[4] || 0, date[5] || 0, date[6] || 0);
    } else if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if (isNaN(date.getTime())) return 'Chưa cập nhật';
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackClick = () => {
    navigate('/blog');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Có thể show toast notification ở đây
    }
  };

  const handleRelatedBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // ===== LOADING SKELETON =====
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        position: 'relative'
      }}>
        <Container maxWidth="md" sx={{ py: 6, position: 'relative' }}>
          <Box sx={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            p: 5,
            border: '1px solid #e0e0e0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <Skeleton variant="text" width="50%" height={60} sx={{ mb: 3, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: '16px', backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <Skeleton variant="text" width="80%" height={80} sx={{ mb: 3, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <Skeleton variant="text" width="100%" height={30} sx={{ mb: 2, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <Skeleton variant="text" width="100%" height={30} sx={{ mb: 2, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <Skeleton variant="text" width="90%" height={30} sx={{ mb: 4, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} variant="text" width="100%" height={24} sx={{ mb: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />
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
        <Container maxWidth="md" sx={{ py: 6, position: 'relative' }}>
          <Box sx={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            p: 5,
            border: '1px solid #e0e0e0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '16px',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                mb: 4,
                '& .MuiAlert-message': {
                  fontSize: '1.2rem',
                  fontWeight: 600
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
                fontWeight: 700,
                py: 1.5,
                px: 4,
                borderRadius: '15px',
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)'
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
      <Container maxWidth="md" sx={{ py: 6, position: 'relative' }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ 
            mb: 4,
            backgroundColor: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            py: 1.2,
            px: 3,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
            '&:hover': {
              backgroundColor: '#1565c0',
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
            {(blog.displayThumbnail || blog.thumbnailImage || blog.existingThumbnail) && (
              <Box
                sx={{
                  height: '400px',
                  backgroundImage: `url(${getFullImageUrl(blog.displayThumbnail || blog.thumbnailImage || blog.existingThumbnail)})`,
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
                    p: 4
                  }}
                >
                  {/* Category */}
                  {blog.categoryName && (
                    <Chip
                      label={blog.categoryName}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: '#1976d2',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        mb: 2,
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
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  letterSpacing: '-0.01em'
                }}
              >
                {blog.title}
              </Typography>

              {/* Blog Meta */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 3,
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
                  <Typography variant="body1" sx={{ color: '#546e7a', fontWeight: 500 }}>
                    {blog.authorName || 'Admin'}
                  </Typography>
                </Box>

                {/* Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarTodayIcon sx={{ 
                    fontSize: '1.1rem', 
                    color: '#1976d2'
                  }} />
                  <Typography variant="body1" sx={{ color: '#546e7a', fontWeight: 500 }}>
                    {formatDate(blog.createdAt)}
                  </Typography>
                </Box>

                {/* Views */}
                {blog.views && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <VisibilityIcon sx={{ 
                      fontSize: '1.1rem', 
                      color: '#1976d2'
                    }} />
                    <Typography variant="body1" sx={{ color: '#546e7a', fontWeight: 500 }}>
                      {blog.views.toLocaleString()} lượt xem
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Blog Content */}
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  color: '#37474f',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  '& p': {
                    lineHeight: 1.8,
                    marginBottom: 2.5,
                    fontSize: '1.1rem',
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
                    fontSize: '1.5rem',
                    color: '#1976d2',
                    borderLeft: '4px solid #1976d2',
                    paddingLeft: 2,
                    marginTop: 4
                  },
                  '& h4': {
                    fontSize: '1.3rem',
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
                    fontSize: '1.1rem',
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
                    fontSize: '1.1rem',
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

              {/* Blog Sections */}
              {Array.isArray(blog.sections) && blog.sections.length > 0 && (
                <Box sx={{ mt: 6 }}>
                  {blog.sections.map((section, idx) => (
                    <Box key={section.id || idx} sx={{ mb: 5 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        {section.sectionTitle}
                      </Typography>
                      {section.displaySectionImage || section.sectionImage || section.existingSectionImage ? (
                        <Box sx={{
                          width: '100%',
                          minHeight: 180,
                          background: '#f8fbff',
                          borderRadius: '12px',
                          mb: 2,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <img
                            src={getFullImageUrl(section.displaySectionImage || section.sectionImage || section.existingSectionImage)}
                            alt={section.sectionTitle || `Section ${idx + 1}`}
                            style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'cover' }}
                          />
                        </Box>
                      ) : null}
                      <Typography variant="body1" sx={{ color: '#37474f', fontSize: '1.1rem' }}>
                        {section.sectionContent}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                color: '#2c3e50',
                mb: 5,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Bài viết liên quan
            </Typography>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 4
            }}>
              {relatedBlogs.map((relatedBlog) => (
                <Card
                  key={relatedBlog.id}
                  sx={{
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)'
                    }
                  }}
                  onClick={() => handleRelatedBlogClick(relatedBlog.id)}
                >
                  {relatedBlog.imageUrl && (
                    <Box
                      sx={{
                        height: '180px',
                        backgroundImage: `url(${relatedBlog.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '20px 20px 0 0'
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        color: '#2c3e50',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {relatedBlog.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#5a6c7d',
                        fontSize: '0.95rem',
                        fontWeight: 500
                      }}
                    >
                      {formatDate(relatedBlog.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetailPage;

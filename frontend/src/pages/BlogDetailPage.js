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
// import blogService from '@/services/blogService'; // Comment out API service
import { getBlogById, getRelatedBlogs } from '@/dataDemo/mockBlogData'; // Import mock data functions
import { getQuestionsByBlogId, submitQuestion } from '@/dataDemo/mockQuestionData'; // Import mock question functions

const BlogDetailPage = () => {
  // ===== STATE MANAGEMENT =====
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [question, setQuestion] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [existingQuestions, setExistingQuestions] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of API
        const data = getBlogById(id);
        if (!data) {
          throw new Error('Blog không tồn tại');
        }
        setBlog(data);
        
        // Get related blogs
        const related = getRelatedBlogs(parseInt(id), 3);
        setRelatedBlogs(related);
        
        // Get existing questions for this blog
        const questions = getQuestionsByBlogId(parseInt(id));
        setExistingQuestions(questions);
        
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
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
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

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    try {
      setQuestionSubmitting(true);
      
      // Use mock API to submit question
      const newQuestion = await submitQuestion(blog.id, question.trim());
      
      // Update existing questions list
      setExistingQuestions(prev => [newQuestion, ...prev]);
      
      setQuestionSubmitted(true);
      setQuestion('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setQuestionSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setQuestionSubmitting(false);
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
            {blog.imageUrl && (
              <Box
                sx={{
                  height: '400px',
                  backgroundImage: `url(${blog.imageUrl})`,
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
                  {blog.category && (
                    <Chip
                      label={blog.category}
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
                    {blog.author || 'Admin'}
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

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
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
                      borderColor: '#f50057'
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
            </CardContent>
          </Card>
        )}

        {/* Question Section */}
        {blog && (
          <Card sx={{ 
            borderRadius: '16px', 
            mt: 6,
            mb: 6,
            backgroundColor: '#ffffff',
            border: '1px solid #e3f2fd',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: 2, 
                mb: 3 
              }}>
                <QuestionAnswerIcon sx={{ 
                  fontSize: '1.8rem', 
                  color: '#1976d2'
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a237e',
                    fontSize: { xs: '1.3rem', md: '1.6rem' }
                  }}
                >
                  Đặt câu hỏi cho bác sĩ
                </Typography>
              </Box>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#546e7a',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                Bạn có thắc mắc gì về bài viết này? Hãy đặt câu hỏi và bác sĩ chuyên khoa sẽ tư vấn cho bạn.
              </Typography>

              {questionSubmitted && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    '& .MuiAlert-message': {
                      fontSize: '0.95rem',
                      fontWeight: 500
                    }
                  }}
                >
                  Câu hỏi của bạn đã được gửi thành công! Bác sĩ sẽ phản hồi sớm nhất có thể.
                </Alert>
              )}

              <Box component="form" onSubmit={handleQuestionSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Nhập câu hỏi của bạn tại đây..."
                  value={question}
                  onChange={handleQuestionChange}
                  disabled={questionSubmitting}
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8fbff',
                      fontSize: '1rem',
                      '& fieldset': {
                        borderColor: '#e3f2fd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '14px',
                      '&::placeholder': {
                        color: '#90a4ae',
                        opacity: 1
                      }
                    }
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#90a4ae',
                      fontSize: '0.85rem',
                      order: { xs: 2, sm: 1 }
                    }}
                  >
                    * Câu hỏi sẽ được bác sĩ chuyên khoa tư vấn trong vòng 24h
                  </Typography>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={questionSubmitting ? null : <SendIcon />}
                    disabled={!question.trim() || questionSubmitting}
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.2,
                      px: 3,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      minWidth: '130px',
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                      order: { xs: 1, sm: 2 },
                      '&:hover': {
                        backgroundColor: '#1565c0',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                      },
                      '&:disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#999',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {questionSubmitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Existing Questions Section */}
        {blog && existingQuestions.length > 0 && (
          <Card sx={{ 
            borderRadius: '24px', 
            mt: 6,
            mb: 6,
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: 2, 
                mb: 4 
              }}>
                <ForumIcon sx={{ 
                  fontSize: '2rem', 
                  color: '#1976d2',
                  filter: 'drop-shadow(0 2px 4px rgba(25, 118, 210, 0.2))'
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    color: '#2c3e50',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Câu hỏi từ độc giả ({existingQuestions.length})
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                {existingQuestions.map((question, index) => (
                  <Box 
                    key={question.id}
                    sx={{ 
                      mb: 4,
                      pb: 4,
                      borderBottom: index < existingQuestions.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    {/* Question */}
                    <Box sx={{ 
                      backgroundColor: '#f8f9fa',
                      borderRadius: '16px',
                      p: 3,
                      mb: 3,
                      border: '1px solid #e9ecef'
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2
                      }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            backgroundColor: '#1976d2',
                            fontSize: '1rem',
                            fontWeight: 700
                          }}
                        >
                          {question.userName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700,
                              color: '#2c3e50',
                              fontSize: '1.1rem'
                            }}
                          >
                            {question.userName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#6c757d',
                              fontSize: '0.9rem'
                            }}
                          >
                            {formatDate(question.createdAt)}
                          </Typography>
                        </Box>
                        <Chip
                          label={question.status === 'answered' ? 'Đã trả lời' : 'Chờ trả lời'}
                          size="small"
                          sx={{
                            ml: 'auto',
                            backgroundColor: question.status === 'answered' ? '#e8f5e8' : '#fff3cd',
                            color: question.status === 'answered' ? '#2e7d32' : '#856404',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.7,
                          color: '#4a5568',
                          fontSize: '1.1rem'
                        }}
                      >
                        {question.question}
                      </Typography>
                    </Box>

                    {/* Doctor Reply */}
                    {question.status === 'answered' && question.doctorReply && (
                      <Box sx={{ 
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        borderRadius: '16px',
                        p: 3,
                        border: '1px solid rgba(25, 118, 210, 0.1)',
                        position: 'relative'
                      }}>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2
                        }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              backgroundColor: '#1976d2',
                              fontSize: '1rem',
                              fontWeight: 700
                            }}
                          >
                            <MedicalServicesIcon sx={{ fontSize: '1.2rem' }} />
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 700,
                                color: '#1976d2',
                                fontSize: '1.1rem'
                              }}
                            >
                              {question.doctorReply.doctorName}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#6c757d',
                                fontSize: '0.9rem'
                              }}
                            >
                              {question.doctorReply.doctorTitle} • {formatDate(question.doctorReply.repliedAt)}
                            </Typography>
                          </Box>
                          <VerifiedIcon sx={{ 
                            color: '#1976d2',
                            fontSize: '1.2rem',
                            ml: 'auto'
                          }} />
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.7,
                            color: '#4a5568',
                            fontSize: '1.1rem',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            p: 2.5,
                            border: '1px solid rgba(25, 118, 210, 0.1)'
                          }}
                        >
                          {question.doctorReply.content}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
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

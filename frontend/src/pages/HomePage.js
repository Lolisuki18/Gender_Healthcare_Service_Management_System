import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  Paper,
  Chip,
  Fade,
  Zoom,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckIcon from '@mui/icons-material/Check';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/api';
import localStorageUtil from '@/utils/localStorage';

import { servicesData } from '@/data/servicesData';

import AskQuestionDialog from '@/components/common/AskQuestionDialog';
import reviewService from '@/services/reviewService';
import blogService from '@/services/blogService';
import imageUrl from '@/utils/imageUrl';

// Define animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const HomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // State mở dialog dùng chung
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(null);

  // --- LIFECYCLE HOOKS ---
  useEffect(() => {
    // Set loaded after a small delay for animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    // toast.success('Chào mừng bạn đến với trang chủ');
    console.log('HomePage component mounted');

    // Fetch testimonials from API
    const fetchTestimonials = async () => {
      setTestimonialsLoading(true);
      setTestimonialsError(null);
      try {
        const data = await reviewService.getTestimonials(10); // lấy nhiều hơn 3 để ưu tiên 5 sao
        // Ưu tiên các đánh giá 5 sao, nếu không đủ thì lấy các đánh giá còn lại
        let filtered = Array.isArray(data) ? data.filter(t => t.rating === 5) : [];
        if (filtered.length < 3 && Array.isArray(data)) {
          // Bổ sung thêm các đánh giá khác nếu chưa đủ 3
          const others = data.filter(t => t.rating !== 5);
          filtered = [...filtered, ...others].slice(0, 3);
        } else {
          filtered = filtered.slice(0, 3);
        }
        setTestimonials(filtered);
      } catch (err) {
        setTestimonialsError('Không thể tải đánh giá khách hàng');
        setTestimonials([]);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();

    // Fetch blogs from API
    const fetchBlogs = async () => {
      setBlogsLoading(true);
      setBlogsError(null);
      try {
        // Lấy 3 bài viết mới nhất, có thể đổi sang getAllBlogs nếu muốn lấy tất cả
        const res = await blogService.getLatestBlogs(3);
        let data = res?.data || res?.content || res || [];
        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (Array.isArray(res)) {
          setBlogs(res);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        setBlogsError('Không thể tải bài viết');
        setBlogs([]);
      } finally {
        setBlogsLoading(false);
      }
    };
    fetchBlogs();

    return () => clearTimeout(timer);
  }, []); // Chỉ chạy 1 lần khi component mount

  // Function xử lý đăng ký xét nghiệm với check đăng nhập
  const handleTestRegistration = async () => {
    try {
      // Gọi API để check authentication status - sử dụng endpoint có sẵn
      const response = await apiClient.get('/users/profile', {
        skipAutoRedirect: true, // Tránh auto redirect trong interceptor
      });

      // Nếu API thành công (200) => đã đăng nhập
      if (response.status === 200) {
        navigate('/test-registration');
      }
    } catch (error) {
      // Nếu lỗi 401 hoặc 403 => chưa đăng nhập
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Lưu đường dẫn để redirect sau khi đăng nhập
        localStorageUtil.set('redirectAfterLogin', {
          path: '/test-registration',
        });
        navigate('/login');
      } else {
        // Lỗi khác (network, server) => vẫn cho phép truy cập
        console.error('Error checking auth:', error);
        navigate('/test-registration');
      }
    }
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}{' '}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          py: { xs: 10, md: 16 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)',
            backdropFilter: 'blur(3px)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={loaded} timeout={1000}>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '1.1rem',
                  letterSpacing: '0.15em',
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  mb: 2,
                  display: 'block',
                }}
              >
                Chào mừng đến với hệ thống chăm sóc sức khỏe
              </Typography>{' '}
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 3,
                  textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                  color: '#FFFFFF',
                  animation: `${float} 6s ease-in-out infinite`,
                  lineHeight: 1.2,
                }}
              >
                Gender Healthcare Service
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  opacity: 0.9,
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 5,
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.35rem' },
                  lineHeight: 1.6,
                }}
              >
                Dịch vụ chăm sóc sức khỏe giới tính toàn diện, hiện đại và tôn
                trọng sự đa dạng.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                justifyContent="center"
                sx={{ mt: 5 }}
              >
                {' '}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => navigate('/consultation')}
                  sx={{
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    fontWeight: 600,
                    px: 4,
                    py: 1.8,
                    borderRadius: 50,
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(74, 144, 226, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    textTransform: 'none',
                  }}
                >
                  Đặt lịch tư vấn
                </Button>{' '}
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<MedicalServicesIcon />}
                  onClick={handleTestRegistration}
                  sx={{
                    borderColor: '#1ABC9C',
                    color: '#fff',
                    fontWeight: 600,
                    px: 4,
                    py: 1.8,
                    borderRadius: 50,
                    borderWidth: '2px',
                    background: 'rgba(26, 188, 156, 0.15)',
                    '&:hover': {
                      background: 'rgba(26, 188, 156, 0.25)',
                      borderColor: '#1ABC9C',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(74, 144, 226, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    textTransform: 'none',
                  }}
                >
                  Đặt lịch dịch vụ
                </Button>
              </Stack>
              <Box
                sx={{
                  mt: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                <Chip
                  icon={<MaleIcon />}
                  label="Nam"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    borderRadius: '16px',
                    px: 1,
                    '& .MuiChip-icon': { color: '#fff' },
                  }}
                />
                <Chip
                  icon={<FemaleIcon />}
                  label="Nữ"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    borderRadius: '16px',
                    px: 1,
                    '& .MuiChip-icon': { color: '#fff' },
                  }}
                />
                <Chip
                  icon={<TransgenderIcon />}
                  label="LGBTQ+"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    borderRadius: '16px',
                    px: 1,
                    '& .MuiChip-icon': { color: '#fff' },
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>{' '}
      {/* Featured Services */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 7, textAlign: 'center' }}>
            <Chip
              label="DỊCH VỤ NỔI BẬT"
              sx={{
                mb: 2,
                bgcolor: (theme) => theme.palette.primary.light + '30',
                color: (theme) => theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '16px',
                px: 1.5,
              }}
            />

            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                mb: 3,
                color: (theme) => theme.palette.text.primary,
                fontWeight: 800,
                fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.75rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '80px',
                  height: '5px',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, #4A90E2, #1ABC9C)',
                  borderRadius: '10px',
                },
              }}
            >
              Dịch Vụ Của Chúng Tôi
            </Typography>

            <Typography
              sx={{
                color: (theme) => theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto',
                mt: 5,
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
              }}
            >
              Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe chuyên biệt, đảm
              bảo sự riêng tư và tôn trọng nhu cầu cá nhân của từng khách hàng.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {servicesData.slice(0, 3).map((service, idx) => {
              const IconComponent = service.icon;
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  key={service.id}
                  display="flex"
                  justifyContent="center"
                >
                  <Zoom
                    in={loaded}
                    style={{ transitionDelay: `${idx * 150 + 400}ms` }}
                  >
                    <Card
                      sx={{
                        borderRadius: 5,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        width: '100%',
                        maxWidth: 350,
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                        overflow: 'hidden',
                        position: 'relative',
                        background:
                          'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(20px)',
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: `0 25px 50px rgba(${service.color
                            .slice(1)
                            .match(/.{2}/g)
                            .map((hex) => parseInt(hex, 16))
                            .join(',')}, 0.25)`,
                          border: `1px solid ${service.color}40`,
                          '& .service-icon': {
                            transform: 'scale(1.2) rotate(5deg)',
                            background: `linear-gradient(45deg, ${service.gradientFrom}, ${service.gradientTo})`,
                          },
                          '& .service-button': {
                            background: `linear-gradient(45deg, ${service.gradientFrom}, ${service.gradientTo})`,
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    >
                      {/* Service Header */}
                      <Box
                        sx={{
                          p: 3,
                          pb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: `linear-gradient(135deg, ${service.color}08, ${service.color}15)`,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 100,
                            height: 100,
                            background: `radial-gradient(circle, ${service.color}15, transparent 70%)`,
                            borderRadius: '50%',
                            transform: 'translate(30px, -30px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            zIndex: 1,
                          }}
                        >
                          <Avatar
                            className="service-icon"
                            sx={{
                              width: 56,
                              height: 56,
                              background: `linear-gradient(45deg, ${service.color}20, ${service.color}40)`,
                              color: service.color,
                              transition: 'all 0.3s ease',
                              boxShadow: `0 4px 16px ${service.color}30`,
                            }}
                          >
                            <IconComponent sx={{ fontSize: '1.8rem' }} />
                          </Avatar>
                          <Box>
                            <Chip
                              label={`#${service.id}`}
                              size="small"
                              sx={{
                                backgroundColor: `${service.color}15`,
                                color: service.color,
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-label': { px: 1.5 },
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* Service Content */}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          pt: 1,
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="h3"
                          sx={{
                            color: '#1a1a1a',
                            fontWeight: 700,
                            mb: 2,
                            fontSize: '1.2rem',
                            lineHeight: 1.3,
                            minHeight: 62,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {service.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: 'text.secondary',
                            mb: 3,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            minHeight: 48,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {service.shortDesc}
                        </Typography>

                        <Box dense sx={{ flexGrow: 1, mb: 2 }}>
                          {service.bullets.slice(0, 3).map((bullet, i) => (
                            <Box
                              key={i}
                              sx={{
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <CheckIcon
                                sx={{
                                  color: service.color,
                                  fontSize: '1.2rem',
                                  fontWeight: 'bold',
                                  mr: 1,
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '0.95rem',
                                  fontWeight: 500,
                                  color: '#2a2a2a',
                                }}
                              >
                                {bullet}
                              </Typography>
                            </Box>
                          ))}
                          {service.bullets.length > 3 && (
                            <Box
                              sx={{
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                sx={{
                                  color: service.color,
                                  fontSize: '0.85rem',
                                  fontWeight: 'bold',
                                  mr: 1,
                                }}
                              >
                                +{service.bullets.length - 3}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '0.9rem',
                                  fontStyle: 'italic',
                                  color: 'text.secondary',
                                }}
                              >
                                Và nhiều tính năng khác...
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>

                      {/* Service Button */}
                      <Box sx={{ p: 3, pt: 0 }}>
                        <Button
                          className="service-button"
                          variant="contained"
                          endIcon={<ArrowForwardIcon />}
                          fullWidth
                          onClick={() => navigate(service.detailRoute)}
                          sx={{
                            background: `linear-gradient(45deg, ${service.color}90, ${service.color})`,
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: 3,
                            px: 4,
                            py: 1.8,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: `0 4px 16px ${service.color}40`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: `linear-gradient(45deg, ${service.gradientTo}, ${service.gradientFrom})`,
                              boxShadow: `0 8px 24px ${service.color}50`,
                            },
                          }}
                        >
                          Khám phá ngay
                        </Button>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            {' '}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/sti-services')}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 50,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 25px rgba(74, 144, 226, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Xem tất cả dịch vụ
            </Button>
          </Box>
        </Container>
      </Box>{' '}
      {/* Why Choose Us Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={loaded} timeout={1000}>
                <Box>
                  <Chip
                    label="TẠI SAO CHỌN CHÚNG TÔI"
                    sx={{
                      mb: 2,
                      bgcolor: (theme) => theme.palette.secondary.light + '30',
                      color: (theme) => theme.palette.secondary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: '16px',
                      px: 1.5,
                    }}
                  />

                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      mb: 4,
                      color: (theme) => theme.palette.text.primary,
                      fontWeight: 800,
                      fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.5rem' },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '80px',
                        height: '5px',
                        bottom: '-15px',
                        left: 0,
                        background:
                          'linear-gradient(to right, #1ABC9C, #4A90E2)',
                        borderRadius: '10px',
                      },
                    }}
                  >
                    Cam kết về chất lượng và sự riêng tư
                  </Typography>

                  <Typography
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      mt: 5,
                      mb: 4,
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                    }}
                  >
                    Chúng tôi tin rằng mọi người đều xứng đáng nhận được dịch vụ
                    chăm sóc sức khỏe chất lượng cao, tôn trọng và phù hợp với
                    nhu cầu cá nhân. Đội ngũ chuyên gia của chúng tôi cam kết:
                  </Typography>

                  <Stack spacing={3}>
                    {[
                      {
                        title: 'Chuyên môn cao',
                        description:
                          'Đội ngũ y bác sĩ được đào tạo chuyên sâu về sức khỏe giới tính',
                      },
                      {
                        title: 'Bảo mật thông tin',
                        description:
                          'Đảm bảo tuyệt đối về bảo mật thông tin cá nhân của khách hàng',
                      },
                      {
                        title: 'Thiết bị hiện đại',
                        description:
                          'Trang thiết bị và công nghệ y tế tiên tiến nhất hiện nay',
                      },
                    ].map((item, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: (theme) => theme.palette.background.paper,
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 30px rgba(74, 144, 226, 0.15)',
                            borderColor: '#4A90E2',
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'rgba(74, 144, 226, 0.15)',
                              color: '#4A90E2',
                            }}
                          >
                            <FavoriteIcon />
                          </Box>
                          <Box>
                            <Typography fontWeight={700} gutterBottom>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.7))',
                  },
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070"
                  alt="Healthcare professionals"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>{' '}
      {/* Stats Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background:
              'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cpath fill="%23ffffff" fill-opacity="0.05" d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z"%3E%3C/path%3E%3C/svg%3E\')',
            opacity: 0.15,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.15) 100%)',
            zIndex: 0,
          },
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 150, md: 300 },
            height: { xs: 150, md: 300 },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            top: { xs: -50, md: -100 },
            left: { xs: -50, md: -100 },
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 200, md: 400 },
            height: { xs: 200, md: 400 },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
            bottom: { xs: -100, md: -200 },
            right: { xs: -100, md: -200 },
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Zoom in={loaded} timeout={1000}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    gutterBottom
                    sx={{ height: '3rem' }}
                  >
                    {loaded && (
                      <CountUp
                        start={0}
                        end={5000}
                        duration={2.5}
                        separator=","
                        suffix="+"
                      />
                    )}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Khách hàng tin tưởng
                  </Typography>
                </Box>
              </Zoom>
            </Grid>

            <Grid item xs={6} md={3}>
              <Zoom in={loaded} timeout={1100}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    gutterBottom
                    sx={{ height: '3rem' }}
                  >
                    {loaded && (
                      <CountUp start={0} end={25} duration={2.5} suffix="+" />
                    )}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Chuyên gia y tế
                  </Typography>
                </Box>
              </Zoom>
            </Grid>

            <Grid item xs={6} md={3}>
              <Zoom in={loaded} timeout={1200}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    gutterBottom
                    sx={{ height: '3rem' }}
                  >
                    {loaded && (
                      <CountUp start={0} end={98} duration={2.5} suffix="%" />
                    )}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Khách hàng hài lòng
                  </Typography>
                </Box>
              </Zoom>
            </Grid>

            <Grid item xs={6} md={3}>
              <Zoom in={loaded} timeout={1300}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    gutterBottom
                    sx={{ height: '3rem' }}
                  >
                    {loaded && (
                      <CountUp start={0} end={15} duration={2.5} suffix="+" />
                    )}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Dịch vụ chuyên biệt
                  </Typography>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Testimonials Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: '#F7FAFC',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: (theme) => `${theme.palette.primary.light}15`,
            top: -150,
            left: -150,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: (theme) => `${theme.palette.secondary.light}15`,
            bottom: -150,
            right: -150,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="ĐÁNH GIÁ TỪ KHÁCH HÀNG"
              sx={{
                mb: 2,
                bgcolor: (theme) => theme.palette.secondary.light + '30',
                color: (theme) => theme.palette.secondary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '16px',
                px: 1.5,
              }}
            />
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                mb: 3,
                color: (theme) => theme.palette.text.primary,
                fontWeight: 800,
                fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.75rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '80px',
                  height: '5px',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, #1ABC9C, #4A90E2)',
                  borderRadius: '10px',
                },
              }}
            >
              Khách hàng nói gì về chúng tôi
            </Typography>
          </Box>{' '}
          <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ minHeight: { xs: 400, md: 600 } }}>
            {testimonialsLoading ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography>Đang tải đánh giá...</Typography>
              </Grid>
            ) : testimonialsError ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography color="error">{testimonialsError}</Typography>
              </Grid>
            ) : (testimonials.length === 0 ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography>Chưa có đánh giá nào.</Typography>
              </Grid>
            ) : (
              testimonials.map((testimonial, index) => (
                <Grid item xs={12} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Fade
                    in={loaded}
                    style={{
                      transitionDelay:
                        index !== undefined ? `${300 + index * 150}ms` : '0ms',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        width: { xs: '100%', sm: '95%', md: '1100px' },
                        maxWidth: 1200,
                        minWidth: 320,
                        minHeight: 320,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        bgcolor: '#fff',
                        position: 'relative',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
                          transform: 'translateY(-5px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          color: (theme) => theme.palette.secondary.light,
                        }}
                      >
                        <FormatQuoteIcon fontSize="large" />
                      </Box>
                      <Typography
                        sx={{
                          mb: 4,
                          color: (theme) => theme.palette.text.secondary,
                          lineHeight: 2.3,
                          fontSize: '1.25rem',
                          flex: 1,
                          minHeight: 120,
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={testimonial.avatar || testimonial.userAvatar || '/img/avatar/default.jpg'}
                          alt={testimonial.userFullName || testimonial.maskedUserName || testimonial.name || 'Khách hàng'}
                          sx={{
                            width: 56,
                            height: 56,
                            border: '2px solid',
                            borderColor: (theme) => theme.palette.primary.light,
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700} fontSize={20}>
                            {testimonial.maskedUserName && testimonial.maskedUserName.trim() ? testimonial.maskedUserName : 'Khách hàng'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role || testimonial.userRole || ''}
                          </Typography>
                          <Rating
                            value={testimonial.rating}
                            readOnly
                            size="medium"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  </Fade>
                </Grid>
              ))
            ))}
          </Grid>
        </Container>{' '}
      </Box>{' '}
      {/* Blog/News Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: (theme) => `${theme.palette.primary.light}10`,
            top: -200,
            right: -200,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: (theme) => `${theme.palette.secondary.light}10`,
            bottom: -100,
            left: -100,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip
              label="TIN TỨC MỚI NHẤT"
              sx={{
                mb: 2,
                bgcolor: (theme) => theme.palette.primary.light + '30',
                color: (theme) => theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '16px',
                px: 1.5,
              }}
            />
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                mb: 3,
                color: (theme) => theme.palette.text.primary,
                fontWeight: 800,
                fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.75rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '80px',
                  height: '5px',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, #4A90E2, #1ABC9C)',
                  borderRadius: '10px',
                },
              }}
            >
              Tin tức & Bài viết
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {blogsLoading ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography>Đang tải bài viết...</Typography>
              </Grid>
            ) : blogsError ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography color="error">{blogsError}</Typography>
              </Grid>
            ) : blogs.length === 0 ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography>Chưa có bài viết nào.</Typography>
              </Grid>
            ) : (
              blogs.map((blog, index) => (
                <Grid item xs={12} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s ease',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.03)',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        '& .MuiCardMedia-root': {
                          transform: 'scale(1.08)',
                        },
                        '& .card-overlay': {
                          opacity: 0.3,
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl.getBlogImageUrl(blog.thumbnailImage || blog.existingThumbnail || blog.displayThumbnail || blog.imageUrl || blog.thumbnail || blog.image)}
                        alt={blog.title}
                        sx={{
                          transition: 'transform 0.8s ease',
                          filter: 'brightness(0.95)',
                        }}
                      />
                      <Box
                        className="card-overlay"
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          background: (theme) =>
                            `linear-gradient(180deg, transparent 50%, ${theme.palette.primary.main}40 100%)`,
                          opacity: 0.2,
                          transition: 'opacity 0.4s ease',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <NewspaperIcon
                          sx={{
                            color: (theme) => theme.palette.text.secondary,
                            fontSize: '0.9rem',
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          Tin tức
                        </Typography>
                        <Box
                          sx={{
                            mx: 1,
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: 'text.disabled',
                          }}
                        />
                        <AccessTimeIcon
                          sx={{
                            color: (theme) => theme.palette.text.secondary,
                            fontSize: '0.9rem',
                            mr: 1,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {blog.createdAt ? (typeof blog.createdAt === 'string' ? blog.createdAt.slice(0, 10).split('-').reverse().join('/') : Array.isArray(blog.createdAt) ? `${blog.createdAt[2]}/${blog.createdAt[1]}/${blog.createdAt[0]}` : '') : ''}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        fontWeight={700}
                      >
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {blog.description || blog.summary || ''}
                      </Typography>{' '}
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          color: '#4A90E2',
                          '&:hover': {
                            background: 'rgba(74, 144, 226, 0.1)',
                            transform: 'translateX(3px)',
                          },
                          transition: 'all 0.3s ease',
                          textTransform: 'none',
                        }}
                        onClick={() => navigate(`/blog/${blog.id || blog.blogId}`)}
                      >
                        Đọc thêm
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            {' '}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/blog')}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 50,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 25px rgba(74, 144, 226, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Xem tất cả bài viết
            </Button>
          </Box>
        </Container>
      </Box>
      {/* FAQ Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F7FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip
              label="CÂU HỎI THƯỜNG GẶP"
              icon={<HelpOutlineIcon />}
              sx={{
                mb: 2,
                bgcolor: (theme) => theme.palette.secondary.light + '30',
                color: (theme) => theme.palette.secondary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '16px',
                px: 1.5,
                '& .MuiChip-icon': {
                  color: (theme) => theme.palette.secondary.main,
                },
              }}
            />
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                mb: 3,
                color: (theme) => theme.palette.text.primary,
                fontWeight: 800,
                fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.75rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '80px',
                  height: '5px',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, #1ABC9C, #4A90E2)',
                  borderRadius: '10px',
                },
              }}
            >
              Giải đáp thắc mắc
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFaqDialogOpen(true)}
              sx={{
                mt: 2,
                borderRadius: 8,
                fontWeight: 600,
                px: 4,
                py: 1.2,
                textTransform: 'none',
                fontSize: '1.05rem',
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                },
              }}
            >
              Đặt câu hỏi
            </Button>
          </Box>{' '}
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {[
              {
                question:
                  'Dịch vụ tư vấn sức khỏe giới tính có đảm bảo tính riêng tư không?',
                answer:
                  'Chúng tôi cam kết đảm bảo tính riêng tư tuyệt đối cho mọi khách hàng. Thông tin cá nhân và nội dung tư vấn được bảo mật nghiêm ngặt theo quy định của pháp luật và đạo đức nghề nghiệp y khoa.',
              },
              {
                question: 'Tôi có thể đặt lịch tư vấn trực tuyến không?',
                answer:
                  'Có, bạn có thể đặt lịch tư vấn trực tuyến thông qua trang web của chúng tôi hoặc ứng dụng di động. Hệ thống sẽ cho phép bạn chọn thời gian phù hợp và bác sĩ tư vấn theo nhu cầu của bạn.',
              },
              {
                question:
                  'Các gói dịch vụ có được bảo hiểm y tế chi trả không?',
                answer:
                  'Một số dịch vụ của chúng tôi được bảo hiểm y tế chi trả, tùy thuộc vào loại bảo hiểm bạn đang sử dụng. Vui lòng liên hệ với nhân viên tư vấn để biết thêm chi tiết về trường hợp cụ thể của bạn.',
              },
              {
                question: 'Tôi cần chuẩn bị gì khi đến khám lần đầu?',
                answer:
                  'Khi đến khám lần đầu, bạn nên mang theo giấy tờ tùy thân, hồ sơ y tế (nếu có), kết quả xét nghiệm hoặc chẩn đoán trước đây (nếu có) và danh sách các loại thuốc đang sử dụng. Bạn cũng nên chuẩn bị sẵn các câu hỏi hoặc vấn đề sức khỏe mà bạn muốn được tư vấn.',
              },
              {
                question:
                  'Trung tâm có cung cấp dịch vụ khám cho cộng đồng LGBTQ+?',
                answer:
                  'Có, chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện và thân thiện cho tất cả mọi người, bao gồm cả cộng đồng LGBTQ+. Đội ngũ nhân viên của chúng tôi được đào tạo để hiểu và tôn trọng nhu cầu đa dạng về sức khỏe giới tính.',
              },
            ].map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  borderRadius: '10px !important',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    mt: 0,
                    borderRadius: '10px !important',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: '10px',
                    '&.Mui-expanded': {
                      borderBottom: '1px solid',
                      borderColor: 'rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          {/* Dialog đặt câu hỏi FAQ */}
          <AskQuestionDialog
            open={faqDialogOpen}
            onClose={() => setFaqDialogOpen(false)}
          />
        </Container>
      </Box>{' '}
    </Box>
  );
};

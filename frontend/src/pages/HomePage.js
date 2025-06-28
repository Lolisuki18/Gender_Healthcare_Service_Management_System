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
  TextField,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import localStorageUtil from '@/utils/localStorage';
import notification from '@/utils/notification';
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
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

// Define animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const HomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // --- LIFECYCLE HOOKS ---
  useEffect(() => {
    // Set loaded after a small delay for animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Kiểm tra và hiển thị thông báo đăng nhập thành công
    const loginMessage = localStorageUtil.get('loginSuccessMessage');

    if (loginMessage) {
      // Hiển thị thông báo
      notification.success(
        loginMessage.title || 'Đăng nhập thành công!',
        loginMessage.message || 'Chào mừng bạn trở lại!',
        {
          duration: 3000,
        }
      );

      // xoá ngay lập tức để tránh hiện thị lại
      localStorageUtil.remove('loginSuccessMessage');
    }

    console.log('HomePage component mounted');

    return () => clearTimeout(timer);
  }, []); // Chỉ chạy 1 lần khi component mount
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
                  color: '#FFFFFF', // Changed to white color
                  animation: `${float} 6s ease-in-out infinite`,
                  lineHeight: 1.2,
                }}
              >
                Gender Health Care
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
                Giải pháp chăm sóc sức khỏe chuyên biệt cho mọi cá nhân với dịch
                vụ toàn diện, tôn trọng và thấu hiểu nhu cầu của bạn
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
                  onClick={() => navigate('/test-registration')}
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

          <Grid container spacing={4}>
            {[
              {
                id: 1,
                title: 'Tư vấn sức khỏe',
                description:
                  'Dịch vụ tư vấn sức khỏe cá nhân với đội ngũ chuyên gia y tế hàng đầu, giải đáp mọi thắc mắc và đưa ra lời khuyên phù hợp.',
                image:
                  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=2070',
                color: '#2C5282',
              },
              {
                id: 2,
                title: 'Khám và điều trị',
                description:
                  'Dịch vụ khám và điều trị toàn diện với trang thiết bị hiện đại, phác đồ cá nhân hóa theo nhu cầu sức khỏe cụ thể.',
                image:
                  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1880',
                color: '#38A169',
              },
              {
                id: 3,
                title: 'Sức khỏe giới tính',
                description:
                  'Dịch vụ chăm sóc sức khỏe giới tính chuyên biệt, đảm bảo quyền riêng tư và tôn trọng cho mọi bản dạng giới.',
                image:
                  'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1941',
                color: '#E53E3E',
              },
            ].map((service) => (
              <Grid item key={service.id} xs={12} sm={6} md={4}>
                <Zoom
                  in={loaded}
                  style={{
                    transitionDelay: service.id
                      ? `${service.id * 100}ms`
                      : '0ms',
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s ease',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(74, 144, 226, 0.25)',
                        '& .MuiCardMedia-root': {
                          transform: 'scale(1.1)',
                        },
                        border: '1px solid rgba(74, 144, 226, 0.2)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        height: '200px',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={service.image}
                        alt={service.title}
                        sx={{
                          transition: 'transform 1s ease',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(to bottom, transparent 30%, ${service.color}99 100%)`,
                        }}
                      />
                      <Chip
                        label={`Dịch vụ #${service.id}`}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h3"
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                          fontWeight: 700,
                          mb: 2,
                          fontSize: '1.5rem',
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          lineHeight: 1.8,
                        }}
                      >
                        {service.description}
                      </Typography>{' '}
                      <Button
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 3,
                          color: '#4A90E2',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: 'rgba(74, 144, 226, 0.1)',
                            transform: 'translateX(5px)',
                          },
                          transition: 'all 0.3s ease',
                          justifyContent: 'flex-start',
                          pl: 0,
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            {' '}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/services')}
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
          <Grid container spacing={4}>
            {[
              {
                name: 'Nguyễn Minh Anh',
                role: 'Khách hàng thường xuyên',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                comment:
                  'Tôi vô cùng hài lòng với dịch vụ tại đây. Các bác sĩ không chỉ chuyên nghiệp mà còn rất thấu hiểu và tôn trọng nhu cầu cá nhân của tôi.',
                rating: 5,
              },
              {
                name: 'Trần Văn Khoa',
                role: 'Khách hàng mới',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                comment:
                  'Lần đầu tiên đến đây tôi đã cảm thấy thoải mái với cách tiếp đón chuyên nghiệp. Các tư vấn viên giải đáp mọi thắc mắc một cách chi tiết.',
                rating: 5,
              },
              {
                name: 'Lê Thị Phương',
                role: 'Khách hàng thân thiết',
                avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                comment:
                  'Đã sử dụng dịch vụ tư vấn sức khỏe định kỳ trong 2 năm qua và luôn hài lòng. Đội ngũ y tế rất tận tâm.',
                rating: 4,
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                {' '}
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
                      height: '100%',
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
                        lineHeight: 1.8,
                        flex: 1,
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{
                          width: 56,
                          height: 56,
                          border: '2px solid',
                          borderColor: (theme) => theme.palette.primary.light,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Fade>
              </Grid>
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
          <Grid container spacing={4}>
            {[
              {
                id: 1,
                title: 'Bảo vệ sức khỏe giới tính an toàn và hiệu quả',
                summary:
                  'Tìm hiểu về các biện pháp bảo vệ sức khỏe giới tính an toàn và hiệu quả nhất hiện nay.',
                image:
                  'https://images.unsplash.com/photo-1579684453607-4f6ed3affcb9?q=80&w=2091',
                date: '12/05/2025',
              },
              {
                id: 2,
                title: 'Những dấu hiệu cảnh báo không nên bỏ qua',
                summary:
                  'Những dấu hiệu sức khỏe quan trọng mà mọi người nên chú ý và tìm kiếm tư vấn y tế kịp thời.',
                image:
                  'https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?q=80&w=2071',
                date: '05/05/2025',
              },
              {
                id: 3,
                title: 'Tầm quan trọng của việc khám sức khỏe định kỳ',
                summary:
                  'Tại sao việc kiểm tra sức khỏe định kỳ lại quan trọng và nên thực hiện với tần suất như thế nào?',
                image:
                  'https://images.unsplash.com/photo-1579165466741-7f35e4755186?q=80&w=2070',
                date: '28/04/2025',
              },
            ].map((blog, index) => (
              <Grid item xs={12} md={4} key={index}>
                {' '}
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
                  {' '}
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.image}
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
                        {blog.date}
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
                      {blog.summary}
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
                    >
                      Đọc thêm
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
        </Container>
      </Box>{' '}
      {/* Call to Action */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background:
            'linear-gradient(135deg, #F5F8FD, rgba(74, 144, 226, 0.1))',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587621144431-845c71d54650?q=80&w=1887')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.05,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}20)`,
            zIndex: 0,
          },
        }}
      >
        {/* Additional decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: (theme) =>
              `radial-gradient(circle, ${theme.palette.secondary.light}20, transparent 70%)`,
            top: '20%',
            left: '5%',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: (theme) =>
              `radial-gradient(circle, ${theme.palette.primary.light}25, transparent 70%)`,
            top: '60%',
            right: '10%',
            zIndex: 0,
          }}
        />
        <Container maxWidth="md">
          {' '}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 6,
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.75rem' },
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Tham gia cộng đồng của chúng tôi
              </Typography>

              <Typography
                variant="h6"
                align="center"
                paragraph
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontWeight: 400,
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 5,
                  lineHeight: 1.8,
                }}
              >
                Đăng ký nhận bản tin để cập nhật các thông tin mới nhất về dịch
                vụ, chương trình ưu đãi và các lời khuyên hữu ích về sức khỏe
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                <TextField
                  placeholder="Nhập email của bạn"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 50,
                      bgcolor: '#fff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    },
                  }}
                />{' '}
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    fontWeight: 600,
                    px: { xs: 3, sm: 5 },
                    py: 1.8,
                    borderRadius: 50,
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                    textTransform: 'none',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    minWidth: { sm: 160 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255,255,255,0.15)',
                      clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                      '&::before': {
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                      },
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Stack>
            </Box>

            {/* Decorative circles */}
            <Box
              sx={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}10)`,
                top: -100,
                left: -100,
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.secondary.main}05)`,
                bottom: -150,
                right: -150,
                zIndex: 0,
              }}
            />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

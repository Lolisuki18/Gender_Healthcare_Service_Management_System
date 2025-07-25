// Thư viện React và các hook cơ bản
import React from 'react';
// Import các component UI từ Material-UI (MUI)
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Container,
  Fade,
  Zoom,
  Avatar,
  Paper,
  Stack,
  // Breadcrumbs, // XÓA
  // Link,        // XÓA
} from '@mui/material';
// Icon từ MUI
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import HomeIcon from '@mui/icons-material/Home'; // XÓA
// React Router
import { useNavigate } from 'react-router-dom';
import { servicesData } from '../data/servicesData';

// Danh sách các dịch vụ hiển thị trên trang
export default function StiPage() {
  const navigate = useNavigate(); // Hook điều hướng
  const [loaded, setLoaded] = React.useState(false); // State để tạo hiệu ứng xuất hiện
  React.useEffect(() => {
    // Hiệu ứng xuất hiện mượt mà khi load trang
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* --- Nền trang với các hình tròn trang trí --- */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
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
            'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}
      >
        {/* Breadcrumbs
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 6,
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
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, mb: '-2px' }} /> Trang chủ
          </Link>
          <Typography color="#4A90E2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Dịch vụ STI
          </Typography>
        </Breadcrumbs> */}
        
        {/* --- Header: Tiêu đề, mô tả, underline --- */}
        <Fade in={loaded} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="✨ Dịch vụ chăm sóc sức khỏe"
              sx={{
                mb: 3,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, rgba(74,144,226,0.1), rgba(26,188,156,0.1))',
                color: '#4A90E2',
                border: '1px solid rgba(74,144,226,0.2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, rgba(74,144,226,0.15), rgba(26,188,156,0.15))',
                },
              }}
            />
            
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                color: 'transparent',
                background: 'linear-gradient(135deg, #4A90E2 0%, #1ABC9C 50%, #667eea 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                mb: 3,
                textShadow: '0 4px 8px rgba(74, 144, 226, 0.1)',
              }}
            >
              Dịch vụ của chúng tôi
            </Typography>

            {/* Gạch chân gradient dưới tiêu đề */}
            <Box
              sx={{
                width: 150,
                height: 8,
                mx: 'auto',
                mb: 4,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 50%, #667eea 100%)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
              }}
            />
            
            <Typography
              sx={{
                color: (theme) => theme.palette.text.secondary,
                maxWidth: '900px',
                mx: 'auto',
                fontSize: { xs: '1.15rem', md: '1.3rem' },
                lineHeight: 1.8,
                fontWeight: 400,
                textAlign: 'center',
                mb: 4,
              }}
            >
              Khám phá các dịch vụ chăm sóc sức khỏe giới tính toàn diện, bảo mật và chuyên nghiệp. 
              Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho bạn.
            </Typography>
          </Box>
        </Fade>
        {/* --- Grid danh sách dịch vụ --- */}
        <Grid container spacing={3} justifyContent="center">
          {servicesData.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <Grid
                item
                xs={12}
                sm={4}
                lg={4}
                key={service.id}
                display="flex"
                justifyContent="center"
              >
                <Zoom
                  in={loaded}
                  style={{ transitionDelay: `${idx * 150 + 400}ms` }}
                >
                  {/* --- Card dịch vụ --- */}
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
                      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(20px)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: `0 25px 50px rgba(${service.color.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(',')}, 0.25)`,
                        border: `1px solid ${service.color}40`,
                        '& .service-icon': {
                          transform: 'scale(1.2) rotate(5deg)',
                          background: `linear-gradient(45deg, ${service.gradientFrom}, ${service.gradientTo})`,
                        },
                        '& .service-button': {
                          background: `linear-gradient(45deg, ${service.gradientFrom}, ${service.gradientTo})`,
                          transform: 'translateY(-2px)',
                        }
                      },
                    }}
                  >
                    {/* --- Header với Icon và Chip --- */}
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
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
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
                              '& .MuiChip-label': { px: 1.5 }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* --- Nội dung card: tiêu đề, mô tả, bullet --- */}
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
                      
                      <List dense disablePadding sx={{ flexGrow: 1, mb: 2 }}>
                        {service.bullets.slice(0, 4).map((bullet, i) => (
                          <ListItem key={i} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckIcon 
                                sx={{ 
                                  color: service.color, 
                                  fontSize: '1.2rem',
                                  fontWeight: 'bold'
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={bullet}
                              primaryTypographyProps={{ 
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#2a2a2a'
                              }}
                            />
                          </ListItem>
                        ))}
                        {service.bullets.length > 4 && (
                          <ListItem sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Typography 
                                sx={{ 
                                  color: service.color, 
                                  fontSize: '0.85rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                +{service.bullets.length - 4}
                              </Typography>
                            </ListItemIcon>
                            <ListItemText
                              primary="Và nhiều tính năng khác..."
                              primaryTypographyProps={{ 
                                fontSize: '0.9rem',
                                fontStyle: 'italic',
                                color: 'text.secondary'
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>

                    {/* --- Nút xem chi tiết --- */}
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
      </Container>
    </Box>
  );
}

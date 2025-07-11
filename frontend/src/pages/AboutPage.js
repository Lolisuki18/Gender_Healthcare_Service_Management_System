import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Fade,
  Zoom,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import SecurityIcon from '@mui/icons-material/Security';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  color: '#fff',
  padding: theme.spacing(12, 2),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '0 0 50px 50px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

const AnimatedIcon = styled(Box)(({ delay = 0 }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.03)',
    boxShadow: '0 12px 32px rgba(74, 144, 226, 0.18)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3, 2, 4, 2),
}));

const MissionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background:
    'linear-gradient(45deg, rgba(74, 144, 226, 0.05), rgba(26, 188, 156, 0.05))',
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '5px',
    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  },
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  height: '100%',
  borderRadius: 18,
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(74,144,226,0.10)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  transition: 'transform 0.25s, box-shadow 0.25s',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.03)',
    boxShadow: '0 12px 32px rgba(74,144,226,0.18)',
  },
}));

export const AboutPage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // Controls animations on page load
  useEffect(() => {
    setLoaded(true);
  }, []);
  // Mock data for team section
  const teamMembers = [
    {
      name: 'Nguyễn Thị Tường Vy',
      mssv: 'SE181801',
      email: 'vynttse181801@fpt.edu.vn',
      image: '',
    },
    {
      name: 'Nguyễn Ly Vi',
      mssv: 'SE181814',
      email: 'vinlse181814@fpt.edu.vn',
      image: '',
    },
    {
      name: 'Nguyễn Đình Duy',
      mssv: 'SE181803',
      email: 'duyndse181803@fpt.edu.vn',
      image: '',
    },
    {
      name: 'Lê Nguyễn An Ninh',
      mssv: 'SE181799',
      email: 'ninhlnase181799@fpt.edu.vn',
      image: '',
    },
    {
      name: 'Nguyễn Văn Cường',
      mssv: 'SE183645',
      email: 'cuongnvse183645@fpt.edu.vn',
      image: '',
    },
  ];
  return (
    <>
      {/* Hero Section */}
      <Fade in={loaded} timeout={1000}>
        <HeroSection>
          <Container maxWidth="lg">
            {/* Background Elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 0,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '5%',
                  left: '10%',
                  width: '300px',
                  height: '300px',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  borderRadius: '50%',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '5%',
                  width: '250px',
                  height: '250px',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  borderRadius: '50%',
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                minHeight: 420,
              }}
            >
              {/* Logo + Icons */}
              <Box
                sx={{
                  position: 'relative',
                  width: 260,
                  height: 260,
                  mx: 'auto',
                  mb: { xs: 4, md: 0 },
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)',
                    boxShadow: '0 8px 32px rgba(74,144,226,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    border: '4px solid #fff',
                    zIndex: 2,
                    position: 'relative',
                  }}
                >
                  <MedicalServicesIcon
                    sx={{ fontSize: 100, color: '#4A90E2', opacity: 0.95 }}
                  />
                </Box>
                {/* Animated icons around the center icon */}
                <AnimatedIcon
                  delay={0}
                  sx={{ position: 'absolute', top: 10, left: 20 }}
                >
                  <MedicalServicesIcon
                    sx={{
                      fontSize: 38,
                      color: '#4A90E2',
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 2,
                    }}
                  />
                </AnimatedIcon>
                <AnimatedIcon
                  delay={0.5}
                  sx={{ position: 'absolute', top: 30, right: 10 }}
                >
                  <FavoriteIcon
                    sx={{
                      fontSize: 38,
                      color: '#E91E63',
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 2,
                    }}
                  />
                </AnimatedIcon>
                <AnimatedIcon
                  delay={1}
                  sx={{ position: 'absolute', bottom: 20, left: 30 }}
                >
                  <FemaleIcon
                    sx={{
                      fontSize: 32,
                      color: '#1ABC9C',
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 2,
                    }}
                  />
                </AnimatedIcon>
                <AnimatedIcon
                  delay={1.5}
                  sx={{ position: 'absolute', bottom: 30, right: 30 }}
                >
                  <MaleIcon
                    sx={{
                      fontSize: 32,
                      color: '#1976D2',
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 2,
                    }}
                  />
                </AnimatedIcon>
                <AnimatedIcon
                  delay={2}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '85%',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <TransgenderIcon
                    sx={{
                      fontSize: 36,
                      color: '#9C27B0',
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 2,
                    }}
                  />
                </AnimatedIcon>
              </Box>
              {/* Hero Text + Stats + Actions */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 2,
                    opacity: 0.9,
                    fontWeight: 500,
                    mb: 1,
                    display: 'block',
                  }}
                >
                  TỰ HÀO PHỤC VỤ CỘNG ĐỒNG
                </Typography>
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight={700}
                  gutterBottom
                  sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                >
                  Giới thiệu về Gender Healthcare
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ opacity: 0.9, mb: 3, maxWidth: 500 }}
                >
                  Thành lập năm 2023, chúng tôi là đơn vị tiên phong trong lĩnh
                  vực chăm sóc sức khỏe giới tính với phương châm "Thấu hiểu -
                  Tôn trọng - Chất lượng"
                </Typography>
                {/* Stats */}
                <Grid
                  container
                  spacing={2}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                  mb={3}
                >
                  {[
                    {
                      icon: <PeopleIcon sx={{ color: '#4A90E2' }} />,
                      value: '10+',
                      label: 'Chuyên gia y tế',
                    },
                    {
                      icon: <FavoriteIcon sx={{ color: '#E91E63' }} />,
                      value: '5000+',
                      label: 'Khách hàng tin tưởng',
                    },
                    {
                      icon: <VerifiedIcon sx={{ color: '#1ABC9C' }} />,
                      value: '98%',
                      label: 'Đánh giá tích cực',
                    },
                  ].map((stat, idx) => (
                    <Grid item key={idx}>
                      <Paper
                        elevation={3}
                        sx={{
                          px: 3,
                          py: 2,
                          borderRadius: 3,
                          minWidth: 110,
                          textAlign: 'center',
                          bgcolor: 'rgba(255,255,255,0.85)',
                          boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {stat.icon}
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#4A90E2"
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {/* Actions */}
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background:
                        'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
                      color: '#fff',
                      fontSize: '16px',
                      px: 4,
                      fontWeight: 600,
                      borderRadius: 999,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      '&:hover': {
                        background:
                          'linear-gradient(90deg, #357ab8 60%, #159c85 100%)',
                      },
                    }}
                    onClick={() => navigate('/consultation')}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Đặt lịch tư vấn
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#fff',
                      color: '#fff',
                      fontSize: '16px',
                      px: 4,
                      fontWeight: 600,
                      borderRadius: 999,
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                    onClick={() => navigate('/sti-services')}
                  >
                    Dịch vụ xét nghiệm
                  </Button>
                </Box>
              </Box>
            </Box>
            {/* Trust Indicators */}
            <Box
              sx={{
                mt: 6,
                py: 2,
                px: { xs: 2, md: 4 },
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-around',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <VerifiedIcon fontSize="small" /> Dịch vụ được Bộ Y tế cấp phép
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: 'none', md: 'block' },
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              />
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PeopleIcon fontSize="small" /> Đội ngũ chuyên gia giàu kinh
                nghiệm
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: 'none', md: 'block' },
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              />
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SpaIcon fontSize="small" /> Không gian riêng tư, thân thiện
              </Typography>
            </Box>
          </Container>
        </HeroSection>
      </Fade>
      {/* Mission and Values Section */}
      <Section>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Sứ mệnh và Giá trị cốt lõi
            </Typography>
          </Box>{' '}
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Zoom
                in={loaded}
                style={{ transitionDelay: loaded ? '300ms' : '0ms' }}
              >
                <MissionCard elevation={0}>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                    sx={{ color: '#4A90E2' }}
                  >
                    Lịch sử phát triển
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Gender Healthcare được thành lập vào năm 2023 bởi nhóm
                    chuyên gia y tế với tầm nhìn xây dựng một trung tâm chăm sóc
                    sức khỏe giới tính hiện đại, chuyên nghiệp và toàn diện tại
                    Việt Nam.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1">
                    Sau 2 năm hoạt động, chúng tôi đã phục vụ hơn 10,000 khách
                    hàng, triển khai nhiều chương trình giáo dục cộng đồng về
                    sức khỏe giới tính và trở thành đối tác tin cậy của nhiều tổ
                    chức y tế quốc tế.
                  </Typography>
                </MissionCard>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={7}>
              {' '}
              <Typography
                variant="h5"
                fontWeight={600}
                gutterBottom
                sx={{ color: '#4A90E2' }}
              >
                Sứ mệnh và Giá trị cốt lõi
              </Typography>
              <Typography variant="body1" paragraph>
                Sứ mệnh của Gender Healthcare là mang đến dịch vụ chăm sóc sức
                khỏe giới tính toàn diện, chất lượng cao và không phán xét cho
                tất cả mọi người, không phân biệt giới tính, xu hướng tính dục
                hay hoàn cảnh kinh tế xã hội.
              </Typography>
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <VerifiedIcon sx={{ color: '#4A90E2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Chuyên môn và đổi mới"
                          secondary="Áp dụng các phương pháp y học tiên tiến nhất và liên tục cập nhật kiến thức để đảm bảo dịch vụ tốt nhất cho khách hàng"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SecurityIcon sx={{ color: '#4A90E2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tôn trọng quyền riêng tư"
                          secondary="Bảo vệ thông tin cá nhân và đảm bảo không gian riêng tư tối đa trong mỗi dịch vụ, từ tư vấn đến xét nghiệm"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PeopleIcon sx={{ color: '#4A90E2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Đa dạng và hòa nhập"
                          secondary="Tạo môi trường thân thiện và không phán xét cho mọi đối tượng, từ thanh thiếu niên đến người cao tuổi, với mọi xu hướng giới tính"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SpaIcon sx={{ color: '#4A90E2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tiếp cận toàn diện"
                          secondary="Kết hợp chăm sóc y tế với hỗ trợ tâm lý, tư vấn dinh dưỡng và các phương pháp hỗ trợ tự nhiên để mang lại sức khỏe toàn diện"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Section>
      {/* Our Services Section */}
      <Section sx={{ bgcolor: 'rgba(74, 144, 226, 0.04)' }}>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Dịch vụ của chúng tôi
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8 }}
            >
              Cung cấp dịch vụ chăm sóc sức khỏe giới tính toàn diện, từ tư vấn
              chuyên sâu đến xét nghiệm và điều trị
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              {
                title: 'Tư vấn Sức khỏe Sinh sản',
                icon: <FemaleIcon sx={{ fontSize: 40, color: '#4A90E2' }} />,
                description:
                  'Tư vấn chuyên sâu về sức khỏe sinh sản, kế hoạch hóa gia đình, và các vấn đề liên quan đến sức khỏe giới tính.',
                action: {
                  label: 'Đặt lịch tư vấn',
                  route: '/consultation',
                },
              },
              {
                title: 'Xét nghiệm STI',
                icon: (
                  <LocalHospitalIcon sx={{ fontSize: 40, color: '#4A90E2' }} />
                ),
                description:
                  'Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STI) với quy trình riêng tư, nhanh chóng và chính xác.',
                action: {
                  label: 'Xem dịch vụ xét nghiệm',
                  route: '/sti-services',
                },
              },
              {
                title: 'Theo dõi chu kỳ kinh nguyệt',
                icon: <SpaIcon sx={{ fontSize: 40, color: '#4A90E2' }} />,
                description:
                  'Hỗ trợ theo dõi chu kỳ kinh nguyệt, dự đoán thời điểm rụng trứng để hỗ trợ kế hoạch hóa gia đình.',
                action: {
                  label: 'Theo dõi chu kỳ',
                  route: '/ovulation',
                },
              },
            ].map((service, index) => (
              <Grid item size={12} xs={12} md={4} key={index}>
                <Zoom
                  in={loaded}
                  style={{
                    transitionDelay: loaded ? `${300 + index * 100}ms` : '0ms',
                  }}
                >
                  <FeatureCard elevation={2}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="center" mb={2}>
                        {service.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        fontWeight={700}
                        textAlign="center"
                        sx={{ letterSpacing: 0.2 }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        mb={3}
                        sx={{ minHeight: 48 }}
                      >
                        {service.description}
                      </Typography>
                      <Box display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          size="large"
                          sx={{
                            borderRadius: 999,
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            fontSize: '1rem',
                            background:
                              'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
                            boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            '&:hover': {
                              background:
                                'linear-gradient(90deg, #357ab8 60%, #159c85 100%)',
                              boxShadow: '0 6px 18px rgba(74,144,226,0.18)',
                            },
                          }}
                          onClick={() => navigate(service.action.route)}
                        >
                          {service.action.label}
                        </Button>
                      </Box>
                    </CardContent>
                  </FeatureCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>{' '}
        </Container>
      </Section>
      {/* Thành tựu và số liệu */}
      <Section sx={{ bgcolor: 'rgba(74, 144, 226, 0.04)' }}>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Thành tựu của chúng tôi
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8, mb: 6 }}
            >
              Những con số ấn tượng phản ánh sự phát triển và uy tín của Gender
              Healthcare
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} sm={4} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" fontWeight={700} color="#4A90E2">
                  10K+
                </Typography>
                <Typography variant="subtitle1">Khách hàng</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" fontWeight={700} color="#4A90E2">
                  25+
                </Typography>
                <Typography variant="subtitle1">Chuyên gia y tế</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" fontWeight={700} color="#4A90E2">
                  3
                </Typography>
                <Typography variant="subtitle1">Chi nhánh toàn quốc</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" fontWeight={700} color="#4A90E2">
                  98%
                </Typography>
                <Typography variant="subtitle1">Khách hàng hài lòng</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box mt={8}>
            <Grid
              container
              spacing={6}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: '#4A90E2', textAlign: 'center', mb: 4 }}
                >
                  Chứng nhận & Giải thưởng
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  {[
                    {
                      title: 'Chứng nhận ISO 9001:2015',
                      desc: 'Quản lý chất lượng dịch vụ y tế đạt chuẩn quốc tế',
                    },
                    {
                      title: 'Top 10 phòng khám tư nhân uy tín 2024',
                      desc: 'Do Hiệp hội Y tế Tư nhân bình chọn',
                    },
                    {
                      title: 'Giải thưởng Sáng kiến Y tế 2024',
                      desc: 'Cho nền tảng tư vấn sức khỏe giới tính trực tuyến',
                    },
                  ].map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          boxShadow: '0 4px 16px rgba(74,144,226,0.10)',
                          minHeight: 110,
                        }}
                      >
                        <VerifiedIcon
                          sx={{ color: '#1ABC9C', fontSize: 36, mt: 0.5 }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 0.5 }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.desc}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="https://cdn.pixabay.com/photo/2017/01/31/13/14/certificate-2025855_1280.png"
                  alt="Chứng nhận và giải thưởng"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    maxWidth: 400,
                    display: 'block',
                    mx: 'auto',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Section>
      {/* Cơ sở vật chất và Công nghệ Section */}
      <Section>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Cơ sở vật chất hiện đại
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8, mb: 6 }}
            >
              Trang thiết bị tiên tiến và môi trường chăm sóc thoải mái, riêng
              tư
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                fontWeight={700}
                sx={{ color: '#4A90E2' }}
              >
                Cơ sở vật chất và Công nghệ tiên tiến
              </Typography>
              <Typography variant="subtitle1" paragraph>
                Gender Healthcare tự hào với hệ thống cơ sở vật chất hiện đại,
                được thiết kế tối ưu cho sự riêng tư và thoải mái của khách
                hàng, cùng với các công nghệ y tế tiên tiến nhất hiện nay.
              </Typography>
              <List>
                {[
                  'Phòng khám được thiết kế riêng biệt, đảm bảo sự riêng tư tuyệt đối cho mọi khách hàng',
                  'Trang thiết bị xét nghiệm hiện đại với độ chính xác cao nhất trên thị trường',
                  'Hệ thống quản lý thông tin bệnh nhân bảo mật theo tiêu chuẩn quốc tế',
                  'Phòng tư vấn tâm lý được thiết kế tạo không gian ấm cúng và thoải mái',
                  'Ứng dụng di động giúp theo dõi lịch hẹn, kết quả và tư vấn trực tuyến 24/7',
                ].map((item, index) => (
                  <ListItem key={index} sx={{ paddingLeft: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VerifiedIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </Section>
      {/* Our Team Section */}
      <Section sx={{ bgcolor: 'rgba(74, 144, 226, 0.04)' }}>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Nhóm phát triển
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8 }}
            >
              Danh sách thành viên nhóm phát triển hệ thống Gender Healthcare
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom
                  in={loaded}
                  style={{
                    transitionDelay: loaded ? `${300 + index * 100}ms` : '0ms',
                  }}
                >
                  <TeamMemberCard elevation={2}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 140,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          'linear-gradient(135deg, #4A90E2 60%, #1ABC9C 100%)',
                        borderBottom: '2px solid #f3f6fa',
                      }}
                    >
                      <Avatar
                        alt={member.name}
                        src={member.image || undefined}
                        sx={{
                          width: 90,
                          height: 90,
                          fontSize: 38,
                          bgcolor: '#4A90E2',
                          color: '#fff',
                          border: '4px solid #fff',
                          boxShadow: '0 2px 12px rgba(74,144,226,0.10)',
                          mt: 2,
                        }}
                      >
                        {member.name.split(' ').slice(-1)[0][0]}
                      </Avatar>
                    </CardMedia>
                    <CardContent sx={{ bgcolor: '#fff', pt: 2, pb: 2 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight={700}
                        textAlign="center"
                        sx={{ fontSize: '1.1rem', letterSpacing: 0.2 }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: 500, fontSize: '0.95rem', mb: 0.5 }}
                        textAlign="center"
                      >
                        {member.mssv}
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                      >
                        <EmailIcon sx={{ color: '#4A90E2', fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.93rem', wordBreak: 'break-all' }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                    </CardContent>
                  </TeamMemberCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>{' '}
        </Container>
      </Section>
      {/* FAQ Section */}
      <Section>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Câu hỏi thường gặp
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8, mb: 6 }}
            >
              Giải đáp những thắc mắc phổ biến về dịch vụ của chúng tôi
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={10}>
              {[
                {
                  question: 'Làm thế nào để đặt lịch tư vấn với chuyên gia?',
                  answer:
                    'Bạn có thể đặt lịch tư vấn trực tuyến thông qua trang web của chúng tôi bằng cách nhấp vào nút "Đặt lịch tư vấn", hoặc gọi trực tiếp đến hotline 1900 xxxx để được hỗ trợ. Chúng tôi cung cấp cả dịch vụ tư vấn trực tiếp tại phòng khám và tư vấn trực tuyến qua video call cho sự thuận tiện của bạn.',
                },
                {
                  question:
                    'Các xét nghiệm STI tại Gender Healthcare có đảm bảo riêng tư không?',
                  answer:
                    'Chúng tôi cam kết bảo vệ quyền riêng tư của khách hàng ở mức cao nhất. Tất cả thông tin cá nhân và kết quả xét nghiệm đều được bảo mật nghiêm ngặt theo tiêu chuẩn y khoa quốc tế. Khách hàng có thể lựa chọn sử dụng dịch vụ ẩn danh, và chỉ bạn mới có quyền truy cập vào kết quả xét nghiệm của mình.',
                },
                {
                  question: 'Bao lâu tôi sẽ nhận được kết quả xét nghiệm?',
                  answer:
                    'Thời gian trả kết quả phụ thuộc vào loại xét nghiệm. Các xét nghiệm nhanh có thể có kết quả trong vòng 30 phút đến 1 giờ. Đối với các xét nghiệm phức tạp hơn, thời gian trả kết quả thường từ 24-48 giờ. Bạn sẽ được thông báo cụ thể về thời gian trả kết quả khi đăng ký dịch vụ.',
                },
                {
                  question:
                    'Gender Healthcare có chấp nhận bảo hiểm y tế không?',
                  answer:
                    'Hiện tại chúng tôi hợp tác với nhiều công ty bảo hiểm y tế hàng đầu tại Việt Nam. Tùy thuộc vào gói bảo hiểm của bạn, một số dịch vụ có thể được bảo hiểm chi trả một phần hoặc toàn bộ. Vui lòng mang theo thẻ bảo hiểm khi đến khám để nhân viên của chúng tôi hỗ trợ kiểm tra quyền lợi bảo hiểm của bạn.',
                },
                {
                  question:
                    'Làm thế nào để theo dõi chu kỳ kinh nguyệt và rụng trứng trên ứng dụng?',
                  answer:
                    'Ứng dụng Gender Healthcare cung cấp tính năng theo dõi chu kỳ kinh nguyệt và dự đoán thời điểm rụng trứng dựa trên thuật toán tiên tiến. Bạn chỉ cần nhập thông tin về ngày bắt đầu chu kỳ kinh nguyệt và độ dài chu kỳ trung bình. Hệ thống sẽ tự động tính toán và gửi thông báo về thời điểm rụng trứng và những ngày có khả năng thụ thai cao.',
                },
                {
                  question:
                    'Trung tâm có cung cấp dịch vụ tư vấn cho thanh thiếu niên không?',
                  answer:
                    'Có, chúng tôi có chương trình tư vấn đặc biệt dành cho thanh thiếu niên từ 14-18 tuổi với quy trình đảm bảo sự nhạy cảm và phù hợp với lứa tuổi. Chúng tôi cung cấp các buổi tư vấn giáo dục giới tính, sức khỏe sinh sản và các vấn đề liên quan khác trong môi trường an toàn, tôn trọng và không phán xét.',
                },
              ].map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '&:before': {
                      display: 'none',
                    },
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      background: 'rgba(74, 144, 226, 0.04)',
                      '&:hover': {
                        background: 'rgba(74, 144, 226, 0.08)',
                      },
                    }}
                  >
                    <Typography fontWeight={600}>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Section>
      {/* Contact and Location Section */}
      <Section sx={{ bgcolor: 'rgba(74, 144, 226, 0.04)' }}>
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#1ABC9C',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                },
              }}
            >
              Liên hệ với chúng tôi
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8, mb: 6 }}
            >
              Có thắc mắc hoặc cần hỗ trợ? Liên hệ với chúng tôi qua các kênh
              dưới đây
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box mb={4}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: '#4A90E2' }}
                >
                  Thông tin liên hệ
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOnIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Địa chỉ"
                      secondary="123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PhoneIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Hotline"
                      secondary="1900 xxxx (8:00 - 20:00, T2-CN)"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <EmailIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary="info@genderhealthcare.com"
                    />
                  </ListItem>
                </List>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
                  Theo dõi chúng tôi
                </Typography>
                <Box>
                  {[
                    { icon: <FacebookIcon />, name: 'Facebook' },
                    { icon: <InstagramIcon />, name: 'Instagram' },
                    { icon: <TwitterIcon />, name: 'Twitter' },
                    { icon: <LinkedInIcon />, name: 'LinkedIn' },
                  ].map((social, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      startIcon={social.icon}
                      sx={{
                        mr: 1,
                        mb: 1,
                        borderColor: 'rgba(74, 144, 226, 0.5)',
                        '&:hover': {
                          borderColor: '#4A90E2',
                          backgroundColor: 'rgba(74, 144, 226, 0.04)',
                        },
                      }}
                    >
                      {social.name}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                sx={{
                  p: { xs: 2, md: 4 },
                  borderRadius: 6,
                  boxShadow: '0 8px 32px rgba(74,144,226,0.10)',
                  bgcolor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: 'center',
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.info(
                    'Tính năng đang phát triển. Vui lòng quay lại sau!',
                    {
                      position: 'top-center',
                      autoClose: 2500,
                    }
                  );
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ mb: 2, textAlign: 'left', width: '100%' }}
                >
                  Gửi yêu cầu hỗ trợ
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Họ và tên *"
                      variant="outlined"
                      required
                      sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Số điện thoại *"
                      variant="outlined"
                      required
                      sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Email *"
                      variant="outlined"
                      type="email"
                      required
                      sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Nội dung yêu cầu *"
                      variant="outlined"
                      multiline
                      minRows={1}
                      maxRows={4}
                      required
                      sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: '1rem',
                        background:
                          'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
                        boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        '&:hover': {
                          background:
                            'linear-gradient(90deg, #357ab8 60%, #159c85 100%)',
                          boxShadow: '0 6px 18px rgba(74,144,226,0.18)',
                        },
                      }}
                    >
                      Gửi yêu cầu
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          {/* Bản đồ */}
          <Box mt={6} borderRadius="16px" overflow="hidden" height="400px">
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.712991690893!2d106.8097243153346!3d10.84112869226547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175271d1b6e7e2b%3A0x6e7b6b6b6b6b6b6b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgUXXhuq1uIDksIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgUXXhuq1uIDksIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1685531234567!5m2!1svi!2s"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Đại học FPT Hồ Chí Minh"
            />
          </Box>
        </Container>
      </Section>
      {/* Call-to-Action Section */}
      <Section
        sx={{
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" py={4}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
            >
              Hãy để chúng tôi đồng hành cùng bạn
            </Typography>
            <Typography
              variant="subtitle1"
              paragraph
              sx={{ maxWidth: '800px', mx: 'auto', opacity: 0.9 }}
            >
              Đặt lịch tư vấn với chuyên gia của chúng tôi hoặc tìm hiểu thêm về
              các dịch vụ xét nghiệm và tư vấn sức khỏe
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: '#fff',
                  color: '#4A90E2',
                  fontSize: '16px',
                  padding: '10px 24px',
                  '&:hover': {
                    background: '#f0f0f0',
                  },
                  mr: { xs: 0, md: 2 },
                  mb: { xs: 2, md: 0 },
                }}
                onClick={() => navigate('/appointment')}
              >
                Đặt lịch tư vấn
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#fff',
                  color: '#fff',
                  fontSize: '16px',
                  padding: '10px 24px',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => navigate('/sti-services')}
              >
                Dịch vụ xét nghiệm
              </Button>
            </Box>
          </Box>
        </Container>
      </Section>
      <ToastContainer />
    </>
  );
};

export default AboutPage;

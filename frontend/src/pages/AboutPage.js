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
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  display: 'flex',
  flexDirection: 'column',
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
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
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
      name: 'TS. BS Nguyễn Thị Minh Tâm',
      role: 'Giám đốc Y khoa',
      image: '/static/doctor1.jpg',
      description:
        'Chuyên gia Sản phụ khoa với hơn 15 năm kinh nghiệm tại các bệnh viện hàng đầu và đã tham gia nhiều chương trình nghiên cứu quốc tế về sức khỏe sinh sản.',
    },
    {
      name: 'ThS. Lê Thanh Hải',
      role: 'Trưởng bộ phận Tư vấn',
      image: '/static/doctor2.jpg',
      description:
        'Thạc sĩ Tâm lý học Lâm sàng với chuyên môn về sức khỏe tâm thần giới tính. Có 12 năm kinh nghiệm tư vấn tâm lý tại các tổ chức y tế lớn.',
    },
    {
      name: 'PGS.TS Trần Quốc Bảo',
      role: 'Chuyên gia Nghiên cứu',
      image: '/static/doctor3.jpg',
      description:
        'Phó Giáo sư về Vi sinh và Dịch tễ học, có nhiều công trình nghiên cứu về các bệnh lây truyền qua đường tình dục được công bố quốc tế.',
    },
    {
      name: 'CN. Hoàng Thị Ngọc Lan',
      role: 'Điều phối viên Dịch vụ',
      image: '/static/staff.jpg',
      description:
        'Chuyên gia quản lý dịch vụ y tế với bề dày kinh nghiệm trong việc xây dựng quy trình chăm sóc khách hàng chất lượng cao và nhạy cảm về văn hóa.',
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

            <Grid
              container
              spacing={4}
              alignItems="center"
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <Grid item xs={12} md={6}>
                <Zoom in={loaded} timeout={1200}>
                  <Box>
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
                      sx={{ opacity: 0.9, mb: 3, maxWidth: '90%' }}
                    >
                      Thành lập năm 2023, chúng tôi là đơn vị tiên phong trong
                      lĩnh vực chăm sóc sức khỏe giới tính với phương châm "Thấu
                      hiểu - Tôn trọng - Chất lượng"
                    </Typography>

                    {/* Stats Row */}
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ color: 'rgba(255,255,255,0.95)' }}
                        >
                          10+
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Chuyên gia y tế
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ color: 'rgba(255,255,255,0.95)' }}
                        >
                          5000+
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Khách hàng tin tưởng
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ color: 'rgba(255,255,255,0.95)' }}
                        >
                          98%
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Đánh giá tích cực
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          background: '#fff',
                          color: '#4A90E2',
                          fontSize: '16px',
                          padding: '10px 24px',
                          fontWeight: 600,
                          '&:hover': {
                            background: '#f0f0f0',
                          },
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        }}
                        onClick={() => navigate('/appointment')}
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
                          padding: '10px 24px',
                          fontWeight: 600,
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
                </Zoom>
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 350,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {/* Decorative Elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '200px', md: '300px' },
                      height: { xs: '200px', md: '300px' },
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      backdropFilter: 'blur(5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src="/static/logo-white.png"
                      alt="Gender Healthcare Logo"
                      sx={{
                        width: '70%',
                        height: 'auto',
                        objectFit: 'contain',
                        opacity: 0.9,
                      }}
                    />
                  </Box>

                  <AnimatedIcon delay={0}>
                    <MedicalServicesIcon
                      sx={{
                        fontSize: 60,
                        position: 'absolute',
                        top: '10%',
                        left: '20%',
                        opacity: 0.8,
                      }}
                    />
                  </AnimatedIcon>
                  <AnimatedIcon delay={0.5}>
                    <FavoriteIcon
                      sx={{
                        fontSize: 70,
                        position: 'absolute',
                        top: '40%',
                        right: '15%',
                        opacity: 0.8,
                      }}
                    />
                  </AnimatedIcon>
                  <AnimatedIcon delay={1}>
                    <FemaleIcon
                      sx={{
                        fontSize: 50,
                        position: 'absolute',
                        bottom: '20%',
                        left: '30%',
                        opacity: 0.8,
                      }}
                    />
                  </AnimatedIcon>
                  <AnimatedIcon delay={1.5}>
                    <MaleIcon
                      sx={{
                        fontSize: 50,
                        position: 'absolute',
                        top: '60%',
                        right: '30%',
                        opacity: 0.8,
                      }}
                    />
                  </AnimatedIcon>
                  <AnimatedIcon delay={2}>
                    <TransgenderIcon
                      sx={{
                        fontSize: 60,
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        opacity: 0.8,
                      }}
                    />{' '}
                  </AnimatedIcon>
                  <AnimatedIcon delay={0.7}>
                    <SecurityIcon
                      sx={{
                        fontSize: 45,
                        position: 'absolute',
                        bottom: '60%',
                        left: '15%',
                        opacity: 0.8,
                        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))',
                      }}
                    />
                  </AnimatedIcon>
                  <AnimatedIcon delay={1.2}>
                    <LocalHospitalIcon
                      sx={{
                        fontSize: 50,
                        position: 'absolute',
                        top: '65%',
                        right: '25%',
                        opacity: 0.8,
                        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))',
                      }}
                    />
                  </AnimatedIcon>
                </Box>
              </Grid>
            </Grid>

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
              },
              {
                title: 'Xét nghiệm STI',
                icon: (
                  <LocalHospitalIcon sx={{ fontSize: 40, color: '#4A90E2' }} />
                ),
                description:
                  'Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STI) với quy trình riêng tư, nhanh chóng và chính xác.',
              },
              {
                title: 'Theo dõi chu kỳ kinh nguyệt',
                icon: <SpaIcon sx={{ fontSize: 40, color: '#4A90E2' }} />,
                description:
                  'Hỗ trợ theo dõi chu kỳ kinh nguyệt, dự đoán thời điểm rụng trứng để hỗ trợ kế hoạch hóa gia đình.',
              },
            ].map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                        fontWeight={600}
                        textAlign="center"
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>{' '}
        </Container>
      </Section>
      {/* Timeline phát triển */}
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
              Hành trình phát triển
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8, mb: 6 }}
            >
              Theo dõi quá trình phát triển của Gender Healthcare từ ngày đầu
              thành lập đến nay
            </Typography>
          </Box>

          <Box sx={{ position: 'relative' }}>
            {/* Đường timeline */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: 0,
                bottom: 0,
                width: '4px',
                bgcolor: 'rgba(74, 144, 226, 0.2)',
                zIndex: 1,
              }}
            />

            {/* Timeline items */}
            <Grid container>
              {/* Mốc 1 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mb: 6 }}>
                  <Box
                    sx={{
                      width: '50%',
                      pr: { xs: 2, md: 6 },
                      textAlign: 'right',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        right: { xs: '-10px', md: '-14px' },
                        top: '15px',
                        width: { xs: '20px', md: '28px' },
                        height: { xs: '20px', md: '28px' },
                        borderRadius: '50%',
                        bgcolor: '#4A90E2',
                        zIndex: 2,
                        boxShadow: '0 0 0 4px rgba(74, 144, 226, 0.2)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: '#4A90E2' }}
                    >
                      Tháng 3, 2023
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Thành lập Gender Healthcare
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nhóm sáng lập bao gồm các chuyên gia y tế hàng đầu trong
                      lĩnh vực sức khỏe giới tính quyết định thành lập trung tâm
                      với tầm nhìn cung cấp dịch vụ toàn diện và chuyên nghiệp.
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%' }}></Box>
                </Box>
              </Grid>

              {/* Mốc 2 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mb: 6 }}>
                  <Box sx={{ width: '50%' }}></Box>
                  <Box
                    sx={{
                      width: '50%',
                      pl: { xs: 2, md: 6 },
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: { xs: '-10px', md: '-14px' },
                        top: '15px',
                        width: { xs: '20px', md: '28px' },
                        height: { xs: '20px', md: '28px' },
                        borderRadius: '50%',
                        bgcolor: '#4A90E2',
                        zIndex: 2,
                        boxShadow: '0 0 0 4px rgba(74, 144, 226, 0.2)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: '#4A90E2' }}
                    >
                      Tháng 6, 2023
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Khai trương phòng khám đầu tiên
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phòng khám đầu tiên của Gender Healthcare được khai trương
                      tại Hà Nội với trang thiết bị hiện đại và đội ngũ y bác sĩ
                      chuyên môn cao.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Mốc 3 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mb: 6 }}>
                  <Box
                    sx={{
                      width: '50%',
                      pr: { xs: 2, md: 6 },
                      textAlign: 'right',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        right: { xs: '-10px', md: '-14px' },
                        top: '15px',
                        width: { xs: '20px', md: '28px' },
                        height: { xs: '20px', md: '28px' },
                        borderRadius: '50%',
                        bgcolor: '#4A90E2',
                        zIndex: 2,
                        boxShadow: '0 0 0 4px rgba(74, 144, 226, 0.2)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: '#4A90E2' }}
                    >
                      Tháng 12, 2023
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Hợp tác quốc tế
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ký kết hợp tác với các tổ chức y tế quốc tế để áp dụng các
                      phương pháp tiên tiến và tham gia nghiên cứu khoa học.
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%' }}></Box>
                </Box>
              </Grid>

              {/* Mốc 4 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mb: 6 }}>
                  <Box sx={{ width: '50%' }}></Box>
                  <Box
                    sx={{
                      width: '50%',
                      pl: { xs: 2, md: 6 },
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: { xs: '-10px', md: '-14px' },
                        top: '15px',
                        width: { xs: '20px', md: '28px' },
                        height: { xs: '20px', md: '28px' },
                        borderRadius: '50%',
                        bgcolor: '#4A90E2',
                        zIndex: 2,
                        boxShadow: '0 0 0 4px rgba(74, 144, 226, 0.2)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: '#4A90E2' }}
                    >
                      Tháng 6, 2024
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Mở rộng chi nhánh
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mở thêm chi nhánh tại Thành phố Hồ Chí Minh và Đà Nẵng, mở
                      rộng phạm vi phục vụ khách hàng trên cả nước.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Mốc 5 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      width: '50%',
                      pr: { xs: 2, md: 6 },
                      textAlign: 'right',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        right: { xs: '-10px', md: '-14px' },
                        top: '15px',
                        width: { xs: '20px', md: '28px' },
                        height: { xs: '20px', md: '28px' },
                        borderRadius: '50%',
                        bgcolor: '#4A90E2',
                        zIndex: 2,
                        boxShadow: '0 0 0 4px rgba(74, 144, 226, 0.2)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: '#4A90E2' }}
                    >
                      Hiện tại, 2025
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Phát triển nền tảng số
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ra mắt nền tảng số toàn diện, nâng cao trải nghiệm khách
                      hàng với tư vấn trực tuyến 24/7, đặt lịch khám và quản lý
                      hồ sơ sức khỏe.
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%' }}></Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
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
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: '#4A90E2' }}
                >
                  Chứng nhận và giải thưởng
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Chứng nhận ISO 9001:2015"
                      secondary="Quản lý chất lượng dịch vụ y tế đạt chuẩn quốc tế"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Top 10 phòng khám tư nhân uy tín 2024"
                      secondary="Do Hiệp hội Y tế Tư nhân bình chọn"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedIcon sx={{ color: '#1ABC9C' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Giải thưởng Sáng kiến Y tế 2024"
                      secondary="Cho nền tảng tư vấn sức khỏe giới tính trực tuyến"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/static/certificates.jpg"
                  alt="Chứng nhận và giải thưởng"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
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
              <Box
                component="img"
                src="/static/healthcare-approach.jpg"
                alt="Cơ sở vật chất hiện đại"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Grid>
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
              Đội ngũ chuyên gia
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2, opacity: 0.8 }}
            >
              Đội ngũ chuyên gia giàu kinh nghiệm, tận tâm và luôn sẵn sàng hỗ
              trợ bạn
            </Typography>
          </Box>
          <Grid container spacing={4}>
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
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                      }}
                    >
                      <Avatar
                        alt={member.name}
                        src={member.image}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '4px solid white',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                      />
                    </CardMedia>
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        fontWeight={600}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.description}
                      </Typography>
                    </CardContent>
                  </TeamMemberCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>{' '}
        </Container>
      </Section>
      {/* Thành tựu và Đối tác Section */}
      <Section sx={{ bgcolor: 'rgba(74, 144, 226, 0.02)' }}>
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
              Thành tựu & Đối tác
            </Typography>
          </Box>

          <Grid container spacing={4} mb={6}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: 'rgba(74, 144, 226, 0.03)',
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color="#4A90E2"
                  gutterBottom
                >
                  10.000+
                </Typography>
                <Typography variant="subtitle1">
                  Khách hàng đã phục vụ
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: 'rgba(74, 144, 226, 0.03)',
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color="#4A90E2"
                  gutterBottom
                >
                  98%
                </Typography>
                <Typography variant="subtitle1">Khách hàng hài lòng</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: 'rgba(74, 144, 226, 0.03)',
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color="#4A90E2"
                  gutterBottom
                >
                  25+
                </Typography>
                <Typography variant="subtitle1">Chuyên gia y tế</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: 'rgba(74, 144, 226, 0.03)',
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color="#4A90E2"
                  gutterBottom
                >
                  15+
                </Typography>
                <Typography variant="subtitle1">Đối tác quốc tế</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight={600} gutterBottom>
            Đối tác chiến lược
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': { filter: 'grayscale(0%)' },
                }}
              >
                <Box
                  component="img"
                  src="/static/partner1.png"
                  alt="Đối tác 1"
                  sx={{ maxHeight: '60px', maxWidth: '100%' }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': { filter: 'grayscale(0%)' },
                }}
              >
                <Box
                  component="img"
                  src="/static/partner2.png"
                  alt="Đối tác 2"
                  sx={{ maxHeight: '60px', maxWidth: '100%' }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': { filter: 'grayscale(0%)' },
                }}
              >
                <Box
                  component="img"
                  src="/static/partner3.png"
                  alt="Đối tác 3"
                  sx={{ maxHeight: '60px', maxWidth: '100%' }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': { filter: 'grayscale(0%)' },
                }}
              >
                <Box
                  component="img"
                  src="/static/partner4.png"
                  alt="Đối tác 4"
                  sx={{ maxHeight: '60px', maxWidth: '100%' }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': { filter: 'grayscale(0%)' },
                }}
              >
                <Box
                  component="img"
                  src="/static/partner5.png"
                  alt="Đối tác 5"
                  sx={{ maxHeight: '60px', maxWidth: '100%' }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80px',
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': { filter: 'grayscale(0%)' },
                }}
              >
                <Box
                  component="img"
                  src="/static/partner6.png"
                  alt="Đối tác 6"
                  sx={{ maxHeight: '60px', maxWidth: '100%' }}
                />
              </Paper>
            </Grid>
          </Grid>
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
          </Box>{' '}
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
                </List>{' '}
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
                  p: 4,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  bgcolor: 'white',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Gửi yêu cầu hỗ trợ
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nội dung yêu cầu"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        '&:hover': {
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          opacity: 0.9,
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394633630224!2d106.68191377587839!3d10.78171445901442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f36a61ecb59%3A0x9157935fb412c4ee!2zMTIzIE5ndXnhu4VuIFRyw6NpLCBC4bq_biBUaMOgbmgsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1692432180836!5m2!1svi!2s"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Vị trí phòng khám"
            />
          </Box>
        </Container>
      </Section>{' '}
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
                  p: 4,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  bgcolor: 'white',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Gửi yêu cầu hỗ trợ
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nội dung yêu cầu"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        '&:hover': {
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          opacity: 0.9,
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394633630224!2d106.68191377587839!3d10.78171445901442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f36a61ecb59%3A0x9157935fb412c4ee!2zMTIzIE5ndXnhu4VuIFRyw6NpLCBC4bq_biBUaMOgbmgsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1692432180836!5m2!1svi!2s"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Vị trí phòng khám"
            />
          </Box>
        </Container>
      </Section>{' '}
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
              <Accordion
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
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>
                    Làm thế nào để đặt lịch tư vấn với chuyên gia?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Bạn có thể đặt lịch tư vấn trực tuyến thông qua trang web
                    của chúng tôi bằng cách nhấp vào nút "Đặt lịch tư vấn", hoặc
                    gọi trực tiếp đến hotline 1900 xxxx để được hỗ trợ. Chúng
                    tôi cung cấp cả dịch vụ tư vấn trực tiếp tại phòng khám và
                    tư vấn trực tuyến qua video call cho sự thuận tiện của bạn.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
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
                  <Typography fontWeight={600}>
                    Các xét nghiệm STI tại Gender Healthcare có đảm bảo riêng tư
                    không?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Chúng tôi cam kết bảo vệ quyền riêng tư của khách hàng ở mức
                    cao nhất. Tất cả thông tin cá nhân và kết quả xét nghiệm đều
                    được bảo mật nghiêm ngặt theo tiêu chuẩn y khoa quốc tế.
                    Khách hàng có thể lựa chọn sử dụng dịch vụ ẩn danh, và chỉ
                    bạn mới có quyền truy cập vào kết quả xét nghiệm của mình.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
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
                  <Typography fontWeight={600}>
                    Bao lâu tôi sẽ nhận được kết quả xét nghiệm?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Thời gian trả kết quả phụ thuộc vào loại xét nghiệm. Các xét
                    nghiệm nhanh có thể có kết quả trong vòng 30 phút đến 1 giờ.
                    Đối với các xét nghiệm phức tạp hơn, thời gian trả kết quả
                    thường từ 24-48 giờ. Bạn sẽ được thông báo cụ thể về thời
                    gian trả kết quả khi đăng ký dịch vụ.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
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
                  <Typography fontWeight={600}>
                    Gender Healthcare có chấp nhận bảo hiểm y tế không?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Hiện tại chúng tôi hợp tác với nhiều công ty bảo hiểm y tế
                    hàng đầu tại Việt Nam. Tùy thuộc vào gói bảo hiểm của bạn,
                    một số dịch vụ có thể được bảo hiểm chi trả một phần hoặc
                    toàn bộ. Vui lòng mang theo thẻ bảo hiểm khi đến khám để
                    nhân viên của chúng tôi hỗ trợ kiểm tra quyền lợi bảo hiểm
                    của bạn.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
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
                  <Typography fontWeight={600}>
                    Làm thế nào để theo dõi chu kỳ kinh nguyệt và rụng trứng
                    trên ứng dụng?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Ứng dụng Gender Healthcare cung cấp tính năng theo dõi chu
                    kỳ kinh nguyệt và dự đoán thời điểm rụng trứng dựa trên
                    thuật toán tiên tiến. Bạn chỉ cần nhập thông tin về ngày bắt
                    đầu chu kỳ kinh nguyệt và độ dài chu kỳ trung bình. Hệ thống
                    sẽ tự động tính toán và gửi thông báo về thời điểm rụng
                    trứng và những ngày có khả năng thụ thai cao.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
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
                  <Typography fontWeight={600}>
                    Trung tâm có cung cấp dịch vụ tư vấn cho thanh thiếu niên
                    không?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Có, chúng tôi có chương trình tư vấn đặc biệt dành cho thanh
                    thiếu niên từ 14-18 tuổi với quy trình đảm bảo sự nhạy cảm
                    và phù hợp với lứa tuổi. Chúng tôi cung cấp các buổi tư vấn
                    giáo dục giới tính, sức khỏe sinh sản và các vấn đề liên
                    quan khác trong môi trường an toàn, tôn trọng và không phán
                    xét.
                  </Typography>
                </AccordionDetails>
              </Accordion>
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
                  <Button
                    variant="outlined"
                    startIcon={<FacebookIcon />}
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
                    Facebook
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<InstagramIcon />}
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
                    Instagram
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TwitterIcon />}
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
                    Twitter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LinkedInIcon />}
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
                    LinkedIn
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  bgcolor: 'white',
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Gửi yêu cầu hỗ trợ
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      variant="outlined"
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nội dung yêu cầu"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        '&:hover': {
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          opacity: 0.9,
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394633630224!2d106.68191377587839!3d10.78171445901442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f36a61ecb59%3A0x9157935fb412c4ee!2zMTIzIE5ndXnhu4VuIFRyw6NpLCBC4bq_biBUaMOgbmgsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1692432180836!5m2!1svi!2s"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Vị trí phòng khám"
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
    </>
  );
};

export default AboutPage;

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
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
// Icon từ MUI
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// React Router
import { useNavigate } from 'react-router-dom';

// Danh sách các dịch vụ hiển thị trên trang
const services = [
  {
    id: 1,
    title: 'Xét nghiệm các bệnh lây truyền qua đường tình dục (STI)',
    shortDesc: 'Dịch vụ xét nghiệm toàn diện các bệnh lây truyền qua đường tình dục với kết quả bảo mật và hỗ trợ chuyên nghiệp.',
    bullets: [
      'Xét nghiệm STI toàn diện',
      'Có các xét nghiệm lẻ',
      'Trả kết quả nhanh',
      'Bảo mật thông tin',
      'Tư vấn chuyên sâu',
    ],
    detailRoute: '/services/sti-testing',
  },
  {
    id: 2,
    title: 'Theo dõi chu kỳ rụng trứng',
    shortDesc: 'Theo dõi chu kỳ kinh nguyệt, dự đoán rụng trứng và nhắc nhở tránh thai.',
    bullets: [
      'Theo dõi chu kỳ',
      'Dự đoán rụng trứng',
      'Cảnh báo cửa sổ thụ thai',
      'Nhắc nhở tránh thai',
      'Ghi chú triệu chứng',
    ],
    detailRoute: '/services/cycle-tracking',
  },
  {
    id: 3,
    title: 'Tư vấn trực tuyến',
    shortDesc: 'Đặt lịch hẹn trực tuyến với chuyên gia y tế cho lời khuyên cá nhân hóa.',
    bullets: [
      'Tư vấn qua video',
      'Nhắn tin bảo mật',
      'Dịch vụ kê đơn',
      'Chăm sóc sau tư vấn',
      'Giới thiệu chuyên khoa',
    ],
    detailRoute: '/services/online-consultation',
  },
  {
    id: 4,
    title: 'Giáo dục sức khỏe tình dục',
    shortDesc: 'Tài liệu và hội thảo về sức khỏe sinh sản và tình dục.',
    bullets: [
      'Hội thảo trực tuyến',
      'Tài liệu giáo dục',
      'Nhóm thảo luận',
      'Hướng dẫn cá nhân',
      'Thông tin dựa trên bằng chứng',
    ],
    detailRoute: '/services/sexual-health-education',
  },
  {
    id: 5,
    title: 'Chăm sóc khẳng định giới',
    shortDesc: 'Dịch vụ chăm sóc sức khỏe hỗ trợ cho mọi bản dạng giới.',
    bullets: [
      'Tư vấn khẳng định giới',
      'Hướng dẫn liệu pháp hormone',
      'Dịch vụ giới thiệu',
      'Tư vấn hỗ trợ',
      'Chăm sóc toàn diện',
    ],
    detailRoute: '/services/gender-affirming-care',
  },
  {
    id: 6,
    title: 'Tư vấn sức khỏe sinh sản',
    shortDesc: 'Tư vấn về kế hoạch hóa gia đình, sinh sản và các vấn đề sức khỏe sinh sản.',
    bullets: [
      'Tư vấn kế hoạch hóa',
      'Tư vấn sinh sản',
      'Chăm sóc tiền thai',
      'Tư vấn lựa chọn mang thai',
      'Giáo dục sức khỏe sinh sản',
    ],
    detailRoute: '/services/reproductive-health-counseling',
  },
];

export default function StiPage() {
  const navigate = useNavigate(); // Hook điều hướng
  const theme = useTheme(); // Hook lấy theme MUI
  const [loaded, setLoaded] = React.useState(false); // State để tạo hiệu ứng xuất hiện
  React.useEffect(() => {
    // Hiệu ứng xuất hiện mượt mà khi load trang
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
      {/* --- Nền trang với các hình tròn trang trí --- */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,144,226,0.08) 0%, rgba(255,255,255,0) 70%)',
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
          background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, rgba(255,255,255,0) 70%)',
          bottom: { xs: -100, md: -200 },
          right: { xs: -100, md: -200 },
          zIndex: 0,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
        {/* --- Header: Tiêu đề, mô tả, underline --- */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 2,
              gap: 2,
            }}
          >
            {/* Có thể thêm Chip ở đây nếu muốn */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                color: 'transparent',
                background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-1px',
                mb: 2,
              }}
            >
              Dịch vụ của chúng tôi
            </Typography>
          </Box>
          {/* Gạch chân gradient dưới tiêu đề */}
          <Box
            sx={{
              width: 120,
              height: 6,
              mx: 'auto',
              mt: 2,
              mb: 2,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
            }}
          />
          <Typography
            sx={{
              color: theme => theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              mt: 2,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            Các dịch vụ chăm sóc sức khỏe giới tính toàn diện, bảo mật và chuyên nghiệp.
          </Typography>
        </Box>
        {/* --- Grid danh sách dịch vụ --- */}
        <Grid container spacing={4} justifyContent="center">
          {services.map((service, idx) => (
            <Grid item xs={12} sm={6} md={4} key={service.id} display="flex" justifyContent="center">
              <Zoom in={loaded} style={{ transitionDelay: `${idx * 100 + 200}ms` }}>
                {/* --- Card dịch vụ --- */}
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
                    width: '100%',
                    maxWidth: 340,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(180deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(74, 144, 226, 0.18)',
                      border: '1px solid rgba(74, 144, 226, 0.2)',
                    },
                  }}
                >
                  {/* --- Ảnh dịch vụ và Chip số thứ tự --- */}
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: '#e3f2fd',
                      borderRadius: 2,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <Chip
                      label={`Dịch vụ #${service.id}`}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: 'rgba(74,144,226,0.1)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: theme.palette.primary.main,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Typography color="#bdbdbd" fontWeight={600} fontSize={18}>
                      Ảnh dịch vụ
                    </Typography>
                  </Box>
                  {/* --- Nội dung card: tiêu đề, mô tả, bullet --- */}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h3"
                      sx={{
                        color: theme => theme.palette.text.primary,
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '1.15rem',
                        minHeight: 56,
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme => theme.palette.text.secondary,
                        mb: 2,
                        fontSize: '1rem',
                        minHeight: 48,
                      }}
                    >
                      {service.shortDesc}
                    </Typography>
                    <List dense disablePadding sx={{ flexGrow: 1 }}>
                      {service.bullets.map((b, i) => (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={b} primaryTypographyProps={{ fontSize: 15 }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  {/* --- Nút xem chi tiết --- */}
                  <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                      onClick={() => navigate(service.detailRoute)}
                      sx={{
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 50,
                        px: 3,
                        py: 1.2,
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                        textTransform: 'none',
                        fontSize: '1.05rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 25px rgba(74, 144, 226, 0.25)',
                        },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
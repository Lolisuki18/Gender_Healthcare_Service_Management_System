import React from 'react';
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
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Xét nghiệm các bệnh lây truyền qua đường tình dục (STI)',
    shortDesc:
      'Dịch vụ xét nghiệm toàn diện các bệnh lây truyền qua đường tình dục với kết quả bảo mật và hỗ trợ chuyên nghiệp.',
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
    shortDesc:
      'Theo dõi chu kỳ kinh nguyệt, dự đoán rụng trứng và nhắc nhở tránh thai.',
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
    shortDesc:
      'Đặt lịch hẹn trực tuyến với chuyên gia y tế cho lời khuyên cá nhân hóa.',
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
    shortDesc:
      'Tư vấn về kế hoạch hóa gia đình, sinh sản và các vấn đề sức khỏe sinh sản.',
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
  const navigate = useNavigate();
  const firstService = services[0];
  const otherServices = services.slice(1);
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" fontWeight={700} mb={1}>
        Dịch vụ của chúng tôi
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Các dịch vụ chăm sóc sức khỏe giới tính toàn diện, bảo mật và chuyên
        nghiệp.
      </Typography>
      <Typography variant="h5" fontWeight={700} mb={1} textAlign="center">
        Các dịch vụ chăm sóc sức khỏe giới tính toàn diện, bảo mật và chuyên
        nghiệp.
      </Typography>
      <Grid container spacing={3}>
        {services.map((service, idx) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={service.id}
            display="flex"
            justifyContent="center"
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                width: '100%',
                maxWidth: 320,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box
                  sx={{
                    height: 120,
                    bgcolor: '#f4f8fc',
                    borderRadius: 2,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="#bdbdbd">Ảnh dịch vụ</Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {service.title}
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  {service.shortDesc}
                </Typography>
                <List dense disablePadding sx={{ flexGrow: 1 }}>
                  {service.bullets.map((b, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={b}
                        primaryTypographyProps={{ fontSize: 15 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(service.detailRoute)}
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

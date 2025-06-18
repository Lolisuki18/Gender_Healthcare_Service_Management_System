import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Card, CardContent, Button, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { getAllSTIPackages } from '@/services/stiService';

export default function StiDetailPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllSTIPackages();
        if (res.success) setPackages(res.data);
      } catch {
        setPackages([]);
      }
    };
    fetchPackages();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Quay lại Dịch vụ
      </Button>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STI)
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Dịch vụ xét nghiệm toàn diện và bảo mật các bệnh lây truyền qua đường tình dục với kết quả nhanh chóng và hỗ trợ chuyên nghiệp.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={3} mb={1}>Mô tả dịch vụ</Typography>
      <Typography mb={2}>
        Dịch vụ xét nghiệm STI cung cấp các gói xét nghiệm tổng quát và xét nghiệm lẻ cho các bệnh như HIV, chlamydia, lậu, giang mai, herpes, viêm gan B, viêm gan C... Kết quả bảo mật, tư vấn chuyên sâu và hỗ trợ điều trị nếu cần thiết.
      </Typography>
      <Typography variant="h6" fontWeight={700} mt={3} mb={1}>Quy trình xét nghiệm</Typography>
      <List>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Tư vấn ban đầu với chuyên gia y tế về lịch sử sức khỏe và triệu chứng." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Lấy mẫu: tuỳ loại xét nghiệm có thể lấy máu, nước tiểu hoặc dịch." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Mẫu được gửi đến phòng xét nghiệm đạt chuẩn để phân tích." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Trả kết quả nhanh chóng (2-5 ngày làm việc)." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Tư vấn kết quả và hỗ trợ điều trị nếu cần thiết." /></ListItem>
      </List>
      <Typography variant="h6" fontWeight={700} mt={3} mb={1}>Lý do chọn dịch vụ của chúng tôi</Typography>
      <List>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Bảo mật tuyệt đối thông tin khách hàng." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Trang thiết bị hiện đại, kết quả chính xác." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Đội ngũ chuyên gia tận tâm, tư vấn chuyên sâu." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Đặt lịch linh hoạt, dễ dàng." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Hỗ trợ điều trị và kê đơn nếu cần thiết." /></ListItem>
      </List>
      <Typography variant="h6" fontWeight={700} mt={3} mb={1}>Khi nào nên xét nghiệm?</Typography>
      <List>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Khi có bạn tình mới hoặc nhiều bạn tình." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Khi có triệu chứng nghi ngờ mắc bệnh lây truyền qua đường tình dục." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Sau khi quan hệ không an toàn." /></ListItem>
        <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Định kỳ kiểm tra sức khỏe tình dục." /></ListItem>
      </List>
      <Typography variant="h6" fontWeight={700} mt={3} mb={2}>Bảng giá dịch vụ</Typography>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        {packages.map(pkg => (
          <Grid item xs={12} sm={6} md={6} key={pkg.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, width: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography fontWeight={700} mb={1}>{pkg.name}</Typography>
                <Typography color="text.secondary" mb={2}>{pkg.description}</Typography>
                <Typography fontWeight={700} color="primary" mb={2}>
                  {pkg.price?.toLocaleString('vi-VN')} đ
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button variant="contained" fullWidth onClick={() => navigate('/test-registration', { state: { selectedPackage: pkg } })}>Đăng ký</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 
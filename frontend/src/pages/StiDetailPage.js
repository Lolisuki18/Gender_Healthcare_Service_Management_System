// Thư viện React và các hook cơ bản
import React, { useEffect, useState } from 'react';
// Import các component UI từ Material-UI (MUI)
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  useTheme,
  Container,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// Icon từ MUI
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// React Router
import { useNavigate } from 'react-router-dom';
// Hàm gọi API lấy danh sách gói xét nghiệm
import { getAllSTIPackages } from '@/services/stiService';

export default function StiDetailPage() {
  const navigate = useNavigate(); // Hook điều hướng
  const [packages, setPackages] = useState([]); // Danh sách gói xét nghiệm
  const theme = useTheme(); // Hook lấy theme MUI
  const [loaded, setLoaded] = React.useState(false); // State hiệu ứng xuất hiện
  const [detailDialogOpen, setDetailDialogOpen] = useState(false); // Dialog chi tiết gói
  const [detailData, setDetailData] = useState(null); // Dữ liệu chi tiết gói

  useEffect(() => {
    // Lấy danh sách gói xét nghiệm khi load trang
    const fetchPackages = async () => {
      try {
        const res = await getAllSTIPackages();
        if (res.success) setPackages(res.data);
      } catch {
        setPackages([]);
      }
    };
    fetchPackages();
    // Hiệu ứng xuất hiện mượt mà
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Hàm mở dialog chi tiết gói
  const handleOpenDetail = (pkg) => {
    setDetailData(pkg);
    setDetailDialogOpen(true);
  };

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
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        {/* --- Nút quay lại --- */}
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, fontWeight: 600, color: theme => theme.palette.primary.main, background: 'rgba(74,144,226,0.07)', borderRadius: 50, px: 3, py: 1, textTransform: 'none', '&:hover': { background: 'rgba(74,144,226,0.15)' } }}
          onClick={() => navigate(-1)}
        >
          Quay lại Dịch vụ
        </Button>
        {/* --- Header: Tiêu đề, mô tả, underline --- */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            {/* <Chip
              label="DỊCH VỤ SỨC KHỎE GIỚI TÍNH"
              sx={{
                bgcolor: theme => theme.palette.primary.light + '30',
                color: theme => theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '24px',
                px: 2.5,
                py: 1.2,
                height: 'auto',
                letterSpacing: 0.5,
                mr: { xs: 0, sm: 2 },
              }}
            /> */}
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
              Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STI)
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
              maxWidth: '700px',
              mx: 'auto',
              mt: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.7,
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            Dịch vụ xét nghiệm toàn diện và bảo mật các bệnh lây truyền qua đường tình dục với kết quả nhanh chóng và hỗ trợ chuyên nghiệp.
          </Typography>
        </Box>
        {/* --- Grid danh sách gói xét nghiệm --- */}
        <Box sx={{ bgcolor: '#fff', borderRadius: 4, boxShadow: '0 4px 24px rgba(74,144,226,0.07)', p: { xs: 2, md: 4 }, mb: 4 }}>
          <Typography variant="h6" fontWeight={700} mt={2} mb={1} color={theme => theme.palette.primary.main}>Mô tả dịch vụ</Typography>
          <Typography mb={2} color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Dịch vụ xét nghiệm STI cung cấp các gói xét nghiệm tổng quát và xét nghiệm lẻ cho các bệnh như HIV, chlamydia, lậu, giang mai, herpes, viêm gan B, viêm gan C... Kết quả bảo mật, tư vấn chuyên sâu và hỗ trợ điều trị nếu cần thiết.
          </Typography>
          <Typography variant="h6" fontWeight={700} mt={3} mb={1} color={theme => theme.palette.primary.main}>Quy trình xét nghiệm</Typography>
          <List sx={{
            '& .MuiListItem-root': { py: 0.5 },
            '& .MuiListItemText-primary': { lineHeight: 1.5 },
          }}>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Tư vấn ban đầu với chuyên gia y tế về lịch sử sức khỏe và triệu chứng." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Lấy mẫu: tuỳ loại xét nghiệm có thể lấy máu, nước tiểu hoặc dịch." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Mẫu được gửi đến phòng xét nghiệm đạt chuẩn để phân tích." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Trả kết quả nhanh chóng (2-5 ngày làm việc)." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Tư vấn kết quả và hỗ trợ điều trị nếu cần thiết." /></ListItem>
          </List>
          <Typography variant="h6" fontWeight={700} mt={3} mb={1} color={theme => theme.palette.primary.main}>Lý do chọn dịch vụ của chúng tôi</Typography>
          <List sx={{
            '& .MuiListItem-root': { py: 0.5 },
            '& .MuiListItemText-primary': { lineHeight: 1.5 },
          }}>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Bảo mật tuyệt đối thông tin khách hàng." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Trang thiết bị hiện đại, kết quả chính xác." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Đội ngũ chuyên gia tận tâm, tư vấn chuyên sâu." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Đặt lịch linh hoạt, dễ dàng." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Hỗ trợ điều trị và kê đơn nếu cần thiết." /></ListItem>
          </List>
          <Typography variant="h6" fontWeight={700} mt={3} mb={1} color={theme => theme.palette.primary.main}>Khi nào nên xét nghiệm?</Typography>
          <List sx={{
            '& .MuiListItem-root': { py: 0.5 },
            '& .MuiListItemText-primary': { lineHeight: 1.5 },
          }}>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Khi có bạn tình mới hoặc nhiều bạn tình." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Khi có triệu chứng nghi ngờ mắc bệnh lây truyền qua đường tình dục." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Sau khi quan hệ không an toàn." /></ListItem>
            <ListItem><ListItemIcon><CheckIcon color="success" /></ListItemIcon><ListItemText primary="Định kỳ kiểm tra sức khỏe tình dục." /></ListItem>
          </List>
        </Box>
        {/* Bảng giá dịch vụ */}
        <Typography variant="h5" fontWeight={800} mb={3} textAlign="center" color={theme => theme.palette.text.primary}>
          Bảng giá dịch vụ
        </Typography>
        <Grid container spacing={4} sx={{ width: '100%' }} justifyContent="center">
          {packages.map((pkg, idx) => (
            <Grid item xs={12} sm={6} md={6} key={pkg.id} display="flex" justifyContent="center">
              <Zoom in={loaded} style={{ transitionDelay: `${idx * 100 + 200}ms` }}>
                {/* --- Card gói xét nghiệm --- */}
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
                  width: '100%',
                  maxWidth: 380,
                  minWidth: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 340,
                  transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(180deg, #f8faff 0%, #f0f7ff 50%, #e8f4ff 100%)',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.03)',
                    boxShadow: '0 20px 40px rgba(74, 144, 226, 0.18)',
                    border: '1px solid rgba(74, 144, 226, 0.2)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
                    <Box>
                      <Typography fontWeight={700} mb={1} color={theme => theme.palette.text.primary} fontSize={18}>{pkg.name}</Typography>
                      <Typography color="text.secondary" mb={2}>{pkg.description}</Typography>
                    </Box>
                    <Typography fontWeight={700} color="primary" mb={2} fontSize={18}>
                      {pkg.price?.toLocaleString('vi-VN')} đ
                    </Typography>
                  </CardContent>
                  {/* --- Nút đăng ký và xem chi tiết --- */}
                  <Box sx={{ p: 2, pt: 0, mt: 'auto', display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 16,
                        px: 0.5,
                        py: 0.2,
                        minWidth: 60,
                        fontSize: '0.85rem',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 18px rgba(74, 144, 226, 0.18)',
                        },
                      }}
                      onClick={() => navigate('/test-registration', { state: { selectedPackage: pkg } })}
                    >
                      Đăng ký
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: 16,
                        fontWeight: 600,
                        px: 0.5,
                        py: 0.2,
                        minWidth: 60,
                        fontSize: '0.85rem',
                        ml: 1,
                        borderColor: theme => theme.palette.primary.main,
                        color: theme => theme.palette.primary.main,
                        textTransform: 'none',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: theme => theme.palette.primary.dark,
                          background: 'rgba(74,144,226,0.07)',
                        },
                      }}
                      onClick={() => handleOpenDetail(pkg)}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
        {/* Dialog chi tiết gói */}
        <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, fontSize: 26, color: theme => theme.palette.primary.main, textAlign: 'center', letterSpacing: '-1px' }}>
            {detailData?.name || 'Chi tiết gói xét nghiệm'}
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: '#f7fafc', borderRadius: 3, p: 4 }}>
            {detailData ? (
              <>
                <Typography mb={2} color="text.secondary" textAlign="center">{detailData.description}</Typography>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                  <Typography fontWeight={700} color="primary" fontSize={20} mr={1}>{detailData.price?.toLocaleString('vi-VN')} đ</Typography>
                </Box>
                {detailData.services && Array.isArray(detailData.services) && detailData.services.length > 0 && (
                  <>
                    <Typography fontWeight={700} mt={2} mb={1.5} color={theme => theme.palette.primary.main} textAlign="center">Các dịch vụ trong gói</Typography>
                    <List dense sx={{ pl: 1 }}>
                      {detailData.services.map((svc, i) => (
                        <ListItem key={svc.id || i} sx={{ py: 0.5, borderRadius: 2, mb: 0.5, bgcolor: '#fff', boxShadow: '0 1px 4px rgba(74,144,226,0.04)' }}>
                          <ListItemIcon sx={{ minWidth: 28 }}><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                          <ListItemText
                            primary={<Box display="flex" alignItems="center" gap={1}>
                              <Typography fontSize={15} color="text.primary" fontWeight={600}>{svc.name}</Typography>
                              <Typography fontSize={14} color="primary" fontWeight={500} ml={1}>{svc.price ? svc.price.toLocaleString('vi-VN') + ' đ' : ''}</Typography>
                            </Box>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </>
            ) : (
              <Typography color="error">Không thể tải chi tiết gói.</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button onClick={() => setDetailDialogOpen(false)} variant="outlined" sx={{ borderRadius: 8, fontWeight: 600, minWidth: 120 }}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 
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
                  borderRadius: 6,
                  boxShadow: '0 8px 32px rgba(74,144,226,0.13)',
                  width: '100%',
                  maxWidth: 380,
                  minWidth: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 360,
                  transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(180deg, #f8faff 0%, #f0f7ff 60%, #e8f4ff 100%)',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.03)',
                    boxShadow: '0 28px 56px 0 rgba(74,144,226,0.22)',
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180, p: 3 }}>
                    <Box>
                      <Typography
                        fontWeight={900}
                        fontSize={22}
                        sx={{
                          background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1,
                          fontFamily: 'inherit',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {pkg.name}
                      </Typography>
                      <Typography color="text.secondary" mb={2} fontSize={15} sx={{ minHeight: 44, fontWeight: 400 }}>
                        {pkg.description}
                      </Typography>
                    </Box>
                    <Typography fontWeight={800} color="primary" mb={2} fontSize={20}>
                      {pkg.price?.toLocaleString('vi-VN')} đ
                    </Typography>
                  </CardContent>
                  {/* --- Nút đăng ký và xem chi tiết --- */}
                  <Box sx={{ p: 2, pt: 0, mt: 'auto', display: 'flex', gap: 2.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
                        color: '#fff',
                        fontWeight: 800,
                        borderRadius: 50,
                        px: 3,
                        py: 1.3,
                        minWidth: 110,
                        height: 44,
                        fontSize: '1.05rem',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
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
                        borderRadius: 50,
                        fontWeight: 800,
                        px: 3,
                        py: 1.3,
                        minWidth: 100,
                        height: 44,
                        fontSize: '1.05rem',
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
                      Chi tiết
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
                    <Typography
                      fontWeight={900}
                      fontSize={22}
                      sx={{
                        background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textAlign: 'center',
                        mb: 2,
                        mt: 3,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      Các dịch vụ trong gói
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      {detailData.services.map((svc, i) => (
                        <Box
                          key={svc.id || i}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: 'linear-gradient(90deg, #e3f0ff 0%, #e0f7fa 100%)',
                            borderRadius: 4,
                            boxShadow: '0 2px 8px rgba(74,144,226,0.07)',
                            px: 2.5,
                            py: 0.2,
                            minHeight: 28,
                            transition: 'box-shadow 0.2s',
                          }}
                        >
                          <CheckIcon sx={{ color: '#43a047', fontSize: 28, mr: 1 }} />
                          <Typography fontSize={16} color="text.primary" fontWeight={700} flex={1}>
                            {svc.name}
                          </Typography>
                          {svc.price && (
                            <Typography fontSize={15} color="primary" fontWeight={700} ml={2}>
                              {svc.price.toLocaleString('vi-VN')} đ
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
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
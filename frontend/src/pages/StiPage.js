import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  MenuItem,
  Container,
  Avatar,
  useTheme,
} from "@mui/material";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import useAuthCheck from "@/hooks/useAuthCheck";
import { useNavigate } from "react-router-dom";

const packages = [
  {
    id: "basic",
    name: "Gói Cơ Bản",
    description: "Xét nghiệm những bệnh thường gặp.",
    price: 500000,
    details: ["HIV", "Giang mai", "Lậu", "Chlamydia"],
    icon: <MedicalServicesIcon fontSize="large" color="primary" />,
  },
  {
    id: "advanced",
    name: "Gói Nâng Cao",
    description: "Phù hợp cho người có nguy cơ cao.",
    price: 1200000,
    details: ["HIV", "Giang mai", "Lậu", "Chlamydia", "HPV", "Herpes"],
    icon: <LocalHospitalIcon fontSize="large" color="success" />,
  },
  {
    id: "premium",
    name: "Gói Toàn Diện",
    description: "Xét nghiệm toàn bộ bệnh STI.",
    price: 2000000,
    details: ["Tất cả các xét nghiệm", "Tư vấn chuyên sâu", "Ưu tiên lịch hẹn"],
    icon: <WorkspacePremiumIcon fontSize="large" color="warning" />,
  },
];

const facilities = [
  { value: 'coso1', label: 'Cơ sở 1 - Quận 1' },
  { value: 'coso2', label: 'Cơ sở 2 - Quận 3' },
  { value: 'coso3', label: 'Cơ sở 3 - Quận 7' },
];

export default function STITestPage() {
    // 1. Lấy trạng thái đăng nhập từ custom hook useAuthCheck.
  const { isLoggedIn } = useAuthCheck();
  // 2. Sử dụng hook useNavigate từ react-router-dom để điều hướng chương trình đến các trang khác.
  const navigate = useNavigate();
  // 3. selectedPackage: State lưu trữ ID của gói xét nghiệm mà người dùng đã chọn (ví dụ: "basic", "advanced", "premium").
  const [selectedPackage, setSelectedPackage] = useState("");
  // 4. openDetailDialog: State boolean kiểm soát việc hiển thị (true) hoặc ẩn (false) hộp thoại chi tiết gói xét nghiệm.
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  // 5. openRegisterDialog: State boolean kiểm soát việc hiển thị (true) hoặc ẩn (false) hộp thoại đăng ký xét nghiệm.
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  // 6. currentPackageDetail: State lưu trữ chi tiết của gói xét nghiệm được chọn (ví dụ: tên, mô tả, giá).
  const [currentPackageDetail, setCurrentPackageDetail] = useState(null);
  // 7. userInfo: State lưu trữ thông tin đăng ký xét nghiệm của người dùng (ví dụ: ngày, cơ sở khám).
  const [userInfo, setUserInfo] = useState({
    date: "",
    dob: "",
    facility: "",
  });

  const theme = useTheme();

  // Hàm xử lý đăng ký xét nghiệm check đăng nhập
  const handleRegister = () => {
    if (!selectedPackage) {
      alert("Vui lòng chọn gói xét nghiệm.");
      return;
    }
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setOpenRegisterDialog(true);
  };

  const handleConfirmRegister = () => {
    // Thêm kiểm tra validation cho các trường
    if (!userInfo.date) {
      alert("Vui lòng chọn ngày muốn xét nghiệm.");
      return;
    }
    if (!userInfo.facility) {
      alert("Vui lòng chọn cơ sở khám.");
      return;
    }

    alert(`Đăng ký gói: ${selectedPackage}\nThông tin: ${JSON.stringify(userInfo, null, 2)}`);
    setOpenRegisterDialog(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        py: 6,
      }}
    >
      {/* Box bọc ngoài cùng: tạo nền gradient cho toàn trang và căn giữa nội dung */}
      <Container maxWidth="md">
        {/* Box chứa tiêu đề và mô tả */}
        <Box mb={4}>
          {/* Tiêu đề lớn của trang */}
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{
              background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Đăng ký xét nghiệm STI
          </Typography>
          {/* Mô tả ngắn về lợi ích xét nghiệm */}
          <Typography variant="body1" textAlign="center" color="text.secondary">
            Kiểm tra sức khỏe sinh sản định kỳ giúp phát hiện sớm và điều trị hiệu quả các bệnh lây truyền qua đường tình dục (STI).
          </Typography>
        </Box>

        {/* Nhóm chọn gói xét nghiệm */}
        <RadioGroup value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}>
          {/* Lưới hiển thị các gói xét nghiệm */}
          <Grid container spacing={4} justifyContent="center">
            {packages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                {/* Card hiển thị từng gói xét nghiệm */}
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: selectedPackage === pkg.id ? 8 : 2,
                    border: selectedPackage === pkg.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                    transition: 'all 0.3s',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: 12,
                      transform: 'translateY(-6px) scale(1.03)',
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {/* Nút chọn gói xét nghiệm */}
                  <Radio
                    checked={selectedPackage === pkg.id}
                    value={pkg.id}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      boxShadow: 2,
                      p: 0.5,
                    }}
                    onClick={e => e.stopPropagation()}
                    onChange={() => setSelectedPackage(pkg.id)}
                  />
                  {/* Nội dung card: icon, tên, mô tả, giá */}
                  <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                    {/* Icon đại diện gói xét nghiệm */}
                    <Avatar sx={{ bgcolor: '#fff', mx: 'auto', mb: 1, width: 56, height: 56, boxShadow: 2 }}>
                      {pkg.icon}
                    </Avatar>
                    {/* Tên gói xét nghiệm */}
                    <FormControlLabel
                      value={pkg.id}
                      control={<span />}
                      label={
                        <Typography variant="h6" fontWeight="bold" color={selectedPackage === pkg.id ? 'primary' : 'text.primary'}>
                          {pkg.name}
                        </Typography>
                      }
                      sx={{ display: 'block', mb: 1, alignItems: 'center', justifyContent: 'center' }}
                    />
                    {/* Mô tả ngắn */}
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {pkg.description}
                    </Typography>
                    {/* Giá tiền */}
                    <Typography color="primary" fontWeight="bold" fontSize={20}>
                      {pkg.price.toLocaleString()} VNĐ
                    </Typography>
                  </CardContent>
                  {/* Nút xem chi tiết gói */}
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={e => { e.stopPropagation(); setCurrentPackageDetail(pkg); setOpenDetailDialog(true); }}
                      sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>

        {/* Nút đăng ký xét nghiệm */}
        <Box textAlign="center" mt={7} mb={2}>
          <Button
            variant="contained"
            size="large"
            onClick={handleRegister}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: 20,
              background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
              boxShadow: 4,
              textTransform: 'none',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'linear-gradient(90deg, #42a5f5, #1976d2)',
                boxShadow: 8,
                transform: 'scale(1.04)',
              },
            }}
          >
            Đăng ký xét nghiệm
          </Button>
        </Box>

        {/* Dialog hiển thị chi tiết gói xét nghiệm */}
        <Dialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)',
            },
          }}
        >
          {/* Tiêu đề dialog: icon và tên gói */}
          <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: 24, pb: 0 }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
              <Avatar sx={{ bgcolor: '#fff', width: 56, height: 56, boxShadow: 2, mb: 1 }}>
                {currentPackageDetail?.icon}
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {currentPackageDetail?.name}
              </Typography>
            </Box>
          </DialogTitle>
          {/* Nội dung dialog: mô tả, chi tiết, giá */}
          <DialogContent>
            <Box mt={2}>
              <Typography variant="subtitle1" color="text.secondary" textAlign="center" mb={2}>
                {currentPackageDetail?.description}
              </Typography>
              {/* Danh sách chi tiết các xét nghiệm */}
              <Box component="ul" sx={{ listStyle: 'none', pl: 0, mb: 0 }}>
                {currentPackageDetail?.details.map((item, index) => (
                  <Box component="li" key={index} display="flex" alignItems="center" mb={1.5}>
                    <span style={{ color: theme.palette.success.main, marginRight: 8 }}>
                      ●
                    </span>
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>
              {/* Giá tiền */}
              <Typography variant="h6" color="primary" fontWeight="bold" textAlign="center" mt={3}>
                Giá: {currentPackageDetail?.price?.toLocaleString()} VNĐ
              </Typography>
            </Box>
          </DialogContent>
          {/* Nút đóng dialog */}
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button onClick={() => setOpenDetailDialog(false)} variant="outlined" sx={{ borderRadius: 3 }}>Đóng</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog form đăng ký xét nghiệm */}
        <Dialog
          open={openRegisterDialog}
          onClose={() => setOpenRegisterDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)',
            },
          }}
        >
          {/* Tiêu đề dialog đăng ký */}
          <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: 24 }}>
            Thông tin đăng ký xét nghiệm
          </DialogTitle>
          {/* Nội dung form đăng ký: ngày và cơ sở khám */}
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                {/* Nhập ngày muốn xét nghiệm */}
                <TextField fullWidth type="date" label="Ngày muốn xét nghiệm" margin="normal" InputLabelProps={{ shrink: true }} value={userInfo.date} onChange={e => setUserInfo({ ...userInfo, date: e.target.value })} variant="outlined" sx={{ borderRadius: 3, background: '#fff' }} />
              </Grid>
              <Grid item xs={12}>
                {/* Chọn cơ sở khám */}
                <TextField
                  fullWidth
                  select
                  label="Cơ sở khám"
                  margin="normal"
                  value={userInfo.facility}
                  onChange={e => setUserInfo({ ...userInfo, facility: e.target.value })}
                  variant="outlined"
                  sx={{ borderRadius: 3, background: '#fff' }}
                  InputLabelProps={{ style: { fontWeight: 'bold' } }}
                >
                  <MenuItem value="">Chọn cơ sở khám</MenuItem>
                  {facilities.map(fac => (
                    <MenuItem key={fac.value} value={fac.value}>{fac.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          {/* Nút hủy và xác nhận đăng ký */}
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button onClick={() => setOpenRegisterDialog(false)} variant="outlined" sx={{ borderRadius: 3, minWidth: 100 }}>Hủy</Button>
            <Button variant="contained" onClick={handleConfirmRegister} sx={{ borderRadius: 3, minWidth: 120, fontWeight: 'bold', background: 'linear-gradient(90deg, #1976d2, #42a5f5)', '&:hover': { background: 'linear-gradient(90deg, #42a5f5, #1976d2)' } }}>Xác nhận</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

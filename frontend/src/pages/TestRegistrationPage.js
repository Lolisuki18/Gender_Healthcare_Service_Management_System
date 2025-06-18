import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getAllSTIServices, getAllSTIPackages, getSTITestDetails } from '@/services/stiService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import vi from 'date-fns/locale/vi';
import { useLocation } from 'react-router-dom';

const steps = [
  'Chọn loại dịch vụ',
  'Chọn ngày & giờ',
  'Ghi chú',
  'Thanh toán',
];

export default function TestRegistrationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [singleTests, setSingleTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('single');
  const [pageSingle, setPageSingle] = useState(1);
  const [pagePackage, setPagePackage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const location = useLocation();

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesResponse, packagesResponse] = await Promise.all([
          getAllSTIServices(),
          getAllSTIPackages()
        ]);
        if (servicesResponse.success) {
          setSingleTests(servicesResponse.data);
        }
        if (packagesResponse.success) {
          setPackages(packagesResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tự động chọn gói nếu được truyền từ state
  useEffect(() => {
    if (location.state && location.state.selectedPackage && packages.length > 0) {
      const idx = packages.findIndex(pkg => pkg.id === location.state.selectedPackage.id);
      if (idx !== -1) {
        setActiveTab('package');
        setSelectedService({ type: 'package', idx });
        // Nếu gói nằm ở trang khác, chuyển trang cho đúng
        const page = Math.floor(idx / ITEMS_PER_PAGE) + 1;
        setPagePackage(page);
      }
    }
  }, [location.state, packages]);

  const handleSelectService = (type, idx) => {
    setSelectedService({ type, idx });
  };

  // Pagination logic
  const paginatedSingleTests = singleTests.slice((pageSingle - 1) * ITEMS_PER_PAGE, pageSingle * ITEMS_PER_PAGE);
  const paginatedPackages = packages.slice((pagePackage - 1) * ITEMS_PER_PAGE, pagePackage * ITEMS_PER_PAGE);
  const totalSinglePages = Math.ceil(singleTests.length / ITEMS_PER_PAGE);
  const totalPackagePages = Math.ceil(packages.length / ITEMS_PER_PAGE);

  const handleOpenDetail = (id, type = 'single') => {
    let data = null;
    if (type === 'single') {
      data = singleTests.find(item => item.id === id);
    } else if (type === 'package') {
      data = packages.find(item => item.id === id);
    }
    setDetailData(data);
    setDetailDialogOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Đặt lịch hẹn mới
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Lên lịch tư vấn với các chuyên gia chăm sóc sức khỏe của chúng tôi
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label, idx) => (
          <Step key={label}>
            <StepLabel>{idx === 0 ? <b>{idx + 1}</b> : idx + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : activeStep === 0 && (
        <></>
      )}
      {/* Bước 1: Chọn loại dịch vụ */}
      {activeStep === 0 && (
        <Box sx={{ background: '#fff', borderRadius: 2, p: 3, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Chọn loại dịch vụ
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Chọn loại tư vấn bạn cần
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, mb: 3, alignItems: 'flex-end', bgcolor: '#f4f8fc', p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                fontWeight: 700,
                fontSize: 28,
                color: activeTab === 'single' ? '#357ae8' : '#757575',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s',
              }}
              onClick={() => setActiveTab('single')}
            >
              Xét nghiệm lẻ
              {activeTab === 'single' && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    bottom: -6,
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                fontWeight: 700,
                fontSize: 28,
                color: activeTab === 'package' ? '#357ae8' : '#757575',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s',
              }}
              onClick={() => setActiveTab('package')}
            >
              Gói xét nghiệm
              {activeTab === 'package' && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    bottom: -6,
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #357ae8 0%, #3ec6b7 100%)',
                  }}
                />
              )}
            </Box>
          </Box>
          {/* Danh sách dịch vụ theo tab */}
          {activeTab === 'single' && (
            <>
              <Box mb={2}>
                {paginatedSingleTests.map((service, idx) => (
                  <Card
                    key={service.id}
                    variant={selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx) ? 'outlined' : 'elevation'}
                    sx={{
                      borderColor: selectedService?.type === 'single' && selectedService?.idx === ((pageSingle - 1) * ITEMS_PER_PAGE + idx) ? 'primary.main' : 'grey.200',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      mb: 2,
                      width: '100%',
                    }}
                    onClick={() => handleSelectService('single', (pageSingle - 1) * ITEMS_PER_PAGE + idx)}
                  >
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Box>
                        <Typography fontWeight={700}>{service.name}</Typography>
                        <Typography color="text.secondary" fontSize={14} mb={1}>{service.description}</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTimeIcon sx={{ fontSize: 18 }} />
                          <Typography fontSize={13}>{service.duration || '30 phút'}</Typography>
                          {service.label && <Chip label={service.label} size="small" sx={{ ml: 1 }} />}
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography fontWeight={700} fontSize={16}>{service.price ? service.price.toLocaleString('vi-VN') + ' đ' : ''}</Typography>
                        <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); handleOpenDetail(service.id, 'single'); }} sx={{ ml: 2, textTransform: 'none', borderRadius: 2 }}>
                          Xem chi tiết
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              {/* Pagination for single tests */}
              {totalSinglePages > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Button onClick={() => setPageSingle(page => Math.max(1, page - 1))} disabled={pageSingle === 1} sx={{ minWidth: 32 }}><NavigateBeforeIcon /></Button>
                  {[...Array(totalSinglePages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={pageSingle === i + 1 ? 'contained' : 'outlined'}
                      sx={{ minWidth: 40, mx: 0.5, fontWeight: 700, fontSize: 20, borderRadius: 2, background: pageSingle === i + 1 ? '#357ae8' : undefined, color: pageSingle === i + 1 ? '#fff' : '#222' }}
                      onClick={() => setPageSingle(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button onClick={() => setPageSingle(page => Math.min(totalSinglePages, page + 1))} disabled={pageSingle === totalSinglePages} sx={{ minWidth: 32 }}><NavigateNextIcon /></Button>
                </Box>
              )}
            </>
          )}
          {activeTab === 'package' && (
            <>
              <Box mb={2}>
                {paginatedPackages.map((service, idx) => (
                  <Card
                    key={service.id}
                    variant={selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx) ? 'outlined' : 'elevation'}
                    sx={{
                      borderColor: selectedService?.type === 'package' && selectedService?.idx === ((pagePackage - 1) * ITEMS_PER_PAGE + idx) ? 'primary.main' : 'grey.200',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      mb: 2,
                      width: '100%',
                    }}
                    onClick={() => handleSelectService('package', (pagePackage - 1) * ITEMS_PER_PAGE + idx)}
                  >
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Box>
                        <Typography fontWeight={700}>{service.name}</Typography>
                        <Typography color="text.secondary" fontSize={14} mb={1}>{service.description}</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTimeIcon sx={{ fontSize: 18 }} />
                          <Typography fontSize={13}>{service.duration || '60 phút'}</Typography>
                          {service.label && <Chip label={service.label} size="small" sx={{ ml: 1 }} />}
                        </Box>
                      </Box>
                      <Typography fontWeight={700} fontSize={16}>{service.price ? service.price.toLocaleString('vi-VN') + ' đ' : ''}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              {/* Pagination for packages */}
              {totalPackagePages > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Button onClick={() => setPagePackage(page => Math.max(1, page - 1))} disabled={pagePackage === 1} sx={{ minWidth: 32 }}><NavigateBeforeIcon /></Button>
                  {[...Array(totalPackagePages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={pagePackage === i + 1 ? 'contained' : 'outlined'}
                      sx={{ minWidth: 40, mx: 0.5, fontWeight: 700, fontSize: 20, borderRadius: 2, background: pagePackage === i + 1 ? '#357ae8' : undefined, color: pagePackage === i + 1 ? '#fff' : '#222' }}
                      onClick={() => setPagePackage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button onClick={() => setPagePackage(page => Math.min(totalPackagePages, page + 1))} disabled={pagePackage === totalPackagePages} sx={{ minWidth: 32 }}><NavigateNextIcon /></Button>
                </Box>
              )}
            </>
          )}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(activeStep - 1)}
              sx={{ minWidth: 120 }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={selectedService === null}
              onClick={() => setActiveStep(1)}
              sx={{ minWidth: 180 }}
            >
              Tiếp tục
            </Button>
          </Box>
        </Box>
      )}
      {/* Bước 2: Chọn ngày giờ */}
      {activeStep === 1 && (
        <Box sx={{ background: '#fff', borderRadius: 2, p: 3, boxShadow: 1, maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            <span role="img" aria-label="calendar">🗓️</span> Chọn Ngày & Giờ
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Chọn ngày và giờ hẹn bạn muốn
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography fontWeight={600} mb={1}>Chọn ngày</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  disablePast
                  renderInput={({ inputRef, inputProps, InputProps }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <input ref={inputRef} {...inputProps} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
                      {InputProps?.endAdornment}
                    </Box>
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <Typography fontWeight={600} mb={1}>Các khung giờ có sẵn</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, minWidth: 180 }}>
                {timeSlots.map(slot => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTime(slot)}
                    sx={{
                      minWidth: 90,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: selectedTime === slot ? 'linear-gradient(45deg, #2196F3, #00BFA5)' : '#fff',
                      color: selectedTime === slot ? '#fff' : '#1976D2',
                      fontWeight: 600,
                      boxShadow: selectedTime === slot ? '0 2px 8px rgba(33,150,243,0.10)' : 'none',
                      borderColor: '#1976D2',
                      '&:hover': {
                        bgcolor: selectedTime === slot ? 'linear-gradient(45deg, #1976D2, #00897B)' : '#E3F2FD'
                      }
                    }}
                  >
                    {slot}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setActiveStep(0)}
              sx={{ minWidth: 120 }}
            >
              ← Quay lại Tư vấn
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setActiveStep(2)}
              sx={{ minWidth: 140 }}
            >
              Tiếp tục →
            </Button>
          </Box>
        </Box>
      )}
      {/* Bước 3: Ghi chú */}
      {activeStep === 2 && (
        <Box sx={{ background: '#fff', borderRadius: 2, p: 3, boxShadow: 1, maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h5" fontWeight={700} mb={2}>Ghi chú cho lịch hẹn</Typography>
          <TextField
            label="Ghi chú (tuỳ chọn)"
            multiline
            minRows={4}
            fullWidth
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho lịch hẹn nếu có..."
            sx={{ mb: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setActiveStep(1)}
              sx={{ minWidth: 120 }}
            >
              ← Quay lại Ngày & Giờ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActiveStep(3)}
              sx={{ minWidth: 140 }}
            >
              Tiếp tục →
            </Button>
          </Box>
        </Box>
      )}
      {/* Bước 4: Thanh toán */}
      {activeStep === 3 && !bookingSuccess && (
        <Box sx={{ background: '#fff', borderRadius: 2, p: 3, boxShadow: 1, maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h5" fontWeight={700} mb={2}>Chọn phương thức thanh toán</Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            sx={{ mb: 4 }}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Tiền mặt khi đến" />
            <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
            {/* Có thể thêm các phương thức khác nếu cần */}
          </RadioGroup>
          {paymentMethod === 'bank' && (
            <Box sx={{
              bgcolor: '#f4f8fc',
              border: '1px solid #b3e0ff',
              borderRadius: 2,
              p: 2,
              mb: 3,
              color: '#1976D2',
              fontWeight: 500
            }}>
              <Typography fontWeight={700} color="#1976D2" mb={1}>Thông tin chuyển khoản:</Typography>
              <Typography>Số tài khoản: <b>123456789</b></Typography>
              <Typography>Ngân hàng: <b>Vietcombank - CN Hà Nội</b></Typography>
              <Typography>Chủ tài khoản: <b>Nguyễn Văn A</b></Typography>
              <Typography fontSize={13} color="text.secondary" mt={1}>
                Vui lòng ghi rõ họ tên và số điện thoại khi chuyển khoản.
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setActiveStep(2)}
              sx={{ minWidth: 120 }}
            >
              ← Quay lại Ghi chú
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setBookingSuccess(true)}
              sx={{ minWidth: 180 }}
            >
              Thanh toán & Hoàn thành đặt lịch
            </Button>
          </Box>
        </Box>
      )}
      {/* Thông báo thành công */}
      {activeStep === 3 && bookingSuccess && (
        <Box sx={{ background: '#fff', borderRadius: 2, p: 3, boxShadow: 1, maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" fontWeight={700} mb={2}>Đặt lịch thành công!</Typography>
          <Typography mb={3}>Cảm ơn bạn đã đăng ký xét nghiệm. Chúng tôi sẽ liên hệ xác nhận lịch hẹn sớm nhất.</Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>Về trang chủ</Button>
        </Box>
      )}
      {/* Dialog chi tiết xét nghiệm */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {detailData?.name || 'Chi tiết xét nghiệm'}
        </DialogTitle>
        <DialogContent dividers>
          {detailData ? (
            <>
              <Typography fontWeight={600} mb={1}>Mô tả:</Typography>
              <Typography mb={2}>{detailData.description}</Typography>
              <Typography fontWeight={600} mb={1}>Giá:</Typography>
              <Typography mb={2} color="primary">{detailData.price?.toLocaleString('vi-VN')} đ</Typography>
              {detailData && Array.isArray(detailData.components) && detailData.components.length > 0 ? (
                <>
                  <Typography variant="h5" fontWeight={700} color="#357ae8" mb={2} mt={3}>Giá trị tham chiếu</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: '#f4f8fc' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Thành phần</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Giá trị bình thường</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Đơn vị</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailData.components.map((row, idx) => (
                          <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                            <TableCell>{row.componentName}</TableCell>
                            <TableCell>{row.normalRange}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : detailData && Array.isArray(detailData.referenceRange) && detailData.referenceRange.length > 0 ? (
                <>
                  <Typography variant="h5" fontWeight={700} color="#357ae8" mb={2} mt={3}>Giá trị tham chiếu</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: '#f4f8fc' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Thành phần</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Giá trị bình thường</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Đơn vị</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#357ae8', fontSize: '1.1rem' }}>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailData.referenceRange.map((row, idx) => (
                          <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.normalRange}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : detailData?.referenceRange ? (
                <>
                  <Typography fontWeight={600} mb={1}>Giá trị tham chiếu:</Typography>
                  <Typography mb={2}>{detailData.referenceRange}</Typography>
                </>
              ) : null}
              {/* Thêm các trường khác nếu cần */}
            </>
          ) : (
            <Typography color="error">Không thể tải chi tiết xét nghiệm.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)} variant="outlined">Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
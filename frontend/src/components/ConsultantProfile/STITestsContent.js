/**
 * STITestsContent.js - Simple and Clean UI for STI Tests Management
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Science as ScienceIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  LocalHospital as LocalHospitalIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  getConsultantSTITests,
  updateConsultantNotes,
  getSTIPackageById,
  getSTIServiceById,
  getTestResultsByTestId,
} from '../../services/stiService';

import ConsultantTestResultDetailModal from './ConsultantTestResultDetailModal';
import { formatDateDisplay } from '../../utils/dateUtils';
import { useUser } from '@/context/UserContext';

// Test Type translation function
const getTestTypeTranslation = (type) => {
  switch (type) {
    case 'hiv':
      return 'HIV';
    case 'syphilis':
      return 'Giang mai';
    case 'gonorrhea':
      return 'Lậu';
    case 'chlamydia':
      return 'Chlamydia';
    case 'hpv':
      return 'HPV';
    case 'herpes':
      return 'Herpes';
    case 'hepatitisB':
      return 'Viêm gan B';
    case 'hepatitisC':
      return 'Viêm gan C';
    case 'comprehensive':
      return 'Xét nghiệm tổng quát';
    default:
      return type;
  }
};

// Helper để lấy ký tự đầu tiên hoặc '?'
const getInitial = (name) =>
  (name && typeof name === 'string' && name.charAt(0)) || '?';

function compareYMD(a, b) {
  if (!a || !b) return 0;
  if (a.y !== b.y) return a.y - b.y;
  if (a.m !== b.m) return a.m - b.m;
  return a.d - b.d;
}

function getYMD(val) {
  if (!val) return null;
  if (Array.isArray(val)) {
    // [yyyy, mm, dd, ...]
    return { y: +val[0], m: +val[1], d: +val[2] };
  }
  // Nếu là string, parse như cũ
  const s = typeof val === 'string' ? val : String(val);
  const match = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return { y: +match[1], m: +match[2], d: +match[3] };
}

const STITestsContent = () => {
  // State
  const [tests, setTests] = useState([]);
  // Bỏ statusFilter và tabValue
  // const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [recommendationDialogOpen, setRecommendationDialogOpen] =
    useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalTest, setDetailModalTest] = useState(null);
  const [detailIsPackage, setDetailIsPackage] = useState(false);
  const [detailPackageServices, setDetailPackageServices] = useState([]);
  const [detailSelectedService, setDetailSelectedService] = useState(null);
  const [detailComponents, setDetailComponents] = useState([]);
  const [detailAllServiceComponents, setDetailAllServiceComponents] = useState(
    {}
  );
  const [conclusionFilter, setConclusionFilter] = useState('all'); // 'all' | 'has' | 'none'
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const { user } = useUser();

  // Lấy danh sách test từ API khi load component
  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await getConsultantSTITests();
      setTests(res.data || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTests();
  }, []);

  // Lọc chỉ theo searchQuery, mã xét nghiệm, trạng thái kết luận, và ngày
  const filteredTests = tests.filter((test) => {
    const search = searchQuery.toLowerCase();
    const matchesName = (test.patientName?.toLowerCase() || '').includes(
      search
    );
    const matchesTestId = test.testId?.toString().includes(search);
    const matchesSearch = matchesName || matchesTestId;
    let matchesConclusion = true;
    if (conclusionFilter === 'has') {
      matchesConclusion = !!(
        test.consultantNotes && test.consultantNotes.trim()
      );
    } else if (conclusionFilter === 'none') {
      matchesConclusion = !test.consultantNotes || !test.consultantNotes.trim();
    }
    let matchesDate = true;
    const filterYMD = getYMD(dateFilter);
    const testYMD = getYMD(test.appointmentDate);
    if (testYMD && filterYMD) {
      matchesDate = compareYMD(testYMD, filterYMD) >= 0;
    }
    return matchesSearch && matchesConclusion && matchesDate;
  });

  // Handlers
  // Bỏ handleTabChange và tabValue
  // const handleTabChange = (event, newValue) => { ... }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetailsDialog = async (test) => {
    setDetailModalTest(test);
    setDetailIsPackage(!!test.packageId);
    setDetailPackageServices([]);
    setDetailSelectedService(null);
    setDetailComponents([]);
    setDetailAllServiceComponents({});

    if (test.packageId) {
      // Nếu là package, lấy danh sách service con và thành phần từng service
      try {
        const res = await getSTIPackageById(test.packageId);
        if (res && res.data && Array.isArray(res.data.services)) {
          const services = res.data.services;
          setDetailPackageServices(services);
          // Lấy thành phần từng service
          const promises = services.map((svc) => getSTIServiceById(svc.id));
          const results = await Promise.all(promises);
          // Lấy kết quả thực tế
          const resultRes = await getTestResultsByTestId(test.testId);
          const testResults =
            (resultRes && (resultRes.data || resultRes)) || [];
          const allComponents = {};
          results.forEach((result, idx) => {
            const svcId = services[idx].id;
            let comps = [];
            if (
              result &&
              result.data &&
              Array.isArray(result.data.components)
            ) {
              comps = result.data.components;
            } else if (result && Array.isArray(result.components)) {
              comps = result.components;
            }
            // Map result vào component
            comps = comps.map((comp) => {
              const found = testResults.find(
                (r) =>
                  r.componentId === comp.componentId ||
                  r.componentId === comp.id
              );
              return found
                ? {
                    ...comp,
                    resultValue: found.resultValue,
                    conclusion: found.conclusion,
                    unit: found.unit,
                    normalRange: found.normalRange,
                    referenceRange: found.referenceRange,
                  }
                : comp;
            });
            allComponents[svcId] = comps;
          });
          setDetailAllServiceComponents(allComponents);
          // Mặc định chọn service đầu tiên
          const firstService = services[0];
          setDetailSelectedService(firstService);
          setDetailComponents(allComponents[firstService.id] || []);
        }
      } catch (err) {
        setDetailPackageServices([]);
        setDetailAllServiceComponents({});
        setDetailSelectedService(null);
        setDetailComponents([]);
      }
    } else {
      // Nếu là service đơn, lấy thành phần xét nghiệm và map result
      try {
        if (test.serviceId) {
          const res = await getSTIServiceById(test.serviceId);
          let comps = [];
          if (res && res.data && Array.isArray(res.data.components)) {
            comps = res.data.components;
          }
          // Lấy kết quả thực tế
          const resultRes = await getTestResultsByTestId(test.testId);
          const testResults =
            (resultRes && (resultRes.data || resultRes)) || [];
          comps = comps.map((comp) => {
            const found = testResults.find(
              (r) =>
                r.componentId === comp.componentId || r.componentId === comp.id
            );
            return found
              ? {
                  ...comp,
                  resultValue: found.resultValue,
                  conclusion: found.conclusion,
                  unit: found.unit,
                  normalRange: found.normalRange,
                  referenceRange: found.referenceRange,
                }
              : comp;
          });
          setDetailComponents(comps);
        } else {
          setDetailComponents([]);
        }
      } catch (err) {
        setDetailComponents([]);
      }
    }
    setDetailModalOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailModalOpen(false);
    setDetailModalTest(null);
    setDetailIsPackage(false);
    setDetailPackageServices([]);
    setDetailSelectedService(null);
    setDetailComponents([]);
    setDetailAllServiceComponents({});
  };

  const handleCloseRecommendationDialog = () => {
    setRecommendationDialogOpen(false);
  };

  const handleSubmitRecommendation = async () => {
    if (!selectedTest) return;
    setSubmitting(true);
    try {
      // Gọi API cập nhật consultant notes cho test đã có kết quả
      await updateConsultantNotes(selectedTest.id, recommendation);
      // Có thể cập nhật lại UI tại đây nếu cần (ví dụ: set lại notes cho test trong state)
      setSubmitting(false);
      setRecommendationDialogOpen(false);
      // Nếu muốn load lại danh sách test từ BE, gọi lại API ở đây
    } catch (error) {
      setSubmitting(false);
      // Xử lý lỗi nếu cần
      alert(
        'Cập nhật khuyến nghị thất bại: ' +
          (error?.message || 'Lỗi không xác định')
      );
    }
  };

  const handleSaveConsultantNote = async (note) => {
    if (!detailModalTest) return;
    await updateConsultantNotes(detailModalTest.testId, note);
    setTests((prev) =>
      prev.map((t) =>
        t.testId === detailModalTest.testId
          ? { ...t, consultantNotes: note }
          : t
      )
    );
    setDetailModalTest((prev) =>
      prev ? { ...prev, consultantNotes: note } : prev
    );
  };

  const handleSelectServiceInDetailModal = (svc) => {
    setDetailSelectedService(svc);
    if (svc && svc.id && detailAllServiceComponents[svc.id]) {
      setDetailComponents(detailAllServiceComponents[svc.id]);
    } else {
      setDetailComponents([]);
    }
  };

  const handleClearFilters = () => {
    // Bỏ setStatusFilter và setTabValue
    setSearchQuery('');
    setPage(0);
    setConclusionFilter('all'); // Reset conclusion filter
    setDateFilter('');
  };

  // Render status chip
  const renderStatusChip = (status) => {
    const props = {
      pending: { label: 'Chờ xét nghiệm', color: 'warning' },
      processing: { label: 'Đang xử lý', color: 'info' },
      completed: { label: 'Hoàn thành', color: 'success' },
      cancelled: { label: 'Đã hủy', color: 'error' },
    }[status] || { label: 'Không xác định', color: 'default' };

    return <Chip label={props.label} size="small" color={props.color} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Simple Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: 'white',
          borderRadius: '12px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalHospitalIcon sx={{ fontSize: 36, mr: 2 }} />
          <Box>
            {/* <Typography variant="h4" fontWeight="bold">
              Quản lý Xét nghiệm STI
            </Typography> */}
            <Typography variant="h4" fontWeight="bold" sx={{ opacity: 0.9 }}>
              Kết luận xét nghiệm bệnh lây truyền qua đường tình dục
            </Typography>
          </Box>
        </Box>

        {/* Simple Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {tests.length}
              </Typography>
              <Typography variant="body2">Tổng số</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {tests.filter((t) => t.status === 'pending').length}
              </Typography>
              <Typography variant="body2">Chờ xử lý</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {tests.filter((t) => t.status === 'processing').length}
              </Typography>
              <Typography variant="body2">Đang xử lý</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {tests.filter((t) => t.status === 'completed').length}
              </Typography>
              <Typography variant="body2">Hoàn thành</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Bỏ hoàn toàn Tabs trạng thái */}
      {/* <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          ...
        </Tabs>
      </Paper> */}

      {/* Simple Search */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          <TextField
            placeholder="Tìm kiếm theo tên bệnh nhân, mã xét nghiệm..."
            size="small"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, minWidth: 260, background: '#fff' },
            }}
            sx={{ minWidth: 260, background: '#fff', borderRadius: 3 }}
          />
          <TextField
            type="date"
            size="small"
            label="Từ ngày"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150, background: '#fff', borderRadius: 3 }}
          />
          <FormControl
            size="small"
            sx={{ minWidth: 140, borderRadius: 3, background: '#fff' }}
          >
            <InputLabel>Kết luận</InputLabel>
            <Select
              value={conclusionFilter}
              label="Kết luận"
              onChange={(e) => setConclusionFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="has">Có kết luận</MenuItem>
              <MenuItem value="none">Chưa có kết luận</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchTests}
            disabled={loading}
            startIcon={<RefreshIcon />}
            sx={{
              height: 40,
              borderRadius: 3,
              fontWeight: 600,
              minWidth: 110,
              background: '#f8fafc',
              boxShadow: '0 1px 4px #4A90E211',
              '&:hover': { background: '#e3f2fd' },
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Làm mới'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            sx={{
              height: 40,
              borderRadius: 3,
              fontWeight: 600,
              minWidth: 140,
              background: '#fff',
              boxShadow: '0 1px 4px #4A90E211',
              '&:hover': { background: '#fce4ec' },
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </Paper>

      {/* Simple Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell align="center">
                  <strong>Mã XN</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Tên xét nghiệm</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Bệnh nhân</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Ngày</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Kết luận</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Thao tác</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((test) => (
                  <TableRow
                    key={test.id || test.testId}
                    hover
                    sx={{ '&:hover': { background: '#f0f7fa' } }}
                  >
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, color: '#4A90E2' }}
                    >
                      #{test.testId}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: '#1976d2' }}
                    >
                      {test.serviceName}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {test.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {formatDateDisplay(test.appointmentDate)}
                    </TableCell>
                    <TableCell align="center">
                      {test.consultantNotes && test.consultantNotes.trim() ? (
                        <Chip label="Đã có" color="success" size="small" />
                      ) : (
                        <Chip label="Chưa có" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          borderRadius: 3,
                          background:
                            'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px #4A90E222',
                          '&:hover': {
                            background:
                              'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
                          },
                        }}
                        onClick={() => handleOpenDetailsDialog(test)}
                      >
                        Xem chi tiết
                      </Button>
                      {/* Ví dụ dùng confirmDialog cho thao tác xóa/confirm:
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ ml: 1, borderRadius: 3 }}
                        onClick={async () => {
                          const ok = await confirmDialog.danger('Bạn có chắc chắn muốn xóa xét nghiệm này?');
                          if (ok) {
                            // Gọi API xóa
                          }
                        }}
                      >
                        Xóa
                      </Button>
                      */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredTests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}`
          }
        />
      </Paper>

      {/* Simple Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScienceIcon color="primary" sx={{ mr: 1 }} />
            Chi tiết xét nghiệm STI
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thông tin bệnh nhân
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          mr: 2,
                          bgcolor: '#4A90E2',
                        }}
                      >
                        {getInitial(selectedTest.patientName)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {selectedTest.patientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {selectedTest.patientEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Điện thoại: {selectedTest.patientPhone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thông tin xét nghiệm
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Loại xét nghiệm:</strong>{' '}
                      {getTestTypeTranslation(selectedTest.testType)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Ngày xét nghiệm:</strong>{' '}
                      {formatDate(selectedTest.testDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Trạng thái:</strong>{' '}
                      {renderStatusChip(selectedTest.status)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {selectedTest.symptoms && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Triệu chứng
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedTest.symptoms.map((symptom, index) => (
                          <Chip
                            key={index}
                            label={symptom}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {selectedTest.results && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Kết quả xét nghiệm
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Loại xét nghiệm</TableCell>
                              <TableCell>Kết quả</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(selectedTest.results).map(
                              ([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell>
                                    {getTestTypeTranslation(key)}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={value}
                                      size="small"
                                      color={
                                        value.includes('Dương tính')
                                          ? 'error'
                                          : 'success'
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {selectedTest.recommendations && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Khuyến nghị điều trị
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: 'background.default' }}
                      >
                        <Typography variant="body2">
                          {selectedTest.recommendations}
                        </Typography>
                      </Paper>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Đóng</Button>
          {selectedTest && selectedTest.status === 'completed' && (
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Tải báo cáo
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Simple Recommendation Dialog */}
      <Dialog
        open={recommendationDialogOpen}
        onClose={handleCloseRecommendationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Khuyến nghị điều trị</DialogTitle>
        <DialogContent dividers>
          {selectedTest && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Bệnh nhân: <strong>{selectedTest.patientName}</strong>
              </Typography>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Xét nghiệm:{' '}
                <strong>{getTestTypeTranslation(selectedTest.testType)}</strong>
              </Typography>
              <TextField
                label="Khuyến nghị điều trị"
                multiline
                rows={4}
                fullWidth
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Nhập khuyến nghị điều trị cho bệnh nhân..."
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseRecommendationDialog}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={
              submitting ? <CircularProgress size={20} /> : <SendIcon />
            }
            onClick={handleSubmitRecommendation}
            disabled={submitting || !recommendation.trim()}
          >
            {submitting ? 'Đang lưu...' : 'Lưu khuyến nghị'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thêm modal chi tiết kết quả cho consultant */}
      <ConsultantTestResultDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailsDialog}
        test={detailModalTest}
        onSaveNote={handleSaveConsultantNote}
        isPackage={detailIsPackage}
        packageServices={detailPackageServices}
        selectedService={detailSelectedService}
        onSelectService={handleSelectServiceInDetailModal}
        components={detailComponents}
        consultantId={user?.id}
      />
    </Box>
  );
};

export default STITestsContent;

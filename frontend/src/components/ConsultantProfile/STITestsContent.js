/**
 * STITestsContent.js - Simple and Clean UI for STI Tests Management
 */

import React, { useState } from 'react';
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
  Alert,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Science as ScienceIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  LocalHospital as LocalHospitalIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarTodayIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

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

const STITestsContent = () => {
  // Mock data - simplified
  const [tests] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn Minh',
      patientEmail: 'nguyenvanminh@gmail.com',
      patientPhone: '0912345678',
      patientAge: 28,
      patientGender: 'Nam',
      patientAvatar: '/images/avatars/avatar1.jpg',
      testType: 'comprehensive',
      testDate: '2025-06-20T09:30:00',
      status: 'completed',
      symptoms: ['Đau khi đi tiểu', 'Tiết dịch bất thường'],
      results: {
        hiv: 'Âm tính',
        chlamydia: 'Dương tính',
      },
      recommendations:
        'Điều trị Chlamydia bằng Azithromycin 1g. Tái khám sau 2 tuần.',
      notes: 'Bệnh nhân có tiền sử quan hệ không an toàn.',
    },
    {
      id: 2,
      patientName: 'Trần Thị Lan Anh',
      patientEmail: 'tranthilananh@gmail.com',
      patientPhone: '0987654321',
      patientAge: 25,
      patientGender: 'Nữ',
      testType: 'hiv',
      testDate: '2025-06-21T14:00:00',
      status: 'completed',
      symptoms: ['Lo lắng về phơi nhiễm'],
      results: { hiv: 'Âm tính' },
      recommendations: 'Kết quả HIV âm tính. Tái xét nghiệm sau 3 tháng.',
    },
    {
      id: 3,
      patientName: 'Lê Hoàng Nam',
      patientEmail: 'lehoangnam@gmail.com',
      testType: 'gonorrhea',
      testDate: '2025-06-22T10:15:00',
      status: 'processing',
      symptoms: ['Tiết dịch màu vàng', 'Đau rát khi đi tiểu'],
    },
    {
      id: 4,
      patientName: 'Phạm Thị Hương',
      patientEmail: 'phamthihuong@gmail.com',
      testType: 'hpv',
      testDate: '2025-06-22T11:30:00',
      status: 'pending',
      symptoms: ['Khám sức khỏe định kỳ'],
    },
  ]);

  // State
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [recommendationDialogOpen, setRecommendationDialogOpen] =
    useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter tests
  const filteredTests = tests.filter((test) => {
    if (statusFilter !== 'all' && test.status !== statusFilter) return false;
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) setStatusFilter('all');
    else if (newValue === 1) setStatusFilter('pending');
    else if (newValue === 2) setStatusFilter('processing');
    else if (newValue === 3) setStatusFilter('completed');
    setPage(0);
  };

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

  const handleOpenDetailsDialog = (test) => {
    setSelectedTest(test);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handleOpenRecommendationDialog = (test) => {
    setSelectedTest(test);
    setRecommendation(test.recommendations || '');
    setRecommendationDialogOpen(true);
  };

  const handleCloseRecommendationDialog = () => {
    setRecommendationDialogOpen(false);
  };

  const handleSubmitRecommendation = async () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setRecommendationDialogOpen(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setTabValue(0);
    setPage(0);
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
            <Typography variant="h4" fontWeight="bold">
              Quản lý Xét nghiệm STI
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Hệ thống quản lý xét nghiệm bệnh lây truyền qua đường tình dục
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

      {/* Simple Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={`Tất cả (${tests.length})`}
            icon={<ScienceIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Chờ (${tests.filter((t) => t.status === 'pending').length})`}
            icon={<CalendarTodayIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Đang xử lý (${tests.filter((t) => t.status === 'processing').length})`}
            icon={<SettingsIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Hoàn thành (${tests.filter((t) => t.status === 'completed').length})`}
            icon={<CheckCircleOutlineIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Simple Search */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Tìm kiếm theo tên bệnh nhân, email..."
              fullWidth
              size="small"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xét nghiệm</MenuItem>
                <MenuItem value="processing">Đang xử lý</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              fullWidth
            >
              Xóa bộ lọc
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Simple Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>
                  <strong>Bệnh nhân</strong>
                </TableCell>
                <TableCell>
                  <strong>Xét nghiệm</strong>
                </TableCell>
                <TableCell>
                  <strong>Ngày</strong>
                </TableCell>
                <TableCell>
                  <strong>Trạng thái</strong>
                </TableCell>
                <TableCell>
                  <strong>Kết quả</strong>
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
                  <TableRow key={test.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: '#4A90E2',
                          }}
                        >
                          {test.patientName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {test.patientName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {test.patientEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTestTypeTranslation(test.testType)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(test.testDate)}</TableCell>
                    <TableCell>{renderStatusChip(test.status)}</TableCell>
                    <TableCell>
                      {test.status === 'completed' ? (
                        test.results &&
                        Object.values(test.results).some((result) =>
                          result.includes('Dương tính')
                        ) ? (
                          <Chip
                            label="Có dương tính"
                            color="error"
                            size="small"
                          />
                        ) : (
                          <Chip label="Âm tính" color="success" size="small" />
                        )
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Chưa có kết quả
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenDetailsDialog(test)}
                        >
                          Chi tiết
                        </Button>
                        {test.status === 'completed' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenRecommendationDialog(test)}
                          >
                            Khuyến nghị
                          </Button>
                        )}
                      </Box>
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
                        {selectedTest.patientName.charAt(0)}
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
    </Box>
  );
};

export default STITestsContent;

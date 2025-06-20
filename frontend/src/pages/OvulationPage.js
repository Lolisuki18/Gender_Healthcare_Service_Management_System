/**
 * OvulationPage.js - Trang quản lý chu kỳ kinh nguyệt và tính ovulation
 *
 * Trang này cho phép người dùng:
 * - Nhập thông tin chu kỳ kinh nguyệt mới
 * - Xem lịch sử các chu kỳ đã nhập
 * - Xem thông tin về ngày rụng trứng và xác suất mang thai
 * - Cập nhật hoặc xóa thông tin chu kỳ
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { format, parseISO, isValid, addDays, differenceInDays } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CycloneIcon from '@mui/icons-material/Cyclone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FavoriteIcon from '@mui/icons-material/Favorite';
import apiClient from '../services/api';

const OvulationPage = () => {
  const theme = useTheme();

  // Custom styles
  const styles = {
    gradientButton: {
      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
      color: '#fff',
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.35)',
      },
    },
    pageHeader: {
      backgroundImage: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
      borderRadius: '16px',
      padding: '30px 20px',
      marginBottom: '30px',
      boxShadow: '0 4px 20px rgba(74, 144, 226, 0.15)',
      position: 'relative',
      overflow: 'hidden',
    },
    gradientText: {
      background: '-webkit-linear-gradient(45deg, #4A90E2, #1ABC9C)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    card: {
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      border: '1px solid rgba(74, 144, 226, 0.1)',
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 6px 25px rgba(74, 144, 226, 0.15)',
        transform: 'translateY(-3px)',
      },
    },
    detailsCard: {
      borderRadius: '12px',
      padding: '20px',
      background: alpha(theme.palette.primary.light, 0.05),
      marginTop: '16px',
      marginBottom: '16px',
    },
    indicatorCircle: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '8px',
    },
    fertileDays: {
      backgroundColor: '#F06292',
    },
    safeDays: {
      backgroundColor: '#4CAF50',
    },
    periodDays: {
      backgroundColor: '#F44336',
    },
    iconWithText: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      '& .MuiSvgIcon-root': {
        marginRight: '8px',
        color: theme.palette.primary.main,
      },
    },
  };

  // Import images
  const bannerImage = require('../assets/images/ovulation_banner.svg').default;
  const cycleIcon = require('../assets/images/cycle_icon.svg').default;
  const cycleTracking = require('../assets/images/cycle_tracking.svg').default;

  // State cho form nhập liệu
  const [formData, setFormData] = useState({
    startDate: null,
    numberOfDays: '',
    cycleLength: '',
    reminderEnabled: false,
  });

  // State cho danh sách chu kỳ
  const [menstrualCycles, setMenstrualCycles] = useState([]);
  const [cyclesWithProb, setCyclesWithProb] = useState([]);

  // State cho editing
  const [editingCycle, setEditingCycle] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State cho chi tiết
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // State cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchMenstrualCycles();
    fetchMenstrualCyclesWithProb();
  }, []);

  // Function để lấy danh sách chu kỳ kinh nguyệt
  const fetchMenstrualCycles = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/menstrual-cycle');
      if (response.data.success) {
        setMenstrualCycles(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi lấy dữ liệu chu kỳ kinh nguyệt');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function để lấy danh sách chu kỳ kinh nguyệt cùng tỉ lệ mang thai
  const fetchMenstrualCyclesWithProb = async () => {
    try {
      const response = await apiClient.get('/menstrual-cycle/pregnancy-prob');
      if (response.data.success) {
        setCyclesWithProb(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pregnancy probability data:', error);
    }
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi ngày
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date,
    });
  };

  // Xử lý thay đổi switch reminder
  const handleReminderChange = (event) => {
    setFormData({
      ...formData,
      reminderEnabled: event.target.checked,
    });
  };

  // Submit form tạo mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.startDate ||
      !formData.numberOfDays ||
      !formData.cycleLength
    ) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate input
    if (
      parseInt(formData.numberOfDays) < 1 ||
      parseInt(formData.numberOfDays) > 30
    ) {
      setError('Số ngày hành kinh phải từ 1-30 ngày');
      return;
    }

    if (parseInt(formData.cycleLength) < 1) {
      setError('Chu kỳ kinh nguyệt phải lớn hơn 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        startDate: formData.startDate.toISOString().split('T')[0], // Format YYYY-MM-DD
        numberOfDays: parseInt(formData.numberOfDays),
        cycleLength: parseInt(formData.cycleLength),
        reminderEnabled: formData.reminderEnabled,
      };

      const response = await apiClient.post('/menstrual-cycle', dataToSubmit);

      if (response.data.success) {
        setSuccess('Đã thêm chu kỳ kinh nguyệt mới thành công!');
        setFormData({
          startDate: null,
          numberOfDays: '',
          cycleLength: '',
          reminderEnabled: false,
        });

        // Refresh data
        fetchMenstrualCycles();
        fetchMenstrualCyclesWithProb();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Mở dialog chỉnh sửa
  const handleEdit = (cycle) => {
    const cycleData = {
      id: cycle.id,
      startDate: parseISO(cycle.startDate),
      numberOfDays: cycle.numberOfDays.toString(),
      cycleLength: cycle.cycleLength.toString(),
      reminderEnabled: cycle.reminderEnabled,
    };
    setEditingCycle(cycleData);
    setIsEditDialogOpen(true);
  };

  // Xử lý thay đổi input trong dialog edit
  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingCycle({
      ...editingCycle,
      [name]: value,
    });
  };

  // Xử lý thay đổi ngày trong dialog edit
  const handleEditDateChange = (date) => {
    setEditingCycle({
      ...editingCycle,
      startDate: date,
    });
  };

  // Xử lý thay đổi reminder trong dialog edit
  const handleEditReminderChange = (event) => {
    setEditingCycle({
      ...editingCycle,
      reminderEnabled: event.target.checked,
    });
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
    if (
      !editingCycle.startDate ||
      !editingCycle.numberOfDays ||
      !editingCycle.cycleLength
    ) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        startDate: editingCycle.startDate.toISOString().split('T')[0],
        numberOfDays: parseInt(editingCycle.numberOfDays),
        cycleLength: parseInt(editingCycle.cycleLength),
        reminderEnabled: editingCycle.reminderEnabled,
      };

      const response = await apiClient.put(
        `/menstrual-cycle/${editingCycle.id}`,
        dataToSubmit
      );

      if (response.data.success) {
        setSuccess('Cập nhật chu kỳ kinh nguyệt thành công!');
        setIsEditDialogOpen(false);

        // Refresh data
        fetchMenstrualCycles();
        fetchMenstrualCyclesWithProb();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật dữ liệu. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa chu kỳ
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa chu kỳ này không?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/menstrual-cycle/${id}`);

      if (response.data.success) {
        setSuccess('Đã xóa chu kỳ kinh nguyệt!');

        // Refresh data
        fetchMenstrualCycles();
        fetchMenstrualCyclesWithProb();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Hiển thị chi tiết chu kỳ
  const handleViewDetail = async (id) => {
    try {
      const response = await apiClient.get(`/menstrual-cycle/${id}`);
      if (response.data.success) {
        setSelectedCycle(response.data.data);
        setIsDetailDialogOpen(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi lấy chi tiết chu kỳ kinh nguyệt');
      console.error(error);
    }
  };

  // Format date để hiển thị
  const formatDate = (dateInput) => {
    if (!dateInput) return '';

    // Nếu dateInput đã là một đối tượng Date hợp lệ, sử dụng nó trực tiếp
    if (dateInput instanceof Date && !isNaN(dateInput)) {
      return format(dateInput, 'dd/MM/yyyy');
    }

    try {
      // Đảm bảo dateInput là chuỗi trước khi gọi parseISO
      const dateString = dateInput.toString();
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
    } catch (error) {
      console.error('Error formatting date:', error, dateInput);
      return '';
    }
  };

  // Tính toán ngày dự kiến có kinh tiếp theo
  const calculateNextPeriod = (startDate, cycleLength) => {
    if (!startDate || !cycleLength) return '';
    const date = parseISO(startDate);
    return isValid(date)
      ? format(addDays(date, parseInt(cycleLength)), 'dd/MM/yyyy')
      : '';
  };

  // Tính toán giai đoạn an toàn sau khi hành kinh
  const calculateSafePeriodAfter = (startDate, numberOfDays) => {
    if (!startDate || !numberOfDays) return '';
    const date = parseISO(startDate);
    return isValid(date)
      ? format(addDays(date, parseInt(numberOfDays) + 1), 'dd/MM/yyyy')
      : '';
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={styles.pageHeader}>
          <img
            src={bannerImage}
            alt="Ovulation Tracker"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              objectFit: 'cover',
              opacity: 0.6,
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ color: '#fff', fontWeight: 700, mb: 1 }}
                >
                  Theo dõi chu kỳ kinh nguyệt
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#fff', mb: 1, opacity: 0.85 }}
                >
                  Quản lý chu kỳ kinh nguyệt, dự đoán ngày rụng trứng và giai
                  đoạn an toàn
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                }}
              >
                <img
                  src={cycleTracking}
                  alt="Cycle tracking"
                  style={{ height: 120 }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(244, 67, 54, 0.1)',
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(76, 175, 80, 0.1)',
            }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}{' '}
        <Grid container spacing={3}>
          {/* Form nhập liệu */}
          <Grid item xs={12} md={5}>
            <Paper sx={styles.card}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: alpha('#4A90E2', 0.05),
                  borderBottom: '1px solid rgba(74, 144, 226, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  }}
                >
                  <CalendarTodayIcon />
                </Avatar>
                <Typography variant="h6" sx={styles.gradientText}>
                  Thêm chu kỳ kinh nguyệt mới
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ p: 3, pt: 2 }}
              >
                <Box sx={styles.iconWithText}>
                  <CalendarTodayIcon />
                  <Typography variant="subtitle2">
                    Ngày bắt đầu chu kỳ
                  </Typography>
                </Box>
                <DatePicker
                  label="Chọn ngày bắt đầu chu kỳ"
                  value={formData.startDate}
                  onChange={handleDateChange}
                  disableFuture
                  sx={{ width: '100%', mb: 3 }}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      required: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha('#4A90E2', 0.8),
                          },
                        },
                      },
                    },
                  }}
                />

                <Box sx={styles.iconWithText}>
                  <WaterDropIcon />
                  <Typography variant="subtitle2">Số ngày hành kinh</Typography>
                </Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="numberOfDays"
                  placeholder="Nhập số ngày"
                  name="numberOfDays"
                  type="number"
                  value={formData.numberOfDays}
                  onChange={handleInputChange}
                  inputProps={{ min: 1, max: 30 }}
                  sx={{
                    mb: 3,
                    mt: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#4A90E2', 0.8),
                      },
                    },
                  }}
                  helperText="Số ngày từ 1-30"
                />

                <Box sx={styles.iconWithText}>
                  <CycloneIcon />
                  <Typography variant="subtitle2">
                    Độ dài chu kỳ (ngày)
                  </Typography>
                </Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="cycleLength"
                  placeholder="Nhập độ dài chu kỳ"
                  name="cycleLength"
                  type="number"
                  value={formData.cycleLength}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                  sx={{
                    mb: 3,
                    mt: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#4A90E2', 0.8),
                      },
                    },
                  }}
                  helperText="Thông thường từ 21-35 ngày"
                />

                <Box sx={styles.iconWithText}>
                  <NotificationsActiveIcon />
                  <Typography variant="subtitle2">Cài đặt thông báo</Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.reminderEnabled}
                      onChange={handleReminderChange}
                      name="reminderEnabled"
                      color="primary"
                    />
                  }
                  label="Bật nhắc nhở"
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={styles.gradientButton}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Lưu thông tin'}
                </Button>

                <Box
                  sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    opacity: 0.7,
                  }}
                >
                  <img
                    src={cycleIcon}
                    alt="Cycle Icon"
                    style={{ height: '60px' }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>{' '}
          {/* Thông tin hiển thị */}
          <Grid item xs={12} md={7}>
            <Paper sx={styles.card}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: alpha('#4A90E2', 0.05),
                  borderBottom: '1px solid rgba(74, 144, 226, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  }}
                >
                  <CycloneIcon />
                </Avatar>
                <Typography variant="h6" sx={styles.gradientText}>
                  Thống kê chu kỳ kinh nguyệt
                </Typography>
              </Box>

              <Box sx={{ p: 2 }}>
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: '200px' }}
                  >
                    <CircularProgress sx={{ color: '#4A90E2' }} />
                  </Box>
                ) : menstrualCycles.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '200px',
                      backgroundColor: alpha('#4A90E2', 0.02),
                      borderRadius: '12px',
                      p: 3,
                      border: '1px dashed rgba(74, 144, 226, 0.3)',
                    }}
                  >
                    <img
                      src={cycleIcon}
                      alt="Cycle Icon"
                      style={{
                        height: '80px',
                        opacity: 0.5,
                        marginBottom: '16px',
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: alpha('#000', 0.6), textAlign: 'center' }}
                    >
                      Bạn chưa có dữ liệu chu kỳ kinh nguyệt nào.
                      <br />
                      <b>Hãy thêm một chu kỳ mới!</b>
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer
                    sx={{
                      borderRadius: '8px',
                      boxShadow: 'none',
                      border: '1px solid rgba(74, 144, 226, 0.12)',
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{ backgroundColor: alpha('#4A90E2', 0.05) }}
                        >
                          <TableCell sx={{ fontWeight: 600, color: '#4A90E2' }}>
                            Ngày bắt đầu
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 600, color: '#4A90E2' }}
                          >
                            Số ngày
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 600, color: '#4A90E2' }}
                          >
                            Chu kỳ
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 600, color: '#4A90E2' }}
                          >
                            Ngày rụng trứng
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 600, color: '#4A90E2' }}
                          >
                            Thao tác
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menstrualCycles.map((cycle) => (
                          <TableRow
                            key={cycle.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha('#4A90E2', 0.03),
                              },
                              transition: 'background-color 0.2s',
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>
                              {formatDate(cycle.startDate)}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={cycle.numberOfDays}
                                size="small"
                                sx={{
                                  backgroundColor: alpha('#F44336', 0.1),
                                  color: '#F44336',
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={cycle.cycleLength + ' ngày'}
                                size="small"
                                sx={{
                                  backgroundColor: alpha('#4A90E2', 0.1),
                                  color: '#4A90E2',
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={formatDate(cycle.ovulationDate)}
                                size="small"
                                sx={{
                                  backgroundColor: alpha('#F06292', 0.1),
                                  color: '#F06292',
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Chi tiết">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetail(cycle.id)}
                                  sx={{
                                    color: '#4A90E2',
                                    '&:hover': {
                                      backgroundColor: alpha('#4A90E2', 0.1),
                                    },
                                  }}
                                >
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Chỉnh sửa">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(cycle)}
                                  sx={{
                                    color: '#1ABC9C',
                                    '&:hover': {
                                      backgroundColor: alpha('#1ABC9C', 0.1),
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(cycle.id)}
                                  sx={{
                                    color: '#F44336',
                                    '&:hover': {
                                      backgroundColor: alpha('#F44336', 0.1),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Paper>
          </Grid>{' '}
          {/* Thông tin tỉ lệ mang thai */}
          {cyclesWithProb.length > 0 && (
            <Grid item xs={12}>
              <Card
                sx={{
                  ...styles.card,
                  background:
                    'linear-gradient(135deg, rgba(74, 144, 226, 0.02) 0%, rgba(26, 188, 156, 0.05) 100%)',
                  p: 0,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha('#4A90E2', 0.05),
                    borderBottom: '1px solid rgba(74, 144, 226, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                      color: '#fff',
                      boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                    }}
                  >
                    <FavoriteIcon />
                  </Avatar>
                  <Typography variant="h6" sx={styles.gradientText}>
                    Dự đoán chu kỳ và tỉ lệ mang thai
                  </Typography>
                </Box>

                <CardContent>
                  <Grid container spacing={3}>
                    {cyclesWithProb.slice(0, 1).map((cycle) => (
                      <React.Fragment key={cycle.id}>
                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                              textAlign: 'center',
                              height: '100%',
                            }}
                          >
                            <img
                              src={cycleIcon}
                              alt="Cycle Icon"
                              style={{ height: '60px', marginBottom: '8px' }}
                            />
                            <Typography
                              variant="h6"
                              sx={{ color: '#4A90E2', fontWeight: 600 }}
                            >
                              Chu kỳ gần nhất
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontSize: '1.1rem', fontWeight: 500 }}
                            >
                              {formatDate(cycle.startDate)}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: alpha('#000', 0.7) }}
                              >
                                Chu kỳ tiếp theo:
                              </Typography>
                              <Chip
                                label={calculateNextPeriod(
                                  cycle.startDate,
                                  cycle.cycleLength
                                )}
                                size="small"
                                sx={{
                                  backgroundColor: alpha('#4A90E2', 0.1),
                                  color: '#4A90E2',
                                  fontWeight: 500,
                                }}
                              />
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                              textAlign: 'center',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ color: '#F06292', fontWeight: 600, mb: 1 }}
                            >
                              Ngày rụng trứng
                            </Typography>
                            <Box
                              sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {' '}
                              <Avatar
                                sx={{
                                  width: 80,
                                  height: 80,
                                  bgcolor: alpha('#F06292', 0.1),
                                  color: '#F06292',
                                  fontSize: '1rem',
                                  fontWeight: 700,
                                  mb: 2,
                                }}
                              >
                                {(() => {
                                  const formattedDate = formatDate(
                                    cycle.ovulationDate
                                  );
                                  return formattedDate
                                    ? formattedDate.split('/')[0]
                                    : '';
                                })()}
                              </Avatar>
                              <Typography sx={{ fontWeight: 500 }}>
                                {formatDate(cycle.ovulationDate)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: alpha('#000', 0.5), mt: 0.5 }}
                              >
                                Khả năng mang thai cao nhất
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                              height: '100%',
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#1ABC9C',
                                fontWeight: 600,
                                mb: 1.5,
                                textAlign: 'center',
                              }}
                            >
                              Các giai đoạn
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  ...styles.indicatorCircle,
                                  ...styles.safeDays,
                                }}
                              />
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 500 }}
                              >
                                Giai đoạn an toàn
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ ml: 2.5, mb: 1.5 }}
                            >
                              Từ{' '}
                              <Chip
                                label={calculateSafePeriodAfter(
                                  cycle.startDate,
                                  cycle.numberOfDays
                                )}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />{' '}
                              đến{' '}
                              <Chip
                                label={formatDate(
                                  addDays(parseISO(cycle.ovulationDate), -5)
                                )}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  ...styles.indicatorCircle,
                                  ...styles.fertileDays,
                                }}
                              />
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 500 }}
                              >
                                Giai đoạn dễ mang thai
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ ml: 2.5 }}>
                              Từ{' '}
                              <Chip
                                label={formatDate(
                                  addDays(parseISO(cycle.ovulationDate), -5)
                                )}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />{' '}
                              đến{' '}
                              <Chip
                                label={formatDate(
                                  addDays(parseISO(cycle.ovulationDate), 1)
                                )}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Typography>
                          </Box>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>{' '}
        {/* Dialog chỉnh sửa */}
        <Dialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 2,
            sx: {
              borderRadius: '12px',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              background:
                'linear-gradient(45deg, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)',
              borderBottom: '1px solid rgba(74, 144, 226, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <EditIcon sx={{ color: '#4A90E2' }} />
            <Typography sx={styles.gradientText}>
              Chỉnh sửa chu kỳ kinh nguyệt
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Box sx={styles.iconWithText}>
                <CalendarTodayIcon />
                <Typography variant="subtitle2">Ngày bắt đầu chu kỳ</Typography>
              </Box>
              <DatePicker
                label="Chọn ngày bắt đầu"
                value={editingCycle ? editingCycle.startDate : null}
                onChange={handleEditDateChange}
                disableFuture
                sx={{ width: '100%', mb: 2 }}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    },
                  },
                }}
              />

              <Box sx={styles.iconWithText}>
                <WaterDropIcon />
                <Typography variant="subtitle2">Số ngày hành kinh</Typography>
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="editNumberOfDays"
                label="Số ngày hành kinh"
                name="numberOfDays"
                type="number"
                value={editingCycle ? editingCycle.numberOfDays : ''}
                onChange={handleEditInputChange}
                inputProps={{ min: 1, max: 30 }}
                sx={{
                  mb: 2,
                  mt: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
                helperText="Số ngày từ 1-30"
              />

              <Box sx={styles.iconWithText}>
                <CycloneIcon />
                <Typography variant="subtitle2">
                  Độ dài chu kỳ (ngày)
                </Typography>
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="editCycleLength"
                label="Độ dài chu kỳ"
                name="cycleLength"
                type="number"
                value={editingCycle ? editingCycle.cycleLength : ''}
                onChange={handleEditInputChange}
                inputProps={{ min: 1 }}
                sx={{
                  mb: 2,
                  mt: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
                helperText="Thông thường từ 21-35 ngày"
              />

              <Box sx={styles.iconWithText}>
                <NotificationsActiveIcon />
                <Typography variant="subtitle2">Cài đặt thông báo</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      editingCycle ? editingCycle.reminderEnabled : false
                    }
                    onChange={handleEditReminderChange}
                    name="reminderEnabled"
                    color="primary"
                  />
                }
                label="Bật nhắc nhở"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                borderColor: alpha('#4A90E2', 0.5),
                color: '#4A90E2',
                '&:hover': { borderColor: '#4A90E2' },
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={loading}
              variant="contained"
              sx={styles.gradientButton}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog chi tiết */}
        <Dialog
          open={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            elevation: 2,
            sx: {
              borderRadius: '12px',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              background:
                'linear-gradient(45deg, rgba(74, 144, 226, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)',
              borderBottom: '1px solid rgba(74, 144, 226, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <InfoIcon sx={{ color: '#4A90E2' }} />
            <Typography sx={styles.gradientText}>
              Chi tiết chu kỳ kinh nguyệt
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedCycle && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        height: '100%',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <img
                            src={cycleIcon}
                            alt="Cycle Icon"
                            style={{ height: '60px' }}
                          />
                          <Typography variant="h6" sx={styles.gradientText}>
                            Thông tin chu kỳ
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Ngày bắt đầu:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {formatDate(selectedCycle.startDate)}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Số ngày hành kinh:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {selectedCycle.numberOfDays} ngày
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Độ dài chu kỳ:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {selectedCycle.cycleLength} ngày
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Ngày rụng trứng:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {formatDate(selectedCycle.ovulationDate)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Chu kỳ tiếp theo dự kiến:
                            </Typography>
                            <Chip
                              label={calculateNextPeriod(
                                selectedCycle.startDate,
                                selectedCycle.cycleLength
                              )}
                              sx={{
                                backgroundColor: alpha('#4A90E2', 0.1),
                                color: '#4A90E2',
                                fontWeight: 500,
                                mt: 0.5,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {selectedCycle.pregnancyProbLogs &&
                    selectedCycle.pregnancyProbLogs.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card
                          sx={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              sx={{
                                ...styles.gradientText,
                                mb: 2,
                                textAlign: 'center',
                              }}
                            >
                              Tỉ lệ mang thai theo ngày
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <TableContainer
                              sx={{
                                borderRadius: '8px',
                                border: '1px solid rgba(74, 144, 226, 0.12)',
                              }}
                            >
                              <Table size="small">
                                <TableHead>
                                  <TableRow
                                    sx={{
                                      backgroundColor: alpha('#4A90E2', 0.05),
                                    }}
                                  >
                                    <TableCell
                                      sx={{ fontWeight: 600, color: '#4A90E2' }}
                                    >
                                      Ngày
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{ fontWeight: 600, color: '#4A90E2' }}
                                    >
                                      Tỉ lệ mang thai
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: 600, color: '#4A90E2' }}
                                    >
                                      Ghi chú
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {selectedCycle.pregnancyProbLogs.map(
                                    (log) => (
                                      <TableRow
                                        key={log.id}
                                        sx={{
                                          '&:hover': {
                                            backgroundColor: alpha(
                                              '#4A90E2',
                                              0.03
                                            ),
                                          },
                                          transition: 'background-color 0.2s',
                                        }}
                                      >
                                        <TableCell>
                                          {formatDate(log.date)}
                                        </TableCell>
                                        <TableCell align="right">
                                          <Chip
                                            label={`${log.probability}%`}
                                            size="small"
                                            sx={{
                                              backgroundColor:
                                                log.probability > 50
                                                  ? alpha('#F06292', 0.1)
                                                  : log.probability > 20
                                                    ? alpha('#FFA726', 0.1)
                                                    : alpha('#4CAF50', 0.1),
                                              color:
                                                log.probability > 50
                                                  ? '#F06292'
                                                  : log.probability > 20
                                                    ? '#FFA726'
                                                    : '#4CAF50',
                                              fontWeight: 500,
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>{log.description}</TableCell>
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
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setIsDetailDialogOpen(false)}
              variant="contained"
              sx={styles.gradientButton}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default OvulationPage;

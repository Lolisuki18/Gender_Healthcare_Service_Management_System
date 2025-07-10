/**
 * AppointmentManagementContent.js - Admin Appointment Management
 *
 * Trang quản lý lịch hẹn cho Admin
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { adminService } from '@/services/adminService';
import { formatDateDisplay } from '@/utils/dateUtils';
import { formatDateTimeFromArray } from '@/utils/dateUtils';

function formatTimeFromArray(arr) {
  if (!Array.isArray(arr) || arr.length < 5) return '';
  const hour = arr[3]?.toString().padStart(2, '0');
  const min = arr[4]?.toString().padStart(2, '0');
  return hour && min ? `${hour}:${min}` : '';
}

const AppointmentManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getAllConsultations();
        // Map dữ liệu trả về sang format bảng cũ
        const mapped = (res.data || []).map((item) => ({
          id: item.consultationId,
          patientName: item.customerName,
          patientAvatar: null, // Nếu backend trả về avatar thì lấy ở đây
          service: item.reason || '-', // hoặc item.serviceName nếu có
          consultant: item.consultantName,
          consultantQualifications: item.consultantQualifications,
          consultantExperience: item.consultantExperience,
          date: formatDateDisplay(item.startTime),
          startTime: item.startTime,
          endTime: item.endTime,
          status: mapStatus(item.status),
          meetUrl: item.meetUrl,
          notes: item.notes,
          raw: item,
        }));
        setAppointments(mapped);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải lịch hẹn');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Map status backend sang tiếng Việt
  function mapStatus(status) {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELED':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã xác nhận':
        return 'success';
      case 'Chờ xác nhận':
        return 'warning';
      case 'Hoàn thành':
        return 'info';
      case 'Đã hủy':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedAppointment(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {/* <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: '#2D3748', // Dark text for medical
          fontWeight: 600,
        }}
      >
        Quản lý lịch hẹn
      </Typography> */}

      {/* Search and Filter */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 144, 226, 0.15)',
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              placeholder="Tìm kiếm bệnh nhân hoặc dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: '300px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#718096', mr: 1 }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                <MenuItem value="Đã hủy">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 144, 226, 0.15)',
          borderRadius: 3,
        }}
      >
        <TableContainer component={Paper} sx={{ background: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Mã
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Bệnh nhân
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Tư vấn viên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Ngày
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Link tư vấn
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.consultant}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {appointment.raw && appointment.raw.meetUrl ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<LinkIcon />}
                          href={appointment.raw.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            background:
                              'linear-gradient(45deg, #20B2AA, #48D1CC)',
                            boxShadow: '0 2px 8px rgba(32,178,170,0.08)',
                            '&:hover': {
                              background:
                                'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                              boxShadow: '0 4px 16px rgba(32,178,170,0.15)',
                            },
                          }}
                        >
                          Vào phòng
                        </Button>
                      ) : (
                        <span style={{ color: '#aaa' }}>-</span>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<InfoIcon />}
                        sx={{ fontWeight: 600, borderRadius: 2, minWidth: 120 }}
                        onClick={() => handleViewDetail(appointment)}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ pt: 2 }}>
              <TextField
                label="Bệnh nhân"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.patientName}
                disabled
              />
              <TextField
                label="Dịch vụ"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.service}
              />
              <TextField
                label="Tư vấn viên"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.consultant}
              />
              <TextField
                label="Ngày"
                type="date"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.date}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Giờ"
                type="time"
                fullWidth
                margin="normal"
                defaultValue={selectedAppointment.time}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  defaultValue={selectedAppointment.status}
                  label="Trạng thái"
                >
                  <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                  <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                  <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            }}
            onClick={handleCloseDialog}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#20B2AA',
            fontWeight: 700,
          }}
        >
          <InfoIcon sx={{ color: '#20B2AA', fontSize: 28 }} />
          Chi tiết cuộc hẹn
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ pt: 1, px: 1, pb: 0, minWidth: 350 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                >
                  Bệnh nhân
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: '#2D3748', mb: 1 }}
                >
                  {selectedAppointment.patientName}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                >
                  Tư vấn viên
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}
                >
                  {selectedAppointment.consultant}
                </Typography>
                {selectedAppointment.consultantQualifications && (
                  <Typography
                    variant="body2"
                    sx={{ color: '#009688', mb: 0.2 }}
                  >
                    <b>Chuyên môn:</b>{' '}
                    {selectedAppointment.consultantQualifications}
                  </Typography>
                )}
                {selectedAppointment.consultantExperience && (
                  <Typography variant="body2" sx={{ color: '#009688' }}>
                    <b>Kinh nghiệm:</b>{' '}
                    {selectedAppointment.consultantExperience}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2, display: 'flex', gap: 3 }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                  >
                    Ngày
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: '#2D3748' }}
                  >
                    {selectedAppointment.date}
                  </Typography>
                </Box>
                {(formatTimeFromArray(selectedAppointment.startTime) ||
                  formatTimeFromArray(selectedAppointment.endTime)) && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                    >
                      Thời gian
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: '#2D3748' }}
                    >
                      {formatTimeFromArray(selectedAppointment.startTime)}
                      {formatTimeFromArray(selectedAppointment.endTime)
                        ? ` - ${formatTimeFromArray(selectedAppointment.endTime)}`
                        : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                >
                  Trạng thái
                </Typography>
                <Chip
                  label={selectedAppointment.status}
                  color={getStatusColor(selectedAppointment.status)}
                  sx={{ fontWeight: 700, fontSize: 16, px: 2, py: 0.5 }}
                />
              </Box>
              {selectedAppointment.meetUrl && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                  >
                    Link tư vấn
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LinkIcon />}
                    href={selectedAppointment.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #20B2AA, #48D1CC)',
                    }}
                  >
                    Vào phòng tư vấn
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ color: '#1976d2', mt: 0.5, wordBreak: 'break-all' }}
                  >
                    {selectedAppointment.meetUrl}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                >
                  Lý do
                </Typography>
                <Typography variant="body1" sx={{}}>
                  {selectedAppointment.service &&
                  selectedAppointment.service !== '-'
                    ? selectedAppointment.service
                    : 'Không có lý do'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#607D8B', fontWeight: 600, mb: 0.5 }}
                >
                  Ghi chú
                </Typography>
                <Typography variant="body1" sx={{}}>
                  {selectedAppointment.notes
                    ? selectedAppointment.notes
                    : 'Chưa có ghi chú'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              background: 'linear-gradient(45deg, #20B2AA, #48D1CC)',
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentManagementContent;

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
import { Search as SearchIcon, Edit as EditIcon } from '@mui/icons-material';
import { adminService } from '@/services/adminService';
import { formatDateDisplay } from '@/utils/dateUtils';

const AppointmentManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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
          date: formatDateDisplay(item.startTime),
          status: mapStatus(item.status),
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
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: '#2D3748', // Dark text for medical
          fontWeight: 600,
        }}
      >
        Quản lý lịch hẹn
      </Typography>

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
                    {appointment.raw && appointment.raw.meetUrl ? (
                      <a
                        href={appointment.raw.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          color: '#1976d2',
                          fontWeight: 500,
                        }}
                      >
                        Vào phòng
                      </a>
                    ) : (
                      <span style={{ color: '#aaa' }}>-</span>
                    )}
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
    </Box>
  );
};

export default AppointmentManagementContent;

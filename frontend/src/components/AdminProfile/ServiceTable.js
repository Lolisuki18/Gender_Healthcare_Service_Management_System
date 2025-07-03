import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
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
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    price
  );
const formatDate = (date) => {
  if (!date) return 'N/A';
  if (Array.isArray(date)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = date;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString(
      'vi-VN'
    );
  }
  const d = new Date(date);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString('vi-VN');
};
const getActiveStatus = (service) =>
  service.isActive !== undefined
    ? service.isActive
    : service.is_active !== undefined
      ? service.is_active
      : service.active !== undefined
        ? service.active
        : true;

const ServiceTable = ({ services, loading, error }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = Array.isArray(services)
    ? services.filter((service) => {
        const matchesSearch =
          (service.name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (service.description || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        let matchesStatus = true;
        const isActive = getActiveStatus(service);
        if (statusFilter === 'active') matchesStatus = isActive;
        else if (statusFilter === 'inactive') matchesStatus = !isActive;
        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm dịch vụ theo tên hoặc mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#4A90E2' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Lọc trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Lọc trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}
      <TableContainer
        component={Paper}
        sx={{
          mb: 3,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{ background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)' }}
            >
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mã</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Tên dịch vụ
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Mô tả
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Giá
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Xem chi tiết
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {loading ? 'Đang tải...' : 'Không tìm thấy dịch vụ nào'}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      {service.description
                        ? service.description.length > 50
                          ? `${service.description.substring(0, 50)}...`
                          : service.description
                        : 'Không có'}
                    </TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          getActiveStatus(service)
                            ? 'Đang hoạt động'
                            : 'Ngừng hoạt động'
                        }
                        size="small"
                        sx={{
                          backgroundColor: getActiveStatus(service)
                            ? '#E3FCF7'
                            : '#FEE2E2',
                          color: getActiveStatus(service)
                            ? '#0F9B8E'
                            : '#DC2626',
                          fontWeight: 600,
                          border: getActiveStatus(service)
                            ? '1px solid #1ABC9C'
                            : '1px solid #DC2626',
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedService(service);
                          setDetailDialog(true);
                        }}
                        sx={{ color: '#4A90E2' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      </TableContainer>
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.25rem',
            px: 3,
            py: 2,
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}
        >
          Chi tiết dịch vụ: {selectedService?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 3 }}>
          {selectedService && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#4A90E2', mb: 1 }}
              >
                Mã dịch vụ: {selectedService.id}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#4A90E2', mb: 1 }}
              >
                Giá: {formatPrice(selectedService.price)}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#4A90E2', mb: 1 }}
              >
                Mô tả:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  color: '#222',
                  whiteSpace: 'pre-line',
                  mb: 2,
                }}
              >
                {selectedService.description || 'Không có mô tả'}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#4A90E2', mb: 1 }}
              >
                Trạng thái:{' '}
                {getActiveStatus(selectedService)
                  ? 'Đang hoạt động'
                  : 'Ngừng hoạt động'}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#4A90E2', mb: 1 }}
              >
                Cập nhật lần cuối: {formatDate(selectedService.updatedAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Box flex={1} />
          <Box>
            <button
              onClick={() => setDetailDialog(false)}
              style={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                border: 'none',
                borderRadius: 8,
                padding: '8px 24px',
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceTable;

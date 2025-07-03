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
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    price
  );
const calculateDiscount = (pkg, services) => {
  // Lấy danh sách service thực tế trong package
  let serviceList = [];
  if (pkg.services && Array.isArray(pkg.services) && pkg.services.length > 0) {
    serviceList = pkg.services;
  } else if (pkg.stiService && Array.isArray(pkg.stiService)) {
    serviceList = pkg.stiService
      .map((sv) =>
        typeof sv === 'object' ? sv : services.find((s) => s.id === sv)
      )
      .filter(Boolean);
  }
  const totalPrice = serviceList.reduce((sum, s) => sum + (s.price || 0), 0);
  const packagePrice = pkg.price || 0;
  if (!totalPrice || !packagePrice || totalPrice <= 0)
    return { saving: 0, discountPercent: 0, formattedText: '0₫ (0%)' };
  const saving = totalPrice - packagePrice;
  if (saving <= 0)
    return { saving: 0, discountPercent: 0, formattedText: '0₫ (0%)' };
  const discountPercent = Math.round((saving / totalPrice) * 100);
  return {
    saving,
    discountPercent,
    formattedText: `${formatPrice(saving)} (${discountPercent}%)`,
  };
};

const PackageTable = ({ packages, services, loading, error }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);

  const filteredPackages = Array.isArray(packages)
    ? packages.filter((pkg) => {
        const matchesSearch =
          (pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.description || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (pkg.recommended_for || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'active'
              ? pkg.isActive
              : !pkg.isActive;
        const matchesPrice =
          (!minPrice || pkg.price >= Number(minPrice)) &&
          (!maxPrice || pkg.price <= Number(maxPrice));
        return matchesSearch && matchesStatus && matchesPrice;
      })
    : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Tìm kiếm theo tên gói, mô tả hoặc đối tượng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '30%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#4A90E2' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang cung cấp</MenuItem>
            <MenuItem value="inactive">Ngừng cung cấp</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Giá từ"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{ width: 120 }}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <TextField
          label="Đến"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ width: 120 }}
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress sx={{ color: '#4A90E2' }} />
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
          mb: 4,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{ background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)' }}
            >
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Tên gói
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Mô tả
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Đề xuất cho
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Giá
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Giảm giá
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Số dịch vụ
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Trạng thái
              </TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                Xem chi tiết
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {loading ? 'Đang tải...' : 'Không tìm thấy gói STI nào'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pkg, index) => {
                  const discountInfo = calculateDiscount(pkg, services);
                  const serviceCount = pkg.services
                    ? pkg.services.length
                    : pkg.stiService
                      ? pkg.stiService.length
                      : 0;
                  return (
                    <TableRow key={pkg.id}>
                      <TableCell>{pkg.id}</TableCell>
                      <TableCell>{pkg.name}</TableCell>
                      <TableCell>{pkg.description}</TableCell>
                      <TableCell>{pkg.recommended_for || ''}</TableCell>
                      <TableCell>{formatPrice(pkg.price)}</TableCell>
                      <TableCell>
                        {discountInfo.discountPercent > 0 ? (
                          <Chip
                            label={`${discountInfo.discountPercent}%`}
                            size="small"
                            sx={{
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              fontWeight: 600,
                              border: '1px solid #DC2626',
                              fontSize: '0.75rem',
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            Không giảm giá
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${serviceCount} dịch vụ`}
                          size="small"
                          sx={{
                            background:
                              'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            pkg.isActive ? 'Đang cung cấp' : 'Ngừng cung cấp'
                          }
                          size="small"
                          sx={{
                            backgroundColor: pkg.isActive
                              ? '#E3FCF7'
                              : '#F3F4F6',
                            color: pkg.isActive ? '#0F9B8E' : '#6B7280',
                            fontWeight: 600,
                            border: pkg.isActive
                              ? '1px solid #1ABC9C'
                              : '1px solid #D1D5DB',
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setPackageDetails(pkg);
                              setOpenDetailsDialog(true);
                            }}
                            sx={{ color: '#4A90E2' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPackages.length}
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
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
            px: 3,
            py: 2,
          }}
        >
          Chi tiết dịch vụ trong gói: {packageDetails?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 3 }}>
          {packageDetails && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff, #f8fcff)',
                  borderRadius: '16px',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  mb: 4,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px',
                  }}
                >
                  Thông tin gói xét nghiệm
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <span
                        style={{
                          color: '#546E7A',
                          marginRight: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Tên gói:
                      </span>
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {packageDetails.name}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <span
                        style={{
                          color: '#546E7A',
                          marginRight: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Giá gói:
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {formatPrice(packageDetails.price)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <span
                        style={{
                          color: '#546E7A',
                          marginRight: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Đề xuất cho:
                      </span>
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {packageDetails.recommended_for}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <span
                        style={{
                          color: '#546E7A',
                          marginRight: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Số dịch vụ:
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {packageDetails.services
                          ? packageDetails.services.length
                          : packageDetails.stiService
                            ? packageDetails.stiService.length
                            : 0}{' '}
                        dịch vụ
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span
                        style={{
                          color: '#546E7A',
                          marginRight: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Mô tả:
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        pl: 1.5,
                        borderLeft: '3px solid rgba(74, 144, 226, 0.3)',
                        py: 1,
                        color: '#455A64',
                        lineHeight: 1.6,
                      }}
                    >
                      {packageDetails.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  mb: 2.5,
                  mt: 4,
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px',
                }}
              >
                Danh sách dịch vụ bao gồm
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  mb: 2.5,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(74, 144, 226, 0.12)',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        background:
                          'linear-gradient(45deg, rgba(74, 144, 226, 0.12), rgba(26, 188, 156, 0.12))',
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: '600',
                          py: 2,
                          width: '10%',
                          color: '#2c3e50',
                        }}
                      >
                        STT
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: '600',
                          py: 2,
                          width: '25%',
                          color: '#2c3e50',
                        }}
                      >
                        Tên dịch vụ
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: '600',
                          py: 2,
                          width: '45%',
                          color: '#2c3e50',
                        }}
                      >
                        Mô tả
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: '600',
                          py: 2,
                          width: '20%',
                          color: '#2c3e50',
                        }}
                      >
                        Giá đơn lẻ
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(
                      packageDetails.services ||
                      (packageDetails.stiService &&
                      Array.isArray(packageDetails.stiService)
                        ? packageDetails.stiService.map((sv) =>
                            typeof sv === 'object'
                              ? sv
                              : services.find((s) => s.id === sv) || {}
                          )
                        : [])
                    ).map((service, idx) => (
                      <TableRow key={service.id || idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell align="right">
                          {formatPrice(service.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <Button
            onClick={() => setOpenDetailsDialog(false)}
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackageTable;

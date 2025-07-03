/**
 * STIPackageManagementContent.js
 *
 * Mục đích: Quản lý các gói STI Package
 * - Hiển thị danh sách các gói STI
 * - Thêm/sửa/xóa gói STI
 * - Quản lý thông tin chi tiết gói
 */

// ======================= IMPORT CÁC THƯ VIỆN VÀ HÀM API =======================
// Import các thư viện React, Material UI, các icon, các hàm gọi API, và Toast để hiển thị thông báo
import React, { useEffect, useState, useCallback } from 'react';
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
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  getAllSTIPackages,
  createSTIPackage,
  updateSTIPackage,
  deleteSTIPackage,
  getAllSTIServices,
} from '@/services/stiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSTIServicesAndPackages from '../../hooks/useSTIServicesAndPackages';

const STIPackageManagementContent = () => {
  const { services, packages, loading, error, reload } =
    useSTIServicesAndPackages();
  // availableServices: Danh sách các dịch vụ xét nghiệm có thể chọn khi tạo/sửa gói
  const availableServices = services;
  // packages: Danh sách các gói xét nghiệm STI (đã chuẩn hóa)
  // selectedServices: Danh sách ID dịch vụ được chọn cho gói hiện tại
  const [selectedServices, setSelectedServices] = useState([]);
  // formData: Dữ liệu form khi thêm/sửa gói
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    recommended_for: '',
    isActive: true,
    stiService: [],
  });
  // errors: Lưu lỗi validate form
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    services: '',
  });
  // Các state khác: Quản lý phân trang, tìm kiếm, filter trạng thái, loading, error, success, dialog mở/đóng, v.v.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // ======================= HANDLER CHO UI VÀ FORM =======================

  // Chuyển trang bảng danh sách
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Đổi số dòng hiển thị mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý tìm kiếm theo tên/mô tả/đối tượng
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Mở dialog thêm mới gói STI
  const handleOpenAddDialog = () => {
    setCurrentPackage(null);
    setSelectedServices([]);
    setFormData({
      name: '',
      description: '',
      price: 0,
      recommended_for: '',
      isActive: true,
      stiService: [],
    });
    setErrors({
      name: '',
      description: '',
      price: '',
      services: '',
    });
    setOpenDialog(true);
  };

  // Mở dialog chỉnh sửa gói STI đã chọn
  const handleOpenEditDialog = (pkg) => {
    setCurrentPackage(pkg);
    setSelectedServices(pkg.services.map((service) => service.id));
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      recommended_for: pkg.recommended_for,
      isActive: pkg.isActive,
    });
    setErrors({
      name: '',
      description: '',
      price: '',
      services: '',
    });
    setOpenDialog(true);
  };

  // Đóng dialog thêm/sửa gói
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Mở dialog xem chi tiết gói
  const handleOpenDetailsDialog = (pkg) => {
    setPackageDetails(pkg);
    setOpenDetailsDialog(true);
  };

  // Đóng dialog xem chi tiết gói
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  // Chọn hoặc bỏ chọn một dịch vụ trong form
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) => {
      const newSelected = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];

      if (newSelected.length > 0 && errors.services) {
        setErrors((prev) => ({
          ...prev,
          services: '',
        }));
      }

      return newSelected;
    });
  };

  // Xử lý thay đổi giá trị các trường trong form
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Kiểm tra dữ liệu form trước khi lưu (validate)
  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      price: '',
      services: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required';
      isValid = false;
    } else if (formData.name.length > 200) {
      newErrors.name = 'Package must not exceed 200 characters';
      isValid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price is required and must be greater than 0';
      isValid = false;
    }

    if (selectedServices.length === 0) {
      newErrors.services = 'At least one service must be selected';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Lưu gói STI mới hoặc cập nhật gói đã có
  const handleSavePackage = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const selectedServicesData = availableServices.filter((service) =>
        selectedServices.includes(service.id)
      );
      const stiServiceIds = Array.isArray(selectedServices)
        ? selectedServices
            .map((item) =>
              typeof item === 'object' && item !== null ? item.id : item
            )
            .filter((id) => typeof id === 'number')
        : [];
      const packageDTO = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        isActive: formData.isActive,
        stiService: stiServiceIds,
      };
      console.log('selectedServices:', selectedServices);
      console.log('stiService gửi lên:', stiServiceIds);
      console.log('packageDTO gửi lên:', packageDTO);

      let response;
      if (currentPackage) {
        const { id, ...packageDataWithoutId } = packageDTO;
        response = await updateSTIPackage(
          currentPackage.id,
          packageDataWithoutId
        );
      } else {
        console.log('Creating new package with data:', packageDTO);
        response = await createSTIPackage(packageDTO);
      }

      console.log('API Response:', response);

      if (!response || !response.success) {
        throw new Error(response?.message || 'API call was unsuccessful');
      }

      const updatedPackageData = response.data;
      console.log('Updated Package Data from API:', updatedPackageData);

      if (!updatedPackageData) {
        throw new Error('No package data returned from API');
      }
      console.log(
        'All fields from the API response:',
        Object.keys(updatedPackageData)
      );

      const mappedPackage = {
        id: updatedPackageData.id,
        name: updatedPackageData.name,
        description: updatedPackageData.description || '',
        price: updatedPackageData.price || 0,
        recommended_for: updatedPackageData.recommended_for || 'Tất cả',
        isActive:
          updatedPackageData.isActive !== undefined
            ? updatedPackageData.isActive
            : updatedPackageData.active !== undefined
              ? updatedPackageData.active
              : true,
        services: updatedPackageData.services
          ? updatedPackageData.services.map((service) => {
              if (service) console.log('Service fields:', Object.keys(service));

              return {
                id: service.id,
                name: service.name,
                description: service.description || '',
                price: service.price || 0,
                isActive:
                  service.isActive !== undefined
                    ? service.isActive
                    : service.active !== undefined
                      ? service.active
                      : true,
              };
            })
          : selectedServicesData,
        createdAt: updatedPackageData.createdAt,
        updatedAt: updatedPackageData.updatedAt || new Date().toISOString(),
      };

      if (currentPackage) {
        try {
          const refreshResult = await reload();
          if (!refreshResult.success) {
            // setPackages(packages.map((pkg) => pkg.id === currentPackage.id ? mappedPackage : pkg));
          }
          toast.success(`Cập nhật gói STI ${mappedPackage.name} thành công`);
        } catch (refreshError) {
          console.error(
            'Failed to refresh packages after update:',
            refreshError
          );
          // setPackages(packages.map((pkg) => pkg.id === currentPackage.id ? mappedPackage : pkg));
          toast.success(
            `Cập nhật gói STI ${mappedPackage.name} thành công, nhưng danh sách chưa được làm mới hoàn toàn`
          );
        }
      } else {
        try {
          const result = await reload();
          if (!result.success) {
            // setPackages([...packages, mappedPackage]);
          }
          toast.success(`Thêm gói STI ${mappedPackage.name} thành công`);
        } catch (refreshError) {
          console.error(
            'Failed to refresh packages after create:',
            refreshError
          );
          // setPackages([...packages, mappedPackage]);
          toast.success(
            `Thêm gói STI ${mappedPackage.name} thành công, nhưng danh sách chưa được làm mới`
          );
        }
      }
    } catch (err) {
      console.error('Error saving STI package:', err);
      toast.error(
        'Không thể lưu gói STI: ' + (err.message || 'Lỗi không xác định')
      );
    }
  };

  // Xóa một gói STI theo id
  const handleDeletePackage = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói này?')) {
      try {
        const response = await deleteSTIPackage(id);

        if (!response || !response.success) {
          throw new Error(response?.message || 'Could not delete the package');
        }

        // setPackages(packages.filter((pkg) => pkg.id !== id));

        try {
          await reload();
        } catch (refreshError) {
          console.error(
            'Failed to refresh packages after delete:',
            refreshError
          );
        }

        toast.success('Xóa gói STI thành công');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deleting STI package:', err);
        toast.error(
          'Không thể xóa gói STI: ' + (err.message || 'Lỗi không xác định')
        );
      }
    }
  };

  // ======================= FILTER VÀ XỬ LÝ DỮ LIỆU HIỂN THỊ =======================

  // Định dạng giá tiền sang VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Tính số tiền tiết kiệm và phần trăm giảm giá khi mua gói so với mua lẻ từng dịch vụ
  const calculateDiscount = (totalPrice, packagePrice) => {
    if (!totalPrice || !packagePrice || totalPrice <= 0) {
      return {
        saving: 0,
        discountPercent: 0,
        formattedText: '0₫ (0%)',
      };
    }

    const saving = totalPrice - packagePrice;
    if (saving <= 0) {
      return {
        saving: 0,
        discountPercent: 0,
        formattedText: '0₫ (0%)',
      };
    }

    const discountPercent = Math.round((saving / totalPrice) * 100);
    return {
      saving,
      discountPercent,
      formattedText: `${formatPrice(saving)} (${discountPercent}%)`,
    };
  };

  // Chuẩn hóa danh sách dịch vụ gửi lên backend (chỉ lấy id)
  const prepareServiceIdsForBackend = useCallback((services) => {
    if (!Array.isArray(services)) return [];

    return services
      .map((service) => {
        if (typeof service === 'number') return service;
        if (typeof service === 'object' && service !== null) {
          return service.id ?? service.serviceId;
        }
        return null;
      })
      .filter((id) => typeof id === 'number');
  }, []);

  // Lọc danh sách gói theo tìm kiếm, trạng thái, khoảng giá
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

  // ======================= UI HIỂN THỊ =======================
  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        minHeight: '85vh',
      }}
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress
            sx={{
              color: '#4A90E2',
            }}
          />
        </Box>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '8px',
          }}
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: '8px',
          }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}
        >
          Quản lý Gói STI
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4,
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Tìm kiếm theo tên gói, mô tả hoặc đối tượng..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: '30%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4A90E2',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1ABC9C',
                borderWidth: '2px',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#4A90E2' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 150, ml: 2 }}>
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
          sx={{ width: 120, ml: 2 }}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <TextField
          label="Đến"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ width: 120, ml: 1 }}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            px: 3,
            py: 1,
            borderRadius: '8px',
            '&:hover': {
              background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
              boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
            },
          }}
        >
          Thêm gói STI
        </Button>
      </Box>
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
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              }}
            >
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  width: '15%',
                }}
              >
                Tên gói
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  width: '20%',
                }}
              >
                Mô tả
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  width: '15%',
                }}
              >
                Đề xuất cho
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                }}
              >
                Giá
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                }}
              >
                Giảm giá
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                }}
              >
                Số dịch vụ
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Đang tải dữ liệu...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pkg, index) => {
                  const discountInfo = calculateDiscount(
                    pkg.services.reduce(
                      (sum, service) => sum + service.price,
                      0
                    ),
                    pkg.price
                  );

                  return (
                    <TableRow
                      key={pkg.id}
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(74, 144, 226, 0.04)',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>{pkg.id}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {pkg.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {pkg.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {pkg.recommended_for}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#4A90E2',
                          }}
                        >
                          {formatPrice(pkg.price)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
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
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={`${pkg.services.length} dịch vụ`}
                            size="small"
                            sx={{
                              background:
                                'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                              color: 'white',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          />
                          <Tooltip title="Xem chi tiết dịch vụ">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetailsDialog(pkg)}
                              sx={{
                                color: '#4A90E2',
                                '&:hover': {
                                  backgroundColor: 'rgba(74, 144, 226, 0.1)',
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
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
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Box
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog(pkg)}
                              sx={{
                                mr: 1,
                                color: '#1ABC9C',
                                '&:hover': {
                                  backgroundColor: 'rgba(26, 188, 156, 0.1)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePackage(pkg.id)}
                              sx={{
                                color: '#E53E3E',
                                '&:hover': {
                                  backgroundColor: 'rgba(229, 62, 62, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
            {filteredPackages.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không tìm thấy gói STI nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPackages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            '& .MuiTablePagination-selectIcon': { color: '#4A90E2' },
            '& .MuiTablePagination-select': { fontWeight: 500 },
            '& .MuiTablePagination-displayedRows': { fontWeight: 500 },
          }}
        />
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 32px rgba(0,0,0,0.18)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.4rem',
            px: 3.5,
            py: 2.5,
            letterSpacing: '0.5px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
            },
          }}
        >
          {currentPackage ? 'Chỉnh sửa gói STI' : 'Thêm gói STI mới'}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ px: 3.5, py: 3.5, backgroundColor: '#fafcff' }}
        >
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên gói"
                  margin="normal"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={
                    errors.name
                      ? errors.name
                      : `${formData.name.length}/200 ký tự`
                  }
                  inputProps={{ maxLength: 200 }}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4A90E2',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: '500',
                      color: '#344767',
                      '&.Mui-focused': {
                        color: '#1ABC9C',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: '4px',
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Đề xuất cho"
                  margin="normal"
                  placeholder="VD: Người có nguy cơ cao, phụ nữ có thai..."
                  value={formData.recommended_for}
                  onChange={(e) =>
                    handleInputChange('recommended_for', e.target.value)
                  }
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4A90E2',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                        borderWidth: '2px',
                      },
                      '& input': {
                        fontWeight: '500',
                        color: '#344767',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: '500',
                      color: '#344767',
                      '&.Mui-focused': {
                        color: '#1ABC9C',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Giá gói (VNĐ)"
                  margin="normal"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange('price', Number(e.target.value))
                  }
                  InputProps={{
                    inputProps: { min: 0 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <span
                          style={{
                            color: '#4A90E2',
                            fontWeight: '600',
                            fontSize: '1rem',
                          }}
                        >
                          ₫
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.price}
                  helperText={errors.price}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4A90E2',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                        borderWidth: '2px',
                      },
                      '& input': {
                        fontWeight: '500',
                        color: '#344767',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: '500',
                      color: '#344767',
                      '&.Mui-focused': {
                        color: '#1ABC9C',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả"
                margin="normal"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                error={!!errors.description}
                helperText={
                  errors.description
                    ? errors.description
                    : `${formData.description.length}/500 ký tự`
                }
                inputProps={{ maxLength: 500 }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4A90E2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1ABC9C',
                      borderWidth: '2px',
                    },
                    '& textarea': {
                      fontWeight: '500',
                      color: '#344767',
                      lineHeight: 1.6,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: '500',
                    color: '#344767',
                    '&.Mui-focused': {
                      color: '#1ABC9C',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    marginLeft: '4px',
                    fontSize: '0.75rem',
                  },
                }}
              />
            </Grid>
            <Box
              sx={{
                mt: 4,
                background:
                  'linear-gradient(45deg, rgba(74, 144, 226, 0.03), rgba(26, 188, 156, 0.03))',
                p: 3.5,
                borderRadius: '16px',
                border: '1px solid rgba(74, 144, 226, 0.12)',
                boxShadow: '0 3px 14px rgba(0,0,0,0.02)',
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  mb: 2,
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px',
                  fontSize: '1.15rem',
                }}
              >
                Các dịch vụ bao gồm trong gói{' '}
                <span style={{ color: '#FF5252', fontSize: '1.1rem' }}>*</span>
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                }}
              >
                {errors.services ? (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: '#FF5252',
                      fontWeight: '500',
                    }}
                  >
                    {errors.services}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#546E7A',
                      fontStyle: 'italic',
                    }}
                  >
                    Vui lòng chọn các dịch vụ sẽ bao gồm trong gói
                  </Typography>
                )}
                {selectedServices.length > 0 && (
                  <Chip
                    label={`${selectedServices.length} dịch vụ được chọn`}
                    size="small"
                    sx={{
                      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                      color: 'white',
                      fontWeight: '500',
                      px: 0.5,
                    }}
                  />
                )}
              </Box>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        background:
                          'linear-gradient(45deg, rgba(74, 144, 226, 0.12), rgba(26, 188, 156, 0.12))',
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ py: 1.8 }}>
                        <Checkbox
                          indeterminate={
                            selectedServices.length > 0 &&
                            selectedServices.length < availableServices.length
                          }
                          checked={
                            selectedServices.length === availableServices.length
                          }
                          onChange={() => {
                            if (
                              selectedServices.length ===
                              availableServices.length
                            ) {
                              setSelectedServices([]);
                            } else {
                              setSelectedServices(
                                availableServices.map((s) => s.id)
                              );

                              if (errors.services) {
                                setErrors((prev) => ({
                                  ...prev,
                                  services: '',
                                }));
                              }
                            }
                          }}
                          sx={{
                            color: '#4A90E2',
                            '&.Mui-checked': {
                              color: '#1ABC9C',
                            },
                            '&.MuiCheckbox-indeterminate': {
                              color: '#4A90E2',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ py: 1.8, fontWeight: '600', color: '#2c3e50' }}
                      >
                        Tên dịch vụ
                      </TableCell>
                      <TableCell
                        sx={{ py: 1.8, fontWeight: '600', color: '#2c3e50' }}
                      >
                        Mô tả
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ py: 1.8, fontWeight: '600', color: '#2c3e50' }}
                      >
                        Giá
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableServices.map((service, index) => (
                      <TableRow
                        key={service.id}
                        hover
                        sx={{
                          backgroundColor:
                            index % 2 === 0
                              ? 'white'
                              : 'rgba(240, 247, 250, 0.6)',
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(74, 144, 226, 0.04)',
                          },
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ py: 1.2 }}>
                          <Checkbox
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceChange(service.id)}
                            sx={{
                              color: '#4A90E2',
                              '&.Mui-checked': {
                                color: '#1ABC9C',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.2 }}>
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            sx={{ color: '#344767' }}
                          >
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.2 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: '#475569',
                            }}
                          >
                            {service.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.2 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: '500', color: '#1565c0' }}
                          >
                            {formatPrice(service.price)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  background:
                    'linear-gradient(45deg, rgba(74, 144, 226, 0.08), rgba(26, 188, 156, 0.08))',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#546E7A', fontWeight: '500' }}
                    >
                      Tổng giá dịch vụ:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      align="right"
                      sx={{ color: '#344767' }}
                    >
                      {formatPrice(
                        availableServices
                          .filter((service) =>
                            selectedServices.includes(service.id)
                          )
                          .reduce((sum, service) => sum + service.price, 0)
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#546E7A', fontWeight: '500' }}
                    >
                      Giá gói:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      align="right"
                      sx={{
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {formatPrice(formData.price)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#546E7A', fontWeight: '500' }}
                    >
                      Tiết kiệm:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color="error"
                      align="right"
                    >
                      {(() => {
                        const servicesTotal = availableServices
                          .filter((service) =>
                            selectedServices.includes(service.id)
                          )
                          .reduce((sum, service) => sum + service.price, 0);
                        const discountInfo = calculateDiscount(
                          servicesTotal,
                          formData.price
                        );
                        return discountInfo.formattedText;
                      })()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
            <FormControl
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                mt: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
            >
              <InputLabel>Trạng thái gói dịch vụ</InputLabel>
              <Select
                value={formData.isActive}
                label="Trạng thái gói dịch vụ"
                onChange={(e) => handleInputChange('isActive', e.target.value)}
              >
                <MenuItem value={true}>Đang cung cấp</MenuItem>
                <MenuItem value={false}>Ngừng cung cấp</MenuItem>
              </Select>
              <FormHelperText>
                Trạng thái này chỉ áp dụng cho gói dịch vụ, không ảnh hưởng đến
                trạng thái của các dịch vụ riêng lẻ.
              </FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3.5,
            py: 2.5,
            bgcolor: '#f5f9fc',
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: '#4A90E2',
              fontWeight: 600,
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.08)',
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePackage}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 3px 10px rgba(74, 144, 226, 0.25)',
              px: 3.5,
              py: 1.2,
              borderRadius: '10px',
              fontSize: '0.95rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                boxShadow: '0 5px 15px rgba(74, 144, 226, 0.4)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease',
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
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
                        {packageDetails.services.length} dịch vụ
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
                    {packageDetails.services.map((service, index) => (
                      <TableRow
                        key={service.id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0
                              ? 'white'
                              : 'rgba(240, 247, 250, 0.6)',
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(74, 144, 226, 0.04)',
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1.8 }}>{index + 1}</TableCell>
                        <TableCell sx={{ py: 1.8 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: '500', color: '#344767' }}
                          >
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.8, color: '#475569' }}>
                          {service.description}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.8 }}>
                          <Typography
                            sx={{ fontWeight: '500', color: '#1565c0' }}
                          >
                            {formatPrice(service.price)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, rgba(74, 144, 226, 0.06), rgba(26, 188, 156, 0.06))',
                  borderRadius: '16px',
                  p: 3,
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  mt: 4,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Grid container spacing={2.5} alignItems="center">
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: '500', color: '#546E7A' }}
                    >
                      Tổng giá nếu mua lẻ:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: '600', color: '#344767' }}
                      align="right"
                    >
                      {formatPrice(
                        packageDetails.services.reduce(
                          (sum, service) => sum + service.price,
                          0
                        )
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: '600',
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Giá khi mua gói:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: '600',
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      align="right"
                    >
                      {formatPrice(packageDetails.price)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: '600', color: '#E53935' }}
                    >
                      Tiết kiệm khi mua gói:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: '600', color: '#E53935' }}
                      align="right"
                    >
                      {(() => {
                        const servicesTotal = packageDetails.services.reduce(
                          (sum, service) => sum + service.price,
                          0
                        );
                        const discountInfo = calculateDiscount(
                          servicesTotal,
                          packageDetails.price
                        );
                        return discountInfo.formattedText;
                      })()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <Button
            onClick={handleCloseDetailsDialog}
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

// ======================= EXPORT COMPONENT =======================
// Export component để sử dụng ở nơi khác
export default STIPackageManagementContent;

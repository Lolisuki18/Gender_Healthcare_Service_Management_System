/**
 * STIPackageManagementContent.js
 *
 * Mục đích: Quản lý các gói STI Package
 * - Hiển thị danh sách các gói STI
 * - Thêm/sửa/xóa gói STI
 * - Quản lý thông tin chi tiết gói
 */

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

const STIPackageManagementContent = () => {
  const [packages, setPackages] = useState([
    //     {
    //       id: 1,
    //       name: 'Xét nghiệm HIV',
    //       description: 'Phát hiện kháng thể HIV trong máu',
    //       price: 450000,
    //       isActive: true,
    //     },
    //     {
    //       id: 2,
    //       name: 'Xét nghiệm Giang mai',
    //       description: 'Kiểm tra vi khuẩn Treponema pallidum',
    //       price: 350000,
    //       isActive: true,
    //     },
    //     {
    //       id: 3,
    //       name: 'Xét nghiệm Lậu',
    //       description: 'Xác định vi khuẩn lậu',
    //       price: 450000,
    //       isActive: true,
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   name: 'Gói sàng lọc STI toàn diện',
    //   description: 'Bao gồm tất cả các xét nghiệm STI',
    //   price: 3200000,
    //   recommended_for: 'Người có nhiều bạn tình',
    //   isActive: true,
    //   createdAt: '2025-04-15T10:20:00',
    //   updatedAt: '2025-05-20T16:45:00',
    //   services: [
    //     {
    //       id: 1,
    //       name: 'Xét nghiệm HIV',
    //       description: 'Phát hiện kháng thể HIV trong máu',
    //       price: 450000,
    //       isActive: true,
    //     },
    //     {
    //       id: 2,
    //       name: 'Xét nghiệm Giang mai',
    //       description: 'Kiểm tra vi khuẩn Treponema pallidum',
    //       price: 350000,
    //       isActive: true,
    //     },
    //     {
    //       id: 3,
    //       name: 'Xét nghiệm Lậu',
    //       description: 'Xác định vi khuẩn lậu',
    //       price: 450000,
    //       isActive: true,
    //     },
    //     {
    //       id: 4,
    //       name: 'Xét nghiệm Chlamydia',
    //       description: 'Phát hiện vi khuẩn Chlamydia trachomatis',
    //       price: 550000,
    //       isActive: true,
    //     },
    //     {
    //       id: 5,
    //       name: 'Xét nghiệm HPV',
    //       description: 'Phát hiện virus Human papillomavirus',
    //       price: 850000,
    //       isActive: true,
    //     },
    //     {
    //       id: 6,
    //       name: 'Xét nghiệm Herpes',
    //       description: 'Phát hiện virus Herpes simplex',
    //       price: 650000,
    //       isActive: true,
    //     },
    //   ],
    // },
    // {
    //   id: 3,
    //   name: 'Gói STI theo giới tính',
    //   description: 'Các xét nghiệm STI phù hợp với từng giới tính',
    //   price: 2000000,
    //   recommended_for: 'Phụ nữ trong độ tuổi sinh sản',
    //   isActive: false,
    //   createdAt: '2025-03-20T09:15:00',
    //   updatedAt: '2025-06-05T11:10:00',
    //   services: [
    //     {
    //       id: 1,
    //       name: 'Xét nghiệm HIV',
    //       description: 'Phát hiện kháng thể HIV trong máu',
    //       price: 450000,
    //       isActive: true,
    //     },
    //     {
    //       id: 4,
    //       name: 'Xét nghiệm Chlamydia',
    //       description: 'Phát hiện vi khuẩn Chlamydia trachomatis',
    //       price: 550000,
    //       isActive: true,
    //     },
    //     {
    //       id: 5,
    //       name: 'Xét nghiệm HPV',
    //       description: 'Phát hiện virus Human papillomavirus',
    //       price: 850000,
    //       isActive: true,
    //     },
    //   ],
    // },
  ]); // State quản lý các dịch vụ có sẵn

  // Fetch available services from backend
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    const fetchAvailableServices = async () => {
      try {
        const response = await getAllSTIServices();
        console.log('STI Services API response:', response);

        // Log service field names for better understanding
        if (response.data && response.data.length > 0) {
          console.log(
            'Service field names from API:',
            Object.keys(response.data[0])
          );
        }

        const servicesArray = response.data || [];

        // Map backend fields to frontend expected structure
        const mappedServices = Array.isArray(servicesArray)
          ? servicesArray.map((service) => ({
              id: service.id,
              name: service.name,
              description: service.description || '',
              price: service.price || 0,
              isActive:
                service.isActive !== undefined ? service.isActive : true,
            }))
          : [];

        setAvailableServices(mappedServices);
      } catch (err) {
        console.error('Error fetching available services:', err);
        setError(
          'Không thể tải dữ liệu dịch vụ: ' +
            (err.message || 'Lỗi không xác định')
        );
        setTimeout(() => setError(null), 5000);
      }
    };

    fetchAvailableServices();
  }, []); // Chỉ chạy một lần khi component mount
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  // State cho dialog xem chi tiết dịch vụ
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  // Add loading state for better UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    recommended_for: '', // Field này sẽ chỉ dùng cho frontend, không gửi lên backend
    isActive: true, // Backend expects 'isActive', not 'active'
  });
  // State cho validation errors
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    services: '',
  });

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  const handleOpenAddDialog = () => {
    setCurrentPackage(null);
    setSelectedServices([]);
    setFormData({
      name: '',
      description: '',
      price: 0,
      recommended_for: '',
      isActive: true,
    });
    // Reset validation errors when opening dialog
    setErrors({
      name: '',
      description: '',
      price: '',
      services: '',
    });
    setOpenDialog(true);
  };
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
    // Reset validation errors when opening dialog
    setErrors({
      name: '',
      description: '',
      price: '',
      services: '',
    });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Hàm mở dialog xem chi tiết dịch vụ
  const handleOpenDetailsDialog = (pkg) => {
    setPackageDetails(pkg);
    setOpenDetailsDialog(true);
  };

  // Hàm đóng dialog xem chi tiết dịch vụ
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) => {
      const newSelected = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];

      // Clear services error when user selects services
      if (newSelected.length > 0 && errors.services) {
        setErrors((prev) => ({
          ...prev,
          services: '',
        }));
      }

      return newSelected;
    });
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      price: '',
      services: '',
    };
    let isValid = true;

    // Validate name (required, max length 200 per DTO)
    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required';
      isValid = false;
    } else if (formData.name.length > 200) {
      newErrors.name = 'Package must not exceed 200 characters';
      isValid = false;
    }

    // Validate price (required, must be a positive number)
    if (formData.price <= 0) {
      newErrors.price = 'Price is required and must be greater than 0';
      isValid = false;
    }

    // Validate selected services (must select at least one)
    if (selectedServices.length === 0) {
      newErrors.services = 'At least one service must be selected';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const handleSavePackage = async () => {
    // Validate form before saving
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true); // Get selected services data
      const selectedServicesData = availableServices.filter((service) =>
        selectedServices.includes(service.id)
      ); // Prepare backend DTO data (STIPackageRequest)
      // Based on STIPackageController.java: name, description, price, isActive, stiService (array of IDs)
      // Chuẩn bị dữ liệu cho API request
      const packageDTO = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        isActive: formData.isActive, // Backend expects 'isActive'
        // Backend mong đợi mảng các ID đơn giản (Long), không phải object phức tạp
        stiService: prepareServiceIdsForBackend(selectedServices),
      };
      try {
        // Log the data we're sending to the API
        console.log(
          'Package data being sent:',
          currentPackage ? 'UPDATE' : 'CREATE',
          packageDTO
        ); // Backend yêu cầu stiService là mảng các ID (Long), không phải object
        // Sử dụng packageDTO trực tiếp vì chúng ta đã định nghĩa stiService là mảng ID
        console.log('Using simple IDs for stiService:', packageDTO.stiService);

        let response;
        if (currentPackage) {
          // Remove the ID from packageDTO since it's in the URL
          const { id, ...packageDataWithoutId } = packageDTO;
          response = await updateSTIPackage(
            currentPackage.id,
            packageDataWithoutId
          );
        } else {
          response = await createSTIPackage(packageDTO);
        }

        // Log the raw response from the API
        console.log('API Response:', response);

        // Check if the API call was successful
        if (!response || !response.success) {
          throw new Error(response?.message || 'API call was unsuccessful');
        }

        // The actual package data will be in the data field
        const updatedPackageData = response.data;
        console.log('Updated Package Data from API:', updatedPackageData);

        if (!updatedPackageData) {
          throw new Error('No package data returned from API');
        }
        // Map the API response to our frontend structure
        // Log all the fields from the API response to understand field names
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
          // Handle the isActive/active inconsistency
          isActive:
            updatedPackageData.isActive !== undefined
              ? updatedPackageData.isActive
              : updatedPackageData.active !== undefined
                ? updatedPackageData.active
                : true,
          services: updatedPackageData.services
            ? updatedPackageData.services.map((service) => {
                // Log service field names for debugging
                if (service)
                  console.log('Service fields:', Object.keys(service));

                return {
                  id: service.id,
                  name: service.name,
                  description: service.description || '',
                  price: service.price || 0,
                  // Handle the isActive/active inconsistency in services too
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

        // Update UI with the mappedPackage
        if (currentPackage) {
          // For updates, update local state and refresh the packages list to ensure sync
          try {
            // Fetch all packages after updating to ensure fresh data
            const refreshResult = await fetchAllPackages();
            if (!refreshResult.success) {
              // Fallback to optimistic update if refresh fails
              setPackages(
                packages.map((pkg) =>
                  pkg.id === currentPackage.id ? mappedPackage : pkg
                )
              );
            }
            setSuccess(`Cập nhật gói STI ${mappedPackage.name} thành công`);
          } catch (refreshError) {
            console.error(
              'Failed to refresh packages after update:',
              refreshError
            );
            // Fallback to optimistic update
            setPackages(
              packages.map((pkg) =>
                pkg.id === currentPackage.id ? mappedPackage : pkg
              )
            );
            setSuccess(
              `Cập nhật gói STI ${mappedPackage.name} thành công, nhưng danh sách chưa được làm mới hoàn toàn`
            );
          }
        } else {
          // For new packages, refresh the entire list to ensure we have all data correctly
          try {
            // Fetch all packages after creating a new one
            const result = await fetchAllPackages();
            if (!result.success) {
              // Fallback if refresh fails
              setPackages([...packages, mappedPackage]);
            }
            setSuccess(`Thêm gói STI ${mappedPackage.name} thành công`);
          } catch (refreshError) {
            console.error(
              'Failed to refresh packages after create:',
              refreshError
            );
            // Still add the package to UI even if refresh failed
            setPackages([...packages, mappedPackage]);
            setSuccess(
              `Thêm gói STI ${mappedPackage.name} thành công, nhưng danh sách chưa được làm mới`
            );
          }
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        throw new Error(`API Error: ${apiError.message || 'Unknown error'}`);
      }
      setTimeout(() => setSuccess(null), 3000);
      setOpenDialog(false);

      // Luôn tải lại dữ liệu sau khi lưu thành công
      await fetchAllPackages();
    } catch (err) {
      console.error('Error saving STI package:', err);
      setError(
        'Không thể lưu gói STI: ' + (err.message || 'Lỗi không xác định')
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePackage = async (id) => {
    // Logic xóa gói
    if (window.confirm('Bạn có chắc chắn muốn xóa gói này?')) {
      try {
        setLoading(true);

        // Call the API to delete the package
        const response = await deleteSTIPackage(id);

        // Check if the deletion was successful based on the ApiResponse structure
        if (!response || !response.success) {
          throw new Error(response?.message || 'Could not delete the package');
        }

        // Update state after successful deletion
        // First update optimistically
        setPackages(packages.filter((pkg) => pkg.id !== id));

        // Then refresh the list to ensure synchronization with backend
        try {
          await fetchAllPackages();
        } catch (refreshError) {
          console.error(
            'Failed to refresh packages after delete:',
            refreshError
          );
          // We already updated optimistically, so no need to do anything else
        }

        setSuccess('Xóa gói STI thành công');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deleting STI package:', err);
        setError(
          'Không thể xóa gói STI: ' + (err.message || 'Lỗi không xác định')
        );
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }
  };
  // Filter packages dựa trên searchTerm
  const filteredPackages = Array.isArray(packages)
    ? packages.filter(
        (pkg) =>
          (pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.description || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (pkg.recommended_for || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Helper function to calculate discount information
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

  // Helper function to ensure stiService is an array of simple IDs
  const prepareServiceIdsForBackend = useCallback((services) => {
    if (!services || !Array.isArray(services)) return [];

    // Chỉ lấy ID từ mỗi dịch vụ
    return services.map((service) => {
      if (typeof service === 'number') return service;
      if (typeof service === 'object' && service !== null)
        return service.id || service.serviceId;
      return service;
    });
  }, []);

  // Helper function to map backend package data to frontend format
  const mapBackendPackageToFrontend = useCallback((pkg) => {
    return {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      recommended_for: pkg.recommended_for || 'Tất cả',
      price: pkg.price || 0,
      // Handle the isActive/active inconsistency
      isActive:
        pkg.isActive !== undefined
          ? pkg.isActive
          : pkg.active !== undefined
            ? pkg.active
            : true,
      services: Array.isArray(pkg.services)
        ? pkg.services.map((service) => ({
            id: service.id,
            name: service.name,
            price: service.price || 0,
            description: service.description || '',
            // Handle the isActive/active inconsistency in services
            isActive:
              service.isActive !== undefined
                ? service.isActive
                : service.active !== undefined
                  ? service.active
                  : true,
          }))
        : [],
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };
  }, []);

  // Helper function to fetch all packages from the API
  const fetchAllPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSTIPackages();

      // Extract the data array from the response
      const packagesArray = response.data || [];

      // Map backend fields to frontend expected structure
      const mappedPackages = Array.isArray(packagesArray)
        ? packagesArray.map(mapBackendPackageToFrontend)
        : [];

      setPackages(mappedPackages);
      return { success: true, data: mappedPackages };
    } catch (err) {
      console.error('Error fetching STI packages:', err);
      setError(
        'Không thể tải dữ liệu gói STI: ' +
          (err.message || 'Lỗi không xác định')
      );
      setTimeout(() => setError(null), 5000);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPackages, setError, mapBackendPackageToFrontend]);
  // Load packages when the component mounts
  useEffect(() => {
    const loadPackages = async () => {
      console.log('Initial component load - fetching packages');
      const result = await fetchAllPackages();
      console.log('Initial load result:', result);
      if (result.success) {
        setSuccess('Đã tải dữ liệu gói STI thành công');
        setTimeout(() => setSuccess(null), 3000);
      }
    };

    loadPackages();
  }, [fetchAllPackages]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Loading and Alert Messages */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '80px',
              height: '4px',
              backgroundColor: '#1976d2',
              borderRadius: '2px',
            },
          }}
        >
          Quản lý Gói STI
        </Typography>
      </Box>
      {/* Toolbar */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: '#f8f9fa',
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm theo tên gói, mô tả hoặc đối tượng..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: '50%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.12)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0,0,0,0.24)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            px: 3,
            py: 1,
            fontWeight: 'medium',
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          Thêm gói STI
        </Button>
      </Paper>{' '}
      {/* Packages Table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#1976d2',
              }}
            >
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                  width: '15%',
                }}
              >
                Tên gói
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                  width: '20%',
                }}
              >
                Mô tả
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                  width: '15%',
                }}
              >
                Đề xuất cho
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                }}
              >
                Giá
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                }}
              >
                Giảm giá
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                }}
              >
                Số dịch vụ
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  py: 2,
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>{' '}
          <TableBody>
            {' '}
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
                  // Tính % giảm giá dựa trên giá gói và tổng giá dịch vụ
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
                      hover
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
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
                          fontWeight="medium"
                          color="primary"
                        >
                          {formatPrice(pkg.price)}
                        </Typography>
                      </TableCell>{' '}
                      <TableCell sx={{ py: 1.5 }}>
                        {discountInfo.discountPercent > 0 ? (
                          <Chip
                            label={`${discountInfo.discountPercent}%`}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
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
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                          <Tooltip title="Xem chi tiết dịch vụ">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleOpenDetailsDialog(pkg)}
                              sx={{
                                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(33, 150, 243, 0.15)',
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
                          color={pkg.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{
                            fontWeight: pkg.isActive ? 'medium' : 'normal',
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
                              color="primary"
                              onClick={() => handleOpenEditDialog(pkg)}
                              sx={{
                                mr: 1,
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeletePackage(pkg.id)}
                              sx={{
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
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
        />
      </TableContainer>{' '}
      {/* Add/Edit Package Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            py: 2,
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          {currentPackage ? 'Chỉnh sửa gói STI' : 'Thêm gói STI mới'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 3 }}>
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
                      borderRadius: 1.5,
                    },
                  }}
                />
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
                      borderRadius: 1.5,
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
                      borderRadius: 1.5,
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
                      <InputAdornment position="start">₫</InputAdornment>
                    ),
                  }}
                  error={!!errors.price}
                  helperText={errors.price}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 1 }}
              >
                Các dịch vụ bao gồm trong gói{' '}
                <span style={{ color: 'red' }}>*</span>
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                {errors.services ? (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: 'block' }}
                  >
                    {errors.services}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng chọn các dịch vụ sẽ bao gồm trong gói
                  </Typography>
                )}
                {selectedServices.length > 0 && (
                  <Chip
                    label={`${selectedServices.length} dịch vụ được chọn`}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell padding="checkbox" sx={{ py: 1.5 }}>
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

                              // Clear services error when selecting all
                              if (errors.services) {
                                setErrors((prev) => ({
                                  ...prev,
                                  services: '',
                                }));
                              }
                            }
                          }}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, fontWeight: 'bold' }}>
                        Tên dịch vụ
                      </TableCell>
                      <TableCell sx={{ py: 1.5, fontWeight: 'bold' }}>
                        Mô tả
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ py: 1.5, fontWeight: 'bold' }}
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
                            index % 2 === 0 ? 'white' : '#fafafa',
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ py: 1 }}>
                          <Checkbox
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceChange(service.id)}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
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
                            {service.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <Typography variant="body2">
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
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#f0f7ff',
                  border: '1px solid #bbdefb',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tổng giá dịch vụ:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      align="right"
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
                    <Typography variant="subtitle2" color="text.secondary">
                      Giá gói:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="primary"
                      align="right"
                    >
                      {formatPrice(formData.price)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tiết kiệm:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="error"
                      align="right"
                    >
                      {' '}
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
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.isActive}
                label="Trạng thái"
                onChange={(e) => handleInputChange('isActive', e.target.value)}
              >
                <MenuItem value={true}>Đang cung cấp</MenuItem>
                <MenuItem value={false}>Ngừng cung cấp</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              px: 3,
              borderRadius: 2,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePackage}
            sx={{
              px: 3,
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>{' '}
      {/* Dialog hiển thị chi tiết dịch vụ trong gói */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            py: 2,
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          Chi tiết dịch vụ trong gói: {packageDetails?.name}
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          {packageDetails && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: '#f8fcff',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  sx={{ mb: 2 }}
                >
                  Thông tin gói xét nghiệm
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: '#666', marginRight: '8px' }}>
                        Tên gói:
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {packageDetails.name}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: '#666', marginRight: '8px' }}>
                        Giá gói:
                      </span>
                      <span style={{ fontWeight: '600', color: '#1565c0' }}>
                        {formatPrice(packageDetails.price)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: '#666', marginRight: '8px' }}>
                        Đề xuất cho:
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {packageDetails.recommended_for}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: '#666', marginRight: '8px' }}>
                        Số dịch vụ:
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {packageDetails.services.length} dịch vụ
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <span style={{ color: '#666', marginRight: '8px' }}>
                        Mô tả:
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1 }}>
                      {packageDetails.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 2, mt: 4 }}
              >
                Danh sách dịch vụ bao gồm
              </Typography>

              <TableContainer
                component={Paper}
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell
                        sx={{ fontWeight: 'bold', py: 1.5, width: '10%' }}
                      >
                        STT
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', py: 1.5, width: '25%' }}
                      >
                        Tên dịch vụ
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', py: 1.5, width: '45%' }}
                      >
                        Mô tả
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 'bold', py: 1.5, width: '20%' }}
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
                          '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                      >
                        <TableCell sx={{ py: 1.5 }}>{index + 1}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          {service.description}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          {formatPrice(service.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  backgroundColor: '#f5f9ff',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid #bbdefb',
                  mt: 3,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Tổng giá nếu mua lẻ:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
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
                      fontWeight="bold"
                      color="primary"
                    >
                      Giá khi mua gói:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                      align="right"
                    >
                      {formatPrice(packageDetails.price)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="error"
                    >
                      Tiết kiệm khi mua gói:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="error"
                      align="right"
                    >
                      {' '}
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
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleCloseDetailsDialog}
            variant="contained"
            color="primary"
            sx={{
              px: 3,
              borderRadius: 2,
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STIPackageManagementContent;

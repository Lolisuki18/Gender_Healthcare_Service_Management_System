/**
 * STIServiceManagementContent.js
 *
 * Mục đích: Quản lý dịch vụ STI
 * - Hiển thị danh sách dịch vụ STI
 * - Thêm/sửa/xóa dịch vụ
 * - Quản lý thông tin chi tiết dịch vụ
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
  IconButton,
  TextField,
  InputAdornment,
  Switch,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  Tooltip,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getAllSTIServices,
  createSTIService,
  updateSTIService,
  deleteSTIService,
  getSTIServiceById,
} from '../../services/stiService';

const STIServiceManagementContent = () => {
  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  // Component edit dialog state
  const [editComponentDialog, setEditComponentDialog] = useState(false);
  const [editingComponent, setEditingComponent] = useState({
    testName: '',
    unit: '',
    referenceRange: '',
    interpretation: '',
    testType: 'QUANTITATIVE', // Default value
    isActive: true,
    componentId: null,
  });
  const [editingComponentIndex, setEditingComponentIndex] = useState(-1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    isActive: true,
    components: [],
  });

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    components: '',
  });
  // Component state for form
  const [newComponent, setNewComponent] = useState({
    testName: '',
    unit: '',
    referenceRange: '',
    interpretation: '',
    testType: 'QUANTITATIVE', // Default value
  });

  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch services on component mount
  useEffect(() => {
    fetchSTIServices();
  }, []);

  // Fetch STI Services
  const fetchSTIServices = async () => {
    setLoading(true);
    try {
      const response = await getAllSTIServices();
      setServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error(err.message || 'Failed to load STI services');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get active status - handles both is_active (snake_case) and isActive (camelCase)
  const getActiveStatus = (service) => {
    // Check all possible field names from API responses and provide a default
    return service.isActive !== undefined
      ? service.isActive
      : service.is_active !== undefined
        ? service.is_active
        : service.active !== undefined
          ? service.active
          : true;
  };

  // Filter services based on search and status
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    const isActive = getActiveStatus(service);
    if (statusFilter === 'active') matchesStatus = isActive;
    else if (statusFilter === 'inactive') matchesStatus = !isActive;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      name: '',
      price: '',
      components: '',
    };
    let isValid = true;

    // Validate name (required, max length 100)
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
      isValid = false;
    } else if (formData.name.length > 100) {
      newErrors.name = 'Service name must not exceed 100 characters';
      isValid = false;
    }

    // Validate price (required, must be positive)
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price is required and must be greater than 0';
      isValid = false;
    }

    // Validate components (at least one component required)
    if (!formData.components || formData.components.length === 0) {
      newErrors.components = 'At least one test component is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'price' ? (value === '' ? 0 : Number(value)) : value,
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };
  // Handle component input changes
  const handleComponentChange = (field, value) => {
    setNewComponent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Handle component status change
  const handleComponentStatusChange = (index, isActive) => {
    setFormData((prev) => {
      const updatedComponents = [...prev.components];
      updatedComponents[index] = {
        ...updatedComponents[index],
        isActive: isActive,
      };
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };
  // Open edit component dialog
  const handleOpenEditComponentDialog = (component, index) => {
    setEditingComponent({
      ...component,
      testType: component.testType || 'QUANTITATIVE', // Ensure fallback
      componentId: component.componentId || null,
      component_id: component.component_id || component.componentId || null,
    });
    setEditingComponentIndex(index);
    setEditComponentDialog(true);
  };
  // Close edit component dialog
  const handleCloseEditComponentDialog = () => {
    setEditComponentDialog(false);
    setEditingComponent({
      testName: '',
      unit: '',
      referenceRange: '',
      interpretation: '',
      testType: 'QUANTITATIVE', // Default value
      isActive: true,
      componentId: null,
    });
    setEditingComponentIndex(-1);
  };
  // Save edited component
  const handleSaveEditedComponent = () => {
    if (
      !editingComponent.testName ||
      !editingComponent.unit ||
      !editingComponent.referenceRange
    ) {
      toast.warning(
        'Validation Error',
        'Please fill all required component fields'
      );
      return;
    }

    setFormData((prev) => {
      const updatedComponents = [...prev.components];
      // Make sure we preserve both component_id and componentId for consistency
      updatedComponents[editingComponentIndex] = {
        ...editingComponent,
        // Ensure both naming styles are preserved for consistent backend API calls
        componentId:
          editingComponent.componentId || editingComponent.component_id || null,
        component_id:
          editingComponent.component_id || editingComponent.componentId || null,
      };
      return {
        ...prev,
        components: updatedComponents,
      };
    });

    // Show success message
    toast.success('Success', 'Component updated successfully');

    handleCloseEditComponentDialog();
  };

  // Handle edit component input changes
  const handleEditComponentChange = (field, value) => {
    setEditingComponent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add component to the list
  const handleAddComponent = () => {
    // Validate component
    if (
      !newComponent.testName ||
      !newComponent.unit ||
      !newComponent.referenceRange
    ) {
      toast.warning(
        'Validation Error',
        'Please fill all required component fields'
      );
      return;
    }
    const component = {
      ...newComponent,
      isActive: true, // Default to active for new components
    };

    setFormData((prev) => ({
      ...prev,
      components: [...prev.components, component],
    }));

    // Clear component form
    setNewComponent({
      testName: '',
      unit: '',
      referenceRange: '',
      interpretation: '',
      testType: 'QUANTITATIVE', // Default value
    });

    // Clear component error if exists
    if (errors.components) {
      setErrors((prev) => ({
        ...prev,
        components: '',
      }));
    }
  };

  // Remove component from the list
  const handleRemoveComponent = (index) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  };

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setCurrentService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      isActive: true,
      components: [],
    });
    setErrors({
      name: '',
      price: '',
      components: '',
    });
    setOpenDialog(true);
  };
  const handleOpenEditDialog = (service) => {
    setCurrentService(service); // Map BE data structure to form data structure
    const components = service.components.map((comp) => ({
      componentId: comp.componentId, // Store component ID for update
      testName: comp.componentName,
      unit: comp.unit,
      referenceRange: comp.normalRange,
      interpretation: comp.description,
      testType: comp.testType || 'QUANTITATIVE', // Ensure fallback
      // Use consistent helper approach for getting status
      isActive:
        comp.isActive !== undefined
          ? comp.isActive
          : comp.is_active !== undefined
            ? comp.is_active
            : comp.active !== undefined
              ? comp.active
              : true,
    }));

    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      // Use our helper function for consistent status handling
      isActive: getActiveStatus(service),
      components: components,
    });

    setErrors({
      name: '',
      price: '',
      components: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // View service details
  const handleViewDetails = async (serviceId) => {
    try {
      setLoading(true);
      const response = await getSTIServiceById(serviceId);
      if (response.success && response.data) {
        setSelectedService(response.data);
        setDetailDialog(true);
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      toast.error('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog(false);
    setSelectedService(null);
  };

  // Delete service
  const handleDeletePrompt = (serviceId) => {
    setDeleteServiceId(serviceId);
    setDeleteConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmDialog(false);
    setDeleteServiceId(null);
  };

  const handleDeleteService = async () => {
    if (!deleteServiceId) return;

    try {
      setLoading(true);
      const response = await deleteSTIService(deleteServiceId);
      if (response.success) {
        toast.success('Success', 'Service deleted successfully');
        // Refresh services
        fetchSTIServices();
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Error', err.message || 'Failed to delete service');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  }; // Save service (create/update)
  const handleSaveService = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      // Prepare DTO data for backend
      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        // Use camelCase isActive to match Spring Boot DTO field name
        isActive: formData.isActive === false ? false : true,
        components: formData.components.map((comp) => ({
          component_id: comp.componentId || null, // Use componentId if exists for update, otherwise null for new component
          componentId: comp.componentId || null, // Include both formats for compatibility
          testName: comp.testName,
          unit: comp.unit,
          referenceRange: comp.referenceRange,
          interpretation: comp.interpretation || '',
          testType: comp.testType || 'QUANTITATIVE', // Ensure fallback
          isActive: comp.isActive !== false ? true : false, // Pass individual component status
        })),
      };

      let response;
      if (currentService) {
        // Update existing service
        console.log(
          `Updating STI service with data: ${JSON.stringify(serviceData, null, 2)}`
        );
        console.log(
          `Component data being sent: ${JSON.stringify(
            serviceData.components.map((c) => ({
              id: c.componentId,
              testName: c.testName,
            })),
            null,
            2
          )}`
        );
        response = await updateSTIService(currentService.id, serviceData);
        if (response.success) {
          toast.success('Success', 'Service updated successfully');
        }
      } else {
        console.log('Service data begin sent for creation: ', serviceData);
        // Create new service
        response = await createSTIService(serviceData);
        if (response.success) {
          toast.success('Success', 'Service created successfully');
        } else {
          toast.error('Error', 'Service creation failed: ' + response.message);
        }
      }

      // Refresh services
      fetchSTIServices();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving service:', err);
      toast.error('Error', err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  // Format date
  const formatDate = (dateArray) => {
    // Check if dateArray is an array (from API) or a string
    if (Array.isArray(dateArray)) {
      // Format: [year, month, day, hour, minute, second, nanosecond]
      const [year, month, day, hour, minute, second] = dateArray;
      // Month is 0-based in JavaScript Date, but 1-based in the array from API
      const date = new Date(year, month - 1, day, hour, minute, second);
      return date.toLocaleString('vi-VN');
    } else if (dateArray) {
      // Handle string dates if they come in that format
      return new Date(dateArray).toLocaleString('vi-VN');
    }
    return 'N/A';
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        minHeight: '85vh',
      }}
    >
      {/* Header */}
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
          Quản lý dịch vụ xét nghiệm STI
        </Typography>
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
          Thêm dịch vụ mới
        </Button>
      </Box>{' '}
      {/* Search and filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm dịch vụ theo tên hoặc mô tả..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
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
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}{' '}
      {/* Services Table */}
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
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              }}
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
                Thành phần xét nghiệm
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Cập nhật lần cuối
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {loading ? 'Đang tải...' : 'Không tìm thấy dịch vụ nào'}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((service) => (
                  <TableRow
                    key={service.id}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: 'rgba(74, 144, 226, 0.04)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{service.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {service.name}
                    </TableCell>
                    <TableCell>
                      {service.description
                        ? service.description.length > 50
                          ? `${service.description.substring(0, 50)}...`
                          : service.description
                        : 'Không có'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {formatPrice(service.price)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${service.componentCount} thành phần`}
                        size="small"
                        sx={{
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>{' '}
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
                    <TableCell>{formatDate(service.updatedAt)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(service.id)}
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
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(service)}
                            sx={{
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
                            onClick={() => handleDeletePrompt(service.id)}
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
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>{' '}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            '& .MuiTablePagination-selectIcon': { color: '#4A90E2' },
            '& .MuiTablePagination-select': { fontWeight: 500 },
            '& .MuiTablePagination-displayedRows': { fontWeight: 500 },
          }}
        />
      </TableContainer>{' '}
      {/* Add/Edit Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            background: '#f8fafc',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.5rem',
            px: 3,
            py: 2.5,
            textAlign: 'center',
            letterSpacing: '0.5px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          {currentService ? 'Chỉnh sửa dịch vụ STI' : 'Thêm dịch vụ STI mới'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 4, py: 4, background: '#f8fafc' }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Box
                sx={{
                  background: '#fff',
                  borderRadius: 2,
                  boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                  p: 3,
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: '#4A90E2',
                    fontSize: '1.1rem',
                    borderLeft: '4px solid #1ABC9C',
                    paddingLeft: 1.5,
                    marginBottom: 2,
                  }}
                >
                  Thông tin cơ bản
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Tên dịch vụ *"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          background: '#f6fafd',
                          fontWeight: 500,
                          fontSize: '1.05rem',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4A90E2',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1ABC9C',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1ABC9C',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Giá (VND) *"
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange('price', e.target.value)
                      }
                      error={!!errors.price}
                      helperText={errors.price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₫</InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          background: '#f6fafd',
                          fontWeight: 500,
                          fontSize: '1.05rem',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4A90E2',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1ABC9C',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1ABC9C',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        value={formData.isActive}
                        label="Trạng thái"
                        onChange={(e) =>
                          handleInputChange('isActive', e.target.value)
                        }
                        sx={{
                          borderRadius: '10px',
                          background: '#f6fafd',
                          fontWeight: 500,
                          fontSize: '1.05rem',
                        }}
                      >
                        <MenuItem value={true}>Đang hoạt động</MenuItem>
                        <MenuItem value={false}>Ngừng hoạt động</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item size={12}>
                    <TextField
                      fullWidth
                      label="Mô tả"
                      multiline
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          background: '#f6fafd',
                          fontWeight: 500,
                          fontSize: '1.05rem',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4A90E2',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1ABC9C',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1ABC9C',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* Components Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  background: '#fff',
                  borderRadius: 2,
                  boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                  p: 3,
                }}
              >
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: '#4A90E2',
                    fontSize: '1.1rem',
                    borderLeft: '4px solid #1ABC9C',
                    paddingLeft: 1.5,
                    marginBottom: 2,
                  }}
                >
                  Thành phần xét nghiệm
                </Typography>
                {errors.components && (
                  <Typography color="error" variant="caption">
                    {errors.components}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Bạn có thể bật/tắt từng thành phần xét nghiệm độc lập với
                  trạng thái của dịch vụ.
                </Typography>
                {/* Component List */}
                {formData.components.length > 0 && (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ borderRadius: 2, mt: 2 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            background:
                              'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          }}
                        >
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                            Tên xét nghiệm
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                            Đơn vị
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                            Khoảng tham chiếu
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                            Mô tả
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: 'white', fontWeight: 700 }}
                          >
                            Trạng thái / Hành động
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.components.map((component, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              '&:hover': {
                                background: 'rgba(74,144,226,0.07)',
                              },
                            }}
                          >
                            <TableCell>{component.testName}</TableCell>
                            <TableCell>{component.unit}</TableCell>
                            <TableCell>{component.referenceRange}</TableCell>
                            <TableCell>
                              {component.interpretation || 'Không có'}
                            </TableCell>
                            <TableCell align="center">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <Box display="flex" alignItems="center">
                                  <Typography
                                    variant="caption"
                                    sx={{ mr: 0.5 }}
                                  >
                                    {component.isActive !== false
                                      ? 'Đang hoạt động'
                                      : 'Ngừng hoạt động'}
                                  </Typography>
                                  <Switch
                                    checked={component.isActive !== false}
                                    onChange={(e) =>
                                      handleComponentStatusChange(
                                        index,
                                        e.target.checked
                                      )
                                    }
                                    size="small"
                                    color="success"
                                  />
                                </Box>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleOpenEditComponentDialog(
                                      component,
                                      index
                                    )
                                  }
                                  sx={{ color: '#4A90E2' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveComponent(index)}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {/* Add New Component */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background:
                      'linear-gradient(to right bottom, rgba(74, 144, 226, 0.05), rgba(26, 188, 156, 0.05))',
                    borderColor: 'rgba(26, 188, 156, 0.2)',
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 700, color: '#1ABC9C', mb: 2 }}
                  >
                    Thêm thành phần xét nghiệm
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={12} xs={12} sm={4} md={3}>
                      <TextField
                        label="Tên thành phần"
                        value={newComponent.testName}
                        onChange={(e) =>
                          handleComponentChange('testName', e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            background: '#f6fafd',
                            fontWeight: 500,
                            fontSize: '1.05rem',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item size={4} xs={12} sm={4} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Loại xét nghiệm</InputLabel>
                        <Select
                          value={newComponent.testType}
                          label="Loại xét nghiệm"
                          onChange={(e) =>
                            handleComponentChange('testType', e.target.value)
                          }
                          sx={{
                            borderRadius: '10px',
                            background: '#f6fafd',
                            fontWeight: 500,
                            fontSize: '1.05rem',
                          }}
                        >
                          <MenuItem value="QUANTITATIVE">
                            Định lượng (Số)
                          </MenuItem>
                          <MenuItem value="BINARY">
                            Định tính (Âm/Dương)
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item size={4} xs={12} sm={4} md={2}>
                      <TextField
                        label="Đơn vị"
                        value={newComponent.unit}
                        onChange={(e) =>
                          handleComponentChange('unit', e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            background: '#f6fafd',
                            fontWeight: 500,
                            fontSize: '1.05rem',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Khoảng tham chiếu"
                        value={newComponent.referenceRange}
                        onChange={(e) =>
                          handleComponentChange(
                            'referenceRange',
                            e.target.value
                          )
                        }
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            background: '#f6fafd',
                            fontWeight: 500,
                            fontSize: '1.05rem',
                          },
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 2,
                        pr: 0,
                      }}
                    >
                      <Button
                        onClick={handleAddComponent}
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        sx={{
                          borderRadius: '24px',
                          fontWeight: 700,
                          fontSize: '1rem',
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          color: '#fff',
                          px: 3,
                          py: 1,
                          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                          minWidth: '120px',
                          '&:hover': {
                            background:
                              'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                          },
                        }}
                      >
                        Thêm
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            py: 3,
            background: '#f8fafc',
            borderRadius: '0 0 12px 12px',
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: '#4A90E2',
              fontWeight: 700,
              borderRadius: '24px',
              fontSize: '1.1rem',
              px: 4,
              py: 1.2,
              letterSpacing: '0.5px',
              background: 'white',
              border: '2px solid #4A90E2',
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.08)',
                border: '2px solid #1ABC9C',
              },
            }}
          >
            HỦY
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveService}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              px: 4,
              py: 1.2,
              borderRadius: '24px',
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              '&:hover': {
                background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'LƯU'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* View Service Details Dialog */}{' '}
      <Dialog
        open={detailDialog}
        onClose={handleCloseDetailDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        {selectedService && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.5rem',
                px: 3,
                py: 2,
                textAlign: 'center',
                letterSpacing: '0.5px',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(90deg, #4A90E2, #1ABC9C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                Chi tiết dịch vụ: {selectedService.name}
              </span>
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                px: 3,
                py: 3,
                background: '#f8fafc',
                borderRadius: '0 0 12px 12px',
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: '#4A90E2', mb: 0.5 }}
                    >
                      Mã dịch vụ
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedService.id}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: '#4A90E2', mb: 0.5 }}
                    >
                      Giá
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatPrice(selectedService.price)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: '#4A90E2', mb: 0.5 }}
                    >
                      Mô tả
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 400,
                        color: '#222',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {selectedService.description || 'Không có mô tả'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: '#4A90E2', mr: 1 }}
                    >
                      Trạng thái
                    </Typography>
                    <Chip
                      label={
                        getActiveStatus(selectedService)
                          ? 'Đang hoạt động'
                          : 'Ngừng hoạt động'
                      }
                      color={
                        getActiveStatus(selectedService) ? 'success' : 'error'
                      }
                      size="medium"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(74,144,226,0.07)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: '#4A90E2', mb: 0.5 }}
                    >
                      Cập nhật lần cuối
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(selectedService.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>
                {/* Components */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: 3,
                      mb: 2,
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.15rem',
                    }}
                  >
                    Thành phần xét nghiệm ({selectedService.componentCount})
                  </Typography>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      mt: 1,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            background:
                              'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          }}
                        >
                          <TableCell
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            Tên thành phần
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            Đơn vị
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            Khoảng tham chiếu
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            Mô tả
                          </TableCell>
                          <TableCell
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            Trạng thái
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedService.components.map((component) => (
                          <TableRow
                            key={component.componentId}
                            sx={{
                              '&:hover': {
                                background: 'rgba(74,144,226,0.07)',
                              },
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>
                              {component.componentName}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {component.unit}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {component.normalRange}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 400 }}>
                              {component.description || 'Không có'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  (
                                    component.isActive !== undefined
                                      ? component.isActive
                                      : component.is_active !== undefined
                                        ? component.is_active
                                        : component.active !== undefined
                                          ? component.active
                                          : true
                                  )
                                    ? 'Đang hoạt động'
                                    : 'Ngừng hoạt động'
                                }
                                size="small"
                                sx={{
                                  backgroundColor: (
                                    component.isActive !== undefined
                                      ? component.isActive
                                      : component.is_active !== undefined
                                        ? component.is_active
                                        : component.active !== undefined
                                          ? component.active
                                          : true
                                  )
                                    ? '#E3FCF7'
                                    : '#FEE2E2',
                                  color: (
                                    component.isActive !== undefined
                                      ? component.isActive
                                      : component.is_active !== undefined
                                        ? component.is_active
                                        : component.active !== undefined
                                          ? component.active
                                          : true
                                  )
                                    ? '#0F9B8E'
                                    : '#DC2626',
                                  fontWeight: 700,
                                  border: (
                                    component.isActive !== undefined
                                      ? component.isActive
                                      : component.is_active !== undefined
                                        ? component.is_active
                                        : component.active !== undefined
                                          ? component.active
                                          : true
                                  )
                                    ? '1px solid #1ABC9C'
                                    : '1px solid #DC2626',
                                  fontSize: '0.95rem',
                                  borderRadius: 2,
                                  px: 2,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                px: 3,
                py: 2,
                background: '#f8fafc',
                borderRadius: '0 0 12px 12px',
              }}
            >
              <Button
                onClick={handleCloseDetailDialog}
                sx={{
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  px: 4,
                  py: 1.2,
                  borderRadius: '24px',
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
                  },
                }}
              >
                ĐÓNG
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {/* Edit Component Dialog */}
      <Dialog
        open={editComponentDialog}
        onClose={handleCloseEditComponentDialog}
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
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          Chỉnh sửa thành phần:{' '}
          {editingComponent?.testName || 'Thành phần xét nghiệm'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 4, py: 4, background: '#f8fafc' }}>
          {editingComponent && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Chỉnh sửa thông tin thành phần bên dưới. Các trường có dấu *
                  là bắt buộc.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên thành phần *"
                  required
                  value={editingComponent.testName}
                  onChange={(e) =>
                    handleEditComponentChange('testName', e.target.value)
                  }
                  error={!editingComponent.testName}
                  helperText={
                    !editingComponent.testName
                      ? 'Tên thành phần là bắt buộc'
                      : ''
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      background: '#f6fafd',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Đơn vị *"
                  required
                  value={editingComponent.unit}
                  onChange={(e) =>
                    handleEditComponentChange('unit', e.target.value)
                  }
                  error={!editingComponent.unit}
                  helperText={
                    !editingComponent.unit ? 'Đơn vị là bắt buộc' : ''
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      background: '#f6fafd',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Khoảng tham chiếu *"
                  required
                  value={editingComponent.referenceRange}
                  onChange={(e) =>
                    handleEditComponentChange('referenceRange', e.target.value)
                  }
                  error={!editingComponent.referenceRange}
                  helperText={
                    !editingComponent.referenceRange
                      ? 'Khoảng tham chiếu là bắt buộc'
                      : ''
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      background: '#f6fafd',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={editingComponent.interpretation || ''}
                  onChange={(e) =>
                    handleEditComponentChange('interpretation', e.target.value)
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      background: '#f6fafd',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingComponent.isActive !== false}
                      onChange={(e) =>
                        handleEditComponentChange('isActive', e.target.checked)
                      }
                      color="success"
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color:
                          editingComponent.isActive !== false
                            ? '#1ABC9C'
                            : '#E53E3E',
                      }}
                    >
                      Trạng thái:{' '}
                      {editingComponent.isActive !== false
                        ? 'Đang hoạt động'
                        : 'Ngừng hoạt động'}
                    </Typography>
                  }
                  sx={{ mt: 1, ml: 1 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            py: 3,
            background: '#f8fafc',
            borderRadius: '0 0 12px 12px',
          }}
        >
          <Button
            onClick={handleCloseEditComponentDialog}
            sx={{
              color: '#4A90E2',
              fontWeight: 700,
              borderRadius: '24px',
              fontSize: '1.1rem',
              px: 4,
              py: 1.2,
              letterSpacing: '0.5px',
              background: 'white',
              border: '2px solid #4A90E2',
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.08)',
                border: '2px solid #1ABC9C',
              },
            }}
          >
            HỦY
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEditedComponent}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              px: 4,
              py: 1.2,
              borderRadius: '24px',
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              '&:hover': {
                background: 'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
              },
            }}
          >
            LƯU THAY ĐỔI
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}{' '}
      <Dialog
        open={deleteConfirmDialog}
        onClose={handleCloseDeleteDialog}
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
            background: 'linear-gradient(45deg, #E53E3E, #ED8936)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
            px: 3,
            py: 2,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Typography sx={{ fontSize: '1rem' }}>
            Are you sure you want to delete this service? This action will mark
            the service as inactive.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: '#4A90E2',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteService}
            disabled={loading}
            sx={{
              backgroundColor: '#E53E3E',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(229, 62, 62, 0.25)',
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#C53030',
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

export default STIServiceManagementContent;

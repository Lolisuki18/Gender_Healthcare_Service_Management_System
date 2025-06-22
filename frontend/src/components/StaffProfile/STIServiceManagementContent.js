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

import {
  getAllSTIServices,
  createSTIService,
  updateSTIService,
  deleteSTIService,
  getSTIServiceById,
} from '../../services/stiService';
import { id } from 'date-fns/locale';

const STIServiceManagementContent = () => {
  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    isActive: true,
    componentId: null,
  });
  const [editingComponentIndex, setEditingComponentIndex] = useState(-1);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchSTIServices();
  }, []);

  // Fetch STI Services
  const fetchSTIServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllSTIServices();
      setServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services');
      setSnackbar({
        open: true,
        message: 'Failed to load STI services',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter services based on search
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      componentId: component.componentId || null, // Ensure we maintain the componentId
      component_id: component.component_id || component.componentId || null, // Ensure backward compatibility with both naming styles
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
      setSnackbar({
        open: true,
        message: 'Please fill all required component fields',
        severity: 'warning',
      });
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
    setSnackbar({
      open: true,
      message: 'Component updated successfully',
      severity: 'success',
    });

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
      setSnackbar({
        open: true,
        message: 'Please fill all required component fields',
        severity: 'warning',
      });
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
      setSnackbar({
        open: true,
        message: 'Failed to load service details',
        severity: 'error',
      });
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
        setSnackbar({
          open: true,
          message: 'Service deleted successfully',
          severity: 'success',
        });
        // Refresh services
        fetchSTIServices();
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete service',
        severity: 'error',
      });
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
          setSnackbar({
            open: true,
            message: 'Service updated successfully',
            severity: 'success',
          });
        }
      } else {
        // Create new service
        response = await createSTIService(serviceData);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Service created successfully',
            severity: 'success',
          });
        }
      }

      // Refresh services
      fetchSTIServices();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving service:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save service',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
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
          STI Service Management
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
          Add New Service
        </Button>
      </Box>{' '}
      {/* Search and filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search services by name or description..."
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
      </Box>
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Description
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Price
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Components
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Last Updated
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {loading ? 'Loading...' : 'No services found'}
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
                        : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {formatPrice(service.price)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${service.componentCount} components`}
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
                        label={getActiveStatus(service) ? 'Active' : 'Inactive'}
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
                        <Tooltip title="View Details">
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
                        <Tooltip title="Edit">
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
                        <Tooltip title="Delete">
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
          {currentService ? 'Edit STI Service' : 'Add New STI Service'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}{' '}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#4A90E2',
                  fontSize: '1.1rem',
                  borderLeft: '4px solid #1ABC9C',
                  paddingLeft: 1.5,
                  marginBottom: 2,
                }}
              >
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Service Name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
                label="Price (VND)"
                type="number"
                required
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </Grid>
            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.isActive}
                  label="Status"
                  onChange={(e) =>
                    handleInputChange('isActive', e.target.value)
                  }
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Components Section */}
            <Grid item xs={12}>
              {' '}
              <Divider sx={{ my: 3 }} />{' '}
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#4A90E2',
                  fontSize: '1.1rem',
                  borderLeft: '4px solid #1ABC9C',
                  paddingLeft: 1.5,
                  marginBottom: 2,
                }}
              >
                Test Components
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
                You can enable or disable individual components independently of
                the overall service status.
              </Typography>
            </Grid>
            {/* Component List */}
            {formData.components.length > 0 && (
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    {' '}
                    <TableHead>
                      <TableRow>
                        <TableCell>Test Name</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Reference Range</TableCell>
                        <TableCell>Interpretation</TableCell>
                        <TableCell align="center">Status / Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {' '}
                      {formData.components.map((component, index) => (
                        <TableRow key={index}>
                          <TableCell>{component.testName}</TableCell>
                          <TableCell>{component.unit}</TableCell>
                          <TableCell>{component.referenceRange}</TableCell>
                          <TableCell>
                            {component.interpretation || 'N/A'}
                          </TableCell>{' '}
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Box display="flex" alignItems="center">
                                <Typography variant="caption" sx={{ mr: 0.5 }}>
                                  {component.isActive !== false
                                    ? 'Active'
                                    : 'Inactive'}
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
              </Grid>
            )}
            {/* Add New Component */}
            <Grid item xs={12}>
              {' '}
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background:
                    'linear-gradient(to right bottom, rgba(74, 144, 226, 0.05), rgba(26, 188, 156, 0.05))',
                  borderColor: 'rgba(26, 188, 156, 0.2)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: '#1ABC9C',
                    mb: 2,
                  }}
                >
                  Add New Component
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Test Name"
                      required
                      size="small"
                      value={newComponent.testName}
                      onChange={(e) =>
                        handleComponentChange('testName', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Unit"
                      required
                      size="small"
                      value={newComponent.unit}
                      onChange={(e) =>
                        handleComponentChange('unit', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Reference Range"
                      required
                      size="small"
                      value={newComponent.referenceRange}
                      onChange={(e) =>
                        handleComponentChange('referenceRange', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Interpretation"
                      size="small"
                      value={newComponent.interpretation}
                      onChange={(e) =>
                        handleComponentChange('interpretation', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {' '}
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      onClick={handleAddComponent}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                        color: '#fff',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                        borderRadius: '6px',
                        '&:hover': {
                          background:
                            'linear-gradient(45deg, #3A80D2, #0AAC8C)',
                          boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
                        },
                      }}
                    >
                      Add Component
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>{' '}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDialog}
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
            onClick={handleSaveService}
            disabled={loading}
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
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Save'
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
                fontWeight: 600,
                fontSize: '1.25rem',
                px: 3,
                py: 2,
              }}
            >
              Service Details: {selectedService.name}
            </DialogTitle>
            <DialogContent dividers sx={{ px: 3, py: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Service ID</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedService.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Price</Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatPrice(selectedService.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedService.description || 'No description provided'}
                  </Typography>
                </Grid>{' '}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={
                      getActiveStatus(selectedService) ? 'Active' : 'Inactive'
                    }
                    color={
                      getActiveStatus(selectedService) ? 'success' : 'error'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Last Updated</Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedService.updatedAt)}
                  </Typography>
                </Grid>
                {/* Components */}{' '}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: 3,
                      mb: 2,
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Test Components ({selectedService.componentCount})
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
                    {' '}
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            background:
                              'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          }}
                        >
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Component Name
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Unit
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Normal Range
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Description
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedService.components.map((component) => (
                          <TableRow key={component.componentId}>
                            <TableCell>{component.componentName}</TableCell>
                            <TableCell>{component.unit}</TableCell>
                            <TableCell>{component.normalRange}</TableCell>
                            <TableCell>
                              {component.description || 'N/A'}{' '}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  // Use our helper approach for consistent status handling
                                  (
                                    component.isActive !== undefined
                                      ? component.isActive
                                      : component.is_active !== undefined
                                        ? component.is_active
                                        : component.active !== undefined
                                          ? component.active
                                          : true
                                  )
                                    ? 'Active'
                                    : 'Inactive'
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
                                  fontWeight: 600,
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
                                  fontSize: '0.75rem',
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
            </DialogContent>{' '}
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={handleCloseDetailDialog}
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
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>{' '}
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
        {' '}
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
          Edit Component: {editingComponent?.testName || 'Test Component'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 3 }}>
          {editingComponent && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Edit the component details below. Fields marked with an
                  asterisk (*) are required.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {' '}
                <TextField
                  fullWidth
                  label="Test Name *"
                  required
                  value={editingComponent.testName}
                  onChange={(e) =>
                    handleEditComponentChange('testName', e.target.value)
                  }
                  error={!editingComponent.testName}
                  helperText={
                    !editingComponent.testName ? 'Test name is required' : ''
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {' '}
                <TextField
                  fullWidth
                  label="Unit *"
                  required
                  value={editingComponent.unit}
                  onChange={(e) =>
                    handleEditComponentChange('unit', e.target.value)
                  }
                  error={!editingComponent.unit}
                  helperText={!editingComponent.unit ? 'Unit is required' : ''}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {' '}
                <TextField
                  fullWidth
                  label="Reference Range *"
                  required
                  value={editingComponent.referenceRange}
                  onChange={(e) =>
                    handleEditComponentChange('referenceRange', e.target.value)
                  }
                  error={!editingComponent.referenceRange}
                  helperText={
                    !editingComponent.referenceRange
                      ? 'Reference range is required'
                      : ''
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interpretation"
                  multiline
                  rows={3}
                  value={editingComponent.interpretation || ''}
                  onChange={(e) =>
                    handleEditComponentChange('interpretation', e.target.value)
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
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
                  label={`Status: ${editingComponent.isActive !== false ? 'Active' : 'Inactive'}`}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseEditComponentDialog}
            sx={{
              color: '#4A90E2',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.08)',
              },
            }}
          >
            Cancel
          </Button>{' '}
          <Button
            variant="contained"
            onClick={handleSaveEditedComponent}
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
            Save Changes
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
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default STIServiceManagementContent;

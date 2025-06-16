/**
 * STIServiceManagementContent.js
 *
 * Mục đích: Quản lý dịch vụ STI
 * - Hiển thị danh sách dịch vụ STI
 * - Thêm/sửa/xóa dịch vụ
 * - Quản lý thông tin chi tiết dịch vụ
 */

import React, { useState } from "react";
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
  Divider,
  Grid,
  Avatar,
  Tooltip,
  alpha,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  MedicalServices as MedicalServicesIcon,
  AttachMoney as AttachMoneyIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const STIServiceManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls theo STIServiceResponse
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Xét nghiệm HIV",
      description: "Phát hiện kháng thể HIV trong máu",
      price: 450000,
      isActive: true,
      createdAt: "2025-04-10T08:00:00",
      updatedAt: "2025-05-15T14:30:00",
      componentCount: 2,
      components: [
        {
          componentId: 1,
          componentName: "HIV Ab/Ag",
          unit: "Index",
          normalRange: "<1.0",
          description: "Xét nghiệm kháng thể và kháng nguyên",
        },
        {
          componentId: 2,
          componentName: "Western Blot",
          unit: "N/A",
          normalRange: "Negative",
          description: "Xét nghiệm xác nhận",
        },
      ],
    },
    {
      id: 2,
      name: "Xét nghiệm Giang mai",
      description: "Kiểm tra vi khuẩn Treponema pallidum",
      price: 350000,
      isActive: true,
      createdAt: "2025-03-20T09:15:00",
      updatedAt: "2025-05-10T11:45:00",
      componentCount: 2,
      components: [
        {
          componentId: 3,
          componentName: "RPR",
          unit: "Titer",
          normalRange: "<1:8",
          description: "Rapid Plasma Reagin",
        },
        {
          componentId: 4,
          componentName: "TPHA",
          unit: "Titer",
          normalRange: "<1:80",
          description: "Treponema Pallidum Hemagglutination Assay",
        },
      ],
    },
    {
      id: 3,
      name: "Xét nghiệm Lậu",
      description: "Xác định vi khuẩn lậu Neisseria gonorrhoeae",
      price: 450000,
      isActive: false,
      createdAt: "2025-04-05T10:20:00",
      updatedAt: "2025-06-01T09:30:00",
      componentCount: 1,
      components: [
        {
          componentId: 5,
          componentName: "PCR Neisseria gonorrhoeae",
          unit: "N/A",
          normalRange: "Negative",
          description: "Phát hiện DNA vi khuẩn",
        },
      ],
    },
  ]);
  // Mock data for service test components
  const [availableComponents, setAvailableComponents] = useState([
    {
      componentId: 1,
      componentName: "HIV Ab/Ag",
      unit: "Index",
      normalRange: "<1.0",
      description: "Xét nghiệm kháng thể và kháng nguyên",
    },
    {
      componentId: 2,
      componentName: "Western Blot",
      unit: "N/A",
      normalRange: "Negative",
      description: "Xét nghiệm xác nhận",
    },
    {
      componentId: 3,
      componentName: "RPR",
      unit: "Titer",
      normalRange: "<1:8",
      description: "Rapid Plasma Reagin",
    },
    {
      componentId: 4,
      componentName: "TPHA",
      unit: "Titer",
      normalRange: "<1:80",
      description: "Treponema Pallidum Hemagglutination Assay",
    },
    {
      componentId: 5,
      componentName: "PCR Neisseria gonorrhoeae",
      unit: "N/A",
      normalRange: "Negative",
      description: "Phát hiện DNA vi khuẩn",
    },
    {
      componentId: 6,
      componentName: "PCR Chlamydia",
      unit: "N/A",
      normalRange: "Negative",
      description: "Phát hiện DNA vi khuẩn Chlamydia trachomatis",
    },
    {
      componentId: 7,
      componentName: "PCR HPV",
      unit: "N/A",
      normalRange: "Negative",
      description: "Phát hiện DNA virus HPV",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    components: [],
  });

  // Validation errors
  const [errors, setErrors] = useState({
    name: "",
    price: "",
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
  const validateForm = () => {
    const newErrors = {
      name: "",
      price: "",
    };
    let isValid = true;

    // Validate name (required, max length 100)
    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
      isValid = false;
    } else if (formData.name.length > 100) {
      newErrors.name = "Service name must not exceed 100 characters";
      isValid = false;
    }

    // Validate price (required, must be positive)
    if (formData.price <= 0) {
      newErrors.price = "Price is required and must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
        [field]: "",
      }));
    }
  };

  const handleOpenAddDialog = () => {
    setCurrentService(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      isActive: true,
      components: [],
    });
    setErrors({
      name: "",
      price: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price,
      isActive: service.isActive,
      components: service.components.map((comp) => ({
        componentId: comp.componentId,
        componentName: comp.componentName,
        unit: comp.unit,
        normalRange: comp.normalRange,
        description: comp.description,
      })),
    });
    setErrors({
      name: "",
      price: "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveService = () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare DTO data for backend
    const serviceDTO = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      isActive: formData.isActive,
      components: formData.components.map((comp) => ({
        componentId: comp.componentId,
        componentName: comp.componentName,
        unit: comp.unit,
        normalRange: comp.normalRange,
        description: comp.description,
      })),
    };

    // In production, this would be sent to API
    console.log("Service DTO to send to backend:", serviceDTO);

    // For now, update frontend state
    if (currentService) {
      // Update existing service
      const updatedService = {
        ...currentService,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString(),
        componentCount: formData.components.length,
        components: formData.components,
      };
      setServices(
        services.map((s) => (s.id === currentService.id ? updatedService : s))
      );
    } else {
      // Add new service
      const newService = {
        id: Date.now(), // temporary ID
        name: formData.name,
        description: formData.description,
        price: formData.price,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        componentCount: formData.components.length,
        components: formData.components,
      };
      setServices([...services, newService]);
    }

    setOpenDialog(false);
  };

  const handleDeleteService = (id) => {
    // Logic xóa dịch vụ
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      setServices(services.filter((service) => service.id !== id));
    }
  };
  // Filter services dựa trên searchTerm
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  // State for viewing components dialog
  const [viewingComponentsDialog, setViewingComponentsDialog] = useState(false);
  const [selectedServiceForComponents, setSelectedServiceForComponents] =
    useState(null);

  const handleViewComponents = (service) => {
    setSelectedServiceForComponents(service);
    setViewingComponentsDialog(true);
  };

  const handleCloseComponentsDialog = () => {
    setViewingComponentsDialog(false);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#f8fafc",
          borderLeft: "6px solid #1976d2",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mb: 1,
          }}
        >
          Quản lý dịch vụ STI
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#4A5568",
            fontSize: "0.95rem",
          }}
        >
          Thêm, chỉnh sửa và quản lý các dịch vụ xét nghiệm STI
        </Typography>
      </Paper>
      {/* Toolbar */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Tìm kiếm dịch vụ theo tên, mô tả..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              width: { xs: "100%", md: "45%", minWidth: "280px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease-in-out",
                "& fieldset": {
                  borderColor: "rgba(0,0,0,0.12)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  "& fieldset": {
                    borderColor: "primary.main",
                  },
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
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.25)",
              px: 3,
              py: 1,
              fontWeight: "medium",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(25, 118, 210, 0.35)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Thêm dịch vụ
          </Button>
        </Box>
      </Paper>{" "}
      {/* Services Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          mb: 4,
          overflowX: "auto",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
              }}
            >
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Tên dịch vụ
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Mô tả
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Giá
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Thành phần xét nghiệm
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Ngày cập nhật
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "none",
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service, index) => (
                <TableRow
                  key={service.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f9ff",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(33, 150, 243, 0.08)",
                    },
                    "& td": {
                      borderColor: "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>{service.id}</TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: "medium" }}>
                    {service.name}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>{service.description}</TableCell>
                  <TableCell
                    sx={{ py: 1.5, fontWeight: "medium", color: "#1565c0" }}
                  >
                    {formatPrice(service.price)}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    {service.componentCount > 0 ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewComponents(service)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: "medium",
                          borderColor: "rgba(25, 118, 210, 0.5)",
                          fontSize: "0.75rem",
                          py: 0.5,
                        }}
                      >
                        {service.componentCount} thành phần
                      </Button>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        Không có thành phần
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    {new Date(service.updatedAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={
                        service.isActive ? "Đang cung cấp" : "Ngừng cung cấp"
                      }
                      color={service.isActive ? "success" : "default"}
                      size="small"
                      sx={{
                        fontWeight: "medium",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenEditDialog(service)}
                      sx={{
                        mr: 1,
                        minWidth: "auto",
                        borderRadius: 1.5,
                        px: 1.25,
                        py: 0.5,
                      }}
                      startIcon={<EditIcon fontSize="small" />}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteService(service.id)}
                      sx={{
                        minWidth: "auto",
                        borderRadius: 1.5,
                        px: 1.25,
                        py: 0.5,
                      }}
                      startIcon={<DeleteIcon fontSize="small" />}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}{" "}
          </TableBody>
          {filteredServices.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      mb: 2,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 28, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Không tìm thấy dịch vụ
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ maxWidth: 400 }}
                  >
                    Không tìm thấy dịch vụ nào phù hợp với tiêu chí tìm kiếm.
                    Vui lòng thử lại với từ khóa khác.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
          sx={{
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
                color: "text.secondary",
              },
            "& .MuiTablePagination-select": {
              fontSize: "0.875rem",
            },
          }}
        />
      </TableContainer>{" "}
      {/* Add/Edit Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
          }}
        >
          {currentService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tên dịch vụ"
              margin="normal"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              helperText={
                errors.name ? errors.name : `${formData.name.length}/100 ký tự`
              }
              inputProps={{ maxLength: 100 }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
                "& .MuiFormLabel-asterisk": {
                  color: "error.main",
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              margin="normal"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Giá dịch vụ (VNĐ)"
              margin="normal"
              type="number"
              value={formData.price}
              onChange={(e) =>
                handleInputChange("price", Number(e.target.value))
              }
              error={!!errors.price}
              helperText={errors.price}
              required
              InputProps={{
                inputProps: { min: 0 },
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
                "& .MuiFormLabel-asterisk": {
                  color: "error.main",
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                },
              }}
            >
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.isActive}
                label="Trạng thái"
                onChange={(e) => handleInputChange("isActive", e.target.value)}
              >
                <MenuItem value={true}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        mr: 1,
                      }}
                    />
                    Đang cung cấp
                  </Box>
                </MenuItem>
                <MenuItem value={false}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "text.disabled",
                        mr: 1,
                      }}
                    />
                    Ngừng cung cấp
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Thành phần xét nghiệm
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Các thành phần xét nghiệm của dịch vụ này. Thêm các thành phần để
              theo dõi các chỉ số cụ thể.
            </Typography>

            {formData.components.length > 0 ? (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên thành phần</TableCell>
                      <TableCell>Đơn vị</TableCell>
                      <TableCell>Phạm vi bình thường</TableCell>
                      <TableCell>Mô tả</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>{" "}
                  <TableBody>
                    {formData.components.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            value={component.componentName || ""}
                            onChange={(e) => {
                              const newComponents = [...formData.components];
                              newComponents[index].componentName =
                                e.target.value;
                              handleInputChange("components", newComponents);
                            }}
                            placeholder="Tên thành phần"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            value={component.unit || ""}
                            onChange={(e) => {
                              const newComponents = [...formData.components];
                              newComponents[index].unit = e.target.value;
                              handleInputChange("components", newComponents);
                            }}
                            placeholder="Đơn vị"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            value={component.normalRange || ""}
                            onChange={(e) => {
                              const newComponents = [...formData.components];
                              newComponents[index].normalRange = e.target.value;
                              handleInputChange("components", newComponents);
                            }}
                            placeholder="VD: <200 mg/L"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            value={component.description || ""}
                            onChange={(e) => {
                              const newComponents = [...formData.components];
                              newComponents[index].description = e.target.value;
                              handleInputChange("components", newComponents);
                            }}
                            placeholder="Mô tả ngắn về thành phần"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const newComponents = [...formData.components];
                              newComponents.splice(index, 1);
                              handleInputChange("components", newComponents);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Chưa có thành phần xét nghiệm nào. Hãy thêm thành phần đầu tiên.
              </Typography>
            )}

            <Button
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
              onClick={() => {
                const newComponents = [...formData.components];
                newComponents.push({
                  componentId: Date.now(), // Temporary ID
                  componentName: "",
                  unit: "",
                  normalRange: "",
                  description: "",
                });
                handleInputChange("components", newComponents);
              }}
            >
              + Thêm thành phần xét nghiệm
            </Button>
          </Box>{" "}
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveService}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: "medium",
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.25)",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(25, 118, 210, 0.35)",
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>{" "}
      {/* View Components Dialog */}
      <Dialog
        open={viewingComponentsDialog}
        onClose={handleCloseComponentsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
          }}
        >
          Thành phần xét nghiệm - {selectedServiceForComponents?.name}
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          {selectedServiceForComponents?.components &&
          selectedServiceForComponents.components.length > 0 ? (
            <TableContainer
              sx={{
                mt: 1,
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              {" "}
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "primary.light",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "primary.dark",
                        py: 1.5,
                      }}
                    >
                      Tên thành phần
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "primary.dark",
                        py: 1.5,
                      }}
                    >
                      Đơn vị
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "primary.dark",
                        py: 1.5,
                      }}
                    >
                      Phạm vi bình thường
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "primary.dark",
                        py: 1.5,
                      }}
                    >
                      Mô tả
                    </TableCell>
                  </TableRow>
                </TableHead>{" "}
                <TableBody>
                  {selectedServiceForComponents?.components.map(
                    (component, index) => (
                      <TableRow
                        key={component.componentId}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f5f9ff",
                          transition: "background-color 0.2s",
                          "&:hover": {
                            backgroundColor: "rgba(33, 150, 243, 0.08)",
                          },
                          "& td": {
                            borderColor: "rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {component.componentName}
                        </TableCell>
                        <TableCell>{component.unit}</TableCell>
                        <TableCell>{component.normalRange}</TableCell>
                        <TableCell>{component.description}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              Dịch vụ này không có thành phần xét nghiệm nào.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComponentsDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STIServiceManagementContent;

/**
 * STIPackageManagementContent.js
 *
 * Mục đích: Quản lý các gói STI Package
 * - Hiển thị danh sách các gói STI
 * - Thêm/sửa/xóa gói STI
 * - Quản lý thông tin chi tiết gói
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
  Checkbox,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const STIPackageManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Gói sàng lọc STI cơ bản",
      description: "Bao gồm các xét nghiệm STI phổ biến",
      price: 1500000,
      recommended_for: "Người có nguy cơ thấp",
      isActive: true,
      createdAt: "2025-05-10T08:00:00",
      updatedAt: "2025-06-01T14:30:00",
      services: [
        {
          id: 1,
          name: "Xét nghiệm HIV",
          description: "Phát hiện kháng thể HIV trong máu",
          price: 450000,
          isActive: true,
        },
        {
          id: 2,
          name: "Xét nghiệm Giang mai",
          description: "Kiểm tra vi khuẩn Treponema pallidum",
          price: 350000,
          isActive: true,
        },
        {
          id: 3,
          name: "Xét nghiệm Lậu",
          description: "Xác định vi khuẩn lậu",
          price: 450000,
          isActive: true,
        },
      ],
    },
    {
      id: 2,
      name: "Gói sàng lọc STI toàn diện",
      description: "Bao gồm tất cả các xét nghiệm STI",
      price: 3200000,
      recommended_for: "Người có nhiều bạn tình",
      isActive: true,
      createdAt: "2025-04-15T10:20:00",
      updatedAt: "2025-05-20T16:45:00",
      services: [
        {
          id: 1,
          name: "Xét nghiệm HIV",
          description: "Phát hiện kháng thể HIV trong máu",
          price: 450000,
          isActive: true,
        },
        {
          id: 2,
          name: "Xét nghiệm Giang mai",
          description: "Kiểm tra vi khuẩn Treponema pallidum",
          price: 350000,
          isActive: true,
        },
        {
          id: 3,
          name: "Xét nghiệm Lậu",
          description: "Xác định vi khuẩn lậu",
          price: 450000,
          isActive: true,
        },
        {
          id: 4,
          name: "Xét nghiệm Chlamydia",
          description: "Phát hiện vi khuẩn Chlamydia trachomatis",
          price: 550000,
          isActive: true,
        },
        {
          id: 5,
          name: "Xét nghiệm HPV",
          description: "Phát hiện virus Human papillomavirus",
          price: 850000,
          isActive: true,
        },
        {
          id: 6,
          name: "Xét nghiệm Herpes",
          description: "Phát hiện virus Herpes simplex",
          price: 650000,
          isActive: true,
        },
      ],
    },
    {
      id: 3,
      name: "Gói STI theo giới tính",
      description: "Các xét nghiệm STI phù hợp với từng giới tính",
      price: 2000000,
      recommended_for: "Phụ nữ trong độ tuổi sinh sản",
      isActive: false,
      createdAt: "2025-03-20T09:15:00",
      updatedAt: "2025-06-05T11:10:00",
      services: [
        {
          id: 1,
          name: "Xét nghiệm HIV",
          description: "Phát hiện kháng thể HIV trong máu",
          price: 450000,
          isActive: true,
        },
        {
          id: 4,
          name: "Xét nghiệm Chlamydia",
          description: "Phát hiện vi khuẩn Chlamydia trachomatis",
          price: 550000,
          isActive: true,
        },
        {
          id: 5,
          name: "Xét nghiệm HPV",
          description: "Phát hiện virus Human papillomavirus",
          price: 850000,
          isActive: true,
        },
      ],
    },
  ]);

  // Mock data services
  const availableServices = [
    {
      id: 1,
      name: "Xét nghiệm HIV",
      description: "Phát hiện kháng thể HIV trong máu",
      price: 450000,
      isActive: true,
    },
    {
      id: 2,
      name: "Xét nghiệm Giang mai",
      description: "Kiểm tra vi khuẩn Treponema pallidum",
      price: 350000,
      isActive: true,
    },
    {
      id: 3,
      name: "Xét nghiệm Lậu",
      description: "Xác định vi khuẩn lậu",
      price: 450000,
      isActive: true,
    },
    {
      id: 4,
      name: "Xét nghiệm Chlamydia",
      description: "Phát hiện vi khuẩn Chlamydia trachomatis",
      price: 550000,
      isActive: true,
    },
    {
      id: 5,
      name: "Xét nghiệm HPV",
      description: "Phát hiện virus Human papillomavirus",
      price: 850000,
      isActive: true,
    },
    {
      id: 6,
      name: "Xét nghiệm Herpes",
      description: "Phát hiện virus Herpes simplex",
      price: 650000,
      isActive: true,
    },
    {
      id: 7,
      name: "Xét nghiệm Mycoplasma",
      description: "Phát hiện vi khuẩn Mycoplasma genitalium",
      price: 500000,
      isActive: true,
    },
    {
      id: 8,
      name: "Xét nghiệm Trichomonas",
      description: "Phát hiện ký sinh trùng Trichomonas vaginalis",
      price: 450000,
      isActive: true,
    },
  ]; // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  // State cho dialog xem chi tiết dịch vụ
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    recommended_for: "", // Field này sẽ chỉ dùng cho frontend, không gửi lên backend
    isActive: true, // Field này sẽ chỉ dùng cho frontend, không gửi lên backend
  });
  // State cho validation errors
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    services: "",
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
      name: "",
      description: "",
      price: 0,
      recommended_for: "",
      isActive: true,
    });
    // Reset validation errors when opening dialog
    setErrors({
      name: "",
      description: "",
      price: "",
      services: "",
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
      name: "",
      description: "",
      price: "",
      services: "",
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
          services: "",
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
        [field]: "",
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      price: "",
      services: "",
    };
    let isValid = true;

    // Validate name (required, max length 200 per DTO)
    if (!formData.name.trim()) {
      newErrors.name = "Package name is required";
      isValid = false;
    } else if (formData.name.length > 200) {
      newErrors.name = "Package must not exceed 200 characters";
      isValid = false;
    }

    // Validate price (required, must be a positive number)
    if (formData.price <= 0) {
      newErrors.price = "Price is required and must be greater than 0";
      isValid = false;
    }

    // Validate selected services (must select at least one)
    if (selectedServices.length === 0) {
      newErrors.services = "At least one service must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSavePackage = () => {
    // Validate form before saving
    if (!validateForm()) {
      return;
    }

    // Get selected services data
    const selectedServicesData = availableServices.filter((service) =>
      selectedServices.includes(service.id)
    );

    // Prepare frontend display data
    const newPackage = {
      id: currentPackage ? currentPackage.id : Date.now(), // Tạm thời dùng timestamp làm ID
      ...formData,
      services: selectedServicesData,
      createdAt: currentPackage
        ? currentPackage.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }; // Prepare backend DTO data (STIPackageRequest)
    const packageDTO = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stiService: selectedServices, // Format for backend: array of IDs
    };

    // Nếu đang edit một package đã có, thêm ID vào DTO
    if (currentPackage) {
      packageDTO.id = currentPackage.id;
    }

    console.log("Package DTO to send to backend:", packageDTO);

    // In production, you would send packageDTO to the backend API here
    // For now, we'll just update the UI with newPackage

    if (currentPackage) {
      // Cập nhật package hiện có
      setPackages(
        packages.map((pkg) => (pkg.id === currentPackage.id ? newPackage : pkg))
      );
    } else {
      // Thêm package mới
      setPackages([...packages, newPackage]);
    }

    setOpenDialog(false);
  };
  const handleDeletePackage = (id) => {
    // Logic xóa gói
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
    }
  };

  // Filter packages dựa trên searchTerm
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.recommended_for.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          pb: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "80px",
              height: "4px",
              backgroundColor: "#1976d2",
              borderRadius: "2px",
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
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm theo tên gói, mô tả hoặc đối tượng..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: "50%",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "& fieldset": {
                borderColor: "rgba(0,0,0,0.12)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0,0,0,0.24)",
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
            fontWeight: "medium",
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Thêm gói STI
        </Button>
      </Paper>{" "}
      {/* Packages Table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1976d2",
              }}
            >
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                  width: "15%",
                }}
              >
                Tên gói
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                  width: "20%",
                }}
              >
                Mô tả
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                  width: "15%",
                }}
              >
                Đề xuất cho
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                Giá
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                Giảm giá
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                Số dịch vụ
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pkg, index) => {
                // Tính % giảm giá dựa trên giá gói và tổng giá dịch vụ
                const servicesTotal = pkg.services.reduce(
                  (sum, service) => sum + service.price,
                  0
                );
                const discountPercent =
                  servicesTotal > 0
                    ? Math.round((1 - pkg.price / servicesTotal) * 100)
                    : 0;

                return (
                  <TableRow
                    key={pkg.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f5f5",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
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
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {discountPercent > 0 ? (
                        <Chip
                          label={`${discountPercent}%`}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
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
                          display: "flex",
                          alignItems: "center",
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
                              backgroundColor: "rgba(33, 150, 243, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(33, 150, 243, 0.15)",
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
                          pkg.isActive ? "Đang cung cấp" : "Ngừng cung cấp"
                        }
                        color={pkg.isActive ? "success" : "default"}
                        size="small"
                        sx={{
                          fontWeight: pkg.isActive ? "medium" : "normal",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEditDialog(pkg)}
                            sx={{
                              mr: 1,
                              backgroundColor: "rgba(25, 118, 210, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.15)",
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
                              backgroundColor: "rgba(211, 47, 47, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.15)",
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
              })}
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
      </TableContainer>{" "}
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
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            py: 2,
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {currentPackage ? "Chỉnh sửa gói STI" : "Thêm gói STI mới"}
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                    "& .MuiOutlinedInput-root": {
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
                    handleInputChange("description", e.target.value)
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
                    "& .MuiOutlinedInput-root": {
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
                    handleInputChange("recommended_for", e.target.value)
                  }
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
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
                    handleInputChange("price", Number(e.target.value))
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
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                backgroundColor: "#f8f9fa",
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
                Các dịch vụ bao gồm trong gói{" "}
                <span style={{ color: "red" }}>*</span>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                {errors.services ? (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block" }}
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
                  overflow: "hidden",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
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
                            }
                          }}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, fontWeight: "bold" }}>
                        Tên dịch vụ
                      </TableCell>
                      <TableCell sx={{ py: 1.5, fontWeight: "bold" }}>
                        Mô tả
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ py: 1.5, fontWeight: "bold" }}
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
                            index % 2 === 0 ? "white" : "#fafafa",
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
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
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
                  backgroundColor: "#f0f7ff",
                  border: "1px solid #bbdefb",
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
                      {(() => {
                        const servicesTotal = availableServices
                          .filter((service) =>
                            selectedServices.includes(service.id)
                          )
                          .reduce((sum, service) => sum + service.price, 0);
                        const saving = servicesTotal - formData.price;
                        if (saving <= 0 || servicesTotal <= 0) return "0%";

                        const discountPercent = Math.round(
                          (saving / servicesTotal) * 100
                        );
                        return `${formatPrice(saving)} (${discountPercent}%)`;
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            >
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.isActive}
                label="Trạng thái"
                onChange={(e) => handleInputChange("isActive", e.target.value)}
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
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>{" "}
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
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            py: 2,
            fontWeight: "bold",
            fontSize: "1.2rem",
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
                  backgroundColor: "#f8fcff",
                  borderRadius: 2,
                  border: "1px solid #e3f2fd",
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
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        Tên gói:
                      </span>
                      <span style={{ fontWeight: "500" }}>
                        {packageDetails.name}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        Giá gói:
                      </span>
                      <span style={{ fontWeight: "600", color: "#1565c0" }}>
                        {formatPrice(packageDetails.price)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        Đề xuất cho:
                      </span>
                      <span style={{ fontWeight: "500" }}>
                        {packageDetails.recommended_for}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <span style={{ color: "#666", marginRight: "8px" }}>
                        Số dịch vụ:
                      </span>
                      <span style={{ fontWeight: "500" }}>
                        {packageDetails.services.length} dịch vụ
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <span style={{ color: "#666", marginRight: "8px" }}>
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
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      <TableCell
                        sx={{ fontWeight: "bold", py: 1.5, width: "10%" }}
                      >
                        STT
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", py: 1.5, width: "25%" }}
                      >
                        Tên dịch vụ
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", py: 1.5, width: "45%" }}
                      >
                        Mô tả
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold", py: 1.5, width: "20%" }}
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
                          "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                          "&:hover": { backgroundColor: "#f5f5f5" },
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
                  backgroundColor: "#f5f9ff",
                  borderRadius: 2,
                  p: 2,
                  border: "1px solid #bbdefb",
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
                      {(() => {
                        const servicesTotal = packageDetails.services.reduce(
                          (sum, service) => sum + service.price,
                          0
                        );
                        const saving = servicesTotal - packageDetails.price;
                        if (saving <= 0 || servicesTotal <= 0) return "0%";

                        const discountPercent = Math.round(
                          (saving / servicesTotal) * 100
                        );
                        return `${formatPrice(saving)} (${discountPercent}%)`;
                      })()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
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

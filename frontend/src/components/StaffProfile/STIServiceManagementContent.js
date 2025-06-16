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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const STIServiceManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Xét nghiệm STI cơ bản",
      description: "Xét nghiệm sàng lọc các bệnh lây truyền phổ biến",
      price: 1200000,
      duration: 30,
      status: "active",
    },
    {
      id: 2,
      name: "Xét nghiệm STI toàn diện",
      description:
        "Xét nghiệm đầy đủ tất cả các bệnh lây truyền qua đường tình dục",
      price: 2500000,
      duration: 60,
      status: "active",
    },
    {
      id: 3,
      name: "Tư vấn sau xét nghiệm",
      description: "Tư vấn kết quả và phương pháp điều trị",
      price: 500000,
      duration: 45,
      status: "inactive",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentService, setCurrentService] = useState(null);

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
    setCurrentService(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (service) => {
    setCurrentService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveService = () => {
    // Logic lưu thông tin dịch vụ
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
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      <Typography variant="h4" gutterBottom>
        Quản lý dịch vụ STI
      </Typography>

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: "40%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Thêm dịch vụ
        </Button>
      </Box>

      {/* Services Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thời gian (phút)</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        service.status === "active"
                          ? "Đang hoạt động"
                          : "Ngừng cung cấp"
                      }
                      color={
                        service.status === "active" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên dịch vụ"
              margin="normal"
              defaultValue={currentService?.name || ""}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              margin="normal"
              defaultValue={currentService?.description || ""}
            />
            <TextField
              fullWidth
              label="Giá dịch vụ (VNĐ)"
              margin="normal"
              type="number"
              defaultValue={currentService?.price || ""}
            />
            <TextField
              fullWidth
              label="Thời gian (phút)"
              margin="normal"
              type="number"
              defaultValue={currentService?.duration || ""}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                defaultValue={currentService?.status || "active"}
                label="Trạng thái"
              >
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Ngừng cung cấp</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveService}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STIServiceManagementContent;

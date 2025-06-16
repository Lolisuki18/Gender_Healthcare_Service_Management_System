/**
 * STITestManagementContent.js
 *
 * Mục đích: Quản lý các xét nghiệm STI
 * - Hiển thị danh sách các xét nghiệm STI
 * - Thêm/sửa/xóa xét nghiệm
 * - Quản lý thông tin chi tiết xét nghiệm
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

const STITestManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Xét nghiệm HIV",
      method: "Huyết thanh học",
      description: "Kiểm tra kháng thể HIV trong máu",
      price: 250000,
      turnaroundTime: "24 giờ",
      status: "active",
    },
    {
      id: 2,
      name: "Xét nghiệm Giang mai",
      method: "Nhuộm huỳnh quang",
      description: "Phát hiện khuẩn Treponema pallidum",
      price: 350000,
      turnaroundTime: "48 giờ",
      status: "active",
    },
    {
      id: 3,
      name: "Xét nghiệm Chlamydia",
      method: "PCR",
      description: "Phát hiện DNA của Chlamydia trachomatis",
      price: 450000,
      turnaroundTime: "72 giờ",
      status: "inactive",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

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
    setCurrentTest(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (test) => {
    setCurrentTest(test);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveTest = () => {
    // Logic lưu thông tin xét nghiệm
    setOpenDialog(false);
  };

  const handleDeleteTest = (id) => {
    // Logic xóa xét nghiệm
    if (window.confirm("Bạn có chắc chắn muốn xóa xét nghiệm này?")) {
      setTests(tests.filter((test) => test.id !== id));
    }
  };

  // Filter tests dựa trên searchTerm
  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.method.toLowerCase().includes(searchTerm.toLowerCase())
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
        Quản lý STI Test
      </Typography>

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm xét nghiệm..."
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
          Thêm xét nghiệm
        </Button>
      </Box>

      {/* Tests Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên xét nghiệm</TableCell>
              <TableCell>Phương pháp</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thời gian trả kết quả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((test) => (
                <TableRow key={test.id}>
                  <TableCell>{test.id}</TableCell>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>{test.method}</TableCell>
                  <TableCell>{test.description}</TableCell>
                  <TableCell>{formatPrice(test.price)}</TableCell>
                  <TableCell>{test.turnaroundTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        test.status === "active"
                          ? "Đang cung cấp"
                          : "Ngừng cung cấp"
                      }
                      color={test.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(test)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTest(test.id)}
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
          count={filteredTests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Test Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentTest ? "Chỉnh sửa xét nghiệm" : "Thêm xét nghiệm mới"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên xét nghiệm"
              margin="normal"
              defaultValue={currentTest?.name || ""}
            />
            <TextField
              fullWidth
              label="Phương pháp xét nghiệm"
              margin="normal"
              defaultValue={currentTest?.method || ""}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              margin="normal"
              defaultValue={currentTest?.description || ""}
            />
            <TextField
              fullWidth
              label="Giá xét nghiệm (VNĐ)"
              margin="normal"
              type="number"
              defaultValue={currentTest?.price || ""}
            />
            <TextField
              fullWidth
              label="Thời gian trả kết quả"
              margin="normal"
              defaultValue={currentTest?.turnaroundTime || ""}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                defaultValue={currentTest?.status || "active"}
                label="Trạng thái"
              >
                <MenuItem value="active">Đang cung cấp</MenuItem>
                <MenuItem value="inactive">Ngừng cung cấp</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveTest}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STITestManagementContent;

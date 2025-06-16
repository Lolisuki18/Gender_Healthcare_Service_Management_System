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
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const STIPackageManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Gói sàng lọc STI cơ bản",
      description: "Bao gồm các xét nghiệm STI phổ biến",
      price: 1500000,
      discount: 15,
      tests: ["HIV", "Giang mai", "Lậu"],
      status: "active",
    },
    {
      id: 2,
      name: "Gói sàng lọc STI toàn diện",
      description: "Bao gồm tất cả các xét nghiệm STI",
      price: 3200000,
      discount: 20,
      tests: ["HIV", "Giang mai", "Lậu", "Chlamydia", "HPV", "Herpes"],
      status: "active",
    },
    {
      id: 3,
      name: "Gói STI theo giới tính",
      description: "Các xét nghiệm STI phù hợp với từng giới tính",
      price: 2000000,
      discount: 10,
      tests: ["HIV", "Chlamydia", "HPV"],
      status: "inactive",
    },
  ]);

  // Mock data tests
  const availableTests = [
    "HIV",
    "Giang mai",
    "Lậu",
    "Chlamydia",
    "HPV",
    "Herpes",
    "Mycoplasma",
    "Trichomonas",
  ];

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);

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
    setSelectedTests([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (pkg) => {
    setCurrentPackage(pkg);
    setSelectedTests([...pkg.tests]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTestChange = (test) => {
    setSelectedTests((prevTests) => {
      if (prevTests.includes(test)) {
        return prevTests.filter((t) => t !== test);
      } else {
        return [...prevTests, test];
      }
    });
  };

  const handleSavePackage = () => {
    // Logic lưu thông tin gói
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
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        Quản lý STI Packages
      </Typography>

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm gói STI..."
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
          Thêm gói STI
        </Button>
      </Box>

      {/* Packages Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên gói</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Giảm giá (%)</TableCell>
              <TableCell>Xét nghiệm bao gồm</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{pkg.description}</TableCell>
                  <TableCell>{formatPrice(pkg.price)}</TableCell>
                  <TableCell>{pkg.discount}%</TableCell>
                  <TableCell>{pkg.tests.join(", ")}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        pkg.status === "active"
                          ? "Đang cung cấp"
                          : "Ngừng cung cấp"
                      }
                      color={pkg.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(pkg)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeletePackage(pkg.id)}
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
          count={filteredPackages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Package Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentPackage ? "Chỉnh sửa gói STI" : "Thêm gói STI mới"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên gói"
              margin="normal"
              defaultValue={currentPackage?.name || ""}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              margin="normal"
              defaultValue={currentPackage?.description || ""}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giá gói (VNĐ)"
                  margin="normal"
                  type="number"
                  defaultValue={currentPackage?.price || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giảm giá (%)"
                  margin="normal"
                  type="number"
                  defaultValue={currentPackage?.discount || ""}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Các xét nghiệm bao gồm:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {availableTests.map((test) => (
                <FormControlLabel
                  key={test}
                  control={
                    <Checkbox
                      checked={selectedTests.includes(test)}
                      onChange={() => handleTestChange(test)}
                    />
                  }
                  label={test}
                />
              ))}
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                defaultValue={currentPackage?.status || "active"}
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
          <Button variant="contained" onClick={handleSavePackage}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default STIPackageManagementContent;

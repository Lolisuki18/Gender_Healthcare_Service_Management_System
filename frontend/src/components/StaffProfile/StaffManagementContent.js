/**
 * StaffManagementContent.js
 *
 * Mục đích: Hiển thị và quản lý danh sách nhân viên
 * - Hiển thị danh sách nhân viên
 * - Thêm/sửa/xóa thông tin nhân viên
 * - Phân quyền và quản lý vai trò
 */

import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
// import staffService from "../../services/staffService"; // Uncomment khi có API

const StaffManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Bác sĩ",
      specialization: "Da liễu",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Y tá",
      specialization: "Sản phụ khoa",
      status: "active",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Bác sĩ",
      specialization: "Nam khoa",
      status: "inactive",
    },
  ]);

  // State cho API calls - comment lại cho đến khi có API
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   position: "",
  //   specialization: "",
  //   status: "active"
  // });

  // useEffect(() => {
  //   const fetchStaffMembers = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await staffService.getAllStaff();
  //       setStaffMembers(response.data);
  //       setError(null);
  //     } catch (err) {
  //       setError("Không thể tải danh sách nhân viên: " + err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   fetchStaffMembers();
  // }, []);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

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
    setCurrentStaff(null);
    setOpenDialog(true);

    // Khi có API, uncomment đoạn code sau:
    // setFormData({
    //   name: "",
    //   position: "",
    //   specialization: "",
    //   status: "active"
    // });
  };

  const handleOpenEditDialog = (staff) => {
    setCurrentStaff(staff);
    setOpenDialog(true);

    // Khi có API, uncomment đoạn code sau:
    // setFormData({
    //   name: staff.name,
    //   position: staff.position,
    //   specialization: staff.specialization,
    //   status: staff.status
    // });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Khi có API, comment đoạn code hiện tại và uncomment đoạn code bên dưới
  const handleSaveStaff = () => {
    // Logic lưu thông tin nhân viên
    setOpenDialog(false);
  };

  // const handleSaveStaff = async () => {
  //   setIsLoading(true);
  //   try {
  //     if (currentStaff) {
  //       // Cập nhật nhân viên
  //       await staffService.updateStaff(currentStaff.id, formData);
  //     } else {
  //       // Thêm mới nhân viên
  //       await staffService.createStaff(formData);
  //     }
  //
  //     // Refresh data
  //     const response = await staffService.getAllStaff();
  //     setStaffMembers(response.data);
  //     setError(null);
  //     setOpenDialog(false);
  //   } catch (err) {
  //     setError("Không thể lưu thông tin nhân viên: " + err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Khi có API, comment đoạn code hiện tại và uncomment đoạn code bên dưới
  const handleDeleteStaff = (id) => {
    // Logic xóa nhân viên
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setStaffMembers(staffMembers.filter((staff) => staff.id !== id));
    }
  };

  // const handleDeleteStaff = async (id) => {
  //   if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
  //     setIsLoading(true);
  //     try {
  //       await staffService.deleteStaff(id);
  //
  //       // Refresh data
  //       const response = await staffService.getAllStaff();
  //       setStaffMembers(response.data);
  //       setError(null);
  //     } catch (err) {
  //       setError("Không thể xóa nhân viên: " + err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  // Khi có API, uncomment đoạn code sau:
  // const handleFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // Filter staffMembers dựa trên searchTerm
  const filteredStaffMembers = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý nhân viên
      </Typography>

      {/* Khi có API, uncomment đoạn code sau */}
      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )} */}

      {/* {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )} */}

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm nhân viên..."
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
          Thêm nhân viên
        </Button>
      </Box>

      {/* Staff Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell>Chuyên môn</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaffMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.id}</TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.specialization}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        staff.status === "active"
                          ? "Đang làm việc"
                          : "Nghỉ việc"
                      }
                      color={staff.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(staff)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteStaff(staff.id)}
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
          count={filteredStaffMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Staff Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentStaff
            ? "Chỉnh sửa thông tin nhân viên"
            : "Thêm nhân viên mới"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            {/* Khi có API, thay đổi defaultValue thành value và thêm onChange handler 
                Form fields hiện tại: */}
            <TextField
              fullWidth
              label="Họ và tên"
              margin="normal"
              name="name"
              defaultValue={currentStaff?.name || ""}
              // value={formData.name}
              // onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Chức vụ</InputLabel>
              <Select
                name="position"
                defaultValue={currentStaff?.position || ""}
                label="Chức vụ"
                // value={formData.position}
                // onChange={handleFormChange}
              >
                <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
                <MenuItem value="Y tá">Y tá</MenuItem>
                <MenuItem value="Nhân viên hỗ trợ">Nhân viên hỗ trợ</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Chuyên môn"
              margin="normal"
              name="specialization"
              defaultValue={currentStaff?.specialization || ""}
              // value={formData.specialization}
              // onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                defaultValue={currentStaff?.status || "active"}
                label="Trạng thái"
                // value={formData.status}
                // onChange={handleFormChange}
              >
                <MenuItem value="active">Đang làm việc</MenuItem>
                <MenuItem value="inactive">Nghỉ việc</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveStaff}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffManagementContent;

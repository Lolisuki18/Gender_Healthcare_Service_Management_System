/**
 * StaffManagementContent.js
 *
 * Mục đích: Hiển thị danh sách người dùng trong hệ thống
 * - Hiển thị danh sách khách hàng, tư vấn viên, nhân viên
 * - Xem thông tin và trạng thái của người dùng
 * - Chức năng xem-only, không có chỉnh sửa
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Tab,
  Tabs,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Uncomment when API is implemented
  // CircularProgress,
  // Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  MedicalServices as MedicalServicesIcon,
} from "@mui/icons-material";
// import userService from "../../services/userService"; // Uncomment khi có API

const StaffManagementContent = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  // Mock data - sẽ được thay thế bằng API calls
  const [users] = useState({
    customers: [
      {
        id: 1,
        name: "Đỗ Thị Trang",
        email: "trangdo@example.com",
        phone: "0901234567",
        joinDate: "2023-11-20",
        status: "active",
        userType: "customer",
      },
      {
        id: 2,
        name: "Nguyễn Hoàng Minh",
        email: "minhnh@example.com",
        phone: "0912345678",
        joinDate: "2024-01-15",
        status: "active",
        userType: "customer",
      },
      {
        id: 3,
        name: "Phạm Thị Lan",
        email: "lanpt@example.com",
        phone: "0987654321",
        joinDate: "2023-09-05",
        status: "inactive",
        userType: "customer",
      },
    ],
    consultants: [
      {
        id: 4,
        name: "TS. Nguyễn Văn Tâm",
        email: "tamnv@example.com",
        phone: "0923456789",
        specialization: "Tâm lý giới tính",
        joinDate: "2023-06-10",
        status: "active",
        userType: "consultant",
      },
      {
        id: 5,
        name: "ThS. Lê Mai Anh",
        email: "anhml@example.com",
        phone: "0934567890",
        specialization: "Tư vấn tình cảm",
        joinDate: "2023-08-18",
        status: "active",
        userType: "consultant",
      },
    ],
    staff: [
      {
        id: 6,
        name: "Nguyễn Văn A",
        email: "anv@example.com",
        phone: "0945678901",
        position: "Bác sĩ",
        specialization: "Da liễu",
        joinDate: "2023-05-15",
        status: "active",
        userType: "staff",
      },
      {
        id: 7,
        name: "Trần Thị B",
        email: "btt@example.com",
        phone: "0956789012",
        position: "Y tá",
        specialization: "Sản phụ khoa",
        joinDate: "2023-07-20",
        status: "active",
        userType: "staff",
      },
      {
        id: 8,
        name: "Lê Văn C",
        email: "clv@example.com",
        phone: "0967890123",
        position: "Bác sĩ",
        specialization: "Nam khoa",
        joinDate: "2023-04-10",
        status: "inactive",
        userType: "staff",
      },
    ],
  });

  // State cho API calls - comment lại cho đến khi có API
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setIsLoading(true);
  //     try {
  //       const customersResponse = await userService.getAllCustomers();
  //       const consultantsResponse = await userService.getAllConsultants();
  //       const staffResponse = await userService.getAllStaff();
  //
  //       setUsers({
  //         customers: customersResponse.data,
  //         consultants: consultantsResponse.data,
  //         staff: staffResponse.data
  //       });
  //       setError(null);
  //     } catch (err) {
  //       setError("Không thể tải danh sách người dùng: " + err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   fetchUsers();
  // }, []);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Lấy danh sách người dùng theo tab hiện tại
  const getCurrentUsers = () => {
    switch (tabValue) {
      case 0: // All users
        return [...users.customers, ...users.consultants, ...users.staff];
      case 1: // Customers
        return users.customers;
      case 2: // Consultants
        return users.consultants;
      case 3: // Staff
        return users.staff;
      default:
        return [];
    }
  };

  // Filter users dựa trên searchTerm và statusFilter
  const filteredUsers = getCurrentUsers().filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.specialization &&
        user.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.position &&
        user.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper function để hiển thị icon theo loại người dùng
  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case "customer":
        return <PersonIcon fontSize="small" sx={{ color: "#4A90E2" }} />;
      case "consultant":
        return <PsychologyIcon fontSize="small" sx={{ color: "#9C27B0" }} />;
      case "staff":
        return (
          <MedicalServicesIcon fontSize="small" sx={{ color: "#1ABC9C" }} />
        );
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  // Helper function để hiển thị tên loại người dùng
  const getUserTypeName = (userType) => {
    switch (userType) {
      case "customer":
        return "Khách hàng";
      case "consultant":
        return "Tư vấn viên";
      case "staff":
        return "Nhân viên";
      default:
        return "Không xác định";
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#f8fafc",
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#1e293b",
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <PersonIcon sx={{ mr: 1, color: "#4A90E2", fontSize: 28 }} />
        Danh sách người dùng trong hệ thống
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
              minHeight: 48,
            },
            "& .Mui-selected": {
              color: "#4A90E2 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#4A90E2",
              height: 3,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1 }} />
                <span>Tất cả người dùng</span>
                <Chip
                  label={
                    users.customers.length +
                    users.consultants.length +
                    users.staff.length
                  }
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1 }} />
                <span>Khách hàng</span>
                <Chip
                  label={users.customers.length}
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PsychologyIcon sx={{ mr: 1 }} />
                <span>Tư vấn viên</span>
                <Chip
                  label={users.consultants.length}
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MedicalServicesIcon sx={{ mr: 1 }} />
                <span>Nhân viên</span>
                <Chip
                  label={users.staff.length}
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                />
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#fff",
              "& fieldset": {
                borderColor: "rgba(203, 213, 225, 0.8)",
              },
              "&:hover fieldset": {
                borderColor: "#4A90E2",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Trạng thái"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
            }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Không hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Loại tài khoản</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Chuyên môn/Vị trí</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày tham gia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { bgcolor: "rgba(74, 144, 226, 0.04)" },
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1.5,
                          bgcolor:
                            user.userType === "customer"
                              ? "#4A90E2"
                              : user.userType === "consultant"
                              ? "#9C27B0"
                              : "#1ABC9C",
                        }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getUserTypeIcon(user.userType)}
                      label={getUserTypeName(user.userType)}
                      size="small"
                      sx={{
                        bgcolor:
                          user.userType === "customer"
                            ? "rgba(74, 144, 226, 0.1)"
                            : user.userType === "consultant"
                            ? "rgba(156, 39, 176, 0.1)"
                            : "rgba(26, 188, 156, 0.1)",
                        color:
                          user.userType === "customer"
                            ? "#2c5282"
                            : user.userType === "consultant"
                            ? "#6b1b9a"
                            : "#1a7268",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.userType === "staff"
                      ? `${user.position} (${user.specialization})`
                      : user.userType === "consultant"
                      ? user.specialization
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.joinDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.status === "active"
                          ? "Đang hoạt động"
                          : "Không hoạt động"
                      }
                      color={user.status === "active" ? "success" : "default"}
                      size="small"
                      sx={{
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}

            {filteredUsers.length === 0 && (
              <TableRow style={{ height: 53 }}>
                <TableCell colSpan={8} align="center">
                  Không tìm thấy người dùng nào phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </TableContainer>
    </Box>
  );
};

export default StaffManagementContent;

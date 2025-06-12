/**
 * UserManagementContent.js - Admin User Management
 *
 * Trang quản lý người dùng cho Admin
 */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Grid,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ManageAccounts as ManageAccountsIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const UserManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data với nhiều người dùng hơn
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      role: "Customer",
      status: "Hoạt động",
      joinDate: "2024-01-15",
      avatar: null,
      lastLogin: "2024-06-05 09:30",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0907654321",
      role: "Consultant",
      status: "Hoạt động",
      joinDate: "2024-02-10",
      avatar: null,
      lastLogin: "2024-06-05 08:15",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0909876543",
      role: "Staff",
      status: "Tạm khóa",
      joinDate: "2024-03-05",
      avatar: null,
      lastLogin: "2024-06-01 14:20",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0908765432",
      role: "Admin",
      status: "Hoạt động",
      joinDate: "2023-12-01",
      avatar: null,
      lastLogin: "2024-06-05 10:45",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0905432109",
      role: "Customer",
      status: "Hoạt động",
      joinDate: "2024-04-20",
      avatar: null,
      lastLogin: "2024-06-04 16:30",
    },
  ];

  // ✅ Cập nhật userCategories để sử dụng role từ API
  const userCategories = [
    {
      label: "Tất cả",
      value: "all",
      icon: <PeopleIcon />,
      count: users.length,
    },
    {
      label: "Quản trị viên",
      value: "ADMIN",
      icon: <SecurityIcon />,
      count: users.filter((u) => u.role === "ADMIN").length,
    },
    {
      label: "Nhân viên",
      value: "STAFF",
      icon: <BusinessIcon />,
      count: users.filter((u) => u.role === "STAFF").length,
    },
    {
      label: "Khách hàng",
      value: "CUSTOMER",
      icon: <PersonIcon />,
      count: users.filter((u) => u.role === "CUSTOMER").length,
    },
    {
      label: "Tư vấn viên",
      value: "CONSULTANT",
      icon: <SupportIcon />,
      count: users.filter((u) => u.role === "Consultant").length,
    },
  ];

  // ✅ THÊM các function mới cho Edit và Delete
  const handleEdit = (userId) => {
    console.log("Chỉnh sửa người dùng ID:", userId);
    // TODO: Implement edit functionality
    // Có thể mở dialog hoặc navigate đến trang edit
    alert(`Chỉnh sửa người dùng ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    console.log("Xóa người dùng ID:", userId);
    // TODO: Implement delete functionality
    // Hiển thị confirmation dialog
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      // Xử lý xóa user ở đây
      alert(`Đã xóa người dùng ID: ${userId}`);
      // Có thể update state để remove user khỏi danh sách
    }
  };

  // ✅ Function xử lý xem thông tin chi tiết
  const handleViewUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setOpenViewModal(true);
    }
  };

  // Hàm xử lý submit form edit user
  const handleEditSubmit = (formData) => {
    console.log("Cập nhật thông tin người dùng:", formData);
    // TODO: Implement API call to update user
    // Tạm thời chỉ log và đóng modal
    alert(`Đã cập nhật thông tin người dùng: ${formData.name}`);
    setOpenEditModal(false);
    setEditingUser(null);
  };

  // ✅ Function xử lý submit từ modal
  const handleModalSubmit = (formData, userType) => {
    console.log("Dữ liệu form:", formData);
    console.log("Loại người dùng:", userType);

    // TODO: Gửi data đến API
    // Simulate API call
    alert(`Đã thêm ${getModalTitle(userType)} thành công!`);

    // Có thể thêm user mới vào danh sách (nếu muốn update UI ngay lập tức)
    // setUsers(prev => [...prev, { ...formData, id: Date.now(), role: userType }]);
  };

  // Get modal title based on user type
  const getModalTitle = (userType) => {
    switch (userType) {
      case "Admin":
        return "Quản trị viên";
      case "Staff":
        return "Nhân viên";
      case "Customer":
        return "Khách hàng";
      case "Consultant":
        return "Tư vấn viên";
      default:
        return "Người dùng";
    }
  };

  // ✅ Thêm state mới cho loading create user
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // ✅ Cập nhật handleModalSubmit
  const handleModalSubmit = async (formData, userType) => {
    setIsCreatingUser(true); // ✅ Sử dụng state riêng

    try {
      console.log("Đang tạo người dùng mới:", formData);
      console.log("Loại người dùng:", userType);

      const result = await adminService.addNewUserAccount(formData);

      if (result && result.success) {
        notify.success(
          "Tạo thành công!",
          `Tạo ${getRoleDisplayName(userType)} thành công!`
        );

        // ✅ Refresh data
        await fetchUsers();

        // Đóng modal
        setOpenModal(false);
        setModalType("");

        console.log("Tạo người dùng thành công:", result);
      }
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tạo người dùng";

      notify.error("Lỗi tạo người dùng", errorMessage);
    } finally {
      setIsCreatingUser(false); // ✅ Clear loading state
    }
  };

  // ✅ Cập nhật getModalTitle
  const getModalTitle = (userType) => {
    switch (userType) {
      case "ADMIN":
        return "Quản trị viên";
      case "STAFF":
        return "Nhân viên";
      case "CUSTOMER":
        return "Khách hàng";
      case "CONSULTANT":
        return "Tư vấn viên";
      default:
        return "Người dùng";
    }
  };

  // ✅ Cập nhật getRoleDisplayName
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "STAFF":
        return "Nhân viên";
      case "CUSTOMER":
        return "Khách hàng";
      case "CONSULTANT":
        return "Tư vấn viên";
      default:
        return role;
    }
  };

  const getAddButtonText = () => {
    return "Thêm người dùng mới";
  };

  const handleAddNew = () => {
    setOpenRoleSelection(true);
  };

  const handleRoleSelect = (userType) => {
    setOpenRoleSelection(false);
    setModalType(userType);
    setOpenModal(true);
  };

  // ✅ Function để lấy text cho nút Add - hiển thị tiếng Việt
  const getAddButtonText = (tabValue) => {
    switch (tabValue) {
      case "Admin":
        return "Thêm Quản trị viên";
      case "Staff":
        return "Thêm Nhân viên";
      case "Customer":
        return "Thêm Khách hàng";
      case "Consultant":
        return "Thêm Tư vấn viên";
      default:
        return "Thêm mới";
    }
  };

  // ✅ Function xử lý thêm mới - log bằng tiếng Anh, alert tiếng Việt
  const handleAddNew = (userType) => {
    console.log("Thêm mới người dùng loại:", userType); // Log database value

    switch (userType) {
      case "Admin":
        alert("Mở form thêm Quản trị viên mới");
        // TODO: Mở dialog/form thêm Admin
        break;
      case "Staff":
        alert("Mở form thêm Nhân viên mới");
        // TODO: Mở dialog/form thêm Staff
        break;
      case "Customer":
        alert("Mở form thêm Khách hàng mới");
        // TODO: Mở dialog/form thêm Customer
        break;
      case "Consultant":
        alert("Mở form thêm Tư vấn viên mới");
        // TODO: Mở dialog/form thêm Consultant
        break;
      default:
        alert("Mở form thêm người dùng mới");
        // TODO: Mở dialog/form thêm người dùng chung
        break;
    }
  };

  // ✅ Cập nhật getFilteredUsers
  const getFilteredUsers = () => {
    console.log("=== FILTERING USERS ===");
    console.log("Original users count:", users.length);
    console.log("Search term:", searchTerm);
    console.log("Selected tab:", userCategories[selectedTab]?.value);
    console.log("Role filter:", roleFilter);
    console.log("Status filter:", statusFilter);

    let filtered = [...users];

    // Lọc theo tab
    const currentTab = userCategories[selectedTab]?.value;
    if (currentTab && currentTab !== "all") {
      filtered = filtered.filter((u) => u.role === currentTab);
      console.log("After tab filter:", filtered.length);
    }

    // Lọc theo role filter (chỉ khi ở tab "Tất cả")
    if (currentTab === "all" && roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
      console.log("After role filter:", filtered.length);
    }

    // Lọc theo status filter
    if (statusFilter !== "all") {
      if (statusFilter === "Hoạt động") {
        filtered = filtered.filter((u) => u.isActive === true);
      } else if (statusFilter === "Tạm khóa") {
        filtered = filtered.filter((u) => u.isActive === false);
      }
      console.log("After status filter:", filtered.length);
    }

    // Lọc theo search term
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((u) => {
        const nameMatch = (u.fullName || u.username || "")
          .toLowerCase()
          .includes(searchLower);
        const emailMatch = (u.email || "").toLowerCase().includes(searchLower);
        const phoneMatch = (u.phone || "").includes(searchTerm.trim());

        return nameMatch || emailMatch || phoneMatch;
      });
      console.log("After search filter:", filtered.length);
    }

    console.log("Final filtered users:", filtered.length);
    return filtered;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search input changed to:", value);
    setSearchTerm(value);
  };

  useEffect(() => {
    console.log("Search term changed:", searchTerm);
    console.log("Filtered users:", getFilteredUsers());
  }, [searchTerm, selectedTab, roleFilter, statusFilter]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (userCategories[newValue]?.value !== "all") {
      setRoleFilter("all");
    }
  };

  // ✅ Cập nhật getRoleColor
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "CONSULTANT":
        return "warning";
      case "STAFF":
        return "info";
      case "CUSTOMER":
        return "primary";
      default:
        return "default";
    }
  };

  const filteredUsers = getFilteredUsers();

  // ✅ Hiển thị loading khi đang tải
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#4A90E2" }} />
        <Typography variant="h6" sx={{ ml: 2, color: "#4A5568" }}>
          Đang tải danh sách người dùng...
        </Typography>
      </Box>
    );
  }

  // ✅ Hiển thị error khi có lỗi
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" sx={{ color: "#E53E3E", mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchUsers}
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            "&:hover": {
              background: "linear-gradient(45deg, #357ABD, #17A2B8)",
            },
          }}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#2D3748",
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        <ManageAccountsIcon sx={{ mr: 2, color: "#4A90E2", fontSize: 32 }} />
        Quản lý người dùng
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#4A5568",
          mb: 4,
          fontSize: "1rem",
        }}
      >
        Quản lý tài khoản và phân quyền người dùng trong hệ thống
      </Typography>

      {/* User Category Tabs với integrated filters */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            px: 2,
            pt: 1,
            borderBottom: "1px solid rgba(74, 144, 226, 0.15)",
            "& .MuiTab-root": {
              minHeight: 60,
              textTransform: "none",
              fontWeight: 500,
              color: "#4A5568",
              "&.Mui-selected": {
                color: "#4A90E2",
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#4A90E2",
              height: 3,
            },
          }}
        >
          {userCategories.map((category, index) => (
            <Tab
              key={category.value}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {category.icon}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
                      {category.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#718096" }}>
                      {category.count} người dùng
                    </Typography>
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Integrated Search and Filters Section */}
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4A90E2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4A90E2",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "#4A5568", mr: 1 }} />
                  ),
                }}
              />
              {searchTerm && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#718096",
                    mt: 0.5,
                    display: "block",
                  }}
                >
                  Đang tìm: "{searchTerm}" - Kết quả:{" "}
                  {getFilteredUsers().length} người dùng
                </Typography>
              )}
            </Grid>

            {/* Role Filter */}
            {userCategories[selectedTab]?.value === "all" && (
              <Grid item xs={12} md={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Vai trò"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="Admin">Quản trị viên</MenuItem>{" "}
                    {/* ✅ Hiển thị tiếng Việt */}
                    <MenuItem value="Consultant">Tư vấn viên</MenuItem>{" "}
                    {/* ✅ Hiển thị tiếng Việt */}
                    <MenuItem value="Staff">Nhân viên</MenuItem>{" "}
                    {/* ✅ Hiển thị tiếng Việt */}
                    <MenuItem value="Customer">Khách hàng</MenuItem>{" "}
                    {/* ✅ Hiển thị tiếng Việt */}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              md={userCategories[selectedTab]?.value === "all" ? 3 : 6}
            >
              <FormControl size="small" fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                  <MenuItem value="Tạm khóa">Tạm khóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#4A5568" }}>
          Hiển thị {getFilteredUsers().length} / {users.length} người dùng
          {userCategories[selectedTab]?.label !== "Tất cả" &&
            ` trong danh mục "${userCategories[selectedTab]?.label}"`}
          {searchTerm && ` (tìm kiếm: "${searchTerm}")`}
        </Typography>
      </Box>
      {/* Users Table */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
        }}
      >
        <TableContainer component={Paper} sx={{ background: "transparent" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Người dùng
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Liên hệ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Vai trò
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={user.avatar}
                          sx={{
                            width: 40,
                            height: 40,
                            background:
                              "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                          }}
                        >
                          {user.fullName?.charAt(0) ||
                            user.username?.charAt(0) ||
                            "?"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: "#2D3748" }}
                          >
                            {user.fullName || user.username || "Không có tên"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#718096" }}
                          >
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#2D3748" }}>
                          {user.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#718096" }}>
                          {user.phone || "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleDisplayName(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Hoạt động" : "Tạm khóa"}
                        color={user.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#718096" }}>
                        {user.lastLogin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(user.id)}
                          sx={{
                            color: "#4A90E2",
                            backgroundColor: "rgba(74, 144, 226, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(74, 144, 226, 0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        {/* delete button */}
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user.id)}
                          sx={{
                            color: "#E53E3E",
                            backgroundColor: "rgba(229, 62, 62, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(229, 62, 62, 0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: "#718096" }}>
                      Không tìm thấy người dùng nào phù hợp
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>{" "}
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default UserManagementContent;

/**
 * UserManagementContent.js - Admin User Management
 *
 * Trang quản lý người dùng cho Admin
 */
import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import AddUserModal from "./modals/AddUserModal";
import ViewUserModal from "./modals/ViewUserModal";
import EditUserModal from "./modals/EditUserModal";

const UserManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // State cho modal
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  // State cho view modal
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State cho edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  // State cho role selection modal
  const [openRoleSelection, setOpenRoleSelection] = useState(false);
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
      gender: "male",
      dateOfBirth: "1990-05-15",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
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
      gender: "female",
      dateOfBirth: "1985-08-20",
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      specialization: "Sức khỏe sinh sản nữ",
      experience: "8",
      certification:
        "- Bác sĩ Chuyên khoa I Sản Phụ khoa\n- Chứng chỉ tư vấn sức khỏe sinh sản\n- Thạc sĩ Y học cộng đồng",
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
      gender: "male",
      dateOfBirth: "1995-12-10",
      address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
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
      gender: "female",
      dateOfBirth: "1988-03-25",
      address: "321 Võ Văn Tần, Quận 3, TP.HCM",
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
      gender: "male",
      dateOfBirth: "1992-07-08",
      address: "654 Hai Bà Trưng, Quận 1, TP.HCM",
    },
  ];

  // Tabs cho phân loại người dùng - SỬA LẠI
  const userCategories = [
    {
      label: "Tất cả",
      value: "all",
      icon: <PeopleIcon />,
      count: users.length,
    },
    {
      label: "Quản trị viên", // ✅ Tiếng Việt
      value: "Admin", // ✅ Tiếng Anh cho database
      icon: <SecurityIcon />,
      count: users.filter((u) => u.role === "Admin").length,
    },
    {
      label: "Nhân viên", // ✅ Tiếng Việt
      value: "Staff", // ✅ Tiếng Anh cho database
      icon: <BusinessIcon />,
      count: users.filter((u) => u.role === "Staff").length,
    },
    {
      label: "Khách hàng", // ✅ Tiếng Việt
      value: "Customer", // ✅ Tiếng Anh cho database
      icon: <PersonIcon />,
      count: users.filter((u) => u.role === "Customer").length,
    },
    {
      label: "Tư vấn viên", // ✅ Tiếng Việt
      value: "Consultant", // ✅ Tiếng Anh cho database
      icon: <SupportIcon />,
      count: users.filter((u) => u.role === "Consultant").length,
    },
  ];

  // ✅ THÊM các function mới cho Edit và Delete
  const handleEdit = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setOpenEditModal(true);
    }
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

  // ✅ Function chuyển đổi role từ tiếng Anh sang tiếng Việt để hiển thị
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "Admin":
        return "Quản trị viên";
      case "Staff":
        return "Nhân viên";
      case "Customer":
        return "Khách hàng";
      case "Consultant":
        return "Tư vấn viên";
      default:
        return role;
    }
  };

  // ✅ Function chuyển đổi status từ tiếng Anh sang tiếng Việt (nếu cần)
  const getStatusDisplayName = (status) => {
    switch (status) {
      case "Active":
        return "Hoạt động";
      case "Inactive":
        return "Tạm khóa";
      case "Blocked":
        return "Bị chặn";
      default:
        return status; // Nếu đã là tiếng Việt thì giữ nguyên
    }
  };

  // ✅ Function để lấy text cho nút Add - hiển thị chung cho tất cả
  const getAddButtonText = () => {
    return "Thêm người dùng mới";
  };

  // ✅ Function xử lý mở role selection dialog
  const handleAddNew = () => {
    setOpenRoleSelection(true);
  };

  // ✅ Function xử lý chọn role và mở modal thêm mới
  const handleRoleSelect = (userType) => {
    setOpenRoleSelection(false);
    setModalType(userType);
    setOpenModal(true);
  };

  // ✅ Danh sách roles để chọn
  const roleOptions = [
    {
      value: "Admin",
      label: "Quản trị viên",
      icon: <SecurityIcon />,
      description: "Có quyền quản lý toàn bộ hệ thống",
      color: "#E53E3E",
    },
    {
      value: "Staff",
      label: "Nhân viên",
      icon: <BusinessIcon />,
      description: "Nhân viên hỗ trợ khách hàng",
      color: "#3182CE",
    },
    {
      value: "Consultant",
      label: "Tư vấn viên",
      icon: <SupportIcon />,
      description: "Chuyên gia tư vấn sức khỏe",
      color: "#D69E2E",
    },
    {
      value: "Customer",
      label: "Khách hàng",
      icon: <PersonIcon />,
      description: "Người dùng sử dụng dịch vụ",
      color: "#4A90E2",
    },
  ];

  // ✅ Cập nhật getFilteredUsers để reset roleFilter khi chọn tab cụ thể
  const getFilteredUsers = () => {
    let filtered = users;

    // Lọc theo tab
    switch (userCategories[selectedTab]?.value) {
      case "Admin":
        filtered = filtered.filter((u) => u.role === "Admin");
        break;
      case "Staff":
        filtered = filtered.filter((u) => u.role === "Staff");
        break;
      case "Customer":
        filtered = filtered.filter((u) => u.role === "Customer");
        break;
      case "Consultant":
        filtered = filtered.filter((u) => u.role === "Consultant");
        break;
      default:
        // Chỉ apply roleFilter khi ở tab "Tất cả"
        if (roleFilter !== "all") {
          filtered = filtered.filter((u) => u.role === roleFilter);
        }
        break;
    }

    // Lọc theo status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phone.includes(searchTerm)
      );
    }

    return filtered;
  };

  // ✅ Reset roleFilter khi chuyển tab
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // Reset role filter khi chuyển sang tab cụ thể
    if (userCategories[newValue]?.value !== "all") {
      setRoleFilter("all");
    }
  };

  // ✅ Cập nhật getRoleColor để match với role tiếng Anh
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Consultant":
        return "warning";
      case "Staff":
        return "info";
      case "Customer":
        return "primary";
      default:
        return "default";
    }
  };

  // ✅ Cập nhật getStatusColor
  const getStatusColor = (status) => {
    // Support cả tiếng Anh và tiếng Việt
    return status === "Hoạt động" || status === "Active"
      ? "success"
      : "default";
  };

  const filteredUsers = getFilteredUsers();

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
        {/* Tabs Section */}
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

        {/* Header Section - Remove Add Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            px: 3,
            pt: 3,
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#2D3748", fontWeight: 600 }}>
            {userCategories[selectedTab]?.label === "Tất cả"
              ? "Danh sách người dùng"
              : `Danh sách ${userCategories[selectedTab]?.label}`}
          </Typography>
        </Box>

        {/* Search and Filters Section */}
        <CardContent sx={{ pt: 0, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
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
            </Grid>

            {/* Conditional Role Filter - hiển thị tiếng Việt, value tiếng Anh */}
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
                    <MenuItem value="Admin">Quản trị viên</MenuItem>
                    <MenuItem value="Consultant">Tư vấn viên</MenuItem>
                    <MenuItem value="Staff">Nhân viên</MenuItem>
                    <MenuItem value="Customer">Khách hàng</MenuItem>
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
          Hiển thị {filteredUsers.length} / {users.length} người dùng
          {userCategories[selectedTab]?.label !== "Tất cả" &&
            ` trong danh mục "${userCategories[selectedTab]?.label}"`}
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
                  Lần cuối đăng nhập
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
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: "#2D3748" }}
                          >
                            {user.name}
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
                          {user.phone}
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
                        label={getStatusDisplayName(user.status)}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#718096" }}>
                        {user.lastLogin}
                      </Typography>
                    </TableCell>{" "}
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewUser(user.id)}
                          sx={{
                            color: "#48BB78",
                            backgroundColor: "rgba(72, 187, 120, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(72, 187, 120, 0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </IconButton>

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
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
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
      {/* Standalone Add User Button Section - Moved to bottom after table */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleAddNew}
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #357ABD, #17A2B8)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(74, 144, 226, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {getAddButtonText()}
        </Button>
      </Box>
      {/* Role Selection Dialog */}
      <Dialog
        open={openRoleSelection}
        onClose={() => setOpenRoleSelection(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 1,
            background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontWeight: 700,
          }}
        >
          Chọn loại người dùng cần thêm
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ py: 2 }}>
            {roleOptions.map((role) => (
              <ListItem key={role.value} sx={{ px: 3 }}>
                <ListItemButton
                  onClick={() => handleRoleSelect(role.value)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    border: "1px solid rgba(74, 144, 226, 0.15)",
                    "&:hover": {
                      backgroundColor: "rgba(74, 144, 226, 0.05)",
                      borderColor: role.color,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon sx={{ color: role.color }}>
                    {role.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#2D3748" }}
                      >
                        {role.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: "#718096" }}>
                        {role.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenRoleSelection(false)}
            sx={{ color: "#718096" }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      {/* Add User Modal */}
      <AddUserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        userType={modalType}
        onSubmit={handleModalSubmit}
      />{" "}
      {/* View User Modal */}
      <ViewUserModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        user={selectedUser}
      />
      {/* Edit User Modal */}
      <EditUserModal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleEditSubmit}
      />
    </Box>
  );
};

export default UserManagementContent;

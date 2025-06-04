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
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const UserManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock data - thay thế bằng API call thực tế
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      role: "Khách hàng",
      status: "Hoạt động",
      joinDate: "2024-01-15",
      avatar: null,
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0907654321",
      role: "Tư vấn viên",
      status: "Hoạt động",
      joinDate: "2024-02-10",
      avatar: null,
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0909876543",
      role: "Nhân viên",
      status: "Tạm khóa",
      joinDate: "2024-03-05",
      avatar: null,
    },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Tư vấn viên":
        return "warning";
      case "Nhân viên":
        return "info";
      default:
        return "primary";
    }
  };

  const getStatusColor = (status) => {
    return status === "Hoạt động" ? "success" : "default";
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#2D3748",
          fontWeight: 600,
        }}
      >
        Quản lý người dùng
      </Typography>

      {/* Search and Filter */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "#718096", mr: 1 }} />,
              }}
            />
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                borderRadius: 2,
                px: 3,
              }}
            >
              Thêm người dùng
            </Button>
          </Box>
        </CardContent>
      </Card>

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
                  Ngày tham gia
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2D3748" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#2D3748" }}
                      >
                        {user.name}
                      </Typography>
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
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#718096" }}>
                      {user.joinDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={handleMenuOpen}>
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserManagementContent;

/**
 * BlogManagementContent.js
 *
 * Mục đích: Quản lý bài viết blog
 * - Hiển thị danh sách bài viết
 * - Thêm/sửa/xóa bài viết
 * - Quản lý nội dung và trạng thái bài viết
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
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const BlogManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Những điều cần biết về STI",
      category: "Sức khỏe",
      author: "Dr. Nguyễn Văn A",
      publishDate: "2025-05-15",
      status: "published",
    },
    {
      id: 2,
      title: "Phòng ngừa bệnh lây qua đường tình dục",
      category: "Phòng ngừa",
      author: "Dr. Trần Thị B",
      publishDate: "2025-06-01",
      status: "published",
    },
    {
      id: 3,
      title: "Các xét nghiệm STI phổ biến",
      category: "Xét nghiệm",
      author: "Dr. Lê Văn C",
      publishDate: "2025-06-10",
      status: "draft",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

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
    setCurrentBlog(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (blog) => {
    setCurrentBlog(blog);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveBlog = () => {
    // Logic lưu bài viết
    setOpenDialog(false);
  };

  const handleDeleteBlog = (id) => {
    // Logic xóa bài viết
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  // Filter blogs dựa trên searchTerm
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Blog
      </Typography>

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm bài viết..."
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
          Thêm bài viết
        </Button>
      </Box>

      {/* Blogs Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Ngày xuất bản</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.id}</TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>{blog.publishDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        blog.status === "published" ? "Đã xuất bản" : "Bản nháp"
                      }
                      color={
                        blog.status === "published" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="info" onClick={() => {}}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(blog)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteBlog(blog.id)}
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
          count={filteredBlogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Blog Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tiêu đề bài viết"
              margin="normal"
              defaultValue={currentBlog?.title || ""}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục</InputLabel>
              <Select
                defaultValue={currentBlog?.category || ""}
                label="Danh mục"
              >
                <MenuItem value="Sức khỏe">Sức khỏe</MenuItem>
                <MenuItem value="Phòng ngừa">Phòng ngừa</MenuItem>
                <MenuItem value="Xét nghiệm">Xét nghiệm</MenuItem>
                <MenuItem value="Điều trị">Điều trị</MenuItem>
                <MenuItem value="Tư vấn">Tư vấn</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tác giả"
              margin="normal"
              defaultValue={currentBlog?.author || ""}
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Nội dung bài viết"
              margin="normal"
              defaultValue=""
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                defaultValue={currentBlog?.status || "draft"}
                label="Trạng thái"
              >
                <MenuItem value="published">Xuất bản</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveBlog}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagementContent;

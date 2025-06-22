/**
 * BlogManagementContent.js
 *
 * Mục đích: Quản lý bài viết blog
 * - Hiển thị danh sách bài viết
 * - Thêm/sửa/xóa bài viết
 * - Quản lý nội dung và trạng thái bài viết
 */

import React, { useState } from 'react';
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
  Avatar,
  Tooltip,
  Fade,
  Zoom,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  LibraryBooks as LibraryBooksIcon,
} from '@mui/icons-material';

// Teal theme colors
const colors = {
  primary: '#20B2AA', // Light Sea Green
  secondary: '#5F9EA0', // Cadet Blue
  accent: '#48D1CC', // Medium Turquoise
  background: '#E0F2F1', // Very light teal
  text: '#264653', // Dark blue-green
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  success: '#2E8B57', // Sea Green
  error: '#FF6B6B', // Light Red
  warning: '#FFD166', // Light Yellow
};

const gradientBg = {
  minHeight: '100vh',
  background: '#E0F2F1',
  padding: 0,
};

const headerStyle = {
  background: '#20B2AA',
  color: 'white',
  padding: '15px 25px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(32, 178, 170, 0.2)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 3,
};

const cardStyle = {
  backgroundColor: colors.white,
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  color: colors.text,
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

const statCardStyle = {
  backgroundColor: colors.white,
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  color: colors.text,
  padding: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: colors.primary,
  },
};

const tableHeadStyle = {
  backgroundColor: colors.primary,
  '& th': {
    color: colors.white,
    fontWeight: 600,
    padding: '16px',
  },
};

const iconButtonStyle = {
  transition: 'all 0.2s ease',
  margin: '0 4px',
  '&:hover': {
    backgroundColor: 'rgba(32, 178, 170, 0.1)',
  },
};

const primaryButtonStyle = {
  backgroundColor: colors.primary,
  color: colors.white,
  fontWeight: 600,
  borderRadius: '50px',
  padding: '10px 24px',
  boxShadow: '0 2px 10px rgba(32, 178, 170, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: colors.secondary,
    boxShadow: '0 4px 15px rgba(32, 178, 170, 0.4)',
    transform: 'translateY(-2px)',
  },
};

const secondaryButtonStyle = {
  backgroundColor: 'rgba(32, 178, 170, 0.1)',
  color: colors.primary,
  fontWeight: 600,
  borderRadius: '50px',
  padding: '10px 24px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(32, 178, 170, 0.2)',
  },
};

const searchBarStyle = {
  backgroundColor: colors.white,
  borderRadius: '50px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  padding: '5px 15px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
};

const BlogManagementContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Những điều cần biết về STI',
      category: 'Sức khỏe',
      author: 'Dr. Nguyễn Văn A',
      publishDate: '2025-05-15',
      status: 'published',
      content: 'Nội dung bài viết 1',
      thumbnail:
        'https://img.freepik.com/free-photo/health-still-life-with-copy-space_23-2148854034.jpg',
    },
    {
      id: 2,
      title: 'Phòng ngừa bệnh lây qua đường tình dục',
      category: 'Phòng ngừa',
      author: 'Dr. Trần Thị B',
      publishDate: '2025-06-01',
      status: 'published',
      content: 'Nội dung bài viết 2',
      thumbnail:
        'https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg',
    },
    {
      id: 3,
      title: 'Các xét nghiệm STI phổ biến',
      category: 'Xét nghiệm',
      author: 'Dr. Lê Văn C',
      publishDate: '2025-06-10',
      status: 'draft',
      content: 'Nội dung bài viết 3',
      thumbnail:
        'https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg',
    },
    {
      id: 4,
      title: 'Tìm hiểu về sức khỏe sinh sản',
      category: 'Sức khỏe',
      author: 'Dr. Phạm Thị D',
      publishDate: '2025-06-15',
      status: 'published',
      content: 'Nội dung bài viết 4',
      thumbnail:
        'https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg',
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: '',
    author: '',
    content: '',
    status: 'draft',
    thumbnail: '',
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
    setCurrentBlog(null);
    setForm({
      title: '',
      category: '',
      author: '',
      content: '',
      status: 'draft',
      thumbnail: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (blog) => {
    setCurrentBlog(blog);
    setForm({
      title: blog.title,
      category: blog.category,
      author: blog.author,
      content: blog.content || '',
      status: blog.status,
      thumbnail: blog.thumbnail || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBlog = () => {
    if (!form.title || !form.category || !form.author) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (currentBlog) {
        // Edit
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === currentBlog.id
              ? { ...b, ...form, publishDate: b.publishDate }
              : b
          )
        );
      } else {
        // Add
        setBlogs((prev) => [
          ...prev,
          {
            ...form,
            id: prev.length ? Math.max(...prev.map((b) => b.id)) + 1 : 1,
            publishDate: new Date().toISOString().slice(0, 10),
          },
        ]);
      }
      setLoading(false);
      setOpenDialog(false);
    }, 800);
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setLoading(true);
      setTimeout(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setLoading(false);
      }, 600);
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
    <Box sx={gradientBg}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3, px: 2 }}>
        {/* Header with logo and title */}
        <Box sx={headerStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LibraryBooksIcon sx={{ fontSize: 30, mr: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Quản lý Blog
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                viewMode === 'table' ? <FilterListIcon /> : <LibraryBooksIcon />
              }
              onClick={() =>
                setViewMode(viewMode === 'table' ? 'grid' : 'table')
              }
              sx={secondaryButtonStyle}
            >
              {viewMode === 'table' ? 'XEM DẠNG LƯỚI' : 'XEM DẠNG BẢNG'}
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={primaryButtonStyle}
            >
              THÊM BÀI VIẾT
            </Button>
          </Box>
        </Box>

        {/* Search bar and filters */}
        <Box sx={{ mb: 3, display: 'flex' }}>
          <Box sx={{ ...searchBarStyle, maxWidth: '500px' }}>
            <SearchIcon sx={{ color: colors.primary, mr: 1 }} />
            <TextField
              fullWidth
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={handleSearch}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                '& input': {
                  padding: '8px 0',
                  fontWeight: 500,
                  color: colors.text,
                },
              }}
            />
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Total Articles */}
          <Fade in={true} style={{ transitionDelay: '100ms' }}>
            <Box sx={statCardStyle}>
              <Typography
                variant="overline"
                sx={{ color: colors.darkGray, opacity: 0.7 }}
              >
                TỔNG SỐ BÀI VIẾT
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: colors.primary }}
                >
                  {blogs.length}
                </Typography>
                <LibraryBooksIcon
                  sx={{
                    fontSize: 36,
                    ml: 'auto',
                    color: colors.primary,
                    opacity: 0.3,
                  }}
                />
              </Box>
            </Box>
          </Fade>

          {/* Published */}
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Box sx={statCardStyle}>
              <Typography
                variant="overline"
                sx={{ color: colors.darkGray, opacity: 0.7 }}
              >
                ĐÃ XUẤT BẢN
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: colors.success }}
                >
                  {blogs.filter((b) => b.status === 'published').length}
                </Typography>
                <LibraryBooksIcon
                  sx={{
                    fontSize: 36,
                    ml: 'auto',
                    color: colors.success,
                    opacity: 0.3,
                  }}
                />
              </Box>
            </Box>
          </Fade>

          {/* Drafts */}
          <Fade in={true} style={{ transitionDelay: '300ms' }}>
            <Box sx={statCardStyle}>
              <Typography
                variant="overline"
                sx={{ color: colors.darkGray, opacity: 0.7 }}
              >
                BẢN NHÁP
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: colors.secondary }}
                >
                  {blogs.filter((b) => b.status === 'draft').length}
                </Typography>
                <LibraryBooksIcon
                  sx={{
                    fontSize: 36,
                    ml: 'auto',
                    color: colors.secondary,
                    opacity: 0.3,
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Blog List Table */}
        <Fade in={true}>
          <TableContainer component={Paper} sx={cardStyle}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={tableHeadStyle}>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <CircularProgress
                        size={40}
                        sx={{ color: colors.primary }}
                      />
                    </TableCell>
                  </TableRow>
                ) : filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography
                        variant="body1"
                        sx={{ color: colors.darkGray, opacity: 0.7 }}
                      >
                        Không tìm thấy bài viết nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((blog) => (
                      <TableRow
                        key={blog.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(32, 178, 170, 0.03)',
                          },
                        }}
                      >
                        <TableCell>{blog.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={blog.thumbnail}
                              variant="rounded"
                              sx={{
                                width: 40,
                                height: 40,
                                mr: 2,
                                borderRadius: 2,
                              }}
                            />
                            <Typography sx={{ fontWeight: 500 }}>
                              {blog.title}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={blog.category}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              bgcolor: 'rgba(32, 178, 170, 0.1)',
                              color: colors.primary,
                            }}
                          />
                        </TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>
                          {new Date(blog.publishDate).toLocaleDateString(
                            'vi-VN'
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              blog.status === 'published'
                                ? 'Đã xuất bản'
                                : 'Bản nháp'
                            }
                            color={
                              blog.status === 'published'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor:
                                blog.status === 'published'
                                  ? 'rgba(46, 139, 87, 0.1)'
                                  : 'rgba(95, 158, 160, 0.1)',
                              color:
                                blog.status === 'published'
                                  ? colors.success
                                  : colors.secondary,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Xem trước">
                            <IconButton
                              size="small"
                              color="info"
                              sx={iconButtonStyle}
                              onClick={() => alert(blog.content)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              color="primary"
                              sx={iconButtonStyle}
                              onClick={() => handleOpenEditDialog(blog)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              sx={iconButtonStyle}
                              onClick={() => handleDeleteBlog(blog.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
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
              sx={{
                color: colors.text,
                '.MuiTablePagination-selectIcon': { color: colors.text },
              }}
            />
          </TableContainer>
        </Fade>

        {/* Add/Edit Blog Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: colors.primary,
              color: colors.white,
              fontWeight: 600,
            }}
          >
            {currentBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </DialogTitle>

          <DialogContent sx={{ pt: 3, pb: 1 }}>
            <Box component="form">
              <TextField
                fullWidth
                label="Tiêu đề bài viết"
                margin="normal"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    label="Danh mục"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="Sức khỏe">Sức khỏe</MenuItem>
                    <MenuItem value="Phòng ngừa">Phòng ngừa</MenuItem>
                    <MenuItem value="Xét nghiệm">Xét nghiệm</MenuItem>
                    <MenuItem value="Điều trị">Điều trị</MenuItem>
                    <MenuItem value="Tư vấn">Tư vấn</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={form.status}
                    label="Trạng thái"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="published">Xuất bản</MenuItem>
                    <MenuItem value="draft">Bản nháp</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                label="Tác giả"
                margin="normal"
                name="author"
                value={form.author}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="URL hình ảnh (tuỳ chọn)"
                margin="normal"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                sx={{ mb: 2 }}
              />
              {form.thumbnail && (
                <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{ mb: 1, display: 'block' }}
                  >
                    Xem trước hình ảnh
                  </Typography>
                  <img
                    src={form.thumbnail}
                    alt="Blog thumbnail preview"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '200px',
                      borderRadius: '8px',
                    }}
                  />
                </Box>
              )}

              <TextField
                fullWidth
                label="Nội dung bài viết"
                multiline
                rows={6}
                margin="normal"
                name="content"
                value={form.content}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                color: colors.darkGray,
                borderColor: colors.lightGray,
                '&:hover': {
                  borderColor: colors.darkGray,
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSaveBlog}
              variant="contained"
              disabled={loading}
              sx={primaryButtonStyle}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {currentBlog ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default BlogManagementContent;

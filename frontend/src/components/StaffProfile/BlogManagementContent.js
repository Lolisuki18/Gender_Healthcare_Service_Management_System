/**
 * BlogManagementContent.js
 *
 * Mục đích: Quản lý bài viết blog
 * - Hiển thị danh sách bài viết
 * - Thêm/sửa/xóa bài viết
 * - Quản lý nội dung và trạng thái bài viết
 */

import React, { useState, useEffect } from 'react';
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
import blogService from '../../services/blogService';
import BlogDetailModal from './modals/BlogDetailModal';

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
  // State management
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await blogService.getAllBlogs();
        console.log('API getAllBlogs raw:', data);
        setBlogs(data);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setLoading(true);
      try {
        await blogService.deleteBlog(id);
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      } catch (err) {
        setError(err.message || 'Xoá blog thất bại');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API cập nhật trạng thái (giả sử có blogService.updateBlogStatus)
      await blogService.updateBlog(id, { status: newStatus });
      setBlogs((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      setError(err.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Thống kê
  const totalBlogs = blogs.length;
  const confirmedBlogs = blogs.filter(b => b.status === 'CONFIRMED').length;
  const processingBlogs = blogs.filter(b => b.status === 'PROCESSING').length;

  // Bộ lọc status
  const statusOptions = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'CONFIRMED', label: 'Đã duyệt' },
    { value: 'PROCESSING', label: 'Chờ duyệt' },
    { value: 'CANCELED', label: 'Đã huỷ' },
  ];

  // Bộ lọc ngày
  const [dateFilter, setDateFilter] = useState('');
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setPage(0);
  };

  // Filter blogs theo search, status, ngày
  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.authorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || blog.status === statusFilter;
    let matchDate = true;
    if (dateFilter) {
      // createdAt là array [YYYY, MM, DD, ...]
      const dateStr = blog.createdAt ? `${blog.createdAt[0]}-${String(blog.createdAt[1]).padStart(2, '0')}-${String(blog.createdAt[2]).padStart(2, '0')}` : '';
      matchDate = dateStr === dateFilter;
    }
    return matchSearch && matchStatus && matchDate;
  });

  // Debug log
  console.log('blogs:', blogs);
  console.log('filteredBlogs:', filteredBlogs);
  console.log('searchTerm:', searchTerm, 'statusFilter:', statusFilter);

  // Hàm format ngày xuất bản
  function formatDateVN(date) {
    if (!date) return '';
    let d = date;
    if (Array.isArray(d) && d.length >= 3) {
      d = new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0, d[5] || 0, d[6] || 0);
    } else if (!(d instanceof Date)) {
      d = new Date(d);
    }
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedBlog(null);
  };

  const handleReject = async (blog, reason) => {
    if (!reason || !reason.trim()) return;
    setLoading(true);
    try {
      await blogService.updateBlogStatus(blog.id, { status: 'CANCELED', rejectionReason: reason });
      setBlogs((prev) => prev.map((b) => b.id === blog.id ? { ...b, status: 'CANCELED' } : b));
      setOpenDetailModal(false);
      setSelectedBlog(null);
    } catch (err) {
      setError(err.message || 'Từ chối bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Thống kê tổng số bài viết */}
        <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
          <Paper sx={{ p: 2, minWidth: 180, textAlign: 'center' }}>
            <Typography variant="h6">Tổng số bài viết</Typography>
            <Typography variant="h4" color="primary">{totalBlogs}</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 180, textAlign: 'center' }}>
            <Typography variant="h6">Đã duyệt</Typography>
            <Typography variant="h4" color="success.main">{confirmedBlogs}</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 180, textAlign: 'center' }}>
            <Typography variant="h6">Chờ duyệt</Typography>
            <Typography variant="h4" color="warning.main">{processingBlogs}</Typography>
          </Paper>
        </Box>

        {/* Bộ lọc status và ngày */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={e => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ngày tạo"
            type="date"
            size="small"
            value={dateFilter}
            onChange={handleDateFilterChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
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
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>
                          {blog.categoryIsActive === false ? 'Danh mục đã bị xoá' : (blog.categoryName || 'Chưa phân loại')}
                        </TableCell>
                        <TableCell>{blog.authorName || ''}</TableCell>
                        <TableCell>{formatDateVN(blog.createdAt)}</TableCell>
                        <TableCell>
                          {blog.status === 'CONFIRMED' && <Chip label="Đã duyệt" color="success" size="small" />}
                          {blog.status === 'PROCESSING' && <Chip label="Chờ duyệt" color="warning" size="small" />}
                          {blog.status === 'CANCELED' && <Chip label="Đã huỷ" color="error" size="small" />}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Xem trước">
                            <IconButton
                              size="small"
                              color="info"
                              sx={iconButtonStyle}
                              onClick={() => handleView(blog)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              sx={iconButtonStyle}
                              onClick={() => handleReject(blog, '')}
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

        <BlogDetailModal
          open={openDetailModal}
          blog={selectedBlog}
          onClose={handleCloseDetailModal}
          onReject={handleReject}
        />
      </Box>
    </Box>
  );
};

export default BlogManagementContent;

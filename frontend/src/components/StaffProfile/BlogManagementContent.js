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
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  LibraryBooks as LibraryBooksIcon,
  CloudUpload as CloudUploadIcon,
  Remove as RemoveIcon,
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
  const [categories, setCategories] = useState([]);
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

  // File states
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [sectionFiles, setSectionFiles] = useState({});
  const [sectionImageIndexes, setSectionImageIndexes] = useState([]);

  // Fetch blogs and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [blogsData, categoriesData] = await Promise.all([
          blogService.getAllBlogs(),
          blogService.getCategories()
        ]);
        console.log('API getAllBlogs raw:', blogsData);
        console.log('API getCategories raw:', categoriesData);
        setBlogs(blogsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Form state
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    thumbnail: null,
    existingThumbnail: '',
    sections: []
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
      content: '',
      categoryId: '',
      thumbnail: null,
      existingThumbnail: '',
      sections: []
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setSectionFiles({});
    setSectionImageIndexes([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (blog) => {
    setCurrentBlog(blog);
    setForm({
      title: blog.title || '',
      content: blog.content || '',
      categoryId: blog.categoryId || '',
      thumbnail: null,
      existingThumbnail: blog.thumbnailImage || '',
      sections: blog.sections || []
    });
    setThumbnailFile(null);
    setThumbnailPreview(blog.thumbnailImage || '');
    setSectionFiles({});
    setSectionImageIndexes([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSectionChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addSection = () => {
    setForm(prev => ({
      ...prev,
      sections: [...prev.sections, {
        sectionTitle: '',
        sectionContent: '',
        sectionImage: '',
        existingSectionImage: '',
        displayOrder: prev.sections.length
      }]
    }));
  };

  const removeSection = (index) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
    setSectionFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[index];
      return newFiles;
    });
  };

  const handleSectionImageChange = (index, file) => {
    if (file) {
      setSectionFiles(prev => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm(prev => ({
          ...prev,
          sections: prev.sections.map((section, i) => 
            i === index ? { ...section, sectionImage: e.target.result } : section
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBlog = async () => {
    if (!form.title || !form.content || !form.categoryId) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }

    // Kiểm tra thumbnail cho bài viết mới
    if (!currentBlog && !thumbnailFile) {
      alert('Vui lòng chọn hình ảnh đại diện cho bài viết!');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add thumbnail
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (currentBlog && form.existingThumbnail) {
        // Nếu đang edit và có thumbnail cũ, gửi existingThumbnail
        requestData.existingThumbnail = form.existingThumbnail;
      }
      
      // Add section images
      const sectionImages = [];
      const sectionImageIndexes = [];
      Object.keys(sectionFiles).forEach(index => {
        sectionImages.push(sectionFiles[index]);
        sectionImageIndexes.push(parseInt(index));
      });
      
      if (sectionImages.length > 0) {
        sectionImages.forEach((file, i) => {
          formData.append('sectionImages', file);
        });
        sectionImageIndexes.forEach(index => {
          formData.append('sectionImageIndexes', index);
        });
      }

      // Add request data
      const requestData = {
        title: form.title,
        content: form.content,
        categoryId: parseInt(form.categoryId),
        sections: form.sections
          .filter(section => section.sectionTitle || section.sectionContent) // Chỉ gửi sections có nội dung
          .map((section, index) => ({
            sectionTitle: section.sectionTitle || '',
            sectionContent: section.sectionContent || '',
            sectionImage: section.sectionImage || '',
            existingSectionImage: section.existingSectionImage || '',
            displayOrder: index
          }))
      };

      formData.append('request', new Blob([JSON.stringify(requestData)], {
        type: 'application/json'
      }));

      let response;
      if (currentBlog) {
        response = await blogService.updateBlog(currentBlog.id, formData);
      } else {
        response = await blogService.createBlog(formData);
      }

      // Refresh blogs list
      const updatedBlogs = await blogService.getAllBlogs();
      setBlogs(updatedBlogs);
      
      setOpenDialog(false);
      alert(currentBlog ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết thành công!');
    } catch (err) {
      setError(err.message || 'Lưu bài viết thất bại');
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
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
          maxWidth="xl"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxHeight: '95vh',
              width: '90vw',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: colors.white,
              fontWeight: 700,
              fontSize: '1.5rem',
              padding: '20px 30px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <LibraryBooksIcon sx={{ fontSize: 28 }} />
            {currentBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </DialogTitle>

          <DialogContent sx={{ 
            pt: 4, 
            pb: 2, 
            px: 4,
            overflowY: 'auto',
            maxHeight: 'calc(95vh - 140px)', // Trừ đi header và footer
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(32, 178, 170, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: colors.primary,
              borderRadius: '4px',
              '&:hover': {
                background: colors.secondary,
              },
            },
          }}>
            <Box component="form">
              <TextField
                fullWidth
                label="Tiêu đề bài viết *"
                margin="normal"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.primary,
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  },
                }}
                required
              />

              <FormControl fullWidth margin="normal" sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.primary,
                },
              }}>
                <InputLabel>Danh mục *</InputLabel>
                <Select
                  name="categoryId"
                  value={form.categoryId}
                  label="Danh mục *"
                  onChange={handleFormChange}
                  required
                >
                  {categories.map(category => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Thumbnail Upload */}
              <Box sx={{ 
                mb: 4,
                p: 3,
                backgroundColor: 'rgba(32, 178, 170, 0.05)',
                borderRadius: 3,
                border: '2px dashed rgba(32, 178, 170, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: colors.primary,
                  backgroundColor: 'rgba(32, 178, 170, 0.08)',
                }
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.primary }}>
                  🖼️ Hình ảnh đại diện *
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: colors.darkGray, opacity: 0.8 }}>
                  Chọn hình ảnh đại diện cho bài viết. Hình ảnh sẽ được hiển thị ở đầu bài viết.
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="thumbnail-upload"
                  type="file"
                  onChange={handleThumbnailChange}
                />
                <label htmlFor="thumbnail-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      mb: 2,
                      borderRadius: 2,
                      borderColor: colors.primary,
                      color: colors.primary,
                      fontWeight: 600,
                      padding: '12px 24px',
                      '&:hover': {
                        backgroundColor: 'rgba(32, 178, 170, 0.1)',
                        borderColor: colors.secondary,
                      }
                    }}
                  >
                    Chọn hình ảnh
                  </Button>
                </label>
                {(thumbnailPreview || form.existingThumbnail) && (
                  <Box sx={{ 
                    mt: 3, 
                    textAlign: 'center',
                    p: 2,
                    backgroundColor: colors.white,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Typography variant="caption" sx={{ mb: 2, display: 'block', color: colors.darkGray }}>
                      Xem trước hình ảnh
                    </Typography>
                    <img
                      src={thumbnailPreview || form.existingThumbnail}
                      alt="Thumbnail preview"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    />
                  </Box>
                )}
              </Box>

              <TextField
                fullWidth
                label="Nội dung chính *"
                margin="normal"
                name="content"
                value={form.content}
                onChange={handleFormChange}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.primary,
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  },
                }}
                required
              />

              {/* Sections */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(32, 178, 170, 0.05)',
                  borderRadius: 2,
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary }}>
                      📝 Các phần bổ sung (tùy chọn)
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.darkGray, opacity: 0.8 }}>
                      Thêm các phần nội dung bổ sung với hình ảnh
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addSection}
                    sx={{
                      backgroundColor: colors.primary,
                      borderRadius: 2,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: colors.secondary,
                      }
                    }}
                  >
                    Thêm phần
                  </Button>
                </Box>

                {form.sections.map((section, index) => (
                  <Card key={index} sx={{ 
                    mb: 4, 
                    p: 4, 
                    border: '2px solid rgba(32, 178, 170, 0.2)',
                    borderRadius: 3,
                    backgroundColor: colors.white,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                      borderColor: colors.primary,
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 4,
                      pb: 2,
                      borderBottom: '2px solid rgba(32, 178, 170, 0.1)'
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>📄</span>
                        Phần {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeSection(index)}
                        sx={{
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Tiêu đề phần"
                          value={section.sectionTitle}
                          onChange={(e) => handleSectionChange(index, 'sectionTitle', e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: colors.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.primary,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.primary,
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '1rem',
                              fontWeight: 500,
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Nội dung phần"
                          value={section.sectionContent}
                          onChange={(e) => handleSectionChange(index, 'sectionContent', e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: colors.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.primary,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: colors.primary,
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '1rem',
                              lineHeight: 1.6,
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{
                          p: 2,
                          backgroundColor: 'rgba(32, 178, 170, 0.03)',
                          borderRadius: 2,
                          border: '1px dashed rgba(32, 178, 170, 0.3)',
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: colors.primary }}>
                            🖼️ Hình ảnh phần (tùy chọn)
                          </Typography>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`section-image-${index}`}
                            type="file"
                            onChange={(e) => handleSectionImageChange(index, e.target.files[0])}
                          />
                          <label htmlFor={`section-image-${index}`}>
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              size="small"
                              sx={{ 
                                mb: 2,
                                borderRadius: 2,
                                borderColor: colors.primary,
                                color: colors.primary,
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: 'rgba(32, 178, 170, 0.1)',
                                  borderColor: colors.secondary,
                                }
                              }}
                            >
                              Chọn hình ảnh
                            </Button>
                          </label>
                          {(section.sectionImage || section.existingSectionImage) && (
                            <Box sx={{ 
                              mt: 2,
                              textAlign: 'center',
                              p: 2,
                              backgroundColor: colors.white,
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: colors.darkGray }}>
                                Xem trước hình ảnh phần {index + 1}
                              </Typography>
                              <img
                                src={section.sectionImage || section.existingSectionImage}
                                alt={`Section ${index + 1} preview`}
                                style={{
                                  maxWidth: '100%',
                                  height: 'auto',
                                  maxHeight: '150px',
                                  borderRadius: '12px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            p: 4, 
            backgroundColor: 'rgba(32, 178, 170, 0.02)',
            borderTop: '1px solid rgba(32, 178, 170, 0.1)'
          }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                color: colors.darkGray,
                borderColor: colors.lightGray,
                borderRadius: 2,
                fontWeight: 600,
                padding: '12px 24px',
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
              sx={{
                ...primaryButtonStyle,
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(32, 178, 170, 0.4)',
                '&:hover': {
                  backgroundColor: colors.secondary,
                  boxShadow: '0 6px 20px rgba(32, 178, 170, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  backgroundColor: colors.lightGray,
                  color: colors.darkGray,
                  boxShadow: 'none',
                  transform: 'none',
                }
              }}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {currentBlog ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}
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

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
  Check as CheckIcon,
} from '@mui/icons-material';
import blogService from '../../services/blogService';
import categoryService from '../../services/categoryService';
import BlogDetailModal from './modals/BlogDetailModal';

// Modern theme colors
const colors = {
  primary: '#6366F1', // Indigo
  secondary: '#8B5CF6', // Violet
  accent: '#06B6D4', // Cyan
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  text: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  border: '#E2E8F0', // Slate 200
  success: '#10B981', // Emerald 500
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber 500
  info: '#3B82F6', // Blue 500
};

const gradientBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
  padding: 0,
};

const headerStyle = {
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  color: 'white',
  padding: '24px 32px',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.15)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
    borderRadius: '16px',
  },
};

const cardStyle = {
  backgroundColor: colors.surface,
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  color: colors.text,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${colors.border}`,
  '&:hover': {
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
    transform: 'translateY(-2px)',
  },
};

const statCardStyle = {
  backgroundColor: colors.surface,
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  color: colors.text,
  padding: 3,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${colors.border}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
  },
};

const tableHeadStyle = {
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  '& th': {
    color: colors.surface,
    fontWeight: 700,
    padding: '20px 16px',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

const iconButtonStyle = {
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  margin: '0 4px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    transform: 'scale(1.05)',
  },
};

const primaryButtonStyle = {
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  color: colors.surface,
  fontWeight: 700,
  borderRadius: '12px',
  padding: '12px 28px',
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textTransform: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    background: 'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
    transform: 'translateY(-2px)',
  },
};

const secondaryButtonStyle = {
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  color: colors.primary,
  fontWeight: 600,
  borderRadius: '12px',
  padding: '12px 28px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textTransform: 'none',
  fontSize: '0.875rem',
  border: `1px solid ${colors.primary}`,
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    transform: 'translateY(-1px)',
  },
};

const searchBarStyle = {
  backgroundColor: colors.surface,
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  padding: '8px 20px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${colors.border}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:focus-within': {
    boxShadow:
      '0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    borderColor: colors.primary,
  },
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
          categoryService.getCategories(),
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
    sections: [],
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
      sections: [],
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
      sections: blog.sections || [],
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
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          sectionTitle: '',
          sectionContent: '',
          sectionImage: '',
          existingSectionImage: '',
          displayOrder: prev.sections.length,
        },
      ],
    }));
  };

  const removeSection = (index) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    setSectionFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[index];
      return newFiles;
    });
  };

  const handleSectionImageChange = (index, file) => {
    if (file) {
      setSectionFiles((prev) => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((prev) => ({
          ...prev,
          sections: prev.sections.map((section, i) =>
            i === index
              ? { ...section, sectionImage: e.target.result }
              : section
          ),
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
      Object.keys(sectionFiles).forEach((index) => {
        sectionImages.push(sectionFiles[index]);
        sectionImageIndexes.push(parseInt(index));
      });

      if (sectionImages.length > 0) {
        sectionImages.forEach((file, i) => {
          formData.append('sectionImages', file);
        });
        sectionImageIndexes.forEach((index) => {
          formData.append('sectionImageIndexes', index);
        });
      }

      // Add request data
      const requestData = {
        title: form.title,
        content: form.content,
        categoryId: parseInt(form.categoryId),
        sections: form.sections
          .filter((section) => section.sectionTitle || section.sectionContent) // Chỉ gửi sections có nội dung
          .map((section, index) => ({
            sectionTitle: section.sectionTitle || '',
            sectionContent: section.sectionContent || '',
            sectionImage: section.sectionImage || '',
            existingSectionImage: section.existingSectionImage || '',
            displayOrder: index,
          })),
      };

      formData.append(
        'request',
        new Blob([JSON.stringify(requestData)], {
          type: 'application/json',
        })
      );

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
      alert(
        currentBlog
          ? 'Cập nhật bài viết thành công!'
          : 'Tạo bài viết thành công!'
      );
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
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      setError(err.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Thống kê
  const totalBlogs = blogs.length;
  const confirmedBlogs = blogs.filter((b) => b.status === 'CONFIRMED').length;
  const processingBlogs = blogs.filter((b) => b.status === 'PROCESSING').length;

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
      (blog.categoryName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blog.authorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || blog.status === statusFilter;
    let matchDate = true;
    if (dateFilter) {
      // createdAt là array [YYYY, MM, DD, ...]
      const dateStr = blog.createdAt
        ? `${blog.createdAt[0]}-${String(blog.createdAt[1]).padStart(2, '0')}-${String(blog.createdAt[2]).padStart(2, '0')}`
        : '';
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
      d = new Date(
        d[0],
        d[1] - 1,
        d[2],
        d[3] || 0,
        d[4] || 0,
        d[5] || 0,
        d[6] || 0
      );
    } else if (!(d instanceof Date)) {
      d = new Date(d);
    }
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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
      await blogService.updateBlogStatus(blog.id, {
        status: 'CANCELED',
        rejectionReason: reason,
      });
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, status: 'CANCELED' } : b))
      );
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
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={statCardStyle}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <LibraryBooksIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}
                >
                  Tổng số bài viết
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  {totalBlogs}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={statCardStyle}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <CheckIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}
                >
                  Đã duyệt
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: colors.success, fontWeight: 700 }}
                >
                  {confirmedBlogs}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={statCardStyle}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <FilterListIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}
                >
                  Chờ duyệt
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: colors.warning, fontWeight: 700 }}
                >
                  {processingBlogs}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Bộ lọc status và ngày */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, color: colors.text, fontWeight: 600 }}
          >
            🔍 Bộ lọc tìm kiếm
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.textSecondary }}>
                  Trạng thái
                </InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                  }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Ngày tạo"
                type="date"
                size="small"
                fullWidth
                value={dateFilter}
                onChange={handleDateFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                onClick={() => {
                  setStatusFilter('ALL');
                  setDateFilter('');
                  setSearchTerm('');
                }}
                sx={{
                  height: '40px',
                  borderRadius: '12px',
                  borderColor: colors.border,
                  color: colors.textSecondary,
                  '&:hover': {
                    borderColor: colors.primary,
                    color: colors.primary,
                  },
                }}
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </Paper>

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
                          {blog.categoryIsActive === false
                            ? 'Danh mục đã bị xoá'
                            : blog.categoryName || 'Chưa phân loại'}
                        </TableCell>
                        <TableCell>{blog.authorName || ''}</TableCell>
                        <TableCell>{formatDateVN(blog.createdAt)}</TableCell>
                        <TableCell>
                          {blog.status === 'CONFIRMED' && (
                            <Chip
                              label="Đã duyệt"
                              sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: colors.success,
                                fontWeight: 600,
                                borderRadius: '8px',
                                '& .MuiChip-label': {
                                  px: 2,
                                },
                              }}
                              size="small"
                            />
                          )}
                          {blog.status === 'PROCESSING' && (
                            <Chip
                              label="Chờ duyệt"
                              sx={{
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                color: colors.warning,
                                fontWeight: 600,
                                borderRadius: '8px',
                                '& .MuiChip-label': {
                                  px: 2,
                                },
                              }}
                              size="small"
                            />
                          )}
                          {blog.status === 'CANCELED' && (
                            <Chip
                              label="Đã huỷ"
                              sx={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: colors.error,
                                fontWeight: 600,
                                borderRadius: '8px',
                                '& .MuiChip-label': {
                                  px: 2,
                                },
                              }}
                              size="small"
                            />
                          )}
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
                          {blog.status === 'PROCESSING' && (
                            <Tooltip title="Duyệt bài viết">
                              <IconButton
                                size="small"
                                color="success"
                                sx={iconButtonStyle}
                                onClick={async () => {
                                  setLoading(true);
                                  try {
                                    await blogService.updateBlogStatus(
                                      blog.id,
                                      { status: 'CONFIRMED' }
                                    );
                                    setBlogs((prev) =>
                                      prev.map((b) =>
                                        b.id === blog.id
                                          ? { ...b, status: 'CONFIRMED' }
                                          : b
                                      )
                                    );
                                  } catch (err) {
                                    setError(
                                      err.message || 'Duyệt bài viết thất bại'
                                    );
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: colors.surface,
              fontWeight: 700,
              fontSize: '1.5rem',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
              },
            }}
          >
            <LibraryBooksIcon sx={{ fontSize: 32, zIndex: 1 }} />
            <Typography variant="h5" sx={{ zIndex: 1 }}>
              {currentBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{
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
            }}
          >
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
                    fontFamily:
                      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  },
                }}
                required
              />

              <FormControl
                fullWidth
                margin="normal"
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
                }}
              >
                <InputLabel>Danh mục *</InputLabel>
                <Select
                  name="categoryId"
                  value={form.categoryId}
                  label="Danh mục *"
                  onChange={handleFormChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Thumbnail Upload */}
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  backgroundColor: 'rgba(32, 178, 170, 0.05)',
                  borderRadius: 3,
                  border: '2px dashed rgba(32, 178, 170, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(32, 178, 170, 0.08)',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: colors.primary }}
                >
                  🖼️ Hình ảnh đại diện *
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: colors.darkGray, opacity: 0.8 }}
                >
                  Chọn hình ảnh đại diện cho bài viết. Hình ảnh sẽ được hiển thị
                  ở đầu bài viết.
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
                      },
                    }}
                  >
                    Chọn hình ảnh
                  </Button>
                </label>
                {(thumbnailPreview || form.existingThumbnail) && (
                  <Box
                    sx={{
                      mt: 3,
                      textAlign: 'center',
                      p: 2,
                      backgroundColor: colors.white,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ mb: 2, display: 'block', color: colors.darkGray }}
                    >
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
                    fontFamily:
                      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  },
                }}
                required
              />

              {/* Sections */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    p: 2,
                    backgroundColor: 'rgba(32, 178, 170, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: colors.primary }}
                    >
                      📝 Các phần bổ sung (tùy chọn)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.darkGray, opacity: 0.8 }}
                    >
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
                      },
                    }}
                  >
                    Thêm phần
                  </Button>
                </Box>

                {form.sections.map((section, index) => (
                  <Card
                    key={index}
                    sx={{
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
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                        pb: 2,
                        borderBottom: '2px solid rgba(32, 178, 170, 0.1)',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: colors.primary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
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
                          },
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
                          onChange={(e) =>
                            handleSectionChange(
                              index,
                              'sectionTitle',
                              e.target.value
                            )
                          }
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
                              fontFamily:
                                '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Nội dung phần"
                          value={section.sectionContent}
                          onChange={(e) =>
                            handleSectionChange(
                              index,
                              'sectionContent',
                              e.target.value
                            )
                          }
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
                              fontFamily:
                                '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: 'rgba(32, 178, 170, 0.03)',
                            borderRadius: 2,
                            border: '1px dashed rgba(32, 178, 170, 0.3)',
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 2,
                              fontWeight: 600,
                              color: colors.primary,
                            }}
                          >
                            🖼️ Hình ảnh phần (tùy chọn)
                          </Typography>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`section-image-${index}`}
                            type="file"
                            onChange={(e) =>
                              handleSectionImageChange(index, e.target.files[0])
                            }
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
                                },
                              }}
                            >
                              Chọn hình ảnh
                            </Button>
                          </label>
                          {(section.sectionImage ||
                            section.existingSectionImage) && (
                            <Box
                              sx={{
                                mt: 2,
                                textAlign: 'center',
                                p: 2,
                                backgroundColor: colors.white,
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  mb: 2,
                                  display: 'block',
                                  color: colors.darkGray,
                                }}
                              >
                                Xem trước hình ảnh phần {index + 1}
                              </Typography>
                              <img
                                src={
                                  section.sectionImage ||
                                  section.existingSectionImage
                                }
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

          <DialogActions
            sx={{
              p: 4,
              backgroundColor: 'rgba(32, 178, 170, 0.02)',
              borderTop: '1px solid rgba(32, 178, 170, 0.1)',
            }}
          >
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
                },
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

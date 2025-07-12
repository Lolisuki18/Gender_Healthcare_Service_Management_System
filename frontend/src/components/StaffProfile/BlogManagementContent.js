/**
 * BlogManagementContent.js
 *
 * Mục đích: Quản lý bài viết blog
 * - Hiển thị danh sách bài viết
 * - Thêm/sửa/xóa bài viết
 * - Quản lý nội dung và trạng thái bài viết
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import blogService from '../../services/blogService';
import categoryService from '../../services/categoryService';

import BlogDetailModal from './modals/BlogDetailModal';
import BlogForm from '../common/BlogForm';

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
  backgroundColor: '#fff',
  borderRadius: '18px',
  boxShadow: '0 4px 16px rgba(74, 144, 226, 0.10)',
  color: '#264653',
  overflow: 'hidden',
  transition: 'all 0.2s',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(74, 144, 226, 0.18)',
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
  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
  '& th': {
    color: 'white',
    fontWeight: 700,
    padding: '18px',
    fontSize: '1.1rem',
    letterSpacing: 0.5,
  },
};

const iconButtonStyle = {
  transition: 'all 0.2s',
  margin: '0 4px',
  borderRadius: '50%',
  background: 'rgba(74, 144, 226, 0.07)',
  '&:hover': {
    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
    color: 'white',
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

const BlogStatCard = ({ title, value, color, borderColor }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 220,
      background: '#fff',
      borderRadius: '18px',
      boxShadow: '0 4px 16px rgba(74, 144, 226, 0.10)',
      p: 3,
      textAlign: 'center',
      borderBottom: `4px solid ${borderColor}`,
      transition: 'all 0.2s',
      '&:hover': {
        boxShadow: `0 8px 24px ${borderColor}33`,
        transform: 'translateY(-2px) scale(1.03)',
      },
    }}
  >
    <Typography
      variant="body2"
      sx={{ fontWeight: 700, color: '#264653', mb: 1 }}
    >
      {title}
    </Typography>
    <Typography variant="h5" sx={{ color, fontWeight: 900, letterSpacing: 1 }}>
      {value}
    </Typography>
  </Box>
);

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
  // State cho dialog xác nhận xóa
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    blogId: null,
  });
  // State cho snackbar thông báo thành công khi xóa
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  // State cho snackbar thông báo thành công khi tạo/cập nhật
  const [saveSuccess, setSaveSuccess] = useState({
    open: false,
    isUpdate: false,
  });

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
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }

    // Kiểm tra thumbnail cho bài viết mới
    if (!currentBlog && !thumbnailFile) {
      setError('Vui lòng chọn hình ảnh đại diện cho bài viết!');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      // Build requestData
      const requestData = {
        title: form.title,
        content: form.content,
        categoryId: parseInt(form.categoryId),
        existingThumbnail:
          currentBlog && !thumbnailFile ? form.existingThumbnail : undefined,
        sections: form.sections
          .filter((section) => section.sectionTitle || section.sectionContent)
          .map((section, index) => ({
            sectionTitle: section.sectionTitle || '',
            sectionContent: section.sectionContent || '',
            sectionImage: section.sectionImage || '',
            existingSectionImage: section.existingSectionImage || '',
            displayOrder: index,
          })),
        // Only set status for new blog
        ...(currentBlog ? {} : { status: 'PROCESSING' }),
      };
      // Always append 'request' part
      formData.append(
        'request',
        new Blob([JSON.stringify(requestData)], { type: 'application/json' })
      );
      // Only append thumbnail if new file is selected
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      // Add section images if any
      const sectionImages = [];
      const sectionImageIndexes = [];
      Object.keys(sectionFiles).forEach((index) => {
        sectionImages.push(sectionFiles[index]);
        sectionImageIndexes.push(parseInt(index));
      });
      if (sectionImages.length > 0) {
        sectionImages.forEach((file) => {
          formData.append('sectionImages', file);
        });
        sectionImageIndexes.forEach((index) => {
          formData.append('sectionImageIndexes', index);
        });
      }
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
      setSaveSuccess({ open: true, isUpdate: !!currentBlog });
    } catch (err) {
      setError(err.message || 'Lưu bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (id) => {
    setDeleteDialog({ open: true, blogId: id });
  };

  // Đóng dialog xác nhận xóa
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, blogId: null });
  };

  // Đảm bảo logic xóa blog khi xác nhận:
  const handleConfirmDeleteBlog = async () => {
    const id = deleteDialog.blogId;
    setLoading(true);
    try {
      await blogService.deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== id)); // cập nhật trực tiếp
      setDeleteDialog({ open: false, blogId: null });
      setDeleteSuccess(true);
    } catch (err) {
      setError(err.message || 'Xóa bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Fix handleStatusChange to use updateBlogStatus
  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await blogService.updateBlogStatus(id, { status: newStatus });
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
        <Box
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
            padding: '18px 32px',
            borderRadius: '18px',
            boxShadow: '0 6px 24px rgba(74, 144, 226, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LibraryBooksIcon sx={{ fontSize: 36, mr: 2 }} />
            <Typography variant="h4" fontWeight={800}>
              Quản lý Blog
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={
                viewMode === 'table' ? <FilterListIcon /> : <LibraryBooksIcon />
              }
              onClick={() =>
                setViewMode(viewMode === 'table' ? 'grid' : 'table')
              }
              sx={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '30px',
                px: 3,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.10)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.25)',
                  color: '#1ABC9C',
                },
              }}
            >
              {viewMode === 'table' ? 'XEM DẠNG LƯỚI' : 'XEM DẠNG BẢNG'}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '30px',
                px: 4,
                boxShadow: '0 4px 16px rgba(74, 144, 226, 0.18)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                  color: 'white',
                },
              }}
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
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            mb: 3,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <BlogStatCard
            title="Tổng số bài viết"
            value={totalBlogs}
            color="#4A90E2"
            borderColor="#4A90E2"
          />
          <BlogStatCard
            title="Đã duyệt"
            value={confirmedBlogs}
            color="#1ABC9C"
            borderColor="#1ABC9C"
          />
          <BlogStatCard
            title="Chờ duyệt"
            value={processingBlogs}
            color="#FF9800"
            borderColor="#FF9800"
          />
        </Box>

        {/* Bộ lọc status và ngày */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            alignItems: 'center',
            flexWrap: 'wrap',
            maxWidth: 500,
          }}
        >
          <FormControl
            sx={{
              minWidth: 180,
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 1px 4px rgba(32,178,170,0.04)',
            }}
            size="small"
          >
            <InputLabel sx={{ fontWeight: 700, color: colors.primary }}>
              Trạng thái
            </InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ fontWeight: 600, borderRadius: 2, color: colors.text }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ngày tạo"
            type="date"
            size="small"
            value={dateFilter}
            onChange={handleDateFilterChange}
            InputLabelProps={{
              shrink: true,
              style: { fontWeight: 700, color: colors.primary },
            }}
            sx={{
              minWidth: 180,
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 1px 4px rgba(32,178,170,0.04)',
            }}
            inputProps={{
              style: {
                fontWeight: 600,
                color: colors.text,
                borderRadius: 2,
                padding: '10px 12px',
              },
            }}
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
                                background:
                                  'linear-gradient(45deg, #1ABC9C, #4A90E2)',
                                color: 'white',
                                fontWeight: 600,
                              }}
                              size="small"
                            />
                          )}
                          {blog.status === 'PROCESSING' && (
                            <Chip
                              label="Chờ duyệt"
                              sx={{
                                background:
                                  'linear-gradient(45deg, #FFD166, #FFB400)',
                                color: '#333',
                                fontWeight: 600,
                              }}
                              size="small"
                            />
                          )}
                          {blog.status === 'CANCELED' && (
                            <Chip
                              label="Đã huỷ"
                              sx={{
                                background:
                                  'linear-gradient(45deg, #FF6B6B, #FF8C8C)',
                                color: 'white',
                                fontWeight: 600,
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
                          {/* Beautified status dropdown */}
                          <FormControl
                            size="small"
                            sx={{
                              minWidth: 140,
                              mr: 1,
                              borderRadius: 3,
                              background: '#f8fafc',
                              boxShadow: '0 1px 4px rgba(32,178,170,0.07)',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                fontWeight: 700,
                                fontSize: '1.05rem',
                                color:
                                  blog.status === 'CONFIRMED'
                                    ? '#219a6f'
                                    : blog.status === 'PROCESSING'
                                      ? '#ff9800'
                                      : blog.status === 'CANCELED'
                                        ? '#e53935'
                                        : colors.text,
                                background: '#fff',
                                border: '1.5px solid #e0e0e0',
                                transition: 'border-color 0.2s',
                                '&:hover fieldset': {
                                  borderColor: '#20B2AA',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#20B2AA',
                                },
                              },
                            }}
                          >
                            <Select
                              value={blog.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                setLoading(true);
                                try {
                                  await blogService.updateBlogStatus(blog.id, {
                                    status: newStatus,
                                  });
                                  setBlogs((prev) =>
                                    prev.map((b) =>
                                      b.id === blog.id
                                        ? { ...b, status: newStatus }
                                        : b
                                    )
                                  );
                                } catch (err) {
                                  setError(
                                    err.message ||
                                      'Cập nhật trạng thái thất bại'
                                  );
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              disabled={loading}
                              displayEmpty
                              sx={{
                                fontWeight: 700,
                                pl: 1.5,
                                color:
                                  blog.status === 'CONFIRMED'
                                    ? '#219a6f'
                                    : blog.status === 'PROCESSING'
                                      ? '#ff9800'
                                      : blog.status === 'CANCELED'
                                        ? '#e53935'
                                        : colors.text,
                                '& .MuiSelect-icon': { color: '#20B2AA' },
                              }}
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  {selected === 'CONFIRMED' && (
                                    <CheckIcon
                                      fontSize="small"
                                      sx={{ color: '#219a6f' }}
                                    />
                                  )}
                                  {selected === 'PROCESSING' && (
                                    <HourglassEmptyIcon
                                      fontSize="small"
                                      sx={{ color: '#ff9800' }}
                                    />
                                  )}
                                  {selected === 'CANCELED' && (
                                    <CancelIcon
                                      fontSize="small"
                                      sx={{ color: '#e53935' }}
                                    />
                                  )}
                                  <span>
                                    {selected === 'CONFIRMED'
                                      ? 'Đã duyệt'
                                      : selected === 'PROCESSING'
                                        ? 'Chờ duyệt'
                                        : selected === 'CANCELED'
                                          ? 'Đã huỷ'
                                          : selected}
                                  </span>
                                </Box>
                              )}
                            >
                              <MenuItem value="PROCESSING">Chờ duyệt</MenuItem>
                              <MenuItem value="CONFIRMED">Đã duyệt</MenuItem>
                            </Select>
                          </FormControl>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              sx={iconButtonStyle}
                              onClick={() => handleOpenDeleteDialog(blog.id)}
                              disabled={loading}
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
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
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
            }}
          >
            <BlogForm
              form={form}
              setForm={setForm}
              categories={categories}
              thumbnailFile={thumbnailFile}
              thumbnailPreview={thumbnailPreview}
              sectionFiles={sectionFiles}
              handleFormChange={handleFormChange}
              handleThumbnailChange={handleThumbnailChange}
              handleSectionChange={handleSectionChange}
              addSection={addSection}
              removeSection={removeSection}
              handleSectionImageChange={handleSectionImageChange}
              loading={loading}
              onSubmit={handleSaveBlog}
              onCancel={handleCloseDialog}
              isEdit={!!currentBlog}
            />
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

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          PaperProps={{
            sx: { borderRadius: 3, minWidth: 380, textAlign: 'center', p: 2 },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontWeight: 700,
              fontSize: '1.3rem',
              color: '#e53935',
            }}
          >
            <DeleteIcon sx={{ color: '#e53935', fontSize: 32 }} />
            Xác nhận xóa bài viết
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                mt: 1,
                mb: 2,
                fontSize: '1.08rem',
                color: '#333',
                fontWeight: 500,
              }}
            >
              Bạn có chắc chắn muốn xóa bài viết này không?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={loading}
              variant="outlined"
              sx={{
                color: '#555',
                borderColor: '#bbb',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                textTransform: 'uppercase',
                mr: 2,
                '&:hover': { borderColor: '#888', background: '#f5f5f5' },
              }}
            >
              HỦY BỎ
            </Button>
            <Button
              onClick={handleConfirmDeleteBlog}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <DeleteIcon />
                )
              }
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: 4,
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px #e5393533',
              }}
            >
              XÓA
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar thông báo thành công/thất bại */}
        <Snackbar
          open={deleteSuccess}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setDeleteSuccess(false)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => setDeleteSuccess(false)}
            iconMapping={{
              success: <DeleteIcon fontSize="inherit" />,
            }}
            sx={{ fontWeight: 600, fontSize: '1.1rem' }}
          >
            Đã xóa bài viết thành công!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setError(null)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={() => setError(null)}
            sx={{ fontWeight: 600, fontSize: '1.1rem' }}
          >
            Xóa bài viết thất bại: {error}
          </MuiAlert>
        </Snackbar>

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

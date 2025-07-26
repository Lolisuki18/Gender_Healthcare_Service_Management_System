/**
 * BlogManagementContent.js - Quản lý Blog cho Staff
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  Tooltip,
  DialogContent,
  DialogActions,
  Alert,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import blogService from '../../services/blogService';
import BlogDetailModal from './modals/BlogDetailModal';

import { formatDateDisplay } from '../../utils/dateUtils';

const BlogManagementContent = () => {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Dialog states
  const [viewDialog, setViewDialog] = useState({ open: false, blog: null });
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    blog: null,
    action: null,
  });
  const [rejectionReason, setRejectionReason] = useState('');

  // State for all blogs data
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Fetch all blogs and handle client-side pagination
  const fetchBlogs = useCallback(
    async (search = '', status = 'ALL', date = '') => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all blogs without pagination
        const params = {
          page: 0,
          size: 1000, // Large number to get all blogs
          sortBy: 'createdAt',
          sortDir: 'desc',
        };

        let response;
        if (search.trim()) {
          response = await blogService.searchBlogs(search.trim(), params);
        } else {
          response = await blogService.getAllBlogsPaginated(params);
        }

        if (response.success) {
          const data = response.data;
          let allContent = data.content || [];

          // Apply client-side filters
          let filteredContent = allContent;

          // Status filtering
          if (status && status !== 'ALL') {
            filteredContent = filteredContent.filter(
              (blog) => blog.status === status
            );
          }

          // Date filtering
          if (date) {
            filteredContent = filteredContent.filter((blog) => {
              const blogDateFormatted = formatDateDisplay(blog.createdAt);
              if (
                blogDateFormatted &&
                blogDateFormatted !== 'Chưa cập nhật' &&
                blogDateFormatted !== 'Ngày không hợp lệ'
              ) {
                const [day, month, year] = blogDateFormatted.split('/');
                const blogDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                return blogDateStr === date;
              }
              return false;
            });
          }

          // Search filtering
          if (search.trim()) {
            const searchLower = search.toLowerCase();
            filteredContent = filteredContent.filter(
              (blog) =>
                blog.title?.toLowerCase().includes(searchLower) ||
                blog.authorName?.toLowerCase().includes(searchLower) ||
                blog.categoryName?.toLowerCase().includes(searchLower)
            );
          }

          setFilteredBlogs(filteredContent);

          // Calculate pagination for filtered results
          const totalFilteredItems = filteredContent.length;
          const calculatedTotalPages =
            Math.ceil(totalFilteredItems / pageSize) || 1;

          setTotalPages(calculatedTotalPages);
          setTotalBlogs(totalFilteredItems);

          // If current page is greater than total pages, reset to page 1
          if (page > calculatedTotalPages && calculatedTotalPages > 0) {
            setPage(1);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(`Không thể tải danh sách blog: ${error.message}`);
        setFilteredBlogs([]);
        setTotalPages(1);
        setTotalBlogs(0);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page]
  );

  // Get paginated blogs for current page
  const getPaginatedBlogs = useCallback(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBlogs.slice(startIndex, endIndex);
  }, [filteredBlogs, page, pageSize]);

  // Update blogs when page or pageSize changes
  useEffect(() => {
    setBlogs(getPaginatedBlogs());
  }, [getPaginatedBlogs]);

  // Initial load
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        setPage(1);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    // Data is already loaded, no need to fetch again
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // No need to fetch data, just change page
  };

  // Handle filter change
  const handleFilterChange = () => {
    setPage(1);
    fetchBlogs(searchQuery, statusFilter, dateFilter);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
    // Recalculate pagination with new page size
    const calculatedTotalPages =
      Math.ceil(filteredBlogs.length / newPageSize) || 1;
    setTotalPages(calculatedTotalPages);
  };

  // Handle view blog
  const handleViewBlog = (blog) => {
    setViewDialog({ open: true, blog });
  };

  // Handle delete blog
  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa blog "${blog.title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await blogService.deleteBlog(blog.id);
      setSuccess('Xóa blog thành công!');

      // Refresh data
      fetchBlogs(searchQuery, statusFilter, dateFilter);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError(`Không thể xóa blog: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Bộ lọc ngày
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setPage(1);
  };

  // Handle status update
  const handleStatusUpdate = async (action) => {
    try {
      setLoading(true);
      const { blog } = statusDialog;

      const statusData = {
        status: action === 'approve' ? 'CONFIRMED' : 'CANCELED',
        rejectionReason: action === 'reject' ? rejectionReason : null,
      };

      await blogService.updateBlogStatus(blog.id, statusData);

      setSuccess(
        `Blog đã được ${action === 'approve' ? 'duyệt' : 'từ chối'} thành công!`
      );
      setStatusDialog({ open: false, blog: null, action: null });
      setRejectionReason('');

      // Refresh data
      fetchBlogs(searchQuery, statusFilter, dateFilter);
    } catch (error) {
      console.error('Error updating blog status:', error);
      setError(`Không thể cập nhật trạng thái: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      PROCESSING: { text: 'Chờ duyệt', color: 'warning' },
      CONFIRMED: { text: 'Đã duyệt', color: 'success' },
      CANCELED: { text: 'Đã từ chối', color: 'error' },
    };
    return statusMap[status] || { text: status, color: 'default' };
  };

  // Format date using dateUtils
  const formatDate = (dateArray) => {
    return formatDateDisplay(dateArray);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafb',
        p: { xs: 2, md: 4 },
        '& @keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.4 },
          '100%': { opacity: 1 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50% 0 0 50%',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.125rem' },
            }}
          >
            📋 Quản lý Blog Y tế
          </Typography> */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.125rem' },
            }}
          >
            📋Quản lý và duyệt các bài viết blog chuyên môn
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: '1px solid #f44336',
            backgroundColor: '#ffebee',
            '& .MuiAlert-icon': {
              color: '#d32f2f',
            },
          }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: '1px solid #4caf50',
            backgroundColor: '#e8f5e8',
            '& .MuiAlert-icon': {
              color: '#2e7d32',
            },
          }}
        >
          {success}
        </Alert>
      )}

      {/* Search and Actions */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e3f2fd',
        }}
      >
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
          }}
        >
          {/* Filters Section */}
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: '#4A90E2',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🔍 Bộ lọc và tìm kiếm
          </Typography>
          {/* Filters Row */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              p: 3,
              backgroundColor: '#f8fafb',
              borderRadius: 2,
              border: '1px solid #e3f2fd',
            }}
          >
            <TextField
              select
              label="Trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              size="small"
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
              SelectProps={{ native: true }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PROCESSING">Chờ duyệt</option>
              <option value="CONFIRMED">Đã duyệt</option>
              <option value="CANCELED">Đã từ chối</option>
            </TextField>

            <TextField
              label="Lọc theo ngày"
              type="date"
              size="small"
              value={dateFilter}
              onChange={handleDateFilterChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                minWidth: 180,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleFilterChange}
              sx={{
                px: 3,
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3A7BD5, #00D2FF)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.4)',
                },
              }}
            >
              Áp dụng bộ lọc
            </Button>
          </Box>

          {/* Search Row */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              p: 3,
              backgroundColor: 'white',
              borderRadius: 2,
              border: '1px solid #e3f2fd',
            }}
          >
            <TextField
              placeholder="Tìm kiếm blog theo tiêu đề, tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#4A90E2' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                px: 4,
                py: 1.2,
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3A7BD5, #00D2FF)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.4)',
                },
              }}
            >
              Tìm kiếm
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setDateFilter('');
                setPage(1);
                fetchBlogs(1, '', 'ALL', '');
              }}
              sx={{
                borderColor: '#4A90E2',
                color: '#4A90E2',
                '&:hover': {
                  borderColor: '#1ABC9C',
                  backgroundColor: 'rgba(74, 144, 226, 0.04)',
                },
              }}
            >
              Làm mới
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Statistics */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 2,
          border: '1px solid #90caf9',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#4A90E2',
            fontWeight: 600,
            mb: 1,
          }}
        >
          📊 Thống kê Blog
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" color="#1ABC9C" sx={{ fontWeight: 500 }}>
            Tổng cộng: <strong>{totalBlogs}</strong> blog
          </Typography>
          <Typography variant="body1" color="#1ABC9C" sx={{ fontWeight: 500 }}>
            Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
          </Typography>
          <Typography variant="body1" color="#1ABC9C" sx={{ fontWeight: 500 }}>
            Hiển thị: <strong>{blogs.length}</strong> /{' '}
            <strong>{totalBlogs}</strong> kết quả
          </Typography>
          {(searchQuery || statusFilter !== 'ALL' || dateFilter) && (
            <Chip
              label="Đang lọc"
              size="small"
              color="info"
              sx={{
                backgroundColor: '#4A90E2',
                color: 'white',
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Blogs Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e3f2fd',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📋 Danh sách Blog
          </Typography>
        </Box>
        <TableContainer sx={{ backgroundColor: 'white' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafb' }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                    borderBottom: '2px solid #e3f2fd',
                  }}
                >
                  Tiêu đề
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                    borderBottom: '2px solid #e3f2fd',
                  }}
                >
                  Tác giả
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                    borderBottom: '2px solid #e3f2fd',
                  }}
                >
                  Danh mục
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                    borderBottom: '2px solid #e3f2fd',
                  }}
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                    borderBottom: '2px solid #e3f2fd',
                  }}
                >
                  Ngày tạo
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                    borderBottom: '2px solid #e3f2fd',
                  }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton - show single loading row
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Typography variant="h6" color="#4A90E2">
                        ⏳ Đang tải dữ liệu...
                      </Typography>
                      <Box
                        sx={{
                          width: '60%',
                          height: 10,
                          backgroundColor: '#e3f2fd',
                          borderRadius: 1,
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="#666"
                        sx={{ fontSize: '1.2rem' }}
                      >
                        📝 Không có blog nào
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery || statusFilter !== 'ALL' || dateFilter
                          ? 'Không tìm thấy blog nào thỏa mãn điều kiện tìm kiếm'
                          : 'Chưa có bài viết nào được tạo trong hệ thống'}
                      </Typography>
                      {(searchQuery ||
                        statusFilter !== 'ALL' ||
                        dateFilter) && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
                            setDateFilter('');
                            setPage(1);
                            fetchBlogs(1, '', 'ALL', '');
                          }}
                          sx={{
                            borderColor: '#4A90E2',
                            color: '#4A90E2',
                            '&:hover': {
                              borderColor: '#1ABC9C',
                              backgroundColor: 'rgba(74, 144, 226, 0.04)',
                            },
                          }}
                        >
                          Xóa bộ lọc
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog, index) => (
                  <TableRow
                    key={blog.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8fafb',
                      },
                      borderBottom: '1px solid #e3f2fd',
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: '#4A90E2',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => handleViewBlog(blog)}
                      >
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#555' }}>
                        {blog.authorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={blog.categoryName}
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#4A90E2',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusBadge(blog.status).text}
                        color={getStatusBadge(blog.status).color}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          ...(blog.status === 'PROCESSING' && {
                            backgroundColor: '#fff3e0',
                            color: '#f57c00',
                          }),
                          ...(blog.status === 'CONFIRMED' && {
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                          }),
                          ...(blog.status === 'CANCELED' && {
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                          }),
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#555' }}>
                        {formatDate(blog.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewBlog(blog)}
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#4A90E2',
                              '&:hover': {
                                background:
                                  'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                                color: 'white',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>

                        {blog.status === 'PROCESSING' && (
                          <>
                            <Tooltip title="Duyệt">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setStatusDialog({
                                    open: true,
                                    blog,
                                    action: 'approve',
                                  })
                                }
                                sx={{
                                  backgroundColor: '#e8f5e8',
                                  color: '#2e7d32',
                                  '&:hover': {
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <ApproveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Từ chối">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setStatusDialog({
                                    open: true,
                                    blog,
                                    action: 'reject',
                                  })
                                }
                                sx={{
                                  backgroundColor: '#ffebee',
                                  color: '#d32f2f',
                                  '&:hover': {
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <RejectIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        {blog.status === 'CONFIRMED' && (
                          <Tooltip title="Hủy duyệt">
                            <IconButton
                              size="small"
                              onClick={() =>
                                setStatusDialog({
                                  open: true,
                                  blog,
                                  action: 'reject',
                                })
                              }
                              sx={{
                                backgroundColor: '#fff3e0',
                                color: '#f57c00',
                                '&:hover': {
                                  backgroundColor: '#ff9800',
                                  color: 'white',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Xóa blog">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteBlog(blog)}
                            sx={{
                              backgroundColor: '#ffebee',
                              color: '#d32f2f',
                              '&:hover': {
                                backgroundColor: '#f44336',
                                color: 'white',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination - Always show, even if only 1 page */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafb',
            borderTop: '1px solid #e3f2fd',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Page Size Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Số bài/trang:
            </Typography>
            <TextField
              select
              size="small"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              sx={{
                minWidth: 70,
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
              SelectProps={{ native: true }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </TextField>
          </Box>

          {/* Pagination Component */}
          {totalPages > 1 ? (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                    color: 'white',
                    fontWeight: 600,
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                  },
                },
              }}
            />
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              Trang đơn
            </Typography>
          )}

          {/* Page Info */}
          <Typography variant="body2" color="text.secondary">
            {totalBlogs > 0 ? (
              <>
                Trang {page} / {totalPages} (
                {Math.min((page - 1) * pageSize + 1, totalBlogs)}-
                {Math.min(page * pageSize, totalBlogs)} của {totalBlogs})
              </>
            ) : (
              'Không có dữ liệu'
            )}
          </Typography>
        </Box>
      </Card>

      {/* Blog Detail Modal */}
      <BlogDetailModal
        open={viewDialog.open}
        blog={viewDialog.blog}
        onClose={() => setViewDialog({ open: false, blog: null })}
        onReject={(blog) => {
          setViewDialog({ open: false, blog: null });
          setStatusDialog({ open: true, blog, action: 'reject' });
        }}
      />

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialog.open}
        onClose={() =>
          setStatusDialog({ open: false, blog: null, action: null })
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              statusDialog.action === 'approve'
                ? 'linear-gradient(45deg, #1ABC9C, #4A90E2)'
                : 'linear-gradient(45deg, #f44336, #ef5350)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          {statusDialog.action === 'approve'
            ? '✅ Duyệt Blog'
            : '❌ Từ chối Blog'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {statusDialog.blog && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
                {statusDialog.action === 'approve'
                  ? 'Bạn có chắc chắn muốn duyệt blog này?'
                  : 'Bạn có chắc chắn muốn từ chối blog này?'}
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#f8fafb',
                  borderRadius: 2,
                  border: '1px solid #e3f2fd',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#4A90E2',
                  }}
                >
                  "{statusDialog.blog.title}"
                </Typography>
              </Box>

              {statusDialog.action === 'reject' && (
                <TextField
                  fullWidth
                  label="Lý do từ chối"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  multiline
                  rows={3}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336',
                      },
                    },
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() =>
              setStatusDialog({ open: false, blog: null, action: null })
            }
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => handleStatusUpdate(statusDialog.action)}
            disabled={
              statusDialog.action === 'reject' && !rejectionReason.trim()
            }
            sx={{
              background:
                statusDialog.action === 'approve'
                  ? 'linear-gradient(45deg, #1ABC9C, #4A90E2)'
                  : 'linear-gradient(45deg, #f44336, #ef5350)',
              px: 3,
              fontWeight: 600,
              '&:hover': {
                background:
                  statusDialog.action === 'approve'
                    ? 'linear-gradient(45deg, #00D2FF, #3A7BD5)'
                    : 'linear-gradient(45deg, #d32f2f, #f44336)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {statusDialog.action === 'approve' ? 'Duyệt' : 'Từ chối'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagementContent;

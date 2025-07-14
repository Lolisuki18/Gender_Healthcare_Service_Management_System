/**
 * BlogManagementContent.js - Quản lý Blog cho Staff
 */

import React, { useState, useEffect } from 'react';
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
  const pageSize = 10;

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

  // Fetch blogs
  const fetchBlogs = async (
    currentPage = 1,
    search = '',
    status = 'ALL',
    date = ''
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage - 1, // Backend uses 0-based indexing
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      // Add status filter if not ALL
      if (status && status !== 'ALL') {
        params.status = status;
      }

      let response;
      if (search.trim()) {
        response = await blogService.searchBlogs(search.trim(), params);
      } else {
        response = await blogService.getAllBlogsPaginated(params);
      }

      if (response.success) {
        let data = response.data;
        let filteredContent = data.content || [];

        // Client-side date filtering if needed
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

        // Client-side status filtering if backend doesn't support it
        if (status && status !== 'ALL') {
          filteredContent = filteredContent.filter(
            (blog) => blog.status === status
          );
        }

        setBlogs(filteredContent);
        setTotalPages(Math.ceil(filteredContent.length / pageSize) || 1);
        setTotalBlogs(filteredContent.length);
      } else {
        throw new Error(response.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(`Không thể tải danh sách blog: ${error.message}`);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBlogs(1, searchQuery, statusFilter, dateFilter);
  }, [statusFilter, dateFilter]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    fetchBlogs(1, searchQuery, statusFilter, dateFilter);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    fetchBlogs(newPage, searchQuery, statusFilter, dateFilter);
  };

  // Handle filter change
  const handleFilterChange = () => {
    setPage(1);
    fetchBlogs(1, searchQuery, statusFilter, dateFilter);
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
      fetchBlogs(page, searchQuery, statusFilter, dateFilter);
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
      fetchBlogs(page, searchQuery, statusFilter, dateFilter);
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}
        >
          Quản lý Blog
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và duyệt các bài viết blog từ người dùng
        </Typography>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Search and Actions */}
      <Card sx={{ mb: 3, p: 3 }}>
        {/* Filters Row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Trạng thái"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
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
            sx={{ minWidth: 180 }}
          />

          <Button
            variant="outlined"
            onClick={handleFilterChange}
            sx={{ px: 3 }}
          >
            Áp dụng bộ lọc
          </Button>
        </Box>

        {/* Search Row */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm blog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ px: 3 }}>
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
          >
            Làm mới
          </Button>
        </Box>
      </Card>

      {/* Statistics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Tổng cộng: {totalBlogs} blog | Trang {page} / {totalPages}
        </Typography>
      </Box>

      {/* Blogs Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có blog nào
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{blog.authorName}</TableCell>
                    <TableCell>{blog.categoryName}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusBadge(blog.status).text}
                        color={getStatusBadge(blog.status).color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(blog.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleViewBlog(blog)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>

                      {blog.status === 'PROCESSING' && (
                        <>
                          <Tooltip title="Duyệt">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                setStatusDialog({
                                  open: true,
                                  blog,
                                  action: 'approve',
                                })
                              }
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Từ chối">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                setStatusDialog({
                                  open: true,
                                  blog,
                                  action: 'reject',
                                })
                              }
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
                            color="warning"
                            onClick={() =>
                              setStatusDialog({
                                open: true,
                                blog,
                                action: 'reject',
                              })
                            }
                          >
                            <RejectIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Xóa blog">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteBlog(blog)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
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
      >
        <DialogTitle>
          {statusDialog.action === 'approve' ? 'Duyệt Blog' : 'Từ chối Blog'}
        </DialogTitle>
        <DialogContent>
          {statusDialog.blog && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {statusDialog.action === 'approve'
                  ? 'Bạn có chắc chắn muốn duyệt blog này?'
                  : 'Bạn có chắc chắn muốn từ chối blog này?'}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                "{statusDialog.blog.title}"
              </Typography>

              {statusDialog.action === 'reject' && (
                <TextField
                  fullWidth
                  label="Lý do từ chối"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  multiline
                  rows={3}
                  required
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setStatusDialog({ open: false, blog: null, action: null })
            }
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color={statusDialog.action === 'approve' ? 'success' : 'error'}
            onClick={() => handleStatusUpdate(statusDialog.action)}
            disabled={
              statusDialog.action === 'reject' && !rejectionReason.trim()
            }
          >
            {statusDialog.action === 'approve' ? 'Duyệt' : 'Từ chối'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagementContent;

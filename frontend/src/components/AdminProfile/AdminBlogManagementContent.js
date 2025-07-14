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
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Fade,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  LibraryBooks as LibraryBooksIcon,
  GridView as GridViewIcon,
  TableRows as TableRowsIcon,
} from '@mui/icons-material';
import blogService from '../../services/blogService';
import categoryService from '../../services/categoryService';
import { formatDateDisplay } from '../../utils/dateUtils';
import { getBlogImageUrl } from '../../utils/imageUrl';
import BlogDetailModal from '../StaffProfile/modals/BlogDetailModal';

const colors = {
  primary: '#20B2AA',
  secondary: '#5F9EA0',
  accent: '#48D1CC',
  background: '#E0F2F1',
  text: '#264653',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  success: '#2E8B57',
  error: '#FF6B6B',
  warning: '#FFD166',
};

const AdminBlogManagementContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState('table');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Extract unique categories for filter
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Lấy danh mục từ API khi load trang
  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => {
        // Chuẩn hóa: nếu trả về dạng {data: [...]}, lấy data.data
        let cats = Array.isArray(data) ? data : data?.data || data || [];
        setCategories(cats);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    blogService
      .getAllBlogs()
      .then((data) => {
        // Chuẩn hóa: nếu trả về dạng page, lấy data.content
        let blogsArr = Array.isArray(data) ? data : data?.content || [];
        if (mounted) setBlogs(blogsArr);
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Lỗi khi tải danh sách blog');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.categoryName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blog.authorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === 'ALL' ||
      String(blog.categoryId) === String(categoryFilter);
    return matchSearch && matchCategory;
  });

  // Xem chi tiết
  const handleViewDetail = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBlog(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 30%, #f5fafe 70%, #ffffff 100%)',
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LibraryBooksIcon sx={{ fontSize: 32, color: colors.primary }} />
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: colors.primary }}
            >
              Quản lý Blog
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              startIcon={<TableRowsIcon />}
              onClick={() => setViewMode('table')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Dạng bảng
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              startIcon={<GridViewIcon />}
              onClick={() => setViewMode('grid')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Dạng lưới
            </Button>
          </Box>
        </Box>

        {/* Search and filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.primary }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, background: colors.white },
            }}
            sx={{ minWidth: 320 }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              label="Danh mục"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              {categories.map((cat) => (
                <MenuItem
                  key={cat.categoryId || cat.id}
                  value={cat.categoryId || cat.id}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Table view */}
        {viewMode === 'table' && (
          <Fade in={true}>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(32,178,170,0.08)',
              }}
            >
              {loading ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <CircularProgress sx={{ color: colors.primary }} />
                </Box>
              ) : error ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead sx={{ background: colors.primary }}>
                      <TableRow>
                        <TableCell
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          Tiêu đề
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          Danh mục
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          Tác giả
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          Ngày tạo
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          Người duyệt
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: colors.white, fontWeight: 600 }}
                        >
                          Xem chi tiết
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBlogs.length === 0 ? (
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
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((blog) => (
                            <TableRow key={blog.id} hover>
                              <TableCell>{blog.id}</TableCell>
                              <TableCell>{blog.title}</TableCell>
                              <TableCell>
                                {blog.categoryName ||
                                  categories.find(
                                    (c) =>
                                      String(c.categoryId || c.id) ===
                                      String(blog.categoryId)
                                  )?.name ||
                                  ''}
                              </TableCell>
                              <TableCell>
                                {blog.authorName || blog.author || ''}
                              </TableCell>
                              <TableCell>
                                {formatDateDisplay(blog.createdAt)}
                              </TableCell>
                              <TableCell>{blog.reviewerName || ''}</TableCell>
                              <TableCell align="right">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleViewDetail(blog)}
                                  sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                  Xem chi tiết
                                </Button>
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
                    onPageChange={setPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                  />
                </>
              )}
            </TableContainer>
          </Fade>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && (
          <Grid container spacing={3}>
            {loading ? (
              <Grid item xs={12}>
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <CircularProgress sx={{ color: colors.primary }} />
                </Box>
              </Grid>
            ) : error ? (
              <Grid item xs={12}>
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              </Grid>
            ) : filteredBlogs.length === 0 ? (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    color: colors.darkGray,
                    opacity: 0.7,
                  }}
                >
                  Không tìm thấy bài viết nào
                </Paper>
              </Grid>
            ) : (
              filteredBlogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((blog) => (
                  <Grid item xs={12} sm={6} md={4} key={blog.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(32,178,170,0.08)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={getBlogImageUrl(
                          blog.thumbnailImage || blog.existingThumbnail
                        )}
                        alt={blog.title}
                        sx={{
                          objectFit: 'cover',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/blog/default.jpg';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {blog.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {(blog.categoryName ||
                            categories.find(
                              (c) =>
                                String(c.categoryId || c.id) ===
                                String(blog.categoryId)
                            )?.name ||
                            '') +
                            ' | ' +
                            (blog.authorName || blog.author || '')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateDisplay(blog.createdAt)} | Người duyệt:{' '}
                          {blog.reviewerName || ''}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2,
                          gap: 1,
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewDetail(blog)}
                          sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredBlogs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={setPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Detail Modal */}
        <BlogDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          blog={selectedBlog}
          categories={categories}
        />
      </Box>
    </Box>
  );
};

export default AdminBlogManagementContent;

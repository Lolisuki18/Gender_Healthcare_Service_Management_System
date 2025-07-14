import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  TextField,
  Pagination,
  Tooltip,
  Dialog,         
  DialogActions,
  DialogContent,  
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Search as SearchIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import blogService from '../../services/blogService';
import categoryService from '../../services/categoryService';
import BlogDetailModal from '../StaffProfile/modals/BlogDetailModal';
import { useNavigate } from 'react-router-dom';
import { getBlogImageUrl } from '../../utils/imageUrl';
import { formatDateDisplay, formatDateForInput } from '../../utils/dateUtils';

const EditBlogDialog = ({ open, onClose, blog, onSaved }) => {
  const [form, setForm] = useState({
    title: '',  
    content: '',
    categoryId: '',
    existingThumbnail: '',
    sections: []
  });
  const [categories, setCategories] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [sectionFiles, setSectionFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || '',
        content: blog.content || '',
        categoryId: blog.categoryId || '',
        existingThumbnail: blog.thumbnailImage || blog.existingThumbnail || '',
        sections: blog.sections ? blog.sections.map(s => ({
          sectionTitle: s.sectionTitle || '',
          sectionContent: s.sectionContent || '',
          sectionImage: s.sectionImage || '',
          existingSectionImage: s.sectionImage || s.existingSectionImage || '',
          displayOrder: s.displayOrder || 0
        })) : []
      });
      setThumbnailFile(null);
      setThumbnailPreview(blog.thumbnailImage || blog.existingThumbnail || '');
      setSectionFiles({});
    }
  }, [blog]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleThumbnailChange = e => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = e => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSectionChange = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    }));
  };
  const addSection = () => {
    setForm(prev => ({
      ...prev,
      sections: [...prev.sections, { sectionTitle: '', sectionContent: '', sectionImage: '', existingSectionImage: '', displayOrder: prev.sections.length }]
    }));
  };
  const removeSection = idx => {
    setForm(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }));
    setSectionFiles(prev => { const n = { ...prev }; delete n[idx]; return n; });
  };
  const handleSectionImageChange = (idx, file) => {
    if (file) {
      setSectionFiles(prev => ({ ...prev, [idx]: file }));
      const reader = new FileReader();
      reader.onload = e => setForm(prev => ({
        ...prev,
        sections: prev.sections.map((s, i) => i === idx ? { ...s, sectionImage: e.target.result } : s)
      }));
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    if (!form.title || !form.content || !form.categoryId) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      const sectionImages = [], sectionImageIndexes = [];
      Object.keys(sectionFiles).forEach(idx => { sectionImages.push(sectionFiles[idx]); sectionImageIndexes.push(parseInt(idx)); });
      sectionImages.forEach(f => formData.append('sectionImages', f));
      sectionImageIndexes.forEach(i => formData.append('sectionImageIndexes', i));
      const requestData = {
        title: form.title,
        content: form.content,
        categoryId: parseInt(form.categoryId),
        existingThumbnail: form.existingThumbnail,
        sections: form.sections.map((s, idx) => ({
          sectionTitle: s.sectionTitle,
          sectionContent: s.sectionContent,
          sectionImage: s.sectionImage,
          existingSectionImage: s.existingSectionImage,
          displayOrder: idx
        }))
      };
      formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
      await blogService.updateBlog(blog.id, formData);
      onSaved && onSaved();
      onClose();
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Cập nhật thất bại'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.3rem' }}>Chỉnh sửa bài viết</DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>
        <TextField fullWidth label="Tiêu đề *" name="title" value={form.title} onChange={handleFormChange} sx={{ mb: 2 }} required />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Danh mục *</InputLabel>
          <Select name="categoryId" value={form.categoryId} label="Danh mục *" onChange={handleFormChange} required>
            {categories.map(c => <MenuItem key={c.categoryId} value={c.categoryId}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Hình ảnh đại diện *</Typography>
          <input accept="image/*" style={{ display: 'none' }} id="edit-thumbnail-upload" type="file" onChange={handleThumbnailChange} />
          <label htmlFor="edit-thumbnail-upload">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} sx={{ mb: 1 }}>Chọn hình ảnh</Button>
          </label>
          {(thumbnailPreview || form.existingThumbnail) && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              {(() => {
                let src;
                if (thumbnailPreview && typeof thumbnailPreview === 'string' && thumbnailPreview.startsWith('data:')) {
                  src = thumbnailPreview;
                } else {
                  src = getBlogImageUrl(thumbnailPreview || form.existingThumbnail);
                }
                console.log('Thumbnail preview src:', src);
                return <img src={src} alt="Thumbnail preview" style={{ maxWidth: 180, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />;
              })()}
            </Box>
          )}
        </Box>
        <TextField fullWidth label="Nội dung chính *" name="content" value={form.content} onChange={handleFormChange} sx={{ mb: 2 }} multiline minRows={3} required />
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Các phần bổ sung</Typography>
          {form.sections.map((section, idx) => (
            <Card key={idx} sx={{ mb: 2, p: 2, background: '#f8fbff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Phần {idx + 1}</Typography>
                <Button color="error" size="small" onClick={() => removeSection(idx)}>Xoá</Button>
              </Box>
              <TextField fullWidth label="Tiêu đề phần" value={section.sectionTitle} onChange={e => handleSectionChange(idx, 'sectionTitle', e.target.value)} sx={{ mb: 1 }} />
              <TextField fullWidth label="Nội dung phần" value={section.sectionContent} onChange={e => handleSectionChange(idx, 'sectionContent', e.target.value)} sx={{ mb: 1 }} multiline minRows={2} />
              <Box>
                <input accept="image/*" style={{ display: 'none' }} id={`edit-section-image-${idx}`} type="file" onChange={e => handleSectionImageChange(idx, e.target.files[0])} />
                <label htmlFor={`edit-section-image-${idx}`}><Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="small">Chọn hình ảnh</Button></label>
                {(section.sectionImage || section.existingSectionImage) && (
                  <Box sx={{ mt: 1 }}>
                    {(() => {
                      let src;
                      if (section.sectionImage && typeof section.sectionImage === 'string' && section.sectionImage.startsWith('data:')) {
                        src = section.sectionImage;
                      } else {
                        src = getBlogImageUrl(section.sectionImage || section.existingSectionImage);
                      }
                      console.log('Section preview src:', src);
                      return <img src={src} alt={`Section ${idx + 1} preview`} style={{ maxWidth: 120, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />;
                    })()}
                  </Box>
                )}
              </Box>
            </Card>
          ))}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" size="small" onClick={addSection}>Thêm phần</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">Huỷ</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading} startIcon={loading && <CircularProgress size={18} color="inherit" />}>Lưu thay đổi</Button>
      </DialogActions>
    </Dialog>
  );
};

const BlogMyContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const blogsPerPage = 5;
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [editBlog, setEditBlog] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage - 1,
        size: blogsPerPage,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };
      const response = await blogService.getMyBlogs(params);
      if (response.success && response.data) {
        setBlogs(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setBlogs([]);
        setTotalPages(1);
        setError(response.message || 'Không thể tải blog của bạn');
      }
    } catch (err) {
      setBlogs([]);
      setTotalPages(1);
      setError(err.message || 'Không thể tải blog của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedBlog(null);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bài viết này?')) return;
    setDeleting(true);
    try {
      await blogService.deleteBlog(blogId);
      fetchBlogs();
    } catch (err) {
      setError(err.message || 'Xoá blog thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setOpenEdit(true);
  };

  const handleCreate = () => {
    navigate('/blog/create');
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditBlog(null);
  };

  // Filter blogs by search, status, date
  const filteredBlogs = blogs.filter(blog => {
    const matchSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || blog.status === statusFilter;
    let matchDate = true;
    if (dateFilter) {
      // Sử dụng formatDateForInput để convert blog.createdAt thành YYYY-MM-DD
      const blogDateFormatted = formatDateDisplay(blog.createdAt);
      if (blogDateFormatted && blogDateFormatted !== 'Chưa cập nhật' && blogDateFormatted !== 'Ngày không hợp lệ') {
        // Convert DD/MM/YYYY thành YYYY-MM-DD để so sánh
        const [day, month, year] = blogDateFormatted.split('/');
        const blogDateStr = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
        matchDate = blogDateStr === dateFilter;
      }
    }
    return matchSearch && matchStatus && matchDate;
  });

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Blog của tôi
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Tạo bài viết mới
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          label="Trạng thái"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
          SelectProps={{ native: true }}
        >
          <option value="ALL">Tất cả</option>
          <option value="CONFIRMED">Đã duyệt</option>
          <option value="PROCESSING">Chờ duyệt</option>
          <option value="CANCELED">Đã huỷ</option>
        </TextField>
        <TextField
          label="Ngày tạo"
          type="date"
          size="small"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 180 }}
        />
      </Box>
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tiêu đề..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />,
          }}
          sx={{ borderRadius: 2, background: '#fff' }}
        />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: blogsPerPage }).map((_, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card sx={{ display: 'flex', mb: 2, borderRadius: 3 }}>
                <Skeleton variant="rectangular" width={120} height={90} sx={{ borderRadius: 3, m: 2 }} />
                <CardContent sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredBlogs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Bạn chưa có bài viết nào.
          </Typography>
          <Button variant="outlined" onClick={handleCreate} startIcon={<AddIcon />}>
            Tạo bài viết đầu tiên
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredBlogs.map((blog) => (
            <Grid item xs={12} md={6} key={blog.id}>
              <Card sx={{ display: 'flex', mb: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>
                <CardMedia
                  component="img"
                  image={getBlogImageUrl(blog.thumbnailImage || blog.existingThumbnail)}
                  alt={blog.title}
                  sx={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 3, m: 2 }}
                  onError={e => { e.target.onerror = null; e.target.src = '/img/blog/default.jpg'; }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'primary.main', cursor: 'pointer' }} onClick={() => handleView(blog)}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {blog.categoryName || 'Chưa phân loại'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip label={blog.status === 'CONFIRMED' ? 'Đã duyệt' : blog.status === 'PROCESSING' ? 'Chờ duyệt' : 'Đã huỷ'} color={blog.status === 'CONFIRMED' ? 'success' : blog.status === 'PROCESSING' ? 'warning' : 'error'} size="small" />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {formatDateDisplay(blog.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Xem chi tiết"><span><IconButton color="info" onClick={() => handleView(blog)}><VisibilityIcon /></IconButton></span></Tooltip>
                    <Tooltip title="Chỉnh sửa"><span><IconButton color="primary" onClick={() => handleEdit(blog)}><EditIcon /></IconButton></span></Tooltip>
                    <Tooltip title="Xoá"><span><IconButton color="error" onClick={() => handleDelete(blog.id)} disabled={deleting}><DeleteIcon /></IconButton></span></Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {totalPages > 1 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
        </Box>
      )}
      {/* Modal xem chi tiết */}
      <BlogDetailModal open={openDetail} blog={selectedBlog} onClose={handleCloseDetail} onReject={() => {}} />
      <EditBlogDialog open={openEdit} onClose={handleCloseEdit} blog={editBlog} onSaved={fetchBlogs} />
    </Box>
  );
};

export default BlogMyContent; 
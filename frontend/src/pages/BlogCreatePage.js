import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button, MenuItem, IconButton, Paper, Divider, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import blogService from '@/services/blogService';
import { useNavigate } from 'react-router-dom';

const initialSection = { sectionTitle: '', sectionContent: '', sectionImage: null, displayOrder: 1 };

const BlogCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [sections, setSections] = useState([{ ...initialSection }]);
  const [sectionImages, setSectionImages] = useState([]); // file[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogService.getCategories();
        setCategories(data);
      } catch (e) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Section handlers
  const handleSectionChange = (idx, field, value) => {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const handleSectionImageChange = (idx, file) => {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, sectionImage: file, sectionImagePreview: file ? URL.createObjectURL(file) : null } : s));
  };
  const addSection = () => {
    setSections(sections => [...sections, { ...initialSection, displayOrder: sections.length + 1 }]);
  };
  const removeSection = (idx) => {
    setSections(sections => sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, displayOrder: i + 1 })));
  };

  // Thumbnail handler
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Chuẩn bị sections và sectionImages
      const sectionReqs = [];
      const sectionImgs = [];
      const sectionImgIndexes = [];
      sections.forEach((s, idx) => {
        sectionReqs.push({
          sectionTitle: s.sectionTitle,
          sectionContent: s.sectionContent,
          displayOrder: idx + 1
        });
        if (s.sectionImage) {
          sectionImgs.push(s.sectionImage);
          sectionImgIndexes.push(idx);
        }
      });
      // Chuẩn bị form data
      const formData = new FormData();
      formData.append('thumbnail', thumbnail);
      sectionImgs.forEach((img, i) => {
        formData.append('sectionImages', img);
      });
      if (sectionImgIndexes.length > 0) {
        formData.append('sectionImageIndexes', JSON.stringify(sectionImgIndexes));
      }
      const request = {
        title,
        content,
        categoryId,
        sections: sectionReqs
      };
      formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      // Gửi API
      await blogService.createBlog(formData);
      setSuccess('Tạo bài viết thành công!');
      setTimeout(() => navigate('/blog'), 1200);
    } catch (e) {
      setError(e.message || 'Lỗi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', py: 6 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, boxShadow: 6, background: 'rgba(255,255,255,0.98)' }}>
          <Typography variant="h4" fontWeight={800} mb={3} color="#1976d2" textAlign="center" letterSpacing={-1}>
            ✍️ Tạo bài viết mới
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              label="Tiêu đề bài viết"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3, background: '#f7fafd', borderRadius: 2 }}
              inputProps={{ style: { fontWeight: 600, fontSize: 20 } }}
            />
            <TextField
              label="Nội dung tóm tắt"
              value={content}
              onChange={e => setContent(e.target.value)}
              fullWidth
              required
              multiline
              minRows={3}
              sx={{ mb: 3, background: '#f7fafd', borderRadius: 2 }}
              inputProps={{ style: { fontSize: 16 } }}
            />
            <TextField
              label="Danh mục"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              select
              fullWidth
              required
              sx={{ mb: 3, background: '#f7fafd', borderRadius: 2 }}
            >
              {categories.map(cat => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>
              ))}
            </TextField>
            <Box sx={{ mb: 4 }}>
              <Typography fontWeight={700} mb={1} color="#1976d2">Ảnh đại diện (thumbnail) *</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Chọn ảnh
                  <input type="file" accept="image/*" hidden onChange={handleThumbnailChange} required />
                </Button>
                {thumbnailPreview && (
                  <Box sx={{ width: 90, height: 90, borderRadius: 2, overflow: 'hidden', boxShadow: 2, border: '2px solid #e3f2fd', background: '#f7fafd' }}>
                    <img src={thumbnailPreview} alt="thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                )}
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" fontWeight={700} mb={2} color="#1976d2">Các phần nội dung chi tiết</Typography>
            {sections.map((section, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 3, position: 'relative', background: '#f9fafb', borderRadius: 3, boxShadow: 1, border: '1px solid #e3f2fd' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Tiêu đề phần ${idx + 1} (không bắt buộc)`}
                    value={section.sectionTitle}
                    onChange={e => handleSectionChange(idx, 'sectionTitle', e.target.value)}
                    fullWidth
                    sx={{ background: '#f7fafd', borderRadius: 2 }}
                  />
                  <IconButton onClick={() => removeSection(idx)} disabled={sections.length === 1} color="error" sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <TextField
                  label="Nội dung phần *"
                  value={section.sectionContent}
                  onChange={e => handleSectionChange(idx, 'sectionContent', e.target.value)}
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  sx={{ mb: 2, background: '#f7fafd', borderRadius: 2 }}
                  inputProps={{ style: { fontSize: 15 } }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Ảnh minh họa
                    <input type="file" accept="image/*" hidden onChange={e => handleSectionImageChange(idx, e.target.files[0])} />
                  </Button>
                  {section.sectionImagePreview && (
                    <Box sx={{ width: 70, height: 70, borderRadius: 2, overflow: 'hidden', boxShadow: 1, border: '2px solid #e3f2fd', background: '#f7fafd' }}>
                      <img src={section.sectionImagePreview} alt="section preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  )}
                </Box>
                <Typography fontSize={12} color="text.secondary" mt={1}>Thứ tự hiển thị: {idx + 1}</Typography>
              </Paper>
            ))}
            <Button startIcon={<AddIcon />} onClick={addSection} sx={{ mb: 4, fontWeight: 700, borderRadius: 2, background: '#e3f2fd', color: '#1976d2', '&:hover': { background: '#bbdefb' } }}>+ Thêm phần nội dung</Button>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} startIcon={loading && <CircularProgress size={20} color="inherit" />} sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 3, boxShadow: '0 4px 16px rgba(25,118,210,0.10)' }}>
                {loading ? 'Đang tạo...' : 'Tạo bài viết'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default BlogCreatePage; 
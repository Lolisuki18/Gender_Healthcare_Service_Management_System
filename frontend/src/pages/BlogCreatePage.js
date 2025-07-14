/**
 * BlogCreatePage.js - Trang tạo bài viết blog mới
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  IconButton,
  Avatar
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import blogService from '../services/blogService';
import categoryService from '../services/categoryService';

const BlogCreatePage = () => {
  const navigate = useNavigate();
  
  // ===== STATE MANAGEMENT =====
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    sections: []
  });
  
  // File handling
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [sectionFiles, setSectionFiles] = useState({});

  // ===== FETCH CATEGORIES =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🚀 Fetching categories...');
        const cats = await categoryService.getCategories();
        console.log('📊 Categories response:', cats);
        setCategories(cats || []);
      } catch (error) {
        console.error('💥 Error fetching categories:', error);
        setError(`Không thể tải danh mục: ${error.message}`);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);

  // ===== EVENT HANDLERS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file hình ảnh (jpg, png, gif...)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        sectionTitle: '',
        sectionContent: '',
        displayOrder: prev.sections.length
      }]
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
    
    // Remove associated file
    setSectionFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[index];
      return newFiles;
    });
  };

  const handleSectionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleSectionImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file hình ảnh (jpg, png, gif...)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }
      
      setSectionFiles(prev => ({
        ...prev,
        [index]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    if (!formData.categoryId) {
      setError('Vui lòng chọn danh mục');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('🚀 Submitting blog post...');
      
      // Prepare form data for submission
      const submitFormData = new FormData();
      
      // Prepare request data
      const requestData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: parseInt(formData.categoryId, 10), // Parse as integer explicitly
        sections: formData.sections
          .filter(section => section.sectionTitle.trim() || section.sectionContent.trim())
          .map((section, index) => ({
            sectionTitle: section.sectionTitle.trim(),
            sectionContent: section.sectionContent.trim(),
            displayOrder: index // Use plain index without Number() conversion
          })),
        status: 'PROCESSING' // Default status for new posts
      };
      
      console.log('📝 Request data before JSON stringify:', requestData);
      console.log('📊 CategoryId type:', typeof requestData.categoryId, requestData.categoryId);
      console.log('📊 Sections:', requestData.sections.map(s => ({ 
        title: s.sectionTitle, 
        displayOrder: s.displayOrder, 
        displayOrderType: typeof s.displayOrder 
      })));
      
      console.log('📝 Request data:', requestData);
      
      // Add request data as JSON blob
      submitFormData.append('request', new Blob([JSON.stringify(requestData)], { 
        type: 'application/json' 
      }));
      
      // Add thumbnail file if selected
      if (thumbnailFile) {
        submitFormData.append('thumbnail', thumbnailFile);
        console.log('🖼️ Added thumbnail file:', thumbnailFile.name);
      }
      
      // Add section images
      const sectionImages = [];
      const sectionImageIndexes = [];
      
      Object.keys(sectionFiles).forEach(index => {
        const file = sectionFiles[index];
        if (file) {
          sectionImages.push(file);
          sectionImageIndexes.push(parseInt(index));
        }
      });
      
      // Add section images only if they exist
      if (sectionImages.length > 0 && sectionImageIndexes.length > 0) {
        console.log('🖼️ Processing section images...');
        
        sectionImages.forEach(file => {
          submitFormData.append('sectionImages', file);
        });
        
        // Send sectionImageIndexes as JSON blob like request data
        submitFormData.append('sectionImageIndexes', new Blob([JSON.stringify(sectionImageIndexes)], { 
          type: 'application/json' 
        }));
        
        console.log('🖼️ Added section images:', sectionImages.length, 'files');
        console.log('📊 Section image indexes as JSON:', JSON.stringify(sectionImageIndexes));
      } else {
        console.log('📷 No section images to process - skipping sectionImageIndexes');
      }
      // Note: Don't add empty sectionImageIndexes - Spring Boot handles optional @RequestPart
      
      // Submit to API
      const response = await blogService.createBlog(submitFormData);
      
      console.log('✅ Blog created successfully:', response);
      
      setSuccess('Bài viết đã được tạo thành công và đang chờ duyệt!');
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        categoryId: '',
        sections: []
      });
      setThumbnailFile(null);
      setThumbnailPreview('');
      setSectionFiles({});
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
      
    } catch (error) {
      console.error('💥 Error creating blog:', error);
      setError(`Lỗi khi tạo bài viết: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #ffffff 100%)',
      py: 8
    }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ mb: 6 }}
        >
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#1976d2' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Trang chủ
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/blog')}
            sx={{
              color: '#546e7a',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#1976d2' }
            }}
          >
            Blog
          </Link>
          <Typography color="#26c6da" sx={{ fontWeight: 600 }}>
            Tạo bài viết mới
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
          sx={{
            mb: 4,
            color: '#1976d2',
            borderColor: '#1976d2',
            borderRadius: '25px',
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: '#e3f0ff',
              borderColor: '#1565c0',
            }
          }}
        >
          Quay lại danh sách
        </Button>

        {/* Page Header */}
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            color: '#1a237e',
            mb: 2,
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          Tạo bài viết mới
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#546e7a',
            mb: 6,
            fontSize: '1.125rem',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          Chia sẻ kiến thức y khoa với cộng đồng
        </Typography>

        {/* Success Message */}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            {success}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            {error}
          </Alert>
        )}

        {/* Main Form Card */}
        <Card sx={{ 
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e3f2fd',
          p: 6
        }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: '#1a237e',
                mb: 4,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              Thông tin cơ bản
            </Typography>

            {/* Title */}
            <TextField
              fullWidth
              label="Tiêu đề bài viết"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              placeholder="Nhập tiêu đề bài viết..."
            />

            {/* Category */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                label="Danh mục"
                required
              >
                {categories.map(category => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Content */}
            <TextField
              fullWidth
              label="Nội dung bài viết"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              multiline
              rows={8}
              sx={{ mb: 4 }}
              placeholder="Nhập nội dung bài viết..."
            />

            <Divider sx={{ my: 4 }} />

            {/* Thumbnail Upload */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: '#1a237e',
                mb: 4,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              Hình ảnh đại diện
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Chọn hình ảnh đại diện
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </Button>
              
              {thumbnailPreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid #e3f2fd'
                    }}
                  />
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Sections */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a237e',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  Phần nội dung chi tiết
                </Typography>
              </Box>

              {formData.sections.map((section, index) => (
                <Card key={index} sx={{ 
                  mb: 3, 
                  p: 3, 
                  border: '1px solid #e3f2fd',
                  borderRadius: '16px'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      Phần {index + 1}
                    </Typography>
                    
                    <IconButton
                      color="error"
                      onClick={() => removeSection(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <TextField
                    fullWidth
                    label="Tiêu đề phần"
                    value={section.sectionTitle}
                    onChange={(e) => handleSectionChange(index, 'sectionTitle', e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Nhập tiêu đề cho phần này..."
                  />

                  <TextField
                    fullWidth
                    label="Nội dung phần"
                    value={section.sectionContent}
                    onChange={(e) => handleSectionChange(index, 'sectionContent', e.target.value)}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    placeholder="Nhập nội dung cho phần này..."
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Chọn hình ảnh cho phần này
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleSectionImageChange(index, e)}
                    />
                  </Button>

                  {sectionFiles[index] && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Đã chọn: {sectionFiles[index].name}
                      </Typography>
                    </Box>
                  )}
                </Card>
              ))}

              {formData.sections.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  backgroundColor: '#f8fbff',
                  borderRadius: '16px',
                  border: '1px dashed #e3f2fd'
                }}>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ mb: 2, fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}
                  >
                    Chưa có phần nội dung chi tiết nào
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addSection}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Thêm phần đầu tiên
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addSection}
                    sx={{
                      background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Thêm phần
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog')}
                disabled={loading}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Hủy bỏ
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#bdbdbd'
                  }
                }}
              >
                {loading ? 'Đang tạo...' : 'Tạo bài viết'}
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default BlogCreatePage;

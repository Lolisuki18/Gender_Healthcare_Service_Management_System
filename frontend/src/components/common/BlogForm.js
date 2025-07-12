import React from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, Card, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const BlogForm = ({
  form,
  setForm,
  categories,
  thumbnailFile,
  thumbnailPreview,
  sectionFiles,
  handleFormChange,
  handleThumbnailChange,
  handleSectionChange,
  addSection,
  removeSection,
  handleSectionImageChange,
  loading,
  onSubmit,
  onCancel,
  isEdit
}) => (
  <Box component="form" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
    <TextField
      fullWidth
      label="Tiêu đề bài viết *"
      margin="normal"
      name="title"
      value={form.title}
      onChange={handleFormChange}
      sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      required
    />
    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
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
    <Box sx={{ mb: 4, p: 3, backgroundColor: 'rgba(32, 178, 170, 0.05)', borderRadius: 3, border: '2px dashed rgba(32, 178, 170, 0.3)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#20B2AA' }}>
        🖼️ Hình ảnh đại diện *
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#333', opacity: 0.8 }}>
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
          sx={{ mb: 2, borderRadius: 2, borderColor: '#20B2AA', color: '#20B2AA', fontWeight: 600 }}
        >
          Chọn hình ảnh
        </Button>
      </label>
      {(thumbnailPreview || form.existingThumbnail) && (
        <Box sx={{ mt: 3, textAlign: 'center', p: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#333' }}>
            Xem trước hình ảnh
          </Typography>
          <img
            src={thumbnailPreview || form.existingThumbnail}
            alt="Thumbnail preview"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
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
      sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      required
    />
    {/* Sections */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 2, backgroundColor: 'rgba(32, 178, 170, 0.05)', borderRadius: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#20B2AA' }}>
            📝 Các phần bổ sung (tùy chọn)
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', opacity: 0.8 }}>
            Thêm các phần nội dung bổ sung với hình ảnh
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addSection}
          sx={{ backgroundColor: '#20B2AA', borderRadius: 2, fontWeight: 600 }}
        >
          Thêm phần
        </Button>
      </Box>
      {form.sections.map((section, index) => (
        <Card key={index} sx={{ mb: 4, p: 4, border: '2px solid rgba(32, 178, 170, 0.2)', borderRadius: 3, backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 2, borderBottom: '2px solid rgba(32, 178, 170, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#20B2AA', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.2rem' }}>📄</span> Phần {index + 1}
            </Typography>
            <IconButton size="small" color="error" onClick={() => removeSection(index)} sx={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
              <RemoveIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Tiêu đề phần"
            value={section.sectionTitle}
            onChange={e => handleSectionChange(index, 'sectionTitle', e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Nội dung phần"
            value={section.sectionContent}
            onChange={e => handleSectionChange(index, 'sectionContent', e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Box sx={{ p: 2, backgroundColor: 'rgba(32, 178, 170, 0.03)', borderRadius: 2, border: '1px dashed rgba(32, 178, 170, 0.3)' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#20B2AA' }}>
              🖼️ Hình ảnh phần (tùy chọn)
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id={`section-image-${index}`}
              type="file"
              onChange={e => handleSectionImageChange(index, e.target.files[0])}
            />
            <label htmlFor={`section-image-${index}`}>
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{ mb: 2, borderRadius: 2, borderColor: '#20B2AA', color: '#20B2AA', fontWeight: 600 }}
              >
                Chọn hình ảnh
              </Button>
            </label>
            {(section.sectionImage || section.existingSectionImage) && (
              <Box sx={{ mt: 2, textAlign: 'center', p: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#333' }}>
                  Xem trước hình ảnh phần {index + 1}
                </Typography>
                <img
                  src={section.sectionImage || section.existingSectionImage}
                  alt={`Section ${index + 1} preview`}
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
              </Box>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  </Box>
);

export default BlogForm; 
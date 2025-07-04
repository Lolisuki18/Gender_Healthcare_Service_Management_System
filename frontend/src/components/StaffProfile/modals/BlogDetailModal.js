                                                            import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Chip, Button, TextField
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { getBlogImageUrl } from '../../../utils/imageUrl';

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

const BlogDetailModal = ({ open, blog, onClose, onReject }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  if (!blog) return null;

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setRejecting(true);
    await onReject(blog, rejectReason);
    setRejecting(false);
    setRejectReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        fontWeight: 800,
        color: '#1976d2',
        fontSize: { xs: '1.3rem', md: '1.7rem' },
        letterSpacing: '-0.5px',
        pb: 1
      }}>
        Chi tiết bài viết
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          background: '#f8fbff',
          borderRadius: '0 0 16px 16px',
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3 },
          minHeight: 320
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: '#1a237e', lineHeight: 1.3 }}>{blog.title}</Typography>
        <Box mb={2} display="flex" gap={1} flexWrap="wrap">
          <Chip
            label={blog.categoryIsActive === false ? 'Danh mục đã bị xoá' : (blog.categoryName || 'Chưa phân loại')}
            color="info"
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.5px' }}
          />
          <Chip
            label={blog.status === 'CONFIRMED' ? 'Đã duyệt' : blog.status === 'PROCESSING' ? 'Chờ duyệt' : 'Đã huỷ'}
            color={blog.status === 'CONFIRMED' ? 'success' : blog.status === 'PROCESSING' ? 'warning' : 'error'}
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.85rem' }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <PersonIcon fontSize="small" sx={{ color: '#1976d2' }} />
          <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>{blog.authorName || 'Admin'}</Typography>
          <CalendarTodayIcon fontSize="small" sx={{ ml: 2, color: '#1976d2' }} />
          <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>{formatDateVN(blog.createdAt)}</Typography>
        </Box>
        <Box mb={2} textAlign="center">
          <img
            src={getBlogImageUrl(blog.thumbnailImage || blog.existingThumbnail)}
            alt="thumbnail"
            style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 16, boxShadow: '0 4px 20px rgba(25,118,210,0.08)' }}
            onError={e => { 
              console.error('❌ Blog thumbnail failed to load:', e.target.src);
              e.target.src = '/img/thumbs/suckhoesinhsan.png'; 
            }}
          />
        </Box>
        <Typography variant="body1" mb={2} sx={{ whiteSpace: 'pre-line', color: '#37474f', fontSize: '1.08rem', lineHeight: 1.7 }}>{blog.content}</Typography>
        {blog.sections && blog.sections.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={1} sx={{ color: '#1976d2' }}>Các phần nội dung:</Typography>
            {blog.sections.map((section, idx) => (
              <Box key={section.id || idx} mb={2} sx={{ background: '#fff', borderRadius: 8, p: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.06)' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1a237e', mb: 1 }}>{section.sectionTitle}</Typography>
                {section.sectionImage && (
                  <img src={getBlogImageUrl(section.sectionImage)} alt="section" style={{ maxWidth: 180, borderRadius: 6, margin: '8px 0', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }} onError={e => { 
                    console.error('❌ Section image failed to load:', e.target.src);
                    e.target.src = '/img/thumbs/suckhoesinhsan.png'; 
                  }} />
                )}
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#37474f', fontSize: '1rem', mt: 1 }}>{section.sectionContent}</Typography>
              </Box>
            ))}
          </Box>
        )}
        {blog.status === 'PROCESSING' && (
          <Box mt={3}>
            <TextField
              label="Lý do từ chối (nếu muốn từ chối)"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              disabled={rejecting}
              sx={{ background: '#fff', borderRadius: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, background: '#f8fbff', borderRadius: '0 0 16px 16px' }}>
        <Button onClick={onClose} color="primary" variant="outlined" sx={{ fontWeight: 600, borderRadius: 2 }}>Đóng</Button>
        {blog.status === 'PROCESSING' && (
          <Button
            onClick={handleReject}
            color="error"
            disabled={rejecting || !rejectReason.trim()}
            variant="contained"
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Từ chối bài viết
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BlogDetailModal; 
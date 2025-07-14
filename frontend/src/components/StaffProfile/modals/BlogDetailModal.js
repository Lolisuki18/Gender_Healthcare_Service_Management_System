/**
 * BlogDetailModal.js - Modal hiển thị chi tiết blog
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { getBlogImageUrl } from '../../../utils/imageUrl';

const BlogDetailModal = ({ open, blog, onClose, onReject }) => {
  if (!blog) return null;

  // Format date
  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return '';
    const [year, month, day, hour, minute] = dateArray;
    return new Date(year, month - 1, day, hour || 0, minute || 0).toLocaleString('vi-VN');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'PROCESSING': { text: 'Chờ duyệt', color: 'warning' },
      'CONFIRMED': { text: 'Đã duyệt', color: 'success' },
      'CANCELED': { text: 'Đã từ chối', color: 'error' }
    };
    return statusMap[status] || { text: status, color: 'default' };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 3, 
        pb: 2,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start'
      }}>
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#1a237e',
            mb: 1,
            lineHeight: 1.3
          }}>
            {blog.title}
          </Typography>
          
          {/* Meta info */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {blog.authorName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {blog.categoryName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(blog.createdAt)}
              </Typography>
            </Box>

            {blog.views !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.views} lượt xem
                </Typography>
              </Box>
            )}
          </Box>

          {/* Status */}
          <Chip 
            label={getStatusBadge(blog.status).text}
            color={getStatusBadge(blog.status).color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Thumbnail Image */}
        {(blog.thumbnailImage || blog.existingThumbnail) && (
          <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={getBlogImageUrl(blog.thumbnailImage || blog.existingThumbnail)}
              alt={blog.title}
              sx={{ 
                height: 200, 
                objectFit: 'cover',
                width: '100%'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/blog/default.jpg';
              }}
            />
          </Card>
        )}

        {/* Main Content */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 2, 
            color: '#1a237e'
          }}>
            Nội dung chính
          </Typography>
          <Typography variant="body1" sx={{ 
            lineHeight: 1.8,
            color: 'text.primary',
            whiteSpace: 'pre-wrap'
          }}>
            {blog.content}
          </Typography>
        </Box>

        {/* Sections */}
        {blog.sections && blog.sections.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 2, 
              color: '#1a237e'
            }}>
              Các phần bổ sung
            </Typography>
            
            {blog.sections.map((section, index) => (
              <Card key={index} sx={{ 
                mb: 2, 
                p: 2, 
                background: '#f8fbff',
                borderRadius: 2,
                border: '1px solid #e3f2fd'
              }}>
                {section.sectionTitle && (
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    color: '#1565c0'
                  }}>
                    {section.sectionTitle}
                  </Typography>
                )}
                
                {section.sectionContent && (
                  <Typography variant="body2" sx={{ 
                    mb: 2,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {section.sectionContent}
                  </Typography>
                )}
                
                {(section.sectionImage || section.existingSectionImage) && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={getBlogImageUrl(section.sectionImage || section.existingSectionImage)}
                      alt={section.sectionTitle || `Phần ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/blog/default.jpg';
                      }}
                    />
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        )}

        {/* Rejection Reason (if exists) */}
        {blog.status === 'CANCELED' && blog.rejectionReason && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 1, 
              color: 'error.main'
            }}>
              Lý do từ chối
            </Typography>
            <Box sx={{ 
              p: 2, 
              background: '#ffebee', 
              borderRadius: 2,
              border: '1px solid #ffcdd2'
            }}>
              <Typography variant="body2" color="error.main">
                {blog.rejectionReason}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ px: 3 }}
        >
          Đóng
        </Button>
        
        {onReject && blog.status === 'PROCESSING' && (
          <Button 
            onClick={() => onReject(blog)}
            variant="contained"
            color="error"
            sx={{ px: 3 }}
          >
            Từ chối
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BlogDetailModal;

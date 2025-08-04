/**
 * BlogPreview.js - Component preview nội dung blog với text formatting
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { processBlogContent, estimateReadingTime, countWords } from '../../utils/textUtils';

const BlogPreview = ({ open, onClose, blogData }) => {
  if (!blogData) return null;

  const { title, content, sections = [] } = blogData;
  const processedContent = processBlogContent(content);
  const readingTime = estimateReadingTime(content);
  const wordCount = countWords(content);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
          📖 Xem trước bài viết
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Blog Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              color: '#1a237e',
              lineHeight: 1.3
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}>
            <span>📊 {wordCount} từ</span>
            <span>⏱️ ~{readingTime} phút đọc</span>
            <span>📅 {new Date().toLocaleDateString('vi-VN')}</span>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
        </Box>

        {/* Main Content */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8,
              fontSize: '1.1rem',
              '& p': { mb: 2 },
              '& h1, & h2, & h3': { 
                fontWeight: 700, 
                color: '#1a237e',
                mt: 3,
                mb: 2
              },
              '& h1': { fontSize: '1.8rem' },
              '& h2': { fontSize: '1.5rem' },
              '& h3': { fontSize: '1.3rem' },
              '& strong': { fontWeight: 700, color: '#1a237e' },
              '& em': { fontStyle: 'italic', color: '#555' },
              '& ul': { 
                pl: 3,
                '& li': { mb: 1 }
              },
              '& mark': {
                backgroundColor: '#fff3cd',
                padding: '2px 4px',
                borderRadius: '4px'
              }
            }}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </Box>

        {/* Sections */}
        {sections && sections.length > 0 && (
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: '#1a237e', 
                mb: 3,
                borderBottom: '2px solid #e3f2fd',
                pb: 1
              }}
            >
              📚 Nội dung chi tiết
            </Typography>
            
            {sections.map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                {section.sectionTitle && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1a237e', 
                      mb: 2,
                      fontSize: '1.25rem'
                    }}
                  >
                    {index + 1}. {section.sectionTitle}
                  </Typography>
                )}
                
                {section.sectionContent && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.8,
                      fontSize: '1rem',
                      pl: 2,
                      borderLeft: '3px solid #e3f2fd',
                      '& p': { mb: 2 },
                      '& h1, & h2, & h3': { 
                        fontWeight: 700, 
                        color: '#1a237e',
                        mt: 2,
                        mb: 1
                      },
                      '& strong': { fontWeight: 700, color: '#1a237e' },
                      '& em': { fontStyle: 'italic', color: '#555' },
                      '& ul': { 
                        pl: 3,
                        '& li': { mb: 1 }
                      }
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: processBlogContent(section.sectionContent) 
                    }}
                  />
                )}
                
                {index < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Đóng xem trước
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogPreview;

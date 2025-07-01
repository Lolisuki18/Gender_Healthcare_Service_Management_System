/**
 * BlogPage.js - Trang hiển thị danh sách blog
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card,
  CardContent,
  Skeleton,
  Alert,
  TextField,
  InputAdornment,
  Pagination,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
// import blogService from '@/services/blogService'; // Comment out API service
import BlogCard from '@/components/common/BlogCard';
import mockBlogs from '@/dataDemo/mockBlogData'; // Import mock data

const BlogPage = () => {
  // ===== STATE MANAGEMENT =====
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0: Nổi bật, 1: Được yêu thích nhất, 2: Mới nhất
  
  const navigate = useNavigate();
  const blogsPerPage = 6; // Số blog hiển thị mỗi trang

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of API
        const data = mockBlogs;
        setBlogs(data || []);
        setFilteredBlogs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ===== SEARCH & TAB FUNCTIONALITY =====
  useEffect(() => {
    if (blogs.length > 0) {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      const sorted = sortBlogsByTab(filtered, activeTab);
      setFilteredBlogs(sorted);
      setCurrentPage(1); // Reset về trang đầu khi search hoặc đổi tab
    }
  }, [searchTerm, blogs, activeTab]);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortBlogsByTab = (blogs, tabIndex) => {
    switch (tabIndex) {
      case 0: // Bài viết nổi bật (featured/high views)
        return [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));
      case 1: // Được yêu thích nhất
        return [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));
      case 2: // Mới nhất
        return [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return blogs;
    }
  };

  // ===== RENDER =====
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#fafafa', // Màu nền chuyên nghiệp hơn
      position: 'relative'
    }}>
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative' }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800,
              color: '#1a237e',
              mb: 3,
              fontSize: { xs: '2.2rem', md: '3rem' },
              letterSpacing: '-0.01em'
            }}
          >
            Kiến Thức Y Khoa
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#546e7a',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.8,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Cập nhật thông tin y khoa mới nhất từ đội ngũ chuyên gia hàng đầu
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ 
          mb: 6,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          p: 0.5,
          border: '1px solid #e3f2fd',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2',
                height: '2px',
                borderRadius: '2px'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                color: '#78909c',
                py: 1.5,
                px: 1.5,
                minHeight: 'auto',
                '&.Mui-selected': {
                  color: '#1976d2',
                  fontWeight: 700,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                '&:hover': {
                  color: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.02)'
                },
                borderRadius: '8px',
                mx: 0.25,
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Tab 
              label="Bài viết nổi bật" 
              icon={<span style={{ fontSize: '1rem' }}>⭐</span>}
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 0.5,
                  mb: 0
                }
              }}
            />
            <Tab 
              label="Được yêu thích nhất" 
              icon={<span style={{ fontSize: '1.2rem' }}>�</span>}
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 1,
                  mb: 0
                }
              }}
            />
            <Tab 
              label="Bài viết mới nhất" 
              icon={<span style={{ fontSize: '1rem' }}>🆕</span>}
              iconPosition="start"
              sx={{ 
                '& .MuiTab-iconWrapper': {
                  mr: 0.5,
                  mb: 0
                }
              }}
            />
          </Tabs>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="Tìm kiếm bài viết, chuyên đề y khoa..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ 
              maxWidth: '500px',
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e3f2fd',
                fontSize: '1rem',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
                  borderColor: '#bbdefb'
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 30px rgba(25, 118, 210, 0.15)',
                  borderColor: '#1976d2'
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 2,
                px: 3,
                fontSize: '1rem',
                fontWeight: 400,
                color: '#37474f',
                '&::placeholder': {
                  color: '#90a4ae',
                  opacity: 1,
                  fontWeight: 400
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ 
                    color: '#90a4ae', 
                    fontSize: '1.3rem',
                    ml: 1
                  }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Search Results Info */}
        {searchTerm && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6c757d', 
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 500
              }}
            >
              Tìm thấy <Box component="span" sx={{ fontWeight: 700, color: '#2c3e50' }}>{filteredBlogs.length}</Box> kết quả cho "<Box component="span" sx={{ fontWeight: 700, color: '#2c3e50' }}>{searchTerm}</Box>"
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 5, 
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.2)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              '& .MuiAlert-message': {
                fontSize: '1.1rem',
                fontWeight: 500
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Blog List */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          mb: 5
        }}>
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} sx={{ 
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e3f2fd',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Box sx={{ 
                  width: { xs: '100%', sm: '300px' },
                  height: { xs: '200px', sm: '180px' },
                  flexShrink: 0
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%"
                    height="100%"
                    sx={{ 
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      borderRadius: { xs: '16px 16px 0 0', sm: '16px 0 0 16px' }
                    }} 
                  />
                </Box>
                <CardContent sx={{ p: 3, flex: 1 }}>
                  <Skeleton 
                    variant="text" 
                    width="60%" 
                    height={24} 
                    sx={{ mb: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="100%" 
                    height={20} 
                    sx={{ mb: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="100%" 
                    height={20} 
                    sx={{ mb: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="80%" 
                    height={20} 
                    sx={{ mb: 2, backgroundColor: 'rgba(0,0,0,0.06)' }} 
                  />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton 
                        variant="rounded" 
                        width={80} 
                        height={24} 
                        sx={{ backgroundColor: 'rgba(0,0,0,0.06)' }} 
                      />
                      <Skeleton 
                        variant="rounded" 
                        width={100} 
                        height={24} 
                        sx={{ backgroundColor: 'rgba(0,0,0,0.06)' }} 
                      />
                    </Box>
                    <Skeleton 
                      variant="rounded" 
                      width={90} 
                      height={32} 
                      sx={{ backgroundColor: 'rgba(0,0,0,0.06)' }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : filteredBlogs.length === 0 ? (
            // Empty State
            <Box sx={{ 
              textAlign: 'center', 
              py: 10,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e3f2fd',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#1a237e', 
                  mb: 3,
                  fontWeight: 700
                }}
              >
                {searchTerm ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết nào'}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#546e7a',
                  fontWeight: 400
                }}
              >
                {searchTerm 
                  ? 'Hãy thử tìm kiếm với từ khóa khác' 
                  : 'Hãy quay lại sau để xem các bài viết mới nhất'
                }
              </Typography>
            </Box>
          ) : (
            // Blog Cards
            currentBlogs.map((blog) => (
              <BlogCard 
                key={blog.id}
                blog={blog} 
                onClick={handleBlogClick}
              />
            ))
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Box sx={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              p: 2,
              border: '1px solid #e3f2fd',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="medium"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '8px',
                    color: '#546e7a',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    margin: '0 2px',
                    minWidth: '40px',
                    height: '40px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2'
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#1976d2',
                      color: '#ffffff',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogPage;

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
import blogService from '@/services/blogService';
import BlogCard from '@/components/common/BlogCard';

const BlogPage = () => {
  // ===== STATE MANAGEMENT =====
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  
  const navigate = useNavigate();
  const blogsPerPage = 6;

  // ===== FETCH DATA FROM REAL API =====
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Fetching blogs with params:', {
          currentPage,
          activeTab,
          searchTerm: searchTerm.trim(),
          blogsPerPage
        });
        
        let response;
        const params = {
          page: currentPage - 1, // API sử dụng 0-based pagination
          size: blogsPerPage,
          sortBy: getSortByFromTab(activeTab),
          sortDir: getSortDirFromTab(activeTab)
        };

        if (searchTerm.trim()) {
          // Sử dụng search API khi có từ khóa tìm kiếm
          console.log('🔍 Using search API with params:', params);
          response = await blogService.searchBlogs(searchTerm.trim(), params);
        } else {
          // Sử dụng API lấy tất cả blog
          console.log('📚 Using getPublicBlogs API with params:', params);
          response = await blogService.getPublicBlogs(params);
        }
        
        console.log('📊 API Response:', response);
        
        if (response.success && response.data) {
          // Xử lý response có phân trang
          const pageData = response.data;
          console.log('📄 Page data:', pageData);
          console.log('📝 Blogs content:', pageData.content);
          
          setBlogs(pageData.content || []);
          setTotalPages(pageData.totalPages || 1);
          
          console.log('✅ Successfully set blogs:', pageData.content?.length || 0, 'items');
        } else {
          console.error('❌ API response not successful:', response);
          
          // Fallback: Thử hiển thị mock data để test UI
          console.log('🔄 Trying to use mock data as fallback...');
          const mockBlogs = [
            {
              id: 1,
              title: "Bài viết test 1",
              excerpt: "Đây là bài viết test để kiểm tra UI",
              content: "Nội dung test",
              createdAt: new Date().toISOString(),
              author: { name: "Test Author" },
              category: { name: "Test Category" },
              status: "PUBLISHED"
            },
            {
              id: 2,
              title: "Bài viết test 2", 
              excerpt: "Đây là bài viết test thứ 2",
              content: "Nội dung test 2",
              createdAt: new Date().toISOString(),
              author: { name: "Test Author 2" },
              category: { name: "Test Category 2" },
              status: "PUBLISHED"
            }
          ];
          
          setBlogs(mockBlogs);
          setTotalPages(1);
          console.log('✅ Using mock data:', mockBlogs.length, 'items');
          
          setError(`API Error: ${response.message || 'Không thể tải danh sách bài viết'} - Hiển thị dữ liệu test`);
        }
      } catch (err) {
        console.error('💥 Error fetching blogs:', err);
        console.error('💥 Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        // Fallback: Sử dụng mock data khi có lỗi API
        console.log('🔄 API failed, using mock data as fallback...');
        const mockBlogs = [
          {
            id: 1,
            title: "Hướng dẫn chăm sóc sức khỏe sinh sản",
            excerpt: "Tìm hiểu những điều cơ bản về chăm sóc sức khỏe sinh sản và các biện pháp phòng ngừa bệnh tật.",
            content: "Nội dung chi tiết về chăm sóc sức khỏe sinh sản...",
            createdAt: new Date().toISOString(),
            author: { name: "Dr. Nguyễn Văn A" },
            category: { name: "Sức khỏe sinh sản" },
            status: "PUBLISHED",
            imageUrl: null
          },
          {
            id: 2,
            title: "Phòng ngừa bệnh lây truyền qua đường tình dục",
            excerpt: "Cách phòng ngừa hiệu quả các bệnh lây truyền qua đường tình dục và tầm quan trọng của việc khám sức khỏe định kỳ.",
            content: "Nội dung chi tiết về phòng ngừa STIs...",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            author: { name: "Dr. Trần Thị B" },
            category: { name: "Phòng ngừa bệnh tật" },
            status: "PUBLISHED",
            imageUrl: null
          },
          {
            id: 3,
            title: "Tầm quan trọng của xét nghiệm sức khỏe định kỳ",
            excerpt: "Xét nghiệm sức khỏe định kỳ giúp phát hiện sớm các vấn đề sức khỏe và điều trị kịp thời.",
            content: "Nội dung chi tiết về xét nghiệm định kỳ...",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            author: { name: "Dr. Lê Văn C" },
            category: { name: "Xét nghiệm y khoa" },
            status: "PUBLISHED",
            imageUrl: null
          }
        ];
        
        setBlogs(mockBlogs);
        setTotalPages(1);
        console.log('✅ Using mock data after error:', mockBlogs.length, 'items');
        
        setError(`Connection Error: ${err.message} - Hiển thị dữ liệu mẫu để test giao diện`);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search để tránh gọi API quá nhiều
    const timeoutId = setTimeout(() => {
      fetchBlogs();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [currentPage, activeTab, searchTerm]);

  // ===== HELPER FUNCTIONS =====
  const getSortByFromTab = (tabIndex) => {
    // Luôn sắp xếp theo createdAt thay vì views
    return 'createdAt';
  };

  const getSortDirFromTab = (tabIndex) => {
    // Luôn sắp xếp theo thứ tự giảm dần
    return 'desc';
  };

  // ===== EVENT HANDLERS =====
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset về trang đầu khi đổi tab
  };

  // ===== RENDER =====
  
  // Debug logging
  console.log('🎨 BlogPage Render State:', {
    loading,
    error,
    blogsCount: blogs.length,
    totalPages,
    currentPage,
    activeTab,
    searchTerm
  });

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#fafafa',
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
            onChange={handleTabChange}
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
              label="Bài viết mới nhất" 
              icon={<span style={{ fontSize: '1rem' }}>🆕</span>}
              iconPosition="start"
            />
            <Tab 
              label="Bài viết quan trọng" 
              icon={<span style={{ fontSize: '1.2rem' }}>⭐</span>}
              iconPosition="start"
            />
            <Tab 
              label="Bài viết nổi bật" 
              icon={<span style={{ fontSize: '1rem' }}>🔥</span>}
              iconPosition="start"
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
        {searchTerm && !loading && (
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
              Tìm thấy <Box component="span" sx={{ fontWeight: 700, color: '#2c3e50' }}>{blogs.length}</Box> kết quả cho "<Box component="span" sx={{ fontWeight: 700, color: '#2c3e50' }}>{searchTerm}</Box>"
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
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="rounded" width={80} height={24} />
                      <Skeleton variant="rounded" width={100} height={24} />
                    </Box>
                    <Skeleton variant="rounded" width={90} height={32} />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : blogs.length === 0 ? (
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
            blogs.map((blog) => {
              console.log('🎨 Rendering blog card:', blog);
              return (
                <BlogCard 
                  key={blog.id}
                  post={blog} // BlogCard expects 'post' prop, not 'blog'
                  onClick={handleBlogClick}
                />
              );
            })
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
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

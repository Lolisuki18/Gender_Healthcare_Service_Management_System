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
  Button,
  Fab,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlogCard from '@/components/common/BlogCard';
import blogService from '../services/blogService';
import confirmDialog from '@/utils/confirmDialog';
import localStorageUtil from '@/utils/localStorage';

const BlogPage = () => {
  // ===== STATE MANAGEMENT =====
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const blogsPerPage = 6;

  // Lấy user role từ localStorage
  const userProfile = localStorageUtil.get('userProfile');
  const userRole = userProfile?.role || userProfile?.data?.role || null;
  const token = localStorageUtil.get('token');
  const isLoggedIn = !!userProfile && !!token;

  // ===== FETCH DATA FROM API =====
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🚀 Fetching blogs with params:', {
          currentPage,
          searchTerm: searchTerm.trim(),
          blogsPerPage,
        });

        let response;
        const params = {
          page: currentPage - 1, // API sử dụng 0-based pagination
          size: blogsPerPage,
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

        if (response && response.success && response.data) {
          // Xử lý response có phân trang
          const pageData = response.data;
          console.log('📄 Page data:', pageData);
          console.log('📝 Blogs content:', pageData.content);

          // Lọc chỉ hiển thị blog có trạng thái CONFIRMED
          const confirmedBlogs = (pageData.content || []).filter(
            (blog) => blog.status === 'CONFIRMED'
          );
          console.log(
            '✅ Filtered blogs (CONFIRMED only):',
            confirmedBlogs.length,
            'out of',
            pageData.content?.length || 0
          );

          // Debug: Log cấu trúc blog để hiểu field names
          if (confirmedBlogs.length > 0) {
            console.log(
              '🔍 Sample blog structure:',
              JSON.stringify(confirmedBlogs[0], null, 2)
            );
          }

          setBlogs(confirmedBlogs);
          setTotalPages(pageData.totalPages || 1);

          console.log(
            '✅ Successfully set blogs:',
            confirmedBlogs.length,
            'items'
          );
        } else {
          console.error('❌ API response not successful:', response);

          // Fallback: Hiển thị mock data để test UI
          console.log('🔄 Using mock data as fallback...');
          const mockBlogs = [
            {
              id: 1,
              title: 'Hướng dẫn chăm sóc sức khỏe sinh sản',
              content:
                'Tìm hiểu những điều cơ bản về chăm sóc sức khỏe sinh sản và các biện pháp phòng ngừa bệnh tật hiệu quả nhất hiện nay.',
              createdAt: new Date().toISOString(),
              authorName: 'Dr. Nguyễn Văn A',
              categoryName: 'Sức khỏe sinh sản',
              status: 'CONFIRMED',
              thumbnailImage: null,
            },
            {
              id: 2,
              title: 'Phòng ngừa bệnh lây truyền qua đường tình dục',
              content:
                'Cách phòng ngừa hiệu quả các bệnh lây truyền qua đường tình dục và tầm quan trọng của việc khám sức khỏe định kỳ.',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              authorName: 'Dr. Trần Thị B',
              categoryName: 'Phòng ngừa bệnh tật',
              status: 'CONFIRMED',
              thumbnailImage: null,
            },
            {
              id: 3,
              title: 'Tầm quan trọng của xét nghiệm sức khỏe định kỳ',
              content:
                'Xét nghiệm sức khỏe định kỳ giúp phát hiện sớm các vấn đề sức khỏe và điều trị kịp thời, góp phần bảo vệ sức khỏe toàn diện.',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              authorName: 'Dr. Lê Văn C',
              categoryName: 'Xét nghiệm y khoa',
              status: 'CONFIRMED',
              thumbnailImage: null,
            },
          ];

          setBlogs(mockBlogs);
          setTotalPages(1);
          console.log('✅ Using mock data:', mockBlogs.length, 'items');

          setError(
            `API Error: ${response?.message || 'Không thể tải danh sách bài viết'} - Hiển thị dữ liệu mẫu`
          );
        }
      } catch (err) {
        console.error('💥 Error fetching blogs:', err);
        console.error('💥 Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        // Fallback: Sử dụng mock data khi có lỗi API
        console.log('🔄 API failed, using mock data as fallback...');
        const mockBlogs = [
          {
            id: 1,
            title: 'Hướng dẫn chăm sóc sức khỏe sinh sản',
            content:
              'Tìm hiểu những điều cơ bản về chăm sóc sức khỏe sinh sản và các biện pháp phòng ngừa bệnh tật.',
            createdAt: new Date().toISOString(),
            authorName: 'Dr. Nguyễn Văn A',
            categoryName: 'Sức khỏe sinh sản',
            status: 'CONFIRMED',
            thumbnailImage: null,
          },
          {
            id: 2,
            title: 'Phòng ngừa bệnh lây truyền qua đường tình dục',
            content:
              'Cách phòng ngừa hiệu quả các bệnh lây truyền qua đường tình dục và tầm quan trọng của việc khám sức khỏe định kỳ.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            authorName: 'Dr. Trần Thị B',
            categoryName: 'Phòng ngừa bệnh tật',
            status: 'CONFIRMED',
            thumbnailImage: null,
          },
          {
            id: 3,
            title: 'Tầm quan trọng của xét nghiệm sức khỏe định kỳ',
            content:
              'Xét nghiệm sức khỏe định kỳ giúp phát hiện sớm các vấn đề sức khỏe và điều trị kịp thời.',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            authorName: 'Dr. Lê Văn C',
            categoryName: 'Xét nghiệm y khoa',
            status: 'CONFIRMED',
            thumbnailImage: null,
          },
        ];

        setBlogs(mockBlogs);
        setTotalPages(1);
        console.log(
          '✅ Using mock data after error:',
          mockBlogs.length,
          'items'
        );

        setError(
          `Connection Error: ${err.message} - Hiển thị dữ liệu mẫu để test giao diện`
        );
      } finally {
        setLoading(false);
      }
    };

    // Debounce search để tránh gọi API quá nhiều
    const timeoutId = setTimeout(
      () => {
        fetchBlogs();
      },
      searchTerm ? 500 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

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

  const handleCreateBlog = async () => {
    const userProfile = localStorageUtil.get('userProfile');
    if (!userProfile) {
      const result = await confirmDialog.info(
        'Bạn cần đăng nhập để tạo bài viết. Bạn có muốn chuyển đến trang đăng nhập không?',
        {
          confirmText: 'Đăng nhập',
          cancelText: 'Hủy',
          title: 'Yêu cầu đăng nhập',
        }
      );
      if (result) {
        navigate('/login');
      }
      return;
    }
    navigate('/blog/create');
  };

  // ===== RENDER =====

  // Debug logging
  console.log('🎨 BlogPage Render State:', {
    loading,
    error,
    blogsCount: blogs.length,
    totalPages,
    currentPage,
    searchTerm,
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #ffffff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background:
            'linear-gradient(135deg, rgba(38, 198, 218, 0.1) 0%, rgba(77, 208, 225, 0.05) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Breadcrumbs
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 6,
            '& .MuiBreadcrumbs-separator': {
              color: '#90a4ae',
              mx: 1
            },
            '& .MuiBreadcrumbs-li': {
              fontSize: '1rem'
            }
          }}
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
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, mb: '-2px' }} /> Trang chủ
          </Link>
          <Typography color="#26c6da" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Blog
          </Typography>
        </Breadcrumbs> */}

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              color: '#1a237e',
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #006064 0%, #26c6da 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Kiến Thức Y Khoa
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#546e7a',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.8,
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Cập nhật thông tin y khoa mới nhất từ đội ngũ chuyên gia hàng đầu
            trong lĩnh vực sức khỏe sinh sản
          </Typography>

          {/* Decorative elements */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 4,
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #26c6da, #4dd0e1)',
                borderRadius: '4px',
              }}
            />
            <Box
              sx={{
                width: '12px',
                height: '12px',
                backgroundColor: '#26c6da',
                borderRadius: '50%',
              }}
            />
            <Box
              sx={{
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #4dd0e1, #26c6da)',
                borderRadius: '4px',
              }}
            />
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 8, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="Tìm kiếm bài viết, chuyên đề y khoa..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              maxWidth: '600px',
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#ffffff',
                boxShadow: '0 8px 32px rgba(38, 198, 218, 0.15)',
                border: '2px solid #e0f7fa',
                fontSize: '1.1rem',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 12px 40px rgba(38, 198, 218, 0.2)',
                  borderColor: '#80deea',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 16px 50px rgba(38, 198, 218, 0.25)',
                  borderColor: '#26c6da',
                  transform: 'translateY(-2px)',
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 2.5,
                px: 3,
                fontSize: '1.1rem',
                fontWeight: 400,
                color: '#37474f',
                '&::placeholder': {
                  color: '#90a4ae',
                  opacity: 1,
                  fontWeight: 400,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: '#1976d2',
                      fontSize: '1.5rem',
                      ml: 1,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Create Blog Button */}
        {isLoggedIn && userRole !== 'CUSTOMER' && (
          <Box
            sx={{
              mb: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateBlog}
              sx={{
                background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
                color: '#ffffff',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 8px 25px rgba(38, 198, 218, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
                  boxShadow: '0 12px 35px rgba(38, 198, 218, 0.4)',
                  transform: 'translateY(-3px)',
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              ✍️ Tạo bài viết mới
            </Button>
          </Box>
        )}

        {/* Search Results Info */}
        {searchTerm && !loading && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#546e7a',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 500,
                backgroundColor: '#ffffff',
                py: 3,
                px: 4,
                borderRadius: '16px',
                border: '1px solid #e3f2fd',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              Tìm thấy{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: '#1976d2',
                  fontSize: '1.3rem',
                }}
              >
                {blogs.length}
              </Box>{' '}
              kết quả cho "
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: '#1a237e',
                  fontStyle: 'italic',
                }}
              >
                {searchTerm}
              </Box>
              "
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert
            severity="warning"
            sx={{
              mb: 6,
              borderRadius: '20px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(255, 152, 0, 0.2)',
              border: '2px solid rgba(255, 152, 0, 0.2)',
              '& .MuiAlert-message': {
                fontSize: '1.1rem',
                fontWeight: 500,
              },
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Blog List */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            mb: 8,
          }}
        >
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid #e3f2fd',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: '300px' },
                    height: { xs: '220px', sm: '200px' },
                    flexShrink: 0,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      borderRadius: {
                        xs: '20px 20px 0 0',
                        sm: '20px 0 0 20px',
                      },
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 4, flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={32}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{ mb: 3 }}
                  />
                  <Box
                    sx={{
                      mt: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Skeleton variant="circular" width={36} height={36} />
                      <Box>
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="text" width={60} height={16} />
                      </Box>
                    </Box>
                    <Skeleton
                      variant="rounded"
                      width={110}
                      height={36}
                      sx={{ borderRadius: '12px' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : blogs.length === 0 ? (
            // Empty State
            <Box
              sx={{
                textAlign: 'center',
                py: 12,
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e3f2fd',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
              }}
            >
              <LibraryBooksIcon
                sx={{
                  fontSize: 80,
                  color: '#90a4ae',
                  mb: 3,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: '#1a237e',
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                }}
              >
                {searchTerm
                  ? 'Không tìm thấy bài viết nào'
                  : 'Chưa có bài viết nào'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#546e7a',
                  fontWeight: 400,
                  fontSize: '1.2rem',
                  mb: 4,
                }}
              >
                {searchTerm
                  ? 'Hãy thử tìm kiếm với từ khóa khác'
                  : 'Hãy tạo bài viết đầu tiên để chia sẻ kiến thức y khoa'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateBlog}
                  sx={{
                    background:
                      'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
                    color: '#ffffff',
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 25px rgba(38, 198, 218, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textTransform: 'none',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
                      boxShadow: '0 12px 35px rgba(38, 198, 218, 0.4)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  Tạo bài viết đầu tiên
                </Button>
              )}
            </Box>
          ) : (
            // Blog Cards
            blogs.map((blog) => {
              console.log('🎨 Rendering blog card:', blog);
              return (
                <BlogCard key={blog.id} post={blog} onClick={handleBlogClick} />
              );
            })
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Box
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                p: 3,
                border: '2px solid #e3f2fd',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '12px',
                    color: '#546e7a',
                    fontWeight: 600,
                    fontSize: '1rem',
                    margin: '0 4px',
                    minWidth: '44px',
                    height: '44px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#1976d2',
                      color: '#ffffff',
                      fontWeight: 700,
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Container>

      {/* Floating Action Button for Create Blog */}
      {isLoggedIn && userRole !== 'CUSTOMER' && (
        <Tooltip title="Tạo bài viết mới" placement="left">
          <Fab
            color="primary"
            aria-label="Tạo bài viết mới"
            onClick={handleCreateBlog}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
              boxShadow: '0 8px 25px rgba(38, 198, 218, 0.4)',
              width: 64,
              height: 64,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
                boxShadow: '0 12px 35px rgba(38, 198, 218, 0.6)',
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              '@media (max-width: 600px)': {
                bottom: 16,
                right: 16,
                width: 56,
                height: 56,
              },
            }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default BlogPage;

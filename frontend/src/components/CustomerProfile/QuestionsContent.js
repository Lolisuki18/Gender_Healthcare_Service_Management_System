/**
 * QuestionsContent.js - Component hiển thị danh sách câu hỏi đã đặt
 *
 * Chức năng:
 * - Hiển thị tất cả câu hỏi mà khách hàng đã đặt
 * - Phân loại theo trạng thái (đã trả lời, chưa trả lời)
 * - Chi tiết từng câu hỏi và câu trả lời của bác sĩ
 * - Cho phép tìm kiếm và lọc câu hỏi
 * - Hỗ trợ đặt câu hỏi mới
 *
 * Features:
 * - Card-based question display
 * - Status indicators cho trạng thái câu hỏi
 * - Expandable answers
 * - Search và filter
 * - Pagination support
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Tooltip,
} from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  HelpOutline as HelpOutlineIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AskQuestionDialog from '../common/AskQuestionDialog';
import { formatDateTimeFromArray } from '../../utils/dateUtils';
import Pagination from '@mui/material/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import questionService from '../../services/questionService';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.1)',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#4A5568',
  '&.Mui-selected': {
    color: '#4A90E2',
    fontWeight: 600,
  },
}));

const QuestionsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const [categories, setCategories] = useState([]);
  // Bỏ questionIdFilter
  // Thêm state cho lọc ngày tạo
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  const [detailQuestion, setDetailQuestion] = useState(null);
  const [openContentDialog, setOpenContentDialog] = useState(false);
  const [hoveredContent, setHoveredContent] = useState('');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Lấy toàn bộ câu hỏi của khách hàng (không phân trang ở API)
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Lấy tối đa 100 câu hỏi, nếu muốn nhiều hơn có thể tăng size
      const res = await questionService.getMyQuestions({
        page: 0,
        size: 100,
      });
      setQuestions(res.data.data.content || []);
    } catch (err) {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    questionService.getCategories().then((res) => {
      setCategories(res.data.data || []);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      console.log('Questions:', questions);
    }
  }, [questions]);

  // Khi đổi tab/filter thì reset về trang 1
  useEffect(() => {
    setPage(1);
  }, [tabValue, searchTerm, categoryFilter]);

  // Filter questions based on search, category, and tab
  const filteredQuestions = questions.filter((q) => {
    // Filter by tab (All, Answered, Pending, Canceled)
    if (tabValue === 1 && q.status !== 'ANSWERED') return false;
    if (tabValue === 2 && q.status !== 'PROCESSING' && q.status !== 'CONFIRMED')
      return false;
    if (tabValue === 3 && q.status !== 'CANCELED') return false;

    // Bỏ filter by question ID

    // Filter by search term
    const matchesSearch =
      q.content && q.content.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category (chuẩn hóa theo BE)
    let matchesCategory = true;
    if (String(categoryFilter) !== 'all') {
      if (q.categoryId === undefined || q.categoryId === null) {
        matchesCategory = false;
      } else {
        matchesCategory = String(q.categoryId) === String(categoryFilter);
      }
    }

    // Filter by created date
    let matchesDate = true;
    if (createdFrom) {
      // createdAt có thể là array hoặc string
      let createdDate = null;
      if (Array.isArray(q.createdAt)) {
        // [yyyy, mm, dd, hh, mm, ss]
        createdDate = new Date(
          q.createdAt[0],
          (q.createdAt[1] || 1) - 1,
          q.createdAt[2] || 1
        );
      } else if (typeof q.createdAt === 'string') {
        createdDate = new Date(q.createdAt);
      }
      if (createdDate) {
        const fromDate = new Date(createdFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (createdDate < fromDate) matchesDate = false;
      }
    }
    if (createdTo) {
      let createdDate = null;
      if (Array.isArray(q.createdAt)) {
        createdDate = new Date(
          q.createdAt[0],
          (q.createdAt[1] || 1) - 1,
          q.createdAt[2] || 1
        );
      } else if (typeof q.createdAt === 'string') {
        createdDate = new Date(q.createdAt);
      }
      if (createdDate) {
        const toDate = new Date(createdTo);
        toDate.setHours(23, 59, 59, 999);
        if (createdDate > toDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const filteredTotalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / pageSize)
  );

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Hàm xoá bộ lọc
  const handleClearFilters = () => {
    setSearchTerm('');
    setCreatedFrom('');
    setCreatedTo('');
    setCategoryFilter('all');
  };

  return (
    <Box>
      {/* Header section with search, filters and new question button */}
      <StyledPaper
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 4,
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 2,
          }}
        >
          {' '}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical blue to teal
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            Câu hỏi của tôi
          </Typography>{' '}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RestartAltIcon />}
              onClick={handleClearFilters}
              sx={{
                borderRadius: '10px',
                fontWeight: 600,
                height: '40px',
                alignSelf: 'center',
                whiteSpace: 'nowrap',
                fontSize: '1rem',
                mr: 1,
                borderColor: '#4A90E2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1976d2',
                  background: 'rgba(74, 144, 226, 0.08)',
                },
              }}
            >
              Xoá bộ lọc
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowNewQuestionForm(true)}
              sx={{
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical blue to teal
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 8px 15px rgba(74, 144, 226, 0.5)',
                padding: '10px 20px',
                fontSize: '1rem',
                alignSelf: { xs: 'stretch', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(45deg, #357ABD, #16A085)',
                  boxShadow: '0 10px 20px rgba(74, 144, 226, 0.6)',
                },
              }}
            >
              Đặt câu hỏi mới
            </Button>
          </Box>
        </Box>{' '}
        <AskQuestionDialog
          open={showNewQuestionForm}
          onClose={() => setShowNewQuestionForm(false)}
          onSuccess={(response) => {
            const id = response?.data?.data?.id;
            toast.success(
              id
                ? `Câu hỏi đã được gửi thành công! ID: ${id}`
                : 'Câu hỏi đã được gửi thành công!'
            );
            fetchQuestions();
            setPage(1);
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' },
          }}
        >
          {/* Search field */}
          <TextField
            placeholder="Tìm kiếm câu hỏi..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: '#2D3748', // Màu tối hơn cho text trên nền sáng
                padding: '14px 14px 14px 0',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(74, 144, 226, 0.3)' }, // Màu viền xanh y tế                "&:hover fieldset": { borderColor: "rgba(74, 144, 226, 0.5)" },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A90E2',
                  borderWidth: '2px',
                },
              },
              flexGrow: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon sx={{ color: '#4A5568' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Từ ngày"
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150, ml: { xs: 0, md: 2 } }}
            size="small"
          />
          <TextField
            label="Đến ngày"
            type="date"
            value={createdTo}
            onChange={(e) => setCreatedTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150, ml: { xs: 0, md: 2 } }}
            size="small"
          />
          {/* Category filter */}{' '}
          <FormControl sx={{ minWidth: 200 }} variant="outlined">
            <InputLabel sx={{ color: '#4A5568' }}>Danh mục</InputLabel>
            <Select
              value={String(categoryFilter)}
              onChange={(e) => setCategoryFilter(String(e.target.value))}
              label="Danh mục"
              renderValue={(selected) => {
                if (selected === 'all') return 'Tất cả danh mục';
                const found = categories.find(
                  (cat) => String(cat.categoryQuestionId) === String(selected)
                );
                return found ? found.name : '';
              }}
              sx={{
                color: '#2D3748', // Màu text đậm hơn
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(74, 144, 226, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(74, 144, 226, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A90E2',
                  borderWidth: '2px',
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <FilterAltIcon sx={{ color: '#4A5568' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Tất cả danh mục</MenuItem>
              {categories.map((cat) => (
                <MenuItem
                  key={cat.categoryQuestionId}
                  value={String(cat.categoryQuestionId)}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </StyledPaper>{' '}
      {/* Tabs for question status filtering */}{' '}
      <Box
        sx={{
          mb: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(74, 144, 226, 0.15)',
        }}
      >
        {' '}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{
            sx: {
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              height: '100%',
              borderRadius: '8px',
              zIndex: 0,
            },
          }}
          sx={{
            minHeight: '48px',
            '& .Mui-selected': {
              color: '#2D3748 !important',
              fontWeight: '700 !important',
              zIndex: 1,
            },
          }}
        >
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuestionIcon sx={{ fontSize: 20 }} />
                Tất cả
              </Box>
            }
            sx={{ borderRadius: '8px', zIndex: 1 }}
          />
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 18 }} />
                Đã trả lời
              </Box>
            }
            sx={{ borderRadius: '8px', zIndex: 1 }}
          />
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                Đang chờ
              </Box>
            }
            sx={{ borderRadius: '8px', zIndex: 1 }}
          />
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HelpOutlineIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                Đã huỷ
              </Box>
            }
            sx={{ borderRadius: '8px', zIndex: 1 }}
          />
        </Tabs>
      </Box>
      {/* Questions list dạng bảng */}
      {filteredQuestions.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '20px',
              mb: 3,
              boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.10)',
              background: '#fafdff',
              border: '1.5px solid #e3f0fa',
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      'linear-gradient(90deg, #fafdff 60%, #e3f0fa 100%)',
                    borderBottom: '2px solid #b3e0f7',
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                      letterSpacing: 0.2,
                    }}
                  >
                    Nội dung
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                  >
                    Danh mục
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                  >
                    Ngày tạo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                    }}
                  >
                    Người trả lời/huỷ
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#1976d2',
                      fontSize: '1.05rem',
                      textAlign: 'center',
                    }}
                  >
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedQuestions.map((question) => (
                  <TableRow
                    hover
                    key={question.id}
                    sx={{
                      background: '#fff',
                      transition: 'background 0.2s',
                      '&:hover': { background: '#e3f0fa' },
                    }}
                  >
                    <TableCell
                      sx={{
                        maxWidth: 220,
                        fontSize: '1rem',
                      }}
                    >
                      <Tooltip
                        title="Click để xem chi tiết"
                        placement="top"
                        arrow
                        sx={{
                          '& .MuiTooltip-tooltip': {
                            backgroundColor: '#4A90E2',
                            color: '#fff',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                          },
                          '& .MuiTooltip-arrow': {
                            color: '#4A90E2',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          onClick={() => {
                            setHoveredContent(question.content);
                            setOpenContentDialog(true);
                          }}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.4,
                            maxHeight: '2.8em',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            '&:hover': {
                              color: '#4A90E2',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {question.content}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, fontSize: '1rem' }}>
                      {question.categoryName}
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, fontSize: '1rem' }}>
                      {Array.isArray(question.createdAt)
                        ? formatDateTimeFromArray(question.createdAt)
                        : 'Chưa cập nhật'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          question.status === 'ANSWERED'
                            ? 'Đã trả lời'
                            : question.status === 'CANCELED'
                              ? 'Đã huỷ'
                              : question.status === 'CONFIRMED'
                                ? 'Đã xác nhận'
                                : 'Đang chờ'
                        }
                        icon={
                          question.status === 'ANSWERED' ? (
                            <CheckCircleIcon sx={{ color: '#43a047' }} />
                          ) : question.status === 'CANCELED' ? (
                            <CancelIcon sx={{ color: '#e53935' }} />
                          ) : (
                            <AccessTimeIcon sx={{ color: '#0288d1' }} />
                          )
                        }
                        color={
                          question.status === 'ANSWERED'
                            ? 'success'
                            : question.status === 'CANCELED'
                              ? 'error'
                              : 'info'
                        }
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.98rem',
                          borderRadius: '16px',
                          px: 1.5,
                          background:
                            question.status === 'ANSWERED'
                              ? '#e8f5e9'
                              : question.status === 'CANCELED'
                                ? '#ffebee'
                                : '#e3f2fd',
                          color:
                            question.status === 'CANCELED'
                              ? '#e53935'
                              : '#1976d2',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, fontSize: '1rem' }}>
                      {question.status === 'CANCELED' && question.updaterName
                        ? question.updaterName
                        : (question.status === 'ANSWERED' ||
                              question.status === 'CONFIRMED') &&
                            question.replierName
                          ? question.replierName
                          : ''}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setDetailQuestion(question)}
                        sx={{
                          borderRadius: '20px',
                          fontWeight: 600,
                          textTransform: 'none',
                          px: 2,
                          boxShadow: '0 2px 8px 0 rgba(74, 144, 226, 0.10)',
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Thanh phân trang */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={filteredTotalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            background: 'rgba(255, 255, 255, 0.8)', // Nền sáng hơn
            borderRadius: '16px',
            border: '1px solid rgba(74, 144, 226, 0.15)', // Viền màu medical
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          }}
        >
          {' '}
          <QuestionIcon
            sx={{ fontSize: 64, color: 'rgba(74, 144, 226, 0.3)', mb: 2 }}
          />
          <Typography
            variant="h6"
            color="#2D3748"
            fontWeight={600}
            sx={{ mb: 1 }}
          >
            Không tìm thấy câu hỏi nào
          </Typography>{' '}
          <Typography
            variant="body2"
            color="#4A5568" // Text color đậm hơn cho phù hợp với nền sáng
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Hãy thử thay đổi bộ lọc hoặc đặt câu hỏi mới
          </Typography>{' '}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowNewQuestionForm(true)}
            sx={{
              color: '#4A90E2', // Medical blue
              borderColor: '#4A90E2',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '8px 20px',
              '&:hover': {
                borderColor: '#1ABC9C', // Medical teal
                background: 'rgba(74, 144, 226, 0.1)',
              },
            }}
          >
            Đặt câu hỏi mới
          </Button>
        </Box>
      )}
      {/* Dialog hiển thị chi tiết câu trả lời */}
      <Dialog
        open={!!detailQuestion}
        onClose={() => setDetailQuestion(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.18)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.35rem',
            color: '#1976d2',
            letterSpacing: 0.5,
            background: '#fafdff',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          Chi tiết câu hỏi
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: '#fafdff',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
          }}
        >
          {detailQuestion && (
            <>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
                sx={{ color: '#1976d2', fontSize: '1.08rem' }}
              >
                Nội dung câu hỏi:
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  mb: 2,
                  fontSize: '1.05rem',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                }}
              >
                {detailQuestion.content}
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
                sx={{ color: '#1976d2', fontSize: '1.08rem' }}
              >
                Danh mục:
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ mb: 2, fontSize: '1.05rem' }}
              >
                {detailQuestion.categoryName}
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
                sx={{ color: '#1976d2', fontSize: '1.08rem' }}
              >
                Trạng thái:
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ mb: 2, fontSize: '1.05rem' }}
              >
                {detailQuestion.status === 'ANSWERED'
                  ? 'Đã trả lời'
                  : detailQuestion.status === 'CANCELED'
                    ? 'Đã huỷ'
                    : 'Đã xác nhận'}
              </Typography>
              {detailQuestion.status === 'ANSWERED' && (
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: '#1976d2', fontSize: '1.08rem' }}
                    >
                      Người trả lời:
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ fontSize: '1.05rem' }}
                    >
                      {detailQuestion.replierName || 'Chuyên gia'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: '#1976d2', fontSize: '1.08rem' }}
                    >
                      Thời gian trả lời:
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ fontSize: '1.05rem' }}
                    >
                      {Array.isArray(detailQuestion.updatedAt)
                        ? formatDateTimeFromArray(detailQuestion.updatedAt)
                        : 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                </Box>
              )}
              {detailQuestion.status === 'ANSWERED' &&
                detailQuestion.answer && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2.5,
                      borderRadius: '16px',
                      background:
                        'linear-gradient(145deg, #e8f5e9 60%, #f1f8e9 100%)',
                      border: '1.5px solid #b2dfdb',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#43a047', mr: 1, mt: 0.5 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="#388e3c"
                        gutterBottom
                      >
                        Câu trả lời:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: '1.05rem',
                          color: '#2D3748',
                        }}
                      >
                        {detailQuestion.answer}
                      </Typography>
                    </Box>
                  </Box>
                )}
              {detailQuestion.status === 'CANCELED' &&
                detailQuestion.rejectionReason && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: '16px',
                      background:
                        'linear-gradient(90deg, #ffebee 60%, #ffcdd2 100%)',
                      color: '#e53935',
                      border: '1.5px solid #ffcdd2',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    <WarningIcon sx={{ color: '#e53935', mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color="#e53935"
                        gutterBottom
                      >
                        Lý do huỷ:
                      </Typography>
                      <Typography variant="body1">
                        {detailQuestion.rejectionReason}
                      </Typography>
                    </Box>
                  </Box>
                )}
              {detailQuestion.status !== 'ANSWERED' &&
                detailQuestion.status !== 'CANCELED' && (
                  <Typography
                    variant="body2"
                    color="#4A5568"
                    sx={{ mt: 2, fontSize: '1.05rem' }}
                  >
                    Chưa có câu trả lời.
                  </Typography>
                )}
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            background: '#fafdff',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
          }}
        >
          <Button
            onClick={() => setDetailQuestion(null)}
            color="primary"
            variant="contained"
            sx={{
              borderRadius: '20px',
              fontWeight: 600,
              px: 4,
              boxShadow: '0 2px 8px 0 rgba(74, 144, 226, 0.10)',
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog hiển thị nội dung câu hỏi */}
      <Dialog
        open={openContentDialog}
        onClose={() => setOpenContentDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.18)',
            border: '1px solid #e3f2fd',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.35rem',
            color: '#1976d2',
            letterSpacing: 0.5,
            background: '#fafdff',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderBottom: '1px solid #e3f2fd',
          }}
        >
          Nội dung câu hỏi
        </DialogTitle>
        <DialogContent
          sx={{
            background: '#fafdff',
            pt: 3,
            px: 3,
            pb: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#2D3748',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              p: 2.5,
              backgroundColor: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #e3f2fd',
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.1)',
            }}
          >
            {hoveredContent}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            background: '#fafdff',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            px: 3,
            pb: 2.5,
          }}
        >
          <Button
            onClick={() => setOpenContentDialog(false)}
            variant="contained"
            sx={{
              borderRadius: '20px',
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              boxShadow: '0 2px 8px 0 rgba(74, 144, 226, 0.10)',
              '&:hover': {
                background: 'linear-gradient(45deg, #357ABD, #16A085)',
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
};

export default QuestionsContent;

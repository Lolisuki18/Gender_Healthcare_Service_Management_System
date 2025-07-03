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
  Grid,
  Card,
  CardContent,
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
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterAlt as FilterAltIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import questionService from '../../services/questionService';
import {
  formatDateDisplay,
  formatDateTime,
  formatDateTimeFromArray,
} from '../../utils/dateUtils';
import Pagination from '@mui/material/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.1)',
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #FFFFFF, #F5F7FA)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: '1px solid rgba(74, 144, 226, 0.12)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px 0 rgba(74, 144, 226, 0.2)',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#4A5568',
  '&.Mui-selected': {
    color: '#4A90E2',
    fontWeight: 600,
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  padding: '0 18px',
  height: '38px',
  color: '#fff',
  background:
    status === 'answered'
      ? 'linear-gradient(90deg, #4CAF50 60%, #2ECC71 100%)'
      : 'linear-gradient(90deg, #ff9800 60%, #f57c00 100%)',
  boxShadow:
    status === 'answered'
      ? '0 4px 16px rgba(76, 175, 80, 0.18)'
      : '0 4px 16px rgba(255, 152, 0, 0.18)',
  borderRadius: '20px',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s',
  '& .MuiChip-icon': {
    fontSize: 22,
    marginRight: 8,
  },
  '&:hover': {
    filter: 'brightness(1.08)',
    boxShadow:
      status === 'answered'
        ? '0 6px 24px rgba(76, 175, 80, 0.28)'
        : '0 6px 24px rgba(255, 152, 0, 0.28)',
  },
}));

const QuestionsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    category: '',
  });
  const questionInputRef = React.useRef(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const tabStatusMap = [null, 'ANSWERED', 'PENDING', 'CANCELED'];

  React.useEffect(() => {
    if (showNewQuestionForm && questionInputRef.current) {
      setTimeout(() => questionInputRef.current.focus(), 200);
    }
  }, [showNewQuestionForm]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // Toggle question expansion
  const toggleQuestionExpand = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle new question form
  const toggleNewQuestionForm = () => {
    setShowNewQuestionForm(!showNewQuestionForm);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lấy danh mục khi mở dialog
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await questionService.getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
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

  // Khi mở dialog đặt câu hỏi mới
  const handleOpenNewQuestion = () => {
    setShowNewQuestionForm(true);
    fetchCategories();
  };

  // Khi gửi câu hỏi mới
  const handleSubmitQuestion = async () => {
    if (!newQuestion.question) {
      toast.warn('Vui lòng nhập câu hỏi.');
      return;
    }
    if (!newQuestion.category) {
      toast.warn('Vui lòng chọn danh mục.');
      return;
    }
    setSubmitLoading(true);
    try {
      await questionService.createQuestion({
        content: newQuestion.question,
        categoryQuestionId: newQuestion.category,
      });
      setNewQuestion({ question: '', category: '' });
      setShowNewQuestionForm(false);
      toast.success('Câu hỏi đã được gửi thành công!');
      fetchQuestions();
      setPage(1);
    } catch (err) {
      toast.error('Gửi câu hỏi thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

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

    // Filter by search term
    const matchesSearch =
      (q.content &&
        q.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.categoryName &&
        q.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by category
    const matchesCategory =
      categoryFilter === 'all' ||
      (q.categoryName && q.categoryName === categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const filteredTotalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / pageSize)
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get unique categories for filter
  const uniqueCategories = [
    'all',
    ...new Set(questions.map((q) => q.categoryName)),
  ];

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewQuestion}
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
        </Box>{' '}
        <Dialog
          open={showNewQuestionForm}
          onClose={toggleNewQuestionForm}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 5,
              boxShadow: '0 8px 40px 0 rgba(74, 144, 226, 0.18)',
              p: 0,
              overflow: 'visible',
              background: 'linear-gradient(135deg, #fafdff 80%, #e0f7fa 100%)',
            },
          }}
          TransitionComponent={Slide}
          transitionDuration={400}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pb: 0,
              pt: 3,
              pl: 3,
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 22, color: '#4A90E2', mr: 1 }} />
            Đặt câu hỏi mới
          </DialogTitle>
          <DialogContent
            dividers={false}
            sx={{
              px: { xs: 3, sm: 5 },
              pt: 2,
              pb: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <TextField
              fullWidth
              name="question"
              label={
                <span style={{ fontWeight: 600, color: '#357ABD' }}>
                  Câu hỏi của bạn *
                </span>
              }
              multiline
              rows={4}
              value={newQuestion.question}
              onChange={(e) => {
                setNewQuestion((prev) => ({
                  ...prev,
                  question: e.target.value,
                }));
              }}
              variant="outlined"
              placeholder="Nhập câu hỏi của bạn ở đây..."
              inputRef={questionInputRef}
              sx={{
                background: '#fff',
                borderRadius: 2,
                mt: 1,
                mb: 0.5,
                '& .MuiInputBase-input': {
                  color: '#2D3748',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                },
                '& .MuiInputLabel-root': {
                  color: '#357ABD',
                  fontWeight: 600,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#b3d4fc' },
                  '&:hover fieldset': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1ABC9C',
                    borderWidth: '2px',
                  },
                },
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  (e.ctrlKey || e.metaKey) &&
                  newQuestion.question &&
                  newQuestion.category
                ) {
                  handleSubmitQuestion();
                }
              }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                background: '#fff',
                borderRadius: 2,
                mb: 0.5,
                '& .MuiInputLabel-root': {
                  color: '#357ABD',
                  fontWeight: 600,
                },
                '& .MuiSelect-select': { color: '#2D3748' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#b3d4fc' },
                  '&:hover fieldset': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused fieldset': { borderColor: '#1ABC9C' },
                },
              }}
            >
              <InputLabel>Danh mục *</InputLabel>
              <Select
                name="category"
                value={newQuestion.category}
                onChange={handleInputChange}
                label="Danh mục *"
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.categoryQuestionId}
                    value={category.categoryQuestionId}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions
            sx={{
              background: '#fafdff',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              px: { xs: 3, sm: 5 },
              py: 2.5,
              mt: 0,
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              onClick={toggleNewQuestionForm}
              sx={{
                color: '#F50057',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                fontSize: '1rem',
              }}
            >
              HỦY
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitQuestion}
              disabled={!newQuestion.question || !newQuestion.category}
              sx={{
                background: 'linear-gradient(90deg, #4A90E2 60%, #1ABC9C 100%)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
                opacity:
                  !newQuestion.question || !newQuestion.category ? 0.5 : 1,
                transition: 'all 0.2s',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #357ABD 60%, #16A085 100%)',
                  boxShadow: '0 8px 24px rgba(74, 144, 226, 0.22)',
                },
              }}
            >
              Gửi câu hỏi
            </Button>
          </DialogActions>
        </Dialog>
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
          {/* Category filter */}{' '}
          <FormControl sx={{ minWidth: 200 }} variant="outlined">
            <InputLabel sx={{ color: '#4A5568' }}>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Danh mục"
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
              {uniqueCategories
                .filter((c) => c !== 'all')
                .map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
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
      {/* Questions list */}
      {filteredQuestions.length > 0 ? (
        <>
          {paginatedQuestions.map((question) => (
            <QuestionCard key={question.id} sx={{ mb: 3 }}>
              <CardContent sx={{ padding: { xs: 2.5, md: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: { xs: 1.5, sm: 0 },
                    }}
                  >
                    {question.status === 'ANSWERED' ? (
                      <Tooltip title="Đã trả lời">
                        <CheckCircleIcon
                          sx={{ color: '#4CAF50', mr: 1.5, fontSize: 20 }}
                        />
                      </Tooltip>
                    ) : question.status === 'CANCELED' ? (
                      <Tooltip title="Đã huỷ">
                        <HelpOutlineIcon
                          sx={{ color: '#ef4444', mr: 1.5, fontSize: 20 }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Đang chờ">
                        <AccessTimeIcon
                          sx={{ color: '#F39C12', mr: 1.5, fontSize: 20 }}
                        />
                      </Tooltip>
                    )}
                    <Typography
                      variant="body1"
                      color="#2D3748"
                      sx={{
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                        fontSize: '0.95rem',
                      }}
                    >
                      {Array.isArray(question.createdAt)
                        ? formatDateTimeFromArray(question.createdAt)
                        : 'Chưa cập nhật'}
                    </Typography>
                  </Box>
                  <StatusChip
                    label={
                      question.status === 'ANSWERED'
                        ? 'Đã trả lời'
                        : question.status === 'CANCELED'
                          ? 'Đã huỷ'
                          : 'Đang chờ'
                    }
                    size="small"
                    status={
                      question.status === 'ANSWERED'
                        ? 'answered'
                        : question.status === 'CANCELED'
                          ? 'canceled'
                          : 'pending'
                    }
                    icon={
                      question.status === 'ANSWERED' ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : question.status === 'CANCELED' ? (
                        <HelpOutlineIcon
                          fontSize="small"
                          style={{ color: '#ef4444' }}
                        />
                      ) : (
                        <AccessTimeIcon fontSize="small" />
                      )
                    }
                    sx={
                      question.status === 'CANCELED'
                        ? {
                            background:
                              'linear-gradient(90deg, #ff8a80 60%, #ef4444 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.18)',
                          }
                        : {}
                    }
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 2.5,
                    fontSize: '1.1rem',
                    lineHeight: 1.5,
                    letterSpacing: '0.3px',
                    color: '#2D3748',
                  }}
                >
                  {question.content}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Chip
                    label={question.categoryName}
                    size="small"
                    sx={{
                      background: 'rgba(74, 144, 226, 0.1)',
                      color: '#4A5568',
                      fontWeight: 500,
                      borderRadius: '8px',
                      border: '1px solid rgba(74, 144, 226, 0.2)',
                    }}
                  />
                  {/* Người huỷ hoặc Người trả lời */}
                  {question.status === 'CANCELED' && question.updaterName ? (
                    <Typography
                      variant="body2"
                      color="#4A5568"
                      sx={{ fontSize: '0.95rem', fontWeight: 500 }}
                    >
                      Người huỷ: {question.updaterName}
                    </Typography>
                  ) : question.status === 'ANSWERED' && question.replierName ? (
                    <Typography
                      variant="body2"
                      color="#4A5568"
                      sx={{ fontSize: '0.95rem', fontWeight: 500 }}
                    >
                      Người trả lời: {question.replierName}
                    </Typography>
                  ) : null}
                </Box>
                {/* Nếu bị huỷ thì hiển thị lý do huỷ nổi bật */}
                {question.status === 'CANCELED' && question.rejectionReason && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2.5,
                      borderRadius: '10px',
                      background:
                        'linear-gradient(90deg, #ffebee 60%, #ffcdd2 100%)',
                      color: '#ef4444',
                      fontWeight: 600,
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      border: '1px solid #ffcdd2',
                    }}
                  >
                    <HelpOutlineIcon sx={{ color: '#ef4444', mr: 1 }} />
                    Lý do huỷ: {question.rejectionReason}
                  </Box>
                )}
                {/* Nếu có câu trả lời và không bị huỷ */}
                {question.status === 'ANSWERED' && question.answer && (
                  <Box
                    sx={{
                      mt: 3,
                      pt: 3,
                      borderTop: '1px solid rgba(74, 144, 226, 0.2)',
                      animation: 'fadeIn 0.5s ease-in-out',
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(-10px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background:
                            'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                          mr: 1.5,
                          fontWeight: 700,
                          fontSize: '1rem',
                          border: '2px solid rgba(74, 144, 226, 0.2)',
                          color: '#fff',
                        }}
                      >
                        {question.replierName
                          ? question.replierName.split(' ').pop().charAt(0)
                          : '?'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body1"
                          color="#2D3748"
                          sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.3 }}
                        >
                          {question.replierName || 'Chuyên gia'}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#4A5568"
                          sx={{ fontSize: '0.85rem' }}
                        >
                          Trả lời lúc:{' '}
                          {Array.isArray(question.updatedAt)
                            ? formatDateTimeFromArray(question.updatedAt)
                            : 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '14px',
                        background:
                          'linear-gradient(145deg, rgba(76, 175, 80, 0.15), rgba(46, 204, 113, 0.08))',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        boxShadow: '0 4px 15px rgba(46, 204, 113, 0.15)',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: '1rem',
                          letterSpacing: '0.3px',
                          color: '#2D3748',
                        }}
                      >
                        {question.answer}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </QuestionCard>
          ))}
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
            onClick={handleOpenNewQuestion}
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
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
};

export default QuestionsContent;

/**
 * MyQuestionsContent.js
 *
 * Mục đích: Component quản lý câu hỏi của tư vấn viên
 * - Hiển thị các câu hỏi đã đặt của tư vấn viên
 * - Tạo câu hỏi mới
 * - Xem chi tiết và trả lời câu hỏi của chính mình
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Avatar,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  QuestionAnswer as QuestionIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import questionService from '../../services/questionService';
import { formatDateTimeFromArray } from '../../utils/dateUtils';
import { confirmDialog } from '../../utils/confirmDialog';
import { useUser } from '../../context/UserContext';
import { notify } from '../../utils/notify';

// SỬA styled component cho nền tổng thể
const SimpleContainer = styled(Box)(() => ({
  background: '#e3f2fd',
  minHeight: '100vh',
  padding: '32px 0',
}));

// SỬA Card header
const SimpleCard = styled(Paper)(() => ({
  background: 'linear-gradient(135deg, #ffffff 60%, #e3f2fd 100%)',
  marginBottom: '24px',
  padding: '28px 32px',
  border: '1px solid #bbdefb',
  borderRadius: 18,
  boxShadow: '0 4px 24px rgba(33,150,243,0.08)',
}));

// SỬA Button
const SimpleButton = styled(Button)(() => ({
  background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
  color: '#fff',
  fontWeight: 600,
  borderRadius: 12,
  fontSize: '1.08rem',
  boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
  padding: '8px 28px',
  textTransform: 'none',
  letterSpacing: 0.5,
  '&:hover': {
    background: 'linear-gradient(90deg, #43a047 0%, #1976d2 100%)',
    color: '#fff',
    transform: 'translateY(-2px) scale(1.03)',
    boxShadow: '0 6px 18px rgba(33,150,243,0.12)',
  },
}));

// SỬA TextField
const SimpleTextField = styled(TextField)(() => ({
  backgroundColor: '#fff',
  borderRadius: 12,
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    fontSize: '1.08rem',
    background: 'rgba(255,255,255,0.98)',
    transition: 'box-shadow 0.2s',
    boxShadow: '0 1px 4px rgba(33,150,243,0.04)',
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px #1976d2',
      borderColor: '#1976d2',
    },
  },
}));

// SỬA Paper (table, toolbar)
const SimplePaper = styled(Paper)(() => ({
  backgroundColor: '#fff',
  border: '1px solid #bbdefb',
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(33,150,243,0.06)',
}));

// SỬA StatusChip
const SimpleStatusChip = styled(Chip)(({ status }) => ({
  fontSize: '11px',
  height: '20px',
  fontWeight: 500,
  borderRadius: 8,
  ...(status === 'pending' && {
    backgroundColor: '#fffde7',
    color: '#f9a825',
    border: '1px solid #ffe082',
  }),
  ...(status === 'answered' && {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
    border: '1px solid #a5d6a7',
  }),
}));

// SỬA CategoryChip
const SimpleCategoryChip = styled(Chip)(() => ({
  fontSize: '11px',
  height: '20px',
  fontWeight: 500,
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  border: '1px solid #90caf9',
  borderRadius: 8,
}));

const MyQuestionsContent = () => {
  const { user } = useUser();
  const currentUserId = user?.userId;
  const [questions, setQuestions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [answerDialogContent, setAnswerDialogContent] = useState('');
  const [answerDialogLoading, setAnswerDialogLoading] = useState(false);
  const [answerDialogError, setAnswerDialogError] = useState('');
  const [tabStatus, setTabStatus] = useState('CONFIRMED');
  const [openAnswerRowId, setOpenAnswerRowId] = useState(null);
  const [inlineAnswerContent, setInlineAnswerContent] = useState('');
  const [inlineAnswerLoading, setInlineAnswerLoading] = useState(false);
  const [inlineAnswerError, setInlineAnswerError] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailDialogQuestion, setDetailDialogQuestion] = useState(null);

  // State cho tính năng cập nhật câu trả lời
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [editAnswerContent, setEditAnswerContent] = useState('');
  const [editAnswerLoading, setEditAnswerLoading] = useState(false);
  const [editAnswerError, setEditAnswerError] = useState('');

  // Thêm state cho filters
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState(null);
  const [dateToFilter, setDateToFilter] = useState(null);
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Lấy danh sách danh mục câu hỏi
  const fetchCategories = async () => {
    try {
      const response = await questionService.getCategories();
      const categoriesData = response.data.data || [];
      setCategories(categoriesData);
      console.log('Categories loaded:', categoriesData); // Debug
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Lấy danh sách câu hỏi được phân công cho consultant hiện tại từ backend
  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await questionService.getAssignedQuestionsToMe({
        page: 0,
        size: 100,
        sort: 'createdAt',
        direction: 'DESC',
      });
      const content = res.data.data?.content || [];
      setQuestions(content);
      setTotalElements(res.data.data?.totalElements || content.length);

      // Debug log
      console.log('Questions loaded:', content);
      if (content.length > 0) {
        console.log('Sample question structure:', content[0]);
      }
    } catch (err) {
      setError('Không thể tải danh sách câu hỏi.');
      setQuestions([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Handlers cho phần "Câu hỏi của tôi"
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  // Handler for answering consultant's own questions
  const handleOpenAnswerDialog = async (question) => {
    const answer = await confirmDialog.answer({
      question: {
        content: question.content,
        customerName: question.customerName,
        createdAt: Array.isArray(question.createdAt)
          ? formatDateTimeFromArray(question.createdAt)
          : '',
      },
      defaultAnswer: '',
      title: 'Trả lời câu hỏi',
      confirmText: 'Gửi trả lời',
      cancelText: 'Hủy',
    });
    if (answer) {
      try {
        await questionService.answerQuestion(question.id, { answer });
        fetchQuestions();
        notify.success('Thành công', 'Đã trả lời câu hỏi thành công!');
      } catch (error) {
        notify.error(
          'Lỗi',
          'Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.'
        );
      }
    }
  };

  // Handler mở ô trả lời inline
  const handleOpenInlineAnswer = (question) => {
    setDetailDialogQuestion(question);
    setOpenAnswerRowId(question.id);
    setInlineAnswerContent('');
    setInlineAnswerError('');
    // Giữ dialog chi tiết mở và hiển thị form trả lời
  };

  // Handler gửi trả lời inline
  const handleSubmitInlineAnswer = async (question) => {
    if (!inlineAnswerContent.trim()) {
      setInlineAnswerError('Vui lòng nhập nội dung trả lời');
      return;
    }
    setInlineAnswerLoading(true);
    setInlineAnswerError('');
    try {
      await questionService.answerQuestion(question.id, {
        answer: inlineAnswerContent,
      });
      setOpenAnswerRowId(null);
      setInlineAnswerContent('');
      setDetailDialogOpen(false); // Đóng dialog chi tiết
      setDetailDialogQuestion(null);
      fetchQuestions();
      notify.success('Thành công', 'Đã trả lời câu hỏi thành công!');
    } catch (error) {
      setInlineAnswerError(
        'Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.'
      );
    } finally {
      setInlineAnswerLoading(false);
    }
  };

  // Handler mở chế độ chỉnh sửa câu trả lời
  const handleEditAnswer = (question) => {
    setIsEditingAnswer(true);
    setEditAnswerContent(question.answer);
    setEditAnswerError('');
  };

  // Handler hủy chỉnh sửa câu trả lời
  const handleCancelEditAnswer = () => {
    setIsEditingAnswer(false);
    setEditAnswerContent('');
    setEditAnswerError('');
  };

  // Handler cập nhật câu trả lời
  const handleUpdateAnswer = async (question) => {
    if (!editAnswerContent.trim()) {
      setEditAnswerError('Vui lòng nhập nội dung trả lời');
      return;
    }
    setEditAnswerLoading(true);
    setEditAnswerError('');
    try {
      await questionService.updateAnswer(question.id, {
        answer: editAnswerContent,
      });
      setIsEditingAnswer(false);
      setEditAnswerContent('');

      // Cập nhật câu trả lời trong dialog hiện tại
      setDetailDialogQuestion({
        ...detailDialogQuestion,
        answer: editAnswerContent,
      });

      fetchQuestions();
      notify.success('Thành công', 'Đã cập nhật câu trả lời thành công!');
    } catch (error) {
      setEditAnswerError(
        'Có lỗi xảy ra khi cập nhật câu trả lời. Vui lòng thử lại sau.'
      );
    } finally {
      setEditAnswerLoading(false);
    }
  };

  // Utility functions
  const renderStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return (
          <SimpleStatusChip
            label="Chờ trả lời"
            size="small"
            status={status}
            icon={<PendingIcon fontSize="small" />}
          />
        );
      case 'answered':
        return (
          <SimpleStatusChip
            label="Đã trả lời"
            size="small"
            status={status}
            icon={<CheckCircleIcon fontSize="small" />}
          />
        );
      case 'closed':
        return (
          <SimpleStatusChip
            label="Đã đóng"
            size="small"
            status={status}
            icon={<CloseIcon fontSize="small" />}
          />
        );
      default:
        return <SimpleStatusChip label="Không xác định" size="small" />;
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case 'answered':
        return 'Đã trả lời';
      case 'pending':
        return 'Chờ trả lời';
      default:
        return status;
    }
  };

  // Hàm kiểm tra ngày có nằm trong khoảng filter không
  const isDateInRange = (questionDate) => {
    if (!dateFromFilter && !dateToFilter) return true;

    const questionDateTime = Array.isArray(questionDate)
      ? new Date(
          questionDate[0],
          questionDate[1] - 1,
          questionDate[2],
          questionDate[3],
          questionDate[4]
        )
      : new Date(questionDate);

    if (dateFromFilter && questionDateTime < dateFromFilter) return false;
    if (dateToFilter && questionDateTime > dateToFilter) return false;

    return true;
  };

  // Filter câu hỏi với tất cả các điều kiện
  const filteredQuestions = questions.filter((question) => {
    // Debug log
    if (categoryFilter) {
      console.log('Filtering question:', {
        questionId: question.id,
        questionCategoryId: question.categoryId,
        categoryFilter: categoryFilter,
        categoryFilterType: typeof categoryFilter,
        questionCategoryIdType: typeof question.categoryId,
        match: question.categoryId === parseInt(categoryFilter),
      });
    }

    // Filter theo status
    if (question.status !== tabStatus) return false;

    // Filter theo search term
    const searchMatch =
      !searchTerm ||
      (question.title &&
        question.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (question.category &&
        question.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (question.categoryName &&
        question.categoryName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (question.customerName &&
        question.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (question.customerId &&
        question.customerId.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!searchMatch) return false;

    // Filter theo danh mục
    if (categoryFilter && question.categoryId !== parseInt(categoryFilter))
      return false;

    // Filter theo ngày
    if (!isDateInRange(question.createdAt)) return false;

    // Filter theo tên khách hàng
    if (
      customerNameFilter &&
      !question.customerName
        ?.toLowerCase()
        .includes(customerNameFilter.toLowerCase())
    )
      return false;

    return true;
  });

  // Clear tất cả filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDateFromFilter(null);
    setDateToFilter(null);
    setCustomerNameFilter('');
  };

  const handleOpenDetailDialog = (question) => {
    setDetailDialogQuestion(question);
    setDetailDialogOpen(true);
  };
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setDetailDialogQuestion(null);
    // Reset trạng thái trả lời inline
    setOpenAnswerRowId(null);
    setInlineAnswerContent('');
    setInlineAnswerError('');
    // Reset trạng thái chỉnh sửa câu trả lời
    setIsEditingAnswer(false);
    setEditAnswerContent('');
    setEditAnswerError('');
  };

  return (
    <SimpleContainer>
      <Container maxWidth="lg">
        {/* Header Section */}
        <SimpleCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <QuestionIcon sx={{ fontSize: 40, mr: 2, color: '#2196F3' }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quản lý câu hỏi chuyên môn
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hệ thống quản lý và trao đổi kiến thức y tế chuyên nghiệp
              </Typography>
            </Box>
          </Box>
        </SimpleCard>

        {/* Toolbar */}
        <SimplePaper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            {/* Search Bar */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <SimpleTextField
                size="medium"
                placeholder="Tìm kiếm theo tiêu đề, danh mục, tên khách hàng, ID..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{ minWidth: { xs: '100%', md: '400px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ borderRadius: 2 }}
                >
                  {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </Button>
                {(searchTerm ||
                  categoryFilter ||
                  dateFromFilter ||
                  dateToFilter ||
                  customerNameFilter) && (
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearAllFilters}
                    sx={{ borderRadius: 2 }}
                  >
                    Xóa lọc
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Advanced Filters */}
            {showFilters && (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <Grid container spacing={2}>
                  {/* Filter theo danh mục */}
                  <Grid item size={3} xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Danh mục</InputLabel>
                      <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        label="Danh mục"
                      >
                        <MenuItem value="">
                          <em>Tất cả danh mục</em>
                        </MenuItem>
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
                  </Grid>

                  {/* Filter theo tên khách hàng */}
                  <Grid item xs={12} md={3}>
                    <SimpleTextField
                      fullWidth
                      size="small"
                      label="Tên khách hàng"
                      placeholder="Nhập tên khách hàng..."
                      value={customerNameFilter}
                      onChange={(e) => setCustomerNameFilter(e.target.value)}
                    />
                  </Grid>

                  {/* Filter theo ngày từ */}
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Từ ngày"
                      value={dateFromFilter}
                      onChange={setDateFromFilter}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>

                  {/* Filter theo ngày đến */}
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Đến ngày"
                      value={dateToFilter}
                      onChange={setDateToFilter}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}
          </Stack>
        </SimplePaper>

        {/* Tabs */}
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={tabStatus}
            onChange={(_, newValue) => setTabStatus(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="standard"
          >
            <Tab label="Chờ trả lời" value="CONFIRMED" />
            <Tab label="Đã trả lời" value="ANSWERED" />
          </Tabs>
        </Box>

        {/* Questions Table */}
        <SimplePaper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Người hỏi</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question, index) => [
                    <TableRow
                      key={question.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.06)',
                          transform: 'scale(1.001)',
                          transition: 'all 0.2s ease',
                        },
                        backgroundColor:
                          index % 2 === 0
                            ? 'rgba(248, 250, 252, 0.5)'
                            : 'transparent',
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="primary"
                        >
                          #{question.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="text.primary"
                        >
                          {question.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <SimpleCategoryChip
                          label={
                            question.categoryName || question.category || ''
                          }
                          size="small"
                          category={
                            question.categoryName || question.category || ''
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {Array.isArray(question.createdAt)
                            ? formatDateTimeFromArray(question.createdAt)
                            : ''}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {['CONFIRMED', 'pending'].includes(question.status) ? (
                          <Tooltip title="Trả lời câu hỏi">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenAnswerDialog(question)}
                              sx={{
                                background:
                                  'linear-gradient(45deg, #1ABC9C, #16A085)',
                                color: '#fff',
                                '&:hover': {
                                  background:
                                    'linear-gradient(45deg, #16A085, #138D75)',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetailDialog(question)}
                              sx={{
                                color: '#4A90E2',
                                '&:hover': {
                                  backgroundColor: 'rgba(74, 144, 226, 0.1)',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>,
                  ])}
                {filteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ py: 8 }}>
                        <QuestionIcon
                          sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          Không tìm thấy câu hỏi nào
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo câu hỏi mới
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredQuestions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid rgba(74, 144, 226, 0.1)',
                backgroundColor: 'rgba(248, 250, 252, 0.5)',
              }}
            />
          </TableContainer>
        </SimplePaper>
      </Container>

      {/* View Question Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <VisibilityIcon />
          Chi tiết câu hỏi
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {currentQuestion && (
            <Box sx={{ mt: 2 }}>
              <Card
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid rgba(74, 144, 226, 0.1)',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <SimpleCategoryChip
                      label={
                        currentQuestion.categoryName ||
                        currentQuestion.category ||
                        ''
                      }
                      size="small"
                      category={
                        currentQuestion.categoryName ||
                        currentQuestion.category ||
                        ''
                      }
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ngày tạo:{' '}
                      {Array.isArray(currentQuestion.createdAt)
                        ? formatDateTimeFromArray(currentQuestion.createdAt)
                        : ''}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                    {currentQuestion.content || 'Không có nội dung chi tiết'}
                  </Typography>
                </CardContent>
              </Card>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <QuestionIcon />
                Trả lời:
              </Typography>
              {currentQuestion.status === 'CONFIRMED' ? (
                <Box>
                  <TextField
                    label="Nội dung trả lời"
                    multiline
                    rows={6}
                    fullWidth
                    variant="outlined"
                    value={answerDialogContent}
                    onChange={(e) => setAnswerDialogContent(e.target.value)}
                    placeholder="Nhập câu trả lời chuyên môn và chi tiết..."
                    sx={{ background: '#fff', borderRadius: 2, mb: 2 }}
                  />
                  {answerDialogError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {answerDialogError}
                    </Alert>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleOpenAnswerDialog}
                    disabled={
                      answerDialogLoading || !answerDialogContent.trim()
                    }
                    startIcon={
                      answerDialogLoading ? (
                        <CircularProgress size={18} sx={{ color: '#fff' }} />
                      ) : (
                        <SendIcon />
                      )
                    }
                    sx={{ borderRadius: 2, px: 4, py: 1, fontWeight: 600 }}
                  >
                    {answerDialogLoading ? 'Đang gửi...' : 'Gửi trả lời'}
                  </Button>
                </Box>
              ) : currentQuestion.status === 'ANSWERED' ? (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.1) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: '12px',
                    mt: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="success.main"
                      fontWeight={600}
                      mb={1}
                    >
                      Câu trả lời:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {currentQuestion.answer}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
                  Câu hỏi đang chờ được trả lời.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseViewDialog} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog xem chi tiết câu hỏi đã trả lời */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #00897b 0%, #26a69a 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 600,
            fontSize: '1.3rem',
            minHeight: 65,
            p: '20px 32px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #4fc3f7 0%, #29b6f6 100%)',
            },
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VisibilityIcon sx={{ fontSize: 28 }} />
          </Box>
          Chi tiết câu hỏi chuyên môn
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, md: 4 }, background: '#fafafa' }}>
          {detailDialogQuestion && (
            <Stack spacing={4}>
              {/* Header thông tin bệnh nhân */}
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                  border: '2px solid #e1f5fe',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 150, 136, 0.08)',
                  p: 3,
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor:
                            'linear-gradient(135deg, #00897b 0%, #26a69a 100%)',
                          fontWeight: 700,
                          fontSize: 20,
                          boxShadow: '0 4px 12px rgba(0, 137, 123, 0.3)',
                        }}
                      >
                        {detailDialogQuestion.customerName?.charAt(0) || 'P'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#00695c"
                          sx={{ mb: 0.5 }}
                        >
                          {detailDialogQuestion.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📧 {detailDialogQuestion.customerEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🆔 Mã bệnh nhân: #{detailDialogQuestion.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.5} alignItems="flex-end">
                      <SimpleCategoryChip
                        label={
                          detailDialogQuestion.categoryName ||
                          detailDialogQuestion.category ||
                          ''
                        }
                        size="medium"
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          px: 2.5,
                          py: 1,
                          background:
                            'linear-gradient(45deg, #4fc3f7 0%, #29b6f6 100%)',
                          color: '#fff',
                          boxShadow: '0 2px 8px rgba(79, 195, 247, 0.3)',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        📅{' '}
                        {Array.isArray(detailDialogQuestion.createdAt)
                          ? formatDateTimeFromArray(
                              detailDialogQuestion.createdAt
                            )
                          : ''}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
              {/* Nội dung câu hỏi */}
              {/* Nội dung câu hỏi */}
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #fff 100%)',
                  border: '2px solid #c8e6c9',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                }}
              >
                <Box
                  sx={{
                    background:
                      'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                    color: '#fff',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <QuestionIcon sx={{ fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Nội dung câu hỏi
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontSize: 16,
                      color: '#424242',
                      textAlign: 'justify',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {detailDialogQuestion.content}
                  </Typography>
                </Box>
              </Card>
              {/* Thông tin bác sĩ và trạng thái */}
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #fff 100%)',
                  border: '2px solid #e1bee7',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(156, 39, 176, 0.1)',
                }}
              >
                <Box
                  sx={{
                    background:
                      'linear-gradient(135deg, #ba68c8 0%, #9c27b0 100%)',
                    color: '#fff',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Thông tin xử lý
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Người duyệt */}
                    {detailDialogQuestion.updaterName && (
                      <Grid size={6} item xs={12} md={6}>
                        <Stack direction="row" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor:
                                'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                              fontWeight: 700,
                              fontSize: 18,
                              boxShadow: '0 3px 10px rgba(33, 150, 243, 0.3)',
                            }}
                          >
                            {detailDialogQuestion.updaterName?.charAt(0) ||
                              'QT'}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="#1565c0"
                            >
                              Người duyệt: {detailDialogQuestion.updaterName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              🆔 ID: {detailDialogQuestion.updaterId}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    )}

                    {/* Thông tin thời gian */}
                    <Grid size={6} item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="text.secondary">
                            📅 <strong>Ngày tạo:</strong>
                            <br />
                            {Array.isArray(detailDialogQuestion.createdAt)
                              ? formatDateTimeFromArray(
                                  detailDialogQuestion.createdAt
                                )
                              : 'Không xác định'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="text.secondary">
                            🔄 <strong>Ngày cập nhật:</strong>
                            <br />
                            {Array.isArray(detailDialogQuestion.updatedAt)
                              ? formatDateTimeFromArray(
                                  detailDialogQuestion.updatedAt
                                )
                              : 'Chưa cập nhật'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Card>

              {/* Câu trả lời chuyên môn */}
              {detailDialogQuestion.answer ? (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, #e8f5e8 0%, #fff 100%)',
                    border: '2px solid #81c784',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.12)',
                  }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                      color: '#fff',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 24 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Câu trả lời từ tư vấn viên
                      </Typography>
                    </Box>
                    {!isEditingAnswer && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEditAnswer(detailDialogQuestion)}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                          },
                        }}
                        startIcon={<EditIcon />}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ p: 3 }}>
                    {isEditingAnswer ? (
                      // Form chỉnh sửa câu trả lời
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          value={editAnswerContent}
                          onChange={(e) => setEditAnswerContent(e.target.value)}
                          placeholder="Chỉnh sửa lời tư vấn chuyên môn..."
                          error={!!editAnswerError}
                          helperText={editAnswerError}
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff',
                              fontSize: 16,
                              lineHeight: 1.6,
                              '& fieldset': {
                                borderColor: '#81c784',
                                borderWidth: 2,
                              },
                              '&:hover fieldset': {
                                borderColor: '#4caf50',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#4caf50',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="flex-end"
                        >
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={handleCancelEditAnswer}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              textTransform: 'none',
                              px: 3,
                              py: 1,
                              borderColor: '#bdbdbd',
                              color: '#757575',
                              '&:hover': {
                                borderColor: '#9e9e9e',
                                backgroundColor: '#f5f5f5',
                              },
                            }}
                          >
                            ❌ Hủy bỏ
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() =>
                              handleUpdateAnswer(detailDialogQuestion)
                            }
                            disabled={
                              editAnswerLoading || !editAnswerContent.trim()
                            }
                            sx={{
                              background:
                                'linear-gradient(45deg, #4caf50 0%, #66bb6a 100%)',
                              borderRadius: 2,
                              fontWeight: 600,
                              textTransform: 'none',
                              minWidth: 140,
                              px: 3,
                              py: 1,
                              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                              '&:hover': {
                                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                              },
                              '&:disabled': {
                                background: '#e0e0e0',
                                color: '#9e9e9e',
                              },
                            }}
                          >
                            {editAnswerLoading ? (
                              <>
                                <CircularProgress
                                  size={20}
                                  color="inherit"
                                  sx={{ mr: 1 }}
                                />
                                Đang cập nhật...
                              </>
                            ) : (
                              '💾 Cập nhật'
                            )}
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      // Hiển thị câu trả lời
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: 16,
                          color: '#2e7d32',
                          textAlign: 'justify',
                          whiteSpace: 'pre-wrap',
                          background: '#fff',
                          p: 2.5,
                          borderRadius: 2,
                          border: '1px solid #e8f5e9',
                          fontWeight: 500,
                        }}
                      >
                        {detailDialogQuestion.answer}
                      </Typography>
                    )}
                  </Box>
                </Card>
              ) : detailDialogQuestion.status === 'CONFIRMED' ? (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, #fff8e1 0%, #fff 100%)',
                    border: '2px solid #ffcc02',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(255, 193, 7, 0.12)',
                  }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                      color: '#fff',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <HourglassEmptyIcon sx={{ fontSize: 24 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Chờ tư vấn y tế
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      Câu hỏi này đã được duyệt và đang chờ bạn cung cấp lời tư
                      vấn chuyên môn.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() =>
                        handleOpenInlineAnswer(detailDialogQuestion)
                      }
                      sx={{
                        background:
                          'linear-gradient(45deg, #ff9800 0%, #ffb74d 100%)',
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                        },
                      }}
                    >
                      📝 Viết lời tư vấn
                    </Button>
                  </Box>
                </Card>
              ) : (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, #f5f5f5 0%, #fff 100%)',
                    border: '2px solid #e0e0e0',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #757575 0%, #616161 100%)',
                      color: '#fff',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 24 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Trạng thái xử lý
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ textAlign: 'center' }}
                    >
                      Câu hỏi này đang trong quá trình xử lý hoặc chưa được phân
                      công.
                    </Typography>
                  </Box>
                </Card>
              )}

              {/* Form trả lời inline nếu đang trong chế độ trả lời */}
              {openAnswerRowId === detailDialogQuestion?.id && (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
                    border: '3px solid #2196f3',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 6px 24px rgba(33, 150, 243, 0.2)',
                  }}
                >
                  <Box
                    sx={{
                      background:
                        'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                      color: '#fff',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <SendIcon sx={{ fontSize: 24 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Viết lời tư vấn chuyên môn
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      value={inlineAnswerContent}
                      onChange={(e) => setInlineAnswerContent(e.target.value)}
                      placeholder="Hãy viết lời tư vấn chi tiết, chuyên môn và dễ hiểu cho bệnh nhân..."
                      error={!!inlineAnswerError}
                      helperText={inlineAnswerError}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#fff',
                          fontSize: 16,
                          lineHeight: 1.6,
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: 2,
                          },
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setOpenAnswerRowId(null)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          px: 3,
                          py: 1,
                          borderColor: '#bdbdbd',
                          color: '#757575',
                          '&:hover': {
                            borderColor: '#9e9e9e',
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        ❌ Hủy bỏ
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() =>
                          handleSubmitInlineAnswer(detailDialogQuestion)
                        }
                        disabled={
                          inlineAnswerLoading || !inlineAnswerContent.trim()
                        }
                        sx={{
                          background:
                            'linear-gradient(45deg, #4caf50 0%, #66bb6a 100%)',
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          minWidth: 140,
                          px: 3,
                          py: 1,
                          boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                          },
                          '&:disabled': {
                            background: '#e0e0e0',
                            color: '#9e9e9e',
                          },
                        }}
                      >
                        {inlineAnswerLoading ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Đang gửi...
                          </>
                        ) : (
                          '✅ Gửi tư vấn'
                        )}
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Button
            onClick={handleCloseDetailDialog}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(45deg, #757575 0%, #616161 100%)',
              color: '#fff',
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(117, 117, 117, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(117, 117, 117, 0.4)',
              },
            }}
          >
            🚪 Đóng cửa sổ
          </Button>
        </DialogActions>
      </Dialog>
    </SimpleContainer>
  );
};

export default MyQuestionsContent;

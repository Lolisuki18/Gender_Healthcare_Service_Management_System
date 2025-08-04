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
  Card,
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
  HourglassEmpty as HourglassEmptyIcon,
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
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
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
    try {
      const res = await questionService.getAssignedQuestionsToMe({
        page: 0,
        size: 100,
        sort: 'createdAt',
        direction: 'DESC',
      });
      const content = res.data.data?.content || [];
      setQuestions(content);

      // Debug log
      console.log('Questions loaded:', content);
      if (content.length > 0) {
        console.log('Sample question structure:', content[0]);
      }
    } catch (err) {
      console.error('Không thể tải danh sách câu hỏi:', err);
      setQuestions([]);
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

  // Hàm kiểm tra ngày có nằm trong khoảng filter không
  const isDateInRange = (questionDate) => {
    if (!dateFromFilter && !dateToFilter) return true;

    const questionDateTime = Array.isArray(questionDate)
      ? new Date(
          questionDate[0], // year
          questionDate[1] - 1, // month (trừ 1 vì JS month bắt đầu từ 0)
          questionDate[2], // day
          questionDate[3], // hour
          questionDate[4] // minute
        )
      : new Date(questionDate);

    if (dateFromFilter && questionDateTime < dateFromFilter) return false;
    if (dateToFilter && questionDateTime > dateToFilter) return false;

    return true;
  };

  // Filter câu hỏi với tất cả các điều kiện
  const filteredQuestions = questions.filter((question) => {
    // // Debug log
    // if (categoryFilter) {
    //   console.log('Filtering question:', {
    //     questionId: question.id,
    //     questionCategoryId: question.categoryId,
    //     categoryFilter: categoryFilter,
    //     categoryFilterType: typeof categoryFilter,
    //     questionCategoryIdType: typeof question.categoryId,
    //     match: question.categoryId === parseInt(categoryFilter),
    //   });
    // }

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

  // Render danh sách câu hỏi
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
                        {['CONFIRMED', 'PENDING'].includes(question.status) ? (
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

      {/* Dialog xem chi tiết câu hỏi đã trả lời */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            background: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: '#f8f9fa',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 600,
            fontSize: '1.2rem',
            minHeight: 60,
            p: '16px 24px',
            borderBottom: '2px solid #e9ecef',
          }}
        >
          <Box
            sx={{
              background: '#3498db',
              borderRadius: '4px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VisibilityIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          Chi tiết câu hỏi y tế
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: '#f8f9fa' }}>
          {detailDialogQuestion && (
            <Stack spacing={3}>
              {/* Header thông tin bệnh nhân */}
              <Card
                sx={{
                  background: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  p: 3,
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item size={6} xs={12} md={8}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: '#3498db',
                          fontWeight: 600,
                          fontSize: 18,
                        }}
                      >
                        {detailDialogQuestion.customerName?.charAt(0) || 'P'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#2c3e50"
                          sx={{ mb: 0.5 }}
                        >
                          {detailDialogQuestion.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {detailDialogQuestion.customerEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mã bệnh nhân: #{detailDialogQuestion.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item size={6} xs={12} md={4}>
                    <Stack spacing={1} alignItems="flex-end">
                      <Chip
                        label={
                          detailDialogQuestion.categoryName ||
                          detailDialogQuestion.category ||
                          ''
                        }
                        size="small"
                        sx={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 500,
                          border: '1px solid #bbdefb',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Ngày tạo:{' '}
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
              <Card
                sx={{
                  background: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box
                  sx={{
                    background: '#e8f4fd',
                    color: '#2c3e50',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid #dee2e6',
                  }}
                >
                  <QuestionIcon sx={{ fontSize: 20, color: '#3498db' }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Nội dung câu hỏi
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: 15,
                      color: '#2c3e50',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {detailDialogQuestion.content}
                  </Typography>
                </Box>
              </Card>

              {/* Thông tin xử lý */}
              <Card
                sx={{
                  background: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box
                  sx={{
                    background: '#f8f9fa',
                    color: '#2c3e50',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid #dee2e6',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#6c757d' }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Thông tin xử lý
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Người duyệt */}
                    {detailDialogQuestion.updaterName && (
                      <Grid item size={6} xs={12} md={6}>
                        <Stack direction="row" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: '#6c757d',
                              fontWeight: 600,
                              fontSize: 16,
                            }}
                          >
                            {detailDialogQuestion.updaterName?.charAt(0) ||
                              'BS'}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              color="#2c3e50"
                            >
                              Người duyệt: {detailDialogQuestion.updaterName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {detailDialogQuestion.updaterId}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    )}

                    {/* Thông tin thời gian */}
                    <Grid item size={6} xs={12}>
                      <Box sx={{ mt: 2, pt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item size={6} xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Ngày tạo:</strong>
                              <br />
                              {Array.isArray(detailDialogQuestion.createdAt)
                                ? formatDateTimeFromArray(
                                    detailDialogQuestion.createdAt
                                  )
                                : 'Không xác định'}
                            </Typography>
                          </Grid>
                          <Grid item size={6} xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Ngày cập nhật:</strong>
                              <br />
                              {Array.isArray(detailDialogQuestion.updatedAt)
                                ? formatDateTimeFromArray(
                                    detailDialogQuestion.updatedAt
                                  )
                                : 'Chưa cập nhật'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>

              {/* Câu trả lời chuyên môn */}
              {detailDialogQuestion.answer ? (
                <Card
                  sx={{
                    background: '#ffffff',
                    border: '1px solid #28a745',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(40, 167, 69, 0.1)',
                  }}
                >
                  <Box
                    sx={{
                      background: '#d4edda',
                      color: '#155724',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #c3e6cb',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Câu trả lời từ bác sĩ
                      </Typography>
                    </Box>
                    {!isEditingAnswer && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditAnswer(detailDialogQuestion)}
                        sx={{
                          color: '#155724',
                          borderColor: '#155724',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#0f4419',
                            background: 'rgba(21, 87, 36, 0.04)',
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
                          rows={6}
                          value={editAnswerContent}
                          onChange={(e) => setEditAnswerContent(e.target.value)}
                          placeholder="Nhập lời tư vấn chuyên môn..."
                          error={!!editAnswerError}
                          helperText={editAnswerError}
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              fontSize: 14,
                              '& fieldset': {
                                borderColor: '#ced4da',
                              },
                              '&:hover fieldset': {
                                borderColor: '#3498db',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#3498db',
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
                            onClick={handleCancelEditAnswer}
                            sx={{
                              textTransform: 'none',
                              color: '#6c757d',
                              borderColor: '#6c757d',
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleUpdateAnswer(detailDialogQuestion)
                            }
                            disabled={
                              editAnswerLoading || !editAnswerContent.trim()
                            }
                            sx={{
                              background: '#28a745',
                              textTransform: 'none',
                              '&:hover': {
                                background: '#218838',
                              },
                            }}
                          >
                            {editAnswerLoading ? (
                              <>
                                <CircularProgress
                                  size={16}
                                  color="inherit"
                                  sx={{ mr: 1 }}
                                />
                                Đang cập nhật...
                              </>
                            ) : (
                              'Cập nhật'
                            )}
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      // Hiển thị câu trả lời
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          fontSize: 15,
                          color: '#2c3e50',
                          whiteSpace: 'pre-wrap',
                          background: '#f8f9fa',
                          p: 2,
                          borderRadius: 1,
                          border: '1px solid #dee2e6',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
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
                    background: '#ffffff',
                    border: '1px solid #ffc107',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.1)',
                  }}
                >
                  <Box
                    sx={{
                      background: '#fff3cd',
                      color: '#856404',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderBottom: '1px solid #ffeaa7',
                    }}
                  >
                    <HourglassEmptyIcon sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Chờ tư vấn
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      Câu hỏi này đã được duyệt và đang chờ bạn cung cấp lời tư
                      vấn chuyên môn.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleOpenInlineAnswer(detailDialogQuestion)
                      }
                      sx={{
                        background: '#ffc107',
                        color: '#212529',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: '#e0a800',
                        },
                      }}
                    >
                      Viết lời tư vấn
                    </Button>
                  </Box>
                </Card>
              ) : (
                <Card
                  sx={{
                    background: '#ffffff',
                    border: '1px solid #dee2e6',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <Box
                    sx={{
                      background: '#f8f9fa',
                      color: '#6c757d',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
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
                    background: '#ffffff',
                    border: '2px solid #3498db',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.15)',
                  }}
                >
                  <Box
                    sx={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderBottom: '1px solid #bbdefb',
                    }}
                  >
                    <SendIcon sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Viết lời tư vấn chuyên môn
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      value={inlineAnswerContent}
                      onChange={(e) => setInlineAnswerContent(e.target.value)}
                      placeholder="Hãy viết lời tư vấn chi tiết, chuyên môn và dễ hiểu cho bệnh nhân..."
                      error={!!inlineAnswerError}
                      helperText={inlineAnswerError}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          fontSize: 14,
                          '& fieldset': {
                            borderColor: '#ced4da',
                          },
                          '&:hover fieldset': {
                            borderColor: '#3498db',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3498db',
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
                        onClick={() => setOpenAnswerRowId(null)}
                        sx={{
                          textTransform: 'none',
                          color: '#6c757d',
                          borderColor: '#6c757d',
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleSubmitInlineAnswer(detailDialogQuestion)
                        }
                        disabled={
                          inlineAnswerLoading || !inlineAnswerContent.trim()
                        }
                        sx={{
                          background: '#28a745',
                          textTransform: 'none',
                          '&:hover': {
                            background: '#218838',
                          },
                        }}
                      >
                        {inlineAnswerLoading ? (
                          <>
                            <CircularProgress
                              size={16}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Đang gửi...
                          </>
                        ) : (
                          'Gửi tư vấn'
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
            background: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
          }}
        >
          <Button
            onClick={handleCloseDetailDialog}
            variant="contained"
            sx={{
              background: '#6c757d',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                background: '#5a6268',
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </SimpleContainer>
  );
};

export default MyQuestionsContent;

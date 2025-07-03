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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  QuestionAnswer as QuestionIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Close as CloseIcon,
  MedicalServices as MedicalIcon,
  Psychology as PsychologyIcon,
  Biotech as BiotechIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import questionService from '../../services/questionService';
import { formatDateTimeFromArray } from '../../utils/dateUtils';
import { confirmDialog } from '../../utils/confirmDialog';

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

// Thêm styled cho dialog hiện đại
const ModernDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  fontWeight: 700,
  fontSize: '1.45rem',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  minHeight: 64,
  padding: '24px 32px 16px 32px',
  boxShadow: '0 4px 24px rgba(74,144,226,0.10)',
}));
const ModernDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '32px 32px 16px 32px',
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
}));
const ModernInfoBox = styled(Box)(({ theme }) => ({
  background: '#f4f8fb',
  borderRadius: 14,
  padding: '18px 20px',
  marginBottom: 18,
  boxShadow: '0 2px 8px rgba(74,144,226,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}));
const ModernTextField = styled(SimpleTextField)(({ theme }) => ({
  borderRadius: 12,
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    fontSize: '1.08rem',
    background: 'rgba(255,255,255,0.98)',
    transition: 'box-shadow 0.2s',
    boxShadow: '0 1px 4px rgba(74,144,226,0.04)',
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px #4A90E2',
      borderColor: '#4A90E2',
    },
  },
}));
const ModernButton = styled(SimpleButton)(({ theme }) => ({
  background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
  color: '#fff',
  fontWeight: 700,
  borderRadius: 12,
  fontSize: '1.08rem',
  boxShadow: '0 2px 8px rgba(74,144,226,0.10)',
  transition: 'all 0.2s',
  '&:hover': {
    background: 'linear-gradient(90deg, #1ABC9C 0%, #4A90E2 100%)',
    transform: 'translateY(-2px) scale(1.03)',
    boxShadow: '0 6px 18px rgba(26,188,156,0.12)',
  },
}));

const MyQuestionsContent = () => {
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
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [answerDialogQuestion, setAnswerDialogQuestion] = useState(null);
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

  // Lấy danh sách câu hỏi CONFIRMED từ backend
  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      let allQuestions = [];
      let total = 0;
      const statuses = ['CONFIRMED', 'ANSWERED'];
      for (const st of statuses) {
        const res = await questionService.getQuestionsByStatus(st, {
          page: 0,
          size: 100,
          sort: 'createdAt',
          direction: 'DESC',
        });
        if (res.data.data && res.data.data.content) {
          allQuestions = allQuestions.concat(res.data.data.content);
          total += res.data.data.totalElements || 0;
        }
      }
      setQuestions(allQuestions);
      setTotalElements(total);
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

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenViewDialog = (question) => {
    setCurrentQuestion(question);
    setOpenViewDialog(true);
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
      } catch (error) {
        await confirmDialog.danger(
          'Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.'
        );
      }
    }
  };

  // Handler mở ô trả lời inline
  const handleOpenInlineAnswer = (question) => {
    setOpenAnswerRowId(question.id);
    setInlineAnswerContent('');
    setInlineAnswerError('');
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
      fetchQuestions();
    } catch (error) {
      setInlineAnswerError(
        'Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.'
      );
    } finally {
      setInlineAnswerLoading(false);
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

  // Filter functions
  const filteredQuestions = questions.filter(
    (question) =>
      question.status === tabStatus &&
      ((question.title &&
        question.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (question.category &&
          question.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (question.customerName &&
          question.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (question.customerId &&
          question.customerId.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleOpenDetailDialog = (question) => {
    setDetailDialogQuestion(question);
    setDetailDialogOpen(true);
  };
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setDetailDialogQuestion(null);
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
        </SimpleCard>{' '}
        {/* Toolbar */}
        <SimplePaper sx={{ p: 3, mb: 3 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            {' '}
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
            />{' '}
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
              {' '}
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
                      {' '}
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
          </TableContainer>{' '}
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
      </Dialog>{' '}
      {/* Dialog xem chi tiết câu hỏi đã trả lời */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
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
          {detailDialogQuestion && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Tiêu đề:
              </Typography>
              <Typography variant="h6" fontWeight={700} mb={1}>
                {detailDialogQuestion.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Nội dung:
              </Typography>
              <Typography variant="body1" mb={1}>
                {detailDialogQuestion.content}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Người hỏi: {detailDialogQuestion.customerName} | Ngày tạo:{' '}
                {Array.isArray(detailDialogQuestion.createdAt)
                  ? formatDateTimeFromArray(detailDialogQuestion.createdAt)
                  : ''}
              </Typography>
              <SimpleCategoryChip
                label={
                  detailDialogQuestion.categoryName ||
                  detailDialogQuestion.category ||
                  ''
                }
                size="small"
              />
              <Box mt={3}>
                <Typography variant="subtitle2" color="success.main">
                  Câu trả lời:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ background: '#e8f5e9', borderRadius: 2, p: 2, mt: 1 }}
                >
                  {detailDialogQuestion.answer}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDetailDialog}
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </SimpleContainer>
  );
};

export default MyQuestionsContent;

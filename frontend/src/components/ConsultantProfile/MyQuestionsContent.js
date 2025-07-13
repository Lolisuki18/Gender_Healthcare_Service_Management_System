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
  Grid,
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
        notify.success('Thành công', 'Đã trả lời câu hỏi thành công!');
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
      notify.success('Thành công', 'Đã trả lời câu hỏi thành công!');
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

  // Filter chỉ còn search và status:
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
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #fafdff 0%, #e3f2fd 100%)',
            boxShadow: '0 8px 32px rgba(33,150,243,0.10)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 800,
            fontSize: '1.5rem',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: 70,
            p: '28px 36px 18px 36px',
            boxShadow: '0 6px 24px rgba(33,150,243,0.10)',
            letterSpacing: 1,
          }}
        >
          <VisibilityIcon sx={{ fontSize: 36, mr: 2 }} />
          Chi tiết câu hỏi
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 5 }, background: 'none' }}>
          {detailDialogQuestion && (
            <Stack spacing={3}>
              {/* Thông tin chung */}
              <Card
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  boxShadow: '0 2px 12px rgba(33,150,243,0.07)',
                  mb: 1,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={2}>
                    <SimpleCategoryChip
                      label={
                        detailDialogQuestion.categoryName ||
                        detailDialogQuestion.category ||
                        ''
                      }
                      size="small"
                      sx={{ fontWeight: 700, fontSize: 13, px: 2, py: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        <strong>ID:</strong> #{detailDialogQuestion.id}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#90caf9',
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {detailDialogQuestion.customerName?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="#1976d2"
                        >
                          {detailDialogQuestion.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {detailDialogQuestion.customerEmail}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <MedicalIcon sx={{ color: '#43c6ac', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Ngày tạo:</strong>{' '}
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
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)',
                  border: '1px solid #bbdefb',
                  boxShadow: '0 1px 6px rgba(33,150,243,0.06)',
                }}
              >
                <Stack direction="row" alignItems="center" gap={1} mb={1}>
                  <QuestionIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                  <Typography
                    variant="subtitle1"
                    color="#1976d2"
                    fontWeight={700}
                  >
                    Nội dung câu hỏi
                  </Typography>
                </Stack>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ mb: 1, wordBreak: 'break-word', color: '#222' }}
                >
                  {detailDialogQuestion.content}
                </Typography>
              </Card>
              {/* Thông tin người trả lời */}
              <Card
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #e8f5e9 60%, #fff 100%)',
                  border: '1px solid #a5d6a7',
                  boxShadow: '0 1px 6px rgba(76,175,80,0.06)',
                }}
              >
                <Stack direction="row" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: '#a5d6a7',
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {detailDialogQuestion.replierName?.charAt(0) || '?'}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="success.main"
                    >
                      {detailDialogQuestion.replierName}
                    </Typography>
                    {detailDialogQuestion.replierEmail && (
                      <Typography variant="caption" color="text.secondary">
                        {detailDialogQuestion.replierEmail}
                      </Typography>
                    )}
                  </Box>
                  <CheckCircleIcon color="success" sx={{ ml: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Ngày trả lời:</strong>{' '}
                    {Array.isArray(detailDialogQuestion.updatedAt)
                      ? formatDateTimeFromArray(detailDialogQuestion.updatedAt)
                      : ''}
                  </Typography>
                </Stack>
              </Card>
              {/* Câu trả lời */}
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)',
                  border: '1px solid #a5d6a7',
                  borderRadius: 4,
                  mt: 1,
                  p: 0,
                  boxShadow: '0 1px 6px rgba(76,175,80,0.08)',
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <CheckCircleIcon color="success" />
                    <Typography
                      variant="subtitle1"
                      color="success.main"
                      fontWeight={800}
                    >
                      Câu trả lời chuyên môn
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      wordBreak: 'break-word',
                      fontSize: 17,
                      color: '#222',
                    }}
                  >
                    {detailDialogQuestion.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDetailDialog}
            sx={{ borderRadius: '12px', px: 3, fontWeight: 700 }}
          >
            ĐÓNG
          </Button>
        </DialogActions>
      </Dialog>
    </SimpleContainer>
  );
};

export default MyQuestionsContent;

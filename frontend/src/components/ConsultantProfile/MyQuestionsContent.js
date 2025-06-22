/**
 * MyQuestionsContent.js
 *
 * Mục đích: Component quản lý câu hỏi của tư vấn viên
 * - Hiển thị các câu hỏi đã đặt của tư vấn viên
 * - Tạo câu hỏi mới
 * - Xem chi tiết và trả lời câu hỏi của chính mình
 */

import React, { useState } from 'react';
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

// Basic styled components
const SimpleContainer = styled(Box)(() => ({
  background: '#ffffff',
  minHeight: '100vh',
  padding: '20px',
}));

const SimpleCard = styled(Paper)(() => ({
  backgroundColor: '#f5f5f5',
  marginBottom: '20px',
  padding: '20px',
  border: '1px solid #e0e0e0',
}));

const SimpleButton = styled(Button)(() => ({
  backgroundColor: '#2196F3',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1976D2',
  },
}));

const SimpleTextField = styled(TextField)(() => ({
  backgroundColor: '#fff',
}));

const SimplePaper = styled(Paper)(() => ({
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
}));

const SimpleStatusChip = styled(Chip)(({ status }) => ({
  fontSize: '11px',
  height: '18px',
  fontWeight: 'normal',
  ...(status === 'pending' && {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    border: '1px solid #FFEAA7',
  }),
  ...(status === 'answered' && {
    backgroundColor: '#D4EDDA',
    color: '#155724',
    border: '1px solid #C3E6CB',
  }),
}));

const SimpleCategoryChip = styled(Chip)(() => ({
  fontSize: '11px',
  height: '18px',
  fontWeight: 'normal',
  backgroundColor: '#E3F2FD',
  color: '#1976D2',
  border: '1px solid #BBDEFB',
}));

const MyQuestionsContent = () => {
  // Mock data cho câu hỏi của tư vấn viên
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'Quy trình điều trị STI mới nhất?',
      category: 'Điều trị',
      createdAt: '2025-06-10',
      status: 'answered',
      customerName: 'Nguyễn Văn An',
      customerId: 'KH001',
      answer:
        'Hiện nay, quy trình điều trị STI mới nhất bao gồm việc sử dụng kháng sinh thế hệ mới kết hợp với liệu pháp miễn dịch...',
    },
    {
      id: 2,
      title: 'Làm thế nào để tư vấn hiệu quả cho bệnh nhân lo lắng về STI?',
      category: 'Tư vấn',
      createdAt: '2025-06-05',
      status: 'pending',
      customerName: 'Trần Thị Bình',
      customerId: 'KH002',
      answer: '',
    },
    {
      id: 3,
      title: 'Nên kết hợp xét nghiệm nào cho bệnh nhân có triệu chứng X?',
      category: 'Xét nghiệm',
      createdAt: '2025-05-28',
      status: 'answered',
      customerName: 'Lê Minh Cường',
      customerId: 'KH003',
      answer:
        'Với các triệu chứng mà bạn mô tả, nên kết hợp xét nghiệm PCR và ELISA để có kết quả chính xác nhất...',
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    category: '',
    content: '',
  });

  // State management cho phần trả lời
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [answerSuccess, setAnswerSuccess] = useState(false);
  const [answerError, setAnswerError] = useState('');

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
    setNewQuestion({
      title: '',
      category: '',
      content: '',
    });
  };

  const handleOpenViewDialog = (question) => {
    setCurrentQuestion(question);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    const currentDate = new Date().toISOString().split('T')[0];
    const newQuestionItem = {
      id: newId,
      title: newQuestion.title,
      category: newQuestion.category,
      createdAt: currentDate,
      status: 'pending',
      customerName: 'Tôi (Tư vấn viên)', // Since this is consultant asking
      customerId: 'TV' + String(newId).padStart(3, '0'), // Generate consultant ID
      answer: '',
      content: newQuestion.content,
    };
    setQuestions([newQuestionItem, ...questions]);
    handleCloseAddDialog();
  };

  // Handler for answering consultant's own questions
  const handleAnswerConsultantQuestion = (question) => {
    // Convert consultant question to format suitable for answer dialog
    const formattedQuestion = {
      ...question,
      username: 'Tôi', // Since it's consultant's own question
      content: question.content || 'Không có nội dung chi tiết',
      avatar: '/images/avatars/consultant.jpg', // Default consultant avatar
    };

    setSelectedQuestion(formattedQuestion);
    setAnswerContent(question.answer || '');
    setAnswerSuccess(false);
    setAnswerError('');
    setAnswerDialogOpen(true);
  };
  const handleCloseAnswerDialog = () => {
    setAnswerDialogOpen(false);
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      setAnswerError('Vui lòng nhập nội dung câu trả lời');
      return;
    }

    setAnswerSubmitting(true);
    setAnswerError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update consultant's own questions
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === selectedQuestion.id
            ? {
                ...q,
                status: 'answered',
                answer: answerContent,
                answeredAt: new Date().toISOString(),
              }
            : q
        )
      );

      setAnswerSuccess(true);

      setTimeout(() => {
        setAnswerDialogOpen(false);
        setAnswerSuccess(false);
      }, 2000);
    } catch (error) {
      setAnswerError(
        'Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau.'
      );
    } finally {
      setAnswerSubmitting(false);
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
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <SimpleButton
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
            >
              Đặt câu hỏi mới
            </SimpleButton>
          </Stack>
        </SimplePaper>
        {/* Questions Table */}
        <SimplePaper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              {' '}
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Câu hỏi</TableCell>
                  <TableCell>Người hỏi</TableCell>
                  <TableCell>ID KH</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question, index) => (
                    <TableRow
                      key={question.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(74, 144, 226, 0.03)',
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
                        <Typography variant="body1" sx={{ maxWidth: 300 }}>
                          {question.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color="text.primary"
                          >
                            {question.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {question.customerName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            color: '#4A90E2',
                            backgroundColor: 'rgba(74, 144, 226, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            display: 'inline-block',
                          }}
                        >
                          {question.customerId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <SimpleCategoryChip
                          label={question.category}
                          size="small"
                          category={question.category}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(question.createdAt).toLocaleDateString(
                            'vi-VN'
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <SimpleStatusChip
                          label={getStatusLabel(question.status)}
                          size="small"
                          status={question.status}
                          icon={
                            question.status === 'pending' ? (
                              <PendingIcon fontSize="small" />
                            ) : (
                              <CheckCircleIcon fontSize="small" />
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenViewDialog(question)}
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
                          <Tooltip title="Trả lời câu hỏi">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleAnswerConsultantQuestion(question)
                              }
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
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}{' '}
                {filteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
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
      {/* Add Question Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
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
          <AddIcon />
          Đặt câu hỏi mới
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {' '}
          <Box component="form" sx={{ mt: 2 }}>
            <SimpleTextField
              fullWidth
              label="Tiêu đề câu hỏi"
              name="title"
              value={newQuestion.title}
              onChange={handleQuestionChange}
              margin="normal"
              placeholder="Nhập tiêu đề câu hỏi chi tiết..."
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#4A90E2' }}>Danh mục</InputLabel>
              <Select
                name="category"
                value={newQuestion.category}
                onChange={handleQuestionChange}
                label="Danh mục"
                sx={{
                  borderRadius: '12px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4A90E2',
                  },
                }}
              >
                <MenuItem value="Điều trị">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalIcon color="error" />
                    Điều trị
                  </Box>
                </MenuItem>
                <MenuItem value="Tư vấn">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PsychologyIcon color="secondary" />
                    Tư vấn
                  </Box>
                </MenuItem>
                <MenuItem value="Xét nghiệm">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiotechIcon color="primary" />
                    Xét nghiệm
                  </Box>
                </MenuItem>
                <MenuItem value="Chẩn đoán">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HospitalIcon color="warning" />
                    Chẩn đoán
                  </Box>
                </MenuItem>
                <MenuItem value="Khác">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuestionIcon color="info" />
                    Khác
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>{' '}
            <SimpleTextField
              fullWidth
              multiline
              rows={6}
              label="Nội dung câu hỏi"
              name="content"
              value={newQuestion.content}
              onChange={handleQuestionChange}
              margin="normal"
              placeholder="Mô tả chi tiết câu hỏi của bạn..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseAddDialog}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
            }}
          >
            Hủy
          </Button>{' '}
          <SimpleButton
            onClick={handleSubmitQuestion}
            disabled={
              !newQuestion.title ||
              !newQuestion.category ||
              !newQuestion.content
            }
          >
            Gửi câu hỏi
          </SimpleButton>
        </DialogActions>
      </Dialog>
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
                  <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight="bold"
                    color="primary"
                  >
                    {currentQuestion.title}
                  </Typography>{' '}
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <SimpleCategoryChip
                      label={currentQuestion.category}
                      size="small"
                      category={currentQuestion.category}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ngày tạo:{' '}
                      {new Date(currentQuestion.createdAt).toLocaleDateString(
                        'vi-VN'
                      )}
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

              {currentQuestion.status === 'answered' ? (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.1) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {currentQuestion.answer}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(255, 179, 0, 0.05) 0%, rgba(255, 179, 0, 0.1) 100%)',
                    border: '1px solid rgba(255, 179, 0, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <CardContent>
                    <Typography
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <PendingIcon />
                      Câu hỏi đang chờ được trả lời.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <SimpleButton onClick={handleCloseViewDialog}>Đóng</SimpleButton>
        </DialogActions>
      </Dialog>{' '}
      {/* Answer Dialog */}
      <Dialog
        open={answerDialogOpen}
        onClose={handleCloseAnswerDialog}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            py: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
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
            <QuestionIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {selectedQuestion?.status === 'pending'
                ? 'Trả lời câu hỏi chuyên môn'
                : 'Chi tiết câu hỏi'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Hệ thống trao đổi kiến thức y tế
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedQuestion && (
            <>
              {/* Question Card */}
              <Card
                sx={{
                  mb: 4,
                  borderRadius: '16px',
                  background:
                    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '2px solid rgba(74, 144, 226, 0.1)',
                  boxShadow: '0 4px 20px rgba(74, 144, 226, 0.08)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* User Info Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={selectedQuestion.avatar}
                      alt={selectedQuestion.username}
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 2,
                        border: '3px solid rgba(74, 144, 226, 0.2)',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', color: '#4A90E2' }}
                      >
                        {selectedQuestion.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(selectedQuestion.createdAt)}
                      </Typography>
                    </Box>
                    <Box>{renderStatusChip(selectedQuestion.status)}</Box>
                  </Box>

                  {/* Question Title */}
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold',
                      color: '#2D3748',
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedQuestion.title}
                  </Typography>

                  {/* Question Content */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      border: '1px solid rgba(74, 144, 226, 0.1)',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        color: '#4A5568',
                      }}
                    >
                      {selectedQuestion.content}
                    </Typography>
                  </Paper>

                  {/* Category Tag */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {' '}
                    <SimpleCategoryChip
                      label={selectedQuestion.category}
                      size="medium"
                      category={selectedQuestion.category}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Existing Answer Display */}
              {selectedQuestion.status === 'answered' &&
                selectedQuestion.answer && (
                  <Card
                    sx={{
                      mb: 4,
                      borderRadius: '16px',
                      background:
                        'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.15) 100%)',
                      border: '2px solid rgba(76, 175, 80, 0.3)',
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <CheckCircleIcon
                          sx={{ color: '#43A047', mr: 1, fontSize: 28 }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#43A047',
                          }}
                        >
                          Câu trả lời của bạn
                        </Typography>
                      </Box>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '12px',
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                            color: '#2D3748',
                          }}
                        >
                          {selectedQuestion.answer}
                        </Typography>
                      </Paper>

                      {selectedQuestion.answeredAt && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mt: 2,
                            fontStyle: 'italic',
                          }}
                        >
                          ✓ Trả lời lúc:{' '}
                          {formatDate(selectedQuestion.answeredAt)}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                )}

              {/* Answer Input Section */}
              {selectedQuestion.status === 'pending' && (
                <Card
                  sx={{
                    borderRadius: '16px',
                    background:
                      'linear-gradient(135deg, rgba(255, 179, 0, 0.05) 0%, rgba(255, 179, 0, 0.15) 100%)',
                    border: '2px solid rgba(255, 179, 0, 0.3)',
                    boxShadow: '0 4px 20px rgba(255, 179, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SendIcon
                        sx={{ color: '#FFB300', mr: 1, fontSize: 28 }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#FFB300',
                        }}
                      >
                        Viết câu trả lời chuyên môn
                      </Typography>
                    </Box>
                    {/* Success/Error Alerts */}
                    {answerSuccess && (
                      <Alert
                        severity="success"
                        sx={{
                          mb: 3,
                          borderRadius: '12px',
                          '& .MuiAlert-icon': { fontSize: 24 },
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          Câu trả lời của bạn đã được gửi thành công!
                        </Typography>
                      </Alert>
                    )}
                    {answerError && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          borderRadius: '12px',
                          '& .MuiAlert-icon': { fontSize: 24 },
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {answerError}
                        </Typography>
                      </Alert>
                    )}
                    {/* Answer Text Field */}{' '}
                    <SimpleTextField
                      label="Nội dung trả lời"
                      multiline
                      rows={8}
                      fullWidth
                      variant="outlined"
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      disabled={answerSubmitting}
                      placeholder="Nhập câu trả lời chuyên môn và chi tiết. Hãy cung cấp thông tin chính xác, dựa trên kiến thức y tế hiện tại..."
                      helperText={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            💡 Hãy đưa ra lời khuyên chuyên môn, có căn cứ khoa
                            học
                          </Typography>
                          <Typography
                            variant="caption"
                            color={
                              answerContent.length > 4500
                                ? 'error'
                                : 'text.secondary'
                            }
                          >
                            {answerContent.length}/5000 ký tự
                          </Typography>
                        </Box>
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '1.1rem',
                          lineHeight: 1.6,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 4,
            background: 'rgba(248, 250, 252, 0.8)',
            gap: 2,
            borderTop: '1px solid rgba(74, 144, 226, 0.1)',
          }}
        >
          <Button
            onClick={handleCloseAnswerDialog}
            disabled={answerSubmitting}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            Đóng
          </Button>{' '}
          {selectedQuestion?.status === 'pending' && (
            <SimpleButton
              onClick={handleSubmitAnswer}
              disabled={!answerContent.trim() || answerSubmitting}
              startIcon={
                answerSubmitting ? (
                  <CircularProgress size={20} sx={{ color: '#fff' }} />
                ) : (
                  <SendIcon />
                )
              }
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                minWidth: 160,
              }}
            >
              {answerSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}
            </SimpleButton>
          )}
        </DialogActions>
      </Dialog>
    </SimpleContainer>
  );
};

export default MyQuestionsContent;

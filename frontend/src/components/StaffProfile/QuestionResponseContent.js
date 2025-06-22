/**
 * QuestionResponseContent.js
 *
 * Mục đích: Hiển thị và quản lý các câu hỏi từ khách hàng
 * - Hiển thị danh sách câu hỏi
 * - Trả lời câu hỏi
 * - Đánh dấu đã giải quyết
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
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Divider,
  Tooltip,
  LinearProgress,
  Skeleton,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Refresh as RefreshIcon,
  PersonOutline as PersonOutlineIcon,
  CalendarToday as CalendarTodayIcon,
  Send as SendIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';

// Define theme colors and styles
const theme = {
  primary: '#4A90E2',
  secondary: '#1ABC9C',
  background: '#f8fafc',
  cardBackground: '#ffffff',
  text: '#334155',
  textLight: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  error: '#ef4444',
  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
  hoverShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
  gradient: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
};

const QuestionResponseContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [questions, setQuestions] = useState([
    {
      id: 1,
      customerId: 101,
      customerName: 'Trần Thị Hoa',
      question: 'Tôi muốn biết thông tin về dịch vụ xét nghiệm STI?',
      createdAt: '2025-06-01',
      status: 'pending',
    },
    {
      id: 2,
      customerId: 102,
      customerName: 'Nguyễn Văn Nam',
      question: 'Quy trình tư vấn trước xét nghiệm như thế nào?',
      createdAt: '2025-06-05',
      status: 'answered',
    },
    {
      id: 3,
      customerId: 103,
      customerName: 'Lê Thu Trang',
      question: 'Khi nào có kết quả xét nghiệm?',
      createdAt: '2025-06-10',
      status: 'pending',
    },
  ]);
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // "all", "pending", "answered", "resolved"

  // Handlers
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

  const handleOpenReplyDialog = (question) => {
    setCurrentQuestion(question);
    setResponse('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };

  const handleSubmitResponse = () => {
    // Logic gửi câu trả lời
    const updatedQuestions = questions.map((q) =>
      q.id === currentQuestion.id ? { ...q, status: 'answered' } : q
    );
    setQuestions(updatedQuestions);
    setOpenDialog(false);
  };

  const handleMarkResolved = (id) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, status: 'resolved' } : q
    );
    setQuestions(updatedQuestions);
  };
  // Thêm handler cho việc lọc theo trạng thái
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  // Handler để làm mới dữ liệu
  const handleRefresh = () => {
    setLoading(true); // Giả lập tải dữ liệu
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Filter questions dựa trên searchTerm và statusFilter
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || question.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        backgroundColor: theme.background,
      }}
    >
      {' '}
      {/* Header Section */}{' '}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          borderRadius: 2,
          position: 'relative',
          background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '30%',
            height: '100%',
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 100%)',
            zIndex: 0,
          },
        }}
      >
        {' '}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              mr: 2.5,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: 52,
              height: 52,
            }}
          >
            <HelpOutlineIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 0.75,
                letterSpacing: '0.2px',
              }}
            >
              Trả lời câu hỏi
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, opacity: 0.9, letterSpacing: '0.2px' }}
            >
              Quản lý và phản hồi các câu hỏi từ khách hàng
            </Typography>
          </Box>
        </Box>{' '}
        {loading && (
          <LinearProgress
            sx={{
              mt: 2,
              borderRadius: 1,
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.15)',
              '.MuiLinearProgress-bar': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          />
        )}
        {/* Số liệu thống kê */}{' '}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mt: 3,
          }}
        >
          {[
            {
              label: 'Tổng câu hỏi',
              value: questions.length,
              icon: <QuestionAnswerIcon />,
              color: 'rgba(255, 255, 255, 0.2)',
            },
            {
              label: 'Chờ trả lời',
              value: questions.filter((q) => q.status === 'pending').length,
              icon: <HelpOutlineIcon />,
              color: 'rgba(255, 255, 255, 0.2)',
            },
            {
              label: 'Đã trả lời',
              value: questions.filter((q) => q.status === 'answered').length,
              icon: <ReplyIcon />,
              color: 'rgba(255, 255, 255, 0.2)',
            },
            {
              label: 'Đã giải quyết',
              value: questions.filter((q) => q.status === 'resolved').length,
              icon: <CheckCircleIcon />,
              color: 'rgba(255, 255, 255, 0.2)',
            },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                minWidth: {
                  xs: '100%',
                  sm: 'calc(50% - 8px)',
                  md: 'calc(25% - 12px)',
                },
                flexGrow: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                borderRadius: 1.5,
                overflow: 'hidden',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    color: '#ffffff',
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.75rem',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      opacity: 0.95,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {' '}
        <TextField
          size="small"
          placeholder="Tìm kiếm câu hỏi hoặc khách hàng..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            flexGrow: 1,
            minWidth: '250px',
            maxWidth: '450px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
              backgroundColor: '#fff',
              transition: 'all 0.2s',
              border: '1px solid rgba(74, 144, 226, 0.08)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)',
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${theme.primary}30`,
                borderColor: theme.primary,
              },
            },
            '& .MuiInputBase-input': {
              padding: '10px 14px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.primary, ml: 0.5 }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {' '}
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: theme.primary,
              color: theme.primary,
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              fontWeight: 600,
              '&:hover': {
                borderColor: theme.primary,
                backgroundColor: `${theme.primary}10`,
              },
            }}
          >
            Làm mới
          </Button>{' '}
          {/* Bộ lọc trạng thái */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: 'Tất cả', color: theme.primary },
              { value: 'pending', label: 'Chờ trả lời', color: theme.warning },
              { value: 'answered', label: 'Đã trả lời', color: theme.info },
              {
                value: 'resolved',
                label: 'Đã giải quyết',
                color: theme.success,
              },
            ].map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                onClick={() => handleStatusFilter(item.value)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor:
                    statusFilter === item.value ? `${item.color}20` : '#fff',
                  color:
                    statusFilter === item.value ? item.color : theme.textLight,
                  border: `1px solid ${statusFilter === item.value ? item.color : '#e2e8f0'}`,
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor:
                      statusFilter === item.value
                        ? `${item.color}30`
                        : '#f8fafc',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>{' '}
      {/* Questions Table */}{' '}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
          border: '1px solid rgba(74, 144, 226, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        {loading ? (
          <Box sx={{ p: 3 }}>
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ width: '100%' }}>
                  <Skeleton width="40%" height={24} />
                  <Skeleton width="70%" height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : filteredQuestions.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Avatar
              sx={{
                mx: 'auto',
                mb: 2,
                width: 70,
                height: 70,
                bgcolor: `${theme.primary}10`,
                color: theme.primary,
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ color: theme.text, mb: 1 }}>
              Không tìm thấy câu hỏi nào
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textLight }}>
              Thử thay đổi tìm kiếm hoặc bộ lọc
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                {' '}
                <TableRow
                  sx={{
                    background:
                      'linear-gradient(to right, rgba(74, 144, 226, 0.06), rgba(26, 188, 156, 0.04))',
                    borderBottom: '2px solid rgba(74, 144, 226, 0.15)',
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: theme.text, py: 2 }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.text, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonOutlineIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.primary }}
                      />
                      Khách hàng
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.text, py: 2 }}>
                    Câu hỏi
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.text, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.primary }}
                      />
                      Ngày tạo
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.text, py: 2 }}>
                    Trạng thái
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: theme.text, py: 2 }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question) => {
                    const statusColor =
                      question.status === 'pending'
                        ? theme.warning
                        : question.status === 'answered'
                          ? theme.info
                          : theme.success;

                    return (
                      <TableRow
                        key={question.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(74, 144, 226, 0.04)',
                          },
                          borderLeft: `3px solid ${statusColor}`,
                          '&:nth-of-type(even)': {
                            backgroundColor: 'rgba(249, 250, 252, 0.7)',
                          },
                        }}
                      >
                        <TableCell sx={{ color: theme.text }}>
                          {question.id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                fontSize: '1rem',
                                bgcolor: `${theme.primary}`,
                                background: theme.gradient,
                                mr: 1.5,
                              }}
                            >
                              {question.customerName.charAt(0)}
                            </Avatar>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: theme.text }}
                            >
                              {question.customerName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={question.question} placement="top">
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: theme.text,
                              }}
                            >
                              {question.question}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.textLight }}
                          >
                            {question.createdAt}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {' '}
                          <Chip
                            label={
                              question.status === 'pending'
                                ? 'Chờ trả lời'
                                : question.status === 'answered'
                                  ? 'Đã trả lời'
                                  : 'Đã giải quyết'
                            }
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: `${statusColor}15`,
                              color: statusColor,
                              borderRadius: 2,
                              border: `1px solid ${statusColor}30`,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Trả lời">
                            <span>
                              {' '}
                              <IconButton
                                size="small"
                                disabled={question.status === 'resolved'}
                                onClick={() => handleOpenReplyDialog(question)}
                                sx={{
                                  bgcolor:
                                    question.status !== 'resolved'
                                      ? `${theme.primary}10`
                                      : 'transparent',
                                  color:
                                    question.status !== 'resolved'
                                      ? theme.primary
                                      : theme.textLight,
                                  mr: 1.5,
                                  width: 32,
                                  height: 32,
                                  border:
                                    question.status !== 'resolved'
                                      ? `1px solid ${theme.primary}30`
                                      : 'none',
                                  boxShadow:
                                    question.status !== 'resolved'
                                      ? '0 2px 8px rgba(74, 144, 226, 0.25)'
                                      : 'none',
                                  '&:hover': {
                                    bgcolor:
                                      question.status !== 'resolved'
                                        ? `${theme.primary}20`
                                        : 'transparent',
                                  },
                                }}
                              >
                                <ReplyIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Đánh dấu đã giải quyết">
                            <span>
                              {' '}
                              <IconButton
                                size="small"
                                disabled={
                                  question.status === 'pending' ||
                                  question.status === 'resolved'
                                }
                                onClick={() => handleMarkResolved(question.id)}
                                sx={{
                                  bgcolor:
                                    question.status === 'answered'
                                      ? `${theme.success}10`
                                      : 'transparent',
                                  color:
                                    question.status === 'answered'
                                      ? theme.success
                                      : theme.textLight,
                                  width: 32,
                                  height: 32,
                                  border:
                                    question.status === 'answered'
                                      ? `1px solid ${theme.success}30`
                                      : 'none',
                                  boxShadow:
                                    question.status === 'answered'
                                      ? '0 2px 8px rgba(16, 185, 129, 0.25)'
                                      : 'none',
                                  '&:hover': {
                                    bgcolor:
                                      question.status === 'answered'
                                        ? `${theme.success}20`
                                        : 'transparent',
                                  },
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredQuestions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: theme.text,
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                  {
                    margin: 0,
                    color: theme.textLight,
                  },
                '.MuiTablePagination-select': {
                  color: theme.text,
                },
                '.MuiTablePagination-actions': {
                  color: theme.primary,
                },
              }}
            />
          </TableContainer>
        )}
      </Paper>
      {/* Reply Dialog */}{' '}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(74, 144, 226, 0.25)',
            overflow: 'hidden',
            border: '1px solid rgba(74, 144, 226, 0.1)',
          },
        }}
      >
        {' '}
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            py: 2.5,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '30%',
              height: '100%',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 100%)',
              zIndex: 0,
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              mr: 2,
              width: 46,
              height: 46,
              zIndex: 1,
            }}
          >
            <ReplyIcon />
          </Avatar>
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 600, letterSpacing: '0.2px', zIndex: 1 }}
          >
            Trả lời câu hỏi
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: { xs: 2, md: 3 } }}>
          {currentQuestion && (
            <Box>
              {' '}
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: 2,
                  borderColor: 'rgba(74, 144, 226, 0.15)',
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      background: theme.gradient,
                    }}
                  >
                    {currentQuestion.customerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: theme.text }}
                    >
                      {currentQuestion.customerName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: theme.textLight,
                      }}
                    >
                      <CalendarTodayIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                      Ngày hỏi: {currentQuestion.createdAt}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    color: theme.text,
                    p: 2,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.primary}`,
                    fontStyle: 'italic',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  {currentQuestion.question}
                </Typography>
              </Paper>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1, color: theme.text }}
              >
                Câu trả lời của bạn:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Nhập nội dung trả lời chi tiết và hữu ích cho khách hàng..."
                margin="normal"
                value={response}
                onChange={handleResponseChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.primary}40`,
                    },
                  },
                }}
                InputProps={{
                  sx: { p: 2 },
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      color: theme.info,
                      opacity: 0.9,
                    },
                  }}
                >
                  <Typography variant="body2">
                    Câu trả lời của bạn sẽ được gửi trực tiếp đến khách hàng.
                    Hãy đảm bảo thông tin chuyên môn, cung cấp sự hỗ trợ cần
                    thiết và thân thiện.
                  </Typography>
                </Alert>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #e2e8f0' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              borderColor: '#e2e8f0',
              color: theme.textLight,
              '&:hover': {
                borderColor: theme.textLight,
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Hủy
          </Button>{' '}
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={!response || !response.trim()}
            startIcon={<SendIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
              fontWeight: 600,
              '&:hover': {
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
              },
              '&.Mui-disabled': {
                background: '#e2e8f0',
              },
            }}
          >
            Gửi trả lời
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionResponseContent;

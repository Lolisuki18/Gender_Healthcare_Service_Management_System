/**
 * QuestionResponseContent.js
 *
 * Mục đích: Hiển thị và quản lý các câu hỏi từ khách hàng
 * - Hiển thị danh sách câu hỏi
 * - Trả lời câu hỏi
 * - Đánh dấu đã giải quyết
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
  Stack,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Close as CloseIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import questionService from '../../services/questionService';
import consultantService from '../../services/consultantService';
import { formatDateTimeFromArray } from '../../utils/dateUtils';
import { confirmDialog } from '../../utils/confirmDialog';

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
  const [questions, setQuestions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailQuestion, setDetailQuestion] = useState(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [replierId, setReplierId] = useState(''); // luôn là string
  const [consultants, setConsultants] = useState([]);
  const [approveError, setApproveError] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Lấy danh sách câu hỏi từ backend (gộp nhiều trạng thái)
  const fetchQuestions = async (
    status = filterStatus,
    pageNum = page,
    size = rowsPerPage
  ) => {
    setLoading(true);
    setError('');
    try {
      let allQuestions = [];
      let total = 0;
      if (status === 'ALL') {
        const statuses = ['PROCESSING', 'CONFIRMED', 'ANSWERED', 'CANCELED'];
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
      } else {
        const res = await questionService.getQuestionsByStatus(status, {
          page: pageNum,
          size,
          sort: 'createdAt',
          direction: 'DESC',
        });
        allQuestions = res.data.data.content || [];
        total = res.data.data.totalElements || 0;
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

  // useEffect đầu trang: luôn fetch consultants khi vào trang
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await consultantService.getAllConsultants();
        setConsultants(res.data || res || []);
      } catch (err) {
        setConsultants([]);
      }
    };
    fetchConsultants();
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, [page, rowsPerPage, filterStatus]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchQuestions();
  };

  // Duyệt hoặc từ chối câu hỏi
  const handleApprove = async (questionId) => {
    const result = await confirmDialog.success(
      'Bạn có chắc chắn muốn duyệt câu hỏi này?'
    );
    if (!result) return;
    setLoading(true);
    try {
      await questionService.updateQuestionStatus(questionId, {
        status: 'CONFIRMED',
      });
      fetchQuestions();
    } catch (err) {
      setError('Duyệt câu hỏi thất bại.');
    } finally {
      setLoading(false);
    }
  };
  const handleOpenRejectDialog = async (questionId) => {
    const result = await confirmDialog.cancel(
      'Bạn có chắc chắn muốn từ chối câu hỏi này?'
    );
    if (!result) return;
    setRejectingId(questionId);
    setRejectReason('');
    setRejectError('');
    setOpenRejectDialog(true);
  };
  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectingId(null);
    setRejectReason('');
    setRejectError('');
  };
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setRejectError('Vui lòng nhập lý do từ chối.');
      return;
    }
    setLoading(true);
    try {
      await questionService.updateQuestionStatus(rejectingId, {
        status: 'CANCELED',
        rejectionReason: rejectReason,
      });
      handleCloseRejectDialog();
      fetchQuestions();
    } catch (err) {
      setRejectError('Từ chối câu hỏi thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách consultant khi mở dialog duyệt
  const handleOpenApproveDialog = async (questionId) => {
    setApprovingId(questionId);
    setApproveError('');
    setReplierId(''); // reset về chuỗi rỗng
    setOpenApproveDialog(true);
    try {
      const res = await consultantService.getAllConsultants();
      setConsultants(res.data || res || []);
    } catch (err) {
      setConsultants([]);
    }
  };
  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setApprovingId(null);
    setReplierId('');
    setApproveError('');
  };
  const handleConfirmApprove = async () => {
    if (!replierId) {
      setApproveError('Vui lòng chọn người trả lời');
      return;
    }
    setLoading(true);
    try {
      console.log('Gửi replierId:', replierId, typeof replierId);
      await questionService.updateQuestionStatus(approvingId, {
        status: 'CONFIRMED',
        replierId: Number(replierId), // ép về số khi gửi backend
      });
      handleCloseApproveDialog();
      fetchQuestions();
    } catch (err) {
      setApproveError('Duyệt câu hỏi thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Filter questions theo searchTerm (áp dụng trên FE)
  const filteredQuestions = questions.filter((question) => {
    const matchStatus =
      filterStatus === 'ALL' ? true : question.status === filterStatus;
    const matchesSearch =
      (question.customerName &&
        question.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (question.content &&
        question.content.toLowerCase().includes(searchTerm.toLowerCase()));
    let matchDate = true;
    if (dateFilter) {
      // question.createdAt là mảng [YYYY, MM, DD, ...]
      if (Array.isArray(question.createdAt) && question.createdAt.length >= 3) {
        const qDate = new Date(
          question.createdAt[0],
          question.createdAt[1] - 1,
          question.createdAt[2]
        );
        const filterDate = new Date(dateFilter);
        matchDate = qDate >= filterDate;
      } else {
        matchDate = true;
      }
    }
    return matchStatus && matchesSearch && matchDate;
  });

  const handleOpenDetailDialog = (question) => {
    setDetailQuestion(question);
    setOpenDetailDialog(true);
  };
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setDetailQuestion(null);
  };

  // Tạo map userId -> fullName
  const consultantMap = React.useMemo(() => {
    const map = {};
    consultants.forEach((c) => {
      map[c.userId] = c.fullName;
    });
    return map;
  }, [consultants]);

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
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 3,
          position: 'relative',
          background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
          color: '#fff',
          boxShadow: '0 4px 24px 0 rgba(74, 144, 226, 0.10)',
          overflow: 'hidden',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#fff',
            color: theme.primary,
            width: 64,
            height: 64,
            fontSize: 36,
            boxShadow: '0 2px 8px #1abc9c22',
            mr: 3,
          }}
        >
          <HelpOutlineIcon fontSize="inherit" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1} letterSpacing={0.5}>
            Trả lời câu hỏi
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.92, fontWeight: 400 }}>
            Quản lý và phản hồi các câu hỏi từ khách hàng
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        {/* Stats */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700}>
              {totalElements}
            </Typography>
            <Typography variant="caption" color="#e0f2f1">
              Tổng câu hỏi
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700}>
              {questions.filter((q) => q.status === 'PROCESSING').length}
            </Typography>
            <Typography variant="caption" color="#ffe082">
              Chờ duyệt
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700}>
              {questions.filter((q) => q.status === 'ANSWERED').length}
            </Typography>
            <Typography variant="caption" color="#b9f6ca">
              Đã trả lời
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700}>
              {questions.filter((q) => q.status === 'CANCELED').length}
            </Typography>
            <Typography variant="caption" color="#ff8a80">
              Đã huỷ
            </Typography>
          </Box>
        </Stack>
      </Paper>
      {/* Filter & Search */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm câu hỏi hoặc khách hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{
            minWidth: 260,
            maxWidth: 400,
            borderRadius: 2,
            background: '#fff',
            boxShadow: '0 2px 8px #4A90E215',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.primary, ml: 0.5 }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(0);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: 160,
            background: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 8px #4A90E215',
          }}
        />
        <FormControl
          size="small"
          sx={{
            minWidth: 180,
            borderRadius: 2,
            background: '#fff',
            boxShadow: '0 2px 8px #4A90E215',
          }}
        >
          <InputLabel id="status-filter-label">Lọc trạng thái</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filterStatus}
            label="Lọc trạng thái"
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="PROCESSING">Chờ duyệt</MenuItem>
            <MenuItem value="CONFIRMED">Đã duyệt</MenuItem>
            <MenuItem value="ANSWERED">Đã trả lời</MenuItem>
            <MenuItem value="CANCELED">Đã huỷ</MenuItem>
          </Select>
        </FormControl>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
          sx={{
            borderRadius: 2,
            color: theme.primary,
            fontWeight: 600,
            ml: 'auto',
            background: '#fff',
            boxShadow: '0 2px 8px #4A90E215',
            '&:hover': { background: '#e3f2fd' },
          }}
        >
          Làm mới
        </Button>
      </Box>
      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 24px 0 rgba(74, 144, 226, 0.08)',
          border: '1px solid #e3f2fd',
          background: '#fff',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    'linear-gradient(90deg, #e3f2fd 0%, #b2dfdb 100%)',
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: theme.text, py: 2 }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.text, py: 2 }}>
                  <PersonOutlineIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.primary }}
                  />
                  Khách hàng
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.text, py: 2 }}>
                  Câu hỏi
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.text, py: 2 }}>
                  <CalendarTodayIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.primary }}
                  />
                  Ngày tạo
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.text, py: 2 }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.text, py: 2 }}>
                  Người trả lời
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, color: theme.text, py: 2 }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Avatar
                      sx={{
                        mx: 'auto',
                        mb: 2,
                        width: 70,
                        height: 70,
                        bgcolor: '#e3f2fd',
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
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question) => {
                    const statusColor =
                      question.status === 'PROCESSING'
                        ? theme.warning
                        : question.status === 'ANSWERED'
                          ? theme.success
                          : question.status === 'CANCELED'
                            ? theme.error
                            : question.status === 'CONFIRMED'
                              ? theme.info
                              : theme.textLight;
                    return (
                      <React.Fragment key={question.id}>
                        <TableRow
                          hover
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                            borderLeft: `4px solid ${statusColor}`,
                          }}
                        >
                          <TableCell
                            sx={{ color: theme.text, fontWeight: 600 }}
                          >
                            #{question.id}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  fontSize: '1rem',
                                  bgcolor: theme.primary,
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
                            <Tooltip title={question.content} placement="top">
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 400,
                                  overflowWrap: 'break-word',
                                  color: theme.text,
                                }}
                              >
                                {question.content}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.textLight }}
                            >
                              {formatDateTimeFromArray(question.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                question.status === 'PROCESSING'
                                  ? 'Chờ duyệt'
                                  : question.status === 'CONFIRMED'
                                    ? 'Đã duyệt'
                                    : question.status === 'ANSWERED'
                                      ? 'Đã trả lời'
                                      : question.status === 'CANCELED'
                                        ? 'Đã huỷ'
                                        : question.status
                              }
                              size="small"
                              icon={
                                question.status === 'PROCESSING' ? (
                                  <HourglassEmptyIcon
                                    sx={{ color: theme.warning }}
                                  />
                                ) : question.status === 'CONFIRMED' ? (
                                  <CheckCircleIcon sx={{ color: theme.info }} />
                                ) : question.status === 'ANSWERED' ? (
                                  <ReplyIcon sx={{ color: theme.success }} />
                                ) : question.status === 'CANCELED' ? (
                                  <CloseIcon sx={{ color: theme.error }} />
                                ) : null
                              }
                              sx={{
                                fontWeight: 600,
                                backgroundColor:
                                  question.status === 'PROCESSING'
                                    ? `${theme.warning}15`
                                    : question.status === 'CONFIRMED'
                                      ? `${theme.info}15`
                                      : question.status === 'ANSWERED'
                                        ? `${theme.success}15`
                                        : question.status === 'CANCELED'
                                          ? `${theme.error}15`
                                          : '#e2e8f0',
                                color:
                                  question.status === 'PROCESSING'
                                    ? theme.warning
                                    : question.status === 'CONFIRMED'
                                      ? theme.info
                                      : question.status === 'ANSWERED'
                                        ? theme.success
                                        : question.status === 'CANCELED'
                                          ? theme.error
                                          : theme.textLight,
                                borderRadius: 2,
                                border: `1px solid ${
                                  question.status === 'PROCESSING'
                                    ? theme.warning
                                    : question.status === 'CONFIRMED'
                                      ? theme.info
                                      : question.status === 'ANSWERED'
                                        ? theme.success
                                        : question.status === 'CANCELED'
                                          ? theme.error
                                          : '#e2e8f0'
                                }30`,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                minWidth: 110,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {(question.status === 'CONFIRMED' ||
                              question.status === 'ANSWERED') &&
                            question.replierId ? (
                              <Chip
                                label={
                                  consultantMap[question.replierId] ||
                                  `ID: ${question.replierId}`
                                }
                                size="small"
                                color="info"
                                sx={{ fontWeight: 600, borderRadius: 2 }}
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: theme.textLight }}
                              >
                                {question.status === 'CONFIRMED' ||
                                question.status === 'ANSWERED'
                                  ? 'Chưa gán'
                                  : ''}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                            >
                              {question.status === 'PROCESSING' && (
                                <>
                                  <Tooltip title="Duyệt câu hỏi">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenApproveDialog(question.id)
                                      }
                                      sx={{
                                        color: '#10b981',
                                        bgcolor: '#e0f2f1',
                                        borderRadius: '50%',
                                        '&:hover': { bgcolor: '#b2dfdb' },
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Từ chối câu hỏi">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenRejectDialog(question.id)
                                      }
                                      sx={{
                                        color: '#ef4444',
                                        bgcolor: '#ffebee',
                                        borderRadius: '50%',
                                        '&:hover': { bgcolor: '#ffcdd2' },
                                      }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              {question.status === 'CONFIRMED' && (
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenDetailDialog(question)
                                    }
                                    sx={{
                                      color: theme.info,
                                      bgcolor: '#e3f2fd',
                                      borderRadius: '50%',
                                      '&:hover': { bgcolor: '#b2ebf2' },
                                    }}
                                  >
                                    <HelpOutlineIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {question.status === 'ANSWERED' && (
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenDetailDialog(question)
                                    }
                                    sx={{
                                      color: theme.success,
                                      bgcolor: '#e8f5e9',
                                      borderRadius: '50%',
                                      '&:hover': { bgcolor: '#b9f6ca' },
                                    }}
                                  >
                                    <ReplyIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {question.status === 'CANCELED' && (
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenDetailDialog(question)
                                    }
                                    sx={{
                                      color: theme.error,
                                      bgcolor: '#ffebee',
                                      borderRadius: '50%',
                                      '&:hover': { bgcolor: '#ffcdd2' },
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
              )}
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
              '.MuiTablePagination-select': { color: theme.text },
              '.MuiTablePagination-actions': { color: theme.primary },
            }}
          />
        </TableContainer>
      </Paper>
      {/* Dialog chi tiết */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px #4A90E230',
            border: '1px solid #e3f2fd',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #4A90E2 0%, #1ABC9C 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 0.5,
            py: 2,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          Chi tiết câu hỏi
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: { xs: 2, md: 3 } }}>
          {detailQuestion && (
            <Box>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  borderColor: '#e3f2fd',
                  boxShadow: '0 2px 8px #4A90E215',
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
                    {detailQuestion.customerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: theme.text }}
                    >
                      {detailQuestion.customerName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.textLight }}
                    >
                      <CalendarTodayIcon fontSize="inherit" sx={{ mr: 0.5 }} />{' '}
                      Ngày hỏi:{' '}
                      {formatDateTimeFromArray(detailQuestion.createdAt)}
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
                    boxShadow: '0 2px 8px #0001',
                    overflowWrap: 'break-word',
                  }}
                >
                  {detailQuestion.content}
                </Typography>
                {/* Hiển thị lý do huỷ nếu có */}
                {detailQuestion.status === 'CANCELED' &&
                  detailQuestion.rejectionReason && (
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        background: '#ffebee',
                        color: theme.error,
                        p: 2,
                        borderRadius: 2,
                        fontWeight: 500,
                        fontStyle: 'italic',
                        gap: 1,
                      }}
                    >
                      <CloseIcon sx={{ color: theme.error }} />
                      Lý do huỷ: {detailQuestion.rejectionReason}
                    </Box>
                  )}
              </Paper>
              {detailQuestion.answer && (
                <Box mt={2}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    mb={1}
                    color={theme.success}
                  >
                    Câu trả lời:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      background: '#e0f7fa',
                      p: 2,
                      borderRadius: 2,
                      overflowWrap: 'break-word',
                    }}
                  >
                    {detailQuestion.answer}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 8px 40px 0 rgba(239,68,68,0.15)',
            border: '1.5px solid #fecaca',
            background: 'linear-gradient(135deg, #fff 80%, #fff1f2 100%)',
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 700,
            fontSize: 22,
            color: '#ef4444',
            background: 'linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            pb: 2,
            pt: 3,
          }}
        >
          <CloseIcon sx={{ color: '#ef4444', fontSize: 28 }} />
          Lý do từ chối câu hỏi
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <TextField
            label="Nhập lý do từ chối"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            multiline
            rows={4}
            autoFocus
            error={!!rejectError}
            helperText={rejectError}
            sx={{
              mt: 2,
              background: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: '#fecaca' },
                '&:hover fieldset': { borderColor: '#ef4444' },
                '&.Mui-focused fieldset': {
                  borderColor: '#ef4444',
                  borderWidth: 2,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 2 }}>
          <Button
            onClick={handleCloseRejectDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              color: '#ef4444',
              borderColor: '#fecaca',
              fontWeight: 600,
              px: 3,
              '&:hover': { background: '#fff1f2', borderColor: '#ef4444' },
            }}
          >
            HỦY
          </Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ef4444 60%, #f87171 100%)',
              color: '#fff',
              fontWeight: 700,
              px: 4,
              boxShadow: '0 2px 8px #ef444422',
              '&:hover': { background: '#dc2626' },
            }}
          >
            TỪ CHỐI
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog chọn người trả lời khi duyệt */}
      <Dialog
        open={openApproveDialog}
        onClose={handleCloseApproveDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 0 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 20, pb: 1 }}>
          Chọn người trả lời
        </DialogTitle>
        <DialogContent sx={{ pt: 1, px: 3 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="replier-select-label">Người trả lời</InputLabel>
            <Select
              labelId="replier-select-label"
              value={String(replierId)}
              label="Người trả lời"
              onChange={(e) => {
                console.log('Chọn replierId:', e.target.value);
                setReplierId(e.target.value);
              }}
            >
              {consultants.map((c) => (
                <MenuItem key={c.userId} value={String(c.userId)}>
                  {c.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {approveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {approveError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 2 }}>
          <Button onClick={handleCloseApproveDialog} variant="outlined">
            HỦY
          </Button>
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            sx={{ fontWeight: 700 }}
          >
            DUYỆT
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionResponseContent;

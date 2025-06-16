/**
 * AnswerQuestionsContent.js - Component để chuyên gia trả lời câu hỏi từ người dùng
 *
 * Features:
 * - Hiển thị danh sách câu hỏi cần trả lời
 * - Cho phép lọc theo trạng thái
 * - Giao diện trả lời chi tiết
 * - Thông báo khi trả lời thành công
 */

import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  QuestionAnswer as QuestionIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 500,
  ...(status === "pending" && {
    backgroundColor: "rgba(255, 193, 7, 0.12)",
    color: "#FFB300",
  }),
  ...(status === "answered" && {
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    color: "#43A047",
  }),
  ...(status === "closed" && {
    backgroundColor: "rgba(96, 125, 139, 0.12)",
    color: "#546E7A",
  }),
}));

const AnswerQuestionsContent = () => {
  // State variables
  const [questions, setQuestions] = useState([
    {
      id: 1,
      username: "user123",
      title: "Các biện pháp phòng ngừa STI hiệu quả?",
      content:
        "Tôi muốn biết các biện pháp phòng ngừa STI hiệu quả nhất hiện nay, đặc biệt là trong quan hệ tình dục không bảo vệ. Có phương pháp nào ngoài sử dụng bao cao su không?",
      category: "Phòng ngừa",
      status: "pending",
      createdAt: "2023-10-15T08:30:00",
      avatar: "/images/avatars/avatar1.jpg",
    },
    {
      id: 2,
      username: "healthseeker22",
      title: "Triệu chứng của bệnh Chlamydia",
      content:
        "Tôi đang lo lắng về việc mình có thể đã bị nhiễm Chlamydia. Các triệu chứng nào cần chú ý? Liệu có thể không có triệu chứng gì không? Và cần xét nghiệm như thế nào để biết chắc chắn?",
      category: "Triệu chứng",
      status: "pending",
      createdAt: "2023-10-16T14:20:00",
      avatar: "/images/avatars/avatar2.jpg",
    },
    {
      id: 3,
      username: "anonymous_user",
      title: "Tần suất xét nghiệm STI khuyến nghị",
      content:
        "Tôi nên đi xét nghiệm STI bao lâu một lần nếu tôi có quan hệ tình dục không ổn định? Có xét nghiệm tổng quát nào kiểm tra được tất cả các loại STI phổ biến không?",
      category: "Xét nghiệm",
      status: "pending",
      createdAt: "2023-10-17T09:45:00",
      avatar: "/images/avatars/avatar3.jpg",
    },
    {
      id: 4,
      username: "concerned25",
      title: "HPV và nguy cơ ung thư",
      content:
        "Tôi được chẩn đoán dương tính với HPV. Điều này có nghĩa gì? Liệu tôi có nguy cơ ung thư cao không? Tôi nên theo dõi và kiểm tra thêm những gì?",
      category: "Điều trị",
      status: "pending",
      createdAt: "2023-10-18T11:10:00",
      avatar: "/images/avatars/avatar4.jpg",
    },
    {
      id: 5,
      username: "health_conscious",
      title: "Tác dụng phụ của thuốc điều trị Sùi Mào Gà",
      content:
        "Tôi đang điều trị Sùi Mào Gà và gặp một số tác dụng phụ. Liệu các tác dụng phụ này có bình thường không và kéo dài bao lâu? Tôi có cần dừng thuốc không?",
      category: "Điều trị",
      status: "pending",
      createdAt: "2023-10-19T16:05:00",
      avatar: "/images/avatars/avatar5.jpg",
    },
  ]);

  // Dialog state
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [answerSuccess, setAnswerSuccess] = useState(false);
  const [answerError, setAnswerError] = useState("");

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Fetch questions on component mount - will be replaced with API call
  // React.useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const data = await questionService.getQuestionsForConsultant();
  //       setQuestions(data);
  //     } catch (error) {
  //       console.error("Error fetching questions:", error);
  //     }
  //   };
  //   fetchQuestions();
  // }, []);

  // Filter questions based on status and search query
  const filteredQuestions = questions.filter((question) => {
    const matchesStatus =
      statusFilter === "all" || question.status === statusFilter;
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle open answer dialog
  const handleOpenAnswerDialog = (question) => {
    setSelectedQuestion(question);
    setAnswerContent("");
    setAnswerSuccess(false);
    setAnswerError("");
    setAnswerDialogOpen(true);
  };

  // Handle close answer dialog
  const handleCloseAnswerDialog = () => {
    setAnswerDialogOpen(false);
  };

  // Handle submit answer
  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      setAnswerError("Vui lòng nhập nội dung câu trả lời");
      return;
    }

    setAnswerSubmitting(true);
    setAnswerError("");

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update question status in local state
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === selectedQuestion.id
            ? {
                ...q,
                status: "answered",
                answer: answerContent,
                answeredAt: new Date().toISOString(),
              }
            : q
        )
      );

      // Show success message
      setAnswerSuccess(true);

      // Clear form after success
      setTimeout(() => {
        setAnswerDialogOpen(false);
        setAnswerSuccess(false);
      }, 2000);

      // API call would be uncommented when back-end is ready
      /*
      await questionService.answerQuestion(selectedQuestion.id, {
        content: answerContent
      });
      */
    } catch (error) {
      console.error("Error submitting answer:", error);
      setAnswerError(
        "Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại sau."
      );
    } finally {
      setAnswerSubmitting(false);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setStatusFilter(
      newValue === 0 ? "pending" : newValue === 1 ? "answered" : "all"
    );
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return (
          <StatusChip
            label="Chờ trả lời"
            size="small"
            status={status}
            icon={<PendingIcon fontSize="small" />}
          />
        );
      case "answered":
        return (
          <StatusChip
            label="Đã trả lời"
            size="small"
            status={status}
            icon={<CheckCircleIcon fontSize="small" />}
          />
        );
      case "closed":
        return (
          <StatusChip
            label="Đã đóng"
            size="small"
            status={status}
            icon={<CloseIcon fontSize="small" />}
          />
        );
      default:
        return <StatusChip label="Không xác định" size="small" />;
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Trả lời câu hỏi
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Danh sách câu hỏi từ người dùng đang chờ được trả lời
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab
            label={`Chờ trả lời (${
              questions.filter((q) => q.status === "pending").length
            })`}
            icon={<PendingIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Đã trả lời (${
              questions.filter((q) => q.status === "answered").length
            })`}
            icon={<CheckCircleIcon />}
            iconPosition="start"
          />
          <Tab
            label="Tất cả câu hỏi"
            icon={<QuestionIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Box sx={{ display: "flex", mb: 3, gap: 2 }}>
        <TextField
          placeholder="Tìm kiếm câu hỏi..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Trạng thái"
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>
            <MenuItem value="pending">Chờ trả lời</MenuItem>
            <MenuItem value="answered">Đã trả lời</MenuItem>
            <MenuItem value="closed">Đã đóng</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <StyledPaper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người hỏi</TableCell>
                <TableCell>Tiêu đề/Nội dung</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuestions.length > 0 ? (
                filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question) => (
                    <TableRow key={question.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={question.avatar}
                            alt={question.username}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                          {question.username}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {question.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {question.content}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.category}
                          size="small"
                          color="info"
                        />
                      </TableCell>
                      <TableCell>{renderStatusChip(question.status)}</TableCell>
                      <TableCell>{formatDate(question.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={
                            question.status === "pending" ? "primary" : "info"
                          }
                          startIcon={
                            question.status === "pending" ? (
                              <SendIcon />
                            ) : (
                              <VisibilityIcon />
                            )
                          }
                          size="small"
                          onClick={() => handleOpenAnswerDialog(question)}
                        >
                          {question.status === "pending" ? "Trả lời" : "Xem"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Không tìm thấy câu hỏi nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredQuestions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}`
          }
        />
      </StyledPaper>

      {/* Answer Dialog */}
      <Dialog
        open={answerDialogOpen}
        onClose={handleCloseAnswerDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <QuestionIcon color="primary" />
          {selectedQuestion?.status === "pending"
            ? "Trả lời câu hỏi"
            : "Chi tiết câu hỏi"}
        </DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <>
              <Card
                variant="outlined"
                sx={{ mb: 3, bgcolor: "background.default" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={selectedQuestion.avatar}
                      alt={selectedQuestion.username}
                      sx={{ width: 40, height: 40, mr: 1.5 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "medium" }}
                      >
                        {selectedQuestion.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(selectedQuestion.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: "auto" }}>
                      {renderStatusChip(selectedQuestion.status)}
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {selectedQuestion.title}
                  </Typography>

                  <Typography variant="body1" paragraph>
                    {selectedQuestion.content}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={selectedQuestion.category}
                      size="small"
                      color="info"
                    />
                  </Box>
                </CardContent>
              </Card>

              {selectedQuestion.status === "answered" &&
                selectedQuestion.answer && (
                  <Card
                    variant="outlined"
                    sx={{ mb: 3, bgcolor: "rgba(76, 175, 80, 0.04)" }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "medium",
                          mb: 1,
                          color: "primary.main",
                        }}
                      >
                        Câu trả lời của bạn:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuestion.answer}
                      </Typography>
                      {selectedQuestion.answeredAt && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 2 }}
                        >
                          Trả lời lúc: {formatDate(selectedQuestion.answeredAt)}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                )}

              {selectedQuestion.status === "pending" && (
                <>
                  {answerSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Câu trả lời của bạn đã được gửi thành công!
                    </Alert>
                  )}

                  {answerError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {answerError}
                    </Alert>
                  )}

                  <TextField
                    label="Nội dung trả lời"
                    multiline
                    rows={6}
                    fullWidth
                    variant="outlined"
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    disabled={answerSubmitting}
                    placeholder="Nhập câu trả lời chuyên môn và chi tiết..."
                    helperText={`${answerContent.length}/5000 ký tự`}
                  />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAnswerDialog} disabled={answerSubmitting}>
            Đóng
          </Button>
          {selectedQuestion?.status === "pending" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAnswer}
              disabled={!answerContent.trim() || answerSubmitting}
              startIcon={
                answerSubmitting ? <CircularProgress size={20} /> : <SendIcon />
              }
            >
              {answerSubmitting ? "Đang gửi..." : "Gửi trả lời"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnswerQuestionsContent;

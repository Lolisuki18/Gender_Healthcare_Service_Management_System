/**
 * MyQuestionsContent.js
 *
 * Mục đích: Hiển thị câu hỏi của tư vấn viên
 * - Hiển thị các câu hỏi đã đặt
 * - Xem trạng thái và câu trả lời
 * - Tạo câu hỏi mới
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
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  QuestionAnswer as QuestionIcon,
} from "@mui/icons-material";

const MyQuestionsContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "Quy trình điều trị STI mới nhất?",
      category: "Điều trị",
      createdAt: "2025-06-10",
      status: "answered",
      answer:
        "Hiện nay, quy trình điều trị STI mới nhất bao gồm việc sử dụng kháng sinh thế hệ mới kết hợp với liệu pháp miễn dịch...",
    },
    {
      id: 2,
      title: "Làm thế nào để tư vấn hiệu quả cho bệnh nhân lo lắng về STI?",
      category: "Tư vấn",
      createdAt: "2025-06-05",
      status: "pending",
      answer: "",
    },
    {
      id: 3,
      title: "Nên kết hợp xét nghiệm nào cho bệnh nhân có triệu chứng X?",
      category: "Xét nghiệm",
      createdAt: "2025-05-28",
      status: "answered",
      answer:
        "Với các triệu chứng mà bạn mô tả, nên kết hợp xét nghiệm PCR và ELISA để có kết quả chính xác nhất...",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    category: "",
    content: "",
  });

  // State cho API calls - comment lại cho đến khi có API
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

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

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewQuestion({
      title: "",
      category: "",
      content: "",
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
    // Mock submit - sẽ được thay thế bằng API call
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    const currentDate = new Date().toISOString().split("T")[0];

    const newQuestionItem = {
      id: newId,
      title: newQuestion.title,
      category: newQuestion.category,
      createdAt: currentDate,
      status: "pending",
      answer: "",
      content: newQuestion.content,
    };

    setQuestions([newQuestionItem, ...questions]);
    handleCloseAddDialog();

    // Khi có API, uncomment đoạn code sau:
    // const submitQuestion = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await consultantService.createQuestion(newQuestion);
    //     setQuestions([response.data, ...questions]);
    //     setError(null);
    //     handleCloseAddDialog();
    //   } catch (err) {
    //     setError("Không thể gửi câu hỏi: " + err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // submitQuestion();
  };

  // Filter questions dựa trên searchTerm
  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy màu chip dựa trên trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "success";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Lấy nhãn trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case "answered":
        return "Đã trả lời";
      case "pending":
        return "Chờ trả lời";
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Câu hỏi của tôi
      </Typography>

      {/* Khi có API, uncomment đoạn code sau */}
      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )} */}

      {/* Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: "40%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Đặt câu hỏi mới
        </Button>
      </Box>

      {/* Questions Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Câu hỏi</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.id}</TableCell>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>{question.category}</TableCell>
                  <TableCell>{question.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(question.status)}
                      color={getStatusColor(question.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenViewDialog(question)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredQuestions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    Không tìm thấy câu hỏi nào
                  </Typography>
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
        />
      </TableContainer>

      {/* Add Question Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Đặt câu hỏi mới</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tiêu đề câu hỏi"
              name="title"
              value={newQuestion.title}
              onChange={handleQuestionChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="category"
                value={newQuestion.category}
                onChange={handleQuestionChange}
                label="Danh mục"
              >
                <MenuItem value="Điều trị">Điều trị</MenuItem>
                <MenuItem value="Tư vấn">Tư vấn</MenuItem>
                <MenuItem value="Xét nghiệm">Xét nghiệm</MenuItem>
                <MenuItem value="Chẩn đoán">Chẩn đoán</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Nội dung câu hỏi"
              name="content"
              value={newQuestion.content}
              onChange={handleQuestionChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmitQuestion}
            disabled={
              !newQuestion.title ||
              !newQuestion.category ||
              !newQuestion.content
            }
          >
            Gửi câu hỏi
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Question Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết câu hỏi</DialogTitle>
        <DialogContent>
          {currentQuestion && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.title}
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Danh mục: {currentQuestion.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo: {currentQuestion.createdAt}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 3 }}>
                {currentQuestion.content || "Không có nội dung chi tiết"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Trả lời:
              </Typography>

              {currentQuestion.status === "answered" ? (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "background.default" }}
                >
                  <Typography>{currentQuestion.answer}</Typography>
                </Paper>
              ) : (
                <Typography color="text.secondary">
                  Câu hỏi đang chờ được trả lời.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyQuestionsContent;

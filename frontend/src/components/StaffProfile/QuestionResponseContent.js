/**
 * QuestionResponseContent.js
 *
 * Mục đích: Hiển thị và quản lý các câu hỏi từ khách hàng
 * - Hiển thị danh sách câu hỏi
 * - Trả lời câu hỏi
 * - Đánh dấu đã giải quyết
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
} from "@mui/material";
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const QuestionResponseContent = () => {
  // Mock data - sẽ được thay thế bằng API calls
  const [questions, setQuestions] = useState([
    {
      id: 1,
      customerId: 101,
      customerName: "Trần Thị Hoa",
      question: "Tôi muốn biết thông tin về dịch vụ xét nghiệm STI?",
      createdAt: "2025-06-01",
      status: "pending",
    },
    {
      id: 2,
      customerId: 102,
      customerName: "Nguyễn Văn Nam",
      question: "Quy trình tư vấn trước xét nghiệm như thế nào?",
      createdAt: "2025-06-05",
      status: "answered",
    },
    {
      id: 3,
      customerId: 103,
      customerName: "Lê Thu Trang",
      question: "Khi nào có kết quả xét nghiệm?",
      createdAt: "2025-06-10",
      status: "pending",
    },
  ]);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [response, setResponse] = useState("");

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
    setResponse("");
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
      q.id === currentQuestion.id ? { ...q, status: "answered" } : q
    );
    setQuestions(updatedQuestions);
    setOpenDialog(false);
  };

  const handleMarkResolved = (id) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, status: "resolved" } : q
    );
    setQuestions(updatedQuestions);
  };

  // Filter questions dựa trên searchTerm
  const filteredQuestions = questions.filter(
    (question) =>
      question.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trả lời câu hỏi
      </Typography>

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
      </Box>

      {/* Questions Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Câu hỏi</TableCell>
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
                  <TableCell>{question.customerName}</TableCell>
                  <TableCell>{question.question}</TableCell>
                  <TableCell>{question.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        question.status === "pending"
                          ? "Chờ trả lời"
                          : question.status === "answered"
                          ? "Đã trả lời"
                          : "Đã giải quyết"
                      }
                      color={
                        question.status === "pending"
                          ? "warning"
                          : question.status === "answered"
                          ? "info"
                          : "success"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={question.status === "resolved"}
                      onClick={() => handleOpenReplyDialog(question)}
                    >
                      <ReplyIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="success"
                      disabled={
                        question.status === "pending" ||
                        question.status === "resolved"
                      }
                      onClick={() => handleMarkResolved(question.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Reply Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Trả lời câu hỏi</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Khách hàng:</strong> {currentQuestion?.customerName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Câu hỏi:</strong> {currentQuestion?.question}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Câu trả lời của bạn"
              margin="normal"
              value={response}
              onChange={handleResponseChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={!response.trim()}
          >
            Gửi trả lời
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionResponseContent;

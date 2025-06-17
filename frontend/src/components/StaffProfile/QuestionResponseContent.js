/**
 * QuestionResponseContent.js
 *
 * Mục đích: Hiển thị và quản lý các câu hỏi từ khách hàng
 * - Hiển thị danh sách câu hỏi
 * - Trả lời câu hỏi
 * - Đánh dấu đã giải quyết
 */

import React, { useState, useEffect } from "react";
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
  Badge,
  Tooltip,
  LinearProgress,
  Skeleton,
  Avatar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  PersonOutline as PersonOutlineIcon,
  CalendarToday as CalendarTodayIcon,
  Send as SendIcon,
  HelpOutline as HelpOutlineIcon,
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
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "pending", "answered", "resolved"
  const [refreshKey, setRefreshKey] = useState(0);

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
  // Thêm handler cho việc lọc theo trạng thái
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  // Handler để làm mới dữ liệu
  const handleRefresh = () => {
    setLoading(true);
    // Giả lập tải dữ liệu
    setTimeout(() => {
      setLoading(false);
      setRefreshKey((prev) => prev + 1);
    }, 500);
  };

  // Filter questions dựa trên searchTerm và statusFilter
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || question.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <HelpOutlineIcon fontSize="large" sx={{ mr: 2, color: "#3f51b5" }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#3f51b5" }}>
            Trả lời câu hỏi
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Quản lý và phản hồi các câu hỏi từ khách hàng
        </Typography>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Số liệu thống kê */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          {[
            {
              label: "Tổng câu hỏi",
              value: questions.length,
              color: "#3f51b5",
              icon: <QuestionAnswerIcon />,
            },
            {
              label: "Chờ trả lời",
              value: questions.filter((q) => q.status === "pending").length,
              color: "#ff9800",
              icon: <HelpOutlineIcon />,
            },
            {
              label: "Đã trả lời",
              value: questions.filter((q) => q.status === "answered").length,
              color: "#2196f3",
              icon: <ReplyIcon />,
            },
            {
              label: "Đã giải quyết",
              value: questions.filter((q) => q.status === "resolved").length,
              color: "#4caf50",
              icon: <CheckCircleIcon />,
            },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 200,
                flexGrow: 1,
                border: `1px solid ${stat.color}20`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{ bgcolor: `${stat.color}20`, color: stat.color, mr: 2 }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm câu hỏi hoặc khách hàng..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            flexGrow: 1,
            minWidth: "250px",
            maxWidth: "450px",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Làm mới
          </Button>

          {/* Bộ lọc trạng thái */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {[
              { value: "all", label: "Tất cả", color: "default" },
              { value: "pending", label: "Chờ trả lời", color: "warning" },
              { value: "answered", label: "Đã trả lời", color: "info" },
              { value: "resolved", label: "Đã giải quyết", color: "success" },
            ].map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                color={statusFilter === item.value ? item.color : "default"}
                onClick={() => handleStatusFilter(item.value)}
                sx={{
                  fontWeight: statusFilter === item.value ? 600 : 400,
                  boxShadow:
                    statusFilter === item.value
                      ? "0 2px 5px rgba(0,0,0,0.1)"
                      : "none",
                  transition: "all 0.2s",
                }}
                variant={statusFilter === item.value ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* Questions Table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ width: "100%" }}>
                  <Skeleton width="40%" height={24} />
                  <Skeleton width="70%" height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : filteredQuestions.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <HelpOutlineIcon
              sx={{
                fontSize: 60,
                color: "text.secondary",
                opacity: 0.3,
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy câu hỏi nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thử thay đổi tìm kiếm hoặc bộ lọc
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                      Khách hàng
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Câu hỏi</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                      Ngày tạo
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((question) => (
                    <TableRow
                      key={question.id}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#f5f7fa" },
                        borderLeft:
                          question.status === "pending"
                            ? "3px solid #ff9800"
                            : question.status === "answered"
                            ? "3px solid #2196f3"
                            : "3px solid #4caf50",
                      }}
                    >
                      <TableCell>{question.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: "0.9rem",
                              bgcolor:
                                question.customerName.charCodeAt(0) % 5 === 0
                                  ? "#f44336"
                                  : question.customerName.charCodeAt(0) % 5 ===
                                    1
                                  ? "#3f51b5"
                                  : question.customerName.charCodeAt(0) % 5 ===
                                    2
                                  ? "#009688"
                                  : question.customerName.charCodeAt(0) % 5 ===
                                    3
                                  ? "#ff9800"
                                  : "#9c27b0",
                              mr: 1,
                            }}
                          >
                            {question.customerName.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {question.question}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {question.createdAt}
                        </Typography>
                      </TableCell>
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
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Trả lời">
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={question.status === "resolved"}
                              onClick={() => handleOpenReplyDialog(question)}
                              sx={{
                                bgcolor:
                                  question.status !== "resolved"
                                    ? "rgba(25, 118, 210, 0.08)"
                                    : "transparent",
                                mr: 1,
                              }}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Đánh dấu đã giải quyết">
                          <span>
                            <IconButton
                              size="small"
                              color="success"
                              disabled={
                                question.status === "pending" ||
                                question.status === "resolved"
                              }
                              onClick={() => handleMarkResolved(question.id)}
                              sx={{
                                bgcolor:
                                  question.status === "answered"
                                    ? "rgba(76, 175, 80, 0.08)"
                                    : "transparent",
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
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
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    margin: 0,
                  },
              }}
            />
          </TableContainer>
        )}
      </Paper>{" "}
      {/* Reply Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f5f7fa",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            py: 2,
          }}
        >
          <ReplyIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            Trả lời câu hỏi
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {currentQuestion && (
            <Box>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: "#3f51b5",
                    }}
                  >
                    {currentQuestion.customerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {currentQuestion.customerName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
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
                    fontStyle: "italic",
                    "&::before": {
                      content: '"\\""',
                      fontSize: "1.2rem",
                      mr: 0.5,
                      color: "primary.main",
                    },
                    "&::after": {
                      content: '"\\""',
                      fontSize: "1.2rem",
                      ml: 0.5,
                      color: "primary.main",
                    },
                  }}
                >
                  {currentQuestion.question}
                </Typography>
              </Paper>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  sx: { p: 2 },
                }}
              />

              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                  Câu trả lời của bạn sẽ được gửi trực tiếp đến khách hàng. Hãy
                  đảm bảo thông tin chuyên môn, cung cấp sự hỗ trợ cần thiết và
                  thân thiện.
                </Alert>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitResponse}
            disabled={!response || !response.trim()}
            startIcon={<SendIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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

/**
 * QuestionsContent.js - Component hiển thị danh sách câu hỏi đã đặt
 *
 * Chức năng:
 * - Hiển thị tất cả câu hỏi mà khách hàng đã đặt
 * - Phân loại theo trạng thái (đã trả lời, chưa trả lời)
 * - Chi tiết từng câu hỏi và câu trả lời của bác sĩ
 * - Cho phép tìm kiếm và lọc câu hỏi
 * - Hỗ trợ đặt câu hỏi mới
 *
 * Features:
 * - Card-based question display
 * - Status indicators cho trạng thái câu hỏi
 * - Expandable answers
 * - Search và filter
 * - Pagination support
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
  InputAdornment,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  QuestionAnswer as QuestionIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterAlt as FilterAltIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(74, 144, 226, 0.15)",
  color: "#2D3748",
  boxShadow: "0 8px 32px 0 rgba(74, 144, 226, 0.1)",
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #FFFFFF, #F5F7FA)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(74, 144, 226, 0.12)",
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.05)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 10px 25px 0 rgba(74, 144, 226, 0.2)",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "#4A5568",
  "&.Mui-selected": {
    color: "#4A90E2",
    fontWeight: 600,
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  fontSize: "0.85rem",
  padding: "4px 0",
  height: "28px",
  color: "#fff",
  background:
    status === "answered"
      ? "linear-gradient(45deg, #4CAF50, #2ECC71)"
      : "linear-gradient(45deg, #F39C12, #E67E22)",
  boxShadow:
    status === "answered"
      ? "0 3px 10px rgba(76, 175, 80, 0.3)"
      : "0 3px 10px rgba(243, 156, 18, 0.3)",
}));

// Mock data cho câu hỏi
const mockQuestions = [
  {
    id: 1,
    question:
      "Tôi có triệu chứng đau đầu và sốt nhẹ kéo dài 3 ngày, có nên đi khám không?",
    date: "2025-05-28T10:30:00",
    status: "answered",
    answer:
      "Dựa trên triệu chứng của bạn, tôi khuyên bạn nên đặt lịch khám để được kiểm tra. Đau đầu kèm sốt có thể là dấu hiệu của nhiều vấn đề sức khỏe. Hãy theo dõi nhiệt độ và uống đủ nước trong thời gian chờ đợi.",
    doctorName: "BS. Nguyễn Văn A",
    answeredAt: "2025-05-29T14:20:00",
    category: "Đa khoa",
  },
  {
    id: 2,
    question:
      "Tôi muốn biết thêm về dịch vụ khám sức khỏe định kỳ của phòng khám?",
    date: "2025-05-30T15:45:00",
    status: "pending",
    category: "Dịch vụ",
  },
  {
    id: 3,
    question:
      "Tôi có nên tiêm vaccine phòng cúm hàng năm không? Tôi 35 tuổi và khỏe mạnh.",
    date: "2025-05-25T08:15:00",
    status: "answered",
    answer:
      "Việc tiêm vaccine cúm hàng năm được khuyến nghị cho mọi người từ 6 tháng tuổi trở lên, kể cả những người khỏe mạnh như bạn. Vaccine giúp bảo vệ không chỉ bạn mà còn cả những người xung quanh có hệ miễn dịch yếu hơn.",
    doctorName: "BS. Trần Thị B",
    answeredAt: "2025-05-26T11:30:00",
    category: "Vaccine",
  },
  {
    id: 4,
    question:
      "Tôi đang dùng thuốc huyết áp và muốn biết có thể dùng đồng thời với thuốc cảm cúm không?",
    date: "2025-06-01T09:20:00",
    status: "pending",
    category: "Dược phẩm",
  },
  {
    id: 5,
    question: "Tôi có nên cho con 2 tuổi uống vitamin tổng hợp không?",
    date: "2025-05-20T16:00:00",
    status: "answered",
    answer:
      "Trẻ em 2 tuổi có thể nhận đủ vitamin và khoáng chất từ chế độ ăn uống đa dạng, cân bằng. Nếu bạn lo lắng về dinh dưỡng của con, hãy tham khảo ý kiến bác sĩ nhi khoa trước khi cho trẻ dùng bất kỳ loại vitamin nào.",
    doctorName: "BS. Lê Thị C",
    answeredAt: "2025-05-21T10:45:00",
    category: "Nhi khoa",
  },
];

const QuestionsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    category: "",
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // Toggle question expansion
  const toggleQuestionExpand = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle new question form
  const toggleNewQuestionForm = () => {
    setShowNewQuestionForm(!showNewQuestionForm);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit new question
  const handleSubmitQuestion = () => {
    // Here you would integrate with your API
    console.log("Submitting question:", newQuestion);

    // Reset form and hide it
    setNewQuestion({
      question: "",
      category: "",
    });
    setShowNewQuestionForm(false);

    // Provide user feedback (in a real app, you'd show a notification)
    alert("Câu hỏi đã được gửi thành công!");
  };

  // Filter questions based on search, category, and tab
  const filteredQuestions = mockQuestions.filter((q) => {
    // Filter by tab (All, Answered, Pending)
    if (tabValue === 1 && q.status !== "answered") return false;
    if (tabValue === 2 && q.status !== "pending") return false;

    // Filter by search term
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.category &&
        q.category.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by category
    const matchesCategory =
      categoryFilter === "all" || q.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get unique categories for filter
  const categories = ["all", ...new Set(mockQuestions.map((q) => q.category))];

  return (
    <Box>
      {/* Header section with search, filters and new question button */}
      <StyledPaper
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 4,
          borderRadius: "20px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          {" "}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical blue to teal
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            Câu hỏi của tôi
          </Typography>{" "}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={toggleNewQuestionForm}
            sx={{
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical blue to teal
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 8px 15px rgba(74, 144, 226, 0.5)",
              padding: "10px 20px",
              fontSize: "1rem",
              alignSelf: { xs: "stretch", sm: "auto" },
              "&:hover": {
                background: "linear-gradient(45deg, #357ABD, #16A085)",
                boxShadow: "0 10px 20px rgba(74, 144, 226, 0.6)",
              },
            }}
          >
            Đặt câu hỏi mới
          </Button>
        </Box>{" "}
        {/* New Question Form */}
        {showNewQuestionForm && (
          <StyledPaper
            sx={{
              p: { xs: 2.5, md: 4 },
              mb: 4,
              background:
                "linear-gradient(145deg, rgba(74, 144, 226, 0.15), rgba(26, 188, 156, 0.1))",
              borderRadius: "16px",
              border: "1px solid rgba(74, 144, 226, 0.3)",
              boxShadow: "0 8px 20px rgba(74, 144, 226, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 5,
                  height: 28,
                  background: "linear-gradient(180deg, #3b82f6, #8b5cf6)",
                  mr: 2,
                  borderRadius: 5,
                }}
              />{" "}
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "#2D3748" }}
              >
                Đặt câu hỏi mới
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="question"
                  label="Câu hỏi của bạn"
                  multiline
                  rows={4}
                  value={newQuestion.question}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "#2D3748", // Màu đậm hơn cho text trên nền sáng
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#4A5568", // Màu tối hơn cho label
                      fontWeight: 500,
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.85)",
                    },
                    "& .MuiSelect-select": { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                  }}
                >
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    name="category"
                    value={newQuestion.category}
                    onChange={handleInputChange}
                    label="Danh mục"
                  >
                    <MenuItem value="Đa khoa">Đa khoa</MenuItem>
                    <MenuItem value="Nhi khoa">Nhi khoa</MenuItem>
                    <MenuItem value="Vaccine">Vaccine</MenuItem>
                    <MenuItem value="Dược phẩm">Dược phẩm</MenuItem>
                    <MenuItem value="Dịch vụ">Dịch vụ</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                {" "}
                <Button
                  variant="contained"
                  onClick={handleSubmitQuestion}
                  disabled={!newQuestion.question || !newQuestion.category}
                  sx={{
                    background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical blue to teal
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    opacity:
                      !newQuestion.question || !newQuestion.category ? 0.5 : 1,
                    "&:hover": {
                      background: "linear-gradient(45deg, #3498DB, #16A085)", // Darker medical blue to teal
                    },
                  }}
                >
                  Gửi câu hỏi
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          {/* Search field */}
          <TextField
            placeholder="Tìm kiếm câu hỏi..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                color: "#2D3748", // Màu tối hơn cho text trên nền sáng
                padding: "14px 14px 14px 0",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "rgba(74, 144, 226, 0.3)" }, // Màu viền xanh y tế                "&:hover fieldset": { borderColor: "rgba(74, 144, 226, 0.5)" },
                "&.Mui-focused fieldset": {
                  borderColor: "#4A90E2",
                  borderWidth: "2px",
                },
              },
              flexGrow: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon sx={{ color: "#4A5568" }} />
                </InputAdornment>
              ),
            }}
          />
          {/* Category filter */}{" "}
          <FormControl sx={{ minWidth: 200 }} variant="outlined">
            <InputLabel sx={{ color: "#4A5568" }}>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Danh mục"
              sx={{
                color: "#2D3748", // Màu text đậm hơn
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(74, 144, 226, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(74, 144, 226, 0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4A90E2",
                  borderWidth: "2px",
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <FilterAltIcon sx={{ color: "#4A5568" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Tất cả danh mục</MenuItem>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </StyledPaper>{" "}
      {/* Tabs for question status filtering */}{" "}
      <Box
        sx={{
          mb: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          padding: "4px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(74, 144, 226, 0.15)",
        }}
      >
        {" "}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{
            sx: {
              background: "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical blue to teal
              height: "100%",
              borderRadius: "8px",
              zIndex: 0,
            },
          }}
          sx={{
            minHeight: "48px",
            "& .Mui-selected": {
              color: "#2D3748 !important", // Màu text tối cho trạng thái selected
              fontWeight: "700 !important",
              zIndex: 1,
            },
          }}
        >
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <QuestionIcon sx={{ fontSize: 20 }} />
                Tất cả
              </Box>
            }
            sx={{ borderRadius: "8px", zIndex: 1 }}
          />
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ color: "#10b981", fontSize: 18 }} />
                Đã trả lời
              </Box>
            }
            sx={{ borderRadius: "8px", zIndex: 1 }}
          />
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
                Đang chờ
              </Box>
            }
            sx={{ borderRadius: "8px", zIndex: 1 }}
          />
        </Tabs>
      </Box>
      {/* Questions list */}
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <QuestionCard key={question.id} sx={{ mb: 3 }}>
            <CardContent sx={{ padding: { xs: 2.5, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 1.5, sm: 0 },
                  }}
                >
                  {question.status === "answered" ? (
                    <Tooltip title="Đã trả lời">
                      {" "}
                      <CheckCircleIcon
                        sx={{ color: "#4CAF50", mr: 1.5, fontSize: 20 }} // Medical green
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Đang chờ">
                      {" "}
                      <AccessTimeIcon
                        sx={{ color: "#F39C12", mr: 1.5, fontSize: 20 }} // Medical orange
                      />
                    </Tooltip>
                  )}{" "}
                  <Typography
                    variant="body1"
                    color="#2D3748" // Màu text tối cho ngày tháng
                    sx={{
                      fontWeight: 500,
                      letterSpacing: "0.3px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {formatDate(question.date)}
                  </Typography>
                </Box>
                <StatusChip
                  label={
                    question.status === "answered" ? "Đã trả lời" : "Đang chờ"
                  }
                  size="small"
                  status={question.status}
                  icon={
                    question.status === "answered" ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <AccessTimeIcon fontSize="small" />
                    )
                  }
                />
              </Box>{" "}
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mb: 2.5,
                  fontSize: "1.1rem",
                  lineHeight: 1.5,
                  letterSpacing: "0.3px",
                  color: "#2D3748", // Màu text tối cho nội dung câu hỏi
                }}
              >
                {question.question}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                }}
              >
                {" "}
                <Chip
                  label={question.category}
                  size="small"
                  sx={{
                    background: "rgba(74, 144, 226, 0.1)",
                    color: "#4A5568", // Màu text tối cho category
                    fontWeight: 500,
                    borderRadius: "8px",
                    border: "1px solid rgba(74, 144, 226, 0.2)",
                  }}
                />
                {question.status === "answered" && (
                  <Button
                    endIcon={
                      expandedQuestions[question.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )
                    }
                    onClick={() => toggleQuestionExpand(question.id)}
                    sx={{
                      color: "#3b82f6",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.15)",
                      },
                    }}
                  >
                    {expandedQuestions[question.id]
                      ? "Ẩn câu trả lời"
                      : "Xem câu trả lời"}
                  </Button>
                )}
              </Box>
              {/* Answer section - only show if expanded and answered */}
              {expandedQuestions[question.id] &&
                question.status === "answered" && (
                  <Box
                    sx={{
                      mt: 3,
                      pt: 3,
                      borderTop: "1px solid rgba(74, 144, 226, 0.2)",
                      animation: "fadeIn 0.5s ease-in-out",
                      "@keyframes fadeIn": {
                        "0%": {
                          opacity: 0,
                          transform: "translateY(-10px)",
                        },
                        "100%": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 2.5 }}
                    >
                      {" "}
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background:
                            "linear-gradient(45deg, #4A90E2, #1ABC9C)", // Medical colors
                          mr: 1.5,
                          fontWeight: 700,
                          fontSize: "1rem",
                          border: "2px solid rgba(74, 144, 226, 0.2)",
                          color: "#fff", // Text trong avatar vẫn màu trắng để nổi bật
                        }}
                      >
                        {question.doctorName.split(" ").pop().charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body1"
                          color="#2D3748" // Màu text tối
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            mb: 0.3,
                          }}
                        >
                          {question.doctorName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#4A5568" // Màu text tối hơn
                          sx={{
                            fontSize: "0.85rem",
                          }}
                        >
                          Trả lời lúc: {formatDate(question.answeredAt)}
                        </Typography>
                      </Box>
                    </Box>{" "}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "14px",
                        background:
                          "linear-gradient(145deg, rgba(76, 175, 80, 0.15), rgba(46, 204, 113, 0.08))", // Medical green
                        border: "1px solid rgba(76, 175, 80, 0.3)",
                        boxShadow: "0 4px 15px rgba(46, 204, 113, 0.15)",
                      }}
                    >
                      {" "}
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: "1rem",
                          letterSpacing: "0.3px",
                          color: "#2D3748", // Màu text tối cho nội dung câu trả lời
                          // Loại bỏ text shadow không cần thiết
                        }}
                      >
                        {question.answer}
                      </Typography>
                    </Box>
                  </Box>
                )}
            </CardContent>
          </QuestionCard>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            background: "rgba(255, 255, 255, 0.8)", // Nền sáng hơn
            borderRadius: "16px",
            border: "1px solid rgba(74, 144, 226, 0.15)", // Viền màu medical
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
          }}
        >
          {" "}
          <QuestionIcon
            sx={{ fontSize: 64, color: "rgba(74, 144, 226, 0.3)", mb: 2 }}
          />
          <Typography
            variant="h6"
            color="#2D3748"
            fontWeight={600}
            sx={{ mb: 1 }}
          >
            Không tìm thấy câu hỏi nào
          </Typography>{" "}
          <Typography
            variant="body2"
            color="#4A5568" // Text color đậm hơn cho phù hợp với nền sáng
            sx={{ mb: 3, textAlign: "center" }}
          >
            Hãy thử thay đổi bộ lọc hoặc đặt câu hỏi mới
          </Typography>{" "}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={toggleNewQuestionForm}
            sx={{
              color: "#4A90E2", // Medical blue
              borderColor: "#4A90E2",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              padding: "8px 20px",
              "&:hover": {
                borderColor: "#1ABC9C", // Medical teal
                background: "rgba(74, 144, 226, 0.1)",
              },
            }}
          >
            Đặt câu hỏi mới
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default QuestionsContent;

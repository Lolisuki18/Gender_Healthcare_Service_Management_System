/**
 * HelpContent.js - Component hỗ trợ và FAQ
 *
 * Chức năng:
 * - FAQ section với expandable answers
 * - Contact support functionality
 * - Help articles và tutorials
 * - Live chat integration
 * - Feedback submission form
 *
 * Features:
 * - Searchable FAQ database
 * - Category-based help topics
 * - Step-by-step tutorials
 * - Contact form với file attachments
 * - Rating system cho help articles
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  ContactSupport as ContactSupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Description as DescriptionIcon,
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import AskQuestionDialog from '../common/AskQuestionDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link as RouterLink } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(74, 144, 226, 0.15)',
  color: '#2D3748',
  boxShadow: '0 8px 32px 0 rgba(74, 144, 226, 0.1)',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px !important',
  border: '1px solid rgba(74, 144, 226, 0.1)',
  color: '#2D3748',
  marginBottom: '12px',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 12px 0',
  },
}));

const HelpContent = () => {
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  // Thêm state cho bộ lọc và phân trang
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const FAQS_PER_PAGE = 5;

  // State mở dialog dùng chung
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);

  // FAQ data
  const faqs = [
    {
      category: 'booking',
      question: 'Làm thế nào để đặt lịch hẹn khám?',
      answer:
        'Bạn có thể đặt lịch hẹn khám qua website, ứng dụng di động hoặc gọi trực tiếp đến tổng đài. Chọn chuyên khoa, bác sĩ, ngày giờ phù hợp và xác nhận thông tin.',
      icon: <ScheduleIcon sx={{ color: '#4A90E2' }} />,
    },
    {
      category: 'booking',
      question: 'Có thể hủy hoặc thay đổi lịch hẹn không?',
      answer:
        'Bạn có thể hủy hoặc thay đổi lịch hẹn trước 24 giờ. Truy cập vào mục "Lịch hẹn" trong tài khoản để thực hiện thay đổi.',
      icon: <ScheduleIcon sx={{ color: '#4A90E2' }} />,
    },
    {
      category: 'payment',
      question: 'Các phương thức thanh toán được hỗ trợ?',
      answer:
        'Chúng tôi hỗ trợ thanh toán bằng tiền mặt, thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay, VNPay).',
      icon: <PaymentIcon sx={{ color: '#4CAF50' }} />,
    },
    {
      category: 'payment',
      question: 'Làm thế nào để xem hóa đơn và lịch sử thanh toán?',
      answer:
        'Truy cập vào mục "Hóa đơn" và "Lịch sử thanh toán" trong tài khoản của bạn. Bạn có thể tải xuống hóa đơn dưới dạng PDF.',
      icon: <PaymentIcon sx={{ color: '#4CAF50' }} />,
    },
    {
      category: 'medical',
      question: 'Khi nào có thể xem kết quả xét nghiệm?',
      answer:
        'Kết quả xét nghiệm thường có trong 1-3 ngày làm việc. Bạn sẽ nhận thông báo qua email/SMS khi có kết quả và có thể xem trong mục "Lịch sử khám".',
      icon: <DescriptionIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'medical',
      question: 'Làm thế nào để tải xuống kết quả khám?',
      answer:
        'Trong mục "Lịch sử khám", click vào biểu tượng tải xuống bên cạnh mỗi lần khám để tải file PDF kết quả.',
      icon: <DescriptionIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'account',
      question: 'Cách thay đổi thông tin cá nhân?',
      answer:
        'Truy cập vào mục "Hồ sơ cá nhân", click "Chỉnh sửa" để cập nhật thông tin. Lưu ý một số thông tin có thể cần xác thực bổ sung.',
      icon: <SettingsIcon sx={{ color: '#607D8B' }} />,
    },
    {
      category: 'account',
      question: 'Làm thế nào để đổi mật khẩu?',
      answer:
        'Vào mục "Cài đặt" > "Bảo mật", nhập mật khẩu hiện tại và mật khẩu mới. Mật khẩu cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.',
      icon: <SecurityIcon sx={{ color: '#1ABC9C' }} />,
    },
    {
      category: 'account',
      question: 'Hồ sơ cá nhân có thể chỉnh sửa những thông tin gì?',
      answer:
        'Bạn có thể chỉnh sửa tên, ngày sinh, giới tính, số điện thoại, email và ảnh đại diện trong mục "Hồ sơ cá nhân". Một số thông tin như email hoặc số điện thoại có thể yêu cầu xác thực lại.',
      icon: <SettingsIcon sx={{ color: '#607D8B' }} />,
    },
    {
      category: 'medical',
      question: 'Làm sao để theo dõi chu kỳ kinh nguyệt trên hệ thống?',
      answer:
        'Bạn có thể nhập thông tin chu kỳ kinh nguyệt trong mục "Theo dõi chu kỳ". Hệ thống sẽ tự động nhắc nhở và dự đoán ngày rụng trứng, ngày hành kinh tiếp theo.',
      icon: <DescriptionIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'medical',
      question: 'Hệ thống có nhắc uống thuốc tránh thai không?',
      answer:
        'Có. Bạn có thể bật tính năng nhắc uống thuốc trong mục "Nhắc uống thuốc". Hệ thống sẽ gửi thông báo nhắc nhở hàng ngày theo giờ bạn đã chọn.',
      icon: <ScheduleIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'medical',
      question: 'Làm thế nào để đăng ký xét nghiệm STI?',
      answer:
        'Bạn vào mục "Đăng ký xét nghiệm", chọn gói hoặc dịch vụ xét nghiệm STI phù hợp, sau đó chọn thời gian và hoàn tất thanh toán. Kết quả sẽ được trả về tài khoản của bạn.',
      icon: <DescriptionIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'medical',
      question: 'Tôi có thể xem lại kết quả xét nghiệm ở đâu?',
      answer:
        'Kết quả xét nghiệm sẽ được lưu trong mục "Lịch sử khám" hoặc "Kết quả xét nghiệm". Bạn có thể tải về file PDF hoặc xem chi tiết từng lần xét nghiệm.',
      icon: <DescriptionIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'account',
      question: 'Làm sao để gửi đánh giá về dịch vụ hoặc bác sĩ?',
      answer:
        'Sau khi hoàn thành buổi khám hoặc nhận kết quả xét nghiệm, bạn có thể vào mục "Đánh giá & Nhận xét" để gửi đánh giá về dịch vụ hoặc bác sĩ đã tư vấn.',
      icon: <QuestionAnswerIcon sx={{ color: '#F39C12' }} />,
    },
    {
      category: 'account',
      question: 'Tôi có thể gửi câu hỏi hoặc thắc mắc ở đâu?',
      answer:
        'Bạn có thể gửi câu hỏi tại mục "Hỏi đáp" hoặc liên hệ trực tiếp với tổng đài, email, hoặc chat trực tuyến để được hỗ trợ nhanh nhất.',
      icon: <HelpIcon sx={{ color: '#4A90E2' }} />,
    },
    {
      category: 'payment',
      question:
        'Nếu thanh toán thất bại hoặc bị trừ tiền nhưng chưa xác nhận, tôi phải làm gì?',
      answer:
        'Bạn vui lòng liên hệ tổng đài hoặc gửi email kèm thông tin giao dịch để được kiểm tra và hoàn tiền (nếu có) trong vòng 1-3 ngày làm việc.',
      icon: <PaymentIcon sx={{ color: '#4CAF50' }} />,
    },
    {
      category: 'account',
      question: 'Thông tin cá nhân của tôi có được bảo mật không?',
      answer:
        'Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của bạn theo chính sách bảo mật. Dữ liệu được mã hóa và chỉ sử dụng cho mục đích chăm sóc sức khỏe.',
      icon: <SecurityIcon sx={{ color: '#1ABC9C' }} />,
    },
    {
      category: 'account',
      question: 'Làm sao để sử dụng các bài viết blog và tài liệu hướng dẫn?',
      answer:
        'Bạn có thể truy cập mục "Blog" để đọc các bài viết về sức khỏe, giới tính, phòng tránh bệnh, hoặc xem các hướng dẫn sử dụng hệ thống, dịch vụ.',
      icon: <DescriptionIcon sx={{ color: '#3b82f6' }} />,
    },
  ];

  // Danh sách category cho bộ lọc
  const faqCategories = [
    { key: 'all', label: 'Tất cả', color: '#64748b' },
    { key: 'booking', label: 'Đặt lịch hẹn', color: '#4A90E2' },
    { key: 'payment', label: 'Thanh toán', color: '#4CAF50' },
    { key: 'medical', label: 'Y tế', color: '#F39C12' },
    { key: 'account', label: 'Tài khoản', color: '#607D8B' },
  ];

  // Lọc FAQ theo category
  const filteredFaqs =
    categoryFilter === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === categoryFilter);

  // Phân trang
  const totalPages = Math.ceil(filteredFaqs.length / FAQS_PER_PAGE);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * FAQS_PER_PAGE,
    currentPage * FAQS_PER_PAGE
  );

  // Khi đổi category thì về trang 1
  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  // Support options
  const supportOptions = [
    {
      title: 'Tổng đài hỗ trợ',
      description: '24/7 - Miễn phí',
      contact: '1900-1234',
      icon: <PhoneIcon sx={{ color: '#4A90E2', fontSize: 32 }} />,
      action: () => window.open('tel:19001234'),
    },
    {
      title: 'Email hỗ trợ',
      description: 'Phản hồi trong 2-4 giờ',
      contact: 'support@healthcare.vn',
      icon: <EmailIcon sx={{ color: '#1ABC9C', fontSize: 32 }} />,
      action: () => setOpenContactDialog(true),
    },
    {
      title: 'Chat trực tuyến',
      description: 'Thời gian: 8:00 - 22:00',
      contact: 'Bắt đầu chat',
      icon: <ChatIcon sx={{ color: '#4CAF50', fontSize: 32 }} />,
      action: () => console.log('Start chat'),
    },
    {
      title: 'Video call hỗ trợ',
      description: 'Hẹn trước 30 phút',
      contact: 'Đặt lịch hẹn',
      icon: <VideoCallIcon sx={{ color: '#F39C12', fontSize: 32 }} />,
      action: () => console.log('Schedule video call'),
    },
  ];

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', contactForm);
    setOpenContactDialog(false);
    setContactForm({ subject: '', message: '', category: 'general' });
  };

  const getCategoryName = (category) => {
    const categories = {
      booking: 'Đặt lịch hẹn',
      payment: 'Thanh toán',
      medical: 'Y tế',
      account: 'Tài khoản',
    };
    return categories[category] || 'Khác';
  };
  const getCategoryColor = (category) => {
    const colors = {
      booking: '#4A90E2',
      payment: '#4CAF50',
      medical: '#F39C12',
      account: '#607D8B',
    };
    return colors[category] || '#607D8B';
  };

  return (
    <Box>
      {/* Nút đặt câu hỏi mới */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<HelpIcon />}
          onClick={() => setShowNewQuestionForm(true)}
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 8px 15px rgba(74, 144, 226, 0.2)',
            px: 3,
            py: 1.2,
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(45deg, #357ABD, #16A085)',
            },
          }}
        >
          Đặt câu hỏi mới
        </Button>
      </Box>
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {' '}
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <HelpIcon sx={{ fontSize: 40, color: '#4A90E2', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              {faqs.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Câu hỏi thường gặp
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <ContactSupportIcon
              sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }}
            />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              24/7
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Hỗ trợ tổng đài
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            <QuestionAnswerIcon
              sx={{ fontSize: 40, color: '#F39C12', mb: 1 }}
            />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              2-4h
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Thời gian phản hồi
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ p: 3, textAlign: 'center' }}>
            {' '}
            <ChatIcon sx={{ fontSize: 40, color: '#1ABC9C', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              4
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              Kênh hỗ trợ
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* FAQ Section */}
        <Grid item xs={12} md={8}>
          <StyledPaper sx={{ p: 3, mb: 3 }}>
            {' '}
            <Typography
              variant="h6"
              sx={{ color: '#2D3748', fontWeight: 600, mb: 3 }}
            >
              Câu hỏi thường gặp
            </Typography>
            {/* Bộ lọc category */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {faqCategories.map((cat) => (
                <Chip
                  key={cat.key}
                  label={cat.label}
                  clickable
                  onClick={() => handleCategoryChange(cat.key)}
                  sx={{
                    backgroundColor:
                      categoryFilter === cat.key ? cat.color : '#f1f5f9',
                    color: categoryFilter === cat.key ? '#fff' : '#2D3748',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
            {/* Danh sách FAQ phân trang */}
            {paginatedFaqs.map((faq, index) => (
              <StyledAccordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                  sx={{ py: 1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ mr: 2 }}>{faq.icon}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: '#2D3748', fontWeight: 500 }}
                      >
                        {faq.question}
                      </Typography>
                    </Box>
                    <Chip
                      label={getCategoryName(faq.category)}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(faq.category),
                        color: '#fff',
                        fontSize: '0.75rem',
                        mr: 2,
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      lineHeight: 1.6,
                      pl: 6,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>
            ))}
            {/* Pagination controls */}
            <Box
              sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBackIosNewIcon />}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                sx={{ minWidth: 40 }}
              >
                Trước
              </Button>
              <Typography sx={{ alignSelf: 'center', fontWeight: 500 }}>
                Trang {currentPage} / {totalPages}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIosIcon />}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                sx={{ minWidth: 40 }}
              >
                Sau
              </Button>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Support Options */}
        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ p: 3 }}>
            {' '}
            <Typography
              variant="h6"
              sx={{ color: '#2D3748', fontWeight: 600, mb: 3 }}
            >
              Liên hệ hỗ trợ
            </Typography>
            <Grid container spacing={2}>
              {supportOptions.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={option.action}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2 }}>{option.icon}</Box>
                        <Box sx={{ flexGrow: 1 }}>
                          {' '}
                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#2D3748', fontWeight: 600, mb: 0.5 }}
                          >
                            {option.title}
                          </Typography>{' '}
                          <Typography
                            variant="caption"
                            sx={{ color: '#4A5568', display: 'block', mb: 0.5 }}
                          >
                            {option.description}
                          </Typography>{' '}
                          <Typography
                            variant="body2"
                            sx={{ color: '#4A90E2', fontWeight: 500 }}
                          >
                            {option.contact}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </StyledPaper>

          {/* Quick Links */}
          <StyledPaper sx={{ p: 3, mt: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: '#2D3748', fontWeight: 600, mb: 2 }}
            >
              Liên kết hữu ích
            </Typography>

            <List sx={{ p: 0 }}>
              <ListItem button sx={{ borderRadius: '8px', mb: 1 }}>
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: '#3b82f6' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hướng dẫn sử dụng"
                  primaryTypographyProps={{
                    color: '#2D3748',
                    fontSize: '0.875rem',
                  }}
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/privacy"
                sx={{ borderRadius: '8px', mb: 1 }}
              >
                <ListItemIcon>
                  <SecurityIcon sx={{ color: '#10b981' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Chính sách bảo mật"
                  primaryTypographyProps={{
                    color: '#2D3748',
                    fontSize: '0.875rem',
                  }}
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/terms"
                sx={{ borderRadius: '8px', mb: 1 }}
              >
                <ListItemIcon>
                  <DescriptionIcon sx={{ color: '#f59e0b' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Điều khoản sử dụng"
                  primaryTypographyProps={{
                    color: '#2D3748',
                    fontSize: '0.875rem',
                  }}
                />
              </ListItem>
              <ListItem button sx={{ borderRadius: '8px' }}>
                <ListItemIcon>
                  <ContactSupportIcon sx={{ color: '#8b5cf6' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Góp ý & Phản hồi"
                  primaryTypographyProps={{
                    color: '#2D3748',
                    fontSize: '0.875rem',
                  }}
                />
              </ListItem>
            </List>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      <Dialog
        open={openContactDialog}
        onClose={() => setOpenContactDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#fff',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          Gửi yêu cầu hỗ trợ
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Tiêu đề"
            variant="outlined"
            margin="normal"
            value={contactForm.subject}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, subject: e.target.value }))
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#3b82f6',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Nội dung"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={contactForm.message}
            onChange={(e) =>
              setContactForm((prev) => ({ ...prev, message: e.target.value }))
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#3b82f6',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}
        >
          <Button
            onClick={() => setOpenContactDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleContactSubmit}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
              },
            }}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
      <AskQuestionDialog
        open={showNewQuestionForm}
        onClose={() => setShowNewQuestionForm(false)}
      />
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
};

export default HelpContent;

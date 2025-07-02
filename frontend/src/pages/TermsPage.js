import React from 'react';
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const sections = [
  {
    title: 'Giới thiệu',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Trang này quy định các điều khoản sử dụng dịch vụ của Gender Health Care. Khi truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản này.',
  },
  {
    title: 'Chấp nhận điều khoản',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Bằng việc sử dụng dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản được nêu ra tại đây.',
  },
  {
    title: 'Quyền và nghĩa vụ của người dùng',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content: (
      <List sx={{ pl: 2 }}>
        <ListItem sx={{ alignItems: 'flex-start', pb: 0 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mt: 1,
              mr: 2,
            }}
          />
          <ListItemText primary="Cung cấp thông tin chính xác, trung thực khi đăng ký hoặc sử dụng dịch vụ." />
        </ListItem>
        <ListItem sx={{ alignItems: 'flex-start', pb: 0 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mt: 1,
              mr: 2,
            }}
          />
          <ListItemText primary="Không sử dụng dịch vụ cho mục đích vi phạm pháp luật, đạo đức xã hội." />
        </ListItem>
        <ListItem sx={{ alignItems: 'flex-start', pb: 0 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mt: 1,
              mr: 2,
            }}
          />
          <ListItemText primary="Chịu trách nhiệm bảo mật thông tin tài khoản cá nhân." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Quyền và nghĩa vụ của Gender Health Care',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content: (
      <List sx={{ pl: 2 }}>
        <ListItem sx={{ alignItems: 'flex-start', pb: 0 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mt: 1,
              mr: 2,
            }}
          />
          <ListItemText primary="Cung cấp dịch vụ đúng như cam kết, đảm bảo chất lượng và an toàn." />
        </ListItem>
        <ListItem sx={{ alignItems: 'flex-start', pb: 0 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mt: 1,
              mr: 2,
            }}
          />
          <ListItemText primary="Bảo mật thông tin cá nhân của người dùng theo quy định pháp luật." />
        </ListItem>
        <ListItem sx={{ alignItems: 'flex-start', pb: 0 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mt: 1,
              mr: 2,
            }}
          />
          <ListItemText primary="Có quyền thay đổi, tạm ngưng dịch vụ khi cần thiết và sẽ thông báo cho người dùng." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Chính sách bảo mật',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân bất cứ lúc nào.',
  },
  {
    title: 'Giới hạn trách nhiệm',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Dịch vụ của chúng tôi chỉ mang tính chất tham khảo, không thay thế cho tư vấn, chẩn đoán hoặc điều trị y tế trực tiếp. Chúng tôi không chịu trách nhiệm với các thiệt hại phát sinh ngoài ý muốn hoặc ngoài tầm kiểm soát.',
  },
  {
    title: 'Sở hữu trí tuệ',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Toàn bộ nội dung, hình ảnh, logo trên website thuộc quyền sở hữu của Gender Health Care. Nghiêm cấm sao chép, sử dụng lại nếu không có sự đồng ý bằng văn bản.',
  },
  {
    title: 'Liên kết bên thứ ba',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Website có thể chứa liên kết đến trang web của bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung hoặc chính sách của các trang web đó.',
  },
  {
    title: 'Thay đổi điều khoản',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Gender Health Care có quyền thay đổi, cập nhật điều khoản dịch vụ bất cứ lúc nào. Mọi thay đổi sẽ được thông báo trên website.',
  },
  {
    title: 'Liên hệ',
    icon: <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Nếu có bất kỳ thắc mắc nào về điều khoản dịch vụ, vui lòng liên hệ: info@genderhealthcare.com hoặc số điện thoại +84 123 456 789.',
  },
];

const TermsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        py: isMobile ? 3 : 6,
        px: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md" disableGutters={isMobile}>
        <Paper
          elevation={6}
          sx={{
            background: '#fff',
            color: '#222',
            borderRadius: 5,
            boxShadow: '0 4px 24px 0 rgba(74,144,226,0.10)',
            px: isMobile ? 2 : 6,
            py: isMobile ? 3 : 5,
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Box mb={4}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight={700}
              gutterBottom
              textAlign="center"
              sx={{
                background: 'linear-gradient(90deg, #4A90E2 30%, #1ABC9C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1.5,
              }}
            >
              Điều khoản Dịch vụ
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign="center"
              sx={{ opacity: 0.85 }}
            >
              Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ
              của chúng tôi.
            </Typography>
          </Box>
          {sections.map((section, idx) => (
            <Box key={section.title} mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {section.icon}
                <Typography
                  variant={isMobile ? 'subtitle1' : 'h6'}
                  fontWeight={700}
                  sx={{
                    background:
                      'linear-gradient(90deg, #4A90E2 30%, #1ABC9C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline',
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                component="div"
                sx={{ mb: 1, color: '#222', opacity: 0.97, fontWeight: 400 }}
              >
                {section.content}
              </Typography>
              {idx < sections.length - 1 && (
                <Divider sx={{ my: 2, opacity: 0.12, bgcolor: '#4A90E2' }} />
              )}
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsPage;

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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const sections = [
  {
    title: 'Giới thiệu',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Chính sách bảo mật này giải thích cách Gender Health Care thu thập, sử dụng, bảo vệ và xử lý thông tin cá nhân của bạn khi sử dụng dịch vụ của chúng tôi. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.',
  },
  {
    title: 'Thông tin cá nhân được thu thập',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
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
          <ListItemText primary="Họ tên, email, số điện thoại, ngày sinh, giới tính, địa chỉ." />
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
          <ListItemText primary="Thông tin đăng nhập, lịch sử sử dụng dịch vụ, phản hồi và các thông tin khác do bạn cung cấp." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Mục đích sử dụng thông tin',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
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
          <ListItemText primary="Cung cấp, duy trì, cải thiện chất lượng dịch vụ." />
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
          <ListItemText primary="Liên hệ, hỗ trợ khách hàng khi cần thiết." />
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
          <ListItemText primary="Gửi thông báo, khuyến mãi, bản tin (nếu bạn đồng ý)." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Chia sẻ thông tin với bên thứ ba',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
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
          <ListItemText primary="Chúng tôi không bán, chia sẻ thông tin cá nhân cho bên thứ ba trừ khi có sự đồng ý của bạn hoặc theo quy định pháp luật." />
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
          <ListItemText primary="Các trường hợp ngoại lệ: yêu cầu pháp lý, bảo vệ quyền lợi, an toàn cho bạn hoặc cộng đồng." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Bảo mật thông tin',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
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
          <ListItemText primary="Áp dụng các biện pháp kỹ thuật, tổ chức phù hợp để bảo vệ thông tin cá nhân khỏi truy cập, sử dụng, tiết lộ trái phép." />
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
          <ListItemText primary="Người dùng có trách nhiệm bảo mật thông tin tài khoản và không chia sẻ với người khác." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Quyền của người dùng',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
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
          <ListItemText primary="Yêu cầu truy cập, chỉnh sửa, xóa thông tin cá nhân của mình." />
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
          <ListItemText primary="Liên hệ với chúng tôi qua email hoặc hotline để thực hiện quyền này." />
        </ListItem>
      </List>
    ),
  },
  {
    title: 'Thời gian lưu trữ thông tin',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Chúng tôi lưu trữ thông tin cá nhân trong thời gian cần thiết để phục vụ mục đích thu thập hoặc theo quy định của pháp luật. Sau đó, thông tin sẽ được xóa an toàn.',
  },
  {
    title: 'Liên kết đến website bên thứ ba',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Trang web có thể chứa liên kết đến website của bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung hoặc chính sách bảo mật của các website đó.',
  },
  {
    title: 'Thay đổi chính sách',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Gender Health Care có quyền thay đổi, cập nhật chính sách bảo mật bất cứ lúc nào. Mọi thay đổi sẽ được thông báo trên website.',
  },
  {
    title: 'Liên hệ',
    icon: <LockOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />,
    content:
      'Nếu có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ: info@genderhealthcare.com hoặc số điện thoại +84 123 456 789.',
  },
];

const PrivacyPage = () => {
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
              Chính sách bảo mật
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign="center"
              sx={{ opacity: 0.85 }}
            >
              Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
              bạn.
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

export default PrivacyPage;

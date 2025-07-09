/**
 * ConsultantProfile.js - Medical Light Theme Consultant Dashboard
 *
 * Đã được redesign để đồng bộ với CustomerProfile và AdminProfile
 *
 * THAY ĐỔI CHÍNH:
 * 1. Medical light background gradient (#f0f8ff to #ffffff)
 * 2. Glass morphism effect với light medical styling
 * 3. Medical color palette (#4A90E2, #1ABC9C)
 * 4. Consistent styling với other profiles
 * 5. Light theme typography và borders
 * 6. Medical-grade professional appearance
 * 7. Enhanced accessibility với medical design standards
 * 8. Harmonized visual hierarchy
 *
 * Mục đích: Provide professional consultant healthcare dashboard
 * với medical light design đồng bộ với hệ thống
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DynamicSideBar from '@/components/siderBar/DynamicSideBar';
import localStorageUtil from '@/utils/localStorage';

// Import content components
import MyQuestionsContent from './MyQuestionsContent';
// New components to be created
// The following components will be created in this task
import ConsultantProfileContent from './ConsultantProfileContent';
import ConsultantSecurityContent from '../siderBar/SecurityContent';
import MyConsultationsContent from './MyConsultationsContent';
import STITestsContent from './STITestsContent';
import MyReviewsContent from './MyReviewsContent';
import MedicalHistoryContent from '../siderBar/MedicalHistoryContent';
import InvoicesContent from '../siderBar/InvoicesContent';
import MyBlogPage from '../siderBar/MyBlogPage';
import PaymentMethodsSection from '../CustomerProfile/PaymentMethodsSection';

const MainContent = styled(Box)(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarOpen ? 0 : `-280px`,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

const ConsultantProfile = ({ user = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleMenuItemSelect = (itemId) => {
    setSelectedMenuItem(itemId);
  };

  const userData = localStorageUtil.get('userProfile')?.data || {};

  // Updated function to get page title based on menu item
  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case 'my-questions':
        return 'Câu hỏi của tôi';
      case 'consultant-profile':
        return 'Hồ sơ chuyên gia';
      case 'security':
        return 'Bảo mật tài khoản';
      case 'my-consultations':
        return 'Lịch tư vấn của tôi';
      case 'sti-tests':
        return 'Quản lý STI Tests';
      case 'my-reviews':
        return 'Đánh giá của tôi';
      case 'myBlogs':
        return 'Blog của tôi';
      default:
        return 'Câu hỏi của tôi';
    }
  };

  // Updated navigation content rendering based on the new menu items
  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'my-questions':
        return <MyQuestionsContent />;
      case 'consultant-profile':
        return <ConsultantProfileContent />;
      case 'security':
        return <ConsultantSecurityContent />;
      case 'my-consultations':
        return <MyConsultationsContent />;
      case 'sti-tests':
        return <STITestsContent />;
      case 'my-reviews':
        return <MyReviewsContent />;
      case 'medical-history':
        return <MedicalHistoryContent />;
      case 'invoices':
        return <InvoicesContent />;
      case 'payment-methods':
        return <PaymentMethodsSection />;
      default:
        return <ConsultantProfileContent />;
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 30%, #f5fafe 70%, #ffffff 100%)', // Medical light theme
      }}
    >
      <DynamicSideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedMenuItem}
        onItemSelect={handleMenuItemSelect}
        user={userData}
      />

      <MainContent sidebarOpen={sidebarOpen}>
        {' '}
        {/* Enhanced Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            background: 'rgba(255, 255, 255, 0.85)', // Medical glass effect
            backdropFilter: 'blur(25px)',
            borderBottom: '1px solid rgba(74, 144, 226, 0.12)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {' '}
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                color: '#2D3748', // Dark text for medical
                mr: 2,
                display: { md: 'none' },
                background: 'rgba(74, 144, 226, 0.1)',
                '&:hover': {
                  background: 'rgba(74, 144, 226, 0.2)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>{' '}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: '#2D3748', // Dark text for medical
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical gradient
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {getPageTitle()}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#718096' }} // Medical gray text
              >
                {selectedMenuItem === 'profile'
                  ? 'Quản lý thông tin cá nhân'
                  : 'Tổng quan hoạt động'}
              </Typography>
            </Box>
          </Box>{' '}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="Đang hoạt động"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #2ECC71)', // Medical green
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.25)',
              }}
            />
          </Box>
        </Box>{' '}
        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>{renderContent()}</Box>
      </MainContent>
    </Box>
  );
};

export default ConsultantProfile;

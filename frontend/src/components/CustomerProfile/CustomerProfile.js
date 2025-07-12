/**
 * CustomerProfile.js - Component chính quản lý toàn bộ hệ thống hồ sơ khách hàng
 *
 * Mục đích:
 * - Component container chính cho tất cả các trang con của khách hàng
 * - Quản lý state navigation giữa các tab/menu items
 * - Cung cấp layout responsive với sidebar có thể thu gọn
 * - Xử lý hiển thị nội dung động dựa trên menu được chọn
 *
 * Kiến trúc:
 * - Sử dụng React Hooks (useState) để quản lý state
 * - Responsive design với Material-UI breakpoints
 * - Tab-based navigation system (không sử dụng React Router)
 * - Glass morphism design với gradient backgrounds
 *
 * State Management:
 * - sidebarOpen: Kiểm soát việc mở/đóng sidebar (responsive)
 * - selectedMenuItem: Xác định tab nào đang được chọn
 *
 * Navigation Flow:
 * CustomerProfile → CustomerSidebar → Content Components
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import ProfileContent from '@/components/siderBar/ProfileContent';
import AppointmentsContent from '@/components/CustomerProfile/AppointmentsContent';
import MedicalHistoryContent from '@/components/siderBar/MedicalHistoryContent';
import PaymentHistoryContent from '@/components/CustomerProfile/PaymentHistoryContent';
import InvoicesContent from '@/components/siderBar/InvoicesContent';
import NotificationsContent from '@/components/CustomerProfile/NotificationsContent';
import HelpContent from '@/components/CustomerProfile/HelpContent';
import QuestionsContent from '@/components/CustomerProfile/QuestionsContent';
import ReviewsContent from '@/components/CustomerProfile/ReviewsContent';
import SecurityContent from '@/components/siderBar/SecurityContent';
import PaymentMethodsSection from './PaymentMethodsSection';
import BlogCustomerContent from '../siderBar/BlogCustomerContent';

// Styled component cho nội dung chính
// Tự động điều chỉnh margin dựa trên trạng thái sidebar
// Responsive: trên mobile sidebar sẽ overlay thay vì push content
const MainContent = styled(Box)(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: sidebarOpen ? 0 : `-280px`, // Sidebar width: 280px
  [theme.breakpoints.down('md')]: {
    marginLeft: 0, // Mobile: không có margin
  },
}));

const CustomerProfile = () => {
  // Hook để detect responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Mặc định mở trên desktop, đóng trên mobile
  const [selectedMenuItem, setSelectedMenuItem] = useState('profile'); // Tab mặc định
  const user = localStorageUtil.get('userProfile')?.data || {};

  // Effect để xử lý initial tab selection từ navigation state
  useEffect(() => {
    if (location.state?.initialTab) {
      setSelectedMenuItem(location.state.initialTab);
    }
  }, [location.state]);

  // Handler functions
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemSelect = (itemId) => {
    setSelectedMenuItem(itemId);
  }; // Hàm render nội dung động dựa trên menu item được chọn
  // Đây là core logic của tab navigation system
  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'profile':
        return <ProfileContent />; // Thông tin cá nhân
      case 'customer-appointments':
      case 'appointments':
        return <AppointmentsContent />; // Quản lý lịch hẹn
      // case 'customer-dashboard':
      // case 'dashboard':
      //   return <DashboardContent />; // Tổng quan, thống kê
      case 'medical-history':
        return <MedicalHistoryContent />; // Lịch sử khám bệnh
      case 'payment-history':
        return <PaymentHistoryContent />; // Lịch sử thanh toán
      case 'invoices':
        return <InvoicesContent />; // Hóa đơn
      case 'notifications':
        return <NotificationsContent />; // Thông báo
      case 'help':
        return <HelpContent />; // Hỗ trợ, FAQ
      case 'questions':
        return <QuestionsContent />; // Câu hỏi đã đặt
      case 'reviews':
        return <ReviewsContent />; // Đánh giá dịch vụ
      case 'security':
        return <SecurityContent />; // Bảo mật
      case 'payment-methods':
        return <PaymentMethodsSection />;
      case 'my-reviews':
        return <ReviewsContent />;
      case 'blog-customer':
        return <BlogCustomerContent />;
      default:
        return <ProfileContent />; // Fallback về profile
    }
  };

  return (
    // Container chính với full height và dark gradient background
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #F5F7FA 0%, #E3F2FD 50%, #F5F7FA 100%)', // Light medical theme gradient
      }}
    >
      {/* Sidebar Navigation Component */}
      <DynamicSideBar
        open={sidebarOpen} // Trạng thái mở/đóng
        onClose={() => setSidebarOpen(false)} // Callback để đóng sidebar (mobile)
        selectedItem={selectedMenuItem} // Menu item hiện tại
        onItemSelect={handleMenuItemSelect} // Callback khi chọn menu
        user={user}
      />

      {/* Main Content Area */}
      <MainContent sidebarOpen={sidebarOpen}>
        {/* Header Section với glass morphism effect */}{' '}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            background: 'rgba(255, 255, 255, 0.90)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(74, 144, 226, 0.15)', // Medical blue border
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {' '}
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                color: '#2D3748',
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
            <Typography
              variant="h4"
              sx={{
                color: '#2D3748',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {selectedMenuItem === 'profile' && 'Hồ sơ cá nhân'}
              {(selectedMenuItem === 'customer-appointments' ||
                selectedMenuItem === 'appointments') &&
                'Lịch hẹn'}
              {selectedMenuItem === 'medical-history' && 'Lịch sử khám'}
              {selectedMenuItem === 'payment-history' && 'Lịch sử thanh toán'}
              {selectedMenuItem === 'invoices' && 'Hóa đơn'}{' '}
              {selectedMenuItem === 'notifications' && 'Thông báo'}
              {selectedMenuItem === 'settings' && 'Cài đặt'}
              {selectedMenuItem === 'help' && 'Trợ giúp'}
              {selectedMenuItem === 'questions' && 'Câu hỏi đã đặt'}
              {selectedMenuItem === 'reviews' && 'Đánh giá dịch vụ'}
              {selectedMenuItem === 'security' && 'Bảo mật'}
              {selectedMenuItem === 'myBlogs' && 'Đánh giá của tôi'}
              {selectedMenuItem === 'invoices' && 'Hóa đơn'}
              {selectedMenuItem === 'security' && 'Bảo mật tài khoản'}
            </Typography>
          </Box>{' '}
          <Chip
            label="Đã xác thực"
            color="success"
            size="small"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #2ECC71)', // Medical green
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.25)',
            }}
          />
        </Box>{' '}
        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>{renderContent()}</Box>
      </MainContent>
    </Box>
  );
};

export default CustomerProfile;

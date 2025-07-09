/**
 * StaffProfile.js - Staff Dashboard Component
 *
 * Mục đích:
 * - Component container chính cho tất cả các trang con của staff
 * - Quản lý state navigation giữa các tab/menu items
 * - Cung cấp layout responsive với sidebar có thể thu gọn
 * - Xử lý hiển thị nội dung động dựa trên menu được chọn
 *
 * Kiến trúc:
 * - Sử dụng React Hooks (useState) để quản lý state
 * - Responsive design với Material-UI breakpoints
 * - Tab-based navigation system (không sử dụng React Router)
 * - Medical light theme với gradient backgrounds
 *
 * State Management:
 * - sidebarOpen: Kiểm soát việc mở/đóng sidebar (responsive)
 * - selectedMenuItem: Xác định tab nào đang được chọn
 *
 * Navigation Flow:
 * StaffProfile → StaffSidebar → Content Components
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
import QuestionResponseContent from './QuestionResponseContent';
import STIServiceManagementContent from './STIServiceManagementContent';
import STITestManagementContent from './STITestManagementContent';
import STIPackageManagementContent from './STIPackageManagementContent';
import BlogManagementContent from './BlogManagementContent';
import ReviewManagementContent from './ReviewManagementContent';
import ProfileContent from '@/components/siderBar/ProfileContent';
import CategoryManagementContent from './CategoryManagementContent';
import SecurityContent from '../siderBar/SecurityContent';
import MedicalHistoryContent from '../siderBar/MedicalHistoryContent';
import InvoicesContent from '../siderBar/InvoicesContent';
import MyBlogPage from '../siderBar/MyBlogPage';

// Styled component cho nội dung chính
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

const StaffProfile = ({ user = {} }) => {
  // Hook để detect responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // State management
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Mặc định mở trên desktop, đóng trên mobile
  const [selectedMenuItem, setSelectedMenuItem] = useState('profile'); // Mặc định hiển thị hồ sơ cá nhân
  const userData = localStorageUtil.get('userProfile')?.data || {};

  // Handler functions
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemSelect = (itemId) => {
    setSelectedMenuItem(itemId);
  }; // Hàm render nội dung động dựa trên menu item được chọn
  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'questionResponse':
        return <QuestionResponseContent />;
      case 'stiService':
        return <STIServiceManagementContent />;
      case 'stiTest':
        return <STITestManagementContent />;
      case 'stiPackage':
        return <STIPackageManagementContent />;
      case 'blog':
        return <BlogManagementContent />;
      case 'review':
        return <ReviewManagementContent />;
      case 'profile':
        return <ProfileContent />;
      case 'categoryManagement':
        return <CategoryManagementContent />;
      case 'security':
        return <SecurityContent />;
      case 'medical-history':
        return <MedicalHistoryContent />;
      case 'invoices':
        return <InvoicesContent />;
      case 'myBlogs':
        return <MyBlogPage />; // Blog của tôi
      default:
        return <ProfileContent />;
    }
  }; // Hàm để lấy tiêu đề trang dựa trên menu item
  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case 'questionResponse':
        return 'Trả lời câu hỏi';
      case 'stiService':
        return 'Quản lý dịch vụ STI';
      case 'stiTest':
        return 'Quản lý STI Test';
      case 'stiPackage':
        return 'Quản lý STI Packages';
      case 'blog':
        return 'Quản lý Blog';
      case 'review':
        return 'Quản lý đánh giá';
      case 'profile':
        return 'Hồ sơ cá nhân';
      case 'categoryManagement':
        return 'Quản lý danh mục';
      case 'myBlogs':
        return 'Blog của tôi';
      default:
        return 'Hồ sơ cá nhân';
    }
  };

  return (
    // Container chính với medical background gradient
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 30%, #f5fafe 70%, #ffffff 100%)', // Medical light gradient
      }}
    >
      {/* Sidebar Navigation Component */}
      <DynamicSideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedMenuItem}
        onItemSelect={handleMenuItemSelect}
        user={userData}
      />

      {/* Main Content Area */}
      <MainContent sidebarOpen={sidebarOpen}>
        {/* Header Section với medical glass effect */}
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
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                mr: 2,
                color: '#2D3748',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Page title với medical styling */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#2D3748',
                background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical gradient
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {getPageTitle()}
            </Typography>
          </Box>

          <Chip
            label="Nhân viên"
            size="small"
            sx={{
              background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)', // Medical gradient
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.25)',
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>{renderContent()}</Box>
      </MainContent>
    </Box>
  );
};

export default StaffProfile;

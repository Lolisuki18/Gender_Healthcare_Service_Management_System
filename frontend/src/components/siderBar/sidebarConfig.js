import {
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Reply as ReplyIcon,
  Badge as BadgeIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  Help as HelpIcon,
  Lock as LockIcon,
  Payment as PaymentIcon,
  HelpOutline as HelpOutlineIcon,
  Article as BlogIcon,
  RateReview as RateReviewIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  // Blog icon có thể cần import từ @mui/icons-material nếu có
} from '@mui/icons-material';

export const sidebarMenuConfig = [
  // ADMIN
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: <DashboardIcon />,
    roles: ['ADMIN'],
  },
  {
    id: 'users',
    label: 'Quản lý người dùng',
    icon: <ManageAccountsIcon />,
    roles: ['ADMIN'],
  },
  {
    id: 'services',
    label: 'Quản lý dịch vụ',
    icon: <HospitalIcon />,
    roles: ['ADMIN'],
  },
  {
    id: 'appointments',
    label: 'Quản lý lịch hẹn',
    icon: <CalendarIcon />,
    roles: ['ADMIN'],
  },
  {
    id: 'reports',
    label: 'Báo cáo & Thống kê',
    icon: <AnalyticsIcon />,
    roles: ['ADMIN'],
  },
  {
    id: 'settings',
    label: 'Cài đặt hệ thống',
    icon: <SettingsIcon />,
    roles: ['ADMIN'],
  },
  // ... existing code ...
  {
    id: 'admin-blog',
    label: 'Quản lý Blog',
    icon: <BlogIcon />, // Blog icon from @mui/icons-material
    roles: ['ADMIN'],
  },
  // ... existing code ...
  // STAFF
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: <PersonIcon />,
    roles: ['STAFF', 'CONSULTANT', 'CUSTOMER'],
  },
  {
    id: 'security',
    label: 'Bảo mật',
    icon: <LockIcon />,
    roles: ['CONSULTANT', 'CUSTOMER', 'STAFF'],
  },

  {
    id: 'questionResponse',
    label: 'Xác nhận câu hỏi',
    icon: <ReplyIcon />,
    roles: ['STAFF'],
  },
  {
    id: 'stiService',
    label: 'Quản lý dịch vụ STI',
    icon: <HospitalIcon />,
    roles: ['STAFF'],
  },
  {
    id: 'stiTest',
    label: 'Quản lý STI Test',
    icon: <BadgeIcon />,
    roles: ['STAFF'],
  },
  {
    id: 'stiPackage',
    label: 'Quản lý STI Packages',
    icon: <CalendarIcon />,
    roles: ['STAFF'],
  },
  {
    id: 'blog',
    label: 'Quản lý Blog',
    icon: <SettingsIcon />,
    roles: ['STAFF'],
  },

  {
    id: 'review',
    label: 'Quản lý đánh giá',
    icon: <StarIcon />,
    roles: ['STAFF'],
  },
  {
    id: 'categoryManagement',
    label: 'Quản lý danh mục',
    icon: <SettingsIcon />,
    roles: ['STAFF'],
  },

  // CONSULTANT
  {
    id: 'my-questions',
    label: 'Câu hỏi của tôi',
    icon: <HelpIcon />,
    roles: ['CONSULTANT'],
  },
  {
    id: 'my-consultations',
    label: 'Lịch tư vấn của tôi',
    icon: <CalendarIcon />,
    roles: ['CONSULTANT'],
  },
  {
    id: 'sti-tests',
    label: 'Quản lý STI Tests',
    icon: <BadgeIcon />,
    roles: ['CONSULTANT'],
  },
  // CUSTOMER
  // {
  //   id: 'customer-dashboard',
  //   label: 'Tổng quan',
  //   icon: <DashboardIcon />,
  //   roles: ['CUSTOMER'],
  // },
  {
    id: 'customer-appointments',
    label: 'Lịch hẹn',
    icon: <CalendarIcon />,
    roles: ['CUSTOMER'],
  },
  {
    id: 'medical-history',
    label: 'Lịch sử khám',
    icon: <AnalyticsIcon />,
    roles: ['CUSTOMER', 'STAFF', 'CONSULTANT'],
  },
  {
    id: 'invoices',
    label: 'Hóa đơn',
    icon: <PaymentIcon />,
    roles: ['CUSTOMER', 'STAFF', 'CONSULTANT'],
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    icon: <NotificationsIcon />,
    roles: ['CUSTOMER'],
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: <HelpIcon />,
    roles: ['CUSTOMER'],
  },
  {
    id: 'questions',
    label: 'Câu hỏi đã đặt',
    icon: <HelpOutlineIcon />,
    roles: ['CUSTOMER'],
  },

  //   {
  //     id: 'payment-history',
  //     label: 'Lịch sử thanh toán',
  //     icon: <PaymentIcon />,
  //     roles: ['CUSTOMER'],
  //   },
  //Dùng chung
  {
    id: 'my-reviews',
    label: 'Đánh giá của tôi',
    icon: <RateReviewIcon />,
    roles: ['STAFF', 'CONSULTANT', 'CUSTOMER'],
  },
  {
    id: 'blog-customer',
    label: 'Blog của tôi',
    icon: <BlogIcon />,
    roles: ['STAFF', 'CONSULTANT', 'CUSTOMER'],
  },
];

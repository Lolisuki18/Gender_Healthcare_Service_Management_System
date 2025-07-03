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

  // STAFF
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: <PersonIcon />,
    roles: ['STAFF', 'CONSULTANT', 'CUSTOMER'],
  },
  {
    id: 'questionResponse',
    label: 'Trả lời câu hỏi',
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
    roles: ['STAFF', 'CONSULTANT', 'CUSTOMER'],
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
  {
    id: 'my-reviews',
    label: 'Đánh giá của tôi',
    icon: <StarIcon />,
    roles: ['CONSULTANT'],
  },
  {
    id: 'security',
    label: 'Bảo mật',
    icon: <LockIcon />,
    roles: ['CONSULTANT', 'CUSTOMER'],
  },

  // CUSTOMER
  {
    id: 'appointments',
    label: 'Lịch hẹn',
    icon: <CalendarIcon />,
    roles: ['CUSTOMER'],
  },
  {
    id: 'medical-history',
    label: 'Lịch sử khám',
    icon: <AnalyticsIcon />,
    roles: ['CUSTOMER'],
  },
  {
    id: 'invoices',
    label: 'Hóa đơn',
    icon: <SettingsIcon />,
    roles: ['CUSTOMER'],
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
];

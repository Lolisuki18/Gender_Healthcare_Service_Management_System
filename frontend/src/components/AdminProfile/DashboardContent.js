/**
 * DashboardContent.js - Admin Dashboard Overview
 *
 * Trang tổng quan dành cho Admin với thống kê tổng thể về hệ thống
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  PersonAdd as PersonAddIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { adminService } from '@/services/adminService';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <Card
    sx={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: 4,
      minHeight: '180px',
      width: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05)',
        borderColor: color,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
      },
    }}
  >
    <CardContent
      sx={{
        p: 3,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color}15, ${color}30)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            border: `2px solid ${color}20`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color: color, fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1a202c',
              lineHeight: 1.1,
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
              lineHeight: 1.3,
              wordBreak: 'break-word',
              hyphens: 'auto',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 'auto' }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: change?.includes('+')
              ? '#10b981'
              : change?.includes('-')
                ? '#ef4444'
                : '#64748b',
            flexShrink: 0,
            mt: 0.5,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: change?.includes('+')
              ? '#10b981'
              : change?.includes('-')
                ? '#ef4444'
                : '#64748b',
            fontWeight: 600,
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            lineHeight: 1.2,
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {change}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const DashboardContent = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    activeStaffs: 0,
    activePatients: 0,
    totalConsultations: 0,
    todayConsultations: 0,
    activeServices: 0,
    serviceStatusInfo: '0/0 dịch vụ hoạt động',
    unansweredQuestions: 0,
    answeredQuestions: 0,
    userGrowthRate: '0%',
    doctorGrowthRate: '0%',
    consultationGrowthRate: '0%',
    serviceGrowthRate: '0%',
    consultationsThisMonth: 0,
    consultationsThisMonthGrowth: '+0%',
  });

  // Mock data for tables only (will be replaced with real data)

  const quickActions = [
    {
      id: 'add-user',
      title: 'Thêm người dùng mới',
      subtitle: 'Tạo tài khoản người dùng',
      icon: PersonAddIcon,
      color: '#4A90E2',
    },
    {
      id: 'services',
      title: 'Quản lý dịch vụ',
      subtitle: 'Quản lý dịch vụ y tế',
      icon: MedicalIcon,
      color: '#00C9A7',
    },
    {
      id: 'appointments',
      title: 'Quản lý lịch hẹn',
      subtitle: 'Xem và quản lý lịch hẹn',
      icon: CalendarIcon,
      color: '#7B61FF',
    },
    {
      id: 'reports',
      title: 'Báo cáo & Thống kê',
      subtitle: 'Phân tích dữ liệu',
      icon: AssessmentIcon,
      color: '#FF6F61',
    },
    {
      id: 'settings',
      title: 'Cài đặt hệ thống',
      subtitle: 'Quản lý cấu hình',
      icon: SettingsIcon,
      color: '#6C757D',
    },
    {
      id: 'admin-blog',
      title: 'Quản lý Blog',
      subtitle: 'Quản lý nội dung blog',
      icon: ArticleIcon,
      color: '#E91E63',
    },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy dữ liệu dashboard overview
        const dashboardResponse = await adminService.getDashboardOverview();
        console.log('Dashboard data:', dashboardResponse);

        // Lấy danh sách tất cả người dùng để tính toán tỉ lệ tăng trưởng
        const usersResponse = await adminService.getAllUsers();
        console.log('Users data:', usersResponse);

        // Lấy danh sách dịch vụ STI còn hoạt động
        const activeSTIServicesResponse =
          await adminService.getActiveSTIServices();
        console.log('Active STI services data:', activeSTIServicesResponse);

        // Lấy tất cả dịch vụ STI để tính tổng
        const allSTIServicesResponse = await adminService.getAllSTIServices();
        console.log('All STI services data:', allSTIServicesResponse);

        // Lấy tất cả STI tests để tính tổng completed
        const allSTITestsResponse = await adminService.getAllSTITests();
        console.log('All STI tests data:', allSTITestsResponse);

        // Lấy tất cả consultations để tính tổng completed
        const allConsultationsResponse =
          await adminService.getAllConsultations();
        console.log('All consultations data:', allConsultationsResponse);

        // Tính toán tỉ lệ tăng trưởng thực tế
        const calculateUserGrowthRate = (users) => {
          if (!users || !Array.isArray(users)) return '+0%';

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // Đếm người dùng tháng hiện tại
          const currentMonthUsers = users.filter((user) => {
            if (!user.createdDate) return false;
            const createdDate = new Date(user.createdDate);
            return (
              createdDate.getMonth() === currentMonth &&
              createdDate.getFullYear() === currentYear
            );
          }).length;

          // Đếm tổng người dùng đến cuối tháng trước (không bao gồm tháng này)
          const usersBeforeThisMonth = users.filter((user) => {
            if (!user.createdDate) return false;
            const createdDate = new Date(user.createdDate);
            return createdDate < new Date(currentYear, currentMonth, 1);
          }).length;

          // Tính tỉ lệ tăng trưởng
          if (usersBeforeThisMonth === 0) {
            return currentMonthUsers > 0 ? '+100%' : '+0%';
          }

          const growthRate = (
            (currentMonthUsers / usersBeforeThisMonth) *
            100
          ).toFixed(1);
          return growthRate > 0 ? `+${growthRate}%` : `${growthRate}%`;
        };

        // Tính toán tỉ lệ tăng trưởng dịch vụ STI dựa trên createdAt
        const calculateSTIServiceGrowthRate = (services) => {
          if (!services || !Array.isArray(services)) return '+0%';

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // Đếm dịch vụ tạo trong tháng hiện tại
          const currentMonthServices = services.filter((service) => {
            if (!service.createdAt) return false;
            const createdDate = new Date(service.createdAt);
            return (
              createdDate.getMonth() === currentMonth &&
              createdDate.getFullYear() === currentYear
            );
          }).length;

          // Đếm tổng dịch vụ đến cuối tháng trước (không bao gồm tháng này)
          const servicesBeforeThisMonth = services.filter((service) => {
            if (!service.createdAt) return false;
            const createdDate = new Date(service.createdAt);
            return createdDate < new Date(currentYear, currentMonth, 1);
          }).length;

          // Tính tỉ lệ tăng trưởng
          if (servicesBeforeThisMonth === 0) {
            return currentMonthServices > 0 ? '+100%' : '+0%';
          }

          const growthRate = (
            (currentMonthServices / servicesBeforeThisMonth) *
            100
          ).toFixed(1);
          return growthRate > 0 ? `+${growthRate}%` : `${growthRate}%`;
        };

        // Tính toán tỉ lệ tăng trưởng cho lịch hẹn hoàn thành (STI tests + consultations)
        const calculateCompletedAppointmentsGrowthRate = (
          stiTests,
          consultations
        ) => {
          if (
            (!stiTests || !Array.isArray(stiTests)) &&
            (!consultations || !Array.isArray(consultations))
          )
            return '+0%';

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // Lọc STI tests hoàn thành
          const completedSTITests = (stiTests || []).filter(
            (test) => test.status === 'COMPLETED' || test.status === 'completed'
          );

          // Lọc consultations hoàn thành
          const completedConsultations = (consultations || []).filter(
            (consultation) =>
              consultation.status === 'COMPLETED' ||
              consultation.status === 'completed'
          );

          // Đếm appointments hoàn thành trong tháng hiện tại
          const currentMonthCompleted = [
            ...completedSTITests.filter((test) => {
              if (!test.createdAt) return false;
              const createdDate = new Date(test.createdAt);
              return (
                createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear
              );
            }),
            ...completedConsultations.filter((consultation) => {
              if (!consultation.createdAt) return false;
              const createdDate = new Date(consultation.createdAt);
              return (
                createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear
              );
            }),
          ].length;

          // Đếm tổng appointments hoàn thành trong tháng trước
          const appointmentsBeforeThisMonth = [
            ...completedSTITests.filter((test) => {
              if (!test.createdAt) return false;
              const createdDate = new Date(test.createdAt);
              return createdDate < new Date(currentYear, currentMonth, 1);
            }),
            ...completedConsultations.filter((consultation) => {
              if (!consultation.createdAt) return false;
              const createdDate = new Date(consultation.createdAt);
              return createdDate < new Date(currentYear, currentMonth, 1);
            }),
          ].length;

          // Tính tỉ lệ tăng trưởng
          if (appointmentsBeforeThisMonth === 0) {
            return currentMonthCompleted > 0 ? '+100%' : '+0%';
          }

          const growthRate = (
            (currentMonthCompleted / appointmentsBeforeThisMonth) *
            100
          ).toFixed(1);
          return growthRate > 0 ? `+${growthRate}%` : `${growthRate}%`;
        };

        // Tính toán thống kê theo tháng cho biểu đồ
        const calculateMonthlyStats = (users, stiTests, consultations) => {
          const monthlyData = [];
          const currentYear = new Date().getFullYear();

          // Tạo dữ liệu cho 12 tháng của năm hiện tại
          for (let month = 0; month < 12; month++) {
            // Đếm người dùng được tạo trong tháng này
            const monthUsers = (users || []).filter((user) => {
              if (!user.createdDate) return false;
              const createdDate = new Date(user.createdDate);
              return (
                createdDate.getMonth() === month &&
                createdDate.getFullYear() === currentYear
              );
            }).length;

            // Đếm tổng lịch hẹn (STI tests + consultations) trong tháng này
            const monthSTITests = (stiTests || []).filter((test) => {
              if (!test.createdAt) return false;
              const createdDate = new Date(test.createdAt);
              return (
                createdDate.getMonth() === month &&
                createdDate.getFullYear() === currentYear
              );
            }).length;

            const monthConsultations = (consultations || []).filter(
              (consultation) => {
                if (!consultation.createdAt) return false;
                const createdDate = new Date(consultation.createdAt);
                return (
                  createdDate.getMonth() === month &&
                  createdDate.getFullYear() === currentYear
                );
              }
            ).length;

            const totalAppointments = monthSTITests + monthConsultations;

            monthlyData.push({
              name: `T${month + 1}`,
              users: monthUsers,
              appointments: totalAppointments,
            });
          }

          return monthlyData;
        };

        // Tính toán tỉ lệ tăng giảm cho các metrics khác (mock data vì chưa có API chi tiết)
        const calculateGrowthRate = (current, mockPrevious) => {
          if (mockPrevious === 0) return '+0%';
          const rate = (
            ((current - mockPrevious) / mockPrevious) *
            100
          ).toFixed(1);
          return rate > 0 ? `+${rate}%` : `${rate}%`;
        };

        // Tính tổng dịch vụ STI hoạt động thực tế
        const activeSTIServicesCount =
          activeSTIServicesResponse?.data?.length || 0;
        const totalSTIServicesCount = allSTIServicesResponse?.data?.length || 0;
        console.log('Active STI services count:', activeSTIServicesCount);
        console.log('Total STI services count:', totalSTIServicesCount);

        // Tạo thông tin dịch vụ hoạt động
        const serviceStatusInfo = `${activeSTIServicesCount}/${totalSTIServicesCount} dịch vụ hoạt động`;

        // Tính tỉ lệ tăng trưởng dịch vụ STI thực tế
        const realSTIServiceGrowthRate = calculateSTIServiceGrowthRate(
          activeSTIServicesResponse?.data || []
        );

        // Mock dữ liệu tháng trước cho các metrics khác
        const mockPreviousMonth = {
          activeDoctors: Math.floor(
            (dashboardResponse?.activeDoctors || 0) * 0.95
          ),
          totalConsultations: Math.floor(
            (dashboardResponse?.totalConsultations || 0) * 0.88
          ),
        };

        // Tính tỉ lệ tăng trưởng người dùng thực tế
        const realUserGrowthRate = calculateUserGrowthRate(
          usersResponse?.data || []
        );

        // Tính tổng appointments hoàn thành
        const completedAppointments = [
          ...(allSTITestsResponse?.data || []).filter(
            (test) => test.status === 'COMPLETED' || test.status === 'completed'
          ),
          ...(allConsultationsResponse?.data || []).filter(
            (consultation) =>
              consultation.status === 'COMPLETED' ||
              consultation.status === 'completed'
          ),
        ].length;

        // Tính tỉ lệ tăng trưởng appointments hoàn thành
        const appointmentsGrowthRate = calculateCompletedAppointmentsGrowthRate(
          allSTITestsResponse?.data || [],
          allConsultationsResponse?.data || []
        );

        // Tính toán dữ liệu thống kê theo tháng cho biểu đồ
        const monthlyStatsData = calculateMonthlyStats(
          usersResponse?.data || [],
          allSTITestsResponse?.data || [],
          allConsultationsResponse?.data || []
        );

        // Xử lý dữ liệu người dùng gần đây (5 người mới nhất)
        const processRecentUsers = (users) => {
          if (!users || !Array.isArray(users)) return [];

          const sortedUsers = users
            .sort(
              (a, b) =>
                new Date(b.createdDate || 0) - new Date(a.createdDate || 0)
            )
            .slice(0, 5)
            .map((user) => ({
              id: user.id,
              name: user.fullName || user.username || 'N/A',
              email: user.email || 'N/A',
              role:
                user.role === 'ADMIN'
                  ? 'Quản lý'
                  : user.role === 'DOCTOR'
                    ? 'Tư vấn viên'
                    : user.role === 'STAFF'
                      ? 'Nhân viên'
                      : 'Khách hàng',
              status:
                user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động',
              lastAccess: formatTimeAgo(user.lastLoginTime || user.createdDate),
              avatar: (user.fullName || user.username || 'U')
                .charAt(0)
                .toUpperCase(),
            }));

          return sortedUsers;
        };

        // Hàm format thời gian ago
        const formatTimeAgo = (dateString) => {
          if (!dateString) return 'Chưa xác định';

          const date = new Date(dateString);
          const now = new Date();
          const diffMs = now - date;
          const diffMins = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (diffMins < 60) return `${diffMins} phút trước`;
          if (diffHours < 24) return `${diffHours} giờ trước`;
          if (diffDays < 7) return `${diffDays} ngày trước`;
          return `${Math.floor(diffDays / 7)} tuần trước`;
        };

        // Xử lý dữ liệu thực
        const processedRecentUsers = processRecentUsers(
          usersResponse?.data || []
        );

        // Hàm tính số lượng lịch hẹn tạo trong tháng này và tháng trước
        const getConsultationsMonthStats = (consultations) => {
          if (!consultations || !Array.isArray(consultations))
            return { thisMonth: 0, lastMonth: 0 };
          const now = new Date();
          const currentMonth = now.getMonth() + 1; // JS: 0-11, API: 1-12
          const currentYear = now.getFullYear();
          const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const lastMonthYear =
            currentMonth === 1 ? currentYear - 1 : currentYear;
          let thisMonthCount = 0;
          let lastMonthCount = 0;
          consultations.forEach((c) => {
            if (!c.createdAt || !Array.isArray(c.createdAt)) return;
            const [year, month] = c.createdAt;
            if (year === currentYear && month === currentMonth)
              thisMonthCount++;
            if (year === lastMonthYear && month === lastMonth) lastMonthCount++;
          });
          return { thisMonth: thisMonthCount, lastMonth: lastMonthCount };
        };

        // Xử lý dữ liệu từ API
        setDashboardData({
          totalUsers: dashboardResponse?.totalUsers || 0,
          activeDoctors: dashboardResponse?.activeDoctors || 0,
          activeStaffs: dashboardResponse?.activeStaffs || 0,
          activePatients: dashboardResponse?.activePatients || 0,
          totalConsultations: dashboardResponse?.totalConsultations || 0,
          todayConsultations: dashboardResponse?.todayConsultations || 0,
          activeServices: activeSTIServicesCount, // Sử dụng dữ liệu dịch vụ STI thực tế
          serviceStatusInfo: serviceStatusInfo, // Thông tin trạng thái dịch vụ
          unansweredQuestions: dashboardResponse?.unansweredQuestions || 0,
          answeredQuestions: dashboardResponse?.answeredQuestions || 0,
          // Tỉ lệ tăng trưởng thực tế cho người dùng
          userGrowthRate: realUserGrowthRate,
          // Tổng appointments hoàn thành và tỉ lệ tăng trưởng
          totalAppointments: completedAppointments,
          appointmentsGrowthRate: appointmentsGrowthRate,
          // Mock data cho các metrics khác
          doctorGrowthRate: calculateGrowthRate(
            dashboardResponse?.activeDoctors || 0,
            mockPreviousMonth.activeDoctors
          ),
          consultationGrowthRate: calculateGrowthRate(
            dashboardResponse?.totalConsultations || 0,
            mockPreviousMonth.totalConsultations
          ),
          serviceGrowthRate: realSTIServiceGrowthRate, // Sử dụng tỉ lệ tăng trưởng dịch vụ STI thực tế
          consultationsThisMonth: getConsultationsMonthStats(
            allConsultationsResponse?.data || []
          ).thisMonth,
          consultationsThisMonthGrowth: getConsultationsMonthStats(
            allConsultationsResponse?.data || []
          ).thisMonthGrowth,
        });

        // Cập nhật dữ liệu thống kê theo tháng
        setMonthlyData(monthlyStatsData);

        // Cập nhật dữ liệu người dùng gần đây
        setRecentUsers(processedRecentUsers);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Lỗi khi tải tổng quan hệ thống');
        // Fallback to demo data if API fails
        setDashboardData({
          totalUsers: 2847,
          activeDoctors: 156,
          activeStaffs: 89,
          activePatients: 2602,
          totalConsultations: 1205,
          todayConsultations: 24,
          activeServices: 18,
          serviceStatusInfo: '18/25 dịch vụ hoạt động',
          unansweredQuestions: 45,
          answeredQuestions: 892,
          totalAppointments: 856, // Mock data cho tổng appointments hoàn thành
          appointmentsGrowthRate: '+8.7%', // Mock data cho tỉ lệ tăng trưởng appointments
          userGrowthRate: '+12.5%',
          doctorGrowthRate: '+8.2%',
          consultationGrowthRate: '+15.3%',
          serviceGrowthRate: '+2.1%',
          consultationsThisMonth: 18,
          consultationsThisMonthGrowth: '+8.7%',
        });

        // Fallback monthly data
        setMonthlyData([
          { name: 'T1', users: 45, appointments: 32 },
          { name: 'T2', users: 52, appointments: 41 },
          { name: 'T3', users: 61, appointments: 38 },
          { name: 'T4', users: 58, appointments: 47 },
          { name: 'T5', users: 67, appointments: 52 },
          { name: 'T6', users: 74, appointments: 59 },
          { name: 'T7', users: 82, appointments: 61 },
          { name: 'T8', users: 89, appointments: 68 },
          { name: 'T9', users: 94, appointments: 72 },
          { name: 'T10', users: 101, appointments: 79 },
          { name: 'T11', users: 108, appointments: 84 },
          { name: 'T12', users: 115, appointments: 91 },
        ]);

        // Fallback recent users data
        setRecentUsers([
          {
            id: 1,
            name: 'Nguyễn Thị Mai',
            email: 'mai.nguyen@email.com',
            role: 'Khách hàng',
            status: 'Hoạt động',
            lastAccess: '2 giờ trước',
            avatar: 'M',
          },
          {
            id: 2,
            name: 'Trần Văn Nam',
            email: 'nam.tran@email.com',
            role: 'Tư vấn viên',
            status: 'Hoạt động',
            lastAccess: '1 ngày trước',
            avatar: 'N',
          },
          {
            id: 3,
            name: 'Lê Thị Hoa',
            email: 'hoa.le@email.com',
            role: 'Khách hàng',
            status: 'Không hoạt động',
            lastAccess: '1 tuần trước',
            avatar: 'H',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Đang tải tổng quan...
        </Typography>
        <Box sx={{ width: '100%', mb: 4 }}>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} lg={3} key={item}>
                <Card sx={{ minHeight: '180px', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: '#f0f0f0',
                        borderRadius: 3,
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 24,
                          bgcolor: '#f0f0f0',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 16,
                          bgcolor: '#f0f0f0',
                          borderRadius: 1,
                          width: '60%',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: 12,
                      bgcolor: '#f0f0f0',
                      borderRadius: 1,
                      width: '80%',
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Box
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          Lỗi tải dữ liệu
        </Typography>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: '#1a202c',
            mb: 1,
            background: 'linear-gradient(45deg, #4A90E2, #00C9A7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tổng quan hệ thống
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#64748b',
            fontWeight: 400,
          }}
        >
          Đây là trang tổng quan về hệ thống chăm sóc sức khỏe của bạn.
        </Typography>
      </Box>

      {/* Stats Cards - Top Row */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item size={3} xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Tổng người dùng"
              value={(dashboardData.totalUsers || 0).toLocaleString()}
              change={`${dashboardData.userGrowthRate || '+0%'} so với tháng trước`}
              icon={PeopleIcon}
              color="#4A90E2"
            />
          </Grid>
          <Grid item size={3} xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Tư vấn viên"
              value={(dashboardData.activeDoctors || 0).toLocaleString()}
              change={`${dashboardData.doctorGrowthRate || '+0%'} so với tháng trước`}
              icon={GroupAddIcon}
              color="#00C9A7"
            />
          </Grid>
          <Grid item size={3} xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
            <Tooltip
              title="Tổng số lịch hẹn được tạo mới trong tháng này. Tỷ lệ tăng trưởng so với tháng trước."
              arrow
            >
              <Box sx={{ width: '100%' }}>
                <StatCard
                  title="Lịch hẹn tháng này"
                  value={(
                    dashboardData.consultationsThisMonth || 0
                  ).toLocaleString()}
                  change={`${dashboardData.consultationsThisMonthGrowth || '+0%'} so với tháng trước`}
                  icon={CalendarIcon}
                  color="#FF9800"
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item size={3} xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
            <StatCard
              title="Dịch vụ hoạt động"
              value={(dashboardData.activeServices || 0).toLocaleString()}
              change={
                dashboardData.serviceStatusInfo || '0/0 dịch vụ hoạt động'
              }
              icon={LocalHospitalIcon}
              color="#E91E63"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 4,
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        }}
      >
        {/* Chart Section */}
        <Box
          sx={{
            flex: { xs: '1', sm: '1', md: '2' }, // 2/3 = 66.67%
            minWidth: 0, // Prevent overflow
          }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              p: 3,
              height: '610px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 700, color: '#1a202c' }}
            >
              📊 Thống kê theo tháng (Năm {new Date().getFullYear()})
            </Typography>
            <Box sx={{ height: '530px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} width="100%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar
                    dataKey="users"
                    fill="#4A90E2"
                    name="Người dùng mới"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="appointments"
                    fill="#E91E63"
                    name="Lịch hẹn"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>

        {/* Quick Actions Panel */}
        <Box
          sx={{
            flex: { xs: '1', sm: '1', md: '1' }, // 1/3 = 33.33%
            minWidth: 0, // Prevent overflow
          }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              p: 3,
              height: '610px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              width: '100%',
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 700, color: '#1a202c' }}
            >
              ⚡ Thao tác nhanh
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Card
                  onClick={() => onNavigate && onNavigate(quickActions[0].id)}
                  sx={{
                    flex: 1,
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '120px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      borderColor: quickActions[0].color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${quickActions[0].color}15, ${quickActions[0].color}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        border: `2px solid ${quickActions[0].color}20`,
                      }}
                    >
                      <PersonAddIcon
                        sx={{ color: quickActions[0].color, fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#1a202c',
                        mb: 0.5,
                      }}
                    >
                      {quickActions[0].title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                      {quickActions[0].subtitle}
                    </Typography>
                  </Box>
                </Card>
                <Card
                  onClick={() => onNavigate && onNavigate(quickActions[1].id)}
                  sx={{
                    flex: 1,
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '120px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      borderColor: quickActions[1].color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${quickActions[1].color}15, ${quickActions[1].color}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        border: `2px solid ${quickActions[1].color}20`,
                      }}
                    >
                      <MedicalIcon
                        sx={{ color: quickActions[1].color, fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#1a202c',
                        mb: 0.5,
                      }}
                    >
                      {quickActions[1].title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                      {quickActions[1].subtitle}
                    </Typography>
                  </Box>
                </Card>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Card
                  onClick={() => onNavigate && onNavigate(quickActions[2].id)}
                  sx={{
                    flex: 1,
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '120px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      borderColor: quickActions[2].color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${quickActions[2].color}15, ${quickActions[2].color}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        border: `2px solid ${quickActions[2].color}20`,
                      }}
                    >
                      <CalendarIcon
                        sx={{ color: quickActions[2].color, fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#1a202c',
                        mb: 0.5,
                      }}
                    >
                      {quickActions[2].title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                      {quickActions[2].subtitle}
                    </Typography>
                  </Box>
                </Card>
                <Card
                  onClick={() => onNavigate && onNavigate(quickActions[3].id)}
                  sx={{
                    flex: 1,
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '120px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      borderColor: quickActions[3].color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${quickActions[3].color}15, ${quickActions[3].color}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        border: `2px solid ${quickActions[3].color}20`,
                      }}
                    >
                      <AssessmentIcon
                        sx={{ color: quickActions[3].color, fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#1a202c',
                        mb: 0.5,
                      }}
                    >
                      {quickActions[3].title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                      {quickActions[3].subtitle}
                    </Typography>
                  </Box>
                </Card>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Card
                  onClick={() => onNavigate && onNavigate(quickActions[4].id)}
                  sx={{
                    flex: 1,
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '120px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      borderColor: quickActions[4].color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${quickActions[4].color}15, ${quickActions[4].color}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        border: `2px solid ${quickActions[4].color}20`,
                      }}
                    >
                      <SettingsIcon
                        sx={{ color: quickActions[4].color, fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#1a202c',
                        mb: 0.5,
                      }}
                    >
                      {quickActions[4].title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                      {quickActions[4].subtitle}
                    </Typography>
                  </Box>
                </Card>
                <Card
                  onClick={() => onNavigate && onNavigate(quickActions[5].id)}
                  sx={{
                    flex: 1,
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    height: '120px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      borderColor: quickActions[5].color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${quickActions[5].color}15, ${quickActions[5].color}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        border: `2px solid ${quickActions[5].color}20`,
                      }}
                    >
                      <ArticleIcon
                        sx={{ color: quickActions[5].color, fontSize: 24 }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#1a202c',
                        mb: 0.5,
                      }}
                    >
                      {quickActions[5].title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                      {quickActions[5].subtitle}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Users Table - Full Width */}
      <Box sx={{ width: '100%' }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            p: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 700, color: '#1a202c' }}
          >
            👥 Người dùng gần đây
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                    }}
                  >
                    NGƯỜI DÙNG
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                    }}
                  >
                    VAI TRÒ
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                    }}
                  >
                    TRẠNG THÁI
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                    }}
                  >
                    TRUY CẬP
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                    }}
                  >
                    THAO TÁC
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            mr: 2,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, #4A90E2, #00C9A7)',
                          }}
                        >
                          {user.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: '#1a202c' }}
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#64748b' }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          backgroundColor:
                            user.role === 'Quản lý'
                              ? '#4A90E2'
                              : user.role === 'Tư vấn viên'
                                ? '#00C9A7'
                                : '#64748b',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor:
                            user.status === 'Hoạt động' ? '#10b981' : '#ef4444',
                          color:
                            user.status === 'Hoạt động' ? '#10b981' : '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ color: '#64748b', fontWeight: 500 }}
                      >
                        {user.lastAccess}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#4A90E2',
                            '&:hover': { backgroundColor: '#4A90E215' },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#00C9A7',
                            '&:hover': { backgroundColor: '#00C9A715' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#ef444415' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              borderColor: '#E91E63',
              color: '#E91E63',
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#E91E63',
                color: '#fff',
              },
            }}
          >
            Xem tất cả người dùng
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardContent;

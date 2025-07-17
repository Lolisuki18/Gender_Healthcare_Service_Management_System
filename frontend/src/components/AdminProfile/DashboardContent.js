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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import blogService from '@/services/blogService';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [allDataCache, setAllDataCache] = useState({
    users: [],
    stiTests: [],
    consultations: [],
    confirmedBlogs: []
  });
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
    confirmedBlogs: 0,
    blogsThisMonth: 0,
    blogsThisMonthGrowth: '+0%',
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
      title: 'Quản lý bài viết',
      subtitle: 'Xem thông tin các bài viết',
      icon: ArticleIcon,
      color: '#E91E63',
    },
  ];

  // Hàm lấy danh sách các năm có sẵn từ dữ liệu
  const getAvailableYears = (users, stiTests, consultations, confirmedBlogs) => {
    const years = new Set();
    
    // Lấy năm từ dữ liệu users
    (users || []).forEach((user) => {
      const dateField = user.createdDate || user.created_date;
      if (dateField) {
        try {
          let year;
          if (Array.isArray(dateField)) {
            [year] = dateField;
          } else {
            year = new Date(dateField).getFullYear();
          }
          if (year && !isNaN(year)) {
            years.add(year);
          }
        } catch (error) {
          console.error('Error parsing user date for year:', error);
        }
      }
    });
    
    // Lấy năm từ dữ liệu STI tests
    (stiTests || []).forEach((test) => {
      if (test.createdAt) {
        try {
          let year;
          if (Array.isArray(test.createdAt)) {
            [year] = test.createdAt;
          } else {
            year = new Date(test.createdAt).getFullYear();
          }
          if (year && !isNaN(year)) {
            years.add(year);
          }
        } catch (error) {
          console.error('Error parsing test date for year:', error);
        }
      }
    });
    
    // Lấy năm từ dữ liệu consultations
    (consultations || []).forEach((consultation) => {
      if (consultation.createdAt) {
        try {
          let year;
          if (Array.isArray(consultation.createdAt)) {
            [year] = consultation.createdAt;
          } else {
            year = new Date(consultation.createdAt).getFullYear();
          }
          if (year && !isNaN(year)) {
            years.add(year);
          }
        } catch (error) {
          console.error('Error parsing consultation date for year:', error);
        }
      }
    });
    
    // Lấy năm từ dữ liệu confirmed blogs
    (confirmedBlogs || []).forEach((blog) => {
      if (blog.createdAt) {
        try {
          let year;
          if (Array.isArray(blog.createdAt)) {
            [year] = blog.createdAt;
          } else {
            year = new Date(blog.createdAt).getFullYear();
          }
          if (year && !isNaN(year)) {
            years.add(year);
          }
        } catch (error) {
          console.error('Error parsing blog date for year:', error);
        }
      }
    });
    
    // Thêm năm hiện tại nếu chưa có
    years.add(new Date().getFullYear());
    
    return Array.from(years).sort((a, b) => b - a); // Sắp xếp giảm dần
  };

  // Hàm xử lý thay đổi năm
  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    setSelectedYear(newYear);
    
    // Tính toán lại dữ liệu biểu đồ với năm mới
    const newMonthlyData = calculateMonthlyStats(
      allDataCache.users,
      allDataCache.stiTests,
      allDataCache.consultations,
      allDataCache.confirmedBlogs,
      newYear
    );
    setMonthlyData(newMonthlyData);
  };

  // Hàm calculateMonthlyStats sẽ được định nghĩa trong useEffect
  const calculateMonthlyStats = (users, stiTests, consultations, confirmedBlogs, year = new Date().getFullYear()) => {
    const monthlyData = [];

    // Tạo dữ liệu cho 12 tháng của năm được chọn
    for (let month = 0; month < 12; month++) {
      // Lọc người dùng được tạo trong tháng này
      const monthUsersFiltered = (users || []).filter((user) => {
        if (!user.createdDate && !user.created_date) return false;
        
        const dateField = user.createdDate || user.created_date;
        
        try {
          let createdDate;
          if (Array.isArray(dateField)) {
            const [userYear, monthNum, day, hour = 0, minute = 0, second = 0] = dateField;
            createdDate = new Date(userYear, monthNum - 1, day, hour, minute, second);
          } else {
            createdDate = new Date(dateField);
          }
          
          return (
            createdDate.getMonth() === month &&
            createdDate.getFullYear() === year
          );
        } catch (error) {
          console.error('Error parsing date in monthly stats:', error);
          return false;
        }
      });

      // Đếm người dùng theo vai trò
      const customers = monthUsersFiltered.filter(user => 
        user.role === 'CUSTOMER' || user.role === 'customer'
      ).length;
      
      const staff = monthUsersFiltered.filter(user => 
        user.role === 'STAFF' || user.role === 'staff'
      ).length;
      
      const consultants = monthUsersFiltered.filter(user => 
        user.role === 'CONSULTANT' || user.role === 'consultant'
      ).length;

      // Đếm blog được xác nhận trong tháng này
      const monthBlogs = (confirmedBlogs || []).filter((blog) => {
        if (!blog.createdAt) return false;
        try {
          let createdDate;
          if (Array.isArray(blog.createdAt)) {
            const [blogYear, monthNum, day, hour = 0, minute = 0, second = 0] = blog.createdAt;
            createdDate = new Date(blogYear, monthNum - 1, day, hour, minute, second);
          } else {
            createdDate = new Date(blog.createdAt);
          }
          
          return (
            createdDate.getMonth() === month &&
            createdDate.getFullYear() === year
          );
        } catch (error) {
          console.error('Error parsing blog date in monthly stats:', error);
          return false;
        }
      }).length;

      // Đếm STI tests đã hoàn thành trong tháng này
      const monthStiTests = (stiTests || []).filter((test) => {
        // Chỉ đếm những test đã hoàn thành
        if (!test.updatedAt || (test.status !== 'COMPLETED' && test.status !== 'completed')) return false;
        try {
          let updatedDate;
          if (Array.isArray(test.updatedAt)) {
            const [testYear, monthNum, day, hour = 0, minute = 0, second = 0] = test.updatedAt;
            updatedDate = new Date(testYear, monthNum - 1, day, hour, minute, second);
          } else {
            updatedDate = new Date(test.updatedAt);
          }
          
          return (
            updatedDate.getMonth() === month &&
            updatedDate.getFullYear() === year
          );
        } catch (error) {
          console.error('Error parsing STI test date in monthly stats:', error);
          return false;
        }
      }).length;

      // Đếm consultations đã hoàn thành trong tháng này
      const monthConsultations = (consultations || []).filter((consultation) => {
        // Chỉ đếm những consultation đã hoàn thành
        if (!consultation.updatedAt || (consultation.status !== 'COMPLETED' && consultation.status !== 'completed')) return false;
        try {
          let updatedDate;
          if (Array.isArray(consultation.updatedAt)) {
            const [consultationYear, monthNum, day, hour = 0, minute = 0, second = 0] = consultation.updatedAt;
            updatedDate = new Date(consultationYear, monthNum - 1, day, hour, minute, second);
          } else {
            updatedDate = new Date(consultation.updatedAt);
          }
          
          return (
            updatedDate.getMonth() === month &&
            updatedDate.getFullYear() === year
          );
        } catch (error) {
          console.error('Error parsing consultation date in monthly stats:', error);
          return false;
        }
      }).length;

      monthlyData.push({
        name: `T${month + 1}`,
        customers: customers,
        staff: staff,
        consultants: consultants,
        blogs: monthBlogs,
        stiTests: monthStiTests,
        consultations: monthConsultations,
      });
    }

    return monthlyData;
  };

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

        // Lấy tất cả blog đã được xác nhận
        const confirmedBlogsResponse =
          await blogService.getAllConfirmedBlogs();
        console.log('Confirmed blogs data:', confirmedBlogsResponse);

        // Tính toán tỉ lệ tăng trưởng thực tế
        const calculateUserGrowthRate = (users) => {
          if (!users || !Array.isArray(users)) return '+0%';

          const now = new Date();
          const currentMonth = now.getMonth(); // 0-11
          const currentYear = now.getFullYear();
          
          console.log('Current month (JS):', currentMonth, 'Current year:', currentYear);
          console.log('Processing users:', users.length);

          // Đếm người dùng tháng hiện tại
          const currentMonthUsers = users.filter((user) => {
            if (!user.createdDate && !user.created_date) return false;
            
            // Xử lý cả createdDate và created_date
            const dateField = user.createdDate || user.created_date;
            console.log('User date field:', dateField);
            
            let createdDate;
            try {
              if (Array.isArray(dateField)) {
                // Trường hợp API trả về array [year, month, day, hour, minute, second]
                const [year, month, day, hour = 0, minute = 0, second = 0] = dateField;
                createdDate = new Date(year, month - 1, day, hour, minute, second); // month - 1 vì JS month 0-11
              } else {
                // Trường hợp API trả về string
                createdDate = new Date(dateField);
              }
              
              console.log('Parsed date:', createdDate, 'Month:', createdDate.getMonth(), 'Year:', createdDate.getFullYear());
              
              const isCurrentMonth = createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
              console.log('Is current month:', isCurrentMonth);
              
              return isCurrentMonth;
            } catch (error) {
              console.error('Error parsing date:', error);
              return false;
            }
          });
          
          console.log('Current month users:', currentMonthUsers.length);

          // Đếm tổng người dùng đến cuối tháng trước (không bao gồm tháng này)
          const usersBeforeThisMonth = users.filter((user) => {
            if (!user.createdDate && !user.created_date) return false;
            
            const dateField = user.createdDate || user.created_date;
            
            let createdDate;
            try {
              if (Array.isArray(dateField)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = dateField;
                createdDate = new Date(year, month - 1, day, hour, minute, second);
              } else {
                createdDate = new Date(dateField);
              }
              
              return createdDate < new Date(currentYear, currentMonth, 1);
            } catch (error) {
              console.error('Error parsing date:', error);
              return false;
            }
          });
          
          console.log('Users before this month:', usersBeforeThisMonth.length);

          // Tính tỉ lệ tăng trưởng
          if (usersBeforeThisMonth.length === 0) {
            return currentMonthUsers.length > 0 ? '+100%' : '+0%';
          }

          const growthRate = (
            (currentMonthUsers.length / usersBeforeThisMonth.length) *
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
            
            try {
              let createdDate;
              if (Array.isArray(service.createdAt)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = service.createdAt;
                createdDate = new Date(year, month - 1, day, hour, minute, second);
              } else {
                createdDate = new Date(service.createdAt);
              }
              
              return (
                createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear
              );
            } catch (error) {
              console.error('Error parsing service date:', error);
              return false;
            }
          }).length;

          // Đếm tổng dịch vụ đến cuối tháng trước (không bao gồm tháng này)
          const servicesBeforeThisMonth = services.filter((service) => {
            if (!service.createdAt) return false;
            
            try {
              let createdDate;
              if (Array.isArray(service.createdAt)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = service.createdAt;
                createdDate = new Date(year, month - 1, day, hour, minute, second);
              } else {
                createdDate = new Date(service.createdAt);
              }
              
              return createdDate < new Date(currentYear, currentMonth, 1);
            } catch (error) {
              console.error('Error parsing service date:', error);
              return false;
            }
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
              
              try {
                let createdDate;
                if (Array.isArray(test.createdAt)) {
                  const [year, month, day, hour = 0, minute = 0, second = 0] = test.createdAt;
                  createdDate = new Date(year, month - 1, day, hour, minute, second);
                } else {
                  createdDate = new Date(test.createdAt);
                }
                
                return (
                  createdDate.getMonth() === currentMonth &&
                  createdDate.getFullYear() === currentYear
                );
              } catch (error) {
                console.error('Error parsing test date:', error);
                return false;
              }
            }),
            ...completedConsultations.filter((consultation) => {
              if (!consultation.createdAt) return false;
              
              try {
                let createdDate;
                if (Array.isArray(consultation.createdAt)) {
                  const [year, month, day, hour = 0, minute = 0, second = 0] = consultation.createdAt;
                  createdDate = new Date(year, month - 1, day, hour, minute, second);
                } else {
                  createdDate = new Date(consultation.createdAt);
                }
                
                return (
                  createdDate.getMonth() === currentMonth &&
                  createdDate.getFullYear() === currentYear
                );
              } catch (error) {
                console.error('Error parsing consultation date:', error);
                return false;
              }
            }),
          ].length;

          // Đếm tổng appointments hoàn thành trong tháng trước
          const appointmentsBeforeThisMonth = [
            ...completedSTITests.filter((test) => {
              if (!test.createdAt) return false;
              
              try {
                let createdDate;
                if (Array.isArray(test.createdAt)) {
                  const [year, month, day, hour = 0, minute = 0, second = 0] = test.createdAt;
                  createdDate = new Date(year, month - 1, day, hour, minute, second);
                } else {
                  createdDate = new Date(test.createdAt);
                }
                
                return createdDate < new Date(currentYear, currentMonth, 1);
              } catch (error) {
                console.error('Error parsing test date:', error);
                return false;
              }
            }),
            ...completedConsultations.filter((consultation) => {
              if (!consultation.createdAt) return false;
              
              try {
                let createdDate;
                if (Array.isArray(consultation.createdAt)) {
                  const [year, month, day, hour = 0, minute = 0, second = 0] = consultation.createdAt;
                  createdDate = new Date(year, month - 1, day, hour, minute, second);
                } else {
                  createdDate = new Date(consultation.createdAt);
                }
                
                return createdDate < new Date(currentYear, currentMonth, 1);
              } catch (error) {
                console.error('Error parsing consultation date:', error);
                return false;
              }
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

        // Hàm tính số lượng blog được xác nhận trong tháng này và tháng trước
        const getBlogsMonthStats = (blogs) => {
          if (!blogs || !Array.isArray(blogs))
            return { thisMonth: 0, lastMonth: 0, growth: '+0%' };
          
          const now = new Date();
          const currentMonth = now.getMonth(); // 0-11
          const currentYear = now.getFullYear();
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          
          let thisMonthCount = 0;
          let lastMonthCount = 0;
          
          blogs.forEach((blog) => {
            if (!blog.createdAt) return;
            
            try {
              let createdDate;
              if (Array.isArray(blog.createdAt)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = blog.createdAt;
                createdDate = new Date(year, month - 1, day, hour, minute, second);
              } else {
                createdDate = new Date(blog.createdAt);
              }
              
              const blogMonth = createdDate.getMonth();
              const blogYear = createdDate.getFullYear();
              
              if (blogYear === currentYear && blogMonth === currentMonth) {
                thisMonthCount++;
              }
              if (blogYear === lastMonthYear && blogMonth === lastMonth) {
                lastMonthCount++;
              }
            } catch (error) {
              console.error('Error parsing blog date in month stats:', error);
            }
          });
          
          // Tính tỉ lệ tăng trưởng
          let growth = '+0%';
          if (lastMonthCount === 0) {
            growth = thisMonthCount > 0 ? '+100%' : '+0%';
          } else {
            const rate = (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(1);
            growth = rate > 0 ? `+${rate}%` : `${rate}%`;
          }
          
          return { thisMonth: thisMonthCount, lastMonth: lastMonthCount, growth };
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

        // Tính thống kê blog
        const blogsStats = getBlogsMonthStats(
          confirmedBlogsResponse || []
        );

        // Tính toán dữ liệu thống kê theo tháng cho biểu đồ
        const monthlyStatsData = calculateMonthlyStats(
          usersResponse?.data || [],
          allSTITestsResponse?.data || [],
          allConsultationsResponse?.data || [],
          confirmedBlogsResponse || [],
          selectedYear
        );

        // Lưu cache dữ liệu để sử dụng khi thay đổi năm
        setAllDataCache({
          users: usersResponse?.data || [],
          stiTests: allSTITestsResponse?.data || [],
          consultations: allConsultationsResponse?.data || [],
          confirmedBlogs: confirmedBlogsResponse || []
        });

        // Lấy danh sách các năm có sẵn
        const yearsAvailable = getAvailableYears(
          usersResponse?.data || [],
          allSTITestsResponse?.data || [],
          allConsultationsResponse?.data || [],
          confirmedBlogsResponse || []
        );

        // Xử lý dữ liệu người dùng gần đây (5 người mới nhất)
        const processRecentUsers = (users) => {
          if (!users || !Array.isArray(users)) return [];

          const sortedUsers = users
            .sort((a, b) => {
              const dateA = a.createdDate || a.created_date;
              const dateB = b.createdDate || b.created_date;
              
              if (!dateA && !dateB) return 0;
              if (!dateA) return 1;
              if (!dateB) return -1;
              
              try {
                let parsedDateA, parsedDateB;
                
                if (Array.isArray(dateA)) {
                  const [year, month, day, hour = 0, minute = 0, second = 0] = dateA;
                  parsedDateA = new Date(year, month - 1, day, hour, minute, second);
                } else {
                  parsedDateA = new Date(dateA);
                }
                
                if (Array.isArray(dateB)) {
                  const [year, month, day, hour = 0, minute = 0, second = 0] = dateB;
                  parsedDateB = new Date(year, month - 1, day, hour, minute, second);
                } else {
                  parsedDateB = new Date(dateB);
                }
                
                return parsedDateB - parsedDateA;
              } catch (error) {
                console.error('Error sorting dates:', error);
                return 0;
              }
            })
            .slice(0, 5)
            .map((user) => ({
              id: user.id,
              name: user.fullName || user.username || 'N/A',
              email: user.email || 'N/A',
              role:
                user.role === 'ADMIN'
                  ? 'Quản lý'
                  : user.role === 'CONSULTANT'
                    ? 'Tư vấn viên'
                    : user.role === 'STAFF'
                      ? 'Nhân viên'
                      : 'Khách hàng',
              registrationTime: formatRegistrationTime(user.createdDate || user.created_date),
              avatar: (user.fullName || user.username || 'U')
                .charAt(0)
                .toUpperCase(),
            }));

          return sortedUsers;
        };

        // Hàm format thời gian đăng ký
        const formatRegistrationTime = (dateString) => {
          if (!dateString) return 'Chưa xác định';

          try {
            // Xử lý các định dạng khác nhau từ API
            let date;
            
            if (Array.isArray(dateString)) {
              // Trường hợp API trả về array [year, month, day, hour, minute, second]
              const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
              date = new Date(year, month - 1, day, hour, minute, second);
            } else if (typeof dateString === 'string') {
              // Trường hợp API trả về string ISO hoặc timestamp
              date = new Date(dateString);
            } else {
              // Trường hợp khác, thử parse trực tiếp
              date = new Date(dateString);
            }

            // Kiểm tra xem date có valid không
            if (isNaN(date.getTime())) {
              return 'Thời gian không hợp lệ';
            }
            
            // Định dạng: DD/MM/YYYY HH:mm
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${day}/${month}/${year} ${hours}:${minutes}`;
          } catch (error) {
            console.error('Error formatting registration time:', error);
            return 'Lỗi định dạng thời gian';
          }
        };

        // Xử lý dữ liệu thực
        const processedRecentUsers = processRecentUsers(
          usersResponse?.data || []
        );

        // Hàm tính số lượng lịch hẹn hoàn thành trong tháng này và tháng trước
        const getCompletedAppointmentsMonthStats = (stiTests, consultations) => {
          if ((!stiTests || !Array.isArray(stiTests)) && (!consultations || !Array.isArray(consultations)))
            return { thisMonth: 0, lastMonth: 0, growth: '+0%' };
          
          const now = new Date();
          const currentMonth = now.getMonth(); // 0-11
          const currentYear = now.getFullYear();
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          
          let thisMonthCount = 0;
          let lastMonthCount = 0;
          
          // Đếm STI tests hoàn thành
          (stiTests || []).forEach((test) => {
            // Chỉ đếm những test đã hoàn thành
            if (!test.createdAt || (test.status !== 'COMPLETED' && test.status !== 'completed')) return;
            
            try {
              let createdDate;
              if (Array.isArray(test.createdAt)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = test.createdAt;
                createdDate = new Date(year, month - 1, day, hour, minute, second);
              } else {
                createdDate = new Date(test.createdAt);
              }
              
              const testMonth = createdDate.getMonth();
              const testYear = createdDate.getFullYear();
              
              if (testYear === currentYear && testMonth === currentMonth) {
                thisMonthCount++;
              }
              if (testYear === lastMonthYear && testMonth === lastMonth) {
                lastMonthCount++;
              }
            } catch (error) {
              console.error('Error parsing STI test date in month stats:', error);
            }
          });
          
          // Đếm consultations hoàn thành
          (consultations || []).forEach((consultation) => {
            // Chỉ đếm những consultation đã hoàn thành
            if (!consultation.createdAt || (consultation.status !== 'COMPLETED' && consultation.status !== 'completed')) return;
            
            try {
              let createdDate;
              if (Array.isArray(consultation.createdAt)) {
                const [year, month, day, hour = 0, minute = 0, second = 0] = consultation.createdAt;
                createdDate = new Date(year, month - 1, day, hour, minute, second);
              } else {
                createdDate = new Date(consultation.createdAt);
              }
              
              const consultationMonth = createdDate.getMonth();
              const consultationYear = createdDate.getFullYear();
              
              if (consultationYear === currentYear && consultationMonth === currentMonth) {
                thisMonthCount++;
              }
              if (consultationYear === lastMonthYear && consultationMonth === lastMonth) {
                lastMonthCount++;
              }
            } catch (error) {
              console.error('Error parsing consultation date in month stats:', error);
            }
          });
          
          // Tính tỉ lệ tăng trưởng
          let growth = '+0%';
          if (lastMonthCount === 0) {
            growth = thisMonthCount > 0 ? '+100%' : '+0%';
          } else {
            const rate = (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(1);
            growth = rate > 0 ? `+${rate}%` : `${rate}%`;
          }
          
          return { thisMonth: thisMonthCount, lastMonth: lastMonthCount, growth };
        };

        // Xử lý dữ liệu blog
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
          consultationsThisMonth: getCompletedAppointmentsMonthStats(
            allSTITestsResponse?.data || [],
            allConsultationsResponse?.data || []
          ).thisMonth,
          consultationsThisMonthGrowth: getCompletedAppointmentsMonthStats(
            allSTITestsResponse?.data || [],
            allConsultationsResponse?.data || []
          ).growth,
          confirmedBlogs: (confirmedBlogsResponse || []).length,
          blogsThisMonth: blogsStats.thisMonth,
          blogsThisMonthGrowth: blogsStats.growth,
        });

        // Cập nhật dữ liệu thống kê theo tháng
        setMonthlyData(monthlyStatsData);
        
        // Cập nhật danh sách các năm có sẵn
        setAvailableYears(yearsAvailable);

        // Cập nhật dữ liệu người dùng gần đây
        setRecentUsers(processedRecentUsers);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Lỗi khi tải tổng quan hệ thống');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedYear]);

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
          <Grid item size={4} xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
            <StatCard
              title="Tổng người dùng"
              value={(dashboardData.totalUsers || 0).toLocaleString()}
              change={`${dashboardData.userGrowthRate || '+0%'} so với tháng trước`}
              icon={PeopleIcon}
              color="#4A90E2"
            />
          </Grid>
          <Grid item size={4} xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
            <Tooltip
              title="Tổng số lịch hẹn đã hoàn thành trong tháng này (bao gồm cả xét nghiệm STI và tư vấn). Tỷ lệ tăng trưởng so với tháng trước."
              arrow
            >
              <Box sx={{ width: '100%' }}>
                <StatCard
                  title="Lịch hẹn hoàn thành tháng này"
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
          <Grid item size={4} xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
            <StatCard
              title="Bài viết đã xác nhận"
              value={(dashboardData.confirmedBlogs || 0).toLocaleString()}
              change={`${dashboardData.blogsThisMonthGrowth || '+0%'} so với tháng trước`}
              icon={ArticleIcon}
              color="#7B61FF"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Second Row - Optional additional stats */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item size={4} xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
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
          <Grid item size={4} xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
            <StatCard
              title="Nhân viên hoạt động"
              value={(dashboardData.activeStaffs || 0).toLocaleString()}
              change={`${dashboardData.userGrowthRate || '+0%'} so với tháng trước`}
              icon={PeopleIcon}
              color="#00C9A7"
            />
          </Grid>
          <Grid item size={4} xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
            <StatCard
              title="Khách hàng hoạt động"
              value={(dashboardData.activePatients || 0).toLocaleString()}
              change={`${dashboardData.userGrowthRate || '+0%'} so với tháng trước`}
              icon={PeopleIcon}
              color="#4A90E2"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Year Filter Section */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#1a202c' }}
            >
              📊 Thống kê theo tháng
            </Typography>
            
            {/* Bộ lọc năm */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select
                value={selectedYear}
                label="Năm"
                onChange={handleYearChange}
                sx={{
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Bar Chart Section */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item size={12} xs={12} sx={{ display: 'flex' }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                p: 3,
                minHeight: '500px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1a202c' }}
                >
                  Thống kê người dùng theo vai trò
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Cao nhất (KH)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A90E2', fontWeight: 700 }}>
                      {Math.max(...monthlyData.map(item => item.customers))}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Cao nhất (NV)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00C9A7', fontWeight: 700 }}>
                      {Math.max(...monthlyData.map(item => item.staff))}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Cao nhất (TV)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E91E63', fontWeight: 700 }}>
                      {Math.max(...monthlyData.map(item => item.consultants))}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: '420px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <defs>
                      <linearGradient id="customersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="staffGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00C9A7" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="consultantsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E91E63" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#E91E63" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={12}
                      angle={0}
                      textAnchor="middle"
                      height={60}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      width={60}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value, name) => [
                        `${value} người`,
                        name
                      ]}
                      labelFormatter={(label) => `Tháng ${label.substring(1)}`}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#4A90E2"
                      strokeWidth={3}
                      dot={{ fill: '#4A90E2', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#4A90E2', stroke: '#fff', strokeWidth: 2 }}
                      name="Khách hàng"
                      fill="url(#customersGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="staff"
                      stroke="#00C9A7"
                      strokeWidth={3}
                      dot={{ fill: '#00C9A7', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#00C9A7', stroke: '#fff', strokeWidth: 2 }}
                      name="Nhân viên"
                      fill="url(#staffGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="consultants"
                      stroke="#E91E63"
                      strokeWidth={3}
                      dot={{ fill: '#E91E63', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#E91E63', stroke: '#fff', strokeWidth: 2 }}
                      name="Tư vấn viên"
                      fill="url(#consultantsGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Line Chart Section */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item size={12} xs={12} sx={{ display: 'flex' }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                p: 3,
                minHeight: '500px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1a202c' }}
                >
                  Thống kê số lượng bài viết
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Cao nhất
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7B61FF', fontWeight: 700 }}>
                      {Math.max(...monthlyData.map(item => item.blogs))}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Thấp nhất
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7B61FF', fontWeight: 700 }}>
                      {Math.min(...monthlyData.map(item => item.blogs))}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      TB/tháng
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7B61FF', fontWeight: 700 }}>
                      {Math.round(monthlyData.reduce((sum, item) => sum + item.blogs, 0) / monthlyData.length)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: '420px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="blogBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#7B61FF" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={12}
                      angle={0}
                      textAnchor="middle"
                      height={60}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      width={60}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value, name) => [
                        `${value} bài viết`,
                        'Bài viết đã xác nhận'
                      ]}
                      labelFormatter={(label) => `Tháng ${label.substring(1)}`}
                    />
                    <Bar
                      dataKey="blogs"
                      fill="url(#blogBarGradient)"
                      name="Bài viết đã xác nhận"
                      radius={[8, 8, 0, 0]}
                      stroke="#7B61FF"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Appointment Statistics Chart */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item size={12} xs={12} sx={{ display: 'flex' }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                p: 3,
                minHeight: '500px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1a202c' }}
                >
                  Thống kê lịch hẹn đã hoàn thành theo loại
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Tổng xét nghiệm
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FF6B6B', fontWeight: 700 }}>
                      {monthlyData.reduce((sum, item) => sum + item.stiTests, 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Tổng tư vấn
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4ECDC4', fontWeight: 700 }}>
                      {monthlyData.reduce((sum, item) => sum + item.consultations, 0)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: '420px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="stiTestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="consultationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={12}
                      angle={0}
                      textAnchor="middle"
                      height={60}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      width={60}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value, name) => [
                        `${value} lịch hẹn hoàn thành`,
                        name
                      ]}
                      labelFormatter={(label) => `Tháng ${label.substring(1)}`}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px',
                      }}
                    />
                    <Bar
                      dataKey="stiTests"
                      fill="url(#stiTestGradient)"
                      name="Lịch xét nghiệm"
                      radius={[4, 4, 0, 0]}
                      stroke="#FF6B6B"
                      strokeWidth={1}
                    />
                    <Bar
                      dataKey="consultations"
                      fill="url(#consultationGradient)"
                      name="Lịch tư vấn"
                      radius={[4, 4, 0, 0]}
                      stroke="#4ECDC4"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions Row */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                p: 3,
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
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item size={4} xs={12} sm={6} md={4} lg={2} key={action.id}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => onNavigate && onNavigate(action.id)}
                      startIcon={<action.icon />}
                      sx={{
                        py: 2,
                        px: 3,
                        backgroundColor: action.color,
                        color: '#ffffff',
                        borderRadius: 3,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        minHeight: '120px',
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        '&:hover': {
                          backgroundColor: action.color,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                          filter: 'brightness(1.1)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '& .MuiButton-startIcon': {
                          margin: 0,
                          mb: 0.5,
                        },
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        textAlign: 'center',
                        height: '100%',
                        justifyContent: 'center'
                      }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: '#ffffff',
                            mb: 0.5,
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ 
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            opacity: 0.9,
                            lineHeight: 1.1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                          }}
                        >
                          {action.subtitle}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
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
            👥 Tài khoản đăng kí gần đây
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
                    TÀI KHOẢN
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
                    THỜI GIAN ĐĂNG KÝ
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
                              ? '#E91E63'
                              : user.role === 'Tư vấn viên'
                                ? '#00C9A7'
                                : user.role === 'Nhân viên'
                                  ? '#4A90E2'
                                  : '#64748b',
                          color: '#fff',
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
                        {user.registrationTime}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onNavigate && onNavigate('users')}
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
            Xem tất cả tài khoản đăng kí
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardContent;

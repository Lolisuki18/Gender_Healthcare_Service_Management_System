/**
 * UserManagementContent.js - Admin User Management
 *
 * Trang quản lý người dùng cho Admin
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  ManageAccounts as ManageAccountsIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import AddUserModal from '../modals/AddUserModal';
import ViewUserModal from '../modals/ViewUserModal';
import EditUserModal from '../modals/EditUserModal';
import { confirmDialog } from '@/utils/confirmDialog';
import { userService } from '@/services/userService';
import { adminService } from '@/services/adminService';
import { getAvatarUrl } from '@/utils/imageUrl';

const UserManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalType, setModalType] = useState('');
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openRoleSelection, setOpenRoleSelection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [newUserId, setNewUserId] = useState(null);
  const [openAddUserModal, setOpenAddUserModal] = useState(false); // Thêm state mới
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [addUserFieldErrors, setAddUserFieldErrors] = useState({}); // Thêm state lưu lỗi từng trường

  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect để tự động mở modal khi openAddModal prop thay đổi
  useEffect(() => {
    if (openAddUserModal) {
      setModalType('all');
    }
  }, [openAddUserModal]);

  const fetchUsers = async (newUserId = null) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Đang tải danh sách người dùng...');
      const response = await adminService.getAllUsers();
      console.log('Response từ API:', response);

      if (response && response.data) {
        let userData = response.data;

        if (newUserId) {
          const newUser = userData.find((user) => user.id === newUserId);
          if (newUser) {
            userData = userData.filter((user) => user.id !== newUserId);
            userData = [newUser, ...userData];
          }
        }

        setUsers(userData);
        console.log('Đã tải thành công:', userData.length, 'người dùng');
      } else if (Array.isArray(response)) {
        let userData = response;

        if (newUserId) {
          const newUser = userData.find((user) => user.id === newUserId);
          if (newUser) {
            userData = userData.filter((user) => user.id !== newUserId);
            userData = [newUser, ...userData];
          }
        }

        setUsers(userData);
        console.log('Đã tải thành công:', userData.length, 'người dùng');
      } else {
        console.warn('Format response không như mong đợi:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const userCategories = [
    {
      label: 'Tất cả',
      value: 'all',
      icon: <PeopleIcon />,
      count: users.filter((u) => u.role !== 'ADMIN').length,
    },
    {
      label: 'Nhân viên',
      value: 'STAFF',
      icon: <BusinessIcon />,
      count: users.filter((u) => u.role === 'STAFF').length,
    },
    {
      label: 'Khách hàng',
      value: 'CUSTOMER',
      icon: <PersonIcon />,
      count: users.filter((u) => u.role === 'CUSTOMER').length,
    },
    {
      label: 'Tư vấn viên',
      value: 'CONSULTANT',
      icon: <SupportIcon />,
      count: users.filter((u) => u.role === 'CONSULTANT').length,
    },
  ];

  const handleEdit = async (userId) => {
    const user = users.find((u) => u.id === userId);
    console.log('🔍 User found for edit:', user);
    console.log('🔍 User role:', user?.role);

    if (!user) return;

    if (user.role === 'ADMIN') {
      const isConfirmed = await confirmDialog.warning(
        `Bạn đang sửa thông tin Quản trị viên "${
          user.fullName || user.username || 'Không có tên'
        }". Hãy cẩn thận với các thay đổi!`,
        {
          title: '⚠️ Chỉnh sửa Quản trị viên',
          confirmText: 'Tiếp tục chỉnh sửa',
          cancelText: 'Hủy',
        }
      );

      if (!isConfirmed) return;
    }

    const userToEdit = {
      ...user,
      role: user.role || user.Role || '',
    };

    console.log('🔍 User to edit prepared:', userToEdit);

    setEditingUser(userToEdit);
    setOpenEditModal(true);
  };

  const handleUpdateBasicInfo = async (formData) => {
    try {
      console.log('🔄 Đang cập nhật thông tin cơ bản:', formData);

      const response = await userService.updateBasicInfo(formData.id, {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === formData.id ? { ...u, ...formData } : u))
      );

      toast.success(
        `Đã cập nhật thông tin cơ bản của ${
          formData.fullName || formData.username
        }`
      );

      await fetchUsers();
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật thông tin cơ bản:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi cập nhật thông tin cơ bản';

      toast.error('Lỗi cập nhật', errorMessage);
    }
  };

  const handleUpdateRole = async (formData) => {
    const user = editingUser;

    if (formData.role !== user.role) {
      const isConfirmed = await confirmDialog.warning(
        `Bạn đang thay đổi vai trò từ "${getRoleDisplayName(
          user.role
        )}" thành "${getRoleDisplayName(
          formData.role
        )}". Điều này có thể ảnh hưởng đến quyền truy cập của người dùng.`,
        {
          title: '🔄 Thay đổi vai trò',
          confirmText: 'Xác nhận thay đổi',
          cancelText: 'Giữ nguyên',
        }
      );

      if (!isConfirmed) return;
    }

    try {
      console.log('🔐 Đang cập nhật vai trò & trạng thái:', formData);

      const response = await adminService.updateUserStatus(formData.id, {
        role: formData.role,
        isActive: formData.isActive,
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === formData.id
            ? { ...u, role: formData.role, isActive: formData.isActive }
            : u
        )
      );

      toast.success(
        `Đã cập nhật vai trò & trạng thái của ${user.fullName || user.username}`
      );

      await fetchUsers();

      console.log('✅ Cập nhật vai trò & trạng thái thành công');
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật vai trò & trạng thái:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi cập nhật vai trò & trạng thái';

      toast.error('Lỗi cập nhật', errorMessage);
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const isConfirmed = await confirmDialog.danger(
      `Bạn có chắc chắn muốn xóa người dùng "${
        user.fullName || user.username || 'Không có tên'
      }"?`,
      {
        title: 'Xác nhận xóa người dùng',
        confirmText: 'Xóa',
        cancelText: 'Hủy',
      }
    );

    if (isConfirmed) {
      try {
        if (user.role === 'CONSULTANT') {
          console.log('Đang xóa người dùng ID:', userId);
          await adminService.deleteConsultant(userId);
        }
        if (user.role === 'STAFF') {
          console.log('Đang xóa nhân viên ID:', userId);
          await adminService.deleteStaff(userId);
        }
        if (user.role === 'CUSTOMER') {
          console.log('Đang xóa khách hàng ID:', userId);
          await adminService.deleteCustomer(userId);
        }
        if (user.role === 'ADMIN') {
          console.log('Đang xóa quản trị viên ID:', userId);
          await adminService.deleteAdmin(userId);
        }

        await fetchUsers();

        toast.success(
          `Đã xóa người dùng "${user.fullName || user.username}" thành công!`
        );
        console.log('Xóa người dùng thành công');
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi xóa người dùng';

        toast.error('Lỗi xóa người dùng', errorMessage);
      }
    }
  };

  const [loadingConsultantDetails, setLoadingConsultantDetails] =
    useState(false);

  const handleViewUser = async (userId) => {
    try {
      setLoadingUserDetails(true);

      const user = users.find((u) => u.id === userId);
      if (!user) {
        toast.error('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      console.log('🔍 User từ state:', user);

      setSelectedUser(user);
      setOpenViewModal(true);

      if (user.role === 'CONSULTANT') {
        console.log('📞 Đang gọi API getConsultantDetails cho userId:', userId);

        const response = await adminService.getConsultantDetails(userId);

        console.log('📋 Raw response từ API:', response);

        const consultantDetails = response.data || response;
        console.log('📋 Consultant details:', consultantDetails);

        const mappedUser = {
          id: user.id,
          role: user.role,

          profileId: consultantDetails.profileId,
          full_name:
            consultantDetails.fullName || user.fullName || user.full_name,
          username: consultantDetails.username || user.username,
          email: consultantDetails.email || user.email,
          phone: consultantDetails.phone || user.phone,
          address: consultantDetails.address || user.address,
          gender: consultantDetails.gender || user.gender,
          is_active:
            consultantDetails.active !== undefined
              ? consultantDetails.active
              : consultantDetails.isActive !== undefined
                ? consultantDetails.isActive
                : user.is_active,
          avatar: consultantDetails.avatar || user.avatar,

          birth_day: user.birth_day,
          created_date: user.created_date,

          qualifications: consultantDetails.qualifications,
          experience: consultantDetails.experience,
          bio: consultantDetails.bio,
          updated_at: consultantDetails.updatedAt,

          _hasDetailedInfo: true,
        };

        console.log('🔄 Mapped user data:', mappedUser);
        setSelectedUser(mappedUser);
      } else {
        console.log('ℹ️ Không phải consultant, chỉ hiển thị thông tin cơ bản');
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy thông tin chi tiết:', error);
      console.error('❌ Error response:', error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi tải thông tin người dùng';

      toast.error('Lỗi tải thông tin', errorMessage);

      const user = users.find((u) => u.id === userId);
      if (user) {
        setSelectedUser({
          ...user,
          _detailsLoadFailed: true,
        });
      }
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    const user = editingUser;

    console.log('🔍 Edit submit - Original user:', user);
    console.log('🔍 Edit submit - Form data:', formData);
    console.log('🔍 Edit submit - Role comparison:', {
      originalRole: user?.role,
      newRole: formData?.role,
      isRoleChanged: formData?.role !== user?.role,
    });

    if (formData.role && user.role && formData.role !== user.role) {
      const isConfirmed = await confirmDialog.warning(
        `Bạn đang thay đổi vai trò từ "${getRoleDisplayName(
          user.role
        )}" thành "${getRoleDisplayName(
          formData.role
        )}". Điều này có thể ảnh hưởng đến quyền truy cập của người dùng.`,
        {
          title: '🔄 Thay đổi vai trò',
          confirmText: 'Xác nhận thay đổi',
          cancelText: 'Giữ nguyên',
        }
      );

      if (!isConfirmed) return;
    }

    try {
      console.log('🔄 Đang cập nhật thông tin người dùng:', formData);

      const response = await adminService.updateUser(formData.id, user.role, {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birthDay: formData.birthDay,
        role: formData.role,
        password: formData.password,
        isActive: formData.isActive,
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === formData.id ? { ...u, ...formData } : u))
      );

      toast.success(
        `Đã cập nhật thông tin của ${formData.fullName || formData.username}`
      );

      await fetchUsers();

      setOpenEditModal(false);
      setEditingUser(null);

      console.log('✅ Cập nhật người dùng thành công');
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật người dùng:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi cập nhật thông tin người dùng';

      toast.error('Lỗi cập nhật', errorMessage);
    }
  };

  const handleModalSubmit = async (formData, userType) => {
    setIsCreatingUser(true);
    setAddUserFieldErrors({}); // Reset lỗi trước khi submit
    try {
      console.log('Đang tạo người dùng mới:', formData);
      console.log('Loại người dùng:', userType);

      const result = await adminService.addNewUserAccount(formData);

      if (result && result.success) {
        const newId = result.data?.id || result.id;

        setNewUserId(newId);

        setTimeout(() => {
          setNewUserId(null);
        }, 5000);

        toast.success(`Tạo ${getRoleDisplayName(userType)} thành công!`);

        await fetchUsers(newId);

        setOpenAddUserModal(false); // Đóng modal khi thành công
        setAddUserFieldErrors({}); // Reset lỗi khi thành công
        setModalType('');

        console.log('Tạo người dùng thành công:', result);
      }
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi tạo người dùng';
      const errorData = error.response?.data?.data || {};
      setAddUserFieldErrors(errorData); // Lưu lỗi từng trường
      toast.error('Lỗi tạo người dùng', errorMessage);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const getModalTitle = (userType) => {
    switch (userType) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'STAFF':
        return 'Nhân viên';
      case 'CUSTOMER':
        return 'Khách hàng';
      case 'CONSULTANT':
        return 'Tư vấn viên';
      default:
        return 'Người dùng';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'STAFF':
        return 'Nhân viên';
      case 'CUSTOMER':
        return 'Khách hàng';
      case 'CONSULTANT':
        return 'Tư vấn viên';
      default:
        return role;
    }
  };

  const getAddButtonText = () => {
    return 'Thêm người dùng mới';
  };

  const handleAddNew = () => {
    setModalType('all');
    setOpenAddUserModal(true); // Mở modal
  };

  const roleOptions = [
    {
      value: 'STAFF',
      label: 'Nhân viên',
      icon: <BusinessIcon />,
      description: 'Nhân viên hỗ trợ khách hàng',
      color: '#3182CE',
    },
    {
      value: 'CONSULTANT',
      label: 'Tư vấn viên',
      icon: <SupportIcon />,
      description: 'Chuyên gia tư vấn sức khỏe',
      color: '#D69E2E',
    },
    {
      value: 'CUSTOMER',
      label: 'Khách hàng',
      icon: <PersonIcon />,
      description: 'Người dùng sử dụng dịch vụ',
      color: '#4A90E2',
    },
  ];

  const getFilteredUsers = () => {
    console.log('=== FILTERING USERS ===');
    console.log('Original users count:', users.length);
    console.log('Search term:', searchTerm);
    console.log('Selected tab:', userCategories[selectedTab]?.value);
    console.log('Role filter:', roleFilter);
    console.log('Status filter:', statusFilter);

    let filtered = users.filter((user) => user.role !== 'ADMIN');

    const currentTab = userCategories[selectedTab]?.value;
    if (currentTab && currentTab !== 'all') {
      filtered = filtered.filter((u) => u.role === currentTab);
      console.log('After tab filter:', filtered.length);
    }

    if (currentTab === 'all' && roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role === roleFilter);
      console.log('After role filter:', filtered.length);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'Hoạt động') {
        filtered = filtered.filter((u) => u.isActive === true && !u.isDeleted);
      } else if (statusFilter === 'Tạm khóa') {
        filtered = filtered.filter((u) => u.isActive === false && !u.isDeleted);
      } else if (statusFilter === 'Đã xóa') {
        filtered = filtered.filter((u) => u.isDeleted === true);
      }
      console.log('After status filter:', filtered.length);
    } else {
      // Mặc định không hiển thị user đã xóa
      filtered = filtered.filter((u) => !u.isDeleted);
      console.log('After default filter (exclude deleted):', filtered.length);
    }

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((u) => {
        const nameMatch = (u.fullName || '')
          .toLowerCase()
          .includes(searchLower);
        const usernameMatch = (u.username || '')
          .toLowerCase()
          .includes(searchLower);
        const emailMatch = (u.email || '').toLowerCase().includes(searchLower);
        const phoneMatch = (u.phone || '').includes(searchTerm.trim());

        return nameMatch || usernameMatch || emailMatch || phoneMatch;
      });
      console.log('After search filter:', filtered.length);
    }

    console.log('Final filtered users:', filtered.length);
    return filtered;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('Search input changed to:', value);
    setSearchTerm(value);
  };

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    console.log('Filtered users:', getFilteredUsers());
  }, [searchTerm, selectedTab, roleFilter, statusFilter]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (userCategories[newValue]?.value !== 'all') {
      setRoleFilter('all');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'CONSULTANT':
        return 'warning';
      case 'STAFF':
        return 'info';
      case 'CUSTOMER':
        return 'primary';
      default:
        return 'default';
    }
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#4A90E2' }} />
        <Typography variant="h6" sx={{ ml: 2, color: '#4A5568' }}>
          Đang tải danh sách người dùng...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: '#E53E3E', mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchUsers}
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            '&:hover': {
              background: 'linear-gradient(45deg, #357ABD, #17A2B8)',
            },
          }}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: '#2D3748',
          display: 'flex',
          alignItems: 'center',
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <ManageAccountsIcon sx={{ mr: 2, color: '#4A90E2', fontSize: 32 }} />
        Quản lý người dùng
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#4A5568',
          mb: 4,
          fontSize: '1rem',
        }}
      >
        Quản lý tài khoản và phân quyền người dùng trong hệ thống
      </Typography>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 144, 226, 0.15)',
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            px: 2,
            pt: 1,
            borderBottom: '1px solid rgba(74, 144, 226, 0.15)',
            '& .MuiTab-root': {
              minHeight: 60,
              textTransform: 'none',
              fontWeight: 500,
              color: '#4A5568',
              '&.Mui-selected': {
                color: '#4A90E2',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4A90E2',
              height: 3,
            },
          }}
        >
          {userCategories.map((category, index) => (
            <Tab
              key={category.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.icon}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                      {category.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#718096' }}>
                      {category.count} người dùng
                    </Typography>
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            px: 3,
            pt: 3,
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
            {userCategories[selectedTab]?.label === 'Tất cả'
              ? 'Danh sách người dùng'
              : `Danh sách ${userCategories[selectedTab]?.label}`}
          </Typography>
        </Box>

        <CardContent sx={{ pt: 0, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Tìm kiếm theo tên, tên đăng nhập, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4A90E2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4A90E2',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: '#4A5568', mr: 1 }} />
                  ),
                }}
              />
              {searchTerm && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#718096',
                    mt: 0.5,
                    display: 'block',
                  }}
                >
                  Đang tìm: "{searchTerm}" - Kết quả:{' '}
                  {getFilteredUsers().length} người dùng
                </Typography>
              )}
            </Grid>

            {userCategories[selectedTab]?.value === 'all' && (
              <Grid item xs={12} md={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Vai trò</InputLabel>{' '}
                  <Select
                    value={roleFilter}
                    label="Vai trò"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="CONSULTANT">Tư vấn viên</MenuItem>
                    <MenuItem value="STAFF">Nhân viên</MenuItem>
                    <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              md={userCategories[selectedTab]?.value === 'all' ? 3 : 6}
            >
              <FormControl size="small" fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                  <MenuItem value="Tạm khóa">Tạm khóa</MenuItem>
                  <MenuItem value="Đã xóa">Đã xóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#4A5568' }}>
          {' '}
          Hiển thị {getFilteredUsers().length} /{' '}
          {users.filter((user) => user.role !== 'ADMIN').length} người dùng
          {userCategories[selectedTab]?.label !== 'Tất cả' &&
            ` trong danh mục "${userCategories[selectedTab]?.label}"`}
          {searchTerm && ` (tìm kiếm: "${searchTerm}")`}
        </Typography>
      </Box>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 144, 226, 0.15)',
          borderRadius: 3,
        }}
      >
        <TableContainer component={Paper} sx={{ background: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Người dùng
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Tên đăng nhập
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Liên hệ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Vai trò
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={
                      user.id === newUserId
                        ? {
                            animation: 'highlight 5s',
                            backgroundColor: 'rgba(74, 144, 226, 0.08)',
                            '@keyframes highlight': {
                              '0%': {
                                backgroundColor: 'rgba(74, 144, 226, 0.3)',
                              },
                              '100%': {
                                backgroundColor: 'rgba(74, 144, 226, 0)',
                              },
                            },
                          }
                        : {}
                    }
                  >
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar
                          src={getAvatarUrl(user.avatar)}
                          sx={{
                            width: 40,
                            height: 40,
                            background:
                              user.id === newUserId
                                ? 'linear-gradient(45deg, #4CAF50, #8BC34A)'
                                : 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
                            border:
                              user.id === newUserId
                                ? '2px solid #4CAF50'
                                : 'none',
                          }}
                        >
                          {user.fullName?.charAt(0) ||
                            user.username?.charAt(0) ||
                            '?'}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: user.id === newUserId ? 700 : 500,
                              color:
                                user.id === newUserId ? '#2E7D32' : '#2D3748',
                            }}
                          >
                            {user.fullName || 'Không có tên'}
                            {user.id === newUserId && (
                              <Chip
                                size="small"
                                label="MỚI"
                                color="success"
                                sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                              />
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#718096' }}
                          >
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#2D3748' }}>
                        {user.username || 'Chưa thiết lập'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#2D3748' }}>
                          {user.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          {user.phone || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleDisplayName(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.isDeleted
                            ? 'Đã xóa'
                            : user.isActive
                              ? 'Hoạt động'
                              : 'Tạm khóa'
                        }
                        color={
                          user.isDeleted
                            ? 'error'
                            : user.isActive
                              ? 'success'
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewUser(user.id)}
                          disabled={loadingUserDetails}
                          sx={{
                            color: '#48BB78',
                            backgroundColor: 'rgba(72, 187, 120, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(72, 187, 120, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            '&:disabled': {
                              opacity: 0.6,
                              transform: 'none',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {loadingUserDetails ? (
                            <CircularProgress
                              size={16}
                              sx={{ color: '#48BB78' }}
                            />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleEdit(user.id)}
                          disabled={user.isDeleted}
                          sx={{
                            color: '#4A90E2',
                            backgroundColor: 'rgba(74, 144, 226, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(74, 144, 226, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            '&:disabled': {
                              opacity: 0.5,
                              cursor: 'not-allowed',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      Không tìm thấy người dùng nào phù hợp
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleAddNew}
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #357ABD, #17A2B8)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {getAddButtonText()}
        </Button>
      </Box>

      <AddUserModal
        open={openAddUserModal}
        onClose={() => {
          setOpenAddUserModal(false);
          setAddUserFieldErrors({}); // Reset lỗi khi đóng modal
        }}
        userType={modalType}
        onSubmit={handleModalSubmit}
        fieldErrors={addUserFieldErrors}
      />

      <ViewUserModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        user={selectedUser}
        loadingConsultantDetails={loadingUserDetails}
      />

      <EditUserModal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleEditSubmit}
      />
    </Box>
  );
};

export default UserManagementContent;

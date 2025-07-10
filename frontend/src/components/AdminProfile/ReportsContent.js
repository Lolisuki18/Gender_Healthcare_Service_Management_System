/**
 * ReportsContent.js - Admin Reports and Analytics
 *
 * Trang báo cáo và thống kê cho Admin
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarIcon from '@mui/icons-material/Star';
import { adminService } from '@/services/adminService';
import { userService } from '@/services/userService';
import { formatDateDisplay, formatDateTime } from '@/utils/dateUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { confirmDialog } from '@/utils/confirmDialog';

// Helper: Lấy ngày đầu và cuối quý hiện tại
function getCurrentQuarterRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const quarter = Math.floor(month / 3);
  const fromDate = new Date(year, quarter * 3, 1);
  const toDate = new Date(year, quarter * 3 + 3, 0);
  return {
    from: fromDate.toISOString().slice(0, 10),
    to: toDate.toISOString().slice(0, 10),
  };
}

// Helper: Lấy ngày đầu và cuối năm hiện tại
function getCurrentYearRange() {
  const now = new Date();
  const year = now.getFullYear();
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`,
  };
}

// Helper: Lấy ngày hôm nay
function getTodayRange() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  return { from: today, to: today };
}

const MetricCard = ({ title, value, change, icon: Icon, color }) => (
  <Card
    sx={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(74, 144, 226, 0.15)',
      borderRadius: 3,
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(74, 144, 226, 0.15)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${color}, ${color}dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          <Icon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#2D3748',
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4A5568', mt: 0.5 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            color: change > 0 ? '#4CAF50' : '#F44336',
            fontWeight: 600,
          }}
        >
          {change > 0 ? '+' : ''}
          {change}%
        </Typography>
        <Typography variant="caption" sx={{ color: '#718096', ml: 1 }}>
          so với tháng trước
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const ReportsContent = () => {
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // Lấy dữ liệu báo cáo khi load hoặc khi đổi filter
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Tạo params filter thời gian
        let params = {};
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        const [summaryRes, transactionsRes] = await Promise.all([
          adminService.getRevenueSummary(params),
          adminService.getRevenueTransactions(params),
        ]);
        setSummary(summaryRes);
        setTransactions(transactionsRes);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải báo cáo doanh thu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fromDate, toDate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminService.getDashboardOverview();
        setDashboard(data);
      } catch (err) {
        // Không chặn báo cáo cũ nếu lỗi
        setDashboard(null);
      }
    };
    fetchDashboard();
  }, []);

  // Chuẩn hóa dữ liệu cho biểu đồ doanh thu theo ngày
  const chartData = React.useMemo(() => {
    if (!transactions.length) return [];
    // Gom nhóm theo ngày
    const map = {};
    transactions.forEach((t) => {
      let dateKey = t.paidAt ? formatDateDisplay(t.paidAt) : '';
      if (!map[dateKey]) map[dateKey] = 0;
      map[dateKey] += Number(t.amount || 0);
    });
    return Object.entries(map).map(([date, value]) => ({ date, value }));
  }, [transactions]);

  // Hàm mở dialog xem thông tin khách hàng
  const handleViewUser = async (row) => {
    setUserLoading(true);
    setUserError(null);
    setOpenUserDialog(true);
    try {
      const res = await userService.getUserById(row.userId);
      setSelectedUser(res.data || res); // tuỳ backend trả về
    } catch (err) {
      setUserError(err.message || 'Không lấy được thông tin khách hàng');
      setSelectedUser(null);
    } finally {
      setUserLoading(false);
    }
  };
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setSelectedUser(null);
    setUserError(null);
  };

  // Hàm xử lý nút tính doanh thu
  const handleShowRevenue = async (type) => {
    let params = {};
    let label = '';
    if (type === 'today') {
      params = getTodayRange();
      label = 'hôm nay';
    } else if (type === 'quarter') {
      params = getCurrentQuarterRange();
      label = 'quý này';
    } else if (type === 'year') {
      params = getCurrentYearRange();
      label = 'năm nay';
    }
    try {
      const summary = await adminService.getRevenueSummary(params);
      const revenue = summary?.totalRevenue || 0;
      await confirmDialog.info(
        `💰 Doanh thu ${label}:\n\n${Number(revenue).toLocaleString()} VNĐ`,
        { title: `Doanh thu ${label.charAt(0).toUpperCase() + label.slice(1)}` }
      );
    } catch (err) {
      await confirmDialog.danger(
        `Không thể lấy doanh thu ${label}.\n${err.message || ''}`,
        { title: 'Lỗi' }
      );
    }
  };

  // Xử lý loading/error
  if (loading) return <Typography>Đang tải báo cáo...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
          <TrendingUpIcon sx={{ mr: 2, color: '#4A90E2', fontSize: 32 }} />
          Báo cáo & Doanh thu
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#4A5568', mb: 3, fontSize: '1rem' }}
        >
          Phân tích hiệu suất và doanh thu hệ thống
        </Typography>
        {/* Các nút tính doanh thu nhanh */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleShowRevenue('today')}
          >
            Doanh thu hôm nay
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowRevenue('quarter')}
          >
            Doanh thu quý này
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleShowRevenue('year')}
          >
            Doanh thu năm nay
          </Button>
        </Box>
        {/* Bộ lọc thời gian */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tổng doanh thu"
            value={
              summary
                ? `${Number(summary.totalRevenue).toLocaleString()} VNĐ`
                : '-'
            }
            change={0}
            icon={MoneyIcon}
            color="#F39C12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Số giao dịch thành công"
            value={summary ? summary.totalTransactions : '-'}
            change={0}
            icon={AssignmentIcon}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Doanh thu trung bình"
            value={
              summary
                ? `${Number(summary.averageRevenue).toLocaleString()} VNĐ`
                : '-'
            }
            change={0}
            icon={TrendingUpIcon}
            color="#E67E22"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Số khách hàng thanh toán"
            value={summary ? summary.totalCustomers : '-'}
            change={0}
            icon={PeopleIcon}
            color="#4A90E2"
          />
        </Grid>
      </Grid>

      {/* Biểu đồ doanh thu theo ngày */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: '#2D3748', fontWeight: 600 }}
          >
            Doanh thu theo ngày
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => `${Number(value).toLocaleString()} VNĐ`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4A90E2"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bảng chi tiết giao dịch */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: '#2D3748', fontWeight: 600 }}
          >
            Danh sách giao dịch đã thanh toán
          </Typography>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã giao dịch</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Ngày thanh toán</TableCell>
                  <TableCell>Phương thức</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.paymentId} hover>
                    <TableCell>{t.paymentId}</TableCell>
                    <TableCell>{t.customerName || t.userId}</TableCell>
                    <TableCell>
                      {Number(t.amount).toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell>
                      {t.paidAt ? formatDateTime(t.paidAt) : '-'}
                    </TableCell>
                    <TableCell>{t.paymentMethod}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewUser(t)}
                      >
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog xem thông tin khách hàng */}
      <Dialog
        open={openUserDialog}
        onClose={handleCloseUserDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            minWidth: 340,
            boxShadow: 8,
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0 }}>
          Thông tin khách hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          {userLoading ? (
            <Typography>Đang tải...</Typography>
          ) : userError ? (
            <Typography color="error">{userError}</Typography>
          ) : selectedUser ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Avatar lớn nếu có */}
              {selectedUser.avatar && (
                <Avatar
                  src={selectedUser.avatar}
                  sx={{ width: 80, height: 80, mb: 1, boxShadow: 2 }}
                />
              )}
              <Box sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                <Typography sx={{ mb: 1 }}>
                  <b>Tên:</b>{' '}
                  <span style={{ fontWeight: 500 }}>
                    {selectedUser.fullName}
                  </span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Email:</b>{' '}
                  <span style={{ fontWeight: 500 }}>{selectedUser.email}</span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Số điện thoại:</b>{' '}
                  <span style={{ fontWeight: 500 }}>{selectedUser.phone}</span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Giới tính:</b>{' '}
                  <span style={{ fontWeight: 500 }}>{selectedUser.gender}</span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Ngày sinh:</b>{' '}
                  <span style={{ fontWeight: 500 }}>
                    {selectedUser.birthDay}
                  </span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Địa chỉ:</b>{' '}
                  <span style={{ fontWeight: 500 }}>
                    {selectedUser.address}
                  </span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Username:</b>{' '}
                  <span style={{ fontWeight: 500 }}>
                    {selectedUser.username}
                  </span>
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <b>Trạng thái:</b>{' '}
                  <span style={{ fontWeight: 500 }}>
                    {selectedUser.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </Typography>
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleCloseUserDialog}
            variant="contained"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            ĐÓNG
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsContent;

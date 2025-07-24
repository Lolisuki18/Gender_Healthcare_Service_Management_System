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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  TablePagination,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Lấy các giao dịch thuộc trang hiện tại
  const paginatedTransactions = React.useMemo(() => {
    const start = page * rowsPerPage;
    return transactions.slice(start, start + rowsPerPage);
  }, [transactions, page, rowsPerPage]);

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

  // Hàm xuất PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('BÁO CÁO DOANH THU', 14, 18);
    doc.setFontSize(12);
    doc.text(
      `Tổng doanh thu: ${summary ? Number(summary.totalRevenue).toLocaleString() + ' VNĐ' : '-'}`,
      14,
      30
    );
    doc.text(
      `Số giao dịch thành công: ${summary ? summary.totalTransactions : '-'}`,
      14,
      38
    );
    doc.text(
      `Doanh thu trung bình: ${summary ? Number(summary.averageRevenue).toLocaleString() + ' VNĐ' : '-'}`,
      14,
      46
    );
    doc.text(
      `Số khách hàng thanh toán: ${summary ? summary.totalCustomers : '-'}`,
      14,
      54
    );
    doc.autoTable({
      startY: 62,
      head: [
        ['Mã GD', 'Khách hàng', 'Số tiền', 'Ngày thanh toán', 'Phương thức'],
      ],
      body: transactions.map((t) => [
        t.paymentId,
        t.customerName || t.userId,
        Number(t.amount).toLocaleString() + ' VNĐ',
        t.paidAt ? formatDateTime(t.paidAt) : '-',
        t.paymentMethod,
      ]),
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [74, 144, 226] },
    });
    doc.save('bao_cao_doanh_thu.pdf');
  };

  // Hàm xuất Excel cho danh sách giao dịch
  const handleExportExcel = () => {
    // Chuẩn bị dữ liệu cho Excel
    const excelData = transactions.map((t, index) => ({
      STT: index + 1,
      'Mã giao dịch': t.paymentId || '',
      'Khách hàng': t.customerName || t.userId || '',
      'Số tiền (VNĐ)': Number(t.amount || 0),
      'Ngày thanh toán': t.paidAt ? formatDateTime(t.paidAt) : '',
      'Phương thức thanh toán': t.paymentMethod || '',
      'Trạng thái': 'Đã thanh toán',
    }));

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Điều chỉnh độ rộng cột
    const colWidths = [
      { wch: 5 }, // STT
      { wch: 15 }, // Mã giao dịch
      { wch: 20 }, // Khách hàng
      { wch: 15 }, // Số tiền
      { wch: 20 }, // Ngày thanh toán
      { wch: 20 }, // Phương thức
      { wch: 15 }, // Trạng thái
    ];
    ws['!cols'] = colWidths;

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách giao dịch');

    // Tạo tên file với ngày hiện tại
    const currentDate = new Date().toISOString().split('T')[0];
    const fileName = `danh_sach_giao_dich_${currentDate}.xlsx`;

    // Xuất file
    XLSX.writeFile(wb, fileName);
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
          {/* Nút xuất PDF */}
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleExportPDF}
          >
            Xuất PDF
          </Button>
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#4A5568', mb: 3, fontSize: '1rem' }}
        >
          Phân tích hiệu suất và doanh thu hệ thống
        </Typography>
        {/* Các nút tính doanh thu nhanh */}
        {/*
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
        */}
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              Danh sách giao dịch đã thanh toán
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={handleExportExcel}
              startIcon={<FileDownloadIcon />}
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
                fontWeight: 600,
              }}
            >
              Xuất Excel
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã giao dịch</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Ngày thanh toán</TableCell>
                  <TableCell>Phương thức</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((t) => (
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
            <TablePagination
              component="div"
              count={transactions.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Số dòng mỗi trang"
            />
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

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, ToggleButton, ToggleButtonGroup, TablePagination } from '@mui/material';
import { Box } from '@mui/system';
import pillReminderService from '../../services/pillReminderService';

const statusMap = {
  ACTIVE: { label: 'Đang hoạt động', chip: { bgcolor: '#e6f4ea', color: '#219653', border: '1.5px solid #27ae60' } },
  CANCELED: { label: 'Đã hủy', chip: { bgcolor: '#fdeaea', color: '#e74c3c', border: '1.5px solid #e74c3c' } },
};

const PillHistoryContent = () => {
  const [filter, setFilter] = useState('ALL');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await pillReminderService.getAllPillSchedules();
        // Assuming res.data is an array of schedules
        const schedules = res.data || res || [];
        // Map API data to table format
        const mapped = schedules.map((item) => {
          console.log('remindTime raw:', item.remindTime);
          return {
            id: item.id,
            createdAt: item.createdAt ? formatDateTime(item.createdAt, true) : '',
            startTime: item.startDate ? formatDateTime(item.startDate, true) : '',
            numberDaysOff: item.numberDaysOff,
            numberDaysDrinking: item.numberDaysDrinking,
            reminderTime: formatRemindTime(item.remindTime),
            active: item.active !== undefined ? item.active : item.isActive, // lấy đúng trường boolean
          };
        });
        setData(mapped);
      } catch (err) {
        setError('Không thể tải dữ liệu lịch sử uống thuốc');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc dữ liệu theo trạng thái
  const filteredData =
    filter === 'ALL'
      ? data
      : filter === 'ACTIVE'
      ? data.filter((item) => item.active)
      : data.filter((item) => !item.active);

  // Dữ liệu phân trang
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper to format date/time string
  function formatDateTime(dt, onlyDate = false) {
    if (!dt) return '';
    const d = new Date(dt);
    if (isNaN(d.getTime())) return dt;
    return onlyDate ? d.toLocaleDateString('vi-VN') : d.toLocaleString('vi-VN', { hour12: false });
  }

  // Helper to format remindTime (DB kiểu HH:mm:ss.0000000 hoặc số phút)
  function formatRemindTime(val) {
    if (!val) return '';
    // Nếu là mảng [giờ, phút]
    if (Array.isArray(val) && val.length >= 2) {
      return `${val[0].toString().padStart(2, '0')}:${val[1].toString().padStart(2, '0')}`;
    }
    // Nếu là dạng chuỗi HH:mm:ss.0000000 hoặc HH:mm:ss
    if (typeof val === 'string' && val.includes(':')) {
      const parts = val.split(':');
      if (parts.length >= 2 && Number(parts[0]) < 24 && Number(parts[1]) < 60) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      if (parts.length >= 2 && Number(parts[1]) < 24 && Number(parts[0]) < 60) {
        return `${parts[1].padStart(2, '0')}:${parts[0].padStart(2, '0')}`;
      }
    }
    // Nếu là số phút
    const minutes = parseInt(val, 10);
    if (isNaN(minutes)) return val;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  return (
    <>
      <Box sx={{ borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)', display: 'flex', alignItems: 'center', background: '#fff' }}>
        <Box sx={{ background: 'linear-gradient(to right, #44c0c9, #2aa4bc)', borderRadius: '50%', p: 1.5, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="none" />
            <path d="M12 7v5l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2"/>
          </svg>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#2D3748', marginRight: 8 }}>Lịch sử uống thuốc</span>
          </Box>
          <span style={{ color: '#4A5568', fontSize: 18 }}>Quản lý và theo dõi các lịch uống thuốc của bạn.</span>
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => val && setFilter(val)}
          sx={{
            borderRadius: 24,
            border: '2px solid #b3d4fc',
            background: '#f7fbfd',
            boxShadow: '0 2px 8px rgba(44,180,201,0.03)',
            overflow: 'hidden',
          }}
        >
          <ToggleButton value="ALL" sx={{
            border: 'none',
            borderRadius: 24,
            px: 1.5,
            py: 0.7,
            fontWeight: filter === 'ALL' ? 700 : 500,
            fontSize: 15,
            color: '#444',
            background: filter === 'ALL' ? '#eaf6fb' : 'transparent',
            boxShadow: 'none',
            '&.Mui-selected': {
              background: '#eaf6fb',
              color: '#1976d2',
              fontWeight: 700,
            },
            '&:hover': { background: '#f0f7ff' },
          }}>TẤT CẢ</ToggleButton>
          <ToggleButton value="ACTIVE" sx={{
            border: 'none',
            borderRadius: 24,
            px: 1.5,
            py: 0.7,
            fontWeight: filter === 'ACTIVE' ? 700 : 500,
            fontSize: 15,
            color: '#444',
            background: filter === 'ACTIVE' ? '#eaf6fb' : 'transparent',
            boxShadow: 'none',
            '&.Mui-selected': {
              background: '#eaf6fb',
              color: '#1976d2',
              fontWeight: 700,
            },
            '&:hover': { background: '#f0f7ff' },
          }}>ĐANG HOẠT ĐỘNG</ToggleButton>
          <ToggleButton value="CANCELED" sx={{
            border: 'none',
            borderRadius: 24,
            px: 1.5,
            py: 0.7,
            fontWeight: filter === 'CANCELED' ? 700 : 500,
            fontSize: 15,
            color: '#444',
            background: filter === 'CANCELED' ? '#eaf6fb' : 'transparent',
            boxShadow: 'none',
            '&.Mui-selected': {
              background: '#eaf6fb',
              color: '#1976d2',
              fontWeight: 700,
            },
            '&:hover': { background: '#f0f7ff' },
          }}>ĐÃ HỦY</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {loading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>Đang tải dữ liệu...</Box>
      ) : error ? (
        <Box sx={{ p: 4, color: 'red', textAlign: 'center' }}>{error}</Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(44, 180, 201, 0.08)' }}>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>Ngày bắt đầu</TableCell>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>Số ngày nghỉ</TableCell>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>Số ngày uống</TableCell>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>Thời gian nhắc nhở</TableCell>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} sx={{ borderRadius: 3 }}>
                    <TableCell align="center">{row.startTime}</TableCell>
                    <TableCell align="center">{row.numberDaysOff}</TableCell>
                    <TableCell align="center">{row.numberDaysDrinking}</TableCell>
                    <TableCell align="center">{row.reminderTime}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.active ? 'Đang hoạt động' : 'Đã hủy'}
                        sx={{
                          fontWeight: 600,
                          fontSize: 13,
                          bgcolor: row.active ? '#e6f4ea' : '#fdeaea',
                          color: row.active ? '#219653' : '#e74c3c',
                          border: row.active ? '1.5px solid #27ae60' : '1.5px solid #e74c3c',
                          px: 0.8,
                          py: 0.1,
                          height: 28,
                          borderRadius: 999,
                        }}
                        icon={
                          <span
                            style={{
                              display: 'inline-block',
                              width: 12,
                              height: 12,
                              background: row.active ? '#27ae60' : '#e74c3c',
                              borderRadius: '50%',
                            }}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage=""
            sx={{ border: 'none', background: '#fff', borderRadius: 3, mt: 1, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.00)' }}
          />
        </>
      )}
    </>
  );
};

export default PillHistoryContent;
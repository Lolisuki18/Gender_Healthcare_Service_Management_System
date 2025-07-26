import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  CircularProgress,
} from '@mui/material';
import { adminService } from '@/services/adminService';

const columns = [
  { id: 'ratingId', label: 'ID', minWidth: 60, align: 'center' },
  { id: 'userFullName', label: 'Người đánh giá', minWidth: 140 },
  { id: 'targetName', label: 'Đối tượng', minWidth: 140 },
  { id: 'targetType', label: 'Loại', minWidth: 110, align: 'center' },
  { id: 'rating', label: 'Điểm', minWidth: 60, align: 'center' },
  { id: 'comment', label: 'Nội dung', minWidth: 260 },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 140, align: 'center' },
];

const targetTypeMap = {
  CONSULTANT: 'Tư vấn viên',
  STI_SERVICE: 'Dịch vụ STI',
  STI_PACKAGE: 'Gói STI',
};

function formatDate(arr) {
  if (!Array.isArray(arr) || arr.length < 6) return '-';
  // arr: [year, month, day, hour, min, sec, ...]
  const [y, m, d, h, min, s] = arr;
  return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y} ${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

const AdminRatingManagementContent = () => {
  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      // Gọi API qua service
      const res = await adminService.getAllRatings({ page, size: rowsPerPage });
      if (res && res.success) {
        setRatings(res.data.content || []);
        setTotal(res.data.totalElements || 0);
      }
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Quản lý đánh giá hệ thống
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'auto' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || 'left'}
                      style={{
                        minWidth: col.minWidth,
                        fontWeight: 700,
                        background: '#f7fbff',
                        borderBottom: '2px solid #e3eaf2',
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ratings.map((row) => (
                  <TableRow
                    hover
                    key={row.ratingId}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f9fcff' },
                    }}
                  >
                    <TableCell align="center">{row.ratingId}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {/* Avatar nếu có */}
                        {/* {row.userAvatar && <Avatar src={row.userAvatar} sx={{ width: 28, height: 28 }} />} */}
                        <Typography fontWeight={600}>
                          {row.userFullName || row.maskedUserName || 'Ẩn danh'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {row.targetName || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={targetTypeMap[row.targetType] || row.targetType}
                        size="small"
                        color={
                          row.targetType === 'CONSULTANT'
                            ? 'primary'
                            : row.targetType === 'STI_SERVICE'
                              ? 'success'
                              : 'info'
                        }
                        sx={{ fontWeight: 600, fontSize: 13 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          minWidth: 32,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          background: 'linear-gradient(90deg,#e3f2fd,#b2ebf2)',
                          fontWeight: 700,
                          color: '#1976d2',
                          fontSize: 16,
                        }}
                      >
                        {row.rating}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 350,
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-line', fontSize: 15 }}
                        >
                          {row.comment}
                        </Typography>
                        {row.staffReply && (
                          <Box
                            mt={1}
                            p={1.2}
                            bgcolor="#e3f2fd"
                            borderRadius={1}
                            borderLeft="4px solid #1976d2"
                            boxShadow="0 1px 4px 0 #b3c6e0"
                          >
                            <Typography
                              variant="caption"
                              color="primary"
                              fontWeight={700}
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Phản hồi từ nhân viên
                              {row.repliedByName
                                ? `: ${row.repliedByName}`
                                : ''}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: 'pre-line', fontSize: 14 }}
                            >
                              {row.staffReply}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(row.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AdminRatingManagementContent;

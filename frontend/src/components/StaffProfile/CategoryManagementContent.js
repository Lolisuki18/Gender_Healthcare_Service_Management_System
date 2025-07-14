import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, LocalHospital } from '@mui/icons-material';
import categoriesService from '@/services/categoryService';

// Component để xử lý text wrapping
const WrappedTextCell = ({ children, maxWidth = 200 }) => (
  <TableCell
    sx={{
      maxWidth,
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      verticalAlign: 'top',
      padding: '12px 16px',
    }}
  >
    {children}
  </TableCell>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const initialCategory = { name: '', description: '' };

const CategoryManagementContent = () => {
  const [tab, setTab] = useState(0);
  // Blog category state
  const [blogCategories, setBlogCategories] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  // Question category state
  const [questionCategories, setQuestionCategories] = useState([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('add'); // add | edit
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [editId, setEditId] = useState(null);
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive

  // Fetch blog categories
  const fetchBlogCategories = async () => {
    setLoadingBlog(true);
    try {
      const data = await categoriesService.getCategories();
      setBlogCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setSnackbar({
        open: true,
        message: 'Lỗi tải danh mục blog',
        severity: 'error',
      });
    } finally {
      setLoadingBlog(false);
    }
  };
  // Fetch question categories
  const fetchQuestionCategories = async () => {
    setLoadingQuestion(true);
    try {
      const data = await categoriesService.getQuestionCategories();
      setQuestionCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setSnackbar({
        open: true,
        message: 'Lỗi tải danh mục câu hỏi',
        severity: 'error',
      });
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchBlogCategories();
    fetchQuestionCategories();
  }, []);

  // Dialog handlers
  const handleOpenDialog = (type, category = initialCategory, id = null) => {
    setDialogType(type);
    setCurrentCategory(category);
    setEditId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(initialCategory);
    setEditId(null);
  };

  // Add/Edit/Delete handlers
  const handleSaveCategory = async () => {
    if (tab === 0) {
      // Blog
      try {
        if (dialogType === 'add') {
          await categoriesService.createCategory(currentCategory);
          setSnackbar({
            open: true,
            message: 'Thêm danh mục blog thành công',
            severity: 'success',
          });
        } else {
          await categoriesService.updateCategory(editId, currentCategory);
          setSnackbar({
            open: true,
            message: 'Cập nhật danh mục blog thành công',
            severity: 'success',
          });
        }
        fetchBlogCategories();
        handleCloseDialog();
      } catch (e) {
        setSnackbar({
          open: true,
          message: 'Lỗi thao tác danh mục blog',
          severity: 'error',
        });
      }
    } else {
      // Question
      try {
        if (dialogType === 'add') {
          await categoriesService.createQuestionCategory(currentCategory);
          setSnackbar({
            open: true,
            message: 'Thêm danh mục câu hỏi thành công',
            severity: 'success',
          });
        } else {
          await categoriesService.updateQuestionCategory(
            editId,
            currentCategory
          );
          setSnackbar({
            open: true,
            message: 'Cập nhật danh mục câu hỏi thành công',
            severity: 'success',
          });
        }
        fetchQuestionCategories();
        handleCloseDialog();
      } catch (e) {
        setSnackbar({
          open: true,
          message: 'Lỗi thao tác danh mục câu hỏi',
          severity: 'error',
        });
      }
    }
  };
  const handleDeleteCategory = async (id) => {
    if (tab === 0) {
      try {
        await categoriesService.deleteCategory(id);
        setSnackbar({
          open: true,
          message: 'Xóa danh mục blog thành công',
          severity: 'success',
        });
        fetchBlogCategories();
      } catch (e) {
        setSnackbar({
          open: true,
          message: 'Lỗi xóa danh mục blog',
          severity: 'error',
        });
      }
    } else {
      try {
        await categoriesService.deleteQuestionCategory(id);
        setSnackbar({
          open: true,
          message: 'Xóa danh mục câu hỏi thành công',
          severity: 'success',
        });
        fetchQuestionCategories();
      } catch (e) {
        setSnackbar({
          open: true,
          message: 'Lỗi xóa danh mục câu hỏi',
          severity: 'error',
        });
      }
    }
  };

  // Filtered data
  const getFilteredCategories = (categories, isQuestion = false) => {
    if (statusFilter === 'all') return categories;
    if (isQuestion) {
      return categories.filter((cat) =>
        statusFilter === 'active' ? cat.isActive : !cat.isActive
      );
    }
    return categories.filter((cat) =>
      statusFilter === 'active' ? cat.isActive : !cat.isActive
    );
  };

  // UI
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        maxWidth: 900,
        mx: 'auto',
        background: 'linear-gradient(135deg, #e3f6fd 0%, #f8fdff 100%)',
        borderRadius: 5,
        boxShadow: 6,
        minHeight: '80vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <LocalHospital sx={{ color: '#00bcd4', fontSize: 36, mr: 1 }} />
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          sx={{ color: '#2196f3', letterSpacing: 1 }}
        >
          Quản lý danh mục
        </Typography>
      </Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered
        sx={{
          mb: 2,
          '.MuiTab-root': {
            fontWeight: 700,
            fontSize: { xs: 15, sm: 17 },
            color: '#2196f3',
            borderRadius: 3,
            transition: 'background 0.2s',
            '&.Mui-selected': {
              background: '#e0f7fa',
              color: '#00bcd4',
              boxShadow: 2,
            },
            mx: 1,
            px: 3,
          },
          '.MuiTabs-indicator': {
            height: 5,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #00bcd4 0%, #2196f3 100%)',
          },
        }}
      >
        <Tab label="Danh mục Blog" />
        <Tab label="Danh mục Câu hỏi" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              boxShadow: 3,
              background: 'linear-gradient(90deg, #00bcd4 0%, #2196f3 100%)',
              color: '#fff',
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #2196f3 0%, #00bcd4 100%)',
                boxShadow: 6,
              },
            }}
          >
            Thêm danh mục
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 4, boxShadow: 6, background: '#fff' }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    'linear-gradient(90deg, #e0f7fa 0%, #e3f6fd 100%)',
                }}
              >
                <TableCell
                  sx={{ fontWeight: 800, color: '#00bcd4', fontSize: 16 }}
                >
                  Tên danh mục
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: '#00bcd4',
                    fontSize: 16,
                    maxWidth: 200,
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  Mô tả
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 800, color: '#00bcd4', fontSize: 16 }}
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, color: '#00bcd4', fontSize: 16 }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredCategories(blogCategories).map((cat) => (
                <TableRow
                  key={cat.categoryId}
                  hover
                  sx={{
                    transition: 'background 0.2s',
                    ':hover': { background: '#e0f7fa' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                  <WrappedTextCell>{cat.description}</WrappedTextCell>
                  <TableCell>
                    {cat.isActive ? (
                      <Chip
                        label="Đang hoạt động"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    ) : (
                      <Chip
                        label="Ngừng hoạt động"
                        color="default"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background: '#eee',
                          color: '#888',
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa">
                      <IconButton
                        onClick={() =>
                          handleOpenDialog(
                            'edit',
                            {
                              name: cat.name,
                              description: cat.description,
                              isActive: cat.isActive,
                            },
                            cat.categoryId
                          )
                        }
                        sx={{
                          color: '#2196f3',
                          background: '#e3f6fd',
                          borderRadius: 2,
                          mx: 0.5,
                          '&:hover': {
                            background: '#b2ebf2',
                            color: '#00bcd4',
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        onClick={() => handleDeleteCategory(cat.categoryId)}
                        sx={{
                          color: '#fff',
                          background: '#f44336',
                          borderRadius: 2,
                          mx: 0.5,
                          '&:hover': { background: '#d32f2f' },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              boxShadow: 3,
              background: 'linear-gradient(90deg, #00bcd4 0%, #2196f3 100%)',
              color: '#fff',
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #2196f3 0%, #00bcd4 100%)',
                boxShadow: 6,
              },
            }}
          >
            Thêm danh mục
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 4, boxShadow: 6, background: '#fff' }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    'linear-gradient(90deg, #e0f7fa 0%, #e3f6fd 100%)',
                }}
              >
                <TableCell
                  sx={{ fontWeight: 800, color: '#00bcd4', fontSize: 16 }}
                >
                  Tên danh mục
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: '#00bcd4',
                    fontSize: 16,
                    maxWidth: 200,
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  Mô tả
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 800, color: '#00bcd4', fontSize: 16 }}
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, color: '#00bcd4', fontSize: 16 }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredCategories(questionCategories, true).map((cat) => (
                <TableRow
                  key={cat.categoryQuestionId}
                  hover
                  sx={{
                    transition: 'background 0.2s',
                    ':hover': { background: '#e0f7fa' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                  <WrappedTextCell>{cat.description}</WrappedTextCell>
                  <TableCell>
                    {cat.isActive ? (
                      <Chip
                        label="Đang hoạt động"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    ) : (
                      <Chip
                        label="Ngừng hoạt động"
                        color="default"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background: '#eee',
                          color: '#888',
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa">
                      <IconButton
                        onClick={() =>
                          handleOpenDialog(
                            'edit',
                            {
                              name: cat.name,
                              description: cat.description,
                              isActive: cat.isActive,
                            },
                            cat.categoryQuestionId
                          )
                        }
                        sx={{
                          color: '#2196f3',
                          background: '#e3f6fd',
                          borderRadius: 2,
                          mx: 0.5,
                          '&:hover': {
                            background: '#b2ebf2',
                            color: '#00bcd4',
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        onClick={() =>
                          handleDeleteCategory(cat.categoryQuestionId)
                        }
                        sx={{
                          color: '#fff',
                          background: '#f44336',
                          borderRadius: 2,
                          mx: 0.5,
                          '&:hover': { background: '#d32f2f' },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      {/* Dialog thêm/sửa */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 8,
            background: '#f8fdff',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            textAlign: 'center',
            color: '#2196f3',
            letterSpacing: 1,
          }}
        >
          {dialogType === 'add' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            label="Tên danh mục"
            value={currentCategory.name}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, name: e.target.value })
            }
            fullWidth
            margin="normal"
            sx={{ mb: 2, borderRadius: 2, background: '#fff' }}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            label="Mô tả"
            value={currentCategory.description}
            onChange={(e) =>
              setCurrentCategory({
                ...currentCategory,
                description: e.target.value,
              })
            }
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            sx={{ mb: 1, borderRadius: 2, background: '#fff' }}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          {dialogType === 'edit' && (
            <FormControlLabel
              control={
                <Switch
                  checked={currentCategory.isActive ?? true}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      isActive: e.target.checked,
                    })
                  }
                  color="success"
                />
              }
              label={
                currentCategory.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
              }
              sx={{ mt: 1, ml: 0 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ borderRadius: 3, color: '#2196f3', fontWeight: 700 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            disabled={!currentCategory.name.trim()}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #00bcd4 0%, #2196f3 100%)',
              color: '#fff',
              px: 4,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #2196f3 0%, #00bcd4 100%)',
                boxShadow: 6,
              },
            }}
          >
            {dialogType === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagementContent;

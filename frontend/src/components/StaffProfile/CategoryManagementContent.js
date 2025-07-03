import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import blogService from "@/services/blogService";
import stiService from "@/services/stiService";

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

const initialCategory = { name: "", description: "" };

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
  const [dialogType, setDialogType] = useState("add"); // add | edit
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [editId, setEditId] = useState(null);
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch blog categories
  const fetchBlogCategories = async () => {
    setLoadingBlog(true);
    try {
      const data = await blogService.getCategories();
      setBlogCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setSnackbar({ open: true, message: "Lỗi tải danh mục blog", severity: "error" });
    } finally {
      setLoadingBlog(false);
    }
  };
  // Fetch question categories
  const fetchQuestionCategories = async () => {
    setLoadingQuestion(true);
    try {
      const data = await stiService.getQuestionCategories();
      setQuestionCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setSnackbar({ open: true, message: "Lỗi tải danh mục câu hỏi", severity: "error" });
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
        if (dialogType === "add") {
          await blogService.createCategory(currentCategory);
          setSnackbar({ open: true, message: "Thêm danh mục blog thành công", severity: "success" });
        } else {
          await blogService.updateCategory(editId, currentCategory);
          setSnackbar({ open: true, message: "Cập nhật danh mục blog thành công", severity: "success" });
        }
        fetchBlogCategories();
        handleCloseDialog();
      } catch (e) {
        setSnackbar({ open: true, message: "Lỗi thao tác danh mục blog", severity: "error" });
      }
    } else {
      // Question
      try {
        if (dialogType === "add") {
          await stiService.createQuestionCategory(currentCategory);
          setSnackbar({ open: true, message: "Thêm danh mục câu hỏi thành công", severity: "success" });
        } else {
          await stiService.updateQuestionCategory(editId, currentCategory);
          setSnackbar({ open: true, message: "Cập nhật danh mục câu hỏi thành công", severity: "success" });
        }
        fetchQuestionCategories();
        handleCloseDialog();
      } catch (e) {
        setSnackbar({ open: true, message: "Lỗi thao tác danh mục câu hỏi", severity: "error" });
      }
    }
  };
  const handleDeleteCategory = async (id) => {
    if (tab === 0) {
      try {
        await blogService.deleteCategory(id);
        setSnackbar({ open: true, message: "Xóa danh mục blog thành công", severity: "success" });
        fetchBlogCategories();
      } catch (e) {
        setSnackbar({ open: true, message: "Lỗi xóa danh mục blog", severity: "error" });
      }
    } else {
      try {
        await stiService.deleteQuestionCategory(id);
        setSnackbar({ open: true, message: "Xóa danh mục câu hỏi thành công", severity: "success" });
        fetchQuestionCategories();
      } catch (e) {
        setSnackbar({ open: true, message: "Lỗi xóa danh mục câu hỏi", severity: "error" });
      }
    }
  };

  // UI
  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Danh mục Blog" />
        <Tab label="Danh mục Câu hỏi" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("add")}>Thêm danh mục</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogCategories.map((cat) => (
                <TableRow key={cat.categoryId}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa">
                      <IconButton onClick={() => handleOpenDialog("edit", { name: cat.name, description: cat.description }, cat.categoryId)}><Edit /></IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDeleteCategory(cat.categoryId)}><Delete /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog("add")}>Thêm danh mục</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionCategories.map((cat) => (
                <TableRow key={cat.categoryQuestionId}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa">
                      <IconButton onClick={() => handleOpenDialog("edit", { name: cat.name, description: cat.description }, cat.categoryQuestionId)}><Edit /></IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDeleteCategory(cat.categoryQuestionId)}><Delete /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      {/* Dialog thêm/sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{dialogType === "add" ? "Thêm danh mục" : "Chỉnh sửa danh mục"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            value={currentCategory.description}
            onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveCategory} disabled={!currentCategory.name.trim()}>
            {dialogType === "add" ? "Thêm" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagementContent; 